import { it, expect } from "vitest";
import { writeFileSync } from "node:fs";
import { interpretLog, logAiConfig } from "./log-analysis.server";
import { prepareAnalysisLog } from "./log-analysis";
it.skipIf(process.env["LOG_AI_LIVE_TEST"] !== "1")(
  "validates the configured model with synthetic logs only",
  async () => {
    const config = logAiConfig(process.env);
    expect(config).not.toBeNull();
    const lines = prepareAnalysisLog(
      "[2026-10-18 10:00:00.000] P2P read timeout\n[2026-10-18 10:00:01.000] Rust panic: missing local CID state for path=0\n[2026-10-18 10:00:02.000] Training process exited with code=null signal=SIGABRT\n[2026-10-18 10:00:03.000] GPU memory 10.66GB / 12.30GB; no explicit out-of-memory error",
    );
    const result = await interpretLog(config!, { project: "iota", locale: "zh", lines });
    expect(result.summary.length).toBeGreaterThan(5);
    expect(result.findings.length).toBeGreaterThan(0);
    for (const finding of result.findings)
      expect(finding.lines.every((n) => n >= 1 && n <= lines.length)).toBe(true);
    writeFileSync(
      "/tmp/iota-ai-synthetic-result.json",
      JSON.stringify({
        ...result,
        evidence: [...new Set(result.findings.flatMap((f) => f.lines))].map((line) => ({
          line,
          text: lines[line - 1]!.slice(0, 300),
        })),
      }),
    );
    console.info("Live synthetic validation passed:", {
      findings: result.findings.length,
      evidenceLines: result.findings.flatMap((f) => f.lines).length,
      hasNextSteps: result.nextSteps.length > 0,
    });
  },
  60000,
);
