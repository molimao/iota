import { OverviewWorkspace } from "./overview-page";
import { reviewDevices, reviewReading } from "./fleet-review-data";
import { reviewProHistory } from "./pro-tools-review";
import { useLocale } from "./site/locale";
import { useRouterState } from "@tanstack/react-router";
import { PRL_POOL_IDS, PRL_POOLS } from "@/lib/pool-projects";
import { aggregateDailyReport, yesterdayReportWindow } from "@/lib/daily-report";
import { fleetCopy } from "./fleet-copy";
export function OverviewReview() {
  const { locale } = useLocale();
  const scenario = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("scenario"),
  });
  const pearl = scenario === "pearl";
  const pearlUsd = 1.5;
  return (
    <>
      <p className="overview-preview-label">{fleetCopy(locale).preview}</p>
      <OverviewWorkspace
        preview
        previewPrices={{ prl: pearlUsd, quantus: 0.08 }}
        plan="pro"
        devices={
          scenario === "empty"
            ? []
            : pearl
              ? PRL_POOL_IDS.flatMap((pool) =>
                  (pool === "pearlhash" ? ["gpu-01", "gpu-02"] : ["gpu-01"]).map((worker) => ({
                    id: `preview-${pool}-${worker}`,
                    name: `${PRL_POOLS[pool]} · ${worker}`,
                    hardware: "GPU",
                    createdAt: 1,
                    bindings: [
                      {
                        id: `preview-binding-${pool}-${worker}`,
                        project: "prl" as const,
                        identifier: "demo-prl-wallet",
                        worker,
                        pool,
                      },
                    ],
                  })),
                )
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
                ...(pearl
                  ? {
                      cumulativeReward: 10,
                      compute: {
                        value: 40e12,
                        unit: binding.pool === "peryn" ? "MAC/s" : "H/s",
                        scope: "worker" as const,
                        fresh: true,
                        fetchedAt: Date.now(),
                      },
                    }
                  : {}),
                status: "mining",
                activity: binding.pool === "peryn" ? "40 TMAC/s" : "40 TH/s",
                health: "fresh",
                today:
                  !pearl || binding.pool === "pearlski" || binding.pool === "luckypool"
                    ? "2"
                    : null,
                lifetime: "10",
                rewardAmount:
                  !pearl || binding.pool === "pearlski" || binding.pool === "luckypool" ? 2 : null,
                earningsWindow: "rolling24h",
                todayUsdValue: null,
                unit: "PRL",
                scope: "wallet",
                accountSummary: { kind: "balance", amount: "3", unit: "PRL" },
                source: pearl
                  ? PRL_POOLS[binding.pool as keyof typeof PRL_POOLS]
                  : "DEMO · LuckyPool",
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
              : {
                  ...reviewReading(binding),
                  ...(binding.project === "iota"
                    ? { rolling24hReward: 0.1, rolling24hUsdValue: 0.7 }
                    : {}),
                }
        }
        history={pearl
          ? [1.2, 0.8, 1.6].map((amount, index) =>
              aggregateDailyReport(
                yesterdayReportWindow(Date.now() - index * 86400000),
                [{
                  project: "prl",
                  resource: "demo-prl-wallet",
                  scope: "luckypool",
                  currency: "PRL",
                  decimals: 8,
                  units: String(Math.round(amount * 1e8)),
                  usd: amount * pearlUsd,
                }],
                locale,
                1,
              ),
            )
          : reviewProHistory(locale)}
      />
    </>
  );
}
