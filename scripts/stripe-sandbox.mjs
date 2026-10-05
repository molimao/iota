// Explicit sandbox-only integration checks. No live keys or customer data.
import { readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import Stripe from "stripe";

process.loadEnvFile(".env.local");
const key = process.env.STRIPE_SECRET_KEY;
if (!key || !/^(sk|rk)_test_/.test(key) || process.env.STRIPE_MODE !== "test") {
  throw new Error("Sandbox configuration required; live keys are refused.");
}
const stripe = new Stripe(key, { maxNetworkRetries: 1, timeout: 20000 });
const catalog = JSON.parse(readFileSync("docs/stripe-test-catalog.json", "utf8"));
const statePath = "/private/tmp/iota-stripe-sandbox.json";
const command = process.argv[2];
function save(data) {
  writeFileSync(statePath, JSON.stringify(data, null, 2) + "\n", { mode: 0o600 });
}
if (command === "prepare") {
  const account = await stripe.accounts.retrieveCurrent();
  if (account.id !== process.env.STRIPE_ACCOUNT_ID) throw new Error("Wrong Stripe account");
  const month = await stripe.prices.retrieve(catalog.pro.monthly.priceId);
  const year = await stripe.prices.retrieve(catalog.pro.annual.priceId);
  for (const [price, amount, interval] of [
    [month, 290, "month"],
    [year, 1690, "year"],
  ]) {
    if (
      price.livemode ||
      !price.active ||
      price.unit_amount !== amount ||
      price.currency !== "usd" ||
      price.recurring?.interval !== interval ||
      price.recurring.interval_count !== 1
    )
      throw new Error("Sandbox price mismatch");
  }
  let portalId = process.env.STRIPE_PORTAL_CONFIGURATION_ID;
  if (!portalId) {
    const portal = await stripe.billingPortal.configurations.create({
      features: {
        subscription_cancel: { enabled: true, mode: "at_period_end" },
        subscription_update: { enabled: false },
      },
      business_profile: { headline: "IOTA Watch sandbox subscription management" },
      metadata: { product: "iota_watch_pro", purpose: "sandbox_integration" },
    });
    portalId = portal.id;
  }
  const user = randomUUID();
  const customer = await stripe.customers.create({
    name: "IOTA Watch sandbox integration",
    metadata: { user_id: user, product: "iota_watch_pro", purpose: "sandbox_integration" },
  });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.id,
    line_items: [{ price: year.id, quantity: 1 }],
    client_reference_id: user,
    metadata: { user_id: user, product: "iota_watch_pro" },
    subscription_data: { metadata: { user_id: user, product: "iota_watch_pro" } },
    success_url: "http://127.0.0.1:8080/zh/review?stripe_test=success",
    cancel_url: "http://127.0.0.1:8080/zh/review?stripe_test=cancel",
  });
  if (session.livemode || !session.url) throw new Error("Expected a sandbox checkout");
  save({
    account: account.id,
    customer: customer.id,
    user,
    session: session.id,
    url: session.url,
    portal: portalId,
    createdAt: new Date().toISOString(),
    paid: false,
  });
  console.log(
    "Sandbox account and both prices verified. Test checkout prepared; state saved to " + statePath,
  );
} else if (command === "verify") {
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  const session = await stripe.checkout.sessions.retrieve(state.session);
  if (
    session.livemode ||
    session.status !== "complete" ||
    session.payment_status !== "paid" ||
    session.amount_total !== 1690 ||
    session.currency !== "usd" ||
    session.client_reference_id !== state.user
  )
    throw new Error("Sandbox payment has not completed correctly");
  const subId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  if (!subId) throw new Error("Missing sandbox subscription");
  const sub = await stripe.subscriptions.retrieve(subId);
  if (
    sub.livemode ||
    sub.status !== "active" ||
    sub.metadata.user_id !== state.user ||
    sub.metadata.product !== "iota_watch_pro" ||
    sub.items.data[0]?.price.id !== catalog.pro.annual.priceId ||
    sub.items.data[0]?.quantity !== 1
  )
    throw new Error("Sandbox subscription mismatch");
  const portal = await stripe.billingPortal.sessions.create({
    customer: state.customer,
    configuration: state.portal,
    return_url: "http://127.0.0.1:8080/zh/review",
  });
  save({
    ...state,
    paid: true,
    subscription: sub.id,
    periodEnd: sub.items.data[0].current_period_end,
    portalUrl: portal.url,
    verifiedAt: new Date().toISOString(),
  });
  console.log(
    "Actual Stripe sandbox payment and active annual subscription verified; portal session created. No production state was modified.",
  );
} else if (command === "cancel-test") {
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  const session = await stripe.checkout.sessions.retrieve(state.session);
  if (session.livemode) throw new Error("Refusing live mutation");
  const subId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  if (subId) {
    const sub = await stripe.subscriptions.update(subId, { cancel_at_period_end: true });
    if (sub.livemode || !sub.cancel_at_period_end || sub.status !== "active")
      throw new Error("Sandbox cancellation mismatch");
    save({ ...state, cancelAtPeriodEnd: true });
    console.log("Sandbox cancellation scheduled; access remains active through the paid period.");
  } else throw new Error("No sandbox subscription to cancel");
} else throw new Error("Use prepare, verify, or cancel-test.");
