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
  period: "utcDay" | "rolling24h" | "unknown";
  pendingEstimate?: number | null;
  queued?: number | null;
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
// Account.js getPaymentsMultiplier. ERG matches Ergo (1e-9). ZEPH matches RandomX (1e-12).
// ETC stays on its existing DH payment divisor. There is no 1e-8 fallback.
const TWO_MINERS_PAYMENT_DIVISOR: Partial<Record<PoolProject, number>> = {
  etc: 1e9,
  rvn: 1e8,
  zec: 1e8,
  kas: 1e8,
  erg: 1e9,
  zeph: 1e12,
};
export function twoMinersPaymentDivisor(project: PoolProject) {
  return TWO_MINERS_PAYMENT_DIVISOR[project] ?? null;
}
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
  const divisor = twoMinersPaymentDivisor(project);
  if (!divisor) throw new Error("invalid-data");
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
/** LuckyPool MDS amounts are base units (coinUnits=1), not 1e8 or 1e9 decimals.
 * rewardStats is earned block allocation; payment transfers are a separate total.
 */
export function parseMidstate(input: unknown, address: string, now = Date.now()): PoolAccount {
  const r = record(input),
    s = record(r["stats"]);
  if (r["error"] === "Address not found" || r["error"] === "not found")
    throw new Error("not-found");
  if (s["wallet"] !== address || !Array.isArray(r["workers"]) || r["workers"].length > 5000)
    throw new Error("invalid-data");
  const atomic = (v: unknown) => {
    const n = number(v);
    return n !== null && Number.isSafeInteger(n) && n >= 0 ? n : null;
  };
  const rows = r["workers"].map(record).map((w): PoolWorker => {
    const last = timestamp(w["lastShare"]);
    const seen = last !== null && last <= now ? last : null;
    const hr = number(w["hashrate"]);
    return {
      name: typeof w["name"] === "string" ? w["name"].slice(0, 80) : "",
      hashrate: hr !== null && hr >= 0 ? hr : null,
      lastSeen: seen,
      online: seen === null ? null : now - seen <= 900000,
    };
  });
  const reward = Array.isArray(r["rewardStats"])
    ? record(r["rewardStats"].find((v) => record(v)["period"] === "24h"))
    : {};
  const start = timestamp(reward["startTime"]),
    end = timestamp(reward["endTime"]);
  const earned =
    start !== null && end !== null && end - start === 86400000 ? atomic(reward["amount"]) : null;
  const unlocked = atomic(s["unlocked"]),
    locked = atomic(s["locked"]);
  const balance = unlocked !== null && locked !== null ? atomic(unlocked + locked) : null;
  const paid = atomic(s["paid"]),
    rate = number(s["hashrate"]);
  return {
    balance,
    paid,
    reward: earned,
    period: "rolling24h",
    workers: rows,
    workerCount: rows.length,
    hashrate: rate !== null && rate >= 0 ? rate : null,
    partial: balance === null || paid === null || earned === null,
  };
}
export function poolHashrate(project: PoolProject, n: number | null) {
  if (n === null) return "—";
  const i = n > 0 ? Math.min(6, Math.max(0, Math.floor(Math.log10(n) / 3))) : 0;
  return `${Number((n / 1000 ** i).toFixed(2))} ${["", "K", "M", "G", "T", "P", "E"][i]}${project === "mds" ? "nonces/s" : project === "zec" ? "S/s" : "H/s"}`;
}
