import { localized } from "@/lib/product-discovery";
import { ArrowUpRight, Mail } from "lucide-react";
import { useLocale } from "./site/locale";
import { reportCopy as c } from "./daily-report-copy";

const entryCopy = {
  title: localized([
    "收益与异常邮件",
    "收益與異常郵件",
    "Earnings reports & alerts",
    "수익 보고서 및 알림",
    "収益レポートと通知",
  ]),
  intro: localized([
    "不用一直开着页面，也能收到收益报表和设备异常邮件。",
    "不用一直開著頁面，也能收到收益報表和設備異常郵件。",
    "Receive earnings reports and device issue emails without keeping this page open.",
    "페이지를 열어 두지 않아도 수익 보고서와 기기 이상 이메일을 받을 수 있습니다.",
    "ページを開いていなくても、収益レポートとデバイスの異常通知をメールで受信。",
  ]),
  settings: localized(["邮件设置", "郵件設定", "Email settings", "이메일 설정", "メール設定"]),
};

export function ReportBenefit() {
  const { locale } = useLocale();
  return (
    <div className="report-benefit">
      <Mail size={22} aria-hidden="true" />
      <div>
        <b>{c.title[locale]}</b>
        <span>{c.schedule[locale]}</span>
        <p>{c.intro[locale]}</p>
      </div>
    </div>
  );
}

export function ReportEntry({
  plan,
  preview = false,
}: {
  plan: "free" | "pro";
  preview?: boolean;
}) {
  const { locale } = useLocale();
  return (
    <aside className="daily-report-entry" aria-label={entryCopy.title[locale]}>
      <Mail size={21} aria-hidden="true" />
      <div>
        <b>
          {entryCopy.title[locale]} <small>PRO</small>
        </b>
        <p>{entryCopy.intro[locale]}</p>
      </div>
      <a
        className={plan === "pro" ? "site-button" : "fleet-outline"}
        href={`/${locale}/${preview ? "review" : "devices"}?view=membership${plan === "pro" ? "#daily-reports" : "#pro-plan"}`}
      >
        {plan === "pro" ? entryCopy.settings[locale] : c.viewPro[locale]} <ArrowUpRight size={14} />
      </a>
    </aside>
  );
}
