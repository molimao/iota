import { z } from "zod";
import { hongKongDayStartSeconds, toUnits } from "./earnings";
import type { EntitlementHistory } from "./iota-types";
import { isPoolProject } from "./pool-projects";
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
/** hkDay matches the mail date. Other periods are the source's own figure, labelled on the row. */
export type ReportPeriod = "hkDay" | "utcDay" | "rolling24h" | "balance" | "month";
export function reportBindingNeedsNetwork(project: ProjectId) {
  return (
    isPoolProject(project) ||
    ["iota", "quantus", "vast", "ionet", "golem", "noid", "acurast", "flyai", "xid"].includes(
      project,
    )
  );
}
/** Balance and monthly points stay on the row. They are not added to the earnings total. */
export function countsInEstimate(period: ReportPeriod | null | undefined) {
  return period !== "balance" && period !== "month";
}
export function amountToUnits(amount: number): { units: string; decimals: number } | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  for (const decimals of [8, 6, 4, 2, 0]) {
    const scaled = Math.round(amount * 10 ** decimals);
    if (Number.isSafeInteger(scaled) && scaled >= 0) return { units: String(scaled), decimals };
  }
  return null;
}
export function decimalStringToUnits(amount: string, decimals: number): string | null {
  if (!/^\d+(\.\d+)?$/.test(amount) || !Number.isInteger(decimals) || decimals < 0 || decimals > 18)
    return null;
  const [whole, frac = ""] = amount.split(".");
  if (whole!.length > 60 || frac.length > decimals) return null;
  return (
    BigInt(whole!) * 10n ** BigInt(decimals) +
    BigInt((frac + "0".repeat(decimals)).slice(0, decimals) || "0")
  ).toString();
}
export function sumDecimalStrings(values: string[], decimals: number): string | null {
  if (!values.length) return null;
  let total = 0n;
  for (const value of values) {
    const units = decimalStringToUnits(value, decimals);
    if (units === null) return null;
    total += BigInt(units);
  }
  return total.toString();
}
export function applyMarketUsd(
  readings: ReportReading[],
  prices: Partial<Record<ProjectId, number>>,
): ReportReading[] {
  return readings.map((reading) => {
    if (
      reading.project === "iota" ||
      reading.project === "vast" ||
      reading.usd !== null ||
      reading.units === null
    )
      return reading;
    const price = prices[reading.project];
    if (price == null || !Number.isFinite(price) || price <= 0) return reading;
    const amount = Number(reading.units) / 10 ** reading.decimals;
    const usd = amount * price;
    return Number.isFinite(amount) && amount >= 0 && Number.isFinite(usd)
      ? { ...reading, usd }
      : reading;
  });
}
export type ReportReading = {
  project: ProjectId;
  resource: string;
  scope?: string | undefined;
  parts?: { key: string; units: string }[] | undefined;
  units: string | null;
  decimals: number;
  currency: string;
  usd: number | null;
  fetchedAt?: number | undefined;
  reason?: ReportReason | undefined;
  period?: ReportPeriod | undefined;
  partial?: boolean | undefined;
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
  period?: ReportPeriod | null;
};
export type DailyReport = {
  source?: "backfill" | undefined;
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
  const expanded = readings.flatMap((r) =>
    r.parts?.length && r.units !== null
      ? r.parts.map((p) => ({
          ...r,
          resource: p.key,
          scope: "acurast-manager",
          units: p.units,
          usd:
            r.usd !== null && Number(r.units) > 0
              ? (r.usd * Number(p.units)) / Number(r.units)
              : r.usd,
        }))
      : [r],
  );
  const rows = expanded.filter((r) => {
    const k = r.project + ":" + (r.scope ?? "") + ":" + r.resource;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const projects = PROJECT_IDS.flatMap((project) => {
    const projectRows = rows.filter((r) => r.project === project);
    const periods = [
      ...new Set(projectRows.filter((r) => r.units !== null).map((r) => r.period ?? "hkDay")),
    ];
    if (!periods.length && projectRows.length) periods.push("hkDay");
    return periods.map((period, index) => {
      const group = projectRows.filter((r) =>
          r.units !== null ? (r.period ?? "hkDay") === period : index === 0,
        ),
        first = group[0]!,
        anchor = group.find((r) => r.units !== null && /^\d{1,80}$/.test(r.units)) ?? first;
      const decimals = Math.max(
        ...group.filter((r) => r.units !== null).map((r) => r.decimals),
        anchor.decimals,
      );
      let total = 0n,
        known = 0,
        usd = 0,
        priced = 0;
      for (const r of group) {
        if (
          r.units === null ||
          r.currency !== anchor.currency ||
          r.decimals > decimals ||
          r.decimals < 0 ||
          !/^\d{1,80}$/.test(r.units)
        )
          continue;
        total += BigInt(r.units) * 10n ** BigInt(decimals - r.decimals);
        known++;
        if (r.usd !== null && Number.isFinite(r.usd) && r.usd >= 0) {
          usd += r.usd;
          priced++;
        }
      }
      return {
        project,
        name: PROJECTS[project].name,
        currency: anchor.currency,
        amount: known ? decimalUnits(total.toString(), decimals) : null,
        usd: priced && Number.isFinite(usd) ? usd : null,
        known,
        priced,
        total: group.length,
        partial: known < group.length || group.some((r) => r.partial),
        reason:
          known === group.length ? null : (group.find((r) => r.reason)?.reason ?? "unavailable"),
        period: known ? period : null,
      } satisfies ProjectReport;
    });
  });
  const priced = projects.filter((p) => p.usd !== null && countsInEstimate(p.period)),
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
