import { expect, it } from 'vitest';
import { agentPhase, currentAgentReason } from './device-agent';
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
