import { createHash, timingSafeEqual } from "node:crypto";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

/** Prefer a report-only credential; keep managed auth for older installations. */
export async function authenticateReportCron(request: Request): Promise<Response | null> {
  const current = process.env["DAILY_REPORTS_CRON_SECRET"];
  if (!current) return authenticateCronRequest(request);
  if (current.length < 32) return new Response("Server configuration error", { status: 500 });
  const token = /^Bearer ([^\s,]+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
  if (!token) return new Response("Unauthorized", { status: 401 });
  const hash = (v: string) => createHash("sha256").update(v, "utf8").digest();
  const supplied = hash(token),
    previous = process.env["DAILY_REPORTS_CRON_SECRET_PREVIOUS"];
  const a = timingSafeEqual(supplied, hash(current));
  const b = timingSafeEqual(supplied, hash(previous && previous.length >= 32 ? previous : current));
  return a || b ? null : new Response("Unauthorized", { status: 401 });
}
