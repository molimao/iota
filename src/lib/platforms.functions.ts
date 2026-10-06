import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { validPlatformId } from "./platforms";
const privateProject = z.enum(["ionet", "vast"]);
const node = z
  .object({ project: privateProject, id: z.string().max(100) })
  .refine((v) => validPlatformId(v.project, v.id));
export const getPublicPlatform = createServerFn({ method: "POST" })
  .inputValidator(
    z
      .object({ project: z.enum(["akash", "golem"]), id: z.string().max(100) })
      .refine((v) => validPlatformId(v.project, v.id)),
  )
  .handler(async ({ data }) => {
    const { publicPlatform } = await import("./platforms.server");
    return publicPlatform(data.project, data.id);
  });
export const getPrivatePlatform = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(node)
  .handler(async ({ data, context }) => {
    const { privatePlatform } = await import("./platforms.server");
    return privatePlatform(context.userId, data.project, data.id);
  });
export const getConnectionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ project: privateProject }))
  .handler(async ({ data, context }) => {
    const { connectionStatus } = await import("./platforms.server");
    return connectionStatus(context.userId, data.project);
  });
export const connectPlatform = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z
      .object({
        project: privateProject,
        id: z.string().max(100),
        token: z
          .string()
          .min(16)
          .max(8192)
          .regex(/^[\x21-\x7e]+$/),
      })
      .refine((v) => validPlatformId(v.project, v.id)),
  )
  .handler(async ({ data, context }) => {
    const { saveConnection } = await import("./platforms.server");
    return saveConnection(context.userId, data.project, data.token, data.id);
  });
export const disconnectPlatform = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ project: privateProject }))
  .handler(async ({ data, context }) => {
    const { removeConnection } = await import("./platforms.server");
    return removeConnection(context.userId, data.project);
  });
