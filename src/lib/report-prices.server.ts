import type { ProjectId } from "./projects";
import { BNT_REFERENCE_USD } from "./reference-prices";
/** Ids checked against CoinGecko simple/price. Missing or stale quotes stay unpriced.
 * Blocknet BNT is not listed here: this site uses a fixed reference, not Bancor or BLOCK.
 * XID has no market. Pearl's CoinGecko "perle" is a different token. */
const COINGECKO_IDS: Partial<Record<ProjectId, string>> = {
  btc: "bitcoin",
  xmr: "monero",
  etc: "ethereum-classic",
  rvn: "ravencoin",
  zec: "zcash",
  kas: "kaspa",
  erg: "ergo",
  zeph: "zephyr-protocol",
  ethw: "ethereum-pow-iou",
  golem: "golem",
  nosana: "nosana",
  akash: "akash-network",
  ionet: "io",
  acurast: "acurast",
  quantus: "quantus",
  tsc: "tensorcash",
  noid: "parano1d",
};
/** CoinPaprika ids checked against each project's own site. */
const PAPRIKA_IDS: Partial<Record<ProjectId, string>> = {
  btc: "btc-bitcoin",
  xmr: "xmr-monero",
  etc: "etc-ethereum-classic",
  rvn: "rvn-ravencoin",
  zec: "zec-zcash",
  kas: "kas-kaspa",
  ethw: "ethw-ethereum-pow",
  golem: "glm-golem",
  nosana: "nos-nosana",
  akash: "akt-akash-network",
  prl: "prl-pearl-1",
  mds: "mds-midstate",
  csd: "csd-compute-substrate",
  quantus: "qtc-quantus",
  tsc: "tsc-tensorcash",
  noid: "noid-parano1d",
};
const QUOTE_HEADERS = {
  accept: "application/json",
  "user-agent": "IOTA-Watch/1.0 (+https://iotahome.site)",
};
const MAX_AGE_MS = 6 * 3600000;
export function parseMarketPrices(
  body: unknown,
  now = Date.now(),
): Partial<Record<ProjectId, number>> {
  const root = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const prices: Partial<Record<ProjectId, number>> = {};
  for (const [project, id] of Object.entries(COINGECKO_IDS) as [ProjectId, string][]) {
    const row = root[id];
    if (!row || typeof row !== "object") continue;
    const usd = (row as { usd?: unknown }).usd;
    const at = (row as { last_updated_at?: unknown }).last_updated_at;
    if (typeof usd !== "number" || !Number.isFinite(usd) || usd <= 0) continue;
    if (typeof at !== "number" || !Number.isFinite(at)) continue;
    const quotedAt = at * 1000;
    if (quotedAt > now + 60000 || now - quotedAt > MAX_AGE_MS) continue;
    prices[project] = usd;
  }
  return prices;
}
/** A zero-volume or old ticker is not a usable quote. */
export function parsePaprikaTicker(body: unknown, now = Date.now()): number | null {
  if (!body || typeof body !== "object") return null;
  const row = body as {
    last_updated?: unknown;
    quotes?: { USD?: { price?: unknown; volume_24h?: unknown } };
  };
  const quote = row.quotes?.USD;
  const price = quote?.price;
  const volume = quote?.volume_24h;
  const quotedAt = typeof row.last_updated === "string" ? Date.parse(row.last_updated) : NaN;
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) return null;
  if (typeof volume !== "number" || !Number.isFinite(volume) || volume <= 0) return null;
  if (!Number.isFinite(quotedAt) || quotedAt > now + 60000 || now - quotedAt > MAX_AGE_MS)
    return null;
  return price;
}
/** Separate official route used only when the ticker endpoint is unavailable. */
export function parsePaprikaConversion(body: unknown, id: string, now = Date.now()): number | null {
  if (!body || typeof body !== "object") return null;
  const row = body as Record<string, unknown>;
  if (row["base_currency_id"] !== id || row["quote_currency_id"] !== "usd-us-dollars" || row["amount"] !== 1)
    return null;
  if (typeof row["price"] !== "number" || !Number.isFinite(row["price"]) || row["price"] <= 0) return null;
  for (const key of ["base_price_last_updated", "quote_price_last_updated"]) {
    const at = typeof row[key] === "string" ? Date.parse(row[key]) : NaN;
    if (!Number.isFinite(at) || at > now + 60000 || now - at > MAX_AGE_MS) return null;
  }
  return row["price"];
}
async function paprikaPrices(
  projects: readonly ProjectId[],
  fetcher: typeof fetch,
): Promise<Partial<Record<ProjectId, number>>> {
  const wanted = projects.filter((project) => PAPRIKA_IDS[project]);
  const found: Partial<Record<ProjectId, number>> = {};
  await Promise.all(
    wanted.map(async (project) => {
      try {
        const url = `https://api.coinpaprika.com/v1/tickers/${PAPRIKA_IDS[project]}`;
        let response = await fetcher(url + "?quotes=USD", {
          headers: QUOTE_HEADERS, signal: AbortSignal.timeout(6000), redirect: "manual",
        });
        // The default USD endpoint has a separate public cache route. Do not
        // retry rate limits or follow redirects to an unreviewed destination.
        if (response.status === 403) response = await fetcher(url, {
          headers: QUOTE_HEADERS, signal: AbortSignal.timeout(6000), redirect: "manual",
        });
        if (!response.ok) {
          // Respect rate limits and redirects. The converter has its own route
          // and explicitly identifies both currencies and their quote times.
          if (response.status === 429 || (response.status >= 300 && response.status < 400)) return;
          const conversion = await fetcher(
            `https://api.coinpaprika.com/v1/price-converter?base_currency_id=${PAPRIKA_IDS[project]}&quote_currency_id=usd-us-dollars&amount=1`,
            { headers: QUOTE_HEADERS, signal: AbortSignal.timeout(6000), redirect: "manual" },
          );
          if (conversion.ok) {
            const price = parsePaprikaConversion(await conversion.json(), PAPRIKA_IDS[project]!);
            if (price !== null) found[project] = price;
          }
          return;
        }
        const price = parsePaprikaTicker(await response.json());
        if (price !== null) found[project] = price;
      } catch {
        /* This coin stays unpriced. */
      }
    }),
  );
  return found;
}
export async function fetchReportUsdPrices(
  projects: readonly ProjectId[],
  fetcher: typeof fetch = fetch,
): Promise<Partial<Record<ProjectId, number>>> {
  const ids = [
    ...new Set(
      projects.flatMap((project) => {
        const id = COINGECKO_IDS[project];
        return id ? [id] : [];
      }),
    ),
  ];
  let prices: Partial<Record<ProjectId, number>> = {};
  if (ids.length) {
    try {
      const response = await fetcher(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd&include_last_updated_at=true`,
        { headers: QUOTE_HEADERS, signal: AbortSignal.timeout(6000), redirect: "manual" },
      );
      if (response.ok) prices = parseMarketPrices(await response.json());
    } catch {
      prices = {};
    }
  }
  if (projects.includes("acurast") && prices.acurast == null) {
    try {
      const { readAcurastPrice } = await import("./acurast-price.server");
      const quote = await readAcurastPrice(fetcher);
      if (Number.isFinite(quote.usd) && quote.usd > 0) prices = { ...prices, acurast: quote.usd };
    } catch {
      /* A missing ACU quote leaves the native amount visible. */
    }
  }
  const missing = projects.filter((project) => prices[project] == null && PAPRIKA_IDS[project]);
  if (missing.length) {
    const extra = await paprikaPrices(missing, fetcher);
    prices = { ...prices, ...extra };
  }
  if (projects.includes("prl") && prices.prl == null) {
    const { readPearlPoolUsd } = await import("./pearl-price.server");
    const price = await readPearlPoolUsd(fetcher);
    if (price !== null) prices.prl = price;
  }
  // After every online assignment, including the CoinGecko failure path that replaces `prices`.
  return projects.includes("bnt") ? { ...prices, bnt: BNT_REFERENCE_USD } : prices;
}
