import { it, expect } from "vitest";
import { batchCopy } from "./agent-batch-copy";
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
