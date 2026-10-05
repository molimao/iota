import { Layers, Monitor } from "lucide-react";
import type { SiteLocale } from "@/lib/site";
import { projectPath, type ProjectId } from "@/lib/projects";
import { useLocale } from "./site/locale";

const labels = {
  deviceWorkflow: [
    "添加设备后，用卡片上的“添加项目”关联同一台机器运行的其他项目。",
    "Add a device, then use Add project on its card to link other projects running on that machine.",
    "新增設備後，用卡片上的「新增項目」關聯同一台機器執行的其他專案。",
    "기기를 추가한 뒤 카드의 프로젝트 추가로 같은 기기에서 실행하는 다른 프로젝트를 연결하세요.",
    "デバイスを追加したら、カードの「プロジェクトを追加」で同じ機器の他のプロジェクトを関連付けます。",
  ],
  allDevices: ["所有设备", "All devices", "所有設備", "모든 기기", "すべてのデバイス"],
  projects: ["按项目", "By project", "按專案", "프로젝트별", "プロジェクト別"],
  devices: ["按设备", "By device", "按設備", "기기별", "デバイス別"],
  projectDescription: [
    "选一个项目，查看该项目的网络、状态和收益记录。",
    "Choose a project to see its network, activity and reward records.",
    "選擇一個專案，查看該專案的網路、狀態與收益紀錄。",
    "프로젝트 하나를 선택해 네트워크, 상태와 보상 기록을 확인하세요.",
    "プロジェクトを選び、そのネットワーク・状態・報酬記録を確認します。",
  ],
  deviceDescription: [
    "一张卡片对应一台设备，集中查看你为它关联的各项目状态与收益。",
    "One card per device, with activity and rewards from the projects you link to it.",
    "一張卡片對應一台設備，集中查看你為它關聯的各專案狀態與收益。",
    "카드 하나가 기기 한 대를 나타냅니다. 직접 연결한 프로젝트들의 상태와 수익을 함께 확인하세요.",
    "1枚のカードが1台のデバイスです。関連付けた各プロジェクトの状態と収益をまとめて確認します。",
  ],
  navigation: ["查看方式", "Viewing mode", "查看方式", "보기 방식", "表示方法"],
  filter: ["筛选设备", "Filter devices", "篩選設備", "기기 필터", "デバイスを絞り込む"],
  filterHint: [
    "只显示关联 {project} 的设备；卡片仍保留该设备的其他项目。",
    "Only devices linked to {project}; their other projects stay on each card.",
    "只顯示關聯 {project} 的設備；卡片仍保留該設備的其他專案。",
    "{project}에 연결된 기기만 표시합니다. 카드의 다른 프로젝트는 그대로 유지됩니다.",
    "{project}に関連付けたデバイスのみ表示します。カードには他のプロジェクトも残ります。",
  ],
  iotaMonitor: ["IOTA 监控", "IOTA monitor", "IOTA 監控", "IOTA 모니터", "IOTAモニター"],
  projectRecords: [
    "查看 {project} 项目",
    "View {project} project",
    "查看 {project} 專案",
    "{project} 프로젝트 보기",
    "{project}を確認",
  ],
} as const;
export function monitorViewCopy(locale: SiteLocale) {
  const index = { zh: 0, en: 1, "zh-TW": 2, ko: 3, ja: 4 }[locale];
  return Object.fromEntries(Object.entries(labels).map(([key, text]) => [key, text[index]])) as {
    [K in keyof typeof labels]: string;
  };
}
export function MonitoringViews({
  current,
  project,
}: {
  current: "projects" | "devices";
  project?: ProjectId | undefined;
}) {
  const { locale } = useLocale(),
    c = monitorViewCopy(locale);
  return (
    <div className="header-view-switch" role="navigation" aria-label={c.navigation}>
      <a
        href={project ? projectPath(locale, project) : `/${locale}/projects`}
        aria-current={current === "projects" ? "page" : undefined}
        title={c.projectDescription}
      >
        <Layers size={15} />
        <span>{c.projects}</span>
      </a>
      <a
        href={`/${locale}/devices${project ? `?project=${project}` : ""}`}
        aria-current={current === "devices" ? "page" : undefined}
        title={c.deviceDescription}
      >
        <Monitor size={15} />
        <span>{c.devices}</span>
      </a>
    </div>
  );
}
