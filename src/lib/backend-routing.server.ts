import { timingSafeEqual } from "node:crypto";

const proxyHeader = "x-iota-backend-key";

export async function routeBackendRequest(
  request: Request,
  env: Record<string, string | undefined>,
  send: typeof fetch = fetch,
): Promise<Response | null> {
  const incoming = new URL(request.url);
  if (!incoming.pathname.startsWith("/api/") && !incoming.pathname.startsWith("/_serverFn/")) {
    return null;
  }
  if (env["IOTA_BACKEND_PAUSED"] === "true") {
    return new Response("Backend temporarily unavailable", {
      status: 503,
      headers: { "cache-control": "no-store", "retry-after": "15" },
    });
  }

  const origin = env["IOTA_BACKEND_ORIGIN"];
  const secret = env["IOTA_BACKEND_PROXY_SECRET"];
  if (!origin) {
    if (!secret) return null;
    const presented = Buffer.from(request.headers.get(proxyHeader) ?? "");
    const expected = Buffer.from(secret);
    return presented.length === expected.length && timingSafeEqual(presented, expected)
      ? null
      : new Response("Not found", { status: 404 });
  }
  try {
    const target = new URL(origin);
    if (
      !secret ||
      target.origin === incoming.origin ||
      target.username ||
      target.password ||
      target.pathname !== "/" ||
      target.search ||
      target.hash ||
      (target.protocol !== "https:" &&
        !(target.protocol === "http:" && target.hostname === "127.0.0.1"))
    )
      throw new Error("invalid_backend_route");
    target.pathname = incoming.pathname;
    target.search = incoming.search;

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("connection");
    headers.delete("transfer-encoding");
    headers.set("x-forwarded-host", incoming.host);
    headers.set("x-forwarded-proto", incoming.protocol.slice(0, -1));
    headers.set(proxyHeader, secret);
    // Preserve the raw body for Stripe signatures and TanStack's serialized requests.
    return await send(new Request(target, request), {
      headers,
      redirect: "manual",
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    return new Response("Backend unavailable", {
      status: 502,
      headers: { "cache-control": "no-store" },
    });
  }
}
