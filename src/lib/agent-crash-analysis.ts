import { z } from "zod";
import { savedAnalysis } from "./log-analysis";
import { LOCALES } from "./site";
export const agentAnalysisState = z.object({
  eligible: z.boolean(),
  enabled: z.boolean(),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        status: z.enum(["queued", "running", "done", "failed", "cancelled", "limited"]),
        locale: z.enum(LOCALES),
        created_at: z.string(),
        result: savedAnalysis.nullable(),
      }),
    )
    .max(5),
});
