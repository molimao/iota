import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

it("shares one wallet only with opted-in devices of its Pro owner and gates mining on acknowledgement", async () => {
  const db = new PGlite();
  const user = "11111111-1111-4111-8111-111111111111",
    other = "22222222-2222-4222-8222-222222222222";
  const source = "33333333-3333-4333-8333-333333333333",
    target = "44444444-4444-4444-8444-444444444444";
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role; CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT current_setting('request.jwt.claim.sub',true)::uuid$$;
    CREATE TABLE auth.users(id uuid PRIMARY KEY);
    CREATE TABLE watch_device_agents(device_id uuid PRIMARY KEY,user_id uuid,credential_hash text,snapshot jsonb,last_seen timestamptz DEFAULT now());
    CREATE TABLE watch_billing(user_id uuid PRIMARY KEY,status text,period_end timestamptz);`);
    for (const path of ["20261114120000_agent_idle_xds.sql", "20261114150000_xds_wallet_sync.sql"])
      await db.exec(readFileSync(`supabase/migrations/${path}`, "utf8"));
    await db.query("INSERT INTO auth.users VALUES($1),($2)", [user, other]);
    await db.query(
      `INSERT INTO watch_device_agents(device_id,user_id,credential_hash,snapshot) VALUES($1,$3,'source','{"platform":"darwin","idleXds":{"state":"setup"}}'),($2,$3,'target','{"platform":"darwin","idleXds":{"state":"setup"}}'),($4,$4,'other','{"platform":"darwin"}')`,
      [source, target, user, other],
    );
    const exchange = async (hash: string, payload: unknown) =>
      (
        await db.query<{ v: any }>("SELECT watch_xds_wallet_agent($1,$2) v", [
          hash,
          JSON.stringify(payload),
        ])
      ).rows[0]!.v;
    expect(await exchange("source", { action: "available", publicKey: "source key" })).toBe(false);
    await exchange("target", { action: "available", publicKey: "target key" });
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [user]);
    const config = {
      consent: true,
      devices: [
        { deviceId: source, threads: 2 },
        { deviceId: target, threads: 1 },
      ],
    };
    const save = (settings: unknown) =>
      db.query("SELECT watch_xds_wallet_settings($1) v", [JSON.stringify(settings)]);
    await expect(save(config)).rejects.toThrow("pro_required");
    await db.query("INSERT INTO watch_billing VALUES($1,'trialing',now()+interval '1 hour')", [
      user,
    ]);
    await expect(save({ ...config, consent: false })).rejects.toThrow("wallet_consent_required");
    await expect(save({ ...config, devices: [{ deviceId: other, threads: 1 }] })).rejects.toThrow(
      "device_not_available",
    );
    const value = (await save(config)).rows[0] as any;
    const walletId = value.v.wallet.id;
    const lease = async (hash: string) =>
      (await db.query("SELECT watch_idle_xds_lease($1) v", [hash])).rows[0];
    expect(await lease("target")).toEqual({ v: null });
    const job = await exchange("source", { action: "poll", publicKey: "source key" });
    expect(job.kind).toBe("source");
    expect(job.recipients).toEqual([{ deviceId: target, publicKey: "target key" }]);
    expect(await exchange("target", { action: "poll", publicKey: "target key" })).toBeNull();
    await expect(
      exchange("target", { action: "source", walletId, address: "disc1wrong", envelopes: [] }),
    ).rejects.toThrow("unauthorized");
    const packet = { key: "encrypted", iv: "iv", data: "ciphertext", tag: "tag" };
    await exchange("source", {
      action: "source",
      walletId,
      address: "disc1shared",
      envelopes: [
        { deviceId: target, publicKey: "target key", packet },
        { deviceId: other, publicKey: "other key", packet },
      ],
    });
    expect(await exchange("target", { action: "poll", publicKey: "target key" })).toMatchObject({
      kind: "receive",
      walletId,
      address: "disc1shared",
      packet,
    });
    await expect(
      exchange("target", {
        action: "received",
        walletId,
        address: "disc1wrong",
        publicKey: "target key",
      }),
    ).rejects.toThrow("unauthorized");
    await exchange("target", {
      action: "received",
      walletId,
      address: "disc1shared",
      publicKey: "target key",
    });
    await db.query(
      `UPDATE watch_device_agents SET snapshot='{"platform":"darwin","idleXds":{"state":"off"}}' WHERE device_id=$1`,
      [target],
    );
    expect(await lease("target")).toMatchObject({ v: { settings: { threads: 1 } } });
    await db.query("SELECT watch_xds_wallet_settings(NULL,'browser backup key')");
    expect(
      (await exchange("source", { action: "poll", publicKey: "source key" })).backup.publicKey,
    ).toBe("browser backup key");
    await db.exec("SET ROLE authenticated");
    await expect(exchange("source", { action: "poll", publicKey: "source key" })).rejects.toThrow(
      "permission denied",
    );
    await db.exec("RESET ROLE");
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [other]);
    const strangers = (await db.query<{ v: any }>("SELECT watch_xds_wallet_settings() v")).rows[0]!
      .v;
    expect(strangers.wallet).toBeNull();
    expect(JSON.stringify(strangers)).not.toContain("ciphertext");
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [user]);
    await save({ ...config, devices: [{ deviceId: target, threads: 0 }] });
    expect(await lease("target")).toEqual({ v: null });
    await db.query("UPDATE watch_billing SET period_end=now()-interval '1 second'");
    expect(await exchange("source", { action: "poll", publicKey: "source key" })).toMatchObject({ kind: "source", recipients: [], backup: { publicKey: "browser backup key" } });
    expect(await lease("source")).toEqual({ v: null });
    await db.query("SELECT watch_xds_wallet_settings(NULL,'backup after Pro expiry')");
  } finally {
    await db.close();
  }
});
