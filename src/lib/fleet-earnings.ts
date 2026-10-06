import { bindingIdentity, type FleetBinding } from "./fleet";

type DailyReading = {
  scope: "device" | "wallet";
  today: string | null;
  unit: string;
  todayUsdValue?: number | null;
  priceStale?: boolean;
  todayUsable?: boolean;
  earningsPeriod?: "day" | "month";
};

/** Never add different tokens, rounded display strings, or shared wallet earnings. */
export function deviceTodayEarnings(entries: { binding: FleetBinding; data: DailyReading }[]) {
  const seen = new Set<string>();
  let usd = 0,
    priced = 0,
    known = 0;
  let priceStale = false;
  const native: { amount: string; unit: string }[] = [];
  for (const { binding, data } of entries) {
    const key = bindingIdentity(binding);
    if (seen.has(key)) continue;
    seen.add(key);
    if (
      data.scope !== "device" ||
      data.earningsPeriod === "month" ||
      data.todayUsable === false ||
      data.today === null
    )
      continue;
    known++;
    native.push({ amount: data.today, unit: data.unit });
    if (
      typeof data.todayUsdValue === "number" &&
      Number.isFinite(data.todayUsdValue) &&
      data.todayUsdValue >= 0
    ) {
      usd += data.todayUsdValue;
      priced++;
      priceStale ||= data.priceStale === true;
    }
  }
  return {
    usd: priced > 0 && Number.isFinite(usd) ? usd : null,
    native,
    priceStale,
    known,
    priced,
    total: seen.size,
    partial: priced < seen.size,
  };
}

/** Show known token earnings prominently when conversion is unavailable. */
export function deviceEarningsHeadline(daily: ReturnType<typeof deviceTodayEarnings>) {
  return daily.usd === null && daily.native.length === 1 ? daily.native[0]! : null;
}

/** A single wallet metric is an alternative display, never device daily earnings. */
export function singleAccountSummary(
  readings: { accountSummary?: { kind: "month" | "balance"; amount: string; unit: string } }[],
) {
  return readings.length === 1 ? (readings[0]?.accountSummary ?? null) : null;
}

/** Retained daily records are displayed separately and never enter the current total. */
export function retainedDeviceDaily(
  readings: {
    scope: "device" | "wallet";
    health?: string;
    today: string | null;
    todaySameDay?: boolean;
    unit: string;
  }[],
) {
  const one = readings.length === 1 ? readings[0] : undefined;
  return one?.scope === "device" &&
    one.health === "stale" &&
    one.todaySameDay === true &&
    one.today !== null
    ? { amount: one.today, unit: one.unit }
    : null;
}
