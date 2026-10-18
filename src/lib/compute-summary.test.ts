import { expect, it } from "vitest";
import { computeSummary, formatCompute, type ComputeEntry } from "./compute-summary";
const now = Date.parse("2026-10-18T06:00:00Z");
const entry = (
  project: ComputeEntry["binding"]["project"],
  id: string,
  value: number | null,
  scope: NonNullable<ComputeEntry["compute"]>["scope"] = "device",
  worker = "",
): ComputeEntry => ({
  binding: { project, id: Math.random().toString(), identifier: id, worker },
  name: id,
  compute: {
    value,
    scope,
    unit: project === "iota" ? "tokens/s" : "H/s",
    fresh: true,
    fetchedAt: now,
  },
});
it("deduplicates Miner IDs and keeps projects and incompatible units separate", () => {
  const a = entry("iota", "miner", 2700),
    b = entry("iota", "second", 300);
  const groups = computeSummary(
    [a, { ...a, name: "duplicate" }, b, entry("xmr", "wallet", 500), entry("prl", "wallet", 5e6)],
    now,
  );
  expect(groups).toHaveLength(3);
  expect(groups[0]).toMatchObject({ total: 3000, count: 2, known: 2, active: 2, unit: "tokens/s" });
});
it("does not add an account total to its workers and does not double-count workers", () => {
  const a = entry("xmr", "wallet", 1000, "account"),
    b = entry("xmr", "wallet", 300, "worker", "one"),
    c = entry("xmr", "wallet", 700, "worker", "two");
  expect(computeSummary([a, b, c, b], now)[0]).toMatchObject({ total: 1000, count: 1, known: 1 });
  expect(computeSummary([b, c, b], now)[0]).toMatchObject({ total: 1000, count: 2, known: 2 });
  expect(
    computeSummary([{ ...a, compute: { ...a.compute!, fresh: false } }, b, c], now)[0],
  ).toMatchObject({ total: 1000, count: 2, known: 2 });
});
it("keeps zero valid, excludes stale/missing/nonfinite/negative/future values and exposes partial coverage", () => {
  const samples = [
    entry("iota", "zero", 0),
    entry("iota", "stale", 900),
    entry("iota", "old", 800),
    entry("iota", "missing", null),
    entry("iota", "bad", NaN),
    entry("iota", "negative", -1),
    entry("iota", "future", 10),
  ];
  samples[1]!.compute!.fresh = false;
  samples[2]!.compute!.fetchedAt = now - 300001;
  samples[6]!.compute!.fetchedAt = now + 60000;
  expect(computeSummary(samples, now)[0]).toMatchObject({
    total: 0,
    known: 1,
    count: 7,
    active: 0,
  });
  expect(computeSummary([entry("iota", "missing", null)], now)[0]?.known).toBe(0);
});
it("scales base hash units without scaling tokens or treating wallet counts as compute", () => {
  expect(formatCompute(2500000, "H/s", "en")).toEqual({ value: "2.5", unit: "MH/s" });
  expect(formatCompute(2700, "tokens/s", "en")).toEqual({ value: "2,700", unit: "tokens/s" });
  expect(
    computeSummary(
      [
        {
          binding: { id: "a", project: "flyai", identifier: "a", worker: "" },
          name: "monthly points",
        },
      ],
      now,
    ),
  ).toEqual([]);
});
