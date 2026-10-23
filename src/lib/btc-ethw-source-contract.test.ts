import { describe, expect, it } from "vitest";
import { parseCkPool, parseTwoMiners } from "./pool-monitor";
import { validPoolAddress } from "./pool-projects";

// Public demonstration wallets linked by the pool websites, not customer data.
const btc = "bc1q28kkr5hk4gnqe3evma6runjrd2pvqyp8fpwfzu";
const now = 1792755652092;

describe("independently checked pool source contracts", () => {
  it("keeps CKPool's declared count when the public response only includes three workers", () => {
    // Local fixture of the documented CKPool user object. This test does not call the wallet URL.
    const result = parseCkPool(
      {
        hashrate1hr: "2.89T",
        lastshare: 1792755549,
        workers: 6,
        worker: [
          { workername: btc, hashrate1hr: "1.94T", lastshare: 1792755549 },
          { workername: `${btc}.bitaxe601-01`, hashrate1hr: "954G", lastshare: 1792755517 },
          { workername: `${btc}.bitaxe`, hashrate1hr: "0", lastshare: 1792555909 },
        ],
      },
      btc,
      now,
    );
    expect(result.workerCount).toBe(6);
    expect(result.workers).toHaveLength(3);
    expect(result.partial).toBe(true);
    expect(result.hashrate).toBe(2.89e12);
    expect(result.workers[1]?.name).toBe("bitaxe601-01");
    expect(result.workers[2]?.online).toBe(false);
    expect([result.balance, result.paid, result.reward]).toEqual([null, null, null]);
  });

  it("converts ETHW account amounts with the payment multiplier and keeps absent paid unknown", () => {
    // Local fixture. Divisor 1e9 comes from public account.js getPaymentsMultiplier for type DH.
    const result = parseTwoMiners("ethw", {
      apiVersion: 200,
      workersTotal: 0,
      workers: {},
      currentHashrate: 0,
      stats: { balance: 30595842 },
      "24hreward": 0,
    });
    expect(result.balance).toBeCloseTo(0.030595842, 12);
    expect(result.paid).toBeNull();
    expect(result.reward).toBe(0);
    expect(result.period).toBe("rolling24h");
    const earned = parseTwoMiners("ethw", {
      apiVersion: 200,
      workersTotal: 0,
      workers: {},
      stats: { balance: 0 },
      "24hreward": 1250000000,
    });
    expect(earned.reward).toBe(1.25);
  });

  it("retains idle CKPool worker rows when its reported worker count reaches zero", () => {
    const result = parseCkPool(
      {
        workers: 0,
        hashrate1hr: "0",
        worker: [{ workername: btc, hashrate1hr: "0", lastshare: 1792467665 }],
      },
      btc,
      now,
    );
    expect(result.workers).toHaveLength(1);
    expect(result.workers[0]?.online).toBe(false);
    expect(result.workers[0]?.name).toBe("");
    expect(result.hashrate).toBe(0);
  });

  it("rejects an altered Bitcoin checksum and an address containing a worker suffix", () => {
    expect(validPoolAddress("btc", btc)).toBe(true);
    expect(validPoolAddress("btc", `${btc.slice(0, -1)}q`)).toBe(false);
    expect(validPoolAddress("btc", `${btc}.bitaxe`)).toBe(false);
    expect(validPoolAddress("btc", `${btc}?redirect=https://example.org`)).toBe(false);
  });
});
