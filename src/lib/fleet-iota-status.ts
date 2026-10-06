import type { DeviceStatus } from "./device-status";

/** Preserve successful negative roster results instead of reporting a fetch failure. */
export function fleetIotaStatus(status: DeviceStatus, stale: boolean) {
  if (stale || status === "refresh_interrupted") return "unavailable" as const;
  switch (status) {
    case "contributing":
      return "training" as const;
    case "waiting":
      return "waiting" as const;
    case "idle":
      return "idle" as const;
    case "not_found":
      return "notFound" as const;
    default:
      return "unavailable" as const;
  }
}
