import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { watchDb } from "./watch-db";
import { agentAction, type AgentInfo } from "./device-agent";
const device = z.object({ deviceId: z.string().uuid() }).strict();
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
