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
      <h1>{en ? "Network status" : "全网状态"}</h1>
      <p className="article-lead">
        {en
          ? "Active runs, available slots, and training progress. Updated about once a minute."
          : "进行中的任务、剩余名额和训练进度。大约每分钟更新。"}
      </p>

      {state.farm ? (
        <FarmFull farm={state.farm} />
      ) : (
        <p className="farm-empty">
          {state.error ? t(state.error) : en ? "Loading the network view…" : "正在读取全网数据…"}
        </p>
      )}

      <details className="network-glossary">
        <summary>{en ? "Metric definitions" : "指标说明"}</summary>
        <dl>
          {GLOSSARY.map((item) => (
            <div key={item.term.en}>
              <dt>{item.term[locale]}</dt>
              <dd>{item.body[locale]}</dd>
            </div>
          ))}
        </dl>
      </details>

      <a className="site-button" href={`/${locale}/app`}>
        {copy.cta}
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}
