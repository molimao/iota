import {describe,it,expect} from 'vitest';
import {agentSnapshot,agentPhase} from './device-agent';
const now=Date.now(), stamp=new Date(now).toISOString();
const base={platform:'linux',monitorOnly:true,appRunning:true,workerRunning:true,appCpu:1,processMemoryMb:746,load:null,version:'1.0.13',recovery:'paused',queue:{position:2841,observedAt:stamp},gpus:[{index:0,name:'RTX 4060',utilization:100,memoryUsedMb:202,memoryTotalMb:8188,temperature:53,powerWatts:5.24,observedAt:stamp}]};
describe('Linux GPU monitoring',()=>{
 it('accepts bounded GPU data and keeps queue despite another miner using GPU',()=>{const snapshot=agentSnapshot.parse(base);expect(agentPhase({snapshot,lastSeen:stamp},now)).toBe('queued');});
 it('rejects malformed GPU metrics',()=>{expect(agentSnapshot.safeParse({...base,gpus:[{...base.gpus[0],utilization:101}]}).success).toBe(false);});
 it('expires queue evidence without inventing training',()=>{const snapshot=agentSnapshot.parse({...base,queue:{position:1,observedAt:new Date(now-301000).toISOString()}});expect(agentPhase({snapshot,lastSeen:stamp},now)).toBe('running');});
 it('shows explicit recent training work',()=>{const snapshot=agentSnapshot.parse({...base,queue:null,trainingState:{phase:'training',status:'forward',observedAt:stamp}});expect(agentPhase({snapshot,lastSeen:stamp},now)).toBe('working');});
 it('keeps existing Mac payload compatible',()=>{expect(agentSnapshot.safeParse({appRunning:true,workerRunning:true,appCpu:1,processMemoryMb:100,load:1,version:'1.0.13'}).success).toBe(true);});
});
