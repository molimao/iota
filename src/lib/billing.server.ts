import Stripe from "stripe";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { watchDb, type BillingRow } from "./watch-db";
import {
  billingConfig,
  assertPrice,
  subscriptionSnapshot,
  billingReturnUrl,
  type BillingConfig,
} from "./billing-policy";
import { paidAccess, PLANS, type BillingSummary } from "./plans";

const db = () => watchDb(supabaseAdmin);
function runtime() {
  const config = billingConfig(process.env);
  if (!config) throw new Error("billing_not_configured");
  const stripe = new Stripe(config.secret, {
    httpClient: Stripe.createFetchHttpClient(),
    maxNetworkRetries: 2,
    timeout: 15000,
  });
  return { stripe, config };
}
async function rowFor(userId: string): Promise<BillingRow | null> {
  const { data, error } = await db()
    .from("watch_billing")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error("billing_read_failed");
  return data;
}
async function sync(
  stripe: Stripe,
  config: BillingConfig,
  subscriptionId: string,
  eventId: string,
  created: number,
  fetched?: Stripe.Subscription,
) {
  const sub = fetched ?? (await stripe.subscriptions.retrieve(subscriptionId));
  const snapshot = subscriptionSnapshot(sub, config);
  const { error } = await db().rpc("watch_sync_subscription", {
    p_event: eventId,
    p_created: created,
    p_user: snapshot.user,
    p_customer: snapshot.customer,
    p_subscription: snapshot.subscription,
    p_status: snapshot.status,
    p_end: snapshot.end,
    p_cancel: snapshot.cancel,
  });
  if (error) throw new Error("billing_sync_failed");
  return snapshot;
}
async function appSubscriptions(stripe: Stripe, customer: string) {
  const list = await stripe.subscriptions.list({ customer, status: "all", limit: 100 });
  if (list.has_more) throw new Error("billing_subscription_review_required");
  return list.data
    .filter((s) => s.metadata["product"] === "iota_watch_pro")
    .sort((a, b) => b.created - a.created);
}
async function reconcile(
  userId: string,
  stripe: Stripe,
  config: BillingConfig,
  row: BillingRow | null,
) {
  if (!row?.stripe_customer) return row;
  const subscriptions = await appSubscriptions(stripe, row.stripe_customer);
  const subscription =
    subscriptions.find((s) => s.status !== "canceled" && s.status !== "incomplete_expired") ??
    subscriptions[0];
  if (subscription) {
    if (subscription.metadata["user_id"] !== userId) throw new Error("billing_customer_mismatch");
    await sync(
      stripe,
      config,
      subscription.id,
      `reconcile:${crypto.randomUUID()}`,
      Math.floor(Date.now() / 1000),
    );
    return rowFor(userId);
  }
  return row;
}
export async function readBilling(userId: string): Promise<BillingSummary> {
  let row = await rowFor(userId);
  const config = billingConfig(process.env);
  if (
    config &&
    row?.stripe_customer &&
    (!row.synced_at || Date.now() - Date.parse(row.synced_at) > 60000)
  ) {
    try {
      const { stripe } = runtime();
      row = await reconcile(userId, stripe, config, row);
    } catch {
      /* Failed reconciliation cannot grant new access. */
    }
  }
  const end = row?.period_end ? Date.parse(row.period_end) : null;
  const plan = paidAccess(row?.status ?? null, end) ? "pro" : "free";
  return {
    plan,
    quotaScope: "per_project",
    projectDeviceLimit: PLANS[plan].projectDeviceLimit,
    configured: !!config,
    status: row?.status ?? null,
    periodEnd: end,
    cancelAtPeriodEnd: row?.cancel_at_period_end ?? false,
    hasCustomer: !!row?.stripe_customer,
  };
}
async function validateCatalog(stripe: Stripe, config: BillingConfig) {
  const [account, month, year, portal] = await Promise.all([
    stripe.accounts.retrieveCurrent(),
    stripe.prices.retrieve(config.monthPrice),
    stripe.prices.retrieve(config.yearPrice),
    stripe.billingPortal.configurations.retrieve(config.portal),
  ]);
  if (
    account.id !== config.account ||
    !portal.active ||
    !portal.features.subscription_cancel.enabled ||
    portal.features.subscription_cancel.mode !== "at_period_end" ||
    (portal.features.subscription_update.enabled &&
      portal.features.subscription_update.default_allowed_updates.includes("quantity")) ||
    (config.mode === "live" && !account.charges_enabled)
  )
    throw new Error("billing_account_not_ready");
  assertPrice(month, "month", config);
  assertPrice(year, "year", config);
  const productId = (price: Stripe.Price) =>
    typeof price.product === "string" ? price.product : price.product.id;
  if (productId(month) !== productId(year)) throw new Error("billing_price_mismatch");
}
export async function checkout(userId: string, interval: "month" | "year", locale: string) {
  const { stripe, config } = runtime();
  await validateCatalog(stripe, config);
  let row = await rowFor(userId);
  row = await reconcile(userId, stripe, config, row);
  if (
    row?.stripe_customer &&
    row.status &&
    !["canceled", "incomplete_expired"].includes(row.status)
  )
    return portal(userId, locale);
  // Changing cadence expires the previous unpaid session before reserving another.
  if (
    row?.checkout_token &&
    row.checkout_session &&
    row.checkout_interval !== interval &&
    row.checkout_expires_at &&
    Date.parse(row.checkout_expires_at) > Date.now()
  ) {
    const previous = await stripe.checkout.sessions.retrieve(row.checkout_session);
    if (previous.status === "complete") throw new Error("checkout_processing");
    if (previous.status === "open") await stripe.checkout.sessions.expire(previous.id);
    const released = await db().rpc("watch_release_checkout", {
      p_user: userId,
      p_token: row.checkout_token,
    });
    if (released.error) throw new Error("checkout_processing");
  }
  const customer =
    row?.stripe_customer ??
    (
      await stripe.customers.create(
        { metadata: { user_id: userId, product: "iota_watch_pro" } },
        { idempotencyKey: `watch-customer:${userId}` },
      )
    ).id;
  const reservation = await db().rpc("watch_reserve_checkout", {
    p_user: userId,
    p_interval: interval,
    p_customer: customer,
    p_locale: locale,
  });
  if (reservation.error)
    throw new Error(
      reservation.error.message.includes("checkout_pending")
        ? "checkout_pending"
        : "checkout_unavailable",
    );
  const {
    token,
    expiresAt,
    session: existing,
    locale: reservedLocale,
  } = z
    .object({
      token: z.string().uuid(),
      expiresAt: z.number().int(),
      session: z.string().nullable(),
      locale: z.string(),
    })
    .parse(reservation.data);
  if (existing) {
    const session = await stripe.checkout.sessions.retrieve(existing);
    if (session.status === "open" && session.url) return { url: session.url };
    throw new Error("checkout_processing");
  }
  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      customer,
      line_items: [
        { price: interval === "month" ? config.monthPrice : config.yearPrice, quantity: 1 },
      ],
      client_reference_id: userId,
      metadata: { user_id: userId, product: "iota_watch_pro" },
      subscription_data: { metadata: { user_id: userId, product: "iota_watch_pro" } },
      expires_at: expiresAt,
      success_url: billingReturnUrl(config, reservedLocale, "success"),
      cancel_url: billingReturnUrl(config, reservedLocale, "cancel"),
    },
    { idempotencyKey: `watch-checkout:${token}` },
  );
  if (!session.url) throw new Error("checkout_unavailable");
  const saved = await db().rpc("watch_finish_checkout", {
    p_user: userId,
    p_token: token,
    p_session: session.id,
  });
  if (saved.error) throw new Error("checkout_unavailable");
  return { url: session.url };
}
export async function portal(userId: string, locale: string) {
  const { stripe, config } = runtime();
  await validateCatalog(stripe, config);
  const row = await rowFor(userId);
  if (!row?.stripe_customer) throw new Error("billing_no_customer");
  const session = await stripe.billingPortal.sessions.create({
    customer: row.stripe_customer,
    configuration: config.portal,
    return_url: billingReturnUrl(config, locale),
  });
  return { url: session.url };
}
function objectId(value: unknown): string | null {
  return typeof value === "string"
    ? value
    : value && typeof value === "object" && "id" in value && typeof value.id === "string"
      ? value.id
      : null;
}
export async function stripeWebhook(request: Request): Promise<Response> {
  const respond = (message: string, status: number) =>
    new Response(message, { status, headers: { "cache-control": "no-store" } });
  if (request.method !== "POST") return respond("Method not allowed", 405);
  const config = billingConfig(process.env);
  if (!config) return respond("Billing is not configured", 503);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return respond("Missing signature", 400);
  if (Number(request.headers.get("content-length")) > 262144)
    return respond("Payload too large", 413);
  const reader = request.body?.getReader();
  if (!reader) return respond("Missing body", 400);
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.length;
      if (bytes > 262144) {
        await reader.cancel();
        return respond("Payload too large", 413);
      }
      chunks.push(part.value);
    }
  } catch {
    return respond("Invalid body", 400);
  }
  const payload = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    payload.set(chunk, offset);
    offset += chunk.length;
  }
  const { stripe } = runtime();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      new TextDecoder().decode(payload),
      signature,
      config.webhookSecret,
      300,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch {
    return respond("Invalid signature", 400);
  }
  if (event.livemode !== (config.mode === "live")) return respond("Mode mismatch", 400);
  const relevant = new Set([
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.paused",
    "customer.subscription.resumed",
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "invoice.paid",
    "invoice.payment_failed",
  ]);
  if (!relevant.has(event.type)) return respond("Ignored", 200);
  const object = event.data.object as unknown as Record<string, unknown>;
  const parent = object["parent"] as
    { subscription_details?: { subscription?: unknown } } | undefined;
  const subscriptionId = event.type.startsWith("customer.subscription.")
    ? objectId(object["id"])
    : (objectId(object["subscription"]) ?? objectId(parent?.subscription_details?.subscription));
  if (!subscriptionId) return respond("Ignored", 200);
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.metadata["product"] !== "iota_watch_pro") return respond("Ignored", 200);
    await sync(stripe, config, subscriptionId, event.id, event.created, subscription);
    return respond("Received", 200);
  } catch {
    return respond("Subscription synchronization failed", 500);
  }
}
