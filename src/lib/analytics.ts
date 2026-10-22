/** GA4 adapter: enabled on the production host once a dedicated stream is configured. */
declare global {
  interface Window {
    iotaAnalyticsConsent?: () => boolean;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
type FunnelEvent =
  | "login_start"
  | "login_failed"
  | "query_started"
  | "query_completed"
  | "query_failed"
  | "sync_started"
  | "sync_completed"
  | "sync_failed";
type EventContext = {
  project?: string;
  outcome?: "found" | "not_found";
  storage_mode?: "account" | "browser";
  reason?: string;
};
/** Keep source categories; never transmit referrer URLs, search terms or wallet query strings. */
export function acquisitionSource(referrer: string, search: string) {
  const campaign = new URLSearchParams(search).get("utm_source")?.toLowerCase();
  if (campaign)
    return ["google", "bing", "twitter", "x", "reddit", "telegram"].includes(campaign)
      ? campaign
      : "campaign_other";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (["iotahome.site", "www.iotahome.site"].includes(host)) return "internal";
    if (/(^|\.)google\.[a-z.]+$/.test(host)) return "google";
    if (host === "bing.com" || host.endsWith(".bing.com")) return "bing";
    if (["x.com", "t.co", "twitter.com"].includes(host)) return "x";
    if (host === "chatgpt.com" || host === "chat.openai.com") return "chatgpt";
    if (host === "reddit.com" || host.endsWith(".reddit.com")) return "reddit";
    return "referral_other";
  } catch {
    return "direct";
  }
}
function sourceContext() {
  try {
    const key = "iota-ga4-source-v1";
    let source = sessionStorage.getItem(key);
    const allowed = [
      "google",
      "bing",
      "twitter",
      "x",
      "reddit",
      "telegram",
      "chatgpt",
      "campaign_other",
      "referral_other",
      "direct",
    ];
    if (!source || !allowed.includes(source)) {
      source = acquisitionSource(document.referrer, window.location.search);
      if (source === "internal") source = "direct";
      sessionStorage.setItem(key, source);
    }
    return { acquisition_source: source };
  } catch {
    return {};
  }
}
export function trackFunnelEvent(event: FunnelEvent, context: EventContext = {}) {
  try {
    if (!init()) return;
    window.gtag?.("event", event, {
      send_to: measurementId(),
      page_location: window.location.origin + window.location.pathname,
      page_referrer: "",
      page_title: "IOTA Watch",
      ...sourceContext(),
      ...context,
    });
  } catch {
    /* Telemetry never blocks product actions. */
  }
}
// Public stream ID, verified against the site’s GA4 property. An explicit empty override disables it.
function measurementId() {
  return import.meta.env["VITE_GA4_MEASUREMENT_ID"] ?? "G-QWBDM7FKFE";
}
let initialized = false;
let lastPath: string | undefined;
const seen = new Set<string>();
export function analyticsAllowed() {
  try {
    return (
      typeof window !== "undefined" &&
      ["iotahome.site", "www.iotahome.site"].includes(window.location.hostname) &&
      /^G-[A-Z0-9]+$/.test(measurementId() || "") &&
      window.iotaAnalyticsConsent?.() !== false &&
      navigator.doNotTrack !== "1" &&
      !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl &&
      localStorage.getItem("iota-analytics-consent-v1") !== "no"
    );
  } catch {
    return false;
  }
}
function init() {
  if (!analyticsAllowed()) return false;
  if (!initialized) {
    const id = measurementId();
    window.dataLayer ||= [];
    window.gtag ||= function () {
      // gtag consumes an Arguments object, not a rest-parameter array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, {
      send_page_view: false,
      page_location: window.location.origin + window.location.pathname,
      page_referrer: "",
      page_title: "IOTA Watch",
      ...sourceContext(),
    });
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-iota-analytics", "true");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
    initialized = true;
  }
  return true;
}
export function trackProductEvent(
  event:
    | "device_created"
    | "project_linked"
    | "first_core_action"
    | "core_action_return"
    | "begin_checkout",
  interval?: "month" | "year",
  context: EventContext = {},
) {
  try {
    if (!init()) return false;
    window.gtag?.("event", event, {
      send_to: measurementId(),
      page_location: window.location.origin + window.location.pathname,
      page_referrer: "",
      page_title: "IOTA Watch",
      ...sourceContext(),
      ...context,
      ...(interval
        ? { items: [{ item_id: `watch_pro_${interval}`, item_name: "IOTA Watch Pro" }] }
        : {}),
    });
    return true;
  } catch {
    return false;
  }
}
export function trackCoreAction(
  event: "device_created" | "project_linked",
  context: EventContext = {},
) {
  if (!trackProductEvent(event, undefined, context)) return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const previous = localStorage.getItem("iota-ga4-core-day");
    if (!previous) trackProductEvent("first_core_action");
    else if (previous !== today) trackProductEvent("core_action_return");
    localStorage.setItem("iota-ga4-core-day", today);
  } catch {
    /* No storage: omit unverifiable milestones. */
  }
}
export function trackAuthSuccess(event: "login" | "sign_up", occurrence: string) {
  try {
    if (!init() || seen.has(occurrence)) return;
    const key = `iota-ga4-auth:${occurrence}`;
    if (sessionStorage.getItem(key)) return;
    window.gtag?.("event", event, {
      send_to: measurementId(),
      method: "google",
      page_location: window.location.origin + window.location.pathname,
      page_referrer: "",
      page_title: "IOTA Watch",
      ...sourceContext(),
    });
    seen.add(occurrence);
    sessionStorage.setItem(key, "1");
  } catch {
    /* Never interfere with authentication. */
  }
}
export function trackPageView(path: string) {
  try {
    if (!init() || lastPath === path) return;
    window.gtag?.("event", "page_view", {
      send_to: measurementId(),
      page_location: window.location.origin + path,
      page_path: path,
      page_title: "IOTA Watch",
      ...sourceContext(),
      page_referrer: "",
    });
    lastPath = path;
  } catch {
    /* Never interfere with routing. */
  }
}

/** A login attempt is consumed once, including failed/expired attempts. Never replay on token refresh. */
export function consumePendingLogin(now = Date.now(), createdAt?: string) {
  try {
    const pending = sessionStorage.getItem("iota-ga4-login-pending");
    if (!pending) return;
    sessionStorage.removeItem("iota-ga4-login-pending");
    const timestamp = Number(pending.split(":")[0]);
    const age = now - timestamp;
    if (!/^\d+:[0-9a-f-]{36}$/i.test(pending) || !Number.isFinite(age) || age < 0 || age >= 600000)
      return;
    const created = Date.parse(createdAt ?? "");
    trackAuthSuccess(
      Number.isFinite(created) && created >= timestamp - 5000 && created <= now
        ? "sign_up"
        : "login",
      pending,
    );
  } catch {
    /* Storage or analytics must not block login. */
  }
}

/** Privacy override: no denied-consent pings. Stop further client collection immediately. */
export function applyAnalyticsPermission(allowed: boolean) {
  window.iotaAnalyticsConsent = () => allowed;
  const id = measurementId();
  if (id) Object.assign(window, { [`ga-disable-${id}`]: !allowed });
  if (!allowed) {
    window.dataLayer?.splice(0);
    document.querySelector("script[data-iota-analytics]")?.remove();
    initialized = false;
    lastPath = undefined;
    seen.clear();
  }
  window.dispatchEvent(new Event("iota-analytics-consent"));
}

export function failPendingLogin(
  reason: "login_failed" | "login_canceled" | "login_expired" | "login_unavailable",
) {
  try {
    if (!sessionStorage.getItem("iota-ga4-login-pending")) return;
    sessionStorage.removeItem("iota-ga4-login-pending");
    trackFunnelEvent("login_failed", { reason });
  } catch {
    /* Best effort. */
  }
}

/** Only account/status queries count. Prices, network polling and credentials do not. */
export function queryAnalyticsProject(key: readonly unknown[]) {
  if (key[0] === "iota" && key[1] === "discovery" && typeof key[2] === "string" && key[2])
    return "iota";
  if (
    key[0] === "pool-account" &&
    typeof key[2] === "string" &&
    key[2] &&
    ["bnt", "csd", "mds", "prl", "xmr", "rvn", "etc", "kas", "zec", "erg", "zeph"].includes(
      String(key[1]),
    )
  )
    return String(key[1]);
  if (
    key[0] === "platform-node" &&
    typeof key[3] === "string" &&
    key[3] &&
    typeof key[2] === "string" &&
    ["noid", "acurast", "akash", "ionet", "vast", "golem"].includes(key[2])
  )
    return key[2];
  if (key[0] === "nosana" && typeof key[1] === "string" && key[1]) return "nosana";
  if (key[0] === "projects" && key[1] === "quantus" && key[2] === "account" && key[3])
    return "quantus";
  return null;
}
