import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { watchDb } from "./watch-db";
import { reportPreferenceInput, nextReportAt } from "./daily-report";
import { isLocale } from "./site";
export const getReportPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await watchDb(context.supabase).rpc("watch_report_status");
    if (r.error || !r.data || typeof r.data !== "object" || Array.isArray(r.data))
      throw new Error("report_unavailable");
    const p = r.data;
    const { reportEmailConfig } = await import("./daily-report-send.server");
    const now = Date.now(),
      enabledAt = typeof p["enabledAt"] === "string" ? Date.parse(p["enabledAt"]) : now;
    const next = Math.max(
      nextReportAt(now),
      new Date(
        new Date(enabledAt + 28800000).toISOString().slice(0, 10) + "T09:30:00+08:00",
      ).getTime() + 86400000,
    );
    return {
      enabled: p["enabled"] === true,
      recipient: typeof p["recipient"] === "string" ? p["recipient"] : null,
      eligible: p["eligible"] === true,
      emailChanged: p["emailChanged"] === true,
      lastSentAt: typeof p["lastSentAt"] === "string" ? p["lastSentAt"] : null,
      locale: isLocale(typeof p["locale"] === "string" ? p["locale"] : undefined)
        ? p["locale"]
        : "zh",
      configured: !!reportEmailConfig(process.env),
      nextAt: next,
    };
  });
export const setReportPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => reportPreferenceInput.parse(input))
  .handler(async ({ context, data }) => {
    const { reportEmailConfig } = await import("./daily-report-send.server");
    if (data.enabled && !reportEmailConfig(process.env)) throw new Error("report_not_configured");
    const r = await watchDb(context.supabase).rpc("watch_set_report_preferences", {
      p_enabled: data.enabled,
      p_locale: data.locale,
    });
    if (r.error)
      throw new Error(
        r.error.message.includes("pro_required") ? "pro_required" : "report_save_failed",
      );
    return { ok: true };
  });
