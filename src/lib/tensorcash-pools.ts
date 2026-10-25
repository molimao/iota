import { record } from "./projects";
import type { PoolAccount, PoolWorker } from "./pool-monitor";
const num = (v: unknown): number | null => {
  if (typeof v !== "number" && !(typeof v === "string" && /^\d+(\.\d+)?$/.test(v))) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};
const atomic = (v: unknown) => {
  const n = num(v);
  return n !== null && Number.isSafeInteger(n) ? n / 1e8 : null;
};
const time = (v: unknown) => {
  if (typeof v === "string" && !/^\d+(\.\d+)?$/.test(v)) {
    const t = Date.parse(v);
    return Number.isFinite(t) ? t : null;
  }
  const n = num(v);
  return n && n > 0 ? (n < 1e12 ? n * 1000 : n) : null;
};
const base = (): PoolAccount => ({
  balance: null,
  paid: null,
  reward: null,
  period: "unknown",
  workers: [],
  workerCount: 0,
  partial: true,
  hashrate: null,
});
/** Fields are from the pools' own public frontends; balances never imply mining income. */
export function parseTscBob(input: unknown, address: string): PoolAccount {
  const a = record(input);
  if (a["wallet"] !== address || !Array.isArray(a["machines"])) throw new Error("invalid-data");
  const workers = a["machines"].map((v): PoolWorker => {
    const w = record(v);
    return {
      name: String(w["label"] ?? "").slice(0, 80),
      hashrate: num(w["draws_per_sec"]),
      rateUnit: "PoI/s",
      online: typeof w["connected"] === "boolean" ? w["connected"] : null,
      lastSeen: time(w["last_share"]),
    };
  });
  if (
    a["total_shares"] === 0 &&
    a["connected"] === false &&
    !workers.length &&
    a["paid"] === 0 &&
    a["owed"] === 0
  )
    throw new Error("not-found");
  return {
    ...base(),
    balance: num(a["owed"]),
    paid: num(a["paid"]),
    pendingEstimate: num(a["pending"]),
    workers,
    workerCount: num(a["n_machines"]) ?? workers.length,
    hashrate: num(a["draws_per_sec"]),
    rateUnit: "PoI/s",
    partial: !("owed" in a) || !("paid" in a),
  };
}
export function parseTscTiger(input: unknown, address: string): PoolAccount {
  const a = record(input),
    w = record(a["wallet"]);
  if (w["Wallet"] !== address || !Array.isArray(a["workers"])) throw new Error("invalid-data");
  const workers = a["workers"].map((v): PoolWorker => {
    const r = record(v);
    const state = String(r["ConnectionStatus"] ?? "").toLowerCase();
    return {
      name: String(r["WorkerID"] ?? "").slice(0, 80),
      hashrate: num(r["Hashrate"]),
      rateUnit: "N/s",
      online:
        state === "online" || state === "connected" || r["MiningStatus"] === "mining"
          ? true
          : state === "offline" || state === "disconnected"
            ? false
            : null,
      lastSeen: time(r["LastShareAt"]),
    };
  });
  return {
    ...base(),
    balance: atomic(w["BalanceSats"]),
    paid: atomic(w["PaidSats"]),
    pendingEstimate: atomic(w["ImmatureSats"]),
    reward: atomic(w["ActualEarnings24hSats"] ?? w["actual_earnings_24h_sats"]),
    period: "rolling24h",
    workers,
    workerCount: workers.length,
    hashrate:
      workers.length && workers.every((r) => r.hashrate !== null)
        ? workers.reduce((sum, r) => sum + r.hashrate!, 0)
        : null,
    rateUnit: "N/s",
  };
}
export function parseTscAria(input: unknown, now = Date.now()): PoolAccount {
  const a = record(input);
  if (!Array.isArray(a["workers"]) || num(a["hashrate"]) === null) throw new Error("invalid-data");
  const workers = a["workers"].map((v): PoolWorker => {
    const w = record(v),
      age = num(w["last_share_s"]);
    return {
      name: String(w["worker"] ?? "").slice(0, 80),
      hashrate: num(w["hashrate"]),
      rateUnit: "PoI/s",
      lastSeen: age === null ? null : now - age * 1000,
      online: age === null ? null : age < 1200 ? true : age > 1800 ? false : null,
    };
  });
  return {
    ...base(),
    balance: atomic(a["owed"]),
    paid: atomic(a["paid"]),
    workers,
    workerCount: workers.length,
    hashrate: num(a["hashrate"]),
    rateUnit: "PoI/s",
  };
}
export function parseTscSuprnova(input: unknown, now = Date.now()): PoolAccount {
  const a = record(input),
    p = record(a["performance"]);
  if (!("pendingBalance" in a) || !("workers" in p)) throw new Error("invalid-data");
  const ts = time(p["created"]),
    fresh = ts !== null && now - ts < 300000;
  const workers = Object.entries(record(p["workers"])).map(([name, v]): PoolWorker => {
    const w = record(v);
    return {
      name: name.slice(0, 80),
      hashrate: num(w["hashrate"]),
      rateUnit: "PoI/s",
      online: fresh && num(w["hashrate"]) !== null ? num(w["hashrate"])! > 0 : null,
      lastSeen: null,
    };
  });
  if (
    a["totalPaid"] === "0.0000000000" &&
    a["pendingBalance"] === 0 &&
    !workers.length &&
    Array.isArray(a["performanceSamples"]) &&
    !a["performanceSamples"].length
  )
    throw new Error("not-found");
  return {
    ...base(),
    balance: num(a["pendingBalance"]),
    paid: num(a["totalPaid"]),
    pendingEstimate: num(a["unconfirmedBalance"]),
    workers,
    workerCount: workers.length,
    hashrate:
      workers.length && workers.every((w) => w.hashrate !== null)
        ? workers.reduce((s, w) => s + w.hashrate!, 0)
        : null,
    rateUnit: "PoI/s",
  };
}
