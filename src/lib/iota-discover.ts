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
