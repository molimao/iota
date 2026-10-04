import { validFetchedAt } from "./device-status";

export type SourceHealthInput = {
  fetchedAt: number | null;
  error?: string | null | undefined;
  partial?: boolean;
  maxAgeMs?: number;
};

/** A failed poll does not make a recent successful reading age faster. */
export function sourceHealth(source: SourceHealthInput, now: number) {
  const fetchedAt = validFetchedAt(source.fetchedAt);
  if (fetchedAt === null) return source.error ? "failed" : "pending";
  if (source.partial) return "partial";
  if (now - fetchedAt > (source.maxAgeMs ?? 5 * 60_000)) return "old";
  return source.error ? "failed" : "ready";
}

/** Watched-device clocks, rather than the clock of an unrelated fresh roster. */
export function deviceStatusSource(
  devices: Array<{ statusFetchedAt: number | null; statusStale: boolean; status: string }>,
  error: string | null,
  connectionError: string | null = null,
) {
  const clocks = devices
    .map((device) => validFetchedAt(device.statusFetchedAt))
    .filter((clock): clock is number => clock !== null);
  const usable = devices.filter(
    (device) =>
      validFetchedAt(device.statusFetchedAt) !== null &&
      !device.statusStale &&
      device.status !== "unknown",
  ).length;
  return {
    fetchedAt: clocks.length ? Math.min(...clocks) : null,
    error: connectionError ?? (usable < devices.length ? error : null),
    partial: usable > 0 && usable < devices.length,
  };
}
