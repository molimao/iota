import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { watchDb } from "./watch-db";
import { agentAction, agentHistoryPointSchema, type AgentInfo } from "./device-agent";
const device = z.object({ deviceId: z.string().uuid() }).strict();
export const linkBntWorkerAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z
      .object({
        bindingId: z.string().uuid(),
        worker: z.string().trim().min(1).max(80),
        deviceId: z.string().uuid(),
      })
      .strict(),
  )
  .handler(async ({ data, context }) => {
    const result = await watchDb(context.supabase).rpc("watch_link_bnt_worker_agent", {
      p_binding: data.bindingId,
      p_worker: data.worker,
      p_device: data.deviceId,
    });
    if (result.error)
      throw new Error(
        result.error.message.includes("project_device_limit_reached")
          ? "project_device_limit_reached"
          : "agent_link_failed",
      );
    return { ok: true };
  });
export const linkPrlWorkerAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z
      .object({
        bindingId: z.string().uuid(),
        worker: z.string().trim().min(1).max(80),
        deviceId: z.string().uuid(),
      })
      .strict(),
  )
  .handler(async ({ data, context }) => {
    const result = await watchDb(context.supabase).rpc("watch_link_prl_worker_agent", {
      p_binding: data.bindingId,
      p_worker: data.worker,
      p_device: data.deviceId,
    });
    if (result.error)
      throw new Error(
        result.error.message.includes("project_device_limit_reached")
          ? "project_device_limit_reached"
          : "agent_link_failed",
      );
    return { ok: true };
  });
export const linkProjectAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ bindingId: z.string().uuid(), deviceId: z.string().uuid() }).strict())
  .handler(async ({ data, context }) => {
    const result = await watchDb(context.supabase).rpc("watch_link_project_agent", {
      p_binding: data.bindingId,
      p_device: data.deviceId,
    });
    if (result.error) throw new Error("agent_link_failed");
    return { ok: true };
  });
export const getDeviceAgents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await watchDb(context.supabase).rpc("watch_agent_owner", { p_action: "list" });
    if (r.error) throw new Error("agent_not_configured");
    return r.data as unknown as AgentInfo[];
  });
export const pairDeviceAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(device)
  .handler(async ({ data, context }) => {
    const { randomBytes, createHash } = await import("node:crypto");
    const token = randomBytes(32).toString("base64url");
    const r = await watchDb(context.supabase).rpc("watch_agent_owner", {
      p_action: "pair",
      p_device: data.deviceId,
      p_payload: { hash: createHash("sha256").update(token).digest("hex") },
    });
    if (r.error) throw new Error("pair_failed");
    return { token, expiresAt: Date.now() + 600000 };
  });
export const deviceAgentCommand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(device.extend({ action: agentAction }).strict())
  .handler(async ({ data, context }) => {
    const r = await watchDb(context.supabase).rpc("watch_agent_owner", {
      p_action: data.action,
      p_device: data.deviceId,
    });
    if (r.error) throw new Error("command_failed");
    return { ok: true };
  });
export const setDeviceAgentOptions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(device.extend({ logs: z.boolean(), recovery: z.boolean() }).strict())
  .handler(async ({ data, context }) => {
    const r = await watchDb(context.supabase).rpc("watch_agent_owner", {
      p_action: "settings",
      p_device: data.deviceId,
      p_payload: { logs: data.logs, recovery: data.recovery },
    });
    if (r.error) throw new Error("settings_failed");
    return { ok: true };
  });
export const revokeDeviceAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(device)
  .handler(async ({ data, context }) => {
    const r = await watchDb(context.supabase).rpc("watch_agent_owner", {
      p_action: "revoke",
      p_device: data.deviceId,
    });
    if (r.error) throw new Error("revoke_failed");
    return { ok: true };
  });

export const getAgentHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(device)
  .handler(async ({ data, context }) => {
    const r = await watchDb(context.supabase).rpc("watch_read_agent_history", {
      p_device: data.deviceId,
    });
    if (r.error) throw new Error("agent_history_unavailable");
    return z.array(agentHistoryPointSchema).max(289).parse(r.data);
  });

export const getAgentCrashAnalyses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(device.extend({ locale: z.enum(["zh", "zh-TW", "en", "ko", "ja"]) }).strict())
  .handler(async ({ data, context }) => {
    const r = await watchDb(context.supabase).rpc("watch_agent_analysis_read", {
      p_device: data.deviceId,
      p_locale: data.locale,
    });
    if (r.error) throw new Error("agent_analysis_unavailable");
    const { agentAnalysisState } = await import("./agent-crash-analysis");
    return agentAnalysisState.parse(r.data);
  });

export const setAgentAnalysisLocale = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ locale: z.enum(["zh", "zh-TW", "en", "ko", "ja"]) }).strict())
  .handler(async ({ data, context }) => {
    const r = await watchDb(context.supabase).rpc("watch_agent_analysis_locale", {
      p_locale: data.locale,
    });
    if (r.error) throw new Error("agent_analysis_unavailable");
    return { ok: true };
  });
