import { expect, it } from "vitest";
import { validTscAddress, parseTscBalance, tscAmount } from "./tensorcash";
import { validBinding } from "./fleet";
import { readTscBalance } from "./tensorcash.server";
const address = "tc1qmvalge7mnhct9qj5uua8rn0dmjcyh6fmvrr46j";
const input = {
  data: {
    address,
    confirmed_balance: { units: "7196704318503", precision: 8 },
    mempool_effect: { units: null, state: "unknown", precision: 8 },
  },
};
it("validates native mainnet checksum rather than only its prefix", () => {
  expect(validTscAddress(address)).toBe(true);
  expect(validBinding("tsc", address)).toBe(true);
  expect(validTscAddress(address.slice(0, -1) + "x")).toBe(false);
  expect(validTscAddress(address.toUpperCase())).toBe(false);
  expect(validTscAddress(address.replace("tc1", "bc1"))).toBe(false);
});
it("preserves exact satoshis and separates a wallet balance from mining earnings", () => {
  const d = parseTscBalance(input, address);
  expect(d.balanceExact).toBe("71967.04318503");
  expect(d.reward).toBeNull();
  expect(d.online).toBeNull();
  expect(d.pendingBalanceExact).toBeNull();
  expect(d.scope).toBe("provider");
  expect(tscAmount({ units: "1", precision: 8 })).toBe("0.00000001");
  expect(tscAmount({ units: "0", precision: 8 })).toBe("0");
  expect(tscAmount({ units: "-1", precision: 8 })).toBe("-0.00000001");
  expect(tscAmount({ units: null, state: "unknown", precision: 8 })).toBeNull();
  expect(() => parseTscBalance({ data: { ...input.data, address: "different" } }, address)).toThrow(
    "invalid-data",
  );
});
it("fails over only to the other fixed official host without touching keys or signing", async () => {
  const urls: string[] = [];
  const f = (async (url: RequestInfo | URL) => {
    urls.push(String(url));
    return urls.length === 1 ? new Response("syncing", { status: 503 }) : Response.json(input);
  }) as typeof fetch;
  expect((await readTscBalance(address, f)).balanceExact).toBe("71967.04318503");
  expect(urls).toEqual([
    `https://api.tensorcash.org/v1/addresses/${address}/balance`,
    `https://api2.tensorcash.org/v1/addresses/${address}/balance`,
  ]);
});

it("retains wallet balance in overview once without claiming daily mining income", async () => {
  const { earningsBoard } = await import("./earnings-board");
  const d = parseTscBalance(input, address);
  const binding = {
    id: "a",
    project: "tsc" as const,
    identifier: address,
    pool: "chain" as const,
    worker: "",
  };
  const data = {
    status: "wallet" as const,
    activity: "—",
    today: null,
    lifetime: null,
    unit: "TSC",
    scope: "wallet" as const,
    source: "TensorCash Mainnet",
    updated: "now",
    health: "fresh" as const,
    accountSummary: { kind: "balance" as const, amount: d.balanceExact!, unit: "TSC" },
  };
  const board = earningsBoard([
    { binding, deviceId: "first", data },
    { binding: { ...binding, id: "b" }, deviceId: "second", data },
  ]);
  expect(board.projects).toHaveLength(1);
  expect(board.projects[0]?.accounts).toHaveLength(1);
  expect(board.projects[0]?.metrics.size).toBe(0);
});
