import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";
import { idleXdsConfig, idleXdsLease } from "./idle-xds";

it("keeps XDS off until a Pro owner opts in, independently of BNT", async () => {
  const db = new PGlite();
  const owner = "11111111-1111-4111-8111-111111111111";
  const other = "22222222-2222-4222-8222-222222222222";
  const settings = idleXdsConfig.parse({ devices: [{ deviceId: owner, threads: 2 }] });
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE SCHEMA auth;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT current_setting('request.jwt.claim.sub',true)::uuid $$;
      CREATE TABLE watch_device_agents(device_id uuid PRIMARY KEY,user_id uuid,credential_hash text,snapshot jsonb);
      CREATE TABLE watch_billing(user_id uuid PRIMARY KEY,status text,period_end timestamptz);`);
    await db.exec(readFileSync("supabase/migrations/20261114120000_agent_idle_xds.sql", "utf8"));
    await db.query(
      `INSERT INTO watch_device_agents VALUES
      ($1,$1,'owner','{"platform":"darwin","idleXds":{"state":"off"}}'),
      ($2,$2,'other','{"platform":"darwin","idleXds":{"state":"off"}}')`,
      [owner, other],
    );
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [owner]);
    const read = async () => (await db.query("SELECT watch_idle_xds_settings() value")).rows[0];
    const save = (devices = settings.devices) =>
      db.query("SELECT watch_idle_xds_settings($1)", [JSON.stringify({ devices })]);
    const lease = async () =>
      (await db.query<{ value: unknown }>("SELECT watch_idle_xds_lease('owner') value")).rows[0]!
        .value;
    expect(await read()).toEqual({ value: { devices: [] } });
    expect(await lease()).toBeNull();
    await expect(save()).rejects.toThrow("pro_required");
    await db.query("INSERT INTO watch_billing VALUES ($1,'trialing',now()+interval '1 hour')", [
      owner,
    ]);
    await expect(save([{ deviceId: other, threads: 2 }])).rejects.toThrow("device_not_available");
    await expect(save([{ deviceId: owner, threads: 5 }])).rejects.toThrow("invalid_threads");
    await save();
    expect(idleXdsLease.parse(await lease()).settings.threads).toBe(2);
    await db.exec("SET ROLE anon");
    await expect(read()).rejects.toThrow("permission denied");
    await expect(lease()).rejects.toThrow("permission denied");
    await db.exec("RESET ROLE");
    await db.query(
      'UPDATE watch_device_agents SET snapshot=\'{"platform":"darwin","idleXds":{"state":"setup"}}\' WHERE device_id=$1',
      [owner],
    );
    expect(await lease()).toBeNull();
    await expect(save()).rejects.toThrow("device_not_available");
    await save([{ deviceId: owner, threads: 0 }]);
    expect(await read()).toEqual({ value: { devices: [] } });
    await db.query(
      'UPDATE watch_device_agents SET snapshot=\'{"platform":"darwin","idleXds":{"state":"off"}}\' WHERE device_id=$1',
      [owner],
    );
    await save();
    await db.query("UPDATE watch_billing SET period_end=now()-interval '1 second'");
    expect(await lease()).toBeNull();
  } finally {
    await db.close();
  }
});
