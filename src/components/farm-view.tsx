import { ArrowUpRight } from "lucide-react";

import { useLocale } from "@/components/site/locale";
import type { FarmSummary } from "@/lib/farm";
import { formatCount, formatLoss, formatPct } from "@/lib/format";

const COUNTRY_ZH: Record<string, string> = {
  China: "中国",
  "United States": "美国",
  "Hong Kong": "香港",
  Japan: "日本",
  Canada: "加拿大",
  Germany: "德国",
  Taiwan: "台湾",
  Singapore: "新加坡",
  "United Kingdom": "英国",
  "South Korea": "韩国",
  France: "法国",
  Australia: "澳大利亚",
  India: "印度",
  Russia: "俄罗斯",
  Brazil: "巴西",
  Netherlands: "荷兰",
  Switzerland: "瑞士",
  Sweden: "瑞典",
  Finland: "芬兰",
  Norway: "挪威",
  Poland: "波兰",
  Spain: "西班牙",
  Italy: "意大利",
  Ireland: "爱尔兰",
  Israel: "以色列",
  "United Arab Emirates": "阿联酋",
  Indonesia: "印度尼西亚",
  Vietnam: "越南",
  Thailand: "泰国",
  Turkey: "土耳其",
  Ukraine: "乌克兰",
  Mexico: "墨西哥",
  Argentina: "阿根廷",
  "South Africa": "南非",
  Belgium: "比利时",
  Austria: "奥地利",
  Denmark: "丹麦",
  "Czech Republic": "捷克",
  Romania: "罗马尼亚",
  Lithuania: "立陶宛",
  Malaysia: "马来西亚",
  Philippines: "菲律宾",
  "New Zealand": "新西兰",
  Portugal: "葡萄牙",
  Chile: "智利",
  Kazakhstan: "哈萨克斯坦",
};

function countryName(country: string, en: boolean) {
  return en ? country : COUNTRY_ZH[country] || country;
}

function lossRange(min: number | null, max: number | null) {
  if (min === null) return "—";
  if (max === null || max === min) return formatLoss(min);
  return `${formatLoss(min)} – ${formatLoss(max)}`;
}

/** Tiers that at least one of the visitor's own devices sits in. */
function myTiers(farm: FarmSummary): string[] {
  const tiers = new Set<string>();
  for (const run of farm.runs) {
    if (run.mineCount > 0 && run.tier) tiers.add(run.tier);
  }
  return [...tiers];
}

/**
 * One line on the dashboard. Answers "where am I, is there room" and links
 * out — the full network breakdown lives on its own page.
 */
export function FarmLine({
  farm,
  deviceCount,
  stale = false,
}: {
  farm: FarmSummary;
  deviceCount: number;
  stale?: boolean;
}) {
  const { t, en, locale } = useLocale();
  const mine = myTiers(farm);
  const parts: string[] = [];
  if (deviceCount > 0 && mine.length) {
    parts.push(`${t("你在")} ${mine.join(" / ")}`);
  }
  if (farm.activeMiners !== null && farm.maxMiners !== null) {
    parts.push(
      `${t("全网名额")} ${formatCount(farm.activeMiners, locale)} / ${formatCount(farm.maxMiners, locale)}`,
    );
  }
  if (farm.slotsRemaining !== null) {
    parts.push(`${t("剩余")} ${formatCount(farm.slotsRemaining, locale)}`);
  }
  if (farm.training !== null) {
    parts.push(`${formatCount(farm.training, locale)} ${t("台在训练")}`);
  }
  if (stale) parts.push(t("全网部分数据未刷新"));
  return (
    <a className="farm-line" href={`/${locale}/network`}>
      <span>{parts.join(" · ") || (en ? "View network training" : "查看全网训练情况")}</span>
      <ArrowUpRight size={15} />
    </a>
  );
}

/** Everything known about the network. Lives on /network, never on the dashboard. */
export function FarmFull({ farm }: { farm: FarmSummary }) {
  const { t, en, locale } = useLocale();
  const fill =
    farm.maxMiners && farm.maxMiners > 0 && farm.activeMiners !== null
      ? Math.min(100, (farm.activeMiners / farm.maxMiners) * 100)
      : 0;
  const meta = [farm.modelLabel, farm.modelSize, farm.splits ? `${farm.splits} ${t("段")}` : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="farm">
      <div className="farm-head">
        <span>
          {meta}
          {meta ? " · " : ""}
          <a href="https://iota.macrocosmos.ai/dashboard/mainnet" target="_blank" rel="noreferrer">
            {t("官方面板")}
          </a>
        </span>
      </div>
      <div className="farm-bar" aria-hidden="true">
        <i style={{ width: `${fill}%` }} />
      </div>
      <div className="farm-stats">
        <div>
          <span>{t("进行中任务")}</span>
          <b>{formatCount(farm.activeRuns, locale)}</b>
        </div>
        <div>
          <span>{t("占用名额")}</span>
          <b>
            {formatCount(farm.activeMiners, locale)}
            <small> / {formatCount(farm.maxMiners, locale)}</small>
          </b>
        </div>
        <div>
          <span>{t("剩余名额")}</span>
          <b>{formatCount(farm.slotsRemaining, locale)}</b>
        </div>
        <div>
          <span>{t("官方在线")}</span>
          <b>{formatCount(farm.online, locale)}</b>
        </div>
        <div>
          <span>{t("已开始训练")}</span>
          <b>{formatCount(farm.training, locale)}</b>
        </div>
        <div>
          <span>{t("训练进度")}</span>
          <b>{formatPct(farm.tokens, farm.totalTokens, locale)}</b>
        </div>
        <div>
          <span>{t("损失")}</span>
          <b>{lossRange(farm.lossMin, farm.lossMax)}</b>
        </div>
      </div>
      {farm.tiers.length > 1 ? (
        <ul className="farm-tiers">
          {farm.tiers.map((tier) => (
            <li key={tier.tier}>
              <b>{tier.tier}</b>
              <span>
                {formatCount(tier.runs, locale)} {t("个任务")} · {t("官方在线")}{" "}
                {formatCount(tier.online, locale)} · {t("已开始训练")}{" "}
                {formatCount(tier.training, locale)} · {t("剩余名额")}{" "}
                {formatCount(tier.slotsRemaining, locale)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {farm.runs.length ? (
        <div
          className="farm-table-wrap"
          role="region"
          aria-label={en ? "Active runs table" : "活跃任务表格"}
          tabIndex={0}
        >
          <table className="farm-table">
            <thead>
              <tr>
                <th>{t("各任务")}</th>
                <th>{t("档位")}</th>
                <th>{t("名额")}</th>
                <th>{t("官方在线")}</th>
                <th>{t("已开始训练")}</th>
                <th>{t("训练进度")}</th>
                <th>{t("损失")}</th>
              </tr>
            </thead>
            <tbody>
              {farm.runs.map((run) => (
                <tr key={run.runId} data-mine={run.mineCount > 0 ? "yes" : undefined}>
                  <td>
                    {run.name}
                    {run.mineCount > 0 ? (
                      <small>
                        {t("你的设备")} {formatCount(run.mineCount, locale)}
                      </small>
                    ) : null}
                  </td>
                  <td>{run.tier || "—"}</td>
                  <td>
                    {formatCount(run.activeMiners, locale)} / {formatCount(run.maxMiners, locale)}
                    {run.slotsRemaining === 0 ? <em>{t("已满")}</em> : null}
                  </td>
                  <td>{formatCount(run.online, locale)}</td>
                  <td>{formatCount(run.training, locale)}</td>
                  <td>{formatPct(run.tokens, run.totalTokens, locale)}</td>
                  <td>{formatLoss(run.loss)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {farm.countries.length ? (
        <p className="farm-countries">
          <b>{t("矿工分布")}</b>
          {farm.countries
            .map((item) => `${countryName(item.country, en)} ${formatCount(item.count, locale)}`)
            .join(" · ")}
        </p>
      ) : null}
    </div>
  );
}
