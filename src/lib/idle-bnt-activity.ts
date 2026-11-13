import { z } from "zod";
export const idleActivitySamples = z.array(
  z.object({
    deviceId: z.string().uuid(),
    at: z.string().datetime({ offset: true }),
    state: z.string(),
  }),
);
export type IdleActivitySample = z.infer<typeof idleActivitySamples>[number];
/** Only adjacent mining observations count; gaps never imply continuous mining. */
export function idleMiningActivity(samples: IdleActivitySample[], now: number) {
  const start = Math.floor((now + 8 * 3600000) / 86400000) * 86400000 - 8 * 3600000;
  const devices = new Map<string, IdleActivitySample[]>();
  for (const sample of samples) {
    const list = devices.get(sample.deviceId) ?? [];
    list.push(sample);
    devices.set(sample.deviceId, list);
  }
  let milliseconds = 0,
    intervals = 0;
  for (const list of devices.values()) {
    list.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
    for (let i = 0; i < list.length; i++) {
      const current = list[i]!,
        at = Date.parse(current.at);
      const previous = list[i - 1];
      if (!previous) continue;
      const before = Date.parse(previous.at),
        gap = at - before;
      if (gap <= 0 || gap > 360000 || at <= start || at > now) continue;
      intervals++;
      if (previous.state === "mining" && current.state === "mining")
        milliseconds += at - Math.max(start, before);
    }
  }
  return { minutes: intervals ? milliseconds / 60000 : null };
}
