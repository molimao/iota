/** Actual ACU transfers recorded in AcurastCompute.ManagerMetricRewards, 12 decimals.
 * Manager aggregate, never individual-device income or wallet balance. Separate
 * commitment/delegation withdrawals and migration tokens are outside this counter.
 */
export type AcurastRewards = {
  managers: { id: string; today: string | null; yesterday: string | null; cumulative: string }[];
  dayStart: number;
  observedAt: number;
  blockHash: string;
};

export type AcurastBalance = {
  address: string;
  total: string;
  free: string;
  reserved: string;
  frozen: string;
};

export type AcurastQuote = { usd: number; quotedAt: number; source: string };
/** Fail closed on stale or invalid prices, never turn unavailable prices into zero. */
export function acurastUsd(amount: string | number | null, quote?: AcurastQuote, now = Date.now()) {
  if (amount === null || !quote || !Number.isFinite(quote.usd) || quote.usd <= 0 || !Number.isFinite(quote.quotedAt) || quote.quotedAt > now + 60000 || now - quote.quotedAt > 900000) return null;
  const value = Number(amount);
  return Number.isFinite(value) && value >= 0 ? value * quote.usd : null;
}
