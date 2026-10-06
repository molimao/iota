import { isPlatform } from "@/lib/platforms";
import { PlatformPage } from "@/components/platform-page";
import { ComputeProjectPage } from "@/components/compute-page";
import { IotaProjectPage } from "@/components/project-about";
import { getComputeNetwork } from "@/lib/compute.functions";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MiningProjectPage, ProjectsHub } from "@/components/projects";
import { projectsSeo } from "@/components/projects-seo";
import { FlyaiPage } from "@/components/flyai-page";
import { isMiningProject, isMonitorProject, isComputeProject } from "@/lib/projects";
import { getProjectNetwork } from "@/lib/projects.functions";
import { isLocale } from "@/lib/site";

export const Route = createFileRoute("/$locale/projects/{-$project}")({
  beforeLoad: ({ params }) => {
    if (params.project && params.project !== "iota" && !isMonitorProject(params.project))
      throw notFound();
  },
  loader: async ({ params }) => ({
    computeSnapshot: isComputeProject(params.project)
      ? await getComputeNetwork({ data: { project: params.project } })
      : null,
    snapshot: isMiningProject(params.project)
      ? await getProjectNetwork({ data: { project: params.project } })
      : null,
  }),
  head: ({ params }) =>
    projectsSeo(
      isLocale(params.locale) ? params.locale : "zh",
      params.project === "iota" || isMonitorProject(params.project) ? params.project : undefined,
    ),
  component: Page,
});
function Page() {
  const { project } = Route.useParams(),
    { snapshot, computeSnapshot } = Route.useLoaderData();
  if (isPlatform(project)) return <PlatformPage key={project} project={project} />;
  if (project === "iota") return <IotaProjectPage />;
  if (isComputeProject(project))
    return <ComputeProjectPage key={project} project={project} initial={computeSnapshot} />;
  if (project === "flyai") return <FlyaiPage />;
  return isMiningProject(project) ? (
    <MiningProjectPage key={project} project={project} initial={snapshot} />
  ) : (
    <ProjectsHub />
  );
}
