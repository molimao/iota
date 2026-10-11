import { useAuth } from "@/hooks/use-auth";
import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { TrendingUp, ChevronDown, Download } from "lucide-react";
import { getDeviceEarningsHistory, exportReportCsv } from "@/lib/pro-tools.functions";
import { deviceEarningsCsv, type DeviceHistoryDay } from "@/lib/device-history";
import type { FleetDevice, FleetProject } from "@/lib/fleet";
import { EarningsTrends } from "./pro-tools";
import { useLocale } from "./site/locale";
import { proCopy as c } from "./pro-tools-copy";
export function DeviceEarningsTrend({
  userId,
  device,
  previewHistory,
}: {
  userId: string | null;
  device: FleetDevice;
  plan: "free" | "pro";
  previewHistory?: DeviceHistoryDay[];
}) {
  const { locale } = useLocale();
  const id = useId();
  const auth = useAuth();
  const [emptyExport, setEmptyExport] = useState(false);
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [exportError, setExportError] = useState(false);
  const read = useServerFn(getDeviceEarningsHistory),
    exportFn = useServerFn(exportReportCsv);
  const preview = previewHistory !== undefined;
  const q = useQuery({
    queryKey: ["device-earnings-history", userId, device.id],
    enabled: open && !!userId && !preview,
    queryFn: () => read({ data: { device: device.id } }),
    staleTime: 60000,
    refetchInterval: 5 * 60000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
  const history = previewHistory ?? q.data ?? [];
  async function download(month?: string, project?: FleetProject) {
    setBusy(true);
    setExportError(false);
    setEmptyExport(false);
    try {
      if (!userId && !preview) {
        await auth.signInWithGoogle();
        return;
      }
      const value = preview
        ? {
            filename: "iota-watch-demo-device.csv",
            csv: deviceEarningsCsv(history, project, month),
          }
        : await exportFn({
            data: {
              kind: "earnings",
              device: device.id,
              ...(project ? { project } : {}),
              ...(month ? { month } : {}),
            },
          });
      if ("empty" in value && value.empty) {
        setEmptyExport(true);
        return;
      }
      const url = URL.createObjectURL(new Blob([value.csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = value.filename;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setExportError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="fleet-device-trend">
      <div className="fleet-device-trend-actions">
        <button
          className="fleet-device-trend-toggle"
          title={c.deviceHistoryStart[locale]}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          <TrendingUp size={15} />
          {c.trends[locale]}
          <ChevronDown size={14} />
        </button>
        <button
          className="fleet-device-export"
          aria-label={c.exportEarnings[locale] + " · " + device.name}
          title={c.exports[locale]}
          disabled={busy}
          onClick={() => void download()}
        >
          <Download size={13} />
          CSV
        </button>
      </div>
      {emptyExport && (
        <p className="pro-tools-note" role="status">
          {c.noExportData[locale]}
        </p>
      )}
      {exportError && !open && (
        <p className="pro-tools-note" role="alert">
          {c.unavailable[locale]}
        </p>
      )}
      {open && (
        <div
          id={id}
          className="fleet-device-trend-body"
          role="region"
          aria-label={device.name + " · " + c.deviceTrend[locale]}
        >
          {!userId && !preview ? (
            <button className="fleet-outline" onClick={() => void auth.signInWithGoogle()}>
              {c.historyLogin[locale]}
            </button>
          ) : q.isError ? (
            <p role="alert">
              {c.unavailable[locale]}{" "}
              <button onClick={() => void q.refetch()}>{c.refresh[locale]}</button>
            </p>
          ) : q.isPending && !preview ? (
            <p role="status">…</p>
          ) : (
            <>
              {preview && <p className="pro-tools-note">{c.sample[locale]}</p>}
              <EarningsTrends
                compact
                history={history.map((d) => d.report)}
                deviceHistory={history}
                projects={device.bindings.map((b) => b.project)}
                onExport={(month, project) => void download(month, project)}
                busy={busy}
              />

              {exportError && <p role="alert">{c.unavailable[locale]}</p>}
            </>
          )}
        </div>
      )}
    </section>
  );
}
