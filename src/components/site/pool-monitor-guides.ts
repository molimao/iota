import { btcEthwGuides } from "./btc-ethw-guides";
import type { Article } from "./articles";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";

type Five = [string, string, string, string, string];

function plain(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function poolGuide(input: {
  slug: string;
  project: NonNullable<Article["project"]>;
  published?: string;
  title: Five;
  summary: Five;
  decision: Five;
  action: Five;
  comparisonTitle: Five;
  rows: [Five, Five][];
  sections: [Five, Five][];
  related: string[];
  sources: { name: string; url: string }[];
  keywords: Five[];
}): Article {
  return {
    slug: input.slug,
    project: input.project,
    published: input.published ?? "2026-10-22",
    modified: input.published ?? "2026-10-22",
    title: l(input.title),
    description: l(input.summary),
    summary: l(input.summary),
    topic: l(["操作与判断", "操作與判斷", "Checks and decisions", "확인과 판단", "確認と判断"]),
    decision: { title: l(input.decision), action: l(input.action) },
    comparisonTitle: l(input.comparisonTitle),
    comparison: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        {
          headers: l([
            ["观察", "下一步"],
            ["觀察", "下一步"],
            ["Observation", "Next step"],
            ["관찰", "다음 단계"],
            ["状態", "次の行動"],
          ])[locale],
          rows: input.rows.map(([left, right]) => [l(left)[locale], l(right)[locale]]),
        },
      ]),
    ) as NonNullable<Article["comparison"]>,
    body: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        input.sections.flatMap(([heading, body]) => [`## ${l(heading)[locale]}`, l(body)[locale]]),
      ]),
    ) as Article["body"],
    questions: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        input.sections.map(([heading, body]) => ({
          question: l(heading)[locale],
          answer: plain(l(body)[locale]),
        })),
      ]),
    ) as NonNullable<Article["questions"]>,
    related: input.related,
    sources: input.sources,
    keywords: Object.fromEntries(
      LOCALES.map((locale, index) => [locale, input.keywords.map((row) => row[index])]),
    ) as NonNullable<Article["keywords"]>,
  };
}

const poolMonitorGuideList: Article[] = [
  poolGuide({
    slug: "xmr-mining-monitor-guide",
    project: "xmr",
    title: [
      "XMR 监控该填标准地址、子地址还是集成地址？",
      "XMR 監控該填標準地址、子地址還是整合地址？",
      "Which Monero address should the XMR monitor use?",
      "XMR 모니터에는 표준·서브·통합 주소 중 무엇을 넣나요?",
      "XMR監視には標準・サブ・統合のどれを入れる？",
    ],
    summary: [
      "只读 Kryptex 的 XMR 公开地址。标准地址、子地址和集成地址形状不同；查询不启动挖矿，Worker 也不另占名额。",
      "只讀 Kryptex 的 XMR 公開地址。標準地址、子地址和整合地址形狀不同；查詢不啟動挖礦，Worker 也不另占名額。",
      "Read a public Kryptex XMR address. Standard, subaddress and integrated shapes differ. Lookup does not start mining, and Workers are not extra quota.",
      "Kryptex XMR 공개 주소만 읽습니다. 표준·서브·통합 주소의 형태가 다르고, 조회는 채굴을 시작하지 않으며 Worker는 별도 한도가 아닙니다.",
      "KryptexのXMR公開アドレスだけを読みます。標準・サブ・統合で形が違い、照会は採掘を始めず、Workerは追加枠ではありません。",
    ],
    decision: [
      "先对上 Kryptex 地址形状",
      "先對上 Kryptex 地址形狀",
      "Match the Kryptex address shape first",
      "먼저 Kryptex 주소 형태를 맞추기",
      "先にKryptexのアドレス形を合わせる",
    ],
    action: [
      "[打开 Monero 监控](/projects/xmr)，只粘贴公开地址，再到 Kryptex 核对份额。",
      "[開啟 Monero 監控](/projects/xmr)，只貼公開地址，再回 Kryptex 核對份額。",
      "[Open the Monero monitor](/projects/xmr), paste only the public address, then check shares on Kryptex.",
      "[Monero 모니터](/projects/xmr)에 공개 주소만 붙여 넣고 Kryptex에서 지분을 확인하세요.",
      "[Monero監視](/projects/xmr)に公開アドレスだけを貼り、Kryptexでシェアを確認します。",
    ],
    comparisonTitle: [
      "XMR 地址和收益对不上时",
      "XMR 地址和收益對不上時",
      "When the XMR address and rewards disagree",
      "XMR 주소와 보상이 어긋날 때",
      "XMRのアドレスと報酬が一致しないとき",
    ],
    rows: [
      [
        [
          "95 位且以 4 开头",
          "95 位且以 4 開頭",
          "95 characters starting with 4",
          "4로 시작하는 95자",
          "4で始まる95文字",
        ],
        [
          "按标准地址查询 Kryptex。",
          "按標準地址查詢 Kryptex。",
          "Look it up on Kryptex as a standard address.",
          "표준 주소로 Kryptex를 조회합니다.",
          "標準アドレスとしてKryptexを照会します。",
        ],
      ],
      [
        [
          "95 位且以 8 开头",
          "95 位且以 8 開頭",
          "95 characters starting with 8",
          "8로 시작하는 95자",
          "8で始まる95文字",
        ],
        [
          "这是子地址形状，可以提交，不要改成主地址猜测。",
          "這是子地址形狀，可以提交，不要改成主地址猜測。",
          "This is the subaddress shape. Submit it; do not guess a primary address.",
          "서브주소 형태이니 그대로 제출하고 대표 주소로 추측하지 마세요.",
          "サブアドレスの形です。そのまま送り、代表アドレスを推測しません。",
        ],
      ],
      [
        [
          "106 位且以 4 开头",
          "106 位且以 4 開頭",
          "106 characters starting with 4",
          "4로 시작하는 106자",
          "4で始まる106文字",
        ],
        [
          "按集成地址查询。短一截或带支付 ID 文本都会失败。",
          "按整合地址查詢。短一截或附支付 ID 文字都會失敗。",
          "Use it as an integrated address. A clipped value or a separate payment-ID note fails.",
          "통합 주소로 조회합니다. 잘리거나 결제 ID 문구가 붙으면 실패합니다.",
          "統合アドレスとして照会します。欠けたり支払いIDの文言が付くと失敗します。",
        ],
      ],
      [
        [
          "有算力但今日没有数字",
          "有算力但今日沒有數字",
          "Hashrate without a today figure",
          "해시레이트는 있는데 오늘 숫자가 없음",
          "算力はあるが本日の数字がない",
        ],
        [
          "今日按 UTC 零点取点；没有点是缺失，不是没挖到。",
          "今日按 UTC 零點取點；沒有點是缺失，不是沒挖到。",
          "Today uses the UTC-midnight point. No point means unavailable, not zero earnings.",
          "오늘은 UTC 자정 지점을 씁니다. 점이 없으면 수익 0이 아니라 없음입니다.",
          "本日はUTC零時の点を使います。点が無いのは収益ゼロではなく未取得です。",
        ],
      ],
    ],
    sections: [
      [
        [
          "应该填标准地址、子地址还是集成地址？",
          "該填標準地址、子地址還是整合地址？",
          "Should I enter a standard address, a subaddress, or an integrated address?",
          "표준 주소, 서브주소, 통합 주소 중 무엇을 입력하나요?",
          "標準アドレス、サブアドレス、統合アドレスのどれを入れますか？",
        ],
        [
          "只填 Kryptex 挖矿配置里的公开 XMR 地址。不要填 wallet.worker、solo: 前缀、OpenAlias、视图密钥或助记词。Monero 对原始地址的说明是 95 个字符、以 4 或 8 开头，集成地址是 106 个字符。本页据此接受三种：以 4 开头的 95 位标准地址、以 8 开头的 95 位子地址，以及以 4 开头的 106 位集成地址。在这里查询不会启动 RandomX，也不会在你的 CPU 上开始挖矿。",
          "只填 Kryptex 挖礦設定裡的公開 XMR 地址。不要填 wallet.worker、solo: 前綴、OpenAlias、檢視金鑰或助記詞。Monero 對原始地址的說明是 95 個字元、以 4 或 8 開頭，整合地址是 106 個字元。本頁接受三種：以 4 開頭的 95 位標準地址、以 8 開頭的 95 位子地址，以及以 4 開頭的 106 位整合地址。在這裡查詢不會啟動 RandomX，也不會在 CPU 上開始挖礦。",
          "Paste only the public XMR address from the Kryptex miner configuration. Do not paste wallet.worker, a solo: prefix, OpenAlias, a view key, or a seed. Monero describes a raw address as 95 characters starting with 4 or 8, and an integrated address as 106 characters. This page accepts those three shapes: a 95-character standard address starting with 4, a 95-character subaddress starting with 8, and a 106-character integrated address starting with 4. Lookup does not start RandomX and does not mine on your CPU.",
          "Kryptex 채굴 설정의 공개 XMR 주소만 붙여 넣으세요. wallet.worker, solo: 접두사, OpenAlias, 뷰 키, 시드는 넣지 마세요. Monero의 원문 주소는 4 또는 8로 시작하는 95자이고, 통합 주소는 106자입니다. 이 페이지는 4로 시작하는 95자 표준 주소, 8로 시작하는 95자 서브주소, 4로 시작하는 106자 통합 주소만 받습니다. 조회는 RandomX를 시작하지 않으며 CPU에서 채굴을 돌리지 않습니다.",
          "Kryptexの採掘設定にある公開XMRアドレスだけを貼ります。wallet.worker、solo: 接頭辞、OpenAlias、ビューキー、シードは入れません。Moneroの説明では生アドレスは4か8で始まる95文字、統合アドレスは106文字です。ここでは4で始まる95文字の標準アドレス、8で始まる95文字のサブアドレス、4で始まる106文字の統合アドレスを受け付けます。照会はRandomXを起動せず、CPUで採掘を始めません。",
        ],
      ],
      [
        [
          "支持哪个 XMR 矿池？",
          "支援哪個 XMR 礦池？",
          "Which XMR pool is covered?",
          "어떤 XMR 풀을 지원하나요?",
          "どのXMRプールが対象ですか？",
        ],
        [
          "只覆盖 Kryptex 的 XMR 账户，不覆盖 2Miners，也不把 Zephyr 的 ZEPHYR 地址当成门罗币。Kryptex 页面同时提供 PPS+，并说明 SOLO 要在矿工程序里使用 solo: 前缀。本站按钱包地址读取该矿池账户，不切换计费模式。SOLO 是否写在同一条钱包记录里，这次没有单独核实；矿池没有账户时显示未找到，不是收益为零。",
          "只覆蓋 Kryptex 的 XMR 帳戶，不覆蓋 2Miners，也不把 Zephyr 的 ZEPHYR 地址當成門羅幣。Kryptex 頁面同時提供 PPS+，並說明 SOLO 要在礦工程式使用 solo: 前綴。本站按錢包地址讀取該礦池帳戶，不切換計費模式。SOLO 是否寫在同一條錢包紀錄，這次沒有單獨核實；礦池沒有帳戶時顯示未找到，不是收益為零。",
          "Coverage is the Kryptex XMR account only. It is not 2Miners, and a Zephyr ZEPHYR address is not Monero. Kryptex publishes PPS+ and says SOLO uses a solo: prefix in the miner. This site reads the pool account for the wallet and does not switch payout mode. Whether SOLO shares that same wallet record was not separately verified. No pool account is not-found, not zero earnings.",
          "대상은 Kryptex XMR 계정뿐입니다. 2Miners가 아니고, Zephyr의 ZEPHYR 주소는 모네로가 아닙니다. Kryptex는 PPS+를 제공하고 SOLO는 채굴 프로그램의 solo: 접두사라고 적습니다. 이 사이트는 지갑 주소의 풀 계정을 읽으며 정산 방식을 바꾸지 않습니다. SOLO가 같은 지갑 기록인지는 따로 확인하지 않았습니다. 풀에 계정이 없으면 미발견이지 수익 0이 아닙니다.",
          "対象はKryptexのXMRアカウントだけです。2Minersではなく、ZephyrのZEPHYRアドレスはMoneroではありません。KryptexはPPS+を掲げ、SOLOは採掘ソフトのsolo:接頭辞だと説明しています。当サイトはそのウォレットのプール口座を読むだけで、精算方式は切り替えません。SOLOが同じウォレット記録かは別途確認していません。口座が無ければ未検出であり、収益ゼロではありません。",
        ],
      ],
      [
        [
          "为什么没有 Worker，也没有收益？",
          "為什麼沒有 Worker，也沒有收益？",
          "Why are Workers and rewards missing?",
          "Worker도 보상도 없는 이유는?",
          "Workerも報酬も無いのはなぜ？",
        ],
        [
          "先确认矿工程序连的是 Kryptex XMR，且粘贴的是完整公开地址，不是 Worker 名称。Worker 来自矿池返回的名单。名单为空，或账户不存在，先回 Kryptex 看最近份额。本站空白不能证明进程已停。页面上的获取时间用香港时间，只表示本站拿到响应的时刻。更一般的时间区别见 [数据来源与新鲜度](/learn/data-sources-and-freshness)。",
          "先確認礦工程式連的是 Kryptex XMR，且貼上的是完整公開地址，不是 Worker 名稱。Worker 來自礦池回傳的名單。名單是空的，或帳戶不存在，先回 Kryptex 看最近份額。本站空白不能證明行程已停。頁面上的取得時間用香港時間，只表示本站拿到回應的時刻。更一般的時間區別見 [資料來源與新鮮度](/learn/data-sources-and-freshness)。",
          "Confirm the miner points at Kryptex XMR and that you pasted the full public address, not a Worker name. Workers come from the list the pool returns. An empty list or a missing account means check recent shares on Kryptex first. A blank page here does not prove the process stopped. The fetch clock is Hong Kong time and only marks when this site received a response. See [sources and freshness](/learn/data-sources-and-freshness) for the broader distinction.",
          "채굴 프로그램이 Kryptex XMR을 가리키는지, 붙여 넣은 값이 Worker 이름이 아닌 전체 공개 주소인지 먼저 확인하세요. Worker는 풀이 돌려준 목록입니다. 목록이 비었거나 계정이 없으면 Kryptex에서 최근 지분을 보세요. 여기가 비어 있다고 프로세스가 멈춘 것은 아닙니다. 조회 시각은 홍콩 시간이며 이 사이트가 응답을 받은 시각입니다. 시간 구분는 [데이터 출처와 신선도](/learn/data-sources-and-freshness)를 보세요.",
          "採掘ソフトがKryptex XMRを向き、貼った値がWorker名ではなく完全な公開アドレスか先に確認します。Workerはプールが返した一覧です。一覧が空、または口座が無いときはKryptexで直近のシェアを見ます。ここが空でもプロセス停止の証明にはなりません。取得時刻は香港時間で、このサイトが応答を受け取った時刻です。時刻の区別は[データ源と鮮度](/learn/data-sources-and-freshness)を参照します。",
        ],
      ],
      [
        [
          "算力为什么不等于实际到手的 XMR？",
          "算力為什麼不等於實際到手的 XMR？",
          "Why is hashrate not the XMR you received?",
          "해시레이트가 실제 XMR이 아닌 이유는?",
          "算力が手元のXMRと違うのはなぜ？",
        ],
        [
          "Kryptex 把 XMR 标成 RandomX，快速开始指向 CPU 矿工程序；同一页还有 ASIC/FPGA 入口，所以不能把硬件说成只有 CPU。本站不读取处理器，也不估算电费或收益。地址算力来自矿池给出的 Worker 速率：每个 Worker 都有数字才相加，缺一个就不显示总和。这个速率不是已入账的 XMR，也不是链上钱包余额。",
          "Kryptex 把 XMR 標成 RandomX，快速開始指向 CPU 礦工程式；同一頁還有 ASIC/FPGA 入口，所以不能把硬體說成只有 CPU。本站不讀取處理器，也不估算電費或收益。地址算力來自礦池給出的 Worker 速率：每個 Worker 都有數字才相加，缺一個就不顯示總和。這個速率不是已入帳的 XMR，也不是鏈上錢包餘額。",
          "Kryptex labels XMR as RandomX and its quick start points to a CPU miner. The same page also has an ASIC/FPGA section, so this guide does not claim CPU is the only hardware. This site does not read your processor and does not estimate power cost or profit. Address hashrate comes from the Worker rates the pool sent. The total is shown only when every Worker has a number. That rate is neither posted XMR nor the on-chain wallet balance.",
          "Kryptex는 XMR을 RandomX로 표시하고 빠른 시작은 CPU 채굴 프로그램을 가리킵니다. 같은 페이지에 ASIC/FPGA 항목도 있어 하드웨어를 CPU만이라고 말하지 않습니다. 이 사이트는 프로세서를 읽지 않고 전기요금이나 수익을 추정하지 않습니다. 주소 해시레이트는 풀이 준 Worker 속도입니다. 모든 Worker에 숫자가 있을 때만 더하며, 하나라도 없으면 합계를 보이지 않습니다. 이 속도는 기장된 XMR도, 체인 지갑 잔액도 아닙니다.",
          "KryptexはXMRをRandomXと表示し、クイックスタートはCPU採掘ソフトを示します。同じページにASIC/FPGAの項目もあるため、機器をCPUだけとは書きません。当サイトはプロセッサを読まず、電気代や利益も見積もりません。アドレス算力はプールが返したWorker速度です。すべてのWorkerに数値があるときだけ合計し、一つ欠けると合計を出しません。この速度は記帳済みXMRでもチェーン上の残高でもありません。",
        ],
      ],
      [
        [
          "未支付、已支付和 UTC 今日分别是什么？",
          "未支付、已支付和 UTC 今日分別是什麼？",
          "What do unpaid, paid, and UTC today mean?",
          "미지급, 지급완료, UTC 오늘은 무엇인가요?",
          "未払い、支払済み、UTCの本日は何ですか？",
        ],
        [
          "未支付余额是矿池尚未付出的记账，累计已支付是已经付出的合计，不要相加，也不要当成钱包里的币。今日收益取 UTC 自然日，对应当天 UTC 零点的奖励点；没有这个点就是缺失，不是 0。它不是香港时间或北京时间的日历日，也不是滚动 24 小时。Kryptex 会在自己的页面公布最低支付，数额以矿池当时页面为准。有算力不等于已经付出。",
          "未支付餘額是礦池尚未付出的記帳，累計已支付是已經付出的合計，不要相加，也不要當成錢包裡的幣。今日收益取 UTC 自然日，對應當天 UTC 零點的獎勵點；沒有這個點就是缺失，不是 0。它不是香港時間或北京時間的日曆日，也不是滾動 24 小時。Kryptex 會在自己的頁面公布最低支付，數額以礦池當時頁面為準。有算力不等於已經付出。",
          "Unpaid balance is what the pool has not paid out. Total paid is the sum already sent. Do not add them, and do not treat either as coins sitting in the wallet. Today follows the UTC calendar day and the reward point at that UTC midnight. If the point is absent, the figure is unavailable, not zero. It is not a Hong Kong or Beijing calendar day, and it is not a rolling 24 hours. Kryptex publishes its own minimum payout; use the current pool page for that amount. Hashrate does not mean a payout already happened.",
          "미지급 잔액은 풀이 아직 보내지 않은 기장이고, 누적 지급은 이미 보낸 합계입니다. 둘을 더하거나 지갑 속 코인으로 보지 마세요. 오늘 보상은 UTC 달력일이며 그날 UTC 자정의 보상 지점입니다. 그 점이 없으면 0이 아니라 없음입니다. 홍콩·베이징 달력일도 아니고 최근 24시간도 아닙니다. Kryptex는 자체 페이지에 최소 지급액을 올립니다. 금액은 그 페이지의 현재 값을 보세요. 해시레이트가 있다고 이미 지급된 것은 아닙니다.",
          "未払い残高はプールがまだ払っていない記帳、累計支払はすでに送った合計です。足し合わせず、ウォレット内のコインともみなしません。本日の報酬はUTCの暦日で、その日のUTC零時の報酬点です。点が無ければゼロではなく欠損です。香港や北京の暦日でも、直近24時間でもありません。Kryptexは自身のページに最低支払を出します。金額はそのページの現行値を見てください。算力があっても支払済みではありません。",
        ],
      ],
      [
        [
          "多个地址怎么入库，Worker 会额外收费吗？",
          "多個地址怎麼入庫，Worker 會額外收費嗎？",
          "How do I save addresses, and do Workers add a charge?",
          "주소는 어떻게 저장하며 Worker는 추가 요금인가요?",
          "複数アドレスの保存と、Workerは追加料金ですか？",
        ],
        [
          "登录后在 [Monero 监控](/projects/xmr) 一行保存一个公开地址，这就是一个账户。查询不会自动入库。免费每个项目 5 个，Pro 50 个。同一地址下的多个 Worker 只筛选算力和在线状态，不按 Worker 再占一台，也不另收费。设备总览没有额外总数上限。总览、Mac Agent 和崩溃解读仍按原规则可用，不占用这个 XMR 名额。移除只解除已保存的地址，不会停止 Kryptex 上的矿工程序。读取失败时可能暂时保留上次成功的数字和原来的获取时间，并标成过期；矿池确认没有该地址时，不把旧数字当成还在挖。",
          "登入後在 [Monero 監控](/projects/xmr) 一行儲存一個公開地址，這就是一個帳戶。查詢不會自動入庫。免費每個專案 5 個，Pro 50 個。同一地址下的多個 Worker 只篩選算力和連線狀態，不按 Worker 再占一台，也不另收費。設備總覽沒有額外總數上限。總覽、Mac Agent 和崩潰解讀仍按原規則可用，不占用這個 XMR 名額。移除只解除已儲存的地址，不會停止 Kryptex 上的礦工程式。讀取失敗時可能暫時保留上次成功的數字和原來的取得時間，並標成過期；礦池確認沒有該地址時，不把舊數字當成還在挖。",
          "After sign-in, one line in the [Monero monitor](/projects/xmr) saves one public address, and that is one account. A lookup does not save itself. Free is 5 per project and Pro is 50. Workers under that address only filter hashrate and status. They do not take another device slot and they are not an extra charge. The device overview has no further total cap. Overview, the Mac Agent, and crash interpretation stay on their existing free rules and do not use this XMR quota. Remove only detaches the saved address; it does not stop the miner at Kryptex. A failed read can keep the last success and its original fetch time, marked stale. If the pool confirms the address is absent, those old numbers are not treated as ongoing mining.",
          "로그인 후 [Monero 모니터](/projects/xmr)에서 한 줄이 공개 주소 하나, 즉 계정 하나입니다. 조회만으로 저장되지 않습니다. 프로젝트당 무료 5개, Pro 50개입니다. 그 주소의 Worker는 해시레이트와 상태만 거릅니다. 기기를 하나 더 차지하지 않고 추가 요금도 아닙니다. 기기 총괄에는 별도의 총수 상한이 없습니다. 총괄, Mac Agent, 충돌 해석은 기존 무료 규칙을 유지하며 이 XMR 한도를 쓰지 않습니다. 제거는 저장된 주소만 떼며 Kryptex의 채굴 프로그램을 멈추지 않습니다. 읽기 실패 시 이전 성공 값과 원래 조회 시각이 잠시 남고 오래됨으로 표시될 수 있습니다. 풀이 주소 없음을 확인하면 옛 숫자를 채굴 중으로 보지 않습니다.",
          "ログイン後、[Monero監視](/projects/xmr)の1行が公開アドレス1件、つまり1口座です。照会だけでは保存されません。各プロジェクト無料5件、Proは50件です。そのアドレスのWorkerは算力と状態を絞るだけです。別の端末枠を使わず、追加料金にもなりません。デバイス総覧に別の総数上限はありません。総覧、Mac Agent、クラッシュ解釈は従来の無料ルールのままで、このXMR枠を使いません。削除は保存したアドレスを外すだけで、Kryptex上の採掘ソフトは止めません。取得失敗時は直前の成功値と元の取得時刻がしばらく残り、古い表示になることがあります。プールがアドレス無しと確認した場合、古い数字を採掘継続とはみなしません。",
        ],
      ],
    ],
    related: ["zeph-mining-monitor-guide", "data-sources-and-freshness"],
    sources: [
      { name: "Kryptex · Monero pool", url: "https://pool.kryptex.com/en/xmr" },
      {
        name: "Monero · address types",
        url: "https://www.getmonero.org/resources/moneropedia/address.html",
      },
    ],
    keywords: [
      ["XMR 子地址", "XMR 子地址", "XMR subaddress", "XMR 서브주소", "XMRサブアドレス"],
      [
        "Kryptex RandomX",
        "Kryptex RandomX",
        "Kryptex RandomX",
        "Kryptex RandomX",
        "Kryptex RandomX",
      ],
      ["集成地址", "整合地址", "integrated address", "통합 주소", "統合アドレス"],
      ["UTC 今日收益", "UTC 今日收益", "UTC daily reward", "UTC 오늘 보상", "UTCの本日報酬"],
    ],
  }),
  poolGuide({
    slug: "etc-mining-monitor-guide",
    project: "etc",
    title: [
      "ETC 监控为什么不能填以太坊地址或 SOLO 矿池？",
      "ETC 監控為什麼不能填以太坊地址或 SOLO 礦池？",
      "Why the ETC monitor rejects an Ethereum address and SOLO",
      "ETC 모니터가 이더리움 주소와 SOLO를 받지 않는 이유",
      "ETC監視がイーサリアムアドレスとSOLOを受けない理由",
    ],
    summary: [
      "Ethereum Classic 的普通 2Miners 账户才在范围内。0x 地址看起来像 ETH，链和 SOLO 服务器都不是同一笔余额。",
      "Ethereum Classic 的普通 2Miners 帳戶才在範圍內。0x 地址看起來像 ETH，鏈和 SOLO 伺服器都不是同一筆餘額。",
      "Only a regular 2Miners Ethereum Classic account is in range. A 0x string can look like ETH, but the chain and the SOLO server are different balances.",
      "Ethereum Classic의 일반 2Miners 계정만 범위입니다. 0x 문자열이 ETH처럼 보여도 체인과 SOLO 서버의 잔액은 다릅니다.",
      "Ethereum Classicの通常2Miners口座だけが対象です。0xでもETHとは別で、SOLOサーバーの残高とも違います。",
    ],
    decision: [
      "先确认是 ETC 这条链",
      "先確認是 ETC 這條鏈",
      "Confirm the ETC chain first",
      "먼저 ETC 체인인지 확인",
      "先にETCのチェーンか確認",
    ],
    action: [
      "[打开 Ethereum Classic 监控](/projects/etc)，粘贴 0x 收益地址，不要打开 SOLO 服务器。",
      "[開啟 Ethereum Classic 監控](/projects/etc)，貼上 0x 收益地址，不要打開 SOLO 伺服器。",
      "[Open the Ethereum Classic monitor](/projects/etc) and paste the 0x payout address, not the SOLO server.",
      "[Ethereum Classic 모니터](/projects/etc)에 0x 보상 주소를 넣고 SOLO 서버는 열지 마세요.",
      "[Ethereum Classic監視](/projects/etc)に0xの報酬アドレスを入れ、SOLOサーバーは開きません。",
    ],
    comparisonTitle: [
      "ETC 和 ETH、SOLO 容易混的地方",
      "ETC 和 ETH、SOLO 容易混的地方",
      "Where ETC is confused with ETH or SOLO",
      "ETC를 ETH·SOLO와 섞기 쉬운 지점",
      "ETCをETHやSOLOと混同しやすい点",
    ],
    rows: [
      [
        [
          "0x 加 40 位十六进制",
          "0x 加 40 位十六進位",
          "0x plus 40 hex characters",
          "0x와 16진수 40자리",
          "0xと16進40桁",
        ],
        [
          "这是本页接受的 ETC 收益地址，大小写视为同一个。",
          "這是本頁接受的 ETC 收益地址，大小寫視為同一個。",
          "This is the ETC payout form this page accepts. Letter case is the same account.",
          "이 페이지가 받는 ETC 보상 주소이며 대소문자는 같은 계정입니다.",
          "このページが受けるETC報酬アドレスで、大文字小文字は同一口座です。",
        ],
      ],
      [
        [
          "交易所里的 ETH 余额",
          "交易所裡的 ETH 餘額",
          "An ETH balance at an exchange",
          "거래소의 ETH 잔액",
          "取引所のETH残高",
        ],
        [
          "Ethereum Classic 与 Ethereum 是两条网络，不要互相当收益。",
          "Ethereum Classic 與 Ethereum 是兩條網路，不要互相當收益。",
          "Ethereum Classic and Ethereum are different networks. Do not treat one balance as the other.",
          "Ethereum Classic과 Ethereum은 다른 네트워크입니다. 잔액을 서로 수익으로 보지 마세요.",
          "Ethereum ClassicとEthereumは別のネットワークです。残高を互いの収益にしないでください。",
        ],
      ],
      [
        [
          "btc 或 UQ 开头的收款地址",
          "btc 或 UQ 開頭的收款地址",
          "A payout starting with bc1 or UQ",
          "bc1 또는 UQ로 시작하는 주소",
          "bc1やUQで始まる受取先",
        ],
        [
          "2Miners 可以帮助页提供 BTC、TON 支付，本页不查询那些地址。",
          "2Miners 幫助頁提供 BTC、TON 支付，本頁不查詢那些地址。",
          "The 2Miners help offers BTC and TON payouts. This page does not query those addresses.",
          "2Miners 도움말은 BTC·TON 지급을 안내합니다. 이 페이지는 그 주소를 조회하지 않습니다.",
          "2MinersのヘルプはBTCとTON支払を案内します。このページはそれらのアドレスを照会しません。",
        ],
      ],
      [
        [
          "solo-etc.2miners.com 有记录",
          "solo-etc.2miners.com 有紀錄",
          "A record on solo-etc.2miners.com",
          "solo-etc.2miners.com에 기록",
          "solo-etc.2miners.comに記録",
        ],
        [
          "那是另一台 API 服务器。回到 etc.2miners.com 的普通矿池账户。",
          "那是另一台 API 伺服器。回到 etc.2miners.com 的普通礦池帳戶。",
          "That is a separate API server. Use the regular account on etc.2miners.com.",
          "그것은 별도 API 서버입니다. etc.2miners.com의 일반 계정으로 돌아오세요.",
          "別のAPIサーバーです。etc.2miners.comの通常口座に戻ります。",
        ],
      ],
    ],
    sections: [
      [
        [
          "应该填哪种 ETC 地址？",
          "該填哪種 ETC 地址？",
          "Which ETC address should I enter?",
          "어떤 ETC 주소를 입력하나요?",
          "どのETCアドレスを入力しますか？",
        ],
        [
          "填写普通矿池 etc.2miners.com 上配置的 Ethereum Classic 收益地址：0x 后面 40 个十六进制字符。字母大小写在保存时视为同一个账户。2Miners 帮助页把示例写成 ETC 的 0x 形式，同时允许改领 BTC 或 TON。bc1、3、1 或 UQ 开头的地址即使能在矿池领款，本页也不查询。不要填私钥。查询不会启动 ETCHash 挖矿。",
          "填寫普通礦池 etc.2miners.com 上設定的 Ethereum Classic 收益地址：0x 後面 40 個十六進位字元。字母大小寫在儲存時視為同一個帳戶。2Miners 幫助頁把示例寫成 ETC 的 0x 形式，同時允許改領 BTC 或 TON。bc1、3、1 或 UQ 開頭的地址即使能在礦池領款，本頁也不查詢。不要填私鑰。查詢不會啟動 ETCHash 挖礦。",
          "Enter the Ethereum Classic payout configured on the regular pool etc.2miners.com: 0x followed by 40 hexadecimal characters. Letter case is one saved account. The 2Miners help shows that 0x form and also allows BTC or TON payouts. Addresses starting with bc1, 3, 1, or UQ are not queried here even if the pool can pay them. Do not paste a private key. Lookup does not start ETCHash mining.",
          "일반 풀 etc.2miners.com에 넣은 Ethereum Classic 보상 주소를 입력하세요. 0x 뒤 16진수 40자리입니다. 대소문자는 저장 시 같은 계정입니다. 2Miners 도움말은 그 0x 형태를 보여주고 BTC·TON 수령도 허용합니다. bc1, 3, 1, UQ로 시작해도 풀에서 받을 수 있다면 이 페이지는 조회하지 않습니다. 비밀키는 넣지 마세요. 조회는 ETCHash 채굴을 시작하지 않습니다.",
          "通常プール etc.2miners.com に設定した Ethereum Classic の報酬アドレスを入れます。0xの後に16進40文字です。大文字小文字は保存時に同一口座です。2Minersのヘルプはその0x形式を示し、BTCやTONでの受取も案内します。bc1、3、1、UQで始まっても、ここでは照会しません。秘密鍵は貼らないでください。照会はETCHashの採掘を始めません。",
        ],
      ],
      [
        [
          "这是 ETH 还是 ETC，支持哪个矿池？",
          "這是 ETH 還是 ETC，支援哪個礦池？",
          "Is this ETH or ETC, and which pool is supported?",
          "ETH인가요 ETC인가요, 어느 풀인가요?",
          "ETHですかETCですか。どのプールですか？",
        ],
        [
          "这是 Ethereum Classic，不是 Ethereum。两条网络可以出现长相相似的 0x 地址，交易所里的 ETH 余额、以太坊上的代币余额，都不是这口矿池的未支付 ETC。算法以 2Miners 帮助页所写的 ETCHash 为准。本页只读 etc.2miners.com 的普通矿池账户。官方 API 文档把 solo-etc.2miners.com 列为另一台服务器，SOLO 记录不会出现在这里。",
          "這是 Ethereum Classic，不是 Ethereum。兩條網路可以出現長相相似的 0x 地址，交易所裡的 ETH 餘額、以太坊上的代幣餘額，都不是這口礦池的未支付 ETC。演算法以 2Miners 幫助頁所寫的 ETCHash 為準。本頁只讀 etc.2miners.com 的普通礦池帳戶。官方 API 文件把 solo-etc.2miners.com 列為另一台伺服器，SOLO 紀錄不會出現在這裡。",
          "This is Ethereum Classic, not Ethereum. Similar 0x text can exist on both networks. An ETH exchange balance or a token balance on Ethereum is not this pool's unpaid ETC. The algorithm name to use is ETCHash, as the 2Miners help writes it. This page reads only the regular account on etc.2miners.com. The API documentation lists solo-etc.2miners.com as another server, so SOLO records do not appear here.",
          "이것은 Ethereum Classic이지 Ethereum이 아닙니다. 비슷한 0x 문자가 두 네트워크에 있을 수 있습니다. 거래소 ETH 잔액이나 이더리움 토큰 잔액은 이 풀의 미지급 ETC가 아닙니다. 알고리즘 이름은 2Miners 도움말의 ETCHash입니다. 이 페이지는 etc.2miners.com의 일반 계정만 읽습니다. API 문서는 solo-etc.2miners.com을 다른 서버로 적으므로 SOLO 기록은 여기 나오지 않습니다.",
          "これは Ethereum Classic であり Ethereum ではありません。似た 0x 表記が両方にあり得ます。取引所のETH残高やイーサリアム上のトークン残高は、このプールの未払いETCではありません。アルゴリズム名は2MinersヘルプのETCHashです。このページは etc.2miners.com の通常口座だけを読みます。API文書は solo-etc.2miners.com を別サーバーとして載せるので、SOLOの記録はここに出ません。",
        ],
      ],
      [
        [
          "为什么没有 Worker 或没有收益？",
          "為什麼沒有 Worker 或沒有收益？",
          "Why are Workers or rewards missing?",
          "Worker나 보상이 없는 이유는?",
          "Workerや報酬が無いのはなぜ？",
        ],
        [
          "矿机里的 RIG 名称不是要查询的地址。地址必须和 etc.2miners.com 普通矿池里的收款地址完全一致。另一口矿池、SOLO 服务器，或你改领了 BTC，都会让这里没有 ETC 账户。那不证明机器停了。先看矿池是否收到份额，再看本站获取时间。获取时间是香港时间的响应时刻，说明见 [数据来源与新鲜度](/learn/data-sources-and-freshness)。",
          "礦機裡的 RIG 名稱不是要查詢的地址。地址必須和 etc.2miners.com 普通礦池裡的收款地址完全一致。另一口礦池、SOLO 伺服器，或你改領了 BTC，都會讓這裡沒有 ETC 帳戶。那不證明機器停了。先看礦池是否收到份額，再看本站取得時間。取得時間是香港時間的回應時刻，說明見 [資料來源與新鮮度](/learn/data-sources-and-freshness)。",
          "The rig name in the miner is not the address to look up. The address must match the payout on the regular etc.2miners.com pool exactly. Another pool, the SOLO server, or a switch to BTC payout leaves no ETC account here. That does not prove the machine stopped. Check whether the pool accepted shares, then the fetch time. Fetch time is the Hong Kong-time response clock. See [sources and freshness](/learn/data-sources-and-freshness).",
          "채굴기의 RIG 이름은 조회할 주소가 아닙니다. 주소는 etc.2miners.com 일반 풀의 수령 주소와 완전히 같아야 합니다. 다른 풀, SOLO 서버, BTC 수령으로 바꾸면 여기 ETC 계정이 없습니다. 그것이 기기 정지는 아닙니다. 풀이 지분을 받았는지 본 다음 조회 시각을 보세요. 조회 시각은 홍콩 시간의 응답 시각입니다. [데이터 출처와 신선도](/learn/data-sources-and-freshness)를 참고하세요.",
          "リグ名は照会するアドレスではありません。アドレスは etc.2miners.com の通常プールの受取先と完全一致が必要です。別プール、SOLOサーバー、BTC受取への変更では、ここにETC口座がありません。機械停止の証明にはなりません。プールがシェアを受けたか見てから、取得時刻を見ます。取得時刻は香港時間の応答時刻です。[データ源と鮮度](/learn/data-sources-and-freshness)を参照します。",
        ],
      ],
      [
        [
          "矿池算力和实际 ETC 收益有什么区别？",
          "礦池算力和實際 ETC 收益有什麼區別？",
          "How does pool hashrate differ from ETC you keep?",
          "풀 해시레이트와 실제 ETC 수익의 차이는?",
          "プール算力と手元のETCはどう違いますか？",
        ],
        [
          "页面上的算力是矿池根据当前账户报告的速率，单位是 H/s 这一类速率，不是 ETC 枚数。Worker 各自的速率可以和账户速率不同。选择某个 Worker 只筛选这台名称的速率和在线状态，不会把未支付余额拆开。速率升高也不表示已经达到支付或已经到账。本页不估算收益，也不提供租用算力的做法。",
          "頁面上的算力是礦池根據當前帳戶報告的速率，單位是 H/s 這一類速率，不是 ETC 枚數。Worker 各自的速率可以和帳戶速率不同。選擇某個 Worker 只篩選這台名稱的速率和連線狀態，不會把未支付餘額拆開。速率升高也不表示已經達到支付或已經到帳。本頁不估算收益，也不提供租用算力的做法。",
          "The rate on the page is what the pool reports for the current account. The unit is a hashrate such as H/s, not a count of ETC. Each Worker's rate can differ from the account rate. Choosing a Worker filters that name's rate and status only. It does not split the unpaid balance. A higher rate does not mean a payout threshold was reached or that coins arrived. This page does not estimate profit and does not explain rented hashrate.",
          "페이지의 속도는 풀이 현재 계정에 대해 보고한 값입니다. 단위는 H/s 같은 해시레이트이지 ETC 개수가 아닙니다. Worker별 속도는 계정 속도와 다를 수 있습니다. Worker를 고르면 그 이름의 속도와 상태만 거르며, 미지급 잔액을 나누지 않습니다. 속도가 올라도 지급 기준을 넘었거나 입금됐다는 뜻은 아닙니다. 이 페이지는 수익을 추정하지 않고 임대 해시레이트 방법도 적지 않습니다.",
          "ページの速度はプールが現在の口座について報告した値です。単位はH/sのような算力であり、ETCの枚数ではありません。Workerごとの速度は口座の速度と違い得ます。Workerを選ぶとその名前の速度と状態だけを絞り、未払い残高は分割しません。速度が上がっても支払基準や着金を意味しません。このページは利益を見積もらず、レンタル算力の手順も書きません。",
        ],
      ],
      [
        [
          "余额、已支付和近 24 小时怎么读？",
          "餘額、已支付和近 24 小時怎麼讀？",
          "How do I read balance, paid, and the last 24 hours?",
          "잔액, 지급완료, 최근 24시간은 어떻게 읽나요?",
          "残高、支払済み、直近24時間の読み方は？",
        ],
        [
          "未支付余额、累计已支付、近 24 小时收益是三笔数。近 24 小时是滚动窗口，不是 UTC 零点到现在，也不是香港时间的自然日。三笔都不要和链上钱包余额相加。缺数字时显示横线，横线不是 0。2Miners 帮助页还写了支付币种可以换成 BTC 或 TON；那种到账不会变成这里的 ETC 余额。",
          "未支付餘額、累計已支付、近 24 小時收益是三筆數。近 24 小時是滾動窗口，不是 UTC 零點到現在，也不是香港時間的自然日。三筆都不要和鏈上錢包餘額相加。缺數字時顯示橫線，橫線不是 0。2Miners 幫助頁還寫了支付幣種可以換成 BTC 或 TON；那種到帳不會變成這裡的 ETC 餘額。",
          "Unpaid balance, total paid, and the last 24 hours are three figures. The 24-hour figure is a rolling window, not UTC midnight until now, and not a Hong Kong calendar day. Do not add any of them to an on-chain wallet balance. A dash is missing data, not zero. The 2Miners help also says payouts can be switched to BTC or TON. Those arrivals do not become the ETC balance here.",
          "미지급 잔액, 누적 지급, 최근 24시간 보상은 세 숫자입니다. 24시간은 구간의 이동 창이며 UTC 자정부터 지금, 또는 홍콩 달력일이 아닙니다. 체인 지갑 잔액과 더하지 마세요. 가로줄은 없는 데이터이지 0이 아닙니다. 2Miners 도움말은 지급 코인을 BTC나 TON으로 바꿀 수 있다고 적습니다. 그 입금은 여기의 ETC 잔액이 되지 않습니다.",
          "未払い残高、累計支払、直近24時間の報酬は三つの数です。24時間は転がる窓であり、UTC零時から現在でも香港時間の暦日でもありません。チェーン上の残高と足さないでください。横線は欠損でありゼロではありません。2Minersのヘルプは支払通貨をBTCやTONに変えられるとも書いています。その着金はここのETC残高にはなりません。",
        ],
      ],
      [
        [
          "多个钱包怎么保存和移除，异常怎么看时间？",
          "多個錢包怎麼儲存和移除，異常怎麼看時間？",
          "How do I save or remove wallets, and how do I read anomalies?",
          "지갑을 여러 개 저장·제거하고 이상은 어떻게 보나요?",
          "複数ウォレットの保存・削除と、異常の時刻は？",
        ],
        [
          "在 [Ethereum Classic 监控](/projects/etc) 登录后，每行一个 0x 地址，各自是一个账户。免费每个项目 5 个，Pro 50 个。多个 Worker 不等于多台计费设备。设备总览没有另外的总数上限；总览、Mac Agent 和崩溃解读不占用 ETC 名额。移除只从账户里拿掉这个地址，矿机继续与否由矿池和矿机决定。读取失败可能保留上次成功值和原来的获取时间，并标成过期。来源以矿池页面为准，本站时间只说明这次响应。",
          "在 [Ethereum Classic 監控](/projects/etc) 登入後，每行一個 0x 地址，各自是一個帳戶。免費每個專案 5 個，Pro 50 個。多個 Worker 不等於多台計費設備。設備總覽沒有另外的總數上限；總覽、Mac Agent 和崩潰解讀不占用 ETC 名額。移除只從帳戶裡拿掉這個地址，礦機繼續與否由礦池和礦機決定。讀取失敗可能保留上次成功值和原來的取得時間，並標成過期。來源以礦池頁面為準，本站時間只說明這次回應。",
          "After sign-in on the [Ethereum Classic monitor](/projects/etc), each line is one 0x address and one account. Free is 5 per project and Pro is 50. Several Workers are not several billed devices. The device overview adds no extra total cap. Overview, the Mac Agent, and crash interpretation do not consume ETC quota. Remove only drops the saved address. Whether the miner keeps running is decided by the pool and the miner. A failed read can retain the previous success and its original fetch time, marked stale. The pool page is the source; this site's clock only describes that response.",
          "[Ethereum Classic 모니터](/projects/etc)에 로그인한 뒤 한 줄이 0x 주소 하나, 계정 하나입니다. 프로젝트당 무료 5개, Pro 50개입니다. Worker가 여러 개여도 과금 기기가 여러 대는 아닙니다. 기기 총괄에 추가 총수 상한은 없습니다. 총괄, Mac Agent, 충돌 해석은 ETC 한도를 쓰지 않습니다. 제거는 저장된 주소만 빼며, 채굴기가 계속되는지는 풀과 채굴기가 정합니다. 읽기 실패 시 이전 성공 값과 원래 조회 시각이 남고 오래됨으로 표시될 수 있습니다. 출처는 풀 페이지이고, 이 사이트의 시각은 그 응답만 설명합니다.",
          "[Ethereum Classic監視](/projects/etc)にログインすると、1行が0xアドレス1件で1口座です。各プロジェクト無料5件、Proは50件です。Workerが複数でも課金端末が複数にはなりません。デバイス総覧に追加の総数上限はありません。総覧、Mac Agent、クラッシュ解釈はETC枠を使いません。削除は保存アドレスを外すだけです。採掘が続くかはプールと採掘ソフトが決めます。取得失敗時は前回の成功値と元の取得時刻が残り、古い表示になることがあります。出典はプールのページで、当サイトの時刻はその応答だけを示します。",
        ],
      ],
    ],
    related: ["rvn-mining-monitor-guide", "data-sources-and-freshness"],
    sources: [
      { name: "2Miners · ETC help", url: "https://etc.2miners.com/help" },
      { name: "Ethereum Classic", url: "https://ethereumclassic.org/" },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    ],
    keywords: [
      ["ETCHash", "ETCHash", "ETCHash", "ETCHash", "ETCHash"],
      [
        "Ethereum Classic",
        "Ethereum Classic",
        "Ethereum Classic",
        "Ethereum Classic",
        "Ethereum Classic",
      ],
      ["ETC 不是 ETH", "ETC 不是 ETH", "ETC is not ETH", "ETC는 ETH가 아님", "ETCはETHではない"],
      [
        "2Miners 普通矿池",
        "2Miners 普通礦池",
        "regular 2Miners pool",
        "2Miners 일반 풀",
        "2Miners通常プール",
      ],
    ],
  }),
  poolGuide({
    slug: "rvn-mining-monitor-guide",
    project: "rvn",
    title: [
      "RVN 的 KawPoW 监控为什么钱包和 Worker 要分开？",
      "RVN 的 KawPoW 監控為什麼錢包和 Worker 要分開？",
      "Why the RVN KawPoW monitor separates wallet and Worker",
      "RVN KawPoW 모니터에서 지갑과 Worker를 나누는 이유",
      "RVNのKawPoW監視でウォレットとWorkerを分ける理由",
    ],
    summary: [
      "Ravencoin 普通矿池按 R 开头的钱包记账。Worker 只是矿机名称，选中它不会把未支付余额拆成几份。",
      "Ravencoin 普通礦池按 R 開頭的錢包記帳。Worker 只是礦機名稱，選中它不會把未支付餘額拆成幾份。",
      "The regular Ravencoin pool accounts by the wallet starting with R. A Worker is a rig name, and selecting it does not split unpaid balance.",
      "Ravencoin 일반 풀은 R로 시작하는 지갑으로 기장합니다. Worker는 리그 이름이며, 골라내도 미지급 잔액이 나뉘지 않습니다.",
      "Ravencoinの通常プールはRで始まるウォレットで記帳します。Workerはリグ名で、選んでも未払い残高は分割されません。",
    ],
    decision: [
      "先分清钱包和 Worker",
      "先分清錢包和 Worker",
      "Separate the wallet from the Worker",
      "지갑과 Worker를 먼저 구분",
      "先にウォレットとWorkerを分ける",
    ],
    action: [
      "[打开 Ravencoin 监控](/projects/rvn)，粘贴 R 开头的完整地址，再按名称查看 Worker。",
      "[開啟 Ravencoin 監控](/projects/rvn)，貼上 R 開頭的完整地址，再按名稱查看 Worker。",
      "[Open the Ravencoin monitor](/projects/rvn), paste the full address starting with R, then filter Workers by name.",
      "[Ravencoin 모니터](/projects/rvn)에 R로 시작하는 전체 주소를 넣고 이름으로 Worker를 보세요.",
      "[Ravencoin監視](/projects/rvn)にRで始まる完全なアドレスを入れ、名前でWorkerを見ます。",
    ],
    comparisonTitle: [
      "RVN 钱包、Worker 和 SOLO 怎么判",
      "RVN 錢包、Worker 和 SOLO 怎麼判",
      "How to judge an RVN wallet, Worker, and SOLO",
      "RVN 지갑·Worker·SOLO를 가르는 법",
      "RVNのウォレット・Worker・SOLOの見分け",
    ],
    rows: [
      [
        [
          "R 开头、后面 33 位",
          "R 開頭、後面 33 位",
          "R followed by 33 characters",
          "R 다음 33자",
          "Rの後に33文字",
        ],
        [
          "这是本页接受的 Ravencoin 收益地址。",
          "這是本頁接受的 Ravencoin 收益地址。",
          "This is the Ravencoin payout this page accepts.",
          "이 페이지가 받는 Ravencoin 보상 주소입니다.",
          "このページが受けるRavencoinの報酬アドレスです。",
        ],
      ],
      [
        [
          "矿机配置写成钱包.RIG",
          "礦機設定寫成錢包.RIG",
          "Miner config is wallet.rig",
          "채굴 설정이 지갑.RIG",
          "採掘設定がウォレット.RIG",
        ],
        [
          "点号后面是 Worker 名称，不要把名称当成地址查询。",
          "點號後面是 Worker 名稱，不要把名稱當成地址查詢。",
          "The part after the dot is the Worker name. Do not look that name up as the address.",
          "점 뒤는 Worker 이름입니다. 그 이름으로 조회하지 마세요.",
          "点の後はWorker名です。その名前をアドレスとして照会しないでください。",
        ],
      ],
      [
        [
          "选中一个 Worker 后余额没变",
          "選中一個 Worker 後餘額沒變",
          "Balance unchanged after picking a Worker",
          "Worker를 골라도 잔액이 같음",
          "Workerを選んでも残高が同じ",
        ],
        [
          "未支付、已支付和近 24 小时属于整个钱包。",
          "未支付、已支付和近 24 小時屬於整個錢包。",
          "Unpaid, paid, and the last 24 hours belong to the whole wallet.",
          "미지급·지급완료·최근 24시간은 지갑 전체의 값입니다.",
          "未払い・支払済み・直近24時間はウォレット全体の値です。",
        ],
      ],
      [
        [
          "记录在 solo-rvn.2miners.com",
          "紀錄在 solo-rvn.2miners.com",
          "The record is on solo-rvn.2miners.com",
          "기록이 solo-rvn.2miners.com에 있음",
          "記録が solo-rvn.2miners.com にある",
        ],
        [
          "回到 rvn.2miners.com 的普通矿池。SOLO 不在本页。",
          "回到 rvn.2miners.com 的普通礦池。SOLO 不在本頁。",
          "Return to the regular pool at rvn.2miners.com. SOLO is not on this page.",
          "rvn.2miners.com 일반 풀로 돌아가세요. SOLO는 이 페이지에 없습니다.",
          "rvn.2miners.com の通常プールに戻ります。SOLOはこのページにありません。",
        ],
      ],
    ],
    sections: [
      [
        [
          "RVN 应该填钱包还是 Worker？",
          "RVN 該填錢包還是 Worker？",
          "Should I enter the RVN wallet or the Worker?",
          "RVN은 지갑과 Worker 중 무엇을 넣나요?",
          "RVNはウォレットとWorkerのどちらを入れますか？",
        ],
        [
          "填写 rvn.2miners.com 普通矿池里的 Ravencoin 收益地址：以 R 开头，后面 33 个字符，字符集不含 0、O、I、l。2Miners 帮助页的矿机示例把钱包和 RIG 名称写在一起，点号后面才是 Worker。本页只收钱包。BTC、TON 收款地址即使帮助页允许领款，这里也不查。不要填私钥。查询不会启动 KawPoW。",
          "填寫 rvn.2miners.com 普通礦池裡的 Ravencoin 收益地址：以 R 開頭，後面 33 個字元，字元集不含 0、O、I、l。2Miners 幫助頁的礦機示例把錢包和 RIG 名稱寫在一起，點號後面才是 Worker。本頁只收錢包。BTC、TON 收款地址即使幫助頁允許領款，這裡也不查。不要填私鑰。查詢不會啟動 KawPoW。",
          "Enter the Ravencoin payout on the regular pool rvn.2miners.com. It starts with R and has 33 characters after that, without 0, O, I, or l. The 2Miners help writes the wallet and the rig name together; the Worker is the part after the dot. This page accepts the wallet only. BTC and TON payouts mentioned on that help are not queried. Do not paste a private key. Lookup does not start KawPoW.",
          "일반 풀 rvn.2miners.com의 Ravencoin 보상 주소를 넣으세요. R로 시작하고 뒤에 33자이며 0, O, I, l은 없습니다. 2Miners 도움말의 채굴 예시는 지갑과 RIG 이름을 붙이며, 점 뒤가 Worker입니다. 이 페이지는 지갑만 받습니다. 도움말에 있는 BTC·TON 수령 주소는 조회하지 않습니다. 비밀키는 넣지 마세요. 조회는 KawPoW를 시작하지 않습니다.",
          "通常プール rvn.2miners.com の Ravencoin 報酬アドレスを入れます。Rで始まり、その後33文字で、0、O、I、lは含みません。2Minersのヘルプはウォレットとリグ名を続けて書き、点の後がWorkerです。このページはウォレットだけを受けます。ヘルプにあるBTCやTONの受取先は照会しません。秘密鍵は貼らないでください。照会はKawPoWを始めません。",
        ],
      ],
      [
        [
          "KawPoW 支持哪一个矿池？",
          "KawPoW 支援哪一個礦池？",
          "Which pool is covered for KawPoW?",
          "KawPoW는 어느 풀을 지원하나요?",
          "KawPoWはどのプールが対象ですか？",
        ],
        [
          "Ravencoin 官网把挖矿算法写成 KAWPOW。2Miners 的 RVN 帮助页写的是 KawPoW，主机是普通矿池 rvn.2miners.com。本页用的就是这一口，不是全网余额。官方 API 文档把 solo-rvn.2miners.com 列为单独服务器，SOLO 账户不会显示在这里。其他矿池同名的 R 地址也不会自动出现。",
          "Ravencoin 官網把挖礦演算法寫成 KAWPOW。2Miners 的 RVN 幫助頁寫的是 KawPoW，主機是普通礦池 rvn.2miners.com。本頁用的就是這一口，不是全網餘額。官方 API 文件把 solo-rvn.2miners.com 列為單獨伺服器，SOLO 帳戶不會顯示在這裡。其他礦池同名的 R 地址也不會自動出現。",
          "The Ravencoin site names the mining algorithm KAWPOW. The 2Miners RVN help calls it KawPoW and uses the regular pool rvn.2miners.com. This page reads that pool, not a network-wide balance. The API documentation lists solo-rvn.2miners.com as its own server, so a SOLO account is not shown. An R address on some other pool does not appear automatically.",
          "Ravencoin 사이트는 채굴 알고리즘을 KAWPOW라고 적습니다. 2Miners RVN 도움말은 KawPoW와 일반 풀 rvn.2miners.com을 씁니다. 이 페이지는 그 풀을 읽으며 네트워크 전체 잔액이 아닙니다. API 문서는 solo-rvn.2miners.com을 별도 서버로 적으므로 SOLO 계정은 보이지 않습니다. 다른 풀의 같은 R 주소도 자동으로 나타나지 않습니다.",
          "Ravencoinのサイトは採掘アルゴリズムをKAWPOWと書きます。2MinersのRVNヘルプはKawPoW、ホストは通常プール rvn.2miners.com です。このページはそのプールを読み、ネットワーク全体の残高ではありません。API文書は solo-rvn.2miners.com を別サーバーとするので、SOLO口座は出ません。他プールの同じRアドレスも自動では出ません。",
        ],
      ],
      [
        [
          "有钱包却没有 Worker 或没有收益？",
          "有錢包卻沒有 Worker 或沒有收益？",
          "The wallet is saved but Workers or rewards are missing?",
          "지갑은 있는데 Worker나 보상이 없나요?",
          "ウォレットはあるのにWorkerや報酬が無い？",
        ],
        [
          "先看矿机是否把份额提交到 rvn.2miners.com，而不是 SOLO 或其他矿池。Worker 名单为空，表示这口矿池没有返回该名称，不表示硬盘或显卡已经停转。收益数字缺失是横线，不是 0。获取时间用香港时间，只代表本站收到响应的时刻，见 [数据来源与新鲜度](/learn/data-sources-and-freshness)。",
          "先看礦機是否把份額提交到 rvn.2miners.com，而不是 SOLO 或其他礦池。Worker 名單為空，表示這口礦池沒有返回該名稱，不表示硬碟或顯卡已經停轉。收益數字缺失是橫線，不是 0。取得時間用香港時間，只代表本站收到回應的時刻，見 [資料來源與新鮮度](/learn/data-sources-and-freshness)。",
          "Check that shares go to rvn.2miners.com, not to SOLO or another pool. An empty Worker list means this pool returned no such name. It does not mean a disk or GPU has stopped. A missing reward is a dash, not zero. Fetch time is Hong Kong time and only marks when this site got the response. See [sources and freshness](/learn/data-sources-and-freshness).",
          "지분이 rvn.2miners.com으로 가는지, SOLO나 다른 풀이 아닌지 먼저 보세요. Worker 목록이 비면 이 풀이 그 이름을 주지 않은 것입니다. 디스크나 GPU가 멈췄다는 뜻은 아닙니다. 빠진 보상은 가로줄이지 0이 아닙니다. 조회 시각은 홍콩 시간이며 이 사이트가 응답을 받은 시각입니다. [데이터 출처와 신선도](/learn/data-sources-and-freshness)를 보세요.",
          "シェアが rvn.2miners.com に向かい、SOLOや別プールではないか先に見ます。Worker一覧が空なのは、このプールがその名前を返していないという意味です。ディスクやGPUの停止ではありません。欠けた報酬は横線でありゼロではありません。取得時刻は香港時間で、このサイトが応答を受け取った時刻です。[データ源と鮮度](/learn/data-sources-and-freshness)を参照します。",
        ],
      ],
      [
        [
          "KawPoW 算力为什么拆不开成每台机器的币？",
          "KawPoW 算力為什麼拆不開成每台機器的幣？",
          "Why can't KawPoW hashrate be split into coins per machine?",
          "KawPoW 해시레이트를 기기별 코인으로 나눌 수 없는 이유는?",
          "KawPoWの算力を機器ごとのコインに分けられないのは？",
        ],
        [
          "账户上的速率是矿池报告的 H/s 一类数字。每台矿机若使用不同 Worker 名称，可以分别看该名称的速率和是否在线。未支付余额、累计已支付和近 24 小时收益始终属于整份钱包，不会按 Worker 分成几份 RVN。因此多台机器共用一个 R 地址时，币的数字不能当成某一台的收入。本页不把速率换算成收益。",
          "帳戶上的速率是礦池報告的 H/s 一類數字。每台礦機若使用不同 Worker 名稱，可以分別看該名稱的速率和是否連線。未支付餘額、累計已支付和近 24 小時收益始終屬於整份錢包，不會按 Worker 分成幾份 RVN。因此多台機器共用一個 R 地址時，幣的數字不能當成某一台的收入。本頁不把速率換算成收益。",
          "The account rate is a pool-reported figure in units such as H/s. Distinct Worker names let you see each name's rate and whether it is online. Unpaid balance, total paid, and the last 24 hours stay with the whole wallet. They are not divided into RVN per Worker. When several machines share one R address, the coin figures are not one machine's income. This page does not convert the rate into earnings.",
          "계정 속도는 풀이 보고한 H/s 같은 값입니다. 채굴기마다 Worker 이름이 다르면 그 이름의 속도와 접속 여부를 따로 볼 수 있습니다. 미지급 잔액, 누적 지급, 최근 24시간 보상은 항상 지갑 전체의 것이며 Worker별로 RVN이 나뉘지 않습니다. 여러 기기가 R 주소 하나를 쓰면 코인 숫자를 한 대의 수입으로 볼 수 없습니다. 이 페이지는 속도를 수익으로 환산하지 않습니다.",
          "口座の速度はプールが報告したH/sのような値です。リグごとにWorker名が違えば、その名前の速度と接続の有無を別に見られます。未払い残高、累計支払、直近24時間は常にウォレット全体で、WorkerごとのRVNには分かれません。複数の機器が一つのRアドレスを使うとき、コインの数字を一台の収入にはできません。このページは速度を収益に換算しません。",
        ],
      ],
      [
        [
          "余额、已支付和滚动 24 小时怎么区分？",
          "餘額、已支付和滾動 24 小時怎麼區分？",
          "How do balance, paid, and the rolling 24 hours differ?",
          "잔액·지급완료·최근 24시간의 차이는?",
          "残高・支払済み・直近24時間の違いは？",
        ],
        [
          "三笔数分开看：矿池还没付出的余额、已经付出的累计、滚动近 24 小时。近 24 小时不是 UTC 自然日，也不是香港时间当天。它们都不是 Ravencoin 钱包在链上的余额。缺任一笔就保持横线。帮助页若把领款改成 BTC 或 TON，那种到账不会记进这里的 RVN。",
          "三筆數分開看：礦池還沒付出的餘額、已經付出的累計、滾動近 24 小時。近 24 小時不是 UTC 自然日，也不是香港時間當天。它們都不是 Ravencoin 錢包在鏈上的餘額。缺任一筆就保持橫線。幫助頁若把領款改成 BTC 或 TON，那種到帳不會記進這裡的 RVN。",
          "Read three figures separately: balance the pool has not paid, the cumulative amount already paid, and the rolling last 24 hours. Those 24 hours are not a UTC calendar day and not the Hong Kong calendar day. None of them is the on-chain Ravencoin wallet balance. A missing figure stays a dash. If the help-page payout was switched to BTC or TON, that arrival is not RVN here.",
          "세 숫자를 따로 보세요. 풀이 아직 보내지 않은 잔액, 이미 보낸 누적, 굴러가는 최근 24시간입니다. 그 24시간은 UTC 달력일도 홍콩 달력일도 아닙니다. 어느 것도 체인의 Ravencoin 지갑 잔액이 아닙니다. 빠진 값은 가로줄로 남습니다. 도움말대로 수령을 BTC나 TON으로 바꿨다면 그 입금은 여기의 RVN이 아닙니다.",
          "三つの数を分けて見ます。プールがまだ払っていない残高、すでに払った累計、転がる直近24時間です。その24時間はUTCの暦日でも香港時間の当日でもありません。どれもチェーン上のRavencoin残高ではありません。欠けた値は横線のままです。ヘルプのとおり受取をBTCやTONに変えた場合、その着金はここのRVNではありません。",
        ],
      ],
      [
        [
          "多个 R 地址如何入库，异常看哪里？",
          "多個 R 地址如何入庫，異常看哪裡？",
          "How do I save several R addresses, and where do I check anomalies?",
          "R 주소 여러 개를 어떻게 저장하고 이상은 어디서 보나요?",
          "複数のRアドレスの保存と、異常はどこで見ますか？",
        ],
        [
          "登录 [Ravencoin 监控](/projects/rvn) 后每行一个 R 地址，一个地址一个账户。免费每个项目 5 个，Pro 50 个。同一钱包下再多的 Worker 也不另计设备、不另收费。设备总览没有额外总数上限。总览、Mac Agent 和崩溃解读不占用 RVN 名额。移除只删除已保存的地址，不会向矿池发送停止指令。失败的读取可以留下上次成功的数和原来的获取时间，并标成过期；矿池明确没有这个钱包时，不用旧数推断还在出块。",
          "登入 [Ravencoin 監控](/projects/rvn) 後每行一個 R 地址，一個地址一個帳戶。免費每個專案 5 個，Pro 50 個。同一錢包下再多的 Worker 也不另計設備、不另收費。設備總覽沒有額外總數上限。總覽、Mac Agent 和崩潰解讀不占用 RVN 名額。移除只刪除已儲存的地址，不會向礦池送出停止指令。失敗的讀取可以留下上次成功的數和原來的取得時間，並標成過期；礦池明確沒有這個錢包時，不用舊數推斷還在出塊。",
          "After sign-in, each line on the [Ravencoin monitor](/projects/rvn) is one R address and one account. Free is 5 per project and Pro is 50. Extra Workers under the same wallet are not extra devices and not an extra charge. The device overview has no added total cap. Overview, the Mac Agent, and crash interpretation do not use RVN quota. Remove deletes only the saved address and does not send a stop to the pool. A failed read can leave the previous success and its original fetch time, marked stale. If the pool says the wallet is absent, do not infer from old numbers that it is still finding blocks.",
          "[Ravencoin 모니터](/projects/rvn)에 로그인한 뒤 한 줄이 R 주소 하나, 계정 하나입니다. 프로젝트당 무료 5개, Pro 50개입니다. 같은 지갑의 Worker가 더 있어도 기기가 늘거나 추가 요금이 되지 않습니다. 기기 총괄에 추가 총수 상한은 없습니다. 총괄, Mac Agent, 충돌 해석은 RVN 한도를 쓰지 않습니다. 제거는 저장된 주소만 지우며 풀에 중지 명령을 보내지 않습니다. 읽기 실패 시 이전 성공 값과 원래 조회 시각이 남고 오래됨으로 표시될 수 있습니다. 풀이 지갑이 없다고 하면 옛 숫자로 아직 블록을 찾는다고 추론하지 마세요.",
          "[Ravencoin監視](/projects/rvn)にログインすると、1行がRアドレス1件で1口座です。各プロジェクト無料5件、Proは50件です。同じウォレットのWorkerが増えても端末や料金は増えません。デバイス総覧に追加の総数上限はありません。総覧、Mac Agent、クラッシュ解釈はRVN枠を使いません。削除は保存アドレスを消すだけで、プールへ停止命令は送りません。取得失敗時は前回の成功値と元の取得時刻が残り、古い表示になることがあります。プールがそのウォレットは無いと言ったら、古い数字からまだブロックを見つけているとは推論しません。",
        ],
      ],
    ],
    related: ["etc-mining-monitor-guide", "kas-mining-monitor-guide"],
    sources: [
      { name: "2Miners · RVN help", url: "https://rvn.2miners.com/help" },
      { name: "Ravencoin", url: "https://ravencoin.org/" },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    ],
    keywords: [
      ["KawPoW", "KawPoW", "KawPoW", "KawPoW", "KawPoW"],
      ["RVN Worker", "RVN Worker", "RVN Worker", "RVN Worker", "RVN Worker"],
      [
        "Ravencoin 地址",
        "Ravencoin 地址",
        "Ravencoin address",
        "Ravencoin 주소",
        "Ravencoinアドレス",
      ],
      [
        "钱包与矿机名称",
        "錢包與礦機名稱",
        "wallet and rig name",
        "지갑과 리그 이름",
        "ウォレットとリグ名",
      ],
    ],
  }),
  poolGuide({
    slug: "zec-mining-monitor-guide",
    project: "zec",
    title: [
      "ZEC 监控为什么只收透明 t 地址，不收 shielded？",
      "ZEC 監控為什麼只收透明 t 地址，不收 shielded？",
      "Why the ZEC monitor accepts only transparent t-addresses",
      "ZEC 모니터가 투명 t 주소만 받고 shielded는 거르는 이유",
      "ZEC監視が透明なtアドレスだけを受け、shieldedを受け取らない理由",
    ],
    summary: [
      "Zcash 的透明地址才会进入这口 Equihash 普通矿池。屏蔽地址和统一地址不是这里的未支付余额，速率单位是 S/s。",
      "Zcash 的透明地址才會進入這口 Equihash 普通礦池。屏蔽地址和統一地址不是這裡的未支付餘額，速率單位是 S/s。",
      "Only a transparent Zcash address enters this regular Equihash pool. Shielded and unified addresses are not the unpaid balance here, and the rate unit is S/s.",
      "Zcash 투명 주소만 이 Equihash 일반 풀에 들어옵니다. 차폐·통합 주소는 여기의 미지급 잔액이 아니고, 속도 단위는 S/s입니다.",
      "Zcashの透明アドレスだけがこのEquihash通常プールに入ります。シールドや統合アドレスはここの未払い残高ではなく、速度の単位はS/sです。",
    ],
    decision: [
      "只提交透明的 t1 或 t3",
      "只提交透明的 t1 或 t3",
      "Submit only a transparent t1 or t3",
      "투명한 t1 또는 t3만 제출",
      "透明なt1かt3だけを送る",
    ],
    action: [
      "[打开 Zcash 监控](/projects/zec)，粘贴 t1 或 t3，不要粘贴屏蔽地址。",
      "[開啟 Zcash 監控](/projects/zec)，貼上 t1 或 t3，不要貼屏蔽地址。",
      "[Open the Zcash monitor](/projects/zec) and paste a t1 or t3, not a shielded address.",
      "[Zcash 모니터](/projects/zec)에 t1 또는 t3을 넣고 차폐 주소는 넣지 마세요.",
      "[Zcash監視](/projects/zec)にt1かt3を入れ、シールドアドレスは入れません。",
    ],
    comparisonTitle: [
      "ZEC 透明地址和屏蔽地址",
      "ZEC 透明地址和屏蔽地址",
      "Transparent and shielded ZEC",
      "ZEC 투명 주소와 차폐 주소",
      "ZECの透明アドレスとシールド",
    ],
    rows: [
      [
        [
          "t1 或 t3，后面 33 位",
          "t1 或 t3，後面 33 位",
          "t1 or t3 plus 33 characters",
          "t1 또는 t3 다음 33자",
          "t1かt3の後に33文字",
        ],
        [
          "透明地址，本页会查询 zec.2miners.com。",
          "透明地址，本頁會查詢 zec.2miners.com。",
          "A transparent address. This page queries zec.2miners.com.",
          "투명 주소입니다. 이 페이지는 zec.2miners.com을 조회합니다.",
          "透明アドレスです。このページは zec.2miners.com を照会します。",
        ],
      ],
      [
        [
          "z 开头或统一地址",
          "z 開頭或統一地址",
          "Starts with z, or a unified address",
          "z로 시작하거나 통합 주소",
          "zで始まる、または統合アドレス",
        ],
        [
          "那是屏蔽或统一形态。Zcash 说明屏蔽信息是私密的，本页不接收。",
          "那是屏蔽或統一形態。Zcash 說明屏蔽資訊是私密的，本頁不接收。",
          "That is shielded or unified. Zcash says shielded information is private. This page does not accept it.",
          "차폐 또는 통합 형태입니다. Zcash는 차폐 정보가 비공개라고 합니다. 이 페이지는 받지 않습니다.",
          "シールドまたは統合の形です。Zcashはシールド情報を非公開と説明します。このページは受けません。",
        ],
      ],
      [
        [
          "速率写成 S/s",
          "速率寫成 S/s",
          "The rate is shown as S/s",
          "속도가 S/s로 표시",
          "速度がS/sと出る",
        ],
        [
          "这是 Equihash 的解数速率，不是 ZEC 枚数。",
          "這是 Equihash 的解數速率，不是 ZEC 枚數。",
          "That is an Equihash solution rate, not a count of ZEC.",
          "Equihash 해의 속도이지 ZEC 개수가 아닙니다.",
          "Equihashの解の速度であり、ZECの枚数ではありません。",
        ],
      ],
      [
        [
          "账户在 solo-zec.2miners.com",
          "帳戶在 solo-zec.2miners.com",
          "The account is on solo-zec.2miners.com",
          "계정이 solo-zec.2miners.com에 있음",
          "口座が solo-zec.2miners.com にある",
        ],
        [
          "改回普通矿池 zec.2miners.com。两台服务器的记录不合并。",
          "改回普通礦池 zec.2miners.com。兩台伺服器的紀錄不合併。",
          "Use the regular pool zec.2miners.com. The two servers are not merged.",
          "일반 풀 zec.2miners.com으로 바꾸세요. 두 서버의 기록은 합치지 않습니다.",
          "通常プール zec.2miners.com に戻します。二つのサーバーの記録は合算しません。",
        ],
      ],
    ],
    sections: [
      [
        [
          "ZEC 该填透明地址还是屏蔽地址？",
          "ZEC 該填透明地址還是屏蔽地址？",
          "Should I enter a transparent or a shielded ZEC address?",
          "ZEC는 투명 주소와 차폐 주소 중 무엇인가요?",
          "ZECは透明アドレスとシールドのどちらを入れますか？",
        ],
        [
          "只填透明地址：t1 或 t3 开头，后面 33 个字符。2Miners 的 ZEC 帮助页示例就是 t1。Zcash 官方说明里，屏蔽地址把财务信息保持私密，透明地址则把信息公开。以 z 开头的屏蔽地址、以及统一地址，本页都不接收。不要把钱包里的屏蔽余额当成这口矿池的未支付。不要填私钥。查询不会启动 Equihash。",
          "只填透明地址：t1 或 t3 開頭，後面 33 個字元。2Miners 的 ZEC 幫助頁示例就是 t1。Zcash 官方說明裡，屏蔽地址把財務資訊保持私密，透明地址則把資訊公開。以 z 開頭的屏蔽地址、以及統一地址，本頁都不接收。不要把錢包裡的屏蔽餘額當成這口礦池的未支付。不要填私鑰。查詢不會啟動 Equihash。",
          "Enter only a transparent address: t1 or t3 followed by 33 characters. The 2Miners ZEC help example is a t1. Zcash's own explanation says a shielded address keeps financial information private, while a transparent address makes that information public. This page accepts neither a shielded address starting with z nor a unified address. Do not treat a shielded wallet balance as this pool's unpaid amount. Do not paste a private key. Lookup does not start Equihash.",
          "투명 주소만 넣으세요. t1 또는 t3 다음에 33자입니다. 2Miners ZEC 도움말의 예시는 t1입니다. Zcash 설명에 따르면 차폐 주소는 재무 정보를 비공개로 두고, 투명 주소는 그 정보를 공개합니다. z로 시작하는 차폐 주소와 통합 주소는 이 페이지가 받지 않습니다. 지갑의 차폐 잔액을 이 풀의 미지급으로 보지 마세요. 비밀키는 넣지 마세요. 조회는 Equihash를 시작하지 않습니다.",
          "透明アドレスだけを入れます。t1またはt3の後に33文字です。2MinersのZECヘルプの例はt1です。Zcashの説明では、シールドアドレスは財務情報を非公開にし、透明アドレスはその情報を公開します。zで始まるシールドアドレスと統合アドレスは、このページでは受けません。ウォレットのシールド残高をこのプールの未払いとしないでください。秘密鍵は貼らないでください。照会はEquihashを始めません。",
        ],
      ],
      [
        [
          "Equihash 查的是哪个矿池？",
          "Equihash 查的是哪個礦池？",
          "Which pool does the Equihash lookup use?",
          "Equihash 조회는 어느 풀인가요?",
          "Equihashの照会はどのプールですか？",
        ],
        [
          "只读 zec.2miners.com 的普通矿池账户。帮助页把算法写成 Equihash。官方 API 文档中的 solo-zec.2miners.com 是另一台服务器，SOLO 不并进本页。这不是全网 ZEC 余额，也不是其他矿池的透明地址。帮助页若提供 BTC 或 TON 领款，那些地址同样不在查询范围内。",
          "只讀 zec.2miners.com 的普通礦池帳戶。幫助頁把演算法寫成 Equihash。官方 API 文件中的 solo-zec.2miners.com 是另一台伺服器，SOLO 不併進本頁。這不是全網 ZEC 餘額，也不是其他礦池的透明地址。幫助頁若提供 BTC 或 TON 領款，那些地址同樣不在查詢範圍內。",
          "The lookup reads only the regular account on zec.2miners.com. The help page names the algorithm Equihash. In the API documentation, solo-zec.2miners.com is a separate server, and SOLO is not merged into this page. This is not a network-wide ZEC balance and not a transparent address from another pool. BTC or TON payouts offered on the help page are outside the lookup as well.",
          "조회는 zec.2miners.com 일반 계정만 읽습니다. 도움말은 알고리즘을 Equihash라고 적습니다. API 문서의 solo-zec.2miners.com은 다른 서버이며 SOLO는 이 페이지에 합쳐지지 않습니다. 네트워크 전체 ZEC 잔액도, 다른 풀의 투명 주소도 아닙니다. 도움말의 BTC·TON 수령도 조회 범위 밖입니다.",
          "照会は zec.2miners.com の通常口座だけを読みます。ヘルプはアルゴリズムをEquihashと書きます。API文書の solo-zec.2miners.com は別サーバーで、SOLOはこのページに合算されません。ネットワーク全体のZEC残高でも、他プールの透明アドレスでもありません。ヘルプのBTCやTON受取も照会の外です。",
        ],
      ],
      [
        [
          "透明地址正确，为什么还是没有 Worker？",
          "透明地址正確，為什麼還是沒有 Worker？",
          "The transparent address is valid, so why are Workers missing?",
          "투명 주소가 맞는데 Worker가 없는 이유는?",
          "透明アドレスは正しいのにWorkerが無いのは？",
        ],
        [
          "地址形状正确，只说明本页愿意查询，不说明矿池里已有份额。若矿机指向 SOLO、别的矿池，或 Worker 名称被当成了地址，名单会是空的。空名单不是机器故障结论。先回 zec.2miners.com 看最近份额，再看本站香港时间的获取时刻。[数据来源与新鲜度](/learn/data-sources-and-freshness) 说明这个时刻和收益窗口不是一回事。",
          "地址形狀正確，只說明本頁願意查詢，不說明礦池裡已有份額。若礦機指向 SOLO、別的礦池，或 Worker 名稱被當成了地址，名單會是空的。空名單不是機器故障結論。先回 zec.2miners.com 看最近份額，再看本站香港時間的取得時刻。[資料來源與新鮮度](/learn/data-sources-and-freshness) 說明這個時刻和收益窗口不是一回事。",
          "A valid shape only means this page will query it. It does not mean the pool already has shares. If the miner points at SOLO, another pool, or a Worker name was pasted as the address, the list is empty. Empty is not a hardware verdict. Check recent shares on zec.2miners.com, then this site's Hong Kong fetch time. [Sources and freshness](/learn/data-sources-and-freshness) explains why that clock is not the reward window.",
          "형태가 맞다는 것은 이 페이지가 조회한다는 뜻이지, 풀에 지분이 있다는 뜻은 아닙니다. 채굴기가 SOLO나 다른 풀을 보거나 Worker 이름을 주소로 붙이면 목록이 빕니다. 빈 목록은 하드웨어 결론이 아닙니다. zec.2miners.com에서 최근 지분을 본 다음, 이 사이트의 홍콩 시간 조회 시각을 보세요. [데이터 출처와 신선도](/learn/data-sources-and-freshness)는 그 시각이 보상 구간이 아닌 이유를 설명합니다.",
          "形が正しいのは、このページが照会するという意味であり、プールにシェアがあるという意味ではありません。採掘先がSOLOや別プール、またはWorker名をアドレスとして貼ると一覧は空です。空はハードウェアの結論ではありません。zec.2miners.com で直近のシェアを見てから、このサイトの香港時間の取得時刻を見ます。[データ源と鮮度](/learn/data-sources-and-freshness)はその時刻が報酬の窓ではない理由を説明します。",
        ],
      ],
      [
        [
          "S/s 和实际 ZEC 有什么差别？",
          "S/s 和實際 ZEC 有什麼差別？",
          "How is S/s different from ZEC you hold?",
          "S/s와 실제 ZEC의 차이는?",
          "S/sと手元のZECはどう違いますか？",
        ],
        [
          "本页把 Equihash 的矿池速率显示为 S/s，表示解的速率，不是 H/s，更不是 ZEC 的枚数。Worker 的 S/s 可以和账户不同。选中 Worker 只改变你看到的速率和在线状态，屏蔽钱包里的币和这里的未支付仍然是两套数。不要用 S/s 估算一天能拿多少。",
          "本頁把 Equihash 的礦池速率顯示為 S/s，表示解的速率，不是 H/s，更不是 ZEC 的枚數。Worker 的 S/s 可以和帳戶不同。選中 Worker 只改變你看到的速率和連線狀態，屏蔽錢包裡的幣和這裡的未支付仍然是兩套數。不要用 S/s 估算一天能拿多少。",
          "This page shows the Equihash pool rate as S/s: a solution rate, not H/s, and not a count of ZEC. A Worker's S/s can differ from the account. Selecting a Worker changes only the rate and status you see. Coins in a shielded wallet and the unpaid figure here remain two different numbers. Do not turn S/s into an estimate of a day's payout.",
          "이 페이지는 Equihash 풀 속도를 S/s로 보여 줍니다. 해의 속도이지 H/s도, ZEC 개수도 아닙니다. Worker의 S/s는 계정과 다를 수 있습니다. Worker를 고르면 보이는 속도와 상태만 바뀝니다. 차폐 지갑의 코인과 여기의 미지급은 여전히 다른 숫자입니다. S/s로 하루 지급액을 추정하지 마세요.",
          "このページはEquihashのプール速度をS/sで示します。解の速度であり、H/sでもZECの枚数でもありません。WorkerのS/sは口座と違い得ます。Workerを選ぶと、見える速度と状態だけが変わります。シールドウォレットのコインと、ここの未払いは別の数のままです。S/sから一日の支払を見積もらないでください。",
        ],
      ],
      [
        [
          "未支付、已支付和近 24 小时怎么读？",
          "未支付、已支付和近 24 小時怎麼讀？",
          "How do unpaid, paid, and the last 24 hours read?",
          "미지급·지급완료·최근 24시간은 어떻게 읽나요?",
          "未払い・支払済み・直近24時間はどう読みますか？",
        ],
        [
          "未支付是矿池账上还没付出的 ZEC，累计已支付是已经付出的合计，近 24 小时是滚动窗口。滚动窗口不是 UTC 零点，也不是香港时间当天。三笔都不要和透明地址的链上余额、屏蔽余额相加。没有数就是横线。帮助页提到的 ASIC 机型只说明矿池接受那些矿机提交，不表示本站测量过任何一台的 S/s。",
          "未支付是礦池帳上還沒付出的 ZEC，累計已支付是已經付出的合計，近 24 小時是滾動窗口。滾動窗口不是 UTC 零點，也不是香港時間當天。三筆都不要和透明地址的鏈上餘額、屏蔽餘額相加。沒有數就是橫線。幫助頁提到的 ASIC 機型只說明礦池接受那些礦機提交，不表示本站測量過任何一台的 S/s。",
          "Unpaid is ZEC the pool has not sent. Total paid is what it has already sent. The last 24 hours is a rolling window, not UTC midnight and not the Hong Kong calendar day. Do not add these to the transparent address's on-chain balance or to a shielded balance. No number means a dash. ASIC models named on the help page only say the pool accepts their submissions. This site has not measured any machine's S/s.",
          "미지급은 풀이 아직 보내지 않은 ZEC이고, 누적 지급은 이미 보낸 합계이며, 최근 24시간은 이동 창입니다. 그 창은 UTC 자정도, 홍콩 달력일도 아닙니다. 투명 주소의 체인 잔액이나 차폐 잔액과 더하지 마세요. 숫자가 없으면 가로줄입니다. 도움말의 ASIC 기종은 풀이 그 제출을 받는다는 뜻일 뿐, 이 사이트가 어떤 기기의 S/s를 측정했다는 뜻은 아닙니다.",
          "未払いはプールがまだ送っていないZEC、累計支払はすでに送った合計、直近24時間は転がる窓です。その窓はUTC零時でも香港時間の当日でもありません。透明アドレスのチェーン残高やシールド残高と足さないでください。数値が無ければ横線です。ヘルプのASIC機種は、プールがその提出を受けるという意味だけで、当サイトがどの機器のS/sも測ったという意味ではありません。",
        ],
      ],
      [
        [
          "多个 t 地址怎么保存，移除后矿机还会停吗？",
          "多個 t 地址怎麼儲存，移除後礦機還會停嗎？",
          "How do I save several t-addresses, and does remove stop the miner?",
          "t 주소 여러 개를 저장하면 제거가 채굴기를 멈추나요?",
          "複数のtアドレスを保存し、削除で採掘は止まりますか？",
        ],
        [
          "在 [Zcash 监控](/projects/zec) 登录后，一行一个 t1 或 t3，各算一个账户。免费每个项目 5 个，Pro 50 个。多个 Worker 不是额外设备，也不另收费。设备总览没有额外总数上限。总览、Mac Agent 和崩溃解读不占 ZEC 名额。移除只拿掉保存的地址，不会停止矿机。读取失败时可能保留上次成功的数和原获取时间，并标过期。来源异常时以矿池账户页为准，不要用屏蔽钱包的变动解释矿池横线。",
          "在 [Zcash 監控](/projects/zec) 登入後，一行一個 t1 或 t3，各算一個帳戶。免費每個專案 5 個，Pro 50 個。多個 Worker 不是額外設備，也不另收費。設備總覽沒有額外總數上限。總覽、Mac Agent 和崩潰解讀不占 ZEC 名額。移除只拿掉儲存的地址，不會停止礦機。讀取失敗時可能保留上次成功的數和原取得時間，並標過期。來源異常時以礦池帳戶頁為準，不要用屏蔽錢包的變動解釋礦池橫線。",
          "After sign-in, one line on the [Zcash monitor](/projects/zec) is one t1 or t3 and one account. Free is 5 per project and Pro is 50. Workers are not extra devices and not an extra charge. The device overview has no added total cap. Overview, the Mac Agent, and crash interpretation do not use ZEC quota. Remove only drops the saved address and does not stop the miner. A failed read can keep the last success and its original fetch time, marked stale. When the source looks wrong, use the pool account page. Do not explain a dash with movement in a shielded wallet.",
          "[Zcash 모니터](/projects/zec)에 로그인한 뒤 한 줄이 t1 또는 t3 하나, 계정 하나입니다. 프로젝트당 무료 5개, Pro 50개입니다. Worker는 추가 기기도 추가 요금도 아닙니다. 기기 총괄에 추가 총수 상한은 없습니다. 총괄, Mac Agent, 충돌 해석은 ZEC 한도를 쓰지 않습니다. 제거는 저장된 주소만 빼며 채굴기를 멈추지 않습니다. 읽기 실패 시 이전 성공 값과 원래 조회 시각이 남고 오래됨으로 표시될 수 있습니다. 출처가 이상하면 풀 계정 페이지를 보세요. 차폐 지갑의 변동으로 풀의 가로줄을 설명하지 마세요.",
          "[Zcash監視](/projects/zec)にログインすると、1行がt1またはt3の1件で1口座です。各プロジェクト無料5件、Proは50件です。Workerは追加の端末でも追加料金でもありません。デバイス総覧に追加の総数上限はありません。総覧、Mac Agent、クラッシュ解釈はZEC枠を使いません。削除は保存アドレスを外すだけで、採掘は止めません。取得失敗時は前回の成功値と元の取得時刻が残り、古い表示になることがあります。出典がおかしいときはプールの口座ページを見てください。シールドウォレットの動きで、プールの横線を説明しないでください。",
        ],
      ],
    ],
    related: ["xmr-mining-monitor-guide", "etc-mining-monitor-guide"],
    sources: [
      { name: "2Miners · ZEC help", url: "https://zec.2miners.com/help" },
      {
        name: "Zcash · shielded and transparent",
        url: "https://z.cash/learn/what-is-the-difference-between-shielded-and-transparent-zcash/",
      },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    ],
    keywords: [
      ["ZEC t1", "ZEC t1", "ZEC t1", "ZEC t1", "ZEC t1"],
      ["透明地址", "透明地址", "transparent address", "투명 주소", "透明アドレス"],
      ["Equihash S/s", "Equihash S/s", "Equihash S/s", "Equihash S/s", "Equihash S/s"],
      [
        "shielded 不查询",
        "shielded 不查詢",
        "shielded not queried",
        "shielded는 조회하지 않음",
        "shieldedは照会しない",
      ],
    ],
  }),
  poolGuide({
    slug: "kas-mining-monitor-guide",
    project: "kas",
    title: [
      "KAS 监控为什么是普通矿池，不是 SOLO？",
      "KAS 監控為什麼是普通礦池，不是 SOLO？",
      "Why the KAS monitor is the regular pool, not SOLO",
      "KAS 모니터가 SOLO가 아닌 일반 풀인 이유",
      "KAS監視がSOLOではなく通常プールである理由",
    ],
    summary: [
      "Kaspa 地址以 kaspa: 开头。ASIC 和 GPU 的 Worker 都挂在普通矿池的同一个钱包下；solo-kas 的记录不在这里。",
      "Kaspa 地址以 kaspa: 開頭。ASIC 和 GPU 的 Worker 都掛在普通礦池的同一個錢包下；solo-kas 的紀錄不在這裡。",
      "A Kaspa address starts with kaspa:. ASIC and GPU Workers sit under one wallet on the regular pool. solo-kas records are not here.",
      "Kaspa 주소는 kaspa: 로 시작합니다. ASIC와 GPU Worker는 일반 풀의 같은 지갑 아래에 있고, solo-kas 기록은 여기 없습니다.",
      "Kaspaのアドレスは kaspa: で始まります。ASICとGPUのWorkerは通常プールの同じウォレット配下で、solo-kas の記録はここにありません。",
    ],
    decision: [
      "用 kaspa: 查普通矿池",
      "用 kaspa: 查普通礦池",
      "Use kaspa: on the regular pool",
      "kaspa: 로 일반 풀을 조회",
      "kaspa: で通常プールを照会",
    ],
    action: [
      "[打开 Kaspa 监控](/projects/kas)，粘贴完整的 kaspa: 地址，不要打开 SOLO 服务器。",
      "[開啟 Kaspa 監控](/projects/kas)，貼上完整的 kaspa: 地址，不要打開 SOLO 伺服器。",
      "[Open the Kaspa monitor](/projects/kas), paste the full kaspa: address, and do not open the SOLO server.",
      "[Kaspa 모니터](/projects/kas)에 kaspa: 주소 전체를 넣고 SOLO 서버는 열지 마세요.",
      "[Kaspa監視](/projects/kas)に kaspa: アドレス全体を入れ、SOLOサーバーは開きません。",
    ],
    comparisonTitle: [
      "KAS 普通矿池和 SOLO、Worker",
      "KAS 普通礦池和 SOLO、Worker",
      "KAS regular pool, SOLO, and Workers",
      "KAS 일반 풀과 SOLO, Worker",
      "KASの通常プールとSOLO、Worker",
    ],
    rows: [
      [
        [
          "kaspa: 后面约 61 到 65 位",
          "kaspa: 後面約 61 到 65 位",
          "kaspa: then about 61 to 65 characters",
          "kaspa: 다음 약 61–65자",
          "kaspa: の後におよそ61〜65文字",
        ],
        [
          "这是本页接受的 Kaspa 收益地址。",
          "這是本頁接受的 Kaspa 收益地址。",
          "This is the Kaspa payout this page accepts.",
          "이 페이지가 받는 Kaspa 보상 주소입니다.",
          "このページが受けるKaspaの報酬アドレスです。",
        ],
      ],
      [
        [
          "ASIC 上填了钱包，Worker 很多",
          "ASIC 上填了錢包，Worker 很多",
          "The ASIC uses the wallet and shows many Workers",
          "ASIC에 지갑을 넣으니 Worker가 많음",
          "ASICにウォレットを入れWorkerが多い",
        ],
        [
          "名称来自普通矿池。它们共用这一份钱包的余额。",
          "名稱來自普通礦池。它們共用這一份錢包的餘額。",
          "The names come from the regular pool. They share that wallet's balance.",
          "이름은 일반 풀에서 옵니다. 그 지갑의 잔액을 같이 씁니다.",
          "名前は通常プールからです。そのウォレットの残高を共有します。",
        ],
      ],
      [
        [
          "帮助页写了 KS 或 Antminer",
          "幫助頁寫了 KS 或 Antminer",
          "The help page names KS or Antminer",
          "도움말에 KS나 Antminer가 있음",
          "ヘルプにKSやAntminerとある",
        ],
        [
          "那是普通矿池接受的矿机类别，不是 SOLO，也不是本站实测。",
          "那是普通礦池接受的礦機類別，不是 SOLO，也不是本站實測。",
          "Those are miner classes the regular pool accepts, not SOLO and not a measurement by this site.",
          "일반 풀이 받는 채굴기 종류이지 SOLO도, 이 사이트의 실측도 아닙니다.",
          "通常プールが受ける機種の区分であり、SOLOでも当サイトの実測でもありません。",
        ],
      ],
      [
        [
          "只在 solo-kas.2miners.com 看得到",
          "只在 solo-kas.2miners.com 看得到",
          "It appears only on solo-kas.2miners.com",
          "solo-kas.2miners.com에서만 보임",
          "solo-kas.2miners.com でしか見えない",
        ],
        [
          "换到 kas.2miners.com。两台服务器不要当成同一账户。",
          "換到 kas.2miners.com。兩台伺服器不要當成同一帳戶。",
          "Switch to kas.2miners.com. Do not treat the two servers as one account.",
          "kas.2miners.com으로 바꾸세요. 두 서버를 한 계정으로 보지 마세요.",
          "kas.2miners.com に切り替えます。二つのサーバーを一つの口座にしないでください。",
        ],
      ],
    ],
    sections: [
      [
        [
          "KAS 应该填哪种地址？",
          "KAS 該填哪種地址？",
          "Which KAS address should I enter?",
          "어떤 KAS 주소를 입력하나요?",
          "どのKASアドレスを入力しますか？",
        ],
        [
          "填写普通矿池 kas.2miners.com 上的 Kaspa 收益地址，以 kaspa: 开头，后面大约 61 到 65 个 bech32 字符。2Miners 帮助页的示例也是 kaspa: 开头。矿机里的 Worker 或 RIG 名称不是地址。BTC、TON 领款地址不在本页。不要填私钥。查询不会启动 kHeavyHash。",
          "填寫普通礦池 kas.2miners.com 上的 Kaspa 收益地址，以 kaspa: 開頭，後面大約 61 到 65 個 bech32 字元。2Miners 幫助頁的示例也是 kaspa: 開頭。礦機裡的 Worker 或 RIG 名稱不是地址。BTC、TON 領款地址不在本頁。不要填私鑰。查詢不會啟動 kHeavyHash。",
          "Enter the Kaspa payout on the regular pool kas.2miners.com. It starts with kaspa: and continues for about 61 to 65 bech32 characters. The 2Miners help example also starts with kaspa:. A Worker or rig name in the miner is not the address. BTC and TON payout addresses are not on this page. Do not paste a private key. Lookup does not start kHeavyHash.",
          "일반 풀 kas.2miners.com의 Kaspa 보상 주소를 넣으세요. kaspa: 로 시작하고 뒤에 bech32 문자가 약 61자에서 65자입니다. 2Miners 도움말 예시도 kaspa: 로 시작합니다. 채굴기의 Worker나 RIG 이름은 주소가 아닙니다. BTC·TON 수령 주소는 이 페이지에 없습니다. 비밀키는 넣지 마세요. 조회는 kHeavyHash를 시작하지 않습니다.",
          "通常プール kas.2miners.com の Kaspa 報酬アドレスを入れます。kaspa: で始まり、続く bech32 はおよそ61〜65文字です。2Minersのヘルプ例も kaspa: で始まります。採掘ソフトのWorkerやリグ名はアドレスではありません。BTCやTONの受取先はこのページにありません。秘密鍵は貼らないでください。照会は kHeavyHash を始めません。",
        ],
      ],
      [
        [
          "ASIC 该看普通矿池还是 SOLO？",
          "ASIC 該看普通礦池還是 SOLO？",
          "Should an ASIC use the regular pool or SOLO?",
          "ASIC는 일반 풀과 SOLO 중 어디를 보나요?",
          "ASICは通常プールとSOLOのどちらを見ますか？",
        ],
        [
          "本页只读 kas.2miners.com 的普通矿池。2Miners 帮助页在这一口普通矿池下列出 GPU，以及 IceRiver、Antminer 等 ASIC 的接入类别，算法示例写成 kHeavyHash。那是矿池自己的接入说明，不是本站测过的算力。官方 API 把 solo-kas.2miners.com 写成另一台服务器。SOLO 上的账户不会出现在这里。Kaspa 官网说明的是网络本身，不代替这口矿池的账户。",
          "本頁只讀 kas.2miners.com 的普通礦池。2Miners 幫助頁在這一口普通礦池下列出 GPU，以及 IceRiver、Antminer 等 ASIC 的接入類別，演算法示例寫成 kHeavyHash。那是礦池自己的接入說明，不是本站測過的算力。官方 API 把 solo-kas.2miners.com 寫成另一台伺服器。SOLO 上的帳戶不會出現在這裡。Kaspa 官網說明的是網路本身，不代替這口礦池的帳戶。",
          "This page reads only the regular pool at kas.2miners.com. On that same regular pool, the 2Miners help lists GPU miners and ASIC classes such as IceRiver and Antminer, and its miner examples use kHeavyHash. That is the pool's connection note, not a hashrate this site measured. The official API lists solo-kas.2miners.com as another server. A SOLO account does not show up here. The Kaspa site describes the network; it does not replace this pool account.",
          "이 페이지는 kas.2miners.com 일반 풀만 읽습니다. 2Miners 도움말은 그 일반 풀에 GPU와 IceRiver, Antminer 같은 ASIC 종류를 적고, 채굴 예시는 kHeavyHash를 씁니다. 그것은 풀의 접속 안내이지 이 사이트가 측정한 해시레이트가 아닙니다. 공식 API는 solo-kas.2miners.com을 다른 서버로 적습니다. SOLO 계정은 여기 나오지 않습니다. Kaspa 사이트는 네트워크를 설명할 뿐 이 풀 계정을 대신하지 않습니다.",
          "このページは kas.2miners.com の通常プールだけを読みます。2Minersのヘルプはその通常プールにGPUと、IceRiverやAntminerなどのASIC区分を載せ、採掘例は kHeavyHash を使います。それはプールの接続案内であり、当サイトが測った算力ではありません。公式APIは solo-kas.2miners.com を別サーバーと書きます。SOLOの口座はここに出ません。Kaspaのサイトはネットワークの説明であり、このプール口座の代わりにはなりません。",
        ],
      ],
      [
        [
          "ASIC 在跑，为什么这里没有 Worker？",
          "ASIC 在跑，為什麼這裡沒有 Worker？",
          "The ASIC is running. Why is the Worker missing?",
          "ASIC가 도는데 Worker가 없는 이유는?",
          "ASICは動いているのにWorkerが無いのは？",
        ],
        [
          "先确认矿机提交到的是普通矿池 kas.2miners.com，钱包是完整的 kaspa: 地址，而不是 SOLO 主机或 Worker 名称。名单为空只说明这口矿池没有返回名称。不要据此判断机器损坏。收益缺失保持横线。获取时间是香港时间的响应时刻，和滚动 24 小时不是同一个窗口，见 [数据来源与新鲜度](/learn/data-sources-and-freshness)。",
          "先確認礦機提交到的是普通礦池 kas.2miners.com，錢包是完整的 kaspa: 地址，而不是 SOLO 主機或 Worker 名稱。名單為空只說明這口礦池沒有返回名稱。不要據此判斷機器損壞。收益缺失保持橫線。取得時間是香港時間的回應時刻，和滾動 24 小時不是同一個窗口，見 [資料來源與新鮮度](/learn/data-sources-and-freshness)。",
          "Confirm the machine submits to the regular pool kas.2miners.com and the wallet is the full kaspa: address, not a SOLO host or a Worker name. An empty list only means this pool returned no name. Do not treat that as a broken machine. A missing reward stays a dash. Fetch time is the Hong Kong response clock and is not the rolling 24-hour window. See [sources and freshness](/learn/data-sources-and-freshness).",
          "기기가 일반 풀 kas.2miners.com에 제출하고, 지갑이 SOLO 호스트나 Worker 이름이 아닌 전체 kaspa: 주소인지 확인하세요. 목록이 비면 이 풀이 이름을 주지 않은 것뿐입니다. 기기가 고장 났다고 보지 마세요. 빠진 보상은 가로줄입니다. 조회 시각은 홍콩 시간의 응답 시각이며 최근 24시간 창이 아닙니다. [데이터 출처와 신선도](/learn/data-sources-and-freshness)를 보세요.",
          "機器が通常プール kas.2miners.com に提出し、ウォレットがSOLOホストやWorker名ではなく完全な kaspa: アドレスか確認します。一覧が空なのは、このプールが名前を返していないだけです。機器の故障とは判断しません。欠けた報酬は横線のままです。取得時刻は香港時間の応答時刻であり、直近24時間の窓ではありません。[データ源と鮮度](/learn/data-sources-and-freshness)を参照します。",
        ],
      ],
      [
        [
          "多台 ASIC 的算力为什么对不上每台的币？",
          "多台 ASIC 的算力為什麼對不上每台的幣？",
          "Why doesn't hashrate from several ASICs match coins per machine?",
          "ASIC 여러 대의 해시레이트가 기기별 코인과 안 맞는 이유는?",
          "複数ASICの算力が台ごとのコインと合わないのは？",
        ],
        [
          "矿池报告的是账户速率和各个 Worker 的速率，单位是 H/s 这一类，不是 KAS 枚数。多台 ASIC 或 GPU 可以共用一个 kaspa: 钱包，用不同 Worker 名称区分速率和在线状态。未支付、已支付和近 24 小时仍是这一份钱包的数，不能按机器切开。本页不把速率换成收益，也不比较谁的机器更赚。",
          "礦池報告的是帳戶速率和各個 Worker 的速率，單位是 H/s 這一類，不是 KAS 枚數。多台 ASIC 或 GPU 可以共用一個 kaspa: 錢包，用不同 Worker 名稱區分速率和連線狀態。未支付、已支付和近 24 小時仍是這一份錢包的數，不能按機器切開。本頁不把速率換成收益，也不比較誰的機器更賺。",
          "The pool reports an account rate and a rate per Worker, in units such as H/s, not a count of KAS. Several ASICs or GPUs may share one kaspa: wallet and use Worker names to separate rate and online status. Unpaid, paid, and the last 24 hours remain that one wallet's figures. They cannot be cut per machine. This page does not convert the rate into earnings and does not rank which machine earns more.",
          "풀은 계정 속도와 Worker별 속도를 H/s 같은 단위로 보고하며 KAS 개수가 아닙니다. ASIC나 GPU 여러 대가 kaspa: 지갑 하나를 쓰고 Worker 이름으로 속도와 접속을 나눌 수 있습니다. 미지급, 지급완료, 최근 24시간은 그 지갑 하나의 숫자이며 기기별로 자를 수 없습니다. 이 페이지는 속도를 수익으로 바꾸지 않고, 어느 기기가 더 버는지 견주지도 않습니다.",
          "プールは口座の速度とWorkerごとの速度をH/sのような単位で報告し、KASの枚数ではありません。複数のASICやGPUが一つの kaspa: ウォレットを共有し、Worker名で速度と接続を分けられます。未払い、支払済み、直近24時間はその一つのウォレットの数で、機器ごとに切れません。このページは速度を収益に換えず、どの機器がより稼ぐかも比べません。",
        ],
      ],
      [
        [
          "余额、已支付和滚动 24 小时指什么？",
          "餘額、已支付和滾動 24 小時指什麼？",
          "What do balance, paid, and the rolling 24 hours mean?",
          "잔액, 지급완료, 최근 24시간은 무엇인가요?",
          "残高、支払済み、直近24時間は何ですか？",
        ],
        [
          "未支付余额是矿池还没付出的记账，累计已支付是已经付出的合计，近 24 小时是滚动窗口。它不是 UTC 自然日，也不是 Kaspa 钱包在链上的余额。三笔不要相加。横线表示这份矿池数据缺失。公开统计能打开，也不表示本站保存了该地址的全部历史。",
          "未支付餘額是礦池還沒付出的記帳，累計已支付是已經付出的合計，近 24 小時是滾動窗口。它不是 UTC 自然日，也不是 Kaspa 錢包在鏈上的餘額。三筆不要相加。橫線表示這份礦池資料缺失。公開統計能打開，也不表示本站保存了該地址的全部歷史。",
          "Unpaid balance is what the pool has not paid. Total paid is the sum already sent. The last 24 hours is a rolling window. It is not a UTC calendar day and not the on-chain Kaspa wallet balance. Do not add the three. A dash means this pool figure is missing. An open public statistics page does not mean this site stored that address's full history.",
          "미지급 잔액은 풀이 아직 보내지 않은 기장이고, 누적 지급은 이미 보낸 합계이며, 최근 24시간은 이동 창입니다. UTC 달력일도 아니고 체인 위의 Kaspa 지갑 잔액도 아닙니다. 셋을 더하지 마세요. 가로줄은 이 풀 수치가 빠졌다는 뜻입니다. 공개 통계가 열려 있어도 이 사이트가 그 주소의 전체 이력을 저장했다는 뜻은 아닙니다.",
          "未払い残高はプールがまだ払っていない記帳、累計支払はすでに送った合計、直近24時間は転がる窓です。UTCの暦日でも、チェーン上のKaspa残高でもありません。三つを足さないでください。横線はこのプールの値が欠けているという意味です。公開統計が開けても、当サイトがそのアドレスの全履歴を保存したという意味ではありません。",
        ],
      ],
      [
        [
          "多个 kaspa 地址怎么入库和移除？",
          "多個 kaspa 地址怎麼入庫和移除？",
          "How do I save and remove several kaspa: addresses?",
          "kaspa 주소 여러 개를 어떻게 저장하고 제거하나요?",
          "複数の kaspa: アドレスを保存・削除するには？",
        ],
        [
          "登录 [Kaspa 监控](/projects/kas)，每行一个 kaspa: 地址，就是一个账户。免费每个项目 5 个，Pro 50 个。一个钱包下有多台 ASIC 的 Worker，仍然只占这一个账户，不按机器加价。设备总览没有额外总数上限。总览、Mac Agent 和崩溃解读不占 KAS 名额。移除只解除保存，不会让 ASIC 停机。读取失败可能保留上次成功值和原获取时间，并标成过期。要核对来源，打开普通矿池里的该钱包页面，而不是 SOLO。",
          "登入 [Kaspa 監控](/projects/kas)，每行一個 kaspa: 地址，就是一個帳戶。免費每個專案 5 個，Pro 50 個。一個錢包下有多台 ASIC 的 Worker，仍然只占這一個帳戶，不按機器加價。設備總覽沒有額外總數上限。總覽、Mac Agent 和崩潰解讀不占 KAS 名額。移除只解除儲存，不會讓 ASIC 停機。讀取失敗可能保留上次成功值和原取得時間，並標成過期。要核對來源，打開普通礦池裡的該錢包頁面，而不是 SOLO。",
          "Sign in on the [Kaspa monitor](/projects/kas). Each line is one kaspa: address and one account. Free is 5 per project and Pro is 50. Many ASIC Workers under one wallet still use that single account. They are not priced per machine. The device overview has no extra total cap. Overview, the Mac Agent, and crash interpretation do not use KAS quota. Remove only detaches the save and does not power down an ASIC. A failed read can keep the last success and its original fetch time, marked stale. To check the source, open that wallet on the regular pool, not SOLO.",
          "[Kaspa 모니터](/projects/kas)에 로그인하면 한 줄이 kaspa: 주소 하나, 계정 하나입니다. 프로젝트당 무료 5개, Pro 50개입니다. 한 지갑 아래 ASIC Worker가 여러 대여도 그 계정 하나만 쓰고, 기기마다 요금이 붙지 않습니다. 기기 총괄에 추가 총수 상한은 없습니다. 총괄, Mac Agent, 충돌 해석은 KAS 한도를 쓰지 않습니다. 제거는 저장만 떼며 ASIC를 끄지 않습니다. 읽기 실패 시 이전 성공 값과 원래 조회 시각이 남고 오래됨으로 표시될 수 있습니다. 출처를 보려면 SOLO가 아닌 일반 풀의 그 지갑 페이지를 여세요.",
          "[Kaspa監視](/projects/kas)にログインすると、1行が kaspa: アドレス1件で1口座です。各プロジェクト無料5件、Proは50件です。一つのウォレットにASICのWorkerが何台あってもその1口座のままで、台ごとの料金にはなりません。デバイス総覧に追加の総数上限はありません。総覧、Mac Agent、クラッシュ解釈はKAS枠を使いません。削除は保存を外すだけで、ASICの電源は切りません。取得失敗時は前回の成功値と元の取得時刻が残り、古い表示になることがあります。出典を見るならSOLOではなく通常プールのそのウォレットページを開きます。",
        ],
      ],
    ],
    related: ["rvn-mining-monitor-guide", "erg-mining-monitor-guide"],
    sources: [
      { name: "2Miners · KAS help", url: "https://kas.2miners.com/help" },
      { name: "Kaspa", url: "https://kaspa.org/" },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    ],
    keywords: [
      ["kaspa 地址", "kaspa 地址", "kaspa address", "kaspa 주소", "kaspaアドレス"],
      ["kHeavyHash", "kHeavyHash", "kHeavyHash", "kHeavyHash", "kHeavyHash"],
      ["KAS 普通矿池", "KAS 普通礦池", "KAS regular pool", "KAS 일반 풀", "KAS通常プール"],
      [
        "ASIC 不是 SOLO",
        "ASIC 不是 SOLO",
        "ASIC is not SOLO",
        "ASIC는 SOLO가 아님",
        "ASICはSOLOではない",
      ],
    ],
  }),
  poolGuide({
    slug: "erg-mining-monitor-guide",
    project: "erg",
    title: [
      "ERG 监控该填哪种以 9 开头的 Autolykos 地址？",
      "ERG 監控該填哪種以 9 開頭的 Autolykos 地址？",
      "Which 9-address belongs on the ERG Autolykos monitor?",
      "ERG Autolykos 모니터에는 어떤 9 주소를 넣나요?",
      "ERGのAutolykos監視には、どの9アドレスを入れますか？",
    ],
    summary: [
      "普通矿池 erg.2miners.com 的 Ergo 收益地址才是账户。帮助页示例以 9 开头；官网页面没有写完整字符规则，SOLO 和全网历史都不在这里。",
      "普通礦池 erg.2miners.com 的 Ergo 收益地址才是帳戶。幫助頁示例以 9 開頭；官網頁面沒有寫完整字元規則，SOLO 和全網歷史都不在這裡。",
      "The account is the Ergo payout on the regular pool erg.2miners.com. The help example starts with 9. The project pages we read did not give a full character rule, and SOLO plus full-network history are out of range.",
      "계정은 일반 풀 erg.2miners.com의 Ergo 보상 주소입니다. 도움말 예시는 9로 시작합니다. 이번에 읽은 프로젝트 페이지에는 전체 문자 규칙이 없었고, SOLO와 네트워크 전체 이력은 범위 밖입니다.",
      "口座は通常プール erg.2miners.com のErgo報酬アドレスです。ヘルプの例は9で始まります。今回読んだプロジェクトページには文字規則の全文がなく、SOLOとネットワーク全体の履歴は対象外です。",
    ],
    decision: [
      "用普通矿池上的 Ergo 地址",
      "用普通礦池上的 Ergo 地址",
      "Use the Ergo address on the regular pool",
      "일반 풀의 Ergo 주소를 사용",
      "通常プールのErgoアドレスを使う",
    ],
    action: [
      "[打开 Ergo 监控](/projects/erg)，粘贴矿池里的 Ergo 收益地址，不要用 SOLO 或 BTC 地址。",
      "[開啟 Ergo 監控](/projects/erg)，貼上礦池裡的 Ergo 收益地址，不要用 SOLO 或 BTC 地址。",
      "[Open the Ergo monitor](/projects/erg) and paste the Ergo payout from the pool, not SOLO or a BTC address.",
      "[Ergo 모니터](/projects/erg)에 풀의 Ergo 보상 주소를 넣고 SOLO나 BTC 주소는 넣지 마세요.",
      "[Ergo監視](/projects/erg)にプールのErgo報酬アドレスを入れ、SOLOやBTCアドレスは入れません。",
    ],
    comparisonTitle: [
      "ERG 地址、Autolykos 和 SOLO",
      "ERG 地址、Autolykos 和 SOLO",
      "ERG address, Autolykos, and SOLO",
      "ERG 주소, Autolykos, SOLO",
      "ERGアドレス、Autolykos、SOLO",
    ],
    rows: [
      [
        [
          "帮助页示例以 9 开头",
          "幫助頁示例以 9 開頭",
          "The help-page example starts with 9",
          "도움말 예시가 9로 시작",
          "ヘルプの例が9で始まる",
        ],
        [
          "按该 Ergo 收益地址查询。不要把任意 9 开头字符串当成已核实的协议。",
          "按該 Ergo 收益地址查詢。不要把任意 9 開頭字串當成已核實的協議。",
          "Look up that Ergo payout. Do not treat every string starting with 9 as a verified protocol rule.",
          "그 Ergo 보상 주소로 조회하세요. 9로 시작하는 모든 문자열을 확인된 규칙으로 보지 마세요.",
          "そのErgo報酬アドレスで照会します。9で始まる任意の文字列を確認済みの規則にしないでください。",
        ],
      ],
      [
        [
          "官网没写出字符表",
          "官網沒寫出字元表",
          "The project site did not list the character table",
          "프로젝트 사이트가 문자표를 적지 않음",
          "プロジェクトサイトに文字表が無い",
        ],
        [
          "本次读到的 Ergo 页面没有地址文法。缺了的规则就标成未核实。",
          "本次讀到的 Ergo 頁面沒有地址文法。缺了的規則就標成未核實。",
          "The Ergo pages retrieved for this guide had no address grammar. Missing rules stay unverified.",
          "이번에 읽은 Ergo 페이지에는 주소 문법이 없었습니다. 없는 규칙은 미확인으로 둡니다.",
          "今回読んだErgoのページにアドレス文法はありませんでした。無い規則は未確認のままにします。",
        ],
      ],
      [
        [
          "算法写成 Autolykos",
          "演算法寫成 Autolykos",
          "The algorithm is named Autolykos",
          "알고리즘이 Autolykos",
          "アルゴリズムがAutolykos",
        ],
        [
          "帮助页用这个名字，矿机示例写 autolykos2。本页不启动挖矿。",
          "幫助頁用這個名字，礦機示例寫 autolykos2。本頁不啟動挖礦。",
          "The help page uses that name; miner examples say autolykos2. This page does not start mining.",
          "도움말은 그 이름이고 채굴 예시는 autolykos2입니다. 이 페이지는 채굴을 시작하지 않습니다.",
          "ヘルプはその名前で、採掘例は autolykos2 です。このページは採掘を始めません。",
        ],
      ],
      [
        [
          "记录在 solo-erg.2miners.com",
          "紀錄在 solo-erg.2miners.com",
          "The record is on solo-erg.2miners.com",
          "기록이 solo-erg.2miners.com에 있음",
          "記録が solo-erg.2miners.com にある",
        ],
        [
          "回到 erg.2miners.com。公开统计返回成功也不等于历史已经齐。",
          "回到 erg.2miners.com。公開統計返回成功也不等於歷史已經齊。",
          "Return to erg.2miners.com. A successful public stats response does not mean history is complete.",
          "erg.2miners.com으로 돌아가세요. 공개 통계가 성공해도 이력이 갖춰진 것은 아닙니다.",
          "erg.2miners.com に戻ります。公開統計が成功しても履歴が揃ったことにはなりません。",
        ],
      ],
    ],
    sections: [
      [
        [
          "ERG 应该填哪种地址？",
          "ERG 該填哪種地址？",
          "Which ERG address should I enter?",
          "어떤 ERG 주소를 입력하나요?",
          "どのERGアドレスを入力しますか？",
        ],
        [
          "填写普通矿池 erg.2miners.com 里配置的 Ergo 收益地址。2Miners 帮助页的 Ergo 示例以 9 开头。Ergo 官网和文档首页在这次读取里没有给出地址字符规则，所以不能把「凡是 9 开头都有效」写成已经核实的 Ergo 规范。BTC、TON 领款地址不要贴进来。不要填私钥。查询不会启动 Autolykos。",
          "填寫普通礦池 erg.2miners.com 裡設定的 Ergo 收益地址。2Miners 幫助頁的 Ergo 示例以 9 開頭。Ergo 官網和文件首頁在這次讀取裡沒有給出地址字元規則，所以不能把「凡是 9 開頭都有效」寫成已經核實的 Ergo 規範。BTC、TON 領款地址不要貼進來。不要填私鑰。查詢不會啟動 Autolykos。",
          "Enter the Ergo payout configured on the regular pool erg.2miners.com. The Ergo example on the 2Miners help page starts with 9. The Ergo site and docs home retrieved for this guide did not state an address character rule, so “anything starting with 9 is valid” is not a verified Ergo specification. Do not paste a BTC or TON payout. Do not paste a private key. Lookup does not start Autolykos.",
          "일반 풀 erg.2miners.com에 설정한 Ergo 보상 주소를 넣으세요. 2Miners 도움말의 Ergo 예시는 9로 시작합니다. 이번에 읽은 Ergo 사이트와 문서 첫 화면에는 주소 문자 규칙이 없어서, 9로 시작하면 모두 유효하다고 확인된 Ergo 규범처럼 쓰지 않습니다. BTC·TON 수령 주소는 붙이지 마세요. 비밀키도 넣지 마세요. 조회는 Autolykos를 시작하지 않습니다.",
          "通常プール erg.2miners.com に設定した Ergo の報酬アドレスを入れます。2MinersヘルプのErgo例は9で始まります。今回読んだErgoのサイトと文書の先頭にはアドレスの文字規則が無く、「9で始まればすべて有効」を確認済みのErgo仕様にはしません。BTCやTONの受取先は貼らないでください。秘密鍵も貼らないでください。照会はAutolykosを始めません。",
        ],
      ],
      [
        [
          "Autolykos 支持哪个矿池？",
          "Autolykos 支援哪個礦池？",
          "Which pool is covered for Autolykos?",
          "Autolykos는 어느 풀인가요?",
          "Autolykosはどのプールですか？",
        ],
        [
          "只读 erg.2miners.com 的普通矿池账户。帮助页把算法称为 Autolykos，矿机示例写成 autolykos2，两者都是这口矿池的说法，不是另一条链。官方 API 把 solo-erg.2miners.com 列为单独服务器，SOLO 不并入本页。公开统计接口这次返回 HTTP 200，只说明该统计地址有响应，不说明全网覆盖或历史已经齐备。其他矿池的 Ergo 地址不会自动出现。",
          "只讀 erg.2miners.com 的普通礦池帳戶。幫助頁把演算法稱為 Autolykos，礦機示例寫成 autolykos2，兩者都是這口礦池的說法，不是另一條鏈。官方 API 把 solo-erg.2miners.com 列為單獨伺服器，SOLO 不併入本頁。公開統計介面這次返回 HTTP 200，只說明該統計地址有回應，不說明全網覆蓋或歷史已經齊備。其他礦池的 Ergo 地址不會自動出現。",
          "The page reads only the regular account on erg.2miners.com. The help page calls the algorithm Autolykos, and miner examples say autolykos2. Both are that pool's wording, not another chain. The official API lists solo-erg.2miners.com as a separate server, so SOLO is not merged here. The public stats endpoint returned HTTP 200 this time. That only means the stats URL responded. It does not mean full-network coverage or a complete history. An Ergo address on another pool does not appear automatically.",
          "이 페이지는 erg.2miners.com 일반 계정만 읽습니다. 도움말은 알고리즘을 Autolykos라 하고 채굴 예시는 autolykos2입니다. 둘 다 그 풀의 표현이지 다른 체인이 아닙니다. 공식 API는 solo-erg.2miners.com을 별도 서버로 적으므로 SOLO는 여기 합쳐지지 않습니다. 공개 통계 주소는 이번에 HTTP 200을 반환했습니다. 그 통계 URL이 응답했다는 뜻이지, 네트워크 전체나 완전한 이력은 아닙니다. 다른 풀의 Ergo 주소는 자동으로 나타나지 않습니다.",
          "このページは erg.2miners.com の通常口座だけを読みます。ヘルプはアルゴリズムをAutolykosと呼び、採掘例は autolykos2 です。どちらもそのプールの言い方であり、別のチェーンではありません。公式APIは solo-erg.2miners.com を別サーバーとするので、SOLOはここに合算されません。公開統計のURLは今回 HTTP 200 を返しました。その統計URLが応答したという意味であり、ネットワーク全体や完全な履歴ではありません。他プールのErgoアドレスは自動では出ません。",
        ],
      ],
      [
        [
          "为什么没有 Worker，也看不到收益？",
          "為什麼沒有 Worker，也看不到收益？",
          "Why are Workers and rewards missing?",
          "Worker도 보상도 없는 이유는?",
          "Workerも報酬も見えないのはなぜ？",
        ],
        [
          "地址必须是 erg.2miners.com 普通矿池里的那一个 Ergo 收益地址。SOLO、别的矿池、或把 RIG 名称当成地址，都会没有名单。没有名单不是矿机已停的结论。收益缺失是横线，不是 0。获取时间用香港时间，只表示本站拿到响应的时刻，见 [数据来源与新鲜度](/learn/data-sources-and-freshness)。",
          "地址必須是 erg.2miners.com 普通礦池裡的那一個 Ergo 收益地址。SOLO、別的礦池、或把 RIG 名稱當成地址，都會沒有名單。沒有名單不是礦機已停的結論。收益缺失是橫線，不是 0。取得時間用香港時間，只表示本站拿到回應的時刻，見 [資料來源與新鮮度](/learn/data-sources-and-freshness)。",
          "The address has to be the Ergo payout on the regular erg.2miners.com pool. SOLO, another pool, or a rig name pasted as the address leaves no list. No list is not proof the miner stopped. A missing reward is a dash, not zero. Fetch time is Hong Kong time and only marks when this site received the response. See [sources and freshness](/learn/data-sources-and-freshness).",
          "주소는 erg.2miners.com 일반 풀의 그 Ergo 보상 주소여야 합니다. SOLO, 다른 풀, 또는 RIG 이름을 주소로 붙이면 목록이 없습니다. 목록이 없다고 채굴기가 멈춘 것은 아닙니다. 빠진 보상은 가로줄이지 0이 아닙니다. 조회 시각은 홍콩 시간이며 이 사이트가 응답을 받은 시각입니다. [데이터 출처와 신선도](/learn/data-sources-and-freshness)를 보세요.",
          "アドレスは erg.2miners.com の通常プールにあるそのErgo報酬アドレスである必要があります。SOLO、別プール、またはリグ名をアドレスとして貼ると一覧がありません。一覧が無いことは採掘停止の証明ではありません。欠けた報酬は横線でありゼロではありません。取得時刻は香港時間で、このサイトが応答を受け取った時刻です。[データ源と鮮度](/learn/data-sources-and-freshness)を参照します。",
        ],
      ],
      [
        [
          "Autolykos 算力和 ERG 收益为什么不是一回事？",
          "Autolykos 算力和 ERG 收益為什麼不是一回事？",
          "Why is Autolykos hashrate not the same as ERG you receive?",
          "Autolykos 해시레이트와 받는 ERG가 다른 이유는?",
          "Autolykosの算力と受け取るERGが違うのは？",
        ],
        [
          "矿池给出的是账户和 Worker 的速率，不是已经到手的 ERG。选中 Worker 只筛选该名称的速率和状态，钱包的未支付不会被拆开。速率存在，也不表示已经支付。本页不估算收益，也不把公开统计里的全网算力写成你的机器。金额以矿池显示的 ERG 为单位，这里不展开内部换算。",
          "礦池給出的是帳戶和 Worker 的速率，不是已經到手的 ERG。選中 Worker 只篩選該名稱的速率和狀態，錢包的未支付不會被拆開。速率存在，也不表示已經支付。本頁不估算收益，也不把公開統計裡的全網算力寫成你的機器。金額以礦池顯示的 ERG 為單位，這裡不展開內部換算。",
          "The pool supplies an account rate and Worker rates, not ERG already received. Selecting a Worker filters that name's rate and status. It does not split the wallet's unpaid balance. A rate does not mean a payout occurred. This page does not estimate profit and does not present the public network hashrate as your machine. Amounts are the ERG figures the pool shows. Internal conversion steps are not part of this guide.",
          "풀이 주는 것은 계정과 Worker의 속도이지 이미 받은 ERG가 아닙니다. Worker를 고르면 그 이름의 속도와 상태만 거르며, 지갑의 미지급은 나뉘지 않습니다. 속도가 있어도 지급이 끝난 것은 아닙니다. 이 페이지는 수익을 추정하지 않고, 공개 통계의 네트워크 해시레이트를 내 기기로 쓰지 않습니다. 금액은 풀이 보여주는 ERG 단위이며, 내부 환산은 여기 적지 않습니다.",
          "プールが渡すのは口座とWorkerの速度であり、すでに受け取ったERGではありません。Workerを選ぶとその名前の速度と状態だけを絞り、ウォレットの未払いは分割しません。速度があっても支払済みではありません。このページは利益を見積もらず、公開統計のネットワーク算力を自分の機器とは書きません。金額はプールが表示するERGで、内部換算はこの案内に書きません。",
        ],
      ],
      [
        [
          "余额、已支付和近 24 小时怎么区分？",
          "餘額、已支付和近 24 小時怎麼區分？",
          "How do balance, paid, and the last 24 hours differ?",
          "잔액·지급완료·최근 24시간의 차이는?",
          "残高・支払済み・直近24時間の違いは？",
        ],
        [
          "和其他 2Miners 普通矿池账户一样，未支付余额、累计已支付、近 24 小时收益分开显示。近 24 小时是滚动窗口，不是 UTC 自然日，也不是香港时间当天。三者都不是 Ergo 钱包的链上余额，不要相加。缺数是横线。这次看到统计接口有响应，仍然不能把某一天的个人收益写成已经核对的实测。",
          "和其他 2Miners 普通礦池帳戶一樣，未支付餘額、累計已支付、近 24 小時收益分開顯示。近 24 小時是滾動窗口，不是 UTC 自然日，也不是香港時間當天。三者都不是 Ergo 錢包的鏈上餘額，不要相加。缺數是橫線。這次看到統計介面有回應，仍然不能把某一天的個人收益寫成已經核對的實測。",
          "As with other regular 2Miners accounts, unpaid balance, total paid, and the last 24 hours stay separate. Those 24 hours are a rolling window, not a UTC calendar day and not the Hong Kong calendar day. None of the three is the on-chain Ergo wallet balance. Do not add them. A missing number is a dash. Seeing the stats endpoint respond still does not make one person's day an audited measurement.",
          "다른 2Miners 일반 계정과 같이 미지급 잔액, 누적 지급, 최근 24시간 보상은 따로 보입니다. 그 24시간은 이동 창이며 UTC 달력일도, 홍콩 달력일도 아닙니다. 셋 다 Ergo 지갑의 체인 잔액이 아니니 더하지 마세요. 빠진 수는 가로줄입니다. 통계 주소가 응답했다고 해서 어느 하루의 개인 수익이 검증된 실측이 되지는 않습니다.",
          "他の2Miners通常口座と同じく、未払い残高、累計支払、直近24時間は分けて表示します。その24時間は転がる窓であり、UTCの暦日でも香港時間の当日でもありません。三つともErgoウォレットのチェーン残高ではないので足しません。欠けた数は横線です。統計URLが応答しても、ある一日の個人収益が検証済みの実測にはなりません。",
        ],
      ],
      [
        [
          "多个 Ergo 地址如何保存，异常怎么核对？",
          "多個 Ergo 地址如何儲存，異常怎麼核對？",
          "How do I save several Ergo addresses and check an anomaly?",
          "Ergo 주소 여러 개를 저장하고 이상은 어떻게 확인하나요?",
          "複数のErgoアドレスの保存と、異常の確認は？",
        ],
        [
          "登录 [Ergo 监控](/projects/erg) 后，一行一个收益地址，一个地址一个账户。免费每个项目 5 个，Pro 50 个。多个 Worker 不按台收费，也不额外占用名额。设备总览没有额外总数上限。总览、Mac Agent 和崩溃解读不占 ERG 名额。移除只删除已保存的地址，不会停止矿机。读取失败可能保留上次成功值和原来的获取时间，并标成过期。核对时打开 erg.2miners.com 上的该账户，而不是 SOLO，也不要用未核实的字符规则否定一个矿池已经接受的地址。",
          "登入 [Ergo 監控](/projects/erg) 後，一行一個收益地址，一個地址一個帳戶。免費每個專案 5 個，Pro 50 個。多個 Worker 不按台收費，也不額外占用名額。設備總覽沒有額外總數上限。總覽、Mac Agent 和崩潰解讀不占 ERG 名額。移除只刪除已儲存的地址，不會停止礦機。讀取失敗可能保留上次成功值和原來的取得時間，並標成過期。核對時打開 erg.2miners.com 上的該帳戶，而不是 SOLO，也不要用未核實的字元規則否定一個礦池已經接受的地址。",
          "After sign-in, each line on the [Ergo monitor](/projects/erg) is one payout address and one account. Free is 5 per project and Pro is 50. Workers are not charged per machine and do not take extra slots. The device overview has no added total cap. Overview, the Mac Agent, and crash interpretation do not use ERG quota. Remove deletes only the saved address and does not stop the miner. A failed read can keep the last success and its original fetch time, marked stale. When checking, open that account on erg.2miners.com, not SOLO, and do not reject an address the pool already accepted by using an unverified character rule.",
          "[Ergo 모니터](/projects/erg)에 로그인한 뒤 한 줄이 보상 주소 하나, 계정 하나입니다. 프로젝트당 무료 5개, Pro 50개입니다. Worker는 대당 요금도 아니고 한도를 더 쓰지 않습니다. 기기 총괄에 추가 총수 상한은 없습니다. 총괄, Mac Agent, 충돌 해석은 ERG 한도를 쓰지 않습니다. 제거는 저장된 주소만 지우며 채굴기를 멈추지 않습니다. 읽기 실패 시 이전 성공 값과 원래 조회 시각이 남고 오래됨으로 표시될 수 있습니다. 확인할 때는 SOLO가 아닌 erg.2miners.com의 그 계정을 열고, 확인되지 않은 문자 규칙으로 풀이 이미 받은 주소를 부정하지 마세요.",
          "[Ergo監視](/projects/erg)にログインすると、1行が報酬アドレス1件で1口座です。各プロジェクト無料5件、Proは50件です。Workerは台ごとの料金でも追加枠でもありません。デバイス総覧に追加の総数上限はありません。総覧、Mac Agent、クラッシュ解釈はERG枠を使いません。削除は保存アドレスだけを消し、採掘は止めません。取得失敗時は前回の成功値と元の取得時刻が残り、古い表示になることがあります。確認するときはSOLOではなく erg.2miners.com のその口座を開き、未確認の文字規則で、プールがすでに受けたアドレスを否定しないでください。",
        ],
      ],
    ],
    related: ["kas-mining-monitor-guide", "zeph-mining-monitor-guide"],
    sources: [
      { name: "2Miners · ERG help", url: "https://erg.2miners.com/help" },
      { name: "Ergo Platform", url: "https://ergoplatform.org/" },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    ],
    keywords: [
      ["Autolykos", "Autolykos", "Autolykos", "Autolykos", "Autolykos"],
      ["ERG 9 地址", "ERG 9 地址", "ERG 9 address", "ERG 9 주소", "ERGの9アドレス"],
      ["Ergo 普通矿池", "Ergo 普通礦池", "Ergo regular pool", "Ergo 일반 풀", "Ergo通常プール"],
      ["不是 SOLO", "不是 SOLO", "not SOLO", "SOLO 아님", "SOLOではない"],
    ],
  }),
  poolGuide({
    slug: "zeph-mining-monitor-guide",
    project: "zeph",
    title: [
      "ZEPH 用了 RandomX，为什么不能填门罗币地址？",
      "ZEPH 用了 RandomX，為什麼不能填門羅幣地址？",
      "ZEPH uses RandomX. Why is a Monero address rejected?",
      "ZEPH는 RandomX인데 모네로 주소를 넣으면 안 되는 이유",
      "ZEPHはRandomXなのにMoneroアドレスを入れられない理由",
    ],
    summary: [
      "Zephyr 的普通矿池也写 RandomX，但地址以 ZEPHYR 开头，和 Monero 的 4 或 8 不是同一个账户。SOLO 与 Kryptex 都不在这页。",
      "Zephyr 的普通礦池也寫 RandomX，但地址以 ZEPHYR 開頭，和 Monero 的 4 或 8 不是同一個帳戶。SOLO 與 Kryptex 都不在這頁。",
      "Zephyr's regular pool also says RandomX, but the address starts with ZEPHYR. A Monero 4 or 8 address is not that account. SOLO and Kryptex are not this page.",
      "Zephyr 일반 풀도 RandomX라고 쓰지만 주소는 ZEPHYR로 시작합니다. Monero의 4나 8은 그 계정이 아닙니다. SOLO와 Kryptex는 이 페이지가 아닙니다.",
      "Zephyrの通常プールもRandomXと書きますが、アドレスはZEPHYRで始まります。Moneroの4や8はその口座ではありません。SOLOもKryptexもこのページではありません。",
    ],
    decision: [
      "ZEPHYR 地址不要换成 XMR",
      "ZEPHYR 地址不要換成 XMR",
      "Do not swap a ZEPHYR address for XMR",
      "ZEPHYR 주소를 XMR로 바꾸지 않기",
      "ZEPHYRアドレスをXMRに置き換えない",
    ],
    action: [
      "[打开 Zephyr 监控](/projects/zeph)，只粘贴 ZEPHYR 收益地址，再和 Monero 页面分开看。",
      "[開啟 Zephyr 監控](/projects/zeph)，只貼 ZEPHYR 收益地址，再和 Monero 頁面分開看。",
      "[Open the Zephyr monitor](/projects/zeph), paste only the ZEPHYR payout, and keep it separate from the Monero page.",
      "[Zephyr 모니터](/projects/zeph)에는 ZEPHYR 보상 주소만 넣고 Monero 페이지와 나누어 보세요.",
      "[Zephyr監視](/projects/zeph)にはZEPHYRの報酬アドレスだけを入れ、Moneroのページとは分けて見ます。",
    ],
    comparisonTitle: [
      "ZEPH 和 Monero 不要混用",
      "ZEPH 和 Monero 不要混用",
      "Do not mix ZEPH with Monero",
      "ZEPH와 Monero를 섞지 않기",
      "ZEPHとMoneroを混ぜない",
    ],
    rows: [
      [
        [
          "帮助页示例以 ZEPHYR 开头",
          "幫助頁示例以 ZEPHYR 開頭",
          "The help example starts with ZEPHYR",
          "도움말 예시가 ZEPHYR로 시작",
          "ヘルプの例がZEPHYRで始まる",
        ],
        [
          "用这个 Zephyr 收益地址查普通矿池。",
          "用這個 Zephyr 收益地址查普通礦池。",
          "Use this Zephyr payout on the regular pool.",
          "이 Zephyr 보상 주소로 일반 풀을 조회합니다.",
          "このZephyr報酬アドレスで通常プールを照会します。",
        ],
      ],
      [
        [
          "95 位且以 4 或 8 开头",
          "95 位且以 4 或 8 開頭",
          "95 characters starting with 4 or 8",
          "4나 8로 시작하는 95자",
          "4か8で始まる95文字",
        ],
        [
          "那是 Monero 的形状。不要填进 Zephyr，也不要填进 Kryptex 的反方向。",
          "那是 Monero 的形狀。不要填進 Zephyr，也不要填進 Kryptex 的反方向。",
          "That is a Monero shape. Do not put it on Zephyr, or the other way around onto Kryptex.",
          "모네로 형태입니다. Zephyr에 넣지 말고, 반대로 Kryptex에도 Zephyr를 넣지 마세요.",
          "Moneroの形です。Zephyrに入れず、逆にKryptexへZephyrを入れることもしないでください。",
        ],
      ],
      [
        [
          "帮助页的租赁栏写了 XMR",
          "幫助頁的租用欄寫了 XMR",
          "The help page's rental label says XMR",
          "도움말의 대여 칸에 XMR이 있음",
          "ヘルプのレンタル欄にXMRとある",
        ],
        [
          "那是矿池表格上的字，不是让你改用门罗币地址。本页不提供那套做法。",
          "那是礦池表格上的字，不是讓你改用門羅幣地址。本頁不提供那套做法。",
          "Those are words on the pool's table, not a request to switch to a Monero address. This page does not provide that path.",
          "풀 표의 글자일 뿐 모네로 주소로 바꾸라는 뜻이 아닙니다. 이 페이지는 그 경로를 제공하지 않습니다.",
          "プールの表の文字であり、Moneroアドレスへ切り替えろという意味ではありません。このページはその手順を提供しません。",
        ],
      ],
      [
        [
          "只在 solo-zeph.2miners.com 有账户",
          "只在 solo-zeph.2miners.com 有帳戶",
          "The account exists only on solo-zeph.2miners.com",
          "계정이 solo-zeph.2miners.com에만 있음",
          "口座が solo-zeph.2miners.com にしか無い",
        ],
        [
          "改看 zeph.2miners.com。统计接口成功不等于历史齐全。",
          "改看 zeph.2miners.com。統計介面成功不等於歷史齊全。",
          "Use zeph.2miners.com. A successful stats response is not a complete history.",
          "zeph.2miners.com을 보세요. 통계 응답 성공이 완전한 이력은 아닙니다.",
          "zeph.2miners.com を見ます。統計の成功は完全な履歴ではありません。",
        ],
      ],
    ],
    sections: [
      [
        [
          "ZEPH 该填哪种地址，能填 XMR 吗？",
          "ZEPH 該填哪種地址，能填 XMR 嗎？",
          "Which ZEPH address, and can I use XMR?",
          "어떤 ZEPH 주소를 넣으며 XMR을 써도 되나요?",
          "どのZEPHアドレスを入れ、XMRは使えますか？",
        ],
        [
          "填写普通矿池 zeph.2miners.com 上的 Zephyr 收益地址。帮助页示例以 ZEPHYR 开头，矿机示例使用 XMRig 且币种写成 ZEPH。Monero 的 95 位标准地址、子地址（以 4 或 8 开头）和 106 位集成地址都不是这个账户。Zephyr 官网首页这次没有写出地址文法，因此前缀以矿池帮助页的示例为准，没有写明的细节标为未核实。不要填私钥。查询不会启动 RandomX。",
          "填寫普通礦池 zeph.2miners.com 上的 Zephyr 收益地址。幫助頁示例以 ZEPHYR 開頭，礦機示例使用 XMRig 且幣種寫成 ZEPH。Monero 的 95 位標準地址、子地址（以 4 或 8 開頭）和 106 位整合地址都不是這個帳戶。Zephyr 官網首頁這次沒有寫出地址文法，因此前綴以礦池幫助頁的示例為準，沒有寫明的細節標為未核實。不要填私鑰。查詢不會啟動 RandomX。",
          "Enter the Zephyr payout on the regular pool zeph.2miners.com. The help-page example starts with ZEPHYR, and the miner example uses XMRig with the coin set to ZEPH. A Monero standard address, subaddress starting with 4 or 8, or 106-character integrated address is not this account. The Zephyr homepage retrieved this time did not state an address grammar, so the prefix follows the pool help example and unstated details stay unverified. Do not paste a private key. Lookup does not start RandomX.",
          "일반 풀 zeph.2miners.com의 Zephyr 보상 주소를 넣으세요. 도움말 예시는 ZEPHYR로 시작하고, 채굴 예시는 XMRig에 코인을 ZEPH로 적습니다. Monero의 95자 표준 주소, 4나 8로 시작하는 서브주소, 106자 통합 주소는 이 계정이 아닙니다. 이번에 읽은 Zephyr 첫 화면에는 주소 문법이 없어서, 접두사는 풀 도움말 예시를 따르고 적히지 않은 세부는 미확인입니다. 비밀키는 넣지 마세요. 조회는 RandomX를 시작하지 않습니다.",
          "通常プール zeph.2miners.com の Zephyr 報酬アドレスを入れます。ヘルプの例は ZEPHYR で始まり、採掘例は XMRig でコインを ZEPH と書きます。Moneroの95文字の標準アドレス、4か8で始まるサブアドレス、106文字の統合アドレスは、この口座ではありません。今回読んだZephyrの先頭ページにアドレス文法は無く、接頭辞はプールのヘルプ例に従い、書かれていない細部は未確認です。秘密鍵は貼らないでください。照会はRandomXを始めません。",
        ],
      ],
      [
        [
          "同样是 RandomX，为什么和 Monero 矿池分开？",
          "同樣是 RandomX，為什麼和 Monero 礦池分開？",
          "Both say RandomX. Why is this pool separate from Monero?",
          "둘 다 RandomX인데 Monero 풀과 다른 이유는?",
          "どちらもRandomXなのにMoneroのプールと分かれるのは？",
        ],
        [
          "2Miners 的 Zephyr 帮助页把算法写成 RandomX，和 Kryptex 为 XMR 标注的 RandomX 是两种币、两个地址、两口矿池。帮助页旁栏把类型写成 RandomX (XMR)、并把另一栏写成 RandomXmonero，那只是表格用词，不能把 ZEPHYR 地址改成门罗币地址，也不能把本页当成 Kryptex。本页只读 zeph.2miners.com 普通矿池。API 文档里的 solo-zeph.2miners.com 是另一台服务器。公开统计返回 HTTP 200，不代表全网或历史已经齐。",
          "2Miners 的 Zephyr 幫助頁把演算法寫成 RandomX，和 Kryptex 為 XMR 標註的 RandomX 是兩種幣、兩個地址、兩口礦池。幫助頁旁欄把類型寫成 RandomX (XMR)、並把另一欄寫成 RandomXmonero，那只是表格用詞，不能把 ZEPHYR 地址改成門羅幣地址，也不能把本頁當成 Kryptex。本頁只讀 zeph.2miners.com 普通礦池。API 文件裡的 solo-zeph.2miners.com 是另一台伺服器。公開統計返回 HTTP 200，不代表全網或歷史已經齊。",
          "The 2Miners Zephyr help names the algorithm RandomX. Kryptex also labels XMR as RandomX. They are two coins, two address forms, and two pools. A side table on the Zephyr help says RandomX (XMR) and another line says RandomXmonero. Those are labels in the table. They do not turn a ZEPHYR address into a Monero address, and this page is not Kryptex. This page reads only the regular pool zeph.2miners.com. The API documentation's solo-zeph.2miners.com is another server. Public stats returned HTTP 200. That is not full-network coverage or a finished history.",
          "2Miners Zephyr 도움말은 알고리즘을 RandomX라고 합니다. Kryptex도 XMR을 RandomX로 적습니다. 코인, 주소, 풀이 모두 다릅니다. Zephyr 도움말 옆표는 RandomX (XMR), 다른 줄은 RandomXmonero라고 적습니다. 표의 글자일 뿐입니다. ZEPHYR 주소가 모네로 주소가 되지 않으며 이 페이지는 Kryptex가 아닙니다. 이 페이지는 zeph.2miners.com 일반 풀만 읽습니다. API 문서의 solo-zeph.2miners.com은 다른 서버입니다. 공개 통계가 HTTP 200을 반환해도 네트워크 전체나 끝난 이력은 아닙니다.",
          "2MinersのZephyrヘルプはアルゴリズムをRandomXと書きます。KryptexもXMRをRandomXと表示します。コインもアドレスもプールも別です。Zephyrヘルプの脇表は RandomX (XMR)、別の行は RandomXmonero とあります。表の文字にすぎません。ZEPHYRアドレスがMoneroアドレスになるわけではなく、このページはKryptexではありません。このページは zeph.2miners.com の通常プールだけを読みます。API文書の solo-zeph.2miners.com は別サーバーです。公開統計が HTTP 200 でも、ネットワーク全体や完成した履歴ではありません。",
        ],
      ],
      [
        [
          "矿机在挖，为什么没有 Worker 和收益？",
          "礦機在挖，為什麼沒有 Worker 和收益？",
          "The miner is running. Why are Workers and rewards missing?",
          "채굴 중인데 Worker와 보상이 없는 이유는?",
          "採掘中なのにWorkerと報酬が無いのは？",
        ],
        [
          "先看矿机的币种是 ZEPH、主机是 zeph.2miners.com，地址以 ZEPHYR 开头。若填成 Monero 地址、Kryptex 账户或 SOLO 服务器，这里就是没有这个账户。Worker 名称也不能代替地址。空白不是进程已停。横线不是 0。香港时间的获取时刻见 [数据来源与新鲜度](/learn/data-sources-and-freshness)。",
          "先看礦機的幣種是 ZEPH、主機是 zeph.2miners.com，地址以 ZEPHYR 開頭。若填成 Monero 地址、Kryptex 帳戶或 SOLO 伺服器，這裡就是沒有這個帳戶。Worker 名稱也不能代替地址。空白不是行程已停。橫線不是 0。香港時間的取得時刻見 [資料來源與新鮮度](/learn/data-sources-and-freshness)。",
          "Check that the miner coin is ZEPH, the host is zeph.2miners.com, and the address starts with ZEPHYR. A Monero address, a Kryptex account, or the SOLO server means this account is absent. A Worker name cannot replace the address. Blank is not a stopped process. A dash is not zero. The Hong Kong fetch time is explained in [sources and freshness](/learn/data-sources-and-freshness).",
          "채굴 코인이 ZEPH인지, 호스트가 zeph.2miners.com인지, 주소가 ZEPHYR로 시작하는지 먼저 보세요. Monero 주소, Kryptex 계정, SOLO 서버이면 여기에는 그 계정이 없습니다. Worker 이름이 주소를 대신하지 않습니다. 빈 화면은 프로세스 정지가 아니고, 가로줄은 0이 아닙니다. 홍콩 시간 조회 시각은 [데이터 출처와 신선도](/learn/data-sources-and-freshness)에 있습니다.",
          "採掘のコインがZEPHか、ホストが zeph.2miners.com か、アドレスが ZEPHYR で始まるかを先に見ます。Moneroアドレス、Kryptexの口座、SOLOサーバーなら、ここにその口座はありません。Worker名はアドレスの代わりになりません。空白はプロセス停止ではなく、横線はゼロではありません。香港時間の取得時刻は[データ源と鮮度](/learn/data-sources-and-freshness)にあります。",
        ],
      ],
      [
        [
          "RandomX 算力为什么不是已经到手的 ZEPH？",
          "RandomX 算力為什麼不是已經到手的 ZEPH？",
          "Why is RandomX hashrate not ZEPH already received?",
          "RandomX 해시레이트가 이미 받은 ZEPH가 아닌 이유는?",
          "RandomXの算力が受け取り済みZEPHでないのは？",
        ],
        [
          "页面上的速率是这口 Zephyr 矿池报告的数字，不是 Monero 页面上的 H/s，也不是钱包里的 ZEPH。Worker 只筛选该名称的速率和状态，不把未支付拆到每台机器。有速率不等于已经支付。本页不估算收益，也不沿用帮助页表格里的另一套接入来比较收入。金额按矿池显示的 ZEPH 阅读，不写内部换算。",
          "頁面上的速率是這口 Zephyr 礦池報告的數字，不是 Monero 頁面上的 H/s，也不是錢包裡的 ZEPH。Worker 只篩選該名稱的速率和狀態，不把未支付拆到每台機器。有速率不等於已經支付。本頁不估算收益，也不沿用幫助頁表格裡的另一套接入來比較收入。金額按礦池顯示的 ZEPH 閱讀，不寫內部換算。",
          "The rate on this page is what the Zephyr pool reports. It is not the H/s on the Monero page and not ZEPH sitting in a wallet. A Worker filters that name's rate and status only. It does not split unpaid balance across machines. A rate is not a completed payout. This page does not estimate profit and does not reuse the other connection table on the help page to compare income. Read amounts as the ZEPH the pool displays. Internal conversion is omitted.",
          "이 페이지의 속도는 Zephyr 풀이 보고한 값입니다. Monero 페이지의 H/s도, 지갑 안의 ZEPH도 아닙니다. Worker는 그 이름의 속도와 상태만 거르며 미지급을 기기별로 나누지 않습니다. 속도가 있어도 지급이 끝난 것은 아닙니다. 이 페이지는 수익을 추정하지 않고, 도움말 표의 다른 접속으로 수입을 견주지 않습니다. 금액은 풀이 보여주는 ZEPH로 읽으며 내부 환산은 적지 않습니다.",
          "このページの速度はZephyrプールが報告した値です。MoneroページのH/sでも、ウォレット内のZEPHでもありません。Workerはその名前の速度と状態だけを絞り、未払いを機器ごとに分けません。速度があっても支払完了ではありません。このページは利益を見積もらず、ヘルプ表の別の接続で収入を比べません。金額はプールが表示するZEPHとして読み、内部換算は書きません。",
        ],
      ],
      [
        [
          "余额、已支付和滚动 24 小时怎么读？",
          "餘額、已支付和滾動 24 小時怎麼讀？",
          "How do I read balance, paid, and the rolling 24 hours?",
          "잔액, 지급완료, 최근 24시간은 어떻게 읽나요?",
          "残高、支払済み、直近24時間はどう読みますか？",
        ],
        [
          "未支付余额、累计已支付、近 24 小时是三笔独立的矿池账。近 24 小时不是 UTC 零点，也不是 Monero 监控里的 UTC 自然日。不要和 XMR 的未支付相加，也不要和链上余额相加。横线是缺失。统计接口能够打开，只说明当时有响应，不能当成你的账户历史已经完整保存。",
          "未支付餘額、累計已支付、近 24 小時是三筆獨立的礦池帳。近 24 小時不是 UTC 零點，也不是 Monero 監控裡的 UTC 自然日。不要和 XMR 的未支付相加，也不要和鏈上餘額相加。橫線是缺失。統計介面能夠打開，只說明當時有回應，不能當成你的帳戶歷史已經完整儲存。",
          "Unpaid balance, total paid, and the last 24 hours are three separate pool figures. Those 24 hours are not UTC midnight and not the UTC calendar day used on the Monero monitor. Do not add them to unpaid XMR or to an on-chain balance. A dash is missing data. An open stats endpoint only means it responded then. It does not mean your account history was stored in full.",
          "미지급 잔액, 누적 지급, 최근 24시간은 서로 다른 풀 장부입니다. 그 24시간은 UTC 자정도 아니고, Monero 모니터의 UTC 달력일도 아닙니다. XMR 미지급이나 체인 잔액과 더하지 마세요. 가로줄은 빠진 값입니다. 통계 주소가 열린 것은 그때 응답했다는 뜻이며, 계정 이력이 모두 저장됐다는 뜻은 아닙니다.",
          "未払い残高、累計支払、直近24時間は別々のプール帳です。その24時間はUTC零時でも、Monero監視のUTC暦日でもありません。XMRの未払いやチェーン残高と足さないでください。横線は欠損です。統計URLが開くのはそのとき応答したという意味で、口座履歴がすべて保存されたという意味ではありません。",
        ],
      ],
      [
        [
          "多个 ZEPHYR 地址怎么入库，和 XMR 名额相通吗？",
          "多個 ZEPHYR 地址怎麼入庫，和 XMR 名額相通嗎？",
          "How do I save ZEPHYR addresses, and do they share the XMR quota?",
          "ZEPHYR 주소는 어떻게 저장하며 XMR 한도와 같나요?",
          "ZEPHYRアドレスの保存はXMRの枠と共通ですか？",
        ],
        [
          "登录 [Zephyr 监控](/projects/zeph)，每行一个 ZEPHYR 地址，是 Zephyr 项目里的一个账户。免费每个项目 5 个，Pro 50 个，和 Monero 项目的名额分开计算。多个 Worker 不另收费，也不按机器加名额。设备总览没有额外总数上限。总览、Mac Agent 和崩溃解读不占 ZEPH 名额。移除只解除这个地址的保存，不会停止矿机，也不会删除 Kryptex 里的 XMR 账户。读取失败可能留下上次成功的数和原获取时间，并标成过期。异常时分别打开 zeph.2miners.com 和 Monero 页面，不要把两边的时间当成同一次支付。",
          "登入 [Zephyr 監控](/projects/zeph)，每行一個 ZEPHYR 地址，是 Zephyr 專案裡的一個帳戶。免費每個專案 5 個，Pro 50 個，和 Monero 專案的名額分開計算。多個 Worker 不另收費，也不按機器加名額。設備總覽沒有額外總數上限。總覽、Mac Agent 和崩潰解讀不占 ZEPH 名額。移除只解除這個地址的儲存，不會停止礦機，也不會刪除 Kryptex 裡的 XMR 帳戶。讀取失敗可能留下上次成功的數和原取得時間，並標成過期。異常時分別打開 zeph.2miners.com 和 Monero 頁面，不要把兩邊的時間當成同一次支付。",
          "Sign in on the [Zephyr monitor](/projects/zeph). Each line is one ZEPHYR address and one account in the Zephyr project. Free is 5 per project and Pro is 50, counted apart from the Monero project. Workers are not an extra charge and do not add slots per machine. The device overview has no further total cap. Overview, the Mac Agent, and crash interpretation do not use ZEPH quota. Remove detaches only this saved address. It does not stop the miner and does not delete the XMR account at Kryptex. A failed read can leave the last success and its original fetch time, marked stale. When something looks wrong, open zeph.2miners.com and the Monero page separately. Do not treat the two clocks as one payout.",
          "[Zephyr 모니터](/projects/zeph)에 로그인하면 한 줄이 ZEPHYR 주소 하나, Zephyr 프로젝트의 계정 하나입니다. 프로젝트당 무료 5개, Pro 50개이며 Monero 프로젝트 한도와 따로 셉니다. Worker는 추가 요금도, 기기마다 늘어나는 한도도 아닙니다. 기기 총괄에 추가 총수 상한은 없습니다. 총괄, Mac Agent, 충돌 해석은 ZEPH 한도를 쓰지 않습니다. 제거는 이 저장된 주소만 떼며 채굴기를 멈추지 않고 Kryptex의 XMR 계정도 지우지 않습니다. 읽기 실패 시 이전 성공 값과 원래 조회 시각이 남고 오래됨으로 표시될 수 있습니다. 이상이 있으면 zeph.2miners.com과 Monero 페이지를 따로 여세요. 두 시각을 한 번의 지급으로 보지 마세요.",
          "[Zephyr監視](/projects/zeph)にログインすると、1行がZEPHYRアドレス1件で、Zephyrプロジェクトの1口座です。各プロジェクト無料5件、Proは50件で、Moneroプロジェクトの枠とは別に数えます。Workerは追加料金でも、機器ごとの枠増加でもありません。デバイス総覧に追加の総数上限はありません。総覧、Mac Agent、クラッシュ解釈はZEPH枠を使いません。削除はこの保存アドレスを外すだけです。採掘は止めず、KryptexのXMR口座も消しません。取得失敗時は前回の成功値と元の取得時刻が残り、古い表示になることがあります。異常なら zeph.2miners.com とMoneroのページを別々に開きます。二つの時刻を一回の支払とみなさないでください。",
        ],
      ],
    ],
    related: ["xmr-mining-monitor-guide", "erg-mining-monitor-guide"],
    sources: [
      { name: "2Miners · ZEPH help", url: "https://zeph.2miners.com/help" },
      { name: "Zephyr Protocol", url: "https://www.zephyrprotocol.com/" },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    ],
    keywords: [
      ["ZEPHYR 地址", "ZEPHYR 地址", "ZEPHYR address", "ZEPHYR 주소", "ZEPHYRアドレス"],
      ["Zephyr RandomX", "Zephyr RandomX", "Zephyr RandomX", "Zephyr RandomX", "Zephyr RandomX"],
      [
        "不要混用 Monero",
        "不要混用 Monero",
        "do not mix Monero",
        "Monero와 섞지 않음",
        "Moneroと混ぜない",
      ],
      ["不是 Kryptex", "不是 Kryptex", "not Kryptex", "Kryptex 아님", "Kryptexではない"],
    ],
  }),
];
export const poolMonitorGuides: Article[] = [...poolMonitorGuideList, ...btcEthwGuides];
