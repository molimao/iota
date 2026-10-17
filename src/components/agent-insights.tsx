import { agentPhase, agentEvents, agentCommandStatus } from '@/lib/agent-insights';
import type { AgentInfo } from '@/lib/device-agent';
import { useLocale } from './site/locale';
import { insightCopy as c } from './agent-insight-copy';
import { LANGUAGE_TAG } from '@/lib/site';
import { agentCopy } from './device-agent-copy';
export function AgentStatus({agent, now, compact = false, concise = false}: {agent: AgentInfo; now?: number; compact?: boolean; concise?: boolean}) {
  const {locale}=useLocale(); const phase=agentPhase(agent, now);
  return <div className="agent-insight" data-phase={phase}>
    <strong>{c[phase][locale]}{phase==='queued' ? ` · #${agent.snapshot.queue?.position}` : ''}</strong>
    {!compact && <>{!concise && <p>{c[`${phase}Help`][locale]}</p>}<a href={`/${locale}/learn/${phase === 'queued' ? 'iota-queue-and-zero-throughput' : 'mac-status-and-restart'}`}>{c[phase === 'queued' ? 'queueHelpLink' : ['running','working','waiting','uploading','merging'].includes(phase) ? 'runningHelpLink' : 'help'][locale]} ↗</a></>}
  </div>;
}
export function AgentCommandResult({agent}: {agent:AgentInfo}) {
  const {locale}=useLocale(); const status=agentCommandStatus(agent);
  if (!status) return null;
  const text=({queued:c.queuedCommand, claimed:c.claimedCommand, done:c.doneCommand, failed:c.failedCommand, expired:c.expiredCommand} as const)[status as 'queued'|'claimed'|'done'|'failed'|'expired'];
  const cmd=agent.pending ?? agent.latestCommand;
  const action=cmd?.action;
  return <p className="agent-command-result" role="status">{action && action in agentCopy ? agentCopy[action as keyof typeof agentCopy][locale] : ''} · {text?.[locale] ?? c.unknown[locale]}{!agent.pending && agent.latestCommand && <time className="agent-command-time" dateTime={agent.latestCommand.createdAt}>{new Date(agent.latestCommand.createdAt).toLocaleString(LANGUAGE_TAG[locale])}</time>}</p>;
}
export function AgentTimeline({logs}: {logs?:string | undefined}) {
  const {locale}=useLocale();const events=agentEvents(logs);
  return <div className="agent-event-block"><h3>{c.timeline[locale]}</h3>
    {events.length ? <ol className="agent-event-list">{events.map(e=><li key={`${e.time}:${e.kind}:${e.value}`}><time>{e.time}</time><span>{c[e.kind][locale]}{e.value ? ` · ${e.value} tokens/s` : ''}</span></li>)}</ol> : <p>{c.noEvents[locale]}</p>}
    <p className="compute-caption">{c.excerpt[locale]}</p>
    <details><summary>{c.raw[locale]}</summary><pre className="agent-logs">{logs || agentCopy.noLogs[locale]}</pre></details>
  </div>;
}
