import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { getAgentHistory } from "@/lib/device-agent.functions";
import { historicalPhase, queueSegments } from "@/lib/agent-history";
import type { AgentHistoryPoint } from "@/lib/device-agent";
import { LANGUAGE_TAG } from "@/lib/site";
import { localized as l } from "@/lib/product-discovery";
import { useLocale } from "./site/locale";
import { insightCopy } from "./agent-insight-copy";
const copy={
  title:l(["运行记录 · 24 小时","執行紀錄 · 24 小時","Activity · 24 hours","활동 기록 · 24시간","稼働記録・24時間"]),
  queue:l(["排队名次记录","排隊名次紀錄","Recorded queue positions","대기 순번 기록","待機順位の記録"]),
  note:l(["每 5 分钟保留一次采样。断线不补零，阶段不代表已确认收益。","每 5 分鐘保留一次採樣。斷線不補零，階段不代表已確認收益。","One sample per 5 minutes. Gaps stay missing; phases do not confirm rewards.","5분당 1회 샘플입니다. 누락은 0으로 채우지 않으며 단계는 보상 확정을 뜻하지 않습니다.","5分ごとに1回記録。欠測はゼロで補わず、段階は報酬確定を意味しません。"]),
  empty:l(["尚无运行记录，连接后的心跳会逐步积累。","尚無執行紀錄，連接後的心跳會逐步累積。","No activity recorded yet. Connected heartbeats will build this history.","아직 기록이 없습니다. 연결 후 상태 보고가 쌓입니다.","まだ記録がありません。接続後の応答から蓄積されます。"]),
  error:l(["暂时无法读取记录，请稍后重试。","暫時無法讀取紀錄，請稍後重試。","History is unavailable. Try again shortly.","기록을 읽지 못했습니다. 잠시 후 다시 시도하세요.","記録を取得できません。しばらくして再度お試しください。"]),
  loading:l(["正在读取记录…","正在讀取紀錄…","Loading history…","기록 읽는 중…","記録を読み込み中…"]),
};
export function AgentHistory({deviceId,preview=false}:{deviceId:string;preview?:boolean}) {
  const [open,setOpen]=useState(false); const auth=useAuth(); const {locale}=useLocale();
  const read=useServerFn(getAgentHistory);
  const query=useQuery({queryKey:["agent-history",auth.userId,deviceId],queryFn:()=>read({data:{deviceId}}),enabled:open&&!preview&&!!auth.userId,refetchInterval:open?60000:false,retry:false});
  const now=Date.now();
  const points:AgentHistoryPoint[]=preview ? [...[480,420,350].map((position,i)=>{
    const sampledAt=new Date(now-(30-i*5)*60000).toISOString();
    return {sampledAt,snapshot:{appRunning:true,workerRunning:true,queue:{position,observedAt:sampledAt}}};
  }),{sampledAt:new Date(now).toISOString(),snapshot:{appRunning:true,workerRunning:true,queue:null,trainingState:{phase:"training",status:"forward",observedAt:new Date(now).toISOString()}}}] : query.data??[];
  const segments=queueSegments(points,now); const all=segments.flat();
  const first=all[0]?.time??now-86400000, last=all.at(-1)?.time??now;
  const low=Math.min(...all.map(p=>p.position)),high=Math.max(...all.map(p=>p.position));
  const x=(time:number)=>20+(time-first)/Math.max(1,last-first)*560;
  const y=(position:number)=>15+(high-position)/Math.max(1,high-low)*80;
  const time=(v:string)=>new Date(v).toLocaleTimeString(LANGUAGE_TAG[locale],{hour:"2-digit",minute:"2-digit"});
  return <details className="agent-history" onToggle={e=>setOpen(e.currentTarget.open)}>
    <summary>{copy.title[locale]}</summary>
    {open&&<>
      {query.isError ? <p role="status">{copy.error[locale]}</p> : !preview&&query.isPending ? <p role="status">{copy.loading[locale]}</p> : !points.length ? <p>{copy.empty[locale]}</p> : <>
        {all.length>0&&<figure><figcaption>{copy.queue[locale]} · #{all[0]!.position} → #{all.at(-1)!.position}</figcaption>
          <svg viewBox="0 0 600 110" role="img" aria-label={copy.queue[locale]}>{segments.map((segment,i)=><g key={i}>
            {segment.length>1&&<polyline points={segment.map(p=>`${x(p.time)},${y(p.position)}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="2"/>}
            {segment.map(p=><circle key={p.time} cx={x(p.time)} cy={y(p.position)} r="3"><title>{time(new Date(p.time).toISOString())} · #{p.position}</title></circle>)}
          </g>)}</svg>
          <div className="agent-history-axis"><time>{time(new Date(first).toISOString())}</time><time>{time(new Date(last).toISOString())}</time></div>
        </figure>}
        <ol>{points.slice(-8).reverse().map(point=><li key={point.sampledAt}><time dateTime={point.sampledAt}>{time(point.sampledAt)}</time><span>{insightCopy[historicalPhase(point)][locale]}{historicalPhase(point)==="queued"?` · #${point.snapshot.queue?.position}`:""}</span></li>)}</ol>
      </>}
      <p className="compute-caption">{copy.note[locale]}</p>
    </>}
  </details>;
}
