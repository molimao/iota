import { agentReasonSchema } from "@/lib/agent-reason";
import { AgentPairing } from "@/components/agent-pairing";
import { createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { IotaProjectDeviceViews } from "@/components/dashboard";
import { FleetWorkspace } from "@/components/fleet-workspace";
import { AgentBatchPanel } from "@/components/agent-batch";
import { IdleBntEntry } from "@/components/idle-bnt";
import { operationsReviewData } from "@/components/operations-review-data";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { useLocale } from "@/components/site/locale";
import type { IdleBntConfig } from "@/lib/idle-bnt";
export const Route = createFileRoute("/$locale/review-operations")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: Review,
});
function Review() {
  const reasonScene = useRouterState({select:state=>new URLSearchParams(state.location.searchStr).get("reason")});
  const pairOutcome = useRouterState({select:state=>new URLSearchParams(state.location.searchStr).get("pairFlow")});
  const pairingScene = useRouterState({ select: state => new URLSearchParams(state.location.searchStr).get("pairing") === "1" });
  const idleMiningScene = useRouterState({
    select: (state) => new URLSearchParams(state.location.searchStr).get("idleMining"),
  });
  const idleMiningPlan = idleMiningScene === "free" ? "free" : "pro";
  const [view, setView] = useState(idleMiningScene ? "project-list" : "project-cards"),
    now = useAgentClock(),
    { locale } = useLocale();
  const data = operationsReviewData(now),
    layout = view.endsWith("list") ? "list" : "cards";
  const reason = agentReasonSchema.shape.code.safeParse(reasonScene);
  if (reason.success) {
    const sample=data.agents[data.devices[1]!.id]!;
    sample.snapshot.reason={code:reason.data,observedAt:new Date(now).toISOString()};
    delete sample.snapshot.queue;
    delete sample.snapshot.trainingState;
  }
  if (pairingScene) {
    delete data.agents[data.devices[1]!.id];
    delete data.byMiner[data.devices[1]!.bindings[0]!.identifier];
  }
  const [idleMiningSettings, setIdleMiningSettings] = useState<IdleBntConfig>(() => ({
    address: "2BZVmXsZqZJNdRouv8wipYe9pxYhCK1mx8kyz8Hauz58ueCLxEvaCkdmu8pWnHZiXa3ASPGnT9VsUcqJKx5az3Yq5HDNe",
    devices: [{ deviceId: data.devices[1]!.id, threads: 2 }],
  }));
  return (
    <>
      {(pairOutcome === "connected" || pairOutcome === "expired" || pairOutcome === "error") && <AgentPairing key={pairOutcome} deviceId={data.devices[1]!.id} preview autoOpen previewOutcome={pairOutcome} />}
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
          <IdleBntEntry
            plan={idleMiningPlan}
            userId={null}
            devices={data.devices}
            agents={Object.values(data.agents)}
            preview={idleMiningSettings}
            onPreviewSave={setIdleMiningSettings}
          />
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
            idleMiningPlan={idleMiningPlan}
            idleMiningSettings={idleMiningSettings}
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
