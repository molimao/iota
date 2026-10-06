import { expect, it } from "vitest";
import {
  annualMonthlyEquivalent,
  annualSavingPercent,
  copyValues,
  planAmount,
} from "./billing-display";
it("shows the actual annual charge separately from a rounded equivalent and conservative savings", () => {
  expect(annualMonthlyEquivalent).toBe("1.42");
  expect(annualSavingPercent).toBe(52);
  expect(
    copyValues("{project}: {count} / 5", { project: "IOTA", count: 5 }),
  ).toBe("IOTA: 5 / 5");
});

it("uses one price policy for displayed monthly and annual amounts", () => {
  expect(planAmount("month")).toBe("2.99");
  expect(planAmount("year")).toBe("16.99");
});
