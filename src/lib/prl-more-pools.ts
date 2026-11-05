import { finite, record } from "./projects";
import type { PoolAccount, PoolWorker } from "./pool-monitor";

const PRL_ATOMIC = 100_000_000;
const TEN_MINUTES = 600_000;

function decimal(value: unknown) {
  return typeof value === "string" && /^\d+(?:\.\d+)?$/.test(value)
    ? finite(Number(value))
    : finite(value);
}

function prl(value: unknown) {
  const amount = decimal(value);
  return amount === null ? null : amount / PRL_ATOMIC;
}

function epoch(value: unknown) {
  const seconds = decimal(value);
  return seconds ? seconds * 1000 : null;
}

function activeShare(lastSeen: number | null, now: number) {
  return lastSeen === null ? null : now - lastSeen <= TEN_MINUTES;
}

function workerName(value: unknown) {
  return typeof value === "string" ? value : "";
}

function account(
  workers: PoolWorker[],
  fields: Omit<PoolAccount, "workers" | "workerCount" | "reward" | "period" | "partial">,
  reward: number | null = null,
  partial = false,
): PoolAccount {
  return {
    ...fields,
    workers,
    workerCount: workers.length,
    reward,
    period: reward === null ? "unknown" : "rolling24h",
    partial: partial || fields.balance === null || fields.paid === null,
  };
}

export function parsePearlHash(input: unknown): PoolAccount {
  const { connected_workers, balance_transactions, pending_rewards } = record(input);
  if (!Array.isArray(connected_workers) || !Array.isArray(balance_transactions))
    throw new Error("invalid-data");

  const ledger = balance_transactions
    .map(record)
    .filter(({ coin_type }) => coin_type === "pearl" || coin_type == null);
  let balance = 0;
  let paid = 0;
  for (const { amount, reason } of ledger) {
    if (typeof amount !== "number" || !Number.isFinite(amount)) throw new Error("invalid-data");
    balance += amount;
    // The pool explicitly marks its "Adjusted payout" as a correction without a transfer.
    if (amount < 0 && (reason === "Auto Payment" || reason === "Payment")) paid -= amount;
  }
  const workers = connected_workers.map(record).map(({ worker_name, gpu_info }): PoolWorker => {
    const rates = Array.isArray(gpu_info)
      ? gpu_info.map((gpu) => finite(record(gpu)["hashrate"]))
      : [];
    return {
      name: workerName(worker_name),
      online: true,
      lastSeen: null,
      hashrate:
        rates.length && rates.every((rate) => rate !== null)
          ? rates.reduce((sum, rate) => sum + rate, 0)
          : null,
    };
  });
  const pendingEstimate = finite(record(pending_rewards)["total_pending_prl"]);
  if (!workers.length && !ledger.length && pendingEstimate === 0) throw new Error("not-found");
  return account(workers, {
    balance: finite(Number(balance.toFixed(8))),
    paid: Number(paid.toFixed(8)),
    pendingEstimate,
    hashrate: workers.every((worker) => worker.hashrate !== null)
      ? workers.reduce((sum, worker) => sum + worker.hashrate!, 0)
      : null,
  });
}

export function parseHeroMiners(input: unknown, now = Date.now()): PoolAccount {
  const { stats, workers: rows, unconfirmed, error } = record(input);
  if (error === "Not found") throw new Error("not-found");
  if (!stats || !Array.isArray(rows)) throw new Error("invalid-data");
  const { balance, paid, hashrate, lastShare, realHashrate } = record(stats);
  // HeroMiners' Pearl API reports difficulty work, with real hashrate scaled by 2^32.
  const heroRate = (raw: unknown, real: unknown) => {
    const work = decimal(raw);
    return decimal(real) ?? (work === null ? null : work * 2 ** 32);
  };
  const workers = rows.map(record).map((worker): PoolWorker => {
    const lastSeen = epoch(worker["lastShare"]);
    return {
      name: workerName(worker["name"]),
      lastSeen,
      online: activeShare(lastSeen, now),
      hashrate: heroRate(worker["hashrate"], worker["realHashrate"]),
    };
  });
  const rewards = Array.isArray(unconfirmed)
    ? unconfirmed.map(record).map((block) => decimal(block["reward"]))
    : null;
  const pendingEstimate = rewards?.every((reward) => reward !== null)
    ? rewards.reduce((sum, reward) => sum + reward, 0) / PRL_ATOMIC
    : null;
  return account(workers, {
    balance: prl(balance),
    paid: prl(paid),
    pendingEstimate,
    lastShare: epoch(lastShare),
    hashrate: heroRate(hashrate, realHashrate),
    hashrateWindow: "10min",
  });
}

function alphaRate(value: unknown) {
  if (typeof value !== "string") return null;
  const match = /^(\d+(?:\.\d+)?)\s*([KMGTPE]?)H\/s$/.exec(value);
  return match ? finite(Number(match[1]) * 1000 ** " KMGTPE".indexOf(match[2] || " ")) : null;
}

export function parseAlphaPool(input: unknown, address: string): PoolAccount {
  const {
    address: wallet,
    workers: rows,
    estHash1hRaw,
    balance_prl,
    total_paid_prl,
    last_seen,
  } = record(input);
  if (wallet !== address || !Array.isArray(rows)) throw new Error("invalid-data");
  const workers = rows.map(record).map(({ name, hashrate_1h, time, online }): PoolWorker => ({
    name: workerName(name),
    hashrate: alphaRate(hashrate_1h),
    lastSeen: epoch(time),
    online: typeof online === "boolean" ? online : null,
  }));
  return account(workers, {
    balance: decimal(balance_prl),
    paid: decimal(total_paid_prl),
    lastShare: epoch(last_seen),
    hashrate: decimal(estHash1hRaw),
    hashrateWindow: "1hr",
  });
}

export function parsePearlski(input: unknown, address: string, now = Date.now()): PoolAccount {
  const {
    address: wallet,
    workers: rows,
    stats_as_of,
    current_balance_grains,
    pending_balance_grains,
    total_paid_grains,
    hashrate_1h,
    last_share_time,
    rolling_24h_mined_grains,
    rolling_24h_mined_pending_grains,
    rolling_24h_mined_window_start,
    rolling_24h_mined_window_end,
  } = record(input);
  if (wallet !== address || !Array.isArray(rows)) throw new Error("invalid-data");
  const lastShare = epoch(last_share_time);
  const balance = prl(current_balance_grains);
  const pendingEstimate = prl(pending_balance_grains);
  const paid = prl(total_paid_grains);
  if (!rows.length && lastShare === null && balance === 0 && pendingEstimate === 0 && paid === 0)
    throw new Error("not-found");

  const prefix = `${address}.`;
  const sampleTime = epoch(stats_as_of) ?? now;
  const workers = rows.map(record).map(({ worker, hashrate_1h, last_share_time }): PoolWorker => {
    const lastSeen = epoch(last_share_time);
    const name = workerName(worker);
    return {
      name: name.startsWith(prefix) ? name.slice(prefix.length) : name === address ? "" : name,
      hashrate: decimal(hashrate_1h),
      lastSeen,
      online: activeShare(lastSeen, sampleTime),
    };
  });
  const mined = decimal(rolling_24h_mined_grains);
  const pending = decimal(rolling_24h_mined_pending_grains);
  const start = epoch(rolling_24h_mined_window_start);
  const end = epoch(rolling_24h_mined_window_end);
  const reward =
    mined !== null &&
    pending !== null &&
    mined >= pending &&
    start !== null &&
    end !== null &&
    end - start === 86_400_000
      ? (mined - pending) / PRL_ATOMIC
      : null;

  return account(
    workers,
    {
      balance,
      pendingEstimate,
      paid,
      lastShare,
      hashrate: decimal(hashrate_1h),
      hashrateWindow: "1hr",
    },
    reward,
  );
}

export function parsePearlFortune(
  input: unknown,
  connections: unknown,
  ledger: unknown,
): PoolAccount {
  const { chain, balance, pending_shares, hourly_shares } = record(record(input)["data"]);
  if (chain !== "pearl") throw new Error("invalid-data");
  const connectionData = record(record(connections)["data"]);
  const rows = connectionData["workers"];
  const workerListAvailable = connectionData["configured"] === true && Array.isArray(rows);
  const workers = workerListAvailable
    ? rows.map(record).map((worker): PoolWorker => ({
        name: workerName(worker["worker"]),
        hashrate: decimal(record(worker["pool"])["hashrate"]),
        online: true,
        lastSeen: null,
      }))
    : [];

  const ledgerData = record(record(ledger)["data"]);
  const paid =
    ledgerData["chain_name"] === "pearl" ? prl(ledgerData["sum_payout_amount_atomic"]) : null;
  const pending = record(pending_shares);
  const pplns = prl(
    pending[
      pending["pending_fee_quote"] ? "pending_net_amount_atomic" : "pending_gross_amount_atomic"
    ],
  );
  const pps = decimal(pending["pps_pending_amount_q64"]);
  const pendingEstimate =
    pplns !== null && pps !== null ? pplns + pps / 2 ** 64 / PRL_ATOMIC : null;
  const rates = record(hourly_shares)["rolling_hashrates"];
  const hour = Array.isArray(rates)
    ? rates.map(record).find((row) => row["hours"] === 1)
    : undefined;
  const hashrate = decimal(
    record(hour?.["share_statistics"])["effective_hashrate"] ?? hour?.["hashrate"],
  );
  const owed = prl(record(balance)["balance_atomic"]);
  if (
    balance == null &&
    paid === 0 &&
    pendingEstimate === 0 &&
    hashrate === 0 &&
    workerListAvailable &&
    !workers.length &&
    ledgerData["total"] === 0
  )
    throw new Error("not-found");

  return account(
    workers,
    { balance: owed, paid, pendingEstimate, hashrate },
    null,
    !workerListAvailable,
  );
}
