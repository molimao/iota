import { useMemo } from "react";
import { useLocale } from "./site/locale";
import { localized as l } from "@/lib/product-discovery";
import { poolHashrate } from "@/lib/pool-monitor";
import { workerHistoryPoints, workerSparkline, type WorkerSample } from "@/lib/bnt-worker-history";
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
    "查看此页面时每 5 分钟采样，采样保存到账号，仅显示最近 24 小时；未采集的时段留空。",
    "查看此頁面時每 5 分鐘取樣，取樣儲存至帳號，僅顯示最近 24 小時；未取樣時段留空。",
    "Sampled every 5 minutes while viewing this page; samples are saved to your account and only the latest 24 hours are shown. Unobserved periods stay blank.",
    "페이지를 열어 둔 동안 5분마다 수집하며 최근 24시간을 계정에 저장합니다. 미수집 구간은 비워 둡니다.",
    "ページ表示中は5分ごとに取得し、直近24時間をアカウントに保存します。未取得の期間は空白です。",
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
  sampling = true,
}: {
  samples?: WorkerSample[];
  name: string;
  rate: number | null;
  preview?: boolean;
  saved: boolean;
  signedIn: boolean;
  pending?: boolean;
  error?: boolean;
  sampling?: boolean;
}) {
  const { locale } = useLocale();
  const demo = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        at: Date.now() - (24 - i) * 300000,
        hashrate:
          rate == null
            ? null
            : rate === 0
              ? 0
              : Math.max(
                  0,
                  rate *
                    (1 +
                      Math.sin(
                        i * 0.6 + ([...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 11),
                      ) *
                        0.2),
                ),
      })),
    [name, rate],
  );
  const points = preview ? demo : workerHistoryPoints(samples, name);
  const segments = workerSparkline(points),
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
        <small>{preview ? "DEMO" : `${known.length} ${copy.samples[locale]}`}</small>
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
      {known.length > 1 && last && (
        <p>
          {time(known[0]!.at)} — {time(last.at)}
        </p>
      )}
      {!sampling && known.length > 0 && <p role="status">{copy.unavailable[locale]}</p>}
    </div>
  );
}
