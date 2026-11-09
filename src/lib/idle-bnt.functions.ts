import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { watchDb } from "./watch-db";
import { idleBntConfig, savedIdleBntConfig } from "./idle-bnt";

export const configureIdleBnt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.discriminatedUnion("action", [
      z.object({ action: z.literal("read") }).strict(),
      z.object({ action: z.literal("save"), settings: idleBntConfig }).strict(),
    ]),
  )
  .handler(async ({ data, context }) => {
    const result = await watchDb(context.supabase).rpc(
      "watch_idle_bnt_settings",
      data.action === "save" ? { p_settings: data.settings } : {},
    );
    if (result.error) throw new Error("idle_bnt_settings_failed");
    return savedIdleBntConfig.parse(result.data);
  });
