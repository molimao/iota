import { createFileRoute, notFound } from "@tanstack/react-router";
import { MiningProjectPage, ProjectsHub } from "@/components/projects";
import { projectsSeo } from "@/components/projects-seo";
import { isMiningProject } from "@/lib/projects";
import { getProjectNetwork } from "@/lib/projects.functions";
import { isLocale } from "@/lib/site";

export const Route = createFileRoute("/$locale/projects/{-$project}")({
  beforeLoad: ({ params }) => {
    if (params.project && !isMiningProject(params.project)) throw notFound();
  },
  loader: async ({ params }) => ({
    snapshot: isMiningProject(params.project)
      ? await getProjectNetwork({ data: { project: params.project } })
      : null,
  }),
  head: ({ params }) =>
    projectsSeo(
      isLocale(params.locale) ? params.locale : "zh",
      isMiningProject(params.project) ? params.project : undefined,
    ),
  component: Page,
});
function Page() {
  const { project } = Route.useParams(),
    { snapshot } = Route.useLoaderData();
  return isMiningProject(project) ? (
    <MiningProjectPage key={project} project={project} initial={snapshot} />
  ) : (
    <ProjectsHub />
  );
}
