import type { DiscoveryResult } from "./iota-types";

export function hintRunIdsFromDevices(
  devices:
    | Array<{ runIds?: string[]; miner?: { run_id?: string } | null }>
    | undefined,
): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const device of devices ?? []) {
    for (const id of device.runIds ?? []) {
      if (!id || seen.has(id)) continue;
      seen.add(id);
      ids.push(id);
    }
    const runId = device.miner?.run_id;
    if (runId && !seen.has(runId)) {
      seen.add(runId);
      ids.push(runId);
    }
  }
  return ids;
}

/** Prefer runs we already saw these miners on, so we do not list every task first. */
export function orderActiveRuns<T extends { run_id: string }>(runs: T[], hintRunIds: string[]): T[] {
  const hinted = new Set(hintRunIds);
  const first: T[] = [];
  const rest: T[] = [];
  for (const run of runs) (hinted.has(run.run_id) ? first : rest).push(run);
  return [...first, ...rest];
}

/** Keep the last known miner when a later poll times out or skips that list. */
export function mergeDiscovery(
  next: DiscoveryResult,
  previous: DiscoveryResult | undefined,
): DiscoveryResult {
  if (!previous?.devices.length) return next;
  const oldByHotkey = new Map(previous.devices.map((device) => [device.hotkey, device]));
  return {
    ...next,
    devices: next.devices.map((device) => {
      if (device.miner) return device;
      const old = oldByHotkey.get(device.hotkey);
      if (!old?.miner) return device;
      return {
        ...device,
        miner: old.miner,
        runIds: device.runIds.length ? device.runIds : old.runIds,
        fetchedAt: device.fetchedAt ?? old.fetchedAt,
      };
    }),
    fetchedAt: next.fetchedAt ?? previous.fetchedAt,
  };
}
