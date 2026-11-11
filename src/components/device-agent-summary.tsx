import { AgentGpu } from "./agent-gpu";
import { AgentPairing } from "./agent-pairing";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { LANGUAGE_TAG } from "@/lib/site";
import { AgentUpdate } from "./agent-update";
import { AgentStatus } from "./agent-insights";
import { AgentQuickActions } from "./agent-quick-actions";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { getFleet } from "@/lib/fleet.functions";
import { getDeviceAgents } from "@/lib/device-agent.functions";
import { agentOnline, agentUpdateAvailable, type AgentInfo, type OfficialTrainingEvidence } from "@/lib/device-agent";
import { useLocale } from "./site/locale";
import { agentCopy } from "./device-agent-copy";

/** Both card views share the account-scoped query with Mac management. */
export function DeviceAgentSummary({ deviceId, miner, official, preview = false, compact = false, previewAgent, afterStatus }: { deviceId?: string; miner?: string; official?: OfficialTrainingEvidence | undefined; preview?: boolean; compact?: boolean; previewAgent?:AgentInfo | undefined; afterStatus?: ((agent: AgentInfo, now: number) => ReactNode) | undefined }) {
  const auth = useAuth();
  const now = useAgentClock();
  const { locale } = useLocale();
  const t = Object.fromEntries(Object.entries(agentCopy).map(([key, value]) => [key, value[locale]])) as Record<keyof typeof agentCopy, string>;
  const list = useServerFn(getDeviceAgents);
  const fleet = useServerFn(getFleet);
  const enabled = !preview && auth.ready && !!auth.userId;
  const devices = useQuery({ queryKey: ["fleet", auth.userId], queryFn: () => fleet(), enabled: enabled && !!miner, staleTime: 15000 });
  const query = useQuery({ queryKey: ["device-agents", auth.userId], queryFn: () => list(), enabled, staleTime: 10000, refetchInterval: 15000, refetchOnWindowFocus: true, retry: false });
  const id = deviceId ?? (preview ? previewAgent?.deviceId ?? miner : devices.data?.devices.find((d) => d.bindings.some((b) => b.project === "iota" && b.identifier === miner))?.id);
  const agent = preview ? previewAgent : enabled ? query.data?.find((a) => a.deviceId === id) : undefined;
  const url = `/${locale}/machines?${deviceId ? `device=${encodeURIComponent(deviceId)}` : `miner=${encodeURIComponent(miner ?? "")}`}`;
  const online = !!agent && !query.isError && agentOnline(agent.lastSeen, now);
  const s = agent?.snapshot;
  if (compact) return agent && !query.isError ? (
    <div className="agent-table-controls">
      <a href={url} className="agent-table-status">
        <AgentStatus agent={agent} now={now} official={official} compact />
        {s?.platform !== "linux" && agentUpdateAvailable(s?.version) && <small className="agent-update-inline">{t.update} ↗</small>}
      </a>
      {afterStatus?.(agent, now)}
      <AgentGpu agent={agent} now={now} compact />
      <AgentQuickActions key={`${auth.userId}:${agent.deviceId}`} agent={agent} now={now} preview={preview} />
    </div>
  ) : query.isError ? <a href={url}>{t.queueUnknown} ↗</a>
    : id ? <AgentPairing key={`${auth.userId}:${id}`} deviceId={id} preview={preview} />
      : <a href={url}>{t.pair} ↗</a>;
  if (!agent) return <section className="fleet-agent-connect agent-card-summary agent-connect-hint">
    <span>{enabled && query.isError ? t.error : t.connectHint}</span>
    {id && !query.isError ? <AgentPairing key={`${auth.userId}:${id}`} deviceId={id} preview={preview} /> : <a href={url}>{t.pair} ↗</a>}
  </section>;
  return <section className="fleet-agent-connect agent-card-summary" aria-label={s?.platform === "linux" ? "Linux GPU" : t.title}>
    <>
      <div className="agent-card-heading"><strong>{query.isError ? t.queueUnknown : online ? t.live : t.offline}</strong><a href={url}>{t.settings} ↗</a></div>
      {!query.isError && <AgentStatus agent={agent} now={now} official={official} concise />}
      {!query.isError && !preview && <AgentUpdate agent={agent} />}
      <p className="compute-caption agent-last-report">{t.lastReport} · {agent.lastSeen ? new Date(agent.lastSeen).toLocaleString(LANGUAGE_TAG[locale]) : "—"}</p>
      <dl className="agent-card-metrics">
        <div><dt>{t.cpu}</dt><dd>{online && s?.appCpu != null ? `${s.appCpu.toFixed(1)}%` : "—"}</dd></div>
        <div><dt>{t.memory}</dt><dd>{online && s?.processMemoryMb != null ? `${Math.round(s.processMemoryMb)} MB` : "—"}</dd></div>
      </dl>
      {!query.isError && <AgentGpu agent={agent} now={now}/>}
      {!query.isError && <AgentQuickActions key={`${auth.userId}:${agent.deviceId}`} agent={agent} now={now} preview={preview}/>}
    </>
  </section>;
}
