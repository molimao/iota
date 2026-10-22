import { it, expect, vi, beforeEach } from "vitest";
import { reportDayWindow } from "./daily-report";
const mock = vi.hoisted(() => ({ history: vi.fn(), graph: vi.fn(), vast: vi.fn() }));
vi.mock("./fleet", () => ({ validBinding: (_p: string, id: string) => id === "public-test" }));
vi.mock("./iota-upstream.server", () => ({
  TTL: { rewards: 300000 },
  fetchUpstream: mock.history,
}));
vi.mock("./upstream-json.server", () => ({ upstreamJson: mock.graph }));
vi.mock("./platforms.server", () => ({ vastReportDay: mock.vast }));
import { collectReportBinding } from "./daily-report-collect.server";
const w = reportDayWindow("2026-10-09");
beforeEach(() => {
  vi.clearAllMocks();
});
it("keeps errors and truncated histories unknown, while valid empty ledgers are zero", async () => {
  mock.history.mockResolvedValue({
    data: { alpha_amounts: [], timestamps: [], statuses: [] },
    error: null,
    stale: false,
    fetchedAt: Date.now(),
  });
  expect(
    await collectReportBinding("owner", { project: "iota", identifier: "public-test" }, w),
  ).toMatchObject({ units: "0" });
  mock.history.mockResolvedValue({
    data: { alpha_amounts: [], timestamps: [], statuses: [] },
    error: "timeout",
    stale: true,
  });
  expect(
    await collectReportBinding("owner", { project: "iota", identifier: "public-test" }, w),
  ).toMatchObject({ units: null, reason: "unavailable" });
  mock.history.mockResolvedValue({
    data: {
      alpha_amounts: Array(30).fill(1),
      timestamps: Array(30).fill(w.end / 1000),
      statuses: Array(30).fill("settled"),
    },
    error: null,
    stale: false,
  });
  expect(
    await collectReportBinding("owner", { project: "iota", identifier: "public-test" }, w),
  ).toMatchObject({ units: null });
});
it("rejects a lagging index and queries Quantus using the exact previous-day bounds", async () => {
  mock.graph.mockResolvedValue({
    data: {
      latest: [{ timestamp: new Date(w.end + 1000).toISOString() }],
      rewards: { aggregate: { count: 0, sum: { reward: null } } },
    },
  });
  expect(
    await collectReportBinding("owner", { project: "quantus", identifier: "public-test" }, w),
  ).toMatchObject({ units: "0", decimals: 12 });
  const body = mock.graph.mock.calls[0]![1].body;
  expect(body.variables.since).toBe(new Date(w.start).toISOString());
  expect(body.variables.until).toBe(new Date(w.end).toISOString());
  expect(body.query).toContain("_lt:");
  mock.graph.mockResolvedValue({
    data: {
      latest: [{ timestamp: new Date(w.end - 1000).toISOString() }],
      rewards: { aggregate: { count: 0, sum: { reward: null } } },
    },
  });
  expect(
    await collectReportBinding("owner", { project: "quantus", identifier: "public-test" }, w),
  ).toMatchObject({ units: null });
});
it("uses historical Vast scope and does not substitute other periods or invalid identifiers", async () => {
  mock.vast.mockResolvedValue({ periodStart: w.start, reward: 0, partial: false });
  expect(
    await collectReportBinding("owner", { project: "vast", identifier: "public-test" }, w),
  ).toMatchObject({ units: "0", usd: 0 });
  expect(mock.vast).toHaveBeenCalledWith("owner", "public-test", w.end);
  expect(
    await collectReportBinding("owner", { project: "golem", identifier: "public-test" }, w),
  ).toMatchObject({ reason: "different_period", units: null });
  expect(
    await collectReportBinding("owner", { project: "gonka", identifier: "public-test" }, w),
  ).toMatchObject({ reason: "unsupported" });
  expect(
    await collectReportBinding("owner", { project: "erg", identifier: "not-a-ledger" }, w),
  ).toMatchObject({ reason: "different_period", units: null, usd: null });
  const before = mock.history.mock.calls.length;
  await collectReportBinding("owner", { project: "iota", identifier: "../unsafe" }, w);
  expect(mock.history.mock.calls.length).toBe(before);
});

it("attributes next-day IOTA records to yesterday without shifting other projects or ledger history", async () => {
  const { collectEmailReportBinding } = await import("./daily-report-collect.server");
  mock.history.mockResolvedValue({
    data: {
      alpha_amounts: [2.76373384, 0.16464501, 5],
      timestamps: [w.start / 1000 + 8 * 3600, w.end / 1000 + 8 * 3600, w.end / 1000 + 86400],
      statuses: ["settled", "pending", "settled"],
    },
    fetchedAt: Date.now(),
    error: null,
    stale: false,
  });
  expect(
    await collectEmailReportBinding("owner", { project: "iota", identifier: "public-test" }, w),
  ).toMatchObject({ units: "16464501" });
  expect(
    await collectReportBinding("owner", { project: "iota", identifier: "public-test" }, w),
  ).toMatchObject({ units: "276373384" });
  mock.vast.mockResolvedValue({ periodStart: w.start, reward: 3, partial: false });
  await collectEmailReportBinding("owner", { project: "vast", identifier: "public-test" }, w);
  expect(mock.vast).toHaveBeenCalledWith("owner", "public-test", w.end);
});

it("excludes future IOTA accounting entries from a morning email", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-16T01:30:00Z"));
  try {
    const { collectEmailReportBinding } = await import("./daily-report-collect.server");
    const window = reportDayWindow("2026-10-15");
    mock.history.mockResolvedValue({
      data: {
        alpha_amounts: [0.16464501, 9],
        timestamps: [Date.now() / 1000 - 60, Date.now() / 1000 + 60],
        statuses: ["pending", "settled"],
      },
      fetchedAt: Date.now(),
      error: null,
      stale: false,
    });
    expect(
      await collectEmailReportBinding(
        "owner",
        { project: "iota", identifier: "public-test" },
        window,
      ),
    ).toMatchObject({ units: "16464501" });
  } finally {
    vi.useRealTimers();
  }
});
