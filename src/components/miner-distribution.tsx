import { useState } from "react";
import { Globe2, ChevronDown, ChevronUp } from "lucide-react";
import { useLocale } from "@/components/site/locale";
import { countryDistribution } from "@/lib/distribution";
import { formatCount, formatPct } from "@/lib/format";
import type { FarmSummary } from "@/lib/farm";

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
  Cyprus: "塞浦路斯",
  Kazakhstan: "哈萨克斯坦",
};

function countryName(country: string, en: boolean) {
  return en ? country : COUNTRY_ZH[country] || country;
}

const COLORS = ["#f5f5f5", "#d4d4d4", "#b3b3b3", "#929292", "#737373", "#545454"];

export function MinerDistribution({ farm, partial }: { farm: FarmSummary; partial: boolean }) {
  const { en, locale } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const data = countryDistribution(farm.countries, farm.listed);
  const shown = expanded ? data.rows : data.rows.slice(0, 8);
  const segments = [
    ...data.rows.slice(0, 6).map((row, index) => ({ ...row, color: COLORS[index]! })),
    ...(data.other
      ? [{ country: en ? "Other regions" : "其他地区", count: data.other, color: "#424242" }]
      : []),
    ...(data.unknown
      ? [{ country: en ? "Location unknown" : "位置未知", count: data.unknown, color: "#303030" }]
      : []),
  ];
  const circumference = 2 * Math.PI * 76;
  let offset = 0;
  return (
    <section className="viz-panel distribution-panel" aria-labelledby="distribution-title">
      <header className="viz-heading">
        <div>
          <span className="viz-kicker">
            <Globe2 size={14} />
            {en ? "GEOGRAPHY" : "地域分布"}
          </span>
          <h2 id="distribution-title">{en ? "Where miners are" : "矿工分布"}</h2>
        </div>
        <span className="viz-tag" data-partial={partial || undefined}>
          {partial
            ? en
              ? "Partial roster"
              : "部分名单"
            : en
              ? `${data.rows.length} regions`
              : `${data.rows.length} 个地区`}
        </span>
      </header>
      <div className="distribution-layout">
        <div className="distribution-overview">
          <div className="distribution-donut">
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="76" fill="none" stroke="#292929" strokeWidth="17" />
              {segments.map((segment) => {
                const length = data.total > 0 ? (segment.count / data.total) * circumference : 0;
                const start = offset;
                offset += length;
                return (
                  <circle
                    key={segment.country}
                    cx="100"
                    cy="100"
                    r="76"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="17"
                    strokeDasharray={`${Math.max(0, length - (segments.length > 1 ? 2 : 0))} ${circumference}`}
                    strokeDashoffset={-start}
                    transform="rotate(-90 100 100)"
                  />
                );
              })}
            </svg>
            <div>
              <strong>{formatCount(farm.listed, locale)}</strong>
              <span>{en ? "miners in roster" : "已读取矿工"}</span>
            </div>
          </div>
          <ul className="distribution-legend">
            {segments.map((segment) => (
              <li key={segment.country}>
                <i style={{ background: segment.color }} />
                <span>{countryName(segment.country, en)}</span>
                <b>{formatCount(segment.count, locale)}</b>
              </li>
            ))}
          </ul>
        </div>
        <div className="country-ranking">
          <div className="ranking-labels">
            <span>{en ? "Region" : "地区"}</span>
            <span>{en ? "Miners / share" : "人数 / 占比"}</span>
          </div>
          <ol
            data-expanded={expanded || undefined}
            tabIndex={expanded ? 0 : undefined}
            aria-label={en ? "Miner counts by region" : "各地区矿工人数"}
          >
            {shown.map((row, index) => (
              <li key={row.country}>
                <div className="country-row">
                  <span className="country-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="country-label">{countryName(row.country, en)}</span>
                  <b>{formatCount(row.count, locale)}</b>
                  <small>{formatPct(row.count, data.total, locale)}</small>
                </div>
                <div className="country-track" aria-hidden="true">
                  <i
                    style={{
                      width: `${data.rows[0] ? (row.count / data.rows[0].count) * 100 : 0}%`,
                      background: COLORS[index] ?? "#424242",
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
          {!data.rows.length && (
            <p className="viz-note">
              {farm.listed === null
                ? en
                  ? "Waiting for the miner roster…"
                  : "正在等待矿工名单…"
                : en
                  ? "No location records are available in the fetched roster."
                  : "已读取名单暂未提供位置记录。"}
            </p>
          )}
          {data.rows.length > 8 && (
            <button
              className="viz-expand"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? en
                  ? "Show top 8"
                  : "收起至前 8 位"
                : en
                  ? `View all ${data.rows.length} regions`
                  : `查看全部 ${data.rows.length} 个地区`}
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
        </div>
      </div>
      <p className="viz-note">
        {farm.listed === null
          ? en
            ? "Shares will appear after the miner roster is fetched. Missing data is not counted as zero."
            : "获取矿工名单后显示地区占比，未获取的数据不计为零。"
          : en
            ? `Shares use the fetched roster, deduplicated by Miner ID. ${formatCount(data.unknown, locale)} have no location record. Location is reported data; it does not indicate training activity.`
            : `占比按已读取名单中的去重 Miner ID 计算，${formatCount(data.unknown, locale)} 个未提供位置。位置来自上报数据，不代表当前训练状态。`}
      </p>
    </section>
  );
}
