import { iotaWindowUnits, reportDayWindow } from "./daily-report";
import { hongKongDayStartSeconds, sumTodayUnits, toUnits } from "./earnings";
import type { DeviceEarnings, EntitlementHistory, EntitlementTotals } from "./iota-types";
import type { UpstreamResult } from "./iota-upstream.server";

export const EARNINGS_FRESH_MS = 15 * 60_000;

/** Full official record timestamps, never a renamed calendar-day total. */
export function iotaRolling24hUnits(history: EntitlementHistory | null, now: number): number | null {
  if (!history || !Array.isArray(history.timestamps) || !Array.isArray(history.alpha_amounts) ||
    !Array.isArray(history.statuses) || !Number.isFinite(now)) return null;
  const cutoff = now - 86400000;
  // The public history endpoint is capped at 30 rows. An entirely newer page
  // cannot prove coverage of the full rolling window.
  if (history.timestamps.length >= 30 && !history.timestamps.some((at) => at * 1000 <= cutoff)) return null;
  const units = iotaWindowUnits(history, { day: "rolling24h", start: cutoff + 1, end: now + 1, due: now });
  return units !== null && Number.isSafeInteger(Number(units)) ? Number(units) : null;
}

export function buildDeviceEarnings(
  hotkey: string,
  totals: UpstreamResult<EntitlementTotals>,
  history: UpstreamResult<EntitlementHistory>,
  now: number,
): DeviceEarnings {
  const data = totals.data;
  const today = sumTodayUnits(history.data, now);
  const dayStart = hongKongDayStartSeconds(now);
  const yesterdayDay = new Date((dayStart - 86400 + 28800) * 1000).toISOString().slice(0, 10);
  const window = reportDayWindow(yesterdayDay);
  const covered =
    history.data &&
    !(
      history.data.timestamps.length >= 30 &&
      !history.data.timestamps.some((t) => t * 1000 < window.start)
    );
  const yesterday = covered ? iotaWindowUnits(history.data, window) : null;
  const yesterdayUnits =
    yesterday !== null && Number.isSafeInteger(Number(yesterday)) ? Number(yesterday) : null;
  const recent =
    history.data?.alpha_amounts
      .map((amount, index) => ({
        timestamp: history.data!.timestamps[index]!,
        units: toUnits(amount)!,
        status: history.data!.statuses[index]!.toLowerCase(),
      }))
      .filter((row) => row.units !== null && row.timestamp <= now / 1000)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100) ?? [];
  const clocks = [totals.fetchedAt, history.fetchedAt].filter(
    (clock): clock is number => clock !== null,
  );
  return {
    hotkey,
    totalEarnedUnits: data ? toUnits(data.total_amount_earned) : null,
    todayUnits: today.units,
    yesterdayUnits,
    rolling24hUnits: history.error || history.stale ? null : iotaRolling24hUnits(history.data, now),
    paidUnits: data ? toUnits(data.total_amount_paid) : null,
    pendingUnits: data ? toUnits(data.total_amount_pending) : null,
    frozenUnits: data ? toUnits(data.total_amount_frozen) : null,
    minimumPayoutUnits: data ? toUnits(data.minimum_payout_amount) : null,
    historyCount: history.data?.alpha_amounts.length ?? 0,
    recent,
    totalsFetchedAt: totals.fetchedAt,
    historyFetchedAt: history.fetchedAt,
    totalsError: totals.error,
    historyError: history.error,
    accountingDay: hongKongDayStartSeconds(now),
    fetchedAt: clocks.length ? Math.min(...clocks) : null,
    error: [totals.error, history.error].filter(Boolean).join("；") || null,
  };
}

/** A totals failure must not erase good history, and vice versa. */
export function mergeEarnings(
  next: DeviceEarnings[],
  previous: DeviceEarnings[] = [],
): DeviceEarnings[] {
  const before = new Map(previous.map((item) => [item.hotkey, item]));
  return next.map((item) => {
    const old = before.get(item.hotkey);
    if (!old) return item;
    return {
      ...item,
      ...(item.totalEarnedUnits === null && item.totalsError
        ? {
            totalEarnedUnits: old.totalEarnedUnits,
            paidUnits: old.paidUnits ?? null,
            pendingUnits: old.pendingUnits,
            frozenUnits: old.frozenUnits,
            minimumPayoutUnits: old.minimumPayoutUnits,
            totalsFetchedAt: old.totalsFetchedAt ?? old.fetchedAt,
          }
        : {}),
      ...(item.todayUnits === null && item.historyError
        ? {
            todayUnits: old.accountingDay === item.accountingDay ? old.todayUnits : null,
            yesterdayUnits:
              old.accountingDay === item.accountingDay ? (old.yesterdayUnits ?? null) : null,
            recent: old.recent,
            historyCount: old.historyCount,
            historyFetchedAt: old.historyFetchedAt ?? old.fetchedAt,
          }
        : {}),
    };
  });
}

export function earningsFreshness(earnings: DeviceEarnings | null, now: number) {
  const usable = (clock: number | null | undefined, error: string | null | undefined) =>
    !!clock && now >= clock && now - clock <= EARNINGS_FRESH_MS && !error;
  return {
    today:
      !!earnings &&
      earnings.accountingDay === hongKongDayStartSeconds(now) &&
      usable(
        earnings.historyFetchedAt ?? earnings.fetchedAt,
        earnings.historyError === undefined ? earnings.error : earnings.historyError,
      ),
    lifetime:
      !!earnings &&
      usable(
        earnings.totalsFetchedAt ?? earnings.fetchedAt,
        earnings.totalsError === undefined ? earnings.error : earnings.totalsError,
      ),
  };
}
