import { articles, articleDates, type Article } from "../components/site/articles";
import { blogPosts } from "../components/site/blog-posts";
import { ORIGIN, LOCALES, type SiteLocale } from "./site";

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
  { path: "", lastmod: "2026-10-01", changefreq: "weekly", priority: "1.0" },
  { path: "blog", lastmod: "2026-10-01", changefreq: "weekly", priority: "0.9" },
  { path: "learn", lastmod: "2026-10-01", changefreq: "weekly", priority: "0.9" },
  { path: "network", lastmod: "2026-10-01", changefreq: "weekly", priority: "0.8" },
  { path: "downloads", lastmod: "2026-10-01", changefreq: "monthly", priority: "0.8" },
  { path: "faq", changefreq: "monthly", priority: "0.8" },
  { path: "guide", changefreq: "monthly", priority: "0.7" },
  { path: "privacy", changefreq: "yearly", priority: "0.3" },
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

function pageLabel(locale: SiteLocale, path: string) {
  if (!path) return locale === "en" ? "Home" : "首页";
  if (path === "blog") return locale === "en" ? "Blog" : "博客";
  if (path.startsWith("blog/"))
    return blogPosts.find((post) => path === `blog/${post.slug}`)?.title[locale] ?? path;
  if (path === "learn") return locale === "en" ? "Help" : "使用说明";
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
      const zh = pageUrl("zh", page.path, origin);
      const en = pageUrl("en", page.path, origin);
      return `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zh}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
    <lastmod>${page.lastmod ?? LASTMOD}</lastmod>
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

IOTA Watch lets a person add public Miner IDs (SS58 hotkeys) and see reported training status, today’s accounted rewards, and lifetime accounted rewards. Google sign-in is optional: 3 devices in the current browser without an account, or 10 devices bound to a Google account. No private key. No seed phrase. The site cannot start training or read local Mac logs.

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

## Official sources

- Train at Home app: https://iota.macrocosmos.ai/
- TAH user guide: https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide
- Official network dashboard: https://iota.macrocosmos.ai/dashboard
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
- ZH: ${pageUrl("zh", `${section}/${article.slug}`, origin)}
- EN: ${pageUrl("en", `${section}/${article.slug}`, origin)}
- Published: ${dates.published}
- Updated: ${dates.modified}
- Publisher: IOTA Watch (independent monitor)

${article.body.en.map((block) => absoluteArticleLinks(block, "en", origin)).join("\n\n")}

### ${article.title.zh}

${article.body.zh.map((block) => absoluteArticleLinks(block, "zh", origin)).join("\n\n")}
${article.sources?.map((source) => `- Source: ${source.name} — ${source.url}`).join("\n") ?? ""}`;
    })
    .join("\n\n");

  return `${buildLlmsTxt(origin)}
## Complete bilingual guides

${articleBlocks}
`;
}

function absoluteArticleLinks(text: string, locale: SiteLocale, origin: string) {
  return text.replace(
    /\]\(\/(?!\/)([^)]+)\)/g,
    (_, path: string) => `](${origin}/${/^(en|zh)(\/|$)/.test(path) ? path : `${locale}/${path}`})`,
  );
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

${article.body[locale].map((block) => absoluteArticleLinks(block, locale, origin)).join("\n\n")}
${article.sources ? `\n## ${locale === "en" ? "Sources and implementation" : "资料来源与本站实现"}\n\n${article.sources.map((source) => `- [${source.name}](${source.url})`).join("\n")}` : ""}
`;
}
