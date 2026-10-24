import { it, expect } from "vitest";
import { redactAgentLog, agentBeat, agentOnline, agentCanUpdate } from "./device-agent";
it("redacts credentials, links, users and identifiers and rejects unbounded telemetry", () => {
  const value = redactAgentLog(
    "token=secret\nBearer abcdef\n/Users/alice/log\na@b.com 192.168.1.1\nhttps://host.test/?key=abc\n" +
      "a".repeat(48),
  );
  for (const secret of [
    "secret",
    "abcdef",
    "alice",
    "a@b.com",
    "192.168.1.1",
    "host.test",
    "a".repeat(48),
  ])
    expect(value).not.toContain(secret);
  expect(redactAgentLog("x".repeat(13000)).length).toBeLessThanOrEqual(12000);
  expect(() => agentBeat.parse({ snapshot: { appRunning: true, command: "anything" } })).toThrow();
});
it("uses recent authenticated heartbeats rather than mining roster membership for physical uptime", () => {
  expect(agentOnline(new Date(100000).toISOString(), 120000)).toBe(true);
  expect(agentOnline(new Date(100000).toISOString(), 200000)).toBe(false);
  expect(agentOnline(null, 120000)).toBe(false);
});

it("offers remote updates only for supported versions", () => {
  expect(agentCanUpdate("1.0.1")).toBe(false);
  expect(agentCanUpdate("1.0.2")).toBe(true);
  expect(agentCanUpdate("1.1.0")).toBe(true);
  expect(agentCanUpdate("2.0.0")).toBe(true);
  expect(agentCanUpdate("bad")).toBe(false);
  expect(agentCanUpdate(undefined)).toBe(false);
});

it("filters offline, stale queues and unpaired agents without claiming training contribution", async () => {
  const { matchesAgentFilter } = await import("./device-agent");
  const now = Date.now();
  const a = { deviceId: "a", lastSeen: new Date(now).toISOString(), snapshot: { appRunning: true, workerRunning: true, queue: { position: 3, observedAt: new Date(now).toISOString() } }, logsEnabled: false, recoveryEnabled: false, pending: null, latestCommand: null };
  expect(matchesAgentFilter(a, "queued", now)).toBe(true);
  expect(matchesAgentFilter(a, "training", now)).toBe(false);
  expect(matchesAgentFilter({...a,lastSeen:new Date(now-100000).toISOString()}, "queued", now)).toBe(false);
  expect(matchesAgentFilter({...a,lastSeen:null}, "offline", now)).toBe(true);
  expect(matchesAgentFilter(undefined, "unpaired", now)).toBe(true);
  expect(matchesAgentFilter(undefined, "offline", now)).toBe(false);
  expect(matchesAgentFilter({...a,snapshot:{...a.snapshot,queue:{position:3,observedAt:new Date(now-301000).toISOString()}}}, "queued", now)).toBe(false);
});

it("uses the same evidence for card phases and filters, including a stopped training worker", async () => {
  const { agentPhase, matchesAgentFilter } = await import("./device-agent");
  const now = Date.now();
  const base = { deviceId: "a", lastSeen: new Date(now).toISOString(), snapshot: {}, logsEnabled: false, recoveryEnabled: false, pending: null, latestCommand: null };
  const cases = [
    [{appRunning:true,workerRunning:false}, "workerStopped", "stopped"],
    [{appRunning:false,workerRunning:false}, "stopped", "stopped"],
    [{appRunning:true}, "unknown", null],
    [{appRunning:true,workerRunning:true,queue:{position:0,observedAt:new Date(now).toISOString()}}, "running", "training"],
  ] as const;
  for (const [snapshot, phase, filter] of cases) {
    const a = {...base, snapshot};
    expect(agentPhase(a, now)).toBe(phase);
    for (const f of ["training", "queued", "stopped"] as const) expect(matchesAgentFilter(a, f, now)).toBe(f === filter);
  }
});

it("classifies a live worker without treating a missing GUI as a stop", async () => {
  const { agentPhase } = await import("./device-agent");
  const now = Date.parse("2026-10-24T08:00:00Z");
  const stamp = new Date(now - 1000).toISOString();
  const base = { deviceId: "mba2", lastSeen: stamp, snapshot: { workerRunning: true as const }, logsEnabled: false, recoveryEnabled: false, pending: null, latestCommand: null };
  const state = (status: "forward" | "backward" | "idle" | "kicked", phase: "training" | "weights_uploading" | "merging_partitions" = "training") => ({ phase, status, observedAt: stamp });
  for (const appRunning of [false, undefined] as const) {
    const gui = appRunning === undefined ? {} : { appRunning };
    expect(agentPhase({ ...base, snapshot: { ...gui, workerRunning: true, trainingState: state("forward") } }, now)).toBe("working");
    expect(agentPhase({ ...base, snapshot: { ...gui, workerRunning: true, trainingState: state("backward") } }, now)).toBe("working");
    expect(agentPhase({ ...base, snapshot: { ...gui, workerRunning: true, trainingState: state("idle") } }, now)).toBe("running");
    expect(agentPhase({ ...base, snapshot: { ...gui, workerRunning: true, queue: { position: 4, observedAt: stamp }, trainingState: state("idle") } }, now)).toBe("queued");
    expect(agentPhase({ ...base, snapshot: { ...gui, workerRunning: true, trainingState: state("kicked") } }, now)).toBe("blocked");
    expect(agentPhase({ ...base, snapshot: { ...gui, workerRunning: true, trainingState: { phase: "weights_uploading", status: "idle", observedAt: stamp } } }, now)).toBe("uploading");
    expect(agentPhase({ ...base, snapshot: { ...gui, workerRunning: true, trainingState: { phase: "merging_partitions", status: "idle", observedAt: stamp } } }, now)).toBe("merging");
    expect(agentPhase({ ...base, snapshot: { ...gui, workerRunning: true, trainingState: { ...state("forward"), observedAt: new Date(now - 300001).toISOString() } } }, now)).toBe("running");
  }
  expect(agentPhase({ ...base, lastSeen: new Date(now - 90001).toISOString(), snapshot: { appRunning: false, workerRunning: true, trainingState: state("forward") } }, now)).toBe("offline");
  expect(agentPhase({ ...base, snapshot: { appRunning: false, workerRunning: false } }, now)).toBe("stopped");
  expect(agentPhase({ ...base, snapshot: { appRunning: true, workerRunning: false } }, now)).toBe("workerStopped");
  expect(agentPhase({ ...base, snapshot: { workerRunning: false } }, now)).toBe("unknown");
  expect(agentPhase({ ...base, snapshot: { appRunning: false } }, now)).toBe("stopped");
  expect(agentPhase({ ...base, snapshot: {} }, now)).toBe("unknown");
});

it("notifies only for newer releases and never offers a downgrade", async()=>{
  const {agentUpdateAvailable,AGENT_RELEASE}=await import("./device-agent");
  expect(agentUpdateAvailable("1.0.5")).toBe(true);
  for(const version of [AGENT_RELEASE,"1.0.10","1.1.0","2.0.0","invalid",undefined]) expect(agentUpdateAvailable(version)).toBe(false);
});
