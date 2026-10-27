import type { Article } from "../articles";

const sources = [
  { name: "Compute Substrate", url: "https://computesubstrate.org/" },
  { name: "CSD mining client", url: "https://github.com/dangraagu/CSD-Mining-pool-public" },
  { name: "G-pools CSD mining instructions", url: "https://csd.yamaduo.no/#mine" },
];

const monitor: Article = {
  slug: "csd-gpools-monitor-guide",
  project: "csd",
  published: "2026-10-18",
  modified: "2026-10-24",
  topic: {
    zh: "查算力和到账",
    "zh-TW": "查算力與到帳",
    en: "Hashrate and payouts",
    ko: "해시레이트와 지급",
    ja: "算力と支払",
  },
  title: {
    zh: "CSD 挖矿如何查算力和收益？G-pools 地址与结算说明",
    "zh-TW": "CSD 挖礦如何查算力與收益？G-pools 地址與結算說明",
    en: "How to check CSD mining hashrate and G-pools payments",
    ko: "CSD 채굴 해시레이트와 G-pools 지급을 확인하는 방법",
    ja: "CSD採掘のハッシュレートとG-pools支払を確認する方法",
  },
  description: {
    zh: "用公开 addr20 在 IOTA Watch 查看 G-pools 的近 1 小时算力、未支付、确认中和累计已支付。币属于整份地址，不按 Worker 拆开。",
    "zh-TW":
      "用公開 addr20 在 IOTA Watch 查看 G-pools 的近 1 小時算力、未支付、確認中與累計已支付。幣屬於整份地址，不按 Worker 拆開。",
    en: "Look up a public addr20 to see the G-pools 1-hour hashrate, unpaid balance, confirming amount, and lifetime paid. Coins stay on the whole address.",
    ko: "공개 addr20으로 G-pools의 1시간 해시레이트, 미지급, 확인 중, 누적 지급을 봅니다. 코인은 주소 전체에 남습니다.",
    ja: "公開addr20でG-poolsの1時間ハッシュレート、未払い、承認待ち、累計支払を見ます。コインはアドレス全体のものです。",
  },
  summary: {
    zh: "先对地址，再读近 1 小时 H/s 和三笔金额。空白算力、零算力和查无此地址是三种不同情况。",
    "zh-TW": "先對地址，再讀近 1 小時 H/s 和三筆金額。空白算力、零算力與查無此地址是三種不同情況。",
    en: "Match the address first, then read the 1-hour H/s and the three coin figures. A blank rate, a zero rate, and “not found” are different outcomes.",
    ko: "주소를 맞춘 뒤 1시간 H/s와 세 금액 칸을 읽습니다. 빈 속도, 0, 없음을 구분하세요.",
    ja: "アドレスを合わせ、1時間H/sと三つの金額を読みます。空白、ゼロ、未検出は別です。",
  },
  sources,
  related: ["csd-pending-paid-rewards", "csd-worker-throughput-units", "csd-worker-not-found"],
  comparisonTitle: {
    zh: "页面上要分开看的数",
    "zh-TW": "頁面上要分開看的數",
    en: "Figures to read separately",
    ko: "따로 읽을 숫자",
    ja: "分けて読む数字",
  },
  comparison: {
    zh: {
      headers: ["你看到的", "含义", "不能当成"],
      rows: [
        ["近 1 小时平均算力", "矿池给出的约 1 小时平均，单位 H/s", "已经入账的 CSD"],
        ["未支付余额", "已确认、等待下次支付的金额", "某一台 Worker 的收入"],
        ["确认中金额", "已找到、尚未确认可支付的金额", "已经打到钱包的币"],
        ["累计已支付", "矿池记到该地址的历史支付合计", "今天或这一小时的新增"],
      ],
    },
    "zh-TW": {
      headers: ["你看到的", "含義", "不能當成"],
      rows: [
        ["近 1 小時平均算力", "礦池給出的約 1 小時平均，單位 H/s", "已經入帳的 CSD"],
        ["未支付餘額", "已確認、等待下次支付的金額", "某一台 Worker 的收入"],
        ["確認中金額", "已找到、尚未確認可支付的金額", "已經打到錢包的幣"],
        ["累計已支付", "礦池記到該地址的歷史支付合計", "今天或這一小時的新增"],
      ],
    },
    en: {
      headers: ["What you see", "What it means", "What it is not"],
      rows: [
        [
          "1-hour average hashrate",
          "Pool average over about one hour, in H/s",
          "CSD already credited",
        ],
        ["Unpaid balance", "Confirmed amount waiting for the next payout", "One Worker’s income"],
        ["Awaiting confirmations", "Found, not yet payable", "Coins already sent"],
        ["Lifetime paid", "Sum the pool has paid to this address", "Today’s or this hour’s gain"],
      ],
    },
    ko: {
      headers: ["보이는 값", "의미", "이것이 아닌 것"],
      rows: [
        ["1시간 평균 해시레이트", "풀의 약 1시간 평균, 단위 H/s", "이미 입금된 CSD"],
        ["미지급 잔액", "확인되어 다음 지급을 기다리는 금액", "Worker 한 대의 수입"],
        ["확인 중", "찾았으나 아직 지급 가능 전", "이미 보낸 코인"],
        ["누적 지급", "이 주소로 풀이 지급한 합계", "오늘 또는 이번 시간의 증가"],
      ],
    },
    ja: {
      headers: ["表示", "意味", "そうではないもの"],
      rows: [
        ["1時間平均ハッシュレート", "プールの約1時間平均。単位はH/s", "入金済みのCSD"],
        ["未払い残高", "確認済みで次回支払を待つ金額", "Worker1台の収入"],
        ["承認待ち", "見つかったがまだ支払可能でない", "送金済みのコイン"],
        ["累計支払", "このアドレスへの支払合計", "今日やこの1時間の増加"],
      ],
    },
  },
  body: {
    zh: [
      "在 [CSD 监控](/projects/csd) 填入矿工配置里的公开收益地址 addr20，即可看到 G-pools 上该地址的近 1 小时平均算力（H/s）、未支付余额、确认中金额和累计已支付。这四项回答的是「矿池现在怎么记这个地址」，不是预测今天能挖多少。",
      "算力是速率，单位是 H/s，不是 CSD 枚数。G-pools 挖矿说明里，矿机在线但没有份额时会出现 0 H/s；仪表盘另有约 5 分钟（标明为近似）和 6 小时窗口。本页固定采用近 1 小时平均。矿池网页上按支付窗口把已支付和未支付加在一起的「每小时 CSD」是估算，这里不把它写成每日收益，也不换算美元。",
      "未支付、确认中、累计已支付都属于这一份地址。多台矿机共用同一个 addr20 时，钱包数字不会按 Worker 切开，也不会因为你在列表里点了某个 Worker 就复制一份余额。",
      "## 先核对这几项",
      "- 地址是 40 位十六进制，可以带 0x。带不带 0x 是同一个地址。",
      "- 矿工程序指向的是 G-pools。本监控只查 csd.yamaduo.no 上的公开账户，不覆盖其他矿池。",
      "- 近 1 小时算力、未支付、确认中、累计已支付是否同时出现。缺某一项时，缺的就是缺，不要把空白读成 0。",
      "- 若矿池的速率快照大约超过 5 分钟，当前算力会空着，这和「一直是 0 H/s」不是同一件事。",
      "## 按你看到的结果处理",
      "- 有算力、未支付在增加：继续挖。是否达到支付，看未支付和矿池自己的最低支付，不看 H/s 高低。",
      "- 算力为 0，地址和历史支付还在：先看份额是否还在被接受、Worker 最近出现时间，不要立刻重装。",
      "- 整页查无此地址：回到矿工配置核对 addr20，并确认矿池侧还没有任何受理份额或支付记录。见 [查无 Worker 或地址](/learn/csd-worker-not-found)。",
      "- 三笔金额互相看不懂：打开 [未支付、确认中和已支付](/learn/csd-pending-paid-rewards)。",
      "## 示意读法（不是真实收益）",
      "假设地址已在矿池出现，近 1 小时显示 120 H/s，未支付 0.0004 CSD，确认中 0.0001 CSD，累计已支付 1.20 CSD。这只说明矿池账上如此。120 H/s 不能换算成「今天将到账多少」。0.0004 低于挖矿说明中的 0.001 CSD 最低支付时，未支付可以一直挂着。",
      "登录后可以把多个地址存成设备记录。每个项目免费 3 台已保存设备，Pro 100 台。同一条已保存设备上再绑同一项目的来源，不额外占名额。只是展开一个钱包下的 Worker，也不会自动占名额；若你把 Worker 另存成独立设备，那些记录会计入名额。同一地址的余额只保留一份。",
      "下一步：打开 [CSD 监控](/projects/csd)。算力窗口和 Worker 名称见 [算力单位](/learn/csd-worker-throughput-units)。",
    ],
    "zh-TW": [
      "在 [CSD 監控](/projects/csd) 填入礦工程式裡的公開收益地址 addr20，即可看到 G-pools 上該地址的近 1 小時平均算力（H/s）、未支付餘額、確認中金額和累計已支付。這四項回答的是「礦池現在怎麼記這個地址」，不是預測今天能挖多少。",
      "算力是速率，單位是 H/s，不是 CSD 枚數。G-pools 挖礦說明裡，礦機在線但沒有份額時會出現 0 H/s；儀表板另有約 5 分鐘（標明為近似）和 6 小時窗口。本頁固定採用近 1 小時平均。礦池網頁上把已支付和未支付按窗口加總的「每小時 CSD」是估算，這裡不把它寫成每日收益，也不換算美元。",
      "未支付、確認中、累計已支付都屬於這一份地址。多台礦機共用同一個 addr20 時，錢包數字不會按 Worker 切開，也不會因為你點了某個 Worker 就複製一份餘額。",
      "## 先核對這幾項",
      "- 地址是 40 位十六進位，可以帶 0x。有沒有 0x 是同一個地址。",
      "- 礦工程式指向的是 G-pools。本監控只查 csd.yamaduo.no 上的公開帳戶，不涵蓋其他礦池。",
      "- 近 1 小時算力、未支付、確認中、累計已支付是否同時出現。缺某一項時，缺的就是缺，不要把空白讀成 0。",
      "- 若礦池的速率快照大約超過 5 分鐘，目前算力會空著。這和「一直是 0 H/s」不是同一件事。",
      "## 按你看到的結果處理",
      "- 有算力、未支付在增加：繼續挖。是否達到支付，看未支付和礦池自己的最低支付，不看 H/s 高低。",
      "- 算力為 0，地址和歷史支付還在：先看份額是否仍被接受、Worker 最近出現時間，不要立刻重裝。",
      "- 整頁查無此地址：回到礦工設定核對 addr20，並確認礦池側還沒有任何受理份額或支付紀錄。見 [查無 Worker 或地址](/learn/csd-worker-not-found)。",
      "- 三筆金額對不上：打開 [未支付、確認中和已支付](/learn/csd-pending-paid-rewards)。",
      "## 示意讀法（不是真實收益）",
      "假設地址已在礦池出現，近 1 小時顯示 120 H/s，未支付 0.0004 CSD，確認中 0.0001 CSD，累計已支付 1.20 CSD。這只說明礦池帳上如此。120 H/s 不能換算成「今天將到帳多少」。0.0004 低於挖礦說明中的 0.001 CSD 最低支付時，未支付可以一直掛著。",
      "登入後可以把多個地址存成設備紀錄。每個專案免費 3 台已保存設備，Pro 100 台。同一條已保存設備上再綁同一專案的來源，不額外占名額。只是展開一個錢包下的 Worker，也不會自動占名額；若你把 Worker 另存成獨立設備，那些紀錄會計入名額。同一地址的餘額只保留一份。",
      "下一步：打開 [CSD 監控](/projects/csd)。算力窗口和 Worker 名稱見 [算力單位](/learn/csd-worker-throughput-units)。",
    ],
    en: [
      "Paste the public payout address (addr20) from your miner into [CSD monitoring](/projects/csd). You then see that address on G-pools: the about-1-hour average hashrate in H/s, the unpaid balance, the amount awaiting confirmations, and lifetime paid. Those fields describe how the pool currently accounts the address. They do not forecast today’s coins.",
      "Hashrate is a rate, not a count of CSD. The G-pools mining notes use 0 H/s when a rig is up but submitting no work. Their dashboard also shows an approximate 5-minute window and a 6-hour window. This page keeps the 1-hour average. The pool page’s “CSD per hour” adds paid and owed across a window and is an estimate. We do not relabel it as daily earnings or a dollar value.",
      "Unpaid, confirming, and lifetime paid belong to the whole address. When several rigs share one addr20, those coin figures are not split by Worker, and selecting a Worker does not duplicate the balance.",
      "## Check these first",
      "- The address is 40 hexadecimal characters. An optional 0x prefix is the same address.",
      "- The miner is aimed at G-pools. This monitor reads the public account on csd.yamaduo.no only.",
      "- See whether the 1-hour rate, unpaid, confirming, and lifetime paid are all present. A blank is unknown. Do not read a blank as zero.",
      "- If the pool’s rate snapshot is older than about five minutes, the current rate stays blank. That is different from a steady 0 H/s.",
      "## What to do with the result",
      "- Rate present and unpaid moving: keep mining. A payout depends on the unpaid balance and the pool’s own minimum, not on how high the H/s looks.",
      "- Rate is 0 but the address and older payments remain: check whether shares are still accepted and when the Worker was last seen. Do not reinstall on a short zero.",
      "- The whole lookup says the address was not found: recheck the addr20 in the miner, and whether the pool has any accepted shares or payments yet. See [address or Worker not found](/learn/csd-worker-not-found).",
      "- The three coin figures disagree with what you expected: open [unpaid, confirming, and paid](/learn/csd-pending-paid-rewards).",
      "## Illustrative reading (not actual income)",
      "Suppose the address is already on the pool, the 1-hour rate shows 120 H/s, unpaid is 0.0004 CSD, confirming is 0.0001 CSD, and lifetime paid is 1.20 CSD. That only restates the pool ledger. 120 H/s does not convert into coins due today. If 0.0004 is under the 0.001 CSD minimum stated in the mining instructions, unpaid can sit there.",
      "After you sign in, each saved address can be a device record. Free keeps three saved devices per project; Pro keeps 100. Extra bindings of the same project on one saved device do not add a slot. Listing the Workers under one wallet does not automatically use slots. Saving a Worker as its own device record does. The wallet balance is stored once.",
      "Next: open [CSD monitoring](/projects/csd). For windows and Worker names, see [hashrate units](/learn/csd-worker-throughput-units).",
    ],
    ko: [
      "[CSD 모니터](/projects/csd)에 채굴기 설정의 공개 보상 주소 addr20을 넣으면 G-pools에서 그 주소의 약 1시간 평균 해시레이트(H/s), 미지급 잔액, 확인 중 금액, 누적 지급을 봅니다. 이 네 칸은 풀이 지금 주소를 어떻게 적는지이며, 오늘 채굴량을 예측하지 않습니다.",
      "해시레이트는 속도이고 단위는 H/s이며 CSD 개수가 아닙니다. G-pools 채굴 안내에서 리그는 켜져 있으나 작업이 없으면 0 H/s가 됩니다. 대시보드에는 대략적인 5분 창과 6시간 창도 있습니다. 이 페이지는 1시간 평균만 씁니다. 풀 페이지의 ‘시간당 CSD’는 창 안의 지급과 미지급을 더한 추정치입니다. 일일 수익이나 달러로 바꾸지 않습니다.",
      "미지급, 확인 중, 누적 지급은 주소 전체의 값입니다. 여러 리그가 한 addr20을 쓰면 코인 숫자는 Worker별로 나뉘지 않고, Worker를 골라도 잔액이 복사되지 않습니다.",
      "## 먼저 확인할 것",
      "- 주소는 16진수 40자리입니다. 0x는 있어도 같은 주소입니다.",
      "- 채굴기가 G-pools를 향하는지 확인합니다. 이 모니터는 csd.yamaduo.no의 공개 계정만 읽습니다.",
      "- 1시간 속도, 미지급, 확인 중, 누적 지급이 모두 있는지 봅니다. 빈칸은 알 수 없음이며 0이 아닙니다.",
      "- 풀의 속도 스냅샷이 약 5분을 넘으면 현재 속도는 비어 있습니다. 계속 0 H/s인 것과 다릅니다.",
      "## 결과에 따른 행동",
      "- 속도가 있고 미지급이 움직이면 채굴을 유지합니다. 지급 여부는 미지급과 풀의 최소 지급액이지 H/s 높이가 아닙니다.",
      "- 속도가 0이어도 주소와 과거 지급이 있으면, 지분이 아직 받아들여지는지와 Worker가 마지막으로 보인 시각을 먼저 봅니다. 짧은 0만으로 재설치하지 마세요.",
      "- 주소 전체가 없음이면 채굴기의 addr20과, 풀에 접수 지분이나 지급 기록이 있는지를 다시 봅니다. [주소 또는 Worker 없음](/learn/csd-worker-not-found)을 보세요.",
      "- 세 금액이 기대와 다르면 [미지급·확인 중·지급](/learn/csd-pending-paid-rewards)을 엽니다.",
      "## 읽는 예시（실제 수익 아님）",
      "주소가 이미 풀에 있고 1시간 속도가 120 H/s, 미지급 0.0004 CSD, 확인 중 0.0001 CSD, 누적 지급 1.20 CSD라고 가정합니다. 이는 풀 장부를 옮긴 것뿐입니다. 120 H/s를 오늘 입금될 코인으로 바꾸지 마세요. 0.0004가 채굴 안내의 최소 0.001 CSD보다 낮으면 미지급은 그대로 남을 수 있습니다.",
      "로그인 후 주소마다 기기 기록으로 저장할 수 있습니다. 프로젝트당 무료 3대, Pro 100대입니다. 같은 저장 기기에 같은 프로젝트를 더 묶어도 자리는 늘지 않습니다. 지갑 아래 Worker를 펼치는 것만으로는 자리가 줄지 않습니다. Worker를 별도 기기로 저장하면 그 기록이 자리에 포함됩니다. 같은 주소의 잔액은 한 번만 둡니다.",
      "다음: [CSD 모니터](/projects/csd)를 엽니다. 창과 Worker 이름은 [해시레이트 단위](/learn/csd-worker-throughput-units)를 보세요.",
    ],
    ja: [
      "[CSD監視](/projects/csd)に、マイナー設定の公開報酬アドレス addr20 を入れると、G-pools上のそのアドレスについて、約1時間の平均ハッシュレート（H/s）、未払い残高、承認待ち、累計支払が見えます。四つはプールが今このアドレスをどう記帳しているかであり、今日の採掘量の予測ではありません。",
      "ハッシュレートは速度で、単位は H/s です。CSDの枚数ではありません。G-poolsの採掘説明では、リグは動いていても仕事がなければ 0 H/s になります。ダッシュボードにはおおよその5分窓と6時間窓もあります。このページは1時間平均だけを使います。プールページの「1時間あたりCSD」は窓内の支払と未払いを足した推定です。日次収益やドルにはしません。",
      "未払い、承認待ち、累計支払はアドレス全体の数字です。複数リグが一つの addr20 を共有してもコインは Worker ごとに分かれず、Worker を選んでも残高は複製されません。",
      "## 先に照合すること",
      "- アドレスは16進40文字です。0x の有無は同じアドレスです。",
      "- マイナーが G-pools を向いていること。この監視は csd.yamaduo.no の公開口座だけを読みます。",
      "- 1時間の速度、未払い、承認待ち、累計支払が揃っているか。空欄は不明であり、0ではありません。",
      "- プールの速度スナップショットが約5分より古いと、現在の速度は空のままです。ずっと 0 H/s とは別です。",
      "## 結果ごとの対処",
      "- 速度があり未払いが動く: 採掘を続ける。支払になるかは未払いとプール自身の最低額であり、H/s の高さではありません。",
      "- 速度が 0 でもアドレスと過去の支払が残る: シェアがまだ受理されているか、Worker の最終出現を先に見る。短いゼロで再インストールしない。",
      "- アドレス全体が見つからない: マイナーの addr20 と、プール側に受理シェアや支払記録があるかを見直す。[アドレスまたはWorkerが見つからない](/learn/csd-worker-not-found)を見る。",
      "- 三つの金額が期待と違う: [未払い・承認待ち・支払済み](/learn/csd-pending-paid-rewards)を開く。",
      "## 読み方の例（実際の収益ではない）",
      "アドレスが既にプールにあり、1時間が 120 H/s、未払い 0.0004 CSD、承認待ち 0.0001 CSD、累計支払 1.20 CSD だとします。これは台帳の写しです。120 H/s を今日入るコインには換えられません。0.0004 が採掘説明の最低 0.001 CSD 未満なら、未払いは残ったままであり得ます。",
      "ログイン後はアドレスを機器記録として保存できます。各プロジェクト無料3台、Proは100台です。同じ保存機器に同じプロジェクトを重ねても枠は増えません。一つのウォレットの Worker を広げるだけでは枠を使いません。Worker を別の機器記録にすると、その記録は枠に入ります。同じアドレスの残高は一つだけです。",
      "次: [CSD監視](/projects/csd)を開く。窓と Worker 名は[ハッシュレートの単位](/learn/csd-worker-throughput-units)を見る。",
    ],
  },
  questions: {
    zh: [
      {
        question: "算力高是否表示已经到账？",
        answer:
          "不是。H/s 只是近 1 小时速率。到账看累计已支付是否增加，以及未支付是否达到矿池最低支付。",
      },
      {
        question: "点某个 Worker 后余额为什么不变？",
        answer:
          "余额、确认中和累计支付属于整份 addr20。选择 Worker 只切换该名称的算力和最近出现，不拆分钱包。",
      },
      {
        question: "可以保存几个地址？",
        answer:
          "每个项目免费 3 台已保存设备，Pro 100 台。展开同一钱包下的 Worker 不自动占名额；另存成独立设备才会占用。带不带 0x 视为同一地址。",
      },
    ],
    "zh-TW": [
      {
        question: "算力高是否表示已經到帳？",
        answer:
          "不是。H/s 只是近 1 小時速率。到帳看累計已支付是否增加，以及未支付是否達到礦池最低支付。",
      },
      {
        question: "點某個 Worker 後餘額為什麼不變？",
        answer:
          "餘額、確認中和累計支付屬於整份 addr20。選擇 Worker 只切換該名稱的算力和最近出現，不拆分錢包。",
      },
      {
        question: "可以保存幾個地址？",
        answer:
          "每個專案免費 3 台已保存設備，Pro 100 台。展開同一錢包下的 Worker 不自動占名額；另存成獨立設備才會占用。有沒有 0x 視為同一地址。",
      },
    ],
    en: [
      {
        question: "Does a high hashrate mean coins arrived?",
        answer:
          "No. H/s is the recent 1-hour rate. Arrival shows up as an increase in lifetime paid, after unpaid meets the pool’s own minimum.",
      },
      {
        question: "Why does the balance stay the same when I pick a Worker?",
        answer:
          "Unpaid, confirming, and lifetime paid belong to the whole addr20. A Worker only changes that name’s rate and last-seen time.",
      },
      {
        question: "How many addresses can I save?",
        answer:
          "three saved devices per project on Free, 100 on Pro. Showing Workers under one wallet does not use a slot. Saving a Worker as its own device does. With or without 0x is one address.",
      },
    ],
    ko: [
      {
        question: "해시레이트가 높으면 입금된 것인가요?",
        answer:
          "아닙니다. H/s는 최근 1시간 속도입니다. 입금은 누적 지급이 늘 때 보이며, 그 전에 미지급이 풀의 최소액을 넘어야 합니다.",
      },
      {
        question: "Worker를 골라도 잔액이 같은 이유는?",
        answer:
          "미지급·확인 중·누적 지급은 addr20 전체입니다. Worker는 그 이름의 속도와 마지막 출현만 바꿉니다.",
      },
      {
        question: "주소는 몇 개까지 저장하나요?",
        answer:
          "프로젝트당 무료 3대, Pro 100대입니다. 한 지갑의 Worker를 펼치는 것은 자리를 쓰지 않습니다. Worker를 별도 기기로 저장하면 씁니다. 0x 유무는 같은 주소입니다.",
      },
    ],
    ja: [
      {
        question: "ハッシュレートが高いと着金ですか？",
        answer:
          "違います。H/sは直近1時間の速度です。着金は累計支払が増えたときで、その前に未払いがプールの最低額に達する必要があります。",
      },
      {
        question: "Workerを選んでも残高が同じなのは？",
        answer:
          "未払い・承認待ち・累計支払は addr20 全体です。Workerはその名前の速度と最終出現だけを変えます。",
      },
      {
        question: "アドレスはいくつ保存できますか？",
        answer:
          "各プロジェクト無料3台、Proは100台です。一つのウォレットのWorkerを広げるだけでは枠を使いません。Workerを別機器にすると使います。0xの有無は同一です。",
      },
    ],
  },
};

const addressSetup: Article = {
  slug: "csd-gpools-address-setup",
  project: "csd",
  published: "2026-10-24",
  modified: "2026-10-24",
  topic: {
    zh: "填写收益地址",
    "zh-TW": "填寫收益地址",
    en: "Payout address",
    ko: "보상 주소",
    ja: "報酬アドレス",
  },
  title: {
    zh: "CSD 的 addr20 从哪里复制，监控里该填哪一串？",
    "zh-TW": "CSD 的 addr20 從哪裡複製，監控裡該填哪一串？",
    en: "Where to copy the CSD addr20 and what to paste into monitoring",
    ko: "CSD addr20은 어디서 복사하고 모니터에는 무엇을 넣나",
    ja: "CSDのaddr20はどこからコピーし、監視には何を入れるか",
  },
  description: {
    zh: "监控只接受矿工 --address 使用的 40 位 addr20。不要填私钥、csd-wallet.txt、节点 RPC 或其他 G-pools 链的地址。",
    "zh-TW":
      "監控只接受礦工 --address 使用的 40 位 addr20。不要填私鑰、csd-wallet.txt、節點 RPC 或其他 G-pools 鏈的地址。",
    en: "Monitoring accepts only the 40-character addr20 used with the miner’s --address flag. Do not paste a private key, wallet file, RPC URL, or another G-pools chain.",
    ko: "모니터는 채굴기 --address의 40자리 addr20만 받습니다. 비밀키, 지갑 파일, RPC, 다른 G-pools 체인은 넣지 마세요.",
    ja: "監視が受け付けるのはマイナーの --address に使う40文字のaddr20だけです。秘密鍵、ウォレットファイル、RPC、他のG-poolsチェーンは入れません。",
  },
  summary: {
    zh: "从矿工配置或建钱包时打印的地址复制 40 位十六进制。0x 可有可无。支付仍由矿池打到这个地址。",
    "zh-TW":
      "從礦工設定或建立錢包時印出的地址複製 40 位十六進位。0x 可有可無。支付仍由礦池打到這個地址。",
    en: "Copy the 40 hex characters printed when you create the wallet or saved in the miner. 0x is optional. The pool still pays that address.",
    ko: "지갑을 만들 때 출력된 40자리 16진수를 복사합니다. 0x는 선택입니다. 지급은 그 주소로 갑니다.",
    ja: "ウォレット作成時に出た16進40文字をコピーします。0xは任意です。支払はそのアドレスへ行きます。",
  },
  sources,
  related: ["csd-gpools-monitor-guide", "csd-worker-not-found"],
  comparisonTitle: {
    zh: "哪一串可以贴进监控",
    "zh-TW": "哪一串可以貼進監控",
    en: "What you may paste",
    ko: "붙여도 되는 값",
    ja: "貼ってよいもの",
  },
  comparison: {
    zh: {
      headers: ["手里的东西", "能否用于查询", "原因"],
      rows: [
        ["40 位十六进制，可带 0x", "可以", "这就是矿工 --address 的 addr20"],
        ["csd-wallet.txt 里的私钥", "不要填", "查询只用公开地址；私钥会暴露资产"],
        ["节点 RPC 或引导节点", "不可以", "那是连网络的参数，不是收益地址"],
        ["另一条 G-pools 链上的地址", "不能当 CSD 用", "各池各记各的支付"],
        ["Worker 名称，例如 rig1", "不是地址", "名称只是标签，支付仍进裸地址"],
      ],
    },
    "zh-TW": {
      headers: ["手裡的東西", "能否用於查詢", "原因"],
      rows: [
        ["40 位十六進位，可帶 0x", "可以", "這就是礦工 --address 的 addr20"],
        ["csd-wallet.txt 裡的私鑰", "不要填", "查詢只用公開地址；私鑰會暴露資產"],
        ["節點 RPC 或引導節點", "不可以", "那是連網路的參數，不是收益地址"],
        ["另一條 G-pools 鏈上的地址", "不能當 CSD 用", "各池各記各的支付"],
        ["Worker 名稱，例如 rig1", "不是地址", "名稱只是標籤，支付仍進裸地址"],
      ],
    },
    en: {
      headers: ["What you have", "Use it to look up?", "Why"],
      rows: [
        ["40 hex characters, optional 0x", "Yes", "That is the miner’s --address addr20"],
        [
          "Private key inside csd-wallet.txt",
          "Do not paste",
          "Lookup needs the public address only",
        ],
        ["Node RPC or a bootnode", "No", "Those join the network; they are not a payout"],
        [
          "An address from another G-pools chain",
          "Not for this CSD page",
          "Each pool keeps its own payouts",
        ],
        [
          "A Worker name such as rig1",
          "Not an address",
          "The name is a label; pay still goes to the bare address",
        ],
      ],
    },
    ko: {
      headers: ["가진 값", "조회에 쓰나", "이유"],
      rows: [
        ["16진 40자리, 0x 가능", "예", "채굴기 --address의 addr20"],
        ["csd-wallet.txt의 비밀키", "넣지 말 것", "조회는 공개 주소만 필요"],
        ["노드 RPC 또는 부트노드", "아니오", "네트워크 접속용이며 보상 주소가 아님"],
        ["다른 G-pools 체인의 주소", "이 CSD 페이지용이 아님", "풀마다 지급이 따로임"],
        ["rig1 같은 Worker 이름", "주소가 아님", "이름은 표시이고 지급은 주소로 감"],
      ],
    },
    ja: {
      headers: ["手元のもの", "照会に使うか", "理由"],
      rows: [
        ["16進40文字。0x可", "使う", "マイナー --address のaddr20"],
        ["csd-wallet.txtの秘密鍵", "貼らない", "照会は公開アドレスだけ"],
        ["ノードRPCやブートノード", "不可", "接続用であり報酬アドレスではない"],
        ["別のG-poolsチェーンのアドレス", "このCSDページでは不可", "プールごとに支払が別"],
        ["rig1のようなWorker名", "アドレスではない", "名前は表示で、支払は素のアドレスへ"],
      ],
    },
  },
  body: {
    zh: [
      "监控要的是矿工参数 --address 后面的 addr20：40 位十六进制，前面的 0x 可写可不写。G-pools 挖矿说明写明，矿池地址已经编译进矿工程序，你不需要填写 stratum 主机；你要提供的就是这笔支付地址。支付会打到这个裸地址，和 Worker 名称无关。",
      "Compute Substrate 官网描述的是记录提案与见证的网络，节点启动用的是 datadir、RPC 和 genesis。那一串不是挖矿收益地址。不要把官网示例里的命令、引导节点或多地址列表贴进监控。",
      "## 从哪里复制",
      "- Windows：按挖矿说明运行 create-wallet.bat，复制它打印的地址。私钥在 csd-wallet.txt，只做离线备份，不要粘贴到网页。",
      "- 已有矿工程序：说明中的例子是用 newwallet 子命令打印新地址。同样只复制地址那一行。",
      "- 已经在挖：从矿工配置、HiveOS 的 Extra config arguments 里 --address 后面、或 Linux 环境变量 CSD_ADDR / CSD_ADDRESS 复制同一串。",
      "- 粘贴前数一数：去掉可选的 0x 后应剩 40 个 0-9 或 a-f 字符。大小写都可以。",
      "## 填进去之后",
      "- 打开 [CSD 监控](/projects/csd)，只贴这一串，然后保存。带 0x 和不带 0x 会收成同一个已保存设备，避免占两次名额。",
      "- 每个项目免费 3 台已保存设备，Pro 100 台。同一条已保存设备上再绑来源，不另占名额。只展开 Worker 不自动占名额；把 Worker 另存成设备才会占用。",
      "- 若页面说找不到：矿池还没有任何份额或支付，或贴错了链。先看 [查无地址](/learn/csd-worker-not-found)，不要改去填私钥。",
      "- Worker 名用 --worker，字符限于字母、数字、下划线和连字符，最长 24。solo 是保留名，会改成单独记块，不是普通标签。本页不跟踪 solo 的整块奖励。",
      "## 示意（不是真实钱包）",
      "正确形状像 40 个十六进制字符，例如以 ab 开头、以 9f 结尾的一长串。错误形状包括：一整份 csd-wallet.txt、http://127.0.0.1:8789、以及只写 rig1。示意图不要拿去链上查询。",
      "G-pools 挖矿说明写：余额超过 0.001 CSD 时大约每 30 分钟支付一次，矿池费 2.5%。那是矿池说明里的支付安排，不是这台机器已经到账的时刻。地址填对之后如何读金额，见 [结算三笔数](/learn/csd-pending-paid-rewards)。",
      "下一步：地址贴进 [CSD 监控](/projects/csd)。已经能打开账户后，用 [算力与支付总览](/learn/csd-gpools-monitor-guide) 读数。",
    ],
    "zh-TW": [
      "監控要的是礦工參數 --address 後面的 addr20：40 位十六進位，前面的 0x 可寫可不寫。G-pools 挖礦說明寫明，礦池位址已經編譯進礦工程式，你不需要填 stratum 主機；你要提供的就是這筆支付地址。支付會打到這個裸地址，和 Worker 名稱無關。",
      "Compute Substrate 官網描述的是記錄提案與見證的網路，節點啟動用的是 datadir、RPC 和 genesis。那一串不是挖礦收益地址。不要把官網範例裡的命令、引導節點或多地址列表貼進監控。",
      "## 從哪裡複製",
      "- Windows：按挖礦說明執行 create-wallet.bat，複製它印出的地址。私鑰在 csd-wallet.txt，只做離線備份，不要貼到網頁。",
      "- 已有礦工程式：說明中的例子是用 newwallet 子命令印出新地址。同樣只複製地址那一行。",
      "- 已經在挖：從礦工設定、HiveOS 的 Extra config arguments 裡 --address 後面、或 Linux 環境變數 CSD_ADDR / CSD_ADDRESS 複製同一串。",
      "- 貼上前數一數：去掉可選的 0x 後應剩 40 個 0-9 或 a-f 字元。大小寫都可以。",
      "## 填進去之後",
      "- 打開 [CSD 監控](/projects/csd)，只貼這一串，然後儲存。有 0x 和沒有 0x 會收成同一個已保存設備，避免占兩次名額。",
      "- 每個專案免費 3 台已保存設備，Pro 100 台。同一條已保存設備上再綁來源，不另占名額。只展開 Worker 不自動占名額；把 Worker 另存成設備才會占用。",
      "- 若頁面說找不到：礦池還沒有任何份額或支付，或貼錯了鏈。先看 [查無地址](/learn/csd-worker-not-found)，不要改去填私鑰。",
      "- Worker 名用 --worker，字元限於字母、數字、底線和連字號，最長 24。solo 是保留名，會改成單獨記塊，不是普通標籤。本頁不追蹤 solo 的整塊獎勵。",
      "## 示意（不是真實錢包）",
      "正確形狀像 40 個十六進位字元，例如以 ab 開頭、以 9f 結尾的一長串。錯誤形狀包括：一整份 csd-wallet.txt、http://127.0.0.1:8789、以及只寫 rig1。示意圖不要拿去鏈上查詢。",
      "G-pools 挖礦說明寫：餘額超過 0.001 CSD 時大約每 30 分鐘支付一次，礦池費 2.5%。那是礦池說明裡的支付安排，不是這台機器已經到帳的時刻。地址填對之後如何讀金額，見 [結算三筆數](/learn/csd-pending-paid-rewards)。",
      "下一步：地址貼進 [CSD 監控](/projects/csd)。已經能打開帳戶後，用 [算力與支付總覽](/learn/csd-gpools-monitor-guide) 讀數。",
    ],
    en: [
      "The monitor wants the addr20 after the miner’s --address flag: 40 hexadecimal characters, with or without a leading 0x. The G-pools mining instructions say the pool endpoint is compiled into the miner, so you do not type a stratum host. What you supply is this payout address. Payouts go to that bare address. The Worker name does not change the destination.",
      "The Compute Substrate site describes a network that records proposals and attestations. Starting a node uses a datadir, an RPC port, and a genesis file. That is not a mining payout address. Do not paste sample commands, bootnode lists, or multi-address lines into monitoring.",
      "## Where to copy it",
      "- On Windows, run create-wallet.bat as the mining notes describe and copy the address it prints. The private key stays in csd-wallet.txt as an offline backup. Never paste that file into a web page.",
      "- If you already have the miner, the notes use the newwallet subcommand to print a new address. Copy only the address line.",
      "- If you are already mining, copy the same string from the miner config, from --address inside HiveOS Extra config arguments, or from the Linux variables CSD_ADDR or CSD_ADDRESS.",
      "- Before you paste, drop the optional 0x and count 40 characters from 0-9 and a-f. Letter case does not matter.",
      "## After you paste",
      "- Open [CSD monitoring](/projects/csd), paste that one string, and save. With and without 0x collapse to one saved device, so you do not spend two slots.",
      "- Free is three saved devices per project; Pro is 100. Extra sources on the same saved device do not add a slot. Listing Workers under one wallet does not use a slot. Saving a Worker as its own device does.",
      "- If the page says the address was not found, the pool has no shares or payments yet, or the string is from another chain. Read [not found](/learn/csd-worker-not-found). Do not switch to pasting the private key.",
      "- A rig label uses --worker. Allowed characters are letters, digits, underscore, and hyphen, up to 24. The name solo is reserved and changes how a block is credited. It is not an ordinary label. This page does not track a solo full-block reward.",
      "## Shape check (not a real wallet)",
      "A usable value looks like 40 hex characters, for example a string that starts with ab and ends with 9f. Unusable values include a whole csd-wallet.txt, http://127.0.0.1:8789, and the word rig1 alone. Do not look those examples up on a chain.",
      "The G-pools mining notes say balances over 0.001 CSD pay about every 30 minutes, with a 2.5% pool fee. That is the pool’s stated schedule, not a time this page has confirmed in a wallet. Once the address opens, read the three amounts in [pending and paid](/learn/csd-pending-paid-rewards).",
      "Next: paste the address into [CSD monitoring](/projects/csd). When the account opens, use the [hashrate and payments overview](/learn/csd-gpools-monitor-guide).",
    ],
    ko: [
      "모니터가 받는 값은 채굴기 --address 뒤의 addr20입니다. 16진수 40자리이며 앞의 0x는 있어도 됩니다. G-pools 채굴 안내는 풀 주소가 채굴기에 들어 있어 stratum 호스트를 직접 넣지 않는다고 합니다. 필요한 것은 이 지급 주소입니다. 지급은 이 주소로 가며 Worker 이름은 목적지를 바꾸지 않습니다.",
      "Compute Substrate 사이트는 제안과 증명을 기록하는 네트워크를 설명합니다. 노드 시작은 datadir, RPC, genesis를 씁니다. 그것은 채굴 보상 주소가 아닙니다. 예시 명령, 부트노드 목록, 여러 주소가 한 줄에 있는 값은 모니터에 넣지 마세요.",
      "## 어디서 복사하나",
      "- Windows에서는 채굴 안내대로 create-wallet.bat을 실행하고 출력된 주소를 복사합니다. 비밀키는 csd-wallet.txt에 두어 오프라인으로만 보관하고, 웹페이지에 붙이지 마세요.",
      "- 채굴기가 이미 있으면 안내의 newwallet 하위 명령이 새 주소를 출력합니다. 주소 줄만 복사합니다.",
      "- 이미 채굴 중이면 채굴기 설정, HiveOS Extra config arguments의 --address 뒤, 또는 Linux의 CSD_ADDR / CSD_ADDRESS에서 같은 문자열을 복사합니다.",
      "- 붙이기 전에 선택적 0x를 빼고 0-9와 a-f가 40자인지 셉니다. 대소문자는 상관없습니다.",
      "## 붙인 다음",
      "- [CSD 모니터](/projects/csd)를 열고 그 한 줄만 저장합니다. 0x가 있든 없든 저장된 기기 하나로 합쳐져 자리를 두 번 쓰지 않습니다.",
      "- 프로젝트당 무료 저장 기기 3대, Pro 100대입니다. 같은 저장 기기에 출처를 더 묶어도 자리는 늘지 않습니다. 지갑 아래 Worker를 펼치는 것만으로는 자리가 줄지 않습니다. Worker를 별도 기기로 저장하면 그 기록이 자리에 포함됩니다.",
      "- 주소를 찾을 수 없다고 하면 풀에 아직 지분이나 지급이 없거나, 다른 체인의 문자열입니다. [없음](/learn/csd-worker-not-found)을 읽고 비밀키로 바꾸지 마세요.",
      "- 리그 이름은 --worker입니다. 문자, 숫자, 밑줄, 하이픈, 최대 24자입니다. solo는 예약어라 블록 기입 방식이 바뀝니다. 보통 라벨이 아닙니다. 이 페이지는 솔로 블록 전체 보상을 추적하지 않습니다.",
      "## 모양 예시（실제 지갑 아님）",
      "쓸 수 있는 값은 16진 40자입니다. 예를 들어 ab로 시작해 9f로 끝나는 문자열입니다. 쓸 수 없는 값은 csd-wallet.txt 전체, http://127.0.0.1:8789, rig1만 있는 경우입니다. 이 예시를 체인에서 조회하지 마세요.",
      "G-pools 채굴 안내는 잔액이 0.001 CSD를 넘으면 약 30분마다 지급되고 풀 수수료는 2.5%라고 적습니다. 그 문장은 풀이 적은 지급 간격이지, 이 페이지가 지갑 입금 시각을 확인한 것은 아닙니다. 주소가 열리면 [미지급과 지급](/learn/csd-pending-paid-rewards)에서 세 금액을 읽습니다.",
      "다음: 주소를 [CSD 모니터](/projects/csd)에 붙입니다. 계정이 열리면 [해시레이트와 지급 개요](/learn/csd-gpools-monitor-guide)로 읽습니다.",
    ],
    ja: [
      "監視が求めるのはマイナーの --address のうしろの addr20 です。16進40文字で、先頭の 0x はあってもなくても構いません。G-poolsの採掘説明では、プール端点はマイナーに組み込まれているので stratum のホストは入力しません。渡すのはこの支払アドレスです。支払はその素のアドレスへ行き、Worker名は宛先を変えません。",
      "Compute Substrate のサイトは、提案と証明を記録するネットワークを説明しています。ノード起動は datadir、RPC、genesis を使います。それは採掘の報酬アドレスではありません。例のコマンド、ブートノード一覧、複数アドレスの行を監視に貼らないでください。",
      "## どこからコピーするか",
      "- Windowsでは採掘説明どおり create-wallet.bat を実行し、表示されたアドレスをコピーします。秘密鍵は csd-wallet.txt に残し、オフラインの控えにします。そのファイルをウェブページへ貼らない。",
      "- マイナーが既にある場合、説明の newwallet サブコマンドが新しいアドレスを出します。アドレスの行だけコピーします。",
      "- 既に採掘中なら、マイナー設定、HiveOS の Extra config arguments 内の --address のうしろ、または Linux の CSD_ADDR / CSD_ADDRESS から同じ文字列をコピーします。",
      "- 貼る前に任意の 0x を外し、0-9 と a-f が40文字か数えます。大文字小文字は問いません。",
      "## 貼ったあと",
      "- [CSD監視](/projects/csd)を開き、その1本だけ保存します。0x の有無は保存機器一つにまとまり、枠を二つ使いません。",
      "- 各プロジェクト無料3台、Proは100台です。同じ保存機器に出典を重ねても枠は増えません。ウォレットの下の Worker を広げるだけでは枠を使いません。Worker を別の機器として保存すると、その記録が枠に入ります。",
      "- 見つからないと言われたら、プールにまだシェアも支払もないか、別チェーンの文字列です。[見つからない場合](/learn/csd-worker-not-found)を読み、秘密鍵に切り替えない。",
      "- リグ名は --worker です。文字、数字、アンダースコア、ハイフン、最大24です。solo は予約名で、ブロックの記帳の仕方が変わります。普通のラベルではありません。このページはソロのブロック全額を追いません。",
      "## 形の例（実在のウォレットではない）",
      "使える値は16進40文字です。たとえば ab で始まり 9f で終わる文字列です。使えないのは csd-wallet.txt 全体、http://127.0.0.1:8789、rig1 だけ、です。この例をチェーンで調べないでください。",
      "G-pools の採掘説明には、残高が 0.001 CSD を超えると約30分ごとに支払い、プール手数料は 2.5% とあります。それはプールが書いた支払の間隔であり、このページがウォレット着金を確認した時刻ではありません。アドレスが開けたら[未払いと支払](/learn/csd-pending-paid-rewards)で三つの金額を読みます。",
      "次: アドレスを [CSD監視](/projects/csd) に貼る。口座が開けたら[ハッシュレートと支払の概要](/learn/csd-gpools-monitor-guide)で読む。",
    ],
  },
  questions: {
    zh: [
      {
        question: "0x 要不要保留？",
        answer: "两种都能查。保存时会收成不带 0x 的同一地址，不会占两台设备。",
      },
      {
        question: "Worker 名能代替地址吗？",
        answer: "不能。rig1 这类名字只显示在矿池的矿机列表。支付和本页查询都用裸 addr20。",
      },
      {
        question: "官网的节点命令能当收益地址吗？",
        answer:
          "不能。官网讲的是提案与见证网络和节点启动参数。挖矿查询只用 G-pools 矿工里的 addr20。",
      },
    ],
    "zh-TW": [
      {
        question: "0x 要不要保留？",
        answer: "兩種都能查。儲存時會收成不帶 0x 的同一地址，不會占兩台設備。",
      },
      {
        question: "Worker 名能代替地址嗎？",
        answer: "不能。rig1 這類名字只顯示在礦池的礦機列表。支付和本頁查詢都用裸 addr20。",
      },
      {
        question: "官網的節點命令能當收益地址嗎？",
        answer:
          "不能。官網講的是提案與見證網路和節點啟動參數。挖礦查詢只用 G-pools 礦工裡的 addr20。",
      },
    ],
    en: [
      {
        question: "Should I keep the 0x prefix?",
        answer:
          "Either form looks up. Saving stores one address without 0x, so it does not take two device slots.",
      },
      {
        question: "Can a Worker name replace the address?",
        answer:
          "No. A name such as rig1 only labels a rig on the pool. Payouts and this lookup both use the bare addr20.",
      },
      {
        question: "Can I use a node command from the project site?",
        answer:
          "No. That site describes proposals, attestations, and node startup. Mining lookup uses the addr20 from the G-pools miner.",
      },
    ],
    ko: [
      {
        question: "0x를 남겨야 하나요?",
        answer: "둘 다 조회됩니다. 저장하면 0x 없는 주소 하나로 합쳐져 기기 두 대를 쓰지 않습니다.",
      },
      {
        question: "Worker 이름이 주소를 대신하나요?",
        answer:
          "아닙니다. rig1 같은 이름은 풀의 리그 표시입니다. 지급과 이 조회는 모두 addr20을 씁니다.",
      },
      {
        question: "공식 사이트의 노드 명령을 주소로 쓸 수 있나요?",
        answer:
          "아닙니다. 그 사이트는 제안·증명과 노드 시작을 설명합니다. 채굴 조회는 G-pools 채굴기의 addr20만 씁니다.",
      },
    ],
    ja: [
      {
        question: "0xは残しますか？",
        answer:
          "どちらでも照会できます。保存時は0xなしの一つのアドレスになり、機器枠を二つ使いません。",
      },
      {
        question: "Worker名でアドレスの代わりになりますか？",
        answer:
          "なりません。rig1のような名前はプール上の表示です。支払もこの照会も素のaddr20を使います。",
      },
      {
        question: "公式サイトのノードコマンドをアドレスにできますか？",
        answer:
          "できません。あのサイトは提案・証明とノード起動の説明です。採掘の照会はG-poolsマイナーのaddr20だけです。",
      },
    ],
  },
};

const throughput: Article = {
  slug: "csd-worker-throughput-units",
  project: "csd",
  published: "2026-10-24",
  modified: "2026-10-24",
  topic: {
    zh: "算力单位和 Worker",
    "zh-TW": "算力單位和 Worker",
    en: "Hashrate units",
    ko: "해시레이트 단위",
    ja: "算力の単位",
  },
  title: {
    zh: "CSD 的 H/s 和 Worker 算力分别表示什么？",
    "zh-TW": "CSD 的 H/s 和 Worker 算力分別表示什麼？",
    en: "What CSD H/s and per-Worker hashrate mean",
    ko: "CSD의 H/s와 Worker별 해시레이트는 무엇을 뜻하나",
    ja: "CSDのH/sとWorkerごとのハッシュレートは何を表すか",
  },
  description: {
    zh: "账户和每台 Worker 都显示矿池的近 1 小时平均，单位 H/s。它不是 CSD 枚数，也不证明机器一定是 GPU 或 ASIC。",
    "zh-TW":
      "帳戶和每台 Worker 都顯示礦池的近 1 小時平均，單位 H/s。它不是 CSD 枚數，也不證明機器一定是 GPU 或 ASIC。",
    en: "The account and each Worker show the pool’s about-1-hour average in H/s. That is not a count of CSD and does not prove GPU or ASIC hardware.",
    ko: "계정과 각 Worker는 풀의 약 1시간 평균을 H/s로 보여 줍니다. CSD 개수도, GPU나 ASIC라는 증명도 아닙니다.",
    ja: "口座と各Workerはプールの約1時間平均をH/sで示します。CSDの枚数でも、GPUやASICである証明でもありません。",
  },
  summary: {
    zh: "对照同一窗口。矿池仪表盘的 5 分钟是近似值，6 小时是另一段。本页只用近 1 小时。Worker 名称来自 --worker，不是物理台数。",
    "zh-TW":
      "對照同一窗口。礦池儀表板的 5 分鐘是近似值，6 小時是另一段。本頁只用近 1 小時。Worker 名稱來自 --worker，不是物理台數。",
    en: "Compare the same window. The pool’s 5-minute figure is approximate and 6 hours is another span. This page uses about one hour. A Worker name comes from --worker, not from a machine count.",
    ko: "같은 창끼리 비교하세요. 풀의 5분은 대략값이고 6시간은 다른 구간입니다. 이 페이지는 약 1시간입니다. Worker 이름은 --worker에서 오며 물리 대수가 아닙니다.",
    ja: "同じ窓どうしで比べます。プールの5分は概算、6時間は別の区間です。このページは約1時間です。Worker名は --worker 由来で、物理台数ではありません。",
  },
  sources,
  related: ["csd-gpools-monitor-guide", "csd-worker-not-found"],
  comparisonTitle: {
    zh: "速率窗口不要混读",
    "zh-TW": "速率窗口不要混讀",
    en: "Do not mix rate windows",
    ko: "속도 창을 섞지 않기",
    ja: "速度の窓を混ぜない",
  },
  comparison: {
    zh: {
      headers: ["数字", "窗口", "怎么用"],
      rows: [
        ["本页账户算力", "近 1 小时平均，H/s", "和矿池同一地址的 1 小时列对照"],
        ["本页某个 Worker", "该名称的近 1 小时，H/s", "只代表这个标签，不代表整机钱包"],
        ["矿池 5 分钟", "说明中标为近似", "和 1 小时不一致时，先分清窗口"],
        ["矿池 6 小时", "更长一段的平均", "不能拿来否定刚恢复的 1 小时"],
        ["每小时 CSD", "已支付加未支付的窗口估算", "不是 H/s，也不是本页的每日收益"],
      ],
    },
    "zh-TW": {
      headers: ["數字", "窗口", "怎麼用"],
      rows: [
        ["本頁帳戶算力", "近 1 小時平均，H/s", "和礦池同一地址的 1 小時列對照"],
        ["本頁某個 Worker", "該名稱的近 1 小時，H/s", "只代表這個標籤，不代表整機錢包"],
        ["礦池 5 分鐘", "說明中標為近似", "和 1 小時不一致時，先分清窗口"],
        ["礦池 6 小時", "更長一段的平均", "不能拿來否定剛恢復的 1 小時"],
        ["每小時 CSD", "已支付加未支付的窗口估算", "不是 H/s，也不是本頁的每日收益"],
      ],
    },
    en: {
      headers: ["Figure", "Window", "How to use it"],
      rows: [
        [
          "Account rate on this page",
          "About 1 hour, H/s",
          "Match the pool’s 1-hour column for the same address",
        ],
        [
          "One Worker on this page",
          "That name’s about 1 hour, H/s",
          "That label only, not the wallet",
        ],
        [
          "Pool 5-minute rate",
          "Marked approximate in the notes",
          "If it disagrees with 1 hour, separate the windows first",
        ],
        [
          "Pool 6-hour rate",
          "A longer average",
          "Does not cancel a 1-hour rate that just recovered",
        ],
        [
          "CSD per hour on the pool page",
          "Window estimate of paid plus owed",
          "Not H/s, and not a daily figure here",
        ],
      ],
    },
    ko: {
      headers: ["숫자", "창", "쓰는 법"],
      rows: [
        ["이 페이지의 계정 속도", "약 1시간, H/s", "같은 주소의 풀 1시간 열과 맞춤"],
        ["이 페이지의 Worker", "그 이름의 약 1시간, H/s", "그 라벨만이며 지갑 전체가 아님"],
        ["풀의 5분", "안내에서 대략값", "1시간과 다르면 창부터 구분"],
        ["풀의 6시간", "더 긴 평균", "방금 회복한 1시간을 부정하지 않음"],
        ["풀 페이지의 시간당 CSD", "지급+미지급의 창 추정", "H/s도, 이 페이지의 일일도 아님"],
      ],
    },
    ja: {
      headers: ["数字", "窓", "使い方"],
      rows: [
        ["このページの口座速度", "約1時間、H/s", "同じアドレスのプール1時間列と合わせる"],
        ["このページのWorker", "その名前の約1時間、H/s", "そのラベルだけでウォレット全体ではない"],
        ["プールの5分", "説明では概算", "1時間と違うときは窓を先に分ける"],
        ["プールの6時間", "より長い平均", "戻ったばかりの1時間を打ち消さない"],
        [
          "プールページの時間あたりCSD",
          "支払＋未払いの窓の推定",
          "H/sでも、このページの日次でもない",
        ],
      ],
    },
  },
  body: {
    zh: [
      "本页的算力是 G-pools 对该地址或该 Worker 名称的近 1 小时平均，单位写成 H/s。矿工程序说明里，显卡或 CPU 后端在线但没有工作量时，会表现为 0 H/s。所以 H/s 是速率单位，不是「一定在用 ASIC」或「一定在用某张 GPU」的证明。官方安装说明同时提供 NVIDIA、AMD 和 CPU 构建。",
      "账户上的 H/s 和某一 Worker 的 H/s 可以不同。账户是这一份地址在近 1 小时的合计视角；Worker 只带你在矿工里用 --worker 起的名字。旧矿机没有名字时，矿池说明写明会显示为 default。名字最长 24，只作显示；支付仍然进裸地址。",
      "## 对照时看什么",
      "- 在矿池页面找到同一 addr20 的 Hashrate (1h)，再看本页的近 1 小时。不要拿 5 分钟列来要求两边相等。",
      "- 5 分钟在挖矿说明里标明为近似。刚启动或刚恢复时，它和 1 小时经常差一截。",
      "- 6 小时更慢。1 小时已经回到正数，6 小时仍低，只说明长窗口还含着更早的停机。",
      "- 矿池上的「CSD / hour」写成 paid + owed 的窗口平均。那是币的估算，不是 H/s，本页不把它填进每日收益。",
      "- 速率快照大约旧于 5 分钟时，本页的当前算力留空。空白不是 0。",
      "## 活跃和名称",
      "- Worker 是否标成活跃，看矿池记下的最近出现，大约 15 分钟内算活跃。这不是你电脑进程的心跳，也不是 HiveOS 在线灯。",
      "- 选择某个 Worker 只改你看到的速率和最近出现。未支付不会按名称拆开。",
      "- 两个名字可以来自同一台机器上的两次启动，也可以来自两台机器。单凭名字个数不能当物理台数，也不能当设备名额。",
      "- 名字写成 solo 时，挖矿说明说这台改为单独挖块，份额不进矿池分配。那不是普通的算力标签。",
      "## 示意（不是实测算力）",
      "假设账户近 1 小时是 200 H/s，名为 rig-a 的是 120 H/s，名为 rig-b 的是 80 H/s。这只说明两个标签在这一小时的速率大致相加。它不表示今天会多出 200 枚 CSD，也不表示你有两张特定型号的卡。若仪表盘 5 分钟是 40 H/s，先承认窗口不同，再看份额是否仍在增加。",
      "下一步：在 [CSD 监控](/projects/csd) 对一下 1 小时列。某个名字消失而地址还在时，看 [查无 Worker](/learn/csd-worker-not-found)。地址和三笔金额的读法见 [监控总览](/learn/csd-gpools-monitor-guide)。",
    ],
    "zh-TW": [
      "本頁的算力是 G-pools 對該地址或該 Worker 名稱的近 1 小時平均，單位寫成 H/s。礦工程式說明裡，顯示卡或 CPU 後端在線但沒有工作量時，會表現為 0 H/s。所以 H/s 是速率單位，不是「一定在用 ASIC」或「一定在用某張 GPU」的證明。官方安裝說明同時提供 NVIDIA、AMD 和 CPU 組建。",
      "帳戶上的 H/s 和某一 Worker 的 H/s 可以不同。帳戶是這一份地址在近 1 小時的合計視角；Worker 只帶你在礦工裡用 --worker 起的名字。舊礦機沒有名字時，礦池說明寫明會顯示為 default。名字最長 24，只作顯示；支付仍然進裸地址。",
      "## 對照時看什麼",
      "- 在礦池頁面找到同一 addr20 的 Hashrate (1h)，再看本頁的近 1 小時。不要拿 5 分鐘列來要求兩邊相等。",
      "- 5 分鐘在挖礦說明裡標明為近似。剛啟動或剛恢復時，它和 1 小時經常差一截。",
      "- 6 小時更慢。1 小時已經回到正數，6 小時仍低，只說明長窗口還含著更早的停機。",
      "- 礦池上的「CSD / hour」寫成 paid + owed 的窗口平均。那是幣的估算，不是 H/s，本頁不把它填進每日收益。",
      "- 速率快照大約舊於 5 分鐘時，本頁的目前算力留空。空白不是 0。",
      "## 活躍和名稱",
      "- Worker 是否標成活躍，看礦池記下的最近出現，大約 15 分鐘內算活躍。這不是你電腦行程的心跳，也不是 HiveOS 在線燈。",
      "- 選擇某個 Worker 只改你看到的速率和最近出現。未支付不會按名稱拆開。",
      "- 兩個名字可以來自同一台機器上的兩次啟動，也可以來自兩台機器。單憑名字個數不能當物理台數，也不能當設備名額。",
      "- 名字寫成 solo 時，挖礦說明說這台改為單獨挖塊，份額不進礦池分配。那不是普通的算力標籤。",
      "## 示意（不是實測算力）",
      "假設帳戶近 1 小時是 200 H/s，名為 rig-a 的是 120 H/s，名為 rig-b 的是 80 H/s。這只說明兩個標籤在這一小時的速率大致相加。它不表示今天會多出 200 枚 CSD，也不表示你有兩張特定型號的卡。若儀表板 5 分鐘是 40 H/s，先承認窗口不同，再看份額是否仍在增加。",
      "下一步：在 [CSD 監控](/projects/csd) 對一下 1 小時列。某個名字消失而地址還在時，看 [查無 Worker](/learn/csd-worker-not-found)。地址和三筆金額的讀法見 [監控總覽](/learn/csd-gpools-monitor-guide)。",
    ],
    en: [
      "The rate on this page is G-pools’ about-1-hour average for the address or for one Worker name, shown in H/s. The miner notes use 0 H/s when a GPU or CPU backend is up but has no work. H/s is a rate unit. It does not prove the machine is an ASIC, or that a particular GPU is installed. The install notes ship NVIDIA, AMD, and CPU builds.",
      "The account H/s and one Worker’s H/s can differ. The account is the address’s combined view for that hour. A Worker is the name you set with --worker. The pool notes say a legacy miner with no name shows as default. Names are at most 24 characters and are display labels. Pay still goes to the bare address.",
      "## What to line up",
      "- On the pool page, find Hashrate (1h) for the same addr20, then read the 1-hour figure here. Do not require the 5-minute column to match.",
      "- The mining notes mark the 5-minute rate as approximate. Right after a start or a recovery it often disagrees with the 1-hour rate.",
      "- Six hours moves more slowly. A 1-hour rate that is positive again while 6 hours is still low means the long window still includes the earlier stop.",
      "- The pool’s “CSD / hour” is described as a window average of paid plus owed. That is an estimate in coins, not H/s. This page does not store it as daily earnings.",
      "- When the rate snapshot is older than about five minutes, the current rate here stays blank. Blank is not zero.",
      "## Activity and names",
      "- A Worker is marked active from the pool’s last-seen time, about 15 minutes. That is not a heartbeat from your computer and not the HiveOS online lamp.",
      "- Choosing a Worker changes the rate and last-seen time you see. Unpaid is not split by name.",
      "- Two names can be two starts on one machine or two machines. The count of names is not a physical machine count and not a count of saved-device slots.",
      "- The mining notes say the name solo switches that rig to solo block hunting and keeps its shares out of the pool split. That is not an ordinary rate label.",
      "## Illustrative rates (not a live reading)",
      "Suppose the account’s last hour is 200 H/s, rig-a is 120 H/s, and rig-b is 80 H/s. That only says the two labels roughly add for that hour. It does not mean 200 CSD will appear today, and it does not name two card models. If the dashboard’s 5-minute figure is 40 H/s, separate the windows before you look at whether shares are still climbing.",
      "Next: compare the 1-hour column on [CSD monitoring](/projects/csd). If a name disappears while the address remains, see [Worker not found](/learn/csd-worker-not-found). How to read the address and the three amounts is in the [monitor overview](/learn/csd-gpools-monitor-guide).",
    ],
    ko: [
      "이 페이지의 속도는 G-pools가 그 주소 또는 Worker 이름에 대해 낸 약 1시간 평균이며 단위는 H/s입니다. 채굴기 안내에서 GPU나 CPU 백엔드가 켜져 있어도 작업이 없으면 0 H/s로 나옵니다. H/s는 속도 단위입니다. ASIC이라는 증명도, 특정 GPU가 달려 있다는 증명도 아닙니다. 설치 안내에는 NVIDIA, AMD, CPU 빌드가 있습니다.",
      "계정의 H/s와 Worker 하나의 H/s는 다를 수 있습니다. 계정은 그 시간의 주소 합계이고, Worker는 --worker로 붙인 이름입니다. 풀 안내는 이름이 없는 예전 채굴기는 default로 보인다고 합니다. 이름은 최대 24자이고 표시용입니다. 지급은 주소로 갑니다.",
      "## 맞출 때 볼 것",
      "- 풀 페이지에서 같은 addr20의 Hashrate (1h)를 찾고, 이 페이지의 1시간과 비교합니다. 5분 열이 같기를 요구하지 마세요.",
      "- 채굴 안내는 5분을 대략값으로 표시합니다. 시작이나 복구 직후에는 1시간과 자주 다릅니다.",
      "- 6시간은 더 천천히 움직입니다. 1시간은 다시 양수인데 6시간이 낮으면, 긴 창에 이전 중지가 남아 있는 것입니다.",
      "- 풀의 ‘CSD / hour’는 지급과 미지급을 더한 창 평균으로 적혀 있습니다. 코인 추정치이지 H/s가 아닙니다. 이 페이지는 그것을 일일 수익으로 넣지 않습니다.",
      "- 속도 스냅샷이 약 5분보다 오래되면 현재 속도는 비어 있습니다. 빈칸은 0이 아닙니다.",
      "## 활성과 이름",
      "- Worker 활성은 풀이 기록한 마지막 출현으로, 약 15분 안입니다. PC 프로세스의 심장박동도, HiveOS 온라인 등도 아닙니다.",
      "- Worker를 고르면 보이는 속도와 마지막 출현만 바뀝니다. 미지급은 이름별로 나뉘지 않습니다.",
      "- 이름 두 개는 한 기계의 두 번 시작일 수도, 기계 두 대일 수도 있습니다. 이름 개수는 물리 대수도, 저장 기기 자리도 아닙니다.",
      "- 채굴 안내는 이름 solo가 그 리그를 솔로 블록으로 바꾸고 지분을 풀 분배 밖으로 둔다고 합니다. 보통 속도 라벨이 아닙니다.",
      "## 속도 예시（실제 측정 아님）",
      "계정 1시간이 200 H/s, rig-a가 120 H/s, rig-b가 80 H/s라고 가정합니다. 두 라벨이 그 시간에 대략 더해진다는 뜻일 뿐입니다. 오늘 200 CSD가 생긴다는 뜻이 아니고, 특정 카드 두 장을 뜻하지도 않습니다. 대시보드 5분이 40 H/s이면 창이 다르다는 것을 먼저 인정한 뒤, 지분이 아직 오르는지 봅니다.",
      "다음: [CSD 모니터](/projects/csd)에서 1시간 열을 맞춥니다. 이름은 없어졌는데 주소는 남아 있으면 [Worker 없음](/learn/csd-worker-not-found)을 봅니다. 주소와 세 금액의 읽기는 [모니터 개요](/learn/csd-gpools-monitor-guide)에 있습니다.",
    ],
    ja: [
      "このページの速度は、G-poolsがそのアドレスまたはWorker名について出した約1時間の平均で、単位は H/s です。マイナーの説明では、GPUやCPUのバックエンドが動いていても仕事がなければ 0 H/s になります。H/s は速度の単位です。ASICである証明でも、特定のGPUが載っている証明でもありません。インストール説明には NVIDIA、AMD、CPU のビルドがあります。",
      "口座の H/s と一つの Worker の H/s は違い得ます。口座はその1時間のアドレス合計で、Worker は --worker で付けた名前です。プールの説明では、名前のない古いマイナーは default と出ます。名前は最大24文字の表示です。支払は素のアドレスへ行きます。",
      "## 揃えるときに見ること",
      "- プールページで同じ addr20 の Hashrate (1h) を見つけ、このページの1時間と合わせます。5分の列が一致することを求めない。",
      "- 採掘説明は5分をおおよその値としています。起動や復旧の直後は1時間としばしばずれます。",
      "- 6時間はよりゆっくり動きます。1時間は再び正なのに6時間が低いままなら、長い窓に以前の停止が残っています。",
      "- プールの「CSD / hour」は支払と未払いを足した窓の平均と書かれています。コインの推定であり H/s ではありません。このページはそれを日次収益にしません。",
      "- 速度のスナップショットが約5分より古いと、現在の速度は空欄です。空欄は0ではありません。",
      "## 活動と名前",
      "- Workerの活動はプールが記した最終出現で、約15分以内です。PCのプロセスの心拍でも、HiveOSのオンラインランプでもありません。",
      "- Workerを選ぶと、見える速度と最終出現だけが変わります。未払いは名前では分かれません。",
      "- 名前が二つでも、一台の二回の起動かもしれないし、二台かもしれません。名前の数は物理台数でも、保存機器の枠でもありません。",
      "- 採掘説明では、名前 solo はそのリグをソロのブロック狙いに変え、シェアをプール分配の外に置きます。普通の速度ラベルではありません。",
      "## 速度の例（実測ではない）",
      "口座の1時間が 200 H/s、rig-a が 120 H/s、rig-b が 80 H/s だとします。二つのラベルがその1時間でおおよそ足し算になる、というだけです。今日 200 CSD 増える意味でも、特定のカード二枚の意味でもありません。ダッシュボードの5分が 40 H/s なら、窓が違うことを先に認めてから、シェアがまだ増えているかを見ます。",
      "次: [CSD監視](/projects/csd)で1時間の列を合わせる。名前が消えてアドレスが残るときは[Workerが見つからない](/learn/csd-worker-not-found)を見る。アドレスと三つの金額の読み方は[監視の概要](/learn/csd-gpools-monitor-guide)にある。",
    ],
  },
  questions: {
    zh: [
      {
        question: "5 分钟很高、1 小时很低，以哪个为准？",
        answer:
          "两边都对，窗口不同。本页只显示近 1 小时。5 分钟在矿池说明里是近似值，用来看刚发生的变化，不能改写 1 小时。",
      },
      {
        question: "H/s 能换成今天的 CSD 吗？",
        answer:
          "不能。H/s 是速率。矿池网页上的每小时 CSD 另含已支付和未支付的窗口估算，本页不把它当成每日收益。",
      },
      {
        question: "两个 Worker 是不是两台机器、占两个名额？",
        answer:
          "名字个数不等于物理台数。只在一个已保存地址下查看 Worker 不占额外设备名额。把某个 Worker 单独存成设备才会占用。每个项目免费 3 台、Pro 100 台。",
      },
    ],
    "zh-TW": [
      {
        question: "5 分鐘很高、1 小時很低，以哪個為準？",
        answer:
          "兩邊都對，窗口不同。本頁只顯示近 1 小時。5 分鐘在礦池說明裡是近似值，用來看剛發生的變化，不能改寫 1 小時。",
      },
      {
        question: "H/s 能換成今天的 CSD 嗎？",
        answer:
          "不能。H/s 是速率。礦池網頁上的每小時 CSD 另含已支付和未支付的窗口估算，本頁不把它當成每日收益。",
      },
      {
        question: "兩個 Worker 是不是兩台機器、占兩個名額？",
        answer:
          "名字個數不等於物理台數。只在一個已保存地址下查看 Worker 不占額外設備名額。把某個 Worker 單獨存成設備才會占用。每個專案免費 3 台、Pro 100 台。",
      },
    ],
    en: [
      {
        question: "The 5-minute rate is high and the 1-hour rate is low. Which is right?",
        answer:
          "Both can be right because the windows differ. This page shows about one hour. The pool marks 5 minutes as approximate. It shows a recent change; it does not rewrite the hour.",
      },
      {
        question: "Can I turn H/s into today’s CSD?",
        answer:
          "No. H/s is a rate. The pool page’s CSD per hour is a separate window estimate of paid plus owed. This page does not treat that as daily earnings.",
      },
      {
        question: "Do two Workers mean two machines and two device slots?",
        answer:
          "The number of names is not a machine count. Viewing Workers under one saved address does not take extra slots. Saving a Worker as its own device does. Free is three saved devices per project; Pro is 100.",
      },
    ],
    ko: [
      {
        question: "5분은 높고 1시간은 낮습니다. 어느 쪽이 맞나요?",
        answer:
          "창이 다르면 둘 다 맞을 수 있습니다. 이 페이지는 약 1시간만 보여 줍니다. 풀은 5분을 대략값으로 표시합니다. 최근 변화를 볼 뿐 1시간을 고치지 않습니다.",
      },
      {
        question: "H/s를 오늘의 CSD로 바꿀 수 있나요?",
        answer:
          "없습니다. H/s는 속도입니다. 풀 페이지의 시간당 CSD는 지급과 미지급의 별도 창 추정입니다. 이 페이지는 그것을 일일 수익으로 보지 않습니다.",
      },
      {
        question: "Worker 두 개는 기계 두 대와 자리 두 개인가요?",
        answer:
          "이름 개수는 물리 대수가 아닙니다. 저장한 주소 하나 아래에서 Worker를 보는 것은 자리를 더 쓰지 않습니다. Worker를 별도 기기로 저장하면 씁니다. 프로젝트당 무료 3대, Pro 100대입니다.",
      },
    ],
    ja: [
      {
        question: "5分は高く1時間は低いです。どちらが正しいですか？",
        answer:
          "窓が違えば両方正しくあり得ます。このページは約1時間だけを出します。プールは5分をおおよそとしています。直近の変化を示すだけで、1時間を書き換えません。",
      },
      {
        question: "H/sを今日のCSDに換えられますか？",
        answer:
          "換えられません。H/sは速度です。プールページの時間あたりCSDは支払と未払いの別の窓の推定です。このページはそれを日次収益にしません。",
      },
      {
        question: "Workerが二つなら機械二台、枠二つですか？",
        answer:
          "名前の数は物理台数ではありません。保存したアドレスの下でWorkerを見るだけでは枠は増えません。Workerを別の機器として保存すると使います。各プロジェクト無料3台、Proは100台です。",
      },
    ],
  },
};

const pending: Article = {
  slug: "csd-pending-paid-rewards",
  project: "csd",
  published: "2026-10-24",
  modified: "2026-10-24",
  topic: {
    zh: "未支付与已支付",
    "zh-TW": "未支付與已支付",
    en: "Unpaid and paid",
    ko: "미지급과 지급",
    ja: "未払いと支払済み",
  },
  title: {
    zh: "CSD 未支付、确认中和累计已支付怎么区分？",
    "zh-TW": "CSD 未支付、確認中和累計已支付怎麼區分？",
    en: "How to tell CSD unpaid, confirming, and lifetime paid apart",
    ko: "CSD 미지급·확인 중·누적 지급을 어떻게 구분하나",
    ja: "CSDの未払い・承認待ち・累計支払をどう区別するか",
  },
  description: {
    zh: "确认中还不能支付，未支付是已确认、等下次支付的余额，累计已支付是历史合计。三者相加不是「今日收益」。",
    "zh-TW":
      "確認中還不能支付，未支付是已確認、等下次支付的餘額，累計已支付是歷史合計。三者相加不是「今日收益」。",
    en: "Confirming is not payable yet, unpaid is the confirmed balance waiting for the next payout, and lifetime paid is the historical sum. Adding them is not today’s earnings.",
    ko: "확인 중은 아직 지급 전이고, 미지급은 확인되어 다음 지급을 기다리는 잔액이며, 누적 지급은 과거 합계입니다. 셋을 더해도 오늘 수익이 아닙니다.",
    ja: "承認待ちはまだ支払えず、未払いは確認済みで次回を待つ残高、累計支払は過去の合計です。三つを足しても今日の収益ではありません。",
  },
  summary: {
    zh: "看金额是否从确认中挪到未支付，再从累计已支付是否增加判断有没有打出。最低 0.001 CSD 和约 30 分钟来自矿池说明，不是到账保证。",
    "zh-TW":
      "看金額是否從確認中挪到未支付，再從累計已支付是否增加判斷有沒有打出。最低 0.001 CSD 和約 30 分鐘來自礦池說明，不是到帳保證。",
    en: "Watch an amount move from confirming to unpaid, then watch lifetime paid increase. The 0.001 CSD minimum and the about-30-minute schedule come from the pool notes, not a promise.",
    ko: "금액이 확인 중에서 미지급으로 옮기는지 보고, 누적 지급이 늘었는지로 송금 여부를 봅니다. 최소 0.001 CSD와 약 30분은 풀 안내이며 보장가 아닙니다.",
    ja: "金額が承認待ちから未払いへ移るか見て、累計支払が増えたかで送金を判断します。最低0.001 CSDと約30分はプールの説明であり、保証ではありません。",
  },
  sources,
  related: ["csd-gpools-monitor-guide", "csd-gpools-address-setup"],
  comparisonTitle: {
    zh: "三笔金额各算到哪一步",
    "zh-TW": "三筆金額各算到哪一步",
    en: "Where each amount sits",
    ko: "세 금액이 있는 단계",
    ja: "三つの金額がいる段階",
  },
  comparison: {
    zh: {
      headers: ["本页名称", "矿池页面上的对应说法", "下一步会发生什么"],
      rows: [
        ["确认中金额", "Pending（confirming），已找到但未确认", "确认完成后才可能变成可支付"],
        [
          "未支付余额",
          "Confirmed（payable），等待下次支付",
          "超过说明中的 0.001 CSD 后才会进入支付",
        ],
        ["累计已支付", "Paid（lifetime），付给你的合计", "只有新的一笔打出后才会变大"],
        ["每日收益", "本页不提供", "矿池的时段 CSD 含未支付分摊，不能当成这一栏"],
      ],
    },
    "zh-TW": {
      headers: ["本頁名稱", "礦池頁面上的對應說法", "下一步會發生什麼"],
      rows: [
        ["確認中金額", "Pending（confirming），已找到但未確認", "確認完成後才可能變成可支付"],
        [
          "未支付餘額",
          "Confirmed（payable），等待下次支付",
          "超過說明中的 0.001 CSD 後才會進入支付",
        ],
        ["累計已支付", "Paid（lifetime），付給你的合計", "只有新的一筆打出後才會變大"],
        ["每日收益", "本頁不提供", "礦池的時段 CSD 含未支付分攤，不能當成這一欄"],
      ],
    },
    en: {
      headers: ["Name here", "Wording on the pool page", "What happens next"],
      rows: [
        [
          "Awaiting confirmations",
          "Pending (confirming): found, not confirmed",
          "It can become payable only after confirmation",
        ],
        [
          "Unpaid balance",
          "Confirmed (payable), waiting for the next payout",
          "The notes require more than 0.001 CSD before a payout",
        ],
        [
          "Lifetime paid",
          "Paid (lifetime): total paid to you",
          "It grows only when a new payout is sent",
        ],
        [
          "Daily earnings",
          "Not shown here",
          "The pool’s windowed CSD includes unpaid and is not this column",
        ],
      ],
    },
    ko: {
      headers: ["여기 이름", "풀 페이지 표현", "다음에 일어나는 일"],
      rows: [
        ["확인 중", "Pending(confirming): 찾았으나 미확인", "확인이 끝나야 지급 가능이 될 수 있음"],
        [
          "미지급 잔액",
          "Confirmed(payable), 다음 지급 대기",
          "안내의 0.001 CSD를 넘어야 지급으로 감",
        ],
        ["누적 지급", "Paid(lifetime): 당신에게 지급한 합계", "새 지급이 나가야 커짐"],
        ["일일 수익", "이 페이지에 없음", "풀의 기간 CSD는 미지급을 포함하므로 이 칸이 아님"],
      ],
    },
    ja: {
      headers: ["ここの名前", "プールページの言い方", "次に起きること"],
      rows: [
        [
          "承認待ち",
          "Pending（confirming）: 見つかったが未確認",
          "確認後でなければ支払可能になり得る",
        ],
        ["未払い残高", "Confirmed（payable）、次回支払待ち", "説明の0.001 CSDを超えてから支払へ"],
        ["累計支払", "Paid（lifetime）: 支払われた合計", "新しい支払が送られてから増える"],
        ["日次収益", "ここにはない", "プールの期間CSDは未払いを含むので、この欄ではない"],
      ],
    },
  },
  body: {
    zh: [
      "## 三笔金额各是什么",
      "确认中、未支付和累计已支付是三个阶段。页面分开显示，不另报一个累计总额。把它们加成「今天的收入」，会把以前已经支付的合计，和眼前还在确认或等待支付的金额叠在一起。确认中是矿池已经记到、但还不能支付的金额。未支付是已确认、等下一次支付的余额。累计已支付是历史上打到这个 addr20 的合计，包含很早的付款。新的变化表现为金额在阶段之间移动：确认中减少并进入未支付，或未支付减少且累计已支付增加。",
      "金额属于整份地址。两台机器共用一个 addr20 时，你无法从这三笔里切出「左边那台今天挖了多少」。Worker 行上的份额和 H/s 不能反推它名下的 CSD。",
      "G-pools 挖矿说明写：余额超过 0.001 CSD 时大约每 30 分钟支付一次，矿池费 2.5%，支付自动进 addr20。说明同时给出「Next Payable In」这类估计。那是矿池页面上的估计，不是已经打进你钱包的证明。",
      "## 你要核对的变化",
      "- 确认中大于 0、未支付还很小：份额已经进池，确认还没完成。继续等，不要把确认中当成可提现。",
      "- 未支付超过 0.001 CSD 而累计已支付暂时不动：说明中的最低额已到，仍要等矿池自己的支付回合。30 分钟是说明里的大约值。",
      "- 未支付下降、累计已支付上升：这才像一笔支付刚记上。再到你自己的钱包里核对那一笔，本页不显示交易哈希。",
      "- 三个数都空着：这是未知，不是 0。先确认地址能打开，见 [地址怎么填](/learn/csd-gpools-address-setup)。",
      "- 矿池网页把某一小时的已支付和未支付摊成「CSD / hour」：那一列含估计，不要抄进「我昨天赚了多少」。",
      "## 示意账（不是真实收入）",
      "示意读法，不是真实收入：确认中 0.0002 CSD，未支付 0.0006 CSD，累计已支付 3 CSD。页面仍分三栏，不把它们加成今日收入。0.0006 仍低于说明中的 0.001，所以未支付可以在下一个约 30 分钟的支付回合里保持不变。其后仅为假设：再记入的奖励把未支付升到 0.0012，高于说明中的 0.001。然后一笔 0.0012 的支付会使未支付变为 0、累计已支付变为 3.0012，以矿池实际记录为准。这一假设不是到账保证。2.5% 已经体现在矿池入账规则里，不要再用 2.5% 去乘这三栏猜净收入。",
      "本页不把矿池时段里的估计写成每日收益，也不做美元换算。登录后每个项目免费 3 台已保存设备，Pro 100 台。展开同一地址下的 Worker 不另占名额；把 Worker 另存成独立设备才会占用。",
      "下一步：在 [CSD 监控](/projects/csd) 并排看这三栏。算力窗口见 [H/s 说明](/learn/csd-worker-throughput-units)。",
    ],
    "zh-TW": [
      "## 三筆金額各是什麼",
      "確認中、未支付和累計已支付是三個階段。頁面分開顯示，不另報一個累計總額。把它們加成「今天的收入」，會把以前已經支付的合計，和眼前還在確認或等待支付的金額疊在一起。確認中是礦池已經記到、但還不能支付的金額。未支付是已確認、等下一次支付的餘額。累計已支付是歷史上打到這個 addr20 的合計，包含很早的付款。新的變化表現為金額在階段之間移動：確認中減少並進入未支付，或未支付減少且累計已支付增加。",
      "金額屬於整份地址。兩台機器共用一個 addr20 時，你無法從這三筆裡切出「左邊那台今天挖了多少」。Worker 列上的份額和 H/s 不能反推它名下的 CSD。",
      "G-pools 挖礦說明寫：餘額超過 0.001 CSD 時大約每 30 分鐘支付一次，礦池費 2.5%，支付自動進 addr20。說明同時給出「Next Payable In」這類估計。那是礦池頁面上的估計，不是已經打進你錢包的證明。",
      "## 你要核對的變化",
      "- 確認中大於 0、未支付還很小：份額已經進池，確認還沒完成。繼續等，不要把確認中當成可提現。",
      "- 未支付超過 0.001 CSD 而累計已支付暫時不動：說明中的最低額已到，仍要等礦池自己的支付回合。30 分鐘是說明裡的大約值。",
      "- 未支付下降、累計已支付上升：這才像一筆支付剛記上。再到你自己的錢包裡核對那一筆，本頁不顯示交易雜湊。",
      "- 三個數都空著：這是未知，不是 0。先確認地址能打開，見 [地址怎麼填](/learn/csd-gpools-address-setup)。",
      "- 礦池網頁把某一小時的已支付和未支付攤成「CSD / hour」：那一列含估計，不要抄進「我昨天賺了多少」。",
      "## 示意帳（不是真實收入）",
      "示意讀法，不是真實收入：確認中 0.0002 CSD，未支付 0.0006 CSD，累計已支付 3 CSD。頁面仍分三欄，不把它們加成今日收入。0.0006 仍低於說明中的 0.001，所以未支付可以在下一個約 30 分鐘的支付回合裡保持不變。其後僅為假設：再記入的獎勵把未支付升到 0.0012，高於說明中的 0.001。然後一筆 0.0012 的支付會使未支付變為 0、累計已支付變為 3.0012，以礦池實際記錄為準。這一假設不是到帳保證。2.5% 已經體現在礦池入帳規則裡，不要再用 2.5% 去乘這三欄猜淨收入。",
      "本頁不把礦池時段裡的估計寫成每日收益，也不做美元換算。登入後每個專案免費 3 台已保存設備，Pro 100 台。展開同一地址下的 Worker 不另占名額；把 Worker 另存成獨立設備才會占用。",
      "下一步：在 [CSD 監控](/projects/csd) 並排看這三欄。算力窗口見 [H/s 說明](/learn/csd-worker-throughput-units)。",
    ],
    en: [
      "## What the three amounts are",
      "Confirming, unpaid, and lifetime paid are three stages. The page shows them separately and does not declare its own cumulative total. Adding them into “what I earned today” stacks older payouts on amounts that are still confirming or waiting. Confirming is an amount the pool has found but cannot pay yet. Unpaid is the confirmed balance waiting for the next payout. Lifetime paid is everything the pool has sent to this addr20, including old payouts. A new amount shows up as a move between stages: confirming shrinks into unpaid, or unpaid shrinks while lifetime paid grows.",
      "The coins belong to the whole address. When two machines share one addr20, these three numbers do not isolate what the left machine mined today. Shares and H/s on a Worker row do not convert into CSD owned by that name.",
      "The G-pools mining notes say balances over 0.001 CSD pay about every 30 minutes, the pool fee is 2.5%, and the payout goes to the addr20 automatically. The same page shows estimates such as Next Payable In. That estimate lives on the pool page. It is not proof the coins are already in your wallet.",
      "## Changes worth checking",
      "- Confirming is above zero and unpaid is still small: shares reached the pool and confirmation is unfinished. Wait. Confirming is not withdrawable.",
      "- Unpaid is over 0.001 CSD and lifetime paid has not moved: the minimum in the notes is met, and you still wait for the pool’s own payout round. Thirty minutes is the approximate figure in those notes.",
      "- Unpaid falls and lifetime paid rises: that is what a recorded payout looks like. Match it in your own wallet. This page does not show a transaction hash.",
      "- All three are blank: that is unknown, not zero. Confirm the address opens. See [which address to paste](/learn/csd-gpools-address-setup).",
      "- The pool page spreads paid plus owed into “CSD / hour” for a window: that column includes an estimate. Do not copy it into “what I earned yesterday.”",
      "## Illustrative ledger (not actual income)",
      "Illustrative ledger, not actual income: confirming 0.0002 CSD, unpaid 0.0006 CSD, and lifetime paid 3 CSD. The page still keeps three columns and does not turn them into today’s income. 0.0006 is still under the 0.001 in the notes, so unpaid can sit through the next payout round of about 30 minutes. Later, and only as a hypothetical, assume further credited rewards raise unpaid to 0.0012, above the 0.001 minimum in the notes. A payout of 0.0012 would then leave unpaid at 0 and lifetime paid at 3.0012, subject to the actual pool record. That hypothetical is not a payment guarantee. The 2.5% fee is already inside the pool’s crediting rules. Do not multiply these three columns by 2.5% to invent a net.",
      "This page does not turn the pool’s window estimate into daily earnings or a dollar price. After you sign in, Free keeps three saved devices per project and Pro keeps 100. Workers shown under one address do not add a slot. Saving a Worker as its own device does.",
      "Next: read the three columns together on [CSD monitoring](/projects/csd). For the rate window, see [what H/s means](/learn/csd-worker-throughput-units).",
    ],
    ko: [
      "## 세 금액이 각각 무엇인지",
      "확인 중, 미지급, 누적 지급은 세 단계입니다. 페이지는 칸을 나누어 보여 주고, 따로 누적 총액을 만들지 않습니다. 셋을 더해 「오늘 수익」으로 보면, 예전에 지급된 합계와 아직 확인 중이거나 지급을 기다리는 금액이 겹칩니다. 확인 중은 풀이 찾았으나 아직 지급할 수 없는 금액입니다. 미지급은 확인되어 다음 지급을 기다리는 잔액입니다. 누적 지급은 이 addr20으로 풀이 보낸 과거 합계이며 오래된 지급도 포함합니다. 새 금액은 단계 사이의 이동으로 나타납니다. 확인 중이 줄어 미지급이 되거나, 미지급이 줄고 누적 지급이 늡니다.",
      "코인은 주소 전체의 것입니다. 기계 두 대가 한 addr20을 쓰면 이 세 숫자로 왼쪽 기계가 오늘 캔 양을 가를 수 없습니다. Worker 줄의 지분과 H/s는 그 이름 소유의 CSD로 바뀌지 않습니다.",
      "G-pools 채굴 안내는 잔액이 0.001 CSD를 넘으면 약 30분마다 지급되고, 풀 수수료는 2.5%이며, 지급은 addr20으로 자동이라고 합니다. 같은 페이지의 Next Payable In 같은 값은 풀 페이지의 추정치입니다. 지갑에 이미 들어왔다는 증거는 아닙니다.",
      "## 볼 변화",
      "- 확인 중이 0보다 크고 미지급이 아직 작다: 지분은 풀에 들어왔고 확인이 끝나지 않았습니다. 기다리세요. 확인 중은 출금 가능액이 아닙니다.",
      "- 미지급이 0.001 CSD를 넘었는데 누적 지급이 그대로다: 안내의 최소액은 찼고, 풀 자신의 지급 회차를 더 기다립니다. 30분은 그 안내의 대략값입니다.",
      "- 미지급이 줄고 누적 지급이 늘었다: 지급이 장부에 적힌 모습입니다. 본인 지갑에서 그 건을 맞춥니다. 이 페이지는 거래 해시를 보여 주지 않습니다.",
      "- 셋이 모두 비었다: 알 수 없음이지 0이 아닙니다. 주소가 열리는지 확인합니다. [어떤 주소를 붙이나](/learn/csd-gpools-address-setup)를 보세요.",
      "- 풀 페이지가 어떤 시간의 지급과 미지급을 ‘CSD / hour’로 펼친다: 그 열에는 추정이 있습니다. ‘어제 번 돈’으로 베끼지 마세요.",
      "## 장부 예시（실제 수익 아님）",
      "읽는 예시이며 실제 수익이 아닙니다. 확인 중 0.0002 CSD, 미지급 0.0006 CSD, 누적 지급 3 CSD라고 가정합니다. 페이지는 세 칸을 유지하고, 이것을 오늘 수익으로 합치지 않습니다. 0.0006은 안내의 0.001보다 낮아, 다음 약 30분 지급 회차에도 미지급이 그대로일 수 있습니다. 그 뒤는 가정일 뿐입니다. 추가로 기입된 보상이 미지급을 0.0012로 올려 안내의 최소 0.001을 넘는다고 합니다. 그다음 0.0012를 지급하면 미지급은 0, 누적 지급은 3.0012가 되며, 실제 풀 기록이 기준입니다. 이 가정은 지급 보장이 아닙니다. 2.5% 수수료는 이미 풀의 기입 규칙 안에 있습니다. 세 칸에 2.5%를 곱해 순수익을 만들지 마세요.",
      "이 페이지는 풀의 기간 추정을 일일 수익이나 달러로 만들지 않습니다. 로그인 후 프로젝트당 무료 저장 기기 3대, Pro 100대입니다. 같은 주소 아래 Worker를 펼치는 것은 자리를 더 쓰지 않습니다. Worker를 별도 기기로 저장하면 그 기록이 자리에 포함됩니다.",
      "다음: [CSD 모니터](/projects/csd)에서 세 칸을 나란히 봅니다. 속도 창은 [H/s의 의미](/learn/csd-worker-throughput-units)를 보세요.",
    ],
    ja: [
      "## 三つの金額がそれぞれ何か",
      "承認待ち、未払い、累計支払は三つの段階です。ページは分けて表示し、独自の累計合計は出しません。三つを足して「今日の収益」とすると、以前に支払われた合計と、まだ承認待ちまたは支払待ちの金額が重なります。承認待ちはプールが見つけたがまだ支払えない金額です。未払いは確認済みで次回の支払を待つ残高です。累計支払はこの addr20 へプールが送った過去の合計で、古い支払も含みます。新しい金額は段階のあいだの移動として現れます。承認待ちが減って未払いになるか、未払いが減って累計支払が増えます。",
      "コインはアドレス全体のものです。二台が一つの addr20 を共有するとき、この三つから左の機械が今日掘った分は切り出せません。Worker行のシェアと H/s は、その名前が持つ CSD にはなりません。",
      "G-pools の採掘説明には、残高が 0.001 CSD を超えると約30分ごとに支払い、プール手数料は 2.5% で、支払は addr20 へ自動とあります。同じページの Next Payable In のような表示は、プールページ上の推定です。ウォレットに既に入った証明ではありません。",
      "## 見るべき変化",
      "- 承認待ちが 0 より大きく未払いがまだ小さい: シェアはプールに届き、確認が終わっていません。待つ。承認待ちは引き出せる額ではありません。",
      "- 未払いが 0.001 CSD を超え、累計支払が動いていない: 説明の最低額には達しています。それでもプール自身の支払回を待ちます。30分はその説明のおおよその値です。",
      "- 未払いが減り累計支払が増えた: 支払が台帳に載った形です。自分のウォレットでその一件を合わせます。このページは取引ハッシュを出しません。",
      "- 三つとも空欄: 不明であり 0 ではありません。アドレスが開くかを確認します。[どのアドレスを貼るか](/learn/csd-gpools-address-setup)を見る。",
      "- プールページが、ある時間の支払と未払いを「CSD / hour」に広げる: その列には推定があります。「昨日稼いだ額」に写さない。",
      "## 台帳の例（実際の収益ではない）",
      "読み方の例であり、実際の収益ではありません。承認待ち 0.0002 CSD、未払い 0.0006 CSD、累計支払 3 CSD だとします。ページは三つの欄のままで、これを今日の収益にはしません。0.0006 は説明の 0.001 未満なので、次の約30分の支払回でも未払いはそのままであり得ます。その後は仮定にすぎません。さらに記帳された報酬が未払いを 0.0012 に上げ、説明の最低 0.001 を超えるとします。そこで 0.0012 を支払うと、未払いは 0、累計支払は 3.0012 になり、実際のプール記録が基準です。この仮定は支払いの保証ではありません。2.5% の手数料は既にプールの記帳ルールの中にあります。この三つの欄に 2.5% を掛けて手取りを作らない。",
      "このページは、プールの期間の推定を日次収益やドル価格にしません。ログイン後、各プロジェクト無料3台、Proは100台です。同じアドレスの下で Worker を広げるだけでは枠は増えません。Worker を別の機器として保存すると、その記録が枠に入ります。",
      "次: [CSD監視](/projects/csd)で三つの欄を並べて読む。速度の窓は[H/sの意味](/learn/csd-worker-throughput-units)を見る。",
    ],
  },
  questions: {
    zh: [
      {
        question: "未支付超过 0.001 为什么还没看到钱包入账？",
        answer:
          "0.001 CSD 和大约 30 分钟来自 G-pools 挖矿说明，是矿池自己的回合，不是到账保证。要等累计已支付增加，再在你的钱包里核对。本页没有交易哈希。",
      },
      {
        question: "确认中能提走吗？",
        answer: "不能。矿池页面把它写成已找到、尚未确认。确认完成后才会进入未支付，再等支付回合。",
      },
      {
        question: "为什么没有每日收益？",
        answer:
          "矿池时段里的 CSD 含未支付分摊，是估计。本页只保留确认中、未支付和累计已支付，不把估计写成昨天的收入，也不换算美元。",
      },
    ],
    "zh-TW": [
      {
        question: "未支付超過 0.001 為什麼還沒看到錢包入帳？",
        answer:
          "0.001 CSD 和大約 30 分鐘來自 G-pools 挖礦說明，是礦池自己的回合，不是到帳保證。要等累計已支付增加，再在你的錢包裡核對。本頁沒有交易雜湊。",
      },
      {
        question: "確認中能提走嗎？",
        answer: "不能。礦池頁面把它寫成已找到、尚未確認。確認完成後才會進入未支付，再等支付回合。",
      },
      {
        question: "為什麼沒有每日收益？",
        answer:
          "礦池時段裡的 CSD 含未支付分攤，是估計。本頁只保留確認中、未支付和累計已支付，不把估計寫成昨天的收入，也不換算美元。",
      },
    ],
    en: [
      {
        question: "Unpaid is over 0.001. Why is the wallet still unchanged?",
        answer:
          "The 0.001 CSD minimum and the about-30-minute line come from the G-pools mining notes. They describe the pool’s round, not a guaranteed arrival. Wait until lifetime paid increases, then match it in your wallet. This page has no transaction hash.",
      },
      {
        question: "Can I withdraw the confirming amount?",
        answer:
          "No. The pool page calls it found but not yet confirmed. After confirmation it can become unpaid, and then it still waits for a payout round.",
      },
      {
        question: "Why is there no daily earnings figure?",
        answer:
          "The pool’s windowed CSD includes unpaid and is an estimate. This page keeps confirming, unpaid, and lifetime paid. It does not turn the estimate into yesterday’s income or a dollar price.",
      },
    ],
    ko: [
      {
        question: "미지급이 0.001을 넘었는데 지갑은 왜 그대로인가요?",
        answer:
          "0.001 CSD와 약 30분은 G-pools 채굴 안내의 문장입니다. 풀의 회차이지 입금 보장이 아닙니다. 누적 지급이 늘 때까지 기다린 뒤 본인 지갑에서 맞춥니다. 이 페이지에는 거래 해시가 없습니다.",
      },
      {
        question: "확인 중 금액을 뺄 수 있나요?",
        answer:
          "없습니다. 풀 페이지는 찾았으나 아직 확인 전이라고 합니다. 확인 후에야 미지급이 될 수 있고, 그다음에도 지급 회차를 기다립니다.",
      },
      {
        question: "일일 수익이 없는 이유는?",
        answer:
          "풀의 기간 CSD에는 미지급 배분이 들어 있는 추정치입니다. 이 페이지는 확인 중, 미지급, 누적 지급만 둡니다. 추정을 어제의 수입이나 달러로 만들지 않습니다.",
      },
    ],
    ja: [
      {
        question: "未払いが0.001を超えているのにウォレットが変わらないのは？",
        answer:
          "0.001 CSDと約30分はG-poolsの採掘説明の文です。プールの回であり、着金の保証ではありません。累計支払が増えてから、自分のウォレットで合わせます。このページに取引ハッシュはありません。",
      },
      {
        question: "承認待ちは引き出せますか？",
        answer:
          "引き出せません。プールページは、見つかったが未確認としています。確認後に未払いになり得て、その後も支払回を待ちます。",
      },
      {
        question: "日次収益がないのはなぜですか？",
        answer:
          "プールの期間CSDは未払いを含む推定です。このページは承認待ち、未払い、累計支払だけを残します。推定を昨日の収入やドル価格にしません。",
      },
    ],
  },
};

const notFound: Article = {
  slug: "csd-worker-not-found",
  project: "csd",
  published: "2026-10-24",
  modified: "2026-10-24",
  topic: {
    zh: "查不到地址或 Worker",
    "zh-TW": "查不到地址或 Worker",
    en: "Not found",
    ko: "주소를 찾을 수 없음",
    ja: "見つからない",
  },
  title: {
    zh: "CSD 地址或 Worker 查不到时，先分清哪一种空？",
    "zh-TW": "CSD 地址或 Worker 查不到時，先分清哪一種空？",
    en: "When a CSD address or Worker is missing, which kind of empty is it?",
    ko: "CSD 주소나 Worker가 없을 때, 어떤 종류의 빈칸인지 먼저 나누기",
    ja: "CSDのアドレスやWorkerが見つからないとき、どの空きかを先に分ける",
  },
  description: {
    zh: "整页找不到，是矿池还没有这份地址的份额和支付。某个 Worker 消失、或算力为 0，地址账本仍可打开。不要用重启覆盖这三种情况。",
    "zh-TW":
      "整頁找不到，是礦池還沒有這份地址的份額和支付。某個 Worker 消失、或算力為 0，地址帳本仍可打開。不要用重啟覆蓋這三種情況。",
    en: "A full-page miss means the pool has no shares or payments for that address yet. A missing Worker, or 0 H/s, can still leave the address ledger open. Do not treat all three as one restart.",
    ko: "페이지 전체가 없음은 풀에 그 주소의 지분과 지급이 아직 없다는 뜻입니다. Worker만 없거나 0 H/s여도 주소 장부는 열릴 수 있습니다. 세 경우를 한 번의 재시작으로 덮지 마세요.",
    ja: "ページ全体の不検出は、プールにそのアドレスのシェアも支払もまだない状態です。Workerだけ無い、または0 H/sでも、アドレスの台帳は開けます。三つを一つの再起動で覆わない。",
  },
  summary: {
    zh: "先看地址账本还在不在。账本在，就查名字、最近出现和份额。账本不在，就核对 addr20 和是不是还没向 G-pools 提交过工作。",
    "zh-TW":
      "先看地址帳本還在不在。帳本在，就查名字、最近出現和份額。帳本不在，就核對 addr20 和是不是還沒向 G-pools 提交過工作。",
    en: "See whether the address ledger is still there. If it is, check the name, last seen, and shares. If it is not, recheck the addr20 and whether any work has reached G-pools.",
    ko: "주소 장부가 아직 있는지 먼저 봅니다. 있으면 이름, 마지막 출현, 지분을 봅니다. 없으면 addr20과 G-pools에 작업이 닿았는지를 다시 봅니다.",
    ja: "アドレスの台帳が残っているかを先に見ます。残っていれば名前、最終出現、シェアを見ます。無ければ addr20 と、G-pools に仕事が届いたかを見直します。",
  },
  sources,
  related: ["csd-gpools-address-setup", "csd-worker-throughput-units", "csd-gpools-monitor-guide"],
  comparisonTitle: {
    zh: "三种「没有」",
    "zh-TW": "三種「沒有」",
    en: "Three kinds of missing",
    ko: "세 가지 ‘없음’",
    ja: "三種類の「無い」",
  },
  comparison: {
    zh: {
      headers: ["你看到的", "地址账本", "下一步"],
      rows: [
        [
          "整页查无此地址",
          "没有份额、没有支付、也没有矿机记录",
          "核对 addr20，确认工作已提交到 G-pools",
        ],
        [
          "地址在，某个名字不在",
          "未支付和累计支付仍是这一份钱包",
          "核对 --worker 拼写；旧矿机可能叫 default",
        ],
        ["地址在，算力为 0 H/s", "账本还在", "看拒绝份额和最近出现，短时为零先不要重装"],
        ["算力空白", "账本可能还在", "空白是当前速率未知，不要写成 0"],
      ],
    },
    "zh-TW": {
      headers: ["你看到的", "地址帳本", "下一步"],
      rows: [
        [
          "整頁查無此地址",
          "沒有份額、沒有支付、也沒有礦機紀錄",
          "核對 addr20，確認工作已提交到 G-pools",
        ],
        [
          "地址在，某個名字不在",
          "未支付和累計支付仍是這一份錢包",
          "核對 --worker 拼寫；舊礦機可能叫 default",
        ],
        ["地址在，算力為 0 H/s", "帳本還在", "看拒絕份額和最近出現，短時為零先不要重裝"],
        ["算力空白", "帳本可能還在", "空白是目前速率未知，不要寫成 0"],
      ],
    },
    en: {
      headers: ["What you see", "Address ledger", "Next step"],
      rows: [
        [
          "Whole page: address not found",
          "No shares, no payments, no rig record",
          "Recheck the addr20 and that work was submitted to G-pools",
        ],
        [
          "Address open, one name missing",
          "Unpaid and lifetime paid still belong to that wallet",
          "Check the --worker spelling; a legacy miner may show as default",
        ],
        [
          "Address open, rate is 0 H/s",
          "Ledger still open",
          "Read rejected shares and last seen; do not reinstall on a short zero",
        ],
        [
          "Rate is blank",
          "Ledger may still be open",
          "Blank means the current rate is unknown; do not write 0",
        ],
      ],
    },
    ko: {
      headers: ["보이는 것", "주소 장부", "다음"],
      rows: [
        [
          "페이지 전체에서 주소 없음",
          "지분도 지급도 리그 기록도 없음",
          "addr20을 다시 보고 G-pools로 작업이 갔는지 확인",
        ],
        [
          "주소는 있고 이름 하나만 없음",
          "미지급과 누적 지급은 그 지갑에 남음",
          "--worker 철자를 확인; 예전 채굴기는 default일 수 있음",
        ],
        [
          "주소는 있고 속도가 0 H/s",
          "장부는 열려 있음",
          "거부 지분과 마지막 출현을 보고, 짧은 0에 재설치하지 않음",
        ],
        [
          "속도가 비어 있음",
          "장부는 열려 있을 수 있음",
          "빈칸은 현재 속도를 모름; 0으로 적지 않음",
        ],
      ],
    },
    ja: {
      headers: ["見えているもの", "アドレスの台帳", "次"],
      rows: [
        [
          "ページ全体でアドレスなし",
          "シェアも支払もリグ記録もない",
          "addr20を見直し、仕事がG-poolsへ出たか確認",
        ],
        [
          "アドレスはあり、名前だけ無い",
          "未払いと累計支払はそのウォレットのまま",
          "--workerの綴りを確認。古いマイナーはdefaultのことがある",
        ],
        [
          "アドレスはあり、速度が0 H/s",
          "台帳は開いたまま",
          "拒否シェアと最終出現を見る。短いゼロで再インストールしない",
        ],
        ["速度が空欄", "台帳は残っていることがある", "空欄は現在の速度が不明。0と書かない"],
      ],
    },
  },
  body: {
    zh: [
      "「查不到」要先分成整页没有这个地址，还是地址还在、只是某个 Worker 名字不在。整页没有，表示矿池这份公开账户里还没有矿机列表，也没有受理份额和支付。名字不在，只表示当前列表里没有这个标签，未支付和累计已支付仍属于原来的 addr20。",
      "算力显示 0 H/s 也不是查无地址。挖矿说明把「在线但 0 H/s」写成后端没配对或没有工作量，例如 HiveOS 上 NVIDIA 应使用 --backend cuda，AMD 用 opencl，CPU 用 cpu。那是矿工程序的状态，不是把地址从矿池删掉。",
      "## 整页找不到时",
      "- 对照矿工里的 --address，确认去掉 0x 后是 40 位十六进制。填法见 [addr20 从哪复制](/learn/csd-gpools-address-setup)。",
      "- 确认矿工连的是 G-pools。说明里的池端点写的是编译进程序的 pool.yamaduo.no。本监控读的是 csd.yamaduo.no 上的公开账户。两条页面若对同一地址结论不同，以能看到你的支付记录的那一页为准。",
      "- 其他 G-pools 家族的链不共用这份 CSD 账。官网节点地址也不是矿池账户。",
      "- 刚改完地址、还没有任何受理份额时，矿池可以还没有这份账户。先让矿工程序跑起来并看到份额被接受，再刷新监控。",
      "- 不要把私钥或 csd-wallet.txt 贴进来「换一种查法」。",
      "## 地址还在、名字不在或算力为零",
      "- 看矿池 rig 列表里的拼写。允许的是字母、数字、下划线和连字符。Linux 上若没写 --worker，说明会退回到 CSD_WORKER、WORKER_NAME 或主机名。",
      "- 没有起名的旧矿机，说明写明会显示成 default。你在监控里搜 rig1 就会像「没有这台」。",
      "- 最近出现超过大约 15 分钟，本页不再把该 Worker 标成活跃。名字可能仍在，只是不活跃。这和整页查无不同。",
      "- 0 H/s 时看受理份额和拒绝份额有没有变化。短时间的 0 先不要重装系统或换钱包。",
      "- 当前算力空白，是这一小时的速率暂时未知。保留账本上的金额，不要把空白改记成 0。",
      "## 示意（不是某次故障记录）",
      "地址甲整页打不开：矿工里的字符串和钱包打印的不一致，或工作还没进 G-pools。地址乙能打开，未支付仍是 0.02 CSD，但列表里只有 default、没有你记得的 rig-a：名字没传到矿池，钱还在乙上。地址丙能打开且 1 小时为 0 H/s、拒绝份额在增加：先改后端或看拒绝原因，不要新建一个 addr20。",
      "每个项目免费 3 台已保存设备，Pro 100 台。为了「找不到 Worker」而把同一地址再存一次，不会多出一份余额，带不带 0x 仍是同一台已保存设备。把每个 Worker 都另存成设备，才会逐条占用名额。",
      "下一步：用核对过的 addr20 打开 [CSD 监控](/projects/csd)。账本打开后如何读 H/s，见 [算力单位](/learn/csd-worker-throughput-units)。",
    ],
    "zh-TW": [
      "「查不到」要先分成整頁沒有這個地址，還是地址還在、只是某個 Worker 名字不在。整頁沒有，表示礦池這份公開帳戶裡還沒有礦機列表，也沒有受理份額和支付。名字不在，只表示目前列表裡沒有這個標籤，未支付和累計已支付仍屬於原來的 addr20。",
      "算力顯示 0 H/s 也不是查無地址。挖礦說明把「在線但 0 H/s」寫成後端沒配對或沒有工作量，例如 HiveOS 上 NVIDIA 應使用 --backend cuda，AMD 用 opencl，CPU 用 cpu。那是礦工程式的狀態，不是把地址從礦池刪掉。",
      "## 整頁找不到時",
      "- 對照礦工裡的 --address，確認去掉 0x 後是 40 位十六進位。填法見 [addr20 從哪複製](/learn/csd-gpools-address-setup)。",
      "- 確認礦工連的是 G-pools。說明裡的池端點寫的是編譯進程式的 pool.yamaduo.no。本監控讀的是 csd.yamaduo.no 上的公開帳戶。兩條頁面若對同一地址結論不同，以能看到你的支付紀錄的那一頁為準。",
      "- 其他 G-pools 家族的鏈不共用這份 CSD 帳。官網節點地址也不是礦池帳戶。",
      "- 剛改完地址、還沒有任何受理份額時，礦池可以還沒有這份帳戶。先讓礦工程式跑起來並看到份額被接受，再刷新監控。",
      "- 不要把私鑰或 csd-wallet.txt 貼進來「換一種查法」。",
      "## 地址還在、名字不在或算力為零",
      "- 看礦池 rig 列表裡的拼寫。允許的是字母、數字、底線和連字號。Linux 上若沒寫 --worker，說明會退回到 CSD_WORKER、WORKER_NAME 或主機名。",
      "- 沒有起名的舊礦機，說明寫明會顯示成 default。你在監控裡搜 rig1 就會像「沒有這台」。",
      "- 最近出現超過大約 15 分鐘，本頁不再把該 Worker 標成活躍。名字可能仍在，只是不活躍。這和整頁查無不同。",
      "- 0 H/s 時看受理份額和拒絕份額有沒有變化。短時間的 0 先不要重裝系統或換錢包。",
      "- 目前算力空白，是這一小時的速率暫時未知。保留帳本上的金額，不要把空白改記成 0。",
      "## 示意（不是某次故障紀錄）",
      "地址甲整頁打不開：礦工裡的字串和錢包印出的不一致，或工作還沒進 G-pools。地址乙能打開，未支付仍是 0.02 CSD，但列表裡只有 default、沒有你記得的 rig-a：名字沒傳到礦池，錢還在乙上。地址丙能打開且 1 小時為 0 H/s、拒絕份額在增加：先改後端或看拒絕原因，不要新建一個 addr20。",
      "每個專案免費 3 台已保存設備，Pro 100 台。為了「找不到 Worker」而把同一地址再存一次，不會多出一份餘額，有沒有 0x 仍是同一台已保存設備。把每個 Worker 都另存成設備，才會逐條占用名額。",
      "下一步：用核對過的 addr20 打開 [CSD 監控](/projects/csd)。帳本打開後如何讀 H/s，見 [算力單位](/learn/csd-worker-throughput-units)。",
    ],
    en: [
      "Split “not found” before you change anything. Either the whole page has no such address, or the address is open and only a Worker name is absent. A full-page miss means this public pool account has no rig list, no accepted shares, and no payments. A missing name means that label is not on the current list. Unpaid and lifetime paid still belong to the original addr20.",
      "A reading of 0 H/s is not a missing address. The mining notes describe “online but 0 H/s” when the backend does not match or there is no work. On HiveOS they tell NVIDIA to use --backend cuda, AMD opencl, and CPU cpu. That is the miner process, not a deletion of the address from the pool.",
      "## When the whole page misses",
      "- Compare --address in the miner. After dropping 0x you need 40 hexadecimal characters. See [where to copy the addr20](/learn/csd-gpools-address-setup).",
      "- Confirm the miner is on G-pools. The notes name pool.yamaduo.no as the endpoint compiled into the program. This monitor reads the public account on csd.yamaduo.no. If those pages disagree about one address, trust the page that shows your payment history.",
      "- Other chains in the G-pools family do not share this CSD ledger. A node address from the project site is not a pool account.",
      "- Right after you change the address, and before any share is accepted, the pool can have no account yet. Let the miner run until a share is accepted, then refresh.",
      "- Do not paste a private key or csd-wallet.txt as another way to search.",
      "## When the address is open",
      "- Read the spelling on the pool’s rig list. Allowed characters are letters, digits, underscore, and hyphen. On Linux, if you omit --worker, the notes fall back to CSD_WORKER, WORKER_NAME, or the hostname.",
      "- The notes say a legacy miner with no name shows as default. Searching for rig1 then looks like “that rig does not exist.”",
      "- If last seen is older than about 15 minutes, this page stops marking that Worker active. The name can remain, only inactive. That is different from a full-page miss.",
      "- At 0 H/s, see whether accepted and rejected shares are still changing. Do not reinstall the machine or rotate the wallet for a short zero.",
      "- A blank current rate means this hour’s rate is unknown for now. Keep the amounts on the ledger. Do not rewrite the blank as 0.",
      "## Illustrative cases (not a recorded outage)",
      "Address A does not open at all: the miner string does not match the printed wallet, or no work has reached G-pools yet. Address B opens, unpaid is still 0.02 CSD, and the list shows only default, not the rig-a you remember: the name never reached the pool, and the coins are still on B. Address C opens with a 1-hour rate of 0 H/s while rejected shares climb: fix the backend or the reject reason before you create a new addr20.",
      "Free is three saved devices per project; Pro is 100. Saving the same address again because a Worker was missing does not create a second balance. With or without 0x it stays one saved device. Saving every Worker as its own device does use a slot each.",
      "Next: open [CSD monitoring](/projects/csd) with the checked addr20. Once the ledger opens, read H/s in [hashrate units](/learn/csd-worker-throughput-units).",
    ],
    ko: [
      "「없음」은 무엇을 바꾸기 전에 나눕니다. 페이지 전체에 그 주소가 없거나, 주소는 열리고 Worker 이름만 없는 경우입니다. 페이지 전체의 없음은 이 공개 풀 계정에 리그 목록도, 접수 지분도, 지급도 없다는 뜻입니다. 이름만 없음은 현재 목록에 그 라벨이 없다는 뜻입니다. 미지급과 누적 지급은 원래 addr20에 남습니다.",
      "0 H/s는 주소 없음이 아닙니다. 채굴 안내는 백엔드가 맞지 않거나 작업이 없을 때 ‘온라인인데 0 H/s’라고 합니다. HiveOS에서 NVIDIA는 --backend cuda, AMD는 opencl, CPU는 cpu를 쓰라고 합니다. 그것은 채굴기 프로세스이지, 풀에서 주소를 지운 것이 아닙니다.",
      "## 페이지 전체가 없을 때",
      "- 채굴기의 --address와 비교합니다. 0x를 빼면 16진 40자여야 합니다. [addr20을 어디서 복사하나](/learn/csd-gpools-address-setup)를 보세요.",
      "- 채굴기가 G-pools를 향하는지 확인합니다. 안내의 풀 끝점은 프로그램에 들어 있는 pool.yamaduo.no입니다. 이 모니터는 csd.yamaduo.no의 공개 계정을 읽습니다. 두 페이지가 한 주소에 대해 다르면, 지급 기록이 보이는 쪽을 따릅니다.",
      "- G-pools 가족의 다른 체인은 이 CSD 장부를 공유하지 않습니다. 프로젝트 사이트의 노드 주소는 풀 계정이 아닙니다.",
      "- 주소를 막 바꾼 뒤, 지분이 접수되기 전에는 풀에 계정이 아직 없을 수 있습니다. 채굴기가 지분을 접수할 때까지 두고 새로고침합니다.",
      "- 다른 검색 방법이라며 비밀키나 csd-wallet.txt를 붙이지 마세요.",
      "## 주소는 열려 있을 때",
      "- 풀 리그 목록의 철자를 봅니다. 허용은 문자, 숫자, 밑줄, 하이픈입니다. Linux에서 --worker를 생략하면 안내는 CSD_WORKER, WORKER_NAME, 호스트 이름으로 내려갑니다.",
      "- 안내는 이름이 없는 예전 채굴기는 default로 보인다고 합니다. rig1을 찾으면 ‘그 리그가 없다’처럼 보입니다.",
      "- 마지막 출현이 약 15분을 넘으면 이 페이지는 그 Worker를 활성으로 두지 않습니다. 이름은 남아 있고 비활성일 수 있습니다. 페이지 전체의 없음과는 다릅니다.",
      "- 0 H/s이면 접수 지분과 거부 지분이 아직 변하는지 봅니다. 짧은 0 때문에 시스템을 다시 설치하거나 지갑을 바꾸지 마세요.",
      "- 현재 속도가 비면 이 시간의 속도를 잠시 모르는 것입니다. 장부의 금액은 두고, 빈칸을 0으로 고쳐 적지 마세요.",
      "## 예시（기록된 장애가 아님）",
      "주소 가는 아예 열리지 않습니다. 채굴기 문자열이 지갑에 출력된 값과 다르거나, 작업이 아직 G-pools에 닿지 않았습니다. 주소 나는 열리고 미지급은 그대로 0.02 CSD인데 목록에는 default만 있고 기억 속의 rig-a는 없습니다. 이름이 풀에 전달되지 않았고 코인은 나에 있습니다. 주소 다는 열리고 1시간이 0 H/s이며 거부 지분이 늘어납니다. 새 addr20을 만들기 전에 백엔드나 거부 이유를 봅니다.",
      "프로젝트당 무료 3대, Pro 100대입니다. Worker가 없다고 같은 주소를 다시 저장해도 잔액이 두 개가 되지 않습니다. 0x 유무도 저장된 기기 하나입니다. Worker마다 기기로 저장하면 그 기록이 자리를 씁니다.",
      "다음: 확인한 addr20으로 [CSD 모니터](/projects/csd)를 엽니다. 장부가 열리면 [해시레이트 단위](/learn/csd-worker-throughput-units)에서 H/s를 읽습니다.",
    ],
    ja: [
      "「見つからない」は、何かを変える前に分けます。ページ全体にそのアドレスが無いのか、アドレスは開いていて Worker 名だけが無いのかです。ページ全体の不検出は、この公開プール口座にリグ一覧も、受理シェアも、支払も無い状態です。名前だけ無いのは、今の一覧にそのラベルが無いだけです。未払いと累計支払は元の addr20 に残ります。",
      "0 H/s はアドレス欠落ではありません。採掘説明は、バックエンドが合わないか仕事が無いときを「オンラインだが 0 H/s」と書いています。HiveOS では NVIDIA は --backend cuda、AMD は opencl、CPU は cpu です。それはマイナーのプロセスであり、プールからアドレスを消したことではありません。",
      "## ページ全体に無いとき",
      "- マイナーの --address と照合します。0x を外して16進40文字です。[addr20をどこからコピーするか](/learn/csd-gpools-address-setup)を見る。",
      "- マイナーが G-pools を向いているか確認します。説明のプール端点は、プログラムに組み込まれた pool.yamaduo.no です。この監視は csd.yamaduo.no の公開口座を読みます。二つのページが一つのアドレスで食い違うときは、支払記録が見える方に従います。",
      "- G-pools 一族の別チェーンは、この CSD 台帳を共有しません。プロジェクトサイトのノードアドレスはプール口座ではありません。",
      "- アドレスを変えた直後で、シェアが受理される前は、プールに口座がまだ無いことがあります。マイナーがシェアを受理するまで待ってから更新します。",
      "- 別の調べ方だとして秘密鍵や csd-wallet.txt を貼らない。",
      "## アドレスが開いているとき",
      "- プールのリグ一覧の綴りを見ます。使えるのは文字、数字、アンダースコア、ハイフンです。Linux で --worker を省くと、説明は CSD_WORKER、WORKER_NAME、ホスト名へ落ちます。",
      "- 説明では、名前の無い古いマイナーは default と出ます。rig1 を探すと「そのリグは無い」ように見えます。",
      "- 最終出現が約15分より古いと、このページはその Worker を活動中にしません。名前は残り、非活動だけのことがあります。ページ全体の不検出とは違います。",
      "- 0 H/s のときは、受理シェアと拒否シェアがまだ動いているかを見ます。短いゼロでシステムを入れ直したりウォレットを回したりしない。",
      "- 現在の速度が空欄なら、この1時間の速度が今は不明です。台帳の金額は残し、空欄を 0 と書き換えない。",
      "## 例（記録された障害ではない）",
      "アドレス甲はまったく開きません。マイナーの文字列がウォレットの表示と違うか、仕事がまだ G-pools に届いていません。アドレス乙は開き、未払いは 0.02 CSD のままで、一覧には default だけで覚えている rig-a がありません。名前がプールに届いておらず、コインは乙にあります。アドレス丙は開き、1時間が 0 H/s で拒否シェアが増えています。新しい addr20 を作る前に、バックエンドか拒否の理由を見ます。",
      "各プロジェクト無料3台、Proは100台です。Worker が無いからと同じアドレスを保存し直しても残高は二つになりません。0x の有無も保存機器一つです。Worker ごとに機器として保存すると、その記録が枠を使います。",
      "次: 照合した addr20 で [CSD監視](/projects/csd) を開く。台帳が開けたら [ハッシュレートの単位](/learn/csd-worker-throughput-units) で H/s を読む。",
    ],
  },
  questions: {
    zh: [
      {
        question: "查无地址时要不要换新钱包？",
        answer:
          "先不要。多半是 addr20 抄错，或 G-pools 还没接到任何份额。新钱包不会把旧地址上的币搬过来，也会让你再占一台已保存设备。",
      },
      {
        question: "列表里只有 default，我的 rig 名字去哪了？",
        answer:
          "矿池说明写，没传 Worker 名的旧矿机会显示成 default。检查 --worker 或 CSD_WORKER。钱仍在原来的 addr20 上。",
      },
      {
        question: "0 H/s 和空白算力一样吗？",
        answer:
          "不一样。0 H/s 是矿池给出的零速率。空白是这一小时的速率暂时未知。两种情况下地址上的金额都还可以在。",
      },
    ],
    "zh-TW": [
      {
        question: "查無地址時要不要換新錢包？",
        answer:
          "先不要。多半是 addr20 抄錯，或 G-pools 還沒接到任何份額。新錢包不會把舊地址上的幣搬過來，也會讓你再占一台已保存設備。",
      },
      {
        question: "列表裡只有 default，我的 rig 名字去哪了？",
        answer:
          "礦池說明寫，沒傳 Worker 名的舊礦機會顯示成 default。檢查 --worker 或 CSD_WORKER。錢仍在原來的 addr20 上。",
      },
      {
        question: "0 H/s 和空白算力一樣嗎？",
        answer:
          "不一樣。0 H/s 是礦池給出的零速率。空白是這一小時的速率暫時未知。兩種情況下地址上的金額都還可以在。",
      },
    ],
    en: [
      {
        question: "If the address is missing, should I make a new wallet?",
        answer:
          "Not yet. The usual causes are a mistyped addr20 or no share accepted by G-pools. A new wallet does not move coins off the old address, and it uses another saved device.",
      },
      {
        question: "The list shows only default. Where is my rig name?",
        answer:
          "The pool notes say a legacy miner that sent no Worker name appears as default. Check --worker or CSD_WORKER. The coins stay on the original addr20.",
      },
      {
        question: "Is 0 H/s the same as a blank rate?",
        answer:
          "No. 0 H/s is a zero rate reported by the pool. A blank means this hour’s rate is unknown for now. In both cases the amounts on the address can still be there.",
      },
    ],
    ko: [
      {
        question: "주소가 없으면 새 지갑을 만들어야 하나요?",
        answer:
          "아직은 아닙니다. 흔한 원인은 addr20 오타이거나 G-pools가 지분을 아직 안 받은 경우입니다. 새 지갑은 옛 주소의 코인을 옮기지 않고, 저장된 기기를 하나 더 씁니다.",
      },
      {
        question: "목록에 default만 있습니다. 리그 이름은 어디에 있나요?",
        answer:
          "풀 안내는 Worker 이름을 보내지 않은 예전 채굴기가 default로 보인다고 합니다. --worker 또는 CSD_WORKER를 확인하세요. 코인은 원래 addr20에 있습니다.",
      },
      {
        question: "0 H/s와 빈 속도는 같나요?",
        answer:
          "다릅니다. 0 H/s는 풀이 보고한 제로 속도입니다. 빈칸은 이 시간의 속도를 잠시 모른다는 뜻입니다. 둘 다 주소의 금액은 남아 있을 수 있습니다.",
      },
    ],
    ja: [
      {
        question: "アドレスが無いとき、新しいウォレットを作りますか？",
        answer:
          "まだ作りません。多い原因は addr20 の写し間違い、または G-pools がまだシェアを受理していないことです。新しいウォレットは旧アドレスのコインを移さず、保存機器をもう一つ使います。",
      },
      {
        question: "一覧が default だけです。リグ名はどこですか？",
        answer:
          "プールの説明では、Worker名を送らない古いマイナーは default と出ます。--worker または CSD_WORKER を確認します。コインは元の addr20 に残ります。",
      },
      {
        question: "0 H/s と空欄の速度は同じですか？",
        answer:
          "違います。0 H/s はプールが報告したゼロの速度です。空欄は、この1時間の速度が今は不明です。どちらでもアドレス上の金額は残り得ます。",
      },
    ],
  },
};

export const csdDepthGuides: Article[] = [monitor, addressSetup, throughput, pending, notFound];
