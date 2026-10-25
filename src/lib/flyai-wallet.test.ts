import { expect, it } from "vitest";
import { flyaiWalletStats, type FlyaiMonth } from "./flyai";
const data: FlyaiMonth = {
  month: "2026-10",
  endsAt: "2026-11-01T00:00:00Z",
  totalPoints: 200,
  wallets: [
    { wallet: "0xabc", points: 100, share: 0.5 },
    { wallet: "0xdef", points: 100, share: 0.5 },
    { wallet: "0xzero", points: 0, share: 0 },
  ],
};
it("returns wallet month, actual points/share and tied public rank without inventing USD", () => {
  expect(flyaiWalletStats(data, "0xABC")).toEqual({
    month: "2026-10",
    points: 100,
    share: 0.5,
    rank: 1,
    wallets: 3,
  });
  expect(flyaiWalletStats(data, "0xdef")?.rank).toBe(1);
  expect(flyaiWalletStats(data, "0xzero")?.points).toBe(0);
  expect(flyaiWalletStats(data, "missing")).toBeUndefined();
});
