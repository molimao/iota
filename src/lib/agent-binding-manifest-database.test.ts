import { beforeAll, afterAll, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { agentBindingManifest, agentBeat } from "./device-agent";
let db: PGlite;
const device = "11111111-1111-4111-8111-111111111111",
  another = "22222222-2222-4222-8222-222222222222",
  foreign = "33333333-3333-4333-8333-333333333333";
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role;
  CREATE TABLE watch_device_agents(device_id uuid,user_id uuid,credential_hash text);
  CREATE TABLE watch_bindings(id uuid DEFAULT gen_random_uuid(),device_id uuid,user_id uuid,project text,identifier text,worker text DEFAULT '');`);
  await db.query(
    "INSERT INTO watch_device_agents VALUES($1,$1,repeat('a',64)),($2,$1,repeat('b',64)),($3,$3,repeat('c',64))",
    [device, another, foreign],
  );
  await db.query(
    "INSERT INTO watch_bindings(device_id,user_id,project,identifier) VALUES($1,$1,'bnt','owner-public-wallet'),($1,$1,'iota','iota-miner'),($2,$1,'prl','other-device-wallet'),($3,$3,'noid','another-users-wallet')",
    [device, another, foreign],
  );
  await db.exec("UPDATE watch_bindings SET worker='worker-A' WHERE project='bnt'");
  await db.exec(
    readFileSync("supabase/migrations/20261026180000_agent_binding_manifest.sql", "utf8"),
  );
}, 30000);
afterAll(async () => db.close());
it("returns only explicitly bound supported projects for the credential's exact device", async () => {
  await db.exec("SET ROLE service_role");
  const value = (
    await db.query<{ r: unknown }>("SELECT watch_agent_binding_manifest(repeat('a',64)) r")
  ).rows[0]!.r;
  const parsed = agentBindingManifest.parse(value);
  expect(parsed).toHaveLength(1);
  expect(parsed[0]).toMatchObject({ project: "bnt", identifier: "owner-public-wallet" });
  expect(JSON.stringify(value)).not.toMatch(
    /other-device-wallet|another-users-wallet|credential|iota-miner/,
  );
});
it("never sends a wallet-wide BNT binding to an Agent", async () => {
  await db.exec("RESET ROLE");
  await db.query("INSERT INTO watch_bindings(device_id,user_id,project,identifier,worker) VALUES($1,$1,'bnt','wallet-without-worker','')", [device]);
  await db.exec("SET ROLE service_role");
  const rows=agentBindingManifest.parse((await db.query<{r:unknown}>("SELECT watch_agent_binding_manifest(repeat('a',64)) r")).rows[0]!.r);
  expect(rows.some(b=>b.identifier==='wallet-without-worker')).toBe(false);
  expect(rows.every(b=>b.project!=='bnt' || !!b.worker)).toBe(true);
});
it("denies browser roles and invalid credentials", async () => {
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`RESET ROLE;SET ROLE ${role}`);
    await expect(db.query("SELECT watch_agent_binding_manifest(repeat('a',64))")).rejects.toThrow(
      "permission denied",
    );
  }
  await db.exec("RESET ROLE;SET ROLE service_role");
  await expect(db.query("SELECT watch_agent_binding_manifest(repeat('z',64))")).rejects.toThrow(
    "unauthorized",
  );
});
it("stops returning a project immediately after its binding is removed", async () => {
  await db.exec("RESET ROLE");
  await db.query("DELETE FROM watch_bindings WHERE device_id=$1 AND project='bnt'", [device]);
  await db.exec("SET ROLE service_role");
  expect(
    (await db.query<{ r: unknown }>("SELECT watch_agent_binding_manifest(repeat('a',64)) r"))
      .rows[0]!.r,
  ).toEqual([]);
});
it("accepts only a bounded read-only binding manifest and opt-in heartbeat flag", () => {
  expect(
    agentBindingManifest.safeParse([
      { id: device, project: "bnt", identifier: "address", worker: "", command: "restart" },
    ]).success,
  ).toBe(false);
  expect(
    agentBindingManifest.safeParse(
      Array(9).fill({ id: device, project: "bnt", identifier: "address", worker: "" }),
    ).success,
  ).toBe(false);
  expect(agentBeat.shape.requestBindings.safeParse(true).success).toBe(true);
  expect(agentBeat.shape.requestBindings.safeParse(false).success).toBe(false);
});
