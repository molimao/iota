import { ReadCache } from "./read-cache";
import { upstreamJson } from "./upstream-json.server";
import {
  parseHardwareYield,
  hardwareYieldSchema,
  type HardwareModel,
  GPU_MODELS,
  bntNetworkSchema,
} from "./hardware-yield";
import snapshots from "./hardware-yield-snapshot.json";
import macSnapshots from "./mac-yield-snapshot.json";
import { blocknetHardwareRows } from "./blocknet-hardware";
import { fetchIotaUsdPrice } from "./iota-price.server";
const seeds = snapshots.map((s) => hardwareYieldSchema.parse(s));
const macSeeds = macSnapshots.map((s) => hardwareYieldSchema.parse(s));
const cache = new ReadCache(20);
export async function hardwareYield(model: HardwareModel) {
  const result = await cache.read(
    model,
    async () => {
      if (!GPU_MODELS.includes(model as (typeof GPU_MODELS)[number])) {
        const seed = macSeeds.find((s) => s.model === model)!;
        if (model === "m4-max-48") return await liveBlocknet(model);
        const price = await fetchIotaUsdPrice();
        if (price.usdPerIota === null || price.stale) throw Error("iota_quote_unavailable");
        return {
          ...seed,
          rows: seed.rows.map((row) => ({
            ...row,
            usdPerDay: row.coinsPerDay * price.usdPerIota!,
          })),
        };
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
  const gpu = seeds.find((s) => s.model === model);
  const extra = macSeeds.find((s) => s.model === model);
  if (!gpu) return extra!;
  return { ...gpu, rows: [...gpu.rows, ...(extra ? extra.rows : [])] };
}
async function liveBlocknet(model: HardwareModel) {
  const stats = bntNetworkSchema.parse(await upstreamJson("https://bntpool.com/api/stats"));
  return blocknetHardwareRows(stats.chain.current_job_height, stats.chain.network_hashrate).find(
    (s) => s.model === model,
  )!;
}
