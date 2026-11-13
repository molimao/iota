import { expect, it } from "vitest";
import { idleMiningActivity } from "./idle-bnt-activity";
const now = Date.parse("2026-11-13T01:00:00Z"),
  start = Date.parse("2026-11-12T16:00:00Z");
const sample = (minutes: number, state = "mining", deviceId = "a") => ({
  deviceId,
  at: new Date(start + minutes * 60000).toISOString(),
  state,
});
it("counts adjacent mining samples across devices, excluding gaps and priority transitions", () => {
  const result = idleMiningActivity(
    [
      sample(0),
      sample(5),
      sample(10, "priority"),
      sample(15),
      sample(20),
      sample(40),
      sample(45),
      sample(0, "mining", "b"),
      sample(5, "mining", "b"),
    ],
    now,
  );
  expect(result.minutes).toBe(20);
});
it("clips observations at Hong Kong midnight and excludes future observations", () => {
  expect(idleMiningActivity([sample(-2), sample(3), sample(600)], now).minutes).toBe(3);
});
it("keeps missing duration distinct from a verified zero", () => {
  expect(idleMiningActivity([], now).minutes).toBeNull();
  expect(idleMiningActivity([sample(0)], now).minutes).toBeNull();
  expect(idleMiningActivity([sample(0, "priority"), sample(5, "priority")], now).minutes).toBe(0);
});
it("handles unordered samples without double counting a duplicate observation", () => {
  expect(idleMiningActivity([sample(5), sample(0), sample(5), sample(10)], now).minutes).toBe(10);
});
