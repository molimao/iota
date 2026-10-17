import { it, expect } from "vitest";
import { historicalPhase, queueSegments } from "./agent-history";
import { agentPhase, type AgentHistoryPoint } from "./device-agent";
const now=Date.parse("2026-10-17T12:00:00Z");
function point(minutes:number,position:number|null):AgentHistoryPoint {
  const sampledAt=new Date(now-minutes*60000).toISOString();
  return {sampledAt,snapshot:{appRunning:true,workerRunning:true,queue:position===null?null:{position,observedAt:sampledAt}}};
}
it("keeps gaps and non-queue periods out of the queue curve instead of inventing zeroes",()=>{
  const segments=queueSegments([point(60,9),point(55,8),point(50,null),point(45,7),point(20,3),point(0,null),point(-1,1)],now);
  expect(segments.map(s=>s.map(p=>p.position))).toEqual([[9,8],[7],[3]]);
  expect(historicalPhase(point(60,9))).toBe("queued");
  expect(queueSegments([point(1441,10)],now)).toEqual([]);
});
it("separates non-working miner states from run phases and respects newer observations",()=>{
  const base={lastSeen:new Date(now).toISOString(),snapshot:{appRunning:true,workerRunning:true}};
  const observedAt=new Date(now-1000).toISOString();
  const cases=[
    ["training","forward","working"], ["training","backward","working"], ["training","idle","running"],
    ["weights_uploading","idle","uploading"], ["merging_partitions","idle","merging"],
    ["training","initializing","preparing"], ["weights_uploading","frozen","preparing"], ["training","kicked","blocked"],
  ] as const;
  for(const [phase,status,expected] of cases){
    const a={...base,snapshot:{...base.snapshot,trainingState:{phase,status,observedAt}}};
    expect(agentPhase(a,now)).toBe(expected);
    expect(agentPhase({...a,snapshot:{...a.snapshot,queue:{position:5,observedAt:new Date(now-2000).toISOString()}}},now)).toBe(expected);
    expect(agentPhase({...a,snapshot:{...a.snapshot,queue:{position:5,observedAt:new Date(now).toISOString()}}},now)).toBe("queued");
    for(const age of [-1000,300001]) expect(agentPhase({...a,snapshot:{...a.snapshot,trainingState:{phase,status,observedAt:new Date(now-age).toISOString()}}},now)).toBe("running");
  }
});
