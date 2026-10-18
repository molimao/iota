import { useState } from "react";
import { Activity, ChevronDown } from "lucide-react";
import { computeSummary, formatCompute, type ComputeEntry } from "@/lib/compute-summary";
import { FLEET_NAMES } from "@/lib/fleet";
import { LANGUAGE_TAG } from "@/lib/site";
import { useLocale } from "./site/locale";
import { boardCopy as c } from "./earnings-board-copy";
export function ComputeSummary({ entries }: { entries: ComputeEntry[] }) {
  const { locale } = useLocale();
  const groups = computeSummary(entries);
  const [expanded, setExpanded] = useState(false);
  const unsupported = [...new Set(entries.filter((e) => !e.compute).map((e) => e.binding.project))];
  const time = (n: number) =>
    new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(n);
  return (
    <section className="board-compute" aria-label={c.compute[locale]}>
      <header>
        <h3>
          <Activity size={17} />
          {c.compute[locale]}
        </h3>
        <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          {c.computeDetails[locale]}
          <ChevronDown size={14} />
        </button>
      </header>
      <div className="board-compute-grid">
        {groups.map((g) => {
          const amount = formatCompute(g.total, g.unit, LANGUAGE_TAG[locale]);
          return (
            <article className="board-compute-card" key={g.project + g.unit}>
              <header>
                <span>{FLEET_NAMES[g.project]}</span>
                <small
                  className={
                    g.known ? (g.active ? "compute-active" : "compute-idle") : "compute-missing"
                  }
                >
                  <i />
                  {g.known
                    ? g.active
                      ? c.computeActive[locale]
                      : c.computeWaiting[locale]
                    : c.computeMissing[locale]}
                </small>
              </header>
              <strong>
                {g.known ? amount.value : "—"}
                <span>{amount.unit}</span>
              </strong>
              <div className="compute-coverage">
                <span>
                  {g.known}/{g.count} {c.computeCoverage[locale]}
                </span>
                {g.fetchedAt !== null && (
                  <time dateTime={new Date(g.fetchedAt).toISOString()}>{time(g.fetchedAt)}</time>
                )}
              </div>
              <div className="compute-coverage-track" aria-hidden="true">
                <i style={{ width: `${(g.known / g.count) * 100}%` }} />
              </div>
              {expanded && (
                <div className="compute-source-list">
                  {g.sources.map((s) => {
                    const n =
                      s.value === null
                        ? null
                        : formatCompute(s.value, g.unit, LANGUAGE_TAG[locale]);
                    return (
                      <div key={s.key}>
                        <span>{s.scope === "account" ? c.computeAccount[locale] : s.name}</span>
                        <b>{n ? `${n.value} ${n.unit}` : "—"}</b>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>
      {!groups.length && <p className="board-chart-caption">{c.computeMissing[locale]}</p>}
      <p className="board-chart-caption">
        {c.computeNote[locale]}
        {unsupported.length > 0
          ? ` ${unsupported.map((p) => FLEET_NAMES[p]).join("、")} · ${c.computeUnsupported[locale]}`
          : ""}
      </p>
    </section>
  );
}
