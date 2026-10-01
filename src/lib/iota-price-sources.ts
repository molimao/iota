/** Public SN9 / iota-2 quotes. Never use CoinGecko id `iota` (Layer 1). */

const HEADERS = {
  accept: "application/json",
  "user-agent": "IOTA-Watch/1.0 (https://iotahome.site)",
};

const PER_SOURCE_MS = 6_000;

export function plausibleSn9Usd(value: number): boolean {
  return Number.isFinite(value) && value >= 0.2 && value <= 200;
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && plausibleSn9Usd(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (plausibleSn9Usd(parsed)) return parsed;
  }
  return null;
}

export function readCoinGeckoSimple(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  return readNumber((payload as { "iota-2"?: { usd?: unknown } })["iota-2"]?.usd);
}

export function readCoinGeckoCoin(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const usd = (payload as { market_data?: { current_price?: { usd?: unknown } } }).market_data
    ?.current_price?.usd;
  return readNumber(usd);
}

export function readDexScreener(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const pairs = (payload as { pairs?: unknown }).pairs;
  if (!Array.isArray(pairs)) return null;
  let best: { usd: number; liquidity: number } | null = null;
  for (const pair of pairs) {
    if (!pair || typeof pair !== "object") continue;
    const row = pair as {
      priceUsd?: unknown;
      chainId?: unknown;
      baseToken?: { symbol?: unknown; name?: unknown };
      liquidity?: { usd?: unknown };
    };
    const symbol = String(row.baseToken?.symbol ?? "").toUpperCase();
    const name = String(row.baseToken?.name ?? "").toLowerCase();
    const chain = String(row.chainId ?? "").toLowerCase();
    const sn9 =
      symbol === "SN9" ||
      ((symbol === "IOTA" || name.includes("iota")) &&
        (chain.includes("bittensor") || name.includes("subnet") || name.includes("macrocosmos")));
    if (!sn9) continue;
    const usd = readNumber(row.priceUsd);
    if (usd === null) continue;
    const liquidity = typeof row.liquidity?.usd === "number" ? row.liquidity.usd : 0;
    if (!best || liquidity > best.liquidity) best = { usd, liquidity };
  }
  return best?.usd ?? null;
}

export function readGeckoTerminal(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const data = (payload as { data?: unknown }).data;
  if (!Array.isArray(data)) return null;
  for (const pool of data) {
    const usd = readNumber(
      (pool as { attributes?: { base_token_price_usd?: unknown } })?.attributes
        ?.base_token_price_usd,
    );
    const name = String(
      (pool as { attributes?: { name?: unknown } })?.attributes?.name ?? "",
    ).toUpperCase();
    if (usd !== null && (name.includes("SN9") || name.includes("IOTA"))) return usd;
  }
  return null;
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PER_SOURCE_MS);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: HEADERS,
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return JSON.parse(text) as unknown;
  } finally {
    clearTimeout(timer);
  }
}

const SOURCES: Array<{ name: string; url: string; read: (payload: unknown) => number | null }> = [
  {
    name: "coingecko-simple",
    url: "https://api.coingecko.com/api/v3/simple/price?ids=iota-2&vs_currencies=usd",
    read: readCoinGeckoSimple,
  },
  {
    name: "coingecko-coin",
    url: "https://api.coingecko.com/api/v3/coins/iota-2?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
    read: readCoinGeckoCoin,
  },
];

export async function fetchSn9UsdFromMarkets(): Promise<{ usdPerIota: number; source: string }> {
  try {
    return await Promise.any(
      SOURCES.map(async (source) => {
        const usd = source.read(await fetchJson(source.url));
        if (usd === null) throw new Error(`${source.name}: 无有效 SN9 报价`);
        return { usdPerIota: usd, source: source.name };
      }),
    );
  } catch {
    throw new Error("市场价格暂不可用");
  }
}
