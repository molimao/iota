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
import { bntLabels } from "./bnt-copy";
export const REVIEW_PROJECTS = FLEET_PROJECTS.filter(
  (p) => p !== "iota" && p !== "acurast" && p !== "flyai",
);
/** Isolated sample for one project's normal card; never used by live queries. */
export function layoutAgent(
  device: FleetDevice,
  now: number,
): import("@/lib/device-agent").AgentInfo | undefined {
  const binding = device.bindings[0];
  if (!binding || !["xmr", "bnt", "prl", "noid"].includes(binding.project)) return undefined;
  const common = {
    bindingId: binding.id,
    observedAt: new Date(now - 5000).toISOString(),
    status: "ok" as const,
    hashrate10s: null,
    hashrate60s: null,
    accepted: 100,
    rejected: null,
    uptime: null,
  };
  const miner: import("@/lib/device-agent").AgentSnapshot["miners"] =
    binding.project === "bnt"
      ? [
          {
            ...common,
            project: "bnt",
            software: "seine",
            hashrateSession: 2.82,
            rateWindow: "session",
            counterUnit: "shares",
            accepted: 383,
          },
        ]
      : binding.project === "prl"
        ? [
            {
              ...common,
              project: "prl",
              software: "pearl-metal",
              hashrate60s: 1075000,
              rateWindow: "60s",
              rateUnit: "tiles/s",
              counterUnit: "shares",
              accepted: 2,
              rejected: 1,
            },
          ]
        : binding.project === "noid"
          ? [
              {
                ...common,
                project: "noid",
                software: "noid-mac",
                status: "process",
                appCpu: 180.5,
                processMemoryMb: 256,
                accepted: null,
              },
            ]
          : [{ ...common, project: "xmr", software: "xmrig", hashrate10s: 3240.2, rejected: 3 }];
  return {
    deviceId: device.id,
    lastSeen: common.observedAt,
    snapshot: { miners: miner },
    pending: null,
    latestCommand: null,
    logsEnabled: false,
    recoveryEnabled: false,
  };
}
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
  if (project === "bnt")
    return {
      ...base,
      today: "3.5",
      todayLabel: bntLabels.paid24h[locale],
      rewardAmount: 3.5,
      earningsWindow: "rolling24h",
      status: stale ? "staleData" : "online",
      activity: "6 H/s",
      lifetime: "14.82",
      totalLabel: poolCopy.paid[locale],
      accountSummary: { kind: "balance", amount: "1.25", unit: "BNT" },
      poolWorkers: {
        count: 3,
        workers: [
          { name: "Mac-Studio", hashrate: 2.82, online: true, lastSeen: null },
          { name: "Mac-mini", hashrate: 3.18, online: true, lastSeen: null },
          { name: "MacBook-Pro", hashrate: 0, online: false, lastSeen: null },
        ],
      },
      compute: { value: 6, unit: "H/s", scope: "account", fresh: !stale, fetchedAt: Date.now() },
    };
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
