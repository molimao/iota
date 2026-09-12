import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { aggregateUnits, type Aggregate } from "@/lib/earnings";
import { withDeadline } from "@/lib/deadline";
import {
  computeStatus,
  latestValidClock,
  resolveLastSuccessfulFetchAt,
  statusBucket,
  type DeviceStatus,
  type StatusBucket,
} from "@/lib/device-status";
import { hintRunIdsFromDevices, mergeDiscovery } from "@/lib/iota-discover";
import { fetchSn9UsdFromMarkets } from "@/lib/iota-price-sources";
import { summarizeFarm } from "@/lib/farm";
import {
  discoverDevices,
  getEarnings,
  getIotaUsdPrice,
  getOccupancy,
  getRunProgressBatch,
  getRuns,
} from "@/lib/iota.functions";
import type { DeviceEarnings, DiscoveryResult, MinerRecord, Occupancy } from "@/lib/iota-types";
import { readTelemetryCache, writeTelemetryCache, type WatchEntry } from "@/lib/watchlist";

export const DISCOVERY_POLL_MS = 30_000;
export const EARNINGS_POLL_MS = 120_000;
export const MANUAL_COOLDOWN_MS = 15_000;
export const EARNINGS_FRESH_MS = 15 * 60 * 1000;
const DISCOVER_CLIENT_MS = 8_000;
const EARNINGS_CLIENT_MS = 16_000;
const REFRESH_CLIENT_MS = 18_000;

type Snapshot = {
  discovery: DiscoveryResult;
  earnings: DeviceEarnings[];
};

export type DeviceView = {
  entry: WatchEntry;
  miner: MinerRecord | null;
  runIds: string[];
  status: DeviceStatus;
  bucket: StatusBucket;
  earnings: DeviceEarnings | null;
  earningsUsable: boolean;
};

export function useIotaDashboard(entries: WatchEntry[], ready: boolean) {
  const hotkeys = useMemo(() => entries.map((entry) => entry.hotkey), [entries]);
  const hotkeyKey = useMemo(() => [...hotkeys].sort().join(","), [hotkeys]);

  const discoverFn = useServerFn(discoverDevices);
  const earningsFn = useServerFn(getEarnings);
  const occupancyFn = useServerFn(getOccupancy);
  const runsFn = useServerFn(getRuns);
  const progressFn = useServerFn(getRunProgressBatch);
  const priceFn = useServerFn(getIotaUsdPrice);

  const forceRef = useRef(false);
  const hintRunIdsRef = useRef<string[]>([]);
  const [manualState, setManualState] = useState<{
    running: boolean;
    lastAt: number | null;
    error: string | null;
  }>({ running: false, lastAt: null, error: null });
  const [now, setNow] = useState(() => Date.now());
  const [cached, setCached] = useState<{ savedAt: number; payload: Snapshot } | null>(() => {
    const candidate = readTelemetryCache<Snapshot>();
    if (
      candidate &&
      Array.isArray(candidate.payload?.discovery?.devices) &&
      Array.isArray(candidate.payload?.earnings)
    )
      return candidate;
    return null;
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, []);

  const enabled = ready && hotkeys.length > 0;

  const priceQuery = useQuery({
    queryKey: ["iota", "usd-price"],
    queryFn: async () => {
      try {
        const fromServer = await priceFn({ data: { force: forceRef.current } });
        if (fromServer.usdPerIota) return fromServer;
      } catch {
        /* browser sources below */
      }
      const fromBrowser = await fetchSn9UsdFromMarkets();
      return {
        usdPerIota: fromBrowser.usdPerIota,
        fetchedAt: Date.now(),
        error: null,
        stale: false,
        source: fromBrowser.source,
      };
    },
    enabled: ready,
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const discoveryQuery = useQuery({
    queryKey: ["iota", "discovery", hotkeyKey],
    queryFn: async () => {
      const hintRunIds = hintRunIdsRef.current;
      const results: DiscoveryResult[] = [];
      for (let i = 0; i < hotkeys.length; i += 200)
        results.push(
          await withDeadline(
            discoverFn({
              data: {
                hotkeys: hotkeys.slice(i, i + 200),
                force: forceRef.current && i === 0,
                hintRunIds,
              },
            }),
            DISCOVER_CLIENT_MS,
            "状态刷新超时",
          ),
        );
      const first = results[0]!;
      return {
        ...first,
        devices: results.flatMap((r) => r.devices),
        fullCoverage: results.every((r) => r.fullCoverage),
        errors: [...new Set(results.flatMap((r) => r.errors))],
      };
    },
    enabled,
    staleTime: 25_000,
    refetchInterval: DISCOVERY_POLL_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: 1,
    placeholderData: keepPreviousData,
  });

  const earningsQuery = useQuery({
    queryKey: ["iota", "earnings", hotkeyKey],
    queryFn: async () => {
      const devices: DeviceEarnings[] = [];
      for (let i = 0; i < hotkeys.length; i += 200)
        devices.push(
          ...(
            await withDeadline(
              earningsFn({
                data: { hotkeys: hotkeys.slice(i, i + 200), force: forceRef.current },
              }),
              EARNINGS_CLIENT_MS,
              "收益刷新超时",
            )
          ).devices,
        );
      return { devices };
    },
    enabled,
    staleTime: 60_000,
    refetchInterval: EARNINGS_POLL_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: 1,
    placeholderData: keepPreviousData,
  });

  const occupancyQuery = useQuery({
    queryKey: ["iota", "occupancy"],
    queryFn: () => occupancyFn({ data: {} }),
    enabled: ready,
    refetchInterval: 120_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const runsQuery = useQuery({
    queryKey: ["iota", "runs"],
    queryFn: () => runsFn({ data: {} }),
    enabled: ready,
    staleTime: 120_000,
    refetchInterval: 300_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const farmRunIds = useMemo(() => {
    const ids = [
      ...(occupancyQuery.data?.occupancy?.run_ids ?? []),
      ...(runsQuery.data?.runs ?? []).map((run) => run.run_id),
    ];
    return [...new Set(ids)].sort();
  }, [occupancyQuery.data?.occupancy?.run_ids, runsQuery.data?.runs]);

  const progressQuery = useQuery({
    queryKey: ["iota", "progress", farmRunIds.join(",")],
    queryFn: () => progressFn({ data: { runIds: farmRunIds } }),
    enabled: ready && farmRunIds.length > 0,
    staleTime: 45_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const lastDiscoveryRef = useRef<DiscoveryResult | undefined>(undefined);
  const discovery = useMemo(() => {
    const incoming = discoveryQuery.data ?? (hotkeys.length ? cached?.payload.discovery : undefined);
    if (!incoming) return undefined;
    return mergeDiscovery(incoming, lastDiscoveryRef.current ?? cached?.payload.discovery);
  }, [cached, discoveryQuery.data, hotkeys.length]);
  useEffect(() => {
    if (discovery) lastDiscoveryRef.current = discovery;
  }, [discovery]);
  const earnings =
    earningsQuery.data?.devices ?? (hotkeys.length ? cached?.payload.earnings : undefined);
  const usingCachedOnly = !discoveryQuery.data && Boolean(cached) && hotkeys.length > 0;
  hintRunIdsRef.current = hintRunIdsFromDevices(discovery?.devices);

  useEffect(() => {
    if (discovery && earningsQuery.data) {
      writeTelemetryCache<Snapshot>({
        discovery,
        earnings: earningsQuery.data.devices,
      });
    }
  }, [discovery, earningsQuery.data]);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    const last = manualState.lastAt;
    if (last !== null && Date.now() - last < MANUAL_COOLDOWN_MS) return;
    forceRef.current = true;
    setManualState({ running: true, lastAt: Date.now(), error: null });
    try {
      const [discoveryResult, earningsResult] = await withDeadline(
        Promise.all([discoveryQuery.refetch(), earningsQuery.refetch(), priceQuery.refetch()]),
        REFRESH_CLIENT_MS,
        "刷新超时，已停止等待。请稍后再试。",
      );
      const messages = [
        ...(discoveryResult.error ? [discoveryResult.error.message] : []),
        ...(earningsResult.error ? [earningsResult.error.message] : []),
        ...(discoveryResult.data?.errors ?? []),
        ...(earningsResult.data?.devices ?? [])
          .filter((device) => device.error)
          .map((device) => `收益 ${device.hotkey.slice(0, 8)}…：${device.error}`),
      ];
      setManualState((state) => ({
        ...state,
        running: false,
        error: messages.length ? messages.slice(0, 3).join("；") : null,
      }));
    } catch (error) {
      setManualState((state) => ({
        ...state,
        running: false,
        error: error instanceof Error ? error.message : "刷新失败",
      }));
    } finally {
      forceRef.current = false;
      void occupancyQuery.refetch();
      void runsQuery.refetch();
      void progressQuery.refetch();
    }
  }, [
    enabled,
    manualState.lastAt,
    discoveryQuery,
    earningsQuery,
    occupancyQuery,
    priceQuery,
    runsQuery,
    progressQuery,
  ]);

  const cooldownRemaining = manualState.lastAt
    ? Math.max(0, MANUAL_COOLDOWN_MS - (now - manualState.lastAt))
    : 0;

  const queryUpdatedAt = latestValidClock(
    discoveryQuery.isSuccess ? discoveryQuery.dataUpdatedAt : null,
    earningsQuery.isSuccess ? earningsQuery.dataUpdatedAt : null,
  );
  const querySuccess = discoveryQuery.isSuccess || earningsQuery.isSuccess;
  const fetching = discoveryQuery.isFetching || earningsQuery.isFetching || manualState.running;

  const views: DeviceView[] = useMemo(() => {
    const minerByHotkey = new Map(
      discovery?.devices.map((device) => [device.hotkey, device]) ?? [],
    );
    const earningsByHotkey = new Map(earnings?.map((device) => [device.hotkey, device]) ?? []);

    return entries.map((entry) => {
      const found = minerByHotkey.get(entry.hotkey);
      const reward = earningsByHotkey.get(entry.hotkey) ?? null;
      const status = computeStatus({
        miner: found?.miner ?? null,
        fullCoverage: discovery?.fullCoverage ?? false,
        lastSuccessfulFetchAt: resolveLastSuccessfulFetchAt({
          querySuccess,
          queryUpdatedAt,
          deviceFetchedAt: found?.fetchedAt,
          discoveryFetchedAt: discovery?.fetchedAt,
        }),
        now,
        fetching,
      });
      const earningsUsable =
        reward !== null &&
        reward.error === null &&
        reward.fetchedAt !== null &&
        now - reward.fetchedAt <= EARNINGS_FRESH_MS;
      return {
        entry,
        miner: found?.miner ?? null,
        runIds: found?.runIds ?? [],
        status,
        bucket: statusBucket(status),
        earnings: reward,
        earningsUsable,
      };
    });
  }, [
    entries,
    discovery,
    earnings,
    now,
    querySuccess,
    queryUpdatedAt,
    fetching,
  ]);

  const counts = useMemo(() => {
    const base: Record<StatusBucket, number> = {
      contributing: 0,
      waiting: 0,
      attention: 0,
      pending: 0,
    };
    for (const view of views) base[view.bucket] += 1;
    return base;
  }, [views]);

  const todayTotal: Aggregate = useMemo(
    () =>
      aggregateUnits(views.map((view) => (view.earningsUsable ? view.earnings!.todayUnits : null))),
    [views],
  );
  const lifetimeTotal: Aggregate = useMemo(
    () =>
      aggregateUnits(
        views.map((view) => (view.earningsUsable ? view.earnings!.totalEarnedUnits : null)),
      ),
    [views],
  );

  const occupancy: Occupancy | null = occupancyQuery.data?.occupancy ?? null;
  const mineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const view of views) {
      const runId = view.miner?.run_id;
      if (!runId) continue;
      counts[runId] = (counts[runId] ?? 0) + 1;
    }
    return counts;
  }, [views]);
  const farm = useMemo(
    () =>
      summarizeFarm(
        occupancy,
        runsQuery.data?.runs ?? discovery?.runs ?? null,
        progressQuery.data?.progress,
        mineCounts,
      ),
    [discovery?.runs, mineCounts, occupancy, progressQuery.data?.progress, runsQuery.data?.runs],
  );

  return {
    views,
    counts,
    todayTotal,
    lifetimeTotal,
    discovery,
    farm,
    occupancy,
    occupancyError: occupancyQuery.data?.error ?? occupancyQuery.error?.message ?? null,
    fetchedAt:
      resolveLastSuccessfulFetchAt({
        querySuccess,
        queryUpdatedAt,
        deviceFetchedAt: null,
        discoveryFetchedAt: discovery?.fetchedAt ?? cached?.savedAt,
      }),
    earningsFetchedAt:
      earnings?.reduce<number | null>(
        (min, device) =>
          device.fetchedAt === null
            ? min
            : min === null
              ? device.fetchedAt
              : Math.min(min, device.fetchedAt),
        null,
      ) ?? null,
    coverage: {
      runsFetched: discovery?.runsFetched ?? 0,
      runsTotal: discovery?.runsTotal ?? 0,
      full: discovery?.fullCoverage ?? false,
    },
    errors: [
      ...(discovery?.errors ?? []),
      ...(discoveryQuery.error ? ["状态连接失败：" + discoveryQuery.error.message] : []),
      ...(earningsQuery.error ? ["收益连接失败：" + earningsQuery.error.message] : []),
    ],
    usingCachedOnly,
    cachedSavedAt: cached?.savedAt ?? null,
    loading: (discoveryQuery.isLoading || earningsQuery.isLoading) && enabled,
    manual: { ...manualState, cooldownRemaining },
    refresh,
    now,
    usdPerIota: priceQuery.data?.usdPerIota ?? null,
    usdError: priceQuery.data?.error ?? priceQuery.error?.message ?? null,
  };
}
