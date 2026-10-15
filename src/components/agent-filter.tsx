import { AGENT_FILTERS, type AgentFilter } from "@/lib/device-agent";
import { localized as l } from "@/lib/product-discovery";
import { useLocale } from "./site/locale";
export const agentFilterCopy = {
  search: l(["搜索名称或 Miner ID", "搜尋名稱或 Miner ID", "Search name or Miner ID", "이름 또는 Miner ID 검색", "名前・Miner IDで検索"]),
  label: l(["Mac 状态", "Mac 狀態", "Mac status", "Mac 상태", "Macの状態"]),
  all: l(["全部状态", "全部狀態", "All states", "모든 상태", "すべての状態"]),
  online: l(["在线", "在線", "Online", "온라인", "オンライン"]),
  training: l(["进程运行", "程序執行", "Process running", "프로세스 실행", "プロセス実行中"]),
  queued: l(["排队中", "排隊中", "Queued", "대기 중", "待機中"]),
  stopped: l(["应用已停止", "應用已停止", "App stopped", "앱 중지됨", "アプリ停止中"]),
  offline: l(["未上报", "未回報", "No heartbeat", "보고 없음", "報告なし"]),
  unpaired: l(["未配对", "未配對", "Not paired", "연결되지 않음", "未接続"]),
  empty: l(["没有符合条件的设备", "沒有符合條件的設備", "No matching devices", "일치하는 기기 없음", "一致する端末がありません"]),
};
export function AgentFilterSelect({value,onChange,unpaired=true}: {value:AgentFilter;onChange:(v:AgentFilter)=>void;unpaired?:boolean}) {
  const {locale}=useLocale();
  return <label className="agent-filter-label"><span>{agentFilterCopy.label[locale]}</span><select value={value} onChange={e=>onChange(e.target.value as AgentFilter)}>{AGENT_FILTERS.filter(k=>unpaired||k!=="unpaired").map(k=><option key={k} value={k}>{agentFilterCopy[k][locale]}</option>)}</select></label>;
}
