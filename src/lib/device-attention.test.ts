import { expect, it } from "vitest";
import { deviceAttention } from "./device-attention";
import type { AgentInfo } from "./device-agent";

const now = Date.UTC(2026, 10, 24, 12);
const seen = new Date(now - 10_000).toISOString();
const agent: AgentInfo = {
  deviceId: "a", lastSeen: seen, snapshot: { appRunning: true, workerRunning: true },
  logsEnabled: false, recoveryEnabled: false, pending: null, latestCommand: null,
};

it("keeps queueing, intentional stops and unpaired devices out of attention", () => {
  expect(deviceAttention(undefined, true, now)).toBeNull();
  expect(deviceAttention({ ...agent, snapshot: { appRunning: false, workerRunning: false } }, true, now)).toBeNull();
  expect(deviceAttention({
    ...agent, snapshot: { ...agent.snapshot, queue: { position: 105, observedAt: seen } },
  }, true, now)).toBeNull();
});

it("surfaces only observed offline, interrupted training and idle-miner errors", () => {
  expect(deviceAttention({ ...agent, lastSeen: new Date(now - 90_000).toISOString() }, true, now)).toBe("offline");
  const stopped = { ...agent, snapshot: { ...agent.snapshot, workerRunning: false } };
  expect(deviceAttention(stopped, true, now)).toBe("training");
  expect(deviceAttention(stopped, false, now)).toBeNull();
  expect(deviceAttention({
    ...agent, snapshot: { ...agent.snapshot, idleBnt: { state: "install_error", hashrate: null } },
  }, true, now)).toBe("bnt");
  expect(deviceAttention({
    ...agent, snapshot: { ...agent.snapshot, idleXds: { state: "error", hashrate: null } },
  }, true, now)).toBe("xds");
});
