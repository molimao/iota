import { isPoolProject } from "@/lib/pool-projects";
import type { FleetProject } from "@/lib/fleet";
import type { ProjectReading } from "./fleet-review-data";
import { fleetCopy } from "./fleet-copy";
import { useLocale } from "./site/locale";
import { localized as l } from "@/lib/product-discovery";
import "./project-reading-metrics.css";
export const readingMetricCopy = {
  activity: l(["运行情况", "執行情況", "Activity", "활동", "稼働状況"]),
  hashrate: l(["当前算力", "目前算力", "Hashrate", "해시레이트", "ハッシュレート"]),
};
export type MetricReading = Pick<ProjectReading, "today" | "lifetime" | "unit" | "activity"> &
  Partial<
    Pick<
      ProjectReading,
      "accountSummary" | "todayLabel" | "totalLabel" | "todayUsd" | "priceStale" | "scope"
    >
  >;
/** Preserve distinct metric meanings even when both happen to be zero. */
export function projectReadingMetrics(
  project: FleetProject,
  data: MetricReading,
  locale: Parameters<typeof fleetCopy>[0],
  activity = true,
) {
  const c = fleetCopy(locale),
    items: { key: string; label: string; value: string; unit: string; usd?: string }[] = [];
  const unit = ["nosana", "gonka", "akash"].includes(project) ? "" : data.unit;
  if (activity && data.activity !== "—" && data.activity)
    items.push({
      key: "activity",
      label: (isPoolProject(project) || project === "noid"
        ? readingMetricCopy.hashrate
        : readingMetricCopy.activity)[locale],
      value: data.activity,
      unit: "",
    });
  if (data.accountSummary)
    items.push({
      key: "account",
      label: data.accountSummary.kind === "month" ? c.monthPoints : c.balance,
      value: data.accountSummary.amount,
      unit: data.accountSummary.unit,
    });
  if (data.today !== null && data.accountSummary?.kind !== "month")
    items.push({
      key: "period",
      label: data.todayLabel ?? c.today,
      value: data.today,
      unit,
      ...(data.todayUsd ? { usd: data.todayUsd } : {}),
    });
  if (
    data.lifetime !== null &&
    !(data.accountSummary?.kind === "balance" && data.totalLabel === c.balance)
  )
    items.push({ key: "total", label: data.totalLabel ?? c.total, value: data.lifetime, unit });
  return items;
}
export function ProjectReadingMetrics({
  project,
  data,
  activity = true,
}: {
  project: FleetProject;
  data: MetricReading;
  activity?: boolean;
}) {
  const { locale } = useLocale();
  const items = projectReadingMetrics(project, data, locale, activity);
  const primary =
    items.find((m) => m.key === "period") ?? items.find((m) => m.key === "account") ?? items[0];
  const ordered = primary ? [primary, ...items.filter((m) => m !== primary)] : items;
  return items.length ? (
    <dl className="project-reading-metrics">
      {ordered.map((m) => (
        <div key={m.key} data-primary={m === primary} data-metric={m.key}>
          <dt>{m.label}</dt>
          <dd title={m.value}>
            {m.value}
            {m.unit && <small>{m.unit}</small>}
          </dd>
          {m.usd && <small className="project-metric-usd">≈ ${m.usd} USD</small>}
        </div>
      ))}
    </dl>
  ) : null;
}
