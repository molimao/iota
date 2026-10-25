import { useAgentClock } from "@/hooks/use-agent-clock";
import { iotaDeviceDisplay } from "@/lib/iota-device-display";
import { insightCopy } from "./agent-insight-copy";
import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import { agentOnline, agentPhase } from "@/lib/device-agent";
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
  const clock = useAgentClock(),
    now = clock || Date.now();
  const { agent, query } = useMatchedDeviceAgent(deviceId, miner, preview);
  const queued = !query.isError && !!agent && agentPhase(agent, now) === "queued";
  const pending = {
    zh: "排队中 · 实际轮次未读到",
    "zh-TW": "排隊中 · 尚未讀取實際輪次",
    en: "Queued · actual run unavailable",
    ja: "待機中 · 実際のラン未取得",
    ko: "대기 중 · 실제 Run 미확인",
  }[locale];
  const selected = agent?.snapshot.appSelectedRun;
  const age = selected ? now - Date.parse(selected.observedAt) : Infinity;
  const appRun: OfficialRun | null =
    !query.isError &&
    agent &&
    agent.snapshot.appRunning &&
    agentOnline(agent.lastSeen, now) &&
    age >= 0 &&
    Number.isFinite(age) &&
    selected
      ? { id: selected.id, stale: age > 300_000, kind: "app" }
      : null;
  return (
    <IotaPublicRunLabels
      runs={[appRun ?? run]}
      layout={layout}
      emptyText={queued ? pending : undefined}
      preview={!!preview}
    />
  );
}

export function IotaRosterStatus({
  miner,
  status,
  onClick,
  deviceId,
  preview = false,
}: {
  miner?: string;
  deviceId?: string;
  status: DeviceStatus;
  onClick?: () => void;
  preview?: boolean;
}) {
  const { locale, t } = useLocale();
  const now = useAgentClock();
  const { agent, query } = useMatchedDeviceAgent(deviceId, miner, preview);
  const display = iotaDeviceDisplay(status, agent, query.isError, now || Date.now());
  const label = display.phase ? insightCopy[display.phase][locale] : t(STATUS_META[status].label);
  const rosterNote = {
    zh: "官方当前训练名单未收录此 ID。",
    "zh-TW": "官方目前訓練名單未收錄此 ID。",
    en: "This ID is absent from the current public training roster.",
    ko: "현재 공개 학습 명단에 이 ID가 없습니다.",
    ja: "現在の公開学習名簿にこのIDはありません。",
  }[locale];
  const explanation = display.phase
    ? `${status === "not_found" ? rosterNote + " " : ""}${insightCopy[`${display.phase}Help`][locale]}`
    : t(STATUS_META[status].explain);
  const props = {
    className: `badge ${display.tone}`,
    "data-bucket": display.bucket,
    title: explanation,
  };
  return onClick ? (
    <button {...props} onClick={onClick}>
      {label}
    </button>
  ) : (
    <span {...props}>{label}</span>
  );
}
