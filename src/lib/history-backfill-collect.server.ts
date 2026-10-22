import { fetchUpstream, TTL } from "./iota-upstream.server";
import type { EntitlementHistory } from "./iota-types";
import { isPoolProject } from "./pool-projects";
import { validBinding, type FleetProject } from "./fleet";
import { collectReportBinding } from "./daily-report-collect.server";
import { reportDayWindow } from "./daily-report";
import { historyDays, iotaHistoricalResource, type HistoricalResource } from "./history-backfill";
import { mapConcurrent } from "./concurrent";
import { upstreamJson } from "./upstream-json.server";
import { QUANTUS_MAINNET } from "./projects-upstream.server";
import { record } from "./projects";

export async function collectHistoricalResource(
  user: string,
  binding: { project: FleetProject; identifier: string; worker?: string | undefined },
  start: string,
  end: string,
  offset: number,
) {
  if (!validBinding(binding.project, binding.identifier))
    throw new Error("invalid_history_identifier");
  if (binding.project === "iota") {
    const h = await fetchUpstream<EntitlementHistory>(
      `/v1/entitlements/history/hotkey/${encodeURIComponent(binding.identifier)}`,
      TTL.rewards,
    );
    if (h.error || h.stale || !h.data) throw new Error("history_source_unavailable");
    return {
      resource: iotaHistoricalResource(
        binding.identifier,
        h.data,
        start,
        end,
        h.fetchedAt ?? Date.now(),
      ),
      next: 0,
      complete: true,
    };
  }
  if (!["quantus", "vast"].includes(binding.project)) {
    const reason =
      ["flyai", "golem", "ionet"].includes(binding.project) || isPoolProject(binding.project)
        ? ("different_period" as const)
        : ("unsupported" as const);
    return {
      resource: {
        project: binding.project,
        resource: binding.identifier,
        reason,
        days: [],
      } satisfies HistoricalResource,
      next: 0,
      complete: true,
    };
  }
  const days = historyDays(start, end);
  if (!Number.isInteger(offset) || offset < 0 || offset >= days.length)
    throw new Error("invalid_history_offset");
  const chunk = days.slice(offset, offset + 3);
  let covered = chunk;
  if (binding.project === "quantus") {
    const root = record(
      await upstreamJson(QUANTUS_MAINNET, {
        body: {
          query: `query BackfillCoverage { first:block(limit:1,order_by:{height:asc}){timestamp} }`,
        },
      }),
    );
    const first = record(root["data"])["first"];
    const value = Array.isArray(first) ? record(first[0])["timestamp"] : null;
    const stamp = typeof value === "string" ? Date.parse(value) : NaN;
    if (root["errors"] || !Number.isFinite(stamp)) throw new Error("history_source_unavailable");
    // A successful empty reward query before the index's coverage is unknown,
    // not proof of zero mining income. Exclude the first partial calendar day.
    covered = chunk.filter((day) => reportDayWindow(day).start >= stamp);
  }
  const results = await mapConcurrent(covered, 3, async (day) => ({
    day,
    reading: await collectReportBinding(user, binding, reportDayWindow(day)),
  }));
  if (results.some((r) => r.reading.reason === "unavailable"))
    throw new Error("history_source_unavailable");
  if (results.some((r) => r.reading.reason === "connect_required"))
    return {
      resource: {
        project: binding.project,
        resource: binding.identifier,
        reason: "connect_required" as const,
        days: [],
      },
      next: 0,
      complete: true,
    };
  const resource: HistoricalResource = {
    project: binding.project,
    resource: binding.identifier,
    days: results.map(({ day, reading: r }) => ({
      day,
      units: r.units,
      usd: r.usd,
      partial: !!r.partial,
      fetchedAt: r.fetchedAt ?? Date.now(),
    })),
  };
  const next = offset + chunk.length;
  return { resource, next, complete: next >= days.length };
}
