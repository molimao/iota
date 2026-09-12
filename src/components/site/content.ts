export const content = {
  en: {
    nav: ["Guide", "FAQ", "Privacy", "Open dashboard"],
    eyebrow: "FOR IOTA TRAIN AT HOME",
    title: "More devices.\nOne clear picture.",
    intro:
      "Track your training devices, compare reported activity, and see daily and lifetime rewards in one place. An independent monitor for IOTA Train at Home.",
    cta: "Watch my devices",
    secondary: "How it works",
    notes: ["No account required", "No three-device limit", "Public Miner IDs only"],
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
        "Export a JSON backup to import on another browser. IDs are saved locally in this browser.",
      ],
    ],
    bottomTitle: "Your next device belongs here, too.",
    bottom: "Start with one Miner ID. Add the rest whenever you are ready.",
    independent:
      "Independent community tool. Not affiliated with or endorsed by Macrocosmos. This site monitors public data; it does not start training or hold funds.",
    guideTitle: "Start watching your IOTA devices",
    guideIntro:
      "The monitor works alongside the IOTA Train at Home application. Your machines continue running the training client separately.",
    faqTitle: "Understand your data",
    faqIntro:
      "What the numbers mean, how often they refresh, and what this tool can and cannot tell you.",
    faq: [
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
        "Here IOTA refers to the Train at Home subnet alpha token used by the upstream reward API. It is not a TAO amount or a fiat valuation. Lifetime rewards use the total earned amount; paid amounts are not added again.",
      ],
      [
        "How current are the numbers?",
        "The dashboard checks every five seconds. Server caches normally retain device status for 60 seconds and rewards for five minutes. Manual refresh has a 15-second cooldown. Official sample time and the time we fetched it are different.",
      ],
      [
        "Does zero throughput mean my device is offline?",
        "No. It can be waiting or not participating in the sampled run. A website refresh failure is also different from a device failure. Check the IOTA app when you need local diagnostics.",
      ],
      [
        "Is there a device limit or login?",
        "There is no three-device product limit and no account is required. Large lists take longer to refresh and remain subject to browser storage and upstream service limits.",
      ],
      [
        "Can I use the same list on my phone?",
        "Export the device list and import it in the other browser. Local storage is not automatically synced between browsers or devices.",
      ],
      [
        "Why is a reward value missing?",
        "Unavailable or malformed data is shown as unknown, not zero. Overall totals show partial coverage when not all devices have usable reward data.",
      ],
    ],
    privacyTitle: "Your device list stays in your browser",
    privacyIntro: "No wallet connection, private key, or seed phrase is required.",
    privacy: [
      [
        "What is stored locally",
        "The browser stores your public Miner IDs, labels, and the time they were added under iota-watchlist-v1. A separate bounded cache retains recently fetched telemetry for up to 24 hours.",
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
        "Exporting and removing your list",
        "Export creates a JSON file containing public IDs and device labels. Remove devices in the dashboard, or clear this site’s browser storage to erase the local list and cached data. Export a backup first if you want to keep it.",
      ],
      [
        "Independent, read-only access",
        "The monitor cannot access your Mac’s log files, change training settings, move tokens or sign transactions. Public addresses can be linked to activity and rewards, so share them with that visibility in mind.",
      ],
    ],
    updated: "Updated September 12, 2026",
  },
  zh: {
    nav: ["使用指南", "常见问题", "隐私说明", "打开监控"],
    eyebrow: "为 IOTA TRAIN AT HOME 而做",
    title: "设备再多，\n也能一眼看清。",
    intro:
      "把多台训练设备放到一起，查看运行状态、当日收益和累计收益。一个面向 IOTA Train at Home 的独立监控工具。",
    cta: "开始监控我的设备",
    secondary: "看看怎么用",
    notes: ["无需注册账号", "没有 3 台数量限制", "只需公开 Miner ID"],
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
        "导出 JSON 备份，在其他浏览器导入。设备 ID 会保存在当前浏览器中。",
      ],
    ],
    bottomTitle: "下一台设备，也一起加进来。",
    bottom: "从一个 Miner ID 开始，随时补齐你的设备清单。",
    independent:
      "独立社区工具，与 Macrocosmos 无隶属或背书关系。本站只监控公开数据，不启动训练，也不托管资金。",
    guideTitle: "开始监控你的 IOTA 设备",
    guideIntro:
      "监控工具配合 IOTA Train at Home 应用使用。每台机器上的训练客户端仍需单独保持运行。",
    faqTitle: "看懂设备和收益数据",
    faqIntro: "数字代表什么、多久刷新一次，以及这个工具能确认和不能确认的事情。",
    faq: [
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
        "这里指 Train at Home 上游收益接口使用的子网 alpha 代币，不是 TAO 数量，也不是法币估值。累计收益取 total earned，不会再叠加已支付金额。",
      ],
      [
        "数据多久刷新？",
        "页面每 5 秒检查更新。服务端通常将设备状态缓存 60 秒，收益缓存 5 分钟。手动刷新有 15 秒冷却。官方采样时间与本站获取时间是两回事。",
      ],
      [
        "吞吐量为零，就是设备离线了吗？",
        "不一定。设备可能正在等待任务，或没有参与当前采样的训练。网站刷新失败也不等于设备故障；本机诊断仍需查看 IOTA 应用。",
      ],
      [
        "设备有数量限制吗，需要登录吗？",
        "无需登录，没有 3 台的产品数量限制。大量设备会增加刷新时间，并受到浏览器存储和上游接口能力限制。",
      ],
      [
        "手机和电脑可以看同一个清单吗？",
        "可以导出设备清单，再在另一个浏览器中导入。本地存储不会自动跨浏览器、跨设备同步。",
      ],
      [
        "为什么收益有时是横线？",
        "无法获取或格式异常的数据会显示未知，不当作零。只有部分设备收益可用时，总计会注明覆盖数量。",
      ],
    ],
    privacyTitle: "设备清单，保存在你的浏览器",
    privacyIntro: "无需连接钱包，不需要私钥或助记词。",
    privacy: [
      [
        "本地存储什么",
        "浏览器在 iota-watchlist-v1 中保存公开 Miner ID、名称和添加时间。另有独立、限制大小的遥测缓存，最多保留 24 小时。",
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
        "如何导出或删除",
        "导出会生成包含公开 ID 和设备名称的 JSON 文件。在监控页移除设备，或清理本站浏览器存储，即可删除本地清单和缓存；需要保留时请先导出备份。",
      ],
      [
        "独立、只读",
        "监控工具不能读取你 Mac 的日志、改变训练设置、转移代币或签名交易。公开地址可能关联设备活动与收益，分享时请理解这些信息的可见性。",
      ],
    ],
    updated: "更新于 2026 年 9 月 12 日",
  },
} as const;
