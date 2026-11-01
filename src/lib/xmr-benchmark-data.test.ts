import { it, expect } from "vitest";
import { selectXmrigCandidate, parseXmrigBenchmark } from "./xmr-benchmark-data";
import benchmarks from "./xmr-benchmarks.json";
// Required fields retained from the public record linked in the generated dataset.
const m3 = benchmarks.find((b) => b.model === "m3-8c")!;
const raw = {
  id: m3.recordId,
  status: 3,
  algo: "rx/0",
  os: "macos",
  cpu: { brand: m3.chip, cores: m3.cores, packages: 1 },
  threads: m3.threads,
  size: m3.hashes,
  duration: m3.durationMs,
  version: m3.version,
  done_ts: m3.benchmarkAt,
};
const candidate = (id: string, hashrate: number, patch: Record<string, unknown> = {}) => ({
  id,
  hashrate,
  size: 1000000,
  algo: "rx/0",
  status: 3,
  os: "macos",
  threads: 8,
  cpu: { brand: "Apple M2", packages: 1 },
  ...patch,
});
it("selects the lower median matching submission rather than a peak or unrelated workload", () => {
  const result = selectXmrigCandidate(
    [
      candidate("a", 1000),
      candidate("b", 2000),
      candidate("c", 3000),
      candidate("d", 4000),
      candidate("bad", 9999, { status: 1 }),
      candidate("wrongalgo", 9999, { algo: "rx/wow" }),
      candidate("linux", 9999, { os: "linux" }),
      candidate("wrongchip", 9999, { cpu: { brand: "Apple M3", packages: 1 } }),
      candidate("wrongthreads", 9999, { threads: 4 }),
      candidate("multicpu", 9999, { cpu: { brand: "Apple M2", packages: 2 } }),
    ],
    "Apple M2",
    8,
  );
  expect(result).toEqual({ id: "b", submissionCount: 4 });
});
it("reads a real validated record and keeps RAM, power and uploader details out of estimates", () => {
  const result = parseXmrigBenchmark(
    { ...raw, user: "unneeded uploader", seed: "unneeded seed" },
    { chip: "Apple M3", cores: 8 },
  );
  expect(result.hashrate).toBeCloseTo(m3.hashrate, 5);
  expect(result.source).toBe(m3.source);
  expect(result).toMatchObject({ cores: 8, threads: 8, watts: null, memoryGb: null });
  expect(result).not.toHaveProperty("user");
  expect(result).not.toHaveProperty("seed");
});
it("rejects unverified results, wrong algorithms and mismatched physical cores", () => {
  for (const patch of [
    { status: 1 },
    { algo: "rx/wow" },
    { os: "windows" },
    { threads: 7 },
    { cpu: { brand: "Apple M3", cores: 10, packages: 1 } },
    { cpu: { brand: "Apple M2", cores: 8, packages: 1 } },
  ])
    expect(() =>
      parseXmrigBenchmark({ ...raw, ...patch }, { chip: "Apple M3", cores: 8 }),
    ).toThrow();
});
it("does not produce an invented benchmark for a missing chip or malformed source", () => {
  expect(() => selectXmrigCandidate([candidate("a", 1000)], "Apple M3", 8)).toThrow();
  expect(() => selectXmrigCandidate({ results: [] }, "Apple M2", 8)).toThrow();
});
