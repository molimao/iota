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
