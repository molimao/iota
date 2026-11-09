import { Dashboard } from "@/components/dashboard";
import { IdleBntEntry } from "@/components/idle-bnt";
import { reviewDevices } from "@/components/fleet-review-data";
import type { AgentInfo } from "@/lib/device-agent";
import { OverviewReview } from "@/components/overview-review";
import { ProjectRequest } from "@/components/project-request";
import { PlatformPage } from "@/components/platform-page";
import { isPlatform } from "@/lib/platforms";
import { createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { isLocale } from "@/lib/site";
import { DeviceAgentPage } from "@/components/device-agent-page";
import { FleetReview } from "@/components/fleet-review";
import { BntReview } from "@/components/bnt-review";
import { DiscretePage } from "@/components/discrete-page";
import { discreteReviewData } from "@/components/discrete-review-data";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { useLocale } from "@/components/site/locale";
import { fleetCopy } from "@/components/fleet-copy";

/** Local review only: the production build never exposes sample account data. */
export const Route = createFileRoute("/$locale/review")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      {
        title:
          {
            zh: "设备与付费版设计预览",
            en: "Devices and membership preview",
            "zh-TW": "設備與會員設計預覽",
            ko: "기기 및 멤버십 미리보기",
            ja: "デバイスとメンバーシップのプレビュー",
          }[isLocale(params.locale) ? params.locale : "zh"] + " · IOTA Watch",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Review,
});

function Review() {
  const overview = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("overview") === "1",
  });
  const request = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("request") === "1",
  });
  const p = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("platform"),
  });
  const machines = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("machines") === "1",
  });
  const bnt = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("bnt") === "1",
  });
  const xds = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("xds") === "1",
  });
  const idleMining = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("idleMining"),
  });
  if (xds) return <DiscreteReview />;
  if (bnt) return <BntReview />;
  if (overview) return <OverviewReview />;
  if (idleMining) return <IdleMiningReview scene={idleMining} />;
  if (machines) return <DeviceAgentPage preview />;
  if (request) return <ProjectRequest preview defaultOpen />;
  return isPlatform(p) ? <PlatformPage key={p} project={p} demo /> : <FleetReview />;
}

function DiscreteReview() {
  const now = useAgentClock();
  const { locale } = useLocale();
  return (
    <>
      <p className="overview-preview-label">{fleetCopy(locale).preview}</p>
      <DiscretePage preview={discreteReviewData(now)} />
    </>
  );
}

function ReviewLabel() {
  const { locale } = useLocale();
  return <p className="overview-preview-label">{fleetCopy(locale).preview}</p>;
}

function IdleMiningReview({ scene }: { scene: string }) {
  const now = useAgentClock();
  const devices = reviewDevices()
    .filter((d) => d.hardware.startsWith("Apple") && d.bindings.some((b) => b.project === "iota"))
    .map((d, index) => ({ ...d, id: `00000000-0000-4000-8000-00000000000${index + 1}` }));
  const agents: AgentInfo[] = devices.map((d, index) => ({
    deviceId: d.id,
    lastSeen: new Date(now).toISOString(),
    snapshot: {
      appRunning: true,
      workerRunning: true,
      idleBnt: {
        state: scene === "setup" ? "install_needed" : index === 0 ? "mining" : "off",
        hashrate: scene !== "setup" && index === 0 ? 2.82 : null,
      },
    },
    recoveryEnabled: false,
    logsEnabled: false,
    pending: null,
    latestCommand: null,
  }));
  return (
    <>
      <ReviewLabel />
      <Dashboard
        previewIdleMining={
          <IdleBntEntry
            plan={scene === "free" ? "free" : "pro"}
            userId={null}
            devices={devices}
            agents={agents}
            preview={{
              address:
                "2BZVmXsZqZJNdRouv8wipYe9pxYhCK1mx8kyz8Hauz58ueCLxEvaCkdmu8pWnHZiXa3ASPGnT9VsUcqJKx5az3Yq5HDNe",
              devices: scene === "setup" ? [] : [{ deviceId: devices[0]!.id, threads: 2 }],
            }}
          />
        }
      />
    </>
  );
}
