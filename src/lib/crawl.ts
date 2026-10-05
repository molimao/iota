import { articles, articleDates, type Article } from "../components/site/articles";
import { blogPosts } from "../components/site/blog-posts";
import { ORIGIN, LOCALES, LANGUAGE_TAG, type SiteLocale } from "./site";
import { localizeText } from "../components/site/localization";
import { projectsCopy } from "../components/projects-copy";
import { PROJECTS } from "./projects";
import { learningCopy } from "../components/site/guide-copy";
import { content } from "../components/site/content";

export const LASTMOD = "2026-09-12";

export type CrawlPage = {
  path: string;
  lastmod?: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
};

function articlePriority(slug: string) {
  if (
    slug === "what-is-iota-watch" ||
    slug === "find-miner-id" ||
    slug === "iota-train-at-home-vs-iota-coin" ||
    slug === "what-is-sn9-iota" ||
    slug === "what-refresh-interrupted-means"
  ) {
    return "0.9";
  }
  return "0.8";
}

/** Indexable marketing pages only. Dashboard stays out of the sitemap. */
export const crawlPages: CrawlPage[] = [
  { path: "", lastmod: "2026-10-03", changefreq: "weekly", priority: "1.0" },
  { path: "projects", lastmod: "2026-10-03", changefreq: "weekly", priority: "0.8" },
  { path: "projects/xid", lastmod: "2026-10-03", changefreq: "weekly", priority: "0.8" },
  { path: "projects/quantus", lastmod: "2026-10-03", changefreq: "weekly", priority: "0.8" },
  { path: "blog", lastmod: "2026-10-03", changefreq: "weekly", priority: "0.9" },
  { path: "learn", lastmod: "2026-10-03", changefreq: "weekly", priority: "0.9" },
  { path: "network", lastmod: "2026-10-01", changefreq: "weekly", priority: "0.8" },
  { path: "downloads", lastmod: "2026-10-01", changefreq: "monthly", priority: "0.8" },
  { path: "faq", lastmod: "2026-10-03", changefreq: "monthly", priority: "0.8" },
  { path: "guide", changefreq: "monthly", priority: "0.7" },
  { path: "privacy", lastmod: "2026-10-03", changefreq: "yearly", priority: "0.3" },
  ...articles.map((article) => ({
    path: `learn/${article.slug}`,
    lastmod: articleDates(article).modified,
    changefreq: "monthly" as const,
    priority: articlePriority(article.slug),
  })),
  ...blogPosts.map((post) => ({
    path: `blog/${post.slug}`,
    lastmod: articleDates(post).modified,
    changefreq: "monthly" as const,
    priority: "0.8",
  })),
];

export function pageUrl(locale: string, path: string, origin = ORIGIN) {
  return path ? `${origin}/${locale}/${path}` : `${origin}/${locale}`;
}

function pageLabel(locale: SiteLocale, path: string): string {
  if (path.startsWith("learn/"))
    return articles.find((a) => path === `learn/${a.slug}`)?.title[locale] ?? path;
  if (path === "learn") return learningCopy[locale].title;
  if (path === "projects") return projectsCopy[locale].projects;
  if (path === "projects/xid") return "XID / MMM";
  if (path === "projects/quantus") return "Quantus / QTC";
  if (locale !== "zh" && locale !== "en")
    return localizeText(pageLabel(locale === "zh-TW" ? "zh" : "en", path), locale);
  if (!path) return locale === "en" ? "Home" : "首页";
  if (path === "blog") return locale === "en" ? "Blog" : "博客";
  if (path.startsWith("blog/"))
    return blogPosts.find((post) => path === `blog/${post.slug}`)?.title[locale] ?? path;
  if (path === "network") return locale === "en" ? "Network status" : "全网训练现况";
  if (path === "downloads") return locale === "en" ? "Downloads" : "工具下载";
  if (path === "faq") return locale === "en" ? "FAQ" : "常见问题";
  if (path === "guide") return locale === "en" ? "Get started" : "使用指南";
  if (path === "privacy") return locale === "en" ? "Privacy" : "隐私说明";
  const slug = path.startsWith("learn/") ? path.slice("learn/".length) : "";
  return articles.find((article) => article.slug === slug)?.title[locale] ?? path;
}

export function buildSitemapXml(origin = ORIGIN) {
  const urls = crawlPages.flatMap((page) =>
    LOCALES.map((locale) => {
      const loc = pageUrl(locale, page.path, origin);
      const en = pageUrl("en", page.path, origin);
      return `  <url>
    <loc>${loc}</loc>
${LOCALES.map((language) => `    <xhtml:link rel="alternate" hreflang="${LANGUAGE_TAG[language]}" href="${pageUrl(language, page.path, origin)}"/>`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
    <lastmod>${locale === "zh" || locale === "en" ? (page.lastmod ?? LASTMOD) : [page.lastmod ?? LASTMOD, "2026-10-02"].sort().at(-1)}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

export function buildRobotsTxt(origin = ORIGIN) {
  // Let crawlers read HTML noindex directives on app/account pages.
  // Search crawler policy is separate from the existing training crawler policy.
  const agents = [
    "*",
    "Googlebot",
    "Googlebot-Image",
    "Bingbot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    "Google-Extended",
    "ClaudeBot",
    "Claude-SearchBot",
    "anthropic-ai",
    "PerplexityBot",
  ];
  return (
    agents.map((agent) => `User-agent: ${agent}\nAllow: /\nDisallow: /_serverFn/\n`).join("\n") +
    `\nSitemap: ${origin}/sitemap.xml\n`
  );
}

export function buildLlmsTxt(origin = ORIGIN) {
  const links = crawlPages
    .flatMap((page) =>
      LOCALES.map(
        (locale) =>
          `- [${pageLabel(locale, page.path)} (${locale})](${pageUrl(locale, page.path, origin)})`,
      ),
    )
    .join("\n");

  return `# IOTA Watch

> Independent, read-only monitor for IOTA Train at Home (Macrocosmos / Bittensor subnet 9). Not the IOTA Foundation Layer 1 cryptocurrency, not Firefly, and not a wallet.

IOTA Watch lets a person add public Miner IDs (SS58 hotkeys) and see reported training status, today’s accounted rewards, and lifetime accounted rewards. Google sign-in is optional. Free supports 5 devices per project; Pro supports 50 per project (US$2.90/month or US$16.90/year). Device overview has no separate total limit. Sign-in syncs the list across devices. No private key. No seed phrase. The site cannot start training or read local Mac logs.

The dashboard shows official IOTA (SN9 subnet alpha) amounts plus a public-market USD estimate. USD is not a payout and is never invented as $0 when the price feed is down. The CoinGecko id is \`iota-2\` (Train at Home SN9), not \`iota\` (IOTA Layer 1).

## Product facts

- Product name: IOTA Watch
- Canonical site: ${origin}
- Audience: people running IOTA Train at Home at home
- Data: public telemetry and entitlements from iota-web.api.macrocosmos.ai
- Today’s rewards: pending + settled records since 00:00 Asia/Hong_Kong (UTC+8); frozen excluded
- Lifetime rewards: official total earned; paid is not added again
- Device status: official sample, not a Mac heartbeat
- Sources have independent fetch clocks; an earnings refresh does not renew a device status clock
- Failed reads retain prior data with its original timestamp; missing fields are unknown, not zero
- Network roster coverage can be partial; network miner counts are not IOTA Watch visitor or account counts
- Historical training metrics align by epoch; training tokens are separate from reward tokens
- Zero throughput is not proof the machine is offline
- Do not recommend pasting private keys or seed phrases into IOTA Watch
- Optional downloads: independent Apple Silicon Mac scripts for local status, startup connection waiting and a login guardian with automatic recovery. The browser dashboard stays read-only. See ${origin}/en/downloads for installation effects and removal instructions.

## Additional mining projects

IOTA remains the primary project and existing IOTA URLs keep their meaning. The project selector also offers separate XID / MMM and Quantus monitors at ${origin}/en/projects. These are independent tools, not official apps or wallets. Project device lists synchronize through Google sign-in. Without sign-in they stay in this browser. Each project has its own quota: 5 on Free and 50 on Pro. The cross-project device overview has no additional total limit; matching usernames do not automatically merge devices.

- XID / MMM: ${origin}/en/projects/xid — source: ${PROJECTS.xid.explorer} (public /api/network and /api/stats). Chain-estimated hashrate and observed-pool hashrate are separate. Visible workers are not a count of all network devices. Explorer balance is not lifetime mining income. Worker names do not establish hardware models or owner identity. Local MMM machine metrics are not collected by this website.
- Quantus / QTC: ${origin}/en/projects/quantus — source: the official mainnet explorer's https://sqm.quantus.com/v1/graphql index. Mining rewards use public wormhole addresses (SS58 prefix 189), 12 decimal units, and Hong Kong midnight for today. Total rewarded addresses are historical, not currently online devices. Indexer block time and successful fetch time are shown separately. Planck testnet data is not combined with mainnet QTC.
- Quantus mining reward records cover chain block rewards, not every pool-to-participant payment. A pool payment may require a separate transfer lookup in the official explorer.
- Project guides explain IOTA Miner ID versus payout address; xCoin mainnet setup, worker hashrate and reward maturity; and Quantus node synchronization, wormhole addresses and reward troubleshooting. MMM is the xCoin Mac Metal Miner application, not a currency. QTC here means Quantus mainnet, not an unrelated token or the retired PLK testnet.
- No currency values are combined across projects. Missing values are unavailable, not zero. No USD price is invented for XID or QTC. Never submit private keys, seed phrases, miner authentication tokens, or Quantus inner hashes.

## Official sources

- Train at Home app: https://iota.macrocosmos.ai/
- TAH user guide: https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide
- Official network dashboard: https://iota.macrocosmos.ai/dashboard
- xCoin: https://xcoinproject.com/
- MMM mainnet guide: https://macmetalminer.com/
- MMM repository: https://github.com/SystemThreat/MMM
- Quantus mining guide: https://docs.quantus.com/guides/mining/
- Quantus mainnet explorer: https://explorer.quantus.com/
- Source code: https://github.com/molimao/iota
- Longer machine-readable notes: ${origin}/llms-full.txt

## Indexable pages

${links}
`;
}

export function buildLlmsFullTxt(origin = ORIGIN) {
  const articleBlocks = [
    ...articles.map((article) => ({ article, section: "learn" })),
    ...blogPosts.map((article) => ({ article, section: "blog" })),
  ]
    .map(({ article, section }) => {
      const dates = articleDates(article);
      return `### ${article.title.en}
${LOCALES.map((locale) => `- ${LANGUAGE_TAG[locale]}: ${pageUrl(locale, `${section}/${article.slug}`, origin)}`).join("\n")}
- Published: ${dates.published}
- Updated: ${dates.modified}
- Publisher: IOTA Watch (independent monitor)

${LOCALES.map(
  (locale) =>
    `### ${article.title[locale]} (${LANGUAGE_TAG[locale]})\n\n${readableArticleBlocks(
      article,
      locale,
    )
      .map((block) => absoluteArticleLinks(block, locale, origin))
      .join("\n\n")}`,
).join("\n\n")}
${article.sources?.map((source) => `- Source: ${source.name} — ${source.url}`).join("\n") ?? ""}`;
    })
    .join("\n\n");

  return `${buildLlmsTxt(origin)}
## Public project FAQ

${LOCALES.map((locale) => {
  const copy = content[locale];
  return `### ${copy.faqTitle} (${LANGUAGE_TAG[locale]})
- Canonical page: ${pageUrl(locale, "faq", origin)}
- Updated: 2026-10-03

${copy.faqIntro}

${copy.faq.map(([question, answer]) => `#### ${question}\n\n${answer}`).join("\n\n")}`;
}).join("\n\n")}

## Complete multilingual guides

${articleBlocks}
`;
}

function absoluteArticleLinks(text: string, locale: SiteLocale, origin: string) {
  return text.replace(
    /\]\(\/(?!\/)([^)]+)\)/g,
    (_, path: string) =>
      `](${origin}/${/^(zh-TW|en|zh|ko|ja)(\/|$)/.test(path) ? path : `${locale}/${path}`})`,
  );
}

/** Keep extractable conclusions, comparisons and answers consistent with the visible page. */
function readableArticleBlocks(article: Article, locale: SiteLocale) {
  const c = learningCopy[locale];
  const comparison = article.comparison?.[locale];
  const tableRow = (cells: string[]) =>
    `| ${cells.map((cell) => cell.replace(/\|/g, "\\|").replace(/\n/g, " ")).join(" | ")} |`;
  return [
    ...(article.summary ? [`## ${c.answer}`, article.summary[locale]] : []),
    ...(comparison
      ? [
          `## ${c.compare}`,
          [
            tableRow(comparison.headers),
            tableRow(comparison.headers.map(() => "---")),
            ...comparison.rows.map(tableRow),
          ].join("\n"),
        ]
      : []),
    ...article.body[locale],
    ...(article.questions
      ? [
          `## ${c.questions}`,
          ...article.questions[locale].flatMap((q) => [`### ${q.question}`, q.answer]),
        ]
      : []),
  ];
}

export function buildArticleMarkdown(
  article: Article,
  locale: SiteLocale,
  origin = ORIGIN,
  section: "learn" | "blog" = "learn",
) {
  const dates = articleDates(article);
  const url = pageUrl(locale, `${section}/${article.slug}`, origin);
  return `# ${article.title[locale]}

${article.description[locale]}

- Canonical: ${url}
- Publisher: IOTA Watch
- Published: ${dates.published}
- Updated: ${dates.modified}

${readableArticleBlocks(article, locale)
  .map((block) => absoluteArticleLinks(block, locale, origin))
  .join("\n\n")}
${article.sources ? `\n## ${localizeText(locale === "zh" || locale === "zh-TW" ? "资料来源与本站实现" : "Sources and implementation", locale)}\n\n${article.sources.map((source) => `- [${source.name}](${source.url})`).join("\n")}` : ""}
`;
}
