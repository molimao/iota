import { createFileRoute } from "@tanstack/react-router";
import { brandTitle } from "@/lib/brand";
import { isLocale } from "@/lib/site";
import { monitorViewCopy } from "@/components/monitor-views";
import { OverviewPage } from "@/components/overview-page";
export const Route = createFileRoute("/$locale/overview")({
  head: ({ params }) => ({
    meta: [
      {
        title: brandTitle(monitorViewCopy(isLocale(params.locale) ? params.locale : "zh").overview),
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: OverviewPage,
});
