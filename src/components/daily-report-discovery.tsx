import { ArrowUpRight, Mail } from "lucide-react";
import { useLocale } from "./site/locale";
import { reportCopy as c } from "./daily-report-copy";

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
    <aside className="daily-report-entry" aria-label={c.title[locale]}>
      <Mail size={21} aria-hidden="true" />
      <div>
        <b>
          {c.title[locale]} <small>PRO</small>
        </b>
        <p>
          {c.schedule[locale]} · {c.intro[locale]}
        </p>
      </div>
      <a
        className={plan === "pro" ? "site-button" : "fleet-outline"}
        href={`/${locale}/${preview ? "review" : "devices"}?view=membership${plan === "pro" ? "#daily-reports" : "#pro-plan"}`}
      >
        {plan === "pro" ? c.settings[locale] : c.viewPro[locale]} <ArrowUpRight size={14} />
      </a>
    </aside>
  );
}
