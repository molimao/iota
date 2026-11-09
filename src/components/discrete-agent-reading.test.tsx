import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { agentSnapshot, type AgentInfo } from "@/lib/device-agent";
import { DiscreteAgentReading } from "./discrete-agent-reading";

it("renders the device speed only while its XDS sample and heartbeat are current", () => {
  const now = Date.parse("2026-11-09T05:30:00Z");
  const snapshot = agentSnapshot.parse({
    appRunning: false,
    workerRunning: false,
    appCpu: null,
    processMemoryMb: null,
    load: null,
    version: "1.0.17",
    xds: { status: "ok", hashrateHps: 127.5, observedAt: "2026-11-09T05:29:00Z" },
  });
  const agent: AgentInfo = {
    deviceId: "paired-device",
    lastSeen: new Date(now).toISOString(),
    snapshot,
    logsEnabled: false,
    recoveryEnabled: false,
    pending: null,
    latestCommand: null,
  };
  const render = (info: AgentInfo, time = now) =>
    renderToStaticMarkup(<DiscreteAgentReading name="XDS" agent={info} now={time} locale="zh" />);

  expect(render(agent)).toContain("127.5 H/s");
  expect(render({ ...agent, lastSeen: null })).toContain("Agent 离线");
  const later = now + 120_000;
  const stale = render({ ...agent, lastSeen: new Date(later).toISOString() }, later);
  expect(stale).toContain("算力数据已过期");
  expect(stale).not.toContain("127.5 H/s");
});
