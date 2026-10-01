import { createServerFn } from "@tanstack/react-start";

import { mapConcurrent } from "./concurrent";
import { aggregateFarmMiners } from "./farm";
import { validFetchedAt } from "./device-status";

import type {
  CumulativeTokens,
  DeviceEarnings,
  DiscoveredDevice,
  DiscoveryResult,
  EntitlementHistory,
  EntitlementTotals,
  EpochMetrics,
  MinerRecord,
  Occupancy,
  RunInfo,
  RunProgress,
  ThroughputSeries,
} from "./iota-types";
import { isValidMinerId } from "./ss58";

const RUN_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const PERIODS = ["day", "week", "month"] as const;
const MAX_HOTKEYS_PER_CALL = 200;

type Period = (typeof PERIODS)[number];

function validHotkeys(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  for (const item of input) {
    if (typeof item !== "string") continue;
    const value = item.trim();
    if (!isValidMinerId(value)) continue;
    seen.add(value);
    if (seen.size > MAX_HOTKEYS_PER_CALL) throw new Error("单次最多查询 200 台设备，请分批查询");
  }
  return [...seen];
}

function validRunId(input: unknown): string {
  if (typeof input !== "string" || !RUN_ID_RE.test(input)) {
    throw new Error("非法的训练任务编号");
  }
  return input;
}

function validPeriod(input: unknown): Period {
  return (PERIODS as readonly string[]).includes(input as string) ? (input as Period) : "week";
}

function validHintRunIds(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  for (const item of input) {
    if (typeof item !== "string") continue;
    const value = item.trim();
    if (!RUN_ID_RE.test(value) || seen.has(value)) continue;
    seen.add(value);
    if (seen.size >= 20) break;
  }
  return [...seen];
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export const getRuns = createServerFn({ method: "POST" })
  .validator((input: { force?: boolean }) => ({ force: input?.force === true }))
  .handler(async ({ data }) => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const result = await fetchUpstream<{ runs?: RunInfo[] }>("/runs", TTL.runs, data.force);
    const runs = Array.isArray(result.data?.runs) ? result.data!.runs : null;
    return {
      runs: runs?.filter((run) => run && typeof run.run_id === "string") ?? null,
      fetchedAt: result.fetchedAt,
      error: result.error,
      stale: result.stale,
    };
  });

export const getOccupancy = createServerFn({ method: "POST" })
  .validator((input: { force?: boolean }) => ({ force: input?.force === true }))
  .handler(async ({ data }) => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const result = await fetchUpstream<Occupancy>("/v1/runs_occupancy", TTL.occupancy, data.force);
    return { occupancy: result.data, fetchedAt: result.fetchedAt, error: result.error };
  });

export const getRunProgress = createServerFn({ method: "POST" })
  .validator((input: { runId: string; force?: boolean }) => ({
    runId: validRunId(input?.runId),
    force: input?.force === true,
  }))
  .handler(async ({ data }) => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const result = await fetchUpstream<RunProgress>(
      `/progress?run_id=${encodeURIComponent(data.runId)}`,
      TTL.progress,
      data.force,
    );
    return { progress: result.data, fetchedAt: result.fetchedAt, error: result.error };
  });

export const getRunProgressBatch = createServerFn({ method: "POST" })
  .validator((input: { runIds?: string[]; force?: boolean }) => ({
    runIds: validHintRunIds(input?.runIds),
    force: input?.force === true,
  }))
  .handler(async ({ data }) => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const entries = await mapConcurrent(data.runIds, 3, async (runId) => {
      const result = await fetchUpstream<RunProgress>(
        `/progress?run_id=${encodeURIComponent(runId)}`,
        TTL.progress,
        data.force,
      );
      return { runId, ...result };
    });
    const clocks = entries
      .map((entry) => entry.fetchedAt)
      .filter((clock): clock is number => clock !== null);
    return {
      progress: Object.fromEntries(entries.map((entry) => [entry.runId, entry.data])) as Record<
        string,
        RunProgress | null
      >,
      fetchedAt: clocks.length ? Math.min(...clocks) : null,
      errors: entries
        .filter((entry) => entry.error)
        .map((entry) => `任务 ${entry.runId}：${entry.error}`),
    };
  });

export const getFarmMiners = createServerFn({ method: "POST" })
  .validator((input: { runIds?: string[]; force?: boolean }) => ({
    runIds: validHintRunIds(input?.runIds),
    force: input?.force === true,
  }))
  .handler(async ({ data }) => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const lists = await mapConcurrent(data.runIds, 3, async (runId) => {
      const result = await fetchUpstream<{ miners?: MinerRecord[] }>(
        `/miners?run_id=${encodeURIComponent(runId)}`,
        TTL.miners,
        data.force,
      );
      return {
        runId,
        miners: Array.isArray(result.data?.miners) ? result.data!.miners : null,
        fetchedAt: result.fetchedAt,
        error: result.error,
      };
    });
    const clocks = lists
      .map((list) => list.fetchedAt)
      .filter((clock): clock is number => clock !== null);
    return {
      ...aggregateFarmMiners(lists),
      freshRuns: lists.filter((list) => list.miners !== null && !list.error).length,
      fetchedAt: clocks.length ? Math.min(...clocks) : null,
      errors: lists.filter((list) => list.error).map((list) => `任务 ${list.runId}：${list.error}`),
    };
  });

/**
 * Discovers saved devices by matching the exact hotkey across the miner lists of
 * ALL currently active runs. Duplicate hotkeys across runs are deduped by the
 * most recent statistics sample timestamp.
 */
export const discoverDevices = createServerFn({ method: "POST" })
  .validator((input: { hotkeys: string[]; force?: boolean; hintRunIds?: string[] }) => ({
    hotkeys: validHotkeys(input?.hotkeys),
    force: input?.force === true,
    hintRunIds: validHintRunIds(input?.hintRunIds),
  }))
  .handler(async ({ data }): Promise<DiscoveryResult> => {
    const { discoverOfficialDevices } = await import("./iota-discovery.server");
    return discoverOfficialDevices(data.hotkeys, data.force, data.hintRunIds);
  });

/** Rewards are queried for EVERY saved hotkey, even ones absent from run lists. */
export const getEarnings = createServerFn({ method: "POST" })
  .validator((input: { hotkeys: string[]; force?: boolean }) => ({
    hotkeys: validHotkeys(input?.hotkeys),
    force: input?.force === true,
  }))
  .handler(async ({ data }): Promise<{ devices: DeviceEarnings[]; now: number }> => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const { buildDeviceEarnings } = await import("./earnings-data");
    const devices = await mapConcurrent(data.hotkeys, 3, async (hotkey) => {
      const encoded = encodeURIComponent(hotkey);
      const [totals, history] = await Promise.all([
        fetchUpstream<EntitlementTotals>(
          `/v1/entitlements/totals/hotkey/${encoded}`,
          TTL.rewards,
          data.force,
        ),
        fetchUpstream<EntitlementHistory>(
          `/v1/entitlements/history/hotkey/${encoded}`,
          TTL.rewards,
          data.force,
        ),
      ]);
      return buildDeviceEarnings(hotkey, totals, history, Date.now());
    });
    return { devices, now: Date.now() };
  });

export const getIotaUsdPrice = createServerFn({ method: "POST" })
  .validator((input: { force?: boolean }) => ({ force: input?.force === true }))
  .handler(async ({ data }) => {
    const { fetchIotaUsdPrice } = await import("./iota-price.server");
    return fetchIotaUsdPrice(data.force);
  });

export const getDeviceSeries = createServerFn({ method: "POST" })
  .validator((input: { runId: string; hotkey: string; period?: string; force?: boolean }) => {
    const hotkey = typeof input?.hotkey === "string" ? input.hotkey.trim() : "";
    if (!isValidMinerId(hotkey)) throw new Error("非法的 Miner ID");
    return {
      runId: validRunId(input?.runId),
      hotkey,
      period: validPeriod(input?.period),
      force: input?.force === true,
    };
  })
  .handler(async ({ data }) => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const prefix = `/v1/epoch_miner_scores/runs/${encodeURIComponent(data.runId)}/hotkeys/${encodeURIComponent(data.hotkey)}`;
    const query = `?period=${data.period}`;

    const [metrics, throughput, cumulative] = await Promise.all([
      fetchUpstream<EpochMetrics>(`${prefix}/metrics${query}`, TTL.metrics, data.force),
      fetchUpstream<ThroughputSeries>(`${prefix}/throughput${query}`, TTL.metrics, data.force),
      fetchUpstream<CumulativeTokens>(
        `${prefix}/cumulative_tokens${query}`,
        TTL.metrics,
        data.force,
      ),
    ]);

    const errors = [metrics.error, throughput.error, cumulative.error].filter(
      (value): value is string => value !== null,
    );

    return {
      metrics: metrics.data,
      throughput: throughput.data,
      cumulative: cumulative.data,
      fetchedAt: [metrics.fetchedAt, throughput.fetchedAt, cumulative.fetchedAt].reduce<
        number | null
      >(
        (oldest, clock) =>
          clock === null ? oldest : oldest === null ? clock : Math.min(oldest, clock),
        null,
      ),
      sources: {
        metrics: { fetchedAt: metrics.fetchedAt, error: metrics.error },
        throughput: { fetchedAt: throughput.fetchedAt, error: throughput.error },
        cumulative: { fetchedAt: cumulative.fetchedAt, error: cumulative.error },
      },
      error: errors.length ? errors.join("；") : null,
    };
  });
