import { discoverOfficialDevices } from "./iota-discovery.server";
import { computeStatus } from "./device-status";
import { publicPlatform } from "./platforms.server";
import { validBinding, bindingIdentity } from "./fleet";
import type { ReportBinding } from "./daily-report-collect.server";
export type AlertSignal = "healthy" | "bad" | "unknown";
export type AlertReason = "iota_not_found" | "iota_idle" | "provider_offline";
export async function collectAlertSignal(b: ReportBinding, explain?: (reason: AlertReason) => void): Promise<AlertSignal> {
  if (!validBinding(b.project, b.identifier)) return "unknown";
  try {
    if (b.project === "iota") {
      const roster = await discoverOfficialDevices([b.identifier], false, []);
      const d = roster.devices[0];
      if (!d || d.stale) return "unknown";
      const status = computeStatus({
        miner: d.miner,
        fullCoverage: roster.fullCoverage,
        lastSuccessfulFetchAt: d.fetchedAt ?? roster.fetchedAt,
        now: Date.now(),
      });
      if (status === "not_found") explain?.("iota_not_found");
      if (status === "idle") explain?.("iota_idle");
      return ["contributing", "waiting"].includes(status)
        ? "healthy"
        : ["idle", "not_found"].includes(status)
          ? "bad"
          : "unknown";
    }
    if (b.project === "akash" || b.project === "golem") {
      const r = await publicPlatform(b.project, b.identifier);
      const n = r.data;
      const now = Date.now();
      if (
        r.error ||
        r.stale ||
        !r.fetchedAt ||
        now - r.fetchedAt > 5 * 60000 ||
        r.fetchedAt > now + 60000 ||
        !n?.sourceUpdatedAt ||
        now - n.sourceUpdatedAt > 15 * 60000 ||
        n.sourceUpdatedAt > now + 60000
      )
        return "unknown";
      if (n.online === false) explain?.("provider_offline");
      return n.online === true ? "healthy" : n.online === false ? "bad" : "unknown";
    }
  } catch {
    /* A transport error is never evidence that a machine is offline. */
  }
  return "unknown";
}
export const alertResource = (b: ReportBinding) =>
  bindingIdentity({ ...b, worker: b.worker ?? "" });
