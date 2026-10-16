import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LocaleContext } from "@/components/site/locale";
import { DailyRewardsSummary } from "@/components/daily-rewards-summary";
import { aggregateUnits } from "@/lib/earnings";
import type { SiteLocale } from "@/lib/site";
const now = Date.parse("2026-10-15T16:30:00Z");
function render(locale: SiteLocale, missing = false) {
  return renderToStaticMarkup(
    createElement(
      LocaleContext.Provider,
      { value: locale },
      createElement(DailyRewardsSummary, {
        today: aggregateUnits([16464501]),
        yesterday: aggregateUnits([missing ? null : 276373384]),
        usdPerIota: 6.7,
        now,
      }),
    ),
  );
}
describe("daily comparison", () => {
  it("attributes recorded totals to the preceding days without changing the amounts", () => {
    const html = render("zh");
    expect(html).toContain('dateTime="2026-10-14"');
    expect(html).toContain('dateTime="2026-10-15"');
    expect(html).toContain("0.16464501");
    expect(html).toContain("2.76373384");
    expect(html).toContain("$18.52 USD");
    expect(html).toContain("昨日收益");
    expect(html).toContain("前日收益");
    expect(html).toContain("按次日记账记录归属");
    expect(html).not.toContain("今日记账收益");
    expect(html).not.toContain("昨日记账收益");
  });
  it("shows unavailable yesterday instead of a false zero", () => {
    const html = render("en", true);
    expect(html).toContain("Unavailable");
    expect(html).toContain("—");
  });
  it.each(["zh", "zh-TW", "en", "ko", "ja"] as const)("renders day labels in %s", (locale) => {
    const html = render(locale);
    expect(html).not.toContain("undefined");
    if (locale !== "zh") expect(html).not.toContain("昨日记账收益");
  });
});
