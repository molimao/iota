import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { getEarningsHistory } from "@/lib/pro-tools.functions";
import { filterReportProject, earningsTrendValue, preferredEarningsProject } from "@/lib/pro-tools";
import type { DailyReport } from "@/lib/daily-report";
import { boardSeries, type earningsBoard, type EarningsWindow } from "@/lib/earnings-board";
import { FLEET_NAMES, FLEET_PROJECTS, type FleetProject } from "@/lib/fleet";
import { LANGUAGE_TAG } from "@/lib/site";
import { formatUsd } from "@/lib/earnings";
import { useLocale } from "./site/locale";
import { boardCopy as c } from "./earnings-board-copy";
const palette = ["#6de3b2", "#79aaff", "#c59bff", "#ffc27a", "#ff8eb0", "#74d9ed"];
const color = (p: FleetProject) => palette[FLEET_PROJECTS.indexOf(p) % palette.length]!;
type Board = ReturnType<typeof earningsBoard>;
export function EarningsBoardCharts({
  board,
  previewHistory,
  preview = false,
}: {
  board: Board;
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
  const [days, setDays] = useState(30),
    [chosen, setChosen] = useState<FleetProject | "all" | null>(null);
  const preferred = preferredEarningsProject(history);
  const fallback =
    preferred === "all" && !history.some((r) => r.usdSubtotal !== null)
      ? (history.flatMap((r) => r.projects).find((p) => p.amount !== null)?.project ?? "all")
      : preferred;
  const project = chosen ?? fallback;
  const native = project !== "all";
  const filtered = filterReportProject(history, native ? project : undefined);
  const series = boardSeries(
    filtered.map((r) => ({ day: r.day, value: earningsTrendValue(r, native), partial: r.partial })),
    days,
  );
  const known = series.filter((r) => r.value !== null);
  const sum = known.reduce((n, r) => n + r.value!, 0);
  const unit = native
    ? (filtered.flatMap((r) => r.projects).find((p) => p.currency)?.currency ??
      FLEET_NAMES[project])
    : "USD";
  const number = new Intl.NumberFormat(LANGUAGE_TAG[locale], {
    maximumFractionDigits: native ? 5 : 2,
  });
  const fmt = (v: number) => (native ? `${number.format(v)} ${unit}` : formatUsd(v));
  const gradient = useId().replaceAll(":", "");
  const [periodChoice, setPeriod] = useState<EarningsWindow | null>(null);
  const periods = (["yesterday", "today", "rolling24h", "utcDay"] as const).filter((w) =>
    board.projects.some((p) => [...p.metrics.values()].some((m) => m.window === w)),
  );
  const period =
    periodChoice && periods.includes(periodChoice as (typeof periods)[number])
      ? periodChoice
      : (periods[0] ?? "yesterday");
  const shares = board.projects
    .map((p) => {
      const metrics = [...p.metrics.values()].filter((m) => m.window === period && m.usd !== null);
      return {
        project: p.project,
        name: FLEET_NAMES[p.project],
        value: metrics.reduce((n, m) => n + m.usd!, 0),
        known: metrics.length > 0,
      };
    })
    .filter((p) => p.known)
    .sort((a, b) => b.value - a.value);
  const shareTotal = shares.reduce((n, p) => n + p.value, 0);
  const excluded = board.projects.length - shares.length;
  return (
    <div className="board-visual-grid">
      <section className="board-chart-panel board-history-panel">
        <header>
          <div>
            <span className="board-eyebrow">{c.trend[locale]}</span>
            <h3>{known.length ? fmt(sum) : "—"}</h3>
            <p>
              {c.periodTotal[locale]} · {known.length}/{days} {c.recorded[locale]}
            </p>
          </div>
          <div className="board-range" aria-label={c.range[locale]}>
            {[7, 30, 90].map((d) => (
              <button key={d} aria-pressed={days === d} onClick={() => setDays(d)}>
                {d}
                {c.days[locale]}
              </button>
            ))}
          </div>
        </header>
        <select
          aria-label={c.project[locale]}
          value={project}
          onChange={(e) => setChosen(e.target.value as FleetProject | "all")}
        >
          <option value="all">{c.allUsd[locale]}</option>
          {FLEET_PROJECTS.filter((p) =>
            history.some((r) => r.projects.some((v) => v.project === p && v.amount !== null)),
          ).map((p) => (
            <option key={p} value={p}>
              {FLEET_NAMES[p]}
            </option>
          ))}
        </select>
        {known.length ? (
          <div
            className="board-area-chart"
            role="img"
            aria-label={`${c.trend[locale]} · ${days}${c.days[locale]} · ${fmt(sum)}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                accessibilityLayer
                data={series}
                margin={{ top: 22, right: 15, left: 0, bottom: 8 }}
              >
                <defs>
                  <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6de3b2" stopOpacity={0.34} />
                    <stop offset="100%" stopColor="#6de3b2" stopOpacity={0.01} />
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
                  cursor={{ stroke: "#6de3b2", strokeDasharray: "3 4" }}
                />
                <Area
                  type="linear"
                  dataKey="value"
                  stroke="#6de3b2"
                  strokeWidth={2.5}
                  fill={`url(#${gradient})`}
                  connectNulls={false}
                  dot={{ r: known.length < 3 ? 4 : 1.8, fill: "#6de3b2", strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: "#12241c", strokeWidth: 3 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="board-chart-empty">
            <svg viewBox="0 0 240 70" aria-hidden="true">
              <path d="M0 60H240 M0 30H240" stroke="currentColor" strokeDasharray="3 6" />
              <path
                d="M0 58L35 48L65 52L100 26L130 35L165 10L200 20L240 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <strong>
              {query.isError
                ? c.loadFailed[locale]
                : query.isFetching
                  ? c.loading[locale]
                  : !auth.userId && !preview
                    ? c.signinHistory[locale]
                    : c.noHistory[locale]}
            </strong>
            {query.isError && (
              <button onClick={() => void query.refetch()}>{c.retry[locale]}</button>
            )}
          </div>
        )}
        <p className="board-chart-caption">
          {c.historyNote[locale]}
          {known.length === 1 ? ` ${c.onePoint[locale]}` : ""}
        </p>
      </section>
      <section className="board-chart-panel board-share-panel">
        <header>
          <div>
            <span className="board-eyebrow">{c.share[locale]}</span>
            <h3>{formatUsd(shares.length ? shareTotal : null)}</h3>
          </div>
          <select
            aria-label={c.period[locale]}
            value={period}
            onChange={(e) => setPeriod(e.target.value as EarningsWindow)}
          >
            {(periods.length ? periods : (["yesterday"] as const)).map((w) => (
              <option key={w} value={w}>
                {c.windows[w][locale]}
              </option>
            ))}
          </select>
        </header>
        <div className="board-donut-wrap">
          {shareTotal > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shares.filter((s) => s.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="72%"
                  outerRadius="94%"
                  paddingAngle={shares.filter((s) => s.value > 0).length > 1 ? 4 : 0}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {shares
                    .filter((s) => s.value > 0)
                    .map((p) => (
                      <Cell key={p.project} fill={color(p.project)} />
                    ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => formatUsd(v)}
                  contentStyle={{
                    background: "#17211e",
                    border: "1px solid #43564e",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="board-empty-ring" />
          )}
          <div className="board-donut-center">
            <strong>{shareTotal > 0 ? shares.filter((s) => s.value > 0).length : "—"}</strong>
            <span>{c.earningProjects[locale]}</span>
          </div>
        </div>
        <div className="board-project-bars">
          {shares.map((p) => (
            <a key={p.project} href={`/${locale}/projects/${p.project}`}>
              <span>
                <i style={{ background: color(p.project) }} />
                {p.name}
                <b>{formatUsd(p.value)}</b>
                <small>
                  {shareTotal > 0 ? `${number.format((p.value / shareTotal) * 100)}%` : "—"}
                </small>
              </span>
              <div>
                <i
                  style={{
                    width: `${shareTotal > 0 ? (p.value / shareTotal) * 100 : 0}%`,
                    background: color(p.project),
                  }}
                />
              </div>
            </a>
          ))}
        </div>
        {!shares.length && <p className="board-chart-caption">{c.noComparable[locale]}</p>}
        {excluded > 0 && (
          <p className="board-chart-caption">
            {excluded} {c.excluded[locale]}
          </p>
        )}
      </section>
    </div>
  );
}
