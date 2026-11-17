import { expect, it } from 'vitest';
import { agentDisplayPhase, agentPhase, currentAgentReason } from './device-agent';
import { agentReasonSchema, agentReasonCopy } from './agent-reason';

it('uses recent reasons without overriding newer training or queue evidence',()=>{
  const now=Date.now(), at=(seconds:number)=>new Date(now+seconds*1000).toISOString();
  const agent={lastSeen:at(0),snapshot:{appRunning:true,workerRunning:true,reason:{code:'registration_failed' as const,observedAt:at(-30)}}};
  expect(currentAgentReason(agent,now)?.code).toBe('registration_failed');
  expect(agentPhase(agent,now)).toBe('blocked');
  expect(agentPhase({...agent,snapshot:{...agent.snapshot,queue:{position:2,observedAt:at(-10)}}},now)).toBe('queued');
  expect(currentAgentReason({...agent,lastSeen:at(-100)},now)).toBeNull();
  expect(currentAgentReason({...agent,snapshot:{...agent.snapshot,reason:{code:'kicked',observedAt:at(-301)}}},now)).toBeNull();
  expect(currentAgentReason({...agent,snapshot:{...agent.snapshot,reason:{code:'kicked',observedAt:at(1)}}},now)).toBeNull();
  expect(()=>agentReasonSchema.parse({code:'custom',observedAt:at(0)})).toThrow();
  expect(()=>agentReasonSchema.parse({code:'kicked',observedAt:at(0),message:'private'})).toThrow();
  for(const code of agentReasonSchema.shape.code.options) {
    for (const label of Object.values(agentReasonCopy[code])) expect(label.length).toBeGreaterThan(0);
  }
});

it('treats an unregistered running miner as waiting rather than interrupted',()=>{
  const now=Date.now(), at=(seconds:number)=>new Date(now+seconds*1000).toISOString();
  const agent={lastSeen:at(0),snapshot:{appRunning:true,workerRunning:true,reason:{code:'registration_expired' as const,observedAt:at(-30)}}};
  expect(agentDisplayPhase(agent,{status:'not_found',fetchedAt:now},now)).toBe('preparing');
  expect(agentReasonCopy.registration_expired.zh).toBe('等待重新注册');
  expect(agentPhase({...agent,snapshot:{...agent.snapshot,queue:{position:210,observedAt:at(-10)}}},now)).toBe('queued');
  expect(agentPhase({...agent,snapshot:{...agent.snapshot,trainingState:{phase:'training',status:'forward',observedAt:at(-10)}}},now)).toBe('working');
  expect(agentPhase({...agent,snapshot:{...agent.snapshot,workerRunning:false}},now)).toBe('workerStopped');
  expect(agentPhase({...agent,lastSeen:at(-100)},now)).toBe('offline');
  expect(agentPhase({...agent,snapshot:{...agent.snapshot,reason:{code:'kicked',observedAt:at(-30)}}},now)).toBe('blocked');
});
