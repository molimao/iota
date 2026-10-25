import { it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AcurastRewards } from "./acurast-rewards";
import type { SiteLocale } from "@/lib/site";
const state = vi.hoisted(() => ({ locale: "zh" as SiteLocale }));
vi.mock("./site/locale", () => ({ useLocale: () => state }));
it.each(["zh", "zh-TW", "en", "ja", "ko"] as const)(
  "shows dates, manager scope and real ACU decimals in %s",
  (locale) => {
    state.locale = locale;
    const html = renderToStaticMarkup(
      <AcurastRewards
        rewards={{
          dayStart: 1792857600000,
          observedAt: 1792900000000,
          blockHash: "0x1",
          managers: [{ id: "67279", today: "0.000000000001", yesterday: null, cumulative: "5.25" }],
        }}
      />,
    );
    expect(html).toContain("67279");
    expect(html).toContain("0.000000000001");
    expect(html).toContain("5.25");
    expect(html).toContain("UTC+8");
    expect(html).not.toContain("undefined");
    expect(html).not.toContain("NaN");
  },
);
