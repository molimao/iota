import { agentPhase, currentAgentReason, type AgentPhase, type DeviceTimelinePoint } from "./device-agent";

type MiningState = NonNullable<DeviceTimelinePoint["snapshot"]["idleBnt" | "idleXds"]>["state"];
type IotaState = AgentPhase | "requeued" | "resumed";
export type TimelineEvent =
  | { at: string; project: "iota"; state: IotaState; position?: number; reason?: ReturnType<typeof currentAgentReason> }
  | { at: string; project: "bnt" | "xds"; state: MiningState; hashrate: number | null; started: boolean }
  | { at: string; project: null; state: "gap" };

const contributing = ["working", "uploading", "merging"];

export function deviceTimeline(points: DeviceTimelinePoint[], hasIota: boolean): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  let previous: DeviceTimelinePoint | undefined;
  let previousPhase: AgentPhase | undefined;
  let previousReason: string | undefined;
  let interrupted = false;
  for (const point of points) {
    const at = point.sampledAt;
    const time = Date.parse(at);
    const gap = previous && time - Date.parse(previous.sampledAt) > 10 * 60 * 1000;
    if (gap) {
      events.push({ at, project: null, state: "gap" });
      previous = undefined;
      previousPhase = undefined;
      previousReason = undefined;
    }

    if (hasIota) {
      const { reason: observedReason, appRunning, workerRunning, queue, trainingState } = point.snapshot;
      const rest = { appRunning, workerRunning, queue, trainingState };
      const snapshot = observedReason ? { ...rest, reason: observedReason } : rest;
      const agent = { lastSeen: at, snapshot };
      const phase = agentPhase(agent, time);
      const reason = currentAgentReason(agent, time);
      const requeued = phase === "queued" && !!previousPhase && contributing.includes(previousPhase);
      if (requeued || reason?.code === "kicked" || phase === "blocked" ||
          (previousPhase && (phase === "stopped" || phase === "workerStopped"))) interrupted = true;
      const resumed = interrupted && contributing.includes(phase) && !reason;
      if (phase !== previousPhase || reason?.code !== previousReason || resumed) {
        if (phase !== "unknown" && phase !== "running") {
          const state = resumed ? "resumed" : requeued ? "requeued" : phase;
          events.push({ at, project: "iota", state, reason, ...(phase === "queued" && snapshot.queue ? { position: snapshot.queue.position } : {}) });
        }
      }
      if (resumed) interrupted = false;
      previousPhase = phase;
      previousReason = reason?.code;
    }

    for (const [project, key] of [["bnt", "idleBnt"], ["xds", "idleXds"]] as const) {
      const mining = point.snapshot[key];
      const before = previous?.snapshot[key];
      if (!mining || mining.state === before?.state) continue;
      if (mining.state === "off" && !before) continue;
      events.push({ at, project, state: mining.state, hashrate: mining.hashrate, started: !!before && mining.state === "mining" });
    }
    previous = point;
  }
  return events.reverse();
}
