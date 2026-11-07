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

const atomicInteger = (v: unknown): number | null => {
  const n = typeof v === "string" && /^(0|[1-9]\d*)$/.test(v) ? Number(v) : v;
  return typeof n === "number" && Number.isSafeInteger(n) && n >= 0 ? n : null;
};
/** Atomic PRL as a safe nonnegative integer, scaled to coins. Missing or unusable → null. */
const atomic = (v: unknown): number | null => {
  const n = atomicInteger(v);
  return n === null ? null : n / COIN_UNITS;
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

export function luckyPoolDayUnits(
  config: unknown,
  input: unknown,
  address: string,
  window: { start: number; end: number },
): string | null {
  const cfg = record(config), doc = record(input);
  if (
    cfg?.["symbol"] !== "PRL" ||
    cfg["coinUnits"] !== COIN_UNITS ||
    record(doc?.["stats"])?.["wallet"] !== address ||
    !Array.isArray(doc?.["rewards"]) ||
    !Array.isArray(doc["rewardStats"])
  ) return null;
  const rewards: { at: number; units: bigint }[] = [];
  const hashes = new Set<string>();
  for (const value of doc["rewards"]) {
    const row = record(value);
    const at = timestamp(row?.["timestamp"]);
    const units = atomicInteger(row?.["minerReward"]);
    const hash = row?.["hash"];
    if (at === null || units === null || typeof hash !== "string" || !hash || hashes.has(hash))
      return null;
    hashes.add(hash);
    rewards.push({ at, units: BigInt(units) });
  }
  // The recent list is capped. An enclosing pool total can prove coverage
  // even when the miner has no reward before the requested midnight.
  const covered = doc["rewardStats"].some((value) => {
    const row = record(value);
    const start = timestamp(row?.["startTime"]), end = timestamp(row?.["endTime"]);
    const amount = atomicInteger(row?.["amount"]);
    if (start === null || end === null || start > window.start || end < window.end || amount === null)
      return false;
    const enclosing = rewards.filter((reward) => reward.at >= start && reward.at < end);
    return enclosing.length === row?.["blocks"] &&
      enclosing.reduce((sum, reward) => sum + reward.units, 0n) === BigInt(amount);
  });
  if (!covered) return null;
  return rewards
    .filter((reward) => reward.at >= window.start && reward.at < window.end)
    .reduce((sum, reward) => sum + reward.units, 0n)
    .toString();
}

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
