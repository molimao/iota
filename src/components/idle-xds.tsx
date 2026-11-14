import { createXdsBackupKey, encryptXdsBackup } from "@/lib/xds-wallet-backup";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AgentInfo } from "@/lib/device-agent";
import { agentOnline } from "@/lib/device-agent";
import type { FleetDevice } from "@/lib/fleet";
import { configureSharedXds } from "@/lib/idle-xds.functions";
import type { SharedXdsSettings } from "@/lib/idle-xds";
import { localized as l } from "@/lib/product-discovery";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { useLocale } from "./site/locale";
import type { idleMiningCopy } from "./idle-bnt";

export const idleXdsCopy = {
  intro: l([
    "XDS 可与 BNT 同时挖，开关与线程分别设置。两者都会占用 CPU 和内存。",
    "XDS 可與 BNT 同時挖，開關與執行緒分別設定。兩者都會占用 CPU 和記憶體。",
    "Run XDS alongside BNT, with separate controls and thread limits. Both use CPU and memory.",
    "XDS와 BNT를 함께 채굴할 수 있으며, 활성화와 스레드는 각각 설정합니다. 둘 다 CPU와 메모리를 사용합니다.",
    "XDS は BNT と同時に採掘できます。有効化とスレッド数は個別に設定します。どちらも CPU とメモリを使用します。",
  ]),
  mining: l(["正在挖 XDS", "正在挖 XDS", "Mining XDS", "XDS 채굴 중", "XDS 採掘中"]),
  starting: l([
    "同步 / 启动中",
    "同步 / 啟動中",
    "Syncing / starting",
    "동기화 / 시작 중",
    "同期・起動中",
  ]),
  busy: l([
    "已有 XDS 在运行",
    "已有 XDS 在執行",
    "XDS already running",
    "XDS가 이미 실행 중",
    "XDS は既に実行中",
  ]),
};

const sharedCopy = {
  saved: l(["已保存", "已儲存", "Saved", "저장됨", "保存済み"]),
  deviceCount: l(["{n} 台", "{n} 台", "{n} devices", "{n}대", "{n} 台"]),
  pending: l(["待保存", "待儲存", "Unsaved", "저장 대기", "未保存"]),
  setupError: l([
    "钱包准备失败，将自动重试",
    "錢包準備失敗，將自動重試",
    "Wallet setup failed. Retrying automatically.",
    "지갑 준비 실패 · 자동 재시도",
    "ウォレットの準備に失敗・自動で再試行",
  ]),
  wallet: l([
    "所有设备共用一个专用钱包，无需归集转账。",
    "所有設備共用一個專用錢包，無需歸集轉帳。",
    "One dedicated wallet for all devices. Rewards go straight to it, with no sweeping transfers.",
    "모든 기기가 전용 지갑 하나를 공유합니다. 별도 이체 없이 보상이 바로 지급됩니다.",
    "全端末で専用ウォレットを共有。報酬は直接入り、集約送金は不要です。",
  ]),
  prepare: l([
    "选择设备，Agent 会自动安装并同步钱包。",
    "選擇設備，Agent 會自動安裝並同步錢包。",
    "Choose devices. The Agent installs the miner and syncs the wallet automatically.",
    "기기를 선택하면 Agent가 채굴기를 설치하고 지갑을 자동 동기화합니다.",
    "端末を選ぶと、Agent がマイナーのインストールとウォレットの同期を行います。",
  ]),
  consent: l([
    "我已确认：所选设备都能使用此挖矿钱包的资金。",
    "我已確認：所選設備都能使用此挖礦錢包的資金。",
    "I understand that each selected device can spend funds in this mining wallet.",
    "선택한 각 기기에서 이 채굴 지갑의 자금을 사용할 수 있음을 확인합니다.",
    "選択した各端末が、この採掘ウォレットの資金を使用できることを確認しました。",
  ]),
  create: l([
    "创建钱包并启用",
    "建立錢包並啟用",
    "Create wallet & enable",
    "지갑 생성 및 활성화",
    "ウォレットを作成して有効化",
  ]),
  creating: l([
    "正在创建专用钱包…",
    "正在建立專用錢包…",
    "Creating your mining wallet…",
    "전용 채굴 지갑 생성 중…",
    "専用ウォレットを作成中…",
  ]),
  syncing: l([
    "等待钱包同步",
    "等待錢包同步",
    "Waiting for wallet sync",
    "지갑 동기화 대기",
    "ウォレットの同期を待機中",
  ]),
  synced: l(["钱包已同步", "錢包已同步", "Wallet synced", "지갑 동기화됨", "ウォレット同期済み"]),
  preparing: l([
    "Agent 准备中",
    "Agent 準備中",
    "Agent getting ready",
    "Agent 준비 중",
    "Agent 準備中",
  ]),
  unsupported: l([
    "自动安装暂支持 M 系列 Mac",
    "自動安裝暫支援 M 系列 Mac",
    "Auto-install currently supports Apple Silicon Macs",
    "자동 설치는 현재 Apple Silicon Mac에서 지원됩니다",
    "自動インストールは現在 Apple Silicon Mac に対応",
  ]),
  all: l([
    "全选 · 2线程",
    "全選 · 2執行緒",
    "Select all · 2 threads",
    "전체 선택 · 2스레드",
    "すべて選択 · 2スレッド",
  ]),
  backup: l(["备份钱包", "備份錢包", "Back up wallet", "지갑 백업", "ウォレットをバックアップ"]),
  backupNote: l([
    "保存一份加密备份，换电脑或重装时可恢复。",
    "儲存一份加密備份，換電腦或重裝時可還原。",
    "Save an encrypted backup to recover your wallet after replacing or reinstalling a computer.",
    "기기 교체나 재설치 후 복구할 수 있도록 암호화된 백업을 저장하세요.",
    "端末の交換や再インストールに備え、暗号化バックアップを保存してください。",
  ]),
  password: l([
    "备份密码（至少10位）",
    "備份密碼（至少10碼）",
    "Backup password (at least 10 characters)",
    "백업 비밀번호 (10자 이상)",
    "バックアップ用パスワード（10文字以上）",
  ]),
  requestBackup: l([
    "准备加密备份",
    "準備加密備份",
    "Prepare encrypted backup",
    "암호화 백업 준비",
    "暗号化バックアップを準備",
  ]),
  download: l([
    "下载加密备份",
    "下載加密備份",
    "Download encrypted backup",
    "암호화 백업 다운로드",
    "暗号化バックアップをダウンロード",
  ]),
  backupWaiting: l([
    "等待在线设备准备备份…",
    "等待上線設備準備備份…",
    "Waiting for an online device to prepare the backup…",
    "온라인 기기의 백업 준비를 기다리는 중…",
    "オンライン端末がバックアップを準備するまでお待ちください…",
  ]),
  copy: l(["复制地址", "複製地址", "Copy address", "주소 복사", "アドレスをコピー"]),
  copied: l(["已复制", "已複製", "Copied", "복사됨", "コピー済み"]),
};

export function IdleXdsSettings({
  userId,
  machines,
  preview = false,
  walletOnly = false,
  copy: c,
}: {
  copy: typeof idleMiningCopy;
  userId: string | null;
  machines: { agent: AgentInfo; device: FleetDevice }[];
  preview?: boolean;
  walletOnly?: boolean;
}) {
  const { locale } = useLocale();
  const now = useAgentClock(),
    client = useQueryClient();
  const [demo, setDemo] = useState<SharedXdsSettings>({
    wallet: null,
    devices: [],
    receivers: machines.map(({ device }) => ({
      deviceId: device.id,
      available: true,
      applied: false,
    })),
    backup: null,
  });
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [consent, setConsent] = useState(false),
    [copied, setCopied] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false),
    [password, setPassword] = useState("");
  const [backupKey, setBackupKey] = useState<Awaited<ReturnType<typeof createXdsBackupKey>> | null>(
    null,
  );
  const [backupError, setBackupError] = useState(false),
    [backupBusy, setBackupBusy] = useState(false);
  const key = ["shared-xds-settings", userId];
  const query = useQuery({
    queryKey: key,
    queryFn: () => configureSharedXds({ data: { action: "read" } }),
    enabled: !!userId && !preview,
    refetchInterval: (query) => {
      const value = query.state.data;
      if (
        value &&
        machines.some(
          ({ agent, device }) =>
            agent.snapshot.idleXds &&
            agent.snapshot.idleXds.supported !== false &&
            !value.receivers.find((receiver) => receiver.deviceId === device.id)?.available,
        )
      )
        return 5000;
      return value?.wallet &&
        (!value.wallet.address ||
          value.devices.some(
            (d) => !value.receivers.find((r) => r.deviceId === d.deviceId)?.applied,
          ) ||
          (value.backup && !value.backup.packet))
        ? 3000
        : false;
    },
  });
  const settings = preview ? demo : query.data;
  const devices = machines.map(({ device }) => ({
    deviceId: device.id,
    threads:
      selected[device.id] ?? settings?.devices.find((d) => d.deviceId === device.id)?.threads ?? 0,
  }));
  const enabled = devices.filter((d) => d.threads > 0);
  const dirty = devices.some(
    (d) =>
      d.threads !==
      (settings?.devices.find((saved) => saved.deviceId === d.deviceId)?.threads ?? 0),
  );
  const newTargets = enabled.some(
    (d) => !settings?.devices.some((saved) => saved.deviceId === d.deviceId),
  );
  const change = useMutation({
    mutationFn: async () => {
      if (preview)
        setDemo({
          ...demo,
          wallet: demo.wallet ?? {
            id: "00000000-0000-4000-8000-000000000099",
            address: "disc1examplewalletforlocalpreviewonly0000000000000000000000000000000",
          },
          devices: enabled,
          receivers: demo.receivers.map((r) => ({
            ...r,
            applied: enabled.some((d) => d.deviceId === r.deviceId),
          })),
        });
      else
        client.setQueryData(
          key,
          await configureSharedXds({
            data: { action: "save", settings: { devices, consent: true } },
          }),
        );
      setSelected({});
    },
  });
  async function requestBackup() {
    setBackupBusy(true);
    setBackupError(false);
    try {
      const keys = await createXdsBackupKey();
      setBackupKey(keys);
      if (!preview)
        client.setQueryData(
          key,
          await configureSharedXds({ data: { action: "backup", publicKey: keys.publicKey } }),
        );
    } catch {
      setBackupError(true);
    } finally {
      setBackupBusy(false);
    }
  }
  async function downloadBackup() {
    if (!settings?.wallet || !settings.backup?.packet || !backupKey) return;
    setBackupBusy(true);
    setBackupError(false);
    try {
      const file = await encryptXdsBackup(
        backupKey.privateKey,
        settings.wallet.id + ":" + settings.backup.id,
        settings.backup.packet,
        password,
      );
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(file)], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "xds-mining-wallet-backup.json";
      link.click();
      URL.revokeObjectURL(url);
      setPassword("");
      setBackupKey(null);
      setBackupOpen(false);
    } catch {
      setBackupError(true);
    } finally {
      setBackupBusy(false);
    }
  }
  if (walletOnly && !settings?.wallet) return null;
  return (
    <section
      className={walletOnly ? "idle-xds-settings idle-xds-wallet-recovery" : "idle-xds-settings"}
      aria-label="XDS"
    >
      {!walletOnly && <p className="idle-bnt-intro">{idleXdsCopy.intro[locale]}</p>}
      <div className="idle-xds-common-wallet">
        <strong>{sharedCopy.wallet[locale]}</strong>
        {settings?.wallet?.address ? (
          <div className="idle-xds-address">
            <code>
              {settings.wallet.address.slice(0, 16)}…{settings.wallet.address.slice(-10)}
            </code>
            <button
              type="button"
              className="fleet-outline"
              onClick={() => {
                void navigator.clipboard
                  .writeText(settings.wallet!.address!)
                  .then(() => setCopied(true));
              }}
            >
              {(copied ? sharedCopy.copied : sharedCopy.copy)[locale]}
            </button>
            <button
              type="button"
              className="fleet-outline"
              onClick={() => setBackupOpen(!backupOpen)}
            >
              {sharedCopy.backup[locale]}
            </button>
          </div>
        ) : (
          <p>{settings?.wallet ? sharedCopy.creating[locale] : sharedCopy.prepare[locale]}</p>
        )}
      </div>
      {!walletOnly &&
        (query.isError ? (
          <p role="alert">
            {c.unavailable[locale]}{" "}
            <button className="fleet-outline" onClick={() => void query.refetch()}>
              {c.retry[locale]}
            </button>
          </p>
        ) : !settings ? (
          <p role="status">{c.loading[locale]}</p>
        ) : !machines.length ? (
          <p>{c.empty[locale]}</p>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              change.mutate();
            }}
          >
            <div className="idle-bnt-device-heading">
              <h3 className="idle-bnt-field-title">{c.devices[locale]}</h3>
              <button
                className="fleet-outline"
                type="button"
                onClick={() =>
                  setSelected(
                    Object.fromEntries(
                      machines
                        .filter(
                          ({ agent, device }) =>
                            agent.snapshot.idleXds?.supported !== false &&
                            (preview ||
                              settings.receivers.find((r) => r.deviceId === device.id)?.available),
                        )
                        .map(({ device }) => [device.id, 2]),
                    ),
                  )
                }
              >
                {sharedCopy.all[locale]}
              </button>
            </div>
            <ul className="idle-bnt-machines">
              {machines.map(({ agent, device }) => {
                const status = agent.snapshot.idleXds,
                  receiver = settings.receivers.find((r) => r.deviceId === device.id);
                const supported = status?.supported !== false;
                const available = supported && (preview || !!receiver?.available);
                const threads = devices.find((d) => d.deviceId === device.id)!.threads;
                const online = agentOnline(agent.lastSeen, now);
                const text = !supported
                  ? sharedCopy.unsupported[locale]
                  : !status
                    ? c.update[locale]
                    : status.provisioning === "error"
                      ? sharedCopy.setupError[locale]
                      : status.provisioning === "installing"
                        ? c.states.installing[locale]
                        : !online
                          ? c.offline[locale]
                          : status.state === "mining"
                            ? idleXdsCopy.mining[locale]
                            : status.state === "busy"
                              ? idleXdsCopy.busy[locale]
                              : selected[device.id] !== undefined &&
                                  selected[device.id] !==
                                    (settings.devices.find((saved) => saved.deviceId === device.id)
                                      ?.threads ?? 0)
                                ? sharedCopy.pending[locale]
                                : threads && !receiver?.applied
                                  ? sharedCopy.syncing[locale]
                                  : status.state === "priority"
                                    ? c.states.priority[locale]
                                    : status.state === "waiting"
                                      ? c.states.waiting[locale]
                                      : status.state === "starting"
                                        ? idleXdsCopy.starting[locale]
                                        : status.state === "error"
                                          ? c.states.error[locale]
                                          : receiver?.applied
                                            ? sharedCopy.synced[locale]
                                            : available
                                              ? c.off[locale]
                                              : sharedCopy.preparing[locale];
                return (
                  <li key={device.id}>
                    <div className="idle-bnt-device">
                      <strong>{device.name}</strong>
                      <small
                        className="idle-bnt-device-status"
                        data-mining={online && status?.state === "mining"}
                      >
                        {text}
                        {online && status?.state === "mining" && status.hashrate != null
                          ? ` · ${status.hashrate.toFixed(2)} H/s`
                          : ""}
                      </small>
                    </div>
                    {(available || threads > 0) && (
                      <select
                        aria-label={`${device.name} · XDS · ${c.cpuThreads[locale]}`}
                        value={threads}
                        onChange={(event) =>
                          setSelected({ ...selected, [device.id]: Number(event.target.value) })
                        }
                      >
                        <option value={0}>{c.off[locale]}</option>
                        {available &&
                          [1, 2, 3, 4].map((n) => (
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
            {newTargets && (
              <label className="idle-xds-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                <span>{sharedCopy.consent[locale]}</span>
              </label>
            )}
            <div className="idle-bnt-footer">
              <div className="idle-bnt-feedback">
                {change.isError ? (
                  <small role="alert">{c.unavailable[locale]}</small>
                ) : change.isSuccess ? (
                  <small role="status">{sharedCopy.saved[locale]}</small>
                ) : null}
              </div>
              <button
                className="solid idle-bnt-save"
                disabled={
                  !dirty ||
                  change.isPending ||
                  (newTargets && !consent) ||
                  (!settings.wallet && !enabled.length)
                }
              >
                {settings.wallet ? c.save[locale] : sharedCopy.create[locale]}
                {enabled.length
                  ? ` · ${sharedCopy.deviceCount[locale].replace("{n}", String(enabled.length))}`
                  : ""}
              </button>
            </div>
          </form>
        ))}
      {backupOpen && (
        <div className="idle-xds-backup">
          <p>{sharedCopy.backupNote[locale]}</p>
          <label>
            {sharedCopy.password[locale]}
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {backupKey && !settings?.backup?.packet ? (
            <p role="status">{sharedCopy.backupWaiting[locale]}</p>
          ) : null}
          <button
            type="button"
            className="fleet-outline"
            disabled={
              password.length < 10 ||
              backupBusy ||
              preview ||
              (!!backupKey && !settings?.backup?.packet)
            }
            onClick={() =>
              void (backupKey && settings?.backup?.packet ? downloadBackup() : requestBackup())
            }
          >
            {
              (backupKey && settings?.backup?.packet
                ? sharedCopy.download
                : sharedCopy.requestBackup)[locale]
            }
          </button>
          {backupError && <p role="alert">{c.unavailable[locale]}</p>}
        </div>
      )}
    </section>
  );
}
