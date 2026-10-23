import { normalizeBtcAddress } from "./btc-address";
import { parseCsd, normalizeCsdAddress } from "./csd";
import { parseBnt } from "./bnt";
import {
  poolProvider,
  twoMinersAccountUrl,
  validPoolAddress,
  type PoolProject,
} from "./pool-projects";
import { parseCkPool, parseKryptex, parseTwoMiners, parseMidstate } from "./pool-monitor";
import { ReadCache } from "./read-cache";
import { upstreamJson } from "./upstream-json.server";
import { record } from "./projects";
const cache = new ReadCache(300);
export function readPoolAccount(project: PoolProject, address: string) {
  if (!validPoolAddress(project, address)) throw new Error("invalid-address");
  if (project === "csd") address = normalizeCsdAddress(address);
  if (project === "btc") address = normalizeBtcAddress(address);
  return cache.read(`pool:${project}:${address}`, async () => {
    const id = encodeURIComponent(address);
    if (project === "csd") {
      const [account, rates] = await Promise.all([
        upstreamJson(`https://csd.yamaduo.no/api/miner/${id}`),
        cache.read("csd:rates", () =>
          upstreamJson("https://csd.yamaduo.no/miners.json", { maxBytes: 1000000 }),
        ),
      ]);
      return parseCsd(
        account,
        rates.data && !rates.error && !rates.stale ? rates.data : null,
        address,
      );
    }
    if (project === "bnt") {
      const [miner, balance] = await Promise.all([
        upstreamJson(`https://bntpool.com/api/miner/${id}`),
        upstreamJson(
          `https://bntpool.com/api/miner/${id}/balance?include_pending_estimate=true`,
        ).catch(() => null),
      ]);
      return parseBnt(miner, balance, address);
    }
    if (project === "mds") {
      const [config, account] = await Promise.all([
        cache.read("mds:units", async () => {
          const data = record(await upstreamJson("https://midstate.luckypool.io/api/stats?v=2"));
          const units = record(data["config"]);
          if (
            units["symbol"] !== "MDS" ||
            units["coinUnits"] !== 1 ||
            units["binaryUnits"] !== true
          )
            throw new Error("invalid-data");
          return true;
        }),
        upstreamJson(`https://midstate.luckypool.io/api/stats_address?address=${id}`),
      ]);
      if (!config.data || config.error || config.stale) throw new Error("invalid-data");
      return parseMidstate(account, address);
    }
    if (project === "btc") {
      return parseCkPool(
        await upstreamJson(`https://raw.stats.ckpool.org/users/${encodeURIComponent(address)}`, {
          maxBytes: 1000000,
        }),
        address,
      );
    }
    if (poolProvider(project) === "2miners") {
      const url = twoMinersAccountUrl(project, address);
      if (!url) throw new Error("invalid-address");
      return parseTwoMiners(project, await upstreamJson(url));
    }
    const base = `https://pool.kryptex.com/${project}/api`;
    const [balance, first, rewards, paid] = await Promise.all([
      upstreamJson(`${base}/v1/miner/balance/${id}`),
      upstreamJson(`${base}/v3/miner/workers/${id}`),
      upstreamJson(`${base}/v1/miner/reward-chart/${id}`).catch(() => null),
      upstreamJson(`${base}/v1/miner/payouts/${id}/stats`).catch(() => null),
    ]);
    const w = record(first);
    // Bound pagination and request volume; incomplete lists are visibly marked.
    if (Array.isArray(w["results"]) && typeof w["count"] === "number" && w["results"].length > 0) {
      const size = w["results"].length;
      const rows = [...w["results"]];
      for (let page = 2; rows.length < w["count"] && page <= 5; page++) {
        const next = await upstreamJson(`${base}/v3/miner/workers/${id}?page=${page}`).catch(
          () => null,
        );
        const more = record(next)["results"];
        if (!Array.isArray(more) || more.length === 0) break;
        rows.push(...more);
        if (more.length < size) break;
      }
      w["results"] = rows;
    }
    return parseKryptex(balance, w, rewards, paid);
  });
}
