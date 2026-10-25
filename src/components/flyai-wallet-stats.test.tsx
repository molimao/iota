import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FlyaiWalletStats } from "./flyai-wallet-stats";
import type { SiteLocale } from "@/lib/site";
const state = vi.hoisted(() => ({ locale: "zh" as SiteLocale }));
vi.mock("./site/locale", () => ({ useLocale: () => state }));
it.each(["zh", "zh-TW", "en", "ko", "ja"] as const)(
  "shows wallet context without duplicate points or fiat in %s",
  (locale) => {
    state.locale = locale;
    const html = renderToStaticMarkup(
      <FlyaiWalletStats
        data={{ month: "2026-10", points: 1234567.1234, share: 0.0033, rank: 24, wallets: 510 }}
      />,
    );
    expect(html).toContain("2026-10");
    expect(html).toContain("#24");
    expect(html).toContain('role="meter"');
    expect(html).toContain('aria-valuenow="0.33"');
    expect(html).not.toContain("$");
    expect(html).not.toContain("NaN");
    expect(html.match(/class="fly-points"/g)).toHaveLength(1);
  },
);
