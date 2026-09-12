import { createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { getArticle } from "@/components/site/articles";
import { LearnArticle, LearnIndex, seo } from "@/components/site/pages";

function slugFromPath(pathname: string, locale: string) {
  const prefix = `/${locale}/learn`;
  if (pathname === prefix || pathname === `${prefix}/`) return undefined;
  if (!pathname.startsWith(`${prefix}/`)) return undefined;
  return pathname.slice(prefix.length + 1) || undefined;
}

export const Route = createFileRoute("/$locale/learn/{-$slug}")({
  beforeLoad: ({ params, location }) => {
    const locale = params.locale === "en" ? "en" : "zh";
    const slug = params.slug ?? slugFromPath(location.pathname, locale);
    if (slug && !getArticle(slug)) throw notFound();
  },
  loader: ({ params, location }) => {
    const locale = params.locale === "en" ? "en" : "zh";
    return { slug: params.slug ?? slugFromPath(location.pathname, locale) };
  },
  head: ({ params, loaderData }) =>
    seo(params.locale === "en" ? "en" : "zh", "learn", loaderData?.slug ?? params.slug),
  component: Page,
});

function Page() {
  const { locale, slug } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const resolved = slug ?? slugFromPath(pathname, locale);
  return resolved ? <LearnArticle slug={resolved} /> : <LearnIndex />;
}
