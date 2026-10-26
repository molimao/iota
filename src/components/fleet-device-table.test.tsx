import { it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FleetDeviceTable } from "./fleet-device-table";
import { operationsReviewData } from "./operations-review-data";
vi.mock("./device-agent-summary", () => ({ DeviceAgentSummary: () => <span>Agent</span> }));
vi.mock("./iota-device-run", () => ({ IotaRosterStatus: () => <span>IOTA state</span> }));
it("keeps the same yesterday earnings and token amounts in the device list", () => {
  const data = operationsReviewData(Date.now());
  const html = renderToStaticMarkup(
    <FleetDeviceTable devices={data.devices} reading={data.reading} onLink={() => {}} preview />,
  );
  for (const text of [
    "Mac Studio",
    "Mac mini",
    "昨日总收益",
    "1.84",
    "0.27830312",
    "0.42",
    "0.06359642",
  ])
    expect(html).toContain(text);
  expect(html).not.toContain("NaN");
  expect(html).not.toContain("undefined");
});
it("does not turn unknown earnings into a zero-dollar balance", () => {
  const data = operationsReviewData(Date.now());
  const html = renderToStaticMarkup(
    <FleetDeviceTable
      devices={data.devices}
      reading={(b) => ({
        ...data.reading(b),
        today: null,
        todayUsdValue: null,
        todayUnits: null,
        health: "unavailable",
      })}
      onLink={() => {}}
      preview
    />,
  );
  expect(html).not.toContain("$0.00");
  expect(html).toContain("—");
});
