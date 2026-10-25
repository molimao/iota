import type { PlatformNode } from "@/lib/platforms";
import { LANGUAGE_TAG } from "@/lib/site";
import { useLocale } from "./site/locale";
import "./acurast-processors.css";
const words = {
  zh: { manager: "管理地址", processor: "处理器", list: "关联设备", last: "最近链上心跳", active: "心跳正常", inactive: "心跳较早", unknown: "尚无心跳记录", note: "读取 Acurast 主网已确认记录；心跳按官方 Hub 的 31 分钟窗口判断，不代表当前正在执行任务。收益数据暂未提供。", partial: "列表尚未完整读取，仅展示已取得的设备。" },
  "zh-TW": { manager: "管理地址", processor: "處理器", list: "關聯裝置", last: "最近鏈上心跳", active: "心跳正常", inactive: "心跳較早", unknown: "尚無心跳紀錄", note: "讀取 Acurast 主網已確認紀錄；依官方 Hub 的 31 分鐘視窗判斷心跳，不代表正在執行任務。暫無收益資料。", partial: "清單尚未完整讀取，僅顯示已取得的裝置。" },
  en: { manager: "Manager address", processor: "Processor", list: "Linked processors", last: "Last on-chain heartbeat", active: "Recent heartbeat", inactive: "Older heartbeat", unknown: "No heartbeat recorded", note: "Finalized Acurast mainnet records. Heartbeats use the official Hub’s 31-minute window and do not prove active job execution. Earnings are unavailable.", partial: "The list is incomplete; only retrieved processors are shown." },
  ja: { manager: "管理アドレス", processor: "プロセッサ", list: "関連デバイス", last: "最新のオンチェーンハートビート", active: "ハートビート確認", inactive: "過去のハートビート", unknown: "記録なし", note: "Acurastメインネットの確定記録です。公式Hubと同じ31分の基準で判定し、ジョブ実行を保証しません。収益情報は未提供です。", partial: "一覧は未完了です。取得済みの機器のみ表示します。" },
  ko: { manager: "관리 주소", processor: "프로세서", list: "연결된 기기", last: "최근 온체인 하트비트", active: "최근 하트비트", inactive: "오래된 하트비트", unknown: "기록 없음", note: "Acurast 메인넷의 확정 기록입니다. 공식 Hub와 같은 31분 기준이며 작업 실행을 보장하지 않습니다. 수익 정보는 제공되지 않습니다.", partial: "목록이 불완전하며 조회된 기기만 표시됩니다." },
};
export function AcurastProcessors({ data }: { data: NonNullable<PlatformNode["acurast"]> }) {
  const { locale } = useLocale(), c = words[locale];
  return <section className="acurast-processors">
    <h3>{data.role === "manager" ? c.manager : c.processor} · {c.list} {data.processors.length}</h3>
    <p className="compute-caption">{c.note}</p>
    {!data.complete && <p role="status">{c.partial}</p>}
    <div className="acurast-processor-grid">{data.processors.map((p) => <article key={p.id}>
      <span className={`badge ${p.online === true ? "success" : p.online === false ? "warning" : ""}`}>{p.online === true ? c.active : p.online === false ? c.inactive : c.unknown}</span>
      <code>{p.id}</code>
      <span>{c.last}</span>
      <strong>{p.lastSeen === null ? "—" : new Date(p.lastSeen).toLocaleString(LANGUAGE_TAG[locale])}</strong>
    </article>)}</div>
  </section>;
}
