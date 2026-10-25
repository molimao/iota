import { describe, expect, it, vi } from "vitest";
import { blake2b } from "@noble/hashes/blake2.js";
import { readAcurastChain, acurastStorageKey, ACURAST_RPC } from "./acurast-chain.server";
const device = "5GP4RwiW81Pxo47eFpGdEnNUsGyjE9HehcqqQT28KbyW7Kek";
const manager = "5EvGVRCfYqpqBC4DWZLPjrhDaUcrqq7dQzMPwvvmhaky4NrH";
const publicKey = "bef09bbf3d6d40305403e635401961b9833d30b1632748e1d2d1b001a2f26926";
const ownerKey = "7e4558a334a35c61c62941ee232cf9f8485e6d8fca92bae775f23d7976426d09";
const hex = (v: Uint8Array) => Array.from(v, (b) => b.toString(16).padStart(2, "0")).join("");
const hash = (h: string) =>
  hex(
    blake2b(
      Uint8Array.from(h.match(/../g)!, (p) => parseInt(p, 16)),
      { dkLen: 16 },
    ),
  );
const concat = (h: string) => hash(h) + h;
const mid = "cf060100000000000000000000000000",
  block = "0x" + "11".repeat(32);
const managedPrefix = "0xc698b31ad72d251a494de23e0dd66846211ec8b3b481a558895c57086b3d085d";
const ownerPrefix = "0x5e8a19e3cd1b7c148b33880c479c0281b99d880ec681799c0cf30e8886371da9";
function fetcher(mode: "ok" | "missing" | "bad" = "ok") {
  return vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    expect(url).toBe(ACURAST_RPC);
    const req = JSON.parse(String(init?.body));
    expect(["chain_getFinalizedHead", "state_getStorage", "state_getKeysPaged"]).toContain(
      req.method,
    );
    let result: unknown = null;
    if (req.method === "chain_getFinalizedHead") result = block;
    else {
      expect(req.params.at(-1)).toBe(block);
      if (
        req.method === "state_getStorage" &&
        req.params[0] === acurastStorageKey("processor", publicKey) &&
        mode === "ok"
      )
        result = "0x" + mid;
      if (req.method === "state_getKeysPaged") {
        const prefix = req.params[0];
        result =
          mode === "missing"
            ? []
            : prefix.startsWith(ownerPrefix)
              ? [prefix + concat(mid)]
              : [
                  prefix + concat(publicKey),
                  prefix + concat("ab".repeat(32)),
                  prefix + concat("cd".repeat(32)),
                ].sort();
        if (mode === "bad") result = [prefix + "00".repeat(48)];
      }
    }
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result }));
  });
}
describe("Acurast mainnet chain lookup", () => {
  it("normalizes SS58 and hex to the same device; does not invent earnings or hardware", async () => {
    const a = await readAcurastChain(device, fetcher());
    const b = await readAcurastChain("0x" + publicKey, fetcher());
    expect(a.acurast).toEqual(b.acurast);
    expect(a.acurast?.role).toBe("processor");
    expect(a.acurast?.processors[0]?.id).toBe(device);
    expect(a.online).toBeNull();
    expect(a.reward).toBeNull();
    expect(a.hardware).toBeNull();
  });
  it("finds the manager identity and its three processors including the supplied device", async () => {
    const a = await readAcurastChain(manager, fetcher());
    expect(a.scope).toBe("provider");
    expect(a.acurast?.role).toBe("manager");
    expect(a.acurast?.processors).toHaveLength(3);
    expect(a.acurast?.processors.map((p) => p.id)).toContain(device);
    expect(a.acurast?.managerIds).toEqual(["67279"]);
    expect(a.acurast?.complete).toBe(true);
  });
  it("rejects unrelated storage keys, invalid identities and genuinely missing accounts", async () => {
    await expect(readAcurastChain(manager, fetcher("bad"))).rejects.toThrow("invalid-data");
    await expect(readAcurastChain(manager, fetcher("missing"))).rejects.toThrow("not-found");
    await expect(readAcurastChain("not-an-address", fetcher())).rejects.toThrow("invalid-data");
  });
});
it.runIf(process.env["ACURAST_LIVE_TEST"] === "1")(
  "verifies both supplied public addresses on the live finalized chain",
  async () => {
    const [a, b] = await Promise.all([readAcurastChain(device), readAcurastChain(manager)]);
    expect(a.acurast?.role).toBe("processor");
    expect(b.acurast?.role).toBe("manager");
    expect(b.acurast?.processors.map((p) => p.id)).toContain(device);
    for (const node of [a, b]) {
      expect(node.acurastRewards?.managers[0]?.id).toBe("67279");
      expect(node.acurastRewards?.managers[0]?.today).not.toBeNull();
      expect(Number(node.acurastRewards?.managers[0]?.cumulative)).toBeGreaterThan(0);
    }
    const { writeFileSync } = await import("node:fs");
    writeFileSync(
      "/tmp/acurast-live-verified.json",
      JSON.stringify({ device: a, manager: b }, null, 2),
    );
  },
  60000,
);

it("decodes little-endian heartbeat timestamps and uses the official 31-minute window", async () => {
  const now = 1792929000000;
  for (const [age, online] of [
    [60000, true],
    [32 * 60000, false],
  ] as const) {
    const base = fetcher();
    const f = vi.fn(async (url: string | URL | Request, options?: RequestInit) => {
      const request = JSON.parse(String(options?.body));
      if (
        request.method === "state_getStorage" &&
        request.params[0] === acurastStorageKey("heartbeat", publicKey)
      ) {
        const n = BigInt(now - age)
          .toString(16)
          .padStart(32, "0")
          .match(/../g)!
          .reverse()
          .join("");
        return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result: "0x" + n }));
      }
      return base(url, options);
    });
    const node = await readAcurastChain(device, f, now);
    expect(node.sourceUpdatedAt).toBe(now - age);
    expect(node.online).toBe(online);
  }
});

it("reads the current manager wallet for either address, without confusing rewards or frozen funds with balance", async () => {
  const { decodeAcurastBalance } = await import("./acurast-chain.server");
  const le = (n: bigint) => n.toString(16).padStart(32, "0").match(/../g)!.reverse().join("");
  const raw =
    "0x" +
    "00".repeat(16) +
    le(2346966150420n) +
    le(32280137088n) +
    le(1000000000000n) +
    le(1n << 127n);
  expect(decodeAcurastBalance(raw)).toEqual({
    free: 2346966150420n,
    reserved: 32280137088n,
    frozen: 1000000000000n,
  });
  expect(() => decodeAcurastBalance("0x1234")).toThrow("invalid-data");
  const wrapped = () => {
    const base = fetcher();
    return async (url: string | URL | Request, options?: RequestInit) => {
      const r = JSON.parse(String(options?.body));
      if (r.method === "state_getStorage") {
        if (
          r.params[0].startsWith(
            "0x5e8a19e3cd1b7c148b33880c479c0281d34371a193a751eea5883e9553457b2e",
          )
        )
          return new Response(
            JSON.stringify({ jsonrpc: "2.0", id: 1, result: "0x" + ownerKey + "00".repeat(18) }),
          );
        if (
          r.params[0].startsWith(
            "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9",
          )
        ) {
          expect(r.params[0]).toContain(ownerKey);
          return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result: raw }));
        }
      }
      return base(url, options);
    };
  };
  for (const id of [device, manager]) {
    const n = await readAcurastChain(id, wrapped());
    expect(n.acurastBalances).toEqual([
      {
        address: manager,
        total: "2.379246287508",
        free: "2.34696615042",
        reserved: "0.032280137088",
        frozen: "1",
      },
    ]);
  }
});
