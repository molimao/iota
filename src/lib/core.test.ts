import { blogPosts } from "../components/site/blog-posts";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { plausibleSn9Usd, readCoinGeckoSimple, readDexScreener } from "./iota-price-sources";
import { articleClusterMeta, articles, relatedArticles } from "../components/site/articles";
import { profileFromUser } from "./auth-profile";
import {
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemapXml,
  crawlPages,
} from "./crawl";
import { ORIGIN, originFromRequest } from "./site";
import {
  sumTodayUnits,
  aggregateUnits,
  hongKongDayStartSeconds,
  formatUsd,
  iotaUnitsToUsd,
  UNIT_SCALE,
} from "./earnings";
import { localizeMessage } from "../components/site/locale";
import { diagnoseDevice } from "./diagnose";
import { aggregateFarmMiners, summarizeFarm } from "./farm";
import { formatAgo } from "./format";
import { withDeadline } from "./deadline";
import {
  computeStatus,
  latestValidClock,
  officialSignals,
  REFRESH_INTERRUPTED_MS,
  resolveLastSuccessfulFetchAt,
  validFetchedAt,
} from "./device-status";
import { hintRunIdsFromDevices, mergeDiscovery, orderActiveRuns } from "./iota-discover";
import {
  addEntry,
  parseWatchlist,
  serializeExport,
  importDevices,
  type WatchEntry,
} from "./watchlist";
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
it("splits official online from whether the last sample had training work", () => {
  expect(officialSignals(null)).toEqual({ online: "unknown", training: "unknown" });
  expect(officialSignals({ is_active: true, throughput: 4 } as never)).toEqual({
    online: "yes",
    training: "yes",
  });
  expect(officialSignals({ is_active: true, throughput: 0 } as never)).toEqual({
    online: "yes",
    training: "no",
  });
  expect(officialSignals({ is_active: false, throughput: 80 } as never)).toEqual({
    online: "no",
    training: "yes",
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
it("does not let an application query renew an old official fetch clock", () => {
  const now = Date.parse("2026-09-12T10:00:00Z");
  expect(
    resolveLastSuccessfulFetchAt({
      querySuccess: true,
      queryUpdatedAt: now,
      deviceFetchedAt: now - REFRESH_INTERRUPTED_MS - 1,
      discoveryFetchedAt: now - REFRESH_INTERRUPTED_MS - 1,
    }),
  ).toBe(now - REFRESH_INTERRUPTED_MS - 1);
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
  ).toBe("refresh_interrupted");
});
it("translates composed dashboard errors and relative time for English", () => {
  expect(localizeMessage("请求超时", "en")).toBe("Request timed out");
  expect(localizeMessage("训练任务列表：请求超时", "en")).toBe("Runs list: Request timed out");
  expect(localizeMessage("任务 abc：请求排队超时", "en")).toBe("Run abc: Request queued too long");
  expect(localizeMessage("状态连接失败：请求超时", "en")).toBe(
    "Could not load status: Request timed out",
  );
  expect(localizeMessage("收益 5Fxxx…：请求超时", "en")).toBe("Rewards 5Fxxx…: Request timed out");
  expect(localizeMessage("格式不对：含有无效字符", "en")).toBe(
    "Invalid characters in that Miner ID",
  );
  expect(localizeMessage("请求超时", "zh")).toBe("请求超时");
  const now = Date.parse("2026-09-12T10:12:00Z");
  expect(formatAgo(now - 12 * 60_000, now, "en")).toBe("12 min ago");
  expect(formatAgo(now - 12 * 60_000, now, "zh")).toBe("12 分钟前");
  expect(formatAgo(null, now, "en")).toBe("No data yet");
});
it("summarizes official occupancy into farm totals", () => {
  const farm = summarizeFarm(
    {
      run_ids: ["4.12.16.2-tah", "4.12.16.1-tah"],
      max_miners: [120, 100],
      active_miners: [115, 45],
      slots_remaining: [5, 55],
    },
    [
      {
        run_id: "4.12.16.1-tah",
        name: "4.12.16.1-tah",
        state: "active",
        metadata: {
          model_name: "Llama-3.2-1B",
          model_size: "1B",
          n_splits: 3,
          description: "1B - Tier 0 (Bronze)",
        },
      },
      {
        run_id: "4.12.16.2-tah",
        name: "4.12.16.2-tah",
        state: "active",
        metadata: {
          model_name: "Llama-3.2-1B",
          model_size: "1B",
          n_splits: 3,
          description: "1B - Tier 1 (Silver)",
        },
      },
    ],
    {
      "4.12.16.1-tah": {
        activation_count: 100,
        total_activations: 1000,
        token_count: 80,
        total_tokens: 1000,
        loss: 6.2,
      },
      "4.12.16.2-tah": {
        activation_count: 200,
        total_activations: 1000,
        token_count: 120,
        total_tokens: 1000,
        loss: 6.8,
      },
    },
    { "4.12.16.1-tah": 2 },
    aggregateFarmMiners([
      {
        runId: "4.12.16.1-tah",
        miners: [
          { is_active: true, throughput: 2, location_country: "China" } as never,
          { is_active: true, throughput: 0, location_country: "Japan" } as never,
          { is_active: false, throughput: 0, location_country: "China" } as never,
        ],
      },
    ]),
  );
  expect(farm).toMatchObject({
    activeRuns: 2,
    fullRuns: 0,
    activeMiners: 160,
    maxMiners: 220,
    slotsRemaining: 60,
    tokens: 200,
    totalTokens: 2000,
    lossMin: 6.2,
    lossMax: 6.8,
    modelLabel: "Llama-3.2-1B",
    modelSize: "1B",
    splits: 3,
    online: 2,
    training: 1,
  });
  expect(
    farm?.runs.map((run) => [run.runId, run.tier, run.mineCount, run.online, run.training]),
  ).toEqual([
    ["4.12.16.1-tah", "Bronze", 2, 2, 1],
    ["4.12.16.2-tah", "Silver", 0, null, null],
  ]);
  expect(farm?.countries[0]).toEqual({ country: "China", count: 2 });
  expect(summarizeFarm(null, [])).toBeNull();
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
  let entries: WatchEntry[] = [];
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
    expect(crawlPages).toHaveLength(11 + articles.length + blogPosts.length);
    expect(xml.match(/<url>/g)?.length).toBe(crawlPages.length * 5);
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
    expect(originFromRequest(new Request("https://iota-my-watch.lovable.app/sitemap.xml"))).toBe(
      ORIGIN,
    );
    expect(originFromRequest(new Request("https://www.iotahome.site/sitemap.xml"))).toBe(ORIGIN);
    expect(originFromRequest(new Request("http://127.0.0.1:5179/sitemap.xml"))).toBe(
      "http://127.0.0.1:5179",
    );
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

  it("lets search crawlers read noindex HTML but skips server RPC", () => {
    const robots = buildRobotsTxt();
    expect(robots).toContain("User-agent: Googlebot");
    expect(robots).not.toContain("Disallow: /zh/app");
    expect(robots).not.toContain("Disallow: /zh/account");
    expect(robots).toContain("User-agent: OAI-SearchBot");
    expect(robots).toContain("Disallow: /_serverFn/");
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

  describe("reward troubleshooting", () => {
    const earnings = (
      over: Partial<Parameters<typeof diagnoseDevice>[0]["earnings"] & object> = {},
    ) => ({
      hotkey: "5abc",
      totalEarnedUnits: 100,
      todayUnits: 10,
      pendingUnits: 0,
      frozenUnits: 0,
      minimumPayoutUnits: 0,
      historyCount: 1,
      recent: [],
      fetchedAt: 1,
      error: null,
      ...over,
    });

    it("blames the site, not the machine, when our own refresh stalled", () => {
      const result = diagnoseDevice({
        status: "refresh_interrupted",
        miner: null,
        earnings: earnings(),
        earningsUsable: true,
      });
      expect(result.primary.code).toBe("refresh_interrupted");
      expect(result.tone).toBe("info");
    });

    it("treats a device missing from every roster as worth acting on", () => {
      const result = diagnoseDevice({
        status: "not_found",
        miner: null,
        earnings: null,
        earningsUsable: false,
      });
      expect(result.primary.code).toBe("not_found");
      expect(result.tone).toBe("warn");
      expect(result.primary.slug).toBe("device-not-found");
    });

    it("explains a training device that has not been credited today", () => {
      const result = diagnoseDevice({
        status: "contributing",
        miner: null,
        earnings: earnings({ todayUnits: 0 }),
        earningsUsable: true,
      });
      expect(result.notes.map((note) => note.code)).toEqual(["no_today_rewards"]);
      expect(result.tone).toBe("info");
    });

    it("points at the payout threshold when pending has not cleared it", () => {
      const result = diagnoseDevice({
        status: "contributing",
        miner: null,
        earnings: earnings({ pendingUnits: 50_000_000, minimumPayoutUnits: 100_000_000 }),
        earningsUsable: true,
      });
      const note = result.notes.find((item) => item.code === "below_minimum_payout");
      expect(note?.cause.zh).toContain("0.5");
      expect(note?.cause.en).toContain("1");
    });

    it("stays quiet when the device is training and today is credited", () => {
      const result = diagnoseDevice({
        status: "contributing",
        miner: null,
        earnings: earnings(),
        earningsUsable: true,
      });
      expect(result.tone).toBe("ok");
      expect(result.notes).toHaveLength(1);
      expect(result.primary.code).toBe("ok");
    });

    it("flags stale rewards without inventing a device fault", () => {
      const result = diagnoseDevice({
        status: "contributing",
        miner: null,
        earnings: earnings({ error: "收益刷新超时" }),
        earningsUsable: false,
      });
      expect(result.notes.map((note) => note.code)).toEqual(["earnings_stale"]);
    });
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
