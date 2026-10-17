import { readAlertAgents } from "./pro-alert-agents.server";
import { buildDeviceSnapshots } from "./device-history";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Json } from "@/integrations/supabase/types";
import { watchDb } from "./watch-db";
import { authenticateReportCron } from "./daily-report-cron-auth.server";
import { collectReportBinding } from "./daily-report-collect.server";
import { collectAlertSignal, alertResource, type AlertReason } from "./pro-alerts.server";
import { aggregateDailyReport, reportDayWindow, type ReportReading } from "./daily-report";
import { historySchema, dailySnapshotSchema, summarizeMonth } from "./pro-tools";
import { fetchIotaUsdPrice } from "./iota-price.server";
import { reportEmailConfig, sendReportEmail } from "./daily-report-send.server";
import { renderMonthlyReport, renderStatusAlert } from "./pro-email";
import { FLEET_PROJECTS } from "./fleet";
import { LOCALES, ORIGIN } from "./site";
import { mapConcurrent } from "./concurrent";
const binding = z.object({
  project: z.enum(FLEET_PROJECTS),
  identifier: z.string().max(100),
  worker: z.string().max(80).optional(),
  device: z.string().uuid(),
  name: z.string().max(40),
});
const jobSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  kind: z.enum(["snapshot", "sample", "alert", "monthly"]),
  task_key: z.string().max(300),
  bindings: z.array(binding).max(6000),
  cursor: z.number().int().nonnegative(),
  data: z.unknown(),
  lease: z.string().uuid(),
  recipient: z.string().email().nullable(),
  locale: z.enum(LOCALES),
  unsubscribe_token: z.string().uuid().nullable(),
  attempts: z.number().int().nonnegative(),
});
type Job = z.infer<typeof jobSchema>;
const frozen = z.object({
  subject: z.string().max(300),
  html: z.string().max(90000),
  text: z.string().max(90000),
  unsubscribe: z.string().url(),
});
async function rpc(action: string, payload: object) {
  const r = await watchDb(supabaseAdmin).rpc("watch_pro_worker", {
    p_action: action,
    p_payload: payload as Json,
  });
  if (r.error) throw new Error("pro_worker_unavailable");
  return r.data;
}
async function progress(j: Job, data: unknown, cursor: number, done = false, provider?: string) {
  if (!(await rpc("progress", { id: j.id, lease: j.lease, data, cursor, done, provider })))
    throw new Error("pro_lease_expired");
}
async function snapshot(j: Job) {
  const window = reportDayWindow(j.task_key);
  const readings = j.data as ReportReading[];
  if (!Array.isArray(readings)) throw new Error("invalid_snapshot");
  if (j.cursor < j.bindings.length) {
    const chunk = j.bindings.slice(j.cursor, j.cursor + 5);
    const values = await mapConcurrent(chunk, 3, (b) => collectReportBinding(j.user_id, b, window));
    await progress(j, [...readings, ...values], j.cursor + chunk.length);
    return;
  }
  const quote = await fetchIotaUsdPrice();
  const now = Date.now();
  const valid =
    quote.usdPerIota !== null &&
    !quote.stale &&
    !quote.error &&
    quote.fetchedAt !== null &&
    now - quote.fetchedAt < 15 * 60000 &&
    (!quote.quotedAt || now - quote.quotedAt < 3600000);
  const values = readings.map((r) =>
    r.project === "iota" && r.units !== null
      ? { ...r, usd: valid ? (Number(r.units) / 1e8) * quote.usdPerIota! : null }
      : r,
  );
  const report = aggregateDailyReport(
    window,
    values,
    j.locale,
    new Set(j.bindings.map((b) => b.device)).size,
    now,
  );
  if (valid) report.valuationAt = new Date(quote.quotedAt ?? quote.fetchedAt!).toISOString();
  dailySnapshotSchema.parse(report);
  const devices = buildDeviceSnapshots(
    j.task_key,
    j.bindings,
    values,
    j.locale,
    now,
    report.valuationAt,
  );
  if (!(await rpc("history", { id: j.id, lease: j.lease, report, devices })))
    throw new Error("pro_history_unavailable");
  await progress(j, readings, j.cursor, true);
}
async function sample(j: Job) {
  const chunk = j.bindings.slice(j.cursor, j.cursor + 5);
  const agents = await readAlertAgents(supabaseAdmin, j.user_id, chunk.filter(b => b.project === "iota").map(b => b.device));
  const samples = await mapConcurrent(chunk, 3, async (b) => {
    let reason: AlertReason | undefined;
    const signal = await collectAlertSignal(b, (value) => { reason = value; }, { available: agents !== null, agent: agents?.get(b.device) ?? null });
    return { b, signal, reason };
  });
  for (const { b, signal, reason } of samples)
    await rpc("observe", {
      id: j.id,
      lease: j.lease,
      resource: alertResource(b),
      signal,
      event: { name: b.name, project: b.project, identifier: b.identifier, reason },
    });
  const cursor = j.cursor + chunk.length;
  await progress(j, [], cursor, cursor >= j.bindings.length);
}
async function notify(j: Job) {
  const config = reportEmailConfig(process.env);
  if (!config) throw new Error("reports_not_configured");
  if (!j.recipient || !j.unsubscribe_token) {
    await progress(j, j.data, j.cursor, true);
    return;
  }
  const url = new URL("/api/pro/unsubscribe", ORIGIN);
  url.searchParams.set("token", j.unsubscribe_token);
  url.searchParams.set("locale", j.locale);
  const rawData =
    typeof j.data === "object" && j.data !== null && !Array.isArray(j.data)
      ? (j.data as Record<string, unknown>)
      : {};
  const payload = frozen.safeParse(rawData["email"]);
  if (!payload.success) {
    let mail;
    if (j.kind === "monthly") {
      const history = historySchema.parse(await rpc("read_history", { id: j.id, lease: j.lease }));
      mail = renderMonthlyReport(summarizeMonth(history, j.task_key), j.locale, url.toString());
    } else {
      const v = z
        .object({
          event: binding.pick({ name: true, project: true, identifier: true }).extend({
            reason: z.enum(["iota_not_found", "iota_idle", "provider_offline"]).optional(),
          }),
          since: z.string().datetime({ offset: true }),
        })
        .parse(j.data);
      mail = renderStatusAlert(v.event, v.since, j.locale, url.toString());
    }
    await progress(j, { ...rawData, email: { ...mail, unsubscribe: url.toString() } }, j.cursor);
    return;
  }
  if (!(await rpc("can_send", { id: j.id, lease: j.lease }))) {
    await progress(j, j.data, j.cursor, true);
    return;
  }
  // Provider idempotency covers a lost response or a worker crash after acceptance.
  const id = await sendReportEmail(
    config,
    j.recipient,
    payload.data,
    `iota-watch-pro/${j.id}`,
    payload.data.unsubscribe,
  );
  await progress(j, j.data, j.cursor, true, id);
}
export async function proToolsCron(request: Request) {
  const json = (v: unknown, status = 200) =>
    new Response(JSON.stringify(v), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const denied = await authenticateReportCron(request);
  if (denied) return denied;
  if (process.env["PRO_TOOLS_ENABLED"] !== "true")
    return json({ error: "pro_tools_not_configured" }, 503);
  try {
    await rpc("enqueue", {});
    let processed = 0;
    const start = Date.now();
    for (let i = 0; i < 4 && Date.now() - start < 20000; i++) {
      const raw = await rpc("claim", {});
      if (!raw) break;
      const j = jobSchema.parse(raw);
      if (j.kind === "snapshot") await snapshot(j);
      else if (j.kind === "sample") await sample(j);
      else await notify(j);
      processed++;
    }
    return json({ processed });
  } catch {
    return json({ error: "pro_processing_unavailable" }, 503);
  }
}
