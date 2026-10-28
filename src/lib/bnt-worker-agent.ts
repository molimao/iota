import type { FleetDevice } from "./fleet";
import { poolProvider, type PoolProvider } from "./pool-projects";

/** Exact wallet + Worker identity. Never inherit a wallet-level Agent. */
export function bntWorkerAgentBinding(devices: FleetDevice[], address: string, worker: string) {
  return poolWorkerAgentBinding(devices, "bnt", address, worker);
}

export function poolWorkerAgentBinding(
  devices: FleetDevice[],
  project: "bnt" | "prl",
  address: string,
  worker: string,
  pool?: PoolProvider,
) {
  if (!worker.trim()) return undefined;
  for (const device of devices) {
    const binding = device.bindings.find(
      (b) =>
        b.project === project &&
        b.identifier === address &&
        b.worker === worker &&
        (b.pool ?? poolProvider(project)) === (pool ?? poolProvider(project)),
    );
    if (binding) return { device, binding };
  }
  return undefined;
}
