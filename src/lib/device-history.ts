import { z } from "zod";
import { FLEET_PROJECTS, type FleetProject } from "./fleet";
import {
  aggregateDailyReport,
  reportDayWindow,
  type DailyReport,
  type ReportReading,
} from "./daily-report";
import { dailySnapshotSchema, filterReportProject, csvDocument, summarizeMonth } from "./pro-tools";
import type { SiteLocale } from "./site";
export type HistoryBinding = {
  project: FleetProject;
  identifier: string;
  device: string;
};
export const deviceDaySchema = z.object({
  report: dailySnapshotSchema,
  deviceReport: dailySnapshotSchema,
  walletProjects: z.array(z.enum(FLEET_PROJECTS)).max(10),
});
export const deviceHistorySchema = z.array(deviceDaySchema).max(92);
export type DeviceHistoryDay = z.infer<typeof deviceDaySchema>;
export type DeviceSnapshot = DeviceHistoryDay & { id: string };
/** Historical supported rewards for Quantus are an account ledger, not a machine ledger. */
export const isAccountReward = (project: FleetProject) =>
  ["quantus", "xid", "flyai", "akash"].includes(project);
const resourceKey = (project: string, id: string) =>
  project + ":" + (project === "flyai" ? id.toLowerCase() : id);
/** Keep ownership as it was at collection time; never redistribute an account total. */
export function buildDeviceSnapshots(
  day: string,
  bindings: HistoryBinding[],
  readings: ReportReading[],
  locale: SiteLocale,
  now: number,
  valuationAt?: string,
): DeviceSnapshot[] {
  const owners = new Map<string, Set<string>>();
  for (const b of bindings) {
    const key = resourceKey(b.project, b.identifier);
    if (!owners.has(key)) owners.set(key, new Set());
    owners.get(key)!.add(b.device);
  }
  const values = new Map<string, ReportReading>();
  for (const r of readings) {
    const key = resourceKey(r.project, r.resource);
    if (!values.has(key)) values.set(key, r);
  }
  return [...new Set(bindings.map((b) => b.device))].map((id) => {
    const owned = bindings.filter((b) => b.device === id),
      keys = new Set(owned.map((b) => resourceKey(b.project, b.identifier)));
    const rows = [...keys].flatMap((k) => (values.has(k) ? [values.get(k)!] : []));
    // A mixed project can have both unique IDs and a shared wallet; exclude only
    // shared resources from the device total, retaining the separately labeled view.
    const walletProjects = FLEET_PROJECTS.filter((p) =>
      owned.some(
        (b) =>
          b.project === p &&
          (isAccountReward(p) || (owners.get(resourceKey(p, b.identifier))?.size ?? 0) > 1),
      ),
    );
    const ownRows = rows.filter(
      (r) =>
        !isAccountReward(r.project) &&
        (owners.get(resourceKey(r.project, r.resource))?.size ?? 0) === 1,
    );
    const window = reportDayWindow(day);
    const report = aggregateDailyReport(window, rows, locale, 1, now),
      deviceReport = aggregateDailyReport(window, ownRows, locale, 1, now);
    if (walletProjects.length) deviceReport.partial = true;
    if (valuationAt) {
      report.valuationAt = valuationAt;
      deviceReport.valuationAt = valuationAt;
    }
    return { id, report, deviceReport, walletProjects };
  });
}
export function deviceReports(history: DeviceHistoryDay[], project?: FleetProject): DailyReport[] {
  return project
    ? filterReportProject(
        history.map((d) => d.report),
        project,
      )
    : history.map((d) => d.deviceReport);
}
export function deviceEarningsCsv(
  history: DeviceHistoryDay[],
  project?: FleetProject,
  month?: string,
) {
  const reports = deviceReports(history, project);
  if (month) {
    const summary = summarizeMonth(reports, month);
    return csvDocument([
      [
        "beijing_month",
        "project",
        "amount",
        "currency",
        "usd_estimate",
        "recorded_days",
        "expected_days",
        "partial",
        "scope",
      ],
      ...summary.projects.map((p) => [
        month,
        p.project,
        p.amount,
        p.currency,
        p.usd,
        p.days,
        summary.expected,
        p.partial,
        history.some(
          (d) => d.report.day.startsWith(month + "-") && d.walletProjects.includes(p.project),
        ) && project
          ? "account"
          : "device",
      ]),
    ]);
  }
  const byDay = new Map(history.map((d) => [d.report.day, d]));
  return csvDocument([
    [
      "beijing_day",
      "project",
      "amount",
      "currency",
      "usd_estimate",
      "partial",
      "usd_partial",
      "scope",
      "collected_at",
      "valuation_at",
      "known_resources",
      "priced_resources",
      "total_resources",
      "reason",
    ],
    ...reports.flatMap((d) =>
      d.projects.map((p) => [
        d.day,
        p.project,
        p.amount,
        p.currency,
        p.usd,
        p.partial,
        p.priced < p.total,
        project && byDay.get(d.day)?.walletProjects.includes(p.project) ? "account" : "device",
        d.generatedAt,
        d.valuationAt ?? "",
        p.known,
        p.priced,
        p.total,
        p.reason,
      ]),
    ),
  ]);
}
