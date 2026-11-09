import { hex } from "@scure/base";
import {
  DISCRETE_BLOCK_SECONDS,
  DISCRETE_SOLO_PAGE_SIZE,
  DISCRETE_SPEND_KEY_BYTES,
  type DiscreteSoloBlock,
  type DiscreteSoloPage,
} from "./discrete";
import { sha3_256 } from "@noble/hashes/sha3.js";
import { mapConcurrent } from "./concurrent";
import { finite, record } from "./projects";
import { ReadCache } from "./read-cache";
import { upstreamJson } from "./upstream-json.server";

const NODE = "https://seed1.discrete.cash:9332";
const networkCache = new ReadCache();

export function readDiscreteNetwork() {
  return networkCache.read("xds-network", async () => {
    const data = record(await upstreamJson(`${NODE}/getinfo`));
    const blockCount = finite(data["height"]);
    const difficulty = finite(data["difficulty"]);
    const nextReward = finite(data["next_reward"]);
    if (data["status"] !== "OK" || !blockCount || difficulty === null || nextReward === null)
      throw new Error("invalid-data");
    return {
      height: blockCount - 1,
      estimatedHashrate: difficulty / DISCRETE_BLOCK_SECONDS,
      nextReward: nextReward / 100,
    };
  });
}

export async function readDiscreteAccountNumber(view: Uint8Array, spend: Uint8Array) {
  const response = record(
    await upstreamJson(`${NODE}/json_rpc`, {
      body: {
        jsonrpc: "2.0",
        id: "iota-watch",
        method: "getaccountnumber",
        params: { view_pub: hex.encode(view), spend_pub: hex.encode(spend) },
      },
    }),
  );
  const data = record(response["result"]);
  if (data["registered"] === false) return null;
  const accountNumber = data["account_number"];
  if (
    data["registered"] !== true ||
    typeof accountNumber !== "string" ||
    !/^\d+-\d+-[0-9A-Z]{4}-[0-9A-Z]$/i.test(accountNumber)
  )
    throw new Error("invalid-data");
  return accountNumber;
}

const SOLO_NODE = "https://seed2.discrete.cash:9332";
const SOLO_BATCH_SIZE = 100;
const soloBatches = new ReadCache(120);
type IndexedBlock = DiscreteSoloBlock & { miner: string };

export function parseDiscreteSoloBatch(
  input: unknown,
  start: number,
  count: number,
): IndexedBlock[] {
  const { status, blocks } = record(input);
  if (status !== "OK" || !Array.isArray(blocks) || blocks.length !== count)
    throw new Error("invalid-data");

  return blocks.map((item, index) => {
    const { height, hash, timestamp, transactions } = record(item);
    const coinbase = record(Array.isArray(transactions) ? transactions[0] : null);
    const { extra, vout } = record(coinbase["transaction"]);
    const minerHex =
      typeof extra === "string" ? extra.slice(2, 2 + DISCRETE_SPEND_KEY_BYTES * 2) : "";
    const rewardUnits = record(Array.isArray(vout) && vout.length === 1 ? vout[0] : null)["amount"];
    // The mainnet coinbase starts with tag 07 and has a single miner reward output.
    if (
      height !== start + index ||
      typeof hash !== "string" ||
      !/^[0-9a-f]{64}$/i.test(hash) ||
      typeof timestamp !== "number" ||
      !Number.isSafeInteger(timestamp) ||
      timestamp <= 0 ||
      coinbase["coinbase"] !== true ||
      typeof extra !== "string" ||
      !extra.startsWith("07") ||
      minerHex.length !== DISCRETE_SPEND_KEY_BYTES * 2 ||
      !/^[0-9a-f]+$/i.test(minerHex) ||
      typeof rewardUnits !== "number" ||
      !Number.isSafeInteger(rewardUnits) ||
      rewardUnits < 0
    )
      throw new Error("invalid-data");

    return {
      height,
      hash,
      timestamp,
      rewardUnits,
      miner: hex.encode(sha3_256(hex.decode(minerHex))),
    };
  });
}

export async function readDiscreteSoloHistory(
  spend: Uint8Array,
  before?: number,
): Promise<DiscreteSoloPage> {
  let end = before;
  if (end === undefined) {
    const { status, height } = record(await upstreamJson(`${SOLO_NODE}/getinfo`));
    if (
      status !== "OK" ||
      typeof height !== "number" ||
      !Number.isSafeInteger(height) ||
      height < 2
    )
      throw new Error("invalid-data");
    end = height;
  }
  const fromHeight = Math.max(1, end - DISCRETE_SOLO_PAGE_SIZE);
  // Aligned batches are shared across different address queries and chain tips.
  const firstBatch = 1 + Math.floor((fromHeight - 1) / SOLO_BATCH_SIZE) * SOLO_BATCH_SIZE;
  const starts = Array.from(
    { length: Math.ceil((end - firstBatch) / SOLO_BATCH_SIZE) },
    (_, i) => firstBatch + i * SOLO_BATCH_SIZE,
  );
  const groups = await mapConcurrent(starts, 3, async (start) => {
    const count = Math.min(SOLO_BATCH_SIZE, end - start);
    const result = await soloBatches.read(`${start}:${count}`, async () =>
      parseDiscreteSoloBatch(
        await upstreamJson(`${SOLO_NODE}/get_wallet_sync_data`, {
          body: { start_height: start, block_count: count, include_miner_txs: true },
          maxBytes: 32 * 1024 * 1024,
        }),
        start,
        count,
      ),
    );
    if (!result.data || result.error) throw new Error("unavailable");
    return result.data;
  });
  const indexed = groups.flat().filter((block) => block.height >= fromHeight);
  const miner = hex.encode(sha3_256(spend));
  return {
    fromHeight,
    toHeight: end - 1,
    fromTime: indexed[0]!.timestamp,
    toTime: indexed.at(-1)!.timestamp,
    blocks: indexed
      .filter((block) => block.miner === miner)
      .map(({ miner: _miner, ...block }) => block)
      .reverse(),
  };
}
