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

export const getIdleBntActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { idleActivitySamples, idleMiningActivity } = await import("./idle-bnt-activity");
    const { readPoolAccount } = await import("./pool-monitor.server");
    const [history, settings] = await Promise.all([
      watchDb(context.supabase).rpc("watch_idle_bnt_activity", {}),
      watchDb(context.supabase).rpc("watch_idle_bnt_settings", {}),
    ]);
    if (history.error || settings.error) throw new Error("idle_activity_unavailable");
    const now = Date.now(),
      config = savedIdleBntConfig.parse(settings.data);
    const activity = idleMiningActivity(idleActivitySamples.parse(history.data), now);
    const reading = config.address ? await readPoolAccount("bnt", config.address) : null;
    return {
      ...activity,
      walletPaid24h:
        reading?.data?.period === "rolling24h" && !reading.error && !reading.stale
          ? reading.data.reward
          : null,
      walletFetchedAt: reading?.fetchedAt ?? null,
      address: config.address,
      checkedAt: now,
    };
  });
