import { it, expect } from "vitest";
import {
  parseBulkCsv,
  monthlyCsv,
  filterReportProject,
  validateBulkRows,
  csvCell,
  earningsCsv,
  summarizeMonth,
  previousMonth,
  bulkTemplate,
  proPreferencePayload,
  proPreferencesInput,
  earningsTrendValue,
} from "./pro-tools";
import { renderMonthlyReport, renderStatusAlert } from "./pro-email";
import { aggregateDailyReport, reportDayWindow } from "./daily-report";
it("submits notification changes without the read-only fields returned by the server", () => {
  const read = {
    alerts: false,
    monthly: false,
    locale: "zh" as const,
    recipient: "member@example.invalid",
    eligible: true,
    configured: true,
  };
  for (const edit of [
    { alerts: true, monthly: false, locale: "zh" as const },
    { alerts: false, monthly: true, locale: "zh" as const },
    { alerts: true, monthly: true, locale: "ja" as const },
    { alerts: false, monthly: false, locale: "en" as const },
  ]) {
    const controlValue = { ...read, ...edit };
    expect(proPreferencesInput.safeParse(controlValue).success).toBe(false);
    expect(proPreferencesInput.parse(proPreferencePayload(controlValue))).toEqual(edit);
  }
  expect(read.recipient).toBe("member@example.invalid");
  expect(
    proPreferencesInput.safeParse({ alerts: "true", monthly: false, locale: "zh" }).success,
  ).toBe(false);
});
const report = aggregateDailyReport(
  reportDayWindow("2026-09-01"),
  [
    { project: "iota", resource: "a", units: "123456789", decimals: 8, currency: "IOTA", usd: 10 },
    {
      project: "quantus",
      resource: "b",
      units: null,
      decimals: 12,
      currency: "QUAN",
      usd: null,
      reason: "unavailable",
    },
  ],
  "en",
  2,
  Date.parse("2026-09-02T01:30:00Z"),
);
it("keeps a zero-value trend point and separates unpriced native earnings from missing history", () => {
  const zero = { ...report, usdSubtotal: 0, projects: [{ ...report.projects[0]!, amount: "0" }] };
  expect(earningsTrendValue(zero, false)).toBe(0);
  expect(earningsTrendValue(zero, true)).toBe(0);
  const unpriced = { ...report, usdSubtotal: null };
  expect(earningsTrendValue(unpriced, false)).toBeNull();
  expect(earningsTrendValue(unpriced, true)).toBe(1.23456789);
  expect(earningsTrendValue(undefined, false)).toBeNull();
  expect(
    earningsTrendValue({ ...report, projects: [{ ...report.projects[0]!, amount: null }] }, true),
  ).toBeNull();
});
it("keeps missing days and unpriced resources distinct from zero and deduplicates daily snapshots", () => {
  const m = summarizeMonth([report, report], "2026-09");
  expect(m).toMatchObject({ days: 1, expected: 30, usdSubtotal: 10, partial: true });
  expect(m.projects[0]).toMatchObject({ amount: "1.23456789", days: 1, partial: true });
  expect(m.projects.find((p) => p.project === "quantus")?.amount).toBeNull();
  expect(summarizeMonth([], "2026-02").expected).toBe(28);
  expect(previousMonth(Date.parse("2026-01-01T00:00:00+08:00"))).toBe("2025-12");
});
it("sums native balances exactly without adding currencies", () => {
  const huge = {
    ...report,
    day: "2026-09-02",
    projects: [{ ...report.projects[0]!, amount: "999999999999999999999.00000001" }],
  };
  expect(summarizeMonth([report, huge], "2026-09").projects[0]?.amount).toBe(
    "1000000000000000000000.2345679",
  );
});
it("parses quoted CSV, rejects unknown columns, tokens, invalid IDs and oversized batches", () => {
  const src =
    'device_key,device_id,name,hardware,project,identifier,worker\nmac1,,"Mac, office",M4,flyai,0x' +
    "1".repeat(40) +
    ",\n";
  const rows = parseBulkCsv(src);
  expect(rows[0]?.name).toBe("Mac, office");
  expect(validateBulkRows(rows, [])).toMatchObject({ created: 1, linked: 1 });
  expect(() => parseBulkCsv(src.replace("worker", "secret"))).toThrow();
  expect(() => parseBulkCsv(src.replace("Mac, office", "Mac\u0000office"))).toThrow();
  expect(() => parseBulkCsv(src.replace("0x" + "1".repeat(40), "sk_test_private"))).toThrow();
  expect(() => parseBulkCsv("x".repeat(100001))).toThrow();
  expect(bulkTemplate()).toContain("YOUR_PUBLIC_MINER_ID");
});
it("does not merge physical devices by names and rejects conflicting grouping or repeated resources", () => {
  const rows = parseBulkCsv(
    "device_key,device_id,name,hardware,project,identifier,worker\na,,Same,M4,flyai,0x" +
      "1".repeat(40) +
      ",\nb,,Same,M4,flyai,0x" +
      "2".repeat(40) +
      ",",
  );
  expect(validateBulkRows(rows, []).created).toBe(2);
  expect(() => validateBulkRows([...rows, rows[0]!], [])).toThrow("duplicate_binding");
  expect(() =>
    validateBulkRows([rows[0]!, { ...rows[1]!, device_key: "a", name: "Different" }], []),
  ).toThrow("inconsistent_device");
});
it("escapes formulas and CSV quote injection while preserving unknown earnings as blank", () => {
  for (const v of ["=cmd", " +SUM(A1)", "\t@run", "-1"]) expect(csvCell(v)).toMatch(/^"'/);
  expect(csvCell('plain"text')).toBe('"plain""text"');
  const csv = earningsCsv([report]);
  expect(csv).toContain('"quantus","","QUAN",""');
});
it("renders truthful monthly coverage and escapes device labels in HTML and validates unsubscribe origins", () => {
  const url = "https://iotahome.site/api/pro/unsubscribe?token=123";
  const mail = renderMonthlyReport(summarizeMonth([report], "2026-09"), "en", url);
  expect(mail.text).toContain("1/30");
  expect(mail.text).toContain("Partial data");
  const alert = renderStatusAlert(
    { name: "<script>alert(1)</script>", project: "iota", identifier: "public-id" },
    "2026-10-10T01:00:00Z",
    "en",
    url,
  );
  expect(alert.html).not.toContain("<script>");
  expect(alert.html).toContain("&lt;script&gt;");
  expect(() =>
    renderMonthlyReport(
      summarizeMonth([], "2026-09"),
      "en",
      "https://attacker.test/api/pro/unsubscribe",
    ),
  ).toThrow();
});

it("exports the selected project and monthly coverage without mixing in other projects", () => {
  const history = filterReportProject([report], "quantus");
  expect(history[0]?.usdSubtotal).toBeNull();
  const csv = monthlyCsv(summarizeMonth(history, "2026-09"));
  expect(csv).toContain('"2026-09","quantus","","QUAN","","0","30","0","true"');
  expect(csv).not.toContain('"iota"');
});
