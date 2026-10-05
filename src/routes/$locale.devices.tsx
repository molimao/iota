import { createFileRoute } from "@tanstack/react-router";
import { FleetPage } from "@/components/fleet-page";
export const Route = createFileRoute("/$locale/devices")({
  head: () => ({
    meta: [{ title: "Devices · IOTA Watch" }, { name: "robots", content: "noindex, follow" }],
  }),
  component: FleetPage,
});
