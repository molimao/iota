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
it("accepts read-only Windows mining observations through the regular heartbeat", async () => {
  const observedAt = new Date().toISOString();
  const windows = {
    ...snapshot, platform: "win32", monitorOnly: true, appRunning: false, workerRunning: false,
    miners: [{
      project: "prl", software: "pearl-windows", bindingId: "11111111-1111-4111-8111-111111111111",
      observedAt, status: "ok", rateWindow: "current", hashrateCurrent: 144.6e12,
      hashrate10s: null, hashrate60s: null, accepted: 70, rejected: 1, uptime: null,
    }],
    xds: { status: "ok", observedAt, hashrateHps: 42.5 },
  };
  const beat = (value: unknown) => deviceAgentHttp(new Request("https://iotahome.site/api/device-agent/heartbeat", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + "a".repeat(43) },
    body: JSON.stringify({ snapshot: value, requestBindings: true }),
  }));
  mock.rpc.mockResolvedValueOnce({ data: { command: null }, error: null })
    .mockResolvedValueOnce({ data: [], error: null });
  expect((await beat(windows)).status).toBe(200);
  expect(mock.rpc.mock.calls[0]![1].p_payload.snapshot).toMatchObject(windows);
  expect(mock.rpc.mock.calls[1]![0]).toBe("watch_agent_binding_manifest");
  expect((await beat({ ...windows, monitorOnly: false })).status).toBe(400);
  expect((await beat({ ...windows, logs: "raw log" })).status).toBe(400);
});
it("returns validated device binding descriptors only on explicit collection requests", async () => {
  const binding = {
    id: "11111111-1111-4111-8111-111111111111",
    project: "bnt",
    identifier: "public-wallet",
    worker: "Mac",
  };
  mock.rpc
    .mockResolvedValueOnce({ data: { command: null }, error: null })
    .mockResolvedValueOnce({ data: [binding], error: null });
  const response = await deviceAgentHttp(
    new Request("https://iotahome.site/api/device-agent/heartbeat", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + "a".repeat(43) },
      body: JSON.stringify({ snapshot, requestBindings: true }),
    }),
  );
  expect(response.status).toBe(200);
  expect((await response.json()).bindings).toEqual([binding]);
  expect(mock.rpc.mock.calls[1]![0]).toBe("watch_agent_binding_manifest");
  expect(mock.rpc.mock.calls[1]![1].p_hash).toHaveLength(64);
});
it("keeps normal command delivery when optional binding discovery is unavailable", async () => {
  const command = {
    id: "11111111-1111-4111-8111-111111111111",
    action: "restart",
    expiresAt: "2026-10-26T08:00:00.1+00:00",
  };
  mock.rpc
    .mockResolvedValueOnce({ data: { command }, error: null })
    .mockRejectedValueOnce(new Error("not deployed"));
  const response = await deviceAgentHttp(
    new Request("https://iotahome.site/api/device-agent/heartbeat", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + "a".repeat(43) },
      body: JSON.stringify({ snapshot, requestBindings: true }),
    }),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    command: { ...command, expiresAt: "2026-10-26T08:00:00.100Z" },
    bindings: [],
  });
});
it("delivers a verified lease to an enabled Agent that still needs the miner", async () => {
  const lease = {
    worker: "iota-000000000001",
    seconds: 45,
    settings: {
      address:
        "2BZVmXsZqZJNdRouv8wipYe9pxYhCK1mx8kyz8Hauz58ueCLxEvaCkdmu8pWnHZiXa3ASPGnT9VsUcqJKx5az3Yq5HDNe",
      threads: 2,
      memoryMb: 5120,
      whenQueued: true,
      whenPaused: true,
    },
  };
  mock.rpc
    .mockResolvedValueOnce({ data: { command: null }, error: null })
    .mockResolvedValueOnce({ data: lease, error: null });
  const response = await deviceAgentHttp(
    new Request("https://iotahome.site/api/device-agent/heartbeat", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + "a".repeat(43) },
      body: JSON.stringify({
        snapshot: { ...snapshot, idleBnt: { state: "install_needed", hashrate: null } },
      }),
    }),
  );
  expect(response.status).toBe(200);
  expect((await response.json()).idleBnt).toEqual(lease);
  expect(mock.rpc.mock.calls[1]![0]).toBe("watch_idle_bnt_lease");
});
it.each([
  ["2026-10-15T07:11:17.42363+00:00", "2026-10-15T07:11:17.423Z"],
  ["2026-10-15T07:08:17.09349+00:00", "2026-10-15T07:08:17.093Z"],
  ["2026-10-15T15:11:17.1+08:00", "2026-10-15T07:11:17.100Z"],
])("normalizes command expiry %s for installed Python 3.9 agents", async (expiresAt, expected) => {
  const command = { id: "11111111-1111-4111-8111-111111111111", action: "restart", expiresAt };
  mock.rpc.mockResolvedValue({
    data: { command, logsEnabled: false, recoveryEnabled: false },
    error: null,
  });
  const r = await deviceAgentHttp(
    new Request("https://iotahome.site/api/device-agent/heartbeat", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + "a".repeat(43) },
      body: JSON.stringify({ snapshot }),
    }),
  );
  expect(r.status).toBe(200);
  expect(await r.json()).toEqual({
    command: { ...command, expiresAt: expected },
    logsEnabled: false,
    recoveryEnabled: false,
  });
});
it("grants XDS separately and keeps heartbeat working when its optional lease is unavailable", async () => {
  const lease = { settings: { threads: 2, whenQueued: true, whenPaused: true }, seconds: 45 };
  const beat = () => deviceAgentHttp(new Request("https://iotahome.site/api/device-agent/heartbeat", {
    method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + "a".repeat(43) },
    body: JSON.stringify({ snapshot: { ...snapshot, platform: "darwin", idleXds: { state: "off", hashrate: null } } }),
  }));
  mock.rpc.mockResolvedValueOnce({ data: { command: null }, error: null }).mockResolvedValueOnce({ data: lease, error: null });
  expect(await (await beat()).json()).toEqual({ command: null, idleXds: lease });
  expect(mock.rpc.mock.calls[1]![0]).toBe("watch_idle_xds_lease");
  mock.rpc.mockResolvedValueOnce({ data: { command: null }, error: null }).mockRejectedValueOnce(new Error("not deployed"));
  expect(await (await beat()).json()).toEqual({ command: null, idleXds: null });
});

it("uses a separate authenticated encrypted-wallet endpoint and rejects plaintext packages", async()=>{
  const publicKey="-----BEGIN PUBLIC KEY-----\nYQ==\n-----END PUBLIC KEY-----\n";
  const request=(data:unknown)=>new Request("https://iotahome.site/api/device-agent/xds-wallet",{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+"a".repeat(43)},body:JSON.stringify(data)});
  mock.rpc.mockResolvedValueOnce({data:{kind:"source",walletId:"11111111-1111-4111-8111-111111111111",recipients:[],address:null},error:null});
  expect((await deviceAgentHttp(request({action:"poll",publicKey}))).status).toBe(200);
  expect(mock.rpc.mock.calls[0]![0]).toBe("watch_xds_wallet_agent");
  expect(mock.rpc.mock.calls[0]![1].p_hash).toHaveLength(64);
  mock.rpc.mockClear();
  expect((await deviceAgentHttp(request({action:"source",wallet:"plaintext secret",password:"secret"}))).status).toBe(400);
  expect(mock.rpc).not.toHaveBeenCalled();
});

it('authenticates lightweight probes and never accepts telemetry through that endpoint',async()=>{
  const probe=(payload:unknown={},token='Bearer '+'a'.repeat(43))=>deviceAgentHttp(new Request('https://iotahome.site/api/device-agent/probe',{method:'POST',headers:{authorization:token,'content-type':'application/json'},body:JSON.stringify(payload)}));
  expect((await probe({},'')).status).toBe(401);
  expect((await probe({snapshot})).status).toBe(400);
  expect(mock.rpc).not.toHaveBeenCalled();
  mock.rpc.mockResolvedValue({data:{active:false},error:null});
  expect(await (await probe()).json()).toEqual({active:false});
  expect(mock.rpc.mock.calls[0]![0]).toBe('watch_agent_probe');
  expect(mock.rpc.mock.calls[0]![1].p_hash).toHaveLength(64);
  mock.rpc.mockResolvedValue({data:null,error:{message:'unauthorized'}});
  expect((await probe()).status).toBe(401);
});

it('negotiates idle and active intervals while keeping old agents compatible',async()=>{
  const beat=(adaptive?:true)=>deviceAgentHttp(new Request('https://iotahome.site/api/device-agent/heartbeat',{method:'POST',headers:{authorization:'Bearer '+'a'.repeat(43),'content-type':'application/json'},body:JSON.stringify({snapshot,adaptive})}));
  for(const active of [false,true]) {
    mock.rpc.mockImplementation(async(name:string)=>({data:name==='watch_agent_probe'?{active}:{command:null},error:null}));
    expect((await (await beat(true)).json()).interval).toBe(active?10:60);
  }
  mock.rpc.mockClear();
  await beat();
  expect(mock.rpc.mock.calls.some(([name])=>name==='watch_agent_probe')).toBe(false);
  mock.rpc.mockImplementation(async(name:string)=>name==='watch_agent_probe'?{data:null,error:{message:'missing migration'}}:{data:{command:null},error:null});
  expect((await (await beat(true)).json()).interval).toBe(15);
});
