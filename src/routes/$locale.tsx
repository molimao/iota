import { useEffect } from "react";
import { createFileRoute, Outlet, notFound, useMatchRoute } from "@tanstack/react-router";
import { LocaleContext, type Locale } from "@/components/site/locale";
import { SiteNav, SiteFooter } from "@/components/site/pages";
import { persistLocale, isLocale } from "@/lib/site";
import { localizeText } from "@/components/site/localization";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  component: Layout,
});

function Layout() {
  const { locale } = Route.useParams();
  const matchRoute = useMatchRoute();
  const isMonitor = Boolean(matchRoute({ to: "/$locale/app", fuzzy: true }));
  useEffect(() => {
    if (isLocale(locale)) persistLocale(locale);
  }, [locale]);
  return (
    <LocaleContext.Provider value={locale as Locale}>
      <div className="site-shell">
        <a className="skip-link" href="#main">
          {localizeText(
            locale === "zh" || locale === "zh-TW" ? "跳到正文" : "Skip to content",
            locale as Locale,
          )}
        </a>
        <SiteNav />
        <div id="main">
          <Outlet />
        </div>
        {isMonitor ? null : <SiteFooter />}
      </div>
    </LocaleContext.Provider>
  );
}
