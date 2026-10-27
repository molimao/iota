import type { Article } from "../articles";

export const zephDepthGuides: Article[] = [
  {
    slug: "zeph-mining-monitor-guide",
    modified: "2026-10-24",
    project: "zeph",
    sources: [
      { name: "2Miners · ZEPH help", url: "https://zeph.2miners.com/help" },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
      { name: "Zephyr Protocol", url: "https://zephyrprotocol.com/" },
    ],
    related: ["zeph-standard-address-vs-integrated", "zeph-mature-rewards-payments"],
    comparisonTitle: {
      zh: "这一页上的数字分别是什么",
      "zh-TW": "這一頁上的數字分別是什麼",
      en: "What each figure on this page means",
      ko: "이 화면의 숫자가 각각 뜻하는 것",
      ja: "この画面の数字がそれぞれ意味すること",
    },
    comparison: {
      zh: {
        headers: ["你看到的", "含义", "缺了怎么办"],
        rows: [
          ["当前算力", "该标准地址在 zeph.2miners.com 普通矿池上的账户算力", "保持未知，不当作 0"],
          ["Worker", "矿池按矿机名列出的记录，不是已保存设备台数", "列表为空就按矿池返回显示"],
          [
            "未支付 / 已支付",
            "地址级余额与累计已支付，按 1 ZEPH = 1e12 支付单位换算",
            "缺整数则该项未知",
          ],
          ["近 24 小时", "滚动 24 小时收益，不是日历日，也不是承诺的打款时间", "没有该字段则未知"],
        ],
      },
      "zh-TW": {
        headers: ["你看到的", "含義", "缺了怎麼辦"],
        rows: [
          ["目前算力", "該標準地址在 zeph.2miners.com 一般礦池上的帳戶算力", "保持未知，不當作 0"],
          ["Worker", "礦池按礦機名列出的紀錄，不是已儲存設備台數", "清單為空就依礦池回傳顯示"],
          [
            "未支付 / 已支付",
            "地址級餘額與累計已支付，按 1 ZEPH = 1e12 支付單位換算",
            "缺整數則該項未知",
          ],
          ["近 24 小時", "滾動 24 小時收益，不是日曆日，也不是承諾的打款時間", "沒有該欄位則未知"],
        ],
      },
      en: {
        headers: ["What you see", "Meaning", "If it is missing"],
        rows: [
          [
            "Current hashrate",
            "Account hashrate for this standard address on the regular zeph.2miners.com pool",
            "Stays unknown, not zero",
          ],
          [
            "Workers",
            "Records the pool lists by rig name, not saved-device slots",
            "An empty list is shown as returned",
          ],
          [
            "Unpaid / paid",
            "Address-level balance and cumulative paid, using 1 ZEPH = 1e12 payment units",
            "A missing integer stays unknown",
          ],
          [
            "Last 24 hours",
            "A rolling 24-hour reward, not a calendar day and not a promised payout time",
            "No field means unknown",
          ],
        ],
      },
      ko: {
        headers: ["화면에 보이는 것", "의미", "없으면"],
        rows: [
          [
            "현재 해시레이트",
            "zeph.2miners.com 일반 풀에서 이 표준 주소의 계정 해시레이트",
            "알 수 없음으로 두고 0으로 두지 않음",
          ],
          [
            "Worker",
            "풀이 리그 이름으로 나열한 기록이며 저장된 기기 수가 아님",
            "빈 목록은 풀이 준 그대로",
          ],
          [
            "미지급 / 지급",
            "주소 단위 잔액과 누적 지급. 1 ZEPH = 1e12 지급 단위",
            "정수가 없으면 해당 항목은 알 수 없음",
          ],
          [
            "최근 24시간",
            "롤링 24시간 보상이며 달력의 하루나 약속된 지급 시각이 아님",
            "필드가 없으면 알 수 없음",
          ],
        ],
      },
      ja: {
        headers: ["画面の項目", "意味", "無いとき"],
        rows: [
          [
            "現在のハッシュレート",
            "zeph.2miners.com通常プールにおける、この標準アドレスの口座算力",
            "不明のまま。0にはしない",
          ],
          [
            "Worker",
            "プールがリグ名で並べた記録。保存済みデバイス台数ではない",
            "空の一覧はそのまま表示",
          ],
          [
            "未払い / 支払済",
            "アドレス単位の残高と累計支払。1 ZEPH = 1e12 支払い単位",
            "整数が無ければその項目は不明",
          ],
          [
            "直近24時間",
            "ローリング24時間の報酬。暦日でも、約束された支払時刻でもない",
            "項目が無ければ不明",
          ],
        ],
      },
    },
    topic: {
      zh: "监控范围",
      "zh-TW": "監控範圍",
      en: "What this monitor covers",
      ko: "모니터 범위",
      ja: "監視の範囲",
    },
    title: {
      zh: "ZEPH 矿机监控看的是哪一个矿池、哪一种地址？",
      "zh-TW": "ZEPH 礦機監控看的是哪一個礦池、哪一種地址？",
      en: "Which pool and which address does the ZEPH monitor read?",
      ko: "ZEPH 모니터는 어느 풀의 어떤 주소를 읽나요?",
      ja: "ZEPHモニターはどのプールの、どのアドレスを読みますか？",
    },
    description: {
      zh: "ZEPH 监控只读 zeph.2miners.com 普通矿池上的主网标准地址：算力、Worker、未支付、已支付和滚动 24 小时收益。不是全网余额，也不是门罗币地址。",
      "zh-TW":
        "ZEPH 監控只讀 zeph.2miners.com 一般礦池上的主網標準地址：算力、Worker、未支付、已支付與滾動 24 小時收益。不是全網餘額，也不是門羅幣地址。",
      en: "The ZEPH monitor reads a mainnet standard address on the regular zeph.2miners.com pool: hashrate, Workers, unpaid, paid, and a rolling 24-hour reward. It is not a network balance and not a Monero address.",
      ko: "ZEPH 모니터는 zeph.2miners.com 일반 풀의 메인넷 표준 주소만 읽습니다. 해시레이트, Worker, 미지급, 지급, 롤링 24시간 보상입니다. 네트워크 잔액도 모네로 주소도 아닙니다.",
      ja: "ZEPHモニターは zeph.2miners.com 通常プールのメインネット標準アドレスだけを読みます。ハッシュレート、Worker、未払い、支払済、ローリング24時間の報酬です。ネットワーク残高でもモネロのアドレスでもありません。",
    },
    summary: {
      zh: "打开 Zephyr 项目页，填入以 ZEPHYR 开头的主网标准收款地址，即可查看该地址在 2Miners 普通矿池上的算力和收益。本监控只支持这种标准地址和普通矿池账户。集成地址、子地址和 SOLO 仍是协议或矿池里的其他用法，只是这一页不读取。门罗币地址也不是这里的输入。",
      "zh-TW":
        "打開 Zephyr 專案頁，填入以 ZEPHYR 開頭的主網標準收款地址，即可查看該地址在 2Miners 一般礦池上的算力與收益。本監控只支援這種標準地址和一般礦池帳戶。整合地址、子地址和 SOLO 仍是協定或礦池裡的其他用法，只是這一頁不讀取。門羅幣地址也不是這裡的輸入。",
      en: "Open the Zephyr project and enter a mainnet standard payout address that starts with ZEPHYR. You then see that address on the regular 2Miners pool. This monitor supports only that standard address and the regular pool account. Integrated addresses, subaddresses, and SOLO remain other protocol or pool uses. This page does not read them. A Monero address is not an input here either.",
      ko: "Zephyr 프로젝트에서 ZEPHYR로 시작하는 메인넷 표준 보상 주소를 넣으면, 2Miners 일반 풀의 그 주소를 봅니다. 이 모니터는 그 표준 주소와 일반 풀 계정만 지원합니다. 통합 주소, 서브주소, SOLO는 프로토콜이나 풀의 다른 용도로 남고, 이 화면은 읽지 않습니다. 모네로 주소도 여기의 입력이 아닙니다.",
      ja: "Zephyrプロジェクトで ZEPHYR から始まるメインネット標準アドレスを入れると、2Miners通常プール上のそのアドレスを見られます。このモニターが支えるのはその標準アドレスと通常プール口座だけです。統合アドレス、サブアドレス、SOLOはプロトコルやプールの別の使い方のままで、この画面は読みません。モネロのアドレスもここの入力ではありません。",
    },
    body: {
      zh: [
        "Zephyr 项目页读的是 [zeph.2miners.com](https://zeph.2miners.com/help) 普通矿池里、一个主网标准收款地址的公开账户：当前算力、Worker 列表、未支付余额、累计已支付，以及滚动近 24 小时收益。它不是 Zephyr 全网余额，也不是 IOTA 的昨日记账。本监控只读这份普通矿池账户，不读取 SOLO 或其他矿池。",
        "矿池帮助写明 ZEPH 使用 RandomX。算法相同并不表示可以填门罗币地址。这里只接受以 ZEPHYR 开头、长度为 101 的主网标准地址。集成地址和子地址会被拒绝。地址怎么区分，见 [标准地址与集成地址](/learn/zeph-standard-address-vs-integrated)。",
        "## 字段怎么读",
        "未支付和已支付属于整个地址。多个 Worker 挖到同一地址时，收益只显示一份，不会按矿机再加总。近 24 小时是滚动窗口，不是“明天几点打款”。支付单位按 RandomX 矿池的 1 ZEPH = 1e12 换算。成熟与打款窗口的读法见 [收益与支付](/learn/zeph-mature-rewards-payments)。",
        "## 先核对这几件事",
        "- 矿机配置里的收款地址，就是你准备粘贴的那一串 ZEPHYR 标准地址，而不是交易所的备注或矿池链接。",
        "- Worker 名称只影响列表里的矿机名。它不改变地址级收益，也不自动变成一台新的已保存设备。",
        "- 免费版每个项目最多 3 台已保存设备，Pro 每个项目 100 台。在一个地址下展开多个 Worker 不会自动占掉这些名额；只有你为 Worker 单独新建已保存设备时，那些设备才计入。同一台已保存设备上再绑同一个项目，不额外占名额。",
        "## 下一步",
        "- 在 [Zephyr 项目](/projects/zeph) 粘贴标准地址并保存。",
        "- 算力与矿池自己的账户页对照。某一项没有数字就保持未知，不要当成 0。",
        "- 单个 Worker 算力为 0 时，改看 [Worker 算力为 0](/learn/zeph-worker-zero-hashrate)，不要先换地址。",
        "## 示意换算（不是真实收益）",
        "若账户返回的未支付整数是 2500000000000，按 1e12 显示为 2.5 ZEPH。这只说明单位怎么换，不是你的余额，也不是收益保证。",
        "## 边界",
        "本页不能开关矿机，不能代为提币，也不读取你电脑上的 XMRig 日志。Zephyr Protocol 官网把协议描述为超额抵押的加密资产支持稳定机制；矿池页上的 ZEPH 数字是矿池账户，不是协议储备证明。",
      ],
      "zh-TW": [
        "Zephyr 專案頁讀的是 [zeph.2miners.com](https://zeph.2miners.com/help) 一般礦池裡、一個主網標準收款地址的公開帳戶：目前算力、Worker 清單、未支付餘額、累計已支付，以及滾動近 24 小時收益。它不是 Zephyr 全網餘額，也不是 IOTA 的昨日記帳。本監控只讀這份一般礦池帳戶，不讀取 SOLO 或其他礦池。",
        "礦池幫助寫明 ZEPH 使用 RandomX。演算法相同並不表示可以填門羅幣地址。這裡只接受以 ZEPHYR 開頭、長度為 101 的主網標準地址。整合地址與子地址會被拒絕。地址怎麼區分，見 [標準地址與整合地址](/learn/zeph-standard-address-vs-integrated)。",
        "## 欄位怎麼讀",
        "未支付與已支付屬於整個地址。多個 Worker 挖到同一地址時，收益只顯示一份，不會按礦機再加總。近 24 小時是滾動窗口，不是「明天幾點打款」。支付單位按 RandomX 礦池的 1 ZEPH = 1e12 換算。成熟與打款窗口的讀法見 [收益與支付](/learn/zeph-mature-rewards-payments)。",
        "## 先核對這幾件事",
        "- 礦機設定裡的收款地址，就是你準備貼上的那一串 ZEPHYR 標準地址，而不是交易所的備註或礦池連結。",
        "- Worker 名稱只影響清單裡的礦機名。它不改變地址級收益，也不自動變成一台新的已儲存設備。",
        "- 免費版每個專案最多 3 台已儲存設備，Pro 每個專案 100 台。在一個地址下展開多個 Worker 不會自動佔掉這些名額；只有你為 Worker 單獨新建已儲存設備時，那些設備才計入。同一台已儲存設備上再綁同一個專案，不額外佔名額。",
        "## 下一步",
        "- 在 [Zephyr 專案](/projects/zeph) 貼上標準地址並儲存。",
        "- 算力與礦池自己的帳戶頁對照。某一項沒有數字就保持未知，不要當成 0。",
        "- 單個 Worker 算力為 0 時，改看 [Worker 算力為 0](/learn/zeph-worker-zero-hashrate)，不要先換地址。",
        "## 示意換算（不是真實收益）",
        "若帳戶回傳的未支付整數是 2500000000000，按 1e12 顯示為 2.5 ZEPH。這只說明單位怎麼換，不是你的餘額，也不是收益保證。",
        "## 邊界",
        "本頁不能開關礦機，不能代為提幣，也不讀取你電腦上的 XMRig 日誌。Zephyr Protocol 官網把協議描述為超額抵押的加密資產支持穩定機制；礦池頁上的 ZEPH 數字是礦池帳戶，不是協議儲備證明。",
      ],
      en: [
        "The Zephyr project reads one public account on the regular [zeph.2miners.com](https://zeph.2miners.com/help) pool: current hashrate, the Worker list, unpaid balance, cumulative paid, and a rolling 24-hour reward. It is not a Zephyr network balance and not IOTA’s previous-day ledger. This monitor reads only this regular pool account. It does not read SOLO or another pool.",
        "The pool help page says ZEPH is mined with RandomX. Sharing an algorithm does not make a Monero address valid here. Only a mainnet standard address that starts with ZEPHYR and is 101 characters long is accepted. Integrated addresses and subaddresses are rejected. See [standard vs integrated](/learn/zeph-standard-address-vs-integrated).",
        "## How to read the fields",
        "Unpaid and paid belong to the whole address. When several Workers mine to that address, the reward is shown once and is not added again per rig. The 24-hour figure is a rolling window, not a clock time for the next payout. Amounts use the RandomX pool unit of 1 ZEPH = 1e12. How maturity and payout timing appear is in [rewards and payments](/learn/zeph-mature-rewards-payments).",
        "## Check these first",
        "- The payout string in the miner is the ZEPHYR standard address you are about to paste, not an exchange memo and not a pool URL.",
        "- A Worker name only labels a row. It does not change the address-level reward and it does not by itself create another saved device.",
        "- Free keeps up to three saved devices per project, and Pro up to fifty per project. Listing Workers under one address does not use those slots. A slot is used only if you explicitly save a separate device for a Worker. Extra bindings of Zephyr on the same saved device do not add slots.",
        "## What to do next",
        "- Paste the standard address on the [Zephyr project](/projects/zeph) and save it.",
        "- Compare hashrate with the pool’s own account page. A blank figure stays unknown; do not treat it as zero.",
        "- If one Worker shows 0, open [Worker hashrate at zero](/learn/zeph-worker-zero-hashrate) before changing the address.",
        "## Illustrative unit (not actual income)",
        "If the account returned an unpaid integer of 2500000000000, dividing by 1e12 would display 2.5 ZEPH. That only shows the unit. It is not your balance and not a promised return.",
        "## Limits",
        "This page cannot start or stop a rig, cannot withdraw, and cannot read the XMRig log on your computer. Zephyr Protocol describes an over-collateralized, crypto-backed stability design; the ZEPH figures here are the pool account, not a reserve attestation.",
      ],
      ko: [
        "Zephyr 프로젝트는 [zeph.2miners.com](https://zeph.2miners.com/help) 일반 풀의 공개 계정 하나를 읽습니다. 현재 해시레이트, Worker 목록, 미지급 잔액, 누적 지급, 롤링 24시간 보상입니다. Zephyr 네트워크 전체 잔액도, IOTA의 어제 장부도 아닙니다. 이 모니터는 이 일반 풀 계정만 읽고, SOLO나 다른 풀은 읽지 않습니다.",
        "풀 도움말은 ZEPH를 RandomX로 채굴한다고 적습니다. 알고리즘이 같다고 모네로 주소를 넣을 수 있는 것은 아닙니다. ZEPHYR로 시작하고 길이가 101인 메인넷 표준 주소만 받습니다. 통합 주소와 서브주소는 거부됩니다. 구분은 [표준 주소와 통합 주소](/learn/zeph-standard-address-vs-integrated)를 보세요.",
        "## 필드를 읽는 법",
        "미지급과 지급은 주소 전체의 것입니다. 여러 Worker가 같은 주소로 채굴해도 보상은 한 번만 보이고 리그마다 다시 더하지 않습니다. 24시간은 롤링 구간이지, 다음 지급 시각이 아닙니다. 금액은 RandomX 풀의 1 ZEPH = 1e12 단위입니다. 성숙과 지급 구간은 [보상과 지급](/learn/zeph-mature-rewards-payments)에 있습니다.",
        "## 먼저 확인할 것",
        "- 채굴기 설정의 보상 문자열이 붙여 넣을 ZEPHYR 표준 주소인지 확인하세요. 거래소 메모나 풀 URL이 아닙니다.",
        "- Worker 이름은 행의 이름만 바꿉니다. 주소 단위 보상을 바꾸지 않고, 그 자체로 새 저장 기기가 되지도 않습니다.",
        "- 무료는 프로젝트당 저장된 기기 3대, Pro는 프로젝트당 100대입니다. 한 주소 아래에서 Worker를 펼쳐 보는 것은 이 자리를 쓰지 않습니다. Worker마다 저장 기기를 새로 만들 때만 자리가 줄어듭니다. 같은 저장 기기에 Zephyr를 다시 묶어도 자리는 늘지 않습니다.",
        "## 다음 단계",
        "- [Zephyr 프로젝트](/projects/zeph)에 표준 주소를 붙여 저장합니다.",
        "- 해시레이트를 풀 자신의 계정 페이지와 비교합니다. 빈 값은 알 수 없음이며 0으로 보지 않습니다.",
        "- Worker 하나가 0이면 주소를 바꾸기 전에 [Worker 해시레이트 0](/learn/zeph-worker-zero-hashrate)을 봅니다.",
        "## 단위 예시(실제 수익 아님)",
        "계정 미지급 정수가 2500000000000이면 1e12로 나누어 2.5 ZEPH로 보입니다. 단위 설명일 뿐이며 내 잔액도, 보장 수익도 아닙니다.",
        "## 한계",
        "이 화면은 채굴기를 켜거나 끄지 못하고, 출금하지 못하며, 컴퓨터의 XMRig 로그를 읽지 않습니다. Zephyr Protocol은 초과 담보 암호화 자산 기반의 안정 구조를 설명합니다. 여기의 ZEPH 숫자는 풀 계정이지 준비금 증명이 아닙니다.",
      ],
      ja: [
        "Zephyrプロジェクトは [zeph.2miners.com](https://zeph.2miners.com/help) 通常プールの公開口座を一つ読みます。現在のハッシュレート、Worker一覧、未払い残高、累計支払、ローリング24時間の報酬です。Zephyrのネットワーク全体の残高でも、IOTAの前日台帳でもありません。このモニターは通常プールのこの口座だけを読み、SOLOや他のプールは読みません。",
        "プールのヘルプは ZEPH を RandomX で掘ると書いています。アルゴリズムが同じでもモネロのアドレスは使えません。ZEPHYR で始まり長さ 101 のメインネット標準アドレスだけを受け付けます。統合アドレスとサブアドレスは拒否されます。区別は [標準アドレスと統合アドレス](/learn/zeph-standard-address-vs-integrated) を見てください。",
        "## 項目の読み方",
        "未払いと支払済はアドレス全体のものです。複数の Worker が同じアドレスへ掘っても、報酬は一度だけ表示され、リグごとに足し直しません。24時間はローリング窓であり、次回支払の時刻ではありません。金額は RandomX プールの 1 ZEPH = 1e12 です。成熟と支払の見え方は [報酬と支払い](/learn/zeph-mature-rewards-payments) にあります。",
        "## 先に確認すること",
        "- マイナー設定の支払文字列が、貼ろうとしている ZEPHYR 標準アドレスであること。取引所のメモやプールの URL ではありません。",
        "- Worker 名は行の名前だけを変えます。アドレス単位の報酬は変わらず、それだけでは新しい保存デバイスにもなりません。",
        "- 無料はプロジェクトあたり保存デバイス 3 台、Pro は 100 台です。一つのアドレスの下に Worker を並べても、その枠は減りません。Worker ごとに保存デバイスを新しく作ったときだけ数えます。同じ保存デバイスに Zephyr を重ねて結んでも枠は増えません。",
        "## 次にすること",
        "- [Zephyrプロジェクト](/projects/zeph) に標準アドレスを貼って保存します。",
        "- ハッシュレートをプール自身の口座ページと照合します。空欄は不明のままで、0 とは扱いません。",
        "- Worker の一つが 0 なら、アドレスを変える前に [Workerのハッシュレートが0](/learn/zeph-worker-zero-hashrate) を開きます。",
        "## 単位の例（実際の収益ではない）",
        "口座の未払い整数が 2500000000000 なら、1e12 で割って 2.5 ZEPH と表示されます。単位の説明であり、あなたの残高でも、保証された収益でもありません。",
        "## 限界",
        "この画面はリグの開始・停止も、出金も、パソコン上の XMRig ログの読取もできません。Zephyr Protocol は超過担保の暗号資産による安定の仕組みを説明しています。ここにある ZEPH の数字はプール口座であり、準備金の証明ではありません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "为什么不能填门罗币地址？",
          answer:
            "两边都可以用 RandomX，但地址不是同一条链。本页只接受 ZEPHYR 开头的 Zephyr 主网标准地址。",
        },
        {
          question: "多个 Worker 会占掉多台设备名额吗？",
          answer:
            "只是在一个地址下显示 Worker，不会自动占用名额。你若为每个 Worker 单独新建已保存设备，那些设备才计入每项目 3 台（Pro 100 台）。",
        },
        {
          question: "收益会按 Worker 各算一份吗？",
          answer:
            "不会。未支付、已支付和近 24 小时都属于这个地址，同一地址不会把同一笔钱包收益加多次。",
        },
        {
          question: "没有余额是不是表示赚了 0？",
          answer: "不是。缺少数值时保持未知，不显示成 0，也不换算成美元。",
        },
        {
          question: "这里能看到其他矿池或 SOLO 吗？",
          answer:
            "本监控只读 zeph.2miners.com 的普通矿池账户。集成地址、子地址和 SOLO 仍是协议或矿池里的其他用法，只是这一页不读取。",
        },
        {
          question: "最低打款额是多少？",
          answer:
            "本监控不写死最低额。以矿池当时页面为准。这里显示的是账户上的未支付与已支付，不是打款倒计时。",
        },
      ],
      "zh-TW": [
        {
          question: "為什麼不能填門羅幣地址？",
          answer:
            "兩邊都可以用 RandomX，但地址不是同一條鏈。本頁只接受 ZEPHYR 開頭的 Zephyr 主網標準地址。",
        },
        {
          question: "多個 Worker 會佔掉多台設備名額嗎？",
          answer:
            "只是在一個地址下顯示 Worker，不會自動佔用名額。你若為每個 Worker 單獨新建已儲存設備，那些設備才計入每專案 3 台（Pro 100 台）。",
        },
        {
          question: "收益會按 Worker 各算一份嗎？",
          answer:
            "不會。未支付、已支付與近 24 小時都屬於這個地址，同一地址不會把同一筆錢包收益加多次。",
        },
        {
          question: "沒有餘額是不是表示賺了 0？",
          answer: "不是。缺少數值時保持未知，不顯示成 0，也不換算成美元。",
        },
        {
          question: "這裡能看到其他礦池或 SOLO 嗎？",
          answer:
            "本監控只讀 zeph.2miners.com 的一般礦池帳戶。整合地址、子地址和 SOLO 仍是協定或礦池裡的其他用法，只是這一頁不讀取。",
        },
        {
          question: "最低打款額是多少？",
          answer:
            "本監控不寫死最低額。以礦池當時頁面為準。這裡顯示的是帳戶上的未支付與已支付，不是打款倒數。",
        },
      ],
      en: [
        {
          question: "Why is a Monero address rejected?",
          answer:
            "Both can use RandomX, but the addresses are not the same chain. This page accepts only a Zephyr mainnet standard address starting with ZEPHYR.",
        },
        {
          question: "Do several Workers use several device slots?",
          answer:
            "Showing Workers under one address does not use slots. Slots are used only when you save a separate device per Worker. The cap is three saved devices per project on Free, or fifty on Pro.",
        },
        {
          question: "Is the reward counted once per Worker?",
          answer:
            "No. Unpaid, paid, and the rolling 24-hour figure belong to the address. The same wallet total is not added again for each Worker.",
        },
        {
          question: "Does a missing balance mean I earned zero?",
          answer:
            "No. A missing amount stays unknown. It is not shown as zero and it is not converted to US dollars.",
        },
        {
          question: "Can I see another pool or SOLO here?",
          answer:
            "This monitor reads only the regular zeph.2miners.com account. Integrated addresses, subaddresses, and SOLO remain other protocol or pool uses. This page does not read them.",
        },
        {
          question: "What is the minimum payout?",
          answer:
            "This monitor does not store a fixed minimum. Use the amount published on the pool at the time. The page shows unpaid and paid on the account, not a payout countdown.",
        },
      ],
      ko: [
        {
          question: "모네로 주소는 왜 거부되나요?",
          answer:
            "둘 다 RandomX를 쓸 수 있지만 주소는 같은 체인이 아닙니다. 이 화면은 ZEPHYR로 시작하는 Zephyr 메인넷 표준 주소만 받습니다.",
        },
        {
          question: "Worker가 여러 개면 기기 자리도 여러 개인가요?",
          answer:
            "한 주소 아래에서 Worker를 보여주는 것만으로는 자리를 쓰지 않습니다. Worker마다 저장 기기를 따로 만들 때만 셉니다. 무료는 프로젝트당 3대, Pro는 100대입니다.",
        },
        {
          question: "보상은 Worker마다 한 번씩 더해지나요?",
          answer:
            "아닙니다. 미지급, 지급, 롤링 24시간은 주소의 것입니다. 같은 지갑 합계를 Worker마다 다시 더하지 않습니다.",
        },
        {
          question: "잔액이 없으면 0을 번 것인가요?",
          answer:
            "아닙니다. 없는 금액은 알 수 없음입니다. 0으로 보이지 않고 달러로 바꾸지도 않습니다.",
        },
        {
          question: "다른 풀이나 SOLO도 보이나요?",
          answer:
            "이 모니터는 zeph.2miners.com 일반 풀 계정만 읽습니다. 통합 주소, 서브주소, SOLO는 프로토콜이나 풀의 다른 용도로 남고, 이 화면은 읽지 않습니다.",
        },
        {
          question: "최소 지급액은 얼마인가요?",
          answer:
            "이 모니터는 최소액을 고정해 두지 않습니다. 그 시점의 풀 페이지를 보세요. 여기에는 계정의 미지급과 지급이 보이며 지급 카운트다운은 아닙니다.",
        },
      ],
      ja: [
        {
          question: "モネロのアドレスはなぜ拒否されますか？",
          answer:
            "どちらも RandomX を使えますが、アドレスは同じチェーンではありません。この画面は ZEPHYR で始まる Zephyr メインネット標準アドレスだけを受け付けます。",
        },
        {
          question: "Worker が複数あるとデバイス枠も複数使いますか？",
          answer:
            "一つのアドレスの下に Worker を表示するだけでは枠を使いません。Worker ごとに保存デバイスを別に作ったときだけ数えます。無料はプロジェクトあたり 3 台、Pro は 100 台です。",
        },
        {
          question: "報酬は Worker ごとに足されますか？",
          answer:
            "いいえ。未払い、支払済、ローリング24時間はアドレスのものです。同じウォレット合計を Worker ごとに足し直しません。",
        },
        {
          question: "残高が無いのは 0 を稼いだという意味ですか？",
          answer: "いいえ。欠けた金額は不明のままです。0 とは表示せず、米ドルにも換えません。",
        },
        {
          question: "他のプールや SOLO も見られますか？",
          answer:
            "このモニターが読むのは zeph.2miners.com の通常プール口座だけです。統合アドレス、サブアドレス、SOLOはプロトコルやプールの別の使い方のままで、このページは読みません。",
        },
        {
          question: "最低支払額はいくらですか？",
          answer:
            "このモニターは最低額を固定していません。その時点のプールページを見てください。ここにあるのは口座の未払いと支払済であり、支払カウントダウンではありません。",
        },
      ],
    },
  },
  {
    slug: "zeph-standard-address-vs-integrated",
    published: "2026-10-24",
    modified: "2026-10-24",
    project: "zeph",
    sources: [
      { name: "2Miners · ZEPH help", url: "https://zeph.2miners.com/help" },
      { name: "Zephyr Protocol", url: "https://www.zephyrprotocol.com/" },
    ],
    related: ["zeph-mining-monitor-guide", "zeph-randomx-cpu-workers"],
    comparisonTitle: {
      zh: "哪种字符串能贴进 Zephyr 监控",
      "zh-TW": "哪種字串能貼進 Zephyr 監控",
      en: "Which string can be saved on Zephyr",
      ko: "Zephyr 모니터에 넣을 수 있는 문자열",
      ja: "Zephyrモニターに保存できる文字列",
    },
    comparison: {
      zh: {
        headers: ["你手里的字符串", "能否作为本页地址", "接下来"],
        rows: [
          ["ZEPHYR 开头、101 字符的主网标准地址", "可以", "贴到项目页"],
          ["集成地址或子地址", "不可以", "在官方钱包里改用标准地址"],
          ["4 或 8 开头的门罗币地址", "不可以", "那是另一条链的收款地址"],
          ["矿池网址、带空格或测试网地址", "不可以", "去掉链接和空格，确认主网"],
        ],
      },
      "zh-TW": {
        headers: ["你手上的字串", "能否作為本頁地址", "接下來"],
        rows: [
          ["ZEPHYR 開頭、101 字元的主網標準地址", "可以", "貼到專案頁"],
          ["整合地址或子地址", "不可以", "在官方錢包裡改用標準地址"],
          ["4 或 8 開頭的門羅幣地址", "不可以", "那是另一條鏈的收款地址"],
          ["礦池網址、含空白或測試網地址", "不可以", "去掉連結與空白，確認主網"],
        ],
      },
      en: {
        headers: ["The string you have", "Usable here", "Next step"],
        rows: [
          [
            "Mainnet standard address, ZEPHYR plus 101 characters",
            "Yes",
            "Paste it on the project page",
          ],
          [
            "Integrated address or subaddress",
            "No",
            "Switch to the standard address in the official wallet",
          ],
          ["Monero address starting with 4 or 8", "No", "That pays a different chain"],
          [
            "A pool URL, extra spaces, or a testnet address",
            "No",
            "Remove the link and spaces, and confirm mainnet",
          ],
        ],
      },
      ko: {
        headers: ["가진 문자열", "이 화면에 쓸 수 있나", "다음"],
        rows: [
          ["ZEPHYR로 시작하고 101자인 메인넷 표준 주소", "예", "프로젝트 페이지에 붙여 넣기"],
          ["통합 주소 또는 서브주소", "아니오", "공식 지갑에서 표준 주소로 바꾸기"],
          ["4 또는 8로 시작하는 모네로 주소", "아니오", "다른 체인의 보상 주소"],
          ["풀 URL, 공백, 테스트넷 주소", "아니오", "링크와 공백을 빼고 메인넷인지 확인"],
        ],
      },
      ja: {
        headers: ["手元の文字列", "この画面で使えるか", "次"],
        rows: [
          [
            "ZEPHYR で始まり 101 文字のメインネット標準アドレス",
            "使える",
            "プロジェクトページに貼る",
          ],
          [
            "統合アドレスまたはサブアドレス",
            "使えない",
            "公式ウォレットで標準アドレスに切り替える",
          ],
          ["4 または 8 で始まるモネロのアドレス", "使えない", "別チェーンの受取アドレス"],
          [
            "プールの URL、空白、テストネット",
            "使えない",
            "リンクと空白を除きメインネットか確認する",
          ],
        ],
      },
    },
    topic: {
      zh: "地址类型",
      "zh-TW": "地址類型",
      en: "Address type",
      ko: "주소 종류",
      ja: "アドレスの種類",
    },
    title: {
      zh: "ZEPH 用了 RandomX，为什么不能填门罗币地址？",
      "zh-TW": "ZEPH 用了 RandomX，為什麼不能填門羅幣地址？",
      en: "ZEPH uses RandomX. Why is a Monero address rejected?",
      ko: "ZEPH는 RandomX인데, 왜 모네로 주소는 거절되나요?",
      ja: "ZEPHはRandomXなのに、なぜモネロのアドレスは拒否されますか？",
    },
    description: {
      zh: "RandomX 是挖矿算法，不是地址格式。ZEPH 监控只保存 zeph.2miners.com 使用的 Zephyr 主网标准地址，拒绝门罗币地址、集成地址和子地址。",
      "zh-TW":
        "RandomX 是挖礦演算法，不是地址格式。ZEPH 監控只儲存 zeph.2miners.com 使用的 Zephyr 主網標準地址，拒絕門羅幣地址、整合地址與子地址。",
      en: "RandomX is the mining algorithm, not an address format. The ZEPH monitor stores only the Zephyr mainnet standard address used on zeph.2miners.com. Monero, integrated, and subaddresses are rejected.",
      ko: "RandomX는 채굴 알고리즘이지 주소 형식이 아닙니다. ZEPH 모니터는 zeph.2miners.com에서 쓰는 Zephyr 메인넷 표준 주소만 저장합니다. 모네로, 통합, 서브주소는 거부됩니다.",
      ja: "RandomXは採掘アルゴリズムであり、アドレス形式ではありません。ZEPHモニターは zeph.2miners.com で使う Zephyr メインネット標準アドレスだけを保存します。モネロ、統合、サブアドレスは拒否されます。",
    },
    summary: {
      zh: "矿池示例地址以 ZEPHYR 开头。门罗币地址、集成地址和子地址即使看起来像长串，也不能当作这台 Zephyr 设备的收款地址。",
      "zh-TW":
        "礦池示例地址以 ZEPHYR 開頭。門羅幣地址、整合地址與子地址即使看起來像長字串，也不能當作這台 Zephyr 設備的收款地址。",
      en: "The pool’s example address starts with ZEPHYR. A Monero address, an integrated address, or a subaddress can look like a long string and still cannot be the payout address for this Zephyr device.",
      ko: "풀 예시 주소는 ZEPHYR로 시작합니다. 모네로 주소, 통합 주소, 서브주소는 긴 문자열처럼 보여도 이 Zephyr 기기의 보상 주소가 될 수 없습니다.",
      ja: "プールの例は ZEPHYR から始まります。モネロのアドレス、統合アドレス、サブアドレスは長い文字列に見えても、この Zephyr デバイスの支払アドレスにはできません。",
    },
    body: {
      zh: [
        "不能填门罗币地址，是因为收款地址属于 Zephyr 主网，而不是因为算法名字不对。2Miners 的 ZEPH 帮助要求算法选 RandomX，示例钱包以 ZEPHYR 开头，并让你把该地址写进矿机的 YOUR_WALLET_ADDRESS。IOTA Watch 的 Zephyr 页与这一用法对齐：只保存主网标准地址。",
        "标准地址在这里的可见特征是：以 ZEPHYR 开头，总长 101 个字符。集成地址和子地址是 Zephyr 上的另外两种收款形式，本页明确不接受。测试网地址同样不接受。",
        "## 字段在说什么",
        "项目页上的地址是矿池账户的键。算力、Worker 和钱包收益都挂在这一个标准地址上。它不是矿机名，也不是 [Zephyr Protocol](https://www.zephyrprotocol.com/) 网站上的稳定机制说明。协议站描述的是超额抵押的稳定设计；矿池帮助描述的是去哪挖 ZEPH。两件事不要混成一个余额。",
        "## 保存前检查",
        "- 从官方钱包或你确认可用的交易所收款处复制标准地址。帮助页把官方 Zephyr 钱包和交易所（举例 MEXC）都列为取得地址的途径，但交易所是否给出标准地址，要在交易所自己的充值页核对。",
        "- 不要粘贴浏览器里的账户链接。zeph.2miners.com 开头的网址不是收款地址。",
        "- 首尾不要留空格。4 或 8 开头、长度像门罗币的字符串会直接被拒绝。",
        "## 被拒绝时怎么做",
        "- 若钱包默认给的是集成地址或子地址，改复制标准地址再贴到 [Zephyr 项目](/projects/zeph)。",
        "- 若矿机已经用标准地址在挖，监控里填同一串，不要为了“试试”改成门罗币地址。",
        "- 地址通过之后，Worker 名称的规则见 [RandomX 与 Worker](/learn/zeph-randomx-cpu-workers)。整页范围见 [监控说明](/learn/zeph-mining-monitor-guide)。",
        "## 示意（不是真实地址）",
        "ZEPHYR 后面接一长串、总长正好 101，才像本页要的标准地址。写成 4… 且大约 95 个字符的，是门罗币常见形状，本页不会把它当成 ZEPH 账户。不要把示意片段拿去挖矿。",
        "## 边界",
        "校验失败只说明这串不能当作本监控的标准地址，不能据此判断你在别的钱包里的币是否安全。本页不生成地址，也不保管种子。",
      ],
      "zh-TW": [
        "不能填門羅幣地址，是因為收款地址屬於 Zephyr 主網，而不是因為演算法名字不對。2Miners 的 ZEPH 幫助要求演算法選 RandomX，示例錢包以 ZEPHYR 開頭，並讓你把該地址寫進礦機的 YOUR_WALLET_ADDRESS。IOTA Watch 的 Zephyr 頁與這一用法對齊：只儲存主網標準地址。",
        "標準地址在這裡的可見特徵是：以 ZEPHYR 開頭，總長 101 個字元。整合地址與子地址是 Zephyr 上的另外兩種收款形式，本頁明確不接受。測試網地址同樣不接受。",
        "## 欄位在說什麼",
        "專案頁上的地址是礦池帳戶的鍵。算力、Worker 與錢包收益都掛在這一個標準地址上。它不是礦機名，也不是 [Zephyr Protocol](https://www.zephyrprotocol.com/) 網站上的穩定機制說明。協議站描述的是超額抵押的穩定設計；礦池幫助描述的是去哪挖 ZEPH。兩件事不要混成一個餘額。",
        "## 儲存前檢查",
        "- 從官方錢包或你確認可用的交易所收款處複製標準地址。幫助頁把官方 Zephyr 錢包與交易所（舉例 MEXC）都列為取得地址的途徑，但交易所是否給出標準地址，要在交易所自己的儲值頁核對。",
        "- 不要貼上瀏覽器裡的帳戶連結。zeph.2miners.com 開頭的網址不是收款地址。",
        "- 首尾不要留空白。4 或 8 開頭、長度像門羅幣的字串會直接被拒絕。",
        "## 被拒絕時怎麼做",
        "- 若錢包預設給的是整合地址或子地址，改複製標準地址再貼到 [Zephyr 專案](/projects/zeph)。",
        "- 若礦機已經用標準地址在挖，監控裡填同一串，不要為了「試試」改成門羅幣地址。",
        "- 地址通過之後，Worker 名稱的規則見 [RandomX 與 Worker](/learn/zeph-randomx-cpu-workers)。整頁範圍見 [監控說明](/learn/zeph-mining-monitor-guide)。",
        "## 示意（不是真實地址）",
        "ZEPHYR 後面接一長串、總長正好 101，才像本頁要的標準地址。寫成 4… 且大約 95 個字元的，是門羅幣常見形狀，本頁不會把它當成 ZEPH 帳戶。不要把示意片段拿去挖礦。",
        "## 邊界",
        "校驗失敗只說明這串不能當作本監控的標準地址，不能據此判斷你在別的錢包裡的幣是否安全。本頁不產生地址，也不保管種子。",
      ],
      en: [
        "A Monero address is rejected because the payout belongs to Zephyr mainnet, not because the algorithm name is wrong. The 2Miners ZEPH help page tells you to mine with RandomX, shows a wallet that starts with ZEPHYR, and tells you to put that address in the miner as YOUR_WALLET_ADDRESS. The Zephyr page in IOTA Watch follows that use: it stores a mainnet standard address only.",
        "The visible marks of a standard address here are a ZEPHYR prefix and a length of 101 characters. Integrated addresses and subaddresses are other Zephyr payout forms, and this page refuses both. Testnet addresses are refused as well.",
        "## What the field is",
        "The address on the project page is the key of the pool account. Hashrate, Workers, and the wallet reward all hang on that one standard address. It is not a rig name, and it is not the stability write-up on [Zephyr Protocol](https://www.zephyrprotocol.com/). That site describes an over-collateralized stability design. The pool help describes where to mine ZEPH. Do not merge those into one balance.",
        "## Check before you save",
        "- Copy the standard address from the official wallet, or from an exchange deposit you have confirmed. The help page lists the official Zephyr wallet and an exchange (MEXC is the example) as ways to obtain an address. Whether the exchange actually gives a standard address has to be checked on that exchange’s deposit screen.",
        "- Do not paste the account link from the browser. A URL that starts with zeph.2miners.com is not a payout address.",
        "- Do not leave spaces at either end. A string that starts with 4 or 8 and has a Monero-like length is rejected immediately.",
        "## If it is rejected",
        "- If the wallet offered an integrated address or a subaddress, copy the standard address and paste it on the [Zephyr project](/projects/zeph).",
        "- If the rig is already mining to a standard address, enter that same string. Do not switch it to a Monero address just to test the form.",
        "- After it is accepted, Worker naming is in [RandomX and Workers](/learn/zeph-randomx-cpu-workers). The page’s overall scope is in the [monitor guide](/learn/zeph-mining-monitor-guide).",
        "## Sketch (not a real address)",
        "ZEPHYR followed by a long tail, 101 characters in total, is the shape this page wants. Something like 4… at about 95 characters is a common Monero shape and will not be treated as a ZEPH account. Do not mine to a sketch.",
        "## Limits",
        "A failed check only means this string cannot be the standard address for this monitor. It does not judge whether coins in another wallet are safe. This page does not create addresses and does not keep a seed phrase.",
      ],
      ko: [
        "모네로 주소가 거부되는 이유는 보상 주소가 Zephyr 메인넷이기 때문이지, 알고리즘 이름이 틀려서가 아닙니다. 2Miners ZEPH 도움말은 알고리즘을 RandomX로 고르고, ZEPHYR로 시작하는 지갑 예를 보여 주며, 그 주소를 채굴기의 YOUR_WALLET_ADDRESS에 넣으라고 합니다. IOTA Watch의 Zephyr 화면도 같습니다. 메인넷 표준 주소만 저장합니다.",
        "여기서 표준 주소의 눈에 보이는 특징은 ZEPHYR로 시작하고 전체 길이가 101자라는 점입니다. 통합 주소와 서브주소는 Zephyr의 다른 수령 형식이며 이 화면은 둘 다 받지 않습니다. 테스트넷 주소도 받지 않습니다.",
        "## 이 칸이 의미하는 것",
        "프로젝트 페이지의 주소는 풀 계정의 키입니다. 해시레이트, Worker, 지갑 보상이 모두 그 표준 주소 하나에 붙습니다. 리그 이름이 아니고, [Zephyr Protocol](https://www.zephyrprotocol.com/)의 안정 설계 설명도 아닙니다. 그 사이트는 초과 담보 안정 구조를 설명합니다. 풀 도움말은 ZEPH를 어디서 캐는지 설명합니다. 둘을 하나의 잔액으로 합치지 마세요.",
        "## 저장 전에 확인",
        "- 공식 지갑이나, 확인한 거래소 입금 화면에서 표준 주소를 복사하세요. 도움말은 공식 Zephyr 지갑과 거래소(예: MEXC)를 주소를 얻는 방법으로 적습니다. 거래소가 실제로 표준 주소를 주는지는 그 거래소 입금 화면에서 확인해야 합니다.",
        "- 브라우저의 계정 링크를 붙이지 마세요. zeph.2miners.com으로 시작하는 URL은 보상 주소가 아닙니다.",
        "- 앞뒤에 공백을 두지 마세요. 4 또는 8로 시작하고 모네로처럼 긴 문자열은 바로 거부됩니다.",
        "## 거부되면",
        "- 지갑이 통합 주소나 서브주소를 주면 표준 주소를 다시 복사해 [Zephyr 프로젝트](/projects/zeph)에 붙입니다.",
        "- 채굴기가 이미 표준 주소로 캐고 있다면 같은 문자열을 넣으세요. 시험하려고 모네로 주소로 바꾸지 마세요.",
        "- 통과한 뒤 Worker 이름은 [RandomX와 Worker](/learn/zeph-randomx-cpu-workers)를 보세요. 화면 전체 범위는 [모니터 안내](/learn/zeph-mining-monitor-guide)에 있습니다.",
        "## 스케치(실제 주소 아님)",
        "ZEPHYR 뒤에 긴 꼬리가 붙어 전체가 101자인 형태가 이 화면이 원하는 표준 주소입니다. 4… 이고 약 95자인 것은 모네로에서 흔한 형태이며 ZEPH 계정으로 보지 않습니다. 스케치로 채굴하지 마세요.",
        "## 한계",
        "검사 실패는 이 문자열이 이 모니터의 표준 주소가 될 수 없다는 뜻입니다. 다른 지갑의 코인이 안전한지 판단하지 않습니다. 이 화면은 주소를 만들지 않고 시드도 보관하지 않습니다.",
      ],
      ja: [
        "モネロのアドレスが拒否されるのは、受取先が Zephyr メインネットだからであり、アルゴリズム名が違うからではありません。2Miners の ZEPH ヘルプはアルゴリズムを RandomX にし、ZEPHYR で始まるウォレット例を示し、そのアドレスをマイナーの YOUR_WALLET_ADDRESS に書くよう求めています。IOTA Watch の Zephyr 画面も同じです。メインネット標準アドレスだけを保存します。",
        "ここで標準アドレスと分かる印は、ZEPHYR で始まり全体が 101 文字であることです。統合アドレスとサブアドレスは Zephyr の別の受取形式で、この画面はどちらも受け付けません。テストネットも受け付けません。",
        "## この欄が指すもの",
        "プロジェクトページのアドレスはプール口座のキーです。ハッシュレート、Worker、ウォレット報酬はすべてその標準アドレス一つに付きます。リグ名ではなく、[Zephyr Protocol](https://www.zephyrprotocol.com/) の安定設計の説明でもありません。あのサイトは超過担保の安定の仕組みを説明します。プールのヘルプは ZEPH をどこで掘るかを説明します。二つを一つの残高にまとめないでください。",
        "## 保存前の確認",
        "- 公式ウォレットか、確認済みの取引所入金画面から標準アドレスをコピーします。ヘルプは公式 Zephyr ウォレットと取引所（例は MEXC）をアドレスの入手先として挙げています。取引所が実際に標準アドレスを出すかは、その取引所の入金画面で確認します。",
        "- ブラウザの口座リンクは貼らないでください。zeph.2miners.com で始まる URL は受取アドレスではありません。",
        "- 前後に空白を残さないでください。4 または 8 で始まりモネロのような長さの文字列はすぐ拒否されます。",
        "## 拒否されたとき",
        "- ウォレットが統合アドレスやサブアドレスを出したら、標準アドレスをコピーし直して [Zephyrプロジェクト](/projects/zeph) に貼ります。",
        "- リグがすでに標準アドレスへ掘っているなら、同じ文字列を入れます。試すためにモネロのアドレスへ変えないでください。",
        "- 通ったあとの Worker 名は [RandomXとWorker](/learn/zeph-randomx-cpu-workers) です。画面全体の範囲は [モニター説明](/learn/zeph-mining-monitor-guide) にあります。",
        "## 見取り図（本物のアドレスではない）",
        "ZEPHYR の後ろに長い続きがあり、合計 101 文字である形が、この画面の標準アドレスです。4… でおよそ 95 文字のものはモネロでありがちな形で、ZEPH 口座としては扱いません。見取り図では掘らないでください。",
        "## 限界",
        "検査に失敗したのは、この文字列がこのモニターの標準アドレスになれないという意味だけです。別ウォレットのコインが安全かは判断しません。この画面はアドレスを作らず、シードも預かりません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "集成地址和标准地址有什么差别？",
          answer:
            "都可能是 Zephyr 的收款形式，但本监控只保存主网标准地址。集成地址和子地址需要你在钱包里换成标准地址后再贴。",
        },
        {
          question: "交易所充值地址能用吗？",
          answer:
            "矿池帮助允许用交易所生成地址，并举了 MEXC。能否被本页接受，取决于它是不是 ZEPHYR 标准地址，而不是交易所名字。",
        },
        {
          question: "地址被拒绝会不会把已有收益清零？",
          answer: "不会。拒绝只发生在保存之前。已经保存的标准地址仍按矿池账户显示，缺数保持未知。",
        },
      ],
      "zh-TW": [
        {
          question: "整合地址和標準地址有什麼差別？",
          answer:
            "都可能是 Zephyr 的收款形式，但本監控只儲存主網標準地址。整合地址和子地址需要你在錢包裡換成標準地址後再貼。",
        },
        {
          question: "交易所儲值地址能用嗎？",
          answer:
            "礦池幫助允許用交易所產生地址，並舉了 MEXC。能否被本頁接受，取決於它是不是 ZEPHYR 標準地址，而不是交易所名字。",
        },
        {
          question: "地址被拒絕會不會把已有收益清零？",
          answer: "不會。拒絕只發生在儲存之前。已經儲存的標準地址仍按礦池帳戶顯示，缺數保持未知。",
        },
      ],
      en: [
        {
          question: "How is an integrated address different from a standard address?",
          answer:
            "Both can be Zephyr payout forms, but this monitor stores only a mainnet standard address. Copy the standard address from the wallet before pasting an integrated address or a subaddress.",
        },
        {
          question: "Can I use an exchange deposit address?",
          answer:
            "The pool help allows an address from an exchange and names MEXC as an example. This page accepts it only when it is a ZEPHYR standard address, not because of the exchange name.",
        },
        {
          question: "Does a rejection wipe rewards I already have?",
          answer:
            "No. Rejection happens before save. A standard address that is already saved still shows the pool account, and missing amounts stay unknown.",
        },
      ],
      ko: [
        {
          question: "통합 주소와 표준 주소는 어떻게 다른가요?",
          answer:
            "둘 다 Zephyr 수령 형식일 수 있지만, 이 모니터는 메인넷 표준 주소만 저장합니다. 통합 주소나 서브주소는 지갑에서 표준 주소로 바꾼 뒤 붙이세요.",
        },
        {
          question: "거래소 입금 주소를 써도 되나요?",
          answer:
            "풀 도움말은 거래소에서 만든 주소를 허용하고 MEXC를 예로 듭니다. 이 화면이 받는 기준은 ZEPHYR 표준 주소인지이며, 거래소 이름이 아닙니다.",
        },
        {
          question: "거부되면 이미 있는 보상이 0이 되나요?",
          answer:
            "아닙니다. 거부는 저장 전에만 일어납니다. 이미 저장된 표준 주소는 풀 계정 그대로 보이고, 없는 값은 알 수 없음으로 남습니다.",
        },
      ],
      ja: [
        {
          question: "統合アドレスと標準アドレスの違いは何ですか？",
          answer:
            "どちらも Zephyr の受取形式になり得ますが、このモニターはメインネット標準アドレスだけを保存します。統合アドレスやサブアドレスは、ウォレットで標準アドレスに変えてから貼ってください。",
        },
        {
          question: "取引所の入金アドレスは使えますか？",
          answer:
            "プールのヘルプは取引所で作ったアドレスを認め、例として MEXC を挙げています。この画面が受け付けるかは ZEPHYR 標準アドレスかどうかであり、取引所の名前ではありません。",
        },
        {
          question: "拒否されると、すでにある報酬は 0 になりますか？",
          answer:
            "なりません。拒否は保存前だけです。すでに保存した標準アドレスはプール口座のまま表示され、欠けた金額は不明のままです。",
        },
      ],
    },
  },
  {
    slug: "zeph-randomx-cpu-workers",
    published: "2026-10-24",
    modified: "2026-10-24",
    project: "zeph",
    sources: [
      { name: "2Miners · ZEPH help", url: "https://zeph.2miners.com/help" },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    ],
    related: ["zeph-worker-zero-hashrate", "zeph-standard-address-vs-integrated"],
    comparisonTitle: {
      zh: "矿机名、份额难度和账户算力",
      "zh-TW": "礦機名、份額難度與帳戶算力",
      en: "Rig name, share difficulty, and account hashrate",
      ko: "리그 이름, 셰어 난이도, 계정 해시레이트",
      ja: "リグ名、シェア難度、口座のハッシュレート",
    },
    comparison: {
      zh: {
        headers: ["矿池帮助里的设置", "它改变什么", "它不改变什么"],
        rows: [
          ["算法 RandomX，软件示例为 XMRig", "矿机如何向 ZEPH 池提交工作", "不能把地址换成门罗币"],
          ["YOUR_WALLET_ADDRESS.RIG_ID", "统计页上的 Worker 名", "地址级未支付和已支付"],
          ["较低或较高份额难度", "提交份额的难度档", "矿池写明份额难度不影响矿工收益"],
          ["账户当前算力与每个 Worker 的 hr", "你在监控里看到的算力", "已保存设备的台数"],
        ],
      },
      "zh-TW": {
        headers: ["礦池幫助裡的設定", "它改變什麼", "它不改變什麼"],
        rows: [
          [
            "演算法 RandomX，軟體示例為 XMRig",
            "礦機如何向 ZEPH 池提交工作",
            "不能把地址換成門羅幣",
          ],
          ["YOUR_WALLET_ADDRESS.RIG_ID", "統計頁上的 Worker 名", "地址級未支付與已支付"],
          ["較低或較高份額難度", "提交份額的難度檔", "礦池寫明份額難度不影響礦工收益"],
          ["帳戶目前算力與每個 Worker 的 hr", "你在監控裡看到的算力", "已儲存設備的台數"],
        ],
      },
      en: {
        headers: ["Setting in the pool help", "What it changes", "What it does not change"],
        rows: [
          [
            "Algorithm RandomX; XMRig is the example",
            "How the rig submits work to the ZEPH pool",
            "You still cannot swap in a Monero address",
          ],
          [
            "YOUR_WALLET_ADDRESS.RIG_ID",
            "The Worker name on the statistics page",
            "Address-level unpaid and paid",
          ],
          [
            "Lower or higher share difficulty",
            "The difficulty tier of submitted shares",
            "The pool says share difficulty does not change miner rewards",
          ],
          [
            "Account hashrate and each Worker hr",
            "The rates you see in the monitor",
            "How many saved devices you have",
          ],
        ],
      },
      ko: {
        headers: ["풀 도움말의 설정", "바뀌는 것", "바뀌지 않는 것"],
        rows: [
          [
            "알고리즘 RandomX, 소프트웨어 예는 XMRig",
            "리그가 ZEPH 풀에 작업을 내는 방식",
            "모네로 주소로 바꿀 수 없음",
          ],
          ["YOUR_WALLET_ADDRESS.RIG_ID", "통계 페이지의 Worker 이름", "주소 단위 미지급과 지급"],
          [
            "낮은 또는 높은 셰어 난이도",
            "제출 셰어의 난이도 구간",
            "풀은 셰어 난이도가 채굴 보상을 바꾸지 않는다고 적음",
          ],
          ["계정 현재 해시레이트와 Worker별 hr", "모니터에 보이는 해시레이트", "저장된 기기 수"],
        ],
      },
      ja: {
        headers: ["プールヘルプの設定", "変わるもの", "変わらないもの"],
        rows: [
          [
            "アルゴリズム RandomX。ソフト例は XMRig",
            "リグが ZEPH プールへ仕事を出す方法",
            "モネロのアドレスには替えられない",
          ],
          ["YOUR_WALLET_ADDRESS.RIG_ID", "統計ページの Worker 名", "アドレス単位の未払いと支払済"],
          [
            "低めまたは高めのシェア難度",
            "提出シェアの難度帯",
            "プールはシェア難度が報酬を変えないと書いている",
          ],
          ["口座の現在算力と各 Worker の hr", "モニターに出る算力", "保存デバイスの台数"],
        ],
      },
    },
    topic: {
      zh: "Worker 与算法",
      "zh-TW": "Worker 與演算法",
      en: "Workers and the algorithm",
      ko: "Worker와 알고리즘",
      ja: "Workerとアルゴリズム",
    },
    title: {
      zh: "ZEPH 的 RandomX Worker 名称从哪里来？",
      "zh-TW": "ZEPH 的 RandomX Worker 名稱從哪裡來？",
      en: "Where does a ZEPH RandomX Worker name come from?",
      ko: "ZEPH RandomX Worker 이름은 어디서 오나요?",
      ja: "ZEPHのRandomX Worker名はどこから来ますか？",
    },
    description: {
      zh: "2Miners 让 ZEPH 使用 RandomX。不同的矿机名用来辨认 Worker，名称也可以留空。份额难度不改变收益。监控里的 Worker 数不是已保存设备台数。",
      "zh-TW":
        "2Miners 讓 ZEPH 使用 RandomX。不同的礦機名用來辨認 Worker，名稱也可以留空。份額難度不改變收益。監控裡的 Worker 數不是已儲存設備台數。",
      en: "2Miners mines ZEPH with RandomX. Distinct rig names identify Workers, and a name may be left empty. Share difficulty does not change the reward. The Worker count in the monitor is not your saved-device count.",
      ko: "2Miners는 ZEPH를 RandomX로 캡니다. 서로 다른 리그 이름이 Worker를 구분하고, 이름은 비워 둘 수도 있습니다. 셰어 난이도는 보상을 바꾸지 않습니다. 모니터의 Worker 수는 저장된 기기 수가 아닙니다.",
      ja: "2Minersは ZEPH を RandomX で掘ります。異なるリグ名が Worker を見分け、名前は空でもかまいません。シェア難度は報酬を変えません。モニターの Worker 数は保存デバイス台数ではありません。",
    },
    summary: {
      zh: "不同的矿机名用来辨认 Worker。名称最长 32 个字符，只能用英文字母、数字、减号和下划线。矿机名可以留空，未命名的记录仍可能出现；写上互不相同的名字，列表才分得开。",
      "zh-TW":
        "不同的礦機名用來辨認 Worker。名稱最長 32 個字元，只能用英文字母、數字、減號與底線。礦機名可以留空，未命名的紀錄仍可能出現；寫上互不相同的名字，清單才分得開。",
      en: "Distinct rig names identify Workers. A name is at most 32 characters: English letters, digits, hyphen, and underscore. The rig name may be empty, and an unnamed record can still appear. Different names are what separate the machines on the list.",
      ko: "서로 다른 리그 이름이 Worker를 구분합니다. 이름은 최대 32자이며 영문, 숫자, 하이픈, 밑줄만 됩니다. 리그 이름은 비워 둘 수 있고, 이름 없는 기록도 남을 수 있습니다. 서로 다른 이름이어야 목록에서 기계가 갈라집니다.",
      ja: "異なるリグ名が Worker を見分けます。名前は最大 32 文字で、英字、数字、ハイフン、アンダースコアだけです。リグ名は空でもよく、名前の無い記録が残ることもあります。違う名前があって、一覧の機械が分かれます。",
    },
    body: {
      zh: [
        "Worker 名称来自矿机连接矿池时的用户名，不是来自你在 IOTA Watch 里起的设备备注。ZEPH 帮助要求算法选择 RandomX，CPU 和 GPU 都推荐 XMRig，并把用户名写成 YOUR_WALLET_ADDRESS.RIG_ID。RIG_ID 可以留空。要显示名字时，最长 32 个字符，只用英文字母、数字、减号和下划线，例如 rig-1。",
        "账户接口会返回该钱包的算力、收益和 Worker。监控把每个 Worker 的名称、算力、是否离线以及最后心跳列出来。Worker 个数是矿池给出的记录数，包含暂时没有算力的名字，不等于你家里的机器台数，也不等于已保存设备台数。",
        "## 这些选择各自影响什么",
        "帮助页提供较低和较高两档份额难度，并写明拿不准时用较低档；较高档用于 Nicehash，或矿池所称超过 500 张 GPU 的情况。同一页写明：份额难度不影响矿工收益。地区服务器以帮助页当时列出的为准，本页不替你指定某一台。",
        "## 对不上名字时检查",
        "- 矿机里点号前面必须是已保存的那枚 ZEPHYR 标准地址。点号后面才是 Worker 名。",
        "- 名字里有空格、中文或其他符号时，矿池不会按你期望的 rig-1 显示。",
        "- 多个 Worker 仍共用这一地址的未支付、已支付和滚动 24 小时收益，不会各算一份钱包收入。",
        "## 下一步",
        "- 在 [Zephyr 项目](/projects/zeph) 打开该地址，对照矿池统计页上的矿机名。",
        "- 某一行算力是 0 或离线，按 [算力为 0](/learn/zeph-worker-zero-hashrate) 区分，不要另建一台已保存设备来“刷新”。",
        "- 地址本身被拒绝时回到 [标准地址](/learn/zeph-standard-address-vs-integrated)。",
        "## 示意（不是实测算力）",
        "用户名写成 ZEPHYR…（标准地址）.rig-1 时，这个名字用来辨认那一行。矿机名留空时，仍可能留下未命名的记录。若账户当前算力有数、而 rig-1 的算力为 0，表示这个名字还在，只是这一行没有上报算力。这不是收益预测。",
        "## 边界",
        "监控不能改你矿机里的算法、端口或矿机名，也看不到 XMRig 本地日志。租赁平台是否真的连上，以矿池统计页和这里的 Worker 行为准。",
      ],
      "zh-TW": [
        "Worker 名稱來自礦機連接礦池時的使用者名稱，不是來自你在 IOTA Watch 裡起的設備備註。ZEPH 幫助要求演算法選擇 RandomX，CPU 與 GPU 都推薦 XMRig，並把使用者名稱寫成 YOUR_WALLET_ADDRESS.RIG_ID。RIG_ID 可以留空。要顯示名字時，最長 32 個字元，只用英文字母、數字、減號與底線，例如 rig-1。",
        "帳戶介面會回傳該錢包的算力、收益與 Worker。監控把每個 Worker 的名稱、算力、是否離線以及最後心跳列出來。Worker 個數是礦池給出的紀錄數，包含暫時沒有算力的名字，不等於你家裡的機器台數，也不等於已儲存設備台數。",
        "## 這些選擇各自影響什麼",
        "幫助頁提供較低與較高兩檔份額難度，並寫明拿不準時用較低檔；較高檔用於 Nicehash，或礦池所稱超過 500 張 GPU 的情況。同一頁寫明：份額難度不影響礦工收益。地區伺服器以幫助頁當時列出的為準，本頁不替你指定某一台。",
        "## 對不上名字時檢查",
        "- 礦機裡點號前面必須是已儲存的那枚 ZEPHYR 標準地址。點號後面才是 Worker 名。",
        "- 名字裡有空白、中文或其他符號時，礦池不會按你期望的 rig-1 顯示。",
        "- 多個 Worker 仍共用這一地址的未支付、已支付與滾動 24 小時收益，不會各算一份錢包收入。",
        "## 下一步",
        "- 在 [Zephyr 專案](/projects/zeph) 打開該地址，對照礦池統計頁上的礦機名。",
        "- 某一行算力是 0 或離線，按 [算力為 0](/learn/zeph-worker-zero-hashrate) 區分，不要另建一台已儲存設備來「重新整理」。",
        "- 地址本身被拒絕時回到 [標準地址](/learn/zeph-standard-address-vs-integrated)。",
        "## 示意（不是實測算力）",
        "使用者名稱寫成 ZEPHYR…（標準地址）.rig-1 時，這個名字用來辨認那一列。礦機名留空時，仍可能留下未命名的紀錄。若帳戶目前算力有數、而 rig-1 的算力為 0，表示這個名字還在，只是這一列沒有上報算力。這不是收益預測。",
        "## 邊界",
        "監控不能改你礦機裡的演算法、連接埠或礦機名，也看不到 XMRig 本機日誌。租用平台是否真的連上，以礦池統計頁和這裡的 Worker 行為準。",
      ],
      en: [
        "The Worker name comes from the username the miner uses when it connects, not from the device note you typed in IOTA Watch. The ZEPH help page says to select RandomX, recommends XMRig for CPUs and GPUs, and sets the username to YOUR_WALLET_ADDRESS.RIG_ID. RIG_ID may be left empty. When you do set a name, the maximum is 32 characters, using English letters, digits, hyphen, and underscore, for example rig-1.",
        "The account API returns that wallet’s hashrate, rewards, and Workers. The monitor lists each Worker’s name, hashrate, whether the pool marks it offline, and the last heartbeat. The Worker count is the number of records the pool returned, including names that currently have no hashrate. It is not the number of machines in your home and not the number of saved devices.",
        "## What each choice changes",
        "The help page offers a lower and a higher share difficulty. It says to use the lower one if you are unsure. It recommends the higher one for Nicehash, and for what it calls more than 500 GPUs. The same page says share difficulty does not affect miner rewards. Regional servers are whatever that help page lists at the time; this guide does not assign you a host.",
        "## If the name does not match",
        "- The text before the dot in the miner must be the ZEPHYR standard address you saved. The Worker name is only the text after the dot.",
        "- A space, Chinese character, or other symbol will not show up as the rig-1 you expected.",
        "- Several Workers still share one unpaid balance, one paid total, and one rolling 24-hour reward. They do not each receive a copy of the wallet income.",
        "## What to do next",
        "- Open the address on the [Zephyr project](/projects/zeph) and compare the rig names with the pool statistics page.",
        "- If one row is 0 or offline, use [hashrate at zero](/learn/zeph-worker-zero-hashrate). Do not create another saved device just to refresh the list.",
        "- If the address itself is rejected, go back to [standard addresses](/learn/zeph-standard-address-vs-integrated).",
        "## Sketch (not a measured rate)",
        "A username of ZEPHYR… (the standard address).rig-1 uses that name to identify the row. An empty rig name can still leave an unnamed record. If the account hashrate is present and rig-1 shows 0, the name is still there and that row is not reporting hashrate. This is not a reward forecast.",
        "## Limits",
        "The monitor cannot change the algorithm, the port, or the rig name inside your miner, and it cannot see the local XMRig log. Whether a rental service is actually connected is settled by the pool statistics page and by the Worker row here.",
      ],
      ko: [
        "Worker 이름은 채굴기가 풀에 접속할 때 쓰는 사용자 이름에서 옵니다. IOTA Watch에 적은 기기 메모가 아닙니다. ZEPH 도움말은 알고리즘을 RandomX로 고르고, CPU와 GPU 모두 XMRig를 권하며, 사용자 이름을 YOUR_WALLET_ADDRESS.RIG_ID로 쓰라고 합니다. RIG_ID는 비워 둘 수 있습니다. 이름을 넣을 때는 최대 32자이며 영문, 숫자, 하이픈, 밑줄만 됩니다. 예는 rig-1입니다.",
        "계정 API는 그 지갑의 해시레이트, 보상, Worker를 돌려줍니다. 모니터는 각 Worker의 이름, 해시레이트, 풀이 오프라인으로 표시했는지, 마지막 하트비트를 나열합니다. Worker 수는 풀이 준 기록 수이며, 지금 해시레이트가 없는 이름도 포함합니다. 집 안의 기계 수도, 저장된 기기 수도 아닙니다.",
        "## 각 선택이 바꾸는 것",
        "도움말은 낮은 셰어 난이도와 높은 셰어 난이도를 제공합니다. 모르겠으면 낮은 쪽을 쓰라고 합니다. 높은 쪽은 Nicehash와, 풀이 말하는 GPU 500장 초과에 권합니다. 같은 페이지는 셰어 난이도가 채굴 보상을 바꾸지 않는다고 적습니다. 지역 서버는 그 도움말이 그때 적은 것을 따르며, 이 글은 호스트를 지정하지 않습니다.",
        "## 이름이 안 맞을 때",
        "- 채굴기에서 점 앞은 저장한 ZEPHYR 표준 주소여야 합니다. Worker 이름은 점 뒤입니다.",
        "- 공백, 한글, 다른 기호가 있으면 기대한 rig-1로 보이지 않습니다.",
        "- Worker가 여러 개여도 미지급, 지급, 롤링 24시간 보상은 이 주소 하나를 공유합니다. 지갑 수입이 각각 복사되지 않습니다.",
        "## 다음 단계",
        "- [Zephyr 프로젝트](/projects/zeph)에서 그 주소를 열고 풀 통계의 리그 이름과 비교합니다.",
        "- 한 줄이 0이거나 오프라인이면 [해시레이트 0](/learn/zeph-worker-zero-hashrate)으로 구분합니다. 목록을 새로고치려고 저장 기기를 또 만들지 마세요.",
        "- 주소 자체가 거부되면 [표준 주소](/learn/zeph-standard-address-vs-integrated)로 돌아갑니다.",
        "## 스케치(측정된 해시레이트 아님)",
        "사용자 이름이 ZEPHYR…(표준 주소).rig-1이면 그 이름으로 행을 구분합니다. 리그 이름이 비어 있어도 이름 없는 기록이 남을 수 있습니다. 계정 해시레이트는 있는데 rig-1이 0이면, 이름은 남아 있고 그 행이 해시레이트를 올리지 않는 것입니다. 수익 예측이 아닙니다.",
        "## 한계",
        "모니터는 채굴기 안의 알고리즘, 포트, 리그 이름을 바꾸지 못하고 XMRig 로컬 로그도 보지 못합니다. 대여 서비스가 실제로 붙었는지는 풀 통계와 여기의 Worker 행으로 봅니다.",
      ],
      ja: [
        "Worker 名は、マイナーがプールへ接続するときのユーザー名から来ます。IOTA Watch に付けたデバイスのメモではありません。ZEPH のヘルプはアルゴリズムを RandomX にし、CPU と GPU の両方に XMRig を勧め、ユーザー名を YOUR_WALLET_ADDRESS.RIG_ID にするよう書いています。RIG_ID は空でも構いません。名前を付けるときは最大 32 文字で、英字、数字、ハイフン、アンダースコアだけです。例は rig-1 です。",
        "口座 API はそのウォレットのハッシュレート、報酬、Worker を返します。モニターは各 Worker の名前、ハッシュレート、プールがオフラインと印しているか、最後の心拍を並べます。Worker 数はプールが返した記録数で、今は算力のない名前も含みます。自宅の機械の台数でも、保存デバイスの台数でもありません。",
        "## それぞれの設定が変えるもの",
        "ヘルプは低めと高めのシェア難度を出しています。迷ったら低い方と書いてあります。高い方は Nicehash と、プールが言う 500 GPU 超に勧めています。同じページは、シェア難度は鉱夫の報酬に影響しないと書いています。地域サーバーはそのヘルプがその時点で載せるものに従い、この記事はホストを指定しません。",
        "## 名前が一致しないとき",
        "- マイナーでドットの前は、保存した ZEPHYR 標準アドレスでなければなりません。Worker 名はドットの後だけです。",
        "- 空白、漢字、他の記号があると、期待した rig-1 にはなりません。",
        "- Worker が複数でも、未払い、支払済、ローリング24時間は一つのアドレスで共有されます。ウォレット収入がそれぞれに複製されることはありません。",
        "## 次にすること",
        "- [Zephyrプロジェクト](/projects/zeph) でそのアドレスを開き、プール統計のリグ名と照合します。",
        "- 一行が 0 またはオフラインなら [ハッシュレート0](/learn/zeph-worker-zero-hashrate) で分けます。一覧を更新するためだけに保存デバイスを増やさないでください。",
        "- アドレス自体が拒否されたら [標準アドレス](/learn/zeph-standard-address-vs-integrated) に戻ります。",
        "## 見取り図（測定した算力ではない）",
        "ユーザー名が ZEPHYR…（標準アドレス）.rig-1 なら、その名前で行を見分けます。リグ名が空でも、名前の無い記録が残ることがあります。口座の算力はあり rig-1 が 0 なら、名前は残っていてその行が算力を出していないだけです。収益の予測ではありません。",
        "## 限界",
        "モニターはマイナー内部のアルゴリズム、ポート、リグ名を変えられず、XMRig のローカルログも見られません。レンタルサービスが本当に繋がっているかは、プール統計とここにある Worker 行で判断します。",
      ],
    },
    questions: {
      zh: [
        {
          question: "不写 RIG_ID 还可以挖吗？",
          answer:
            "可以。帮助页写明矿机名不是必填。不写名字时，统计里可能没有你期望的那一行单独名称。",
        },
        {
          question: "调高份额难度会多发 ZEPH 吗？",
          answer: "不会。矿池帮助写明份额难度不影响矿工收益。它只影响你提交的份额难度档。",
        },
        {
          question: "看到 3 个 Worker 就要占 3 台设备名额吗？",
          answer:
            "不要。它们是同一地址下的矿池记录。只有你为它们分别新建已保存设备时，才计入每项目 3 台或 Pro 100 台。",
        },
      ],
      "zh-TW": [
        {
          question: "不寫 RIG_ID 還可以挖嗎？",
          answer:
            "可以。幫助頁寫明礦機名不是必填。不寫名字時，統計裡可能沒有你期望的那一行單獨名稱。",
        },
        {
          question: "調高份額難度會多發 ZEPH 嗎？",
          answer: "不會。礦池幫助寫明份額難度不影響礦工收益。它只影響你提交的份額難度檔。",
        },
        {
          question: "看到 3 個 Worker 就要佔 3 台設備名額嗎？",
          answer:
            "不要。它們是同一地址下的礦池紀錄。只有你為它們分別新建已儲存設備時，才計入每專案 3 台或 Pro 100 台。",
        },
      ],
      en: [
        {
          question: "Can I mine without a RIG_ID?",
          answer:
            "Yes. The help page says the rig name is optional. Without a name, statistics may not show the separate label you expected.",
        },
        {
          question: "Does a higher share difficulty pay more ZEPH?",
          answer:
            "No. The pool help says share difficulty does not affect miner rewards. It only changes the difficulty tier of the shares you submit.",
        },
        {
          question: "Do three Workers use three device slots?",
          answer:
            "No. They are pool records under one address. They count toward the three saved devices per project, or fifty on Pro, only if you create a separate saved device for each.",
        },
      ],
      ko: [
        {
          question: "RIG_ID 없이 캐도 되나요?",
          answer:
            "됩니다. 도움말은 리그 이름이 필수가 아니라고 합니다. 이름이 없으면 통계에 기대한 별도 이름이 없을 수 있습니다.",
        },
        {
          question: "셰어 난이도를 높이면 ZEPH가 더 나오나요?",
          answer:
            "아닙니다. 풀 도움말은 셰어 난이도가 채굴 보상을 바꾸지 않는다고 합니다. 제출하는 셰어의 난이도 구간만 바뀝니다.",
        },
        {
          question: "Worker가 3개면 기기 자리 3개인가요?",
          answer:
            "아닙니다. 한 주소 아래의 풀 기록입니다. 각각 저장 기기를 새로 만들 때만 프로젝트당 3대, Pro는 100대에 포함됩니다.",
        },
      ],
      ja: [
        {
          question: "RIG_ID なしで掘れますか？",
          answer:
            "掘れます。ヘルプはリグ名が必須ではないと書いています。名前が無いと、統計に期待した別ラベルが出ないことがあります。",
        },
        {
          question: "シェア難度を上げると ZEPH は増えますか？",
          answer:
            "増えません。プールのヘルプは、シェア難度は鉱夫の報酬に影響しないと書いています。変わるのは提出シェアの難度帯だけです。",
        },
        {
          question: "Worker が 3 つならデバイス枠も 3 つですか？",
          answer:
            "いいえ。一つのアドレスの下にあるプール記録です。それぞれ保存デバイスを新しく作ったときだけ、プロジェクトあたり 3 台、Pro は 100 台に数えます。",
        },
      ],
    },
  },
  {
    slug: "zeph-mature-rewards-payments",
    published: "2026-10-24",
    modified: "2026-10-24",
    project: "zeph",
    sources: [
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
      { name: "2Miners · ZEPH help", url: "https://zeph.2miners.com/help" },
    ],
    related: ["zeph-mining-monitor-guide", "zeph-worker-zero-hashrate"],
    comparisonTitle: {
      zh: "三种金额不要混成打款时间",
      "zh-TW": "三種金額不要混成打款時間",
      en: "Three amounts are not a payout clock",
      ko: "세 가지 금액은 지급 시각이 아닙니다",
      ja: "三つの金額は支払時刻ではありません",
    },
    comparison: {
      zh: {
        headers: ["屏幕上的金额", "来自账户的哪一类数", "不能当成什么"],
        rows: [
          ["未支付", "地址余额，1 ZEPH = 1e12 支付单位", "下一笔打款的倒计时"],
          ["已支付", "累计已经付出的总额", "你在其他矿池或钱包里的币"],
          ["近 24 小时", "滚动 24 小时收益", "日历日收益或保底日结"],
          ["空白", "该项没有可用整数", "数字 0"],
        ],
      },
      "zh-TW": {
        headers: ["畫面上的金額", "來自帳戶的哪一類數", "不能當成什麼"],
        rows: [
          ["未支付", "地址餘額，1 ZEPH = 1e12 支付單位", "下一筆打款的倒數"],
          ["已支付", "累計已經付出的總額", "你在其他礦池或錢包裡的幣"],
          ["近 24 小時", "滾動 24 小時收益", "日曆日收益或保底日結"],
          ["空白", "該項沒有可用整數", "數字 0"],
        ],
      },
      en: {
        headers: ["Amount on screen", "Which account figure", "Do not treat it as"],
        rows: [
          [
            "Unpaid",
            "Address balance, 1 ZEPH = 1e12 payment units",
            "A countdown to the next payout",
          ],
          ["Paid", "Cumulative amount already paid out", "Coins on another pool or in a wallet"],
          [
            "Last 24 hours",
            "Rolling 24-hour reward",
            "A calendar-day total or a guaranteed daily payout",
          ],
          ["Blank", "No usable integer for that field", "The number zero"],
        ],
      },
      ko: {
        headers: ["화면의 금액", "계정의 어떤 수인지", "이렇게 보면 안 됨"],
        rows: [
          ["미지급", "주소 잔액. 1 ZEPH = 1e12 지급 단위", "다음 지급까지의 카운트다운"],
          ["지급", "이미 나간 누적 금액", "다른 풀이나 지갑 안의 코인"],
          ["최근 24시간", "롤링 24시간 보상", "달력상 하루 수익이나 보장된 일 정산"],
          ["빈칸", "그 항목에 쓸 정수가 없음", "숫자 0"],
        ],
      },
      ja: {
        headers: ["画面の金額", "口座のどの数か", "こう扱わない"],
        rows: [
          ["未払い", "アドレス残高。1 ZEPH = 1e12 支払い単位", "次の支払いまでのカウントダウン"],
          ["支払済", "すでに支払われた累計", "他プールやウォレットのコイン"],
          ["直近24時間", "ローリング24時間の報酬", "暦日の収益や保証された日次精算"],
          ["空欄", "その項目に使える整数が無い", "数字の 0"],
        ],
      },
    },
    topic: {
      zh: "收益与支付",
      "zh-TW": "收益與支付",
      en: "Rewards and payments",
      ko: "보상과 지급",
      ja: "報酬と支払い",
    },
    title: {
      zh: "ZEPH 未支付和近 24 小时，为什么不是打款时间？",
      "zh-TW": "ZEPH 未支付和近 24 小時，為什麼不是打款時間？",
      en: "Why ZEPH unpaid and 24-hour figures are not a payout time",
      ko: "ZEPH 미지급과 24시간은 왜 지급 시각이 아닌가요?",
      ja: "ZEPHの未払いと24時間は、なぜ支払時刻ではないのですか？",
    },
    description: {
      zh: "ZEPH 监控把矿池账户的余额、累计已支付和滚动 24 小时收益按 1e12 显示。它不单列未成熟区块，也不把最低打款额写成固定数字。",
      "zh-TW":
        "ZEPH 監控把礦池帳戶的餘額、累計已支付與滾動 24 小時收益按 1e12 顯示。它不單列未成熟區塊，也不把最低打款額寫成固定數字。",
      en: "The ZEPH monitor shows the pool account’s balance, cumulative paid, and rolling 24-hour reward using 1e12. It does not list immature blocks separately, and it does not store a fixed minimum payout.",
      ko: "ZEPH 모니터는 풀 계정의 잔액, 누적 지급, 롤링 24시간 보상을 1e12로 보여 줍니다. 미성숙 블록을 따로 나열하지 않고, 최소 지급액을 고정하지도 않습니다.",
      ja: "ZEPHモニターはプール口座の残高、累計支払、ローリング24時間の報酬を 1e12 で表示します。未成熟ブロックを別に並べず、最低支払額も固定しません。",
    },
    summary: {
      zh: "未支付是这个标准地址在普通矿池上还没付出的余额，近 24 小时是滚动窗口。两者都不是“还要多久到账”，也不是全网或钱包里的 ZEPH。",
      "zh-TW":
        "未支付是這個標準地址在一般礦池上還沒付出的餘額，近 24 小時是滾動窗口。兩者都不是「還要多久到帳」，也不是全網或錢包裡的 ZEPH。",
      en: "Unpaid is the balance this standard address still has on the regular pool. The 24-hour figure is a rolling window. Neither is a time until coins arrive, and neither is ZEPH on the whole network or in a wallet.",
      ko: "미지급은 이 표준 주소가 일반 풀에 아직 가지고 있는 잔액이고, 24시간은 롤링 구간입니다. 둘 다 코인이 도착할 때까지의 시간이 아니며, 네트워크 전체나 지갑의 ZEPH도 아닙니다.",
      ja: "未払いはこの標準アドレスが通常プールにまだ持っている残高で、24時間はローリング窓です。どちらも着金までの時間ではなく、ネットワーク全体やウォレットの ZEPH でもありません。",
    },
    body: {
      zh: [
        "未支付不是下一笔打款的时刻。它是 zeph.2miners.com 普通矿池账户上、这个标准地址尚未付出的余额。已支付是同一账户累计已经付出的金额。近 24 小时是滚动 24 小时收益，会随着窗口移动，不是从午夜到午夜的日历日，也不是矿池承诺的日结。",
        "这三项都按 RandomX 矿池的支付单位换算：1 ZEPH = 1e12。公开 API 说明账户接口包含收益、支付和 Worker，另有区块接口区分候选、未成熟和已成熟。设备页使用的是账户上的余额、已支付和 24 小时收益，不另开一张未成熟区块表。因此你不能从本页读出“还差多少确认”。",
        "## 数字各自回答的问题",
        "余额回答“矿池账户里还挂着多少”。已支付回答“这个地址在该矿池累计被付出多少”。24 小时回答“刚过去的滚动一天记了多少”。最低支付额和到账时间以矿池当时的帮助或账户页为准。本监控不写死门槛，也不把未支付显示成倒计时。",
        "## 对账时看哪里",
        "- 先看未支付是否为空白。空白是未知，不要记成 0 ZEPH。",
        "- 再看已支付是否增加。已支付不变只说明这段时间没有新的付出记录，不说明矿机停了。",
        "- 多个 Worker 共用这一份余额。不要把未支付乘以 Worker 个数。同一地址绑在多台已保存设备上时，钱包总额仍然只算一份。",
        "## 下一步",
        "- 打开 [Zephyr 项目](/projects/zeph)，把三项和矿池自己的账户页对齐。",
        "- 算力还在、余额长期空白，先确认地址仍是标准地址，而不是去改份额难度。难度与收益的关系见 [Worker 与 RandomX](/learn/zeph-randomx-cpu-workers)。",
        "- 整页能看和不能看的范围见 [监控说明](/learn/zeph-mining-monitor-guide)。",
        "## 示意换算（不是实际收入）",
        "未支付整数 500000000000 显示为 0.5 ZEPH；已支付整数 10000000000000 显示为 10 ZEPH。这只示范 1e12。它不是你的账单，也不保证下一笔会按这个数付出。",
        "## 边界",
        "本页不预测成熟需要多少个区块，不把协议稳定币余额和矿池 ZEPH 记在一起，也不提供美元价格。矿池若暂时不返回某一项，该项保持未知。",
      ],
      "zh-TW": [
        "未支付不是下一筆打款的時刻。它是 zeph.2miners.com 一般礦池帳戶上、這個標準地址尚未付出的餘額。已支付是同一帳戶累計已經付出的金額。近 24 小時是滾動 24 小時收益，會隨著窗口移動，不是從午夜到午夜的日曆日，也不是礦池承諾的日結。",
        "這三項都按 RandomX 礦池的支付單位換算：1 ZEPH = 1e12。公開 API 說明帳戶介面包含收益、支付與 Worker，另有區塊介面區分候選、未成熟與已成熟。設備頁使用的是帳戶上的餘額、已支付與 24 小時收益，不另開一張未成熟區塊表。因此你不能從本頁讀出「還差多少確認」。",
        "## 數字各自回答的問題",
        "餘額回答「礦池帳戶裡還掛著多少」。已支付回答「這個地址在該礦池累計被付出多少」。24 小時回答「剛過去的滾動一天記了多少」。最低支付額與到帳時間以礦池當時的幫助或帳戶頁為準。本監控不寫死門檻，也不把未支付顯示成倒數。",
        "## 對帳時看哪裡",
        "- 先看未支付是否為空白。空白是未知，不要記成 0 ZEPH。",
        "- 再看已支付是否增加。已支付不變只說明這段時間沒有新的付出紀錄，不說明礦機停了。",
        "- 多個 Worker 共用這一份餘額。不要把未支付乘以 Worker 個數。同一地址綁在多台已儲存設備上時，錢包總額仍然只算一份。",
        "## 下一步",
        "- 打開 [Zephyr 專案](/projects/zeph)，把三項和礦池自己的帳戶頁對齊。",
        "- 算力還在、餘額長期空白，先確認地址仍是標準地址，而不是去改份額難度。難度與收益的關係見 [Worker 與 RandomX](/learn/zeph-randomx-cpu-workers)。",
        "- 整頁能看和不能看的範圍見 [監控說明](/learn/zeph-mining-monitor-guide)。",
        "## 示意換算（不是實際收入）",
        "未支付整數 500000000000 顯示為 0.5 ZEPH；已支付整數 10000000000000 顯示為 10 ZEPH。這只示範 1e12。它不是你的帳單，也不保證下一筆會按這個數付出。",
        "## 邊界",
        "本頁不預測成熟需要多少個區塊，不把協議穩定幣餘額和礦池 ZEPH 記在一起，也不提供美元價格。礦池若暫時不回傳某一項，該項保持未知。",
      ],
      en: [
        "Unpaid is not the clock time of the next payout. It is the balance this standard address still holds on the regular zeph.2miners.com account. Paid is the cumulative amount that same account has already paid. The 24-hour figure is a rolling reward. It moves with the window. It is not midnight to midnight, and it is not a daily settlement the pool promised.",
        "All three use the RandomX pool payment unit: 1 ZEPH = 1e12. The public API index says the account endpoint includes rewards, payments, and Workers, and that a blocks endpoint separates candidates, immature, and matured. The device page uses the account balance, paid total, and 24-hour reward. It does not open a separate immature-block table, so you cannot read “how many confirmations are left” from this page.",
        "## Which question each number answers",
        "Balance answers how much is still on the pool account. Paid answers how much this address has been paid on that pool in total. The 24-hour field answers what the rolling day just recorded. The minimum payout and the arrival time are whatever the pool’s help or account page says at the time. This monitor does not store a fixed threshold, and it does not turn unpaid into a countdown.",
        "## Where to look when you reconcile",
        "- Look first at whether unpaid is blank. Blank means unknown. Do not write it down as 0 ZEPH.",
        "- Then see whether paid increased. Paid staying the same only means there is no new payout record in that stretch. It does not mean the rig stopped.",
        "- Workers share this one balance. Do not multiply unpaid by the Worker count. If the same address is bound on several saved devices, the wallet total is still counted once.",
        "## What to do next",
        "- Open the [Zephyr project](/projects/zeph) and line the three figures up with the pool’s own account page.",
        "- If hashrate is present and the balance stays blank, confirm the address is still the standard address before changing share difficulty. Difficulty and rewards are covered in [Workers and RandomX](/learn/zeph-randomx-cpu-workers).",
        "- What the whole page can and cannot show is in the [monitor guide](/learn/zeph-mining-monitor-guide).",
        "## Illustrative conversion (not actual income)",
        "An unpaid integer of 500000000000 displays as 0.5 ZEPH. A paid integer of 10000000000000 displays as 10 ZEPH. That only demonstrates 1e12. It is not your statement, and it does not mean the next payout will be that amount.",
        "## Limits",
        "This page does not predict how many blocks maturity takes, does not add a protocol stablecoin balance to pool ZEPH, and does not show a US dollar price. If the pool omits one field for a while, that field stays unknown.",
      ],
      ko: [
        "미지급은 다음 지급의 시각이 아닙니다. zeph.2miners.com 일반 풀 계정에서 이 표준 주소가 아직 가지고 있는 잔액입니다. 지급은 같은 계정이 이미 보낸 누적 금액입니다. 24시간은 롤링 보상입니다. 창이 움직이면 같이 움직입니다. 자정부터 자정까지가 아니고, 풀이 약속한 일 정산도 아닙니다.",
        "세 항목 모두 RandomX 풀의 지급 단위인 1 ZEPH = 1e12를 씁니다. 공개 API 색인은 계정 엔드포인트에 보상, 지급, Worker가 있고, 블록 엔드포인트는 후보, 미성숙, 성숙을 나눈다고 합니다. 기기 화면은 계정 잔액, 지급 합계, 24시간 보상을 씁니다. 미성숙 블록 표를 따로 열지 않으므로, 이 화면에서 “확인이 몇 개 남았는지”는 읽을 수 없습니다.",
        "## 각 숫자가 답하는 질문",
        "잔액은 풀 계정에 아직 얼마가 걸려 있는지를 답합니다. 지급은 이 주소가 그 풀에서 누적으로 얼마나 나갔는지를 답합니다. 24시간은 방금 지나간 롤링 하루에 기록된 금액입니다. 최소 지급액과 도착 시각은 그 시점의 풀 도움말이나 계정 페이지를 따릅니다. 이 모니터는 문턱을 고정하지 않고, 미지급을 카운트다운으로 바꾸지도 않습니다.",
        "## 대조할 때 볼 곳",
        "- 먼저 미지급이 빈칸인지 봅니다. 빈칸은 알 수 없음입니다. 0 ZEPH로 적지 마세요.",
        "- 그다음 지급이 늘었는지 봅니다. 지급이 그대로인 것은 그 구간에 새 지급 기록이 없다는 뜻이지, 채굴기가 멈췄다는 뜻이 아닙니다.",
        "- Worker는 이 잔액 하나를 공유합니다. 미지급에 Worker 수를 곱하지 마세요. 같은 주소를 여러 저장 기기에 묶어도 지갑 합계는 한 번만 셉니다.",
        "## 다음 단계",
        "- [Zephyr 프로젝트](/projects/zeph)를 열고 세 숫자를 풀 자신의 계정 페이지와 맞춥니다.",
        "- 해시레이트는 있는데 잔액이 계속 비어 있으면, 셰어 난이도를 바꾸기 전에 주소가 아직 표준 주소인지 확인합니다. 난이도와 보상은 [Worker와 RandomX](/learn/zeph-randomx-cpu-workers)에 있습니다.",
        "- 화면 전체가 보여주고 보여주지 않는 범위는 [모니터 안내](/learn/zeph-mining-monitor-guide)에 있습니다.",
        "## 환산 예시(실제 수입 아님)",
        "미지급 정수 500000000000은 0.5 ZEPH로 보입니다. 지급 정수 10000000000000은 10 ZEPH로 보입니다. 1e12를 보여줄 뿐입니다. 내 명세서가 아니고, 다음 지급이 그 금액이라는 뜻도 아닙니다.",
        "## 한계",
        "이 화면은 성숙에 블록이 몇 개 필요한지 예측하지 않고, 프로토콜 스테이블코인 잔액을 풀 ZEPH에 더하지 않으며, 미국 달러 가격도 보여 주지 않습니다. 풀이 한동안 한 항목을 빼면 그 항목은 알 수 없음으로 남습니다.",
      ],
      ja: [
        "未払いは次の支払いの時刻ではありません。zeph.2miners.com 通常プールの口座で、この標準アドレスがまだ持っている残高です。支払済は同じ口座がすでに支払った累計です。24時間はローリングの報酬です。窓が動くと一緒に動きます。深夜から深夜までではなく、プールが約束した日次精算でもありません。",
        "三つとも RandomX プールの支払い単位、1 ZEPH = 1e12 を使います。公開 API の目次は、口座エンドポイントに報酬、支払い、Worker があり、ブロックのエンドポイントは候補、未成熟、成熟を分けると書いています。デバイス画面が使うのは口座の残高、支払済、24時間の報酬です。未成熟ブロックの表は別に開かないので、「あと確認がいくつ」はこの画面からは読めません。",
        "## それぞれの数字が答えること",
        "残高は、プール口座にまだいくら残っているかを答えます。支払済は、このアドレスがそのプールで累計いくら支払われたかを答えます。24時間は、直前のローリング一日に記録された額です。最低支払額と着金時刻は、その時点のプールのヘルプまたは口座ページに従います。このモニターはしきい値を固定せず、未払いをカウントダウンにもしません。",
        "## 照合するときに見る場所",
        "- まず未払いが空欄かを見ます。空欄は不明です。0 ZEPH と書かないでください。",
        "- 次に支払済が増えたかを見ます。支払済が同じなのは、その区間に新しい支払記録が無いという意味で、リグが止まったという意味ではありません。",
        "- Worker はこの残高を一つ共有します。未払いに Worker 数を掛けないでください。同じアドレスを複数の保存デバイスに結んでも、ウォレット合計は一度だけ数えます。",
        "## 次にすること",
        "- [Zephyrプロジェクト](/projects/zeph) を開き、三つの数字をプール自身の口座ページと揃えます。",
        "- 算力はあるのに残高が空欄のままなら、シェア難度を変える前にアドレスがまだ標準アドレスか確認します。難度と報酬は [WorkerとRandomX](/learn/zeph-randomx-cpu-workers) にあります。",
        "- 画面全体で見える範囲と見えない範囲は [モニター説明](/learn/zeph-mining-monitor-guide) にあります。",
        "## 換算の例（実際の収入ではない）",
        "未払いの整数 500000000000 は 0.5 ZEPH と表示されます。支払済の整数 10000000000000 は 10 ZEPH と表示されます。1e12 の説明だけです。あなたの明細ではなく、次の支払いがその額になるという意味でもありません。",
        "## 限界",
        "この画面は成熟に必要なブロック数を予測せず、プロトコルのステーブルコイン残高をプールの ZEPH に足さず、米ドル価格も出しません。プールがしばらく一つの項目を返さなければ、その項目は不明のままです。",
      ],
    },
    questions: {
      zh: [
        {
          question: "未成熟区块在哪里看？",
          answer:
            "API 文档把候选、未成熟和已成熟放在区块接口。本设备页只显示账户余额、累计已支付和滚动 24 小时，没有单独的未成熟列表。",
        },
        {
          question: "近 24 小时会在午夜清零吗？",
          answer: "不会按日历午夜清零。它是滚动窗口。窗口里的记录变化时，这个数才会变。",
        },
        {
          question: "余额除以 Worker 数才是每台机器的收入吗？",
          answer: "不是。余额属于整个标准地址。Worker 只是算力记录，不拆分钱包收益。",
        },
      ],
      "zh-TW": [
        {
          question: "未成熟區塊在哪裡看？",
          answer:
            "API 文件把候選、未成熟與已成熟放在區塊介面。本設備頁只顯示帳戶餘額、累計已支付與滾動 24 小時，沒有單獨的未成熟清單。",
        },
        {
          question: "近 24 小時會在午夜清零嗎？",
          answer: "不會按日曆午夜清零。它是滾動窗口。窗口裡的紀錄變化時，這個數才會變。",
        },
        {
          question: "餘額除以 Worker 數才是每台機器的收入嗎？",
          answer: "不是。餘額屬於整個標準地址。Worker 只是算力紀錄，不拆分錢包收益。",
        },
      ],
      en: [
        {
          question: "Where do I see immature blocks?",
          answer:
            "The API index puts candidates, immature, and matured on the blocks endpoint. This device page shows account balance, cumulative paid, and the rolling 24-hour reward only. It has no separate immature list.",
        },
        {
          question: "Does the 24-hour figure reset at midnight?",
          answer:
            "It does not reset on the calendar midnight. It is a rolling window. The number changes when the records inside that window change.",
        },
        {
          question: "Is income per machine the balance divided by Workers?",
          answer:
            "No. The balance belongs to the whole standard address. Workers are hashrate records and do not split the wallet reward.",
        },
      ],
      ko: [
        {
          question: "미성숙 블록은 어디서 보나요?",
          answer:
            "API 색인은 후보, 미성숙, 성숙을 블록 엔드포인트에 둡니다. 이 기기 화면은 계정 잔액, 누적 지급, 롤링 24시간만 보여 주며 미성숙 목록은 따로 없습니다.",
        },
        {
          question: "24시간은 자정에 0이 되나요?",
          answer:
            "달력의 자정에 초기화되지 않습니다. 롤링 구간입니다. 그 구간 안의 기록이 바뀔 때 숫자가 바뀝니다.",
        },
        {
          question: "잔액을 Worker 수로 나누면 기기당 수입인가요?",
          answer:
            "아닙니다. 잔액은 표준 주소 전체의 것입니다. Worker는 해시레이트 기록이며 지갑 보상을 나누지 않습니다.",
        },
      ],
      ja: [
        {
          question: "未成熟ブロックはどこで見ますか？",
          answer:
            "API の目次は候補、未成熟、成熟をブロックのエンドポイントに置いています。このデバイス画面は口座残高、累計支払、ローリング24時間だけで、未成熟の一覧はありません。",
        },
        {
          question: "24時間は深夜に 0 になりますか？",
          answer:
            "暦の深夜にはリセットされません。ローリング窓です。その窓の中の記録が変わったときに数字が変わります。",
        },
        {
          question: "残高を Worker 数で割ると機械ごとの収入ですか？",
          answer:
            "違います。残高は標準アドレス全体のものです。Worker は算力の記録であり、ウォレット報酬を分割しません。",
        },
      ],
    },
  },
  {
    slug: "zeph-worker-zero-hashrate",
    published: "2026-10-24",
    modified: "2026-10-24",
    project: "zeph",
    sources: [
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
      { name: "2Miners · ZEPH help", url: "https://zeph.2miners.com/help" },
    ],
    related: ["zeph-randomx-cpu-workers", "zeph-mature-rewards-payments"],
    comparisonTitle: {
      zh: "算力为 0、离线和未知不是同一件事",
      "zh-TW": "算力為 0、離線和未知不是同一件事",
      en: "Zero, offline, and unknown are different",
      ko: "0, 오프라인, 알 수 없음은 다릅니다",
      ja: "0、オフライン、不明は別です",
    },
    comparison: {
      zh: {
        headers: ["这一行", "含义", "优先动作"],
        rows: [
          [
            "算力为 0，且未标离线",
            "矿池仍列出该 Worker，当前算力上报为 0",
            "核对矿机是否还在向这个地址提交",
          ],
          ["标为离线", "矿池把该 Worker 标成离线", "看最后心跳，再看矿机进程"],
          ["算力空白", "没有可用的算力数字", "不要写成 0，对照矿池统计页"],
          ["离线状态空白", "矿池没有给出离线真假", "状态保持未知"],
        ],
      },
      "zh-TW": {
        headers: ["這一列", "含義", "優先動作"],
        rows: [
          [
            "算力為 0，且未標離線",
            "礦池仍列出該 Worker，目前算力上報為 0",
            "核對礦機是否還在向這個地址提交",
          ],
          ["標為離線", "礦池把該 Worker 標成離線", "看最後心跳，再看礦機行程"],
          ["算力空白", "沒有可用的算力數字", "不要寫成 0，對照礦池統計頁"],
          ["離線狀態空白", "礦池沒有給出離線真假", "狀態保持未知"],
        ],
      },
      en: {
        headers: ["This row", "Meaning", "First action"],
        rows: [
          [
            "Hashrate 0, not marked offline",
            "The pool still lists the Worker and reports current hashrate as 0",
            "Check the miner is still submitting to this address",
          ],
          [
            "Marked offline",
            "The pool marked that Worker offline",
            "Read the last heartbeat, then the miner process",
          ],
          [
            "Hashrate blank",
            "No usable hashrate number",
            "Do not write 0; compare the pool statistics page",
          ],
          [
            "Offline flag blank",
            "The pool did not say offline true or false",
            "Leave the status unknown",
          ],
        ],
      },
      ko: {
        headers: ["이 행", "의미", "먼저 할 일"],
        rows: [
          [
            "해시레이트 0, 오프라인 아님",
            "풀이 Worker를 아직 나열하고 현재 해시레이트를 0으로 보고함",
            "채굴기가 이 주소로 아직 제출하는지 확인",
          ],
          [
            "오프라인으로 표시",
            "풀이 그 Worker를 오프라인으로 표시함",
            "마지막 하트비트를 본 뒤 채굴기 프로세스를 봄",
          ],
          [
            "해시레이트 빈칸",
            "쓸 수 있는 해시레이트 숫자가 없음",
            "0으로 적지 말고 풀 통계와 비교",
          ],
          ["오프라인 표시가 빈칸", "풀이 오프라인 참/거짓을 주지 않음", "상태는 알 수 없음으로 둠"],
        ],
      },
      ja: {
        headers: ["この行", "意味", "先にすること"],
        rows: [
          [
            "ハッシュレート 0 でオフラインではない",
            "プールは Worker を残し、現在算力を 0 と報告している",
            "マイナーがまだこのアドレスへ出しているか確認する",
          ],
          [
            "オフラインと表示",
            "プールがその Worker をオフラインにした",
            "最後の心拍を見てからマイナーのプロセスを見る",
          ],
          ["ハッシュレートが空欄", "使える算力の数字が無い", "0 と書かず、プール統計と照合する"],
          [
            "オフライン表示が空欄",
            "プールがオフラインの真偽を返していない",
            "状態は不明のままにする",
          ],
        ],
      },
    },
    topic: {
      zh: "算力为 0",
      "zh-TW": "算力為 0",
      en: "Hashrate at zero",
      ko: "해시레이트 0",
      ja: "ハッシュレートが0",
    },
    title: {
      zh: "ZEPH 某个 Worker 算力是 0，矿机一定停了吗？",
      "zh-TW": "ZEPH 某個 Worker 算力是 0，礦機一定停了嗎？",
      en: "A ZEPH Worker shows 0. Has the rig stopped?",
      ko: "ZEPH Worker 해시레이트가 0이면 채굴기는 멈춘 건가요?",
      ja: "ZEPHのWorkerが0なら、リグは止まったのですか？",
    },
    description: {
      zh: "ZEPH Worker 算力为 0 表示矿池对这一行上报了 0。算力空白才是未知。离线标志和最后心跳用来判断矿池是否还把这台矿机当作在线。",
      "zh-TW":
        "ZEPH Worker 算力為 0 表示礦池對這一列上報了 0。算力空白才是未知。離線標誌與最後心跳用來判斷礦池是否還把這台礦機當作在線。",
      en: "A ZEPH Worker hashrate of 0 means the pool reported 0 for that row. A blank hashrate is unknown. The offline flag and last heartbeat say whether the pool still treats the rig as online.",
      ko: "ZEPH Worker 해시레이트 0은 풀이 그 행에 0을 보고했다는 뜻입니다. 빈칸이어야 알 수 없음입니다. 오프라인 표시와 마지막 하트비트는 풀이 그 채굴기를 아직 온라인으로 보는지 알려 줍니다.",
      ja: "ZEPH Worker のハッシュレート 0 は、プールがその行に 0 を報告したという意味です。空欄が不明です。オフライン表示と最後の心拍は、プールがそのリグをまだオンラインと見ているかを示します。",
    },
    summary: {
      zh: "先分清这一行是“上报为 0”、矿池标了离线，还是根本没有数字。0 不会自动把地址收益改成 0，也不说明该去换一条门罗币地址。",
      "zh-TW":
        "先分清這一列是「上報為 0」、礦池標了離線，還是根本沒有數字。0 不會自動把地址收益改成 0，也不說明該去換一條門羅幣地址。",
      en: "Separate a row that reports 0, a row the pool marked offline, and a row with no number. Zero does not rewrite the address reward as zero, and it is not a reason to switch to a Monero address.",
      ko: "그 행이 0을 보고한 것인지, 풀이 오프라인으로 표시한 것인지, 숫자가 없는 것인지를 먼저 나누세요. 0이 주소 보상을 0으로 바꾸지 않고, 모네로 주소로 바꿀 이유도 아닙니다.",
      ja: "その行が 0 を報告しているのか、プールがオフラインにしたのか、数字が無いのかを先に分けます。0 はアドレス報酬を 0 に書き換えず、モネロのアドレスへ替える理由にもなりません。",
    },
    body: {
      zh: [
        "不一定停机。Worker 算力显示 0，是矿池对这个矿机名给出了数字 0。算力位置是空白时，才是没有读到数字，必须保持未知，不能补成 0。离线是另一项：矿池明确标了离线，这一行才显示离线；矿池没给真假时，在线状态是未知，不要猜成离线。",
        "最后心跳是矿池记录的最近一次联系时间。它能帮你看这台名字还新不新鲜，但不能代替矿机本机的 XMRig 窗口。账户当前算力是整个标准地址的合计，可以和某一行的 0 同时出现。",
        "## 这一行和钱包收益的关系",
        "某一行是 0，不会把该地址的未支付、已支付或滚动 24 小时改成 0。那些金额属于整个地址。份额难度也不用来解释这一行：矿池写明份额难度不影响矿工收益。算法仍应是帮助页要求的 RandomX。",
        "## 按顺序检查",
        "- 确认矿机用户名仍是「标准地址.你期望的矿机名」，矿机名只用英文字母、数字、减号和下划线。",
        "- 在矿池自己的统计页找同一名字。两边都是 0，再看本机进程是否还在跑、是否还指向 ZEPH 池。",
        "- 只有空白而不是 0 时，先刷新项目页。仍空白就保持未知，不要新建第二台已保存设备。",
        "## 下一步",
        "- 在 [Zephyr 项目](/projects/zeph) 看这一行的算力、离线和最后心跳。",
        "- 名称规则见 [RandomX 与 Worker](/learn/zeph-randomx-cpu-workers)。地址级金额见 [收益与支付](/learn/zeph-mature-rewards-payments)。",
        "- 若整份账户都拒绝打开，先检查是不是标准地址，而不是去改 Worker。",
        "## 示意（不是一台真实矿机）",
        "名为 rig-1 的一行：算力 0，未标离线，最后心跳是几分钟前。这表示名字还在，矿池当前把算力报成 0。另一行算力空白且离线栏也空白，则算力和状态都是未知。不要把两行都记成“停机且收益为 0”。",
        "## 边界",
        "监控看不到你家里的断电、驱动或 XMRig 报错原文，也不能远程重启矿机。",
      ],
      "zh-TW": [
        "不一定停機。Worker 算力顯示 0，是礦池對這個礦機名給出了數字 0。算力位置是空白時，才是沒有讀到數字，必須保持未知，不能補成 0。離線是另一項：礦池明確標了離線，這一列才顯示離線；礦池沒給真假時，在線狀態是未知，不要猜成離線。",
        "最後心跳是礦池記錄的最近一次聯繫時間。它能幫你看這台名字還新不新鮮，但不能代替礦機本機的 XMRig 視窗。帳戶目前算力是整個標準地址的合計，可以和某一列的 0 同時出現。",
        "## 這一列和錢包收益的關係",
        "某一列是 0，不會把該地址的未支付、已支付或滾動 24 小時改成 0。那些金額屬於整個地址。份額難度也不用來解釋這一列：礦池寫明份額難度不影響礦工收益。演算法仍應是幫助頁要求的 RandomX。",
        "## 按順序檢查",
        "- 確認礦機使用者名稱仍是「標準地址.你期望的礦機名」，礦機名只用英文字母、數字、減號與底線。",
        "- 在礦池自己的統計頁找同一名字。兩邊都是 0，再看本機行程是否還在跑、是否還指向 ZEPH 池。",
        "- 只有空白而不是 0 時，先重新整理專案頁。仍空白就保持未知，不要新建第二台已儲存設備。",
        "## 下一步",
        "- 在 [Zephyr 專案](/projects/zeph) 看這一列的算力、離線與最後心跳。",
        "- 名稱規則見 [RandomX 與 Worker](/learn/zeph-randomx-cpu-workers)。地址級金額見 [收益與支付](/learn/zeph-mature-rewards-payments)。",
        "- 若整份帳戶都拒絕打開，先檢查是不是標準地址，而不是去改 Worker。",
        "## 示意（不是一台真實礦機）",
        "名為 rig-1 的一列：算力 0，未標離線，最後心跳是幾分鐘前。這表示名字還在，礦池目前把算力報成 0。另一列算力空白且離線欄也空白，則算力與狀態都是未知。不要把兩列都記成「停機且收益為 0」。",
        "## 邊界",
        "監控看不到你家裡的斷電、驅動或 XMRig 報錯原文，也不能遠端重啟礦機。",
      ],
      en: [
        "Not necessarily. A Worker hashrate of 0 means the pool sent the number 0 for that rig name. When the hashrate cell is blank, no number was read. Leave it unknown and do not fill in 0. Offline is a separate flag. The row is offline only when the pool said so. If the pool did not send true or false, the status is unknown. Do not guess offline.",
        "The last heartbeat is the latest contact time the pool recorded. It tells you whether that name is recent. It does not replace the XMRig window on the rig. The account’s current hashrate is the total for the whole standard address, so it can be present while one row shows 0.",
        "## How the row relates to the wallet",
        "A row at 0 does not set that address’s unpaid, paid, or rolling 24-hour reward to 0. Those amounts belong to the whole address. Share difficulty does not explain the row either: the pool says share difficulty does not affect miner rewards. The algorithm should still be the RandomX the help page asks for.",
        "## Check in this order",
        "- Confirm the miner username is still “standard address.the rig name you expect”. The rig name may use only English letters, digits, hyphen, and underscore.",
        "- Find the same name on the pool’s own statistics page. If both sides show 0, then look at whether the local process is still running and still aimed at the ZEPH pool.",
        "- If the cell is blank rather than 0, reload the project page. If it stays blank, leave it unknown. Do not create a second saved device.",
        "## What to do next",
        "- On the [Zephyr project](/projects/zeph), read that row’s hashrate, offline flag, and last heartbeat.",
        "- Naming rules are in [RandomX and Workers](/learn/zeph-randomx-cpu-workers). Address-level amounts are in [rewards and payments](/learn/zeph-mature-rewards-payments).",
        "- If the whole account will not open, check for a standard address before editing the Worker.",
        "## Sketch (not a real rig)",
        "A row named rig-1: hashrate 0, not marked offline, last heartbeat a few minutes ago. The name is still listed and the pool currently reports hashrate as 0. Another row with a blank hashrate and a blank offline flag is unknown on both. Do not record both rows as “stopped, and the reward is 0”.",
        "## Limits",
        "The monitor cannot see a power cut, a driver fault, or the XMRig error text in your home, and it cannot reboot the rig.",
      ],
      ko: [
        "반드시 멈춘 것은 아닙니다. Worker 해시레이트가 0이면 풀이 그 리그 이름에 숫자 0을 보낸 것입니다. 해시레이트 칸이 빈칸이면 숫자를 읽지 못한 것입니다. 알 수 없음으로 두고 0을 채우지 마세요. 오프라인은 별도 표시입니다. 풀이 오프라인이라고 했을 때만 그 행이 오프라인입니다. 참/거짓이 없으면 상태는 알 수 없음이며, 오프라인으로 짐작하지 마세요.",
        "마지막 하트비트는 풀이 기록한 최근 연락 시각입니다. 그 이름이 최근인지 알려 줄 뿐, 채굴기 위의 XMRig 창을 대신하지 않습니다. 계정의 현재 해시레이트는 표준 주소 전체의 합이라, 한 행이 0이어도 계정 합계는 있을 수 있습니다.",
        "## 이 행과 지갑 보상의 관계",
        "한 행이 0이라고 그 주소의 미지급, 지급, 롤링 24시간이 0이 되지 않습니다. 그 금액은 주소 전체의 것입니다. 셰어 난이도로 이 행을 설명하지도 않습니다. 풀은 셰어 난이도가 채굴 보상을 바꾸지 않는다고 합니다. 알고리즘은 도움말이 요구하는 RandomX여야 합니다.",
        "## 이 순서로 확인",
        "- 채굴기 사용자 이름이 아직 “표준 주소.기대한 리그 이름”인지 확인합니다. 리그 이름은 영문, 숫자, 하이픈, 밑줄만 됩니다.",
        "- 풀 자신의 통계에서 같은 이름을 찾습니다. 양쪽이 모두 0이면, 로컬 프로세스가 아직 돌고 ZEPH 풀을 보는지 확인합니다.",
        "- 0이 아니라 빈칸이면 프로젝트 페이지를 다시 불러옵니다. 계속 비어 있으면 알 수 없음으로 둡니다. 저장된 기기를 두 번째 만들지 마세요.",
        "## 다음 단계",
        "- [Zephyr 프로젝트](/projects/zeph)에서 그 행의 해시레이트, 오프라인, 마지막 하트비트를 봅니다.",
        "- 이름 규칙은 [RandomX와 Worker](/learn/zeph-randomx-cpu-workers)에 있습니다. 주소 단위 금액은 [보상과 지급](/learn/zeph-mature-rewards-payments)에 있습니다.",
        "- 계정 전체가 열리지 않으면 Worker를 고치기 전에 표준 주소인지 확인합니다.",
        "## 스케치(실제 채굴기 아님)",
        "이름이 rig-1인 행: 해시레이트 0, 오프라인 표시 없음, 마지막 하트비트는 몇 분 전. 이름은 남아 있고 풀이 지금 해시레이트를 0으로 보고한 것입니다. 다른 행이 해시레이트와 오프라인 칸이 모두 비어 있으면 둘 다 알 수 없음입니다. 두 행을 모두 “멈추었고 보상이 0”으로 적지 마세요.",
        "## 한계",
        "모니터는 집의 정전, 드라이버 오류, XMRig 오류 원문을 보지 못하고 채굴기를 원격으로 재시작하지도 못합니다.",
      ],
      ja: [
        "必ず止まっているわけではありません。Worker のハッシュレートが 0 なのは、プールがそのリグ名に数字の 0 を返したという意味です。ハッシュレートの欄が空欄なら、数字を読めていません。不明のままにし、0 を埋めないでください。オフラインは別の印です。プールがオフラインと言ったときだけ、その行はオフラインです。真偽が無ければ状態は不明で、オフラインと推測しないでください。",
        "最後の心拍は、プールが記録した直近の連絡時刻です。その名前が新しいかどうかの手がかりであり、リグ上の XMRig の画面の代わりにはなりません。口座の現在算力は標準アドレス全体の合計なので、一行が 0 でも口座合計はあり得ます。",
        "## この行とウォレット報酬の関係",
        "一行が 0 でも、そのアドレスの未払い、支払済、ローリング24時間は 0 になりません。それらの金額はアドレス全体のものです。シェア難度でもこの行は説明しません。プールはシェア難度が報酬に影響しないと書いています。アルゴリズムはヘルプが求める RandomX のままです。",
        "## この順で確認する",
        "- マイナーのユーザー名がまだ「標準アドレス.期待するリグ名」か確認します。リグ名は英字、数字、ハイフン、アンダースコアだけです。",
        "- プール自身の統計で同じ名前を探します。両方とも 0 なら、ローカルのプロセスがまだ動いていて ZEPH プールを向いているかを見ます。",
        "- 0 ではなく空欄なら、プロジェクトページを読み直します。空欄のままなら不明にしておきます。保存デバイスを二台目として作らないでください。",
        "## 次にすること",
        "- [Zephyrプロジェクト](/projects/zeph) でその行のハッシュレート、オフライン、最後の心拍を見ます。",
        "- 名前の規則は [RandomXとWorker](/learn/zeph-randomx-cpu-workers) にあります。アドレス単位の金額は [報酬と支払い](/learn/zeph-mature-rewards-payments) にあります。",
        "- 口座全体が開かないときは、Worker を直す前に標準アドレスかを確認します。",
        "## 見取り図（実在のリグではない）",
        "名前が rig-1 の行: ハッシュレート 0、オフライン表示なし、最後の心拍は数分前。名前は残っていて、プールが今の算力を 0 と報告しています。別の行がハッシュレートもオフライン欄も空欄なら、両方とも不明です。両方を「停止し、報酬は 0」と記録しないでください。",
        "## 限界",
        "モニターは自宅の停電、ドライバの不具合、XMRig のエラー原文を見られず、リグを遠隔で再起動することもできません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "0 和空白有什么差别？",
          answer: "0 是矿池上报的算力数字。空白是没有数字，应保持未知，不能当成停机收益 0。",
        },
        {
          question: "最后心跳很近但算力是 0，怎么办？",
          answer:
            "名字仍被矿池记着。先看本机是否还在用 RandomX 向这个标准地址提交，并和矿池统计页对同一矿机名。",
        },
        {
          question: "为这个 Worker 再保存一台设备能修好 0 吗？",
          answer: "不能。那只会多占每项目的已保存设备名额。同一地址下展开 Worker 本身不占名额。",
        },
      ],
      "zh-TW": [
        {
          question: "0 和空白有什麼差別？",
          answer: "0 是礦池上報的算力數字。空白是沒有數字，應保持未知，不能當成停機收益 0。",
        },
        {
          question: "最後心跳很近但算力是 0，怎麼辦？",
          answer:
            "名字仍被礦池記著。先看本機是否還在用 RandomX 向這個標準地址提交，並和礦池統計頁對同一礦機名。",
        },
        {
          question: "為這個 Worker 再儲存一台設備能修好 0 嗎？",
          answer: "不能。那只會多佔每專案的已儲存設備名額。同一地址下展開 Worker 本身不佔名額。",
        },
      ],
      en: [
        {
          question: "What is the difference between 0 and a blank?",
          answer:
            "Zero is a hashrate number the pool reported. A blank means there is no number. Leave it unknown. It is not a stopped-rig reward of zero.",
        },
        {
          question: "The last heartbeat is recent but hashrate is 0. What now?",
          answer:
            "The pool still has the name. Check that the local miner is still submitting RandomX work to this standard address, and match the same rig name on the pool statistics page.",
        },
        {
          question: "Will saving another device for this Worker fix the zero?",
          answer:
            "No. That only uses another saved-device slot for the project. Expanding Workers under one address does not use a slot by itself.",
        },
      ],
      ko: [
        {
          question: "0과 빈칸은 어떻게 다른가요?",
          answer:
            "0은 풀이 보고한 해시레이트 숫자입니다. 빈칸은 숫자가 없다는 뜻이며 알 수 없음으로 둡니다. 멈춘 채굴기의 보상 0이 아닙니다.",
        },
        {
          question: "마지막 하트비트는 가까운데 해시레이트가 0이면요?",
          answer:
            "풀이 그 이름을 아직 갖고 있습니다. 로컬 채굴기가 이 표준 주소로 RandomX 작업을 아직 내는지 확인하고, 풀 통계에서 같은 리그 이름을 맞춥니다.",
        },
        {
          question: "이 Worker를 위해 기기를 하나 더 저장하면 0이 고쳐지나요?",
          answer:
            "아닙니다. 프로젝트의 저장 기기 자리만 하나 더 씁니다. 한 주소 아래에서 Worker를 펼치는 것 자체는 자리를 쓰지 않습니다.",
        },
      ],
      ja: [
        {
          question: "0 と空欄の違いは何ですか？",
          answer:
            "0 はプールが報告した算力の数字です。空欄は数字が無いという意味で、不明のままにします。止まったリグの報酬 0 ではありません。",
        },
        {
          question: "最後の心拍は近いのにハッシュレートが 0 です。どうしますか？",
          answer:
            "プールはその名前をまだ持っています。ローカルのマイナーがこの標準アドレスへ RandomX の仕事をまだ出しているかを確認し、プール統計で同じリグ名を照合します。",
        },
        {
          question: "この Worker のためにデバイスをもう一台保存すると 0 は直りますか？",
          answer:
            "直りません。プロジェクトの保存デバイス枠を一台分使うだけです。一つのアドレスの下に Worker を展開すること自体は枠を使いません。",
        },
      ],
    },
  },
];
