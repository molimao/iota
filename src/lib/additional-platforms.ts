import { bech32m } from "@scure/base";
import { decodeSs58 } from "./ss58";
import { emptyNode, type PlatformNode } from "./platforms";
import { record } from "./projects";
export type AdditionalPlatform = "noid" | "acurast";
export function acurastPublicKey(id: string): string | null {
  if (/^0x[0-9a-f]{64}$/.test(id)) return id.slice(2);
  const d = decodeSs58(id);
  return d.ok
    ? Array.from(d.value.publicKey, (b) => b.toString(16).padStart(2, "0")).join("")
    : null;
}
export function validAdditionalId(project: AdditionalPlatform, id: string) {
  if (id !== id.trim() || id.length > 100) return false;
  if (project === "acurast") return acurastPublicKey(id) !== null;
  try {
    const a = bech32m.decode(id as `${string}1${string}`, 100);
    return id === id.toLowerCase() && a.prefix === "o" && bech32m.fromWords(a.words).length === 32;
  } catch {
    return false;
  }
}
/** Parse only named pool metrics, never HTML, scripts or payment history as executable data. */
export function parseNoid(html: unknown, id: string, now = Date.now()): PlatformNode {
  if (typeof html !== "string" || html.length > 1000000 || !validAdditionalId("noid", id))
    throw new Error("invalid-data");
  if (!html.includes(`name=a value="${id}"`)) throw new Error("invalid-data");
  const fields = new Map<string, string>();
  for (const m of html.matchAll(
    /<div class=e>([^<]{1,50})<\/div>\s*<div class=n>([^<]{1,80})<\/div>/g,
  ))
    fields.set(m[1]!, m[2]!.trim());
  const amount = (key: string) => {
    const v = fields.get(key);
    return v && /^\d{1,9}\.\d{6}$/.test(v) ? Number(v) : null;
  };
  if (!fields.has("owed (NOID)") || !fields.has("last seen")) throw new Error("not-found");
  if (
    !/^\d+(s|m|h|d) ago$/.test(fields.get("last seen") ?? "") &&
    amount("paid (NOID)") === 0 &&
    fields.get("valid shares") === "0"
  )
    throw new Error("not-found");
  const seen = fields.get("last seen")?.match(/^(\d+)(s|m|h|d) ago$/);
  const age = seen
    ? Number(seen[1]) * ({ s: 1000, m: 60000, h: 3600000, d: 86400000 }[seen[2]!] ?? 0)
    : null;
  const measured = fields.get("measured total");
  const paid = amount("paid (24h)");
  return {
    ...emptyNode(id),
    sourcePool: "Parano1d Pool",
    scope: "provider",
    sourceUpdatedAt: age !== null ? now - age : null,
    online: age !== null ? age <= 20 * 60000 : null,
    activity: measured && /^\d+(?:[,.]\d+)? (?:[kMGT]?H\/s)$/.test(measured) ? measured : null,
    reward: paid,
    rewardUnit: "NOID",
    period: "rolling24h",
    lifetime: amount("paid (NOID)"),
    balance: amount("owed (NOID)"),
    balanceUnit: "NOID",
    partial: paid === null,
  };
}
/** Account snapshots prove registration/classification, never current uptime or daily earnings. */
export function parseAcurast(input: unknown, id: string): PlatformNode {
  const rpc = record(input);
  if (rpc["error"] || rpc["jsonrpc"] !== "2.0" || rpc["id"] !== 1) throw new Error("invalid-data");
  const page = record(rpc["result"]),
    rows = page["items"];
  if (!Array.isArray(rows)) throw new Error("invalid-data");
  if (!rows.length) throw new Error("not-found");
  const a = record(rows[0]),
    key = acurastPublicKey(id);
  const returned =
    typeof a["account_id"] === "string" ? a["account_id"].replace(/^0x/, "").toLowerCase() : "";
  if (!key || returned !== key || a["is_processor"] !== true) throw new Error("not-found");
  const hardware = [a["device_type"], a["processor_type"]]
    .filter((v) => typeof v === "string" && ["iOS", "Android", "Core", "Lite"].includes(v))
    .join(" · ");
  return { ...emptyNode(id), hardware: hardware || null, partial: !hardware };
}

/** InnovLab publishes atomic NOID amounts (6 decimals); estimates are not earnings. */
export function parseInnovlabNoid(input: unknown, id: string, now = Date.now()): PlatformNode {
  const r = record(input);
  if (!validAdditionalId("noid", id) || r["address"] !== id || r["coin"] !== "parano1d")
    throw new Error("invalid-data");
  if (r["found"] === false) throw new Error("not-found");
  if (r["found"] !== true) throw new Error("invalid-data");
  const balance = record(r["balance"]);
  const atomic = (v: unknown) => {
    if (typeof v !== "string" || !/^\d{1,16}$/.test(v)) return null;
    const n = Number(v);
    return Number.isSafeInteger(n) ? n / 1e6 : null;
  };
  const rate = r["hashrate"];
  const online = r["workersOnline"];
  const seen = record(r["shares"])["lastAcceptedAt"];
  const time = typeof seen === "string" ? Date.parse(seen) : NaN;
  const confirmed = atomic(balance["confirmed"]);
  const paid = atomic(balance["paid"]);
  return {
    ...emptyNode(id),
    sourcePool: "InnovLab",
    scope: "provider",
    sourceUpdatedAt: Number.isFinite(time) && time <= now ? time : null,
    online:
      typeof online === "number" && Number.isInteger(online) && online >= 0 ? online > 0 : null,
    activity:
      typeof rate === "number" && Number.isFinite(rate) && rate >= 0 && r["hashrate_unit"] === "H/s"
        ? `${(rate / 1e6).toFixed(3)} MH/s`
        : null,
    balance: confirmed,
    balanceUnit: "NOID",
    lifetime: paid,
    reward: null,
    rewardUnit: "NOID",
    partial: true,
  };
}
