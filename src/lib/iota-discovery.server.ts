import { mapConcurrent } from "./concurrent";
import { orderActiveRuns } from "./iota-discover";
import { fetchUpstream, TTL, type UpstreamResult } from "./iota-upstream.server";
import type { DiscoveryResult, MinerRecord, RunInfo } from "./iota-types";

export async function discoverOfficialDevices(
  hotkeys: string[],
  force: boolean,
  hintRunIds: string[],
  request: typeof fetchUpstream = fetchUpstream,
): Promise<DiscoveryResult> {
  const result = await request<{ runs: RunInfo[] }>("/runs", TTL.runs, force);
  const errors: string[] = result.error ? [`训练任务列表：${result.error}`] : [];
  const active = orderActiveRuns(
    (result.data?.runs ?? []).filter((run) => run.state === "active"),
    hintRunIds,
  );
  const wanted = new Set(hotkeys);
  const best = new Map<
    string,
    { miner: MinerRecord; fetchedAt: number | null; runIds: Set<string>; stale: boolean }
  >();
  let runsFetched = 0;
  const clocks: number[] = [];
  // Each worker joins the proxy's singleflight cache, also used by the network page.
  // Scan every active run: finding one device early is not full coverage.
  await mapConcurrent(active, 3, async (run) => {
    const list: UpstreamResult<{ miners: MinerRecord[] }> = await request(
      `/miners?run_id=${encodeURIComponent(run.run_id)}`,
      TTL.miners,
      force,
    );
    if (list.error) errors.push(`任务 ${run.run_id}：${list.error}`);
    if (list.data && !list.error && !list.stale) {
      runsFetched += 1;
      if (list.fetchedAt !== null) clocks.push(list.fetchedAt);
    }
    for (const raw of list.data?.miners ?? []) {
      if (!wanted.has(raw.hotkey)) continue;
      const miner = { ...raw, run_id: raw.run_id || run.run_id };
      const current = best.get(miner.hotkey);
      if (!current) {
        best.set(miner.hotkey, {
          miner,
          fetchedAt: list.fetchedAt,
          runIds: new Set([miner.run_id]),
          stale: list.stale,
        });
      } else {
        current.runIds.add(miner.run_id);
        // Prefer a successful roster over stale data, then the newest sample.
        if (
          (current.stale && !list.stale) ||
          (current.stale === list.stale && miner.timestamp >= current.miner.timestamp)
        ) {
          current.miner = miner;
          current.fetchedAt = list.fetchedAt;
          current.stale = list.stale;
        }
      }
    }
  });
  const fullCoverage =
    result.data !== null && !result.error && !result.stale && runsFetched === active.length;
  return {
    devices: hotkeys.map((hotkey) => {
      const entry = best.get(hotkey);
      return {
        hotkey,
        miner: entry?.miner ?? null,
        fetchedAt: entry?.fetchedAt ?? null,
        runIds: entry ? [...entry.runIds] : [],
        stale: entry?.stale ?? !fullCoverage,
      };
    }),
    runs: active,
    runsTotal: active.length,
    runsFetched,
    fullCoverage,
    fetchedAt: clocks.length
      ? Math.min(...clocks)
      : fullCoverage && !active.length
        ? result.fetchedAt
        : null,
    errors,
  };
}
