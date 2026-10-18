import { z } from "zod";
import {
  FLEET_PROJECTS,
  bindingIdentity,
  validBinding,
  type FleetDevice,
  type FleetProject,
} from "./fleet";
import { LOCALES } from "./site";
import { reportDayWindow, type DailyReport } from "./daily-report";

const clean = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(
      (v) =>
        v.length <= max && ![...v].some((c) => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127),
      "invalid_text",
    );
export const bulkRowSchema = z
  .object({
    device_key: z
      .string()
      .trim()
      .max(40)
      .regex(/^[A-Za-z0-9_-]*$/),
    device_id: z.union([z.literal(""), z.string().uuid()]),
    name: clean(40).refine((v) => v.length > 0),
    hardware: clean(100),
    project: z.union([z.literal(""), z.enum(FLEET_PROJECTS)]),
    identifier: clean(100),
    worker: clean(80),
  })
  .strict()
  .superRefine((v, c) => {
    if (!v.device_id && !v.device_key)
      c.addIssue({ code: "custom", message: "device_key_required" });
    if (
      v.project
        ? !validBinding(v.project, v.identifier)
        : !v.device_id || !!v.identifier || !!v.worker
    )
      c.addIssue({ code: "custom", message: "invalid_binding" });
    if (v.worker && v.project !== "xid") c.addIssue({ code: "custom", message: "invalid_worker" });
  });
export type BulkRow = z.infer<typeof bulkRowSchema>;
export const bulkInput = z
  .object({ request: z.string().uuid(), rows: z.array(bulkRowSchema).min(1).max(100) })
  .strict();
export const proPreferencesInput = z
  .object({ alerts: z.boolean(), monthly: z.boolean(), locale: z.enum(LOCALES) })
  .strict();
export type ProPreferences = {
  alerts: boolean;
  monthly: boolean;
  locale: (typeof LOCALES)[number];
  recipient: string | null;
  eligible: boolean;
  configured: boolean;
};
export function proPreferencePayload(value: Pick<ProPreferences, "alerts" | "monthly" | "locale">) {
  return { alerts: value.alerts, monthly: value.monthly, locale: value.locale };
}
export function earningsTrendValue(
  report: DailyReport | undefined,
  native: boolean,
): number | null {
  const value = native ? report?.projects[0]?.amount : report?.usdSubtotal;
  return value !== null && value !== undefined && Number.isFinite(Number(value))
    ? Number(value)
    : null;
}
/** Prefer an explicitly labeled native project when historical USD prices are
 * absent; never replace old prices with the current market quote. */
export function preferredEarningsProject(history: DailyReport[]): FleetProject | "all" {
  const usdDays = new Set(history.filter((r) => r.usdSubtotal !== null).map((r) => r.day)).size;
  const candidates = FLEET_PROJECTS.map((project) => ({
    project,
    days: new Set(
      history
        .filter((r) => r.projects.some((p) => p.project === project && p.amount !== null))
        .map((r) => r.day),
    ).size,
  })).sort((a, b) => b.days - a.days);
  const best = candidates[0];
  return best && best.days > 1 && best.days > usdDays ? best.project : "all";
}
export function preferredEarningsDays(
  history: DailyReport[],
  project: FleetProject | "all",
  now = Date.now(),
) {
  const end = new Date(now + 28800000).toISOString().slice(0, 10),
    endMs = Date.parse(end + "T00:00:00Z");
  const count = (days: number) =>
    new Set(
      history
        .filter((r) => {
          const value =
            project === "all"
              ? r.usdSubtotal
              : r.projects.find((p) => p.project === project)?.amount;
          return (
            r.day < end &&
            Date.parse(r.day + "T00:00:00Z") >= endMs - days * 86400000 &&
            value !== null &&
            value !== undefined &&
            Number.isFinite(Number(value))
          );
        })
        .map((r) => r.day),
    ).size;
  return count(30) < 2 && count(90) >= 2 ? 90 : 30;
}
export const projectReportSchema = z.object({
  project: z.enum(FLEET_PROJECTS),
  name: clean(80),
  currency: clean(20),
  amount: z
    .string()
    .regex(/^\d{1,80}(\.\d{1,18})?$/)
    .nullable(),
  usd: z.number().finite().nonnegative().nullable(),
  known: z.number().int().nonnegative(),
  priced: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  partial: z.boolean(),
  reason: z.enum(["unavailable", "unsupported", "different_period", "connect_required"]).nullable(),
});
export const dailySnapshotSchema = z
  .object({
    source: z.literal("backfill").optional(),
    day: z.string().refine((v) => {
      try {
        reportDayWindow(v);
        return true;
      } catch {
        return false;
      }
    }),
    generatedAt: z.string().datetime(),
    valuationAt: z.string().datetime().optional(),
    locale: z.enum(LOCALES),
    deviceCount: z.number().int().nonnegative(),
    projects: z.array(projectReportSchema).max(FLEET_PROJECTS.length),
    usdSubtotal: z.number().finite().nonnegative().nullable(),
    partial: z.boolean(),
  })
  .transform((v): DailyReport => {
    const { valuationAt, ...rest } = v;
    return { ...rest, ...(valuationAt ? { valuationAt } : {}) };
  });
export const historySchema = z.array(dailySnapshotSchema).max(92);
export function filterReportProject(
  history: DailyReport[],
  project?: (typeof FLEET_PROJECTS)[number],
) {
  if (!project) return history;
  return history.map((d) => {
    const p = d.projects.find((p) => p.project === project);
    return {
      ...d,
      projects: p ? [p] : [],
      usdSubtotal: p?.usd ?? null,
      partial: p ? p.partial || p.priced < p.total : true,
    };
  });
}
export const monthInput = z
  .string()
  .regex(/^\d{4}-\d{2}$/)
  .refine((v) => Number(v.slice(5)) >= 1 && Number(v.slice(5)) <= 12);
export function previousMonth(now = Date.now()) {
  const d = new Date(now + 28800000);
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - 1);
  return d.toISOString().slice(0, 7);
}
export function sumNativeAmounts(values: string[]): string | null {
  if (!values.length) return null;
  const total = values.reduce((sum, value) => {
    if (!/^\d{1,80}(\.\d{1,18})?$/.test(value)) throw new Error("invalid_amount");
    const [whole, fraction = ""] = value.split(".");
    return sum + BigInt(whole! + fraction.padEnd(18, "0"));
  }, 0n);
  const fraction = (total % 10n ** 18n).toString().padStart(18, "0").replace(/0+$/, "");
  return (total / 10n ** 18n).toString() + (fraction ? "." + fraction : "");
}
export function summarizeMonth(history: DailyReport[], month: string) {
  monthInput.parse(month);
  const days = [
    ...new Map(
      history.filter((r) => r.day.startsWith(month + "-")).map((r) => [r.day, r]),
    ).values(),
  ].sort((a, b) => a.day.localeCompare(b.day));
  const expected = new Date(
    Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5)), 0),
  ).getUTCDate();
  const projects = FLEET_PROJECTS.flatMap((project) => {
    const rows = days.flatMap((d) => d.projects.filter((p) => p.project === project));
    if (!rows.length) return [];
    const currencies = new Set(rows.map((r) => r.currency));
    const known = rows.filter((r) => r.amount !== null);
    const amount = sumNativeAmounts(known.map((r) => r.amount!));
    const priced = rows.filter((r) => r.usd !== null);
    const usd = priced.reduce((n, r) => n + r.usd!, 0);
    return [
      {
        project,
        name: rows[0]!.name,
        currency: rows[0]!.currency,
        amount: known.length && currencies.size === 1 ? amount : null,
        usd: priced.length && Number.isFinite(usd) ? usd : null,
        days: known.length,
        partial:
          rows.some((r) => r.partial || r.priced < r.total) ||
          known.length < expected ||
          priced.length < expected,
        pricedDays: priced.length,
      },
    ];
  });
  const priced = days.filter((d) => d.usdSubtotal !== null);
  const total = priced.reduce((n, d) => n + d.usdSubtotal!, 0);
  return {
    month,
    days: days.length,
    expected,
    projects,
    usdSubtotal: priced.length && Number.isFinite(total) ? total : null,
    partial: days.length < expected || days.some((d) => d.partial),
  };
}
export const BULK_HEADERS = [
  "device_key",
  "device_id",
  "name",
  "hardware",
  "project",
  "identifier",
  "worker",
] as const;
/** RFC-style quoted CSV, bounded before parsing; no eval, HTML or credential columns. */
export function parseBulkCsv(source: string): BulkRow[] {
  if (source.length > 100000) throw new Error("bulk_too_large");
  const text = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false,
    ended = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
          ended = true;
        }
      } else cell += c;
    } else if (c === '"' && !cell && !ended) quoted = true;
    else if (c === "," || c === "\n") {
      row.push(cell);
      cell = "";
      ended = false;
      if (c === "\n") {
        if (row.some(Boolean)) rows.push(row);
        row = [];
      }
    } else {
      if (ended) throw new Error("invalid_csv");
      cell += c;
    }
    if (rows.length > 101) throw new Error("bulk_too_large");
  }
  if (quoted) throw new Error("invalid_csv");
  row.push(cell);
  if (row.some(Boolean)) rows.push(row);
  if (rows.shift()?.join(",") !== BULK_HEADERS.join(",")) throw new Error("invalid_csv_headers");
  return z
    .array(bulkRowSchema)
    .min(1)
    .max(100)
    .parse(
      rows.map((r) => {
        if (r.length !== 7) throw new Error("invalid_csv");
        return Object.fromEntries(BULK_HEADERS.map((k, i) => [k, r[i]]));
      }),
    );
}
export function validateBulkRows(rows: BulkRow[], devices: FleetDevice[], includeCurrent = true) {
  const identities = new Set(
    includeCurrent ? devices.flatMap((d) => d.bindings.map(bindingIdentity)) : [],
  );
  const keys = new Map<string, string>();
  for (const r of rows) {
    bulkRowSchema.parse(r);
    if (r.device_id && !devices.some((d) => d.id === r.device_id))
      throw new Error("missing_device");
    if (!r.device_id) {
      const label = JSON.stringify([r.name, r.hardware]);
      if (keys.has(r.device_key) && keys.get(r.device_key) !== label)
        throw new Error("inconsistent_device");
      keys.set(r.device_key, label);
    }
    if (r.project) {
      const id = bindingIdentity({
        project: r.project,
        identifier: r.identifier,
        worker: r.worker,
      });
      if (identities.has(id)) throw new Error("duplicate_binding");
      identities.add(id);
    }
  }
  return {
    created: keys.size,
    linked: rows.filter((r) => r.project).length,
    renamed: rows.filter((r) => !r.project).length,
  };
}
/** Neutralize spreadsheet formulas, including whitespace-prefixed forms. */
export function csvCell(v: unknown) {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[\s\uFEFF]*[=+\-@]/.test(s) || /^[\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}
export const csvDocument = (rows: readonly (readonly unknown[])[]) =>
  "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
export function devicesCsv(devices: FleetDevice[]) {
  return csvDocument([
    ["device_id", "name", "hardware", "project", "identifier", "worker"],
    ...devices.flatMap((d) =>
      d.bindings.length
        ? d.bindings.map((b) => [d.id, d.name, d.hardware, b.project, b.identifier, b.worker])
        : [[d.id, d.name, d.hardware, "", "", ""]],
    ),
  ]);
}
export function earningsCsv(history: DailyReport[]) {
  return csvDocument([
    [
      "beijing_day",
      "project",
      "amount",
      "currency",
      "usd_estimate",
      "partial",
      "usd_partial",
      "priced_resources",
      "known_resources",
      "total_resources",
      "reason",
      "collected_at",
      "valuation_at",
    ],
    ...history.flatMap((d) =>
      d.projects.map((p) => [
        d.day,
        p.project,
        p.amount,
        p.currency,
        p.usd,
        p.partial,
        p.priced < p.total,
        p.priced,
        p.known,
        p.total,
        p.reason,
        d.generatedAt,
        d.valuationAt ?? "",
      ]),
    ),
  ]);
}
export function monthlyCsv(report: ReturnType<typeof summarizeMonth>) {
  return csvDocument([
    [
      "beijing_month",
      "project",
      "amount",
      "currency",
      "usd_estimate",
      "recorded_days",
      "expected_days",
      "priced_days",
      "partial",
    ],
    ...report.projects.map((p) => [
      report.month,
      p.project,
      p.amount,
      p.currency,
      p.usd,
      p.days,
      report.expected,
      p.pricedDays,
      p.partial,
    ]),
  ]);
}
export function bulkTemplate() {
  return csvDocument([
    BULK_HEADERS,
    ["machine_1", "", "My Mac", "Mac mini", "iota", "YOUR_PUBLIC_MINER_ID", ""],
  ]);
}
