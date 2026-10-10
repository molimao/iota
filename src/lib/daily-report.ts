import { z } from "zod";
import { hongKongDayStartSeconds, toUnits } from "./earnings";
import type { EntitlementHistory } from "./iota-types";
import { PROJECT_IDS, PROJECTS, type ProjectId } from "./projects";
import { LOCALES, type SiteLocale } from "./site";

export const REPORT_SEND_MINUTE = 9 * 60 + 30;
export const reportPreferenceInput = z
  .object({ enabled: z.boolean(), locale: z.enum(LOCALES) })
  .strict();
export type ReportWindow = { day: string; start: number; end: number; due: number };
/** Shanghai and Hong Kong share UTC+8 without DST. Yesterday is [start,end). */
export function yesterdayReportWindow(now = Date.now()): ReportWindow {
  const end = hongKongDayStartSeconds(now) * 1000,
    start = end - 86400000;
  return {
    day: new Date(start + 28800000).toISOString().slice(0, 10),
    start,
    end,
    due: end + REPORT_SEND_MINUTE * 60000,
  };
}
export function nextReportAt(now = Date.now()) {
  const due = yesterdayReportWindow(now).due;
  return due > now ? due : due + 86400000;
}
export function reportDayWindow(day: string): ReportWindow {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error("invalid_report_day");
  const start = Date.parse(day + "T00:00:00+08:00");
  if (!Number.isFinite(start) || new Date(start + 28800000).toISOString().slice(0, 10) !== day)
    throw new Error("invalid_report_day");
  return { day, start, end: start + 86400000, due: start + 86400000 + REPORT_SEND_MINUTE * 60000 };
}
/** Missing/malformed history is unknown. No current-day or future entry leaks in. */
export function iotaWindowUnits(
  history: EntitlementHistory | null,
  window: ReportWindow,
): string | null {
  if (
    !history ||
    !Array.isArray(history.alpha_amounts) ||
    !Array.isArray(history.timestamps) ||
    !Array.isArray(history.statuses)
  )
    return null;
  const { alpha_amounts: a, timestamps: t, statuses: s } = history;
  if (a.length !== t.length || a.length !== s.length) return null;
  let total = 0n;
  for (let i = 0; i < a.length; i++) {
    const amount = toUnits(a[i]!),
      at = t[i],
      status = s[i];
    if (
      amount === null ||
      amount < 0 ||
      typeof at !== "number" ||
      !Number.isFinite(at) ||
      typeof status !== "string"
    )
      return null;
    if (
      at * 1000 >= window.start &&
      at * 1000 < window.end &&
      ["pending", "settled"].includes(status.toLowerCase())
    )
      total += BigInt(amount);
  }
  return total.toString();
}
export function decimalUnits(units: string, decimals: number) {
  if (!/^\d{1,80}$/.test(units) || !Number.isInteger(decimals) || decimals < 0 || decimals > 18)
    throw new Error("invalid_report_units");
  const n = BigInt(units),
    scale = 10n ** BigInt(decimals),
    fraction = (n % scale).toString().padStart(decimals, "0").replace(/0+$/, "");
  return (n / scale).toString() + (fraction ? "." + fraction : "");
}
export type ReportReason = "unavailable" | "unsupported" | "different_period" | "connect_required";
export type ReportReading = {
  project: ProjectId;
  resource: string;
  units: string | null;
  decimals: number;
  currency: string;
  usd: number | null;
  fetchedAt?: number | undefined;
  reason?: ReportReason | undefined;
};
export type ProjectReport = {
  project: ProjectId;
  name: string;
  currency: string;
  amount: string | null;
  usd: number | null;
  known: number;
  priced: number;
  total: number;
  partial: boolean;
  reason: ReportReason | null;
};
export type DailyReport = {
  day: string;
  generatedAt: string;
  valuationAt?: string;
  locale: SiteLocale;
  deviceCount: number;
  projects: ProjectReport[];
  usdSubtotal: number | null;
  partial: boolean;
};
export function aggregateDailyReport(
  window: ReportWindow,
  readings: ReportReading[],
  locale: SiteLocale,
  deviceCount: number,
  now = Date.now(),
): DailyReport {
  const seen = new Set<string>();
  const rows = readings.filter((r) => {
    const k = r.project + ":" + r.resource;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const projects = PROJECT_IDS.filter((p) => rows.some((r) => r.project === p)).map((project) => {
    const group = rows.filter((r) => r.project === project),
      first = group[0]!;
    let total = 0n,
      known = 0,
      usd = 0,
      priced = 0;
    for (const r of group) {
      if (
        r.units === null ||
        r.currency !== first.currency ||
        r.decimals !== first.decimals ||
        !/^\d{1,80}$/.test(r.units)
      )
        continue;
      total += BigInt(r.units);
      known++;
      if (r.usd !== null && Number.isFinite(r.usd) && r.usd >= 0) {
        usd += r.usd;
        priced++;
      }
    }
    return {
      project,
      name: PROJECTS[project].name,
      currency: first.currency,
      amount: known ? decimalUnits(total.toString(), first.decimals) : null,
      usd: priced && Number.isFinite(usd) ? usd : null,
      known,
      priced,
      total: group.length,
      partial: known < group.length,
      reason:
        known === group.length ? null : (group.find((r) => r.reason)?.reason ?? "unavailable"),
    } satisfies ProjectReport;
  });
  const priced = projects.filter((p) => p.usd !== null),
    subtotal = priced.reduce((s, p) => s + p.usd!, 0);
  return {
    day: window.day,
    generatedAt: new Date(now).toISOString(),
    locale,
    deviceCount,
    projects,
    usdSubtotal: priced.length && Number.isFinite(subtotal) ? subtotal : null,
    partial: projects.some((p) => p.partial || p.priced < p.total),
  };
}
