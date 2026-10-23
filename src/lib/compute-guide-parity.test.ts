import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { additionalGuides } from "@/components/site/additional-guides";
import { computeGuides } from "@/components/site/compute-guides";
import { guideSections } from "@/components/site/compute-guide-copy";
import { isRemediatedGuide } from "@/components/site/compute-guide-details";
import { gonkaEvidence } from "@/components/site/core-evidence";
import { LocaleContext } from "@/components/site/locale";
import { ArticleView } from "@/components/site/pages";
import { seo } from "@/components/site/seo";
import { buildArticleMarkdown } from "@/lib/crawl";
import { LOCALES, type SiteLocale } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { describe, expect, it } from "vitest";

const illustrative: Record<SiteLocale, string> = {
  zh: "举例，不是实测",
  "zh-TW": "舉例，不是實測",
  en: "Illustrative, not a measured",
  ko: "예시이며 측정값이 아닙니다",
  ja: "例示であり、測定値ではありません",
};

const expectedSources = (
  project: "flyai" | "nosana" | "gonka" | "akash" | "ionet" | "vast" | "golem",
) => [
  { name: PROJECTS[project].name, url: PROJECTS[project].guide },
  {
    name: "IOTA Watch · read adapters",
    url: "https://github.com/molimao/iota/tree/main/src/lib",
  },
  ...(project === "nosana"
    ? [
        { name: "Nosana API", url: "https://api.nosana.com/api/docs" },
        { name: "Nosana dashboard", url: PROJECTS.nosana.explorer },
      ]
    : project === "gonka"
      ? [{ name: "Gonka Network Node API", url: PROJECTS.gonka.explorer }]
      : project === "flyai"
        ? [{ name: "fly.ai month response", url: PROJECTS.flyai.explorer }]
        : project === "akash"
          ? [{ name: "Akash provider directory", url: PROJECTS.akash.explorer }]
          : project === "golem"
            ? [{ name: "Golem Stats", url: PROJECTS.golem.explorer }]
            : project === "vast"
              ? [
                  { name: "Vast Host machines", url: PROJECTS.vast.explorer },
                  {
                    name: "Vast API permissions",
                    url: "https://docs.vast.ai/api-reference/permissions",
                  },
                ]
              : []),
];

const projects = ["flyai", "nosana", "gonka", "akash", "ionet", "vast", "golem"] as const;

const published = {
  flyai: "2026-10-06",
  nosana: "2026-10-06",
  gonka: "2026-10-06",
  akash: "2026-10-06",
  ionet: "2026-10-06",
  vast: "2026-10-06",
  golem: "2026-10-06",
} as const;

const limits: Record<(typeof projects)[number], Record<SiteLocale, RegExp>> = {
  flyai: {
    zh: /不是可提现/,
    "zh-TW": /不是可提領/,
    en: /not withdrawable cash/,
    ko: /출금 가능한 현금이 아닙니다/,
    ja: /出金可能な現金ではありません|出金できる現金ではありません/,
  },
  nosana: {
    zh: /不是 NOS 收益|不能换算 NOS 收益/,
    "zh-TW": /不是 NOS 收益|不能換算 NOS 收益/,
    en: /not a NOS earnings amount|not NOS earnings/,
    ko: /NOS 수익/,
    ja: /NOS収益/,
  },
  gonka: {
    zh: /GNK/,
    "zh-TW": /GNK/,
    en: /credited-GNK|not GNK/,
    ko: /GNK/,
    ja: /GNK/,
  },
  akash: {
    zh: /AKT/,
    "zh-TW": /AKT/,
    en: /not an AKT or USD amount|not AKT or USD income/,
    ko: /AKT/,
    ja: /AKT/,
  },
  ionet: {
    zh: /真实账户/,
    "zh-TW": /真實帳戶/,
    en: /real-account validation sample|real account is verified/,
    ko: /실제 계정/,
    ja: /実アカウント/,
  },
  vast: {
    zh: /真实 Host/,
    "zh-TW": /真實 Host/,
    en: /Real Host account validation is pending|real Host account is verified/,
    ko: /실제 Host/,
    ja: /実Host/,
  },
  golem: {
    zh: /GLM/,
    "zh-TW": /GLM/,
    en: /GLM/,
    ko: /GLM/,
    ja: /GLM/,
  },
};

const stripLinks = (value: string) => value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

const bodyHtml = (parts: string[]) =>
  parts
    .map((part) => {
      const linked = part.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2">$1</a>`);
      if (part.startsWith("## ")) return `<h2>${linked.slice(3)}</h2>`;
      return `<p>${linked}</p>`;
    })
    .join("");

const visibleText = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

describe("compute guide parity", () => {
  it("keeps the original additional guides ahead of the seven monitor guides", () => {
    expect(computeGuides).toHaveLength(additionalGuides.length + projects.length);
    additionalGuides.forEach((guide, index) => {
      expect(computeGuides[index]).toBe(guide);
    });
    for (const project of projects) {
      expect(
        computeGuides.filter((guide) => guide.slug === `${project}-monitor-guide`),
      ).toHaveLength(1);
    }
  });

  it("aligns each monitor guide in every locale with its source, fields, and FAQ", () => {
    const fieldTexts = new Set<string>();
    const checkTexts = new Set<string>();

    for (const project of projects) {
      const article = computeGuides.find((guide) => guide.slug === `${project}-monitor-guide`);
      expect(article?.project).toBe(project);
      if (!article) throw new Error(`missing ${project}`);
      expect(article.published).toBe(published[project]);
      expect(article.modified).toBe(isRemediatedGuide(project) ? "2026-10-23" : "2026-10-22");
      expect(article.related).toEqual(["data-sources-and-freshness"]);
      expect(article.sources).toEqual(expectedSources(project));
      if (project === "gonka") expect(article.evidence).toBe(gonkaEvidence);
      else expect(article.evidence).toBeUndefined();

      for (const locale of LOCALES) {
        const summary = article.summary?.[locale] ?? "";
        const action = article.decision?.action[locale] ?? "";
        const comparison = article.comparison?.[locale];
        const questions = article.questions?.[locale] ?? [];
        const body = article.body[locale];
        const html = bodyHtml(body);
        const text = visibleText(html);
        const answerText = questions.map((item) => stripLinks(item.answer)).join(" ");
        const monitor = `/projects/${project}`;

        expect(summary).toBe(article.description[locale]);
        expect(summary.length).toBeGreaterThan(20);
        expect(article.decision?.title[locale].length).toBeGreaterThan(4);
        expect(action).toContain(monitor);
        expect(action).toContain(PROJECTS[project].guide);
        expect(stripLinks(action)).not.toMatch(/\]\(/);
        expect(article.comparisonTitle?.[locale]?.length).toBeGreaterThan(4);
        expect(comparison?.headers).toHaveLength(3);
        expect(text).toContain(body[3]);
        expect(text).toContain(body[5]);
        fieldTexts.add(body[3]!);
        checkTexts.add(body[5]!);
        if (!isRemediatedGuide(project)) {
          expect(comparison?.rows).toHaveLength(1);
          expect(comparison?.rows[0]?.[1]).toBe(body[3]);
          expect(comparison?.rows[0]?.[2]).toBe(body[5]);
          expect(text).toContain(comparison?.rows[0]?.[0] ?? "");
          expect(questions).toHaveLength(2);
          expect(questions[0]?.answer).toBe(body[1]);
          expect(questions[1]?.answer).toBe(body[5]);
          expect(body.some((block) => block === `## ${guideSections.input[locale]}`)).toBe(true);
        } else {
          expect(comparison?.rows.length).toBeGreaterThan(1);
          expect(new Set(comparison?.rows.map((row) => row[0])).size).toBe(comparison?.rows.length);
          expect(questions).toHaveLength(4);
          expect(body.join("\n")).not.toContain(`## ${guideSections.input[locale]}`);
          for (const item of questions) {
            const index = body.indexOf(`## ${item.question}`);
            expect(index).toBeGreaterThanOrEqual(0);
            expect(body[index + 1]).toBe(item.answer);
          }
          const html = renderToStaticMarkup(
            createElement(
              LocaleContext.Provider,
              { value: locale },
              createElement(
                QueryClientProvider,
                { client: new QueryClient() },
                createElement(ArticleView, { article, section: "learn", related: [] }),
              ),
            ),
          );
          const markdown = buildArticleMarkdown(article, locale);
          const schemas = seo(locale, "learn", article.slug).scripts.map((script) =>
            JSON.parse(script.children as string),
          );
          const faq = schemas.find((item) => item["@type"] === "FAQPage");
          const articleSchema = schemas.find((item) => item["@type"] === "Article");
          expect(articleSchema.dateModified).toBe("2026-10-23");
          expect(articleSchema.headline).toBe(article.title[locale]);
          expect(articleSchema.description).toBe(article.description[locale]);
          expect(
            faq.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
              question: item.name,
              answer: item.acceptedAnswer.text,
            })),
          ).toEqual(questions);
          expect(markdown).toContain("Updated: 2026-10-23");
          expect(markdown).toContain(article.comparisonTitle?.[locale]);
          expect(html).toContain(`dateTime="2026-10-23"`);
          for (const row of comparison?.rows ?? []) {
            for (const cell of row) {
              expect(markdown).toContain(cell);
              expect(html).toContain(cell);
            }
          }
          for (const item of questions) {
            expect(html).toContain(renderToStaticMarkup(createElement("p", null, item.answer)));
            expect(markdown).toContain(item.question);
            expect(markdown).toContain(item.answer);
          }
          const surfaced = [
            summary,
            stripLinks(action),
            text,
            ...(comparison?.rows.flat() ?? []),
          ].join("\n");
          expect(surfaced).toContain(illustrative[locale]);
          if (project === "flyai") {
            expect(surfaced).toContain("3349300318.6855006");
            expect(surfaced).toContain("2026-11-01T00:00:00.000Z");
            expect(surfaced).toContain("2026-10-23");
          }
          if (project === "nosana" && locale === "en") {
            expect(surfaced).toContain("jobs.totalJobs");
            expect(surfaced).toContain("stats.completed");
            expect(surfaced).toContain("cannot establish live activity");
            expect(surfaced).toContain("not NOS earnings");
          }
          if (project === "akash" && locale === "en") {
            expect(surfaced).toContain("does not load lease counts or AKT payments");
            expect(surfaced).toContain("isOnline");
            expect(surfaced).toContain("lastCheckDate");
            expect(surfaced).toContain("stats.gpu.total");
          }
          if (project === "golem" && locale === "en") {
            expect(surfaced).toContain("earnings_total");
            expect(surfaced).toContain("0x");
            expect(surfaced).toContain("40");
            expect(surfaced).toContain("not a wallet payout");
          }
          if (project === "vast" && locale === "en") {
            for (const key of ["gpu_earn", "sto_earn", "bwu_earn", "bwd_earn"]) {
              expect(surfaced).toContain(key);
            }
            expect(surfaced).toContain("stays unknown");
            expect(surfaced).toContain("Real Host account validation is pending");
            expect(surfaced).not.toMatch(/has been validated/);
          }
        }
        for (const item of questions) {
          expect(item.question).toMatch(/[?？]$/);
          expect(item.answer).not.toMatch(/\[[^\]]+\]\([^)]+\)/);
          expect(text).toContain(stripLinks(item.answer));
        }
        expect(text).toContain(answerText.replace(/\s+/g, " ").trim().slice(0, 40));

        const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]!);
        expect(hrefs).toContain(PROJECTS[project].guide);
        expect(hrefs).toContain(monitor);
        for (const href of hrefs) {
          if (href.startsWith("http"))
            expect(article.sources?.map((source) => source.url)).toContain(href);
        }
        for (const href of [...action.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]!)) {
          if (href.startsWith("http"))
            expect(article.sources?.map((source) => source.url)).toContain(href);
        }
        expect(`${summary}\n${action}\n${text}\n${answerText}`).toMatch(limits[project][locale]);
        expect(`${summary}\n${action}\n${text}`).not.toMatch(
          /远程控制|remote control|\bworkers?\b|全功能 Agent|Agent 支持/i,
        );
      }
    }

    expect(fieldTexts.size).toBe(projects.length * LOCALES.length);
    expect(checkTexts.size).toBe(projects.length * LOCALES.length);
  });
});
