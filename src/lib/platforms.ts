import { bech32 } from "@scure/base";
import { record, finite } from "./projects";
export const PLATFORM_IDS = ["akash", "ionet", "vast", "golem"] as const;
export type Platform = (typeof PLATFORM_IDS)[number];
export type PrivatePlatform = "ionet" | "vast";
export const isPlatform = (v: unknown): v is Platform => PLATFORM_IDS.includes(v as Platform);
export const isPrivatePlatform = (v: unknown): v is PrivatePlatform =>
  v === "ionet" || v === "vast";
export function validPlatformId(project: Platform, id: string) {
  if (id !== id.trim() || id.length > 100) return false;
  if (project === "ionet")
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (project === "vast") return /^[1-9]\d{0,14}$/.test(id);
  if (project === "golem") return /^0x[0-9a-f]{40}$/.test(id);
  try {
    const decoded = bech32.decode(id as `${string}1${string}`);
    return (
      id === id.toLowerCase() &&
      decoded.prefix === "akash" &&
      bech32.fromWords(decoded.words).length === 20
    );
  } catch {
    return false;
  }
}
export type PlatformNode = {
  id: string;
  name: string | null;
  hardware: string | null;
  online: boolean | null;
  sourceUpdatedAt: number | null;
  gpuCount: number | null;
  activeGpu: number | null;
  cpuCount: number | null;
  reward: number | null;
  rewardUnit: "GLM" | "USD" | "IO" | null;
  period: "rolling24h" | "hkDay" | "utcDay" | null;
  periodStart: number | null;
  periodEnd: number | null;
  lifetime: number | null;
  partial: boolean;
  scope: "provider" | "device";
};
export type PlatformResult = {
  data: PlatformNode | null;
  fetchedAt: number | null;
  error:
    | "unavailable"
    | "invalid-data"
    | "not-found"
    | "connect-required"
    | "expired"
    | "not-configured"
    | null;
};
const text = (v: unknown) => (typeof v === "string" ? v.slice(0, 180) : null);
const num = (v: unknown) =>
  typeof v === "string" && /^\d+(\.\d+)?$/.test(v) ? finite(Number(v)) : finite(v);
const date = (v: unknown) =>
  typeof v === "string" && Number.isFinite(Date.parse(v)) ? Date.parse(v) : null;
export const emptyNode = (id: string): PlatformNode => ({
  id,
  name: null,
  hardware: null,
  online: null,
  sourceUpdatedAt: null,
  gpuCount: null,
  activeGpu: null,
  cpuCount: null,
  reward: null,
  rewardUnit: null,
  period: null,
  periodStart: null,
  periodEnd: null,
  lifetime: null,
  partial: false,
  scope: "device",
});
export function parseAkash(input: unknown, id: string): PlatformNode {
  const p = record(input);
  if (p["owner"] !== id) throw new Error("invalid-data");
  const gpu = record(record(p["stats"])["gpu"]),
    models = p["gpuModels"];
  return {
    ...emptyNode(id),
    scope: "provider",
    name: text(p["name"]),
    online: typeof p["isOnline"] === "boolean" ? p["isOnline"] : null,
    sourceUpdatedAt: date(p["lastCheckDate"]),
    gpuCount: num(gpu["total"]),
    activeGpu: num(gpu["active"]),
    hardware: Array.isArray(models)
      ? models
          .map((m) => text(record(m)["model"]))
          .filter(Boolean)
          .join(", ")
          .slice(0, 180) || null
      : null,
  };
}
export function parseGolem(input: unknown, earnings: unknown, id: string): PlatformNode {
  if (!Array.isArray(input)) throw new Error("invalid-data");
  const p = record(input.find((v) => record(v)["node_id"] === id));
  if (!p["node_id"]) throw new Error("not-found");
  const d = record(p["data"]),
    reward = num(record(earnings)["earnings"]);
  return {
    ...emptyNode(id),
    name: text(d["golem.node.id.name"]),
    hardware: text(d["golem.inf.cpu.model"]),
    online: typeof p["online"] === "boolean" ? p["online"] : null,
    sourceUpdatedAt: date(p["updated_at"]),
    cpuCount: num(d["golem.inf.cpu.cores"]),
    lifetime: num(p["earnings_total"]),
    reward,
    rewardUnit: "GLM",
    period: "rolling24h",
    partial: reward === null,
  };
}
export function parseIo(input: unknown, rewards: unknown, id: string): PlatformNode {
  const p = record(record(input)["data"]);
  if (p["device_id"] !== id) throw new Error("invalid-data");
  const r = record(rewards);
  const reward = r["device_id"] === id ? num(r["total_block_rewards"]) : null;
  // Job state and past uptime are not evidence of current connectivity.
  return {
    ...emptyNode(id),
    hardware: text(p["hardware_name"]),
    gpuCount: num(p["hardware_quantity"]),
    reward,
    rewardUnit: "IO",
    period: "utcDay",
    partial: reward === null,
  };
}
export function parseVast(input: unknown, earnings: unknown, id: string): PlatformNode {
  const machines = record(input)["machines"];
  if (!Array.isArray(machines)) throw new Error("invalid-data");
  const m = record(machines.find((v) => String(record(v)["id"]) === id));
  if (!m["id"]) throw new Error("not-found");
  const rows = record(earnings)["per_machine"],
    r = record(
      Array.isArray(rows) ? rows.find((v) => String(record(v)["machine_id"]) === id) : null,
    );
  const amounts = ["gpu_earn", "sto_earn", "bwu_earn", "bwd_earn"].map((k) => num(r[k]));
  const reward = amounts.every((v) => v !== null)
    ? amounts.reduce<number>((a, v) => a + (v ?? 0), 0)
    : null;
  return {
    ...emptyNode(id),
    name: text(m["name"]),
    hardware: text(m["gpu_name"]),
    gpuCount: num(m["num_gpus"]),
    reward: reward !== null && Number.isFinite(reward) ? reward : null,
    rewardUnit: "USD",
    period: "hkDay",
    partial: reward === null,
  };
}
