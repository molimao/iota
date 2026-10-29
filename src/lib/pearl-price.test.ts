import { expect, it, vi } from "vitest";
import { pearlPoolUsdt, readPearlPoolUsd } from "./pearl-price.server";
const pool = () => ({ config: { coin: "Pearl", symbol: "PRL", coinUnits: 100000000 }, markets: { exchanges: [{
  name: "SafeTrade", base: "PEARL", quote: "USDT", link: "https://safetrade.com/exchange/PEARL-USDT",
  priceUSDT: 1.75, baseVolume: 1000, quoteVolume: 1750,
}] } });
const response = (body: unknown, date = new Date().toUTCString(), age = "0") => Response.json(body, { headers: { date, age } });
const book = { error: [], result: { USDTZUSD: { a: ["0.999"], b: ["0.998"] } } };
it("uses the pool's exact Pearl market and converts USDT to USD", async () => {
  const fetcher = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    expect(init?.redirect).toBe("manual");
    return response(String(url).includes("kraken") ? book : pool());
  });
  expect(await readPearlPoolUsd(fetcher as typeof fetch)).toBeCloseTo(1.747375, 10);
});
it("rejects another coin, zero-volume markets and wrong trading pairs", () => {
  const wrong = pool(); wrong.config.coin = "Perle";
  expect(pearlPoolUsdt(wrong)).toBeNull();
  const empty = pool(); empty.markets.exchanges[0]!.quoteVolume = 0;
  expect(pearlPoolUsdt(empty)).toBeNull();
  const pair = pool(); pair.markets.exchanges[0]!.base = "PRL";
  expect(pearlPoolUsdt(pair)).toBeNull();
});
it("rejects old HTTP snapshots, redirects, missing dates and invalid FX books", async () => {
  for (const invalid of [
    response(pool(), "2020-01-01"), response(pool(), new Date().toUTCString(), "3600"),
    Response.json(pool()), new Response(null, { status: 302 }),
  ]) expect(await readPearlPoolUsd((async url => String(url).includes("kraken") ? response(book) : invalid) as typeof fetch)).toBeNull();
  for (const invalid of [
    { error: ["unavailable"], result: book.result },
    { error: [], result: { USDTZUSD: { a: ["0.9"], b: ["1"] } } },
    { error: [], result: { USDTZUSD: { a: ["1.2"], b: ["1"] } } },
  ]) expect(await readPearlPoolUsd((async url => response(String(url).includes("kraken") ? invalid : pool())) as typeof fetch)).toBeNull();
});
