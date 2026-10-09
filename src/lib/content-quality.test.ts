import { it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, existsSync } from "node:fs";
import { articles, articleDates, getArticle } from "../components/site/articles";
import { computeGuides } from "../components/site/compute-guides";
import { ArticleView } from "../components/site/pages";
import { LocaleContext } from "../components/site/locale";
import { seo } from "../components/site/seo";
import { projectsSeo } from "../components/projects-seo";
import { buildArticleMarkdown, buildLlmsTxt, buildLlmsFullTxt } from "./crawl";
import { discoveryCopy } from "./product-discovery";
import { LOCALES, ORIGIN } from "./site";
import { sumTodayUnits } from "./earnings";
const schemas = (a: ReturnType<typeof seo>) => a.scripts.map((s) => JSON.parse(s.children));
it("gives each localized tool and tutorial a distinct title and task", () => {
  for (const locale of LOCALES) {
    const titles = computeGuides.map((a) => a.title[locale]);
    expect(new Set(titles).size).toBe(7);
    for (const a of computeGuides) {
      const tool = projectsSeo(locale, a.project as Exclude<typeof a.project, "all" | undefined>);
      expect(seo(locale, "learn", a.slug).meta[0]).not.toEqual(tool.meta[0]);
      expect(a.description[locale]).not.toBe(
        tool.meta.find((m) => m.name === "description")?.content,
      );
      expect(a.body[locale].filter((b) => b.startsWith("## "))).toHaveLength(3);
    }
  }
});
it("keeps actual article subjects and the product definition aligned across representations", () => {
  const cross = getArticle("mining-dashboard-vs-official-dashboards")!;
  for (const locale of LOCALES) {
    const s = schemas(seo(locale, "learn", cross.slug)).find((s) => s["@type"] === "Article");
    expect(s.about).toHaveLength(10);
    expect(s.about.some((p: { name: string }) => p.name.includes("Golem"))).toBe(true);
    const iota = schemas(seo(locale, "learn", "mining-monitor-for-multiple-devices")).find(
      (s) => s["@type"] === "Article",
    );
    expect(iota.about["@id"]).toBe(ORIGIN + "/#project-iota");
    const three = schemas(seo(locale, "learn", "iota-xid-quantus-compared")).find(
      (s) => s["@type"] === "Article",
    );
    expect(three.about).toHaveLength(3);
    const org = schemas(seo(locale, "home"))
      .flatMap((s) => s["@graph"] || [])
      .find((s) => s["@type"] === "Organization");
    expect(org.description).toBe(discoveryCopy.intro[locale]);
    expect(buildLlmsFullTxt()).toContain(discoveryCopy.intro[locale]);
    const md = buildArticleMarkdown(cross, locale);
    expect(md).toContain("Golem");
    expect(md).toContain("Vast.ai");
    const gonka = schemas(seo(locale, "learn", "gonka-monitor-guide")).find(
      (s) => s["@type"] === "Article",
    );
    expect(gonka.keywords).not.toContain("Macrocosmos");
  }
  expect(buildLlmsTxt()).toContain(discoveryCopy.intro.en);
});
it("retains publication history and dates only the actual article update", () => {
  expect(articleDates(getArticle("find-miner-id")!, "ja")).toEqual({
    published: "2026-10-02",
    modified: "2026-10-02",
  });
  expect(buildArticleMarkdown(getArticle("find-miner-id")!, "ja")).toContain(
    "- Published: 2026-10-02",
  );
  expect(articleDates(getArticle("find-miner-id")!)).toEqual({
    published: "2026-09-12",
    modified: "2026-09-12",
  });
  expect(articleDates(getArticle("how-rewards-work")!)).toEqual({
    published: "2026-09-12",
    modified: "2026-10-09",
  });
  const original = { ...getArticle("gonka-monitor-guide")! };
  delete original.modified;
  expect(articleDates(original)).toEqual({ published: "2026-10-06", modified: "2026-10-06" });
});
it("renders real public evidence in HTML, schema and Markdown without localizing asset paths", () => {
  for (const a of articles.filter((a) => a.evidence)) {
    const e = a.evidence!,
      source = JSON.parse(readFileSync("public" + e.source, "utf8"));
    expect(existsSync("public" + e.image)).toBe(true);
    expect(source.screenshotCapturedAt).toBe(e.capturedAt);
    expect(source.sampleType).toContain("not a website customer");
    for (const locale of LOCALES) {
      const html = renderToStaticMarkup(
        createElement(
          LocaleContext.Provider,
          { value: locale },
          createElement(ArticleView, { article: a, section: "learn", related: [] }),
        ),
      );
      const md = buildArticleMarkdown(a, locale);
      expect(html).toContain(`src="${e.image}"`);
      expect(md).toContain(ORIGIN + e.image);
      expect(md).toContain(ORIGIN + e.source);
      expect(md).not.toContain("/" + locale + "/images/");
      for (const row of e.rows[locale]) for (const cell of row) expect(md).toContain(cell);
      expect(
        schemas(seo(locale, "learn", a.slug)).find((s) => s["@type"] === "Article").image,
      ).toBe(ORIGIN + e.image);
    }
  }
  const r = JSON.parse(readFileSync("public/evidence/iota-2026-10-09.json", "utf8"));
  expect(
    sumTodayUnits(
      {
        alpha_amounts: r.todayRows.map((x: { alpha_amount: number }) => x.alpha_amount),
        timestamps: r.todayRows.map((x: { timestamp: number }) => x.timestamp),
        statuses: r.todayRows.map((x: { status: string }) => x.status),
      },
      Date.parse(r.apiReadAt),
    ).units,
  ).toBe(664217856);
});
