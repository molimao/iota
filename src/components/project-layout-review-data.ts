import tscSnapshot from "@/lib/fixtures/tsc-public-pool-2026-10-25.json";
import { parseTscBob } from "@/lib/tensorcash-pools";
import { poolHashrate } from "@/lib/pool-monitor";
import { FLEET_PROJECTS, type FleetProject, type FleetDevice } from "@/lib/fleet";
import { PROJECTS } from "@/lib/projects";
import { fleetCopy } from "./fleet-copy";
import type { SiteLocale } from "@/lib/site";
import type { ProjectReading } from "./fleet-review-data";
import { isPoolProject } from "@/lib/pool-projects";
import { poolCopy } from "./pool-copy";
import { editorialCopy } from "./project-editorial";
export const REVIEW_PROJECTS = FLEET_PROJECTS.filter(
  (p) => p !== "iota" && p !== "acurast" && p !== "flyai",
);
export function layoutReading(
  project: FleetProject,
  locale: SiteLocale,
  stale = false,
): ProjectReading {
  const c = fleetCopy(locale),
    e = editorialCopy(locale);
  const base: ProjectReading = {
    status: stale ? "staleData" : "wallet",
    health: stale ? "stale" : "fresh",
    activity: "—",
    today: null,
    lifetime: null,
    unit: PROJECTS[project].token,
    scope: "wallet",
    source: "DEMO · example",
    updated: "DEMO",
    todayUsable: false,
  };
  if (project === "tsc") {
    // Recorded public response, anonymized and explicitly marked DEMO. Never queried or saved.
    const d = parseTscBob(tscSnapshot.bob, tscSnapshot.address);
    return {
      ...base,
      source: "Bob Labs · DEMO",
      status: stale ? "staleData" : "online",
      activity: poolHashrate("tsc", d.hashrate, d.rateUnit),
      lifetime: String(d.paid),
      totalLabel: poolCopy.paid[locale],
      accountSummary: { kind: "balance", amount: String(d.balance), unit: "TSC" },
      poolWorkers: {
        count: d.workerCount,
        workers: d.workers.map((w) => (stale ? { ...w, online: null } : w)),
        rateUnit: d.rateUnit,
      },
      compute: {
        value: d.hashrate,
        unit: "PoI/s",
        scope: "account",
        fresh: !stale,
        fetchedAt: Date.now(),
      },
    };
  }
  if (isPoolProject(project) || project === "noid")
    return {
      ...base,
      status: stale ? "staleData" : "online",
      activity: "62.4 MH/s",
      ...(isPoolProject(project)
        ? {
            poolWorkers: {
              count: 3,
              workers: [
                { name: "Mac-Studio", hashrate: 34.2e6, online: true, lastSeen: null },
                { name: "Mac-mini", hashrate: 28.2e6, online: true, lastSeen: null },
                { name: "MacBook-Pro", hashrate: 0, online: false, lastSeen: null },
              ],
            },
          }
        : {}),
      compute: {
        value: 62.4e6,
        unit: "H/s",
        scope: "account",
        fresh: !stale,
        fetchedAt: Date.now(),
      },
      today: "0.1846",
      todayLabel: poolCopy.rolling24h[locale],
      lifetime: "14.82",
      totalLabel: c.total,
      accountSummary: { kind: "balance", amount: "1.25", unit: base.unit },
      rewardAmount: 0.1846,
      earningsWindow: "rolling24h",
    };
  if (project === "xid")
    return {
      ...base,
      activity: "3 Worker",
      lifetime: "28.16",
      totalLabel: c.balance,
      accountSummary: { kind: "balance", amount: "28.16", unit: "XID" },
    };
  if (project === "quantus") return { ...base, today: "0.18", lifetime: "33.45" };
  if (project === "nosana")
    return {
      ...base,
      scope: "device",
      status: stale ? "staleData" : "computing",
      activity: "2 jobs",
      lifetime: "128",
      totalLabel: e.completed,
    };
  if (project === "gonka")
    return {
      ...base,
      scope: "device",
      status: stale ? "staleData" : "participating",
      activity: "Epoch 410",
      lifetime: "84",
      totalLabel: e.weight,
    };
  if (project === "akash") return { ...base, activity: "18 / 64 GPU" };
  return {
    ...base,
    scope: "device",
    activity: "2 GPU",
    today: "3.25",
    todayLabel: c.today,
    lifetime: "128.45",
    unit: project === "golem" ? "GLM" : "USD",
    earningsWindow: "today",
    rewardAmount: 3.25,
  };
}
export function layoutDevices(project: FleetProject): FleetDevice[] {
  return [
    {
      id: `layout-${project}`,
      name: `${PROJECTS[project].name} · Demo`,
      hardware: "",
      createdAt: 1,
      bindings: [
        {
          id: `binding-${project}`,
          project,
          ...(project === "tsc" ? { pool: "boblabs" as const } : {}),
          identifier: `DEMO-${project}-abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz`,
          worker: "",
        },
      ],
    },
  ];
}
