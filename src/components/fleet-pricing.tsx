import { boardCopy } from "./earnings-board-copy";
import { logCopy } from "./log-analysis-copy";
import { ReportEmailPreview } from "./daily-report-preview";
import { PLANS } from "@/lib/plans";
import { trialCopy } from "./pro-trial-copy";
import { proCopy } from "./pro-tools-copy";
import { ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import { localized } from "@/lib/product-discovery";
import { annualMonthlyEquivalent, annualMonthlyTotal, annualSavingPercent, copyValues, planAmount } from "@/lib/billing-display";
import { fleetCopy } from "./fleet-copy";
import { useLocale } from "./site/locale";

const pricingCopy = {
  freeIntro: localized([
    "查看设备状态与收益",
    "查看設備狀態與收益",
    "Check device status and earnings",
    "기기 상태와 수익 확인",
    "デバイスの状態と収益を確認",
  ]),
  annualComparison: localized([
    "按月付一年", "按月付一年", "12 monthly payments", "월 결제 12개월", "月払い12か月分",
  ]),
  discount: localized(["省 {percent}%", "省 {percent}%", "Save {percent}%", "{percent}% 절약", "{percent}% お得"]),
  reports: localized([
    "每日收益邮件与月报", "每日收益郵件與月報", "Daily earnings emails and monthly reports", "일일 수익 이메일과 월간 보고서", "日次収益メールと月次レポート",
  ]),
  trialTerms: localized([
    "需绑定支付方式；7 天后按所选套餐自动续费，可提前取消。",
    "需綁定付款方式；7 天後依所選方案自動續訂，可提前取消。",
    "Payment method required. Your selected plan renews after 7 days; cancel beforehand to avoid a charge.",
    "결제 수단이 필요합니다. 7일 후 선택한 요금제로 자동 갱신되며 이전에 취소할 수 있습니다.",
    "支払い方法が必要です。7日後に選択したプランで自動更新され、事前に解約できます。",
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
  bulkAgent: localized([
    "IOTA 设备批量启动、停止与重启",
    "IOTA 設備批次啟動、停止與重啟",
    "Bulk start, stop and restart for IOTA devices",
    "IOTA 기기 일괄 시작·중지·재시작",
    "IOTA 端末の一括起動・停止・再起動",
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
            <span>
              {pricingCopy.monitoring[locale]} · {boardCopy.title[locale]}
            </span>
          </li>
          <li>
            <Check size={17} aria-hidden="true" />
            <span>{proCopy.exports[locale]} · CSV</span>
          </li>
          <li>
            <Check size={17} aria-hidden="true" />
            <span>{proCopy.trends[locale]}</span>
          </li>
          <li>
            <Check size={17} aria-hidden="true" />
            <span>{logCopy.autoTitle[locale]}</span>
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
            <button className="fleet-year-choice" aria-pressed={interval === "year"} onClick={() => onIntervalChange("year")}>
              {c.year}<span className="fleet-year-badge">{c.limitedOffer}</span>
            </button>
          </div>
        </header>
        {interval === "year" && trialEligible !== false && <p className="fleet-trial-offer">{trialCopy.offer[locale]}</p>}

        <div className="fleet-price">
          ${planAmount(interval)}
          <small>{interval === "month" ? c.perMonth : c.perYear}</small>
        </div>
        {interval === "year" && <div className="fleet-annual-comparison">
          <span>{pricingCopy.annualComparison[locale]} <s>US${annualMonthlyTotal}</s></span>
          <strong>{copyValues(pricingCopy.discount[locale], { percent: annualSavingPercent })}</strong>
        </div>}
        <p className="fleet-plan-saving">
          {interval === "year"
            ? copyValues(c.annualEquivalent, { amount: annualMonthlyEquivalent })
            : c.monthlyCharge}
        </p>
        <button className="fleet-plan-primary" onClick={onChoose} disabled={busy} aria-busy={busy}>
          {busy
            ? c.processing
            : interval === "year" && trialEligible !== false
              ? trialCopy.start[locale]
              : pricingCopy.start[locale]}
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>
        {signedIn === false && <p className="fleet-plan-activation">{trialCopy.signIn[locale]}</p>}
        {interval === "year" && trialEligible !== false ? (
          <p className="fleet-trial-terms">{pricingCopy.trialTerms[locale]}</p>
        ) : interval === "year" ? (
          <p className="fleet-trial-terms">{c.annualCharge}</p>
        ) : null}
        <ul className="fleet-plan-benefits">
          <li><Check size={18} aria-hidden="true" /><b>{capacity(PLANS.pro.projectDeviceLimit)}</b></li>
          <li><Check size={18} aria-hidden="true" /><b>{pricingCopy.reports[locale]}</b></li>
          <li><Check size={18} aria-hidden="true" /><div><b>{proCopy.alerts[locale]}</b><span>IOTA · Akash · Golem</span></div></li>
          <li><Check size={18} aria-hidden="true" /><b>{pricingCopy.bulkAgent[locale]}</b></li>
        </ul>
        <ReportEmailPreview />
        <p className="fleet-free-included">{proCopy.freeIncluded[locale]}</p>
        <details className="fleet-plan-allowances">
          <summary>{c.quotas}</summary>
          {allowances(PLANS.pro.projectDeviceLimit)}
        </details>
      </article>
    </div>
  );
}
