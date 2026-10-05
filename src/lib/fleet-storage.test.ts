import { describe, it, expect, vi, afterEach } from "vitest";
import { FLEET_KEY, type FleetDevice } from "./fleet";
import { loadLocalFleet, localFleetMutation } from "./fleet-storage";

const wallet = (n: number) => "0x" + n.toString(16).padStart(40, "0");
const device = (n: number): FleetDevice => ({
  id: crypto.randomUUID(),
  name: "Same name",
  hardware: "",
  createdAt: 1,
  bindings: [{ id: crypto.randomUUID(), project: "flyai", identifier: wallet(n), worker: "" }],
});
afterEach(() => vi.unstubAllGlobals());
describe("local fleet preserves existing records", () => {
  it("loads all over-quota devices and never merges matching names", () => {
    const devices = Array.from({ length: 8 }, (_, i) => device(i + 1));
    const values = new Map([[FLEET_KEY, JSON.stringify(devices)]]);
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    });
    expect(loadLocalFleet()).toEqual(devices);
    expect(loadLocalFleet()).toHaveLength(8);
  });
  it("blocks only new over-quota project devices, while allowing unlinked records", () => {
    const devices = Array.from({ length: 8 }, (_, i) => device(i + 1));
    expect(() =>
      localFleetMutation(devices, {
        action: "create",
        payload: {
          name: "New",
          hardware: "",
          binding: { project: "flyai", identifier: wallet(9), worker: "" },
        },
      }),
    ).toThrow("project_device_limit_reached");
    expect(devices).toHaveLength(8);
    expect(
      localFleetMutation(devices, {
        action: "create",
        payload: { name: "Unlinked", hardware: "" },
      }),
    ).toHaveLength(9);
    const linked = localFleetMutation(devices, {
      action: "link",
      payload: {
        id: devices[0]!.id,
        binding: { project: "flyai", identifier: wallet(10), worker: "second" },
      },
    });
    expect(linked[0]!.bindings).toHaveLength(2);
    expect(linked).toHaveLength(8);
  });
});
