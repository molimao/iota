// Configure only this site's approved live catalog; never charge customers.
import { readFileSync, writeFileSync, chmodSync } from "node:fs";
import Stripe from "stripe";

const path = ".env.production.local";
const catalog = JSON.parse(readFileSync("docs/stripe-live-catalog.json", "utf8"));
const events = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "invoice.paid",
  "invoice.payment_failed",
];
const command = process.argv[2];

function save(values) {
  let source = readFileSync(path, "utf8");
  for (const [name, value] of Object.entries(values)) {
    if (!/^[A-Z_]+$/.test(name) || /[\r\n"\\]/.test(value))
      throw new Error("Invalid configuration value");
    const line = name + "=" + JSON.stringify(value);
    const pattern = new RegExp("^" + name + "=.*$", "m");
    source = pattern.test(source)
      ? source.replace(pattern, () => line)
      : source.trimEnd() + "\n" + line + "\n";
  }
  writeFileSync(path, source, { mode: 0o600 });
  chmodSync(path, 0o600);
}

async function main() {
  process.loadEnvFile(path);
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !/^(sk|rk)_live_/.test(key) || process.env.STRIPE_MODE !== "live")
    throw new Error("A private live configuration is required");
  if (
    process.env.STRIPE_ACCOUNT_ID !== catalog.accountId ||
    process.env.SITE_ORIGIN !== "https://iotahome.site"
  )
    throw new Error("Wrong merchant or site origin");
  const stripe = new Stripe(key, { timeout: 20000, maxNetworkRetries: 1 });
  const account = await stripe.accounts.retrieveCurrent();
  if (account.id !== catalog.accountId || !account.charges_enabled || !account.details_submitted)
    throw new Error("The merchant is not ready to accept live payments");
  for (const [settings, interval] of [
    [catalog.pro.monthly, "month"],
    [catalog.pro.annual, "year"],
  ]) {
    const price = await stripe.prices.retrieve(settings.priceId);
    const product = typeof price.product === "string" ? price.product : price.product.id;
    if (
      !price.livemode ||
      !price.active ||
      product !== catalog.pro.productId ||
      price.currency !== "usd" ||
      price.unit_amount !== settings.unitAmount ||
      price.type !== "recurring" ||
      price.recurring?.interval !== interval ||
      price.recurring.interval_count !== 1 ||
      price.recurring.usage_type !== "licensed"
    )
      throw new Error("Live catalog mismatch");
  }
  console.log("Live merchant and both recurring prices verified through Stripe API.");
  if (command === "inspect") return;
  if (command !== "prepare" || process.argv[3] !== "--apply")
    throw new Error(
      "Use inspect, or prepare --apply after the current release and credential approval",
    );
  let portalId = process.env.STRIPE_PORTAL_CONFIGURATION_ID;
  if (!portalId) {
    const configs = await stripe.billingPortal.configurations.list({ limit: 100 });
    if (configs.has_more) throw new Error("Review portal configurations before continuing");
    let portal = configs.data.find((p) => p.active && p.metadata.product === "iota_watch_pro");
    if (!portal)
      portal = await stripe.billingPortal.configurations.create(
        {
          business_profile: {
            headline: "IOTA Watch",
            privacy_policy_url: "https://iotahome.site/zh/privacy",
          },
          features: {
            subscription_cancel: { enabled: true, mode: "at_period_end" },
            subscription_update: { enabled: false },
            payment_method_update: { enabled: true },
          },
          metadata: { product: "iota_watch_pro" },
        },
        { idempotencyKey: "iota-watch-live-portal-v1" },
      );
    portalId = portal.id;
    save({ STRIPE_PORTAL_CONFIGURATION_ID: portalId });
  }
  const portal = await stripe.billingPortal.configurations.retrieve(portalId);
  if (
    !portal.active ||
    !portal.features.subscription_cancel.enabled ||
    portal.features.subscription_cancel.mode !== "at_period_end" ||
    (portal.features.subscription_update.enabled &&
      portal.features.subscription_update.default_allowed_updates.includes("quantity"))
  )
    throw new Error("Unsafe portal configuration");
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  if (endpoints.has_more) throw new Error("Review event destinations before continuing");
  const url = "https://iotahome.site/api/stripe/webhook";
  let endpoint = endpoints.data.find((e) => e.url === url);
  if (endpoint) {
    if (
      !endpoint.livemode ||
      endpoint.status !== "enabled" ||
      endpoint.metadata.product !== "iota_watch_pro" ||
      !process.env.STRIPE_WEBHOOK_SECRET ||
      (!endpoint.enabled_events.includes("*") &&
        events.some((e) => !endpoint.enabled_events.includes(e)))
    )
      throw new Error("Existing event destination needs review or its signing secret");
  } else {
    endpoint = await stripe.webhookEndpoints.create(
      {
        url,
        enabled_events: events,
        description: "IOTA Watch subscription access",
        metadata: { product: "iota_watch_pro" },
      },
      { idempotencyKey: "iota-watch-live-webhook-v1" },
    );
    if (!endpoint.secret || !endpoint.livemode)
      throw new Error("Expected a new live signing secret");
    save({ STRIPE_WEBHOOK_SECRET: endpoint.secret });
  }
  save({
    STRIPE_MODE: "live",
    STRIPE_LIVE_ENABLED: "true",
    STRIPE_PRICE_MONTHLY: catalog.pro.monthly.priceId,
    STRIPE_PRICE_ANNUAL: catalog.pro.annual.priceId,
  });
  catalog.validation.apiChargesEnabled = "verified";
  catalog.validation.portalConfiguration = "verified";
  catalog.portalConfigurationId = portal.id;
  catalog.webhookEndpointId = endpoint.id;
  catalog.status = "live_backend_configuration_prepared; hosting_deployment_pending";
  writeFileSync("docs/stripe-live-catalog.json", JSON.stringify(catalog, null, 2) + "\n");
  console.log(
    "Live portal and event destination prepared. Signing secret saved only in the ignored private configuration. No purchase or subscription was created.",
  );
}

main().catch((error) => {
  console.error(
    String(error?.message ?? "Stripe configuration failed").replace(
      /(?:sk|rk)_(?:test|live)_[A-Za-z0-9]+/g,
      "[redacted]",
    ),
  );
  process.exitCode = 1;
});
