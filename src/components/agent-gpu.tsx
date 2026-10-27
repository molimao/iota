import type { AgentInfo } from '@/lib/device-agent';
import { localized as l } from '@/lib/product-discovery';
import { useLocale } from './site/locale';
import './agent-gpu.css';
const copy = {
  scope:l(['整机 GPU · 含其他项目占用','整機 GPU · 含其他項目佔用','GPU · includes other projects','GPU · 다른 프로젝트 포함','GPU・他プロジェクトを含む']),
  memory:l(['显存','顯存','VRAM','VRAM','VRAM']),
  unavailable:l(['GPU 数据暂不可用','GPU 資料暫不可用','GPU data unavailable','GPU 데이터 없음','GPUデータ取得不可']),
  readonly:l(['Linux · 只读监控','Linux · 唯讀監控','Linux · monitoring only','Linux · 모니터링 전용','Linux・監視専用']),
};
export function AgentGpu({agent,now,compact=false}:{agent:AgentInfo;now:number;compact?:boolean}) {
  const {locale}=useLocale();
  if(agent.snapshot.platform !== 'linux' && !agent.snapshot.gpus?.length) return null;
  const fresh=agent.lastSeen && now-Date.parse(agent.lastSeen)>=0 && now-Date.parse(agent.lastSeen)<60000;
  const gpus=agent.snapshot.gpus?.filter(g=>now-Date.parse(g.observedAt)>=0&&now-Date.parse(g.observedAt)<60000) ?? [];
  return <div className={`agent-gpu ${compact?'agent-gpu-compact':''}`}>
    <small>{copy.readonly[locale]}</small>
    {!fresh || !gpus.length ? <span>{copy.unavailable[locale]}</span> : <>
      <small>{copy.scope[locale]}</small>
      {gpus.map(g=><div className="agent-gpu-row" key={g.index}>
        <strong title={g.name}>{g.name}</strong>
        <span>GPU {g.utilization == null?'—':`${g.utilization.toFixed(0)}%`}</span>
        <span>{copy.memory[locale]} {g.memoryUsedMb == null?'—':(g.memoryUsedMb/1024).toFixed(1)} / {g.memoryTotalMb == null?'—':(g.memoryTotalMb/1024).toFixed(1)} GB</span>
        <span>{g.temperature == null?'—':`${g.temperature}°C`} · {g.powerWatts == null?'—':`${g.powerWatts.toFixed(1)} W`}</span>
      </div>)}
    </>}
  </div>;
}
