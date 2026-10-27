import { z } from 'zod';
const time = z.string().datetime({ offset: true });
const payment = z.object({
  kind:z.enum(['paid','renewed']), plan:z.enum(['monthly','yearly']),
  amountMinor:z.number().int().positive().max(1000000000000), currency:z.literal('USD'),
  invoiceId:z.string().regex(/^in_[A-Za-z0-9_]{1,120}$/),
  occurredAt:time, periodStart:time.nullable(), periodEnd:time.nullable(),
  accountRef:z.string().regex(/^[a-f0-9]{12}$/),
}).strict().refine((v) => !v.periodStart || !v.periodEnd || Date.parse(v.periodEnd)>Date.parse(v.periodStart));
export type PaymentNotification = z.infer<typeof payment>;
export function feishuPaymentMessage(value: PaymentNotification) {
  const p=payment.parse(value);
  const format=(v:string|null) => v ? new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(v))+'（北京时间）' : '未记录';
  const amount=new Intl.NumberFormat('zh-CN',{style:'currency',currency:p.currency,minimumFractionDigits:2}).format(p.amountMinor/100);
  return {msg_type:'text' as const,content:{text:[
    `IOTA Watch · ${p.kind==='paid'?'付款成功':'续费成功'}`,
    '渠道：官网 · Stripe', `方案：Pro ${p.plan==='monthly'?'月会员':'年会员'}`,
    `订阅周期：${p.plan==='monthly'?'1个月':'1年'}`, `订阅开始：${format(p.periodStart)}`,
    `订阅结束（本次账期）：${format(p.periodEnd)}`, `金额：${amount}`,
    '邮箱：未记录', '最近登录IP：未记录', '国家/地区：未记录',
    `用户标识：${p.accountRef}`, `订单：${p.invoiceId}`, `北京时间：${format(p.occurredAt)}`,
  ].join('\n')}};
}
