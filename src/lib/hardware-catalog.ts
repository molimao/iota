import {
  HARDWARE_MODELS,
  hardwareYieldSchema,
  type CalculatorProject,
  type HardwareModel,
} from "./hardware-yield";
import gpuSeeds from "./hardware-yield-snapshot.json";
import macSeeds from "./mac-yield-snapshot.json";
const records = [...gpuSeeds, ...macSeeds].map((s) => hardwareYieldSchema.parse(s));
export const HARDWARE_CATALOG = HARDWARE_MODELS.map((model) => {
  const entries = records.filter((s) => s.model === model);
  return { ...entries[0]!, rows: entries.flatMap((s) => s.rows) };
});
export function calculatorModels(project?: CalculatorProject) {
  return HARDWARE_MODELS.filter(
    (model) =>
      !project ||
      HARDWARE_CATALOG.find((s) => s.model === model)!.rows.some((r) => r.project === project),
  );
}
export function calculatorModelForProject(model: HardwareModel, project?: CalculatorProject) {
  const models = calculatorModels(project);
  return models.includes(model) ? model : models[0]!;
}
