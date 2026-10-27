import { describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';
vi.mock('@/integrations/supabase/client.server', () => ({ supabaseAdmin: {} }));
const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('./watch-db', () => ({ watchDb: () => ({ rpc }) }));
import { paymentFromVerifiedEvent, processPaymentNotifications } from './payment-notification.server';
import type { BillingConfig } from './billing-policy';
const config: BillingConfig = {mode:'live',secret:'',webhookSecret:'',account:'',monthPrice:'price_m',yearPrice:'price_y',portal:'',origin:''};
const subscription = {id:'sub_1',livemode:true,customer:'cus_1',metadata:{product:'iota_watch_pro',user_id:'11111111-1111-4111-8111-111111111111'},items:{data:[{quantity:1,price:{id:'price_m',recurring:{interval:'month'}},current_period_end:1800000000}]},status:'active',cancel_at_period_end:false} as unknown as Stripe.Subscription;
function event(invoiceChanges: Record<string,unknown> = {}, eventChanges: Record<string,unknown> = {}): Stripe.Event {
  return {type:'invoice.paid',livemode:true,created:1790000000,data:{object:{id:'in_1',object:'invoice',livemode:true,status:'paid',amount_paid:299,currency:'usd',billing_reason:'subscription_create',customer:'cus_1',parent:{subscription_details:{subscription:'sub_1'}},status_transitions:{paid_at:1790000000},lines:{data:[{parent:{subscription_item_details:{subscription:'sub_1'}},period:{start:1790000000,end:1800000000}}]},...invoiceChanges}},...eventChanges} as unknown as Stripe.Event;
}
const classify = (e: Stripe.Event) => paymentFromVerifiedEvent(e, subscription, config, '2026-01-01T00:00:00Z');
describe('Stripe payment notifications', () => {
 it('accepts a paid subscription invoice and retains its real period', () => { const p=classify(event()); expect(p).toMatchObject({kind:'paid',plan:'monthly',amountMinor:299,invoiceId:'in_1',periodStart:'2026-09-21T14:13:20.000Z'}); expect(p?.accountRef).toMatch(/^[0-9a-f]{12}$/); });
 it('distinguishes renewals from initial payments', () => { expect(classify(event({billing_reason:'subscription_cycle'}))?.kind).toBe('renewed'); });
 it('ignores test, zero-cost, unpaid, unrelated and pre-activation events', () => {
  for(const e of [event({}, {livemode:false}),event({amount_paid:0}),event({status:'open'}),event({customer:'cus_other'}),event({parent:{subscription_details:{subscription:'sub_other'}}}),event({billing_reason:'manual'}),event({}, {type:'customer.subscription.created'}),event({}, {created:1700000000})]) expect(classify(e)).toBeNull();
 });
 it('does not notify on an old paid invoice redelivered after activation', () => { expect(classify(event({status_transitions:{paid_at:1700000000}}))).toBeNull(); });
});
it('sends a queued payment and retries a failed delivery without exposing personal data', async () => {
 const payment=classify(event())!;
 const queued={invoiceId:'in_1',payload:payment,lease:'11111111-1111-4111-8111-111111111111'};
 const env={FEISHU_PAYMENT_NOTIFICATIONS_ENABLED:'true',FEISHU_PAYMENT_WEBHOOK:'https://open.feishu.cn/open-apis/bot/v2/hook/11111111-1111-4111-8111-111111111111'};
 rpc.mockReset();rpc.mockResolvedValueOnce({data:queued}).mockResolvedValueOnce({data:true}).mockResolvedValueOnce({data:null});
 const mock=vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(new Response('{"code":0}',{status:200}));
 await expect(processPaymentNotifications(env)).resolves.toEqual({processed:1});
 expect(rpc).toHaveBeenCalledWith('watch_payment_notification_worker',expect.objectContaining({p_action:'sent'}));
 expect(String(mock.mock.calls[0]?.[1]?.body)).not.toContain('@');
 rpc.mockReset();rpc.mockResolvedValueOnce({data:queued}).mockResolvedValueOnce({data:true}).mockResolvedValueOnce({data:null});
 mock.mockRejectedValueOnce(new Error('network down'));
 await processPaymentNotifications(env);
 expect(rpc).toHaveBeenCalledWith('watch_payment_notification_worker',expect.objectContaining({p_action:'retry'}));
 mock.mockRestore();
});
