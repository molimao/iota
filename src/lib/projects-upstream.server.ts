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

type Entry<T> = {
  result: ProjectResult<T>;
  attemptedAt: number;
  pending?: Promise<ProjectResult<T>> | undefined;
};
const cache = new Map<string, Entry<unknown>>();

/** Coalesced reads, minimum refresh interval, bounded cache; errors keep the original clock. */
export async function cachedProjectRead<T>(
  key: string,
  read: () => Promise<T>,
  force = false,
): Promise<ProjectResult<T>> {
  let entry = cache.get(key) as Entry<T> | undefined;
  if (entry?.pending) return entry.pending;
  if (entry && Date.now() - entry.attemptedAt < (force ? 5000 : entry.result.error ? 15000 : 60000))
    return entry.result;
  if (!entry) {
    if (cache.size >= 200) cache.delete(cache.keys().next().value!);
    entry = { result: { data: null, fetchedAt: null, stale: false, error: null }, attemptedAt: 0 };
    cache.set(key, entry as Entry<unknown>);
  }
  const target = entry;
  target.attemptedAt = Date.now();
  target.pending = (async () => {
    try {
      const data = await read();
      target.result = { data, fetchedAt: Date.now(), stale: false, error: null };
    } catch (error) {
      target.result = {
        ...target.result,
        stale: target.result["data"] !== null,
        error:
          error instanceof Error && error.message === "invalid-data"
            ? "invalid-data"
            : "unavailable",
      };
    } finally {
      target.pending = undefined;
    }
    return target.result;
  })();
  return target.pending;
}

async function json(url: string, body?: object): Promise<unknown> {
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    ...(body
      ? { headers: { "content-type": "application/json" }, body: JSON.stringify(body) }
      : {}),
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error("unavailable");
  const text = await response.text();
  if (text.length > 2_000_000) throw new Error("invalid-data");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("invalid-data");
  }
}

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
