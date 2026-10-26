import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { linkBntWorkerAgent } from "@/lib/device-agent.functions";
import { bntWorkerAgentBinding } from "@/lib/bnt-worker-agent";
import { agentOnline } from "@/lib/device-agent";
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
    "连接新电脑",
    "連接新電腦",
    "Connect a new computer",
    "새 컴퓨터 연결",
    "新しいコンピューターを接続",
  ]),
  quota: localized([
    "已达到本项目的设备名额，请查看套餐。",
    "已達到此專案的裝置名額，請查看方案。",
    "Project device limit reached. Check your plan.",
    "프로젝트 기기 한도에 도달했습니다. 요금제를 확인하세요.",
    "このプロジェクトの端末上限です。プランをご確認ください。",
  ]),
  online: localized([
    "Agent 在线",
    "Agent 在線",
    "Agent online",
    "Agent 온라인",
    "Agent オンライン",
  ]),
  offline: localized([
    "Agent 离线",
    "Agent 離線",
    "Agent offline",
    "Agent 오프라인",
    "Agent オフライン",
  ]),
};
export function BntWorkerAgent({
  address,
  worker,
  sourceBindingId,
  devices,
  onLinked,
}: {
  address: string;
  worker: string;
  sourceBindingId: string;
  devices: FleetDevice[];
  onLinked: () => Promise<unknown>;
}) {
  const link = bntWorkerAgentBinding(devices, address, worker);
  // Passing the address record avoids a second fleet lookup; Agent list is shared.
  const matched = useMatchedDeviceAgent(link?.device.id ?? "unlinked-worker"),
    now = useAgentClock(),
    { locale } = useLocale(),
    send = useServerFn(linkBntWorkerAgent);
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
    <section className="bnt-worker-agent" aria-label={`${worker} Agent`}>
      {link ? (
        <>
          <strong className="bnt-worker-computer">
            {link.device.name}
            {matched.agent && (
              <small data-online={agentOnline(matched.agent.lastSeen, now)}>
                {agentOnline(matched.agent.lastSeen, now)
                  ? labels.online[locale]
                  : labels.offline[locale]}
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
      <a className="bnt-worker-install" href={`/${locale}/machines`}>
        {labels.install[locale]} ↗
      </a>
    </section>
  );
}
