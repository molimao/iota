import { ORIGIN, sitePath } from "@/lib/site";
import { articles, getArticle } from "./articles";
import { content } from "./content";
import type { Locale } from "./locale";

export type Page = "home" | "guide" | "faq" | "privacy" | "app" | "learn";

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

export function seo(locale: Locale, page: Page, slug?: string) {
  const copy = content[locale];
  const en = locale === "en";
  const article = slug ? getArticle(slug) : undefined;
  const path = page === "learn" && slug ? `learn/${slug}` : page === "home" ? "" : page;
  const home = en ? "IOTA Watch" : "IOTA Watch";

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
                ? "Learn IOTA Train at Home monitoring | IOTA Watch"
                : "看懂 IOTA Train at Home 监控｜IOTA Watch"
              : en
                ? "My devices | IOTA Watch"
                : "我的设备｜IOTA Watch";

  const description = article
    ? article.description[locale]
    : page === "home"
      ? en
        ? "Monitor IOTA Train at Home devices with a public Miner ID. See reported status, today’s rewards and lifetime rewards. Not the IOTA Layer 1 wallet."
        : "用公开 Miner ID 监控 IOTA Train at Home 设备：查看上报状态、今日收益和累计收益。独立工具，不是 IOTA 公链钱包。"
      : page === "guide"
        ? copy.guideIntro
        : page === "faq"
          ? copy.faqIntro
          : page === "privacy"
            ? copy.privacyIntro
            : page === "learn"
              ? en
                ? "Clear answers for IOTA Train at Home: what IOTA Watch is, how to find a Miner ID, how rewards are counted, and what device statuses mean."
                : "把 IOTA Train at Home 的常见问题写清楚：IOTA Watch 是什么、Miner ID 怎么找、收益怎么算、设备状态是什么意思。"
              : en
                ? "Track reported training activity and rewards for your saved devices."
                : "查看已保存设备的训练状态与收益。";

  const scripts = [];
  scripts.push(
    breadcrumbs(
      locale,
      page === "home"
        ? [{ name: home, path: "" }]
        : page === "learn" && article
          ? [
              { name: home, path: "" },
              { name: en ? "Learn" : "说明", path: "learn" },
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
                            ? "Learn"
                            : "说明"
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
        url: ORIGIN + sitePath(locale),
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web browser",
        inLanguage: language(locale),
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
        url: ORIGIN + sitePath(locale, "learn"),
        inLanguage: language(locale),
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
        dateModified: "2026-09-12",
        inLanguage: language(locale),
        mainEntityOfPage: ORIGIN + sitePath(locale, `learn/${article.slug}`),
        author: { "@type": "Organization", name: "IOTA Watch" },
        publisher: { "@type": "Organization", name: "IOTA Watch", url: ORIGIN },
        about: "IOTA Train at Home / Macrocosmos. Not IOTA Layer 1.",
      }),
    );
  }

  return {
    scripts,
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "robots",
        content: page === "app" ? "noindex,follow" : "index,follow",
      },
      {
        name: "keywords",
        content: en
          ? "IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, device monitor, not IOTA cryptocurrency"
          : "IOTA Train at Home, IOTA Watch, Macrocosmos, Miner ID, 设备监控, 不是IOTA公链",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: article ? "article" : "website" },
      { property: "og:url", content: ORIGIN + sitePath(locale, path) },
      { property: "og:locale", content: en ? "en_US" : "zh_CN" },
      { property: "og:locale:alternate", content: en ? "zh_CN" : "en_US" },
      { property: "og:site_name", content: "IOTA Watch" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: ORIGIN + sitePath(locale, path) }, ...alternates(path)],
  };
}
