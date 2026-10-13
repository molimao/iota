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
  it("accepts Pro and trial access with the fifty-device quota", () => {
    expect(fleetSnapshot(snapshot("pro", 50)).projectDeviceLimit).toBe(50);
  });
  it("rejects stale and mismatched quotas without upgrading access", () => {
    expect(() => fleetSnapshot(snapshot("free", 5))).toThrow();
    expect(() => fleetSnapshot(snapshot("free", 50))).toThrow("invalid-fleet-plan");
    expect(() => fleetSnapshot(snapshot("pro", 3))).toThrow("invalid-fleet-plan");
  });
});
