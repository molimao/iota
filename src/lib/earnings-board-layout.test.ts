import { expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
vi.mock("@/lib/pro-tools.functions", () => ({ getEarningsHistory: () => {} }));
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => ({ userId: null }) }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => () => {} }));
vi.mock("../components/site/locale", () => ({ useLocale: () => ({ locale: "zh" }) }));
import { EarningsBoardCharts } from "../components/earnings-board-charts";
import { reviewDevices, reviewReading } from "../components/fleet-review-data";
import { reviewProHistory } from "../components/pro-tools-review";
import { earningsBoard } from "@/lib/earnings-board";
it("renders every saved project without a selector, including missing history and formatted monthly points", () => {
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
  expect(markup).toContain("624,000");
  expect(markup).toContain("该项目还没有可绘制的历史收益");
});
