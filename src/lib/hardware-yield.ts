import { z } from "zod";
export const GPU_MODELS = ["4090", "5090", "4080", "4070", "4060", "3090", "3080", "3060"] as const;
export type GpuModel = (typeof GPU_MODELS)[number];
export const MAC_MODELS = ["m1-pro-32", "m4-16", "m4-max-48"] as const;
export const HARDWARE_MODELS = [...GPU_MODELS, ...MAC_MODELS] as const;
export type HardwareModel = (typeof HARDWARE_MODELS)[number];
export function hardwareLabel(model: HardwareModel) {
  return (
    {
      "m1-pro-32": "Apple M1 Pro · 32GB",
      "m4-16": "Apple M4 · 16GB",
      "m4-max-48": "Apple M4 Max · 48GB",
    }[model as (typeof MAC_MODELS)[number]] ?? `NVIDIA RTX ${model}`
  );
}
export const CALCULATOR_PROJECTS = ["iota", "bnt", "prl", "quantus", "rvn", "erg", "ethw"] as const;
export type CalculatorProject = (typeof CALCULATOR_PROJECTS)[number];
export const hardwareYieldSchema = z.object({
  model: z.enum(HARDWARE_MODELS),
  fetchedAt: z.number(),
  source: z.string().url(),
  rows: z
    .array(
      z
        .object({
          project: z.enum(CALCULATOR_PROJECTS),
          unit: z.string(),
          algorithm: z.string(),
          hashrate: z.number().positive().nullable(),
          watts: z.number().positive().nullable(),
          source: z.string().url().optional(),
          basis: z.enum(["pool", "network", "observed"]).default("pool"),
          network: z
            .object({
              height: z.number().int().positive(),
              hashrate: z.number().positive(),
              blockReward: z.number().positive(),
              blocksPerDay: z.literal(288),
              referenceUsd: z.number().positive(),
            })
            .optional(),
          sample: z
            .object({
              days: z.number().int().positive(),
              devices: z.number().int().positive(),
              start: z.string(),
              end: z.string(),
              zeroDays: z.number().int().nonnegative(),
              min: z.number().nonnegative(),
              max: z.number().nonnegative(),
            })
            .optional(),
          coinsPerDay: z.number().nonnegative(),
          usdPerDay: z.number().nonnegative(),
        })
        .refine(
          (row) => row.basis !== "pool" || (row.watts !== null && row.hashrate !== null),
          "Pool benchmark requires measured power and hashrate",
        ),
    )
    .min(1),
});
export type HardwareYield = z.infer<typeof hardwareYieldSchema>;
const projects: Record<string, CalculatorProject> = {
  PRL: "prl",
  QTC: "quantus",
  RVN: "rvn",
  ERG: "erg",
  ETHW: "ethw",
};
/** Embedded Nuxt values are daily figures; the visible table defaults to YEAR. */
export function parseHardwareYield(html: string, model: GpuModel, now = Date.now()): HardwareYield {
  const match = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) throw new Error("hardware_data_unavailable");
  const values: unknown = JSON.parse(match[1]!);
  if (!Array.isArray(values)) throw new Error("invalid_hardware_data");
  const rows = [];
  for (const value of values) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const refs = value as Record<string, unknown>;
    if (
      !["ticker", "algo", "hashrate", "power", "revenue", "revenue_usd"].every(
        (k) => typeof refs[k] === "number",
      )
    )
      continue;
    const get = (k: string) => values[refs[k] as number];
    const ticker = get("ticker"),
      algorithm = get("algo");
    if (typeof ticker !== "string" || !projects[ticker]) continue;
    // Quantus' pool symbol QTC collides with Qubitcoin. Never match on symbol alone.
    if (ticker === "QTC" && algorithm !== "Poseidon2") continue;
    rows.push({
      project: projects[ticker],
      unit: ticker,
      algorithm,
      hashrate: get("hashrate"),
      watts: get("power"),
      coinsPerDay: get("revenue"),
      usdPerDay: get("revenue_usd"),
    });
  }
  return hardwareYieldSchema.parse({
    model,
    fetchedAt: now,
    source: `https://pool.kryptex.com/device/gpu/nvidia/nvidia-geforce-rtx-${model}`,
    rows,
  });
}
export function estimateHardware(
  row: HardwareYield["rows"][number],
  hours: number,
  electricity: number,
) {
  const gross = (row.usdPerDay * hours) / 24,
    energy = row.watts === null ? null : (row.watts / 1000) * hours,
    cost = energy === null ? null : energy * electricity;
  return {
    gross,
    coins: (row.coinsPerDay * hours) / 24,
    energy,
    cost,
    net: cost === null ? null : gross - cost,
    monthlyGross: gross * 30,
    monthlyNet: cost === null ? null : (gross - cost) * 30,
  };
}

export const bntNetworkSchema = z.object({
  chain: z.object({
    current_job_height: z.number().int().positive(),
    network_hashrate: z.number().positive(),
  }),
});
export function blocknetReward(height: number) {
  const month = Math.floor(height / 8640);
  return (
    (month >= 48
      ? 200000000
      : Math.floor((72325093035 - 200000000) * Math.exp((-0.75 * month) / 12) + 200000000)) / 1e8
  );
}
export function blocknetCoinsPerDay(hashrate: number, height: number, network: number) {
  let rewards = 0;
  for (let i = 0; i < 288; i++) rewards += blocknetReward(height + i);
  return (hashrate / network) * rewards;
}
/** Complete UTC settlement days include gaps and explicit zero credits. */
export function summarizeIotaDays(
  history: { alpha_amounts: number[]; timestamps: number[]; statuses: string[] },
  end: number,
  days = 14,
) {
  const start = end - days * 86400000;
  const daily = Array<number>(days).fill(0);
  history.timestamps.forEach((seconds, i) => {
    const bucket = Math.floor((seconds * 1000 - start) / 86400000);
    if (history.statuses[i] === "settled" && bucket >= 0 && bucket < days)
      daily[bucket]! += history.alpha_amounts[i]!;
  });
  return {
    coinsPerDay: daily.reduce((a, b) => a + b, 0) / days,
    sample: {
      days,
      devices: 1,
      start: new Date(start).toISOString().slice(0, 10),
      end: new Date(end).toISOString().slice(0, 10),
      zeroDays: daily.filter((n) => n === 0).length,
      min: Math.min(...daily),
      max: Math.max(...daily),
    },
  };
}
