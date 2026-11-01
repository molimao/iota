import { z } from "zod";
const candidateSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9]+$/),
  size: z.number().nonnegative(),
  algo: z.string(),
  status: z.number(),
  hashrate: z.number().nonnegative(),
  threads: z.number().int().nonnegative(),
  os: z.string(),
  cpu: z.object({ brand: z.string(), packages: z.number().int().positive() }),
});
export function selectXmrigCandidate(payload: unknown, chip: string, threads: number) {
  const candidates = candidateSchema
    .array()
    .parse(payload)
    .filter(
      (b) =>
        b.cpu.brand === chip &&
        b.cpu.packages === 1 &&
        b.threads === threads &&
        b.algo === "rx/0" &&
        b.status === 3 &&
        b.os === "macos" &&
        b.size >= 1000000 &&
        b.hashrate > 0,
    )
    .sort((a, b) => a.hashrate - b.hashrate);
  const selected = candidates[Math.floor((candidates.length - 1) / 2)];
  if (!selected) throw Error("No verified matching XMRig benchmark");
  return { id: selected.id, submissionCount: candidates.length };
}
export function parseXmrigBenchmark(payload: unknown, expected: { chip: string; cores: number }) {
  const b = z
    .object({
      id: z.string().regex(/^[A-Za-z0-9]+$/),
      status: z.literal(3),
      algo: z.literal("rx/0"),
      os: z.literal("macos"),
      cpu: z.object({
        brand: z.literal(expected.chip),
        cores: z.literal(expected.cores),
        packages: z.literal(1),
      }),
      threads: z.literal(expected.cores),
      size: z.number().min(1000000).max(10000000),
      duration: z.number().positive(),
      version: z.string(),
      done_ts: z.number().positive(),
    })
    .parse(payload);
  return {
    id: b.id,
    chip: b.cpu.brand,
    cores: b.cpu.cores,
    threads: b.threads,
    hashrate: (b.size * 1000) / b.duration,
    version: b.version,
    benchmarkAt: b.done_ts,
    durationMs: b.duration,
    hashes: b.size,
    source: `https://xmrig.com/benchmark/${b.id}`,
    memoryGb: null,
    watts: null,
  };
}
