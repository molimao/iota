import { useEffect, useRef, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Cpu, Plus, RefreshCw, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { getPoolAccount } from "@/lib/pool-monitor.functions";
import { poolAccountUrl, validPoolAddress } from "@/lib/pool-projects";
import { poolHashrate } from "@/lib/pool-monitor";
import { bntRowState, bntTotals, type BntRow } from "@/lib/bnt-dashboard";
import { projectAddressInput } from "@/lib/project-address-input";
import { canLinkProject } from "@/lib/fleet";
import { useLocale } from "./site/locale";
import { bntLabels } from "./bnt-copy";
import { bntDashboardCopy as copy } from "./bnt-dashboard-copy";
import { fleetCopy } from "./fleet-copy";
import { poolCopy } from "./pool-copy";
import { ProjectAbout } from "./project-about";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

type Add = { raw: string; name: string; worker: string; target: string };
type Props = {
  rows: BntRow[];
  lookup?: BntRow;
  ready: boolean;
  refreshing: boolean;
  signedIn: boolean;
  limit: number;
  error?: string | null;
  preview?: boolean;
  targets: { id: string; name: string }[];
  onLookup: (address: string) => void;
  onRefresh: () => Promise<unknown>;
  onLogin: () => Promise<void>;
  onSave: (input: Add) => Promise<void>;
  onRemove: (row: BntRow) => Promise<void>;
  onRename: (row: BntRow, name: string) => Promise<void>;
};
export function BntDashboard() {
  const auth = useAuth(),
    fleet = useFleet(auth.userId, auth.ready),
    client = useQueryClient();
  const [lookupAddress, setLookupAddress] = useState("");
  const entries = (auth.userId ? fleet.devices : []).flatMap((d) =>
    d.bindings
      .filter((b) => b.project === "bnt")
      .map((b) => ({
        id: b.id,
        deviceId: d.id,
        name: d.name,
        address: b.identifier,
        worker: b.worker,
      })),
  );
  const addresses = [
    ...new Set([...entries.map((r) => r.address), ...(lookupAddress ? [lookupAddress] : [])]),
  ];
  const queries = useQueries({
    queries: addresses.map((address) => ({
      queryKey: ["pool-account", "bnt", address],
      queryFn: () => getPoolAccount({ data: { project: "bnt", address } }),
      staleTime: 60000,
      refetchInterval: 120000,
      refetchIntervalInBackground: false,
      retry: 1,
    })),
  });
  const reading = (row: Omit<BntRow, "result">): BntRow => {
    const q = queries[addresses.indexOf(row.address)];
    return {
      ...row,
      ...(q?.data ? { result: q.data } : {}),
      loading: q?.isPending ?? false,
      failed: q?.isError ?? false,
    };
  };
  const locked = useRef(false);
  const mutation = async (action: () => Promise<void>) => {
    if (locked.current) throw new Error("busy");
    locked.current = true;
    try {
      await action();
    } finally {
      locked.current = false;
    }
  };
  return (
    <BntDashboardView
      rows={entries.map(reading)}
      {...(lookupAddress
        ? { lookup: reading({ id: "lookup", name: "BNT", address: lookupAddress, worker: "" }) }
        : {})}
      ready={auth.ready && (!auth.userId || fleet.ready)}
      refreshing={queries.some((q) => q.isFetching)}
      signedIn={!!auth.userId}
      limit={fleet.limit}
      error={fleet.error || auth.error}
      targets={fleet.devices
        .filter(
          (d) =>
            !d.bindings.some((b) => b.project === "bnt") &&
            canLinkProject(fleet.devices, d.id, "bnt", fleet.limit),
        )
        .map((d) => ({ id: d.id, name: d.name }))}
      onLookup={(address) => {
        setLookupAddress(address);
        void client.invalidateQueries({ queryKey: ["pool-account", "bnt", address] });
      }}
      onLogin={auth.signInWithGoogle}
      onRefresh={() => client.invalidateQueries({ queryKey: ["pool-account", "bnt"] })}
      onSave={(input) =>
        mutation(async () => {
          if (!auth.userId || !fleet.ready) throw new Error("unavailable");
          const ids = projectAddressInput(
            "bnt",
            input.raw,
            entries.filter((r) => r.worker === input.worker.trim()).map((r) => r.address),
            fleet.limit - new Set(entries.map((r) => r.deviceId)).size,
          );
          if (ids.length > 1 && (input.target || input.worker.trim())) throw new Error("invalid");
          if (
            input.target &&
            !fleet.devices.some(
              (d) =>
                d.id === input.target && canLinkProject(fleet.devices, d.id, "bnt", fleet.limit),
            )
          )
            throw new Error("invalid");
          // The entire batch is validated first. Successful rows stay saved on a partial network failure.
          let completed = 0;
          try {
            for (const [index, identifier] of ids.entries()) {
              const binding = {
                project: "bnt" as const,
                identifier,
                worker: input.worker.trim(),
                pool: "bntpool" as const,
              };
              if (input.target)
                await fleet.mutate({ action: "link", payload: { id: input.target, binding } });
              else
                await fleet.mutate({
                  action: "create",
                  payload: {
                    name: (input.name.trim()
                      ? `${input.name.trim()}${ids.length > 1 ? ` ${index + 1}` : ""}`
                      : `BNT ${identifier.slice(0, 6)}…${identifier.slice(-4)}`
                    ).slice(0, 40),
                    hardware: "",
                    binding,
                  },
                });
              completed++;
            }
          } catch {
            throw new Error(`remaining:${ids.slice(completed).join("\n")}`);
          }
          setLookupAddress("");
        })
      }
      onRemove={(r) =>
        mutation(async () => {
          if (!r.deviceId) return;
          await fleet.mutate({ action: "unlink", payload: { id: r.deviceId, bindingId: r.id } });
        })
      }
      onRename={(r, name) =>
        mutation(async () => {
          const d = fleet.devices.find((d) => d.id === r.deviceId);
          if (d)
            await fleet.mutate({
              action: "rename",
              payload: { id: d.id, name, hardware: d.hardware },
            });
        })
      }
    />
  );
}

export function BntDashboardView(p: Props) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  const t = (key: keyof typeof copy) => copy[key][locale];
  const value = (n: number | null | undefined) =>
    n == null ? "—" : n.toLocaleString(locale, { maximumFractionDigits: 8 });
  const clock = (n: number | null | undefined) =>
    n
      ? new Intl.DateTimeFormat(locale, {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Hong_Kong",
          hour12: false,
        }).format(n) + " UTC+8"
      : "—";
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [layout, setLayout] = useState("cards"),
    [sort, setSort] = useState("added");
  const [form, setForm] = useState<Add | null>(null),
    [rename, setRename] = useState<BntRow | null>(null),
    [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null),
    [notice, setNotice] = useState("");
  const [lookup, setLookup] = useState("");
  useEffect(() => {
    if (!p.signedIn || !p.ready || p.preview) return;
    try {
      const raw = sessionStorage.getItem("watch-bnt-add-draft");
      if (!raw) return;
      sessionStorage.removeItem("watch-bnt-add-draft");
      const draft = JSON.parse(raw) as { address?: unknown; at?: unknown };
      if (
        typeof draft.address === "string" &&
        validPoolAddress("bnt", draft.address) &&
        typeof draft.at === "number" &&
        Date.now() - draft.at >= 0 &&
        Date.now() - draft.at < 600000
      )
        setForm({ raw: draft.address, name: "", worker: "", target: "" });
    } catch {
      /* A missing draft must never interfere with monitoring. */
    }
  }, [p.signedIn, p.ready, p.preview]);
  const transient =
    p.lookup && !p.rows.some((r) => r.address === p.lookup?.address && !r.worker)
      ? p.lookup
      : undefined;
  const totals = bntTotals(p.rows.length ? p.rows : transient ? [transient] : []);
  const stateLabel = (r: BntRow) => {
    const s = bntRowState(r);
    return s === "mining" || s === "waiting" || s === "stale"
      ? t(s)
      : s === "notFound"
        ? t("notFound")
        : s === "loading"
          ? c.loading
          : c.unavailable;
  };
  const rate = (r: BntRow) =>
    r.worker
      ? (r.result?.data?.workers.find((w) => w.name === r.worker)?.hashrate ?? null)
      : (r.result?.data?.hashrate ?? null);
  const displayed = p.rows
    .filter(
      (r) =>
        (!search.trim() ||
          `${r.name} ${r.address} ${r.worker} ${r.result?.data?.workers.map((w) => w.name).join(" ") ?? ""}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())) &&
        (filter === "all" ||
          (filter === "attention"
            ? !["mining", "waiting", "loading"].includes(bntRowState(r))
            : bntRowState(r) === filter)),
    )
    .sort((a, b) => (sort === "rate" ? (rate(b) ?? -1) - (rate(a) ?? -1) : 0));
  const openAdd = (address = "") => {
    setError(null);
    setNotice("");
    setForm({ raw: address, name: "", worker: "", target: "" });
  };
  async function act(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch {
      setError(c.unavailable);
    } finally {
      setBusy(false);
    }
  }
  const metrics = [
    {
      label: t("rate"),
      metric: totals.hashrate,
      formatted: poolHashrate("bnt", totals.hashrate.value),
      main: true,
    },
    {
      label: t("paid"),
      metric: totals.paid,
      formatted: `${value(totals.paid.value)} BNT`,
      main: true,
    },
    {
      label: bntLabels.confirmed[locale],
      metric: totals.balance,
      formatted: `${value(totals.balance.value)} BNT`,
      main: false,
    },
  ];
  const card = (r: BntRow, temporary = false) => (
    <article className="bnt-device-card" key={r.id}>
      <div className="bnt-card-head">
        <div className="bnt-device-icon">
          <Cpu size={20} />
        </div>
        <span className="bnt-state" data-state={bntRowState(r)}>
          {stateLabel(r)}
        </span>
      </div>
      <h3>{r.name}</h3>
      <code className="bnt-address" title={r.address}>
        {r.address.slice(0, 10)}…{r.address.slice(-8)}
        {r.worker ? ` · ${r.worker}` : ""}
      </code>
      <div className="bnt-card-rate">
        <span>{poolCopy.rate[locale]}</span>
        <strong>{poolHashrate("bnt", rate(r))}</strong>
      </div>
      <dl className="bnt-card-balances">
        <div>
          <dt>{bntLabels.confirmed[locale]}</dt>
          <dd>
            {value(r.result?.data?.balance)} <small>BNT</small>
          </dd>
        </div>
        <div>
          <dt>{t("paid")}</dt>
          <dd>
            {value(r.result?.data?.paid)} <small>BNT</small>
          </dd>
        </div>
      </dl>
      <details className="bnt-worker-details">
        <summary>
          Workers ·{" "}
          {r.worker
            ? (r.result?.data?.workers.filter((w) => w.name === r.worker).length ?? "—")
            : (r.result?.data?.workerCount ?? "—")}
        </summary>
        <div className="bnt-worker-rows">
          {!r.result?.data?.workers.length && <p>{t("noWorkers")}</p>}
          {r.result?.data?.workers
            .filter((w) => !r.worker || w.name === r.worker)
            .slice(0, 100)
            .map((w, i) => (
              <div key={`${w.name}:${i}`}>
                <b>{w.name || "—"}</b>
                <span
                  className="bnt-state"
                  data-state={
                    r.result?.stale
                      ? "stale"
                      : w.online === true
                        ? "mining"
                        : w.online === false
                          ? "waiting"
                          : "unavailable"
                  }
                >
                  {w.online === true
                    ? t("shareRecent")
                    : w.online === false
                      ? t("shareOld")
                      : t("never")}
                </span>
                <strong>{poolHashrate("bnt", w.hashrate)}</strong>
                <small>
                  {t("lastShare")} · {clock(w.lastSeen)}
                </small>
              </div>
            ))}
        </div>
        {(r.result?.data?.workers.length ?? 0) > 100 && (
          <p className="compute-caption">{poolCopy.workerLimit[locale]}</p>
        )}
      </details>
      <details className="bnt-payment-details">
        <summary>{t("payments")}</summary>
        <dl className="bnt-card-balances">
          <div>
            <dt>{bntLabels.estimated[locale]}</dt>
            <dd>
              {value(r.result?.data?.pendingEstimate)} <small>BNT</small>
            </dd>
          </div>
          <div>
            <dt>{bntLabels.queued[locale]}</dt>
            <dd>
              {value(r.result?.data?.queued)} <small>BNT</small>
            </dd>
          </div>
        </dl>
      </details>
      {bntRowState(r) === "notFound" && (
        <p className="bnt-card-hint">{poolCopy.notFound[locale]}</p>
      )}
      <p className="bnt-card-clock">
        {r.loading ? c.loading : clock(r.result?.fetchedAt)}
        {r.result?.stale ? ` · ${t("stale")}` : ""}
      </p>
      <div className="bnt-card-actions">
        {temporary ? (
          <button onClick={() => openAdd(r.address)}>{t("save")}</button>
        ) : (
          <>
            <button
              disabled={busy}
              onClick={() => {
                setRename(r);
                setNewName(r.name);
              }}
            >
              {t("rename")}
            </button>
            <button
              disabled={busy}
              onClick={() => {
                if (window.confirm(`${poolCopy.remove[locale]} ${r.name}?`))
                  void act(() => p.onRemove(r));
              }}
            >
              {poolCopy.remove[locale]}
            </button>
          </>
        )}
        <a href={poolAccountUrl("bnt", r.address)} target="_blank" rel="noreferrer">
          {t("source")} ↗
        </a>
      </div>
    </article>
  );
  return (
    <main id="main" className="projects-page bnt-dashboard">
      <header className="bnt-page-header">
        <div>
          <p className="bnt-eyebrow">BLOCKNET · bntpool.com</p>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>
        <div className="bnt-header-actions">
          <button
            className="bnt-refresh"
            disabled={p.refreshing || !p.ready}
            onClick={() =>
              void act(async () => {
                await p.onRefresh();
              })
            }
          >
            <RefreshCw size={15} />
            {p.refreshing ? c.loading : t("refresh")}
          </button>
          <button className="site-button" disabled={!p.ready} onClick={() => openAdd()}>
            <Plus size={16} />
            {t("add")}
          </button>
        </div>
      </header>
      {p.preview && <p className="bnt-preview-note">{t("demo")}</p>}
      {(error || p.error) && <p role="alert">{error || c.unavailable}</p>}
      {notice && <p role="status">{notice}</p>}
      {(p.rows.length > 0 || transient) && (
        <>
          <section className="bnt-summary" aria-label={t("title")}>
            {metrics.map((m, i) => (
              <div className={`bnt-summary-tile${i === 0 ? " primary" : ""}`} key={m.label}>
                <span>{m.label}</span>
                <strong>{m.formatted}</strong>
                <small>
                  {m.metric.known} / {m.metric.total} {t("coverage")}
                  {i === 0 ? ` · ${totals.workers} ${t("activeWorkers")}` : ""}
                </small>
              </div>
            ))}
          </section>
          <div className="bnt-summary-notes">
            <p>
              {t("scope")}
              {totals.stale ? ` ${t("stale")}` : ""}
            </p>
            <details>
              <summary>{t("payments")}</summary>
              <p>
                {bntLabels.estimated[locale]} · {value(totals.pending.value)} BNT{" "}
                <small>
                  ({totals.pending.known}/{totals.pending.total})
                </small>
              </p>
              <p>
                {bntLabels.queued[locale]} · {value(totals.queued.value)} BNT{" "}
                <small>
                  ({totals.queued.known}/{totals.queued.total})
                </small>
              </p>
              <p>{t("paymentHint")}</p>
            </details>
          </div>
        </>
      )}
      <details className="bnt-quick-lookup" open={!p.signedIn && !transient ? true : undefined}>
        <summary>{t("lookup")}</summary>
        <form
          className="pool-lookup"
          onSubmit={(e) => {
            e.preventDefault();
            if (!validPoolAddress("bnt", lookup.trim())) {
              setError(t("invalid"));
              return;
            }
            setError(null);
            p.onLookup(lookup.trim());
          }}
        >
          <label>
            {bntLabels.address[locale]}
            <input
              value={lookup}
              maxLength={120}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setLookup(e.target.value)}
            />
          </label>
          <button className="site-button">{poolCopy.query[locale]}</button>
        </form>
      </details>
      {transient && (
        <section className="bnt-transient">
          <h2>{t("unsaved")}</h2>
          {card(transient, true)}
        </section>
      )}
      <section className="bnt-devices" aria-label={t("devices")}>
        <div className="bnt-section-heading">
          <h2>
            {t("devices")} <small>{p.rows.length}</small>
          </h2>
          <a href={`/${locale}/devices?project=bnt`}>{c.title} ↗</a>
        </div>
        {!p.ready ? (
          <p role="status">{c.loading}</p>
        ) : !p.rows.length ? (
          <div className="bnt-empty">
            <Cpu size={30} />
            <h3>{t("empty")}</h3>
            <p>{t("emptyHint")}</p>
            <button className="site-button" onClick={() => openAdd()}>
              {t("add")}
            </button>
            <a href={`/${locale}/learn/blocknet-bnt-monitor-guide`}>{t("help")} ↗</a>
          </div>
        ) : (
          <>
            <div className="bnt-filter-tabs" aria-label={t("devices")}>
              {(["all", "mining", "waiting", "attention"] as const).map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  data-state={f}
                >
                  {t(f)}{" "}
                  <small>
                    {
                      p.rows.filter(
                        (r) =>
                          f === "all" ||
                          (f === "attention"
                            ? !["mining", "waiting", "loading"].includes(bntRowState(r))
                            : bntRowState(r) === f),
                      ).length
                    }
                  </small>
                </button>
              ))}
            </div>
            <div className="bnt-toolbar">
              <label className="bnt-search">
                <Search size={16} />
                <input
                  aria-label={t("search")}
                  placeholder={t("search")}
                  value={search}
                  maxLength={120}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <select aria-label={t("sort")} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="added">{t("added")}</option>
                <option value="rate">{t("rateSort")}</option>
              </select>
              <div className="bnt-layout">
                {["cards", "list"].map((l) => (
                  <button key={l} aria-pressed={layout === l} onClick={() => setLayout(l)}>
                    {t(l as "cards" | "list")}
                  </button>
                ))}
              </div>
            </div>
            {!displayed.length ? (
              <div className="bnt-empty">
                <p>{t("noResults")}</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                >
                  {t("clear")}
                </button>
              </div>
            ) : (
              <div className="bnt-device-grid" data-layout={layout}>
                {displayed.map((r) => card(r))}
              </div>
            )}
          </>
        )}
      </section>
      <p className="bnt-footnote">
        {t("online")} · {t("paymentHint")}
      </p>
      <ProjectAbout project="bnt" />
      <Dialog
        open={!!form}
        onOpenChange={(open) => {
          if (!open && !busy) setForm(null);
        }}
      >
        <DialogContent className="bnt-add-dialog">
          <DialogTitle>{t("add")}</DialogTitle>
          <DialogDescription>{t("sync")}</DialogDescription>
          {form && (
            <form
              className="bnt-add-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (busy) return;
                setBusy(true);
                setError(null);
                void p
                  .onSave(form)
                  .then(() => {
                    setForm(null);
                    setNotice(t("saved"));
                  })
                  .catch((e: unknown) => {
                    const message = e instanceof Error ? e.message : "";
                    if (message.startsWith("remaining:"))
                      setForm({ ...form, raw: message.slice(10) });
                    setError(
                      message.startsWith("remaining:")
                        ? c.unavailable
                        : message === "quota"
                          ? c.limit
                          : t("invalid"),
                    );
                  })
                  .finally(() => setBusy(false));
              }}
            >
              {p.signedIn ? (
                <>
                  <label>
                    {t("addresses")}
                    <textarea
                      autoFocus
                      rows={3}
                      maxLength={6000}
                      value={form.raw}
                      autoComplete="off"
                      spellCheck={false}
                      disabled={busy}
                      onChange={(e) => setForm({ ...form, raw: e.target.value })}
                    />
                  </label>
                  {!form.target && (
                    <label>
                      {t("name")}
                      <input
                        maxLength={40}
                        value={form.name}
                        disabled={busy}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </label>
                  )}
                  <details className="bnt-add-advanced">
                    <summary>{t("advanced")}</summary>
                    <label>
                      {t("target")}
                      <select
                        value={form.target}
                        disabled={busy}
                        onChange={(e) => setForm({ ...form, target: e.target.value })}
                      >
                        <option value="">{t("newDevice")}</option>
                        {p.targets.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t("worker")}
                      <input
                        maxLength={80}
                        value={form.worker}
                        disabled={busy}
                        onChange={(e) => setForm({ ...form, worker: e.target.value })}
                      />
                    </label>
                  </details>
                  <p className="compute-caption">
                    {p.rows.length} / {p.limit} ·{" "}
                    <a href={`/${locale}/devices?view=membership`}>Pro</a>
                  </p>
                  {error && <p role="alert">{error}</p>}
                  <button className="site-button" disabled={busy || !form.raw.trim()}>
                    {busy ? c.loading : t("save")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="site-button"
                  disabled={!p.ready || busy}
                  onClick={() =>
                    void act(async () => {
                      try {
                        if (validPoolAddress("bnt", form.raw.trim()))
                          sessionStorage.setItem(
                            "watch-bnt-add-draft",
                            JSON.stringify({ address: form.raw.trim(), at: Date.now() }),
                          );
                      } catch {
                        /* Optional tab-local draft; no automatic account mutation. */
                      }
                      await p.onLogin();
                    })
                  }
                >
                  {c.signIn}
                </button>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!rename}
        onOpenChange={(open) => {
          if (!open && !busy) setRename(null);
        }}
      >
        <DialogContent className="bnt-add-dialog">
          <DialogTitle>{t("rename")}</DialogTitle>
          <DialogDescription>{rename?.name}</DialogDescription>
          <form
            className="bnt-add-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (rename && newName.trim())
                void act(async () => {
                  await p.onRename(rename, newName.trim());
                  setRename(null);
                });
            }}
          >
            <label>
              {t("name")}
              <input maxLength={40} value={newName} onChange={(e) => setNewName(e.target.value)} />
            </label>
            {error && <p role="alert">{error}</p>}
            <button className="site-button" disabled={busy || !newName.trim()}>
              {t("save")}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
