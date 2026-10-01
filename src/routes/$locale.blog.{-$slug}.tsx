import { createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { BlogArticle, BlogIndex } from "@/components/site/blog";
import { getBlogPost } from "@/components/site/blog-posts";
import { seo } from "@/components/site/seo";

function slugFromPath(pathname: string, locale: string) {
  const prefix = `/${locale}/blog`;
  if (pathname === prefix || pathname === `${prefix}/`) return undefined;
  return pathname.startsWith(`${prefix}/`)
    ? pathname.slice(prefix.length + 1) || undefined
    : undefined;
}
export const Route = createFileRoute("/$locale/blog/{-$slug}")({
  beforeLoad: ({ params, location }) => {
    const slug = params.slug ?? slugFromPath(location.pathname, params.locale);
    if (slug && !getBlogPost(slug)) throw notFound();
  },
  loader: ({ params, location }) => ({
    slug: params.slug ?? slugFromPath(location.pathname, params.locale),
  }),
  head: ({ params, loaderData }) =>
    seo(params.locale === "en" ? "en" : "zh", "blog", loaderData?.slug ?? params.slug),
  component: Page,
});
function Page() {
  const { locale, slug } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const resolved = slug ?? slugFromPath(pathname, locale);
  return resolved ? <BlogArticle slug={resolved} /> : <BlogIndex />;
}
