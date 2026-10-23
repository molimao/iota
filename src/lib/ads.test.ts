import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { articles } from "../components/site/articles";
import { blogPosts } from "../components/site/blog-posts";
import { publicArticlePaths } from "./ad-article-paths";
import { adEligible } from "./ads";
import type { BillingSummary } from "./plans";
import { LOCALES } from "./site";

const input = {
  enabled: true,
  hostname: "iotahome.site",
  pathname: "/zh/learn/find-miner-id",
  client: "ca-pub-5017554552450609",
  authReady: true,
  userId: null as string | null,
  billingReady: false,
  privacyBlocked: false,
};

it("allows only existing public learn and blog articles in every locale", () => {
  const expected = [
    ...articles.map((article) => `/learn/${article.slug}`),
    ...blogPosts.map((post) => `/blog/${post.slug}`),
  ].sort();
  expect([...publicArticlePaths].sort()).toEqual(expected);
  expect(readFileSync(new URL("./ad-article-paths.ts", import.meta.url), "utf8")).not.toMatch(
    /## |body:/,
  );
  for (const locale of LOCALES) {
    expect(adEligible({ ...input, pathname: `/${locale}/learn/find-miner-id` })).toBe(true);
    expect(adEligible({ ...input, pathname: `/${locale}/learn/nosana-monitor-guide` })).toBe(true);
    expect(
      adEligible({ ...input, pathname: `/${locale}/blog/monitor-multiple-iota-devices` }),
    ).toBe(true);
  }
  expect(adEligible({ ...input, hostname: "www.iotahome.site" })).toBe(true);
  expect(adEligible({ ...input, enabled: false })).toBe(false);
  expect(adEligible({ ...input, hostname: "localhost" })).toBe(false);
});

it("ignores ordinary query and hash, and excludes unknown, listing, login, dashboard and tool paths", () => {
  expect(adEligible({ ...input, pathname: "/en/learn/how-rewards-work?utm=ads" })).toBe(true);
  expect(adEligible({ ...input, pathname: "/ja/blog/iota-waiting-for-tasks#checks" })).toBe(true);
  expect(adEligible({ ...input, pathname: "/zh/learn/how-rewards-work?utm=ads#day" })).toBe(true);
  for (const pathname of [
    "/zh/learn/not-a-real-article",
    "/zh/blog/not-a-real-article",
    "/zh/learn/not-a-real-article?q=1",
    "/zh/learn",
    "/zh/learn/",
    "/zh/learn?topic=rewards",
    "/zh/blog",
    "/zh/blog/",
    "/zh/login",
    "/zh/account",
    "/zh/devices",
    "/zh/app",
    "/zh/overview",
    "/zh/machines",
    "/zh/projects",
    "/zh/projects/iota",
    "/zh/projects/nosana?address=abc",
    "/zh/privacy",
    "/zh/downloads",
    "/zh/review",
    "/zh/review-pools",
    "/zh/faq",
    "/zh/guide",
    "/zh/network",
    "/zh",
    "/zh/learn/find-miner-id/",
    "/zh/learn/find-miner-id/extra",
    "/fr/learn/find-miner-id",
    "?address=abc",
  ])
    expect(adEligible({ ...input, pathname })).toBe(false);
});

it("fails closed until auth and membership resolve; Pro including trialing gets no ads", () => {
  expect(adEligible({ ...input, authReady: false })).toBe(false);
  expect(adEligible({ ...input, userId: "user" })).toBe(false);
  expect(adEligible({ ...input, userId: "user", billingReady: false })).toBe(false);
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
