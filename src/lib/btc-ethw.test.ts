import { base58check, bech32, bech32m } from "@scure/base";
import { sha256 } from "@noble/hashes/sha2.js";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PoolWorkerCards } from "@/components/pool-worker-cards";
import { poolCopy } from "@/components/pool-copy";
import {
  CKPOOL_LAST_SHARE_FRESH_MS,
  ckHashrate,
  parseCkPool,
  parseTwoMiners,
} from "./pool-monitor";
import {
  poolAccountUrl,
  poolProvider,
  twoMinersAccountUrl,
  validPoolAddress,
} from "./pool-projects";

const coder = base58check(sha256);
const p2 = (version: number, fill: number) =>
  coder.encode(Uint8Array.from([version, ...new Uint8Array(20).fill(fill)]));
const segwit = (length: number, fill: number, version: number, codec: typeof bech32) =>
  codec.encode("bc", [version, ...codec.toWords(new Uint8Array(length).fill(fill))], 90);

const officialBtc = {
  hashrate1m: "3.23T",
  hashrate5m: "2.88T",
  hashrate1hr: "2.89T",
  hashrate1d: "2.53T",
  hashrate7d: "1.56T",
  lastshare: 1792755549,
  workers: 6,
  worker: [
    {
      workername: "bc1q28kkr5hk4gnqe3evma6runjrd2pvqyp8fpwfzu",
      hashrate1hr: "1.94T",
      lastshare: 1792755549,
    },
    {
      workername: "bc1q28kkr5hk4gnqe3evma6runjrd2pvqyp8fpwfzu.bitaxe601-01",
      hashrate1hr: "954G",
      lastshare: 1792755517,
    },
    {
      workername: "bc1q28kkr5hk4gnqe3evma6runjrd2pvqyp8fpwfzu.bitaxe",
      hashrate1hr: "0",
      hashrate1d: "847M",
      lastshare: 1792555909,
    },
  ],
};
const btcAddress = "bc1q28kkr5hk4gnqe3evma6runjrd2pvqyp8fpwfzu";

describe("BTC and ETHW validation and accounting", () => {
  it("accepts checksummed mainnet addresses and rejects the rest", () => {
    const p2pkh = p2(0, 2);
    const p2sh = p2(5, 3);
    const wpkh = segwit(20, 4, 0, bech32);
    const wsh = segwit(32, 5, 0, bech32);
    const taproot = segwit(32, 6, 1, bech32m);
    for (const address of [p2pkh, p2sh, wpkh, wsh, taproot, btcAddress])
      expect(validPoolAddress("btc", address)).toBe(true);
    const mixed = wpkh.slice(0, 4) + wpkh.slice(4, 8).toUpperCase() + wpkh.slice(8);
    for (const bad of [
      p2(0x6f, 2),
      p2(0xc4, 3),
      segwit(20, 4, 0, bech32).replace("bc1", "tb1"),
      mixed,
      wpkh.slice(0, -1) + (wpkh.endsWith("a") ? "b" : "a"),
      p2pkh.slice(0, -1) + "x",
      `https://solo.ckpool.org/users/${p2pkh}`,
      `${wpkh}?worker=a`,
      `${wpkh}/extra`,
      " " + p2pkh,
      bech32m.encode("bc", [0, ...bech32.toWords(new Uint8Array(20).fill(4))], 90),
      bech32.encode("bc", [1, ...bech32.toWords(new Uint8Array(32).fill(6))], 90),
    ])
      expect(validPoolAddress("btc", bad)).toBe(false);
    const ethw = "0xAB" + "cd".repeat(19);
    expect(validPoolAddress("ethw", ethw)).toBe(true);
    expect(validPoolAddress("ethw", "bc1qqszqgpqyqszqgpqyqszqgpqyqszqgpqy5dl506")).toBe(false);
    expect(poolProvider("btc")).toBe("ckpool");
    expect(poolProvider("ethw")).toBe("2miners");
    expect(poolAccountUrl("btc", p2pkh)).toBe(
      `https://stats.ckpool.org/users/${encodeURIComponent(p2pkh)}`,
    );
    expect(twoMinersAccountUrl("ethw", ethw)).toBe(
      `https://ethw.2miners.com/api/accounts/${encodeURIComponent(ethw)}`,
    );
    expect(twoMinersAccountUrl("ethw", ethw)).not.toContain("solo");
  });

  it("parses the published CKPool user shape without inventing earnings", () => {
    const now = officialBtc.lastshare * 1000;
    const parsed = parseCkPool(officialBtc, btcAddress, now);
    expect(parsed.hashrate).toBe(2.89e12);
    expect(parsed.workers.map((worker) => worker.hashrate)).toEqual([1.94e12, 954e9, 0]);
    expect(parsed.hashrate).not.toBe(
      parsed.workers.reduce((sum, worker) => sum + worker.hashrate!, 0),
    );
    expect(parsed.workerCount).toBe(6);
    expect(parsed.partial).toBe(true);
    expect(parsed.workers.map((worker) => worker.name)).toEqual(["", "bitaxe601-01", "bitaxe"]);
    expect(parsed.workers.map((worker) => worker.online)).toEqual([true, true, false]);
    expect(parsed.balance).toBeNull();
    expect(parsed.paid).toBeNull();
    expect(parsed.reward).toBeNull();
    expect(parsed.period).toBe("unknown");
    expect(parsed.lastShare).toBe(now);
    const stale = parseCkPool(
      { ...officialBtc, worker: [{ ...officialBtc.worker[0], lastshare: now / 1000 - 1 }] },
      btcAddress,
      now + CKPOOL_LAST_SHARE_FRESH_MS + 1000,
    );
    expect(stale.workers[0]?.online).toBe(false);
    expect(
      parseCkPool(
        { workers: 1, worker: [{ workername: "bare", hashrate1hr: "1T" }] },
        btcAddress,
        now,
      ).workers[0]?.online,
    ).toBeNull();
    expect(() => ckHashrate("-1T")).toThrow("invalid-data");
    expect(() => ckHashrate("2.89t")).toThrow("invalid-data");
    expect(() => ckHashrate("1e3T")).toThrow("invalid-data");
    expect(() => ckHashrate("1KH")).toThrow("invalid-data");
    expect(() => ckHashrate(`${"9".repeat(30)}E`)).toThrow("invalid-data");
    expect(ckHashrate("0")).toBe(0);
    expect(ckHashrate(null)).toBeNull();
    expect(() => parseCkPool({ runtime: 1, Users: 33002, Workers: 53812 }, btcAddress)).toThrow(
      "invalid-data",
    );
    expect(() => parseCkPool({}, btcAddress)).toThrow("not-found");
    const long = "x".repeat(120);
    expect(
      parseCkPool(
        { workers: 1, worker: [{ workername: `${btcAddress}.${long}`, hashrate1hr: "1" }] },
        btcAddress,
        now,
      ).workers[0]?.name,
    ).toHaveLength(80);
  });

  it("keeps ETHW paid unknown when the official account omits it", () => {
    const parsed = parseTwoMiners("ethw", {
      apiVersion: 200,
      "24hreward": 0,
      currentHashrate: 0,
      payments: null,
      paymentsTotal: 0,
      stats: { balance: 30595842 },
      sumrewards: [
        { inverval: 86400, reward: 0, name: "Last 24 hours" },
        { inverval: 2592000, reward: 30595842, name: "Last 30 days" },
      ],
      workers: {},
      workersTotal: 0,
    });
    expect(parsed.balance).toBe(30595842 / 1e9);
    expect(parsed.paid).toBeNull();
    expect(parsed.reward).toBe(0);
    expect(parsed.period).toBe("rolling24h");
    expect(parsed.paid).not.toBe(0);
  });

  it("shows worker rows under one address and explains missing BTC earnings", () => {
    const now = officialBtc.lastshare * 1000;
    const account = parseCkPool(officialBtc, btcAddress, now);
    const html = renderToStaticMarkup(
      createElement(PoolWorkerCards, {
        project: "btc",
        address: btcAddress,
        account,
        locale: "en",
        now,
      }),
    );
    expect(html).toContain("bitaxe601-01");
    expect(html).toContain("bitaxe");
    expect(html).not.toContain("0 BTC");
    expect(html).toContain('data-worker="bitaxe601-01"');
    expect(poolCopy.ckpoolEarnings.en).toMatch(/not|does not/i);
    expect(poolCopy.ckpoolEarnings.en).not.toMatch(/\$|USD/);
  });
});
