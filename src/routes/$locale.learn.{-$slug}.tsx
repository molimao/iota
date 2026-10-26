import { expansionMetadata, loadExpansionArticle } from "@/components/site/project-expansion";
import { isLocale, LOCALES } from "@/lib/site";
import { createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { adoptDepthArticle, getArticle, type Article } from "@/components/site/articles";
import { loadDepthArticle, projectDepthGuides } from "@/components/site/project-depth";
import { LearnArticle, LearnIndex, seo } from "@/components/site/pages";

function slugFromPath(pathname: string, locale: string) {
  const prefix = `/${locale}/learn`;
  if (pathname === prefix || pathname === `${prefix}/`) return undefined;
  if (!pathname.startsWith(`${prefix}/`)) return undefined;
  const slug = pathname.slice(prefix.length + 1);
  return slug || undefined;
}

function depthArticleNeedsBody(article: Article) {
  const missing = LOCALES.some((locale) => (article.body[locale]?.length ?? 0) === 0);
  return (
    missing &&
    [...projectDepthGuides, ...expansionMetadata].some((guide) => guide.slug === article.slug)
  );
}

export function learnRouteHead({
  locale,
  slug,
  article,
}: {
  locale: string;
  slug?: string | undefined;
  article?: Article | null | undefined;
}) {
  if (article) adoptDepthArticle(article);
  return seo(isLocale(locale) ? locale : "zh", "learn", slug);
}

export const Route = createFileRoute("/$locale/learn/{-$slug}")({
  beforeLoad: ({ params, location }) => {
    const locale = isLocale(params.locale) ? params.locale : "zh";
    const slug = params.slug ?? slugFromPath(location.pathname, locale);
    if (slug && !getArticle(slug)) throw notFound();
  },
  loader: async ({ params, location }) => {
    const locale = isLocale(params.locale) ? params.locale : "zh";
    const slug = params.slug ?? slugFromPath(location.pathname, locale);
    if (!slug) return { slug: undefined, article: null };
    const existing = getArticle(slug);
    if (!existing) throw notFound();
    if (!depthArticleNeedsBody(existing)) return { slug, article: existing };
    const loaded = (await loadExpansionArticle(slug)) ?? (await loadDepthArticle(slug));
    if (!loaded) throw new Error(`Missing accepted depth guide: ${slug}`);
    const article = adoptDepthArticle(loaded);
    if (!article) throw new Error(`Missing accepted depth guide: ${slug}`);
    return { slug, article };
  },
  head: ({ params, loaderData }) =>
    learnRouteHead({
      locale: params.locale,
      slug: loaderData?.slug ?? params.slug,
      article: loaderData?.article,
    }),
  component: Page,
});

function Page() {
  const { locale, slug } = Route.useParams();
  const { article } = Route.useLoaderData();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const resolved = slug ?? slugFromPath(pathname, locale);
  if (!resolved) return <LearnIndex />;
  return <LearnArticle slug={resolved} article={article} />;
}
