import type { AcurastRewards as Rewards } from "@/lib/acurast-rewards";
import { LANGUAGE_TAG } from "@/lib/site";
import { useLocale } from "./site/locale";
import { localized as l } from "@/lib/product-discovery";
import "./acurast-processors.css";
export const acuCopy = {
  balanceUnavailable: l(["余额暂未读到", "餘額暫未讀到", "Balance unavailable", "잔액 조회 불가", "残高を取得できません"]),
  walletBalance: l(["钱包余额", "錢包餘額", "Wallet balance", "지갑 잔액", "ウォレット残高"]),
  balanceParts: l(["余额构成", "餘額組成", "Balance breakdown", "잔액 구성", "残高の内訳"]),
  free: l(["普通余额", "一般餘額", "Free balance", "일반 잔액", "フリー残高"]),
  reserved: l(["预留金额", "預留金額", "Reserved", "예약 금액", "予約残高"]),
  frozen: l(["冻结限制", "凍結限制", "Frozen amount", "동결 금액", "凍結額"]),
  balanceNote: l([
    "余额为普通余额与预留金额之和；冻结金额不重复相加。累计奖励是历史到账记录，不代表现在还剩多少钱。",
    "餘額為一般餘額與預留金額之和，凍結額不重複加總。累計獎勵是歷史到帳紀錄，非目前餘額。",
    "Balance is free plus reserved; frozen amounts are not added again. Cumulative rewards record past payouts, not the funds currently held.",
    "잔액은 일반 잔액과 예약 금액의 합계입니다. 동결액은 다시 더하지 않습니다. 누적 보상은 과거 지급 기록으로 현재 잔액과 다릅니다.",
    "残高はフリー残高と予約残高の合計。凍結額は重複加算しません。累計報酬は過去の支払い記録で、現在の残高ではありません。",
  ]),
  addresses: l(["已保存地址", "已儲存地址", "Saved addresses", "저장된 주소", "保存済みアドレス"]),
  addAddress: l(["添加地址", "新增地址", "Add address", "주소 추가", "アドレス追加"]),
  basisLabel: l(["统计口径", "統計口徑", "How rewards are counted", "집계 기준", "集計方法"]),
  title: l([
    "ACU 已到账奖励",
    "ACU 已到帳獎勵",
    "ACU rewards received",
    "수령한 ACU 보상",
    "受取済みACU報酬",
  ]),
  today: l(["今日到账", "今日到帳", "Received today", "오늘 수령", "本日の受取"]),
  yesterday: l(["昨日到账", "昨日到帳", "Received yesterday", "어제 수령", "昨日の受取"]),
  cumulative: l(["累计奖励", "累計獎勵", "Total rewards received", "누적 보상", "累計報酬"]),
  manager: l(["管理身份", "管理身分", "Manager", "관리 ID", "管理ID"]),
  scope: l([
    "同一管理身份下设备合计，不是单台收益。总览只计算一次。",
    "同一管理身分下裝置合計，非單台收益。總覽僅計算一次。",
    "Combined across this manager’s processors, not per-device income. Counted once in Overview.",
    "관리 ID에 속한 기기의 합계이며 기기별 수익이 아닙니다. 개요에서 한 번만 합산합니다.",
    "同じ管理IDの全端末の合計です。端末単体の収益ではなく、概要では一度だけ集計します。",
  ]),
  basis: l([
    "按北京时间到账日期统计。包含链上算力奖励及直接到账的奖励加成；不含另行领取的质押、委托奖励或迁移代币。",
    "按北京時間到帳日期統計。含鏈上算力獎勵及直接到帳加成；不含另行領取的質押、委託獎勵或遷移代幣。",
    "Grouped by payout date in UTC+8. Includes compute payouts and directly paid bonuses; excludes separate stake/delegation withdrawals and migration tokens.",
    "UTC+8 지급일 기준입니다. 연산 보상과 직접 지급 보너스를 포함하며 별도 스테이킹·위임 인출과 마이그레이션 토큰은 제외합니다.",
    "UTC+8の入金日で集計。計算報酬と直接支払いのボーナスを含み、別途受け取るステーキング・委任報酬と移行トークンは除外します。",
  ]),
  unavailable: l([
    "奖励暂未读到，请稍后刷新",
    "獎勵暫未讀到，請稍後重新整理",
    "Rewards unavailable; try refreshing later",
    "보상을 읽지 못했습니다. 나중에 새로고침하세요",
    "報酬を取得できません。後で更新してください",
  ]),
  historyMissing: l([
    "历史记录暂不可用，未计为零",
    "歷史紀錄暫不可用，未計為零",
    "History unavailable; not treated as zero",
    "이력 조회 불가 · 0으로 처리하지 않음",
    "履歴取得不可・ゼロとして扱いません",
  ]),
  older: l(["较早数据", "較早資料", "Older data", "이전 데이터", "過去のデータ"]),
};
export function AcurastRewards({
  balances,
  rewards,
  stale = false,
}: {
  balances?: import("@/lib/acurast-rewards").AcurastBalance[] | undefined;
  rewards?: Rewards | undefined;
  stale?: boolean;
}) {
  const { locale } = useLocale(),
    nf = new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: 8 });
  const date = (time: number) =>
    new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
      timeZone: "Asia/Shanghai",
      month: "2-digit",
      day: "2-digit",
    }).format(time);
  return (
    <section className="acu-rewards" aria-label={acuCopy.title[locale]}>
      {!balances?.length && <div className="acu-wallet"><span>{acuCopy.walletBalance[locale]}</span><strong>— <small>ACU</small></strong><p className="compute-caption">{acuCopy.balanceUnavailable[locale]}</p></div>}
      {balances?.map((b) => (
        <div className="acu-wallet" key={b.address}>
          <span>{acuCopy.walletBalance[locale]}</span>
          <strong title={`${b.total} ACU`}>
            {nf.format(Number(b.total))} <small>ACU</small>
          </strong>
          <details>
            <summary>{acuCopy.balanceParts[locale]}</summary>
            <p className="compute-caption">{acuCopy.balanceNote[locale]}</p>
            <dl>
              {(["free", "reserved", "frozen"] as const).map((k) => (
                <div key={k}>
                  <dt>{acuCopy[k][locale]}</dt>
                  <dd>{b[k]} ACU</dd>
                </div>
              ))}
            </dl>
            <code>{b.address}</code>
          </details>
        </div>
      ))}
      <header>
        <h3>{acuCopy.title[locale]}</h3>
        {stale && <small>{acuCopy.older[locale]}</small>}
      </header>
      {!rewards ? (
        <p role="status">{acuCopy.unavailable[locale]}</p>
      ) : (
        rewards.managers.map((m) => (
          <div key={m.id}>
            <p className="acu-manager">
              {acuCopy.manager[locale]} #{m.id} · UTC+8
            </p>
            <dl className="acu-reward-grid">
              {(["yesterday", "today", "cumulative"] as const).map((period) => (
                <div key={period}>
                  <dt>
                    {acuCopy[period][locale]}{" "}
                    {period !== "cumulative" && (
                      <small>
                        {date(rewards.dayStart - (period === "yesterday" ? 86400000 : 0))}
                      </small>
                    )}
                  </dt>
                  <dd title={m[period] === null ? undefined : `${m[period]} ACU`}>
                    {m[period] === null
                      ? "—"
                      : Number(m[period]) > 0 && Number(m[period]) < 0.00000001
                        ? m[period]
                        : nf.format(Number(m[period]))}{" "}
                    <small>ACU</small>
                  </dd>
                </div>
              ))}
            </dl>
            {(m.today === null || m.yesterday === null) && (
              <p className="compute-caption">{acuCopy.historyMissing[locale]}</p>
            )}
          </div>
        ))
      )}
      <details className="acu-basis">
        <summary>{acuCopy.basisLabel[locale]}</summary>
        <p className="compute-caption">
          {acuCopy.scope[locale]} {acuCopy.basis[locale]}
        </p>
      </details>
    </section>
  );
}
