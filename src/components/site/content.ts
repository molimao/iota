export const content = {
  en: {
    nav: ["Get started", "FAQ", "Help", "Privacy", "Open dashboard", "Network"],
    eyebrow: "IOTA TRAIN AT HOME DEVICE MONITOR",
    title: "See your training.\nUnderstand your rewards.",
    intro:
      "Add a public Miner ID and see which devices are contributing, what they earned today, and lifetime accounted rewards. An independent monitor for IOTA Train at Home — not the IOTA Layer 1 wallet.",
    cta: "Watch my devices",
    secondary: "Find my Miner ID",
    notes: ["Optional Google sign-in", "Public Miner ID only", "Not the IOTA Layer 1 wallet"],
    disambiguationTitle: "Not the IOTA cryptocurrency",
    disambiguation:
      "IOTA Watch monitors IOTA Train at Home (Macrocosmos). It is not the IOTA Foundation chain, not an IOTA coin wallet, and it will never ask for a private key.",
    jobsEyebrow: "What you came here to check",
    jobsTitle: "Three things to look at.",
    jobsIntro: "Is the machine working, what has it earned, and when should you check the computer itself.",
    jobs: [
      [
        "Is it running?",
        "See whether official data still lists the device, and whether the last sample had training work. An older sample does not mean the Mac is off.",
      ],
      [
        "What has it earned?",
        "Today starts at midnight in Hong Kong. Lifetime is everything already recorded. The dollar figure is a market estimate, not a payout.",
      ],
      [
        "Should I check the computer?",
        "Waiting for a task is normal. If this website failed to refresh, that is our problem first — not proof the device is broken.",
      ],
    ],
    jobsLinks: [
      "/learn/device-status",
      "/learn/how-rewards-work",
      "/learn/what-refresh-interrupted-means",
    ],
    jobsCta: ["Read device statuses", "How rewards are counted", "What refresh interrupted means"],
    learnTitle: "How to use IOTA Watch",
    learnIntro:
      "Find your Miner ID, read device status and rewards, and keep the same list after you sign in.",
    ecosystemTitle: "Official IOTA Train at Home links",
    ecosystem: [
      ["Download Train at Home", "https://iota.macrocosmos.ai/", "Official Mac app"],
      [
        "TAH user guide",
        "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
        "How to install, train and open Miner",
      ],
      ["Official network dashboard", "https://iota.macrocosmos.ai/dashboard", "Network-wide miner view"],
      ["IOTA Watch source", "https://github.com/molimao/iota", "Open source on GitHub"],
    ],
    preview: "ILLUSTRATIVE VIEW · NOT LIVE DATA",
    previewTitle: "Your training, at a glance",
    statuses: ["Contributing", "Waiting for tasks", "Not participating"],
    previewNames: ["Home workstation", "Living room Mac", "Studio device"],
    section: "Know what is happening.\nKnow what you have earned.",
    features: [
      [
        "01",
        "Every device, together",
        "Add the public Miner ID from each machine. Keep a single watchlist with names you recognize.",
      ],
      [
        "02",
        "Rewards without guesswork",
        "View daily and lifetime accounted rewards per device and across your list. Missing data stays visibly unknown.",
      ],
      [
        "03",
        "Status with context",
        "See reported activations, throughput and training history. Delayed statistics are not treated as proof that your Mac went offline.",
      ],
    ],
    stepsTitle: "From Miner ID to overview.",
    steps: [
      [
        "Copy your Miner ID",
        "In the IOTA Train at Home app, open Miner and copy the complete Miner ID.",
      ],
      [
        "Add a name you recognize",
        "Open the dashboard, add the ID, and give the device a name. Repeat on your other machines.",
      ],
      [
        "Keep your list with you",
        "Sign in with Google to bind up to 10 devices to your account, or export a JSON backup for another browser.",
      ],
    ],
    bottomTitle: "Your next device belongs here, too.",
    bottom: "Start with one Miner ID. Add the rest whenever you are ready.",
    independent:
      "Independent community tool. Not affiliated with or endorsed by Macrocosmos. This site monitors public IOTA Train at Home data; it does not start training or hold funds. It is not the IOTA Layer 1 wallet.",
    guideTitle: "Start watching your IOTA devices",
    guideIntro:
      "The monitor works alongside the IOTA Train at Home application. Your machines continue running the training client separately.",
    faqTitle: "Common questions",
    faqIntro: "How rewards are counted, how often numbers update, and what this site cannot see.",
    faq: [
      [
        "Is this the IOTA cryptocurrency or Firefly wallet?",
        "No. IOTA Watch only monitors IOTA Train at Home (Macrocosmos / Bittensor subnet 9). The IOTA Foundation Layer 1 coin and Firefly are a different product.",
      ],
      [
        "What is IOTA Watch?",
        "An independent browser-based dashboard for IOTA Train at Home devices. It uses public Miner IDs to retrieve official reported status and reward records. It is not the unrelated IOTA Layer 1 network wallet.",
      ],
      [
        "Where do I find my Miner ID?",
        "Open IOTA Train at Home on the device, select Miner, and copy its complete Miner ID. Use the public SS58 hotkey address, not a private key, seed phrase, or watchlist row number.",
      ],
      [
        "Does this start mining or training?",
        "No. Training runs in the IOTA Train at Home application on each device. This website only monitors reported information and cannot restart your app or inspect local logs.",
      ],
      [
        "What counts as today’s rewards?",
        "Records dated today from 00:00 in Asia/Hong_Kong (UTC+8), up to the current time, with pending or settled status. Frozen records are excluded. This is the accounting date, not a guaranteed payout date.",
      ],
      [
        "What does the IOTA unit mean?",
        "Here IOTA refers to the Train at Home subnet alpha token used by the upstream reward API. It is not a TAO amount and not IOTA Layer 1. The dashboard also shows a USD estimate from the public SN9 market price; that is not an official settlement rate. Lifetime rewards use the total earned amount; paid amounts are not added again.",
      ],
      [
        "How current are the numbers?",
        "Device status is checked about every 30 seconds; rewards about every two minutes. Official sample time and the time this site fetched the data are different. Manual refresh has a 15-second cooldown.",
      ],
      [
        "Does zero throughput mean my device is offline?",
        "No. It can be waiting or not participating in the sampled run. A website refresh failure is also different from a device failure. Check the IOTA app when you need local diagnostics.",
      ],
      [
        "Do I need an account?",
        "No. Without signing in you can keep up to 3 devices in this browser. Sign in with Google to bind up to 10 devices to your account and open the same list on another device.",
      ],
      [
        "Can I use the same list on my phone?",
        "Sign in with the same Google account, or export the list and import it in the other browser. The unsigned local list does not sync by itself.",
      ],
      [
        "Why is a reward value missing?",
        "Unavailable or malformed data is shown as unknown, not zero. Overall totals show partial coverage when not all devices have usable reward data.",
      ],
      [
        "What does refresh interrupted mean?",
        "This site could not finish a successful official read for more than five minutes. Last good numbers stay on the cards. It does not prove the Mac is offline.",
      ],
      [
        "What is SN9?",
        "SN9 is Bittensor subnet 9 (IOTA Train at Home). The reward token is the subnet alpha, also called IOTA here. It is not TAO and not IOTA Layer 1.",
      ],
    ],
    privacyTitle: "Your device list, in the browser or on your account",
    privacyIntro: "No wallet connection, private key, or seed phrase is required.",
    privacy: [
      [
        "What is stored locally",
        "Without signing in, this browser keeps your public Miner IDs and names, up to 3 devices. A small cache of recently fetched numbers is kept for up to 24 hours.",
      ],
      [
        "What is sent to the server",
        "To look up devices, the browser sends public Miner IDs to this website’s read-only service. The service requests public telemetry and reward records from iota-web.api.macrocosmos.ai. This is local list storage, not a claim that IDs never leave your browser.",
      ],
      [
        "Hosting and technical logs",
        "Lovable hosts this site. The hosting provider may process IP addresses, request metadata and technical error reports. Do not put passwords or other secrets in device labels.",
      ],
      [
        "Accounts and removing your list",
        "Google sign-in is optional. After you sign in, the list is stored on your account (up to 10 devices) so you can open it elsewhere. Export still creates a JSON file of public IDs and labels. Remove devices in the dashboard, or clear this site’s browser storage to erase the local copy.",
      ],
      [
        "Independent, read-only access",
        "The monitor cannot access your Mac’s log files, change training settings, move tokens or sign transactions. Public addresses can be linked to activity and rewards, so share them with that visibility in mind.",
      ],
    ],
    updated: "Updated September 12, 2026",
  },
  zh: {
    nav: ["使用指南", "常见问题", "使用说明", "隐私说明", "打开监控", "全网"],
    eyebrow: "IOTA TRAIN AT HOME 设备监控",
    title: "训练有没有在跑，\n收益有没有记上。",
    intro:
      "添加公开 Miner ID，查看哪些设备在参与训练、今天记了多少收益、累计记了多少。面向 IOTA Train at Home 的独立监控工具，不是 IOTA 公链钱包。",
    cta: "开始监控我的设备",
    secondary: "如何找到 Miner ID",
    notes: ["可选 Google 登录", "只需公开 Miner ID", "不是 IOTA 币钱包"],
    disambiguationTitle: "先说清楚：这不是 IOTA 公链",
    disambiguation:
      "IOTA Watch 监控的是 Macrocosmos 的 IOTA Train at Home 设备。它不是 IOTA Foundation 公链，不是 Firefly，也不能持有或转出代币。",
    jobsEyebrow: "打开监控页时看这些",
    jobsTitle: "主要看三件事。",
    jobsIntro: "设备有没有在跑，今天赚了多少，要不要回到电脑上检查。",
    jobs: [
      [
        "设备在跑吗？",
        "看官方有没有还把它算在线，以及最近一次有没有训练量。采样时间比较旧，不等于电脑已经关机。",
      ],
      [
        "今天赚了多少？",
        "今日收益从香港时间凌晨算起。累计是官方已经记下的全部。旁边的美元是市场估价，不是到账金额。",
      ],
      [
        "要不要回去看电脑？",
        "在线等任务是正常的。如果是这个网站自己刷新失败，先别急着当成设备坏了。",
      ],
    ],
    jobsLinks: [
      "/learn/device-status",
      "/learn/how-rewards-work",
      "/learn/what-refresh-interrupted-means",
    ],
    jobsCta: ["看设备状态含义", "收益怎么算", "刷新中断是什么意思"],
    learnTitle: "使用说明",
    learnIntro: "Miner ID 怎么找、状态和收益怎么看、登录后设备清单怎么跟着走。",
    ecosystemTitle: "官方 IOTA Train at Home 入口",
    ecosystem: [
      ["下载 Train at Home", "https://iota.macrocosmos.ai/", "官方 Mac 应用"],
      [
        "TAH 用户指南",
        "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
        "安装、开始训练、打开 Miner",
      ],
      ["官方全网面板", "https://iota.macrocosmos.ai/dashboard", "全网矿工视图"],
      ["IOTA Watch 源码", "https://github.com/molimao/iota", "GitHub 开源"],
    ],
    preview: "界面示意 · 非实时数据",
    previewTitle: "你的训练设备，一目了然",
    statuses: ["有训练贡献", "在线待任务", "暂未参与"],
    previewNames: ["家里的工作站", "客厅 Mac", "工作室设备"],
    section: "知道设备在做什么，\n也知道收益有多少。",
    features: [
      [
        "01",
        "设备放一起，管理更轻松",
        "添加每台机器的公开 Miner ID，用熟悉的名称整理成一个设备清单。",
      ],
      [
        "02",
        "收益有依据，不靠猜",
        "查看每台设备及整个清单的当日、累计记账收益。缺失数据明确标出，不当作零。",
      ],
      [
        "03",
        "状态有解释，看得懂",
        "查看激活处理量、吞吐量和训练记录。不会把统计采样较旧直接当成设备掉线。",
      ],
    ],
    stepsTitle: "从 Miner ID，到设备全貌。",
    steps: [
      [
        "复制你的 Miner ID",
        "打开设备上的 IOTA Train at Home 应用，在 Miner 页面复制完整的 Miner ID。",
      ],
      ["起一个熟悉的名字", "打开监控页，添加 ID 和设备名称。其他机器也按同样的方式添加。"],
      [
        "备份清单，换个设备也能看",
        "用 Google 登录后最多绑定 10 台，换设备也能看；也可以继续导出 JSON 备份。",
      ],
    ],
    bottomTitle: "下一台设备，也一起加进来。",
    bottom: "从一个 Miner ID 开始，随时补齐你的设备清单。",
    independent:
      "独立社区工具，与 Macrocosmos 无隶属或背书关系。本站只监控 IOTA Train at Home 的公开数据，不启动训练，也不托管资金。它不是 IOTA 公链钱包。",
    guideTitle: "开始监控你的 IOTA 设备",
    guideIntro:
      "监控工具配合 IOTA Train at Home 应用使用。每台机器上的训练客户端仍需单独保持运行。",
    faqTitle: "常见问题",
    faqIntro: "收益怎么算、多久更新一次、哪些事这个网站看不出来。",
    faq: [
      [
        "这是 IOTA 公链或 Firefly 钱包吗？",
        "不是。IOTA Watch 只监控 IOTA Train at Home（Macrocosmos / Bittensor 子网 9）。IOTA Foundation 公链和 Firefly 是另一套产品。",
      ],
      [
        "IOTA Watch 是什么？",
        "面向 IOTA Train at Home 的独立网页监控工具，通过公开 Miner ID 查询官方上报状态和收益记录。它不是同名 IOTA Layer 1 网络的钱包。",
      ],
      [
        "Miner ID 从哪里找？",
        "打开该设备的 IOTA Train at Home 应用，切到 Miner 页面，复制完整 Miner ID。这里使用公开的 SS58 hotkey 地址，不是私钥、助记词或监控网站的行号。",
      ],
      [
        "打开网站就能开始挖矿吗？",
        "不能。训练在每台设备的 IOTA Train at Home 应用中运行。本站只查看上报信息，不能重启应用或读取你的本地日志。",
      ],
      [
        "今日收益怎么算？",
        "按香港时间（UTC+8）当天 00:00 至当前时间内的 pending、settled 记账记录求和，不包含冻结记录。这是记账日口径，不代表当天一定到账。",
      ],
      [
        "收益单位 IOTA 是什么？",
        "这里指 Train at Home 上游收益接口使用的子网 alpha 代币，不是 TAO，也不是 IOTA 公链币。监控页会同时给出按公开市场价格估算的美元，那不是官方结算价。累计收益取 total earned，不会再叠加已支付金额。",
      ],
      [
        "数据多久刷新？",
        "设备状态大约每 30 秒检查一次，收益大约每 2 分钟。官方采样时间和本站获取时间是两回事。手动刷新有 15 秒冷却。",
      ],
      [
        "吞吐量为零，就是设备离线了吗？",
        "不一定。设备可能正在等待任务，或没有参与当前采样的训练。网站刷新失败也不等于设备故障；本机诊断仍需查看 IOTA 应用。",
      ],
      [
        "需要注册账号吗？",
        "不必须。未登录时当前浏览器最多保存 3 台。用 Google 登录后，清单绑定账号，最多 10 台，换设备也能看。",
      ],
      [
        "手机和电脑可以看同一个清单吗？",
        "登录同一个 Google 账号即可同步；也可以继续导出后再导入。未登录的本地清单不会自己同步。",
      ],
      [
        "为什么收益有时是横线？",
        "无法获取或格式异常的数据会显示未知，不当作零。只有部分设备收益可用时，总计会注明覆盖数量。",
      ],
      [
        "刷新中断是什么意思？",
        "本站超过 5 分钟没能成功读完官方数据。卡片会留下上一次的数字。这不证明 Mac 已经掉线。",
      ],
      [
        "SN9 是什么？",
        "SN9 是 Bittensor 子网 9（IOTA Train at Home）。收益代币是子网 alpha，本站也叫 IOTA。它不是 TAO，也不是 IOTA 公链币。",
      ],
    ],
    privacyTitle: "设备清单：浏览器或账号",
    privacyIntro: "无需连接钱包，不需要私钥或助记词。",
    privacy: [
      [
        "本地存储什么",
        "未登录时，这个浏览器会保存你添加的公开 Miner ID 和名称，最多 3 台。最近查到的数字会暂存最多 24 小时。",
      ],
      [
        "什么数据会发送到服务端",
        "查询时，浏览器会把公开 Miner ID 发给本站只读服务，再向 iota-web.api.macrocosmos.ai 请求公开状态和收益数据。本地保存清单不等于 ID 从不离开浏览器。",
      ],
      [
        "托管与技术日志",
        "本站由 Lovable 托管。托管方可能处理 IP 地址、请求信息和技术错误报告。请勿在设备名称中填写密码或其他秘密。",
      ],
      [
        "账号、导出或删除",
        "Google 登录是可选的。登录后清单存在账号里（最多 10 台），换设备也能打开。导出会生成包含公开 ID 和设备名称的 JSON。在监控页移除设备，或清理本站浏览器存储，可删除本地副本。",
      ],
      [
        "独立、只读",
        "监控工具不能读取你 Mac 的日志、改变训练设置、转移代币或签名交易。公开地址可能关联设备活动与收益，分享时请理解这些信息的可见性。",
      ],
    ],
    updated: "更新于 2026 年 9 月 12 日",
  },
} as const;
