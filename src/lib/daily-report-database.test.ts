import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, it, expect } from "vitest";
const user = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222";
let db: PGlite;
const due = "2026-10-10T01:30:00Z",
  prep = "2026-10-10T00:30:00Z";
async function role(r: string, u = user) {
  await db.exec(`RESET ROLE; SET ROLE ${r};`);
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [u]);
}
async function rpc<T>(sql: string, params: unknown[] = []) {
  return (await db.query<{ v: T }>(sql, params)).rows[0]!.v;
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz,deleted_at timestamptz); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; GRANT USAGE ON SCHEMA public,auth TO authenticated,service_role,anon;",
  );
  await db.query(
    "INSERT INTO auth.users(id,email,email_confirmed_at) VALUES($1,'reader@example.invalid',now()),($2,'other@example.invalid',now())",
    [user, other],
  );
  await db.exec("GRANT ALL ON auth.users TO service_role;");
  for (const f of [
    "20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql",
    "20261005130000_fleet_and_billing.sql",
    "20261010180000_daily_reports.sql",
  ])
    await db.exec(readFileSync("supabase/migrations/" + f, "utf8"));
  await db.query(
    "INSERT INTO watch_billing(user_id,status,period_end) VALUES($1,'active',now()+interval '30 days')",
    [user],
  );
  const id = await rpc<string>(
    "INSERT INTO watch_devices(user_id,name) VALUES($1,'Example') RETURNING id AS v",
    [user],
  );
  await db.query(
    "INSERT INTO watch_bindings(device_id,user_id,project,identifier) VALUES($1,$2,'iota','public-test-id')",
    [id, user],
  );
});
afterAll(async () => db.close());
it("enforces paid consent and prevents client access to private report snapshots", async () => {
  await role("authenticated", other);
  await expect(db.query("SELECT watch_set_report_preferences(true,'zh')")).rejects.toThrow(
    "pro_required",
  );
  await expect(db.query("SELECT * FROM watch_report_jobs")).rejects.toThrow();
  await expect(db.query("SELECT watch_enqueue_reports($1)", [due])).rejects.toThrow();
  await role("authenticated", user);
  const p = await rpc<{ enabled: boolean; recipient: string }>(
    "SELECT watch_set_report_preferences(true,'en') AS v",
  );
  expect(p).toMatchObject({ enabled: true, recipient: "reader@example.invalid" });
  await role("authenticated", other);
  const otherStatus = await rpc<{ enabled: boolean; recipient: string }>(
    "SELECT watch_report_status() AS v",
  );
  expect(otherStatus).toMatchObject({ enabled: false, recipient: "other@example.invalid" });
});
it("queues once per day, leases work atomically and freezes the first delivery payload", async () => {
  await role("service_role");
  expect(await rpc<number>("SELECT watch_enqueue_reports($1) AS v", [due])).toBe(0);
  await db.query(
    "UPDATE watch_report_preferences SET enabled_at='2026-10-09T00:00:00Z' WHERE user_id=$1",
    [user],
  );
  expect(await rpc<number>("SELECT watch_enqueue_reports($1) AS v", [due])).toBe(1);
  expect(await rpc<number>("SELECT watch_enqueue_reports($1) AS v", [due])).toBe(0);
  await db.query("UPDATE watch_report_jobs SET available_at=$1", [prep]);
  const j = await rpc<{ id: string; lease_token: string }>(
    "SELECT watch_claim_report($1,$2) AS v",
    ["prepare", prep],
  );
  expect(j.id).toBeTruthy();
  expect(await rpc<null>("SELECT watch_claim_report($1,$2) AS v", ["prepare", prep])).toBeNull();
  const payload = {
    subject: "Frozen",
    html: "<p>Report</p>",
    text: "Report",
    unsubscribe: "https://iotahome.site/api/reports/unsubscribe",
  };
  expect(
    await rpc<boolean>("SELECT watch_update_report($1,$2,1,'[]',$3,'ready',NULL,NULL,$4) AS v", [
      j.id,
      j.lease_token,
      JSON.stringify(payload),
      prep,
    ]),
  ).toBe(true);
  expect(await rpc<null>("SELECT watch_claim_report($1,$2) AS v", ["send", prep])).toBeNull();
  const send = await rpc<{ id: string; lease_token: string; payload: object }>(
    "SELECT watch_claim_report($1,$2) AS v",
    ["send", due],
  );
  expect(send.payload).toEqual(payload);
  expect(
    await rpc<boolean>("SELECT watch_report_can_send($1,$2,$3) AS v", [
      send.id,
      send.lease_token,
      due,
    ]),
  ).toBe(true);
  await db.query(
    "UPDATE watch_report_jobs SET lease_until=$1::timestamptz-interval '1 second' WHERE id=$2",
    [due, send.id],
  );
  const retry = await rpc<{ id: string; lease_token: string }>(
    "SELECT watch_claim_report($1,$2) AS v",
    ["send", due],
  );
  expect(retry.lease_token).not.toBe(send.lease_token);
  expect(
    await rpc<boolean>("SELECT watch_update_report($1,$2,1,'[]',NULL,'sent',NULL,NULL,NULL) AS v", [
      send.id,
      send.lease_token,
    ]),
  ).toBe(false);
  await db.query("SELECT watch_update_report($1,$2,1,'[]',$3,'ready',NULL,NULL,$4)", [
    retry.id,
    retry.lease_token,
    JSON.stringify({ ...payload, subject: "Changed" }),
    due,
  ]);
  expect(
    await rpc<object>("SELECT payload AS v FROM watch_report_jobs WHERE id=$1", [retry.id]),
  ).toEqual(payload);
});
it("rechecks expiry, recipient changes and unsubscribe before delivery", async () => {
  await role("service_role");
  let j = await rpc<{ id: string; lease_token: string }>("SELECT watch_claim_report($1,$2) AS v", [
    "send",
    due,
  ]);
  await db.query(
    "UPDATE watch_billing SET period_end=$1::timestamptz-interval '1 second' WHERE user_id=$2",
    [due, user],
  );
  expect(
    await rpc<boolean>("SELECT watch_report_can_send($1,$2,$3) AS v", [j.id, j.lease_token, due]),
  ).toBe(false);
  await db.query("UPDATE watch_billing SET period_end=now()+interval '30 days' WHERE user_id=$1", [
    user,
  ]);
  await db.query("UPDATE auth.users SET email='changed@example.invalid' WHERE id=$1", [user]);
  expect(
    await rpc<boolean>("SELECT watch_report_can_send($1,$2,$3) AS v", [j.id, j.lease_token, due]),
  ).toBe(false);
  await db.query("UPDATE auth.users SET email='reader@example.invalid' WHERE id=$1", [user]);
  const token = await rpc<string>(
    "SELECT unsubscribe_token AS v FROM watch_report_preferences WHERE user_id=$1",
    [user],
  );
  await rpc<boolean>("SELECT watch_report_unsubscribe($1) AS v", [token]);
  expect(
    await rpc<boolean>("SELECT watch_report_can_send($1,$2,$3) AS v", [j.id, j.lease_token, due]),
  ).toBe(false);
  expect(await rpc<boolean>("SELECT watch_report_unsubscribe($1) AS v", [token])).toBe(false);
});
