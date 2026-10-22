import { base58 } from "@scure/base";
import { blake2b } from "@noble/hashes/blake2.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { describe, expect, it } from "vitest";
import { parseFleet, projectDeviceCount } from "./fleet";
import { PLANS } from "./plans";
import { parseTwoMiners, twoMinersPaymentDivisor } from "./pool-monitor";
import { poolAccountUrl, twoMinersAccountUrl, validPoolAddress } from "./pool-projects";
import { poolEditorial } from "@/components/pool-copy";
import { projectsSeo } from "@/components/projects-seo";
import { LOCALES } from "./site";
import { buildLlmsTxt, buildSitemapXml } from "./crawl";
import {
  ERG_2MINERS_PAYOUT,
  ZEPH_2MINERS_PAYOUT,
  ergP2pkFromFill,
  validErgP2pkAddress,
  validZephStandardAddress,
  zephStandardFromFill,
} from "./erg-zeph-validator";

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BLOCKS = [0, 2, 3, 5, 6, 7, 9, 10, 11];
function encodeVarint(value: bigint) {
  const out: number[] = [];
  let rest = value;
  while (rest >= 0x80n) {
    out.push(Number((rest & 0x7fn) | 0x80n));
    rest >>= 7n;
  }
  out.push(Number(rest));
  return out;
}
function cnEncode(bytes: Uint8Array) {
  let out = "";
  for (let offset = 0; offset < bytes.length; offset += 8) {
    const block = bytes.subarray(offset, Math.min(offset + 8, bytes.length));
    const size = BLOCKS[block.length]!;
    let value = 0n;
    for (const byte of block) value = (value << 8n) + BigInt(byte);
    let encoded = "";
    for (let i = 0; i < size; i++) {
      encoded = ALPHABET[Number(value % 58n)]! + encoded;
      value /= 58n;
    }
    out += encoded;
  }
  return out;
}
function zephKind(prefix: bigint) {
  const payload = new Uint8Array([...encodeVarint(prefix), ...new Uint8Array(64).fill(3)]);
  const checksum = keccak_256(payload).subarray(0, 4);
  return cnEncode(new Uint8Array([...payload, ...checksum]));
}
function ergHeader(header: number, content: Uint8Array) {
  const body = new Uint8Array([header, ...content]);
  const checksum = blake2b(body, { dkLen: 32 }).subarray(0, 4);
  return base58.encode(new Uint8Array([...body, ...checksum]));
}

describe("Ergo and Zephyr standard addresses", () => {
  it("accepts checksum-valid mainnet standards and rejects other official prefixes", () => {
    expect(validErgP2pkAddress(ERG_2MINERS_PAYOUT)).toBe(true);
    expect(validZephStandardAddress(ZEPH_2MINERS_PAYOUT)).toBe(true);
    const erg = ergP2pkFromFill(7);
    const zeph = zephStandardFromFill(4);
    expect(validPoolAddress("erg", erg)).toBe(true);
    expect(validPoolAddress("zeph", zeph)).toBe(true);
    expect(validErgP2pkAddress(erg.slice(0, -1) + (erg.endsWith("a") ? "b" : "a"))).toBe(false);
    expect(validZephStandardAddress(zeph.slice(0, -1) + (zeph.endsWith("a") ? "b" : "a"))).toBe(
      false,
    );
    expect(validPoolAddress("erg", "9" + "a".repeat(50))).toBe(false);
    expect(validPoolAddress("erg", ergHeader(0x02, new Uint8Array(32).fill(4)))).toBe(false);
    expect(validPoolAddress("erg", ergHeader(0x11, new Uint8Array(33).fill(4)))).toBe(false);
    const integrated = zephKind(0xc4f7d18c0n);
    const subaddress = zephKind(0x8dd58c0n);
    expect(integrated.startsWith("ZEPHii")).toBe(true);
    expect(subaddress.startsWith("ZEPHs")).toBe(true);
    expect(validZephStandardAddress(integrated)).toBe(false);
    expect(validZephStandardAddress(subaddress)).toBe(false);
    for (const bad of ["https://erg.2miners.com", "ZEPHYR", " " + zeph, zeph + " "]) {
      expect(validPoolAddress("zeph", bad)).toBe(false);
      expect(validPoolAddress("erg", bad)).toBe(false);
    }
  });
  it("keeps 2Miners hosts, payment units and wallet-scoped workers bounded", () => {
    expect(PLANS.free.projectDeviceLimit).toBe(5);
    expect(PLANS.pro.projectDeviceLimit).toBe(50);
    expect(twoMinersPaymentDivisor("erg")).toBe(1e9);
    expect(twoMinersPaymentDivisor("zeph")).toBe(1e12);
    expect(twoMinersPaymentDivisor("etc")).toBe(1e9);
    expect(twoMinersPaymentDivisor("prl")).toBeNull();
    const erg = ergP2pkFromFill(8);
    const zeph = zephStandardFromFill(9);
    expect(twoMinersAccountUrl("erg", erg)).toBe(
      `https://erg.2miners.com/api/accounts/${encodeURIComponent(erg)}`,
    );
    expect(twoMinersAccountUrl("zeph", zeph)).toBe(
      `https://zeph.2miners.com/api/accounts/${encodeURIComponent(zeph)}`,
    );
    expect(twoMinersAccountUrl("erg", "9" + "a".repeat(50))).toBeNull();
    expect(poolAccountUrl("zeph", zeph)).toBe(
      `https://zeph.2miners.com/account/${encodeURIComponent(zeph)}`,
    );
    expect(poolAccountUrl("erg", erg)).not.toContain("solo");
    const parsed = parseTwoMiners("zeph", {
      apiVersion: 200,
      stats: { balance: 1e12 },
      workersTotal: 2,
      currentHashrate: 10,
      workers: {
        one: { hr: 4, offline: false, lastBeat: 1700000000 },
        two: { hr: 6, offline: true, lastBeat: 1700000000 },
      },
    });
    expect(parsed.balance).toBe(1);
    expect(parsed.paid).toBeNull();
    expect(parsed.reward).toBeNull();
    expect(parsed.period).toBe("rolling24h");
    expect(parsed.workerCount).toBe(2);
    expect(
      parseTwoMiners("erg", {
        apiVersion: 200,
        stats: { balance: Number.MAX_SAFE_INTEGER + 1, paid: 1e9 },
        workersTotal: 1,
        "24hreward": 1e9,
        workers: { rig: { hr: 1, offline: false, lastBeat: 1 } },
      }).balance,
    ).toBeNull();
    expect(() =>
      parseTwoMiners("prl", {
        apiVersion: 200,
        stats: { balance: 1 },
        workersTotal: 1,
        workers: {},
      }),
    ).toThrow("invalid-data");
    const devices = parseFleet([
      {
        id: "rig",
        name: "Rig",
        createdAt: 1,
        bindings: [
          { id: "w1", project: "erg", identifier: erg, worker: "w1" },
          { id: "w2", project: "erg", identifier: erg, worker: "w2" },
        ],
      },
    ]);
    expect(projectDeviceCount(devices, "erg")).toBe(1);
    expect(devices[0]?.bindings).toHaveLength(2);
    expect(() =>
      parseFleet([
        {
          id: "bad",
          name: "Bad",
          createdAt: 1,
          bindings: [{ id: "b", project: "zeph", identifier: subaddressLike(), worker: "" }],
        },
      ]),
    ).toThrow();
  });
  it("publishes project pages in five languages without claiming every pool", () => {
    const xml = buildSitemapXml();
    const llms = buildLlmsTxt();
    expect(llms).toContain("erg.2miners.com");
    expect(llms).toContain("zeph.2miners.com");
    for (const id of ["erg", "zeph"] as const) {
      for (const locale of LOCALES) {
        expect(xml).toContain(`/${locale}/projects/${id}`);
        expect(projectsSeo(locale, id).meta[0]).toHaveProperty("title");
        expect(poolEditorial[id].summary[locale].length).toBeGreaterThan(20);
        expect(poolEditorial[id].coverage[locale].length).toBeGreaterThan(40);
      }
    }
    expect(poolEditorial.erg.coverage.en).toContain("1e9");
    expect(poolEditorial.zeph.coverage.en).toContain("1e12");
    expect(poolEditorial.erg.coverage.en).toContain("rolling 24-hour");
    expect(poolEditorial.zeph.coverage.en).toContain("rolling 24-hour");
    expect(poolEditorial.erg.identity.en).toContain("SOLO pools are not supported");
    expect(poolEditorial.zeph.identity.en).toContain("Integrated");
  });
});

function subaddressLike() {
  return zephKind(0x8dd58c0n);
}
