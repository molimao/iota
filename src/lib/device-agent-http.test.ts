import { it, expect, vi, beforeEach } from "vitest";
const mock = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
vi.mock("./watch-db", () => ({ watchDb: () => mock }));
import { deviceAgentHttp } from "./device-agent-http.server";
beforeEach(() => mock.rpc.mockReset());
const snapshot = {
  appRunning: true,
  workerRunning: true,
  appCpu: 32,
  processMemoryMb: 256,
  load: 1,
  version: "1.0.0",
};
it("requires a device credential and rejects arbitrary or oversized payloads", async () => {
  const request = (body: unknown, token = "") =>
    new Request("https://iotahome.site/api/device-agent/heartbeat", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: token },
      body: JSON.stringify(body),
    });
  expect((await deviceAgentHttp(request({ snapshot }))).status).toBe(401);
  expect(
    (await deviceAgentHttp(request({ snapshot, command: "anything" }, "Bearer " + "a".repeat(43))))
      .status,
  ).toBe(400);
  expect(
    (
      await deviceAgentHttp(
        request({ snapshot: { ...snapshot, logs: "x".repeat(21000) } }, "Bearer " + "a".repeat(43)),
      )
    ).status,
  ).toBe(400);
  expect(mock.rpc).not.toHaveBeenCalled();
});
it("stores only hashed credentials and redacted log excerpts", async () => {
  mock.rpc.mockResolvedValue({ data: { command: null }, error: null });
  const token = "a".repeat(43);
  const r = await deviceAgentHttp(
    new Request("https://iotahome.site/api/device-agent/heartbeat", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + token },
      body: JSON.stringify({
        snapshot: { ...snapshot, logs: "token=supersecret\n/Users/alice/log" },
      }),
    }),
  );
  expect(r.status).toBe(200);
  const args = mock.rpc.mock.calls[0]![1];
  expect(args.p_hash).toHaveLength(64);
  expect(args.p_hash).not.toBe(token);
  expect(JSON.stringify(args.p_payload)).not.toContain("supersecret");
  expect(JSON.stringify(args.p_payload)).not.toContain("alice");
});
