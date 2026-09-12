import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { aggregateUnits, type Aggregate } from "@/lib/earnings";
import {
  computeStatus,
  statusBucket,
  type DeviceStatus,
  type StatusBucket,
} from "@/lib/device-status";
import { discoverDevices, getEarnings, getOccupancy } from "@/lib/iota.functions";
import type { DeviceEarnings, DiscoveryResult, MinerRecord, Occupancy } from "@/lib/iota-types";
import { readTelemetryCache, writeTelemetryCache, type WatchEntry } from "@/lib/watchlist";

export const POLL_MS = 5_000;
export const MANUAL_COOLDOWN_MS = 15_000;
export const EARNINGS_FRESH_MS = 15 * 60 * 1000;

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

  const forceRef = useRef(false);
  const [manualState, setManualState] = useState<{
    running: boolean;
    lastAt: number | null;
    error: string | null;
  }>({ running: false, lastAt: null, error: null });
  const [now, setNow] = useState(() => Date.now());
  const [cached, setCached] = useState<{ savedAt: number; payload: Snapshot } | null>(null);

  useEffect(() => {
    const candidate = readTelemetryCache<Snapshot>();
    if (
      candidate &&
      Array.isArray(candidate.payload?.discovery?.devices) &&
      Array.isArray(candidate.payload?.earnings)
    )
      setCached(candidate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, []);

  const enabled = ready && hotkeys.length > 0;

  const discoveryQuery = useQuery({
    queryKey: ["iota", "discovery", hotkeyKey],
    queryFn: async () => {
      const results: DiscoveryResult[] = [];
      for (let i = 0; i < hotkeys.length; i += 200)
        results.push(
          await discoverFn({
            data: { hotkeys: hotkeys.slice(i, i + 200), force: forceRef.current && i === 0 },
          }),
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
    refetchInterval: POLL_MS,
    placeholderData: keepPreviousData,
  });

  const earningsQuery = useQuery({
    queryKey: ["iota", "earnings", hotkeyKey],
    queryFn: async () => {
      const devices: DeviceEarnings[] = [];
      for (let i = 0; i < hotkeys.length; i += 200)
        devices.push(
          ...(
            await earningsFn({
              data: { hotkeys: hotkeys.slice(i, i + 200), force: forceRef.current },
            })
          ).devices,
        );
      return { devices };
    },
    enabled,
    refetchInterval: POLL_MS,
    placeholderData: keepPreviousData,
  });

  const occupancyQuery = useQuery({
    queryKey: ["iota", "occupancy"],
    queryFn: () => occupancyFn({ data: {} }),
    enabled: ready,
    refetchInterval: 120_000,
    placeholderData: keepPreviousData,
  });

  const discovery = discoveryQuery.data ?? (hotkeys.length ? cached?.payload.discovery : undefined);
  const earnings =
    earningsQuery.data?.devices ?? (hotkeys.length ? cached?.payload.earnings : undefined);
  const usingCachedOnly = !discoveryQuery.data && Boolean(cached) && hotkeys.length > 0;

  useEffect(() => {
    if (discoveryQuery.data && earningsQuery.data) {
      writeTelemetryCache<Snapshot>({
        discovery: discoveryQuery.data,
        earnings: earningsQuery.data.devices,
      });
    }
  }, [discoveryQuery.data, earningsQuery.data]);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    const last = manualState.lastAt;
    if (last !== null && Date.now() - last < MANUAL_COOLDOWN_MS) return;
    forceRef.current = true;
    setManualState({ running: true, lastAt: Date.now(), error: null });
    try {
      const [discoveryResult, earningsResult] = await Promise.all([
        discoveryQuery.refetch(),
        earningsQuery.refetch(),
      ]);
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
    }
  }, [enabled, manualState.lastAt, discoveryQuery, earningsQuery, occupancyQuery]);

  const cooldownRemaining = manualState.lastAt
    ? Math.max(0, MANUAL_COOLDOWN_MS - (now - manualState.lastAt))
    : 0;

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
        lastSuccessfulFetchAt: found?.miner
          ? (found.fetchedAt ?? null)
          : (discovery?.fetchedAt ?? null),
        now,
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
  }, [entries, discovery, earnings, now]);

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

  return {
    views,
    counts,
    todayTotal,
    lifetimeTotal,
    discovery,
    occupancy,
    occupancyError: occupancyQuery.data?.error ?? null,
    fetchedAt: discovery?.fetchedAt ?? null,
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
  };
}
