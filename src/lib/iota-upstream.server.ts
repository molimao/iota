/**
 * Server-only constrained read-only proxy for the official IOTA web API.
 *
 * Guarantees:
 *  - only fixed allowlisted path shapes are ever requested (no arbitrary URL / SSRF)
 *  - shared TTL cache + singleflight + max 3 concurrent upstream requests
 *  - hard timeout (AbortController + Promise.race) so one hung /miners cannot pin the isolate
 *  - exponential backoff after failures (stale data is kept and flagged)
 */

import { validFetchedAt } from "./device-status";
import { withDeadline } from "./deadline";
import { parseUpstreamPayload, upstreamKind } from "./iota-api-schema";

export const IOTA_BASE = "https://iota-web.api.macrocosmos.ai/mainnet";

export const TTL = {
  runs: 300_000,
  miners: 60_000,
  occupancy: 120_000,
  progress: 60_000,
  metrics: 300_000,
  rewards: 300_000,
} as const;

export const TIMEOUT_MS = 10_000;
const QUEUE_WAIT_MS = 20_000;
const MAX_CONCURRENCY = 3;
const MAX_CACHE_ENTRIES = 512;
const FORCE_COOLDOWN_MS = 15_000;
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
  retryAt?: number | null;
};

type CacheEntry = {
  data: unknown;
  fetchedAt: number;
  failures: number;
  nextAttemptAt: number;
  lastError: string | null;
  lastAttemptAt: number;
  retryAfterAt: number;
};

type Inflight = {
  promise: Promise<unknown>;
  startedAt: number;
};

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Inflight>();

let activeCount = 0;
const waiters: Array<() => void> = [];

class UpstreamFailure extends Error {
  constructor(
    message: string,
    readonly retryAfterMs = 0,
  ) {
    super(message);
  }
}

function trimCache() {
  while (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

async function acquireSlot(waitMs: number): Promise<boolean> {
  if (activeCount < MAX_CONCURRENCY) {
    activeCount += 1;
    return true;
  }
  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    const wake = () => {
      clearTimeout(timer);
      activeCount += 1;
      finish(true);
    };
    const timer = setTimeout(() => {
      const index = waiters.indexOf(wake);
      if (index >= 0) waiters.splice(index, 1);
      finish(false);
    }, waitMs);
    waiters.push(wake);
  });
}

function releaseSlot(): void {
  activeCount -= 1;
  const next = waiters.shift();
  if (next) next();
}

async function fetchJson(path: string, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await withDeadline(
      fetch(`${IOTA_BASE}${path}`, {
        method: "GET",
        headers: UPSTREAM_HEADERS,
        signal: controller.signal,
        redirect: "error",
      }),
      timeoutMs + 250,
      "请求超时",
    );
    const text = await withDeadline(response.text(), timeoutMs, "读取响应超时");
    if (!response.ok) {
      const snippet = text.slice(0, 160).replace(/\s+/g, " ");
      if (response.status === 403 || response.status === 503) {
        throw new Error(
          `上游拒绝访问（HTTP ${response.status}，可能是 Cloudflare 拦截）：${snippet}`,
        );
      }
      const retry = response.headers.get("retry-after");
      const retryAfterMs = retry
        ? /^\d+$/.test(retry)
          ? Number(retry) * 1000
          : Math.max(0, Date.parse(retry) - Date.now())
        : 0;
      throw new UpstreamFailure(
        `上游返回 HTTP ${response.status}：${snippet}`,
        Number.isFinite(retryAfterMs) ? retryAfterMs : 0,
      );
    }
    try {
      const payload: unknown = JSON.parse(text);
      return parseUpstreamPayload(path, payload);
    } catch {
      throw new Error("官方数据格式异常，已保留上次有效数据。");
    }
  } finally {
    clearTimeout(timer);
  }
}

async function rawFetch(path: string, timeoutMs = TIMEOUT_MS): Promise<unknown> {
  const got = await acquireSlot(QUEUE_WAIT_MS);
  if (!got) throw new Error("请求排队超时");
  try {
    return await fetchJson(path, timeoutMs);
  } finally {
    releaseSlot();
  }
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "AbortError" || error.message === "请求超时") return "请求超时";
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
  timeoutMs = TIMEOUT_MS,
): Promise<UpstreamResult<T>> {
  upstreamKind(path);
  const now = Date.now();
  const key = path;
  const entry = cache.get(key);

  const fresh =
    entry && !entry.lastError && entry.data !== undefined && now - entry.fetchedAt < ttlMs;
  if (fresh && !force) {
    return {
      data: entry.data as T,
      fetchedAt: validFetchedAt(entry.fetchedAt),
      error: null,
      stale: false,
    };
  }

  const backingOff = entry != null && now < entry.nextAttemptAt;
  const forceCoolingDown = force && entry && now - entry.lastAttemptAt < FORCE_COOLDOWN_MS;
  if (
    (backingOff && (!force || forceCoolingDown || now < entry.retryAfterAt)) ||
    forceCoolingDown
  ) {
    return {
      data: (entry.data as T) ?? null,
      fetchedAt: entry.data === undefined ? null : validFetchedAt(entry.fetchedAt),
      error: entry.lastError,
      stale: entry.lastError !== null || now - entry.fetchedAt >= ttlMs,
      retryAt: entry.nextAttemptAt || null,
    };
  }

  const existing = inflight.get(key);
  let promise: Promise<unknown>;
  if (existing) {
    promise = existing.promise;
  } else {
    promise = rawFetch(path, timeoutMs)
      .then((data) => {
        cache.set(key, {
          data,
          fetchedAt: Date.now(),
          failures: 0,
          nextAttemptAt: 0,
          lastError: null,
          lastAttemptAt: now,
          retryAfterAt: 0,
        });
        trimCache();
        return data;
      })
      .catch((error: unknown) => {
        const message = describeError(error);
        const previous = cache.get(key);
        const failures = (previous?.failures ?? 0) + 1;
        const delay = Math.max(
          Math.min(BACKOFF_BASE_MS * 2 ** (failures - 1), BACKOFF_MAX_MS),
          error instanceof UpstreamFailure ? error.retryAfterMs : 0,
        );
        cache.set(key, {
          data: previous?.data as unknown,
          fetchedAt: previous?.data !== undefined ? (previous.fetchedAt ?? 0) : 0,
          failures,
          nextAttemptAt: Date.now() + delay,
          lastError: message,
          lastAttemptAt: now,
          retryAfterAt: error instanceof UpstreamFailure ? Date.now() + error.retryAfterMs : 0,
        });
        trimCache();
        throw new Error(message);
      })
      .finally(() => {
        const current = inflight.get(key);
        if (current?.promise === promise) inflight.delete(key);
      });
    inflight.set(key, { promise, startedAt: now });
  }

  try {
    const data = (await withDeadline(promise, QUEUE_WAIT_MS + timeoutMs + 500, "请求超时")) as T;
    const updated = cache.get(key);
    return {
      data,
      fetchedAt: validFetchedAt(updated?.fetchedAt) ?? Date.now(),
      error: null,
      stale: false,
    };
  } catch (error) {
    const previous = cache.get(key);
    const previousAt = validFetchedAt(previous?.fetchedAt);
    const hasPrevious = previous?.data !== undefined && previousAt !== null;
    return {
      data: hasPrevious ? (previous!.data as T) : null,
      fetchedAt: hasPrevious ? previousAt : null,
      error: describeError(error),
      stale: true,
      retryAt: previous?.nextAttemptAt ?? null,
    };
  }
}
