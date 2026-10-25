import { expect, it } from "vitest";
import { iotaDeviceDisplay } from "./iota-device-display";
import type { AgentInfo } from "./device-agent";
const now = Date.parse("2026-10-25T12:00:00Z");
const agent: AgentInfo = {
  deviceId: "company",
  lastSeen: new Date(now - 1000).toISOString(),
  snapshot: { appRunning: true, workerRunning: true },
  logsEnabled: false,
  recoveryEnabled: false,
  pending: null,
  latestCommand: null,
};
it("shows a live company worker as running rather than missing from the public roster", () => {
  expect(iotaDeviceDisplay("not_found", agent, false, now)).toMatchObject({
    phase: "running",
    bucket: "pending",
  });
});
it("lets heartbeat freshness expire without waiting for a new server response", () => {
  expect(iotaDeviceDisplay("not_found", agent, false, now + 61000).phase).toBeNull();
  expect(iotaDeviceDisplay("not_found", agent, true, now).phase).toBeNull();
  expect(iotaDeviceDisplay("not_found", undefined, false, now).phase).toBeNull();
});
it("keeps fresh stop and queue evidence distinct from contribution", () => {
  const stopped = { ...agent, snapshot: { appRunning: true, workerRunning: false } };
  expect(iotaDeviceDisplay("not_found", stopped, false, now)).toMatchObject({
    phase: "workerStopped",
    bucket: "attention",
  });
  const queued = {
    ...agent,
    snapshot: {
      ...agent.snapshot,
      queue: { position: 3, observedAt: new Date(now).toISOString() },
    },
  };
  expect(iotaDeviceDisplay("not_found", queued, false, now)).toMatchObject({
    phase: "queued",
    bucket: "waiting",
  });
  expect(iotaDeviceDisplay("contributing", agent, false, now).phase).toBeNull();
});
