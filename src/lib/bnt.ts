import { base58 } from "@scure/base";
import { sha3_256 } from "@noble/hashes/sha3.js";
const record = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
import type { PoolAccount } from "./pool-monitor";
/** Seine src/address.rs: 64-byte public payload + tagged mainnet SHA3 checksum. */
export function validBntAddress(address: string) {
  if (!/^[1-9A-HJ-NP-Za-km-z]{68,93}$/.test(address)) return false;
  try {
    const bytes = base58.decode(address);
    if (bytes.length !== 68) return false;
    const tag = new TextEncoder().encode("blocknet_stealth_address_checksumblocknet_mainnet");
    const digest = sha3_256(new Uint8Array([...tag, ...bytes.slice(0, 64)]));
    return bytes.slice(64).every((n, i) => n === digest[i]);
  } catch {
    return false;
  }
}
const finite = (n: unknown) => (typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null);
const money = (n: unknown) =>
  typeof n === "number" && Number.isSafeInteger(n) && n >= 0 ? n / 1e8 : null;
/** The miner API returns its latest 50 payouts, so a full page must cover the cutoff. */
function confirmedPayouts24h(raw: unknown, now: number): number | null {
  if (!Array.isArray(raw)) return null;
  const payouts = raw.map((value) => {
    const p = record(value), timestamp = record(p["timestamp"]);
    return { amount: money(p["amount"]), seconds: finite(timestamp["secs_since_epoch"]), confirmed: p["confirmed"] };
  });
  if (payouts.some((p) => p.amount === null || p.seconds === null || typeof p.confirmed !== "boolean")) return null;
  const cutoff = now / 1000 - 86400;
  if (payouts.length >= 50 && !payouts.some((p) => p.seconds! <= cutoff)) return null;
  return payouts.reduce((total, p) => total +
    (p.confirmed && p.seconds! > cutoff && p.seconds! <= now / 1000 ? p.amount! : 0), 0);
}
export function parseBnt(
  miner: unknown,
  balance: unknown,
  address: string,
  now = Date.now(),
): PoolAccount {
  const m = record(miner),
    b = record(balance),
    values = record(b["balance"]),
    estimate = record(b["pending_estimate"]);
  if (
    !validBntAddress(address) ||
    (balance !== null && b["address"] !== address) ||
    !Array.isArray(m["workers"]) ||
    m["workers"].length > 5000 ||
    finite(m["hashrate"]) === null
  )
    throw new Error("invalid-data");
  const workers = m["workers"].map(record).map((w) => {
    const raw = finite(w["last_share_at"]),
      at = raw === null ? null : raw < 1e12 ? raw * 1000 : raw;
    const seen = at !== null && at <= now ? at : null;
    return {
      name: typeof w["worker"] === "string" ? w["worker"].slice(0, 80) : "",
      hashrate: finite(w["hashrate"]),
      lastSeen: seen,
      online: seen === null ? null : now - seen <= 900000,
    };
  });
  const confirmed = money(values["pending_confirmed"]),
    queued = money(values["pending_queued"]),
    paid = money(values["paid"]),
    pending = money(estimate["estimated_pending"]);
  if (
    m["mining_since"] === null &&
    workers.length === 0 &&
    Array.isArray(m["shares"]) &&
    m["shares"].length === 0 &&
    Array.isArray(m["payouts"]) &&
    m["payouts"].length === 0 &&
    paid === 0 &&
    confirmed === 0 &&
    queued === 0 &&
    pending === 0
  )
    throw new Error("not-found");
  return {
    balance: confirmed,
    paid,
    reward: confirmedPayouts24h(m["payouts"], now),
    period: "rolling24h",
    pendingEstimate: pending,
    queued,
    workers,
    workerCount: workers.length,
    hashrate: finite(m["hashrate"]),
    partial: confirmed === null || queued === null || paid === null || pending === null,
  };
}
