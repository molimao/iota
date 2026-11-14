import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

it("wakes only the owner's agents and separates connection probes from snapshots", async () => {
  const db = new PGlite();
  const owner = "11111111-1111-4111-8111-111111111111";
  const other = "22222222-2222-4222-8222-222222222222";
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT current_setting('request.jwt.claim.sub',true)::uuid $$;
      CREATE TABLE watch_device_agents(device_id uuid PRIMARY KEY,user_id uuid,credential_hash text,last_seen timestamptz,snapshot jsonb,logs_enabled boolean DEFAULT false,recovery_enabled boolean DEFAULT false);
      CREATE TABLE watch_agent_commands(device_id uuid,status text,expires_at timestamptz);
      CREATE FUNCTION watch_agent_owner(p_action text,p_device uuid DEFAULT NULL,p_payload jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE sql AS $$
        SELECT coalesce(jsonb_agg(jsonb_build_object('deviceId',device_id,'lastSeen',last_seen,'snapshot',snapshot)),'[]') FROM watch_device_agents WHERE user_id=auth.uid() $$;`);
    await db.exec(readFileSync("supabase/migrations/20261114190000_agent_adaptive_reporting.sql", "utf8"));
    for (const id of [owner, other]) {
      await db.query("INSERT INTO auth.users VALUES($1)", [id]);
      await db.query("INSERT INTO watch_device_agents(device_id,user_id,credential_hash,last_seen,snapshot) VALUES($1::uuid,$1::uuid,$1::text,now()-interval '2 minutes','{\"version\":\"old\"}')",[id]);
    }
    const probe = async (id=owner) => (await db.query<{v:{active:boolean}}>("SELECT watch_agent_probe($1) v",[id])).rows[0]!.v;
    await expect(probe("unknown")).rejects.toThrow("unauthorized");
    expect(await probe()).toEqual({active:false});
    const stored = (await db.query<{fresh:boolean;snapshot:unknown}>("SELECT last_seen<now()-interval '1 minute' fresh,snapshot FROM watch_device_agents WHERE device_id=$1",[owner])).rows[0]!;
    expect(stored).toEqual({fresh:true,snapshot:{version:"old"}});
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[owner]);
    const listed = (await db.query<{v:{lastSeen:string}[]}>("SELECT watch_agent_owner('list',NULL,'{\"watching\":true}') v")).rows[0]!.v;
    expect(Date.now()-Date.parse(listed[0]!.lastSeen)).toBeLessThan(10000);
    expect(await probe()).toEqual({active:true});
    expect(await probe(other)).toEqual({active:false});
    await db.exec("UPDATE watch_agent_viewers SET until_at=now()-interval '1 second'");
    expect(await probe()).toEqual({active:false});
    await db.query("INSERT INTO watch_agent_commands VALUES($1,'queued',now()+interval '1 minute')",[owner]);
    expect(await probe()).toEqual({active:true});
    await db.exec("UPDATE watch_agent_commands SET status='finished'");
    expect(await probe()).toEqual({active:false});
    await db.query("UPDATE watch_device_agents SET recovery_enabled=true WHERE device_id=$1",[owner]);
    expect(await probe()).toEqual({active:true});
    await db.exec("SET ROLE authenticated");
    await expect(probe()).rejects.toThrow("permission denied");
  } finally { await db.close(); }
});
