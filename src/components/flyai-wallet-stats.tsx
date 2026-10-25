import type { FlyaiWalletStats as Stats } from "@/lib/flyai";
import { useLocale } from "./site/locale";
import { LANGUAGE_TAG } from "@/lib/site";
import { localized as l } from "@/lib/product-discovery";
import "./flyai-wallet-stats.css";
const copy = {
  points: l(["本月积分", "本月積分", "Monthly points", "월간 포인트", "月間ポイント"]),
  share: l([
    "公开积分份额",
    "公開積分份額",
    "Share of public points",
    "공개 포인트 비중",
    "公開ポイント比率",
  ]),
  rank: l(["公开排名", "公開排名", "Public rank", "공개 순위", "公開順位"]),
  basis: l(["积分说明", "積分說明", "About these points", "포인트 안내", "ポイントについて"]),
  note: l([
    "同一钱包的月度积分，多台设备共用时只汇总一次。积分不能用于判断设备在线，也没有可核实的美元兑换价格。",
    "同一錢包的月度積分，多台設備共用時僅彙總一次。積分無法判斷設備在線，也沒有可核實的美元兌換價格。",
    "Monthly points belong to the wallet and are counted once across shared devices. Points do not establish device uptime and have no verified USD conversion.",
    "월간 포인트는 지갑 기준이며 여러 기기가 공유해도 한 번만 집계합니다. 기기 온라인 여부나 검증된 달러 환산액을 나타내지 않습니다.",
    "月間ポイントはウォレット単位で、複数端末で共有しても一度だけ集計します。端末の稼働状況や確認済みの米ドル換算額を示すものではありません。",
  ]),
  stale: l(["较早数据", "較早資料", "Older data", "이전 데이터", "過去のデータ"]),
};
export function FlyaiWalletStats({
  data,
  stale = false,
  compact = false,
}: {
  data: Stats;
  stale?: boolean;
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const nf = new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: 2 });
  const pct = new Intl.NumberFormat(LANGUAGE_TAG[locale], {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(data.share);
  return (
    <section className="fly-wallet-stats" data-compact={compact} aria-label={copy.points[locale]}>
      <header>
        <span>
          {copy.points[locale]} · {data.month}
        </span>
        {stale && <small>{copy.stale[locale]}</small>}
      </header>
      <strong className="fly-points" title={String(data.points)}>
        {nf.format(data.points)}
      </strong>
      <dl>
        <div>
          <dt>{copy.rank[locale]}</dt>
          <dd>
            #{data.rank} <small>/ {data.wallets}</small>
          </dd>
        </div>
        <div>
          <dt>{copy.share[locale]}</dt>
          <dd>{pct}</dd>
        </div>
      </dl>
      <div
        className="fly-share-track"
        role="meter"
        aria-label={copy.share[locale]}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={data.share * 100}
        aria-valuetext={pct}
      >
        <span style={{ width: `${Math.max(0, Math.min(100, data.share * 100))}%` }} />
      </div>
      {!compact && (
        <details>
          <summary>{copy.basis[locale]}</summary>
          <p>{copy.note[locale]}</p>
        </details>
      )}
    </section>
  );
}
