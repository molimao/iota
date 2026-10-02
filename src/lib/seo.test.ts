import { describe, expect, it } from "vitest";
import { articleDates, articles } from "../components/site/articles";
import { blogPosts, relatedBlogPosts } from "../components/site/blog-posts";
import { seo } from "../components/site/seo";
import { buildArticleMarkdown, buildLlmsFullTxt, buildSitemapXml } from "./crawl";
import { ORIGIN, LOCALES, LANGUAGE_TAG } from "./site";

describe("public guide indexing", () => {
  it("keeps multilingual canonicals and article dates consistent", () => {
    for (const { article, section } of [
      ...articles.map((article) => ({ article, section: "learn" as const })),
      ...blogPosts.map((article) => ({ article, section: "blog" as const })),
    ]) {
      for (const locale of LOCALES) {
        const head = seo(locale, section, article.slug);
        const url = `${ORIGIN}/${locale}/${section}/${article.slug}`;
        expect(head.links.find((link) => link.rel === "canonical")?.href).toBe(url);
        expect(head.links.filter((link) => link.rel === "alternate")).toHaveLength(
          LOCALES.length + 1,
        );
        const schema = head.scripts
          .map((script) => JSON.parse(script.children))
          .find((item) => item["@type"] === (section === "blog" ? "BlogPosting" : "Article"));
        expect(schema.mainEntityOfPage).toBe(url);
        expect(schema.inLanguage).toBe(LANGUAGE_TAG[locale]);
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
    for (const { article, section } of [
      ...articles.map((article) => ({ article, section: "learn" as const })),
      ...blogPosts.map((article) => ({ article, section: "blog" as const })),
    ]) {
      for (const locale of LOCALES) {
        const markdown = buildArticleMarkdown(article, locale, ORIGIN, section);
        expect(markdown).toContain(article.title[locale]);
        expect(markdown).toContain(article.body[locale].at(-1)!.split("](")[0]!);
        expect(markdown).not.toMatch(/\]\(\/(?:learn|blog|app|network)/);
      }
      expect(full).toContain(article.title.en);
      expect(full).toContain(article.title.zh);
    }
  });
  it("links the blog hub to every published post and keeps related links valid", () => {
    for (const locale of LOCALES) {
      const schema = seo(locale, "blog")
        .scripts.map((s) => JSON.parse(s.children))
        .find((s) => s["@type"] === "Blog");
      expect(schema.hasPart.map((post: { url: string }) => post.url)).toEqual(
        blogPosts.map((post) => `${ORIGIN}/${locale}/blog/${post.slug}`),
      );
    }
    for (const post of blogPosts) {
      expect(relatedBlogPosts(post.slug)).toHaveLength(blogPosts.length - 1);
      expect(post.body.en.filter((block) => block.startsWith("## ")).length).toBeGreaterThanOrEqual(
        4,
      );
      expect(post.body.zh.filter((block) => block.startsWith("## ")).length).toBeGreaterThanOrEqual(
        4,
      );
      expect(post.sources?.length).toBeGreaterThanOrEqual(2);
    }
  });
  it("keeps private views out of the index while allowing public guides", () => {
    for (const locale of LOCALES) {
      expect(seo(locale, "app").meta).toContainEqual({ name: "robots", content: "noindex,follow" });
      expect(seo(locale, "account").meta).toContainEqual({
        name: "robots",
        content: "noindex,follow",
      });
      expect(seo(locale, "learn").meta.find((meta) => meta.name === "robots")?.content).toContain(
        "index,follow",
      );
    }
  });
});
