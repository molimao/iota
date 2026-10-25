import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useLocale } from "@/components/site/locale";
import {
  REVIEW_PROJECTS,
  layoutReading,
  layoutDevices,
} from "@/components/project-layout-review-data";
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
  const { locale } = useLocale();
  const [project, setProject] = useState<(typeof REVIEW_PROJECTS)[number]>("prl"),
    [view, setView] = useState("project"),
    [state, setState] = useState("normal");
  const devices = state === "empty" ? [] : layoutDevices(project),
    data = layoutReading(project, locale, state === "stale");
  const book = (
    <ProjectAddressBookView
      project={project}
      locale={locale}
      signedIn
      fleetReady
      savedCount={devices.length}
      limit={50}
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
