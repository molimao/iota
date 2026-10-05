import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import Stripe from "stripe";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Opt-in only: actual sandbox reads, with all application writes isolated in local PostgreSQL.
const store = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: store }));
import { stripeWebhook } from "./billing.server";

const enabled = process.env["STRIPE_SANDBOX_CHECK"] === "1";
describe.skipIf(!enabled)("actual Stripe sandbox events replayed into local PostgreSQL", () => {
  let db: PGlite;
  let stripe: Stripe;
  let state: {
    user: string;
    customer: string;
    session: string;
    subscription: string;
    portal: string;
    paid: boolean;
  };
  let signingSecret: string;

  beforeAll(async () => {
    process.loadEnvFile(".env.local");
    const key = process.env["STRIPE_SECRET_KEY"];
    if (!key || !/^(sk|rk)_test_/.test(key) || process.env["STRIPE_MODE"] !== "test") {
      throw new Error("Only explicitly configured sandbox credentials are allowed");
    }
    state = JSON.parse(readFileSync("/private/tmp/iota-stripe-sandbox.json", "utf8"));
    if (!state.paid || !state.subscription) throw new Error("Complete the sandbox Checkout first");
    stripe = new Stripe(key, { timeout: 20000, maxNetworkRetries: 1 });
    signingSecret = "whsec_" + randomBytes(32).toString("hex");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", signingSecret);
    vi.stubEnv("STRIPE_PORTAL_CONFIGURATION_ID", state.portal);
    db = new PGlite();
    await db.exec(
      "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; GRANT USAGE ON SCHEMA public,auth TO authenticated,service_role,anon;",
    );
    await db.query("INSERT INTO auth.users(id) VALUES($1)", [state.user]);
    await db.exec(
      readFileSync(
        "supabase/migrations/20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql",
        "utf8",
      ),
    );
    await db.exec(readFileSync("supabase/migrations/20261005130000_fleet_and_billing.sql", "utf8"));
    store.rpc.mockImplementation(async (name: string, args: Record<string, unknown>) => {
      if (name !== "watch_sync_subscription") throw new Error("Unexpected RPC");
      await db.exec("RESET ROLE; SET ROLE service_role;");
      try {
        await db.query("SELECT watch_sync_subscription($1,$2,$3,$4,$5,$6,$7,$8)", [
          args["p_event"],
          args["p_created"],
          args["p_user"],
          args["p_customer"],
          args["p_subscription"],
          args["p_status"],
          args["p_end"],
          args["p_cancel"],
        ]);
        return { data: null, error: null };
      } catch {
        return { data: null, error: { message: "local_database_sync_failed" } };
      }
    });
    await db.exec("SET ROLE service_role;");
    await db.query("SELECT watch_reserve_checkout($1,'year',$2,'zh')", [
      state.user,
      state.customer,
    ]);
  }, 60000);

  afterAll(async () => {
    if (db) await db.close();
    vi.unstubAllEnvs();
  });

  async function snapshot() {
    await db.exec("RESET ROLE; SET ROLE authenticated;");
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [state.user]);
    const result = await db.query<{ data: { projectDeviceLimit: number } }>(
      "SELECT watch_list_devices() AS data",
    );
    return result.rows[0]!.data;
  }

  async function replay(event: Stripe.Event) {
    const payload = JSON.stringify(event);
    const signature = stripe.webhooks.generateTestHeaderString({ payload, secret: signingSecret });
    const response = await stripeWebhook(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": signature },
        body: payload,
      }),
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Received");
  }

  it("grants 50 per project from the paid sandbox event and preserves access on scheduled cancellation", async () => {
    expect((await snapshot()).projectDeviceLimit).toBe(5);
    const completed = await stripe.events.list({ type: "checkout.session.completed", limit: 100 });
    const payment = completed.data.find(
      (event) =>
        event.type === "checkout.session.completed" && event.data.object.id === state.session,
    );
    if (!payment || payment.livemode)
      throw new Error("Matching actual sandbox payment event missing");
    await replay(payment);
    expect((await snapshot()).projectDeviceLimit).toBe(50);
    const updates = await stripe.events.list({ type: "customer.subscription.updated", limit: 100 });
    const cancellation = updates.data.find(
      (event) =>
        event.type === "customer.subscription.updated" &&
        event.data.object.id === state.subscription &&
        event.data.object.cancel_at_period_end,
    );
    if (!cancellation || cancellation.livemode)
      throw new Error("Matching actual sandbox cancellation event missing");
    await replay(cancellation);
    expect((await snapshot()).projectDeviceLimit).toBe(50);
    const billing = await db.query<{
      status: string;
      cancel_at_period_end: boolean;
      period_end: string;
    }>("SELECT status,cancel_at_period_end,period_end FROM watch_billing WHERE user_id=$1", [
      state.user,
    ]);
    expect(billing.rows[0]!.status).toBe("active");
    expect(billing.rows[0]!.cancel_at_period_end).toBe(true);
    expect(Date.parse(billing.rows[0]!.period_end)).toBeGreaterThan(Date.now());
    await replay(payment); // A duplicate older notification cannot regress the current state.
    expect((await snapshot()).projectDeviceLimit).toBe(50);
  }, 60000);
});
