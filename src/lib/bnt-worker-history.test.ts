import { expect, it } from "vitest";
import { workerHistoryPoints, workerSparkline } from "./bnt-worker-history";
it("keeps Worker identity, real zero, and unknown missing samples separate", () => {
  const samples = [
    {
      at: 1000,
      workers: [
        { name: "a", hashrate: 0 },
        { name: "b", hashrate: 9 },
      ],
    },
    { at: 2000, workers: [{ name: "b", hashrate: 10 }] },
  ];
  expect(workerHistoryPoints(samples, "a", 3000)).toEqual([
    { at: 1000, hashrate: 0 },
    { at: 2000, hashrate: null },
  ]);
  expect(workerHistoryPoints(samples, "b", 3000).map((p) => p.hashrate)).toEqual([9, 10]);
});
it("limits history to 24 hours and deduplicates identical observations", () => {
  const now = 100000000;
  expect(
    workerHistoryPoints(
      [
        { at: 1, workers: [] },
        { at: now + 1, workers: [] },
        { at: now - 1, workers: [{ name: "a", hashrate: 1 }] },
        { at: now - 1, workers: [{ name: "a", hashrate: 2 }] },
      ],
      "a",
      now,
    ),
  ).toEqual([{ at: now - 1, hashrate: 2 }]);
});
it("draws one observation as a point, and does not bridge unknown or long gaps", () => {
  expect(workerSparkline([{ at: 1000, hashrate: 0 }])[0]).toHaveLength(1);
  expect(
    workerSparkline([
      { at: 1000, hashrate: 1 },
      { at: 2000, hashrate: null },
      { at: 3000, hashrate: 2 },
    ]),
  ).toHaveLength(2);
  expect(
    workerSparkline([
      { at: 1000, hashrate: 1 },
      { at: 1000000, hashrate: 2 },
    ]),
  ).toHaveLength(2);
  expect(workerSparkline([{ at: 1000, hashrate: null }])).toEqual([]);
});
