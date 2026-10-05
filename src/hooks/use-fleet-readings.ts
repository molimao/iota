import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useIotaDashboard } from "./use-iota-dashboard";
import { getProjectNetwork, getQuantusAccount } from "@/lib/projects.functions";
import { getFlyaiMonth } from "@/lib/flyai.functions";
import { formatIota, formatUsd, iotaUnitsToUsd } from "@/lib/earnings";
import { LANGUAGE_TAG } from "@/lib/site";
import type { FleetBinding, FleetDevice } from "@/lib/fleet";
import { fleetCopy } from "@/components/fleet-copy";
import { useLocale } from "@/components/site/locale";
import type { ProjectReading } from "@/components/fleet-review-data";

export function useFleetReadings(devices: FleetDevice[], ready: boolean) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
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
    if (binding.project === "iota") {
      const view = iota.views.find((v) => v.entry.hotkey === binding.identifier);
      if (!view) return base;
      const today = view.earnings?.todayUnits ?? null,
        total = view.earnings?.totalEarnedUnits ?? null;
      return {
        ...base,
        status:
          !view.statusStale && view.status === "contributing"
            ? "training"
            : !view.statusStale && view.status === "waiting"
              ? "waiting"
              : "unavailable",
        activity: view.miner ? String(view.miner.throughput) + " tokens/s" : "—",
        today: today === null ? null : formatIota(today, 8, locale),
        lifetime: total === null ? null : formatIota(total, 8, locale),
        unit: "IOTA",
        ...(today !== null && !iota.priceStale && iota.usdPerIota
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
        status: mining ? "mining" : "unavailable",
        activity: worker && speed != null ? String(speed) + " MH/s" : "—",
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
    const result = flyai.data,
      month = result?.data,
      wallet = month?.wallets.find((w) => w.wallet === binding.identifier.toLowerCase());
    const sameMonth = month?.month === new Date(iota.now).toISOString().slice(0, 7);
    return {
      ...base,
      today: sameMonth && wallet ? String(wallet.points) : null,
      lifetime: sameMonth && wallet ? String((wallet.share * 100).toFixed(2)) + "%" : null,
      todayLabel: c.monthPoints,
      totalLabel: c.monthShare,
      updated: clock(result?.fetchedAt),
      note:
        month && (!sameMonth || !fresh(result?.fetchedAt, result?.stale) || flyai.isError)
          ? c.stale
          : c.apiLimited,
    };
  };
}
