import { it, expect } from "vitest";
import { batchConfirmation, batchCopy } from "./agent-batch-copy";
import { LOCALES } from "@/lib/site";
it("provides all result states and confirmation instructions in each website language", () => {
  for (const locale of LOCALES) {
    const copy = batchCopy(locale);
    expect(Object.values(copy).every((v) => typeof v === "string" && v.length > 0)).toBe(true);
    for (const key of [
      "queued",
      "claimed",
      "failed",
      "expired",
      "offline",
      "busy",
      "unavailable",
      "verifying",
      "noHeartbeat",
      "workerStopped",
      "running",
      "working",
      "waiting",
      "missing",
    ] as const)
      expect(copy[key]).toBeTruthy();
  }
});

it("uses an action and device count in every confirmation", () => {
  for (const locale of LOCALES) {
    const labels = (["start", "stop", "restart", "update"] as const).map(
      (action) => batchConfirmation(batchCopy(locale), action, 3),
    );
    expect(new Set(labels).size).toBe(4);
    for (const label of labels) {
      expect(label).toContain("3");
      expect(label).not.toMatch(/\{.*?\}/);
    }
  }
  expect(batchConfirmation(batchCopy("en"), "update", 1)).toBe("Update Agent on 1 Mac");
  expect(batchConfirmation(batchCopy("en"), "update", 3)).toBe("Update Agent on 3 Macs");
});
