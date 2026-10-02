import { withLocales } from "@/components/site/localization";
export const content = withLocales({
  en: {
    nav: ["Get started", "FAQ", "Help", "Privacy", "My devices", "Network"],
    eyebrow: "IOTA TRAIN AT HOME DEVICE MONITOR",
    title: "All IOTA devices\nstatus and rewards in one place.",
    intro: "Add a public Miner ID to view device status, today’s rewards, and lifetime rewards.",
    cta: "My devices",
    secondary: "How to find a Miner ID",
    notes: ["Public Miner ID only", "No account required", "Free"],
    disambiguationTitle: "Not the IOTA cryptocurrency",
    disambiguation:
      "IOTA Watch monitors IOTA Train at Home (Macrocosmos). It is not the IOTA Foundation chain, not an IOTA coin wallet, and it does not ask for a private key.",
    jobsEyebrow: "On the dashboard",
    jobsTitle: "What you can check.",
    jobsIntro: "Device status, reward records, and cases that require checking the machine itself.",
    jobs: [
      [
        "Status",
        "Whether official data still lists the device, and whether the last sample had training volume. An older sample does not mean the device is off.",
      ],
      [
        "Rewards",
        "Today starts at midnight in Hong Kong. Lifetime is everything already recorded. The dollar figure is a market estimate, not a payout.",
      ],
      [
        "Local checks",
        "Waiting for a task is normal. A failed refresh on this site is not evidence that the device has failed.",
      ],
    ],
    jobsLinks: [
      "/learn/device-status",
      "/learn/how-rewards-work",
      "/learn/what-refresh-interrupted-means",
    ],
    jobsCta: ["Device status", "How rewards are counted", "Refresh interrupted"],
    learnTitle: "How to use IOTA Watch",
    learnIntro: "Miner ID, status, rewards, and how the device list is stored after sign-in.",
    ecosystemTitle: "Official IOTA Train at Home links",
    ecosystem: [
      ["Download Train at Home", "https://iota.macrocosmos.ai/", "Official Mac app"],
      [
        "TAH user guide",
        "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
        "Install, train, and open Miner",
      ],
      [
        "Official network dashboard",
        "https://iota.macrocosmos.ai/dashboard",
        "Network-wide miner view",
      ],
      ["IOTA Watch source", "https://github.com/molimao/iota", "Open source on GitHub"],
    ],
    preview: "ILLUSTRATIVE VIEW · NOT LIVE DATA",
    previewTitle: "Device overview",
    statuses: ["Contributing", "Waiting for tasks", "Not participating"],
    previewNames: ["Workstation", "Living room Mac", "Studio device"],
    section: "Status and rewards\nin one place.",
    features: [
      [
        "01",
        "Device list",
        "Add the public Miner ID from each machine and keep them under names you choose.",
      ],
      [
        "02",
        "Accounted rewards",
        "Daily and lifetime accounted rewards per device and across the list. Missing data is shown as unknown, not zero.",
      ],
      [
        "03",
        "Reported status",
        "Reported activations, throughput and training history. Delayed statistics are not treated as proof that the device went offline.",
      ],
    ],
    stepsTitle: "Setup.",
    steps: [
      [
        "Copy the Miner ID",
        "In the IOTA Train at Home app, open Miner and copy the complete Miner ID.",
      ],
      [
        "Add the device",
        "Open the dashboard, add the ID, and give the device a name. Repeat for other machines.",
      ],
      [
        "Keep the list",
        "Sign in with Google to bind up to 10 devices to the account, or export a JSON backup.",
      ],
    ],
    bottomTitle: "Add more devices as needed.",
    bottom: "Start with one Miner ID. Add others when needed.",
    independent:
      "Independent community tool, not affiliated with Macrocosmos. Read-only view of public IOTA Train at Home data; not the IOTA Layer 1 wallet.",
    guideTitle: "Get started",
    guideIntro:
      "Use this monitor together with the IOTA Train at Home application. Training still runs in the client on each device.",
    faqTitle: "FAQ",
    faqIntro: "How rewards are counted, how often numbers update, and what this site cannot see.",
    faq: [
      [
        "Is this the IOTA cryptocurrency or Firefly wallet?",
        "No. IOTA Watch only monitors IOTA Train at Home (Macrocosmos / Bittensor subnet 9). The IOTA Foundation Layer 1 coin and Firefly are a different product.",
      ],
      [
        "What is IOTA Watch?",
        "A dashboard for IOTA Train at Home devices. Add a public Miner ID to view the reported status and reward records for that device.",
      ],
      [
        "Where do I find my Miner ID?",
        "Open IOTA Train at Home on the device, select Miner, and copy the complete Miner ID. Use the public SS58 hotkey address, not a private key, seed phrase, or a row number on this site.",
      ],
      [
        "Does this start mining or training?",
        "No. Training runs in the IOTA Train at Home application on each device. This site only monitors reported information and cannot restart the app or read local logs.",
      ],
      [
        "What counts as today’s rewards?",
        "Records dated today from 00:00 in Asia/Hong_Kong (UTC+8), up to the current time, with pending or settled status. Frozen records are excluded. This is an accounting date, not a guaranteed payout date.",
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
        "Does zero throughput mean the device is offline?",
        "No. It may be waiting or not participating in the sampled run. A website refresh failure is also different from a device failure. Use the IOTA app for local diagnostics.",
      ],
      [
        "Do I need an account?",
        "No. Without signing in you can keep up to 3 devices in this browser. Sign in with Google to bind up to 10 devices to the account and open the same list on another device.",
      ],
      [
        "Can I use the same list on a phone?",
        "Sign in with the same Google account, or export the list and import it in the other browser. The unsigned local list does not sync by itself.",
      ],
      [
        "Why is a reward value missing?",
        "Unavailable or malformed data is shown as unknown, not zero. Overall totals show partial coverage when not all devices have usable reward data.",
      ],
      [
        "What does refresh interrupted mean?",
        "This site could not finish a successful official read for more than five minutes. Last good numbers stay on the cards. It does not prove the device is offline.",
      ],
      [
        "What is SN9?",
        "SN9 is Bittensor subnet 9 (IOTA Train at Home). The reward token is the subnet alpha, also called IOTA here. It is not TAO and not IOTA Layer 1.",
      ],
    ],
    privacyTitle: "Privacy",
    privacyIntro: "No wallet connection, private key, or seed phrase is required.",
    privacy: [
      [
        "What is stored locally",
        "Without signing in, this browser keeps public Miner IDs and names, up to 3 devices. A small cache of recently fetched numbers is kept for up to 24 hours.",
      ],
      [
        "What is sent to the server",
        "To look up devices, the browser sends public Miner IDs to this site’s read-only service. The service requests public telemetry and reward records from iota-web.api.macrocosmos.ai. Local list storage does not mean IDs never leave the browser.",
      ],
      [
        "Hosting and technical logs",
        "Lovable hosts this site. The hosting provider may process IP addresses, request metadata and technical error reports. Do not put passwords or other secrets in device labels.",
      ],
      [
        "Accounts and removing the list",
        "Google sign-in is optional. After sign-in, the list is stored on the account (up to 10 devices) so it can be opened elsewhere. Export still creates a JSON file of public IDs and labels. Remove devices on the dashboard, or clear this site’s browser storage to erase the local copy.",
      ],
      [
        "Independent, read-only access",
        "The monitor cannot access Mac log files, change training settings, move tokens or sign transactions. Public addresses can be linked to activity and rewards; share them with that visibility in mind.",
      ],
    ],
    updated: "Updated September 12, 2026",
  },
  zh: {
    nav: ["使用指南", "常见问题", "使用说明", "隐私说明", "我的设备", "全网"],
    eyebrow: "IOTA TRAIN AT HOME 设备监控",
    title: "在一处查看全部 IOTA 设备\n训练状态与收益。",
    intro: "添加公开 Miner ID，查看设备状态、今日收益与累计收益。",
    cta: "我的设备",
    secondary: "如何获取 Miner ID",
    notes: ["只需公开 Miner ID", "无需注册", "免费"],
    disambiguationTitle: "不是 IOTA 公链",
    disambiguation:
      "IOTA Watch 监控 Macrocosmos 的 IOTA Train at Home 设备。它不是 IOTA Foundation 公链，不是 Firefly，也不能持有或转出代币。",
    jobsEyebrow: "监控页",
    jobsTitle: "可查看的内容。",
    jobsIntro: "设备状态、收益记录，以及需要在本机确认的情况。",
    jobs: [
      [
        "运行状态",
        "根据官方数据判断设备是否在线，以及最近一次是否有训练量。采样时间较旧，不表示设备已关机。",
      ],
      [
        "今日收益",
        "今日收益从香港时间 0 点起算。累计为官方已记录总额。美元为市场估价，不是结算金额。",
      ],
      ["本机情况", "等待任务属于正常状态。若本站刷新失败，不表示设备故障。"],
    ],
    jobsLinks: [
      "/learn/device-status",
      "/learn/how-rewards-work",
      "/learn/what-refresh-interrupted-means",
    ],
    jobsCta: ["设备状态", "收益计算", "刷新中断"],
    learnTitle: "使用说明",
    learnIntro: "Miner ID、设备状态、收益，以及登录后的清单同步。",
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
    previewTitle: "设备概览",
    statuses: ["有训练贡献", "在线待任务", "暂未参与"],
    previewNames: ["工作站", "客厅 Mac", "工作室设备"],
    section: "状态与收益\n集中查看。",
    features: [
      ["01", "设备清单", "添加每台机器的公开 Miner ID，并用自定义名称整理。"],
      [
        "02",
        "记账收益",
        "查看每台设备及整个清单的当日、累计记账收益。缺失数据标为未知，不记作零。",
      ],
      ["03", "上报状态", "查看激活处理量、吞吐量和训练记录。统计采样较旧，不视为设备掉线。"],
    ],
    stepsTitle: "使用步骤。",
    steps: [
      ["复制 Miner ID", "在设备上打开 IOTA Train at Home 应用，于 Miner 页面复制完整 Miner ID。"],
      ["添加设备", "在监控页填写 ID 与设备名称。其余设备按同样方式添加。"],
      ["同步清单", "使用 Google 登录后最多绑定 10 台，可在其他设备查看；也可导出 JSON 备份。"],
    ],
    bottomTitle: "可继续添加设备。",
    bottom: "先添加一台设备，再按需补充。",
    independent:
      "独立社区工具，与 Macrocosmos 无隶属关系。只读取 IOTA Train at Home 的公开数据，不是 IOTA 公链钱包。",
    guideTitle: "使用指南",
    guideIntro: "配合 IOTA Train at Home 应用使用。训练仍在各设备的客户端中运行。",
    faqTitle: "常见问题",
    faqIntro: "收益计算、数据更新频率，以及本站无法查看的内容。",
    faq: [
      [
        "这是 IOTA 公链或 Firefly 钱包吗？",
        "不是。IOTA Watch 只监控 IOTA Train at Home（Macrocosmos / Bittensor 子网 9）。IOTA Foundation 公链和 Firefly 是另一套产品。",
      ],
      [
        "IOTA Watch 是什么？",
        "IOTA Train at Home 的设备监控页。添加公开 Miner ID 后，可查看该设备上报的状态和收益记录。",
      ],
      [
        "Miner ID 从哪里找？",
        "打开该设备的 IOTA Train at Home 应用，进入 Miner 页面，复制完整 Miner ID。使用公开的 SS58 hotkey 地址，不是私钥、助记词或本站清单行号。",
      ],
      [
        "打开网站就能开始挖矿吗？",
        "不能。训练在每台设备的 IOTA Train at Home 应用中运行。本站只查看上报信息，不能重启应用或读取本地日志。",
      ],
      [
        "今日收益怎么算？",
        "按香港时间（UTC+8）当天 00:00 至当前时间内的 pending、settled 记账记录求和，不包含冻结记录。这是记账日口径，不代表当天一定到账。",
      ],
      [
        "收益单位 IOTA 是什么？",
        "这里指 Train at Home 上游收益接口使用的子网 alpha 代币，不是 TAO，也不是 IOTA 公链币。监控页会同时给出按公开市场价格估算的美元，不是官方结算价。累计收益取 total earned，不会再叠加已支付金额。",
      ],
      [
        "数据多久刷新？",
        "设备状态大约每 30 秒检查一次，收益大约每 2 分钟。官方采样时间和本站获取时间不同。手动刷新有 15 秒冷却。",
      ],
      [
        "吞吐量为零，就是设备离线了吗？",
        "不一定。设备可能正在等待任务，或没有参与当前采样的训练。网站刷新失败也不等于设备故障；本机诊断仍需查看 IOTA 应用。",
      ],
      [
        "需要注册账号吗？",
        "不必须。未登录时当前浏览器最多保存 3 台。使用 Google 登录后，清单绑定账号，最多 10 台，可在其他设备查看。",
      ],
      [
        "手机和电脑可以看同一个清单吗？",
        "登录同一个 Google 账号即可同步；也可以导出后再导入。未登录的本地清单不会自动同步。",
      ],
      [
        "为什么收益有时是横线？",
        "无法获取或格式异常的数据会显示未知，不记作零。只有部分设备收益可用时，总计会注明覆盖数量。",
      ],
      [
        "刷新中断是什么意思？",
        "本站超过 5 分钟未能成功读完官方数据。卡片保留上一次的数字。这不表示设备已掉线。",
      ],
      [
        "SN9 是什么？",
        "SN9 是 Bittensor 子网 9（IOTA Train at Home）。收益代币是子网 alpha，本站也称为 IOTA。它不是 TAO，也不是 IOTA 公链币。",
      ],
    ],
    privacyTitle: "隐私说明",
    privacyIntro: "无需连接钱包，不需要私钥或助记词。",
    privacy: [
      [
        "本地存储内容",
        "未登录时，当前浏览器会保存已添加的公开 Miner ID 和名称，最多 3 台。最近查询的数字会暂存最多 24 小时。",
      ],
      [
        "发送到服务端的数据",
        "查询时，浏览器会把公开 Miner ID 发给本站只读服务，再向 iota-web.api.macrocosmos.ai 请求公开状态和收益数据。本地保存清单并不表示 ID 从不离开浏览器。",
      ],
      [
        "托管与技术日志",
        "本站由 Lovable 托管。托管方可能处理 IP 地址、请求信息和技术错误报告。请勿在设备名称中填写密码或其他秘密。",
      ],
      [
        "账号、导出与删除",
        "Google 登录为可选项。登录后清单保存在账号中（最多 10 台），可在其他设备打开。导出会生成包含公开 ID 和设备名称的 JSON。在监控页移除设备，或清理本站浏览器存储，可删除本地副本。",
      ],
      [
        "独立、只读",
        "本站不能读取 Mac 日志、更改训练设置、转移代币或签名交易。公开地址可能关联设备活动与收益，分享时请注意可见范围。",
      ],
    ],
    updated: "更新于 2026 年 9 月 12 日",
  },
} as const);
