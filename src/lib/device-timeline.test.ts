import { expect, it } from "vitest";
import { deviceTimeline } from "./device-timeline";
import type { DeviceTimelinePoint } from "./device-agent";

function point(minutes: number, snapshot: Partial<DeviceTimelinePoint["snapshot"]> = {}) {
  const sampledAt = new Date(Date.UTC(2026, 10, 20, 0, minutes)).toISOString();
  return { sampledAt, snapshot: { appRunning: true, workerRunning: true, ...snapshot } };
}

it("distinguishes a confirmed drop, an idle miner start, and a return to actual training", () => {
  const initial = point(0, {
    trainingState: { phase: "training", status: "forward", observedAt: point(0).sampledAt },
  });
  const drop = point(5, {
    reason: { code: "kicked", observedAt: point(5).sampledAt },
    idleBnt: { state: "starting", hashrate: null },
    idleXds: { state: "starting", hashrate: null },
  });
  const queue = point(10, {
    queue: { position: 126, observedAt: point(10).sampledAt },
    idleBnt: { state: "mining", hashrate: 4.82 },
    idleXds: { state: "mining", hashrate: 327.4 },
  });
  const resumed = point(15, {
    trainingState: { phase: "training", status: "forward", observedAt: point(15).sampledAt },
    idleBnt: { state: "priority", hashrate: null },
    idleXds: { state: "priority", hashrate: null },
  });
  const events = deviceTimeline([initial, drop, queue, resumed], true);
  expect(events).toEqual(expect.arrayContaining([
    expect.objectContaining({ project: "iota", state: "blocked", reason: { code: "kicked", observedAt: drop.sampledAt } }),
    expect.objectContaining({ project: "iota", state: "queued", position: 126 }),
    expect.objectContaining({ project: "bnt", state: "mining", started: true, hashrate: 4.82 }),
    expect.objectContaining({ project: "xds", state: "mining", started: true, hashrate: 327.4 }),
    expect.objectContaining({ project: "iota", state: "resumed", at: resumed.sampledAt }),
  ]));
  expect(deviceTimeline([initial, queue], true)).toContainEqual(
    expect.objectContaining({ project: "iota", state: "requeued" }),
  );
});

it("reports observations and gaps without inventing start or recovery events", () => {
  const mining = { state: "mining" as const, hashrate: 4.82 };
  const events = deviceTimeline([point(0, { idleBnt: mining }), point(15, { idleBnt: mining })], false);
  expect(events).toEqual([
    expect.objectContaining({ project: "bnt", started: false }),
    expect.objectContaining({ project: null, state: "gap" }),
    expect.objectContaining({ project: "bnt", started: false }),
  ]);
});
