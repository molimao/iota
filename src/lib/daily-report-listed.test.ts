import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { reportDayWindow } from "./daily-report";

const mock = vi.hoisted(() => ({
  pool: vi.fn(),
  platform: vi.fn(),
  flyai: vi.fn(),
  network: vi.fn(),
  ionet: vi.fn(),
}));
vi.mock("./fleet", () => ({ validBinding: () => true }));
vi.mock("./pool-monitor.server", () => ({ readPoolAccount: mock.pool }));
vi.mock("./platforms-upstream.server", () => ({ readPublicPlatform: mock.platform }));
vi.mock("./flyai.server", () => ({ readFlyaiMonth: mock.flyai }));
vi.mock("./projects-upstream.server", () => ({
  QUANTUS_MAINNET: "https://example.invalid",
  readProjectNetwork: mock.network,
}));
vi.mock("./platforms.server", () => ({ vastReportDay: vi.fn(), ionetReportDay: mock.ionet }));
vi.mock("./iota-upstream.server", () => ({
  TTL: { rewards: 1 },
  fetchUpstream: vi.fn(),
}));
vi.mock("./upstream-json.server", () => ({ upstreamJson: vi.fn() }));

import { collectEmailReportBinding, collectReportBinding } from "./daily-report-collect.server";

const window = reportDayWindow("2026-10-15");
beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-16T01:30:00Z"));
});
afterEach(() => vi.useRealTimers());

it("puts pool, compute, and balance figures on the email without treating them as ledger days", async () => {
  mock.pool.mockResolvedValueOnce({
    data: {
      reward: 0.25,
      period: "rolling24h",
      balance: 4,
      partial: false,
    },
    error: null,
    stale: false,
  });
  await expect(
    collectEmailReportBinding(
      "owner",
      { project: "kas", identifier: "wallet", pool: "2miners" },
      window,
    ),
  ).resolves.toMatchObject({ units: "25000000", decimals: 8, period: "rolling24h", usd: null });
  expect(mock.pool).toHaveBeenCalledWith("kas", "wallet", "2miners");

  mock.pool.mockResolvedValueOnce({
    data: { reward: 99, period: "rolling24h", balance: 99, partial: false },
    error: "upstream",
    stale: true,
  });
  await expect(
    collectEmailReportBinding(
      "owner",
      { project: "kas", identifier: "wallet", pool: "2miners" },
      window,
    ),
  ).resolves.toMatchObject({ units: null, reason: "unavailable" });

  mock.pool.mockResolvedValueOnce({
    data: {
      reward: null,
      period: "unknown",
      balance: 1.5,
      partial: false,
    },
    error: null,
    stale: false,
  });
  await expect(
    collectEmailReportBinding("owner", { project: "bnt", identifier: "wallet" }, window),
  ).resolves.toMatchObject({ period: "balance" });

  mock.pool.mockResolvedValueOnce({
    data: {
      reward: null,
      period: "unknown",
      balance: null,
      partial: true,
    },
    error: null,
    stale: false,
  });
  await expect(
    collectEmailReportBinding("owner", { project: "btc", identifier: "wallet" }, window),
  ).resolves.toMatchObject({ units: null, reason: "unavailable" });

  mock.platform.mockResolvedValueOnce({
    reward: 2,
    period: "rolling24h",
    balance: null,
    partial: false,
  });
  await expect(
    collectEmailReportBinding("owner", { project: "golem", identifier: "node" }, window),
  ).resolves.toMatchObject({ period: "rolling24h", units: "200000000" });

  mock.platform.mockResolvedValueOnce({
    acurastRewards: {
      managers: [
        { id: "1", today: "1", yesterday: "1.5", cumulative: "4" },
        { id: "2", today: "0", yesterday: "0.25", cumulative: "1" },
      ],
    },
  });
  await expect(
    collectEmailReportBinding("owner", { project: "acurast", identifier: "account" }, window),
  ).resolves.toMatchObject({ units: "1750000000000", decimals: 12, period: "hkDay" });

  mock.flyai.mockResolvedValue({
    data: {
      month: "2026-10",
      endsAt: "2026-11-01T00:00:00Z",
      totalPoints: 10,
      wallets: [{ wallet: "0xabc", points: 4.5, share: 0.2 }],
    },
    error: null,
    stale: false,
    fetchedAt: Date.now(),
  });
  await expect(
    collectEmailReportBinding("owner", { project: "flyai", identifier: "0xabc" }, window),
  ).resolves.toMatchObject({ period: "month" });

  mock.network.mockResolvedValue({
    data: { balances: { wallet: 3 }, poolStale: false },
    error: null,
    stale: false,
    fetchedAt: 1,
  });
  await expect(
    collectEmailReportBinding("owner", { project: "xid", identifier: "wallet" }, window),
  ).resolves.toMatchObject({ period: "balance" });

  const callsBeforeLedgerRead = mock.pool.mock.calls.length;
  await collectReportBinding("owner", { project: "erg", identifier: "wallet" }, window);
  expect(mock.pool).toHaveBeenCalledTimes(callsBeforeLedgerRead);
});
