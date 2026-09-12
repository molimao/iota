import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, RefreshCw, Download, Upload, Monitor, ArrowUpRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useIotaDashboard, type DeviceView } from "@/hooks/use-iota-dashboard";
import { STATUS_META, BUCKET_LABEL } from "@/lib/device-status";
import { formatIota, type Aggregate } from "@/lib/earnings";
import { formatAgo, formatCount, formatSecondsTimestamp } from "@/lib/format";
import { getDeviceSeries } from "@/lib/iota.functions";

export const Route = createFileRoute("/")({ component: Dashboard });
const money = (v: number | null | undefined) => formatIota(v ?? null, 8);
function Total({
  title,
  value,
  primary = false,
}: {
  title: string;
  value: Aggregate;
  primary?: boolean;
}) {
  return (
    <section className={`total ${primary ? "primary" : ""}`}>
      <span>{title}</span>
      <div className="amount">
        {money(value.known || !value.total ? value.units : null)} <small>IOTA</small>
      </div>
      <p>
        {value.partial
          ? `部分数据 · 已获取 ${value.known}/${value.total} 台`
          : primary
            ? "香港时间今日 00:00 起的已记账收益"
            : "所有已添加设备的累计记账收益"}
      </p>
    </section>
  );
}
function Dashboard() {
  const watch = useWatchlist();
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
            <span>我的设备</span>
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
              ? "刷新中"
              : dash.manual.cooldownRemaining > 0
                ? `${Math.ceil(dash.manual.cooldownRemaining / 1000)} 秒`
                : "立即刷新"}
          </button>
          <button className="solid" onClick={() => setAdding(true)}>
            <Plus size={17} />
            添加设备
          </button>
        </div>
      </header>
      <div className="page-title">
        <div>
          <h1>收益和运行情况，一眼看清。</h1>
          <p>{watch.devices.length} 台设备 · ID 保存在当前浏览器 · 不限设备数量</p>
        </div>
        <span className="refresh-label">最近获取 {formatAgo(dash.fetchedAt, dash.now)}</span>
      </div>
      {(watch.storageError || message) && (
        <div role="status" className="notice">
          {watch.storageError || message}
          <button aria-label="关闭提示" onClick={() => setMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {(dash.errors.length > 0 || dash.manual.error || dash.usingCachedOnly) && (
        <div className="notice warning" role="status">
          {dash.manual.error || dash.errors[0] || "正在连接，先显示浏览器保存的旧数据。"}
          <span>旧数据会保留，连接恢复后自动更新。</span>
        </div>
      )}
      <div className="totals">
        <Total primary title="今日总收益" value={dash.todayTotal} />
        <Total title="累计总收益" value={dash.lifetimeTotal} />
      </div>
      <div className="status-strip">
        {Object.entries(dash.counts).map(([key, count]) => (
          <div key={key}>
            <span>{BUCKET_LABEL[key as keyof typeof BUCKET_LABEL]}</span>
            <b>{count}</b>
          </div>
        ))}
      </div>
      <section>
        <div className="section-heading">
          <h2>
            设备 <span>{watch.devices.length}</span>
          </h2>
          <div className="actions">
            <button onClick={() => file.current?.click()}>
              <Upload size={15} />
              导入
            </button>
            <button disabled={!watch.devices.length} onClick={exportList}>
              <Download size={15} />
              导出备份
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
              const result = watch.importJson(await f.text());
              setMessage(
                result.ok
                  ? `已导入 ${result.report?.added} 台，重复 ${result.report?.duplicates} 台，无效 ${result.report?.invalid} 条。`
                  : result.error || "导入失败",
              );
            } catch {
              setMessage("文件读取失败");
            }
            e.target.value = "";
          }}
        />
        {!watch.devices.length ? (
          <div className="empty">
            <Monitor size={36} />
            <h2>把你的第一台设备加进来</h2>
            <p>打开 IOTA 应用，复制 Miner 页面里的 Miner ID。</p>
            <button className="solid" onClick={() => setAdding(true)}>
              <Plus size={16} />
              添加设备
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
                    <span className={`badge ${meta.tone}`}>{meta.label}</span>
                  </div>
                  <h3>{view.entry.label}</h3>
                  <p className="explain">{meta.explain}</p>
                  <div className="device-earnings">
                    <div>
                      <span>今日收益</span>
                      <strong>{money(view.earnings?.todayUnits)}</strong>
                    </div>
                    <div>
                      <span>累计收益</span>
                      <strong>{money(view.earnings?.totalEarnedUnits)}</strong>
                    </div>
                  </div>
                  <div className="device-foot">
                    <span>
                      {view.earnings && !view.earningsUsable
                        ? "收益为旧数据 · IOTA"
                        : "IOTA · 子网代币"}{" "}
                    </span>
                    <button onClick={() => setSelected(view.entry.hotkey)}>
                      查看详情
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
        <span>每 5 秒检查更新；官方状态缓存 60 秒，收益缓存 5 分钟。支持手动刷新。</span>
        <span>仅查询公开数据；清理浏览器数据会移除设备清单，请先导出备份。</span>
      </footer>
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogTitle>添加设备</DialogTitle>
          <DialogDescription>填写公开的 Miner ID，不需要私钥或助记词。</DialogDescription>
          <form
            className="device-form"
            onSubmit={(e) => {
              e.preventDefault();
              const result = watch.add({ label, hotkey });
              if (result.ok) {
                setAdding(false);
                setLabel("");
                setHotkey("");
                setMessage("设备已保存到此浏览器。");
              } else setMessage(result.error || "保存失败");
            }}
          >
            <label>
              设备名称
              <input
                required
                maxLength={40}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="例如：家里的 Mac"
              />
            </label>
            <label>
              Miner ID
              <input
                required
                value={hotkey}
                onChange={(e) => setHotkey(e.target.value)}
                placeholder="从 IOTA 应用复制完整 ID"
              />
            </label>
            {message && <p role="alert">{message}</p>}
            <button className="solid" type="submit">
              保存设备
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
        <DialogContent className="detail-dialog">
          {active && (
            <>
              <DialogTitle>{active.entry.label}</DialogTitle>
              <DialogDescription>{STATUS_META[active.status].explain}</DialogDescription>
              <DeviceDetail key={active.entry.hotkey} view={active} />
              <div className="actions detail-actions">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(active.entry.hotkey);
                      setMessage("Miner ID 已复制");
                    } catch {
                      setMessage("复制失败，请展开技术信息手动复制。");
                    }
                  }}
                >
                  复制 ID
                </button>
                <button
                  onClick={() => {
                    const name = window.prompt("设备名称", active.entry.label);
                    if (name !== null) {
                      const r = watch.rename(active.entry.hotkey, name);
                      setMessage(r.ok ? "名称已保存" : r.error || "保存失败");
                    }
                  }}
                >
                  改名
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    if (
                      window.confirm(`从本浏览器移除「${active.entry.label}」？不会停止设备训练。`)
                    ) {
                      watch.remove(active.entry.hotkey);
                      setSelected(null);
                    }
                  }}
                >
                  移除设备
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
function DeviceDetail({ view }: { view: DeviceView }) {
  const [tab, setTab] = useState("运行情况");
  const seriesFn = useServerFn(getDeviceSeries);
  const series = useQuery({
    queryKey: ["series", view.entry.hotkey, view.miner?.run_id],
    queryFn: () =>
      seriesFn({ data: { hotkey: view.entry.hotkey, runId: view.miner!.run_id, period: "week" } }),
    enabled: tab === "训练记录" && !!view.miner?.run_id,
    staleTime: 300000,
  });
  return (
    <>
      <div className="detail-tabs">
        {["运行情况", "训练记录", "收益记录"].map((t) => (
          <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="detail-body">
        {tab === "运行情况" ? (
          <>
            <div className="detail-grid">
              <div>
                <span>激活处理量</span>
                <b>{formatCount(view.miner?.activation_count)}</b>
              </div>
              <div>
                <span>吞吐量（官方上报）</span>
                <b>{formatCount(view.miner?.throughput)}</b>
              </div>
              <div>
                <span>今日收益 · IOTA</span>
                <b>{money(view.earnings?.todayUnits)}</b>
              </div>
              <div>
                <span>累计收益 · IOTA</span>
                <b>{money(view.earnings?.totalEarnedUnits)}</b>
              </div>
            </div>
            <p>统计采样：{formatSecondsTimestamp(view.miner?.timestamp)}。采样时间不是本机心跳。</p>
            <details>
              <summary>技术信息</summary>
              <dl>
                <dt>Miner ID</dt>
                <dd>{view.entry.hotkey}</dd>
                <dt>训练任务</dt>
                <dd>{view.miner?.run_id || "尚未找到"}</dd>
                <dt>负责的模型分区</dt>
                <dd>
                  {view.miner ? `第 ${view.miner.layer + 1} 段（L${view.miner.layer}）` : "—"}
                </dd>
                <dt>Coldkey</dt>
                <dd>{view.miner?.coldkey || "—"}</dd>
              </dl>
            </details>
          </>
        ) : tab === "训练记录" ? (
          <>
            {series.isLoading ? (
              <p>正在获取最近一周训练记录…</p>
            ) : series.error || series.data?.error ? (
              <p role="alert">{series.data?.error || "训练记录获取失败，请稍后重试。"}</p>
            ) : null}
            {series.data?.metrics?.epochs?.length ? (
              <table>
                <thead>
                  <tr>
                    <th>轮次</th>
                    <th>训练 Token</th>
                    <th>激活排名</th>
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
              !series.isLoading && <p>暂无可用的训练记录。</p>
            )}
          </>
        ) : (
          <>
            {view.earnings?.error && <p role="alert">收益刷新失败，以下可能为旧记录。</p>}
            {view.earnings?.recent.length ? (
              <table>
                <thead>
                  <tr>
                    <th>记账时间</th>
                    <th>IOTA</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {view.earnings.recent.map((r, i) => (
                    <tr key={i}>
                      <td>{formatSecondsTimestamp(r.timestamp)}</td>
                      <td>{money(r.units)}</td>
                      <td>
                        {{ pending: "待结算", settled: "已结算", frozen: "冻结" }[r.status] ||
                          r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>暂无收益记录。</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
