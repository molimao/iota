import { expect, it } from "vitest";
import { adEligible } from "./ads";
import type { BillingSummary } from "./plans";
const input = {
  enabled: true,
  hostname: "iotahome.site",
  pathname: "/zh/learn/find-miner-id",
  client: "ca-pub-5017554552450609",
  slot: "1234567890",
  authReady: true,
  userId: null as string | null,
  billingReady: false,
  privacyBlocked: false,
};
it("allows configured public articles but excludes monitoring and private pages", () => {
  expect(adEligible(input)).toBe(true);
  for (const pathname of [
    "/zh/devices",
    "/zh/app",
    "/zh/privacy",
    "/zh/review",
    "/zh/blog",
    "/zh/projects/iota",
  ])
    expect(adEligible({ ...input, pathname })).toBe(false);
  expect(adEligible({ ...input, enabled: false })).toBe(false);
  expect(adEligible({ ...input, slot: "" })).toBe(false);
  expect(adEligible({ ...input, hostname: "localhost" })).toBe(false);
});
it("fails closed until auth and membership resolve; Pro including trialing gets no ads", () => {
  expect(adEligible({ ...input, authReady: false })).toBe(false);
  expect(adEligible({ ...input, userId: "user" })).toBe(false);
  for (const status of ["active", "trialing"])
    expect(
      adEligible({
        ...input,
        userId: "user",
        billingReady: true,
        billing: { plan: "pro", status } as BillingSummary,
      }),
    ).toBe(false);
  expect(
    adEligible({
      ...input,
      userId: "user",
      billingReady: true,
      billing: { plan: "free" } as BillingSummary,
    }),
  ).toBe(true);
  expect(adEligible({ ...input, privacyBlocked: true })).toBe(false);
});
