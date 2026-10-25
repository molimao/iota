import { tscPoolCopy, TSC_POOLS } from "./tensorcash-pool-copy";
import { useAuth } from "@/hooks/use-auth";
import { QuietDetails } from "./simple-ui";
import { csdLabels } from "./csd-copy";
import { bntLabels } from "./bnt-copy";
import { mdsLabels } from "./mds-copy";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPoolAccount } from "@/lib/pool-monitor.functions";
import { poolHashrate } from "@/lib/pool-monitor";
import {
  poolAccountUrl,
  poolProvider,
  poolAccountKey,
  type PoolProvider,
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
import { prlPoolCopy } from "./prl-pool-copy";
import "./prl-pool.css";
export function PoolPage({ project }: { project: PoolProject }) {
  return project === "bnt" ? <BntDashboard /> : <PoolLookupPage project={project} />;
}
function PoolLookupPage({ project }: { project: PoolProject }) {
  const auth = useAuth();
  const { locale } = useLocale(),
    fc = fleetCopy(locale),
    info = POOL_PROJECTS[project];
  const [provider, setProvider] = useState<PoolProvider>(poolProvider(project));
  const lucky = project === "prl" && provider === "luckypool";
  const [input, setInput] = useState(""),
    [address, setAddress] = useState(""),
    [invalid, setInvalid] = useState(false);
  const q = useQuery({
    queryKey: poolAccountKey(project, address, provider),
    queryFn: () => getPoolAccount({ data: { project, address, pool: provider } }),
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
          {info.name} ·{" "}
          {project === "tsc" && provider === "chain"
            ? tscPoolCopy.chain[locale]
            : poolName(project, provider)}
        </h1>
        <p>
          {project === "tsc"
            ? tscPoolCopy.summary[locale]
            : project === "prl"
              ? prlPoolCopy.summary[locale]
              : poolEditorial[project].summary[locale]}
        </p>
      </header>
      {(project === "prl" || project === "tsc") && (
        <>
          <label className="prl-pool-select">
            {project === "tsc" ? tscPoolCopy.source[locale] : c.pool[locale]}
            <select
              value={provider}
              onChange={(event) => {
                setProvider(event.target.value as PoolProvider);
              }}
            >
              {project === "tsc" ? (
                TSC_POOLS.map((p) => (
                  <option key={p} value={p}>
                    {p === "chain" ? tscPoolCopy.chain[locale] : poolName("tsc", p)}
                  </option>
                ))
              ) : (
                <>
                  <option value="kryptex">Kryptex</option>
                  <option value="luckypool">LuckyPool</option>
                </>
              )}
            </select>
          </label>
          <p className="compute-caption">
            {project === "tsc" ? tscPoolCopy.scope[locale] : prlPoolCopy.scope[locale]}
          </p>
        </>
      )}
      {project === "tsc" && <p className="compute-caption">{tscPoolCopy.period[locale]}</p>}
      <ProjectAddressBook
        project={project}
        pool={provider}
        autoSelect={false}
        onSelect={selectSaved}
      />
      <QuietDetails title={c.query[locale]} open={!!address || !auth.userId}>
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
                {q.data?.error === "pool-paused"
                  ? tscPoolCopy.paused[locale]
                  : q.data?.error === "not-found"
                    ? project === "prl"
                      ? prlPoolCopy.notFound[locale]
                      : poolWorkerCardsCopy.notFound[locale]
                    : q.data?.error === "invalid-data"
                      ? poolWorkerCardsCopy.unreadable[locale]
                      : poolWorkerCardsCopy.requestFailed[locale]}
              </p>
            )}
            {q.data?.stale && <p>{fc.stale}</p>}
            {d && d.chainBalanceExact != null && (
              <section className="pool-results">
                <div className="pool-metrics">
                  <div>
                    <span>{tscPoolCopy.chain[locale]}</span>
                    <strong>{d.chainBalanceExact} TSC</strong>
                  </div>
                </div>
              </section>
            )}
            {d && d.chainBalanceExact == null && (
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
                      poolHashrate(project, d.hashrate, d.rateUnit),
                    ],
                    ...(project === "btc"
                      ? []
                      : [
                          [
                            project === "bnt"
                              ? bntLabels.confirmed[locale]
                              : project === "mds"
                                ? mdsLabels.balance[locale]
                                : lucky
                                  ? prlPoolCopy.unlocked[locale]
                                  : c.balance[locale],
                            `${value(d.balance)} ${info.token}`,
                          ],
                          [
                            project === "csd"
                              ? csdLabels.pending[locale]
                              : project === "bnt"
                                ? bntLabels.estimated[locale]
                                : lucky
                                  ? prlPoolCopy.reward[locale]
                                  : c[d.period][locale],
                            `${value(project === "bnt" || project === "csd" ? d.pendingEstimate : d.reward)} ${info.token}`,
                          ],
                          ...(lucky
                            ? [
                                [
                                  prlPoolCopy.locked[locale],
                                  `${value(d.pendingEstimate)} ${info.token}`,
                                ],
                              ]
                            : []),
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
                {lucky && (
                  <>
                    <p className="compute-caption">{prlPoolCopy.note[locale]}</p>
                    <p className="compute-caption">
                      {prlPoolCopy.accepted[locale]} · {value(d.acceptedShares)}
                      {d.lastShare != null && (
                        <>
                          {" "}
                          · {poolWorkerCardsCopy.lastShare[locale]}{" "}
                          {new Intl.DateTimeFormat(locale, {
                            dateStyle: "short",
                            timeStyle: "medium",
                            timeZone: "Asia/Hong_Kong",
                          }).format(d.lastShare)}{" "}
                          · UTC+8
                        </>
                      )}
                    </p>
                  </>
                )}
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
                  key={`${project}:${provider}:${address}`}
                  project={project}
                  address={address}
                  account={d}
                  locale={locale}
                />
              </>
            )}
            <a href={poolAccountUrl(project, address, provider)} target="_blank" rel="noreferrer">
              {project === "tsc" && provider === "chain"
                ? tscPoolCopy.chain[locale]
                : c.source[locale]}{" "}
              ↗
            </a>
          </section>
        )}
      </QuietDetails>
      {!lucky && <ProjectAbout project={project} />}
    </main>
  );
}
