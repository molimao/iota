import { withLocales } from "@/components/site/localization";
import { dataGuides } from "./data-guides";
import type { Locale } from "./locale";

export type Article = {
  slug: string;
  published?: string;
  modified?: string;
  sources?: Array<{ name: string; url: string }>;
  topic: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  body: Record<Locale, string[]>;
};

export const articles: Article[] = withLocales([
  {
    slug: "what-is-iota-watch",
    topic: { en: "Definition", zh: "它是什么" },
    title: {
      en: "What IOTA Watch is — not the IOTA cryptocurrency",
      zh: "IOTA Watch 是什么？它不是 IOTA 公链钱包",
    },
    description: {
      en: "IOTA Watch monitors IOTA Train at Home devices from Macrocosmos. It is not the IOTA Layer 1 coin, wallet, or Firefly.",
      zh: "IOTA Watch 监控 Macrocosmos 的 IOTA Train at Home 设备状态和收益。它不是 IOTA 公链、IOTA 币或 Firefly 钱包。",
    },
    body: {
      en: [
        "IOTA Watch is an independent browser dashboard for [IOTA Train at Home](https://iota.macrocosmos.ai/). Add a public Miner ID to view reported training status, today’s accounted rewards, and lifetime rewards.",
        "It is **not** the IOTA Foundation Layer 1 network, not an IOTA coin wallet, and not Firefly. It cannot send tokens, hold funds, or sign transactions.",
        "## What it can do",
        "- Look up official reported status with a public Miner ID (SS58 hotkey)",
        "- Show several devices in one list, with custom names",
        "- Keep up to 3 devices in this browser, or sign in with Google to bind up to 10",
        "## What it cannot do",
        "- Start or stop training on the device",
        "- Read local IOTA app logs",
        "- Promise rewards or a payout time",
        "Training still runs in the official Train at Home app on each machine. See the [Macrocosmos TAH user guide](https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide).",
        "## Why search results are confusing",
        "A search for “IOTA” usually means the IOTA Foundation chain. IOTA Train at Home is a Macrocosmos product in the Bittensor ecosystem. The reward unit is also called IOTA, but it is the subnet alpha token — not IOTA Layer 1, and not TAO. See [Train at Home vs the IOTA coin](/learn/iota-train-at-home-vs-iota-coin).",
        "> To monitor home training devices, use IOTA Watch. To hold IOTA Layer 1 coins, use that network’s official wallet. Do not paste a private key or seed phrase here.",
        "Next: [find your Miner ID](/learn/find-miner-id), then open [My devices](/app).",
      ],
      zh: [
        "IOTA Watch 是面向 [IOTA Train at Home](https://iota.macrocosmos.ai/) 的独立网页监控工具。添加公开 Miner ID 后，可在同一页面查看上报的训练状态、今日记账收益和累计收益。",
        "它**不是** IOTA Foundation 的 Layer 1 公链，也不是 IOTA 币钱包，更不是 Firefly。它不能转账、托管资金或签名交易。",
        "## 功能范围",
        "- 用公开 Miner ID（SS58 hotkey）查询官方上报数据",
        "- 将多台设备放在同一份清单中，使用自定义名称区分",
        "- 未登录可在浏览器保存最多 3 台，Google 登录后最多绑定 10 台",
        "## 功能限制",
        "- 不能启动或停止训练",
        "- 不能读取设备上的 IOTA 应用日志",
        "- 不能保证收益或到账时间",
        "训练必须在每台设备的官方 Train at Home 应用中运行。官方说明见 [Macrocosmos TAH 用户指南](https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide)。",
        "## 搜索结果容易混淆的原因",
        "搜索「IOTA」时，结果大多指向 IOTA 公链。IOTA Train at Home 是 Macrocosmos 在 Bittensor 生态中的去中心化训练产品。收益单位也称为 IOTA，但是子网 alpha 代币，不是 IOTA 公链币，也不是 TAO。对照见 [Train at Home 和 IOTA 公链的区别](/learn/iota-train-at-home-vs-iota-coin)。",
        "> 监控训练设备请使用 IOTA Watch。管理 IOTA 公链资产请使用对应官方钱包。请勿在本站填写私钥或助记词。",
        "下一步：[获取 Miner ID](/learn/find-miner-id)，然后打开 [我的设备](/app)。",
      ],
    },
  },
  {
    slug: "find-miner-id",
    topic: { en: "Setup", zh: "开始使用" },
    title: {
      en: "How to find your IOTA Train at Home Miner ID",
      zh: "如何找到 IOTA Train at Home 的 Miner ID",
    },
    description: {
      en: "Copy the public Miner ID from the Miner screen in the official IOTA Train at Home app. Use the SS58 hotkey, never a private key.",
      zh: "在官方 IOTA Train at Home 应用的 Miner 页面复制公开 Miner ID。使用 SS58 hotkey，请勿使用私钥或助记词。",
    },
    body: {
      en: [
        "The Miner ID used by IOTA Watch is the public SS58 hotkey shown in the official Train at Home app. It is not a private key, seed phrase, coldkey, or a row number on this website.",
        "## Copy it from the app",
        "- Install Train at Home from [iota.macrocosmos.ai](https://iota.macrocosmos.ai/) if you have not already",
        "- Launch the app and wait until it shows Connected",
        "- Open **Miner** in the top left",
        "- Copy the complete Miner ID",
        "The official guide is here: [TAH user guide](https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide).",
        "## Add it to IOTA Watch",
        "- Open the [dashboard](/app)",
        "- Paste the full ID and give the device a name",
        "- Repeat for each machine",
        "Without signing in, the list stays in this browser (up to 3 devices). [Sign in with Google](/learn/google-account-device-list) to bind up to 10 and open the same list elsewhere. A JSON backup can still be exported.",
        "> An incomplete ID will not match. If a device is “not found”, confirm that the full public address was copied.",
        "After it is saved, see [device statuses](/learn/device-status) and [how rewards are counted](/learn/how-rewards-work).",
      ],
      zh: [
        "IOTA Watch 使用的 Miner ID，是官方 Train at Home 应用里显示的公开 SS58 hotkey。它不是私钥、助记词、coldkey，也不是本站设备清单的行号。",
        "## 从应用里复制",
        "- 若尚未安装，请到 [iota.macrocosmos.ai](https://iota.macrocosmos.ai/) 下载 Train at Home",
        "- 打开应用，待状态显示 Connected",
        "- 选择左上角 **Miner**",
        "- 复制完整的 Miner ID",
        "官方步骤见 [TAH 用户指南](https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide)。",
        "## 添加到 IOTA Watch",
        "- 打开 [我的设备](/app)",
        "- 粘贴完整 ID，并填写设备名称",
        "- 每台设备分别添加一次",
        "未登录时清单保存在当前浏览器（最多 3 台）。[使用 Google 登录](/learn/google-account-device-list) 后最多绑定 10 台，可在其他设备查看。仍可导出 JSON 备份。",
        "> ID 不完整将无法匹配。若显示「尚未找到」，请核对是否复制了完整公开地址。",
        "保存之后，可查看 [设备状态](/learn/device-status) 与 [收益计算](/learn/how-rewards-work)。",
      ],
    },
  },
  {
    slug: "how-rewards-work",
    topic: { en: "Rewards", zh: "收益口径" },
    title: {
      en: "How IOTA Train at Home daily and lifetime rewards are counted",
      zh: "IOTA Train at Home 今日收益和累计收益怎么算",
    },
    description: {
      en: "Today’s rewards sum pending and settled records from midnight Hong Kong time. Lifetime uses total earned. The unit is subnet IOTA, not TAO.",
      zh: "今日收益按香港时间当天 0 点起的 pending、settled 记录求和。累计收益取 total earned。单位是子网 IOTA，不是 TAO。",
    },
    body: {
      en: [
        "IOTA Watch does not estimate earnings. It reads official entitlement records and shows two numbers: today’s accounted rewards, and lifetime accounted rewards.",
        "## Today’s rewards",
        "- Calendar day starts at 00:00 in Asia/Hong_Kong (UTC+8)",
        "- Only records with status **pending** or **settled** are added",
        "- Frozen and other statuses are excluded",
        "- A timestamp after “now” is excluded",
        "This is an accounting date. It does not mean the tokens arrived in a wallet today.",
        "## Lifetime rewards",
        "Lifetime uses **total earned** from the official totals API. Paid amounts are not added on top of earned, so the same reward is not counted twice.",
        "## What the IOTA unit means here",
        "On this site, IOTA is the Train at Home subnet alpha token used by the upstream API. It is not a TAO amount and not IOTA Layer 1. Next to each IOTA figure the dashboard also shows a USD estimate from the public SN9 market price. That estimate is not an official payout. Details: [how USD is shown](/learn/iota-rewards-in-usd).",
        "## Missing values are not zero",
        "If a request fails or the payload is unusable, the dashboard shows unknown — not 0. When only some devices have usable data, the total is marked partial (for example 2/3 devices).",
        "> Numbers refresh on a cache: device status is usually kept for 60 seconds, rewards for five minutes. A manual refresh has a 15-second cooldown.",
        "If a device appears idle, see [status meanings](/learn/device-status) before treating it as offline.",
      ],
      zh: [
        "IOTA Watch 不会估算收益。它读取官方 entitlements 记录，并给出两个数字：今日记账收益，以及累计记账收益。",
        "## 今日收益",
        "- 按香港时间（UTC+8）当天 00:00 起算",
        "- 只加总状态为 **pending** 或 **settled** 的记录",
        "- 冻结和其他状态不计入",
        "- 时间戳晚于当前时刻的记录不计入",
        "这是记账日口径，不代表代币今天已经打到钱包。",
        "## 累计收益",
        "累计收益取官方 totals 接口里的 **total earned**。不会再把已支付金额叠加上去，避免同一笔记两次。",
        "## 这里的 IOTA 是什么单位",
        "本站的 IOTA 是 Train at Home 上游接口使用的子网 alpha 代币。它不是 TAO，也不是 IOTA 公链币。每个 IOTA 数字旁边会同时给出按公开市场价格估算的美元，那不是官方结算价。详见 [收益怎么显示美元](/learn/iota-rewards-in-usd)。",
        "## 缺失不是零",
        "请求失败或数据不可用时，页面显示未知，不记作 0。只有部分设备有可用数据时，总计会标明覆盖范围，例如 2/3 台。",
        "> 数据有缓存：设备状态通常保留 60 秒，收益保留 5 分钟。手动刷新有 15 秒冷却。",
        "若设备显示未在训练，请先查看 [状态含义](/learn/device-status)，不宜直接视为离线。",
      ],
    },
  },
  {
    slug: "device-status",
    topic: { en: "Status", zh: "设备状态" },
    title: {
      en: "What IOTA Train at Home device statuses mean",
      zh: "IOTA 设备状态含义：有贡献、等待任务、暂未参与",
    },
    description: {
      en: "Contributing, waiting, and not participating come from the last official sample. An old sample time is not proof that the device went offline.",
      zh: "有贡献、等待任务、暂未参与来自官方最近一次统计采样。采样时间较旧，不表示设备已掉线。",
    },
    body: {
      en: [
        "IOTA Watch maps official miner records into a short status. The miner timestamp is the official **statistics sample time**. It is not a heartbeat from the device, and it is not the time this website last fetched data.",
        "## Statuses",
        "- **Contributing**: the latest official sample reports the device active with throughput above zero. That is reported activity, not a live guarantee that it is computing this second.",
        "- **Waiting for tasks**: the device is reported active, but the latest sample has no throughput. It is often waiting to be assigned work.",
        "- **Not participating**: the device is not reported as in the current training set. This does not prove it is offline or broken.",
        "- **Not found**: every active run list was fetched successfully, and this Miner ID was not in them. Check the ID first.",
        "- **Unknown / check later**: some run lists could not be fetched. Incomplete coverage is not a device fault.",
        "## Two clocks, two meanings",
        "If this website cannot refresh official data for more than five minutes, the dashboard says the refresh was interrupted and keeps the last successful values. That is a **fetch** problem. It is different from an old sample timestamp on a successful fetch. Details: [what “refresh interrupted” means](/learn/what-refresh-interrupted-means).",
        "> Zero throughput is not evidence that the device is offline. For local errors, open the IOTA Train at Home app. This website cannot read local logs.",
        "To add a device, see [how to find a Miner ID](/learn/find-miner-id). For the numbers beside the status, see [how rewards are counted](/learn/how-rewards-work).",
      ],
      zh: [
        "IOTA Watch 将官方 miner 记录归纳为简短状态。miner 时间戳是官方的**统计采样时间**，不是设备心跳，也不是本站最近一次拉取数据的时间。",
        "## 状态说明",
        "- **有贡献**：最近一次官方采样显示设备在线，且吞吐量大于 0。这是上报活动，不保证当前秒仍在计算。",
        "- **等待任务**：设备被报为在线，但最近一次采样没有吞吐量。常见情况是等待分配任务。",
        "- **暂未参与**：当前训练名单未将其计为正在参与。这不等于设备已离线或故障。",
        "- **尚未找到**：所有进行中的训练任务名单均读取成功，其中没有该 Miner ID。请先核对 ID。",
        "- **待确认**：部分任务名单本次未能读取。覆盖不完整，不代表设备故障。",
        "## 两个时间，两件事情",
        "如果本站超过 5 分钟都没能成功拿到官方数据，页面会提示刷新中断，并保留上一次成功的内容。那是**获取失败**。它和「这次获取成功，但官方采样时间比较旧」不是一回事。详见 [刷新中断是什么意思](/learn/what-refresh-interrupted-means)。",
        "> 吞吐量为零，不等于设备已掉线。本机报错需在 IOTA Train at Home 应用中查看。本站无法读取设备本地日志。",
        "添加设备见 [如何获取 Miner ID](/learn/find-miner-id)。状态旁的数字见 [收益计算](/learn/how-rewards-work)。",
      ],
    },
  },
  {
    slug: "iota-train-at-home-vs-iota-coin",
    topic: { en: "Disambiguation", zh: "产品区分" },
    title: {
      en: "IOTA Train at Home vs the IOTA cryptocurrency",
      zh: "IOTA Train at Home 和 IOTA 公链有什么区别",
    },
    description: {
      en: "IOTA Train at Home is a Macrocosmos / Bittensor subnet. The IOTA Foundation chain, Firefly, and IOTA Layer 1 wallets are a different product.",
      zh: "IOTA Train at Home 是 Macrocosmos / Bittensor 子网。IOTA Foundation 公链、Firefly 和 IOTA Layer 1 钱包是另一套产品。",
    },
    body: {
      en: [
        "People searching for “IOTA” usually land on the IOTA Foundation Layer 1 cryptocurrency. **IOTA Train at Home** is a different product: a Macrocosmos training network in the Bittensor ecosystem. IOTA Watch only monitors the second one.",
        "## Comparison",
        "- **IOTA Train at Home**: home computers contribute training work. Rewards are the subnet alpha token, often called IOTA or SN9. A machine is identified with a public Miner ID (SS58 hotkey).",
        "- **IOTA Layer 1**: a separate ledger and token. Wallets such as Firefly hold that coin. They do not show Train at Home device status.",
        "- **IOTA Watch**: a read-only dashboard for Train at Home Miner IDs. It is not a wallet and does not ask for a seed phrase.",
        "## Which to use",
        "To see whether a device is contributing and what it earned today, use [IOTA Watch](/learn/what-is-iota-watch) and the official [Train at Home app](https://iota.macrocosmos.ai/). To hold or send IOTA Layer 1 coins, use that network’s official wallet — not this site.",
        "> Do not paste a private key, recovery phrase, or coldkey secret into IOTA Watch. The Miner ID is a public address.",
        "Next: [find the Miner ID](/learn/find-miner-id), [what SN9 / IOTA means here](/learn/what-is-sn9-iota), then [how rewards are counted](/learn/how-rewards-work).",
      ],
      zh: [
        "搜索「IOTA」时，结果多半是 IOTA Foundation 的 Layer 1 公链。**IOTA Train at Home** 是另一项产品：Macrocosmos 在 Bittensor 生态中的训练网络。IOTA Watch 只监控后者。",
        "## 对照",
        "- **IOTA Train at Home**：设备贡献训练算力。收益是子网 alpha 代币，通常称为 IOTA 或 SN9。设备用公开 Miner ID（SS58 hotkey）识别。",
        "- **IOTA 公链**：另一套账本和代币。Firefly 等钱包管理的是公链币，无法显示 Train at Home 设备状态。",
        "- **IOTA Watch**：只读监控 Train at Home 的 Miner ID。不是钱包，也不会索取助记词。",
        "## 如何选择",
        "查看设备是否在贡献、今日收益，请使用 [IOTA Watch](/learn/what-is-iota-watch) 和官方 [Train at Home 应用](https://iota.macrocosmos.ai/)。持有或转出 IOTA 公链币，请使用该链官方钱包，不要使用本站。",
        "> 请勿在 IOTA Watch 中填写私钥、助记词或 coldkey 密钥。Miner ID 是公开地址。",
        "下一步：[获取 Miner ID](/learn/find-miner-id)，了解 [SN9 / IOTA](/learn/what-is-sn9-iota)，然后查看 [收益计算](/learn/how-rewards-work)。",
      ],
    },
  },
  {
    slug: "iota-rewards-in-usd",
    topic: { en: "USD estimate", zh: "美元估价" },
    title: {
      en: "How IOTA Train at Home rewards are shown in USD",
      zh: "IOTA Train at Home 收益怎么同时显示美元",
    },
    description: {
      en: "IOTA Watch shows official subnet IOTA amounts and a public SN9 market estimate in USD. The dollar figure is not a payout.",
      zh: "IOTA Watch 同时显示官方子网 IOTA 数量，以及按 SN9 公开市场价格估算的美元。美元不是结算价。",
    },
    body: {
      en: [
        "The dashboard shows **two numbers for the same reward**: the official IOTA amount from Train at Home entitlements, and an estimated USD value beside it.",
        "## What is official",
        "Today’s and lifetime IOTA amounts still follow the [reward rules](/learn/how-rewards-work): Hong Kong midnight, pending and settled only, lifetime = total earned. IOTA Watch does not invent those IOTA figures.",
        "## What is an estimate",
        "The USD line multiplies that IOTA amount by a public market price for the Train at Home subnet token (SN9 / CoinGecko `iota-2`). It is **not** the IOTA Foundation Layer 1 price, not TAO, and not a promise that you can sell at that rate.",
        "## When USD is a dash",
        "If the market feed is down, IOTA amounts stay visible and USD shows unknown. Missing price is not treated as $0.",
        "> Use the IOTA number for official accounting. Use USD only as a rough scale.",
        "If this token is still being mixed up with IOTA Layer 1, see [Train at Home vs the IOTA coin](/learn/iota-train-at-home-vs-iota-coin).",
      ],
      zh: [
        "监控页对同一笔收益会给出**两个数字**：官方 entitlements 里的 IOTA 数量，以及旁边估算的美元。",
        "## 哪些是官方口径",
        "今日和累计的 IOTA 数量仍按 [收益规则](/learn/how-rewards-work)：香港时间 0 点、只计 pending 和 settled，累计取 total earned。IOTA Watch 不会自行生成这些 IOTA 数字。",
        "## 哪些只是估价",
        "美元一行，是用上述 IOTA 数量乘以 Train at Home 子网代币（SN9 / CoinGecko `iota-2`）的公开市场价格。它**不是** IOTA 公链币价，不是 TAO，也不保证你能按这个价格卖出。",
        "## 美元变成横线时",
        "行情接口不可用时，IOTA 数量照常显示，美元显示未知。没有价格不会当成 $0。",
        "> 核对账目请以 IOTA 为准。美元仅用于参考量级。",
        "如与 IOTA 公链混淆，请先阅读 [Train at Home 和 IOTA 公链的区别](/learn/iota-train-at-home-vs-iota-coin)。",
      ],
    },
  },
  {
    slug: "what-refresh-interrupted-means",
    topic: { en: "Refresh", zh: "刷新中断" },
    title: {
      en: "What “refresh interrupted” means on IOTA Watch",
      zh: "IOTA Watch「刷新中断」是什么意思",
    },
    description: {
      en: "Refresh interrupted means IOTA Watch could not finish a successful read of official data for more than five minutes. It is not proof that the device is offline.",
      zh: "刷新中断表示 IOTA Watch 超过 5 分钟未能成功读完官方数据。这不表示设备已掉线。",
    },
    body: {
      en: [
        "**Refresh interrupted** appears when this website cannot complete a successful read of official Train at Home data for more than five minutes. The cards keep the last values that did arrive.",
        "It is a **website fetch** status. It is not a device heartbeat, and it is not the official statistics sample time.",
        "## What it is not",
        "- Not “the device stopped training”",
        "- Not “throughput is zero, so the device is offline”",
        "- Not the same as [Not found](/learn/device-not-found), which means the Miner ID was missing from a complete run list",
        "## What you can still trust",
        "IOTA amounts that already loaded are the last official entitlements this site received. USD beside them is only a public SN9 estimate. See [how rewards are counted](/learn/how-rewards-work).",
        "## What to do",
        "- Wait for the next automatic check, or tap refresh once (there is a short cooldown)",
        "- If the yellow notice names an upstream error, the official API was unreachable from this site",
        "- For local errors — app disconnected, GPU idle, login failed — open the Train at Home app on that machine. IOTA Watch cannot read local logs",
        "> After a successful fetch, the badge should return to contributing, waiting, or not participating. Read those here: [device statuses](/learn/device-status).",
      ],
      zh: [
        "**刷新中断**出现在本站超过 5 分钟都没能成功读完官方 Train at Home 数据时。卡片会保留上一次已经拿到的数字。",
        "这是**网站获取**状态，不是设备心跳，也不是官方统计采样时间。",
        "## 它不是什么",
        "- 不是「设备已经停止训练」",
        "- 不是「吞吐量为零，所以设备掉线了」",
        "- 也不同于 [尚未找到](/learn/device-not-found)：那是完整名单里没有这个 Miner ID",
        "## 哪些数字还能看",
        "已经显示出来的 IOTA 数量，是本站上次拿到的官方 entitlements。旁边的美元只是 SN9 公开市场估价。口径见 [收益怎么算](/learn/how-rewards-work)。",
        "## 处理方式",
        "- 等待下一轮自动检查，或点击一次刷新（有短暂冷却）",
        "- 若黄色提示写明上游错误，表示本站当时无法连接官方接口",
        "- 本机报错（应用断连、GPU 空闲、登录失败）请在该设备上打开 Train at Home 应用。IOTA Watch 无法读取本地日志",
        "> 获取成功后，徽章应回到有贡献、等待任务或暂未参与。对照见 [设备状态含义](/learn/device-status)。",
      ],
    },
  },
  {
    slug: "google-account-device-list",
    topic: { en: "Account", zh: "账号同步" },
    title: {
      en: "How Google sign-in stores your IOTA Watch device list",
      zh: "IOTA Watch 用 Google 登录后，设备清单怎么同步",
    },
    description: {
      en: "Without an account, this browser keeps 3 Miner IDs. Google sign-in binds up to 10 public IDs to your account so you can open the same list elsewhere.",
      zh: "未登录时当前浏览器最多保存 3 个 Miner ID。Google 登录后最多绑定 10 个公开 ID，换设备也能打开同一份清单。",
    },
    body: {
      en: [
        "Google sign-in on IOTA Watch only binds a **list of public Miner IDs and labels**. It is not a wallet login and never asks for a password, private key, or seed phrase.",
        "## Without signing in",
        "- This browser can keep up to **3** devices",
        "- The list lives in local storage on this machine",
        "- Another phone or computer will not see it unless you export and import a JSON backup",
        "## After Google sign-in",
        "- The same account can keep up to **10** devices",
        "- Open [Account](/account) to see the name, email, and avatar Google provided",
        "- Add, rename, and remove devices on the [dashboard](/app)",
        "- Sign in on another device to see the same list",
        "## What is stored",
        "Public SS58 hotkeys, labels you typed, and when you added them. Telemetry is fetched from official public APIs. Details: [privacy notes](/privacy).",
        "> Signing out does not delete the official training history. It only disconnects this browser from the bound list.",
        "To obtain an ID, see [how to find a Miner ID](/learn/find-miner-id).",
      ],
      zh: [
        "IOTA Watch 的 Google 登录只绑定**公开 Miner ID 和设备名称**。这不是钱包登录，不需要密码、私钥或助记词。",
        "## 未登录时",
        "- 当前浏览器最多保存 **3** 台",
        "- 清单位于该设备的本地存储",
        "- 其他设备无法查看，除非导出 JSON 后再导入",
        "## Google 登录后",
        "- 同一账号最多绑定 **10** 台",
        "- 打开 [账号页](/account) 可查看 Google 提供的姓名、邮箱和头像",
        "- 添加、改名、移除均在 [我的设备](/app) 完成",
        "- 在其他设备登录同一账号即可查看同一份清单",
        "## 存储内容",
        "公开的 SS58 hotkey、设备名称，以及添加时间。状态和收益来自官方公开接口。详见 [隐私说明](/privacy)。",
        "> 退出登录不会删除官方训练记录，仅使当前浏览器不再读取已绑定的清单。",
        "获取 ID 见 [如何获取 Miner ID](/learn/find-miner-id)。",
      ],
    },
  },
  {
    slug: "what-is-sn9-iota",
    topic: { en: "Token", zh: "子网代币" },
    title: {
      en: "What SN9 / IOTA means on Train at Home",
      zh: "Train at Home 的 SN9 / IOTA 是什么代币",
    },
    description: {
      en: "On IOTA Watch, IOTA is the Bittensor subnet 9 (SN9) alpha token used by Train at Home. It is not TAO and not the IOTA Foundation Layer 1 coin.",
      zh: "在 IOTA Watch 里，IOTA 指 Bittensor 子网 9（SN9）的 Train at Home alpha 代币。它不是 TAO，也不是 IOTA 公链币。",
    },
    body: {
      en: [
        "Train at Home rewards are denominated in the subnet’s **alpha token**. People call it IOTA or **SN9**. IOTA Watch uses the same unit the official entitlements API returns.",
        "## SN9 in one line",
        "SN9 is Bittensor subnet 9 — Macrocosmos IOTA Train at Home. The CoinGecko id for that token is `iota-2`. Do not use the Layer 1 id `iota`.",
        "## What it is not",
        "- Not **TAO**, the Bittensor parent token",
        "- Not the **IOTA Foundation** Layer 1 coin used by Firefly",
        "- Not a dollar payout. USD on the dashboard is a public-market estimate only",
        "If search results keep sending you to the wrong IOTA, read [Train at Home vs the IOTA coin](/learn/iota-train-at-home-vs-iota-coin).",
        "## How IOTA Watch uses it",
        "Today and lifetime figures stay in official IOTA amounts. The USD line multiplies those amounts by a public SN9 price. Missing price shows a dash, never $0. Details: [USD estimates](/learn/iota-rewards-in-usd) and [reward rules](/learn/how-rewards-work).",
        "> IOTA Watch cannot send, swap, or custody this token. It only displays official accounted amounts.",
      ],
      zh: [
        "Train at Home 的收益单位是子网 **alpha 代币**，通常称为 IOTA 或 **SN9**。IOTA Watch 使用官方 entitlements 接口返回的同一单位。",
        "## SN9 说明",
        "SN9 是 Bittensor 子网 9，即 Macrocosmos 的 IOTA Train at Home。该代币在 CoinGecko 上的 id 是 `iota-2`，请勿使用公链的 `iota`。",
        "## 排除项",
        "- 不是 **TAO**（Bittensor 主网代币）",
        "- 不是 **IOTA Foundation** 公链币，也不是 Firefly 中的 IOTA",
        "- 不是美元结算。监控页上的 USD 仅为公开市场估价",
        "若搜索结果指向另一条 IOTA，请先阅读 [Train at Home 和 IOTA 公链的区别](/learn/iota-train-at-home-vs-iota-coin)。",
        "## IOTA Watch 的用法",
        "今日和累计数字保持官方 IOTA 数量。美元一行按公开 SN9 价格折算。没有行情则显示横线，不记作 $0。详见 [美元估价](/learn/iota-rewards-in-usd) 和 [收益规则](/learn/how-rewards-work)。",
        "> IOTA Watch 不能发送、兑换或托管这种代币，只展示官方记账数量。",
      ],
    },
  },
  {
    slug: "device-not-found",
    topic: { en: "Troubleshooting", zh: "尚未找到" },
    title: {
      en: "IOTA Watch says the Miner ID was not found",
      zh: "IOTA Watch 显示「尚未找到」",
    },
    description: {
      en: "Not found means every active run list loaded, and this public Miner ID was not in them. Check the full SS58 hotkey before treating the device as faulty.",
      zh: "尚未找到表示进行中的训练名单均读取成功，其中没有该公开 Miner ID。请先核对完整 SS58 hotkey，不宜据此判断设备故障。",
    },
    body: {
      en: [
        "**Not found** is only used after IOTA Watch successfully reads every active Train at Home run list and still does not see this Miner ID.",
        "That is different from [refresh interrupted](/learn/what-refresh-interrupted-means) (this site could not finish the fetch) and from [unknown / check later](/learn/device-status) (some lists failed, so we cannot judge).",
        "## Check the ID first",
        "- Copy the complete public Miner ID from the official app’s Miner screen",
        "- It is an SS58 hotkey, usually starting with `5`",
        "- Do not paste a private key, seed phrase, coldkey secret, or a row number from this website",
        "Steps: [how to find your Miner ID](/learn/find-miner-id).",
        "## Other common reasons",
        "- The app is installed but the miner is not registered or not yet on any active run",
        "- You copied an old ID after reinstalling the app",
        "- A character was truncated when pasting",
        "> Training still has to run in the official app. IOTA Watch cannot register a miner or start a job for you.",
        "If the ID is correct and a fetch succeeds, the card should move to contributing, waiting, or not participating. Those meanings: [device statuses](/learn/device-status).",
      ],
      zh: [
        "**尚未找到**只会在 IOTA Watch 已经成功读完所有进行中的 Train at Home 任务名单，而且里面仍然没有这个 Miner ID 时出现。",
        "它不同于 [刷新中断](/learn/what-refresh-interrupted-means)（本站没读完），也不同于 [待确认](/learn/device-status)（部分名单失败，暂时无法判断）。",
        "## 核对 ID",
        "- 从官方应用的 Miner 页面复制完整公开 Miner ID",
        "- 它是 SS58 hotkey，通常以 `5` 开头",
        "- 请勿粘贴私钥、助记词、coldkey 密钥，或本站清单的行号",
        "步骤见 [如何获取 Miner ID](/learn/find-miner-id)。",
        "## 其他常见原因",
        "- 应用已安装，但矿工尚未注册，或尚未出现在任何进行中的任务中",
        "- 重装应用后仍使用旧 ID",
        "- 粘贴时截断了一个字符",
        "> 训练仍须在官方应用中运行。IOTA Watch 不能注册矿工或开始任务。",
        "ID 正确且获取成功后，卡片应变成有贡献、等待任务或暂未参与。含义见 [设备状态](/learn/device-status)。",
      ],
    },
  },
  ...dataGuides,
]);

export function articleDates(article: Article) {
  return {
    published: article.published ?? "2026-09-12",
    modified: article.modified ?? "2026-09-12",
  };
}

export type ArticleCluster = "understand" | "start" | "read";

export const articleClusterMeta: Record<
  ArticleCluster,
  { title: Record<Locale, string>; slugs: string[] }
> = withLocales({
  understand: {
    title: { en: "Product differences", zh: "产品区分" },
    slugs: ["what-is-iota-watch", "iota-train-at-home-vs-iota-coin", "what-is-sn9-iota"],
  },
  start: {
    title: { en: "Add devices", zh: "添加设备" },
    slugs: ["find-miner-id", "google-account-device-list", "device-not-found"],
  },
  read: {
    title: { en: "Status and rewards", zh: "状态与收益" },
    slugs: [
      "how-rewards-work",
      "iota-rewards-in-usd",
      "device-status",
      "what-refresh-interrupted-means",
      "data-sources-and-freshness",
      "training-history-and-metrics",
      "network-status-explained",
    ],
  },
});

const relatedBySlug: Record<string, string[]> = {
  "data-sources-and-freshness": [
    "what-refresh-interrupted-means",
    "network-status-explained",
    "how-rewards-work",
  ],
  "training-history-and-metrics": [
    "device-status",
    "how-rewards-work",
    "data-sources-and-freshness",
  ],
  "network-status-explained": [
    "data-sources-and-freshness",
    "device-not-found",
    "training-history-and-metrics",
  ],
  "what-is-iota-watch": ["iota-train-at-home-vs-iota-coin", "what-is-sn9-iota", "find-miner-id"],
  "find-miner-id": ["google-account-device-list", "device-not-found", "device-status"],
  "how-rewards-work": ["iota-rewards-in-usd", "what-is-sn9-iota", "device-status"],
  "device-status": [
    "what-refresh-interrupted-means",
    "training-history-and-metrics",
    "network-status-explained",
  ],
  "iota-train-at-home-vs-iota-coin": [
    "what-is-iota-watch",
    "what-is-sn9-iota",
    "iota-rewards-in-usd",
  ],
  "iota-rewards-in-usd": [
    "how-rewards-work",
    "what-is-sn9-iota",
    "iota-train-at-home-vs-iota-coin",
  ],
  "what-refresh-interrupted-means": ["device-status", "device-not-found", "how-rewards-work"],
  "google-account-device-list": ["find-miner-id", "what-is-iota-watch", "device-not-found"],
  "what-is-sn9-iota": [
    "iota-train-at-home-vs-iota-coin",
    "iota-rewards-in-usd",
    "how-rewards-work",
  ],
  "device-not-found": ["find-miner-id", "device-status", "what-refresh-interrupted-means"],
};

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function relatedArticles(slug: string) {
  return (relatedBySlug[slug] ?? [])
    .map((item) => getArticle(item))
    .filter((item): item is Article => Boolean(item));
}

export function articlePath(locale: Locale, slug: string) {
  return `/${locale}/learn/${slug}`;
}
