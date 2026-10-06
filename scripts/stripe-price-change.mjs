// Run apply only after approval for this production price change.
import fs from "node:fs";
import Stripe from "stripe";
process.loadEnvFile(".env.production.local");
const catalog = JSON.parse(fs.readFileSync("docs/stripe-live-catalog.json", "utf8"));
const mode = process.argv[2];
if (!["inspect", "apply"].includes(mode))
  throw Error("Use inspect or apply after release approval");
if (!/^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? ""))
  throw Error("Live configuration required");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { timeout: 20000, maxNetworkRetries: 1 });
const account = await stripe.accounts.retrieveCurrent();
if (account.id !== catalog.accountId) throw Error("Merchant mismatch");
const product = catalog.pro.productId;
const oldIds = [
  ...new Set([
    ...(catalog.legacyPrices ?? []).map((p) => p.priceId),
    catalog.pro.monthly.priceId,
    catalog.pro.annual.priceId,
  ]),
];
const currentIds = [catalog.pro.monthly.priceId, catalog.pro.annual.priceId];
for (const [i, period] of ["monthly", "annual"].entries()) {
  const p = await stripe.prices.retrieve(currentIds[i]);
  const old = catalog.pro[period];
  if (
    !p.livemode ||
    p.unit_amount !== old.unitAmount ||
    p.currency !== "usd" ||
    (typeof p.product === "string" ? p.product : p.product.id) !== product ||
    p.recurring?.interval !== old.interval
  )
    throw Error("Old catalog mismatch");
}
if (mode === "inspect") {
  console.log(
    "Current live catalog verified. Proposed prices: USD 2.99/month and USD 16.99/year. Existing subscriptions keep their prices.",
  );
  process.exit(0);
}
const available = await stripe.prices.list({ product, active: true, limit: 100 });
if (available.has_more) throw Error("Review complete price list before changing prices");
const created = [];
for (const [interval, amount] of [
  ["month", 299],
  ["year", 1699],
]) {
  const matches = available.data.filter(
    (p) =>
      p.livemode &&
      p.currency === "usd" &&
      p.unit_amount === amount &&
      p.recurring?.interval === interval &&
      p.recurring.interval_count === 1 &&
      p.recurring.usage_type === "licensed",
  );
  if (matches.length > 1) throw Error("Multiple matching prices require review");
  const p =
    matches[0] ??
    (await stripe.prices.create(
      {
        product,
        currency: "usd",
        unit_amount: amount,
        recurring: { interval },
        metadata: { product: "iota_watch_pro", release: "20261006_prices_299_1699" },
      },
      { idempotencyKey: `iota-watch-${product}-${interval}-${amount}-20261006` },
    ));
  if (!p.livemode || !p.active || p.unit_amount !== amount || p.recurring?.interval !== interval)
    throw Error("New price verification failed");
  created.push(p.id);
}
const plan = {
  status: "prices_created_hosted_switch_pending",
  productId: product,
  monthly: { unitAmount: 299, priceId: created[0] },
  annual: { unitAmount: 1699, priceId: created[1] },
  serverConfig: {
    STRIPE_PRICE_MONTHLY: created[0],
    STRIPE_PRICE_ANNUAL: created[1],
    STRIPE_LEGACY_PRICE_IDS: oldIds.join(","),
  },
  existingSubscriptions: "retain_existing_price",
};
fs.writeFileSync("docs/stripe-price-change.json", JSON.stringify(plan, null, 2) + "\n");
console.log(
  "New prices verified; pending hosting configuration saved to docs/stripe-price-change.json. Existing subscriptions unchanged.",
);
