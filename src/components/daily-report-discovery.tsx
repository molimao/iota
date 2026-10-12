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
    "按项目收取收益报表，设备异常时接收提醒。",
    "按專案收取收益報表，設備異常時接收提醒。",
    "Project earnings reports and device issue alerts by email.",
    "프로젝트별 수익 보고서와 기기 이상 알림을 이메일로 받으세요.",
    "プロジェクト別の収益レポートとデバイスの異常通知をメールで受信。",
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
