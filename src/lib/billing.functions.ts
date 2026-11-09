import { IDLE_MINING_SOURCE } from "./checkout-intent";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LOCALES } from "./site";

export const getBilling = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { readBilling } = await import("./billing.server");
    return readBilling(context.userId);
  });
export const startCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (value: { interval: "month" | "year"; locale: string; source?: typeof IDLE_MINING_SOURCE }) =>
      z
        .object({
          interval: z.enum(["month", "year"]),
          locale: z.enum(LOCALES),
          source: z.literal(IDLE_MINING_SOURCE).optional(),
        })
        .parse(value),
  )
  .handler(async ({ context, data }) => {
    const { checkout } = await import("./billing.server");
    return checkout(context.userId, data.interval, data.locale, data.source);
  });
export const openBillingPortal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((value: { locale: string }) => z.object({ locale: z.enum(LOCALES) }).parse(value))
  .handler(async ({ context, data }) => {
    const { portal } = await import("./billing.server");
    return portal(context.userId, data.locale);
  });
