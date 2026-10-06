import { describe, it, expect, vi } from "vitest";
import { bech32 } from "@scure/base";
import { parseAkash, parseGolem, parseIo, parseVast, validPlatformId } from "./platforms";
import { readPrivatePlatform, readPublicPlatform, platformJson } from "./platforms-upstream.server";
import { sealCredential, openCredential } from "./connection-crypto.server";
import { deviceTodayEarnings } from "./fleet-earnings";
const akash = bech32.encode("akash", bech32.toWords(new Uint8Array(20).fill(3)));
const node = "0x" + "a".repeat(40),
  uuid = "599ef4af-7fe6-44b5-aba3-25899bde2ab6";
describe("platform adapters", () => {
  it("requires correct public identifiers, not arbitrary upstream URLs", () => {
    expect(validPlatformId("akash", akash)).toBe(true);
    expect(validPlatformId("akash", akash.slice(0, -1) + "a")).toBe(false);
    expect(validPlatformId("ionet", uuid)).toBe(true);
    expect(validPlatformId("vast", "1234")).toBe(true);
    expect(validPlatformId("golem", node)).toBe(true);
    for (const p of ["akash", "ionet", "vast", "golem"] as const)
      expect(validPlatformId(p, "https://localhost/admin")).toBe(false);
  });
  it("keeps unknown capacity unknown and rejects mismatched providers", () => {
    expect(parseAkash({ owner: akash, isOnline: false }, akash)).toMatchObject({
      gpuCount: null,
      online: false,
      scope: "provider",
      reward: null,
    });
    expect(() => parseAkash({ owner: "wrong" }, akash)).toThrow("invalid-data");
  });
  it("distinguishes rolling GLM rewards from calendar-day income", () => {
    const data = parseGolem(
      [{ node_id: node, online: true, earnings_total: 4, data: { "golem.inf.cpu.cores": 8 } }],
      { earnings: "0" },
      node,
    );
    expect(data).toMatchObject({ reward: 0, period: "rolling24h", rewardUnit: "GLM" });
    expect(parseGolem([{ node_id: node }], null, node).reward).toBe(null);
    expect(() => parseGolem([], {}, node)).toThrow("not-found");
    expect(
      deviceTodayEarnings([
        {
          binding: { id: "1", project: "golem", identifier: node, worker: "" },
          data: { scope: "device", today: "0.5", unit: "GLM", todayUsable: false },
        },
      ]).known,
    ).toBe(0);
  });
  it("does not infer io.net connectivity or confuse rental earnings with block rewards", () => {
    const d = parseIo(
      {
        data: {
          device_id: uuid,
          down_percentage: 0,
          hardware_quantity: 2,
          jobs: [{ earned: 999 }],
        },
      },
      { device_id: uuid, total_block_rewards: 0 },
      uuid,
    );
    expect(d).toMatchObject({ online: null, reward: 0, period: "utcDay", rewardUnit: "IO" });
    expect(
      parseIo({ data: { device_id: uuid } }, { device_id: "other", total_block_rewards: 99 }, uuid)
        .reward,
    ).toBe(null);
  });
  it("isolates machine income from account balances and other machines", () => {
    const d = parseVast(
      { machines: [{ id: 12, name: "GPU" }] },
      {
        current: { balance: 999 },
        per_machine: [
          { machine_id: 13, gpu_earn: 900 },
          { machine_id: 12, gpu_earn: 1, sto_earn: 2, bwu_earn: 3, bwd_earn: 4 },
        ],
      },
      "12",
    );
    expect(d.reward).toBe(10);
    expect(d.online).toBe(null);
    expect(parseVast({ machines: [{ id: 12 }] }, { per_machine: [] }, "12").reward).toBe(null);
    expect(() => parseVast({ machines: [] }, {}, "12")).toThrow("not-found");
  });
  it("uses official GET endpoints, authorization headers and fractional Unix days", async () => {
    const calls: { url: string; init: RequestInit | undefined }[] = [];
    const fake = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, init });
      return Response.json(
        url.includes("machine-earnings")
          ? {
              per_machine: [{ machine_id: 12, gpu_earn: 1, sto_earn: 0, bwu_earn: 0, bwd_earn: 0 }],
            }
          : { machines: [{ id: 12 }] },
      );
    });
    const now = Date.parse("2026-10-06T10:30:00Z");
    const r = await readPrivatePlatform("vast", "12", "test-only-token", fake as typeof fetch, now);
    expect(r.reward).toBe(1);
    expect(
      calls.every(
        (c) =>
          c.init?.method === "GET" &&
          c.init.redirect === "error" &&
          !c.url.includes("test-only-token"),
      ),
    ).toBe(true);
    const url = new URL(calls.find((c) => c.url.includes("machine-earnings"))!.url);
    expect(Number(url.searchParams.get("sday")) * 86400000).toBeCloseTo(
      Date.parse("2026-10-05T16:00:00Z"),
      0,
    );
    expect(calls[0]!.init?.headers).toEqual({ Authorization: "Bearer test-only-token" });
  });
  it("returns partial data if an earnings scope is unavailable", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) =>
      String(input).includes("block-rewards")
        ? new Response("denied", { status: 403 })
        : Response.json({ data: { device_id: uuid, hardware_name: "GPU" } }),
    );
    expect(
      await readPrivatePlatform("ionet", uuid, "test-only-token", fetcher as typeof fetch),
    ).toMatchObject({ partial: true, reward: null, hardware: "GPU" });
  });
  it("never exposes upstream error bodies or follows credential redirects", async () => {
    await expect(
      platformJson(
        "https://api.io.solutions/v1/test",
        "test-token",
        vi.fn(
          async () => new Response("sensitive upstream details", { status: 401 }),
        ) as typeof fetch,
      ),
    ).rejects.toThrow("expired");
    const fetcher = vi.fn(async () => new Response("x".repeat(1_000_001)));
    await expect(
      platformJson("https://example.com", undefined, fetcher as typeof fetch),
    ).rejects.toThrow("invalid-data");
  });
  it("reads only the fixed Akash API, never the provider's hostUri", async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL) =>
      Response.json({
        owner: akash,
        hostUri: "http://127.0.0.1/private",
        stats: { gpu: { total: 2, active: 1 } },
      }),
    );
    expect(await readPublicPlatform("akash", akash, fetcher as typeof fetch)).toMatchObject({
      gpuCount: 2,
      activeGpu: 1,
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(fetcher.mock.calls[0]?.[0] ?? "")).not.toContain("127.0.0.1");
  });
});
describe("encrypted credentials", () => {
  const key = btoa(String.fromCharCode(...new Uint8Array(32).fill(42)));
  it("encrypts with a unique nonce and binds ciphertext to user and project", async () => {
    const a = await sealCredential("test-only-secret", "user-a", "vast", key),
      b = await sealCredential("test-only-secret", "user-a", "vast", key);
    expect(a).not.toBe(b);
    expect(a).not.toContain("test-only-secret");
    expect(await openCredential(a, "user-a", "vast", key)).toBe("test-only-secret");
    await expect(openCredential(a, "user-b", "vast", key)).rejects.toThrow();
    await expect(openCredential(a, "user-a", "ionet", key)).rejects.toThrow();
  });
  it("rejects missing or malformed encryption configuration", async () => {
    await expect(sealCredential("test", "a", "vast", "")).rejects.toThrow("not-configured");
  });
});
