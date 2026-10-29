import { BNT_REFERENCE_USD } from "@/lib/reference-prices";
import { formatUsd } from "@/lib/earnings";
import { localized } from "@/lib/product-discovery";
import { useLocale } from "./site/locale";
const label = localized(["固定参考价", "固定參考價", "Fixed reference price", "고정 참고 가격", "固定参考価格"]);
export function BntReferenceNote() {
  const { locale } = useLocale();
  return <small>{label[locale]} · ${BNT_REFERENCE_USD.toFixed(2)}/BNT</small>;
}
export function BntUsdEstimate({ amount }: { amount: number | string | null | undefined }) {
  const n = typeof amount === "string" && amount.trim() ? Number(amount.replaceAll(",", "")) : amount;
  if (typeof n !== "number" || !Number.isFinite(n) || n < 0) return null;
  return <small className="project-metric-usd">≈ {formatUsd(n * BNT_REFERENCE_USD)} USD · <BntReferenceNote /></small>;
}
