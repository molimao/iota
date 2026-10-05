import { createFileRoute, notFound } from "@tanstack/react-router";
import { FleetReview } from "@/components/fleet-review";

/** Local review only: the production build never exposes sample account data. */
export const Route = createFileRoute("/$locale/review")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "设备与付费版设计预览 · IOTA Watch" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FleetReview,
});
