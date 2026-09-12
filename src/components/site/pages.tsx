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
  const { locale, en } = useLocale(),
    c = content[locale];
  return (
    <div className="landing-v2">
      <section className="opening">
        <div className="opening-label">
          <span />
          IOTA TRAIN AT HOME <span className="label-divider">/</span>{" "}
          {en ? "DEVICE MONITOR" : "设备监控"}
        </div>
        <h1>
          {en ? (
            <>
              Your training,
              <br />
              <em>in plain sight.</em>
            </>
          ) : (
            <>
              训练状态与收益，
              <br />
              <em>打开就看清。</em>
            </>
          )}
        </h1>
        <p>
          {en
            ? "See which devices are contributing and what they have earned. A single dashboard for your IOTA Train at Home setup."
            : "哪些设备在参与训练，今天记了多少收益。把你的 IOTA Train at Home 设备放在一个面板里查看。"}
        </p>
        <div className="opening-actions">
          <a className="site-button" href={`/${locale}/app`}>
            {en ? "Open my dashboard" : "打开我的监控"}
            <ArrowUpRight size={19} />
          </a>
          <a className="text-link" href={`/${locale}/guide`}>
            {en ? "Find your Miner ID" : "如何找到 Miner ID"}
            <ArrowRight size={16} />
          </a>
        </div>
        <span className="opening-note">
          {en
            ? "Connect with a public Miner ID. No wallet connection needed."
            : "添加公开 Miner ID 即可，无需连接钱包。"}
        </span>
      </section>
      <section
        className="product-stage"
        aria-label={en ? "Dashboard illustration" : "监控面板示意"}
      >
        <div className="stage-top">
          <span className="stage-wordmark">
            <Layers size={18} /> IOTA Watch
          </span>
          <span className="stage-demo">
            {en ? "PRODUCT PREVIEW · ILLUSTRATIVE DATA" : "产品预览 · 数据仅作示意"}
          </span>
        </div>
        <div className="stage-body">
          <aside className="stage-sidebar">
            <span className="sidebar-label">{en ? "WORKSPACE" : "工作区"}</span>
            <b>
              <Monitor size={17} />
              {en ? "My devices" : "我的设备"}
            </b>
            <span>{en ? "Training activity" : "训练活动"}</span>
            <span>{en ? "Reward records" : "收益记录"}</span>
            <div className="sidebar-bottom">
              {en ? "Public telemetry. Your personal overview." : "公开数据，你的设备全貌。"}
            </div>
          </aside>
          <div className="stage-main">
            <div className="stage-title">
              <div>
                <span className="eyebrow">{en ? "YOUR OVERVIEW" : "设备总览"}</span>
                <h2>{en ? "A little more clarity." : "运行情况，一目了然。"}</h2>
              </div>
              <span className="stage-readonly">{en ? "Read-only" : "只读监控"}</span>
            </div>
            <div className="stage-metrics">
              <div>
                <span>{en ? "Today’s accounted rewards" : "今日记账收益"}</span>
                <strong>
                  — <small>IOTA</small>
                </strong>
                <p>{en ? "Across your saved devices" : "汇总已添加设备"}</p>
              </div>
              <div>
                <span>{en ? "Lifetime rewards" : "累计记账收益"}</span>
                <strong>
                  — <small>IOTA</small>
                </strong>
                <p>{en ? "Per-device records included" : "可以查看单台设备记录"}</p>
              </div>
            </div>
            <div className="stage-table">
              <div className="stage-table-head">
                <span>{en ? "DEVICE" : "设备"}</span>
                <span>{en ? "REPORTED STATUS" : "上报状态"}</span>
                <span>{en ? "REWARDS" : "收益"}</span>
              </div>
              {c.previewNames.map((name, i) => (
                <div className="stage-device" key={name}>
                  <span>
                    <i>
                      <Monitor size={18} />
                    </i>
                    <b>{name}</b>
                  </span>
                  <span className={"stage-status s" + i}>{c.statuses[i]}</span>
                  <span>
                    — <small>IOTA</small>
                  </span>
                </div>
              ))}
            </div>
            <p className="stage-footnote">
              {en
                ? "Your actual data appears after adding a Miner ID."
                : "添加 Miner ID 后，这里会显示你的真实设备数据。"}
            </p>
          </div>
        </div>
      </section>
      <section className="purpose-section">
        <div>
          <span className="eyebrow">
            {en ? "LESS CHECKING. MORE UNDERSTANDING." : "把数据，变成看得懂的信息。"}
          </span>
          <h2>
            {en ? (
              <>
                Keep an eye on
                <br />
                what matters.
              </>
            ) : (
              <>关注真正重要的事。</>
            )}
          </h2>
          <p>
            {en
              ? "Built for checking your own training setup, without jumping between devices."
              : "不用来回切换每台机器，先在这里看清设备全貌。"}
          </p>
        </div>
        <div className="purpose-list">
          {[
            [
              en ? "Is it contributing?" : "设备在参与训练吗？",
              en
                ? "Reported activity, throughput and activations help you see what each device is doing."
                : "结合上报状态、吞吐量和激活处理量，了解每台设备在做什么。",
            ],
            [
              en ? "What has it earned?" : "收益记上了吗？",
              en
                ? "Daily and lifetime rewards, together and per device. Missing records stay clearly marked."
                : "查看当日与累计记账收益，既能看总数，也能看单台。缺失记录会明确标出。",
            ],
            [
              en ? "Does it need attention?" : "需要回去检查吗？",
              en
                ? "Waiting for tasks and a failed data refresh are different things. The dashboard explains both."
                : "等待任务和数据刷新失败是两回事。每个状态都有解释，方便判断下一步。",
            ],
          ].map(([title, body], i) => (
            <article key={title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="start-section">
        <div>
          <span className="eyebrow">{en ? "GET STARTED" : "开始使用"}</span>
          <h2>{en ? "One ID to get started." : "从一个 Miner ID 开始。"}</h2>
          <p>
            {en
              ? "Keep IOTA Train at Home running on your device. This website is your window into its reported activity."
              : "让设备上的 IOTA Train at Home 保持运行，本站帮你查看它上报的状态和收益。"}
          </p>
          <a className="site-button" href={`/${locale}/app`}>
            {c.cta}
            <ArrowUpRight size={18} />
          </a>
        </div>
        <ol>
          {c.steps.map(([title, body], i) => (
            <li key={title}>
              <span>{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="learn-links">
        <a href={`/${locale}/guide`}>
          <span>{en ? "SETUP" : "使用方法"}</span>
          <h3>
            {c.nav[0]}
            <ArrowUpRight size={22} />
          </h3>
        </a>
        <a href={`/${locale}/faq`}>
          <span>{en ? "DATA EXPLAINED" : "数据口径"}</span>
          <h3>
            {c.nav[1]}
            <ArrowUpRight size={22} />
          </h3>
        </a>
        <a href={`/${locale}/privacy`}>
          <span>{en ? "YOUR INFORMATION" : "你的信息"}</span>
          <h3>
            {c.nav[2]}
            <ArrowUpRight size={22} />
          </h3>
        </a>
      </section>
    </div>
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
