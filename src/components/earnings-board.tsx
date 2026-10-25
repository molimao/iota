import { EarningsBoardCharts } from "./earnings-board-charts";
import { IotaPublicRunLabels as IotaRunLabels } from "./iota-public-run-labels";
import type { DailyReport } from "@/lib/daily-report";
import { shortId } from "@/lib/ss58";
import { earningsBoard } from "@/lib/earnings-board";
import type { FleetBinding, FleetDevice } from "@/lib/fleet";
import { FLEET_NAMES } from "@/lib/fleet";
import { formatUsd } from "@/lib/earnings";
import { LANGUAGE_TAG } from "@/lib/site";
import { projectPath } from "@/lib/projects";
import type { ProjectReading } from "./fleet-review-data";
import { useLocale } from "./site/locale";
import { boardCopy as c } from "./earnings-board-copy";
export function EarningsBoard({
  devices,
  reading,
  previewHistory,
  preview,
}: {
  devices: FleetDevice[];
  previewHistory?: DailyReport[] | undefined;
  preview?: boolean | undefined;
  reading: (b: FleetBinding) => ProjectReading;
}) {
  const { locale } = useLocale();
  const entries = devices.flatMap((d) =>
    d.bindings.map((b) => ({ binding: b, deviceId: d.id, name: d.name, data: reading(b) })),
  );
  const board = earningsBoard(entries);
  const nf = new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: 8 });
  return (
    <section className="earnings-board" aria-label={c.title[locale]}>
      <header>
        <h2>{c.title[locale]}</h2>
        <span className="board-scope-count">
          {devices.length} {c.devices[locale]} <i /> {board.projects.length} {c.projects[locale]}
        </span>
      </header>
      <div className="earnings-board-totals">
        {(["yesterday", "today"] as const).map((day) => {
          const metrics = board.projects.flatMap((p) =>
            [...p.metrics.values()].filter((m) => m.window === day),
          );
          const native = new Map<string, number>();
          for (const m of metrics) native.set(m.unit, (native.get(m.unit) ?? 0) + m.amount);
          const nativeHeadline =
            !board.totals[day].count && native.size === 1 ? [...native][0] : null;
          return (
            <article key={day}>
              <span>{c[day][locale]}</span>
              <strong>
                {nativeHeadline
                  ? nf.format(nativeHeadline[1])
                  : formatUsd(board.totals[day].count ? board.totals[day].usd : null)}{" "}
                <small>{nativeHeadline ? nativeHeadline[0] : "USD"}</small>
              </strong>
              {!board.totals[day].count && (
                <>
                  {!nativeHeadline &&
                    [...native].map(([unit, amount]) => (
                      <span key={unit}>
                        {nf.format(amount)} {unit}
                      </span>
                    ))}
                  <small className="board-total-context">
                    {metrics.length
                      ? c.noConversion[locale]
                      : day === "today" && board.projects.some((p) => p.project === "iota")
                        ? c.iotaYesterday[locale]
                        : c.noPeriod[locale]}
                    {metrics.some((m) => m.stale) ? ` · ${c.older[locale]}` : ""}
                  </small>
                </>
              )}
              {board.olderPrices[day] && (
                <small className="board-total-context">{c.olderPrice[locale]}</small>
              )}
            </article>
          );
        })}
      </div>
      <p className="earnings-board-note">{c.note[locale]}</p>
      <EarningsBoardCharts
        board={board}
        entries={entries.map((e) => ({
          binding: e.binding,
          name: e.name,
          compute: e.data.compute,
          officialRun: e.data.officialRun,
        }))}
        previewHistory={previewHistory}
        preview={preview}
      />
      <details className="board-details">
        <summary>
          {c.details[locale]} <span>↗</span>
        </summary>
        <div className="earnings-board-scroll">
          <table>
            <thead>
              <tr>
                <th>{c.project[locale]}</th>
                <th>{c.devices[locale]}</th>
                <th>{c.amount[locale]}</th>
                <th>{c.usd[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {board.projects.map((row) => (
                <tr key={row.project}>
                  <th>
                    <a href={projectPath(locale, row.project)}>{FLEET_NAMES[row.project]} ↗</a>
                    {row.project === "iota" && (
                      <IotaRunLabels
                        runs={entries
                          .filter((e) => e.binding.project === "iota")
                          .map((e) => e.data.officialRun)}
                      />
                    )}
                  </th>
                  <td className="earnings-board-devices" data-label={c.devices[locale]}>
                    {row.devices.size}
                  </td>
                  <td className="earnings-board-value">
                    {[...row.metrics.values()].map((m) => (
                      <div key={m.window + m.unit} className="earnings-board-metric">
                        <b>
                          {nf.format(m.amount)} {m.unit}
                        </b>
                        <small>
                          {c.windows[m.window][locale]}
                          {m.stale ? ` · ${c.older[locale]}` : ""}
                        </small>
                      </div>
                    ))}
                    {row.accounts.size === 1 ? (
                      [...row.accounts.values()].map((m, i) => (
                        <div key={i} className="earnings-board-metric">
                          <span>
                            {m.amount} {m.unit}
                          </span>
                          <small>
                            {c[m.kind][locale]}
                            {m.stale ? ` · ${c.older[locale]}` : ""}
                          </small>
                        </div>
                      ))
                    ) : row.accounts.size > 1 ? (
                      <details>
                        <summary>
                          {row.accounts.size} {c.accounts[locale]}
                        </summary>
                        {[...row.accounts.entries()].map(([key, m]) => (
                          <div key={key} className="earnings-board-metric">
                            <code>{shortId(m.identifier)}</code>
                            <span>
                              {m.amount} {m.unit}
                            </span>
                            <small>
                              {c[m.kind][locale]}
                              {m.stale ? ` · ${c.older[locale]}` : ""}
                            </small>
                          </div>
                        ))}
                      </details>
                    ) : null}
                    {row.known === 0 && row.accounts.size === 0 && (
                      <span className="earnings-board-muted">{c.missing[locale]}</span>
                    )}
                  </td>
                  <td className="earnings-board-usd" data-label={c.usd[locale]}>
                    {[...row.metrics.values()].map((m) => (
                      <div className="earnings-board-metric" key={m.window + m.unit}>
                        <b>{formatUsd(m.usd)}</b>
                        <small>{c.windows[m.window][locale]}</small>
                      </div>
                    ))}
                    {row.metrics.size === 0 && "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
