import { blocknetCoinsPerDay, blocknetReward, type HardwareYield } from "./hardware-yield.ts";
import { BNT_REFERENCE_USD } from "./reference-prices.ts";
export const BLOCKNET_BENCHMARKS = [
  {
    model: "m4-max-48",
    hashrate: 29.26,
    source: "https://github.com/zpalmtree/seine/blob/master/docs/guides/apple-silicon.md",
  },
  {
    model: "5090",
    hashrate: 7.3,
    source: "https://seineminer.com/blog/blocknet-mining-hardware-hashrate/",
  },
] as const;
export function blocknetHardwareRows(
  height: number,
  network: number,
  now = Date.now(),
): HardwareYield[] {
  return BLOCKNET_BENCHMARKS.map((b) => ({
    model: b.model,
    fetchedAt: now,
    source: "https://bntpool.com/api/stats",
    rows: [
      {
        project: "bnt",
        unit: "BNT",
        algorithm: "Argon2id · Seine",
        hashrate: b.hashrate,
        watts: null,
        network: {
          height,
          hashrate: network,
          blockReward: blocknetReward(height),
          blocksPerDay: 288,
          referenceUsd: BNT_REFERENCE_USD,
        },
        basis: "network",
        source: b.source,
        coinsPerDay: blocknetCoinsPerDay(b.hashrate, height, network),
        usdPerDay: blocknetCoinsPerDay(b.hashrate, height, network) * BNT_REFERENCE_USD,
      },
    ],
  }));
}
