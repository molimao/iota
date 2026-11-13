import { IdleBntValue } from "./idle-bnt-value";
import { IDLE_MINING_SOURCE } from "@/lib/checkout-intent";
import "./idle-bnt.css";
import { useState } from "react";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, ChevronDown, Cpu } from "lucide-react";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { agentOnline, type AgentInfo } from "@/lib/device-agent";
import type { FleetDevice } from "@/lib/fleet";
import { configureIdleBnt } from "@/lib/idle-bnt.functions";
import { idleBntConfig, type IdleBntConfig } from "@/lib/idle-bnt";
import { localized as l } from "@/lib/product-discovery";
import { useLocale } from "./site/locale";

export const idleBntTitle = l([
  "自动闲时挖矿",
  "自動閒時挖礦",
  "Automatic idle mining",
  "자동 유휴 채굴",
  "自動アイドル採掘",
]);
export const idleMiningCopy = {
  afterCheckout: l([
    "开通后直接回到挖矿设置。",
    "開通後直接回到挖礦設定。",
    "After checkout, you’ll return to mining setup.",
    "결제 후 채굴 설정으로 돌아갑니다.",
    "決済後、採掘設定に戻ります。",
  ]),
  back: l(["返回 IOTA 项目", "返回 IOTA 專案", "Back to IOTA", "IOTA로 돌아가기", "IOTA に戻る"]),
  intro: l([
    "IOTA 排队时，或在网页上暂停 IOTA 后，Agent 可自动挖 BNT。快排到时会停挖，让 IOTA 优先训练。",
    "IOTA 排隊時，或在網頁上暫停 IOTA 後，Agent 可自動挖 BNT。快輪到時會停止挖礦，優先進行 IOTA 訓練。",
    "The Agent can mine BNT while IOTA is in the queue or paused from this dashboard. As your Mac nears the front of the queue, IOTA takes priority.",
    "IOTA가 대기열에 있거나 이 대시보드에서 일시 중지하면 Agent가 BNT를 자동으로 채굴할 수 있습니다. 학습 순서가 가까워지면 IOTA를 우선합니다.",
    "IOTA の順番待ち中や、このダッシュボードで IOTA を停止した後に、Agent が BNT を自動採掘できます。順番が近づくと IOTA の学習を優先します。",
  ]),
  requires: l([
    "支持已连接 Agent 的 Mac，启用后自动安装矿工。",
    "支援已連接 Agent 的 Mac，啟用後自動安裝礦工。",
    "On Macs with a connected Agent, the miner installs when you enable it.",
    "Agent가 연결된 Mac에서 활성화하면 채굴기가 자동 설치됩니다.",
    "Agent が接続された Mac では、有効化するとマイナーが自動でインストールされます。",
  ]),
  upgrade: l([
    "查看 Pro 方案",
    "查看 Pro 方案",
    "View Pro plans",
    "Pro 요금제 보기",
    "Pro プランを見る",
  ]),
  confirming: l([
    "正在确认 Pro 权益…",
    "正在確認 Pro 權益…",
    "Confirming Pro access…",
    "Pro 권한 확인 중…",
    "Pro の利用資格を確認中…",
  ]),
  active: l([
    "Pro 已生效，可以开始设置。",
    "Pro 已生效，可以開始設定。",
    "Pro is active. You can set up idle mining now.",
    "Pro가 활성화되었습니다. 이제 유휴 채굴을 설정할 수 있습니다.",
    "Pro が有効になりました。アイドル採掘を設定できます。",
  ]),
  retry: l(["重试", "重試", "Retry", "다시 시도", "再試行"]),
  signIn: l([
    "登录确认权益",
    "登入確認權益",
    "Sign in to confirm",
    "로그인하여 확인",
    "ログインして確認",
  ]),
  settings: l(["设置", "設定", "Settings", "설정", "設定"]),
  earnings: l([
    "查看 BNT 钱包收益",
    "查看 BNT 錢包收益",
    "View BNT wallet earnings",
    "BNT 지갑 수익 보기",
    "BNT ウォレットの収益を見る",
  ]),
  save: l(["保存设置", "儲存設定", "Save settings", "설정 저장", "設定を保存"]),
  saved: l([
    "已保存，等待设备同步",
    "已儲存，等待設備同步",
    "Saved. Waiting for devices to sync.",
    "저장됨 · 기기 동기화 대기",
    "保存済み・端末の同期を待っています",
  ]),
  address: l([
    "BNT 收款地址",
    "BNT 收款地址",
    "BNT payout address",
    "BNT 수신 주소",
    "BNT 受取アドレス",
  ]),
  sharedWallet: l([
    "所有设备共用",
    "所有設備共用",
    "Shared by all devices",
    "모든 기기에서 공유",
    "全端末共通",
  ]),
  devices: l(["参与设备", "參與設備", "Mining devices", "참여 기기", "参加端末"]),
  cpuThreads: l(["CPU 线程", "CPU 執行緒", "CPU threads", "CPU 스레드", "CPU スレッド"]),
  invalid: l([
    "请输入有效的 BNT 收款地址",
    "請輸入有效的 BNT 收款地址",
    "Enter a valid BNT payout address",
    "유효한 BNT 수신 주소를 입력하세요",
    "有効な BNT 受取アドレスを入力してください",
  ]),
  threads: l(["{n} 线程", "{n} 執行緒", "{n} CPU threads", "{n} 스레드", "{n} スレッド"]),
  off: l(["关闭", "關閉", "Off", "끄기", "オフ"]),
  unavailable: l([
    "设置暂不可用，请重试",
    "設定暫不可用，請重試",
    "Settings unavailable. Try again.",
    "설정을 불러오지 못했습니다",
    "設定を利用できません。再度お試しください",
  ]),
  loading: l([
    "正在读取设置…",
    "正在讀取設定…",
    "Loading settings…",
    "설정 불러오는 중…",
    "設定を読み込み中…",
  ]),
  offline: l(["离线", "離線", "Offline", "오프라인", "オフライン"]),
  update: l([
    "需更新 Agent",
    "需更新 Agent",
    "Update Agent",
    "Agent 업데이트 필요",
    "Agent の更新が必要",
  ]),
  prepare: l([
    "更新至少一台 Mac 的 Agent 后即可启用。",
    "更新至少一台 Mac 的 Agent 後即可啟用。",
    "Update the Agent on at least one Mac to enable mining.",
    "채굴을 시작하려면 한 대 이상의 Mac에서 Agent를 업데이트하세요.",
    "採掘を有効にするには、少なくとも1台の Mac で Agent を更新してください。",
  ]),
  autoInstall: l([
    "选择线程并保存，Agent 会自动安装矿工。",
    "選擇執行緒並儲存，Agent 會自動安裝礦工。",
    "Choose threads and save. The Agent installs the miner automatically.",
    "스레드를 선택하고 저장하면 Agent가 채굴기를 자동으로 설치합니다.",
    "スレッド数を選んで保存すると、Agent がマイナーを自動でインストールします。",
  ]),
  installPending: l([
    "等待安装",
    "等待安裝",
    "Waiting to install",
    "설치 대기",
    "インストール待ち",
  ]),
  connect: l(["连接 Mac", "連接 Mac", "Connect a Mac", "Mac 연결", "Mac を接続"]),
  enable: l(["启用 BNT", "啟用 BNT", "Enable BNT mining", "BNT 채굴 켜기", "BNT 採掘を有効にする"]),
  listTitle: l(["BNT 闲时挖矿", "BNT 閒時挖礦", "BNT idle mining", "BNT 유휴 채굴", "BNT アイドル採掘"]),
  empty: l([
    "先为运行 IOTA 的 Mac 连接 Agent。",
    "先為執行 IOTA 的 Mac 連接 Agent。",
    "Connect an Agent on a Mac that runs IOTA.",
    "IOTA를 실행하는 Mac에 Agent를 연결하세요.",
    "IOTA を実行する Mac に Agent を接続してください。",
  ]),
  count: l(["{n} 台正在挖", "{n} 台正在挖", "{n} mining", "{n}대 채굴 중", "{n} 台が採掘中"]),
  states: {
    install_needed: l(["待启用", "待啟用", "Ready to enable", "활성화 대기", "有効化待ち"]),
    installing: l([
      "正在安装矿工",
      "正在安裝礦工",
      "Installing miner",
      "채굴기 설치 중",
      "マイナーをインストール中",
    ]),
    install_error: l([
      "安装失败，将自动重试",
      "安裝失敗，將自動重試",
      "Installation failed. Retrying automatically.",
      "설치 실패 · 자동 재시도",
      "インストール失敗・自動で再試行",
    ]),
    off: l(["未运行", "未執行", "Idle", "미실행", "停止中"]),
    waiting: l(["等待空闲", "等待閒置", "Waiting for idle time", "유휴 대기", "空き時間を待機中"]),
    priority: l(["IOTA 优先", "IOTA 優先", "IOTA has priority", "IOTA 우선", "IOTA を優先"]),
    mining: l(["正在挖 BNT", "正在挖 BNT", "Mining BNT", "BNT 채굴 중", "BNT 採掘中"]),
    starting: l(["启动中", "啟動中", "Starting", "시작 중", "起動中"]),
    memory: l(["内存不足", "記憶體不足", "Low memory", "메모리 부족", "メモリ不足"]),
    busy: l([
      "Seine 已运行",
      "Seine 已執行",
      "Seine already running",
      "Seine 실행 중",
      "Seine は起動済み",
    ]),
    error: l([
      "算力未更新",
      "算力未更新",
      "No recent hashrate",
      "최근 해시레이트 없음",
      "ハッシュレート未更新",
    ]),
  },
};

export const idleBntSettingsQuery = (userId: string | null) =>
  queryOptions({
    queryKey: ["idle-bnt-settings", userId],
    queryFn: () => configureIdleBnt({ data: { action: "read" } }),
    staleTime: 15000,
  });

export function IdleBntListStatus({
  agent,
  now,
  settings,
}: {
  agent: AgentInfo;
  now: number;
  settings: IdleBntConfig;
}) {
  const { locale } = useLocale();
  const c = idleMiningCopy;
  const { platform, monitorOnly, idleBnt } = agent.snapshot;
  if (platform === "linux" || platform === "win32" || monitorOnly || !idleBnt || idleBnt.state === "setup")
    return null;

  const threads = settings.devices.find((device) => device.deviceId === agent.deviceId)?.threads;
  if (!threads)
    return (
      <a
        className="idle-bnt-list-link"
        href={`#${IDLE_MINING_SOURCE}`}
        onClick={() => {
          const panel = document.getElementById(IDLE_MINING_SOURCE);
          if (panel instanceof HTMLDetailsElement) panel.open = true;
        }}
      >
        {c.enable[locale]} <ArrowUpRight size={12} aria-hidden="true" />
      </a>
    );

  const online = agentOnline(agent.lastSeen, now);
  const mining = online && idleBnt.state === "mining";
  const detail = !online
    ? c.threads[locale].replace("{n}", String(threads))
    : mining && idleBnt.hashrate != null
      ? `${idleBnt.hashrate.toFixed(2)} H/s`
      : (idleBnt.state === "install_needed" ? c.installPending : c.states[idleBnt.state])[locale];
  return (
    <span className="idle-bnt-list-status" data-mining={mining}>
      {mining && idleBnt.hashrate == null ? detail : `BNT · ${detail}`}
    </span>
  );
}

export function IdleBntEntry({
  plan,
  userId,
  devices = [],
  agents,
  preview,
  onPreviewSave,
  checkoutReturn = false,
  onRefreshMembership,
  agentsError = false,
}: {
  plan: "free" | "pro";
  userId: string | null;
  devices?: FleetDevice[] | undefined;
  agents?: AgentInfo[] | undefined;
  preview?: IdleBntConfig | undefined;
  onPreviewSave?: (settings: IdleBntConfig) => void;
  checkoutReturn?: boolean;
  onRefreshMembership?: () => void;
  agentsError?: boolean;
}) {
  const { locale } = useLocale();
  const c = idleMiningCopy;
  const now = useAgentClock();
  const client = useQueryClient();
  const [expanded, setExpanded] = useState(!!preview || checkoutReturn);
  const [demo, setDemo] = useState(preview);
  const [invalid, setInvalid] = useState(false);
  const pro = plan === "pro";
  const query = useQuery({
    ...idleBntSettingsQuery(userId),
    enabled: pro && expanded && !!userId && !preview,
  });
  const settings = demo ?? query.data;
  const change = useMutation({
    onSuccess: () => { void client.invalidateQueries({queryKey:["idle-bnt-activity",userId]}); },
    mutationFn: async (value: IdleBntConfig) => {
      if (preview) {
        setDemo(value);
        onPreviewSave?.(value);
      } else
        client.setQueryData(
          idleBntSettingsQuery(userId).queryKey,
          await configureIdleBnt({ data: { action: "save", settings: value } }),
        );
    },
  });
  const machines = (agents ?? []).flatMap((agent) => {
    const device = devices.find(
      (item) => item.id === agent.deviceId && item.bindings.some((b) => b.project === "iota"),
    );
    return device && agent.snapshot.platform !== "linux" && !agent.snapshot.monitorOnly
      ? [{ agent, device }]
      : [];
  });
  const mining = machines.filter(
    ({ agent }) => agentOnline(agent.lastSeen, now) && agent.snapshot.idleBnt?.state === "mining",
  ).length;
  const needsInstall = machines.some(
    ({ agent }) => agent.snapshot.idleBnt?.state === "install_needed",
  );
  const canConfigure = machines.some(
    ({ agent }) => agent.snapshot.idleBnt && agent.snapshot.idleBnt.state !== "setup",
  );
  const title = (
    <span className="idle-bnt-title">
      <span className="idle-bnt-icon" aria-hidden="true">
        <Cpu size={17} />
      </span>
      <span>{idleBntTitle[locale]}</span>
      <small className="agent-pro-badge">PRO</small>
    </span>
  );
  if (!pro)
    return (
      <section className="idle-bnt-entry" id={IDLE_MINING_SOURCE}>
        <div>
          <h2>{title}</h2>
          <p>{c.intro[locale]}</p>
          {!checkoutReturn && <small>{c.requires[locale]}</small>}
        </div>
        {checkoutReturn ? (
          <div className="idle-bnt-actions">
            <small role="status">{c.confirming[locale]}</small>
            <button className="fleet-outline" type="button" onClick={onRefreshMembership}>
              {(userId ? c.retry : c.signIn)[locale]}
            </button>
          </div>
        ) : (
          <a
            className="site-button small"
            href={`/${locale}/devices?view=membership&from=${IDLE_MINING_SOURCE}#pro-plan`}
          >
            {c.upgrade[locale]} <ArrowUpRight size={14} />
          </a>
        )}
      </section>
    );
  return (
    <details
      className="idle-bnt-panel"
      id={IDLE_MINING_SOURCE}
      open={expanded}
      onToggle={(event) => setExpanded(event.currentTarget.open)}
    >
      <summary>
        {title}
        <span className="idle-bnt-summary-state">
          {mining
            ? c.count[locale].replace("{n}", String(mining))
            : expanded
              ? null
              : c.settings[locale]}
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </summary>
      {expanded && (
        <div className="idle-bnt-body">
          {checkoutReturn && <p role="status">{c.active[locale]}</p>}
          <p className="idle-bnt-intro">{c.intro[locale]}</p>
          {settings?.address && <IdleBntValue userId={userId} preview={!!preview} />}
          {query.isError || agentsError ? (
            <p role="alert">
              {c.unavailable[locale]}{" "}
              {query.isError && (
                <button
                  className="fleet-outline"
                  type="button"
                  onClick={() => void query.refetch()}
                >
                  {c.retry[locale]}
                </button>
              )}
            </p>
          ) : !settings || !agents ? (
            <p role="status">{c.loading[locale]}</p>
          ) : machines.length === 0 ? (
            <p>
              {c.empty[locale]} <a href={`/${locale}/machines`}>{c.connect[locale]} ↗</a>
            </p>
          ) : (
            <form
              key={JSON.stringify(settings)}
              onSubmit={(event) => {
                event.preventDefault();
                const fields = new FormData(event.currentTarget);
                const result = idleBntConfig.safeParse({
                  address: fields.get("address"),
                  devices: machines.flatMap(({ device }) => {
                    const value = fields.get(device.id);
                    return value === null ? [] : [{ deviceId: device.id, threads: Number(value) }];
                  }),
                });
                setInvalid(!result.success);
                if (result.success) change.mutate(result.data);
              }}
            >
              <div className="idle-bnt-fields">
                {(canConfigure || settings.address) && (
                  <div className="idle-bnt-wallet">
                    {canConfigure && (
                      <div className="idle-bnt-wallet-field">
                        <label className="idle-bnt-field-title" htmlFor="idle-bnt-wallet-input">
                          {c.address[locale]}
                        </label>
                        <input
                          id="idle-bnt-wallet-input"
                          name="address"
                          defaultValue={settings.address}
                          required
                          maxLength={93}
                          autoComplete="off"
                          spellCheck={false}
                          aria-invalid={invalid || undefined}
                          aria-describedby={
                            invalid ? "idle-bnt-wallet-error" : "idle-bnt-wallet-note"
                          }
                        />
                        {invalid ? (
                          <small id="idle-bnt-wallet-error" role="alert">
                            {c.invalid[locale]}
                          </small>
                        ) : (
                          <small id="idle-bnt-wallet-note">{c.sharedWallet[locale]}</small>
                        )}
                      </div>
                    )}
                    {settings.address && (
                      <a
                        className="idle-bnt-earnings"
                        href={`/${locale}/projects/bnt#wallet=${encodeURIComponent(settings.address)}`}
                      >
                        {c.earnings[locale]} <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                )}
                <div className="idle-bnt-devices">
                  <div className="idle-bnt-device-heading">
                    <h3 className="idle-bnt-field-title">{c.devices[locale]}</h3>
                    {canConfigure && <small>{c.cpuThreads[locale]}</small>}
                  </div>
                  {!canConfigure && <p>{c.prepare[locale]}</p>}
                  <ul className="idle-bnt-machines">
                    {machines.map(({ agent, device }) => {
                      const status = agent.snapshot.idleBnt;
                      const online = agentOnline(agent.lastSeen, now);
                      const threads =
                        settings.devices.find((item) => item.deviceId === device.id)?.threads ?? 0;
                      return (
                        <li key={device.id}>
                          <div className="idle-bnt-device">
                            <strong>{device.name}</strong>
                            <small
                              className="idle-bnt-device-status"
                              data-mining={online && status?.state === "mining"}
                            >
                              {!online ? (
                                c.offline[locale]
                              ) : !status || status.state === "setup" ? (
                                <a href={`/${locale}/machines?device=${device.id}`}>
                                  {c.update[locale]} ↗
                                </a>
                              ) : (
                                (status.state === "install_needed" && threads
                                  ? c.installPending
                                  : c.states[status.state])[locale]
                              )}
                              {online && status?.hashrate != null
                                ? ` · ${status.hashrate.toFixed(2)} H/s`
                                : ""}
                            </small>
                          </div>
                          {status && status.state !== "setup" && (
                            <select
                              name={device.id}
                              aria-label={`${device.name} · ${c.cpuThreads[locale]}`}
                              defaultValue={threads}
                            >
                              <option value={0}>{c.off[locale]}</option>
                              {[1, 2, 3, 4].map((n) => (
                                <option key={n} value={n}>
                                  {c.threads[locale].replace("{n}", String(n))}
                                </option>
                              ))}
                            </select>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {canConfigure && (
                <div className="idle-bnt-footer">
                  <div className="idle-bnt-feedback">
                    {invalid ? null : change.isError ? (
                      <small role="alert">{c.unavailable[locale]}</small>
                    ) : change.isSuccess ? (
                      <small role="status">{c.saved[locale]}</small>
                    ) : needsInstall ? (
                      <small>{c.autoInstall[locale]}</small>
                    ) : null}
                  </div>
                  <button className="solid idle-bnt-save" disabled={change.isPending}>
                    {c.save[locale]}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      )}
    </details>
  );
}
