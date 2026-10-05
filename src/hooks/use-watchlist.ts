import { useCallback, useMemo, useState } from "react";
import { useFleet } from "./use-fleet";
import { useLocale } from "@/components/site/locale";
import { fleetCopy } from "@/components/fleet-copy";
import { importDevices, serializeExport, type ImportReport } from "@/lib/watchlist";
import { isValidMinerId } from "@/lib/ss58";
import { projectDeviceCount } from "@/lib/fleet";

export type WatchlistResult = {ok:boolean;error?:string};
export function useWatchlist(userId:string|null,authReady=true) {
  const fleet=useFleet(userId,authReady),{locale}=useLocale(),c=fleetCopy(locale);
  const [error,setError]=useState<string|null>(null);
  const devices=useMemo(()=>fleet.devices.flatMap(d=>d.bindings.filter(b=>b.project==="iota").map(b=>({hotkey:b.identifier,label:d.name,addedAt:d.createdAt}))),[fleet.devices]);
  const projectCount=projectDeviceCount(fleet.devices,"iota");
  const add=useCallback(async(input:{hotkey:string;label:string}):Promise<WatchlistResult>=>{
    if(!isValidMinerId(input.hotkey.trim())) return {ok:false,error:c.identifier};
    if(projectCount>=fleet.limit) return {ok:false,error:c.limit};
    try {await fleet.mutate({action:"create",payload:{name:input.label,hardware:"",binding:{project:"iota",identifier:input.hotkey.trim(),worker:""}}});return {ok:true};}
    catch {return {ok:false,error:c.unavailable};}
  },[fleet,projectCount,c]);
  const rename=useCallback(async(hotkey:string,label:string):Promise<WatchlistResult>=>{
    const device=fleet.devices.find(d=>d.bindings.some(b=>b.project==="iota"&&b.identifier===hotkey));
    if(!device) return {ok:false,error:c.unavailable};
    try {await fleet.mutate({action:"rename",payload:{id:device.id,name:label,hardware:device.hardware}});return {ok:true};}
    catch {return {ok:false,error:c.unavailable};}
  },[fleet,c]);
  const remove=useCallback(async(hotkey:string):Promise<WatchlistResult>=>{
    const device=fleet.devices.find(d=>d.bindings.some(b=>b.project==="iota"&&b.identifier===hotkey));
    const binding=device?.bindings.find(b=>b.project==="iota"&&b.identifier===hotkey);
    if(!device||!binding) return {ok:false,error:c.unavailable};
    try {await fleet.mutate(device.bindings.length===1?{action:"remove",payload:{id:device.id}}:{action:"unlink",payload:{id:device.id,bindingId:binding.id}});return {ok:true};}
    catch {return {ok:false,error:c.unavailable};}
  },[fleet,c]);
  const importJson=useCallback(async(raw:string):Promise<{ok:boolean;error?:string;report?:ImportReport}>=>{
    const result=importDevices(devices,raw);
    if(!result.ok) return result;
    let added=0,invalid=result.value.invalid;
    for(const entry of result.value.devices.filter(d=>!devices.some(e=>e.hotkey===d.hotkey))) {
      const outcome=await add(entry);
      if(outcome.ok) added++;else invalid++;
    }
    setError(invalid?c.limit:null);
    return {ok:true,report:{devices:[],added,duplicates:result.value.duplicates,invalid}};
  },[devices,add,c]);
  return {devices,projectCount,loaded:fleet.ready,storageError:error??(fleet.error?c.unavailable:null),
    syncMessage:fleet.pendingLocal?c.importLocal:null,clearSyncMessage:()=>setError(null),cloud:!!userId,
    limit:fleet.limit,limitMessage:c.limit,add,rename,remove,importJson,exportJson:()=>serializeExport(devices)};
}
