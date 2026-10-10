import { z } from "zod";
import type { renderDailyReport } from "./daily-report-email";
export type ReportEmail = ReturnType<typeof renderDailyReport>;
export type ReportEmailConfig = { key: string; from: string };
export function reportEmailConfig(
  env: Record<string, string | undefined>,
): ReportEmailConfig | null {
  if (env["DAILY_REPORTS_ENABLED"] !== "true" || !env["RESEND_API_KEY"]?.startsWith("re_"))
    return null;
  const from = env["DAILY_REPORTS_FROM"];
  if (!from || !z.string().email().max(254).safeParse(from).success || /[\r\n]/.test(from))
    return null;
  if (!/@([a-z0-9-]+\.)*iotahome\.site$/i.test(from)) return null;
  return { key: env["RESEND_API_KEY"], from };
}
export class ReportDeliveryError extends Error {
  constructor(
    readonly code: string,
    readonly retryable: boolean,
    readonly retryAfterSeconds = 60,
  ) {
    super(code);
  }
}
/** Dedicated digest-capable provider. Tests inject fetch; no SDK or client key. */
export async function sendReportEmail(
  config: ReportEmailConfig,
  to: string,
  email: ReportEmail,
  key: string,
  unsubscribeUrl: string,
  fetcher: typeof fetch = fetch,
) {
  if (!z.string().email().max(254).safeParse(to).success || /[\r\n]/.test(to))
    throw new ReportDeliveryError("invalid_recipient", false);
  let r: Response;
  try {
    r = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": key,
      },
      body: JSON.stringify({
        from: `IOTA Watch <${config.from}>`,
        to: [to],
        ...email,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new ReportDeliveryError("email_transport_unavailable", true);
  }
  if (!r.ok) {
    const retry = Number(r.headers.get("retry-after"));
    throw new ReportDeliveryError(
      r.status === 429 ? "email_rate_limited" : "email_service_rejected",
      r.status === 429 || r.status >= 500,
      Number.isFinite(retry) && retry > 0 ? Math.min(retry, 3600) : 60,
    );
  }
  const data = (await r.json().catch(() => null)) as { id?: unknown } | null;
  if (!data || typeof data.id !== "string" || data.id.length > 100)
    throw new ReportDeliveryError("email_receipt_unavailable", true);
  return data.id;
}
