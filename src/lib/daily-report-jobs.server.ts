import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticateReportCron } from "./daily-report-cron-auth.server";
import { watchDb } from "./watch-db";
import { PROJECT_IDS, PROJECTS } from "./projects";
import { ORIGIN, LOCALES } from "./site";
import { mapConcurrent } from "./concurrent";
import {
  aggregateDailyReport,
  applyMarketUsd,
  reportBindingNeedsNetwork,
  reportDayWindow,
  yesterdayReportWindow,
  type ReportReading,
} from "./daily-report";
import { collectEmailReportBinding } from "./daily-report-collect.server";
import { renderDailyReport } from "./daily-report-email";
import { fetchIotaUsdPrice } from "./iota-price.server";
import { fetchReportUsdPrices } from "./report-prices.server";
import {
  reportEmailConfig,
  sendReportEmail,
  ReportDeliveryError,
} from "./daily-report-send.server";
import type { Json } from "@/integrations/supabase/types";
const binding = z.object({
  project: z.enum(PROJECT_IDS),
  identifier: z.string().min(1).max(100),
  worker: z.string().max(80).optional(),
  pool: z
    .enum([
      "kryptex",
      "2miners",
      "luckypool",
      "bntpool",
      "gpools",
      "ckpool",
      "chain",
      "tigerpool",
      "boblabs",
      "ariapool",
      "suprnova",
    ])
    .optional(),
});
const reading = z.object({
  project: z.enum(PROJECT_IDS),
  resource: z.string().max(100),
  scope: z.string().max(40).optional(),
  parts: z
    .array(z.object({ key: z.string().max(100), units: z.string().regex(/^\d{1,80}$/) }))
    .max(100)
    .optional(),
  units: z
    .string()
    .regex(/^\d{1,80}$/)
    .nullable(),
  decimals: z.number().int().min(0).max(18),
  currency: z.string().max(20),
  usd: z.number().finite().nonnegative().nullable(),
  fetchedAt: z.number().positive().optional(),
  reason: z.enum(["unsupported", "different_period", "connect_required", "unavailable"]).optional(),
  period: z.enum(["hkDay", "utcDay", "rolling24h", "balance", "month"]).optional(),
  partial: z.boolean().optional(),
});
const jobSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  report_day: z.string(),
  recipient: z.string().email().max(254),
  locale: z.enum(LOCALES),
  device_count: z.number().int().nonnegative(),
  bindings: z.array(binding).max(1000),
  readings: z.array(reading).max(1000),
  cursor: z.number().int().min(0).max(1000),
  lease_token: z.string().uuid(),
  unsubscribe_token: z.string().uuid(),
  attempts: z.number().int().nonnegative(),
  payload: z
    .object({
      subject: z.string().max(300),
      html: z.string().max(90000),
      text: z.string().max(90000),
      unsubscribe: z.string().url(),
    })
    .nullable(),
});
type Job = z.infer<typeof jobSchema>;
const db = () => watchDb(supabaseAdmin);
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
async function update(
  j: Job,
  status: string,
  readings: ReportReading[] = j.readings,
  cursor = j.cursor,
  payload: Job["payload"] = null,
  provider: string | null = null,
  error: string | null = null,
  retry: string | null = null,
) {
  const r = await db().rpc("watch_update_report", {
    p_id: j.id,
    p_lease: j.lease_token,
    p_cursor: cursor,
    p_readings: readings as unknown as Json,
    p_payload: payload as unknown as Json,
    p_status: status,
    p_provider: provider,
    p_error: error,
    p_retry_at: retry,
  });
  if (r.error || !r.data) throw new Error("report_progress_unavailable");
}
async function prepare(j: Job) {
  const w = reportDayWindow(j.report_day),
    chunk: Job["bindings"] = [];
  let cursor = j.cursor,
    networkReads = 0;
  while (cursor < j.bindings.length && networkReads < 5) {
    const b = j.bindings[cursor++]!;
    chunk.push(b);
    if (reportBindingNeedsNetwork(b.project)) networkReads++;
  }
  const readings = [
    ...j.readings,
    ...(await mapConcurrent(chunk, 3, (b) => collectEmailReportBinding(j.user_id, b, w))),
  ];
  await update(
    j,
    cursor >= j.bindings.length ? "ready" : "queued",
    readings,
    cursor,
    null,
    null,
    null,
    new Date(Date.now() + 1000).toISOString(),
  );
}
async function deliver(j: Job, config: NonNullable<ReturnType<typeof reportEmailConfig>>) {
  const w = reportDayWindow(j.report_day),
    now = Date.now();
  if (w.day !== yesterdayReportWindow(now).day || now < w.due) {
    await update(j, "canceled");
    return;
  }
  let payload = j.payload;
  if (!payload) {
    // Early preparation runs before the morning settlement. Refresh IOTA in
    // bounded chunks at dispatch, using a fixed cutoff so large fleets finish.
    const refreshBindings = j.bindings
      .filter(
        (b) =>
          b.project === "iota" &&
          !j.readings.some(
            (r) =>
              r.project === b.project &&
              r.resource === b.identifier &&
              r.fetchedAt != null &&
              r.fetchedAt >= w.due - 5 * 60000,
          ),
      )
      .slice(0, 5);
    if (refreshBindings.length) {
      const refreshed = await mapConcurrent(refreshBindings, 3, async (b) => {
        const r = await collectEmailReportBinding(j.user_id, b, w);
        return { ...r, fetchedAt: r.units === null ? Date.now() : (r.fetchedAt ?? Date.now()) };
      });
      const replacements = new Map(refreshed.map((r) => [r.project + ":" + r.resource, r]));
      const readings = j.readings.filter((r) => !replacements.has(r.project + ":" + r.resource));
      await update(j, "ready", [...readings, ...refreshed]);
      return;
    }
    const [quote, market] = await Promise.all([
      fetchIotaUsdPrice(),
      fetchReportUsdPrices(j.readings.map((r) => r.project)),
    ]);
    const validPrice =
      quote.usdPerIota !== null &&
      !quote.stale &&
      !quote.error &&
      quote.fetchedAt !== null &&
      now - quote.fetchedAt < 15 * 60000 &&
      (!quote.quotedAt || now - quote.quotedAt < 3600000);
    const values = applyMarketUsd(
      j.readings.map((r) =>
        r.project === "iota" && r.units !== null
          ? { ...r, usd: validPrice ? (Number(r.units) / 1e8) * quote.usdPerIota! : null }
          : r,
      ),
      market,
    );
    const clocks = values.filter((r) => r.units !== null && r.fetchedAt).map((r) => r.fetchedAt!);
    const report = aggregateDailyReport(
      w,
      values,
      j.locale,
      j.device_count,
      clocks.length ? Math.min(...clocks) : now,
    );
    if (validPrice && quote.fetchedAt)
      report.valuationAt = new Date(quote.quotedAt ?? quote.fetchedAt).toISOString();
    // Ledger snapshots use accounting dates, while this email attributes IOTA
    // to the preceding day. Never replace these readings with a different day.
    const unsub = new URL("/api/reports/unsubscribe", ORIGIN);
    unsub.searchParams.set("token", j.unsubscribe_token);
    unsub.searchParams.set("locale", j.locale);
    payload = { ...renderDailyReport(report, unsub.toString()), unsubscribe: unsub.toString() };
    const r = await db().rpc("watch_update_report", {
      p_id: j.id,
      p_lease: j.lease_token,
      p_cursor: j.cursor,
      p_readings: j.readings as unknown as Json,
      p_payload: payload,
      p_status: "ready",
      p_provider: null,
      p_error: null,
      p_retry_at: null,
    });
    if (r.error || !r.data) throw new Error("report_payload_unavailable");
    // Reclaim the same frozen payload on the next dispatch; never send before it is durable.
    return;
  }
  const allowed = await db().rpc("watch_report_can_send", {
    p_id: j.id,
    p_lease: j.lease_token,
    p_now: new Date().toISOString(),
  });
  if (allowed.error || !allowed.data) {
    await update(j, "canceled");
    return;
  }
  try {
    const id = await sendReportEmail(
      config,
      j.recipient,
      { subject: payload.subject, html: payload.html, text: payload.text },
      `iota-watch-report/${j.user_id}/${j.report_day}`,
      payload.unsubscribe,
    );
    await update(j, "sent", j.readings, j.cursor, null, id);
  } catch (e) {
    const delivery =
      e instanceof ReportDeliveryError
        ? e
        : new ReportDeliveryError("report_delivery_uncertain", true);
    const retry = delivery.retryable && j.attempts < 7;
    await update(
      j,
      retry ? "ready" : "failed",
      j.readings,
      j.cursor,
      null,
      null,
      delivery.code,
      retry
        ? new Date(Date.now() + Math.max(60000, delivery.retryAfterSeconds * 1000)).toISOString()
        : null,
    );
  }
}
export async function reportCron(request: Request) {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const rejected = await authenticateReportCron(request);
  if (rejected) return rejected;
  const config = reportEmailConfig(process.env);
  if (!config) return json({ error: "reports_not_configured" }, 503);
  const now = Date.now(),
    w = yesterdayReportWindow(now),
    start = w.end + 8 * 3600000,
    end = w.end + 11 * 3600000;
  if (now < start || now >= end) return json({ processed: 0 });
  try {
    const enqueued = await db().rpc("watch_enqueue_reports", {
      p_now: new Date(now).toISOString(),
    });
    if (enqueued.error) throw new Error("report_queue_unavailable");
    let processed = 0;
    // Two small preparation chunks keep the HTTP execution bounded. A dedicated
    // 09:30 invocation prioritizes ready mail; subsequent ticks recover failures.
    const began = Date.now();
    for (let i = 0; i < 4 && Date.now() - began < 20000; i++) {
      const phase = now >= w.due ? "send" : "prepare";
      let claim = await db().rpc("watch_claim_report", {
        p_phase: phase,
        p_now: new Date().toISOString(),
      });
      if (claim.error) throw new Error("report_claim_unavailable");
      if (!claim.data && phase === "send")
        claim = await db().rpc("watch_claim_report", {
          p_phase: "prepare",
          p_now: new Date().toISOString(),
        });
      if (!claim.data) break;
      const j = jobSchema.parse(claim.data);
      if (j.cursor < j.bindings.length && Date.now() >= w.due) {
        const missing = j.bindings.slice(j.cursor).map(
          (b) =>
            ({
              project: b.project,
              resource: b.identifier,
              units: null,
              decimals: b.project === "quantus" ? 12 : 8,
              currency: PROJECTS[b.project].token,
              usd: null,
              reason: "unavailable",
            }) as ReportReading,
        );
        await update(j, "ready", [...j.readings, ...missing], j.bindings.length);
      } else if (j.cursor < j.bindings.length) await prepare(j);
      else await deliver(j, config);
      processed++;
    }
    return json({ processed });
  } catch {
    return json({ error: "report_processing_unavailable" }, 503);
  }
}
