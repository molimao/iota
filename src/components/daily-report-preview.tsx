import { reportCopy } from "./daily-report-copy";
import { useLocale } from "./site/locale";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { aggregateDailyReport, reportDayWindow } from "@/lib/daily-report";
import { renderDailyReport } from "@/lib/daily-report-email";
import { ORIGIN, type SiteLocale } from "@/lib/site";
export function sampleReportEmail(locale: SiteLocale) {
  const r = aggregateDailyReport(
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
        project: "flyai",
        resource: "demo-wallet",
        units: null,
        decimals: 8,
        currency: "Points",
        usd: null,
        reason: "different_period",
      },
    ],
    locale,
    3,
    Date.parse("2026-10-10T09:25:00+08:00"),
  );
  return renderDailyReport(
    r,
    `${ORIGIN}/api/reports/unsubscribe?token=11111111-1111-4111-8111-111111111111&locale=${locale}`,
  );
}
export function ReportEmailPreview({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { locale } = useLocale();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="report-email-preview">
        <DialogTitle>{reportCopy.demo[locale]}</DialogTitle>
        <DialogDescription>{reportCopy.intro[locale]}</DialogDescription>
        <iframe
          title={reportCopy.demo[locale]}
          srcDoc={sampleReportEmail(locale).html}
          sandbox=""
        />
      </DialogContent>
    </Dialog>
  );
}
