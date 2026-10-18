import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { watchDb } from "./watch-db";
import { prepareAnalysisLog, savedAnalysis } from "./log-analysis";
import { interpretLog, logAiConfig } from "./log-analysis.server";
import { LOCALES } from "./site";
import type { Json } from "@/integrations/supabase/types";
const jobSchema = z.object({
  id: z.string().uuid(),
  lease: z.string().uuid(),
  locale: z.enum(LOCALES),
  logs: z.string().min(20).max(12000),
});
/** Durable database jobs, never run AI inline in device heartbeats. */
export async function processAgentCrashAnalysis(
  rpc = async (action: string, id?: string, lease?: string, result?: Json) => {
    const r = await watchDb(supabaseAdmin).rpc("watch_agent_analysis_worker", {
      p_action: action,
      ...(id ? { p_id: id } : {}),
      ...(lease ? { p_lease: lease } : {}),
      ...(result ? { p_result: result } : {}),
    });
    if (r.error) throw new Error("agent_analysis_unavailable");
    return r.data;
  },
  config = logAiConfig(process.env),
  model = interpretLog,
) {
  if (!config) return { processed: 0 };
  const raw = await rpc("claim");
  if (!raw) return { processed: 0 };
  const job = jobSchema.parse(raw);
  try {
    const lines = prepareAnalysisLog(job.logs);
    const result = await model(config, { project: "iota", locale: job.locale, lines });
    const output = savedAnalysis.parse({
      ...result,
      locale: job.locale,
      evidence: [...new Set(result.findings.flatMap((f) => f.lines))].map((line) => ({
        line,
        text: lines[line - 1]!.slice(0, 300),
      })),
    });
    const completed = (await rpc("complete", job.id, job.lease, output as unknown as Json)) as {
      ok: boolean;
    };
    return { processed: completed.ok ? 1 : 0 };
  } catch (error) {
    // Log only a bounded failure code. Never log prompts, device excerpts or provider responses.
    const code =
      error instanceof Error &&
      /^analysis_(?:http_[1-5][0-9]{2}|unavailable|invalid_result)$/.test(error.message)
        ? error.message
        : "analysis_processing_failed";
    console.warn("[agent-crash-analysis]", { code, jobId: job.id });
    await rpc("fail", job.id, job.lease);
    return { processed: 0 };
  }
}
