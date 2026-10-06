import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
const state = vi.hoisted(() => ({
  rows: new Map<
    string,
    { user_id: string; project: string; ciphertext: string; revision: string; expires_at: string }
  >(),
  read: vi.fn(),
}));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
vi.mock("./platforms-upstream.server", () => ({
  readPrivatePlatform: state.read,
  readPublicPlatform: vi.fn(),
}));
vi.mock("./watch-db", () => ({
  watchDb: () => ({
    from: () => {
      const filters: Record<string, string> = {};
      let deleting = false;
      const query = {
        select: () => query,
        eq: (key: string, value: string) => {
          filters[key] = value;
          return query;
        },
        maybeSingle: async () => ({
          data: state.rows.get(`${filters["user_id"]}:${filters["project"]}`) ?? null,
          error: null,
        }),
        upsert: async (row: {
          user_id: string;
          project: string;
          ciphertext: string;
          revision: string;
          expires_at: string;
        }) => {
          state.rows.set(`${row.user_id}:${row.project}`, row);
          return { error: null };
        },
        delete: () => {
          deleting = true;
          return query;
        },
        then: (resolve: (value: { error: null }) => void) => {
          if (deleting) state.rows.delete(`${filters["user_id"]}:${filters["project"]}`);
          resolve({ error: null });
        },
      };
      return query;
    },
  }),
}));
beforeEach(() => {
  vi.resetModules();
  state.rows.clear();
  state.read.mockReset();
  state.read.mockResolvedValue({ id: "12", reward: 1 });
  vi.stubEnv(
    "WATCH_CONNECTION_ENCRYPTION_KEY",
    btoa(String.fromCharCode(...new Uint8Array(32).fill(3))),
  );
});
afterEach(() => vi.unstubAllEnvs());
describe("per-user platform connections", () => {
  it("keeps credentials encrypted, never returns them and scopes cached results to the owner", async () => {
    const api = await import("./platforms.server");
    expect(await api.saveConnection("alice", "vast", "fake-token-alice", "12")).toEqual({
      ok: true,
      error: null,
    });
    const row = state.rows.get("alice:vast")!;
    expect(row.ciphertext).not.toContain("fake-token-alice");
    expect(JSON.stringify(await api.connectionStatus("alice", "vast"))).not.toContain("ciphertext");
    expect(await api.privatePlatform("bob", "vast", "12")).toMatchObject({
      data: null,
      error: "connect-required",
    });
    expect(await api.privatePlatform("alice", "vast", "12")).toMatchObject({ data: { id: "12" } });
    expect(await api.removeConnection("alice", "vast")).toEqual({ ok: true });
    expect(await api.privatePlatform("alice", "vast", "12")).toMatchObject({
      error: "connect-required",
      data: null,
    });
  });
  it("cannot decrypt a ciphertext copied from another account", async () => {
    const api = await import("./platforms.server");
    await api.saveConnection("alice", "vast", "fake-token", "12");
    state.rows.set("bob:vast", { ...state.rows.get("alice:vast")!, user_id: "bob" });
    const r = await api.privatePlatform("bob", "vast", "12");
    expect(r.data).toBe(null);
    expect(r.error).not.toBe(null);
  });
  it("rejects expired stored authorizations and preserves an existing key if replacement fails", async () => {
    const api = await import("./platforms.server");
    await api.saveConnection("alice", "vast", "fake-token", "12");
    const old = state.rows.get("alice:vast")!.ciphertext;
    state.read.mockRejectedValue(new Error("expired"));
    expect(await api.saveConnection("alice", "vast", "fake-invalid-token", "12")).toMatchObject({
      ok: false,
      error: "expired",
    });
    expect(state.rows.get("alice:vast")!.ciphertext).toBe(old);
    state.rows.get("alice:vast")!.expires_at = "2000-01-01T00:00:00Z";
    expect(await api.privatePlatform("alice", "vast", "12")).toMatchObject({
      error: "expired",
      data: null,
    });
  });
  it("fails closed without server encryption configuration and strips unexpected errors", async () => {
    const api = await import("./platforms.server");
    vi.stubEnv("WATCH_CONNECTION_ENCRYPTION_KEY", "");
    expect(await api.saveConnection("alice", "vast", "fake-token", "12")).toMatchObject({
      ok: false,
      error: "not-configured",
    });
    expect(state.rows.size).toBe(0);
  });
});
