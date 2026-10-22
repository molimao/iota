import { additionalGuides } from "@/components/site/additional-guides";
import { computeGuides } from "@/components/site/compute-guides";
import { gonkaEvidence } from "@/components/site/core-evidence";
import { LOCALES, type SiteLocale } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { describe, expect, it } from "vitest";

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
      expect(article.modified).toBe("2026-10-22");
      expect(article.related).toEqual(["data-sources-and-freshness"]);
      expect(article.sources).toEqual([
        { name: PROJECTS[project].name, url: PROJECTS[project].guide },
        {
          name: "IOTA Watch · read adapters",
          url: "https://github.com/molimao/iota/tree/main/src/lib",
        },
        ...(project === "nosana"
          ? [{ name: "Nosana API", url: "https://api.nosana.com/api/docs" }]
          : project === "gonka"
            ? [{ name: "Gonka Network Node API", url: PROJECTS.gonka.explorer }]
            : []),
      ]);
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
        expect(comparison?.rows).toHaveLength(1);
        expect(comparison?.rows[0]?.[1]).toBe(body[3]);
        expect(comparison?.rows[0]?.[2]).toBe(body[5]);
        expect(text).toContain(comparison?.rows[0]?.[0] ?? "");
        expect(text).toContain(body[3]);
        expect(text).toContain(body[5]);
        fieldTexts.add(body[3]!);
        checkTexts.add(body[5]!);

        expect(questions).toHaveLength(2);
        expect(questions[0]?.answer).toBe(body[1]);
        expect(questions[1]?.answer).toBe(body[5]);
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
