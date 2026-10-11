import { it, expect, vi, beforeEach } from "vitest";
const state = vi.hoisted(() => ({ roster: vi.fn(), platform: vi.fn() }));
vi.mock("./iota-discovery.server", () => ({ discoverOfficialDevices: state.roster }));
vi.mock("./platforms.server", () => ({ publicPlatform: state.platform }));
vi.mock("./fleet", () => ({
  validBinding: () => true,
  bindingIdentity: (b: { project: string; identifier: string }) => b.project + ":" + b.identifier,
}));
import { collectAlertSignal } from "./pro-alerts.server";
beforeEach(() => vi.clearAllMocks());
it("never turns partial rosters, stale clocks, missing samples or API failures into device alerts", async () => {
  for (const input of [
    { devices: [], fullCoverage: false, fetchedAt: null },
    {
      devices: [{ miner: null, stale: true, fetchedAt: Date.now() }],
      fullCoverage: true,
      fetchedAt: Date.now(),
    },
    {
      devices: [{ miner: null, stale: false, fetchedAt: Date.now() - 6 * 60000 }],
      fullCoverage: true,
      fetchedAt: Date.now() - 6 * 60000,
    },
  ]) {
    state.roster.mockResolvedValue(input);
    expect(await collectAlertSignal({ project: "iota", identifier: "public" })).toBe("unknown");
  }
  state.roster.mockRejectedValue(new Error("timeout"));
  expect(await collectAlertSignal({ project: "iota", identifier: "public" })).toBe("unknown");
});
it("distinguishes IOTA non-participation from healthy waiting without claiming a machine heartbeat", async () => {
  const miner = { throughput: 0, is_active: true };
  state.roster.mockResolvedValue({
    devices: [{ miner, stale: false, fetchedAt: Date.now() }],
    fullCoverage: true,
    fetchedAt: Date.now(),
  });
  expect(await collectAlertSignal({ project: "iota", identifier: "public" })).toBe("healthy");
  state.roster.mockResolvedValue({
    devices: [{ miner: null, stale: false, fetchedAt: Date.now() }],
    fullCoverage: true,
    fetchedAt: Date.now(),
  });
  expect(await collectAlertSignal({ project: "iota", identifier: "public" })).toBe("bad");
});
it("only uses explicit fresh platform connectivity; account rewards cannot imply offline", async () => {
  state.platform.mockResolvedValue({
    error: null,
    stale: false,
    fetchedAt: Date.now(),
    data: { online: false, sourceUpdatedAt: Date.now() },
  });
  expect(await collectAlertSignal({ project: "akash", identifier: "public" })).toBe("bad");
  state.platform.mockResolvedValue({
    error: null,
    stale: false,
    fetchedAt: Date.now(),
    data: { online: false, sourceUpdatedAt: Date.now() - 16 * 60000 },
  });
  expect(await collectAlertSignal({ project: "golem", identifier: "public" })).toBe("unknown");
  expect(await collectAlertSignal({ project: "vast", identifier: "1" })).toBe("unknown");
  expect(await collectAlertSignal({ project: "xid", identifier: "wallet" })).toBe("unknown");
});
