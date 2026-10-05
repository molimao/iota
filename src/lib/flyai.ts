import { finite, record } from "./projects";
export type FlyaiMonth = {
  month: string;
  endsAt: string;
  totalPoints: number;
  wallets: { wallet: string; points: number; share: number }[];
};
export function parseFlyaiMonth(input: unknown): FlyaiMonth {
  const data = record(input);
  if (
    typeof data["month"] !== "string" ||
    !/^\d{4}-\d{2}$/.test(data["month"]) ||
    typeof data["ends_at"] !== "string" ||
    !Number.isFinite(Date.parse(data["ends_at"])) ||
    finite(data["total_points"]) === null ||
    !Array.isArray(data["wallets"])
  )
    throw new Error("invalid-data");
  const wallets = data["wallets"].map(record).map((row) => {
    if (
      typeof row["wallet"] !== "string" ||
      !/^0x[0-9a-fA-F]{40}$/.test(row["wallet"]) ||
      finite(row["points"]) === null ||
      finite(row["share"]) === null
    )
      throw new Error("invalid-data");
    return {
      wallet: row["wallet"].toLowerCase(),
      points: row["points"] as number,
      share: row["share"] as number,
    };
  });
  return {
    month: data["month"],
    endsAt: data["ends_at"],
    totalPoints: data["total_points"] as number,
    wallets,
  };
}
