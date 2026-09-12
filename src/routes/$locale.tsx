import { useEffect } from "react";
import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { LocaleContext, type Locale } from "@/components/site/locale";
import { SiteNav, SiteFooter } from "@/components/site/pages";
import { persistLocale, isLocale } from "@/lib/site";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  component: Layout,
});

function Layout() {
  const { locale } = Route.useParams();
  useEffect(() => {
    if (isLocale(locale)) persistLocale(locale);
  }, [locale]);
  return (
    <LocaleContext.Provider value={locale as Locale}>
      <div className="site-shell">
        <a className="skip-link" href="#main">
          {locale === "en" ? "Skip to content" : "跳到正文"}
        </a>
        <SiteNav />
        <div id="main">
          <Outlet />
        </div>
        <SiteFooter />
      </div>
    </LocaleContext.Provider>
  );
}
