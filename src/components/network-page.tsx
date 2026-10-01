import { FarmFull } from "@/components/farm-view";
import { useLocale } from "@/components/site/locale";
import { useFarm } from "@/hooks/use-farm";
import { DataHealth } from "@/components/data-health";
import { RefreshCw } from "lucide-react";

const GLOSSARY: Array<{ term: { zh: string; en: string }; body: { zh: string; en: string } }> = [
  {
    term: { zh: "名额", en: "Slots" },
    body: {
      zh: "任务可容纳的矿工人数。满员后需等待下一个任务。",
      en: "How many miners a run can hold. A full run accepts no new machines until the next run opens.",
    },
  },
  {
    term: { zh: "官方在线 / 已开始训练", en: "Online / training" },
    body: {
      zh: "在线是当前名单人数；已开始训练是实际有训练量的人数，通常更少。",
      en: "Online is the current roster. Training is how many of those actually have work in this sample, and is usually smaller.",
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
];

export function NetworkPage() {
  const { locale, en, t } = useLocale();
  const state = useFarm();
  return (
    <article className="article-page network-page">
      <a className="back-link" href={`/${locale}`}>
        ← {en ? "Home" : "首页"}
      </a>
      <span className="eyebrow">IOTA WATCH / {en ? "NETWORK" : "全网"}</span>
      <h1>{en ? "Network status" : "全网训练现况"}</h1>
      <p className="article-lead">
        {en
          ? "Active training runs. Public data, updated about once a minute."
          : "进行中的训练任务。公开数据，约每分钟更新。"}
      </p>

      <div className="network-toolbar">
        <p>
          {en
            ? `Miner lists: ${state.coverage.known}/${state.coverage.total} runs`
            : `矿工名单：已获取 ${state.coverage.known}/${state.coverage.total} 个任务`}
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
            {en
              ? "Some sources could not refresh. Previous data is retained."
              : "部分数据刷新失败，保留上次数据。"}
          </summary>
          <p role="alert">{t(state.error)}</p>
        </details>
      )}

      {state.farm ? (
        <FarmFull farm={state.farm} />
      ) : (
        <p className="farm-empty">
          {state.error ? t(state.error) : en ? "Loading the network view…" : "正在读取全网数据…"}
        </p>
      )}

      <div className="network-glossary">
        <h2>{en ? "Numbers" : "数字含义"}</h2>
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
        <h2>{en ? "Your devices" : "我的设备"}</h2>
        <p>
          {en
            ? "This page shows the whole network. Add a Miner ID to see your devices and rewards."
            : "此页为全网数据。添加 Miner ID 后可查看自己的设备与收益。"}
        </p>
        <a href={`/${locale}/app`}>{en ? "My devices" : "我的设备"} →</a>
      </aside>
    </article>
  );
}
