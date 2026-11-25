import { useMemo } from "react";
import { useLocale } from "./site/locale";
import { localized as l } from "@/lib/product-discovery";
import { poolHashrate } from "@/lib/pool-monitor";
import {
  BNT_HISTORY_WINDOW,
  BNT_SAMPLE_INTERVAL,
  workerHistoryPoints,
  workerSparkline,
  type WorkerSample,
} from "@/lib/bnt-worker-history";
const copy = {
  samples: l(["次采样", "次取樣", "samples", "표본", "サンプル"]),
  title: l(["24 小时算力", "24 小時算力", "24h hashrate", "24시간 해시레이트", "24時間の算力"]),
  collecting: l([
    "采样积累中",
    "取樣累積中",
    "Collecting samples",
    "표본 수집 중",
    "サンプルを収集中",
  ]),
  empty: l(["尚无采样记录", "尚無取樣紀錄", "No samples yet", "아직 표본 없음", "サンプル未取得"]),
  loading: l([
    "读取采样中…",
    "讀取取樣中…",
    "Loading samples…",
    "표본 로딩 중…",
    "サンプル取得中…",
  ]),
  unavailable: l([
    "采样暂不可用",
    "取樣暫不可用",
    "Samples unavailable",
    "표본 사용 불가",
    "サンプルを取得できません",
  ]),
  save: l([
    "保存地址后记录趋势",
    "儲存地址後記錄趨勢",
    "Save address to record history",
    "주소 저장 후 기록",
    "アドレス保存後に記録",
  ]),
  login: l([
    "登录并保存地址后记录",
    "登入並儲存地址後記錄",
    "Sign in and save to record history",
    "로그인·주소 저장 후 기록",
    "ログインして保存後に記録",
  ]),
  note: l([
    "已保存地址每 5 分钟自动采样。图表显示最近 24 小时，缺采时段留空。",
    "已儲存地址每 5 分鐘自動取樣。圖表顯示最近 24 小時，缺少紀錄的時段留白。",
    "Saved addresses are sampled every 5 minutes. Charts show the last 24 hours, with gaps where readings are missing.",
    "저장한 주소는 5분마다 자동으로 수집합니다. 차트는 최근 24시간을 표시하며, 기록이 없는 구간은 비워 둡니다.",
    "保存したアドレスは5分ごとに自動計測します。グラフは直近24時間を表示し、記録のない区間は空白になります。",
  ]),
};
export function WorkerSamplingNote() {
  const { locale } = useLocale();
  return <p className="bnt-worker-sampling-note">{copy.note[locale]}</p>;
}
export function BntWorkerSparkline({
  samples = [],
  name,
  rate,
  preview = false,
  saved,
  signedIn,
  pending = false,
  error = false,
}: {
  samples?: WorkerSample[];
  name: string;
  rate: number | null;
  preview?: boolean;
  saved: boolean;
  signedIn: boolean;
  pending?: boolean;
  error?: boolean;
}) {
  const { locale } = useLocale();
  const now = Date.now();
  const demo = useMemo(
    () => {
      const latest = Math.floor(Date.now() / BNT_SAMPLE_INTERVAL) * BNT_SAMPLE_INTERVAL;
      const size = BNT_HISTORY_WINDOW / BNT_SAMPLE_INTERVAL;
      return Array.from({ length: size }, (_, i) => ({
        at: latest - (size - 1 - i) * BNT_SAMPLE_INTERVAL,
        hashrate:
          rate == null || (i >= 63 && i < 94) || (i >= 161 && i < 181)
            ? null
            : rate === 0
              ? 0
              : Math.max(
                  0,
                  rate *
                    (1 +
                      Math.sin(
                        i * 0.14 + ([...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 11),
                      ) *
                        0.2),
                ),
      }));
    },
    [name, rate],
  );
  const points = preview ? demo : workerHistoryPoints(samples, name, now);
  const segments = workerSparkline(points, now),
    known = points.filter((p) => p.hashrate !== null),
    last = known.at(-1);
  const time = (at: number) =>
    new Intl.DateTimeFormat(locale, {
      timeZone: "Asia/Hong_Kong",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(at);
  const status =
    !signedIn && !preview
      ? copy.login[locale]
      : !saved && !preview
        ? copy.save[locale]
        : pending
          ? copy.loading[locale]
          : error
            ? copy.unavailable[locale]
            : !known.length
              ? copy.empty[locale]
              : known.length === 1
                ? copy.collecting[locale]
                : null;
  return (
    <div className="bnt-worker-sparkline">
      <div className="bnt-worker-sparkline-label">
        <span>{copy.title[locale]}</span>
        <small>{preview ? "DEMO · " : ""}{known.length} {copy.samples[locale]}</small>
      </div>
      {known.length > 0 ? (
        <svg
          viewBox="0 0 200 46"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${name} · ${copy.title[locale]}`}
        >
          <title>{`${name} · ${last ? `${time(last.at)} · ${poolHashrate("bnt", last.hashrate)}` : ""}`}</title>
          {segments.map((segment, i) => (
            <g key={i}>
              {segment.length > 1 && (
                <path
                  d={segment
                    .map((p, j) => `${j ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
                    .join(" ")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {segment.length === 1 && (
                <circle cx={segment[0]!.x} cy={segment[0]!.y} r="2.5" fill="currentColor" />
              )}
            </g>
          ))}
        </svg>
      ) : (
        <div className="bnt-worker-sparkline-empty" />
      )}
      {status && <p role={error ? "status" : undefined}>{status}</p>}
      {known.length > 0 && (
        <p>
          {time(now - BNT_HISTORY_WINDOW)} — {time(now)}
        </p>
      )}
    </div>
  );
}
