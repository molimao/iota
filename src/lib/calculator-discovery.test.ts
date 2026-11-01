import { it, expect } from "vitest";
import { calculatorHead, calculatorDescription } from "./calculator-discovery";
import { calculatorModels, calculatorModelForProject } from "./hardware-catalog";
import { CALCULATOR_PROJECTS } from "./hardware-yield";
import { LOCALES, ORIGIN } from "./site";
import { crawlPages } from "./crawl";
it("switches projects to compatible hardware and preserves compatible choices", () => {
  expect(calculatorModelForProject("4090", "iota")).toBe("m1-pro-32");
  expect(calculatorModelForProject("m4-16", "iota")).toBe("m4-16");
  expect(calculatorModelForProject("m4-16", "bnt")).toBe("5090");
  expect(calculatorModels("iota")).toEqual(["m1-pro-32", "m4-16"]);
});
it("provides unique localized descriptions, canonical URLs and valid structured data for all project landings", () => {
  for (const locale of LOCALES) {
    const descriptions = CALCULATOR_PROJECTS.map((project) =>
      calculatorDescription(locale, project),
    );
    expect(new Set(descriptions).size).toBe(CALCULATOR_PROJECTS.length);
    for (const project of CALCULATOR_PROJECTS) {
      const head = calculatorHead(locale, project);
      expect(head.links).toContainEqual({
        rel: "canonical",
        href: `${ORIGIN}/${locale}/calculator/${project}`,
      });
      expect(head.links.filter((l) => l.rel === "alternate")).toHaveLength(6);
      const schema = JSON.parse(head.scripts[0]!.children);
      expect(schema["@graph"][0].isAccessibleForFree).toBe(true);
      expect(schema["@graph"][1].itemListElement[1].item).toBe(
        `${ORIGIN}/${locale}/calculator/${project}`,
      );
    }
  }
  const iota = calculatorHead("en", "iota");
  expect(iota.meta[0]!.title).not.toContain("4090");
  expect(iota.meta[0]!.title).toContain("M4");
});
it("includes the unified calculator and every project landing in the generated sitemap source", () => {
  expect(crawlPages.filter((p) => p.path === "calculator")).toHaveLength(1);
  for (const project of CALCULATOR_PROJECTS)
    expect(crawlPages.filter((p) => p.path === `calculator/${project}`)).toHaveLength(1);
});
