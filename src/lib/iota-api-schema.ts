import { z } from "zod";

const count = z.number().finite().nonnegative();
const runId = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/);
const numbers = z.array(count);
const timestamps = z.array(count);
const run = z.object({
  run_id: runId,
  name: z.string(),
  state: z.string(),
  metadata: z
    .object({
      description: z.string().optional(),
      n_splits: count.optional(),
      model_name: z.string().optional(),
      model_size: z.string().optional(),
    })
    .nullable()
    .optional(),
});
const miner = z.object({
  hotkey: z.string().min(1),
  coldkey: z.string(),
  timestamp: count,
  layer: count.int(),
  activation_count: count,
  throughput: count,
  is_active: z.boolean(),
  registration_time: count,
  run_id: runId.optional(),
  location_name: z.string().nullable().optional(),
  location_country: z.string().nullable().optional(),
});

function aligned<T extends z.ZodRawShape>(shape: T, fields: string[]) {
  return z.object(shape).refine((data) => {
    const record = data as Record<string, unknown>;
    const lengths = fields.map((key) => (record[key] as unknown[]).length);
    return lengths.every((length) => length === lengths[0]);
  }, "parallel arrays have different lengths");
}

const schemas = {
  runs: z.object({ runs: z.array(run) }),
  miners: z.object({ miners: z.array(miner) }),
  progress: z.object({
    activation_count: count,
    total_activations: count,
    token_count: count,
    total_tokens: count,
    loss: z.number().finite().nullable(),
  }),
  occupancy: aligned(
    {
      run_ids: z.array(runId),
      max_miners: numbers,
      active_miners: numbers,
      slots_remaining: numbers,
    },
    ["run_ids", "max_miners", "active_miners", "slots_remaining"],
  ),
  totals: z.object({
    total_amount_earned: count,
    total_amount_paid: count,
    total_amount_pending: count,
    total_amount_frozen: count,
    minimum_payout_amount: count,
  }),
  history: aligned({ alpha_amounts: numbers, timestamps, statuses: z.array(z.string()) }, [
    "alpha_amounts",
    "timestamps",
    "statuses",
  ]),
  metrics: aligned(
    {
      epochs: numbers,
      token_counts: numbers,
      act_contribution_percs: numbers,
      activation_ranks: numbers,
      num_hotkeys_in_epochs: numbers,
      timestamps,
    },
    [
      "epochs",
      "token_counts",
      "act_contribution_percs",
      "activation_ranks",
      "num_hotkeys_in_epochs",
      "timestamps",
    ],
  ),
  throughput: aligned({ epochs: numbers, throughputs: numbers, timestamps }, [
    "epochs",
    "throughputs",
    "timestamps",
  ]),
  cumulative_tokens: aligned({ epochs: numbers, token_counts_cumulative: numbers, timestamps }, [
    "epochs",
    "token_counts_cumulative",
    "timestamps",
  ]),
};

/** Enforce the allowlist at the network boundary, including every query parameter. */
export function upstreamKind(path: string): keyof typeof schemas {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("#"))
    throw new Error("非法的官方 API 路径");
  const url = new URL(path, "https://iota-web.api.macrocosmos.ai");
  const keys = [...url.searchParams.keys()];
  if (url.pathname === "/runs" && !keys.length) return "runs";
  if (url.pathname === "/v1/runs_occupancy" && !keys.length) return "occupancy";
  if (
    ["/miners", "/progress"].includes(url.pathname) &&
    keys.length <= 1 &&
    keys.every((key) => key === "run_id")
  ) {
    const id = url.searchParams.get("run_id");
    if (id !== null && !runId.safeParse(id).success) throw new Error("非法的训练任务编号");
    if (url.pathname === "/miners") return "miners";
    if (id) return "progress";
  }
  const rewards = url.pathname.match(
    /^\/v1\/entitlements\/(totals|history)\/hotkey\/([1-9A-HJ-NP-Za-km-z]{45,50})$/,
  );
  if (rewards && !keys.length) return rewards[1] as "totals" | "history";
  const series = url.pathname.match(
    /^\/v1\/epoch_miner_scores\/runs\/([A-Za-z0-9][A-Za-z0-9._-]{0,63})\/hotkeys\/([1-9A-HJ-NP-Za-km-z]{45,50})\/(metrics|throughput|cumulative_tokens)$/,
  );
  if (
    series &&
    keys.length === 1 &&
    keys[0] === "period" &&
    ["day", "week", "month"].includes(url.searchParams.get("period") || "")
  )
    return series[3] as "metrics" | "throughput" | "cumulative_tokens";
  throw new Error("非法的官方 API 路径");
}

export function parseUpstreamPayload(path: string, value: unknown): unknown {
  const result = schemas[upstreamKind(path)].safeParse(value);
  if (!result.success) throw new Error("官方数据格式异常，已保留上次有效数据。");
  return result.data;
}
