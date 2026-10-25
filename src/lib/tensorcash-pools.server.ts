import { upstreamJson } from "./upstream-json.server";
import { record } from "./projects";
import { parseTscBob, parseTscTiger, parseTscAria, parseTscSuprnova } from "./tensorcash-pools";
import { validTscAddress } from "./tensorcash";
import { readTscBalance } from "./tensorcash.server";
import { parsePrlLuckyPool } from "./prl-luckypool";
import type { PoolProvider } from "./pool-projects";
import type { PoolAccount } from "./pool-monitor";
export async function readTscPool(
  address: string,
  pool: PoolProvider,
  fetcher: typeof fetch = fetch,
): Promise<PoolAccount> {
  if (!validTscAddress(address)) throw new Error("invalid-address");
  const id = encodeURIComponent(address),
    get = (u: string) => upstreamJson(u, { maxBytes: 1000000 }, fetcher);
  switch (pool) {
    case "chain": {
      const d = await readTscBalance(address, fetcher);
      return {
        balance: null,
        chainBalanceExact: d.balanceExact!,
        paid: null,
        reward: null,
        period: "unknown",
        workers: [],
        workerCount: 0,
        partial: true,
        hashrate: null,
      };
    }
    case "tigerpool":
      return parseTscTiger(
        await get(`https://tsc-miner.tiger-pool.com/api/v1/address/${id}`),
        address,
      );
    case "boblabs":
      return parseTscBob(
        await get(`https://pool.tensorcash.boblabs.eu/api/wallet?addr=${id}`),
        address,
      );
    case "ariapool": {
      const status = record(await get("https://pool.ariabrain.com/tsc-stats.json"));
      if (status["paused"] === true) throw new Error("pool-paused");
      return parseTscAria(await get(`https://pool.ariabrain.com/tsc-pool/api/miner?addr=${id}`));
    }
    case "suprnova":
      return parseTscSuprnova(await get(`https://tsc.suprnova.cc/api/pools/tsc/miners/${id}`));
    case "luckypool": {
      const [cfg, data] = await Promise.all([
        get("https://tensorcash.luckypool.io/api/stats?v=2"),
        get(`https://tensorcash.luckypool.io/api/stats_address?address=${id}`),
      ]);
      const config = record(record(cfg)["config"]);
      if (
        config["symbol"] !== "TSC" ||
        config["coinUnits"] !== 1e8 ||
        config["rateUnit"] !== "PoI/s"
      )
        throw new Error("invalid-data");
      const d = parsePrlLuckyPool(config, data, address, Date.now(), "TSC");
      return {
        ...d,
        rateUnit: "PoI/s",
        workers: d.workers.map((w) => ({ ...w, rateUnit: "PoI/s" })),
      };
    }
    default:
      throw new Error("invalid-pool");
  }
}
