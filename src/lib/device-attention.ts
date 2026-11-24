import { agentPhase, type AgentInfo } from "./device-agent";

export function deviceAttention(agent: AgentInfo | undefined, hasIota: boolean, now: number) {
  if (!agent?.lastSeen) return null;
  const phase = agentPhase(agent, now);
  if (phase === "offline") return "offline";
  if (hasIota && (phase === "blocked" || phase === "workerStopped")) return "training";
  if (["install_error", "error", "memory"].includes(agent.snapshot.idleBnt?.state ?? "")) return "bnt";
  if (agent.snapshot.idleXds?.state === "error" || agent.snapshot.idleXds?.provisioning === "error")
    return "xds";
  return null;
}
