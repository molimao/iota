import { describe, it, expect } from "vitest";
import {
  readAcurastRewards,
  ACURAST_TIMESTAMP_KEY,
  ACURAST_PAID_PREFIX,
  ACURAST_ARCHIVE,
  acuAmount,
  paidReward,
  hkDayStart,
} from "./acurast-rewards.server";
const le = (n: bigint, bytes: number) =>
  "0x" +
  n
    .toString(16)
    .padStart(bytes * 2, "0")
    .match(/../g)!
    .reverse()
    .join("");
const now = Date.parse("2026-10-25T06:00:00Z"),
  day = hkDayStart(now),
  start = day - 2 * 86400000;
const block = (n: number) => "0x" + n.toString(16).padStart(64, "0");
const height = (now - start) / 6000;
function fake(mode: "ok" | "pruned" | "decreasing" | "absent" = "ok") {
  return async (url: string | URL | Request, init?: RequestInit) => {
    expect(url).toBe(ACURAST_ARCHIVE);
    const r = JSON.parse(String(init?.body));
    let result: unknown;
    if (r.method === "chain_getFinalizedHead") result = block(height);
    else if (r.method === "chain_getHeader") result = { number: "0x" + height.toString(16) };
    else if (r.method === "chain_getBlockHash") result = block(r.params[0]);
    else if (r.method === "state_getStorage") {
      const n = parseInt(r.params[1].slice(2), 16),
        time = start + n * 6000;
      if (mode === "pruned" && n < height)
        return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, error: { code: 4003 } }));
      if (r.params[0] === ACURAST_TIMESTAMP_KEY) result = le(BigInt(time), 8);
      else {
        expect(r.params[0]).toBe(ACURAST_PAID_PREFIX + le(67279n, 16).slice(2));
        const paid =
          time < day - 86400000
            ? 2000000000000n
            : time < day
              ? 3500000000000n
              : mode === "decreasing"
                ? 1n
                : 4250000000000n;
        result = mode === "absent" ? null : le(paid, 16) + "0a000000";
      }
    } else throw Error("unexpected method");
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result }));
  };
}
describe("ACU actual paid compute rewards", () => {
  it("reads the manager counter, exact midnight brackets and distinct UTC+8 payout days", async () => {
    const r = await readAcurastRewards(["67279", "67279"], fake(), now);
    expect(r.managers).toEqual([
      { id: "67279", today: "0.75", yesterday: "1.5", cumulative: "4.25" },
    ]);
    expect(r.dayStart).toBe(day);
    expect(r.observedAt).toBe(now);
  });
  it("retains cumulative while historical reads fail; never invents daily zero", async () => {
    const r = await readAcurastRewards(["67279"], fake("pruned"), now);
    expect(r.managers[0]).toEqual({
      id: "67279",
      today: null,
      yesterday: null,
      cumulative: "4.25",
    });
  });
  it("does not turn a regressing counter into negative income", async () => {
    const r = await readAcurastRewards(["67279"], fake("decreasing"), now);
    expect(r.managers[0]?.today).toBeNull();
    expect(r.managers[0]?.yesterday).toBeNull();
  });
  it("represents a confirmed absent payout state as actual zero", async () => {
    const r = await readAcurastRewards(["67279"], fake("absent"), now);
    expect(r.managers[0]).toEqual({ id: "67279", today: "0", yesterday: "0", cumulative: "0" });
  });
  it("preserves 12 decimal units and rejects unexpected layouts", () => {
    expect(acuAmount(1n)).toBe("0.000000000001");
    expect(acuAmount(0n)).toBe("0");
    expect(acuAmount(10000000000000n)).toBe("10");
    expect(paidReward(le(4250000000000n, 16) + "0a000000")).toBe(4250000000000n);
    expect(() => paidReward("0x1234")).toThrow();
  });
});
