import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
  articles,
  articleClusterMeta,
  getArticle,
  relatedArticles,
} from "../components/site/articles";
import { projectGuides, guidesForProject } from "../components/site/project-guides";
import { ProjectLearning } from "../components/site/project-learning";
import { ArticleView } from "../components/site/pages";
import { LocaleContext } from "../components/site/locale";
import { seo } from "../components/site/seo";
import { projectsSeo } from "../components/projects-seo";
import { buildArticleMarkdown, buildLlmsFullTxt, crawlPages } from "./crawl";
import { LOCALES, LANGUAGE_TAG, ORIGIN } from "./site";
import { projectPath } from "./projects";

const structured = (head: ReturnType<typeof seo>) =>
  head.scripts.map((s) => JSON.parse(s.children));

describe("multi-project content and discovery", () => {
  it("covers each guide once with complete native copy and valid internal destinations", () => {
    expect(projectGuides).toHaveLength(8);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    const clustered = Object.values(articleClusterMeta).flatMap((group) => group.slugs);
    for (const article of projectGuides) {
      expect(clustered.filter((slug) => slug === article.slug)).toHaveLength(1);
      expect(crawlPages.some((p) => p.path === `learn/${article.slug}`)).toBe(true);
      expect(article.sources!.length).toBeGreaterThanOrEqual(2);
      expect(relatedArticles(article.slug).length).toBe(article.related!.length);
      for (const locale of LOCALES) {
        expect(article.summary?.[locale]).toBeTruthy();
        expect(article.questions?.[locale]).toHaveLength(2);
        expect(
          article.body[locale].filter((block) => block.startsWith("## ")).length,
        ).toBeGreaterThanOrEqual(3);
        for (const match of article.body[locale]
          .join("\n")
          .matchAll(/\]\(\/(learn\/[^)#]+|projects(?:\/[^)#]+)?|app)\)/g)) {
          const path = match[1]!;
          expect(
            path.startsWith("learn/")
              ? Boolean(getArticle(path.slice(6)))
              : crawlPages.some((p) => p.path === path) || path === "app",
          ).toBe(true);
        }
      }
    }
  });

  it("connects each project to the guides actually shown in its ItemList", () => {
    for (const project of [undefined, "xid", "quantus"] as const) {
      for (const locale of LOCALES) {
        const html = renderToStaticMarkup(
          createElement(
            LocaleContext.Provider,
            { value: locale },
            createElement(ProjectLearning, project ? { project } : {}),
          ),
        );
        const schema = structured(projectsSeo(locale, project)).find(
          (s) => s["@type"] === "ItemList",
        );
        expect(schema.itemListElement.map((entry: { url: string }) => entry.url)).toEqual(
          guidesForProject(project).map((a) => `${ORIGIN}/${locale}/learn/${a.slug}`),
        );
        for (const a of guidesForProject(project))
          expect(html).toContain(`href="/${locale}/learn/${a.slug}"`);
      }
    }
  });

  it("uses the right project identity and visible answers across HTML, schema and text", () => {
    const full = buildLlmsFullTxt();
    for (const a of articles.filter((a) => a.questions)) {
      for (const locale of LOCALES) {
        const html = renderToStaticMarkup(
          createElement(
            LocaleContext.Provider,
            { value: locale },
            createElement(ArticleView, {
              article: a,
              section: "learn",
              related: relatedArticles(a.slug),
            }),
          ),
        );
        const head = seo(locale, "learn", a.slug),
          schemas = structured(head);
        const article = schemas.find((s) => s["@type"] === "Article"),
          faq = schemas.find((s) => s["@type"] === "FAQPage");
        expect(article.abstract).toBe(a.summary![locale]);
        expect(article.inLanguage).toBe(LANGUAGE_TAG[locale]);
        expect(
          faq.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => ({
            question: q.name,
            answer: q.acceptedAnswer.text,
          })),
        ).toEqual(a.questions![locale]);
        const md = buildArticleMarkdown(a, locale);
        expect(md).toContain(a.summary![locale]);
        expect(full).toContain(a.summary![locale]);
        for (const q of a.questions![locale]) {
          expect(html).toContain(renderToStaticMarkup(createElement("h3", null, q.question)));
          expect(html).toContain(renderToStaticMarkup(createElement("p", null, q.answer)));
          expect(md).toContain(q.answer);
        }
        expect(html).toContain(
          `href="${a.project === "all" ? `/${locale}/projects` : projectPath(locale, a.project ?? "iota")}"`,
        );
        if (a.project === "xid" || a.project === "quantus") {
          expect(article.about.sameAs).not.toContain("macrocosmos");
          expect(article.keywords).not.toContain("Macrocosmos");
          expect(schemas.find((s) => s["@type"] === "BreadcrumbList").itemListElement[2].item).toBe(
            `${ORIGIN}/${locale}/projects/${a.project}`,
          );
        }
        if (a.comparison) {
          expect(article.about).toHaveLength(3);
          for (const row of a.comparison[locale].rows)
            for (const cell of row) expect(md).toContain(cell);
        }
      }
    }
  });
});
