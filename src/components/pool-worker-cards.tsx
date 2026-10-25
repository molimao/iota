/// <reference types="vite/client" />
import "./pool-worker-cards.css";
import { useState } from "react";
import { poolHashrate, type PoolAccount, type PoolWorker } from "@/lib/pool-monitor";
import type { PoolProject } from "@/lib/pool-projects";
import { LANGUAGE_TAG, type SiteLocale } from "@/lib/site";
import { poolWorkerCardsCopy as c } from "./pool-worker-cards-copy";

const PAGE_SIZE = 100;
const CLOCK_SKEW_MS = 2 * 60 * 1000;
const STALE_MS = 24 * 60 * 60 * 1000;
type Status = "all" | "online" | "offline" | "unknown";
type Layout = "cards" | "list";
type ShareKind = "unknown" | "future" | "stale" | "reported";

export function workerStatus(online: boolean | null): Exclude<Status, "all"> {
  if (online === true) return "online";
  if (online === false) return "offline";
  return "unknown";
}

function shareKind(lastSeen: number | null, now: number): ShareKind {
  if (lastSeen == null || !Number.isFinite(lastSeen) || lastSeen <= 0 || lastSeen > 8.64e15)
    return "unknown";
  if (lastSeen > now + CLOCK_SKEW_MS) return "future";
  if (now - lastSeen > STALE_MS) return "stale";
  return "reported";
}

function formatTime(at: number, locale: SiteLocale) {
  return new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Asia/Hong_Kong",
  }).format(at);
}

export function PoolWorkerCards({
  project,
  address,
  account,
  locale,
  now = Date.now(),
  query: initialQuery = "",
  status: initialStatus = "all",
  layout: initialLayout = "cards",
  page: initialPage = 1,
}: {
  project: PoolProject;
  address: string;
  account: PoolAccount;
  locale: SiteLocale;
  now?: number;
  query?: string;
  status?: Status;
  layout?: Layout;
  page?: number;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [layout, setLayout] = useState<Layout>(initialLayout);
  const [page, setPage] = useState(initialPage);
  const workers = account.workers;
  const counts: Record<Status, number> = {
    all: workers.length,
    online: workers.filter((worker) => worker.online === true).length,
    offline: workers.filter((worker) => worker.online === false).length,
    unknown: workers.filter((worker) => worker.online == null).length,
  };
  const needle = query.trim().toLowerCase();
  const matched = workers
    .map((worker, index) => ({ worker, index }))
    .filter(({ worker }) => {
      const state = workerStatus(worker.online);
      return (
        (status === "all" || state === status) &&
        (!needle || worker.name.toLowerCase().includes(needle))
      );
    });
  const pageCount = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = matched.slice(start, start + PAGE_SIZE);
  const filters: Status[] = ["all", "online", "offline", "unknown"];
  return (
    <section className="pwc" aria-label={c.workers[locale]} data-total={workers.length}>
      <p className="pwc-kicker">{c.account[locale]}</p>
      <code className="pwc-address">{address}</code>
      <p className="pwc-note">{c.accountNote[locale]}</p>
      {project === "btc" && <p className="pwc-caption">{c.ckpoolStatus[locale]}</p>}
      {account.workerCount > workers.length && (
        <p className="pwc-caption">
          {c.partialList[locale].replace("{count}", String(account.workerCount))}
        </p>
      )}
      <div className="pwc-tools">
        <label className="pwc-search">
          {c.search[locale]}
          <input
            aria-label={c.search[locale]}
            value={query}
            maxLength={80}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <div className="pwc-filters" role="group" aria-label={c.all[locale]}>
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              data-status={item}
              data-count={counts[item]}
              aria-pressed={status === item}
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
            >
              {c[item][locale]} <small>{counts[item]}</small>
            </button>
          ))}
        </div>
        <div className="pwc-layout" role="group" aria-label={c.cards[locale]}>
          {(["cards", "list"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={layout === item}
              onClick={() => setLayout(item)}
            >
              {c[item][locale]}
            </button>
          ))}
        </div>
      </div>
      {workers.length === 0 ? (
        <p className="pwc-empty" role="status">
          {account.workerCount > 0 ? c.missingList[locale] : c.noWorkers[locale]}
        </p>
      ) : matched.length === 0 ? (
        <>
          <p className="pwc-empty" role="status">
            {c.noResults[locale]}
          </p>
          <button
            type="button"
            className="pwc-clear"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setPage(1);
            }}
          >
            {c.clear[locale]}
          </button>
        </>
      ) : (
        <>
          {matched.length > PAGE_SIZE && (
            <p className="pwc-caption">
              {c.showing[locale]} {start + 1}–{start + visible.length} / {matched.length}
            </p>
          )}
          <div className="pwc-grid" data-layout={layout}>
            {visible.map(({ worker, index }) => (
              <WorkerCard
                key={`${worker.name}:${index}`}
                project={project}
                worker={worker}
                locale={locale}
                now={now}
              />
            ))}
          </div>
          {matched.length > PAGE_SIZE && (
            <div className="pwc-pager">
              <button type="button" disabled={current <= 1} onClick={() => setPage(current - 1)}>
                {c.prev[locale]}
              </button>
              <button
                type="button"
                disabled={current >= pageCount}
                onClick={() => setPage(current + 1)}
              >
                {c.next[locale]}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function WorkerCard({
  project,
  worker,
  locale,
  now,
}: {
  project: PoolProject;
  worker: PoolWorker;
  locale: SiteLocale;
  now: number;
}) {
  const state = workerStatus(worker.online);
  const kind = shareKind(worker.lastSeen, now);
  const rate =
    worker.hashrate == null
      ? c.unknown[locale]
      : poolHashrate(project, worker.hashrate, worker.rateUnit);
  const when =
    kind === "unknown" || worker.lastSeen == null
      ? c.unknown[locale]
      : formatTime(worker.lastSeen, locale);
  return (
    <article className="pwc-card" data-worker={worker.name} data-state={state}>
      <span className="pwc-state" data-state={state}>
        {c[state][locale]}
      </span>
      <h3 className="pwc-name">{worker.name || c.unnamed[locale]}</h3>
      <p className="pwc-metric">
        <span>{c.hashrate[locale]}</span>
        <strong>{rate}</strong>
      </p>
      <p className="pwc-metric">
        <span>{c.lastShare[locale]}</span>
        <time>{when}</time>
        {kind === "future" && <small>{c.futureTime[locale]}</small>}
        {kind === "stale" && (
          <small>{project === "btc" ? c.oldCkShare[locale] : c.staleTime[locale]}</small>
        )}
      </p>
    </article>
  );
}
