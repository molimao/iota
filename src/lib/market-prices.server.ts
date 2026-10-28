import { ReadCache } from "./read-cache";
import { fetchReportUsdPrices } from "./report-prices.server";
import type { ProjectId } from "./projects";

const cache = new ReadCache(100);
export function marketPrices(projects: readonly ProjectId[]) {
  const wanted = [...new Set(projects)].sort();
  return cache.read(`market-usd:${wanted.join(",")}`, () => fetchReportUsdPrices(wanted), {
    ttl: 300000,
  });
}
