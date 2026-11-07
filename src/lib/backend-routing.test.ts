import { createServer } from "node:http";
import { once } from "node:events";
import { expect, it } from "vitest";
import { routeBackendRequest } from "./backend-routing.server";

const proxySecret = "isolated-test-proxy-secret";

it("keeps frontend pages local and pauses business routes before either backend can write", async () => {
  const paused = { IOTA_BACKEND_PAUSED: "true" };
  expect(
    await routeBackendRequest(new Request("https://iotahome.site/zh/overview"), paused),
  ).toBeNull();
  const write = await routeBackendRequest(
    new Request("https://iotahome.site/_serverFn/save"),
    paused,
  );
  expect(write?.status).toBe(503);
  expect(write?.headers.get("retry-after")).toBe("15");
});

it("forwards raw Stripe bytes, signatures and TanStack authorization over HTTP", async () => {
  const bytes = Buffer.from('{"data":  {"object":"续费"}}\n');
  const requests: {
    path?: string | undefined;
    raw: Buffer;
    signature?: string | undefined;
    auth?: string | undefined;
  }[] = [];
  const server = createServer(async (req, res) => {
    const headers = new Headers();
    headers.set("x-iota-backend-key", String(req.headers["x-iota-backend-key"] ?? ""));
    const checked = await routeBackendRequest(
      new Request("https://backend.example" + req.url, { headers }),
      { IOTA_BACKEND_PROXY_SECRET: proxySecret },
    );
    if (checked) {
      res.writeHead(checked.status).end();
      return;
    }
    const parts: Buffer[] = [];
    for await (const chunk of req) parts.push(chunk);
    requests.push({
      path: req.url,
      raw: Buffer.concat(parts),
      signature: String(req.headers["stripe-signature"] ?? ""),
      auth: req.headers.authorization,
    });
    res.writeHead(204).end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const address = server.address();
    if (!address || typeof address === "string") throw Error("No test HTTP address");
    const origin = `http://127.0.0.1:${address.port}`;
    const env = { IOTA_BACKEND_ORIGIN: origin, IOTA_BACKEND_PROXY_SECRET: proxySecret };
    expect((await fetch(origin + "/api/stripe/webhook")).status).toBe(404);
    const stripe = await routeBackendRequest(
      new Request("https://iotahome.site/api/stripe/webhook?x=1", {
        method: "POST",
        body: bytes,
        headers: { "stripe-signature": "t=1,v1=test", "x-iota-backend-key": "untrusted" },
      }),
      env,
    );
    expect(stripe?.status).toBe(204);
    expect(requests[0]).toMatchObject({
      path: "/api/stripe/webhook?x=1",
      raw: bytes,
      signature: "t=1,v1=test",
    });
    const rpc = await routeBackendRequest(
      new Request("https://iotahome.site/_serverFn/id?value=1", {
        headers: { authorization: "Bearer test" },
      }),
      env,
    );
    expect(rpc?.status).toBe(204);
    expect(requests[1]).toMatchObject({ path: "/_serverFn/id?value=1", auth: "Bearer test" });
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

it("fails closed if a configured backend is missing its proxy key or points to itself", async () => {
  const request = new Request("https://iotahome.site/api/device-agent/heartbeat");
  expect(
    (await routeBackendRequest(request, { IOTA_BACKEND_ORIGIN: "https://backend.example" }))
      ?.status,
  ).toBe(502);
  expect(
    (
      await routeBackendRequest(request, {
        IOTA_BACKEND_ORIGIN: "https://iotahome.site",
        IOTA_BACKEND_PROXY_SECRET: proxySecret,
      })
    )?.status,
  ).toBe(502);
});
