import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { validBntAddress } from "./bnt";
export const getBntWorkerHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { address: string }) => {
    if (typeof input?.address !== "string" || !validBntAddress(input.address))
      throw new Error("invalid-address");
    return { address: input.address };
  })
  .handler(async ({ context, data }) => {
    const { sampleBntWorkers } = await import("./bnt-worker-history.server");
    return sampleBntWorkers(context.supabase, context.userId, data.address);
  });
