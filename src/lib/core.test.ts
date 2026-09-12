import { describe, expect, it } from "vitest";
import {
  sumTodayUnits,
  aggregateUnits,
  hongKongDayStartSeconds,
  formatUsd,
  iotaUnitsToUsd,
  UNIT_SCALE,
} from "./earnings";
import { computeStatus } from "./device-status";
import { addEntry, parseWatchlist, serializeExport, importDevices } from "./watchlist";
import { base58 } from "@scure/base";
import { blake2b } from "@noble/hashes/blake2.js";
function address(n: number) {
  const body = new Uint8Array(33);
  body[0] = 42;
  body.fill(n, 1);
  const prefix = new TextEncoder().encode("SS58PRE");
  const input = new Uint8Array(prefix.length + body.length);
  input.set(prefix);
  input.set(body, prefix.length);
  const hash = blake2b(input, { dkLen: 64 });
  const full = new Uint8Array(35);
  full.set(body);
  full.set(hash.slice(0, 2), 33);
  return base58.encode(full);
}
describe("earnings accounting", () => {
  it("uses Hong Kong midnight, excludes future and frozen rows", () => {
    const now = Date.parse("2026-09-12T00:30:00Z");
    const start = hongKongDayStartSeconds(now);
    expect(
      sumTodayUnits(
        {
          alpha_amounts: [1, 2, 4, 8, 16],
          timestamps: [start - 1, start, start + 1, now / 1000 + 1, start + 2],
          statuses: ["settled", "pending", "settled", "settled", "frozen"],
        },
        now,
      ).units,
    ).toBe(600000000);
  });
  it("distinguishes missing and zero and partial totals", () => {
    expect(sumTodayUnits(null).units).toBeNull();
    expect(sumTodayUnits({ alpha_amounts: [], timestamps: [], statuses: [] }).units).toBe(0);
    expect(aggregateUnits([null, 0, 100])).toEqual({
      units: 100,
      known: 2,
      total: 3,
      partial: true,
    });
  });
  it("converts IOTA units to USD without inventing a price", () => {
    expect(iotaUnitsToUsd(2 * UNIT_SCALE, 5.5)).toBe(11);
    expect(iotaUnitsToUsd(null, 5.5)).toBeNull();
    expect(iotaUnitsToUsd(UNIT_SCALE, null)).toBeNull();
    expect(formatUsd(11)).toBe("$11.00");
    expect(formatUsd(null)).toBe("—");
  });
});
it("old statistical sample does not imply offline", () => {
  expect(
    computeStatus({
      miner: { timestamp: 1, is_active: true, throughput: 4 } as never,
      fullCoverage: true,
      lastSuccessfulFetchAt: 1000000,
      now: 1000001,
    }),
  ).toBe("contributing");
});
it("roundtrips more than three public IDs and prevents duplicates", () => {
  let entries: any[] = [];
  for (let n = 1; n <= 5; n++) {
    const result = addEntry(entries, { hotkey: address(n), label: `设备${n}` });
    expect(result.ok).toBe(true);
    if (result.ok) entries = result.value;
  }
  expect(entries.length).toBe(5);
  expect(addEntry(entries, { hotkey: address(1), label: "重复" }).ok).toBe(false);
  const result = importDevices([], serializeExport(entries));
  expect(result.ok && result.value.added).toBe(5);
  expect(parseWatchlist("bad").ok).toBe(false);
});
