import { it, expect } from "vitest";
import { batchItemState, type BatchItem } from "./agent-batch";
const now = Date.parse("2026-10-26T10:00:00Z"),
  stamp = new Date(now).toISOString();
const item: BatchItem = {
  deviceId: "11111111-1111-4111-8111-111111111111",
  name: "Mac",
  disposition: "queued",
  commandId: "22222222-2222-4222-8222-222222222222",
  status: "done",
  finishedAt: stamp,
  lastSeen: stamp,
  snapshot: { workerRunning: true },
};
it("verifies stop against a new stopped snapshot rather than a restart success state", () => {
  expect(
    batchItemState({ ...item, snapshot: { workerRunning: false, appRunning: false } }, now, "stop"),
  ).toBe("stopped");
  expect(batchItemState(item, now, "stop")).toBe("verifyingStop");
  expect(
    batchItemState(
      { ...item, lastSeen: new Date(now + 121000).toISOString() },
      now + 121000,
      "stop",
    ),
  ).toBe("stopUnconfirmed");
});
it("does not equate a successful launch command with active training", () => {
  expect(batchItemState(item, now)).toBe("running");
  expect(batchItemState({ ...item, snapshot: { workerRunning: false } }, now)).toBe("verifying");
  expect(
    batchItemState(
      {
        ...item,
        snapshot: { workerRunning: false },
        lastSeen: new Date(now + 121000).toISOString(),
      },
      now + 121000,
    ),
  ).toBe("workerStopped");
});
it("requires a fresh post-command heartbeat and distinguishes queue from work", () => {
  expect(batchItemState({ ...item, lastSeen: new Date(now - 1).toISOString() }, now)).toBe(
    "noHeartbeat",
  );
  expect(batchItemState(item, now + 61000)).toBe("noHeartbeat");
  expect(
    batchItemState(
      { ...item, snapshot: { workerRunning: true, queue: { position: 12, observedAt: stamp } } },
      now,
    ),
  ).toBe("waiting");
  expect(
    batchItemState(
      {
        ...item,
        snapshot: {
          workerRunning: true,
          trainingState: { phase: "training", status: "forward", observedAt: stamp },
        },
      },
      now,
    ),
  ).toBe("working");
  expect(
    batchItemState(
      {
        ...item,
        snapshot: {
          workerRunning: true,
          trainingState: {
            phase: "training",
            status: "forward",
            observedAt: new Date(now - 1000).toISOString(),
          },
        },
      },
      now,
    ),
  ).toBe("running");
});
it("keeps skips, failures and expired commands visible instead of claiming recovery", () => {
  for (const state of ["offline", "busy", "unavailable"] as const)
    expect(batchItemState({ ...item, disposition: state }, now)).toBe(state);
  for (const state of ["queued", "claimed", "failed", "expired"] as const)
    expect(batchItemState({ ...item, status: state }, now)).toBe(state);
  expect(batchItemState({ ...item, status: null }, now)).toBe("unavailable");
});
