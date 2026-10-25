import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { SiteLocale } from "@/lib/site";
import { IotaRunLabels } from "./iota-run-labels";

const context = vi.hoisted(() => ({ locale: "zh" as SiteLocale }));
vi.mock("./site/locale", () => ({ useLocale: () => context }));

describe("run metadata rendering", () => {
  it("labels the public desktop fallback as a network reference", () => {
    context.locale = "zh";
    const html = renderToStaticMarkup(
      <IotaRunLabels
        layout="row"
        runs={[{ id: "4.13.7.10-tah", stale: false, kind: "reference" }]}
      />,
    );
    expect(html).toContain("全网参考轮次");
    expect(html).not.toContain("参与轮次");
  });
  it.each(["zh", "zh-TW", "en", "ja", "ko"] as const)(
    "shows exact official IDs in %s",
    (locale) => {
      context.locale = locale;
      const html = renderToStaticMarkup(
        <IotaRunLabels runs={[{ id: "4.13.7.11-tah", stale: false }]} />,
      );
      expect(html).toContain("4.13.7.11-tah");
      expect(html).not.toContain("data-stale");
      expect(html).not.toContain("undefined");
    },
  );
  it("visibly marks old records and handles devices outside the public roster", () => {
    context.locale = "zh";
    expect(
      renderToStaticMarkup(<IotaRunLabels runs={[{ id: "4.13.7.11-tah", stale: true }]} />),
    ).toContain("旧数据");
    expect(renderToStaticMarkup(<IotaRunLabels runs={[null]} />)).toContain("尚未查到轮次");
    expect(renderToStaticMarkup(<IotaRunLabels runs={[null]} showEmpty={false} />)).toBe("");
  });
  it("renders card metadata as one aligned field with no repeated label", () => {
    context.locale = "zh";
    const html = renderToStaticMarkup(
      <IotaRunLabels
        layout="row"
        runs={[
          { id: "4.13.7.10-tah", stale: false },
          { id: "4.13.7.11-tah", stale: false },
        ]}
      />,
    );
    expect(html).toContain("iota-run-labels-row");
    expect(html.match(/轮次/g)).toHaveLength(1);
    expect(html).toContain("4.13.7.10-tah");
    expect(html).toContain("4.13.7.11-tah");
  });
});
