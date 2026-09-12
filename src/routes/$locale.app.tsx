import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/components/site/pages";
import { Dashboard } from "@/components/dashboard";

export const Route = createFileRoute("/$locale/app")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "app"),
  component: Dashboard,
});
