import { z } from "zod";
import { MAC_MODELS, type HardwareYield } from "./hardware-yield.ts";
export const XMR_MAC_PROFILES = [
  { model: "m1-8c", chip: "Apple M1", cores: 8 },
  { model: "m1-pro-8c", chip: "Apple M1 Pro", cores: 8 },
  { model: "m1-pro-32", chip: "Apple M1 Pro", cores: 10 },
  { model: "m1-max-10c", chip: "Apple M1 Max", cores: 10 },
  { model: "m1-ultra-20c", chip: "Apple M1 Ultra", cores: 20 },
  { model: "m2-8c", chip: "Apple M2", cores: 8 },
  { model: "m2-pro-10c", chip: "Apple M2 Pro", cores: 10 },
  { model: "m2-pro-12c", chip: "Apple M2 Pro", cores: 12 },
  { model: "m2-max-12c", chip: "Apple M2 Max", cores: 12 },
  { model: "m2-ultra-24c", chip: "Apple M2 Ultra", cores: 24 },
  { model: "m3-8c", chip: "Apple M3", cores: 8 },
  { model: "m3-pro-12c", chip: "Apple M3 Pro", cores: 12 },
  { model: "m3-max-14c", chip: "Apple M3 Max", cores: 14 },
  { model: "m3-max-16c", chip: "Apple M3 Max", cores: 16 },
  { model: "m3-ultra-32c", chip: "Apple M3 Ultra", cores: 32 },
  { model: "m4-16", chip: "Apple M4", cores: 10 },
  { model: "m4-pro-12c", chip: "Apple M4 Pro", cores: 12 },
  { model: "m4-pro-14c", chip: "Apple M4 Pro", cores: 14 },
  { model: "m4-max-14c", chip: "Apple M4 Max", cores: 14 },
  { model: "m4-max-48", chip: "Apple M4 Max", cores: 16 },
] as const;
export const xmrigStoredBenchmarkSchema = z.object({
  model: z.enum(MAC_MODELS),
  chip: z.string(),
  cores: z.number().int().positive(),
  threads: z.number().int().positive(),
  hashrate: z.number().positive(),
  version: z.string(),
  benchmarkAt: z.number().positive(),
  durationMs: z.number().positive(),
  hashes: z.number().min(1000000),
  source: z.string().url(),
  recordId: z.string(),
  submissionCount: z.number().int().positive(),
  memoryGb: z.null(),
  watts: z.null(),
});
export type XmrMacBenchmark = z.infer<typeof xmrigStoredBenchmarkSchema>;
export const xmrigNetworkSchema = z.object({
  coin: z.literal("XMR"),
  algo: z.literal("rx/0"),
  difficulty: z.number().positive(),
  target: z.literal(120),
  height: z.number().int().positive(),
  reward: z.number().positive(),
  units: z.literal(1000000000000),
  ts: z.number().positive(),
});
export type XmrNetwork = z.infer<typeof xmrigNetworkSchema>;
export function xmrHardwareRows(
  benchmarks: readonly XmrMacBenchmark[],
  network: XmrNetwork,
  usd: number,
  now = Date.now(),
): HardwareYield[] {
  return benchmarks.map((b) => {
    const coinsPerDay =
      ((b.hashrate * 86400) / network.difficulty) * (network.reward / network.units);
    return {
      model: b.model,
      fetchedAt: now,
      source: "https://api.xmrig.com/1/network/XMR",
      rows: [
        {
          project: "xmr",
          fetchedAt: now,
          unit: "XMR",
          algorithm: "RandomX · XMRig",
          hashrate: b.hashrate,
          watts: null,
          basis: "network",
          source: b.source,
          network: {
            height: network.height,
            hashrate: network.difficulty / network.target,
            blockReward: network.reward / network.units,
            blocksPerDay: 86400 / network.target,
            referenceUsd: usd,
          },
          benchmark: {
            chip: b.chip,
            cores: b.cores,
            threads: b.threads,
            version: b.version,
            measuredAt: b.benchmarkAt,
            durationSeconds: b.durationMs / 1000,
            submissions: b.submissionCount,
          },
          coinsPerDay,
          usdPerDay: coinsPerDay * usd,
        },
      ],
    };
  });
}
