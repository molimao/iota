export type ReadResult<T> = {
  data: T | null;
  fetchedAt: number | null;
  error: string | null;
  stale?: boolean;
};
const INVALIDATES = new Set(["expired", "connect-required", "not-configured", "not-found"]);
/** Preserve only the last successful source clock, for this exact query identity. */
export function retainReadResult<T, R extends ReadResult<T>>(
  next: R,
  previous: R | undefined,
  now = Date.now(),
): R {
  if (next.error && INVALIDATES.has(next.error))
    return { ...next, data: null, fetchedAt: null, stale: false };
  if (next.data !== null || !next.error) return next;
  if (
    previous?.data != null &&
    previous.fetchedAt != null &&
    now >= previous.fetchedAt &&
    now - previous.fetchedAt < 30 * 60000
  )
    return { ...next, data: previous.data, fetchedAt: previous.fetchedAt, stale: true };
  return next;
}
export class ReadCache {
  private entries = new Map<
    string,
    {
      result: ReadResult<unknown>;
      attemptedAt: number;
      failures: number;
      retryAt: number;
      pending?: Promise<ReadResult<unknown>> | undefined;
    }
  >();
  constructor(private capacity = 300) {}
  clearPrefix(prefix: string) {
    for (const key of this.entries.keys()) if (key.startsWith(prefix)) this.entries.delete(key);
  }
  async read<T>(
    key: string,
    read: () => Promise<T>,
    options: { ttl?: number; force?: boolean; classify?: (e: unknown) => string } = {},
  ): Promise<ReadResult<T>> {
    const now = Date.now();
    let entry = this.entries.get(key);
    if (entry?.pending) return entry.pending as Promise<ReadResult<T>>;
    if (
      entry &&
      (now < entry.retryAt ||
        now - entry.attemptedAt <
          (options.force ? 5000 : entry.result.error ? 0 : (options.ttl ?? 60000)))
    ) {
      if (
        entry.result.error &&
        entry.result.fetchedAt != null &&
        now - entry.result.fetchedAt >= 30 * 60000
      )
        entry.result = { ...entry.result, data: null, fetchedAt: null, stale: false };
      return entry.result as ReadResult<T>;
    }
    if (!entry) {
      if (this.entries.size >= this.capacity) {
        const removable = [...this.entries].find(([, v]) => !v.pending)?.[0];
        if (!removable) return { data: null, fetchedAt: null, error: "unavailable" };
        this.entries.delete(removable);
      }
      entry = {
        result: { data: null, fetchedAt: null, error: null },
        attemptedAt: 0,
        failures: 0,
        retryAt: 0,
      };
      this.entries.set(key, entry);
    }
    const target = entry;
    target.attemptedAt = now;
    target.pending = Promise.resolve()
      .then(read)
      .then((data) => {
        target.failures = 0;
        target.retryAt = 0;
        return (target.result = { data, fetchedAt: Date.now(), error: null, stale: false });
      })
      .catch((e: unknown) => {
        const error =
          options.classify?.(e) ??
          (e instanceof Error && ["invalid-data", "not-found"].includes(e.message)
            ? e.message
            : "unavailable");
        target.failures++;
        const retryAfter =
          e &&
          typeof e === "object" &&
          "retryAfterMs" in e &&
          typeof e.retryAfterMs === "number" &&
          Number.isFinite(e.retryAfterMs)
            ? e.retryAfterMs
            : 0;
        target.retryAt =
          Date.now() +
          Math.min(120000, Math.max(retryAfter, 5000 * 2 ** Math.min(target.failures - 1, 5)));
        return (target.result = retainReadResult(
          { data: null, fetchedAt: null, error, stale: false },
          target.result,
        ));
      })
      .finally(() => {
        target.pending = undefined;
      });
    return target.pending as Promise<ReadResult<T>>;
  }
}
