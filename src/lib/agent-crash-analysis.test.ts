import { it, expect, vi } from "vitest";
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
import { processAgentCrashAnalysis } from "./agent-crash-analysis.server";
const job = {
  id: "11111111-1111-4111-8111-111111111111",
  lease: "22222222-2222-4222-8222-222222222222",
  locale: "ja",
  logs: "[10:00] password=supersecret\n[10:01] panic process aborted with SIGABRT",
};
const result = {
  summary: "異常終了しました",
  confidence: "medium" as const,
  findings: [{ title: "停止", explanation: "SIGABRT", lines: [2] }],
  nextSteps: ["再起動前に確認"],
  unknowns: [],
};
it("redacts before the model, carries website language, saves cited evidence only", async () => {
  const rpc = vi.fn().mockResolvedValueOnce(job).mockResolvedValue({ ok: true });
  const model = vi.fn().mockResolvedValue(result);
  expect(
    await processAgentCrashAnalysis(
      rpc,
      { key: "test", base: "https://fitzapi.fishai.com.cn/v1", model: "Qwen/Qwen3.5-4B" },
      model,
    ),
  ).toEqual({ processed: 1 });
  expect(model.mock.calls[0]![1].locale).toBe("ja");
  expect(JSON.stringify(model.mock.calls)).not.toContain("supersecret");
  const saved = rpc.mock.calls[1]![3] as any;
  expect(saved.locale).toBe("ja");
  expect(saved.evidence).toHaveLength(1);
  expect(saved).not.toHaveProperty("logs");
});
it("model failure is retried by the durable queue instead of blocking heartbeats", async () => {
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  const rpc = vi.fn().mockResolvedValueOnce(job).mockResolvedValue({ ok: true });
  await processAgentCrashAnalysis(
    rpc,
    { key: "test", base: "https://fitzapi.fishai.com.cn/v1", model: "Qwen/Qwen3.5-4B" },
    vi.fn().mockRejectedValue(new Error("provider failure")),
  );
  expect(rpc.mock.calls[1]!.slice(0, 3)).toEqual(["fail", job.id, job.lease]);
  expect(warning).toHaveBeenCalledWith("[agent-crash-analysis]", {
    code: "analysis_processing_failed",
    jobId: job.id,
  });
  expect(JSON.stringify(warning.mock.calls)).not.toContain("provider failure");
  warning.mockRestore();
});
it("retains only the HTTP status code when the provider rejects a request", async () => {
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  const rpc = vi.fn().mockResolvedValueOnce(job).mockResolvedValue({ ok: true });
  await processAgentCrashAnalysis(
    rpc,
    { key: "test", base: "https://fitzapi.fishai.com.cn/v1", model: "Qwen/Qwen3.5-4B" },
    vi.fn().mockRejectedValue(new Error("analysis_http_401")),
  );
  expect(warning).toHaveBeenCalledWith("[agent-crash-analysis]", {
    code: "analysis_http_401",
    jobId: job.id,
  });
  warning.mockRestore();
});
it("does not claim paid work until the AI service is configured", async () => {
  const rpc = vi.fn();
  expect(await processAgentCrashAnalysis(rpc, null)).toEqual({ processed: 0 });
  expect(rpc).not.toHaveBeenCalled();
});
