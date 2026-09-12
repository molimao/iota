import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  plausibleSn9Usd,
  readCoinGeckoSimple,
  readDexScreener,
} from "./iota-price-sources";
import { articleClusterMeta, articles, relatedArticles } from "../components/site/articles";
import { profileFromUser } from "./auth-profile";
import { buildLlmsFullTxt, buildLlmsTxt, buildRobotsTxt, buildSitemapXml, crawlPages } from "./crawl";
import { ORIGIN, originFromRequest } from "./site";
import {
  sumTodayUnits,
  aggregateUnits,
  hongKongDayStartSeconds,
  formatUsd,
  iotaUnitsToUsd,
  UNIT_SCALE,
} from "./earnings";
import { withDeadline } from "./deadline";
import {
  computeStatus,
  latestValidClock,
  REFRESH_INTERRUPTED_MS,
  resolveLastSuccessfulFetchAt,
  validFetchedAt,
} from "./device-status";
import { hintRunIdsFromDevices, mergeDiscovery, orderActiveRuns } from "./iota-discover";
import { addEntry, parseWatchlist, serializeExport, importDevices } from "./watchlist";
import { base58 } from "@scure/base";
import { blake2b } from "@noble/hashes/blake2.js";
function address(n: number) {
  const body = new Uint8Array(33);
  body[0] = 42;
  body.fill(n, 1);
  const prefix = new TextEncoder().encode("SS58PRE");
  const input = new Uint8Array(prefix.length + body.length);
  input.set(prefix);
  input.set(body, prefix.length);
  const hash = blake2b(input, { dkLen: 64 });
  const full = new Uint8Array(35);
  full.set(body);
  full.set(hash.slice(0, 2), 33);
  return base58.encode(full);
}
describe("earnings accounting", () => {
  it("uses Hong Kong midnight, excludes future and frozen rows", () => {
    const now = Date.parse("2026-09-12T00:30:00Z");
    const start = hongKongDayStartSeconds(now);
    expect(
      sumTodayUnits(
        {
          alpha_amounts: [1, 2, 4, 8, 16],
          timestamps: [start - 1, start, start + 1, now / 1000 + 1, start + 2],
          statuses: ["settled", "pending", "settled", "settled", "frozen"],
        },
        now,
      ).units,
    ).toBe(600000000);
  });
  it("distinguishes missing and zero and partial totals", () => {
    expect(sumTodayUnits(null).units).toBeNull();
    expect(sumTodayUnits({ alpha_amounts: [], timestamps: [], statuses: [] }).units).toBe(0);
    expect(aggregateUnits([null, 0, 100])).toEqual({
      units: 100,
      known: 2,
      total: 3,
      partial: true,
    });
  });
  it("converts IOTA units to USD without inventing a price", () => {
    expect(iotaUnitsToUsd(2 * UNIT_SCALE, 5.5)).toBe(11);
    expect(iotaUnitsToUsd(null, 5.5)).toBeNull();
    expect(iotaUnitsToUsd(UNIT_SCALE, null)).toBeNull();
    expect(formatUsd(11)).toBe("$11.00");
    expect(formatUsd(null)).toBe("—");
  });
});
it("old statistical sample does not imply offline", () => {
  expect(
    computeStatus({
      miner: { timestamp: 1, is_active: true, throughput: 4 } as never,
      fullCoverage: true,
      lastSuccessfulFetchAt: Date.parse("2026-09-12T10:00:00Z"),
      now: Date.parse("2026-09-12T10:00:01Z"),
    }),
  ).toBe("contributing");
});
it("marks refresh interrupted after five minutes without a real fetch clock", () => {
  const now = Date.parse("2026-09-12T10:00:00Z");
  expect(
    computeStatus({
      miner: { timestamp: 1, is_active: true, throughput: 4 } as never,
      fullCoverage: true,
      lastSuccessfulFetchAt: now - REFRESH_INTERRUPTED_MS - 1,
      now,
    }),
  ).toBe("refresh_interrupted");
  expect(validFetchedAt(0)).toBeNull();
  expect(validFetchedAt(1_726_000_000)).toBeNull();
});
it("counts a successful dashboard query as a fresh fetch even if miner stamps are old", () => {
  const now = Date.parse("2026-09-12T10:00:00Z");
  expect(
    resolveLastSuccessfulFetchAt({
      querySuccess: true,
      queryUpdatedAt: now,
      deviceFetchedAt: now - REFRESH_INTERRUPTED_MS - 1,
      discoveryFetchedAt: now - REFRESH_INTERRUPTED_MS - 1,
    }),
  ).toBe(now);
  expect(
    resolveLastSuccessfulFetchAt({
      querySuccess: false,
      queryUpdatedAt: now,
      deviceFetchedAt: now - REFRESH_INTERRUPTED_MS - 1,
      discoveryFetchedAt: null,
    }),
  ).toBe(now - REFRESH_INTERRUPTED_MS - 1);
  expect(latestValidClock(now - 1000, null, now)).toBe(now);
  expect(
    computeStatus({
      miner: { timestamp: 1, is_active: true, throughput: 4 } as never,
      fullCoverage: true,
      lastSuccessfulFetchAt: now - REFRESH_INTERRUPTED_MS - 1,
      now,
      fetching: true,
    }),
  ).toBe("contributing");
});
it("rejects work that misses the deadline and keeps a finished result", async () => {
  await expect(withDeadline(Promise.resolve(7), 50, "超时")).resolves.toBe(7);
  await expect(withDeadline(new Promise(() => {}), 20, "超时")).rejects.toThrow("超时");
});
it("keeps the last miner when a later discovery poll comes back empty", () => {
  const previous = {
    devices: [
      {
        hotkey: "a",
        miner: { hotkey: "a", is_active: true, throughput: 1 } as never,
        fetchedAt: 1_800_000_000_000,
        runIds: ["r1"],
      },
    ],
    runs: [],
    runsTotal: 1,
    runsFetched: 0,
    fullCoverage: false,
    fetchedAt: 1_800_000_000_000,
    errors: [],
  };
  const next = {
    ...previous,
    devices: [{ hotkey: "a", miner: null, fetchedAt: null, runIds: [] }],
    fetchedAt: 1_800_000_100_000,
    errors: ["本次未在时限内读完官方名单"],
  };
  const merged = mergeDiscovery(next, previous);
  expect(merged.devices[0]?.miner).toEqual(previous.devices[0]?.miner);
  expect(merged.devices[0]?.runIds).toEqual(["r1"]);
  expect(merged.fetchedAt).toBe(1_800_000_100_000);
});
it("scans previously seen runs first so known devices do not wait on every task list", () => {
  const runs = [{ run_id: "a" }, { run_id: "b" }, { run_id: "c" }];
  expect(orderActiveRuns(runs, ["c", "b"]).map((run) => run.run_id)).toEqual(["b", "c", "a"]);
  expect(
    hintRunIdsFromDevices([
      { runIds: ["c"], miner: { run_id: "b" } },
      { runIds: ["c"], miner: { run_id: "c" } },
    ]),
  ).toEqual(["c", "b"]);
});
it("roundtrips more than three public IDs and prevents duplicates", () => {
  let entries: any[] = [];
  for (let n = 1; n <= 5; n++) {
    const result = addEntry(entries, { hotkey: address(n), label: `设备${n}` });
    expect(result.ok).toBe(true);
    if (result.ok) entries = result.value;
  }
  expect(entries.length).toBe(5);
  expect(addEntry(entries, { hotkey: address(1), label: "重复" }).ok).toBe(false);
  const result = importDevices([], serializeExport(entries));
  expect(result.ok && result.value.added).toBe(5);
  expect(parseWatchlist("bad").ok).toBe(false);
});

describe("crawl assets for GSC", () => {
  it("lists every indexable locale URL and never includes the dashboard", () => {
    const xml = buildSitemapXml();
    expect(crawlPages).toHaveLength(5 + articles.length);
    expect(xml.match(/<url>/g)?.length).toBe(crawlPages.length * 2);
    expect(ORIGIN).toBe("https://iotahome.site");
    expect(xml).toContain(`${ORIGIN}/zh/learn/iota-train-at-home-vs-iota-coin`);
    expect(xml).toContain(`${ORIGIN}/en/learn/iota-rewards-in-usd`);
    expect(xml).toContain(`${ORIGIN}/zh/learn/what-refresh-interrupted-means`);
    expect(xml).toContain(`${ORIGIN}/en/learn/what-is-sn9-iota`);
    expect(xml).toContain(`${ORIGIN}/zh/learn/google-account-device-list`);
    expect(xml).toContain(`${ORIGIN}/en/learn/device-not-found`);
    expect(xml).not.toContain("lovable.app");
    expect(xml).not.toContain("/app");
    expect(xml).not.toContain(`${ORIGIN}</loc>`);
  });

  it("keeps production crawl URLs on iotahome.site and only follows localhost", () => {
    expect(originFromRequest()).toBe(ORIGIN);
    expect(originFromRequest(new Request("https://iota-my-watch.lovable.app/sitemap.xml"))).toBe(ORIGIN);
    expect(originFromRequest(new Request("https://www.iotahome.site/sitemap.xml"))).toBe(ORIGIN);
    expect(originFromRequest(new Request("http://127.0.0.1:5179/sitemap.xml"))).toBe("http://127.0.0.1:5179");
    expect(buildSitemapXml("http://127.0.0.1:5179")).toContain("http://127.0.0.1:5179/zh");
  });

  it("groups every learn article into a crawlable cluster with related links", () => {
    const clustered = Object.values(articleClusterMeta).flatMap((item) => item.slugs);
    expect(new Set(clustered).size).toBe(articles.length);
    expect(clustered).toHaveLength(articles.length);
    expect(relatedArticles("what-refresh-interrupted-means").map((item) => item.slug)).toContain(
      "device-status",
    );
  });

  it("tells Googlebot to skip the dashboard", () => {
    const robots = buildRobotsTxt();
    expect(robots).toContain("User-agent: Googlebot");
    expect(robots).toContain("Disallow: /zh/app");
    expect(robots).toContain("Disallow: /zh/account");
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

it("accepts SN9 market quotes and rejects the Layer 1 IOTA price", () => {
  expect(readCoinGeckoSimple({ "iota-2": { usd: 5.8 } })).toBe(5.8);
  expect(readCoinGeckoSimple({ iota: { usd: 0.12 } })).toBeNull();
  expect(plausibleSn9Usd(0.05)).toBe(false);
  expect(
    readDexScreener({
      pairs: [
        {
          chainId: "bittensor",
          baseToken: { symbol: "SN9", name: "iota" },
          priceUsd: "5.8",
          liquidity: { usd: 400000 },
        },
        {
          chainId: "ethereum",
          baseToken: { symbol: "IOTA", name: "IOTA" },
          priceUsd: "0.12",
          liquidity: { usd: 9_000_000 },
        },
      ],
    }),
  ).toBe(5.8);
});

it("reads the Google display name instead of only the user id", () => {
  expect(
    profileFromUser({
      id: "user-1",
      email: "ada@example.com",
      user_metadata: { full_name: "Ada Lovelace", avatar_url: "https://example.com/a.png" },
    } as never),
  ).toEqual({
    userId: "user-1",
    email: "ada@example.com",
    name: "Ada Lovelace",
    avatarUrl: "https://example.com/a.png",
  });
});

  it("keeps public crawl files aligned with the generator", () => {
    expect(readFileSync("public/sitemap.xml", "utf8")).toBe(buildSitemapXml());
    expect(readFileSync("public/robots.txt", "utf8")).toBe(buildRobotsTxt());
    expect(readFileSync("public/llms.txt", "utf8")).toBe(buildLlmsTxt());
    expect(readFileSync("public/llms-full.txt", "utf8")).toBe(buildLlmsFullTxt());
  });
});
