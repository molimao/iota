import { expect, it } from "vitest";
import { getArticle } from "@/components/site/articles";
import { guidesForProject } from "@/components/site/project-guides";
import { monitorFeatureGuides } from "@/components/site/monitor-feature-guides";
import { projectsSeo } from "@/components/projects-seo";
import { buildArticleMarkdown, buildLlmsTxt, buildRobotsTxt, crawlPages } from "./crawl";
import { LANGUAGE_TAG, LOCALES, ORIGIN } from "./site";

it("publishes each feature guide in the sitemap, project guide list and AI-readable text", () => {
  const llms = buildLlmsTxt();
  for (const guide of monitorFeatureGuides) {
    const path = `learn/${guide.slug}`;
    expect(crawlPages.filter((page) => page.path === path)).toHaveLength(1);
    const page = getArticle(guide.slug)!;
    for (const project of guide.subjects ?? [guide.project]) {
      expect(project && project !== "all" && guidesForProject(project).some((a) => a.slug === guide.slug))
        .toBe(true);
    }
    for (const locale of LOCALES) {
      const markdown = buildArticleMarkdown(page, locale, ORIGIN);
      expect(markdown).toContain(guide.title[locale]);
      expect(markdown).toContain(`${ORIGIN}/${locale}/projects/`);
      expect(markdown).toContain(guide.sources![0]!.url);
      expect(llms).toContain(`${ORIGIN}/${locale}/${path}`);
    }
  }
});

it("keeps a single localized canonical for each public pool tool and names its official data sources", () => {
  for (const project of ["quantus", "prl"] as const) {
    for (const locale of LOCALES) {
      const head = projectsSeo(locale, project);
      expect(head.links.filter((link) => link.rel === "canonical")).toEqual([
        { rel: "canonical", href: `${ORIGIN}/${locale}/projects/${project}` },
      ]);
      expect(head.links.flatMap((link) => "hrefLang" in link ? [link.hrefLang] : []))
        .toEqual([...LOCALES.map((id) => LANGUAGE_TAG[id]), "x-default"]);
      const page = JSON.parse(head.scripts[0]!.children);
      expect(page.citation).toContain(project === "quantus"
        ? "https://pool.kryptex.com/qtc"
        : "https://pearl.luckypool.io/how-to-mine");
    }
  }
  expect(buildRobotsTxt()).toContain("User-agent: OAI-SearchBot\nAllow: /\nDisallow: /_serverFn/");
  expect(crawlPages.every(({ path }) => !/\?|^devices$|^app$|^review/.test(path))).toBe(true);
});
