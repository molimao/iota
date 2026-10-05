import { isLocale } from "@/lib/site";
import { fleetCopy } from "@/components/fleet-copy";
import { createFileRoute } from "@tanstack/react-router";
import { FleetPage } from "@/components/fleet-page";
export const Route = createFileRoute("/$locale/devices")({
  head: ({ params }) => ({
    meta: [
      { title: `${fleetCopy(isLocale(params.locale) ? params.locale : "zh").title} · IOTA Watch` },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: FleetPage,
});
