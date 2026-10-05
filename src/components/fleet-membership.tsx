import { ArrowUpRight, Check, Layers } from "lucide-react";
import { useState } from "react";
import { FLEET_NAMES, FLEET_PROJECTS, projectDeviceCount, type FleetDevice } from "@/lib/fleet";
import type { BillingSummary } from "@/lib/plans";
import { fleetCopy } from "./fleet-copy";
import { useLocale } from "./site/locale";

export function FleetMembership({
  devices,
  billing,
  onManage,
  onAdd,
  compact = false,
}: {
  devices: FleetDevice[];
  billing?: BillingSummary | undefined;
  onManage?: (() => Promise<void>) | undefined;
  onAdd: () => void;
  compact?: boolean;
}) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  const [managing, setManaging] = useState(false);
  async function manage() {
    if (!onManage || managing) return;
    setManaging(true);
    try {
      await onManage();
    } finally {
      setManaging(false);
    }
  }
  const date = billing?.periodEnd
    ? new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(
        billing.periodEnd,
      )
    : null;
  return (
    <section
      className={`fleet-membership ${compact ? "fleet-membership-compact" : ""}`}
      aria-label={c.membership}
    >
      <header>
        <span className="fleet-member-mark">
          PRO <Check size={14} />
        </span>
        <div>
          <h2>{c.memberActive}</h2>
          <p>{c.memberIntro}</p>
        </div>
        <div className="fleet-member-date">
          {date && (
            <>
              <span>{billing?.cancelAtPeriodEnd ? c.validUntil : c.renewsOn}</span>
              <b>{date}</b>
            </>
          )}
          <button
            className="fleet-outline"
            onClick={() => void manage()}
            disabled={!onManage || managing}
          >
            {managing ? c.processing : c.manage}
            <ArrowUpRight size={14} />
          </button>
        </div>
      </header>
      {!compact && (
        <>
          <div className="fleet-member-section">
            <Layers size={17} />
            <div>
              <h3>{c.memberCapacity}</h3>
            </div>
          </div>
          <div className="fleet-member-quotas">
            {FLEET_PROJECTS.map((project) => {
              const used = projectDeviceCount(devices, project);
              return (
                <article key={project}>
                  <b>{FLEET_NAMES[project]}</b>
                  <div>
                    <strong>50</strong>
                    <span>{c.devices}</span>
                  </div>
                  <p>
                    {c.used} <b>{used}</b>
                  </p>
                  <progress max={50} value={Math.min(used, 50)} aria-label={FLEET_NAMES[project]} />
                  <p>
                    {c.remaining} <b>{Math.max(0, 50 - used)}</b>
                  </p>
                </article>
              );
            })}
          </div>
          <div className="fleet-member-actions">
            <button className="site-button" onClick={onAdd}>
              {c.add}
            </button>
            <div>
              <b>{c.memberBilling}</b>
              <p>{c.memberBillingNote}</p>
            </div>
          </div>
          <p className="fleet-plan-note">{c.downgrade}</p>
        </>
      )}
    </section>
  );
}
