import { createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useLocale } from "@/components/site/locale";
import {
  REVIEW_PROJECTS,
  layoutReading,
  layoutDevices,
  layoutAgent,
} from "@/components/project-layout-review-data";
import { ProjectMinerSlots } from "@/components/device-miner-summary";
import { ProjectAgentConnectView } from "@/components/project-agent-connect";
import { BntWorkerAgentReview } from "@/components/bnt-worker-agent-review";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { ProjectAddressBookView } from "@/components/project-address-book";
import { FleetWorkspace } from "@/components/fleet-workspace";
import { OverviewWorkspace } from "@/components/overview-page";
import { PROJECTS } from "@/lib/projects";
export const Route = createFileRoute("/$locale/review-project-layouts")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: Review,
});
function Review() {
  const requestedProject = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("project"),
  });
  const requestedScene = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("scene"),
  });
  const now = useAgentClock();
  const [agentChoice, setAgentChoice] = useState("");
  const { locale } = useLocale();
  const [project, setProject] = useState<(typeof REVIEW_PROJECTS)[number]>("prl"),
    [view, setView] = useState("project"),
    [state, setState] = useState("normal");
  useEffect(() => {
    if (REVIEW_PROJECTS.includes(requestedProject as typeof project))
      setProject(requestedProject as typeof project);
    if (requestedScene && ["normal", "stale", "empty", "unpaired"].includes(requestedScene))
      setState(requestedScene);
  }, [requestedProject, requestedScene]);
  const devices = state === "empty" ? [] : layoutDevices(project),
    data = layoutReading(project, locale, state === "stale");
  const book = project === "bnt" && state !== "empty" ? <BntWorkerAgentReview key={state} unpaired={state === "unpaired"} /> : (
    <ProjectAddressBookView
      project={project}
      locale={locale}
      signedIn
      fleetReady
      savedCount={devices.length}
      limit={50}
      localMetrics={(entry) => (
        <>
          <ProjectMinerSlots
            bindings={[{ id: entry.bindingId, project, identifier: entry.identifier, worker: "" }]}
            agent={
              state !== "unpaired" && devices.find((d) => d.id === entry.deviceId)
                ? layoutAgent(
                    devices.find((d) => d.id === entry.deviceId)!,
                    now,
                  )
                : undefined
            }
            now={now}
            locale={locale}
          />
          {state === "unpaired" && ["bnt", "prl", "noid", "xmr"].includes(project) && (
            <ProjectAgentConnectView
              locale={locale}
              choices={[
                { id: "demo-studio", name: "Mac Studio" },
                { id: "demo-mini", name: "Mac mini" },
              ]}
              selected={agentChoice}
              onSelect={setAgentChoice}
              onSubmit={() => setState("normal")}
            />
          )}
        </>
      )}
      cards={devices.flatMap((d) =>
        d.bindings.map((b) => ({
          ...data,
          deviceId: d.id,
          deviceName: d.name,
          bindingId: b.id,
          identifier: b.identifier,
        })),
      )}
    />
  );
  return (
    <main className="fleet-workspace">
      <header className="project-heading">
        <div>
          <h1>{PROJECTS[project].name}</h1>
          <p>本地排版预览 · 示例数据</p>
        </div>
      </header>
      <div className="pab-tools">
        <select
          aria-label="项目"
          value={project}
          onChange={(e) => setProject(e.target.value as typeof project)}
        >
          {REVIEW_PROJECTS.map((p) => (
            <option key={p} value={p}>
              {PROJECTS[p].name}
            </option>
          ))}
        </select>
        <select aria-label="场景" value={state} onChange={(e) => setState(e.target.value)}>
          <option value="normal">正常数据</option>
          <option value="stale">旧数据</option>
          <option value="empty">未添加地址</option>
          <option value="unpaired">未关联 Agent</option>
        </select>
        {[
          ["project", "项目卡片"],
          ["devices", "设备卡片"],
          ["overview", "总览"],
        ].map(([key, label]) => (
          <button
            className="fleet-outline"
            key={key}
            aria-pressed={view === key}
            onClick={() => setView(key!)}
          >
            {label}
          </button>
        ))}
        <a href={`/${locale}/projects/${project}`}>查看实际项目页 ↗</a>
      </div>
      {view === "project" ? (
        book
      ) : view === "devices" ? (
        <FleetWorkspace
          devices={devices}
          reading={() => data}
          onRefresh={async () => {}}
          refreshing={false}
          preview
          previewAgents={Object.fromEntries(
            devices
              .map((d) => [d.id, layoutAgent(d, now)])
              .filter(
                (entry): entry is [string, NonNullable<ReturnType<typeof layoutAgent>>] =>
                  !!entry[1],
              ),
          )}
          plan="pro"
          onAdd={async () => {}}
          onLink={async () => {}}
        />
      ) : (
        <OverviewWorkspace
          devices={devices}
          reading={() => data}
          onRefresh={async () => {}}
          refreshing={false}
          preview
          history={[]}
        />
      )}
    </main>
  );
}
