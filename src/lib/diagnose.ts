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
  title: { zh: "未见异常", en: "No issue found" },
  cause: {
    zh: "官方最近一次采样显示该设备在训练，且今日已有记账收益。",
    en: "The latest official sample shows this device training, and today has accounted rewards.",
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
          zh: "是本站未能读取数据，不是设备故障",
          en: "This site could not read data; the device is not implicated",
        },
        cause: {
          zh: "超过 5 分钟未能成功读完官方接口，页面数字停在上一次成功读取。",
          en: "No successful read of the official API for over five minutes. The numbers below are from the last successful fetch.",
        },
        steps: [
          {
            zh: "等待一两分钟，或点击一次「立即刷新」。",
            en: "Wait a minute or two, or press Refresh now.",
          },
          {
            zh: "此期间设备上的训练不受影响，无需重启 Train at Home。",
            en: "Training on the device continues. There is no need to restart Train at Home.",
          },
          {
            zh: "若超过十几分钟仍未恢复，多为官方接口不稳定，可继续等待。",
            en: "If it does not recover in fifteen minutes, the official API is likely unstable. Waiting is sufficient.",
          },
        ],
        slug: "what-refresh-interrupted-means",
      };
    case "not_found":
      return {
        code: "not_found",
        tone: "warn",
        title: { zh: "名单中没有该 Miner ID", en: "This Miner ID is not in any run" },
        cause: {
          zh: "所有进行中的训练任务名单均读取成功，其中没有该 ID。",
          en: "Every active run list was fetched successfully and none of them contains this ID.",
        },
        steps: [
          {
            zh: "在 Train at Home 的 Miner 页面重新复制完整 ID，避免漏字。",
            en: "Copy the full ID again from the Miner page in Train at Home, making sure nothing is cut off.",
          },
          {
            zh: "确认复制的是公开 SS58 hotkey，不是 coldkey。",
            en: "Check that the public SS58 hotkey was copied, not the coldkey.",
          },
          {
            zh: "若 ID 正确，可能尚未被分配到训练任务，需等待下一轮。",
            en: "If the ID is correct, the device may not be assigned to a run yet. Wait for the next round.",
          },
        ],
        slug: "device-not-found",
      };
    case "unknown":
      return {
        code: "unknown",
        tone: "info",
        title: { zh: "本次名单读取不完整", en: "Incomplete coverage this round" },
        cause: {
          zh: "部分训练任务名单本次未能读取，覆盖不完整，暂无法判断。",
          en: "A few run lists could not be fetched this round, so coverage is incomplete.",
        },
        steps: [
          {
            zh: "等待下一次自动刷新，约 30 秒。",
            en: "Wait for the next automatic refresh, about 30 seconds.",
          },
          { zh: "无需在设备上进行操作。", en: "No action is required on the device." },
        ],
      };
    case "idle":
      return {
        code: "idle",
        tone: "warn",
        title: { zh: "官方未将该设备计为训练中", en: "Not counted as participating" },
        cause: {
          zh: "名单中有该 ID，但状态为未参与。此类情况通常需在本机排查。",
          en: "The ID is listed but reported as not participating. This usually points to the device itself.",
        },
        steps: [
          {
            zh: "在该设备上确认 Train at Home 仍在运行，状态是否为 Connected。",
            en: "Check that Train at Home is still open on that device and shows Connected.",
          },
          {
            zh: "检查设备是否休眠、断网，或被系统睡眠中断。",
            en: "Check whether the device slept, lost network, or was suspended by the system.",
          },
          {
            zh: "应用重新连接后，本页通常在两三分钟内更新。",
            en: "Once the app reconnects, this page typically updates within two or three minutes.",
          },
        ],
        slug: "device-status",
      };
    case "waiting":
      return {
        code: "waiting",
        tone: "info",
        title: { zh: "在线，等待任务", en: "Online and waiting for tasks" },
        cause: {
          zh: "官方最近一次采样显示该设备在线，但没有处理量。",
          en: "The latest official sample reports this device online with no throughput.",
        },
        steps: [
          {
            zh: "此为正常状态。分配到任务后会出现吞吐量，无需处理。",
            en: "This is normal. Throughput appears once a task is assigned. No action is required.",
          },
          {
            zh: "若连续多轮仍在等待，再查看设备上的应用日志。",
            en: "If it remains in this state for many rounds, check the app log on the device.",
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
      title: { zh: "收益未刷新，金额为旧数据", en: "Rewards did not refresh; amounts are old" },
      cause: {
        zh: "收益接口本次未返回，页面保留上一次成功读取的金额。",
        en: "The rewards endpoint did not respond this round, so the last known amounts are kept.",
      },
      steps: [
        { zh: "点击一次「立即刷新」。", en: "Press Refresh now." },
        {
          zh: "官方接口偶尔超时，通常数分钟后恢复。",
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
      title: { zh: "正在训练，今日尚未记账", en: "Training, but nothing accounted today yet" },
      cause: {
        zh: "官方按批次记账，训练与入账之间存在延迟。香港时间今日 0 点之后尚无新记录。",
        en: "Official accounting runs in batches, so there is a lag between training and a record. Nothing new since midnight Hong Kong time.",
      },
      steps: [
        {
          zh: "打开「收益记录」，查看最后一条记账时间。",
          en: "Open Reward history and check when the last record was written.",
        },
        {
          zh: "昨日有记录而今日没有，通常表示尚未到下一次记账。",
          en: "Records yesterday but none today usually means the next batch has not run.",
        },
        {
          zh: "若超过一整天仍无新记录，再按上方说明检查设备。",
          en: "If a full day passes with no new record, follow the device check above.",
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
        zh: `待结算 ${have.zh} IOTA，官方最低支付额为 ${need.zh} IOTA，未达阈值前先累计。`,
        en: `Pending is ${have.en} IOTA and the official payout minimum is ${need.en} IOTA, so it accumulates first.`,
      },
      steps: [
        {
          zh: "达到阈值后由官方一次性发放。",
          en: "Once it clears the threshold the official side pays it out.",
        },
        {
          zh: "此处显示的是记账口径，不是钱包余额。",
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
        zh: `官方标记了 ${frozen.zh} IOTA 为冻结，今日收益不计入该部分。`,
        en: `The official side marked ${frozen.en} IOTA as frozen. Today's total excludes it.`,
      },
      steps: [
        {
          zh: "冻结由官方决定，本站按原样显示。",
          en: "Freezing is decided upstream. This site reports it as-is.",
        },
        {
          zh: "可在「收益记录」中查看具体条目。",
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
    q: { zh: "与官方面板数字不一致？", en: "Numbers differ from the official dashboard?" },
    a: {
      zh: "两边采样时刻不同，官方面板也有缓存。相差一轮属于正常，数量级差异才需要排查。",
      en: "The two sides sample at different moments and the official dashboard also caches. A one-round gap is normal; an order of magnitude is not.",
    },
  },
  {
    q: { zh: "美元金额为何变化？", en: "Why does the USD figure move?" },
    a: {
      zh: "美元按 SN9 公开市场价折算，价格会变动。IOTA 数量才是官方记录。",
      en: "USD is an estimate from the public SN9 market price, which moves. Only the IOTA amount is the official record.",
    },
  },
  {
    q: { zh: "累计收益为何不等于到账金额？", en: "Why is lifetime not what was received?" },
    a: {
      zh: "累计取官方 total earned，其中包含尚未结算和被冻结的部分，不是钱包余额。",
      en: "Lifetime uses the official total earned, which includes pending and frozen amounts. It is not a wallet balance.",
    },
  },
];
