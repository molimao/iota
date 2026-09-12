import { createFileRoute } from "@tanstack/react-router";
import { Landing, ArticlePage, seo } from "@/components/site/pages";
import type { Locale } from "@/components/site/locale";

export const Route = createFileRoute("/$locale/guide")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "guide"),
  component: Page,
});
function Page() {
  return <ArticlePage page="guide" />;
}
