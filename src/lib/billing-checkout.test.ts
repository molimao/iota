import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const store = vi.hoisted(() => ({
  row: null as Record<string, unknown> | null,
  rpc: vi.fn(),
  query: vi.fn(),
}));
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    rpc: store.rpc,
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: store.query }) }) }),
  },
}));
import { checkout } from "./billing.server";
const user = "11111111-1111-4111-8111-111111111111";
const token = "22222222-2222-4222-8222-222222222222";
let calls: { path: string; method: string; body: URLSearchParams; key: string | null }[];
let subscription: Record<string, unknown> | null;
let wrongPrice: boolean;
let allowQuantity: boolean;
beforeEach(() => {
  store.row = null;
  subscription = null;
  wrongPrice = false;
  allowQuantity = false;
  calls = [];
  for (const [key, value] of Object.entries({
    STRIPE_MODE: "test",
    STRIPE_SECRET_KEY: "rk_test_fixture",
    STRIPE_WEBHOOK_SECRET: "whsec_fixture",
    STRIPE_ACCOUNT_ID: "acct_fixture",
    STRIPE_PRICE_MONTHLY: "price_month",
    STRIPE_PRICE_ANNUAL: "price_year",
    STRIPE_PORTAL_CONFIGURATION_ID: "bpc_fixture",
    SITE_ORIGIN: "http://127.0.0.1:8080",
  }))
    vi.stubEnv(key, value);
  store.query.mockReset().mockImplementation(async () => ({ data: store.row, error: null }));
  store.rpc.mockReset().mockImplementation(async (name, args) => {
    if (name === "watch_reserve_checkout")
      return {
        data: {
          token,
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
          session: store.row?.["checkout_session"] ?? null,
          locale: store.row?.["checkout_locale"] ?? args.p_locale,
        },
        error: null,
      };
    if (name === "watch_release_checkout")
      store.row = { ...store.row, checkout_session: null, checkout_token: null };
    return { data: null, error: null };
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input, init) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      const headers = new Headers(init?.headers);
      calls.push({
        path: url.pathname,
        method: init?.method ?? "GET",
        body: new URLSearchParams(init?.body as string),
        key: headers.get("idempotency-key"),
      });
      let data: unknown;
      if (url.pathname === "/v1/account") data = { id: "acct_fixture", charges_enabled: false };
      else if (url.pathname.startsWith("/v1/prices/")) {
        const yearly = url.pathname.endsWith("price_year");
        data = {
          id: yearly ? "price_year" : "price_month",
          active: true,
          livemode: false,
          type: "recurring",
          currency: "usd",
          unit_amount: wrongPrice ? 490 : yearly ? 1690 : 290,
          product: "prod_fixture",
          recurring: {
            interval: yearly ? "year" : "month",
            interval_count: 1,
            usage_type: "licensed",
          },
        };
      } else if (url.pathname === "/v1/billing_portal/configurations/bpc_fixture")
        data = {
          active: true,
          features: {
            subscription_cancel: { enabled: true, mode: "at_period_end" },
            subscription_update: {
              enabled: allowQuantity,
              default_allowed_updates: allowQuantity ? ["quantity"] : [],
            },
          },
        };
      else if (url.pathname === "/v1/customers") data = { id: "cus_fixture" };
      else if (url.pathname === "/v1/subscriptions")
        data = { data: subscription ? [subscription] : [], has_more: false };
      else if (url.pathname === "/v1/subscriptions/sub_fixture") data = subscription;
      else if (url.pathname === "/v1/billing_portal/sessions")
        data = { url: "https://billing.stripe.com/p/session/fixture" };
      else if (url.pathname.endsWith("/expire")) data = { id: "cs_previous", status: "expired" };
      else if (url.pathname.startsWith("/v1/checkout/sessions/"))
        data = {
          id: "cs_previous",
          status: "open",
          url: "https://checkout.stripe.com/c/pay/cs_previous",
        };
      else if (url.pathname === "/v1/checkout/sessions")
        data = { id: "cs_fixture", url: "https://checkout.stripe.com/c/pay/cs_fixture" };
      else throw new Error("Unexpected Stripe endpoint: " + url.pathname);
      return new Response(JSON.stringify(data), {
        headers: { "content-type": "application/json" },
      });
    }),
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("Stripe SDK checkout orchestration (simulated network)", () => {
  it("uses the confirmed annual price, authenticated user and fixed return origin", async () => {
    expect((await checkout(user, "year", "zh")).url).toContain("checkout.stripe.com");
    const request = calls.find((c) => c.path === "/v1/checkout/sessions")!;
    expect(request.body.get("line_items[0][price]")).toBe("price_year");
    expect(request.body.get("line_items[0][quantity]")).toBe("1");
    expect(request.body.get("subscription_data[metadata][user_id]")).toBe(user);
    expect(request.body.get("success_url")).toBe(
      "http://127.0.0.1:8080/zh/devices?billing=success",
    );
    expect(request.key).toBe("watch-checkout:" + token);
    expect(calls.find((c) => c.path === "/v1/customers")?.key).toBe("watch-customer:" + user);
    expect(store.rpc).toHaveBeenCalledWith("watch_finish_checkout", {
      p_user: user,
      p_token: token,
      p_session: "cs_fixture",
    });
  });
  it("reuses an open checkout across retries instead of creating a second payment", async () => {
    store.row = {
      stripe_customer: "cus_fixture",
      checkout_session: "cs_previous",
      checkout_token: token,
      checkout_interval: "month",
      checkout_locale: "zh",
      checkout_expires_at: new Date(Date.now() + 3600000).toISOString(),
    };
    expect((await checkout(user, "month", "en")).url).toContain("cs_previous");
    expect(calls.filter((c) => c.path === "/v1/checkout/sessions")).toHaveLength(0);
  });
  it("expires a previous unpaid session before switching month to year", async () => {
    store.row = {
      stripe_customer: "cus_fixture",
      checkout_session: "cs_previous",
      checkout_token: token,
      checkout_interval: "month",
      checkout_locale: "zh",
      checkout_expires_at: new Date(Date.now() + 3600000).toISOString(),
    };
    await checkout(user, "year", "zh");
    expect(calls.findIndex((c) => c.path.endsWith("/expire"))).toBeLessThan(
      calls.findIndex((c) => c.path === "/v1/checkout/sessions"),
    );
    expect(store.rpc).toHaveBeenCalledWith("watch_release_checkout", {
      p_user: user,
      p_token: token,
    });
  });
  it("opens subscription management for an existing subscription rather than double subscribing", async () => {
    store.row = { stripe_customer: "cus_fixture", status: "active" };
    subscription = {
      id: "sub_fixture",
      customer: "cus_fixture",
      created: 1,
      livemode: false,
      metadata: { user_id: user, product: "iota_watch_pro" },
      status: "active",
      cancel_at_period_end: false,
      items: {
        data: [{ quantity: 1, price: { id: "price_month" }, current_period_end: 1800000000 }],
      },
    };
    expect((await checkout(user, "year", "zh")).url).toContain("billing.stripe.com");
    expect(calls.some((c) => c.path === "/v1/checkout/sessions")).toBe(false);
  });
  it("stops checkout if the price changed or the portal can add subscription quantities", async () => {
    wrongPrice = true;
    await expect(checkout(user, "month", "zh")).rejects.toThrow("billing_price_mismatch");
    wrongPrice = false;
    allowQuantity = true;
    await expect(checkout(user, "month", "zh")).rejects.toThrow("billing_account_not_ready");
    expect(calls.some((c) => c.path === "/v1/customers")).toBe(false);
  });
});
