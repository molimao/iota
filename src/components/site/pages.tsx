import { useState } from "react";
import { ArrowRight, ArrowUpRight, Layers, LogIn, Monitor } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { persistLocale, swapLocalePath } from "@/lib/site";
import { minerIdError } from "@/lib/ss58";
import { useAuth } from "@/hooks/use-auth";
import { AccountAvatar, AccountMenu } from "./account-menu";
import {
  articleClusterMeta,
  articleDates,
  getArticle,
  relatedArticles,
  type Article,
} from "./articles";
import { content } from "./content";
import { localizeMessage, useLocale, type Locale } from "./locale";
import { ArticleBlocks } from "./rich-text";
import { blogPosts } from "./blog-posts";

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

function navCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined;
}

export function SiteNav() {
  const { locale, en } = useLocale();
  const copy = content[locale];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const links = [
    [`/${locale}/network`, copy.nav[5]],
    [`/${locale}/guide`, copy.nav[0]],
    [`/${locale}/faq`, copy.nav[1]],
    [`/${locale}/learn`, copy.nav[2]],
    [`/${locale}/blog`, en ? "Blog" : "博客"],
  ] as const;
  return (
    <nav className="site-nav" aria-label={en ? "Main navigation" : "主导航"}>
      <a
        className="site-brand"
        href={`/${locale}`}
        aria-current={pathname === `/${locale}` ? "page" : undefined}
      >
        <span>
          <Layers size={20} />
        </span>
        IOTA <b>Watch</b>
      </a>
      <div className="site-links">
        {links.map(([href, label]) => (
          <a key={href} href={href} aria-current={navCurrent(pathname, href)}>
            {label}
          </a>
        ))}
        <a
          className="site-button small"
          href={`/${locale}/app`}
          aria-current={navCurrent(pathname, `/${locale}/app`)}
        >
          {en ? "My devices" : "我的设备"}
        </a>
        <LanguageSwitch />
        <AccountMenu />
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
        <a href={`/${locale}/network`}>{copy.nav[5]}</a>
        <a href={`/${locale}/guide`}>{copy.nav[0]}</a>
        <a href={`/${locale}/faq`}>{copy.nav[1]}</a>
        <a href={`/${locale}/learn`}>{copy.nav[2]}</a>
        <a href={`/${locale}/blog`}>{en ? "Blog" : "博客"}</a>
        <a href={`/${locale}/privacy`}>{copy.nav[3]}</a>
        <a href="https://github.com/molimao/iota" rel="noreferrer" target="_blank">
          GitHub
        </a>
      </div>
      <small>{en ? "Read-only public data." : "只读监控公开数据。"}</small>
    </footer>
  );
}

/**
 * The whole product is "paste one ID", so the first screen is that box.
 * A valid ID goes straight to the dashboard with the add form prefilled.
 */
function StartForm() {
  const { locale, en } = useLocale();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="start-form"
      onSubmit={(event) => {
        event.preventDefault();
        const id = value.trim();
        if (!id) {
          window.location.href = `/${locale}/app`;
          return;
        }
        const reason = minerIdError(id);
        if (reason) {
          setError(localizeMessage(reason, locale));
          return;
        }
        window.location.href = `/${locale}/app?add=${encodeURIComponent(id)}`;
      }}
    >
      <label>
        <span className="sr-only">Miner ID</span>
        <input
          value={value}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          placeholder={en ? "Paste your public Miner ID" : "粘贴你的公开 Miner ID"}
          aria-invalid={error ? true : undefined}
        />
      </label>
      <button className="site-button" type="submit">
        {value.trim() ? (en ? "Add this device" : "添加此设备") : content[locale].cta}
        <ArrowUpRight size={19} />
      </button>
      {error ? (
        <p className="start-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
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
        <StartForm />
        <div className="opening-actions">
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
          {en ? "About this site" : "本站说明"} <ArrowRight size={15} />
        </a>
      </aside>
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
                <a href={`/${locale}${copy.jobsLinks[i]}`}>
                  {copy.jobsCta[i]} <ArrowRight size={14} />
                </a>
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
          <span className="eyebrow">{en ? "HELP" : "使用说明"}</span>
          <h2>{copy.learnTitle}</h2>
          <p>{copy.learnIntro}</p>
        </div>
        <LearnGrid locale={locale} />
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
      <section className="blog-entry">
        <h2>{en ? "Practical monitoring articles" : "监控使用文章"}</h2>
        <ul>
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <a href={`/${locale}/blog/${post.slug}`}>{post.title[locale]} →</a>
            </li>
          ))}
        </ul>
        <a href={`/${locale}/blog`}>{en ? "All blog articles" : "查看全部博客文章"} →</a>
      </section>
    </div>
  );
}

export function ArticlePage({ page }: { page: "guide" | "faq" | "privacy" }) {
  const { locale, en } = useLocale();
  const copy = content[locale];
  const title =
    page === "guide" ? copy.guideTitle : page === "faq" ? copy.faqTitle : copy.privacyTitle;
  const intro =
    page === "guide" ? copy.guideIntro : page === "faq" ? copy.faqIntro : copy.privacyIntro;
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
          <h2>{en ? "Before you start" : "使用前须知"}</h2>
          <p>
            {en
              ? "A Train at Home device and its public Miner ID are required. This dashboard cannot run training, promise rewards, or read local logs."
              : "需要已运行 Train at Home 的设备及其公开 Miner ID。本站不能启动训练、承诺收益，也不能读取本地日志。"}
          </p>
          <a href={`/${locale}/learn/find-miner-id`}>{en ? "Miner ID steps" : "Miner ID 步骤"} →</a>
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

function LearnGrid({ locale }: { locale: Locale }) {
  return (
    <div className="learn-clusters">
      {(Object.keys(articleClusterMeta) as Array<keyof typeof articleClusterMeta>).map(
        (cluster) => {
          const meta = articleClusterMeta[cluster];
          return (
            <section key={cluster} className="learn-cluster">
              <h2 className="learn-cluster-title">{meta.title[locale]}</h2>
              <div className="learn-grid">
                {meta.slugs.map((slug) => {
                  const article = getArticle(slug);
                  if (!article) return null;
                  return (
                    <a key={article.slug} href={`/${locale}/learn/${article.slug}`}>
                      <span>{article.topic[locale]}</span>
                      <h3>
                        {article.title[locale]}
                        <ArrowUpRight size={18} />
                      </h3>
                      <p>{article.description[locale]}</p>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        },
      )}
    </div>
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
      <span className="eyebrow">{en ? "HELP" : "使用说明"}</span>
      <h1>{copy.learnTitle}</h1>
      <p className="article-lead">{copy.learnIntro}</p>
      <LearnGrid locale={locale} />
      <p className="article-updated">
        <a href={`/${locale}/blog`}>
          {en
            ? "For practical workflows and troubleshooting, browse the blog."
            : "实际使用流程与问题排查，也可查看博客文章。"}
        </a>
      </p>
    </article>
  );
}

export function LearnArticle({ slug }: { slug: string }) {
  const article = getArticle(slug);
  return article ? (
    <ArticleView article={article} section="learn" related={relatedArticles(slug)} />
  ) : null;
}

export function ArticleView({
  article,
  section,
  related,
}: {
  article: Article;
  section: "learn" | "blog";
  related: Article[];
}) {
  const { locale, en } = useLocale();
  const dates = articleDates(article);
  const sections = article.body[locale].flatMap((block, i) =>
    block.startsWith("## ") ? [{ title: block.slice(3), id: `section-${i}` }] : [],
  );
  return (
    <article className="article-page learn-article">
      <a className="back-link" href={`/${locale}/${section}`}>
        ← {section === "blog" ? (en ? "All posts" : "全部文章") : en ? "All guides" : "全部说明"}
      </a>
      <span className="eyebrow">IOTA WATCH / {article.topic[locale].toUpperCase()}</span>
      <h1>{article.title[locale]}</h1>
      <p className="article-lead">{article.description[locale]}</p>
      <p className="article-updated article-byline">
        IOTA Watch · {en ? "Published" : "发布"}{" "}
        <time dateTime={dates.published}>{dates.published}</time>
        {dates.modified !== dates.published && (
          <>
            {" "}
            · {en ? "Updated" : "更新"} <time dateTime={dates.modified}>{dates.modified}</time>
          </>
        )}
      </p>
      <a className="article-text-version" href={`/${locale}/${section}/${article.slug}.md`}>
        {en ? "Plain text version" : "纯文本版本"}
      </a>
      {sections.length > 0 && (
        <nav className="article-toc" aria-label={en ? "On this page" : "本文目录"}>
          <h2>{en ? "On this page" : "本文目录"}</h2>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="learn-body">
        <ArticleBlocks blocks={article.body[locale]} locale={locale} />
      </div>
      {article.sources && (
        <aside className="article-sources">
          <h2>{en ? "Sources and implementation" : "资料来源与本站实现"}</h2>
          <p>
            {en
              ? "Official materials describe Train at Home. Refresh intervals and display rules describe IOTA Watch’s implementation."
              : "官方资料用于了解 Train at Home；刷新周期与展示规则描述本站的实现。"}
          </p>
          <ul>
            {article.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
      <aside className="related-notes">
        <h2>{en ? "Related" : "相关说明"}</h2>
        <div>
          {related.map((item) => (
            <a key={item.slug} href={`/${locale}/${section}/${item.slug}`}>
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

export function AccountPage() {
  const { locale, en } = useLocale();
  const auth = useAuth();
  const label = auth.name || auth.email || (en ? "Account" : "账号");
  return (
    <article className="article-page account-page">
      <a className="back-link" href={auth.userId ? `/${locale}/app` : `/${locale}`}>
        ← {auth.userId ? (en ? "My devices" : "我的设备") : en ? "Home" : "首页"}
      </a>
      <span className="eyebrow">IOTA WATCH / ACCOUNT</span>
      <h1>{en ? "Account" : "账号"}</h1>
      {auth.userId ? (
        <>
          <div className="account-card">
            <AccountAvatar name={label} avatarUrl={auth.avatarUrl} size={56} />
            <div>
              <b>{auth.name || (en ? "Signed in" : "已登录")}</b>
              {auth.email ? <p>{auth.email}</p> : null}
              <span>{en ? "Signed in with Google" : "已用 Google 登录"}</span>
            </div>
          </div>
          <div className="account-facts">
            <section>
              <h2>{en ? "Device list" : "设备清单"}</h2>
              <p>
                {en
                  ? "This account can keep up to 10 devices. Open My devices to add, rename, or remove them."
                  : "该账号最多绑定 10 台设备。添加、改名和移除均在「我的设备」完成。"}
              </p>
              <a className="site-button small" href={`/${locale}/app`}>
                {en ? "Open my devices" : "打开我的设备"}
              </a>
            </section>
            <section>
              <h2>{en ? "Account purpose" : "账号用途"}</h2>
              <p>
                {en
                  ? "Google sign-in binds the public Miner ID list so it can be opened on another device. IOTA Watch does not ask for a password, private key, or seed phrase."
                  : "Google 登录用于将公开 Miner ID 清单绑定到账号，以便在其他设备查看。IOTA Watch 不要求密码、私钥或助记词。"}
              </p>
              <a href={`/${locale}/learn/google-account-device-list`}>
                {en ? "Device list sync" : "设备清单同步"} →
              </a>
            </section>
          </div>
          <button type="button" className="account-signout" onClick={() => void auth.signOut()}>
            {en ? "Sign out" : "退出登录"}
          </button>
        </>
      ) : (
        <>
          <p className="article-lead">
            {en
              ? "Sign in with Google to bind up to 10 devices to your account. Without signing in, this browser can keep 3 devices locally."
              : "使用 Google 登录后，最多将 10 台设备绑定到账号。未登录时，当前浏览器最多保存 3 台。"}
          </p>
          <button
            type="button"
            className="site-button"
            onClick={() => void auth.signInWithGoogle()}
            disabled={auth.signingIn}
          >
            <LogIn size={16} />
            {auth.signingIn
              ? en
                ? "Signing in"
                : "正在登录"
              : en
                ? "Sign in with Google"
                : "用 Google 登录"}
          </button>
        </>
      )}
    </article>
  );
}
