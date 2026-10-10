import { describe, it, expect } from "vitest";
import {
  yesterdayReportWindow,
  nextReportAt,
  reportDayWindow,
  iotaWindowUnits,
  aggregateDailyReport,
  decimalUnits,
  reportPreferenceInput,
} from "./daily-report";
import { renderDailyReport } from "./daily-report-email";
import { sampleReportEmail } from "../components/daily-report-preview";
import { sendReportEmail, reportEmailConfig } from "./daily-report-send.server";
import { LOCALES, ORIGIN } from "./site";
const w = reportDayWindow("2026-10-09");
describe("daily earnings accounting and mail safety", () => {
  it("uses yesterday Beijing midnight and dispatches at 09:30, independent of host timezone", () => {
    expect(yesterdayReportWindow(Date.parse("2026-10-10T01:30:00Z"))).toEqual(w);
    expect(w.start).toBe(Date.parse("2026-10-08T16:00:00Z"));
    expect(w.end).toBe(Date.parse("2026-10-09T16:00:00Z"));
    expect(w.due).toBe(Date.parse("2026-10-10T01:30:00Z"));
    expect(nextReportAt(w.due)).toBe(w.due + 86400000);
    expect(() => reportDayWindow("2026-02-30")).toThrow();
  });
  it("counts eligible history in a half-open window and never turns malformed history into zero", () => {
    const h = {
      alpha_amounts: [1, 2, 3, 4, 5],
      timestamps: [
        w.start / 1000 - 1,
        w.start / 1000,
        w.end / 1000 - 1,
        w.end / 1000,
        w.start / 1000 + 1,
      ],
      statuses: ["settled", "pending", "settled", "settled", "frozen"],
    };
    expect(iotaWindowUnits(h, w)).toBe("500000000");
    expect(iotaWindowUnits({ ...h, statuses: [] }, w)).toBeNull();
    expect(iotaWindowUnits(null, w)).toBeNull();
    expect(iotaWindowUnits({ alpha_amounts: [], timestamps: [], statuses: [] }, w)).toBe("0");
  });
  it("deduplicates identifiers within projects, preserves exact token units and separates unknown values", () => {
    const a = {
      project: "iota" as const,
      resource: "same",
      units: "123456789",
      decimals: 8,
      currency: "IOTA",
      usd: 7.5,
    };
    const report = aggregateDailyReport(
      w,
      [
        a,
        a,
        { ...a, resource: "other", units: null, usd: null, reason: "unavailable" },
        {
          project: "quantus",
          resource: "wallet",
          units: "1000000000001",
          decimals: 12,
          currency: "QTC",
          usd: null,
        },
      ],
      "zh",
      3,
    );
    expect(report.projects[0]).toMatchObject({
      amount: "1.23456789",
      known: 1,
      total: 2,
      partial: true,
    });
    expect(report.projects[1]?.amount).toBe("1.000000000001");
    expect(report.usdSubtotal).toBe(7.5);
    expect(report.partial).toBe(true);
    expect(decimalUnits("100000000000000000000000000000000001", 12)).toBe(
      "100000000000000000000000.000000000001",
    );
  });
  it("renders localized HTML and text with no scripts, tracking pixels or unescaped fields", () => {
    for (const locale of LOCALES) {
      const email = sampleReportEmail(locale);
      expect(email.html.length).toBeLessThan(90000);
      expect(email.text).toContain("IOTA");
      expect(email.html).not.toContain("<script");
      expect(email.html).not.toContain("<img");
      expect(email.html).toContain("/api/reports/unsubscribe");
    }
    const report = aggregateDailyReport(
      w,
      [{ project: "iota", resource: "id", units: "0", decimals: 8, currency: "IOTA", usd: null }],
      "en",
      1,
    );
    report.projects[0]!.name = "<img src=x onerror=alert(1)>";
    expect(renderDailyReport(report, ORIGIN + "/api/reports/unsubscribe?token=x").html).toContain(
      "&lt;img",
    );
    expect(() => renderDailyReport(report, "https://evil.example/unsubscribe")).toThrow();
    expect(
      reportPreferenceInput.safeParse({
        enabled: true,
        locale: "zh",
        recipient: "evil@example.com",
      }).success,
    ).toBe(false);
  });
  it("requires an explicitly enabled server config and sends a single-recipient idempotent message", async () => {
    expect(
      reportEmailConfig({
        RESEND_API_KEY: "re_test",
        DAILY_REPORTS_FROM: "noreply@reports.iotahome.site",
      }),
    ).toBeNull();
    expect(
      reportEmailConfig({
        DAILY_REPORTS_ENABLED: "true",
        RESEND_API_KEY: "re_test",
        DAILY_REPORTS_FROM: "evil@example.com",
      }),
    ).toBeNull();
    let calls = 0;
    const fake: typeof fetch = async (_, init) => {
      calls++;
      const h = new Headers(init?.headers);
      expect(h.get("Idempotency-Key")).toBe("job/day");
      const body = JSON.parse(String(init?.body));
      expect(body.to).toEqual(["reader@example.invalid"]);
      expect(body.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
      return new Response(JSON.stringify({ id: "receipt" }), { status: 200 });
    };
    expect(
      await sendReportEmail(
        { key: "re_test", from: "noreply@reports.iotahome.site" },
        "reader@example.invalid",
        sampleReportEmail("en"),
        "job/day",
        ORIGIN + "/api/reports/unsubscribe?token=x",
        fake,
      ),
    ).toBe("receipt");
    expect(calls).toBe(1);
    await expect(
      sendReportEmail(
        { key: "re_test", from: "noreply@reports.iotahome.site" },
        "reader@example.invalid",
        sampleReportEmail("en"),
        "job/day",
        ORIGIN + "/api/reports/unsubscribe",
        async () => new Response("{}", { status: 429, headers: { "retry-after": "120" } }),
      ),
    ).rejects.toMatchObject({ retryable: true, retryAfterSeconds: 120 });
  });
});
