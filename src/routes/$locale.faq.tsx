import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage, seo } from "@/components/site/pages";

export const Route = createFileRoute("/$locale/faq")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "faq"),
  component: Page,
});
function Page() {
  return <ArticlePage page="faq" />;
}
