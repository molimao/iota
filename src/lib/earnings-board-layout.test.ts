import { expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
vi.mock("@/lib/market-prices.functions", () => ({ getMarketPrices: () => ({ data: {} }) }));
vi.mock("../components/bnt-hashrate-trend", () => ({ BntHashrateTrend: () => null }));
vi.mock("@/lib/pro-tools.functions", () => ({ getEarningsHistory: () => {} }));
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => ({ userId: null }) }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => () => {} }));
vi.mock("../components/site/locale", () => ({ useLocale: () => ({ locale: "zh" }) }));
import { EarningsBoardCharts } from "../components/earnings-board-charts";
import { reviewDevices, reviewReading } from "../components/fleet-review-data";
import { reviewProHistory } from "../components/pro-tools-review";
import { earningsBoard } from "@/lib/earnings-board";
it("renders every saved project without a selector, keeping formatted monthly points without empty history panels", () => {
  const devices = reviewDevices();
  const data = devices.flatMap((d) =>
    d.bindings.map((binding) => ({ binding, deviceId: d.id, data: reviewReading(binding) })),
  );
  const board = earningsBoard(data);
  const markup = renderToStaticMarkup(
    createElement(
      QueryClientProvider,
      { client: new QueryClient() },
      createElement(EarningsBoardCharts, {
        board,
        entries: [],
        preview: true,
        previewHistory: reviewProHistory("zh"),
      }),
    ),
  );
  for (const p of board.projects) expect(markup).toContain(`data-project="${p.project}"`);
  expect(markup).not.toContain("<select");
  expect(markup).not.toContain("NaN");
  expect(markup).not.toContain("<textarea");
  expect(markup).toContain("总收益趋势");
  expect(markup).toContain("2 个地址合计");
  expect(markup).not.toContain("该项目还没有可绘制的历史收益");
});

import { EarningsBoard } from "../components/earnings-board";
it("renders PRL rolling USD separately and identifies partial totals", () => {
  const devices = [{ id: "demo", name: "Demo", hardware: "GPU", createdAt: 1, bindings: [
    { id: "prl", project: "prl" as const, identifier: "wallet", worker: "" },
    { id: "bnt", project: "bnt" as const, identifier: "other", worker: "" },
  ] }];
  const markup = renderToStaticMarkup(createElement(QueryClientProvider, { client: new QueryClient() },
    createElement(EarningsBoard, {
      devices, preview: true, previewHistory: [], previewPrices: { prl: 1.8 },
      reading: (binding) => ({
        scope: "wallet", health: "fresh", unit: binding.project === "prl" ? "PRL" : "BNT",
        rewardAmount: 2, earningsWindow: "rolling24h", source: "test", updated: "now",
        name: "test", id: "test", status: "online", today: "2", lifetime: null,
      } as unknown as import("../components/fleet-review-data").ProjectReading),
    })));
  expect(markup).toContain("近 24 小时");
  expect(markup).toContain("3.60");
  expect(markup).toContain("统计范围");
  expect(markup.match(/data-testid="recent-earnings"/g)).toHaveLength(1);
  const summary = markup.split('data-testid="recent-earnings"')[1]!.split("</article>")[0]!;
  expect(summary).not.toContain("昨日");
  expect(summary).not.toContain("今日");
  expect(summary).not.toContain("UTC");
  expect(summary).toContain("已计入 1 / 2 项目");
});
