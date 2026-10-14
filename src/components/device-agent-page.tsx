import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { useFleet } from "@/hooks/use-fleet";
import { useLocale } from "./site/locale";
import { LANGUAGE_TAG } from "@/lib/site";
import { AGENT_RELEASE, agentCanUpdate, agentOnline, type AgentInfo } from "@/lib/device-agent";
import {
  getDeviceAgents,
  pairDeviceAgent,
  deviceAgentCommand,
  setDeviceAgentOptions,
  revokeDeviceAgent,
} from "@/lib/device-agent.functions";
import { agentCopy as copy } from "./device-agent-copy";
export function DeviceAgentPage({ preview = false }: { preview?: boolean }) {
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
  const q = useQuery({
    queryKey: ["device-agents", auth.userId],
    queryFn: () => list(),
    enabled: !preview && !!auth.userId,
    refetchInterval: 15000,
    retry: false,
  });
  const examples: AgentInfo[] = [
    {
      deviceId: "demo-mac",
      lastSeen: new Date().toISOString(),
      snapshot: {
        appRunning: true,
        workerRunning: true,
        appCpu: 286.5,
        processMemoryMb: 2810,
        load: 3.2,
        logs: "[demo] training epoch 34 · throughput 24.8 tokens/s",
        version: "1.0.0",
      },
      logsEnabled: true,
      recoveryEnabled: false,
      pending: null,
      latestCommand: null,
    },
  ];
  const [demo, setDemo] = useState<AgentInfo[] | null>(null),
    [device, setDevice] = useState(""),
    [code, setCode] = useState<{ token: string; expiresAt: number } | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null),
    [confirm, setConfirm] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
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
  }, [auth.userId]);
  const agents = preview ? (demo ?? examples) : (q.data ?? []);
  const candidates = fleet.devices.filter(
    (d) => d.bindings.some((b) => b.project === "iota") && !agents.some((a) => a.deviceId === d.id),
  );
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
                        if (actor.current === requestedUser) setCode(result);
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
                  <code>{now < code.expiresAt ? code.token : "—"}</code>
                  <a className="site-button" href="/downloads/iota-watch-agent-1.0.2.zip" download>
                    {t.install}
                  </a>
                </div>
              )}
            </section>
          )}
          {q.isError && !preview && <p role="alert">{t.unavailable}</p>}
          {error && <p role="alert">{error}</p>}
          <div className="agent-grid">
            {agents.map((a) => {
              const online = preview || agentOnline(a.lastSeen, now),
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
                  <p>
                    {online ? (s.appRunning ? t.running : t.stopped) : "—"}
                    {online && s.appRunning
                      ? ` · ${s.workerRunning ? t.training : t.workerStopped}`
                      : ""}
                  </p>
                  <div className="compute-metrics">
                    <div className="compute-metric" title={t.queueNote}>
                      <span>{t.queue}</span>
                      <strong>
                        {online &&
                        s.appRunning &&
                        s.workerRunning &&
                        s.queue &&
                        Date.now() - Date.parse(s.queue.observedAt) >= 0 &&
                        Date.now() - Date.parse(s.queue.observedAt) <= 300000
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
                  <div className="agent-actions">
                    <span>
                      {t.agentVersion} {s.version ?? "—"}
                    </span>
                    {agentCanUpdate(s.version) ? (
                      <button
                        className="project-outline"
                        disabled={busy || !online || !!a.pending || s.version === AGENT_RELEASE}
                        onClick={() => {
                          if (!requiresConfirm(a.deviceId, "update")) return;
                          void act(async () => {
                            if (preview)
                              setDemo(
                                agents.map((x) =>
                                  x.deviceId === a.deviceId
                                    ? { ...x, snapshot: { ...x.snapshot, version: AGENT_RELEASE } }
                                    : x,
                                ),
                              );
                            else
                              await command({ data: { deviceId: a.deviceId, action: "update" } });
                          });
                        }}
                      >
                        {s.version === AGENT_RELEASE
                          ? t.upToDate
                          : confirm === `${a.deviceId}:update`
                            ? t.confirm
                            : t.update}
                      </button>
                    ) : (
                      <a
                        className="project-outline"
                        href="/downloads/iota-watch-agent-1.0.2.zip"
                        download
                      >
                        {t.manualUpgrade}
                      </a>
                    )}
                  </div>
                  {!agentCanUpdate(s.version) && (
                    <p className="compute-caption">{t.manualUpgradeNote}</p>
                  )}
                  {a.pending ? (
                    <p role="status">{t.pending}</p>
                  ) : (
                    a.latestCommand && (
                      <p role="status">{a.latestCommand.status === "done" ? t.done : t.failed}</p>
                    )
                  )}
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
                    {a.logsEnabled && <pre className="agent-logs">{s.logs || t.noLogs}</pre>}
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
                </section>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
