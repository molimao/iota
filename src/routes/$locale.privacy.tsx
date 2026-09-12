import { createFileRoute } from "@tanstack/react-router";
import { Landing, ArticlePage, seo } from "@/components/site/pages";
import type { Locale } from "@/components/site/locale";

export const Route = createFileRoute("/$locale/privacy")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "privacy"),
  component: Page,
});
function Page() {
  return <ArticlePage page="privacy" />;
}
