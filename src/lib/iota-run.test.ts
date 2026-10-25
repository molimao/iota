import { describe, expect, it } from "vitest";
import { appReferenceRun, distinctRuns, officialRun } from "./iota-run";
import { parseUpstreamPayload } from "./iota-api-schema";

describe("official roster run labels", () => {
  it("matches the desktop public fallback without treating it as a device assignment", () => {
    expect(
      appReferenceRun(
        [
          { run_id: "other", state: "active", name: "Other" },
          {
            run_id: "4.13.7.10-tah",
            state: "active",
            name: "Pool",
            metadata: { is_miner_pool: true },
          },
          {
            run_id: "4.13.7.11-tah",
            state: "active",
            name: "Pool",
            metadata: { is_miner_pool: true },
          },
        ],
        false,
      ),
    ).toEqual({ id: "4.13.7.10-tah", stale: false, kind: "reference" });
    expect(appReferenceRun([], false)).toBeNull();
  });
  it("preserves the official pool flag through the public API parser", () => {
    const result = parseUpstreamPayload("/runs", {
      runs: [
        {
          run_id: "4.13.7.10-tah",
          state: "active",
          name: "Pool",
          metadata: { is_miner_pool: true },
        },
      ],
    }) as { runs: import("./iota-types").RunInfo[] };
    expect(appReferenceRun(result.runs, true)).toEqual({
      id: "4.13.7.10-tah",
      stale: true,
      kind: "reference",
    });
  });
  it("uses the selected miner's exact run without inferring a tier or a suffix", () => {
    expect(officialRun({ miner: { run_id: "4.13.7.11-tah" }, statusStale: false })).toEqual({
      id: "4.13.7.11-tah",
      stale: false,
    });
  });
  it("does not invent a current run when the miner is absent", () => {
    expect(officialRun({ miner: null, statusStale: false })).toBeNull();
    expect(officialRun({ miner: { run_id: "" }, statusStale: false })).toBeNull();
  });
  it("marks retained roster data as old and rejects malformed IDs", () => {
    expect(officialRun({ miner: { run_id: "4.13.7.11-tah" }, statusStale: true })?.stale).toBe(
      true,
    );
    expect(officialRun({ miner: { run_id: "<script>" }, statusStale: false })).toBeNull();
  });
  it("aggregates distinct device runs and prefers fresh evidence for duplicates", () => {
    expect(
      distinctRuns([
        { id: "4.13.7.11-tah", stale: true },
        null,
        { id: "4.13.7.9-tah", stale: false },
        { id: "4.13.7.11-tah", stale: false },
      ]),
    ).toEqual([
      { id: "4.13.7.9-tah", stale: false },
      { id: "4.13.7.11-tah", stale: false },
    ]);
  });
});
