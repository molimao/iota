import { monitorViewCopy } from "./monitor-views";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Cpu,
  Layers,
  Monitor,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useLocale } from "./site/locale";
import { fleetCopy } from "./fleet-copy";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import {
  FLEET_NAMES,
  FLEET_PROJECTS,
  canLinkProject,
  bindingIdentity,
  validBinding,
  projectDeviceCount,
  type FleetBinding,
  type FleetDevice,
  type FleetProject,
} from "@/lib/fleet";
import { PLANS } from "@/lib/plans";
import type { BillingSummary } from "@/lib/plans";
import { FleetMembership } from "./fleet-membership";
import { deviceTodayEarnings } from "@/lib/fleet-earnings";
import { formatUsd } from "@/lib/earnings";
import { PROJECTS, projectPath } from "@/lib/projects";
import { shortId } from "@/lib/ss58";
import type { ProjectReading } from "./fleet-review-data";
import type { FleetMutation } from "@/lib/fleet-policy";
import { PaywallBody } from "./fleet-paywall";
import { annualMonthlyEquivalent, annualSavingPercent, copyValues } from "@/lib/billing-display";

type Copy = ReturnType<typeof fleetCopy>;
export type FleetWorkspaceProps = {
  initialPaywallProject?: FleetProject | undefined;
  initialProject?: FleetProject | undefined;
  initialTab?: "devices" | "plans";
  devices: FleetDevice[];
  plan: "free" | "pro";
  billing?: BillingSummary | undefined;
  preview?: boolean;
  reading: (binding: FleetBinding) => ProjectReading;
  onAdd: (
    name: string,
    hardware: string,
    binding?: { project: FleetProject; identifier: string; worker: string },
  ) => Promise<void>;
  onLink: (
    deviceId: string,
    project: FleetProject,
    identifier: string,
    worker: string,
  ) => Promise<void>;
  onSubscribe?: (interval: "month" | "year") => Promise<void>;
  onManage?: (() => Promise<void>) | undefined;
  onMutation?: ((mutation: FleetMutation) => Promise<void>) | undefined;
  error?: string | null;
};

export function FleetWorkspace(props: FleetWorkspaceProps) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  const [tab, setTab] = useState<"devices" | "plans">(props.initialTab ?? "devices");
  const [project, setProject] = useState<FleetProject | "all">(props.initialProject ?? "all");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<
    "add" | "link" | "billing" | "edit" | "merge" | "remove" | "unlink" | null
  >(props.initialPaywallProject ? "billing" : null);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [name, setName] = useState(""),
    [hardware, setHardware] = useState("");
  const [selectedProject, setSelectedProject] = useState<FleetProject>(
    props.initialProject ?? "iota",
  );
  const [identifier, setIdentifier] = useState(""),
    [worker, setWorker] = useState("");
  const [sourceId, setSourceId] = useState(""),
    [bindingId, setBindingId] = useState("");
  const [interval, setInterval] = useState<"month" | "year">("year");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const [paywallProject, setPaywallProject] = useState<FleetProject | null>(
      props.initialPaywallProject ?? null,
    ),
    [returnToLink, setReturnToLink] = useState(false);
  const limit = PLANS[props.plan].projectDeviceLimit;
  const visible = useMemo(
    () =>
      props.devices.filter((d) => {
        const text =
          `${d.name} ${d.hardware} ${d.bindings.map((b) => FLEET_NAMES[b.project]).join(" ")}`.toLowerCase();
        return (
          (project === "all" || d.bindings.some((b) => b.project === project)) &&
          text.includes(search.trim().toLowerCase())
        );
      }),
    [props.devices, project, search],
  );
  const activeProjects = FLEET_PROJECTS.filter(
    (p) => projectDeviceCount(props.devices, p) > 0,
  ).length;
  function showPaywall(project: FleetProject | null = null, fromLink = false) {
    setError(null);
    setPaywallProject(project);
    setReturnToLink(fromLink);
    setDialog("billing");
  }
  function closeDialog() {
    setError(null);
    setDialog(dialog === "billing" && returnToLink ? "link" : null);
  }
  function open(kind: NonNullable<typeof dialog>, deviceId = "", binding = "") {
    setError(null);
    setName("");
    setHardware("");
    setIdentifier("");
    setWorker("");
    setSelectedDevice(deviceId || props.devices[0]?.id || "");
    setSelectedProject(project === "all" ? "iota" : project);
    setDialog(kind);
    setPaywallProject(null);
    setReturnToLink(false);
    setBindingId(binding);
    setSourceId(props.devices.find((d) => d.id !== deviceId)?.id ?? "");
    if (kind === "edit") {
      const device = props.devices.find((d) => d.id === deviceId);
      setName(device?.name ?? "");
      setHardware(device?.hardware ?? "");
    }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (dialog === "add") {
        if (!validBinding(selectedProject, identifier.trim())) throw new Error(c.invalidId);
        const key = bindingIdentity({
          project: selectedProject,
          identifier: identifier.trim(),
          worker: selectedProject === "xid" ? worker.trim() : "",
        });
        if (props.devices.some((d) => d.bindings.some((b) => bindingIdentity(b) === key)))
          throw new Error(c.duplicate);
        if (projectDeviceCount(props.devices, selectedProject) >= limit) {
          throw new Error(c.limit);
        }
        await props.onAdd(name.trim(), hardware.trim(), {
          project: selectedProject,
          identifier: identifier.trim(),
          worker: selectedProject === "xid" ? worker.trim() : "",
        });
      } else if (dialog === "link") {
        if (!validBinding(selectedProject, identifier.trim())) throw new Error(c.invalidId);
        const key = bindingIdentity({
          project: selectedProject,
          identifier: identifier.trim(),
          worker: selectedProject === "xid" ? worker.trim() : "",
        });
        if (props.devices.some((d) => d.bindings.some((b) => bindingIdentity(b) === key)))
          throw new Error(c.duplicate);
        if (!canLinkProject(props.devices, selectedDevice, selectedProject, limit)) {
          if (props.plan === "free") {
            showPaywall(selectedProject, true);
            return;
          }
          throw new Error(c.limit);
        }
        await props.onLink(selectedDevice, selectedProject, identifier.trim(), worker.trim());
      } else if (dialog === "billing" && props.onSubscribe) await props.onSubscribe(interval);
      else if (props.onMutation) {
        if (dialog === "edit")
          await props.onMutation({
            action: "rename",
            payload: { id: selectedDevice, name: name.trim(), hardware: hardware.trim() },
          });
        if (dialog === "merge")
          await props.onMutation({ action: "merge", payload: { id: selectedDevice, sourceId } });
        if (dialog === "remove")
          await props.onMutation({ action: "remove", payload: { id: selectedDevice } });
        if (dialog === "unlink")
          await props.onMutation({ action: "unlink", payload: { id: selectedDevice, bindingId } });
      }
      setDialog(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : c.unavailable);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="fleet-workspace">
      {props.preview && (
        <div className="fleet-preview-banner">
          <SlidersHorizontal size={14} />
          {c.preview}
        </div>
      )}
      <header className="fleet-heading">
        <div>
          <span className="eyebrow">IOTA WATCH / DEVICES</span>
          <h1>{tab === "plans" && props.plan === "pro" ? c.membership : c.title}</h1>
          <p>
            {tab === "plans" && props.plan === "pro"
              ? c.memberIntro
              : monitorViewCopy(locale).deviceWorkflow}
          </p>
        </div>
        <button className="site-button" onClick={() => open("add")}>
          <Plus size={17} />
          {c.add}
        </button>
      </header>
      <div className="fleet-tabs" role="tablist" aria-label={c.title}>
        <button
          id="fleet-devices-tab"
          role="tab"
          aria-controls="fleet-devices-panel"
          aria-selected={tab === "devices"}
          onClick={() => setTab("devices")}
        >
          <Monitor size={16} />
          {c.devices}
        </button>
        <button
          id="fleet-plans-tab"
          role="tab"
          aria-controls="fleet-plans-panel"
          aria-selected={tab === "plans"}
          onClick={() => setTab("plans")}
        >
          <Layers size={16} />
          {props.plan === "pro" ? c.membership : c.plans}
          {props.plan === "free" && <span>{c.free}</span>}
        </button>
      </div>
      {props.error && (
        <p className="fleet-form-error" role="alert">
          {props.error}
        </p>
      )}
      {props.plan === "pro" && tab === "devices" && (
        <FleetMembership
          compact
          devices={props.devices}
          billing={props.billing}
          onManage={props.onManage}
          onAdd={() => open("add")}
        />
      )}
      {tab === "devices" ? (
        <section id="fleet-devices-panel" role="tabpanel" aria-labelledby="fleet-devices-tab">
          <div className="fleet-overview">
            <div className="fleet-total">
              <Monitor size={23} />
              <div>
                <strong>{props.devices.length}</strong>
                <span>{c.devices}</span>
              </div>
              <small>{c.noFleetLimit}</small>
            </div>
            <div className="fleet-total">
              <Layers size={23} />
              <div>
                <strong>{activeProjects}</strong>
                <span>{c.projects}</span>
              </div>
              <small>{c.perProject}</small>
            </div>
            <div className="fleet-quota-summary">
              <div>
                <b>{c.quotas}</b>
                <button onClick={() => setTab("plans")}>
                  {props.plan === "pro" ? "Pro" : c.free}
                  <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="fleet-quota-grid">
                {FLEET_PROJECTS.map((p) => {
                  const count = projectDeviceCount(props.devices, p);
                  return (
                    <div key={p}>
                      <span>{FLEET_NAMES[p]}</span>
                      <b>
                        {count}
                        <small> / {limit}</small>
                      </b>
                      <div className="fleet-quota-track">
                        <i style={{ width: `${Math.min(100, (count / limit) * 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="fleet-filter-caption">{monitorViewCopy(locale).filter}</p>
          <div className="fleet-toolbar">
            <div className="fleet-filters">
              {["all", ...FLEET_PROJECTS].map((p) => (
                <button
                  key={p}
                  aria-pressed={project === p}
                  onClick={() => setProject(p as FleetProject | "all")}
                >
                  {p === "all"
                    ? monitorViewCopy(locale).allDevices
                    : FLEET_NAMES[p as FleetProject]}
                  {p !== "all" && (
                    <span>{projectDeviceCount(props.devices, p as FleetProject)}</span>
                  )}
                </button>
              ))}
            </div>
            <label className="fleet-search">
              <Search size={16} />
              <input
                aria-label={c.search}
                placeholder={c.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          {project !== "all" && (
            <p className="fleet-filter-hint">
              {monitorViewCopy(locale).filterHint.replace("{project}", FLEET_NAMES[project])}
            </p>
          )}
          <div className="fleet-cards">
            {visible.map((device) => (
              <FleetCard
                key={device.id}
                device={device}
                c={c}
                reading={props.reading}
                onLink={() => open("link", device.id)}
                onEdit={props.onMutation ? () => open("edit", device.id) : undefined}
                onUnlink={
                  props.onMutation ? (binding) => open("unlink", device.id, binding) : undefined
                }
              />
            ))}
          </div>
          {visible.length === 0 && (
            <div className="fleet-empty">
              <Monitor size={30} />
              <p>{props.devices.length ? c.empty : c.emptyGuide}</p>
              <button
                className="site-button"
                onClick={() =>
                  props.devices.length ? (setProject("all"), setSearch("")) : open("add")
                }
              >
                {props.devices.length ? c.clearFilters : c.add}
              </button>
            </div>
          )}
        </section>
      ) : (
        <section
          id="fleet-plans-panel"
          role="tabpanel"
          aria-labelledby="fleet-plans-tab"
          className="fleet-plans"
        >
          {props.plan === "pro" ? (
            <FleetMembership
              devices={props.devices}
              billing={props.billing}
              onManage={props.onManage}
              onAdd={() => open("add")}
            />
          ) : (
            <>
              <div className="fleet-plan-intro">
                <h2>{c.quotas}</h2>
                <p>
                  {c.perProject} · {c.noFleetLimit}
                </p>
              </div>
              <div className="fleet-pricing-grid">
                <article className="fleet-plan-card">
                  <span className="eyebrow">FREE</span>
                  <h3>{c.free}</h3>
                  <div className="fleet-price">$0</div>
                  <p>
                    {c.upTo} <strong>5</strong> {c.devices}
                  </p>
                  <ProjectAllowances devices={props.devices} limit={5} c={c} />
                  <p className="fleet-plan-features">{c.sameFeatures}</p>
                  <button className="fleet-outline" disabled>
                    {props.plan === "free" ? c.current : c.free}
                  </button>
                </article>
                <article className="fleet-plan-card fleet-pro-card">
                  <span className="eyebrow">PRO</span>
                  <h3>Pro</h3>
                  <div className="fleet-billing-switch" role="group" aria-label={c.plans}>
                    <button
                      aria-pressed={interval === "month"}
                      onClick={() => setInterval("month")}
                    >
                      {c.month}
                    </button>
                    <button aria-pressed={interval === "year"} onClick={() => setInterval("year")}>
                      {c.year}
                    </button>
                  </div>
                  <div className="fleet-price">
                    {interval === "month" ? "$2.90" : "$16.90"}
                    <small>{interval === "month" ? c.perMonth : c.perYear}</small>
                  </div>
                  <p className="fleet-plan-saving">
                    {interval === "year"
                      ? copyValues(c.annualSave, { percent: annualSavingPercent }) +
                        " · " +
                        copyValues(c.annualEquivalent, { amount: annualMonthlyEquivalent })
                      : c.monthlyCharge}
                  </p>
                  <p>
                    {c.upTo} <strong>50</strong> {c.devices}
                  </p>
                  <ProjectAllowances devices={props.devices} limit={50} c={c} />
                  <p className="fleet-plan-features">{c.sameFeatures}</p>
                  <button className="site-button" onClick={() => open("billing")}>
                    {c.choosePlan}
                    <ArrowUpRight size={16} />
                  </button>
                </article>
              </div>
              {props.preview && (
                <button className="fleet-preview-wall" onClick={() => showPaywall("iota")}>
                  {c.previewWall} · IOTA
                </button>
              )}
              <p className="fleet-plan-note">{c.renewal}</p>
              <p className="fleet-plan-note">{c.downgrade}</p>
            </>
          )}
        </section>
      )}
      <Dialog
        open={dialog !== null}
        onOpenChange={(value) => {
          if (!value && !busy) closeDialog();
        }}
      >
        <DialogContent
          className={dialog === "billing" ? "fleet-dialog fleet-paywall-dialog" : "fleet-dialog"}
        >
          <DialogTitle>
            {dialog === "add"
              ? c.add
              : dialog === "link"
                ? c.link
                : dialog === "edit"
                  ? c.rename
                  : dialog === "merge"
                    ? c.merge
                    : dialog === "remove"
                      ? c.remove
                      : dialog === "unlink"
                        ? c.unlink
                        : paywallProject && projectDeviceCount(props.devices, paywallProject) >= 5
                          ? copyValues(c.quotaFull, { project: FLEET_NAMES[paywallProject] })
                          : c.expand}
          </DialogTitle>
          <DialogDescription>
            {dialog === "billing"
              ? c.sameMonitoring
              : dialog === "add"
                ? c.addGuide
                : dialog === "merge"
                  ? c.mergeNote
                  : dialog === "remove" || dialog === "unlink"
                    ? c.removeNote
                    : c.mapping}
          </DialogDescription>
          {dialog === "billing" && <span className="fleet-paywall-brand">IOTA WATCH / PRO</span>}
          <form onSubmit={(e) => void save(e)}>
            {dialog === "add" || dialog === "edit" ? (
              <>
                {dialog === "add" && (
                  <>
                    <label>
                      {c.projects}
                      <select
                        value={selectedProject}
                        onChange={(e) => {
                          setSelectedProject(e.target.value as FleetProject);
                          setIdentifier("");
                          setWorker("");
                        }}
                      >
                        {FLEET_PROJECTS.map((p) => (
                          <option key={p} value={p}>
                            {FLEET_NAMES[p]} · {projectDeviceCount(props.devices, p)} / {limit}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {selectedProject === "iota"
                        ? "Miner ID"
                        : selectedProject === "flyai"
                          ? `fly.ai · ${c.rewardAddress}`
                          : selectedProject === "quantus"
                            ? `Wormhole · ${c.rewardAddress}`
                            : `xCoin · ${c.rewardAddress}`}
                      <input
                        autoFocus
                        required
                        autoComplete="off"
                        spellCheck={false}
                        maxLength={100}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={
                          selectedProject === "iota"
                            ? "5…"
                            : selectedProject === "xid"
                              ? "xpa1r…"
                              : selectedProject === "quantus"
                                ? `Wormhole · ${c.rewardAddress}`
                                : "0x…"
                        }
                      />
                    </label>
                    <p className="fleet-input-note">{c.publicOnly}</p>
                    {selectedProject === "xid" && (
                      <label>
                        {c.worker}
                        <input
                          maxLength={80}
                          value={worker}
                          onChange={(e) => setWorker(e.target.value)}
                          autoComplete="off"
                        />
                      </label>
                    )}
                    {projectDeviceCount(props.devices, selectedProject) >= limit && (
                      <div className="fleet-quota-warning">
                        <p>{c.limit}</p>
                        {props.plan === "free" && (
                          <button
                            type="button"
                            className="fleet-outline"
                            onClick={() => showPaywall(selectedProject)}
                          >
                            {c.viewPro}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
                <label>
                  {c.name}
                  <input
                    autoFocus={dialog === "edit"}
                    required
                    maxLength={40}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <details className="fleet-optional-fields" open={dialog === "edit"}>
                  <summary>{c.optionalDetails}</summary>
                  <label>
                    {c.hardware}
                    <input
                      maxLength={100}
                      value={hardware}
                      onChange={(e) => setHardware(e.target.value)}
                      placeholder="Apple M4 Max · 128 GB"
                    />
                  </label>
                </details>
                {dialog === "edit" && (
                  <div className="fleet-edit-actions">
                    <button
                      className="fleet-outline"
                      type="button"
                      disabled={props.devices.length < 2}
                      onClick={() => open("merge", selectedDevice)}
                    >
                      {c.merge}
                    </button>
                    <button
                      className="fleet-outline"
                      type="button"
                      onClick={() => open("remove", selectedDevice)}
                    >
                      {c.remove}
                    </button>
                  </div>
                )}
              </>
            ) : dialog === "link" ? (
              <>
                <label>
                  {c.choose}
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                  >
                    {props.devices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {c.projects}
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value as FleetProject)}
                  >
                    {FLEET_PROJECTS.map((p) => (
                      <option key={p} value={p}>
                        {FLEET_NAMES[p]} · {projectDeviceCount(props.devices, p)} / {limit}
                      </option>
                    ))}
                  </select>
                </label>
                {!canLinkProject(props.devices, selectedDevice, selectedProject, limit) && (
                  <div className="fleet-quota-warning">
                    <p>{c.limit}</p>
                    {props.plan === "free" && (
                      <button
                        className="fleet-outline"
                        type="button"
                        onClick={() => showPaywall(selectedProject, true)}
                      >
                        {c.viewPro}
                      </button>
                    )}
                  </div>
                )}
                <label>
                  {selectedProject === "iota"
                    ? "Miner ID"
                    : selectedProject === "flyai"
                      ? `fly.ai · ${c.rewardAddress}`
                      : selectedProject === "quantus"
                        ? `Wormhole · ${c.rewardAddress}`
                        : `xCoin · ${c.rewardAddress}`}
                  <input
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="off"
                    maxLength={100}
                    spellCheck={false}
                  />
                </label>
                {selectedProject === "xid" && (
                  <label>
                    {c.worker}
                    <input
                      maxLength={80}
                      value={worker}
                      onChange={(e) => setWorker(e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                )}
                <p className="fleet-input-note">{c.publicOnly}</p>
              </>
            ) : dialog === "merge" ? (
              <label>
                {c.choose}
                <select required value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
                  {props.devices
                    .filter((d) => d.id !== selectedDevice)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </label>
            ) : dialog === "remove" || dialog === "unlink" ? (
              <p>{props.devices.find((d) => d.id === selectedDevice)?.name}</p>
            ) : (
              <PaywallBody
                devices={props.devices}
                project={paywallProject}
                interval={interval}
                onChange={setInterval}
                disabled={busy}
                preview={!!props.preview || !props.onSubscribe}
              />
            )}
            {error && (
              <p className="fleet-form-error" role="alert">
                {error}
              </p>
            )}
            <div className="fleet-dialog-actions">
              <button className="fleet-outline" type="button" onClick={closeDialog} disabled={busy}>
                {dialog === "billing" ? c.continueFree : c.cancel}
              </button>
              <button
                className="site-button"
                disabled={
                  busy ||
                  (dialog === "add" &&
                    projectDeviceCount(props.devices, selectedProject) >= limit) ||
                  (dialog === "billing" && (props.preview || !props.onSubscribe))
                }
                type="submit"
              >
                {dialog === "billing" ? (
                  <>
                    {c.checkout}
                    <span>
                      {interval === "year" ? "US$16.90" : "US$2.90"}{" "}
                      {interval === "year" ? c.perYear : c.perMonth}
                    </span>
                  </>
                ) : busy ? (
                  c.processing
                ) : dialog === "add" ? (
                  c.add
                ) : (
                  c.save
                )}
              </button>
            </div>
          </form>
          {dialog === "billing" && (
            <div className="fleet-paywall-footer">
              <p>{c.stripePayment}</p>
              <p>{c.renewal}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function ProjectAllowances({
  devices,
  limit,
  c,
}: {
  devices: FleetDevice[];
  limit: number;
  c: Copy;
}) {
  return (
    <ul className="fleet-allowances">
      {FLEET_PROJECTS.map((p) => (
        <li key={p}>
          <span>
            <Check size={14} />
            {FLEET_NAMES[p]}
          </span>
          <b>
            {projectDeviceCount(devices, p)} / {limit} <small>{c.devices}</small>
          </b>
        </li>
      ))}
    </ul>
  );
}

function FleetCard({
  device,
  c,
  reading,
  onLink,
  onEdit,
  onUnlink,
}: {
  device: FleetDevice;
  c: Copy;
  reading: FleetWorkspaceProps["reading"];
  onLink: () => void;
  onEdit: (() => void) | undefined;
  onUnlink: ((id: string) => void) | undefined;
}) {
  const [expandedBinding, setExpandedBinding] = useState<string | null>(
    device.bindings[0]?.id ?? null,
  );
  const daily = deviceTodayEarnings(
    device.bindings.map((binding) => ({ binding, data: reading(binding) })),
  );
  const { locale } = useLocale();
  return (
    <article className="fleet-device-card">
      <header>
        <span className="fleet-machine-icon">
          <Cpu size={24} />
        </span>
        <div>
          <h2>{device.name}</h2>
          {device.hardware && <p>{device.hardware}</p>}
        </div>
        <span className="fleet-project-count">
          {new Set(device.bindings.map((b) => b.project)).size} {c.projects}
        </span>
      </header>
      <section className="fleet-device-earnings" aria-label={c.deviceToday}>
        <div>
          <span>{c.deviceToday}</span>
          <strong>
            {formatUsd(daily.usd)}
            <small>{daily.usd !== null ? "USD" : ""}</small>
          </strong>
        </div>
        <div className="fleet-device-earnings-detail">
          {daily.native.map((value, index) => (
            <span key={index}>
              {value.amount} <b>{value.unit}</b>
            </span>
          ))}
          <small>
            {daily.usd !== null
              ? `${daily.partial ? c.partialTotal + " · " : ""}${c.usdEstimate}`
              : daily.known
                ? c.noEarningsPrice
                : c.noDeviceEarnings}
          </small>
        </div>
      </section>
      <div className="fleet-project-readings">
        {!device.bindings.length && (
          <div className="fleet-no-projects">
            <b>{c.noProjects}</b>
            <p>{c.noProjectsGuide}</p>
            <button className="fleet-outline" onClick={onLink}>
              <Plus size={14} />
              {c.addProject}
            </button>
          </div>
        )}
        {device.bindings.map((binding) => {
          const data = reading(binding);
          const expanded = expandedBinding === binding.id;
          return (
            <section className="fleet-project-reading" key={binding.id}>
              <button
                type="button"
                className="fleet-reading-heading fleet-project-toggle"
                aria-expanded={expanded}
                aria-controls={`fleet-reading-${binding.id}`}
                onClick={() => setExpandedBinding(expanded ? null : binding.id)}
              >
                <b>{FLEET_NAMES[binding.project]}</b>
                <span className={`fleet-status fleet-status-${data.status}`}>
                  <i />
                  {c[data.status]}
                </span>
                <small>{data.activity}</small>
                <ChevronDown size={14} className={expanded ? "is-expanded" : ""} />
              </button>
              {expanded && (
                <div id={`fleet-reading-${binding.id}`}>
                  <div className="fleet-reading-metrics">
                    <div>
                      <span>
                        {data.todayLabel ?? c.today}
                        {data.scope === "wallet" && <small>{c.wallet}</small>}
                      </span>
                      <strong>
                        {data.today ?? "—"}
                        <small>{data.today !== null ? data.unit : ""}</small>
                      </strong>
                      {data.todayUsd && (
                        <small className="fleet-usd-estimate">
                          ≈ ${data.todayUsd} USD · {c.usdEstimate}
                        </small>
                      )}
                    </div>
                    <div>
                      <span>
                        {data.totalLabel ?? c.total}
                        {data.scope === "wallet" && <small>{c.wallet}</small>}
                      </span>
                      <strong>
                        {data.lifetime ?? "—"}
                        <small>{data.lifetime !== null ? data.unit : ""}</small>
                      </strong>
                    </div>
                  </div>
                  {data.note && <p className="fleet-reading-note">{data.note}</p>}
                  <a className="fleet-project-link" href={projectPath(locale, binding.project)}>
                    {monitorViewCopy(locale).projectRecords.replace(
                      "{project}",
                      FLEET_NAMES[binding.project],
                    )}
                    <ArrowUpRight size={13} />
                  </a>
                  <p className="fleet-card-freshness">
                    {c.updatedAt} · {data.updated}
                  </p>
                  <details className="fleet-reading-details">
                    <summary>
                      {c.details}
                      <ChevronDown size={13} />
                    </summary>
                    <dl>
                      <div>
                        <dt>{c.identifier}</dt>
                        <dd title={binding.identifier}>{shortId(binding.identifier, 12, 8)}</dd>
                      </div>
                      {binding.worker && (
                        <div>
                          <dt>Worker</dt>
                          <dd>{binding.worker}</dd>
                        </div>
                      )}
                      <div>
                        <dt>{c.source}</dt>
                        <dd>
                          {data.source} · {data.updated}
                        </dd>
                      </div>
                    </dl>
                    {data.scope === "wallet" && <p>{c.walletNote}</p>}
                    <a
                      href={
                        binding.project === "flyai"
                          ? "https://www.flyaiworld.com/compute/"
                          : PROJECTS[binding.project].explorer
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.source}
                      <ArrowUpRight size={13} />
                    </a>
                    {onUnlink && (
                      <button
                        type="button"
                        className="fleet-unlink"
                        onClick={() => onUnlink(binding.id)}
                      >
                        {c.unlink}
                      </button>
                    )}
                  </details>
                </div>
              )}
            </section>
          );
        })}
      </div>
      <footer>
        {onEdit && <button onClick={onEdit}>{c.rename}</button>}
        <button onClick={onLink}>
          <Plus size={14} />
          {c.addProject}
        </button>
      </footer>
    </article>
  );
}
