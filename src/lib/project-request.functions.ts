import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { watchDb } from "./watch-db";
import {
  projectRequestSchema,
  type ProjectRequestResult,
  type ProjectRequestStatus,
} from "./project-request";
export const getProjectRequestStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ProjectRequestStatus | null> => {
    const { data, error } = await watchDb(context.supabase).rpc("watch_project_request_status");
    if (
      error ||
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      typeof data["canSubmit"] !== "boolean" ||
      typeof data["nextAt"] !== "string"
    )
      return null;
    return { canSubmit: data["canSubmit"], nextAt: data["nextAt"] };
  });
export const submitProjectRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const parsed = projectRequestSchema.safeParse(input);
    if (!parsed.success) throw new Error("invalid_project_request");
    return parsed.data;
  })
  .handler(async ({ context, data }): Promise<ProjectRequestResult> => {
    const r = await watchDb(context.supabase).rpc("watch_submit_project_request", {
      p_request: data.requestId,
      p_name: data.name,
      p_url: data.url,
      p_description: data.description,
      p_locale: data.locale,
    });
    if (r.error || !r.data || typeof r.data !== "object" || Array.isArray(r.data))
      return { status: "unavailable", nextAt: null };
    const status = r.data["status"];
    if (
      (status !== "submitted" && status !== "daily-limit") ||
      typeof r.data["nextAt"] !== "string"
    )
      return { status: "unavailable", nextAt: null };
    return { status, nextAt: r.data["nextAt"] };
  });
