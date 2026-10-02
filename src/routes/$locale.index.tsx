import { isLocale } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { Landing, seo } from "@/components/site/pages";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => seo(isLocale(params.locale) ? params.locale : "zh", "home"),
  component: Landing,
});
