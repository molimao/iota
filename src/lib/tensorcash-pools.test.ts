import { expect, it } from "vitest";
import { parseTscBob, parseTscTiger, parseTscAria, parseTscSuprnova } from "./tensorcash-pools";
import { readTscPool } from "./tensorcash-pools.server";
import { bindingIdentity, parseFleet } from "./fleet";
import { validPoolProvider, poolAccountKey } from "./pool-projects";
import { computeSummary } from "./compute-summary";
const address = "tc1qmvalge7mnhct9qj5uua8rn0dmjcyh6fmvrr46j";
// Synthetic contract fixtures based on the pools' published frontend fields, not user telemetry.
it("separates pool workers and unpaid money from on-chain balance and daily mining income", () => {
  const d = parseTscBob(
    {
      wallet: address,
      owed: 1.2,
      paid: 3,
      pending: 0.2,
      n_machines: 2,
      draws_per_sec: 10,
      machines: [
        { label: "mini", draws_per_sec: 6, connected: true },
        { label: "studio", draws_per_sec: 4, connected: false },
      ],
    },
    address,
  );
  expect(d.balance).toBe(1.2);
  expect(d.reward).toBeNull();
  expect(d.workers).toHaveLength(2);
  expect(d.workers[0]?.hashrate).toBe(6);
  expect(d.rateUnit).toBe("PoI/s");
  expect(() => parseTscBob({ wallet: "wrong", machines: [] }, address)).toThrow("invalid-data");
  expect(() =>
    parseTscBob(
      { wallet: address, total_shares: 0, connected: false, paid: 0, owed: 0, machines: [] },
      address,
    ),
  ).toThrow("not-found");
});
it("scales only atomic pool fields and retains unknowns and native rate units", () => {
  const t = parseTscTiger(
    {
      wallet: {
        Wallet: address,
        BalanceSats: 123456789,
        PaidSats: 200000000,
        ActualEarnings24hSats: 1000000,
      },
      workers: [{ WorkerID: "rig", Hashrate: 2, ConnectionStatus: "online" }],
    },
    address,
  );
  expect(t.balance).toBe(1.23456789);
  expect(t.reward).toBe(0.01);
  expect(t.rateUnit).toBe("N/s");
  expect(t.workers[0]?.online).toBe(true);
  const a = parseTscAria(
    {
      hashrate: 8,
      owed: 25000000,
      paid: 100000000,
      workers: [{ worker: "A", hashrate: 8, last_share_s: 25 }],
    },
    100000,
  );
  expect(a.balance).toBe(0.25);
  expect(a.workers[0]?.lastSeen).toBe(75000);
  expect(a.reward).toBeNull();
  const s = parseTscSuprnova(
    {
      pendingBalance: "1.5",
      totalPaid: "2",
      unconfirmedBalance: ".3",
      performance: { created: new Date(100000).toISOString(), workers: { B: { hashrate: 5 } } },
    },
    100000,
  );
  expect(s.balance).toBe(1.5);
  expect(s.paid).toBe(2);
  expect(s.workers[0]?.hashrate).toBe(5);
  expect(s.reward).toBeNull();
});
it("keeps all five pools and chain as distinct saved sources and query keys", () => {
  const pools = ["chain", "tigerpool", "boblabs", "ariapool", "luckypool", "suprnova"] as const;
  const bindings = pools.map((pool, i) => ({
    id: String(i),
    project: "tsc" as const,
    identifier: address,
    worker: "",
    pool,
  }));
  expect(new Set(bindings.map(bindingIdentity)).size).toBe(6);
  expect(new Set(pools.map((p) => JSON.stringify(poolAccountKey("tsc", address, p)))).size).toBe(6);
  for (const p of pools) expect(validPoolProvider("tsc", p)).toBe(true);
  expect(validPoolProvider("tsc", "kryptex")).toBe(false);
  expect(
    parseFleet([{ id: "device", name: "Mac", hardware: "", createdAt: 1, bindings }])[0]?.bindings,
  ).toHaveLength(6);
});
it("uses fixed read-only hosts and stops querying a paused pool", async () => {
  const urls: string[] = [];
  const f = (async (url: RequestInfo | URL) => {
    urls.push(String(url));
    return Response.json({ paused: true });
  }) as typeof fetch;
  await expect(readTscPool(address, "ariapool", f)).rejects.toThrow("pool-paused");
  expect(urls).toEqual(["https://pool.ariabrain.com/tsc-stats.json"]);
  await expect(readTscPool(address, "kryptex", f)).rejects.toThrow("invalid-pool");
  expect(urls).toHaveLength(1);
});
it("does not add N/s to PoI/s or double count wallet totals and their workers", () => {
  const binding = {
    id: "a",
    project: "tsc" as const,
    identifier: address,
    worker: "",
    pool: "boblabs" as const,
  };
  const at = Date.now(),
    compute = {
      value: 10,
      unit: "PoI/s" as const,
      scope: "account" as const,
      fresh: true,
      fetchedAt: at,
    };
  const groups = computeSummary(
    [
      { binding, name: "all", compute },
      {
        binding: { ...binding, id: "b", worker: "one" },
        name: "one",
        compute: { ...compute, scope: "worker", value: 6 },
      },
      {
        binding: { ...binding, id: "c", pool: "tigerpool" },
        name: "tiger",
        compute: { ...compute, unit: "N/s", value: 2 },
      },
    ],
    at,
  );
  expect(groups.map((g) => [g.unit, g.total])).toEqual([
    ["PoI/s", 10],
    ["N/s", 2],
  ]);
});

it("validates LuckyPool coin, precision and proof rate before mapping workers", async () => {
  const urls: string[] = [];
  const f = (async (url: RequestInfo | URL) => {
    urls.push(String(url));
    return Response.json(
      String(url).includes("/stats?")
        ? { config: { symbol: "TSC", coinUnits: 1e8, rateUnit: "PoI/s" } }
        : {
            stats: {
              wallet: address,
              unlocked: "12345678",
              locked: "1",
              paid: "200000000",
              hashrate: 3,
            },
            workers: [{ name: "rig", hashrate: 3, lastSeen: Math.floor(Date.now() / 1000) }],
            rewardStats: [{ period: "24h", amount: "25000000" }],
          },
    );
  }) as typeof fetch;
  const d = await readTscPool(address, "luckypool", f);
  expect(d.balance).toBe(0.12345678);
  expect(d.reward).toBe(0.25);
  expect(d.rateUnit).toBe("PoI/s");
  expect(d.workers[0]?.rateUnit).toBe("PoI/s");
  expect(urls).toEqual([
    "https://tensorcash.luckypool.io/api/stats?v=2",
    `https://tensorcash.luckypool.io/api/stats_address?address=${address}`,
  ]);
});
