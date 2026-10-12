import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, it, expect } from "vitest";
const user = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222";
let db: PGlite;
async function role(r: string, u = user) {
  await db.exec("RESET ROLE; SET ROLE " + r);
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [u]);
}
async function value<T>(sql: string, p: unknown[] = []) {
  return (await db.query<{ v: T }>(sql, p)).rows[0]!.v;
}
const worker = (action: string, p: object = {}) =>
  value<unknown>("SELECT watch_pro_worker($1,$2) AS v", [action, JSON.stringify(p)]);
const wallet = (n: number) => "0x" + n.toString(16).padStart(40, "0");
const row = (key: string, n: number) => ({
  device_key: key,
  device_id: "",
  name: "Machine " + key,
  hardware: "M4",
  project: "flyai",
  identifier: wallet(n),
  worker: "",
});
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
  for (const file of [
    "20260912082005_6a930f9e-e1ba-4207-ab6f-856139f2ec92.sql",
    "20261005130000_fleet_and_billing.sql",
    "20261006190000_compute_projects.sql",
    "20261006200000_platform_connections.sql",
    "20261010180000_daily_reports.sql",
    "20261011120000_pro_tools.sql",
    "20261011235900_history_backfill.sql",
  ])
    await db.exec(readFileSync("supabase/migrations/" + file, "utf8"));
  await db.query(
    "INSERT INTO watch_billing(user_id,status,period_end) VALUES($1,'active',now()+interval '90 days')",
    [user],
  );
}, 30000);
afterAll(() => db.close());
it("requires paid ownership and denies direct access to all private tables and worker RPC", async () => {
  await role("authenticated", other);
  expect(await value("SELECT watch_history_read() AS v")).toEqual([]);
  await expect(value("SELECT watch_set_pro_preferences(true,true,'en') AS v")).rejects.toThrow(
    "pro_required",
  );
  await expect(value("SELECT watch_bulk_devices(gen_random_uuid(),'[]') AS v")).rejects.toThrow(
    "pro_required",
  );
  await expect(worker("enqueue")).rejects.toThrow("permission denied");
  await expect(db.query("SELECT * FROM watch_pro_history")).rejects.toThrow("permission denied");
  await role("anon");
  await expect(value("SELECT watch_pro_status() AS v")).rejects.toThrow("permission denied");
});
it("bulk groups only explicit keys, saves atomically, enforces project quotas, and retries idempotently", async () => {
  await role("authenticated");
  const request = crypto.randomUUID();
  const rows = [row("a", 1), row("b", 2)];
  const result = await value<{ devices: { id: string; name: string }[] }>(
    "SELECT watch_bulk_devices($1,$2) AS v",
    [request, JSON.stringify(rows)],
  );
  expect(result.devices).toHaveLength(2);
  const replay = await value<{ devices: unknown[] }>("SELECT watch_bulk_devices($1,$2) AS v", [
    request,
    JSON.stringify(rows),
  ]);
  expect(replay.devices).toHaveLength(2);
  await expect(
    value("SELECT watch_bulk_devices($1,$2) AS v", [request, JSON.stringify([row("c", 3)])]),
  ).rejects.toThrow("request_mismatch");
  await expect(
    value("SELECT watch_bulk_devices($1,$2) AS v", [
      crypto.randomUUID(),
      JSON.stringify([row("c", 3), row("d", 1)]),
    ]),
  ).rejects.toThrow("duplicate_binding");
  expect(
    (await value<{ devices: unknown[] }>("SELECT watch_list_devices() AS v")).devices,
  ).toHaveLength(2);
  await expect(
    value("SELECT watch_bulk_devices($1,$2) AS v", [
      crypto.randomUUID(),
      JSON.stringify(Array.from({ length: 49 }, (_, i) => row("quota" + i, i + 10))),
    ]),
  ).rejects.toThrow("project_device_limit_reached");
  expect(
    (await value<{ devices: unknown[] }>("SELECT watch_list_devices() AS v")).devices,
  ).toHaveLength(2);
  await role("authenticated", other);
  await expect(
    value("SELECT watch_mutate_device($1,$2) AS v", [
      "rename",
      JSON.stringify({ id: result.devices[0]!.id, name: "Stolen" }),
    ]),
  ).rejects.toThrow();
});
it("links one physical device to multiple projects and batch-renames existing devices without duplicating them", async () => {
  await role("authenticated");
  const r1 = row("multi", 4),
    r2 = { ...row("multi", 5), project: "iota", identifier: "5".repeat(48) };
  const result = await value<{ devices: { id: string; name: string; bindings: unknown[] }[] }>(
    "SELECT watch_bulk_devices($1,$2) AS v",
    [crypto.randomUUID(), JSON.stringify([r1, r2])],
  );
  const d = result.devices.find((d) => d.name === "Machine multi")!;
  expect(d.bindings).toHaveLength(2);
  const renamed = await value<{ devices: { id: string; name: string }[] }>(
    "SELECT watch_bulk_devices($1,$2) AS v",
    [
      crypto.randomUUID(),
      JSON.stringify([
        { ...r1, device_id: d.id, device_key: "", project: "", identifier: "", name: "New label" },
      ]),
    ],
  );
  expect(renamed.devices.find((x) => x.id === d.id)?.name).toBe("New label");
});
it("queues history independently of email consent, leases once and saves immutable owner-scoped snapshots", async () => {
  await role("service_role");
  const now = "2026-10-11T01:00:00Z";
  await worker("enqueue", { now });
  const task = (await worker("claim", { now })) as { id: string; lease: string; kind: string };
  expect(task.kind).toBe("snapshot");
  expect(await worker("claim", { now })).toBeNull();
  const report = { day: "2026-10-10", projects: [], partial: true };
  expect(await worker("history", { ...task, report, now })).toBe(true);
  await worker("history", { ...task, report: { ...report, partial: false }, now });
  await worker("progress", { ...task, done: true, now });
  await role("authenticated");
  expect(await value<unknown[]>("SELECT watch_history_read() AS v")).toEqual([report]);
  await role("authenticated", other);
  expect(await value("SELECT watch_history_read() AS v")).toEqual([]);
});
it("requires a healthy baseline and continuous fresh bad observations; does not alert on unknown or repeat an incident", async () => {
  await role("authenticated");
  await value("SELECT watch_set_pro_preferences(true,true,'en') AS v");
  await role("service_role");
  const start = "2026-10-11T02:00:00Z";
  await worker("enqueue", { now: start });
  const task = (await worker("claim", { now: start })) as {
    id: string;
    lease: string;
    kind: string;
  };
  expect(task.kind).toBe("sample");
  // Extend lease for controlled clock tests. Each distinct sample would normally have its own lease.
  await db.query("UPDATE watch_pro_tasks SET lease_until='2026-10-12T00:00:00Z' WHERE id=$1", [
    task.id,
  ]);
  const observation = {
    ...task,
    resource: "iota:" + "5".repeat(48) + ":",
    event: { name: "New label", project: "iota", identifier: "5".repeat(48) },
  };
  expect(await worker("observe", { ...observation, signal: "bad", now: start })).toBe(false);
  expect(
    await worker("observe", { ...observation, signal: "healthy", now: "2026-10-11T02:01:00Z" }),
  ).toBe(false);
  expect(
    await worker("observe", { ...observation, signal: "bad", now: "2026-10-11T02:10:00Z" }),
  ).toBe(false);
  await worker("observe", { ...observation, signal: "unknown", now: "2026-10-11T02:20:00Z" });
  expect(
    await worker("observe", { ...observation, signal: "bad", now: "2026-10-11T02:30:00Z" }),
  ).toBe(false);
  expect(
    await worker("observe", { ...observation, signal: "bad", now: "2026-10-11T02:40:00Z" }),
  ).toBe(false);
  expect(
    await worker("observe", { ...observation, signal: "bad", now: "2026-10-11T02:50:00Z" }),
  ).toBe(true);
  expect(
    await worker("observe", { ...observation, signal: "bad", now: "2026-10-11T03:00:00Z" }),
  ).toBe(false);
  const mail = (await worker("claim", { now: "2026-10-11T03:00:00Z" })) as {
    id: string;
    lease: string;
    kind: string;
  };
  expect(mail.kind).toBe("alert");
  expect(await worker("can_send", { ...mail, now: "2026-10-11T03:00:00Z" })).toBe(true);
  await db.query("UPDATE auth.users SET email='changed@example.invalid' WHERE id=$1", [user]);
  expect(await worker("can_send", { ...mail, now: "2026-10-11T03:00:00Z" })).toBe(false);
  await db.query("UPDATE auth.users SET email='pro@example.invalid' WHERE id=$1", [user]);
  await role("authenticated");
  await value("SELECT watch_set_pro_preferences(false,false,'en') AS v");
  await role("service_role");
  expect(await worker("can_send", { ...mail, now: "2026-10-11T03:00:00Z" })).toBe(false);
});
it("only queues the previous monthly report after its final snapshot exists, and cancels delivery after Pro expires", async () => {
  await role("authenticated");
  await value("SELECT watch_set_pro_preferences(false,true,'en') AS v");
  await role("service_role");
  await db.query(
    "INSERT INTO watch_pro_history(user_id,day,report) VALUES($1,'2026-09-10','{\"day\":\"2026-09-10\"}')",
    [user],
  );
  const now = "2026-10-01T01:30:00Z";
  await worker("enqueue", { now });
  expect(
    await value<number>("SELECT count(*)::integer AS v FROM watch_pro_tasks WHERE kind='monthly'"),
  ).toBe(0);
  await db.query(
    "INSERT INTO watch_pro_history(user_id,day,report) VALUES($1,'2026-09-30','{\"day\":\"2026-09-30\"}')",
    [user],
  );
  await worker("enqueue", { now });
  await worker("enqueue", { now });
  expect(
    await value<number>(
      "SELECT count(*)::integer AS v FROM watch_pro_tasks WHERE kind='monthly' AND task_key='2026-09'",
    ),
  ).toBe(1);
  await db.exec("UPDATE watch_pro_tasks SET status='done' WHERE kind='snapshot'");
  const task = (await worker("claim", { now })) as { id: string; lease: string; kind: string };
  expect(task.kind).toBe("monthly");
  expect(await worker("can_send", { ...task, now })).toBe(true);
  await db.query("UPDATE watch_billing SET period_end=now()-interval '1 second' WHERE user_id=$1", [
    user,
  ]);
  expect(await worker("can_send", { ...task, now })).toBe(false);
  await db.query("UPDATE watch_billing SET period_end=now()+interval '90 days' WHERE user_id=$1", [
    user,
  ]);
});
it("rejects expired or stolen leases and prunes history beyond the 90-day retention window", async () => {
  await role("service_role");
  const now = "2026-11-01T01:00:00Z";
  await worker("enqueue", { now });
  const task = (await worker("claim", { now })) as { id: string; lease: string };
  expect(
    await worker("progress", { id: task.id, lease: crypto.randomUUID(), done: true, now }),
  ).toBe(false);
  expect(await worker("progress", { ...task, done: true, now: "2026-11-01T01:04:00Z" })).toBe(
    false,
  );
  await db.query(
    "INSERT INTO watch_pro_history(user_id,day,report) VALUES($1,'2026-01-01','{\"day\":\"2026-01-01\"}')",
    [user],
  );
  await worker("enqueue", { now });
  expect(
    await value<number>(
      "SELECT count(*)::integer AS v FROM watch_pro_history WHERE day='2026-01-01'",
    ),
  ).toBe(0);
});
it("device history is owner-only, isolated from fleet history, and does not synthesize older snapshots", async () => {
  await role("service_role");
  const devices = (
    await db.query<{ id: string }>("SELECT id FROM watch_devices WHERE user_id=$1 ORDER BY id", [
      user,
    ])
  ).rows;
  const first = devices[0]!.id,
    second = devices[1]!.id;
  const report = { day: "2026-10-10", usdSubtotal: 1, projects: [] };
  const deviceReports = [
    { id: first, report, deviceReport: report, walletProjects: [] },
    {
      id: second,
      report: { ...report, usdSubtotal: 99 },
      deviceReport: { ...report, usdSubtotal: 99 },
      walletProjects: [],
    },
  ];
  await db.query(
    "UPDATE watch_pro_history SET device_reports=$1 WHERE user_id=$2 AND day='2026-10-10'",
    [JSON.stringify(deviceReports), user],
  );
  await role("authenticated");
  const own = await value<{ report: { usdSubtotal: number } }[]>(
    "SELECT watch_device_history_read($1) AS v",
    [first],
  );
  expect(own).toHaveLength(1);
  expect(own[0]?.report.usdSubtotal).toBe(1);
  expect(await value("SELECT watch_device_history_read($1) AS v", [second])).not.toEqual(own);
  await expect(value("SELECT * FROM watch_pro_history")).rejects.toThrow();
  await role("service_role");
  await db.query(
    "INSERT INTO watch_billing(user_id,status,period_end) VALUES($1,'active',now()+interval '30 days') ON CONFLICT(user_id) DO UPDATE SET status='active',period_end=now()+interval '30 days'",
    [other],
  );
  await role("authenticated", other);
  await expect(value("SELECT watch_device_history_read($1) AS v", [first])).rejects.toThrow(
    "device_not_found",
  );
  await role("anon");
  await expect(value("SELECT watch_device_history_read($1) AS v", [first])).rejects.toThrow(
    "permission denied",
  );
});
it("retains exactly the last 90 completed days at the oldest-day boundary", async () => {
  await role("service_role");
  await db.query(
    "INSERT INTO watch_pro_history(user_id,day,report) VALUES($1,date '2026-11-01'-90,'{}'),($1,date '2026-11-01'-91,'{}') ON CONFLICT DO NOTHING",
    [user],
  );
  await worker("enqueue", { now: "2026-11-01T01:00:00Z" });
  expect(
    await value<number>(
      "SELECT count(*)::integer AS v FROM watch_pro_history WHERE user_id=$1 AND day=date '2026-11-01'-90",
      [user],
    ),
  ).toBe(1);
  expect(
    await value<number>(
      "SELECT count(*)::integer AS v FROM watch_pro_history WHERE user_id=$1 AND day=date '2026-11-01'-91",
      [user],
    ),
  ).toBe(0);
});
it("free export reads only the signed-in owner and history, while bulk and mail remain Pro", async () => {
  await role("service_role");
  await db.query("UPDATE watch_billing SET status=NULL,period_end=NULL WHERE user_id=$1", [other]);
  await role("authenticated", other);
  const fleet = await value<{ devices: { id: string }[] }>(
    "SELECT watch_mutate_device('create',$1) AS v",
    [
      JSON.stringify({
        name: "Free export test",
        binding: { project: "flyai", identifier: wallet(998) },
      }),
    ],
  );
  const id = fleet.devices[0]!.id;
  const report = { day: "2026-10-10", usdSubtotal: 12, projects: [] };
  const own = [{ id, report, deviceReport: report, walletProjects: [] }];
  await role("service_role");
  await db.query(
    "INSERT INTO watch_pro_history(user_id,day,report,device_reports) VALUES($1,'2026-10-10',$2,$3) ON CONFLICT(user_id,day) DO UPDATE SET report=excluded.report,device_reports=excluded.device_reports",
    [other, JSON.stringify(report), JSON.stringify(own)],
  );
  await role("authenticated", other);
  expect(await value("SELECT watch_export_history_read(NULL) AS v")).toEqual([report]);
  expect(await value("SELECT watch_export_history_read($1) AS v", [id])).toEqual([
    { report, deviceReport: report, walletProjects: [] },
  ]);
  expect(await value("SELECT watch_history_read() AS v")).toEqual([report]);
  expect(await value("SELECT watch_device_history_read($1) AS v", [id])).toEqual([
    { report, deviceReport: report, walletProjects: [] },
  ]);
  await role("authenticated", user);
  await expect(value("SELECT watch_export_history_read($1) AS v", [id])).rejects.toThrow(
    "device_not_found",
  );
  await role("anon");
  await expect(value("SELECT watch_export_history_read(NULL) AS v")).rejects.toThrow(
    "permission denied",
  );
  await role("service_role");
  await db.query("DELETE FROM watch_devices WHERE user_id=$1", [other]);
  await db.query("DELETE FROM watch_pro_history WHERE user_id=$1", [other]);
});
it("captures free users earnings for exports without granting them any automatic email job", async () => {
  await role("authenticated", other);
  await value("SELECT watch_mutate_device('create',$1) AS v", [
    JSON.stringify({
      name: "Free capture",
      binding: { project: "flyai", identifier: wallet(999) },
    }),
  ]);
  await role("service_role");
  const now = "2026-10-11T00:10:00Z";
  await worker("enqueue", { now });
  await db.query("UPDATE watch_pro_tasks SET status='done' WHERE user_id<>$1", [other]);
  const t = (await worker("claim", { now })) as {
    id: string;
    lease: string;
    kind: string;
    user_id: string;
  };
  expect(t.kind).toBe("snapshot");
  expect(t.user_id).toBe(other);
  expect(
    await worker("history", {
      ...t,
      report: { day: "2026-10-10", projects: [] },
      devices: [],
      now,
    }),
  ).toBe(true);
  expect(
    await value<number>(
      "SELECT count(*)::integer AS v FROM watch_pro_tasks WHERE user_id=$1 AND kind IN ('alert','monthly','sample')",
      [other],
    ),
  ).toBe(0);
});
