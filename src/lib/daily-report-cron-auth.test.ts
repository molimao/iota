import { afterEach, expect, it, vi } from "vitest";
import { authenticateReportCron } from "./daily-report-cron-auth.server";
afterEach(() => vi.unstubAllEnvs());
const request = (token?: string) =>
  new Request("https://iotahome.site/api/reports/cron", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
it("accepts only report credentials and their rotation predecessor when configured", async () => {
  const current = "report-" + "a".repeat(40),
    previous = "report-" + "b".repeat(40),
    managed = "managed-" + "c".repeat(40);
  vi.stubEnv("DAILY_REPORTS_CRON_SECRET", current);
  vi.stubEnv("DAILY_REPORTS_CRON_SECRET_PREVIOUS", previous);
  vi.stubEnv("LOVABLE_CRON_SECRET", managed);
  expect(await authenticateReportCron(request(current))).toBeNull();
  expect(await authenticateReportCron(request(previous))).toBeNull();
  for (const token of [undefined, managed, "wrong", current + "," + previous])
    expect((await authenticateReportCron(request(token)))?.status).toBe(401);
});
it("rejects invalid report configuration and preserves managed authentication until configured", async () => {
  vi.stubEnv("DAILY_REPORTS_CRON_SECRET", "short");
  expect((await authenticateReportCron(request("short")))?.status).toBe(500);
  vi.stubEnv("DAILY_REPORTS_CRON_SECRET", "");
  const managed = "managed-" + "c".repeat(40);
  vi.stubEnv("LOVABLE_CRON_SECRET", managed);
  vi.stubEnv("LOVABLE_CRON_SECRET_PREVIOUS", "");
  expect(await authenticateReportCron(request(managed))).toBeNull();
  expect((await authenticateReportCron(request("wrong")))?.status).toBe(401);
});
