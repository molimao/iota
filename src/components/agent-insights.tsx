import { useAgentClock } from "@/hooks/use-agent-clock";
import { agentEvents, agentCommandStatus } from '@/lib/agent-insights';
import { agentDisplayPhase, agentOnline, type OfficialTrainingEvidence, type AgentInfo } from '@/lib/device-agent';
import { useLocale } from './site/locale';
import { insightCopy as c } from './agent-insight-copy';
import { LANGUAGE_TAG } from '@/lib/site';
import { agentCopy } from './device-agent-copy';
export function AgentStatus({agent, official, now, compact = false, concise = false}: {agent: AgentInfo; official?: OfficialTrainingEvidence | undefined; now?: number; compact?: boolean; concise?: boolean}) {
  const clock=useAgentClock();
  const {locale}=useLocale(); const phase=agentDisplayPhase(agent, official, now ?? clock);
  return <div className="agent-insight" data-phase={phase}>
    <strong>{compact ? (agentOnline(agent.lastSeen, now ?? clock) ? agentCopy.live[locale] : c.offline[locale]) : c[phase][locale]}{phase==='queued' ? ` · #${agent.snapshot.queue?.position}` : ''}</strong>
    {!compact && phase === 'queued' && <a href={`/${locale}/learn/iota-queue-and-zero-throughput`}>{c.queueHelpLink[locale]} ↗</a>}
  </div>;
}
export function AgentCommandResult({agent}: {agent:AgentInfo}) {
  const {locale}=useLocale(); const status=agentCommandStatus(agent);
  if (!status) return null;
  if (!agent.pending && status === "done") return null;
  const text=agentCopy[status === "queued" ? "pending" : status === "claimed" ? "claimed" : status === "done" ? "done" : status === "failed" ? "failed" : "expired"];
  const cmd=agent.pending ?? agent.latestCommand;
  const action=cmd?.action;
  return <p className="agent-command-result" role="status">{action && action in agentCopy ? agentCopy[action as keyof typeof agentCopy][locale] : ''} · {text[locale]}{!agent.pending && agent.latestCommand && <time className="agent-command-time" dateTime={agent.latestCommand.createdAt}>{new Date(agent.latestCommand.createdAt).toLocaleString(LANGUAGE_TAG[locale])}</time>}</p>;
}
