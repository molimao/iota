import { validTscAddress } from "./tensorcash-address";
export { validTscAddress } from "./tensorcash-address";
import { record } from "./projects";
import { emptyNode, type PlatformNode } from "./platforms";
/** Keep satoshis as integers through formatting; missing data never becomes zero. */
export function tscAmount(value: unknown): string | null {
  const a = record(value);
  if (
    a["state"] !== undefined ||
    a["precision"] !== 8 ||
    typeof a["units"] !== "string" ||
    !/^-?\d{1,30}$/.test(a["units"])
  )
    return null;
  const units = BigInt(a["units"]),
    abs = units < 0n ? -units : units;
  const fraction = (abs % 100000000n).toString().padStart(8, "0").replace(/0+$/, "");
  return `${units < 0n ? "-" : ""}${abs / 100000000n}${fraction ? "." + fraction : ""}`;
}
export function parseTscBalance(input: unknown, id: string): PlatformNode {
  const d = record(record(input)["data"]),
    balance = tscAmount(d["confirmed_balance"]);
  if (!validTscAddress(id) || d["address"] !== id || balance === null || balance.startsWith("-"))
    throw new Error("invalid-data");
  return {
    ...emptyNode(id),
    scope: "provider",
    balanceExact: balance,
    balanceUnit: "TSC",
    rewardUnit: "TSC",
    pendingBalanceExact: tscAmount(d["mempool_effect"]),
  };
}
