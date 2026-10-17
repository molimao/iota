import { agentPhase, type AgentHistoryPoint } from "./device-agent";
export function historicalPhase(point: AgentHistoryPoint) {
  return agentPhase({snapshot:point.snapshot,lastSeen:point.sampledAt},Date.parse(point.sampledAt));
}
/** Missing observations break the curve. Never connect across a ten-minute gap. */
export function queueSegments(points: AgentHistoryPoint[], now=Date.now()) {
  const segments: Array<Array<{time:number;position:number}>>=[];
  let current: Array<{time:number;position:number}>=[];
  for(const point of [...points].sort((a,b)=>a.sampledAt.localeCompare(b.sampledAt))) {
    const time=Date.parse(point.sampledAt);
    if(!Number.isFinite(time)||time>now||now-time>86400000) continue;
    const position=historicalPhase(point)==="queued" ? point.snapshot.queue?.position : null;
    if(position==null || (current.length && time-current[current.length-1]!.time>600000)) {
      if(current.length) segments.push(current);
      current=[];
    }
    if(position!=null) current.push({time,position});
  }
  if(current.length) segments.push(current);
  return segments;
}
