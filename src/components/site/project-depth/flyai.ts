import type { Article } from "../articles";

const sources = [
  { name: "fly.ai Compute", url: "https://www.flyaiworld.com/compute/" },
  { name: "fly.ai month response", url: "https://flyai-mine.fly.dev/api/month" },
];

const monitor: Article = {
  slug: "flyai-monitor-guide",
  project: "flyai",
  published: "2026-10-09",
  modified: "2026-10-24",
  topic: {
    zh: "读当前月份",
    "zh-TW": "讀目前月份",
    en: "Read the current month",
    ko: "현재 월 읽기",
    ja: "現在の月を読む",
  },
  title: {
    zh: "fly.ai 当前月份怎么对：地址、结束时间与钱包份额",
    "zh-TW": "fly.ai 目前月份怎麼對：地址、結束時間與錢包份額",
    en: "How to read the current fly.ai month: address, end time and wallet share",
    ko: "fly.ai 현재 월 읽기: 주소, 종료 시각, 지갑 몫",
    ja: "fly.aiの現在の月の見方：アドレス、終了時刻、ウォレットシェア",
  },
  description: {
    zh: "在 fly.ai 监控页用公开 0x 收益地址查看当前积分月份、该地址的月积分和份额。份额是积分占比，不是美元，也不是单机今日收入。",
    "zh-TW":
      "在 fly.ai 監控頁用公開 0x 收益地址查看目前積分月份、該地址的月積分和份額。份額是積分占比，不是美元，也不是單機今日收入。",
    en: "Look up a public 0x payout address to see the points month, that address’s month points, and its share. Share is a fraction of points, not dollars or one machine’s day.",
    ko: "공개 0x 수령 주소로 포인트 집계 월, 그 주소의 월 포인트와 몫을 봅니다. 몫은 포인트 비율이며 달러나 기기 하루 수입이 아닙니다.",
    ja: "公開0x受取アドレスでポイント集計月、そのアドレスの月間ポイントとシェアを見ます。シェアはポイントの割合であり、ドルでも1台の本日分でもありません。",
  },
  summary: {
    zh: "先对上公开收益地址和积分月份，再读该地址的月积分和份额。结束时间来自同一份公开月份记录。缺地址不等于机器离线。",
    "zh-TW":
      "先對上公開收益地址和積分月份，再讀該地址的月積分和份額。結束時間來自同一份公開月份記錄。缺地址不等於機器離線。",
    en: "Match the public payout address and the points month, then read that address’s points and share. The end time is on the same public month record. A missing address is not an offline machine.",
    ko: "공개 수령 주소와 포인트 월을 맞춘 뒤 그 주소의 포인트와 몫을 읽습니다. 종료 시각은 같은 공개 월 기록에 있습니다. 주소가 없다고 기기가 꺼진 것은 아닙니다.",
    ja: "公開受取アドレスとポイント月を合わせてから、そのポイントとシェアを読みます。終了時刻は同じ公開月次記録にあります。アドレスが無いことは機器の停止ではありません。",
  },
  sources,
  related: [
    "flyai-public-wallet-vs-token",
    "flyai-monthly-points-vs-income",
    "flyai-zero-points-data-delay",
  ],
  comparisonTitle: {
    zh: "当前月份里要分开看的数",
    "zh-TW": "目前月份裡要分開看的數",
    en: "Figures to keep separate",
    ko: "따로 볼 숫자",
    ja: "分けて見る数字",
  },
  comparison: {
    zh: {
      headers: ["你看到的", "含义", "不能当成"],
      rows: [
        ["积分月份", "这份公开月份记录的 YYYY-MM", "你可以改选的历史月份"],
        ["结束时间", "该月份记录写明的结束时刻", "某一台机器的关机时间"],
        ["本月总积分", "列表中各钱包积分的合计", "你的地址已经能领取的金额"],
        ["地址月积分", "这个公开地址在该月的积分", "单台电脑今天的收入"],
        ["份额", "该地址积分占本月总积分的比例", "美元、USDC 或已打款"],
      ],
    },
    "zh-TW": {
      headers: ["你看到的", "含義", "不能當成"],
      rows: [
        ["積分月份", "這份公開月份記錄的 YYYY-MM", "你可以改選的歷史月份"],
        ["結束時間", "該月份記錄寫明的結束時刻", "某一台機器的關機時間"],
        ["本月總積分", "清單中各錢包積分的合計", "你的地址已經能領取的金額"],
        ["地址月積分", "這個公開地址在該月的積分", "單台電腦今天的收入"],
        ["份額", "該地址積分占本月總積分的比例", "美元、USDC 或已打款"],
      ],
    },
    en: {
      headers: ["What you see", "What it means", "What it is not"],
      rows: [
        ["Points month", "YYYY-MM on this public month record", "A past month you can switch to"],
        ["End time", "The close time written on that month record", "When one PC powered off"],
        [
          "Month total points",
          "Sum of points across listed wallets",
          "Cash your address can claim",
        ],
        [
          "Address points",
          "This public address’s points for that month",
          "One computer’s income today",
        ],
        [
          "Share",
          "This address’s fraction of the month’s points",
          "USD, USDC, or a completed payout",
        ],
      ],
    },
    ko: {
      headers: ["보이는 값", "의미", "이것이 아닌 것"],
      rows: [
        ["포인트 월", "이 공개 월 기록의 YYYY-MM", "과거 월로 바꾸는 선택"],
        ["종료 시각", "그 월 기록에 적힌 마감 시각", "PC 한 대의 종료 시각"],
        ["월 총 포인트", "목록에 있는 지갑 포인트의 합", "주소가 이미 받을 수 있는 금액"],
        ["주소 월 포인트", "이 공개 주소의 그 달 포인트", "컴퓨터 한 대의 오늘 수입"],
        ["몫", "월 총 포인트 중 이 주소의 비율", "달러, USDC, 완료된 지급"],
      ],
    },
    ja: {
      headers: ["見える値", "意味", "これではないもの"],
      rows: [
        ["ポイント月", "この公開月次記録の YYYY-MM", "過去の月へ切り替える操作"],
        ["終了時刻", "その月次記録に書かれた締め時刻", "PC 1台の電源オフ時刻"],
        ["月間総ポイント", "一覧にあるウォレットのポイント合計", "すでに請求できる金額"],
        ["アドレスの月間ポイント", "この公開アドレスのその月のポイント", "PC 1台の本日の収入"],
        ["シェア", "月間総ポイントに対するこのアドレスの割合", "米ドル、USDC、完了した支払い"],
      ],
    },
  },
  questions: {
    zh: [
      {
        question: "监控页要贴哪一种地址？",
        answer:
          "贴 fly.ai Compute 页面上的公开收益地址，形式是 0x 加 40 位十六进制字符。不要贴矿工程序的密钥或登录口令。",
      },
      {
        question: "结束时间在哪里？",
        answer:
          "结束时间写在同一份公开月份记录上。2026-10-24 审阅的记录是 2026-10，结束于 2026-11-01T00:00:00.000Z。监控页显示积分月份；月份对不上时，不要把屏幕上的积分当成另一个月。",
      },
      {
        question: "份额 0.02 是两分钱吗？",
        answer: "不是。0.02 表示约占该月总积分的 2%。它不是美元，也不是已经打到链上的金额。",
      },
      {
        question: "本月总积分是我的收入吗？",
        answer: "不是。它是当前月份列表里各公开钱包积分的合计。你的数是匹配到的那一行地址积分。",
      },
      {
        question: "地址不在列表里说明机器坏了吗？",
        answer:
          "不能这么判断。它只说明这个地址不在当前月份的公开钱包列表里。单台机器是否在跑，回到官方 Compute 页面看。",
      },
      {
        question: "可以改看上个月吗？",
        answer:
          "这个监控只读当前这一份月份记录，没有切换历史月份的操作。上个月要到 fly.ai 自己的记录里查。",
      },
    ],
    "zh-TW": [
      {
        question: "監控頁要貼哪一種地址？",
        answer:
          "貼 fly.ai Compute 頁面上的公開收益地址，形式是 0x 加 40 位十六進位字元。不要貼礦工程式的金鑰或登入口令。",
      },
      {
        question: "結束時間在哪裡？",
        answer:
          "結束時間寫在同一份公開月份記錄上。2026-10-24 審閱的記錄是 2026-10，結束於 2026-11-01T00:00:00.000Z。監控頁顯示積分月份；月份對不上時，不要把畫面上的積分當成另一個月。",
      },
      {
        question: "份額 0.02 是兩分錢嗎？",
        answer: "不是。0.02 表示約占該月總積分的 2%。它不是美元，也不是已經打到鏈上的金額。",
      },
      {
        question: "本月總積分是我的收入嗎？",
        answer: "不是。它是目前月份清單裡各公開錢包積分的合計。你的數是對到的那一列地址積分。",
      },
      {
        question: "地址不在清單裡表示機器壞了嗎？",
        answer:
          "不能這樣判斷。它只表示這個地址不在目前月份的公開錢包清單裡。單台機器是否在跑，回到官方 Compute 頁面看。",
      },
      {
        question: "可以改看上個月嗎？",
        answer:
          "這個監控只讀目前這一份月份記錄，沒有切換歷史月份的操作。上個月要到 fly.ai 自己的記錄裡查。",
      },
    ],
    en: [
      {
        question: "Which address do I paste?",
        answer:
          "Paste the public payout address from the fly.ai Compute page: 0x plus 40 hexadecimal characters. Do not paste a miner secret or a sign-in password.",
      },
      {
        question: "Where is the end time?",
        answer:
          "It is on the same public month record. The record reviewed on 24 October 2026 was month 2026-10 and ended at 2026-11-01T00:00:00.000Z. The monitor shows the points month. If that month is not the one you mean, do not treat the points as another month.",
      },
      {
        question: "Is a share of 0.02 two cents?",
        answer:
          "No. 0.02 means about 2% of that month’s points. It is not dollars and not an amount already sent on-chain.",
      },
      {
        question: "Is the month total my income?",
        answer:
          "No. It is the sum of points for the public wallets in the current month list. Your figure is the points on the matching address row.",
      },
      {
        question: "Does a missing address mean the PC is down?",
        answer:
          "No. It means that address is not in the current month’s public wallet list. Check whether the machine is running on the official Compute page.",
      },
      {
        question: "Can I switch to last month?",
        answer:
          "This monitor reads the current month record only. There is no control to open an older month. Use fly.ai’s own records for a past month.",
      },
    ],
    ko: [
      {
        question: "어떤 주소를 붙여 넣나요?",
        answer:
          "fly.ai Compute 페이지의 공개 수령 주소를 넣습니다. 형식은 0x와 16진수 40자입니다. 채굴 프로그램 비밀이나 로그인 비밀번호는 넣지 마세요.",
      },
      {
        question: "종료 시각은 어디에 있나요?",
        answer:
          "같은 공개 월 기록에 있습니다. 2026-10-24에 본 기록은 2026-10이며 2026-11-01T00:00:00.000Z에 끝났습니다. 모니터는 포인트 월을 보여 줍니다. 그 월이 원하는 달이 아니면 화면의 포인트를 다른 달로 읽지 마세요.",
      },
      {
        question: "몫 0.02는 2센트인가요?",
        answer:
          "아닙니다. 0.02는 그 달 총 포인트의 약 2%입니다. 달러도, 이미 체인으로 보낸 금액도 아닙니다.",
      },
      {
        question: "월 총 포인트가 내 수입인가요?",
        answer:
          "아닙니다. 현재 월 목록에 있는 공개 지갑 포인트의 합입니다. 내 숫자는 일치한 주소 행의 포인트입니다.",
      },
      {
        question: "주소가 없으면 PC가 꺼진 것인가요?",
        answer:
          "아닙니다. 그 주소가 현재 월 공개 지갑 목록에 없다는 뜻입니다. 기기가 돌아가는지는 공식 Compute 페이지에서 확인하세요.",
      },
      {
        question: "지난달로 바꿀 수 있나요?",
        answer:
          "이 모니터는 현재 월 기록만 읽습니다. 이전 월을 여는 조작은 없습니다. 지난달은 fly.ai 쪽 기록에서 보세요.",
      },
    ],
    ja: [
      {
        question: "どのアドレスを貼りますか？",
        answer:
          "fly.ai Compute ページの公開受取アドレスです。形式は 0x と 16 進 40 文字です。マイナーの秘密やログインパスワードは貼らないでください。",
      },
      {
        question: "終了時刻はどこにありますか？",
        answer:
          "同じ公開月次記録にあります。2026-10-24 に確認した記録は 2026-10 で、終了は 2026-11-01T00:00:00.000Z でした。モニターはポイント月を表示します。その月が意図した月でなければ、画面のポイントを別の月として読まないでください。",
      },
      {
        question: "シェア 0.02 は 2 セントですか？",
        answer:
          "違います。0.02 はその月の総ポイントの約 2% です。米ドルでも、すでにチェーンへ送った金額でもありません。",
      },
      {
        question: "月間総ポイントは自分の収入ですか？",
        answer:
          "違います。現在の月の一覧にある公開ウォレットのポイント合計です。自分の数字は一致したアドレス行のポイントです。",
      },
      {
        question: "アドレスが無いのは PC が止まっている意味ですか？",
        answer:
          "違います。そのアドレスが現在の月の公開ウォレット一覧に無いという意味です。機器が動いているかは公式 Compute ページで確認します。",
      },
      {
        question: "先月に切り替えられますか？",
        answer:
          "このモニターは現在の月次記録だけを読みます。過去の月を開く操作はありません。先月は fly.ai 側の記録で確認してください。",
      },
    ],
  },
  body: {
    zh: [
      "fly.ai 监控回答的是：当前这份公开月份里，这个收益地址有多少积分、占多少份额。打开 [fly.ai 监控](/projects/flyai)，贴上 0x 开头的公开地址，先看积分月份，再看该地址的月积分和份额。份额是积分比例，不是美元，也不是某一台机器的今日收入。",
      "## 这些数字分别是什么",
      "公开月份记录带有月份（YYYY-MM）和结束时间。2026-10-24 审阅的那一份是月份 2026-10，结束时间 2026-11-01T00:00:00.000Z。监控页展示积分月份、本月总积分，以及列表中的公开钱包数量。总积分和钱包数量描述的是整个月份，不是你的可领取金额。当地址对上、且记录中的月份与香港时区的当前日历月一致时，已保存的地址会显示月积分，以及由份额换算的百分比。",
      "## 对照时看什么",
      "- 从官方 Compute 页面复制收益地址，连同 0x 和全部 40 位十六进制字符。",
      "- 贴到 fly.ai 监控。这里只查公开地址。",
      "- 先读积分月份。月份不是你要的那一个月时，屏幕上的积分就不是那一个月。",
      "- 再读地址月积分。它是这个钱包在该月的合计。",
      "- 最后读份额。0.02 大约是该月总积分的 2%，不是 0.02 美元。",
      "## 地址不在列表时",
      "地址缺失只表示它不在当前月份的公开钱包列表中。这不能说明电脑已经离线，也不会自动变成一笔零收入。回到官方 Compute 页面确认钱包已连接。fly.ai 写明：钱包未连接时，积分无法支付；通过检查的工作获得积分，每个月按积分分割 $FLYAI 池。",
      "## 举例",
      "举例，不是真实钱包：积分 100、份额 0.02，表示 100 个月积分，以及大约 2% 的月份积分占比。这不是可提现金额，也不是一块 GPU 的“今天”。",
      "## 下一步",
      "打开 [fly.ai 监控](/projects/flyai)。公开地址和矿工程序密钥的差别见 [公开钱包与密钥](/learn/flyai-public-wallet-vs-token)。积分为什么不是收入见 [月积分与收入](/learn/flyai-monthly-points-vs-income)。",
      "监控不能改看更早的月份，不能把一个钱包拆成每台机器的收入，也不会代替你在 Robinhood Chain 上领取。领取留在 fly.ai 自己的流程里。",
    ],
    "zh-TW": [
      "fly.ai 監控回答的是：目前這份公開月份裡，這個收益地址有多少積分、占多少份額。打開 [fly.ai 監控](/projects/flyai)，貼上 0x 開頭的公開地址，先看積分月份，再看該地址的月積分和份額。份額是積分比例，不是美元，也不是某一台機器的今日收入。",
      "## 這些數字分別是什麼",
      "公開月份記錄帶有月份（YYYY-MM）和結束時間。2026-10-24 審閱的那一份是月份 2026-10，結束時間 2026-11-01T00:00:00.000Z。監控頁展示積分月份、本月總積分，以及清單中的公開錢包數量。總積分和錢包數量描述的是整個月份，不是你的可領取金額。當地址對上、且記錄中的月份與香港時區的目前日曆月一致時，已儲存的地址會顯示月積分，以及由份額換算的百分比。",
      "## 對照時看什麼",
      "- 從官方 Compute 頁面複製收益地址，連同 0x 和全部 40 位十六進位字元。",
      "- 貼到 fly.ai 監控。這裡只查公開地址。",
      "- 先讀積分月份。月份不是你要的那一個月時，畫面上的積分就不是那一個月。",
      "- 再讀地址月積分。它是這個錢包在該月的合計。",
      "- 最後讀份額。0.02 大約是該月總積分的 2%，不是 0.02 美元。",
      "## 地址不在清單時",
      "地址缺失只表示它不在目前月份的公開錢包清單中。這不能說明電腦已經離線，也不會自動變成一筆零收入。回到官方 Compute 頁面確認錢包已連接。fly.ai 寫明：錢包未連接時，積分無法支付；通過檢查的工作獲得積分，每個月按積分分割 $FLYAI 池。",
      "## 舉例",
      "舉例，不是真實錢包：積分 100、份額 0.02，表示 100 個月積分，以及大約 2% 的月份積分占比。這不是可提領金額，也不是一塊 GPU 的「今天」。",
      "## 下一步",
      "打開 [fly.ai 監控](/projects/flyai)。公開地址和礦工程式金鑰的差別見 [公開錢包與金鑰](/learn/flyai-public-wallet-vs-token)。積分為什麼不是收入見 [月積分與收入](/learn/flyai-monthly-points-vs-income)。",
      "監控不能改看更早的月份，不能把一個錢包拆成每台機器的收入，也不會代替你在 Robinhood Chain 上領取。領取留在 fly.ai 自己的流程裡。",
    ],
    en: [
      "The fly.ai monitor answers one question: in the current public month, how many points does this payout address have, and what share is that. Open [fly.ai monitoring](/projects/flyai), paste the public address that starts with 0x, and read the points month before the address points and the share. Share is a fraction of points. It is not dollars, and it is not one machine’s income for today.",
      "## What each figure is",
      "The public month record carries a month (YYYY-MM) and an end time. The record reviewed on 24 October 2026 was month 2026-10, ending at 2026-11-01T00:00:00.000Z. The monitor shows the points month, the month’s total points, and how many public wallets are listed. The total and the wallet count describe the whole month, not cash you can claim. When the address matches and the record’s month is the current calendar month in Hong Kong time, a saved address shows its month points and the share as a percent.",
      "## What to line up",
      "- Copy the payout address from the official Compute page, including 0x and all 40 hex characters.",
      "- Paste it on the fly.ai monitor. The lookup is the public address only.",
      "- Read the points month first. If it is not the month you mean, the points on screen are not that other month.",
      "- Read the address points next. They are that wallet’s total for the month.",
      "- Read the share last. 0.02 is about 2% of the month’s points, not 0.02 dollars.",
      "## When the address is missing",
      "A missing address means it is not in the current month’s public wallet list. That does not show the computer is offline, and it does not invent a zero payout. Return to the official Compute page and confirm the wallet is linked. fly.ai states that credit cannot be paid when the wallet is not linked, and that checked work earns points which later split a $FLYAI pool.",
      "## Example",
      "Illustrative, not a live wallet: points 100 and share 0.02 mean 100 month points and about 2% of that month’s points. They are not withdrawable cash and not “today” for one GPU.",
      "## Next step",
      "Open [fly.ai monitoring](/projects/flyai). The difference between the public address and a miner secret is in [public wallet vs token](/learn/flyai-public-wallet-vs-token). Why points are not income is in [monthly points vs income](/learn/flyai-monthly-points-vs-income).",
      "The monitor cannot open an older month, cannot split one wallet into per-machine income, and does not claim on Robinhood Chain for you. Claiming stays in fly.ai’s own flow.",
    ],
    ko: [
      "fly.ai 모니터가 답하는 질문은 하나입니다. 현재 공개 월에서 이 수령 주소의 포인트와 몫이 얼마인가입니다. [fly.ai 모니터링](/projects/flyai)을 열고 0x로 시작하는 공개 주소를 붙인 뒤, 주소 포인트와 몫보다 먼저 포인트 월을 읽습니다. 몫은 포인트 비율입니다. 달러가 아니고, 기기 한 대의 오늘 수입도 아닙니다.",
      "## 각 숫자가 무엇인가",
      "공개 월 기록에는 월(YYYY-MM)과 종료 시각이 있습니다. 2026-10-24에 본 기록은 2026-10이며 종료는 2026-11-01T00:00:00.000Z였습니다. 모니터는 포인트 월, 월 총 포인트, 공개 지갑 수를 보여 줍니다. 총합과 지갑 수는 그 달 전체를 말하며, 청구할 수 있는 현금이 아닙니다. 주소가 맞고 기록의 월이 홍콩 시각의 현재 달력 월과 같으면, 저장한 주소에 월 포인트와 백분율로 바꾼 몫이 나옵니다.",
      "## 맞출 것",
      "- 공식 Compute 페이지에서 수령 주소를 복사합니다. 0x와 16진수 40자를 모두 포함합니다.",
      "- fly.ai 모니터에 붙입니다. 조회는 공개 주소만 사용합니다.",
      "- 포인트 월을 먼저 읽습니다. 원하는 달이 아니면 화면의 포인트는 그 다른 달이 아닙니다.",
      "- 다음으로 주소의 월 포인트를 읽습니다. 그 지갑의 그 달 합계입니다.",
      "- 마지막으로 몫을 읽습니다. 0.02는 그 달 총 포인트의 약 2%이며 0.02달러가 아닙니다.",
      "## 주소가 목록에 없을 때",
      "주소가 없으면 현재 월 공개 지갑 목록에 없다는 뜻입니다. 컴퓨터가 꺼졌다는 뜻이 아니고, 0원 지급이 생긴 것도 아닙니다. 공식 Compute 페이지에서 지갑이 연결됐는지 확인하세요. fly.ai는 지갑이 연결되지 않으면 크레딧을 지급할 수 없고, 검사된 작업이 포인트를 받으며 매달 그 포인트로 $FLYAI 풀을 나눈다고 적습니다.",
      "## 예시",
      "예시이며 실제 지갑이 아닙니다. 포인트 100, 몫 0.02는 월 포인트 100과 그 달 포인트의 약 2%입니다. 출금 가능한 현금도, GPU 한 개의 「오늘」도 아닙니다.",
      "## 다음 단계",
      "[fly.ai 모니터링](/projects/flyai)을 엽니다. 공개 주소와 채굴 비밀의 차이는 [공개 지갑과 토큰](/learn/flyai-public-wallet-vs-token)에 있습니다. 포인트가 수입이 아닌 이유는 [월 포인트와 수입](/learn/flyai-monthly-points-vs-income)에 있습니다.",
      "모니터는 이전 월을 열 수 없고, 지갑 하나를 기기별 수입으로 나누지 않으며, Robinhood Chain에서 대신 청구하지 않습니다. 청구는 fly.ai 자신의 절차에 남습니다.",
    ],
    ja: [
      "fly.ai モニターが答える問いは一つです。現在の公開月で、この受取アドレスのポイントとシェアはいくらか。 [fly.ai モニタリング](/projects/flyai) を開き、0x で始まる公開アドレスを貼り、アドレスのポイントとシェアの前にポイント月を読みます。シェアはポイントの割合です。ドルではなく、1台の本日の収入でもありません。",
      "## 各数字の意味",
      "公開月次記録には月（YYYY-MM）と終了時刻があります。2026-10-24 に確認した記録は 2026-10 で、終了は 2026-11-01T00:00:00.000Z でした。モニターはポイント月、月間総ポイント、公開ウォレット数を表示します。合計と件数はその月全体のことで、請求できる現金ではありません。アドレスが一致し、記録の月が香港時間の現在の暦月と同じとき、保存したアドレスには月間ポイントと、シェアを百分率にした値が表示されます。",
      "## 突き合わせるもの",
      "- 公式 Compute ページから受取アドレスをコピーします。0x と 16 進 40 文字をすべて含めます。",
      "- fly.ai モニターに貼ります。照会するのは公開アドレスだけです。",
      "- ポイント月を先に読みます。意図した月でなければ、画面のポイントはその別の月ではありません。",
      "- 次にアドレスの月間ポイントを読みます。そのウォレットのその月の合計です。",
      "- 最後にシェアを読みます。0.02 はその月の総ポイントの約 2% であり、0.02 ドルではありません。",
      "## アドレスが一覧に無いとき",
      "無いアドレスは、現在の月の公開ウォレット一覧に無いという意味です。パソコンがオフラインだと示すものではなく、ゼロの支払が作られるわけでもありません。公式 Compute ページでウォレットが接続されているか確認してください。fly.ai は、ウォレット未接続ではクレジットを支払えず、検査を通った作業がポイントを獲得し、毎月そのポイントで $FLYAI プールを分けると述べています。",
      "## 例",
      "例示であり、実在のウォレットではありません。ポイント 100、シェア 0.02 は、月間ポイント 100 とその月のポイントの約 2% です。出金できる現金でも、GPU 1枚の「今日」でもありません。",
      "## 次にすること",
      "[fly.ai モニタリング](/projects/flyai) を開きます。公開アドレスとマイナー秘密の違いは [公開ウォレットとトークン](/learn/flyai-public-wallet-vs-token) にあります。ポイントが収入でない理由は [月間ポイントと収入](/learn/flyai-monthly-points-vs-income) にあります。",
      "モニターは過去の月を開けず、一つのウォレットを機器ごとの収入に分けず、Robinhood Chain で代わりに請求しません。請求は fly.ai 自身の手順に残します。",
    ],
  },
};

const walletVsToken: Article = {
  slug: "flyai-public-wallet-vs-token",
  project: "flyai",
  published: "2026-10-24",
  modified: "2026-10-24",
  topic: {
    zh: "地址与密钥",
    "zh-TW": "地址與金鑰",
    en: "Address and secret",
    ko: "주소와 비밀",
    ja: "アドレスと秘密",
  },
  title: {
    zh: "fly.ai 的公开 0x 钱包不是矿工程序密钥",
    "zh-TW": "fly.ai 的公開 0x 錢包不是礦工程式金鑰",
    en: "A fly.ai public 0x wallet is not the miner secret",
    ko: "fly.ai 공개 0x 지갑은 채굴 비밀이 아닙니다",
    ja: "fly.aiの公開0xウォレットはマイナー秘密ではない",
  },
  description: {
    zh: "IOTA Watch 的 fly.ai 只接受公开收益地址。矿机或浏览器会话用的 Bearer 密钥不能粘贴进来，也不能当成可查询的钱包。",
    "zh-TW":
      "IOTA Watch 的 fly.ai 只接受公開收益地址。礦機或瀏覽器工作階段用的 Bearer 金鑰不能貼進來，也不能當成可查詢的錢包。",
    en: "fly.ai in IOTA Watch accepts only the public payout address. A bearer secret used by the miner or the browser session is not a wallet you can look up.",
    ko: "IOTA Watch의 fly.ai는 공개 수령 주소만 받습니다. 채굴기나 브라우저 세션의 Bearer 비밀은 조회할 지갑이 아닙니다.",
    ja: "IOTA Watch の fly.ai は公開受取アドレスだけを受け付けます。マイナーやブラウザセッションの Bearer 秘密は照会できるウォレットではありません。",
  },
  summary: {
    zh: "0x 加 40 位十六进制是公开收益地址。一长串密钥是程序凭证。监控只用前者，在当前月份列表里找同一地址。",
    "zh-TW":
      "0x 加 40 位十六進位是公開收益地址。一長串金鑰是程式憑證。監控只用前者，在目前月份清單裡找同一地址。",
    en: "0x plus 40 hex characters is the public payout address. A long secret is a program credential. The monitor uses only the address and finds that same row in the current month list.",
    ko: "0x와 16진수 40자는 공개 수령 주소입니다. 긴 비밀은 프로그램 자격 증명입니다. 모니터는 주소만 쓰고 현재 월 목록에서 그 행을 찾습니다.",
    ja: "0x と 16 進 40 文字が公開受取アドレスです。長い秘密はプログラムの資格情報です。モニターはアドレスだけを使い、現在の月の一覧で同じ行を探します。",
  },
  sources,
  related: ["flyai-monitor-guide", "flyai-multiple-machines-one-wallet"],
  comparisonTitle: {
    zh: "两种字符串不要混用",
    "zh-TW": "兩種字串不要混用",
    en: "Two strings, two jobs",
    ko: "두 문자열의 역할",
    ja: "二つの文字列の役割",
  },
  comparison: {
    zh: {
      headers: ["你复制到的东西", "看起来像", "在监控里"],
      rows: [
        ["Compute 页面的收益地址", "0x 加 40 位十六进制", "可以查询当前月份的积分和份额"],
        ["未连接的钱包提示", "官方写明此时积分无法支付", "月份列表里可能还没有这一行"],
        ["矿工程序或会话密钥", "不是 0x 地址的一长串凭证", "不要粘贴；监控不接受"],
        ["同一地址的第二台机器", "仍然是同一个 0x", "不会变成第二份月积分"],
      ],
    },
    "zh-TW": {
      headers: ["你複製到的東西", "看起來像", "在監控裡"],
      rows: [
        ["Compute 頁面的收益地址", "0x 加 40 位十六進位", "可以查詢目前月份的積分和份額"],
        ["未連接的錢包提示", "官方寫明此時積分無法支付", "月份清單裡可能還沒有這一列"],
        ["礦工程式或工作階段金鑰", "不是 0x 地址的一長串憑證", "不要貼上；監控不接受"],
        ["同一地址的第二台機器", "仍然是同一個 0x", "不會變成第二份月積分"],
      ],
    },
    en: {
      headers: ["What you copied", "What it looks like", "On the monitor"],
      rows: [
        [
          "Payout address on Compute",
          "0x plus 40 hex characters",
          "Looks up this month’s points and share",
        ],
        [
          "Wallet not linked",
          "fly.ai says credit cannot be paid",
          "The month list may have no row yet",
        ],
        [
          "Miner or session secret",
          "A long credential that is not a 0x address",
          "Do not paste it; the monitor rejects it",
        ],
        [
          "A second machine, same address",
          "Still the same 0x",
          "Does not create a second month-point total",
        ],
      ],
    },
    ko: {
      headers: ["복사한 것", "형태", "모니터에서"],
      rows: [
        ["Compute의 수령 주소", "0x와 16진수 40자", "이번 달 포인트와 몫을 조회"],
        [
          "지갑 미연결",
          "fly.ai는 이때 크레딧을 지급할 수 없다고 씀",
          "월 목록에 행이 아직 없을 수 있음",
        ],
        [
          "채굴기 또는 세션 비밀",
          "0x 주소가 아닌 긴 자격 증명",
          "붙이지 말 것. 모니터가 받지 않음",
        ],
        ["같은 주소의 두 번째 기기", "여전히 같은 0x", "월 포인트가 두 배가 되지 않음"],
      ],
    },
    ja: {
      headers: ["コピーしたもの", "形", "モニターでは"],
      rows: [
        ["Compute の受取アドレス", "0x と 16 進 40 文字", "今月のポイントとシェアを照会する"],
        [
          "ウォレット未接続",
          "fly.ai はクレジットを支払えないと書く",
          "月次一覧に行がまだ無いことがある",
        ],
        [
          "マイナーまたはセッション秘密",
          "0x アドレスではない長い資格情報",
          "貼らない。モニターは受け付けない",
        ],
        ["同じアドレスの 2 台目", "同じ 0x のまま", "月間ポイントは二倍にならない"],
      ],
    },
  },
  questions: {
    zh: [
      {
        question: "Bearer 密钥贴进去能看到积分吗？",
        answer:
          "不能。监控只接受 0x 加 40 位十六进制的公开收益地址。密钥不是月份列表里的钱包行，也不应交给这个页面。",
      },
      {
        question: "地址和密钥可以互相代替吗？",
        answer:
          "不可以。地址用来在公开月份里对积分。密钥是官方矿工程序自己的凭证。弄丢或公开密钥，应在 fly.ai 侧处理，而不是换一个监控页面。",
      },
      {
        question: "钱包还没连接时，地址查不到正常吗？",
        answer:
          "有可能。官方写明钱包未连接时积分无法支付。月份列表没有这一行，只说明当前月份还没有该公开地址的积分记录。",
      },
    ],
    "zh-TW": [
      {
        question: "Bearer 金鑰貼進去能看到積分嗎？",
        answer:
          "不能。監控只接受 0x 加 40 位十六進位的公開收益地址。金鑰不是月份清單裡的錢包列，也不應交給這個頁面。",
      },
      {
        question: "地址和金鑰可以互相代替嗎？",
        answer:
          "不可以。地址用來在公開月份裡對積分。金鑰是官方礦工程式自己的憑證。遺失或公開金鑰，應在 fly.ai 側處理，而不是換一個監控頁面。",
      },
      {
        question: "錢包還沒連接時，地址查不到正常嗎？",
        answer:
          "有可能。官方寫明錢包未連接時積分無法支付。月份清單沒有這一列，只說明目前月份還沒有該公開地址的積分記錄。",
      },
    ],
    en: [
      {
        question: "Will a bearer secret show my points?",
        answer:
          "No. The monitor accepts only a public payout address: 0x plus 40 hex characters. A secret is not a wallet row in the month list, and it should not be given to this page.",
      },
      {
        question: "Can the address and the secret stand in for each other?",
        answer:
          "No. The address is what you match in the public month. The secret is the official miner’s own credential. If that secret is lost or exposed, deal with it on fly.ai, not by switching monitor pages.",
      },
      {
        question: "Is a missing row normal when the wallet is not linked?",
        answer:
          "It can be. fly.ai says credit cannot be paid while the wallet is not linked. No row means the current month has no point record for that public address.",
      },
    ],
    ko: [
      {
        question: "Bearer 비밀을 붙이면 포인트가 보이나요?",
        answer:
          "아닙니다. 모니터는 0x와 16진수 40자의 공개 수령 주소만 받습니다. 비밀은 월 목록의 지갑 행이 아니며 이 페이지에 넣으면 안 됩니다.",
      },
      {
        question: "주소와 비밀을 서로 대신할 수 있나요?",
        answer:
          "없습니다. 주소는 공개 월에서 포인트를 맞추는 값입니다. 비밀은 공식 채굴 프로그램의 자격 증명입니다. 비밀을 잃거나 노출하면 모니터를 바꾸는 것이 아니라 fly.ai 쪽에서 처리합니다.",
      },
      {
        question: "지갑이 연결되지 않았을 때 행이 없는 것이 정상인가요?",
        answer:
          "그럴 수 있습니다. fly.ai는 지갑이 연결되지 않으면 크레딧을 지급할 수 없다고 씁니다. 행이 없으면 현재 월에 그 공개 주소의 포인트 기록이 없다는 뜻입니다.",
      },
    ],
    ja: [
      {
        question: "Bearer 秘密を貼るとポイントが見えますか？",
        answer:
          "見えません。モニターが受けるのは 0x と 16 進 40 文字の公開受取アドレスだけです。秘密は月次一覧のウォレット行ではなく、このページに渡すべきではありません。",
      },
      {
        question: "アドレスと秘密は互いに代用できますか？",
        answer:
          "できません。アドレスは公開月でポイントを突き合わせる値です。秘密は公式マイナー自身の資格情報です。秘密を失った、または公開してしまった場合は、モニターを替えるのではなく fly.ai 側で扱います。",
      },
      {
        question: "ウォレット未接続で行が無いのは普通ですか？",
        answer:
          "あり得ます。fly.ai はウォレット未接続ではクレジットを支払えないと述べています。行が無いのは、現在の月にその公開アドレスのポイント記録が無いという意味です。",
      },
    ],
  },
  body: {
    zh: [
      "要查 fly.ai 的月积分，粘贴公开收益地址，不要粘贴矿工程序的 Bearer 密钥。打开 [fly.ai 监控](/projects/flyai) 时，能通过的是 0x 加 40 位十六进制字符。密钥即使很长，也不是月份列表里的钱包。",
      "## 两个字符串各做什么",
      "公开地址出现在官方 Compute 页面的钱包连接处，也出现在公开月份记录的钱包行里。监控用它找出同一地址的积分和份额。Bearer 密钥是矿工程序或浏览器会话用来证明“这是我的矿机”的凭证。它不会变成可查询的 0x 地址，监控页面也不保存它。",
      "## 贴之前核对",
      "- 字符串以 0x 开头，后面正好 40 位 0-9 或 a-f。",
      "- 它和 Compute 页面上显示的收益地址逐字相同。",
      "- 它不是安装说明、请求头或本地配置里单独出现的一长串密钥。",
      "- 钱包状态不是“未连接”。官方写明未连接时积分无法支付。",
      "## 贴错时怎么分支",
      "如果粘贴的不是 0x 地址，保存设备时不会把它当成 fly.ai 收益地址。改回 Compute 页面上的公开地址再保存。如果地址格式正确但月份列表没有这一行，回到官方页面连接钱包，并确认已经有通过检查的工作；不要改贴密钥再试一次。",
      "## 举例",
      "举例，不是真实凭证：`0x` 后跟 40 位十六进制可以保存并查询。一串不以 `0x` 开头的 Bearer 文本不能当作这个地址。两台机器共用前一个地址时，月份积分仍是一行，见 [多台机器同一个钱包](/learn/flyai-multiple-machines-one-wallet)。",
      "## 下一步",
      "只把公开地址添加到 [fly.ai 监控](/projects/flyai)。月份字段怎么读见 [当前月份](/learn/flyai-monitor-guide)。密钥若已暴露，在 fly.ai 官方流程里作废并更换，不要把它写进监控、笔记或截图。",
      "监控不能替你连接钱包，也不能用密钥代查积分。未出现在当前月份列表中的地址，没有可显示的月积分。",
    ],
    "zh-TW": [
      "要查 fly.ai 的月積分，貼上公開收益地址，不要貼上礦工程式的 Bearer 金鑰。打開 [fly.ai 監控](/projects/flyai) 時，能通過的是 0x 加 40 位十六進位字元。金鑰即使很長，也不是月份清單裡的錢包。",
      "## 兩個字串各做什麼",
      "公開地址出現在官方 Compute 頁面的錢包連接處，也出現在公開月份記錄的錢包列裡。監控用它找出同一地址的積分和份額。Bearer 金鑰是礦工程式或瀏覽器工作階段用來證明「這是我的礦機」的憑證。它不會變成可查詢的 0x 地址，監控頁面也不保存它。",
      "## 貼之前核對",
      "- 字串以 0x 開頭，後面正好 40 位 0-9 或 a-f。",
      "- 它和 Compute 頁面上顯示的收益地址逐字相同。",
      "- 它不是安裝說明、請求標頭或本機設定裡單獨出現的一長串金鑰。",
      "- 錢包狀態不是「未連接」。官方寫明未連接時積分無法支付。",
      "## 貼錯時怎麼分支",
      "如果貼上的不是 0x 地址，儲存設備時不會把它當成 fly.ai 收益地址。改回 Compute 頁面上的公開地址再儲存。如果地址格式正確但月份清單沒有這一列，回到官方頁面連接錢包，並確認已經有通過檢查的工作；不要改貼金鑰再試一次。",
      "## 舉例",
      "舉例，不是真實憑證：`0x` 後跟 40 位十六進位可以儲存並查詢。一串不以 `0x` 開頭的 Bearer 文字不能當作這個地址。兩台機器共用前一個地址時，月份積分仍是一列，見 [多台機器同一個錢包](/learn/flyai-multiple-machines-one-wallet)。",
      "## 下一步",
      "只把公開地址添加到 [fly.ai 監控](/projects/flyai)。月份欄位怎麼讀見 [目前月份](/learn/flyai-monitor-guide)。金鑰若已暴露，在 fly.ai 官方流程裡作廢並更換，不要把它寫進監控、筆記或截圖。",
      "監控不能替你連接錢包，也不能用金鑰代查積分。未出現在目前月份清單中的地址，沒有可顯示的月積分。",
    ],
    en: [
      "To see fly.ai month points, paste the public payout address. Do not paste the miner’s bearer secret. On [fly.ai monitoring](/projects/flyai) the value that can be saved is 0x plus 40 hexadecimal characters. A secret, however long, is not a wallet in the month list.",
      "## What each string does",
      "The public address is what the official Compute page shows when you connect a wallet, and it is the wallet field on the public month record. The monitor uses it to find that address’s points and share. A bearer secret is the credential the miner, or the browser session, uses to say which miner it is. It does not become a 0x address the monitor can search, and this page does not store it.",
      "## Check before you paste",
      "- The string starts with 0x and then has exactly 40 characters from 0-9 or a-f.",
      "- It matches the payout address on the Compute page character for character.",
      "- It is not the long secret that appears alone in install notes, a request header, or a local config file.",
      "- The wallet is not sitting on “not linked”. fly.ai says credit cannot be paid in that state.",
      "## Which branch you are on",
      "If the paste is not a 0x address, saving a device will not treat it as a fly.ai payout address. Copy the public address from the Compute page and save that. If the form is valid but the month list has no row, link the wallet on the official page and confirm checked work exists. Do not try again with the secret.",
      "## Example",
      "Illustrative, not a real credential: 0x followed by 40 hex characters can be saved and looked up. A bearer string that does not start with 0x cannot stand in for that address. Two machines that share the address still have one month-point row. See [several machines, one wallet](/learn/flyai-multiple-machines-one-wallet).",
      "## Next step",
      "Add only the public address on [fly.ai monitoring](/projects/flyai). How to read the month fields is in [the current month](/learn/flyai-monitor-guide). If a secret was exposed, revoke and replace it in fly.ai’s own flow. Do not put it in the monitor, a note, or a screenshot.",
      "The monitor cannot link the wallet for you, and it cannot look up points with a secret. An address that is absent from the current month list has no month points to show.",
    ],
    ko: [
      "fly.ai 월 포인트를 보려면 공개 수령 주소를 붙입니다. 채굴 프로그램의 Bearer 비밀은 붙이지 마세요. [fly.ai 모니터링](/projects/flyai)에서 저장할 수 있는 값은 0x와 16진수 40자입니다. 비밀은 아무리 길어도 월 목록의 지갑이 아닙니다.",
      "## 두 문자열의 역할",
      "공개 주소는 공식 Compute 페이지에서 지갑을 연결할 때 보이는 값이고, 공개 월 기록의 지갑 칸이기도 합니다. 모니터는 그 주소의 포인트와 몫을 찾습니다. Bearer 비밀은 채굴기나 브라우저 세션이 어떤 채굴기인지 밝히는 자격 증명입니다. 모니터가 검색할 0x 주소가 되지 않으며, 이 페이지는 그것을 저장하지 않습니다.",
      "## 붙이기 전에",
      "- 문자열이 0x로 시작하고 그 뒤가 0-9 또는 a-f 정확히 40자인지 봅니다.",
      "- Compute 페이지의 수령 주소와 한 글자까지 같은지 봅니다.",
      "- 설치 안내, 요청 헤더, 로컬 설정에만 있는 긴 비밀이 아닌지 봅니다.",
      "- 지갑이 「미연결」이 아닌지 봅니다. fly.ai는 그 상태에서 크레딧을 지급할 수 없다고 씁니다.",
      "## 어느 갈림길인지",
      "붙인 값이 0x 주소가 아니면 기기를 저장할 때 fly.ai 수령 주소로 취급하지 않습니다. Compute 페이지의 공개 주소를 다시 저장하세요. 형식은 맞는데 월 목록에 행이 없으면 공식 페이지에서 지갑을 연결하고, 검사를 통과한 작업이 있는지 확인합니다. 비밀로 다시 시도하지 마세요.",
      "## 예시",
      "예시이며 실제 자격 증명이 아닙니다. 0x 뒤에 16진수 40자가 오면 저장하고 조회할 수 있습니다. 0x로 시작하지 않는 Bearer 문자열은 그 주소를 대신할 수 없습니다. 두 기기가 그 주소를 공유해도 월 포인트는 한 행입니다. [여러 기기, 지갑 하나](/learn/flyai-multiple-machines-one-wallet)를 보세요.",
      "## 다음 단계",
      "공개 주소만 [fly.ai 모니터링](/projects/flyai)에 추가합니다. 월 칸을 읽는 법은 [현재 월](/learn/flyai-monitor-guide)에 있습니다. 비밀이 노출됐으면 fly.ai 공식 절차에서 폐기하고 바꿉니다. 모니터, 메모, 스크린샷에 적지 마세요.",
      "모니터는 지갑을 대신 연결하지 못하고, 비밀로 포인트를 조회하지도 않습니다. 현재 월 목록에 없는 주소는 보여줄 월 포인트가 없습니다.",
    ],
    ja: [
      "fly.ai の月間ポイントを見るには公開受取アドレスを貼ります。マイナーの Bearer 秘密は貼らないでください。[fly.ai モニタリング](/projects/flyai) で保存できるのは 0x と 16 進 40 文字です。秘密はどれほど長くても月次一覧のウォレットではありません。",
      "## 二つの文字列の役割",
      "公開アドレスは、公式 Compute ページでウォレットを接続したときに見える値であり、公開月次記録のウォレット欄でもあります。モニターはそれでそのアドレスのポイントとシェアを探します。Bearer 秘密は、マイナーまたはブラウザセッションがどのマイナーかを示す資格情報です。モニターが検索できる 0x アドレスにはならず、このページはそれを保存しません。",
      "## 貼る前の確認",
      "- 文字列が 0x で始まり、続く 40 文字が 0-9 または a-f であること。",
      "- Compute ページの受取アドレスと一字ずつ同じであること。",
      "- 導入メモ、リクエストヘッダー、ローカル設定にだけ出る長い秘密ではないこと。",
      "- ウォレットが「未接続」ではないこと。fly.ai はその状態ではクレジットを支払えないと述べています。",
      "## どの分岐か",
      "貼った値が 0x アドレスでなければ、デバイス保存時に fly.ai の受取アドレスとして扱いません。Compute ページの公開アドレスを保存し直してください。形式は正しいのに月次一覧に行が無ければ、公式ページでウォレットを接続し、検査を通った作業があるか確認します。秘密でもう一度試さないでください。",
      "## 例",
      "例示であり、実在の資格情報ではありません。0x の後に 16 進 40 文字があれば保存して照会できます。0x で始まらない Bearer の文字列は、そのアドレスの代わりになりません。2台が同じアドレスを共有しても月間ポイントは 1 行のままです。[複数台と一つのウォレット](/learn/flyai-multiple-machines-one-wallet) を見てください。",
      "## 次にすること",
      "公開アドレスだけを [fly.ai モニタリング](/projects/flyai) に追加します。月の欄の読み方は [現在の月](/learn/flyai-monitor-guide) にあります。秘密が露出したら fly.ai の公式手順で無効化し、差し替えます。モニター、メモ、スクリーンショットには書かないでください。",
      "モニターはウォレットを代わりに接続できず、秘密でポイントを照会することもできません。現在の月次一覧に無いアドレスには、表示できる月間ポイントがありません。",
    ],
  },
};

const pointsVsIncome: Article = {
  slug: "flyai-monthly-points-vs-income",
  project: "flyai",
  published: "2026-10-24",
  modified: "2026-10-24",
  topic: {
    zh: "积分不是金额",
    "zh-TW": "積分不是金額",
    en: "Points are not cash",
    ko: "포인트는 금액이 아님",
    ja: "ポイントは金額ではない",
  },
  title: {
    zh: "fly.ai 月积分不是美元：份额要等月份结算后再领",
    "zh-TW": "fly.ai 月積分不是美元：份額要等月份結算後再領",
    en: "fly.ai month points are not dollars: the share is claimed after the month",
    ko: "fly.ai 월 포인트는 달러가 아닙니다. 몫은 월이 끝난 뒤 청구합니다",
    ja: "fly.aiの月間ポイントはドルではない。シェアは月のあとで請求する",
  },
  description: {
    zh: "监控上的月积分和份额是当前月份的计分。fly.ai 按积分分割 $FLYAI 池，并在 Robinhood Chain 上领取。页面不把积分换成美元。",
    "zh-TW":
      "監控上的月積分和份額是目前月份的計分。fly.ai 按積分分割 $FLYAI 池，並在 Robinhood Chain 上領取。頁面不把積分換成美元。",
    en: "Month points and share on the monitor are the current month’s score. fly.ai splits a $FLYAI pool by points and claims on Robinhood Chain. The page does not convert points into dollars.",
    ko: "모니터의 월 포인트와 몫은 현재 월의 점수입니다. fly.ai는 포인트로 $FLYAI 풀을 나누고 Robinhood Chain에서 청구합니다. 페이지는 포인트를 달러로 바꾸지 않습니다.",
    ja: "モニターの月間ポイントとシェアは現在の月の得点です。fly.ai はポイントで $FLYAI プールを分け、Robinhood Chain で請求します。ページはポイントをドルに換えません。",
  },
  summary: {
    zh: "先看积分月份和地址积分，再看份额。份额不是已到账的美元。质押改变的是积分乘数，不是任务速度。另开程序挖到的币不在这一行里。",
    "zh-TW":
      "先看積分月份和地址積分，再看份額。份額不是已到帳的美元。質押改變的是積分乘數，不是任務速度。另開程式挖到的幣不在這一列裡。",
    en: "Read the points month and the address points, then the share. Share is not dollars already received. Staking changes the point multiplier, not job speed. Coins from the optional program path are not on this row.",
    ko: "포인트 월과 주소 포인트를 본 다음 몫을 봅니다. 몫은 이미 받은 달러가 아닙니다. 스테이킹은 포인트 배수를 바꾸며 작업 속도는 바꾸지 않습니다. 선택 프로그램으로 캔 코인은 이 행에 없습니다.",
    ja: "ポイント月とアドレスのポイントを見てからシェアを見ます。シェアは既に受け取ったドルではありません。ステーキングが変えるのはポイント倍率で、ジョブ速度ではありません。任意プログラムで掘ったコインはこの行にありません。",
  },
  sources,
  related: ["flyai-monitor-guide", "flyai-zero-points-data-delay"],
  comparisonTitle: {
    zh: "积分、份额和领取",
    "zh-TW": "積分、份額和領取",
    en: "Points, share, and the claim",
    ko: "포인트, 몫, 청구",
    ja: "ポイント、シェア、請求",
  },
  comparison: {
    zh: {
      headers: ["名称", "官方或页面在说什么", "不要换成"],
      rows: [
        ["月积分", "该公开地址在当前月份的计分", "美元余额"],
        ["份额", "该地址占本月总积分的比例", "已经打到钱包的 $FLYAI"],
        ["$FLYAI 池", "fly.ai 写明按月按积分分割", "监控上的一个美元数字"],
        [
          "质押",
          "不改变每分钟任务数；按档位乘当天积分；新质押从次日 00:00 UTC 起算，当天按持有过的最低质押",
          "更高的机器算力",
        ],
        ["Also run programs", "官方称部分任务会经公开矿池为项目挖币", "这一行月积分本身"],
      ],
    },
    "zh-TW": {
      headers: ["名稱", "官方或頁面在說什麼", "不要換成"],
      rows: [
        ["月積分", "該公開地址在目前月份的計分", "美元餘額"],
        ["份額", "該地址占本月總積分的比例", "已經打到錢包的 $FLYAI"],
        ["$FLYAI 池", "fly.ai 寫明按月按積分分割", "監控上的一個美元數字"],
        [
          "質押",
          "不改變每分鐘任務數；按檔位乘當天積分；新質押從次日 00:00 UTC 起算，當天按持有過的最低質押",
          "更高的機器算力",
        ],
        ["Also run programs", "官方稱部分任務會經公開礦池為專案挖幣", "這一列月積分本身"],
      ],
    },
    en: {
      headers: ["Name", "What the page is saying", "Do not turn it into"],
      rows: [
        ["Month points", "This public address’s score for the current month", "A dollar balance"],
        [
          "Share",
          "This address’s fraction of the month’s points",
          "$FLYAI already sent to the wallet",
        ],
        [
          "$FLYAI pool",
          "fly.ai says the pool is split by points each month",
          "A dollar figure on the monitor",
        ],
        [
          "Stake",
          "Does not change jobs per minute. The tier multiplies that day’s points. New stake counts from the next day at 00:00 UTC. A day uses the lowest stake held that day",
          "A faster machine",
        ],
        [
          "Also run programs",
          "fly.ai says some jobs then mine coins for the project through public pools",
          "The month-point row itself",
        ],
      ],
    },
    ko: {
      headers: ["이름", "페이지가 말하는 것", "이것으로 바꾸지 말 것"],
      rows: [
        ["월 포인트", "이 공개 주소의 현재 월 점수", "달러 잔액"],
        ["몫", "이번 달 총 포인트 중 이 주소의 비율", "이미 지갑으로 보낸 $FLYAI"],
        ["$FLYAI 풀", "fly.ai는 매달 포인트로 풀을 나눈다고 씀", "모니터의 달러 숫자"],
        [
          "스테이킹",
          "분당 작업 수는 그대로. 등급이 그날 포인트를 곱함. 새 스테이킹은 다음 날 00:00 UTC부터. 하루는 그날 보유한 최저 스테이킹을 씀",
          "더 빠른 기기",
        ],
        [
          "Also run programs",
          "fly.ai는 일부 작업이 공개 풀을 통해 프로젝트용 코인을 캔다고 함",
          "이 월 포인트 행 자체",
        ],
      ],
    },
    ja: {
      headers: ["名前", "ページが言っていること", "これにしない"],
      rows: [
        ["月間ポイント", "この公開アドレスの現在の月の得点", "ドル残高"],
        ["シェア", "その月の総ポイントに対する割合", "すでにウォレットへ送った $FLYAI"],
        ["$FLYAI プール", "fly.ai は毎月ポイントでプールを分けると書く", "モニター上のドル金額"],
        [
          "ステーク",
          "1分あたりのジョブ数は変わらない。ティアがその日のポイントを掛ける。新しいステークは翌日 00:00 UTC から。その日は保有した最低ステークを使う",
          "より速いマシン",
        ],
        [
          "Also run programs",
          "fly.ai は一部ジョブが公開プール経由でプロジェクト向けにコインを掘ると述べる",
          "この月間ポイント行そのもの",
        ],
      ],
    },
  },
  questions: {
    zh: [
      {
        question: "积分旁边的百分比能直接换成美元吗？",
        answer:
          "不能。百分比来自份额，份额是这个地址占本月总积分的比例。fly.ai 写的是按积分分割 $FLYAI 池，不是监控把积分标成美元。",
      },
      {
        question: "质押会让机器每分钟做更多任务吗？",
        answer:
          "按官方说明不会。任务速度不变，当天积分按档位相乘，所以月份份额会变。新的质押从下一 UTC 日开始计入，当天按你持有过的最低质押计算。",
      },
      {
        question: "打开 Also run programs 之后，币会加进月积分吗？",
        answer:
          "不会加进监控上的这一行。官方说开启后，部分任务会通过公开矿池为项目挖币，那些数量是矿池对自己支付地址的记录。月积分仍然是检查工作的计分。",
      },
    ],
    "zh-TW": [
      {
        question: "積分旁邊的百分比能直接換成美元嗎？",
        answer:
          "不能。百分比來自份額，份額是這個地址占本月總積分的比例。fly.ai 寫的是按積分分割 $FLYAI 池，不是監控把積分標成美元。",
      },
      {
        question: "質押會讓機器每分鐘做更多任務嗎？",
        answer:
          "按官方說明不會。任務速度不變，當天積分按檔位相乘，所以月份份額會變。新的質押從下一 UTC 日開始計入，當天按你持有過的最低質押計算。",
      },
      {
        question: "打開 Also run programs 之後，幣會加進月積分嗎？",
        answer:
          "不會加進監控上的這一列。官方說開啟後，部分任務會通過公開礦池為專案挖幣，那些數量是礦池對自己支付地址的記錄。月積分仍然是檢查工作的計分。",
      },
    ],
    en: [
      {
        question: "Can I turn the percent next to the points into dollars?",
        answer:
          "No. The percent comes from the share, which is this address’s fraction of the month’s points. fly.ai describes a $FLYAI pool split by points. The monitor does not label points as dollars.",
      },
      {
        question: "Does staking make the machine finish more jobs per minute?",
        answer:
          "fly.ai says no. Job speed stays the same. The tier multiplies that day’s points, so the month share can change. New stake counts from the next UTC day. A day uses the lowest stake you held during it.",
      },
      {
        question: "Do coins from Also run programs add into the month points?",
        answer:
          "They do not add into this row. fly.ai says that with the option on, some jobs mine coins for the project through public pools, and those amounts are the pools’ figures for the project’s payout addresses. Month points remain the score for checked work.",
      },
    ],
    ko: [
      {
        question: "포인트 옆 백분율을 달러로 바꿔도 되나요?",
        answer:
          "안 됩니다. 백분율은 몫에서 오고, 몫은 이번 달 총 포인트 중 이 주소의 비율입니다. fly.ai는 포인트로 $FLYAI 풀을 나눈다고 씁니다. 모니터는 포인트를 달러로 표시하지 않습니다.",
      },
      {
        question: "스테이킹하면 분당 작업이 늘어나나요?",
        answer:
          "fly.ai의 설명은 그렇지 않습니다. 작업 속도는 같고, 등급이 그날 포인트를 곱해 월 몫이 달라질 수 있습니다. 새 스테이킹은 다음 UTC 날부터 반영되고, 하루는 그날 보유한 최저 스테이킹을 씁니다.",
      },
      {
        question: "Also run programs의 코인이 월 포인트에 더해지나요?",
        answer:
          "이 행에는 더해지지 않습니다. fly.ai는 옵션을 켜면 일부 작업이 공개 풀을 통해 프로젝트용 코인을 캐고, 그 수량은 풀이 프로젝트 지급 주소에 대해 적는 값이라고 합니다. 월 포인트는 검사된 작업의 점수입니다.",
      },
    ],
    ja: [
      {
        question: "ポイント横のパーセントをドルに換えてよいですか？",
        answer:
          "できません。パーセントはシェアから来て、シェアはその月の総ポイントに対するこのアドレスの割合です。fly.ai が書くのはポイントで分ける $FLYAI プールです。モニターはポイントをドルとは表示しません。",
      },
      {
        question: "ステークすると 1 分あたりのジョブは増えますか？",
        answer:
          "fly.ai の説明では増えません。速度はそのままです。ティアがその日のポイントを掛けるので、月のシェアは変わり得ます。新しいステークは次の UTC 日から数え、その日は保有した最低ステークを使います。",
      },
      {
        question: "Also run programs のコインは月間ポイントに足されますか？",
        answer:
          "この行には足されません。fly.ai は、オプションをオンにすると一部ジョブが公開プール経由でプロジェクト向けにコインを掘り、その数量はプールがプロジェクトの支払アドレスについて示す数だと述べています。月間ポイントは検査済み作業の得点のままです。",
      },
    ],
  },
  body: {
    zh: [
      "fly.ai 监控上的数字是当前月份的积分和份额，不是美元收入。打开 [fly.ai 监控](/projects/flyai)，先确认积分月份，再读这个公开地址的月积分和份额。fly.ai 写明：通过检查的工作获得积分，每个月按积分分割 $FLYAI 池，月份结束后在 Robinhood Chain 上领取你的份额。",
      "## 三个数不要加在一起",
      "地址月积分是计分。份额是它占本月总积分的比例，监控在月份与香港当前日历月一致时把份额显示成百分比。本月总积分是列表中各钱包的合计。三者都不是已领取的 $FLYAI，也不是 USDC 余额。",
      "## 还会改变份额、但不在这一行里的事",
      "- 质押不提高每分钟任务数。官方写明档位会乘当天的积分，因此份额变大；新质押从次日 00:00 UTC 起算，一天按当天持有过的最低质押。",
      "- 答案若在服务器复查中被判错，官方写明当天积分会被清零。清零之后，月份份额会跟着变小。",
      "- 打开 Also run programs 后，官方称部分任务会通过公开矿池为项目挖币。那些币记在矿池自己的支付地址上，不会加进监控这一行月积分。",
      "## 你要做的分支",
      "若你要的是“现在能领多少”，监控给不出美元。等到该月结束后，用 fly.ai 的领取流程，在 Robinhood Chain 上领取按积分分到的份额。若你要的是“这个地址本月计了多少分”，就读月积分和份额。月份标签若还停在上一个月，那一行仍是上一份记录，不是新月份的收入。",
      "## 举例",
      "举例，不是真实收入：地址积分 250000，本月总积分 10000000，份额 0.025，监控大约显示 2.50%。这表示约占当月积分的 2.5%，不是 2.50 美元，也不是已经领取的 $FLYAI。",
      "## 下一步",
      "在 [fly.ai 监控](/projects/flyai) 只把月积分和份额当成计分。字段对照见 [当前月份](/learn/flyai-monitor-guide)。积分长时间是空的，见 [积分为零与数据延迟](/learn/flyai-zero-points-data-delay)。",
      "监控不报价、不预测池子能分成多少美元，也不代替领取。质押档位和矿池挖币数量都不在这个地址行上。",
    ],
    "zh-TW": [
      "fly.ai 監控上的數字是目前月份的積分和份額，不是美元收入。打開 [fly.ai 監控](/projects/flyai)，先確認積分月份，再讀這個公開地址的月積分和份額。fly.ai 寫明：通過檢查的工作獲得積分，每個月按積分分割 $FLYAI 池，月份結束後在 Robinhood Chain 上領取你的份額。",
      "## 三個數不要加在一起",
      "地址月積分是計分。份額是它占本月總積分的比例，監控在月份與香港目前日曆月一致時把份額顯示成百分比。本月總積分是清單中各錢包的合計。三者都不是已領取的 $FLYAI，也不是 USDC 餘額。",
      "## 還會改變份額、但不在這一列裡的事",
      "- 質押不提高每分鐘任務數。官方寫明檔位會乘當天的積分，因此份額變大；新質押從次日 00:00 UTC 起算，一天按當天持有過的最低質押。",
      "- 答案若在伺服器複查中被判錯，官方寫明當天積分會被清零。清零之後，月份份額會跟著變小。",
      "- 打開 Also run programs 後，官方稱部分任務會通過公開礦池為專案挖幣。那些幣記在礦池自己的支付地址上，不會加進監控這一列月積分。",
      "## 你要做的分支",
      "若你要的是「現在能領多少」，監控給不出美元。等到該月結束後，用 fly.ai 的領取流程，在 Robinhood Chain 上領取按積分分到的份額。若你要的是「這個地址本月計了多少分」，就讀月積分和份額。月份標籤若還停在上一個月，那一列仍是上一份記錄，不是新月份的收入。",
      "## 舉例",
      "舉例，不是真實收入：地址積分 250000，本月總積分 10000000，份額 0.025，監控大約顯示 2.50%。這表示約占當月積分的 2.5%，不是 2.50 美元，也不是已經領取的 $FLYAI。",
      "## 下一步",
      "在 [fly.ai 監控](/projects/flyai) 只把月積分和份額當成計分。欄位對照見 [目前月份](/learn/flyai-monitor-guide)。積分長時間是空的，見 [積分為零與資料延遲](/learn/flyai-zero-points-data-delay)。",
      "監控不報價、不預測池子能分成多少美元，也不代替領取。質押檔位和礦池挖幣數量都不在這個地址列上。",
    ],
    en: [
      "The figures on the fly.ai monitor are this month’s points and share, not dollar income. Open [fly.ai monitoring](/projects/flyai), confirm the points month, then read that public address’s month points and share. fly.ai states that checked work earns points, that each month a $FLYAI pool is split by points, and that you claim your share on Robinhood Chain after the month.",
      "## Three numbers that do not add into cash",
      "Address points are the score. Share is that score’s fraction of the month’s total points. When the record’s month matches the current calendar month in Hong Kong time, the monitor shows the share as a percent. The month total is the sum across listed wallets. None of the three is $FLYAI already claimed, and none is a USDC balance.",
      "## What can change the share without appearing on this row",
      "- Staking does not raise jobs per minute. fly.ai says the tier multiplies that day’s points, so the share can grow. New stake counts from the next day at 00:00 UTC. A day uses the lowest stake held during it.",
      "- If a re-check on the server marks an answer wrong, fly.ai says that day is zeroed. After that, the month share is smaller.",
      "- With Also run programs on, fly.ai says some jobs mine coins for the project through public pools. Those amounts stay on the pools’ own payout addresses. They are not added to this month-point row.",
      "## Which question you are asking",
      "If the question is “what can I claim in dollars now”, the monitor has no dollar answer. After the month ends, use fly.ai’s claim flow on Robinhood Chain for the share assigned by points. If the question is “what did this address score this month”, read the points and the share. If the month label is still the previous month, the row is still that previous record, not income for the new month.",
      "## Example",
      "Illustrative, not real income: address points 250000, month total 10000000, share 0.025. The monitor shows about 2.50%. That is about 2.5% of the month’s points, not 2.50 dollars and not $FLYAI already claimed.",
      "## Next step",
      "On [fly.ai monitoring](/projects/flyai), treat month points and share as the score. Field-by-field reading is in [the current month](/learn/flyai-monitor-guide). A long empty points row is in [zero points and delay](/learn/flyai-zero-points-data-delay).",
      "The monitor does not price the pool, does not forecast a dollar split, and does not claim for you. Stake tier and pool-mined coins are not on this address row.",
    ],
    ko: [
      "fly.ai 모니터의 숫자는 이번 달 포인트와 몫이며 달러 수입이 아닙니다. [fly.ai 모니터링](/projects/flyai)을 열고 포인트 월을 확인한 뒤, 그 공개 주소의 월 포인트와 몫을 읽습니다. fly.ai는 검사된 작업이 포인트를 받고, 매달 $FLYAI 풀을 포인트로 나누며, 월이 끝난 뒤 Robinhood Chain에서 몫을 청구한다고 씁니다.",
      "## 현금으로 더하면 안 되는 세 숫자",
      "주소 포인트는 점수입니다. 몫은 그 점수가 월 총 포인트에서 차지하는 비율입니다. 기록의 월이 홍콩 시각의 현재 달력 월과 같으면 모니터는 몫을 백분율로 보여 줍니다. 월 총합은 목록의 지갑을 더한 값입니다. 셋 다 이미 청구한 $FLYAI가 아니고 USDC 잔액도 아닙니다.",
      "## 이 행에는 없어도 몫을 바꾸는 것",
      "- 스테이킹은 분당 작업을 늘리지 않습니다. fly.ai는 등급이 그날 포인트를 곱해 몫이 커질 수 있다고 합니다. 새 스테이킹은 다음 날 00:00 UTC부터이고, 하루는 그날 보유한 최저 스테이킹을 씁니다.",
      "- 서버 재검사에서 답이 틀리면 fly.ai는 그날을 0으로 만든다고 합니다. 그러면 월 몫은 작아집니다.",
      "- Also run programs를 켜면 fly.ai는 일부 작업이 공개 풀을 통해 프로젝트용 코인을 캔다고 합니다. 그 수량은 풀 자신의 지급 주소에 남고, 이 월 포인트 행에 더해지지 않습니다.",
      "## 어느 질문인지",
      "「지금 달러로 얼마나 청구할 수 있나」라면 모니터에는 달러 답이 없습니다. 그 달이 끝난 뒤 fly.ai 청구 절차로 Robinhood Chain에서 포인트에 따라 나뉜 몫을 받습니다. 「이 주소가 이번 달 몇 점인가」라면 포인트와 몫을 읽습니다. 월 표시가 아직 지난달이면 그 행은 지난 기록이며 새 달의 수입이 아닙니다.",
      "## 예시",
      "예시이며 실제 수입이 아닙니다. 주소 포인트 250000, 월 총 포인트 10000000, 몫 0.025이면 모니터는 약 2.50%를 보여 줍니다. 이는 그 달 포인트의 약 2.5%이며 2.50달러도, 이미 청구한 $FLYAI도 아닙니다.",
      "## 다음 단계",
      "[fly.ai 모니터링](/projects/flyai)에서는 월 포인트와 몫을 점수로만 봅니다. 칸별 읽기는 [현재 월](/learn/flyai-monitor-guide)에 있습니다. 포인트가 오래 비어 있으면 [0 포인트와 지연](/learn/flyai-zero-points-data-delay)을 보세요.",
      "모니터는 풀 가격을 매기지 않고, 달러 분배를 예측하지 않으며, 대신 청구하지 않습니다. 스테이킹 등급과 풀에서 캔 코인은 이 주소 행에 없습니다.",
    ],
    ja: [
      "fly.ai モニターの数字は今月のポイントとシェアであり、ドルの収入ではありません。[fly.ai モニタリング](/projects/flyai) を開き、ポイント月を確認してから、その公開アドレスの月間ポイントとシェアを読みます。fly.ai は、検査を通った作業がポイントを獲得し、毎月 $FLYAI プールをポイントで分け、月のあと Robinhood Chain でシェアを請求する、と述べています。",
      "## 現金として足さない三つの数",
      "アドレスのポイントは得点です。シェアは月間総ポイントに対するその割合です。記録の月が香港時間の現在の暦月と一致すると、モニターはシェアを百分率で表示します。月間合計は一覧のウォレットの合計です。三つとも、すでに請求した $FLYAI ではなく、USDC 残高でもありません。",
      "## この行に無くてもシェアを変えるもの",
      "- ステークは 1 分あたりのジョブを増やしません。fly.ai はティアがその日のポイントを掛けるのでシェアが大きくなり得ると書きます。新しいステークは翌日 00:00 UTC からで、その日は保有した最低ステークを使います。",
      "- サーバーの再検査で答えが誤りなら、fly.ai はその日をゼロにすると述べます。その後、月のシェアは小さくなります。",
      "- Also run programs をオンにすると、fly.ai は一部ジョブが公開プール経由でプロジェクト向けにコインを掘ると述べます。その数量はプール自身の支払アドレスに残り、この月間ポイント行には足されません。",
      "## どちらの問いか",
      "「今ドルでいくら請求できるか」なら、モニターにドルの答えはありません。その月が終わってから fly.ai の請求手順で、Robinhood Chain 上のポイント配分を受け取ります。「このアドレスは今月何点か」ならポイントとシェアを読みます。月の表示がまだ先月なら、その行は前の記録であり、新しい月の収入ではありません。",
      "## 例",
      "例示であり、実際の収入ではありません。アドレスのポイント 250000、月間総ポイント 10000000、シェア 0.025 なら、モニターは約 2.50% を表示します。これはその月のポイントの約 2.5% であり、2.50 ドルでも、すでに請求した $FLYAI でもありません。",
      "## 次にすること",
      "[fly.ai モニタリング](/projects/flyai) では月間ポイントとシェアを得点として見ます。欄ごとの読み方は [現在の月](/learn/flyai-monitor-guide) にあります。ポイントが長く空のときは [ゼロポイントと遅延](/learn/flyai-zero-points-data-delay) を見てください。",
      "モニターはプールに値段を付けず、ドル配分を予測せず、代わりに請求しません。ステークのティアとプールで掘ったコインは、このアドレス行にはありません。",
    ],
  },
};

const manyMachines: Article = {
  slug: "flyai-multiple-machines-one-wallet",
  project: "flyai",
  published: "2026-10-24",
  modified: "2026-10-24",
  topic: {
    zh: "多机一个钱包",
    "zh-TW": "多機一個錢包",
    en: "Several machines, one wallet",
    ko: "여러 기기, 지갑 하나",
    ja: "複数台と一つのウォレット",
  },
  title: {
    zh: "多台 fly.ai 机器共用一个钱包时，月积分只计一次",
    "zh-TW": "多台 fly.ai 機器共用一個錢包時，月積分只計一次",
    en: "When several fly.ai machines share one wallet, month points are counted once",
    ko: "fly.ai 기기 여러 대가 지갑 하나를 쓰면 월 포인트는 한 번만 셉니다",
    ja: "複数の fly.ai マシンが一つのウォレットなら、月間ポイントは一度だけ数える",
  },
  description: {
    zh: "同一个公开地址的月积分属于这个钱包，不按机器相加。单独保存的设备记录才计入每项目 5 台（Pro 50 台）。在一台设备下查看并不会自动占名额。",
    "zh-TW":
      "同一個公開地址的月積分屬於這個錢包，不按機器相加。單獨儲存的設備記錄才計入每專案 5 台（Pro 50 台）。在一台設備下查看並不會自動占名額。",
    en: "Month points for one public address belong to that wallet and are not added per machine. Only separately saved device records count toward five per project, or 50 on Pro. Looking inside one device does not take extra slots.",
    ko: "공개 주소 하나의 월 포인트는 그 지갑의 것이며 기기마다 더하지 않습니다. 따로 저장한 기기 기록만 프로젝트당 5대(Pro 50대)에 포함됩니다. 기기 한 대 안을 보는 것은 자리를 더 쓰지 않습니다.",
    ja: "一つの公開アドレスの月間ポイントはそのウォレットのもので、台数ぶん足しません。別に保存したデバイス記録だけが、プロジェクトあたり 5 台（Pro は 50 台）に数えます。1台の中を見ても枠は増えません。",
  },
  summary: {
    zh: "多台机器可以连接同一个公开收益地址。监控上的月积分和份额是这一行钱包的合计。把同一行抄到每台机器上再相加，会把同一笔积分算重。",
    "zh-TW":
      "多台機器可以連接同一個公開收益地址。監控上的月積分和份額是這一列錢包的合計。把同一列抄到每台機器上再相加，會把同一筆積分算重。",
    en: "Several machines can use one public payout address. Month points and share on the monitor are that one wallet row. Copying the row onto each machine and adding those copies counts the same points twice.",
    ko: "여러 기기가 공개 수령 주소 하나를 쓸 수 있습니다. 모니터의 월 포인트와 몫은 그 지갑 행 하나입니다. 그 행을 기기마다 복사해 더하면 같은 포인트를 두 번 셉니다.",
    ja: "複数台が一つの公開受取アドレスを使えます。モニターの月間ポイントとシェアは、そのウォレット 1 行の合計です。その行を台ごとに写して足すと、同じポイントを二重に数えます。",
  },
  sources,
  related: ["flyai-monitor-guide", "flyai-public-wallet-vs-token"],
  comparisonTitle: {
    zh: "机器、钱包和设备名额",
    "zh-TW": "機器、錢包和設備名額",
    en: "Machines, the wallet, and saved devices",
    ko: "기기, 지갑, 저장 장치",
    ja: "マシン、ウォレット、保存デバイス",
  },
  comparison: {
    zh: {
      headers: ["你做的事", "月积分怎么算", "设备名额怎么算"],
      rows: [
        ["两台电脑连接同一个 0x", "仍是该地址的一行月积分", "不因“发现了两台机器”自动增加"],
        ["只保存一台设备，并填这个地址", "读这一行，不复制", "fly.ai 计 1 台"],
        [
          "为每台机器各建一条已保存设备，并都填 fly.ai",
          "若地址相同，金额仍然去重，不把积分加两遍",
          "每条已保存设备各计 1 台，免费每项目 5 台，Pro 50 台",
        ],
        ["同一条已保存设备上再绑一次 fly.ai", "还是同一个钱包合计", "不额外加一台"],
        ["账户里还有别的项目", "与 fly.ai 积分无关", "名额按项目分开，不和别的项目混用"],
      ],
    },
    "zh-TW": {
      headers: ["你做的事", "月積分怎麼算", "設備名額怎麼算"],
      rows: [
        ["兩台電腦連接同一個 0x", "仍是該地址的一列月積分", "不因「發現了兩台機器」自動增加"],
        ["只儲存一台設備，並填這個地址", "讀這一列，不複製", "fly.ai 計 1 台"],
        [
          "為每台機器各建一條已儲存設備，並都填 fly.ai",
          "若地址相同，金額仍然去重，不把積分加兩遍",
          "每條已儲存設備各計 1 台，免費每專案 5 台，Pro 50 台",
        ],
        ["同一條已儲存設備上再綁一次 fly.ai", "還是同一個錢包合計", "不額外加一台"],
        ["帳戶裡還有別的專案", "與 fly.ai 積分無關", "名額按專案分開，不和別的專案混用"],
      ],
    },
    en: {
      headers: ["What you did", "Month points", "Saved-device slots"],
      rows: [
        [
          "Two PCs linked to one 0x",
          "Still one month-point row for that address",
          "Does not grow just because two machines were seen",
        ],
        [
          "One saved device, this address filled in",
          "Read that one row; do not copy it",
          "Counts as 1 fly.ai device",
        ],
        [
          "A separate saved device per machine, each with fly.ai",
          "The same wallet is still deduped, not added twice",
          "Each saved device counts as 1. Free is five saved devices per project; Pro is 50",
        ],
        [
          "fly.ai linked again on the same saved device",
          "Same wallet total",
          "Does not add another device",
        ],
        [
          "Other projects on the account",
          "Unrelated to these points",
          "Each project has its own five or 50",
        ],
      ],
    },
    ko: {
      headers: ["한 일", "월 포인트", "저장 기기 자리"],
      rows: [
        [
          "PC 두 대가 같은 0x",
          "그 주소의 월 포인트는 여전히 한 행",
          "기기 두 대를 봤다고 자동으로 늘지 않음",
        ],
        ["저장 기기 하나, 이 주소", "그 한 행만 읽고 복사하지 않음", "fly.ai 1대"],
        [
          "기기마다 저장 기록을 만들고 모두 fly.ai",
          "같은 지갑은 여전히 한 번만 셈",
          "저장 기기마다 1대. 무료는 프로젝트당 5대, Pro는 50대",
        ],
        ["같은 저장 기기에 fly.ai를 다시 연결", "같은 지갑 합계", "대수가 늘지 않음"],
        ["계정의 다른 프로젝트", "이 포인트와 무관", "자리 수는 프로젝트마다 따로 5대 또는 50대"],
      ],
    },
    ja: {
      headers: ["したこと", "月間ポイント", "保存デバイスの枠"],
      rows: [
        ["2台が同じ 0x", "そのアドレスの月間ポイントは 1 行のまま", "2台見えただけでは増えない"],
        ["保存デバイス 1 件にこのアドレス", "その 1 行を読み、複製しない", "fly.ai は 1 台"],
        [
          "台ごとに保存デバイスを作り、どれも fly.ai",
          "同じウォレットは重複せず、二度足さない",
          "保存 1 件につき 1 台。無料はプロジェクトあたり 5 台、Pro は 50 台",
        ],
        ["同じ保存デバイスに fly.ai を再度接続", "同じウォレット合計", "台数は増えない"],
        [
          "アカウントの他プロジェクト",
          "このポイントとは無関係",
          "枠はプロジェクトごとに 5 台または 50 台",
        ],
      ],
    },
  },
  questions: {
    zh: [
      {
        question: "两台电脑的积分应该加在一起吗？",
        answer:
          "不要加。公开月份按钱包记一行。两台机器如果填的是同一个 0x，监控上的月积分已经是这个钱包的合计。",
      },
      {
        question: "一台设备里看到多个工作者，会占用 5 台名额吗？",
        answer:
          "不会自动占用。名额数的是带有 fly.ai 的已保存设备条数。免费每项目 5 台，Pro 每项目 50 台。只有你另建一条已保存设备并填上 fly.ai 时，才会再计一台。同一条设备上多次绑定 fly.ai 不加名额。",
      },
      {
        question: "怎样看某一台机器今天做了多少？",
        answer:
          "月份行给不出单机今日。回到官方 Compute 页面看那一台的任务和当天积分。监控不能从钱包合计反推出每台机器。",
      },
    ],
    "zh-TW": [
      {
        question: "兩台電腦的積分應該加在一起嗎？",
        answer:
          "不要加。公開月份按錢包記一列。兩台機器如果填的是同一個 0x，監控上的月積分已經是這個錢包的合計。",
      },
      {
        question: "一台設備裡看到多個工作者，會占用 5 台名額嗎？",
        answer:
          "不會自動占用。名額數的是帶有 fly.ai 的已儲存設備條數。免費每專案 5 台，Pro 每專案 50 台。只有你另建一條已儲存設備並填上 fly.ai 時，才會再計一台。同一條設備上多次綁定 fly.ai 不加名額。",
      },
      {
        question: "怎樣看某一台機器今天做了多少？",
        answer:
          "月份列給不出單機今日。回到官方 Compute 頁面看那一台的任務和當天積分。監控不能從錢包合計反推出每台機器。",
      },
    ],
    en: [
      {
        question: "Should I add the points from two computers?",
        answer:
          "No. The public month keeps one row per wallet. If both machines use the same 0x, the month points on the monitor are already that wallet’s total.",
      },
      {
        question: "If one device lists several workers, does that use up the five slots?",
        answer:
          "Not by itself. Slots count saved device records that include fly.ai. Free is five saved devices per project. Pro is 50 per project. A new saved device that you create and fill with fly.ai counts as another. Linking fly.ai again on the same saved device does not.",
      },
      {
        question: "How do I see what one machine did today?",
        answer:
          "The month row cannot answer that. Use the official Compute page for that machine’s jobs and that day’s points. The monitor cannot split a wallet total back into machines.",
      },
    ],
    ko: [
      {
        question: "컴퓨터 두 대의 포인트를 더해야 하나요?",
        answer:
          "더하지 마세요. 공개 월은 지갑당 한 행입니다. 두 기기가 같은 0x라면 모니터의 월 포인트는 이미 그 지갑 합계입니다.",
      },
      {
        question: "기기 하나에 워커가 여러 개 보이면 5대 자리를 쓰나요?",
        answer:
          "그것만으로는 쓰지 않습니다. 자리는 fly.ai가 포함된 저장 기기 기록의 수입니다. 무료는 프로젝트당 5대, Pro는 프로젝트당 50대입니다. fly.ai를 넣어 저장 기기를 새로 만들 때만 한 대 더 셉니다. 같은 저장 기기에 fly.ai를 다시 연결해도 늘지 않습니다.",
      },
      {
        question: "기기 한 대가 오늘 한 일은 어디서 보나요?",
        answer:
          "월 행은 그걸 알려 주지 않습니다. 공식 Compute 페이지에서 그 기기의 작업과 그날 포인트를 보세요. 모니터는 지갑 합계를 기기별로 되돌리지 않습니다.",
      },
    ],
    ja: [
      {
        question: "2台のポイントは足すべきですか？",
        answer:
          "足さないでください。公開月はウォレットごとに 1 行です。両方のマシンが同じ 0x なら、モニターの月間ポイントはすでにそのウォレットの合計です。",
      },
      {
        question: "1台の中にワーカーが複数あっても、5台の枠を使いますか？",
        answer:
          "それだけでは使いません。枠は fly.ai を含む保存デバイス記録の数です。無料はプロジェクトあたり 5 台、Pro はプロジェクトあたり 50 台です。fly.ai を入れて保存デバイスを新しく作ったときだけ、もう 1 台になります。同じ保存デバイスに fly.ai を再度つないでも増えません。",
      },
      {
        question: "1台が今日した仕事はどこで見ますか？",
        answer:
          "月の行では分かりません。公式 Compute ページで、そのマシンのジョブとその日のポイントを見ます。モニターはウォレット合計を台ごとに割り戻せません。",
      },
    ],
  },
  body: {
    zh: [
      "多台电脑可以连接同一个 fly.ai 公开收益地址。月积分只属于这个地址，不会按机器各算一份。打开 [fly.ai 监控](/projects/flyai) 后，匹配到的是一行钱包：月积分和份额。把这一行抄到每台电脑再相加，会把同一笔积分算重。",
      "## 钱包和设备不是同一个东西",
      "公开月份记录按 0x 地址列出积分。它没有“这台电脑、那台电脑”的列。官方 Compute 页面才看单台机器的任务。监控里的一条已保存设备，是你自己建的记录；它不是 fly.ai 账户，也不是自动发现的每一台矿机。",
      "## 名额按已保存设备计",
      "- 免费计划里，带有 fly.ai 的已保存设备最多 5 台；Pro 是每项目 50 台。别的项目各自另计。",
      "- 只在一条已保存设备上查看这个钱包，或在同一条设备上再次绑定 fly.ai，不增加台数。",
      "- 你为第二台机器新建一条已保存设备并填上 fly.ai，那一条会计入 5 台或 50 台。",
      "- 即使两条设备填了同一个地址，显示收入时仍共用这一行钱包，不会把月积分加两次。",
      "## 想拆开单机时",
      "若两台机器的当天工作不一样，月份合计解释不了差别。打开官方 Compute 页面，逐台看任务、当天已检查的工作和钱包是否已连接。监控这一行仍然只报告该地址的月积分。单机页面上的密钥不要贴进监控，见 [公开钱包与密钥](/learn/flyai-public-wallet-vs-token)。",
      "## 举例",
      "举例，不是实测：地址 A 的月积分是 100。电脑 1 和电脑 2 都连接地址 A。监控应只出现 100，而不是 200。若你另外保存了两条都含 fly.ai 的设备，名额计 2 台，积分仍是 100。",
      "## 下一步",
      "在 [fly.ai 监控](/projects/flyai) 按地址读一次月积分。月份和份额的读法见 [当前月份](/learn/flyai-monitor-guide)。要看某一台是否在跑，用官方 Compute 页面，不要把钱包合计当成在线证明。",
      "监控不能告诉你每台机器的今日积分，也不能把一个钱包自动拆成多台设备。名额用完时，再新建带 fly.ai 的已保存设备会被拒绝，已有记录仍保留。",
    ],
    "zh-TW": [
      "多台電腦可以連接同一個 fly.ai 公開收益地址。月積分只屬於這個地址，不會按機器各算一份。打開 [fly.ai 監控](/projects/flyai) 後，對到的是一列錢包：月積分和份額。把這一列抄到每台電腦再相加，會把同一筆積分算重。",
      "## 錢包和設備不是同一個東西",
      "公開月份記錄按 0x 地址列出積分。它沒有「這台電腦、那台電腦」的欄。官方 Compute 頁面才看單台機器的任務。監控裡的一條已儲存設備，是你自己建的記錄；它不是 fly.ai 帳戶，也不是自動發現的每一台礦機。",
      "## 名額按已儲存設備計",
      "- 免費方案裡，帶有 fly.ai 的已儲存設備最多 5 台；Pro 是每專案 50 台。別的專案各自另計。",
      "- 只在一條已儲存設備上看這個錢包，或在同一條設備上再次綁定 fly.ai，不增加台數。",
      "- 你為第二台機器新建一條已儲存設備並填上 fly.ai，那一條會計入 5 台或 50 台。",
      "- 即使兩條設備填了同一個地址，顯示收入時仍共用這一列錢包，不會把月積分加兩次。",
      "## 想拆開單機時",
      "若兩台機器的當天工作不一樣，月份合計解釋不了差別。打開官方 Compute 頁面，逐台看任務、當天已檢查的工作和錢包是否已連接。監控這一列仍然只報告該地址的月積分。單機頁面上的金鑰不要貼進監控，見 [公開錢包與金鑰](/learn/flyai-public-wallet-vs-token)。",
      "## 舉例",
      "舉例，不是實測：地址 A 的月積分是 100。電腦 1 和電腦 2 都連接地址 A。監控應只出現 100，而不是 200。若你另外儲存了兩條都含 fly.ai 的設備，名額計 2 台，積分仍是 100。",
      "## 下一步",
      "在 [fly.ai 監控](/projects/flyai) 按地址讀一次月積分。月份和份額的讀法見 [目前月份](/learn/flyai-monitor-guide)。要看某一台是否在跑，用官方 Compute 頁面，不要把錢包合計當成在線證明。",
      "監控不能告訴你每台機器的今日積分，也不能把一個錢包自動拆成多台設備。名額用完時，再新建帶 fly.ai 的已儲存設備會被拒絕，已有記錄仍保留。",
    ],
    en: [
      "Several computers can use one fly.ai public payout address. The month points belong to that address once. They are not a copy for each machine. On [fly.ai monitoring](/projects/flyai) a match is one wallet row: month points and share. Copying that row onto every computer and adding the copies counts the same points again.",
      "## A wallet is not a saved device",
      "The public month record lists points by 0x address. It has no column for “this PC” and “that PC”. The official Compute page is where you look at one machine’s jobs. A saved device in the monitor is a record you created. It is not a fly.ai account, and it is not every miner the network happens to see.",
      "## Slots count saved devices",
      "- On Free, saved devices that include fly.ai stop at five. Pro is 50 per project. Other projects have their own counts.",
      "- Reading this wallet on one saved device, or linking fly.ai again on that same device, does not add a device.",
      "- A new saved device you create for a second machine, with fly.ai filled in, counts toward the five or the 50.",
      "- If two saved devices use the same address, income still shows the one wallet row. The month points are not added twice.",
      "## When you need one machine",
      "If today’s work differs between two machines, the month total cannot explain the gap. Open the official Compute page and check jobs, checked work for the day, and whether the wallet is linked, one machine at a time. The monitor row still reports only that address’s month points. Do not paste a per-machine secret into the monitor. See [public wallet vs secret](/learn/flyai-public-wallet-vs-token).",
      "## Example",
      "Illustrative, not a measured fleet: address A has 100 month points. PC 1 and PC 2 both use address A. The monitor should show 100, not 200. If you also saved two devices that both include fly.ai, the slot count is 2 and the points stay 100.",
      "## Next step",
      "Read the month points once, by address, on [fly.ai monitoring](/projects/flyai). How to read the month and the share is in [the current month](/learn/flyai-monitor-guide). To see whether one machine is running, use the official Compute page. A wallet total is not proof that a machine is online.",
      "The monitor cannot show today’s points per machine, and it does not turn one wallet into several devices by itself. When the project slots are full, another new saved device with fly.ai is refused. Records you already have stay.",
    ],
    ko: [
      "여러 컴퓨터가 하나의 fly.ai 공개 수령 주소를 쓸 수 있습니다. 월 포인트는 그 주소에 한 번만 속합니다. 기기마다 복사본이 아닙니다. [fly.ai 모니터링](/projects/flyai)에서 일치하는 것은 지갑 행 하나입니다. 월 포인트와 몫입니다. 그 행을 컴퓨터마다 복사해 더하면 같은 포인트를 다시 셉니다.",
      "## 지갑과 저장 기기는 다릅니다",
      "공개 월 기록은 0x 주소별로 포인트를 적습니다. 「이 PC」「저 PC」 칸은 없습니다. 기기 한 대의 작업은 공식 Compute 페이지에서 봅니다. 모니터의 저장 기기는 당신이 만든 기록입니다. fly.ai 계정이 아니고, 네트워크가 발견한 채굴기 전부가 아닙니다.",
      "## 자리는 저장 기기를 셉니다",
      "- 무료에서는 fly.ai가 포함된 저장 기기가 5대까지입니다. Pro는 프로젝트당 50대입니다. 다른 프로젝트는 따로 셉니다.",
      "- 저장 기기 하나에서 이 지갑을 보거나, 그 같은 기기에 fly.ai를 다시 연결해도 대수는 늘지 않습니다.",
      "- 두 번째 기계를 위해 저장 기기를 새로 만들고 fly.ai를 채우면 5대 또는 50대에 포함됩니다.",
      "- 저장 기기 두 개가 같은 주소를 써도 수입은 그 지갑 행 하나입니다. 월 포인트를 두 번 더하지 않습니다.",
      "## 기기 한 대가 필요할 때",
      "오늘 일이 두 기기에서 다르면 월 합계로 차이를 설명할 수 없습니다. 공식 Compute 페이지에서 작업, 그날 검사된 작업, 지갑 연결을 한 대씩 확인하세요. 모니터 행은 여전히 그 주소의 월 포인트만 보여 줍니다. 기기별 비밀은 모니터에 붙이지 마세요. [공개 지갑과 비밀](/learn/flyai-public-wallet-vs-token)을 보세요.",
      "## 예시",
      "예시이며 측정한 장비가 아닙니다. 주소 A의 월 포인트는 100입니다. PC 1과 PC 2가 모두 주소 A를 씁니다. 모니터는 200이 아니라 100을 보여야 합니다. fly.ai가 든 저장 기기를 두 개 만들었으면 자리는 2대이고 포인트는 100입니다.",
      "## 다음 단계",
      "[fly.ai 모니터링](/projects/flyai)에서 주소당 월 포인트를 한 번만 읽습니다. 월과 몫은 [현재 월](/learn/flyai-monitor-guide)에 있습니다. 한 대가 돌아가는지는 공식 Compute 페이지에서 봅니다. 지갑 합계는 온라인 증거가 아닙니다.",
      "모니터는 기기별 오늘 포인트를 보여 주지 않고, 지갑 하나를 저절로 여러 기기로 만들지 않습니다. 프로젝트 자리가 차면 fly.ai가 든 새 저장 기기는 거절되고, 이미 있는 기록은 남습니다.",
    ],
    ja: [
      "複数のパソコンが一つの fly.ai 公開受取アドレスを使えます。月間ポイントはそのアドレスに一度だけ属します。台ごとの複製ではありません。[fly.ai モニタリング](/projects/flyai) で一致するのはウォレット 1 行、月間ポイントとシェアです。その行を各パソコンに写して足すと、同じポイントを再び数えます。",
      "## ウォレットと保存デバイスは別です",
      "公開月次記録は 0x アドレスごとにポイントを並べます。「この PC」「あの PC」の列はありません。1台のジョブは公式 Compute ページで見ます。モニターの保存デバイスは、あなたが作った記録です。fly.ai のアカウントではなく、ネットワークが見つけたマイナーの全部でもありません。",
      "## 枠は保存デバイスを数えます",
      "- 無料では fly.ai を含む保存デバイスは 5 台までです。Pro はプロジェクトあたり 50 台です。他のプロジェクトは別に数えます。",
      "- 保存デバイス 1 件でこのウォレットを見ること、または同じデバイスに fly.ai を再度つなぐことは、台数を増やしません。",
      "- 2台目のために保存デバイスを新しく作り fly.ai を入れると、5 台または 50 台に数えます。",
      "- 二つの保存デバイスが同じアドレスでも、表示する収入はそのウォレット 1 行のままです。月間ポイントは二度足しません。",
      "## 1台を見たいとき",
      "今日の作業が 2 台で違うなら、月間合計では差を説明できません。公式 Compute ページで、ジョブ、その日の検査済み作業、ウォレット接続を 1 台ずつ確認します。モニターの行は、そのアドレスの月間ポイントだけを報告します。台ごとの秘密はモニターに貼らないでください。[公開ウォレットと秘密](/learn/flyai-public-wallet-vs-token) を見てください。",
      "## 例",
      "例示であり、測定した機材ではありません。アドレス A の月間ポイントは 100 です。PC 1 と PC 2 がどちらもアドレス A を使います。モニターは 200 ではなく 100 を出すべきです。fly.ai を含む保存デバイスを 2 件作ったなら、枠は 2 台で、ポイントは 100 のままです。",
      "## 次にすること",
      "[fly.ai モニタリング](/projects/flyai) で、アドレスにつき月間ポイントを一度だけ読みます。月とシェアの読み方は [現在の月](/learn/flyai-monitor-guide) にあります。1台が動いているかは公式 Compute ページで見ます。ウォレット合計はオンラインの証拠ではありません。",
      "モニターは台ごとの本日ポイントを出せず、一つのウォレットを勝手に複数デバイスへ分けません。プロジェクトの枠がいっぱいなら、fly.ai 入りの新しい保存デバイスは拒否され、既にある記録は残ります。",
    ],
  },
};

const zeroPoints: Article = {
  slug: "flyai-zero-points-data-delay",
  project: "flyai",
  published: "2026-10-24",
  modified: "2026-10-24",
  topic: {
    zh: "积分为空",
    "zh-TW": "積分為空",
    en: "Empty points",
    ko: "빈 포인트",
    ja: "ポイントが空",
  },
  title: {
    zh: "fly.ai 积分为空时：先分清没入账、当天被清零和月份还没换",
    "zh-TW": "fly.ai 積分為空時：先分清沒入帳、當天被清零和月份還沒換",
    en: "When fly.ai points are empty: no row, a zeroed day, or a month that has not rolled",
    ko: "fly.ai 포인트가 비었을 때: 행 없음, 하루 0, 아직 안 바뀐 월",
    ja: "fly.aiのポイントが空のとき：行が無い、その日がゼロ、月がまだ替わらない",
  },
  description: {
    zh: "地址不在当前月份、当天答案被判错、钱包未连接，都会让积分看起来是空的。先对月份和地址，再回官方页面看当天任务。空白不是 0 美元。",
    "zh-TW":
      "地址不在目前月份、當天答案被判錯、錢包未連接，都會讓積分看起來是空的。先對月份和地址，再回官方頁面看當天任務。空白不是 0 美元。",
    en: "A missing month row, a day zeroed for a wrong answer, or an unlinked wallet can all look empty. Match the month and the address, then check that day’s jobs on the official page. Blank is not zero dollars.",
    ko: "현재 월에 주소가 없거나, 오답으로 하루가 0이 되거나, 지갑이 연결되지 않으면 포인트가 빈 것처럼 보입니다. 월과 주소를 맞춘 뒤 공식 페이지에서 그날 작업을 봅니다. 빈칸은 0달러가 아닙니다.",
    ja: "現在の月にアドレスが無い、誤答でその日がゼロ、ウォレット未接続は、どれもポイントが空に見えます。月とアドレスを合わせてから、公式ページでその日のジョブを見ます。空白は 0 ドルではありません。",
  },
  summary: {
    zh: "监控在对不上当前月份或对不上地址时不显示积分，这和列表里真有 0 分不同。官方还写明错答会把当天清零，未连接钱包则无法支付。",
    "zh-TW":
      "監控在對不上目前月份或對不上地址時不顯示積分，這和清單裡真有 0 分不同。官方還寫明錯答會把當天清零，未連接錢包則無法支付。",
    en: "The monitor hides points when the month or the address does not match. That is different from a listed zero. fly.ai also says a wrong answer zeroes the day, and an unlinked wallet cannot be paid.",
    ko: "월이나 주소가 맞지 않으면 모니터는 포인트를 보여 주지 않습니다. 목록에 0이 있는 것과 다릅니다. fly.ai는 오답이 그날을 0으로 만들고, 연결되지 않은 지갑은 지급할 수 없다고 씁니다.",
    ja: "月かアドレスが一致しないとき、モニターはポイントを出しません。一覧に 0 があるのとは違います。fly.ai は誤答でその日がゼロになり、未接続ウォレットは支払えないと述べます。",
  },
  sources,
  related: ["flyai-monitor-guide", "flyai-monthly-points-vs-income"],
  comparisonTitle: {
    zh: "看起来像零的几种情况",
    "zh-TW": "看起來像零的幾種情況",
    en: "States that look like zero",
    ko: "0처럼 보이는 상태",
    ja: "ゼロに見える状態",
  },
  comparison: {
    zh: {
      headers: ["你看到的", "更可能是", "接着做"],
      rows: [
        [
          "积分位置是破折号，地址不在列表",
          "当前月份没有这个公开地址",
          "回 Compute 页面核对地址和钱包是否已连接",
        ],
        [
          "月份还是上一个月",
          "新月份的公开记录还没换上来",
          "不要把旧月份当成这个月的收入；稍后再刷新",
        ],
        [
          "官方页面写当天被清零",
          "复查判定答案错误，当天计分作废",
          "看官方页面上的任务，而不是把月份额当成今天",
        ],
        [
          "手机只在前台标签页挖",
          "标签页不在前台时官方说不会继续",
          "用插电、Wi-Fi，并让该标签页保持在屏幕上",
        ],
        [
          "列表里这个地址的积分就是 0",
          "该地址在本月记录中计分为 0",
          "0 仍不是 0 美元；确认是否已有通过检查的工作",
        ],
      ],
    },
    "zh-TW": {
      headers: ["你看到的", "更可能是", "接著做"],
      rows: [
        [
          "積分位置是破折號，地址不在清單",
          "目前月份沒有這個公開地址",
          "回 Compute 頁面核對地址和錢包是否已連接",
        ],
        [
          "月份還是上一個月",
          "新月份的公開記錄還沒換上來",
          "不要把舊月份當成這個月的收入；稍後再重新整理",
        ],
        [
          "官方頁面寫當天被清零",
          "複查判定答案錯誤，當天計分作廢",
          "看官方頁面上的任務，而不是把月份份額當成今天",
        ],
        [
          "手機只在前景分頁挖",
          "分頁不在前景時官方說不會繼續",
          "用插電、Wi-Fi，並讓該分頁保持在畫面上",
        ],
        [
          "清單裡這個地址的積分就是 0",
          "該地址在本月記錄中計分為 0",
          "0 仍不是 0 美元；確認是否已有通過檢查的工作",
        ],
      ],
    },
    en: {
      headers: ["What you see", "More likely", "Do next"],
      rows: [
        [
          "A dash where points should be, address absent",
          "This public address is not in the current month",
          "On Compute, match the address and whether the wallet is linked",
        ],
        [
          "The month label is still last month",
          "The public record has not moved to the new month",
          "Do not read the old month as this month’s income; refresh later",
        ],
        [
          "The official page says the day was zeroed",
          "A re-check marked the answer wrong, so that day’s score is void",
          "Read jobs on the official page; do not treat the month share as today",
        ],
        [
          "A phone mines only in the foreground tab",
          "fly.ai says mining stops when that tab is not on screen",
          "Use power and Wi-Fi, and keep the tab on screen",
        ],
        [
          "The list really shows 0 for this address",
          "The month record scores this address at 0",
          "Zero is still not zero dollars; confirm checked work exists",
        ],
      ],
    },
    ko: {
      headers: ["보이는 것", "더 가능성 있는 뜻", "다음에 할 일"],
      rows: [
        [
          "포인트 자리가 대시이고 주소가 없음",
          "현재 월에 이 공개 주소가 없음",
          "Compute에서 주소와 지갑 연결을 맞춤",
        ],
        [
          "월 표시가 아직 지난달",
          "공개 기록이 새 달로 바뀌지 않음",
          "옛 달을 이번 달 수입으로 읽지 말고 나중에 새로고침",
        ],
        [
          "공식 페이지가 그날 0이라고 함",
          "재검사에서 오답이라 그날 점수가 무효",
          "월 몫을 오늘로 보지 말고 공식 페이지의 작업을 봄",
        ],
        [
          "휴대폰은 앞쪽 탭에서만 채굴",
          "fly.ai는 그 탭이 화면에 없으면 멈춘다고 함",
          "전원과 Wi-Fi를 쓰고 탭을 화면에 둠",
        ],
        [
          "목록에 이 주소가 정말 0",
          "이번 달 기록이 이 주소를 0점으로 적음",
          "0은 0달러가 아님. 검사를 통과한 작업이 있는지 확인",
        ],
      ],
    },
    ja: {
      headers: ["見えているもの", "よりありそうな意味", "次にすること"],
      rows: [
        [
          "ポイントの位置がダッシュで、アドレスが無い",
          "現在の月にこの公開アドレスが無い",
          "Compute でアドレスとウォレット接続を合わせる",
        ],
        [
          "月の表示がまだ先月",
          "公開記録が新しい月へ移っていない",
          "古い月を今月の収入として読まず、あとで更新する",
        ],
        [
          "公式ページがその日をゼロと書く",
          "再検査が誤答とし、その日の得点が無効",
          "月のシェアを今日と見ず、公式ページのジョブを見る",
        ],
        [
          "電話は前面のタブだけで採掘",
          "fly.ai はそのタブが画面に無いと止まると書く",
          "電源と Wi-Fi を使い、タブを画面に残す",
        ],
        [
          "一覧でこのアドレスが本当に 0",
          "今月の記録がこのアドレスを 0 点としている",
          "0 は 0 ドルではない。検査を通った作業があるか確認する",
        ],
      ],
    },
  },
  questions: {
    zh: [
      {
        question: "破折号是不是收入就是 0？",
        answer:
          "不是。破折号表示当前对得上的月份记录里没有可显示的该地址积分。它可能是地址不在列表，或月份还没换到香港时区的当前日历月。这和列表里明确写出 0 分不是同一件事，也不是 0 美元。",
      },
      {
        question: "刚做完任务，为什么监控还是空的？",
        answer:
          "月份列表不会逐秒跟着单台机器变。监控大约每分钟再读一次公开月份。若官方页面已经有当天积分而这里仍空，先等下一次刷新，并核对地址就是已连接的那个 0x。",
      },
      {
        question: "错一次会把整月都抹掉吗？",
        answer:
          "官方写的是错误答案会把当天清零，不是把已经记入月份的全部历史都改成未知。清零之后，这个地址的月积分和份额会按剩余计分变化。具体当天任务以 Compute 页面为准。",
      },
    ],
    "zh-TW": [
      {
        question: "破折號是不是收入就是 0？",
        answer:
          "不是。破折號表示目前對得上的月份記錄裡沒有可顯示的該地址積分。它可能是地址不在清單，或月份還沒換到香港時區的目前日曆月。這和清單裡明確寫出 0 分不是同一件事，也不是 0 美元。",
      },
      {
        question: "剛做完任務，為什麼監控還是空的？",
        answer:
          "月份清單不會逐秒跟著單台機器變。監控大約每分鐘再讀一次公開月份。若官方頁面已經有當天積分而這裡仍空，先等下一次重新整理，並核對地址就是已連接的那個 0x。",
      },
      {
        question: "錯一次會把整月都抹掉嗎？",
        answer:
          "官方寫的是錯誤答案會把當天清零，不是把已經記入月份的全部歷史都改成未知。清零之後，這個地址的月積分和份額會按剩餘計分變化。具體當天任務以 Compute 頁面為準。",
      },
    ],
    en: [
      {
        question: "Does a dash mean my income is zero?",
        answer:
          "No. A dash means the month record currently in view has no points to show for that address. The address may be absent, or the record may not yet be the current calendar month in Hong Kong time. That is different from a listed zero, and it is not zero dollars.",
      },
      {
        question: "I just finished a job. Why is the monitor still empty?",
        answer:
          "The month list does not change with every second on one machine. The monitor reads the public month about once a minute. If the official page already shows today’s points and this page is still empty, wait for the next refresh and check that the address is the linked 0x.",
      },
      {
        question: "Does one wrong answer erase the whole month?",
        answer:
          "fly.ai says a wrong answer zeroes that day. It does not say the rest of the month becomes unknown. After the day is zeroed, the address’s month points and share follow whatever score remains. The day’s jobs are on the Compute page.",
      },
    ],
    ko: [
      {
        question: "대시는 수입이 0이라는 뜻인가요?",
        answer:
          "아닙니다. 대시는 지금 보는 월 기록에 그 주소의 표시할 포인트가 없다는 뜻입니다. 주소가 없거나, 기록이 아직 홍콩 시각의 현재 달력 월이 아닐 수 있습니다. 목록에 적힌 0과는 다르고, 0달러도 아닙니다.",
      },
      {
        question: "작업을 막 끝냈는데 모니터가 비어 있는 이유는요?",
        answer:
          "월 목록은 기기 한 대의 매 초를 따라가지 않습니다. 모니터는 공개 월을 약 1분에 한 번 다시 읽습니다. 공식 페이지에 오늘 포인트가 있는데 여기가 비어 있으면 다음 새로고침을 기다리고, 주소가 연결된 그 0x인지 확인하세요.",
      },
      {
        question: "한 번 틀리면 월 전체가 지워지나요?",
        answer:
          "fly.ai가 쓰는 말은 오답이 그날을 0으로 만든다는 것입니다. 그달의 나머지 기록이 알 수 없게 된다는 뜻은 아닙니다. 그날이 0이 된 뒤 월 포인트와 몫은 남은 점수를 따릅니다. 그날 작업은 Compute 페이지에 있습니다.",
      },
    ],
    ja: [
      {
        question: "ダッシュは収入がゼロという意味ですか？",
        answer:
          "違います。ダッシュは、今見ている月次記録にそのアドレスの表示できるポイントが無いという意味です。アドレスが無いか、記録がまだ香港時間の現在の暦月でないことがあります。一覧に書かれた 0 とは違い、0 ドルでもありません。",
      },
      {
        question: "ジョブを終えたばかりなのに、モニターが空なのはなぜですか？",
        answer:
          "月次一覧は 1 台の毎秒には追従しません。モニターは公開月を約 1 分に 1 回読み直します。公式ページには今日のポイントがあるのにこちらが空なら、次の更新を待ち、アドレスが接続済みの 0x か確認してください。",
      },
      {
        question: "一度の誤答で月全体が消えますか？",
        answer:
          "fly.ai が述べるのは、誤答でその日がゼロになることです。その月の残りが不明になるとは書いていません。その日がゼロになったあと、月間ポイントとシェアは残った得点に従います。その日のジョブは Compute ページにあります。",
      },
    ],
  },
  body: {
    zh: [
      "fly.ai 积分位置是空的，先不要把它读成 0 美元。打开 [fly.ai 监控](/projects/flyai)，看两件事：积分月份是不是你要的那一个月，公开地址是否出现在这份月份里。对得上时才有月积分和份额。对不上时显示的是空，不是一笔金额。",
      "## 空和零不是同一个结论",
      "地址不在当前月份列表里，监控无法给出该地址的积分。这不证明机器离线，也不制造一笔 0 收入。若列表里这个地址的积分明确是 0，那才是本月计分为 0。0 分仍然不是已领取的美元。月份、结束时间和份额的读法见 [当前月份](/learn/flyai-monitor-guide)。",
      "## 按你看到的分支走",
      "- 官方页面写着钱包未连接：fly.ai 说明此时积分无法支付。先在 Compute 页面连接公开地址，再回到监控用同一个 0x 查询。",
      "- 官方页面写着错误答案把当天清零：当天计分作废。月积分只会反映清零之后还留下的分数，不会把整月标成未知。",
      "- 积分月份仍是上一个月：公开记录还没换到新月。不要把那一行当成本月收入。监控大约每分钟再读一次；月份标签变了再读新的积分。",
      "- 手机浏览器挖矿：官方写明只有该标签页留在屏幕上时才会继续，并且需要约 57 MB 的下载、电源和 Wi-Fi。标签页被关掉或切走，当天可以没有新分数。",
      "## 单机和钱包仍然要分开",
      "一台机器停了，同一个钱包上的其他机器仍可能让月积分大于 0。一台机器在跑，若钱包未连接或地址抄错，监控仍可能是空的。单机状态以官方页面为准。积分为什么不等于领取金额，见 [月积分与收入](/learn/flyai-monthly-points-vs-income)。",
      "## 举例",
      "举例，不是某台真实机器：地址不在 2026-10 的列表里，监控是空，不能写成收入 0。另一地址在列表里积分为 0，才是本月计分 0。若官方页面显示某日因错误答案被清零，清掉的是那一天，不是把份额改成美元 0。",
      "## 下一步",
      "在 [fly.ai 监控](/projects/flyai) 刷新一次，只在月份和地址都对上时读积分。然后打开官方 Compute 页面，确认钱包已连接、当天任务是否被接受。空行不要填成 0，也不要据此判断可以领取。",
      "监控看不出是哪一次任务被判错，也看不出手机标签页是否在前台。那些留在官方页面。公开记录未更新之前，没有新的月积分可显示。",
    ],
    "zh-TW": [
      "fly.ai 積分位置是空的，先不要把它讀成 0 美元。打開 [fly.ai 監控](/projects/flyai)，看兩件事：積分月份是不是你要的那一個月，公開地址是否出現在這份月份裡。對得上時才有月積分和份額。對不上時顯示的是空，不是一筆金額。",
      "## 空和零不是同一個結論",
      "地址不在目前月份清單裡，監控無法給出該地址的積分。這不證明機器離線，也不製造一筆 0 收入。若清單裡這個地址的積分明確是 0，那才是本月計分為 0。0 分仍然不是已領取的美元。月份、結束時間和份額的讀法見 [目前月份](/learn/flyai-monitor-guide)。",
      "## 按你看到的分支走",
      "- 官方頁面寫著錢包未連接：fly.ai 說明此時積分無法支付。先在 Compute 頁面連接公開地址，再回到監控用同一個 0x 查詢。",
      "- 官方頁面寫著錯誤答案把當天清零：當天計分作廢。月積分只會反映清零之後還留下的分數，不會把整月標成未知。",
      "- 積分月份仍是上一個月：公開記錄還沒換到新月。不要把那一列當成本月收入。監控大約每分鐘再讀一次；月份標籤變了再讀新的積分。",
      "- 手機瀏覽器挖礦：官方寫明只有該分頁留在畫面上時才會繼續，並且需要約 57 MB 的下載、電源和 Wi-Fi。分頁被關掉或切走，當天可以沒有新分數。",
      "## 單機和錢包仍然要分開",
      "一台機器停了，同一個錢包上的其他機器仍可能讓月積分大於 0。一台機器在跑，若錢包未連接或地址抄錯，監控仍可能是空的。單機狀態以官方頁面為準。積分為什麼不等於領取金額，見 [月積分與收入](/learn/flyai-monthly-points-vs-income)。",
      "## 舉例",
      "舉例，不是某台真實機器：地址不在 2026-10 的清單裡，監控是空，不能寫成收入 0。另一地址在清單裡積分為 0，才是本月計分 0。若官方頁面顯示某日因錯誤答案被清零，清掉的是那一天，不是把份額改成美元 0。",
      "## 下一步",
      "在 [fly.ai 監控](/projects/flyai) 重新整理一次，只在月份和地址都對上時讀積分。然後打開官方 Compute 頁面，確認錢包已連接、當天任務是否被接受。空列不要填成 0，也不要據此判斷可以領取。",
      "監控看不出是哪一次任務被判錯，也看不出手機分頁是否在前景。那些留在官方頁面。公開記錄未更新之前，沒有新的月積分可顯示。",
    ],
    en: [
      "When the fly.ai points slot is empty, do not read it as zero dollars. Open [fly.ai monitoring](/projects/flyai) and check two things: whether the points month is the month you mean, and whether the public address is in that month. Points and share appear only when both match. Otherwise the slot is empty. It is not an amount.",
      "## Empty and zero are different conclusions",
      "If the address is not in the current month list, the monitor cannot show points for it. That does not prove the machine is offline, and it does not create a zero payout. A listed zero is the case where this address’s score in the month record is 0. That zero is still not dollars claimed. How to read the month, the end time, and the share is in [the current month](/learn/flyai-monitor-guide).",
      "## Follow the branch you actually see",
      "- The official page says the wallet is not linked. fly.ai says credit cannot be paid then. Link the public address on the Compute page, then look up that same 0x here.",
      "- The official page says a wrong answer zeroed the day. That day’s score is void. Month points show only the score that remains. The month is not marked unknown.",
      "- The points month is still the previous month. The public record has not rolled forward. Do not treat that row as this month’s income. The monitor reads the public month about once a minute. Read the new points after the month label changes.",
      "- You are mining in a phone browser. fly.ai says mining continues only while that tab is on screen, and it asks for power, Wi-Fi, and a download of about 57 MB. If the tab is closed or sent away, that day can have no new score.",
      "## One machine and the wallet still come apart",
      "One machine can be stopped while others on the same wallet keep the month points above zero. One machine can be running while the monitor stays empty because the wallet is unlinked or the address was copied wrong. Machine state stays on the official page. Why points are not a claim amount is in [monthly points vs income](/learn/flyai-monthly-points-vs-income).",
      "## Example",
      "Illustrative, not a real machine: an address absent from the 2026-10 list leaves the monitor empty. Do not write that as income 0. A different address listed at 0 is a month score of 0. If the official page says one day was zeroed for a wrong answer, that day was cleared. The share was not converted into zero dollars.",
      "## Next step",
      "Refresh [fly.ai monitoring](/projects/flyai) once, and read points only when the month and the address both match. Then open the official Compute page and confirm the wallet is linked and whether today’s jobs were accepted. Do not fill an empty row with 0, and do not treat it as something you can claim.",
      "The monitor cannot name which job was marked wrong, and it cannot see whether a phone tab is in front. Those stay on the official page. Until the public record updates, there are no newer month points to show.",
    ],
    ko: [
      "fly.ai 포인트 자리가 비어 있으면 0달러로 읽지 마세요. [fly.ai 모니터링](/projects/flyai)을 열고 두 가지를 봅니다. 포인트 월이 원하는 달인지, 공개 주소가 그 달에 있는지입니다. 둘 다 맞을 때만 포인트와 몫이 나옵니다. 아니면 자리가 빈 것이며 금액이 아닙니다.",
      "## 빈칸과 0은 다른 결론입니다",
      "주소가 현재 월 목록에 없으면 모니터는 그 주소의 포인트를 보여 줄 수 없습니다. 기기가 꺼졌다는 증거가 아니고, 0원 지급이 생기는 것도 아닙니다. 목록에 0이 적혀 있을 때만 이 주소의 이번 달 점수가 0입니다. 그 0도 청구한 달러는 아닙니다. 월, 종료 시각, 몫은 [현재 월](/learn/flyai-monitor-guide)에 있습니다.",
      "## 실제로 보이는 갈림길",
      "- 공식 페이지가 지갑 미연결이라고 합니다. fly.ai는 그때 크레딧을 지급할 수 없다고 합니다. Compute에서 공개 주소를 연결한 뒤, 같은 0x로 여기 조회하세요.",
      "- 공식 페이지가 오답으로 그날이 0이 됐다고 합니다. 그날 점수는 무효입니다. 월 포인트는 남은 점수만 보여 주며, 그달을 알 수 없음으로 표시하지 않습니다.",
      "- 포인트 월이 아직 지난달입니다. 공개 기록이 새 달로 넘어가지 않은 것입니다. 그 행을 이번 달 수입으로 보지 마세요. 모니터는 공개 월을 약 1분에 한 번 읽습니다. 월 표시가 바뀐 뒤에 새 포인트를 읽습니다.",
      "- 휴대폰 브라우저로 채굴 중입니다. fly.ai는 그 탭이 화면에 있을 때만 계속되고, 전원, Wi-Fi, 약 57MB 다운로드가 필요하다고 합니다. 탭을 닫거나 벗어나면 그날에 새 점수가 없을 수 있습니다.",
      "## 기기 한 대와 지갑은 여전히 다릅니다",
      "한 대가 멈춰도 같은 지갑의 다른 기기가 월 포인트를 0보다 크게 유지할 수 있습니다. 한 대가 돌아가도 지갑이 연결되지 않았거나 주소를 잘못 복사하면 모니터는 비어 있을 수 있습니다. 기기 상태는 공식 페이지에 있습니다. 포인트가 청구 금액이 아닌 이유는 [월 포인트와 수입](/learn/flyai-monthly-points-vs-income)에 있습니다.",
      "## 예시",
      "예시이며 실제 기기가 아닙니다. 주소가 2026-10 목록에 없으면 모니터는 비어 있고, 수입 0으로 적지 않습니다. 다른 주소가 목록에서 0이면 이번 달 점수가 0입니다. 공식 페이지가 오답으로 어느 하루가 0이 됐다고 하면, 지워진 것은 그 하루이며 몫이 0달러가 된 것이 아닙니다.",
      "## 다음 단계",
      "[fly.ai 모니터링](/projects/flyai)을 한 번 새로고침하고, 월과 주소가 모두 맞을 때만 포인트를 읽습니다. 그다음 공식 Compute 페이지에서 지갑 연결과 오늘 작업의 수락 여부를 확인합니다. 빈 행을 0으로 채우거나 청구할 수 있다고 보지 마세요.",
      "모니터는 어떤 작업이 오답이었는지, 휴대폰 탭이 앞에 있는지는 알지 못합니다. 그것은 공식 페이지에 남습니다. 공개 기록이 갱신되기 전에는 더 새로운 월 포인트를 보여 줄 수 없습니다.",
    ],
    ja: [
      "fly.ai のポイント欄が空でも、0 ドルとは読まないでください。[fly.ai モニタリング](/projects/flyai) を開き、二つを確認します。ポイント月が意図した月か、公開アドレスがその月にあるかです。両方が一致したときだけポイントとシェアが出ます。一致しなければ欄は空であり、金額ではありません。",
      "## 空とゼロは別の結論です",
      "アドレスが現在の月の一覧に無ければ、モニターはそのポイントを出せません。機器がオフラインだという証明ではなく、0 の支払を作るものでもありません。一覧に 0 とあるときだけ、このアドレスの今月の得点が 0 です。その 0 も請求済みのドルではありません。月、終了時刻、シェアの読み方は [現在の月](/learn/flyai-monitor-guide) にあります。",
      "## 見えている分岐に沿う",
      "- 公式ページがウォレット未接続と書いている。fly.ai はそのときクレジットを支払えないと述べます。Compute で公開アドレスを接続してから、同じ 0x をここで照会します。",
      "- 公式ページが誤答でその日がゼロだと書いている。その日の得点は無効です。月間ポイントは残った得点だけを示し、月全体を不明にはしません。",
      "- ポイント月がまだ先月である。公開記録が新しい月へ移っていません。その行を今月の収入にしないでください。モニターは公開月を約 1 分に 1 回読みます。月の表示が変わってから新しいポイントを読みます。",
      "- 電話のブラウザで採掘している。fly.ai は、そのタブが画面にある間だけ続き、電源、Wi-Fi、約 57MB のダウンロードが要ると書きます。タブを閉じるか離すと、その日に新しい得点が無いことがあります。",
      "## 1台とウォレットはやはり別です",
      "1台が止まっても、同じウォレットの他のマシンが月間ポイントを 0 より大きく保つことがあります。1台が動いていても、ウォレット未接続やアドレスの写し間違いでモニターは空のままです。マシンの状態は公式ページにあります。ポイントが請求額でない理由は [月間ポイントと収入](/learn/flyai-monthly-points-vs-income) にあります。",
      "## 例",
      "例示であり、実在のマシンではありません。アドレスが 2026-10 の一覧に無ければモニターは空で、収入 0 とは書きません。別のアドレスが一覧で 0 なら、今月の得点が 0 です。公式ページがある日を誤答でゼロにしたと出すなら、消えたのはその日であり、シェアが 0 ドルになったのではありません。",
      "## 次にすること",
      "[fly.ai モニタリング](/projects/flyai) を一度更新し、月とアドレスが両方一致するときだけポイントを読みます。それから公式 Compute ページで、ウォレットが接続されているか、今日のジョブが受け入れられたかを確認します。空の行を 0 で埋めず、請求できるものとも扱わないでください。",
      "モニターは、どのジョブが誤答とされたか、電話のタブが前面かは分かりません。それらは公式ページに残ります。公開記録が更新されるまで、より新しい月間ポイントは表示できません。",
    ],
  },
};

export const flyaiDepthGuides: Article[] = [
  monitor,
  walletVsToken,
  pointsVsIncome,
  manyMachines,
  zeroPoints,
];
