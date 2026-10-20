import { expect, it } from "vitest";
import { bntRowState, bntTotals, type BntRow } from "./bnt-dashboard";
const row = (id: string, address = "address-one"): BntRow => ({
  id,
  address,
  name: id,
  worker: "",
  result: {
    fetchedAt: 1000,
    error: null,
    data: {
      hashrate: 20,
      balance: 2,
      paid: 8,
      pendingEstimate: 1,
      queued: 0.5,
      reward: null,
      period: "unknown",
      partial: false,
      workerCount: 2,
      workers: [
        { name: "rig", hashrate: 20, online: true, lastSeen: 999 },
        { name: "idle", hashrate: 0, online: false, lastSeen: 1 },
      ],
    },
  },
});
it("deduplicates account balances, hashrate and Workers across Worker bindings", () => {
  const a = row("a"),
    b = { ...row("b"), worker: "rig" };
  expect(bntTotals([a, b])).toMatchObject({
    paid: { value: 8, known: 1, total: 1 },
    hashrate: { value: 20 },
    workers: 1,
  });
  expect(bntTotals([a, row("other", "address-two")]).paid.value).toBe(16);
});
it("keeps unavailable metrics unknown and exposes per-field coverage", () => {
  const a = row("a");
  a.result!.data!.paid = null;
  expect(bntTotals([a]).paid).toEqual({ value: null, known: 0, total: 1 });
  expect(bntTotals([a, row("b", "address-two")]).paid).toEqual({ value: 8, known: 1, total: 2 });
  expect(bntTotals([]).hashrate.value).toBe(null);
  expect(
    bntTotals([
      {
        id: "missing",
        name: "missing",
        address: "missing",
        worker: "",
        result: { data: null, fetchedAt: null, error: "not-found" },
      },
    ]).stale,
  ).toBe(false);
  a.result!.data!.paid = 0;
  expect(bntTotals([a]).paid.value).toBe(0);
});
it("does not infer a selected Worker's status from another Worker's hashrate", () => {
  expect(bntRowState(row("a"))).toBe("mining");
  expect(bntRowState({ ...row("a"), worker: "idle" })).toBe("waiting");
  expect(bntRowState({ ...row("a"), worker: "missing" })).toBe("notFound");
});
it("keeps stale data visible without reporting it as current mining activity", () => {
  const a = row("a");
  a.result!.stale = true;
  expect(bntRowState(a)).toBe("stale");
  expect(bntTotals([a]).stale).toBe(true);
  expect(bntTotals([a]).hashrate.value).toBe(null);
  expect(bntTotals([a]).workers).toBe(0);
  expect(bntRowState({ ...row("a"), failed: true })).toBe("stale");
  expect(bntRowState({ id: "x", name: "x", address: "x", worker: "", loading: true })).toBe(
    "loading",
  );
});
