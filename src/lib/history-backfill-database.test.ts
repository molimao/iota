import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { buildHistoricalReports } from "./history-backfill";
import { aggregateDailyReport, reportDayWindow } from "./daily-report";
const user = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222";
const now = Date.parse("2026-10-11T04:00:00Z"),
  key = "1".repeat(48);
let db: PGlite;
type Job = {
  id: string;
  lease: string;
  user_id: string;
  cursor: number;
  total: number;
  bindings: { project: "iota"; identifier: string; device: string }[];
};
const iso = (ms: number) => new Date(ms).toISOString();
async function role(r: string, u = user) {
  await db.exec("RESET ROLE; SET ROLE " + r);
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [u]);
}
async function val<T>(sql: string, p: unknown[] = []) {
  return (await db.query<{ v: T }>(sql, p)).rows[0]!.v;
}
const work = <T>(action: string, p: object = {}) =>
  val<T>("SELECT watch_history_backfill_worker($1,$2) AS v", [
    action,
    JSON.stringify({ now: iso(now), ...p }),
  ]);
const old = aggregateDailyReport(
  reportDayWindow("2026-10-08"),
  [{ project: "iota", resource: key, units: "100000000", decimals: 8, currency: "IOTA", usd: 7 }],
  "en",
  2,
  now,
);
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz,deleted_at timestamptz); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; GRANT USAGE ON SCHEMA public,auth TO authenticated,service_role,anon;",
  );
  await db.query(
    "INSERT INTO auth.users VALUES($1,'pro@example.invalid',now(),NULL),($2,'free@example.invalid',now(),NULL)",
    [user, other],
  );
  await db.exec("GRANT ALL ON auth.users TO service_role;");
  for (const f of [
    "20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql",
    "20261005130000_fleet_and_billing.sql",
    "20261006190000_compute_projects.sql",
    "20261006200000_platform_connections.sql",
    "20261010180000_daily_reports.sql",
    "20261011120000_pro_tools.sql",
    "20261011235900_history_backfill.sql",
  ])
    await db.exec(readFileSync("supabase/migrations/" + f, "utf8"));
  await db.query(
    "INSERT INTO watch_billing(user_id,status,period_end) VALUES($1,'active',now()+interval '90 days')",
    [user],
  );
}, 30000);
beforeEach(async () => {
  await role("service_role");
  await db.exec(
    "DELETE FROM watch_history_backfills; DELETE FROM watch_pro_history; DELETE FROM watch_devices;",
  );
  for (const [u, k, count] of [
    [user, key, 2],
    [other, "2".repeat(48), 1],
  ] as const) {
    for (let i = 0; i < count; i++) {
      const device = await val<string>(
        "INSERT INTO watch_devices(user_id,name) VALUES($1,'Demo') RETURNING id AS v",
        [u],
      );
      await db.query(
        "INSERT INTO watch_bindings(user_id,device_id,project,identifier,worker) VALUES($1,$2,'iota',$3,$4)",
        [u, device, k, String(i)],
      );
    }
    await db.query(
      "INSERT INTO watch_pro_history(user_id,day,report,device_reports) VALUES($1,'2026-10-08',$2,'[]')",
      [u, JSON.stringify({ ...old, usdSubtotal: u === user ? 7 : 11 })],
    );
  }
});
afterAll(() => db.close());
async function claim(ms = now) {
  await role("service_role");
  await work("enqueue");
  await db.query("UPDATE watch_history_backfills SET status='done' WHERE user_id=$1", [other]);
  return work<Job>("claim", { now: iso(ms) });
}
async function ready(j: Job) {
  await work("progress", { id: j.id, lease: j.lease, cursor: j.total, day_cursor: 0, data: [] });
  return work<Job>("claim", { now: iso(now + 2000) });
}
function rows(j: Job, days = ["2026-10-07", "2026-10-08"]) {
  return buildHistoricalReports(
    j.bindings,
    [
      {
        project: "iota",
        resource: key,
        days: days.map((day) => ({
          day,
          units: "500000000",
          usd: null,
          partial: true,
          fetchedAt: now,
        })),
      },
    ],
    "2026-10-01",
    "2026-10-10",
    "en",
    now,
  );
}
it("includes Free and Pro owners, deduplicates resources, retries enqueue idempotently and exposes only own status", async () => {
  expect(await work<number>("enqueue")).toBe(2);
  expect(await work<number>("enqueue")).toBe(0);
  expect(await val<number>("SELECT count(*)::integer AS v FROM watch_history_backfills")).toBe(2);
  expect(
    await val<number>("SELECT total AS v FROM watch_history_backfills WHERE user_id=$1", [user]),
  ).toBe(1);
  await role("authenticated", other);
  expect(await val("SELECT watch_history_backfill_status() AS v")).toMatchObject({
    state: "pending",
    total: 1,
    inserted: 0,
  });
  await expect(work("claim")).rejects.toThrow("permission denied");
  await expect(db.query("SELECT * FROM watch_history_backfills")).rejects.toThrow(
    "permission denied",
  );
  await role("anon");
  await expect(val("SELECT watch_history_backfill_status() AS v")).rejects.toThrow(
    "permission denied",
  );
});
it("preserves existing snapshots and valuations, writes per-device owner data and rejects stale leases", async () => {
  let j = await claim();
  expect(
    await work("progress", { id: j.id, lease: other, cursor: 1, day_cursor: 0, data: [] }),
  ).toBe(false);
  j = await ready(j);
  const imported = rows(j);
  expect(
    await work<number>("write", { id: j.id, lease: j.lease, rows: imported, now: iso(now + 3000) }),
  ).toBe(1);
  expect(
    await val("SELECT report AS v FROM watch_pro_history WHERE user_id=$1 AND day=$2", [
      user,
      "2026-10-08",
    ]),
  ).toEqual(old);
  expect(
    await val("SELECT device_reports AS v FROM watch_pro_history WHERE user_id=$1 AND day=$2", [
      user,
      "2026-10-07",
    ]),
  ).toHaveLength(2);
  expect(await work("write", { id: j.id, lease: j.lease, rows: imported })).toBe(false);
  await role("authenticated");
  expect(await val<unknown[]>("SELECT watch_history_read() AS v")).toHaveLength(2);
  await role("authenticated", other);
  expect(await val<unknown[]>("SELECT watch_history_read() AS v")).toHaveLength(1);
});
it("rolls back the entire batch on an invalid date or a cross-device row", async () => {
  const j = await ready(await claim());
  const imported = rows(j, ["2026-10-06", "2026-10-10"]);
  await expect(
    work("write", { id: j.id, lease: j.lease, rows: imported, now: iso(now + 3000) }),
  ).rejects.toThrow("invalid_backfill_day");
  expect(
    await val<number>("SELECT count(*)::integer AS v FROM watch_pro_history WHERE user_id=$1", [
      user,
    ]),
  ).toBe(1);
  const valid = rows(j, ["2026-10-06"]);
  valid[0]!.devices[0]!.id = other;
  await expect(
    work("write", { id: j.id, lease: j.lease, rows: valid, now: iso(now + 3000) }),
  ).rejects.toThrow("invalid_backfill_device");
  await expect(work("write", { id: j.id, lease: j.lease, now: iso(now + 3000) })).rejects.toThrow(
    "incomplete_backfill",
  );
});
it("stops writes after a tracked binding is removed", async () => {
  const j = await ready(await claim());
  const imported = rows(j, ["2026-10-07"]);
  await db.query("DELETE FROM watch_bindings WHERE device_id=$1", [j.bindings[0]!.device]);
  await expect(
    work("write", { id: j.id, lease: j.lease, rows: imported, now: iso(now + 3000) }),
  ).rejects.toThrow("bindings_changed");
  expect(
    await val<number>("SELECT count(*)::integer AS v FROM watch_pro_history WHERE user_id=$1", [
      user,
    ]),
  ).toBe(1);
});
it("bounds failure retries, retains existing history and permits a protected retry", async () => {
  let j = await claim();
  for (let i = 0; i < 4; i++) {
    const at = now + i * 600000;
    expect(await work("retry", { id: j.id, lease: j.lease, now: iso(at) })).toBe(true);
    if (i < 3) j = await work<Job>("claim", { now: iso(at + 600000) });
  }
  expect(await val("SELECT status AS v FROM watch_history_backfills WHERE id=$1", [j.id])).toBe(
    "failed",
  );
  expect(await val("SELECT report AS v FROM watch_pro_history WHERE user_id=$1", [user])).toEqual(
    old,
  );
  expect(await work<number>("retry_failed", { now: iso(now + 3600000) })).toBe(1);
});
