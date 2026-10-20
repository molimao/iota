import { useId, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale } from "./site/locale";
import { localized as l } from "@/lib/product-discovery";
import { getBntHashrateHistory } from "@/lib/bnt-hashrate.functions";
import { hashrateChartPoints, type BntHashrateRange, type HashratePoint } from "@/lib/bnt-hashrate";
import { poolHashrate } from "@/lib/pool-monitor";
const copy = {
  title: l(["算力趋势", "算力趨勢", "Hashrate trend", "해시레이트 추이", "ハッシュレート推移"]),
  scope: l([
    "收益地址总算力 · bntpool.com",
    "收益地址總算力 · bntpool.com",
    "Total payout-address hashrate · bntpool.com",
    "수익 주소 전체 해시레이트 · bntpool.com",
    "報酬アドレスの合計算力 · bntpool.com",
  ]),
  peak: l(["区间最高", "區間最高", "Period peak", "기간 최고", "期間内の最大"]),
  average: l(["采样均值", "取樣均值", "Sample average", "표본 평균", "サンプル平均"]),
  latest: l(["最新历史记录", "最新歷史紀錄", "Latest history sample", "최신 기록", "最新の履歴"]),
  loading: l([
    "正在读取矿池历史…",
    "正在讀取礦池歷史…",
    "Loading pool history…",
    "풀 기록 로딩 중…",
    "プール履歴を取得中…",
  ]),
  empty: l([
    "矿池暂未返回此时间段的算力记录。",
    "礦池尚未回傳此時段的算力紀錄。",
    "The pool has no hashrate records for this period.",
    "이 기간의 해시레이트 기록이 없습니다.",
    "この期間の算力履歴はありません。",
  ]),
  failed: l([
    "历史数据暂时无法读取，请重试。",
    "歷史資料暫時無法讀取，請重試。",
    "History is temporarily unavailable. Try again.",
    "기록을 불러올 수 없습니다. 다시 시도하세요.",
    "履歴を取得できません。再試行してください。",
  ]),
  stale: l([
    "当前显示缓存的历史数据。",
    "目前顯示快取的歷史資料。",
    "Showing cached history.",
    "캐시된 기록을 표시합니다.",
    "キャッシュ済み履歴を表示しています。",
  ]),
  note: l([
    "矿池历史采样 · 北京时间 · 缺失记录不计为零；此图不代表单台矿机。",
    "礦池歷史取樣 · 北京時間 · 缺漏紀錄不計為零；此圖不代表單台礦機。",
    "Pool history samples · UTC+8 · Missing records are not zero. This is address-wide, not an individual miner.",
    "풀 기록 표본 · UTC+8 · 누락 기록은 0이 아닙니다. 개별 채굴기가 아닌 주소 전체 데이터입니다.",
    "プールの履歴サンプル・UTC+8・欠損はゼロ扱いしません。個別マイナーではなくアドレス全体の算力です。",
  ]),
  single: l([
    "目前只有一条历史记录，暂不能形成趋势。",
    "目前僅有一筆歷史紀錄，尚無法形成趨勢。",
    "Only one history sample is available; a trend needs more data.",
    "기록이 하나뿐이어서 추이를 표시할 수 없습니다.",
    "履歴が1件のため、まだ推移を表示できません。",
  ]),
  retry: l(["重试", "重試", "Retry", "다시 시도", "再試行"]),
};
export function BntHashrateTrend({
  address,
  preview = false,
}: {
  address: string;
  preview?: boolean;
}) {
  const { locale } = useLocale();
  const t = (key: keyof typeof copy) => copy[key][locale];
  const range: BntHashrateRange = "24h";
  const read = useServerFn(getBntHashrateHistory),
    gradient = useId();
  const q = useQuery({
    queryKey: ["bnt-hashrate-history", address, range],
    queryFn: () => read({ data: { address, range } }),
    enabled: !preview,
    staleTime: 120000,
    refetchInterval: 300000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
  const demo = useMemo(
    () =>
      Array.from({ length: 49 }, (_, i) => ({
        at: Date.now() - (48 - i) * (86400000 / 48),
        hashrate: Math.max(0, 39 + Math.sin(i * 0.53) * 9 + Math.cos(i * 0.21) * 5),
      })),
    [],
  );
  const rows: HashratePoint[] = preview ? demo : (q.data?.data ?? []);
  const values = rows.flatMap((r) => (r.hashrate == null ? [] : [r.hashrate]));
  const latest = rows.filter((r) => r.hashrate !== null).at(-1);
  const time = (n: number, full = false) =>
    new Intl.DateTimeFormat(locale, {
      timeZone: "Asia/Hong_Kong",
      ...(full || range !== "24h" ? { month: "2-digit", day: "2-digit" } : {}),
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(n);
  return (
    <section className="bnt-hashrate-trend" aria-label={t("title")}>
      <header>
        <div>
          <h4>{t("title")}</h4>
          <p>{t("scope")}</p>
        </div>
        <span className="bnt-trend-window">24h</span>
      </header>
      {values.length > 0 && (
        <dl className="bnt-trend-stats">
          {[
            [t("latest"), latest?.hashrate],
            [t("average"), values.reduce((a, b) => a + b, 0) / values.length],
            [t("peak"), Math.max(...values)],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <dt>{label}</dt>
              <dd>{poolHashrate("bnt", typeof value === "number" ? value : null)}</dd>
            </div>
          ))}
        </dl>
      )}
      {!preview && q.isPending ? (
        <p role="status">{t("loading")}</p>
      ) : !values.length ? (
        <p role="status">
          {q.isError || q.data?.error ? t("failed") : t("empty")}{" "}
          {(q.isError || q.data?.error) && (
            <button type="button" onClick={() => void q.refetch()}>
              {t("retry")}
            </button>
          )}
        </p>
      ) : values.length === 1 ? (
        <p>
          {t("single")} {latest && time(latest.at, true)}
        </p>
      ) : (
        <div className="bnt-hashrate-chart" role="img" aria-label={`${t("scope")} · ${range}`}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart
              data={hashrateChartPoints(rows)}
              margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#78dfb3" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#78dfb3" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#343a36" />
              <XAxis
                dataKey="at"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v) => time(Number(v))}
                minTickGap={60}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#999", fontSize: 10 }}
              />
              <YAxis
                tickFormatter={(v) => poolHashrate("bnt", Number(v))}
                width={68}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#999", fontSize: 10 }}
              />
              <Tooltip
                labelFormatter={(v) => time(Number(v), true)}
                formatter={(v) => [poolHashrate("bnt", typeof v === "number" ? v : null), "H/s"]}
                contentStyle={{
                  background: "#202522",
                  border: "1px solid #455049",
                  borderRadius: 10,
                  color: "#eee",
                }}
              />
              <Area
                type="linear"
                dataKey="hashrate"
                stroke="#78dfb3"
                fill={`url(#${gradient})`}
                strokeWidth={2}
                connectNulls={false}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      {!preview && (q.data?.stale || (q.isError && values.length > 0)) && (
        <p role="status">{t("stale")}</p>
      )}
      <p className="bnt-trend-note">{t("note")}</p>
    </section>
  );
}
