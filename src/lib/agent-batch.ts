import { z } from "zod";
import { agentOnline, agentPhase, agentSnapshot } from "./device-agent";

export const agentBatchSchema = z.array(
  z.object({
    id: z.string().uuid(),
    action: z.enum(["start", "stop", "restart"]),
    createdAt: z.string(),
    items: z.array(
      z.object({
        deviceId: z.string().uuid(),
        name: z.string(),
        disposition: z.enum(["queued", "offline", "busy", "unavailable"]),
        commandId: z.string().uuid().nullable(),
        status: z.enum(["queued", "claimed", "done", "failed", "expired"]).nullable(),
        finishedAt: z.string().nullable(),
        lastSeen: z.string().nullable(),
        snapshot: agentSnapshot
          .pick({ workerRunning: true, appRunning: true, queue: true, trainingState: true })
          .partial()
          .strip(),
      }),
    ),
  }),
);
export type AgentBatch = z.infer<typeof agentBatchSchema>[number];
export type BatchItem = AgentBatch["items"][number];
export type BatchState =
  | "stopped"
  | "verifyingStop"
  | "stopUnconfirmed"
  | "queued"
  | "claimed"
  | "failed"
  | "expired"
  | "offline"
  | "busy"
  | "unavailable"
  | "verifying"
  | "noHeartbeat"
  | "workerStopped"
  | "running"
  | "working"
  | "waiting";
export function batchItemState(
  item: BatchItem,
  now = Date.now(),
  action: "start" | "stop" | "restart" = "restart",
): BatchState {
  if (item.disposition !== "queued") return item.disposition;
  if (!item.status) return "unavailable";
  if (item.status !== "done") return item.status;
  const finished = Date.parse(item.finishedAt ?? "");
  const lastSeen = Date.parse(item.lastSeen ?? "");
  if (!agentOnline(item.lastSeen, now) || !Number.isFinite(finished) || lastSeen < finished)
    return "noHeartbeat";
  if (action === "stop") {
    if (item.snapshot.workerRunning === false && item.snapshot.appRunning === false)
      return "stopped";
    return now - finished < 120000 ? "verifyingStop" : "stopUnconfirmed";
  }
  if (item.snapshot.workerRunning !== true)
    return now - finished < 120000 ? "verifying" : "workerStopped";
  const phase = agentPhase(
    {
      lastSeen: item.lastSeen,
      snapshot: {
        workerRunning: true,
        ...(item.snapshot.appRunning !== undefined ? { appRunning: item.snapshot.appRunning } : {}),
        queue:
          item.snapshot.queue && Date.parse(item.snapshot.queue.observedAt) >= finished
            ? item.snapshot.queue
            : null,
        trainingState:
          item.snapshot.trainingState &&
          Date.parse(item.snapshot.trainingState.observedAt) >= finished
            ? item.snapshot.trainingState
            : null,
      },
    },
    now,
  );
  if (phase === "queued") return "waiting";
  if (["working", "uploading", "merging"].includes(phase)) return "working";
  return "running";
}
