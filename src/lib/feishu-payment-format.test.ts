import { describe, expect, it } from 'vitest';
import { feishuPaymentMessage, type PaymentNotification } from './feishu-payment-format';
const payment:PaymentNotification={kind:'paid',plan:'yearly',amountMinor:1699,currency:'USD',invoiceId:'in_test123',occurredAt:'2026-10-27T02:14:14.000Z',periodStart:'2026-10-27T02:14:14.000Z',periodEnd:'2027-10-27T02:14:14.000Z',accountRef:'abcdef123456'};
describe('payment group message',()=>{
 it('shows annual payment and Beijing time without personal details',()=>{const m=feishuPaymentMessage(payment);expect(m.msg_type).toBe('text');expect(m.content.text).toContain('付款成功');expect(m.content.text).toContain('US$16.99');expect(m.content.text).toContain('2026/10/27 10:14:14');expect(m.content.text).toContain('1年');expect(m.content.text).not.toContain('@');});
 it('distinguishes monthly renewal',()=>{const m=feishuPaymentMessage({...payment,kind:'renewed',plan:'monthly',amountMinor:299});expect(m.content.text).toContain('续费成功');expect(m.content.text).toContain('US$2.99');expect(m.content.text).toContain('1个月');});
 it('rejects invalid amounts, times and extra private fields',()=>{expect(()=>feishuPaymentMessage({...payment,amountMinor:0})).toThrow();expect(()=>feishuPaymentMessage({...payment,occurredAt:'invalid'})).toThrow();expect(()=>feishuPaymentMessage({...payment,email:'x@example.com'} as PaymentNotification)).toThrow();});
});
