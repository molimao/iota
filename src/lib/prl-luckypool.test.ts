import { describe, expect, it } from "vitest";
import type { PoolAccount } from "./pool-monitor";
import { parsePrlLuckyPool } from "./prl-luckypool";

const ADDRESS = "prl1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsample";
const NOW = 1_800_000_000_000;
const config = { symbol: "PRL", coinUnits: 100_000_000, algo: "pearl-pow" };

const wallet = (patch: Record<string, unknown> = {}) => ({
  stats: {
    wallet: ADDRESS,
    lastShare: "1800000000000",
    acceptedShares: "16",
    hashrate: 131_521_442_975,
    paid: 0,
    unlocked: 2725,
    locked: 19790,
    ...((patch["stats"] as object) ?? {}),
  },
  workers: patch["workers"] ?? [
    {
      name: "rig-a",
      hashrate: 131_521_442_975,
      lastShare: "1800000000000",
      hashrateAvg: { "1h": 1 },
    },
  ],
  rewardStats: patch["rewardStats"] ?? [
    { period: "24h", amount: 19790 },
    { period: "1h", amount: 18676 },
  ],
});

describe("parsePrlLuckyPool", () => {
  it("converts atomic amounts, 24h reward, and worker rate", () => {
    const account: PoolAccount = parsePrlLuckyPool(config, wallet(), ADDRESS, NOW);
    expect(account).toMatchObject({
      balance: 2725 / 1e8,
      pendingEstimate: 19790 / 1e8,
      paid: 0,
      reward: 19790 / 1e8,
      period: "rolling24h",
      hashrate: 131_521_442_975,
      lastShare: 1_800_000_000_000,
      workerCount: 1,
      acceptedShares: 16,
      partial: false,
    });
    expect(account.workers).toEqual([
      { name: "rig-a", hashrate: 131_521_442_975, online: true, lastSeen: 1_800_000_000_000 },
    ]);
  });

  it("leaves missing money and rate null without fabricating zeros", () => {
    const account = parsePrlLuckyPool(
      config,
      wallet({
        stats: {
          unlocked: undefined,
          locked: undefined,
          paid: undefined,
          hashrate: undefined,
          lastShare: undefined,
        },
        rewardStats: [],
      }),
      ADDRESS,
      NOW,
    );
    expect(account.balance).toBeNull();
    expect(account.pendingEstimate).toBeNull();
    expect(account.paid).toBeNull();
    expect(account.reward).toBeNull();
    expect(account.hashrate).toBeNull();
    expect(account.lastShare).toBeNull();
    expect(account.partial).toBe(true);
  });

  it("rejects a non-PRL config and coin units other than 1e8", () => {
    expect(() =>
      parsePrlLuckyPool({ symbol: "BTC", coinUnits: 1e8 }, wallet(), ADDRESS, NOW),
    ).toThrow("invalid-data");
    expect(() =>
      parsePrlLuckyPool({ symbol: "PRL", coinUnits: 1e6 }, wallet(), ADDRESS, NOW),
    ).toThrow("invalid-data");
    expect(() =>
      parsePrlLuckyPool({ symbol: "PRL", coinUnits: "100000000" }, wallet(), ADDRESS, NOW),
    ).toThrow("invalid-data");
  });

  it("rejects a wallet that does not match the requested address", () => {
    expect(() => parsePrlLuckyPool(config, wallet(), `${ADDRESS}x`, NOW)).toThrow("invalid-data");
  });

  it("maps not-found only for an explicit known status", () => {
    expect(() => parsePrlLuckyPool(config, { status: "not-found" }, ADDRESS, NOW)).toThrow(
      "not-found",
    );
    expect(() => parsePrlLuckyPool(config, { error: "not found" }, ADDRESS, NOW)).toThrow(
      "not-found",
    );
    expect(() =>
      parsePrlLuckyPool(config, { status: "error", error: "busy" }, ADDRESS, NOW),
    ).toThrow("invalid-data");
    expect(() => parsePrlLuckyPool(config, {}, ADDRESS, NOW)).toThrow("invalid-data");
  });

  it("classifies worker age and ignores a positive hashrate when last seen is missing", () => {
    const at = (lastSeen: unknown) =>
      parsePrlLuckyPool(
        config,
        wallet({
          workers: [{ name: "x".repeat(90), hashrate: 50, lastSeen, hashrateAvg: { "24h": 9 } }],
        }),
        ADDRESS,
        NOW,
      ).workers[0];

    expect(at(NOW - 20 * 60_000)).toMatchObject({ name: "x".repeat(80), online: true });
    expect(at(NOW - 25 * 60_000)?.online).toBeNull();
    expect(at(NOW - 30 * 60_000)?.online).toBeNull();
    expect(at(NOW - 30 * 60_000 - 1)?.online).toBe(false);
    expect(at(NOW + 2 * 60_000)?.online).toBe(true);
    expect(at(NOW + 2 * 60_000 + 1)?.online).toBeNull();
    expect(at(undefined)).toMatchObject({ hashrate: 50, online: null, lastSeen: null });
    expect(at(1_792_764_776)).toMatchObject({ lastSeen: 1_792_764_776_000, online: false });
  });
});

it("retains known balances and accepted history when the pool no longer returns workers", () => {
  const result = parsePrlLuckyPool(
    config,
    wallet({ workers: [], stats: { hashrate: 0 } }),
    ADDRESS,
    NOW,
  );
  expect(result.workers).toEqual([]);
  expect(result.balance).toBe(0.00002725);
  expect(result.pendingEstimate).toBe(0.0001979);
  expect(result.acceptedShares).toBe(16);
});
