import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import { linkProjectAgent } from "@/lib/device-agent.functions";
import type { FleetDevice, FleetProject } from "@/lib/fleet";
import { localized } from "@/lib/product-discovery";
import type { SiteLocale } from "@/lib/site";
import { useLocale } from "./site/locale";
import "./project-agent-connect.css";
const copy = {
  change: localized([
    "更换采集设备",
    "更換採集設備",
    "Change collection device",
    "수집 기기 변경",
    "収集端末を変更",
  ]),
  connect: localized([
    "关联已有 Agent",
    "關聯現有 Agent",
    "Link existing Agent",
    "기존 Agent 연결",
    "既存の Agent に関連付け",
  ]),
  which: localized([
    "这个项目在哪台设备上运行？",
    "此專案在哪台設備執行？",
    "Which device runs this project?",
    "이 프로젝트를 실행하는 기기는 무엇인가요?",
    "このプロジェクトを実行する端末はどれですか？",
  ]),
  note: localized([
    "关联后可在设备卡片查看已支持的本机数据，不会启停矿工。",
    "關聯後可在設備卡片查看已支援的本機資料，不會啟停礦工。",
    "Supported local readings appear on the device card. This does not start or stop mining.",
    "지원되는 로컬 데이터가 기기 카드에 표시됩니다. 채굴기를 시작하거나 중지하지 않습니다.",
    "対応するローカルデータを端末カードに表示します。採掘の起動・停止は行いません。",
  ]),
  save: localized(["确认关联", "確認關聯", "Confirm link", "연결 확인", "関連付けを確定"]),
  busy: localized(["正在关联…", "正在關聯…", "Linking…", "연결 중…", "関連付け中…"]),
  error: localized([
    "关联未完成，请重试。",
    "關聯未完成，請重試。",
    "Link not completed. Please retry.",
    "연결하지 못했습니다. 다시 시도하세요.",
    "関連付けできませんでした。再試行してください。",
  ]),
};
export function ProjectAgentConnect({
  deviceId,
  bindingId,
  project,
  devices,
  onLinked,
}: {
  deviceId: string;
  bindingId: string;
  project: FleetProject;
  devices: FleetDevice[];
  onLinked: () => Promise<unknown>;
}) {
  const { locale } = useLocale(),
    matched = useMatchedDeviceAgent(deviceId),
    send = useServerFn(linkProjectAgent);
  const [selected, setSelected] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const lock = useRef(false);
  const choices = (matched.query.data ?? []).filter(
    (a) => a.deviceId !== deviceId && devices.some((d) => d.id === a.deviceId),
  );
  if (!["prl", "noid", "xmr"].includes(project) || !matched.enabled || !choices.length) return null;
  async function submit() {
    if (lock.current || !choices.some((a) => a.deviceId === selected)) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    try {
      await send({ data: { bindingId, deviceId: selected } });
      await onLinked();
      setSelected("");
    } catch {
      setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <ProjectAgentConnectView
      locale={locale}
      choices={choices.map((a) => ({
        id: a.deviceId,
        name: devices.find((d) => d.id === a.deviceId)?.name ?? "Device",
      }))}
      selected={selected}
      busy={busy}
      error={error}
      connected={!!matched.agent}
      onSelect={setSelected}
      onSubmit={() => void submit()}
    />
  );
}
export function ProjectAgentConnectView({
  locale,
  choices,
  selected,
  busy = false,
  error = false,
  connected = false,
  worker,
  onSelect,
  onSubmit,
}: {
  locale: SiteLocale;
  choices: { id: string; name: string }[];
  selected: string;
  busy?: boolean;
  error?: boolean;
  connected?: boolean;
  worker?: string;
  onSelect: (id: string) => void;
  onSubmit: () => void;
}) {
  return (
    <details className="project-agent-connect">
      <summary>{connected ? copy.change[locale] : copy.connect[locale]}</summary>
      <div>
        <label>
          {worker ? workerQuestion[locale].replace("{worker}", worker) : copy.which[locale]}
          <select value={selected} disabled={busy} onChange={(e) => onSelect(e.target.value)}>
            <option value="">—</option>
            {choices.map((a) => (
              <option value={a.id} key={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <p>{worker ? workerNote[locale] : copy.note[locale]}</p>
        <button
          type="button"
          className="fleet-outline"
          disabled={busy || !selected}
          onClick={onSubmit}
        >
          {busy ? copy.busy[locale] : copy.save[locale]}
        </button>
        {error && <p role="alert">{copy.error[locale]}</p>}
      </div>
    </details>
  );
}
const workerQuestion = localized([
  "Worker {worker} 在哪台电脑上？",
  "Worker {worker} 在哪台電腦上？",
  "Which computer runs Worker {worker}?",
  "Worker {worker}를 실행하는 컴퓨터는 무엇인가요?",
  "Worker {worker} が動くコンピューターはどれですか？",
]);
const workerNote = localized([
  "只关联这个 Worker，其他 Worker 保持原样。不会启停矿工。",
  "只關聯此 Worker，其他 Worker 維持原樣。不會啟停礦工。",
  "Links only this Worker. Other Workers and running miners stay unchanged.",
  "이 Worker만 연결합니다. 다른 Worker와 실행 중인 채굴기는 그대로 유지됩니다.",
  "この Worker だけを関連付けます。他の Worker や稼働中のマイナーは変更しません。",
]);
