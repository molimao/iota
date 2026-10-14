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
