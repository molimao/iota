import { isLocale } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/components/site/pages";
import { Dashboard } from "@/components/dashboard";

export const Route = createFileRoute("/$locale/app")({
  head: ({ params }) => seo(isLocale(params.locale) ? params.locale : "zh", "app"),
  component: Dashboard,
});
