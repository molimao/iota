import { createServerFn } from "@tanstack/react-start";

import { sumTodayUnits, toUnits } from "./earnings";
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

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export const getRuns = createServerFn({ method: "POST" })
  .inputValidator((input: { force?: boolean }) => ({ force: input?.force === true }))
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
  .inputValidator((input: { force?: boolean }) => ({ force: input?.force === true }))
  .handler(async ({ data }) => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const result = await fetchUpstream<Occupancy>("/v1/runs_occupancy", TTL.occupancy, data.force);
    return { occupancy: result.data, fetchedAt: result.fetchedAt, error: result.error };
  });

export const getRunProgress = createServerFn({ method: "POST" })
  .inputValidator((input: { runId: string; force?: boolean }) => ({
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

/**
 * Discovers saved devices by matching the exact hotkey across the miner lists of
 * ALL currently active runs. Duplicate hotkeys across runs are deduped by the
 * most recent statistics sample timestamp.
 */
export const discoverDevices = createServerFn({ method: "POST" })
  .inputValidator((input: { hotkeys: string[]; force?: boolean }) => ({
    hotkeys: validHotkeys(input?.hotkeys),
    force: input?.force === true,
  }))
  .handler(async ({ data }): Promise<DiscoveryResult> => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const errors: string[] = [];

    const runsResult = await fetchUpstream<{ runs?: RunInfo[] }>("/runs", TTL.runs, data.force);
    if (runsResult.error) errors.push(`训练任务列表：${runsResult.error}`);
    const allRuns = Array.isArray(runsResult.data?.runs) ? runsResult.data!.runs : [];
    const activeRuns = allRuns.filter(
      (run) => run.state === "active" && RUN_ID_RE.test(run.run_id),
    );

    const wanted = new Set(data.hotkeys);
    const best = new Map<
      string,
      { miner: MinerRecord; fetchedAt: number | null; runIds: Set<string> }
    >();
    let runsFetched = 0;
    let lastFetchedAt: number | null = null;

    const lists = await Promise.all(
      activeRuns.map(async (run) => {
        const result = await fetchUpstream<{ miners?: MinerRecord[] }>(
          `/miners?run_id=${encodeURIComponent(run.run_id)}`,
          TTL.miners,
          data.force,
        );
        return { run, result };
      }),
    );

    for (const { run, result } of lists) {
      if (result.error) errors.push(`任务 ${run.run_id}：${result.error}`);
      const miners = Array.isArray(result.data?.miners) ? result.data!.miners : null;
      if (miners === null) continue;
      if (!result.error) runsFetched += 1;
      if (
        result.fetchedAt !== null &&
        (lastFetchedAt === null || result.fetchedAt < lastFetchedAt)
      ) {
        lastFetchedAt = result.fetchedAt;
      }
      for (const miner of miners) {
        if (!miner || typeof miner.hotkey !== "string" || !wanted.has(miner.hotkey)) continue;
        const entry = best.get(miner.hotkey);
        if (!entry) {
          best.set(miner.hotkey, {
            miner,
            fetchedAt: result.fetchedAt,
            runIds: new Set([miner.run_id ?? run.run_id]),
          });
        } else {
          entry.runIds.add(miner.run_id ?? run.run_id);
          const currentTs = numberOrNull(miner.timestamp) ?? 0;
          const bestTs = numberOrNull(entry.miner.timestamp) ?? 0;
          if (currentTs > bestTs) {
            entry.miner = miner;
            entry.fetchedAt = result.fetchedAt;
          }
        }
      }
    }

    const devices: DiscoveredDevice[] = data.hotkeys.map((hotkey) => {
      const entry = best.get(hotkey);
      return {
        hotkey,
        miner: entry?.miner ?? null,
        fetchedAt: entry?.fetchedAt ?? null,
        runIds: entry ? [...entry.runIds] : [],
      };
    });

    const runsTotal = activeRuns.length;
    return {
      devices,
      runs: activeRuns,
      runsTotal,
      runsFetched,
      fullCoverage: runsTotal > 0 && runsFetched === runsTotal && !runsResult.error,
      fetchedAt: lastFetchedAt,
      errors,
    };
  });

/** Rewards are queried for EVERY saved hotkey, even ones absent from run lists. */
export const getEarnings = createServerFn({ method: "POST" })
  .inputValidator((input: { hotkeys: string[]; force?: boolean }) => ({
    hotkeys: validHotkeys(input?.hotkeys),
    force: input?.force === true,
  }))
  .handler(async ({ data }): Promise<{ devices: DeviceEarnings[]; now: number }> => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const now = Date.now();

    const devices = await Promise.all(
      data.hotkeys.map(async (hotkey): Promise<DeviceEarnings> => {
        const encoded = encodeURIComponent(hotkey);
        const [totalsResult, historyResult] = await Promise.all([
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

        const totals = totalsResult.data;
        const history = historyResult.data;
        const today = sumTodayUnits(history, now);
        const recent = (() => {
          if (
            !history ||
            !Array.isArray(history.alpha_amounts) ||
            !Array.isArray(history.timestamps) ||
            !Array.isArray(history.statuses)
          ) {
            return [] as DeviceEarnings["recent"];
          }
          return history.alpha_amounts
            .map((amount, index) => ({
              timestamp: history.timestamps[index] ?? 0,
              units: toUnits(amount) ?? 0,
              status: history.statuses[index] ?? "unknown",
            }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 30);
        })();

        const fetchedCandidates = [totalsResult.fetchedAt, historyResult.fetchedAt].filter(
          (value): value is number => value !== null,
        );
        const errors = [totalsResult.error, historyResult.error].filter(
          (value): value is string => value !== null,
        );

        const earnedRaw = numberOrNull(totals?.total_amount_earned);

        return {
          hotkey,
          totalEarnedUnits: earnedRaw === null ? null : toUnits(earnedRaw),
          todayUnits: today.units,
          pendingUnits: totals ? toUnits(numberOrNull(totals.total_amount_pending) ?? 0) : null,
          frozenUnits: totals ? toUnits(numberOrNull(totals.total_amount_frozen) ?? 0) : null,
          minimumPayoutUnits: totals
            ? toUnits(numberOrNull(totals.minimum_payout_amount) ?? 0)
            : null,
          historyCount: recent.length,
          recent,
          fetchedAt: fetchedCandidates.length ? Math.min(...fetchedCandidates) : null,
          error: errors.length ? errors.join("；") : null,
        };
      }),
    );

    return { devices, now };
  });

export const getDeviceSeries = createServerFn({ method: "POST" })
  .inputValidator((input: { runId: string; hotkey: string; period?: string; force?: boolean }) => {
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
      fetchedAt: metrics.fetchedAt,
      error: errors.length ? errors.join("；") : null,
    };
  });
