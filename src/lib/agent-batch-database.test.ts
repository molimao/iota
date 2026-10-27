import { beforeAll, beforeEach, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { agentBatchSchema } from "./agent-batch";
let db: PGlite;
const u = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222";
const a = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  b = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  foreign = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const batch = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
async function owner(id = u) {
  await db.exec("RESET ROLE; SET ROLE authenticated");
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]);
}
async function admin() {
  await db.exec("RESET ROLE");
}
async function call(action = "restart", devices = [a, b], id = batch) {
  return (
    await db.query<{ r: any }>("SELECT watch_agent_batch($1,$2,$3::uuid[]) r", [
      action,
      id,
      devices,
    ])
  ).rows[0]!.r;
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
 CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY);
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 GRANT USAGE ON SCHEMA auth,public TO authenticated,service_role,anon;
 CREATE TABLE watch_devices(id uuid PRIMARY KEY,user_id uuid,name text,UNIQUE(id,user_id));
 CREATE TABLE watch_bindings(device_id uuid,user_id uuid,project text);`);
  await db.exec(
    "CREATE TABLE watch_billing(user_id uuid PRIMARY KEY,status text,period_end timestamptz)",
  );
  await db.query("INSERT INTO auth.users VALUES($1),($2)", [u, other]);
  await db.query(
    "INSERT INTO watch_devices VALUES($1,$4,'First Mac'),($2,$4,'Second Mac'),($3,$5,'Private Mac')",
    [a, b, foreign, u, other],
  );
  await db.query("INSERT INTO watch_bindings SELECT id,user_id,'iota' FROM watch_devices");
  for (const file of [
    "20261014210000_device_agents.sql",
    "20261014230000_agent_updates.sql",
    "20261026160000_agent_batches.sql",
  ])
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8"));
  await db.query(
    'INSERT INTO watch_device_agents(device_id,user_id,credential_hash,last_seen,snapshot) SELECT id,user_id,repeat(substr(id::text,1,1),64),now(),\'{"workerRunning":true,"logs":"private fragment"}\'::jsonb FROM watch_devices',
  );
}, 30000);
beforeEach(async () => {
  await admin();
  await db.exec(
    "DELETE FROM watch_agent_batches; DELETE FROM watch_agent_commands; UPDATE watch_device_agents SET last_seen=now()",
  );
  await db.query(
    "INSERT INTO watch_billing VALUES($1,'active',now()+interval '1 day') ON CONFLICT(user_id) DO UPDATE SET status='active',period_end=now()+interval '1 day'",
    [u],
  );
  await owner();
});
afterAll(async () => db.close());
it("parses real full heartbeat receipts and reads retries without new commands", async () => {
  await admin();
  await db.query(`UPDATE watch_device_agents SET snapshot=$1::jsonb`, [JSON.stringify({
    appRunning:true,workerRunning:true,appCpu:1.4,processMemoryMb:646.1,load:2.5,
    version:"1.0.13",recovery:"idle",queue:null,trainingState:null,
    appSelectedRun:{id:"4.13.7.11-tah",observedAt:new Date().toISOString()},miners:[],logs:"private",
  })]);
  await owner();
  const first=agentBatchSchema.parse(await call());
  expect(first[0]!.items[0]!.snapshot).toEqual({appRunning:true,workerRunning:true,queue:null,trainingState:null});
  expect(agentBatchSchema.parse(await call("list"))).toEqual(first);
  expect(agentBatchSchema.parse(await call())).toEqual(first);
  await admin();
  expect((await db.query<{n:number}>("SELECT count(*)::int n FROM watch_agent_commands")).rows[0]!.n).toBe(2);
});
it("keeps four devices' receipts independent and retries only the failed target", async () => {
  const c = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    d = "ffffffff-ffff-4fff-8fff-ffffffffffff";
  await admin();
  await db.query("INSERT INTO watch_devices VALUES($1,$3,'Third Mac'),($2,$3,'Fourth Mac')", [
    c,
    d,
    u,
  ]);
  await db.query("INSERT INTO watch_bindings VALUES($1,$3,'iota'),($2,$3,'iota')", [c, d, u]);
  await db.query(
    "INSERT INTO watch_device_agents(device_id,user_id,credential_hash,last_seen,snapshot) VALUES($1,$3,repeat('e',64),now(),'{}'),($2,$3,repeat('f',64),now(),'{}')",
    [c, d, u],
  );
  await owner();
  const result = await call("restart", [a, b, c, d]);
  expect(result[0].items).toHaveLength(4);
  expect(new Set(result[0].items.map((i: any) => i.commandId)).size).toBe(4);
  const failed = result[0].items.find((i: any) => i.deviceId === c).commandId;
  await admin();
  await db.query(
    "UPDATE watch_agent_commands SET status=CASE WHEN device_id=$1 THEN 'failed' ELSE 'done' END,finished_at=now()",
    [c],
  );
  await owner();
  const retry = await call("restart", [c], "12345678-1234-4234-8234-123456789abc");
  expect(retry[0].items).toHaveLength(1);
  expect(retry[0].items[0].deviceId).toBe(c);
  expect(retry[0].items[0].commandId).not.toBe(failed);
  await admin();
  expect(
    (await db.query<{ n: number }>("SELECT count(*)::int n FROM watch_agent_commands")).rows[0]!.n,
  ).toBe(5);
  await db.query("DELETE FROM watch_agent_batches");
  await db.query("DELETE FROM watch_agent_commands");
  await db.query("DELETE FROM watch_device_agents WHERE device_id=ANY($1::uuid[])", [[c, d]]);
  await db.query("DELETE FROM watch_bindings WHERE device_id=ANY($1::uuid[])", [[c, d]]);
  await db.query("DELETE FROM watch_devices WHERE id=ANY($1::uuid[])", [[c, d]]);
});
it("persists exact command IDs and idempotently resumes the same request", async () => {
  const first = await call();
  const retry = await call("restart", [b, a, a]);
  expect(first[0].items).toHaveLength(2);
  expect(retry).toEqual(first);
  await admin();
  expect(
    (await db.query<{ n: number }>("SELECT count(*)::int n FROM watch_agent_commands")).rows[0]!.n,
  ).toBe(2);
  await owner();
  await expect(call("restart", [a])).rejects.toThrow("batch_conflict");
});
it("rejects mixed ownership before enqueueing any command; hides other accounts' batches", async () => {
  await expect(call("restart", [a, foreign])).rejects.toThrow("device_not_found");
  await admin();
  expect(
    (await db.query<{ n: number }>("SELECT count(*)::int n FROM watch_agent_commands")).rows[0]!.n,
  ).toBe(0);
  await owner();
  await call();
  await owner(other);
  expect(await call("list")).toEqual([]);
  await expect(db.query("SELECT * FROM watch_agent_batches")).rejects.toThrow("permission denied");
});
it("skips offline Macs and busy devices without scheduling a delayed restart", async () => {
  await admin();
  await db.query(
    "UPDATE watch_device_agents SET last_seen=now()-interval '61 seconds' WHERE device_id=$1",
    [a],
  );
  await db.query("INSERT INTO watch_agent_commands(device_id,action) VALUES($1,'update')", [b]);
  await owner();
  const result = await call();
  expect(result[0].items.map((i: any) => i.disposition)).toEqual(["offline", "busy"]);
  expect(result[0].items.every((i: any) => i.commandId === null)).toBe(true);
});
it("expires uncompleted commands and never substitutes a later command receipt or exposes logs", async () => {
  const first = await call();
  const command = first[0].items[0].commandId;
  await admin();
  await db.query(
    "UPDATE watch_agent_commands SET expires_at=now()-interval '1 second' WHERE id=$1",
    [command],
  );
  await owner();
  const result = await call("list");
  expect(result[0].items[0].status).toBe("expired");
  expect(JSON.stringify(result)).not.toContain("private fragment");
  await admin();
  await db.query("UPDATE watch_agent_commands SET status='expired' WHERE id=$1", [command]);
  await db.query(
    "INSERT INTO watch_agent_commands(device_id,action,status) VALUES($1,'start','done')",
    [a],
  );
  await owner();
  expect((await call("list"))[0].items[0].status).toBe("expired");
});
it("rejects empty, excessive and arbitrary actions", async () => {
  await expect(call("restart", [])).rejects.toThrow("invalid_targets");
  await expect(call("restart", Array(51).fill(a))).rejects.toThrow("invalid_targets");
  await expect(call("shell")).rejects.toThrow("invalid_action");
});
it("reads the exact Agent acknowledgement after reopening the batch", async () => {
  const submitted = await call();
  const command = submitted[0].items[0].commandId;
  await admin();
  await db.query(
    "UPDATE watch_device_agents SET last_seen=now()-interval '15 seconds' WHERE device_id=$1",
    [a],
  );
  await db.query("SELECT watch_agent_exchange('heartbeat',$1,$2::jsonb)", [
    "a".repeat(64),
    JSON.stringify({ snapshot: { appRunning: true, workerRunning: true } }),
  ]);
  await db.query(
    "UPDATE watch_device_agents SET last_seen=now()-interval '15 seconds' WHERE device_id=$1",
    [a],
  );
  await db.query("SELECT watch_agent_exchange('heartbeat',$1,$2::jsonb)", [
    "a".repeat(64),
    JSON.stringify({
      snapshot: { appRunning: true, workerRunning: true },
      ack: { id: command, success: true },
    }),
  ]);
  await owner();
  const reopened = await call("list");
  expect(reopened[0].items[0]).toMatchObject({
    commandId: command,
    status: "done",
    snapshot: { workerRunning: true },
  });
  expect(reopened[0].items[0].finishedAt).not.toBeNull();
});
it("requires sign in and accepts only paired IOTA targets", async () => {
  await owner("");
  await expect(call()).rejects.toThrow("sign_in_required");
  await admin();
  await db.query("DELETE FROM watch_bindings WHERE device_id=$1", [b]);
  await owner();
  const result = await call();
  expect(result[0].items[1]).toMatchObject({ disposition: "unavailable", commandId: null });
  await admin();
  await db.query("INSERT INTO watch_bindings VALUES($1,$2,'iota')", [b, u]);
});
it("tracks project-level start/stop commands and disables recovery only when a stop is queued", async () => {
  await admin();
  await db.exec("UPDATE watch_device_agents SET recovery_enabled=true");
  await owner();
  const result = await call("stop");
  expect(result[0].action).toBe("stop");
  await expect(call("restart")).rejects.toThrow("batch_conflict");
  await admin();
  expect(
    (
      await db.query<{ recovery_enabled: boolean }>(
        "SELECT recovery_enabled FROM watch_device_agents WHERE device_id=$1",
        [a],
      )
    ).rows[0]!.recovery_enabled,
  ).toBe(false);
  await db.exec(
    "UPDATE watch_agent_commands SET status='done'; UPDATE watch_device_agents SET recovery_enabled=true",
  );
  await owner();
  const start = await call("start", [a], "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee");
  expect(start.find((x: any) => x.id === "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee").action).toBe("start");
  const busy = await call("stop", [a], "ffffffff-ffff-4fff-8fff-ffffffffffff");
  expect(busy.find((x: any) => x.id === "ffffffff-ffff-4fff-8fff-ffffffffffff").items[0].disposition).toBe("busy");
  await admin();
  expect(
    (
      await db.query<{ recovery_enabled: boolean }>(
        "SELECT recovery_enabled FROM watch_device_agents WHERE device_id=$1",
        [a],
      )
    ).rows[0]!.recovery_enabled,
  ).toBe(true);
});
it("requires Pro for every multi-device action but keeps single-device actions free", async () => {
  await admin();
  await db.query("DELETE FROM watch_billing WHERE user_id=$1", [u]);
  await owner();
  for (const action of ["start", "stop", "restart"])
    await expect(call(action)).rejects.toThrow("pro_required");
  await admin();
  expect(
    (await db.query<{ n: number }>("SELECT count(*)::int n FROM watch_agent_commands")).rows[0]!.n,
  ).toBe(0);
  await owner();
  const single = await call("restart", [a, a]);
  expect(single[0].items).toHaveLength(1);
});
it("accepts a current trial and rejects expired or inactive subscriptions", async () => {
  for (const status of ["active", "trialing", "canceled", "past_due"]) {
    await admin();
    await db.query(
      "UPDATE watch_billing SET status=$1,period_end=now()-interval '1 minute' WHERE user_id=$2",
      [status, u],
    );
    await owner();
    await expect(call()).rejects.toThrow("pro_required");
  }
  for (const status of ["canceled", "past_due"]) {
    await admin();
    await db.query(
      "UPDATE watch_billing SET status=$1,period_end=now()+interval '1 day' WHERE user_id=$2",
      [status, u],
    );
    await owner();
    await expect(call()).rejects.toThrow("pro_required");
  }
  await admin();
  await db.query(
    "UPDATE watch_billing SET status='trialing',period_end=now()+interval '1 day' WHERE user_id=$1",
    [u],
  );
  await owner();
  expect((await call())[0].items).toHaveLength(2);
});
it("allows reading and retrying the same existing batch after membership expires without new commands", async () => {
  const first = await call();
  await admin();
  await db.query("UPDATE watch_billing SET period_end=now()-interval '1 minute' WHERE user_id=$1", [
    u,
  ]);
  await owner();
  expect(await call()).toEqual(first);
  expect(await call("list")).toEqual(first);
  await expect(call("restart", [a, b], "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")).rejects.toThrow(
    "pro_required",
  );
});
it("persists optional local miner readings in the device heartbeat", async () => {
  await admin();
  await db.query(
    "UPDATE watch_device_agents SET last_seen=now()-interval '15 seconds' WHERE device_id=$1",
    [a],
  );
  const miner = {
    software: "xmrig",
    project: "xmr",
    bindingId: "11111111-1111-4111-8111-111111111111",
    observedAt: new Date().toISOString(),
    status: "ok",
    hashrate10s: 3240.2,
    hashrate60s: 3200,
    accepted: 100,
    rejected: 3,
    uptime: 123,
  };
  await db.query("SELECT watch_agent_exchange('heartbeat',$1,$2::jsonb)", [
    "a".repeat(64),
    JSON.stringify({ snapshot: { appRunning: true, workerRunning: true, miners: [miner] } }),
  ]);
  await owner();
  const list = (await db.query<{ r: any }>("SELECT watch_agent_owner('list') r")).rows[0]!.r;
  expect(list.find((entry: any) => entry.deviceId === a).snapshot.miners).toEqual([miner]);
});
