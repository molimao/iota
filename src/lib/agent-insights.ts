import { agentOnline, type AgentInfo } from './device-agent';
export type AgentPhase = 'offline' | 'unknown' | 'stopped' | 'workerStopped' | 'queued' | 'running';
export function agentPhase(agent: AgentInfo, now = Date.now()): AgentPhase {
  if (!agentOnline(agent.lastSeen, now)) return 'offline';
  const s = agent.snapshot;
  if (s.appRunning === false) return 'stopped';
  if (s.appRunning !== true) return 'unknown';
  if (s.workerRunning === false) return 'workerStopped';
  if (s.workerRunning !== true) return 'unknown';
  const age = s.queue ? now - Date.parse(s.queue.observedAt) : Infinity;
  if (s.queue && s.queue.position > 0 && age >= 0 && age <= 300000) return 'queued';
  return 'running';
}
export type AgentEventKind = 'shutdown' | 'unregistered' | 'initializing' | 'throughput';
export type AgentEvent = { time: string; kind: AgentEventKind; value?: string };
/** Conservative extraction from the existing opt-in excerpt, not a complete history.
 * Log timestamps have no timezone: preserve their local text instead of inventing UTC. */
export function agentEvents(logs: string | undefined): AgentEvent[] {
  const events: AgentEvent[] = [];
  for (const line of (logs ?? '').slice(-12000).split('\n')) {
    const time = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})(?:\.\d+)?\]/)?.[1];
    if (!time) continue;
    let event: AgentEvent | undefined;
    if (/Miner shutdown complete|Training (?:process )?exited with code=/i.test(line)) event = { time, kind: 'shutdown' };
    else if (/Miner not registered error|EntityNotRegisteredError/.test(line)) event = { time, kind: 'unregistered' };
    else if (/['"](?:status|state)['"]\s*:\s*['"]initializing['"]/.test(line)) event = { time, kind: 'initializing' };
    else {
      const rate = line.match(/\bthroughput\s*[=:]\s*(\d+(?:\.\d+)?)\s*tokens\/s\b/i)?.[1];
      if (rate) event = { time, kind: 'throughput', value: rate };
    }
    if (event && !events.some(e => e.time === event.time && e.kind === event.kind && e.value === event.value)) events.push(event);
  }
  return events.sort((a,b)=>b.time.localeCompare(a.time)).slice(0,8);
}
export function agentCommandStatus(agent: AgentInfo) {
  return (agent.pending ?? agent.latestCommand)?.status ?? null;
}
