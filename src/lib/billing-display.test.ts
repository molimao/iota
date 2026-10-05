import { expect, it } from "vitest";
import { annualMonthlyEquivalent, annualSavingPercent, copyValues } from "./billing-display";
it("shows the actual annual charge separately from a rounded equivalent and conservative savings", () => {
  expect(annualMonthlyEquivalent).toBe("1.41");
  expect(annualSavingPercent).toBe(51);
  expect(copyValues("{project}: {count} / 5", { project: "IOTA", count: 5 })).toBe("IOTA: 5 / 5");
});
