import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { HardwareCalculator } from "@/components/hardware-calculator";
import { HARDWARE_MODELS, CALCULATOR_PROJECTS, type CalculatorProject } from "@/lib/hardware-yield";
import { calculatorHead } from "@/lib/calculator-discovery";
import { isLocale } from "@/lib/site";
export const Route = createFileRoute("/$locale/calculator/{-$project}")({
  validateSearch: z.object({
    project: z.enum(CALCULATOR_PROJECTS).optional().catch(undefined),
    gpu: z
      .preprocess(
        (value) => (typeof value === "number" ? String(value) : value),
        z.enum(HARDWARE_MODELS),
      )
      .optional()
      .catch(undefined),
    hours: z.coerce.number().int().min(1).max(24).optional().catch(undefined),
    cost: z.coerce.number().min(0).max(10).optional().catch(undefined),
  }),
  beforeLoad: ({ params }) => {
    if (params.project && !CALCULATOR_PROJECTS.includes(params.project as CalculatorProject))
      throw notFound();
  },
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "zh",
      project = params.project as CalculatorProject | undefined;
    return calculatorHead(locale, project);
  },
  component: Page,
});
function Page() {
  const { project } = Route.useParams();
  const search = Route.useSearch();
  return (
    <HardwareCalculator
      key={project ?? "all"}
      project={project as CalculatorProject | undefined}
      initialProject={search.project}
      initialModel={search.gpu ?? "4090"}
      initialHours={search.hours ?? 24}
      initialCost={search.cost ?? 0.1}
    />
  );
}
