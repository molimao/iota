import type { SupabaseClient } from "@supabase/supabase-js";
import type { Json } from "@/integrations/supabase/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { watchDb } from "./watch-db";
import { readPoolAccount } from "./pool-monitor.server";
import { workerSamplesSchema } from "./bnt-worker-history";
export async function sampleBntWorkers(client: SupabaseClient, user: string, address: string) {
  const before = await watchDb(client).rpc("watch_bnt_worker_history_read", { p_address: address });
  if (before.error) throw new Error("worker_history_unavailable");
  const existing = workerSamplesSchema.parse(before.data);
  try {
    const reading = await readPoolAccount("bnt", address);
    if (
      !reading.data ||
      reading.error ||
      reading.stale ||
      !reading.fetchedAt ||
      Date.now() - reading.fetchedAt > 300000
    )
      return { samples: existing, sampling: false };
    const saved = await watchDb(supabaseAdmin).rpc("watch_bnt_worker_history_record", {
      p_user: user,
      p_address: address,
      p_at: new Date(reading.fetchedAt).toISOString(),
      p_workers: reading.data.workers
        .slice(0, 100)
        .map((w) => ({ name: w.name, hashrate: w.hashrate })) as Json,
    });
    if (saved.error || !saved.data) return { samples: existing, sampling: false };
    const after = await watchDb(client).rpc("watch_bnt_worker_history_read", {
      p_address: address,
    });
    if (after.error) return { samples: existing, sampling: false };
    return { samples: workerSamplesSchema.parse(after.data), sampling: true };
  } catch {
    return { samples: existing, sampling: false };
  }
}
