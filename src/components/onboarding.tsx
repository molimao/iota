import { onboardingCopy as copy, projectHelpPath, projectAccess } from "@/lib/onboarding";
import type { ProjectId } from "@/lib/projects";
import { useLocale } from "./site/locale";
import { Monitor, ArrowUpRight } from "lucide-react";
export function MonitoringExample() {
  const { locale } = useLocale();
  return (
    <aside className="monitoring-example" aria-label={copy.sample[locale]}>
      <header>
        <span>{copy.sample[locale]}</span>
        <small>{copy.sampleNote[locale]}</small>
      </header>
      <div className="example-device">
        <Monitor size={20} />
        <h2>Mac mini</h2>
      </div>
      <div className="example-reward">
        <span>{copy.daily[locale]} · IOTA</span>
        <strong>
          0.2416 <small>IOTA</small>
        </strong>
      </div>
      <dl className="example-projects">
        <div>
          <dt>
            IOTA <small>{copy.training[locale]}</small>
          </dt>
          <dd>24.8 tokens/s</dd>
        </div>
        <div>
          <dt>
            XID <small>{copy.mining[locale]}</small>
          </dt>
          <dd>18.2 MH/s</dd>
        </div>
      </dl>
    </aside>
  );
}
export function AdditionHelp({ project, plan }: { project: ProjectId; plan: "free" | "pro" }) {
  const { locale } = useLocale();
  return (
    <div className="addition-help">
      <div>
        <span>{(plan === "pro" ? copy.proQuota : copy.quota)[locale]}</span>
        <a href={`/${locale}/devices?view=membership`}>{copy.plans[locale]}</a>
      </div>
      <a href={projectHelpPath(locale, project)} target="_blank" rel="noreferrer">
        {copy.idHelp[locale]} <ArrowUpRight size={12} />
      </a>
      {projectAccess(project) === "private" && <p>{copy.privateNote[locale]}</p>}
    </div>
  );
}
export function IotaAdditionHelp({ limit = 5 }: { limit?: number }) {
  return <AdditionHelp project="iota" plan={limit > 5 ? "pro" : "free"} />;
}
export function ProjectAccessLabel({ project }: { project: ProjectId }) {
  const { locale } = useLocale();
  return (
    <small className="project-access" data-access={projectAccess(project)}>
      {copy[projectAccess(project)][locale]}
    </small>
  );
}
