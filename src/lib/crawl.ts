import { projectVerification, verificationQuestion } from "../components/project-verification";
import { DISCOVERY_UPDATED, problemLinks, productQuestions } from "./product-discovery";
import { projectEditorial } from "../components/project-editorial";
import { articles, articleDates, articleProjects, type Article } from "../components/site/articles";
import { PROJECT_CONTENT_DATES, PROJECT_INDEX_UPDATED, editionDate } from "./content-dates";
import { discoveryCopy } from "./product-discovery";
import { evidenceLabels } from "../components/site/core-evidence";
import { blogPosts } from "../components/site/blog-posts";
import { ORIGIN, LOCALES, LANGUAGE_TAG, type SiteLocale } from "./site";
import { localizeText } from "../components/site/localization";
import { projectsCopy } from "../components/projects-copy";
import { PROJECTS, PROJECT_IDS } from "./projects";
import { learningCopy } from "../components/site/guide-copy";
import { content } from "../components/site/content";

export const LASTMOD = "2026-09-12";

export type CrawlPage = {
  path: string;
  lastmod?: string;
  lastmodByLocale?: Record<SiteLocale, string>;
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
  { path: "", lastmod: DISCOVERY_UPDATED, changefreq: "weekly", priority: "1.0" },
  ...PROJECT_IDS.map((id) => ({
    path: `projects/${id}`,
    lastmod: PROJECT_CONTENT_DATES[id],
    changefreq: "weekly" as const,
    priority: "0.8",
  })),
  { path: "projects", lastmod: PROJECT_INDEX_UPDATED, changefreq: "weekly", priority: "0.8" },
  { path: "blog", lastmod: DISCOVERY_UPDATED, changefreq: "weekly", priority: "0.9" },
  { path: "learn", lastmod: DISCOVERY_UPDATED, changefreq: "weekly", priority: "0.9" },
  { path: "network", lastmod: "2026-10-01", changefreq: "weekly", priority: "0.8" },
  { path: "downloads", lastmod: "2026-10-17", changefreq: "monthly", priority: "0.8" },
  { path: "faq", lastmod: DISCOVERY_UPDATED, changefreq: "monthly", priority: "0.8" },
  { path: "guide", changefreq: "monthly", priority: "0.7" },
  { path: "privacy", lastmod: "2026-10-17", changefreq: "yearly", priority: "0.3" },
  ...articles.map((article) => ({
    path: `learn/${article.slug}`,
    lastmod: articleDates(article).modified,
    lastmodByLocale: Object.fromEntries(
      LOCALES.map((locale) => [locale, articleDates(article, locale).modified]),
    ) as Record<SiteLocale, string>,
    changefreq: "monthly" as const,
    priority: articlePriority(article.slug),
  })),
  ...blogPosts.map((post) => ({
    path: `blog/${post.slug}`,
    lastmod: articleDates(post).modified,
    lastmodByLocale: Object.fromEntries(
      LOCALES.map((locale) => [locale, articleDates(post, locale).modified]),
    ) as Record<SiteLocale, string>,
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
  const project = PROJECT_IDS.find((id) => path === `projects/${id}`);
  if (project) return projectEditorial[project].title[locale];
  if (path === "projects/flyai") return "fly.ai Compute";
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
    <lastmod>${page.lastmodByLocale?.[locale] ?? editionDate(page.lastmod ?? LASTMOD, locale)}</lastmod>
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

> ${discoveryCopy.intro.en}

IOTA Train at Home is the Macrocosmos / Bittensor subnet 9 project; IOTA Watch is independent and is not an IOTA Foundation Layer 1 wallet.

IOTA Watch lets a person add public Miner IDs (SS58 hotkeys) and see reported training status, yesterday’s attributed rewards, and lifetime accounted rewards. Google sign-in is optional. Free supports 5 devices per project; Pro supports 50 per project (US$2.99/month or US$16.99/year). Device overview has no separate total limit. Sign-in syncs the list across devices. No private key. No seed phrase. Public lookup alone cannot control a Mac. An optional installed and paired Mac agent adds local heartbeats, queue state and remote controls; log upload is separately opt-in. Agent 1.0.5 supports stopped-training recovery, off by default and available without Pro.

The dashboard shows official IOTA (SN9 subnet alpha) amounts plus a public-market USD estimate. USD is not a payout and is never invented as $0 when the price feed is down. The CoinGecko id is \`iota-2\` (Train at Home SN9), not \`iota\` (IOTA Layer 1).

## Product facts

- Product name: IOTA Watch
- Canonical site: ${origin}
- Audience: people already running IOTA Train at Home, or managing identifiers across supported mining and compute projects
- Data: public telemetry and entitlements from iota-web.api.macrocosmos.ai
- Yesterday’s IOTA rewards: next accounting day records attributed to the preceding date in Asia/Hong_Kong (UTC+8); pending + settled only, frozen and future timestamps excluded. This is the site display convention, not proof of actual training date or wallet receipt date. Daily email uses the same attribution.
- Lifetime rewards: official total earned; paid is not added again
- Device status: official sample, not a Mac heartbeat
- Sources have independent fetch clocks; an earnings refresh does not renew a device status clock
- Failed reads retain prior data with its original timestamp; missing fields are unknown, not zero
- Network roster coverage can be partial; network miner counts are not IOTA Watch visitor or account counts
- Historical training metrics align by epoch; training tokens are separate from reward tokens
- Zero throughput is not proof the machine is offline
- Wallet private keys and seed phrases are not accepted by IOTA Watch
- Optional downloads: independent Apple Silicon Mac scripts for local status, startup connection waiting and a login guardian with automatic recovery. Public lookups stay read-only; paired-agent controls act only on the paired Mac. See ${origin}/en/downloads for installation effects and removal instructions.

## Additional mining projects

IOTA remains the primary project. Supported project pages: ${PROJECT_IDS.map((id) => PROJECTS[id].name).join(", ")} at ${origin}/en/projects. Each tool page is for querying data; its separate guide explains inputs, field meanings and troubleshooting. These are independent tools, not official apps or wallets. Project device lists synchronize through Google sign-in. Without sign-in they stay in this browser. Each project has its own quota: 5 on Free and 50 on Pro. The cross-project device overview has no additional total limit; matching usernames do not automatically merge devices.

- Nosana: ${origin}/en/projects/nosana — official public job index; node-address task counts are not GPU counts, uptime or NOS earnings. Source: https://api.nosana.com/api/docs.
- Gonka: ${origin}/en/projects/gonka — current epoch Host participation, models and weight; membership is not live uptime and weight is not GNK earnings. Source: https://gonka.ai/docs/host/network-node-api/.
- XID / MMM: ${origin}/en/projects/xid — source: ${PROJECTS.xid.explorer} (public /api/network and /api/stats). Chain-estimated hashrate and observed-pool hashrate are separate. Visible workers are not a count of all network devices. Explorer balance is not lifetime mining income. Worker names do not establish hardware models or owner identity. Local MMM machine metrics are not collected by this website.
- fly.ai Compute: ${origin}/en/projects/flyai — source: https://flyai-mine.fly.dev/api/month. Public ETH payout addresses identify wallet-level monthly compute points and share; these are not device online status, daily earnings or withdrawable currency. Device monitoring: ${origin}/en/devices?project=flyai.
- Quantus / QTC: ${origin}/en/projects/quantus — source: the official mainnet explorer's https://sqm.quantus.com/v1/graphql index. Mining rewards use public wormhole addresses (SS58 prefix 189), 12 decimal units, and Hong Kong midnight for today. Total rewarded addresses are historical, not currently online devices. Indexer block time and successful fetch time are shown separately. Planck testnet data is not combined with mainnet QTC.
- Quantus mining reward records cover chain block rewards, not every pool-to-participant payment. A pool payment may require a separate transfer lookup in the official explorer.
- Akash: ${origin}/en/projects/akash — public provider directory, lease and capacity indicators; listed GPU capacity is not lease income.
- Golem: ${origin}/en/projects/golem — public node records and source-defined last-24-hour GLM earnings; this period is not the Hong Kong calendar day.
- io.net: ${origin}/en/projects/ionet — sign in and connect read credentials for device details and block rewards. Real-account validation is pending.
- Vast.ai: ${origin}/en/projects/vast — sign in and connect read credentials for host information and rental income. Real-account validation is pending.
- Project guides explain IOTA Miner ID versus payout address; xCoin mainnet setup, worker hashrate and reward maturity; and Quantus node synchronization, wormhole addresses and reward troubleshooting. MMM is the xCoin Mac Metal Miner application, not a currency. QTC here means Quantus mainnet, not an unrelated token or the retired PLK testnet.
- Different native currencies are not added together. Missing values remain unavailable. Unsupported prices are not invented. Wallet private keys, seed phrases and Quantus inner hashes are not inputs. Private io.net and Vast.ai lookups use encrypted read credentials tied to the account; these integrations have mocked validation, with real-account checks still pending.

## Common user questions

${productQuestions("en")
  .map((q) => `### ${q.question}\n${q.answer}`)
  .join("\n\n")}

- Compute Substrate / CSD: ${origin}/en/projects/csd — G-pools (csd.yamaduo.no) only. 40-hex addr20, optional 0x normalized. H/s is 1-hour average; Worker activity is share-based. Unpaid, confirming and cumulative paid stay separate. *_sat fields use 1e8 units per CSD. Pool windowed income is an estimate; no daily reward or USD price is invented. Guide: ${origin}/en/learn/csd-gpools-monitor-guide.
- Blocknet / BNT: ${origin}/en/projects/bnt — Argon2id mining on bntpool.com, not Bancor or BLOCK. Mainnet full payout addresses only. Pool hashrate, Workers, immature estimates, confirmed unpaid, queued payments and cumulative paid are separate. 1 BNT=100,000,000 atomic units. No verified daily income or USD quote is invented. Guide: ${origin}/en/learn/blocknet-bnt-monitor-guide.
- Midstate / MDS: ${origin}/en/projects/mds — LuckyPool public MSS payout-address records only. Rates are nonces/s. Amounts use base MDS (coinUnits=1); 1 mMDS=1,048,576 MDS and 1 gMDS=1,073,741,824 MDS. Last-24h block allocations are separate from paid transfers; unpaid includes locked and unlocked amounts. Worker activity is share-based, not a machine heartbeat. Wallet totals are not allocated to Workers, solo/other pools are not covered, and no USD quote is invented.
- Ergo / ERG: ${origin}/en/projects/erg — regular erg.2miners.com only, not SOLO and not other Ergo pools. Mainnet P2PK addresses only (0x01, 33-byte key, Blake2b-256 checksum). Pool records are not the network-wide balance. Payment and rolling 24-hour reward fields use 1e9 units per ERG. Workers are wallet labels, not extra devices. Missing values stay unknown; no USD quote or guaranteed return is invented. Address rules: https://docs.ergoplatform.com/dev/wallet/address/address_types/. API: https://github.com/2miners/apidoc/blob/master/2miners_api.json.
- Zephyr / ZEPH: ${origin}/en/projects/zeph — regular zeph.2miners.com only, not SOLO and not other Zephyr pools. Mainnet standard addresses only (prefix 0x6241d18c0, CryptoNote base58, Keccak-256 checksum). Integrated and subaddresses are not accepted. Pool data is not the network balance. RandomX payment units are 1e12 per ZEPH. Rolling 24-hour rewards are not an IOTA-style previous day. Workers are not counted as devices. Missing values stay unknown; no USD quote or guaranteed return is invented.

## Question guides

${problemLinks.map((p) => `- [${p.q.en}](${origin}/en/${p.path})`).join("\n")}

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
- Topics: ${articleProjects(article)
        .map((id) => PROJECTS[id].name)
        .join(", ")}

${LOCALES.map(
  (locale) =>
    `### ${article.title[locale]} (${LANGUAGE_TAG[locale]})\nPublished: ${articleDates(article, locale).published}\nUpdated: ${articleDates(article, locale).modified}\n\n${readableArticleBlocks(
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

## Product definitions

${LOCALES.map((locale) => `### ${LANGUAGE_TAG[locale]}\n${discoveryCopy.intro[locale]}\nHome: ${pageUrl(locale, "", origin)}`).join("\n\n")}

## Project data coverage

${PROJECT_IDS.map((id) => `### ${PROJECTS[id].name}\nContent updated: ${PROJECT_CONTENT_DATES[id]}\n${projectEditorial[id].summary.en}\n${projectEditorial[id].identity.en}\n${projectEditorial[id].coverage.en}\n${LOCALES.map((locale) => `${verificationQuestion[locale]} (${LANGUAGE_TAG[locale]}): ${projectVerification[id][locale]}`).join("\n")}\nSource: ${PROJECTS[id].guide}\nMonitor: ${origin}/en/projects/${id}`).join("\n\n")}
## Public project FAQ

${LOCALES.map((locale) => {
  const copy = content[locale];
  return `### ${copy.faqTitle} (${LANGUAGE_TAG[locale]})
- Canonical page: ${pageUrl(locale, "faq", origin)}
- Updated: ${DISCOVERY_UPDATED}

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
      `](${origin}/${/^(zh-TW|en|zh|ko|ja|images|evidence)(\/|$)/.test(path) ? path : `${locale}/${path}`})`,
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
    ...(article.decision
      ? [`## ${article.decision.title[locale]}`, article.decision.action[locale]]
      : []),
    ...(comparison
      ? [
          `## ${article.comparisonTitle?.[locale] ?? c.compare}`,
          [
            tableRow(comparison.headers),
            tableRow(comparison.headers.map(() => "---")),
            ...comparison.rows.map(tableRow),
          ].join("\n"),
        ]
      : []),
    ...article.body[locale],
    ...(article.evidence
      ? [
          "## " + evidenceLabels.heading[locale],
          article.evidence.method[locale],
          `![${article.evidence.caption[locale]}](${article.evidence.image})`,
          `${article.evidence.caption[locale]} · ${article.evidence.capturedAt}`,
          [
            tableRow(article.evidence.headers[locale]),
            tableRow(article.evidence.headers[locale].map(() => "---")),
            ...article.evidence.rows[locale].map(tableRow),
          ].join("\n"),
          article.evidence.result[locale],
          `[${evidenceLabels.excerpt[locale]}](${article.evidence.source})`,
        ]
      : []),
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
  const dates = articleDates(article, locale);
  const url = pageUrl(locale, `${section}/${article.slug}`, origin);
  return `# ${article.title[locale]}

${article.description[locale]}

- Canonical: ${url}
- Publisher: IOTA Watch
- Topics: ${articleProjects(article)
    .map((id) => PROJECTS[id].name)
    .join(", ")}
- Published: ${dates.published}
- Updated: ${dates.modified}

${readableArticleBlocks(article, locale)
  .map((block) => absoluteArticleLinks(block, locale, origin))
  .join("\n\n")}
${article.sources ? `\n## ${localizeText(locale === "zh" || locale === "zh-TW" ? "资料来源与本站实现" : "Sources and implementation", locale)}\n\n${article.sources.map((source) => `- [${source.name}](${source.url})`).join("\n")}` : ""}
`;
}
