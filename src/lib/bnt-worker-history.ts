import { z } from "zod";
export const workerSamplesSchema = z
  .array(
    z.object({
      at: z.number().finite().positive(),
      workers: z
        .array(
          z.object({
            name: z.string().max(80),
            hashrate: z.number().finite().nonnegative().nullable(),
          }),
        )
        .max(100),
    }),
  )
  .max(300);
export type WorkerSample = z.infer<typeof workerSamplesSchema>[number];
export type WorkerPoint = { at: number; hashrate: number | null };
export function workerHistoryPoints(
  samples: WorkerSample[],
  name: string,
  now = Date.now(),
): WorkerPoint[] {
  return [
    ...new Map(
      samples
        .filter((s) => s.at <= now && s.at >= now - 86400000)
        .map((s) => [
          s.at,
          { at: s.at, hashrate: s.workers.find((w) => w.name === name)?.hashrate ?? null },
        ]),
    ).values(),
  ].sort((a, b) => a.at - b.at);
}
export function workerSparkline(points: WorkerPoint[]) {
  const start = points[0]?.at ?? 0,
    end = points.at(-1)?.at ?? 0;
  const max = Math.max(1, ...points.flatMap((p) => (p.hashrate == null ? [] : [p.hashrate])));
  const segments: Array<Array<{ x: number; y: number; at: number; hashrate: number }>> = [];
  let segment: Array<{ x: number; y: number; at: number; hashrate: number }> = [];
  for (const [i, p] of points.entries()) {
    if (p.hashrate === null || (i && p.at - points[i - 1]!.at > 900000)) {
      if (segment.length) segments.push(segment);
      segment = [];
    }
    if (p.hashrate !== null)
      segment.push({
        x: start === end ? 196 : 4 + ((p.at - start) / (end - start)) * 192,
        y: 40 - (p.hashrate / max) * 34,
        at: p.at,
        hashrate: p.hashrate,
      });
  }
  if (segment.length) segments.push(segment);
  return segments;
}
