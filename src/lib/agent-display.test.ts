import { describe, expect, it } from "vitest";
import { agentDisplayPhase, type AgentInfo, type OfficialTrainingEvidence } from "./device-agent";
const now = Date.parse("2026-10-17T12:00:00Z");
const stamp = new Date(now - 1000).toISOString();
const agent: AgentInfo = { deviceId: "test", lastSeen: stamp, snapshot: {appRunning: true, workerRunning: true, trainingState: {phase: "training", status: "idle", observedAt: stamp}}, logsEnabled: false, recoveryEnabled: false, pending: null, latestCommand: null };
const positive: OfficialTrainingEvidence = {status: "contributing", fetchedAt: now - 2000};
describe("combined IOTA training display", () => {
  it("uses positive official throughput rather than interpreting idle as no work", () => {
    expect(agentDisplayPhase(agent, positive, now)).toBe("training");
    expect(agentDisplayPhase(agent, {...positive, status: "waiting"}, now)).toBe("waiting");
    expect(agentDisplayPhase(agent, undefined, now)).toBe("running");
  });
  it("does not turn missing, failed, stale or future statistics into training or waiting", () => {
    for (const evidence of [ {...positive, fetchedAt: null}, {...positive, fetchedAt: now - 300001}, {...positive, fetchedAt: now + 6000}, {...positive, status: "refresh_interrupted" as const}, {...positive, status: "not_found" as const} ])
      expect(agentDisplayPhase(agent, evidence, now)).toBe("running");
  });
  it("preserves explicit stop, offline, queue and transition evidence", () => {
    expect(agentDisplayPhase({...agent, lastSeen: null}, positive, now)).toBe("offline");
    expect(agentDisplayPhase({...agent, snapshot: {...agent.snapshot, appRunning: false}}, positive, now)).toBe("stopped");
    expect(agentDisplayPhase({...agent, snapshot: {...agent.snapshot, workerRunning: false}}, positive, now)).toBe("workerStopped");
    expect(agentDisplayPhase({...agent, snapshot: {...agent.snapshot, queue: {position: 5, observedAt: stamp}}}, positive, now)).toBe("queued");
    for (const [phase, status, expected] of [["weights_uploading", "idle", "uploading"], ["merging_partitions", "idle", "merging"], ["training", "frozen", "preparing"], ["training", "kicked", "blocked"]] as const)
      expect(agentDisplayPhase({...agent, snapshot: {...agent.snapshot, trainingState: {phase, status, observedAt: stamp}}}, positive, now)).toBe(expected);
  });
  it("does not erase positive local computation with a zero statistics sample", () => {
    expect(agentDisplayPhase({...agent, snapshot: {...agent.snapshot, trainingState: {phase: "training", status: "forward", observedAt: stamp}}}, {...positive, status: "waiting"}, now)).toBe("working");
  });
});
