import { it, expect } from "vitest";
import { buildDeviceSnapshots, deviceReports, deviceEarningsCsv } from "./device-history";
import type { ReportReading } from "./daily-report";
const day = "2026-10-10",
  now = Date.parse("2026-10-11T01:30:00Z");
const coin = (resource: string, units: string | null, usd: number | null): ReportReading => ({
  project: "iota",
  resource,
  units,
  usd,
  decimals: 8,
  currency: "IOTA",
});
it("keeps each device original readings separate from the fleet total", () => {
  const snapshots = buildDeviceSnapshots(
    day,
    [
      { device: "one", project: "iota", identifier: "a" },
      { device: "two", project: "iota", identifier: "b" },
    ],
    [coin("a", "10000000", 1), coin("b", "20000000", 2)],
    "en",
    now,
  );
  expect(snapshots[0]?.deviceReport).toMatchObject({
    usdSubtotal: 1,
    projects: [{ amount: "0.1" }],
  });
  expect(snapshots[1]?.deviceReport).toMatchObject({
    usdSubtotal: 2,
    projects: [{ amount: "0.2" }],
  });
  expect(snapshots[0]?.walletProjects).toEqual([]);
});
it("does not duplicate a shared ledger into several machines; permits a labeled account view", () => {
  const snapshots = buildDeviceSnapshots(
    day,
    [
      { device: "one", project: "iota", identifier: "shared" },
      { device: "one", project: "iota", identifier: "own" },
      { device: "two", project: "iota", identifier: "shared" },
    ],
    [coin("shared", "300000000", 30), coin("own", "50000000", 5)],
    "en",
    now,
  );
  expect(snapshots[0]?.report.usdSubtotal).toBe(35);
  expect(snapshots[0]?.deviceReport.usdSubtotal).toBe(5);
  expect(snapshots[1]?.deviceReport.usdSubtotal).toBeNull();
  expect(snapshots[0]?.walletProjects).toEqual(["iota"]);
  expect(deviceReports(snapshots, "iota")[0]?.usdSubtotal).toBe(35);
  expect(deviceReports(snapshots)[0]?.usdSubtotal).toBe(5);
});
it("keeps account-based Quantus ledger out of the device total even if only one tracked machine uses it", () => {
  const snapshots = buildDeviceSnapshots(
    day,
    [{ device: "one", project: "quantus", identifier: "account" }],
    [
      {
        project: "quantus",
        resource: "account",
        units: "123000000000000",
        decimals: 12,
        currency: "QUAN",
        usd: 10,
      },
    ],
    "zh",
    now,
  );
  expect(snapshots[0]?.report.projects[0]?.amount).toBe("123");
  expect(snapshots[0]?.deviceReport).toMatchObject({
    projects: [],
    usdSubtotal: null,
    partial: true,
  });
  expect(snapshots[0]?.walletProjects).toEqual(["quantus"]);
  expect(deviceEarningsCsv(snapshots)).not.toContain('"123"');
  expect(deviceEarningsCsv(snapshots, "quantus")).toContain('"account"');
  expect(deviceEarningsCsv(snapshots, "quantus", "2026-10")).toContain('"account"');
});
it("keeps missing readings unknown and records valuation and ownership at collection time", () => {
  const snapshot = buildDeviceSnapshots(
    day,
    [{ device: "one", project: "iota", identifier: "a" }],
    [coin("a", null, null)],
    "en",
    now,
    "2026-10-11T01:00:00Z",
  )[0]!;
  expect(snapshot.deviceReport.usdSubtotal).toBeNull();
  expect(snapshot.deviceReport.projects[0]?.amount).toBeNull();
  expect(snapshot.deviceReport.valuationAt).toBe("2026-10-11T01:00:00Z");
  expect(deviceEarningsCsv([snapshot])).toContain('"iota","","IOTA",""');
});
it("deduplicates multiple workers on the same historical reward resource", () => {
  const snapshots = buildDeviceSnapshots(
    day,
    [
      { device: "one", project: "iota", identifier: "a" },
      { device: "one", project: "iota", identifier: "a" },
    ],
    [coin("a", "10000000", 1), coin("a", "10000000", 1)],
    "en",
    now,
  );
  expect(snapshots[0]?.deviceReport.usdSubtotal).toBe(1);
});

it("uses the same first resource snapshot as the fleet when duplicate reads differ", () => {
  const one = buildDeviceSnapshots(
    day,
    [{ device: "one", project: "iota", identifier: "a" }],
    [coin("a", "10000000", 1), coin("a", null, null)],
    "en",
    now,
  )[0]!;
  expect(one.deviceReport.usdSubtotal).toBe(1);
});
