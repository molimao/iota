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
    zh: "排队中 · 暂无公开轮次",
    "zh-TW": "排隊中 · 暫無公開輪次",
    en: "Queued · no public run yet",
    ja: "待機中 · 公開ラン未確認",
    ko: "대기 중 · 공개 Run 미확인",
  }[locale];
  return <IotaPublicRunLabels runs={[run]} layout={layout} emptyText={queued ? pending : undefined} preview={!!preview} />;
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
