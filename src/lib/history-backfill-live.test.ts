import { it, expect } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import {
  buildHistoricalReports,
  iotaHistoricalResource,
  historyResources,
} from "./history-backfill";
import { preferredEarningsProject } from "./pro-tools";
import type { SiteLocale } from "./site";
import type { FleetProject } from "./fleet";
import type { EntitlementHistory } from "./iota-types";
const path = process.env["IOTA_BACKFILL_FIXTURE"];
it.skipIf(!path)(
  "validates the approved private real-data cohort without any database writes",
  () => {
    const cohort = JSON.parse(readFileSync(path!, "utf8")) as {
      user_id: string;
      project: FleetProject;
      identifier: string;
      device: string;
      locale: SiteLocale;
      start_day: string;
      end_day: string;
    }[];
    const sources = JSON.parse(
      readFileSync(process.env["IOTA_BACKFILL_SOURCES"]!, "utf8"),
    ) as Record<string, { history?: EntitlementHistory; fetchedAt: number; error?: string }>;
    const owners = [...new Set(cohort.map((r) => r.user_id))];
    let days = 0,
      devices = 0,
      positiveDays = 0,
      supported = 0,
      unsupported = 0;
    const summaries = [];
    const prepared = [];
    for (const user of owners) {
      const bindings = cohort.filter((b) => b.user_id === user),
        first = bindings[0]!;
      const data = historyResources(bindings).map((b) => {
        if (b.project === "iota") {
          const source = sources[b.identifier];
          expect(source?.error).toBeUndefined();
          expect(source?.history).toBeDefined();
          return iotaHistoricalResource(
            b.identifier,
            source!.history!,
            first.start_day,
            first.end_day,
            source!.fetchedAt,
          );
        }
        return {
          project: b.project,
          resource: b.identifier,
          reason: b.project === "flyai" ? ("different_period" as const) : ("unsupported" as const),
          days: [],
        };
      });
      const result = buildHistoricalReports(
        bindings,
        data,
        first.start_day,
        first.end_day,
        first.locale,
        Date.now(),
      );
      prepared.push({
        user,
        bindings,
        start: first.start_day,
        end: first.end_day,
        data,
        rows: result,
      });
      expect(result.every((r) => r.report.usdSubtotal === null)).toBe(true);
      if (bindings.some((b) => b.project === "iota")) supported++;
      else unsupported++;
      days += result.length;
      devices += result.reduce((n, r) => n + r.devices.length, 0);
      const positive = result.filter((r) =>
        r.report.projects.some((p) => p.amount !== null && Number(p.amount) > 0),
      ).length;
      positiveDays += positive;
      summaries.push({
        user,
        days: result.length,
        positiveDays: positive,
        defaultProject: preferredEarningsProject(result.map((r) => r.report)),
        firstDay: result[0]?.day,
        lastDay: result.at(-1)?.day,
      });
    }
    expect(supported).toBeGreaterThan(0);
    const summary = {
      accounts: owners.length,
      supported,
      unsupported,
      accountDays: days,
      deviceDays: devices,
      positiveDays,
    };
    writeFileSync(
      process.env["IOTA_BACKFILL_RESULT"] ?? "/private/tmp/iota-backfill-preparation.json",
      JSON.stringify({ summary, accounts: summaries }, null, 2),
      { mode: 0o600 },
    );
    console.info("Backfill preparation:", JSON.stringify(summary));
    const preparedPath = process.env["IOTA_BACKFILL_PREPARED"];
    if (preparedPath) writeFileSync(preparedPath, JSON.stringify(prepared), { mode: 0o600 });
  },
);
