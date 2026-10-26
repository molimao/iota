import { PoolWorkerPreview } from "./pool-worker-preview";
import { DeviceMinerSummary } from "./device-miner-summary";
import { ProjectAgentConnect } from "./project-agent-connect";
import type { ReactNode } from "react";
import { ProjectReadingMetrics } from "./project-reading-metrics";
import { FlyaiWalletStats } from "./flyai-wallet-stats";
import { AcurastProcessors } from "./acurast-processors";
import { shortId } from "@/lib/ss58";
import { AcurastRewards, acuCopy } from "./acurast-rewards";
/// <reference types="vite/client" />
import "./project-address-book.css";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { useFleetReadings } from "@/hooks/use-fleet-readings";
import { FLEET_NAMES, type FleetProject } from "@/lib/fleet";
import type { FleetMutation } from "@/lib/fleet-policy";
import { projectAddressInput } from "@/lib/project-address-input";
import { isPoolProject, poolName, poolProvider, type PoolProvider } from "@/lib/pool-projects";
import type { SiteLocale } from "@/lib/site";
import { additionalMetricCopy } from "./additional-platform-copy";
import { fleetCopy } from "./fleet-copy";
import type { ProjectReading } from "./fleet-review-data";
import { poolCopy } from "./pool-copy";
import { prlPoolCopy } from "./prl-pool-copy";
import { addressBookCopy } from "./project-address-book-copy";
import { useLocale } from "./site/locale";

const ADDRESS_STATUSES = [
  "online",
  "mining",
  "training",
  "computing",
  "participating",
  "waiting",
  "idle",
  "offline",
  "notFound",
  "refreshFailed",
  "staleData",
  "wallet",
  "loading",
  "notReported",
  "unavailable",
] as const satisfies readonly ProjectReading["status"][];

export type AddressBookEntry = {
  poolWorkers?: ProjectReading["poolWorkers"];
  lifetime?: string | null;
  totalLabel?: string;
  scope?: ProjectReading["scope"];
  todayUsd?: string;
  flyai?: ProjectReading["flyai"];
  acurastQuote?: ProjectReading["acurastQuote"];
  acurastBalances?: ProjectReading["acurastBalances"];
  acurast?: ProjectReading["acurast"];
  acurastRewards?: ProjectReading["acurastRewards"];
  deviceId: string;
  deviceName: string;
  bindingId: string;
  identifier: string;
  status: ProjectReading["status"];
  activity: string;
  source: string;
  updated: string;
  today: string | null;
  unit: string;
  note?: string | undefined;
  todayLabel?: string;
  accountSummary?: { kind: "month" | "balance"; amount: string; unit: string };
};

export function addressStatusTone(status: string): "active" | "waiting" | "attention" | "unknown" {
  switch (status) {
    case "online":
    case "computing":
    case "participating":
    case "training":
    case "mining":
      return "active";
    case "waiting":
      return "waiting";
    case "offline":
    case "idle":
    case "notFound":
    case "refreshFailed":
    case "staleData":
      return "attention";
    default:
      return "unknown";
  }
}

export function countAddressStatuses(cards: readonly { status: string }[]) {
  const counts: Record<string, number> = {};
  for (const card of cards) counts[card.status] = (counts[card.status] ?? 0) + 1;
  return counts;
}

export function filterAddressCards<
  T extends { deviceName: string; identifier: string; status: string },
>(cards: readonly T[], query: string, status: string): T[] {
  const needle = query.trim().toLowerCase();
  return cards.filter((card) => {
    if (status !== "all" && card.status !== status) return false;
    if (!needle) return true;
    return (
      card.deviceName.toLowerCase().includes(needle) ||
      card.identifier.toLowerCase().includes(needle)
    );
  });
}

export function unlinkBinding(deviceId: string, bindingId: string): FleetMutation {
  return { action: "unlink", payload: { id: deviceId, bindingId } };
}

export function renameDevice(deviceId: string, name: string, hardware: string): FleetMutation {
  return { action: "rename", payload: { id: deviceId, name: name.trim(), hardware } };
}

function toEntry(
  device: { id: string; name: string },
  binding: { id: string; identifier: string },
  reading: ProjectReading,
): AddressBookEntry {
  return {
    deviceId: device.id,
    deviceName: device.name,
    bindingId: binding.id,
    identifier: binding.identifier,
    status: reading.status,
    activity: reading.activity,
    ...(reading.poolWorkers ? { poolWorkers: reading.poolWorkers } : {}),
    source: reading.source,
    updated: reading.updated,
    lifetime: reading.lifetime,
    ...(reading.totalLabel ? { totalLabel: reading.totalLabel } : {}),
    scope: reading.scope,
    ...(reading.todayUsd ? { todayUsd: reading.todayUsd } : {}),
    today: reading.today,
    unit: reading.unit,
    ...(reading.note ? { note: reading.note } : {}),
    ...(reading.todayLabel ? { todayLabel: reading.todayLabel } : {}),
    ...(reading.flyai ? { flyai: reading.flyai } : {}),
    ...(reading.acurastQuote ? { acurastQuote: reading.acurastQuote } : {}),
    ...(reading.acurastBalances ? { acurastBalances: reading.acurastBalances } : {}),
    ...(reading.acurast ? { acurast: reading.acurast } : {}),
    ...(reading.acurastRewards ? { acurastRewards: reading.acurastRewards } : {}),
    ...(reading.accountSummary ? { accountSummary: reading.accountSummary } : {}),
  };
}

export function ProjectAddressBookView({
  project,
  locale,
  savedCount,
  pool,
  limit,
  cards,
  signedIn = true,
  authReady = true,
  signingIn = false,
  fleetReady = true,
  fleetError = false,
  busy = false,
  renaming = false,
  error = null,
  renameError = null,
  raw = "",
  selected = "",
  query = "",
  statusFilter = "all",
  editingId = null,
  draft = "",
  showDetail = false,
  onSignIn = () => {},
  onRaw = () => {},
  onAdd = () => {},
  onQuery = () => {},
  onStatus = () => {},
  onClear = () => {},
  onOpen = () => {},
  onRemove = () => {},
  onStartRename = () => {},
  onDraft = () => {},
  onSaveRename = () => {},
  onCancelRename = () => {},
  localMetrics,
}: {
  project: FleetProject;
  locale: SiteLocale;
  savedCount: number;
  pool?: PoolProvider | undefined;
  limit: number;
  cards: readonly AddressBookEntry[];
  signedIn?: boolean;
  authReady?: boolean;
  signingIn?: boolean;
  fleetReady?: boolean;
  fleetError?: boolean;
  busy?: boolean;
  renaming?: boolean;
  error?: string | null;
  renameError?: string | null;
  raw?: string;
  selected?: string;
  query?: string;
  statusFilter?: string;
  editingId?: string | null;
  draft?: string;
  showDetail?: boolean;
  onSignIn?: () => void;
  onRaw?: (value: string) => void;
  onAdd?: () => void;
  onQuery?: (value: string) => void;
  onStatus?: (status: string) => void;
  onClear?: () => void;
  onOpen?: (identifier: string) => void;
  onRemove?: (deviceId: string, bindingId: string) => void;
  onStartRename?: (deviceId: string, name: string) => void;
  onDraft?: (value: string) => void;
  onSaveRename?: (deviceId: string) => void;
  onCancelRename?: () => void;
  localMetrics?: ((entry: AddressBookEntry) => ReactNode) | undefined;
}) {
  const text = addressBookCopy;
  const labels = fleetCopy(locale);
  const visible = filterAddressCards(cards, query, statusFilter);
  const counts = countAddressStatuses(cards);
  const statuses = ADDRESS_STATUSES.filter(
    (status) => (counts[status] ?? 0) > 0 || status === statusFilter,
  );
  const walletLayout = project !== "iota";
  const locked = busy || renaming;
  const addForm = (
    <>
      <form
        className="project-address-add"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd();
        }}
      >
        <label>
          {text.input[locale]}
          <textarea
            maxLength={6000}
            value={raw}
            disabled={locked || !fleetReady}
            onChange={(event) => onRaw(event.target.value)}
            rows={2}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <button className="site-button" disabled={locked || !fleetReady || !raw.trim()}>
          {busy ? labels.loading : text.add[locale]}
        </button>
      </form>
      {(project === "prl" || project === "tsc") && (
        <p className="compute-caption">
          {prlPoolCopy.selected[locale]} ·{" "}
          {poolName(project as import("@/lib/pool-projects").PoolProject, pool)}
        </p>
      )}
      <p className="compute-caption">
        {text.sync[locale]} · {savedCount} / {limit}
      </p>
      {fleetReady && limit === 5 && savedCount >= 4 && (
        <p className="pab-upgrade">
          {text.upgrade[locale]}{" "}
          <a href={`/${locale}/devices?view=membership`}>{text.upgradeLink[locale]} →</a>
        </p>
      )}
    </>
  );
  return (
    <section
      className="project-address-book"
      data-project={project}
      aria-label={walletLayout ? acuCopy.addresses[locale] : text.title[locale]}
      data-selected={selected}
      data-quota={savedCount}
    >
      <div className="project-section-head">
        <h2>
          {walletLayout ? acuCopy.addresses[locale] : text.title[locale]}{" "}
          <small>{savedCount}</small>
        </h2>
        <a href={`/${locale}/devices?project=${project}`}>{labels.title} →</a>
      </div>
      {!signedIn ? (
        <button
          type="button"
          className="site-button"
          disabled={!authReady || signingIn}
          onClick={onSignIn}
        >
          {text.login[locale]}
        </button>
      ) : walletLayout ? (
        <details className="pab-add-drawer" open={cards.length === 0}>
          <summary>{acuCopy.addAddress[locale]}</summary>
          {addForm}
        </details>
      ) : (
        addForm
      )}
      {(error || fleetError) && <p role="alert">{error ?? labels.unavailable}</p>}
      {signedIn && !fleetReady && !fleetError && <p role="status">{labels.loading}</p>}
      {cards.length > (walletLayout ? 1 : 0) && (
        <div className="pab-tools">
          <label className="pab-search">
            {text.search[locale]}
            <input
              type="search"
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <div className="pab-filters" role="group" aria-label={text.search[locale]}>
            <button
              type="button"
              data-status="all"
              data-count={cards.length}
              aria-pressed={statusFilter === "all"}
              onClick={() => onStatus("all")}
            >
              {text.all[locale]} <b>{cards.length}</b>
            </button>
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                data-status={status}
                data-count={counts[status] ?? 0}
                data-tone={addressStatusTone(status)}
                aria-pressed={statusFilter === status}
                onClick={() => onStatus(status)}
              >
                {labels[status]} <b>{counts[status] ?? 0}</b>
              </button>
            ))}
          </div>
        </div>
      )}
      {cards.length > 0 && visible.length === 0 && (
        <div className="pab-empty">
          <p>{text.empty[locale]}</p>
          <button type="button" className="pab-clear" onClick={onClear}>
            {text.clear[locale]}
          </button>
        </div>
      )}
      <div className="project-address-grid">
        {visible.map((entry) => {
          const tone = addressStatusTone(entry.status);
          const editing = editingId === entry.deviceId;
          return (
            <article
              className="project-address-card"
              key={entry.bindingId}
              data-binding={entry.bindingId}
              data-project={project}
            >
              <div className="project-address-heading">
                <h3 className="pab-name">{entry.deviceName}</h3>
                <span className="pab-state" data-state={entry.status} data-tone={tone}>
                  {labels[entry.status]}
                </span>
              </div>
              {editing ? (
                <form
                  className="pab-rename"
                  onSubmit={(event) => {
                    event.preventDefault();
                    onSaveRename(entry.deviceId);
                  }}
                >
                  <label>
                    {text.name[locale]}
                    <input
                      value={draft}
                      maxLength={40}
                      disabled={locked}
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(event) => onDraft(event.target.value)}
                    />
                  </label>
                  <p className="pab-note">{text.renameNote[locale]}</p>
                  <button type="submit" disabled={locked || !draft.trim()}>
                    {renaming ? text.saving[locale] : text.save[locale]}
                  </button>
                  <button type="button" disabled={locked} onClick={onCancelRename}>
                    {labels.cancel}
                  </button>
                  {renaming && <p role="status">{text.saving[locale]}</p>}
                  {renameError && <p role="alert">{renameError}</p>}
                </form>
              ) : null}
              <code className="pab-id platform-public-id" title={entry.identifier}>
                {walletLayout ? shortId(entry.identifier) : entry.identifier}
              </code>
              {project !== "acurast" && project !== "flyai" && (
                <div className="pab-reading-body" data-workers={!!entry.poolWorkers}>
                  <ProjectReadingMetrics
                    project={project}
                    data={{ ...entry, lifetime: entry.lifetime ?? null }}
                  />
                  {isPoolProject(project) && entry.poolWorkers && (
                    <PoolWorkerPreview project={project} data={entry.poolWorkers} locale={locale} />
                  )}
                </div>
              )}
              {project === "flyai" && entry.flyai && (
                <FlyaiWalletStats data={entry.flyai} stale={entry.status !== "wallet"} />
              )}
              {project === "acurast" && (
                <AcurastRewards
                  rewards={entry.acurastRewards}
                  balances={entry.acurastBalances}
                  quote={entry.acurastQuote}
                  stale={["staleData", "refreshFailed", "unavailable"].includes(entry.status)}
                />
              )}
              {project === "acurast" && entry.acurast && <AcurastProcessors data={entry.acurast} />}
              {walletLayout ? (
                <details className="pab-source">
                  <summary>
                    {entry.source} · {entry.updated}
                  </summary>
                  <code>{entry.identifier}</code>
                  {entry.note && <p>{entry.note}</p>}
                </details>
              ) : (
                <p className="compute-caption">
                  {entry.source} · {entry.updated}
                </p>
              )}
              {!walletLayout && entry.note && <p className="compute-caption">{entry.note}</p>}
              {localMetrics?.(entry)}
              <div className="pab-actions pool-card-actions">
                {showDetail && (
                  <button
                    type="button"
                    className="site-button"
                    aria-pressed={selected === entry.identifier}
                    onClick={() => onOpen(entry.identifier)}
                  >
                    {text.detail[locale]}
                  </button>
                )}
                <details className="pab-manage">
                  <summary>{text.manage[locale]} ···</summary>
                  <div>
                    {!editing && (
                      <button
                        type="button"
                        className="pab-rename-start"
                        disabled={locked}
                        onClick={() => onStartRename(entry.deviceId, entry.deviceName)}
                      >
                        {text.rename[locale]}
                      </button>
                    )}
                    <button
                      type="button"
                      title={project !== "acurast" ? text.removeConfirm[locale] : undefined}
                      data-action="unlink"
                      disabled={locked}
                      onClick={() => onRemove(entry.deviceId, entry.bindingId)}
                    >
                      {text.remove[locale]}
                    </button>
                  </div>
                </details>
              </div>
            </article>
          );
        })}
      </div>
      {!walletLayout && cards.length > 0 && (
        <p className="pab-note">{text.removeConfirm[locale]}</p>
      )}
    </section>
  );
}

export function ProjectAddressBook({
  project,
  pool,
  onSelect,
  autoSelect = true,
}: {
  project: FleetProject;
  pool?: PoolProvider | undefined;
  autoSelect?: boolean;
  onSelect?: (id: string) => void;
}) {
  const auth = useAuth(),
    fleet = useFleet(auth.userId, auth.ready),
    { locale } = useLocale(),
    labels = fleetCopy(locale),
    text = addressBookCopy;
  const projectDevices = (auth.userId ? fleet.devices : [])
    .map((device) => ({
      ...device,
      bindings: device.bindings.filter((binding) => binding.project === project),
    }))
    .filter((device) => device.bindings.length);
  const devices =
    project === "prl" || project === "tsc"
      ? projectDevices
          .map((device) => ({
            ...device,
            bindings: device.bindings.filter(
              (binding) =>
                (binding.pool ??
                  poolProvider(project as import("@/lib/pool-projects").PoolProject)) ===
                (pool ?? poolProvider(project as import("@/lib/pool-projects").PoolProject)),
            ),
          }))
          .filter((device) => device.bindings.length)
      : projectDevices;
  const read = useFleetReadings(devices, fleet.ready);
  const [raw, setRaw] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);
  useEffect(() => {
    if (!autoSelect) return;
    const next =
      devices
        .flatMap((device) => device.bindings)
        .find((binding) => binding.identifier === selected) ?? devices[0]?.bindings[0];
    if (fleet.ready && next && next.identifier !== selected) {
      setSelected(next.identifier);
      onSelect?.(next.identifier);
    }
    if (fleet.ready && !next && selected) {
      setSelected("");
      onSelect?.("");
    }
  }, [devices, fleet.ready, selected, onSelect, autoSelect]);
  const saving = useRef(false);
  const entries = devices.flatMap((device) =>
    device.bindings.map((binding) => toEntry(device, binding, read(binding))),
  );
  async function add() {
    if (!auth.userId || !fleet.ready || saving.current) return;
    let ids: string[];
    try {
      ids = projectAddressInput(
        project,
        raw,
        devices.flatMap((device) => device.bindings.map((binding) => binding.identifier)),
        fleet.limit - projectDevices.length,
      );
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message === "quota" ? labels.limit : text.batch[locale],
      );
      return;
    }
    saving.current = true;
    setBusy(true);
    setError(null);
    let done = 0;
    try {
      for (const identifier of ids) {
        await fleet.mutate({
          action: "create",
          payload: {
            name: `${FLEET_NAMES[project]} ${identifier.slice(0, 6)}…${identifier.slice(-4)}`,
            hardware: "",
            binding: {
              project,
              identifier,
              worker: "",
              ...(isPoolProject(project) ? { pool: pool ?? poolProvider(project) } : {}),
            },
          },
        });
        done++;
        setRaw(ids.slice(done).join("\n"));
      }
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message === "project_device_limit_reached"
          ? labels.limit
          : caught instanceof Error && caught.message === "duplicate_binding"
            ? labels.duplicate
            : labels.unavailable,
      );
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  async function removeBinding(deviceId: string, bindingId: string) {
    const name = entries.find((entry) => entry.bindingId === bindingId)?.deviceName ?? "";
    const message = name ? `${text.removeConfirm[locale]}\n${name}` : text.removeConfirm[locale];
    if (!window.confirm(message)) return;
    setBusy(true);
    setError(null);
    try {
      await fleet.mutate(unlinkBinding(deviceId, bindingId));
    } catch {
      setError(labels.unavailable);
    } finally {
      setBusy(false);
    }
  }
  async function saveRename(deviceId: string) {
    const device = devices.find((item) => item.id === deviceId);
    const name = draft.trim();
    if (!device || !name || renaming || busy) return;
    setRenaming(true);
    setRenameError(null);
    try {
      await fleet.mutate(renameDevice(device.id, name, device.hardware));
      setEditingId(null);
    } catch {
      setRenameError(text.saveError[locale]);
    } finally {
      setRenaming(false);
    }
  }
  return (
    <ProjectAddressBookView
      project={project}
      locale={locale}
      savedCount={projectDevices.length}
      pool={pool}
      limit={fleet.limit}
      cards={entries}
      localMetrics={(entry) => (
        <>
          <DeviceMinerSummary
            deviceId={entry.deviceId}
            bindings={[{ id: entry.bindingId, project, identifier: entry.identifier, worker: "" }]}
          />
          <ProjectAgentConnect
            deviceId={entry.deviceId}
            bindingId={entry.bindingId}
            project={project}
            devices={fleet.devices}
            onLinked={() => fleet.reload()}
          />
        </>
      )}
      signedIn={Boolean(auth.userId)}
      authReady={auth.ready}
      signingIn={auth.signingIn}
      fleetReady={fleet.ready}
      fleetError={Boolean(fleet.error)}
      busy={busy}
      renaming={renaming}
      error={error}
      renameError={renameError}
      raw={raw}
      selected={selected}
      query={query}
      statusFilter={statusFilter}
      editingId={editingId}
      draft={draft}
      showDetail={onSelect !== undefined}
      onSignIn={() => void auth.signInWithGoogle()}
      onRaw={setRaw}
      onAdd={() => void add()}
      onQuery={setQuery}
      onStatus={setStatusFilter}
      onClear={() => {
        setQuery("");
        setStatusFilter("all");
      }}
      onOpen={(identifier) => {
        setSelected(identifier);
        onSelect?.(identifier);
      }}
      onRemove={(deviceId, bindingId) => void removeBinding(deviceId, bindingId)}
      onStartRename={(deviceId, name) => {
        setEditingId(deviceId);
        setDraft(name);
        setRenameError(null);
      }}
      onDraft={setDraft}
      onSaveRename={(deviceId) => void saveRename(deviceId)}
      onCancelRename={() => {
        setEditingId(null);
        setDraft("");
        setRenameError(null);
      }}
    />
  );
}
