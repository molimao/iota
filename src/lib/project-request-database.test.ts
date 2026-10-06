import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
let db: PGlite;
const alice = "11111111-1111-4111-8111-111111111111",
  bob = "22222222-2222-4222-8222-222222222222";
const id = "33333333-3333-4333-8333-333333333333";
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY); CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;GRANT USAGE ON SCHEMA auth,public TO anon,authenticated,service_role;",
  );
  await db.query("INSERT INTO auth.users VALUES($1),($2)", [alice, bob]);
  await db.exec(readFileSync("supabase/migrations/20261006213000_project_requests.sql", "utf8"));
}, 30000);
afterAll(() => db.close());
async function asUser(user: string) {
  await db.exec("RESET ROLE;SET ROLE authenticated;");
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)", [user]);
}
async function submit(
  request = id,
  name = "Project's compute",
  url = "https://example.com/",
  description = "CPU, GPU tasks",
) {
  const r = await db.query<{ result: { status: string; nextAt: string } }>(
    "SELECT watch_submit_project_request($1,$2,$3,$4,'zh') AS result",
    [request, name, url, description],
  );
  return r.rows[0]!.result;
}
describe("authenticated daily request limit", () => {
  it("rejects anonymous submissions and direct table writes", async () => {
    await db.exec("SET ROLE anon");
    await expect(submit()).rejects.toThrow(/permission denied/);
    await asUser(alice);
    await expect(
      db.query(
        "INSERT INTO watch_project_requests(user_id,request_id,project_name,official_url,description,locale) VALUES($1,$2,'Name','https://example.com/','','zh')",
        [alice, id],
      ),
    ).rejects.toThrow(/permission denied/);
    await db.query("SELECT set_config('request.jwt.claim.sub','',false)");
    await expect(submit()).rejects.toThrow(/not_authenticated/);
  });
  it("does not consume the quota for invalid SQL-level inputs", async () => {
    await asUser(alice);
    for (const [name, url, description] of [
      ["<b>name</b>", "https://example.com/", ""],
      ["name", "javascript:alert(1)", ""],
      ["name", "https://127.0.0.1/", ""],
      ["name", "https://example.com/?token=x", ""],
      ["name", "https://example.com/", "x".repeat(1001)],
    ])
      await expect(submit(id, name, url, description)).rejects.toThrow();
    const r = await db.query<{ s: { canSubmit: boolean } }>(
      "SELECT watch_project_request_status() AS s",
    );
    expect(r.rows[0]!.s.canSubmit).toBe(true);
  });
  it("accepts one request per day, makes retries idempotent and prevents another request", async () => {
    await asUser(alice);
    const a = await submit();
    expect(a.status).toBe("submitted");
    expect(await submit()).toEqual(a);
    const [b, c] = await Promise.all([
      submit("44444444-4444-4444-8444-444444444444"),
      submit("55555555-5555-4555-8555-555555555555"),
    ]);
    expect(b.status).toBe("daily-limit");
    expect(c.status).toBe("daily-limit");
    const rows = await db.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM watch_project_requests",
    );
    expect(rows.rows[0]!.n).toBe(1);
    const hkDay = new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
    const next = Date.parse(hkDay + "T00:00:00+08:00") + 86400000;
    expect(Date.parse(a.nextAt)).toBe(next);
  });
  it("isolates account reads and allows an independent daily quota for another account", async () => {
    await asUser(bob);
    expect((await db.query("SELECT * FROM watch_project_requests")).rows).toHaveLength(0);
    expect((await submit(id, "Another project")).status).toBe("submitted");
    await expect(db.exec("DELETE FROM watch_project_requests")).rejects.toThrow(
      /permission denied/,
    );
    await expect(
      db.exec("UPDATE watch_project_requests SET submitted_day=submitted_day-1"),
    ).rejects.toThrow(/permission denied/);
  });
  it("allows a new submission on a new server day", async () => {
    await db.exec("RESET ROLE");
    await db.query(
      "UPDATE watch_project_requests SET submitted_day=submitted_day-1 WHERE user_id=$1",
      [alice],
    );
    await asUser(alice);
    expect((await submit("66666666-6666-4666-8666-666666666666")).status).toBe("submitted");
  });
});
