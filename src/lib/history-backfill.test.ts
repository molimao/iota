import { expect, it } from "vitest";
import {
  iotaHistoricalResource,
  buildHistoricalReports,
  historyDays,
  historyResources,
} from "./history-backfill";
import { preferredEarningsProject, preferredEarningsDays, dailySnapshotSchema } from "./pro-tools";
import { reportDayWindow } from "./daily-report";
const stamp = (day: string, seconds = 0) => reportDayWindow(day).start / 1000 + seconds;
const now = Date.parse("2026-10-11T04:00:00Z");
it("reconstructs only observed Beijing event days, preserves exact native values and does not invent prices or gap zeros", () => {
  const r = iotaHistoricalResource(
    "miner",
    {
      alpha_amounts: [0.1, 0.2, 9, 0.4, 900],
      timestamps: [
        stamp("2026-10-06"),
        stamp("2026-10-06", 3600),
        stamp("2026-10-07"),
        stamp("2026-10-09", 86399),
        stamp("2026-10-10"),
      ],
      statuses: ["settled", "pending", "frozen", "settled", "settled"],
    },
    "2026-10-05",
    "2026-10-09",
    now,
  );
  expect(r.days.map((d) => [d.day, d.units])).toEqual([
    ["2026-10-06", "30000000"],
    ["2026-10-07", "0"],
    ["2026-10-09", "40000000"],
  ]);
  expect(r.days.every((d) => d.usd === null && d.partial)).toBe(true);
  expect(historyDays("2026-10-05", "2026-10-09")).toHaveLength(5);
  expect(() => historyDays("2026-01-01", "2026-10-09")).toThrow("invalid_history_range");
});
it("does not turn unknown statuses, malformed alignment or empty histories into zero-income days", () => {
  const r = iotaHistoricalResource(
    "miner",
    { alpha_amounts: [1], timestamps: [stamp("2026-10-06")], statuses: ["unknown"] },
    "2026-10-05",
    "2026-10-09",
    now,
  );
  expect(r.days[0]?.units).toBeNull();
  expect(
    iotaHistoricalResource(
      "miner",
      { alpha_amounts: [], timestamps: [], statuses: [] },
      "2026-10-05",
      "2026-10-09",
      now,
    ).days,
  ).toEqual([]);
  expect(() =>
    iotaHistoricalResource(
      "miner",
      { alpha_amounts: [1], timestamps: [], statuses: ["settled"] },
      "2026-10-05",
      "2026-10-09",
      now,
    ),
  ).toThrow("invalid_history");
});
it("keeps each owner/device identifier separate and labels shared-account rewards without redistributing them", () => {
  const bindings = [
    { project: "iota" as const, identifier: "a", device: "one" },
    { project: "iota" as const, identifier: "b", device: "two" },
    { project: "quantus" as const, identifier: "wallet", device: "two" },
    { project: "quantus" as const, identifier: "wallet", device: "three" },
  ];
  expect(historyResources(bindings)).toHaveLength(3);
  const day = "2026-10-06",
    record = (units: string) => [{ day, units, usd: null, partial: true, fetchedAt: now }];
  const rows = buildHistoricalReports(
    bindings,
    [
      { project: "iota", resource: "a", days: record("100000000") },
      { project: "iota", resource: "b", days: record("200000000") },
      { project: "quantus", resource: "wallet", days: record("1000000000000") },
    ],
    "2026-10-05",
    "2026-10-09",
    "en",
    now,
  );
  expect(rows).toHaveLength(1);
  expect(dailySnapshotSchema.parse(rows[0]!.report)).toMatchObject({
    source: "backfill",
    usdSubtotal: null,
    projects: [
      { project: "iota", amount: "3", partial: true },
      { project: "quantus", amount: "1" },
    ],
  });
  expect(rows[0]!.devices[0]!.deviceReport.projects[0]?.amount).toBe("1");
  expect(rows[0]!.devices[1]!.deviceReport.projects[0]?.amount).toBe("2");
  expect(rows[0]!.devices[2]!.deviceReport.projects).toEqual([]);
  expect(rows[0]!.devices[2]!.walletProjects).toEqual(["quantus"]);
});
it("rejects missing, duplicated, cross-resource and out-of-window source data", () => {
  const b = [{ project: "iota" as const, identifier: "a", device: "one" }],
    r = {
      project: "iota" as const,
      resource: "a",
      days: [{ day: "2026-10-06", units: "1", usd: null, partial: true, fetchedAt: now }],
    };
  expect(() => buildHistoricalReports(b, [], "2026-10-05", "2026-10-09", "en", now)).toThrow(
    "incomplete_history_sources",
  );
  expect(() => buildHistoricalReports(b, [r, r], "2026-10-05", "2026-10-09", "en", now)).toThrow(
    "invalid_history_resource",
  );
  expect(() =>
    buildHistoricalReports(b, [{ ...r, resource: "other" }], "2026-10-05", "2026-10-09", "en", now),
  ).toThrow("invalid_history_resource");
  expect(() =>
    buildHistoricalReports(
      b,
      [{ ...r, days: [...r.days, ...r.days] }],
      "2026-10-05",
      "2026-10-09",
      "en",
      now,
    ),
  ).toThrow("invalid_history_days");
  expect(() =>
    buildHistoricalReports(
      b,
      [{ ...r, days: [{ ...r.days[0]!, day: "2026-10-10" }] }],
      "2026-10-05",
      "2026-10-09",
      "en",
      now,
    ),
  ).toThrow("invalid_history_days");
});
it("does not create fake archived days for projects without a daily ledger", () => {
  expect(
    buildHistoricalReports(
      [{ project: "xid", identifier: "wallet", device: "one" }],
      [{ project: "xid", resource: "wallet", reason: "unsupported", days: [] }],
      "2026-10-05",
      "2026-10-09",
      "en",
      now,
    ),
  ).toEqual([]);
});
it("uses a labeled native trend when past prices are unknown and retains USD when coverage exists", () => {
  const rows = buildHistoricalReports(
    [{ project: "iota", identifier: "a", device: "one" }],
    [
      {
        project: "iota",
        resource: "a",
        days: ["2026-10-06", "2026-10-07"].map((day) => ({
          day,
          units: "0",
          usd: null,
          partial: true,
          fetchedAt: now,
        })),
      },
    ],
    "2026-10-05",
    "2026-10-09",
    "en",
    now,
  ).map((r) => r.report);
  expect(preferredEarningsProject(rows)).toBe("iota");
  expect(preferredEarningsProject(rows.map((r) => ({ ...r, usdSubtotal: 0 })))).toBe("all");
  expect(preferredEarningsProject(rows.slice(0, 1))).toBe("all");
  expect(preferredEarningsDays(rows, "iota", now)).toBe(30);
  expect(preferredEarningsDays([{ ...rows[0]!, day: "2026-08-01" }, rows[1]!], "iota", now)).toBe(
    90,
  );
});
