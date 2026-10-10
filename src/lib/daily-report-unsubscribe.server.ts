import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { watchDb } from "./watch-db";
import { isLocale } from "./site";
import { reportCopy } from "@/components/daily-report-copy";
import { escapeEmail } from "./daily-report-email";
const headers = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex,nofollow",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};
/** GET is a confirmation only: security scanners must not unsubscribe a user. */
export async function reportUnsubscribe(request: Request) {
  const url = new URL(request.url),
    token = url.searchParams.get("token"),
    raw = url.searchParams.get("locale"),
    l = isLocale(raw ?? undefined) ? (raw as "zh" | "zh-TW" | "en" | "ko" | "ja") : "zh";
  if (!z.string().uuid().safeParse(token).success)
    return new Response("Invalid link", { status: 400, headers });
  const enc = escapeEmail;
  if (request.method === "POST") {
    const r = await watchDb(supabaseAdmin).rpc("watch_report_unsubscribe", { p_token: token! });
    if (r.error) return new Response("Please try again", { status: 503, headers });
    return new Response(
      `<html lang="${l}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:Arial;padding:48px;color:#222"><h1 style="font-size:24px">${enc(reportCopy.stopped[l])}</h1><a href="/${l}/devices?view=membership">IOTA Watch</a></body></html>`,
      { headers },
    );
  }
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers });
  return new Response(
    `<html lang="${l}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:Arial;padding:48px;color:#222"><p>IOTA Watch</p><h1 style="font-size:24px">${enc(reportCopy.unsubscribe[l])}</h1><form method="POST"><button style="background:#222;color:white;border:0;border-radius:7px;padding:14px 22px;font-size:15px">${enc(reportCopy.confirm[l])}</button></form></body></html>`,
    { headers },
  );
}
