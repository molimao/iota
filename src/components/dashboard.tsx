import { useLocale } from "@/components/site/locale";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Plus,
  RefreshCw,
  Download,
  Upload,
  Monitor,
  ArrowUpRight,
  X,
  LogIn,
  LogOut,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useIotaDashboard, type DeviceView } from "@/hooks/use-iota-dashboard";
import { STATUS_META, BUCKET_LABEL } from "@/lib/device-status";
import { formatIota, formatUsd, iotaUnitsToUsd, type Aggregate } from "@/lib/earnings";
import { formatAgo, formatCount, formatSecondsTimestamp } from "@/lib/format";
import { getDeviceSeries } from "@/lib/iota.functions";

function MoneyPair({
  units,
  usdPerIota,
  large = false,
}: {
  units: number | null | undefined;
  usdPerIota: number | null;
  large?: boolean;
}) {
  const iota = formatIota(units ?? null, 8);
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
  const { t, en } = useLocale();
  const units = value.known || !value.total ? value.units : null;
  return (
    <section className={`total ${primary ? "primary" : ""}`}>
      <span>{title}</span>
      <div className="amount">
        <MoneyPair large units={units} usdPerIota={usdPerIota} />
      </div>
      <p>
        {value.partial
          ? en
            ? `Partial · ${value.known}/${value.total} devices`
            : `部分数据 · 已获取 ${value.known}/${value.total} 台`
          : primary
            ? t("香港时间今日 00:00 起的已记账收益")
            : t("所有已添加设备的累计记账收益")}
      </p>
    </section>
  );
}
export function Dashboard() {
  const { t, en } = useLocale();
  const auth = useAuth();
  const watch = useWatchlist(auth.userId, auth.ready);
  const atLimit = watch.devices.length >= watch.limit;
  const dash = useIotaDashboard(watch.devices, watch.loaded);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [hotkey, setHotkey] = useState("");
  const [message, setMessage] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const active = dash.views.find((v) => v.entry.hotkey === selected);
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
          <button
            onClick={() => void dash.refresh()}
            disabled={
              !watch.devices.length || dash.manual.running || dash.manual.cooldownRemaining > 0
            }
          >
            <RefreshCw size={16} className={dash.manual.running ? "spin" : ""} />
            {dash.manual.running
              ? t("刷新中")
              : dash.manual.cooldownRemaining > 0
                ? `${Math.ceil(dash.manual.cooldownRemaining / 1000)} s`
                : t("立即刷新")}
          </button>
          {auth.userId ? (
            <button onClick={() => void auth.signOut()}>
              <LogOut size={16} />
              {t("退出登录")}
            </button>
          ) : (
            <button onClick={() => void auth.signInWithGoogle()} disabled={auth.signingIn}>
              <LogIn size={16} />
              {auth.signingIn ? t("正在登录") : t("用 Google 登录")}
            </button>
          )}
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
      <div className="page-title">
        <div>
          <h1>{t("收益和运行情况，一眼看清。")}</h1>
          <p>
            {watch.devices.length}/{watch.limit}{" "}
            {auth.userId
              ? t("台设备 · 已绑定到 Google 账号")
              : t("台设备 · 未登录保存在此浏览器，登录后最多 10 台并可换设备查看")}
          </p>
          {auth.email ? <span className="account-email">{auth.email}</span> : null}
        </div>
        <span className="refresh-label">
          {t("最近获取")}
          {en
            ? dash.fetchedAt
              ? new Date(dash.fetchedAt).toLocaleTimeString("en-GB", { timeZone: "Asia/Hong_Kong" })
              : "No data yet"
            : formatAgo(dash.fetchedAt, dash.now)}
        </span>
      </div>
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
          {dash.manual.error || dash.errors[0] || t("正在连接，先显示浏览器保存的旧数据。")}
          <span>{t("旧数据会保留，连接恢复后自动更新。")}</span>
        </div>
      )}
      <div className="totals">
        <Total
          primary
          title={t("今日总收益")}
          value={dash.todayTotal}
          usdPerIota={dash.usdPerIota}
        />
        <Total title={t("累计总收益")} value={dash.lifetimeTotal} usdPerIota={dash.usdPerIota} />
      </div>
      <p className="fx-note">
        {dash.usdPerIota
          ? `${t("美元按公开市场价格估算")} · 1 IOTA ≈ ${formatUsd(dash.usdPerIota)}`
          : t("美元价格暂未获取，IOTA 数量仍按官方记账显示")}
      </p>
      <div className="status-strip">
        {Object.entries(dash.counts).map(([key, count]) => (
          <div key={key}>
            <span>{t(BUCKET_LABEL[key as keyof typeof BUCKET_LABEL])}</span>
            <b>{count}</b>
          </div>
        ))}
      </div>
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
            <button disabled={!watch.devices.length} onClick={exportList}>
              <Download size={15} />
              {t("导出备份")}
            </button>
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
                    <span className={`badge ${meta.tone}`}>{t(meta.label)}</span>
                  </div>
                  <h3>{view.entry.label}</h3>
                  <p className="explain">{t(meta.explain)}</p>
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
                      {view.earnings && !view.earningsUsable
                        ? t("收益为旧数据 · IOTA")
                        : t("IOTA · 子网代币")}{" "}
                    </span>
                    <button onClick={() => setSelected(view.entry.hotkey)}>
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
      <footer>
        <span>{t("每 5 秒检查更新；官方状态缓存 60 秒，收益缓存 5 分钟。支持手动刷新。")}</span>
        <span>
          {auth.userId
            ? t("仅查询公开数据。登录后清单绑定账号；退出后此浏览器仍保留未登录时的本地副本。")
            : t("仅查询公开数据；未登录时清理浏览器数据会移除本地清单，请先导出备份。")}
        </span>
      </footer>
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="dash-dialog">
          <DialogTitle>{t("添加设备")}</DialogTitle>
          <DialogDescription>{t("填写公开的 Miner ID，不需要私钥或助记词。")}</DialogDescription>
          <form
            className="device-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const result = await watch.add({ label, hotkey });
              if (result.ok) {
                setAdding(false);
                setLabel("");
                setHotkey("");
                setMessage(
                  watch.cloud ? t("设备已绑定到你的账号。") : t("设备已保存到此浏览器。"),
                );
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
              <DialogDescription>{t(STATUS_META[active.status].explain)}</DialogDescription>
              <DeviceDetail
                key={active.entry.hotkey}
                view={active}
                usdPerIota={dash.usdPerIota}
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
function DeviceDetail({ view, usdPerIota }: { view: DeviceView; usdPerIota: number | null }) {
  const { t, en } = useLocale();
  const [tab, setTab] = useState(t("运行情况"));
  const seriesFn = useServerFn(getDeviceSeries);
  const series = useQuery({
    queryKey: ["series", view.entry.hotkey, view.miner?.run_id],
    queryFn: () =>
      seriesFn({ data: { hotkey: view.entry.hotkey, runId: view.miner!.run_id, period: "week" } }),
    enabled: tab === t("训练记录") && !!view.miner?.run_id,
    staleTime: 300000,
  });
  return (
    <>
      <div className="detail-tabs">
        {[t("运行情况"), t("训练记录"), t("收益记录")].map((tabName) => (
          <button key={tabName} aria-pressed={tab === tabName} onClick={() => setTab(tabName)}>
            {tabName}
          </button>
        ))}
      </div>
      <div className="detail-body">
        {tab === t("运行情况") ? (
          <>
            <div className="detail-grid">
              <div>
                <span>{t("激活处理量")}</span>
                <b>{formatCount(view.miner?.activation_count)}</b>
              </div>
              <div>
                <span>{t("吞吐量（官方上报）")}</span>
                <b>{formatCount(view.miner?.throughput)}</b>
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
              {formatSecondsTimestamp(view.miner?.timestamp)}
              {t("。采样时间不是本机心跳。")}
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
        ) : tab === t("训练记录") ? (
          <>
            {series.isLoading ? (
              <p>{t("正在获取最近一周训练记录…")}</p>
            ) : series.error || series.data?.error ? (
              <p role="alert">{series.data?.error || t("训练记录获取失败，请稍后重试。")}</p>
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
                      <td>{formatCount(series.data?.metrics?.token_counts[i])}</td>
                      <td>{formatCount(series.data?.metrics?.activation_ranks[i])}</td>
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
                      <td>{formatSecondsTimestamp(r.timestamp)}</td>
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
