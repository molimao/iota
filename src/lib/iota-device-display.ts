import { agentOnline, agentPhase, type AgentInfo, type AgentPhase } from "./device-agent";
import { STATUS_META, statusBucket, type DeviceStatus, type StatusBucket } from "./device-status";

/** A missing public roster entry is not a device health report. */
export function iotaDeviceDisplay(
  status: DeviceStatus,
  agent: AgentInfo | undefined,
  failed = false,
  now = Date.now(),
) {
  const base = {
    phase: null as AgentPhase | null,
    tone: STATUS_META[status].tone,
    bucket: statusBucket(status),
  };
  if (failed || !agent || !agentOnline(agent.lastSeen, now)) return base;
  const phase = agentPhase(agent, now);
  if (phase !== "queued" && !["not_found", "unknown", "refresh_interrupted"].includes(status))
    return base;
  const attention = ["stopped", "workerStopped", "blocked"].includes(phase);
  return {
    phase,
    tone: (attention ? "warn" : phase === "working" ? "good" : "info") as typeof base.tone,
    bucket: (phase === "queued" ? "waiting" : attention ? "attention" : "pending") as StatusBucket,
  };
}
