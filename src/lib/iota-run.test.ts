import { describe, expect, it } from "vitest";
import { distinctRuns, officialRun } from "./iota-run";

describe("official roster run labels", () => {
  it("uses the selected miner's exact run without inferring a tier or a suffix", () => {
    expect(officialRun({ miner: { run_id: "4.13.7.11-tah" }, statusStale: false }))
      .toEqual({ id: "4.13.7.11-tah", stale: false });
  });
  it("does not invent a current run when the miner is absent", () => {
    expect(officialRun({ miner: null, statusStale: false })).toBeNull();
    expect(officialRun({ miner: { run_id: "" }, statusStale: false })).toBeNull();
  });
  it("marks retained roster data as old and rejects malformed IDs", () => {
    expect(officialRun({ miner: { run_id: "4.13.7.11-tah" }, statusStale: true })?.stale).toBe(true);
    expect(officialRun({ miner: { run_id: "<script>" }, statusStale: false })).toBeNull();
  });
  it("aggregates distinct device runs and prefers fresh evidence for duplicates", () => {
    expect(distinctRuns([
      { id: "4.13.7.11-tah", stale: true }, null,
      { id: "4.13.7.9-tah", stale: false },
      { id: "4.13.7.11-tah", stale: false },
    ])).toEqual([{ id: "4.13.7.9-tah", stale: false }, { id: "4.13.7.11-tah", stale: false }]);
  });
});
