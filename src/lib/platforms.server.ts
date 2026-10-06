import { ReadCache } from "./read-cache";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { watchDb } from "./watch-db";
import { openCredential, sealCredential } from "./connection-crypto.server";
import { readPrivatePlatform, readPublicPlatform } from "./platforms-upstream.server";
import type { PlatformResult, PrivatePlatform } from "./platforms";
const cache = new ReadCache();
function safeError(e: unknown): NonNullable<PlatformResult["error"]> {
  const code = e instanceof Error ? e.message : "";
  return ["not-found", "invalid-data", "expired", "connect-required", "not-configured"].includes(
    code,
  )
    ? (code as NonNullable<PlatformResult["error"]>)
    : "unavailable";
}
async function cached(
  key: string,
  read: () => Promise<NonNullable<PlatformResult["data"]>>,
): Promise<PlatformResult> {
  return (await cache.read(key, read, { ttl: 300000, classify: safeError })) as PlatformResult;
}
export const publicPlatform = (project: "akash" | "golem", id: string) =>
  cached(`public:${project}:${id}`, () => readPublicPlatform(project, id));
function encryptionKey() {
  const key = process.env["WATCH_CONNECTION_ENCRYPTION_KEY"];
  if (!key || !/^[A-Za-z0-9+/]{43}=$/.test(key)) throw new Error("not-configured");
  return key;
}
const db = () => watchDb(supabaseAdmin);
async function connection(user: string, project: PrivatePlatform) {
  const r = await db()
    .from("watch_connections")
    .select("ciphertext,revision,expires_at")
    .eq("user_id", user)
    .eq("project", project)
    .maybeSingle();
  if (r.error) throw new Error("not-configured");
  return r.data;
}
export async function connectionStatus(user: string, project: PrivatePlatform) {
  try {
    encryptionKey();
    const row = await connection(user, project);
    return {
      configured: true,
      connected: !!row && Date.parse(row.expires_at) > Date.now(),
      expiresAt: row?.expires_at ?? null,
    };
  } catch {
    return { configured: false, connected: false, expiresAt: null };
  }
}
export async function saveConnection(
  user: string,
  project: PrivatePlatform,
  token: string,
  id: string,
) {
  try {
    const secret = encryptionKey();
    // A successful authenticated device read is required before saving a credential.
    await readPrivatePlatform(project, id, token);
    const ciphertext = await sealCredential(token, user, project, secret);
    const expires_at = new Date(Date.now() + 7 * 86400000).toISOString();
    const r = await db()
      .from("watch_connections")
      .upsert(
        { user_id: user, project, ciphertext, revision: crypto.randomUUID(), expires_at },
        { onConflict: "user_id,project" },
      );
    if (r.error) throw new Error("not-configured");
    clearUser(user, project);
    return { ok: true, error: null };
  } catch (e) {
    return { ok: false, error: safeError(e) };
  }
}
function clearUser(user: string, project: PrivatePlatform) {
  cache.clearPrefix(`${user}:${project}:`);
}
export async function removeConnection(user: string, project: PrivatePlatform) {
  const r = await db()
    .from("watch_connections")
    .delete()
    .eq("user_id", user)
    .eq("project", project);
  if (r.error) return { ok: false };
  clearUser(user, project);
  return { ok: true };
}
export async function privatePlatform(
  user: string,
  project: PrivatePlatform,
  id: string,
): Promise<PlatformResult> {
  try {
    const row = await connection(user, project);
    if (!row) return { data: null, fetchedAt: null, error: "connect-required" };
    if (Date.parse(row.expires_at) <= Date.now())
      return { data: null, fetchedAt: null, error: "expired" };
    const secret = encryptionKey();
    let token: string;
    try {
      token = await openCredential(row.ciphertext, user, project, secret);
    } catch {
      throw new Error("expired");
    }
    return await cached(
      `${user}:${project}:${row.revision}:${id}:${Math.floor(Date.now() / 86400000)}:${Math.floor((Date.now() + 28800000) / 86400000)}`,
      () => readPrivatePlatform(project, id, token),
    );
  } catch (e) {
    return { data: null, fetchedAt: null, error: safeError(e) };
  }
}
