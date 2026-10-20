import { afterEach, expect, it, vi } from "vitest";
import { hashrateChartPoints, parseBntHashrateHistory } from "./bnt-hashrate";
const address =
  "SEiNEceuDyfEY3GKDQAYVuK6382K2Ln2gQSv83ySAFkKhraBxhHnTf2P6PsF8CXtreqywg4T1qwBAjQo3L2VYDYWtsbb9";
afterEach(() => vi.unstubAllGlobals());
it("sorts and deduplicates timestamps while retaining measured zero and missing samples", () => {
  expect(
    parseBntHashrateHistory(
      [
        { timestamp: 200, hashrate: 4 },
        { timestamp: 100, hashrate: 0 },
        { timestamp: 200, hashrate: 5 },
        { timestamp: 300, hashrate: null },
      ],
      400000,
    ),
  ).toEqual([
    { at: 100000, hashrate: 0 },
    { at: 200000, hashrate: 5 },
    { at: 300000, hashrate: null },
  ]);
});
it("rejects invalid, oversized, future and negative upstream records", () => {
  for (const input of [
    {},
    Array(10001).fill({}),
    [{ timestamp: 1, hashrate: -1 }],
    [{ timestamp: 1, hashrate: "5" }],
    [{ timestamp: 500000, hashrate: 1 }],
  ])
    expect(() => parseBntHashrateHistory(input, 10000)).toThrow();
});
it("breaks a missing interval without inventing zero, and does not extrapolate one sample", () => {
  const rows = [0, 1000, 2000, 10000, 11000].map((at) => ({ at, hashrate: 2 }));
  const chart = hashrateChartPoints(rows);
  expect(chart).toHaveLength(6);
  expect(chart[3]).toEqual({ at: 3000, hashrate: null });
  expect(hashrateChartPoints([{ at: 1000, hashrate: 0 }])).toEqual([{ at: 1000, hashrate: 0 }]);
});
it("uses only the fixed public pool route, separates ranges and caches matching requests", async () => {
  vi.resetModules();
  const fetcher = vi.fn(
    async (_url: RequestInfo | URL) =>
      new Response(
        JSON.stringify([{ timestamp: Math.floor(Date.now() / 1000) - 60, hashrate: 1 }]),
        { headers: { "content-type": "application/json" } },
      ),
  );
  vi.stubGlobal("fetch", fetcher);
  const { readBntHashrateHistory } = await import("./bnt-hashrate.server");
  expect(() => readBntHashrateHistory("https://invalid.example", "24h")).toThrow();
  expect(() => readBntHashrateHistory(address, "evil" as "24h")).toThrow();
  expect((await readBntHashrateHistory(address, "24h")).data).toHaveLength(1);
  await readBntHashrateHistory(address, "24h");
  await readBntHashrateHistory(address, "7d");
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(fetcher.mock.calls[0]?.[0]).toBe(
    `https://bntpool.com/api/miner/${address}/hashrate?range=24h`,
  );
});
it.skipIf(process.env["BNT_LIVE_TEST"] !== "1")(
  "reads real public pool history",
  async () => {
    vi.resetModules();
    const { readBntHashrateHistory } = await import("./bnt-hashrate.server");
    for (const range of ["24h", "7d", "30d"] as const) {
      const r = await readBntHashrateHistory(address, range);
      expect(r.error).toBeNull();
      expect(r.data!.length).toBeGreaterThan(1);
    }
  },
  60000,
);
