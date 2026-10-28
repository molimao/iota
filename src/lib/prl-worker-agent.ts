import type { FleetDevice } from "./fleet";
import { poolProvider } from "./pool-projects";

/** One wallet card per pool. Prefer the wallet record; Worker links remain on computers. */
export function prlWalletGroups(devices: FleetDevice[]) {
  const groups = new Map<
    string,
    { device: FleetDevice; binding: FleetDevice["bindings"][number] }
  >();
  for (const device of devices)
    for (const binding of device.bindings) {
      if (binding.project !== "prl") continue;
      const key = `${binding.pool ?? poolProvider("prl")}:${binding.identifier}`;
      const previous = groups.get(key);
      if (!previous || (!binding.worker && previous.binding.worker))
        groups.set(key, { device, binding });
    }
  return [...groups.values()];
}
