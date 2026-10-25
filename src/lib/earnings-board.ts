import { acurastUsd } from "./acurast-rewards";
import { bindingIdentity, type FleetBinding, type FleetProject } from "./fleet";
export type EarningsWindow =
  "today" | "yesterday" | "utcDay" | "rolling24h" | "month" | "unknown" | "cumulative";
export type BoardReading = {
  flyai?: import("@/lib/flyai").FlyaiWalletStats;
  acurastQuote?: import("./acurast-rewards").AcurastQuote;
  acurastBalances?: import("./acurast-rewards").AcurastBalance[];
  acurastRewards?: import("./acurast-rewards").AcurastRewards;
  scope: "device" | "wallet";
  rewardAmount?: number | null;
  earningsWindow?: EarningsWindow;
  unit: string;
  todayUsdValue?: number | null;
  todayUsable?: boolean;
  priceStale?: boolean;
  health?: string;
  accountSummary?: { kind: "month" | "balance"; amount: string; unit: string };
  updated: string;
  source: string;
};
export function earningsBoard(
  entries: { binding: FleetBinding; deviceId: string; data: BoardReading }[],
) {
  const seen = new Set<string>();
  const bestAcu = new Map<string, BoardReading>();
  for (const { binding, data } of entries) {
    if (binding.project !== "acurast" || !data.acurastRewards) continue;
    for (const manager of data.acurastRewards.managers) {
      const previous = bestAcu.get(manager.id);
      const rank = (d: BoardReading) =>
        (d.health === "fresh" ? 1e15 : 0) + (d.acurastRewards?.observedAt ?? 0);
      if (!previous || rank(data) > rank(previous)) bestAcu.set(manager.id, data);
    }
  }
  const projects = new Map<
    FleetProject,
    {
      project: FleetProject;
      devices: Set<string>;
      metrics: Map<
        string,
        {
          window: EarningsWindow;
          unit: string;
          amount: number;
          usd: number | null;
          count: number;
          stale: boolean;
        }
      >;
      accounts: Map<
        string,
        {
          kind: "month" | "balance";
          amount: string;
          unit: string;
          identifier: string;
          flyai?: import("./flyai").FlyaiWalletStats;
          usd?: number | null;
          stale: boolean;
        }
      >;
      sources: Set<string>;
      known: number;
      total: number;
    }
  >();
  const totals = { today: { usd: 0, count: 0 }, yesterday: { usd: 0, count: 0 } };
  const olderPrices = { today: false, yesterday: false };
  for (const { binding: b, deviceId, data: d } of entries) {
    let row = projects.get(b.project);
    if (!row) {
      row = {
        project: b.project,
        devices: new Set(),
        metrics: new Map(),
        accounts: new Map(),
        sources: new Set(),
        known: 0,
        total: 0,
      };
      projects.set(b.project, row);
    }
    row.devices.add(deviceId);
    if (b.project === "acurast")
      for (const balance of d.acurastBalances ?? []) {
        const key = `acurast:wallet:${balance.address}`;
        if (!row.accounts.has(key) || d.health === "fresh")
          row.accounts.set(key, {
            kind: "balance",
            amount: balance.total,
            usd: d.health === "fresh" ? acurastUsd(balance.total, d.acurastQuote) : null,
            unit: "ACU",
            identifier: balance.address,
            stale: d.health !== "fresh",
          });
      }
    if (b.project === "acurast" && d.acurastRewards) {
      const currentDay = Math.floor((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
      for (const manager of d.acurastRewards.managers) {
        const managerKey = `acurast:manager:${manager.id}`;
        if (bestAcu.get(manager.id) !== d || seen.has(managerKey)) continue;
        seen.add(managerKey);
        row.total++;
        row.sources.add(d.source);
        for (const period of ["today", "yesterday", "cumulative"] as const) {
          if (period !== "cumulative" && currentDay !== d.acurastRewards.dayStart) continue;
          const raw = manager[period];
          if (raw === null || !/^\d+(?:\.\d{1,12})?$/.test(raw)) continue;
          const value = Number(raw);
          if (!Number.isFinite(value) || value < 0) continue;
          const key = `${period}:ACU`;
          const metric = row.metrics.get(key) ?? {
            window: period,
            unit: "ACU",
            amount: 0,
            usd: null,
            count: 0,
            stale: false,
          };
          const usd = d.health === "fresh" ? acurastUsd(value, d.acurastQuote) : null;
          metric.usd = metric.count === 0 ? usd : metric.usd !== null && usd !== null ? metric.usd + usd : null;
          if (usd !== null && period !== "cumulative") { totals[period].usd += usd; totals[period].count++; }
          metric.amount += value;
          metric.count++;
          metric.stale ||= d.health !== "fresh";
          row.metrics.set(key, metric);
        }
        row.known++;
      }
      continue;
    }
    const key =
      d.scope === "wallet" ? `${b.project}:${b.pool ?? ""}:${b.identifier}` : bindingIdentity(b);
    if (seen.has(key)) continue;
    seen.add(key);
    row.total++;
    row.sources.add(d.source);
    if (d.accountSummary)
      row.accounts.set(key, {
        ...d.accountSummary,
        ...(d.flyai ? {flyai: d.flyai} : {}),
        identifier: b.identifier,
        stale: d.health === "stale" || d.health === "unavailable",
      });
    if (d.rewardAmount == null || !Number.isFinite(d.rewardAmount) || d.rewardAmount < 0 || !d.unit)
      continue;
    const window = d.earningsWindow ?? "unknown";
    const fresh = d.health === "fresh" || (d.health === undefined && d.todayUsable !== false);
    const usd =
      fresh &&
      typeof d.todayUsdValue === "number" &&
      Number.isFinite(d.todayUsdValue) &&
      d.todayUsdValue >= 0
        ? d.todayUsdValue
        : null;
    const metricKey = `${window}:${d.unit}`;
    const metric = row.metrics.get(metricKey) ?? {
      window,
      unit: d.unit,
      amount: 0,
      usd: null,
      count: 0,
      stale: false,
    };
    metric.amount += d.rewardAmount;
    metric.count++;
    metric.stale ||= !fresh;
    // Partial conversion must not look like the complete project total.
    metric.usd =
      metric.count === 1 ? usd : metric.usd !== null && usd !== null ? metric.usd + usd : null;
    row.metrics.set(metricKey, metric);
    row.known++;
    if (usd !== null && (window === "today" || window === "yesterday")) {
      totals[window].usd += usd;
      totals[window].count++;
      olderPrices[window] ||= !!d.priceStale;
    }
  }
  return { totals, olderPrices, projects: [...projects.values()] };
}

/** Preserve gaps and observed zeroes; never interpolate earnings on missing dates. */
export function boardSeries(
  rows: { day: string; value: number | null; partial: boolean }[],
  days: number,
  now = Date.now(),
) {
  const end = Date.parse(new Date(now + 28800000).toISOString().slice(0, 10) + "T00:00:00Z");
  const byDay = new Map(rows.map((r) => [r.day, r]));
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(end - (days - i) * 86400000).toISOString().slice(0, 10);
    const row = byDay.get(day);
    return {
      day,
      value: row?.value != null && Number.isFinite(row.value) && row.value >= 0 ? row.value : null,
      partial: row?.partial ?? true,
    };
  });
}
