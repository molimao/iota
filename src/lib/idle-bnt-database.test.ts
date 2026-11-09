import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";
import { idleBntConfig, idleBntLeaseSettings } from "./idle-bnt";
import { base58 } from "@scure/base";
import { sha3_256 } from "@noble/hashes/sha3.js";

it("shares one BNT wallet while enforcing each device's threads, ownership and Pro access", async () => {
  const db = new PGlite();
  const owner = "11111111-1111-4111-8111-111111111111";
  const other = "22222222-2222-4222-8222-222222222222";
  const second = "33333333-3333-4333-8333-333333333333";
  const wallet = (n: number) => {
    const payload = new Uint8Array(64).fill(n);
    const tag = new TextEncoder().encode("blocknet_stealth_address_checksumblocknet_mainnet");
    const checksum = sha3_256(new Uint8Array([...tag, ...payload])).slice(0, 4);
    return base58.encode(new Uint8Array([...payload, ...checksum]));
  };
  const settings = idleBntConfig.parse({
    address: wallet(9),
    devices: [
      { deviceId: owner, threads: 1 },
      { deviceId: second, threads: 4 },
    ],
  });
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE SCHEMA auth;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS
        $$ SELECT current_setting('request.jwt.claim.sub',true)::uuid $$;
      CREATE TABLE auth.users(id uuid PRIMARY KEY);
      CREATE TABLE watch_device_agents(device_id uuid PRIMARY KEY,user_id uuid,credential_hash text,snapshot jsonb);
      CREATE TABLE watch_billing(user_id uuid PRIMARY KEY,status text,period_end timestamptz);
    `);
    await db.exec(readFileSync("supabase/migrations/20261109170000_agent_idle_bnt.sql", "utf8"));
    await db.query("INSERT INTO auth.users VALUES ($1),($2)", [owner, other]);
    await db.query(
      "INSERT INTO watch_device_agents VALUES ($1,$1,'owner','{\"idleBnt\":{}}'),($2,$2,'other','{\"idleBnt\":{}}'),($3,$1,'second','{\"idleBnt\":{}}')",
      [owner, other, second],
    );
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [owner]);
    await db.exec("SET ROLE authenticated");
    const save = (value: typeof settings) =>
      db.query("SELECT watch_idle_bnt_settings($1) value", [JSON.stringify(value)]);
    const read = async () => (await db.query("SELECT watch_idle_bnt_settings() value")).rows[0];
    expect(await read()).toMatchObject({ value: { address: "", devices: [] } });
    await expect(save(settings)).rejects.toThrow("pro_required");
    await expect(db.query("SELECT watch_idle_bnt_lease('owner')")).rejects.toThrow(
      "permission denied",
    );
    await db.exec("RESET ROLE");
    await db.query("INSERT INTO watch_billing VALUES ($1,'trialing',now()+interval '25 seconds')", [
      owner,
    ]);
    await db.exec("SET ROLE authenticated");
    await expect(save({ ...settings, devices: [{ deviceId: other, threads: 2 }] })).rejects.toThrow(
      "device_not_available",
    );
    await expect(save({ ...settings, devices: [{ deviceId: owner, threads: 5 }] })).rejects.toThrow(
      "invalid_threads",
    );
    expect(await read()).toMatchObject({ value: { address: "", devices: [] } });
    await save(settings);
    await db.exec("RESET ROLE; SET ROLE service_role");
    const lease = async (credential: string) =>
      (
        await db.query<{ value: { worker: string; seconds: number; settings: unknown } | null }>(
          "SELECT watch_idle_bnt_lease($1) value",
          [credential],
        )
      ).rows[0]!.value;
    expect(await lease("other")).toBeNull();
    const first = await lease("owner");
    expect(first?.worker).toBe("iota-111111111111");
    expect(first?.seconds).toBeGreaterThan(0);
    expect(first?.seconds).toBeLessThanOrEqual(25);
    expect(idleBntLeaseSettings.parse(first?.settings)).toMatchObject({
      address: settings.address,
      threads: 1,
      whenQueued: true,
      whenPaused: true,
    });
    expect(idleBntLeaseSettings.parse((await lease("second"))?.settings)).toMatchObject({
      address: settings.address,
      threads: 4,
    });
    await db.exec("RESET ROLE; SET ROLE authenticated");
    await save({ address: wallet(10), devices: [{ deviceId: owner, threads: 0 }] });
    await db.exec("RESET ROLE; SET ROLE service_role");
    expect(await lease("owner")).toBeNull();
    expect(idleBntLeaseSettings.parse((await lease("second"))?.settings)).toMatchObject({
      address: wallet(10),
      threads: 4,
    });
    await db.exec("RESET ROLE; UPDATE watch_billing SET period_end=now(); SET ROLE service_role");
    expect(await lease("second")).toBeNull();
  } finally {
    await db.close();
  }
}, 30000);
