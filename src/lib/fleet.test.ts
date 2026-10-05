import { describe, expect, it } from "vitest";
import {
  canLinkProject,
  projectDeviceCount,
  projectQuotaState,
  type FleetDevice,
  type FleetProject,
} from "./fleet";
import { PLANS, paidAccess } from "./plans";

function device(id: string, projects: FleetProject[]): FleetDevice {
  return {
    id,
    name: id,
    hardware: "",
    createdAt: 1,
    bindings: projects.map((project, i) => ({
      id: `${id}-${i}`,
      project,
      identifier: `${id}-${i}`,
      worker: "",
    })),
  };
}

describe("independent project quotas", () => {
  it("allows 5 devices in every project, even when the device view contains 20", () => {
    const projects: FleetProject[] = ["iota", "xid", "quantus", "flyai"];
    const devices = projects.flatMap((p) =>
      Array.from({ length: 5 }, (_, i) => device(`${p}-${i}`, [p])),
    );
    expect(devices).toHaveLength(20);
    for (const project of projects) {
      expect(projectQuotaState(devices, project, PLANS.free.projectDeviceLimit)).toMatchObject({
        count: 5,
        remaining: 0,
        canAdd: false,
      });
    }
  });

  it("an exhausted IOTA quota does not block XID on an existing or new device", () => {
    const devices = [
      ...Array.from({ length: 5 }, (_, i) => device(`iota-${i}`, ["iota"])),
      device("new", []),
    ];
    expect(canLinkProject(devices, "new", "iota", 5)).toBe(false);
    expect(canLinkProject(devices, "new", "xid", 5)).toBe(true);
    expect(canLinkProject(devices, "iota-0", "xid", 5)).toBe(true);
  });

  it("counts a shared machine once in each associated project, not as a global slot", () => {
    const devices = [device("shared", ["iota", "xid", "quantus", "iota"])];
    expect(projectDeviceCount(devices, "iota")).toBe(1);
    expect(projectDeviceCount(devices, "xid")).toBe(1);
    expect(projectDeviceCount(devices, "quantus")).toBe(1);
    expect(projectDeviceCount(devices, "flyai")).toBe(0);
  });

  it("preserves over-quota devices after downgrade and allows other projects", () => {
    const devices = Array.from({ length: 8 }, (_, i) => device(`old-${i}`, ["iota"]));
    expect(projectQuotaState(devices, "iota", 5)).toMatchObject({
      count: 8,
      remaining: 0,
      canAdd: false,
    });
    expect(devices).toHaveLength(8);
    expect(canLinkProject(devices, "old-0", "iota", 5)).toBe(true);
    expect(canLinkProject(devices, "old-0", "flyai", 5)).toBe(true);
  });

  it("sets Pro to 50 per project without granting access to unpaid or expired subscriptions", () => {
    expect(PLANS.pro.projectDeviceLimit).toBe(50);
    expect(paidAccess("active", 200, 100)).toBe(true);
    expect(paidAccess("active", 100, 200)).toBe(false);
    expect(paidAccess("incomplete", 200, 100)).toBe(false);
    expect(paidAccess("past_due", 200, 100)).toBe(false);
  });
});
