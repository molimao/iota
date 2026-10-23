import { afterEach, beforeEach, expect, it, vi } from "vitest";
let memory: Map<string, string>;
let append: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.resetModules();
  memory = new Map();
  append = vi.fn();
  const storage = {
    getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => memory.set(k, v),
    removeItem: (k: string) => memory.delete(k),
  };
  vi.stubGlobal("sessionStorage", storage);
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", {
    location: {
      hostname: "iotahome.site",
      origin: "https://iotahome.site",
      pathname: "/zh/devices",
      search: "?email=private",
    },
    dispatchEvent: vi.fn(),
  });
  vi.stubGlobal("navigator", { doNotTrack: null, globalPrivacyControl: false });
  vi.stubGlobal("document", {
    createElement: () => ({ setAttribute: vi.fn() }),
    querySelector: () => ({ remove: vi.fn() }),
    head: { appendChild: append },
  });
  vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "G-TEST12345");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it("fails closed with an explicit refusal or missing stream", async () => {
  const a = await import("./analytics");
  window.iotaAnalyticsConsent = () => false;
  expect(a.trackProductEvent("device_created")).toBe(false);
  window.iotaAnalyticsConsent = () => true;
  vi.stubEnv("VITE_GA4_MEASUREMENT_ID", "");
  expect(a.trackProductEvent("device_created")).toBe(false);
  expect(append).not.toHaveBeenCalled();
});
it("queues gtag arguments, strips query data and deduplicates page views", async () => {
  const a = await import("./analytics");
  a.trackPageView("/zh/devices");
  a.trackPageView("/zh/devices");
  const queue = window.dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>));
  expect(queue.filter((x) => x[1] === "page_view")).toHaveLength(1);
  expect(JSON.stringify(queue)).not.toContain("private");
  expect(append).toHaveBeenCalledTimes(1);
});
it("consumes login attempts once across callbacks and rejects future or expired attempts", async () => {
  const a = await import("./analytics");
  const uuid = "11111111-1111-4111-8111-111111111111";
  for (const time of [2000000, 1]) {
    memory.set("iota-ga4-login-pending", `${time}:${uuid}`);
    a.consumePendingLogin(1000000);
  }
  expect(append).not.toHaveBeenCalled();
  memory.set("iota-ga4-login-pending", `999999:${uuid}`);
  a.consumePendingLogin(1000000);
  a.consumePendingLogin(1000000);
  expect(
    window
      .dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>))
      .filter((x) => x[1] === "login"),
  ).toHaveLength(1);
  expect(memory.has("iota-ga4-login-pending")).toBe(false);
});

it("withdrawal blocks subsequent events without consent-mode pings", async () => {
  const a = await import("./analytics");
  expect(a.trackProductEvent("device_created")).toBe(true);
  a.applyAnalyticsPermission(false);
  const send = vi.fn();
  window.gtag = send;
  expect(a.trackProductEvent("begin_checkout", "year")).toBe(false);
  a.trackPageView("/en");
  a.trackAuthSuccess("login", "another");
  expect(send).not.toHaveBeenCalled();
  expect((window as unknown as Record<string, unknown>)["ga-disable-G-TEST12345"]).toBe(true);
});

it("defaults on without a prompt but respects browser privacy and earlier refusal", async () => {
  const a = await import("./analytics");
  expect(a.analyticsAllowed()).toBe(true);
  vi.stubGlobal("navigator", { doNotTrack: "1" });
  expect(a.analyticsAllowed()).toBe(false);
  vi.stubGlobal("navigator", { globalPrivacyControl: true });
  expect(a.analyticsAllowed()).toBe(false);
  vi.stubGlobal("navigator", {});
  memory.set("iota-analytics-consent-v1", "no");
  expect(a.analyticsAllowed()).toBe(false);
  memory.clear();
  window.location.hostname = "localhost";
  expect(a.analyticsAllowed()).toBe(false);
});

it("keeps only coarse acquisition categories, never source URLs or arbitrary campaign values", async () => {
  const { acquisitionSource } = await import("./analytics");
  expect(acquisitionSource("https://www.google.com/search?q=wallet-secret", "")).toBe("google");
  expect(acquisitionSource("https://chatgpt.com/c/private-chat", "")).toBe("chatgpt");
  expect(acquisitionSource("https://example.com/private", "?utm_source=alice@example.com")).toBe(
    "campaign_other",
  );
  expect(acquisitionSource("https://evilgoogle.com", "")).toBe("referral_other");
});
it("separates signup from returning login and never sends account identifiers", async () => {
  const a = await import("./analytics");
  memory.set("iota-ga4-login-pending", "999999:11111111-1111-4111-8111-111111111111");
  a.consumePendingLogin(1000000, new Date(1000000).toISOString());
  const queue = window.dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>));
  expect(queue.filter((x) => x[1] === "sign_up")).toHaveLength(1);
  expect(queue.filter((x) => x[1] === "login")).toHaveLength(0);
  a.failPendingLogin("login_failed");
  expect(queue.filter((x) => x[1] === "login_failed")).toHaveLength(0);
});
it("records a failed login only for a pending attempt and consumes it", async () => {
  const a = await import("./analytics");
  memory.set("iota-ga4-login-pending", "999999:11111111-1111-4111-8111-111111111111");
  a.failPendingLogin("login_canceled");
  a.failPendingLogin("login_canceled");
  const events = window
    .dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>))
    .filter((x) => x[1] === "login_failed");
  expect(events).toHaveLength(1);
  expect(JSON.stringify(events)).not.toContain("11111111");
});
it("excludes background prices, empty queries and arbitrary project names from query events", async () => {
  const { queryAnalyticsProject } = await import("./analytics");
  expect(queryAnalyticsProject(["iota", "usd-price"])).toBe(null);
  expect(queryAnalyticsProject(["iota", "discovery", ""])).toBe(null);
  expect(queryAnalyticsProject(["pool-account", "bnt", "private-wallet"])).toBe("bnt");
  expect(queryAnalyticsProject(["pool-account", "erg", "private-wallet"])).toBe("erg");
  expect(queryAnalyticsProject(["pool-account", "zeph", "private-wallet"])).toBe("zeph");
  expect(queryAnalyticsProject(["pool-account", "btc", "private-wallet"])).toBe("btc");
  expect(queryAnalyticsProject(["pool-account", "ethw", "private-wallet"])).toBe("ethw");
  expect(queryAnalyticsProject(["pool-account", "alice@example.com", "private-wallet"])).toBe(null);
});
