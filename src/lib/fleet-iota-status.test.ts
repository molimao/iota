import { describe, expect, it } from "vitest";
import { fleetIotaStatus } from "./fleet-iota-status";
describe("IOTA fleet status", () => {
  it("preserves complete roster negative results", () => {
    expect(fleetIotaStatus("idle", false)).toBe("idle");
    expect(fleetIotaStatus("not_found", false)).toBe("notFound");
    expect(fleetIotaStatus("contributing", false)).toBe("training");
    expect(fleetIotaStatus("waiting", false)).toBe("waiting");
  });
  it("does not present stale or incomplete discovery as a confirmed status", () => {
    expect(fleetIotaStatus("idle", true)).toBe("unavailable");
    expect(fleetIotaStatus("not_found", true)).toBe("unavailable");
    expect(fleetIotaStatus("unknown", false)).toBe("unavailable");
    expect(fleetIotaStatus("refresh_interrupted", false)).toBe("unavailable");
  });
});
