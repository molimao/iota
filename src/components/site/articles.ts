import type { Locale } from "./locale";

export type Article = {
  slug: string;
  topic: { en: string; zh: string };
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  body: { en: string[]; zh: string[] };
};

export const articles: Article[] = [
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
        "IOTA Watch is an independent browser dashboard for [IOTA Train at Home](https://iota.macrocosmos.ai/). Add a public Miner ID and you can see reported training status, today’s accounted rewards, and lifetime rewards in one place.",
        "It is **not** the IOTA Foundation Layer 1 network, not an IOTA coin wallet, and not Firefly. It cannot send tokens, hold funds, or sign transactions.",
        "## What it can do",
        "- Look up official reported status with a public Miner ID (SS58 hotkey)",
        "- Show several home devices together, with names you choose",
        "- Keep up to 3 devices in this browser, or sign in with Google to bind up to 10",
        "## What it cannot do",
        "- Start or stop training on your Mac",
        "- Read local IOTA app logs",
        "- Promise rewards or a payout time",
        "Training still runs in the official Train at Home app on each machine. See the [Macrocosmos TAH user guide](https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide).",
        "## Why search results are confusing",
        "A search for “IOTA” usually means the IOTA Foundation chain. IOTA Train at Home is a Macrocosmos product in the Bittensor ecosystem. The reward unit is also called IOTA, but it is the subnet alpha token — not IOTA Layer 1, and not TAO. See [Train at Home vs the IOTA coin](/learn/iota-train-at-home-vs-iota-coin).",
        "> If you want to watch home training devices, use IOTA Watch. If you want to hold IOTA Layer 1 coins, use that network’s official wallet. Never paste a private key or seed phrase here.",
        "Next: [find your Miner ID](/learn/find-miner-id), then [open the dashboard](/app).",
      ],
      zh: [
        "IOTA Watch 是面向 [IOTA Train at Home](https://iota.macrocosmos.ai/) 的独立网页监控工具。添加公开 Miner ID 后，可以在一个页面里查看上报的训练状态、今日记账收益和累计收益。",
        "它**不是** IOTA Foundation 的 Layer 1 公链，也不是 IOTA 币钱包，更不是 Firefly。它不能转账、托管资金或签名交易。",
        "## 它能做什么",
        "- 用公开 Miner ID（SS58 hotkey）查询官方上报数据",
        "- 把家里多台设备放在同一份清单里，用你认得的名字区分",
        "- 未登录可在浏览器保存最多 3 台，Google 登录后最多绑定 10 台",
        "## 它不能做什么",
        "- 不能替你启动或停止训练",
        "- 不能读取 Mac 上的 IOTA 应用日志",
        "- 不能保证收益或到账时间",
        "训练必须在每台设备的官方 Train at Home 应用里运行。官方说明见 [Macrocosmos TAH 用户指南](https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide)。",
        "## 为什么搜索结果容易搜错",
        "搜「IOTA」时，结果大多是 IOTA 公链。IOTA Train at Home 是 Macrocosmos 在 Bittensor 生态里的去中心化训练产品。收益单位也叫 IOTA，但是子网 alpha 代币，不是 IOTA 公链币，也不是 TAO。对照见 [Train at Home 和 IOTA 公链的区别](/learn/iota-train-at-home-vs-iota-coin)。",
        "> 要监控家里正在跑的训练设备，用 IOTA Watch。要管理 IOTA 公链资产，请用对应的官方钱包。不要把私钥或助记词填进本站。",
        "下一步：[找到 Miner ID](/learn/find-miner-id)，然后 [打开监控](/app)。",
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
      zh: "在官方 IOTA Train at Home 应用的 Miner 页面复制公开 Miner ID。使用 SS58 hotkey，不要用私钥或助记词。",
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
        "- Paste the full ID and give the device a name you recognize, such as “Living room Mac”",
        "- Repeat for each machine",
        "The list stays in this browser. Export a JSON backup if you want the same list on another computer or phone.",
        "> A short or incomplete ID will not match. If a device is “not found”, check that you copied the whole public address.",
        "After it is saved, [read what the statuses mean](/learn/device-status) and [how rewards are counted](/learn/how-rewards-work).",
      ],
      zh: [
        "IOTA Watch 使用的 Miner ID，是官方 Train at Home 应用里显示的公开 SS58 hotkey。它不是私钥、助记词、coldkey，也不是本站设备清单的行号。",
        "## 从应用里复制",
        "- 还没有安装的话，先到 [iota.macrocosmos.ai](https://iota.macrocosmos.ai/) 下载 Train at Home",
        "- 打开应用，等到状态显示 Connected",
        "- 点左上角的 **Miner**",
        "- 复制完整的 Miner ID",
        "官方步骤见 [TAH 用户指南](https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide)。",
        "## 加到 IOTA Watch",
        "- 打开 [监控页](/app)",
        "- 粘贴完整 ID，并起一个你认得的名字，例如「客厅 Mac」",
        "- 每台机器都这样添加一次",
        "清单保存在当前浏览器。如果要在另一台电脑或手机上看同一份清单，先导出 JSON 备份再导入。",
        "> ID 不完整就匹配不上。如果显示「尚未找到」，先核对是否复制了整段公开地址。",
        "保存之后，可以看 [设备状态是什么意思](/learn/device-status)，以及 [收益怎么算](/learn/how-rewards-work)。",
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
        "If a device looks idle, check [status meanings](/learn/device-status) before assuming it is offline.",
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
        "请求失败或数据不可用时，页面显示未知，不当作 0。只有部分设备有可用数据时，总计会标明覆盖范围，例如 2/3 台。",
        "> 数据有缓存：设备状态通常保留 60 秒，收益保留 5 分钟。手动刷新有 15 秒冷却。",
        "如果设备看起来没在跑，先看 [状态含义](/learn/device-status)，不要直接当成离线。",
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
      en: "Contributing, waiting, and not participating come from the last official sample. An old sample time is not proof that your Mac went offline.",
      zh: "有贡献、等待任务、暂未参与来自官方最近一次统计采样。采样时间较旧，不等于你的 Mac 已经掉线。",
    },
    body: {
      en: [
        "IOTA Watch maps official miner records into a short status. The miner timestamp is the official **statistics sample time**. It is not a heartbeat from your Mac, and it is not the time this website last fetched data.",
        "## The statuses you will see",
        "- **Contributing**: the latest official sample reports the device active with throughput above zero. That is reported activity, not a live guarantee that it is computing this second.",
        "- **Waiting for tasks**: the device is reported active, but the latest sample has no throughput. It is often waiting to be assigned work.",
        "- **Not participating**: the device is not reported as in the current training set. This does not prove it is offline or broken.",
        "- **Not found**: every active run list was fetched successfully, and this Miner ID was not in them. Check the ID first.",
        "- **Unknown / check later**: some run lists could not be fetched. Incomplete coverage is not a device fault.",
        "## Two clocks, two meanings",
        "If this website cannot refresh official data for more than five minutes, the dashboard says the refresh was interrupted and keeps the last successful values. That is a **fetch** problem. It is different from an old sample timestamp on a successful fetch.",
        "> Zero throughput is not “the Mac is offline”. For local errors, open the IOTA Train at Home app. This website cannot read your machine’s logs.",
        "To add a device correctly, see [how to find your Miner ID](/learn/find-miner-id). To read the numbers beside the status, see [how rewards are counted](/learn/how-rewards-work).",
      ],
      zh: [
        "IOTA Watch 把官方 miner 记录收成一句人话状态。miner 时间戳是官方的**统计采样时间**，不是你 Mac 的心跳，也不是本站最近一次拉数的时间。",
        "## 你会看到这些状态",
        "- **有贡献**：最近一次官方采样显示设备在线，且吞吐量大于 0。这是上报活动，不保证这一秒一定在算。",
        "- **等待任务**：设备被报为在线，但最近一次采样没有吞吐量。常见情况是在等分配任务。",
        "- **暂未参与**：当前训练名单里没有把它算作正在参与。这不等于设备已离线或坏了。",
        "- **尚未找到**：所有进行中的训练任务名单都读成功了，里面没有这个 Miner ID。先核对 ID。",
        "- **待确认**：有一部分任务名单这次没读成功。覆盖不完整，不代表设备有问题。",
        "## 两个时间，两件事情",
        "如果本站超过 5 分钟都没能成功拿到官方数据，页面会提示刷新中断，并保留上一次成功的内容。那是**获取失败**。它和「这次获取成功，但官方采样时间比较旧」不是一回事。",
        "> 吞吐量为零，不等于「这台 Mac 掉线了」。本机报错仍要打开 IOTA Train at Home 应用查看。本站读不到你电脑上的日志。",
        "还没添加设备的话，先看 [如何找到 Miner ID](/learn/find-miner-id)。状态旁边的数字，见 [收益怎么算](/learn/how-rewards-work)。",
      ],
    },
  },
  {
    slug: "iota-train-at-home-vs-iota-coin",
    topic: { en: "Disambiguation", zh: "别搜错" },
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
        "## Side by side",
        "- **IOTA Train at Home**: home computers contribute training work. Rewards are the subnet alpha token, often called IOTA or SN9. You identify a machine with a public Miner ID (SS58 hotkey).",
        "- **IOTA Layer 1**: a separate ledger and token. Wallets such as Firefly hold that coin. They do not show Train at Home device status.",
        "- **IOTA Watch**: a read-only dashboard for Train at Home Miner IDs. It is not a wallet and never asks for a seed phrase.",
        "## How to tell which page you need",
        "If you want to see whether a Mac is contributing and what it earned today, you want [IOTA Watch](/learn/what-is-iota-watch) plus the official [Train at Home app](https://iota.macrocosmos.ai/). If you want to hold or send IOTA Layer 1 coins, use that network’s official wallet — not this site.",
        "> Never paste a private key, recovery phrase, or coldkey secret into IOTA Watch. The Miner ID is a public address.",
        "Next: [find the Miner ID](/learn/find-miner-id), then [read how rewards are counted](/learn/how-rewards-work).",
      ],
      zh: [
        "搜「IOTA」时，结果多半是 IOTA Foundation 的 Layer 1 公链。**IOTA Train at Home** 是另一件事：Macrocosmos 在 Bittensor 生态里的训练网络。IOTA Watch 只监控后者。",
        "## 对照看一眼",
        "- **IOTA Train at Home**：家里的电脑贡献训练算力。收益是子网 alpha 代币，常叫 IOTA 或 SN9。设备用公开 Miner ID（SS58 hotkey）识别。",
        "- **IOTA 公链**：另一套账本和代币。Firefly 这类钱包管的是公链币，看不到 Train at Home 设备状态。",
        "- **IOTA Watch**：只读监控 Train at Home 的 Miner ID。它不是钱包，也不会要助记词。",
        "## 怎么判断该打开哪个",
        "要看家里的 Mac 有没有在贡献、今天记了多少收益，用 [IOTA Watch](/learn/what-is-iota-watch) 和官方 [Train at Home 应用](https://iota.macrocosmos.ai/)。要持有或转出 IOTA 公链币，请用那条链的官方钱包，不要用本站。",
        "> 不要把私钥、助记词或 coldkey 密钥填进 IOTA Watch。Miner ID 是公开地址。",
        "下一步：[找到 Miner ID](/learn/find-miner-id)，然后看 [收益怎么算](/learn/how-rewards-work)。",
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
        "> Use the IOTA number when you need the official accounting. Use USD only as a rough sense of scale.",
        "If you are still mixing this token up with IOTA Layer 1, read [Train at Home vs the IOTA coin](/learn/iota-train-at-home-vs-iota-coin).",
      ],
      zh: [
        "监控页对同一笔收益会给出**两个数字**：官方 entitlements 里的 IOTA 数量，以及旁边估算的美元。",
        "## 哪些是官方口径",
        "今日和累计的 IOTA 数量仍按 [收益规则](/learn/how-rewards-work)：香港时间 0 点、只计 pending 和 settled，累计取 total earned。IOTA Watch 不会自己编这些 IOTA 数字。",
        "## 哪些只是估价",
        "美元一行，是用上述 IOTA 数量乘以 Train at Home 子网代币（SN9 / CoinGecko `iota-2`）的公开市场价格。它**不是** IOTA 公链币价，不是 TAO，也不保证你能按这个价格卖出。",
        "## 美元变成横线时",
        "行情接口不可用时，IOTA 数量照常显示，美元显示未知。没有价格不会当成 $0。",
        "> 要对账，看 IOTA。美元只用来感觉量级。",
        "如果还在和 IOTA 公链搞混，先看 [Train at Home 和 IOTA 公链的区别](/learn/iota-train-at-home-vs-iota-coin)。",
      ],
    },
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function articlePath(locale: Locale, slug: string) {
  return `/${locale}/learn/${slug}`;
}
