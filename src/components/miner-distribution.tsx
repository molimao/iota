import { localizeValue } from "@/components/site/localization";
import { useState } from "react";
import { Globe2, ChevronDown, ChevronUp } from "lucide-react";
import { useLocale } from "@/components/site/locale";
import { countryDistribution } from "@/lib/distribution";
import { formatCount, formatPct } from "@/lib/format";
import type { FarmSummary } from "@/lib/farm";
import { LANGUAGE_TAG, type SiteLocale } from "@/lib/site";

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

const COUNTRY_CODES: Record<string, string> = {
  China: "CN",
  "United States": "US",
  "Hong Kong": "HK",
  Japan: "JP",
  Canada: "CA",
  Germany: "DE",
  Taiwan: "TW",
  Singapore: "SG",
  "United Kingdom": "GB",
  "South Korea": "KR",
  France: "FR",
  Australia: "AU",
  India: "IN",
  Russia: "RU",
  Brazil: "BR",
  Netherlands: "NL",
  Switzerland: "CH",
  Sweden: "SE",
  Finland: "FI",
  Norway: "NO",
  Poland: "PL",
  Spain: "ES",
  Italy: "IT",
  Ireland: "IE",
  Israel: "IL",
  "United Arab Emirates": "AE",
  Indonesia: "ID",
  Vietnam: "VN",
  Thailand: "TH",
  Turkey: "TR",
  Ukraine: "UA",
  Mexico: "MX",
  Argentina: "AR",
  "South Africa": "ZA",
  Belgium: "BE",
  Austria: "AT",
  Denmark: "DK",
  "Czech Republic": "CZ",
  Romania: "RO",
  Lithuania: "LT",
  Malaysia: "MY",
  Philippines: "PH",
  "New Zealand": "NZ",
  Portugal: "PT",
  Chile: "CL",
  Cyprus: "CY",
  Kazakhstan: "KZ",
};
function countryName(country: string, locale: SiteLocale) {
  const code = COUNTRY_CODES[country];
  if (code)
    return new Intl.DisplayNames([LANGUAGE_TAG[locale]], { type: "region" }).of(code) || country;
  return localizeValue(
    locale === "zh" || locale === "zh-TW" ? COUNTRY_ZH[country] || country : country,
    locale,
  );
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
      ? [
          {
            country: localizeValue(en ? "Other regions" : "其他地区", locale),
            count: data.other,
            color: "#424242",
          },
        ]
      : []),
    ...(data.unknown
      ? [
          {
            country: localizeValue(en ? "Location unknown" : "位置未知", locale),
            count: data.unknown,
            color: "#303030",
          },
        ]
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
            {localizeValue(en ? "GEOGRAPHY" : "地域分布", locale)}
          </span>
          <h2 id="distribution-title">
            {localizeValue(en ? "Where miners are" : "矿工分布", locale)}
          </h2>
        </div>
        <span className="viz-tag" data-partial={partial || undefined}>
          {partial
            ? localizeValue(en ? "Partial roster" : "部分名单", locale)
            : localizeValue(
                en ? `${data.rows.length} regions` : `${data.rows.length} 个地区`,
                locale,
              )}
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
              <span>{localizeValue(en ? "miners in roster" : "已读取矿工", locale)}</span>
            </div>
          </div>
          <ul className="distribution-legend">
            {segments.map((segment) => (
              <li key={segment.country}>
                <i style={{ background: segment.color }} />
                <span>{countryName(segment.country, locale)}</span>
                <b>{formatCount(segment.count, locale)}</b>
              </li>
            ))}
          </ul>
        </div>
        <div className="country-ranking">
          <div className="ranking-labels">
            <span>{localizeValue(en ? "Region" : "地区", locale)}</span>
            <span>{localizeValue(en ? "Miners / share" : "人数 / 占比", locale)}</span>
          </div>
          <ol
            data-expanded={expanded || undefined}
            tabIndex={expanded ? 0 : undefined}
            aria-label={localizeValue(en ? "Miner counts by region" : "各地区矿工人数", locale)}
          >
            {shown.map((row, index) => (
              <li key={row.country}>
                <div className="country-row">
                  <span className="country-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="country-label">{countryName(row.country, locale)}</span>
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
                ? localizeValue(en ? "Waiting for the miner roster…" : "正在等待矿工名单…", locale)
                : localizeValue(
                    en
                      ? "No location records are available in the fetched roster."
                      : "已读取名单暂未提供位置记录。",
                    locale,
                  )}
            </p>
          )}
          {data.rows.length > 8 && (
            <button
              className="viz-expand"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? localizeValue(en ? "Show top 8" : "收起至前 8 位", locale)
                : localizeValue(
                    en
                      ? `View all ${data.rows.length} regions`
                      : `查看全部 ${data.rows.length} 个地区`,
                    locale,
                  )}
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
        </div>
      </div>
      <p className="viz-note">
        {farm.listed === null
          ? localizeValue(
              en
                ? "Shares will appear after the miner roster is fetched. Missing data is not counted as zero."
                : "获取矿工名单后显示地区占比，未获取的数据不计为零。",
              locale,
            )
          : localizeValue(
              en
                ? `Shares use the fetched roster, deduplicated by Miner ID. ${formatCount(data.unknown, locale)} have no location record. Location is reported data; it does not indicate training activity.`
                : `占比按已读取名单中的去重 Miner ID 计算，${formatCount(data.unknown, locale)} 个未提供位置。位置来自上报数据，不代表当前训练状态。`,
              locale,
            )}
      </p>
    </section>
  );
}
