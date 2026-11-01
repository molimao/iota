import type { PoolAccount } from "./pool-monitor";
/** Parsers expose non-overlapping amounts: generic pool balance includes maturity;
 * BNT, CSD and Pearl LuckyPool expose immature/queued amounts separately. */
export function poolCumulativeEarnings(account: PoolAccount): number | null {
  const parts = [account.paid, account.balance];
  if (account.pendingEstimate !== undefined) parts.push(account.pendingEstimate);
  if (account.queued !== undefined) parts.push(account.queued);
  return parts.some((p) => p === null) ? null : parts.reduce<number>((sum, p) => sum + p!, 0);
}
