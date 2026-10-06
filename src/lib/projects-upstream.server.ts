import { ReadCache } from "./read-cache";
import { upstreamJson } from "./upstream-json.server";
import {
  parseQuantusAccount,
  parseQuantusNetwork,
  parseXidNetwork,
  record,
  type MiningProject,
  type ProjectAccount,
  type ProjectNetwork,
  type ProjectResult,
} from "./projects";
import { hongKongDayStartSeconds } from "./earnings";

export const QUANTUS_MAINNET = "https://sqm.quantus.com/v1/graphql";
export const QUANTUS_NETWORK_QUERY = `query WatchNetwork {
  stats:chain_stats_by_pk(id:"global"){block_height total_accounts total_miners}
  blocks:block(limit:32,order_by:{height:desc}){height timestamp reward mined_by_id}
}`;
export const QUANTUS_ACCOUNT_QUERY = `query WatchRewards($id:String!,$since:timestamptz!,$until:timestamptz!){
  account:account_stats_by_pk(id:$id){total_mined_blocks total_rewards}
  today:miner_reward_aggregate(where:{miner_id:{_eq:$id},timestamp:{_gte:$since,_lte:$until}}){aggregate{count sum{reward}}}
  recent:miner_reward(limit:12,order_by:{timestamp:desc},where:{miner_id:{_eq:$id}}){reward timestamp block{height}}
}`;

const cache = new ReadCache(300);
export function cachedProjectRead<T>(
  key: string,
  read: () => Promise<T>,
  force = false,
): Promise<ProjectResult<T>> {
  return cache.read(key, read, { force }) as Promise<ProjectResult<T>>;
}
const json = (url: string, body?: object) => upstreamJson(url, { body });

async function graph(query: string, variables?: object) {
  const result = record(await json(QUANTUS_MAINNET, { query, variables }));
  if (result["errors"] || !result["data"]) throw new Error("invalid-data");
  return result["data"];
}

export function readProjectNetwork(project: MiningProject, force = false) {
  return cachedProjectRead<ProjectNetwork>(
    `network:${project}`,
    async () => {
      if (project === "quantus") return parseQuantusNetwork(await graph(QUANTUS_NETWORK_QUERY));
      const [network, stats] = await Promise.all([
        json("https://superknet.com/api/network"),
        json("https://superknet.com/api/stats"),
      ]);
      return parseXidNetwork(network, stats);
    },
    force,
  );
}

export function readQuantusAccount(address: string, force = false) {
  const now = Date.now(),
    since = hongKongDayStartSeconds(now);
  return cachedProjectRead<ProjectAccount>(
    `account:quantus:${address}:${since}`,
    async () =>
      parseQuantusAccount(
        await graph(QUANTUS_ACCOUNT_QUERY, {
          id: address,
          since: new Date(since * 1000).toISOString(),
          until: new Date(now).toISOString(),
        }),
        address,
      ),
    force,
  );
}
