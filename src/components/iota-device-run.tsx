import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import { agentPhase } from "@/lib/device-agent";
import type { OfficialRun } from "@/lib/iota-run";
import { useLocale } from "./site/locale";
import { IotaPublicRunLabels } from "./iota-public-run-labels";
import { STATUS_META, statusBucket, type DeviceStatus } from "@/lib/device-status";

export function IotaDeviceRun({
  run,
  deviceId,
  miner,
  preview,
  layout = "inline",
}: {
  run?: OfficialRun | null | undefined;
  deviceId?: string | undefined;
  miner?: string | undefined;
  preview?: boolean | undefined;
  layout?: "inline" | "row";
}) {
  const { locale } = useLocale();
  const { agent, query } = useMatchedDeviceAgent(deviceId, miner, preview);
  const queued = !query.isError && !!agent && agentPhase(agent) === "queued";
  const pending = {
    zh: "排队中 · 实际轮次未读到",
    "zh-TW": "排隊中 · 尚未讀取實際輪次",
    en: "Queued · actual run unavailable",
    ja: "待機中 · 実際のラン未取得",
    ko: "대기 중 · 실제 Run 미확인",
  }[locale];
  const selected = agent?.snapshot.appSelectedRun;
  const age = selected ? Date.now() - Date.parse(selected.observedAt) : Infinity;
  const appRun: OfficialRun | null = !query.isError && agent && agent.snapshot.appRunning &&
    Date.now() - Date.parse(agent.lastSeen ?? "") <= 90_000 && age >= 0 && Number.isFinite(age) && selected
      ? { id: selected.id, stale: age > 300_000, kind: "app" } : null;
  return <IotaPublicRunLabels runs={[appRun ?? run]} layout={layout} emptyText={queued ? pending : undefined} preview={!!preview} />;
}

export function IotaRosterStatus({
  miner,
  status,
  onClick,
}: {
  miner: string;
  status: DeviceStatus;
  onClick: () => void;
}) {
  const { locale, t } = useLocale();
  const { agent, query } = useMatchedDeviceAgent(undefined, miner);
  const queued = !query.isError && !!agent && agentPhase(agent) === "queued";
  const meta = STATUS_META[status];
  const text = { zh: "排队中", "zh-TW": "排隊中", en: "Queued", ja: "待機中", ko: "대기 중" }[
    locale
  ];
  return (
    <button
      className={`badge ${queued ? "info" : meta.tone}`}
      data-bucket={queued ? "waiting" : statusBucket(status)}
      onClick={onClick}
    >
      {queued ? text : t(meta.label)}
    </button>
  );
}
