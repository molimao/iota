import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { AgentInfo } from "@/lib/device-agent";
import { IotaDeviceRun, IotaRosterStatus } from "./iota-device-run";

const context = vi.hoisted(() => ({
  agent: undefined as AgentInfo | undefined,
  query: { isError: false },
}));
vi.mock("@/hooks/use-matched-device-agent", () => ({ useMatchedDeviceAgent: () => context }));
vi.mock("@/hooks/use-iota-reference-run", () => ({ useIotaReferenceRun: () => null }));
vi.mock("./site/locale", () => ({ useLocale: () => ({ locale: "zh", t: (s: string) => s }) }));
beforeEach(() => {
  context.query.isError = false;
  context.agent = {
    deviceId: "one",
    lastSeen: new Date().toISOString(),
    logsEnabled: false,
    recoveryEnabled: false,
    pending: null,
    latestCommand: null,
    snapshot: {
      appRunning: true,
      workerRunning: true,
      queue: { position: 13, observedAt: new Date().toISOString() },
    },
  };
});
describe("queued device run evidence", () => {
  it("explains missing public run for a live queued device without inventing a run", () => {
    const html = renderToStaticMarkup(<IotaDeviceRun miner="test" />);
    expect(html).toContain("排队中 · 暂无公开轮次");
    expect(html).not.toContain("4.13");
    expect(
      renderToStaticMarkup(<IotaRosterStatus miner="test" status="not_found" onClick={() => {}} />),
    ).toContain("排队中");
  });
  it("keeps an actual public run visible", () => {
    expect(
      renderToStaticMarkup(<IotaDeviceRun run={{ id: "4.13.7.11-tah", stale: false }} />),
    ).toContain("4.13.7.11-tah");
  });
  it("does not reuse expired queue or failed requests as live evidence", () => {
    context.agent!.lastSeen = new Date(Date.now() - 100000).toISOString();
    expect(renderToStaticMarkup(<IotaDeviceRun />)).not.toContain("排队中");
    context.agent!.lastSeen = new Date().toISOString();
    context.query.isError = true;
    expect(renderToStaticMarkup(<IotaDeviceRun />)).not.toContain("排队中");
  });
  it("leaves devices with no Agent on public-roster evidence", () => {
    context.agent = undefined;
    expect(
      renderToStaticMarkup(<IotaRosterStatus miner="test" status="not_found" onClick={() => {}} />),
    ).toContain("尚未找到");
  });
});

it("uses fresh desktop selection instead of the public record and drops expired selection", () => {
  context.agent!.snapshot.appSelectedRun = { id: "4.13.7.11-tah", observedAt: new Date().toISOString() };
  const view = () => renderToStaticMarkup(<IotaDeviceRun run={{ id: "4.13.7.10-tah", stale: false }} />);
  expect(view()).toContain("APP 当前轮次");
  expect(view()).toContain("4.13.7.11-tah");
  context.agent!.snapshot.appSelectedRun.observedAt = new Date(Date.now() - 91000).toISOString();
  expect(view()).not.toContain("4.13.7.11-tah");
});
