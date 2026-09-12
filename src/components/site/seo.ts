import { LASTMOD } from "@/lib/crawl";
import { ORIGIN, sitePath } from "@/lib/site";
import { articles, getArticle } from "./articles";
import { content } from "./content";
import type { Locale } from "./locale";

export type Page = "home" | "guide" | "faq" | "privacy" | "app" | "learn" | "account" | "network";

const OG_IMAGE = `${ORIGIN}/og.svg`;
const ORG_ID = `${ORIGIN}/#organization`;
const WEBSITE_ID = `${ORIGIN}/#website`;

function jsonLd(data: unknown) {
  return { type: "application/ld+json" as const, children: JSON.stringify(data) };
}

function language(locale: Locale) {
  return locale === "en" ? "en" : "zh-CN";
}

function alternates(path: string) {
  return [
    ...(["en", "zh"] as const).map((locale) => ({
      rel: "alternate" as const,
      hrefLang: locale === "zh" ? "zh-CN" : "en",
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
      "Independent read-only monitor for IOTA Train at Home devices. Not the IOTA Foundation Layer 1 cryptocurrency.",
  };
}

function websiteGraph() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "IOTA Watch",
    url: ORIGIN,
    inLanguage: ["zh-CN", "en"],
    publisher: { "@id": ORG_ID },
    about: "IOTA Train at Home / Macrocosmos device and reward monitoring.",
  };
}

function googleVerification() {
  const token =
    (typeof import.meta !== "undefined" &&
      (import.meta.env as { VITE_GOOGLE_SITE_VERIFICATION?: string }).VITE_GOOGLE_SITE_VERIFICATION) ||
    (typeof process !== "undefined"
      ? process.env["GOOGLE_SITE_VERIFICATION"] || process.env["VITE_GOOGLE_SITE_VERIFICATION"]
      : "") ||
    "";
  return token ? [{ name: "google-site-verification", content: token }] : [];
}

export function seo(locale: Locale, page: Page, slug?: string) {
  const copy = content[locale];
  const en = locale === "en";
  const article = slug ? getArticle(slug) : undefined;
  const path = page === "learn" && slug ? `learn/${slug}` : page === "home" ? "" : page;
  const url = ORIGIN + sitePath(locale, path);
  const home = "IOTA Watch";

  const title = article
    ? `${article.title[locale]} | IOTA Watch`
    : page === "home"
      ? en
        ? "IOTA Train at Home Device Monitor | IOTA Watch"
        : "IOTA Train at Home 设备监控｜IOTA Watch"
      : page === "guide"
        ? `${copy.guideTitle} | IOTA Watch`
        : page === "faq"
          ? `${copy.faqTitle} | IOTA Watch`
          : page === "privacy"
            ? `${copy.privacyTitle} | IOTA Watch`
            : page === "learn"
              ? en
                ? "How to use IOTA Watch"
                : "使用说明｜IOTA Watch"
              : page === "account"
                ? en
                  ? "Account | IOTA Watch"
                  : "账号｜IOTA Watch"
                : page === "network"
                  ? en
                    ? "IOTA Train at Home network status | IOTA Watch"
                    : "全网训练现况｜IOTA Watch"
                  : en
                    ? "My devices | IOTA Watch"
                    : "我的设备｜IOTA Watch";

  const description = article
    ? article.description[locale]
    : page === "home"
      ? en
        ? "Monitor IOTA Train at Home devices with a public Miner ID. See reported status, today’s rewards and lifetime rewards in IOTA and USD. Not the IOTA Layer 1 wallet."
        : "用公开 Miner ID 监控 IOTA Train at Home 设备：查看上报状态、今日和累计收益（IOTA 与美元估价）。独立工具，不是 IOTA 公链钱包。"
      : page === "guide"
        ? copy.guideIntro
        : page === "faq"
          ? copy.faqIntro
          : page === "privacy"
            ? copy.privacyIntro
            : page === "learn"
              ? en
                ? "Find your Miner ID, read device status and rewards, and keep the same list after you sign in."
                : "Miner ID 怎么找、状态和收益怎么看、登录后设备清单怎么跟着走。"
              : page === "account"
                ? en
                  ? "Manage your IOTA Watch Google account, device list limit, and sign-out."
                  : "管理 IOTA Watch 的 Google 账号、设备额度与退出登录。"
                : page === "network"
                  ? en
                    ? "Live view of every IOTA Train at Home run: open slots, miners online, miners actually training, progress and loss per run, by tier."
                    : "IOTA Train at Home 全网训练任务实况：剩余名额、在线矿工、实际在训练的机器、各任务进度与损失，按档位分列。"
                  : en
                    ? "Track reported training activity and rewards for your saved devices."
                    : "查看已保存设备的训练状态与收益。";

  const keywords = article
    ? en
      ? `${article.title.en}, IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, SN9, not IOTA cryptocurrency`
      : `${article.title.zh}, IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, SN9, 不是IOTA公链`
    : en
      ? "IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, SN9, device monitor, not IOTA cryptocurrency, Firefly"
      : "IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, SN9, 设备监控, 不是IOTA公链, Firefly";

  const scripts = [];
  if (page !== "app" && page !== "account") {
    scripts.push(jsonLd({ "@context": "https://schema.org", "@graph": [organizationGraph(), websiteGraph()] }));
  }
  scripts.push(
    breadcrumbs(
      locale,
      page === "home"
        ? [{ name: home, path: "" }]
        : page === "learn" && article
          ? [
              { name: home, path: "" },
              { name: en ? "Help" : "使用说明", path: "learn" },
              { name: article.title[locale], path: `learn/${article.slug}` },
            ]
          : [
              { name: home, path: "" },
              {
                name:
                  page === "guide"
                    ? copy.guideTitle
                    : page === "faq"
                      ? copy.faqTitle
                      : page === "privacy"
                        ? copy.privacyTitle
                        : page === "learn"
                          ? en
                            ? "Help"
                            : "使用说明"
                          : page === "account"
                            ? en
                              ? "Account"
                              : "账号"
                            : page === "network"
                              ? en
                                ? "Network"
                                : "全网"
                              : en
                                ? "Dashboard"
                                : "监控",
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
        about: "IOTA Train at Home device and reward monitoring. Not the IOTA Layer 1 cryptocurrency.",
      }),
    );
  }

  if (page === "faq") {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: language(locale),
        mainEntity: copy.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
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

  if (page === "learn" && !article) {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: title,
        description,
        url,
        inLanguage: language(locale),
        isPartOf: { "@id": WEBSITE_ID },
        hasPart: articles.map((item) => ({
          "@type": "Article",
          name: item.title[locale],
          url: ORIGIN + sitePath(locale, `learn/${item.slug}`),
        })),
      }),
    );
  }

  if (article) {
    scripts.push(
      jsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title[locale],
        description: article.description[locale],
        datePublished: LASTMOD,
        dateModified: LASTMOD,
        image: OG_IMAGE,
        inLanguage: language(locale),
        mainEntityOfPage: url,
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": WEBSITE_ID },
        about: "IOTA Train at Home / Macrocosmos. Not IOTA Layer 1.",
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
        description: en
          ? "Public SS58 hotkey that identifies an IOTA Train at Home device. Not a private key, seed phrase, or coldkey."
          : "标识 IOTA Train at Home 设备的公开 SS58 hotkey。不是私钥、助记词或 coldkey。",
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
            name: en ? "Open Train at Home" : "打开 Train at Home",
            text: en
              ? "Launch the official app and wait until it shows Connected."
              : "打开官方应用，等到状态显示 Connected。",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: en ? "Open Miner" : "打开 Miner",
            text: en
              ? "Select Miner in the top left and copy the complete public Miner ID."
              : "点左上角 Miner，复制完整的公开 Miner ID。",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: en ? "Add it to IOTA Watch" : "加到 IOTA Watch",
            text: en
              ? "Paste the SS58 hotkey on the dashboard and give the device a name."
              : "在监控页粘贴这段 SS58 hotkey，并起一个认得的名字。",
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
        description: en
          ? "Bittensor subnet 9 alpha token used by IOTA Train at Home. Not TAO and not IOTA Layer 1."
          : "Bittensor 子网 9 的 IOTA Train at Home alpha 代币。不是 TAO，也不是 IOTA 公链币。",
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
        name: en ? "Refresh interrupted" : "刷新中断",
        description: en
          ? "IOTA Watch could not finish a successful official data read for more than five minutes. Not proof the Mac is offline."
          : "IOTA Watch 超过 5 分钟没能成功读完官方数据。不证明 Mac 已经掉线。",
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
      { property: "og:image:alt", content: "IOTA Watch — IOTA Train at Home device monitor" },
      { property: "og:locale", content: en ? "en_US" : "zh_CN" },
      { property: "og:locale:alternate", content: en ? "zh_CN" : "en_US" },
      { property: "og:site_name", content: "IOTA Watch" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
      ...googleVerification(),
    ],
    links: [{ rel: "canonical", href: url }, ...alternates(path)],
  };
}
