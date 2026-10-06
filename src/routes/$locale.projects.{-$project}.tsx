import { isPlatform } from "@/lib/platforms";
import { PlatformPage } from "@/components/platform-page";
import { ComputeProjectPage } from "@/components/compute-page";
import { Dashboard } from "@/components/dashboard";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MiningProjectPage, ProjectsHub } from "@/components/projects";
import { projectsSeo } from "@/components/projects-seo";
import { FlyaiPage } from "@/components/flyai-page";
import { isMiningProject, isMonitorProject, isComputeProject } from "@/lib/projects";
import { isLocale } from "@/lib/site";

export const Route = createFileRoute("/$locale/projects/{-$project}")({
  beforeLoad: ({ params }) => {
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
  const { project } = Route.useParams();
  if (isPlatform(project)) return <PlatformPage key={project} project={project} />;
  if (project === "iota") return <Dashboard />;
  if (isComputeProject(project))
    return <ComputeProjectPage key={project} project={project} initial={null} />;
  if (project === "flyai") return <FlyaiPage />;
  return isMiningProject(project) ? (
    <MiningProjectPage key={project} project={project} initial={null} />
  ) : (
    <ProjectsHub />
  );
}
