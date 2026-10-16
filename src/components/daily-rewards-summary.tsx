import {
  formatIota,
  formatUsd,
  hongKongDayStartSeconds,
  iotaUnitsToUsd,
  type Aggregate,
} from "@/lib/earnings";
import { localized } from "@/lib/product-discovery";
import { LANGUAGE_TAG } from "@/lib/site";
import { useLocale } from "./site/locale";

const copy = {
  today: localized(["昨日收益", "昨日收益", "Yesterday's rewards", "어제 보상", "昨日の報酬"]),
  lifetime: localized(["累计收益", "累計收益", "Lifetime rewards", "누적 보상", "累計報酬"]),
  note: localized([
    "按次日记账记录归属 · 北京时间 · 美元按当前报价估算",
    "依次日記帳紀錄歸屬 · 北京時間 · 美元依目前報價估算",
    "Attributed to the day before recording · UTC+8 · USD at the current quote",
    "기록일의 전날 기준 · UTC+8 · 현재 시세 기준 USD 추정",
    "記帳日の前日に帰属 · UTC+8 · 現在の価格による米ドル換算",
  ]),
  stale: localized(["报价较早", "報價較早", "Older quote", "이전 시세", "以前の価格"]),
  partial: localized(["部分数据", "部分資料", "Partial data", "일부 데이터", "一部データ"]),
  missing: localized(["暂未获取", "尚未取得", "Unavailable", "미수집", "未取得"]),
};

export function DailyRewardsSummary({
  today,
  lifetime,
  usdPerIota,
  now = Date.now(),
  priceStale = false,
}: {
  today: Aggregate;
  lifetime: Aggregate;
  usdPerIota: number | null;
  now?: number;
  priceStale?: boolean;
}) {
  const { locale } = useLocale();
  const start = hongKongDayStartSeconds(now) * 1000;
  const date = (at: number) =>
    new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
      timeZone: "Asia/Hong_Kong",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(at);
  return (
    <section className="daily-rewards-summary" aria-label="IOTA">
      <div className="daily-rewards-grid">
        {(
          [
            { key: "today", value: today, at: start - 86400000 },
            { key: "lifetime", value: lifetime, at: null },
          ] as const
        ).map(({ key, value, at }) => {
          const units = value.known ? value.units : null;
          return (
            <section key={key} className={`daily-reward-card ${key}`}>
              <div className="daily-reward-heading">
                <h2>{copy[key][locale]}</h2>
                {at !== null && (
                  <time dateTime={new Date(at + 28800000).toISOString().slice(0, 10)}>
                    {date(at)}
                  </time>
                )}
              </div>
              <strong className="daily-reward-amount">
                {formatIota(units, 8, locale)} <small>IOTA</small>
              </strong>
              <div className="daily-reward-value">
                <span>{formatUsd(iotaUnitsToUsd(units, usdPerIota))} USD</span>
                {value.partial && (
                  <small>
                    {value.known
                      ? `${copy.partial[locale]} · ${value.known}/${value.total}`
                      : copy.missing[locale]}
                  </small>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <div className="daily-reward-footer">
        <span>
          {copy.note[locale]}
          {priceStale ? ` · ${copy.stale[locale]}` : ""}
        </span>
      </div>
    </section>
  );
}
