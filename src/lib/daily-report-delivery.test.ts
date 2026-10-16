import { beforeEach, afterEach, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ rpc: vi.fn(), collect: vi.fn(), send: vi.fn(), quote: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
vi.mock("./watch-db", () => ({ watchDb: () => ({ rpc: state.rpc }) }));
vi.mock("./daily-report-cron-auth.server", () => ({ authenticateReportCron: async () => null }));
vi.mock("./daily-report-collect.server", () => ({ collectEmailReportBinding: state.collect }));
vi.mock("./iota-price.server", () => ({ fetchIotaUsdPrice: state.quote }));
vi.mock("./daily-report-send.server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./daily-report-send.server")>()),
  reportEmailConfig: () => ({ key: "test-only", from: "test@example.com" }),
  sendReportEmail: state.send,
}));
import { reportCron } from "./daily-report-jobs.server";
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-16T01:30:00Z"));
  vi.clearAllMocks();
});
afterEach(() => vi.useRealTimers());
it("refreshes morning IOTA records and sends the same day attribution as the website, without a stale history override", async () => {
  const job = {
    id: "11111111-1111-4111-8111-111111111111",
    user_id: "22222222-2222-4222-8222-222222222222",
    report_day: "2026-10-15",
    recipient: "test@example.com",
    locale: "zh",
    device_count: 1,
    bindings: [{ project: "iota", identifier: "public-test" }],
    cursor: 1,
    lease_token: "33333333-3333-4333-8333-333333333333",
    unsubscribe_token: "44444444-4444-4444-8444-444444444444",
    attempts: 0,
    payload: null as unknown,
    status: "ready",
    readings: [
      {
        project: "iota",
        resource: "public-test",
        units: "276373384",
        usd: null,
        currency: "IOTA",
        decimals: 8,
        fetchedAt: Date.now() - 90 * 60000,
      },
    ],
  };
  state.collect.mockResolvedValue({
    project: "iota",
    resource: "public-test",
    units: "16464501",
    usd: null,
    currency: "IOTA",
    decimals: 8,
    fetchedAt: Date.now(),
  });
  state.quote.mockResolvedValue({
    usdPerIota: 6.74,
    stale: false,
    error: null,
    fetchedAt: Date.now(),
    quotedAt: Date.now(),
  });
  state.send.mockResolvedValue("test-provider-id");
  state.rpc.mockImplementation(async (fn, p) => {
    if (fn === "watch_enqueue_reports") return { data: 0, error: null };
    if (fn === "watch_claim_report")
      return { data: job.status === "sent" ? null : { ...job }, error: null };
    if (fn === "watch_report_can_send") return { data: true, error: null };
    if (fn === "watch_update_report") {
      job.readings = p.p_readings;
      job.status = p.p_status;
      if (p.p_payload) job.payload = p.p_payload;
      return { data: true, error: null };
    }
    throw new Error("Unexpected RPC");
  });
  const r = await reportCron(
    new Request("https://iotahome.site/api/reports/cron", { method: "POST" }),
  );
  expect(r.status).toBe(200);
  expect(job.status).toBe("sent");
  expect(state.collect).toHaveBeenCalledTimes(1);
  expect(state.send).toHaveBeenCalledTimes(1);
  const email = state.send.mock.calls[0]![2];
  expect(email.subject).toContain("2026-10-15");
  expect(email.text).toContain("0.16464501 IOTA");
  expect(email.text).toContain("$1.11 USD");
  expect(email.text).not.toContain("2.76373384");
});
