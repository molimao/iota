import { afterEach, it, expect, vi } from "vitest";
import { hardwareYield } from "./hardware-yield.server";
afterEach(() => vi.unstubAllGlobals());
it("keeps dated source-backed estimates available when the upstream is unreachable", async () => {
  vi.stubGlobal("fetch", async () => {
    throw new Error("offline");
  });
  const result = await hardwareYield("4060");
  expect(result.snapshot).toBe(true);
  expect(result.data.model).toBe("4060");
  expect(result.data.rows.find((r) => r.project === "prl")!.usdPerDay).toBeGreaterThan(0);
  expect(result.data.fetchedAt).toBeLessThanOrEqual(Date.now());
});
it("keeps sourced Mac BNT revenue without fabricating power during upstream failure", async () => {
  vi.stubGlobal("fetch", async () => {
    throw new Error("offline");
  });
  const result = await hardwareYield("m4-max-48");
  expect(result.snapshot).toBe(true);
  expect(result.data.rows[0]).toMatchObject({ project: "bnt", watts: null, hashrate: 29.26 });
  expect(result.data.rows[0]!.coinsPerDay).toBeGreaterThan(0);
});
it("preserves GPU and BNT alternatives together in the 5090 fallback", async () => {
  vi.stubGlobal("fetch", async () => {
    throw new Error("offline");
  });
  const result = await hardwareYield("5090");
  expect(result.data.rows.map((r) => r.project)).toEqual(expect.arrayContaining(["prl", "bnt"]));
  expect(result.data.rows.find((r) => r.project === "bnt")!.watts).toBeNull();
});
