import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import type { FleetDevice } from "@/lib/fleet";
import { useFleetReadings } from "@/hooks/use-fleet-readings";
import { OverviewWorkspace } from "@/components/overview-page";
import { FleetWorkspace } from "@/components/fleet-workspace";
import { ProjectAddressBookView } from "@/components/project-address-book";
import { useLocale } from "@/components/site/locale";
import { useQuery } from "@tanstack/react-query";
import { getPublicPlatform } from "@/lib/platforms.functions";

export const Route = createFileRoute("/$locale/review-acurast")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: Review,
});
const ids = [
  "5GP4RwiW81Pxo47eFpGdEnNUsGyjE9HehcqqQT28KbyW7Kek",
  "5EvGVRCfYqpqBC4DWZLPjrhDaUcrqq7dQzMPwvvmhaky4NrH",
];
// User-provided PUBLIC addresses, real upstream reads. No account or DB mutation.
const devices: FleetDevice[] = ids.map((identifier, i) => ({
  id: `acu-readonly-${i}`,
  name: i === 0 ? "Acurast · 处理器地址" : "Acurast · 管理地址",
  hardware: "",
  createdAt: 1,
  bindings: [{ id: `acu-binding-${i}`, project: "acurast", identifier, worker: "" }],
}));
function Review() {
  const [view, setView] = useState("project"),
    [index, setIndex] = useState(1);
  const { locale } = useLocale();
  const reading = useFleetReadings(devices, true);
  const query = useQuery({
    queryKey: ["acu-live-review", ids[index]],
    queryFn: () => getPublicPlatform({ data: { project: "acurast", id: ids[index]! } }),
    retry: false,
    staleTime: 300000,
  });
  return (
    <>
      <nav
        className="fleet-workspace"
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingBlock: "1rem" }}
      >
        <p style={{ width: "100%" }}>
          本地实测 · 官方链上真实数据 · 两个地址属于同一管理身份 · 不写入账号
        </p>
        {[
          ["project", "项目页"],
          ["devices", "设备卡片"],
          ["overview", "总览"],
        ].map(([v, label]) => (
          <button
            className="fleet-outline"
            key={v}
            onClick={() => setView(v!)}
            aria-pressed={view === v}
          >
            {label}
          </button>
        ))}
      </nav>
      {view === "overview" ? (
        <OverviewWorkspace
          devices={devices}
          reading={reading}
          onRefresh={reading.refresh}
          refreshing={reading.refreshing}
          preview
          history={[]}
        />
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
        <main className="fleet-workspace">
          <h1>Acurast · ACU 收益</h1>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {ids.map((id, i) => (
              <button
                key={id}
                className="fleet-outline"
                onClick={() => setIndex(i)}
                aria-pressed={index === i}
              >
                {i === 0 ? "设备地址" : "管理地址"}
              </button>
            ))}
          </div>
          {query.isFetching && <p role="status">正在读取官方主网奖励…</p>}
          {query.data?.error && <p role="alert">{query.data.error}</p>}
          {query.data?.data && (
            <ProjectAddressBookView
              project="acurast"
              locale={locale}
              savedCount={1}
              limit={50}
              showDetail={false}
              cards={[
                {
                  deviceId: "preview",
                  bindingId: "preview",
                  deviceName: index === 1 ? "Acurast · 管理地址" : "Acurast · 处理器地址",
                  identifier: ids[index]!,
                  status:
                    query.data.data.online === true
                      ? "online"
                      : query.data.data.online === false
                        ? "offline"
                        : "unavailable",
                  activity: "",
                  source: "Acurast Mainnet",
                  updated: new Date(query.data.fetchedAt ?? Date.now()).toLocaleTimeString(),
                  today: null,
                  unit: "ACU",
                  ...(query.data.data.acurastQuote ? { acurastQuote: query.data.data.acurastQuote } : {}),
                  ...(query.data.data.acurastBalances
                    ? { acurastBalances: query.data.data.acurastBalances }
                    : {}),
                  ...(query.data.data.acurastRewards
                    ? { acurastRewards: query.data.data.acurastRewards }
                    : {}),
                  ...(query.data.data.acurast ? { acurast: query.data.data.acurast } : {}),
                },
              ]}
            />
          )}
        </main>
      )}
    </>
  );
}
