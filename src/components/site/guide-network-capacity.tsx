import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getOccupancy } from "@/lib/iota.functions";
import { localized as l } from "@/lib/product-discovery";
import { useLocale } from "./locale";
const copy = {
  title: l([
    "现在有多少运行名额？",
    "目前有多少運行名額？",
    "How much run capacity is available?",
    "현재 실행 용량은?",
    "現在の実行容量は？",
  ]),
  free: l(["剩余名额", "剩餘名額", "Free seats", "빈자리", "空席"]),
  total: l(["总容量", "總容量", "Total capacity", "총 용량", "総容量"]),
  loading: l([
    "正在读取官方容量…",
    "正在讀取官方容量…",
    "Reading official capacity…",
    "공식 용량 조회 중…",
    "公式容量を取得中…",
  ]),
  unavailable: l([
    "当前容量无法确认，请稍后重试。",
    "目前無法確認容量，請稍後重試。",
    "Capacity is unavailable. Try again later.",
    "용량을 확인할 수 없습니다. 나중에 다시 시도하세요.",
    "現在の容量は確認できません。後で再試行してください。",
  ]),
  stale: l([
    "显示上次成功读取的容量，请注意时间。",
    "顯示上次成功取得的容量，請留意時間。",
    "Showing the last successful sample; check its timestamp.",
    "마지막 성공 표본입니다. 시각을 확인하세요.",
    "最終成功サンプルです。時刻を確認してください。",
  ]),
  note: l([
    "官方运行容量合计，不是你的可加入名额或等待时长预测；任务条件与资格仍需核对。",
    "官方容量合計，非個人可加入名額或等待預測，仍需核對條件與資格。",
    "Official run-capacity totals are not your eligible seats or an estimated wait. Run conditions and eligibility still apply.",
    "공식 실행 용량 합계는 내 참여 가능 자리나 대기 시간 예측이 아닙니다. 조건·자격을 확인하세요.",
    "公式実行容量の合計は自分の参加可能席や待ち時間予測ではありません。条件・資格を確認してください。",
  ]),
  link: l([
    "查看各任务与来源",
    "查看各任務與來源",
    "Inspect runs and sources",
    "실행·출처 확인",
    "実行と出典を確認",
  ]),
};
export function GuideNetworkCapacity() {
  const { locale } = useLocale();
  const read = useServerFn(getOccupancy);
  const q = useQuery({
    queryKey: ["iota", "occupancy"],
    queryFn: () => read({ data: { force: false } }),
    staleTime: 120000,
    refetchInterval: 120000,
    refetchIntervalInBackground: false,
    retry: false,
  });
  const o = q.data?.occupancy;
  const fetchedAt = q.data?.fetchedAt;
  const sampleStale =
    typeof fetchedAt === "number" &&
    Number.isFinite(fetchedAt) &&
    fetchedAt > 0 &&
    Date.now() - fetchedAt > 5 * 60 * 1000;
  const valid =
    !!o &&
    o.run_ids.length > 0 &&
    o.run_ids.length === o.max_miners.length &&
    o.run_ids.length === o.slots_remaining.length &&
    o.max_miners.every((n) => Number.isFinite(n) && n >= 0) &&
    o.slots_remaining.every((n, i) => Number.isFinite(n) && n >= 0 && n <= o.max_miners[i]!);
  return (
    <section className="guide-network-capacity" aria-label={copy.title[locale]}>
      <header>
        <h2>{copy.title[locale]}</h2>
        <a href={`/${locale}/network`}>{copy.link[locale]} ↗</a>
      </header>
      {valid ? (
        <>
          <dl>
            <div>
              <dt>{copy.free[locale]}</dt>
              <dd>{o.slots_remaining.reduce((a, b) => a + b, 0)}</dd>
            </div>
            <div>
              <dt>{copy.total[locale]}</dt>
              <dd>{o.max_miners.reduce((a, b) => a + b, 0)}</dd>
            </div>
          </dl>
          {q.data?.fetchedAt && (
            <time dateTime={new Date(q.data.fetchedAt).toISOString()}>
              {new Intl.DateTimeFormat(locale, {
                timeZone: "Asia/Hong_Kong",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(q.data.fetchedAt)}{" "}
              · UTC+8
            </time>
          )}
          {q.isError || q.data?.error || sampleStale ? (
            <p role="status">{copy.stale[locale]}</p>
          ) : null}
        </>
      ) : (
        <p role="status">{q.isPending ? copy.loading[locale] : copy.unavailable[locale]}</p>
      )}
      <p>{copy.note[locale]}</p>
    </section>
  );
}
