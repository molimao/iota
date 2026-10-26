import type { FleetDevice } from "./fleet";

/** Exact wallet + Worker identity. Never inherit a wallet-level Agent. */
export function bntWorkerAgentBinding(devices: FleetDevice[], address: string, worker: string) {
  if (!worker.trim()) return undefined;
  for (const device of devices) {
    const binding = device.bindings.find(
      (b) => b.project === "bnt" && b.identifier === address && b.worker === worker,
    );
    if (binding) return { device, binding };
  }
  return undefined;
}
