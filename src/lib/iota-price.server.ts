/**
 * Allowlisted market price for the Train at Home subnet token (SN9).
 * This is not IOTA Layer 1 and not an official settlement rate.
 */
import { fetchSn9UsdFromMarkets } from "./iota-price-sources";

const TTL_MS = 2 * 60 * 1000;
const KEEP_MS = 6 * 60 * 60 * 1000;

export type IotaUsdQuote = {
  usdPerIota: number | null;
  fetchedAt: number | null;
  error: string | null;
  stale: boolean;
  source?: string;
};

type Cache = {
  usdPerIota: number | null;
  fetchedAt: number;
  error: string | null;
  source?: string;
};

let cache: Cache | null = null;
let inflight: Promise<Cache> | null = null;

export async function fetchIotaUsdPrice(force = false): Promise<IotaUsdQuote> {
  const now = Date.now();
  if (cache?.usdPerIota && !cache.error && !force && now - cache.fetchedAt < TTL_MS) {
    return { ...cache, stale: false };
  }

  if (!inflight) {
    inflight = fetchSn9UsdFromMarkets()
      .then((next) => {
        cache = {
          usdPerIota: next.usdPerIota,
          fetchedAt: Date.now(),
          error: null,
          source: next.source,
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
  };
}
