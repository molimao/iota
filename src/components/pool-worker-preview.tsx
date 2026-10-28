import type { ReactNode } from "react";
import { useState } from "react";
import { localized } from "@/lib/product-discovery";
import type { ProjectReading } from "./fleet-review-data";
import type { SiteLocale } from "@/lib/site";
import type { PoolProject } from "@/lib/pool-projects";
import { poolHashrate } from "@/lib/pool-monitor";
import { poolWorkerCardsCopy as c } from "./pool-worker-cards-copy";

const collapse = localized(["收起", "收起", "Show less", "접기", "折りたたむ"]);

/** A wallet's workers are activity records, never new fleet devices. */
export function PoolWorkerPreview({
  project,
  data,
  locale,
  workerAgent,
}: {
  project: PoolProject;
  data: NonNullable<ProjectReading["poolWorkers"]>;
  locale: SiteLocale;
  workerAgent?: ((worker: string) => ReactNode) | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="pab-workers" aria-label={c.workers[locale]}>
      <h4>
        {c.workers[locale]} <span>{data.count}</span>
      </h4>
      {data.workers.length === 0 ? (
        <p>{data.count > 0 ? c.missingList[locale] : c.noWorkers[locale]}</p>
      ) : (
        <ul>
          {data.workers.slice(0, expanded ? undefined : 3).map((worker, index) => (
            <li
              key={`${worker.name}-${index}`}
              className={workerAgent ? "pab-worker-with-agent" : undefined}
            >
              <div>
                <span
                  className="pab-worker-dot"
                  data-state={
                    worker.online === true
                      ? "online"
                      : worker.online === false
                        ? "offline"
                        : "unknown"
                  }
                />
                <strong title={worker.name}>{worker.name}</strong>
              </div>
              <div>
                <b>{poolHashrate(project, worker.hashrate, data.rateUnit)}</b>
                <small>
                  {worker.online === true
                    ? c.online[locale]
                    : worker.online === false
                      ? c.offline[locale]
                      : c.unknown[locale]}
                </small>
              </div>
              {workerAgent && (
                <div className="pool-worker-agent-slot">{workerAgent(worker.name)}</div>
              )}
            </li>
          ))}
        </ul>
      )}
      {data.workers.length > 3 && (
        <button
          type="button"
          className="pab-worker-more"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? collapse[locale]
            : `${c.all[locale]} ${data.workers.length} ${c.workers[locale]}`}
        </button>
      )}
      {data.count > data.workers.length && (
        <small>{c.partialList[locale].replace("{count}", String(data.count))}</small>
      )}
    </section>
  );
}
