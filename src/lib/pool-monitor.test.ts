import { describe, it, expect } from "vitest";
import { parseKryptex, parseTwoMiners, poolHashrate } from "./pool-monitor";
import { parseFleet } from "./fleet";
import { projectAddressInput } from "./project-address-input";
import { validPoolAddress } from "./pool-projects";
describe("pool data is not fabricated", () => {
  it("reads real v3 worker fields, millisecond clocks and UTC rewards", () => {
    const day = Date.UTC(2026, 9, 15);
    const data = parseKryptex(
      { total: 2 },
      {
        count: 2,
        results: [
          { worker: "a", status: "online", avg_hashrate_30m: "1500.5", last_share: day + 1000 },
        ],
      },
      [{ date: day / 1000, reward: 3 }],
      { paid: 5 },
      day + 2000,
    );
    expect(data.reward).toBe(3);
    expect(data.workers[0]?.lastSeen).toBe(day + 1000);
    expect(data.partial).toBe(true);
    expect(data.hashrate).toBe(1500.5);
  });
  it("does not invent zero earnings for a missing day", () => {
    expect(
      parseKryptex({ total: 0 }, { count: 0, results: [] }, [], { paid: 0 }).reward,
    ).toBeNull();
    expect(() => parseKryptex({}, {}, [], {})).toThrow("invalid-data");
  });
  it.each([
    ["etc", 1e9],
    ["rvn", 1e8],
    ["zec", 1e8],
    ["kas", 1e8],
    ["erg", 1e9],
    ["zeph", 1e12],
  ] as const)("converts %s account payment units", (project, scale) => {
    const d = parseTwoMiners(project, {
      apiVersion: 200,
      stats: { balance: scale, paid: 2 * scale },
      workersTotal: 1,
      currentHashrate: 5,
      "24hreward": scale / 2,
      workers: { rig: { hr: 5, offline: false, lastBeat: 1700000000 } },
    });
    expect(d.balance).toBe(1);
    expect(d.paid).toBe(2);
    expect(d.reward).toBe(0.5);
    expect(d.period).toBe("rolling24h");
    expect(d.workers[0]?.online).toBe(true);
  });
  it("rejects invalid upstream results", () => expect(() => parseTwoMiners("etc", {})).toThrow());
  it("labels Zcash solution rate correctly", () =>
    expect(poolHashrate("zec", 1000)).toBe("1 KS/s"));
  it("persists pool identity through fleet parsing and rejects a mismatched pool", () => {
    const base = {
      id: "a",
      name: "rig",
      createdAt: 1,
      bindings: [{ id: "b", project: "etc", identifier: "0x" + "a".repeat(40), worker: "rig1" }],
    };
    expect(parseFleet([base])[0]?.bindings[0]?.pool).toBe("2miners");
    expect(() =>
      parseFleet([{ ...base, bindings: [{ ...base.bindings[0], pool: "kryptex" }] }]),
    ).toThrow();
  });
  it("accepts multiple addresses and rejects URLs and duplicate addresses", () => {
    const a = "0x" + "a".repeat(40),
      b = "0x" + "b".repeat(40);
    expect(projectAddressInput("etc", a + "\n" + b, [], 5)).toEqual([a, b]);
    expect(() => projectAddressInput("etc", a + "\n" + a, [], 5)).toThrow();
    expect(validPoolAddress("etc", "https://example.com")).toBe(false);
    expect(validPoolAddress("xmr", "4" + "a".repeat(105))).toBe(true);
  });
});
