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
        devices={
          empty
            ? []
            : [
                ...reviewDevices(),
                ...["mini-cpu-01", "mini-cpu-02"].map((name) => ({
                  id: `preview-bnt-${name}`,
                  name,
                  hardware: "CPU",
                  createdAt: 1,
                  bindings: [
                    {
                      id: `preview-bnt-${name}`,
                      project: "bnt" as const,
                      identifier: "demo-bnt-address",
                      worker: name,
                      pool: "bntpool" as const,
                    },
                  ],
                })),
              ]
        }
        reading={(binding) =>
          binding.project === "bnt"
            ? {
                status: "mining",
                activity: "7.13 H/s",
                today: null,
                lifetime: null,
                unit: "BNT",
                scope: "wallet",
                source: "DEMO",
                updated: "DEMO",
                compute: {
                  value: 7.13,
                  unit: "H/s",
                  scope: "worker",
                  fresh: true,
                  fetchedAt: Date.now(),
                },
              }
            : reviewReading(binding)
        }
        history={reviewProHistory(locale)}
      />
    </>
  );
}
