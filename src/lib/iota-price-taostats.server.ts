import { readTaostatsSn9Page, type Sn9MarketQuote } from "./iota-price-taostats";

/** Fixed public SN9 page; no credentials, user URLs or authenticated API requests. */
export async function fetchSn9UsdFromTaostats(): Promise<Sn9MarketQuote> {
  const response = await fetch("https://taostats.io/subnets/9", {
    headers: { accept: "text/html", "user-agent": "IOTA-Watch/1.0 (+https://iotahome.site)" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Taostats HTTP ${response.status}`);
  const html = await response.text();
  if (html.length > 5_000_000) throw new Error("Taostats response too large");
  const quote = readTaostatsSn9Page(html);
  if (!quote) throw new Error("Taostats: no recent verified SN9 and TAO/USD quote");
  return quote;
}
