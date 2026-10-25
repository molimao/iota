import { useIotaReferenceRun } from "@/hooks/use-iota-reference-run";
import { distinctRuns, type OfficialRun } from "@/lib/iota-run";
import { IotaRunLabels } from "./iota-run-labels";

export function IotaPublicRunLabels({
  runs,
  showEmpty = true,
  layout = "inline",
  emptyText,
  preview = false,
}: {
  runs: Array<OfficialRun | null | undefined>;
  showEmpty?: boolean;
  layout?: "inline" | "row";
  emptyText?: string | undefined;
  preview?: boolean;
}) {
  const values = distinctRuns(runs);
  const reference = useIotaReferenceRun(!preview && values.length === 0);
  return (
    <IotaRunLabels
      runs={values.length ? values : [reference]}
      showEmpty={showEmpty}
      layout={layout}
      emptyText={emptyText}
    />
  );
}
