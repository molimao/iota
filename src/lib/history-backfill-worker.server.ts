import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { watchDb } from "./watch-db";
import type { Json } from "@/integrations/supabase/types";
import { authenticateReportCron } from "./daily-report-cron-auth.server";
import { FLEET_PROJECTS } from "./fleet";
import { LOCALES } from "./site";
import { collectHistoricalResource } from "./history-backfill-collect.server";
import {
  buildHistoricalReports,
  historyDays,
  historyResources,
  historicalResourceSchema,
} from "./history-backfill";
const jobSchema = z.object({
  id: z.string().uuid(),
  lease: z.string().uuid(),
  user_id: z.string().uuid(),
  start_day: z.string(),
  end_day: z.string(),
  cursor: z.number().int().nonnegative(),
  day_cursor: z.number().int().nonnegative(),
  locale: z.enum(LOCALES),
  bindings: z
    .array(
      z.object({
        project: z.enum(FLEET_PROJECTS),
        identifier: z.string().max(100),
        worker: z.string().max(80).optional(),
        device: z.string().uuid(),
        name: z.string().max(40),
      }),
    )
    .max(6000),
  data: z.array(historicalResourceSchema).max(6000),
});
async function rpc(action: string, payload: object = {}) {
  const r = await watchDb(supabaseAdmin).rpc("watch_history_backfill_worker", {
    p_action: action,
    p_payload: payload as Json,
  });
  if (r.error) throw new Error("backfill_unavailable");
  return r.data;
}
export async function historyBackfillCron(request: Request) {
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
    return json({ error: "backfill_not_configured" }, 503);
  try {
    const rawBody = await request.text();
    if (rawBody.length > 1024) return json({ error: "invalid_request" }, 400);
    let decoded: unknown;
    try {
      decoded = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return json({ error: "invalid_request" }, 400);
    }
    const parsed = z
      .object({ enqueue: z.boolean().optional(), retry: z.boolean().optional() })
      .strict()
      .safeParse(decoded);
    if (!parsed.success) return json({ error: "invalid_request" }, 400);
    const input = parsed.data;
    const enqueued = input.enqueue ? await rpc("enqueue") : 0;
    const retried = input.retry ? await rpc("retry_failed") : 0;
    let processed = 0;
    const started = Date.now();
    for (let i = 0; i < 4 && Date.now() - started < 20000; i++) {
      const raw = await rpc("claim");
      if (!raw) break;
      const j = jobSchema.parse(raw),
        credentials = { id: j.id, lease: j.lease };
      try {
        historyDays(j.start_day, j.end_day);
        const resources = historyResources(j.bindings);
        if (j.cursor < resources.length) {
          const result = await collectHistoricalResource(
            j.user_id,
            resources[j.cursor]!,
            j.start_day,
            j.end_day,
            j.day_cursor,
          );
          const data = j.data.slice();
          const previous = data[j.cursor];
          const resource = {
            ...result.resource,
            days: [...(previous?.days ?? []), ...result.resource.days],
          };
          historicalResourceSchema.parse(resource);
          data[j.cursor] = resource;
          if (
            !(await rpc("progress", {
              ...credentials,
              data,
              cursor: j.cursor + (result.complete ? 1 : 0),
              day_cursor: result.complete ? 0 : result.next,
            }))
          )
            throw new Error("backfill_lease_expired");
        } else {
          const rows = buildHistoricalReports(
            j.bindings,
            j.data,
            j.start_day,
            j.end_day,
            j.locale,
            Date.now(),
          );
          const written = await rpc("write", { ...credentials, rows });
          if (written === false) throw new Error("backfill_lease_expired");
        }
      } catch {
        await rpc("retry", credentials);
      }
      processed++;
    }
    return json({ enqueued, retried, processed });
  } catch {
    return json({ error: "backfill_unavailable" }, 503);
  }
}
