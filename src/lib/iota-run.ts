export type OfficialRun = { id: string; stale: boolean };

/** Use the selected official roster record, never an Agent log or an unrelated active run. */
export function officialRun(view: {
  miner?: { run_id?: string } | null;
  statusStale: boolean;
}): OfficialRun | null {
  const id = view.miner?.run_id;
  return id && /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(id)
    ? { id, stale: view.statusStale }
    : null;
}

export function distinctRuns(runs: Array<OfficialRun | null | undefined>): OfficialRun[] {
  const unique = new Map<string, OfficialRun>();
  for (const run of runs) {
    if (!run) continue;
    const previous = unique.get(run.id);
    if (!previous || (previous.stale && !run.stale)) unique.set(run.id, run);
  }
  return [...unique.values()].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}
