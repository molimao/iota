import type { PoolAccount } from "./pool-monitor";
const record = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const number = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null);
const amount = (v: unknown) =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= 0 ? v / 1e8 : null;
export const normalizeCsdAddress = (v: string) => v.toLowerCase().replace(/^0x/, "");
export const validCsdAddress = (v: string) => /^(?:0x)?[0-9a-fA-F]{40}$/.test(v);
/** G-pools amounts are atomic *_sat fields; windowed frontend income is an estimate, not a ledger. */
export function parseCsd(
  account: unknown,
  rates: unknown,
  address: string,
  now = Date.now(),
): PoolAccount {
  const d = record(account),
    r = record(rates),
    id = normalizeCsdAddress(address);
  if (
    !validCsdAddress(address) ||
    typeof d["address"] !== "string" ||
    normalizeCsdAddress(d["address"]) !== id ||
    !Array.isArray(d["rigs"]) ||
    d["rigs"].length > 5000
  )
    throw new Error("invalid-data");
  const at = number(r["now"]),
    fresh = at !== null && at * 1000 <= now + 30000 && now - at * 1000 <= 300000;
  const row = (Array.isArray(record(r["win"])["1h"]) ? (record(r["win"])["1h"] as unknown[]) : [])
    .map(record)
    .find((x) => typeof x["m"] === "string" && normalizeCsdAddress(x["m"]) === id);
  const keyed = Object.entries(record(r["rigs"])).find(([k]) => normalizeCsdAddress(k) === id)?.[1];
  const rigRates = (Array.isArray(keyed) ? keyed : []).map(record);
  const workers = d["rigs"].map(record).map((w) => {
    const ts = number(w["last_seen"]),
      seen = ts !== null && ts * 1000 <= now ? ts * 1000 : null;
    const hr = rigRates.find((v) => v["rig"] === w["rig"]);
    return {
      name: typeof w["rig"] === "string" ? w["rig"].slice(0, 80) : "",
      hashrate: fresh ? number(hr?.["hr1h"]) : null,
      lastSeen: seen,
      online: seen === null ? null : now - seen <= 900000,
    };
  });
  const balance = amount(d["owed_sat"]),
    paid = amount(d["lifetime_paid_sat"]),
    pending = amount(d["pending_sat"]);
  if (
    workers.length === 0 &&
    balance === 0 &&
    paid === 0 &&
    pending === 0 &&
    d["shares_accepted"] === 0 &&
    Array.isArray(d["payments"]) &&
    d["payments"].length === 0
  )
    throw new Error("not-found");
  const hashrate = fresh ? number(row?.["hr1h"]) : null;
  return {
    balance,
    paid,
    pendingEstimate: pending,
    reward: null,
    period: "unknown",
    hashrate,
    workers,
    workerCount: workers.length,
    partial:
      balance === null ||
      paid === null ||
      pending === null ||
      hashrate === null ||
      workers.some((w) => w.hashrate === null),
  };
}
