import { deviceHistorySchema, deviceEarningsCsv } from "./device-history";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { watchDb } from "./watch-db";
import { fleetSnapshot } from "./fleet-policy";
import {
  bulkInput,
  filterReportProject,
  devicesCsv,
  earningsCsv,
  historySchema,
  monthlyCsv,
  monthInput,
  summarizeMonth,
  proPreferencesInput,
  validateBulkRows,
} from "./pro-tools";
import { FLEET_PROJECTS } from "./fleet";
import { LOCALES } from "./site";
import type { Json } from "@/integrations/supabase/types";
const preferenceSchema = z.object({
  alerts: z.boolean(),
  monthly: z.boolean(),
  locale: z.enum(LOCALES),
  recipient: z.string().email().nullable(),
  eligible: z.boolean(),
});
const safeError = (message: string) =>
  new Error(
    [
      "pro_required",
      "project_device_limit_reached",
      "duplicate_binding",
      "bulk_rate_limit",
      "request_mismatch",
      "device_not_found",
    ].find((c) => message.includes(c)) ?? "pro_tools_unavailable",
  );
export const getProPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await watchDb(context.supabase).rpc("watch_pro_status");
    if (r.error) throw safeError(r.error.message);
    const { reportEmailConfig } = await import("./daily-report-send.server");
    return {
      ...preferenceSchema.parse(r.data),
      configured: !!reportEmailConfig(process.env) && process.env["PRO_TOOLS_ENABLED"] === "true",
    };
  });
export const saveProPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => proPreferencesInput.parse(v))
  .handler(async ({ context, data }) => {
    const { reportEmailConfig } = await import("./daily-report-send.server");
    if (
      (data.alerts || data.monthly) &&
      (!reportEmailConfig(process.env) || process.env["PRO_TOOLS_ENABLED"] !== "true")
    )
      throw new Error("report_not_configured");
    const r = await watchDb(context.supabase).rpc("watch_set_pro_preferences", {
      p_alerts: data.alerts,
      p_monthly: data.monthly,
      p_locale: data.locale,
    });
    if (r.error) throw safeError(r.error.message);
    return { ok: true };
  });
export const getEarningsHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await watchDb(context.supabase).rpc("watch_history_read");
    if (r.error) throw safeError(r.error.message);
    return historySchema.parse(r.data);
  });
export const getDeviceEarningsHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ device: z.string().uuid() }).strict())
  .handler(async ({ context, data }) => {
    const r = await watchDb(context.supabase).rpc("watch_device_history_read", {
      p_device: data.device,
    });
    if (r.error) throw safeError(r.error.message);
    return deviceHistorySchema.parse(r.data);
  });
export const applyBulkDevices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => bulkInput.parse(v))
  .handler(async ({ context, data }) => {
    const db = watchDb(context.supabase);
    const fleet = await db.rpc("watch_list_devices");
    if (fleet.error) throw safeError(fleet.error.message);
    const snapshot = fleetSnapshot(fleet.data);
    if (snapshot.plan !== "pro") throw new Error("pro_required");
    // Validate syntax independently of the current fleet; SQL validates duplicates atomically,
    // allowing a retry with the same request ID after an uncertain response.
    validateBulkRows(data.rows, snapshot.devices, false);
    const r = await db.rpc("watch_bulk_devices", {
      p_request: data.request,
      p_rows: data.rows as unknown as Json,
    });
    if (r.error) throw safeError(r.error.message);
    return fleetSnapshot(r.data);
  });
export const exportReportCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z
      .object({
        kind: z.enum(["devices", "earnings"]),
        month: monthInput.optional(),
        device: z.string().uuid().optional(),
        project: z.enum(FLEET_PROJECTS).optional(),
      })
      .strict(),
  )
  .handler(async ({ context, data }) => {
    const db = watchDb(context.supabase);
    const fleet = await db.rpc("watch_list_devices");
    if (fleet.error) throw safeError(fleet.error.message);
    const snapshot = fleetSnapshot(fleet.data);
    if (data.kind === "devices") {
      if (data.device && !snapshot.devices.some((d) => d.id === data.device))
        throw new Error("device_not_found");
      return {
        filename: "iota-watch-devices.csv",
        csv: devicesCsv(
          data.device ? snapshot.devices.filter((d) => d.id === data.device) : snapshot.devices,
        ),
        empty: false,
      };
    }
    if (data.device) {
      const r = await db.rpc("watch_export_history_read", { p_device: data.device });
      if (r.error) throw safeError(r.error.message);
      const history = deviceHistorySchema.parse(r.data);
      const selected = data.project
        ? history.map((d) => d.report)
        : history.map((d) => d.deviceReport);
      const hasRows = selected.some(
        (d) =>
          (!data.month || d.day.startsWith(data.month + "-")) &&
          d.projects.some((p) => !data.project || p.project === data.project),
      );
      return {
        filename: `iota-watch-device-${data.device}${data.month ? "-" + data.month : ""}.csv`,
        csv: deviceEarningsCsv(history, data.project, data.month),
        empty: !hasRows,
      };
    }
    const r = await db.rpc("watch_export_history_read", { p_device: null });
    if (r.error) throw safeError(r.error.message);
    const history = filterReportProject(historySchema.parse(r.data), data.project);
    const hasRows = history.some(
      (d) => (!data.month || d.day.startsWith(data.month + "-")) && d.projects.length > 0,
    );
    return data.month
      ? {
          filename: `iota-watch-monthly-${data.month}.csv`,
          csv: monthlyCsv(summarizeMonth(history, data.month)),
          empty: !hasRows,
        }
      : {
          filename: "iota-watch-earnings.csv",
          csv: earningsCsv(history),
          empty: !hasRows,
        };
  });
