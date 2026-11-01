import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HardwareCalculator } from "./hardware-calculator";
import { CALCULATOR_PROJECTS } from "../lib/hardware-yield";
function render(props: Parameters<typeof HardwareCalculator>[0] = {}) {
  return renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      <HardwareCalculator {...props} />
    </QueryClientProvider>,
  );
}
it("exposes every project as a crawlable link on the unified calculator", () => {
  const html = render();
  for (const id of CALCULATOR_PROJECTS) expect(html).toContain(`href="/zh/calculator/${id}"`);
  expect(html).toContain("选择项目");
  expect(html).toContain("全部项目");
});
it("restores IOTA from a unified-page share link using a compatible Mac rather than GPU revenue", () => {
  const html = render({ initialProject: "iota", initialModel: "4090", initialHours: 12 });
  expect(html).toContain('<option value="m1-pro-32" selected="">');
  expect(html).toContain("历史日均参考");
  expect(html).not.toContain("NVIDIA RTX 4090");
  expect(html).toContain("/zh/calculator?project=iota&amp;gpu=m1-pro-32&amp;hours=12");
});
it("keeps project landing pages linked to the unified calculator and supported hardware", () => {
  const html = render({ project: "bnt", initialModel: "m4-max-48" });
  expect(html).toContain('href="/zh/calculator"');
  expect(html).toContain("Apple M4 Max");
  expect(html).toContain("固定参考价");
  expect(html).not.toContain("暂无数据");
});
it("offers M2 and M3 variants without blank results and avoids empty power columns on CPU-only estimates", () => {
  const html = render({ initialProject: "xmr", initialModel: "m2-pro-12c" });
  expect(html).toContain("Apple M2 Pro · 12-core CPU");
  expect(html).toContain("Apple M3 Max · 16-core CPU");
  expect(html).toContain('<option value="m2-pro-12c" selected="">');
  expect(html).toContain("每天预计毛收益");
  expect(html).not.toContain("暂无数据");
  expect(html).not.toContain("calc-comparison");
  expect(html).not.toContain("NVIDIA RTX 4090");
});
it("compares IOTA and XMR revenue on a compatible Mac without repeated unknown net/electricity cells", () => {
  const html = render({ initialModel: "m1-pro-32" });
  expect(html).toContain("calc-comparison");
  expect(html).toContain("Monero");
  expect(html).not.toContain("<th>每天净收益</th>");
  expect(html).not.toContain("<th>电费</th>");
});
