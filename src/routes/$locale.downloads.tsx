import { createFileRoute } from "@tanstack/react-router";
import { DownloadsPage } from "@/components/site/downloads";
import { seo } from "@/components/site/seo";

export const Route = createFileRoute("/$locale/downloads")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "downloads"),
  component: DownloadsPage,
});
