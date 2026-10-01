import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw } from "lucide-react";
import { useLocale } from "@/components/site/locale";
import { DataHealth } from "@/components/data-health";
import { getDeviceSeries } from "@/lib/iota.functions";
import { formatCount, formatPct, formatSecondsTimestamp } from "@/lib/format";
import { trainingRows } from "@/lib/training";
import type { DeviceView } from "@/hooks/use-iota-dashboard";

const TrainingTrend = lazy(() => import("./training-trend"));

export function DeviceHistory({ view, now }: { view: DeviceView; now: number }) {
  const { t, en, locale } = useLocale();
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const runIds = [
    ...new Set([view.miner?.run_id, ...view.runIds].filter((id): id is string => !!id)),
  ];
  const [selectedRun, setSelectedRun] = useState("");
  const runId = runIds.includes(selectedRun) ? selectedRun : runIds[0];
  const force = useRef(false);
  const lastRefresh = useRef(0);
  const fn = useServerFn(getDeviceSeries);
  const query = useQuery({
    queryKey: ["iota", "series", view.entry.hotkey, runId, period],
    queryFn: () =>
      fn({ data: { hotkey: view.entry.hotkey, runId: runId!, period, force: force.current } }),
    enabled: !!runId,
    staleTime: 60_000,
    refetchInterval: 120_000,
    retry: false,
  });
  const rows = useMemo(
    () =>
      trainingRows(
        query.data?.metrics ?? null,
        query.data?.throughput ?? null,
        query.data?.cumulative ?? null,
      ),
    [query.data],
  );
  const latest = rows[0];
  const cooldown = Math.max(0, 15_000 - (now - lastRefresh.current));
  if (!runId)
    return (
      <p>
        {en
          ? "No training run has been identified for this device yet. History will appear when official data is available."
          : "尚未找到这台设备所属的训练任务，官方记录可读取后会在这里显示。"}
      </p>
    );
  return (
    <>
      <div className="history-toolbar">
        {runIds.length > 1 && (
          <label>
            {t("训练任务")}
            <select value={runId} onChange={(event) => setSelectedRun(event.target.value)}>
              {runIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
        )}
        <div
          role="group"
          aria-label={en ? "History period" : "记录范围"}
          className="history-periods"
        >
          {(["day", "week", "month"] as const).map((key, index) => (
            <button key={key} aria-pressed={period === key} onClick={() => setPeriod(key)}>
              {
                (en ? ["24 hours", "7 days", "30 days"] : ["近 24 小时", "近 7 天", "近 30 天"])[
                  index
                ]
              }
            </button>
          ))}
        </div>
        <button
          disabled={query.isFetching || cooldown > 0}
          aria-label={en ? "Refresh training history" : "刷新训练记录"}
          onClick={async () => {
            force.current = true;
            lastRefresh.current = Date.now();
            try {
              await query.refetch({ cancelRefetch: false });
            } finally {
              force.current = false;
            }
          }}
        >
          <RefreshCw size={14} className={query.isFetching ? "spin" : ""} />
          {cooldown > 0 ? `${Math.ceil(cooldown / 1000)} s` : t("重试")}
        </button>
      </div>
      <DataHealth
        now={now}
        sources={[
          {
            label: "训练贡献",
            fetchedAt: query.data?.sources.metrics.fetchedAt ?? null,
            error: query.data?.sources.metrics.error ?? query.error?.message,
            loading: query.isFetching,
          },
          {
            label: "吞吐量",
            fetchedAt: query.data?.sources.throughput.fetchedAt ?? null,
            error: query.data?.sources.throughput.error ?? query.error?.message,
            loading: query.isFetching,
          },
          {
            label: "累计 Token",
            fetchedAt: query.data?.sources.cumulative.fetchedAt ?? null,
            error: query.data?.sources.cumulative.error ?? query.error?.message,
            loading: query.isFetching,
          },
        ]}
      />
      {(query.error || query.data?.error) && (
        <p role="alert">{t(query.data?.error || "训练记录获取失败，请稍后重试。")}</p>
      )}
      {query.isLoading && (
        <p role="status">{en ? "Loading training records…" : "正在获取训练记录…"}</p>
      )}
      {latest && (
        <div className="history-summary">
          <div>
            <span>{t("最近轮次")}</span>
            <b>{latest.epoch}</b>
          </div>
          <div>
            <span>{t("训练 Token")}</span>
            <b>{formatCount(latest.tokens, locale)}</b>
          </div>
          <div>
            <span>{t("贡献占比")}</span>
            <b>{formatPct(latest.contribution, 1, locale)}</b>
          </div>
          <div>
            <span>{t("激活排名")}</span>
            <b>
              {latest.rank && latest.participants ? `${latest.rank} / ${latest.participants}` : "—"}
            </b>
          </div>
        </div>
      )}
      {rows.length > 0 && (
        <Suspense fallback={<p>{en ? "Loading chart…" : "正在加载趋势图…"}</p>}>
          <TrainingTrend rows={rows} />
        </Suspense>
      )}
      {rows.length ? (
        <div
          className="history-table-wrap"
          role="region"
          aria-label={en ? "Training history table" : "训练记录表格"}
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>{t("轮次")}</th>
                <th>{t("训练 Token")}</th>
                <th>{t("贡献占比")}</th>
                <th>{t("激活排名")}</th>
                <th>{t("吞吐量")}</th>
                <th>{t("累计 Token")}</th>
                <th>{t("统计采样")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.epoch}>
                  <td>{row.epoch}</td>
                  <td>{formatCount(row.tokens, locale)}</td>
                  <td>{formatPct(row.contribution, 1, locale)}</td>
                  <td>{row.rank && row.participants ? `${row.rank}/${row.participants}` : "—"}</td>
                  <td>{formatCount(row.throughput, locale)}</td>
                  <td>{formatCount(row.cumulative, locale)}</td>
                  <td>{formatSecondsTimestamp(row.timestamp, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !query.isLoading && !query.error && !query.data?.error && <p>{t("暂无可用的训练记录。")}</p>
      )}
      <p className="history-note">
        {en
          ? "Series are matched by epoch. A dash means no value was reported for that metric. Counts describe official samples, not live device activity."
          : "各项记录按轮次匹配；横线表示该指标没有上报值。数据来自官方采样，不代表设备实时活动。"}
      </p>
    </>
  );
}
