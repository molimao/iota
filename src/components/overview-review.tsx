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
        previewPrices={{ prl: 1.5, quantus: 0.08 }}
        plan="pro"
        devices={
          empty
            ? []
            : [
                ...reviewDevices(),
                {
                  id: "preview-prl",
                  name: "GPU Worker",
                  hardware: "GPU",
                  createdAt: 1,
                  bindings: [
                    {
                      id: "preview-prl-binding",
                      project: "prl" as const,
                      identifier: "demo-prl-wallet",
                      worker: "gpu",
                      pool: "luckypool" as const,
                    },
                  ],
                },
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
          binding.project === "prl"
            ? {
                status: "mining",
                activity: "40 TH/s",
                health: "fresh",
                today: "2",
                lifetime: "10",
                rewardAmount: 2,
                earningsWindow: "rolling24h",
                todayUsdValue: null,
                unit: "PRL",
                scope: "wallet",
                accountSummary: { kind: "balance", amount: "3", unit: "PRL" },
                source: "DEMO · LuckyPool",
                updated: "DEMO",
              }
            : binding.project === "bnt"
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
