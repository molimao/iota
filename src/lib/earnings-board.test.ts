import { it, expect } from "vitest";
import { earningsBoard, type BoardReading } from "./earnings-board";
import type { FleetBinding } from "./fleet";
const b = (project: FleetBinding["project"], id: string, worker = ""): FleetBinding => ({
  id,
  project,
  identifier: id,
  worker,
});
const r = (
  window: NonNullable<BoardReading["earningsWindow"]>,
  amount: number,
  usd: number | null,
): BoardReading => ({
  scope: "device",
  rewardAmount: amount,
  earningsWindow: window,
  unit: "IOTA",
  todayUsdValue: usd,
  todayUsable: true,
  health: "fresh",
  source: "test",
  updated: "now",
});
it("keeps yesterday, today, UTC day and rolling windows out of each other’s totals", () => {
  const board = earningsBoard([
    { binding: b("iota", "a"), deviceId: "1", data: r("yesterday", 1, 7) },
    { binding: b("golem", "b"), deviceId: "2", data: r("today", 2, 3) },
    { binding: b("prl", "c"), deviceId: "3", data: r("rolling24h", 99, 999) },
    { binding: b("xmr", "d"), deviceId: "4", data: r("utcDay", 10, 100) },
  ]);
  expect(board.totals.yesterday).toEqual({ usd: 7, count: 1 });
  expect(board.totals.today).toEqual({ usd: 3, count: 1 });
});
it("counts devices but deduplicates wallet rewards shared by multiple workers", () => {
  const a = {
    binding: b("prl", "wallet", "one"),
    deviceId: "1",
    data: { ...r("rolling24h", 5, null), scope: "wallet" as const },
  };
  const result = earningsBoard([
    a,
    { ...a, binding: { ...a.binding, id: "other", worker: "two" }, deviceId: "2" },
  ]);
  expect(result.projects[0]!.devices.size).toBe(2);
  expect([...result.projects[0]!.metrics.values()][0]!.amount).toBe(5);
});
it("does not treat unavailable or stale conversion as zero or a complete USD estimate", () => {
  const result = earningsBoard([
    { binding: b("iota", "a"), deviceId: "1", data: r("yesterday", 1, 3) },
    { binding: b("iota", "b"), deviceId: "2", data: r("yesterday", 2, null) },
    { binding: b("iota", "c"), deviceId: "3", data: { ...r("yesterday", 3, 9), health: "stale" } },
  ]);
  expect(result.totals.yesterday.usd).toBe(3);
  expect([...result.projects[0]!.metrics.values()][0]!.usd).toBeNull();
  expect(earningsBoard([]).totals.today.count).toBe(0);
});
it("keeps balances and monthly points separate from earnings", () => {
  const result = earningsBoard([
    {
      binding: b("flyai", "a"),
      deviceId: "1",
      data: {
        ...r("unknown", NaN, null),
        accountSummary: { kind: "month", amount: "1000", unit: "points" },
      },
    },
  ]);
  expect(result.projects[0]!.metrics.size).toBe(0);
  expect(result.projects[0]!.accounts.size).toBe(1);
  expect(result.totals.today.count).toBe(0);
});

it("retains an available older quote as a labelled estimate without accepting stale earnings", () => {
  const result = earningsBoard([
    { binding: b("iota", "a"), deviceId: "1", data: { ...r("yesterday", 1, 7), priceStale: true } },
    {
      binding: b("iota", "b"),
      deviceId: "2",
      data: { ...r("yesterday", 2, 14), health: "stale", priceStale: true },
    },
  ]);
  expect(result.totals.yesterday).toEqual({ usd: 7, count: 1 });
  expect(result.olderPrices.yesterday).toBe(true);
  expect(result.totals.today.count).toBe(0);
});

import { boardSeries } from "./earnings-board";
it("charts observed zeroes without inventing missing days or including the incomplete current day", () => {
  const series = boardSeries(
    [
      { day: "2026-10-15", value: 0, partial: false },
      { day: "2026-10-17", value: 2.5, partial: true },
      { day: "2026-10-18", value: 99, partial: false },
    ],
    7,
    Date.parse("2026-10-18T03:00:00Z"),
  );
  expect(series).toHaveLength(7);
  expect(series[0]!.day).toBe("2026-10-11");
  expect(series.find((r) => r.day === "2026-10-15")?.value).toBe(0);
  expect(series.find((r) => r.day === "2026-10-16")?.value).toBeNull();
  expect(series.at(-1)).toEqual({ day: "2026-10-17", value: 2.5, partial: true });
  expect(series.some((r) => r.value === 99)).toBe(false);
});

it("counts a manager and its processor reward only once, retaining all three ACU periods", () => {
  const now = Date.now(),
    dayStart = Math.floor((now + 28800000) / 86400000) * 86400000 - 28800000;
  const data: BoardReading = {
    scope: "wallet",
    unit: "",
    source: "Acurast",
    updated: "now",
    health: "fresh",
    acurastRewards: {
      dayStart,
      observedAt: now,
      blockHash: "x",
      managers: [{ id: "67279", today: "0.5", yesterday: "1.25", cumulative: "5.75" }],
    },
  };
  const rows = earningsBoard([
    { binding: b("acurast", "manager"), deviceId: "1", data },
    { binding: b("acurast", "processor"), deviceId: "2", data },
  ]);
  expect(rows.projects[0]?.total).toBe(1);
  expect(rows.projects[0]?.devices.size).toBe(2);
  expect(rows.projects[0]?.metrics.get("today:ACU")?.amount).toBe(0.5);
  expect(rows.projects[0]?.metrics.get("yesterday:ACU")?.amount).toBe(1.25);
  expect(rows.projects[0]?.metrics.get("cumulative:ACU")?.amount).toBe(5.75);
  expect(rows.totals.today.count).toBe(0);
  const older = earningsBoard([
    {
      binding: b("acurast", "manager"),
      deviceId: "1",
      data: { ...data, acurastRewards: { ...data.acurastRewards!, dayStart: dayStart - 86400000 } },
    },
  ]);
  expect(older.projects[0]?.metrics.has("today:ACU")).toBe(false);
  expect(older.projects[0]?.metrics.has("cumulative:ACU")).toBe(true);
});

it("shows ACU wallet balances separately and deduplicates the same manager wallet", () => {
  const balance = {
    address: "manager-wallet",
    total: "2.379246287508",
    free: "2.34696615042",
    reserved: "0.032280137088",
    frozen: "0",
  };
  const data: BoardReading = {
    scope: "wallet",
    unit: "ACU",
    source: "Acurast Mainnet",
    updated: "now",
    health: "fresh",
    acurastBalances: [balance],
  };
  const result = earningsBoard([
    { binding: b("acurast", "processor"), deviceId: "a", data },
    { binding: b("acurast", "manager"), deviceId: "b", data },
  ]);
  expect(result.projects[0]?.accounts.size).toBe(1);
  expect([...result.projects[0]!.accounts.values()][0]?.amount).toBe("2.379246287508");
  expect(result.projects[0]?.metrics.size).toBe(0);
  expect(result.totals.today.count).toBe(0);
});

it("converts deduplicated ACU rewards and balance without treating wallet funds as daily earnings", () => {
 const now=Date.now(), dayStart=Math.floor((now+28800000)/86400000)*86400000-28800000;
 const data: BoardReading={scope:"wallet",unit:"ACU",source:"chain",updated:"now",health:"fresh",acurastQuote:{usd:.1,quotedAt:now,source:"test"},acurastBalances:[{address:"wallet",total:"2.37",free:"2.34",reserved:".03",frozen:"0"}],acurastRewards:{dayStart,observedAt:now,blockHash:"0x1",managers:[{id:"67279",today:".3",yesterday:".5",cumulative:"5.23"}]}};
 // Chain reward decimals always include the leading zero.
 data.acurastRewards!.managers[0]!.today="0.3";data.acurastRewards!.managers[0]!.yesterday="0.5";
 const result=earningsBoard([{binding:b("acurast","manager"),deviceId:"a",data},{binding:b("acurast","processor"),deviceId:"b",data}]);
 expect(result.totals.today.usd).toBeCloseTo(.03);expect(result.totals.today.count).toBe(1);
 expect(result.totals.yesterday.usd).toBeCloseTo(.05);
 expect(result.projects[0]?.metrics.get("cumulative:ACU")?.usd).toBeCloseTo(.523);
 expect([...result.projects[0]!.accounts.values()][0]?.usd).toBeCloseTo(.237);
});
