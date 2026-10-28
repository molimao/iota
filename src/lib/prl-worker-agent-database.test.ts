import { beforeAll, beforeEach, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
let db: PGlite;
const u = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222";
const wallet = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  a = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  b = "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  foreign = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const lucky = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  kryptex = "ffffffff-ffff-4fff-8fff-ffffffffffff";
async function owner(id = u) {
  await db.exec("RESET ROLE;SET ROLE authenticated");
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]);
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role;CREATE SCHEMA auth;
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 CREATE TABLE watch_devices(id uuid,user_id uuid);
 CREATE TABLE watch_device_agents(device_id uuid,user_id uuid,credential_hash text);
 CREATE TABLE watch_bindings(id uuid DEFAULT gen_random_uuid(),device_id uuid,user_id uuid,project text,identifier text,worker text DEFAULT '',pool text,UNIQUE(user_id,project,identifier,worker,pool));
 CREATE FUNCTION watch_project_device_limit(uuid) RETURNS integer LANGUAGE sql AS $$SELECT 5$$;
 GRANT USAGE ON SCHEMA public,auth TO authenticated,anon;`);
  await db.exec(readFileSync("supabase/migrations/20261028140000_prl_worker_agent.sql", "utf8"));
}, 30000);
beforeEach(async () => {
  await db.exec(
    "RESET ROLE;DELETE FROM watch_bindings;DELETE FROM watch_device_agents;DELETE FROM watch_devices",
  );
  await db.query("INSERT INTO watch_devices VALUES($1,$5),($2,$5),($3,$5),($4,$6)", [
    wallet,
    a,
    b,
    foreign,
    u,
    other,
  ]);
  await db.query(
    "INSERT INTO watch_device_agents VALUES($1,$4,repeat('a',64)),($2,$4,repeat('b',64)),($3,$5,repeat('c',64))",
    [a, b, foreign, u, other],
  );
  await db.query(
    "INSERT INTO watch_bindings(id,device_id,user_id,project,identifier,worker,pool) VALUES($1,$3,$4,'prl','same-wallet','','luckypool'),($2,$3,$4,'prl','same-wallet','','kryptex')",
    [lucky, kryptex, wallet, u],
  );
  await owner();
});
afterAll(async () => db.close());
async function link(source: string, worker: string, device: string) {
  return (
    await db.query<{ id: string }>("SELECT watch_link_prl_worker_agent($1,$2,$3) id", [
      source,
      worker,
      device,
    ])
  ).rows[0]!.id;
}
it("links two Workers independently, retains wallet and reuses an existing link", async () => {
  const one = await link(lucky, "gpu1", a),
    two = await link(lucky, "gpu2", b);
  expect(await link(lucky, "gpu1", a)).toBe(one);
  expect(await link(lucky, "gpu2", a)).toBe(two);
  await db.exec("RESET ROLE");
  const rows = (
    await db.query<{id:string;device_id:string;worker:string}>("SELECT id,device_id,worker FROM watch_bindings WHERE pool='luckypool'")
  ).rows;
  expect(rows).toHaveLength(3);
  expect(rows.find((r) => r.id === lucky)?.device_id).toBe(wallet);
  expect(rows.find((r) => r.id === one)?.device_id).toBe(a);
  expect(rows.find((r) => r.id === two)?.device_id).toBe(a);
});
it("isolates identical wallet and Worker names across pools", async () => {
  const one = await link(lucky, "gpu1", a),
    two = await link(kryptex, "gpu1", b);
  expect(one).not.toBe(two);
  await link(lucky, "gpu1", b);
  await db.exec("RESET ROLE");
  expect(
    (await db.query("SELECT pool,device_id FROM watch_bindings WHERE worker='gpu1' ORDER BY pool"))
      .rows,
  ).toEqual([
    { pool: "kryptex", device_id: b },
    { pool: "luckypool", device_id: b },
  ]);
});
it("rejects foreign source/target, unpaired target, empty Worker and wallet-level linking", async () => {
  await expect(link(lucky, "gpu1", foreign)).rejects.toThrow("agent_not_found");
  await expect(link(lucky, "gpu1", wallet)).rejects.toThrow("agent_not_found");
  await expect(link(lucky, " ", a)).rejects.toThrow("worker_required");
  await expect(db.query("SELECT watch_link_project_agent($1,$2)", [lucky, a])).rejects.toThrow(
    "worker_required",
  );
  await owner(other);
  await expect(link(lucky, "gpu1", foreign)).rejects.toThrow("binding_not_found");
  await db.exec("RESET ROLE;SET ROLE anon");
  await expect(link(lucky, "gpu1", a)).rejects.toThrow("permission denied");
});
it("only sends explicit Worker bindings to the exact device Agent", async () => {
  const one = await link(lucky, "gpu1", a);
  await link(lucky, "gpu2", b);
  await db.exec("RESET ROLE");
  await db.query("UPDATE watch_bindings SET device_id=$1 WHERE id=$2", [a, lucky]);
  await db.exec("SET ROLE service_role");
  const manifest = (
    await db.query<{ value: { id: string; worker: string }[] }>(
      "SELECT watch_agent_binding_manifest(repeat('a',64)) value",
    )
  ).rows[0]!.value;
  expect(manifest).toHaveLength(1);
  expect(manifest[0]).toMatchObject({ id: one, worker: "gpu1" });
  await db.exec("RESET ROLE;SET ROLE authenticated");
  await expect(db.query("SELECT watch_agent_binding_manifest(repeat('a',64))")).rejects.toThrow(
    "permission denied",
  );
});
it("enforces the project device quota", async () => {
  await db.exec("RESET ROLE");
  await db.query(
    "INSERT INTO watch_bindings(device_id,user_id,project,identifier,worker,pool) SELECT md5(i::text)::uuid,$1,'prl','wallet-'||i,'','luckypool' FROM generate_series(1,4)i",
    [u],
  );
  await owner();
  await expect(link(lucky, "gpu1", a)).rejects.toThrow("project_device_limit_reached");
});
