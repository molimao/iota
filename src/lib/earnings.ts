import type { EntitlementHistory } from "./iota-types";

/** Alpha amounts are handled as integer counts of 1e-8 to avoid float drift. */
export const UNIT_SCALE = 100_000_000;

export const COUNTED_STATUSES = ["pending", "settled"] as const;

export function toUnits(amount: number): number | null {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null;
  const units = Math.round(amount * UNIT_SCALE);
  return Number.isSafeInteger(units) ? units : null;
}

export function unitsToNumber(units: number): number {
  return units / UNIT_SCALE;
}

export function formatIota(units: number | null, decimals = 4): string {
  if (units === null) return "—";
  const negative = units < 0;
  const abs = Math.abs(units);
  const whole = Math.floor(abs / UNIT_SCALE);
  const frac = String(abs % UNIT_SCALE).padStart(8, "0");
  const shown = decimals >= 8 ? frac.replace(/0+$/, "") : frac.slice(0, decimals);
  const body =
    shown.length > 0 ? `${whole.toLocaleString("zh-CN")}.${shown}` : whole.toLocaleString("zh-CN");
  return `${negative ? "-" : ""}${body}`;
}

/** Start of "today" in Asia/Hong_Kong (UTC+8), as a Unix seconds value. */
export function hongKongDayStartSeconds(nowMs: number = Date.now()): number {
  const offset = 8 * 3600;
  const nowSec = Math.floor(nowMs / 1000);
  return Math.floor((nowSec + offset) / 86_400) * 86_400 - offset;
}

export type TodaySum = { units: number | null; counted: number };

/**
 * Official reward accounting for "today": history entries dated on or after
 * Hong Kong midnight, not in the future, with status pending or settled.
 * Malformed payloads yield `null` (unknown) rather than a misleading 0.
 */
export function sumTodayUnits(
  history: EntitlementHistory | null | undefined,
  nowMs: number = Date.now(),
): TodaySum {
  if (!history) return { units: null, counted: 0 };
  const { alpha_amounts: amounts, timestamps, statuses } = history;
  if (!Array.isArray(amounts) || !Array.isArray(timestamps) || !Array.isArray(statuses)) {
    return { units: null, counted: 0 };
  }
  if (amounts.length !== timestamps.length || amounts.length !== statuses.length) {
    return { units: null, counted: 0 };
  }
  if (amounts.length === 0) return { units: 0, counted: 0 };

  const dayStart = hongKongDayStartSeconds(nowMs);
  const nowSec = Math.floor(nowMs / 1000);
  let total = 0;
  let counted = 0;

  for (let i = 0; i < amounts.length; i += 1) {
    const ts = timestamps[i];
    const status = statuses[i];
    const units = toUnits(amounts[i]!);
    if (
      typeof ts !== "number" ||
      !Number.isFinite(ts) ||
      typeof status !== "string" ||
      units === null
    ) {
      return { units: null, counted: 0 };
    }
    if (ts < dayStart || ts > nowSec) continue;
    if (!(COUNTED_STATUSES as readonly string[]).includes(status.toLowerCase())) continue;
    total += units;
    counted += 1;
  }
  return { units: total, counted };
}

export type Aggregate = {
  units: number;
  known: number;
  total: number;
  partial: boolean;
};

/** Aggregates only devices with usable data; never turns unknown into 0. */
export function aggregateUnits(values: Array<number | null>): Aggregate {
  let units = 0;
  let known = 0;
  for (const value of values) {
    if (value === null) continue;
    units += value;
    known += 1;
  }
  return { units, known, total: values.length, partial: known < values.length };
}
