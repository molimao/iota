import { PROJECTS } from "@/lib/projects";
import type { FleetBinding, FleetDevice } from "@/lib/fleet";

export type ProjectReading = {
  status:
    | "idle"
    | "notFound"
    | "online"
    | "offline"
    | "computing"
    | "participating"
    | "training"
    | "mining"
    | "waiting"
    | "unavailable";
  activity: string;
  today: string | null;
  todayUsd?: string;
  todayUsdValue?: number | null;
  priceStale?: boolean;
  todayUsable?: boolean;
  earningsPeriod?: "day" | "month";
  lifetime: string | null;
  unit: string;
  scope: "device" | "wallet";
  source: string;
  updated: string;
  note?: string | undefined;
  todayLabel?: string;
  totalLabel?: string;
};
// Illustrative UI data only. Never fed into the real telemetry cache or billing.
const machines = [
  ["studio", "Mac Studio", "Apple M4 Max · 128 GB", ["iota", "xid", "flyai"]],
  ["gpu", "GPU Workstation", "RTX 4090 · 24 GB", ["iota", "quantus"]],
  ["mini", "Mac mini", "Apple M4 Pro · 64 GB", ["xid"]],
  ["laptop", "MacBook Pro", "Apple M2 Max · 32 GB", ["iota", "xid"]],
  ["node", "Quantus Node", "Ryzen 9 7950X · 64 GB", ["quantus"]],
  ["browser", "Browser Compute", "Intel i7 · 32 GB", ["flyai"]],
] as const;

export function reviewDevices(): FleetDevice[] {
  return machines.map(([id, name, hardware, projects]) => ({
    id,
    name,
    hardware,
    createdAt: 1,
    bindings: projects.map((project) => ({
      id: `${id}-${project}`,
      project,
      identifier: `sample-${id}-${project}`,
      worker: project === "xid" ? name.toLowerCase().replaceAll(" ", "-") : "",
    })),
  }));
}
export function reviewReading(binding: FleetBinding): ProjectReading {
  if (
    !machines.some(
      ([id, , , projects]) =>
        `${id}-${binding.project}` === binding.id &&
        (projects as readonly string[]).includes(binding.project),
    )
  ) {
    return {
      status: "unavailable",
      activity: "—",
      today: null,
      lifetime: null,
      unit: "",
      scope: "device",
      source: "—",
      updated: "—",
    };
  }
  const idle = binding.id === "laptop-iota";
  switch (binding.project) {
    case "iota":
      return {
        status: idle ? "waiting" : "training",
        activity: idle ? "—" : "24.8 tokens/s",
        today: idle ? "0.01825000" : "0.24161239",
        todayUsd: idle ? "0.14" : "1.80",
        todayUsdValue: idle ? 0.1363275 : 1.80484455,
        lifetime: "12.38251600",
        unit: "IOTA",
        scope: "device",
        source: "Macrocosmos · IOTA",
        updated: "20:55:18 UTC+8",
      };
    case "xid":
      return {
        status: "mining",
        activity: "384.2 MH/s",
        today: null,
        lifetime: "28.16",
        unit: "XID",
        scope: "wallet",
        source: "Superknet · xCoin",
        updated: "20:55:10 UTC+8",
      };
    case "quantus":
      return {
        status: "unavailable",
        activity: "—",
        today: "0.31",
        lifetime: "18.92",
        unit: "QTC",
        scope: "wallet",
        source: "Quantus Explorer",
        updated: "20:55:04 UTC+8",
      };
    case "akash":
    case "ionet":
    case "vast":
    case "golem":
    case "nosana":
    case "gonka":
    case "flyai":
      return {
        status: "unavailable",
        activity: "—",
        today: null,
        lifetime: null,
        unit: PROJECTS[binding.project].token,
        scope: "wallet",
        source: PROJECTS[binding.project].name,
        updated: "—",
      };
  }
}
