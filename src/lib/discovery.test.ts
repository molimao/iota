import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { DISCOVERY_UPDATED, productQuestions, problemLinks } from "./product-discovery";
import { LOCALES, ORIGIN } from "./site";
import { DiscoveryQuestions } from "../components/discovery-questions";
import { LocaleContext } from "../components/site/locale";
import { seo } from "../components/site/seo";
import { projectsSeo } from "../components/projects-seo";
import { projectQuestions } from "../components/project-editorial";
import { PROJECT_IDS } from "./projects";
import { problemGuides } from "../components/site/problem-guides";
import { buildArticleMarkdown, buildLlmsFullTxt, buildSitemapXml } from "./crawl";
import { PLANS } from "./plans";
describe("question-led product discovery", () => {
  it("keeps homepage questions, visible answers and schema aligned across five languages", () => {
    const full = buildLlmsFullTxt();
    for (const locale of LOCALES) {
      const html = renderToStaticMarkup(
        createElement(
          LocaleContext.Provider,
          { value: locale },
          createElement(DiscoveryQuestions, { answers: true }),
        ),
      );
      const data = seo(locale, "home").scripts.map((s) => JSON.parse(s.children));
      const faq = data.find((s) => s["@type"] === "FAQPage");
      expect(
        faq.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => ({
          question: q.name,
          answer: q.acceptedAnswer.text,
        })),
      ).toEqual(productQuestions(locale));
      for (const q of productQuestions(locale)) {
        expect(html).toContain(renderToStaticMarkup(createElement("summary", null, q.question)));
        expect(html).toContain(renderToStaticMarkup(createElement("p", null, q.answer)));
        expect(full).toContain(q.answer);
      }
      expect(html).not.toContain("undefined");
      const app = data.find((s) => s["@type"] === "WebApplication");
      expect(app.offers.map((o: { price: string }) => o.price)).toEqual([
        "0",
        (PLANS.pro.monthlyCents / 100).toFixed(2),
        (PLANS.pro.annualCents / 100).toFixed(2),
      ]);
    }
  });
  it("adds distinct, complete public question pages with canonical links and useful sources", () => {
    expect(problemGuides).toHaveLength(4);
    expect(new Set(problemGuides.map((a) => a.slug)).size).toBe(4);
    const map = buildSitemapXml();
    for (const a of problemGuides)
      for (const locale of LOCALES) {
        expect(a.body[locale].filter((p) => p.startsWith("## ")).length).toBeGreaterThanOrEqual(3);
        const page = seo(locale, "learn", a.slug);
        const canonical = `${ORIGIN}/${locale}/learn/${a.slug}`;
        expect(page.links.find((l) => l.rel === "canonical")?.href).toBe(canonical);
        expect(page.links.filter((l) => l.rel === "alternate")).toHaveLength(6);
        expect(map).toContain(`<loc>${canonical}</loc>`);
        expect(buildArticleMarkdown(a, locale)).toContain(a.summary![locale]);
        expect(a.sources?.length).toBeGreaterThan(0);
        expect(page.meta.find((m) => "name" in m && m.name === "robots")?.content).toContain(
          "index,follow",
        );
      }
  });
  it("uses named project questions consistently instead of generic empty headings", () => {
    for (const locale of LOCALES)
      for (const id of PROJECT_IDS) {
        const faq = projectsSeo(locale, id)
          .scripts.map((s) => JSON.parse(s.children))
          .find((s) => s["@type"] === "FAQPage");
        expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(
          projectQuestions(id, locale).map((q) => q.question),
        );
        expect(
          faq.mainEntity.every(
            (q: { acceptedAnswer: { text: string } }) => q.acceptedAnswer.text.length > 20,
          ),
        ).toBe(true);
      }
  });
  it("keeps private application routes out of the new public search pages", () => {
    const sitemap = buildSitemapXml();
    for (const path of ["app", "account", "devices", "review"])
      expect(sitemap).not.toMatch(new RegExp(`<loc>[^<]+/${path}(?:<|/)`));
    for (const link of problemLinks) expect(link.path).toMatch(/^learn\//);
    expect(problemGuides.every((a) => a.modified === DISCOVERY_UPDATED)).toBe(true);
  });
});
