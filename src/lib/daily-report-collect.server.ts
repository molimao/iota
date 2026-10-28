import { isPoolProject, poolProvider, validPoolProvider, type PoolProvider } from "./pool-projects";
import { validBinding } from "./fleet";
import { PROJECTS, record, type ProjectId } from "./projects";
import {
  amountToUnits,
  decimalStringToUnits,
  iotaWindowUnits,
  sumDecimalStrings,
  type ReportPeriod,
  type ReportWindow,
  type ReportReading,
} from "./daily-report";
import { fetchUpstream, TTL } from "./iota-upstream.server";
import type { EntitlementHistory } from "./iota-types";
import { upstreamJson } from "./upstream-json.server";
import { QUANTUS_MAINNET } from "./projects-upstream.server";
import { vastReportDay } from "./platforms.server";
export type ReportBinding = {
  project: ProjectId;
  identifier: string;
  worker?: string | undefined;
  pool?: PoolProvider | undefined;
};
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
  if (isPoolProject(b.project)) return { ...base, reason: "different_period" };
  if (!validBinding(b.project, b.identifier)) return { ...base, reason: "unavailable" };
  if (["xid", "nosana", "gonka", "akash", "acurast"].includes(b.project))
    return { ...base, reason: "unsupported" };
  if (["flyai", "golem", "ionet", "noid"].includes(b.project))
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

function fromAmount(
  base: ReportReading,
  amount: number,
  period: ReportPeriod,
  partial: boolean,
): ReportReading {
  const scaled = amountToUnits(amount);
  return scaled
    ? { ...base, ...scaled, period, partial, fetchedAt: Date.now() }
    : { ...base, reason: "unavailable" };
}
function failed(base: ReportReading, error: unknown): ReportReading {
  return {
    ...base,
    reason:
      error instanceof Error && ["connect-required", "expired"].includes(error.message)
        ? "connect_required"
        : "unavailable",
  };
}
/** Mail reads the figure the project page already shows. Ledger history stays on calendar days. */
async function collectListedEarnings(
  user: string,
  b: ReportBinding,
  window: ReportWindow,
  base: ReportReading,
): Promise<ReportReading> {
  try {
    if (isPoolProject(b.project)) {
      const { readPoolAccount } = await import("./pool-monitor.server");
      const provider =
        b.pool && validPoolProvider(b.project, b.pool) ? b.pool : poolProvider(b.project);
      base = { ...base, scope: provider };
      const result = await readPoolAccount(b.project, b.identifier, provider);
      if (result.error || result.stale || !result.data) return { ...base, reason: "unavailable" };
      const account = result.data;
      if (
        account.reward !== null &&
        (account.period === "rolling24h" || account.period === "utcDay")
      )
        return fromAmount(base, account.reward, account.period, account.partial);
      if (account.balance !== null)
        return fromAmount(base, account.balance, "balance", account.partial);
      return { ...base, reason: "unavailable" };
    }
    if (b.project === "golem" || b.project === "noid" || b.project === "acurast") {
      const { readPublicPlatform } = await import("./platforms-upstream.server");
      const node = await readPublicPlatform(b.project, b.identifier);
      if (b.project === "acurast") {
        const yesterday = node.acurastRewards?.managers.map((m) => m.yesterday) ?? [];
        if (yesterday.length > 0 && yesterday.every((v) => v !== null)) {
          const units = sumDecimalStrings(yesterday, 12);
          return units === null
            ? { ...base, reason: "unavailable" }
            : {
                ...base,
                units,
                decimals: 12,
                period: "hkDay",
                fetchedAt: Date.now(),
                parts: node.acurastRewards!.managers.map((m) => ({
                  key: m.id,
                  units: decimalStringToUnits(m.yesterday!, 12)!,
                })),
              };
        }
        const balance = node.acurastBalances?.[0]?.total;
        const units = balance ? decimalStringToUnits(balance, 12) : null;
        return units
          ? { ...base, units, decimals: 12, period: "balance", fetchedAt: Date.now() }
          : { ...base, reason: "unavailable" };
      }
      if (
        node.reward !== null &&
        (node.period === "rolling24h" || node.period === "utcDay" || node.period === "hkDay")
      )
        return fromAmount(base, node.reward, node.period, node.partial);
      if (node.balance != null) return fromAmount(base, node.balance, "balance", node.partial);
      return { ...base, reason: "unavailable" };
    }
    if (b.project === "ionet") {
      const { ionetReportDay } = await import("./platforms.server");
      const node = await ionetReportDay(user, b.identifier, window.day);
      return node.reward === null
        ? { ...base, reason: "unavailable" }
        : fromAmount(base, node.reward, "utcDay", node.partial);
    }
    if (b.project === "flyai") {
      const [{ readFlyaiMonth }, { flyaiWalletStats }, { hongKongMonth }] = await Promise.all([
        import("./flyai.server"),
        import("./flyai"),
        import("./read-query"),
      ]);
      const month = await readFlyaiMonth();
      if (month.error || month.stale || !month.data || month.data.month !== hongKongMonth())
        return { ...base, reason: "unavailable" };
      const stats = flyaiWalletStats(month.data, b.identifier);
      return stats
        ? fromAmount(base, stats.points, "month", false)
        : { ...base, reason: "unavailable" };
    }
    if (b.project === "xid") {
      const { readProjectNetwork } = await import("./projects-upstream.server");
      const network = await readProjectNetwork("xid");
      if (network.error || network.stale || !network.data)
        return { ...base, reason: "unavailable" };
      const balance = network.data.balances[b.identifier];
      return balance == null
        ? { ...base, reason: "unavailable" }
        : fromAmount(base, balance, "balance", network.data.poolStale);
    }
    return { ...base, reason: "unavailable" };
  } catch (error) {
    return failed(base, error);
  }
}
/** Email uses the same preceding-day attribution as the IOTA website cards.
 * The shared ledger collector remains on actual accounting dates for history. */
export async function collectEmailReportBinding(
  user: string,
  binding: ReportBinding,
  window: ReportWindow,
): Promise<ReportReading> {
  const base: ReportReading = {
    project: binding.project,
    resource: binding.identifier,
    units: null,
    decimals: binding.project === "quantus" ? 12 : 8,
    currency: PROJECTS[binding.project].token,
    usd: null,
  };
  if (!validBinding(binding.project, binding.identifier)) return { ...base, reason: "unavailable" };
  if (binding.project === "iota" || binding.project === "quantus" || binding.project === "vast") {
    const recordingWindow =
      binding.project === "iota"
        ? {
            ...window,
            start: window.start + 86400000,
            end: Math.min(window.end + 86400000, Date.now() + 1),
          }
        : window;
    const reading = await collectReportBinding(user, binding, recordingWindow);
    return reading.units !== null ? { ...reading, period: "hkDay" as const } : reading;
  }
  return collectListedEarnings(user, binding, window, base);
}
