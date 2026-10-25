import { distinctRuns, type OfficialRun } from "@/lib/iota-run";
import { IotaRunLabels } from "./iota-run-labels";

export function IotaPublicRunLabels({
  runs,
  showEmpty = true,
  layout = "inline",
  emptyText,
}: {
  runs: Array<OfficialRun | null | undefined>;
  showEmpty?: boolean;
  layout?: "inline" | "row";
  emptyText?: string | undefined;
  preview?: boolean;
}) {
  const values = distinctRuns(runs).filter((run) => run.kind !== "reference");
  return (
    <IotaRunLabels
      runs={values}
      showEmpty={showEmpty}
      layout={layout}
      emptyText={emptyText}
    />
  );
}
