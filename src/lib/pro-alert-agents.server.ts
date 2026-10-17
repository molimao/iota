import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { agentSnapshot, type AgentInfo } from "./device-agent";
import { watchDb } from "./watch-db";

/** Service-side lookup: always constrain by both task owner and device IDs.
 * null means lookup failed; an empty map means a successful lookup found no pairing. */
export async function readAlertAgents(client: SupabaseClient<Database>, user: string, devices: string[]) {
  const agents = new Map<string, AgentInfo>();
  if (!devices.length) return agents;
  try {
    const result = await watchDb(client).from("watch_device_agents")
      .select("device_id,last_seen,snapshot")
      .eq("user_id", user).in("device_id", [...new Set(devices)])
      .abortSignal(AbortSignal.timeout(5000));
    if (result.error || !result.data) return null;
    for (const row of result.data) {
      const snapshot = agentSnapshot.pick({appRunning: true, workerRunning: true, queue: true, trainingState: true}).partial().strip().safeParse(row.snapshot);
      agents.set(row.device_id, {
        deviceId: row.device_id, lastSeen: row.last_seen,
        snapshot: snapshot.success ? {
          ...(snapshot.data.appRunning !== undefined ? {appRunning: snapshot.data.appRunning} : {}),
          ...(snapshot.data.workerRunning !== undefined ? {workerRunning: snapshot.data.workerRunning} : {}),
          ...(snapshot.data.queue !== undefined ? {queue: snapshot.data.queue} : {}),
          ...(snapshot.data.trainingState !== undefined ? {trainingState: snapshot.data.trainingState} : {}),
        } : {},
        logsEnabled: false, recoveryEnabled: false, pending: null, latestCommand: null,
      });
    }
    return agents;
  } catch {
    return null;
  }
}
