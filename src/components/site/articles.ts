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
      en: "About IOTA Watch",
      zh: "关于 IOTA Watch",
    },
    description: {
      en: "A read-only view of your Train at Home devices and rewards.",
      zh: "查看 Train at Home 设备状态和收益的只读工具。",
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
      en: "Where is my Miner ID?",
      zh: "Miner ID 在哪里？",
    },
    description: {
      en: "Copy it from the Miner screen in Train at Home.",
      zh: "从 Train at Home 的 Miner 页面复制。",
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
        "Without signing in, the list stays in this browser (up to 3 devices). [Sign in with Google](/learn/google-account-device-list) to bind up to 10 and open the same list elsewhere. You can still export a JSON backup.",
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
        "未登录时清单保存在当前浏览器（最多 3 台）。[用 Google 登录](/learn/google-account-device-list) 后最多绑定 10 台，换设备也能看。仍然可以导出 JSON 备份。",
        "> ID 不完整就匹配不上。如果显示「尚未找到」，先核对是否复制了整段公开地址。",
        "保存之后，可以看 [设备状态是什么意思](/learn/device-status)，以及 [收益怎么算](/learn/how-rewards-work)。",
      ],
    },
  },
  {
    slug: "how-rewards-work",
    topic: { en: "Rewards", zh: "收益口径" },
    title: {
      en: "How are rewards counted?",
      zh: "收益怎么算？",
    },
    description: {
      en: "What today, lifetime, and missing values mean.",
      zh: "今日、累计和缺失数据分别代表什么。",
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
      en: "What does each status mean?",
      zh: "设备状态是什么意思？",
    },
    description: {
      en: "Contributing, waiting, not participating, and unknown.",
      zh: "有贡献、等待任务、暂未参与和待确认。",
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
        "If this website cannot refresh official data for more than five minutes, the dashboard says the refresh was interrupted and keeps the last successful values. That is a **fetch** problem. It is different from an old sample timestamp on a successful fetch. Details: [what “refresh interrupted” means](/learn/what-refresh-interrupted-means).",
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
        "如果本站超过 5 分钟都没能成功拿到官方数据，页面会提示刷新中断，并保留上一次成功的内容。那是**获取失败**。它和「这次获取成功，但官方采样时间比较旧」不是一回事。详见 [刷新中断是什么意思](/learn/what-refresh-interrupted-means)。",
        "> 吞吐量为零，不等于「这台 Mac 掉线了」。本机报错仍要打开 IOTA Train at Home 应用查看。本站读不到你电脑上的日志。",
        "还没添加设备的话，先看 [如何找到 Miner ID](/learn/find-miner-id)。状态旁边的数字，见 [收益怎么算](/learn/how-rewards-work)。",
      ],
    },
  },
  {
    slug: "iota-train-at-home-vs-iota-coin",
    topic: { en: "Disambiguation", zh: "别搜错" },
    title: {
      en: "Train at Home and the IOTA network",
      zh: "Train at Home 和 IOTA 公链",
    },
    description: {
      en: "They share a name, but they are separate products.",
      zh: "名字相同，但不是同一个产品。",
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
        "Next: [find the Miner ID](/learn/find-miner-id), [what SN9 / IOTA means here](/learn/what-is-sn9-iota), then [read how rewards are counted](/learn/how-rewards-work).",
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
        "下一步：[找到 Miner ID](/learn/find-miner-id)，了解 [这里的 SN9 / IOTA 是什么](/learn/what-is-sn9-iota)，然后看 [收益怎么算](/learn/how-rewards-work)。",
      ],
    },
  },
  {
    slug: "iota-rewards-in-usd",
    topic: { en: "USD estimate", zh: "美元估价" },
    title: {
      en: "About the USD estimate",
      zh: "关于美元估价",
    },
    description: {
      en: "A rough market estimate beside the official IOTA amount.",
      zh: "官方 IOTA 数量旁的市场估价。",
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
  {
    slug: "what-refresh-interrupted-means",
    topic: { en: "Refresh", zh: "刷新中断" },
    title: {
      en: "Refresh interrupted",
      zh: "刷新中断",
    },
    description: {
      en: "The dashboard could not update; your Mac may still be fine.",
      zh: "监控页暂时没能更新，不代表 Mac 已经离线。",
    },
    body: {
      en: [
        "**Refresh interrupted** appears when this website cannot complete a successful read of official Train at Home data for more than five minutes. The cards keep the last values that did arrive.",
        "It is a **website fetch** status. It is not a heartbeat from your Mac, and it is not the official statistics sample time.",
        "## What it is not",
        "- Not “the device stopped training”",
        "- Not “throughput is zero, so the Mac is offline”",
        "- Not the same as [Not found](/learn/device-not-found), which means the Miner ID was missing from a complete run list",
        "## What you can still trust",
        "IOTA amounts that already loaded are the last official entitlements this site received. USD beside them is only a public SN9 estimate. See [how rewards are counted](/learn/how-rewards-work).",
        "## What to do",
        "- Wait for the next automatic check, or tap refresh once (there is a short cooldown)",
        "- If the yellow notice names an upstream error, the official API was unreachable from this site",
        "- For local errors — app disconnected, GPU idle, login failed — open the Train at Home app on that machine. IOTA Watch cannot read Mac logs",
        "> After a successful fetch, the badge should return to contributing, waiting, or not participating. Read those here: [device statuses](/learn/device-status).",
      ],
      zh: [
        "**刷新中断**出现在本站超过 5 分钟都没能成功读完官方 Train at Home 数据时。卡片会保留上一次已经拿到的数字。",
        "这是**网站获取**状态，不是你 Mac 的心跳，也不是官方统计采样时间。",
        "## 它不是什么",
        "- 不是「设备已经停止训练」",
        "- 不是「吞吐量为零，所以 Mac 掉线了」",
        "- 也不同于 [尚未找到](/learn/device-not-found)：那是完整名单里没有这个 Miner ID",
        "## 哪些数字还能看",
        "已经显示出来的 IOTA 数量，是本站上次拿到的官方 entitlements。旁边的美元只是 SN9 公开市场估价。口径见 [收益怎么算](/learn/how-rewards-work)。",
        "## 你可以怎么做",
        "- 等下一轮自动检查，或点一次刷新（有短暂冷却）",
        "- 如果黄色提示写了上游错误，说明本站当时连不上官方接口",
        "- 本机报错——应用断连、GPU 空闲、登录失败——请打开那台机器上的 Train at Home 应用。IOTA Watch 读不到 Mac 日志",
        "> 获取成功后，徽章应回到有贡献、等待任务或暂未参与。对照见 [设备状态含义](/learn/device-status)。",
      ],
    },
  },
  {
    slug: "google-account-device-list",
    topic: { en: "Account", zh: "账号同步" },
    title: {
      en: "Use the same list elsewhere",
      zh: "在其他设备查看同一清单",
    },
    description: {
      en: "Sign in with Google, or export and import a backup.",
      zh: "登录 Google，或导出后再导入。",
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
        "Need the ID first? [Find your Miner ID](/learn/find-miner-id).",
      ],
      zh: [
        "IOTA Watch 的 Google 登录只绑定**公开 Miner ID 和设备名称**。这不是钱包登录，不要密码、私钥或助记词。",
        "## 未登录时",
        "- 当前浏览器最多保存 **3** 台",
        "- 清单位于这台设备的本地存储",
        "- 另一部手机或电脑看不到，除非你导出 JSON 再导入",
        "## Google 登录后",
        "- 同一账号最多绑定 **10** 台",
        "- 打开 [账号页](/account) 可看到 Google 提供的姓名、邮箱和头像",
        "- 添加、改名、移除都在 [监控页](/app) 完成",
        "- 换设备登录同一账号，就能看到同一份清单",
        "## 会存什么",
        "公开的 SS58 hotkey、你起的名字，以及添加时间。状态和收益来自官方公开接口。详见 [隐私说明](/privacy)。",
        "> 退出登录不会删除官方训练记录，只是让这台浏览器不再读取已绑定的清单。",
        "还没有 ID？先看 [如何找到 Miner ID](/learn/find-miner-id)。",
      ],
    },
  },
  {
    slug: "what-is-sn9-iota",
    topic: { en: "Token", zh: "子网代币" },
    title: {
      en: "What is SN9 / IOTA?",
      zh: "SN9 / IOTA 是什么？",
    },
    description: {
      en: "The Train at Home subnet token shown in rewards.",
      zh: "收益中显示的 Train at Home 子网代币。",
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
        "Train at Home 的收益单位是子网 **alpha 代币**。大家常叫它 IOTA 或 **SN9**。IOTA Watch 用的就是官方 entitlements 接口返回的同一单位。",
        "## 一句话解释 SN9",
        "SN9 是 Bittensor 子网 9，也就是 Macrocosmos 的 IOTA Train at Home。这个代币在 CoinGecko 上的 id 是 `iota-2`，不要用公链的 `iota`。",
        "## 它不是什么",
        "- 不是 **TAO**（Bittensor 主网代币）",
        "- 不是 **IOTA Foundation** 公链币，也不是 Firefly 里的那种 IOTA",
        "- 不是美元结算。监控页上的 USD 只是公开市场估价",
        "如果搜索结果总把你带到另一条 IOTA，先看 [Train at Home 和 IOTA 公链的区别](/learn/iota-train-at-home-vs-iota-coin)。",
        "## IOTA Watch 怎么用它",
        "今日和累计数字保持官方 IOTA 数量。美元一行用公开 SN9 价格去乘。没有行情就显示横线，不会当成 $0。详见 [美元估价](/learn/iota-rewards-in-usd) 和 [收益规则](/learn/how-rewards-work)。",
        "> IOTA Watch 不能发送、兑换或托管这种代币，只展示官方记账数量。",
      ],
    },
  },
  {
    slug: "device-not-found",
    topic: { en: "Troubleshooting", zh: "尚未找到" },
    title: {
      en: "Miner ID not found",
      zh: "找不到 Miner ID",
    },
    description: {
      en: "Check the complete public ID first.",
      zh: "先核对完整的公开 ID。",
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
        "## 先核对 ID",
        "- 从官方应用的 Miner 页面复制完整公开 Miner ID",
        "- 它是 SS58 hotkey，通常以 `5` 开头",
        "- 不要粘贴私钥、助记词、coldkey 密钥，或本站清单的行号",
        "步骤见 [如何找到 Miner ID](/learn/find-miner-id)。",
        "## 其他常见原因",
        "- 应用已安装，但矿工还没注册，或还没出现在任何进行中的任务里",
        "- 重装应用后还在用旧 ID",
        "- 粘贴时截断了一个字符",
        "> 训练仍要在官方应用里运行。IOTA Watch 不能替你注册矿工或开始任务。",
        "ID 正确且获取成功后，卡片应变成有贡献、等待任务或暂未参与。含义见 [设备状态](/learn/device-status)。",
      ],
    },
  },
];

export type ArticleCluster = "understand" | "start" | "read";

export const articleClusterMeta: Record<
  ArticleCluster,
  { title: { en: string; zh: string }; slugs: string[] }
> = {
  understand: {
    title: { en: "Tell the products apart", zh: "先分清产品" },
    slugs: ["what-is-iota-watch", "iota-train-at-home-vs-iota-coin", "what-is-sn9-iota"],
  },
  start: {
    title: { en: "Get started", zh: "开始使用" },
    slugs: ["find-miner-id", "google-account-device-list", "device-not-found"],
  },
  read: {
    title: { en: "Status and rewards", zh: "状态与收益" },
    slugs: [
      "how-rewards-work",
      "iota-rewards-in-usd",
      "device-status",
      "what-refresh-interrupted-means",
    ],
  },
};

const relatedBySlug: Record<string, string[]> = {
  "what-is-iota-watch": ["iota-train-at-home-vs-iota-coin", "what-is-sn9-iota", "find-miner-id"],
  "find-miner-id": ["google-account-device-list", "device-not-found", "device-status"],
  "how-rewards-work": ["iota-rewards-in-usd", "what-is-sn9-iota", "device-status"],
  "device-status": ["what-refresh-interrupted-means", "device-not-found", "how-rewards-work"],
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
