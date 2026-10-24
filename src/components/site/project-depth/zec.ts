import type { Article } from "../articles";

const published = "2026-10-24";
const modified = "2026-10-24";

const monitor: Article = {
  slug: "zec-mining-monitor-guide",
  modified,
  project: "zec",
  topic: {
    zh: "监控范围",
    "zh-TW": "監控範圍",
    en: "What the monitor reads",
    ko: "모니터가 읽는 범위",
    ja: "監視が読む範囲",
  },
  title: {
    zh: "ZEC 监控为什么只收透明 t 地址，不收 shielded？",
    "zh-TW": "ZEC 監控為什麼只收透明 t 地址，不收 shielded？",
    en: "Why the ZEC monitor accepts only transparent t-addresses",
    ko: "ZEC 모니터가 투명 t 주소만 받는 이유",
    ja: "ZEC監視が透明なtアドレスだけを受ける理由",
  },
  description: {
    zh: "ZEC 监控只查询 zec.2miners.com 上的透明 t1 或 t3。屏蔽地址和统一地址不进入这口矿池账户，速率单位是 S/s。",
    "zh-TW":
      "ZEC 監控只查詢 zec.2miners.com 上的透明 t1 或 t3。屏蔽地址和統一地址不進入這口礦池帳戶，速率單位是 S/s。",
    en: "The ZEC monitor queries only a transparent t1 or t3 on zec.2miners.com. Shielded and unified addresses are not that pool account, and the rate unit is S/s.",
    ko: "ZEC 모니터는 zec.2miners.com의 투명 t1 또는 t3만 조회합니다. 차폐·통합 주소는 그 풀 계정이 아니고, 속도 단위는 S/s입니다.",
    ja: "ZEC監視は zec.2miners.com の透明な t1 または t3 だけを照会します。シールドと統合アドレスはそのプール口座ではなく、速度の単位は S/s です。",
  },
  summary: {
    zh: "只把透明 t1 或 t3 交给这口 Equihash 普通矿池账户。屏蔽余额不是这里的未支付，解的速率写成 S/s，不是 H/s。",
    "zh-TW":
      "只把透明 t1 或 t3 交給這口 Equihash 普通礦池帳戶。屏蔽餘額不是這裡的未支付，解的速率寫成 S/s，不是 H/s。",
    en: "Give this regular Equihash pool account a transparent t1 or t3. A shielded balance is not the unpaid figure here, and the solution rate is S/s, not H/s.",
    ko: "이 Equihash 일반 풀 계정에는 투명 t1 또는 t3만 넣습니다. 차폐 잔액은 여기의 미지급이 아니고, 해의 속도는 H/s가 아닌 S/s입니다.",
    ja: "この Equihash 通常プール口座には透明な t1 か t3 だけを渡します。シールド残高はここの未払いではなく、解の速度は H/s ではなく S/s です。",
  },
  sources: [
    { name: "2Miners · ZEC help", url: "https://zec.2miners.com/help" },
    {
      name: "Zcash · shielded and transparent",
      url: "https://z.cash/learn/what-is-the-difference-between-shielded-and-transparent-zcash/",
    },
    { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
  ],
  related: ["zec-transparent-addresses", "zec-worker-not-found"],
  comparisonTitle: {
    zh: "什么能进 ZEC 监控",
    "zh-TW": "什麼能進 ZEC 監控",
    en: "What the ZEC monitor can open",
    ko: "ZEC 모니터가 여는 것",
    ja: "ZEC監視が開けるもの",
  },
  comparison: {
    zh: {
      headers: ["你手头的字符串", "本页怎么处理"],
      rows: [
        ["t1 或 t3，后面 33 位", "当作透明地址，查询 zec.2miners.com 的账户"],
        ["z 开头，或统一地址", "不查询。Zcash 把屏蔽财务信息视为私密"],
        ["矿机名、BTC 或 TON 领款地址", "不是这口矿池的 ZEC 账户"],
        ["速率显示为 S/s", "Equihash 的解数速率，不是 ZEC 枚数，也不是 H/s"],
      ],
    },
    "zh-TW": {
      headers: ["你手上的字串", "本頁怎麼處理"],
      rows: [
        ["t1 或 t3，後面 33 位", "當作透明地址，查詢 zec.2miners.com 的帳戶"],
        ["z 開頭，或統一地址", "不查詢。Zcash 把屏蔽財務資訊視為私密"],
        ["礦機名、BTC 或 TON 領款地址", "不是這口礦池的 ZEC 帳戶"],
        ["速率顯示為 S/s", "Equihash 的解數速率，不是 ZEC 枚數，也不是 H/s"],
      ],
    },
    en: {
      headers: ["String you have", "What this page does"],
      rows: [
        ["t1 or t3, then 33 characters", "Treated as transparent and queried on zec.2miners.com"],
        [
          "Starts with z, or a unified address",
          "Not queried. Zcash treats shielded financial information as private",
        ],
        ["A rig name, or a BTC or TON payout address", "Not this pool's ZEC account"],
        ["Rate shown as S/s", "Equihash solutions per second, not coins and not H/s"],
      ],
    },
    ko: {
      headers: ["가진 문자열", "이 페이지의 처리"],
      rows: [
        ["t1 또는 t3 다음 33자", "투명 주소로 보고 zec.2miners.com 계정을 조회"],
        ["z로 시작하거나 통합 주소", "조회하지 않음. Zcash는 차폐 재무 정보를 비공개로 둠"],
        ["리그 이름, BTC 또는 TON 수령 주소", "이 풀의 ZEC 계정이 아님"],
        ["속도가 S/s", "Equihash 해의 속도. ZEC 개수도 H/s도 아님"],
      ],
    },
    ja: {
      headers: ["手元の文字列", "このページの扱い"],
      rows: [
        ["t1 または t3 の後に 33 文字", "透明アドレスとして zec.2miners.com の口座を照会"],
        ["z で始まる、または統合アドレス", "照会しない。Zcash はシールドの財務情報を非公開とする"],
        ["リグ名、BTC または TON の受取先", "このプールの ZEC 口座ではない"],
        ["速度が S/s", "Equihash の解の速度。ZEC の枚数でも H/s でもない"],
      ],
    },
  },
  body: {
    zh: [
      "ZEC 监控读的是 zec.2miners.com 上一份普通矿池账户。地址必须是透明的 t1 或 t3，前缀后面 33 位。2Miners 的 ZEC 帮助页用一个 t1 作为钱包示例，算法写成 EquiHash。以 z 开头的屏蔽地址、统一地址，本页不接收。Zcash 说明屏蔽地址把财务信息保持私密，透明地址则把该信息公开。查询不启动挖矿，也不要粘贴私钥。",
      "## 页面上的数是什么",
      "打开后看到的是矿池账上的未支付 ZEC、累计已支付、滚动近 24 小时收益、当前解数速率，以及这个钱包下面报告的 Worker。速率写成 S/s，表示 Equihash 的解，不是 H/s，也不是币的枚数。透明地址之所以能被矿池按地址入账，是因为这类地址的转账信息是公开的。屏蔽钱包里的余额是另一套数，不要和未支付相加。",
      "## 先看哪几项",
      "先看前缀和长度，再看矿机指向哪里。形状不对时，本页不会去查矿池。帮助页允许领款币种选 ZEC、BTC 或 TON；BTC 和 TON 的领款字符串不是这里要填的 ZEC 账户。API 说明列出 ZEC 同时有 PPLNS 和 SOLO 两类矿池。本页只读 zec.2miners.com 的账户接口，不把另一台服务器并进同一行。",
      "## 接下来怎么做",
      "在 [Zcash 监控](/projects/zec) 里，一台已保存设备放一个透明地址。免费每个项目 5 台已保存设备，Pro 每个项目 50 台。同一个钱包下面列出的 Worker 不会自动各占一台。只有你把某台 Worker 另存成独立设备时，它才计入名额。同一台已保存设备上重复绑定 ZEC，不额外占名额。移除保存记录不会让矿机停机。地址形状正确但 Worker 名单为空时，先回矿池账户页看有没有份额；空名单不是硬件结论。",
      "## 一个说明性例子",
      "假设帮助页那种 t1 已保存，矿池报告一名 Worker 为 80 S/s、未支付 0.012 ZEC。这些数字来自矿池账户，不是本站实测，也不是屏蔽钱包余额。同一个输入框若贴上 z 开头的地址，本页在显示任何矿池余额之前就拒绝。矿池没有给出的字段保持未知，不会被写成 0。",
      "## 界限",
      "这里不是 Zcash 区块浏览器，不显示屏蔽余额，也不显示 BTC 或 TON 领款。帮助页点名的 ASIC 只说明矿池接受那些机型提交，本站没有测量过它们的 S/s。Mac Agent 只控制 IOTA Train at Home 的 Mac，不能开关 ZEC 矿机。崩溃解读免费，也不占用本项目的设备名额。",
    ],
    "zh-TW": [
      "ZEC 監控讀的是 zec.2miners.com 上一份普通礦池帳戶。地址必須是透明的 t1 或 t3，前綴後面 33 位。2Miners 的 ZEC 幫助頁用一個 t1 作為錢包示例，演算法寫成 EquiHash。以 z 開頭的屏蔽地址、統一地址，本頁不接收。Zcash 說明屏蔽地址把財務資訊保持私密，透明地址則把該資訊公開。查詢不啟動挖礦，也不要貼上私鑰。",
      "## 頁面上的數是什麼",
      "打開後看到的是礦池帳上的未支付 ZEC、累計已支付、滾動近 24 小時收益、當前解數速率，以及這個錢包下面報告的 Worker。速率寫成 S/s，表示 Equihash 的解，不是 H/s，也不是幣的枚數。透明地址之所以能被礦池按地址入帳，是因為這類地址的轉帳資訊是公開的。屏蔽錢包裡的餘額是另一套數，不要和未支付相加。",
      "## 先看哪幾項",
      "先看前綴和長度，再看礦機指向哪裡。形狀不對時，本頁不會去查礦池。幫助頁允許領款幣種選 ZEC、BTC 或 TON；BTC 和 TON 的領款字串不是這裡要填的 ZEC 帳戶。API 說明列出 ZEC 同時有 PPLNS 和 SOLO 兩類礦池。本頁只讀 zec.2miners.com 的帳戶介面，不把另一台伺服器併進同一行。",
      "## 接下來怎麼做",
      "在 [Zcash 監控](/projects/zec) 裡，一台已儲存裝置放一個透明地址。免費每個專案 5 台已儲存裝置，Pro 每個專案 50 台。同一個錢包下面列出的 Worker 不會自動各佔一台。只有你把某台 Worker 另存成獨立裝置時，它才計入名額。同一台已儲存裝置上重複綁定 ZEC，不額外佔名額。移除儲存紀錄不會讓礦機停機。地址形狀正確但 Worker 名單為空時，先回礦池帳戶頁看有沒有份額；空名單不是硬體結論。",
      "## 一個說明性例子",
      "假設幫助頁那種 t1 已儲存，礦池報告一名 Worker 為 80 S/s、未支付 0.012 ZEC。這些數字來自礦池帳戶，不是本站實測，也不是屏蔽錢包餘額。同一個輸入框若貼上 z 開頭的地址，本頁在顯示任何礦池餘額之前就拒絕。礦池沒有給出的欄位保持未知，不會被寫成 0。",
      "## 界限",
      "這裡不是 Zcash 區塊瀏覽器，不顯示屏蔽餘額，也不顯示 BTC 或 TON 領款。幫助頁點名的 ASIC 只說明礦池接受那些機型提交，本站沒有測量過它們的 S/s。Mac Agent 只控制 IOTA Train at Home 的 Mac，不能開關 ZEC 礦機。崩潰解讀免費，也不佔用本專案的裝置名額。",
    ],
    en: [
      "The ZEC monitor reads one regular-pool account on zec.2miners.com. The address has to be a transparent t1 or t3 with 33 characters after the prefix. The 2Miners ZEC help page uses a t1 as its wallet example and names the algorithm EquiHash. A shielded address starting with z, and a unified address, are not accepted. Zcash says a shielded address keeps financial information private, while a transparent address makes that information public. Lookup does not start mining. Do not paste a private key.",
      "## What the figures mean",
      "You see unpaid ZEC on the pool books, total ZEC already paid, a rolling 24-hour reward, the current solution rate, and the workers reported under that wallet. The rate is written S/s: Equihash solutions, not H/s and not a count of coins. A pool can credit a transparent address because that address's transfer information is public. A shielded wallet balance is a different number. Do not add it to unpaid.",
      "## What to inspect",
      "Check the prefix and length before you blame the miner. The wrong shape is never sent to the pool. The help page lets you choose ZEC, BTC, or TON as the payout coin. A BTC or TON payout string is not the ZEC account this page wants. The API index lists both PPLNS and SOLO pools for ZEC. This page reads only the account endpoint on zec.2miners.com. It does not merge a second server into the same row.",
      "## What to do next",
      "On the [Zcash monitor](/projects/zec), one saved device holds one transparent address. Free is five saved devices for this project. Pro is fifty saved devices for this project. Workers listed under that wallet do not each take a slot. A worker uses a slot only when you save it as its own device. Binding ZEC again on the same saved device does not add a slot. Removing the saved record does not stop the miner. If the shape is valid and the worker list is empty, open the pool account and look for shares. An empty list is not a hardware verdict.",
      "## An illustrative case",
      "Suppose a t1 of the kind shown on the help page is saved, and the pool reports one worker at 80 S/s with unpaid 0.012 ZEC. Those figures come from the pool account. This site did not measure them, and they are not a shielded wallet balance. Pasting an address that starts with z into the same box is refused before any pool balance is shown. A field the pool did not supply stays unknown. It is not shown as zero.",
      "## Limits",
      "This is not a Zcash block explorer. It does not show a shielded balance, and it does not show a BTC or TON payout. ASIC models named on the help page only mean the pool accepts their submissions. This site has not measured their S/s. The Mac Agent controls IOTA Train at Home on a Mac. It cannot start or stop a ZEC miner. Crash interpretation is free and does not use this project's device slots.",
    ],
    ko: [
      "ZEC 모니터는 zec.2miners.com의 일반 풀 계정 하나를 읽습니다. 주소는 접두 뒤에 33자가 있는 투명 t1 또는 t3이어야 합니다. 2Miners ZEC 도움말은 t1을 지갑 예시로 쓰고 알고리즘을 EquiHash라고 적습니다. z로 시작하는 차폐 주소와 통합 주소는 받지 않습니다. Zcash는 차폐 주소가 재무 정보를 비공개로 두고, 투명 주소는 그 정보를 공개한다고 설명합니다. 조회는 채굴을 시작하지 않습니다. 비밀키는 붙이지 마세요.",
      "## 화면의 숫자가 뜻하는 것",
      "풀 장부의 미지급 ZEC, 누적 지급, 굴러가는 최근 24시간 수익, 현재 해의 속도, 그리고 그 지갑 아래의 Worker가 보입니다. 속도는 S/s입니다. Equihash의 해이지 H/s도, 코인 개수도 아닙니다. 투명 주소는 이체 정보가 공개라서 풀이 주소로 적립할 수 있습니다. 차폐 지갑 잔액은 다른 숫자이므로 미지급과 더하지 마세요.",
      "## 먼저 볼 항목",
      "채굴기를 탓하기 전에 접두와 길이를 봅니다. 형태가 틀리면 이 페이지는 풀에 조회를 보내지 않습니다. 도움말은 수령 코인으로 ZEC, BTC, TON을 고를 수 있게 합니다. BTC나 TON 수령 문자열은 여기의 ZEC 계정이 아닙니다. API 목록은 ZEC에 PPLNS와 SOLO 풀이 있다고 적습니다. 이 페이지는 zec.2miners.com 계정 엔드포인트만 읽고, 다른 서버를 같은 줄에 합치지 않습니다.",
      "## 다음에 할 일",
      "[Zcash 모니터](/projects/zec)에서 저장된 장치 한 대에 투명 주소 하나를 둡니다. 무료는 이 프로젝트당 저장된 장치 5대, Pro는 50대입니다. 그 지갑 아래에 나온 Worker가 자동으로 한 대씩 자리를 쓰지 않습니다. Worker를 별도 장치로 저장할 때만 자리가 줄어듭니다. 같은 저장 장치에 ZEC를 다시 묶어도 자리는 늘지 않습니다. 저장 기록을 지워도 채굴기는 멈추지 않습니다. 형태는 맞는데 Worker 목록이 비면 풀 계정에서 지분을 확인하세요. 빈 목록은 하드웨어 결론이 아닙니다.",
      "## 설명용 사례",
      "도움말에 있는 형태의 t1이 저장되어 있고, 풀이 Worker 하나와 80 S/s, 미지급 0.012 ZEC를 보고한다고 가정합니다. 이 숫자는 풀 계정에서 온 것이며 이 사이트의 실측도, 차폐 지갑 잔액도 아닙니다. 같은 칸에 z로 시작하는 주소를 넣으면 풀 잔액이 나오기 전에 거절됩니다. 풀이 주지 않은 항목은 알 수 없음으로 남고 0으로 표시되지 않습니다.",
      "## 한계",
      "여기는 Zcash 블록 탐색기가 아닙니다. 차폐 잔액도, BTC나 TON 수령도 보여 주지 않습니다. 도움말의 ASIC 기종은 풀이 그 제출을 받는다는 뜻일 뿐, 이 사이트가 S/s를 측정한 것은 아닙니다. Mac Agent는 Mac의 IOTA Train at Home만 제어하며 ZEC 채굴기를 켜거나 끄지 않습니다. 충돌 해석은 무료이고 이 프로젝트의 장치 자리를 쓰지 않습니다.",
    ],
    ja: [
      "ZEC監視は zec.2miners.com の通常プール口座を一つ読みます。アドレスは接頭の後に33文字がある透明な t1 または t3 です。2Miners の ZEC ヘルプは t1 をウォレット例にし、アルゴリズムを EquiHash と書きます。z で始まるシールドアドレスと統合アドレスは受けません。Zcash は、シールドアドレスが財務情報を非公開にし、透明アドレスはその情報を公開すると説明します。照会は採掘を始めません。秘密鍵は貼らないでください。",
      "## 画面の数が意味すること",
      "プール台帳の未払い ZEC、累計支払、転がる直近24時間の収益、現在の解の速度、そしてそのウォレット配下の Worker が見えます。速度は S/s です。Equihash の解であり、H/s でもコインの枚数でもありません。透明アドレスは送金情報が公開なので、プールはアドレスで計上できます。シールドウォレットの残高は別の数です。未払いと足さないでください。",
      "## 先に見る項目",
      "採掘機を疑う前に接頭と長さを見ます。形が違うとき、このページはプールへ照会を送りません。ヘルプは受取通貨を ZEC、BTC、TON から選べます。BTC や TON の受取文字列は、ここで求める ZEC 口座ではありません。API の一覧は ZEC に PPLNS と SOLO の両方があると書きます。このページは zec.2miners.com の口座エンドポイントだけを読み、別サーバーを同じ行に合算しません。",
      "## 次にすること",
      "[Zcash監視](/projects/zec)では、保存した端末一台に透明アドレスを一つ置きます。無料はこのプロジェクトの保存端末5台、Pro は50台です。そのウォレットの下に並ぶ Worker が自動で一台ずつ枠を使うことはありません。Worker を別の端末として保存したときだけ枠を使います。同じ保存端末に ZEC を重ねて結んでも枠は増えません。保存記録を外しても採掘機は止まりません。形は正しいのに Worker 一覧が空なら、プールの口座ページでシェアを確認します。空はハードウェアの結論ではありません。",
      "## 説明用の例",
      "ヘルプにある形の t1 が保存され、プールが Worker 一人、80 S/s、未払い 0.012 ZEC と報告したとします。これらの数はプール口座のもので、当サイトの実測でもシールド残高でもありません。同じ欄に z で始まるアドレスを貼ると、プール残高を出す前に拒否します。プールが渡さなかった項目は不明のままで、0 にはしません。",
      "## 限界",
      "ここは Zcash のブロックエクスプローラではありません。シールド残高も、BTC や TON の受取も出しません。ヘルプが名指しする ASIC は、プールがその提出を受けるという意味だけで、当サイトが S/s を測ったという意味ではありません。Mac Agent が制御するのは Mac 上の IOTA Train at Home だけで、ZEC の採掘機は起動も停止もしません。クラッシュ解釈は無料で、このプロジェクトの端末枠を使いません。",
    ],
  },
  questions: {
    zh: [
      {
        question: "ZEC 该填透明地址还是屏蔽地址？",
        answer:
          "只填 t1 或 t3 开头、后面 33 位的透明地址。帮助页示例是 t1。z 开头和统一地址本页不接收，也不要把屏蔽余额当成矿池未支付。",
      },
      {
        question: "查的是哪一台矿池？",
        answer:
          "只读 zec.2miners.com 的普通矿池账户。API 说明里 ZEC 另有 SOLO 类别，本页不把另一台服务器并进来。这也不是全网余额或其他矿池的透明地址。",
      },
      {
        question: "地址形状对了，为什么没有 Worker？",
        answer:
          "形状正确只表示本页愿意查询。矿机若在别的矿池，或把矿机名当成了地址，名单会空。空名单不是机器故障。先看矿池账户页的份额。",
      },
      {
        question: "S/s 和手里的 ZEC 是一回事吗？",
        answer:
          "不是。S/s 是 Equihash 解的速率，不是 H/s，也不是币的枚数。不要用它估算一天能领多少。",
      },
      {
        question: "未支付、已支付和近 24 小时怎么读？",
        answer:
          "未支付是还没付出的 ZEC，已支付是已经付出的合计，近 24 小时是滚动窗口，不是日历当天。三笔都不要和链上余额或屏蔽余额相加。没有数就是未知，不是 0。",
      },
      {
        question: "多台设备和移除记录会怎样？",
        answer:
          "免费每项目 5 台已保存设备，Pro 50 台。钱包下的 Worker 不会自动占名额；另存成独立设备才会。移除记录不会停止矿机。崩溃解读免费，Mac Agent 只管 TAH 的 Mac。",
      },
    ],
    "zh-TW": [
      {
        question: "ZEC 該填透明地址還是屏蔽地址？",
        answer:
          "只填 t1 或 t3 開頭、後面 33 位的透明地址。幫助頁示例是 t1。z 開頭和統一地址本頁不接收，也不要把屏蔽餘額當成礦池未支付。",
      },
      {
        question: "查的是哪一台礦池？",
        answer:
          "只讀 zec.2miners.com 的普通礦池帳戶。API 說明裡 ZEC 另有 SOLO 類別，本頁不把另一台伺服器併進來。這也不是全網餘額或其他礦池的透明地址。",
      },
      {
        question: "地址形狀對了，為什麼沒有 Worker？",
        answer:
          "形狀正確只表示本頁願意查詢。礦機若在別的礦池，或把礦機名當成了地址，名單會空。空名單不是機器故障。先看礦池帳戶頁的份額。",
      },
      {
        question: "S/s 和手裡的 ZEC 是一回事嗎？",
        answer:
          "不是。S/s 是 Equihash 解的速率，不是 H/s，也不是幣的枚數。不要用它估算一天能領多少。",
      },
      {
        question: "未支付、已支付和近 24 小時怎麼讀？",
        answer:
          "未支付是還沒付出的 ZEC，已支付是已經付出的合計，近 24 小時是滾動窗口，不是日曆當天。三筆都不要和鏈上餘額或屏蔽餘額相加。沒有數就是未知，不是 0。",
      },
      {
        question: "多台裝置和移除紀錄會怎樣？",
        answer:
          "免費每專案 5 台已儲存裝置，Pro 50 台。錢包下的 Worker 不會自動佔名額；另存成獨立裝置才會。移除紀錄不會停止礦機。崩潰解讀免費，Mac Agent 只管 TAH 的 Mac。",
      },
    ],
    en: [
      {
        question: "Should I enter a transparent or a shielded ZEC address?",
        answer:
          "Enter only a transparent t1 or t3 with 33 characters after the prefix. The help example is a t1. Addresses starting with z, and unified addresses, are not accepted. Do not treat a shielded balance as the pool's unpaid amount.",
      },
      {
        question: "Which pool does the lookup use?",
        answer:
          "Only the regular account on zec.2miners.com. The API index also lists a SOLO category for ZEC. This page does not merge another server. It is not a network-wide balance or another pool's transparent address.",
      },
      {
        question: "The address shape is valid, so why are workers missing?",
        answer:
          "A valid shape only means this page will query. If the miner points at another pool, or a rig name was pasted as the address, the list is empty. Empty is not a hardware verdict. Check shares on the pool account page.",
      },
      {
        question: "Is S/s the same as ZEC I hold?",
        answer:
          "No. S/s is the Equihash solution rate, not H/s and not a count of coins. Do not turn it into an estimate of a day's payout.",
      },
      {
        question: "How do unpaid, paid, and the last 24 hours read?",
        answer:
          "Unpaid is ZEC not yet sent. Paid is the total already sent. The last 24 hours is a rolling window, not the calendar day. Do not add any of them to an on-chain or shielded balance. A missing figure is unknown, not zero.",
      },
      {
        question: "What happens with several devices, or if I remove a record?",
        answer:
          "Free is five saved devices per project. Pro is fifty. Workers under the wallet do not automatically use slots; a separate saved device does. Removing the record does not stop the miner. Crash interpretation is free. The Mac Agent controls only a TAH Mac.",
      },
    ],
    ko: [
      {
        question: "ZEC는 투명 주소와 차폐 주소 중 무엇인가요?",
        answer:
          "접두 뒤 33자의 투명 t1 또는 t3만 넣습니다. 도움말 예시는 t1입니다. z로 시작하는 주소와 통합 주소는 받지 않으며, 차폐 잔액을 풀 미지급으로 보지 마세요.",
      },
      {
        question: "어느 풀을 조회하나요?",
        answer:
          "zec.2miners.com 일반 계정만 읽습니다. API 목록에는 ZEC의 SOLO 분류도 있습니다. 이 페이지는 다른 서버를 합치지 않습니다. 네트워크 전체 잔액이나 다른 풀의 투명 주소도 아닙니다.",
      },
      {
        question: "주소 형태는 맞는데 Worker가 없는 이유는?",
        answer:
          "형태가 맞다는 것은 조회한다는 뜻입니다. 채굴기가 다른 풀을 보거나 리그 이름을 주소로 붙이면 목록이 빕니다. 빈 목록은 하드웨어 결론이 아닙니다. 풀 계정의 지분을 보세요.",
      },
      {
        question: "S/s와 가진 ZEC는 같은가요?",
        answer:
          "아닙니다. S/s는 Equihash 해의 속도이지 H/s도 코인 개수도 아닙니다. 하루 수령액으로 바꾸지 마세요.",
      },
      {
        question: "미지급, 지급완료, 최근 24시간은 어떻게 읽나요?",
        answer:
          "미지급은 아직 보내지 않은 ZEC, 지급완료는 이미 보낸 합계, 최근 24시간은 이동 창이며 달력의 하루가 아닙니다. 체인 잔액이나 차폐 잔액과 더하지 마세요. 없는 수는 알 수 없음이지 0이 아닙니다.",
      },
      {
        question: "장치를 여러 대 두거나 기록을 지우면?",
        answer:
          "무료는 프로젝트당 저장 장치 5대, Pro는 50대입니다. 지갑 아래 Worker는 자동으로 자리를 쓰지 않고, 별도 장치로 저장할 때만 씁니다. 기록을 지워도 채굴기는 멈추지 않습니다. 충돌 해석은 무료이고 Mac Agent는 TAH Mac만 제어합니다.",
      },
    ],
    ja: [
      {
        question: "ZECは透明アドレスとシールドのどちらを入れますか？",
        answer:
          "接頭の後に33文字がある透明な t1 または t3 だけです。ヘルプの例は t1 です。z で始まるアドレスと統合アドレスは受けません。シールド残高をプールの未払いとしないでください。",
      },
      {
        question: "どのプールを照会しますか？",
        answer:
          "zec.2miners.com の通常口座だけを読みます。API の一覧には ZEC の SOLO 区分もあります。このページは別サーバーを合算しません。ネットワーク全体の残高でも、他プールの透明アドレスでもありません。",
      },
      {
        question: "アドレスの形は正しいのに Worker が無いのは？",
        answer:
          "形が正しいのは照会するという意味です。採掘先が別プール、またはリグ名をアドレスとして貼ると一覧は空です。空はハードウェアの結論ではありません。プール口座のシェアを見てください。",
      },
      {
        question: "S/s と手元の ZEC は同じですか？",
        answer:
          "違います。S/s は Equihash の解の速度であり、H/s でもコインの枚数でもありません。一日の受取額の見積もりにしないでください。",
      },
      {
        question: "未払い、支払済み、直近24時間はどう読みますか？",
        answer:
          "未払いはまだ送っていない ZEC、支払済みはすでに送った合計、直近24時間は転がる窓で暦日ではありません。チェーン残高やシールド残高と足さないでください。無い数は不明であり、0 ではありません。",
      },
      {
        question: "端末を複数保存したり、記録を外すとどうなりますか？",
        answer:
          "無料はプロジェクトあたり保存端末5台、Pro は50台です。ウォレット配下の Worker は自動では枠を使わず、別端末として保存したときだけ使います。記録を外しても採掘機は止まりません。クラッシュ解釈は無料で、Mac Agent が制御するのは TAH の Mac だけです。",
      },
    ],
  },
};

const addresses: Article = {
  slug: "zec-transparent-addresses",
  published,
  modified,
  project: "zec",
  topic: {
    zh: "透明地址",
    "zh-TW": "透明地址",
    en: "Transparent addresses",
    ko: "투명 주소",
    ja: "透明アドレス",
  },
  title: {
    zh: "ZEC 的 t1 和 t3 怎样才算这一口矿池的账户？",
    "zh-TW": "ZEC 的 t1 和 t3 怎樣才算這一礦池的帳戶？",
    en: "When a ZEC t1 or t3 is this pool's account",
    ko: "ZEC t1·t3이 이 풀의 계정이 되는 조건",
    ja: "ZECのt1とt3がこのプールの口座になる条件",
  },
  description: {
    zh: "t1 与 t3 都能作为本页的透明账户，帮助页示例是 t1。屏蔽地址、统一地址和领款用的 BTC、TON 字符串都不是这份账户。",
    "zh-TW":
      "t1 與 t3 都能作為本頁的透明帳戶，幫助頁示例是 t1。屏蔽地址、統一地址和領款用的 BTC、TON 字串都不是這份帳戶。",
    en: "Both t1 and t3 can be this page's transparent account. The help example is a t1. Shielded addresses, unified addresses, and BTC or TON payout strings are not that account.",
    ko: "t1과 t3 모두 이 페이지의 투명 계정입니다. 도움말 예시는 t1입니다. 차폐 주소, 통합 주소, BTC·TON 수령 문자열은 그 계정이 아닙니다.",
    ja: "t1 も t3 もこのページの透明口座になれます。ヘルプの例は t1 です。シールド、統合アドレス、BTC や TON の受取文字列はその口座ではありません。",
  },
  summary: {
    zh: "本页认的是长度固定的 t1 或 t3。Zcash 用公开与私密区分透明和屏蔽；帮助页只示范了 t1，并允许领款改走 BTC 或 TON。",
    "zh-TW":
      "本頁認的是長度固定的 t1 或 t3。Zcash 用公開與私密區分透明和屏蔽；幫助頁只示範了 t1，並允許領款改走 BTC 或 TON。",
    en: "This page accepts a fixed-length t1 or t3. Zcash separates transparent and shielded by public versus private information. The help page demonstrates a t1 and also allows BTC or TON payouts.",
    ko: "이 페이지는 길이가 고정된 t1 또는 t3을 받습니다. Zcash는 공개와 비공개로 투명과 차폐를 나눕니다. 도움말은 t1만 보여주고 BTC·TON 수령도 허용합니다.",
    ja: "このページが受けるのは長さの決まった t1 または t3 です。Zcash は公開か非公開かで透明とシールドを分けます。ヘルプが示す例は t1 で、BTC や TON での受取も選べます。",
  },
  sources: [
    { name: "2Miners · ZEC help", url: "https://zec.2miners.com/help" },
    {
      name: "Zcash · shielded and transparent",
      url: "https://z.cash/learn/what-is-the-difference-between-shielded-and-transparent-zcash/",
    },
  ],
  related: ["zec-mining-monitor-guide", "zec-pool-rewards-and-payments"],
  comparisonTitle: {
    zh: "几种 ZEC 字符串",
    "zh-TW": "幾種 ZEC 字串",
    en: "ZEC strings compared",
    ko: "ZEC 문자열 비교",
    ja: "ZECの文字列の比較",
  },
  comparison: {
    zh: {
      headers: ["字符串", "和这份矿池账户的关系"],
      rows: [
        ["t1 + 33 位", "帮助页的示例形态。本页会查询"],
        ["t3 + 33 位", "本页同样接受。帮助页摘录里没有 t3 示例"],
        ["z 开头或统一地址", "屏蔽或统一形态。本页不查询"],
        ["BTC 或 TON 领款地址", "帮助页的另一种领款选择，不是本页的 ZEC 账户"],
      ],
    },
    "zh-TW": {
      headers: ["字串", "和這份礦池帳戶的關係"],
      rows: [
        ["t1 + 33 位", "幫助頁的示例形態。本頁會查詢"],
        ["t3 + 33 位", "本頁同樣接受。幫助頁摘錄裡沒有 t3 示例"],
        ["z 開頭或統一地址", "屏蔽或統一形態。本頁不查詢"],
        ["BTC 或 TON 領款地址", "幫助頁的另一種領款選擇，不是本頁的 ZEC 帳戶"],
      ],
    },
    en: {
      headers: ["String", "Relation to this pool account"],
      rows: [
        ["t1 + 33 characters", "The shape in the help example. This page queries it"],
        ["t3 + 33 characters", "Also accepted here. The help extract has no t3 example"],
        ["Starts with z, or unified", "Shielded or unified. Not queried"],
        [
          "BTC or TON payout address",
          "Another payout choice on the help page, not this ZEC account",
        ],
      ],
    },
    ko: {
      headers: ["문자열", "이 풀 계정과의 관계"],
      rows: [
        ["t1 + 33자", "도움말 예시의 형태. 이 페이지가 조회"],
        ["t3 + 33자", "여기서도 받음. 도움말 발췌에는 t3 예시가 없음"],
        ["z로 시작하거나 통합", "차폐 또는 통합. 조회하지 않음"],
        ["BTC 또는 TON 수령 주소", "도움말의 다른 수령 선택. 이 ZEC 계정이 아님"],
      ],
    },
    ja: {
      headers: ["文字列", "このプール口座との関係"],
      rows: [
        ["t1 + 33文字", "ヘルプ例の形。このページが照会する"],
        ["t3 + 33文字", "ここでも受ける。ヘルプ抜粋に t3 の例はない"],
        ["z で始まる、または統合", "シールドまたは統合。照会しない"],
        ["BTC または TON の受取先", "ヘルプ上の別の受取選択。この ZEC 口座ではない"],
      ],
    },
  },
  body: {
    zh: [
      "这一口矿池账户对应的是一个透明 ZEC 地址，不是任意一串看起来像钱包的文字。本页接受 t1 或 t3，前缀后面恰好 33 位，且不含易混淆字符。2Miners 帮助页的钱包示例是 t1，开头写作 t1fu…。同一页摘录没有给出 t3 示例，所以 t3 能用，是本页的接受范围，不是那篇帮助对 t3 的示范。",
      "## 各字段在说什么",
      "透明和屏蔽是 Zcash 对财务信息的两种处理：透明地址把信息公开放到链上，屏蔽地址把财务信息保持私密。矿池能按透明地址入账，是因为这份信息是公开的。统一地址把多种接收方式收在一个字符串里，本页不把它当成 t1 或 t3。帮助页还允许把领款改成 BTC 或 TON。那两个字符串属于另一种领款设置，填进 ZEC 监控不会打开 ZEC 账户。",
      "## 该核对什么",
      "核对三件事：前缀是 t1 还是 t3、后面是不是 33 位、有没有空格或换行。矿机配置里的 Worker 栏，帮助页对列出的 ASIC 写的是填你的钱包地址，那个钱包仍应是透明 t 地址，而不是把矿机昵称填进本页的地址框。若你在交易所或桌面钱包里复制的是屏蔽接收串，它不会通过本页。",
      "## 下一步",
      "确认字符串后，到 [Zcash 监控](/projects/zec) 保存这一台设备。同一项目免费 5 台已保存设备，Pro 50 台。一个透明地址下的多个 Worker 仍共用这一份矿池余额，发现它们不会自动多占设备名额。只有另存独立设备才会占名额。私钥始终不要粘贴。",
      "## 说明性例子",
      "帮助页示例的形态是 t1 加 33 位，本页会查询。把同一字符串改成 z 开头，或改成交易所给出的统一地址，本页不查询，页面上也不会出现一份“0 ZEC”的矿池账。t3 加 33 位会进入查询；若矿池上没有这个地址的账户，结果是查无这份账，而不是地址形状被拒绝。这些例子只说明接受范围。",
      "## 界限",
      "本页不解释屏蔽交易的查看密钥，也不把透明地址的链上全部历史和矿池未支付画成同一张表。Zcash 那篇文章没有列出 t1/t3 的字符表，字符表以本页实际接受的形状为准。帮助页提到的手续费数字属于矿池当时的领款说明，本指南不转抄、也不保证仍然有效。",
    ],
    "zh-TW": [
      "這一礦池帳戶對應的是一個透明 ZEC 地址，不是任意一串看起來像錢包的文字。本頁接受 t1 或 t3，前綴後面恰好 33 位，且不含易混淆字元。2Miners 幫助頁的錢包示例是 t1，開頭寫作 t1fu…。同一頁摘錄沒有給出 t3 示例，所以 t3 能用，是本頁的接受範圍，不是那篇幫助對 t3 的示範。",
      "## 各欄位在說什麼",
      "透明和屏蔽是 Zcash 對財務資訊的兩種處理：透明地址把資訊公開放到鏈上，屏蔽地址把財務資訊保持私密。礦池能按透明地址入帳，是因為這份資訊是公開的。統一地址把多種接收方式收在一個字串裡，本頁不把它當成 t1 或 t3。幫助頁還允許把領款改成 BTC 或 TON。那兩個字串屬於另一種領款設定，填進 ZEC 監控不會打開 ZEC 帳戶。",
      "## 該核對什麼",
      "核對三件事：前綴是 t1 還是 t3、後面是不是 33 位、有沒有空格或換行。礦機設定裡的 Worker 欄，幫助頁對列出的 ASIC 寫的是填你的錢包地址，那個錢包仍應是透明 t 地址，而不是把礦機暱稱填進本頁的地址框。若你在交易所或桌面錢包裡複製的是屏蔽接收串，它不會通過本頁。",
      "## 下一步",
      "確認字串後，到 [Zcash 監控](/projects/zec) 儲存這一台裝置。同一專案免費 5 台已儲存裝置，Pro 50 台。一個透明地址下的多個 Worker 仍共用這一份礦池餘額，發現它們不會自動多佔裝置名額。只有另存獨立裝置才會佔名額。私鑰始終不要貼上。",
      "## 說明性例子",
      "幫助頁示例的形態是 t1 加 33 位，本頁會查詢。把同一字串改成 z 開頭，或改成交易所給出的統一地址，本頁不查詢，頁面上也不會出現一份「0 ZEC」的礦池帳。t3 加 33 位會進入查詢；若礦池上沒有這個地址的帳戶，結果是查無這份帳，而不是地址形狀被拒絕。這些例子只說明接受範圍。",
      "## 界限",
      "本頁不解釋屏蔽交易的檢視金鑰，也不把透明地址的鏈上全部歷史和礦池未支付畫成同一張表。Zcash 那篇文章沒有列出 t1/t3 的字元表，字元表以本頁實際接受的形狀為準。幫助頁提到的手續費數字屬於礦池當時的領款說明，本指南不轉抄、也不保證仍然有效。",
    ],
    en: [
      "This pool account is one transparent ZEC address, not any string that looks like a wallet. The page accepts t1 or t3 with exactly 33 characters after the prefix, without easily confused characters. The 2Miners help example is a t1, written from t1fu…. That extract does not show a t3. A t3 works because this page accepts it, not because the help page demonstrates one.",
      "## What the fields mean",
      "Transparent and shielded are Zcash's two treatments of financial information. A transparent address makes the information public. A shielded address keeps it private. A pool can credit a transparent address because that information is public. A unified address packs more than one way to receive into one string. This page does not treat it as a t1 or t3. The help page also lets payouts go out as BTC or TON. Those strings are a different payout setup. Putting them in the ZEC monitor does not open a ZEC account.",
      "## What to inspect",
      "Check three things: the prefix is t1 or t3, 33 characters follow, and there is no space or line break. On the ASICs listed in the help, the Worker field is your wallet address. That wallet should still be a transparent t-address. Do not put a rig nickname in this page's address box. A shielded receive string copied from an exchange or a desktop wallet will not pass.",
      "## Next step",
      "After the string checks out, save that device on the [Zcash monitor](/projects/zec). Free is five saved devices for this project. Pro is fifty. Several workers under one transparent address still share one pool balance. Seeing them does not automatically use extra device slots. A slot is used only when you save a separate device. Never paste a private key.",
      "## An illustrative case",
      "A t1 plus 33 characters, the shape of the help example, is queried. Changing that string to start with z, or using a unified address from an exchange, is not queried, and the page does not invent a pool balance of 0 ZEC. A t3 plus 33 characters is queried. If the pool has no account for it, the result is that this account is absent, not that the shape was refused. The case only shows the acceptance range.",
      "## Limits",
      "This page does not explain viewing keys for shielded transactions, and it does not draw the transparent address's full chain history on the same table as pool unpaid. The Zcash article does not publish a t1/t3 character table. The table that matters is the shape this page actually accepts. Fee figures on the help page belong to the pool's payout note at the time of that page. This guide does not copy them and does not promise they still apply.",
    ],
    ko: [
      "이 풀 계정은 투명 ZEC 주소 하나이지, 지갑처럼 보이는 아무 문자열이 아닙니다. 이 페이지는 접두 뒤에 정확히 33자가 있고 혼동하기 쉬운 문자가 없는 t1 또는 t3을 받습니다. 2Miners 도움말 예시는 t1이며 t1fu…처럼 시작합니다. 그 발췌에는 t3 예시가 없습니다. t3이 되는 이유는 이 페이지가 받기 때문이지, 도움말이 t3을 보여 주어서가 아닙니다.",
      "## 항목이 말하는 것",
      "투명과 차폐는 Zcash가 재무 정보를 다루는 두 방식입니다. 투명 주소는 정보를 공개하고, 차폐 주소는 비공개로 둡니다. 풀이 투명 주소로 적립할 수 있는 것은 그 정보가 공개이기 때문입니다. 통합 주소는 여러 수신 방식을 한 문자열에 넣습니다. 이 페이지는 그것을 t1이나 t3으로 보지 않습니다. 도움말은 수령을 BTC나 TON으로 바꿀 수도 있습니다. 그 문자열은 다른 수령 설정이며, ZEC 모니터에 넣어도 ZEC 계정이 열리지 않습니다.",
      "## 확인할 것",
      "세 가지를 봅니다. 접두가 t1 또는 t3인지, 뒤가 33자인지, 공백이나 줄바꿈이 없는지입니다. 도움말에 나온 ASIC의 Worker 칸은 지갑 주소를 넣으라고 합니다. 그 지갑은 여전히 투명 t 주소여야 합니다. 리그 별명을 이 페이지의 주소 칸에 넣지 마세요. 거래소나 데스크톱 지갑에서 복사한 차폐 수신 문자열은 통과하지 않습니다.",
      "## 다음 단계",
      "문자열이 맞으면 [Zcash 모니터](/projects/zec)에 그 장치를 저장합니다. 무료는 이 프로젝트의 저장 장치 5대, Pro는 50대입니다. 투명 주소 하나의 Worker 여러 명은 풀 잔액 하나를 같이 씁니다. 그들을 보는 것만으로 장치 자리가 늘지 않습니다. 별도 장치로 저장할 때만 자리가 씁니다. 비밀키는 붙이지 마세요.",
      "## 설명용 사례",
      "도움말 예시처럼 t1 더하기 33자는 조회됩니다. 그 문자열을 z로 시작하게 바꾸거나 거래소의 통합 주소를 쓰면 조회하지 않으며, 풀 잔액 0 ZEC를 만들어 보여 주지도 않습니다. t3 더하기 33자는 조회됩니다. 풀에 그 주소의 계정이 없으면 결과는 이 계정이 없다는 것이지, 형태가 거절된 것이 아닙니다. 이 사례는 받는 범위만 보여 줍니다.",
      "## 한계",
      "이 페이지는 차폐 거래의 보기 키를 설명하지 않고, 투명 주소의 체인 이력 전체와 풀 미지급을 한 표로 그리지 않습니다. Zcash 글은 t1/t3 문자표를 싣지 않습니다. 기준은 이 페이지가 실제로 받는 형태입니다. 도움말의 수수료 숫자는 그때의 수령 안내이며, 이 글은 베끼지 않고 여전히 유효하다고 약속하지도 않습니다.",
    ],
    ja: [
      "このプール口座は透明な ZEC アドレス一つであり、財布に見える任意の文字列ではありません。このページが受けるのは、接頭の後にちょうど33文字があり、紛らわしい文字を含まない t1 または t3 です。2Miners のヘルプ例は t1 で、t1fu… から始まります。その抜粋に t3 の例はありません。t3 が使えるのはこのページが受けるからであり、ヘルプが t3 を示しているからではありません。",
      "## 項目が意味すること",
      "透明とシールドは、Zcash が財務情報を扱う二つのやり方です。透明アドレスは情報を公開し、シールドアドレスは非公開にします。プールが透明アドレスで計上できるのは、その情報が公開だからです。統合アドレスは複数の受け取り方を一つの文字列にまとめます。このページはそれを t1 や t3 として扱いません。ヘルプは受取を BTC や TON に変えることもできます。それらの文字列は別の受取設定で、ZEC監視に入れても ZEC 口座は開きません。",
      "## 確かめること",
      "三つを見ます。接頭が t1 か t3 か、続くのが33文字か、空白や改行が無いかです。ヘルプに挙がる ASIC の Worker 欄は、ウォレットアドレスを入れると書かれています。そのウォレットはやはり透明な t アドレスであるべきです。リグの通称をこのページのアドレス欄に入れないでください。取引所やデスクトップウォレットからコピーしたシールド受取文字列は通りません。",
      "## 次の手順",
      "文字列が合ったら、[Zcash監視](/projects/zec)にその端末を保存します。無料はこのプロジェクトの保存端末5台、Pro は50台です。一つの透明アドレスの下の複数 Worker は、プール残高を一つ共有します。それらが見えるだけでは端末枠は増えません。別の端末として保存したときだけ枠を使います。秘密鍵は貼らないでください。",
      "## 説明用の例",
      "ヘルプ例の形である t1 に33文字を足したものは照会されます。その文字列を z で始まるように変える、または取引所の統合アドレスを使うと照会せず、プール残高 0 ZEC を作って表示することもありません。t3 に33文字を足したものは照会されます。プールにそのアドレスの口座が無ければ、結果はこの口座が無いということであり、形が拒否されたのではありません。この例は受け付ける範囲を示すだけです。",
      "## 限界",
      "このページはシールド取引の閲覧鍵を説明せず、透明アドレスのチェーン履歴全体とプール未払いを一つの表にもしません。Zcash の記事は t1/t3 の文字表を載せていません。基準は、このページが実際に受ける形です。ヘルプの手数料の数字は当時の受取説明であり、この記事は写さず、今も有効だとも約束しません。",
    ],
  },
  questions: {
    zh: [
      {
        question: "t3 为什么帮助页没写也能用？",
        answer:
          "帮助页摘录只示范 t1。本页同时接受同样长度的 t3。这是本页的接受范围，不是那篇文章对 t3 的说明。",
      },
      {
        question: "统一地址算透明账户吗？",
        answer: "不算。统一地址不是 t1 或 t3 这种固定形状。屏蔽接收串同样不查询。",
      },
      {
        question: "BTC 领款地址能打开 ZEC 监控吗？",
        answer: "不能。帮助页把 BTC 和 TON 列为另一种领款选择。本页只查询透明 ZEC 账户。",
      },
    ],
    "zh-TW": [
      {
        question: "t3 為什麼幫助頁沒寫也能用？",
        answer:
          "幫助頁摘錄只示範 t1。本頁同時接受同樣長度的 t3。這是本頁的接受範圍，不是那篇文章對 t3 的說明。",
      },
      {
        question: "統一地址算透明帳戶嗎？",
        answer: "不算。統一地址不是 t1 或 t3 這種固定形狀。屏蔽接收串同樣不查詢。",
      },
      {
        question: "BTC 領款地址能打開 ZEC 監控嗎？",
        answer: "不能。幫助頁把 BTC 和 TON 列為另一種領款選擇。本頁只查詢透明 ZEC 帳戶。",
      },
    ],
    en: [
      {
        question: "Why does a t3 work if the help page does not show one?",
        answer:
          "The help extract demonstrates a t1 only. This page also accepts a t3 of the same length. That is this page's acceptance range, not a statement in that article about t3.",
      },
      {
        question: "Is a unified address a transparent account here?",
        answer:
          "No. A unified address is not the fixed t1 or t3 shape. A shielded receive string is not queried either.",
      },
      {
        question: "Can a BTC payout address open the ZEC monitor?",
        answer:
          "No. The help page lists BTC and TON as another payout choice. This page queries only a transparent ZEC account.",
      },
    ],
    ko: [
      {
        question: "도움말에 t3이 없는데 왜 되나요?",
        answer:
          "도움말 발췌는 t1만 보여 줍니다. 이 페이지는 같은 길이의 t3도 받습니다. 그것은 이 페이지의 수용 범위이지, 그 글이 t3을 설명한 것은 아닙니다.",
      },
      {
        question: "통합 주소는 여기의 투명 계정인가요?",
        answer:
          "아닙니다. 통합 주소는 고정된 t1·t3 형태가 아닙니다. 차폐 수신 문자열도 조회하지 않습니다.",
      },
      {
        question: "BTC 수령 주소로 ZEC 모니터를 열 수 있나요?",
        answer:
          "없습니다. 도움말은 BTC와 TON을 다른 수령 선택으로 둡니다. 이 페이지는 투명 ZEC 계정만 조회합니다.",
      },
    ],
    ja: [
      {
        question: "ヘルプに t3 が無いのに使えるのはなぜですか？",
        answer:
          "ヘルプの抜粋が示しているのは t1 だけです。このページは同じ長さの t3 も受けます。それはこのページの受付範囲であり、あの記事が t3 を説明しているのではありません。",
      },
      {
        question: "統合アドレスはここの透明口座ですか？",
        answer:
          "違います。統合アドレスは決まった t1 や t3 の形ではありません。シールドの受取文字列も照会しません。",
      },
      {
        question: "BTC の受取先で ZEC 監視を開けますか？",
        answer:
          "開けません。ヘルプは BTC と TON を別の受取選択としています。このページが照会するのは透明な ZEC 口座だけです。",
      },
    ],
  },
};

const solutions: Article = {
  slug: "zec-solutions-vs-hashes",
  published,
  modified,
  project: "zec",
  topic: {
    zh: "解与哈希",
    "zh-TW": "解與雜湊",
    en: "Solutions and hashes",
    ko: "해와 해시",
    ja: "解とハッシュ",
  },
  title: {
    zh: "ZEC 的 S/s 为什么不是 H/s，也不是币的枚数？",
    "zh-TW": "ZEC 的 S/s 為什麼不是 H/s，也不是幣的枚數？",
    en: "Why ZEC S/s is not H/s and not a coin count",
    ko: "ZEC의 S/s가 H/s도 코인 개수도 아닌 이유",
    ja: "ZECのS/sがH/sでもコイン枚数でもない理由",
  },
  description: {
    zh: "Equihash 在本页以 S/s 显示解的速率。矿池接口仍把该数字放在算力字段里。份额难度不影响帮助页所说的矿工收益。",
    "zh-TW":
      "Equihash 在本頁以 S/s 顯示解的速率。礦池介面仍把該數字放在算力欄位裡。份額難度不影響幫助頁所說的礦工收益。",
    en: "This page shows the Equihash solution rate as S/s. The pool API still places that number in a hashrate field. Share difficulty does not change miner rewards, according to the help page.",
    ko: "이 페이지는 Equihash 해의 속도를 S/s로 보여 줍니다. 풀 API는 그 숫자를 여전히 해시레이트 항목에 둡니다. 도움말에 따르면 지분 난이도는 채굴 보상을 바꾸지 않습니다.",
    ja: "このページは Equihash の解の速度を S/s で示します。プールの API はその数をなおハッシュレートの項目に置きます。ヘルプによれば、シェア難度は採掘報酬を変えません。",
  },
  summary: {
    zh: "看到 S/s，读的是解每秒，不是 H/s，也不是 ZEC 枚数。账户速率和某一名 Worker 的速率可以不同。份额难度高低不改变帮助页所说的收益。",
    "zh-TW":
      "看到 S/s，讀的是解每秒，不是 H/s，也不是 ZEC 枚數。帳戶速率和某一名 Worker 的速率可以不同。份額難度高低不改變幫助頁所說的收益。",
    en: "S/s means solutions per second, not H/s and not ZEC coins. The account rate and one worker's rate can differ. A higher or lower share difficulty does not change rewards, as the help page states.",
    ko: "S/s는 초당 해이며 H/s도 ZEC 개수도 아닙니다. 계정 속도와 Worker 하나의 속도는 다를 수 있습니다. 도움말은 지분 난이도의 높낮이가 보상을 바꾸지 않는다고 합니다.",
    ja: "S/s は秒あたりの解であり、H/s でも ZEC の枚数でもありません。口座の速度と一人の Worker の速度は違い得ます。ヘルプは、シェア難度の高低は報酬を変えないと述べます。",
  },
  sources: [
    { name: "2Miners · ZEC help", url: "https://zec.2miners.com/help" },
    { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
  ],
  related: ["zec-mining-monitor-guide", "zec-worker-not-found"],
  comparisonTitle: {
    zh: "速率该怎么读",
    "zh-TW": "速率該怎麼讀",
    en: "How to read the rate",
    ko: "속도를 읽는 법",
    ja: "速度の読み方",
  },
  comparison: {
    zh: {
      headers: ["你看到的", "含义"],
      rows: [
        ["S/s，或带 K、M 等前缀", "本页对 ZEC 使用的解数单位，不是 H/s"],
        ["账户当前速率", "这份钱包在矿池上的当前解数速率"],
        ["某一 Worker 的速率", "该名称自己的速率，可以和账户不同"],
        ["份额难度 256 或更高", "帮助页称难度不影响矿工收益；本页不改写该难度"],
      ],
    },
    "zh-TW": {
      headers: ["你看到的", "含義"],
      rows: [
        ["S/s，或帶 K、M 等前綴", "本頁對 ZEC 使用的解數單位，不是 H/s"],
        ["帳戶當前速率", "這份錢包在礦池上的當前解數速率"],
        ["某一 Worker 的速率", "該名稱自己的速率，可以和帳戶不同"],
        ["份額難度 256 或更高", "幫助頁稱難度不影響礦工收益；本頁不改寫該難度"],
      ],
    },
    en: {
      headers: ["What you see", "Meaning"],
      rows: [
        ["S/s, or a K or M prefix", "The solution unit this page uses for ZEC, not H/s"],
        ["Account current rate", "That wallet's current solution rate on the pool"],
        ["One worker's rate", "That name's own rate. It can differ from the account"],
        [
          "Share difficulty 256 or higher",
          "The help page says difficulty does not change miner rewards. This page does not rewrite it",
        ],
      ],
    },
    ko: {
      headers: ["보이는 것", "의미"],
      rows: [
        ["S/s, 또는 K·M 접두", "이 페이지가 ZEC에 쓰는 해의 단위. H/s가 아님"],
        ["계정의 현재 속도", "그 지갑의 풀상 현재 해 속도"],
        ["Worker 하나의 속도", "그 이름 자신의 속도. 계정과 다를 수 있음"],
        [
          "지분 난이도 256 또는 그 이상",
          "도움말은 난이도가 보상을 바꾸지 않는다고 함. 이 페이지는 난이도를 고치지 않음",
        ],
      ],
    },
    ja: {
      headers: ["見えているもの", "意味"],
      rows: [
        ["S/s、または K や M の接頭", "このページが ZEC に使う解の単位。H/s ではない"],
        ["口座の現在速度", "そのウォレットのプール上の現在の解の速度"],
        ["一人の Worker の速度", "その名前自身の速度。口座と違い得る"],
        [
          "シェア難度 256 以上",
          "ヘルプは難度が報酬を変えないと述べる。このページは難度を書き換えない",
        ],
      ],
    },
  },
  body: {
    zh: [
      "ZEC 用的是 Equihash。本页把矿池给出的当前速率显示成 S/s，也就是解每秒。同一套数字在矿池账户接口里仍放在名为算力的字段中。读本页时以 S/s 为准，不要把它换成 H/s，也不要把它当成已经入账的 ZEC 枚数。",
      "## 账户速率和 Worker 速率",
      "账户上的当前速率是这份透明钱包的合计视角。每一名 Worker 另有自己的速率、是否离线，以及最后一次上报时间。选中一名 Worker，改变的是你正在看的那一行，不会把其他人的解算进你的私有余额，也不会把钱包未支付按人数拆开。多名 Worker 共用这一份未支付。",
      "## 份额难度在说什么",
      "帮助页列出不同的份额难度，并写明份额难度不影响矿工收益。拿不准时它建议用较低的一档；显卡数量很多或走 NiceHash 时，它建议用较高的一档。这是矿池自己的提交设置，不是本页测出来的机器算力，本页也不能替你改矿机的难度。API 还提供 5 分钟、30 分钟、6 小时的份额统计接口。本页不画这些短窗口曲线，只显示账户当前速率和各 Worker 的速率与最后上报。",
      "## 接下来怎么看",
      "打开 [Zcash 监控](/projects/zec)，先看账户 S/s 是否还在，再看目标 Worker 的 S/s 和最后上报是否一起停住。若账户仍有速率而某一名 Worker 为离线，问题在那一名，不在整份钱包。不要用 S/s 乘一个电价或币价去承诺一天的收入。",
      "## 说明性例子",
      "假设账户当前为 200 S/s，两名 Worker 各为 120 S/s 和 80 S/s。这组数字只说明两名 Worker 的解可以相加着读，不说明本站测量过任何矿机，也不说明下一笔支付是 200 乘某个单价。若矿池没有给出某一名的速率，那一格是未知，不是 0 S/s。帮助页写的“难度不影响收益”是矿池的陈述，不是本站对收益的保证。",
      "## 界限",
      "本页不比较各区域服务器谁更快，也不复述帮助页上的端口表。ASIC 型号只说明矿池接受那些机型，不是实测 S/s。崩溃解读不根据 S/s 判断硬件。Mac Agent 不控制 ZEC 矿机。",
    ],
    "zh-TW": [
      "ZEC 用的是 Equihash。本頁把礦池給出的當前速率顯示成 S/s，也就是解每秒。同一套數字在礦池帳戶介面裡仍放在名為算力的欄位中。讀本頁時以 S/s 為準，不要把它換成 H/s，也不要把它當成已經入帳的 ZEC 枚數。",
      "## 帳戶速率和 Worker 速率",
      "帳戶上的當前速率是這份透明錢包的合計視角。每一名 Worker 另有自己的速率、是否離線，以及最後一次上報時間。選中一名 Worker，改變的是你正在看的那一行，不會把其他人的解算進你的私有餘額，也不會把錢包未支付按人數拆開。多名 Worker 共用這一份未支付。",
      "## 份額難度在說什麼",
      "幫助頁列出不同的份額難度，並寫明份額難度不影響礦工收益。拿不準時它建議用較低的一檔；顯卡數量很多或走 NiceHash 時，它建議用較高的一檔。這是礦池自己的提交設定，不是本頁測出來的機器算力，本頁也不能替你改礦機的難度。API 還提供 5 分鐘、30 分鐘、6 小時的份額統計介面。本頁不畫這些短窗口曲線，只顯示帳戶當前速率和各 Worker 的速率與最後上報。",
      "## 接下來怎麼看",
      "打開 [Zcash 監控](/projects/zec)，先看帳戶 S/s 是否還在，再看目標 Worker 的 S/s 和最後上報是否一起停住。若帳戶仍有速率而某一名 Worker 為離線，問題在那一名，不在整份錢包。不要用 S/s 乘一個電價或幣價去承諾一天的收入。",
      "## 說明性例子",
      "假設帳戶當前為 200 S/s，兩名 Worker 各為 120 S/s 和 80 S/s。這組數字只說明兩名 Worker 的解可以相加著讀，不說明本站測量過任何礦機，也不說明下一筆支付是 200 乘某個單價。若礦池沒有給出某一名的速率，那一格是未知，不是 0 S/s。幫助頁寫的「難度不影響收益」是礦池的陳述，不是本站對收益的保證。",
      "## 界限",
      "本頁不比較各區域伺服器誰更快，也不複述幫助頁上的連接埠表。ASIC 型號只說明礦池接受那些機型，不是實測 S/s。崩潰解讀不根據 S/s 判斷硬體。Mac Agent 不控制 ZEC 礦機。",
    ],
    en: [
      "ZEC uses Equihash. This page shows the pool's current rate as S/s, solutions per second. The same number still sits in a field the pool account API calls hashrate. On this page, read S/s. Do not rewrite it as H/s, and do not treat it as ZEC already credited.",
      "## Account rate and worker rate",
      "The account's current rate is the combined view for that transparent wallet. Each worker has its own rate, an offline flag, and a last-reported time. Selecting one worker changes the row you are looking at. It does not move anyone else's solutions into a private balance, and it does not split the wallet's unpaid amount by headcount. Several workers share that one unpaid figure.",
      "## What share difficulty says",
      "The help page lists more than one share difficulty and states that share difficulty does not affect miner rewards. If you are unsure, it recommends the lower setting. It recommends the higher setting for a very large GPU count or for NiceHash. That is the pool's own submission setting, not a machine hashrate this page measured, and this page cannot change the miner's difficulty. The API also offers share stats for 5 minutes, 30 minutes, and 6 hours. This page does not chart those short windows. It shows the account's current rate and each worker's rate and last report.",
      "## What to do next",
      "Open the [Zcash monitor](/projects/zec). See whether the account S/s is still present, then whether the worker you care about has stopped on both S/s and last report. If the account still has a rate and one worker is offline, the gap is that worker, not the whole wallet. Do not multiply S/s by a power price or a coin price and call it a day's income.",
      "## An illustrative case",
      "Suppose the account is 200 S/s and two workers are 120 S/s and 80 S/s. Those numbers only show that the two workers' solutions can be read as adding up. They do not mean this site measured any miner, and they do not mean the next payment is 200 times a unit price. If the pool omitted one worker's rate, that cell is unknown, not 0 S/s. The help page's statement that difficulty does not change rewards is the pool's statement, not a promise from this site.",
      "## Limits",
      "This page does not rank regional servers, and it does not repeat the help page's port table. ASIC model names only mean the pool accepts those machines, not a measured S/s. Crash interpretation does not judge hardware from S/s. The Mac Agent does not control a ZEC miner.",
    ],
    ko: [
      "ZEC는 Equihash를 씁니다. 이 페이지는 풀이 준 현재 속도를 S/s, 즉 초당 해로 보여 줍니다. 같은 숫자는 풀 계정 API에서 여전히 해시레이트라는 항목에 있습니다. 이 페이지에서는 S/s로 읽으세요. H/s로 바꾸지 말고, 이미 적립된 ZEC 개수로 보지 마세요.",
      "## 계정 속도와 Worker 속도",
      "계정의 현재 속도는 그 투명 지갑의 합쳐 본 값입니다. Worker마다 자신의 속도, 오프라인 여부, 마지막 보고 시각이 있습니다. Worker 하나를 고르면 보고 있는 줄이 바뀝니다. 다른 사람의 해가 개인 잔액으로 옮겨지거나, 지갑 미지급이 인원수로 나뉘지 않습니다. 여러 Worker는 미지급 하나를 같이 씁니다.",
      "## 지분 난이도가 말하는 것",
      "도움말은 지분 난이도를 둘 이상 적고, 지분 난이도는 채굴 보상에 영향을 주지 않는다고 씁니다. 모를 때는 낮은 쪽을, GPU가 매우 많거나 NiceHash를 쓸 때는 높은 쪽을 권합니다. 그것은 풀 자신의 제출 설정이지, 이 페이지가 측정한 기기 해시레이트가 아니며, 이 페이지가 채굴기 난이도를 바꾸지도 못합니다. API에는 5분, 30분, 6시간의 지분 통계도 있습니다. 이 페이지는 그 짧은 창의 곡선을 그리지 않고, 계정의 현재 속도와 각 Worker의 속도·마지막 보고만 보여 줍니다.",
      "## 다음에 볼 것",
      "[Zcash 모니터](/projects/zec)를 엽니다. 계정 S/s가 아직 있는지 본 다음, 관심 있는 Worker의 S/s와 마지막 보고가 같이 멈췄는지 봅니다. 계정에는 속도가 있고 Worker 하나만 오프라인이면 그 Worker의 문제이지 지갑 전체가 아닙니다. S/s에 전기요금이나 코인 가격을 곱해 하루 수입이라고 하지 마세요.",
      "## 설명용 사례",
      "계정이 200 S/s이고 Worker 둘이 120 S/s와 80 S/s라고 가정합니다. 이 숫자는 두 Worker의 해를 더해 읽을 수 있다는 뜻일 뿐입니다. 이 사이트가 채굴기를 측정했다는 뜻도, 다음 지급이 200 곱하기 단가라는 뜻도 아닙니다. 풀이 한 Worker의 속도를 빼먹었다면 그 칸은 알 수 없음이지 0 S/s가 아닙니다. 난이도가 보상을 바꾸지 않는다는 도움말 문장은 풀의 진술이지 이 사이트의 약속이 아닙니다.",
      "## 한계",
      "이 페이지는 지역 서버의 순위를 매기지 않고, 도움말의 포트 표를 반복하지도 않습니다. ASIC 기종 이름은 풀이 그 기기를 받는다는 뜻이지 측정된 S/s가 아닙니다. 충돌 해석은 S/s로 하드웨어를 판단하지 않습니다. Mac Agent는 ZEC 채굴기를 제어하지 않습니다.",
    ],
    ja: [
      "ZEC は Equihash を使います。このページはプールが渡した現在速度を S/s、つまり秒あたりの解として示します。同じ数は、プール口座の API では今もハッシュレートという項目に入っています。このページでは S/s として読んでください。H/s に書き換えず、すでに計上された ZEC の枚数にもしないでください。",
      "## 口座の速度と Worker の速度",
      "口座の現在速度は、その透明ウォレットを合わせた見方です。Worker それぞれに自分の速度、オフラインかどうか、最後の報告時刻があります。一人を選ぶと、見ている行が変わります。他の人の解が個人の残高に移ることも、ウォレットの未払いが人数で割られることもありません。複数の Worker はその未払いを一つ共有します。",
      "## シェア難度が言うこと",
      "ヘルプはシェア難度を複数挙げ、シェア難度は採掘報酬に影響しないと書きます。迷うときは低い方を、GPU が非常に多いときや NiceHash では高い方を勧めています。それはプール自身の提出設定であり、このページが測った機器のハッシュレートではなく、このページが採掘機の難度を変えることもできません。API には 5分、30分、6時間のシェア統計もあります。このページはその短い窓の曲線を描かず、口座の現在速度と各 Worker の速度・最後の報告だけを出します。",
      "## 次に見ること",
      "[Zcash監視](/projects/zec)を開きます。口座の S/s がまだあるかを見てから、気になる Worker の S/s と最後の報告が一緒に止まっているかを見ます。口座に速度が残り、Worker 一人だけがオフラインなら、その Worker の問題でありウォレット全体ではありません。S/s に電気代やコイン価格を掛けて、一日の収入と呼ばないでください。",
      "## 説明用の例",
      "口座が 200 S/s、Worker が 120 S/s と 80 S/s だとします。この数は、二人の解を足して読めるということだけを示します。当サイトが採掘機を測ったという意味でも、次の支払が 200 掛ける単価だという意味でもありません。プールが一人の速度を欠いていれば、そのマスは不明であり 0 S/s ではありません。難度は報酬を変えないというヘルプの文はプールの陳述であり、当サイトの約束ではありません。",
      "## 限界",
      "このページは地域サーバーの順位を付けず、ヘルプのポート表も繰り返しません。ASIC の型名はプールがその機器を受けるという意味だけで、測った S/s ではありません。クラッシュ解釈は S/s からハードウェアを判断しません。Mac Agent は ZEC の採掘機を制御しません。",
    ],
  },
  questions: {
    zh: [
      {
        question: "矿池把数字叫算力，为什么本页写 S/s？",
        answer: "接口字段名仍是算力，但 ZEC 这口 Equihash 在本页按解每秒显示。不要改写成 H/s。",
      },
      {
        question: "份额难度调高，收益会变吗？",
        answer:
          "帮助页写明份额难度不影响矿工收益。那是矿池的说明。本页不据此承诺收入，也不能替你改矿机难度。",
      },
      {
        question: "两名 Worker 的 S/s 要加到未支付上吗？",
        answer: "不要。S/s 不是币。多名 Worker 共用同一份未支付，不要按人数把余额再加一遍。",
      },
    ],
    "zh-TW": [
      {
        question: "礦池把數字叫算力，為什麼本頁寫 S/s？",
        answer: "介面欄位名仍是算力，但 ZEC 這口 Equihash 在本頁按解每秒顯示。不要改寫成 H/s。",
      },
      {
        question: "份額難度調高，收益會變嗎？",
        answer:
          "幫助頁寫明份額難度不影響礦工收益。那是礦池的說明。本頁不據此承諾收入，也不能替你改礦機難度。",
      },
      {
        question: "兩名 Worker 的 S/s 要加到未支付上嗎？",
        answer: "不要。S/s 不是幣。多名 Worker 共用同一份未支付，不要按人數把餘額再加一遍。",
      },
    ],
    en: [
      {
        question: "The pool calls the number hashrate. Why does this page say S/s?",
        answer:
          "The API field is still named hashrate, but this Equihash coin is shown here as solutions per second. Do not rewrite it as H/s.",
      },
      {
        question: "If I raise share difficulty, do rewards change?",
        answer:
          "The help page states that share difficulty does not affect miner rewards. That is the pool's statement. This page does not turn it into an income promise, and it cannot change the miner's difficulty.",
      },
      {
        question: "Should I add two workers' S/s onto unpaid?",
        answer:
          "No. S/s is not coins. Several workers share one unpaid figure. Do not add the balance again per person.",
      },
    ],
    ko: [
      {
        question: "풀은 그 숫자를 해시레이트라고 하는데 왜 S/s인가요?",
        answer:
          "API 항목 이름은 해시레이트이지만, 이 Equihash 코인은 여기서 초당 해로 보여 줍니다. H/s로 바꾸지 마세요.",
      },
      {
        question: "지분 난이도를 올리면 보상이 바뀌나요?",
        answer:
          "도움말은 지분 난이도가 채굴 보상에 영향을 주지 않는다고 씁니다. 풀의 설명입니다. 이 페이지는 그것을 수입 약속으로 만들지 않고, 채굴기 난이도도 바꾸지 못합니다.",
      },
      {
        question: "Worker 둘의 S/s를 미지급에 더하나요?",
        answer:
          "더하지 마세요. S/s는 코인이 아닙니다. 여러 Worker는 미지급 하나를 같이 씁니다. 인원수만큼 잔액을 다시 더하지 마세요.",
      },
    ],
    ja: [
      {
        question: "プールはその数をハッシュレートと呼びます。なぜ S/s ですか？",
        answer:
          "API の項目名はハッシュレートのままですが、この Equihash はここでは秒あたりの解として示します。H/s に書き換えないでください。",
      },
      {
        question: "シェア難度を上げると報酬は変わりますか？",
        answer:
          "ヘルプは、シェア難度は採掘報酬に影響しないと書きます。プールの説明です。このページはそれを収入の約束にせず、採掘機の難度も変えられません。",
      },
      {
        question: "二人の Worker の S/s を未払いに足しますか？",
        answer:
          "足しません。S/s はコインではありません。複数の Worker は未払いを一つ共有します。人数の分だけ残高を足し直さないでください。",
      },
    ],
  },
};

const rewards: Article = {
  slug: "zec-pool-rewards-and-payments",
  published,
  modified,
  project: "zec",
  topic: {
    zh: "收益与支付",
    "zh-TW": "收益與支付",
    en: "Rewards and payments",
    ko: "수익과 지급",
    ja: "収益と支払",
  },
  title: {
    zh: "ZEC 未支付、已支付和近 24 小时该怎么分开读？",
    "zh-TW": "ZEC 未支付、已支付和近 24 小時該怎麼分開讀？",
    en: "How to read ZEC unpaid, paid, and the last 24 hours separately",
    ko: "ZEC 미지급·지급완료·24시간을 어떻게 나눠 읽나요",
    ja: "ZECの未払い・支払済み・24時間をどう分けて読むか",
  },
  description: {
    zh: "未支付是矿池还没付出的 ZEC，已支付是累计付出，近 24 小时是滚动窗口。三者都不是屏蔽余额，也不是 BTC 或 TON 领款。",
    "zh-TW":
      "未支付是礦池還沒付出的 ZEC，已支付是累計付出，近 24 小時是滾動窗口。三者都不是屏蔽餘額，也不是 BTC 或 TON 領款。",
    en: "Unpaid is ZEC the pool has not sent, paid is the cumulative total sent, and the last 24 hours is a rolling window. None of the three is a shielded balance or a BTC or TON payout.",
    ko: "미지급은 풀이 아직 보내지 않은 ZEC, 지급완료는 누적 송금, 최근 24시간은 이동 창입니다. 셋 다 차폐 잔액도 BTC·TON 수령도 아닙니다.",
    ja: "未払いはプールがまだ送っていない ZEC、支払済みは累計の送金、直近24時間は転がる窓です。三つともシールド残高でも BTC や TON の受取でもありません。",
  },
  summary: {
    zh: "三笔数回答三个问题：还没付出多少、已经付出多少、滚动 24 小时记了多少。缺失保持未知。钱包下的 Worker 不把同一笔余额再计一次。",
    "zh-TW":
      "三筆數回答三個問題：還沒付出多少、已經付出多少、滾動 24 小時記了多少。缺失保持未知。錢包下的 Worker 不把同一筆餘額再計一次。",
    en: "The three figures answer three questions: what is not yet sent, what has already been sent, and what the rolling 24 hours recorded. A missing figure stays unknown. Workers under the wallet do not count the same balance again.",
    ko: "세 숫자는 아직 안 보낸 액, 이미 보낸 액, 굴러가는 24시간에 기록된 액을 각각 답합니다. 빠진 값은 알 수 없음으로 둡니다. 지갑 아래 Worker는 같은 잔액을 다시 세지 않습니다.",
    ja: "三つの数は、まだ送っていない額、すでに送った額、転がる24時間に記録された額を別々に答えます。欠けた値は不明のままです。ウォレット配下の Worker は同じ残高を数え直しません。",
  },
  sources: [
    { name: "2Miners · ZEC help", url: "https://zec.2miners.com/help" },
    { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    {
      name: "Zcash · shielded and transparent",
      url: "https://z.cash/learn/what-is-the-difference-between-shielded-and-transparent-zcash/",
    },
  ],
  related: ["zec-transparent-addresses", "zec-solutions-vs-hashes"],
  comparisonTitle: {
    zh: "三笔 ZEC 账",
    "zh-TW": "三筆 ZEC 帳",
    en: "Three ZEC figures",
    ko: "ZEC 세 숫자",
    ja: "三つのZECの数",
  },
  comparison: {
    zh: {
      headers: ["名称", "它回答的问题", "不要把它当成"],
      rows: [
        ["未支付", "矿池账上还没付出的 ZEC", "屏蔽余额或链上全部余额"],
        ["累计已支付", "这份账户已经付出的合计", "近 24 小时再加一遍"],
        ["近 24 小时", "滚动窗口里记下的收益", "UTC 零点或香港日历当天"],
        ["Worker 行", "该名称的速率和在线情况", "另一份收入"],
      ],
    },
    "zh-TW": {
      headers: ["名稱", "它回答的問題", "不要把它當成"],
      rows: [
        ["未支付", "礦池帳上還沒付出的 ZEC", "屏蔽餘額或鏈上全部餘額"],
        ["累計已支付", "這份帳戶已經付出的合計", "近 24 小時再加一遍"],
        ["近 24 小時", "滾動窗口裡記下的收益", "UTC 零點或香港日曆當天"],
        ["Worker 行", "該名稱的速率和連線情況", "另一份收入"],
      ],
    },
    en: {
      headers: ["Name", "Question it answers", "Do not treat it as"],
      rows: [
        ["Unpaid", "ZEC the pool has not sent yet", "A shielded balance or the full chain balance"],
        ["Total paid", "What this account has already sent", "The last 24 hours added again"],
        [
          "Last 24 hours",
          "Reward recorded in a rolling window",
          "UTC midnight or the Hong Kong calendar day",
        ],
        ["A worker row", "That name's rate and whether it is online", "A second income"],
      ],
    },
    ko: {
      headers: ["이름", "답하는 질문", "이것으로 보지 말 것"],
      rows: [
        ["미지급", "풀이 아직 보내지 않은 ZEC", "차폐 잔액이나 체인 잔액 전체"],
        ["누적 지급", "이 계정이 이미 보낸 합계", "최근 24시간을 한 번 더 더한 값"],
        ["최근 24시간", "이동 창에 기록된 수익", "UTC 자정이나 홍콩 달력의 하루"],
        ["Worker 행", "그 이름의 속도와 접속 여부", "또 하나의 수입"],
      ],
    },
    ja: {
      headers: ["名前", "答える問い", "これと見なさない"],
      rows: [
        ["未払い", "プールがまだ送っていない ZEC", "シールド残高やチェーン残高の全体"],
        ["累計支払", "この口座がすでに送った合計", "直近24時間をもう一度足した額"],
        ["直近24時間", "転がる窓に記録された収益", "UTC 零時や香港の暦日"],
        ["Worker の行", "その名前の速度と接続の有無", "もう一つの収入"],
      ],
    },
  },
  body: {
    zh: [
      "ZEC 监控上的三笔钱回答的是矿池账户的三个问题，不是钱包里全部 ZEC 的一张总账。未支付是矿池还没付出的数额，累计已支付是已经付出的合计，近 24 小时是滚动窗口里记下的收益。滚动窗口不是 UTC 零点，也不是香港时间当天。未支付和累计已支付分别是还在矿池账上的和已经付出的，这两列不重叠。容易误导的是把滚动近 24 小时再叠到这两列上：那段窗口里的收益往往已经落在未支付或已付里。本页把三列分开显示，不另报一笔自己的累计总额。透明地址的链上余额和屏蔽余额是另一套账，也不并进这三列。",
      "## 支付和收益不是同一列",
      "账户接口同时给出收益和支付相关数字。近 24 小时描述的是窗口内记下的收益，已支付描述的是已经离开矿池账的合计。一笔已经付出的金额会留在累计已支付里，不应再加进未支付。API 另有矿池级的支付历史接口。本页展示的是这一份账户上的未支付、累计已支付和近 24 小时，不是全池的支付流水。帮助页允许领款币种选 ZEC、BTC 或 TON。若领款走的是 BTC 或 TON，那笔不在这个透明 ZEC 账户的三列里。",
      "## 该核对什么",
      "先确认地址是这份矿池上的透明 t 地址，再看三列哪一列是横线。横线表示这次没有可用数字，保持未知，不要当成 0。然后看 Worker 只是在列出速率和在线状态。多名 Worker 发现出来，不会把同一份未支付乘以人数。若你把 Worker 另存成多台设备，名额按已保存设备计，余额仍然只显示一份，不会变成多份收入。",
      "## 下一步",
      "在 [Zcash 监控](/projects/zec) 对照矿池账户页。两边的未支付若不一致，以矿池账户页为准，并看本站标出的获取时刻。获取时刻不是收益窗口的起点。份额难度按帮助页不影响矿工收益，所以不要用难度档位解释未支付突然变小。变小更常是已经付出，应看累计已支付有没有增加。",
      "## 说明性例子",
      "假设未支付 0.020 ZEC、累计已支付 1.400 ZEC、近 24 小时 0.004 ZEC。正确读法是：还没付出 0.020，历史上已付出 1.400，滚动窗口记下 0.004。未支付 0.020 和累计已支付 1.400 是两列不重叠的账。把 0.004 再叠上去，才会把滚动窗口里已经落在这两列中的收益算两次。0.004 也不是香港时间今天的日历收入。这组数字是说明性的。若近 24 小时缺失，就写未知，不要补 0。",
      "## 界限",
      "本页不预测下一笔何时付出，不转抄帮助页上的手续费金额，也不保证收益。屏蔽财务信息是私密的，本页读不到。崩溃解读免费，不占用 ZEC 设备名额。Mac Agent 只控制 TAH 的 Mac，不能发起 ZEC 支付。",
    ],
    "zh-TW": [
      "ZEC 監控上的三筆錢回答的是礦池帳戶的三個問題，不是錢包裡全部 ZEC 的一張總帳。未支付是礦池還沒付出的數額，累計已支付是已經付出的合計，近 24 小時是滾動窗口裡記下的收益。滾動窗口不是 UTC 零點，也不是香港時間當天。未支付和累計已支付分別是還在礦池帳上的和已經付出的，這兩欄不重疊。容易誤導的是把滾動近 24 小時再疊到這兩欄上：那段窗口裡的收益往往已經落在未支付或已付裡。本頁把三欄分開顯示，不另報一筆自己的累計總額。透明地址的鏈上餘額和屏蔽餘額是另一套帳，也不併進這三欄。",
      "## 支付和收益不是同一列",
      "帳戶介面同時給出收益和支付相關數字。近 24 小時描述的是窗口內記下的收益，已支付描述的是已經離開礦池帳的合計。一筆已經付出的金額會留在累計已支付裡，不應再加進未支付。API 另有礦池級的支付歷史介面。本頁展示的是這一份帳戶上的未支付、累計已支付和近 24 小時，不是全池的支付流水。幫助頁允許領款幣種選 ZEC、BTC 或 TON。若領款走的是 BTC 或 TON，那筆不在這個透明 ZEC 帳戶的三列裡。",
      "## 該核對什麼",
      "先確認地址是這份礦池上的透明 t 地址，再看三列哪一列是橫線。橫線表示這次沒有可用數字，保持未知，不要當成 0。然後看 Worker 只是在列出速率和連線狀態。多名 Worker 被發現，不會把同一份未支付乘以人數。若你把 Worker 另存成多台裝置，名額按已儲存裝置計，餘額仍然只顯示一份，不會變成多份收入。",
      "## 下一步",
      "在 [Zcash 監控](/projects/zec) 對照礦池帳戶頁。兩邊的未支付若不一致，以礦池帳戶頁為準，並看本站標出的取得時刻。取得時刻不是收益窗口的起點。份額難度按幫助頁不影響礦工收益，所以不要用難度檔位解釋未支付突然變小。變小更常是已經付出，應看累計已支付有沒有增加。",
      "## 說明性例子",
      "假設未支付 0.020 ZEC、累計已支付 1.400 ZEC、近 24 小時 0.004 ZEC。正確讀法是：還沒付出 0.020，歷史上已付出 1.400，滾動窗口記下 0.004。未支付 0.020 和累計已支付 1.400 是兩欄不重疊的帳。把 0.004 再疊上去，才會把滾動窗口裡已經落在這兩欄中的收益算兩次。0.004 也不是香港時間今天的日曆收入。這組數字是說明性的。若近 24 小時缺失，就寫未知，不要補 0。",
      "## 界限",
      "本頁不預測下一筆何時付出，不轉抄幫助頁上的手續費金額，也不保證收益。屏蔽財務資訊是私密的，本頁讀不到。崩潰解讀免費，不佔用 ZEC 裝置名額。Mac Agent 只控制 TAH 的 Mac，不能發起 ZEC 支付。",
    ],
    en: [
      "The three amounts on the ZEC monitor answer three questions about the pool account. They are not one ledger of every ZEC in a wallet. Unpaid is what the pool has not sent. Total paid is the sum already sent. The last 24 hours is reward recorded in a rolling window. That window is not UTC midnight and not the Hong Kong calendar day. Unpaid and total paid are what is still on the pool ledger and what has already been sent. Those two columns do not overlap. The misleading sum stacks the rolling 24 hours on top of both, because rewards inside that window are often already inside unpaid or paid. This page shows the three columns separately and does not declare its own cumulative total. The transparent address’s chain balance and a shielded balance are different ledgers and are not folded into these columns.",
      "## Payments and rewards are different columns",
      "The account endpoint returns both reward and payment figures. The last 24 hours describes reward recorded inside the window. Total paid describes what has already left the pool books. An amount already sent stays in total paid. It should not be added back into unpaid. The API also has a pool-level payment history. This page shows unpaid, total paid, and the last 24 hours for this account. It does not show every payment on the whole pool. The help page lets the payout coin be ZEC, BTC, or TON. A BTC or TON payout is not in these three columns of the transparent ZEC account.",
      "## What to inspect",
      "Confirm the address is the transparent t-address on this pool, then see which column is a dash. A dash means no usable number this time. Leave it unknown. Do not read it as zero. Worker rows list rate and online state. Finding several workers does not multiply unpaid by headcount. If you save workers as separate devices, slots follow saved devices, while the balance is still shown once. It does not become several incomes.",
      "## Next step",
      "Compare the [Zcash monitor](/projects/zec) with the pool account page. If unpaid disagrees, trust the pool account page and note this site's fetch time. The fetch time is not the start of the reward window. The help page says share difficulty does not change miner rewards, so do not explain a sudden drop in unpaid by the difficulty setting. A drop is more often a payout. Check whether total paid increased.",
      "## An illustrative case",
      "Suppose unpaid is 0.020 ZEC, total paid is 1.400 ZEC, and the last 24 hours is 0.004 ZEC. The reading is: 0.020 not yet sent, 1.400 already sent over time, 0.004 recorded in the rolling window. Unpaid 0.020 and total paid 1.400 are two columns that do not overlap. Stacking 0.004 on both counts the rolling window twice when that window’s rewards are already inside unpaid or paid. 0.004 is not today’s calendar income in Hong Kong time either. The numbers are illustrative. If the 24-hour figure is missing, write unknown. Do not fill in zero.",
      "## Limits",
      "This page does not predict when the next payout leaves, does not copy fee amounts from the help page, and does not guarantee rewards. Shielded financial information is private, and this page cannot read it. Crash interpretation is free and does not use a ZEC device slot. The Mac Agent controls only a TAH Mac and cannot send a ZEC payment.",
    ],
    ko: [
      "ZEC 모니터의 세 금액은 풀 계정의 세 질문을 답합니다. 지갑 안 모든 ZEC의 총장이 아닙니다. 미지급은 풀이 아직 보내지 않은 액, 누적 지급은 이미 보낸 합계, 최근 24시간은 이동 창에 기록된 수익입니다. 그 창은 UTC 자정도 홍콩 달력의 하루도 아닙니다. 미지급과 누적 지급은 아직 풀 장부에 있는 액과 이미 보낸 액이며, 두 열은 겹치지 않습니다. 헷갈리는 합은 롤링 24시간을 그 두 열 위에 겹치는 것입니다. 그 창의 보상은 대개 이미 미지급이나 지급 완료 안에 있습니다. 이 페이지는 세 열을 따로 보여 주고 자체 누적 총액은 내지 않습니다. 투명 주소의 체인 잔액과 차폐 잔액은 다른 장부라 이 열에 넣지 않습니다.",
      "## 지급과 수익은 다른 열",
      "계정 엔드포인트는 수익과 지급 숫자를 함께 줍니다. 최근 24시간은 창 안에 기록된 수익이고, 누적 지급은 이미 풀 장부를 떠난 합계입니다. 이미 보낸 금액은 누적 지급에 남으며 미지급에 다시 더하지 않습니다. API에는 풀 전체의 지급 이력도 있습니다. 이 페이지가 보여 주는 것은 이 계정의 미지급, 누적 지급, 최근 24시간이지 풀 전체의 지급 내역이 아닙니다. 도움말은 수령 코인을 ZEC, BTC, TON 중에서 고르게 합니다. BTC나 TON 수령은 이 투명 ZEC 계정의 세 열에 없습니다.",
      "## 확인할 것",
      "주소가 이 풀의 투명 t 주소인지 확인한 다음, 어느 열이 가로줄인지 봅니다. 가로줄은 이번에 쓸 수 있는 숫자가 없다는 뜻입니다. 알 수 없음으로 두고 0으로 읽지 마세요. Worker 행은 속도와 접속 상태만 나열합니다. Worker가 여러 명 보여도 미지급에 인원수를 곱하지 않습니다. Worker를 별도 장치로 저장하면 자리는 저장 장치를 따르고, 잔액은 여전히 한 번만 보입니다. 수입이 여러 개가 되지 않습니다.",
      "## 다음 단계",
      "[Zcash 모니터](/projects/zec)를 풀 계정 페이지와 비교합니다. 미지급이 다르면 풀 계정 페이지를 믿고, 이 사이트의 조회 시각을 봅니다. 조회 시각은 수익 창의 시작이 아닙니다. 도움말은 지분 난이도가 채굴 보상을 바꾸지 않는다고 하므로, 미지급이 갑자기 준 것을 난이도 단계로 설명하지 마세요. 줄어든 것은 대개 이미 지급된 경우입니다. 누적 지급이 늘었는지 보세요.",
      "## 설명용 사례",
      "미지급 0.020 ZEC, 누적 지급 1.400 ZEC, 최근 24시간 0.004 ZEC라고 가정합니다. 읽는 법은 아직 안 보낸 0.020, 그동안 보낸 1.400, 이동 창에 기록된 0.004입니다. 미지급 0.020과 누적 지급 1.400은 겹치지 않는 두 열입니다. 0.004를 그 위에 겹치면, 그 창의 보상이 이미 두 열 안에 있을 때 같은 구간을 두 번 셉니다. 0.004는 홍콩 시간 오늘의 달력 수입도 아닙니다. 숫자는 설명용입니다. 24시간 값이 없으면 알 수 없음으로 쓰고 0을 채우지 마세요.",
      "## 한계",
      "이 페이지는 다음 지급 시각을 예측하지 않고, 도움말의 수수료 금액을 베끼지 않으며, 수익을 보장하지 않습니다. 차폐 재무 정보는 비공개라 이 페이지가 읽지 못합니다. 충돌 해석은 무료이고 ZEC 장치 자리를 쓰지 않습니다. Mac Agent는 TAH Mac만 제어하며 ZEC 지급을 보내지 않습니다.",
    ],
    ja: [
      "ZEC監視の三つの金額は、プール口座についての三つの問いに答えます。ウォレット内のすべての ZEC を一枚の総勘定にしたものではありません。未払いはプールがまだ送っていない額、累計支払はすでに送った合計、直近24時間は転がる窓に記録された収益です。その窓は UTC 零時でも香港時間の暦日でもありません。未払いと累計支払は、まだプール台帳にある額とすでに送った額で、二列は重なりません。誤解を招くのは、直近24時間をその二列の上に重ねることです。その窓の収益は、たいていまだ未払いか支払済みの中にあります。このページは三列を分けて出し、独自の累計総額は出しません。透明アドレスのチェーン残高とシールド残高は別の台帳なので、これらの列には入れません。",
      "## 支払と収益は別の列",
      "口座のエンドポイントは収益と支払の数を一緒に返します。直近24時間は窓の中に記録された収益、累計支払はすでにプールの台帳を離れた合計です。すでに送った額は累計支払に残り、未払いへ戻して足しません。API にはプール全体の支払履歴もあります。このページが見せるのは、この口座の未払い、累計支払、直近24時間であり、プール全体の支払明細ではありません。ヘルプは受取通貨を ZEC、BTC、TON から選べます。BTC や TON の受取は、この透明 ZEC 口座の三列には入りません。",
      "## 確かめること",
      "アドレスがこのプールの透明な t アドレスかを確認してから、どの列が横線かを見ます。横線は、今回使える数が無いという意味です。不明のままにし、0 と読まないでください。Worker の行は速度と接続状態を並べるだけです。Worker が何人見えても、未払いに人数を掛けません。Worker を別端末として保存すると、枠は保存端末に従い、残高は依然として一度だけ表示されます。収入が複数にはなりません。",
      "## 次の手順",
      "[Zcash監視](/projects/zec)をプールの口座ページと突き合わせます。未払いが食い違うときはプールの口座ページを信じ、当サイトの取得時刻を見ます。取得時刻は収益の窓の起点ではありません。ヘルプはシェア難度が採掘報酬を変えないと書くので、未払いが急に減ったことを難度の段で説明しないでください。減るのは、すでに支払われた場合がよくあります。累計支払が増えたかを見てください。",
      "## 説明用の例",
      "未払い 0.020 ZEC、累計支払 1.400 ZEC、直近24時間 0.004 ZEC だとします。読み方は、まだ送っていない 0.020、これまで送った 1.400、転がる窓に記録された 0.004 です。未払い 0.020 と累計支払 1.400 は重ならない二列です。0.004 をその上に重ねると、その窓の収益がすでに二列の中にあるとき同じ区間を二回数えます。0.004 は香港時間の今日の暦日収入でもありません。数は説明用です。24時間の値が欠ければ不明と書き、0 を埋めないでください。",
      "## 限界",
      "このページは次の支払の時刻を予測せず、ヘルプの手数料額を写さず、収益も保証しません。シールドの財務情報は非公開で、このページは読めません。クラッシュ解釈は無料で、ZEC の端末枠を使いません。Mac Agent が制御するのは TAH の Mac だけで、ZEC の支払は送れません。",
    ],
  },
  questions: {
    zh: [
      {
        question: "近 24 小时为什么不是今天？",
        answer:
          "它是滚动窗口，不是 UTC 零点，也不是香港时间当天。页面上的获取时刻是另一次时钟，不是这个窗口的起点。",
      },
      {
        question: "未支付变小是不是亏了？",
        answer:
          "不一定。更常见的是已经付出。对照累计已支付有没有增加。未支付和累计已支付可以对照着看。不要再把近 24 小时叠上去，那段窗口和这两列的时间会重叠。页面分开显示，不另报累计总额。",
      },
      {
        question: "BTC 领款会出现在这三列吗？",
        answer: "不会。帮助页把 BTC 和 TON 当作另一种领款。这三列只描述这份透明 ZEC 矿池账户。",
      },
    ],
    "zh-TW": [
      {
        question: "近 24 小時為什麼不是今天？",
        answer:
          "它是滾動窗口，不是 UTC 零點，也不是香港時間當天。頁面上的取得時刻是另一次時鐘，不是這個窗口的起點。",
      },
      {
        question: "未支付變小是不是虧了？",
        answer:
          "不一定。更常見的是已經付出。對照累計已支付有沒有增加。未支付和累計已支付可以對照著看。不要再把近 24 小時疊上去，那段窗口和這兩欄的時間會重疊。頁面分開顯示，不另報累計總額。",
      },
      {
        question: "BTC 領款會出現在這三列嗎？",
        answer: "不會。幫助頁把 BTC 和 TON 當作另一種領款。這三列只描述這份透明 ZEC 礦池帳戶。",
      },
    ],
    en: [
      {
        question: "Why is the last 24 hours not today?",
        answer:
          "It is a rolling window, not UTC midnight and not the Hong Kong calendar day. The fetch time on the page is a different clock. It is not the start of that window.",
      },
      {
        question: "If unpaid drops, did I lose coins?",
        answer:
          "Not necessarily. A payout is the more common reason. Check whether total paid increased. Unpaid and total paid can be compared as still held and already sent. Do not stack the last 24 hours on top; that window overlaps those columns. The page shows them separately and does not declare its own cumulative total.",
      },
      {
        question: "Does a BTC payout appear in these three columns?",
        answer:
          "No. The help page treats BTC and TON as another payout choice. These columns describe only this transparent ZEC pool account.",
      },
    ],
    ko: [
      {
        question: "최근 24시간은 왜 오늘이 아닌가요?",
        answer:
          "이동 창이며 UTC 자정도 홍콩 달력의 하루도 아닙니다. 페이지의 조회 시각은 다른 시계이고, 그 창의 시작이 아닙니다.",
      },
      {
        question: "미지급이 줄면 손해가 난 건가요?",
        answer:
          "꼭 그렇지는 않습니다. 이미 지급된 경우가 더 흔합니다. 누적 지급이 늘었는지 보세요. 미지급과 누적 지급은 아직 가진 액과 이미 보낸 액으로 대조할 수 있습니다. 최근 24시간을 그 위에 겹치지 마세요. 그 창은 두 열과 기간이 겹칩니다. 페이지는 따로 보여 주고 자체 누적 총액은 내지 않습니다.",
      },
      {
        question: "BTC 수령이 이 세 열에 나오나요?",
        answer:
          "나오지 않습니다. 도움말은 BTC와 TON을 다른 수령으로 둡니다. 이 열은 투명 ZEC 풀 계정만 설명합니다.",
      },
    ],
    ja: [
      {
        question: "直近24時間はなぜ今日ではないのですか？",
        answer:
          "転がる窓であり、UTC 零時でも香港時間の暦日でもありません。ページの取得時刻は別の時計で、その窓の起点ではありません。",
      },
      {
        question: "未払いが減ったら損ですか？",
        answer:
          "必ずしもそうではありません。すでに支払われた場合の方がよくあります。累計支払が増えたかを見てください。未払いと累計支払は、まだ持っている額とすでに送った額として対照できます。直近24時間をその上に重ねないでください。その窓は二列と期間が重なります。ページは分けて出し、独自の累計総額は出しません。",
      },
      {
        question: "BTC の受取はこの三列に出ますか？",
        answer:
          "出ません。ヘルプは BTC と TON を別の受取としています。この列が説明するのは透明な ZEC プール口座だけです。",
      },
    ],
  },
};

const missingWorker: Article = {
  slug: "zec-worker-not-found",
  published,
  modified,
  project: "zec",
  topic: {
    zh: "找不到 Worker",
    "zh-TW": "找不到 Worker",
    en: "A worker is missing",
    ko: "Worker가 안 보임",
    ja: "Workerが見つからない",
  },
  title: {
    zh: "ZEC 监控里找不到 Worker，先查地址还是先查矿机？",
    "zh-TW": "ZEC 監控裡找不到 Worker，先查地址還是先查礦機？",
    en: "ZEC worker missing: check the address before the miner",
    ko: "ZEC Worker가 없을 때 채굴기보다 주소를 먼저 보는 이유",
    ja: "ZECのWorkerが無いとき、採掘機より先にアドレスを見る",
  },
  description: {
    zh: "名单为空，可能是地址形状被拒绝、矿机不在这口矿池，或帮助页要求把钱包填进 Worker 栏所以名称不是矿机昵称。空名单不是硬件结论。",
    "zh-TW":
      "名單為空，可能是地址形狀被拒絕、礦機不在這口礦池，或幫助頁要求把錢包填進 Worker 欄所以名稱不是礦機暱稱。空名單不是硬體結論。",
    en: "An empty list can mean the address shape was refused, the miner is not on this pool, or the help page's Worker field is the wallet so the name is not a rig nickname. Empty is not a hardware verdict.",
    ko: "빈 목록은 주소 형태가 거절되었거나, 채굴기가 이 풀에 없거나, 도움말대로 Worker 칸에 지갑을 넣어 이름이 리그 별명이 아닐 수 있습니다. 빈 목록은 하드웨어 결론이 아닙니다.",
    ja: "空の一覧は、アドレスの形が拒否された、採掘先がこのプールではない、またはヘルプどおり Worker 欄がウォレットなので名前がリグの通称ではない、のいずれかです。空はハードウェアの結論ではありません。",
  },
  summary: {
    zh: "先分开三件事：本页拒绝了字符串、矿池账户里没有你要的名称、某一名 Worker 被标成离线。仅有离线标记并不足以重启。先对照地址、矿机、最后份额、网络和进程。若确认并改好了真实的配置不一致，按该矿机软件应用或重新加载，只有软件要求时才重启。钱包余额不按 Worker 复制。",
    "zh-TW":
      "先分開三件事：本頁拒絕了字串、礦池帳戶裡沒有你要的名稱、某一名 Worker 被標成離線。僅有離線標記並不足以重啟。先對照地址、礦機、最後份額、網路和行程。若確認並改好了真實的設定不一致，按該礦機軟體套用或重新載入，只有軟體要求時才重啟。錢包餘額不按 Worker 複製。",
    en: "Separate three cases: this page refused the string, the pool account has no such name, or one worker is marked offline. An offline label alone is not a reason to restart. First compare the address, the rig, the last share, the network, and the process. If a real config mismatch is confirmed and corrected, apply or reload it the way that miner software expects, and restart only if the software requires it. The wallet balance is not copied per worker.",
    ko: "세 경우를 나눕니다. 이 페이지가 문자열을 거절했거나, 풀 계정에 그 이름이 없거나, Worker 하나가 오프라인입니다. 오프라인 표시만으로는 재시작할 이유가 되지 않습니다. 먼저 주소, 채굴기, 마지막 지분, 네트워크, 프로세스를 대조합니다. 실제 설정 불일치를 확인하고 고쳤다면 그 채굴 소프트웨어가 정한 방식으로 적용하거나 다시 불러오고, 소프트웨어가 요구할 때만 재시작합니다. 지갑 잔액은 Worker마다 복사되지 않습니다.",
    ja: "三つを分けます。このページが文字列を拒否した、プール口座にその名前が無い、一人の Worker がオフラインである。オフライン表示だけでは再起動の理由になりません。先にアドレス、リグ、最終シェア、ネットワーク、プロセスを照合します。実際の設定の不一致を確認して直したときは、その採掘ソフトの手順で適用または再読み込みし、再起動はそのソフトが求めるときだけです。ウォレット残高は Worker ごとに複製されません。",
  },
  sources: [
    { name: "2Miners · ZEC help", url: "https://zec.2miners.com/help" },
    { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
  ],
  related: ["zec-mining-monitor-guide", "zec-solutions-vs-hashes"],
  comparisonTitle: {
    zh: "找不到时的三条路",
    "zh-TW": "找不到時的三條路",
    en: "Three paths when a worker is missing",
    ko: "Worker가 없을 때의 세 갈래",
    ja: "Workerが無いときの三つの道",
  },
  comparison: {
    zh: {
      headers: ["现象", "含义", "下一步"],
      rows: [
        ["输入框就拒绝", "不是 t1 或 t3 加 33 位", "贴你自己的完整透明 t1 或 t3，不要打开矿机"],
        [
          "账户打开了，名单里没有那个名字",
          "矿池这次报告的名称里没有它",
          "对照矿池账户页和矿机的 Worker/RIG 配置。名称可能是 t 地址。确认不一致并改好后，按该矿机软件应用或重新加载，只有软件要求时才重启",
        ],
        [
          "名字在，状态为离线",
          "这个名称有记录，但矿池标成离线",
          "离线标记本身不足以重启。先对照地址、矿机、最后份额、网络和进程，看是否还在向 zec.2miners.com 提交",
        ],
        [
          "多名 Worker 都在",
          "它们共用一份未支付",
          "不要按人数复制余额，也不要以为每个名字自动占一台设备",
        ],
      ],
    },
    "zh-TW": {
      headers: ["現象", "含義", "下一步"],
      rows: [
        ["輸入框就拒絕", "不是 t1 或 t3 加 33 位", "貼你自己的完整透明 t1 或 t3，不要打開礦機"],
        [
          "帳戶打開了，名單裡沒有那個名字",
          "礦池這次報告的名稱裡沒有它",
          "對照礦池帳戶頁和礦機的 Worker/RIG 設定。名稱可能是 t 地址。確認不一致並改好後，按該礦機軟體套用或重新載入，只有軟體要求時才重啟",
        ],
        [
          "名字在，狀態為離線",
          "這個名稱有紀錄，但礦池標成離線",
          "離線標記本身不足以重啟。先對照地址、礦機、最後份額、網路和行程，看是否還在向 zec.2miners.com 提交",
        ],
        [
          "多名 Worker 都在",
          "它們共用一份未支付",
          "不要按人數複製餘額，也不要以為每個名字自動佔一台裝置",
        ],
      ],
    },
    en: {
      headers: ["What you see", "Meaning", "Next step"],
      rows: [
        [
          "The box refuses the string",
          "It is not a t1 or t3 plus 33 characters",
          "Paste your own full transparent t1 or t3. Do not open the miner",
        ],
        [
          "The account opens and the name is absent",
          "The pool's report this time has no such name",
          "Compare the pool account with the miner Worker/RIG config. The name may be the t-address. After a confirmed mismatch is corrected, apply or reload it as that miner software expects. Restart only if the software requires it",
        ],
        [
          "The name is there and marked offline",
          "The name has a record, and the pool marks it offline",
          "An offline label alone is not a reason to restart. Compare address, rig, last share, network, and process, and whether it still submits to zec.2miners.com",
        ],
        [
          "Several workers are listed",
          "They share one unpaid balance",
          "Do not copy the balance per name, and do not assume each name uses a device slot",
        ],
      ],
    },
    ko: {
      headers: ["보이는 것", "의미", "다음"],
      rows: [
        [
          "입력칸이 거부",
          "t1 또는 t3 더하기 33자가 아님",
          "본인의 완전한 투명 t1 또는 t3를 붙임. 채굴기는 열지 않음",
        ],
        [
          "계정은 열리는데 그 이름이 없음",
          "이번 풀 보고에 그 이름이 없음",
          "풀 계정과 채굴기 Worker/RIG 설정을 대조. 이름이 t 주소일 수 있음. 불일치를 확인하고 고친 뒤 그 소프트웨어 방식으로 적용하거나 다시 불러오고, 요구할 때만 재시작",
        ],
        [
          "이름은 있고 오프라인",
          "기록은 있고 풀이 오프라인으로 표시",
          "오프라인 표시만으로는 재시작 이유가 안 됨. 주소, 채굴기, 마지막 지분, 네트워크, 프로세스를 먼저 대조하고 zec.2miners.com 제출 여부를 봄",
        ],
        [
          "Worker가 여러 명",
          "미지급 하나를 같이 씀",
          "이름마다 잔액을 복사하지 말고, 이름이 자동으로 장치 자리를 쓴다고 보지 않음",
        ],
      ],
    },
    ja: {
      headers: ["見えていること", "意味", "次"],
      rows: [
        [
          "入力欄が拒否する",
          "t1 または t3 に 33 文字を足した形ではない",
          "自分の完全な透明 t1 または t3 を貼る。採掘機は開けない",
        ],
        [
          "口座は開くが、その名前が無い",
          "今回のプール報告にその名前が無い",
          "プール口座と採掘機の Worker/RIG 設定を照合。名前は t アドレスのことがある。不一致を確認して直したあと、そのソフトの手順で適用または再読み込みし、求めるときだけ再起動",
        ],
        [
          "名前はあり、オフライン",
          "記録はあるがプールがオフラインと付けている",
          "オフライン表示だけでは再起動の理由にならない。先にアドレス、リグ、最終シェア、ネットワーク、プロセスと zec.2miners.com への提出を照合",
        ],
        [
          "Worker が複数",
          "未払いを一つ共有",
          "名前ごとに残高を複製せず、名前が自動で端末枠を使うとも思わない",
        ],
      ],
    },
  },
  body: {
    zh: [
      "在 ZEC 监控里找不到某个 Worker 时，先分清是输入被拒绝、名称不在这份报告里，还是名称在但离线。本页的名单来自 zec.2miners.com 这一份透明账户当前报告的名称。名称不在名单里，只说明这份报告没有它。它不说明主板、风扇或电源坏了。",
      "## 三种现象",
      "- 输入被拒绝：贴上你自己的完整透明地址（t1 或 t3，前缀后再加 33 位）。矿机昵称、屏蔽地址、统一地址、BTC 或 TON 领款串都进不了这一页。不必打开矿机。",
      "- 账户能打开，名单里没有你要的名字：到矿池账户页看实际名称，同时核对矿机的 Worker 或 RIG 配置。帮助页对列出的 ASIC 把 Worker 写成钱包地址，所以名称可能就是那串 t 地址。确认配置和矿池不一致并改好后，按该矿机软件应用或重新加载，只有软件要求时才重启。",
      "- 名字在，状态是离线：离线标记本身不足以重启。先对照地址、矿机、最后份额、网络和进程，看矿机是否还指向 zec.2miners.com 并继续提交。",
      "## 和设备名额的关系",
      "在一个已保存设备上打开钱包，下面列出的 Worker 不会自动各算一台。免费仍是每项目 5 台已保存设备，Pro 50 台。只有你明确把 Worker 另存成独立设备，那些记录才占名额。同一台设备上多次绑定 ZEC 不增加名额。未支付始终是这一份钱包的共享数，不会因为名单变长就复制成多份收入。",
      "## 下一步",
      "打开 [Zcash 监控](/projects/zec)。输入被拒绝时，贴上你自己的完整透明 t1 或 t3，不必打开矿机。账户能开但没有目标名字时，对照矿池账户页和矿机的 Worker 或 RIG 配置；确认不一致并改好后，按该矿机软件应用或重新加载，只有软件要求时才重启，并确认矿机不是只连在 API 所说的另一类 SOLO 池上。本页不把另一台服务器并进这份名单。名字在但离线时，先对照地址、矿机、最后份额、网络和进程，看最后上报之后矿机有没有继续提交。API 的 5 分钟、30 分钟、6 小时份额曲线不在本页，短窗口以矿池自己的账户页为准。",
      "## 说明性例子",
      "假设你在找 rig-a。账户打开后只有一个名称，内容是那串 t1，状态在线，80 S/s。这说明帮助页那种“Worker 填钱包”的配置可能正在使用，rig-a 从未作为名称上报。这不是 rig-a 硬件损坏的证据，也不是本站实测。若连账户都打不开，因为你贴的是 z 开头的地址，则连“离线”都还没发生。缺失的名称不要记成 0 S/s。",
      "## 界限",
      "本页不能登录矿机、不能改 Worker 栏、不能区分是网线松了还是进程退出。崩溃解读不读取 ZEC 矿机日志。Mac Agent 只控制 TAH 的 Mac。移除本站的保存记录不会停止矿池上的提交。",
    ],
    "zh-TW": [
      "在 ZEC 監控裡找不到某個 Worker 時，先分清是輸入被拒絕、名稱不在這份報告裡，還是名稱在但離線。本頁的名單來自 zec.2miners.com 這一份透明帳戶當前報告的名稱。名稱不在名單裡，只說明這份報告沒有它。它不說明主機板、風扇或電源壞了。",
      "## 三種現象",
      "- 輸入被拒絕：貼上你自己的完整透明地址（t1 或 t3，前綴後再加 33 位）。礦機暱稱、屏蔽地址、統一地址、BTC 或 TON 領款串都進不了這一頁。不必打開礦機。",
      "- 帳戶能打開，名單裡沒有你要的名字：到礦池帳戶頁看實際名稱，同時核對礦機的 Worker 或 RIG 設定。幫助頁對列出的 ASIC 把 Worker 寫成錢包地址，所以名稱可能就是那串 t 地址。確認設定和礦池不一致並改好後，按該礦機軟體套用或重新載入，只有軟體要求時才重啟。",
      "- 名字在，狀態是離線：離線標記本身不足以重啟。先對照地址、礦機、最後份額、網路和行程，看礦機是否還指向 zec.2miners.com 並繼續提交。",
      "## 和裝置名額的關係",
      "在一個已儲存裝置上打開錢包，下面列出的 Worker 不會自動各算一台。免費仍是每專案 5 台已儲存裝置，Pro 50 台。只有你明確把 Worker 另存成獨立裝置，那些紀錄才佔名額。同一台裝置上多次綁定 ZEC 不增加名額。未支付始終是這一份錢包的共享數，不會因為名單變長就複製成多份收入。",
      "## 下一步",
      "打開 [Zcash 監控](/projects/zec)。輸入被拒絕時，貼上你自己的完整透明 t1 或 t3，不必打開礦機。帳戶能開但沒有目標名字時，對照礦池帳戶頁和礦機的 Worker 或 RIG 設定；確認不一致並改好後，按該礦機軟體套用或重新載入，只有軟體要求時才重啟，並確認礦機不是只連在 API 所說的另一類 SOLO 池上。本頁不把另一台伺服器併進這份名單。名字在但離線時，先對照地址、礦機、最後份額、網路和行程，看最後上報之後礦機有沒有繼續提交。API 的 5 分鐘、30 分鐘、6 小時份額曲線不在本頁，短窗口以礦池自己的帳戶頁為準。",
      "## 說明性例子",
      "假設你在找 rig-a。帳戶打開後只有一個名稱，內容是那串 t1，狀態在線，80 S/s。這說明幫助頁那種「Worker 填錢包」的設定可能正在使用，rig-a 從未作為名稱上報。這不是 rig-a 硬體損壞的證據，也不是本站實測。若連帳戶都打不開，因為你貼的是 z 開頭的地址，則連「離線」都還沒發生。缺失的名稱不要記成 0 S/s。",
      "## 界限",
      "本頁不能登入礦機、不能改 Worker 欄、不能區分是網路線鬆了還是行程退出。崩潰解讀不讀取 ZEC 礦機日誌。Mac Agent 只控制 TAH 的 Mac。移除本站的儲存紀錄不會停止礦池上的提交。",
    ],
    en: [
      "If a worker is missing on the ZEC monitor, first separate a refused input, a name absent from this report, and a name that is present but offline. The list is the names the transparent account on zec.2miners.com reports right now. A name that is absent only means this report does not include it. It does not mean the board, the fan, or the power supply failed.",
      "## Three cases",
      "- Refused input: paste your own full transparent address, t1 or t3 plus 33 characters. A rig nickname, a shielded address, a unified address, or a BTC or TON payout string does not enter this page. You do not need to open the miner.",
      "- The account opens and the name you want is missing. Read the name on the pool account page and check the miner Worker or RIG config. On the ASICs it lists, the help page sets Worker to the wallet, so the name may be that t-address. If a real config mismatch is confirmed and corrected, apply or reload it the way that miner software expects. Restart only if the software requires it.",
      "- The name is present and marked offline. An offline label alone is not a reason to restart. First compare the address, the rig, the last share, the network, and the process, and whether the miner still points at zec.2miners.com and keeps submitting.",
      "## How this relates to device slots",
      "Opening a wallet on one saved device does not turn each listed worker into its own device. Free remains five saved devices for this project. Pro remains fifty. A worker uses a slot only when you explicitly save it as its own device. Binding ZEC more than once on the same device does not add a slot. Unpaid stays one shared figure for the wallet. A longer list does not copy it into several incomes.",
      "## Next step",
      "Open the [Zcash monitor](/projects/zec). If the input was refused, paste your own full transparent t1 or t3. You do not need to open the miner. If the account opens without the name you want, compare the pool account page with the miner Worker or RIG config. After a confirmed mismatch is corrected, apply or reload it as that miner software expects, and restart only if the software requires it. Also confirm the miner is not attached only to the separate SOLO category the API lists for ZEC. This page does not merge another server into the list. If the name is present but offline, an offline label alone is not a reason to restart. Compare the address, the rig, the last share, the network, and the process, and whether the miner kept submitting after the last report. The API's 5-minute, 30-minute, and 6-hour share series are not on this page. Use the pool's own account page for those short windows.",
      "## An illustrative case",
      "Suppose you are looking for rig-a. The account opens with one name, the t1 string itself, online at 80 S/s. That fits the help page's instruction to put the wallet in the Worker field. rig-a was never reported as a name. It is not evidence that rig-a's hardware failed, and it is not a measurement by this site. If the account does not open because you pasted an address starting with z, the worker has not even reached an offline state. Do not record a missing name as 0 S/s.",
      "## Limits",
      "This page cannot sign in to the miner, cannot edit the Worker field, and cannot tell a loose network cable from a stopped process. Crash interpretation does not read ZEC miner logs. The Mac Agent controls only a TAH Mac. Removing a saved record here does not stop submissions on the pool.",
    ],
    ko: [
      "ZEC 모니터에서 Worker가 안 보이면, 입력이 거부된 것인지, 이번 보고에 이름이 없는 것인지, 이름은 있는데 오프라인인지를 먼저 나눕니다. 목록은 zec.2miners.com의 투명 계정이 지금 보고하는 이름입니다. 이름이 없다는 것은 이번 보고에 없다는 뜻이지, 보드나 팬이나 전원이 고장 났다는 뜻이 아닙니다.",
      "## 세 가지 현상",
      "- 입력이 거부되면 본인의 완전한 투명 주소(t1 또는 t3, 접두 뒤 33자)를 붙이세요. 리그 별명, 차폐 주소, 통합 주소, BTC나 TON 수령 문자열은 이 페이지에 들어가지 않습니다. 채굴기를 열 필요는 없습니다.",
      "- 계정은 열리는데 원하는 이름이 없으면, 풀 계정 페이지의 실제 이름과 채굴기 Worker 또는 RIG 설정을 함께 보세요. 도움말은 적힌 ASIC의 Worker 칸에 지갑 주소를 넣으라고 하므로, 이름이 그 t 주소일 수 있습니다. 실제 설정 불일치를 확인하고 고쳤다면, 그 채굴 소프트웨어가 정한 방식으로 적용하거나 다시 불러오고, 소프트웨어가 요구할 때만 재시작합니다.",
      "- 이름은 있고 오프라인이면, 오프라인 표시만으로는 재시작 이유가 되지 않습니다. 먼저 주소, 채굴기, 마지막 지분, 네트워크, 프로세스를 대조하고, 채굴기가 아직 zec.2miners.com을 보고 제출하는지를 봅니다.",
      "## 장치 자리와의 관계",
      "저장된 장치 하나에서 지갑을 열어도, 나열된 Worker가 각각 장치가 되지는 않습니다. 무료는 이 프로젝트의 저장 장치 5대, Pro는 50대입니다. Worker를 독립 장치로 명시해 저장할 때만 자리를 씁니다. 같은 장치에 ZEC를 여러 번 묶어도 자리는 늘지 않습니다. 미지급은 그 지갑의 공유 숫자 하나입니다. 목록이 길어진다고 수입이 여러 부로 복사되지 않습니다.",
      "## 다음 단계",
      "[Zcash 모니터](/projects/zec)를 엽니다. 입력이 거부되면 본인의 완전한 투명 t1 또는 t3를 붙이고, 채굴기는 열지 않아도 됩니다. 계정은 열리는데 원하는 이름이 없으면 풀 계정 페이지와 채굴기 Worker 또는 RIG 설정을 대조합니다. 불일치를 확인하고 고친 뒤에는 그 소프트웨어 방식으로 적용하거나 다시 불러오고, 요구할 때만 재시작합니다. 채굴기가 API에 적힌 ZEC의 별도 SOLO 분류에만 붙어 있지 않은지도 확인합니다. 이 페이지는 다른 서버를 목록에 합치지 않습니다. 이름은 있는데 오프라인이면 표시만으로 재시작을 결정하지 말고, 주소, 채굴기, 마지막 지분, 네트워크, 프로세스와 마지막 보고 이후의 제출을 먼저 대조합니다. API의 5분, 30분, 6시간 지분 곡선은 이 페이지에 없습니다. 짧은 창은 풀 자신의 계정 페이지를 보세요.",
      "## 설명용 사례",
      "rig-a를 찾는다고 가정합니다. 계정이 열리니 이름은 t1 문자열 하나이고, 온라인이며 80 S/s입니다. 이는 도움말처럼 Worker 칸에 지갑을 넣은 구성과 맞습니다. rig-a는 이름으로 보고된 적이 없습니다. rig-a의 하드웨어 고장의 증거도, 이 사이트의 실측도 아닙니다. z로 시작하는 주소를 붙여 계정 자체가 열리지 않으면, 오프라인 상태까지 가지도 않은 것입니다. 없는 이름을 0 S/s로 적지 마세요.",
      "## 한계",
      "이 페이지는 채굴기에 로그인할 수 없고, Worker 칸을 고칠 수 없으며, 랜선이 빠진 것과 프로세스가 끝난 것을 구분하지 못합니다. 충돌 해석은 ZEC 채굴기 로그를 읽지 않습니다. Mac Agent는 TAH Mac만 제어합니다. 여기의 저장 기록을 지워도 풀의 제출은 멈추지 않습니다.",
    ],
    ja: [
      "ZEC監視で Worker が見つからないときは、入力が拒否されたのか、この報告に名前が無いのか、名前はあってオフラインなのかを先に分けます。一覧は zec.2miners.com の透明口座が今報告している名前です。名前が無いのは、この報告に含まれないという意味であり、基板やファンや電源が壊れたという意味ではありません。",
      "## 三つの現象",
      "- 入力が拒否されたら、自分の完全な透明アドレス（t1 または t3 に 33 文字）を貼ってください。リグの通称、シールドアドレス、統合アドレス、BTC や TON の受取文字列はこのページに入りません。採掘機を開ける必要はありません。",
      "- 口座は開くのに欲しい名前が無いときは、プール口座ページの実際の名前と、採掘機の Worker または RIG 設定を一緒に見てください。ヘルプは挙げる ASIC の Worker 欄をウォレットにすると書くので、名前はその t アドレスのことがあります。実際の設定の不一致を確認して直したときは、その採掘ソフトの手順で適用または再読み込みし、再起動はそのソフトが求めるときだけです。",
      "- 名前がありオフラインなら、オフライン表示だけでは再起動の理由になりません。先にアドレス、リグ、最終シェア、ネットワーク、プロセスを照合し、採掘機がまだ zec.2miners.com を向いて提出しているかを見ます。",
      "## 端末枠との関係",
      "保存した端末一つでウォレットを開いても、並んだ Worker がそれぞれ端末になるわけではありません。無料はこのプロジェクトの保存端末5台、Pro は50台のままです。Worker が枠を使うのは、独立した端末として明示的に保存したときだけです。同じ端末に ZEC を何度結んでも枠は増えません。未払いはそのウォレットの共有の数のままです。一覧が長くなっても、収入が何通にも複製されません。",
      "## 次の手順",
      "[Zcash監視](/projects/zec)を開きます。入力が拒否されたら自分の完全な透明 t1 または t3 を貼り、採掘機は開けなくてよいです。口座は開くのに目当ての名前が無ければ、プールの口座ページと採掘機の Worker または RIG 設定を照合します。不一致を確認して直したあと、そのソフトの手順で適用または再読み込みし、求めるときだけ再起動します。採掘機が API に書かれた ZEC の別の SOLO 区分だけに付いていないかも確認します。このページは別サーバーを一覧に合算しません。名前はあってオフラインなら、表示だけで再起動を決めず、先にアドレス、リグ、最終シェア、ネットワーク、プロセスと、最後の報告の後も提出が続いたかを照合します。API の5分、30分、6時間のシェア曲線はこのページにありません。短い窓はプール自身の口座ページを見てください。",
      "## 説明用の例",
      "rig-a を探しているとします。口座が開くと名前は t1 の文字列だけで、オンライン、80 S/s です。これはヘルプのように Worker 欄へウォレットを入れた構成と合います。rig-a は名前として報告されていません。rig-a のハードウェア故障の証拠でも、当サイトの実測でもありません。z で始まるアドレスを貼って口座自体が開かないなら、オフラインにすら至っていません。無い名前を 0 S/s と記録しないでください。",
      "## 限界",
      "このページは採掘機にログインできず、Worker 欄を編集できず、ケーブルが抜けたこととプロセスが止まったことを区別できません。クラッシュ解釈は ZEC 採掘機のログを読みません。Mac Agent が制御するのは TAH の Mac だけです。ここの保存記録を外しても、プール上の提出は止まりません。",
    ],
  },
  questions: {
    zh: [
      {
        question: "名单是空的，矿机是不是坏了？",
        answer:
          "不能这么下结论。输入被拒绝时贴你自己的完整透明地址，不必打开矿机。账户能开但没有这个名字时，对照矿池账户页和矿机的 Worker 或 RIG 配置；确认不一致并改好后，按该矿机软件应用或重新加载，只有软件要求时才重启。名字在且标成离线时，离线标记本身不足以重启，先对照地址、矿机、最后份额、网络和进程，看它是否还在提交。",
      },
      {
        question: "为什么名称是一整串 t 地址？",
        answer:
          "帮助页对列出的 ASIC 把 Worker 栏写成钱包地址。矿池报告的名称就可能是那串透明地址，而不是本机昵称。",
      },
      {
        question: "看到五个 Worker 会占用五台设备吗？",
        answer:
          "不会自动占用。它们挂在同一份已保存设备的钱包下，余额只显示一份。另存成独立设备时才各占名额。",
      },
    ],
    "zh-TW": [
      {
        question: "名單是空的，礦機是不是壞了？",
        answer:
          "不能這麼下結論。輸入被拒絕時貼你自己的完整透明地址，不必打開礦機。帳戶能開但沒有這個名字時，對照礦池帳戶頁和礦機的 Worker 或 RIG 設定；確認不一致並改好後，按該礦機軟體套用或重新載入，只有軟體要求時才重啟。名字在且標成離線時，離線標記本身不足以重啟，先對照地址、礦機、最後份額、網路和行程，看它是否還在提交。",
      },
      {
        question: "為什麼名稱是一整串 t 地址？",
        answer:
          "幫助頁對列出的 ASIC 把 Worker 欄寫成錢包地址。礦池報告的名稱就可能是那串透明地址，而不是本機暱稱。",
      },
      {
        question: "看到五個 Worker 會佔用五台裝置嗎？",
        answer:
          "不會自動佔用。它們掛在同一份已儲存裝置的錢包下，餘額只顯示一份。另存成獨立裝置時才各佔名額。",
      },
    ],
    en: [
      {
        question: "The list is empty. Is the miner broken?",
        answer:
          "That conclusion does not follow. If the input was refused, paste your own full transparent address. You do not need to open the miner. If the account opens without that name, compare the pool account page with the miner Worker or RIG config. After a confirmed mismatch is corrected, apply or reload it as that miner software expects, and restart only if the software requires it. If the name is present and marked offline, the label alone is not a reason to restart. Compare the address, the rig, the last share, the network, and the process, and whether it is still submitting.",
      },
      {
        question: "Why is the name a whole t-address?",
        answer:
          "On the ASICs it lists, the help page sets the Worker field to the wallet address. The name the pool reports can be that transparent address rather than a local nickname.",
      },
      {
        question: "Do five workers use five device slots?",
        answer:
          "Not automatically. They sit under the wallet on one saved device, and the balance is shown once. Each uses a slot only if you save it as its own device.",
      },
    ],
    ko: [
      {
        question: "목록이 비었으면 채굴기가 고장인가요?",
        answer:
          "그렇게 결론내지 마세요. 입력이 거부되면 본인의 완전한 투명 주소를 붙이고, 채굴기는 열지 않아도 됩니다. 계정은 열리는데 그 이름이 없으면 풀 계정 페이지와 채굴기 Worker 또는 RIG 설정을 대조합니다. 불일치를 확인하고 고친 뒤에는 그 소프트웨어 방식으로 적용하거나 다시 불러오고, 요구할 때만 재시작합니다. 이름이 있고 오프라인이면 표시만으로 재시작을 결정하지 말고, 주소, 채굴기, 마지막 지분, 네트워크, 프로세스와 제출 여부를 먼저 대조합니다.",
      },
      {
        question: "이름이 t 주소 전체인 이유는?",
        answer:
          "도움말은 적힌 ASIC의 Worker 칸을 지갑 주소로 둡니다. 풀이 보고하는 이름은 그 투명 주소일 수 있고 로컬 별명이 아닐 수 있습니다.",
      },
      {
        question: "Worker 다섯이 장치 다섯 자리를 쓰나요?",
        answer:
          "자동으로는 쓰지 않습니다. 저장 장치 하나의 지갑 아래에 있고 잔액은 한 번만 보입니다. 각각 독립 장치로 저장할 때만 자리를 씁니다.",
      },
    ],
    ja: [
      {
        question: "一覧が空なら採掘機は故障ですか？",
        answer:
          "その結論にはなりません。入力が拒否されたら自分の完全な透明アドレスを貼り、採掘機は開けなくてよいです。口座は開くのにその名前が無ければ、プールの口座ページと採掘機の Worker または RIG 設定を照合します。不一致を確認して直したあと、そのソフトの手順で適用または再読み込みし、求めるときだけ再起動します。名前がありオフラインなら、表示だけでは再起動の理由にならず、先にアドレス、リグ、最終シェア、ネットワーク、プロセスと提出の有無を照合します。",
      },
      {
        question: "名前が t アドレス全体なのはなぜですか？",
        answer:
          "ヘルプは挙げる ASIC の Worker 欄をウォレットアドレスにします。プールが報告する名前は、その透明アドレスであり、手元の通称ではないことがあります。",
      },
      {
        question: "Worker が五人だと端末枠を五つ使いますか？",
        answer:
          "自動では使いません。保存端末一つのウォレットの下にあり、残高は一度だけ表示されます。それぞれを独立した端末として保存したときだけ枠を使います。",
      },
    ],
  },
};

export const zecDepthGuides: Article[] = [monitor, addresses, solutions, rewards, missingWorker];
