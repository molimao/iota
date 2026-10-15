import { poolProvider, type PoolProject } from "./pool-projects";
import { parseKryptex, parseTwoMiners } from "./pool-monitor";
import { ReadCache } from "./read-cache";
import { upstreamJson } from "./upstream-json.server";
import { record } from "./projects";
const cache = new ReadCache(300);
export function readPoolAccount(project: PoolProject, address: string) {
  return cache.read(`pool:${project}:${address}`, async () => {
    const id = encodeURIComponent(address);
    if (poolProvider(project) === "2miners")
      return parseTwoMiners(
        project,
        await upstreamJson(`https://${project}.2miners.com/api/accounts/${id}`),
      );
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
