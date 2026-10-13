import type { Article } from "./articles";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";
const idRows = l([
  [
    ["Miner ID / hotkey", "单台矿工的公开地址", "填入 IOTA Watch"],
    ["coldkey", "公开收款地址", "在官方应用 Connect 中配置"],
    ["私钥 / 助记词", "控制钱包的秘密", "不用于查询"],
  ],
  [
    ["Miner ID / hotkey", "單台礦工的公開地址", "填入IOTA Watch"],
    ["coldkey", "公開收款地址", "在官方應用Connect中設定"],
    ["私鑰 / 助記詞", "控制錢包的秘密", "不用於查詢"],
  ],
  [
    ["Miner ID / hotkey", "A miner’s public address", "Use in IOTA Watch"],
    ["coldkey", "Public payout address", "Configure in the official app’s Connect control"],
    ["Private key / seed", "Wallet secret", "Not a lookup identifier"],
  ],
  [
    ["Miner ID / hotkey", "개별 채굴기의 공개 주소", "IOTA Watch에 입력"],
    ["coldkey", "공개 지급 주소", "공식 앱 Connect에서 설정"],
    ["비밀키 / 시드", "지갑의 비밀 정보", "조회에 사용하지 않음"],
  ],
  [
    ["Miner ID / hotkey", "採掘機の公開アドレス", "IOTA Watchに入力"],
    ["coldkey", "公開受取アドレス", "公式アプリのConnectで設定"],
    ["秘密鍵 / シード", "ウォレットの秘密", "照会IDに使用しない"],
  ],
]);
const idHeaders = l([
  ["标识", "用途", "填写位置"],
  ["識別碼", "用途", "填寫位置"],
  ["Identifier", "Purpose", "Where to use it"],
  ["식별자", "용도", "입력 위치"],
  ["ID", "用途", "入力先"],
]);
export const iotaGuideAnswers: Record<string, Partial<Article>> = {
  "find-miner-id": {
    project: "iota",
    modified: "2026-10-13",
    sources: [
      {
        name: "Macrocosmos · Train at Home user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
      {
        name: "Macrocosmos · Train at Home FAQs",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/faqs",
      },
    ],
    summary: l([
      "打开官方 Train at Home 应用的 Miner 页面，复制完整的公开 Miner ID，再粘贴到 IOTA Watch 查询。用于收款的 coldkey 是另一个标识。",
      "在官方Train at Home應用的Miner頁複製完整公開Miner ID，再貼到IOTA Watch查詢。收款coldkey是另一個識別碼。",
      "Open Miner in the official Train at Home app, copy the complete public Miner ID and paste it into IOTA Watch. The payout coldkey is a different identifier.",
      "공식 Train at Home 앱의 Miner에서 전체 공개 Miner ID를 복사해 IOTA Watch에 붙여넣으세요. 지급 coldkey는 다른 식별자입니다.",
      "公式Train at HomeアプリのMinerで完全な公開Miner IDをコピーし、IOTA Watchに貼り付けます。受取用coldkeyは別のIDです。",
    ]),
    comparisonTitle: l([
      "公开标识怎么选",
      "公開識別碼怎麼選",
      "Choose the right identifier",
      "공개 식별자 선택",
      "公開IDの選び方",
    ]),
    comparison: Object.fromEntries(
      LOCALES.map((locale) => [locale, { headers: idHeaders[locale], rows: idRows[locale] }]),
    ) as NonNullable<Article["comparison"]>,
    questions: l([
      [
        {
          question: "一个收款地址能查询所有机器吗？",
          answer:
            "本站按 Miner ID 查询单台矿工。同一个 coldkey 可以接收不同矿工的奖励，但不能替代各台机器的 Miner ID。",
        },
        {
          question: "复制后仍然找不到设备怎么办？",
          answer:
            "核对完整 ID 和官方应用是否已连接。查不到名单不等于设备不存在，也不代表历史收益为零；按「尚未找到」排查指南逐项核对。",
        },
      ],
      [
        {
          question: "一個收款地址能查所有機器嗎？",
          answer:
            "本站按Miner ID查單台礦工。同一coldkey可收不同礦工獎勵，但不能取代各台的Miner ID。",
        },
        {
          question: "複製後仍找不到設備怎麼辦？",
          answer:
            "核對完整ID及官方應用連線。名單查不到不代表設備不存在或歷史收益為零，依排查指南核對。",
        },
      ],
      [
        {
          question: "Can one payout address look up every machine?",
          answer:
            "This tool looks up individual miners by Miner ID. A shared coldkey can receive their rewards but does not replace each miner’s ID.",
        },
        {
          question: "What if the copied ID is still not found?",
          answer:
            "Check the full ID and the official app’s connection. Missing from the current list does not mean the device never existed or earned zero. Follow the device-not-found guide.",
        },
      ],
      [
        {
          question: "하나의 지급 주소로 모든 기기를 조회하나요?",
          answer:
            "이 도구는 Miner ID로 개별 채굴기를 조회합니다. 공통 coldkey로 보상을 받아도 각 Miner ID를 대체하지 않습니다.",
        },
        {
          question: "ID를 복사했는데도 기기를 찾을 수 없나요?",
          answer:
            "전체 ID와 공식 앱 연결을 확인하세요. 목록에 없다고 기기가 없거나 과거 수익이 0이라는 뜻은 아닙니다. 기기 누락 가이드를 확인하세요.",
        },
      ],
      [
        {
          question: "受取アドレス一つで全機器を照会できますか？",
          answer:
            "このツールはMiner IDで個別の採掘機を照会します。共通coldkeyで報酬を受け取っても各Miner IDの代わりにはなりません。",
        },
        {
          question: "コピーしても機器が見つかりません。",
          answer:
            "完全なIDと公式アプリの接続を確認してください。現在の一覧にないことは機器の不存在や過去収益ゼロを意味しません。未検出ガイドで確認します。",
        },
      ],
    ]),
  },
  "how-rewards-work": {
    project: "iota",
    modified: "2026-10-03",
    sources: [
      {
        name: "Macrocosmos · Train at Home user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
      {
        name: "Macrocosmos · Train at Home FAQs",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/faqs",
      },
      { name: "IOTA Watch · source code", url: "https://github.com/molimao/iota" },
    ],
    summary: {
      zh: "今日 IOTA 是香港时间 00:00 起的 pending 与 settled 记账记录，排除冻结与未来记录。累计使用官方 Total Earned，不再叠加 Total Paid；已赚金额不等于钱包已到账。",
      "zh-TW":
        "今日 IOTA 是香港時間 00:00 起的 pending 與 settled 記帳紀錄，排除凍結與未來紀錄。累計使用官方 Total Earned，不再加上 Total Paid；已賺金額不等於錢包已到帳。",
      en: "Today’s IOTA sums pending and settled accounting records since Hong Kong midnight, excluding frozen and future records. Lifetime uses official Total Earned without adding Total Paid again. Accounted earnings are not confirmed wallet receipts.",
      ko: "오늘 IOTA는 홍콩 자정 이후 pending·settled 기록을 합산하고 frozen 및 미래 기록은 제외합니다. 누적은 공식 Total Earned이며 Total Paid를 다시 더하지 않습니다. 기록 수입은 지갑 수령 확정과 다릅니다.",
      ja: "今日のIOTAは香港時間の深夜以降のpending・settled記帳記録を合算し、凍結と未来の記録を除きます。累計は公式Total Earnedを使い、Total Paidを再加算しません。記帳収入とウォレットの着金は別です。",
    },
    questions: {
      zh: [
        {
          question: "累计是否要加上已支付？",
          answer: "不用，Total Earned 已包含已完成和待支付的收入，再加已支付会重复计算。",
        },
        {
          question: "香港午夜后今日归零正常吗？",
          answer: "可以，新的一天使用新时间窗口；累计不会因此被清空。",
        },
      ],
      "zh-TW": [
        {
          question: "累計是否要加上已支付？",
          answer: "不用，Total Earned 已包含已完成與待支付收入，再加已支付會重複計算。",
        },
        {
          question: "香港午夜後今日歸零正常嗎？",
          answer: "可以，新的一天使用新的時間範圍；累計不會因此清空。",
        },
      ],
      en: [
        {
          question: "Should paid rewards be added to lifetime earned?",
          answer:
            "No. Total Earned already includes completed and pending income; adding paid duplicates it.",
        },
        {
          question: "Can today reset after Hong Kong midnight?",
          answer:
            "Yes. A new day starts a new accounting window; this does not clear lifetime rewards.",
        },
      ],
      ko: [
        {
          question: "누적 수입에 지급액을 더해야 하나요?",
          answer:
            "아니요. Total Earned에 완료 및 대기 수입이 포함되어 있어 지급액을 더하면 중복됩니다.",
        },
        {
          question: "홍콩 자정 후 오늘 값이 0으로 바뀔 수 있나요?",
          answer: "네. 새 날짜는 새 집계 구간을 사용하며 누적 보상을 지우지는 않습니다.",
        },
      ],
      ja: [
        {
          question: "累計収入に支払済み額を足しますか？",
          answer:
            "いいえ。Total Earnedには完了・未払いの収入が含まれ、支払済み額を足すと重複します。",
        },
        {
          question: "香港時間の深夜に今日がゼロになりますか？",
          answer: "はい。新しい日の集計範囲に切り替わり、累計報酬が消えるわけではありません。",
        },
      ],
    },
  },
  "iota-rewards-in-usd": {
    project: "iota",
    modified: "2026-10-03",
    sources: [
      {
        name: "Macrocosmos · Train at Home user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
      {
        name: "Macrocosmos · Train at Home FAQs",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/faqs",
      },
      { name: "IOTA Watch · source code", url: "https://github.com/molimao/iota" },
    ],
    summary: {
      zh: "IOTA Watch 的美元数字是 SN9 子网 IOTA 的公开市场估价，不是官方结算金额。收益数量或有效行情缺失时显示未知，不补成 0 美元，也不用 IOTA 公链价格替代。",
      "zh-TW":
        "IOTA Watch 的美元數字是 SN9 子網 IOTA 的公開市場估價，不是官方結算金額。收益數量或有效行情缺少時顯示未知，不補為 0 美元，也不用 IOTA 公鏈價格替代。",
      en: "The dollar figure is a public-market estimate for SN9 subnet IOTA, not an official payout amount. Missing reward quantities or valid quotes remain unknown, not $0; IOTA Layer 1 prices are not substituted.",
      ko: "달러 값은 SN9 서브넷 IOTA의 공개 시장 추정치이며 공식 지급액이 아닙니다. 수량이나 유효 시세가 없으면 $0 대신 알 수 없음으로 표시하고 IOTA Layer 1 가격으로 대체하지 않습니다.",
      ja: "ドル表示はSN9サブネットIOTAの公開市場推定で、公式支払額ではありません。数量や有効相場が欠ける場合は$0ではなく不明とし、IOTA Layer 1の価格で代用しません。",
    },
    questions: {
      zh: [
        {
          question: "为什么收益有 IOTA 但美元是横线？",
          answer: "收益和行情来自不同来源，行情缺失或不可用时无法可靠换算。",
        },
        {
          question: "可以用 IOTA 公链币价计算吗？",
          answer: "不能，它与 Train at Home 的 SN9 子网代币是不同资产。",
        },
      ],
      "zh-TW": [
        {
          question: "為什麼有 IOTA 收益但美元是橫線？",
          answer: "收益與行情來自不同來源，行情缺少或不可用時無法可靠換算。",
        },
        {
          question: "可以用 IOTA 公鏈幣價計算嗎？",
          answer: "不能，它與 Train at Home 的 SN9 子網代幣是不同資產。",
        },
      ],
      en: [
        {
          question: "Why can IOTA rewards exist while USD is a dash?",
          answer:
            "Rewards and prices use different sources; an unavailable quote prevents a reliable conversion.",
        },
        {
          question: "Can I use the IOTA Layer 1 token price?",
          answer: "No. It is a different asset from Train at Home’s SN9 subnet token.",
        },
      ],
      ko: [
        {
          question: "IOTA 보상은 있는데 USD는 대시인 이유는 무엇인가요?",
          answer:
            "보상과 시세는 별도 원본을 쓰며 시세가 없으면 신뢰할 수 있는 환산이 불가능합니다.",
        },
        {
          question: "IOTA Layer 1 토큰 가격을 사용해도 되나요?",
          answer: "아니요. Train at Home의 SN9 서브넷 토큰과 다른 자산입니다.",
        },
      ],
      ja: [
        {
          question: "IOTA報酬があるのにUSDがダッシュなのはなぜ？",
          answer: "報酬と相場は別の情報源で、相場を取得できないと信頼できる換算ができません。",
        },
        {
          question: "IOTA Layer 1の価格を使えますか？",
          answer: "いいえ。Train at HomeのSN9サブネットトークンとは別の資産です。",
        },
      ],
    },
  },
};
