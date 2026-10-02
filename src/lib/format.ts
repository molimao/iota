import { LANGUAGE_TAG, type SiteLocale as Locale } from "./site";
import { localizeText } from "@/components/site/localization";

function intlLocale(locale: Locale): string {
  return locale === "en" ? "en-GB" : LANGUAGE_TAG[locale];
}

export function formatClock(ms: number | null | undefined, locale: Locale = "zh"): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleTimeString(intlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Hong_Kong",
  });
}

export function formatDateTime(ms: number | null | undefined, locale: Locale = "zh"): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleString(intlLocale(locale), {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Hong_Kong",
  });
}

export function formatSecondsTimestamp(
  seconds: number | null | undefined,
  locale: Locale = "zh",
): string {
  if (!seconds || !Number.isFinite(seconds)) return "—";
  return formatDateTime(seconds * 1000, locale);
}

export function formatAgo(
  ms: number | null | undefined,
  now: number,
  locale: Locale = "zh",
): string {
  if (!ms)
    return localizeText(locale === "zh" || locale === "zh-TW" ? "尚无数据" : "No data yet", locale);
  const diff = Math.max(0, now - ms);
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(diff / 60_000);
  const hours = Math.round(diff / 3_600_000);
  if (locale === "ko" || locale === "ja" || locale === "zh-TW") {
    const unit = diff < 60_000 ? "second" : diff < 3_600_000 ? "minute" : "hour";
    return new Intl.RelativeTimeFormat(LANGUAGE_TAG[locale]).format(
      -(unit === "second" ? seconds : unit === "minute" ? minutes : hours),
      unit,
    );
  }
  if (locale === "en") {
    if (diff < 60_000) return `${seconds}s ago`;
    if (diff < 3_600_000) return `${minutes} min ago`;
    return `${hours}h ago`;
  }
  if (diff < 60_000) return `${seconds} 秒前`;
  if (diff < 3_600_000) return `${minutes} 分钟前`;
  return `${hours} 小时前`;
}

export function formatCount(value: number | null | undefined, locale: Locale = "zh"): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString(intlLocale(locale));
}

export function formatPct(
  part: number | null | undefined,
  total: number | null | undefined,
  locale: Locale = "zh",
): string {
  if (
    typeof part !== "number" ||
    typeof total !== "number" ||
    !Number.isFinite(part) ||
    !Number.isFinite(total) ||
    total <= 0
  )
    return "—";
  const pct = (part / total) * 100;
  if (pct > 0 && pct < 0.01) return "<0.01%";
  const digits = pct < 10 ? 2 : 1;
  return `${pct.toLocaleString(intlLocale(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatLoss(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toFixed(2);
}
