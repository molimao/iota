import type { Article } from "../articles";
type Locale = keyof Article["title"];

function L(zh: string, zhTW: string, en: string, ko: string, ja: string): Record<Locale, string> {
  return { zh, "zh-TW": zhTW, en, ko, ja };
}
function qa(
  zh: [string, string],
  zhTW: [string, string],
  en: [string, string],
  ko: [string, string],
  ja: [string, string],
): Record<Locale, Array<{ question: string; answer: string }>> {
  return {
    zh: [{ question: zh[0], answer: zh[1] }],
    "zh-TW": [{ question: zhTW[0], answer: zhTW[1] }],
    en: [{ question: en[0], answer: en[1] }],
    ko: [{ question: ko[0], answer: ko[1] }],
    ja: [{ question: ja[0], answer: ja[1] }],
  };
}
function mergeQa(
  parts: Array<Record<Locale, Array<{ question: string; answer: string }>>>,
): Record<Locale, Array<{ question: string; answer: string }>> {
  const locales: Locale[] = ["zh", "zh-TW", "en", "ko", "ja"];
  return Object.fromEntries(
    locales.map((locale) => [locale, parts.flatMap((part) => part[locale])]),
  ) as Record<Locale, Array<{ question: string; answer: string }>>;
}
const sources = [
  { name: "2Miners · RVN help", url: "https://rvn.2miners.com/help" },
  { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
  { name: "Ravencoin", url: "https://ravencoin.org/" },
];
const pack = [
  "rvn-mining-monitor-guide",
  "rvn-wallet-and-worker-format",
  "rvn-kawpow-effective-hashrate",
  "rvn-rewards-confirmations-payouts",
  "rvn-worker-offline-rejected-shares",
];

const monitor: Article = {
  slug: "rvn-mining-monitor-guide",
  modified: "2026-10-24",
  project: "rvn",
  sources,
  related: [
    "rvn-wallet-and-worker-format",
    "rvn-rewards-confirmations-payouts",
    "rvn-worker-offline-rejected-shares",
  ],
  topic: L("监控怎么读", "監控怎麼讀", "How to read it", "화면을 읽는 법", "画面の読み方"),
  title: L(
    "RVN 的 KawPoW 监控为什么钱包和 Worker 要分开？",
    "RVN 的 KawPoW 監控為什麼錢包和 Worker 要分開？",
    "Why the RVN KawPoW monitor separates wallet and Worker",
    "RVN KawPoW 모니터는 왜 지갑과 Worker를 나누나",
    "RVN の KawPoW 監視はなぜウォレットと Worker を分けるか",
  ),
  description: L(
    "2Miners 上的 RVN 地址只记一份未支付、已支付和 24 小时收益。Worker 是这只钱包下的矿机名，不是第二份收入。",
    "2Miners 上的 RVN 地址只記一份未支付、已支付和 24 小時收益。Worker 是這只錢包下的礦機名，不是第二份收入。",
    "One RVN address on 2Miners has one unpaid balance, one paid total, and one 24-hour reward. A Worker is a rig name under that wallet, not a second income.",
    "2Miners의 RVN 주소는 미지급, 지급 완료, 24시간 수익을 한 번씩만 갖습니다. Worker는 그 지갑 아래의 장비 이름입니다.",
    "2Miners の RVN アドレスは未払い、支払済み、24時間報酬を一つずつ持ちます。Worker はそのウォレット配下のリグ名です。",
  ),
  summary: L(
    "先读地址上的三笔金额，再读每台 Worker 的算力和在线状态。金额不要按 Worker 相加。缺数保持未知，不当成 0。",
    "先讀地址上的三筆金額，再讀每台 Worker 的算力和在線狀態。金額不要按 Worker 相加。缺數保持未知，不當成 0。",
    "Read the three wallet amounts first, then each Worker's hashrate and online flag. Do not add the wallet amounts once per Worker. A missing figure stays unknown.",
    "주소의 세 금액부터 읽고, 그다음 Worker별 해시레이트와 온라인을 봅니다. 금액을 Worker 수만큼 더하지 마세요. 빈 값은 알 수 없음입니다.",
    "先にアドレスの三つの金額を読み、次に Worker ごとのハッシュレートとオンラインを見ます。金額を Worker の台数分足さないでください。欠損は不明のままです。",
  ),
  comparisonTitle: L(
    "同一地址上哪些数可以相加",
    "同一地址上哪些數可以相加",
    "What you may add on one address",
    "한 주소에서 더해도 되는 값",
    "同一アドレスで足してよい値",
  ),
  comparison: {
    zh: {
      headers: ["你看到的", "属于", "怎么用"],
      rows: [
        ["未支付余额", "这只钱包", "只计一次"],
        ["累计已支付", "这只钱包", "历史付出，不是今天新挖到的"],
        ["滚动 24 小时收益", "这只钱包", "矿池给出的 24 小时数字，不与余额相加当总资产"],
        ["地址当前算力", "这只钱包", "矿池报告的当前算力，不是本机实测"],
        ["Worker 算力 / 离线", "这一台矿机名", "只描述这一行，不复制钱包金额"],
      ],
    },
    "zh-TW": {
      headers: ["你看到的", "屬於", "怎麼用"],
      rows: [
        ["未支付餘額", "這只錢包", "只計一次"],
        ["累計已支付", "這只錢包", "歷史付出，不是今天新挖到的"],
        ["滾動 24 小時收益", "這只錢包", "礦池給出的 24 小時數字，不與餘額相加當總資產"],
        ["地址當前算力", "這只錢包", "礦池報告的當前算力，不是本機實測"],
        ["Worker 算力 / 離線", "這一台礦機名", "只描述這一列，不複製錢包金額"],
      ],
    },
    en: {
      headers: ["Line", "Belongs to", "How to use it"],
      rows: [
        ["Unpaid balance", "This wallet", "Count once"],
        ["Cumulative paid", "This wallet", "Historical paid, not coins mined today"],
        [
          "Rolling 24-hour reward",
          "This wallet",
          "The pool's 24-hour figure. Do not add it to balance as total wealth",
        ],
        [
          "Address current hashrate",
          "This wallet",
          "Reported by the pool, not measured on your machine",
        ],
        [
          "Worker hashrate / offline",
          "That rig name",
          "Describes that row only. Does not copy the wallet amounts",
        ],
      ],
    },
    ko: {
      headers: ["보이는 줄", "속한 곳", "읽는 법"],
      rows: [
        ["미지급 잔액", "이 지갑", "한 번만 계산"],
        ["누적 지급", "이 지갑", "지금까지 지급된 누계. 오늘 새로 캔 코인 아님"],
        ["롤링 24시간 수익", "이 지갑", "풀이 준 24시간 숫자. 잔액과 더해 총자산으로 보지 않음"],
        ["주소 현재 해시레이트", "이 지갑", "풀이 보고한 현재 값. 기기 실측 아님"],
        ["Worker 해시레이트 / 오프라인", "그 장비 이름", "그 행만 설명. 지갑 금액을 복사하지 않음"],
      ],
    },
    ja: {
      headers: ["表示", "帰属", "読み方"],
      rows: [
        ["未払い残高", "このウォレット", "一度だけ数える"],
        ["累計支払済み", "このウォレット", "過去の支払累計。今日新規に掘った分ではない"],
        ["直近24時間報酬", "このウォレット", "プールの24時間の数字。残高と足して総資産にしない"],
        ["アドレスの現在ハッシュレート", "このウォレット", "プール報告。端末の実測ではない"],
        [
          "Worker のハッシュレート / オフライン",
          "そのリグ名",
          "その行だけ。ウォレット金額は複製しない",
        ],
      ],
    },
  },
  body: {
    zh: [
      "打开 [RVN 监控](/projects/rvn)，贴的是 Ravencoin 收款地址，不是矿机名。2Miners 的 RVN 帮助要求算法用 KawPoW，挖矿软件里写成「钱包地址.矿机名」。账户接口把未支付、已支付、24 小时收益和当前算力记在这只地址上，Worker 只是地址下面的名字。",
      "## 这些字段各是什么",
      "未支付余额是矿池账上还没付出去的数。累计已支付是矿池账本记成已经付出的累计，不是今天新产生的币，也不是官方 Ravencoin 钱包里的实时余额。滚动 24 小时收益是矿池给这只地址的 24 小时数字，周期是滚动 24 小时，不要和余额加在一起当成总资产。地址当前算力是矿池报告的当前值。每一行 Worker 有自己的算力；离线是矿池给出的离线标记；最后心跳有时间戳时才显示。某一行是空的，就是未知，不是 0。页面按 1 RVN = 100,000,000 个矿池整数单位换算金额。",
      "## 先看哪里",
      "先对地址，再对 Worker。同一只钱包存成多条设备记录时，金额仍然只算一份，不会变成两份收入。同一条已保存设备上绑定多个来源，也不额外占用名额。免费每个项目 5 台已保存设备，Pro 是 50 台。只是在一只钱包下面把 Worker 列出来，不会自动占掉这些名额；如果你为每台 Worker 单独新建已保存设备，那些记录会计入名额。",
      "## 接下来怎么分支",
      "- 地址算力还在、某一行 Worker 显示离线：先看那一行的心跳，金额仍读地址那一笔。见 [Worker 离线和拒绝份额](/learn/rvn-worker-offline-rejected-shares)。",
      "- 余额、已支付和 24 小时收益对不上「到账了没有」：这三笔都不是链上钱包余额，份额也不是已确认付款。见 [收益、确认和支付](/learn/rvn-rewards-confirmations-payouts)。",
      "- 软件里的用户名写错：先核对地址和矿机名的写法。见 [钱包和 Worker 格式](/learn/rvn-wallet-and-worker-format)。",
      "## 举例",
      "下面是说明用的数字。地址 R 开头的示例钱包显示未支付 120 RVN、累计已支付 800 RVN、滚动 24 小时收益 15 RVN，地址当前算力由矿池给出。下面两行 Worker 分别是 rig-a 与 rig-b。正确读法是钱包仍只有 120 未支付和 800 已支付。把 120 乘以 2 当成两台机器各有 120，是错误分支。15 也不要加进 120 里当成「手里有 135」。官方钱包里有多少 RVN，这一页不显示。",
      "## 下一步和边界",
      "下一步只在 [RVN 监控](/projects/rvn) 粘贴完整收款地址并核对上表。Ravencoin 官网写明区块奖励 5,000 RVN、算法是 KAWPOW；那是网络设计，不是你在矿池的未支付余额。2Miners 帮助写明份额难度不影响矿工收益，也写明 RVN 支付费用为 0 美元，这是矿池对支付币种的说法，不是确认次数。本页不能开关矿机，不能把算力换算成法币，也不承诺到账时间。",
    ],
    "zh-TW": [
      "打開 [RVN 監控](/projects/rvn)，貼的是 Ravencoin 收款地址，不是礦機名。2Miners 的 RVN 幫助要求演算法用 KawPoW，挖礦軟體裡寫成「錢包地址.礦機名」。帳戶介面把未支付、已支付、24 小時收益和當前算力記在這只地址上，Worker 只是地址下面的名字。",
      "## 這些欄位各是什麼",
      "未支付餘額是礦池帳上還沒付出去的數。累計已支付是礦池帳本記成已經付出的累計，不是今天新產生的幣，也不是官方 Ravencoin 錢包裡的即時餘額。滾動 24 小時收益是礦池給這只地址的 24 小時數字，週期是滾動 24 小時，不要和餘額加在一起當成總資產。地址當前算力是礦池報告的當前值。每一列 Worker 有自己的算力；離線是礦池給出的離線標記；最後心跳有時間戳時才顯示。某一列是空的，就是未知，不是 0。頁面按 1 RVN = 100,000,000 個礦池整數單位換算金額。",
      "## 先看哪裡",
      "先對地址，再對 Worker。同一只錢包存成多條裝置記錄時，金額仍然只算一份，不會變成兩份收入。同一條已儲存裝置上綁定多個來源，也不額外占用名額。免費每個專案 5 台已儲存裝置，Pro 是 50 台。只是在一只錢包下面把 Worker 列出來，不會自動占掉這些名額；如果你為每台 Worker 單獨新建已儲存裝置，那些記錄會計入名額。",
      "## 接下來怎麼分支",
      "- 地址算力還在、某一列 Worker 顯示離線：先看那一列的心跳，金額仍讀地址那一筆。見 [Worker 離線和拒絕份額](/learn/rvn-worker-offline-rejected-shares)。",
      "- 餘額、已支付和 24 小時收益對不上「到帳了沒有」：這三筆都不是鏈上錢包餘額，份額也不是已確認付款。見 [收益、確認和支付](/learn/rvn-rewards-confirmations-payouts)。",
      "- 軟體裡的使用者名稱寫錯：先核對地址和礦機名的寫法。見 [錢包和 Worker 格式](/learn/rvn-wallet-and-worker-format)。",
      "## 舉例",
      "下面是說明用的數字。地址 R 開頭的示例錢包顯示未支付 120 RVN、累計已支付 800 RVN、滾動 24 小時收益 15 RVN，地址當前算力由礦池給出。下面兩列 Worker 分別是 rig-a 與 rig-b。正確讀法是錢包仍只有 120 未支付和 800 已支付。把 120 乘以 2 當成兩台機器各有 120，是錯誤分支。15 也不要加進 120 裡當成「手裡有 135」。官方錢包裡有多少 RVN，這一頁不顯示。",
      "## 下一步和邊界",
      "下一步只在 [RVN 監控](/projects/rvn) 貼上完整收款地址並核對上表。Ravencoin 官網寫明區塊獎勵 5,000 RVN、演算法是 KAWPOW；那是網路設計，不是你在礦池的未支付餘額。2Miners 幫助寫明份額難度不影響礦工收益，也寫明 RVN 支付費用為 0 美元，這是礦池對支付幣種的說法，不是確認次數。本頁不能開關礦機，不能把算力換算成法幣，也不承諾到帳時間。",
    ],
    en: [
      "Open [RVN monitoring](/projects/rvn) and paste a Ravencoin payout address, not a rig name. The 2Miners RVN help page says to mine with KawPoW and to set the miner user as wallet address, then a dot, then the rig name. The account record keeps unpaid balance, cumulative paid, the 24-hour reward, and current hashrate on that address. A Worker is only a name under the address.",
      "## What the fields mean",
      "Unpaid balance is what the pool ledger still has not sent. Cumulative paid is what that ledger records as already sent. It is not coins mined today, and it is not the live balance of the official Ravencoin wallet. The rolling 24-hour reward is the pool's figure for this address over a rolling 24 hours. Do not add it to the balance and call the sum your holdings. Address current hashrate is the pool's current report. Each Worker row has its own hashrate. Offline is the pool's offline flag. Last seen appears when the pool sends a timestamp. A blank line is unknown, not zero. Amounts are shown in RVN, with 1 RVN equal to 100,000,000 integer units from the pool.",
      "## What to inspect",
      "Match the address first, then the Worker. Saving the same wallet on more than one device record still counts the money once. It does not create a second income. Extra sources on the same saved device do not add a slot. Free includes five saved devices per project, and Pro includes 50. Listing the workers under one wallet does not by itself use those slots. Creating a separate saved device for a worker does use a slot.",
      "## Which branch to take",
      "- Address hashrate is present and one Worker is offline: read that row's last seen, and keep the amounts on the address. See [Worker offline and rejected shares](/learn/rvn-worker-offline-rejected-shares).",
      "- Balance, paid, and the 24-hour reward do not answer whether coins arrived in the chain wallet. Shares are not confirmed payments. See [rewards, confirmations, and payouts](/learn/rvn-rewards-confirmations-payouts).",
      "- The miner username looks wrong: check the address and rig-name format. See [wallet and Worker format](/learn/rvn-wallet-and-worker-format).",
      "## Example",
      "These numbers are illustrative. A sample address shows unpaid 120 RVN, cumulative paid 800 RVN, and a rolling 24-hour reward of 15 RVN, with a current hashrate supplied by the pool. Two Worker rows are rig-a and rig-b. The wallet still has 120 unpaid and 800 paid. Multiplying 120 by two, as if each machine held 120, is the wrong branch. Do not add 15 to 120 and call that 135 in hand. How many RVN sit in the official wallet is not on this page.",
      "## Next step and limits",
      "Next, paste the full payout address on [RVN monitoring](/projects/rvn) and check the table above. Ravencoin's site describes a 5,000 RVN block reward and the KAWPOW algorithm. That is network design, not your unpaid pool balance. 2Miners help says share difficulty does not affect miner rewards, and that an RVN payout fee is $0. That is the pool's statement about payout currency, not a confirmation count. This page cannot start or stop a miner, cannot turn hashrate into fiat, and does not promise a payout time.",
    ],
    ko: [
      "[RVN 모니터](/projects/rvn)에는 리그 이름이 아니라 Ravencoin 지급 주소를 붙입니다. 2Miners RVN 도움말은 알고리듬을 KawPoW로 두고, 채굴 사용자 칸을 지갑 주소, 점, 리그 이름 순으로 쓰라고 합니다. 계정 기록의 미지급, 누적 지급, 24시간 수익, 현재 해시레이트는 그 주소에 있습니다. Worker는 주소 아래의 이름입니다.",
      "## 각 항목의 뜻",
      "미지급 잔액은 풀 장부가 아직 보내지 않은 금액입니다. 누적 지급은 장부가 이미 보냈다고 적은 누계입니다. 오늘 새로 캔 코인도 아니고, 공식 Ravencoin 지갑의 실시간 잔액도 아닙니다. 롤링 24시간 수익은 이 주소에 대한 풀의 24시간 숫자입니다. 잔액과 더해 보유액으로 부르지 마세요. 주소 현재 해시레이트는 풀이 보고한 현재 값입니다. Worker 행마다 해시레이트가 있고, 오프라인은 풀의 오프라인 표시입니다. 풀이 시각을 주면 마지막 통신이 보입니다. 빈 줄은 알 수 없음이며 0이 아닙니다. 금액은 RVN으로 보이며 1 RVN은 풀의 정수 단위 100,000,000입니다.",
      "## 무엇을 대조하나",
      "주소부터 맞추고 그다음 Worker를 봅니다. 같은 지갑을 장치 기록 여러 개로 저장해도 금액은 한 번입니다. 수입이 두 배가 되지 않습니다. 같은 저장 장치에 출처를 더 묶어도 슬롯은 늘지 않습니다. 무료는 프로젝트당 저장 장치 5대, Pro는 50대입니다. 지갑 아래에 Worker를 보여주는 것만으로 슬롯을 쓰지 않습니다. Worker마다 저장 장치를 새로 만들면 그 기록은 슬롯을 씁니다.",
      "## 다음에 갈 분기",
      "- 주소 해시레이트는 있는데 Worker 한 줄이 오프라인이면 그 줄의 마지막 통신을 보고, 금액은 주소에서 읽습니다. [Worker 오프라인과 거부 셰어](/learn/rvn-worker-offline-rejected-shares)를 보세요.",
      "- 잔액, 지급, 24시간 수익은 체인 지갑 도착 여부가 아닙니다. 셰어도 확정 지급이 아닙니다. [수익, 컨펌, 지급](/learn/rvn-rewards-confirmations-payouts)을 보세요.",
      "- 채굴 사용자 이름이 이상하면 주소와 리그 이름 형식을 확인합니다. [지갑과 Worker 형식](/learn/rvn-wallet-and-worker-format)을 보세요.",
      "## 예시",
      "아래 숫자는 설명용입니다. 예시 주소에 미지급 120 RVN, 누적 지급 800 RVN, 롤링 24시간 수익 15 RVN이 있고 현재 해시레이트는 풀이 제공합니다. Worker는 rig-a와 rig-b입니다. 지갑은 여전히 미지급 120, 지급 800입니다. 120을 2배로 곱해 기계마다 120이 있다고 보는 분기는 틀립니다. 15를 120에 더해 135를 손에 쥐었다고 말하지 마세요. 공식 지갑의 RVN은 이 화면에 없습니다.",
      "## 다음 단계와 한계",
      "다음은 [RVN 모니터](/projects/rvn)에 전체 지급 주소를 붙이고 위 표를 대조하는 것입니다. Ravencoin 사이트는 블록 보상 5,000 RVN과 KAWPOW를 설명합니다. 이는 네트워크 설계이지 풀 미지급 잔액이 아닙니다. 2Miners 도움말은 셰어 난이도가 채굴 보상에 영향을 주지 않는다고 하고, RVN 지급 수수료가 0달러라고 합니다. 이는 지급 통화에 대한 풀의 설명이지 컨펌 횟수가 아닙니다. 이 화면은 채굴기를 켜거나 끄지 못하고, 해시레이트를 법정화폐로 바꾸지 않으며, 입금 시각을 약속하지 않습니다.",
    ],
    ja: [
      "[RVN モニター](/projects/rvn)に貼るのはリグ名ではなく Ravencoin の受取アドレスです。2Miners の RVN ヘルプはアルゴリズムを KawPoW にし、マイナーのユーザーを「ウォレットアドレス.リグ名」にすると書いています。未払い、累計支払済み、24時間報酬、現在ハッシュレートはアドレス側です。Worker はその下の名前です。",
      "## 各項目の意味",
      "未払い残高はプール台帳がまだ送っていない額です。累計支払済みは台帳が送付済みと記録した累計です。今日新しく掘ったコインでも、公式 Ravencoin ウォレットのリアルタイム残高でもありません。直近24時間報酬は、このアドレスに対するプールの24時間の数字です。残高と足して保有額と呼ばないでください。アドレスの現在ハッシュレートはプールの現在値です。Worker の行ごとにハッシュレートがあり、オフラインはプールのオフライン表示です。タイムスタンプがあるときだけ最終通信が出ます。空欄は不明であり、0ではありません。金額は RVN で、1 RVN はプールの整数単位 100,000,000 です。",
      "## どこを照合するか",
      "先にアドレス、次に Worker です。同じウォレットを複数の端末記録に保存しても金額は一度です。収入は二倍になりません。同じ保存端末に複数のソースを結び付けても枠は増えません。無料はプロジェクトあたり保存端末 5 台、Pro は 50 台です。一つのウォレットの下に Worker を出すだけでは枠を使いません。Worker ごとに保存端末を新規作成すると、その記録は枠を使います。",
      "## 次の分岐",
      "- アドレスのハッシュレートがあり、ある Worker がオフラインなら、その行の最終通信を見て、金額はアドレスで読みます。[Worker のオフラインと拒否シェア](/learn/rvn-worker-offline-rejected-shares)を見てください。",
      "- 残高、支払済み、24時間報酬はチェーン上のウォレット着金ではありません。シェアも確定した支払ではありません。[報酬、承認、支払い](/learn/rvn-rewards-confirmations-payouts)を見てください。",
      "- マイナーのユーザー名がおかしければ、アドレスとリグ名の形式を確認します。[ウォレットと Worker の形式](/learn/rvn-wallet-and-worker-format)を見てください。",
      "## 例",
      "次の数字は説明用です。例のアドレスは未払い 120 RVN、累計支払済み 800 RVN、直近24時間報酬 15 RVN で、現在ハッシュレートはプールが示します。Worker は rig-a と rig-b です。ウォレットは未払い 120、支払済み 800 のままです。120 を 2 倍して各マシンが 120 持つと読む分岐は誤りです。15 を 120 に足して手元 135 とも言わないでください。公式ウォレットの RVN はこの画面にありません。",
      "## 次の操作と限界",
      "次は [RVN モニター](/projects/rvn) に受取アドレス全文を貼り、上の表と照合します。Ravencoin のサイトはブロック報酬 5,000 RVN と KAWPOW を説明しています。これはネットワークの設計であり、プールの未払い残高ではありません。2Miners ヘルプはシェア難度が採掘報酬に影響しないと書き、RVN の支払手数料は 0 ドルだと書いています。これは支払通貨についてのプールの説明であり、承認回数ではありません。この画面はマイナーを開始・停止できず、ハッシュレートを法定通貨に換えず、着金時刻も約束しません。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "Worker 每一行都有一份未支付余额吗？",
        "没有。未支付、已支付和 24 小时收益都在地址上，只算一次。Worker 行只有这台矿机的算力和在线状态。",
      ],
      [
        "Worker 每一列都有一份未支付餘額嗎？",
        "沒有。未支付、已支付和 24 小時收益都在地址上，只算一次。Worker 列只有這台礦機的算力和在線狀態。",
      ],
      [
        "Does every Worker row have its own unpaid balance?",
        "No. Unpaid balance, cumulative paid, and the 24-hour reward sit on the address and count once. A Worker row has that rig's hashrate and online state.",
      ],
      [
        "Worker 행마다 미지급 잔액이 있나요?",
        "없습니다. 미지급, 누적 지급, 24시간 수익은 주소에 있고 한 번만 계산합니다. Worker 행은 그 장비의 해시레이트와 온라인 상태입니다.",
      ],
      [
        "Worker の行ごとに未払い残高がありますか？",
        "ありません。未払い、累計支払済み、24時間報酬はアドレスにあり、一度だけ数えます。Worker の行はそのリグのハッシュレートとオンライン状態です。",
      ],
    ),
    qa(
      [
        "把余额和 24 小时收益加起来就是我的总资产吗？",
        "不是。24 小时收益是矿池的滚动 24 小时数字。未支付仍在矿池账上。累计已支付是历史付出。三者都不是官方钱包的实时余额。",
      ],
      [
        "把餘額和 24 小時收益加起來就是我的總資產嗎？",
        "不是。24 小時收益是礦池的滾動 24 小時數字。未支付仍在礦池帳上。累計已支付是歷史付出。三者都不是官方錢包的即時餘額。",
      ],
      [
        "Is balance plus the 24-hour reward my total holdings?",
        "No. The 24-hour reward is the pool's rolling 24-hour figure. Unpaid is still on the pool ledger. Cumulative paid is historical. None of the three is the live official-wallet balance.",
      ],
      [
        "잔액과 24시간 수익을 더하면 총자산인가요?",
        "아닙니다. 24시간 수익은 풀의 롤링 24시간 숫자입니다. 미지급은 아직 풀 장부입니다. 누적 지급은 과거 지급입니다. 셋 다 공식 지갑의 실시간 잔액이 아닙니다.",
      ],
      [
        "残高と24時間報酬を足せば総資産ですか？",
        "いいえ。24時間報酬はプールの直近24時間の数字です。未払いはまだプール台帳です。累計支払済みは過去の支払です。三つとも公式ウォレットのリアルタイム残高ではありません。",
      ],
    ),
    qa(
      [
        "空的算力是 0 吗？",
        "不是。矿池没有给出可用数字时，这一行保持未知，不要当成停机为 0，也不要当成收入为 0。",
      ],
      [
        "空的算力是 0 嗎？",
        "不是。礦池沒有給出可用數字時，這一列保持未知，不要當成停機為 0，也不要當成收入為 0。",
      ],
      [
        "Does a blank hashrate mean zero?",
        "No. When the pool does not send a usable number, the line stays unknown. Do not read it as a stopped machine at zero, or as zero income.",
      ],
      [
        "빈 해시레이트는 0인가요?",
        "아닙니다. 풀이 쓸 수 있는 숫자를 주지 않으면 그 줄은 알 수 없음입니다. 정지해서 0이거나 수입이 0이라고 읽지 마세요.",
      ],
      [
        "空欄のハッシュレートは 0 ですか？",
        "いいえ。プールが使える数字を出さないとき、その行は不明のままです。停止して 0、または収入 0 と読まないでください。",
      ],
    ),
    qa(
      [
        "列出两台 Worker 会占用两台设备名额吗？",
        "不会。名额按本项目已保存的设备记录计算。一只钱包下面显示出 Worker，不会自动占名额。你若把 Worker 另存成设备记录，那些记录会计入每项目 5 台（Pro 50 台）。",
      ],
      [
        "列出兩台 Worker 會占用兩台裝置名額嗎？",
        "不會。名額按本專案已儲存的裝置記錄計算。一只錢包下面顯示出 Worker，不會自動占名額。你若把 Worker 另存成裝置記錄，那些記錄會計入每專案 5 台（Pro 50 台）。",
      ],
      [
        "Does listing two Workers use two device slots?",
        "No. Slots count saved device records for this project. Showing workers under one wallet does not use a slot by itself. If you save a worker as its own device record, that record counts toward five per project on Free, or 50 on Pro.",
      ],
      [
        "Worker 두 줄을 보여 주면 장치 슬롯 두 개를 쓰나요?",
        "아닙니다. 슬롯은 이 프로젝트의 저장 장치 기록으로 셉니다. 지갑 아래에 Worker를 보여 주는 것만으로는 슬롯을 쓰지 않습니다. Worker를 별도 장치 기록으로 저장하면 무료는 프로젝트당 5대, Pro는 50대에 포함됩니다.",
      ],
      [
        "Worker を二行出すと端末枠を二つ使いますか？",
        "いいえ。枠はこのプロジェクトの保存端末記録で数えます。一つのウォレットの下に Worker を出すだけでは枠を使いません。Worker を別の端末記録として保存すると、無料はプロジェクトあたり 5 台、Pro は 50 台に数えます。",
      ],
    ),
    qa(
      [
        "Ravencoin 官网的 5,000 RVN 区块奖励就是我的未支付余额吗？",
        "不是。那是官网对网络出块奖励的说明。未支付余额来自 2Miners 这只地址的矿池账，两者不是同一个数。",
      ],
      [
        "Ravencoin 官網的 5,000 RVN 區塊獎勵就是我的未支付餘額嗎？",
        "不是。那是官網對網路出塊獎勵的說明。未支付餘額來自 2Miners 這只地址的礦池帳，兩者不是同一個數。",
      ],
      [
        "Is Ravencoin's 5,000 RVN block reward my unpaid balance?",
        "No. That figure is the site's description of the network block reward. Unpaid balance is the pool ledger for this address on 2Miners. They are not the same number.",
      ],
      [
        "Ravencoin 사이트의 5,000 RVN 블록 보상이 내 미지급 잔액인가요?",
        "아닙니다. 그 숫자는 네트워크 블록 보상에 대한 사이트 설명입니다. 미지급 잔액은 2Miners에서 이 주소의 풀 장부이며, 같은 숫자가 아닙니다.",
      ],
      [
        "Ravencoin サイトの 5,000 RVN ブロック報酬が未払い残高ですか？",
        "いいえ。それはネットワークのブロック報酬についてのサイトの説明です。未払い残高は 2Miners におけるこのアドレスのプール台帳で、同じ数字ではありません。",
      ],
    ),
    qa(
      [
        "这一页能看到链上钱包到账吗？",
        "不能。这里只有矿池账户接口给出的余额、已支付和 24 小时收益。官方 Ravencoin 钱包里的币要在那个钱包里看。",
      ],
      [
        "這一頁能看到鏈上錢包到帳嗎？",
        "不能。這裡只有礦池帳戶介面給出的餘額、已支付和 24 小時收益。官方 Ravencoin 錢包裡的幣要在那個錢包裡看。",
      ],
      [
        "Can this page show coins arriving in the chain wallet?",
        "No. It shows the balance, paid total, and 24-hour reward from the pool account. Coins in the official Ravencoin wallet are read in that wallet.",
      ],
      [
        "이 화면에서 체인 지갑 입금을 볼 수 있나요?",
        "없습니다. 여기에는 풀 계정의 잔액, 지급 누계, 24시간 수익만 있습니다. 공식 Ravencoin 지갑의 코인은 그 지갑에서 확인합니다.",
      ],
      [
        "この画面でチェーン上のウォレット着金は見えますか？",
        "見えません。プール口座の残高、支払済み、24時間報酬だけです。公式 Ravencoin ウォレットのコインはそのウォレットで確認します。",
      ],
    ),
  ]),
};

const walletFormat: Article = {
  slug: "rvn-wallet-and-worker-format",
  published: "2026-10-24",
  modified: "2026-10-24",
  project: "rvn",
  sources,
  related: ["rvn-mining-monitor-guide", "rvn-worker-offline-rejected-shares"],
  topic: L(
    "地址和矿机名",
    "地址和礦機名",
    "Address and rig name",
    "주소와 리그 이름",
    "アドレスとリグ名",
  ),
  title: L(
    "RVN 监控接受什么样的钱包地址和 Worker 名？",
    "RVN 監控接受什麼樣的錢包地址和 Worker 名？",
    "Which RVN wallet address and Worker name this monitor accepts",
    "이 RVN 모니터가 받는 지갑 주소와 Worker 이름",
    "この RVN モニターが受け付けるウォレットアドレスと Worker 名",
  ),
  description: L(
    "本页只接受 R 开头的 Ravencoin 地址。矿机名写在地址后面，用点分开。BTC 或 TON 收款地址不能在这张 RVN 页查询。",
    "本頁只接受 R 開頭的 Ravencoin 地址。礦機名寫在地址後面，用點分開。BTC 或 TON 收款地址不能在這張 RVN 頁查詢。",
    "This page accepts a Ravencoin address that starts with R. The rig name goes after the address, separated by a dot. A BTC or TON payout address cannot be looked up here.",
    "이 화면은 R로 시작하는 Ravencoin 주소만 받습니다. 리그 이름은 주소 뒤에 점으로 붙입니다. BTC나 TON 지급 주소는 여기서 조회할 수 없습니다.",
    "この画面は R で始まる Ravencoin アドレスだけを受け付けます。リグ名はアドレスの後にドットで続けます。BTC や TON の受取アドレスはここでは照会できません。",
  ),
  summary: L(
    "查询框只放收款地址。矿机名是挖矿软件里的 RIG_ID，用来在统计页区分机器，不是另一只钱包。",
    "查詢框只放收款地址。礦機名是挖礦軟體裡的 RIG_ID，用來在統計頁區分機器，不是另一只錢包。",
    "The lookup box takes the payout address only. The rig name is the RIG_ID in mining software. It labels a machine on the stats page. It is not another wallet.",
    "조회 칸에는 지급 주소만 넣습니다. 리그 이름은 채굴 소프트웨어의 RIG_ID이며, 통계에서 기계를 구분할 뿐 다른 지갑이 아닙니다.",
    "照会欄には受取アドレスだけを入れます。リグ名は採掘ソフトの RIG_ID で、統計上の機械のラベルであり、別のウォレットではありません。",
  ),
  comparisonTitle: L(
    "地址和矿机名各放哪里",
    "地址和礦機名各放哪裡",
    "Where the address and the rig name go",
    "주소와 리그 이름을 넣는 곳",
    "アドレスとリグ名を置く場所",
  ),
  comparison: {
    zh: {
      headers: ["片段", "放在哪", "本页怎么处理"],
      rows: [
        ["R 开头的 RVN 地址", "查询框，以及挖矿用户名里点号之前", "符合长度和字符才查询"],
        ["RIG_ID / Worker", "点号之后，可留空", "显示矿池返回的名字，不把它当成余额"],
        ["BTC 或 TON 地址", "2Miners 允许用来收那些币", "这张 RVN 页不接受"],
        ["带空格或写成网址", "都不要粘贴", "不会当作地址去查"],
      ],
    },
    "zh-TW": {
      headers: ["片段", "放在哪", "本頁怎麼處理"],
      rows: [
        ["R 開頭的 RVN 地址", "查詢框，以及挖礦使用者名稱裡點號之前", "符合長度和字元才查詢"],
        ["RIG_ID / Worker", "點號之後，可留空", "顯示礦池返回的名字，不把它當成餘額"],
        ["BTC 或 TON 地址", "2Miners 允許用來收那些幣", "這張 RVN 頁不接受"],
        ["帶空格或寫成網址", "都不要貼上", "不會當作地址去查"],
      ],
    },
    en: {
      headers: ["Piece", "Where it goes", "What this page does"],
      rows: [
        [
          "RVN address starting with R",
          "Lookup box, and before the dot in the miner user",
          "Looked up only when length and characters match",
        ],
        [
          "RIG_ID / Worker",
          "After the dot; may be left empty",
          "Shows the name the pool returns. Not a balance",
        ],
        [
          "BTC or TON address",
          "2Miners allows those as payout coins",
          "Not accepted on this RVN page",
        ],
        ["Spaces or a URL", "Do not paste them", "Not treated as an address"],
      ],
    },
    ko: {
      headers: ["조각", "넣는 곳", "이 화면의 처리"],
      rows: [
        [
          "R로 시작하는 RVN 주소",
          "조회 칸, 그리고 채굴 사용자명의 점 앞",
          "길이와 문자가 맞을 때만 조회",
        ],
        ["RIG_ID / Worker", "점 뒤. 비워도 됨", "풀이 돌려준 이름을 표시. 잔액이 아님"],
        ["BTC 또는 TON 주소", "2Miners는 그 코인으로 지급 가능", "이 RVN 화면은 받지 않음"],
        ["공백이나 URL", "붙이지 않음", "주소로 조회하지 않음"],
      ],
    },
    ja: {
      headers: ["部分", "置く場所", "この画面の扱い"],
      rows: [
        [
          "R で始まる RVN アドレス",
          "照会欄、およびマイナーユーザーのドット前",
          "長さと文字が合うときだけ照会",
        ],
        ["RIG_ID / Worker", "ドットの後。空でもよい", "プールが返した名前を表示。残高ではない"],
        [
          "BTC または TON アドレス",
          "2Miners はそれらの通貨での支払いを案内",
          "この RVN 画面では受け付けない",
        ],
        ["空白や URL", "貼らない", "アドレスとしては照会しない"],
      ],
    },
  },
  body: {
    zh: [
      "挖矿软件里的用户名通常是「收款地址.矿机名」。[RVN 监控](/projects/rvn) 的查询框只要点号前面的 Ravencoin 地址。矿机名用来在 2Miners 统计里区分机器，帮助页称之为 RIG_ID，可以留空。",
      "## 字段分别指什么",
      "帮助页给出的 RVN 示例地址以 R 开头。本页接受的地址也以 R 开头，后面是 33 个不含 0、O、I、l 的字符，整段 34 个字符，且首尾不能有空格。2Miners 写明 RIG_ID 最长 32 个字符，只用英文字母、数字、减号和下划线。矿池返回的 Worker 名会显示在地址下面。帮助页同时允许把收益打到 BTC 或 TON 地址；那是另一种收款币，不能粘进这张 RVN 页。",
      "## 要核对什么",
      "先看用户名里点号前面是不是这只 RVN 地址，点号后面是不是你想在统计里看到的矿机名。矿机名留空时，帮助页说这个字段不是必填。地址写成交易所的 BTC 充值地址，或 TON 的 UQ 开头地址，这张页不会把它当成 RVN 账户。",
      "## 分支",
      "- 查询没有结果：先确认粘贴的是 R 开头的 RVN 地址，而不是「地址.矿机名」整串，也不是 BTC、TON。",
      "- Worker 列得出来但名字不像你的矿机：回到挖矿软件改 RIG_ID，再等矿池统计更新。金额怎么读仍以地址为准，见 [钱包和 Worker 为什么分开](/learn/rvn-mining-monitor-guide)。",
      "- 某一行离线：见 [离线和拒绝份额](/learn/rvn-worker-offline-rejected-shares)。",
      "## 举例",
      "说明用例子，不是实测。帮助页的 RVN 示例是 RHUC17zAVjNqXDtkqwLPRvQ2XgoRZsXeeG。挖矿用户名可以写成这串地址加 `.rig-1`。查询框只粘贴地址那一段。`rig-1` 出现在 Worker 列表里，不产生第二份未支付余额。若把整段 `地址.rig-1` 粘进查询框，它不是本页要的地址。",
      "## 下一步和边界",
      "下一步在 [RVN 监控](/projects/rvn) 只粘贴 RVN 地址。本页不替你生成钱包，也不核验你在交易所或 Trust Wallet、官方 Ravencoin 钱包里的余额。官网公告钱包 4.7.0，那是钱包版本公告，不是矿池地址规则。Ravencoin 官网把 KAWPOW 写成网络算法，2Miners 帮助要求挖 RVN 时选用 KawPoW。",
    ],
    "zh-TW": [
      "挖礦軟體裡的使用者名稱通常是「收款地址.礦機名」。[RVN 監控](/projects/rvn) 的查詢框只要點號前面的 Ravencoin 地址。礦機名用來在 2Miners 統計裡區分機器，幫助頁稱之為 RIG_ID，可以留空。",
      "## 欄位分別指什麼",
      "幫助頁給出的 RVN 示例地址以 R 開頭。本頁接受的地址也以 R 開頭，後面是 33 個不含 0、O、I、l 的字元，整段 34 個字元，且首尾不能有空格。2Miners 寫明 RIG_ID 最長 32 個字元，只用英文字母、數字、減號和底線。礦池返回的 Worker 名會顯示在地址下面。幫助頁同時允許把收益打到 BTC 或 TON 地址；那是另一種收款幣，不能貼進這張 RVN 頁。",
      "## 要核對什麼",
      "先看使用者名稱裡點號前面是不是這只 RVN 地址，點號後面是不是你想在統計裡看到的礦機名。礦機名留空時，幫助頁說這個欄位不是必填。地址寫成交易所的 BTC 充值地址，或 TON 的 UQ 開頭地址，這張頁不會把它當成 RVN 帳戶。",
      "## 分支",
      "- 查詢沒有結果：先確認貼上的是 R 開頭的 RVN 地址，而不是「地址.礦機名」整串，也不是 BTC、TON。",
      "- Worker 列得出來但名字不像你的礦機：回到挖礦軟體改 RIG_ID，再等礦池統計更新。金額怎麼讀仍以地址為準，見 [錢包和 Worker 為什麼分開](/learn/rvn-mining-monitor-guide)。",
      "- 某一列離線：見 [離線和拒絕份額](/learn/rvn-worker-offline-rejected-shares)。",
      "## 舉例",
      "說明用例子，不是實測。幫助頁的 RVN 示例是 RHUC17zAVjNqXDtkqwLPRvQ2XgoRZsXeeG。挖礦使用者名稱可以寫成這串地址加 `.rig-1`。查詢框只貼上地址那一段。`rig-1` 出現在 Worker 列表裡，不產生第二份未支付餘額。若把整段 `地址.rig-1` 貼進查詢框，它不是本頁要的地址。",
      "## 下一步和邊界",
      "下一步在 [RVN 監控](/projects/rvn) 只貼上 RVN 地址。本頁不替你產生錢包，也不核驗你在交易所或 Trust Wallet、官方 Ravencoin 錢包裡的餘額。官網公告錢包 4.7.0，那是錢包版本公告，不是礦池地址規則。Ravencoin 官網把 KAWPOW 寫成網路演算法，2Miners 幫助要求挖 RVN 時選用 KawPoW。",
    ],
    en: [
      "Mining software usually sets the user to the payout address, a dot, then the rig name. The lookup box on [RVN monitoring](/projects/rvn) wants only the Ravencoin address before the dot. The rig name separates machines on the 2Miners stats page. The help page calls it RIG_ID, and it may be left empty.",
      "## What each field is",
      "The RVN example on the help page starts with R. This page accepts an address that starts with R, followed by 33 characters that omit 0, O, I, and l: 34 characters in all, with no spaces at either end. 2Miners says RIG_ID is at most 32 characters and uses English letters, digits, hyphen, and underscore. Worker names returned by the pool are listed under the address. The help page also allows payouts to a BTC or TON address. Those are other payout coins. They cannot be pasted into this RVN page.",
      "## What to inspect",
      "Check that the text before the dot is this RVN address, and that the text after the dot is the rig name you expect on the stats page. When the rig name is empty, the help page says the field is not required. An exchange BTC deposit address, or a TON address starting with UQ, is not treated as an RVN account here.",
      "## Branches",
      "- No result: confirm you pasted an RVN address starting with R, not the whole `address.rig` string, and not BTC or TON.",
      "- Workers appear but the name is not your machine: change RIG_ID in the miner and wait for the pool stats to update. Amounts are still read on the address. See [why wallet and Worker are separate](/learn/rvn-mining-monitor-guide).",
      "- One row offline: see [offline and rejected shares](/learn/rvn-worker-offline-rejected-shares).",
      "## Example",
      "Illustrative, not a live lookup. The help page's RVN example is RHUC17zAVjNqXDtkqwLPRvQ2XgoRZsXeeG. The miner user can be that address plus `.rig-1`. Paste only the address into the lookup box. `rig-1` may show in the Worker list and does not create a second unpaid balance. Pasting the whole `address.rig-1` string is not the address this page asks for.",
      "## Next step and limits",
      "Next, paste only the RVN address on [RVN monitoring](/projects/rvn). This page does not create a wallet and does not check a balance at an exchange, Trust Wallet, or the official Ravencoin wallet. The Ravencoin homepage announces wallet 4.7.0. That is a wallet release notice, not a pool address rule. Ravencoin's site names KAWPOW as the network algorithm. 2Miners help says to choose KawPoW for RVN.",
    ],
    ko: [
      "채굴 소프트웨어의 사용자명은 보통 지급 주소, 점, 리그 이름입니다. [RVN 모니터](/projects/rvn) 조회 칸에는 점 앞의 Ravencoin 주소만 넣습니다. 리그 이름은 2Miners 통계에서 기계를 구분합니다. 도움말은 이를 RIG_ID라고 하며 비워도 됩니다.",
      "## 각 항목",
      "도움말의 RVN 예시 주소는 R로 시작합니다. 이 화면도 R로 시작하고 그 뒤에 0, O, I, l을 뺀 문자 33자, 모두 34자이며 앞뒤 공백이 없는 주소만 받습니다. 2Miners는 RIG_ID가 최대 32자이고 영문, 숫자, 하이픈, 밑줄만 쓴다고 합니다. 풀이 돌려준 Worker 이름은 주소 아래에 나옵니다. 도움말은 BTC나 TON 주소로 지급받는 것도 허용합니다. 그것은 다른 지급 코인이며 이 RVN 화면에 붙일 수 없습니다.",
      "## 대조할 것",
      "점 앞이 이 RVN 주소인지, 점 뒤가 통계에 보이길 원하는 리그 이름인지 확인합니다. 리그 이름을 비우면 도움말은 그 칸이 필수가 아니라고 합니다. 거래소 BTC 입금 주소나 UQ로 시작하는 TON 주소는 여기서 RVN 계정으로 보지 않습니다.",
      "## 분기",
      "- 결과가 없으면 R로 시작하는 RVN 주소인지 확인합니다. `주소.리그` 전체나 BTC, TON이 아니어야 합니다.",
      "- Worker는 보이는데 이름이 내 기계가 아니면 채굴기에서 RIG_ID를 바꾸고 풀 통계가 갱신되기를 기다립니다. 금액은 여전히 주소 기준입니다. [지갑과 Worker를 나누는 이유](/learn/rvn-mining-monitor-guide)를 보세요.",
      "- 한 줄이 오프라인이면 [오프라인과 거부 셰어](/learn/rvn-worker-offline-rejected-shares)를 보세요.",
      "## 예시",
      "설명용이며 실제 조회가 아닙니다. 도움말의 RVN 예시는 RHUC17zAVjNqXDtkqwLPRvQ2XgoRZsXeeG입니다. 채굴 사용자명은 그 주소에 `.rig-1`을 붙일 수 있습니다. 조회 칸에는 주소만 붙입니다. `rig-1`이 Worker 목록에 나와도 두 번째 미지급 잔액은 생기지 않습니다. `주소.rig-1` 전체를 조회 칸에 붙이면 이 화면이 원하는 주소가 아닙니다.",
      "## 다음 단계와 한계",
      "다음은 [RVN 모니터](/projects/rvn)에 RVN 주소만 붙이는 것입니다. 이 화면은 지갑을 만들지 않고, 거래소나 Trust Wallet, 공식 Ravencoin 지갑의 잔액도 확인하지 않습니다. Ravencoin 홈은 지갑 4.7.0을 알립니다. 그것은 지갑 버전 공지이지 풀 주소 규칙이 아닙니다. Ravencoin 사이트는 KAWPOW를 네트워크 알고리듬으로 적고, 2Miners 도움말은 RVN에 KawPoW를 고르라고 합니다.",
    ],
    ja: [
      "採掘ソフトのユーザーは通常「受取アドレス.リグ名」です。[RVN モニター](/projects/rvn)の照会欄には、ドットより前の Ravencoin アドレスだけを入れます。リグ名は 2Miners の統計で機械を分けます。ヘルプはこれを RIG_ID と呼び、空でもよいとしています。",
      "## 各項目",
      "ヘルプの RVN 例は R で始まります。この画面が受け付けるのも R で始まり、その後に 0、O、I、l を除いた 33 文字、合計 34 文字で、前後に空白がないアドレスです。2Miners は RIG_ID を最大 32 文字、英字、数字、ハイフン、アンダースコアだけとしています。プールが返した Worker 名はアドレスの下に出ます。ヘルプは BTC や TON のアドレスへの支払いも案内しています。それらは別の支払通貨であり、この RVN 画面には貼れません。",
      "## 照合すること",
      "ドットの前がこの RVN アドレスか、ドットの後が統計で見たいリグ名かを確認します。リグ名を空にする場合、ヘルプはその欄を必須ではないとしています。取引所の BTC 入金アドレスや、UQ で始まる TON アドレスは、ここでは RVN 口座として扱いません。",
      "## 分岐",
      "- 結果がないときは、貼ったものが R で始まる RVN アドレスかを確認します。`アドレス.リグ` 全体でも、BTC や TON でもありません。",
      "- Worker は出るが名前が自分の機械でないときは、採掘ソフトの RIG_ID を変えてプール統計の更新を待ちます。金額は引き続きアドレスで読みます。[ウォレットと Worker を分ける理由](/learn/rvn-mining-monitor-guide)を見てください。",
      "- 一行がオフラインなら [オフラインと拒否シェア](/learn/rvn-worker-offline-rejected-shares)を見てください。",
      "## 例",
      "説明用であり、実照会ではありません。ヘルプの RVN 例は RHUC17zAVjNqXDtkqwLPRvQ2XgoRZsXeeG です。マイナーのユーザーはそのアドレスに `.rig-1` を付けられます。照会欄にはアドレスだけを貼ります。`rig-1` が Worker 一覧に出ても、未払い残高は二つになりません。`アドレス.rig-1` 全体を照会欄に貼ると、この画面が求めるアドレスではありません。",
      "## 次の操作と限界",
      "次は [RVN モニター](/projects/rvn) に RVN アドレスだけを貼ることです。この画面はウォレットを作らず、取引所、Trust Wallet、公式 Ravencoin ウォレットの残高も確認しません。Ravencoin のホームはウォレット 4.7.0 を告知しています。それはウォレットの版の告知であり、プールのアドレス規則ではありません。Ravencoin のサイトは KAWPOW をネットワークのアルゴリズムとし、2Miners ヘルプは RVN で KawPoW を選ぶとしています。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "查询框要粘贴「地址.矿机名」整串吗？",
        "不要。查询框只放 R 开头的 RVN 地址。矿机名留在挖矿软件里，用来让矿池列出 Worker。",
      ],
      [
        "查詢框要貼上「地址.礦機名」整串嗎？",
        "不要。查詢框只放 R 開頭的 RVN 地址。礦機名留在挖礦軟體裡，用來讓礦池列出 Worker。",
      ],
      [
        "Do I paste the whole address.rig string into the lookup box?",
        "No. The lookup box takes the RVN address that starts with R. The rig name stays in the miner so the pool can list a Worker.",
      ],
      [
        "조회 칸에 주소.리그 전체를 붙이나요?",
        "아닙니다. 조회 칸에는 R로 시작하는 RVN 주소만 넣습니다. 리그 이름은 채굴기에 두어 풀이 Worker를 나열하게 합니다.",
      ],
      [
        "照会欄にアドレス.リグ全体を貼りますか？",
        "いいえ。照会欄は R で始まる RVN アドレスだけです。リグ名は採掘ソフト側に置き、プールが Worker を出せるようにします。",
      ],
    ),
    qa(
      [
        "2Miners 说可以打到 BTC，为什么这里不接受 BTC 地址？",
        "帮助页允许用 BTC 或 TON 作为收款币。这张 RVN 页只查询 Ravencoin 地址上的矿池账户，不查询那两种地址。",
      ],
      [
        "2Miners 說可以打到 BTC，為什麼這裡不接受 BTC 地址？",
        "幫助頁允許用 BTC 或 TON 作為收款幣。這張 RVN 頁只查詢 Ravencoin 地址上的礦池帳戶，不查詢那兩種地址。",
      ],
      [
        "2Miners allows BTC payouts. Why is a BTC address rejected here?",
        "The help page allows BTC or TON as the payout coin. This RVN page looks up the pool account for a Ravencoin address only. It does not look up those other addresses.",
      ],
      [
        "2Miners는 BTC 지급을 허용하는데 왜 BTC 주소는 안되나요?",
        "도움말은 BTC나 TON을 지급 코인으로 허용합니다. 이 RVN 화면은 Ravencoin 주소의 풀 계정만 조회하며, 그 두 주소는 조회하지 않습니다.",
      ],
      [
        "2Miners は BTC 支払いを案内しているのに、なぜ BTC アドレスは不可ですか？",
        "ヘルプは BTC や TON を支払通貨として案内しています。この RVN 画面は Ravencoin アドレスのプール口座だけを照会し、それらのアドレスは照会しません。",
      ],
    ),
    qa(
      [
        "RIG_ID 可以空着吗？",
        "可以。2Miners 帮助写明这个字段不是必填。空着不会变成另一只钱包，只是统计里少一个你自定的矿机名。",
      ],
      [
        "RIG_ID 可以空著嗎？",
        "可以。2Miners 幫助寫明這個欄位不是必填。空著不會變成另一只錢包，只是統計裡少一個你自定的礦機名。",
      ],
      [
        "Can RIG_ID be empty?",
        "Yes. 2Miners help says the field is not required. Leaving it empty does not create another wallet. The stats page then has no custom rig name from you.",
      ],
      [
        "RIG_ID는 비워도 되나요?",
        "됩니다. 2Miners 도움말은 그 칸이 필수가 아니라고 합니다. 비워도 다른 지갑이 되지는 않고, 통계에 직접 정한 리그 이름이 없을 뿐입니다.",
      ],
      [
        "RIG_ID は空でよいですか？",
        "よいです。2Miners ヘルプはその欄を必須ではないとしています。空でも別のウォレットにはならず、統計に自分で付けたリグ名が無いだけです。",
      ],
    ),
  ]),
};

const hashrate: Article = {
  slug: "rvn-kawpow-effective-hashrate",
  published: "2026-10-24",
  modified: "2026-10-24",
  project: "rvn",
  sources,
  related: ["rvn-mining-monitor-guide", "rvn-rewards-confirmations-payouts"],
  topic: L(
    "算力怎么读",
    "算力怎麼讀",
    "How to read hashrate",
    "해시레이트 읽기",
    "ハッシュレートの読み方",
  ),
  title: L(
    "RVN 页面上的算力是有效算力吗？份额难度会改收益吗？",
    "RVN 頁面上的算力是有效算力嗎？份額難度會改收益嗎？",
    "Is the RVN hashrate an effective rate, and does share difficulty change rewards?",
    "RVN 화면의 해시레이트는 유효 해시레이트인가, 셰어 난이도는 보상을 바꾸나",
    "RVN 画面のハッシュレートは有効値か。シェア難度は報酬を変えるか",
  ),
  description: L(
    "本页显示矿池给出的地址当前算力和每台 Worker 的算力。它不另算一份有效算力。2Miners 写明份额难度不影响矿工收益。",
    "本頁顯示礦池給出的地址當前算力和每台 Worker 的算力。它不另算一份有效算力。2Miners 寫明份額難度不影響礦工收益。",
    "This page shows the pool's current hashrate for the address and each Worker's hashrate. It does not compute a second effective rate. 2Miners says share difficulty does not affect miner rewards.",
    "이 화면은 풀이 준 주소 현재 해시레이트와 Worker별 해시레이트를 보여 줍니다. 별도의 유효 해시레이트는 계산하지 않습니다. 2Miners는 셰어 난이도가 채굴 보상에 영향을 주지 않는다고 합니다.",
    "この画面はプールが示すアドレスの現在ハッシュレートと Worker ごとの値を出します。別の有効ハッシュレートは計算しません。2Miners はシェア難度が採掘報酬に影響しないとしています。",
  ),
  summary: L(
    "地址算力和 Worker 算力是两层报告。都不是本机实测，也不能换成 RVN。空值是未知。",
    "地址算力和 Worker 算力是兩層報告。都不是本機實測，也不能換成 RVN。空值是未知。",
    "Address hashrate and Worker hashrate are two reports. Neither is a measurement on your machine, and neither converts into RVN. A blank value is unknown.",
    "주소 해시레이트와 Worker 해시레이트는 두 층의 보고입니다. 둘 다 기기 실측이 아니고 RVN으로 바꾸지 않습니다. 빈 값은 알 수 없음입니다.",
    "アドレスのハッシュレートと Worker の値は二層の報告です。どちらも端末の実測ではなく、RVN にも換えません。空欄は不明です。",
  ),
  comparisonTitle: L(
    "算力、份额和收益不要混用",
    "算力、份額和收益不要混用",
    "Do not mix hashrate, shares, and rewards",
    "해시레이트, 셰어, 수익을 섞지 않기",
    "ハッシュレート、シェア、報酬を混ぜない",
  ),
  comparison: {
    zh: {
      headers: ["数字", "来源", "不能当成"],
      rows: [
        ["地址当前算力", "矿池账户上的当前报告", "本机软件里的有效算力，或 RVN 收入"],
        ["Worker 算力", "该矿机名的报告", "整只钱包的未支付余额"],
        ["份额难度", "2Miners 帮助：不影响矿工收益", "调高难度就会多发 RVN"],
        ["份额时间序列", "账户接口另有份额区间", "已确认的钱包付款；本页不显示这条"],
      ],
    },
    "zh-TW": {
      headers: ["數字", "來源", "不能當成"],
      rows: [
        ["地址當前算力", "礦池帳戶上的當前報告", "本機軟體裡的有效算力，或 RVN 收入"],
        ["Worker 算力", "該礦機名的報告", "整只錢包的未支付餘額"],
        ["份額難度", "2Miners 幫助：不影響礦工收益", "調高難度就會多發 RVN"],
        ["份額時間序列", "帳戶介面另有份額區間", "已確認的錢包付款；本頁不顯示這條"],
      ],
    },
    en: {
      headers: ["Figure", "Where it comes from", "Do not treat it as"],
      rows: [
        [
          "Address current hashrate",
          "The pool's current report on the account",
          "An effective rate from your miner, or RVN income",
        ],
        ["Worker hashrate", "The report for that rig name", "The wallet's unpaid balance"],
        [
          "Share difficulty",
          "2Miners help: it does not affect miner rewards",
          "A higher difficulty that pays more RVN",
        ],
        [
          "Share time series",
          "The account API also has share ranges",
          "A confirmed wallet payment. This page does not show that series",
        ],
      ],
    },
    ko: {
      headers: ["숫자", "출처", "이렇게 보지 않음"],
      rows: [
        [
          "주소 현재 해시레이트",
          "계정에 대한 풀의 현재 보고",
          "채굴기 소프트웨어의 유효 해시레이트나 RVN 수입",
        ],
        ["Worker 해시레이트", "그 리그 이름의 보고", "지갑 전체의 미지급 잔액"],
        ["셰어 난이도", "2Miners 도움말: 채굴 보상에 영향 없음", "난이도를 올리면 RVN이 더 나옴"],
        [
          "셰어 시계열",
          "계정 API에 셰어 구간이 따로 있음",
          "확정된 지갑 지급. 이 화면은 그 시계열을 보이지 않음",
        ],
      ],
    },
    ja: {
      headers: ["数字", "出所", "こう読まない"],
      rows: [
        [
          "アドレスの現在ハッシュレート",
          "口座に対するプールの現在の報告",
          "採掘ソフトの有効ハッシュレート、または RVN 収入",
        ],
        ["Worker のハッシュレート", "そのリグ名の報告", "ウォレット全体の未払い残高"],
        ["シェア難度", "2Miners ヘルプ: 採掘報酬に影響しない", "難度を上げると RVN が増える"],
        [
          "シェアの時系列",
          "口座 API にシェア区間が別に存在する",
          "確定したウォレット支払い。この画面はその系列を出さない",
        ],
      ],
    },
  },
  body: {
    zh: [
      "KawPoW 是 Ravencoin 官网写出的挖矿算法，也是 2Miners 帮助要求挖 RVN 时选用的算法。[RVN 监控](/projects/rvn) 上的算力是矿池账户给出的当前算力，加上每台 Worker 自己的算力。页面不另算一份「有效算力」，也不把算力换成 RVN。",
      "## 两层算力各是什么",
      "地址上的当前算力描述这只钱包在矿池侧的当前报告。某一行 Worker 的算力只描述这个矿机名。两层都可能为空。空是未知，不是 0，也不要把 Worker 算力逐行相加后宣称那就是地址算力。本页不把矿池数字改写成 MH/s 或其他单位。公开 API 还提供 5 分钟、30 分钟、6 小时的份额区间，以及按同样区间取 Worker 算力。那些序列不是未支付余额，本页也不显示它们。",
      "## 先看什么",
      "先看地址当前算力有没有数，再看你关心的那一行 Worker 有没有数、是否离线。份额难度按帮助页的说法不影响矿工收益。帮助页建议拿不准时用较低难度，并说明高难度面向大量 GPU 或 NiceHash。那是矿池的接入建议，不是一张算力换收益的公式。",
      "## 分支",
      "- 本机软件显示的算力和页面不一致：页面用的是矿池报告，不是你显卡软件里的读数，两者可以不同。",
      "- 地址有算力、某一行没有：看那一行是否离线，见 [离线和拒绝份额](/learn/rvn-worker-offline-rejected-shares)。",
      "- 算力还在但余额没变：算力不是 24 小时收益，金额见 [收益、确认和支付](/learn/rvn-rewards-confirmations-payouts)。",
      "## 举例",
      "说明用例子。地址当前算力显示为矿池给出的 90，Worker `rig-a` 为 60，`rig-b` 为空白。正确读法是地址报告为 90，`rig-a` 为 60，`rig-b` 未知。不要把空白当成 0 再和 60 相加去「核对」90，也不要把 90 乘上电价或币价。提高份额难度不会按帮助页的说法提高收益。",
      "## 下一步和边界",
      "下一步在 [RVN 监控](/projects/rvn) 对照地址算力和你要看的 Worker 行。本页不能读取你机器上的 KawPoW 日志，不能证明拒绝份额比例，也不保证算力对应多少 RVN。官网的 5,000 RVN 区块奖励是网络设计。",
    ],
    "zh-TW": [
      "KawPoW 是 Ravencoin 官網寫出的挖礦演算法，也是 2Miners 幫助要求挖 RVN 時選用的演算法。[RVN 監控](/projects/rvn) 上的算力是礦池帳戶給出的當前算力，加上每台 Worker 自己的算力。頁面不另算一份「有效算力」，也不把算力換成 RVN。",
      "## 兩層算力各是什麼",
      "地址上的當前算力描述這只錢包在礦池側的當前報告。某一列 Worker 的算力只描述這個礦機名。兩層都可能為空。空是未知，不是 0，也不要把 Worker 算力逐列相加後宣稱那就是地址算力。本頁不把礦池數字改寫成 MH/s 或其他單位。公開 API 還提供 5 分鐘、30 分鐘、6 小時的份額區間，以及按同樣區間取 Worker 算力。那些序列不是未支付餘額，本頁也不顯示它們。",
      "## 先看什麼",
      "先看地址當前算力有沒有數，再看你關心的那一列 Worker 有沒有數、是否離線。份額難度按幫助頁的說法不影響礦工收益。幫助頁建議拿不準時用較低難度，並說明高難度面向大量 GPU 或 NiceHash。那是礦池的接入建議，不是一張算力換收益的公式。",
      "## 分支",
      "- 本機軟體顯示的算力和頁面不一致：頁面用的是礦池報告，不是你顯示卡軟體裡的讀數，兩者可以不同。",
      "- 地址有算力、某一列沒有：看那一列是否離線，見 [離線和拒絕份額](/learn/rvn-worker-offline-rejected-shares)。",
      "- 算力還在但餘額沒變：算力不是 24 小時收益，金額見 [收益、確認和支付](/learn/rvn-rewards-confirmations-payouts)。",
      "## 舉例",
      "說明用例子。地址當前算力顯示為礦池給出的 90，Worker `rig-a` 為 60，`rig-b` 為空白。正確讀法是地址報告為 90，`rig-a` 為 60，`rig-b` 未知。不要把空白當成 0 再和 60 相加去「核對」90，也不要把 90 乘上電價或幣價。提高份額難度不會按幫助頁的說法提高收益。",
      "## 下一步和邊界",
      "下一步在 [RVN 監控](/projects/rvn) 對照地址算力和你要看的 Worker 列。本頁不能讀取你機器上的 KawPoW 日誌，不能證明拒絕份額比例，也不保證算力對應多少 RVN。官網的 5,000 RVN 區塊獎勵是網路設計。",
    ],
    en: [
      "KawPoW is the mining algorithm named on Ravencoin's site and the algorithm 2Miners help tells you to select for RVN. Hashrate on [RVN monitoring](/projects/rvn) is the pool account's current hashrate, plus each Worker's own hashrate. The page does not compute a second effective rate, and it does not convert hashrate into RVN.",
      "## What the two rates are",
      "Current hashrate on the address is the pool's current report for that wallet. A Worker hashrate describes that rig name only. Either line can be blank. Blank is unknown, not zero. Do not add Worker rows and declare that the sum is the address hashrate. This page does not relabel the pool's number as MH/s or another unit. The public API also offers share ranges of 5 minutes, 30 minutes, and 6 hours, and Worker hashrate over those same ranges. Those series are not the unpaid balance, and this page does not show them.",
      "## What to inspect",
      "See whether the address current hashrate has a number, then whether the Worker row you care about has a number and whether it is offline. Share difficulty, in the help page's words, does not affect miner rewards. The help page says to pick the lower difficulty when unsure, and it points the higher difficulty at large GPU counts or NiceHash. That is the pool's connection advice, not a formula from hashrate to coins.",
      "## Branches",
      "- The miner software and this page disagree: the page uses the pool's report, not the reading inside your GPU software. The two can differ.",
      "- The address has a rate and one row does not: check whether that row is offline. See [offline and rejected shares](/learn/rvn-worker-offline-rejected-shares).",
      "- Hashrate is present and the balance does not move: hashrate is not the 24-hour reward. Amounts are in [rewards, confirmations, and payouts](/learn/rvn-rewards-confirmations-payouts).",
      "## Example",
      "Illustrative. Address current hashrate is the pool's 90. Worker `rig-a` is 60. `rig-b` is blank. Read 90 for the address, 60 for `rig-a`, and unknown for `rig-b`. Do not turn the blank into zero, add it to 60, and treat that sum as the address rate. Do not multiply 90 by a power price or a coin price. Raising share difficulty does not raise rewards, according to the help page.",
      "## Next step and limits",
      "Next, compare the address hashrate with the Worker row you care about on [RVN monitoring](/projects/rvn). This page cannot read KawPoW logs on your machine, cannot show a rejected-share ratio, and does not promise how much RVN a hashrate represents. The 5,000 RVN block reward on the Ravencoin site is network design.",
    ],
    ko: [
      "KawPoW는 Ravencoin 사이트가 적은 채굴 알고리듬이고, 2Miners 도움말이 RVN에 선택하라고 한 알고리듬입니다. [RVN 모니터](/projects/rvn)의 해시레이트는 풀 계정의 현재 해시레이트와 Worker별 해시레이트입니다. 화면은 별도의 유효 해시레이트를 계산하지 않고, 해시레이트를 RVN으로 바꾸지 않습니다.",
      "## 두 층의 의미",
      "주소의 현재 해시레이트는 그 지갑에 대한 풀의 현재 보고입니다. Worker 해시레이트는 그 리그 이름만 설명합니다. 둘 다 비어 있을 수 있습니다. 빈 값은 알 수 없음이며 0이 아닙니다. Worker 행을 더해 그 합이 주소 해시레이트라고 단정하지 마세요. 이 화면은 풀 숫자를 MH/s 등 다른 단위로 다시 붙이지 않습니다. 공개 API에는 5분, 30분, 6시간의 셰어 구간과 같은 구간의 Worker 해시레이트가 있습니다. 그 시계열은 미지급 잔액이 아니고, 이 화면은 보여 주지 않습니다.",
      "## 볼 것",
      "주소 현재 해시레이트에 숫자가 있는지 본 다음, 보려는 Worker 행에 숫자가 있는지, 오프라인인지를 봅니다. 셰어 난이도는 도움말의 말대로 채굴 보상에 영향을 주지 않습니다. 도움말은 모르겠으면 낮은 난이도를 고르고, 높은 난이도는 많은 GPU나 NiceHash에 해당한다고 합니다. 그것은 풀의 접속 안내이지, 해시레이트를 코인으로 바꾸는 공식이 아닙니다.",
      "## 분기",
      "- 채굴 소프트웨어와 이 화면이 다르면, 화면은 풀 보고를 쓰고 그래픽 소프트웨어의 읽기가 아닙니다. 둘은 다를 수 있습니다.",
      "- 주소에는 값이 있고 한 행에는 없으면 그 행이 오프라인인지 봅니다. [오프라인과 거부 셰어](/learn/rvn-worker-offline-rejected-shares)를 보세요.",
      "- 해시레이트는 있는데 잔액이 움직이지 않으면 해시레이트는 24시간 수익이 아닙니다. 금액은 [수익, 컨펌, 지급](/learn/rvn-rewards-confirmations-payouts)에 있습니다.",
      "## 예시",
      "설명용입니다. 주소 현재 해시레이트는 풀이 준 90, Worker `rig-a`는 60, `rig-b`는 빈 칸입니다. 주소 90, `rig-a` 60, `rig-b`는 알 수 없음으로 읽습니다. 빈 칸을 0으로 두고 60과 더해 그 합이 주소 값이라고 보지 마세요. 90에 전기 요금이나 코인 가격을 곱하지 마세요. 도움말에 따르면 셰어 난이도를 올려도 보상이 늘지 않습니다.",
      "## 다음 단계와 한계",
      "다음은 [RVN 모니터](/projects/rvn)에서 주소 해시레이트와 보려는 Worker 행을 대조하는 것입니다. 이 화면은 기기의 KawPoW 로그를 읽지 못하고, 거부 셰어 비율을 보이지 않으며, 해시레이트가 얼마의 RVN인지 약속하지 않습니다. Ravencoin 사이트의 5,000 RVN 블록 보상은 네트워크 설계입니다.",
    ],
    ja: [
      "KawPoW は Ravencoin のサイトが示す採掘アルゴリズムであり、2Miners ヘルプが RVN で選ぶよう書いているアルゴリズムです。[RVN モニター](/projects/rvn)のハッシュレートは、プール口座の現在値と各 Worker の値です。画面は別の有効ハッシュレートを計算せず、ハッシュレートを RVN にも換えません。",
      "## 二層の意味",
      "アドレスの現在ハッシュレートは、そのウォレットに対するプールの現在の報告です。Worker の値はそのリグ名だけを表します。どちらも空欄になり得ます。空欄は不明であり、0 ではありません。Worker の行を足して、その合計がアドレスのハッシュレートだと断定しないでください。この画面はプールの数字を MH/s などの別単位に付け替えません。公開 API には 5 分、30 分、6 時間のシェア区間と、同じ区間の Worker ハッシュレートがあります。その系列は未払い残高ではなく、この画面は表示しません。",
      "## 見ること",
      "アドレスの現在ハッシュレートに数字があるかを見てから、見たい Worker 行に数字があるか、オフラインかを見ます。シェア難度はヘルプの文言では採掘報酬に影響しません。ヘルプは迷ったら低い難度を選び、高い難度は多数の GPU や NiceHash 向けだと書いています。それはプールの接続案内であり、ハッシュレートをコインに換える式ではありません。",
      "## 分岐",
      "- 採掘ソフトとこの画面が違うときは、画面が使うのはプールの報告であり、GPU ソフトの読み値ではありません。両者は異なり得ます。",
      "- アドレスには値があり一行には無いときは、その行がオフラインかを見ます。[オフラインと拒否シェア](/learn/rvn-worker-offline-rejected-shares)を見てください。",
      "- ハッシュレートがあるのに残高が動かないときは、ハッシュレートは 24 時間報酬ではありません。金額は [報酬、承認、支払い](/learn/rvn-rewards-confirmations-payouts) にあります。",
      "## 例",
      "説明用です。アドレスの現在ハッシュレートはプールの 90、Worker `rig-a` は 60、`rig-b` は空欄です。アドレス 90、`rig-a` 60、`rig-b` は不明と読みます。空欄を 0 にして 60 と足し、その合計がアドレスの値だと見ないでください。90 に電気代やコイン価格を掛けないでください。ヘルプによれば、シェア難度を上げても報酬は増えません。",
      "## 次の操作と限界",
      "次は [RVN モニター](/projects/rvn) でアドレスのハッシュレートと見たい Worker 行を照合することです。この画面は端末の KawPoW ログを読めず、拒否シェアの比率を出さず、ハッシュレートがいくら RVN に相当するかも約束しません。Ravencoin サイトの 5,000 RVN のブロック報酬はネットワークの設計です。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "页面上的算力就是矿机软件里的有效算力吗？",
        "不是。页面显示矿池账户的当前算力和 Worker 算力。它不读取你机器上的软件，也不另算一份有效算力。",
      ],
      [
        "頁面上的算力就是礦機軟體裡的有效算力嗎？",
        "不是。頁面顯示礦池帳戶的當前算力和 Worker 算力。它不讀取你機器上的軟體，也不另算一份有效算力。",
      ],
      [
        "Is the hashrate on the page the effective rate in my miner?",
        "No. The page shows the pool account's current hashrate and each Worker's hashrate. It does not read the software on your machine and does not compute a second effective rate.",
      ],
      [
        "화면의 해시레이트가 채굴기 소프트웨어의 유효 해시레이트인가요?",
        "아닙니다. 화면은 풀 계정의 현재 해시레이트와 Worker별 값입니다. 기기의 소프트웨어를 읽지 않고, 별도의 유효 해시레이트도 계산하지 않습니다.",
      ],
      [
        "画面のハッシュレートは採掘ソフトの有効値ですか？",
        "いいえ。画面はプール口座の現在値と各 Worker の値です。端末のソフトは読まず、別の有効値も計算しません。",
      ],
    ),
    qa(
      [
        "把份额难度调高，收益会增加吗？",
        "按 2Miners 帮助的说法，份额难度不影响矿工收益。难度是接入选择，不是多发 RVN 的开关。",
      ],
      [
        "把份額難度調高，收益會增加嗎？",
        "按 2Miners 幫助的說法，份額難度不影響礦工收益。難度是接入選擇，不是多發 RVN 的開關。",
      ],
      [
        "Does a higher share difficulty increase rewards?",
        "2Miners help says share difficulty does not affect miner rewards. Difficulty is a connection choice, not a switch that pays more RVN.",
      ],
      [
        "셰어 난이도를 높이면 수익이 늘나요?",
        "2Miners 도움말은 셰어 난이도가 채굴 보상에 영향을 주지 않는다고 합니다. 난이도는 접속 선택이지 RVN을 더 주는 스위치가 아닙니다.",
      ],
      [
        "シェア難度を上げると報酬は増えますか？",
        "2Miners ヘルプは、シェア難度は採掘報酬に影響しないとしています。難度は接続の選択であり、RVN を増やすスイッチではありません。",
      ],
    ),
    qa(
      [
        "Worker 算力加总应该等于地址算力吗？",
        "不要这样核对。地址算力是矿池对整只钱包的当前报告，Worker 算力是各行自己的报告。某一行为空时是未知，不是 0。",
      ],
      [
        "Worker 算力加總應該等於地址算力嗎？",
        "不要這樣核對。地址算力是礦池對整只錢包的當前報告，Worker 算力是各列自己的報告。某一列為空時是未知，不是 0。",
      ],
      [
        "Should Worker hashrates add up to the address hashrate?",
        "Do not audit them that way. Address hashrate is the pool's current report for the wallet. Each Worker hashrate is that row's report. A blank row is unknown, not zero.",
      ],
      [
        "Worker 해시레이트를 더하면 주소 해시레이트와 같아야 하나요?",
        "그렇게 대조하지 마세요. 주소 값은 지갑에 대한 풀의 현재 보고이고, Worker 값은 그 행의 보고입니다. 빈 행은 알 수 없음이며 0이 아닙니다.",
      ],
      [
        "Worker の値を足すとアドレスの値になるべきですか？",
        "その照合はしないでください。アドレスの値はウォレットに対するプールの現在の報告で、Worker の値はその行の報告です。空欄は不明であり 0 ではありません。",
      ],
    ),
  ]),
};

const rewards: Article = {
  slug: "rvn-rewards-confirmations-payouts",
  published: "2026-10-24",
  modified: "2026-10-24",
  project: "rvn",
  sources,
  related: ["rvn-mining-monitor-guide", "rvn-kawpow-effective-hashrate"],
  topic: L("收益和支付", "收益和支付", "Rewards and payouts", "수익과 지급", "報酬と支払い"),
  title: L(
    "RVN 的未支付、已支付和 24 小时收益，哪一笔才算到账？",
    "RVN 的未支付、已支付和 24 小時收益，哪一筆才算到帳？",
    "Which RVN figure is unpaid, already paid, or a 24-hour reward?",
    "RVN에서 미지급, 지급 완료, 24시간 수익은 각각 무엇인가",
    "RVN の未払い、支払済み、24時間報酬のどれが着金か",
  ),
  description: L(
    "三笔都是 2Miners 账户账，不是官方钱包余额。份额和区块成熟状态也不是这三笔。确认次数和最低支付额，2Miners 的 RVN 帮助页没有写明。",
    "三筆都是 2Miners 帳戶帳，不是官方錢包餘額。份額和區塊成熟狀態也不是這三筆。確認次數和最低支付額，2Miners 的 RVN 幫助頁沒有寫明。",
    "All three figures are the 2Miners account ledger, not the official wallet balance. Shares and block maturity are not these three figures. The 2Miners RVN help page does not state a confirmation count or a minimum payout.",
    "세 숫자는 모두 2Miners 계정 장부이며 공식 지갑 잔액이 아닙니다. 셰어와 블록 성숙도 이 세 숫자가 아닙니다. 2Miners RVN 도움말에는 컨펌 횟수와 최소 지급액이 없습니다.",
    "三つの数字はいずれも 2Miners の口座台帳であり、公式ウォレット残高ではありません。シェアとブロックの成熟もこの三つではありません。2Miners の RVN ヘルプには承認回数も最低支払額もありません。",
  ),
  summary: L(
    "未支付还在矿池。累计已支付是矿池记成已付出的累计。24 小时收益不要和它们相加。缺数不是 0。",
    "未支付還在礦池。累計已支付是礦池記成已付出的累計。24 小時收益不要和它們相加。缺數不是 0。",
    "Unpaid is still at the pool. Cumulative paid is what the pool records as sent. Do not add the 24-hour reward on top. A missing amount is not zero.",
    "미지급은 아직 풀에 있습니다. 누적 지급은 풀이 보냈다고 적은 누계입니다. 24시간 수익을 그 위에 더하지 마세요. 빠진 금액은 0이 아닙니다.",
    "未払いはまだプールです。累計支払済みはプールが送付済みと記録した累計です。24時間報酬をその上に足さないでください。欠けた金額は 0 ではありません。",
  ),
  comparisonTitle: L(
    "三笔金额和份额不是一回事",
    "三筆金額和份額不是一回事",
    "Three amounts, and shares, are different",
    "세 금액과 셰어는 다릅니다",
    "三つの金額とシェアは別です",
  ),
  comparison: {
    zh: {
      headers: ["名称", "在哪里", "是不是链上到账"],
      rows: [
        ["未支付余额", "矿池账，尚未付出", "不是"],
        ["累计已支付", "矿池账记成已付出的累计", "不是官方钱包的实时余额"],
        ["滚动 24 小时收益", "矿池给这只地址的 24 小时数字", "不是今天可以加进余额的第二笔资产"],
        ["份额或未成熟区块", "API 另有份额区间和区块列表", "本页不显示；份额不是已确认付款"],
      ],
    },
    "zh-TW": {
      headers: ["名稱", "在哪裡", "是不是鏈上到帳"],
      rows: [
        ["未支付餘額", "礦池帳，尚未付出", "不是"],
        ["累計已支付", "礦池帳記成已付出的累計", "不是官方錢包的即時餘額"],
        ["滾動 24 小時收益", "礦池給這只地址的 24 小時數字", "不是今天可以加進餘額的第二筆資產"],
        ["份額或未成熟區塊", "API 另有份額區間和區塊列表", "本頁不顯示；份額不是已確認付款"],
      ],
    },
    en: {
      headers: ["Name", "Where it sits", "Coins in the chain wallet?"],
      rows: [
        ["Unpaid balance", "Pool ledger, not yet sent", "No"],
        [
          "Cumulative paid",
          "What the pool ledger records as sent",
          "Not the live official-wallet balance",
        ],
        [
          "Rolling 24-hour reward",
          "The pool's 24-hour figure for this address",
          "Not a second holding to add to the balance today",
        ],
        [
          "Shares or immature blocks",
          "The API also has share ranges and a block list",
          "Not shown here. A share is not a confirmed payment",
        ],
      ],
    },
    ko: {
      headers: ["이름", "있는 곳", "체인 지갑 입금인가"],
      rows: [
        ["미지급 잔액", "풀 장부, 아직 보내지 않음", "아님"],
        ["누적 지급", "풀 장부가 보냈다고 적은 누계", "공식 지갑의 실시간 잔액 아님"],
        [
          "롤링 24시간 수익",
          "이 주소에 대한 풀의 24시간 숫자",
          "오늘 잔액에 더할 두 번째 자산 아님",
        ],
        [
          "셰어 또는 미성숙 블록",
          "API에 셰어 구간과 블록 목록이 따로 있음",
          "이 화면은 보이지 않음. 셰어는 확정 지급이 아님",
        ],
      ],
    },
    ja: {
      headers: ["名前", "場所", "チェーン上の着金か"],
      rows: [
        ["未払い残高", "プール台帳。まだ送っていない", "いいえ"],
        [
          "累計支払済み",
          "プール台帳が送付済みと記録した累計",
          "公式ウォレットのリアルタイム残高ではない",
        ],
        [
          "直近24時間報酬",
          "このアドレスに対するプールの24時間の数字",
          "今日、残高に足す第二の保有ではない",
        ],
        [
          "シェアまたは未成熟ブロック",
          "API にシェア区間とブロック一覧が別に存在する",
          "この画面は出さない。シェアは確定した支払いではない",
        ],
      ],
    },
  },
  body: {
    zh: [
      "到账要分三笔看，而且三笔都还在 2Miners 的账户账上，不是官方 Ravencoin 钱包里的币。[RVN 监控](/projects/rvn) 把矿池的整数按 1 RVN = 100,000,000 换算后显示未支付、累计已支付和滚动 24 小时收益。",
      "## 三笔分别是什么",
      "未支付是矿池还没付出去的余额。累计已支付是账本记成已经付出的累计，不是今天新挖到的币。滚动 24 小时收益是这只地址的 24 小时数字，不要和未支付相加当成总资产。某一笔缺失就是未知，不是 0。同一只地址无论下面有几台 Worker，这三笔都只计一次。公开 API 另外列出份额区间，以及候选、未成熟、已成熟区块和支付历史。份额是提交给矿池的工作记录，不是已确认的钱包付款。本页不显示份额条数，也不显示要多少次确认才支付。",
      "## 先核对什么",
      "先看未支付有没有数，再看累计已支付有没有增加，最后单独看 24 小时收益。不要用算力去反推这三笔。2Miners 帮助写明 RVN 支付费用为 0 美元，BTC 和 TON 另有他们写出的低费用。那是矿池对支付币种费用的说法。2Miners 的 RVN 帮助页没有写出最低支付额，也没有写出确认次数，所以这两项保持未知，不能补成 0。",
      "## 分支",
      "- 已支付增加、未支付下降：这符合矿池账从待付转到已付的样子，仍不是官方钱包的实时余额。",
      "- 24 小时收益很高但未支付没变：不要把 24 小时数字再加进余额。",
      "- 三笔都是空的：先确认查询的是 R 开头的 RVN 地址，见 [地址和 Worker 格式](/learn/rvn-wallet-and-worker-format)。",
      "- 算力波动不解释这三笔，见 [算力怎么读](/learn/rvn-kawpow-effective-hashrate)。",
      "## 举例",
      "说明用例子，不是一笔真实支付。未支付 40 RVN，累计已支付 500 RVN，滚动 24 小时收益 6 RVN。正确读法是矿池账上还有 40 未付，历史上记了 500 已付，另有一个 6 的 24 小时数字。把 40、500、6 加总成 546 并称为今天到账，是错误分支。官网写的区块奖励 5,000 RVN 是网络设计，不是这只地址的未支付。",
      "## 下一步和边界",
      "下一步在 [RVN 监控](/projects/rvn) 只对比这三笔，再到官方钱包查看链上余额。本页不能发起支付，不能告诉你还要等几次确认，也不能保证 RVN 何时离开矿池。",
    ],
    "zh-TW": [
      "到帳要分三筆看，而且三筆都還在 2Miners 的帳戶帳上，不是官方 Ravencoin 錢包裡的幣。[RVN 監控](/projects/rvn) 把礦池的整數按 1 RVN = 100,000,000 換算後顯示未支付、累計已支付和滾動 24 小時收益。",
      "## 三筆分別是什麼",
      "未支付是礦池還沒付出去的餘額。累計已支付是帳本記成已經付出的累計，不是今天新挖到的幣。滾動 24 小時收益是這只地址的 24 小時數字，不要和未支付相加當成總資產。某一筆缺失就是未知，不是 0。同一只地址無論下面有幾台 Worker，這三筆都只計一次。公開 API 另外列出份額區間，以及候選、未成熟、已成熟區塊和支付歷史。份額是提交給礦池的工作記錄，不是已確認的錢包付款。本頁不顯示份額條數，也不顯示要多少次確認才支付。",
      "## 先核對什麼",
      "先看未支付有沒有數，再看累計已支付有沒有增加，最後單獨看 24 小時收益。不要用算力去反推這三筆。2Miners 幫助寫明 RVN 支付費用為 0 美元，BTC 和 TON 另有他們寫出的低費用。那是礦池對支付幣種費用的說法。2Miners 的 RVN 幫助頁沒有寫出最低支付額，也沒有寫出確認次數，所以這兩項保持未知，不能補成 0。",
      "## 分支",
      "- 已支付增加、未支付下降：這符合礦池帳從待付轉到已付的樣子，仍不是官方錢包的即時餘額。",
      "- 24 小時收益很高但未支付沒變：不要把 24 小時數字再加進餘額。",
      "- 三筆都是空的：先確認查詢的是 R 開頭的 RVN 地址，見 [地址和 Worker 格式](/learn/rvn-wallet-and-worker-format)。",
      "- 算力波動不解釋這三筆，見 [算力怎麼讀](/learn/rvn-kawpow-effective-hashrate)。",
      "## 舉例",
      "說明用例子，不是一筆真實支付。未支付 40 RVN，累計已支付 500 RVN，滾動 24 小時收益 6 RVN。正確讀法是礦池帳上還有 40 未付，歷史上記了 500 已付，另有一個 6 的 24 小時數字。把 40、500、6 加總成 546 並稱為今天到帳，是錯誤分支。官網寫的區塊獎勵 5,000 RVN 是網路設計，不是這只地址的未支付。",
      "## 下一步和邊界",
      "下一步在 [RVN 監控](/projects/rvn) 只對比這三筆，再到官方錢包查看鏈上餘額。本頁不能發起支付，不能告訴你還要等幾次確認，也不能保證 RVN 何時離開礦池。",
    ],
    en: [
      "Arrival has to be read as three figures, and all three still sit on the 2Miners account ledger. They are not coins in the official Ravencoin wallet. [RVN monitoring](/projects/rvn) converts the pool's integers at 1 RVN = 100,000,000 and shows unpaid balance, cumulative paid, and the rolling 24-hour reward.",
      "## What the three figures are",
      "Unpaid is the balance the pool has not sent. Cumulative paid is what the ledger records as already sent. It is not coins newly mined today. The rolling 24-hour reward is that address's 24-hour figure. Do not add it to unpaid and call the sum your holdings. A missing amount is unknown, not zero. However many Workers sit under the address, these three figures count once. The public API also lists share ranges, candidate, immature, and matured blocks, and payment history. A share is work submitted to the pool, not a confirmed wallet payment. This page does not show a share count, and it does not show how many confirmations a payout waits for.",
      "## What to inspect",
      "Look for a number on unpaid, then whether cumulative paid has increased, then read the 24-hour reward on its own. Do not reverse these three from hashrate. 2Miners help says the RVN payout fee is $0, and it states low fees for BTC and TON. That is the pool's statement about payout-coin fees. The 2Miners RVN help page does not state a minimum payout or a confirmation count, so both stay unknown. They are not filled in as zero.",
      "## Branches",
      "- Paid rises and unpaid falls: that matches the pool ledger moving an amount from unpaid to paid. It is still not the live official-wallet balance.",
      "- The 24-hour reward is large and unpaid does not move: do not add the 24-hour figure into the balance.",
      "- All three are blank: confirm the lookup is an RVN address starting with R. See [address and Worker format](/learn/rvn-wallet-and-worker-format).",
      "- Hashrate moving does not explain these three. See [how to read hashrate](/learn/rvn-kawpow-effective-hashrate).",
      "## Example",
      "Illustrative, not a real payout. Unpaid 40 RVN, cumulative paid 500 RVN, rolling 24-hour reward 6 RVN. Read 40 still unpaid on the pool ledger, 500 recorded as paid in the past, and a separate 24-hour figure of 6. Adding 40, 500, and 6 into 546 and calling that today's arrival is the wrong branch. The 5,000 RVN block reward on the Ravencoin site is network design, not this address's unpaid balance.",
      "## Next step and limits",
      "Next, compare only these three lines on [RVN monitoring](/projects/rvn), then read the chain balance in the official wallet. This page cannot send a payout, cannot tell you how many confirmations remain, and does not promise when RVN leaves the pool.",
    ],
    ko: [
      "입금은 세 숫자로 나눠 봐야 하고, 셋 다 아직 2Miners 계정 장부에 있습니다. 공식 Ravencoin 지갑의 코인이 아닙니다. [RVN 모니터](/projects/rvn)는 풀의 정수를 1 RVN = 100,000,000으로 바꿔 미지급, 누적 지급, 롤링 24시간 수익을 보여 줍니다.",
      "## 세 숫자의 뜻",
      "미지급은 풀이 아직 보내지 않은 잔액입니다. 누적 지급은 장부가 이미 보냈다고 적은 누계이며 오늘 새로 캔 코인이 아닙니다. 롤링 24시간 수익은 그 주소의 24시간 숫자입니다. 미지급과 더해 보유액으로 부르지 마세요. 빠진 금액은 알 수 없음이며 0이 아닙니다. 주소 아래 Worker가 몇이든 이 세 숫자는 한 번입니다. 공개 API는 셰어 구간, 후보·미성숙·성숙 블록, 지급 이력을 따로 둡니다. 셰어는 풀에 제출한 작업 기록이지 확정된 지갑 지급이 아닙니다. 이 화면은 셰어 건수를 보이지 않고, 지급까지 컨펌이 몇 번인지도 보이지 않습니다.",
      "## 대조할 것",
      "미지급에 숫자가 있는지 보고, 누적 지급이 늘었는지 본 다음, 24시간 수익은 따로 읽습니다. 해시레이트로 이 셋을 역산하지 마세요. 2Miners 도움말은 RVN 지급 수수료가 0달러이고 BTC와 TON은 낮은 수수료라고 적습니다. 그것은 지급 코인 수수료에 대한 풀의 설명입니다. 2Miners RVN 도움말에는 최소 지급액과 컨펌 횟수가 없으므로 둘 다 알 수 없음으로 둡니다. 0으로 채우지 않습니다.",
      "## 분기",
      "- 지급이 늘고 미지급이 줄면 풀 장부가 미지급에서 지급으로 옮긴 모습과 같습니다. 그래도 공식 지갑의 실시간 잔액은 아닙니다.",
      "- 24시간 수익은 큰데 미지급이 그대로면 24시간 숫자를 잔액에 더하지 마세요.",
      "- 셋 다 비어 있으면 조회가 R로 시작하는 RVN 주소인지 확인합니다. [주소와 Worker 형식](/learn/rvn-wallet-and-worker-format)을 보세요.",
      "- 해시레이트 변동은 이 셋을 설명하지 않습니다. [해시레이트 읽기](/learn/rvn-kawpow-effective-hashrate)를 보세요.",
      "## 예시",
      "설명용이며 실제 지급이 아닙니다. 미지급 40 RVN, 누적 지급 500 RVN, 롤링 24시간 수익 6 RVN입니다. 풀 장부에 40이 아직 미지급이고, 과거에 500이 지급으로 적혔으며, 6은 별도의 24시간 숫자입니다. 40, 500, 6을 546으로 더해 오늘 입금이라고 부르는 분기는 틀립니다. Ravencoin 사이트의 블록 보상 5,000 RVN은 네트워크 설계이지 이 주소의 미지급이 아닙니다.",
      "## 다음 단계와 한계",
      "다음은 [RVN 모니터](/projects/rvn)에서 이 세 줄만 비교한 뒤, 공식 지갑에서 체인 잔액을 보는 것입니다. 이 화면은 지급을 보내지 못하고, 남은 컨펌 횟수를 알려 주지 않으며, RVN이 언제 풀을 떠나는지 약속하지 않습니다.",
    ],
    ja: [
      "着金は三つの数字に分けて読み、三つともまだ 2Miners の口座台帳にあります。公式 Ravencoin ウォレットのコインではありません。[RVN モニター](/projects/rvn)はプールの整数を 1 RVN = 100,000,000 で換算し、未払い、累計支払済み、直近24時間報酬を出します。",
      "## 三つの意味",
      "未払いはプールがまだ送っていない残高です。累計支払済みは台帳が送付済みと記録した累計で、今日新しく掘ったコインではありません。直近24時間報酬はそのアドレスの24時間の数字です。未払いと足して保有額と呼ばないでください。欠けた金額は不明であり、0 ではありません。アドレスの下に Worker が何台あっても、この三つは一度だけ数えます。公開 API はシェア区間、候補・未成熟・成熟ブロック、支払い履歴を別に持っています。シェアはプールへ提出した仕事の記録であり、確定したウォレット支払いではありません。この画面はシェア件数を出さず、支払いまである承認回数も出しません。",
      "## 照合すること",
      "未払いに数字があるかを見て、累計支払済みが増えたかを見て、24時間報酬は別に読みます。ハッシュレートからこの三つを逆算しないでください。2Miners ヘルプは RVN の支払手数料を 0 ドルとし、BTC と TON には低い手数料を書いています。それは支払通貨の手数料についてのプールの説明です。2Miners の RVN ヘルプには最低支払額も承認回数もないので、両方とも不明のままです。0 では埋めません。",
      "## 分岐",
      "- 支払済みが増え未払いが減るのは、プール台帳が未払いから支払済みへ移した形と合います。それでも公式ウォレットのリアルタイム残高ではありません。",
      "- 24時間報酬が大きく未払いが動かないときは、24時間の数字を残高に足さないでください。",
      "- 三つとも空欄なら、照会が R で始まる RVN アドレスかを確認します。[アドレスと Worker の形式](/learn/rvn-wallet-and-worker-format)を見てください。",
      "- ハッシュレートの変動はこの三つを説明しません。[ハッシュレートの読み方](/learn/rvn-kawpow-effective-hashrate)を見てください。",
      "## 例",
      "説明用であり、実際の支払いではありません。未払い 40 RVN、累計支払済み 500 RVN、直近24時間報酬 6 RVN です。プール台帳に 40 がまだ未払い、過去に 500 が支払済みと記録され、6 は別の 24 時間の数字です。40、500、6 を 546 と足して今日の着金と呼ぶ分岐は誤りです。Ravencoin サイトのブロック報酬 5,000 RVN はネットワークの設計であり、このアドレスの未払いではありません。",
      "## 次の操作と限界",
      "次は [RVN モニター](/projects/rvn) でこの三行だけを比べ、その後に公式ウォレットでチェーン上の残高を見ることです。この画面は支払いを送れず、残りの承認回数も伝えず、RVN がいつプールを離れるかも約束しません。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "累计已支付就是今天挖到的 RVN 吗？",
        "不是。它是矿池账本记成已经付出的累计。今天的新变化要看未支付和这笔累计怎么一起变动，而不是把累计当成今日产量。",
      ],
      [
        "累計已支付就是今天挖到的 RVN 嗎？",
        "不是。它是礦池帳本記成已經付出的累計。今天的新變化要看未支付和這筆累計怎麼一起變動，而不是把累計當成今日產量。",
      ],
      [
        "Is cumulative paid the RVN mined today?",
        "No. It is what the pool ledger records as already sent. Today's change is how unpaid and that cumulative figure move together, not the cumulative total treated as today's output.",
      ],
      [
        "누적 지급이 오늘 캔 RVN인가요?",
        "아닙니다. 풀 장부가 이미 보냈다고 적은 누계입니다. 오늘의 변화는 미지급과 그 누계가 함께 어떻게 움직이는지이며, 누계 전체를 오늘 생산으로 보지 않습니다.",
      ],
      [
        "累計支払済みは今日掘った RVN ですか？",
        "いいえ。プール台帳が送付済みと記録した累計です。今日の変化は未払いとその累計が一緒にどう動くかであり、累計全体を今日の産出とは呼びません。",
      ],
    ),
    qa(
      [
        "份额多是不是已经确认付款？",
        "不是。份额是交给矿池的工作记录。已确认付款要看矿池账上的已支付，而且那仍不是官方钱包的实时余额。本页不显示份额条数。",
      ],
      [
        "份額多是不是已經確認付款？",
        "不是。份額是交給礦池的工作記錄。已確認付款要看礦池帳上的已支付，而且那仍不是官方錢包的即時餘額。本頁不顯示份額條數。",
      ],
      [
        "Do more shares mean a confirmed payment?",
        "No. A share is work submitted to the pool. A recorded payout is the paid figure on the pool ledger, and that is still not the live official-wallet balance. This page does not show a share count.",
      ],
      [
        "셰어가 많으면 지급이 확정된 것인가요?",
        "아닙니다. 셰어는 풀에 제출한 작업 기록입니다. 기록된 지급은 풀 장부의 지급 누계이며, 그것도 공식 지갑의 실시간 잔액은 아닙니다. 이 화면은 셰어 건수를 보이지 않습니다.",
      ],
      [
        "シェアが多いと支払いが確定ですか？",
        "いいえ。シェアはプールへ提出した仕事の記録です。記録された支払いはプール台帳の支払済みであり、それも公式ウォレットのリアルタイム残高ではありません。この画面はシェア件数を出しません。",
      ],
    ),
    qa(
      [
        "最低支付额是多少？",
        "2Miners RVN 帮助页没有写出最低支付额，也没有写出确认次数。未知不能写成 0。帮助页确实写了 RVN 支付费用为 0 美元，那是费用而不是起付线。",
      ],
      [
        "最低支付額是多少？",
        "2Miners RVN 幫助頁沒有寫出最低支付額，也沒有寫出確認次數。未知不能寫成 0。幫助頁確實寫了 RVN 支付費用為 0 美元，那是費用而不是起付線。",
      ],
      [
        "What is the minimum payout?",
        "The 2Miners RVN help page does not state a minimum payout or a confirmation count. Unknown is not written as zero. The help page does say the RVN payout fee is $0. That is a fee, not a threshold.",
      ],
      [
        "최소 지급액은 얼마인가요?",
        "2Miners RVN 도움말에는 최소 지급액도 컨펌 횟수도 없습니다. 알 수 없음을 0으로 쓰지 않습니다. 도움말은 RVN 지급 수수료가 0달러라고 하며, 그것은 수수료이지 최소 지급선이 아닙니다.",
      ],
      [
        "最低支払額はいくらですか？",
        "2Miners の RVN ヘルプには最低支払額も承認回数もありません。不明を 0 とは書きません。ヘルプは RVN の支払手数料を 0 ドルとしており、それは手数料であって開始額ではありません。",
      ],
    ),
  ]),
};

const offline: Article = {
  slug: "rvn-worker-offline-rejected-shares",
  published: "2026-10-24",
  modified: "2026-10-24",
  project: "rvn",
  sources,
  related: [
    "rvn-wallet-and-worker-format",
    "rvn-kawpow-effective-hashrate",
    "rvn-rewards-confirmations-payouts",
  ],
  topic: L("离线怎么看", "離線怎麼看", "Reading offline", "오프라인 읽기", "オフラインの見方"),
  title: L(
    "RVN 的 Worker 显示离线，是不是拒绝份额或余额归零？",
    "RVN 的 Worker 顯示離線，是不是拒絕份額或餘額歸零？",
    "If an RVN Worker is offline, is that rejected shares or a zero balance?",
    "RVN Worker가 오프라인이면 거부 셰어나 잔액 0인가",
    "RVN の Worker がオフラインなら拒否シェアか残高ゼロか",
  ),
  description: L(
    "离线是矿池给这个矿机名的状态，不是拒绝份额比例，也不会把地址余额改成 0。本页不显示接受或拒绝的份额条数。",
    "離線是礦池給這個礦機名的狀態，不是拒絕份額比例，也不會把地址餘額改成 0。本頁不顯示接受或拒絕的份額條數。",
    "Offline is the pool's state for that rig name. It is not a rejected-share ratio, and it does not set the address balance to zero. This page does not show accepted or rejected share counts.",
    "오프라인은 그 리그 이름에 대한 풀의 상태입니다. 거부 셰어 비율이 아니고 주소 잔액을 0으로 만들지 않습니다. 이 화면은 수락·거부 셰어 건수를 보이지 않습니다.",
    "オフラインはそのリグ名に対するプールの状態です。拒否シェアの比率ではなく、アドレス残高を 0 にもしません。この画面は受理・拒否シェアの件数を出しません。",
  ),
  summary: L(
    "看这一行的离线标记和最后心跳。金额仍读地址。拒绝份额本页没有这个数。",
    "看這一列的離線標記和最後心跳。金額仍讀地址。拒絕份額本頁沒有這個數。",
    "Read that row's offline flag and last seen. Amounts stay on the address. This page has no rejected-share count.",
    "그 행의 오프라인 표시와 마지막 통신을 봅니다. 금액은 주소에 있습니다. 이 화면에는 거부 셰어 건수가 없습니다.",
    "その行のオフライン表示と最終通信を見ます。金額はアドレスにあります。この画面に拒否シェアの件数はありません。",
  ),
  comparisonTitle: L(
    "离线、心跳、份额、余额",
    "離線、心跳、份額、餘額",
    "Offline, last seen, shares, balance",
    "오프라인, 마지막 통신, 셰어, 잔액",
    "オフライン、最終通信、シェア、残高",
  ),
  comparison: {
    zh: {
      headers: ["现象", "本页有没有", "含义"],
      rows: [
        ["Worker 离线", "有，来自矿池的离线标记", "这一行当前标成离线，不是余额 0"],
        ["最后心跳", "矿池给了时间才显示", "这一行最后一次心跳；没有时间就是未知"],
        ["拒绝份额", "不显示", "不能从离线反推拒绝了多少"],
        ["未支付余额", "在地址上", "不因某一行离线而复制或清零"],
      ],
    },
    "zh-TW": {
      headers: ["現象", "本頁有沒有", "含義"],
      rows: [
        ["Worker 離線", "有，來自礦池的離線標記", "這一列目前標成離線，不是餘額 0"],
        ["最後心跳", "礦池給了時間才顯示", "這一列最後一次心跳；沒有時間就是未知"],
        ["拒絕份額", "不顯示", "不能從離線反推拒絕了多少"],
        ["未支付餘額", "在地址上", "不因某一列離線而複製或清零"],
      ],
    },
    en: {
      headers: ["What you see", "On this page?", "Meaning"],
      rows: [
        [
          "Worker offline",
          "Yes, the pool's offline flag",
          "That row is marked offline. Not a zero balance",
        ],
        [
          "Last seen",
          "Only when the pool sends a time",
          "That row's last heartbeat. No time means unknown",
        ],
        ["Rejected shares", "Not shown", "Do not infer a reject count from offline"],
        ["Unpaid balance", "On the address", "Not copied or cleared because one row is offline"],
      ],
    },
    ko: {
      headers: ["보이는 것", "이 화면에 있나", "의미"],
      rows: [
        [
          "Worker 오프라인",
          "있음. 풀의 오프라인 표시",
          "그 행이 오프라인으로 표시됨. 잔액 0이 아님",
        ],
        ["마지막 통신", "풀이 시각을 줄 때만", "그 행의 마지막 통신. 시각이 없으면 알 수 없음"],
        ["거부 셰어", "보이지 않음", "오프라인으로 거부 건수를 역산하지 않음"],
        ["미지급 잔액", "주소에 있음", "한 행이 오프라인이라고 복사되거나 0이 되지 않음"],
      ],
    },
    ja: {
      headers: ["見えるもの", "この画面にあるか", "意味"],
      rows: [
        [
          "Worker オフライン",
          "ある。プールのオフライン表示",
          "その行がオフライン。残高 0 ではない",
        ],
        ["最終通信", "プールが時刻を出したときだけ", "その行の最後の通信。時刻が無ければ不明"],
        ["拒否シェア", "出さない", "オフラインから拒否件数は逆算しない"],
        ["未払い残高", "アドレスにある", "一行がオフラインでも複製されず、ゼロにもならない"],
      ],
    },
  },
  body: {
    zh: [
      "某一台 Worker 显示离线，只说明 2Miners 把这个矿机名标成离线。它不是拒绝份额的比例，也不会把 [RVN 监控](/projects/rvn) 上这只地址的未支付改成 0。",
      "## 这一行上有什么",
      "离线标记来自矿池对该 Worker 的离线状态。最后心跳只在矿池提供时间时出现，没有时间就是未知，不是「刚刚还在」也不是「从来没连上」。这一行的算力同样可以是未知。公开 API 有份额区间和按区间的 Worker 算力，本页不显示接受了多少份额、拒绝了多少份额。2Miners 帮助写明份额难度不影响矿工收益，这不能换成「离线等于收益归零」。",
      "## 要检查什么",
      "先看是不是你设置的矿机名，见 [地址和 Worker 格式](/learn/rvn-wallet-and-worker-format)。再看这一行的心跳和算力，最后仍到地址上读未支付、已支付和 24 小时收益。地址算力还在、只有一行离线，不要把整只钱包当成停了。",
      "## 分支",
      "- 一行离线、地址金额还在：金额继续按地址读，见 [收益和支付](/learn/rvn-rewards-confirmations-payouts)。",
      "- 一行离线且算力为空：算力是未知，不要写成 0 H，见 [算力怎么读](/learn/rvn-kawpow-effective-hashrate)。",
      "- 你为这台离线 Worker 单独保存了一条设备记录：那条记录计入本项目设备名额。只是在原钱包下面看到它，不额外占名额。免费每项目 5 台已保存设备，Pro 为 50 台。",
      "## 举例",
      "说明用例子，不是故障实录。地址未支付仍是 40 RVN。`rig-a` 在线并有算力，`rig-b` 标成离线且没有心跳时间。正确读法是 `rig-b` 这一行离线、心跳未知，钱包未支付仍是 40。不要写成拒绝份额 100%，也不要把 40 改成 0。本页给不出 `rig-b` 拒绝了多少份额。",
      "## 下一步和边界",
      "下一步在 [RVN 监控](/projects/rvn) 核对这一行的离线标记和心跳，再回到矿机看网络和软件是否还在向矿池提交。本页不能重启矿机，不能列出拒绝原因，也不能把离线解释成已经损失的 RVN。",
    ],
    "zh-TW": [
      "某一台 Worker 顯示離線，只說明 2Miners 把這個礦機名標成離線。它不是拒絕份額的比例，也不會把 [RVN 監控](/projects/rvn) 上這只地址的未支付改成 0。",
      "## 這一列上有什麼",
      "離線標記來自礦池對該 Worker 的離線狀態。最後心跳只在礦池提供時間時出現，沒有時間就是未知，不是「剛剛還在」也不是「從來沒連上」。這一列的算力同樣可以是未知。公開 API 有份額區間和按區間的 Worker 算力，本頁不顯示接受了多少份額、拒絕了多少份額。2Miners 幫助寫明份額難度不影響礦工收益，這不能換成「離線等於收益歸零」。",
      "## 要檢查什麼",
      "先看是不是你設定的礦機名，見 [地址和 Worker 格式](/learn/rvn-wallet-and-worker-format)。再看這一列的心跳和算力，最後仍到地址上讀未支付、已支付和 24 小時收益。地址算力還在、只有一列離線，不要把整只錢包當成停了。",
      "## 分支",
      "- 一列離線、地址金額還在：金額繼續按地址讀，見 [收益和支付](/learn/rvn-rewards-confirmations-payouts)。",
      "- 一列離線且算力為空：算力是未知，不要寫成 0，見 [算力怎麼讀](/learn/rvn-kawpow-effective-hashrate)。",
      "- 你為這台離線 Worker 單獨儲存了一條裝置記錄：那條記錄計入本專案裝置名額。只是在原錢包下面看到它，不額外占名額。免費每專案 5 台已儲存裝置，Pro 為 50 台。",
      "## 舉例",
      "說明用例子，不是故障實錄。地址未支付仍是 40 RVN。`rig-a` 在線並有算力，`rig-b` 標成離線且沒有心跳時間。正確讀法是 `rig-b` 這一列離線、心跳未知，錢包未支付仍是 40。不要寫成拒絕份額 100%，也不要把 40 改成 0。本頁給不出 `rig-b` 拒絕了多少份額。",
      "## 下一步和邊界",
      "下一步在 [RVN 監控](/projects/rvn) 核對這一列的離線標記和心跳，再回到礦機看網路和軟體是否還在向礦池提交。本頁不能重啟礦機，不能列出拒絕原因，也不能把離線解釋成已經損失的 RVN。",
    ],
    en: [
      "A Worker marked offline means 2Miners marked that rig name offline. It is not a rejected-share ratio, and it does not change unpaid balance on [RVN monitoring](/projects/rvn) to zero.",
      "## What is on that row",
      "The offline flag is the pool's offline state for that Worker. Last seen appears only when the pool sends a time. No time is unknown. It is not proof the rig was just online, and it is not proof it never connected. That row's hashrate can be unknown as well. The public API has share ranges and Worker hashrate over a range. This page does not show how many shares were accepted or rejected. 2Miners help says share difficulty does not affect miner rewards. That sentence does not mean offline equals zero rewards.",
      "## What to inspect",
      "Check that the name is the rig you set. See [address and Worker format](/learn/rvn-wallet-and-worker-format). Then read that row's last seen and hashrate. Read unpaid, paid, and the 24-hour reward on the address. If address hashrate is still present and only one row is offline, do not treat the whole wallet as stopped.",
      "## Branches",
      "- One row is offline and the address amounts are still there: keep reading amounts on the address. See [rewards and payouts](/learn/rvn-rewards-confirmations-payouts).",
      "- One row is offline and its hashrate is blank: hashrate is unknown. Do not write it as zero. See [how to read hashrate](/learn/rvn-kawpow-effective-hashrate).",
      "- Saving that offline Worker as its own device record counts toward this project's device slots. Seeing it under the original wallet does not add a slot. Free is five saved devices per project. Pro is 50.",
      "## Example",
      "Illustrative, not a recorded outage. Unpaid on the address is still 40 RVN. `rig-a` is online and has a hashrate. `rig-b` is marked offline and has no last-seen time. Read `rig-b` as offline with last seen unknown, and keep unpaid at 40. Do not write rejected shares at 100 percent, and do not change 40 to 0. This page cannot say how many shares `rig-b` rejected.",
      "## Next step and limits",
      "Next, check that row's offline flag and last seen on [RVN monitoring](/projects/rvn), then check on the miner whether the network and the software are still submitting to the pool. This page cannot restart a miner, cannot list reject reasons, and cannot turn offline into RVN already lost.",
    ],
    ko: [
      "Worker가 오프라인이라는 것은 2Miners가 그 리그 이름을 오프라인으로 표시했다는 뜻입니다. 거부 셰어 비율이 아니고, [RVN 모니터](/projects/rvn)에서 그 주소의 미지급을 0으로 바꾸지도 않습니다.",
      "## 그 행에 있는 것",
      "오프라인 표시는 그 Worker에 대한 풀의 오프라인 상태입니다. 마지막 통신은 풀이 시각을 줄 때만 나옵니다. 시각이 없으면 알 수 없음입니다. 방금 온라인이었다는 증거도, 한 번도 연결되지 않았다는 증거도 아닙니다. 그 행의 해시레이트도 알 수 없음일 수 있습니다. 공개 API에는 셰어 구간과 구간별 Worker 해시레이트가 있습니다. 이 화면은 수락한 셰어와 거부한 셰어의 건수를 보이지 않습니다. 2Miners 도움말은 셰어 난이도가 채굴 보상에 영향을 주지 않는다고 합니다. 그 문장을 오프라인이 수익 0이라는 뜻으로 바꾸지 마세요.",
      "## 확인할 것",
      "이름이 내가 정한 리그인지 봅니다. [주소와 Worker 형식](/learn/rvn-wallet-and-worker-format)을 보세요. 그다음 그 행의 마지막 통신과 해시레이트를 보고, 미지급·지급·24시간 수익은 주소에서 읽습니다. 주소 해시레이트는 있고 한 행만 오프라인이면 지갑 전체가 멈춘 것으로 보지 마세요.",
      "## 분기",
      "- 한 행이 오프라인이고 주소 금액이 남아 있으면 금액은 주소에서 계속 읽습니다. [수익과 지급](/learn/rvn-rewards-confirmations-payouts)을 보세요.",
      "- 한 행이 오프라인이고 해시레이트가 비어 있으면 해시레이트는 알 수 없음입니다. 0으로 쓰지 마세요. [해시레이트 읽기](/learn/rvn-kawpow-effective-hashrate)를 보세요.",
      "- 그 오프라인 Worker를 별도 장치 기록으로 저장하면 이 프로젝트의 장치 슬롯에 포함됩니다. 원래 지갑 아래에서 보는 것만으로는 슬롯이 늘지 않습니다. 무료는 프로젝트당 저장 장치 5대, Pro는 50대입니다.",
      "## 예시",
      "설명용이며 실제 장애 기록이 아닙니다. 주소 미지급은 여전히 40 RVN입니다. `rig-a`는 온라인이고 해시레이트가 있습니다. `rig-b`는 오프라인이고 마지막 통신 시각이 없습니다. `rig-b`는 오프라인이고 마지막 통신은 알 수 없음, 미지급은 40으로 읽습니다. 거부 셰어 100%로 쓰거나 40을 0으로 바꾸지 마세요. 이 화면은 `rig-b`가 셰어를 몇 건 거부했는지 말하지 못합니다.",
      "## 다음 단계와 한계",
      "다음은 [RVN 모니터](/projects/rvn)에서 그 행의 오프라인 표시와 마지막 통신을 확인하고, 채굴기에서 네트워크와 소프트웨어가 아직 풀에 제출하는지를 보는 것입니다. 이 화면은 채굴기를 재시작하지 못하고, 거부 이유를 나열하지 않으며, 오프라인을 이미 잃은 RVN으로 바꾸지 않습니다.",
    ],
    ja: [
      "ある Worker がオフラインなのは、2Miners がそのリグ名をオフラインと付けたという意味です。拒否シェアの比率ではなく、[RVN モニター](/projects/rvn)でそのアドレスの未払いを 0 にもしません。",
      "## その行にあるもの",
      "オフライン表示は、その Worker に対するプールのオフライン状態です。最終通信はプールが時刻を出したときだけ出ます。時刻が無いのは不明です。直前までオンラインだった証拠でも、一度も接続していない証拠でもありません。その行のハッシュレートも不明になり得ます。公開 API にはシェア区間と、区間ごとの Worker ハッシュレートがあります。この画面は、受理したシェアと拒否したシェアの件数を出しません。2Miners ヘルプはシェア難度が採掘報酬に影響しないとしています。その文を、オフラインは報酬ゼロ、という意味には換えません。",
      "## 確認すること",
      "名前が自分で設定したリグかを見ます。[アドレスと Worker の形式](/learn/rvn-wallet-and-worker-format)を見てください。次にその行の最終通信とハッシュレートを見て、未払い、支払済み、24時間報酬はアドレスで読みます。アドレスのハッシュレートがあり一行だけオフラインなら、ウォレット全体が止まったとは扱わないでください。",
      "## 分岐",
      "- 一行がオフラインでアドレスの金額が残っているときは、金額はアドレスで読み続けます。[報酬と支払い](/learn/rvn-rewards-confirmations-payouts)を見てください。",
      "- 一行がオフラインでハッシュレートが空欄のときは、ハッシュレートは不明です。ゼロと書かないでください。[ハッシュレートの読み方](/learn/rvn-kawpow-effective-hashrate)を見てください。",
      "- そのオフライン Worker を別の端末記録として保存すると、このプロジェクトの端末枠に数えます。元のウォレットの下に見えているだけでは枠は増えません。無料はプロジェクトあたり保存端末 5 台、Pro は 50 台です。",
      "## 例",
      "説明用であり、実際の障害記録ではありません。アドレスの未払いは 40 RVN のままです。`rig-a` はオンラインでハッシュレートがあり、`rig-b` はオフラインで最終通信の時刻がありません。`rig-b` はオフライン、最終通信は不明、未払いは 40 と読みます。拒否シェア 100 パーセントとも、40 を 0 とも書かないでください。この画面は `rig-b` がシェアを何件拒否したかを出せません。",
      "## 次の操作と限界",
      "次は [RVN モニター](/projects/rvn) でその行のオフライン表示と最終通信を確認し、採掘機側でネットワークとソフトがまだプールへ送っているかを見ることです。この画面はマイナーを再起動できず、拒否理由を列挙できず、オフラインを既に失った RVN にも換えません。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "Worker 离线后，未支付会变成 0 吗？",
        "不会。未支付在地址上。某一行离线只标出这个矿机名的状态，不把地址余额改成 0，也不把余额复制到这一行。",
      ],
      [
        "Worker 離線後，未支付會變成 0 嗎？",
        "不會。未支付在地址上。某一列離線只標出這個礦機名的狀態，不把地址餘額改成 0，也不把餘額複製到這一列。",
      ],
      [
        "Does unpaid become zero when a Worker goes offline?",
        "No. Unpaid stays on the address. An offline row marks that rig name. It does not set the address balance to zero and does not copy the balance onto the row.",
      ],
      [
        "Worker가 오프라인이 되면 미지급이 0이 되나요?",
        "아닙니다. 미지급은 주소에 있습니다. 오프라인 행은 그 리그 이름의 상태일 뿐, 주소 잔액을 0으로 만들거나 그 행에 잔액을 복사하지 않습니다.",
      ],
      [
        "Worker がオフラインになると未払いは 0 になりますか？",
        "なりません。未払いはアドレスにあります。オフラインの行はそのリグ名の状態であり、アドレス残高を 0 にせず、行へ残高をコピーもしません。",
      ],
    ),
    qa(
      [
        "这一页能看到拒绝了多少份额吗？",
        "不能。离线和最后心跳不是拒绝份额。API 虽有份额区间，本页不显示接受或拒绝的条数。",
      ],
      [
        "這一頁能看到拒絕了多少份額嗎？",
        "不能。離線和最後心跳不是拒絕份額。API 雖有份額區間，本頁不顯示接受或拒絕的條數。",
      ],
      [
        "Can this page show how many shares were rejected?",
        "No. Offline and last seen are not a rejected-share count. The API has share ranges, and this page does not show accepted or rejected counts.",
      ],
      [
        "이 화면에서 거부된 셰어 수를 볼 수 있나요?",
        "없습니다. 오프라인과 마지막 통신은 거부 셰어 건수가 아닙니다. API에 셰어 구간은 있지만 이 화면은 수락·거부 건수를 보이지 않습니다.",
      ],
      [
        "この画面で拒否されたシェア件数は見えますか？",
        "見えません。オフラインと最終通信は拒否シェアの件数ではありません。API にシェア区間はありますが、この画面は受理・拒否の件数を出しません。",
      ],
    ),
    qa(
      [
        "没有最后心跳是不是从来没连上？",
        "不能这么下结论。没有时间只表示这一项未知。要看矿机是否仍在提交，需要回到矿机和矿池统计，而不是把空心跳当成一份诊断结论。",
      ],
      [
        "沒有最後心跳是不是從來沒連上？",
        "不能這麼下結論。沒有時間只表示這一項未知。要看礦機是否仍在提交，需要回到礦機和礦池統計，而不是把空心跳當成一份診斷結論。",
      ],
      [
        "Does a missing last seen mean the rig never connected?",
        "That conclusion does not follow. No timestamp means that field is unknown. Whether the miner is still submitting has to be checked on the miner and in the pool stats, not decided from a blank heartbeat.",
      ],
      [
        "마지막 통신이 없으면 한 번도 연결되지 않은 것인가요?",
        "그렇게 결론내지 않습니다. 시각이 없다는 것은 그 항목이 알 수 없음이라는 뜻입니다. 채굴기가 아직 제출하는지는 채굴기와 풀 통계에서 확인하며, 빈 통신만으로 진단하지 않습니다.",
      ],
      [
        "最終通信が無いのは一度も接続していないということですか？",
        "その結論にはなりません。時刻が無いのはその項目が不明だという意味です。マイナーがまだ送っているかは、マイナーとプール統計で確認し、空の通信だけで診断しません。",
      ],
    ),
  ]),
};

export const rvnDepthGuides: Article[] = [monitor, walletFormat, hashrate, rewards, offline];
