import { afterEach, describe, expect, it, vi } from "vitest";
import { readTaostatsSn9Page } from "./iota-price-taostats";

const now = Date.parse("2026-10-01T12:00:00Z");
function page({
  netuid = 9,
  name = "iota",
  symbol = "TAO",
  at = now - 120_000,
  taoAt = at,
  tao = "300",
}: {
  netuid?: number;
  name?: string;
  symbol?: string;
  at?: number;
  taoAt?: number;
  tao?: string;
} = {}) {
  const node = {
    dtaoSubnet: { netuid, name, price: "0.025", timestamp: new Date(at).toISOString() },
    queries: [
      {
        queryKey: ["price"],
        state: {
          data: {
            data: [
              {
                symbol,
                slug: "bittensor",
                price: tao,
                last_updated: new Date(taoAt).toISOString(),
              },
            ],
          },
        },
      },
    ],
  };
  return `<script>self.__next_f.push(${JSON.stringify([1, `a:${JSON.stringify(node)}\n`])})</script>`;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.resetModules();
});

describe("verified SN9 USD fallback", () => {
  it("converts the precise SN9 pool quote using TAO/USD and preserves source time", () => {
    expect(readTaostatsSn9Page(page(), now)).toEqual({
      usdPerIota: 7.5,
      source: "taostats-sn9",
      quotedAt: now - 120_000,
    });
  });
  it("requires both the SN9 identity and the TAO asset", () => {
    expect(readTaostatsSn9Page(page({ netuid: 19 }), now)).toBeNull();
    expect(readTaostatsSn9Page(page({ name: "another" }), now)).toBeNull();
    expect(readTaostatsSn9Page(page({ symbol: "IOTA" }), now)).toBeNull();
  });
  it("keeps the older TAO quote time even when the page and subnet price just refreshed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL | Request) =>
        String(url).includes("taostats.io")
          ? new Response(page({ at: now - 60_000, taoAt: now - 600_000 }))
          : new Response("rate limited", { status: 429 }),
      ),
    );
    const { fetchIotaUsdPrice } = await import("./iota-price.server");
    expect(await fetchIotaUsdPrice()).toMatchObject({
      usdPerIota: 7.5,
      fetchedAt: now,
      quotedAt: now - 600_000,
      error: null,
      stale: false,
    });
  });
  it("rejects old, future, zero and missing quotes", () => {
    expect(readTaostatsSn9Page(page({ at: now - 3_600_001 }), now)).toBeNull();
    expect(readTaostatsSn9Page(page({ at: now + 120_000 }), now)).toBeNull();
    expect(readTaostatsSn9Page(page({ tao: "0" }), now)).toBeNull();
    expect(readTaostatsSn9Page("<title>$7.50 SN9</title>", now)).toBeNull();
    expect(readTaostatsSn9Page("<script>self.__next_f.push(broken)</script>", now)).toBeNull();
  });
  it("handles a flight record split across script chunks", () => {
    const record = `a:${JSON.stringify({ dtaoSubnet: { netuid: 9, name: "iota", price: "0.025", timestamp: new Date(now).toISOString() }, queries: [{ queryKey: ["price"], state: { data: { data: [{ symbol: "TAO", slug: "bittensor", price: "300", last_updated: new Date(now).toISOString() }] } } }] })}\n`;
    const html = [record.slice(0, 50), record.slice(50)]
      .map((chunk) => `<script>self.__next_f.push(${JSON.stringify([1, chunk])})</script>`)
      .join("");
    expect(readTaostatsSn9Page(html, now)?.usdPerIota).toBe(7.5);
  });
  it("recovers when CoinGecko fails, caches the result and retains it through an outage", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    vi.resetModules();
    const fetch = vi.fn(async (url: string | URL | Request) =>
      String(url).includes("taostats.io")
        ? new Response(page(), { status: 200 })
        : new Response("rate limited", { status: 429 }),
    );
    vi.stubGlobal("fetch", fetch);
    const { fetchIotaUsdPrice } = await import("./iota-price.server");
    expect(await fetchIotaUsdPrice()).toMatchObject({
      usdPerIota: 7.5,
      source: "taostats-sn9",
      stale: false,
    });
    const requests = fetch.mock.calls.length;
    expect((await fetchIotaUsdPrice()).usdPerIota).toBe(7.5);
    expect(fetch.mock.calls).toHaveLength(requests);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    expect(await fetchIotaUsdPrice(true)).toMatchObject({
      usdPerIota: 7.5,
      source: "taostats-sn9",
      quotedAt: now - 120_000,
      stale: true,
    });
    vi.setSystemTime(now + 7 * 3_600_000);
    expect(await fetchIotaUsdPrice(true)).toMatchObject({ usdPerIota: null, stale: false });
  });
});
