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
