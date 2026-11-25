import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, afterEach, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { bntWorkerHistoryCron, readBntWorkerHistory } from "./bnt-worker-history.server";
import { workerHistoryPoints, workerSparkline } from "./bnt-worker-history";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { rpc } }));

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
  await db.exec(readFileSync("supabase/migrations/20261125120000_bnt_worker_history_targets.sql", "utf8"));
});
afterAll(() => db.close());
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it("blocks client writes and anonymous reads, persists idempotently and isolates owners", async () => {
  await role("authenticated");
  await expect(
    db.query("SELECT watch_bnt_worker_history_record($1,$2,now(),'[]')", [user, address]),
  ).rejects.toThrow(/permission denied/);
  await expect(db.query("SELECT * FROM watch_bnt_worker_samples")).rejects.toThrow(
    /permission denied/,
  );
  await expect(db.query("SELECT watch_bnt_worker_history_targets()")).rejects.toThrow(
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

it("collects while no page is open and reads the stored gaps per Worker", async () => {
  // Test miner address from Seine's public developer-fee configuration.
  const wallet = "SEiNEceuDyfEY3GKDQAYVuK6382K2Ln2gQSv83ySAFkKhraBxhHnTf2P6PsF8CXtreqywg4T1qwBAjQo3L2VYDYWtsbb9";
  await db.exec("RESET ROLE; DELETE FROM watch_bindings; DELETE FROM watch_bnt_worker_samples");
  await db.query("INSERT INTO watch_bindings VALUES($1,'bnt',$3,'a'),($1,'bnt',$3,'b'),($2,'bnt',$3,'a'),($2,'prl','ignored','')", [user, other, wallet]);
  await role("service_role");
  const call = async (name: string, args = {}) => {
    const values = Object.values(args);
    const params = values.map((_, i) => `$${i + 1}`).join(",");
    const query = await db.query<{ value: unknown }>(`SELECT ${name}(${params}) AS value`, values);
    return { data: query.rows[0]!.value, error: null };
  };
  rpc.mockImplementation(call);
  const client = { rpc: call } as unknown as SupabaseClient;
  const secret = "test-only-bnt-history-scheduler-secret";
  vi.stubEnv("DAILY_REPORTS_CRON_SECRET", secret);
  const cronRequest = (token: string) => new Request("http://app:3000/api/bnt/worker-history/cron", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  });
  const fetchMiner = vi.fn()
    .mockResolvedValueOnce(Response.json({ hashrate: 4, workers: [{ worker: "a", hashrate: 0 }, { worker: "b", hashrate: 4 }] }))
    .mockResolvedValueOnce(new Response(null, { status: 503 }))
    .mockResolvedValueOnce(Response.json({ hashrate: 7, workers: [{ worker: "a", hashrate: 7 }] }));
  vi.stubGlobal("fetch", fetchMiner);
  expect((await bntWorkerHistoryCron(cronRequest("wrong-token"))).status).toBe(401);
  expect(rpc).not.toHaveBeenCalled();
  expect(fetchMiner).not.toHaveBeenCalled();

  const firstTick = Date.now();
  vi.useFakeTimers({ toFake: ["Date"] });
  for (const [offset, status] of [[0, 200], [300_000, 502], [600_000, 200]] as const) {
    vi.setSystemTime(firstTick + offset);
    const response = await bntWorkerHistoryCron(cronRequest(secret));
    expect(response.status).toEqual(status);
  }
  expect(fetchMiner).toHaveBeenCalledTimes(3);
  expect(fetchMiner.mock.calls.map(([url]) => url)).toEqual(
    Array(3).fill(`https://bntpool.com/api/miner/${wallet}`),
  );
  await role("authenticated", user);
  const history = await readBntWorkerHistory(client, wallet);
  const a = workerHistoryPoints(history.samples, "a");
  expect(a.map((p) => p.hashrate)).toEqual([0, 7]);
  expect(workerSparkline(a)).toHaveLength(2);
  expect(workerHistoryPoints(history.samples, "b").map((p) => p.hashrate)).toEqual([4, null]);
  await role("authenticated", other);
  expect((await readBntWorkerHistory(client, wallet)).samples.flatMap((s) => s.workers.map((w) => w.name))).toEqual(["a", "a"]);
  expect(fetchMiner).toHaveBeenCalledTimes(3);
});
