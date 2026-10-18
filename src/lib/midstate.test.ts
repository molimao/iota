import { it, expect } from "vitest";
import { parseMidstate, poolHashrate } from "./pool-monitor";
import { parseFleet } from "./fleet";
import { projectAddressInput } from "./project-address-input";
import { validPoolAddress, poolAccountUrl } from "./pool-projects";
import { fleetMutationSchema } from "./fleet-policy";
import { projectsSeo } from "@/components/projects-seo";
import { getArticle } from "@/components/site/articles";
import { guidesForProject } from "@/components/site/project-guides";
import { LOCALES } from "./site";
import { buildSitemapXml, buildArticleMarkdown } from "./crawl";
const address = "ab".repeat(32),
  now = Date.UTC(2026, 9, 17, 3);
const fixture = () => ({
  stats: { wallet: address, hashrate: 301, unlocked: 1024, locked: 1048576, paid: 1073741824 },
  workers: [{ name: "rig-1", hashrate: 301, lastShare: String(now - 1000) }],
  rewardStats: [{ period: "24h", amount: 1048576, startTime: now - 86400000, endTime: now }],
  payments: [`${now}:transaction:1073741824:0`],
});
it("keeps MDS base units, earned allocation and paid transfers distinct", () => {
  const d = parseMidstate(fixture(), address, now);
  expect(d.balance).toBe(1049600);
  expect(d.paid).toBe(1073741824);
  expect(d.reward).toBe(1048576);
  expect(d.period).toBe("rolling24h");
  expect(d.workers[0]?.online).toBe(true);
  expect(d.partial).toBe(false);
  expect(poolHashrate("mds", 301)).toBe("301 nonces/s");
});
it("does not turn missing allocations, bad units or incomplete periods into zero", () => {
  expect(parseMidstate({ ...fixture(), rewardStats: [] }, address, now).reward).toBeNull();
  expect(
    parseMidstate({ ...fixture(), rewardStats: [{ period: "24h", amount: 3 }] }, address, now)
      .reward,
  ).toBeNull();
  expect(
    parseMidstate(
      { ...fixture(), stats: { ...fixture().stats, paid: Number.MAX_SAFE_INTEGER + 1 } },
      address,
      now,
    ).paid,
  ).toBeNull();
  expect(() => parseMidstate(fixture(), "cd".repeat(32), now)).toThrow("invalid-data");
  expect(() => parseMidstate({ error: "Address not found" }, address, now)).toThrow("not-found");
});
it("does not treat missing or future worker timestamps as live heartbeats", () => {
  const d = parseMidstate(
    {
      ...fixture(),
      workers: [
        { name: "old", lastShare: now - 1800000, hashrate: 0 },
        { name: "future", lastShare: now + 1000 },
        { name: "missing" },
      ],
    },
    address,
    now,
  );
  expect(d.workers.map((w) => w.online)).toEqual([false, null, null]);
});
it("saves multiple MDS addresses with fixed pool identity and validates input before querying", () => {
  const second = "cd".repeat(32);
  expect(projectAddressInput("mds", `${address}\n${second}`, [], 5)).toEqual([address, second]);
  for (const bad of [
    "https://attacker.invalid/",
    address + "?x=1",
    address + "/",
    "0x" + address,
    "<script>",
    "f".repeat(63),
  ])
    expect(validPoolAddress("mds", bad)).toBe(false);
  const binding = { id: "b", project: "mds", identifier: address, worker: "rig-1" };
  const d = parseFleet([{ id: "d", name: "MDS rig", createdAt: 1, bindings: [binding] }]);
  expect(d[0]?.bindings[0]?.pool).toBe("luckypool");
  expect(() => parseFleet([{ ...d[0], bindings: [{ ...binding, pool: "kryptex" }] }])).toThrow();
  expect(
    fleetMutationSchema.parse({
      action: "create",
      payload: { name: "MDS", binding: { project: "mds", identifier: address, pool: "luckypool" } },
    }).payload,
  ).toBeTruthy();
  expect(poolAccountUrl("mds", address)).toContain("midstate.luckypool.io/miner-stats?address=");
});
it("connects the five-language MDS tool, guide, sitemap and text export", () => {
  const article = getArticle("midstate-mds-monitor-guide")!;
  expect(guidesForProject("mds").some((a) => a.slug === article.slug)).toBe(true);
  for (const locale of LOCALES) {
    const metadata = projectsSeo(locale, "mds");
    expect(metadata.meta[0]).toBeTruthy();
    expect(buildSitemapXml()).toContain(`/${locale}/projects/mds`);
    expect(buildSitemapXml()).toContain(`/${locale}/learn/${article.slug}`);
    expect(buildArticleMarkdown(article, locale)).toContain("1,048,576");
    expect(article.title[locale]).not.toBe("");
  }
});
it.skipIf(process.env["MDS_LIVE"] !== "1")(
  "reads a public LuckyPool block sample through the real server adapter",
  async () => {
    const stats = (await fetch("https://midstate.luckypool.io/api/stats?v=2").then((r) =>
      r.json(),
    )) as { blocks: { miner: string }[] };
    const sample = stats.blocks[0]!.miner.replace(/^solo_/, "");
    expect(validPoolAddress("mds", sample)).toBe(true);
    const { readPoolAccount } = await import("./pool-monitor.server");
    const result = await readPoolAccount("mds", sample);
    expect(result.error).toBeNull();
    expect(result.data?.workerCount).toBeGreaterThanOrEqual(0);
    expect(result.data?.period).toBe("rolling24h");
  },
  30000,
);
