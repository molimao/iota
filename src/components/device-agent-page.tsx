import { LogAnalysis } from "./log-analysis";
import { AgentUpdate } from "./agent-update";
import { AgentHistory } from "./agent-history";
import { insightCopy } from "./agent-insight-copy";
import { AgentStatus, AgentCommandResult, AgentTimeline } from "./agent-insights";
import { AgentFilterSelect, agentFilterCopy } from "./agent-filter";
import { matchesAgentFilter, type AgentFilter } from "@/lib/device-agent";
import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { useLocale } from "./site/locale";
import { LANGUAGE_TAG } from "@/lib/site";
import { AGENT_DOWNLOAD_URL, AGENT_RELEASE, agentOnline, agentPhase, type AgentInfo } from "@/lib/device-agent";
import {
  getDeviceAgents,
  pairDeviceAgent,
  deviceAgentCommand,
  setDeviceAgentOptions,
  revokeDeviceAgent,
} from "@/lib/device-agent.functions";
import { agentCopy as copy } from "./device-agent-copy";
export function DeviceAgentPage({ preview = false }: { preview?: boolean }) {
  const requestedDevice = useRouterState({ select: (s) => new URLSearchParams(s.location.searchStr).get("device") });
  const requestedMiner = useRouterState({ select: (s) => new URLSearchParams(s.location.searchStr).get("miner") });
  const auth = useAuth(),
    fleet = useFleet(preview ? null : auth.userId, preview ? false : auth.ready),
    { locale } = useLocale(),
    client = useQueryClient();
  const t = Object.fromEntries(Object.entries(copy).map(([k, v]) => [k, v[locale]])) as {
    [K in keyof typeof copy]: string;
  };
  const list = useServerFn(getDeviceAgents),
    pair = useServerFn(pairDeviceAgent),
    command = useServerFn(deviceAgentCommand),
    settings = useServerFn(setDeviceAgentOptions),
    revoke = useServerFn(revokeDeviceAgent);
  const [code, setCode] = useState<{ token: string; expiresAt: number; deviceId: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [pairedDevice, setPairedDevice] = useState<string | null>(null);
  const q = useQuery({
    queryKey: ["device-agents", auth.userId],
    queryFn: () => list(),
    enabled: !preview && !!auth.userId,
    refetchInterval: code && Date.now() < code.expiresAt ? 3000 : 15000,
    refetchOnWindowFocus: true,
    retry: false,
  });
  const [now, setNow] = useState(Date.now());
  const examples: AgentInfo[] = [
    {
      deviceId: "demo-mac",
      lastSeen: new Date(now).toISOString(),
      snapshot: {
        appRunning: true,
        workerRunning: true,
        appCpu: 286.5,
        processMemoryMb: 2810,
        load: 3.2,
        logs: '[2026-10-15 10:32:00.000] training throughput=24.8 tokens/s\n[2026-10-15 10:28:00.000] training status: {"state": "initializing"}',
        version: "1.0.5",
        trainingState:{phase:"training",status:"forward",observedAt:new Date(now).toISOString()},
      },
      logsEnabled: true,
      recoveryEnabled: false,
      pending: null,
      latestCommand: null,
    },
  ];
  const [demo, setDemo] = useState<AgentInfo[] | null>(null),
    [device, setDevice] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null),
    [confirm, setConfirm] = useState<string | null>(null);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!confirm) return;
    const timer = setTimeout(() => setConfirm(null), 30000);
    return () => clearTimeout(timer);
  }, [confirm]);
  const actor = useRef(auth.userId);
  actor.current = auth.userId;
  useEffect(() => {
    setCode(null);
    setDevice("");
    setConfirm(null);
    setPairedDevice(null);
  }, [auth.userId]);
  const [layout, setLayout] = useState<"list" | "cards">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentFilter>("all");
  const agents = preview ? (demo ?? examples) : (q.data ?? []);
  useEffect(() => {
    if (code && q.data?.some((a) => a.deviceId === code.deviceId)) {
      setPairedDevice(code.deviceId);
      setCode(null);
      setDevice("");
    }
  }, [code, q.data]);
  useEffect(() => { setCopied(false); setCopyFailed(false); }, [code?.token]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);
  const visibleAgents = agents.filter(a => {
    const d = fleet.devices.find(d => d.id === a.deviceId);
    const text = `${preview ? "Mac Studio" : d?.name ?? "Mac"} ${d?.bindings.map(b => b.identifier).join(" ") ?? ""}`.toLowerCase();
    return text.includes(search.trim().toLowerCase()) && matchesAgentFilter(a, statusFilter, now);
  });
  const candidates = fleet.devices.filter(
    (d) => d.bindings.some((b) => b.project === "iota") && !agents.some((a) => a.deviceId === d.id),
  );
  const linkedDevice = candidates.find((d) => requestedDevice
    ? d.id === requestedDevice
    : !!requestedMiner && d.bindings.some((b) => b.project === "iota" && b.identifier === requestedMiner))?.id;
  useEffect(() => {
    if (linkedDevice) setDevice(linkedDevice);
  }, [linkedDevice, auth.userId]);
  async function act(fn: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await fn();
      if (!preview) await client.invalidateQueries({ queryKey: ["device-agents", auth.userId] });
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  }
  function requiresConfirm(id: string, action: string) {
    const k = `${id}:${action}`;
    if (confirm !== k) {
      setConfirm(k);
      return false;
    }
    setConfirm(null);
    return true;
  }
  return (
    <main id="main" className="projects-page agent-page">
      <header className="project-heading">
        <div>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </div>
        <a href={`/${locale}/devices`}>{t.back} →</a>
      </header>
      {preview && <p className="review-notice">{t.demo}</p>}
      {!preview && !auth.userId ? (
        <button
          className="site-button"
          disabled={!auth.ready || auth.signingIn}
          onClick={() => void auth.signInWithGoogle()}
        >
          {t.login}
        </button>
      ) : (
        <>
      <section className="agent-setup-guide">
        <div><strong>{t.setupDownload}</strong><a className="site-button" href={AGENT_DOWNLOAD_URL} download>{t.install}</a></div>
        <div><strong>{t.setupPair}</strong><span>{t.setupRun}</span></div>
      </section>
          {pairedDevice && <p role="status" className="agent-pair-success">{fleet.devices.find((d) => d.id === pairedDevice)?.name ?? "Mac"} · {t.paired}</p>}
          {!preview && !q.isError && (
            <section className="compute-panel agent-pair">
              {!candidates.length ? (
                <p>{agents.length ? t.back : t.empty}</p>
              ) : (
                <>
                  <label>
                    {t.choose}
                    <select
                      value={device}
                      disabled={busy}
                      onChange={(e) => {
                        setDevice(e.target.value);
                        setCode(null);
                      }}
                    >
                      <option value="">—</option>
                      {candidates.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="site-button"
                    disabled={busy || !device}
                    onClick={() =>
                      void act(async () => {
                        const requestedUser = auth.userId;
                        const result = await pair({ data: { deviceId: device } });
                        if (actor.current === requestedUser) {
                          setCode({ ...result, deviceId: device });
                          setPairedDevice(null);
                        }
                      })
                    }
                  >
                    {t.pair}
                  </button>
                </>
              )}
              {code && (
                <div className="agent-pair-code">
                  <p>{t.steps}</p>
                  <div className="agent-code-actions">
                    <code>{now < code.expiresAt ? code.token : "—"}</code>
                    <button type="button" className="fleet-outline" disabled={now >= code.expiresAt} onClick={async () => {
                      const token = code.token;
                      try {
                        await navigator.clipboard.writeText(token);
                        setCopied(true); setCopyFailed(false);
                      } catch { setCopyFailed(true); }
                    }}>{copied ? t.copied : t.copyCode}</button>
                  </div>
                  <p role="status">{copyFailed ? t.copyFailed : now >= code.expiresAt ? t.expired : t.waitPair}</p>
                  <div className="agent-pair-actions">
                  <button type="button" className="fleet-outline" disabled={q.isFetching} onClick={() => void q.refetch()}>{t.checkPair}</button>
                  <a className="site-button" href={AGENT_DOWNLOAD_URL} download>
                    {t.install}
                  </a>
                  </div>
                </div>
              )}
            </section>
          )}
          {q.isError && !preview && <p role="alert">{t.unavailable}</p>}
          {error && <p role="alert">{error}</p>}
          <div className="agent-filter-toolbar">
            <input type="search" aria-label={agentFilterCopy.search[locale]} placeholder={agentFilterCopy.search[locale]} value={search} onChange={e=>setSearch(e.target.value)} />
            <AgentFilterSelect value={statusFilter} onChange={setStatusFilter} unpaired={false} />
            <span>{visibleAgents.length} / {agents.length}</span>
            <div className="agent-layout-switch">{(["list", "cards"] as const).map(v=><button type="button" key={v} aria-pressed={layout===v} onClick={()=>setLayout(v)}>{insightCopy[v][locale]}</button>)}</div>
          </div>
          {agents.length > 0 && visibleAgents.length === 0 && <p role="status">{agentFilterCopy.empty[locale]}</p>}
          <div className="agent-grid" data-layout={layout}>
            {visibleAgents.map((a) => {
              const online = agentOnline(a.lastSeen, now),
                s = a.snapshot,
                name = preview
                  ? "Mac Studio"
                  : (fleet.devices.find((d) => d.id === a.deviceId)?.name ?? "Mac");
              return (
                <section className="compute-panel" key={a.deviceId}>
                  <div className="project-address-heading">
                    <h2>{name}</h2>
                    <span className={online ? "agent-online" : ""}>
                      {online ? t.live : t.offline}
                    </span>
                  </div>
                  <AgentStatus agent={a} now={now} />
                  <div className="compute-metrics">
                    <div className="compute-metric" title={t.queueNote}>
                      <span>{t.queue}</span>
                      <strong>
                        {agentPhase(a, now) === "queued" && s.queue
                          ? `#${s.queue.position}`
                          : t.queueUnknown}
                      </strong>
                    </div>
                    <div className="compute-metric">
                      <span title={t.cpuNote}>{t.cpu}</span>
                      <strong>
                        {online && s.appCpu != null ? `${s.appCpu.toFixed(1)}%` : "—"}
                      </strong>
                    </div>
                    <div className="compute-metric">
                      <span>{t.memory}</span>
                      <strong>
                        {online && s.processMemoryMb != null
                          ? `${s.processMemoryMb.toFixed(0)} MB`
                          : "—"}
                      </strong>
                    </div>
                  </div>
                  <p className="compute-caption">
                    {a.lastSeen ? new Date(a.lastSeen).toLocaleString(LANGUAGE_TAG[locale]) : "—"}
                  </p>
                  <AgentCommandResult agent={a} />
                  <AgentUpdate agent={a} disabled={busy} onPreviewUpdate={preview ? () => setDemo(agents.map(x=>x.deviceId===a.deviceId ? {...x,snapshot:{...x.snapshot,version:AGENT_RELEASE},latestCommand:{action:"update",status:"done",createdAt:new Date().toISOString()}}:x)) : undefined} />
                  <AgentHistory deviceId={a.deviceId} preview={preview} />
                  <details className="agent-controls" open={layout === "cards" ? true : undefined}>
                    <summary>{insightCopy.manage[locale]}</summary>
                  <div className="agent-actions">
                    {(["start", "stop", "restart"] as const).map((action) => (
                      <button
                        className="project-outline"
                        key={action}
                        disabled={busy || !online || !!a.pending}
                        onClick={() => {
                          if (action !== "start" && !requiresConfirm(a.deviceId, action)) return;
                          void act(async () => {
                            if (preview)
                              setDemo(
                                agents.map((x) =>
                                  x.deviceId === a.deviceId
                                    ? {
                                        ...x,
                                        snapshot: {
                                          ...x.snapshot,
                                          appRunning: action !== "stop",
                                          workerRunning: action !== "stop",
                                          appCpu: action === "stop" ? null : 286.5,
                                          processMemoryMb: action === "stop" ? null : 2810,
                                        },
                                        latestCommand: {
                                          action,
                                          status: "done",
                                          createdAt: new Date().toISOString(),
                                        },
                                        recoveryEnabled:
                                          action === "stop" ? false : x.recoveryEnabled,
                                      }
                                    : x,
                                ),
                              );
                            else await command({ data: { deviceId: a.deviceId, action } });
                          });
                        }}
                      >
                        {confirm === `${a.deviceId}:${action}` ? t.confirm : t[action]}
                      </button>
                    ))}
                  </div>
                  <p className="compute-caption">{t.agentVersion} {s.version ?? "—"}{s.version===AGENT_RELEASE ? ` · ${t.upToDate}` : ""}</p>
                  <details className="agent-settings">
                    <summary>{t.settings}</summary>
                    <label className="agent-option">
                      <input
                        type="checkbox"
                        checked={a.recoveryEnabled}
                        disabled={busy}
                        onChange={(e) =>
                          void act(async () => {
                            if (preview)
                              setDemo(
                                agents.map((x) =>
                                  x.deviceId === a.deviceId
                                    ? { ...x, recoveryEnabled: e.target.checked }
                                    : x,
                                ),
                              );
                            else
                              await settings({
                                data: {
                                  deviceId: a.deviceId,
                                  recovery: e.target.checked,
                                  logs: a.logsEnabled,
                                },
                              });
                          })
                        }
                      />
                      {t.recovery}
                    </label>
                    <p className="compute-caption">{t.recoveryNote}</p>
                    <label className="agent-option">
                      <input
                        type="checkbox"
                        checked={a.logsEnabled}
                        disabled={busy}
                        onChange={(e) =>
                          void act(async () => {
                            if (preview)
                              setDemo(
                                agents.map((x) =>
                                  x.deviceId === a.deviceId
                                    ? { ...x, logsEnabled: e.target.checked }
                                    : x,
                                ),
                              );
                            else
                              await settings({
                                data: {
                                  deviceId: a.deviceId,
                                  recovery: a.recoveryEnabled,
                                  logs: e.target.checked,
                                },
                              });
                          })
                        }
                      />
                      {t.logs}
                    </label>
                    <p className="compute-caption">{t.logsNote}</p>
                    {a.logsEnabled && <AgentTimeline logs={s.logs} />}
                    <LogAnalysis initialLogs={s.logs} preview={preview} />
                  </details>
                  <button
                    className="agent-revoke"
                    disabled={busy}
                    onClick={() => {
                      if (!requiresConfirm(a.deviceId, "revoke")) return;
                      void act(async () => {
                        if (preview) setDemo(agents.filter((x) => x.deviceId !== a.deviceId));
                        else await revoke({ data: { deviceId: a.deviceId } });
                      });
                    }}
                  >
                    {confirm === `${a.deviceId}:revoke` ? t.confirm : t.revoke}
                  </button>
                  <button type="button" className="agent-revoke" disabled={busy} onClick={() => {
                    if (!requiresConfirm(a.deviceId, "remove")) return;
                    void act(async () => {
                      if (preview) setDemo(agents.filter(x => x.deviceId !== a.deviceId));
                      else await fleet.mutate({action: "remove", payload: {id: a.deviceId}});
                    });
                  }}>{confirm === `${a.deviceId}:remove` ? t.confirm : t.removeDevice}</button>
                  {confirm === `${a.deviceId}:remove` && <p role="alert">{t.removeDeviceNote}</p>}
                  </details>

                </section>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
