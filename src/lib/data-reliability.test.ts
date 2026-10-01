import { afterEach, describe, expect, it, vi } from "vitest";
import { parseUpstreamPayload, upstreamKind } from "./iota-api-schema";
import { buildDeviceEarnings, earningsFreshness, mergeEarnings } from "./earnings-data";
import { hongKongDayStartSeconds, UNIT_SCALE } from "./earnings";
import { aggregateFarmMiners } from "./farm";
import { mergeDiscovery } from "./iota-discover";
import { trainingRows } from "./training";
import { computeStatus } from "./device-status";
import type { DiscoveryResult, MinerRecord } from "./iota-types";

const now = Date.parse("2026-09-30T15:59:59Z");
const good = <T>(data: T) => ({ data, fetchedAt: now, error: null, stale: false });
const totals = {
  total_amount_earned: 9,
  total_amount_paid: 6,
  total_amount_pending: 3,
  total_amount_frozen: 1,
  minimum_payout_amount: 0.4,
};
const history = {
  alpha_amounts: [2, 1],
  timestamps: [now / 1000 - 1, now / 1000 - 2],
  statuses: ["settled", "frozen"],
};
const roster: MinerRecord = {
  hotkey: "test-only",
  coldkey: "test-only",
  timestamp: 1,
  layer: 0,
  throughput: 2,
  activation_count: 4,
  is_active: true,
  registration_time: 1,
  run_id: "r1",
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.resetModules();
});

it("keeps a never-fetched device unknown and does not let polling renew stale status", () => {
  expect(
    computeStatus({ miner: null, fullCoverage: false, lastSuccessfulFetchAt: null, now }),
  ).toBe("unknown");
  expect(
    computeStatus({
      miner: roster,
      fullCoverage: true,
      lastSuccessfulFetchAt: now - 360_000,
      now,
      fetching: true,
    }),
  ).toBe("refresh_interrupted");
});

describe("official payload boundary", () => {
  it("rejects unexpected destinations and query parameters", () => {
    for (const path of [
      "https://example.com",
      "//example.com/runs",
      "/miners?url=https://example.com",
      "/runs?force=true",
      "/progress",
      "/miners?run_id=a&run_id=b",
    ])
      expect(() => upstreamKind(path)).toThrow();
    expect(upstreamKind("/miners?run_id=r1")).toBe("miners");
  });
  it("distinguishes successful empty results from malformed or misaligned data", () => {
    expect(parseUpstreamPayload("/runs", { runs: [] })).toEqual({ runs: [] });
    expect(() => parseUpstreamPayload("/runs", {})).toThrow();
    expect(() =>
      parseUpstreamPayload("/v1/runs_occupancy", {
        run_ids: ["a"],
        max_miners: [],
        active_miners: [1],
        slots_remaining: [2],
      }),
    ).toThrow();
    expect(() =>
      parseUpstreamPayload("/miners", { miners: [{ ...roster, is_active: "true" }] }),
    ).toThrow();
  });
});

describe("separate reward clocks and accounting days", () => {
  it("keeps lifetime rewards usable when the history endpoint fails", () => {
    const result = buildDeviceEarnings(
      "test-only",
      good(totals),
      { ...good(history), error: "timeout", stale: true },
      now,
    );
    expect(earningsFreshness(result, now)).toEqual({ today: false, lifetime: true });
    expect(result.paidUnits).toBe(6 * UNIT_SCALE);
    expect(result.totalEarnedUnits).toBe(9 * UNIT_SCALE);
    expect(result.todayUnits).toBe(2 * UNIT_SCALE);
    expect(result.historyCount).toBe(2);
  });
  it("hides yesterday's total at Hong Kong midnight and recomputes from cached history", () => {
    const before = buildDeviceEarnings("test-only", good(totals), good(history), now);
    const afterMidnight = now + 2000;
    expect(earningsFreshness(before, afterMidnight).today).toBe(false);
    const after = buildDeviceEarnings("test-only", good(totals), good(history), afterMidnight);
    expect(after.accountingDay).toBe(hongKongDayStartSeconds(afterMidnight));
    expect(after.todayUnits).toBe(0);
  });
  it("retains balances and their original clocks on a later failure", () => {
    const before = buildDeviceEarnings("test-only", good(totals), good(history), now);
    const failed = { data: null, fetchedAt: null, error: "timeout", stale: true };
    const after = mergeEarnings(
      [buildDeviceEarnings("test-only", failed, failed, now + 500)],
      [before],
    )[0]!;
    expect(after.totalEarnedUnits).toBe(before.totalEarnedUnits);
    expect(after.recent).toEqual(before.recent);
    expect(after.totalsFetchedAt).toBe(now);
    expect(earningsFreshness(after, now + 500)).toEqual({ today: false, lifetime: false });
  });
});

it("removes a vanished miner after full coverage, retaining it only on incomplete coverage", () => {
  const before: DiscoveryResult = {
    devices: [{ hotkey: roster.hotkey, miner: roster, fetchedAt: now, runIds: ["r1"] }],
    runs: [],
    runsTotal: 1,
    runsFetched: 1,
    fullCoverage: true,
    fetchedAt: now,
    errors: [],
  };
  const next = {
    ...before,
    devices: [{ hotkey: roster.hotkey, miner: null, fetchedAt: null, runIds: [] }],
  };
  expect(mergeDiscovery(next, before).devices[0]?.miner).toBeNull();
  expect(mergeDiscovery({ ...next, fullCoverage: false }, before).devices[0]?.stale).toBe(true);
});

it("does not turn failed miner lists into zero and deduplicates devices across runs", () => {
  expect(aggregateFarmMiners([{ runId: "r1", miners: null }])).toMatchObject({
    online: null,
    training: null,
    knownRuns: 0,
  });
  expect(aggregateFarmMiners([{ runId: "r1", miners: [] }])).toMatchObject({
    online: 0,
    training: 0,
    knownRuns: 1,
  });
  expect(
    aggregateFarmMiners([
      { runId: "r1", miners: [roster] },
      { runId: "r2", miners: [{ ...roster, timestamp: 2 }] },
    ]),
  ).toMatchObject({ listed: 1, online: 1, training: 1 });
});

it("joins independent training series by epoch without inventing missing values", () => {
  const rows = trainingRows(
    {
      epochs: [4, 2],
      timestamps: [40, 20],
      token_counts: [100, 0],
      act_contribution_percs: [0.1, 0],
      activation_ranks: [1, 0],
      num_hotkeys_in_epochs: [3, 0],
    },
    { epochs: [2, 3], timestamps: [21, 30], throughputs: [0, 4] },
    { epochs: [4], timestamps: [41], token_counts_cumulative: [900] },
  );
  expect(rows.map((row) => [row.epoch, row.tokens, row.throughput, row.cumulative])).toEqual([
    [4, 100, null, 900],
    [3, null, 4, null],
    [2, 0, 0, null],
  ]);
  expect(rows[2]?.rank).toBeNull();
});

describe("shared official proxy", () => {
  it("shares requests, caches success, and preserves its clock after invalid data", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ runs: [] })));
    vi.stubGlobal("fetch", fetch);
    const { fetchUpstream } = await import("./iota-upstream.server");
    const [first, second] = await Promise.all([
      fetchUpstream("/runs", 1000),
      fetchUpstream("/runs", 1000),
    ]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(first).toEqual(second);
    await vi.advanceTimersByTimeAsync(1100);
    fetch.mockResolvedValue(new Response(JSON.stringify({ unexpected: [] })));
    const failed = await fetchUpstream("/runs", 1000);
    expect(failed).toMatchObject({ data: { runs: [] }, fetchedAt: now, stale: true });
    expect(failed.error).toMatch(/格式/);
    await fetchUpstream("/runs", 1000);
    await fetchUpstream("/runs", 1000, true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("bounds simultaneous connections and does not duplicate a queued request", async () => {
    const releases: Array<() => void> = [];
    const fetch = vi.fn(
      () =>
        new Promise<Response>((resolve) =>
          releases.push(() => resolve(new Response(JSON.stringify({ miners: [] })))),
        ),
    );
    vi.stubGlobal("fetch", fetch);
    const { fetchUpstream } = await import("./iota-upstream.server");
    const pending = [1, 2, 3, 4].map((id) => fetchUpstream(`/miners?run_id=r${id}`, 1000));
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    const duplicate = fetchUpstream("/miners?run_id=r4", 1000);
    releases[0]!();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
    releases.slice(1).forEach((release) => release());
    await Promise.all([...pending, duplicate]);
    expect(fetch).toHaveBeenCalledTimes(4);
  });
  it("honors the official rate-limit retry time", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response("rate limited", { status: 429, headers: { "retry-after": "60" } }),
      );
    vi.stubGlobal("fetch", fetch);
    const { fetchUpstream } = await import("./iota-upstream.server");
    expect((await fetchUpstream("/runs", 1000)).retryAt).toBe(now + 60_000);
    await vi.advanceTimersByTimeAsync(30_000);
    await fetchUpstream("/runs", 1000);
    await fetchUpstream("/runs", 1000, true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
