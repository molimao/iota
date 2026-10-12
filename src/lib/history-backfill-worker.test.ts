import { it, expect, vi, beforeEach, afterEach } from "vitest";
const state = vi.hoisted(() => ({ rpc: vi.fn(), auth: vi.fn(), collect: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
vi.mock("./watch-db", () => ({ watchDb: () => ({ rpc: state.rpc }) }));
vi.mock("./daily-report-cron-auth.server", () => ({ authenticateReportCron: state.auth }));
vi.mock("./history-backfill-collect.server", () => ({ collectHistoricalResource: state.collect }));
import { historyBackfillCron } from "./history-backfill-worker.server";
const id = "11111111-1111-4111-8111-111111111111",
  now = Date.parse("2026-10-11T04:00:00Z");
const job = {
  id,
  lease: id,
  user_id: id,
  start_day: "2026-10-05",
  end_day: "2026-10-09",
  cursor: 0,
  day_cursor: 0,
  locale: "en",
  bindings: [{ project: "iota", identifier: "public", device: id, name: "Demo" }],
  data: [],
};
const resource = {
  project: "iota",
  resource: "public",
  days: [{ day: "2026-10-06", units: "100000000", usd: null, partial: true, fetchedAt: now }],
};
const post = (body = "{}") =>
  new Request("https://iotahome.site/api/history/backfill", { method: "POST", body });
beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(now);
  vi.stubEnv("PRO_TOOLS_ENABLED", "true");
  state.auth.mockResolvedValue(null);
  state.rpc.mockImplementation(async (_f, a) => ({
    data: a.p_action === "claim" ? null : true,
    error: null,
  }));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
it("requires cron authentication and validates bodies before enqueuing any account", async () => {
  expect(
    (await historyBackfillCron(new Request("https://iotahome.site/api/history/backfill"))).status,
  ).toBe(405);
  state.auth.mockResolvedValue(new Response("Denied", { status: 401 }));
  expect((await historyBackfillCron(post())).status).toBe(401);
  state.auth.mockResolvedValue(null);
  vi.stubEnv("PRO_TOOLS_ENABLED", "false");
  expect((await historyBackfillCron(post())).status).toBe(503);
  vi.stubEnv("PRO_TOOLS_ENABLED", "true");
  expect((await historyBackfillCron(post('{"user":"other"}'))).status).toBe(400);
  expect((await historyBackfillCron(post("invalid"))).status).toBe(400);
  expect(state.rpc).not.toHaveBeenCalled();
});
it("collects once per resource and writes native-only owner/device snapshots without a current quote", async () => {
  let claimed = false;
  state.collect.mockResolvedValue({ resource, complete: true, next: 0 });
  state.rpc.mockImplementation(async (_f, a) => ({
    data: a.p_action === "claim" ? (claimed ? null : ((claimed = true), job)) : true,
    error: null,
  }));
  expect((await historyBackfillCron(post())).status).toBe(200);
  const progress = state.rpc.mock.calls.find((c) => c[1].p_action === "progress")![1].p_payload;
  expect(progress).toMatchObject({ cursor: 1, day_cursor: 0, data: [resource] });
  expect(state.collect).toHaveBeenCalledTimes(1);
  claimed = false;
  state.rpc.mockImplementation(async (_f, a) => ({
    data:
      a.p_action === "claim"
        ? claimed
          ? null
          : ((claimed = true), { ...job, cursor: 1, data: progress.data })
        : a.p_action === "write"
          ? 0
          : true,
    error: null,
  }));
  await historyBackfillCron(post());
  const row = state.rpc.mock.calls.find((c) => c[1].p_action === "write")![1].p_payload.rows[0];
  expect(row.report).toMatchObject({
    source: "backfill",
    day: "2026-10-06",
    usdSubtotal: null,
    projects: [{ amount: "1" }],
  });
  expect(row.devices[0].id).toBe(id);
});
it("persists a bounded day cursor for private/date-window providers and resumes without repeating days", async () => {
  let claimed = false;
  state.collect.mockResolvedValue({
    resource: { ...resource, project: "vast" },
    complete: false,
    next: 1,
  });
  state.rpc.mockImplementation(async (_f, a) => ({
    data:
      a.p_action === "claim"
        ? claimed
          ? null
          : ((claimed = true), { ...job, bindings: [{ ...job.bindings[0], project: "vast" }] })
        : true,
    error: null,
  }));
  await historyBackfillCron(post());
  expect(
    state.rpc.mock.calls.find((c) => c[1].p_action === "progress")![1].p_payload,
  ).toMatchObject({ cursor: 0, day_cursor: 1 });
});
it("retains progress and retries failures without inserting unknown data", async () => {
  let claimed = false;
  state.collect.mockRejectedValue(new Error("offline"));
  state.rpc.mockImplementation(async (_f, a) => ({
    data: a.p_action === "claim" ? (claimed ? null : ((claimed = true), job)) : true,
    error: null,
  }));
  await historyBackfillCron(post());
  expect(state.rpc.mock.calls.some((c) => c[1].p_action === "retry")).toBe(true);
  expect(
    state.rpc.mock.calls.some((c) => c[1].p_action === "write" || c[1].p_action === "progress"),
  ).toBe(false);
});
