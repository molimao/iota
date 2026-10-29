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
  const now = Date.now(),
    dayStart = Math.floor((now + 28800000) / 86400000) * 86400000 - 28800000;
  const data: BoardReading = {
    scope: "wallet",
    unit: "ACU",
    source: "chain",
    updated: "now",
    health: "fresh",
    acurastQuote: { usd: 0.1, quotedAt: now, source: "test" },
    acurastBalances: [
      { address: "wallet", total: "2.37", free: "2.34", reserved: ".03", frozen: "0" },
    ],
    acurastRewards: {
      dayStart,
      observedAt: now,
      blockHash: "0x1",
      managers: [{ id: "67279", today: ".3", yesterday: ".5", cumulative: "5.23" }],
    },
  };
  // Chain reward decimals always include the leading zero.
  data.acurastRewards!.managers[0]!.today = "0.3";
  data.acurastRewards!.managers[0]!.yesterday = "0.5";
  const result = earningsBoard([
    { binding: b("acurast", "manager"), deviceId: "a", data },
    { binding: b("acurast", "processor"), deviceId: "b", data },
  ]);
  expect(result.totals.today.usd).toBeCloseTo(0.03);
  expect(result.totals.today.count).toBe(1);
  expect(result.totals.yesterday.usd).toBeCloseTo(0.05);
  expect(result.projects[0]?.metrics.get("cumulative:ACU")?.usd).toBeCloseTo(0.523);
  expect([...result.projects[0]!.accounts.values()][0]?.usd).toBeCloseTo(0.237);
});

it("converts fresh market-priced earnings and balances without mixing periods or duplicate wallets", () => {
  const prl = {
    ...r("rolling24h", 2, null),
    unit: "PRL",
    scope: "wallet" as const,
    accountSummary: { kind: "balance" as const, amount: "3", unit: "PRL" },
  };
  const board = earningsBoard(
    [
      { binding: b("prl", "wallet", "one"), deviceId: "one", data: prl },
      { binding: b("prl", "wallet", "two"), deviceId: "two", data: prl },
      {
        binding: b("quantus", "qtc"),
        deviceId: "three",
        data: { ...r("today", 4, null), unit: "QTC" },
      },
      {
        binding: b("flyai", "points"),
        deviceId: "four",
        data: { ...r("month", 100, null), unit: "FLY" },
      },
    ],
    { prl: 1.5, quantus: 0.1, flyai: 10 },
  );
  const pearl = board.projects.find((p) => p.project === "prl")!;
  expect(pearl.metrics.get("rolling24h:PRL")?.usd).toBe(3);
  expect([...pearl.accounts.values()][0]?.usd).toBe(4.5);
  expect(board.totals.today).toEqual({ usd: 0.4, count: 1 });
  expect(
    board.projects.find((p) => p.project === "flyai")?.metrics.get("month:FLY")?.usd,
  ).toBeNull();
});

it("keeps missing, mismatched and stale valuations unavailable and preserves real zero earnings", () => {
  const result = earningsBoard(
    [
      {
        binding: b("prl", "zero"),
        deviceId: "1",
        data: { ...r("rolling24h", 0, null), unit: "PRL" },
      },
      {
        binding: b("prl", "old"),
        deviceId: "2",
        data: { ...r("today", 5, null), unit: "PRL", health: "stale" },
      },
      {
        binding: b("kas", "wrong-unit"),
        deviceId: "3",
        data: { ...r("today", 5, null), unit: "BTC" },
      },
      {
        binding: b("bnt", "unknown"),
        deviceId: "4",
        data: { ...r("today", 5, null), unit: "BNT" },
      },
    ],
    { prl: 2, kas: 0.1 },
  );
  expect(result.projects.find((p) => p.project === "prl")?.metrics.get("rolling24h:PRL")?.usd).toBe(
    0,
  );
  expect(
    result.projects.find((p) => p.project === "prl")?.metrics.get("today:PRL")?.usd,
  ).toBeNull();
  expect(
    result.projects.find((p) => p.project === "kas")?.metrics.get("today:BTC")?.usd,
  ).toBeNull();
  expect(
    result.projects.find((p) => p.project === "bnt")?.metrics.get("today:BNT")?.usd,
  ).toBeNull();
  expect(result.totals.today.count).toBe(0);
});

it("shows separately converted rolling and UTC subtotals without changing calendar-day earnings", () => {
  const board = earningsBoard([
    { binding: b("iota", "i"), deviceId: "a", data: r("yesterday", 1, 7) },
    { binding: b("prl", "p", "a"), deviceId: "b", data: { ...r("rolling24h", 2, null), scope: "wallet", unit: "PRL" } },
    { binding: b("prl", "p", "b"), deviceId: "c", data: { ...r("rolling24h", 2, null), scope: "wallet", unit: "PRL" } },
    { binding: b("xmr", "m"), deviceId: "d", data: { ...r("utcDay", 0.1, null), unit: "XMR" } },
    { binding: b("bnt", "b"), deviceId: "e", data: { ...r("rolling24h", 100, null), unit: "BNT" } },
  ], { prl: 1.8, xmr: 600 });
  expect(board.totals.rolling24h).toEqual({ usd: 3.6, count: 1 });
  expect(board.totals.utcDay).toEqual({ usd: 60, count: 1 });
  expect(board.totals.yesterday).toEqual({ usd: 7, count: 1 });
  expect(board.totals.today.count).toBe(0);
  expect(board.coverage.rolling24h).toEqual(["bnt"]);
  expect(board.coverage.yesterday).toEqual([]);
});

it("combines only timestamp-derived IOTA/ACU and pool rolling rewards, deduplicating managers and wallets", () => {
  const now = Date.now();
  const acu: BoardReading = {
    scope: "wallet", unit: "ACU", source: "chain", updated: "now", health: "fresh",
    acurastRewards: { observedAt: now, rolling24hStart: now - 86400000,
      dayStart: Math.floor((now + 28800000) / 86400000) * 86400000 - 28800000,
      blockHash: "hash", managers: [{ id: "67279", today: "10", yesterday: "20", cumulative: "100", rolling24h: "0.5" }] },
  };
  const prl: BoardReading = { ...r("rolling24h", 2, null), unit: "PRL", scope: "wallet" };
  const board = earningsBoard([
    { binding: b("iota", "i"), deviceId: "1", data: { ...r("yesterday", 99, 999), rolling24hReward: 0.1, rolling24hUsdValue: 0.7 } },
    { binding: b("acurast", "processor"), deviceId: "2", data: acu },
    { binding: b("acurast", "manager"), deviceId: "3", data: acu },
    { binding: b("prl", "p", "one"), deviceId: "4", data: prl },
    { binding: b("prl", "p", "two"), deviceId: "5", data: prl },
    { binding: b("xmr", "m"), deviceId: "6", data: { ...r("utcDay", 100, 1000), unit: "XMR" } },
  ], { acurast: 0.1, prl: 1.8 });
  expect(board.totals.rolling24h.usd).toBeCloseTo(0.7 + 0.05 + 3.6);
  expect(board.totals.rolling24h.count).toBe(3);
  expect(board.projects.find((p) => p.project === "acurast")?.metrics.get("rolling24h:ACU")?.amount).toBe(0.5);
});
