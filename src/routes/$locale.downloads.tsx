import { isLocale } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadsPage } from "@/components/site/downloads";
import { seo } from "@/components/site/seo";

export const Route = createFileRoute("/$locale/downloads")({
  head: ({ params }) => seo(isLocale(params.locale) ? params.locale : "zh", "downloads"),
  component: DownloadsPage,
});
