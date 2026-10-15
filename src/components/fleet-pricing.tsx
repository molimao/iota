import { ReportEmailPreview } from "./daily-report-preview";
import { PLANS } from "@/lib/plans";
import { adLabels } from "@/lib/ads";
import { trialCopy } from "./pro-trial-copy";
import { proCopy } from "./pro-tools-copy";
import { ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import { localized } from "@/lib/product-discovery";
import { annualMonthlyEquivalent, copyValues, planAmount } from "@/lib/billing-display";
import { fleetCopy } from "./fleet-copy";
import { reportCopy } from "./daily-report-copy";
import { useLocale } from "./site/locale";

const pricingCopy = {
  freeIntro: localized([
    "查看设备状态与收益",
    "查看設備狀態與收益",
    "Check device status and earnings",
    "기기 상태와 수익 확인",
    "デバイスの状態と収益を確認",
  ]),
  proIntro: localized([
    "自动收报表，异常时收提醒",
    "自動收報表，異常時收提醒",
    "Earnings reports and issue alerts by email",
    "수익 보고서와 이상 알림을 이메일로",
    "収益レポートと異常通知をメールで",
  ]),
  capacity: localized([
    "每项目最多 {limit} 台设备",
    "每專案最多 {limit} 台設備",
    "Up to {limit} devices per project",
    "프로젝트당 최대 {limit}대",
    "各プロジェクト最大{limit}台",
  ]),
  monitoring: localized([
    "设备与项目监控",
    "設備與專案監控",
    "Device and project monitoring",
    "기기 및 프로젝트 모니터링",
    "デバイスとプロジェクトの監視",
  ]),
  start: localized(["开通 Pro", "開通 Pro", "Get Pro", "Pro 시작", "Proを始める"]),
};

export function FleetPricing({
  interval,
  onIntervalChange,
  onChoose,
  allowances,
  busy = false,
  trialEligible,
  signedIn,
}: {
  busy?: boolean;
  trialEligible?: boolean | undefined;
  signedIn?: boolean | undefined;
  interval: "month" | "year";
  onIntervalChange: (interval: "month" | "year") => void;
  onChoose: () => void;
  allowances: (limit: number) => ReactNode;
}) {
  const { locale } = useLocale();
  const c = fleetCopy(locale);
  const capacity = (limit: number) => copyValues(pricingCopy.capacity[locale], { limit });
  return (
    <div className="fleet-pricing-grid fleet-pricing-focused">
      <article className="fleet-plan-card fleet-free-card">
        <header className="fleet-plan-heading">
          <h3>{c.free}</h3>
          <span className="fleet-plan-current">{c.current}</span>
        </header>
        <p className="fleet-plan-purpose">{pricingCopy.freeIntro[locale]}</p>
        <div className="fleet-price">$0</div>
        <p className="fleet-plan-saving">{capacity(PLANS.free.projectDeviceLimit)}</p>
        <ul className="fleet-plan-benefits">
          <li>
            <Check size={17} aria-hidden="true" />
            <span>{pricingCopy.monitoring[locale]}</span>
          </li>
          <li>
            <Check size={17} aria-hidden="true" />
            <span>{proCopy.exports[locale]} · CSV</span>
          </li>
          <li>
            <Check size={17} aria-hidden="true" />
            <span>{proCopy.trends[locale]}</span>
          </li>
        </ul>
        <details className="fleet-plan-allowances">
          <summary>{c.quotas}</summary>
          {allowances(PLANS.free.projectDeviceLimit)}
        </details>
      </article>
      <article id="pro-plan" className="fleet-plan-card fleet-pro-card">
        <header className="fleet-plan-heading">
          <h3>Pro</h3>
          <div className="fleet-billing-switch" role="group" aria-label={c.plans}>
            <button aria-pressed={interval === "month"} onClick={() => onIntervalChange("month")}>
              {c.month}
            </button>
            <button aria-pressed={interval === "year"} onClick={() => onIntervalChange("year")}>
              {c.year}
            </button>
          </div>
        </header>
        <p className="fleet-plan-purpose">{pricingCopy.proIntro[locale]}</p>
        {trialEligible !== false && <p className="fleet-trial-offer">{trialCopy.offer[locale]}</p>}

        <div className="fleet-price">
          ${planAmount(interval)}
          <small>{interval === "month" ? c.perMonth : c.perYear}</small>
        </div>
        <p className="fleet-plan-saving">
          {interval === "year"
            ? copyValues(c.annualEquivalent, { amount: annualMonthlyEquivalent })
            : c.monthlyCharge}
        </p>
        <button className="fleet-plan-primary" onClick={onChoose} disabled={busy} aria-busy={busy}>
          {busy
            ? c.processing
            : trialEligible === true
              ? trialCopy.start[locale]
              : pricingCopy.start[locale]}
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>
        <p className="fleet-plan-activation">
          {signedIn === false ? trialCopy.signIn[locale] : trialCopy.activation[locale]}
        </p>
        {trialEligible !== false && <p className="fleet-trial-terms">{trialCopy.terms[locale]}</p>}
        <ul className="fleet-plan-benefits">
          <li>
            <Check size={18} aria-hidden="true" />
            <div>
              <b>{reportCopy.title[locale]}</b>
              <span>{reportCopy.schedule[locale]}</span>
            </div>
          </li>
          <li>
            <Check size={18} aria-hidden="true" />
            <div>
              <b>{proCopy.alerts[locale]}</b>
              <span>IOTA · Akash · Golem</span>
            </div>
          </li>
          <li>
            <Check size={18} aria-hidden="true" />
            <b>{proCopy.monthlyEmail[locale]}</b>
          </li>
          <li>
            <Check size={18} aria-hidden="true" />
            <b>{proCopy.bulk[locale]}</b>
          </li>
          <li>
            <Check size={18} aria-hidden="true" />
            <b>{capacity(50)}</b>
          </li>
          <li>
            <Check size={18} aria-hidden="true" />
            <b>{adLabels[locale][1]}</b>
          </li>
        </ul>
        <ReportEmailPreview />
        <p className="fleet-free-included">{proCopy.freeIncluded[locale]}</p>
        <details className="fleet-plan-allowances">
          <summary>{c.quotas}</summary>
          {allowances(50)}
        </details>
      </article>
    </div>
  );
}
