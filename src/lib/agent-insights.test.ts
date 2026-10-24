import { it, expect } from 'vitest';
import { agentPhase, agentEvents, agentCommandStatus } from './agent-insights';
import type { AgentInfo } from './device-agent';
import { LOCALES } from './site';
import { insightCopy } from '../components/agent-insight-copy';
import { macStatusGuide } from '../components/site/mac-status-guide';
const now=Date.parse('2026-10-15T08:00:00Z');
const agent:AgentInfo={deviceId:'a',lastSeen:new Date(now).toISOString(),snapshot:{appRunning:true,workerRunning:true},logsEnabled:false,recoveryEnabled:false,pending:null,latestCommand:null};
it('never treats a running process or missing queue as proof of training',()=>{
 expect(agentPhase(agent,now)).toBe('running');
 const q={position:235,observedAt:new Date(now-1000).toISOString()};
 expect(agentPhase({...agent,snapshot:{...agent.snapshot,queue:q}},now)).toBe('queued');
 for(const age of [-1000,300001]) expect(agentPhase({...agent,snapshot:{...agent.snapshot,queue:{...q,observedAt:new Date(now-age).toISOString()}}},now)).toBe('running');
 expect(agentPhase({...agent,lastSeen:new Date(now-90001).toISOString()},now)).toBe('offline');
 expect(agentPhase({...agent,snapshot:{appRunning:false,workerRunning:true}},now)).toBe('running');
 expect(agentPhase({...agent,snapshot:{appRunning:true,workerRunning:false}},now)).toBe('workerStopped');
 expect(agentPhase({...agent,snapshot:{}},now)).toBe('unknown');
});
it('extracts explicit timestamped events, removes duplicates, preserves local timestamps, ignores vague errors',()=>{
 const line='[2026-10-15 15:08:50.621] ERROR Miner not registered error';
 const events=agentEvents([line,line,'[2026-10-15 15:09:00.100] Training exited with code=1','[2026-10-15 15:10:00.000] throughput=24.8 tokens/s','[2026-10-15 15:11:00.000] random error token=secret','training started'].join('\n'));
 expect(events).toEqual([{time:'2026-10-15 15:10:00',kind:'throughput',value:'24.8'},{time:'2026-10-15 15:09:00',kind:'shutdown'},{time:'2026-10-15 15:08:50',kind:'unregistered'}]);
 expect(JSON.stringify(events)).not.toContain('secret');
 expect(agentEvents(undefined)).toEqual([]);
});
it('does not let an old command obscure the pending action',()=>{
 expect(agentCommandStatus({...agent,pending:{id:'new',action:'restart',status:'claimed'},latestCommand:{action:'stop',status:'failed',createdAt:''}})).toBe('claimed');
 expect(agentCommandStatus(agent)).toBeNull();
});
it('includes status advice and the troubleshooting page in every supported language',()=>{
 for(const locale of LOCALES){
  for(const entry of Object.values(insightCopy)) expect(entry[locale].length).toBeGreaterThan(0);
  expect(macStatusGuide.body[locale].length).toBeGreaterThan(10);
  expect(macStatusGuide.title[locale]).toBeTruthy();
 }
});
