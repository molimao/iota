import { reportCopy } from "./daily-report-copy";
import { useLocale } from "./site/locale";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { aggregateDailyReport, reportDayWindow } from "@/lib/daily-report";
import { renderDailyReport } from "@/lib/daily-report-email";
import { ORIGIN, LANGUAGE_TAG, type SiteLocale } from "@/lib/site";
function sampleReport(locale: SiteLocale) {
  return aggregateDailyReport(
    reportDayWindow("2026-10-09"),
    [
      {
        project: "iota",
        resource: "demo-a",
        units: "184200000",
        decimals: 8,
        currency: "IOTA",
        usd: 12.4335,
      },
      {
        project: "iota",
        resource: "demo-b",
        units: "24500000",
        decimals: 8,
        currency: "IOTA",
        usd: 1.65375,
      },
      {
        project: "vast",
        resource: "demo-machine",
        units: "384000000",
        decimals: 8,
        currency: "USD",
        usd: 3.84,
      },
      {
        project: "kas",
        resource: "demo-kas",
        units: "250000000000",
        decimals: 12,
        currency: "KAS",
        usd: 0.89,
        period: "rolling24h",
      },
      {
        project: "flyai",
        resource: "demo-wallet",
        units: "120",
        decimals: 0,
        currency: "Points",
        usd: null,
        period: "month",
      },
    ],
    locale,
    3,
    Date.parse("2026-10-10T09:25:00+08:00"),
  );
}
export function sampleReportEmail(locale: SiteLocale) {
  return renderDailyReport(
    sampleReport(locale),
    `${ORIGIN}/api/reports/unsubscribe?token=11111111-1111-4111-8111-111111111111&locale=${locale}`,
  );
}
export function ReportEmailPreview({ emailLocale }: { emailLocale?: SiteLocale | undefined }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const report = sampleReport(emailLocale ?? locale);
  const language = report.locale;
  const money = (value: number | null) => (value === null ? "—" : `$${value.toFixed(2)}`);
  return (
    <details className="report-email-preview" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        {reportCopy.preview[locale]} <ChevronDown size={15} aria-hidden="true" />
      </summary>
      {open && (
        <div className="report-email-example">
          <p>{reportCopy.demo[locale]}</p>
          <div className="report-email-paper" lang={LANGUAGE_TAG[language]}>
            <div className="report-email-paper-heading">
              <b>IOTA Watch</b>
              <span>{report.day}</span>
            </div>
            <h3>{reportCopy.yesterday[language]}</h3>
            <p>
              {reportCopy.recordedDate[language]}:{" "}
              {new Date(reportDayWindow(report.day).end + 28800000).toISOString().slice(0, 10)} ·
              UTC+8
            </p>
            <div className="report-email-total">
              <span>
                {reportCopy.estimate[language]} · {reportCopy.partial[language]}
              </span>
              <strong>
                {money(report.usdSubtotal)} <small>USD</small>
              </strong>
            </div>
            <table>
              <thead>
                <tr>
                  <th>{reportCopy.project[language]}</th>
                  <th>{reportCopy.amount[language]}</th>
                  <th>{reportCopy.usd[language]}</th>
                </tr>
              </thead>
              <tbody>
                {report.projects.map((project) => (
                  <tr key={`${project.project}:${project.period ?? "unknown"}`}>
                    <th scope="row">
                      {project.name}
                      {project.period === "rolling24h"
                        ? ` · ${reportCopy.rolling[language]}`
                        : project.period === "utcDay"
                          ? ` · ${reportCopy.utcDay[language]}`
                          : project.period === "balance"
                            ? ` · ${reportCopy.balanceLabel[language]}`
                            : project.period === "month"
                              ? ` · ${reportCopy.monthPoints[language]}`
                              : ""}
                    </th>
                    <td>
                      {project.amount === null ? "—" : `${project.amount} ${project.currency}`}
                    </td>
                    <td>{money(project.usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>{reportCopy.estimateNote[language]}</p>
          </div>
        </div>
      )}
    </details>
  );
}
