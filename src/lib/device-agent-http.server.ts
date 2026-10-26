import { withDeadline } from "./deadline";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { agentBeat, agentBindingManifest, redactAgentLog } from "./device-agent";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { watchDb } from "./watch-db";
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
const reply = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "cache-control": "no-store" } });
async function body(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("invalid");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid");
  const deadline = Date.now() + 12000;
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const v = await withDeadline(reader.read(), Math.max(0, deadline - Date.now()), "timeout");
      if (v.done) break;
      size += v.value.length;
      if (size > 20000) throw new Error("invalid");
      chunks.push(v.value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const bytes = new Uint8Array(size);
  let pos = 0;
  for (const c of chunks) {
    bytes.set(c, pos);
    pos += c.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}
/** Device credentials never appear in URLs or errors. No browser session can impersonate an agent. */
export async function deviceAgentHttp(request: Request) {
  if (request.method !== "POST") return reply({ error: "method_not_allowed" }, 405);
  try {
    const path = new URL(request.url).pathname;
    if (path === "/api/device-agent/pair") {
      const { token } = z
        .object({ token: z.string().regex(/^[A-Za-z0-9_-]{43}$/) })
        .strict()
        .parse(await body(request));
      const credential = randomBytes(32).toString("base64url");
      const r = await watchDb(supabaseAdmin).rpc("watch_agent_exchange", {
        p_action: "pair",
        p_hash: hash(token),
        p_payload: { credentialHash: hash(credential) },
      });
      if (r.error) return reply({ error: "pairing_expired_or_used" }, 401);
      return reply({ credential, interval: 15 });
    }
    if (path !== "/api/device-agent/heartbeat") return reply({ error: "not_found" }, 404);
    const auth = request.headers.get("authorization") ?? "";
    if (!/^Bearer [A-Za-z0-9_-]{43}$/.test(auth)) return reply({ error: "unauthorized" }, 401);
    const data = agentBeat.parse(await body(request));
    if (data.snapshot.logs) data.snapshot.logs = redactAgentLog(data.snapshot.logs);
    const r = await watchDb(supabaseAdmin).rpc("watch_agent_exchange", {
      p_action: "heartbeat",
      p_hash: hash(auth.slice(7)),
      p_payload: data,
    });
    if (r.error)
      return reply(
        { error: r.error.message.includes("rate_limited") ? "rate_limited" : "unauthorized" },
        r.error.message.includes("rate_limited") ? 429 : 401,
      );
    // Python 3.9 (shipped with macOS) accepts 3 or 6 fractional digits,
    // while Postgres omits trailing zeroes. Keep the existing agent wire format compatible.
    const result = r.data;
    if (result && typeof result === "object" && !Array.isArray(result)) {
      if (data.requestBindings) {
        // Optional: a missing migration must not block an IOTA heartbeat/command.
        try {
          const manifest = await withDeadline(
            Promise.resolve(
              watchDb(supabaseAdmin).rpc("watch_agent_binding_manifest", {
                p_hash: hash(auth.slice(7)),
              }),
            ),
            1500,
            "manifest_timeout",
          );
          const parsed = agentBindingManifest.safeParse(manifest.data);
          result["bindings"] = !manifest.error && parsed.success ? parsed.data : [];
        } catch {
          result["bindings"] = [];
        }
      }
      const command = result["command"];
      if (
        command &&
        typeof command === "object" &&
        !Array.isArray(command) &&
        typeof command["expiresAt"] === "string"
      ) {
        command["expiresAt"] = new Date(command["expiresAt"]).toISOString();
      }
    }
    return reply(result);
  } catch {
    return reply({ error: "invalid_request" }, 400);
  }
}
