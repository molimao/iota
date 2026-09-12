import { createFileRoute } from "@tanstack/react-router";
import { NetworkPage } from "@/components/network-page";
import { seo } from "@/components/site/pages";

export const Route = createFileRoute("/$locale/network")({
  head: ({ params }) => seo(params.locale === "en" ? "en" : "zh", "network"),
  component: Page,
});
function Page() {
  return <NetworkPage />;
}
