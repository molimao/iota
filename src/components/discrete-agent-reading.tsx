import "./pool-worker-cards.css";
import "./discrete-monitor.css";
import {
  AGENT_DOWNLOAD_URL,
  LINUX_AGENT_DOWNLOAD_URL,
  agentOnline,
  type AgentInfo,
} from "@/lib/device-agent";
import { localized } from "@/lib/product-discovery";
import type { FleetDevice } from "@/lib/fleet";
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
  heading: localized(["挖矿设备", "挖礦設備", "Mining devices", "채굴 기기", "マイニング端末"]),
  active: localized(["采集中", "採集中", "Reporting", "수집 중", "取得中"]),
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

export type DiscreteDevice = { name: string; agent: AgentInfo };

export function discreteDevices(devices: FleetDevice[], agents: AgentInfo[]): DiscreteDevice[] {
  const byDevice = new Map(
    agents.filter((agent) => agent.snapshot.xds).map((agent) => [agent.deviceId, agent]),
  );
  return devices.flatMap(({ id, name }) => {
    const agent = byDevice.get(id);
    return agent ? [{ name, agent }] : [];
  });
}

export function discreteDeviceSample(agent: AgentInfo, now: number) {
  const reading = agent.snapshot.xds;
  if (!reading) return null;
  const at = reading.observedAt;
  const age = at === null ? null : now - Date.parse(at);
  if (!agentOnline(agent.lastSeen, now)) return { status: "offline", rate: null, at } as const;
  if (age !== null && (age < -5000 || age >= XDS_SAMPLE_FRESH_MS))
    return { status: "stale", rate: null, at } as const;
  if (reading.status !== "ok") return { status: reading.status, rate: null, at } as const;
  return { status: "active", rate: reading.hashrateHps, at } as const;
}

function sampleTime(at: string, locale: SiteLocale) {
  return new Intl.DateTimeFormat(LANGUAGE_TAG[locale], {
    timeZone: "Asia/Hong_Kong",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(at));
}

function formatRate(rate: number, locale: SiteLocale) {
  return `${new Intl.NumberFormat(LANGUAGE_TAG[locale], { maximumFractionDigits: 2 }).format(rate)} H/s`;
}

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
  const sample = agent && discreteDeviceSample(agent, now);
  if (!sample) return null;
  return (
    <div className="agent-card-summary agent-local-miner">
      <strong>{name ?? `XDS · ${copy.title[locale]}`}</strong>
      <p>
        {sample.rate === null ? copy[sample.status][locale] : formatRate(sample.rate, locale)}
        {sample.at && (
          <>
            {" · "}
            {copy.sample[locale]} <time dateTime={sample.at}>{sampleTime(sample.at, locale)}</time>
          </>
        )}
      </p>
    </div>
  );
}

export function DiscreteAgentPanel({ devices, now }: { devices: DiscreteDevice[]; now: number }) {
  const { locale } = useLocale();
  return (
    <section className="project-panel" aria-labelledby="xds-local-hashrate">
      <div className="project-section-head">
        <h2 id="xds-local-hashrate">{copy.heading[locale]}</h2>
        <a className="project-outline" href={`/${locale}/devices`}>
          {copy.devices[locale]} ↗
        </a>
      </div>
      {devices.length ? (
        <div className="pwc-grid">
          {devices.map(({ name, agent }) => {
            const sample = discreteDeviceSample(agent, now);
            if (!sample) return null;
            const tone =
              sample.status === "active"
                ? "online"
                : sample.status === "offline"
                  ? "offline"
                  : "unknown";
            return (
              <article className="pwc-card xds-device-card" key={agent.deviceId}>
                <header>
                  <h3 className="pwc-name">{name}</h3>
                  <span className="pwc-state" data-state={tone}>
                    {copy[sample.status][locale]}
                  </span>
                </header>
                <div className="pwc-metric">
                  <span>{copy.title[locale]}</span>
                  <strong>{sample.rate === null ? "—" : formatRate(sample.rate, locale)}</strong>
                </div>
                {sample.at && (
                  <div className="pwc-metric">
                    <span>{copy.sample[locale]} (UTC+8)</span>
                    <time dateTime={sample.at}>{sampleTime(sample.at, locale)}</time>
                  </div>
                )}
              </article>
            );
          })}
        </div>
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
    </section>
  );
}
