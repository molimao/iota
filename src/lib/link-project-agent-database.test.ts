import { beforeAll, beforeEach, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
let db: PGlite;
const u = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222",
  source = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  target = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  foreign = "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  binding = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
async function owner(id = u) {
  await db.exec("RESET ROLE;SET ROLE authenticated");
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]);
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;
  CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
  CREATE TABLE watch_devices(id uuid,user_id uuid);
  CREATE TABLE watch_device_agents(device_id uuid,user_id uuid);
  CREATE TABLE watch_bindings(id uuid DEFAULT gen_random_uuid(),device_id uuid,user_id uuid,project text,identifier text,worker text DEFAULT '',pool text);
  CREATE FUNCTION watch_project_device_limit(uuid) RETURNS integer LANGUAGE sql AS $$SELECT 5$$;
  GRANT USAGE ON SCHEMA public,auth TO authenticated,anon;`);
  await db.exec(readFileSync("supabase/migrations/20261026190000_link_project_agent.sql", "utf8"));
  await db.exec(
    readFileSync("supabase/migrations/20261026200000_link_bnt_worker_agent.sql", "utf8"),
  );
}, 30000);
beforeEach(async () => {
  await db.exec(
    "RESET ROLE;DELETE FROM watch_bindings;DELETE FROM watch_device_agents;DELETE FROM watch_devices",
  );
  await db.query("INSERT INTO watch_devices VALUES($1,$4),($2,$4),($3,$5)", [
    source,
    target,
    foreign,
    u,
    other,
  ]);
  await db.query("INSERT INTO watch_device_agents VALUES($1,$3),($2,$4)", [
    target,
    foreign,
    u,
    other,
  ]);
  await db.query(
    "INSERT INTO watch_bindings(id,device_id,user_id,project,identifier,worker,pool) VALUES($1,$2,$3,'bnt','saved-wallet','worker-A','bntpool')",
    [binding, source, u],
  );
  await db.query(
    "INSERT INTO watch_bindings(device_id,user_id,project,identifier) VALUES($1,$2,'prl','keep-this-project')",
    [source, u],
  );
  await owner();
});
afterAll(async () => db.close());
it("moves only the chosen project binding and preserves address, pool, worker and source device", async () => {
  await db.query("SELECT watch_link_project_agent($1,$2)", [binding, target]);
  await db.exec("RESET ROLE");
  expect(
    (await db.query("SELECT * FROM watch_bindings WHERE id=$1", [binding])).rows[0],
  ).toMatchObject({
    id: binding,
    device_id: target,
    identifier: "saved-wallet",
    worker: "worker-A",
    pool: "bntpool",
  });
  expect(
    (await db.query("SELECT device_id FROM watch_bindings WHERE project='prl'")).rows[0],
  ).toMatchObject({ device_id: source });
  expect((await db.query("SELECT id FROM watch_devices WHERE id=$1", [source])).rows).toHaveLength(
    1,
  );
});
it("rejects another user's Agent and another user's binding without changing anything", async () => {
  await expect(
    db.query("SELECT watch_link_project_agent($1,$2)", [binding, foreign]),
  ).rejects.toThrow("agent_not_found");
  await owner(other);
  await expect(
    db.query("SELECT watch_link_project_agent($1,$2)", [binding, foreign]),
  ).rejects.toThrow("binding_not_found");
  await db.exec("RESET ROLE");
  expect(
    (await db.query("SELECT device_id FROM watch_bindings WHERE id=$1", [binding])).rows[0],
  ).toMatchObject({ device_id: source });
});
it("does not allow linking to bypass a project's five-device quota", async () => {
  await db.exec("RESET ROLE");
  await db.query(
    "INSERT INTO watch_bindings(device_id,user_id,project,identifier) SELECT md5(i::text)::uuid,$1,'bnt','other-'||i FROM generate_series(1,4) i",
    [u],
  );
  await db.query(
    "INSERT INTO watch_bindings(device_id,user_id,project,identifier) VALUES($1,$2,'bnt','another-worker-on-source')",
    [source, u],
  );
  await owner();
  await expect(
    db.query("SELECT watch_link_project_agent($1,$2)", [binding, target]),
  ).rejects.toThrow("project_device_limit_reached");
});
it("links two Workers under one wallet to different computers without moving the wallet or either sibling", async () => {
  await db.exec("RESET ROLE");
  await db.query("INSERT INTO watch_device_agents VALUES($1,$2)", [source, u]);
  const wallet = (
    await db.query<{ id: string }>(
      "INSERT INTO watch_bindings(device_id,user_id,project,identifier,worker,pool) VALUES($1,$2,'bnt','saved-wallet','','bntpool') RETURNING id",
      [source, u],
    )
  ).rows[0]!.id;
  await owner();
  await db.query("SELECT watch_link_bnt_worker_agent($1,'worker-A',$2)", [wallet, target]);
  const workerB = (
    await db.query<{ id: string }>("SELECT watch_link_bnt_worker_agent($1,'worker-B',$2) id", [
      wallet,
      source,
    ])
  ).rows[0]!.id;
  // Retrying the same link does not add a second record.
  expect(
    (
      await db.query<{ id: string }>("SELECT watch_link_bnt_worker_agent($1,'worker-B',$2) id", [
        wallet,
        source,
      ])
    ).rows[0]!.id,
  ).toBe(workerB);
  await db.exec("RESET ROLE");
  const records = (
    await db.query(
      "SELECT id,device_id,worker,pool FROM watch_bindings WHERE project='bnt' ORDER BY worker",
    )
  ).rows;
  expect(records).toHaveLength(3);
  expect(records).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: wallet, device_id: source, worker: "", pool: "bntpool" }),
      expect.objectContaining({ id: binding, device_id: target, worker: "worker-A" }),
      expect.objectContaining({ id: workerB, device_id: source, worker: "worker-B" }),
    ]),
  );
});
it("rejects wallet-level BNT association, blank Workers, foreign Agents and foreign source wallets", async () => {
  await db.exec("RESET ROLE");
  const wallet = (
    await db.query<{ id: string }>(
      "INSERT INTO watch_bindings(device_id,user_id,project,identifier,worker) VALUES($1,$2,'bnt','saved-wallet','') RETURNING id",
      [source, u],
    )
  ).rows[0]!.id;
  await owner();
  await expect(
    db.query("SELECT watch_link_project_agent($1,$2)", [wallet, target]),
  ).rejects.toThrow("worker_required");
  await expect(
    db.query("SELECT watch_link_bnt_worker_agent($1,'  ',$2)", [wallet, target]),
  ).rejects.toThrow("worker_required");
  await expect(
    db.query("SELECT watch_link_bnt_worker_agent($1,'worker-B',$2)", [wallet, foreign]),
  ).rejects.toThrow("agent_not_found");
  await expect(
    db.query("SELECT watch_link_bnt_worker_agent($1,'worker-B',$2)", [binding, target]),
  ).rejects.toThrow("binding_not_found");
  await owner(other);
  await expect(
    db.query("SELECT watch_link_bnt_worker_agent($1,'worker-B',$2)", [wallet, foreign]),
  ).rejects.toThrow("binding_not_found");
});
it("enforces the project quota when a Worker is first associated", async () => {
  await db.exec("RESET ROLE");
  await db.query(
    "INSERT INTO watch_bindings(device_id,user_id,project,identifier) SELECT md5(i::text)::uuid,$1,'bnt','other-'||i FROM generate_series(1,4) i",
    [u],
  );
  const wallet = (
    await db.query<{ id: string }>(
      "INSERT INTO watch_bindings(device_id,user_id,project,identifier,worker) VALUES($1,$2,'bnt','saved-wallet','') RETURNING id",
      [source, u],
    )
  ).rows[0]!.id;
  await owner();
  await expect(
    db.query("SELECT watch_link_bnt_worker_agent($1,'worker-B',$2)", [wallet, target]),
  ).rejects.toThrow("project_device_limit_reached");
});
