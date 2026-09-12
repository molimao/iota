import type { DeviceStatus } from "./device-status";
import { formatIota } from "./earnings";
import type { DeviceEarnings, MinerRecord } from "./iota-types";

export type Bilingual = { zh: string; en: string };

export type DiagnosisTone = "ok" | "info" | "warn";

export type DiagnosisNote = {
  code: string;
  tone: DiagnosisTone;
  title: Bilingual;
  cause: Bilingual;
  steps: Bilingual[];
  /** learn article slug that goes deeper on this note */
  slug?: string;
};

export type Diagnosis = {
  tone: DiagnosisTone;
  /** the one thing to read first */
  primary: DiagnosisNote;
  /** primary plus any additional reward-side findings */
  notes: DiagnosisNote[];
};

export type DiagnoseInput = {
  status: DeviceStatus;
  miner: MinerRecord | null;
  earnings: DeviceEarnings | null;
  earningsUsable: boolean;
};

const TONE_RANK: Record<DiagnosisTone, number> = { ok: 0, info: 1, warn: 2 };

function amount(units: number | null | undefined) {
  return {
    zh: formatIota(units ?? null, 4, "zh"),
    en: formatIota(units ?? null, 4, "en"),
  };
}

const RUNNING_FINE: DiagnosisNote = {
  code: "ok",
  tone: "ok",
  title: { zh: "没发现问题", en: "Nothing looks wrong" },
  cause: {
    zh: "官方最近一次采样里这台机器在训练，今天也有记账收益。",
    en: "The latest official sample shows this machine training, and today has accounted rewards.",
  },
  steps: [],
};

function statusNote(input: DiagnoseInput): DiagnosisNote {
  switch (input.status) {
    case "refresh_interrupted":
      return {
        code: "refresh_interrupted",
        tone: "info",
        title: {
          zh: "是这个网站没读到数据，不是你的设备",
          en: "This site lost the data, not your device",
        },
        cause: {
          zh: "超过 5 分钟没能成功读完官方接口，页面上的数字停在上一次成功读取。",
          en: "No successful read of the official API for over five minutes, so the numbers below are from the last good fetch.",
        },
        steps: [
          {
            zh: "等一两分钟，或者点一次「立即刷新」。",
            en: "Wait a minute or two, or press Refresh now.",
          },
          {
            zh: "这期间 Mac 上的训练照常进行，不用重启 Train at Home。",
            en: "Training on your Mac keeps running. There is no need to restart Train at Home.",
          },
          {
            zh: "如果十几分钟都不恢复，多半是官方接口在抖，等着就行。",
            en: "If it does not recover in fifteen minutes, the official API is most likely unstable. Waiting is enough.",
          },
        ],
        slug: "what-refresh-interrupted-means",
      };
    case "not_found":
      return {
        code: "not_found",
        tone: "warn",
        title: { zh: "名单里没有这个 Miner ID", en: "This Miner ID is not in any run" },
        cause: {
          zh: "所有进行中的训练任务名单都读成功了，里面没有这个 ID。",
          en: "Every active run list was fetched successfully and none of them contains this ID.",
        },
        steps: [
          {
            zh: "回到 Train at Home 的 Miner 页面重新复制一次完整 ID，注意别漏字符。",
            en: "Copy the full ID again from the Miner page in Train at Home, making sure nothing is cut off.",
          },
          {
            zh: "确认复制的是公开的 SS58 hotkey，不是 coldkey。",
            en: "Check that you copied the public SS58 hotkey, not the coldkey.",
          },
          {
            zh: "ID 没错的话，可能是这台机器还没被分到训练任务，等下一轮。",
            en: "If the ID is right, the machine may not be assigned to a run yet. Wait for the next round.",
          },
        ],
        slug: "device-not-found",
      };
    case "unknown":
      return {
        code: "unknown",
        tone: "info",
        title: { zh: "这轮没读全，先别下结论", en: "Incomplete coverage this round" },
        cause: {
          zh: "有几个训练任务的名单这次没读成功，覆盖不完整，判断不了。",
          en: "A few run lists could not be fetched this round, so coverage is incomplete.",
        },
        steps: [
          {
            zh: "等下一次自动刷新，大约 30 秒。",
            en: "Wait for the next automatic refresh, about 30 seconds.",
          },
          { zh: "不用动你的 Mac。", en: "Nothing to do on your Mac." },
        ],
      };
    case "idle":
      return {
        code: "idle",
        tone: "warn",
        title: { zh: "官方没把这台算在训练里", en: "Not counted as participating" },
        cause: {
          zh: "名单里有这个 ID，但状态是未参与。这一类通常出在机器那一侧。",
          en: "The ID is listed but reported as not participating. This usually points at the machine itself.",
        },
        steps: [
          {
            zh: "去那台 Mac 上看 Train at Home 还开着没有，状态是不是 Connected。",
            en: "Check that Train at Home is still open on that Mac and shows Connected.",
          },
          {
            zh: "看看机器有没有休眠、断网，或者被系统睡眠掐掉。",
            en: "Check whether the machine slept, lost network, or was suspended by the system.",
          },
          {
            zh: "应用重新连上之后，这里最多两三分钟会跟着变。",
            en: "Once the app reconnects, this page catches up within two or three minutes.",
          },
        ],
        slug: "device-status",
      };
    case "waiting":
      return {
        code: "waiting",
        tone: "info",
        title: { zh: "在线，在等任务", en: "Online and waiting for tasks" },
        cause: {
          zh: "官方最近一次采样里这台机器是在线的，只是没有处理量。",
          en: "The latest official sample reports this machine online with no throughput.",
        },
        steps: [
          {
            zh: "这是正常状态，分到任务就会有吞吐量，不用处理。",
            en: "This is normal. Throughput appears once a task is assigned. Nothing to do.",
          },
          {
            zh: "如果连着很多轮都在等，再去 Mac 上看看应用日志。",
            en: "If it stays here for many rounds, check the app log on the Mac.",
          },
        ],
        slug: "device-status",
      };
    default:
      return RUNNING_FINE;
  }
}

function rewardNotes(input: DiagnoseInput): DiagnosisNote[] {
  const notes: DiagnosisNote[] = [];
  const earnings = input.earnings;

  if (earnings?.error || (earnings && !input.earningsUsable)) {
    notes.push({
      code: "earnings_stale",
      tone: "info",
      title: { zh: "收益这一项没读到，金额是旧的", en: "Rewards did not refresh, amounts are old" },
      cause: {
        zh: "收益接口这次没返回，页面保留了上一次成功读到的金额。",
        en: "The rewards endpoint did not answer this round, so the last known amounts are kept.",
      },
      steps: [
        { zh: "点一次「立即刷新」。", en: "Press Refresh now." },
        {
          zh: "官方接口偶尔超时，过几分钟一般自己就好了。",
          en: "The official endpoint times out occasionally and usually recovers on its own.",
        },
      ],
    });
    return notes;
  }

  if (!earnings) return notes;

  const trainingNow = input.status === "contributing";
  if (trainingNow && earnings.todayUnits === 0) {
    notes.push({
      code: "no_today_rewards",
      tone: "info",
      title: { zh: "在跑，但今天还没记上账", en: "Training, but nothing accounted today yet" },
      cause: {
        zh: "官方是按批记账的，训练和入账之间有延迟。香港时间今天零点之后还没有新的记录。",
        en: "Official accounting runs in batches, so there is a lag between training and a record. Nothing new since midnight Hong Kong time.",
      },
      steps: [
        {
          zh: "打开「收益记录」，看最后一条记账时间离现在多久。",
          en: "Open Reward history and check how long ago the last record was written.",
        },
        {
          zh: "昨天有、今天没有，通常只是还没到下一次记账。",
          en: "Records yesterday but none today usually just means the next batch has not run.",
        },
        {
          zh: "超过一整天都没有新记录，再回头按上面那条查设备。",
          en: "If a full day passes with no new record, go back to the device check above.",
        },
      ],
      slug: "how-rewards-work",
    });
  }

  const pending = earnings.pendingUnits;
  const minimum = earnings.minimumPayoutUnits;
  if (pending !== null && minimum !== null && minimum > 0 && pending > 0 && pending < minimum) {
    const have = amount(pending);
    const need = amount(minimum);
    notes.push({
      code: "below_minimum_payout",
      tone: "info",
      title: { zh: "有收益，但还没到最低支付额", en: "Earned, but below the payout threshold" },
      cause: {
        zh: `待结算 ${have.zh} IOTA，官方的最低支付额是 ${need.zh} IOTA，不够就先攒着。`,
        en: `Pending is ${have.en} IOTA and the official payout minimum is ${need.en} IOTA, so it accumulates first.`,
      },
      steps: [
        {
          zh: "攒够之后官方会一次性发出。",
          en: "Once it clears the threshold the official side pays it out.",
        },
        {
          zh: "这里显示的是记账口径，不是钱包余额。",
          en: "The figures here are accounting records, not a wallet balance.",
        },
      ],
      slug: "how-rewards-work",
    });
  }

  if (earnings.frozenUnits !== null && earnings.frozenUnits > 0) {
    const frozen = amount(earnings.frozenUnits);
    notes.push({
      code: "frozen",
      tone: "info",
      title: { zh: "有一部分收益被冻结", en: "Part of the rewards is frozen" },
      cause: {
        zh: `官方标记了 ${frozen.zh} IOTA 为冻结，今日收益不把这部分算进去。`,
        en: `The official side marked ${frozen.en} IOTA as frozen. Today's total excludes it.`,
      },
      steps: [
        {
          zh: "冻结由官方那边决定，这个网站只是照原样显示。",
          en: "Freezing is decided upstream. This site only reports it as-is.",
        },
        {
          zh: "在「收益记录」里可以看到具体是哪几条。",
          en: "Reward history shows which records are affected.",
        },
      ],
      slug: "how-rewards-work",
    });
  }

  return notes;
}

export function diagnoseDevice(input: DiagnoseInput): Diagnosis {
  const primary = statusNote(input);
  const rewards = rewardNotes(input);
  const notes = primary.code === "ok" && rewards.length ? rewards : [primary, ...rewards];
  const tone = notes.reduce<DiagnosisTone>(
    (worst, note) => (TONE_RANK[note.tone] > TONE_RANK[worst] ? note.tone : worst),
    "ok",
  );
  return { tone, primary: notes[0] ?? RUNNING_FINE, notes: notes.length ? notes : [RUNNING_FINE] };
}

/** Shown under every diagnosis: the three ways people compare numbers and get confused. */
export const RECONCILE_NOTES: Array<{ q: Bilingual; a: Bilingual }> = [
  {
    q: { zh: "和官方面板的数字对不上？", en: "Numbers differ from the official dashboard?" },
    a: {
      zh: "两边的采样时刻不一样，官方面板也有自己的缓存。差一轮是正常的，差一个数量级才值得查。",
      en: "The two sides sample at different moments and the official dashboard caches too. A one-round gap is normal; an order of magnitude is not.",
    },
  },
  {
    q: { zh: "美元金额为什么会变？", en: "Why does the USD figure move?" },
    a: {
      zh: "美元是按 SN9 公开市场价折算的估价，价格一直在动。IOTA 数量才是官方记下的。",
      en: "USD is an estimate from the public SN9 market price, which moves constantly. Only the IOTA amount is the official record.",
    },
  },
  {
    q: { zh: "累计收益为什么不等于到账金额？", en: "Why is lifetime not what you received?" },
    a: {
      zh: "累计取的是官方的 total earned，里面包含还没结算和被冻结的部分，不是钱包余额。",
      en: "Lifetime uses the official total earned, which includes pending and frozen amounts. It is not a wallet balance.",
    },
  },
];
