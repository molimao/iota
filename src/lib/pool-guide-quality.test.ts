import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleView } from "../components/site/pages";
import { ProjectLearning } from "../components/site/project-learning";
import { LocaleContext } from "../components/site/locale";
import { poolMonitorGuides } from "../components/site/pool-monitor-guides";
import { guidesForProject } from "../components/site/project-guides";
import { seo } from "../components/site/seo";
import { articleProjects, getArticle, relatedArticles } from "../components/site/articles";
import { buildArticleMarkdown } from "./crawl";
import { projectPath, type ProjectId } from "./projects";
import { LOCALES, type SiteLocale } from "./site";

const SLUGS = [
  "xmr-mining-monitor-guide",
  "etc-mining-monitor-guide",
  "rvn-mining-monitor-guide",
  "zec-mining-monitor-guide",
  "kas-mining-monitor-guide",
  "erg-mining-monitor-guide",
  "zeph-mining-monitor-guide",
  "btc-mining-monitor-guide",
  "ethw-mining-monitor-guide",
] as const;

const REQUIRED_SOURCES: Record<(typeof SLUGS)[number], string[]> = {
  "xmr-mining-monitor-guide": [
    "https://pool.kryptex.com/en/xmr",
    "https://www.getmonero.org/resources/moneropedia/address.html",
  ],
  "etc-mining-monitor-guide": [
    "https://etc.2miners.com/help",
    "https://ethereumclassic.org/",
    "https://github.com/2miners/apidoc",
  ],
  "rvn-mining-monitor-guide": [
    "https://rvn.2miners.com/help",
    "https://ravencoin.org/",
    "https://github.com/2miners/apidoc",
  ],
  "zec-mining-monitor-guide": [
    "https://zec.2miners.com/help",
    "https://z.cash/learn/what-is-the-difference-between-shielded-and-transparent-zcash/",
    "https://github.com/2miners/apidoc",
  ],
  "kas-mining-monitor-guide": [
    "https://kas.2miners.com/help",
    "https://kaspa.org/",
    "https://github.com/2miners/apidoc",
  ],
  "erg-mining-monitor-guide": [
    "https://erg.2miners.com/help",
    "https://ergoplatform.org/",
    "https://github.com/2miners/apidoc",
  ],
  "zeph-mining-monitor-guide": [
    "https://zeph.2miners.com/help",
    "https://www.zephyrprotocol.com/",
    "https://github.com/2miners/apidoc",
  ],
  "btc-mining-monitor-guide": [
    "https://solo.ckpool.org/",
    "https://raw.stats.ckpool.org/pool/pool.status",
    "https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki",
  ],
  "ethw-mining-monitor-guide": [
    "https://ethw.2miners.com/help",
    "https://ethw.2miners.com/",
    "https://github.com/2miners/apidoc",
  ],
};

const MARKS: Record<(typeof SLUGS)[number], Record<SiteLocale, string[]>> = {
  "xmr-mining-monitor-guide": {
    zh: ["Kryptex", "RandomX", "子地址", "集成地址"],
    "zh-TW": ["Kryptex", "RandomX", "子地址", "整合地址"],
    en: ["Kryptex", "RandomX", "subaddress", "integrated"],
    ko: ["Kryptex", "RandomX", "서브주소", "통합"],
    ja: ["Kryptex", "RandomX", "サブアドレス", "統合"],
  },
  "etc-mining-monitor-guide": {
    zh: ["ETCHash", "Ethereum Classic", "solo-etc.2miners.com", "0x"],
    "zh-TW": ["ETCHash", "Ethereum Classic", "solo-etc.2miners.com", "0x"],
    en: ["ETCHash", "Ethereum Classic", "solo-etc.2miners.com", "0x"],
    ko: ["ETCHash", "Ethereum Classic", "solo-etc.2miners.com", "0x"],
    ja: ["ETCHash", "Ethereum Classic", "solo-etc.2miners.com", "0x"],
  },
  "rvn-mining-monitor-guide": {
    zh: ["KawPoW", "solo-rvn.2miners.com", "Worker"],
    "zh-TW": ["KawPoW", "solo-rvn.2miners.com", "Worker"],
    en: ["KawPoW", "solo-rvn.2miners.com", "Worker"],
    ko: ["KawPoW", "solo-rvn.2miners.com", "Worker"],
    ja: ["KawPoW", "solo-rvn.2miners.com", "Worker"],
  },
  "zec-mining-monitor-guide": {
    zh: ["Equihash", "t1", "S/s", "solo-zec.2miners.com", "屏蔽"],
    "zh-TW": ["Equihash", "t1", "S/s", "solo-zec.2miners.com", "屏蔽"],
    en: ["Equihash", "t1", "S/s", "solo-zec.2miners.com", "shielded"],
    ko: ["Equihash", "t1", "S/s", "solo-zec.2miners.com", "차폐"],
    ja: ["Equihash", "t1", "S/s", "solo-zec.2miners.com", "シールド"],
  },
  "kas-mining-monitor-guide": {
    zh: ["kaspa:", "kHeavyHash", "solo-kas.2miners.com"],
    "zh-TW": ["kaspa:", "kHeavyHash", "solo-kas.2miners.com"],
    en: ["kaspa:", "kHeavyHash", "solo-kas.2miners.com"],
    ko: ["kaspa:", "kHeavyHash", "solo-kas.2miners.com"],
    ja: ["kaspa:", "kHeavyHash", "solo-kas.2miners.com"],
  },
  "erg-mining-monitor-guide": {
    zh: ["Autolykos", "solo-erg.2miners.com", "HTTP 200", "以 9 开头"],
    "zh-TW": ["Autolykos", "solo-erg.2miners.com", "HTTP 200", "以 9 開頭"],
    en: ["Autolykos", "solo-erg.2miners.com", "HTTP 200", "starts with 9"],
    ko: ["Autolykos", "solo-erg.2miners.com", "HTTP 200", "9로 시작"],
    ja: ["Autolykos", "solo-erg.2miners.com", "HTTP 200", "9で始ま"],
  },
  "zeph-mining-monitor-guide": {
    zh: ["ZEPHYR", "RandomX", "solo-zeph.2miners.com", "Monero"],
    "zh-TW": ["ZEPHYR", "RandomX", "solo-zeph.2miners.com", "Monero"],
    en: ["ZEPHYR", "RandomX", "solo-zeph.2miners.com", "Monero"],
    ko: ["ZEPHYR", "RandomX", "solo-zeph.2miners.com", "Monero"],
    ja: ["ZEPHYR", "RandomX", "solo-zeph.2miners.com", "Monero"],
  },
  "btc-mining-monitor-guide": {
    zh: ["CKPool", "SHA-256", "bc1", "pool.status"],
    "zh-TW": ["CKPool", "SHA-256", "bc1", "pool.status"],
    en: ["CKPool", "SHA-256", "bc1", "pool.status"],
    ko: ["CKPool", "SHA-256", "bc1", "pool.status"],
    ja: ["CKPool", "SHA-256", "bc1", "pool.status"],
  },
  "ethw-mining-monitor-guide": {
    zh: ["ETHash", "solo-ethw.2miners.com", "0x", "ETHW"],
    "zh-TW": ["ETHash", "solo-ethw.2miners.com", "0x", "ETHW"],
    en: ["ETHash", "solo-ethw.2miners.com", "0x", "ETHW"],
    ko: ["ETHash", "solo-ethw.2miners.com", "0x", "ETHW"],
    ja: ["ETHash", "solo-ethw.2miners.com", "0x", "ETHW"],
  },
};

function absoluteGuideLinks(text: string, locale: string) {
  return text.replace(/\]\(\/(?!\/)([^)]+)\)/g, (_, linked: string) => {
    const alreadyPrefixed = /^(?:zh-TW|en|zh|ko|ja|images|evidence)(?:\/|$)/.test(linked);
    return `](https://iotahome.site/${alreadyPrefixed ? linked : `${locale}/${linked}`})`;
  });
}

function schemas(locale: SiteLocale, slug: string) {
  return seo(locale, "learn", slug).scripts.map((script) =>
    JSON.parse(String(script.children)),
  ) as Array<{
    "@type"?: string;
    mainEntity?: Array<{ name: string; acceptedAnswer: { text: string } }>;
  }>;
}

describe("pool monitor guides", () => {
  it("publishes pool guides with distinct official sources in five languages", () => {
    expect(poolMonitorGuides.map((guide) => guide.slug)).toEqual([...SLUGS]);
    const sourceSets = poolMonitorGuides.map((guide) =>
      guide
        .sources!.map((source) => source.url)
        .sort()
        .join("|"),
    );
    expect(new Set(sourceSets).size).toBe(SLUGS.length);
    for (const raw of poolMonitorGuides) {
      const slug = raw.slug as (typeof SLUGS)[number];
      const dated = slug === "btc-mining-monitor-guide" || slug === "ethw-mining-monitor-guide";
      expect(raw.published).toBe(dated ? "2026-10-23" : "2026-10-22");
      expect(raw.project).toBeTruthy();
      expect(raw.sources!.length).toBeGreaterThanOrEqual(2);
      for (const url of REQUIRED_SOURCES[slug]) {
        expect(raw.sources!.map((source) => source.url)).toContain(url);
      }
      const guide = getArticle(raw.slug)!;
      expect(guide.published).toBe(raw.published);
      expect(guide.modified).toBe("2026-10-24");
      expect(guide.sources!.length).toBeGreaterThanOrEqual(2);
      const faqCount = guide.questions?.en?.length ?? 0;
      expect(faqCount).toBeGreaterThanOrEqual(6);
      for (const locale of LOCALES) {
        expect(guide.title[locale].trim().length).toBeGreaterThan(8);
        expect(guide.summary?.[locale].trim().length).toBeGreaterThan(20);
        expect(guide.questions?.[locale]).toHaveLength(faqCount);
        expect(
          guide.body[locale].filter((block) => block.startsWith("## ")).length,
        ).toBeGreaterThanOrEqual(3);
        expect(new Set(LOCALES.map((item) => guide.title[item])).size).toBe(LOCALES.length);
        expect(new Set(LOCALES.map((item) => guide.body[item].join("\n"))).size).toBe(
          LOCALES.length,
        );
      }
    }
  });

  it("keeps decision, FAQ and comparison consistent with schema and both project links", () => {
    const client = new QueryClient();
    for (const raw of poolMonitorGuides) {
      const guide = getArticle(raw.slug)!;
      const project = guide.project as ProjectId;
      expect(guide.slug).toBe(raw.slug);
      expect(articleProjects(guide)).toEqual([project]);
      expect(guidesForProject(project).some((item) => item.slug === guide.slug)).toBe(true);
      expect(relatedArticles(guide.slug).map((item) => item.slug)).toEqual(guide.related);
      for (const locale of LOCALES) {
        const html = renderToStaticMarkup(
          createElement(
            LocaleContext.Provider,
            { value: locale },
            createElement(
              QueryClientProvider,
              { client },
              createElement(ArticleView, {
                article: guide,
                section: "learn",
                related: relatedArticles(guide.slug),
              }),
            ),
          ),
        );
        expect(raw.decision!.title[locale].length).toBeGreaterThan(4);
        if (guide.decision) expect(html).toContain(guide.decision.title[locale]);
        expect(html).toContain(`href="${projectPath(locale, project)}"`);
        expect(html).toContain(guide.comparisonTitle![locale]);
        const faq = schemas(locale, guide.slug).find((item) => item["@type"] === "FAQPage");
        expect(
          faq?.mainEntity?.map((item) => ({
            question: item.name,
            answer: item.acceptedAnswer.text,
          })),
        ).toEqual(guide.questions![locale]);
        const markdown = buildArticleMarkdown(guide, locale);
        const action = guide.decision?.action[locale] ?? raw.decision!.action[locale];
        const actionLabel = action.match(/\[([^\]]+)\]/)?.[1];
        if (guide.decision) expect(markdown).toContain(`## ${guide.decision.title[locale]}`);
        expect(actionLabel).toBeTruthy();
        expect(markdown).toContain(`https://iotahome.site/${locale}/projects/${project}`);
        expect(markdown).toContain(guide.comparisonTitle![locale]);
        for (const row of guide.comparison![locale].rows) {
          for (const cell of row) expect(markdown).toContain(cell);
        }
        for (const question of guide.questions![locale]) {
          expect(markdown).toContain(question.question);
          expect(markdown).toContain(absoluteGuideLinks(question.answer, locale));
        }
        const learning = renderToStaticMarkup(
          createElement(
            LocaleContext.Provider,
            { value: locale },
            createElement(ProjectLearning, { project }),
          ),
        );
        expect(learning).toContain(`href="/${locale}/learn/${guide.slug}"`);
      }
    }
  }, 20000);

  it("uses project-specific boundaries and does not invent payout figures", () => {
    for (const raw of poolMonitorGuides) {
      const guide = getArticle(raw.slug)!;
      const slug = raw.slug as (typeof SLUGS)[number];
      for (const locale of LOCALES) {
        const legacy = [
          ...raw.body[locale],
          raw.summary![locale],
          raw.decision!.action[locale],
        ].join("\n");
        const text = [
          ...guide.body[locale],
          guide.summary![locale],
          guide.decision?.action[locale] ?? "",
        ].join("\n");
        for (const mark of MARKS[slug][locale]) expect(legacy).toContain(mark);
        expect(text).not.toMatch(/1e-9|1e-12/);
        expect(text).not.toMatch(/:\d{4,5}\b/);
        expect(text).not.toMatch(/保证收益|保證收益|guaranteed profit|수익을 보장|利益を保証/);
        expect(text).toMatch(/5|五|five|다섯|五台/i);
        expect(text).toMatch(/50|五十|fifty|쉰/);
      }
    }
  });
});
