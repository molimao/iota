import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { linkBntWorkerAgent, linkPrlWorkerAgent } from "@/lib/device-agent.functions";
import { poolWorkerAgentBinding } from "@/lib/bnt-worker-agent";
import { agentOnline } from "@/lib/device-agent";
import type { PoolProvider } from "@/lib/pool-projects";
import type { FleetDevice } from "@/lib/fleet";
import { localized } from "@/lib/product-discovery";
import { ProjectAgentConnectView } from "./project-agent-connect";
import { ProjectMinerSlots } from "./device-miner-summary";
import { useLocale } from "./site/locale";

const labels = {
  missing: localized([
    "此 Worker 尚未关联电脑",
    "此 Worker 尚未關聯電腦",
    "This Worker is not linked to a computer",
    "이 Worker에 연결된 컴퓨터가 없습니다",
    "この Worker はコンピューターに未接続です",
  ]),
  install: localized([
    "在“我的设备”连接",
    "在「我的設備」連接",
    "Connect in My devices",
    "내 기기에서 연결",
    "マイデバイスで接続",
  ]),
  quota: localized([
    "已达到本项目的设备名额，请查看套餐。",
    "已達到此專案的裝置名額，請查看方案。",
    "Project device limit reached. Check your plan.",
    "프로젝트 기기 한도에 도달했습니다. 요금제를 확인하세요.",
    "このプロジェクトの端末上限です。プランをご確認ください。",
  ]),
  online: localized([
    "在线",
    "在線",
    "Online",
    "온라인",
    "オンライン",
  ]),
  offline: localized([
    "离线",
    "離線",
    "Offline",
    "오프라인",
    "オフライン",
  ]),
};
export function PoolWorkerAgent({
  project = "bnt",
  pool,
  address,
  worker,
  sourceBindingId,
  devices,
  onLinked,
}: {
  project?: "bnt" | "prl";
  pool?: PoolProvider | undefined;
  address: string;
  worker: string;
  sourceBindingId: string;
  devices: FleetDevice[];
  onLinked: () => Promise<unknown>;
}) {
  const link = poolWorkerAgentBinding(devices, project, address, worker, pool);
  const matched = useMatchedDeviceAgent(link?.device.id ?? "unlinked-worker"),
    now = useAgentClock(),
    { locale } = useLocale(),
    send = useServerFn(project === "prl" ? linkPrlWorkerAgent : linkBntWorkerAgent);
  const [selected, setSelected] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false),
    [quota, setQuota] = useState(false);
  const lock = useRef(false);
  const choices = (matched.query.data ?? []).filter((a) =>
    devices.some((d) => d.id === a.deviceId),
  );
  if (!worker || !matched.enabled) return null;
  async function submit() {
    if (lock.current || !choices.some((a) => a.deviceId === selected)) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    setQuota(false);
    try {
      await send({ data: { bindingId: sourceBindingId, worker, deviceId: selected } });
      await onLinked();
      setSelected("");
    } catch (e) {
      setQuota(e instanceof Error && e.message.includes("project_device_limit_reached"));
      setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="bnt-worker-agent" aria-label={`Worker ${worker} ${copy.computer[locale]}`}>
      {link ? (
        <>
          <strong className="bnt-worker-computer">
            {link.device.name}
            {matched.agent && (
              <small data-online={agentOnline(matched.agent.lastSeen, now)}>
                {agentOnline(matched.agent.lastSeen, now)
                  ? copy.online[locale]
                  : copy.offline[locale]}
              </small>
            )}
          </strong>
          <ProjectMinerSlots
            agent={matched.agent}
            bindings={[link.binding]}
            now={now}
            locale={locale}
            loading={matched.query.isPending}
            error={matched.query.isError}
          />
          {!matched.query.isPending && !matched.agent && (
            <p className="compute-caption">{copy.noData[locale]}</p>
          )}
        </>
      ) : (
        <p className="compute-caption">{labels.missing[locale]}</p>
      )}
      {choices.length > 0 && (
        <ProjectAgentConnectView
          locale={locale}
          worker={worker}
          choices={choices.map((a) => ({
            id: a.deviceId,
            name: devices.find((d) => d.id === a.deviceId)!.name,
          }))}
          connected={!!link && !!matched.agent}
          selected={selected}
          busy={busy}
          error={error && !quota}
          onSelect={setSelected}
          onSubmit={() => void submit()}
        />
      )}
      {quota && (
        <p role="alert">
          {labels.quota[locale]} <a href={`/${locale}/devices?view=membership`}>Pro ↗</a>
        </p>
      )}
      {!choices.length && (
        <a className="bnt-worker-install" href={`/${locale}/machines`}>
          {labels.install[locale]} ↗
        </a>
      )}
    </section>
  );
}

export const BntWorkerAgent = PoolWorkerAgent;
const copy = {
  computer: localized(["对应电脑", "對應電腦", "computer", "대응 컴퓨터", "対応コンピューター"]),
  online: localized(["电脑在线", "電腦在線", "Computer online", "컴퓨터 온라인", "コンピューター接続中"]),
  offline: localized(["电脑离线", "電腦離線", "Computer offline", "컴퓨터 오프라인", "コンピューター未接続"]),
  noData: localized([
    "这台电脑还没有连接数据。",
    "這台電腦尚無連接資料。",
    "This computer has not reported data yet.",
    "이 컴퓨터의 연결 데이터가 아직 없습니다.",
    "このコンピューターはまだデータを送信していません。",
  ]),
};
