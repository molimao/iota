import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useMemo } from "react";

import { summarizeFarm, type FarmSummary } from "@/lib/farm";
import { getFarmMiners, getOccupancy, getRunProgressBatch, getRuns } from "@/lib/iota.functions";
import type { Occupancy, RunInfo } from "@/lib/iota-types";

export type FarmState = {
  farm: FarmSummary | null;
  occupancy: Occupancy | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
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
  const occupancyFn = useServerFn(getOccupancy);
  const runsFn = useServerFn(getRuns);
  const progressFn = useServerFn(getRunProgressBatch);
  const farmMinersFn = useServerFn(getFarmMiners);

  const occupancyQuery = useQuery({
    queryKey: ["iota", "occupancy"],
    queryFn: () => occupancyFn({ data: {} }),
    enabled,
    refetchInterval: 120_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const runsQuery = useQuery({
    queryKey: ["iota", "runs"],
    queryFn: () => runsFn({ data: {} }),
    enabled,
    staleTime: 120_000,
    refetchInterval: 300_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const runIds = useMemo(() => {
    const ids = [
      ...(occupancyQuery.data?.occupancy?.run_ids ?? []),
      ...(runsQuery.data?.runs ?? []).map((run) => run.run_id),
    ];
    return [...new Set(ids)].sort();
  }, [occupancyQuery.data?.occupancy?.run_ids, runsQuery.data?.runs]);

  const progressQuery = useQuery({
    queryKey: ["iota", "progress", runIds.join(",")],
    queryFn: () => progressFn({ data: { runIds } }),
    enabled: enabled && runIds.length > 0,
    staleTime: 45_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const minersQuery = useQuery({
    queryKey: ["iota", "farm-miners", runIds.join(",")],
    queryFn: () => farmMinersFn({ data: { runIds } }),
    enabled: enabled && runIds.length > 0,
    staleTime: 45_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const occupancy = occupancyQuery.data?.occupancy ?? null;
  const mineCounts = options?.mineCounts;
  const fallbackRuns = options?.fallbackRuns;

  const farm = useMemo(
    () =>
      summarizeFarm(
        occupancy,
        runsQuery.data?.runs ?? fallbackRuns ?? null,
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

  const refresh = useCallback(() => {
    void occupancyQuery.refetch();
    void runsQuery.refetch();
    void progressQuery.refetch();
    void minersQuery.refetch();
  }, [occupancyQuery, runsQuery, progressQuery, minersQuery]);

  return {
    farm,
    occupancy,
    loading: occupancyQuery.isLoading || runsQuery.isLoading,
    error: occupancyQuery.data?.error ?? occupancyQuery.error?.message ?? null,
    refresh,
  };
}
