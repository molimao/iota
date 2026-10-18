import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, beforeEach, afterAll, it, expect } from "vitest";
let db: PGlite;
const u = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222";
async function user(id = u) {
  await db.exec("RESET ROLE;SET ROLE authenticated");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
}
async function admin() {
  await db.exec("RESET ROLE");
}
const call = async (
  action: string,
  request: string | null = null,
  digest: string | null = null,
  result: object | null = null,
) =>
  (
    await db.query<{ r: any }>("select watch_log_analysis($1,$2,$3,$4,$5::jsonb) r", [
      action,
      request,
      digest,
      "iota",
      result ? JSON.stringify(result) : null,
    ])
  ).rows[0]!.r;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;CREATE SCHEMA auth;CREATE TABLE auth.users(id uuid primary key);CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;GRANT USAGE ON SCHEMA public,auth TO authenticated,anon,service_role;",
  );
  await db.query("insert into auth.users values($1),($2)", [u, other]);
  await db.exec(
    readFileSync(
      "supabase/migrations/20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql",
      "utf8",
    ),
  );
  await db.exec(readFileSync("supabase/migrations/20261005130000_fleet_and_billing.sql", "utf8"));
  const trial = readFileSync("supabase/migrations/20261012120000_pro_trials.sql", "utf8");
  await db.exec(trial.split("CREATE OR REPLACE FUNCTION public.watch_enqueue_reports")[0]!);
  await db.exec(readFileSync("supabase/migrations/20261018110000_log_analysis.sql", "utf8"));
}, 30000);
beforeEach(async () => {
  await admin();
  await db.exec("delete from watch_log_analyses;delete from watch_billing;");
  await db.query(
    "insert into watch_billing(user_id,status,period_end) values($1,'active',now()+interval '1 day')",
    [u],
  );
  await user();
});
afterAll(async () => db.close());
it("blocks free/expired subscriptions and direct table access", async () => {
  await user(other);
  await expect(call("reserve", crypto.randomUUID(), "a".repeat(64))).rejects.toThrow(
    "pro_required",
  );
  await expect(db.query("select * from watch_log_analyses")).rejects.toThrow("permission denied");
  await admin();
  await db.query("update watch_billing set period_end=now()-interval '1 day' where user_id=$1", [
    u,
  ]);
  await user();
  await expect(call("reserve", crypto.randomUUID(), "a".repeat(64))).rejects.toThrow(
    "pro_required",
  );
});
it("includes valid trials and atomically deduplicates retried requests", async () => {
  await admin();
  await db.query("update watch_billing set status='trialing' where user_id=$1", [u]);
  await user();
  const id = crypto.randomUUID();
  expect((await call("reserve", id, "a".repeat(64))).fresh).toBe(true);
  expect((await call("reserve", id, "a".repeat(64))).fresh).toBe(false);
  await expect(call("reserve", id, "b".repeat(64))).rejects.toThrow("request_mismatch");
  expect((await call("list")).used).toBe(1);
});
it("isolates saved results and never allows another account to complete a request", async () => {
  const id = crypto.randomUUID();
  await call("reserve", id, "a".repeat(64));
  await call("complete", id, null, { summary: "safe diagnosis" });
  expect((await call("list")).items).toHaveLength(1);
  await admin();
  await db.query(
    "insert into watch_billing(user_id,status,period_end) values($1,'active',now()+interval '1 day')",
    [other],
  );
  await user(other);
  expect((await call("list")).items).toHaveLength(0);
  await expect(call("complete", id, null, { summary: "overwrite" })).rejects.toThrow(
    "analysis_request_unavailable",
  );
});
it("enforces the short rate limit and daily cap even when attempts fail", async () => {
  for (let i = 0; i < 2; i++) await call("reserve", crypto.randomUUID(), "a".repeat(64));
  await expect(call("reserve", crypto.randomUUID(), "a".repeat(64))).rejects.toThrow(
    "analysis_rate_limit",
  );
  for (let i = 2; i < 10; i++) {
    await admin();
    await db.exec("update watch_log_analyses set created_at=now()-interval '2 minutes'");
    await user();
    const id = crypto.randomUUID();
    await call("reserve", id, "a".repeat(64));
    await call("fail", id);
  }
  await expect(call("reserve", crypto.randomUUID(), "a".repeat(64))).rejects.toThrow(
    "analysis_daily_limit",
  );
});
