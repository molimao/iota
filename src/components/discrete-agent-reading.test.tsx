import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { agentSnapshot, type AgentInfo } from "@/lib/device-agent";
import { DiscreteAgentReading } from "./discrete-agent-reading";
import { DiscreteOverviewCard } from "./discrete-overview-card";
import { summarizeDiscreteScan } from "@/hooks/use-discrete-scan-summary";

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

  const overview = renderToStaticMarkup(
    <DiscreteOverviewCard
      devices={[
        { name: "MacBook Air", agent },
        { name: "Mac mini", agent: { ...agent, deviceId: "offline-device", lastSeen: null } },
      ]}
      summary={summarizeDiscreteScan([
        { fromHeight: 1001, toHeight: 2000, fromTime: 3, toTime: 4, blocks: [] },
        {
          fromHeight: 1,
          toHeight: 1000,
          fromTime: 1,
          toTime: 2,
          blocks: [{ height: 10, timestamp: 1, hash: "block", rewardUnits: 5183 }],
        },
      ])}
      now={now}
      locale="zh"
    />,
  );
  expect(overview).toContain("127.5");
  expect(overview).not.toContain("255");
  expect(overview).toContain("1/2");
  expect(overview).toContain("51.83");
  expect(overview).toContain("2,000");
  expect(overview).toContain("/zh/projects/xds#xds-address");
});
