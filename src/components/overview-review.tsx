import { OverviewWorkspace } from "./overview-page";
import { reviewDevices, reviewReading } from "./fleet-review-data";
import { reviewProHistory } from "./pro-tools-review";
import { useLocale } from "./site/locale";
import { useRouterState } from "@tanstack/react-router";
import { fleetCopy } from "./fleet-copy";
export function OverviewReview() {
  const { locale } = useLocale();
  const empty = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("scenario") === "empty",
  });
  return (
    <>
      <p className="overview-preview-label">{fleetCopy(locale).preview}</p>
      <OverviewWorkspace
        preview
        plan="pro"
        devices={empty ? [] : reviewDevices()}
        reading={reviewReading}
        history={reviewProHistory(locale)}
      />
    </>
  );
}
