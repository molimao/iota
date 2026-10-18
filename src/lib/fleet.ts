import { normalizeCsdAddress } from "./csd";
import { isPoolProject, validPoolAddress, poolProvider } from "./pool-projects";
import { acurastPublicKey } from "./additional-platforms";
import { isPlatform, validPlatformId } from "./platforms";
import { z } from "zod";
import { isValidMinerId } from "./ss58";
import { validProjectAddress } from "./projects";
import { validComputeId } from "./compute";
import { quotaState } from "./plans";

export const FLEET_PROJECTS = [
  "iota",
  "xid",
  "quantus",
  "flyai",
  "nosana",
  "gonka",
  "akash",
  "ionet",
  "vast",
  "golem",
  "noid",
  "acurast",
  "prl",
  "xmr",
  "etc",
  "rvn",
  "zec",
  "kas",
  "mds",
  "bnt",
  "csd",
] as const;
export type FleetProject = (typeof FLEET_PROJECTS)[number];
export const FLEET_NAMES: Record<FleetProject, string> = {
  iota: "IOTA",
  xid: "XID / MMM",
  quantus: "Quantus",
  flyai: "fly.ai",
  nosana: "Nosana",
  gonka: "Gonka",
  akash: "Akash",
  ionet: "io.net",
  vast: "Vast.ai",
  golem: "Golem",
  noid: "NOID",
  acurast: "Acurast",
  prl: "Pearl",
  xmr: "Monero",
  etc: "Ethereum Classic",
  rvn: "Ravencoin",
  zec: "Zcash",
  kas: "Kaspa",
  mds: "Midstate",
  bnt: "Blocknet",
  csd: "CSD",
};
export const bindingSchema = z
  .object({
    id: z.string().min(1).max(120),
    project: z.enum(FLEET_PROJECTS),
    identifier: z.string().trim().min(1).max(120),
    pool: z.enum(["kryptex", "2miners", "luckypool", "bntpool", "gpools"]).optional(),
    worker: z.string().trim().max(80).default(""),
  })
  .transform((b) =>
    isPoolProject(b.project)
      ? {
          ...b,
          identifier:
            b.project === "csd"
              ? normalizeCsdAddress(b.identifier)
              : b.project === "etc"
                ? b.identifier.toLowerCase()
                : b.identifier,
          pool: b.pool ?? poolProvider(b.project),
        }
      : b.project === "acurast" && acurastPublicKey(b.identifier)
        ? { ...b, identifier: "0x" + acurastPublicKey(b.identifier) }
        : b,
  );
export const fleetDeviceSchema = z.object({
  id: z.string().min(1).max(120),
  name: z.string().trim().min(1).max(40),
  hardware: z.string().trim().max(100).default(""),
  createdAt: z.number().positive(),
  bindings: z.array(bindingSchema).max(21),
});
export type FleetBinding = z.infer<typeof bindingSchema>;
export type FleetDevice = z.infer<typeof fleetDeviceSchema>;
export const FLEET_KEY = "watch:fleet:v1";

export function validBinding(project: FleetProject, identifier: string) {
  if (isPoolProject(project)) return validPoolAddress(project, identifier);
  if (isPlatform(project)) return validPlatformId(project, identifier);
  if (project === "iota") return isValidMinerId(identifier);
  // Only public payout wallet addresses, never the fly.ai miner bearer token.
  if (project === "flyai") return /^0x[0-9a-fA-F]{40}$/.test(identifier);
  if (project === "nosana" || project === "gonka") return validComputeId(project, identifier);
  return validProjectAddress(project, identifier);
}

export function bindingIdentity(binding: Pick<FleetBinding, "project" | "identifier" | "worker">) {
  const identifier =
    binding.project === "csd"
      ? normalizeCsdAddress(binding.identifier)
      : binding.project === "acurast"
        ? "0x" + acurastPublicKey(binding.identifier)
        : binding.project === "flyai" || binding.project === "etc"
          ? binding.identifier.toLowerCase()
          : binding.identifier;
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
      if (
        !validBinding(binding.project, binding.identifier) ||
        (isPoolProject(binding.project) && binding.pool !== poolProvider(binding.project)) ||
        sources.has(key)
      )
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
