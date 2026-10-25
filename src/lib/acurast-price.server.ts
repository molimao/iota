import { ReadCache } from "./read-cache";
import type { AcurastQuote } from "./acurast-rewards";
import { acurastUsd } from "./acurast-rewards";
const cache = new ReadCache(1);
export async function readAcurastPrice(fetcher: typeof fetch = fetch): Promise<AcurastQuote> {
  try {
    const r = await fetcher("https://api.coingecko.com/api/v3/simple/price?ids=acurast&vs_currencies=usd&include_last_updated_at=true", {signal: AbortSignal.timeout(6000), redirect: "manual"});
    if (!r.ok) throw new Error("quote-unavailable");
    const body = await r.json() as { acurast?: {usd?: number; last_updated_at?: number} };
    const quote = {usd: body.acurast?.usd ?? NaN, quotedAt: (body.acurast?.last_updated_at ?? NaN) * 1000, source: "CoinGecko · Acurast"};
    if (acurastUsd(1, quote) === null) throw new Error("quote-unavailable");
    return quote;
  } catch {
    // The live ACU/USD bid/ask book is independent of the aggregator.
    // Kraken's ticker has no source timestamp: use the request observation time.
    const observedAt = Date.now();
    const r = await fetcher("https://api.kraken.com/0/public/Ticker?pair=ACUUSD", {signal: AbortSignal.timeout(6000), redirect: "manual"});
    if (!r.ok) throw new Error("quote-unavailable");
    const body = await r.json() as {error?: unknown[]; result?: {ACUUSD?: {a?: string[]; b?: string[]}}};
    const ask = Number(body.result?.ACUUSD?.a?.[0]), bid = Number(body.result?.ACUUSD?.b?.[0]);
    if (!Array.isArray(body.error) || body.error.length || !Number.isFinite(ask) || !Number.isFinite(bid) || bid <= 0 || ask < bid || ask / bid > 1.1) throw new Error("quote-unavailable");
    const quote = {usd: (ask + bid) / 2, quotedAt: observedAt, source: "Kraken · ACU/USD mid-market"};
    if(acurastUsd(1,quote) === null) throw new Error("quote-unavailable");
    return quote;
  }
}
export async function acurastPrice() {
  const r = await cache.read("acu-usd", () => readAcurastPrice(), {ttl: 60000});
  return r.data && acurastUsd(1, r.data) !== null ? r.data : undefined;
}
