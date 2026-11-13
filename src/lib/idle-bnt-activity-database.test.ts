import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";
import { agentHistoryPointSchema } from "./device-agent";
it("captures sanitized idle status and exposes only the authenticated owner history", async () => {
  const db = new PGlite();
  const owner = "11111111-1111-4111-8111-111111111111",
    other = "22222222-2222-4222-8222-222222222222";
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY);
   CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT current_setting('request.jwt.claim.sub',true)::uuid $$;
   CREATE TABLE watch_device_agents(device_id uuid PRIMARY KEY,user_id uuid,last_seen timestamptz,snapshot jsonb);`);
    await db.exec(readFileSync("supabase/migrations/20261017160000_agent_history.sql", "utf8"));
    await db.exec(readFileSync("supabase/migrations/20261113120000_idle_bnt_activity.sql", "utf8"));
    await db.query("INSERT INTO auth.users VALUES($1),($2)", [owner, other]);
    const snapshot = JSON.stringify({
      appRunning: true,
      workerRunning: true,
      idleBnt: { state: "mining", hashrate: 2.82, secret: "not retained" },
    });
    await db.query("INSERT INTO watch_device_agents VALUES($1,$1,now(),$3),($2,$2,now(),$3)", [
      owner,
      other,
      snapshot,
    ]);
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [owner]);
    await db.exec("SET ROLE authenticated");
    const rows = (
      await db.query<{ value: { deviceId: string; state: string }[] }>(
        "SELECT watch_idle_bnt_activity() value",
      )
    ).rows[0]!.value;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ deviceId: owner, state: "mining" });
    await expect(db.query("SELECT * FROM watch_agent_history")).rejects.toThrow(
      "permission denied",
    );
    const legacy = (await db.query<{value:unknown[]}>("SELECT watch_read_agent_history($1) value",[owner])).rows[0]!.value;
  expect(legacy).toHaveLength(1);
  expect(()=>agentHistoryPointSchema.parse(legacy[0])).not.toThrow();
  expect(JSON.stringify(legacy)).not.toContain('idleBnt');
  await db.exec("RESET ROLE");
    const stored = (
      await db.query<{ snapshot: object }>(
        "SELECT snapshot FROM watch_agent_history WHERE device_id=$1",
        [owner],
      )
    ).rows[0]!.snapshot;
    expect(stored).toMatchObject({ idleBnt: { state: "mining", hashrate: 2.82 } });
    expect(JSON.stringify(stored)).not.toContain("secret");
    await db.exec("SET ROLE anon");
    await expect(db.query("SELECT watch_idle_bnt_activity()")).rejects.toThrow("permission denied");
  } finally {
    await db.close();
  }
}, 30000);
