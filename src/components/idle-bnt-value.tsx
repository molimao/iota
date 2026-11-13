import { useQuery } from "@tanstack/react-query";
import { getIdleBntActivity } from "@/lib/idle-bnt.functions";
import { BNT_REFERENCE_USD } from "@/lib/reference-prices";
import { localized as l } from "@/lib/product-discovery";
import { useLocale } from "./site/locale";
const copy = {
  time: l([
    "今日挖矿时长（采样）",
    "今日挖礦時長（取樣）",
    "Mining observed today",
    "오늘 관측된 채굴",
    "本日観測された採掘",
  ]),
  unit: l(["小时", "小時", "hours", "시간", "時間"]),
  minutes: l(["分钟", "分鐘", "min", "분", "分"]),
  collecting: l([
    "正在积累采样",
    "正在累積取樣",
    "Collecting observations",
    "관측 데이터 수집 중",
    "観測データを蓄積中",
  ]),
  wallet: l([
    "钱包近24小时到账",
    "錢包近24小時到帳",
    "Wallet payouts · last 24h",
    "지갑 입금 · 최근 24시간",
    "ウォレット入金・直近24時間",
  ]),
  walletNote: l([
    "含此钱包下全部矿工",
    "含此錢包下全部礦工",
    "Includes all miners using this wallet",
    "이 지갑의 모든 채굴기 포함",
    "このウォレットの全マイナーを含みます",
  ]),
  missing: l([
    "暂未取得到账记录",
    "暫未取得到帳紀錄",
    "Payout records unavailable",
    "입금 기록을 가져오지 못했습니다",
    "入金記録を取得できません",
  ]),
  reference: l(["参考估值", "參考估值", "Reference value", "참고 평가액", "参考評価額"]),
  combined: l([
    "多台合计 · UTC+8",
    "多台合計 · UTC+8",
    "All devices · UTC+8",
    "전체 기기 · UTC+8",
    "全端末の合計 · UTC+8",
  ]),
  details: l(["统计说明", "統計說明", "How this is measured", "집계 방식", "集計方法"]),
  scope: l([
    "时长按香港时间今日0点起的相邻采样累计，多台设备合计；中断和缺失时段不推算。钱包到账含手动矿工，不等于闲时挖矿单独收益，也不包含余额。",
    "時長按香港時間今日0點起的相鄰取樣累計，多台裝置合計；中斷和缺失時段不推算。錢包到帳含手動礦工，不等於閒時挖礦單獨收益，也不包含餘額。",
    "Time totals adjacent observations since midnight in Hong Kong across your devices; gaps are excluded. Wallet payouts include manually run miners, are not attributable solely to idle mining, and exclude balances.",
    "시간은 홍콩 시간 자정 이후 기기의 인접 관측 구간을 합산하며 누락 구간은 제외합니다. 지갑 입금에는 수동 채굴기도 포함되며 유휴 채굴만의 수익이 아닙니다. 잔액은 제외됩니다.",
    "香港時間0時以降の隣接する観測区間を端末ごとに合計し、欠測区間は除外します。入金は手動マイナーも含むため、アイドル採掘だけの収益ではありません。残高は含みません。",
  ]),
  retry: l(["重试", "重試", "Retry", "재시도", "再試行"]),
  error: l([
    "暂时读不到使用记录",
    "暫時讀不到使用紀錄",
    "Usage records are temporarily unavailable",
    "사용 기록을 가져오지 못했습니다",
    "利用記録を取得できません",
  ]),
};
export function IdleBntValue({
  userId,
  preview = false,
}: {
  userId: string | null;
  preview?: boolean;
}) {
  const { locale } = useLocale();
  const query = useQuery({
    queryKey: ["idle-bnt-activity", userId],
    queryFn: () => getIdleBntActivity(),
    enabled: !!userId && !preview,
    refetchInterval: 60000,
    retry: false,
  });
  const data = preview ? { minutes: 96, walletPaid24h: 1.28 } : query.data;
  if (!preview && !userId) return null;
  return (
    <section className="idle-bnt-value" aria-busy={query.isPending && !preview}>
      <div className="idle-bnt-value-grid">
        <div>
          <span>{copy.time[locale]}</span>
          <strong>
            {data?.minutes == null
              ? "—"
              : (data.minutes < 60 ? Math.floor(data.minutes) : data.minutes / 60).toLocaleString(
                  locale,
                  { maximumFractionDigits: 1 },
                )}
            <small>
              {data?.minutes != null ? (data.minutes < 60 ? copy.minutes : copy.unit)[locale] : ""}
            </small>
          </strong>
          <small>{data?.minutes == null ? copy.collecting[locale] : copy.combined[locale]}</small>
        </div>
        <div>
          <span>{copy.wallet[locale]}</span>
          <strong>
            {data?.walletPaid24h == null
              ? "—"
              : data.walletPaid24h.toLocaleString(locale, { maximumFractionDigits: 8 })}
            <small>BNT</small>
          </strong>
          <small>
            {data?.walletPaid24h == null
              ? copy.missing[locale]
              : `$${(data.walletPaid24h * BNT_REFERENCE_USD).toFixed(2)} · ${copy.reference[locale]} ($${BNT_REFERENCE_USD}/BNT)`}
          </small>
          <small>{copy.walletNote[locale]}</small>
        </div>
      </div>
      {query.isError && (
        <p role="alert">
          {copy.error[locale]}{" "}
          <button type="button" className="fleet-outline" onClick={() => void query.refetch()}>
            {copy.retry[locale]}
          </button>
        </p>
      )}
      <details>
        <summary>{copy.details[locale]}</summary>
        <p>{copy.scope[locale]}</p>
      </details>
    </section>
  );
}
