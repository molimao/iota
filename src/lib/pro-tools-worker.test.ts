import { it, expect, vi, beforeEach, afterEach } from "vitest";
const state = vi.hoisted(() => ({
  rpc: vi.fn(),
  agents: vi.fn(),
  auth: vi.fn(),
  collect: vi.fn(),
  signal: vi.fn(),
  send: vi.fn(),
  config: vi.fn(),
}));
vi.mock("./pro-alert-agents.server", () => ({ readAlertAgents: state.agents }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
vi.mock("./watch-db", () => ({ watchDb: () => ({ rpc: state.rpc }) }));
vi.mock("./daily-report-cron-auth.server", () => ({ authenticateReportCron: state.auth }));
vi.mock("./daily-report-collect.server", () => ({ collectReportBinding: state.collect }));
vi.mock("./pro-alerts.server", () => ({
  collectAlertSignal: state.signal,
  alertResource: () => "resource",
}));
vi.mock("./daily-report-send.server", () => ({
  reportEmailConfig: state.config,
  sendReportEmail: state.send,
}));
vi.mock("./iota-price.server", () => ({
  fetchIotaUsdPrice: async () => ({
    usdPerIota: 2,
    error: null,
    stale: false,
    fetchedAt: Date.now(),
    quotedAt: Date.now(),
  }),
}));
import { proToolsCron } from "./pro-tools-worker.server";
import { proUnsubscribe } from "./pro-unsubscribe.server";
const id = "11111111-1111-4111-8111-111111111111";
const now = Date.parse("2026-10-11T01:30:00Z");
const job = {
  id,
  user_id: id,
  kind: "snapshot",
  task_key: "2026-10-10",
  bindings: [{ project: "iota", identifier: "public", device: id, name: "Demo" }],
  cursor: 0,
  data: [],
  lease: id,
  recipient: "reader@example.invalid",
  locale: "en",
  unsubscribe_token: id,
  attempts: 1,
};
const post = () => new Request("https://iotahome.site/api/pro/cron", { method: "POST" });
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("PRO_TOOLS_ENABLED", "true");
  vi.useFakeTimers();
  vi.setSystemTime(now);
  state.auth.mockResolvedValue(null);
  state.config.mockReturnValue({ from: "reports@reports.iotahome.site", key: "re_mock" });
  state.rpc.mockImplementation(async (_fn, args) => ({
    data: args.p_action === "claim" ? null : true,
    error: null,
  }));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
it("rejects unauthorized, disabled and non-POST work before database calls", async () => {
  expect((await proToolsCron(new Request("https://iotahome.site/api/pro/cron"))).status).toBe(405);
  state.auth.mockResolvedValue(new Response("Denied", { status: 401 }));
  expect((await proToolsCron(post())).status).toBe(401);
  expect(state.rpc).not.toHaveBeenCalled();
  state.auth.mockResolvedValue(null);
  vi.stubEnv("PRO_TOOLS_ENABLED", "false");
  expect((await proToolsCron(post())).status).toBe(503);
  expect(state.rpc).not.toHaveBeenCalled();
});
it("collects historical bindings in bounded chunks and writes a valid immutable snapshot", async () => {
  let claimed = false;
  state.collect.mockResolvedValue({
    project: "iota",
    resource: "public",
    units: "123456789",
    decimals: 8,
    currency: "IOTA",
    usd: null,
  });
  state.rpc.mockImplementation(async (_fn, args) => ({
    data: args.p_action === "claim" ? (claimed ? null : ((claimed = true), job)) : true,
    error: null,
  }));
  expect((await proToolsCron(post())).status).toBe(200);
  const progress = state.rpc.mock.calls.find((c) => c[1].p_action === "progress")?.[1].p_payload;
  expect(progress.cursor).toBe(1);
  expect(progress.data[0].units).toBe("123456789");
  claimed = false;
  state.rpc.mockImplementation(async (_fn, args) => ({
    data:
      args.p_action === "claim"
        ? claimed
          ? null
          : ((claimed = true), { ...job, cursor: 1, data: progress.data })
        : true,
    error: null,
  }));
  await proToolsCron(post());
  expect(
    state.rpc.mock.calls.find((c) => c[1].p_action === "history")?.[1].p_payload.report,
  ).toMatchObject({ day: "2026-10-10", usdSubtotal: 2.46913578 });
  expect(state.send).not.toHaveBeenCalled();
});
it("durably freezes notifications before delivery and rechecks consent before contacting the mail provider", async () => {
  const mailJob = {
    ...job,
    kind: "alert",
    bindings: [],
    data: {
      event: { name: "Demo", project: "iota", identifier: "public" },
      since: "2026-10-11T00:00:00Z",
    },
  };
  let claimed = false;
  state.rpc.mockImplementation(async (_fn, args) => ({
    data: args.p_action === "claim" ? (claimed ? null : ((claimed = true), mailJob)) : true,
    error: null,
  }));
  await proToolsCron(post());
  expect(state.send).not.toHaveBeenCalled();
  const frozen = state.rpc.mock.calls.find((c) => c[1].p_action === "progress")?.[1].p_payload.data;
  expect(frozen.email.subject).toContain("Device status");
  expect(frozen.event.project).toBe("iota");
  claimed = false;
  state.rpc.mockImplementation(async (_fn, args) => ({
    data:
      args.p_action === "claim"
        ? claimed
          ? null
          : ((claimed = true), { ...mailJob, data: frozen })
        : args.p_action === "can_send"
          ? false
          : true,
    error: null,
  }));
  await proToolsCron(post());
  expect(state.send).not.toHaveBeenCalled();
  claimed = false;
  state.send.mockResolvedValue("mock-receipt");
  state.rpc.mockImplementation(async (_fn, args) => ({
    data:
      args.p_action === "claim"
        ? claimed
          ? null
          : ((claimed = true), { ...mailJob, data: frozen })
        : true,
    error: null,
  }));
  await proToolsCron(post());
  expect(state.send).toHaveBeenCalledWith(
    expect.anything(),
    "reader@example.invalid",
    expect.objectContaining({ subject: frozen.email.subject }),
    `iota-watch-pro/${id}`,
    expect.stringContaining("/api/pro/unsubscribe"),
  );
});
it("generates monthly mail from stored days and never fills absent history with zero", async () => {
  let claimed = false;
  state.rpc.mockImplementation(async (_fn, args) => ({
    data:
      args.p_action === "claim"
        ? claimed
          ? null
          : ((claimed = true), { ...job, kind: "monthly", task_key: "2026-09", bindings: [] })
        : args.p_action === "read_history"
          ? []
          : true,
    error: null,
  }));
  await proToolsCron(post());
  const frozen = state.rpc.mock.calls.find((c) => c[1].p_action === "progress")?.[1].p_payload.data;
  expect(frozen.email.text).toContain("0/30");
  expect(frozen.email.text).toContain("—");
  expect(state.send).not.toHaveBeenCalled();
});
it("GET unsubscribe is harmless and POST returns no address or eligibility information", async () => {
  const url = "https://iotahome.site/api/pro/unsubscribe?token=" + id + "&locale=ko";
  expect((await proUnsubscribe(new Request(url))).status).toBe(200);
  expect(state.rpc).not.toHaveBeenCalled();
  const r = await proUnsubscribe(new Request(url, { method: "POST" }));
  expect(r.status).toBe(200);
  expect(await r.text()).not.toContain("reader@");
  expect(state.rpc).toHaveBeenCalledWith("watch_pro_worker", {
    p_action: "unsubscribe",
    p_payload: { token: id },
  });
});

it("passes task-owned local evidence to alert sampling and preserves unknown on failed pairing reads", async () => {
  const agent = {deviceId:id,lastSeen:new Date(now).toISOString(),snapshot:{appRunning:true,workerRunning:true},logsEnabled:false,recoveryEnabled:false,pending:null,latestCommand:null};
  for (const agents of [new Map([[id,agent]]), null]) {
    state.agents.mockResolvedValue(agents);
    state.signal.mockResolvedValue("unknown");
    let claimed = false;
    state.rpc.mockImplementation(async (_fn, args) => ({
      data: args.p_action === "claim" ? (claimed ? null : ((claimed = true), {...job,kind:"sample"})) : true,
      error: null,
    }));
    expect((await proToolsCron(post())).status).toBe(200);
    expect(state.agents).toHaveBeenLastCalledWith({},id,[id]);
    expect(state.signal).toHaveBeenLastCalledWith(job.bindings[0],expect.any(Function),{available:agents!==null,agent:agents?.get(id)??null});
    const observations=state.rpc.mock.calls.filter(c=>c[1].p_action==="observe");
    expect(observations.at(-1)?.[1].p_payload.signal).toBe("unknown");
  }
});
