import { ArrowRight, Check, Layers, Monitor } from "lucide-react";
import {
  FLEET_NAMES,
  FLEET_PROJECTS,
  projectDeviceCount,
  type FleetDevice,
  type FleetProject,
} from "@/lib/fleet";
import { annualMonthlyEquivalent, annualSavingPercent, copyValues } from "@/lib/billing-display";
import { fleetCopy } from "./fleet-copy";
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
              <small>{copyValues(c.annualSave, { percent: annualSavingPercent })}</small>
            )}
          </span>
          <span className="fleet-choice-amount">
            US$<strong>{value === "year" ? "16.90" : "2.90"}</strong>
            <span>{value === "year" ? c.perYear : c.perMonth}</span>
          </span>
          <span className="fleet-choice-detail">
            {value === "year"
              ? copyValues(c.annualEquivalent, { amount: annualMonthlyEquivalent })
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
}: PriceChoiceProps & { devices: FleetDevice[]; project: FleetProject | null; preview: boolean }) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  const used = project ? projectDeviceCount(devices, project) : null;
  return (
    <div className="fleet-paywall-body">
      <div className="fleet-paywall-capacity">
        <div>
          <span>{project ? FLEET_NAMES[project] : c.free}</span>
          <strong>
            {used ?? 5}
            <small>{used === null ? " " + c.devices : " / 5"}</small>
          </strong>
          <p>{project ? c.used : c.quotas}</p>
        </div>
        <ArrowRight size={22} />
        <div>
          <span>PRO</span>
          <strong>50</strong>
          <p>{c.upTo}</p>
        </div>
      </div>
      <p className="fleet-paywall-additional">{c.additional}</p>
      <div className="fleet-paywall-policy">
        <p>
          <Layers size={15} />
          {c.perProject}
        </p>
        <p>
          <Monitor size={15} />
          {c.noFleetLimit}
        </p>
      </div>
      <PriceChoices interval={interval} onChange={onChange} disabled={disabled} />
      <p className="fleet-charge-note">{interval === "year" ? c.annualCharge : c.monthlyCharge}</p>
      <details className="fleet-paywall-allowances">
        <summary>{c.quotas}</summary>
        <ul>
          {FLEET_PROJECTS.map((p) => (
            <li key={p}>
              <span>{FLEET_NAMES[p]}</span>
              <b>
                {projectDeviceCount(devices, p)} / 50 <small>{c.devices}</small>
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
