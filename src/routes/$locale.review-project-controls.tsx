import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AgentBatchPanel } from "@/components/agent-batch";
import { DeviceAgentSummary } from "@/components/device-agent-summary";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { useLocale } from "@/components/site/locale";
import { batchCopy } from "@/components/agent-batch-copy";
import { insightCopy } from "@/components/agent-insight-copy";
import { agentCopy } from "@/components/device-agent-copy";
import type { AgentInfo } from "@/lib/device-agent";

export const Route = createFileRoute("/$locale/review-project-controls")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: Review,
});
function Review() {
  const { locale } = useLocale(),
    now = useAgentClock(),
    t = batchCopy(locale);
  const [layout, setLayout] = useState<"cards" | "list">("cards");
  const [plan, setPlan] = useState<"free" | "pro">("pro");
  const names = Object.fromEntries(
    ["Mac Studio", "Mac mini", "MacBook Pro", "MacBook Air"].map((n, i) => [
      `00000000-0000-4000-8000-00000000000${i + 1}`,
      n,
    ]),
  );
  const ids = Object.keys(names),
    stamp = new Date(now).toISOString();
  const agents: AgentInfo[] = ids.slice(0, 3).map((deviceId, i) => ({
    deviceId,
    lastSeen: new Date(now - (i === 2 ? 180000 : 0)).toISOString(),
    snapshot: {
      appRunning: true,
      workerRunning: true,
      version: "1.0.12",
      appCpu: 180,
      processMemoryMb: 640,
      queue: i === 1 ? { position: 182, observedAt: stamp } : null,
      trainingState: i === 0 ? { phase: "training", status: "forward", observedAt: stamp } : null,
    },
    pending: null,
    latestCommand: null,
    logsEnabled: false,
    recoveryEnabled: false,
  }));
  return (
    <main id="main" className="projects-page">
      <header className="project-heading">
        <h1>IOTA</h1>
        <span>{t.demo}</span>
      </header>
      <button
        type="button"
        className="fleet-outline"
        onClick={() => setPlan(plan === "pro" ? "free" : "pro")}
      >
        {plan === "pro" ? "预览免费版" : "预览 Pro"}
      </button>
      <AgentBatchPanel
        agents={agents}
        names={names}
        unpaired={[{ id: ids[3]!, name: names[ids[3]!]! }]}
        locale={locale}
        now={now}
        preview
        userId={null}
        previewPlan={plan}
      />
      <div className="agent-filter-toolbar">
        <h2>{agentCopy.choose[locale]}</h2>
        <div className="agent-layout-switch">
          {(["cards", "list"] as const).map((v) => (
            <button key={v} aria-pressed={layout === v} onClick={() => setLayout(v)}>
              {insightCopy[v][locale]}
            </button>
          ))}
        </div>
      </div>
      {layout === "cards" ? (
        <div className="agent-grid">
          {ids.map((id) => (
            <article className="compute-panel" key={id}>
              <h2>{names[id]}</h2>
              <DeviceAgentSummary
                preview
                deviceId={id}
                {...(agents.find((a) => a.deviceId === id)
                  ? { previewAgent: agents.find((a) => a.deviceId === id)! }
                  : {})}
              />
            </article>
          ))}
        </div>
      ) : (
        <div className="iota-table-scroll">
          <table className="iota-device-table">
            <thead>
              <tr>
                <th>Mac</th>
                <th>IOTA</th>
              </tr>
            </thead>
            <tbody>
              {ids.map((id) => (
                <tr key={id}>
                  <td>{names[id]}</td>
                  <td>
                    <DeviceAgentSummary
                      preview
                      compact
                      deviceId={id}
                      {...(agents.find((a) => a.deviceId === id)
                        ? { previewAgent: agents.find((a) => a.deviceId === id)! }
                        : {})}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
