import { plausibleSn9Usd } from "./iota-price-sources";

export type Sn9MarketQuote = { usdPerIota: number; source: string; quotedAt?: number };
const MAX_QUOTE_AGE_MS = 60 * 60 * 1000;

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function number(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function timestamp(value: unknown, now: number): number | null {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && parsed <= now + 60_000 && now - parsed <= MAX_QUOTE_AGE_MS
    ? parsed
    : null;
}

/** Parse public JSON hydration data, never execute scripts or use rounded page titles. */
export function readTaostatsSn9Page(html: string, now = Date.now()): Sn9MarketQuote | null {
  const chunks: string[] = [];
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    const push = match[1]?.match(/self\.__next_f\.push\((\[[\s\S]*\])\)\s*;?\s*$/);
    if (!push?.[1]) continue;
    try {
      const chunk: unknown = JSON.parse(push[1]);
      if (Array.isArray(chunk) && typeof chunk[1] === "string") chunks.push(chunk[1]);
    } catch {
      /* A malformed chunk is not market data. */
    }
  }

  let pool: { price: number; at: number } | null = null;
  let tao: { price: number; at: number } | null = null;
  const readPool = (value: unknown) => {
    const row = object(value);
    if (!row || row["netuid"] !== 9 || row["name"] !== "iota") return;
    const price = number(row["price"]);
    const at = timestamp(row["timestamp"], now);
    if (price !== null && price < 1 && at !== null && (!pool || at > pool.at)) pool = { price, at };
  };
  for (const line of chunks.join("").split("\n")) {
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    let root: unknown;
    try {
      root = JSON.parse(line.slice(colon + 1));
    } catch {
      continue;
    }
    const stack: unknown[] = [root];
    while (stack.length) {
      const value = stack.pop();
      if (Array.isArray(value)) {
        stack.push(...value);
        continue;
      }
      const row = object(value);
      if (!row) continue;
      readPool(row["dtaoSubnet"]);
      const key = row["queryKey"];
      const state = object(row["state"]);
      const data = object(state?.["data"]);
      if (Array.isArray(key) && key[0] === "dtaoSubnetPools" && Array.isArray(data?.["data"])) {
        data["data"].forEach(readPool);
      }
      if (Array.isArray(key) && key[0] === "price" && Array.isArray(data?.["data"])) {
        for (const item of data["data"]) {
          const asset = object(item);
          if (!asset || asset["symbol"] !== "TAO" || asset["slug"] !== "bittensor") continue;
          const price = number(asset["price"]);
          const at = timestamp(asset["last_updated"], now);
          if (price !== null && price < 100_000 && at !== null && (!tao || at > tao.at))
            tao = { price, at };
        }
      }
      stack.push(...Object.values(row));
    }
  }
  // These are assigned while walking the parsed hydration tree.
  const sn9 = pool as { price: number; at: number } | null;
  const usd = tao as { price: number; at: number } | null;
  if (!sn9 || !usd) return null;
  const usdPerIota = sn9.price * usd.price;
  return plausibleSn9Usd(usdPerIota)
    ? { usdPerIota, source: "taostats-sn9", quotedAt: Math.min(sn9.at, usd.at) }
    : null;
}
