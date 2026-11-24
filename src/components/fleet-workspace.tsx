import { useRouterState } from "@tanstack/react-router";
import { DeviceTimeline, timelineCopy } from "./device-timeline";
import { FleetDeviceActions } from "./fleet-device-actions";
import { localized as l } from "@/lib/product-discovery";
import "./device-workspace.css";
import { agentListInput } from "@/lib/device-agent";
import { AgentPairing } from "./agent-pairing";
import { ProjectReadingMetrics } from "./project-reading-metrics";
import { FleetDeviceTable } from "./fleet-device-table";
import { DeviceMinerSummary } from "./device-miner-summary";
import { DiscreteAgentReading } from "./discrete-agent-reading";
import { ProjectAgentControls } from "./project-agent-controls";
import { AgentBatchPanel } from "./agent-batch";
import { insightCopy } from "./agent-insight-copy";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { iotaAgentTargets } from "@/lib/project-agent-targets";
import type { AgentInfo } from "@/lib/device-agent";
import { FlyaiWalletStats } from "./flyai-wallet-stats";
import { AcurastRewards } from "./acurast-rewards";
import { SyncGuidance } from "./sync-guidance";
import { IotaRosterStatus, IotaDeviceRun } from "./iota-device-run";
import { isPoolProject, poolName, type PoolProvider } from "@/lib/pool-projects";
import { poolCopy } from "./pool-copy";
import { AgentFilterSelect } from "./agent-filter";
import { deviceAttention } from "@/lib/device-attention";
import { formatAgo } from "@/lib/format";
import { agentOnline, matchesAgentFilter, type AgentFilter } from "@/lib/device-agent";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDeviceAgents } from "@/lib/device-agent.functions";
import { DeviceAgentSummary } from "./device-agent-summary";
import { agentCopy } from "./device-agent-copy";
import { IotaAddFlow } from "./iota-add-flow";
import { iotaAddCopy } from "./iota-add-copy";
import { trialCopy } from "./pro-trial-copy";
import { AdditionHelp } from "./onboarding";
import { reportCopy } from "./daily-report-copy";
import { ReportEntry } from "./daily-report-discovery";
import { FleetPricing } from "./fleet-pricing";
import { onboardingCopy, projectHelpPath } from "@/lib/onboarding";
import { isPlatform, isPrivatePlatform } from "@/lib/platforms";
import { platformCopy } from "./platform-copy";
import { editorialCopy } from "./project-editorial";
import { monitorViewCopy } from "./monitor-views";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  RefreshCw,
  Check,
  ChevronDown,
  Cpu,
  Monitor,
  Plus,
  Search,
} from "lucide-react";
import { useLocale } from "./site/locale";
import { fleetCopy } from "./fleet-copy";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import {
  FLEET_NAMES,
  FLEET_PROJECTS,
  AVAILABLE_FLEET_PROJECTS,
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
import {
  deviceTodayEarnings,
  deviceEarningsHeadline,
  singleAccountSummary,
  retainedDeviceDaily,
} from "@/lib/fleet-earnings";
import { formatUsd } from "@/lib/earnings";
import { PROJECTS, projectPath } from "@/lib/projects";
import { shortId } from "@/lib/ss58";
import type { ProjectReading } from "./fleet-review-data";
import type { FleetMutation } from "@/lib/fleet-policy";
import { PaywallBody } from "./fleet-paywall";
import { copyValues, planAmount } from "@/lib/billing-display";

const workspaceCopy = {
  allProjects: l(["全部项目", "全部專案", "All projects", "모든 프로젝트", "すべてのプロジェクト"]),
  tools: l(["设备工具", "裝置工具", "Device tools", "기기 도구", "デバイスツール"]),
  attention: l(["需处理", "待處理", "Needs attention", "확인 필요", "要対応"]),
  noAttention: l(["没有检测到异常设备", "未偵測到異常裝置", "No device issues detected", "감지된 기기 문제가 없습니다", "異常のある端末はありません"]),
  offline: l(["Agent 离线", "Agent 離線", "Agent offline", "Agent 오프라인", "Agent オフライン"]),
  training: l(["IOTA 训练中断", "IOTA 訓練中斷", "IOTA training interrupted", "IOTA 학습 중단", "IOTA 学習中断"]),
  bnt: l(["BNT 闲时挖矿异常", "BNT 閒時挖礦異常", "BNT idle mining issue", "BNT 유휴 채굴 오류", "BNT アイドル採掘エラー"]),
  xds: l(["XDS 闲时挖矿异常", "XDS 閒時挖礦異常", "XDS idle mining issue", "XDS 유휴 채굴 오류", "XDS アイドル採掘エラー"]),
};
type Copy = ReturnType<typeof fleetCopy>;
export type FleetWorkspaceProps = {
  initialAdd?: boolean;
  initialTimeline?: string | undefined;
  initialPaywallProject?: FleetProject | undefined;
  initialProject?: FleetProject | undefined;
  signedIn?: boolean;
  initialInterval?: "month" | "year";
  initialTab?: "devices" | "plans";
  devices: FleetDevice[];
  plan: "free" | "pro";
  billing?: BillingSummary | undefined;
  reportSettings?: ReactNode;
  syncGuidance?: ReactNode;
  proTools?: ReactNode;
  deviceTrend?: (device: FleetDevice) => ReactNode;
  preview?: boolean;
  previewAgents?: Record<string, AgentInfo>;
  initialLayout?: "cards" | "list";
  onRefresh?: (() => Promise<void>) | undefined;
  refreshing?: boolean | undefined;
  reading: (binding: FleetBinding) => ProjectReading;
  onAdd: (
    name: string,
    hardware: string,
    binding?: { project: FleetProject; identifier: string; worker: string; pool?: PoolProvider },
  ) => Promise<void>;
  onLink: (
    deviceId: string,
    project: FleetProject,
    identifier: string,
    worker: string,
    pool?: PoolProvider,
  ) => Promise<void>;
  onSubscribe?: (interval: "month" | "year") => Promise<void>;
  onManage?: (() => Promise<void>) | undefined;
  onMutation?: ((mutation: FleetMutation) => Promise<void>) | undefined;
  error?: string | null;
};

export function FleetWorkspace(props: FleetWorkspaceProps) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  const tab = props.initialTab ?? "devices";
  const openTools = useRouterState({
    select: (s) => new URLSearchParams(s.location.searchStr).has("tool") || s.location.hash.replace(/^#/, "") === "pro-tools",
  });
  const [timelineId, setTimelineId] = useState(props.initialTimeline);
  const timelineDevice = props.devices.find((device) => device.id === timelineId);
  const [pairAfterAdd, setPairAfterAdd] = useState<string | null>(null);
  const pairTarget = props.devices.find(d=>d.bindings.some(b=>b.project === "iota" && b.identifier === pairAfterAdd));
  const [layout, setLayout] = useState<"cards" | "list">(props.initialLayout ?? "cards");
  useEffect(() => {
    if (props.preview || props.initialLayout) return;
    try {
      const saved = localStorage.getItem("iota-fleet-layout");
      if (saved === "cards" || saved === "list") setLayout(saved);
    } catch {}
  }, [props.preview, props.initialLayout]);
  const agentNow = useAgentClock();
  const [project, setProject] = useState<FleetProject | "all">(props.initialProject ?? "all");
  const auth = useAuth();
  const listAgents = useServerFn(getDeviceAgents);
  const agents = useQuery({
    queryKey: ["device-agents", auth.userId],
    queryFn: () => listAgents(agentListInput()),
    enabled: !props.preview && !!auth.userId && auth.ready,
    staleTime: 10000,
    refetchInterval: 10000,
    retry: false,
  });
  const agentsByDevice = new Map(
    (props.preview ? Object.values(props.previewAgents ?? {}) : agents.data ?? []).map((agent) => [
      agent.deviceId,
      agent,
    ]),
  );
  const [statusFilter, setStatusFilter] = useState<AgentFilter>("all");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<
    "add" | "link" | "billing" | "edit" | "merge" | "remove" | "unlink" | null
  >(props.initialPaywallProject ? "billing" : props.initialAdd ? "add" : null);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [name, setName] = useState(""),
    [hardware, setHardware] = useState("");
  const [selectedProject, setSelectedProject] = useState<FleetProject>(
    props.initialProject ?? "iota",
  );
  const [quantusPool, setQuantusPool] = useState<"2miners" | "kryptex">();
  const selectedPool = selectedProject === "quantus" ? quantusPool : undefined;
  const poolProject = isPoolProject(selectedProject) && (selectedProject !== "quantus" || !!selectedPool);
  const [identifier, setIdentifier] = useState(""),
    [worker, setWorker] = useState("");
  const [sourceId, setSourceId] = useState(""),
    [bindingId, setBindingId] = useState("");
  const [interval, setInterval] = useState<"month" | "year">(props.initialInterval ?? "month");
  const [iotaQuick, setIotaQuick] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const [paywallProject, setPaywallProject] = useState<FleetProject | null>(
      props.initialPaywallProject ?? null,
    ),
    [returnToLink, setReturnToLink] = useState(false);
  const limit = PLANS[props.plan].projectDeviceLimit;
  const needsAttention = props.devices.filter((device) =>
    deviceAttention(agentsByDevice.get(device.id), device.bindings.some((b) => b.project === "iota"), agentNow),
  );
  const visible = (attentionOnly ? needsAttention : props.devices).filter((d) => {
        const text =
          `${d.name} ${d.hardware} ${d.bindings.map((b) => `${FLEET_NAMES[b.project]} ${b.identifier} ${b.worker}`).join(" ")}`.toLowerCase();
        return (
          (project === "all" || d.bindings.some((b) => b.project === project)) &&
          text.includes(search.trim().toLowerCase()) &&
          (statusFilter === "all" ||
            ((props.preview || (!agents.isPending && !agents.isError)) &&
              matchesAgentFilter(agentsByDevice.get(d.id), statusFilter, agentNow)))
        );
      });
  const activeProjects = FLEET_PROJECTS.filter(
    (p) => projectDeviceCount(props.devices, p) > 0,
  ).length;
  function canReadTimeline(device: FleetDevice) {
    return props.preview
      ? device.bindings.some((binding) => binding.project === "iota") || agentsByDevice.has(device.id)
      : agentsByDevice.has(device.id);
  }
  function attentionDetail(device: FleetDevice) {
    if (!attentionOnly) return null;
    const agent = agentsByDevice.get(device.id);
    const reason = deviceAttention(agent, device.bindings.some((b) => b.project === "iota"), agentNow);
    if (!reason) return null;
    return <p className="fleet-attention-detail">
      {workspaceCopy[reason][locale]}
      {reason === "offline" && agent?.lastSeen && ` · ${formatAgo(Date.parse(agent.lastSeen), agentNow, locale)}`}
    </p>;
  }
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
    setIotaQuick(false);
    setName("");
    setHardware("");
    setIdentifier("");
    setWorker("");
    setQuantusPool(undefined);
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
  async function choosePlan() {
    if (props.preview || !props.onSubscribe) {
      open("billing");
      return;
    }
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await props.onSubscribe(interval);
    } catch (e) {
      setError(e instanceof Error ? e.message : c.unavailable);
    } finally {
      setBusy(false);
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
          worker: selectedProject === "xid" || poolProject ? worker.trim() : "",
          ...(selectedPool ? { pool: selectedPool } : {}),
        });
        if (props.devices.some((d) => d.bindings.some((b) => bindingIdentity(b) === key)))
          throw new Error(c.duplicate);
        if (projectDeviceCount(props.devices, selectedProject) >= limit) {
          throw new Error(c.limit);
        }
        await props.onAdd(name.trim(), hardware.trim(), {
          project: selectedProject,
          identifier: identifier.trim(),
          worker: selectedProject === "xid" || poolProject ? worker.trim() : "",
          ...(selectedPool ? { pool: selectedPool } : {}),
        });
        if ((props.signedIn || props.preview) && selectedProject === "iota") setPairAfterAdd(identifier.trim());
      } else if (dialog === "link") {
        if (!validBinding(selectedProject, identifier.trim())) throw new Error(c.invalidId);
        const key = bindingIdentity({
          project: selectedProject,
          identifier: identifier.trim(),
          worker: selectedProject === "xid" || poolProject ? worker.trim() : "",
          ...(selectedPool ? { pool: selectedPool } : {}),
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
        await props.onLink(selectedDevice, selectedProject, identifier.trim(), selectedProject === "xid" || poolProject ? worker.trim() : "", selectedPool);
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
      {pairTarget && <AgentPairing key={pairTarget.id} deviceId={pairTarget.id} deviceLabel={pairTarget.name} autoOpen onDone={()=>setPairAfterAdd(null)} preview={!!props.preview} />}
      <header className="fleet-heading">
        <div>
          <h1>
            {tab === "plans"
              ? props.plan === "pro"
                ? c.membership
                : c.plans
              : onboardingCopy.devices[locale]}
          </h1>
          {tab === "devices" && (
            <a className="agent-entry" href={`/${locale}/machines#agent-pairing`}>
              {agentCopy.pair[locale]} →
            </a>
          )}
          {tab === "devices" && (
            <p className="fleet-count-line">
              {props.devices.length} {c.devices} · {activeProjects} {c.projects}
            </p>
          )}
        </div>
        {tab === "devices" ? (
          props.devices.length > 0 && (
            <div className="fleet-heading-actions">
              {props.onRefresh && (
                <button
                  className="fleet-outline"
                  onClick={() => void props.onRefresh?.()}
                  disabled={props.refreshing}
                >
                  <RefreshCw size={15} className={props.refreshing ? "reading-spin" : ""} />
                  {props.refreshing ? c.refreshingData : c.refreshData}
                </button>
              )}
              <button className="site-button" onClick={() => open("add")}>
                <Plus size={17} />
                {c.add}
              </button>
            </div>
          )
        ) : (
          <a className="fleet-outline" href={`/${locale}/devices`}>
            {c.devices}
            <ArrowUpRight size={15} />
          </a>
        )}
      </header>
      {tab === "devices" && props.syncGuidance}
      {props.error && (
        <p className="fleet-form-error" role="alert">
          {props.error}
        </p>
      )}
      {tab === "devices" ? (
        <section id="fleet-devices-panel" aria-label={c.devices}>
          {(props.preview || Boolean(auth.userId && agents.isSuccess)) && agentsByDevice.size > 0 && (
            <button
              className="fleet-outline fleet-attention-filter"
              aria-pressed={attentionOnly}
              onClick={() => {
                setAttentionOnly(!attentionOnly);
                setProject("all");
                setSearch("");
                setStatusFilter("all");
              }}
            >
              {workspaceCopy.attention[locale]} · {needsAttention.length}
            </button>
          )}
          {props.devices.length > 0 && (
            <div className="fleet-toolbar fleet-workspace-toolbar">
              <label className="fleet-search">
                <Search size={16} aria-hidden />
                <input
                  aria-label={c.search}
                  placeholder={c.search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <select
                className="fleet-project-filter"
                aria-label={c.projects}
                value={project}
                onChange={(e) => setProject(e.target.value as FleetProject | "all")}
              >
                <option value="all">{workspaceCopy.allProjects[locale]}</option>
                {FLEET_PROJECTS.filter(
                  (p) => projectDeviceCount(props.devices, p) > 0 || p === project,
                ).map((p) => <option key={p} value={p}>{FLEET_NAMES[p]}</option>)}
              </select>
              {!props.preview && auth.userId && (
                <AgentFilterSelect value={statusFilter} onChange={setStatusFilter} />
              )}
              <div className="agent-layout-switch" role="group" aria-label={iotaAddCopy.layout[locale]}>
                {(["cards", "list"] as const).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={layout === value}
                    onClick={() => {
                      setLayout(value);
                      if (!props.preview)
                        try {
                          localStorage.setItem("iota-fleet-layout", value);
                        } catch {}
                    }}
                  >
                    {insightCopy[value][locale]}
                  </button>
                ))}
              </div>
            </div>
          )}
          {props.devices.length > 0 && (
            <details className="fleet-workspace-tools" open={openTools || undefined}>
              <summary>{workspaceCopy.tools[locale]}</summary>
              <div>
                {props.proTools}
                {props.preview && props.previewAgents
                  ? (() => {
                      const targets = iotaAgentTargets(
                        visible,
                        Object.values(props.previewAgents),
                        visible.flatMap((d) =>
                          d.bindings.filter((b) => b.project === "iota").map((b) => b.identifier),
                        ),
                      );
                      return targets.agents.length || targets.unpaired.length ? (
                        <AgentBatchPanel
                          agents={targets.agents}
                          names={targets.names}
                          unpaired={targets.unpaired}
                          preview
                          previewPlan={props.plan}
                          userId={null}
                          now={agentNow}
                          locale={locale}
                        />
                      ) : null;
                    })()
                  : !props.preview && (
                      <ProjectAgentControls
                        miners={visible.flatMap((d) =>
                          d.bindings.filter((b) => b.project === "iota").map((b) => b.identifier),
                        )}
                        devices={props.devices}
                        agents={agents.data}
                        userId={auth.userId}
                        now={agentNow}
                        error={agents.isError}
                      />
                    )}
                <ReportEntry plan={props.plan} preview={props.preview ?? false} />
              </div>
            </details>
          )}
          {visible.length > 0 && (layout === "list" ? (
            <FleetDeviceTable
              devices={visible}
              reading={props.reading}
              preview={!!props.preview}
              previewAgents={props.previewAgents}
              agentsByDevice={agentsByDevice}
              agentNow={agentNow}
              onLink={(id) => open("link", id)}
              onTimeline={(device) => canReadTimeline(device) ? () => setTimelineId(device.id) : undefined}
              attentionDetail={attentionDetail}
              onEdit={props.onMutation ? (id) => open("edit", id) : undefined}
              onRemove={props.onMutation ? (id) => open("remove", id) : undefined}
            />
          ) : (
            <div className="fleet-cards">
              {visible.map((device) => (
                <FleetCard
                  preview={!!props.preview}
                  previewAgent={props.previewAgents?.[device.id]}
                  localAgent={agentsByDevice.get(device.id)}
                  agentNow={agentNow}
                  key={device.id}
                  device={device}
                  onTimeline={canReadTimeline(device) ? () => setTimelineId(device.id) : undefined}
                  attentionDetail={attentionDetail(device)}
                  c={c}
                  reading={props.reading}
                  trend={props.deviceTrend?.(device)}
                  onLink={() => open("link", device.id)}
                  onRemove={props.onMutation ? () => open("remove", device.id) : undefined}
                  onEdit={props.onMutation ? () => open("edit", device.id) : undefined}
                  onUnlink={
                    props.onMutation ? (binding) => open("unlink", device.id, binding) : undefined
                  }
                />
              ))}
            </div>
          ))}
          {visible.length === 0 && (
            <div className="fleet-empty">
              <Monitor size={30} />
              <p>{attentionOnly && !needsAttention.length ? workspaceCopy.noAttention[locale] : props.devices.length ? c.empty : c.emptyGuide}</p>
              <button
                className="site-button"
                onClick={() =>
                  props.devices.length ? (setProject("all"), setSearch(""), setStatusFilter("all"), setAttentionOnly(false)) : open("add")
                }
              >
                {props.devices.length ? c.clearFilters : c.add}
              </button>
              {!props.devices.length && (
                <>
                  <a
                    className="text-link"
                    href={projectHelpPath(locale, props.initialProject ?? "iota")}
                  >
                    {onboardingCopy.idHelp[locale]} <ArrowUpRight size={14} />
                  </a>
                  <p className="fleet-empty-help">{monitorViewCopy(locale).deviceWorkflow}</p>
                </>
              )}
            </div>
          )}
        </section>
      ) : (
        <section
          id="fleet-plans-panel"
          aria-label={props.plan === "pro" ? c.membership : c.plans}
          className="fleet-plans"
        >
          {props.plan === "pro" ? (
            <FleetMembership
              preview={props.preview ?? false}
              reportSettings={props.reportSettings}
              devices={props.devices}
              billing={props.billing}
              onManage={props.onManage}
              onAdd={() => open("add")}
            />
          ) : (
            <>
              <FleetPricing
                interval={interval}
                onIntervalChange={setInterval}
                onChoose={() => void choosePlan()}
                busy={busy}
                trialEligible={props.billing?.trialEligible}
                signedIn={props.signedIn}
                allowances={(limit) => (
                  <ProjectAllowances devices={props.devices} limit={limit} c={c} />
                )}
              />
              {error && (
                <p className="fleet-form-error" role="alert">
                  {error}
                </p>
              )}
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
      <Dialog open={!!timelineDevice} onOpenChange={(value) => { if (!value) setTimelineId(undefined); }}>
        {timelineDevice && (
          <DialogContent className="fleet-dialog fleet-timeline-dialog">
            <DialogTitle>{timelineDevice.name} · {timelineCopy.title[locale]}</DialogTitle>
            <DialogDescription className="fleet-timeline-description">{timelineCopy.description[locale]}</DialogDescription>
            <DeviceTimeline
              deviceId={timelineDevice.id}
              userId={auth.userId}
              hasIota={timelineDevice.bindings.some((binding) => binding.project === "iota")}
              preview={!!props.preview}
            />
          </DialogContent>
        )}
      </Dialog>
      <Dialog
        open={dialog !== null}
        onOpenChange={(value) => {
          if (!value && !busy) closeDialog();
        }}
      >
        <DialogContent
          className={
            dialog === "billing"
              ? "fleet-dialog fleet-paywall-dialog"
              : `fleet-dialog${iotaQuick ? " iota-add-dialog" : ""}`
          }
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
              ? reportCopy.paywallIntro[locale]
              : dialog === "add"
                ? iotaQuick
                  ? iotaAddCopy.guide[locale]
                  : c.addGuide
                : dialog === "merge"
                  ? c.mergeNote
                  : dialog === "remove" || dialog === "unlink"
                    ? dialog === "remove"
                      ? agentCopy.removeDeviceNote[locale]
                      : c.removeNote
                    : c.mapping}
          </DialogDescription>
          {dialog === "add" && <SyncGuidance compact informational />}
          {dialog === "billing" && <span className="fleet-paywall-brand">IOTA WATCH / PRO</span>}
          {dialog === "add" && selectedProject === "iota" && (
            <button
              type="button"
              className="iota-quick-toggle"
              disabled={busy}
              onClick={() => setIotaQuick((value) => !value)}
            >
              {iotaQuick ? iotaAddCopy.back[locale] : iotaAddCopy.quick[locale]}
            </button>
          )}
          {dialog === "add" && iotaQuick ? (
            <IotaAddFlow
              initialMode="wallet"
              duplicateIds={props.devices.flatMap((d) =>
                d.bindings.filter((b) => b.project === "iota").map((b) => b.identifier),
              )}
              limit={limit}
              remaining={Math.max(0, limit - projectDeviceCount(props.devices, "iota"))}
              onCancel={closeDialog}
              onBusy={setBusy}
              onComplete={closeDialog}
              onSave={async (input) => {
                try {
                  await props.onAdd(input.label, "", {
                    project: "iota",
                    identifier: input.hotkey,
                    worker: "",
                  });
                  return { ok: true };
                } catch {
                  return { ok: false, error: c.unavailable };
                }
              }}
            />
          ) : (
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
                          {AVAILABLE_FLEET_PROJECTS.map((p) => (
                            <option key={p} value={p}>
                              {FLEET_NAMES[p]} · {projectDeviceCount(props.devices, p)} / {limit}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {poolProject
                          ? poolCopy.wallet[locale]
                          : isPlatform(selectedProject)
                            ? selectedProject === "ionet"
                              ? "Device ID"
                              : selectedProject === "vast"
                                ? "Machine ID"
                                : platformCopy(locale).identifier
                            : selectedProject === "nosana"
                              ? editorialCopy(locale).nodeId
                              : selectedProject === "gonka"
                                ? editorialCopy(locale).hostId
                                : selectedProject === "iota"
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
                          maxLength={120}
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder={
                            poolProject
                              ? {
                                  tsc: "tc1…",
                                  prl: "prl1…",
                                  quantus: "qz…",
                                  xmr: "4… / 8…",
                                  etc: "0x…",
                                  rvn: "R…",
                                  zec: "t1… / t3…",
                                  kas: "kaspa:…",
                                  mds: "64 hex · MSS",
                                  bnt: "Blocknet · Base58",
                                  csd: "40 hex · addr20",
                                  erg: "9… · P2PK",
                                  zeph: "ZEPHYR…",
                                  btc: "1… / 3… / bc1…",
                                  ethw: "0x…",
                                }[selectedProject]
                              : isPlatform(selectedProject)
                                ? selectedProject === "noid"
                                  ? "o1…"
                                  : selectedProject === "acurast"
                                    ? "Processor · SS58 / 0x…"
                                    : selectedProject === "akash"
                                      ? "akash1…"
                                      : selectedProject === "golem"
                                        ? "0x…"
                                        : selectedProject === "ionet"
                                          ? "Device ID"
                                          : "Machine ID"
                                : selectedProject === "nosana"
                                  ? "Solana…"
                                  : selectedProject === "gonka"
                                    ? "gonka1…"
                                    : selectedProject === "iota"
                                      ? "5…"
                                      : selectedProject === "xid"
                                        ? "xpa1r…"
                                        : selectedProject === "quantus"
                                          ? `Wormhole · ${c.rewardAddress}`
                                          : "0x…"
                          }
                        />
                      </label>
                      {poolProject && (
                        <p className="fleet-input-note">
                          {poolCopy.pool[locale]} · {poolName(selectedProject, selectedPool)}
                        </p>
                      )}
                      <AdditionHelp project={selectedProject} plan={props.plan} />
                      {!isPrivatePlatform(selectedProject) && (
                        <p className="fleet-input-note">{c.publicOnly}</p>
                      )}
                      {selectedProject === "quantus" && (
                        <label>
                          {poolCopy.pool[locale]}
                          <select value={quantusPool ?? ""} onChange={(event) => {
                            const value = event.target.value;
                            setQuantusPool(value === "2miners" || value === "kryptex" ? value : undefined);
                          }}>
                            <option value="">Quantus Explorer</option>
                            <option value="2miners">2Miners</option>
                            <option value="kryptex">Kryptex</option>
                          </select>
                        </label>
                      )}
                      {(selectedProject === "xid" || poolProject) && (
                        <label>
                          {poolProject ? poolCopy.worker[locale] : c.worker}
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
                      {AVAILABLE_FLEET_PROJECTS.map((p) => (
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
                    {poolProject
                      ? poolCopy.wallet[locale]
                      : isPlatform(selectedProject)
                        ? selectedProject === "ionet"
                          ? "Device ID"
                          : selectedProject === "vast"
                            ? "Machine ID"
                            : platformCopy(locale).identifier
                        : selectedProject === "nosana"
                          ? editorialCopy(locale).nodeId
                          : selectedProject === "gonka"
                            ? editorialCopy(locale).hostId
                            : selectedProject === "iota"
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
                      maxLength={120}
                      spellCheck={false}
                    />
                  </label>
                  {selectedProject === "quantus" && (
                        <label>
                          {poolCopy.pool[locale]}
                          <select value={quantusPool ?? ""} onChange={(event) => {
                            const value = event.target.value;
                            setQuantusPool(value === "2miners" || value === "kryptex" ? value : undefined);
                          }}>
                            <option value="">Quantus Explorer</option>
                            <option value="2miners">2Miners</option>
                            <option value="kryptex">Kryptex</option>
                          </select>
                        </label>
                      )}
                      {(selectedProject === "xid" || poolProject) && (
                    <label>
                      {poolProject ? poolCopy.worker[locale] : c.worker}
                      <input
                        maxLength={80}
                        value={worker}
                        onChange={(e) => setWorker(e.target.value)}
                        autoComplete="off"
                      />
                    </label>
                  )}
                  {poolProject && (
                    <p className="fleet-input-note">
                      {poolCopy.pool[locale]} · {poolName(selectedProject, selectedPool)}
                    </p>
                  )}
                  <AdditionHelp project={selectedProject} plan={props.plan} />
                  {!isPrivatePlatform(selectedProject) && (
                    <p className="fleet-input-note">{c.publicOnly}</p>
                  )}
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
                  trialEligible={props.billing?.trialEligible}
                  preview={!!props.preview || !props.onSubscribe}
                />
              )}
              {error && (
                <p className="fleet-form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="fleet-dialog-actions">
                <button
                  className="fleet-outline"
                  type="button"
                  onClick={closeDialog}
                  disabled={busy}
                >
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
                      {busy
                        ? c.processing
                        : interval === "year" && props.billing?.trialEligible !== false
                          ? trialCopy.start[locale]
                          : props.signedIn
                            ? trialCopy.continue[locale]
                            : trialCopy.signIn[locale]}
                      <span>
                        US${planAmount(interval)} {interval === "year" ? c.perYear : c.perMonth}
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
          )}
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
      {AVAILABLE_FLEET_PROJECTS.map((p) => (
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
  onTimeline,
  onRemove,
  preview,
  previewAgent,
  localAgent,
  agentNow,
  device,
  c,
  reading,
  trend,
  onLink,
  onEdit,
  onUnlink,
  attentionDetail,
}: {
  onTimeline: (() => void) | undefined;
  onRemove: (() => void) | undefined;
  preview?: boolean;
  previewAgent?: AgentInfo | undefined;
  localAgent: AgentInfo | undefined;
  agentNow: number;
  device: FleetDevice;
  c: Copy;
  reading: FleetWorkspaceProps["reading"];
  trend?: ReactNode;
  onLink: () => void;
  onEdit: (() => void) | undefined;
  onUnlink: ((id: string) => void) | undefined;
  attentionDetail: ReactNode;
}) {
  const [expandedBinding, setExpandedBinding] = useState<string | null>(null);
  const daily = deviceTodayEarnings(
    device.bindings.map((binding) => ({ binding, data: reading(binding) })),
  );
  const { locale } = useLocale();
  const nativeHeadline = deviceEarningsHeadline(daily);
  const initialLoading = device.bindings.some((b) => reading(b).health === "loading");
  const accountStale = device.bindings.some((b) => reading(b).health === "stale");
  const account = daily.known === 0 ? singleAccountSummary(device.bindings.map(reading)) : null;
  const retained = daily.known === 0 ? retainedDeviceDaily(device.bindings.map(reading)) : null;
  const onlyWalletPanels = device.bindings.length === 1 && device.bindings[0]?.project !== "iota";
  const hasIota = device.bindings.some((b) => b.project === "iota");
  const agentCurrent = localAgent && agentOnline(localAgent.lastSeen, agentNow);
  const hasOtherDaily = device.bindings.some((b) => {
    const r = reading(b);
    return (
      b.project !== "iota" &&
      r.scope === "device" &&
      r.earningsPeriod !== "month" &&
      r.todayUsable !== false &&
      r.today !== null
    );
  });
  const headlineLabel = retained
    ? c.lastDaily
    : account
      ? account.kind === "month"
        ? c.monthPoints
        : c.balance
      : hasIota
        ? hasOtherDaily
          ? c.deviceDaily
          : c.deviceYesterday
        : c.deviceToday;
  return (
    <article className="fleet-device-card">
      <header>
        <span className="fleet-machine-icon">
          <Cpu size={24} />
        </span>
        <div>
          <h2>{device.name}</h2>
          {device.hardware && <p>{device.hardware}</p>}
          {attentionDetail}
        </div>
      </header>
      {!onlyWalletPanels && (daily.known > 0 || retained || account || initialLoading) && (
        <section className="fleet-device-earnings" aria-label={headlineLabel}>
          <div>
            <span>{headlineLabel}</span>
            <strong>
              {retained
                ? retained.amount
                : account
                  ? account.amount
                  : nativeHeadline
                    ? nativeHeadline.amount
                    : formatUsd(daily.usd)}
              <small>
                {retained
                  ? retained.unit
                  : account
                    ? account.unit
                    : nativeHeadline
                      ? nativeHeadline.unit
                      : daily.usd !== null
                        ? "USD"
                        : ""}
              </small>
            </strong>
          </div>
          <div className="fleet-device-earnings-detail">
            {!nativeHeadline &&
              daily.native.map((value, index) => (
                <span key={index}>
                  {value.amount} <b>{value.unit}</b>
                </span>
              ))}
            <small>
              {retained
                ? c.stale
                : account
                  ? `${c.wallet}${accountStale ? " · " + c.stale : ""}`
                  : daily.usd !== null
                    ? `${daily.partial ? c.partialTotal + " · " : ""}${c.usdEstimate}${daily.priceStale ? " · " + c.quoteOlder : ""}`
                    : daily.known
                      ? c.noEarningsPrice
                      : initialLoading
                        ? c.loading
                        : c.noDeviceEarnings}
            </small>
          </div>
        </section>
      )}
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
                <b>
                  {FLEET_NAMES[binding.project]}
                  {binding.project === "tsc" ? ` · ${poolName("tsc", binding.pool)}` : ""}
                </b>
                {binding.project === "iota" ? (!agentCurrent && (
                  <IotaRosterStatus
                    deviceId={device.id}
                    miner={binding.identifier}
                    preview={!!preview}
                    previewAgent={previewAgent}
                    status={data.officialTraining?.status ?? "unknown"}
                  />
                )) : (
                  <span className={`fleet-status fleet-status-${data.status}`}>
                    <i />
                    {c[data.status]}
                  </span>
                )}
                {binding.project === "iota" && data.compute?.fresh && data.compute.value !== null && (
                  <small>{data.compute.value} {data.compute.unit}</small>
                )}
                <ChevronDown size={14} className={expanded ? "is-expanded" : ""} />
              </button>
              {binding.project === "iota" && (
                <IotaDeviceRun
                  run={data.officialRun}
                  deviceId={device.id}
                  preview={!!preview}
                  layout="row"
                  previewAgent={previewAgent}
                />
              )}
              {!["iota", "acurast", "flyai"].includes(binding.project) && (
                <ProjectReadingMetrics project={binding.project} data={data} activity={false} />
              )}
              {binding.worker && (
                <p className="fleet-worker-label">
                  Worker · <b>{binding.worker}</b>

                </p>
              )}
              {binding.project === "flyai" && data.flyai && (
                <FlyaiWalletStats data={data.flyai} stale={data.health !== "fresh"} />
              )}
              {binding.project === "acurast" && (
                <AcurastRewards
                  rewards={data.acurastRewards}
                  balances={data.acurastBalances}
                  quote={data.acurastQuote}
                  stale={data.health === "stale" || data.health === "unavailable"}
                />
              )}
              {(data.health === "stale" ||
                data.health === "unavailable" ||
                data.note === c.stale) && (
                <p className="fleet-reading-note" role="status">
                  {data.health === "stale" ? c.stale : (data.note ?? c.unavailable)}
                  {data.updated !== "—" && <span> · {data.updated}</span>}
                  {data.health === "unavailable" && isPrivatePlatform(binding.project) && (
                    <a href={projectPath(locale, binding.project)}>
                      {" "}
                      · {platformCopy(locale).connect}
                    </a>
                  )}
                </p>
              )}
              {expanded && (
                <div id={`fleet-reading-${binding.id}`}>
                  {binding.project === "iota" && (
                    <div className="fleet-reading-metrics">
                      <div>
                        <span>
                          {data.todayLabel ?? (binding.project === "iota" ? c.yesterday : c.today)}
                          {data.scope === "wallet" && <small>{c.wallet}</small>}
                        </span>
                        <strong>
                          {data.today ?? "—"}
                          <small>{data.today !== null ? data.unit : ""}</small>
                        </strong>
                        {data.todayUsd && (
                          <small className="fleet-usd-estimate">
                            ≈ ${data.todayUsd} USD · {c.usdEstimate}
                            {data.priceStale ? " · " + c.quoteOlder : ""}
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
                  )}
                  {data.note &&
                    !["stale", "unavailable"].includes(data.health ?? "") &&
                    data.note !== c.stale && <p className="fleet-reading-note">{data.note}</p>}
                  <a className="fleet-project-link" href={projectPath(locale, binding.project)}>
                    {monitorViewCopy(locale).projectRecords.replace(
                      "{project}",
                      FLEET_NAMES[binding.project],
                    )}
                    <ArrowUpRight size={13} />
                  </a>

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
                    {data.scope === "wallet" &&
                      binding.project !== "gonka" &&
                      binding.project !== "akash" && <p>{c.walletNote}</p>}
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
                    {isPrivatePlatform(binding.project) && (
                      <a href={`/${locale}/projects/${binding.project}`}>
                        {platformCopy(locale).connect} →
                      </a>
                    )}
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
              {binding.project !== "iota" && (
                <DeviceMinerSummary
                  deviceId={device.id}
                  bindings={[binding]}
                  preview={!!preview}
                  previewAgent={previewAgent}
                />
              )}
            </section>
          );
        })}
      </div>
      {hasIota && (
        <div className="fleet-device-agent">
          <DeviceAgentSummary
            compact
            deviceId={device.id}
            preview={!!preview}
            previewAgent={previewAgent}
            official={device.bindings
              .filter((b) => b.project === "iota")
              .map((b) => reading(b).officialTraining)
              .find(Boolean)}
          />
        </div>
      )}
      <DiscreteAgentReading agent={localAgent} now={agentNow} locale={locale} />
      {trend}
      <footer>
        <FleetDeviceActions
          onLink={device.bindings.length ? onLink : undefined}
          onTimeline={onTimeline}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </footer>
    </article>
  );
}
