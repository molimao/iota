import { it, expect } from "vitest";
import {
  xmrigNetworkSchema,
  xmrigStoredBenchmarkSchema,
  xmrHardwareRows,
  XMR_MAC_PROFILES,
} from "./xmr-hardware";
import benchmarks from "./xmr-benchmarks.json";
import snapshots from "./xmr-yield-snapshot.json";
import { hardwareYieldSchema, estimateHardware, MAC_MODELS } from "./hardware-yield";
import { HARDWARE_CATALOG, calculatorModels } from "./hardware-catalog";
const network = {
  coin: "XMR",
  algo: "rx/0",
  difficulty: 833015593320,
  target: 120,
  height: 3796650,
  reward: 601712560000,
  units: 1e12,
  ts: Date.UTC(2026, 10, 1),
};
it("covers all 20 registered Mac configurations with verified-chip metadata and numeric XMR results", () => {
  expect(benchmarks).toHaveLength(20);
  expect(new Set(benchmarks.map((b) => b.model))).toEqual(new Set(MAC_MODELS));
  for (const p of XMR_MAC_PROFILES) {
    const b = xmrigStoredBenchmarkSchema.parse(benchmarks.find((b) => b.model === p.model));
    expect(b.chip).toBe(p.chip);
    expect(b.cores).toBe(p.cores);
    expect(b.threads).toBe(p.cores);
    expect(b.hashrate).toBeCloseTo((b.hashes * 1000) / b.durationMs, 5);
    expect(b.memoryGb).toBeNull();
    expect(b.watts).toBeNull();
    const seed = hardwareYieldSchema.parse(snapshots.find((s) => s.model === p.model));
    expect(seed.rows[0]!.project).toBe("xmr");
    expect(seed.rows[0]!.coinsPerDay).toBeGreaterThan(0);
  }
});
it("computes Monero from work, difficulty and atomic block reward without mixing BNT units or fees", () => {
  const b = xmrigStoredBenchmarkSchema.parse(benchmarks.find((b) => b.model === "m2-8c"));
  const row = xmrHardwareRows(
    [{ ...b, hashrate: 1000 }],
    xmrigNetworkSchema.parse({ ...network, difficulty: 86400000, reward: 600000000000 }),
    500,
    123,
  )[0]!.rows[0]!;
  expect(row.coinsPerDay).toBeCloseTo(0.6);
  expect(row.usdPerDay).toBeCloseTo(row.coinsPerDay * 500);
  expect(row.network).toMatchObject({
    height: 3796650,
    blocksPerDay: 720,
    blockReward: 0.6,
    referenceUsd: 500,
  });
  expect(estimateHardware(row, 12, 0.1).gross).toBeCloseTo(row.usdPerDay / 2);
  expect(estimateHardware(row, 24, 0.1).net).toBeNull();
});
it("keeps IOTA and BNT evidence separate while adding CPU mining for the same Mac", () => {
  expect(calculatorModels("iota")).toEqual(["m1-pro-32", "m4-16"]);
  expect(calculatorModels("bnt")).toEqual(["5090", "m4-max-48"]);
  const m2 = HARDWARE_CATALOG.find((s) => s.model === "m2-8c")!;
  expect(m2.rows.map((r) => r.project)).toEqual(["xmr"]);
  expect(HARDWARE_CATALOG.find((s) => s.model === "m1-pro-32")!.rows.map((r) => r.project)).toEqual(
    ["iota", "xmr"],
  );
  expect(HARDWARE_CATALOG.find((s) => s.model === "m4-max-48")!.rows.map((r) => r.project)).toEqual(
    ["bnt", "xmr"],
  );
});
it("rejects wrong network algorithms and denomination, preserving provenance", () => {
  expect(() => xmrigNetworkSchema.parse({ ...network, algo: "rx/wow" })).toThrow();
  expect(() => xmrigNetworkSchema.parse({ ...network, coin: "BNT" })).toThrow();
  expect(() => xmrigNetworkSchema.parse({ ...network, units: 1e8 })).toThrow();
  expect(JSON.stringify(benchmarks)).not.toMatch(/credential|hotkey|wawawawa|seed|user_id/);
});
