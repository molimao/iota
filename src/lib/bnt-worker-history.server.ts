import type { SupabaseClient } from "@supabase/supabase-js";
import type { Json } from "@/integrations/supabase/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { watchDb } from "./watch-db";
import { workerSamplesSchema } from "./bnt-worker-history";
import { authenticateReportCron } from "./daily-report-cron-auth.server";
import { mapConcurrent } from "./concurrent";
import { parseBnt } from "./bnt";
import { upstreamJson } from "./upstream-json.server";

export async function readBntWorkerHistory(client: SupabaseClient, address: string) {
  const result = await watchDb(client).rpc("watch_bnt_worker_history_read", { p_address: address });
  if (result.error) throw new Error("worker_history_unavailable");
  return { samples: workerSamplesSchema.parse(result.data) };
}

export async function bntWorkerHistoryCron(request: Request) {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  const denied = await authenticateReportCron(request);
  if (denied) return denied;

  try {
    const db = watchDb(supabaseAdmin);
    const targets = await db.rpc("watch_bnt_worker_history_targets");
    if (targets.error) throw new Error("worker_targets_unavailable");
    const results = await mapConcurrent(targets.data, 3, async ({ address, user_ids }) => {
      try {
        const miner = await upstreamJson(`https://bntpool.com/api/miner/${encodeURIComponent(address)}`);
        const observedAt = new Date();
        const { workers } = parseBnt(miner, null, address, observedAt.getTime());
        const points = workers.slice(0, 100).map(({ name, hashrate }) => ({ name, hashrate }));
        const saved = await Promise.all(user_ids.map((user) =>
          db.rpc("watch_bnt_worker_history_record", {
            p_user: user,
            p_address: address,
            p_at: observedAt.toISOString(),
            p_workers: points satisfies Json,
          }),
        ));
        return saved.every((result) => !result.error);
      } catch {
        return false;
      }
    });
    const failed = results.filter((success) => !success).length;
    return Response.json({ wallets: results.length, failed }, { status: failed ? 502 : 200 });
  } catch {
    return Response.json({ error: "worker_sampling_unavailable" }, { status: 503 });
  }
}
