import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, seo } from "@/components/site/pages";

export const Route = createFileRoute("/$locale/guide")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "guide"),
  component: Page,
});
function Page() {
  return <ArticlePage page="guide" />;
}
