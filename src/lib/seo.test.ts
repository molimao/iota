import { describe, expect, it } from "vitest";
import { articleDates, articles } from "../components/site/articles";
import { seo } from "../components/site/seo";
import { buildArticleMarkdown, buildLlmsFullTxt, buildSitemapXml } from "./crawl";
import { ORIGIN } from "./site";

describe("public guide indexing", () => {
  it("keeps bilingual canonicals and article dates consistent", () => {
    for (const article of articles) {
      for (const locale of ["en", "zh"] as const) {
        const head = seo(locale, "learn", article.slug);
        const url = `${ORIGIN}/${locale}/learn/${article.slug}`;
        expect(head.links.find((link) => link.rel === "canonical")?.href).toBe(url);
        expect(head.links.filter((link) => link.rel === "alternate")).toHaveLength(3);
        const schema = head.scripts
          .map((script) => JSON.parse(script.children))
          .find((item) => item["@type"] === "Article");
        expect(schema.mainEntityOfPage).toBe(url);
        expect(schema.datePublished).toBe(articleDates(article).published);
        expect(schema.dateModified).toBe(articleDates(article).modified);
      }
    }
  });
  it("does not change original publication dates when new guides are added", () => {
    const sitemap = buildSitemapXml();
    expect(sitemap).toMatch(
      /learn\/data-sources-and-freshness<\/loc>[\s\S]*?<lastmod>2026-10-01<\/lastmod>/,
    );
    expect(sitemap).toMatch(/learn\/find-miner-id<\/loc>[\s\S]*?<lastmod>2026-09-12<\/lastmod>/);
  });
  it("renders complete machine-readable guides with valid localized links", () => {
    const full = buildLlmsFullTxt();
    for (const article of articles) {
      for (const locale of ["en", "zh"] as const) {
        const markdown = buildArticleMarkdown(article, locale);
        expect(markdown).toContain(article.title[locale]);
        expect(markdown).toContain(article.body[locale].at(-1)!.split("](")[0]!);
        expect(markdown).not.toMatch(/\]\(\/(?:learn|app|network)/);
      }
      expect(full).toContain(article.title.en);
      expect(full).toContain(article.title.zh);
    }
  });
  it("keeps private views out of the index while allowing public guides", () => {
    expect(seo("en", "app").meta).toContainEqual({ name: "robots", content: "noindex,follow" });
    expect(seo("zh", "account").meta).toContainEqual({ name: "robots", content: "noindex,follow" });
    expect(seo("zh", "learn").meta.find((meta) => meta.name === "robots")?.content).toContain(
      "index,follow",
    );
  });
});
