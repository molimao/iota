import { afterEach, describe, expect, it, vi } from "vitest";
import { bech32m } from "@scure/base";
import {
  PROJECT_IDS,
  parseProjectList,
  parseQuantusAccount,
  parseQuantusNetwork,
  parseXidNetwork,
  qtcAmount,
  validProjectAddress,
} from "./projects";
import { cachedProjectRead } from "./projects-upstream.server";
import { projectsSeo } from "../components/projects-seo";
import { LOCALES, LANGUAGE_TAG } from "./site";
import { buildSitemapXml } from "./crawl";

const qtc = "qzmsbecAqfvgBYAtxKwSkbLTvsUrwPGykaVFvZpAf9Zj3SErv";
const xid = bech32m.encode("xpa", [3, ...bech32m.toWords(new Uint8Array(32).fill(4))]);
afterEach(() => vi.useRealTimers());

describe("separate project identities and currencies", () => {
  it("checks mainnet address checksums and rejects cross-project IDs and secrets", () => {
    expect(validProjectAddress("quantus", qtc)).toBe(true);
    expect(validProjectAddress("xid", xid)).toBe(true);
    expect(validProjectAddress("quantus", xid)).toBe(false);
    expect(validProjectAddress("xid", qtc)).toBe(false);
    expect(validProjectAddress("xid", xid.slice(0, -1) + "q")).toBe(false);
    expect(validProjectAddress("quantus", qtc.slice(0, -1) + "a")).toBe(false);
    expect(validProjectAddress("quantus", "0x" + "ab".repeat(32))).toBe(false);
    expect(() => parseProjectList("quantus", [{ address: xid, name: "wrong project" }])).toThrow();
    expect(PROJECT_IDS).toEqual(["iota", "xid", "quantus"]);
  });
  it("preserves exact QTC precision and never makes absent rewards zero", () => {
    expect(qtcAmount("123456789012345678901234")).toBe("123456789012.345678901234");
    expect(qtcAmount("310000000000")).toBe("0.31");
    expect(qtcAmount("0")).toBe("0");
    expect(qtcAmount(null)).toBeNull();
    expect(qtcAmount(310000000000)).toBeNull();
    const a = parseQuantusAccount(
      { account: null, today: { aggregate: { count: 0, sum: { reward: null } } }, recent: [] },
      qtc,
    );
    expect(a.found).toBe(false);
    expect(a.today).toBe("0");
    expect(a.lifetime).toBeNull();
    expect(() => parseQuantusAccount({ account: null, recent: [] }, qtc)).toThrow();
    expect(() =>
      parseQuantusAccount({ account: "bad", today: { aggregate: { count: 0 } }, recent: [] }, qtc),
    ).toThrow();
  });
});
describe("upstream coverage and freshness", () => {
  it("keeps pool metrics separate from chain estimates and missing fields unknown", () => {
    const n = parseXidNetwork(
      {
        height: 12,
        chain_hashrate_mhs: 7000,
        pool_hashrate_mhs: 200,
        active_miners: 4,
        updated: 100,
        leaderboard: [
          { address: xid, worker: "m4", hashrate_mhs: 0, reported_hashrate_mhs: null, last: 90 },
        ],
        chain_blocks: { [xid]: 0 },
      },
      { height: 12, series: [{ h: 12, d: 4 }] },
    );
    expect(n.chainHashrate).toBe(7000);
    expect(n.poolHashrate).toBe(200);
    expect(n.listedWorkers).toBe(4);
    expect(n.workers[0]!.hashrate).toBe(0);
    expect(n.workers[0]!.reportedHashrate).toBeNull();
    expect(n.balances[xid]).toBeUndefined();
    expect(n.sourceUpdatedAt).toBe(100000);
    expect(() => parseXidNetwork({ height: 12 }, { height: 12 })).toThrow();
  });
  it("does not infer device counts or hashrate from Quantus rewarded-address counts", () => {
    const n = parseQuantusNetwork({
      stats: { block_height: 3, total_miners: 9, total_accounts: 20 },
      blocks: [
        { height: 3, timestamp: "2026-10-03T10:00:30Z", reward: "310000000000" },
        { height: 2, timestamp: "2026-10-03T10:00:00Z", reward: "300000000000" },
      ],
    });
    expect(n.minersEverRewarded).toBe(9);
    expect(n.listedWorkers).toBeNull();
    expect(n.chainHashrate).toBeNull();
    expect(n.blockSeconds).toBe(30);
    expect(n.blocks[0]!.reward).toBe("0.31");
  });
  it("coalesces reads and retains the last successful clock on failure", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-03T10:00:00Z"));
    const read = vi.fn(async () => ({ height: 3 }));
    const [a, b] = await Promise.all([
      cachedProjectRead("test:freshness", read),
      cachedProjectRead("test:freshness", read),
    ]);
    expect(read).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
    vi.advanceTimersByTime(61000);
    const fail = await cachedProjectRead("test:freshness", async () => {
      throw new Error("network");
    });
    expect(fail.data).toEqual({ height: 3 });
    expect(fail.stale).toBe(true);
    expect(fail.fetchedAt).toBe(a.fetchedAt);
    const unavailable = await cachedProjectRead("test:no-data", async () => {
      throw new Error("invalid-data");
    });
    expect(unavailable.data).toBeNull();
    expect(unavailable.fetchedAt).toBeNull();
    expect(unavailable.error).toBe("invalid-data");
  });
});
describe("project discovery and SEO", () => {
  it("indexes localized project pages with distinct canonical identities", () => {
    const sitemap = buildSitemapXml();
    for (const locale of LOCALES)
      for (const project of [undefined, "xid", "quantus"] as const) {
        const seo = projectsSeo(locale, project),
          url = `https://iotahome.site/${locale}/projects${project ? `/${project}` : ""}`;
        expect(seo.links.find((l) => l.rel === "canonical")?.href).toBe(url);
        expect(seo.links.filter((l) => l.rel === "alternate")).toHaveLength(6);
        expect(sitemap).toContain(`<loc>${url}</loc>`);
        const schema = JSON.parse(seo.scripts[0]!.children);
        expect(schema.inLanguage).toBe(LANGUAGE_TAG[locale]);
        if (project) {
          expect(schema.about.name).toContain(project === "xid" ? "XID" : "Quantus");
          expect(schema.about.sameAs).not.toContain("macrocosmos");
        }
      }
  });
});
