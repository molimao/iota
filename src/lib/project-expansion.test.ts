import { describe, expect, it } from "vitest";
import { articles, articleClusterMeta, getArticle } from "../components/site/articles";
import { expansionGuides, loadExpansionArticle } from "../components/site/project-expansion";
import { guidesForProject } from "../components/site/project-guides";
import { buildArticleMarkdown, buildSitemapXml, buildLlmsFullTxt } from "./crawl";
import { AVAILABLE_PROJECT_IDS, PROJECT_IDS } from "./projects";
import { LOCALES } from "./site";
import { seo } from "../components/site/seo";

describe("all-project focused expansion", () => {
  it("publishes two distinct focused guides per project without orphan pages or duplicate slugs", async () => {
    expect(expansionGuides).toHaveLength(PROJECT_IDS.length * 2);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    const sitemap = buildSitemapXml();
    const llms = buildLlmsFullTxt();
    for (const id of AVAILABLE_PROJECT_IDS) {
      const pair = expansionGuides.filter((a) => a.project === id);
      expect(pair).toHaveLength(2);
      for (const article of pair) {
        expect(guidesForProject(id).some((a) => a.slug === article.slug)).toBe(true);
        expect(
          Object.values(articleClusterMeta).some((cluster) => cluster.slugs.includes(article.slug)),
        ).toBe(true);
        expect(getArticle(article.slug)).toBeDefined();
        expect((await loadExpansionArticle(article.slug))?.body).toEqual(article.body);
        expect(article.sources?.length).toBeGreaterThan(0);
        for (const link of article.related ?? []) expect(getArticle(link)).toBeDefined();
        for (const locale of LOCALES) {
          const text = article.body[locale].join("\n");
          expect(text).toContain(`/projects/${id}`);
          expect(text.match(/^## /gm)?.length).toBe(3);
          expect(text.trim()).not.toBe("");
          expect(article.summary?.[locale]?.trim()).toBeTruthy();
          if (locale !== "en") expect(text).not.toBe(article.body.en.join("\n"));
          expect(buildArticleMarkdown(article, locale)).toContain(article.title[locale]);
          expect(sitemap).toContain(`/${locale}/learn/${article.slug}`);
          expect(llms).toContain(article.title[locale]);
          const head = seo(locale, "learn", article.slug);
          expect(JSON.stringify(head)).toContain(article.title[locale]);
        }
      }
    }
    expect(await loadExpansionArticle("../not-an-article")).toBeNull();
  });
  it("keeps critical scope and unit explanations specific to the project", () => {
    expect(getArticle("acurast-phone-replacement-shared-manager")?.summary?.en).toContain(
      "manager",
    );
    expect(getArticle("ionet-utc-hong-kong-day-boundary")?.body.en.join(" ")).toContain(
      "October 26 at 18:00 UTC",
    );
    expect(getArticle("erg-source-amount-decimals")?.body.en.join(" ")).toContain("nanoERG");
    expect(getArticle("bnt-blocknet-vs-block-bancor")?.summary?.en).toContain("Bancor");
    expect(getArticle("btc-ckpool-best-share-vs-block")?.summary?.en).toContain(
      "neither a BTC amount",
    );
  });
});
