import type { FleetBinding, FleetProject } from "./fleet";
export type ComputeReading = {
  value: number | null;
  unit: "tokens/s" | "H/s" | "S/s" | "nonces/s" | "PoI/s" | "N/s";
  scope: "device" | "worker" | "account";
  fresh: boolean;
  fetchedAt: number | null;
};
export type ComputeEntry = {
  binding: FleetBinding;
  name: string;
  compute?: ComputeReading | undefined;
};
/** Sum compatible source readings only. Wallet totals cover their workers, never add both. */
export function computeSummary(entries: ComputeEntry[], now = Date.now()) {
  const buckets = new Map<string, ComputeEntry[]>();
  for (const e of entries) {
    if (!e.compute) continue;
    const key = JSON.stringify([
      e.binding.project,
      e.binding.pool ?? "",
      e.binding.identifier,
      e.compute.unit,
    ]);
    buckets.set(key, [...(buckets.get(key) ?? []), e]);
  }
  const valid = (e: ComputeEntry) =>
    e.compute!.fresh &&
    e.compute!.value !== null &&
    Number.isFinite(e.compute!.value) &&
    e.compute!.value >= 0 &&
    e.compute!.fetchedAt !== null &&
    e.compute!.fetchedAt <= now + 30000 &&
    now - e.compute!.fetchedAt <= 300000;
  const groups = new Map<
    string,
    {
      project: FleetProject;
      unit: ComputeReading["unit"];
      total: number;
      known: number;
      count: number;
      active: number;
      fetchedAt: number | null;
      sources: {
        key: string;
        name: string;
        scope: ComputeReading["scope"];
        value: number | null;
      }[];
    }
  >();
  for (const [bucket, all] of buckets) {
    const accounts = all
      .filter((e) => e.compute!.scope === "account")
      .sort((a, b) => (b.compute!.fetchedAt ?? 0) - (a.compute!.fetchedAt ?? 0));
    const usableAccount = accounts.find(valid);
    const candidates = usableAccount
      ? [usableAccount]
      : all.some((e) => e.compute!.scope !== "account")
        ? all.filter((e) => e.compute!.scope !== "account")
        : accounts.slice(0, 1);
    const resources = new Map<string, ComputeEntry>();
    for (const e of candidates) {
      const key = e.compute!.scope === "worker" ? e.binding.worker : e.compute!.scope;
      const old = resources.get(key);
      if (
        !old ||
        (valid(e) && !valid(old)) ||
        (valid(e) === valid(old) && (e.compute!.fetchedAt ?? 0) > (old.compute!.fetchedAt ?? 0))
      )
        resources.set(key, e);
    }
    for (const [resource, e] of resources) {
      const m = e.compute!,
        key = `${e.binding.project}:${m.unit}`;
      const g = groups.get(key) ?? {
        project: e.binding.project,
        unit: m.unit,
        total: 0,
        known: 0,
        count: 0,
        active: 0,
        fetchedAt: null,
        sources: [],
      };
      const usable = valid(e);
      g.count++;
      if (usable) {
        g.known++;
        g.total += m.value!;
        if (m.value! > 0) g.active++;
        g.fetchedAt = g.fetchedAt === null ? m.fetchedAt : Math.min(g.fetchedAt, m.fetchedAt!);
      }
      g.sources.push({
        key: bucket + resource,
        name: e.name,
        scope: m.scope,
        value: usable ? m.value : null,
      });
      groups.set(key, g);
    }
  }
  return [...groups.values()];
}
export function formatCompute(value: number, unit: ComputeReading["unit"], locale: string) {
  const scale =
    unit === "tokens/s"
      ? 0
      : value > 0
        ? Math.min(6, Math.max(0, Math.floor(Math.log10(value) / 3)))
        : 0;
  return {
    value: new Intl.NumberFormat(locale, { maximumFractionDigits: scale ? 2 : 1 }).format(
      value / 1000 ** scale,
    ),
    unit: `${["", "K", "M", "G", "T", "P", "E"][scale]}${unit}`,
  };
}
