import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { watchDb } from "./watch-db";
import { analysisState, logAnalysisInput, prepareAnalysisLog, savedAnalysis } from "./log-analysis";
import type { Json } from "@/integrations/supabase/types";
const safeError = (message: string) =>
  new Error(
    [
      "pro_required",
      "analysis_daily_limit",
      "analysis_rate_limit",
      "request_mismatch",
      "analysis_request_unavailable",
    ].find((s) => message.includes(s)) ?? "analysis_unavailable",
  );
export const getLogAnalyses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await watchDb(context.supabase).rpc("watch_log_analysis", { p_action: "list" });
    if (r.error) throw safeError(r.error.message);
    return analysisState.parse(r.data);
  });
export const analyzeMiningLog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(logAnalysisInput)
  .handler(async ({ context, data }) => {
    const { logAiConfig, interpretLog } = await import("./log-analysis.server");
    const config = logAiConfig(process.env);
    if (!config) throw new Error("analysis_not_configured");
    const lines = prepareAnalysisLog(data.logs);
    const { createHash } = await import("node:crypto");
    const digest = createHash("sha256")
      .update(JSON.stringify({ project: data.project, locale: data.locale, lines }))
      .digest("hex");
    const db = watchDb(context.supabase);
    const reserved = await db.rpc("watch_log_analysis", {
      p_action: "reserve",
      p_request: data.requestId,
      p_digest: digest,
      p_project: data.project,
    });
    if (reserved.error) throw safeError(reserved.error.message);
    const job = reserved.data as { fresh: boolean; status: string; result: unknown };
    if (!job.fresh) {
      if (job.status === "done") return savedAnalysis.parse(job.result);
      throw new Error("analysis_request_unavailable");
    }
    try {
      const result = await interpretLog(config, {
        project: data.project,
        locale: data.locale,
        lines,
      });
      const output = savedAnalysis.parse({
        ...result,
        locale: data.locale,
        evidence: [...new Set(result.findings.flatMap((f) => f.lines))].map((line) => ({
          line,
          text: lines[line - 1]!.slice(0, 300),
        })),
      });
      const completed = await db.rpc("watch_log_analysis", {
        p_action: "complete",
        p_request: data.requestId,
        p_result: output as unknown as Json,
      });
      if (completed.error) throw new Error("analysis_unavailable");
      return output;
    } catch {
      await db.rpc("watch_log_analysis", { p_action: "fail", p_request: data.requestId });
      throw new Error("analysis_unavailable");
    }
  });
