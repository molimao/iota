import { useAgentClock } from "@/hooks/use-agent-clock";
import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import {
  AGENT_DOWNLOAD_URL,
  LINUX_AGENT_DOWNLOAD_URL,
  agentOnline,
  type AgentInfo,
} from "@/lib/device-agent";
import { localized } from "@/lib/product-discovery";
import { LANGUAGE_TAG, type SiteLocale } from "@/lib/site";
import { useLocale } from "./site/locale";

const copy = {
  title: localized([
    "本机算力",
    "本機算力",
    "Local hashrate",
    "기기 해시레이트",
    "端末のハッシュレート",
  ]),
  empty: localized([
    "升级已配对的 Agent 后，在这里看每台设备的 XDS 算力。",
    "升級已配對的 Agent 後，在這裡查看各台設備的 XDS 算力。",
    "Update the paired Agent to see each device’s XDS hashrate here.",
    "연결된 Agent를 업데이트하면 기기의 XDS 해시레이트가 여기에 표시됩니다.",
    "ペアリング済みAgentを更新すると、端末ごとのXDSハッシュレートが表示されます。",
  ]),
  setup: localized([
    "配置 XDS 采集",
    "設定 XDS 採集",
    "Set up XDS monitoring",
    "XDS 모니터링 설정",
    "XDS監視を設定",
  ]),
  setupHint: localized([
    "更新已配对的 Agent 后，会自动读取同一用户运行的 Discrete 日志。找不到日志时，可手动指定路径。",
    "更新已配對的 Agent 後，會自動讀取同一使用者執行的 Discrete 日誌。找不到日誌時，可手動指定路徑。",
    "Update your paired Agent to detect a Discrete log owned by the same user. Set a path manually if the log cannot be detected.",
    "연결된 Agent를 업데이트하면 같은 사용자의 Discrete 로그를 자동 감지합니다. 필요하면 경로를 직접 지정하세요.",
    "ペアリング済みAgentを更新すると、同じユーザーのDiscreteログを自動検出します。必要な場合はパスを指定できます。",
  ]),
  devices: localized(["我的设备", "我的設備", "My devices", "내 기기", "マイデバイス"]),
  unavailable: localized([
    "还没有算力样本",
    "還沒有算力樣本",
    "Waiting for a hashrate sample",
    "해시레이트 샘플 대기 중",
    "サンプル待ち",
  ]),
  stale: localized([
    "算力数据已过期",
    "算力資料已過期",
    "Hashrate sample expired",
    "해시레이트 샘플 만료",
    "サンプルの有効期限切れ",
  ]),
  offline: localized([
    "Agent 离线",
    "Agent 離線",
    "Agent offline",
    "Agent 오프라인",
    "Agent オフライン",
  ]),
  stopped: localized(["矿工已停止", "礦工已停止", "Miner stopped", "채굴기 중지", "マイナー停止"]),
  sample: localized(["采样", "採樣", "Sample", "샘플", "サンプル"]),
};

// The official daemon writes a hashrate sample once a minute.
const XDS_SAMPLE_FRESH_MS = 150_000;

export function DiscreteAgentReading({
  agent,
  name,
  now,
  locale,
}: {
  agent: AgentInfo | undefined;
  name?: string;
  now: number;
  locale: SiteLocale;
}) {
  const reading = agent?.snapshot.xds;
  if (!agent || !reading) return null;
  const sampleAt = reading.observedAt ? Date.parse(reading.observedAt) : null;
  const age = sampleAt === null ? null : now - sampleAt;
  const online = agentOnline(agent.lastSeen, now);
  const value = !online
    ? copy.offline[locale]
    : age !== null && (age < -5000 || age >= XDS_SAMPLE_FRESH_MS)
      ? copy.stale[locale]
      : reading.status === "unavailable"
        ? copy.unavailable[locale]
        : reading.status === "stopped"
          ? copy.stopped[locale]
          : `${new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: 2 }).format(reading.hashrateHps)} H/s`;
  return (
    <div className="agent-card-summary agent-local-miner">
      <strong>{name ?? `XDS · ${copy.title[locale]}`}</strong>
      <p>
        {value}
        {sampleAt !== null && (
          <>
            {" · "}
            {copy.sample[locale]}{" "}
            <time dateTime={reading.observedAt ?? undefined}>
              {new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
                timeZone: "Asia/Hong_Kong",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(sampleAt)}
            </time>
          </>
        )}
      </p>
    </div>
  );
}

export function DiscreteAgentPanel() {
  const { locale } = useLocale();
  const { enabled, devices, query } = useMatchedDeviceAgent();
  const now = useAgentClock();
  const rows = enabled ? (query.data?.filter((agent) => agent.snapshot.xds) ?? []) : [];
  const names = new Map(devices?.map((device) => [device.id, device.name]));
  return (
    <section className="project-panel" aria-labelledby="xds-local-hashrate">
      <h2 id="xds-local-hashrate">{copy.title[locale]} · Agent</h2>
      {rows.length ? (
        rows.map((agent) => (
          <DiscreteAgentReading
            key={agent.deviceId}
            agent={agent}
            name={names.get(agent.deviceId) ?? copy.title[locale]}
            now={now}
            locale={locale}
          />
        ))
      ) : (
        <p>{copy.empty[locale]}</p>
      )}
      <details className="mt-4">
        <summary>{copy.setup[locale]}</summary>
        <p>{copy.setupHint[locale]}</p>
        <p>
          <a href={AGENT_DOWNLOAD_URL} download>
            macOS Agent ↓
          </a>
        </p>
        <code className="block break-all text-xs">
          python3 iota_watch_agent.py --configure-xds-log /path/to/discreted.log
        </code>
        <p>
          <a href={LINUX_AGENT_DOWNLOAD_URL} download>
            Linux Agent ↓
          </a>
        </p>
        <code className="block break-all text-xs">
          python3 linux_gpu_agent.py configure-xds --xds-log /path/to/discreted.log
        </code>
      </details>
      <p>
        <a className="text-link" href={`/${locale}/devices`}>
          {copy.devices[locale]} →
        </a>
      </p>
    </section>
  );
}
