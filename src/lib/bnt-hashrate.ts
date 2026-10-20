export const BNT_HASHRATE_RANGES = ["24h", "7d", "30d"] as const;
export type BntHashrateRange = (typeof BNT_HASHRATE_RANGES)[number];
export type HashratePoint = { at: number; hashrate: number | null };
export function parseBntHashrateHistory(input: unknown, now = Date.now()): HashratePoint[] {
  if (!Array.isArray(input) || input.length > 10000) throw new Error("invalid-data");
  const rows = new Map<number, HashratePoint>();
  for (const raw of input) {
    if (!raw || typeof raw !== "object") throw new Error("invalid-data");
    const { timestamp, hashrate } = raw as Record<string, unknown>;
    if (
      typeof timestamp !== "number" ||
      !Number.isFinite(timestamp) ||
      timestamp <= 0 ||
      (hashrate !== null &&
        (typeof hashrate !== "number" || !Number.isFinite(hashrate) || hashrate < 0))
    )
      throw new Error("invalid-data");
    const at = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    if (at > now + 300000) throw new Error("invalid-data");
    rows.set(at, { at, hashrate: hashrate as number | null });
  }
  return [...rows.values()].sort((a, b) => a.at - b.at);
}
/** Insert a null break for an absent interval; never turn a missing sample into zero. */
export function hashrateChartPoints(rows: HashratePoint[]): HashratePoint[] {
  const intervals = rows
    .slice(1)
    .map((r, i) => r.at - rows[i]!.at)
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const step = intervals[Math.floor(intervals.length / 2)] ?? 0;
  return rows.flatMap((r, i) =>
    i && step && r.at - rows[i - 1]!.at > step * 3
      ? [{ at: rows[i - 1]!.at + step, hashrate: null }, r]
      : [r],
  );
}
