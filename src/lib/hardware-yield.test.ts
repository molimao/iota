import { it, expect } from "vitest";
import {
  GPU_MODELS,
  hardwareYieldSchema,
  parseHardwareYield,
  estimateHardware,
} from "./hardware-yield";
import seed from "./hardware-yield-snapshot.json";
// Reduced from Kryptex's 2026-11-01 Nuxt daily row, not its default annual HTML table.
const fixture = (patch: Record<string, unknown> = {}) =>
  '<script id="__NUXT_DATA__">' +
  JSON.stringify([
    { ticker: 1, algo: 2, hashrate: 3, power: 4, revenue: 5, revenue_usd: 6, ...patch },
    "PRL",
    "PearlHash",
    293000000000000,
    450,
    3.7018449821,
    5.36525281,
  ]) +
  "</script>";
it("reads daily embedded data rather than annual visible dollars", () => {
  const parsed = parseHardwareYield("<table><td>$1958.96</td></table>" + fixture(), "4090", 123);
  expect(parsed.rows[0]).toMatchObject({
    project: "prl",
    usdPerDay: 5.36525281,
    coinsPerDay: 3.7018449821,
    watts: 450,
  });
  expect(parsed.fetchedAt).toBe(123);
});
it("does not confuse Quantus QTC with Qubitcoin on Qhash", () => {
  const html = fixture().replace('"PRL"', '"QTC"').replace('"PearlHash"', '"Qhash"');
  expect(() => parseHardwareYield(html, "4090")).toThrow();
});
it("rejects malformed source data rather than publishing invented yields", () => {
  expect(() => parseHardwareYield("<html>unavailable</html>", "4090")).toThrow();
  expect(() => parseHardwareYield(fixture({ power: 1 }), "4090")).toThrow();
});
it("scales hours and GPU electricity independently and retains negative net returns", () => {
  const row = parseHardwareYield(fixture(), "4090").rows[0]!;
  const full = estimateHardware(row, 24, 0.1),
    half = estimateHardware(row, 12, 0.1);
  expect(full.gross).toBeCloseTo(5.36525281);
  expect(full.cost).toBeCloseTo(1.08);
  expect(full.net).toBeCloseTo(4.28525281);
  expect(half.net).toBeCloseTo(full.net! / 2);
  expect(full.monthlyNet).toBeCloseTo(full.net! * 30);
  expect(estimateHardware(row, 24, 0).net).toBe(full.gross);
  expect(estimateHardware(row, 24, 1).net).toBeLessThan(0);
});
it("has dated sourced numerical records for every hardware choice and a 4090 result", () => {
  expect(seed.map((s) => s.model).sort()).toEqual([...GPU_MODELS].sort());
  for (const raw of seed) {
    const s = hardwareYieldSchema.parse(raw);
    expect(s.rows.some((r) => r.project === "prl")).toBe(true);
    expect(new URL(s.source).hostname).toBe("pool.kryptex.com");
  }
});

import {
  blocknetReward,
  blocknetCoinsPerDay,
  summarizeIotaDays,
  HARDWARE_MODELS,
} from "./hardware-yield";
import { blocknetHardwareRows } from "./blocknet-hardware";
import macSeeds from "./mac-yield-snapshot.json";
it("matches Blocknet atomic rewards, scheduled boundaries and tail", () => {
  expect(blocknetReward(1)).toBe(723.25093035);
  expect(blocknetReward(69120)).toBeCloseTo(439.46, 2);
  expect(blocknetReward(8640)).toBeLessThan(blocknetReward(8639));
  expect(blocknetReward(414720)).toBe(2);
  const wholeNetwork = blocknetCoinsPerDay(100, 8639, 100);
  expect(wholeNetwork).toBeCloseTo(blocknetReward(8639) + 287 * blocknetReward(8640), 6);
});
it("uses measured Seine models and fixed BNT reference without importing another algorithm power", () => {
  const rows = blocknetHardwareRows(71013, 189133.56767036451, 123);
  expect(rows.find((s) => s.model === "m4-max-48")!.rows[0]!.hashrate).toBe(29.26);
  const row = rows.find((s) => s.model === "5090")!.rows[0]!;
  expect(row.hashrate).toBe(7.3);
  expect(row.usdPerDay).toBeCloseTo(row.coinsPerDay * 0.16);
  expect(estimateHardware(row, 24, 0.1)).toMatchObject({
    energy: null,
    cost: null,
    net: null,
    monthlyNet: null,
  });
  expect(estimateHardware(row, 12, 0.5).gross).toBeCloseTo(row.usdPerDay / 2);
});
it("keeps queueing zero days, sums distinct credits at the same timestamp and excludes unsettled/partial days", () => {
  const end = Date.UTC(2026, 10, 1),
    seconds = (end - 86400000) / 1000;
  const sample = summarizeIotaDays(
    {
      timestamps: [seconds, seconds, seconds, end / 1000],
      alpha_amounts: [1, 2, 10, 50],
      statuses: ["settled", "settled", "pending", "settled"],
    },
    end,
  );
  expect(sample.coinsPerDay).toBe(3 / 14);
  expect(sample.sample).toMatchObject({
    days: 14,
    zeroDays: 13,
    min: 0,
    max: 3,
    start: "2026-10-18",
    end: "2026-11-01",
  });
});
it("every selectable model has sourced numeric data, with no personal identifiers in shipped Mac samples", () => {
  const all = [...seed, ...macSeeds];
  for (const model of HARDWARE_MODELS)
    expect(all.some((s) => s.model === model && s.rows.length > 0)).toBe(true);
  const json = JSON.stringify(macSeeds);
  expect(json).not.toMatch(/5D2bnu|5G67Db|wawawawa|公司电脑|device_id|hotkey|credential/);
  for (const raw of macSeeds) hardwareYieldSchema.parse(raw);
});
