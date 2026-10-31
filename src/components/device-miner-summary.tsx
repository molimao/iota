import { useMatchedDeviceAgent } from "@/hooks/use-matched-device-agent";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { agentOnline, type AgentInfo } from "@/lib/device-agent";
import { FLEET_NAMES, type FleetBinding } from "@/lib/fleet";
import { useLocale } from "./site/locale";
import { localized } from "@/lib/product-discovery";
import type { SiteLocale } from "@/lib/site";
import "./device-miner-summary.css";
const copy = {
  loading: localized([
    "正在读取本机状态…",
    "正在讀取本機狀態…",
    "Loading local status…",
    "로컬 상태 읽는 중…",
    "ローカル状態を取得中…",
  ]),
  offline: localized([
    "电脑离线",
    "電腦離線",
    "Computer offline",
    "컴퓨터 오프라인",
    "コンピューターはオフライン",
  ]),
  notConnected: localized([
    "尚未选择对应电脑",
    "尚未選擇對應電腦",
    "No computer linked",
    "연결된 컴퓨터 없음",
    "対応するコンピューターが未選択",
  ]),
  notEnabled: localized([
    "尚未识别到本项目矿工",
    "尚未識別到本專案礦工",
    "No matching miner detected for this project",
    "이 프로젝트와 일치하는 채굴기를 찾지 못했습니다",
    "このプロジェクトに一致するマイナーは未検出です",
  ]),
  linuxUnsupported: localized([
    "这台是 Linux，暂时看不到本机数据；上方矿池数据仍可使用。",
    "這台是 Linux，暫時看不到本機資料；上方礦池資料仍可使用。",
    "This is a Linux device. Local readings are not available yet; pool data above remains available.",
    "Linux 기기입니다. 아직 로컬 상태는 볼 수 없지만 위의 풀 데이터는 확인할 수 있습니다.",
    "Linux 端末のため、ローカル状態はまだ表示できません。上のプールデータは利用できます。",
  ]),
  unsupported: localized([
    "暂不支持本机数据",
    "暫不支援本機資料",
    "Local readings are not available for this project yet",
    "이 프로젝트는 아직 로컬 상태를 지원하지 않습니다",
    "このプロジェクトはローカル状態に未対応です",
  ]),
  error: localized([
    "暂时无法读取本机状态",
    "暫時無法讀取本機狀態",
    "Local status unavailable",
    "로컬 상태를 불러올 수 없습니다",
    "ローカル状態を取得できません",
  ]),
  process: localized([
    "矿工进程运行中",
    "礦工程序執行中",
    "Miner process running",
    "채굴 프로세스 실행 중",
    "マイナープロセス実行中",
  ]),
  cpu: localized(["矿工 CPU", "礦工 CPU", "Miner CPU", "채굴기 CPU", "マイナー CPU"]),
  memory: localized(["矿工内存", "礦工記憶體", "Miner memory", "채굴기 메모리", "マイナーメモリ"]),
  sessionRate: localized([
    "本机会话平均算力",
    "本機工作階段平均算力",
    "Local session average",
    "로컬 세션 평균",
    "ローカルセッション平均",
  ]),
  stopped: localized([
    "矿工已停止",
    "礦工已停止",
    "Miner stopped",
    "채굴기 중지됨",
    "マイナー停止中",
  ]),
  blocks: localized([
    "已接受区块累计",
    "已接受區塊累計",
    "Accepted blocks · cumulative",
    "승인 블록 누계",
    "受理ブロック累計",
  ]),
  local: localized(["本机状态", "本機狀態", "Local status", "로컬 상태", "ローカル状態"]),
  title: localized([
    "XMRig · 本机状态",
    "XMRig · 本機狀態",
    "XMRig · local status",
    "XMRig · 로컬 상태",
    "XMRig · ローカル状態",
  ]),
  unavailable: localized([
    "暂时读不到本机数据",
    "暫時讀不到本機資料",
    "Local status is unavailable",
    "로컬 상태를 읽을 수 없습니다",
    "ローカル状態を取得できません",
  ]),
  unauthorized: localized([
    "本机数据读取失败，请检查 Mac 上的设置",
    "本機資料讀取失敗，請檢查 Mac 上的設定",
    "Could not read local data. Check the settings on the Mac.",
    "로컬 데이터를 읽지 못했습니다. Mac 설정을 확인하세요.",
    "ローカルデータを読み取れません。Mac の設定を確認してください。",
  ]),
  stale: localized([
    "本机数据已过期",
    "本機資料已過期",
    "Local reading is stale",
    "로컬 데이터 만료",
    "ローカルデータの期限切れ",
  ]),
  rate: localized([
    "本机算力 · 10 秒",
    "本機算力 · 10 秒",
    "Local hashrate · 10s",
    "로컬 해시레이트 · 10초",
    "ローカルハッシュレート · 10秒",
  ]),
  shares: localized([
    "有效 / 拒绝提交累计",
    "有效 / 拒絕提交累計",
    "Accepted / rejected shares · cumulative",
    "유효 / 거부 제출 누계",
    "有効 / 拒否シェア累計",
  ]),
};
export function DeviceMinerSummary({
  deviceId,
  bindings,
  preview = false,
  previewAgent,
}: {
  deviceId: string;
  bindings: FleetBinding[];
  preview?: boolean;
  previewAgent?: AgentInfo | undefined;
}) {
  const matched = useMatchedDeviceAgent(deviceId, undefined, preview),
    now = useAgentClock(),
    { locale } = useLocale();
  const agent = preview ? previewAgent : matched.agent;
  return (
    <ProjectMinerSlots
      agent={agent}
      bindings={bindings}
      now={now}
      locale={locale}
      error={!preview && matched.query.isError}
      loading={!preview && matched.enabled && matched.query.isPending}
    />
  );
}
/** Each slot belongs to one project binding, never a combined miner dashboard. */
export function ProjectMinerSlots({
  agent,
  bindings,
  now,
  locale,
  error = false,
  loading = false,
}: {
  agent: AgentInfo | undefined;
  bindings: FleetBinding[];
  now: number;
  locale: SiteLocale;
  error?: boolean;
  loading?: boolean;
}) {
  return (
    <>
      {bindings
        .filter(
          (b) => b.project !== "iota" && !(["bnt", "prl"].includes(b.project) && !b.worker.trim()),
        )
        .map((binding) => {
          const supported = ["xmr", "bnt", "prl", "noid"].includes(binding.project);
          const observation = agent?.snapshot.miners?.find(
            (m) => m.project === binding.project && m.bindingId === binding.id,
          );
          if (!error && agent && observation)
            return (
              <LocalMinerReadings
                key={binding.id}
                agent={agent}
                bindings={[binding]}
                now={now}
                locale={locale}
              />
            );
          return (
            <section
              className="agent-card-summary agent-local-miner agent-connect-hint"
              key={binding.id}
              aria-label={`${FLEET_NAMES[binding.project]} 本机状态`}
            >
              <p role="status">
                {loading
                  ? copy.loading[locale]
                  : error
                    ? copy.error[locale]
                    : !supported
                      ? copy.unsupported[locale]
                      : !agent
                        ? copy.notConnected[locale]
                        : !agentOnline(agent.lastSeen, now)
                          ? copy.offline[locale]
                          : agent.snapshot.platform === "linux"
                            ? copy.linuxUnsupported[locale]
                            : copy.notEnabled[locale]}
              </p>
            </section>
          );
        })}
    </>
  );
}
export function LocalMinerReadings({
  agent,
  bindings,
  now,
  locale,
}: {
  agent: AgentInfo;
  bindings: FleetBinding[];
  now: number;
  locale: SiteLocale;
}) {
  const miners =
    agent.snapshot.miners?.filter((miner) =>
      bindings.some((b) => b.id === miner.bindingId && b.project === miner.project),
    ) ?? [];
  return (
    <>
      {miners.map((miner) => {
        const age = now - Date.parse(miner.observedAt),
          fresh = agentOnline(agent.lastSeen, now) && age >= -5000 && age < 60000;
        const rate =
          miner.rateWindow === "session"
            ? miner.hashrateSession
            : miner.rateWindow === "60s"
              ? miner.hashrate60s
              : miner.hashrate10s;
        return (
          <section
            className="agent-card-summary fleet-agent-connect agent-local-miner"
            key={miner.bindingId}
          >
            <strong>
              {
                {
                  xmrig: "XMRig",
                  seine: "BNT · Seine",
                  "pearl-metal": "PRL · Metal",
                  "noid-mac": "NOID · Mac",
                }[miner.software]
              }{" "}
              · {copy.local[locale]}
            </strong>
            {miner.status === "process" && fresh ? (
              <>
                <p>{copy.process[locale]}</p>
                <dl className="agent-card-metrics">
                  <div>
                    <dt>{copy.cpu[locale]}</dt>
                    <dd>
                      {miner.appCpu == null ? "—" : `${miner.appCpu.toLocaleString(locale)}%`}
                    </dd>
                  </div>
                  <div>
                    <dt>{copy.memory[locale]}</dt>
                    <dd>
                      {miner.processMemoryMb == null
                        ? "—"
                        : `${miner.processMemoryMb.toLocaleString(locale)} MB`}
                    </dd>
                  </div>
                </dl>
              </>
            ) : miner.status !== "ok" || !fresh ? (
              <p role="status">
                {!fresh
                  ? copy.stale[locale]
                  : copy[
                      miner.status === "stopped"
                        ? "stopped"
                        : miner.status === "unauthorized"
                          ? "unauthorized"
                          : "unavailable"
                    ][locale]}
              </p>
            ) : (
              <dl className="agent-card-metrics">
                <div>
                  <dt>
                    {miner.rateWindow === "session"
                      ? copy.sessionRate[locale]
                      : copy.rate[locale].replace(/10/g, miner.rateWindow === "60s" ? "60" : "10")}
                  </dt>
                  <dd>
                    {rate == null
                      ? "—"
                      : `${rate.toLocaleString(locale)} ${miner.rateUnit ?? "H/s"}`}
                  </dd>
                </div>
                <div>
                  <dt>
                    {miner.counterUnit === "blocks" ? copy.blocks[locale] : copy.shares[locale]}
                  </dt>
                  <dd>
                    {miner.accepted ?? "—"}
                    {miner.counterUnit !== "blocks" && <> / {miner.rejected ?? "—"}</>}
                  </dd>
                </div>
              </dl>
            )}
          </section>
        );
      })}
    </>
  );
}
