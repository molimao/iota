export function countryDistribution(
  countries: Array<{ country: string; count: number }>,
  listed: number | null,
) {
  const rows = countries
    .filter((row) => Number.isFinite(row.count) && row.count > 0)
    .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
  const located = rows.reduce((sum, row) => sum + row.count, 0);
  const total = listed !== null && Number.isFinite(listed) ? Math.max(located, listed) : located;
  return {
    rows,
    located,
    total,
    unknown: total - located,
    other: rows.slice(6).reduce((sum, row) => sum + row.count, 0),
  };
}
const COUNTRY_ALIASES: Record<string, string> = {
  hk: "Hong Kong",
  hkg: "Hong Kong",
  "hong kong": "Hong Kong",
  turkey: "Turkey",
  türkiye: "Turkey",
  turkiye: "Turkey",
  tr: "Turkey",
  netherlands: "Netherlands",
  "the netherlands": "Netherlands",
  nl: "Netherlands",
  us: "United States",
  usa: "United States",
  "united states": "United States",
  "united states of america": "United States",
  uk: "United Kingdom",
  gb: "United Kingdom",
  gbr: "United Kingdom",
  "united kingdom": "United Kingdom",
  cn: "China",
  chn: "China",
  china: "China",
  tw: "Taiwan",
  taiwan: "Taiwan",
  jp: "Japan",
  japan: "Japan",
  ca: "Canada",
  canada: "Canada",
  de: "Germany",
  germany: "Germany",
  fr: "France",
  france: "France",
  sg: "Singapore",
  singapore: "Singapore",
  kr: "South Korea",
  "south korea": "South Korea",
  "republic of korea": "South Korea",
};

export function normalizeCountry(country: string | null | undefined): string {
  const value = country?.trim() ?? "";
  return COUNTRY_ALIASES[value.toLowerCase()] ?? value;
}
