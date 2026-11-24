import { tscPoolCopy, TSC_POOLS } from "./tensorcash-pool-copy";
import { useAuth } from "@/hooks/use-auth";
import { QuietDetails } from "./simple-ui";
import { csdLabels } from "./csd-copy";
import { bntLabels } from "./bnt-copy";
import { mdsLabels } from "./mds-copy";
import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { findPearlPools, getLuckyPoolNock, getPoolAccount } from "@/lib/pool-monitor.functions";
import { poolHashrate } from "@/lib/pool-monitor";
import {
  poolAccountUrl,
  poolProvider,
  poolAccountKey,
  type PoolProvider,
  poolName,
  PRL_POOL_IDS,
  POOL_PROJECTS,
  validPoolAddress,
  validNockAddress,
  validPoolProvider,
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
import { localized as l } from "@/lib/product-discovery";
import "./prl-pool.css";

const PRL_POOL_PREFERENCE = "iota-prl-pool";
const qtcCopy = {
  summary: l([
    "查矿池里的 Worker、余额和付款记录。登录后可保存地址。",
    "查詢礦池的 Worker、餘額和付款紀錄。登入後可儲存地址。",
    "Check workers, balances and payouts from this pool. Sign in to save an address.",
    "이 풀의 Worker, 잔액, 지급 내역을 확인하세요. 로그인하면 주소를 저장할 수 있습니다.",
    "このプールの Worker・残高・支払いを確認できます。ログインするとアドレスを保存できます。",
  ]),
  payouts: l(["最近支付", "最近付款", "Recent payouts", "최근 지급", "最近の支払い"]),
};

export function PoolPage({ project, initialPool }: { project: PoolProject; initialPool?: PoolProvider }) {
  return project === "bnt" ? <BntDashboard /> : <PoolLookupPage project={project} initialPool={initialPool} />;
}
function PoolLookupPage({ project, initialPool }: { project: PoolProject; initialPool?: PoolProvider | undefined }) {
  const auth = useAuth();
  const { locale } = useLocale(),
    fc = fleetCopy(locale),
    info = POOL_PROJECTS[project];
  const [provider, setProvider] = useState<PoolProvider>(initialPool ?? poolProvider(project));
  useEffect(() => {
    if (project !== "prl") return;
    try {
      const saved = localStorage.getItem(PRL_POOL_PREFERENCE);
      if (validPoolProvider(project, saved)) setProvider(saved);
    } catch {
      /* Display preferences never block monitoring. */
    }
  }, [project]);
  const lucky = project === "prl" && provider === "luckypool";
  const [input, setInput] = useState(""),
    [address, setAddress] = useState(""),
    [invalid, setInvalid] = useState(false);
  const [nockInput, setNockInput] = useState("");
  const [nockAddress, setNockAddress] = useState("");
  const [invalidNock, setInvalidNock] = useState(false);
  const poolSearch = useMutation({ mutationFn: (wallet: string) => findPearlPools({ data: wallet }) });
  const matches = poolSearch.variables === input.trim() ? poolSearch.data : undefined;
  function chooseProvider(next: PoolProvider) {
    setProvider(next);
    if (project !== "prl") return;
    try {
      localStorage.setItem(PRL_POOL_PREFERENCE, next);
    } catch {
      /* Display preferences never block monitoring. */
    }
  }
  const nock = useQuery({
    queryKey: ["pool-account", "nock", nockAddress],
    queryFn: () => getLuckyPoolNock({ data: nockAddress }),
    enabled: lucky && !!nockAddress,
    staleTime: 60000,
    refetchInterval: 120000,
    retry: false,
  });
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
    setNockInput("");
    setNockAddress("");
  }, []);
  const raw = q.data?.data;
  const d =
    raw && (project === "btc" || project === "prl") && q.data?.stale
      ? { ...raw, workers: raw.workers.map((worker) => ({ ...worker, online: null })) }
      : raw;
  const value = (n: number | null | undefined) =>
    n == null ? "—" : n.toLocaleString(locale, { maximumFractionDigits: project === "quantus" ? 12 : 8 });
  const payoutClock = new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Hong_Kong" });
  const addressBook = (
    <ProjectAddressBook
      project={project}
      pool={provider}
      autoSelect={false}
      onSelect={selectSaved}
    />
  );
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
              : project === "quantus"
                ? qtcCopy.summary[locale]
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
                chooseProvider(event.target.value as PoolProvider);
              }}
            >
              {project === "tsc"
                ? TSC_POOLS.map((p) => (
                    <option key={p} value={p}>
                      {p === "chain" ? tscPoolCopy.chain[locale] : poolName("tsc", p)}
                    </option>
                  ))
                : PRL_POOL_IDS.map((p) => (
                    <option key={p} value={p}>
                      {poolName("prl", p)}
                    </option>
                  ))}
            </select>
          </label>
          <p className="compute-caption">
            {project === "tsc" ? tscPoolCopy.scope[locale] : lucky ? prlPoolCopy.nockScope[locale] : prlPoolCopy.scope[locale]}
          </p>
        </>
      )}
      {project === "tsc" && <p className="compute-caption">{tscPoolCopy.period[locale]}</p>}
      {project !== "prl" && addressBook}
      <QuietDetails title={c.query[locale]} open={project === "prl" || !!address || !auth.userId}>
        <form
          className="pool-lookup"
          onSubmit={(e) => {
            e.preventDefault();
            const v = input.trim();
            const bonus = lucky ? nockInput.trim() : "";
            const nockValid = validNockAddress(bonus);
            setInvalidNock(!!bonus && !nockValid);
            if (nockValid && bonus === nockAddress) void nock.refetch();
            else setNockAddress(nockValid ? bonus : "");
            setInvalid((!!v || !bonus) && !validPoolAddress(project, v));
            if (validPoolAddress(project, v)) {
              if (v === address) void q.refetch();
              else setAddress(v);
            } else setAddress("");
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
          {lucky && (
            <label>
              {prlPoolCopy.nockWallet[locale]}
              <input
                value={nockInput}
                onChange={(event) => { setNockInput(event.target.value); setInvalidNock(false); }}
                maxLength={55}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={invalidNock || undefined}
              />
            </label>
          )}
          <button className="site-button">{c.query[locale]}</button>
          {project === "prl" && (
            <button className="fleet-outline" type="button" disabled={poolSearch.isPending}
              onClick={() => {
                const wallet = input.trim();
                setInvalid(!validPoolAddress("prl", wallet));
                if (validPoolAddress("prl", wallet)) poolSearch.mutate(wallet);
              }}>
              {poolSearch.isPending ? fc.loading : prlPoolCopy.findPool[locale]}
            </button>
          )}
        </form>
        {project === "prl" && poolSearch.isError && poolSearch.variables === input.trim() &&
          <p role="alert">{poolWorkerCardsCopy.requestFailed[locale]}</p>}
        {project === "prl" && matches && (
          <div className="prl-pool-matches" role="status">
            <p>{matches.pools.length ? prlPoolCopy.foundPools[locale] : prlPoolCopy.noPool[locale]}</p>
            {matches.pools.map((pool) => (
              <button className="fleet-outline" type="button" key={pool} onClick={() => {
                chooseProvider(pool);
                setAddress(input.trim());
                poolSearch.reset();
              }}>{poolName("prl", pool)}</button>
            ))}
            {matches.incomplete && <p>{prlPoolCopy.incompleteSearch[locale]}</p>}
          </div>
        )}
        {invalid && <p role="alert">{fc.invalidId}</p>}
        {lucky && invalidNock && <p role="alert">{prlPoolCopy.nockScope[locale]}</p>}
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
                      project === "csd"
                        ? csdLabels.rate[locale]
                        : project === "prl" && d.hashrateWindow === "1hr"
                          ? prlPoolCopy.hourRate[locale]
                          : project === "prl" && d.hashrateWindow === "10min"
                            ? prlPoolCopy.tenMinuteRate[locale]
                            : c.rate[locale],
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
                                  : project === "prl" && provider !== "kryptex"
                                    ? prlPoolCopy.owed[locale]
                                    : c.balance[locale],
                            `${value(d.balance)} ${info.token}`,
                          ],
                          ...(project !== "prl" || d.period !== "unknown"
                            ? [
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
                              ]
                            : []),
                          ...(project === "prl" && d.pendingEstimate != null
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
                {!!d.payouts?.length && (
                  <QuietDetails title={qtcCopy.payouts[locale]}>
                    <ul className="qtc-payouts">
                      {d.payouts.map((payment, index) => (
                        <li key={index}>
                          <time dateTime={new Date(payment.at).toISOString()}>{payoutClock.format(payment.at)} · UTC+8</time>
                          <strong>{value(payment.amount)} QTC</strong>
                        </li>
                      ))}
                    </ul>
                  </QuietDetails>
                )}
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
        {lucky && nockAddress && (
          <section aria-label={prlPoolCopy.nockTitle[locale]} aria-live="polite" className="pool-results">
            <h2>{prlPoolCopy.nockTitle[locale]}</h2>
            {nock.isPending && <p>{fc.loading}</p>}
            {nock.data?.error === "not-found" && <p>{prlPoolCopy.notFound[locale]}</p>}
            {(nock.isError || (nock.data?.error && nock.data.error !== "not-found")) &&
              <p>{nock.data?.stale ? fc.stale : poolWorkerCardsCopy.requestFailed[locale]}</p>}
            {nock.data?.data && (
              <div className="pool-metrics">
                {([
                  [c.rolling24h[locale], nock.data.data.reward],
                  [prlPoolCopy.unlocked[locale], nock.data.data.balance],
                  [prlPoolCopy.locked[locale], nock.data.data.pendingEstimate],
                  [c.paid[locale], nock.data.data.paid],
                ] as const).map(([label, amount]) =>
                  <div key={label}><span>{label}</span><strong>{value(amount)} NOCK</strong></div>,
                )}
              </div>
            )}
            <a href={`https://nock.luckypool.io/miner-stats?address=${encodeURIComponent(nockAddress)}`} target="_blank" rel="noreferrer">{c.source[locale]} ↗</a>
          </section>
        )}
      </QuietDetails>
      {project === "prl" && addressBook}
      <ProjectAbout project={project} />
    </main>
  );
}
