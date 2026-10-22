import { it, expect, vi, beforeEach } from "vitest";
const state = vi.hoisted(() => ({
  upstream: vi.fn(),
  collect: vi.fn(),
  json: vi.fn(),
  valid: vi.fn(),
}));
vi.mock("./iota-upstream.server", () => ({
  fetchUpstream: state.upstream,
  TTL: { rewards: 300000 },
}));
vi.mock("./daily-report-collect.server", () => ({ collectReportBinding: state.collect }));
vi.mock("./upstream-json.server", () => ({ upstreamJson: state.json }));
vi.mock("./fleet", async () => ({
  ...(await vi.importActual<Record<string, unknown>>("./fleet")),
  validBinding: state.valid,
}));
import { collectHistoricalResource } from "./history-backfill-collect.server";
import { reportDayWindow } from "./daily-report";
const now = Date.parse("2026-10-11T04:00:00Z"),
  start = "2026-10-05",
  end = "2026-10-09";
beforeEach(() => {
  vi.clearAllMocks();
  state.valid.mockReturnValue(true);
  state.collect.mockResolvedValue({ units: "0", usd: null, fetchedAt: now });
});
it("reads IOTA history once and leaves all missing days and prices unknown", async () => {
  state.upstream.mockResolvedValue({
    data: {
      alpha_amounts: [1],
      timestamps: [reportDayWindow("2026-10-07").start / 1000],
      statuses: ["settled"],
    },
    error: null,
    stale: false,
    fetchedAt: now,
  });
  const r = await collectHistoricalResource(
    "owner",
    { project: "iota", identifier: "fixture" },
    start,
    end,
    0,
  );
  expect(r.complete).toBe(true);
  expect(r.resource.days).toMatchObject([
    { day: "2026-10-07", units: "100000000", usd: null, partial: true },
  ]);
  expect(state.upstream).toHaveBeenCalledTimes(1);
  expect(state.collect).not.toHaveBeenCalled();
  state.upstream.mockResolvedValue({ data: null, error: "timeout", stale: true });
  await expect(
    collectHistoricalResource("owner", { project: "iota", identifier: "fixture" }, start, end, 0),
  ).rejects.toThrow("history_source_unavailable");
});
it("does not create or fetch fictitious daily earnings from monthly/unsupported ledgers", async () => {
  expect(
    (
      await collectHistoricalResource(
        "owner",
        { project: "flyai", identifier: "fixture" },
        start,
        end,
        0,
      )
    ).resource,
  ).toMatchObject({ reason: "different_period", days: [] });
  expect(
    (
      await collectHistoricalResource(
        "owner",
        { project: "xid", identifier: "fixture" },
        start,
        end,
        0,
      )
    ).resource,
  ).toMatchObject({ reason: "unsupported", days: [] });
  expect(
    (
      await collectHistoricalResource(
        "owner",
        { project: "zeph", identifier: "fixture" },
        start,
        end,
        0,
      )
    ).resource,
  ).toMatchObject({ reason: "different_period", days: [] });
  expect(state.upstream).not.toHaveBeenCalled();
  expect(state.collect).not.toHaveBeenCalled();
});
it("excludes dates before index coverage and the earliest incomplete Quantus day instead of filling them with zero", async () => {
  state.json.mockResolvedValue({
    data: {
      first: [{ timestamp: new Date(reportDayWindow("2026-10-07").start + 3600000).toISOString() }],
    },
  });
  const first = await collectHistoricalResource(
    "owner",
    { project: "quantus", identifier: "fixture" },
    start,
    end,
    0,
  );
  expect(first.resource.days).toEqual([]);
  expect(first).toMatchObject({ next: 3, complete: false });
  expect(state.collect).not.toHaveBeenCalled();
  const last = await collectHistoricalResource(
    "owner",
    { project: "quantus", identifier: "fixture" },
    start,
    end,
    3,
  );
  expect(last.resource.days.map((d) => d.day)).toEqual(["2026-10-08", "2026-10-09"]);
  expect(last.complete).toBe(true);
  expect(state.collect).toHaveBeenCalledTimes(2);
});
it("bounds private-provider requests to three historical day windows and never substitutes today", async () => {
  state.collect.mockResolvedValue({ units: "200000000", usd: 2, fetchedAt: now });
  const r = await collectHistoricalResource(
    "owner",
    { project: "vast", identifier: "12" },
    start,
    end,
    0,
  );
  expect(r).toMatchObject({ next: 3, complete: false });
  expect(state.collect).toHaveBeenCalledTimes(3);
  expect(state.collect.mock.calls.map((c) => c[2].day)).toEqual([
    "2026-10-05",
    "2026-10-06",
    "2026-10-07",
  ]);
  expect(r.resource.days.every((d) => d.usd === 2)).toBe(true);
  state.collect.mockResolvedValue({ units: null, usd: null, reason: "connect_required" });
  expect(
    await collectHistoricalResource("owner", { project: "vast", identifier: "12" }, start, end, 3),
  ).toMatchObject({ complete: true, resource: { reason: "connect_required", days: [] } });
});
it("rejects malformed identifiers and treats upstream failure as retriable rather than zero", async () => {
  state.valid.mockReturnValue(false);
  await expect(
    collectHistoricalResource("owner", { project: "iota", identifier: "bad" }, start, end, 0),
  ).rejects.toThrow("invalid_history_identifier");
  expect(state.upstream).not.toHaveBeenCalled();
  state.valid.mockReturnValue(true);
  state.collect.mockResolvedValue({ units: null, reason: "unavailable" });
  await expect(
    collectHistoricalResource("owner", { project: "vast", identifier: "12" }, start, end, 0),
  ).rejects.toThrow("history_source_unavailable");
});
