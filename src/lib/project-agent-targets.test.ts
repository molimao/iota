import { it, expect } from "vitest";
import { iotaAgentTargets } from "./project-agent-targets";
import { reviewDevices } from "@/components/fleet-review-data";
import type { AgentInfo } from "./device-agent";
const devices = reviewDevices(),
  agent = (id: string): AgentInfo => ({
    deviceId: id,
    lastSeen: null,
    snapshot: {},
    pending: null,
    latestCommand: null,
    logsEnabled: false,
    recoveryEnabled: false,
  });
it("includes only the IOTA devices in the current project filter", () => {
  const result = iotaAgentTargets(
    devices,
    [agent("studio"), agent("gpu"), agent("mini")],
    ["sample-studio-iota"],
  );
  expect(result.agents.map((a) => a.deviceId)).toEqual(["studio"]);
  expect(Object.keys(result.names)).toEqual(["studio"]);
});
it("offers unpaired IOTA devices without treating pool workers as controllable Macs", () => {
  const result = iotaAgentTargets(
    devices,
    [agent("mini")],
    ["sample-laptop-iota", "sample-mini-xid"],
  );
  expect(result.agents).toEqual([]);
  expect(result.unpaired).toEqual([{ id: "laptop", name: "MacBook Pro" }]);
  expect(iotaAgentTargets(devices, [agent("studio")], ["Mac Studio"]).agents).toEqual([]);
});
