import type { AcurastRewards as Rewards } from "@/lib/acurast-rewards";
import { LANGUAGE_TAG } from "@/lib/site";
import { useLocale } from "./site/locale";
import { localized as l } from "@/lib/product-discovery";
import "./acurast-processors.css";
export const acuCopy = {
  title: l([
    "ACU 已到账奖励",
    "ACU 已到帳獎勵",
    "ACU rewards received",
    "수령한 ACU 보상",
    "受取済みACU報酬",
  ]),
  today: l(["今日到账", "今日到帳", "Received today", "오늘 수령", "本日の受取"]),
  yesterday: l(["昨日到账", "昨日到帳", "Received yesterday", "어제 수령", "昨日の受取"]),
  cumulative: l(["累计到账", "累計到帳", "Total received", "누적 수령", "累計受取"]),
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
  rewards,
  stale = false,
}: {
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
      <p className="compute-caption">{acuCopy.scope[locale]}</p>
      <details>
        <summary>
          {acuCopy.manager[locale]} · {locale === "zh" ? "统计说明" : "ACU"}
        </summary>
        <p className="compute-caption">{acuCopy.basis[locale]}</p>
        {rewards?.managers.map((m) => (
          <div className="acu-exact" key={m.id}>
            <b>#{m.id}</b>
            {(["yesterday", "today", "cumulative"] as const).map((p) => (
              <p key={p}>
                {acuCopy[p][locale]} · {m[p] ?? "—"} ACU
              </p>
            ))}
          </div>
        ))}
      </details>
    </section>
  );
}
