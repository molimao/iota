import type { MinerRecord, Occupancy, RunInfo, RunProgress } from "./iota-types";
import { normalizeCountry } from "./distribution";

export type FarmRun = {
  runId: string;
  name: string;
  model: string | null;
  modelSize: string | null;
  splits: number | null;
  tier: string | null;
  state: string | null;
  maxMiners: number | null;
  activeMiners: number | null;
  slotsRemaining: number | null;
  tokens: number | null;
  totalTokens: number | null;
  activations: number | null;
  totalActivations: number | null;
  loss: number | null;
  mineCount: number;
  listed: number | null;
  online: number | null;
  training: number | null;
};

export type FarmSummary = {
  runs: FarmRun[];
  activeRuns: number;
  fullRuns: number;
  activeMiners: number | null;
  maxMiners: number | null;
  slotsRemaining: number | null;
  tokens: number | null;
  totalTokens: number | null;
  lossMin: number | null;
  lossMax: number | null;
  modelLabel: string | null;
  modelSize: string | null;
  splits: number | null;
  listed: number | null;
  online: number | null;
  training: number | null;
  countries: Array<{ country: string; count: number }>;
  tiers: Array<{
    tier: string;
    runs: number;
    maxMiners: number | null;
    slotsRemaining: number | null;
    online: number | null;
    training: number | null;
  }>;
};

export type FarmMinerRun = {
  runId: string;
  listed: number;
  online: number;
  training: number;
};

export type FarmMinerStats = {
  runs: FarmMinerRun[];
  listed: number | null;
  online: number | null;
  training: number | null;
  knownRuns: number;
  totalRuns: number;
  countries: Array<{ country: string; count: number }>;
};

export function aggregateFarmMiners(
  lists: Array<{ runId: string; miners: MinerRecord[] | null }>,
): FarmMinerStats {
  const countries = new Map<string, number>();
  const runs: FarmMinerRun[] = [];
  const unique = new Map<string, MinerRecord>();
  for (const list of lists) {
    if (list.miners === null) continue;
    const miners = list.miners;
    let online = 0;
    let training = 0;
    for (const [index, miner] of miners.entries()) {
      if (miner.is_active) {
        online += 1;
        if ((miner.throughput ?? 0) > 0) training += 1;
      }
      const key = miner.hotkey || `${list.runId}:${index}`;
      const old = unique.get(key);
      if (!old || miner.timestamp >= old.timestamp) unique.set(key, miner);
    }
    runs.push({ runId: list.runId, listed: miners.length, online, training });
  }
  for (const miner of unique.values()) {
    const country = normalizeCountry(miner.location_country);
    if (country) countries.set(country, (countries.get(country) ?? 0) + 1);
  }
  const all = [...unique.values()];
  return {
    runs,
    knownRuns: runs.length,
    totalRuns: lists.length,
    listed: runs.length ? all.length : null,
    online: runs.length ? all.filter((miner) => miner.is_active).length : null,
    training: runs.length
      ? all.filter((miner) => miner.is_active && miner.throughput > 0).length
      : null,
    countries: [...countries.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country)),
  };
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function parseRunTier(description?: string | null): string | null {
  if (!description) return null;
  const named = description.match(/\(([^)]+)\)\s*$/);
  if (named?.[1]) return named[1].trim();
  const trimmed = description.trim();
  return trimmed || null;
}

function occupancyAt(occupancy: Occupancy, index: number) {
  const maxMiners = occupancy.max_miners[index];
  const activeMiners = occupancy.active_miners[index];
  const slotsRemaining = occupancy.slots_remaining[index];
  if (!finite(maxMiners) || !finite(activeMiners) || !finite(slotsRemaining)) return null;
  return { maxMiners, activeMiners, slotsRemaining };
}

function attachProgress(
  runId: string,
  progress: Record<string, RunProgress | null> | null | undefined,
) {
  const item = progress?.[runId];
  return {
    tokens: finite(item?.token_count) ? item.token_count : null,
    totalTokens: finite(item?.total_tokens) ? item.total_tokens : null,
    activations: finite(item?.activation_count) ? item.activation_count : null,
    totalActivations: finite(item?.total_activations) ? item.total_activations : null,
    loss: finite(item?.loss) ? item.loss : null,
  };
}

function fromInfo(
  info: RunInfo | undefined,
  runId: string,
  slots: { maxMiners: number | null; activeMiners: number | null; slotsRemaining: number | null },
  progress: Record<string, RunProgress | null> | null | undefined,
  mineCounts: Record<string, number> | null | undefined,
): FarmRun {
  return {
    runId,
    name: info?.name || runId,
    model: info?.metadata?.model_name ?? null,
    modelSize: info?.metadata?.model_size ?? null,
    splits: finite(info?.metadata?.n_splits) ? info!.metadata!.n_splits! : null,
    tier: parseRunTier(info?.metadata?.description),
    state: info?.state ?? null,
    ...slots,
    ...attachProgress(runId, progress),
    mineCount: mineCounts?.[runId] ?? 0,
    listed: null,
    online: null,
    training: null,
  };
}

function uniqueLabel(values: Array<string | null>): string | null {
  const labels = [...new Set(values.filter((item): item is string => !!item))];
  return labels.length === 1 ? (labels[0] as string) : null;
}

function uniqueNumber(values: Array<number | null>): number | null {
  const nums = [...new Set(values.filter(finite))];
  return nums.length === 1 ? (nums[0] as number) : null;
}

function sumKnown(values: Array<number | null>): number | null {
  const nums = values.filter(finite);
  return nums.length ? nums.reduce((sum, item) => sum + item, 0) : null;
}

export function summarizeFarm(
  occupancy: Occupancy | null | undefined,
  runs: RunInfo[] | null | undefined,
  progress?: Record<string, RunProgress | null> | null,
  mineCounts?: Record<string, number> | null,
  minerStats?: FarmMinerStats | null,
): FarmSummary | null {
  const byId = new Map((runs ?? []).map((run) => [run.run_id, run]));
  const items: FarmRun[] = [];
  const seen = new Set<string>();
  const ids = occupancy?.run_ids ?? [];
  const n = Math.min(
    ids.length,
    occupancy?.max_miners?.length ?? 0,
    occupancy?.active_miners?.length ?? 0,
    occupancy?.slots_remaining?.length ?? 0,
  );
  for (let i = 0; i < n; i++) {
    const runId = ids[i];
    if (!runId || !occupancy) continue;
    const slots = occupancyAt(occupancy, i);
    if (!slots) continue;
    seen.add(runId);
    items.push(fromInfo(byId.get(runId), runId, slots, progress, mineCounts));
  }
  for (const info of runs ?? []) {
    if (!info.run_id || seen.has(info.run_id)) continue;
    seen.add(info.run_id);
    items.push(
      fromInfo(
        info,
        info.run_id,
        { maxMiners: null, activeMiners: null, slotsRemaining: null },
        progress,
        mineCounts,
      ),
    );
  }
  if (!items.length) return null;
  const minersByRun = new Map((minerStats?.runs ?? []).map((item) => [item.runId, item]));
  for (const item of items) {
    const miners = minersByRun.get(item.runId);
    if (!miners) continue;
    item.listed = miners.listed;
    item.online = miners.online;
    item.training = miners.training;
  }
  items.sort((a, b) => a.runId.localeCompare(b.runId, undefined, { numeric: true }));
  const losses = items.map((item) => item.loss).filter(finite);
  const namedActive = items.filter((item) => item.state === "active").length;
  const tierMap = new Map<string, FarmSummary["tiers"][number]>();
  for (const item of items) {
    const key = item.tier || "—";
    const current = tierMap.get(key) ?? {
      tier: key,
      runs: 0,
      maxMiners: null,
      slotsRemaining: null,
      online: null,
      training: null,
    };
    current.runs += 1;
    current.maxMiners = sumKnown([current.maxMiners, item.maxMiners]);
    current.slotsRemaining = sumKnown([current.slotsRemaining, item.slotsRemaining]);
    current.online = sumKnown([current.online, item.online]);
    current.training = sumKnown([current.training, item.training]);
    tierMap.set(key, current);
  }
  return {
    runs: items,
    activeRuns: namedActive || items.length,
    fullRuns: items.filter((item) => item.slotsRemaining === 0).length,
    activeMiners: sumKnown(items.map((item) => item.activeMiners)),
    maxMiners: sumKnown(items.map((item) => item.maxMiners)),
    slotsRemaining: sumKnown(items.map((item) => item.slotsRemaining)),
    tokens: sumKnown(items.map((item) => item.tokens)),
    totalTokens: sumKnown(items.map((item) => item.totalTokens)),
    lossMin: losses.length ? Math.min(...losses) : null,
    lossMax: losses.length ? Math.max(...losses) : null,
    modelLabel: uniqueLabel(items.map((item) => item.model)),
    modelSize: uniqueLabel(items.map((item) => item.modelSize)),
    splits: uniqueNumber(items.map((item) => item.splits)),
    listed: minerStats?.listed ?? null,
    online: minerStats?.online ?? null,
    training: minerStats?.training ?? null,
    countries: minerStats?.countries ?? [],
    tiers: [...tierMap.values()].sort((a, b) => {
      const order = ["Bronze", "Silver", "Gold"];
      const left = order.indexOf(a.tier);
      const right = order.indexOf(b.tier);
      return (left < 0 ? 99 : left) - (right < 0 ? 99 : right);
    }),
  };
}
