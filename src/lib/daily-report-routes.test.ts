import { it, expect, vi } from "vitest";
const state = vi.hoisted(() => ({
  rpc: vi.fn(),
  auth: vi.fn(async () => new Response("Unauthorized", { status: 401 })),
}));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
vi.mock("./watch-db", () => ({ watchDb: () => ({ rpc: state.rpc }) }));
vi.mock("@/integrations/supabase/cron-auth", () => ({ authenticateCronRequest: state.auth }));
import { reportCron } from "./daily-report-jobs.server";
import { reportUnsubscribe } from "./daily-report-unsubscribe.server";
it("rejects unauthorized and non-POST cron requests before any private reads", async () => {
  state.rpc.mockClear();
  expect((await reportCron(new Request("https://iotahome.site/api/reports/cron"))).status).toBe(
    405,
  );
  expect(
    (await reportCron(new Request("https://iotahome.site/api/reports/cron", { method: "POST" })))
      .status,
  ).toBe(401);
  expect(state.rpc).not.toHaveBeenCalled();
});
it("does not unsubscribe on GET and makes POST repeatable without exposing recipient data", async () => {
  const url =
    "https://iotahome.site/api/reports/unsubscribe?token=11111111-1111-4111-8111-111111111111&locale=ja";
  state.rpc.mockClear();
  const get = await reportUnsubscribe(new Request(url));
  expect(get.status).toBe(200);
  expect(get.headers.get("Referrer-Policy")).toBe("no-referrer");
  expect(state.rpc).not.toHaveBeenCalled();
  state.rpc.mockResolvedValue({ data: false, error: null });
  expect((await reportUnsubscribe(new Request(url, { method: "POST" }))).status).toBe(200);
  expect(state.rpc).toHaveBeenCalledWith("watch_report_unsubscribe", {
    p_token: "11111111-1111-4111-8111-111111111111",
  });
  expect(
    (
      await reportUnsubscribe(
        new Request("https://iotahome.site/api/reports/unsubscribe?token=bad"),
      )
    ).status,
  ).toBe(400);
});
