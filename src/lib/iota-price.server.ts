/**
 * Allowlisted market price for the Train at Home subnet token (SN9 / CoinGecko iota-2).
 * This is not IOTA Layer 1 and not an official settlement rate.
 */
const PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=iota-2&vs_currencies=usd";
const TTL_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 12_000;

export type IotaUsdQuote = {
  usdPerIota: number | null;
  fetchedAt: number | null;
  error: string | null;
  stale: boolean;
};

type Cache = {
  usdPerIota: number | null;
  fetchedAt: number;
  error: string | null;
};

let cache: Cache | null = null;
let inflight: Promise<Cache> | null = null;

function readUsd(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const coin = (payload as { "iota-2"?: { usd?: unknown } })["iota-2"];
  const usd = coin?.usd;
  return typeof usd === "number" && Number.isFinite(usd) && usd > 0 ? usd : null;
}

async function loadQuote(): Promise<Cache> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(PRICE_URL, {
      method: "GET",
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`价格接口 HTTP ${response.status}`);
    const usdPerIota = readUsd(JSON.parse(text) as unknown);
    if (usdPerIota === null) throw new Error("价格接口没有返回有效的 IOTA/USD");
    return { usdPerIota, fetchedAt: Date.now(), error: null };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchIotaUsdPrice(force = false): Promise<IotaUsdQuote> {
  const now = Date.now();
  if (cache && !force && now - cache.fetchedAt < TTL_MS && cache.usdPerIota !== null) {
    return { ...cache, stale: false };
  }

  if (!inflight) {
    inflight = loadQuote()
      .then((next) => {
        cache = next;
        return next;
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "市场价格暂不可用";
        if (cache?.usdPerIota) {
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
  };
}
