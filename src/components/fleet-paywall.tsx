import { PLANS } from "@/lib/plans";
import { trialCopy } from "./pro-trial-copy";
import { proCopy } from "./pro-tools-copy";
import { ArrowRight, Check, Layers } from "lucide-react";
import {
  FLEET_NAMES,
  FLEET_PROJECTS,
  projectDeviceCount,
  type FleetDevice,
  type FleetProject,
} from "@/lib/fleet";
import {
  annualMonthlyEquivalent,
  annualSavingPercent,
  annualSavingAmount,
  copyValues,
  planAmount,
} from "@/lib/billing-display";
import { fleetCopy } from "./fleet-copy";
import { ReportBenefit } from "./daily-report-discovery";
import { useLocale } from "./site/locale";

export type PriceChoiceProps = {
  interval: "month" | "year";
  onChange: (interval: "month" | "year") => void;
  disabled?: boolean | undefined;
};
export function PriceChoices({ interval, onChange, disabled }: PriceChoiceProps) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  return (
    <div className="fleet-price-choices" role="group" aria-label={c.plans}>
      {(["month", "year"] as const).map((value) => (
        <button
          type="button"
          key={value}
          className="fleet-price-choice"
          autoFocus={interval === value}
          aria-pressed={interval === value}
          onClick={() => onChange(value)}
          disabled={disabled}
        >
          <span className="fleet-price-choice-heading">
            <span className="fleet-choice-indicator">
              {interval === value && <Check size={10} />}
            </span>
            <b>{value === "year" ? c.year : c.month}</b>
            {value === "year" && (
              <small>{copyValues(c.annualSave, { percent: annualSavingPercent })} · {c.limitedOffer}</small>
            )}
          </span>
          <span className="fleet-choice-amount">
            US$<strong>{planAmount(value)}</strong>
            <span>{value === "year" ? c.perYear : c.perMonth}</span>
          </span>
          <span className="fleet-choice-detail">
            {value === "year"
              ? `${copyValues(c.annualEquivalent, { amount: annualMonthlyEquivalent })} · ${copyValues(c.annualSavedAmount, { amount: annualSavingAmount })}`
              : c.monthlyCharge}
          </span>
        </button>
      ))}
    </div>
  );
}
export function PaywallBody({
  devices,
  project,
  interval,
  onChange,
  disabled,
  preview,
  trialEligible,
}: PriceChoiceProps & {
  devices: FleetDevice[];
  project: FleetProject | null;
  preview: boolean;
  trialEligible?: boolean | undefined;
}) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  const used = project ? projectDeviceCount(devices, project) : null;
  return (
    <div className="fleet-paywall-body">
      {project && (
        <div className="fleet-paywall-capacity">
          <div>
            <span>{project ? FLEET_NAMES[project] : c.free}</span>
            <strong>
              {used ?? PLANS.free.projectDeviceLimit}
              <small>
                {used === null ? " " + c.devices : ` / ${PLANS.free.projectDeviceLimit}`}
              </small>
            </strong>
            <p>{project ? c.used : c.quotas}</p>
          </div>
          <ArrowRight size={22} />
          <div>
            <span>PRO</span>
            <strong>{PLANS.pro.projectDeviceLimit}</strong>
            <p>{c.upTo}</p>
          </div>
        </div>
      )}
      <ReportBenefit />
      <ul className="pro-paywall-benefits">
        {(["alerts", "monthlyEmail", "bulk"] as const).map((key) => (
          <li key={key}>
            <Check size={14} />
            {proCopy[key][locale]}
          </li>
        ))}
      </ul>
      <div className="fleet-paywall-policy">
        <p>
          <Layers size={15} />
          {c.perProject}
        </p>
      </div>
      {interval === "year" && trialEligible !== false && <p className="fleet-trial-offer">{trialCopy.offer[locale]}</p>}
      <PriceChoices interval={interval} onChange={onChange} disabled={disabled} />
      <p className="fleet-charge-note">{interval === "year" ? c.annualCharge : c.monthlyCharge}</p>
      {interval === "year" && trialEligible !== false && (
        <p className="fleet-paywall-report-guide">{trialCopy.terms[locale]}</p>
      )}
      <details className="fleet-paywall-allowances">
        <summary>{c.quotas}</summary>
        <ul>
          {FLEET_PROJECTS.map((p) => (
            <li key={p}>
              <span>{FLEET_NAMES[p]}</span>
              <b>
                {projectDeviceCount(devices, p)} / {PLANS.pro.projectDeviceLimit} <small>{c.devices}</small>
              </b>
            </li>
          ))}
        </ul>
      </details>
      <p className="fleet-paywall-feature-note">{c.downgrade}</p>
      {preview && <p className="fleet-paywall-preview">{c.previewBilling}</p>}
    </div>
  );
}
