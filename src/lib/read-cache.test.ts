import { afterEach, describe, expect, it, vi } from "vitest";
import { ReadCache, retainReadResult, type ReadResult } from "./read-cache";
import { hongKongMonth, readQuery } from "./read-query";
import { QueryClient } from "@tanstack/react-query";
afterEach(() => vi.useRealTimers());
describe("source cache reliability", () => {
  it("coalesces concurrent calls, retains original clock and backs off failures", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-06T12:00:00Z"));
    const cache = new ReadCache(),
      read = vi.fn(async () => ({ reward: 4 }));
    const [a, b] = await Promise.all([cache.read("one", read), cache.read("one", read)]);
    expect(read).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
    vi.advanceTimersByTime(61000);
    const fail = vi.fn(async () => {
      throw new Error("offline");
    });
    const result = await cache.read("one", fail);
    expect(result).toMatchObject({ data: { reward: 4 }, stale: true, fetchedAt: a.fetchedAt });
    await cache.read("one", fail, { force: true });
    expect(fail).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(5001);
    await cache.read("one", read);
    expect(read).toHaveBeenCalledTimes(2);
  });
  it("honors bounded retry-after even on manual refresh and never retries unauthorized snapshots", async () => {
    vi.useFakeTimers();
    const cache = new ReadCache();
    const fail = vi.fn(async () => {
      throw Object.assign(new Error("busy"), { retryAfterMs: 60000 });
    });
    await cache.read("one", fail);
    vi.advanceTimersByTime(15000);
    await cache.read("one", fail, { force: true });
    expect(fail).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(45001);
    await cache.read("one", fail);
    expect(fail).toHaveBeenCalledTimes(2);
    const ok = await cache.read("private:alice", async () => ({ reward: 3 }));
    vi.advanceTimersByTime(61000);
    const expired = await cache.read(
      "private:alice",
      async () => {
        throw new Error("expired");
      },
      { classify: () => "expired" },
    );
    expect(ok.data).not.toBeNull();
    expect(expired.data).toBeNull();
  });
  it("bounds retained snapshots and keeps successful empty responses", () => {
    const now = Date.now();
    const old: ReadResult<unknown> = {
      data: { reward: 2 },
      fetchedAt: now - 60000,
      error: null,
      stale: false,
    };
    const fail: ReadResult<unknown> = {
      data: null,
      fetchedAt: null,
      error: "unavailable",
      stale: false,
    };
    expect(retainReadResult(fail, old, now).data).toEqual(old.data);
    expect(retainReadResult(fail, old, now + 30 * 60000).data).toBeNull();
    for (const error of ["expired", "not-found", "connect-required", "not-configured"])
      expect(retainReadResult({ ...fail, error }, old, now).data).toBeNull();
    expect(retainReadResult({ data: [], fetchedAt: now, error: null }, old, now).data).toEqual([]);
  });
  it("isolates identities and can clear the disconnected user without touching other users", async () => {
    const cache = new ReadCache();
    await cache.read("alice:vast:1", async () => 1);
    await cache.read("bob:vast:1", async () => 2);
    cache.clearPrefix("alice:vast:");
    const a = vi.fn(async () => 3),
      b = vi.fn(async () => 4);
    expect((await cache.read("alice:vast:1", a)).data).toBe(3);
    expect((await cache.read("bob:vast:1", b)).data).toBe(2);
    expect(b).not.toHaveBeenCalled();
  });
  it("retains a query snapshot across a fresh server failure without leaking it to another key", async () => {
    const client = new QueryClient(),
      key = ["platform", "alice", "12"],
      good = { data: { reward: 3 }, fetchedAt: Date.now(), error: null };
    client.setQueryData(key, good);
    const bad = async () => ({ data: null, fetchedAt: null, error: "unavailable" });
    expect(await readQuery(client, key, bad).queryFn()).toMatchObject({
      data: good.data,
      stale: true,
      fetchedAt: good.fetchedAt,
    });
    expect((await readQuery(client, ["platform", "bob", "12"], bad).queryFn()).data).toBeNull();
  });
  it("uses the Hong Kong calendar month at the UTC boundary", () => {
    expect(hongKongMonth(Date.parse("2026-09-30T16:01:00Z"))).toBe("2026-10");
    expect(hongKongMonth(Date.parse("2026-09-30T15:59:00Z"))).toBe("2026-09");
  });
});

it("clears a private cached reading when the website session is rejected", async () => {
  const client = new QueryClient();
  const key = ["private", "alice"];
  client.setQueryData(key, { data: { reward: 4 }, fetchedAt: Date.now(), error: null });
  const result = await readQuery(
    client,
    key,
    async () => {
      throw new Error("Unauthorized: Invalid token");
    },
    { private: true },
  ).queryFn();
  expect(result).toMatchObject({ data: null, error: "expired" });
});
