import { localizeValue } from "@/components/site/localization";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Layers, LogIn, Monitor, Menu } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { persistLocale, swapLocalePath, LOCALES, LANGUAGE_TAG, LANGUAGE_NAME } from "@/lib/site";
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
import { ProjectSwitch, ProjectCards } from "../projects";
import { projectsCopy } from "../projects-copy";
import { isMiningProject, projectPath } from "@/lib/projects";
import { learningCopy } from "./guide-copy";
import { ProjectLearning } from "./project-learning";

export type { Page } from "./seo";
export { seo } from "./seo";

export function LanguageSwitch() {
  const { locale, en } = useLocale();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <details className="language-picker">
      <summary aria-label={localizeValue(en ? "Language" : "语言", locale)}>
        {LANGUAGE_NAME[locale]} <span aria-hidden="true">▾</span>
      </summary>
      <div className="language-options">
        {LOCALES.map((item) => (
          <a
            key={item}
            href={swapLocalePath(path, item)}
            hrefLang={LANGUAGE_TAG[item]}
            lang={LANGUAGE_TAG[item]}
            aria-current={locale === item ? "page" : undefined}
            className={locale === item ? "is-active" : undefined}
            onClick={() => persistLocale(item)}
          >
            {LANGUAGE_NAME[item]}
          </a>
        ))}
      </div>
    </details>
  );
}

function navCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined;
}

export function SiteNav() {
  const { locale, en } = useLocale();
  const copy = content[locale];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const projectId =
    pathname.match(/\/projects\/([^/]+)/)?.[1] ??
    getArticle(pathname.match(/\/learn\/([^/]+)/)?.[1] ?? "")?.project;
  const project = isMiningProject(projectId) ? projectId : undefined;
  const projectCopy = projectsCopy[locale];
  const links: ReadonlyArray<readonly [string, string]> = project
    ? [
        [`/${locale}/projects/${project}#network`, projectCopy.network],
        [`/${locale}/projects/${project}#setup`, projectCopy.setup],
        [`/${locale}/projects`, projectCopy.back],
      ]
    : [
        [`/${locale}/network`, copy.nav[5]],
        [`/${locale}/guide`, copy.nav[0]],
        [`/${locale}/faq`, copy.nav[1]],
        [`/${locale}/learn`, copy.nav[2]],
        [`/${locale}/blog`, localizeValue(en ? "Blog" : "博客", locale)],
        [`/${locale}/downloads`, localizeValue(en ? "Downloads" : "工具下载", locale)],
      ];
  return (
    <nav className="site-nav" aria-label={localizeValue(en ? "Main navigation" : "主导航", locale)}>
      <div className="site-brand-group">
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
        <ProjectSwitch />
      </div>
      <div className="site-links">
        {links.map(([href, label]) => (
          <a key={href} href={href} aria-current={navCurrent(pathname, href)}>
            {label}
          </a>
        ))}
        <a
          className="site-button small"
          href={project ? `/${locale}/projects/${project}#addresses` : `/${locale}/app`}
          aria-current={project ? undefined : navCurrent(pathname, `/${locale}/app`)}
        >
          {project ? projectCopy.mine : localizeValue(en ? "My devices" : "我的设备", locale)}
        </a>
        <LanguageSwitch />
        <AccountMenu />
        <details className="mobile-nav">
          <summary aria-label={localizeValue(en ? "Navigation menu" : "导航菜单", locale)}>
            <Menu size={20} />
          </summary>
          <div>
            {links.map(([href, label]) => (
              <a key={href} href={href} aria-current={navCurrent(pathname, href)}>
                {label}
                <ArrowUpRight size={15} />
              </a>
            ))}
            <LanguageSwitch />
          </div>
        </details>
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
        <p>{projectsCopy[locale].independent}</p>
      </div>
      <div>
        <a href={`/${locale}/projects`}>{projectsCopy[locale].projects}</a>
        <a href={`/${locale}/network`}>{copy.nav[5]}</a>
        <a href={`/${locale}/guide`}>{copy.nav[0]}</a>
        <a href={`/${locale}/faq`}>{copy.nav[1]}</a>
        <a href={`/${locale}/learn`}>{copy.nav[2]}</a>
        <a href={`/${locale}/blog`}>{localizeValue(en ? "Blog" : "博客", locale)}</a>
        <a href={`/${locale}/downloads`}>{localizeValue(en ? "Downloads" : "工具下载", locale)}</a>
        <a href={`/${locale}/privacy`}>{copy.nav[3]}</a>
        <a href="https://github.com/molimao/iota" rel="noreferrer" target="_blank">
          GitHub
        </a>
      </div>
      <small>{localizeValue(en ? "Read-only public data." : "只读监控公开数据。", locale)}</small>
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
          placeholder={localizeValue(
            en ? "Paste your public Miner ID" : "粘贴你的公开 Miner ID",
            locale,
          )}
          aria-invalid={error ? true : undefined}
        />
      </label>
      <button className="site-button" type="submit">
        {value.trim()
          ? localizeValue(en ? "Add this device" : "添加此设备", locale)
          : content[locale].cta}
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
          {localizeValue(en ? "About this site" : "本站说明", locale)} <ArrowRight size={15} />
        </a>
      </aside>
      <section className="landing-projects">
        <div className="project-section-head">
          <h2>{projectsCopy[locale].other}</h2>
          <a className="text-link" href={`/${locale}/projects`}>
            {projectsCopy[locale].back}
            <ArrowRight size={15} />
          </a>
        </div>
        <ProjectCards compact />
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
          <span className="eyebrow">{localizeValue(en ? "GET STARTED" : "开始使用", locale)}</span>
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
          <span className="eyebrow">{localizeValue(en ? "HELP" : "使用说明", locale)}</span>
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
        <h2>{localizeValue(en ? "Practical monitoring articles" : "监控使用文章", locale)}</h2>
        <ul>
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <a href={`/${locale}/blog/${post.slug}`}>{post.title[locale]} →</a>
            </li>
          ))}
        </ul>
        <a href={`/${locale}/blog`}>
          {localizeValue(en ? "All blog articles" : "查看全部博客文章", locale)} →
        </a>
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
        ← {localizeValue(en ? "Home" : "首页", locale)}
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
          <h2>{localizeValue(en ? "Before you start" : "使用前须知", locale)}</h2>
          <p>
            {localizeValue(
              en
                ? "A Train at Home device and its public Miner ID are required. This dashboard cannot run training, promise rewards, or read local logs."
                : "需要已运行 Train at Home 的设备及其公开 Miner ID。本站不能启动训练、承诺收益，也不能读取本地日志。",
              locale,
            )}
          </p>
          <a href={`/${locale}/learn/find-miner-id`}>
            {localizeValue(en ? "Miner ID steps" : "Miner ID 步骤", locale)} →
          </a>
        </aside>
      )}
      {page === "privacy" && (
        <section className="article-tip">
          <h2>{projectsCopy[locale].projects} · XID / MMM & Quantus</h2>
          <p>{projectsCopy[locale].privacyData}</p>
        </section>
      )}
      {page === "faq" && <ProjectLearning />}
      <p className="article-updated">
        {page === "privacy" || page === "faq" ? (
          <time dateTime="2026-10-03">2026-10-03</time>
        ) : (
          copy.updated
        )}
      </p>
      <a className="site-button" href={`/${locale}/${page === "faq" ? "projects" : "app"}`}>
        {page === "faq" ? projectsCopy[locale].projects : copy.cta}
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}

function LearnGrid({ locale, allProjects = false }: { locale: Locale; allProjects?: boolean }) {
  return (
    <div className="learn-clusters">
      {(Object.keys(articleClusterMeta) as Array<keyof typeof articleClusterMeta>).map(
        (cluster) => {
          if (!allProjects && (cluster === "xid" || cluster === "quantus" || cluster === "compare"))
            return null;
          const meta = articleClusterMeta[cluster];
          return (
            <section key={cluster} id={cluster} className="learn-cluster">
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
  return (
    <article className="article-page learn-page">
      <a className="back-link" href={`/${locale}`}>
        ← {localizeValue(en ? "Home" : "首页", locale)}
      </a>
      <span className="eyebrow">{localizeValue(en ? "HELP" : "使用说明", locale)}</span>
      <h1>{learningCopy[locale].title}</h1>
      <p className="article-lead">{learningCopy[locale].intro}</p>
      <nav className="guide-jump-links" aria-label={learningCopy[locale].title}>
        <a href="#start">IOTA</a>
        <a href="#xid">XID / MMM</a>
        <a href="#quantus">Quantus</a>
        <a href="#compare">{learningCopy[locale].compare}</a>
      </nav>
      <LearnGrid locale={locale} allProjects />
      <p className="article-updated">
        <a href={`/${locale}/blog`}>
          {localizeValue(
            en
              ? "For practical workflows and troubleshooting, browse the blog."
              : "实际使用流程与问题排查，也可查看博客文章。",
            locale,
          )}
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
  const guideCopy = learningCopy[locale];
  const sections = article.body[locale].flatMap((block, i) =>
    block.startsWith("## ") ? [{ title: block.slice(3), id: `section-${i}` }] : [],
  );
  return (
    <article className="article-page learn-article" data-project={article.project ?? "iota"}>
      <a className="back-link" href={`/${locale}/${section}`}>
        ←{" "}
        {section === "blog"
          ? localizeValue(en ? "All posts" : "全部文章", locale)
          : localizeValue(en ? "All guides" : "全部说明", locale)}
      </a>
      <span className="eyebrow">IOTA WATCH / {article.topic[locale].toUpperCase()}</span>
      <h1>{article.title[locale]}</h1>
      <p className="article-lead">{article.description[locale]}</p>
      <p className="article-updated article-byline">
        IOTA Watch · {localizeValue(en ? "Published" : "发布", locale)}{" "}
        <time dateTime={dates.published}>{dates.published}</time>
        {dates.modified !== dates.published && (
          <>
            {" "}
            · {localizeValue(en ? "Updated" : "更新", locale)}{" "}
            <time dateTime={dates.modified}>{dates.modified}</time>
          </>
        )}
      </p>
      <a className="article-text-version" href={`/${locale}/${section}/${article.slug}.md`}>
        {localizeValue(en ? "Plain text version" : "纯文本版本", locale)}
      </a>
      {article.summary && (
        <aside className="article-answer">
          <h2>{guideCopy.answer}</h2>
          <p>{article.summary[locale]}</p>
        </aside>
      )}
      {article.comparison && (
        <div
          className="article-comparison"
          role="region"
          aria-label={guideCopy.compare}
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                {article.comparison[locale].headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {article.comparison[locale].rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={i}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {sections.length > 0 && (
        <nav
          className="article-toc"
          aria-label={localizeValue(en ? "On this page" : "本文目录", locale)}
        >
          <h2>{localizeValue(en ? "On this page" : "本文目录", locale)}</h2>
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
      {article.questions && (
        <section id="questions" className="article-questions">
          <h2>{guideCopy.questions}</h2>
          {article.questions[locale].map((q) => (
            <section key={q.question}>
              <h3>{q.question}</h3>
              <p>{q.answer}</p>
            </section>
          ))}
        </section>
      )}
      {article.sources && (
        <aside className="article-sources">
          <h2>{localizeValue(en ? "Sources and implementation" : "资料来源与本站实现", locale)}</h2>
          <p>
            {article.project
              ? guideCopy.sources
              : localizeValue(
                  en
                    ? "Official materials describe Train at Home. Refresh intervals and display rules describe IOTA Watch’s implementation."
                    : "官方资料用于了解 Train at Home；刷新周期与展示规则描述本站的实现。",
                  locale,
                )}
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
        <h2>{localizeValue(en ? "Related" : "相关说明", locale)}</h2>
        <div>
          {related.map((item) => (
            <a key={item.slug} href={`/${locale}/${section}/${item.slug}`}>
              {item.title[locale]}
            </a>
          ))}
        </div>
      </aside>
      <a
        className="site-button"
        href={
          article.project === "all"
            ? `/${locale}/projects`
            : projectPath(locale, article.project ?? "iota")
        }
      >
        {article.project ? guideCopy.open : content[locale].cta}
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}

export function AccountPage() {
  const { locale, en } = useLocale();
  const auth = useAuth();
  const label = auth.name || auth.email || localizeValue(en ? "Account" : "账号", locale);
  return (
    <article className="article-page account-page">
      <a className="back-link" href={auth.userId ? `/${locale}/app` : `/${locale}`}>
        ←{" "}
        {auth.userId
          ? localizeValue(en ? "My devices" : "我的设备", locale)
          : localizeValue(en ? "Home" : "首页", locale)}
      </a>
      <span className="eyebrow">IOTA WATCH / ACCOUNT</span>
      <h1>{localizeValue(en ? "Account" : "账号", locale)}</h1>
      {auth.userId ? (
        <>
          <div className="account-card">
            <AccountAvatar name={label} avatarUrl={auth.avatarUrl} size={56} />
            <div>
              <b>{auth.name || localizeValue(en ? "Signed in" : "已登录", locale)}</b>
              {auth.email ? <p>{auth.email}</p> : null}
              <span>
                {localizeValue(en ? "Signed in with Google" : "已用 Google 登录", locale)}
              </span>
            </div>
          </div>
          <div className="account-facts">
            <section>
              <h2>{localizeValue(en ? "Device list" : "设备清单", locale)}</h2>
              <p>
                {localizeValue(
                  en
                    ? "This account can keep up to 10 devices. Open My devices to add, rename, or remove them."
                    : "该账号最多绑定 10 台设备。添加、改名和移除均在「我的设备」完成。",
                  locale,
                )}
              </p>
              <a className="site-button small" href={`/${locale}/app`}>
                {localizeValue(en ? "Open my devices" : "打开我的设备", locale)}
              </a>
            </section>
            <section>
              <h2>{localizeValue(en ? "Account purpose" : "账号用途", locale)}</h2>
              <p>
                {localizeValue(
                  en
                    ? "Google sign-in binds the public Miner ID list so it can be opened on another device. IOTA Watch does not ask for a password, private key, or seed phrase."
                    : "Google 登录用于将公开 Miner ID 清单绑定到账号，以便在其他设备查看。IOTA Watch 不要求密码、私钥或助记词。",
                  locale,
                )}
              </p>
              <a href={`/${locale}/learn/google-account-device-list`}>
                {localizeValue(en ? "Device list sync" : "设备清单同步", locale)} →
              </a>
            </section>
          </div>
          <button type="button" className="account-signout" onClick={() => void auth.signOut()}>
            {localizeValue(en ? "Sign out" : "退出登录", locale)}
          </button>
        </>
      ) : (
        <>
          <p className="article-lead">
            {localizeValue(
              en
                ? "Sign in with Google to bind up to 10 devices to your account. Without signing in, this browser can keep 3 devices locally."
                : "使用 Google 登录后，最多将 10 台设备绑定到账号。未登录时，当前浏览器最多保存 3 台。",
              locale,
            )}
          </p>
          <button
            type="button"
            className="site-button"
            onClick={() => void auth.signInWithGoogle()}
            disabled={auth.signingIn}
          >
            <LogIn size={16} />
            {auth.signingIn
              ? localizeValue(en ? "Signing in" : "正在登录", locale)
              : localizeValue(en ? "Sign in with Google" : "用 Google 登录", locale)}
          </button>
        </>
      )}
    </article>
  );
}
