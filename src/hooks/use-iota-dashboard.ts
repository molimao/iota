import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { aggregateUnits, hongKongDayStartSeconds, type Aggregate } from "@/lib/earnings";
import { earningsFreshness, mergeEarnings } from "@/lib/earnings-data";
import { withDeadline } from "@/lib/deadline";
import {
  computeStatus,
  statusBucket,
  type DeviceStatus,
  type StatusBucket,
} from "@/lib/device-status";
import { hintRunIdsFromDevices, mergeDiscovery } from "@/lib/iota-discover";
import { fetchSn9UsdFromMarkets } from "@/lib/iota-price-sources";
import { diagnoseDevice, type Diagnosis } from "@/lib/diagnose";
import { useFarm } from "@/hooks/use-farm";
import { discoverDevices, getEarnings, getIotaUsdPrice } from "@/lib/iota.functions";
import type { DeviceEarnings, DiscoveryResult, MinerRecord } from "@/lib/iota-types";
import { readTelemetryCache, writeTelemetryCache, type WatchEntry } from "@/lib/watchlist";

export const DISCOVERY_POLL_MS = 30_000;
export const EARNINGS_POLL_MS = 120_000;
export const MANUAL_COOLDOWN_MS = 15_000;
export const EARNINGS_FRESH_MS = 15 * 60 * 1000;
const DISCOVER_CLIENT_MS = 45_000;
const EARNINGS_CLIENT_MS = 65_000;
const REFRESH_CLIENT_MS = 70_000;

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
  todayUsable: boolean;
  lifetimeUsable: boolean;
  statusFetchedAt: number | null;
  statusStale: boolean;
  diagnosis: Diagnosis;
};

export function useIotaDashboard(entries: WatchEntry[], ready: boolean) {
  const hotkeys = useMemo(() => entries.map((entry) => entry.hotkey), [entries]);
  const hotkeyKey = useMemo(() => [...hotkeys].sort().join(","), [hotkeys]);

  const discoverFn = useServerFn(discoverDevices);
  const earningsFn = useServerFn(getEarnings);
  const priceFn = useServerFn(getIotaUsdPrice);

  const forceRef = useRef(false);
  const manualBusy = useRef(false);
  const [online, setOnline] = useState(true);
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

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  const accountingDay = hongKongDayStartSeconds(now);
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
    refetchIntervalInBackground: false,
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
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const earningsQuery = useQuery({
    queryKey: ["iota", "earnings", hotkeyKey, accountingDay],
    queryFn: async () => {
      const devices: DeviceEarnings[] = [];
      for (let i = 0; i < hotkeys.length; i += 5)
        devices.push(
          ...(
            await withDeadline(
              earningsFn({
                data: { hotkeys: hotkeys.slice(i, i + 5), force: forceRef.current },
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
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const lastDiscoveryRef = useRef<DiscoveryResult | undefined>(undefined);
  const discovery = useMemo(() => {
    const incoming =
      discoveryQuery.data ?? (hotkeys.length ? cached?.payload.discovery : undefined);
    if (!incoming) return undefined;
    return mergeDiscovery(incoming, lastDiscoveryRef.current ?? cached?.payload.discovery);
  }, [cached, discoveryQuery.data, hotkeys.length]);
  useEffect(() => {
    if (discovery) lastDiscoveryRef.current = discovery;
  }, [discovery]);
  const previousEarnings = useRef<DeviceEarnings[]>(cached?.payload.earnings ?? []);
  const earnings = useMemo(() => {
    const incoming =
      earningsQuery.data?.devices ?? (hotkeys.length ? cached?.payload.earnings : undefined);
    return incoming ? mergeEarnings(incoming, previousEarnings.current) : undefined;
  }, [cached, earningsQuery.data, hotkeys.length]);
  useEffect(() => {
    if (earnings) previousEarnings.current = earnings;
  }, [earnings]);
  const usingCachedOnly = !discoveryQuery.data && Boolean(cached) && hotkeys.length > 0;
  hintRunIdsRef.current = hintRunIdsFromDevices(discovery?.devices);

  const watched = useMemo(() => new Set(hotkeys), [hotkeys]);
  const mineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const device of discovery?.devices ?? []) {
      const runId = device.miner?.run_id;
      if (!runId || !watched.has(device.hotkey)) continue;
      counts[runId] = (counts[runId] ?? 0) + 1;
    }
    return counts;
  }, [discovery?.devices, watched]);

  const farmState = useFarm({
    enabled: ready,
    mineCounts,
    fallbackRuns: discovery?.runs ?? null,
  });

  useEffect(() => {
    if (discovery && earningsQuery.data) {
      writeTelemetryCache<Snapshot>({
        discovery,
        earnings: earnings ?? [],
      });
    }
  }, [discovery, earnings, earningsQuery.data]);

  const refresh = useCallback(async () => {
    if (!enabled || manualBusy.current) return;
    const last = manualState.lastAt;
    if (last !== null && Date.now() - last < MANUAL_COOLDOWN_MS) return;
    manualBusy.current = true;
    forceRef.current = true;
    setManualState({ running: true, lastAt: Date.now(), error: null });
    try {
      const [discoveryResult, earningsResult] = await withDeadline(
        Promise.all([
          discoveryQuery.refetch({ cancelRefetch: false }),
          earningsQuery.refetch({ cancelRefetch: false }),
          priceQuery.refetch({ cancelRefetch: false }),
          farmState.refresh(),
        ]),
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
      manualBusy.current = false;
    }
  }, [enabled, manualState.lastAt, discoveryQuery, earningsQuery, priceQuery, farmState]);

  const cooldownRemaining = manualState.lastAt
    ? Math.max(0, MANUAL_COOLDOWN_MS - (now - manualState.lastAt))
    : 0;

  const fetching = discoveryQuery.isFetching;

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
        lastSuccessfulFetchAt: found?.miner ? found.fetchedAt : (discovery?.fetchedAt ?? null),
        now,
        fetching,
      });
      const fresh = earningsFreshness(reward, now);
      const todayUsable = fresh.today && !earningsQuery.error;
      const lifetimeUsable = fresh.lifetime && !earningsQuery.error;
      const earningsUsable = todayUsable && lifetimeUsable;
      const miner = found?.miner ?? null;
      return {
        entry,
        miner,
        runIds: found?.runIds ?? [],
        status,
        bucket: statusBucket(status),
        earnings: reward
          ? {
              ...reward,
              todayUnits: reward.accountingDay === accountingDay ? reward.todayUnits : null,
            }
          : null,
        earningsUsable,
        todayUsable,
        lifetimeUsable,
        statusFetchedAt: found?.miner ? found.fetchedAt : (discovery?.fetchedAt ?? null),
        statusStale:
          !!(found?.miner || discovery?.fetchedAt) &&
          (!!found?.stale || !!discoveryQuery.error || !online || status === "refresh_interrupted"),
        diagnosis: diagnoseDevice({ status, miner, earnings: reward, earningsUsable }),
      };
    });
  }, [
    entries,
    discovery,
    earnings,
    now,
    fetching,
    earningsQuery.error,
    discoveryQuery.error,
    online,
    accountingDay,
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
      aggregateUnits(views.map((view) => (view.todayUsable ? view.earnings!.todayUnits : null))),
    [views],
  );
  const lifetimeTotal: Aggregate = useMemo(
    () =>
      aggregateUnits(
        views.map((view) => (view.lifetimeUsable ? view.earnings!.totalEarnedUnits : null)),
      ),
    [views],
  );

  /** devices whose diagnosis is worth acting on, worst first */
  const needsAttention = useMemo(
    () => views.filter((view) => view.diagnosis.tone === "warn"),
    [views],
  );

  return {
    views,
    counts,
    needsAttention,
    todayTotal,
    lifetimeTotal,
    discovery,
    farm: farmState.farm,
    farmStale: !!farmState.error,
    occupancy: farmState.occupancy,
    occupancyError: farmState.error,
    fetchedAt: discovery?.fetchedAt ?? null,
    fetching,
    online,
    statusError: discoveryQuery.error?.message ?? discovery?.errors.join("；") ?? null,
    earningsFetching: earningsQuery.isFetching,
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
      ...(earnings ?? [])
        .filter((reward) => reward.error)
        .map((reward) => `收益 ${reward.hotkey.slice(0, 8)}…：${reward.error}`),
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
    priceFetchedAt: priceQuery.data?.fetchedAt ?? null,
    priceQuotedAt: priceQuery.data?.quotedAt ?? null,
    priceLoading: priceQuery.isLoading,
    priceSource: priceQuery.data?.source ?? null,
    priceStale:
      !!priceQuery.data?.stale ||
      !!priceQuery.error ||
      (priceQuery.data?.fetchedAt !== null &&
        priceQuery.data?.fetchedAt !== undefined &&
        now - (priceQuery.data.quotedAt ?? priceQuery.data.fetchedAt) > 5 * 60_000),
  };
}
