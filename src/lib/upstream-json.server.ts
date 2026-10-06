import { withDeadline } from "./deadline";
export class UpstreamReadError extends Error {
  constructor(
    message: string,
    readonly retryAfterMs = 0,
  ) {
    super(message);
  }
}
/** Fixed callers supply URLs; credentials never follow redirects or enter error messages. */
export async function upstreamJson(
  url: string,
  options: {
    token?: string | undefined;
    body?: object | undefined;
    maxBytes?: number;
    authErrors?: boolean;
  } = {},
  fetcher: typeof fetch = fetch,
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = 12000;
  const deadlineAt = Date.now() + timeout;
  const timer = setTimeout(() => controller.abort(), timeout);
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    const response = await withDeadline(
      fetcher(url, {
        method: options.body ? "POST" : "GET",
        headers: {
          accept: "application/json",
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...(options.body ? { "content-type": "application/json" } : {}),
        },
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
        signal: controller.signal,
        redirect: "manual",
      }),
      timeout,
      "unavailable",
    );
    if (options.authErrors && (response.status === 401 || response.status === 403))
      throw new UpstreamReadError("expired");
    if (response.status === 404) throw new UpstreamReadError("not-found");
    if (!response.ok) {
      const retry = response.headers.get("retry-after");
      const seconds =
        retry && /^\d+$/.test(retry)
          ? Number(retry) * 1000
          : retry
            ? Date.parse(retry) - Date.now()
            : 0;
      throw new UpstreamReadError(
        "unavailable",
        Number.isFinite(seconds) ? Math.max(0, seconds) : 0,
      );
    }
    reader = response.body?.getReader();
    if (!reader) throw new UpstreamReadError("invalid-data");
    const parts: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { value, done } = await withDeadline(
        reader.read(),
        Math.max(0, deadlineAt - Date.now()),
        "unavailable",
      );
      if (done) break;
      size += value.length;
      if (size > (options.maxBytes ?? 2000000)) throw new UpstreamReadError("invalid-data");
      parts.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const part of parts) {
      body.set(part, offset);
      offset += part.length;
    }
    try {
      return JSON.parse(new TextDecoder().decode(body));
    } catch {
      throw new UpstreamReadError("invalid-data");
    }
  } finally {
    clearTimeout(timer);
    controller.abort();
    if (reader) {
      void reader.cancel().catch(() => {});
      try {
        reader.releaseLock();
      } catch {
        /* a pending read is canceled above */
      }
    }
  }
}
