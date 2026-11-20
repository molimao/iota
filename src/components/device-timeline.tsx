import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDeviceTimeline } from "@/lib/device-agent.functions";
import type { DeviceTimelinePoint } from "@/lib/device-agent";
import { deviceTimeline, type TimelineEvent } from "@/lib/device-timeline";
import { agentReasonCopy } from "@/lib/agent-reason";
import { localized as l } from "@/lib/product-discovery";
import { LANGUAGE_TAG, type SiteLocale } from "@/lib/site";
import { agentHistorySummary } from "./agent-insight-copy";
import { idleMiningCopy } from "./idle-bnt";
import { idleXdsCopy } from "./idle-xds";
import { useLocale } from "./site/locale";

export const timelineCopy = {
  title: l(["运行时间线", "運行時間線", "Activity timeline", "활동 타임라인", "稼働タイムライン"]),
  description: l(["最近 24 小时 · 约每 5 分钟记录一次", "最近 24 小時 · 約每 5 分鐘記錄一次", "Last 24 hours · sampled about every 5 minutes", "최근 24시간 · 약 5분 간격으로 기록", "直近24時間・約5分ごとに記録"]),
  empty: l(["暂无记录。设备上报后会出现在这里。", "暫無紀錄。裝置回報後會顯示在這裡。", "No activity recorded yet. Updates will appear here.", "아직 기록이 없습니다. 기기에서 보고하면 여기에 표시됩니다.", "記録がありません。端末からの報告がここに表示されます。"]),
  loading: l(["读取记录中…", "正在讀取紀錄…", "Loading activity…", "활동 읽는 중…", "記録を読み込み中…"]),
  retry: l(["重试", "重試", "Try again", "다시 시도", "再試行"]),
  error: l(["暂时无法读取运行记录。", "暫時無法讀取運行紀錄。", "Could not load activity.", "활동 기록을 읽지 못했습니다.", "稼働記録を取得できませんでした。"]),
  gap: l(["上报恢复 · 中间缺少记录", "回報恢復 · 中途缺少紀錄", "Reporting resumed · gap in records", "보고 재개 · 중간 기록 없음", "報告再開・途中の記録がありません"]),
  requeued: l(["重新排队", "重新排隊", "Queued again", "다시 대기열에 진입", "再び待機列へ"]),
  resumed: l(["恢复训练", "恢復訓練", "Training resumed", "학습 재개", "学習を再開"]),
  kicked: l(["被移出训练", "被移出訓練", "Removed from training", "학습에서 제외됨", "学習から除外"]),
  bnt: l(["开始挖 BNT", "開始挖 BNT", "BNT mining started", "BNT 채굴 시작", "BNT 採掘を開始"]),
  xds: l(["开始挖 XDS", "開始挖 XDS", "XDS mining started", "XDS 채굴 시작", "XDS 採掘を開始"]),
  setup: l(["尚未配置", "尚未設定", "Not set up", "설정되지 않음", "未設定"]),
};

function eventLabel(event: TimelineEvent, locale: SiteLocale) {
  if (event.project === null) return timelineCopy.gap[locale];
  if (event.project === "iota") {
    const label = event.state === "requeued" || event.state === "resumed"
      ? timelineCopy[event.state][locale]
      : event.reason?.code === "kicked" ? timelineCopy.kicked[locale]
      : event.reason ? agentReasonCopy[event.reason.code][locale]
      : agentHistorySummary[event.state][locale];
    return event.position ? `${label} · #${event.position}` : label;
  }
  if (event.state === "mining") {
    const label = event.started
      ? timelineCopy[event.project][locale]
      : event.project === "xds" ? idleXdsCopy.mining[locale] : idleMiningCopy.states.mining[locale];
    return label + (event.hashrate === null
      ? "" : ` · ${event.hashrate.toLocaleString(LANGUAGE_TAG[locale], { maximumFractionDigits: 2 })} H/s`);
  }
  if (event.state === "setup") return timelineCopy.setup[locale];
  if (event.project === "xds" && (event.state === "busy" || event.state === "starting"))
    return idleXdsCopy[event.state][locale];
  return idleMiningCopy.states[event.state][locale];
}

export function DeviceTimeline({ deviceId, userId, hasIota, preview }: {
  deviceId: string;
  userId: string | null;
  hasIota: boolean;
  preview: boolean;
}) {
  const { locale } = useLocale();
  const read = useServerFn(getDeviceTimeline);
  const query = useQuery({
    queryKey: ["device-timeline", userId, deviceId],
    queryFn: () => read({ data: { deviceId } }),
    enabled: !preview && !!userId,
    refetchInterval: 60000,
    retry: false,
  });
  const events = deviceTimeline(preview ? previewPoints() : query.data ?? [], hasIota);
  const format = new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
    month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  if (!preview && query.isPending) return <p role="status">{timelineCopy.loading[locale]}</p>;
  if (query.isError) return <p role="alert">{timelineCopy.error[locale]} <button className="fleet-outline" onClick={() => void query.refetch()}>{timelineCopy.retry[locale]}</button></p>;
  if (!events.length) return <p>{timelineCopy.empty[locale]}</p>;
  return <ol className="device-timeline">
    {events.map((event) =>
      <li key={`${event.at}:${event.project}`} data-project={event.project ?? "gap"} data-state={event.state}>
        <time dateTime={event.at}>{format.format(new Date(event.at))}</time>
        {event.project && <span className="device-timeline-project">{event.project.toUpperCase()}</span>}
        <strong>{eventLabel(event, locale)}</strong>
      </li>
    )}
  </ol>;
}

function previewPoints(): DeviceTimelinePoint[] {
  const now = Date.now();
  return Array.from({ length: 7 }, (_, i) => {
    const sampledAt = new Date(now - (7 - i) * 300000).toISOString();
    return {
      sampledAt,
      snapshot: {
        appRunning: true, workerRunning: true,
        queue: i >= 2 && i <= 5 ? { position: 300 - i * 40, observedAt: sampledAt } : null,
        trainingState: i === 0 || i === 6 ? { phase: "training", status: "forward", observedAt: sampledAt } : null,
        reason: i === 1 ? { code: "kicked", observedAt: sampledAt } : null,
        idleBnt: { state: i === 2 ? "starting" : i >= 3 && i <= 5 ? "mining" : "priority", hashrate: i >= 3 && i <= 5 ? 4.82 : null },
        idleXds: { state: i === 3 ? "starting" : i >= 4 && i <= 5 ? "mining" : "priority", hashrate: i >= 4 && i <= 5 ? 327.4 : null },
      },
    };
  });
}
