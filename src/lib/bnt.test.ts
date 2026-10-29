import { expect, it } from "vitest";
import { base58 } from "@scure/base";
import { sha3_256 } from "@noble/hashes/sha3.js";
import { validBntAddress, parseBnt } from "./bnt";
import { parseFleet } from "./fleet";
import { projectAddressInput } from "./project-address-input";
import { validPoolAddress, poolAccountUrl } from "./pool-projects";
import { projectsSeo } from "@/components/projects-seo";
import { guidesForProject } from "@/components/site/project-guides";
import { LOCALES } from "./site";
import { buildSitemapXml, buildLlmsFullTxt } from "./crawl";
// Public developer payout address from zpalmtree/seine src/dev_fee.rs, not a customer.
export const bntPublicAddress =
  "SEiNEceuDyfEY3GKDQAYVuK6382K2Ln2gQSv83ySAFkKhraBxhHnTf2P6PsF8CXtreqywg4T1qwBAjQo3L2VYDYWtsbb9";
const secondAddress =
  "NrncwqmoEJmNeCCe9sd4PWZeY7z47Ld3CZg3VsCceEk9AE7EkNwHxnCwqmHcQdFp5efvf9omYydNpKUFkJ6XFqXRoZPF";
const now = Date.UTC(2026, 9, 18, 6);
const miner = () => ({
  hashrate: 21.5,
  workers: [{ worker: "rig-one", hashrate: 21.5, last_share_at: now / 1000 - 5 }],
  shares: [{}],
  payouts: [{}],
  mining_since: { secs_since_epoch: now / 1000 - 86400 },
});
const balance = () => ({
  address: bntPublicAddress,
  balance: { pending_confirmed: 100000000, pending_queued: 20000000, paid: 987654321 },
  pending_estimate: { estimated_pending: 300000000 },
});
it("validates complete mainnet addresses and rejects bad checksums, testnet, URLs and shortnames", () => {
  expect(validBntAddress(bntPublicAddress)).toBe(true);
  for (const bad of [
    bntPublicAddress.slice(0, -1) + "1",
    "https://evil.invalid/",
    "@seine",
    bntPublicAddress + "?x=1",
    "<script>",
    "0x" + "a".repeat(40),
    bntPublicAddress + " ",
  ])
    expect(validPoolAddress("bnt", bad)).toBe(false);
  const bytes = base58.decode(bntPublicAddress),
    tag = new TextEncoder().encode("blocknet_stealth_address_checksumblocknet_testnet");
  expect(
    validBntAddress(
      base58.encode(
        new Uint8Array([
          ...bytes.slice(0, 64),
          ...sha3_256(new Uint8Array([...tag, ...bytes.slice(0, 64)])).slice(0, 4),
        ]),
      ),
    ),
  ).toBe(false);
});
it("converts atomic amounts exactly once and never calls immature or paid balances daily earnings", () => {
  const p = parseBnt(miner(), balance(), bntPublicAddress, now);
  expect(p).toMatchObject({
    balance: 1,
    queued: 0.2,
    paid: 9.87654321,
    pendingEstimate: 3,
    reward: null,
    period: "rolling24h",
    hashrate: 21.5,
    partial: false,
  });
  expect(p.workers[0]).toMatchObject({
    name: "rig-one",
    hashrate: 21.5,
    online: true,
    lastSeen: now - 5000,
  });
});
it("sums only confirmed payments in the rolling 24h window, independently of balances and fees", () => {
  const payout = (seconds: number, amount: number, confirmed = true) => ({
    timestamp: { secs_since_epoch: seconds, nanos_since_epoch: 0 }, amount, fee: 1000, confirmed,
  });
  const p = parseBnt({ ...miner(), payouts: [
    payout(now / 1000 - 10, 120000000),
    payout(now / 1000 - 3600, 230000000),
    payout(now / 1000 - 20, 990000000, false),
    payout(now / 1000 - 86400, 500000000),
    payout(now / 1000 + 1, 600000000),
  ] }, balance(), bntPublicAddress, now);
  expect(p.reward).toBeCloseTo(3.5, 8);
  expect(p.balance).toBe(1);
  expect(p.paid).toBe(9.87654321);
  expect(p.period).toBe("rolling24h");
});
it("keeps a truncated payout window unknown and accepts a complete empty payment history", () => {
  const payouts = Array.from({ length: 50 }, (_, i) => ({
    timestamp: { secs_since_epoch: now / 1000 - i * 60 }, amount: 100000000, confirmed: true,
  }));
  expect(parseBnt({ ...miner(), payouts }, balance(), bntPublicAddress, now).reward).toBeNull();
  payouts[49]!.timestamp.secs_since_epoch = now / 1000 - 86401;
  expect(parseBnt({ ...miner(), payouts }, balance(), bntPublicAddress, now).reward).toBe(49);
  expect(parseBnt({ ...miner(), payouts: [] }, balance(), bntPublicAddress, now).reward).toBe(0);
});
it("preserves missing balances and unsafe amounts as unknown while retaining available hashrate", () => {
  expect(parseBnt(miner(), null, bntPublicAddress, now)).toMatchObject({
    balance: null,
    paid: null,
    pendingEstimate: null,
    partial: true,
    hashrate: 21.5,
  });
  expect(
    parseBnt(
      miner(),
      { ...balance(), balance: { paid: Number.MAX_SAFE_INTEGER + 1 } },
      bntPublicAddress,
      now,
    ).paid,
  ).toBeNull();
  expect(() =>
    parseBnt(miner(), { ...balance(), address: "wrong" }, bntPublicAddress, now),
  ).toThrow("invalid-data");
  const p = parseBnt(
    {
      ...miner(),
      workers: [
        { worker: "future", last_share_at: now / 1000 + 5 },
        { worker: "old", last_share_at: now / 1000 - 3600 },
        { worker: "missing" },
      ],
    },
    balance(),
    bntPublicAddress,
    now,
  );
  expect(p.workers.map((w) => w.online)).toEqual([null, false, null]);
});
it("saves multiple addresses with fixed pool identity, supports multiline entry and rejects the wrong pool", () => {
  const devices = parseFleet([
    {
      id: "a",
      name: "CPU",
      createdAt: 1,
      bindings: [{ id: "b", project: "bnt", identifier: bntPublicAddress, worker: "one" }],
    },
  ]);
  expect(devices[0]!.bindings[0]!.pool).toBe("bntpool");
  expect(projectAddressInput("bnt", bntPublicAddress + "\n" + secondAddress, [], 5)).toEqual([
    bntPublicAddress,
    secondAddress,
  ]);
  expect(() =>
    parseFleet([{ ...devices[0], bindings: [{ ...devices[0]!.bindings[0], pool: "kryptex" }] }]),
  ).toThrow();
  expect(poolAccountUrl("bnt", bntPublicAddress)).toContain("https://bntpool.com/stats");
});
it("publishes distinct tool and guide metadata in every language with honest coverage", () => {
  for (const locale of LOCALES) {
    expect(projectsSeo(locale, "bnt").meta[0]).toHaveProperty("title");
    expect(
      guidesForProject("bnt").some(
        (g) => g.slug === "blocknet-bnt-monitor-guide" && g.title[locale],
      ),
    ).toBe(true);
    expect(buildSitemapXml()).toContain(`/${locale}/projects/bnt`);
    expect(buildSitemapXml()).toContain(`/${locale}/learn/blocknet-bnt-monitor-guide`);
  }
  expect(buildLlmsFullTxt()).toContain("Blocknet / BNT");
});

it.skipIf(process.env["BNT_LIVE_TEST"] !== "1")(
  "reads the official public developer sample through the real pool adapter",
  async () => {
    const { readPoolAccount } = await import("./pool-monitor.server");
    const result = await readPoolAccount("bnt", bntPublicAddress);
    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({ period: "unknown", reward: null });
    expect(result.data?.hashrate).not.toBeNull();
    expect(result.data?.paid).not.toBeNull();
  },
  30000,
);
