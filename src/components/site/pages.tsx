import { simpleCopy } from "../simple-ui";
import { PROJECT_IDS, PROJECTS, isMonitorProject, projectPath } from "@/lib/projects";
import { MonitoringViews, monitorViewCopy } from "../monitor-views";
import { fleetCopy } from "../fleet-copy";
import { localizeValue } from "@/components/site/localization";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Layers, LogIn, Menu } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { persistLocale, swapLocalePath, LOCALES, LANGUAGE_TAG, LANGUAGE_NAME } from "@/lib/site";
import { minerIdError } from "@/lib/ss58";
import { useAuth } from "@/hooks/use-auth";
import { useBilling } from "@/hooks/use-billing";
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
import { ProjectSwitch, ProjectCards } from "../projects";
import { projectsCopy } from "../projects-copy";
import { learningCopy } from "./guide-copy";
import { ProjectLearning } from "./project-learning";

export type { Page } from "./seo";
export { seo } from "./seo";

export function LanguageSwitch() {
  const { locale, en } = useLocale();
  const path = useRouterState({
    select: (s) =>
      s.location.pathname +
      s.location.searchStr +
      (s.location.hash ? `#${s.location.hash.replace(/^#/, "")}` : ""),
  });
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
  const project = isMonitorProject(projectId) ? projectId : undefined;
  const views = monitorViewCopy(locale);
  const filteredProject = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("project"),
  });
  const viewProject =
    project ??
    (filteredProject === "iota" || isMonitorProject(filteredProject) ? filteredProject : undefined);
  const deviceView = /\/(devices|review)$/.test(pathname);
  const links: ReadonlyArray<readonly [string, string]> = [
    [`/${locale}/learn`, simpleCopy(locale).help],
    [`/${locale}/faq`, copy.nav[1]],
    [`/${locale}/downloads`, localizeValue(en ? "Downloads" : "工具下载", locale)],
    [`/${locale}/blog`, localizeValue(en ? "Blog" : "博客", locale)],
    [`/${locale}/privacy`, copy.nav[3]],
  ];
  return (
    <nav className="site-nav" aria-label={localizeValue(en ? "Main navigation" : "主导航", locale)}>
      <div className="site-brand-group">
        <a
          className="site-brand"
          aria-label="IOTA Watch"
          href={`/${locale}`}
          aria-current={pathname === `/${locale}` ? "page" : undefined}
        >
          <span>
            <Layers size={20} />
          </span>
          IOTA <b>Watch</b>
        </a>
        <MonitoringViews current={deviceView ? "devices" : "projects"} project={viewProject} />
        {!deviceView && !pathname.endsWith("/projects") && <ProjectSwitch />}
      </div>
      <div className="site-links">
        <LanguageSwitch />
        <AccountMenu />
        <details className="mobile-nav">
          <summary aria-label={localizeValue(en ? "Navigation menu" : "导航菜单", locale)}>
            <Menu size={20} />
          </summary>
          <div className="site-menu-panel">
            <section className="site-menu-group" aria-label={views.menuProjects}>
              <h2>{views.menuProjects}</h2>
              {PROJECT_IDS.map((id) => (
                <a key={id} href={projectPath(locale, id)}>
                  <span>{PROJECTS[id].name}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </section>
            <section className="site-menu-group" aria-label={views.menuResources}>
              <h2>{views.menuResources}</h2>
              {links.map(([href, label]) => (
                <a key={href} href={href} aria-current={navCurrent(pathname, href)}>
                  <span>{label}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </section>
            <div className="site-menu-language">
              <LanguageSwitch />
            </div>
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
        <p>{simpleCopy(locale).independent}</p>
      </div>
      <div>
        <a href={`/${locale}/projects`}>{projectsCopy[locale].projects}</a>
        <a href={`/${locale}/network`}>{copy.nav[5]}</a>
        <a href={`/${locale}/learn`}>{copy.nav[2]}</a>
        <a href={`/${locale}/blog`}>{localizeValue(en ? "Blog" : "博客", locale)}</a>
        <a href={`/${locale}/downloads`}>{localizeValue(en ? "Downloads" : "工具下载", locale)}</a>
        <a href={`/${locale}/privacy`}>{copy.nav[3]}</a>
        <a href="https://github.com/molimao/iota" rel="noreferrer" target="_blank">
          GitHub
        </a>
      </div>
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
      </section>
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
      <div className="simple-home-links">
        <a href={`/${locale}/learn`}>
          {simpleCopy(locale).help}
          <ArrowUpRight size={16} />
        </a>
        <a href={`/${locale}/downloads`}>
          {localizeValue(en ? "Downloads" : "工具下载", locale)}
          <ArrowUpRight size={16} />
        </a>
        <a href={`/${locale}/blog`}>
          {localizeValue(en ? "Blog" : "博客", locale)}
          <ArrowUpRight size={16} />
        </a>
      </div>
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
          <h2>{projectsCopy[locale].projects}</h2>
          <p>{projectsCopy[locale].privacyData}</p>
          <p>
            {
              {
                zh: "连接 io.net 或 Vast.ai 时，凭据会加密保存并仅用于读取对应平台的数据，最长有效期为 7 天。断开连接会删除本站保存的凭据；你也可以在原平台撤销授权。",
                en: "When you connect io.net or Vast.ai, credentials are encrypted and used only to read data from that platform, for up to 7 days. Disconnecting deletes the credentials stored here; you can also revoke access on the original platform.",
                "zh-TW":
                  "連接 io.net 或 Vast.ai 時，憑證會加密儲存，僅用於讀取對應平台的資料，最長有效期為 7 天。中斷連接會刪除本站儲存的憑證；你也可以在原平台撤銷授權。",
                ko: "io.net 또는 Vast.ai 연결 시 인증 정보는 암호화되어 최대 7일 동안 해당 플랫폼의 데이터 조회에만 사용됩니다. 연결을 해제하면 이 사이트에 저장된 인증 정보가 삭제됩니다. 원래 플랫폼에서도 접근 권한을 취소할 수 있습니다.",
                ja: "io.net または Vast.ai の接続情報は暗号化され、最大7日間、対象プラットフォームのデータ取得にのみ使用されます。接続を解除すると当サイトの接続情報は削除されます。元のプラットフォームでもアクセスを取り消せます。",
              }[locale]
            }
          </p>
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
  const billing = useBilling(auth.userId, auth.ready),
    membershipCopy = fleetCopy(locale);
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
          <section className="account-membership-card">
            <div>
              <span className="account-pro-badge">
                {billing.data ? (billing.data.plan === "pro" ? "PRO" : "FREE") : "…"}
              </span>
              <h2>
                {billing.data
                  ? billing.data.plan === "pro"
                    ? membershipCopy.memberActive
                    : membershipCopy.free
                  : billing.isError
                    ? membershipCopy.unavailable
                    : membershipCopy.checking}
              </h2>
              <p>
                {billing.data?.plan === "pro"
                  ? membershipCopy.memberIntro
                  : membershipCopy.sameFeatures}
              </p>
            </div>
            <a className="site-button small" href={`/${locale}/devices?view=membership`}>
              {billing.data?.plan === "pro" ? membershipCopy.membership : membershipCopy.plans} →
            </a>
          </section>
          <div className="account-facts">
            <section>
              <h2>{localizeValue(en ? "Device list" : "设备清单", locale)}</h2>
              <p>
                {localizeValue(
                  en
                    ? "Free: 5 devices per project. Pro: 50 per project. The device overview has no separate device limit."
                    : "免费：每个项目 5 台。Pro：每个项目 50 台。设备总览无额外总数限制。",
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
                ? "Sign in to sync devices across browsers. Free: 5 devices per project. Pro: 50 per project."
                : "登录后可跨浏览器同步设备。免费每个项目 5 台，Pro 每个项目 50 台。",
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
