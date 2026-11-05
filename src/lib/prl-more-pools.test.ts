import { expect, it } from "vitest";
import { poolCumulativeEarnings } from "./cumulative-earnings";
import {
  parseAlphaPool,
  parseHeroMiners,
  parsePearlFortune,
  parsePearlHash,
  parsePearlski,
} from "./prl-more-pools";

const wallet = "prl1" + "q".repeat(58);
const now = 1_793_887_340;

it("reads PearlHash GPU rates and excludes other coins and accounting corrections from paid", () => {
  const data = parsePearlHash({
    connected_workers: [
      { worker_name: "same", gpu_info: [{ hashrate: 4e12 }, { hashrate: 2e12 }] },
      { worker_name: "same", gpu_info: [{ hashrate: 3e12 }] },
    ],
    balance_transactions: [
      { amount: 7, coin_type: "pearl" },
      { amount: -2, reason: "Auto Payment", coin_type: "pearl" },
      { amount: -1, reason: "Adjusted payout", coin_type: "pearl" },
      { amount: 300, coin_type: "mdl" },
    ],
    pending_rewards: { total_pending_prl: 0.5, total_pending_mdl: 4 },
  });
  expect(data).toMatchObject({
    balance: 4,
    paid: 2,
    pendingEstimate: 0.5,
    hashrate: 9e12,
    reward: null,
  });
  expect(data.workers.map((w) => [w.name, w.hashrate])).toEqual([
    ["same", 6e12],
    ["same", 3e12],
  ]);
  expect(poolCumulativeEarnings(data)).toBe(6.5);
});

it("reads HeroMiners work and block amounts without counting payments as 24h earnings", () => {
  const data = parseHeroMiners(
    {
      stats: { balance: "100000000", paid: "200000000", hashrate: 1024, payments_24h: 100000000 },
      workers: [
        { name: "rig-01", lastShare: now - 10, hashrate: 1024 },
        { name: "rig-02", lastShare: now - 601, hashrate: 0 },
      ],
      unconfirmed: [{ reward: "50000000", blockReward: "90000000000" }],
    },
    now * 1000,
  );
  expect(data).toMatchObject({
    balance: 1,
    paid: 2,
    pendingEstimate: 0.5,
    hashrate: 1024 * 2 ** 32,
    reward: null,
  });
  expect(data.workers.map((w) => w.online)).toEqual([true, false]);
  expect(() => parseHeroMiners({ error: "Not found" })).toThrow("not-found");
});

it("uses AlphaPool's one-hour rate and balances in whole PRL", () => {
  const data = parseAlphaPool(
    {
      address: wallet,
      estHash1hRaw: 576.24e12,
      balance_prl: 0.5,
      total_paid_prl: 4,
      workers: [
        { name: "rig", hashrate_1h: "576.24 TH/s", hashrate: "10 TH/s", online: true, time: now },
      ],
    },
    wallet,
  );
  expect(data).toMatchObject({ balance: 0.5, paid: 4, hashrate: 576.24e12, reward: null });
  expect(data.workers[0]).toEqual({
    name: "rig",
    hashrate: 576.24e12,
    online: true,
    lastSeen: now * 1000,
  });
});

it("removes the wallet prefix and excludes pending rewards from Pearlski's rolling 24h", () => {
  const data = parsePearlski(
    {
      address: wallet,
      stats_as_of: now,
      last_share_time: now,
      current_balance_grains: 150000000,
      pending_balance_grains: 40000000,
      total_paid_grains: 900000000,
      rolling_24h_mined_grains: 180000000,
      rolling_24h_mined_pending_grains: 40000000,
      rolling_24h_mined_window_start: now - 86400,
      rolling_24h_mined_window_end: now,
      workers: [{ worker: wallet + ".rig.01", hashrate_1h: 2e12, last_share_time: now }],
    },
    wallet,
  );
  expect(data).toMatchObject({
    balance: 1.5,
    pendingEstimate: 0.4,
    paid: 9,
    reward: 1.4,
    period: "rolling24h",
  });
  expect(data.workers[0]).toMatchObject({ name: "rig.01", online: true, hashrate: 2e12 });
  expect(poolCumulativeEarnings(data)).toBeCloseTo(10.9);
});

it("reads Pearl Fortune payouts, net pending PPLNS and Q64 PPS once", () => {
  const data = parsePearlFortune(
    {
      data: {
        chain: "pearl",
        balance: { balance_atomic: 50000000 },
        pending_shares: {
          pending_fee_quote: { rate: 0.02 },
          pending_net_amount_atomic: 40000000,
          pending_gross_amount_atomic: 41000000,
          pps_pending_amount_q64: String(25000000n * 2n ** 64n),
        },
        hourly_shares: {
          rolling_hashrates: [{ hours: 1, share_statistics: { effective_hashrate: 3e12 } }],
        },
      },
    },
    {
      data: { configured: true, workers: [{ worker: "gpu01", pool: { hashrate: 3e12 } }] },
    },
    {
      data: {
        chain_name: "pearl",
        sum_payout_amount_atomic: "200000000",
        sum_credit_amount_atomic: 500000000,
      },
    },
  );
  expect(data).toMatchObject({
    balance: 0.5,
    paid: 2,
    pendingEstimate: 0.65,
    hashrate: 3e12,
    reward: null,
  });
  expect(data.workers[0]).toMatchObject({ name: "gpu01", online: true });
  expect(poolCumulativeEarnings(data)).toBeCloseTo(3.15);
});
