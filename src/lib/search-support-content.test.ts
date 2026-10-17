import type { ProjectId } from "./projects";
import { expect, it } from "vitest";
import { articles, getArticle, articleClusterMeta } from "@/components/site/articles";
import { searchSupportGuides } from "@/components/site/search-support-guides";
import { guidesForProject } from "@/components/site/project-guides";
import { content } from "@/components/site/content";
import { seo } from "@/components/site/seo";
import { buildArticleMarkdown, buildLlmsTxt, buildSitemapXml } from "./crawl";
import { iotaPublicFacts } from "./iota-public-facts";
import { LOCALES } from "./site";

it("connects every new question page from its project, learning hub, sitemap and text index", () => {
  const slugs = new Set(Object.values(articleClusterMeta).flatMap((group) => group.slugs));
  for (const article of searchSupportGuides) {
    expect(slugs.has(article.slug)).toBe(true);
    expect(
      guidesForProject(article.project as ProjectId).some((g) => g.slug === article.slug),
    ).toBe(true);
    for (const locale of LOCALES) {
      const path = `/${locale}/learn/${article.slug}`;
      expect(buildSitemapXml()).toContain(path);
      expect(buildLlmsTxt()).toContain(path);
      expect(buildArticleMarkdown(article, locale)).toContain(article.summary![locale]);
      const metadata = seo(locale, "learn", article.slug);
      const schema = metadata.scripts
        .map((s) => JSON.parse(s.children))
        .find((s) => s["@type"] === "Article");
      expect(schema.about["@id"]).toContain(`#project-${article.project}`);
      expect(schema.datePublished).toBe("2026-10-17");
    }
  }
});

it("keeps current rewards and agent answers consistent in the FAQ and core guides", () => {
  for (const locale of LOCALES) {
    const answers = content[locale].faq.map(([, answer]) => answer);
    expect(answers).toContain(iotaPublicFacts.day[locale]);
    expect(answers).toContain(iotaPublicFacts.agent[locale]);
    expect(getArticle("how-rewards-work")!.summary![locale]).toBe(iotaPublicFacts.day[locale]);
    expect(getArticle("what-is-iota-watch")!.body[locale]).toContain(iotaPublicFacts.agent[locale]);
  }
  expect(buildLlmsTxt()).not.toContain("The site cannot start training or read local Mac logs.");
});

it("keeps internal troubleshooting links resolvable without manufacturing project facts", () => {
  const valid = new Set(articles.map((a) => a.slug));
  for (const article of searchSupportGuides) {
    for (const related of article.related ?? []) expect(valid.has(related)).toBe(true);
    for (const locale of LOCALES) {
      for (const text of article.body[locale]) {
        for (const match of text.matchAll(/\]\(\/learn\/([a-z0-9-]+)\)/g))
          expect(valid.has(match[1]!)).toBe(true);
      }
    }
  }
});
