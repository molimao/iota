/**
 * Allowlisted market price for the Train at Home subnet token (SN9).
 * This is not IOTA Layer 1 and not an official settlement rate.
 */
import { fetchSn9UsdFromMarkets } from "./iota-price-sources";
import { fetchSn9UsdFromTaostats } from "./iota-price-taostats.server";
import type { Sn9MarketQuote } from "./iota-price-taostats";

const TTL_MS = 2 * 60 * 1000;
const KEEP_MS = 6 * 60 * 60 * 1000;

export type IotaUsdQuote = {
  usdPerIota: number | null;
  fetchedAt: number | null;
  error: string | null;
  stale: boolean;
  source?: string;
  quotedAt?: number;
};

type Cache = {
  usdPerIota: number | null;
  fetchedAt: number;
  error: string | null;
  source?: string;
  quotedAt?: number;
};

let cache: Cache | null = null;
let inflight: Promise<Cache> | null = null;

export async function fetchIotaUsdPrice(force = false): Promise<IotaUsdQuote> {
  const now = Date.now();
  if (cache?.usdPerIota && !cache.error && !force && now - cache.fetchedAt < TTL_MS) {
    return { ...cache, stale: false };
  }

  if (!inflight) {
    inflight = Promise.any<Sn9MarketQuote>([fetchSn9UsdFromMarkets(), fetchSn9UsdFromTaostats()])
      .then((next) => {
        cache = {
          usdPerIota: next.usdPerIota,
          fetchedAt: Date.now(),
          error: null,
          source: next.source,
          ...(next.quotedAt !== undefined ? { quotedAt: next.quotedAt } : {}),
        };
        return cache;
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "市场价格暂不可用";
        if (cache?.usdPerIota && now - cache.fetchedAt < KEEP_MS) {
          cache = { ...cache, error: message };
          return cache;
        }
        cache = { usdPerIota: null, fetchedAt: cache?.fetchedAt ?? 0, error: message };
        return cache;
      })
      .finally(() => {
        inflight = null;
      });
  }

  const next = await inflight;
  return {
    usdPerIota: next.usdPerIota,
    fetchedAt: next.fetchedAt || null,
    error: next.error,
    stale: next.error !== null && next.usdPerIota !== null,
    ...(next.source ? { source: next.source } : {}),
    ...(next.quotedAt !== undefined ? { quotedAt: next.quotedAt } : {}),
  };
}
