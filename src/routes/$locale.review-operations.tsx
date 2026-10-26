import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { IotaProjectDeviceViews } from "@/components/dashboard";
import { FleetWorkspace } from "@/components/fleet-workspace";
import { AgentBatchPanel } from "@/components/agent-batch";
import { operationsReviewData } from "@/components/operations-review-data";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { useLocale } from "@/components/site/locale";
export const Route = createFileRoute("/$locale/review-operations")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: Review,
});
function Review() {
  const [view, setView] = useState("project-cards"),
    now = useAgentClock(),
    { locale } = useLocale();
  const data = operationsReviewData(now),
    layout = view.endsWith("list") ? "list" : "cards";
  return (
    <>
      <div className="fleet-review-switch">
        <span>本地预览 · 示例数据</span>
        {[
          ["project-cards", "项目卡片"],
          ["project-list", "项目列表"],
          ["device-cards", "设备卡片"],
          ["device-list", "设备列表"],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={value === view}
            onClick={() => setView(value!)}
          >
            {label}
          </button>
        ))}
      </div>
      {view.startsWith("project") ? (
        <main id="main" className="dashboard">
          <header className="project-heading">
            <div>
              <h1>IOTA</h1>
              <p>按项目查看状态、收益与远程操作 · 本地示例</p>
            </div>
          </header>
          <AgentBatchPanel
            preview
            agents={Object.values(data.agents)}
            names={Object.fromEntries(data.devices.map((d) => [d.id, d.name]))}
            userId={null}
            now={now}
            locale={locale}
          />
          <IotaProjectDeviceViews
            views={data.views}
            layout={layout}
            usdPerIota={6.6}
            now={now}
            preview
            previewAgents={data.byMiner}
            onOpen={() => {}}
            onRemove={() => {}}
          />
        </main>
      ) : (
        <FleetWorkspace
          key={view}
          devices={data.devices}
          reading={data.reading}
          plan="pro"
          preview
          previewAgents={data.agents}
          initialLayout={layout}
          signedIn
          onAdd={async () => {}}
          onLink={async () => {}}
          onMutation={async () => {}}
        />
      )}
    </>
  );
}
