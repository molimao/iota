import { describe, it, expect } from "vitest";
import type Stripe from "stripe";
import {
  billingConfig,
  assertPrice,
  subscriptionSnapshot,
  billingReturnUrl,
  type BillingConfig,
} from "./billing-policy";
const env = {
  STRIPE_MODE: "test",
  STRIPE_SECRET_KEY: "sk_test_fixture",
  STRIPE_WEBHOOK_SECRET: "whsec_fixture",
  STRIPE_ACCOUNT_ID: "acct_fixture",
  STRIPE_PRICE_MONTHLY: "price_month",
  STRIPE_PRICE_ANNUAL: "price_year",
  STRIPE_PORTAL_CONFIGURATION_ID: "bpc_fixture",
  SITE_ORIGIN: "http://127.0.0.1:8080",
};
const config = billingConfig(env)!;
function price() {
  return {
    id: "price_month",
    active: true,
    livemode: false,
    type: "recurring",
    currency: "usd",
    unit_amount: 299,
    recurring: { interval: "month", interval_count: 1, usage_type: "licensed" },
  } as Stripe.Price;
}
describe("billing boundaries", () => {
  it("disables real collection until explicitly configured and cannot mix modes", () => {
    expect(billingConfig({})).toBeNull();
    expect(
      billingConfig({ ...env, STRIPE_MODE: "live", STRIPE_SECRET_KEY: "sk_live_fixture" }),
    ).toBeNull();
    expect(billingConfig({ ...env, STRIPE_MODE: "live", STRIPE_LIVE_ENABLED: "true" })).toBeNull();
    expect(billingConfig({ ...env, SITE_ORIGIN: "http://untrusted.example" })).toBeNull();
    expect(config.mode).toBe("test");
    expect(billingConfig({ ...env, STRIPE_SECRET_KEY: "rk_test_fixture" })?.mode).toBe("test");
    expect(billingConfig({ ...env, STRIPE_SECRET_KEY: "rk_live_fixture" })).toBeNull();
  });
  it("rejects another price, currency, cadence or test/live catalog", () => {
    expect(() => assertPrice(price(), "month", config)).not.toThrow();
    for (const override of [
      { unit_amount: 490 },
      { currency: "eur" },
      { livemode: true },
      { recurring: { interval: "year", interval_count: 1, usage_type: "licensed" } },
    ])
      expect(() =>
        assertPrice({ ...price(), ...override } as Stripe.Price, "month", config),
      ).toThrow("billing_price_mismatch");
  });
  it("ties subscription to the authenticated account, configured price and one seat", () => {
    const sub = {
      id: "sub_fixture",
      customer: "cus_fixture",
      livemode: false,
      metadata: { product: "iota_watch_pro", user_id: "11111111-1111-4111-8111-111111111111" },
      status: "active",
      cancel_at_period_end: true,
      items: {
        data: [{ quantity: 1, price: { id: "price_month" }, current_period_end: 1800000000 }],
      },
    } as unknown as Stripe.Subscription;
    expect(subscriptionSnapshot(sub, config)).toMatchObject({
      status: "active",
      customer: "cus_fixture",
      cancel: true,
      end: "2027-01-15T08:00:00.000Z",
    });
    expect(() => subscriptionSnapshot({ ...sub, livemode: true }, config)).toThrow();
    expect(() =>
      subscriptionSnapshot({ ...sub, metadata: { product: "iota_watch_pro" } }, config),
    ).toThrow();
  });
  it("builds return links from trusted origin, never client URLs", () => {
    expect(billingReturnUrl(config, "zh", "success")).toBe(
      "http://127.0.0.1:8080/zh/devices?billing=success",
    );
    expect(() => billingReturnUrl(config, "https://evil.example")).toThrow("invalid_locale");
    expect(
      billingReturnUrl({ ...config, origin: "https://iotahome.site" } as BillingConfig, "ko"),
    ).toBe("https://iotahome.site/ko/devices");
  });
});

it("preserves approved legacy subscriptions while new checkout rejects the old amount", () => {
  const legacy = billingConfig({
    ...env,
    STRIPE_LEGACY_PRICE_IDS: "price_old_month,price_old_year",
  })!;
  const sub = {
    id: "sub_old",
    customer: "cus_old",
    livemode: false,
    metadata: { product: "iota_watch_pro", user_id: "11111111-1111-4111-8111-111111111111" },
    status: "active",
    cancel_at_period_end: false,
    items: {
      data: [{ quantity: 1, price: { id: "price_old_year" }, current_period_end: 1800000000 }],
    },
  } as unknown as Stripe.Subscription;
  expect(subscriptionSnapshot(sub, legacy).status).toBe("active");
  expect(() => subscriptionSnapshot(sub, config)).toThrow("billing_subscription_mismatch");
  expect(() => assertPrice({ ...price(), unit_amount: 290 }, "month", legacy)).toThrow(
    "billing_price_mismatch",
  );
  expect(billingConfig({ ...env, STRIPE_LEGACY_PRICE_IDS: "https://wrong.example" })).toBeNull();
});
