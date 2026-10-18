import { expect, it } from "vitest";
import { parseCsd, normalizeCsdAddress, validCsdAddress } from "./csd";
import { parseFleet } from "./fleet";
import { validPoolAddress } from "./pool-projects";
import { projectAddressInput } from "./project-address-input";
import { buildSitemapXml } from "./crawl";
import { projectsSeo } from "@/components/projects-seo";
import { guidesForProject } from "@/components/site/project-guides";
import { LOCALES } from "./site";
const id = "a1".repeat(20),
  now = Date.UTC(2026, 9, 18, 6);
const account = () => ({
  address: id,
  owed_sat: 123456789,
  pending_sat: 200000000,
  lifetime_paid_sat: 987654321,
  shares_accepted: 10,
  payments: [{ amount_sat: 987654321 }],
  est_csd_per_hour: 9999,
  rigs: [{ rig: "GPU", last_seen: now / 1000 - 2 }],
});
const rates = () => ({
  now: now / 1000,
  win: { "1h": [{ m: id, hr1h: 1.2e9, hr5m: 9e9 }] },
  rigs: { [id]: [{ rig: "GPU", hr1h: 1.2e9 }] },
});
it("uses 1-hour H/s and atomic money without promoting window estimates to ledger income", () => {
  expect(parseCsd(account(), rates(), id, now)).toMatchObject({
    hashrate: 1.2e9,
    balance: 1.23456789,
    paid: 9.87654321,
    pendingEstimate: 2,
    reward: null,
    period: "unknown",
    partial: false,
  });
  expect(parseCsd(account(), rates(), id, now).workers[0]).toMatchObject({
    name: "GPU",
    hashrate: 1.2e9,
    online: true,
  });
});
it("normalizes prefix/case and prevents duplicate saved accounts and unsafe input", () => {
  const alias = "0x" + id.toUpperCase();
  expect(normalizeCsdAddress(alias)).toBe(id);
  expect(validCsdAddress(alias)).toBe(true);
  const d = parseFleet([
    {
      id: "d",
      name: "CSD",
      createdAt: 1,
      bindings: [{ id: "b", project: "csd", identifier: alias, worker: "" }],
    },
  ]);
  expect(d[0]!.bindings[0]).toMatchObject({ identifier: id, pool: "gpools" });
  expect(() => projectAddressInput("csd", id + "\n" + alias, [], 5)).toThrow("duplicate");
  expect(projectAddressInput("csd", id + "\n" + "b2".repeat(20), [], 5)).toHaveLength(2);
  for (const bad of [
    id + "/",
    id + "?x=1",
    "solo:" + id,
    "https://evil.invalid",
    "<script>",
    "f".repeat(39),
  ])
    expect(validPoolAddress("csd", bad)).toBe(false);
});
it("keeps stale/missing compute and unsafe money unknown while preserving available balances", () => {
  const stale = parseCsd(account(), { ...rates(), now: now / 1000 - 301 }, id, now);
  expect(stale.hashrate).toBeNull();
  expect(stale.workers[0]!.hashrate).toBeNull();
  expect(stale.balance).toBe(1.23456789);
  expect(
    parseCsd({ ...account(), owed_sat: Number.MAX_SAFE_INTEGER + 1 }, rates(), id, now).balance,
  ).toBeNull();
  expect(parseCsd(account(), null, id, now).hashrate).toBeNull();
  expect(() => parseCsd({ ...account(), address: "b2".repeat(20) }, rates(), id, now)).toThrow(
    "invalid-data",
  );
});
it("publishes a tool and a distinct guide in all five languages", () => {
  const xml = buildSitemapXml();
  for (const locale of LOCALES) {
    expect(xml.includes(`/${locale}/projects/csd`)).toBe(true);
    expect(xml.includes(`/${locale}/learn/csd-gpools-monitor-guide`)).toBe(true);
    expect(projectsSeo(locale, "csd").meta[0]).toHaveProperty("title");
    expect(guidesForProject("csd").some((a) => a.slug === "csd-gpools-monitor-guide")).toBe(true);
  }
});
it.skipIf(process.env["CSD_LIVE_TEST"] !== "1")(
  "reads a public G-pools leaderboard sample via the live adapter",
  async () => {
    const { readPoolAccount } = await import("./pool-monitor.server");
    const data = await readPoolAccount("csd", "50d93bfc5e73795f0262ecf74c8213ae09668612");
    expect(data.error).toBeNull();
    expect(data.data?.paid).not.toBeNull();
    expect(data.data).toMatchObject({ reward: null, period: "unknown" });
  },
  30000,
);
