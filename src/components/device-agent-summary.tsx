import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { getFleet } from "@/lib/fleet.functions";
import { getDeviceAgents } from "@/lib/device-agent.functions";
import { agentOnline } from "@/lib/device-agent";
import { useLocale } from "./site/locale";
import { agentCopy } from "./device-agent-copy";

/** Both card views share the account-scoped query with Mac management. */
export function DeviceAgentSummary({ deviceId, miner, preview = false }: { deviceId?: string; miner?: string; preview?: boolean }) {
  const auth = useAuth();
  const { locale } = useLocale();
  const t = Object.fromEntries(Object.entries(agentCopy).map(([key, value]) => [key, value[locale]])) as Record<keyof typeof agentCopy, string>;
  const list = useServerFn(getDeviceAgents);
  const fleet = useServerFn(getFleet);
  const enabled = !preview && auth.ready && !!auth.userId;
  const devices = useQuery({ queryKey: ["fleet", auth.userId], queryFn: () => fleet(), enabled: enabled && !!miner, staleTime: 15000 });
  const query = useQuery({ queryKey: ["device-agents", auth.userId], queryFn: () => list(), enabled, staleTime: 10000, refetchInterval: 15000, refetchOnWindowFocus: true, retry: false });
  const id = deviceId ?? devices.data?.devices.find((d) => d.bindings.some((b) => b.project === "iota" && b.identifier === miner))?.id;
  const agent = enabled ? query.data?.find((a) => a.deviceId === id) : undefined;
  const url = `/${locale}/machines?${deviceId ? `device=${encodeURIComponent(deviceId)}` : `miner=${encodeURIComponent(miner ?? "")}`}`;
  const online = !!agent && !query.isError && agentOnline(agent.lastSeen);
  const s = agent?.snapshot;
  const age = s?.queue ? Date.now() - Date.parse(s.queue.observedAt) : Infinity;
  const queue = online && s?.appRunning && s.workerRunning && age >= 0 && age <= 300000 ? s.queue?.position : undefined;
  if (!agent) return null;
  return <section className="fleet-agent-connect agent-card-summary" aria-label={t.title}>
    <>
      <div className="agent-card-heading"><strong>{query.isError ? t.queueUnknown : online ? t.live : t.offline}</strong><a href={url}>{t.settings} ↗</a></div>
      {online && <span>{s?.appRunning === undefined ? t.queueUnknown : !s.appRunning ? t.stopped : s.workerRunning ? t.training : t.running}</span>}
      <dl className="agent-card-metrics">
        <div><dt>{t.queue}</dt><dd>{queue == null ? "—" : `#${queue}`}</dd></div>
        <div><dt>{t.cpu}</dt><dd>{online && s?.appCpu != null ? `${s.appCpu.toFixed(1)}%` : "—"}</dd></div>
        <div><dt>{t.memory}</dt><dd>{online && s?.processMemoryMb != null ? `${Math.round(s.processMemoryMb)} MB` : "—"}</dd></div>
      </dl>
    </>
  </section>;
}
