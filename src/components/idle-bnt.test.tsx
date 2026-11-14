import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import type { AgentInfo } from "@/lib/device-agent";
import { IdleBntListStatus } from "./idle-bnt";
import { operationsReviewData } from "./operations-review-data";

const now = Date.now();
const [, miningAgent] = Object.values(operationsReviewData(now).agents);

function renderStatus(agent: AgentInfo, threads: number) {
  return renderToStaticMarkup(
    <IdleBntListStatus
      agent={agent}
      now={now}
      settings={{ address: "", devices: [{ deviceId: agent.deviceId, threads }] }}
    />,
  );
}

it("renders the Agent's current BNT hashrate only while its heartbeat is fresh", () => {
  const agent = miningAgent!;
  expect(renderStatus(agent, 2)).toContain("BNT · 2.82 H/s");
  const offline = renderStatus({ ...agent, lastSeen: new Date(now - 61000).toISOString() }, 2);
  expect(offline).toContain("BNT · 2 线程");
  expect(offline).not.toContain("H/s");
});

it("links an eligible device that has mining disabled to the shared setup", () => {
  const disabled = renderStatus(miningAgent!, 0);
  expect(disabled).toContain('href="#idle-mining"');
  expect(disabled).toContain("启用 BNT");
  expect(disabled).not.toContain("H/s");
});

it("shows IOTA priority instead of hashrate when the idle miner yields", () => {
  const agent = miningAgent!;
  const priority = renderStatus({
    ...agent,
    snapshot: { ...agent.snapshot, idleBnt: { state: "priority", hashrate: null } },
  }, 4);
  expect(priority).toContain("BNT · IOTA 优先");
  expect(priority).not.toContain("H/s");
});

it("shows BNT and XDS speeds independently on the same IOTA device", () => {
  const agent = miningAgent!;
  const html = renderStatus({ ...agent, snapshot: { ...agent.snapshot, idleXds: { state: "mining", hashrate: 152.5 } } }, 2);
  expect(html).toContain("BNT · 2.82 H/s");
  expect(html).toContain("XDS · 152.50 H/s");
  expect(renderStatus({ ...agent, snapshot: { ...agent.snapshot, idleXds: { state: "off", hashrate: null } } }, 2)).not.toContain("XDS ·");
});
