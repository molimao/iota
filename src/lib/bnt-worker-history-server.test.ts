import { beforeEach, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
const m = vi.hoisted(() => ({ pool: vi.fn(), admin: vi.fn() }));
vi.mock("./pool-monitor.server", () => ({ readPoolAccount: m.pool }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { rpc: m.admin } }));
import { sampleBntWorkers } from "./bnt-worker-history.server";
beforeEach(() => {
  vi.clearAllMocks();
});
it("checks ownership before requesting or persisting pool data", async () => {
  const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "denied" } });
  await expect(
    sampleBntWorkers({ rpc } as unknown as SupabaseClient, "owner", "address"),
  ).rejects.toThrow();
  expect(m.pool).not.toHaveBeenCalled();
  expect(m.admin).not.toHaveBeenCalled();
});
it("does not turn stale data into new observations or drop existing history", async () => {
  const samples = [{ at: 1000, workers: [{ name: "a", hashrate: 1 }] }];
  const rpc = vi.fn().mockResolvedValue({ data: samples, error: null });
  m.pool.mockResolvedValue({
    data: { workers: [] },
    error: null,
    stale: true,
    fetchedAt: Date.now(),
  });
  expect(await sampleBntWorkers({ rpc } as unknown as SupabaseClient, "owner", "address")).toEqual({
    samples,
    sampling: false,
  });
  expect(m.admin).not.toHaveBeenCalled();
});
it("records only server-fetched Worker observations and reads the owner-scoped result", async () => {
  const now = Date.now();
  const before = [{ at: now - 300000, workers: [{ name: "a", hashrate: 2 }] }];
  const after = [...before, { at: now, workers: [{ name: "a", hashrate: 0 }] }];
  const rpc = vi
    .fn()
    .mockResolvedValueOnce({ data: before, error: null })
    .mockResolvedValueOnce({ data: after, error: null });
  m.pool.mockResolvedValue({
    data: { workers: [{ name: "a", hashrate: 0 }] },
    error: null,
    fetchedAt: now,
  });
  m.admin.mockResolvedValue({ data: true, error: null });
  expect(await sampleBntWorkers({ rpc } as unknown as SupabaseClient, "owner", "address")).toEqual({
    samples: after,
    sampling: true,
  });
  expect(m.admin).toHaveBeenCalledWith("watch_bnt_worker_history_record", {
    p_user: "owner",
    p_address: "address",
    p_at: new Date(now).toISOString(),
    p_workers: [{ name: "a", hashrate: 0 }],
  });
});
