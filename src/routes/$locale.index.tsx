import { createFileRoute } from "@tanstack/react-router";
import { Landing, ArticlePage, seo } from "@/components/site/pages";
import type { Locale } from "@/components/site/locale";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "home"),
  component: Landing,
});
