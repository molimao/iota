import { validBntAddress } from "./bnt";
import {
  parseBntHashrateHistory,
  BNT_HASHRATE_RANGES,
  type BntHashrateRange,
} from "./bnt-hashrate";
import { ReadCache } from "./read-cache";
import { upstreamJson } from "./upstream-json.server";
const cache = new ReadCache(100);
export function readBntHashrateHistory(address: string, range: BntHashrateRange) {
  if (!validBntAddress(address) || !BNT_HASHRATE_RANGES.includes(range))
    throw new Error("invalid-address");
  return cache.read(
    `bnt-hashrate:${address}:${range}`,
    async () =>
      parseBntHashrateHistory(
        await upstreamJson(
          `https://bntpool.com/api/miner/${encodeURIComponent(address)}/hashrate?range=${range}`,
          { maxBytes: 1000000 },
        ),
      ),
    { ttl: 120000 },
  );
}
