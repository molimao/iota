import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { AgentInfo } from "@/lib/device-agent";
import { IotaDeviceRun, IotaRosterStatus } from "./iota-device-run";

const context = vi.hoisted(() => ({
  agent: undefined as AgentInfo | undefined,
  query: { isError: false },
}));
vi.mock("@/hooks/use-matched-device-agent", () => ({ useMatchedDeviceAgent: () => context }));
vi.mock("@/hooks/use-iota-reference-run", () => ({ useIotaReferenceRun: () => ({ id: "network-default-must-not-appear", stale: false, kind: "reference" }) }));
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
    expect(html).toContain("排队中 · 实际轮次未读到");
    expect(html).not.toContain("4.13");
    expect(html).not.toContain("network-default-must-not-appear");
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

it("keeps a selected run with old-data label while the same APP still reports it", () => {
  context.agent!.snapshot.appSelectedRun = { id: "4.13.7.11-tah", observedAt: new Date().toISOString() };
  const view = () => renderToStaticMarkup(<IotaDeviceRun run={{ id: "4.13.7.10-tah", stale: false }} />);
  expect(view()).toContain("APP 当前轮次");
  expect(view()).toContain("4.13.7.11-tah");
  context.agent!.snapshot.appSelectedRun.observedAt = new Date(Date.now() - 91000).toISOString();
  expect(view()).toContain("4.13.7.11-tah");
  context.agent!.snapshot.appSelectedRun.observedAt = new Date(Date.now() - 301000).toISOString();
  expect(view()).toContain("旧数据");
  expect(view()).toContain("APP 最近轮次");
  context.agent!.snapshot.appRunning = false;
  expect(view()).not.toContain("4.13.7.11-tah");
});

it("never substitutes a network reference for missing actual device evidence", () => {
  const html = renderToStaticMarkup(<IotaDeviceRun run={{ id: "wrong-network-default", stale: false, kind: "reference" }} />);
  expect(html).not.toContain("wrong-network-default");
  expect(html).toContain("实际轮次未读到");
});

it("shows a live worker even when the official roster cannot find it, with source context",()=>{
 delete context.agent!.snapshot.queue;
 const html=renderToStaticMarkup(<IotaRosterStatus miner="test" status="not_found" onClick={()=>{}}/>);
 expect(html).toContain("程序开着");
 expect(html).not.toContain(">尚未找到<");
 expect(html).toContain("官方当前训练名单未收录此 ID");
 context.query.isError=true;
 expect(renderToStaticMarkup(<IotaRosterStatus miner="test" status="not_found"/>)).toContain("尚未找到");
});
it("does not keep a stale Agent run labeled current after the heartbeat cutoff",()=>{
 context.agent!.snapshot.appSelectedRun={id:"4.13.7.11-tah",observedAt:new Date().toISOString()};
 context.agent!.lastSeen=new Date(Date.now()-61000).toISOString();
 expect(renderToStaticMarkup(<IotaDeviceRun miner="test"/>)).not.toContain("4.13.7.11-tah");
});
