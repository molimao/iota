import { z } from "zod";
import type Stripe from "stripe";
import { PLANS } from "./plans";
import { isLocale } from "./site";

export type BillingConfig = {
  mode: "test" | "live";
  secret: string;
  webhookSecret: string;
  account: string;
  monthPrice: string;
  yearPrice: string;
  legacyPrices?: readonly string[];
  portal: string;
  origin: string;
};
export function billingConfig(
  env: Record<string, string | undefined>,
): BillingConfig | null {
  const mode = env["STRIPE_MODE"];
  if (mode !== "test" && mode !== "live") return null;
  if (mode === "live" && env["STRIPE_LIVE_ENABLED"] !== "true") return null;
  const values = [
    env["STRIPE_SECRET_KEY"],
    env["STRIPE_WEBHOOK_SECRET"],
    env["STRIPE_ACCOUNT_ID"],
    env["STRIPE_PRICE_MONTHLY"],
    env["STRIPE_PRICE_ANNUAL"],
    env["STRIPE_PORTAL_CONFIGURATION_ID"],
    env["SITE_ORIGIN"],
  ];
  if (values.some((value) => !value)) return null;
  const [
    secret,
    webhookSecret,
    account,
    monthPrice,
    yearPrice,
    portal,
    origin,
  ] = values as [string, string, string, string, string, string, string];
  if (
    !(secret.startsWith(`sk_${mode}_`) || secret.startsWith(`rk_${mode}_`)) ||
    !webhookSecret.startsWith("whsec_") ||
    !account.startsWith("acct_") ||
    !portal.startsWith("bpc_")
  )
    return null;
  const legacyPrices = (env["STRIPE_LEGACY_PRICE_IDS"] ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (
    legacyPrices.length > 10 ||
    legacyPrices.some((p) => !/^price_[A-Za-z0-9_]+$/.test(p))
  )
    return null;
  try {
    const url = new URL(origin);
    if (
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      (url.protocol !== "https:" &&
        !(
          mode === "test" &&
          url.protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(url.hostname)
        ))
    )
      return null;
    return {
      mode,
      secret,
      webhookSecret,
      account,
      monthPrice,
      yearPrice,
      legacyPrices,
      portal,
      origin: url.origin,
    };
  } catch {
    return null;
  }
}
export function assertPrice(
  price: Stripe.Price,
  interval: "month" | "year",
  config: BillingConfig,
) {
  if (
    !price.active ||
    price.livemode !== (config.mode === "live") ||
    price.currency !== PLANS.pro.currency ||
    price.type !== "recurring" ||
    price.unit_amount !==
      (interval === "month" ? PLANS.pro.monthlyCents : PLANS.pro.annualCents) ||
    price.recurring?.interval !== interval ||
    price.recurring.interval_count !== 1 ||
    price.recurring.usage_type !== "licensed"
  )
    throw new Error("billing_price_mismatch");
}
export function subscriptionSnapshot(
  subscription: Stripe.Subscription,
  config: BillingConfig,
) {
  const customer =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const items = subscription.items.data;
  if (
    subscription.livemode !== (config.mode === "live") ||
    subscription.metadata["product"] !== "iota_watch_pro" ||
    items.length !== 1 ||
    items[0]?.quantity !== 1 ||
    ![
      config.monthPrice,
      config.yearPrice,
      ...(config.legacyPrices ?? []),
    ].includes(items[0].price.id)
  )
    throw new Error("billing_subscription_mismatch");
  const user = z.string().uuid().parse(subscription.metadata["user_id"]);
  const end = items[0].current_period_end;
  if (!Number.isSafeInteger(end) || end <= 0)
    throw new Error("billing_period_invalid");
  return {
    user,
    customer,
    subscription: subscription.id,
    status: subscription.status,
    end: new Date(end * 1000).toISOString(),
    cancel: subscription.cancel_at_period_end,
  };
}
export function billingReturnUrl(
  config: BillingConfig,
  locale: string,
  result?: "success" | "cancel",
) {
  if (!isLocale(locale)) throw new Error("invalid_locale");
  const url = new URL(`/${locale}/devices`, config.origin);
  if (result) url.searchParams.set("billing", result);
  return url.toString();
}
