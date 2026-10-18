import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, beforeEach, afterAll, expect, it } from "vitest";
let db: PGlite;
const owner = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222",
  device = "33333333-3333-4333-8333-333333333333";
const crash =
  "[2026-10-18 10:10:00.000] P2P connection timeout\n[2026-10-18 10:11:00.000] thread panicked at missing local CID state for path=0\nSIGABRT process aborted";
const worker = async (
  action: string,
  id: string | null = null,
  lease: string | null = null,
  result: unknown = null,
) =>
  (
    await db.query<{ r: any }>("select watch_agent_analysis_worker($1,$2,$3,$4::jsonb) r", [
      action,
      id,
      lease,
      result ? JSON.stringify(result) : null,
    ])
  ).rows[0]!.r;
async function asUser(id = owner) {
  await db.exec("RESET ROLE; SET ROLE authenticated");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
}
async function admin() {
  await db.exec("RESET ROLE");
}
async function beat(logs = crash, enabled = true) {
  await admin();
  await db.query(
    "update watch_device_agents set logs_enabled=$2,snapshot=$3::jsonb where device_id=$1",
    [device, enabled, JSON.stringify({ logs })],
  );
}
async function state() {
  await asUser();
  return (await db.query<{ r: any }>("select watch_agent_analysis_read($1,'zh') r", [device]))
    .rows[0]!.r;
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid PRIMARY KEY);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;",
  );
  await db.query("insert into auth.users values($1),($2)", [owner, other]);
  for (const f of [
    "20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql",
    "20261005130000_fleet_and_billing.sql",
    "20261014210000_device_agents.sql",
    "20261018110000_log_analysis.sql",
  ])
    await db.exec(readFileSync("supabase/migrations/" + f, "utf8"));
  await db.exec("CREATE TABLE watch_pro_preferences(user_id uuid primary key,locale text);");
  await db.exec(
    readFileSync("supabase/migrations/20261018180000_agent_crash_analysis.sql", "utf8"),
  );
}, 30000);
beforeEach(async () => {
  await admin();
  await db.exec(
    "delete from watch_agent_crash_analyses;delete from watch_log_analyses;delete from watch_device_agents;delete from watch_devices;delete from watch_billing;delete from watch_agent_ai_preferences;",
  );
  await db.query(
    "insert into watch_billing(user_id,status,period_end) values($1,'active',now()+interval '1 day')",
    [owner],
  );
  await db.query("insert into watch_devices(id,user_id,name) values($1,$2,'Test Mac')", [
    device,
    owner,
  ]);
  await db.query(
    "insert into watch_device_agents(device_id,user_id,credential_hash) values($1,$2,$3)",
    [device, owner, "a".repeat(64)],
  );
  await asUser();
  await db.query("select watch_agent_analysis_locale('zh')");
});
afterAll(async () => db.close());
it("requires opted-in logs and explicit crash evidence for all accounts; idle, queue and high memory do not trigger", async () => {
  for (const logs of [
    "training idle queue position 532 memory 90%",
    "No crash detected. No out of memory error.",
    "P2P timeout training retrying connection",
  ]) {
    await beat(logs);
    expect((await state()).items).toHaveLength(0);
  }
  await beat(crash, false);
  expect((await state()).items).toHaveLength(0);
  await admin();
  await db.exec("update watch_billing set status='canceled'");
  await beat();
  expect((await state()).items).toHaveLength(1);
  expect((await state()).eligible).toBe(true);
  await admin();
  const job = await worker("claim");
  expect(job).not.toBeNull();
  expect(
    await worker("complete", job.id, job.lease, { locale: "zh", summary: "崩溃解读" }),
  ).toEqual({ ok: true });
});
it("deduplicates growing tails and later cleanup panics from one incident", async () => {
  await beat();
  await beat(crash + "\nnew progress line");
  await beat("SIGABRT different cleanup panic\nPoisonError aborted again");
  expect((await state()).items).toHaveLength(1);
  await admin();
  await db.exec("update watch_agent_crash_analyses set created_at=now()-interval '16 minutes'");
  await beat();
  expect((await state()).items).toHaveLength(1);
  await beat(crash.replace("10:11:00", "11:31:00"));
  expect((await state()).items).toHaveLength(2);
});
it("keeps queue contents private and owner read is device-scoped", async () => {
  await beat();
  await asUser(other);
  await expect(db.query("select watch_agent_analysis_read($1,'zh')", [device])).rejects.toThrow(
    "device_not_found",
  );
  await expect(db.query("select * from watch_agent_crash_analyses")).rejects.toThrow(
    "permission denied",
  );
  await expect(worker("claim")).rejects.toThrow("permission denied");
  const s = await state();
  expect(JSON.stringify(s)).not.toContain("SIGABRT");
  expect(s.items[0].locale).toBe("zh");
});
it("leases once, checks lease and locale, completes with excerpt erased", async () => {
  await beat();
  await admin();
  await db.exec("SET ROLE service_role");
  const j = await worker("claim");
  expect(j.locale).toBe("zh");
  expect(await worker("claim")).toBeNull();
  expect(await worker("complete", j.id, crypto.randomUUID(), { locale: "zh" })).toEqual({
    ok: false,
  });
  await expect(worker("complete", j.id, j.lease, { locale: "en" })).rejects.toThrow(
    "invalid_analysis_result",
  );
  expect(await worker("complete", j.id, j.lease, { locale: "zh", summary: "P2P 崩溃" })).toEqual({
    ok: true,
  });
  await admin();
  const r = await db.query<{ logs: unknown; status: string }>(
    "select logs,status from watch_agent_crash_analyses",
  );
  expect(r.rows[0]).toEqual({ logs: null, status: "done" });
});
it("rechecks consent after the model and cancels the job when uploads are disabled", async () => {
  await beat();
  await admin();
  const j = await worker("claim");
  await beat(crash, false);
  await admin();
  expect(await worker("complete", j.id, j.lease, { locale: "zh" })).toEqual({ ok: false });
  const r = await db.query<{ logs: unknown; status: string }>(
    "select logs,status from watch_agent_crash_analyses",
  );
  expect(r.rows[0]).toEqual({ logs: null, status: "cancelled" });
});
it("shares the daily limit with other AI attempts and bounds retries", async () => {
  await beat();
  await admin();
  for (let i = 0; i < 10; i++)
    await db.query(
      "insert into watch_log_analyses(user_id,request_id,digest,project) values($1,$2,$3,'iota')",
      [owner, crypto.randomUUID(), "b".repeat(64)],
    );
  expect(await worker("claim")).toBeNull();
  expect((await state()).items[0].status).toBe("limited");
});
it("failed work retries with the same quota request and cannot expose another device result", async () => {
  await beat();
  await admin();
  const j = await worker("claim");
  await worker("fail", j.id, j.lease);
  await db.exec("update watch_agent_crash_analyses set available_at=now()-interval '1 second'");
  const again = await worker("claim");
  expect(again.id).toBe(j.id);
  expect(again.lease).not.toBe(j.lease);
  const n = await db.query<{ n: number }>("select count(*)::int n from watch_log_analyses");
  expect(n.rows[0]!.n).toBe(1);
});
