import { brandTitle } from "@/lib/brand";
import { agentCopy } from "@/components/device-agent-copy";
import { isLocale } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { DeviceAgentPage } from "@/components/device-agent-page";
export const Route = createFileRoute("/$locale/machines")({
  head: ({ params }) => ({
    meta: [
      { title: brandTitle(agentCopy.title[isLocale(params.locale) ? params.locale : "zh"]) },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: DeviceAgentPage,
});
