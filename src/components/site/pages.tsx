import { useState } from "react";
import { ArrowRight, ArrowUpRight, Layers, LogIn, Monitor } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { persistLocale, swapLocalePath } from "@/lib/site";
import { minerIdError } from "@/lib/ss58";
import { useAuth } from "@/hooks/use-auth";
import { AccountAvatar, AccountMenu } from "./account-menu";
import { articleClusterMeta, getArticle, relatedArticles } from "./articles";
import { content } from "./content";
import { localizeMessage, useLocale, type Locale } from "./locale";
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

function navCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined;
}

export function SiteNav() {
  const { locale, en } = useLocale();
  const copy = content[locale];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const links = [
    [`/${locale}/network`, copy.nav[5]],
    [`/${locale}/learn`, copy.nav[2]],
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
        <a href={`/${locale}/app`}>{en ? "My devices" : "我的设备"}</a>
        <a href={`/${locale}/network`}>{copy.nav[5]}</a>
        <a href={`/${locale}/learn`}>{copy.nav[2]}</a>
        <a href={`/${locale}/faq`}>{copy.nav[1]}</a>
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
          placeholder={en ? "Paste your public Miner ID" : "粘贴你的公开 Miner ID"}
          aria-invalid={error ? true : undefined}
        />
      </label>
      <button className="site-button" type="submit">
        {value.trim() ? (en ? "Watch this device" : "看这台设备") : content[locale].cta}
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
          <a className="text-link" href={`/${locale}/network`}>
            {en ? "Network status" : "全网状态"}
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

export function ArticlePage({ page }: { page: "guide" | "faq" | "privacy" }) {
  const { locale } = useLocale();
  const copy = content[locale];
  const title =
    page === "guide" ? copy.guideTitle : page === "faq" ? copy.faqTitle : copy.privacyTitle;
  const intro =
    page === "guide" ? copy.guideIntro : page === "faq" ? copy.faqIntro : copy.privacyIntro;
  const rows = page === "guide" ? copy.steps : page === "faq" ? copy.faq : copy.privacy;
  return (
    <article className={`article-page ${page}-page`}>
      <h1>{title}</h1>
      <p className="article-lead">{intro}</p>
      <div className="article-sections">
        {rows.map(([heading, body], i) => (
          <section key={heading}>
            {page === "guide" ? (
              <span className="article-number">{String(i + 1).padStart(2, "0")}</span>
            ) : null}
            <div>
              <h2>{heading}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
      </div>
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
      {(["start", "read"] as const).map((cluster) => {
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
      })}
    </div>
  );
}

export function LearnIndex() {
  const { locale } = useLocale();
  const copy = content[locale];
  return (
    <article className="article-page learn-page">
      <h1>{copy.learnTitle}</h1>
      <p className="article-lead">{copy.learnIntro}</p>
      <LearnGrid locale={locale} />
    </article>
  );
}

export function LearnArticle({ slug }: { slug: string }) {
  const { locale, en } = useLocale();
  const article = getArticle(slug);
  if (!article) return null;
  const related = relatedArticles(slug);
  return (
    <article className="article-page learn-article">
      <a className="back-link" href={`/${locale}/learn`}>
        ← {en ? "All guides" : "全部说明"}
      </a>
      <span className="eyebrow">IOTA WATCH / {article.topic[locale].toUpperCase()}</span>
      <h1>{article.title[locale]}</h1>
      <p className="article-lead">{article.description[locale]}</p>
      <div className="learn-body">
        <ArticleBlocks blocks={article.body[locale]} locale={locale} />
      </div>
      <aside className="related-notes">
        <h2>{en ? "Related" : "相关说明"}</h2>
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

export function AccountPage() {
  const { locale, en } = useLocale();
  const auth = useAuth();
  const label = auth.name || auth.email || (en ? "Account" : "账号");
  return (
    <article className="article-page account-page">
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
          <a className="site-button small" href={`/${locale}/app`}>
            {en ? "Open my devices" : "打开我的设备"}
          </a>
          <button type="button" className="account-signout" onClick={() => void auth.signOut()}>
            {en ? "Sign out" : "退出登录"}
          </button>
        </>
      ) : (
        <>
          <p className="article-lead">
            {en
              ? "Sign in with Google to bind up to 10 devices to your account. Without signing in, this browser can keep 3 devices locally."
              : "用 Google 登录后，最多把 10 台设备绑到账号上。未登录时，当前浏览器最多保存 3 台。"}
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
