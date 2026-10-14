import { mapConcurrent } from "./concurrent";
import { fetchUpstream, TTL } from "./iota-upstream.server";
import { isValidMinerId } from "./ss58";
import type { MinerRecord, RunInfo } from "./iota-types";
export type WalletDiscovery = {
  hotkeys: string[];
  runsTotal: number;
  runsFetched: number;
  fullCoverage: boolean;
  truncated: boolean;
};
/** Match an exact public coldkey against every active roster; no wallet signing. */
export async function discoverWalletMiners(
  coldkey: string,
  request: typeof fetchUpstream = fetchUpstream,
): Promise<WalletDiscovery> {
  if (!isValidMinerId(coldkey)) throw new Error("invalid_wallet");
  const runs = await request<{ runs: RunInfo[] }>("/runs", TTL.runs, false);
  const active = [
    ...new Map(
      (runs.data?.runs ?? []).filter((r) => r.state === "active").map((r) => [r.run_id, r]),
    ).values(),
  ];
  const hotkeys = new Set<string>();
  let runsFetched = 0,
    truncated = false;
  await mapConcurrent(active, 3, async (run) => {
    const list = await request<{ miners: MinerRecord[] }>(
      `/miners?run_id=${encodeURIComponent(run.run_id)}`,
      TTL.miners,
      false,
    );
    if (list.data && !list.error && !list.stale) runsFetched++;
    for (const miner of list.data?.miners ?? []) {
      if (miner.coldkey !== coldkey || !isValidMinerId(miner.hotkey)) continue;
      if (hotkeys.size < 200 || hotkeys.has(miner.hotkey)) hotkeys.add(miner.hotkey);
      else truncated = true;
    }
  });
  return {
    hotkeys: [...hotkeys].sort(),
    runsTotal: active.length,
    runsFetched,
    fullCoverage: !!runs.data && !runs.error && !runs.stale && runsFetched === active.length,
    truncated,
  };
}
