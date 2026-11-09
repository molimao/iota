import { useAgentClock } from "@/hooks/use-agent-clock";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { AGENT_RELEASE, AGENT_DOWNLOAD_URL, agentCanUpdate, agentOnline, agentUpdateAvailable, type AgentInfo } from "@/lib/device-agent";
import { deviceAgentCommand } from "@/lib/device-agent.functions";
import { localized as l } from "@/lib/product-discovery";
import { batchCopy } from "./agent-batch-copy";
import { useLocale } from "./site/locale";
const copy={
  available:l(["Agent 有新版","Agent 有新版","Agent update available","Agent 새 버전 있음","Agent の新しいバージョンがあります"]),
  update:l(["更新","更新","Update","업데이트","更新"]),
  confirm:l(["确认更新","確認更新","Confirm update","업데이트 확인","更新を確認"]),
  cancel:l(["取消","取消","Cancel","취소","キャンセル"]),
  queued:l(["等待 Mac 接收更新","等待 Mac 接收更新","Waiting for the Mac to pick up the update","Mac이 업데이트를 받을 때까지 대기 중","Mac が更新を受け取るまで待機中"]),
  installing:l(["正在更新 Agent","正在更新 Agent","Updating the Agent…","Agent 업데이트 중…","Agent を更新中…"]),
  failed:l(["上次更新未确认成功，可重新尝试。","上次更新未確認成功，可重新嘗試。","The previous update was not confirmed. You can retry.","이전 업데이트 완료가 확인되지 않았습니다. 다시 시도할 수 있습니다.","前回の更新完了を確認できませんでした。再試行できます。"]),
  error:l(["更新请求未提交，请重试。","更新請求未提交，請重試。","Update request failed. Please retry.","업데이트 요청 실패. 다시 시도하세요.","更新要求を送信できませんでした。再試行してください。"]),
  offline:l(["设备上线后可更新","設備上線後可更新","Available when the device is online","기기가 온라인일 때 업데이트 가능","端末がオンラインになると更新できます"]),
  download:l(["旧版需下载安装更新","舊版需下載安裝更新","Download to update this older agent","이전 버전은 다운로드 후 설치 필요","旧版はダウンロードして更新"]),
};
export function AgentUpdate({agent,disabled=false,onPreviewUpdate}:{agent:AgentInfo;disabled?:boolean;onPreviewUpdate?:(()=>void)|undefined}) {
  const now=useAgentClock();
  const auth=useAuth(),client=useQueryClient(),send=useServerFn(deviceAgentCommand),{locale}=useLocale();
  const [confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(false);
  useEffect(()=>{setConfirm(false);setError(false);},[auth.userId,agent.deviceId,agent.snapshot.version,agent.pending?.id]);
  const available=agentUpdateAvailable(agent.snapshot.version);
  const pending=agent.pending?.action==="update" ? agent.pending : null;
  if(agent.snapshot.platform === "linux" || agent.snapshot.monitorOnly || (!available&&!pending)) return null;
  const online=agentOnline(agent.lastSeen, now),locked=disabled||busy||!!agent.pending||!online;
  async function update(){
    if(!confirm||locked)return;
    setBusy(true);setError(false);
    try{
      if(onPreviewUpdate)onPreviewUpdate();
      else {await send({data:{deviceId:agent.deviceId,action:"update"}});await client.invalidateQueries({queryKey:["device-agents",auth.userId]});}
      setConfirm(false);
    }catch{setError(true);}finally{setBusy(false);}
  }
  return <div className="agent-update-notice">
    <div className="agent-update-row"><span>{available ? `${copy.available[locale]} · ${agent.snapshot.version} → ${AGENT_RELEASE}` : copy.installing[locale]}</span>
      {!pending&&(agentCanUpdate(agent.snapshot.version)?<button type="button" disabled={locked} onClick={()=>{setError(false);setConfirm(true);}}>{copy.update[locale]}</button>:<a href={AGENT_DOWNLOAD_URL} download>{copy.download[locale]} ↗</a>)}
    </div>
    {pending&&<p role="status">{copy[pending.status==="queued"?"queued":"installing"][locale]}</p>}
    {!online&&!pending&&<p>{copy.offline[locale]}</p>}
    {confirm&&!pending&&<div className="agent-update-confirm"><p>{batchCopy(locale).updateWarning}</p><div>
      <button type="button" disabled={locked} onClick={()=>void update()}>{busy?copy.installing[locale]:copy.confirm[locale]}</button>
      <button type="button" disabled={busy} onClick={()=>setConfirm(false)}>{copy.cancel[locale]}</button>
    </div></div>}
    {!pending&&agent.latestCommand?.action==="update"&&["failed","expired"].includes(agent.latestCommand.status)&&<p>{copy.failed[locale]}</p>}
    {error&&<p role="alert">{copy.error[locale]}</p>}
  </div>;
}
