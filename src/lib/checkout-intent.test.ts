import { describe, expect, it } from "vitest";
import { readCheckoutIntent, checkoutInterval } from "./checkout-intent";
const now = 1000000;
const intent = (overrides = {}) =>
  JSON.stringify({ interval: "month", at: now, path: "/zh/devices", ...overrides });
const url = "https://iotahome.site/zh/devices?view=membership&checkout=month";
describe("purchase continuation", () => {
  it("retains the selected monthly plan after an authentication round trip", () => {
    expect(readCheckoutIntent(intent(), url, now + 100)).toBe("month");
    expect(checkoutInterval("month")).toBe("month");
  });
  it("never starts checkout from a URL alone or invalid storage", () => {
    expect(readCheckoutIntent(null, url, now)).toBeNull();
    expect(readCheckoutIntent("broken", url, now)).toBeNull();
    expect(readCheckoutIntent(intent({ interval: "other" }), url, now)).toBeNull();
  });
  it("rejects stale, future, different page or cadence intents", () => {
    expect(readCheckoutIntent(intent(), url, now + 600001)).toBeNull();
    expect(readCheckoutIntent(intent(), url, now - 1)).toBeNull();
    expect(readCheckoutIntent(intent({ path: "/en/devices" }), url, now)).toBeNull();
    expect(readCheckoutIntent(intent({ interval: "year" }), url, now)).toBeNull();
  });
  it("does not resume canceled or failed login", () => {
    expect(readCheckoutIntent(intent(), url + "#error=access_denied", now)).toBeNull();
    expect(readCheckoutIntent(intent(), url + "&error=server_error", now)).toBeNull();
  });
});

it("defaults to monthly but preserves an explicit annual selection", () => {
  expect(checkoutInterval(null)).toBe("month");
  expect(checkoutInterval("unknown")).toBe("month");
  expect(checkoutInterval("year")).toBe("year");
});
