import { expect, it } from "vitest";
import { parseMarketPrices, parsePaprikaTicker } from "./report-prices.server";

const now = Date.parse("2026-10-28T01:40:00Z");
it("keeps fresh market quotes and drops stale, zero, or unknown prices", () => {
  const prices = parseMarketPrices(
    {
      kaspa: { usd: 0.03, last_updated_at: now / 1000 - 60 },
      bitcoin: { usd: 0, last_updated_at: now / 1000 },
      blocknet: { usd: 0.01, last_updated_at: now / 1000 - 8 * 3600 },
      "not-a-coin": { usd: 5, last_updated_at: now / 1000 },
    },
    now,
  );
  expect(prices).toEqual({ kas: 0.03 });
  expect(
    parseMarketPrices({ perle: { usd: 0.1, last_updated_at: now / 1000 } }, now).prl,
  ).toBeUndefined();
});

const fresh = "2026-10-28T01:58:17Z";
const quoted = Date.parse(fresh) + 60_000;
it("accepts a fresh traded CoinPaprika quote and rejects a dead or old ticker", () => {
  expect(
    parsePaprikaTicker(
      { last_updated: fresh, quotes: { USD: { price: 1.68, volume_24h: 35 } } },
      quoted,
    ),
  ).toBe(1.68);
  expect(
    parsePaprikaTicker(
      { last_updated: fresh, quotes: { USD: { price: 8.9e-10, volume_24h: 2895 } } },
      quoted,
    ),
  ).toBe(8.9e-10);
  expect(
    parsePaprikaTicker(
      { last_updated: fresh, quotes: { USD: { price: 1.68, volume_24h: 0 } } },
      quoted,
    ),
  ).toBeNull();
  expect(
    parsePaprikaTicker(
      { last_updated: "2026-05-01T00:00:00Z", quotes: { USD: { price: 1, volume_24h: 10 } } },
      quoted,
    ),
  ).toBeNull();
});

import { fetchReportUsdPrices } from "./report-prices.server";
import { vi } from "vitest";
const ticker = (price: number) => ({
  last_updated: new Date().toISOString(),
  quotes: { USD: { price, volume_24h: 100 } },
});
it("uses the official default USD route when the query route rejects PRL, with identifiable requests", async () => {
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    expect(new Headers(init?.headers).get("user-agent")).toContain("IOTA-Watch");
    expect(init?.redirect).toBe("manual");
    return String(input).includes("?quotes=")
      ? new Response(null, { status: 403 })
      : Response.json(ticker(1.8));
  });
  expect(await fetchReportUsdPrices(["prl"], fetcher as typeof fetch)).toEqual({ prl: 1.8 });
  expect(fetcher).toHaveBeenCalledTimes(2);
});
it("keeps other coins priced when one quote fails, and does not retry a rate limit", async () => {
  const fetcher = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("coingecko")) return new Response(null, { status: 429 });
    if (url.includes("btc-bitcoin")) return Response.json(ticker(80000));
    return new Response(null, { status: 429 });
  });
  expect(await fetchReportUsdPrices(["btc", "prl"], fetcher as typeof fetch)).toEqual({ btc: 80000 });
  expect(fetcher).toHaveBeenCalledTimes(3);
});
it("includes Akash and Nosana and never substitutes a different PRL or BNT token", async () => {
  const fetcher = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    expect(url).not.toMatch(/bancor|blocknet|perle/);
    return Response.json({
      nosana: { usd: 0.4, last_updated_at: Date.now() / 1000 },
      "akash-network": { usd: 0.65, last_updated_at: Date.now() / 1000 },
    });
  });
  expect(await fetchReportUsdPrices(["akash", "nosana", "bnt", "flyai", "xid"], fetcher as typeof fetch))
    .toEqual({ akash: 0.65, nosana: 0.4 });
  expect(fetcher).toHaveBeenCalledTimes(1);
});
