import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { summarizeFarm, type FarmSummary } from "@/lib/farm";
import { getFarmMiners, getOccupancy, getRunProgressBatch, getRuns } from "@/lib/iota.functions";
import type { Occupancy, RunInfo } from "@/lib/iota-types";

export type FarmState = {
  farm: FarmSummary | null;
  occupancy: Occupancy | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshing: boolean;
  cooldownRemaining: number;
  sources: Array<{
    label: string;
    fetchedAt: number | null;
    error: string | null;
    loading: boolean;
    partial?: boolean;
  }>;
  coverage: { known: number; total: number };
  now: number;
};

/**
 * Network-wide view of every training run. Independent of the visitor's own
 * device list so the network page works before anything is added.
 */
export function useFarm(options?: {
  enabled?: boolean;
  /** run id -> how many of the visitor's own devices sit in that run */
  mineCounts?: Record<string, number>;
  /** fallback run metadata already fetched by device discovery */
  fallbackRuns?: RunInfo[] | null;
}): FarmState {
  const enabled = options?.enabled ?? true;
  const force = useRef(false);
  const busy = useRef(false);
  const lastRefresh = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const occupancyFn = useServerFn(getOccupancy);
  const runsFn = useServerFn(getRuns);
  const progressFn = useServerFn(getRunProgressBatch);
  const farmMinersFn = useServerFn(getFarmMiners);

  const occupancyQuery = useQuery({
    queryKey: ["iota", "occupancy"],
    queryFn: () => occupancyFn({ data: { force: force.current } }),
    enabled,
    refetchInterval: 120_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const runsQuery = useQuery({
    queryKey: ["iota", "runs"],
    queryFn: () => runsFn({ data: { force: force.current } }),
    enabled,
    staleTime: 120_000,
    refetchInterval: 300_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const runIds = useMemo(() => {
    const ids = [
      ...(occupancyQuery.data?.occupancy?.run_ids ?? []),
      ...(runsQuery.data?.runs ?? [])
        .filter((run) => run.state === "active")
        .map((run) => run.run_id),
    ];
    return [...new Set(ids)].sort();
  }, [occupancyQuery.data?.occupancy?.run_ids, runsQuery.data?.runs]);

  const progressQuery = useQuery({
    queryKey: ["iota", "progress", runIds.join(",")],
    queryFn: () => progressFn({ data: { runIds, force: force.current } }),
    enabled: enabled && runIds.length > 0,
    staleTime: 45_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const minersQuery = useQuery({
    queryKey: ["iota", "farm-miners", runIds.join(",")],
    queryFn: () => farmMinersFn({ data: { runIds, force: force.current } }),
    enabled: enabled && runIds.length > 0,
    staleTime: 45_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const occupancy = occupancyQuery.data?.occupancy ?? null;
  const mineCounts = options?.mineCounts;
  const fallbackRuns = options?.fallbackRuns;

  const farm = useMemo(
    () =>
      summarizeFarm(
        occupancy,
        (runsQuery.data?.runs ?? fallbackRuns)?.filter((run) => run.state === "active") ?? null,
        progressQuery.data?.progress,
        mineCounts,
        minersQuery.data,
      ),
    [
      occupancy,
      runsQuery.data?.runs,
      fallbackRuns,
      progressQuery.data?.progress,
      mineCounts,
      minersQuery.data,
    ],
  );

  const sources = [
    {
      label: "任务列表",
      fetchedAt: runsQuery.data?.fetchedAt ?? null,
      error: runsQuery.data?.error ?? runsQuery.error?.message ?? null,
      loading: runsQuery.isFetching,
    },
    {
      label: "网络名额",
      fetchedAt: occupancyQuery.data?.fetchedAt ?? null,
      error: occupancyQuery.data?.error ?? occupancyQuery.error?.message ?? null,
      loading: occupancyQuery.isFetching,
    },
    {
      label: "矿工名单",
      fetchedAt: minersQuery.data?.fetchedAt ?? null,
      error: minersQuery.data?.errors?.join("；") || minersQuery.error?.message || null,
      partial:
        (minersQuery.data?.freshRuns ?? 0) > 0 &&
        (minersQuery.data?.freshRuns ?? 0) < runIds.length,
      loading: minersQuery.isFetching,
    },
    {
      label: "训练进度",
      fetchedAt: progressQuery.data?.fetchedAt ?? null,
      error: progressQuery.data?.errors?.join("；") || progressQuery.error?.message || null,
      partial:
        Object.values(progressQuery.data?.progress ?? {}).some((value) => value !== null) &&
        (progressQuery.data?.errors?.length ?? 0) > 0,
      loading: progressQuery.isFetching,
    },
  ];
  const refresh = useCallback(async () => {
    if (busy.current || Date.now() - lastRefresh.current < 15_000) return;
    busy.current = true;
    force.current = true;
    lastRefresh.current = Date.now();
    setRefreshing(true);
    try {
      await Promise.all([
        occupancyQuery.refetch({ cancelRefetch: false }),
        runsQuery.refetch({ cancelRefetch: false }),
        progressQuery.refetch({ cancelRefetch: false }),
        minersQuery.refetch({ cancelRefetch: false }),
      ]);
    } finally {
      force.current = false;
      busy.current = false;
      setRefreshing(false);
    }
  }, [occupancyQuery, runsQuery, progressQuery, minersQuery]);

  return {
    farm,
    occupancy,
    refresh,
    refreshing,
    sources,
    now,
    cooldownRemaining: Math.max(0, 15_000 - (now - lastRefresh.current)),
    coverage: { known: minersQuery.data?.freshRuns ?? 0, total: runIds.length },
    loading: occupancyQuery.isLoading || runsQuery.isLoading,
    error:
      sources
        .map((source) => source.error)
        .filter(Boolean)
        .join("；") || null,
  };
}
