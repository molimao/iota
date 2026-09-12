import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { LocaleContext, type Locale } from "@/components/site/locale";
import { SiteNav, SiteFooter } from "@/components/site/pages";
export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!["en", "zh"].includes(params.locale)) throw notFound();
  },
  component: Layout,
});
function Layout() {
  const { locale } = Route.useParams();
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
