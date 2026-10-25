import { expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import samples from "./fixtures/tsc-public-pool-2026-10-25.json";
import { parseTscBob, parseTscSuprnova } from "./tensorcash-pools";
import { parsePrlLuckyPool } from "./prl-luckypool";
import { ProjectAddressBookView } from "@/components/project-address-book";
import { projectReadingMetrics } from "@/components/project-reading-metrics";
import { earningsBoard } from "./earnings-board";
import type { ProjectReading } from "@/components/fleet-review-data";
import { poolHashrate } from "./pool-monitor";
const bob = parseTscBob(samples.bob, samples.address);
it("reads actual recorded Bob Labs workers and payouts without treating payout as daily income", () => {
  expect(bob.workers).toHaveLength(4);
  expect(bob.workerCount).toBe(4);
  expect(bob.hashrate).toBe(102.24);
  expect(bob.workers.map((w) => w.hashrate)).toEqual([45.44, 37.86, 11.36, 7.57]);
  expect(bob.workers.every((w) => w.online === true)).toBe(true);
  expect(bob.paid).toBe(92.05780071);
  expect(bob.balance).toBe(0);
  expect(bob.reward).toBeNull();
});
it("retains real historical LuckyPool and Suprnova payouts at their different source precisions", () => {
  const lucky = parsePrlLuckyPool(
    { symbol: "TSC", coinUnits: 1e8 },
    samples.lucky,
    samples.address,
    Date.now(),
    "TSC",
  );
  expect(lucky.paid).toBe(2565.49228096);
  expect(lucky.hashrate).toBe(0);
  expect(lucky.workers).toEqual([]);
  const supr = parseTscSuprnova(samples.suprnova);
  expect(supr.paid).toBe(15.4372945911);
  expect(supr.balance).toBe(0);
  expect(supr.hashrate).toBeNull();
  expect(supr.reward).toBeNull();
});
it("renders the recorded workers on an address card and preserves balance, throughput and paid meanings on device cards", () => {
  const r: ProjectReading = {
    status: "online",
    health: "fresh",
    activity: poolHashrate("tsc", bob.hashrate, bob.rateUnit),
    today: null,
    lifetime: String(bob.paid),
    unit: "TSC",
    scope: "wallet",
    source: "Bob Labs",
    updated: "recorded",
    todayUsable: false,
    totalLabel: "累计已支付",
    accountSummary: { kind: "balance", amount: String(bob.balance), unit: "TSC" },
    poolWorkers: { count: bob.workerCount, workers: bob.workers, rateUnit: bob.rateUnit },
  };
  const metrics = projectReadingMetrics("tsc", r, "zh");
  expect(metrics.map((m) => [m.key, m.value])).toEqual([
    ["activity", "102.24 PoI/s"],
    ["account", "0"],
    ["total", "92.05780071"],
  ]);
  const markup = renderToStaticMarkup(
    createElement(ProjectAddressBookView, {
      project: "tsc",
      pool: "boblabs",
      locale: "zh",
      savedCount: 1,
      limit: 5,
      cards: [
        {
          ...r,
          deviceId: "test",
          deviceName: "Public example",
          bindingId: "binding",
          identifier: samples.address,
        },
      ],
      signedIn: true,
      fleetReady: true,
    }),
  );
  expect(markup).toContain("102.24 PoI/s");
  expect(markup).toContain("public-worker-1");
  expect(markup).toContain("92.05780071");
  expect(markup).not.toContain("MH/s");
  const binding = {
    id: "a",
    project: "tsc" as const,
    pool: "boblabs" as const,
    identifier: samples.address,
    worker: "",
  };
  const board = earningsBoard([
    { binding, deviceId: "one", data: r },
    { binding: { ...binding, id: "b" }, deviceId: "two", data: r },
  ]);
  expect(board.projects[0]?.accounts.size).toBe(2);
  expect(board.projects[0]?.metrics.size).toBe(0);
  expect([...board.projects[0]!.accounts.values()].find((a) => a.kind === "paid")?.amount).toBe(
    "92.05780071",
  );
  expect([...board.projects[0]!.accounts.values()][0]?.source).toBe("Bob Labs");
});
