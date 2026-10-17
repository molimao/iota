import type { SiteLocale } from "./site";
export const BRAND_NAME = "IOTA Watch";
export const BRAND_VERSION = "20261017";
export const BRAND_MARK = `/brand/mark.svg?v=${BRAND_VERSION}`;
export function brandTitle(page: string) {
  const title = page.trim()
    .replace(/^IOTA Watch\s*[|｜·—–-]\s*/i, "")
    .replace(/\s*[|｜·—–-]\s*IOTA Watch$/i, "");
  return !title || title === BRAND_NAME ? BRAND_NAME : `${BRAND_NAME} · ${title}`;
}
export const homeBrandTitle: Record<SiteLocale,string> = {
  zh:"多项目挖矿与训练监控",
  "zh-TW":"多專案挖礦與訓練監控",
  en:"Mining & training monitor",
  ko:"채굴·학습 모니터링",
  ja:"採掘・学習モニター",
};
