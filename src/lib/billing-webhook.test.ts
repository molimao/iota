import Stripe from "stripe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const rpc = vi.hoisted(() => vi.fn());
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { rpc } }));
import { stripeWebhook } from "./billing.server";
const secret = "whsec_test_fixture_only";
const user = "11111111-1111-4111-8111-111111111111";
const sdk = new Stripe("sk_test_fixture_only");
const subscription = {
  id: "sub_fixture",
  object: "subscription",
  customer: "cus_fixture",
  livemode: false,
  metadata: { product: "iota_watch_pro", user_id: user },
  status: "active",
  cancel_at_period_end: true,
  items: { data: [{ quantity: 1, price: { id: "price_month" }, current_period_end: 1800000000 }] },
};
function signed(type = "customer.subscription.updated", livemode = false) {
  const payload = JSON.stringify({
    id: "evt_fixture",
    created: Math.floor(Date.now() / 1000),
    type,
    livemode,
    data: { object: { id: "sub_fixture" } },
  });
  const signature = sdk.webhooks.generateTestHeaderString({ payload, secret });
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": signature },
    body: payload,
  });
}
beforeEach(() => {
  for (const [key, value] of Object.entries({
    STRIPE_MODE: "test",
    STRIPE_SECRET_KEY: "sk_test_fixture_only",
    STRIPE_WEBHOOK_SECRET: secret,
    STRIPE_ACCOUNT_ID: "acct_fixture",
    STRIPE_PRICE_MONTHLY: "price_month",
    STRIPE_PRICE_ANNUAL: "price_year",
    STRIPE_PORTAL_CONFIGURATION_ID: "bpc_fixture",
    SITE_ORIGIN: "http://127.0.0.1:8080",
  }))
    vi.stubEnv(key, value);
  rpc.mockReset().mockResolvedValue({ data: null, error: null });
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockImplementation(
        async () =>
          new Response(JSON.stringify(subscription), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
      ),
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("raw signed webhook", () => {
  it("rejects a missing or altered signature before Stripe reads or database writes", async () => {
    const result = await stripeWebhook(
      new Request("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }),
    );
    expect(result.status).toBe(400);
    const request = signed();
    const sig = request.headers.get("stripe-signature")!;
    const changed = new Request(request.url, {
      method: "POST",
      headers: { "stripe-signature": sig },
      body: '{"changed":true}',
    });
    expect((await stripeWebhook(changed)).status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("cannot mix live and sandbox events or accept an oversized payload", async () => {
    expect((await stripeWebhook(signed("customer.subscription.updated", true))).status).toBe(400);
    const huge = new Request("http://localhost/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": "x" },
      body: "x".repeat(262145),
    });
    expect((await stripeWebhook(huge)).status).toBe(413);
    expect(rpc).not.toHaveBeenCalled();
  });
  it("fetches the current Stripe subscription and persists the verified customer, user and period", async () => {
    const result = await stripeWebhook(signed());
    expect(result.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith(
      "watch_sync_subscription",
      expect.objectContaining({
        p_event: "evt_fixture",
        p_user: user,
        p_customer: "cus_fixture",
        p_subscription: "sub_fixture",
        p_status: "active",
        p_cancel: true,
        p_end: "2027-01-15T08:00:00.000Z",
      }),
    );
  });
  it("asks Stripe to retry if the owned-customer check or storage fails", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "customer_mismatch" } });
    expect((await stripeWebhook(signed())).status).toBe(500);
  });
});
