import { expect, it, vi } from "vitest";
import { bindingIdentity, parseFleet } from "./fleet";
import { poolAccountKey, poolAccountUrl, poolProvider, validPoolProvider } from "./pool-projects";
import { parsePeryn, poolHashrate } from "./pool-monitor";
import { poolCumulativeEarnings } from "./cumulative-earnings";
const wallet = "prl1" + "q".repeat(58);
const perynAccount = {
  v: 1,
  address: wallet,
  network: "mainnet",
  unit: "MAC/s",
  hashrate1h: 310e12,
  hashrate24h: 290e12,
  workers: [
    { name: "rig01", online: true, hashrate1h: 310e12, lastShare: "2026-11-05T12:00:00Z" },
    { name: "rig02", online: false, hashrate1h: 0, lastShare: "2026-11-04T12:00:00Z" },
  ],
  balance: { owedPrl: "0.42000000", pendingPrl: "3.10000000", paidPrl: "25.00000000" },
  payouts: [{ amountPrl: "2.50000000", status: "sent" }],
};
it("preserves old PRL defaults and accepts the same address in two explicitly separate pools", () => {
  const binding = { id: "a", project: "prl" as const, identifier: wallet, worker: "" };
  const devices = parseFleet([
    { id: "one", name: "one", createdAt: 1, bindings: [binding] },
    {
      id: "two",
      name: "two",
      createdAt: 1,
      bindings: [{ ...binding, id: "b", pool: "luckypool" }],
    },
  ]);
  expect(devices[0]!.bindings[0]!.pool).toBe("kryptex");
  expect(devices[1]!.bindings[0]!.pool).toBe("luckypool");
  expect(bindingIdentity(devices[0]!.bindings[0]!)).not.toBe(
    bindingIdentity(devices[1]!.bindings[0]!),
  );
  expect(() => parseFleet([...devices, { ...devices[1]!, id: "duplicate" }])).toThrow(
    "invalid-binding",
  );
  expect(validPoolProvider("xmr", "luckypool")).toBe(false);
  expect(validPoolProvider("prl", "2miners")).toBe(false);
  expect(poolProvider("prl")).toBe("kryptex");
  expect(poolAccountKey("prl", wallet, "luckypool")).not.toEqual(
    poolAccountKey("prl", wallet, "kryptex"),
  );
  expect(poolAccountUrl("prl", wallet, "luckypool")).toBe(
    `https://pearl.luckypool.io/miner-stats?address=${wallet}`,
  );
});
const calls: string[] = [];
vi.mock("./upstream-json.server", () => ({
  upstreamJson: vi.fn(async (url: string) => {
    calls.push(url);
    if (url === `https://app.peryn.ai/api/v1/miner/${wallet}`) return perynAccount;
    if (url.includes("pearl.luckypool.io/api/stats?"))
      return { config: { symbol: "PRL", coinUnits: 100000000 } };
    if (url.includes("pearl.luckypool.io/api/stats_address"))
      return {
        stats: {
          wallet,
          unlocked: 2725,
          locked: 19790,
          paid: 0,
          hashrate: 131521442975,
          lastShare: Date.now(),
        },
        workers: [{ name: "cpu-01", hashrate: 131521442975, lastShare: Date.now() }],
        rewardStats: [{ period: "24h", amount: 19790 }],
      };
    if (url.includes("/balance/")) return { total: 12, last_active: Date.now() };
    if (url.includes("/workers/"))
      return { results: [{ worker: "gpu-01", status: "online", hashrate: 700 }] };
    if (url.includes("/reward-chart/")) return [];
    if (url.includes("/payouts/")) return { paid: 10 };
    throw Error("Unexpected URL");
  }),
}));
it("keeps actual upstream responses and server caches separated by pool", async () => {
  const { readPoolAccount } = await import("./pool-monitor.server");
  const kryptex = await readPoolAccount("prl", wallet, "kryptex");
  const lucky = await readPoolAccount("prl", wallet, "luckypool");
  const peryn = (await readPoolAccount("prl", wallet, "peryn")).data!;
  expect(kryptex.data?.balance).toBe(12);
  expect(lucky.data?.balance).toBe(0.00002725);
  expect(lucky.data?.pendingEstimate).toBe(0.0001979);
  expect(lucky.data?.workers[0]?.name).toBe("cpu-01");
  expect(peryn.balance).toBe(0.42);
  expect(peryn.paid).toBe(25);
  expect(poolCumulativeEarnings(peryn)).toBeCloseTo(28.52);
  expect(peryn.reward).toBeNull();
  expect(peryn.workers.map(({ name, online }) => [name, online])).toEqual([
    ["rig01", true], ["rig02", false],
  ]);
  expect(poolHashrate("prl", peryn.hashrate, peryn.rateUnit)).toBe("310 TMAC/s");
  const count = calls.length;
  expect((await readPoolAccount("prl", wallet, "kryptex")).data?.balance).toBe(12);
  expect(calls).toHaveLength(count);
  expect(() => readPoolAccount("xmr", wallet, "luckypool")).toThrow("invalid-pool");
});

it("distinguishes an unseen Peryn address from a previously paid wallet", () => {
  const empty = {
    ...perynAccount,
    hashrate1h: 0, hashrate24h: 0, workers: [], payouts: [],
    balance: { owedPrl: "0.00000000", pendingPrl: "0.00000000", paidPrl: "0.00000000" },
  };
  expect(() => parsePeryn(empty, wallet)).toThrow("not-found");
  expect(parsePeryn({ ...empty, balance: perynAccount.balance }, wallet).paid).toBe(25);
  expect(() => parsePeryn(perynAccount, "another-wallet")).toThrow("invalid-data");
});
