import { localizeValue } from "@/components/site/localization";
import { withLocales } from "@/components/site/localization";
import { useLocale } from "@/components/site/locale";
import { useEffect, useState, useRef } from "react";
import {
  Plus,
  RefreshCw,
  Download,
  Upload,
  Monitor,
  ArrowUpRight,
  Stethoscope,
  X,
  LoaderCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FarmLine } from "@/components/farm-view";
import { DeviceForm } from "@/components/device-form";
import { DeviceActions } from "@/components/device-actions";
import { DataHealth } from "@/components/data-health";
import { useAuth } from "@/hooks/use-auth";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useIotaDashboard, type DeviceView } from "@/hooks/use-iota-dashboard";
import {
  BUCKET_LABEL,
  STATUS_META,
  officialSignals,
  type OfficialSignal,
  type StatusBucket,
} from "@/lib/device-status";
import { RECONCILE_NOTES, type Diagnosis } from "@/lib/diagnose";
import { formatIota, formatUsd, iotaUnitsToUsd, type Aggregate } from "@/lib/earnings";
import { formatAgo, formatCount, formatSecondsTimestamp } from "@/lib/format";
import { DeviceHistory } from "@/components/device-history";

type DetailTab = "diagnose" | "overview" | "history" | "rewards";

function signalText(signal: OfficialSignal, t: (key: string) => string) {
  if (signal === "yes") return t("是");
  if (signal === "no") return t("否");
  return t("还看不到");
}

function PresenceSignals({ miner }: { miner: DeviceView["miner"] }) {
  const { t, en, locale } = useLocale();
  const signals = officialSignals(miner);
  return (
    <div className="presence">
      <div>
        <span>{localizeValue(en ? "Official active flag" : "官方活跃标记", locale)}</span>
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
  const { locale, en } = useLocale();
  const iota = formatIota(units ?? null, 8, locale);
  const usd = formatUsd(iotaUnitsToUsd(units ?? null, usdPerIota));
  return (
    <span className={`money-pair${large ? " large" : ""}`}>
      <strong>
        {iota} <small>IOTA</small>
      </strong>
      <em>
        <span>{usd} USD</span>
        {large && <small>{localizeValue(en ? "Estimated value" : "美元估值", locale)}</small>}
      </em>
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
  const { t, en, locale } = useLocale();
  return (
    <section className={`total ${primary ? "primary" : ""}`}>
      <div className="earnings-card-heading">
        <h2>{title}</h2>
      </div>
      <div className="amount">
        <MoneyPair large units={units} usdPerIota={usdPerIota} />
      </div>
      <p>{primary ? t("香港时间今日 00:00 起的已记账收益") : t("所有已添加设备的累计记账收益")}</p>
      {value.partial && (
        <p className="coverage-note" role="status">
          {value.known
            ? localizeValue(
                en
                  ? `Partial total · ${value.known}/${value.total} devices`
                  : `部分合计 · 已获取 ${value.known}/${value.total} 台`,
                locale,
              )
            : localizeValue(en ? "Rewards are not available yet" : "收益数据暂未获取", locale)}
        </p>
      )}
    </section>
  );
}

function DiagnosisBlock({ diagnosis: originalDiagnosis }: { diagnosis: Diagnosis }) {
  const { locale, en } = useLocale();
  const diagnosis = withLocales(originalDiagnosis);
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
              {localizeValue(en ? "Details" : "说明", locale)}
              <ArrowUpRight size={14} />
            </a>
          ) : null}
        </section>
      ))}
      <details className="diagnosis-reconcile">
        <summary>
          {localizeValue(en ? "Numbers differ from another source" : "与其他来源不一致", locale)}
        </summary>
        <dl>
          {withLocales(RECONCILE_NOTES).map((item) => (
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
            <span>{withLocales(view.diagnosis.primary.title)[locale]}</span>
            <ArrowUpRight size={14} />
          </button>
        ))}
        {views.length > 3 ? (
          <p>
            {localizeValue(
              en ? `And ${views.length - 3} more.` : `还有 ${views.length - 3} 台。`,
              locale,
            )}
          </p>
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
  const [hotkey, setHotkey] = useState("");
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<StatusBucket | "all">("all");
  const file = useRef<HTMLInputElement>(null);
  const active = dash.views.find((v) => v.entry.hotkey === selected);
  const visible =
    filter === "all" ? dash.views : dash.views.filter((view) => view.bucket === filter);

  function openAdd() {
    if (!watch.loaded) return;
    if (atLimit) setMessage(watch.limitMessage);
    else {
      setHotkey("");
      setAdding(true);
    }
  }

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
            <span className="eyebrow">
              IOTA WATCH / {localizeValue(en ? "MONITOR" : "设备监控", locale)}
            </span>
            <h1>{t("我的设备")}</h1>
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
          <button className="solid" disabled={!watch.loaded || importing} onClick={openAdd}>
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
                  {auth.name || auth.email || localizeValue(en ? "Signed in" : "已登录", locale)}
                </a>
                {` · ${watch.devices.length}/${watch.limit}`}
              </>
            ) : (
              `${watch.devices.length}/${watch.limit} · ${localizeValue(en ? "Saved in this browser" : "保存在此浏览器", locale)}`
            )}
          </p>
          <span className="refresh-label">
            {dash.loading ? (
              t("正在获取设备数据…")
            ) : (
              <>
                {t("最近获取")} {formatAgo(dash.fetchedAt, dash.now, locale)}
              </>
            )}
          </span>
        </div>
      ) : null}
      {!dash.online && (
        <div className="notice warning" role="status">
          {localizeValue(
            en
              ? "You are offline. Keeping previous data; updates resume when you reconnect."
              : "当前网络已断开，保留上次数据；连接恢复后会自动更新。",
            locale,
          )}
        </div>
      )}
      {(watch.storageError || auth.error) && (
        <div role="alert" className="notice warning">
          {t(watch.storageError || auth.error || "")}
        </div>
      )}
      {(watch.syncMessage || message) && (
        <div role="status" className="notice">
          {t(message || watch.syncMessage || "")}
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
            <p className="fx-note">
              1 IOTA ≈ {formatUsd(dash.usdPerIota)} · {t("美元按公开市场价格估算")} ·{" "}
              {dash.priceSource === "taostats-sn9" ? (
                <a href="https://taostats.io/subnets/9" target="_blank" rel="noopener noreferrer">
                  Taostats · SN9 × TAO/USD
                </a>
              ) : (
                dash.priceSource
              )}{" "}
              {dash.priceQuotedAt !== null && (
                <>
                  {" "}
                  · {t("报价")} {formatAgo(dash.priceQuotedAt, dash.now, locale)}
                </>
              )}
              {" · "}
              {t("获取")} {formatAgo(dash.priceFetchedAt, dash.now, locale)}
              {dash.priceStale
                ? ` · ${t(dash.priceRefreshFailed ? "行情刷新失败" : "报价较早")}`
                : ""}
            </p>
          ) : (
            <p className="fx-note" role="status">
              {dash.priceLoading
                ? t("正在读取美元行情…")
                : t("美元行情暂不可用，收益仍按官方 IOTA 记账。")}
            </p>
          )}
          <AttentionBanner
            views={dash.needsAttention}
            onOpen={(hotkey) => openDevice(hotkey, "diagnose")}
          />
        </>
      ) : null}
      {watch.devices.length > 0 && (
        <DataHealth
          now={dash.now}
          sources={[
            {
              label: "设备状态",
              fetchedAt: dash.fetchedAt,
              error: dash.statusError,
              partial: dash.statusPartial,
              loading: dash.fetching,
            },
            {
              label: "收益记账",
              fetchedAt: dash.earningsFetchedAt,
              error: dash.views.some((view) => !view.earningsUsable) ? "partial" : null,
              loading: dash.earningsFetching,
              maxAgeMs: 15 * 60_000,
            },
          ]}
          note={localizeValue(
            en
              ? "Official cache: status 1 min, rewards 5 min. Sample time is not a device heartbeat."
              : "官方接口缓存：状态 1 分钟，收益 5 分钟。采样时间不代表设备心跳。",
            locale,
          )}
        />
      )}
      <section>
        <div className="section-heading">
          <h2>
            {t("设备")}
            <span>{watch.devices.length}</span>
          </h2>
          <div className="actions">
            <button disabled={!watch.loaded || importing} onClick={() => file.current?.click()}>
              {importing ? <LoaderCircle size={15} className="spin" /> : <Upload size={15} />}
              {importing ? t("导入中…") : t("导入")}
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
            const input = e.currentTarget;
            setImporting(true);
            try {
              const result = await watch.importJson(await f.text());
              setMessage(
                result.ok
                  ? localizeValue(
                      en
                        ? `Imported ${result.report?.added}; duplicates ${result.report?.duplicates}; invalid ${result.report?.invalid}.`
                        : `已导入 ${result.report?.added} 台，重复 ${result.report?.duplicates} 台，无效 ${result.report?.invalid} 条。`,
                      locale,
                    )
                  : result.error || t("导入失败"),
              );
            } catch {
              setMessage(t("文件读取失败"));
            } finally {
              input.value = "";
              setImporting(false);
            }
          }}
        />
        {!watch.loaded ? (
          <div className="empty" role="status" aria-busy="true">
            <LoaderCircle size={28} className="spin" />
            <p>{t("正在读取设备清单…")}</p>
          </div>
        ) : !watch.devices.length ? (
          <div className="empty">
            <Monitor size={36} />
            <h2>{t("添加第一台设备")}</h2>
            <p>{t("打开 IOTA 应用，复制 Miner 页面里的 Miner ID。")}</p>
            <button className="solid" disabled={importing} onClick={openAdd}>
              <Plus size={16} />
              {t("添加设备")}
            </button>
          </div>
        ) : (
          <>
            <div className="device-mix" aria-hidden="true">
              {(Object.keys(BUCKET_LABEL) as StatusBucket[]).map((bucket) => (
                <i
                  key={bucket}
                  data-bucket={bucket}
                  style={{
                    width: `${dash.views.length ? (dash.counts[bucket] / dash.views.length) * 100 : 0}%`,
                  }}
                />
              ))}
            </div>
            <div
              className="device-filters"
              role="group"
              aria-label={localizeValue(en ? "Filter by device status" : "按设备状态筛选", locale)}
            >
              <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
                {t("全部")} <b>{dash.views.length}</b>
              </button>
              {(Object.keys(BUCKET_LABEL) as StatusBucket[]).map((bucket) => (
                <button
                  key={bucket}
                  data-bucket={bucket}
                  aria-pressed={filter === bucket}
                  onClick={() => setFilter(bucket)}
                >
                  {t(BUCKET_LABEL[bucket])} <b>{dash.counts[bucket]}</b>
                </button>
              ))}
            </div>
            {!visible.length && (
              <div className="filter-empty">
                <p>{t("这个状态下暂无设备。")}</p>
                <button onClick={() => setFilter("all")}>{t("查看全部设备")}</button>
              </div>
            )}
            <div className="devices">
              {visible.map((view) => {
                const meta = STATUS_META[view.status];
                return (
                  <article className="device" key={view.entry.hotkey}>
                    <div className="device-top">
                      <span className="device-icon">
                        <Monitor size={22} />
                      </span>
                      <button
                        className={`badge ${meta.tone}`}
                        data-bucket={view.bucket}
                        title={localizeValue(en ? "Status details" : "状态说明", locale)}
                        onClick={() => openDevice(view.entry.hotkey, "diagnose")}
                      >
                        {t(meta.label)}
                      </button>
                    </div>
                    <h3>
                      <button className="device-name" onClick={() => openDevice(view.entry.hotkey)}>
                        {view.entry.label}
                      </button>
                    </h3>
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
                      <span>
                        {formatAgo(view.statusFetchedAt, dash.now, locale)}
                        {view.statusStale ? ` · ${t("状态为旧数据")}` : ""}
                        {view.earnings && !view.earningsUsable ? ` · ${t("收益为旧数据")}` : ""}
                      </span>
                      <button onClick={() => openDevice(view.entry.hotkey)}>
                        {t("查看详情")}
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
      {watch.loaded && (
        <p className="storage-note">
          {watch.cloud
            ? localizeValue(
                en
                  ? "Device list saved to your account. You can view it on other devices after signing in."
                  : "设备清单已绑定账号，登录后可在其他设备查看。",
                locale,
              )
            : localizeValue(
                en
                  ? "Device list saved in this browser. Export a backup before clearing browser data."
                  : "设备清单保存在此浏览器，清理浏览器数据前请导出备份。",
                locale,
              )}
        </p>
      )}
      {dash.farm ? (
        <FarmLine farm={dash.farm} deviceCount={watch.devices.length} stale={dash.farmStale} />
      ) : null}
      <Dialog
        open={adding}
        onOpenChange={(open) => {
          if (!saving) setAdding(open);
        }}
      >
        <DialogContent className="dash-dialog">
          <DialogTitle>{t("添加设备")}</DialogTitle>
          <DialogDescription>
            {localizeValue(
              en ? "Paste the public ID from the Miner page." : "粘贴 Miner 页面中的公开 ID。",
              locale,
            )}
          </DialogDescription>
          <DeviceForm
            initialHotkey={hotkey}
            duplicateIds={watch.devices.map((device) => device.hotkey)}
            onCancel={() => setAdding(false)}
            onSave={async (input) => {
              setSaving(true);
              try {
                const result = await watch.add(input);
                if (result.ok) {
                  setAdding(false);
                  setHotkey("");
                  setMessage(
                    watch.cloud ? t("设备已绑定到你的账号。") : t("设备已保存到此浏览器。"),
                  );
                }
                return result;
              } finally {
                setSaving(false);
              }
            }}
          />
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
                now={dash.now}
              />
              <DeviceActions
                key={`actions-${active.entry.hotkey}`}
                entry={active.entry}
                cloud={watch.cloud}
                onRename={watch.rename}
                onRemove={watch.remove}
                onRemoved={() => {
                  setSelected(null);
                  setMessage(t("设备已移除"));
                }}
              />
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
  now,
}: {
  view: DeviceView;
  usdPerIota: number | null;
  tab: DetailTab;
  onTab: (tab: DetailTab) => void;
  now: number;
}) {
  const { t, en, locale } = useLocale();
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
            <DataHealth
              now={now}
              sources={[
                {
                  label: "设备状态",
                  fetchedAt: view.statusFetchedAt,
                  error: view.statusStale ? "stale" : null,
                  loading: false,
                },
                {
                  label: "收益记账",
                  fetchedAt: view.earnings?.fetchedAt ?? null,
                  error: view.earnings?.error ?? null,
                  loading: false,
                  maxAgeMs: 15 * 60_000,
                },
              ]}
            />
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
            {view.miner && (
              <p>
                {t("训练任务")} · {view.miner.run_id}
                {view.miner.location_country
                  ? ` · ${view.miner.location_name || ""} ${view.miner.location_country}`
                  : ""}
              </p>
            )}
            <p>
              {t("统计采样：")}
              {formatSecondsTimestamp(view.miner?.timestamp, locale)}
            </p>
            <p>{t("依据官方最近一次采样，不是这台电脑的心跳。")}</p>
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
                    ? localizeValue(
                        en
                          ? `Partition ${view.miner.layer + 1} (L${view.miner.layer})`
                          : `第 ${view.miner.layer + 1} 段（L${view.miner.layer}）`,
                        locale,
                      )
                    : "—"}
                </dd>
                <dt>Coldkey</dt>
                <dd>{view.miner?.coldkey || "—"}</dd>
              </dl>
            </details>
          </>
        ) : tab === "history" ? (
          <DeviceHistory view={view} now={now} />
        ) : (
          <>
            <DataHealth
              now={now}
              sources={[
                {
                  label: "累计记账",
                  fetchedAt: view.earnings?.totalsFetchedAt ?? null,
                  error: view.earnings?.totalsError ?? null,
                  loading: false,
                  maxAgeMs: 15 * 60_000,
                },
                {
                  label: "收益记录",
                  fetchedAt: view.earnings?.historyFetchedAt ?? null,
                  error: view.earnings?.historyError ?? null,
                  loading: false,
                  maxAgeMs: 15 * 60_000,
                },
              ]}
            />
            <div className="detail-grid reward-balances">
              <div>
                <span>{t("累计收益")}</span>
                <MoneyPair units={view.earnings?.totalEarnedUnits} usdPerIota={usdPerIota} />
              </div>
              <div>
                <span>{t("已支付")}</span>
                <MoneyPair units={view.earnings?.paidUnits} usdPerIota={usdPerIota} />
              </div>
              <div>
                <span>{t("待结算")}</span>
                <MoneyPair units={view.earnings?.pendingUnits} usdPerIota={usdPerIota} />
              </div>
              <div>
                <span>{t("冻结")}</span>
                <MoneyPair units={view.earnings?.frozenUnits} usdPerIota={usdPerIota} />
              </div>
            </div>
            <p>
              {t("最低支付金额")} ·{" "}
              {formatIota(view.earnings?.minimumPayoutUnits ?? null, 8, locale)} IOTA
            </p>
            <p>
              {localizeValue(
                en
                  ? "Paid and pending are accounting balances; they are not added again to lifetime rewards. Frozen records are excluded from today's total."
                  : "已支付、待结算为记账余额，不会重复加进累计收益。冻结记录不计入今日收益。",
                locale,
              )}
            </p>
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
              <p>
                {view.earnings?.historyFetchedAt && !view.earnings?.historyError
                  ? t("暂无收益记录。")
                  : localizeValue(
                      en ? "Reward records are not available yet." : "收益记录暂未获取。",
                      locale,
                    )}
              </p>
            )}
            {!!view.earnings?.recent.length && (
              <p>
                {localizeValue(
                  en
                    ? `Showing the latest ${view.earnings.recent.length} of ${view.earnings.historyCount} records. Times use Hong Kong (UTC+8).`
                    : `显示最近 ${view.earnings.recent.length} 条，共 ${view.earnings.historyCount} 条记录。时间按香港时间（UTC+8）显示。`,
                  locale,
                )}
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
