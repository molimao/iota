import type { PoolAccount } from "./pool-monitor";
import type { ReadResult } from "./read-cache";

export type BntRow = {
  id: string;
  deviceId?: string;
  name: string;
  address: string;
  worker: string;
  result?: ReadResult<PoolAccount>;
  loading?: boolean;
  failed?: boolean;
};
export function bntRowState(row: BntRow) {
  if (!row.result?.data)
    return row.loading ? "loading" : row.result?.error === "not-found" ? "notFound" : "unavailable";
  if (row.result.stale || row.result.error || row.failed) return "stale";
  if (row.worker && !row.result.data.workers.some((w) => w.name === row.worker)) return "notFound";
  const rate = row.worker
    ? row.result.data.workers.find((w) => w.name === row.worker)?.hashrate
    : row.result.data.hashrate;
  return rate == null ? "unavailable" : rate > 0 ? "mining" : "waiting";
}
/** Account balances and account hashrate are counted once per address, regardless of Worker bindings. */
export function bntTotals(rows: BntRow[]) {
  const accounts = [...new Map(rows.map((r) => [r.address, r])).values()];
  const sum = (field: "hashrate" | "balance" | "paid" | "pendingEstimate" | "queued") => {
    const known = accounts
      .map((r) =>
        field === "hashrate" && (r.result?.stale || r.result?.error || r.failed)
          ? null
          : r.result?.data?.[field],
      )
      .filter((n): n is number => n != null);
    return {
      value: known.length ? known.reduce((a, b) => a + b, 0) : null,
      known: known.length,
      total: accounts.length,
    };
  };
  return {
    hashrate: sum("hashrate"),
    balance: sum("balance"),
    paid: sum("paid"),
    pending: sum("pendingEstimate"),
    queued: sum("queued"),
    workers: accounts.reduce(
      (n, r) =>
        n +
        (r.result?.stale || r.result?.error || r.failed
          ? 0
          : (r.result?.data?.workers.filter((w) => w.online === true).length ?? 0)),
      0,
    ),
    stale: accounts.some((r) => !!r.result?.data && (r.result.stale || r.result.error || r.failed)),
  };
}

export type BntWorker = PoolAccount["workers"][number];
export function bntWorkerState(row: BntRow, worker: BntWorker) {
  if (row.result?.stale || row.result?.error || row.failed) return "stale";
  return worker.hashrate == null ? "unavailable" : worker.hashrate > 0 ? "mining" : "waiting";
}
/** A saved address is an account group; each unique Worker beneath it is one mining entry. */
export function bntAddressGroups(rows: BntRow[]) {
  const groups = new Map<string, BntRow[]>();
  for (const row of rows) groups.set(row.address, [...(groups.get(row.address) ?? []), row]);
  return [...groups.entries()].map(([address, bindings]) => {
    const account = [...bindings].sort(
      (a, b) => (b.result?.fetchedAt ?? 0) - (a.result?.fetchedAt ?? 0),
    )[0]!;
    const all = bindings.some((b) => !b.worker);
    const selected = new Set(bindings.map((b) => b.worker));
    const workers = [
      ...new Map(
        (account.result?.data?.workers ?? [])
          .filter((w) => all || selected.has(w.name))
          .map((w) => [w.name, w]),
      ).values(),
    ];
    return { address, account, bindings, workers, totalWorkers: workers.length };
  });
}
