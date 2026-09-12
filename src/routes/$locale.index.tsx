import { createFileRoute } from "@tanstack/react-router";
import { Landing, seo } from "@/components/site/pages";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "home"),
  component: Landing,
});
