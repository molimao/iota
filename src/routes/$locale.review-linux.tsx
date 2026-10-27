import {createFileRoute,notFound} from '@tanstack/react-router';
import {DeviceAgentSummary} from '@/components/device-agent-summary';
import type {AgentInfo} from '@/lib/device-agent';
import {useAgentClock} from '@/hooks/use-agent-clock';
export const Route=createFileRoute('/$locale/review-linux')({beforeLoad:()=>{if(!import.meta.env.DEV)throw notFound();},head:()=>({meta:[{name:'robots',content:'noindex,nofollow'}]}),component:Review});
function Review(){
 const now=useAgentClock(),stamp=new Date(now).toISOString();
 const agent:AgentInfo={deviceId:'9adaf14b-f6e1-4d92-a862-7f383c464e54',lastSeen:stamp,logsEnabled:false,recoveryEnabled:false,pending:null,latestCommand:null,snapshot:{platform:'linux',monitorOnly:true,version:'1.0.13',appRunning:true,workerRunning:true,appCpu:0.4938,processMemoryMb:746.12,load:null,recovery:'paused',queue:{position:2462,observedAt:stamp},gpus:[{index:0,name:'NVIDIA GeForce RTX 4060 Laptop GPU',utilization:100,memoryUsedMb:417,memoryTotalMb:8188,temperature:82,powerWatts:79.82,observedAt:stamp}]}};
 return <main className="projects-page"><header className="project-heading"><div><h1>雷神 · Linux GPU</h1><p>本地布局验收 · 10月27日10:33实测快照，非实时数据</p></div></header><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>{['项目卡片 · IOTA','设备卡片 · 雷神'].map(title=><article className="compute-panel" key={title}><h2>{title}</h2><DeviceAgentSummary preview previewAgent={agent} deviceId={agent.deviceId}/></article>)}</div><section className="compute-panel"><h2>列表 · 雷神</h2><DeviceAgentSummary preview compact previewAgent={agent} deviceId={agent.deviceId}/></section></main>;
}
