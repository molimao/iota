import { PLANS } from "./plans";
export const annualSavingPercent = Math.floor(
  (1 - PLANS.pro.annualCents / (PLANS.pro.monthlyCents * 12)) * 100,
);
export const annualMonthlyEquivalent = (PLANS.pro.annualCents / 1200).toFixed(2);
export function copyValues(text: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll("{" + key + "}", String(value)),
    text,
  );
}
