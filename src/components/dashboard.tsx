import { useLocale } from "@/components/site/locale";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Plus,
  RefreshCw,
  Download,
  Upload,
  Monitor,
  ArrowUpRight,
  Stethoscope,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FarmLine } from "@/components/farm-view";
import { useAuth } from "@/hooks/use-auth";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useIotaDashboard, type DeviceView } from "@/hooks/use-iota-dashboard";
import { STATUS_META, officialSignals, type OfficialSignal } from "@/lib/device-status";
import { RECONCILE_NOTES, type Diagnosis } from "@/lib/diagnose";
import { formatIota, formatUsd, iotaUnitsToUsd, type Aggregate } from "@/lib/earnings";
import { formatAgo, formatCount, formatSecondsTimestamp } from "@/lib/format";
import { getDeviceSeries } from "@/lib/iota.functions";

type DetailTab = "diagnose" | "overview" | "history" | "rewards";

function signalText(signal: OfficialSignal, t: (key: string) => string) {
  if (signal === "yes") return t("是");
  if (signal === "no") return t("否");
  return t("还看不到");
}

function PresenceSignals({ miner }: { miner: DeviceView["miner"] }) {
  const { t } = useLocale();
  const signals = officialSignals(miner);
  return (
    <div className="presence">
      <div>
        <span>{t("官方在线")}</span>
        <b data-signal={signals.online}>{signalText(signals.online, t)}</b>
      </div>
      <div>
        <span>{t("已开始训练")}</span>
        <b data-signal={signals.training}>{signalText(signals.training, t)}</b>
      </div>
    </div>
  );
}

function MoneyPair({
  units,
  usdPerIota,
  large = false,
}: {
  units: number | null | undefined;
  usdPerIota: number | null;
  large?: boolean;
}) {
  const { locale } = useLocale();
  const iota = formatIota(units ?? null, 8, locale);
  const usd = formatUsd(iotaUnitsToUsd(units ?? null, usdPerIota));
  return (
    <span className={`money-pair${large ? " large" : ""}`}>
      <strong>
        {iota} <small>IOTA</small>
      </strong>
      <em>{usd} USD</em>
    </span>
  );
}
function Total({
  title,
  value,
  usdPerIota,
  primary = false,
}: {
  title: string;
  value: Aggregate;
  usdPerIota: number | null;
  primary?: boolean;
}) {
  const units = value.known || !value.total ? value.units : null;
  return (
    <section className={`total ${primary ? "primary" : ""}`}>
      <span>{title}</span>
      <div className="amount">
        <MoneyPair large units={units} usdPerIota={usdPerIota} />
      </div>
      {value.partial ? (
        <p>
          {value.known}/{value.total}
        </p>
      ) : null}
    </section>
  );
}

function DiagnosisBlock({ diagnosis }: { diagnosis: Diagnosis }) {
  const { locale, en } = useLocale();
  return (
    <div className="diagnosis">
      {diagnosis.notes.map((note) => (
        <section key={note.code} data-tone={note.tone}>
          <h4>{note.title[locale]}</h4>
          <p>{note.cause[locale]}</p>
          {note.steps.length ? (
            <ol>
              {note.steps.map((step) => (
                <li key={step.en}>{step[locale]}</li>
              ))}
            </ol>
          ) : null}
          {note.slug ? (
            <a href={`/${locale}/learn/${note.slug}`}>
              {en ? "What to do" : "查看处理方法"}
              <ArrowUpRight size={14} />
            </a>
          ) : null}
        </section>
      ))}
      <details className="diagnosis-reconcile">
        <summary>{en ? "Comparing numbers elsewhere?" : "数字和别处对不上？"}</summary>
        <dl>
          {RECONCILE_NOTES.map((item) => (
            <div key={item.q.en}>
              <dt>{item.q[locale]}</dt>
              <dd>{item.a[locale]}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}

/** Only appears when something is actually wrong. Silent on a healthy list. */
function AttentionBanner({
  views,
  onOpen,
}: {
  views: DeviceView[];
  onOpen: (hotkey: string) => void;
}) {
  const { locale, en } = useLocale();
  if (!views.length) return null;
  return (
    <div className="attention" role="status">
      <Stethoscope size={17} />
      <div>
        {views.slice(0, 3).map((view) => (
          <button key={view.entry.hotkey} onClick={() => onOpen(view.entry.hotkey)}>
            <b>{view.entry.label}</b>
            <span>{view.diagnosis.primary.title[locale]}</span>
            <ArrowUpRight size={14} />
          </button>
        ))}
        {views.length > 3 ? (
          <p>{en ? `And ${views.length - 3} more.` : `还有 ${views.length - 3} 台。`}</p>
        ) : null}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { t, en, locale } = useLocale();
  const auth = useAuth();
  const watch = useWatchlist(auth.userId, auth.ready);
  const atLimit = watch.devices.length >= watch.limit;
  const dash = useIotaDashboard(watch.devices, watch.loaded);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [label, setLabel] = useState("");
  const [hotkey, setHotkey] = useState("");
  const [message, setMessage] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const active = dash.views.find((v) => v.entry.hotkey === selected);

  // Arriving from the home page input: prefill and open the add form once.
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || !watch.loaded) return;
    const id = new URLSearchParams(window.location.search).get("add");
    prefilled.current = true;
    if (!id) return;
    window.history.replaceState(null, "", window.location.pathname);
    if (watch.devices.some((device) => device.hotkey === id)) return;
    setHotkey(id);
    setAdding(true);
  }, [watch.loaded, watch.devices]);

  function openDevice(hotkey: string, tab: DetailTab = "overview") {
    setDetailTab(tab);
    setSelected(hotkey);
  }
  function exportList() {
    const url = URL.createObjectURL(new Blob([watch.exportJson()], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "iota-devices.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">
            <Monitor size={22} />
          </span>
          <div>
            <b>IOTA</b>
            <span>{t("我的设备")}</span>
          </div>
        </div>
        <div className="actions">
          {watch.devices.length ? (
            <button
              onClick={() => void dash.refresh()}
              disabled={dash.manual.running || dash.manual.cooldownRemaining > 0}
            >
              <RefreshCw size={16} className={dash.manual.running ? "spin" : ""} />
              {dash.manual.running
                ? t("刷新中")
                : dash.manual.cooldownRemaining > 0
                  ? `${Math.ceil(dash.manual.cooldownRemaining / 1000)} s`
                  : t("立即刷新")}
            </button>
          ) : null}
          <button
            className="solid"
            onClick={() => {
              if (atLimit) setMessage(watch.limitMessage);
              else setAdding(true);
            }}
          >
            <Plus size={17} />
            {t("添加设备")}
          </button>
        </div>
      </header>
      {watch.devices.length ? (
        <div className="page-title">
          <p>
            {auth.userId ? (
              <>
                <a className="account-name-link" href={`/${locale}/account`}>
                  {auth.name || auth.email || (en ? "Signed in" : "已登录")}
                </a>
                {` · ${watch.devices.length}/${watch.limit}`}
              </>
            ) : (
              `${watch.devices.length}/${watch.limit}`
            )}
          </p>
          <span className="refresh-label">
            {t("最近获取")} {formatAgo(dash.fetchedAt, dash.now, locale)}
          </span>
        </div>
      ) : null}
      {(watch.storageError || watch.syncMessage || auth.error || message) && (
        <div role="status" className="notice">
          {t(watch.storageError || watch.syncMessage || auth.error || message)}
          <button
            aria-label={t("关闭提示")}
            onClick={() => {
              setMessage("");
              watch.clearSyncMessage();
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {(dash.errors.length > 0 || dash.manual.error || dash.usingCachedOnly) && (
        <div className="notice warning" role="status">
          {dash.manual.error
            ? t(dash.manual.error)
            : dash.errors[0]
              ? t(dash.errors[0])
              : t("正在连接，先显示浏览器保存的旧数据。")}
        </div>
      )}
      {watch.devices.length ? (
        <>
          <div className="totals">
            <Total
              primary
              title={t("今日总收益")}
              value={dash.todayTotal}
              usdPerIota={dash.usdPerIota}
            />
            <Total
              title={t("累计总收益")}
              value={dash.lifetimeTotal}
              usdPerIota={dash.usdPerIota}
            />
          </div>
          {dash.usdPerIota ? (
            <p className="fx-note">1 IOTA ≈ {formatUsd(dash.usdPerIota)}</p>
          ) : null}
          <AttentionBanner
            views={dash.needsAttention}
            onOpen={(hotkey) => openDevice(hotkey, "diagnose")}
          />
        </>
      ) : null}
      <section>
        <div className="section-heading">
          <h2>
            {t("设备")}
            <span>{watch.devices.length}</span>
          </h2>
          <div className="actions">
            <button onClick={() => file.current?.click()}>
              <Upload size={15} />
              {t("导入")}
            </button>
            {watch.devices.length ? (
              <button onClick={exportList}>
                <Download size={15} />
                {t("导出备份")}
              </button>
            ) : null}
          </div>
        </div>
        <input
          hidden
          ref={file}
          type="file"
          accept="application/json,.json"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const result = await watch.importJson(await f.text());
              setMessage(
                result.ok
                  ? en
                    ? `Imported ${result.report?.added}; duplicates ${result.report?.duplicates}; invalid ${result.report?.invalid}.`
                    : `已导入 ${result.report?.added} 台，重复 ${result.report?.duplicates} 台，无效 ${result.report?.invalid} 条。`
                  : result.error || t("导入失败"),
              );
            } catch {
              setMessage(t("文件读取失败"));
            }
            e.target.value = "";
          }}
        />
        {!watch.devices.length ? (
          <div className="empty">
            <Monitor size={36} />
            <h2>{t("把你的第一台设备加进来")}</h2>
            <p>{t("打开 IOTA 应用，复制 Miner 页面里的 Miner ID。")}</p>
            <button className="solid" onClick={() => setAdding(true)}>
              <Plus size={16} />
              {t("添加设备")}
            </button>
          </div>
        ) : (
          <div className="devices">
            {dash.views.map((view) => {
              const meta = STATUS_META[view.status];
              return (
                <article className="device" key={view.entry.hotkey}>
                  <div className="device-top">
                    <span className="device-icon">
                      <Monitor size={22} />
                    </span>
                    <button
                      className={`badge ${meta.tone}`}
                      title={en ? "Why this status?" : "为什么是这个状态？"}
                      onClick={() => openDevice(view.entry.hotkey, "diagnose")}
                    >
                      {t(meta.label)}
                    </button>
                  </div>
                  <h3>{view.entry.label}</h3>
                  <PresenceSignals miner={view.miner} />
                  <div className="device-earnings">
                    <div>
                      <span>{t("今日收益")}</span>
                      <MoneyPair units={view.earnings?.todayUnits} usdPerIota={dash.usdPerIota} />
                    </div>
                    <div>
                      <span>{t("累计收益")}</span>
                      <MoneyPair
                        units={view.earnings?.totalEarnedUnits}
                        usdPerIota={dash.usdPerIota}
                      />
                    </div>
                  </div>
                  <div className="device-foot">
                    <span>{view.earnings && !view.earningsUsable ? t("旧数据") : ""}</span>
                    <button onClick={() => openDevice(view.entry.hotkey)}>
                      {t("查看详情")}
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      {dash.farm ? <FarmLine farm={dash.farm} deviceCount={watch.devices.length} /> : null}
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="dash-dialog">
          <DialogTitle>{t("添加设备")}</DialogTitle>
          <DialogDescription>
            {en ? "Paste the public ID from the Miner screen." : "粘贴 Miner 页面里的公开 ID。"}
          </DialogDescription>
          <form
            className="device-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const result = await watch.add({ label, hotkey });
              if (result.ok) {
                setAdding(false);
                setLabel("");
                setHotkey("");
                setMessage(watch.cloud ? t("设备已绑定到你的账号。") : t("设备已保存到此浏览器。"));
              } else setMessage(result.error || t("保存失败"));
            }}
          >
            <label>
              {t("设备名称")}
              <input
                required
                maxLength={40}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={t("例如：家里的 Mac")}
              />
            </label>
            <label>
              Miner ID
              <input
                required
                value={hotkey}
                onChange={(e) => setHotkey(e.target.value)}
                placeholder={t("从 IOTA 应用复制完整 ID")}
              />
            </label>
            {message && <p role="alert">{t(message)}</p>}
            <button className="solid" type="submit">
              {t("保存设备")}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!active}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="detail-dialog dash-dialog">
          {active && (
            <>
              <DialogTitle>{active.entry.label}</DialogTitle>
              <DialogDescription>{t(STATUS_META[active.status].label)}</DialogDescription>
              <DeviceDetail
                key={active.entry.hotkey}
                view={active}
                usdPerIota={dash.usdPerIota}
                tab={detailTab}
                onTab={setDetailTab}
              />
              <div className="actions detail-actions">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(active.entry.hotkey);
                      setMessage(t("Miner ID 已复制"));
                    } catch {
                      setMessage(t("复制失败，请展开技术信息手动复制。"));
                    }
                  }}
                >
                  {t("复制 ID")}
                </button>
                <button
                  onClick={async () => {
                    const name = window.prompt(t("设备名称"), active.entry.label);
                    if (name !== null) {
                      const r = await watch.rename(active.entry.hotkey, name);
                      setMessage(r.ok ? t("名称已保存") : r.error || t("保存失败"));
                    }
                  }}
                >
                  {t("改名")}
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        watch.cloud
                          ? en
                            ? `Remove ${active.entry.label} from your account? Training will keep running.`
                            : `从账号移除「${active.entry.label}」？不会停止设备训练。`
                          : en
                            ? `Remove ${active.entry.label} from this browser? Training will keep running.`
                            : `从本浏览器移除「${active.entry.label}」？不会停止设备训练。`,
                      )
                    ) {
                      void watch.remove(active.entry.hotkey);
                      setSelected(null);
                    }
                  }}
                >
                  {t("移除设备")}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
function DeviceDetail({
  view,
  usdPerIota,
  tab,
  onTab,
}: {
  view: DeviceView;
  usdPerIota: number | null;
  tab: DetailTab;
  onTab: (tab: DetailTab) => void;
}) {
  const { t, en, locale } = useLocale();
  const seriesFn = useServerFn(getDeviceSeries);
  const series = useQuery({
    queryKey: ["series", view.entry.hotkey, view.miner?.run_id],
    queryFn: () =>
      seriesFn({ data: { hotkey: view.entry.hotkey, runId: view.miner!.run_id, period: "week" } }),
    enabled: tab === "history" && !!view.miner?.run_id,
    staleTime: 300000,
  });
  const tabs: Array<[DetailTab, string]> = [
    ["diagnose", t("排查")],
    ["overview", t("运行情况")],
    ["history", t("训练记录")],
    ["rewards", t("收益记录")],
  ];
  return (
    <>
      <div className="detail-tabs">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            aria-pressed={tab === key}
            data-alert={key === "diagnose" && view.diagnosis.tone === "warn" ? "yes" : undefined}
            onClick={() => onTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="detail-body">
        {tab === "diagnose" ? (
          <DiagnosisBlock diagnosis={view.diagnosis} />
        ) : tab === "overview" ? (
          <>
            <PresenceSignals miner={view.miner} />
            <div className="detail-grid">
              <div>
                <span>{t("激活处理量")}</span>
                <b>{formatCount(view.miner?.activation_count, locale)}</b>
              </div>
              <div>
                <span>{t("吞吐量")}</span>
                <b>{formatCount(view.miner?.throughput, locale)}</b>
              </div>
              <div>
                <span>{t("今日收益")}</span>
                <MoneyPair units={view.earnings?.todayUnits} usdPerIota={usdPerIota} />
              </div>
              <div>
                <span>{t("累计收益")}</span>
                <MoneyPair units={view.earnings?.totalEarnedUnits} usdPerIota={usdPerIota} />
              </div>
            </div>
            <p>
              {t("统计采样：")}
              {formatSecondsTimestamp(view.miner?.timestamp, locale)}
            </p>
            <details>
              <summary>{t("技术信息")}</summary>
              <dl>
                <dt>Miner ID</dt>
                <dd>{view.entry.hotkey}</dd>
                <dt>{t("训练任务")}</dt>
                <dd>{view.miner?.run_id || t("尚未找到")}</dd>
                <dt>{t("负责的模型分区")}</dt>
                <dd>
                  {view.miner
                    ? en
                      ? `Partition ${view.miner.layer + 1} (L${view.miner.layer})`
                      : `第 ${view.miner.layer + 1} 段（L${view.miner.layer}）`
                    : "—"}
                </dd>
                <dt>Coldkey</dt>
                <dd>{view.miner?.coldkey || "—"}</dd>
              </dl>
            </details>
          </>
        ) : tab === "history" ? (
          <>
            {series.isLoading ? (
              <p>{t("正在获取最近一周训练记录…")}</p>
            ) : series.error || series.data?.error ? (
              <p role="alert">{t(series.data?.error || "训练记录获取失败，请稍后重试。")}</p>
            ) : null}
            {series.data?.metrics?.epochs?.length ? (
              <table>
                <thead>
                  <tr>
                    <th>{t("轮次")}</th>
                    <th>{t("训练 Token")}</th>
                    <th>{t("激活排名")}</th>
                  </tr>
                </thead>
                <tbody>
                  {series.data.metrics.epochs.map((epoch, i) => (
                    <tr key={`${epoch}-${i}`}>
                      <td>{epoch}</td>
                      <td>{formatCount(series.data?.metrics?.token_counts[i], locale)}</td>
                      <td>{formatCount(series.data?.metrics?.activation_ranks[i], locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !series.isLoading && <p>{t("暂无可用的训练记录。")}</p>
            )}
          </>
        ) : (
          <>
            {view.earnings?.error && <p role="alert">{t("收益刷新失败，以下可能为旧记录。")}</p>}
            {view.earnings?.recent.length ? (
              <table>
                <thead>
                  <tr>
                    <th>{t("记账时间")}</th>
                    <th>{t("金额")}</th>
                    <th>{t("状态")}</th>
                  </tr>
                </thead>
                <tbody>
                  {view.earnings.recent.map((r, i) => (
                    <tr key={i}>
                      <td>{formatSecondsTimestamp(r.timestamp, locale)}</td>
                      <td>
                        <MoneyPair units={r.units} usdPerIota={usdPerIota} />
                      </td>
                      <td>
                        {{ pending: t("待结算"), settled: t("已结算"), frozen: t("冻结") }[
                          r.status
                        ] || r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{t("暂无收益记录。")}</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
