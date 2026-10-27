import { describe, it, expect } from "vitest";
import { fleetSnapshot } from "./fleet-policy";
const snapshot = (plan: string, limit: number) => ({
  devices: [],
  plan,
  projectDeviceLimit: limit,
  quotaScope: "per_project",
});
describe("the device API validates the current plan quota", () => {
  it("accepts a newly signed-in Free account with the database's three-device quota", () => {
    expect(fleetSnapshot(snapshot("free", 3))).toMatchObject({
      plan: "free",
      projectDeviceLimit: 3,
      devices: [],
    });
  });
  it("accepts Pro and trial access with the hundred-device quota", () => {
    expect(fleetSnapshot(snapshot("pro", 100)).projectDeviceLimit).toBe(100);
  });
  it("rejects stale and mismatched quotas without upgrading access", () => {
    expect(fleetSnapshot(snapshot("free", 5)).projectDeviceLimit).toBe(5);
    expect(fleetSnapshot(snapshot("pro", 50)).projectDeviceLimit).toBe(50);
    expect(() => fleetSnapshot(snapshot("free", 100))).toThrow("invalid-fleet-plan");
    expect(() => fleetSnapshot(snapshot("pro", 5))).toThrow("invalid-fleet-plan");
  });
});
