import { fleetIotaStatus } from "@/lib/fleet-iota-status";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "./use-auth";
import { getPublicPlatform, getPrivatePlatform } from "@/lib/platforms.functions";
import { isPlatform, isPrivatePlatform } from "@/lib/platforms";
import { platformCopy } from "@/components/platform-copy";
import { getComputeNetwork, getNosanaNode } from "@/lib/compute.functions";
import { editorialCopy } from "@/components/project-editorial";
import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useIotaDashboard } from "./use-iota-dashboard";
import { getProjectNetwork, getQuantusAccount } from "@/lib/projects.functions";
import { getFlyaiMonth } from "@/lib/flyai.functions";
import { formatIota, formatUsd, iotaUnitsToUsd, hongKongDayStartSeconds } from "@/lib/earnings";
import { LANGUAGE_TAG } from "@/lib/site";
import type { FleetBinding, FleetDevice } from "@/lib/fleet";
import { fleetCopy } from "@/components/fleet-copy";
import { useLocale } from "@/components/site/locale";
import type { ProjectReading } from "@/components/fleet-review-data";

export function useFleetReadings(devices: FleetDevice[], ready: boolean) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  const auth = useAuth(),
    privateRead = useServerFn(getPrivatePlatform),
    pc = platformCopy(locale);
  const platformBindings = [
    ...new Map(
      devices
        .flatMap((d) => d.bindings)
        .filter((b) => isPlatform(b.project))
        .map((b) => [`${b.project}:${b.identifier}`, b]),
    ).values(),
  ];
  const platformQueries = useQueries({
    queries: platformBindings.map((b) => ({
      queryKey: ["platform-node", auth.userId, b.project, b.identifier],
      enabled: ready && isPlatform(b.project) && (!isPrivatePlatform(b.project) || !!auth.userId),
      queryFn: () => {
        const project = b.project;
        if (!isPlatform(project)) throw new Error("invalid");
        return isPrivatePlatform(project)
          ? privateRead({ data: { project, id: b.identifier } })
          : getPublicPlatform({ data: { project, id: b.identifier } });
      },
      staleTime: 300000,
      refetchInterval: 300000,
      retry: false,
    })),
  });
  const entries = useMemo(
    () =>
      devices.flatMap((d) =>
        d.bindings
          .filter((b) => b.project === "iota")
          .map((b) => ({ hotkey: b.identifier, label: d.name, addedAt: d.createdAt })),
      ),
    [devices],
  );
  const iota = useIotaDashboard(entries, ready);
  const bindings = devices.flatMap((d) => d.bindings);
  const xid = useQuery({
    queryKey: ["projects", "xid", "network"],
    queryFn: () => getProjectNetwork({ data: { project: "xid" } }),
    enabled: ready && bindings.some((b) => b.project === "xid"),
    staleTime: 45000,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
  const flyai = useQuery({
    queryKey: ["flyai", "month"],
    queryFn: () => getFlyaiMonth(),
    enabled: ready && bindings.some((b) => b.project === "flyai"),
    staleTime: 45000,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
  const qtcAddresses = [
    ...new Set(bindings.filter((b) => b.project === "quantus").map((b) => b.identifier)),
  ];
  const quantus = useQueries({
    queries: qtcAddresses.map((address) => ({
      queryKey: ["projects", "quantus", "account", address],
      queryFn: () => getQuantusAccount({ data: { address } }),
      enabled: ready,
      staleTime: 45000,
      refetchInterval: 60000,
      refetchIntervalInBackground: false,
      retry: 1,
    })),
  });
  const nosanaIds = [
    ...new Set(bindings.filter((b) => b.project === "nosana").map((b) => b.identifier)),
  ];
  const nosana = useQueries({
    queries: nosanaIds.map((address) => ({
      queryKey: ["nosana", address],
      queryFn: () => getNosanaNode({ data: { address } }),
      enabled: ready,
      staleTime: 45000,
      refetchInterval: 60000,
      retry: 1,
    })),
  });
  const gonka = useQuery({
    queryKey: ["compute", "gonka"],
    queryFn: () => getComputeNetwork({ data: { project: "gonka" } }),
    enabled: ready && bindings.some((b) => b.project === "gonka"),
    staleTime: 45000,
    refetchInterval: 60000,
    retry: 1,
  });
  const ec = editorialCopy(locale);
  const clock = (value: number | null | undefined) =>
    value
      ? new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
          timeZone: "Asia/Hong_Kong",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(value) + " UTC+8"
      : "—";
  const fresh = (fetched: number | null | undefined, stale: boolean | undefined) =>
    !!fetched && !stale && iota.now - fetched < 180000;
  return (binding: FleetBinding): ProjectReading => {
    const base: ProjectReading = {
      status: "unavailable",
      activity: "—",
      today: null,
      lifetime: null,
      unit: "",
      scope: binding.project === "iota" ? "device" : "wallet",
      source:
        binding.project === "iota"
          ? "Macrocosmos · IOTA"
          : binding.project === "xid"
            ? "Superknet · xCoin"
            : binding.project === "quantus"
              ? "Quantus Explorer"
              : "fly.ai",
      updated: "—",
    };
    if (isPlatform(binding.project)) {
      const q =
          platformQueries[
            platformBindings.findIndex(
              (b) => b.project === binding.project && b.identifier === binding.identifier,
            )
          ],
        r = q?.data,
        d = r?.data;
      const current = !!r?.fetchedAt && iota.now - r.fetchedAt < 600000 && !r.error && !q?.isError;
      const sourceFresh = !!d?.sourceUpdatedAt && iota.now - d.sourceUpdatedAt < 900000;
      const daily =
        current &&
        d?.period === "hkDay" &&
        d?.periodStart === hongKongDayStartSeconds(iota.now) * 1000 &&
        d?.reward !== null;
      return {
        ...base,
        source:
          binding.project === "ionet"
            ? "io.net"
            : binding.project === "vast"
              ? "Vast.ai"
              : binding.project === "akash"
                ? "Akash"
                : "Golem Stats",
        scope: d?.scope === "provider" ? "wallet" : "device",
        status:
          current && sourceFresh && d?.online === true
            ? "online"
            : current && sourceFresh && d?.online === false
              ? "offline"
              : "unavailable",
        activity: d?.hardware ?? "—",
        today: d?.reward === null || d?.reward === undefined ? null : String(d.reward),
        ...(d?.period ? { todayLabel: pc[d.period] } : {}),
        unit: d?.rewardUnit ?? "",
        lifetime: d?.lifetime === null || d?.lifetime === undefined ? null : String(d.lifetime),
        todayUsable: !!daily,
        todayUsdValue: daily && d?.rewardUnit === "USD" ? d.reward : null,
        updated: clock(r?.fetchedAt),
        note:
          (isPrivatePlatform(binding.project) && !auth.userId) || r?.error === "connect-required"
            ? pc.needConnection
            : r?.error === "expired"
              ? pc.expired
              : r?.error === "not-configured"
                ? pc.notConfigured
                : r?.error || q?.isError
                  ? c.unavailable
                  : d?.partial
                    ? pc.partial
                    : d &&
                        (!current ||
                          (d.sourceUpdatedAt !== null && !sourceFresh) ||
                          (d.period === "hkDay" && !daily))
                      ? c.stale
                      : undefined,
      };
    }
    if (binding.project === "iota") {
      const view = iota.views.find((v) => v.entry.hotkey === binding.identifier);
      if (!view) return base;
      const today = view.earnings?.todayUnits ?? null,
        total = view.earnings?.totalEarnedUnits ?? null;
      return {
        ...base,
        status: fleetIotaStatus(view.status, view.statusStale),
        activity: view.miner ? String(view.miner.throughput) + " tokens/s" : "—",
        today: today === null ? null : formatIota(today, 8, locale),
        lifetime: total === null ? null : formatIota(total, 8, locale),
        unit: "IOTA",
        todayUsable: view.todayUsable,
        todayUsdValue:
          view.todayUsable && !iota.priceRefreshFailed
            ? iotaUnitsToUsd(today, iota.usdPerIota)
            : null,
        priceStale: iota.priceStale,
        ...(today !== null && !iota.priceRefreshFailed && iota.usdPerIota
          ? { todayUsd: formatUsd(iotaUnitsToUsd(today, iota.usdPerIota)).replace("$", "") }
          : {}),
        updated: clock(view.earnings?.fetchedAt),
        note: !view.todayUsable || !view.lifetimeUsable || view.statusStale ? c.stale : undefined,
      };
    }
    if (binding.project === "xid") {
      const result = xid.data,
        n = result?.data,
        workers =
          n?.workers.filter(
            (w) =>
              w.address === binding.identifier && (!binding.worker || w.name === binding.worker),
          ) ?? [];
      // Wallet hashrate is not evidence that this particular machine is mining.
      const worker = binding.worker && workers.length === 1 ? workers[0] : undefined;
      const speed = worker?.reportedHashrate ?? worker?.hashrate;
      const mining =
        worker &&
        speed != null &&
        speed > 0 &&
        worker.lastSeen &&
        iota.now - worker.lastSeen < 600000 &&
        fresh(result?.fetchedAt, result?.stale) &&
        !n?.poolStale &&
        !xid.isError;
      return {
        ...base,
        status: mining
          ? "mining"
          : !binding.worker &&
              fresh(result?.fetchedAt, result?.stale) &&
              !xid.isError &&
              n?.balances[binding.identifier] != null
            ? "wallet"
            : "unavailable",
        ...(!binding.worker &&
        fresh(result?.fetchedAt, result?.stale) &&
        !xid.isError &&
        n?.balances[binding.identifier] != null
          ? {
              accountSummary: {
                kind: "balance" as const,
                amount: String(n.balances[binding.identifier]),
                unit: "XID",
              },
            }
          : {}),
        activity:
          worker && speed != null
            ? String(speed) + " MH/s"
            : !binding.worker && n
              ? `${workers.length} Worker`
              : "—",
        unit: "XID",
        lifetime:
          n?.balances[binding.identifier] != null ? String(n.balances[binding.identifier]) : null,
        totalLabel: c.balance,
        updated: clock(result?.fetchedAt),
        note:
          !fresh(result?.fetchedAt, result?.stale) || xid.isError
            ? c.stale
            : binding.worker
              ? undefined
              : c.apiLimited,
      };
    }
    if (binding.project === "quantus") {
      const query = quantus[qtcAddresses.indexOf(binding.identifier)],
        result = query?.data;
      return {
        ...base,
        today: result?.data?.today ?? null,
        lifetime: result?.data?.lifetime ?? null,
        unit: "QTC",
        updated: clock(result?.fetchedAt),
        note:
          result?.data && (!fresh(result.fetchedAt, result.stale) || query?.isError)
            ? c.stale
            : c.apiLimited,
      };
    }
    if (binding.project === "nosana") {
      const query = nosana[nosanaIds.indexOf(binding.identifier)],
        r = query?.data,
        d = r?.data;
      const current = fresh(r?.fetchedAt, r?.stale) && !query?.isError;
      return {
        ...base,
        source: "Nosana",
        scope: "device",
        status: current && d && d.running > 0 ? "computing" : "unavailable",
        activity: d ? `${d.running} · ${ec.running}` : "—",
        lifetime: d ? String(d.completed) : null,
        totalLabel: ec.completed,
        updated: clock(r?.fetchedAt),
        note: !current ? c.stale : ec.noDaily,
      };
    }
    if (binding.project === "gonka") {
      const r = gonka.data,
        h = r?.data?.participants.find((p) => p.address === binding.identifier),
        current = fresh(r?.fetchedAt, r?.stale) && !gonka.isError;
      return {
        ...base,
        source: "Gonka",
        status: current && h ? "participating" : "unavailable",
        activity: r?.data ? `${ec.epoch} ${r.data.epoch}` : "—",
        lifetime: h?.weight ?? null,
        totalLabel: ec.weight,
        updated: clock(r?.fetchedAt),
        note: !current ? c.stale : ec.noDaily,
      };
    }
    const result = flyai.data,
      month = result?.data,
      wallet = month?.wallets.find((w) => w.wallet === binding.identifier.toLowerCase());
    const sameMonth = month?.month === new Date(iota.now).toISOString().slice(0, 7);
    return {
      ...base,
      status:
        sameMonth && wallet && fresh(result?.fetchedAt, result?.stale) && !flyai.isError
          ? "wallet"
          : "unavailable",
      activity:
        sameMonth && wallet
          ? `${new Intl.NumberFormat(LANGUAGE_TAG[locale]).format(wallet.points)} · ${c.monthPoints}`
          : "—",
      ...(sameMonth && wallet && fresh(result?.fetchedAt, result?.stale) && !flyai.isError
        ? {
            accountSummary: {
              kind: "month" as const,
              amount: new Intl.NumberFormat(LANGUAGE_TAG[locale]).format(wallet.points),
              unit: "",
            },
          }
        : {}),
      today: sameMonth && wallet ? String(wallet.points) : null,
      lifetime: sameMonth && wallet ? String((wallet.share * 100).toFixed(2)) + "%" : null,
      todayLabel: c.monthPoints,
      earningsPeriod: "month",
      totalLabel: c.monthShare,
      updated: clock(result?.fetchedAt),
      note:
        month && (!sameMonth || !fresh(result?.fetchedAt, result?.stale) || flyai.isError)
          ? c.stale
          : c.apiLimited,
    };
  };
}
