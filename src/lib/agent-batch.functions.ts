import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { agentBatchSchema } from "./agent-batch";
import { AGENT_RELEASE, agentAction } from "./device-agent";

export const getAgentBatches = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await context.supabase.rpc(
      "watch_agent_batch" as never,
      { p_action: "list" } as never,
    );
    if (r.error) throw new Error("batch_unavailable");
    return agentBatchSchema.parse(r.data);
  });
export const restartAgentBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z
      .object({ id: z.string().uuid(), deviceIds: z.array(z.string().uuid()).min(1).max(50) })
      .strict(),
  )
  .handler(async ({ data, context }) => {
    const r = await context.supabase.rpc(
      "watch_agent_batch" as never,
      {
        p_action: "restart",
        p_id: data.id,
        p_devices: data.deviceIds,
      } as never,
    );
    if (r.error) throw new Error("batch_failed");
    return agentBatchSchema.parse(r.data);
  });
export const submitAgentBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z
      .object({
        id: z.string().uuid(),
        deviceIds: z.array(z.string().uuid()).min(1).max(50),
        action: agentAction,
      })
      .strict(),
  )
  .handler(async ({ data, context }) => {
    const r = await context.supabase.rpc(
      "watch_agent_batch" as never,
      {
        p_action: data.action,
        p_id: data.id,
        p_devices: data.deviceIds,
        ...(data.action === "update" ? { p_target_version: AGENT_RELEASE } : {}),
      } as never,
    );
    if (r.error) throw new Error("batch_failed");
    return agentBatchSchema.parse(r.data);
  });
