import { ArrowUpRight, Monitor, Layers, ArrowRight } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { persistLocale, swapLocalePath } from "@/lib/site";
import { articles, getArticle } from "./articles";
import { content } from "./content";
import { useLocale } from "./locale";
import { ArticleBlocks } from "./rich-text";

export type { Page } from "./seo";
export { seo } from "./seo";

export function LanguageSwitch() {
  const { locale, en } = useLocale();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="lang-switch" role="group" aria-label={en ? "Language" : "语言"}>
      {(["zh", "en"] as const).map((item) => (
        <a
          key={item}
          href={swapLocalePath(path, item)}
          hrefLang={item === "zh" ? "zh-CN" : "en"}
          lang={item === "zh" ? "zh-CN" : "en"}
          aria-current={locale === item ? "page" : undefined}
          className={locale === item ? "is-active" : undefined}
          onClick={() => persistLocale(item)}
        >
          {item === "zh" ? "中文" : "EN"}
        </a>
      ))}
    </div>
  );
}

export function SiteNav() {
  const { locale, en } = useLocale();
  const copy = content[locale];
  return (
    <nav className="site-nav" aria-label={en ? "Main navigation" : "主导航"}>
      <a className="site-brand" href={`/${locale}`}>
        <span>
          <Layers size={20} />
        </span>
        IOTA <b>Watch</b>
      </a>
      <div className="site-links">
        <a href={`/${locale}/guide`}>{copy.nav[0]}</a>
        <a href={`/${locale}/faq`}>{copy.nav[1]}</a>
        <a href={`/${locale}/learn`}>{copy.nav[2]}</a>
        <LanguageSwitch />
        <a className="site-button small" href={`/${locale}/app`}>
          {copy.nav[4]}
          <ArrowUpRight size={16} />
        </a>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  const { locale, en } = useLocale();
  const copy = content[locale];
  return (
    <footer className="site-footer">
      <div>
        <b>IOTA Watch</b>
        <p>{copy.independent}</p>
      </div>
      <div>
        <a href={`/${locale}/guide`}>{copy.nav[0]}</a>
        <a href={`/${locale}/faq`}>{copy.nav[1]}</a>
        <a href={`/${locale}/learn`}>{copy.nav[2]}</a>
        <a href={`/${locale}/privacy`}>{copy.nav[3]}</a>
        <a href="https://github.com/molimao/iota" rel="noreferrer" target="_blank">
          GitHub
        </a>
      </div>
      <small>{en ? "Made for people training at home." : "为在家参与训练的人而做。"}</small>
    </footer>
  );
}

export function Landing() {
  const { locale, en } = useLocale();
  const copy = content[locale];
  const [lead, accent] = copy.title.split("\n");
  return (
    <div className="landing-v2">
      <section className="opening">
        <div className="opening-label">
          <span />
          {copy.eyebrow}
        </div>
        <h1>
          {lead}
          <br />
          <em>{accent}</em>
        </h1>
        <p>{copy.intro}</p>
        <div className="opening-actions">
          <a className="site-button" href={`/${locale}/app`}>
            {copy.cta}
            <ArrowUpRight size={19} />
          </a>
          <a className="text-link" href={`/${locale}/learn/find-miner-id`}>
            {copy.secondary}
            <ArrowRight size={16} />
          </a>
        </div>
        <ul className="hero-chips">
          {copy.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
      <aside className="disambiguation">
        <strong>{copy.disambiguationTitle}</strong>
        <p>{copy.disambiguation}</p>
        <a href={`/${locale}/learn/what-is-iota-watch`}>
          {en ? "Read the short definition" : "看完整说明"} <ArrowRight size={15} />
        </a>
      </aside>
      <section className="product-stage" aria-label={en ? "Dashboard illustration" : "监控面板示意"}>
        <div className="stage-top">
          <span className="stage-wordmark">
            <Layers size={18} /> IOTA Watch
          </span>
          <span className="stage-demo">{copy.preview}</span>
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
                <h2>{copy.previewTitle}</h2>
              </div>
              <span className="stage-readonly">{en ? "Read-only" : "只读监控"}</span>
            </div>
            <div className="stage-metrics">
              <div>
                <span>{en ? "Today’s accounted rewards" : "今日记账收益"}</span>
                <strong>
                  — <small>IOTA</small>
                </strong>
                <em>— USD</em>
                <p>{en ? "Across your saved devices" : "汇总已添加设备"}</p>
              </div>
              <div>
                <span>{en ? "Lifetime rewards" : "累计记账收益"}</span>
                <strong>
                  — <small>IOTA</small>
                </strong>
                <em>— USD</em>
                <p>{en ? "Per-device records included" : "可以查看单台设备记录"}</p>
              </div>
            </div>
            <div className="stage-table">
              <div className="stage-table-head">
                <span>{en ? "DEVICE" : "设备"}</span>
                <span>{en ? "REPORTED STATUS" : "上报状态"}</span>
                <span>{en ? "REWARDS" : "收益"}</span>
              </div>
              {copy.previewNames.map((name, i) => (
                <div className="stage-device" key={name}>
                  <span>
                    <i>
                      <Monitor size={18} />
                    </i>
                    <b>{name}</b>
                  </span>
                  <span className={"stage-status s" + i}>{copy.statuses[i]}</span>
                  <span>
                    — <small>IOTA</small>
                    <em>— USD</em>
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
          <span className="eyebrow">{copy.jobsEyebrow}</span>
          <h2>{copy.jobsTitle}</h2>
          <p>{copy.jobsIntro}</p>
        </div>
        <div className="purpose-list">
          {copy.jobs.map(([title, body], i) => (
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
          <h2>{copy.stepsTitle}</h2>
          <p>{copy.bottom}</p>
          <a className="site-button" href={`/${locale}/app`}>
            {copy.cta}
            <ArrowUpRight size={18} />
          </a>
        </div>
        <ol>
          {copy.steps.map(([title, body], i) => (
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
      <section className="learn-index landing-learn">
        <div className="learn-index-head">
          <span className="eyebrow">{en ? "LEARN" : "说明"}</span>
          <h2>{copy.learnTitle}</h2>
          <p>{copy.learnIntro}</p>
        </div>
        <div className="learn-grid">
          {articles.map((article) => (
            <a key={article.slug} href={`/${locale}/learn/${article.slug}`}>
              <span>{article.topic[locale]}</span>
              <h3>
                {article.title[locale]}
                <ArrowUpRight size={18} />
              </h3>
              <p>{article.description[locale]}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="ecosystem">
        <span className="eyebrow">{copy.ecosystemTitle}</span>
        <div className="ecosystem-grid">
          {copy.ecosystem.map(([label, href, note]) => (
            <a key={href} href={href} rel="noreferrer" target="_blank">
              <h3>
                {label}
                <ArrowUpRight size={16} />
              </h3>
              <p>{note}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ArticlePage({ page }: { page: "guide" | "faq" | "privacy" }) {
  const { locale, en } = useLocale();
  const copy = content[locale];
  const title = page === "guide" ? copy.guideTitle : page === "faq" ? copy.faqTitle : copy.privacyTitle;
  const intro = page === "guide" ? copy.guideIntro : page === "faq" ? copy.faqIntro : copy.privacyIntro;
  const rows = page === "guide" ? copy.steps : page === "faq" ? copy.faq : copy.privacy;
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
          <a href={`/${locale}/learn/find-miner-id`}>
            {en ? "Illustrated Miner ID steps" : "看 Miner ID 详细步骤"} →
          </a>
        </aside>
      )}
      <p className="article-updated">{copy.updated}</p>
      <a className="site-button" href={`/${locale}/app`}>
        {copy.cta}
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}

export function LearnIndex() {
  const { locale, en } = useLocale();
  const copy = content[locale];
  return (
    <article className="article-page learn-page">
      <a className="back-link" href={`/${locale}`}>
        ← {en ? "Home" : "首页"}
      </a>
      <span className="eyebrow">IOTA WATCH / LEARN</span>
      <h1>{copy.learnTitle}</h1>
      <p className="article-lead">{copy.learnIntro}</p>
      <div className="learn-grid">
        {articles.map((article) => (
          <a key={article.slug} href={`/${locale}/learn/${article.slug}`}>
            <span>{article.topic[locale]}</span>
            <h3>
              {article.title[locale]}
              <ArrowUpRight size={18} />
            </h3>
            <p>{article.description[locale]}</p>
          </a>
        ))}
      </div>
    </article>
  );
}

export function LearnArticle({ slug }: { slug: string }) {
  const { locale, en } = useLocale();
  const article = getArticle(slug);
  if (!article) return null;
  const related = articles.filter((item) => item.slug !== slug);
  return (
    <article className="article-page learn-article">
      <a className="back-link" href={`/${locale}/learn`}>
        ← {en ? "All notes" : "全部说明"}
      </a>
      <span className="eyebrow">IOTA WATCH / {article.topic[locale].toUpperCase()}</span>
      <h1>{article.title[locale]}</h1>
      <p className="article-lead">{article.description[locale]}</p>
      <div className="learn-body">
        <ArticleBlocks blocks={article.body[locale]} locale={locale} />
      </div>
      <aside className="related-notes">
        <h2>{en ? "Related notes" : "相关说明"}</h2>
        <div>
          {related.map((item) => (
            <a key={item.slug} href={`/${locale}/learn/${item.slug}`}>
              {item.title[locale]}
            </a>
          ))}
        </div>
      </aside>
      <a className="site-button" href={`/${locale}/app`}>
        {content[locale].cta}
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}

