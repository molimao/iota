import { ReadCache } from "./read-cache";
import type { AcurastQuote } from "./acurast-rewards";
import { acurastUsd } from "./acurast-rewards";
const cache = new ReadCache(1);
export async function readAcurastPrice(fetcher: typeof fetch = fetch): Promise<AcurastQuote> {
  const r = await fetcher("https://api.coingecko.com/api/v3/simple/price?ids=acurast&vs_currencies=usd&include_last_updated_at=true", {signal: AbortSignal.timeout(6000), redirect: "manual"});
  if (!r.ok) throw new Error("quote-unavailable");
  const body = await r.json() as { acurast?: {usd?: number; last_updated_at?: number} };
  const quote = {usd: body.acurast?.usd ?? NaN, quotedAt: (body.acurast?.last_updated_at ?? NaN) * 1000, source: "CoinGecko · Acurast"};
  if (acurastUsd(1, quote) === null) throw new Error("quote-unavailable");
  return quote;
}
export async function acurastPrice() {
  const r = await cache.read("acu-usd", () => readAcurastPrice(), {ttl: 60000});
  return r.data && acurastUsd(1, r.data) !== null ? r.data : undefined;
}
