import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, it, expect } from "vitest";
const user = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222",
  address = "a".repeat(80);
let db: PGlite;
async function role(name: string, id = user) {
  await db.exec(`RESET ROLE; SET ROLE ${name}`);
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [id]);
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; GRANT USAGE ON SCHEMA public,auth TO authenticated,service_role,anon; CREATE TABLE public.watch_bindings(user_id uuid,project text,identifier text,worker text);",
  );
  await db.query("INSERT INTO auth.users VALUES($1),($2)", [user, other]);
  await db.query("INSERT INTO watch_bindings VALUES($1,'bnt',$2,'')", [user, address]);
  await db.exec(readFileSync("supabase/migrations/20261020120000_bnt_worker_samples.sql", "utf8"));
});
afterAll(() => db.close());
it("blocks client writes and anonymous reads, persists idempotently and isolates owners", async () => {
  await role("authenticated");
  await expect(
    db.query("SELECT watch_bnt_worker_history_record($1,$2,now(),'[]')", [user, address]),
  ).rejects.toThrow(/permission denied/);
  await expect(db.query("SELECT * FROM watch_bnt_worker_samples")).rejects.toThrow(
    /permission denied/,
  );
  await role("anon");
  await expect(db.query("SELECT watch_bnt_worker_history_read($1)", [address])).rejects.toThrow(
    /permission denied/,
  );
  await role("service_role");
  const at = (await db.query<{ at: string }>("SELECT (now()-interval '1 minute')::text AS at"))
    .rows[0]!.at;
  const workers = JSON.stringify([
    { name: "a", hashrate: 0 },
    { name: "b", hashrate: 9 },
  ]);
  for (let i = 0; i < 2; i++)
    await db.query("SELECT watch_bnt_worker_history_record($1,$2,$3,$4)", [
      user,
      address,
      at,
      workers,
    ]);
  await expect(
    db.query("SELECT watch_bnt_worker_history_record($1,$2,now(),$3)", [
      user,
      address,
      JSON.stringify([{ name: "bad", hashrate: -1 }]),
    ]),
  ).rejects.toThrow(/invalid_sample/);
  await role("authenticated");
  const read = async () =>
    (await db.query<{ v: unknown[] }>("SELECT watch_bnt_worker_history_read($1) AS v", [address]))
      .rows[0]!.v;
  expect(await read()).toHaveLength(1);
  await role("authenticated", other);
  await expect(read()).rejects.toThrow(/address_not_saved/);
  await db.exec("RESET ROLE");
  await db.query("INSERT INTO watch_bindings VALUES($1,'bnt',$2,'')", [other, address]);
  await role("authenticated", other);
  expect(await read()).toEqual([]);
  await db.exec("RESET ROLE");
  await db.query("UPDATE watch_bindings SET worker='a' WHERE user_id=$1", [user]);
  await role("authenticated");
  const own = (await read())[0] as { workers: unknown[] };
  expect(own.workers).toEqual([{ name: "a", hashrate: 0 }]);
});
