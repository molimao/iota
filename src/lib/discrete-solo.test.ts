import { describe, expect, it } from "vitest";
import { parseDiscreteSoloBatch } from "./discrete.server";

const mined = {
  height: 101,
  hash: "ab".repeat(32),
  timestamp: 1794202805,
  transactions: [
    {
      coinbase: true,
      transaction: { extra: "07" + "12".repeat(1952) + "0201ab", vout: [{ amount: 5183 }] },
    },
    { coinbase: false, transaction: { vout: [{ amount: 10400 }] } },
  ],
};

describe("Discrete solo block reads", () => {
  it("uses the coinbase output amount and ignores ordinary transfers and the extra nonce", () => {
    const [block] = parseDiscreteSoloBatch({ status: "OK", blocks: [mined] }, 101, 1);
    expect(block).toMatchObject({ height: 101, rewardUnits: 5183 });
    expect(block?.miner).toHaveLength(64);
  });

  it("rejects an incomplete or non-contiguous range", () => {
    expect(() => parseDiscreteSoloBatch({ status: "OK", blocks: [mined] }, 101, 2)).toThrow();
    expect(() => parseDiscreteSoloBatch({ status: "OK", blocks: [mined] }, 102, 1)).toThrow();
  });

  it("rejects a block without an attributable coinbase output", () => {
    const block = {
      ...mined,
      transactions: [{ coinbase: true, transaction: { extra: "", vout: [{ amount: 5183 }] } }],
    };
    expect(() => parseDiscreteSoloBatch({ status: "OK", blocks: [block] }, 101, 1)).toThrow();
  });
});
