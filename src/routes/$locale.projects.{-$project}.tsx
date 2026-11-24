import "@/components/hardware-calculator.css";
import { CALCULATOR_PROJECTS, type CalculatorProject } from "@/lib/hardware-yield";
import { calculatorCopy } from "@/components/hardware-calculator-copy";
import { useLocale } from "@/components/site/locale";
import { isPoolProject } from "@/lib/pool-projects";
import { PoolPage } from "@/components/pool-page";
import { isPlatform } from "@/lib/platforms";
import { PlatformPage } from "@/components/platform-page";
import { ComputeProjectPage } from "@/components/compute-page";
import { Dashboard } from "@/components/dashboard";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MiningProjectPage, ProjectsHub } from "@/components/projects";
import { projectsSeo } from "@/components/projects-seo";
import { DiscretePage } from "@/components/discrete-page";
import { FlyaiPage } from "@/components/flyai-page";
import {
  isMiningProject,
  isMonitorProject,
  isComputeProject,
  isAvailableProject,
} from "@/lib/projects";
import { isLocale } from "@/lib/site";
import { localized } from "@/lib/product-discovery";
import { useRouterState } from "@tanstack/react-router";

const qtcMainnet = localized(["链上记录", "鏈上紀錄", "On-chain", "온체인 기록", "オンチェーン"]);

export const Route = createFileRoute("/$locale/projects/{-$project}")({
  beforeLoad: ({ params }) => {
    if (params.project && !isAvailableProject(params.project)) throw notFound();
    if (params.project && params.project !== "iota" && !isMonitorProject(params.project))
      throw notFound();
  },
  head: ({ params }) =>
    projectsSeo(
      isLocale(params.locale) ? params.locale : "zh",
      params.project === "iota" || isMonitorProject(params.project) ? params.project : undefined,
    ),
  component: Page,
});
function Page() {
  const { project } = Route.useParams(),
    { locale } = useLocale();
  return (
    <>
      {CALCULATOR_PROJECTS.includes(project as CalculatorProject) && (
        <div className="calculator-entry">
          <a href={`/${locale}/calculator/${project}`}>{calculatorCopy.entry[locale]} ↗</a>
        </div>
      )}
      <ProjectContent />
    </>
  );
}
function ProjectContent() {
  const { project } = Route.useParams();
  const { locale } = useLocale();
  const search = useRouterState({ select: (state) => state.location.searchStr });
  if (project === "quantus") {
    const source = new URLSearchParams(search).get("pool");
    const pool = source === "2miners" || source === "kryptex" ? source : null;
    const base = `/${locale}/projects/quantus`;
    return <>
      <nav className="calculator-entry qtc-sources" aria-label="Quantus">
        <a href={base} aria-current={!pool ? "page" : undefined}>{qtcMainnet[locale]}</a>
        <a href={`${base}?pool=2miners`} aria-current={pool === "2miners" ? "page" : undefined}>2Miners</a>
        <a href={`${base}?pool=kryptex`} aria-current={pool === "kryptex" ? "page" : undefined}>Kryptex</a>
      </nav>
      {pool ? <PoolPage key={pool} project="quantus" initialPool={pool} /> : <MiningProjectPage project="quantus" initial={null} />}
    </>;
  }
  if (isPoolProject(project)) return <PoolPage key={project} project={project} />;
  if (isPlatform(project)) return <PlatformPage key={project} project={project} />;
  if (project === "iota") return <Dashboard showPublicLookup />;
  if (isComputeProject(project))
    return <ComputeProjectPage key={project} project={project} initial={null} />;
  if (project === "flyai") return <FlyaiPage />;
  if (project === "xds") return <DiscretePage />;
  return isMiningProject(project) ? (
    <MiningProjectPage key={project} project={project} initial={null} />
  ) : (
    <ProjectsHub />
  );
}
