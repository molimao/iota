import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { watchDb } from "./watch-db";
import { idleXdsConfig, xdsPublicKey, sharedXdsSettings } from "./idle-xds";

export const configureIdleXds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.discriminatedUnion("action", [
      z.object({ action: z.literal("read") }).strict(),
      z.object({ action: z.literal("save"), settings: idleXdsConfig }).strict(),
    ]),
  )
  .handler(async ({ data, context }) => {
    const result = await watchDb(context.supabase).rpc(
      "watch_idle_xds_settings",
      data.action === "save" ? { p_settings: data.settings } : {},
    );
    if (result.error) throw new Error("idle_xds_settings_failed");
    return idleXdsConfig.parse(result.data);
  });

export const configureSharedXds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.discriminatedUnion("action", [
      z.object({ action: z.literal("read") }).strict(),
      z
        .object({
          action: z.literal("save"),
          settings: idleXdsConfig.extend({ consent: z.literal(true) }),
        })
        .strict(),
      z.object({ action: z.literal("backup"), publicKey: xdsPublicKey }).strict(),
    ]),
  )
  .handler(async ({ data, context }) => {
    const result = await watchDb(context.supabase).rpc(
      "watch_xds_wallet_settings",
      data.action === "save"
        ? { p_settings: data.settings }
        : data.action === "backup"
          ? { p_backup_key: data.publicKey }
          : {},
    );
    if (result.error) throw new Error("xds_wallet_settings_failed");
    return sharedXdsSettings.parse(result.data);
  });
