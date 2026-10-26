import type { DeviceView } from "@/hooks/use-iota-dashboard";
import type { FleetDevice, FleetBinding } from "@/lib/fleet";
import type { AgentInfo } from "@/lib/device-agent";
import { diagnoseDevice } from "@/lib/diagnose";
import type { ProjectReading } from "./fleet-review-data";

/** Synthetic data only: rendered with production components, never queried or saved. */
export function operationsReviewData(now: number) {
  const devices: FleetDevice[] = ["Mac Studio", "Mac mini"].map((name, i) => ({
    id: `00000000-0000-4000-8000-00000000000${i + 1}`,
    name,
    hardware: i === 0 ? "Apple M4 Max · 128 GB" : "Apple M4 Pro · 64 GB",
    createdAt: now - 86400000,
    bindings: [
      {
        id: `sample-binding-${i}`,
        project: "iota",
        identifier: `5ExampleMiner${i}ForLocalPreviewOnly`,
        worker: "",
      },
    ],
  }));
  const agents: Record<string, AgentInfo> = Object.fromEntries(
    devices.map((d, i) => [
      d.id,
      {
        deviceId: d.id,
        lastSeen: new Date(now - 10000).toISOString(),
        snapshot: {
          appRunning: true,
          workerRunning: true,
          appCpu: i === 0 ? 286.5 : 3.2,
          processMemoryMb: i === 0 ? 2810 : 410,
          version: "1.0.12",
          appSelectedRun: { id: "4.13.7.11", observedAt: new Date(now - 10000).toISOString() },
          queue:
            i === 1 ? { position: 182, observedAt: new Date(now - 10000).toISOString() } : null,
          trainingState:
            i === 0
              ? {
                  phase: "training",
                  status: "forward",
                  observedAt: new Date(now - 10000).toISOString(),
                }
              : null,
        },
        pending: null,
        latestCommand: null,
        logsEnabled: false,
        recoveryEnabled: false,
      },
    ]),
  );
  const views: DeviceView[] = devices.map((device, i) => {
    const hotkey = device.bindings[0]!.identifier,
      status = i === 0 ? ("contributing" as const) : ("not_found" as const);
    const miner =
      i === 0
        ? {
            hotkey,
            coldkey: "sample",
            throughput: 2700,
            timestamp: now / 1000,
            layer: 0,
            activation_count: 10,
            is_active: true,
            registration_time: now / 1000 - 86400,
            run_id: "4.13.7.11",
          }
        : null;
    const earnings = {
      hotkey,
      totalEarnedUnits: i === 0 ? 586704997 : 1238251600,
      todayUnits: i === 0 ? 27830312 : 6359642,
      yesterdayUnits: 18000000,
      pendingUnits: 0,
      frozenUnits: 0,
      minimumPayoutUnits: 1000000,
      historyCount: 10,
      recent: [],
      fetchedAt: now - 10000,
      error: null,
    };
    return {
      entry: { hotkey, label: device.name, addedAt: device.createdAt },
      miner,
      runIds: ["4.13.7.11"],
      status,
      bucket: i === 0 ? "contributing" : "attention",
      earnings,
      earningsUsable: true,
      todayUsable: true,
      lifetimeUsable: true,
      statusFetchedAt: now - 10000,
      statusStale: false,
      diagnosis: diagnoseDevice({ status, miner, earnings, earningsUsable: true }),
    };
  });
  const reading = (binding: FleetBinding): ProjectReading => {
    const view = views.find((v) => v.entry.hotkey === binding.identifier)!;
    return {
      status: view.miner ? "training" : "waiting",
      activity: view.miner ? "2,700 tokens/s" : "—",
      today: String((view.earnings!.todayUnits ?? 0) / 1e8),
      todayUsdValue: ((view.earnings!.todayUnits ?? 0) / 1e8) * 6.6,
      lifetime: String((view.earnings!.totalEarnedUnits ?? 0) / 1e8),
      todayUnits: view.earnings!.todayUnits,
      lifetimeUnits: view.earnings!.totalEarnedUnits,
      iotaUsdPerUnit: 6.6,
      scope: "device",
      unit: "IOTA",
      source: "示例数据",
      updated: "10 秒前",
      health: "fresh",
      earningsWindow: "yesterday",
      officialRun: { id: "4.13.7.11", stale: false },
      officialTraining: { status: view.status, fetchedAt: now - 10000 },
    };
  };
  return {
    devices,
    agents,
    views,
    reading,
    byMiner: Object.fromEntries(devices.map((d) => [d.bindings[0]!.identifier, agents[d.id]!])),
  };
}
