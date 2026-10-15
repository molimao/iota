import { record, finite } from "./projects";
import type { PoolProject } from "./pool-projects";
export type PoolWorker = {
  name: string;
  hashrate: number | null;
  online: boolean | null;
  lastSeen: number | null;
};
export type PoolAccount = {
  balance: number | null;
  paid: number | null;
  reward: number | null;
  period: "utcDay" | "rolling24h";
  workers: PoolWorker[];
  workerCount: number;
  partial: boolean;
  hashrate: number | null;
};
const number = (v: unknown) =>
  typeof v === "string" && /^\d+(\.\d+)?$/.test(v) ? finite(Number(v)) : finite(v);
const timestamp = (v: unknown) => {
  const n = number(v);
  return n && n > 0 ? (n < 1e12 ? n * 1000 : n) : null;
};
export function parseKryptex(
  balance: unknown,
  workers: unknown,
  rewards: unknown,
  payouts: unknown,
  now = Date.now(),
): PoolAccount {
  const b = record(balance),
    w = record(workers),
    p = record(payouts);
  if (number(b["total"]) === null || !Array.isArray(w["results"])) throw new Error("invalid-data");
  const rows = w["results"].map(record).map((r): PoolWorker => ({
    name: String(r["worker"] ?? "").slice(0, 80),
    hashrate: number(r["avg_hashrate_30m"] ?? r["hashrate"]),
    online: r["status"] === "online" ? true : r["status"] === "offline" ? false : null,
    lastSeen: timestamp(r["last_share"]),
  }));
  if (
    b["last_active"] === 0 &&
    rows.length === 0 &&
    number(b["total"]) === 0 &&
    number(p["paid"]) === 0 &&
    Array.isArray(rewards) &&
    rewards.length === 0
  )
    throw new Error("not-found");
  const day = Math.floor(now / 86400000) * 86400000;
  const point = Array.isArray(rewards)
    ? rewards.map(record).find((r) => timestamp(r["timestamp"] ?? r["date"]) === day)
    : undefined;
  return {
    balance: number(b["total"]),
    paid: number(p["paid"]),
    reward: point ? number(point["reward"]) : null,
    period: "utcDay",
    workers: rows,
    workerCount: number(w["count"]) ?? rows.length,
    partial:
      (number(w["count"]) ?? rows.length) > rows.length ||
      !Array.isArray(rewards) ||
      number(p["paid"]) === null,
    hashrate:
      rows.length && rows.every((r) => r.hashrate !== null)
        ? rows.reduce((n, r) => n + r.hashrate!, 0)
        : null,
  };
}
// 2Miners account monetary fields use payment units, not block reward units.
// Official account.js getPaymentsMultiplier: DH=1e-9; KAWPOW/EQ/KHeavyHash=1e-8.
export function parseTwoMiners(project: PoolProject, input: unknown): PoolAccount {
  const a = record(input),
    s = record(a["stats"]);
  if (
    a["apiVersion"] !== 200 ||
    number(a["workersTotal"]) === null ||
    number(s["balance"]) === null ||
    !a["workers"] ||
    typeof a["workers"] !== "object" ||
    Array.isArray(a["workers"])
  )
    throw new Error("invalid-data");
  const divisor = project === "etc" ? 1e9 : 1e8;
  const amount = (v: unknown) => {
    const n = number(v);
    return n !== null && Number.isSafeInteger(n) ? n / divisor : null;
  };
  return {
    balance: amount(s["balance"]),
    paid: amount(s["paid"]),
    reward: amount(a["24hreward"]),
    period: "rolling24h",
    workerCount: number(a["workersTotal"])!,
    partial: false,
    hashrate: number(a["currentHashrate"]),
    workers: Object.entries(record(a["workers"])).map(([name, v]) => {
      const r = record(v);
      return {
        name: name.slice(0, 80),
        hashrate: number(r["hr"]),
        online: typeof r["offline"] === "boolean" ? !r["offline"] : null,
        lastSeen: timestamp(r["lastBeat"]),
      };
    }),
  };
}
export function poolHashrate(project: PoolProject, n: number | null) {
  if (n === null) return "—";
  const i = n > 0 ? Math.min(6, Math.max(0, Math.floor(Math.log10(n) / 3))) : 0;
  return `${Number((n / 1000 ** i).toFixed(2))} ${["", "K", "M", "G", "T", "P", "E"][i]}${project === "zec" ? "S/s" : "H/s"}`;
}
