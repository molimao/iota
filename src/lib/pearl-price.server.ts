/** LuckyPool publishes the PEARL/USDT market it uses for pool estimates.
 * Convert USDT using the live Kraken USD book; never use a wallet balance. */
export function pearlPoolUsdt(body: unknown): number | null {
  const root = body as { config?: { coin?: unknown; symbol?: unknown; coinUnits?: unknown };
    markets?: { exchanges?: unknown } } | null;
  if (root?.config?.coin !== "Pearl" || root.config.symbol !== "PRL" || root.config.coinUnits !== 100000000)
    return null;
  if (!Array.isArray(root.markets?.exchanges)) return null;
  for (const row of root.markets.exchanges) {
    if (!row || typeof row !== "object") continue;
    if (row.name !== "SafeTrade" || row.base !== "PEARL" || row.quote !== "USDT" ||
      row.link !== "https://safetrade.com/exchange/PEARL-USDT") continue;
    if (typeof row.priceUSDT === "number" && Number.isFinite(row.priceUSDT) && row.priceUSDT > 0 &&
      typeof row.baseVolume === "number" && Number.isFinite(row.baseVolume) && row.baseVolume > 0 &&
      typeof row.quoteVolume === "number" && Number.isFinite(row.quoteVolume) && row.quoteVolume > 0)
      return row.priceUSDT;
  }
  return null;
}
function freshResponse(response: Response, now: number): boolean {
  const at = Date.parse(response.headers.get("date") ?? "");
  const age = Number(response.headers.get("age") ?? 0);
  return response.ok && Number.isFinite(at) && at <= now + 60000 && now - at <= 300000 &&
    Number.isFinite(age) && age >= 0 && age <= 300;
}
export async function readPearlPoolUsd(fetcher: typeof fetch = fetch): Promise<number | null> {
  try {
    const [pool, fx] = await Promise.all([
      fetcher("https://pearl.luckypool.io/api/stats?v=2", {
        headers: { accept: "application/json" }, signal: AbortSignal.timeout(6000), redirect: "manual",
      }),
      fetcher("https://api.kraken.com/0/public/Ticker?pair=USDTUSD", {
        headers: { accept: "application/json" }, signal: AbortSignal.timeout(6000), redirect: "manual",
      }),
    ]);
    if (!freshResponse(pool, Date.now()) || !freshResponse(fx, Date.now())) return null;
    const usdt = pearlPoolUsdt(await pool.json());
    const book = await fx.json() as { error?: unknown[]; result?: { USDTZUSD?: { a?: string[]; b?: string[] } } };
    const ask = Number(book.result?.USDTZUSD?.a?.[0]), bid = Number(book.result?.USDTZUSD?.b?.[0]);
    if (usdt == null || !Array.isArray(book.error) || book.error.length || !Number.isFinite(ask) ||
      !Number.isFinite(bid) || bid <= 0 || ask < bid || ask / bid > 1.01) return null;
    const usd = usdt * (ask + bid) / 2;
    return Number.isFinite(usd) && usd > 0 ? usd : null;
  } catch {
    return null;
  }
}
