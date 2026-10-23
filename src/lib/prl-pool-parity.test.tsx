import { expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PoolWorkerCards } from "@/components/pool-worker-cards";
import { parseKryptex, poolHashrate } from "./pool-monitor";
import { POOL_PROJECTS, poolName, poolProvider, validPoolAddress } from "./pool-projects";

const WALLET = "prl1qpzry9x8gf2tvdw0s3jn54khce6mua7lqpzry9x8gf2tvdw0s3jn54khce6mua7l";
const SECOND = "prl1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
const NOW = Date.parse("2026-10-23T11:00:00Z");
const DAY = Math.floor(NOW / 86400000) * 86400000;

it("parses a Pearl Kryptex wallet and keeps earnings off worker cards", () => {
  expect(validPoolAddress("prl", WALLET)).toBe(true);
  expect(validPoolAddress("prl", SECOND)).toBe(true);
  expect(validPoolAddress("prl", "0x1111111111111111111111111111111111111111")).toBe(false);
  expect(poolProvider("prl")).toBe("kryptex");
  expect(poolName("prl")).toBe("Kryptex");
  expect(POOL_PROJECTS.prl.name).toBe("Pearl");
  expect(POOL_PROJECTS.prl.token).toBe("PRL");

  const account = parseKryptex(
    { total: "12.45", last_active: NOW / 1000 },
    {
      count: 4,
      results: [
        {
          worker: "pearl-gpu-01",
          avg_hashrate_30m: "52100000",
          status: "online",
          last_share: (NOW - 20_000) / 1000,
        },
        {
          worker: "pearl-gpu-02",
          hashrate: "34300000",
          status: "online",
          last_share: (NOW - 50_000) / 1000,
        },
        {
          worker: "pearl-gpu-03",
          avg_hashrate_30m: "0",
          status: "offline",
          last_share: (NOW - 3 * 60 * 60 * 1000) / 1000,
        },
        { worker: "pearl-unknown", avg_hashrate_30m: "0", status: "paused" },
      ],
    },
    [{ timestamp: DAY / 1000, reward: "1.82" }],
    { paid: "318.6" },
    NOW,
  );

  expect(account.period).toBe("utcDay");
  expect(account.balance).toBe(12.45);
  expect(account.paid).toBe(318.6);
  expect(account.reward).toBe(1.82);
  expect(account.hashrate).toBe(86.4e6);
  expect(account.workers.map((worker) => worker.online)).toEqual([true, true, false, null]);
  expect(poolHashrate("prl", account.workers[0]!.hashrate)).toContain("MH/s");
  expect(poolHashrate("prl", account.workers[0]!.hashrate)).not.toContain("TH/s");

  const html = renderToStaticMarkup(
    createElement(PoolWorkerCards, {
      project: "prl",
      locale: "en",
      now: NOW,
      address: WALLET,
      account,
    }),
  );
  expect(html).toContain('data-worker="pearl-gpu-01"');
  expect(html).toContain('data-state="online"');
  expect(html).toContain('data-worker="pearl-gpu-02"');
  expect(html).toContain('data-state="offline"');
  expect(html).toContain('data-worker="pearl-unknown"');
  expect(html).toContain('data-state="unknown"');
  expect(html.match(/12\.45/g)).toBeNull();
  expect(html.match(/318\.6/g)).toBeNull();
  expect(html.match(/1\.82/g)).toBeNull();
  const cards = html.match(/<article/g) ?? [];
  expect(cards).toHaveLength(4);
});
