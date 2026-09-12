import { createServerFn } from "@tanstack/react-start";

import { withDeadline } from "./deadline";
import { validFetchedAt } from "./device-status";
import { sumTodayUnits, toUnits } from "./earnings";
import { orderActiveRuns } from "./iota-discover";
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

export const getRunProgressBatch = createServerFn({ method: "POST" })
  .inputValidator((input: { runIds?: string[]; force?: boolean }) => ({
    runIds: validHintRunIds(input?.runIds),
    force: input?.force === true,
  }))
  .handler(async ({ data }) => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const entries = await Promise.all(
      data.runIds.map(async (runId) => {
        const result = await fetchUpstream<RunProgress>(
          `/progress?run_id=${encodeURIComponent(runId)}`,
          TTL.progress,
          data.force,
        );
        return [runId, result.data] as const;
      }),
    );
    return { progress: Object.fromEntries(entries) as Record<string, RunProgress | null> };
  });

/**
 * Discovers saved devices by matching the exact hotkey across the miner lists of
 * ALL currently active runs. Duplicate hotkeys across runs are deduped by the
 * most recent statistics sample timestamp.
 */
export const discoverDevices = createServerFn({ method: "POST" })
  .inputValidator((input: { hotkeys: string[]; force?: boolean; hintRunIds?: string[] }) => ({
    hotkeys: validHotkeys(input?.hotkeys),
    force: input?.force === true,
    hintRunIds: validHintRunIds(input?.hintRunIds),
  }))
  .handler(async ({ data }): Promise<DiscoveryResult> => {
    const { fetchUpstream, TTL } = await import("./iota-upstream.server");
    const errors: string[] = [];
    const started = Date.now();
    const BUDGET_MS = 6_000;
    const EXTRA_RUN_LISTS = 2;
    const remain = () => Math.max(0, BUDGET_MS - (Date.now() - started));

    const wanted = new Set(data.hotkeys);
    const best = new Map<
      string,
      { miner: MinerRecord; fetchedAt: number | null; runIds: Set<string> }
    >();
    let activeRuns: RunInfo[] = [];
    let runsFetched = 0;
    let lastFetchedAt: number | null = null;
    let runsError = false;
    let timedOut = false;

    const ingest = (
      miners: MinerRecord[],
      fetchedAt: number | null,
      fallbackRunId?: string,
    ) => {
      if (fetchedAt !== null && (lastFetchedAt === null || fetchedAt > lastFetchedAt)) {
        lastFetchedAt = fetchedAt;
      }
      for (const miner of miners) {
        if (!miner || typeof miner.hotkey !== "string" || !wanted.has(miner.hotkey)) continue;
        const runId = miner.run_id || fallbackRunId;
        const entry = best.get(miner.hotkey);
        if (!entry) {
          best.set(miner.hotkey, {
            miner,
            fetchedAt,
            runIds: new Set(runId ? [runId] : []),
          });
          continue;
        }
        if (runId) entry.runIds.add(runId);
        const currentTs = numberOrNull(miner.timestamp) ?? 0;
        const bestTs = numberOrNull(entry.miner.timestamp) ?? 0;
        if (currentTs > bestTs) {
          entry.miner = miner;
          entry.fetchedAt = fetchedAt;
        }
      }
    };

    const snapshot = (fullCoverage: boolean): DiscoveryResult => ({
      devices: data.hotkeys.map((hotkey) => {
        const entry = best.get(hotkey);
        return {
          hotkey,
          miner: entry?.miner ?? null,
          fetchedAt: validFetchedAt(entry?.fetchedAt),
          runIds: entry ? [...entry.runIds] : [],
        };
      }),
      runs: activeRuns,
      runsTotal: activeRuns.length,
      runsFetched: Math.min(runsFetched, activeRuns.length),
      fullCoverage,
      fetchedAt: lastFetchedAt ?? Date.now(),
      errors,
    });

    const allFound = () => data.hotkeys.every((hotkey) => best.has(hotkey));

    const execute = async (): Promise<DiscoveryResult> => {
      const requestMs = () => Math.min(3_500, Math.max(remain(), 800));
      const [runsResult, untitled] = await Promise.all([
        fetchUpstream<{ runs?: RunInfo[] }>("/runs", TTL.runs, data.force, requestMs()),
        fetchUpstream<{ miners?: MinerRecord[] }>("/miners", TTL.miners, data.force, requestMs()),
      ]);
      if (runsResult.error) {
        runsError = true;
        errors.push(`训练任务列表：${runsResult.error}`);
      }
      const allRuns = Array.isArray(runsResult.data?.runs) ? runsResult.data!.runs : [];
      activeRuns = orderActiveRuns(
        allRuns.filter((item) => item.state === "active" && RUN_ID_RE.test(item.run_id)),
        data.hintRunIds,
      );
      lastFetchedAt = validFetchedAt(runsResult.fetchedAt) ?? lastFetchedAt;
      if (untitled.error) errors.push(`默认矿工名单：${untitled.error}`);
      const defaultMiners = Array.isArray(untitled.data?.miners) ? untitled.data!.miners : null;
      if (defaultMiners) ingest(defaultMiners, validFetchedAt(untitled.fetchedAt));

      let extra = 0;
      for (const item of activeRuns) {
        if (allFound()) break;
        if (remain() < 700) {
          timedOut = true;
          break;
        }
        if (extra >= EXTRA_RUN_LISTS) break;
        extra += 1;
        const result = await fetchUpstream<{ miners?: MinerRecord[] }>(
          `/miners?run_id=${encodeURIComponent(item.run_id)}`,
          TTL.miners,
          data.force,
          Math.min(3_500, remain()),
        );
        if (result.error) errors.push(`任务 ${item.run_id}：${result.error}`);
        const miners = Array.isArray(result.data?.miners) ? result.data!.miners : null;
        if (miners === null) continue;
        if (!result.error) runsFetched += 1;
        ingest(miners, validFetchedAt(result.fetchedAt), item.run_id);
      }

      if (timedOut && best.size < data.hotkeys.length) {
        errors.push("本次未在时限内读完全部训练任务名单，已返回当前已找到的设备");
      }

      const runsTotal = activeRuns.length;
      const scannedAll = !timedOut && runsTotal > 0 && runsFetched >= runsTotal;
      return snapshot(Boolean(scannedAll && !runsError));
    };

    try {
      return await withDeadline(execute(), BUDGET_MS + 400, "本次未在时限内读完官方名单");
    } catch (error) {
      if (best.size > 0) {
        const message = error instanceof Error ? error.message : "本次未在时限内读完官方名单";
        if (!errors.includes(message)) errors.push(message);
        return snapshot(false);
      }
      throw error;
    }
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

    const devices: DeviceEarnings[] = [];
    const loadOne = async (hotkey: string): Promise<DeviceEarnings> => {
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
    };

    for (let i = 0; i < data.hotkeys.length; i += 2) {
      devices.push(
        ...(await Promise.all(data.hotkeys.slice(i, i + 2).map((hotkey) => loadOne(hotkey)))),
      );
    }

    return { devices, now };
  });

export const getIotaUsdPrice = createServerFn({ method: "POST" })
  .inputValidator((input: { force?: boolean }) => ({ force: input?.force === true }))
  .handler(async ({ data }) => {
    const { fetchIotaUsdPrice } = await import("./iota-price.server");
    return fetchIotaUsdPrice(data.force);
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
