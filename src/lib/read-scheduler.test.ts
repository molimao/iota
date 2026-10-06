import { expect, it } from "vitest";
import { createReadScheduler } from "./read-scheduler";
it("bounds simultaneous public reads and releases slots after failures", async () => {
  const schedule = createReadScheduler(2);
  let active = 0,
    peak = 0;
  const gates: (() => void)[] = [];
  const reads = Array.from({ length: 5 }, (_, i) =>
    schedule(async () => {
      active++;
      peak = Math.max(peak, active);
      await new Promise<void>((resolve) => gates.push(resolve));
      active--;
      if (i === 1) throw new Error("network");
      return i;
    }),
  );
  const done = Promise.allSettled(reads);
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
    await Promise.resolve();
    gates.shift()?.();
  }
  const results = await done;
  expect(peak).toBe(2);
  expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(4);
});
