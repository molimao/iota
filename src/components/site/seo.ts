import { localizeValue } from "@/components/site/localization";
import { ORIGIN, sitePath, LOCALES, LANGUAGE_TAG, OG_LOCALE } from "@/lib/site";
import { articles, articleDates, getArticle } from "./articles";
import { blogPosts, getBlogPost } from "./blog-posts";
import { content } from "./content";
import type { Locale } from "./locale";
import localToolsRelease from "@/lib/local-tools-release.json";
import { projectEntity } from "@/lib/projects";
import { learningCopy } from "./guide-copy";
import { projectsCopy } from "../projects-copy";

export type Page =
  | "home"
  | "guide"
  | "faq"
  | "privacy"
  | "app"
  | "learn"
  | "account"
  | "network"
  | "blog"
  | "downloads";

const OG_IMAGE = `${ORIGIN}/og.png`;
const ORG_ID = `${ORIGIN}/#organization`;
const WEBSITE_ID = `${ORIGIN}/#website`;

function jsonLd(data: unknown) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(data).replace(/</g, "\u003c"),
  };
}

function language(locale: Locale) {
  return LANGUAGE_TAG[locale];
}

function alternates(path: string) {
  return [
    ...LOCALES.map((locale) => ({
      rel: "alternate" as const,
      hrefLang: LANGUAGE_TAG[locale],
      href: ORIGIN + sitePath(locale, path),
    })),
    { rel: "alternate" as const, hrefLang: "x-default", href: ORIGIN + sitePath("en", path) },
  ];
}

function breadcrumbs(locale: Locale, items: { name: string; path: string }[]) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: ORIGIN + sitePath(locale, item.path),
    })),
  });
}

function organizationGraph() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "IOTA Watch",
    url: ORIGIN,
    logo: `${ORIGIN}/favicon.svg`,
    sameAs: ["https://github.com/molimao/iota"],
    description:
      "Independent read-only monitor for IOTA Train at Home, with separate xCoin (XID / MMM) and Quantus (QTC) monitors. Not an official app or wallet.",
  };
}

function websiteGraph() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "IOTA Watch",
    url: ORIGIN,
    inLanguage: LOCALES.map((locale) => LANGUAGE_TAG[locale]),
    publisher: { "@id": ORG_ID },
    about: [projectEntity("iota"), projectEntity("xid"), projectEntity("quantus")],
  };
}

function googleVerification() {
  const token =
    (typeof import.meta !== "undefined" &&
      (import.meta.env as { VITE_GOOGLE_SITE_VERIFICATION?: string })
        .VITE_GOOGLE_SITE_VERIFICATION) ||
    (typeof process !== "undefined"
      ? process.env["GOOGLE_SITE_VERIFICATION"] || process.env["VITE_GOOGLE_SITE_VERIFICATION"]
      : "") ||
    "";
  return token ? [{ name: "google-site-verification", content: token }] : [];
}

export function seo(locale: Locale, page: Page, slug?: string) {
  const copy = content[locale];
  const en = locale !== "zh" && locale !== "zh-TW";
  const article = slug ? (page === "blog" ? getBlogPost(slug) : getArticle(slug)) : undefined;
  const path =
    (page === "learn" || page === "blog") && slug ? `${page}/${slug}` : page === "home" ? "" : page;
  const url = ORIGIN + sitePath(locale, path);
  const home = "IOTA Watch";

  const title = article
    ? `${article.title[locale]} | IOTA Watch`
    : page === "downloads"
      ? localizeValue(
          en
            ? "IOTA Train at Home Mac tools: status and startup | IOTA Watch"
            : "IOTA Mac 工具下载：状态查看与优化启动｜IOTA Watch",
          locale,
        )
      : page === "blog"
        ? localizeValue(
            en
              ? "IOTA Train at Home monitoring blog | IOTA Watch"
              : "IOTA Train at Home 监控博客｜IOTA Watch",
            locale,
          )
        : page === "home"
          ? localizeValue(
              en
                ? "IOTA Train at Home Device Monitor | IOTA Watch"
                : "IOTA Train at Home 设备监控｜IOTA Watch",
              locale,
            )
          : page === "guide"
            ? `${copy.guideTitle} | IOTA Watch`
            : page === "faq"
              ? `${copy.faqTitle}: IOTA / XID / Quantus / fly.ai | IOTA Watch`
              : page === "privacy"
                ? `${copy.privacyTitle} | IOTA Watch`
                : page === "learn"
                  ? `${learningCopy[locale].title}: IOTA / XID / Quantus | IOTA Watch`
                  : page === "account"
                    ? localizeValue(en ? "Account | IOTA Watch" : "账号｜IOTA Watch", locale)
                    : page === "network"
                      ? localizeValue(
                          en
                            ? "IOTA Train at Home network status | IOTA Watch"
                            : "全网训练现况｜IOTA Watch",
                          locale,
                        )
                      : localizeValue(
                          en ? "My devices | IOTA Watch" : "我的设备｜IOTA Watch",
                          locale,
                        );

  const description = article
    ? article.description[locale]
    : page === "downloads"
      ? localizeValue(
          en
            ? "Download open-source local scripts for IOTA Train at Home on Apple Silicon Mac: startup relay, status viewer and background guardian, with installation and removal instructions."
            : "下载适用于 Apple Silicon Mac 的 IOTA Train at Home 开源本地脚本：优化启动、状态查看和异常守护，附安装与卸载说明。",
          locale,
        )
      : page === "blog"
        ? localizeValue(
            en
              ? "Practical IOTA Train at Home articles on multi-device monitoring, zero rewards and waiting for tasks, with official sources and clear data checks."
              : "IOTA Train at Home 多设备监控、收益为零与等待任务的实用文章，结合官方资料与清晰的数据排查步骤。",
            locale,
          )
        : page === "home"
          ? localizeValue(
              en
                ? "Monitor IOTA Train at Home devices with a public Miner ID. See reported status, today’s rewards and lifetime rewards in IOTA and USD. Not the IOTA Layer 1 wallet."
                : "用公开 Miner ID 监控 IOTA Train at Home 设备：查看上报状态、今日和累计收益（IOTA 与美元估价）。独立工具，不是 IOTA 公链钱包。",
              locale,
            )
          : page === "guide"
            ? copy.guideIntro
            : page === "faq"
              ? copy.faqIntro
              : page === "privacy"
                ? copy.privacyIntro
                : page === "learn"
                  ? learningCopy[locale].intro
                  : page === "account"
                    ? localizeValue(
                        en
                          ? "Manage your IOTA Watch Google account, device list limit, and sign-out."
                          : "管理 IOTA Watch 的 Google 账号、设备额度与退出登录。",
                        locale,
                      )
                    : page === "network"
                      ? localizeValue(
                          en
                            ? "Live view of IOTA Train at Home runs: open slots, miners online, miners training, progress and loss, by tier."
                            : "IOTA Train at Home 全网训练任务：剩余名额、在线矿工、实际训练数量、各任务进度与损失，按档位分列。",
                          locale,
                        )
                      : localizeValue(
                          en
                            ? "Track reported training activity and rewards for your saved devices."
                            : "查看已保存设备的训练状态与收益。",
                          locale,
                        );

  const keywords = article?.keywords
    ? article.keywords[locale].join(", ")
    : page === "learn" && !article
      ? "IOTA Train at Home, xCoin XID, MMM Mac Metal Miner, Quantus QTC, project guides"
      : article
        ? localizeValue(
            en
              ? `${article.title[locale]}, IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, SN9, not IOTA cryptocurrency`
              : `${article.title[locale]}, IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, SN9, 不是IOTA公链`,
            locale,
          )
        : localizeValue(
            en
              ? "IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, SN9, device monitor, not IOTA cryptocurrency, Firefly"
              : "IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, SN9, 设备监控, 不是IOTA公链, Firefly",
            locale,
          );

  const scripts = [];
  if (page !== "app" && page !== "account") {
    scripts.push(
      jsonLd({ "@context": "https://schema.org", "@graph": [organizationGraph(), websiteGraph()] }),
    );
  }
  scripts.push(
    breadcrumbs(
      locale,
      page === "home"
        ? [{ name: home, path: "" }]
        : (page === "learn" || page === "blog") && article
          ? [
              { name: home, path: "" },
              ...(article.project === "xid" || article.project === "quantus"
                ? [
                    { name: projectsCopy[locale].projects, path: "projects" },
                    {
                      name: article.project === "xid" ? "XID / MMM" : "Quantus / QTC",
                      path: `projects/${article.project}`,
                    },
                  ]
                : [
                    {
                      name:
                        page === "blog"
                          ? localizeValue(en ? "Blog" : "博客", locale)
                          : localizeValue(en ? "Help" : "使用说明", locale),
                      path: page,
                    },
                  ]),
              { name: article.title[locale], path: `${page}/${article.slug}` },
            ]
          : [
              { name: home, path: "" },
              {
                name:
                  page === "downloads"
                    ? localizeValue(en ? "Downloads" : "工具下载", locale)
                    : page === "blog"
                      ? localizeValue(en ? "Blog" : "博客", locale)
                      : page === "guide"
                        ? copy.guideTitle
                        : page === "faq"
                          ? copy.faqTitle
                          : page === "privacy"
                            ? copy.privacyTitle
                            : page === "learn"
                              ? localizeValue(en ? "Help" : "使用说明", locale)
                              : page === "account"
                                ? localizeValue(en ? "Account" : "账号", locale)
                                : page === "network"
                                  ? localizeValue(en ? "Network" : "全网", locale)
                                  : localizeValue(en ? "Dashboard" : "监控", locale),
                path,
              },
            ],
    ),
  );

  if (page === "home") {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "IOTA Watch",
        url,
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web browser",
        inLanguage: language(locale),
        isAccessibleForFree: true,
        image: OG_IMAGE,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": ORG_ID },
        sameAs: ["https://github.com/molimao/iota"],
        about: [projectEntity("iota"), projectEntity("xid"), projectEntity("quantus")],
        license: "https://github.com/molimao/iota/blob/main/LICENSE",
      }),
    );
  }

  if (page === "faq") {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        url,
        dateModified: "2026-10-03",
        inLanguage: language(locale),
        mainEntity: copy.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      }),
    );
  }

  if (page === "downloads") {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "IOTA Local Tools",
        description,
        url,
        downloadUrl: `${ORIGIN}/downloads/${localToolsRelease.filename}`,
        softwareVersion: localToolsRelease.version,
        operatingSystem: "macOS (Apple Silicon), Python 3.9+",
        applicationCategory: "UtilitiesApplication",
        license: "https://github.com/molimao/iota/blob/main/LICENSE",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }),
    );
  }

  if (page === "guide") {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: copy.guideTitle,
        description: copy.guideIntro,
        inLanguage: language(locale),
        step: copy.steps.map(([name, text], index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name,
          text,
        })),
      }),
    );
  }

  if ((page === "learn" || page === "blog") && !article) {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": page === "blog" ? "Blog" : "CollectionPage",
        name: title,
        description,
        url,
        inLanguage: language(locale),
        isPartOf: { "@id": WEBSITE_ID },
        hasPart: (page === "blog" ? blogPosts : articles).map((item) => ({
          "@type": page === "blog" ? "BlogPosting" : "Article",
          name: item.title[locale],
          url: ORIGIN + sitePath(locale, `${page}/${item.slug}`),
        })),
      }),
    );
  }

  if (article) {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": page === "blog" ? "BlogPosting" : "Article",
        headline: article.title[locale],
        url,
        ...(article.summary ? { abstract: article.summary[locale] } : {}),
        keywords,
        description: article.description[locale],
        datePublished: articleDates(article).published,
        dateModified: articleDates(article).modified,
        ...(article.sources ? { citation: article.sources.map((source) => source.url) } : {}),
        image: OG_IMAGE,
        inLanguage: language(locale),
        mainEntityOfPage: url,
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": WEBSITE_ID },
        about:
          article.project === "all"
            ? ["iota", "xid", "quantus"].map((p) => projectEntity(p as "iota" | "xid" | "quantus"))
            : projectEntity(article.project ?? "iota"),
      }),
    );
  }

  if (article?.questions) {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#questions`,
        inLanguage: language(locale),
        mainEntity: article.questions[locale].map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      }),
    );
  }

  if (article?.slug === "find-miner-id") {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: "Miner ID",
        alternateName: ["SS58 hotkey", "Train at Home miner address"],
        description: localizeValue(
          en
            ? "Public SS58 hotkey that identifies an IOTA Train at Home device. Not a private key, seed phrase, or coldkey."
            : "标识 IOTA Train at Home 设备的公开 SS58 hotkey。不是私钥、助记词或 coldkey。",
          locale,
        ),
        inDefinedTermSet: "IOTA Train at Home",
        url,
      }),
      jsonLd({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: article.title[locale],
        description: article.description[locale],
        inLanguage: language(locale),
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: localizeValue(en ? "Open Train at Home" : "打开 Train at Home", locale),
            text: localizeValue(
              en
                ? "Launch the official app and wait until it shows Connected."
                : "打开官方应用，待状态显示 Connected。",
              locale,
            ),
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: localizeValue(en ? "Open Miner" : "打开 Miner", locale),
            text: localizeValue(
              en
                ? "Select Miner in the top left and copy the complete public Miner ID."
                : "选择左上角 Miner，复制完整的公开 Miner ID。",
              locale,
            ),
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: localizeValue(en ? "Add it to IOTA Watch" : "添加到 IOTA Watch", locale),
            text: localizeValue(
              en
                ? "Paste the SS58 hotkey on the dashboard and give the device a name."
                : "在监控页粘贴该 SS58 hotkey，并填写设备名称。",
              locale,
            ),
          },
        ],
      }),
    );
  }

  if (article?.slug === "what-is-sn9-iota") {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: "SN9",
        alternateName: ["IOTA Train at Home token", "subnet 9 alpha", "iota-2"],
        description: localizeValue(
          en
            ? "Bittensor subnet 9 alpha token used by IOTA Train at Home. Not TAO and not IOTA Layer 1."
            : "Bittensor 子网 9 的 IOTA Train at Home alpha 代币。不是 TAO，也不是 IOTA 公链币。",
          locale,
        ),
        inDefinedTermSet: "IOTA Train at Home",
        url,
      }),
    );
  }

  if (article?.slug === "what-refresh-interrupted-means") {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: localizeValue(en ? "Refresh interrupted" : "刷新中断", locale),
        description: localizeValue(
          en
            ? "IOTA Watch could not finish a successful official data read for more than five minutes. Not proof the Mac is offline."
            : "IOTA Watch 超过 5 分钟没能成功读完官方数据。不证明 Mac 已经掉线。",
          locale,
        ),
        inDefinedTermSet: "IOTA Watch",
        url,
      }),
    );
  }

  const robots =
    page === "app" || page === "account"
      ? "noindex,follow"
      : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  return {
    scripts,
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
      { name: "keywords", content: keywords },
      { name: "theme-color", content: "#111111" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: article ? "article" : "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      {
        property: "og:image:alt",
        content: article?.project
          ? article.title[locale]
          : "IOTA Watch — IOTA Train at Home device monitor",
      },
      { property: "og:locale", content: OG_LOCALE[locale] },
      ...LOCALES.filter((item) => item !== locale).map((item) => ({
        property: "og:locale:alternate",
        content: OG_LOCALE[item],
      })),
      { property: "og:site_name", content: "IOTA Watch" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      ...(article
        ? [
            { property: "article:published_time", content: articleDates(article).published },
            { property: "article:modified_time", content: articleDates(article).modified },
          ]
        : []),
      ...googleVerification(),
    ],
    links: [{ rel: "canonical", href: url }, ...alternates(path)],
  };
}
