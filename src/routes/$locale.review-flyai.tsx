import { createFileRoute, notFound } from "@tanstack/react-router";
import { useLocale } from "@/components/site/locale";
import { useState } from "react";
import { FlyaiPage } from "@/components/flyai-page";
import { ProjectAddressBookView } from "@/components/project-address-book";
import { FleetWorkspace } from "@/components/fleet-workspace";
import { OverviewWorkspace } from "@/components/overview-page";
import { useFleetReadings } from "@/hooks/use-fleet-readings";
import type { FleetDevice } from "@/lib/fleet";
export const Route = createFileRoute("/$locale/review-flyai")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: Review,
});
// Public wallet already saved by the owner. Live upstream reads; no database writes.
const devices: FleetDevice[] = [
  {
    id: "flyai-preview",
    name: "mac",
    hardware: "",
    createdAt: 1,
    bindings: [
      {
        id: "flyai-preview-binding",
        project: "flyai",
        identifier: "0xba217c876b8e4d60449ecce847bbd9b831b752af",
        worker: "",
      },
    ],
  },
];
function Review() {
  const { locale } = useLocale();
  const [view, setView] = useState("project");
  const reading = useFleetReadings(devices, true);
  const b = devices[0]!.bindings[0]!,
    data = reading(b);
  const book = (
    <ProjectAddressBookView
      locale={locale}
      project="flyai"
      signedIn
      fleetReady
      cards={[
        {
          deviceId: devices[0]!.id,
          deviceName: "mac",
          bindingId: b.id,
          identifier: b.identifier,
          status: data.status,
          activity: data.activity,
          source: data.source,
          updated: data.updated,
          today: null,
          unit: "",
          ...(data.flyai ? { flyai: data.flyai } : {}),
        },
      ]}
      savedCount={1}
      limit={50}
    />
  );
  return (
    <>
      <nav
        className="fleet-workspace"
        style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingBlock: 16 }}
      >
        <p style={{ width: "100%" }}>本地预览 · 你的公开地址 · 实时月度积分 · 不写入账号</p>
        {[
          ["project", "项目页"],
          ["devices", "设备卡片"],
          ["overview", "总览"],
        ].map(([key, label]) => (
          <button
            key={key}
            className="fleet-outline"
            aria-pressed={view === key}
            onClick={() => setView(key!)}
          >
            {label}
          </button>
        ))}
      </nav>
      {view === "project" ? (
        <FlyaiPage addressBook={book} />
      ) : view === "devices" ? (
        <FleetWorkspace
          devices={devices}
          reading={reading}
          onRefresh={reading.refresh}
          refreshing={reading.refreshing}
          preview
          plan="pro"
          onAdd={async () => {}}
          onLink={async () => {}}
        />
      ) : (
        <OverviewWorkspace
          devices={devices}
          reading={reading}
          onRefresh={reading.refresh}
          refreshing={reading.refreshing}
          preview
          history={[]}
        />
      )}
    </>
  );
}
