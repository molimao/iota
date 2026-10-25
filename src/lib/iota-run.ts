import type { RunInfo } from "./iota-types";
export type OfficialRun = { id: string; stale: boolean; kind?: "reference" };

/** Same public fallback as the official desktop Global Overview, not a miner assignment. */
export function appReferenceRun(
  runs: RunInfo[] | null | undefined,
  stale: boolean,
): OfficialRun | null {
  const run = runs?.find((r) => r.metadata?.is_miner_pool === true);
  return run ? { id: run.run_id, stale, kind: "reference" } : null;
}

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
    if (
      !previous ||
      (previous.kind === "reference" && run.kind !== "reference") ||
      (previous.kind === run.kind && previous.stale && !run.stale)
    )
      unique.set(run.id, run);
  }
  return [...unique.values()].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
}
