import { csdLabels } from "./csd-copy";
import { bntLabels } from "./bnt-copy";
import { mdsLabels } from "./mds-copy";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPoolAccount } from "@/lib/pool-monitor.functions";
import { poolHashrate } from "@/lib/pool-monitor";
import {
  poolAccountUrl,
  poolName,
  POOL_PROJECTS,
  validPoolAddress,
  type PoolProject,
} from "@/lib/pool-projects";
import { ProjectAddressBook } from "./project-address-book";
import { ProjectAbout } from "./project-about";
import { useLocale } from "./site/locale";
import { poolCopy as c, poolEditorial } from "./pool-copy";
import { fleetCopy } from "./fleet-copy";
import { BntDashboard } from "./bnt-dashboard";
import { PoolWorkerCards } from "./pool-worker-cards";
import { poolWorkerCardsCopy } from "./pool-worker-cards-copy";
export function PoolPage({ project }: { project: PoolProject }) {
  return project === "bnt" ? <BntDashboard /> : <PoolLookupPage project={project} />;
}
function PoolLookupPage({ project }: { project: PoolProject }) {
  const { locale } = useLocale(),
    fc = fleetCopy(locale),
    info = POOL_PROJECTS[project];
  const [input, setInput] = useState(""),
    [address, setAddress] = useState(""),
    [invalid, setInvalid] = useState(false);
  const q = useQuery({
    queryKey: ["pool-account", project, address],
    queryFn: () => getPoolAccount({ data: { project, address } }),
    enabled: validPoolAddress(project, address),
    staleTime: 60000,
    refetchInterval: 120000,
    retry: 1,
  });
  const selectSaved = useCallback((id: string) => {
    setAddress(id);
    setInput(id);
    setInvalid(false);
  }, []);
  const raw = q.data?.data;
  const d =
    raw && project === "btc" && q.data?.stale
      ? { ...raw, workers: raw.workers.map((worker) => ({ ...worker, online: null })) }
      : raw;
  const value = (n: number | null | undefined) =>
    n == null ? "—" : n.toLocaleString(locale, { maximumFractionDigits: 8 });
  return (
    <main id="main" className="projects-page pool-page">
      <header className="project-heading">
        <h1>
          {info.name} · {poolName(project)}
        </h1>
        <p>{poolEditorial[project].summary[locale]}</p>
      </header>
      <form
        className="pool-lookup"
        onSubmit={(e) => {
          e.preventDefault();
          const v = input.trim();
          setInvalid(!validPoolAddress(project, v));
          if (validPoolAddress(project, v)) {
            if (v === address) void q.refetch();
            else setAddress(v);
          }
        }}
      >
        <label>
          {project === "csd"
            ? csdLabels.address[locale]
            : project === "bnt"
              ? bntLabels.address[locale]
              : project === "mds"
                ? mdsLabels.address[locale]
                : c.wallet[locale]}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={120}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <button className="site-button">{c.query[locale]}</button>
      </form>
      {invalid && <p role="alert">{fc.invalidId}</p>}
      {address && (
        <section aria-live="polite" className="pool-results">
          {q.isPending && <p>{fc.loading}</p>}
          {(q.isError || q.data?.error) && (
            <p role="alert">
              {q.data?.error === "not-found"
                ? poolWorkerCardsCopy.notFound[locale]
                : q.data?.error === "invalid-data"
                  ? poolWorkerCardsCopy.unreadable[locale]
                  : poolWorkerCardsCopy.requestFailed[locale]}
            </p>
          )}
          {q.data?.stale && <p>{fc.stale}</p>}
          {d && (
            <>
              {q.data?.fetchedAt && (
                <p className="compute-caption">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "short",
                    timeStyle: "medium",
                    timeZone: "Asia/Hong_Kong",
                  }).format(q.data.fetchedAt)}{" "}
                  · UTC+8
                </p>
              )}
              <div className="pool-metrics">
                {[
                  [
                    project === "csd" ? csdLabels.rate[locale] : c.rate[locale],
                    poolHashrate(project, d.hashrate),
                  ],
                  ...(project === "btc"
                    ? []
                    : [
                        [
                          project === "bnt"
                            ? bntLabels.confirmed[locale]
                            : project === "mds"
                              ? mdsLabels.balance[locale]
                              : c.balance[locale],
                          `${value(d.balance)} ${info.token}`,
                        ],
                        [
                          project === "csd"
                            ? csdLabels.pending[locale]
                            : project === "bnt"
                              ? bntLabels.estimated[locale]
                              : c[d.period][locale],
                          `${value(project === "bnt" || project === "csd" ? d.pendingEstimate : d.reward)} ${info.token}`,
                        ],
                        ...(project === "bnt"
                          ? [[bntLabels.queued[locale], `${value(d.queued)} ${info.token}`]]
                          : []),
                        [c.paid[locale], `${value(d.paid)} ${info.token}`],
                      ]),
                ].map(([label, v]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              {project === "btc" && (
                <>
                  <p className="compute-caption">{c.ckpoolWindow[locale]}</p>
                  <p className="compute-caption">{c.ckpoolEarnings[locale]}</p>
                  {d.lastShare != null && (
                    <p className="compute-caption">
                      {poolWorkerCardsCopy.lastShare[locale]}{" "}
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "short",
                        timeStyle: "medium",
                        timeZone: "Asia/Hong_Kong",
                      }).format(d.lastShare)}{" "}
                      · UTC+8
                    </p>
                  )}
                </>
              )}
              {project !== "btc" && (
                <p className="compute-caption">
                  {c.scope[locale]} {d.partial ? c.partial[locale] : ""}
                </p>
              )}
              <PoolWorkerCards
                key={`${project}:${address}`}
                project={project}
                address={address}
                account={d}
                locale={locale}
              />
            </>
          )}
          <a href={poolAccountUrl(project, address)} target="_blank" rel="noreferrer">
            {c.source[locale]} ↗
          </a>
        </section>
      )}
      <ProjectAddressBook project={project} onSelect={selectSaved} />
      <ProjectAbout project={project} />
    </main>
  );
}
