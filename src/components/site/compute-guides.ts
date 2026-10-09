import type { Article } from "./articles";
import { editorialCopy } from "../project-editorial";
import { LOCALES, type SiteLocale } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { computeGuideCopy, guideSections } from "./compute-guide-copy";
import { gonkaEvidence } from "./core-evidence";
const localized = <T>(f: (locale: SiteLocale) => T) =>
  Object.fromEntries(LOCALES.map((l) => [l, f(l)])) as Record<SiteLocale, T>;
export const computeGuides: Article[] = (
  ["flyai", "nosana", "gonka", "akash", "ionet", "vast", "golem"] as const
).map((project) => {
  const c = computeGuideCopy[project];
  return {
    slug: `${project}-monitor-guide`,
    project,
    published: "2026-10-06",
    modified: "2026-10-09",
    title: c.title,
    description: c.description,
    topic: localized((l) => editorialCopy(l).guide),
    body: localized((l) => [
      `## ${guideSections.input[l]}`,
      c.steps[l],
      `## ${guideSections.fields[l]}`,
      c.fields[l],
      `## ${guideSections.check[l]}`,
      c.check[l],
      `[${PROJECTS[project].name}](/projects/${project}) · [${editorialCopy(l).guide}](${PROJECTS[project].guide})`,
    ]),
    sources: [
      { name: PROJECTS[project].name, url: PROJECTS[project].guide },
      {
        name: "IOTA Watch · read adapters",
        url: "https://github.com/molimao/iota/tree/main/src/lib",
      },
      ...(project === "nosana"
        ? [{ name: "Nosana API", url: "https://api.nosana.com/api/docs" }]
        : project === "gonka"
          ? [{ name: "Gonka Network Node API", url: PROJECTS.gonka.explorer }]
          : []),
    ],
    related: ["data-sources-and-freshness"],
    ...(project === "gonka" ? { evidence: gonkaEvidence } : {}),
  };
});
