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
    "更换对应电脑",
    "更換對應電腦",
    "Change computer",
    "대응 컴퓨터 변경",
    "対応コンピューターを変更",
  ]),
  connect: localized([
    "选择这台电脑",
    "選擇這台電腦",
    "Choose this computer",
    "이 컴퓨터 선택",
    "このコンピューターを選択",
  ]),
  which: localized([
    "这个项目在哪台设备上运行？",
    "此專案在哪台設備執行？",
    "Which device runs this project?",
    "이 프로젝트를 실행하는 기기는 무엇인가요?",
    "このプロジェクトを実行する端末はどれですか？",
  ]),
  save: localized(["确认关联", "確認關聯", "Confirm link", "연결 확인", "関連付けを確定"]),
  busy: localized(["正在关联…", "正在關聯…", "Linking…", "연결 중…", "関連付け中…"]),
  error: localized(["没有保存，请重试。", "沒有儲存，請重試。", "Not saved. Try again.", "저장하지 못했습니다. 다시 시도하세요.", "保存できませんでした。再試行してください。"]),
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
  if (!["noid", "xmr"].includes(project) || !matched.enabled || !choices.length) return null;
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
    <details className="project-agent-connect" open={!connected || undefined}>
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
