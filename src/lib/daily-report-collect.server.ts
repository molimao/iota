import { validBinding } from "./fleet";
import { PROJECTS, record, type ProjectId } from "./projects";
import { iotaWindowUnits, type ReportWindow, type ReportReading } from "./daily-report";
import { fetchUpstream, TTL } from "./iota-upstream.server";
import type { EntitlementHistory } from "./iota-types";
import { upstreamJson } from "./upstream-json.server";
import { QUANTUS_MAINNET } from "./projects-upstream.server";
import { vastReportDay } from "./platforms.server";
export type ReportBinding = { project: ProjectId; identifier: string; worker?: string | undefined };
const query = `query ReportDay($id:String!,$since:timestamptz!,$until:timestamptz!){latest:block(limit:1,order_by:{height:desc}){timestamp} rewards:miner_reward_aggregate(where:{miner_id:{_eq:$id},timestamp:{_gte:$since,_lt:$until}}){aggregate{count sum{reward}}}}`;
export async function collectReportBinding(
  user: string,
  b: ReportBinding,
  window: ReportWindow,
): Promise<ReportReading> {
  const base: ReportReading = {
    project: b.project,
    resource: b.identifier,
    units: null,
    decimals: b.project === "quantus" ? 12 : b.project === "vast" ? 8 : 8,
    currency: PROJECTS[b.project].token,
    usd: null,
  };
  if (!validBinding(b.project, b.identifier)) return { ...base, reason: "unavailable" };
  if (["xid", "nosana", "gonka", "akash"].includes(b.project))
    return { ...base, reason: "unsupported" };
  if (["flyai", "golem", "ionet"].includes(b.project))
    return { ...base, reason: "different_period" };
  try {
    if (b.project === "iota") {
      const h = await fetchUpstream<EntitlementHistory>(
        `/v1/entitlements/history/hotkey/${encodeURIComponent(b.identifier)}`,
        TTL.rewards,
      );
      if (h.error || h.stale || !h.data) return { ...base, reason: "unavailable" };
      if (h.data.timestamps.length >= 30 && !h.data.timestamps.some((t) => t * 1000 < window.start))
        return { ...base, reason: "unavailable" };
      const units = iotaWindowUnits(h.data, window);
      return units === null
        ? { ...base, reason: "unavailable" }
        : { ...base, units, fetchedAt: h.fetchedAt ?? Date.now() };
    }
    if (b.project === "quantus") {
      const root = record(
        await upstreamJson(QUANTUS_MAINNET, {
          body: {
            query,
            variables: {
              id: b.identifier,
              since: new Date(window.start).toISOString(),
              until: new Date(window.end).toISOString(),
            },
          },
        }),
      );
      if (root["errors"]) throw new Error("invalid-data");
      const data = record(root["data"]),
        latest = data["latest"];
      const stamp = Array.isArray(latest) ? record(latest[0])["timestamp"] : null;
      if (
        typeof stamp !== "string" ||
        !Number.isFinite(Date.parse(stamp)) ||
        Date.parse(stamp) < window.end
      )
        throw new Error("index_lag");
      const a = record(record(record(root["data"])["rewards"])["aggregate"]),
        sum = record(a["sum"]);
      if (typeof a["count"] !== "number" || !Number.isSafeInteger(a["count"]) || a["count"] < 0)
        throw new Error("invalid-data");
      const units = a["count"] === 0 ? "0" : sum["reward"];
      if (typeof units !== "string" || !/^\d{1,80}$/.test(units)) throw new Error("invalid-data");
      return { ...base, units, fetchedAt: Date.now() };
    }
    const p = await vastReportDay(user, b.identifier, window.end);
    if (
      p.periodStart !== window.start ||
      p.reward === null ||
      p.reward < 0 ||
      !Number.isFinite(p.reward) ||
      p.partial
    )
      throw new Error("invalid-data");
    const units = Math.round(p.reward * 1e8);
    if (!Number.isSafeInteger(units)) throw new Error("invalid-data");
    return { ...base, units: String(units), usd: p.reward, fetchedAt: Date.now() };
  } catch (e) {
    return {
      ...base,
      reason:
        e instanceof Error && ["connect-required", "expired"].includes(e.message)
          ? "connect_required"
          : "unavailable",
    };
  }
}
