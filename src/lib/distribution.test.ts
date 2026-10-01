import { describe, expect, it } from "vitest";
import { aggregateFarmMiners } from "./farm";
import { countryDistribution } from "./distribution";
import type { MinerRecord } from "./iota-types";

describe("miner distribution totals", () => {
  it("keeps every region and uses the latest record of each Miner ID across runs", () => {
    const miners = Array.from({ length: 12 }, (_, index) => ({
      hotkey: `miner-${index}`,
      timestamp: 100,
      location_country: `Region ${index}`,
      is_active: true,
      throughput: 1,
    })) as MinerRecord[];
    const stats = aggregateFarmMiners([
      { runId: "one", miners },
      {
        runId: "two",
        miners: [
          { ...miners[0]!, timestamp: 200, location_country: "Region 1" },
          { ...miners[1]!, hotkey: "unknown-location", location_country: null },
        ],
      },
      { runId: "failed", miners: null },
    ]);
    expect(stats.countries).toHaveLength(11);
    expect(stats.countries[0]).toEqual({ country: "Region 1", count: 2 });
    expect(stats.listed).toBe(13);
    expect(stats.knownRuns).toBe(2);
    const chart = countryDistribution(stats.countries, stats.listed);
    expect(chart.total).toBe(13);
    expect(chart.located).toBe(12);
    expect(chart.unknown).toBe(1);
    expect(
      chart.rows.slice(0, 6).reduce((sum, row) => sum + row.count, 0) + chart.other + chart.unknown,
    ).toBe(chart.total);
  });
  it("keeps an all-unknown roster distinct from no available roster", () => {
    expect(countryDistribution([], 9)).toMatchObject({ total: 9, located: 0, unknown: 9 });
    expect(countryDistribution([], null)).toMatchObject({ total: 0, located: 0, unknown: 0 });
  });
  it("combines official country aliases without counting one region twice", () => {
    const countries = [
      "HK",
      "Hong Kong",
      "Turkey",
      "Türkiye",
      "The Netherlands",
      "Netherlands",
      "USA",
      "United States",
    ];
    const stats = aggregateFarmMiners([
      {
        runId: "one",
        miners: countries.map((country, index) => ({
          hotkey: `miner-${index}`,
          timestamp: 100,
          location_country: country,
          is_active: true,
          throughput: 1,
        })) as MinerRecord[],
      },
    ]);
    expect(stats.countries).toHaveLength(4);
    expect(stats.countries.every((row) => row.count === 2)).toBe(true);
    expect(stats.listed).toBe(8);
    expect(countryDistribution(stats.countries, stats.listed).unknown).toBe(0);
  });
});
