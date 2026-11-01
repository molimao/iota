import { it, expect } from "vitest";
import { poolCumulativeEarnings } from "./cumulative-earnings";
import type { PoolAccount } from "./pool-monitor";
const account = (patch: Partial<PoolAccount>): PoolAccount => ({
  balance: 1,
  paid: 5,
  reward: 2,
  period: "rolling24h",
  workers: [],
  workerCount: 0,
  partial: false,
  hashrate: 0,
  ...patch,
});
it("adds paid, unpaid, immature and queued but never 24h income", () => {
  expect(poolCumulativeEarnings(account({ pendingEstimate: 0.2, queued: 0.3 }))).toBe(6.5);
});
it("does not add immature twice when it is already inside balance", () => {
  expect(poolCumulativeEarnings(account({}))).toBe(6);
});
it("does not fabricate cumulative earnings from an incomplete balance", () => {
  expect(poolCumulativeEarnings(account({ paid: null }))).toBeNull();
  expect(poolCumulativeEarnings(account({ pendingEstimate: null }))).toBeNull();
});
