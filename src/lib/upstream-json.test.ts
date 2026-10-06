import { afterEach, describe, expect, it, vi } from "vitest";
import { upstreamJson } from "./upstream-json.server";
afterEach(() => vi.useRealTimers());
describe("bounded upstream JSON", () => {
  it("rejects redirects, authentication errors and malformed payloads without echoing secrets", async () => {
    const token = "private-test-token";
    const fetcher = vi.fn(async (_u: unknown, init?: RequestInit) => {
      expect(init?.redirect).toBe("manual");
      expect(new Headers(init?.headers).get("Authorization")).toBe(`Bearer ${token}`);
      return new Response("private-body", {
        status: 302,
        headers: { location: "https://elsewhere.invalid" },
      });
    });
    await expect(
      upstreamJson("https://api.invalid", { token, authErrors: true }, fetcher),
    ).rejects.toThrow("unavailable");
    expect(fetcher).toHaveBeenCalledTimes(1);
    await expect(
      upstreamJson(
        "https://api.invalid",
        { token, authErrors: true },
        async () => new Response("secret", { status: 401 }),
      ),
    ).rejects.toThrow("expired");
    await expect(
      upstreamJson("https://api.invalid", {}, async () => new Response("html challenge")),
    ).rejects.toThrow("invalid-data");
  });
  it("bounds body size and records retry-after without following redirects", async () => {
    await expect(
      upstreamJson("https://api.invalid", { maxBytes: 5 }, async () => new Response("1234567")),
    ).rejects.toThrow("invalid-data");
    await expect(
      upstreamJson(
        "https://api.invalid",
        {},
        async () => new Response("", { status: 429, headers: { "retry-after": "60" } }),
      ),
    ).rejects.toMatchObject({ message: "unavailable", retryAfterMs: 60000 });
  });
  it("times out hanging fetches and aborts their signal", async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    const pending = upstreamJson("https://api.invalid", {}, async (_u, init) => {
      signal = init?.signal ?? undefined;
      return new Promise<Response>(() => {});
    });
    const check = expect(pending).rejects.toThrow("unavailable");
    await vi.advanceTimersByTimeAsync(12001);
    await check;
    expect(signal?.aborted).toBe(true);
  });
});
