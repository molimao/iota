import { ReadCache } from "./read-cache";
import { upstreamJson } from "./upstream-json.server";
import { fetchReportUsdPrices } from "./report-prices.server";
import { xmrigNetworkSchema } from "./xmr-hardware";
const cache = new ReadCache(1);
export async function readXmrHardwareMarket() {
  const result = await cache.read(
    "xmr-hardware-market",
    async () => {
      const [raw, prices] = await Promise.all([
        upstreamJson("https://api.xmrig.com/1/network/XMR"),
        fetchReportUsdPrices(["xmr"]),
      ]);
      const network = xmrigNetworkSchema.parse(raw);
      if (Date.now() - network.ts > 3600000 || prices.xmr === undefined)
        throw Error("xmr_reference_unavailable");
      return { network, usd: prices.xmr, fetchedAt: Date.now() };
    },
    { ttl: 300000 },
  );
  if (!result.data || result.error || result.stale) throw Error("xmr_reference_unavailable");
  return result.data;
}
