import { withLocales } from "@/components/site/localization";
import { localizeValue } from "@/components/site/localization";
import { FarmFull } from "@/components/farm-view";
import { useLocale } from "@/components/site/locale";
import { useFarm } from "@/hooks/use-farm";
import { DataHealth } from "@/components/data-health";
import { RefreshCw } from "lucide-react";

const GLOSSARY = withLocales([
  {
    term: { zh: "名额", en: "Slots" },
    body: {
      zh: "任务可容纳的矿工人数与剩余容量，以官方名额接口的当前记录为准。",
      en: "The run's miner capacity and remaining slots, as reported by the official occupancy source.",
    },
  },
  {
    term: { zh: "名单矿工 / 已开始训练", en: "Roster miners / training" },
    body: {
      zh: "名单矿工按 Miner ID 去重；已开始训练为任一已读取任务中上报吞吐量大于零的矿工，不依赖 active 标记。任务表与档位按名单记录计数。这些都是官方采样数据，不是实时在线证明。",
      en: "Roster miners are unique Miner IDs. Training counts IDs with positive throughput in any fetched run, independently of the active flag. Run and tier rows count roster records. These are official samples, not live connectivity checks.",
    },
  },
  {
    term: { zh: "档位", en: "Tier" },
    body: {
      zh: "Bronze、Silver、Gold 按机器规格划分，由官方指定。",
      en: "Bronze, Silver and Gold are hardware grades assigned by the official network.",
    },
  },
  {
    term: { zh: "训练进度 / 损失", en: "Progress / loss" },
    body: {
      zh: "整个任务的进度与损失，不是单台设备。",
      en: "The run as a whole, not an individual machine.",
    },
  },
]);

export function NetworkPage() {
  const { locale, en, t } = useLocale();
  const state = useFarm();
  return (
    <article className="article-page network-page">
      <a className="back-link" href={`/${locale}`}>
        ← {localizeValue(en ? "Home" : "首页", locale)}
      </a>
      <span className="eyebrow">IOTA WATCH / {localizeValue(en ? "NETWORK" : "全网", locale)}</span>
      <h1>{localizeValue(en ? "Network status" : "全网训练现况", locale)}</h1>
      <p className="article-lead">
        {localizeValue(
          en
            ? "Active training runs. Public data, updated about once a minute."
            : "进行中的训练任务。公开数据，约每分钟更新。",
          locale,
        )}
      </p>

      <div className="network-toolbar">
        <p>
          {localizeValue(
            en
              ? `Miner lists: ${state.coverage.known}/${state.coverage.total} runs`
              : `矿工名单：已获取 ${state.coverage.known}/${state.coverage.total} 个任务`,
            locale,
          )}
          {state.coverage.known < state.coverage.total ? ` · ${t("部分数据")}` : ""}
        </p>
        <button
          disabled={state.refreshing || state.cooldownRemaining > 0}
          onClick={() => void state.refresh()}
        >
          <RefreshCw size={15} className={state.refreshing ? "spin" : ""} />
          {state.refreshing
            ? t("刷新中")
            : state.cooldownRemaining > 0
              ? `${Math.ceil(state.cooldownRemaining / 1000)} s`
              : t("立即刷新")}
        </button>
      </div>
      <DataHealth sources={state.sources} now={state.now} />
      {state.error && (
        <details className="network-errors">
          <summary>
            {localizeValue(
              en
                ? "Some sources could not refresh. Previous data is retained."
                : "部分数据刷新失败，保留上次数据。",
              locale,
            )}
          </summary>
          <p role="alert">{t(state.error)}</p>
        </details>
      )}

      {state.farm ? (
        <FarmFull farm={state.farm} partial={state.coverage.known < state.coverage.total} />
      ) : (
        <p className="farm-empty">
          {state.error
            ? t(state.error)
            : localizeValue(en ? "Loading the network view…" : "正在读取全网数据…", locale)}
        </p>
      )}

      <div className="network-glossary">
        <h2>{localizeValue(en ? "Numbers" : "数字含义", locale)}</h2>
        <dl>
          {GLOSSARY.map((item) => (
            <div key={item.term.en}>
              <dt>{item.term[locale]}</dt>
              <dd>{item.body[locale]}</dd>
            </div>
          ))}
        </dl>
      </div>

      <aside className="article-tip">
        <h2>{localizeValue(en ? "Your devices" : "我的设备", locale)}</h2>
        <p>
          {localizeValue(
            en
              ? "This page shows the whole network. Add a Miner ID to see your devices and rewards."
              : "此页为全网数据。添加 Miner ID 后可查看自己的设备与收益。",
            locale,
          )}
        </p>
        <a href={`/${locale}/app`}>{localizeValue(en ? "My devices" : "我的设备", locale)} →</a>
      </aside>
      <p className="article-updated">
        <a href={`/${locale}/learn/network-status-explained`}>
          {localizeValue(en ? "How to read network status" : "全网数字怎么读", locale)}
        </a>
        {" · "}
        <a href={`/${locale}/learn/data-sources-and-freshness`}>
          {localizeValue(en ? "Data sources and freshness" : "数据来源与时效", locale)}
        </a>
      </p>
    </article>
  );
}
