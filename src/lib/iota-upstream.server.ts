/**
 * Server-only constrained read-only proxy for the official IOTA web API.
 *
 * Guarantees:
 *  - only fixed allowlisted path shapes are ever requested (no arbitrary URL / SSRF)
 *  - shared TTL cache + singleflight + max 6 concurrent upstream requests
 *  - 12s timeout, exponential backoff after failures (stale data is kept and flagged)
 */

import { validFetchedAt } from "./device-status";

export const IOTA_BASE = "https://iota-web.api.macrocosmos.ai/mainnet";

export const TTL = {
  runs: 300_000,
  miners: 60_000,
  occupancy: 120_000,
  progress: 60_000,
  metrics: 300_000,
  rewards: 300_000,
} as const;

const TIMEOUT_MS = 12_000;
const MAX_CONCURRENCY = 6;
const UPSTREAM_HEADERS = {
  accept: "application/json",
  "user-agent": "IOTA-Watch/1.0 (+https://iotahome.site)",
} as const;
const BACKOFF_BASE_MS = 5_000;
const BACKOFF_MAX_MS = 120_000;

export type UpstreamResult<T> = {
  data: T | null;
  fetchedAt: number | null;
  error: string | null;
  stale: boolean;
};

type CacheEntry = {
  data: unknown;
  fetchedAt: number;
  failures: number;
  nextAttemptAt: number;
  lastError: string | null;
};

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

let activeCount = 0;
const waiters: Array<() => void> = [];

async function acquireSlot(): Promise<void> {
  if (activeCount < MAX_CONCURRENCY) {
    activeCount += 1;
    return;
  }
  await new Promise<void>((resolve) => waiters.push(resolve));
  activeCount += 1;
}

function releaseSlot(): void {
  activeCount -= 1;
  const next = waiters.shift();
  if (next) next();
}

async function rawFetch(path: string): Promise<unknown> {
  await acquireSlot();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(`${IOTA_BASE}${path}`, {
        method: "GET",
        headers: UPSTREAM_HEADERS,
        signal: controller.signal,
      });
      const text = await response.text();
      if (!response.ok) {
        const snippet = text.slice(0, 160).replace(/\s+/g, " ");
        if (response.status === 403 || response.status === 503) {
          throw new Error(
            `上游拒绝访问（HTTP ${response.status}，可能是 Cloudflare 拦截）：${snippet}`,
          );
        }
        throw new Error(`上游返回 HTTP ${response.status}：${snippet}`);
      }
      try {
        return JSON.parse(text) as unknown;
      } catch {
        throw new Error("上游返回的不是有效 JSON（可能被中间层拦截）");
      }
    } finally {
      clearTimeout(timer);
    }
  } finally {
    releaseSlot();
  }
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "AbortError") return "请求超时（12 秒）";
    return error.message;
  }
  return "未知错误";
}

/**
 * Fetch an allowlisted upstream path through the shared cache.
 * `force` bypasses the TTL (manual refresh) but never bypasses backoff windows
 * for more than one attempt, and never discards previously good data.
 */
export async function fetchUpstream<T>(
  path: string,
  ttlMs: number,
  force = false,
): Promise<UpstreamResult<T>> {
  const now = Date.now();
  const key = path;
  const entry = cache.get(key);

  const fresh =
    entry && !entry.lastError && entry.data !== undefined && now - entry.fetchedAt < ttlMs;
  if (fresh && !force) {
    return { data: entry.data as T, fetchedAt: validFetchedAt(entry.fetchedAt), error: null, stale: false };
  }

  const backingOff = entry != null && now < entry.nextAttemptAt && !force;
  if (backingOff) {
    return {
      data: (entry.data as T) ?? null,
      fetchedAt: entry.data === undefined ? null : validFetchedAt(entry.fetchedAt),
      error: entry.lastError,
      stale: true,
    };
  }

  const existing = inflight.get(key);
  const promise =
    existing ??
    rawFetch(path)
      .then((data) => {
        cache.set(key, {
          data,
          fetchedAt: Date.now(),
          failures: 0,
          nextAttemptAt: 0,
          lastError: null,
        });
        return data;
      })
      .catch((error: unknown) => {
        const message = describeError(error);
        const previous = cache.get(key);
        const failures = (previous?.failures ?? 0) + 1;
        const delay = Math.min(BACKOFF_BASE_MS * 2 ** (failures - 1), BACKOFF_MAX_MS);
        cache.set(key, {
          data: previous?.data as unknown,
          fetchedAt: previous?.data !== undefined ? (previous.fetchedAt ?? 0) : 0,
          failures,
          nextAttemptAt: Date.now() + delay,
          lastError: message,
        });
        throw new Error(message);
      })
      .finally(() => {
        inflight.delete(key);
      });

  if (!existing) inflight.set(key, promise);

  try {
    const data = (await promise) as T;
    const updated = cache.get(key);
    return { data, fetchedAt: validFetchedAt(updated?.fetchedAt) ?? Date.now(), error: null, stale: false };
  } catch (error) {
    const previous = cache.get(key);
    const previousAt = validFetchedAt(previous?.fetchedAt);
    const hasPrevious = previous?.data !== undefined && previousAt !== null;
    return {
      data: hasPrevious ? (previous!.data as T) : null,
      fetchedAt: hasPrevious ? previousAt : null,
      error: describeError(error),
      stale: true,
    };
  }
}
