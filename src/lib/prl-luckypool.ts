import type { PoolAccount } from "./pool-monitor";

const COIN_UNITS = 100_000_000;
const MINUTE = 60_000;

const record = (v: unknown): Record<string, unknown> | null =>
  typeof v === "object" && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : null;

const statusText = (v: unknown) => {
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "string" && v.trim()) return v.trim().toLowerCase();
  return null;
};

const notFoundStatus = (v: unknown) => {
  const s = statusText(v);
  return (
    s === "not-found" || s === "not_found" || s === "not found" || s === "notfound" || s === "404"
  );
};

/** Atomic PRL as a safe nonnegative integer, scaled to coins. Missing or unusable → null. */
const atomic = (v: unknown): number | null => {
  if (typeof v === "number") {
    if (!Number.isSafeInteger(v) || v < 0) return null;
    return v / COIN_UNITS;
  }
  if (typeof v === "string" && /^(0|[1-9]\d*)$/.test(v)) {
    const n = Number(v);
    if (!Number.isSafeInteger(n)) return null;
    return n / COIN_UNITS;
  }
  return null;
};

/** Hashrate in H/s. Absent or unusable → null. Never substituted from averages. */
const rate = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v) && v >= 0) return v;
  if (typeof v === "string" && /^(0|[1-9]\d*)(\.\d+)?$/.test(v)) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

/** Numeric or numeric-string epoch. Values below 1e12 are seconds. */
const timestamp = (v: unknown): number | null => {
  let n: number | null = null;
  if (typeof v === "number" && Number.isFinite(v)) n = v;
  else if (typeof v === "string" && /^(0|[1-9]\d*)(\.\d+)?$/.test(v)) n = Number(v);
  if (n == null || !Number.isFinite(n) || n <= 0) return null;
  return n < 1e12 ? n * 1000 : n;
};

const onlineAt = (lastSeen: number | null, now: number): boolean | null => {
  if (lastSeen == null) return null;
  const age = now - lastSeen;
  if (age > 30 * MINUTE) return false;
  if (age > 20 * MINUTE) return null;
  if (age >= -2 * MINUTE) return true;
  return null;
};

const reward24h = (input: Record<string, unknown>): number | null => {
  if (!Array.isArray(input["rewardStats"])) return null;
  const row = input["rewardStats"].map(record).find((r) => r?.["period"] === "24h");
  return row ? atomic(row["amount"]) : null;
};

export function parsePrlLuckyPool(
  config: unknown,
  input: unknown,
  address: string,
  now = Date.now(),
  expectedSymbol = "PRL",
): PoolAccount {
  const cfg = record(config);
  if (!cfg || cfg["symbol"] !== expectedSymbol || cfg["coinUnits"] !== COIN_UNITS)
    throw new Error("invalid-data");

  const doc = record(input);
  if (!doc) throw new Error("invalid-data");
  const stats = record(doc["stats"]);
  const workers = doc["workers"];
  if (!stats || stats["wallet"] !== address || !Array.isArray(workers)) {
    const err = record(doc["error"]);
    if (
      notFoundStatus(doc["status"]) ||
      notFoundStatus(doc["error"]) ||
      (err && notFoundStatus(err["status"]))
    ) {
      throw new Error("not-found");
    }
    throw new Error("invalid-data");
  }

  const rows = workers.map((row) => {
    const w = record(row) ?? {};
    const name =
      typeof w["name"] === "string" ? w["name"] : w["name"] == null ? "" : String(w["name"]);
    const lastSeen = timestamp(w["lastSeen"] ?? w["lastShare"]);
    return {
      name: name.slice(0, 80),
      hashrate: rate(w["hashrate"]),
      online: onlineAt(lastSeen, now),
      lastSeen,
    };
  });

  const balance = atomic(stats["unlocked"]);
  const pendingEstimate = atomic(stats["locked"]);
  const paid = atomic(stats["paid"]);
  const hashrate = rate(stats["hashrate"]);
  const reward = reward24h(doc);
  const accepted = rate(stats["acceptedShares"]);
  return {
    balance,
    paid,
    reward,
    period: "rolling24h",
    pendingEstimate,
    workers: rows,
    workerCount: rows.length,
    partial:
      balance == null ||
      pendingEstimate == null ||
      paid == null ||
      hashrate == null ||
      reward == null,
    hashrate,
    lastShare: timestamp(stats["lastShare"]),
    acceptedShares: accepted !== null && Number.isSafeInteger(accepted) ? accepted : null,
  };
}
