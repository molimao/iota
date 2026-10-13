/** A short-lived, tab-local purchase intent. URL parameters alone never start checkout. */
export const CHECKOUT_INTENT_KEY = "iota-checkout-intent-v1";
export type CheckoutInterval = "month" | "year";
export function checkoutInterval(value: string | null): CheckoutInterval {
  return value === "month" ? "month" : "year";
}
export function readCheckoutIntent(raw: string | null, href: string, now = Date.now()) {
  try {
    const value = JSON.parse(raw ?? "null");
    const url = new URL(href);
    if (
      !value ||
      !["month", "year"].includes(value.interval) ||
      !Number.isFinite(value.at) ||
      now < value.at ||
      now - value.at > 10 * 60 * 1000 ||
      value.path !== url.pathname ||
      url.searchParams.get("checkout") !== value.interval ||
      url.searchParams.has("error") ||
      new URLSearchParams(url.hash.slice(1)).has("error")
    )
      return null;
    return value.interval as CheckoutInterval;
  } catch {
    return null;
  }
}
