import { ArrowUpRight } from "lucide-react";

import { FarmFull } from "@/components/farm-view";
import { useLocale } from "@/components/site/locale";
import { content } from "@/components/site/content";
import { useFarm } from "@/hooks/use-farm";

const GLOSSARY: Array<{ term: { zh: string; en: string }; body: { zh: string; en: string } }> = [
  {
    term: { zh: "名额", en: "Slots" },
    body: {
      zh: "每个训练任务能容纳的矿工上限，以及已经被占掉的数量。占满了就加不进新机器，得等下一个任务开出来。",
      en: "How many miners a run can hold and how many of those places are taken. A full run accepts no new machines until the next one opens.",
    },
  },
  {
    term: { zh: "官方在线 / 已开始训练", en: "Online / training" },
    body: {
      zh: "占了名额不等于真的在算。官方在线是名单里标为 active 的数量，已开始训练是这一批采样里确实有吞吐量的数量。后者总是更小。",
      en: "Holding a slot is not the same as computing. Online counts miners flagged active in the roster; training counts those with actual throughput in this sample. The second number is always smaller.",
    },
  },
  {
    term: { zh: "档位", en: "Tier" },
    body: {
      zh: "Bronze、Silver、Gold 是任务对机器规格的要求分级。你的设备会被分到哪一档由官方决定，这里只是把当前各档的占用情况列出来。",
      en: "Bronze, Silver and Gold grade a run by the hardware it expects. Which tier your device lands in is decided upstream; this page only shows how full each tier currently is.",
    },
  },
  {
    term: { zh: "训练进度 / 损失", en: "Progress / loss" },
    body: {
      zh: "进度是这个任务已训练 token 占目标的比例，损失是当前模型的 loss。这两个是整个任务的，不是你单台机器的。",
      en: "Progress is tokens trained against the target for that run; loss is the model's current loss. Both describe the whole run, not your individual machine.",
    },
  },
];

export function NetworkPage() {
  const { locale, en, t } = useLocale();
  const copy = content[locale];
  const state = useFarm();
  return (
    <article className="article-page network-page">
      <a className="back-link" href={`/${locale}`}>
        ← {en ? "Home" : "首页"}
      </a>
      <span className="eyebrow">IOTA WATCH / {en ? "NETWORK" : "全网"}</span>
      <h1>{en ? "The whole Train at Home network" : "全网训练现况"}</h1>
      <p className="article-lead">
        {en
          ? "Every active IOTA Train at Home run: how many places are left, how many machines are actually computing, and how far each run has gone. Public data, refreshed about once a minute."
          : "IOTA Train at Home 所有进行中的训练任务：还剩多少名额、有多少机器真的在算、每个任务跑到哪了。公开数据，大约每分钟更新一次。"}
      </p>

      {state.farm ? (
        <FarmFull farm={state.farm} />
      ) : (
        <p className="farm-empty">
          {state.error ? t(state.error) : en ? "Loading the network view…" : "正在读取全网数据…"}
        </p>
      )}

      <div className="network-glossary">
        <h2>{en ? "What these numbers mean" : "这些数字是什么意思"}</h2>
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
        <h2>{en ? "This is the network, not your machine" : "这是全网，不是你的机器"}</h2>
        <p>
          {en
            ? "Nothing on this page tells you whether your own device is healthy. Add your Miner ID on the dashboard to see your devices and rewards, plus a check on anything that looks wrong."
            : "这一页看不出你自己的机器好不好。在监控页添加 Miner ID，才能看到你的设备、收益，以及哪里不对该怎么查。"}
        </p>
        <a href={`/${locale}/app`}>{en ? "Open the dashboard" : "打开监控页"} →</a>
      </aside>

      <a className="site-button" href={`/${locale}/app`}>
        {copy.cta}
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}
