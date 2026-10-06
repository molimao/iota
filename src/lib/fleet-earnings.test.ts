import { describe, it, expect } from "vitest";
import {
  deviceTodayEarnings,
  deviceEarningsHeadline,
  singleAccountSummary,
} from "./fleet-earnings";
import type { FleetBinding } from "./fleet";
const binding = (project: FleetBinding["project"], id: string): FleetBinding => ({
  id,
  project,
  identifier: id,
  worker: "",
});
const daily = (unit: string, amount: number | null) => ({
  scope: "device" as const,
  today: "0.12345678",
  unit,
  todayUsdValue: amount,
});
describe("device daily earnings summary", () => {
  it("sums raw USD values before rounding and keeps unlike tokens separate", () => {
    const result = deviceTodayEarnings([
      { binding: binding("iota", "one"), data: daily("IOTA", 0.004) },
      { binding: binding("quantus", "two"), data: daily("QTC", 0.004) },
    ]);
    expect(result.usd).toBe(0.008);
    expect(result.native.map((n) => n.unit)).toEqual(["IOTA", "QTC"]);
    expect(result.partial).toBe(false);
  });
  it("excludes wallet-wide payouts and monthly points without presenting a complete total", () => {
    const result = deviceTodayEarnings([
      { binding: binding("iota", "one"), data: daily("IOTA", 1.8) },
      { binding: binding("quantus", "two"), data: { ...daily("QTC", 100), scope: "wallet" } },
      {
        binding: binding("flyai", "three"),
        data: { ...daily("points", 100), earningsPeriod: "month" },
      },
    ]);
    expect(result.usd).toBe(1.8);
    expect(result.priced).toBe(1);
    expect(result.total).toBe(3);
    expect(result.partial).toBe(true);
  });
  it("does not turn missing prices or stale daily data into zero", () => {
    expect(
      deviceTodayEarnings([{ binding: binding("iota", "one"), data: daily("IOTA", null) }]).usd,
    ).toBeNull();
    expect(
      deviceTodayEarnings([
        { binding: binding("iota", "one"), data: { ...daily("IOTA", 8), todayUsable: false } },
      ]).native,
    ).toEqual([]);
    expect(deviceTodayEarnings([]).usd).toBeNull();
    expect(
      deviceTodayEarnings([{ binding: binding("iota", "one"), data: daily("IOTA", NaN) }]).usd,
    ).toBeNull();
  });
  it("retains a real zero and counts identical bindings only once", () => {
    const entry = { binding: binding("iota", "one"), data: daily("IOTA", 0) };
    const result = deviceTodayEarnings([entry, entry]);
    expect(result.usd).toBe(0);
    expect(result.priced).toBe(1);
    expect(result.total).toBe(1);
  });
});

it("keeps unpriced token amounts prominent without inventing missing earnings", () => {
  const result = deviceTodayEarnings([
    { binding: binding("iota", "one"), data: daily("IOTA", null) },
  ]);
  expect(deviceEarningsHeadline(result)).toEqual({ amount: "0.12345678", unit: "IOTA" });
  expect(deviceEarningsHeadline(deviceTodayEarnings([]))).toBeNull();
});
it("flags older quotes only when they contribute to the USD estimate", () => {
  const result = deviceTodayEarnings([
    { binding: binding("iota", "one"), data: { ...daily("IOTA", 1), priceStale: true } },
  ]);
  expect(result.priceStale).toBe(true);
  expect(result.usd).toBe(1);
});

it("shows single account metrics without merging wallets or inventing daily revenue", () => {
  const monthly = { accountSummary: { kind: "month" as const, amount: "607905", unit: "" } };
  const wallet = { accountSummary: { kind: "balance" as const, amount: "143.75", unit: "XID" } };
  expect(singleAccountSummary([monthly])).toEqual(monthly.accountSummary);
  expect(singleAccountSummary([wallet])).toEqual(wallet.accountSummary);
  expect(singleAccountSummary([monthly, wallet])).toBeNull();
  expect(singleAccountSummary([{}])).toBeNull();
  expect(singleAccountSummary([])).toBeNull();
});
