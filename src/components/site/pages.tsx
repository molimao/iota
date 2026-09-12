import { ArrowUpRight, Monitor, Layers, ArrowRight, Check } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { content } from "./content";
import { useLocale, type Locale } from "./locale";
const ORIGIN = "https://iota-my-watch.lovable.app";
export type Page = "home" | "guide" | "faq" | "privacy" | "app";
export function seo(locale: Locale, page: Page) {
  const c = content[locale],
    en = locale === "en";
  const title =
    page === "home"
      ? en
        ? "IOTA Watch — Train at Home Device & Reward Monitor"
        : "IOTA Watch — Train at Home 多设备与收益监控"
      : page === "guide"
        ? c.guideTitle
        : page === "faq"
          ? c.faqTitle
          : page === "privacy"
            ? c.privacyTitle
            : en
              ? "My devices — IOTA Watch"
              : "我的设备 — IOTA Watch";
  const description =
    page === "home"
      ? c.intro
      : page === "guide"
        ? c.guideIntro
        : page === "faq"
          ? c.faqIntro
          : page === "privacy"
            ? c.privacyIntro
            : en
              ? "Track reported training activity and rewards for your saved devices."
              : "查看已保存设备的训练状态与收益。";
  const path = (l: string) => `/${l}${page === "home" ? "" : "/" + page}`;
  return {
    scripts:
      page === "home"
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "IOTA Watch",
                url: ORIGIN + path(locale),
                description,
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web browser",
                inLanguage: en ? "en" : "zh-CN",
              }),
            },
          ]
        : [],
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: page === "app" ? "noindex,follow" : "index,follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: ORIGIN + path(locale) },
      { property: "og:locale", content: en ? "en_US" : "zh_CN" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: ORIGIN + path(locale) },
      ...["en", "zh"].map((l) => ({
        rel: "alternate",
        hrefLang: l === "zh" ? "zh-CN" : "en",
        href: ORIGIN + path(l),
      })),
      { rel: "alternate", hrefLang: "x-default", href: ORIGIN + path("en") },
    ],
  };
}
export function SiteNav() {
  const { locale, en } = useLocale(),
    c = content[locale];
  const path = useRouterState({ select: (s) => s.location.pathname });
  const other = path.replace(/^\/(en|zh)/, en ? "/zh" : "/en");
  return (
    <nav className="site-nav" aria-label={en ? "Main navigation" : "主导航"}>
      <a className="site-brand" href={`/${locale}`}>
        <span>
          <Layers size={20} />
        </span>
        IOTA <b>Watch</b>
      </a>
      <div className="site-links">
        <a href={`/${locale}/guide`}>{c.nav[0]}</a>
        <a href={`/${locale}/faq`}>{c.nav[1]}</a>
        <a href={other} hrefLang={en ? "zh-CN" : "en"} lang={en ? "zh-CN" : "en"}>
          {en ? "中文" : "English"}
        </a>
        <a className="site-button small" href={`/${locale}/app`}>
          {c.nav[3]}
          <ArrowUpRight size={16} />
        </a>
      </div>
    </nav>
  );
}
export function SiteFooter() {
  const { locale, en } = useLocale(),
    c = content[locale];
  return (
    <footer className="site-footer">
      <div>
        <b>IOTA Watch</b>
        <p>{c.independent}</p>
      </div>
      <div>
        <a href={`/${locale}/guide`}>{c.nav[0]}</a>
        <a href={`/${locale}/faq`}>{c.nav[1]}</a>
        <a href={`/${locale}/privacy`}>{c.nav[2]}</a>
        <a href="https://github.com/molimao/iota">GitHub</a>
      </div>
      <small>{en ? "Made for people training at home." : "为在家参与训练的人而做。"}</small>
    </footer>
  );
}
export function Landing() {
  const { locale } = useLocale(),
    c = content[locale];
  return (
    <>
      <section className="site-hero">
        <div className="hero-copy">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p>{c.intro}</p>
          <div className="hero-actions">
            <a className="site-button" href={`/${locale}/app`}>
              {c.cta}
              <ArrowUpRight size={20} />
            </a>
            <a className="text-link" href={`/${locale}/guide`}>
              {c.secondary}
              <ArrowRight size={17} />
            </a>
          </div>
          <ul className="trust-notes">
            {c.notes.map((n) => (
              <li key={n}>
                <Check size={15} />
                {n}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero-preview">
          <div className="preview-label">{c.preview}</div>
          <div className="preview-paper">
            <div className="preview-heading">
              <span className="mini-icon">
                <Layers size={19} />
              </span>
              <b>{c.previewTitle}</b>
            </div>
            <div className="preview-totals">
              <div>
                <span>{locale === "en" ? "Today’s rewards" : "今日总收益"}</span>
                <b>
                  — <small>IOTA</small>
                </b>
              </div>
              <div>
                <span>{locale === "en" ? "Lifetime rewards" : "累计总收益"}</span>
                <b>
                  — <small>IOTA</small>
                </b>
              </div>
            </div>
            {c.previewNames.map((name, i) => (
              <div className="preview-row" key={name}>
                <Monitor size={20} />
                <b>{name}</b>
                <span className={"preview-state state-" + i}>{c.statuses[i]}</span>
              </div>
            ))}
          </div>
          <div className="preview-caption">
            <span>01 — 02 — 03</span>
            <span>
              {locale === "en" ? "ONE WATCHLIST. ALL YOUR DEVICES." : "一个清单，看见所有设备。"}
            </span>
          </div>
        </div>
      </section>
      <section className="feature-section">
        <div className="section-intro">
          <span className="eyebrow">{locale === "en" ? "CLARITY, BUILT IN" : "让信息更清楚"}</span>
          <h2>{c.section}</h2>
        </div>
        <div className="feature-grid">
          {c.features.map(([n, title, body]) => (
            <article key={n}>
              <span className="feature-num">{n}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="steps-section">
        <h2>{c.stepsTitle}</h2>
        <div className="steps-grid">
          {c.steps.map(([title, body], i) => (
            <article key={title}>
              <span>{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="site-cta">
        <div>
          <h2>{c.bottomTitle}</h2>
          <p>{c.bottom}</p>
        </div>
        <a className="site-button" href={`/${locale}/app`}>
          {c.cta}
          <ArrowUpRight size={20} />
        </a>
      </section>
    </>
  );
}
export function ArticlePage({ page }: { page: "guide" | "faq" | "privacy" }) {
  const { locale, en } = useLocale(),
    c = content[locale];
  const title = page === "guide" ? c.guideTitle : page === "faq" ? c.faqTitle : c.privacyTitle;
  const intro = page === "guide" ? c.guideIntro : page === "faq" ? c.faqIntro : c.privacyIntro;
  const rows = page === "guide" ? c.steps : page === "faq" ? c.faq : c.privacy;
  return (
    <article className="article-page">
      <a className="back-link" href={`/${locale}`}>
        ← {en ? "Home" : "首页"}
      </a>
      <span className="eyebrow">IOTA WATCH / {page.toUpperCase()}</span>
      <h1>{title}</h1>
      <p className="article-lead">{intro}</p>
      <div className="article-sections">
        {rows.map(([heading, body], i) => (
          <section key={heading}>
            <span className="article-number">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2>{heading}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
      </div>
      {page === "guide" && (
        <aside className="article-tip">
          <h2>{en ? "What you should know before starting" : "开始之前，了解这几点"}</h2>
          <p>
            {en
              ? "You need an existing Train at Home device and its public Miner ID. This dashboard cannot run training for you, promise rewards, or read your local logs."
              : "你需要已经运行 Train at Home 的设备及其公开 Miner ID。监控页不会替你启动训练，不承诺收益，也不能读取本机日志。"}
          </p>
          <a href={`/${locale}/faq`}>{en ? "Read the data guide" : "了解数据口径"} →</a>
        </aside>
      )}
      <p className="article-updated">{c.updated}</p>
      <a className="site-button" href={`/${locale}/app`}>
        {c.cta}
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}
