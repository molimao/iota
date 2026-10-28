import { describe, it, expect } from "vitest";
import {
  yesterdayReportWindow,
  nextReportAt,
  reportDayWindow,
  iotaWindowUnits,
  aggregateDailyReport,
  applyMarketUsd,
  decimalUnits,
  reportPreferenceInput,
  sumDecimalStrings,
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
    const priced = aggregateDailyReport(
      w,
      [
        {
          project: "kas",
          resource: "miner",
          units: "250000000000",
          decimals: 12,
          currency: "KAS",
          usd: 0.89,
          period: "rolling24h",
        },
        {
          project: "bnt",
          resource: "wallet",
          units: "150000000000",
          decimals: 12,
          currency: "BNT",
          usd: 2,
          period: "balance",
        },
      ],
      "zh",
      1,
    );
    expect(priced.usdSubtotal).toBe(0.89);
    expect(priced.projects.find((p) => p.project === "bnt")?.usd).toBe(2);
    expect(priced.projects.find((p) => p.project === "kas")?.period).toBe("rolling24h");
    expect(sumDecimalStrings(["1.5", "0.25"], 12)).toBe("1750000000000");
    expect(
      applyMarketUsd(
        [
          {
            project: "kas",
            resource: "miner",
            units: "250000000000",
            decimals: 12,
            currency: "KAS",
            usd: null,
            period: "rolling24h",
          },
        ],
        { kas: 0.04 },
      )[0]?.usd,
    ).toBeCloseTo(0.01);
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
      expect(email.text).not.toContain("来源未提供昨日收益");
      expect(email.text).not.toContain("统计周期不同");
      if (locale === "zh") expect(email.text).toContain("近 24 小时");
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
  it("separates balances from earnings for the same project and counts separate pools", () => {
    const report = aggregateDailyReport(
      w,
      [
        {
          project: "prl",
          resource: "wallet",
          scope: "luckypool",
          units: "125",
          decimals: 2,
          currency: "PRL",
          usd: 2,
          period: "rolling24h",
        },
        {
          project: "prl",
          resource: "wallet",
          scope: "kryptex",
          units: "50",
          decimals: 2,
          currency: "PRL",
          usd: 1,
          period: "rolling24h",
        },
        {
          project: "prl",
          resource: "other",
          scope: "kryptex",
          units: "1000000000",
          decimals: 8,
          currency: "PRL",
          usd: 16,
          period: "balance",
        },
      ],
      "zh",
      3,
    );
    expect(report.projects).toHaveLength(2);
    expect(report.projects.find((p) => p.period === "rolling24h")).toMatchObject({
      amount: "1.75",
      usd: 3,
      known: 2,
    });
    expect(report.projects.find((p) => p.period === "balance")).toMatchObject({
      amount: "10",
      usd: 16,
    });
    expect(report.usdSubtotal).toBe(3);
  });
  it("counts each Acurast manager once when saved addresses overlap", () => {
    const report = aggregateDailyReport(
      w,
      [
        {
          project: "acurast",
          resource: "manager-address",
          units: "300",
          decimals: 2,
          currency: "ACU",
          usd: 6,
          period: "hkDay",
          parts: [
            { key: "1", units: "100" },
            { key: "2", units: "200" },
          ],
        },
        {
          project: "acurast",
          resource: "processor-address",
          units: "100",
          decimals: 2,
          currency: "ACU",
          usd: 2,
          period: "hkDay",
          parts: [{ key: "1", units: "100" }],
        },
      ],
      "zh",
      2,
    );
    expect(report.projects[0]).toMatchObject({ amount: "3", usd: 6 });
    expect(report.usdSubtotal).toBe(6);
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
