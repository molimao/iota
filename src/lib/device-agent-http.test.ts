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
it.each([
  ["2026-10-15T07:11:17.42363+00:00", "2026-10-15T07:11:17.423Z"],
  ["2026-10-15T07:08:17.09349+00:00", "2026-10-15T07:08:17.093Z"],
  ["2026-10-15T15:11:17.1+08:00", "2026-10-15T07:11:17.100Z"],
])("normalizes command expiry %s for installed Python 3.9 agents", async (expiresAt, expected) => {
  const command = { id: "11111111-1111-4111-8111-111111111111", action: "restart", expiresAt };
  mock.rpc.mockResolvedValue({ data: { command, logsEnabled: false, recoveryEnabled: false }, error: null });
  const r = await deviceAgentHttp(new Request("https://iotahome.site/api/device-agent/heartbeat", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + "a".repeat(43) },
    body: JSON.stringify({ snapshot }),
  }));
  expect(r.status).toBe(200);
  expect(await r.json()).toEqual({ command: { ...command, expiresAt: expected }, logsEnabled: false, recoveryEnabled: false });
});
