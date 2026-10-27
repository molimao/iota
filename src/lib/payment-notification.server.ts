import { createHash, createHmac } from 'node:crypto';
import { z } from 'zod';
import type Stripe from 'stripe';
import type { Json } from '@/integrations/supabase/types';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { watchDb } from './watch-db';
import { subscriptionSnapshot, type BillingConfig } from './billing-policy';
import { feishuPaymentMessage, type PaymentNotification } from './feishu-payment-format';

const objectId = (value: unknown): string | null => typeof value === 'string' ? value : value && typeof value === 'object' && 'id' in value && typeof value.id === 'string' ? value.id : null;
const date = (n: unknown) => typeof n === 'number' && Number.isSafeInteger(n) && n > 0 ? new Date(n * 1000).toISOString() : null;

// The caller must already have verified the raw Stripe webhook signature.
export function paymentFromVerifiedEvent(event: Stripe.Event, subscription: Stripe.Subscription, config: BillingConfig, startAt: string): PaymentNotification | null {
  const since = Date.parse(startAt);
  if (!Number.isFinite(since)) throw new Error('payment_notification_start_invalid');
  if (config.mode !== 'live' || !event.livemode || event.type !== 'invoice.paid' || event.created * 1000 < since) return null;
  const invoice = event.data.object as Stripe.Invoice;
  if (invoice.object !== 'invoice' || !invoice.livemode || invoice.status !== 'paid' || !Number.isSafeInteger(invoice.amount_paid) || invoice.amount_paid <= 0 || invoice.currency !== 'usd') return null;
  if (!['subscription_create', 'subscription_cycle'].includes(invoice.billing_reason ?? '')) return null;
  const owner = subscriptionSnapshot(subscription, config);
  const invoiceSubscription = objectId(invoice.parent?.subscription_details?.subscription) ?? objectId((invoice as unknown as {subscription?: unknown}).subscription);
  if (invoiceSubscription !== owner.subscription || objectId(invoice.customer) !== owner.customer) return null;
  const interval = subscription.items.data[0]?.price.recurring?.interval;
  if (interval !== 'month' && interval !== 'year') return null;
  const paidAt = date(invoice.status_transitions?.paid_at);
  if (!paidAt || Date.parse(paidAt) < since) return null;
  const line = invoice.lines?.data?.find((l) => objectId(l.parent?.subscription_item_details?.subscription) === owner.subscription);
  const periodStart = date(line?.period?.start);
  const periodEnd = date(line?.period?.end);
  return {
    kind: invoice.billing_reason === 'subscription_cycle' ? 'renewed' : 'paid',
    plan: interval === 'month' ? 'monthly' : 'yearly',
    amountMinor: invoice.amount_paid, currency: 'USD', invoiceId: invoice.id,
    occurredAt: paidAt, periodStart, periodEnd,
    accountRef: createHash('sha256').update('iota-watch-notify:' + owner.user.toLowerCase()).digest('hex').slice(0,12),
  };
}
export async function enqueuePaymentNotification(value: PaymentNotification) {
  const result = await watchDb(supabaseAdmin).rpc('watch_payment_notification_enqueue', { p_invoice: value.invoiceId, p_payload: value as unknown as Json });
  if (result.error) throw new Error('payment_notification_enqueue_failed');
}
const job = z.object({ invoiceId: z.string(), payload: z.unknown(), lease: z.string().uuid() });
export async function processPaymentNotifications(env: Record<string,string|undefined> = process.env) {
  if (env['FEISHU_PAYMENT_NOTIFICATIONS_ENABLED'] !== 'true') return { processed: 0 };
  const webhook = env['FEISHU_PAYMENT_WEBHOOK'];
  let url: URL;
  try { url = new URL(webhook ?? ''); } catch { throw new Error('payment_notification_config_invalid'); }
  if (url.origin !== 'https://open.feishu.cn' || !/^\/open-apis\/bot\/v2\/hook\/[0-9a-f-]{36}$/.test(url.pathname) || url.search || url.hash || url.username || url.password) throw new Error('payment_notification_config_invalid');
  const secret = env['FEISHU_PAYMENT_SIGNING_SECRET'];
  const keyword = env['FEISHU_PAYMENT_KEYWORD'];
  if (secret && (secret.length < 16 || secret.length > 256) || keyword && (keyword.length > 40 || /[\r\n]/.test(keyword))) throw new Error('payment_notification_config_invalid');
  const db = watchDb(supabaseAdmin);
  let processed = 0;
  for (let i=0; i<3; i++) {
    const result = await db.rpc('watch_payment_notification_worker', { p_action:'claim' });
    if (result.error) throw new Error('payment_notification_claim_failed');
    if (!result.data) break;
    const item = job.parse(result.data);
    let delivered = false;
    try {
      const body = feishuPaymentMessage(item.payload as PaymentNotification);
      if (keyword) body.content.text = keyword + '\n' + body.content.text;
      const timestamp = Math.floor(Date.now()/1000).toString();
      const signed = secret ? { timestamp, sign:createHmac('sha256', timestamp+'\n'+secret).update('').digest('base64') } : {};
      const response = await fetch(url, { method:'POST', redirect:'manual', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...body,...signed}), signal:AbortSignal.timeout(8000) });
      if (response.status >= 300 && response.status < 400) throw new Error('redirect');
      const text = await response.text();
      if (!response.ok || text.length > 8192 || JSON.parse(text)?.code !== 0) throw new Error('delivery');
      delivered = true;
    } catch { /* Retried by the durable queue. */ }
    const done = await db.rpc('watch_payment_notification_worker', { p_action:delivered?'sent':'retry', p_invoice:item.invoiceId, p_lease:item.lease });
    if (done.error || done.data !== true) throw new Error('payment_notification_lease_lost');
    processed++;
  }
  return { processed };
}
