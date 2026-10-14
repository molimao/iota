import { beforeAll, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
let db: PGlite;
const u = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222";
let device: string;
async function owner(id: string) {
  await db.exec("RESET ROLE; SET ROLE authenticated");
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]);
}
async function admin() {
  await db.exec("RESET ROLE; SET ROLE service_role");
}
const own = (action: string, payload: object = {}) =>
  db.query<{ r: unknown }>("SELECT watch_agent_owner($1,$2,$3::jsonb) AS r", [
    action,
    device,
    JSON.stringify(payload),
  ]);
const exchange = (action: string, hash: string, payload: object) =>
  db.query<{ r: unknown }>("SELECT watch_agent_exchange($1,$2,$3::jsonb) AS r", [
    action,
    hash,
    JSON.stringify(payload),
  ]);
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; GRANT USAGE ON SCHEMA public,auth TO authenticated,service_role,anon;",
  );
  await db.query("INSERT INTO auth.users VALUES($1),($2)", [u, other]);
  await db.exec(
    readFileSync(
      "supabase/migrations/20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql",
      "utf8",
    ),
  );
  await db.exec(readFileSync("supabase/migrations/20261005130000_fleet_and_billing.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261014210000_device_agents.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/20261014230000_agent_updates.sql", "utf8"));
  const r = await db.query<{ id: string }>(
    "INSERT INTO watch_devices(user_id,name) VALUES($1,'Test Mac') RETURNING id",
    [u],
  );
  device = r.rows[0]!.id;
  await db.query(
    "INSERT INTO watch_bindings(user_id,device_id,project,identifier) VALUES($1,$2,'iota','public-test-id')",
    [u, device],
  );
}, 30000);
afterAll(async () => db.close());
it("binds a one-use pairing to its owner and never returns credential hashes", async () => {
  await owner(other);
  await expect(own("pair", { hash: "a".repeat(64) })).rejects.toThrow("device_not_found");
  await owner(u);
  await own("pair", { hash: "a".repeat(64) });
  await expect(
    exchange("pair", "a".repeat(64), { credentialHash: "b".repeat(64) }),
  ).rejects.toThrow("permission denied");
  await admin();
  await exchange("pair", "a".repeat(64), { credentialHash: "b".repeat(64) });
  await expect(
    exchange("pair", "a".repeat(64), { credentialHash: "c".repeat(64) }),
  ).rejects.toThrow("unauthorized");
  await owner(u);
  const list = JSON.stringify((await own("list")).rows);
  expect(list).not.toContain("credential");
  expect(list).not.toContain("b".repeat(64));
  await owner(other);
  expect((await own("list")).rows[0]!.r).toEqual([]);
});
it("accepts basic status without logs; free accounts can enable logs and recovery", async () => {
  await admin();
  await exchange("heartbeat", "b".repeat(64), {
    snapshot: { appRunning: true, logs: "not opted in" },
  });
  await owner(u);
  expect(JSON.stringify((await own("list")).rows)).not.toContain("not opted in");
  await own("settings", { logs: true, recovery: true });
});
it("rejects arbitrary commands, keeps one pending action, claims once and verifies acknowledgements", async () => {
  await owner(u);
  await expect(own("shell", { command: "rm -rf /" })).rejects.toThrow("invalid_action");
  const queued = (await own("restart")).rows[0]!.r as { id: string };
  await expect(own("start")).rejects.toThrow("unique constraint");
  await admin();
  await db.query("UPDATE watch_device_agents SET last_seen=now()-interval '15 seconds'");
  const beat = (await exchange("heartbeat", "b".repeat(64), { snapshot: { appRunning: true } }))
    .rows[0]!.r as { command: { id: string; action: string } };
  expect(beat.command).toMatchObject({ id: queued.id, action: "restart" });
  await db.query("UPDATE watch_device_agents SET last_seen=now()-interval '15 seconds'");
  const next = (
    await exchange("heartbeat", "b".repeat(64), {
      snapshot: { appRunning: true },
      ack: { id: queued.id, success: true },
    })
  ).rows[0]!.r as { command: unknown };
  expect(next.command).toBeNull();
  await owner(u);
  expect(JSON.stringify((await own("list")).rows)).toContain('"done"');
});
it("manual stop disables recovery; offline commands fail and revocation rejects the old credential", async () => {
  await owner(u);
  await own("stop");
  expect(JSON.stringify((await own("list")).rows)).toContain('"recoveryEnabled":false');
  await admin();
  await db.query("UPDATE watch_device_agents SET last_seen=now()-interval '2 minutes'");
  await owner(u);
  await expect(own("restart")).rejects.toThrow("agent_offline");
  await own("revoke");
  await admin();
  await expect(
    exchange("heartbeat", "b".repeat(64), { snapshot: { appRunning: true } }),
  ).rejects.toThrow("unauthorized");
});

it("expires unused pairing codes and rate-limits device heartbeats", async () => {
  await owner(u);
  await own("pair", { hash: "d".repeat(64) });
  await admin();
  await db.query("UPDATE watch_agent_pairs SET expires_at=now()-interval '1 second'");
  await expect(
    exchange("pair", "d".repeat(64), { credentialHash: "e".repeat(64) }),
  ).rejects.toThrow("unauthorized");
  await owner(u);
  await own("pair", { hash: "d".repeat(64) });
  await admin();
  await exchange("pair", "d".repeat(64), { credentialHash: "e".repeat(64) });
  await exchange("heartbeat", "e".repeat(64), { snapshot: { appRunning: true } });
  await expect(
    exchange("heartbeat", "e".repeat(64), { snapshot: { appRunning: true } }),
  ).rejects.toThrow("rate_limited");
});

it("requires an update-capable agent and owner identity", async () => {
  await admin();
  await db.query(
    "UPDATE watch_agent_commands SET status='expired' WHERE status IN ('queued','claimed')",
  );
  await db.query(`UPDATE watch_device_agents SET last_seen=now(), snapshot='{"version":"1.0.1"}'`);
  await owner(u);
  await expect(own("update")).rejects.toThrow("manual_agent_upgrade_required");
  await admin();
  await db.query(`UPDATE watch_device_agents SET snapshot='{"version":"1.0.2"}'`);
  await owner(other);
  await expect(own("update")).rejects.toThrow("device_not_found");
  await owner(u);
  expect((await own("update")).rows[0]!.r).toHaveProperty("id");
});
