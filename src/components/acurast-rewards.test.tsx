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

it("labels current wallet balance and cumulative payouts separately", () => {
  state.locale = "zh";
  const html = renderToStaticMarkup(
    <AcurastRewards
      balances={[
        {
          address: "manager-wallet",
          total: "2.379246287508",
          free: "2.34696615042",
          reserved: "0.032280137088",
          frozen: "0",
        },
      ]}
      rewards={{
        dayStart: 1792857600000,
        observedAt: 1792900000000,
        blockHash: "x",
        managers: [
          { id: "67279", today: "0.3365", yesterday: "0.5463", cumulative: "5.236030884927" },
        ],
      }}
    />,
  );
  expect(html).toContain("钱包余额");
  expect(html).toContain("2.37924629");
  expect(html).toContain("累计奖励");
  expect(html).toContain("5.23603088");
  expect(html.indexOf("钱包余额")).toBeLessThan(html.indexOf("累计奖励"));
});
