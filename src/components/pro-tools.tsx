import { deviceReports, deviceEarningsCsv, type DeviceHistoryDay } from "@/lib/device-history";
import { PROJECTS } from "@/lib/projects";
import { useAuth } from "@/hooks/use-auth";
import { useRouterState } from "@tanstack/react-router";
import { useId, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { TrendingUp, Download, ListChecks, ChevronDown } from "lucide-react";
import {
  getEarningsHistory,
  getHistoryBackfillStatus,
  applyBulkDevices,
  exportReportCsv,
} from "@/lib/pro-tools.functions";
import {
  parseBulkCsv,
  filterReportProject,
  validateBulkRows,
  bulkTemplate,
  devicesCsv,
  earningsCsv,
  summarizeMonth,
  monthlyCsv,
  sumNativeAmounts,
  previousMonth,
  earningsTrendValue,
  preferredEarningsProject,
  preferredEarningsDays,
  type BulkRow,
} from "@/lib/pro-tools";
import type { DailyReport } from "@/lib/daily-report";
import { FLEET_NAMES, FLEET_PROJECTS, type FleetDevice, type FleetProject } from "@/lib/fleet";
import { useLocale } from "./site/locale";
import { proCopy as c } from "./pro-tools-copy";
const money = (v: number | null) =>
  v === null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
function downloadCsv(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function ProTools({
  userId,
  plan,
  devices,
  previewHistory,
  previewDeviceHistory,
  onPreviewBulk,
}: {
  userId: string | null;
  plan: "free" | "pro";
  devices: FleetDevice[];
  previewHistory?: DailyReport[];
  previewDeviceHistory?: (device: FleetDevice) => DeviceHistoryDay[];
  onPreviewBulk?: (rows: BulkRow[]) => Promise<void>;
}) {
  const { locale } = useLocale();
  const preview = previewHistory !== undefined;
  const auth = useAuth();
  const statusRead = useServerFn(getHistoryBackfillStatus);
  const backfill = useQuery({
    queryKey: ["history-backfill-status", userId],
    enabled: !!userId && !preview,
    queryFn: () => statusRead(),
    staleTime: 30000,
    refetchInterval: (q) =>
      !q.state.data || ["none", "pending"].includes(q.state.data.state) ? 60000 : false,
    retry: 1,
  });
  const [exportDevice, setExportDevice] = useState("");
  const [exportProject, setExportProject] = useState("all");
  const [exportMonth, setExportMonth] = useState("");
  const [emptyExport, setEmptyExport] = useState(false);
  const initialTool = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).get("tool"),
  });
  const [selectedTool, setTab] = useState<"trends" | "bulk" | "exports" | null | undefined>(
      initialTool === "trends" || initialTool === "bulk" || initialTool === "exports"
        ? initialTool
        : undefined,
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const tab = selectedTool ?? null;
  const read = useServerFn(getEarningsHistory),
    apply = useServerFn(applyBulkDevices),
    exportFn = useServerFn(exportReportCsv),
    client = useQueryClient();
  const q = useQuery({
    queryKey: ["earnings-history", userId],
    enabled: !!userId && tab === "trends" && !preview,
    queryFn: () => read(),
    staleTime: 60000,
    refetchInterval: (query) =>
      backfill.data?.state === "pending" || (query.state.data?.length ?? 0) < 2 ? 60000 : 5 * 60000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
  const history = previewHistory ?? q.data ?? [];
  async function exportFile(
    kind: "devices" | "earnings",
    month?: string,
    project?: (typeof FLEET_PROJECTS)[number],
    device?: string,
  ) {
    setBusy(true);
    setError(false);
    setEmptyExport(false);
    try {
      if (!preview && !userId && kind === "earnings") {
        await auth.signInWithGoogle();
        return;
      }
      if (!preview && !userId && kind === "devices") {
        downloadCsv(
          devicesCsv(device ? devices.filter((d) => d.id === device) : devices),
          "iota-watch-devices.csv",
        );
        return;
      }
      const r = preview
        ? {
            filename: `iota-watch-demo-${kind}.csv`,
            csv:
              kind === "devices"
                ? devicesCsv(device ? devices.filter((d) => d.id === device) : devices)
                : device
                  ? deviceEarningsCsv(
                      previewDeviceHistory?.(devices.find((d) => d.id === device)!) ?? [],
                      project,
                      month,
                    )
                  : month
                    ? monthlyCsv(summarizeMonth(filterReportProject(history, project), month))
                    : earningsCsv(filterReportProject(history, project)),
          }
        : await exportFn({
            data: {
              kind,
              ...(month ? { month } : {}),
              ...(project ? { project } : {}),
              ...(device ? { device } : {}),
            },
          });
      if ("empty" in r && r.empty) {
        setEmptyExport(true);
        return;
      }
      downloadCsv(r.csv, r.filename);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="pro-tools" id="pro-tools">
      <div className="pro-tools-tabs" aria-label={c.tools[locale]}>
        {(["trends", "bulk", "exports"] as const).map((key, i) => {
          const Icon = [TrendingUp, ListChecks, Download][i]!;
          return (
            <button
              key={key}
              aria-expanded={tab === key}
              onClick={() => {
                setTab(tab === key ? null : key);
                setError(false);
              }}
            >
              <Icon size={16} />
              {c[key][locale]}
              {key === "bulk" && <small>PRO</small>}
              <ChevronDown size={13} />
            </button>
          );
        })}
      </div>
      {backfill.data?.state === "pending" && (
        <p role="status" className="pro-tools-note">
          {c.backfillProgress[locale]
            .replace("{done}", String(backfill.data.completed))
            .replace("{total}", String(backfill.data.total))}
        </p>
      )}
      {backfill.data?.state === "failed" && (
        <p role="status" className="pro-tools-note">
          {c.backfillFailed[locale]}
        </p>
      )}
      {tab && (
        <div className="pro-tools-panel">
          {plan !== "pro" && tab === "bulk" ? (
            <a
              className="fleet-outline"
              href={`/${locale}/${preview ? "review" : "devices"}?view=membership`}
            >
              {c.locked[locale]} →
            </a>
          ) : (
            <>
              {preview && <p className="pro-tools-note">{c.sample[locale]}</p>}
              {tab === "trends" &&
                (!userId && !preview ? (
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
                  <EarningsTrends
                    history={history}
                    onExport={(month, project) => void exportFile("earnings", month, project)}
                    busy={busy}
                  />
                ))}
              {tab === "bulk" && (
                <BulkManager
                  devices={devices}
                  busy={busy}
                  onApply={async (rows, request) => {
                    setBusy(true);
                    setError(false);
                    try {
                      if (preview) {
                        await onPreviewBulk?.(rows);
                      } else {
                        const result = await apply({ data: { request, rows } });
                        client.setQueryData(["fleet", userId], result);
                      }
                      return true;
                    } catch {
                      setError(true);
                      return false;
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
              )}
              {tab === "exports" && (
                <div className="pro-export-actions">
                  <div className="export-filters">
                    <label>
                      {c.exportScope[locale]}
                      <select
                        value={exportDevice}
                        onChange={(e) => setExportDevice(e.target.value)}
                      >
                        <option value="">{c.allDevices[locale]}</option>
                        {devices.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {c.project[locale]}
                      <select
                        value={exportProject}
                        onChange={(e) => setExportProject(e.target.value)}
                      >
                        <option value="all">{c.allProjects[locale]}</option>
                        {FLEET_PROJECTS.map((p) => (
                          <option key={p} value={p}>
                            {FLEET_NAMES[p]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {c.exportPeriod[locale]}
                      <select value={exportMonth} onChange={(e) => setExportMonth(e.target.value)}>
                        <option value="">{c.dailyExport[locale]}</option>
                        {Array.from({ length: 4 }, (_, i) => {
                          const d = new Date(Date.now() + 28800000);
                          d.setUTCDate(1);
                          d.setUTCMonth(d.getUTCMonth() - i);
                          const m = d.toISOString().slice(0, 7);
                          return (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                  </div>

                  <button
                    className="fleet-outline"
                    disabled={busy}
                    onClick={() =>
                      void exportFile("devices", undefined, undefined, exportDevice || undefined)
                    }
                  >
                    <Download size={15} />
                    {c.exportDevices[locale]}
                  </button>
                  <button
                    className="fleet-outline"
                    disabled={busy}
                    onClick={() =>
                      void exportFile(
                        "earnings",
                        exportMonth || undefined,
                        exportProject === "all"
                          ? undefined
                          : (exportProject as (typeof FLEET_PROJECTS)[number]),
                        exportDevice || undefined,
                      )
                    }
                  >
                    <Download size={15} />
                    {c.exportEarnings[locale]}
                  </button>
                  <p className="pro-tools-note">{c.exportNote[locale]}</p>
                  {!userId && !preview && <p className="pro-tools-note">{c.exportLogin[locale]}</p>}
                </div>
              )}
              {emptyExport && <p role="status">{c.noExportData[locale]}</p>}
              {error && (
                <p role="alert">{tab === "bulk" ? c.bulkError[locale] : c.unavailable[locale]}</p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
export function EarningsTrends({
  history,
  onExport,
  busy,
  deviceHistory,
  projects,
  compact = false,
}: {
  history: DailyReport[];
  deviceHistory?: DeviceHistoryDay[];
  projects?: readonly (typeof FLEET_PROJECTS)[number][];
  compact?: boolean;
  onExport: (month?: string, project?: (typeof FLEET_PROJECTS)[number]) => void;
  busy: boolean;
}) {
  const { locale } = useLocale();
  const [selectedDays, setDays] = useState<number | null>(null),
    [selectedProject, setProject] = useState<string | null>(null),
    [mode, setMode] = useState<"trend" | "month">("trend"),
    [month, setMonth] = useState(previousMonth());
  const project =
    selectedProject ??
    preferredEarningsProject(deviceHistory ? deviceReports(deviceHistory) : history);
  const days =
    selectedDays ??
    preferredEarningsDays(
      deviceHistory
        ? deviceReports(deviceHistory, project === "all" ? undefined : (project as FleetProject))
        : history,
      project as FleetProject | "all",
    );
  const months = Array.from(new Set([previousMonth(), ...history.map((d) => d.day.slice(0, 7))]))
    .sort()
    .reverse();
  const filtered = useMemo(
    () =>
      deviceHistory
        ? deviceReports(
            deviceHistory,
            project === "all" ? undefined : (project as (typeof FLEET_PROJECTS)[number]),
          )
        : filterReportProject(
            history,
            project === "all" ? undefined : (project as (typeof FLEET_PROJECTS)[number]),
          ),
    [history, project, deviceHistory],
  );
  const monthly = summarizeMonth(filtered, month);
  const end = new Date(Date.now() + 28800000).toISOString().slice(0, 10);
  const start = new Date(Date.parse(end + "T00:00:00Z") - days * 86400000)
    .toISOString()
    .slice(0, 10);
  const visible = filtered.filter((r) => r.day >= start && r.day < end);
  const knownDays = visible.filter((r) => earningsTrendValue(r, project !== "all") !== null);
  const nativeOnly =
    project === "all" && visible.some((r) => r.projects.some((p) => p.amount !== null));
  const missingHistoricalUsd =
    project === "all" &&
    visible.some(
      (r) => r.source === "backfill" && r.projects.some((p) => p.amount !== null && p.usd === null),
    );
  const currency =
    project === "all"
      ? "USD"
      : (visible.flatMap((d) => d.projects)[0]?.currency ??
        PROJECTS[project as keyof typeof PROJECTS].token);
  const nativeTotal =
    project === "all"
      ? null
      : sumNativeAmounts(
          visible.flatMap((d) => d.projects.flatMap((p) => (p.amount === null ? [] : [p.amount]))),
        );
  const total = visible.some((d) => d.usdSubtotal !== null)
    ? visible.reduce((n, d) => n + (d.usdSubtotal ?? 0), 0)
    : null;
  return (
    <>
      <div className="pro-trend-toolbar">
        <div className="pro-segment">
          <button aria-pressed={mode === "trend"} onClick={() => setMode("trend")}>
            {c.trends[locale]}
          </button>
          {!compact && (
            <button aria-pressed={mode === "month"} onClick={() => setMode("month")}>
              {c.monthly[locale]}
            </button>
          )}
        </div>
        <select
          aria-label={c.project[locale]}
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          <option value="all">
            {locale === "zh"
              ? "全部项目"
              : locale === "zh-TW"
                ? "全部專案"
                : locale === "en"
                  ? "All projects"
                  : locale === "ko"
                    ? "전체 프로젝트"
                    : "すべてのプロジェクト"}
          </option>
          {FLEET_PROJECTS.filter(
            (p) =>
              projects?.includes(p) || history.some((d) => d.projects.some((v) => v.project === p)),
          ).map((p) => (
            <option key={p} value={p}>
              {FLEET_NAMES[p]}
            </option>
          ))}
        </select>
        <button
          className="fleet-outline"
          disabled={busy}
          onClick={() =>
            onExport(
              mode === "month" ? month : undefined,
              project === "all" ? undefined : (project as (typeof FLEET_PROJECTS)[number]),
            )
          }
        >
          <Download size={14} />
          CSV
        </button>
      </div>
      {deviceHistory &&
        ((project === "all" && deviceHistory.some((d) => d.walletProjects.length)) ||
          (project !== "all" &&
            deviceHistory.some((d) =>
              d.walletProjects.includes(project as (typeof FLEET_PROJECTS)[number]),
            ))) && (
          <p className="pro-device-scope" role="note">
            {project === "all" ? c.accountExcluded[locale] : c.accountScope[locale]}
          </p>
        )}
      {mode === "trend" ? (
        <>
          <div className="pro-trend-summary">
            <div>
              <span>{c.periodEarnings[locale].replace("{days}", String(days))}</span>
              <strong>
                {project === "all" ? money(total) : `${nativeTotal ?? "—"} ${currency}`}
              </strong>
              <span className="pro-history-coverage">
                {c.recordedDays[locale]
                  .replace("{count}", String(visible.length))
                  .replace("{days}", String(days))}
              </span>
            </div>
            <div className="pro-segment">
              {[7, 30, 90].map((n) => (
                <button key={n} aria-pressed={days === n} onClick={() => setDays(n)}>
                  {n} {c.days[locale]}
                </button>
              ))}
            </div>
          </div>
          {!history.length ? (
            <p>{c.noHistory[locale]}</p>
          ) : !knownDays.length ? (
            <p className="pro-tools-note" role="status">
              {nativeOnly ? c.noUsdHistory[locale] : c.noDailyValues[locale]}
            </p>
          ) : (
            <>
              {missingHistoricalUsd ? (
                <p className="pro-history-progress" role="status">
                  {c.partialUsdHistory[locale]}
                </p>
              ) : (
                knownDays.length === 1 && (
                  <p className="pro-history-progress" role="status">
                    {c.singleDay[locale].replace("{date}", knownDays[0]!.day)}
                  </p>
                )
              )}
              <TrendChart
                key={`${project}-${days}`}
                history={visible}
                start={start}
                days={days}
                native={project !== "all"}
                currency={currency}
              />
              <details className="pro-data-table">
                <summary>{c.amount[locale]} · UTC+8</summary>
                <div className="pro-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>UTC+8</th>
                        <th>{project === "all" ? "USD" : currency}</th>
                        <th>{c.coverage[locale]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((d) => (
                        <tr key={d.day}>
                          <td>{d.day}</td>
                          <td>
                            {project === "all"
                              ? money(d.usdSubtotal)
                              : (d.projects[0]?.amount ?? "—")}
                          </td>
                          <td>{d.partial ? c.partial[locale] : c.complete[locale]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}
        </>
      ) : (
        <>
          <label className="pro-month-select">
            {c.month[locale]}{" "}
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <div className="pro-month-summary">
            <div>
              <span>{c.knownUsd[locale]}</span>
              <strong>{money(monthly.usdSubtotal)}</strong>
            </div>
            <div>
              <span>{c.coverage[locale]}</span>
              <strong>
                {monthly.days}
                <small> / {monthly.expected}</small>
              </strong>
            </div>
          </div>
          <div className="pro-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{c.project[locale]}</th>
                  <th>{c.amount[locale]}</th>
                  <th>USD</th>
                  <th>{c.coverage[locale]}</th>
                </tr>
              </thead>
              <tbody>
                {monthly.projects.map((p) => (
                  <tr key={p.project}>
                    <td>{p.name}</td>
                    <td>
                      {p.amount ?? "—"} {p.currency}
                    </td>
                    <td>
                      {money(p.usd)}
                      {p.partial && <small>{c.partial[locale]}</small>}
                    </td>
                    <td>
                      {p.days}/{monthly.expected}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!monthly.days && <p>{c.noHistory[locale]}</p>}
        </>
      )}
      {!compact && <p className="pro-tools-note pro-trend-footnote">{c.historyNote[locale]}</p>}
    </>
  );
}
function TrendChart({
  history,
  start,
  days,
  native,
  currency,
}: {
  history: DailyReport[];
  start: string;
  days: number;
  native: boolean;
  currency: string;
}) {
  const { locale } = useLocale();
  const metric = (d: DailyReport | undefined) => earningsTrendValue(d, native);
  const hintId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const max = Math.max(1, ...history.map((d) => metric(d) ?? 0));
  const byDay = new Map(history.map((d) => [d.day, d]));
  const series = Array.from({ length: days }, (_, i) => {
    const day = new Date(Date.parse(start + "T00:00:00Z") + i * 86400000)
      .toISOString()
      .slice(0, 10);
    return { day, value: metric(byDay.get(day)), report: byDay.get(day) };
  });
  const singlePoint = series.filter((r) => r.value !== null).length === 1;
  let path = "",
    pen = false;
  for (let i = 0; i < series.length; i++) {
    const value = series[i]!.value;
    if (value === null) {
      pen = false;
      continue;
    }
    const x = 48 + (i / Math.max(1, days - 1)) * 650,
      y = 170 - (value / max) * 140;
    path += (pen ? " L" : " M") + x.toFixed(2) + "," + y.toFixed(2);
    pen = true;
  }
  const latestKnownIndex = series.reduce(
    (latest, row, index) => (row.value === null ? latest : index),
    days - 1,
  );
  const selectedIndex = Math.min(activeIndex ?? latestKnownIndex, days - 1);
  const selected = series[selectedIndex]!;
  const selectedAmount = native ? selected.report?.projects[0]?.amount : null;
  const selectedLabel = native ? `${selectedAmount ?? "—"} ${currency}` : money(selected.value);
  const selectPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    if (!box.width) return;
    const x = ((event.clientX - box.left) / box.width) * 730;
    setActiveIndex(Math.max(0, Math.min(days - 1, Math.round(((x - 48) / 650) * (days - 1)))));
  };
  return (
    <div
      className="pro-chart-interactive"
      tabIndex={0}
      role="group"
      aria-label={c.trends[locale]}
      aria-describedby={hintId}
      onKeyDown={(event) => {
        let next: number | undefined;
        if (event.key === "ArrowLeft") next = Math.max(0, selectedIndex - 1);
        if (event.key === "ArrowRight") next = Math.min(days - 1, selectedIndex + 1);
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = days - 1;
        if (next !== undefined) {
          event.preventDefault();
          setActiveIndex(next);
        }
      }}
    >
      <span id={hintId} className="sr-only">
        {c.chartInteraction[locale]}
      </span>
      <div className="pro-chart-readout" aria-live="polite" aria-atomic="true">
        <time dateTime={selected.day}>{selected.day} · UTC+8</time>
        <b>{selectedLabel}</b>
        {selected.value === null ? (
          <small>{c.noValue[locale]}</small>
        ) : selected.report?.partial ? (
          <small>{c.partial[locale]}</small>
        ) : null}
      </div>
      <svg
        onPointerMove={(event) => {
          if (event.pointerType === "mouse") selectPointer(event);
        }}
        onPointerDown={selectPointer}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setActiveIndex(null);
        }}
        className="pro-trend-chart"
        viewBox="0 0 730 210"
        role="img"
        aria-label={c.trends[locale] + " · " + currency}
      >
        <title>{c.historyNote[locale]}</title>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1="48"
              y1={170 - f * 140}
              x2="698"
              y2={170 - f * 140}
              stroke="currentColor"
              opacity=".15"
            />
            <text x="4" y={174 - f * 140}>
              {new Intl.NumberFormat(locale, {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(max * f)}
            </text>
          </g>
        ))}
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
        {series.map((r, i) =>
          r.value === null ? null : (
            <circle
              key={r.day}
              cx={48 + (i / Math.max(1, days - 1)) * 650}
              cy={170 - (r.value / max) * 140}
              r={singlePoint ? 5 : 2.5}
              fill="currentColor"
            >
              <title>{r.day + " · " + (native ? `${r.value} ${currency}` : money(r.value))}</title>
            </circle>
          ),
        )}
        {activeIndex !== null && (
          <g pointerEvents="none">
            <line
              x1={48 + (selectedIndex / Math.max(1, days - 1)) * 650}
              x2={48 + (selectedIndex / Math.max(1, days - 1)) * 650}
              y1="24"
              y2="170"
              stroke="currentColor"
              opacity=".3"
              strokeDasharray="3 4"
            />
            {selected.value !== null && (
              <circle
                cx={48 + (selectedIndex / Math.max(1, days - 1)) * 650}
                cy={170 - (selected.value / max) * 140}
                r="5"
                fill="var(--watch-bg)"
                stroke="currentColor"
                strokeWidth="2"
              />
            )}
          </g>
        )}
        <text x="48" y="202">
          {start}
        </text>
        <text x="698" y="202" textAnchor="end">
          {series.at(-1)?.day}
        </text>
      </svg>
    </div>
  );
}
function BulkManager({
  devices,
  busy,
  onApply,
}: {
  devices: FleetDevice[];
  busy: boolean;
  onApply: (rows: BulkRow[], request: string) => Promise<boolean>;
}) {
  const { locale } = useLocale();
  const [rows, setRows] = useState<BulkRow[] | null>(null),
    [request, setRequest] = useState(""),
    [error, setError] = useState(false),
    [saved, setSaved] = useState(false),
    [mode, setMode] = useState<"import" | "rename">("import"),
    [edits, setEdits] = useState<Record<string, { name: string; hardware: string }>>({});
  const summary = rows ? validateBulkRows(rows, devices, false) : null;
  function reset() {
    setRows(null);
    setError(false);
    setSaved(false);
    setRequest("");
  }
  function review(v: BulkRow[]) {
    try {
      validateBulkRows(v, devices);
      setRows(v);
      setRequest(crypto.randomUUID());
      setError(false);
    } catch {
      setError(true);
    }
  }
  return (
    <>
      <div className="pro-bulk-actions">
        <button
          className="fleet-outline"
          disabled={busy}
          onClick={() => {
            reset();
            setMode("import");
            downloadCsv(bulkTemplate(), "iota-watch-import-template.csv");
          }}
        >
          {c.template[locale]}
        </button>
        <button
          className="fleet-outline"
          disabled={busy}
          onClick={() => {
            reset();
            setMode(mode === "rename" ? "import" : "rename");
          }}
        >
          {mode === "rename" ? c.csv[locale] : c.edit[locale]}
        </button>
      </div>
      <details className="pro-data-table">
        <summary>{c.importRules[locale]}</summary>
        <p className="pro-tools-note">{c.bulkHelp[locale]}</p>
      </details>
      {!rows &&
        (mode === "import" ? (
          <label className="pro-upload">
            {c.csv[locale]}
            <input
              type="file"
              accept=".csv,text/csv"
              disabled={busy}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                reset();
                if (file.size > 100000) {
                  setError(true);
                  e.target.value = "";
                  return;
                }
                try {
                  review(parseBulkCsv(await file.text()));
                } catch {
                  setError(true);
                }
                e.target.value = "";
              }}
            />
          </label>
        ) : (
          <>
            <div className="pro-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{c.device[locale]}</th>
                    <th>{c.hardware[locale]}</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            checked={!!edits[d.id]}
                            disabled={busy || (!edits[d.id] && Object.keys(edits).length >= 100)}
                            onChange={(e) =>
                              setEdits((old) => {
                                const copy = { ...old };
                                if (e.target.checked)
                                  copy[d.id] = { name: d.name, hardware: d.hardware };
                                else delete copy[d.id];
                                return copy;
                              })
                            }
                          />
                          {d.name}
                        </label>
                      </td>
                      <td>
                        {edits[d.id] && (
                          <div className="pro-bulk-inputs">
                            <input
                              aria-label={d.name + " · " + c.device[locale]}
                              maxLength={40}
                              value={edits[d.id]!.name}
                              onChange={(e) =>
                                setEdits((v) => ({
                                  ...v,
                                  [d.id]: { ...v[d.id]!, name: e.target.value },
                                }))
                              }
                            />
                            <input
                              aria-label={d.name + " · " + c.hardware[locale]}
                              maxLength={100}
                              value={edits[d.id]!.hardware}
                              onChange={(e) =>
                                setEdits((v) => ({
                                  ...v,
                                  [d.id]: { ...v[d.id]!, hardware: e.target.value },
                                }))
                              }
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="fleet-outline"
              disabled={!Object.keys(edits).length || busy}
              onClick={() =>
                review(
                  Object.entries(edits).map(([device_id, v]) => ({
                    device_id,
                    device_key: "",
                    ...v,
                    project: "",
                    identifier: "",
                    worker: "",
                  })),
                )
              }
            >
              {c.preview[locale]}
            </button>
          </>
        ))}
      {rows && summary && (
        <>
          <p className="pro-bulk-summary">
            {c.newDevices[locale]} {summary.created} · {c.links[locale]} {summary.linked} ·{" "}
            {c.renames[locale]} {summary.renamed}
          </p>
          <div className="pro-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{c.device[locale]}</th>
                  <th>{c.project[locale]}</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>
                      {r.name}
                      <small>{r.hardware}</small>
                    </td>
                    <td>{r.project ? FLEET_NAMES[r.project] : c.renames[locale]}</td>
                    <td className="pro-public-id">
                      {r.identifier ||
                        devices.find((d) => d.id === r.device_id)?.name ||
                        r.device_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pro-bulk-actions">
            <button
              className="site-button"
              disabled={busy}
              onClick={async () => {
                if (await onApply(rows, request)) {
                  setRows(null);
                  setEdits({});
                  setSaved(true);
                }
              }}
            >
              {c.apply[locale]}
            </button>
            <button className="fleet-outline" disabled={busy} onClick={reset}>
              {c.cancel[locale]}
            </button>
          </div>
        </>
      )}
      {error && <p role="alert">{c.bulkError[locale]}</p>}
      {saved && <p role="status">{c.saved[locale]}</p>}
    </>
  );
}
