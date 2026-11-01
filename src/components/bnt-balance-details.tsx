import { bntLabels } from "./bnt-copy";
import { useLocale } from "./site/locale";
export function BntBalanceDetails({
  balance,
  unit = "BNT",
}: {
  unit?: string;
  balance: { queued: number | null; pending: number | null };
}) {
  const { locale } = useLocale();
  return (
    <>
      {(["queued", "pending"] as const)
        .filter((key) => key !== "queued" || unit === "BNT")
        .map((key) => (
          <small key={key}>
            {bntLabels[key === "pending" ? "estimated" : "queued"][locale]} ·{" "}
            {balance[key] === null
              ? "—"
              : new Intl.NumberFormat(locale, { maximumFractionDigits: 8 }).format(
                  balance[key],
                )}{" "}
            {unit}
          </small>
        ))}
    </>
  );
}
