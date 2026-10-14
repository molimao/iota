import { describe, expect, it, vi } from "vitest";
import { base58 } from "@scure/base";
import { blake2b } from "@noble/hashes/blake2.js";
import { parseIotaAddresses } from "./iota-addition";
import { discoverWalletMiners } from "./iota-wallet.server";
import type { fetchUpstream } from "./iota-upstream.server";
const address = (seed: number) => {
  const body = new Uint8Array(33);
  body[0] = 42;
  new DataView(body.buffer).setUint32(1, seed);
  const checksum = blake2b(new Uint8Array([...new TextEncoder().encode("SS58PRE"), ...body]), {
    dkLen: 64,
  });
  return base58.encode(new Uint8Array([...body, ...checksum.slice(0, 2)]));
};
const response = (data: unknown, stale = false, error: string | null = null) => ({
  data,
  stale,
  error,
  fetchedAt: Date.now(),
});
const roster = (hotkey: string, coldkey: string) => ({ hotkey, coldkey });
describe("public IOTA address addition", () => {
  it("validates whole lines, distinguishes saved and repeated IDs, and handles CRLF", () => {
    const a = address(1),
      b = address(2);
    expect(
      parseIotaAddresses(`  ${a}\r\n${b}\n${b}\n\n<script>${a}</script>`, [a]).map((r) => r.issue),
    ).toEqual(["duplicate", null, "duplicate", "invalid"]);
    expect(parseIotaAddresses(`https://example.test/${a}`, [])[0]?.issue).toBe("invalid");
  });
  it("bounds payload and row count before parsing", () => {
    expect(() => parseIotaAddresses("x".repeat(14001), [])).toThrow("too_many_addresses");
    expect(() => parseIotaAddresses(Array(201).fill("x").join("\n"), [])).toThrow(
      "too_many_addresses",
    );
  });
  it("finds exact wallet matches across all active rosters and deduplicates hotkeys", async () => {
    const wallet = address(10),
      a = address(1),
      b = address(2);
    const request = vi.fn(async (path: string) =>
      path === "/runs"
        ? response({
            runs: [
              { run_id: "a", state: "active" },
              { run_id: "b", state: "active" },
              { run_id: "closed", state: "completed" },
            ],
          })
        : response({
            miners: path.includes("a")
              ? [roster(a, wallet), roster(b, address(11)), roster("bad", wallet)]
              : [roster(a, wallet), roster(b, wallet)],
          }),
    );
    const result = await discoverWalletMiners(wallet, request as typeof fetchUpstream);
    expect(result.hotkeys).toEqual([a, b].sort());
    expect(result.fullCoverage).toBe(true);
    expect(request).toHaveBeenCalledTimes(3);
  });
  it("retains usable results but reports missing or stale roster coverage", async () => {
    const wallet = address(10);
    const request = vi.fn(async (path: string) =>
      path === "/runs"
        ? response({
            runs: [
              { run_id: "a", state: "active" },
              { run_id: "b", state: "active" },
            ],
          })
        : path.endsWith("a")
          ? response({ miners: [roster(address(1), wallet)] })
          : response(null, true, "timeout"),
    );
    const result = await discoverWalletMiners(wallet, request as typeof fetchUpstream);
    expect(result.fullCoverage).toBe(false);
    expect(result.runsFetched).toBe(1);
    expect(result.hotkeys).toHaveLength(1);
  });
  it("does not mistake failed run discovery for a complete empty wallet", async () => {
    const failed = async () => response(null, false, "timeout");
    expect(
      (await discoverWalletMiners(address(10), failed as typeof fetchUpstream)).fullCoverage,
    ).toBe(false);
    const empty = async () => response({ runs: [] });
    expect(
      (await discoverWalletMiners(address(10), empty as typeof fetchUpstream)).fullCoverage,
    ).toBe(true);
  });
  it("rejects invalid wallets without upstream requests and caps matching output", async () => {
    const wallet = address(999);
    const request = vi.fn(async (path: string) =>
      path === "/runs"
        ? response({ runs: [{ run_id: "a", state: "active" }] })
        : response({ miners: Array.from({ length: 205 }, (_, i) => roster(address(i), wallet)) }),
    );
    await expect(
      discoverWalletMiners("private key", request as typeof fetchUpstream),
    ).rejects.toThrow("invalid_wallet");
    expect(request).not.toHaveBeenCalled();
    const result = await discoverWalletMiners(wallet, request as typeof fetchUpstream);
    expect(result.hotkeys).toHaveLength(200);
    expect(result.truncated).toBe(true);
  });
});
