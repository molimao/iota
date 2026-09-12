import { createFileRoute } from "@tanstack/react-router";
import { Landing, ArticlePage, seo } from "@/components/site/pages";
import type { Locale } from "@/components/site/locale";
import { Dashboard } from "@/components/dashboard";
export const Route = createFileRoute("/$locale/app")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "app"),
  component: Dashboard,
});
