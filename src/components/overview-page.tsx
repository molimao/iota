import { ArrowUpRight, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { useFleetReadings } from "@/hooks/use-fleet-readings";
import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import {
  useDiscreteScanSummary,
  type DiscreteScanSummary,
} from "@/hooks/use-discrete-scan-summary";
import type { FleetBinding, FleetDevice } from "@/lib/fleet";
import type { DailyReport } from "@/lib/daily-report";
import { useLocale } from "./site/locale";
import { monitorViewCopy } from "./monitor-views";
import { fleetCopy } from "./fleet-copy";
import { EarningsBoard } from "./earnings-board";
import type { ProjectReading } from "./fleet-review-data";
import { discreteDevices, type DiscreteDevice } from "./discrete-agent-reading";
import { DiscreteOverviewCard } from "./discrete-overview-card";
export function OverviewPage() {
  const auth = useAuth(),
    fleet = useFleet(auth.userId, auth.ready);
  const readings = useFleetReadings(fleet.devices, fleet.ready);
  const matched = useMatchedDeviceAgent();
  const { summary } = useDiscreteScanSummary(auth.userId);
  const xdsDevices = discreteDevices(
    fleet.devices,
    matched.enabled ? (matched.query.data ?? []) : [],
  );
  const { locale } = useLocale(),
    c = fleetCopy(locale),
    views = monitorViewCopy(locale);
  if (!fleet.ready)
    return (
      <main className="fleet-workspace overview-page">
        <h1>{views.overview}</h1>
        <p role={fleet.error ? "alert" : "status"}>{fleet.error ? c.unavailable : c.checking}</p>
        {fleet.error && (
          <button className="site-button" onClick={() => void fleet.reload()}>
            {c.retry}
          </button>
        )}
      </main>
    );
  return (
    <OverviewWorkspace
      devices={fleet.devices}
      reading={readings}
      plan={fleet.plan}
      onRefresh={async () => {
        await Promise.all([
          readings.refresh(),
          ...(matched.enabled ? [matched.query.refetch()] : []),
        ]);
      }}
      refreshing={readings.refreshing}
      xds={xdsDevices.length || summary ? { devices: xdsDevices, summary } : undefined}
      error={fleet.error ? c.unavailable : null}
    />
  );
}
export function OverviewWorkspace({
  devices,
  reading,
  preview = false,
  history,
  previewPrices,
  onRefresh,
  refreshing = false,
  error,
  xds,
}: {
  devices: FleetDevice[];
  reading: (b: FleetBinding) => ProjectReading;
  plan?: "free" | "pro";
  preview?: boolean;
  history?: DailyReport[] | undefined;
  previewPrices?: Partial<Record<import("@/lib/projects").ProjectId, number>> | undefined;
  onRefresh?: (() => Promise<void>) | undefined;
  refreshing?: boolean | undefined;
  error?: string | null;
  xds?:
    { devices: DiscreteDevice[]; summary: DiscreteScanSummary | null; now?: number } | undefined;
}) {
  const { locale } = useLocale(),
    c = fleetCopy(locale),
    views = monitorViewCopy(locale);
  return (
    <main className="fleet-workspace overview-page">
      <header className="overview-heading">
        <div>
          <h1>{views.overview}</h1>
        </div>
        <div>
          <a className="fleet-outline" href={`/${locale}/devices`}>
            {c.title}
            <ArrowUpRight size={15} />
          </a>
          {onRefresh && devices.length > 0 && (
            <button
              className="fleet-outline"
              disabled={refreshing}
              onClick={() => void onRefresh()}
            >
              <RefreshCw size={15} className={refreshing ? "reading-spin" : ""} />
              {refreshing ? c.refreshingData : c.refreshData}
            </button>
          )}
        </div>
      </header>
      {error && (
        <p role="alert" className="fleet-form-error">
          {error}
        </p>
      )}
      {devices.length || xds ? (
        <>
          <EarningsBoard
            devices={devices}
            reading={reading}
            preview={preview}
            previewHistory={history}
            previewPrices={previewPrices}
            xdsCard={xds ? <DiscreteOverviewCard {...xds} locale={locale} /> : undefined}
          />
        </>
      ) : (
        <section className="overview-empty">
          <h2>{views.overviewEmpty}</h2>
          <p>{views.overviewEmptyHelp}</p>
          <a className="site-button" href={`/${locale}/devices?add=1`}>
            <Plus size={16} />
            {c.add}
          </a>
        </section>
      )}
    </main>
  );
}
