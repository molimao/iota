import { describe, expect, it } from "vitest";
import { articleDates, articles } from "../components/site/articles";
import { blogPosts, relatedBlogPosts } from "../components/site/blog-posts";
import { seo } from "../components/site/seo";
import { buildArticleMarkdown, buildLlmsFullTxt, buildSitemapXml } from "./crawl";
import { DISCOVERY_UPDATED } from "./product-discovery";
import { ORIGIN, LOCALES, LANGUAGE_TAG } from "./site";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ArticlePage } from "../components/site/pages";
import { LocaleContext } from "../components/site/locale";
import { content } from "../components/site/content";

describe("public guide indexing", () => {
  it("keeps five-language project answers identical in visible HTML, FAQ schema and readable text", () => {
    const full = buildLlmsFullTxt();
    for (const locale of LOCALES) {
      const html = renderToStaticMarkup(
        createElement(
          LocaleContext.Provider,
          { value: locale },
          createElement(ArticlePage, { page: "faq" }),
        ),
      );
      const head = seo(locale, "faq");
      const faq = head.scripts
        .map((script) => JSON.parse(script.children))
        .find((s) => s["@type"] === "FAQPage");
      expect(faq.url).toBe(`${ORIGIN}/${locale}/faq`);
      expect(faq.dateModified).toBe(DISCOVERY_UPDATED);
      expect(html).toContain(`<time dateTime="${DISCOVERY_UPDATED}">${DISCOVERY_UPDATED}</time>`);
      expect(
        faq.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => [
          q.name,
          q.acceptedAnswer.text,
        ]),
      ).toEqual(content[locale].faq);
      for (const [question, answer] of content[locale].faq) {
        expect(html).toContain(renderToStaticMarkup(createElement("h2", null, question)));
        expect(html).toContain(renderToStaticMarkup(createElement("p", null, answer)));
        expect(full).toContain(answer);
      }
      expect(html).toContain(`href="/${locale}/projects"`);
      expect(html).toContain(`href="/${locale}/learn/iota-xid-quantus-compared"`);
      const firstAnswers = content[locale].faq.map(([, a]) => a).join(" ");
      for (const identifier of [
        "Train at Home",
        "XID",
        "Quantus",
        "xpa1r",
        "Wormhole",
        "fly.ai",
        "50",
        "5",
      ])
        expect(firstAnswers).toContain(identifier);
    }
  });

  it("describes the homepage's ten distinct projects and its public source license", () => {
    for (const locale of LOCALES) {
      const app = seo(locale, "home")
        .scripts.map((script) => JSON.parse(script.children))
        .find((s) => s["@type"] === "WebApplication");
      expect(app.about).toHaveLength(10);
      expect(new Set(app.about.map((project: { "@id": string }) => project["@id"])).size).toBe(10);
      expect(app.sameAs).toContain("https://github.com/molimao/iota");
      expect(app.license).toBe("https://github.com/molimao/iota/blob/main/LICENSE");
    }
  });
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
        expect(schema.datePublished).toBe(articleDates(article, locale).published);
        expect(schema.dateModified).toBe(articleDates(article, locale).modified);
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
