import { useId, useState } from "react";
import { IotaPublicRunLabels as IotaRunLabels } from "./iota-public-run-labels";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { BntHashrateTrend } from "./bnt-hashrate-trend";
import { useAuth } from "@/hooks/use-auth";
import { getEarningsHistory } from "@/lib/pro-tools.functions";
import { filterReportProject, earningsTrendValue } from "@/lib/pro-tools";
import type { DailyReport } from "@/lib/daily-report";
import { boardSeries, type earningsBoard } from "@/lib/earnings-board";
import { computeSummary, formatCompute, type ComputeEntry } from "@/lib/compute-summary";
import { FLEET_NAMES, FLEET_PROJECTS, type FleetProject } from "@/lib/fleet";
import { LANGUAGE_TAG } from "@/lib/site";
import { shortId } from "@/lib/ss58";
import { formatUsd } from "@/lib/earnings";
import { useLocale } from "./site/locale";
import { boardCopy as c } from "./earnings-board-copy";
const palette = ["#6de3b2", "#79aaff", "#c59bff", "#ffc27a", "#ff8eb0", "#74d9ed"];
const color = (p: FleetProject) => palette[FLEET_PROJECTS.indexOf(p) % palette.length]!;
type Board = ReturnType<typeof earningsBoard>;
export function EarningsBoardCharts({
  board,
  entries,
  previewHistory,
  preview = false,
}: {
  board: Board;
  entries: Array<ComputeEntry & { officialRun?: import("@/lib/iota-run").OfficialRun | null | undefined }>;
  previewHistory?: DailyReport[] | undefined;
  preview?: boolean | undefined;
}) {
  const { locale } = useLocale();
  const auth = useAuth(),
    read = useServerFn(getEarningsHistory);
  const query = useQuery({
    queryKey: ["earnings-history", auth.userId],
    queryFn: () => read(),
    enabled: !!auth.userId && !preview,
    staleTime: 60000,
    refetchInterval: 300000,
    retry: 1,
  });
  const history = previewHistory ?? query.data ?? [];
  const [days, setDays] = useState(30);
  const empty = query.isError
    ? c.loadFailed[locale]
    : query.isFetching
      ? c.loading[locale]
      : !auth.userId && !preview
        ? c.signinHistory[locale]
        : c.noProjectHistory[locale];
  const compute = computeSummary(entries);
  const range = (
    <div className="board-range" aria-label={c.range[locale]}>
      {[7, 30, 90].map((d) => (
        <button key={d} aria-pressed={days === d} onClick={() => setDays(d)}>
          {d}
          {c.days[locale]}
        </button>
      ))}
    </div>
  );
  return (
    <>
      <section className="board-chart-panel board-total-history" aria-label={c.totalTrend[locale]}>
        <TrendPanel
          history={history}
          days={days}
          title={c.totalTrend[locale]}
          unit="USD"
          tone="#6de3b2"
          empty={
            query.isError ? empty : query.isFetching ? c.loading[locale] : c.noComparable[locale]
          }
          controls={range}
        />
        <p className="board-chart-caption">{c.aggregateNote[locale]}</p>
        {query.isError && (
          <button className="fleet-outline" onClick={() => void query.refetch()}>
            {c.retry[locale]}
          </button>
        )}
      </section>
      <section className="board-all-projects" aria-label={c.projectCards[locale]}>
        <header className="board-projects-heading">
          <h2>{c.projectCards[locale]}</h2>
          <span>
            {board.projects.length} {c.projects[locale]}
          </span>
        </header>
        <div className="board-project-grid">
          {board.projects.map((row) => {
            const filtered = filterReportProject(history, row.project);
            const unit =
              filtered.flatMap((r) => r.projects).find((p) => p.currency)?.currency ??
              [...row.metrics.values()][0]?.unit ??
              [...row.accounts.values()][0]?.unit ??
              "";
            const groups = compute.filter((g) => g.project === row.project);
            const nf = new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: 8 });
            return (
              <article
                className="board-chart-panel board-project-panel"
                key={row.project}
                data-project={row.project}
                style={{ borderTopColor: color(row.project) }}
              >
                <header className="board-project-heading">
                  <div>
                    <a href={`/${locale}/projects/${row.project}`}>
                      <i style={{ background: color(row.project) }} />
                      {FLEET_NAMES[row.project]}
                      <ArrowUpRight size={16} />
                    </a>
                    <span>
                      {row.devices.size} {c.devices[locale]}
                    </span>
                  </div>
                </header>
                {row.project === "iota" && <IotaRunLabels runs={entries.filter((e) => e.binding.project === "iota").map((e) => e.officialRun)} />}
                <div className="board-project-metrics">
                  {groups.length ? (
                    groups.map((g) => {
                      const amount = formatCompute(g.total, g.unit, LANGUAGE_TAG[locale]);
                      return (
                        <div key={g.unit}>
                          <span>{c.compute[locale]}</span>
                          <strong>
                            {g.known ? amount.value : "—"} <small>{amount.unit}</small>
                          </strong>
                          <small>
                            {g.known}/{g.count} {c.computeCoverage[locale]}
                          </small>
                        </div>
                      );
                    })
                  ) : (
                    <div>
                      <span>{c.compute[locale]}</span>
                      <strong>—</strong>
                      <small>{c.computeUnsupported[locale]}</small>
                    </div>
                  )}
                  {[...row.metrics.values()].map((m) => (
                    <div key={m.window + m.unit}>
                      <span>{c.windows[m.window][locale]}</span>
                      <strong>
                        {nf.format(m.amount)} <small>{m.unit}</small>
                      </strong>
                      <small>
                        {m.usd === null ? c.usd[locale] + " · —" : formatUsd(m.usd)}
                        {m.stale ? ` · ${c.older[locale]}` : ""}
                      </small>
                    </div>
                  ))}
                  {!row.metrics.size && !row.accounts.size && (
                    <div>
                      <span>{c.amount[locale]}</span>
                      <strong>—</strong>
                      <small>{c.missing[locale]}</small>
                    </div>
                  )}
                  {[...row.accounts.values()].length > 0 && (
                    <div className="board-project-accounts">
                      <span>
                        {row.accounts.size} {c.accounts[locale]}
                      </span>
                      {[...row.accounts.values()].map((a) => (
                        <div key={a.identifier}>
                          <strong>
                            {a.amount} <small>{a.unit}</small>
                          </strong>
                          <small>
                            {shortId(a.identifier)} ·{" "}
                            {a.kind === "month" ? c.month[locale] : c.balance[locale]}
                            {a.stale ? ` · ${c.older[locale]}` : ""}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {row.project === "bnt" && (
                  <div className="board-hashrate-history">
                    {[
                      ...new Set(
                        entries
                          .filter((e) => e.binding.project === "bnt")
                          .map((e) => e.binding.identifier),
                      ),
                    ].map((address) => (
                      <section key={address}>
                        <code title={address}>{shortId(address)}</code>
                        <BntHashrateTrend address={address} preview={preview} />
                      </section>
                    ))}
                  </div>
                )}
                <TrendPanel
                  history={filtered}
                  days={days}
                  title={c.trend[locale]}
                  unit={unit}
                  tone={color(row.project)}
                  native
                  empty={empty}
                />
              </article>
            );
          })}
        </div>
        <p className="board-chart-caption">{c.computeNote[locale]}</p>
      </section>
    </>
  );
}
function TrendPanel({
  history,
  days,
  title,
  unit,
  tone,
  native = false,
  empty,
  controls,
}: {
  history: DailyReport[];
  days: number;
  title: string;
  unit: string;
  tone: string;
  native?: boolean;
  empty: string;
  controls?: React.ReactNode;
}) {
  const { locale } = useLocale();
  const series = boardSeries(
    history.map((r) => ({ day: r.day, value: earningsTrendValue(r, native), partial: r.partial })),
    days,
  );
  const known = series.filter((r) => r.value !== null),
    sum = known.reduce((n, r) => n + r.value!, 0);
  const number = new Intl.NumberFormat(LANGUAGE_TAG[locale], {
    maximumFractionDigits: native ? 5 : 2,
  });
  const fmt = (v: number) => (native ? `${number.format(v)} ${unit}` : formatUsd(v));
  const gradient = useId().replaceAll(":", "");
  return (
    <div className="board-trend-content">
      <header>
        <div>
          <span className="board-eyebrow">{title}</span>
          <h3>{known.length ? fmt(sum) : "—"}</h3>
          <p>
            {c.periodTotal[locale]} · {known.length}/{days} {c.recorded[locale]}
          </p>
        </div>
        {controls}
      </header>
      {known.length ? (
        <div
          className="board-area-chart"
          role="img"
          aria-label={`${title} · ${days}${c.days[locale]} · ${fmt(sum)}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              accessibilityLayer
              data={series}
              margin={{ top: 22, right: 15, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tone} stopOpacity={0.34} />
                  <stop offset="100%" stopColor={tone} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#ffffff12" strokeDasharray="3 5" />
              <XAxis
                dataKey="day"
                tickFormatter={(s) => String(s).slice(5)}
                tick={{ fill: "#8c9896", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={45}
              />
              <YAxis
                tick={{ fill: "#8c9896", fontSize: 11 }}
                width={50}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  new Intl.NumberFormat(LANGUAGE_TAG[locale], {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(Number(v))
                }
              />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="board-tooltip">
                      <time>{String(label)} · UTC+8</time>
                      <strong>{fmt(Number(payload[0]?.value))}</strong>
                      {payload[0]?.payload.partial && <small>{c.partial[locale]}</small>}
                    </div>
                  ) : null
                }
                cursor={{ stroke: tone, strokeDasharray: "3 4" }}
              />
              <Area
                type="linear"
                dataKey="value"
                stroke={tone}
                strokeWidth={2.5}
                fill={`url(#${gradient})`}
                connectNulls={false}
                dot={{ r: known.length < 3 ? 4 : 1.8, fill: tone, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: "#12241c", strokeWidth: 3 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="board-project-empty">
          <span>{empty}</span>
        </div>
      )}
      {known.length > 0 && (
        <p className="board-chart-caption">
          {c.historyNote[locale]}
          {known.length === 1 ? ` ${c.onePoint[locale]}` : ""}
        </p>
      )}
    </div>
  );
}
