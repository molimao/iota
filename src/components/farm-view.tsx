import { localizeValue } from "@/components/site/localization";
import { ArrowUpRight, Activity, Layers, Users, Gauge } from "lucide-react";

import { MinerDistribution } from "@/components/miner-distribution";
import { useLocale } from "@/components/site/locale";
import type { FarmSummary } from "@/lib/farm";
import { formatCount, formatLoss, formatPct } from "@/lib/format";

function lossRange(min: number | null, max: number | null) {
  if (min === null) return "—";
  if (max === null || max === min) return formatLoss(min);
  return `${formatLoss(min)} – ${formatLoss(max)}`;
}

/** Tiers that at least one of the visitor's own devices sits in. */
function myTiers(farm: FarmSummary): string[] {
  const tiers = new Set<string>();
  for (const run of farm.runs) {
    if (run.mineCount > 0 && run.tier) tiers.add(run.tier);
  }
  return [...tiers];
}

/**
 * One line on the dashboard. Answers "where am I, is there room" and links
 * out — the full network breakdown lives on its own page.
 */
export function FarmLine({
  farm,
  deviceCount,
  stale = false,
}: {
  farm: FarmSummary;
  deviceCount: number;
  stale?: boolean;
}) {
  const { t, en, locale } = useLocale();
  const mine = myTiers(farm);
  const parts: string[] = [];
  if (deviceCount > 0 && mine.length) {
    parts.push(`${t("你在")} ${mine.join(" / ")}`);
  }
  if (farm.activeMiners !== null && farm.maxMiners !== null) {
    parts.push(
      `${t("全网名额")} ${formatCount(farm.activeMiners, locale)} / ${formatCount(farm.maxMiners, locale)}`,
    );
  }
  if (farm.slotsRemaining !== null) {
    parts.push(`${t("剩余")} ${formatCount(farm.slotsRemaining, locale)}`);
  }
  if (farm.training !== null) {
    parts.push(`${formatCount(farm.training, locale)} ${t("台在训练")}`);
  }
  if (stale) parts.push(t("全网部分数据未刷新"));
  return (
    <a className="farm-line" href={`/${locale}/network`}>
      <span>
        {parts.join(" · ") ||
          localizeValue(en ? "View network training" : "查看全网训练情况", locale)}
      </span>
      <ArrowUpRight size={15} />
    </a>
  );
}

/** Everything known about the network. Lives on /network, never on the dashboard. */
export function FarmFull({ farm, partial = false }: { farm: FarmSummary; partial?: boolean }) {
  const { t, en, locale } = useLocale();
  const fill =
    farm.maxMiners && farm.maxMiners > 0 && farm.activeMiners !== null
      ? Math.min(100, (farm.activeMiners / farm.maxMiners) * 100)
      : 0;
  const meta = [farm.modelLabel, farm.modelSize, farm.splits ? `${farm.splits} ${t("段")}` : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="farm">
      <div className="farm-head">
        <span>
          {meta}
          {meta ? " · " : ""}
          <a href="https://iota.macrocosmos.ai/dashboard/mainnet" target="_blank" rel="noreferrer">
            {t("官方面板")}
          </a>
        </span>
      </div>
      <div className="farm-stats">
        <div className="network-stat" data-tone="blue">
          <Users size={18} aria-hidden="true" />
          <span>{localizeValue(en ? "Roster miners" : "名单矿工", locale)}</span>
          <b>{formatCount(farm.listed, locale)}</b>
          <small>
            {localizeValue(
              en ? "Unique Miner IDs in fetched rosters" : "已读取名单，按 Miner ID 去重",
              locale,
            )}
          </small>
        </div>
        <div className="network-stat" data-tone="mint">
          <Activity size={18} aria-hidden="true" />
          <span>{t("已开始训练")}</span>
          <b>{formatCount(farm.training, locale)}</b>
          <small>
            {localizeValue(en ? "Reported throughput above zero" : "上报吞吐量大于零", locale)}
          </small>
        </div>
        <div className="network-stat" data-tone="amber">
          <Layers size={18} aria-hidden="true" />
          <span>{t("剩余名额")}</span>
          <b>{formatCount(farm.slotsRemaining, locale)}</b>
          <small>
            {formatCount(farm.activeRuns, locale)} {t("个任务")}
          </small>
        </div>
        <div className="network-stat" data-tone="purple">
          <Gauge size={18} aria-hidden="true" />
          <span>{t("训练进度")}</span>
          <b>{formatPct(farm.tokens, farm.totalTokens, locale)}</b>
          <small>
            {t("损失")} {lossRange(farm.lossMin, farm.lossMax)}
          </small>
        </div>
      </div>
      <div className="network-visuals">
        <MinerDistribution farm={farm} partial={partial} />
        <section className="viz-panel capacity-panel" aria-labelledby="capacity-title">
          <header className="viz-heading">
            <div>
              <span className="viz-kicker">
                <Activity size={14} />
                {localizeValue(en ? "CAPACITY" : "网络容量", locale)}
              </span>
              <h2 id="capacity-title">
                {localizeValue(en ? "Slots & training" : "名额与训练", locale)}
              </h2>
            </div>
          </header>
          <div className="capacity-total">
            <b>{formatCount(farm.activeMiners, locale)}</b>
            <span> / {formatCount(farm.maxMiners, locale)}</span>
          </div>
          <p className="capacity-label">{t("占用名额")}</p>
          <div className="capacity-track" aria-hidden="true">
            <i style={{ width: `${fill}%` }} />
          </div>
          <div className="capacity-legend">
            <span>
              <i />
              {t("占用名额")}
            </span>
            <b>{formatPct(farm.activeMiners, farm.maxMiners, locale)}</b>
          </div>
          <div className="participation-readout">
            <span>
              {localizeValue(en ? "Training / roster miners" : "已训练 / 名单矿工", locale)}
            </span>
            <b>
              {formatCount(farm.training, locale)} / {formatCount(farm.listed, locale)}
            </b>
          </div>
          <div className="participation-track" aria-hidden="true">
            <i
              style={{
                width: `${farm.listed && farm.training !== null ? Math.min(100, (farm.training / farm.listed) * 100) : 0}%`,
              }}
            />
          </div>
          <p className="viz-note">
            {localizeValue(
              en
                ? "Slots and miner activity come from separate official sources. An occupied slot does not guarantee a training assignment."
                : "名额与训练人数来自不同官方来源。占用名额不代表已经分配训练任务。",
              locale,
            )}
          </p>
          {partial && (
            <span className="viz-tag" data-partial>
              {localizeValue(en ? "Activity roster is incomplete" : "训练名单覆盖不完整", locale)}
            </span>
          )}
        </section>
      </div>
      {farm.tiers.length > 1 ? (
        <ul className="farm-tiers">
          {farm.tiers.map((tier) => (
            <li key={tier.tier}>
              <b>{tier.tier}</b>
              <span>
                {formatCount(tier.runs, locale)} {t("个任务")} ·{" "}
                {localizeValue(en ? "Roster records" : "名单记录", locale)}{" "}
                {formatCount(tier.listed, locale)} · {t("已开始训练")}{" "}
                {formatCount(tier.training, locale)} · {t("剩余名额")}{" "}
                {formatCount(tier.slotsRemaining, locale)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {farm.runs.length ? (
        <section className="viz-panel runs-panel">
          <header className="viz-heading">
            <div>
              <span className="viz-kicker">
                <Layers size={14} />
                {localizeValue(en ? "TRAINING RUNS" : "进行中任务", locale)}
              </span>
              <h2>{localizeValue(en ? "Run overview" : "任务概览", locale)}</h2>
            </div>
            <span className="viz-tag">
              {formatCount(farm.runs.length, locale)} {t("个任务")}
            </span>
          </header>
          <div
            className="farm-table-wrap"
            role="region"
            aria-label={localizeValue(en ? "Active runs table" : "活跃任务表格", locale)}
            tabIndex={0}
          >
            <table className="farm-table">
              <thead>
                <tr>
                  <th>{t("各任务")}</th>
                  <th>{t("档位")}</th>
                  <th>{t("名额")}</th>
                  <th>{localizeValue(en ? "Roster records" : "名单记录", locale)}</th>
                  <th>{t("已开始训练")}</th>
                  <th>{t("训练进度")}</th>
                  <th>{t("损失")}</th>
                </tr>
              </thead>
              <tbody>
                {farm.runs.map((run) => (
                  <tr key={run.runId} data-mine={run.mineCount > 0 ? "yes" : undefined}>
                    <td>
                      {run.name}
                      {run.mineCount > 0 ? (
                        <small>
                          {t("你的设备")} {formatCount(run.mineCount, locale)}
                        </small>
                      ) : null}
                    </td>
                    <td>{run.tier || "—"}</td>
                    <td>
                      {formatCount(run.activeMiners, locale)} / {formatCount(run.maxMiners, locale)}
                      {run.slotsRemaining === 0 ? <em>{t("已满")}</em> : null}
                    </td>
                    <td>{formatCount(run.listed, locale)}</td>
                    <td>{formatCount(run.training, locale)}</td>
                    <td>
                      <div className="run-progress">
                        <span>{formatPct(run.tokens, run.totalTokens, locale)}</span>
                        {run.tokens !== null && run.totalTokens !== null && run.totalTokens > 0 && (
                          <div aria-hidden="true">
                            <i
                              style={{
                                width: `${Math.max(0, Math.min(100, (run.tokens / run.totalTokens) * 100))}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{formatLoss(run.loss)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
