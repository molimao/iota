import { z } from "zod";
import { FLEET_PROJECTS, type FleetProject } from "./fleet";
import { PROJECTS } from "./projects";
import { aggregateDailyReport, reportDayWindow, type ReportReading } from "./daily-report";
import { toUnits } from "./earnings";
import type { EntitlementHistory } from "./iota-types";
import { buildDeviceSnapshots, deviceHistorySchema, type HistoryBinding } from "./device-history";
import { dailySnapshotSchema } from "./pro-tools";
import type { SiteLocale } from "./site";

const day = z.string().refine((v) => {
  try {
    reportDayWindow(v);
    return true;
  } catch {
    return false;
  }
});
const reason = z.enum(["unavailable", "unsupported", "different_period", "connect_required"]);
export const historicalResourceSchema = z.object({
  project: z.enum(FLEET_PROJECTS),
  resource: z.string().min(1).max(100),
  reason: reason.optional(),
  days: z
    .array(
      z.object({
        day,
        units: z
          .string()
          .regex(/^\d{1,80}$/)
          .nullable(),
        usd: z.number().finite().nonnegative().nullable(),
        partial: z.boolean(),
        fetchedAt: z.number().finite(),
      }),
    )
    .max(90),
});
export type HistoricalResource = z.infer<typeof historicalResourceSchema>;
export const backfillStatusSchema = z.object({
  state: z.enum(["none", "pending", "done", "failed"]),
  completed: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  inserted: z.number().int().nonnegative(),
});
export function historyResourceKey(project: FleetProject, identifier: string) {
  return project + ":" + (project === "flyai" ? identifier.toLowerCase() : identifier);
}
export function historyResources<T extends HistoryBinding>(bindings: T[]): T[] {
  return [
    ...new Map(bindings.map((b) => [historyResourceKey(b.project, b.identifier), b])).values(),
  ];
}
export function historyDays(start: string, end: string): string[] {
  const first = reportDayWindow(start).start,
    last = reportDayWindow(end).start;
  const count = (last - first) / 86400000 + 1;
  if (!Number.isInteger(count) || count < 1 || count > 90) throw new Error("invalid_history_range");
  return Array.from({ length: count }, (_, i) =>
    new Date(first + i * 86400000 + 28800000).toISOString().slice(0, 10),
  );
}
/** The endpoint has no completeness marker. Only returned event days are known,
 * and every reconstructed IOTA day is explicitly partial. Never fill gaps. */
export function iotaHistoricalResource(
  id: string,
  input: EntitlementHistory,
  start: string,
  end: string,
  fetchedAt: number,
): HistoricalResource {
  const { alpha_amounts: amounts, timestamps, statuses } = input;
  if (
    !Array.isArray(amounts) ||
    !Array.isArray(timestamps) ||
    !Array.isArray(statuses) ||
    amounts.length !== timestamps.length ||
    amounts.length !== statuses.length ||
    amounts.length > 10000
  )
    throw new Error("invalid_history");
  const allowed = new Set(historyDays(start, end));
  const groups = new Map<string, { units: bigint; valid: boolean }>();
  for (let i = 0; i < amounts.length; i++) {
    const units = toUnits(amounts[i]!),
      stamp = timestamps[i],
      state = statuses[i]?.toLowerCase();
    if (
      units === null ||
      units < 0 ||
      typeof stamp !== "number" ||
      !Number.isFinite(stamp) ||
      stamp < 0 ||
      typeof state !== "string"
    )
      throw new Error("invalid_history");
    const date = new Date(stamp * 1000 + 28800000).toISOString().slice(0, 10);
    if (!allowed.has(date)) continue;
    const g = groups.get(date) ?? { units: 0n, valid: true };
    if (["pending", "settled"].includes(state)) g.units += BigInt(units);
    else if (!["frozen", "forfeit"].includes(state)) g.valid = false;
    groups.set(date, g);
  }
  return historicalResourceSchema.parse({
    project: "iota",
    resource: id,
    days: [...groups]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, g]) => ({
        day,
        units: g.valid ? g.units.toString() : null,
        usd: null,
        partial: true,
        fetchedAt,
      })),
  });
}
export function buildHistoricalReports(
  bindings: HistoryBinding[],
  resources: HistoricalResource[],
  start: string,
  end: string,
  locale: SiteLocale,
  now: number,
) {
  const days = new Set(historyDays(start, end)),
    expected = new Set(
      historyResources(bindings).map((b) => historyResourceKey(b.project, b.identifier)),
    );
  const seen = new Set<string>();
  for (const r of resources) {
    historicalResourceSchema.parse(r);
    const key = historyResourceKey(r.project, r.resource);
    if (!expected.has(key) || seen.has(key)) throw new Error("invalid_history_resource");
    seen.add(key);
    if (
      new Set(r.days.map((d) => d.day)).size !== r.days.length ||
      r.days.some((d) => !days.has(d.day))
    )
      throw new Error("invalid_history_days");
  }
  if (seen.size !== expected.size) throw new Error("incomplete_history_sources");
  const knownDays = [
    ...new Set(resources.flatMap((r) => r.days.filter((d) => d.units !== null).map((d) => d.day))),
  ].sort();
  return knownDays.map((day) => {
    const rows: ReportReading[] = resources.map((r) => {
      const d = r.days.find((v) => v.day === day);
      return {
        project: r.project,
        resource: r.resource,
        units: d?.units ?? null,
        decimals: r.project === "quantus" ? 12 : 8,
        currency: PROJECTS[r.project].token,
        usd: d?.usd ?? null,
        partial: d?.partial ?? true,
        fetchedAt: d?.fetchedAt,
        reason:
          d?.units !== null && d?.units !== undefined ? undefined : (r.reason ?? "unavailable"),
      };
    });
    const report = aggregateDailyReport(
      reportDayWindow(day),
      rows,
      locale,
      new Set(bindings.map((b) => b.device)).size,
      now,
    );
    report.source = "backfill";
    dailySnapshotSchema.parse(report);
    const devices = buildDeviceSnapshots(day, bindings, rows, locale, now).map((d) => ({
      ...d,
      report: { ...d.report, source: "backfill" as const },
      deviceReport: { ...d.deviceReport, source: "backfill" as const },
    }));
    deviceHistorySchema.parse(devices);
    return { day, report, devices };
  });
}
