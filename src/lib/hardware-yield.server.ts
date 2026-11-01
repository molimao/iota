import { ReadCache } from "./read-cache";
import { upstreamJson } from "./upstream-json.server";
import {
  parseHardwareYield,
  type HardwareModel,
  GPU_MODELS,
  bntNetworkSchema,
} from "./hardware-yield";
import { HARDWARE_CATALOG } from "./hardware-catalog";
import { blocknetHardwareRows } from "./blocknet-hardware";
import { fetchIotaUsdPrice } from "./iota-price.server";
import { readXmrHardwareMarket } from "./xmr-hardware.server";
import { xmrigStoredBenchmarkSchema, xmrHardwareRows } from "./xmr-hardware";
import rawBenchmarks from "./xmr-benchmarks.json";
const xmrBenchmarks = xmrigStoredBenchmarkSchema.array().parse(rawBenchmarks);
const cache = new ReadCache(64);
export async function hardwareYield(model: HardwareModel) {
  const result = await cache.read(
    model,
    async () => {
      if (!GPU_MODELS.includes(model as (typeof GPU_MODELS)[number])) {
        const seed = HARDWARE_CATALOG.find((s) => s.model === model)!;
        const rows = await Promise.all(
          seed.rows.map(async (row) => {
            if (row.project === "bnt") return (await liveBlocknet(model)).rows[0]!;
            if (row.project === "iota") {
              const price = await fetchIotaUsdPrice();
              if (price.usdPerIota === null || price.stale) throw Error("iota_quote_unavailable");
              return {
                ...row,
                fetchedAt: price.fetchedAt!,
                usdPerDay: row.coinsPerDay * price.usdPerIota,
              };
            }
            const market = await readXmrHardwareMarket();
            return xmrHardwareRows(
              xmrBenchmarks.filter((b) => b.model === model),
              market.network,
              market.usd,
              market.fetchedAt,
            )[0]!.rows[0]!;
          }),
        );
        return { ...seed, fetchedAt: Date.now(), rows };
      }
      const html = await upstreamJson(
        `https://pool.kryptex.com/device/gpu/nvidia/nvidia-geforce-rtx-${model}`,
        { responseType: "text", maxBytes: 1000000 },
      );
      const gpu = parseHardwareYield(html as string, model as (typeof GPU_MODELS)[number]);
      if (model !== "5090") return gpu;
      const bnt = await liveBlocknet(model);
      return { ...gpu, rows: [...gpu.rows, ...bnt.rows] };
    },
    { ttl: 1800000 },
  );
  return {
    data: result.data ?? fallbackHardware(model),
    snapshot: !!result.error || !!result.stale,
  };
}

function fallbackHardware(model: HardwareModel) {
  return HARDWARE_CATALOG.find((s) => s.model === model)!;
}
async function liveBlocknet(model: HardwareModel) {
  const stats = bntNetworkSchema.parse(await upstreamJson("https://bntpool.com/api/stats"));
  return blocknetHardwareRows(stats.chain.current_job_height, stats.chain.network_hashrate).find(
    (s) => s.model === model,
  )!;
}
