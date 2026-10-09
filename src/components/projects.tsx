import { ProjectAccessLabel } from "./onboarding";
import { DiscoveryQuestions } from "./discovery-questions";
import { readQuery } from "@/lib/read-query";
import { hongKongDayStartSeconds } from "@/lib/earnings";
import { isPlatform } from "@/lib/platforms";
import { platformCopy, platformEditorial } from "./platform-copy";
import { ProjectAbout } from "./project-about";
import { editorialCopy } from "./project-editorial";
import { QuietDetails, simpleCopy } from "./simple-ui";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Cpu,
  Layers,
  Pickaxe,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useLocale } from "./site/locale";
import { projectsCopy } from "./projects-copy";
import {
  PROJECT_IDS,
  PROJECTS,
  projectPath,
  validProjectAddress,
  type MiningProject,
  type MonitorProject,
  type ProjectNetwork,
  type ProjectResult,
  type SavedProjectAddress,
  type ProjectBlock,
} from "@/lib/projects";
import { getProjectNetwork, getQuantusAccount } from "@/lib/projects.functions";
import { LANGUAGE_TAG, type SiteLocale } from "@/lib/site";
import { shortId } from "@/lib/ss58";
import { ProjectLearning } from "./site/project-learning";
import { getArticle } from "./site/articles";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { fleetCopy } from "./fleet-copy";

export function ProjectSwitch() {
  const { locale } = useLocale();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const articleProject = getArticle(path.match(/\/learn\/([^/]+)/)?.[1] ?? "")?.project;
  const selected = (path.match(
    /\/projects\/(xid|quantus|flyai|nosana|gonka|akash|ionet|vast|golem)(?:\/|$)/,
  )?.[1] ??
    (articleProject && articleProject !== "iota" && articleProject !== "all"
      ? articleProject
      : undefined)) as MonitorProject | undefined;
  const c = projectsCopy[locale];
  return (
    <details className="project-picker">
      <summary aria-label={c.projects}>
        {selected ? PROJECTS[selected].name : path.endsWith("/projects") ? c.projects : "IOTA"}
        <ChevronDown size={13} />
      </summary>
      <div className="project-options">
        {PROJECT_IDS.map((id) => (
          <a
            key={id}
            href={projectPath(locale, id)}
            aria-current={
              selected === id || (!selected && !path.endsWith("/projects") && id === "iota")
                ? "page"
                : undefined
            }
          >
            <b>{PROJECTS[id].name}</b>
            <small>{PROJECTS[id].detail}</small>
          </a>
        ))}
        <a href={`/${locale}/projects`}>
          {c.back}
          <ArrowRight size={14} />
        </a>
      </div>
    </details>
  );
}

export function ProjectCards({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale(),
    c = projectsCopy[locale];
  return (
    <div className={`project-cards${compact ? " compact" : ""}`}>
      {PROJECT_IDS.map((id) => (
        <a className="project-card" key={id} href={projectPath(locale, id)}>
          <div className="project-card-top">
            <span className="project-symbol">
              {id !== "xid" && id !== "quantus" ? <Cpu /> : <Pickaxe />}
            </span>
            <span className="project-kind">
              {id === "akash"
                ? platformCopy(locale).cloud
                : id === "vast"
                  ? platformCopy(locale).rental
                  : id === "golem"
                    ? platformCopy(locale).distributed
                    : id === "ionet"
                      ? editorialCopy(locale).gpu
                      : id === "nosana"
                        ? editorialCopy(locale).gpu
                        : id === "gonka"
                          ? editorialCopy(locale).inference
                          : id === "iota"
                            ? c.training
                            : id === "flyai"
                              ? c.compute
                              : c.mining}
            </span>
          </div>
          <h2>{PROJECTS[id].name}</h2>
          <p>
            {isPlatform(id)
              ? platformEditorial[id].summary[locale]
              : simpleCopy(locale).projectSummary[id]}
          </p>
          <ProjectAccessLabel project={id} />
          <span className="project-card-link">
            {c.open}
            <ArrowUpRight size={18} />
          </span>
        </a>
      ))}
    </div>
  );
}

export function ProjectsHub() {
  const { locale } = useLocale(),
    c = projectsCopy[locale];
  return (
    <main className="projects-page">
      <header className="project-heading">
        <div>
          <h1>{c.projects}</h1>
          <p>{simpleCopy(locale).chooseProject}</p>
        </div>
      </header>
      <ProjectCards />
      <DiscoveryQuestions />
      <a className="simple-help-link" href={`/${locale}/learn`}>
        {simpleCopy(locale).help}
        <ArrowUpRight size={15} />
      </a>
    </main>
  );
}

function fmt(value: number | null | undefined, locale: SiteLocale, digits = 2) {
  return value == null
    ? "—"
    : new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: digits }).format(value);
}
function hash(value: number | null | undefined, locale: SiteLocale) {
  return value == null
    ? "—"
    : value >= 1000
      ? `${fmt(value / 1000, locale)} GH/s`
      : `${fmt(value, locale)} MH/s`;
}
function clock(value: number | null | undefined, locale: SiteLocale) {
  return value == null
    ? "—"
    : new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
        timeZone: "Asia/Hong_Kong",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(value);
}
function amount(value: string | null | undefined) {
  if (value == null) return "—";
  const [whole, decimal] = value.split(".");
  return `${whole!.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${decimal ? `.${decimal}` : ""}`;
}

function Freshness<T>({
  result,
  sourceUpdatedAt,
}: {
  result: ProjectResult<T> | undefined;
  sourceUpdatedAt?: number | null | undefined;
}) {
  const { locale } = useLocale(),
    c = projectsCopy[locale];
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="project-freshness">
      <div>
        <span>
          {c.fetched} · {clock(result?.fetchedAt, locale)} (UTC+8)
        </span>
        {sourceUpdatedAt !== undefined && (
          <span>
            {c.sample} · {clock(sourceUpdatedAt, locale)} (UTC+8)
          </span>
        )}
      </div>
      {result?.error && (
        <p role="status">
          {result.error === "invalid-data" ? c.badData : c.failed}{" "}
          {result.stale ? c.cached : c.unavailable}
        </p>
      )}
      {now && sourceUpdatedAt && now - sourceUpdatedAt > 600000 ? (
        <p role="status">{c.sourceOld}</p>
      ) : null}
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string | undefined }) {
  return (
    <div className="project-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function Trend({
  data,
  title,
  locale,
}: {
  data: ProjectNetwork["series"];
  title: string;
  locale: SiteLocale;
}) {
  const c = projectsCopy[locale];
  if (data.length < 2)
    return (
      <div className="project-panel">
        <h2>{title}</h2>
        <p>{c.unavailable}</p>
      </div>
    );
  const low = Math.min(...data.map((p) => p.value)),
    high = Math.max(...data.map((p) => p.value)),
    range = high - low || 1;
  const point = (i: number) =>
    `${50 + (i / (data.length - 1)) * 720},${200 - ((data[i]!.value - low) / range) * 150}`;
  const line = data.map((_, i) => point(i)).join(" ");
  return (
    <figure className="project-panel project-chart">
      <figcaption>
        <h2>{title}</h2>
        <p>{c.chartNote}</p>
      </figcaption>
      <svg viewBox="0 0 800 245" role="img" aria-label={title}>
        {[50, 125, 200].map((y, i) => (
          <g key={y}>
            <line x1="50" x2="770" y1={y} y2={y} stroke="currentColor" opacity=".12" />
            <text x="40" y={y + 4} textAnchor="end">
              {new Intl.NumberFormat(LANGUAGE_TAG[locale], {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(high - ((high - low) * i) / 2)}
            </text>
          </g>
        ))}
        <polygon points={`50,200 ${line} 770,200`} fill="currentColor" opacity=".05" />
        <polyline points={line} fill="none" stroke="currentColor" strokeWidth="2.5" />
        {data.map((p, i) => (
          <circle
            key={p.height}
            cx={50 + (i / (data.length - 1)) * 720}
            cy={200 - ((p.value - low) / range) * 150}
            r="5"
            fill="transparent"
          >
            <title>{`${c.block} ${p.height} · ${fmt(p.value, locale)}`}</title>
          </circle>
        ))}
        {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
          <text
            key={i}
            x={50 + (i / (data.length - 1)) * 720}
            y="230"
            textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
          >
            #{data[i]!.height}
          </text>
        ))}
      </svg>
    </figure>
  );
}

function BlockTable({
  blocks,
  token,
  project,
}: {
  blocks: ProjectBlock[];
  token: string;
  project: MiningProject;
}) {
  const { locale } = useLocale(),
    c = projectsCopy[locale];
  return blocks.length ? (
    <div className="project-table-scroll">
      <table className="project-table">
        <thead>
          <tr>
            <th>{c.block}</th>
            <th>{c.time} (UTC+8)</th>
            <th>
              {c.reward} · {token}
            </th>
            <th>{c.miner}</th>
          </tr>
        </thead>
        <tbody>
          {blocks.slice(0, 12).map((b) => (
            <tr key={b.height}>
              <td>
                <a
                  href={`${PROJECTS[project].explorer}blocks/${b.height}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  #{b.height}
                </a>
              </td>
              <td>{clock(b.timestamp, locale)}</td>
              <td>{amount(b.reward)}</td>
              <td title={b.miner ?? undefined}>{b.miner ? shortId(b.miner) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>{c.none}</p>
  );
}

function QuantusAddress({ saved, onRemove }: { saved: SavedProjectAddress; onRemove: () => void }) {
  const { locale } = useLocale(),
    c = projectsCopy[locale];
  const client = useQueryClient();
  const query = useQuery({
    ...readQuery(
      client,
      ["projects", "quantus", "account", saved.address, hongKongDayStartSeconds()],
      () => getQuantusAccount({ data: { address: saved.address } }),
    ),
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
    retry: 1,
    staleTime: 45000,
  });
  const account = query.data?.data;
  return (
    <article className="project-address-card">
      <AddressHeading saved={saved} onRemove={onRemove} />
      <Freshness result={query.data} />
      {query.isError && <p role="alert">{c.failed}</p>}
      {account && !account.found && <p>{c.notFound}</p>}
      <div className="project-reward-grid">
        <Stat label={c.today} value={`${amount(account?.today)} QTC`} />
        <Stat label={c.lifetime} value={`${amount(account?.lifetime)} QTC`} />
        <Stat label={c.blocks} value={fmt(account?.blocks, locale, 0)} />
      </div>
      <p className="project-footnote">{c.todayNote}</p>
      <details className="project-records">
        <summary>{c.recentRewards}</summary>
        <BlockTable blocks={account?.recent ?? []} token="QTC" project="quantus" />
      </details>
      <a
        className="text-link"
        href={`https://explorer.quantus.com/accounts/${saved.address}`}
        target="_blank"
        rel="noreferrer"
      >
        {c.explorer}
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}

function AddressHeading({ saved, onRemove }: { saved: SavedProjectAddress; onRemove: () => void }) {
  const { locale } = useLocale(),
    c = projectsCopy[locale];
  return (
    <header className="project-address-heading">
      <div>
        <h3>{saved.name || shortId(saved.address)}</h3>
        <code>{saved.address}</code>
      </div>
      <button
        type="button"
        className="project-icon-button"
        onClick={onRemove}
        aria-label={`${c.remove} ${saved.name || shortId(saved.address)}`}
      >
        <Trash2 size={16} />
      </button>
    </header>
  );
}

function XidAddress({
  saved,
  onRemove,
  network,
}: {
  saved: SavedProjectAddress;
  onRemove: () => void;
  network: ProjectNetwork | null | undefined;
}) {
  const { locale } = useLocale(),
    c = projectsCopy[locale];
  const workers = network?.workers.filter((w) => w.address === saved.address) ?? [];
  return (
    <article className="project-address-card">
      <AddressHeading saved={saved} onRemove={onRemove} />
      <div className="project-reward-grid">
        <Stat label={c.balance} value={`${fmt(network?.balances[saved.address], locale, 8)} XID`} />
        <Stat label={c.blocks} value={fmt(network?.minedBlocks[saved.address], locale, 0)} />
      </div>
      <p className="project-footnote">{c.balanceNote}</p>
      {workers.length ? (
        <div className="project-table-scroll">
          <table className="project-table">
            <thead>
              <tr>
                <th>{c.worker}</th>
                <th>{c.hashrate}</th>
                <th>{c.reported}</th>
                <th>{c.shares}</th>
                <th>{c.lastSeen} (UTC+8)</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={`${w.name}:${i}`}>
                  <td>{w.name}</td>
                  <td>{hash(w.hashrate, locale)}</td>
                  <td>{hash(w.reportedHashrate, locale)}</td>
                  <td>{fmt(w.shares, locale, 0)}</td>
                  <td>{clock(w.lastSeen, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{c.noWorkers}</p>
      )}
      <a className="text-link" href={PROJECTS.xid.explorer} target="_blank" rel="noreferrer">
        {c.explorer}
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}

function AddressMonitor({
  project,
  network,
}: {
  project: MiningProject;
  network: ProjectNetwork | null | undefined;
}) {
  const { locale } = useLocale(),
    c = projectsCopy[locale];
  const auth = useAuth(),
    fleet = useFleet(auth.userId, auth.ready),
    fc = fleetCopy(locale);
  const saved = useMemo(
    () =>
      Array.from(
        new Map(
          fleet.devices.flatMap((d) =>
            d.bindings
              .filter((b) => b.project === project)
              .map((b) => [b.identifier, { address: b.identifier, name: d.name }] as const),
          ),
        ).values(),
      ),
    [fleet.devices, project],
  );
  const ready = fleet.ready;
  const [address, setAddress] = useState(""),
    [name, setName] = useState(""),
    [saving, setSaving] = useState(false),
    [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setAddress("");
    setName("");
    setError(null);
  }, [project]);
  async function removeAddress(address: string) {
    try {
      for (const device of fleet.devices) {
        const matching = device.bindings.filter(
          (b) => b.project === project && b.identifier === address,
        );
        if (!matching.length) continue;
        if (matching.length === device.bindings.length)
          await fleet.mutate({ action: "remove", payload: { id: device.id } });
        else
          for (const binding of matching)
            await fleet.mutate({
              action: "unlink",
              payload: { id: device.id, bindingId: binding.id },
            });
      }
      setError(null);
    } catch {
      setError(c.storage);
    }
  }
  return (
    <section className="project-monitor" id="addresses">
      <div className="project-section-head">
        <div>
          <h2>{c.mine}</h2>
        </div>
        {saved.length > 0 && (
          <button
            className="project-outline"
            type="button"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify({ project, addresses: saved }, null, 2)], {
                  type: "application/json",
                }),
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = `${project}-addresses.json`;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            {c.export}
          </button>
        )}
      </div>
      <form
        className="project-address-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const value = address.trim();
          if (!validProjectAddress(project, value)) {
            setError(c.invalid);
            return;
          }
          if (saved.some((s) => s.address === value)) {
            setError(c.duplicate);
            return;
          }
          setSaving(true);
          try {
            await fleet.mutate({
              action: "create",
              payload: {
                name: name.trim() || PROJECTS[project].name,
                hardware: "",
                binding: { project, identifier: value, worker: "" },
              },
            });
            setAddress("");
            setName("");
            setError(null);
          } catch (e) {
            setError(
              e instanceof Error && e.message === "project_device_limit_reached"
                ? fc.limit
                : c.storage,
            );
          } finally {
            setSaving(false);
          }
        }}
      >
        <label>
          {c.label}
          <input
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label>
          {c.address}
          <input
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError(null);
            }}
            placeholder={project === "xid" ? "xpa1r…" : "qz…"}
            maxLength={100}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={error === c.invalid}
          />
        </label>
        <button className="site-button" disabled={!ready || saving} type="submit">
          {c.add}
          <ArrowRight size={17} />
        </button>
      </form>
      <p className="project-footnote">{c.noSecrets}</p>
      {error && (
        <p className="project-warning" role="alert">
          {error}
          {error === fc.limit && (
            <a href={"/" + locale + "/devices?upgrade=" + project}> · {fc.viewPro} →</a>
          )}
        </p>
      )}
      {!saved.length ? (
        <div className="project-empty">
          <Layers size={24} />
          <p>{c.empty}</p>
        </div>
      ) : (
        saved.map((s) =>
          project === "quantus" ? (
            <QuantusAddress
              key={s.address}
              saved={s}
              onRemove={() => void removeAddress(s.address)}
            />
          ) : (
            <XidAddress
              key={s.address}
              saved={s}
              network={network}
              onRemove={() => void removeAddress(s.address)}
            />
          ),
        )
      )}
    </section>
  );
}

export function MiningProjectPage({
  project,
  initial,
}: {
  project: MiningProject;
  initial: ProjectResult<ProjectNetwork> | null;
}) {
  const { locale } = useLocale(),
    c = projectsCopy[locale],
    p = PROJECTS[project];
  const client = useQueryClient();
  const query = useQuery({
    ...readQuery(client, ["projects", project, "network"], () =>
      getProjectNetwork({ data: { project } }),
    ),
    initialData: initial ?? undefined,
    initialDataUpdatedAt: initial?.fetchedAt ?? 0,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
    staleTime: 45000,
    retry: 1,
  });
  const n = query.data?.data;
  const [refreshing, setRefreshing] = useState(false);
  async function refresh() {
    setRefreshing(true);
    try {
      const network = await getProjectNetwork({ data: { project, force: true } });
      client.setQueryData(["projects", project, "network"], network);
      if (project === "quantus") {
        const accounts = client
          .getQueryCache()
          .findAll({ queryKey: ["projects", "quantus", "account"], type: "active" });
        for (const account of accounts) {
          const address = account.queryKey[3];
          if (typeof address === "string") {
            const result = await getQuantusAccount({ data: { address, force: true } });
            client.setQueryData(account.queryKey, result);
          }
        }
      }
    } catch {
      await query.refetch();
    } finally {
      setRefreshing(false);
    }
  }
  return (
    <main className="projects-page project-detail">
      <a className="project-back" href={`/${locale}/projects`}>
        ← {c.back}
      </a>
      <header className="project-heading">
        <div>
          <span className="eyebrow">
            {c.mining} · {c.mainnet} · {p.token}
          </span>
          <h1>{project === "xid" ? "XID / MMM" : "Quantus"}</h1>
          <p>{simpleCopy(locale).projectSummary[project]}</p>
        </div>
        <div className="project-heading-links">
          <a className="site-button" href="#addresses">
            {c.mine}
            <ArrowRight size={17} />
          </a>
          <a className="text-link" href={p.guide} target="_blank" rel="noreferrer">
            {c.guide}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </header>
      <AddressMonitor key={project} project={project} network={n} />
      <section className="project-network" id="network">
        <div className="project-section-head">
          <h2>{c.network}</h2>
          <button
            type="button"
            className="project-outline"
            disabled={query.isFetching || refreshing}
            onClick={() => void refresh()}
          >
            <RefreshCw size={15} className={query.isFetching || refreshing ? "animate-spin" : ""} />
            {query.isFetching || refreshing ? c.refreshing : c.refresh}
          </button>
        </div>
        <Freshness result={query.data} sourceUpdatedAt={n?.sourceUpdatedAt} />
        {query.isError && <p role="alert">{c.failed}</p>}
        <div className="project-stats">
          {project === "xid" ? (
            <>
              <Stat label={c.chainHashrate} value={hash(n?.chainHashrate, locale)} />
              <Stat
                label={c.poolHashrate}
                value={hash(n?.poolHashrate, locale)}
                note={n?.poolStale ? c.poolOld : undefined}
              />
              <Stat label={c.workers} value={fmt(n?.listedWorkers, locale, 0)} />
            </>
          ) : (
            <>
              <Stat label={c.historicalMiners} value={fmt(n?.minersEverRewarded, locale, 0)} />
              <Stat label={c.accounts} value={fmt(n?.accounts, locale, 0)} />
              <Stat
                label={c.interval}
                value={
                  n?.blockSeconds == null ? "—" : `${fmt(n.blockSeconds, locale)} ${c.seconds}`
                }
              />
            </>
          )}
          <Stat label={c.height} value={fmt(n?.height, locale, 0)} />
        </div>
        <Trend
          data={n?.series ?? []}
          title={project === "xid" ? c.difficulty : `${c.blockTrend} (${c.seconds})`}
          locale={locale}
        />
        {project === "quantus" && (
          <div className="project-panel">
            <h2>{c.records}</h2>
            <BlockTable blocks={n?.blocks ?? []} token="QTC" project={project} />
          </div>
        )}
      </section>
      <QuietDetails title={simpleCopy(locale).help}>
        <ProjectLearning project={project} />
        <section id="setup" className="project-panel project-setup">
          <h2>{c.setup}</h2>
          <ol>
            {[
              [c.first, project === "xid" ? c.xidStep : c.quantusStep],
              [c.second, c.publicStep],
              [c.third, c.monitorStep],
            ].map(([title, body], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </QuietDetails>
      <QuietDetails title={c.sources}>
        <section className="project-panel project-sources">
          <h2>{c.sources}</h2>
          <p>{project === "xid" ? c.poolScope : c.quantusScope}</p>
          <div>
            <a href={p.website} target="_blank" rel="noreferrer">
              {c.website}
              <ArrowUpRight size={14} />
            </a>
            <a href={p.explorer} target="_blank" rel="noreferrer">
              {c.explorer}
              <ArrowUpRight size={14} />
            </a>
            <a href={p.guide} target="_blank" rel="noreferrer">
              {c.guide}
              <ArrowUpRight size={14} />
            </a>
            <a
              href={
                project === "xid"
                  ? "https://github.com/SystemThreat/MMM"
                  : "https://github.com/Quantus-Network/quantus-miner/releases"
              }
              target="_blank"
              rel="noreferrer"
            >
              {c.download}
              <ArrowUpRight size={14} />
            </a>
          </div>
        </section>
      </QuietDetails>
      <ProjectAbout project={project} />
    </main>
  );
}
