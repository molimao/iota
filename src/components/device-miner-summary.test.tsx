import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LocalMinerReadings, ProjectMinerSlots } from "./device-miner-summary";
import { agentSnapshot, type AgentInfo } from "@/lib/device-agent";
import type { FleetBinding } from "@/lib/fleet";
const now = Date.now(),
  binding: FleetBinding = {
    id: "11111111-1111-4111-8111-111111111111",
    project: "xmr",
    identifier: "sample",
    worker: "",
  };
const miner = {
  project: "xmr" as const,
  software: "xmrig" as const,
  bindingId: binding.id,
  observedAt: new Date(now).toISOString(),
  status: "ok" as const,
  hashrate10s: 3240.2,
  hashrate60s: 3200,
  accepted: 100,
  rejected: 3,
  uptime: 123,
};
const agent: AgentInfo = {
  deviceId: "test",
  lastSeen: new Date(now).toISOString(),
  snapshot: { miners: [miner] },
  pending: null,
  latestCommand: null,
  logsEnabled: false,
  recoveryEnabled: false,
};
it("matches the explicit project binding before displaying local readings", () => {
  const render = (bindings: FleetBinding[]) =>
    renderToStaticMarkup(
      <LocalMinerReadings agent={agent} bindings={bindings} now={now} locale="zh" />,
    );
  expect(render([binding])).toContain("3,240.2 H/s");
  expect(render([])).toBe("");
  expect(render([{ ...binding, id: "other" }])).toBe("");
});
it("keeps a per-project Agent slot visible without claiming unsupported capabilities", () => {
  const render = (bindings: FleetBinding[], value: AgentInfo | undefined = undefined) =>
    renderToStaticMarkup(
      <ProjectMinerSlots bindings={bindings} agent={value} now={now} locale="zh" />,
    );
  expect(render([binding])).toContain("尚未连接 Agent");
  expect(render([{ ...binding, project: "bnt", worker: "worker-A" }], agent)).toContain(
    "尚未识别到本项目矿工",
  );
  expect(render([{ ...binding, project: "acurast" }])).toContain("本项目暂未支持 Agent 采集");
  expect(render([{ ...binding, project: "iota" }])).toBe("");
  const html = render([{ ...binding, project: "prl" }], agent);
  expect(html).not.toContain("3,240.2");
  expect(html).not.toContain("XMRig");
});
it("does not display an expired hashrate as live or a missing value as zero", () => {
  const stale = renderToStaticMarkup(
    <LocalMinerReadings agent={agent} bindings={[binding]} now={now + 61000} locale="zh" />,
  );
  expect(stale).toContain("已过期");
  expect(stale).not.toContain("3,240.2");
  const unknown = renderToStaticMarkup(
    <LocalMinerReadings
      agent={{ ...agent, snapshot: { miners: [{ ...miner, hashrate10s: null }] } }}
      bindings={[binding]}
      now={now}
      locale="zh"
    />,
  );
  expect(unknown).toContain("—");
  expect(unknown).not.toContain("0 H/s");
});
it("accepts bounded XMRig summary data but rejects additional raw API fields", () => {
  const snapshot = {
    appRunning: true,
    workerRunning: true,
    appCpu: 1,
    processMemoryMb: 1,
    load: 1,
    version: "1.0.12",
    miners: [miner],
  };
  expect(agentSnapshot.safeParse(snapshot).success).toBe(true);
  expect(
    agentSnapshot.safeParse({ ...snapshot, miners: [{ ...miner, accessToken: "secret" }] }).success,
  ).toBe(false);
});

it("keeps PRL tiles and BNT session averages separate from XMR hashrate", () => {
  const prl = { ...binding, id: "22222222-2222-4222-8222-222222222222", project: "prl" as const };
  const bnt = { ...binding, id: "33333333-3333-4333-8333-333333333333", project: "bnt" as const };
  const value: AgentInfo = {
    ...agent,
    snapshot: {
      miners: [
        miner,
        {
          ...miner,
          project: "prl",
          software: "pearl-metal",
          bindingId: prl.id,
          rateUnit: "tiles/s",
          rateWindow: "60s",
          counterUnit: "shares",
          hashrate10s: null,
          hashrate60s: 1075000,
        },
        {
          ...miner,
          project: "bnt",
          software: "seine",
          bindingId: bnt.id,
          rateUnit: "H/s",
          rateWindow: "session",
          counterUnit: "blocks",
          hashrate10s: null,
          hashrate60s: null,
          hashrateSession: 30.4,
          rejected: null,
        },
      ],
    },
  };
  const html = renderToStaticMarkup(
    <LocalMinerReadings agent={value} bindings={[binding, prl, bnt]} now={now} locale="zh" />,
  );
  expect(html).toContain("1,075,000 tiles/s");
  expect(html).toContain("30.4 H/s");
  expect(html).toContain("本机会话平均算力");
  expect(html).toContain("已接受区块累计");
  expect(html).not.toContain("1,075,000 H/s");
  expect(html).not.toContain("30.4 tiles/s");
  const isolated = renderToStaticMarkup(
    <LocalMinerReadings agent={value} bindings={[prl]} now={now} locale="en" />,
  );
  expect(isolated).toContain("PRL · Metal");
  expect(isolated).not.toContain("XMRig");
  expect(isolated).not.toContain("Seine");
});

it("rejects software/project mismatches and duplicate binding readings", () => {
  const snapshot = {
    appRunning: true,
    workerRunning: true,
    appCpu: 1,
    processMemoryMb: 1,
    load: 1,
    version: "1.0.12",
    miners: [miner],
  };
  expect(
    agentSnapshot.safeParse({ ...snapshot, miners: [{ ...miner, project: "prl" }] }).success,
  ).toBe(false);
  expect(agentSnapshot.safeParse({ ...snapshot, miners: [miner, miner] }).success).toBe(false);
});
it("shows NOID compute process resource use without claiming hashrate or shares", () => {
  const noid = { ...binding, project: "noid" as const };
  const value: AgentInfo = {
    ...agent,
    snapshot: {
      miners: [
        {
          ...miner,
          project: "noid",
          software: "noid-mac",
          status: "process",
          appCpu: 7,
          processMemoryMb: 3,
          hashrate10s: null,
          hashrate60s: null,
          accepted: null,
          rejected: null,
        },
      ],
    },
  };
  const html = renderToStaticMarkup(
    <LocalMinerReadings agent={value} bindings={[noid]} now={now} locale="zh" />,
  );
  expect(html).toContain("矿工进程运行中");
  expect(html).toContain("7%");
  expect(html).not.toContain("H/s");
  expect(html).not.toContain("有效 / 拒绝");
});

it("explains Linux project collection is unsupported while retaining pool status", () => {
  const linux = {
    ...agent,
    snapshot: { platform: "linux" as const, monitorOnly: true, miners: [] },
  };
  const html = renderToStaticMarkup(
    <ProjectMinerSlots
      bindings={[{ ...binding, project: "prl", worker: "gpu-01" }]}
      agent={linux}
      now={now}
      locale="zh"
    />,
  );
  expect(html).toContain("Linux Agent 暂不支持采集此项目");
  expect(html).not.toContain("尚未识别到本项目矿工");
});

it("does not display a PRL wallet Agent or its old snapshot as a Worker", () => {
  const wallet = { ...binding, project: "prl" as const, worker: "" };
  const html = renderToStaticMarkup(
    <ProjectMinerSlots bindings={[wallet]} agent={agent} now={now} locale="zh" />,
  );
  expect(html).toBe("");
});
