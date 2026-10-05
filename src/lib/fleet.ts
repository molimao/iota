import { z } from "zod";
import { isValidMinerId } from "./ss58";
import { validProjectAddress } from "./projects";
import { quotaState } from "./plans";

export const FLEET_PROJECTS = ["iota", "xid", "quantus", "flyai"] as const;
export type FleetProject = (typeof FLEET_PROJECTS)[number];
export const FLEET_NAMES: Record<FleetProject, string> = {
  iota: "IOTA",
  xid: "XID / MMM",
  quantus: "Quantus",
  flyai: "fly.ai",
};
export const bindingSchema = z.object({
  id: z.string().min(1).max(120),
  project: z.enum(FLEET_PROJECTS),
  identifier: z.string().trim().min(1).max(100),
  worker: z.string().trim().max(80).default(""),
});
export const fleetDeviceSchema = z.object({
  id: z.string().min(1).max(120),
  name: z.string().trim().min(1).max(40),
  hardware: z.string().trim().max(100).default(""),
  createdAt: z.number().positive(),
  bindings: z.array(bindingSchema).max(12),
});
export type FleetBinding = z.infer<typeof bindingSchema>;
export type FleetDevice = z.infer<typeof fleetDeviceSchema>;
export const FLEET_KEY = "watch:fleet:v1";

export function validBinding(project: FleetProject, identifier: string) {
  if (project === "iota") return isValidMinerId(identifier);
  // Only public payout wallet addresses, never the fly.ai miner bearer token.
  if (project === "flyai") return /^0x[0-9a-fA-F]{40}$/.test(identifier);
  return validProjectAddress(project, identifier);
}

export function bindingIdentity(binding: Pick<FleetBinding, "project" | "identifier" | "worker">) {
  const identifier =
    binding.project === "flyai" ? binding.identifier.toLowerCase() : binding.identifier;
  return `${binding.project}:${identifier}:${binding.worker}`;
}

export function parseFleet(input: unknown): FleetDevice[] {
  const devices = z.array(fleetDeviceSchema).parse(input);
  const ids = new Set<string>(),
    sources = new Set<string>();
  for (const device of devices) {
    if (ids.has(device.id)) throw new Error("duplicate-device");
    ids.add(device.id);
    for (const binding of device.bindings) {
      const key = bindingIdentity(binding);
      if (!validBinding(binding.project, binding.identifier) || sources.has(key))
        throw new Error("invalid-binding");
      sources.add(key);
    }
  }
  return devices;
}

/** Names are labels, not proof that two accounts identify the same physical machine. */
export function mergeDevices(devices: FleetDevice[], targetId: string, sourceId: string) {
  if (targetId === sourceId) throw new Error("same-device");
  const target = devices.find((d) => d.id === targetId),
    source = devices.find((d) => d.id === sourceId);
  if (!target || !source) throw new Error("missing-device");
  return parseFleet(
    devices
      .filter((d) => d.id !== sourceId)
      .map((d) =>
        d.id === targetId
          ? {
              ...d,
              hardware: d.hardware || source.hardware,
              bindings: [...d.bindings, ...source.bindings],
            }
          : d,
      ),
  );
}

/** A wallet total shared by several workers must never be summed as device earnings. */
export function walletIsShared(devices: FleetDevice[], binding: FleetBinding) {
  return (
    devices
      .flatMap((d) => d.bindings)
      .filter(
        (b) =>
          b.project === binding.project &&
          (binding.project === "flyai"
            ? b.identifier.toLowerCase() === binding.identifier.toLowerCase()
            : b.identifier === binding.identifier),
      ).length > 1
  );
}

/** Device view is an aggregation. Each project has its own independent quota. */
export function projectDeviceCount(devices: FleetDevice[], project: FleetProject) {
  return devices.filter((device) => device.bindings.some((binding) => binding.project === project))
    .length;
}

export function projectQuotaState(devices: FleetDevice[], project: FleetProject, limit: number) {
  return { project, ...quotaState(projectDeviceCount(devices, project), limit) };
}

export function canLinkProject(
  devices: FleetDevice[],
  deviceId: string,
  project: FleetProject,
  limit: number,
) {
  const device = devices.find((row) => row.id === deviceId);
  if (!device) return false;
  return (
    device.bindings.some((binding) => binding.project === project) ||
    projectQuotaState(devices, project, limit).canAdd
  );
}
