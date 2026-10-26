import type { AgentInfo } from "./device-agent";
import type { FleetDevice } from "./fleet";

/** Match account device IDs, never fuzzy-match worker names or other projects. */
export function iotaAgentTargets(devices: FleetDevice[], agents: AgentInfo[], miners: string[]) {
  const identifiers = new Set(miners);
  const targets = devices.filter((d) =>
    d.bindings.some((b) => b.project === "iota" && identifiers.has(b.identifier)),
  );
  const ids = new Set(targets.map((d) => d.id));
  return {
    agents: agents.filter((a) => ids.has(a.deviceId)),
    names: Object.fromEntries(targets.map((d) => [d.id, d.name])),
    unpaired: targets
      .filter((d) => !agents.some((a) => a.deviceId === d.id))
      .map((d) => ({ id: d.id, name: d.name })),
  };
}
