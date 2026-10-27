import type { Article } from "../articles";

type Text = Article["title"];
type Questions = NonNullable<Article["questions"]>;

function text(zh: string, tw: string, en: string, ko: string, ja: string): Text {
  return { zh, "zh-TW": tw, en, ko, ja };
}

function questions(rows: Array<[Text, Text]>): Questions {
  return {
    zh: rows.map(([q, a]) => ({ question: q.zh, answer: a.zh })),
    "zh-TW": rows.map(([q, a]) => ({ question: q["zh-TW"], answer: a["zh-TW"] })),
    en: rows.map(([q, a]) => ({ question: q.en, answer: a.en })),
    ko: rows.map(([q, a]) => ({ question: q.ko, answer: a.ko })),
    ja: rows.map(([q, a]) => ({ question: q.ja, answer: a.ja })),
  };
}

function paras(
  zh: string[],
  tw: string[],
  en: string[],
  ko: string[],
  ja: string[],
): Article["body"] {
  return { zh, "zh-TW": tw, en, ko, ja };
}

function table(headers: Text, rows: Text[]): NonNullable<Article["comparison"]> {
  const locales = ["zh", "zh-TW", "en", "ko", "ja"] as const;
  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      { headers: headers[locale].split("|"), rows: rows.map((row) => row[locale].split("|")) },
    ]),
  ) as NonNullable<Article["comparison"]>;
}

const slugs = {
  monitor: "vast-monitor-guide",
  contract: "vast-host-machine-vs-contract",
  offers: "vast-gpu-occupancy-and-offers",
  balance: "vast-host-revenue-vs-balance",
  key: "vast-api-key-read-only-monitoring",
} as const;

const tool = {
  zh: "[Vast.ai 监控](/projects/vast)",
  "zh-TW": "[Vast.ai 監控](/projects/vast)",
  en: "[Vast.ai monitor](/projects/vast)",
  ko: "[Vast.ai 모니터](/projects/vast)",
  ja: "[Vast.ai モニター](/projects/vast)",
} as const;

const sources = {
  host: { name: "Vast.ai hosting overview", url: "https://docs.vast.ai/host/hosting-overview" },
  permissions: {
    name: "Vast.ai API permissions",
    url: "https://docs.vast.ai/api-reference/permissions",
  },
  site: { name: "Vast.ai", url: "https://vast.ai/" },
  machines: { name: "Vast Host machines", url: "https://console.vast.ai/host/machines" },
};

const monitorSources = [sources.host, sources.permissions, sources.machines];
const contractSources = [sources.host, sources.machines];
const offerSources = [sources.host, sources.site];
const balanceSources = [sources.host, sources.permissions];
const keySources = [sources.permissions, sources.host];

export const vastDepthGuides: Article[] = [
  {
    slug: slugs.monitor,
    modified: "2026-10-24",
    project: "vast",
    sources: monitorSources,
    related: [slugs.balance, slugs.key, slugs.contract],
    topic: text(
      "Host 当日收入",
      "Host 當日收入",
      "Host day income",
      "Host 당일 수입",
      "Hostの当日収入",
    ),
    title: text(
      "Vast.ai Host 收入怎么加总：Machine ID 与四项分量",
      "Vast.ai Host 收入怎麼加總：Machine ID 與四項分量",
      "How to add Vast.ai host income: Machine ID and four components",
      "Vast.ai Host 수입을 어떻게 합치나요: Machine ID와 네 항목",
      "Vast.ai Host収入の合計：Machine IDと4つの内訳",
    ),
    description: text(
      "在 Vast.ai 监控填写 Host 机器页上的 Machine ID。当日美元是 GPU、存储、上传带宽、下载带宽四项都有数字时的合计。缺一项就保持未知，不用账户余额填补。",
      "在 Vast.ai 監控填寫 Host 機器頁上的 Machine ID。當日美元是 GPU、儲存、上傳頻寬、下載頻寬四項都有數字時的合計。缺一項就保持未知，不用帳戶餘額填補。",
      "Enter the Machine ID from the Vast.ai Host machines page. The day’s USD total appears only when GPU, storage, upload bandwidth, and download bandwidth are all present. A missing line stays unknown.",
      "Vast.ai 모니터에는 Host 기기 페이지의 Machine ID를 넣습니다. 당일 USD는 GPU, 스토리지, 업로드, 다운로드 네 줄이 모두 있을 때만 합계입니다. 한 줄이 없으면 알 수 없음입니다.",
      "Vast.aiモニターにはHostマシンページのMachine IDを入れます。当日のUSDはGPU、ストレージ、上り、下りの4行が揃ったときだけ合計です。1行でも欠ければ不明のままです。",
    ),
    summary: text(
      "用 Host 的整数 Machine ID 查看香港时间当日记到这台机器上的四项美元。不要用租客 Instance ID，也不要把账户余额当成这台机器的当日收入。",
      "用 Host 的整數 Machine ID 查看香港時間當日記到這台機器上的四項美元。不要用租客 Instance ID，也不要把帳戶餘額當成這台機器的當日收入。",
      "Use the host’s integer Machine ID to read the four USD lines booked to that machine for the Hong Kong day. Do not substitute a renter Instance ID or the account credit balance.",
      "Host의 정수 Machine ID로 홍콩 시간 당일 그 기기에 기입된 네 USD 항목을 봅니다. 임차 Instance ID나 계정 잔액으로 바꾸지 않습니다.",
      "Hostの整数Machine IDで、香港時間の当日にそのマシンへ記帳された4つのUSDを見ます。借り手のInstance IDや口座残高では代用しません。",
    ),
    comparisonTitle: text(
      "四项怎样变成当日合计",
      "四項怎樣變成當日合計",
      "How four lines become the day total",
      "네 항목이 당일 합계가 되는 방식",
      "4行が当日合計になる条件",
    ),
    comparison: table(
      text(
        "页面上的数|代表什么|缺了会怎样",
        "頁面上的數|代表什麼|缺了會怎樣",
        "Figure on the page|What it is|If it is missing",
        "화면의 숫자|의미|없으면",
        "画面の数|意味|欠けると",
      ),
      [
        text(
          "Machine ID|Host 机器页上的正整数|找不到这台机器，不显示收入",
          "Machine ID|Host 機器頁上的正整數|找不到這台機器，不顯示收入",
          "Machine ID|Positive integer on the Host machines page|That machine is not shown",
          "Machine ID|Host 기기 페이지의 양의 정수|그 기기는 표시되지 않음",
          "Machine ID|Hostマシンページの正の整数|そのマシンは出ない",
        ),
        text(
          "GPU 收入|报告里这台机器的 GPU 租金|当日合计保持未知",
          "GPU 收入|報告裡這台機器的 GPU 租金|當日合計保持未知",
          "GPU earnings|GPU rental booked to this machine|Day total stays unknown",
          "GPU 수입|이 기기에 기입된 GPU 임대료|당일 합계는 알 수 없음",
          "GPU収入|このマシンに記帳されたGPU賃料|当日合計は不明",
        ),
        text(
          "存储收入|报告里的存储分量|当日合计保持未知",
          "儲存收入|報告裡的儲存分量|當日合計保持未知",
          "Storage earnings|Storage line in the same report|Day total stays unknown",
          "스토리지 수입|같은 보고서의 스토리지 항목|당일 합계는 알 수 없음",
          "ストレージ収入|同じ報告のストレージ行|当日合計は不明",
        ),
        text(
          "上传 / 下载带宽|报告里的两项带宽|任缺一项，合计都未知",
          "上傳 / 下載頻寬|報告裡的兩項頻寬|任缺一項，合計都未知",
          "Upload / download bandwidth|The two bandwidth lines|Either gap keeps the total unknown",
          "업로드 / 다운로드|대역폭 두 줄|하나라도 없으면 합계는 알 수 없음",
          "上り / 下り|帯域の2行|どちらか欠ければ合計は不明",
        ),
        text(
          "当日合计|四项都是数字时的美元和|不会改记成 0，也不用余额顶上",
          "當日合計|四項都是數字時的美元和|不會改記成 0，也不用餘額頂上",
          "Day total|USD sum when all four are numbers|Not rewritten as 0 or filled from balance",
          "당일 합계|네 줄이 모두 숫자일 때의 USD 합|0으로 바꾸거나 잔액으로 채우지 않음",
          "当日合計|4行がすべて数のときのUSD和|0にも残高の穴埋めにもしない",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "租客控制台里的 Instance ID 能填进监控吗？",
          "租客主控台裡的 Instance ID 能填進監控嗎？",
          "Can I paste a renter Instance ID into the monitor?",
          "임차 콘솔의 Instance ID를 모니터에 넣을 수 있나요?",
          "借り手コンソールのInstance IDをモニターに入れられますか？",
        ),
        text(
          "不能。监控认的是 Host 机器页上的 Machine ID，一串不以 0 开头的正整数。Instance ID 是某一份租约上的实例，换机器或换客户就会变。",
          "不能。監控認的是 Host 機器頁上的 Machine ID，一串不以 0 開頭的正整數。Instance ID 是某一份租約上的實例，換機器或換客戶就會變。",
          "No. The monitor expects the Machine ID on the Host machines page: a positive integer that does not start with 0. An Instance ID belongs to one rental and changes with the client or the instance.",
          "안 됩니다. 모니터는 Host 기기 페이지의 Machine ID, 즉 0으로 시작하지 않는 양의 정수를 받습니다. Instance ID는 한 임대에 붙고 고객이나 인스턴스가 바뀌면 달라집니다.",
          "できません。モニターが受け取るのはHostマシンページのMachine IDで、0から始まらない正の整数です。Instance IDは一つのレンタルに付き、客やインスタンスが変わると別の番号になります。",
        ),
      ],
      [
        text(
          "四项里少了一项，能把其余三项加起来吗？",
          "四項裡少了一項，能把其餘三項加起來嗎？",
          "If one of the four lines is missing, can I add the other three?",
          "네 항목 중 하나가 없으면 나머지 셋을 더해도 되나요?",
          "4行のうち1行が無いとき、残り3行を足してよいですか？",
        ),
        text(
          "页面不会这样做。少一项时当日合计保持未知，不是其余三项的和，也不是 0。到 Host 的收入报告里把缺的那一项补齐后再看合计。",
          "頁面不會這樣做。少一項時當日合計保持未知，不是其餘三項的和，也不是 0。到 Host 的收入報告裡把缺的那一項補齊後再看合計。",
          "The page will not. The day total stays unknown. It is not the sum of the three known lines, and it is not zero. Read the total again after the missing line is present in the host earnings report.",
          "페이지는 그렇게 하지 않습니다. 당일 합계는 알 수 없음입니다. 알려진 셋의 합도 아니고 0도 아닙니다. Host 수입 보고에 빠진 줄이 나온 뒤에 합계를 다시 봅니다.",
          "画面はそうしません。当日合計は不明のままです。分かっている3行の和でも0でもありません。Hostの収入報告に欠けた行が出てから合計を見ます。",
        ),
      ],
      [
        text(
          "连上读取密钥，是否就证明这是已验证的 Host 账户？",
          "連上讀取密鑰，是否就證明這是已驗證的 Host 帳戶？",
          "Does connecting a read key prove the Host account is verified?",
          "읽기 키를 연결하면 검증된 Host 계정이라는 뜻인가요?",
          "読取キーを接続すると、検証済みHostアカウントだと証明されますか？",
        ),
        text(
          "不证明。密钥只用来读取你授权的机器列表和收入报告。Vast 的机器验证是另一套自动流程，看可靠性和报错，和这里能不能读到当日合计不是同一件事。",
          "不證明。密鑰只用來讀取你授權的機器列表和收入報告。Vast 的機器驗證是另一套自動流程，看可靠性和報錯，和這裡能不能讀到當日合計不是同一件事。",
          "No. The key only reads the machine list and earnings report you authorized. Vast’s own verification is a separate automatic process based on reliability and active errors. A readable day total is not that badge.",
          "증명하지 않습니다. 키는 승인한 기기 목록과 수입 보고만 읽습니다. Vast의 머신 검증은 신뢰도와 오류를 보는 별도 자동 절차이며, 당일 합계가 보인다는 것과 다릅니다.",
          "証明しません。キーは許可したマシン一覧と収入報告を読むだけです。Vastのマシン検証は信頼性とエラーを見る別の自動手続きで、当日合計が読めることとは別です。",
        ),
      ],
    ]),
    decision: {
      title: text(
        "先核对 Machine ID",
        "先核對 Machine ID",
        "Check the Machine ID first",
        "먼저 Machine ID를 확인",
        "先にMachine IDを確認",
      ),
      action: text(
        "从 Host 机器页复制整数 Machine ID，在监控里看香港时间当日的四项合计。缺一项就保持未知。",
        "從 Host 機器頁複製整數 Machine ID，在監控裡看香港時間當日的四項合計。缺一項就保持未知。",
        "Copy the integer Machine ID from the Host machines page and read the four-line Hong Kong day total. A missing line stays unknown.",
        "Host 기기 페이지에서 정수 Machine ID를 복사하고 홍콩 시간 당일의 네 항목 합계를 봅니다. 한 줄이 없으면 알 수 없음입니다.",
        "Hostマシンページから整数のMachine IDをコピーし、香港時間当日の4行合計を見ます。1行でも欠ければ不明です。",
      ),
    },
    body: paras(
      [
        "当日收入是这台 Host 机器在香港时间当天的四项美元合计：GPU、存储、上传带宽、下载带宽。四项都是数字才相加。打开 " +
          tool.zh +
          "，填写 Host 机器页上的 Machine ID，不要填租客的 Instance ID。",
        "## 这些数字各是什么",
        "Machine ID 是 Host 账户里一台已登记机器的编号，正整数，不以 0 开头。GPU 型号和 GPU 数量来自同一台机器的登记资料，用来认出机器，本身不是收入。",
        "收入单位是美元，时间范围是香港时间当日（UTC+8 的零点到现在）。账户里的信用余额、别的机器的收入，都不会加进这个合计。",
        "## 先看什么",
        "- 在 [Host 机器页](https://console.vast.ai/host/machines) 复制 Machine ID，确认它属于 Host 账户，而不是客户实例。",
        "- 看四项是否都有数字。少一项时页面不给合计。",
        "- 用同一台机器、同一个香港日，对照 Host 收入报告，而不是对照账户余额。",
        "## 接下来怎么处理",
        "- 四项齐全：把页面上的合计当作这一日、这一台机器的报告金额，再和官方报告逐项对照。",
        "- 机器找不到：回到机器页核对编号，不要改用 Instance ID。",
        "- 报告被拒绝或少一项：合计保持未知。换只读权限见 [读取密钥](/learn/" +
          slugs.key +
          ")。余额和当日收入的差别见 [收入与余额](/learn/" +
          slugs.balance +
          ")。",
        "## 举例",
        "举例，不是某台真实机器的入账：GPU 1.20、存储 0.30、上传 0.10、下载 0.05，当日合计是 1.65 美元。若下载那一项没有数字，合计保持未知，不是 1.60，也不是 0。",
        "## 界限",
        "这个合计不包含尚未写入这四项的金额，也不承诺能提现或何时到账。Vast 公开站写的是客户侧按秒计费和自行定价，那不是这台机器的 Host 当日报告。免费方案每个项目可保存 3 台设备，Pro 为 100 台；同一台已保存设备上多绑一个来源不另占名额。崩溃分析不另收费。Agent 只能操作 Mac 上的 Train at Home，不能开关 Vast 租约。",
      ],
      [
        "當日收入是這台 Host 機器在香港時間當天的四項美元合計：GPU、儲存、上傳頻寬、下載頻寬。四項都是數字才相加。打開 " +
          tool["zh-TW"] +
          "，填寫 Host 機器頁上的 Machine ID，不要填租客的 Instance ID。",
        "## 這些數字各是什麼",
        "Machine ID 是 Host 帳戶裡一台已登記機器的編號，正整數，不以 0 開頭。GPU 型號和 GPU 數量來自同一台機器的登記資料，用來認出機器，本身不是收入。",
        "收入單位是美元，時間範圍是香港時間當日（UTC+8 的零點到現在）。帳戶裡的信用餘額、別的機器的收入，都不會加進這個合計。",
        "## 先看什麼",
        "- 在 [Host 機器頁](https://console.vast.ai/host/machines) 複製 Machine ID，確認它屬於 Host 帳戶，而不是客戶實例。",
        "- 看四項是否都有數字。少一項時頁面不給合計。",
        "- 用同一台機器、同一個香港日，對照 Host 收入報告，而不是對照帳戶餘額。",
        "## 接下來怎麼處理",
        "- 四項齊全：把頁面上的合計當作這一日、這一台機器的報告金額，再和官方報告逐項對照。",
        "- 機器找不到：回到機器頁核對編號，不要改用 Instance ID。",
        "- 報告被拒絕或少一項：合計保持未知。換只讀權限見 [讀取密鑰](/learn/" +
          slugs.key +
          ")。餘額和當日收入的差別見 [收入與餘額](/learn/" +
          slugs.balance +
          ")。",
        "## 舉例",
        "舉例，不是某台真實機器的入帳：GPU 1.20、儲存 0.30、上傳 0.10、下載 0.05，當日合計是 1.65 美元。若下載那一項沒有數字，合計保持未知，不是 1.60，也不是 0。",
        "## 界限",
        "這個合計不包含尚未寫入這四項的金額，也不承諾能提現或何時到帳。Vast 公開站寫的是客戶側按秒計費和自行定價，那不是這台機器的 Host 當日報告。免費方案每個專案可保存 3 台設備，Pro 為 100 台；同一台已保存設備上多綁一個來源不另占名額。當機分析不另收費。Agent 只能操作 Mac 上的 Train at Home，不能開關 Vast 租約。",
      ],
      [
        "The day’s host income is the USD sum of four lines for one machine on the Hong Kong day: GPU, storage, upload bandwidth, and download bandwidth. The " +
          tool.en +
          " adds them only when every line is a number. Paste the Machine ID from the Host machines page, not a renter’s Instance ID.",
        "## What the figures mean",
        "The Machine ID is the positive integer for one registered machine on the hosting account. It does not start with 0. GPU name and GPU count come from that same machine record so you can recognize the box. They are not income.",
        "The unit is USD. The window is the Hong Kong day, from midnight UTC+8 until now. Account credit and another machine’s earnings are not added into this total.",
        "## What to inspect",
        "- Copy the Machine ID on the [Host machines page](https://console.vast.ai/host/machines) and confirm it belongs to the hosting account, not a client instance.",
        "- Check that all four lines are numbers. One gap means the page shows no day total.",
        "- Compare the same machine and the same Hong Kong day with the host earnings report, not with the account balance.",
        "## What to do next",
        "- All four present: treat the page total as that machine’s reported amount for that day, then match each line to the official report.",
        "- Machine not found: recheck the id on the machines page. Do not switch to an Instance ID.",
        "- Report refused or one line missing: leave the total unknown. For a read-only key see [API key](/learn/" +
          slugs.key +
          "). For balance versus this total see [revenue and balance](/learn/" +
          slugs.balance +
          ").",
        "## Illustrative case",
        "Illustrative, not a real machine’s payout: GPU 1.20, storage 0.30, upload 0.10, and download 0.05 sum to 1.65 USD for that day. If the download line has no number, the total stays unknown, not 1.60 and not 0.",
        "## Limits",
        "The total does not include money that never arrived in these four lines, and it does not promise a withdrawal or a payout time. Vast’s public site describes client per-second billing and market prices. That is not this machine’s host day report. Free keeps three saved devices per project, Pro fifty. Another source on the same saved device does not take another slot. Crash analysis is free. The agent controls Train at Home on a Mac only; it cannot start or stop Vast rentals.",
      ],
      [
        "당일 수입은 홍콩 시간 하루 동안 한 Host 머신에 기입된 네 USD 항목의 합입니다. GPU, 스토리지, 업로드 대역폭, 다운로드 대역폭입니다. 네 줄이 모두 숫자일 때만 " +
          tool.ko +
          "가 더합니다. Host 기기 페이지의 Machine ID를 넣고, 임차인의 Instance ID는 넣지 않습니다.",
        "## 각 숫자가 의미하는 것",
        "Machine ID는 Host 계정에 등록된 머신 하나의 양의 정수이며 0으로 시작하지 않습니다. GPU 이름과 GPU 수는 같은 머신 기록에서 오며 기계를 알아보는 용도입니다. 수입이 아닙니다.",
        "단위는 USD입니다. 구간은 홍콩 시간 당일, 즉 UTC+8 자정부터 지금까지입니다. 계정 크레딧과 다른 머신의 수입은 이 합계에 더하지 않습니다.",
        "## 무엇을 볼지",
        "- [Host 기기 페이지](https://console.vast.ai/host/machines)에서 Machine ID를 복사하고, 고객 인스턴스가 아닌 Host 계정 번호인지 확인합니다.",
        "- 네 줄이 모두 숫자인지 봅니다. 한 줄이 없으면 페이지는 당일 합계를 주지 않습니다.",
        "- 같은 머신, 같은 홍콩일을 Host 수입 보고와 대조합니다. 계정 잔액과 대조하지 않습니다.",
        "## 다음에 할 일",
        "- 네 줄이 다 있으면: 페이지 합계를 그날 그 머신의 보고 금액으로 보고, 공식 보고와 줄마다 맞춥니다.",
        "- 머신을 찾지 못하면: 기기 페이지에서 번호를 다시 확인합니다. Instance ID로 바꾸지 않습니다.",
        "- 보고가 거부되거나 한 줄이 없으면: 합계는 알 수 없음으로 둡니다. 읽기 전용 키는 [API 키](/learn/" +
          slugs.key +
          "), 잔액과의 차이는 [수입과 잔액](/learn/" +
          slugs.balance +
          ")을 봅니다.",
        "## 예시",
        "예시이며 실제 머신의 지급이 아닙니다. GPU 1.20, 스토리지 0.30, 업로드 0.10, 다운로드 0.05이면 그날 합계는 1.65 USD입니다. 다운로드에 숫자가 없으면 합계는 알 수 없음이며 1.60도 0도 아닙니다.",
        "## 한계",
        "이 합계는 네 줄에 들어오지 않은 금액을 포함하지 않으며, 출금이나 지급 시각을 약속하지 않습니다. Vast 공개 사이트의 고객 초당 과금과 시장 가격은 이 머신의 Host 당일 보고가 아닙니다. 무료는 프로젝트마다 저장 기기 3대, Pro는 100대입니다. 같은 저장 기기에 출처를 더 묶어도 자리는 늘지 않습니다. 장애 분석은 무료입니다. Agent는 Mac의 Train at Home만 다루며 Vast 임대를 켜거나 끄지 않습니다.",
      ],
      [
        "当日の収入は、香港時間のその日に1台のHostマシンへ記帳された4つのUSDの合計です。GPU、ストレージ、上り帯域、下り帯域です。4行がすべて数のときだけ " +
          tool.ja +
          " が足します。HostマシンページのMachine IDを入れ、借り手のInstance IDは入れません。",
        "## 各数字の意味",
        "Machine IDはHostアカウントに登録された1台の正の整数で、0から始まりません。GPU名とGPU数は同じマシン記録から来て、どの機械かを見分けるためのものです。収入ではありません。",
        "単位はUSDです。範囲は香港時間の当日、UTC+8の午前0時から今までです。口座クレジットと別マシンの収入は、この合計に足しません。",
        "## 何を見るか",
        "- [Hostマシンページ](https://console.vast.ai/host/machines)でMachine IDをコピーし、顧客インスタンスではなくHostアカウントの番号か確認します。",
        "- 4行がすべて数かを見ます。1行でも無ければ、画面は当日合計を出しません。",
        "- 同じマシン、同じ香港日をHostの収入報告と照合します。口座残高とは照合しません。",
        "## 次にすること",
        "- 4行が揃っている: 画面の合計を、その日そのマシンの報告額として公式報告と行ごとに合わせます。",
        "- マシンが見つからない: マシンページで番号を見直します。Instance IDには切り替えません。",
        "- 報告が拒否された、または1行が無い: 合計は不明のままにします。読取専用キーは [APIキー](/learn/" +
          slugs.key +
          ")、残高との違いは [収入と残高](/learn/" +
          slugs.balance +
          ") を見ます。",
        "## 例示",
        "例示であり、実在マシンの入金ではありません。GPU 1.20、ストレージ 0.30、上り 0.10、下り 0.05 なら、その日の合計は 1.65 USDです。下りに数が無ければ合計は不明のままで、1.60でも0でもありません。",
        "## 限界",
        "この合計は4行に入っていない金額を含まず、出金や着金時刻も約束しません。Vastの公開サイトにある顧客向けの秒課金と市場価格は、このマシンのHost当日報告ではありません。無料はプロジェクトごとに保存デバイス3台、Proは100台です。同じ保存デバイスにもう一つの出典を足しても枠は増えません。障害分析は無料です。Agentが操作できるのはMac上のTrain at Homeだけで、Vastのレンタルは開始も停止もできません。",
      ],
    ),
  },
  {
    slug: slugs.contract,
    published: "2026-10-24",
    modified: "2026-10-24",
    project: "vast",
    sources: contractSources,
    related: [slugs.monitor, slugs.offers, slugs.balance],
    topic: text("机器与租约", "機器與租約", "Machine and contract", "머신과 계약", "マシンと契約"),
    title: text(
      "Vast.ai 上改价之后，已有租约还按旧价吗？",
      "Vast.ai 上改價之後，已有租約還按舊價嗎？",
      "After you change a Vast.ai price, do current rentals keep the old rate?",
      "Vast.ai에서 가격을 바꾼 뒤에도 기존 임대는 이전 요금인가요?",
      "Vast.aiで価格を変えたあと、既存レンタルは旧料金のままですか？",
    ),
    description: text(
      "Vast 的报价可以改，已成立的租约会锁住成交时的价格、结束日和硬件。下架只是不再接受新租约。监控里的 Machine ID 仍是整台机器，不是某一份租约。",
      "Vast 的報價可以改，已成立的租約會鎖住成交時的價格、結束日和硬體。下架只是不再接受新租約。監控裡的 Machine ID 仍是整台機器，不是某一份租約。",
      "A Vast offer can change. A rental contract keeps the price, end date, and hardware from the moment it was accepted. Unlisting only stops new rentals. The monitor’s Machine ID is still the whole machine.",
      "Vast 오퍼는 바꿀 수 있습니다. 이미 성립한 임대 계약은 수락 시점의 가격, 종료일, 하드웨어를 유지합니다. 내리기는 새 임대만 막습니다. 모니터의 Machine ID는 여전히 머신 전체입니다.",
      "Vastのオファーは変更できます。成立したレンタル契約は、成立時の価格、終了日、ハードウェアを保持します。非掲載は新しい契約を止めるだけです。モニターのMachine IDはマシン全体のままです。",
    ),
    summary: text(
      "一台机器可以同时带着几份独立租约，价格和结束日不必相同。改报价只影响之后新成立的租约。页面上的当日合计仍按 Machine ID，不按某一份租约拆开。",
      "一台機器可以同時帶著幾份獨立租約，價格和結束日不必相同。改報價只影響之後新成立的租約。頁面上的當日合計仍按 Machine ID，不按某一份租約拆開。",
      "One machine can hold several independent contracts, with different prices and end dates. Editing the offer affects only later contracts. The day total on the page is still per Machine ID, not split per contract.",
      "한 머신이 가격과 종료일이 다른 독립 계약을 여러 개 가질 수 있습니다. 오퍼 수정은 이후 계약에만 적용됩니다. 페이지의 당일 합계는 여전히 Machine ID 기준이며 계약별로 쪼개지지 않습니다.",
      "1台のマシンが、価格も終了日も異なる独立した契約を同時に持てます。オファーの変更は以後の契約だけに効きます。画面の当日合計は契約ごとではなくMachine ID単位のままです。",
    ),
    comparisonTitle: text(
      "报价动作和已有租约",
      "報價動作和已有租約",
      "Offer actions and existing contracts",
      "오퍼 동작과 기존 계약",
      "オファー操作と既存契約",
    ),
    comparison: table(
      text(
        "你在 Host 侧做的事|对新租约|对已经在跑的租约",
        "你在 Host 側做的事|對新租約|對已經在跑的租約",
        "What you do as host|New rentals|Rentals already running",
        "Host로서 하는 일|새 임대|이미 진행 중인 임대",
        "Hostとして行うこと|新しい契約|すでに動いている契約",
      ),
      [
        text(
          "提高或降低报价|按新价格成交|仍按成交时锁定的价格",
          "提高或降低報價|按新價格成交|仍按成交時鎖定的價格",
          "Raise or lower the offer price|Accepted at the new price|Keep the price locked at acceptance",
          "오퍼 가격을 올리거나 내림|새 가격으로 성립|수락 때 잠긴 가격 유지",
          "オファー価格を上げ下げ|新しい価格で成立|成立時に固定された価格のまま",
        ),
        text(
          "缩短报价结束日|新客户能租的窗口变短|不缩短已有租约的结束日",
          "縮短報價結束日|新客戶能租的窗口變短|不縮短已有租約的結束日",
          "Shorten the offer end date|Shorter window for new clients|Does not shorten an existing rental end date",
          "오퍼 종료일을 당김|새 고객의 임대 창이 짧아짐|기존 임대 종료일은 줄지 않음",
          "オファー終了日を早める|新規の受付期間が短くなる|既存の終了日は縮まない",
        ),
        text(
          "下架这台机器|不再产生新租约|已有租约继续到各自的结束日",
          "下架這台機器|不再產生新租約|已有租約繼續到各自的結束日",
          "Unlist the machine|No new contracts|Existing contracts run to their own end dates",
          "머신을 내림|새 계약 없음|기존 계약은 각자의 종료일까지 유지",
          "マシンを非掲載にする|新しい契約はできない|既存契約はそれぞれの終了日まで続く",
        ),
        text(
          "延长报价且价格不高于原价|新客户可以租更久|官方说明可用此方式延长当前租约",
          "延長報價且價格不高於原價|新客戶可以租更久|官方說明可用此方式延長當前租約",
          "Extend the offer at the same or lower price|New clients can rent longer|Vast documents this as the way to extend current contracts",
          "가격을 올리지 않고 오퍼를 연장|새 고객은 더 길게 빌릴 수 있음|Vast 문서는 이를 현재 계약 연장 방법으로 적음",
          "価格を上げずにオファーを延ばす|新規はより長く借りられる|Vastの説明では現契約の延長方法",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "改完价格，正在租的客户会马上按新价计费吗？",
          "改完價格，正在租的客戶會馬上按新價計費嗎？",
          "Does a price change bill current clients at the new rate immediately?",
          "가격을 바꾸면 진행 중인 고객도 바로 새 요금인가요?",
          "価格を変えると、進行中の顧客もすぐに新料金になりますか？",
        ),
        text(
          "不会。托管概览写明：租约在客户接受报价时锁定价、结束日和硬件，事后改报价、下架都不能改写已经成立的租约。新价格只给之后成交的租约。",
          "不會。託管概覽寫明：租約在客戶接受報價時鎖定價、結束日和硬體，事後改報價、下架都不能改寫已經成立的租約。新價格只給之後成交的租約。",
          "No. The hosting overview says a contract locks price, end date, and hardware when the client accepts the offer. Later edits and unlisting do not rewrite that contract. The new price applies only to contracts accepted afterward.",
          "아닙니다. 호스팅 개요는 고객이 오퍼를 수락할 때 가격, 종료일, 하드웨어가 잠긴다고 적습니다. 이후 수정과 내리기는 그 계약을 다시 쓰지 않습니다. 새 가격은 그 다음 계약에만 적용됩니다.",
          "なりません。ホスティング概要は、顧客がオファーを受けた時点で価格、終了日、ハードウェアが固定されると書いています。その後の変更や非掲載は、成立済みの契約を書き換えません。新しい価格は、その後に成立した契約だけです。",
        ),
      ],
      [
        text(
          "机器下架后，还要继续开着吗？",
          "機器下架後，還要繼續開著嗎？",
          "After I unlist the machine, do I still have to keep it online?",
          "머신을 내린 뒤에도 켜 두어야 하나요?",
          "非掲載にしたあとも、マシンは起動したままですか？",
        ),
        text(
          "有未结束的租约就要继续。下架只阻止新租约。你必须把机器维持到这份机器上最晚的那一个租约结束日。监控不会把下架显示成收入归零。",
          "有未結束的租約就要繼續。下架只阻止新租約。你必須把機器維持到這份機器上最晚的那一個租約結束日。監控不會把下架顯示成收入歸零。",
          "Yes, while any contract is still open. Unlisting blocks new contracts only. Keep the machine available through the latest rental end date on that machine. The monitor does not turn an unlist action into a zero income figure.",
          "끝나지 않은 계약이 있으면 계속 켜 둡니다. 내리기는 새 계약만 막습니다. 그 머신에서 가장 늦은 임대 종료일까지 유지해야 합니다. 모니터는 내리기를 수입 0으로 바꾸지 않습니다.",
          "未了の契約があるあいだは続けます。非掲載は新しい契約を止めるだけです。そのマシンで最も遅いレンタル終了日まで稼働を保ちます。モニターは非掲載を収入0にはしません。",
        ),
      ],
      [
        text(
          "监控能按每一份租约分开显示收入吗？",
          "監控能按每一份租約分開顯示收入嗎？",
          "Can the monitor split income by each rental contract?",
          "모니터가 임대 계약마다 수입을 나눠 보여주나요?",
          "モニターはレンタル契約ごとに収入を分けて表示しますか？",
        ),
        text(
          "不能。当日合计按 Machine ID 汇总四项，不按客户、不按 Instance ID 拆开。要看某一份租约的锁定价格和结束日，打开 Host 机器页上的租约，而不是只看监控合计。",
          "不能。當日合計按 Machine ID 匯總四項，不按客戶、不按 Instance ID 拆開。要看某一份租約的鎖定價格和結束日，打開 Host 機器頁上的租約，而不是只看監控合計。",
          "No. The day total sums the four lines for the Machine ID. It is not split by client or Instance ID. For one contract’s locked price and end date, open that rental on the Host machines page instead of reading only the monitor total.",
          "나눌 수 없습니다. 당일 합계는 Machine ID의 네 항목이며 고객이나 Instance ID별로 쪼개지지 않습니다. 한 계약의 잠긴 가격과 종료일은 Host 기기 페이지의 해당 임대에서 보고, 모니터 합계만 보지 않습니다.",
          "分けません。当日合計はMachine IDの4行であり、顧客やInstance IDごとではありません。一つの契約の固定価格と終了日は、Hostマシンページのそのレンタルで確認します。モニターの合計だけでは分かりません。",
        ),
      ],
    ]),
    decision: {
      title: text(
        "先分清报价和已锁定的租约",
        "先分清報價和已鎖定的租約",
        "Separate the offer from locked contracts",
        "오퍼와 잠긴 계약을 먼저 구분",
        "オファーと固定済み契約を分ける",
      ),
      action: text(
        "改价或下架后，用 Host 机器页核对每份租约自己的价格和结束日。监控合计仍是整台机器的当日四项。",
        "改價或下架後，用 Host 機器頁核對每份租約自己的價格和結束日。監控合計仍是整台機器的當日四項。",
        "After a price change or unlist, check each contract’s own price and end date on the Host machines page. The monitor total is still the machine’s four lines for the day.",
        "가격 변경이나 내리기 후, Host 기기 페이지에서 계약마다 가격과 종료일을 확인합니다. 모니터 합계는 여전히 그날 머신 전체의 네 항목입니다.",
        "価格変更や非掲載のあと、Hostマシンページで契約ごとの価格と終了日を確認します。モニターの合計は、その日のマシン全体の4行のままです。",
      ),
    },
    body: paras(
      [
        "改价不会改写已经成立的租约。客户接受报价的那一刻，价格、结束日和硬件规格锁进租约；之后改报价或下架，只影响还没成交的新租约。一台机器上可以同时有几份租约，价格和结束日各不相同。",
        "## 两个对象分别是什么",
        "报价是你在 Host 机器页或 `list machine` 上挂出的条件：GPU、网络、存储价格，可中断的最低出价，最小 GPU 分组，以及报价结束日。不设结束日时，官方说明报价会一直开放。",
        "租约是客户租下实例时从当时的报价生成的。界面里的 client end date 就是这份租约的结束日。机器上最晚的那个结束日，是你必须继续提供服务到的日期。",
        "## 对不上时先看什么",
        "- 先看客户是在改价之前还是之后租下的。之前的租约仍用旧价。",
        "- 再看这份租约自己的结束日，不要用你后来改过的报价结束日代替。",
        "- 最后才看 " + tool.zh + " 的当日合计。它按 Machine ID 加总，不会列出每一份租约。",
        "## 接下来怎么处理",
        "- 只想停止新客户：下架。已有租约继续，机器要开到最晚结束日。",
        "- 想延长正在跑的租约：官方写的做法是把报价结束日改晚，并且价格不高于当前租约。已经涨过价就不能用涨价后的报价去延长旧租约。",
        "- 想核对入账：回到 [当日四项](/learn/" +
          slugs.monitor +
          ")。想看卡被怎样切分，看 [占用和报价](/learn/" +
          slugs.offers +
          ")。",
        "## 举例",
        "沿托管概览里的结构举例，不是一笔实测入账：同一台机器上，早先的租约锁在当时的 GPU 小时价，后来提高报价只作用于新租约。两份租约的结束日不同。你要服务到较晚的那一天。监控若给出当日合计，那是整台机器的四项之和，不是其中一份租约的账单。",
        "## 界限",
        "监控不读取每份租约的锁定价格，也不根据下架把收入写成 0。延长租约是否成功，以 Host 机器页上更新后的结束日为准。公开站的按秒计费描述的是客户侧计费方式，不能拿来推算某一份 Host 租约的结算。",
      ],
      [
        "改價不會改寫已經成立的租約。客戶接受報價的那一刻，價格、結束日和硬體規格鎖進租約；之後改報價或下架，只影響還沒成交的新租約。一台機器上可以同時有幾份租約，價格和結束日各不相同。",
        "## 兩個對象分別是什麼",
        "報價是你在 Host 機器頁或 `list machine` 上掛出的條件：GPU、網路、儲存價格，可中斷的最低出價，最小 GPU 分組，以及報價結束日。不設結束日時，官方說明報價會一直開放。",
        "租約是客戶租下實例時從當時的報價生成的。介面裡的 client end date 就是這份租約的結束日。機器上最晚的那個結束日，是你必須繼續提供服務到的日期。",
        "## 對不上時先看什麼",
        "- 先看客戶是在改價之前還是之後租下的。之前的租約仍用舊價。",
        "- 再看這份租約自己的結束日，不要用你後來改過的報價結束日代替。",
        "- 最後才看 " + tool["zh-TW"] + " 的當日合計。它按 Machine ID 加總，不會列出每一份租約。",
        "## 接下來怎麼處理",
        "- 只想停止新客戶：下架。已有租約繼續，機器要開到最晚結束日。",
        "- 想延長正在跑的租約：官方寫的做法是把報價結束日改晚，並且價格不高於當前租約。已經漲過價就不能用漲價後的報價去延長舊租約。",
        "- 想核對入帳：回到 [當日四項](/learn/" +
          slugs.monitor +
          ")。想看卡被怎樣切分，看 [占用和報價](/learn/" +
          slugs.offers +
          ")。",
        "## 舉例",
        "沿託管概覽裡的結構舉例，不是一筆實測入帳：同一台機器上，早先的租約鎖在當時的 GPU 小時價，後來提高報價只作用於新租約。兩份租約的結束日不同。你要服務到較晚的那一天。監控若給出當日合計，那是整台機器的四項之和，不是其中一份租約的帳單。",
        "## 界限",
        "監控不讀取每份租約的鎖定價格，也不根據下架把收入寫成 0。延長租約是否成功，以 Host 機器頁上更新後的結束日為準。公開站的按秒計費描述的是客戶側計費方式，不能拿來推算某一份 Host 租約的結算。",
      ],
      [
        "A price change does not rewrite a rental that already exists. When a client accepts the offer, price, end date, and hardware lock into that contract. Later edits and unlisting affect only contracts that have not been accepted yet. One machine can carry several contracts at different prices and end dates.",
        "## What each object is",
        "The offer is what you publish on the Host machines page or with `list machine`: GPU, internet, and storage prices, the interruptible minimum bid, the minimum GPU grouping, and the offer end date. The hosting overview says that an offer with no end date stays open.",
        "A rental contract is created from the offer at the moment a client rents an instance. The client end date in the UI is that contract’s end date. The latest end date on the machine is how long you must keep the service available.",
        "## What to inspect when the numbers disagree",
        "- See whether the client rented before or after the price change. Earlier contracts keep the old price.",
        "- Read that contract’s own end date. Do not replace it with the offer end date you edited later.",
        "- Only then read the day total on the " +
          tool.en +
          ". It is summed by Machine ID and does not list each contract.",
        "## What to do next",
        "- To stop new clients only: unlist. Existing contracts continue, and the machine stays up through the latest end date.",
        "- To extend contracts that are already running: Vast’s documented method is a later offer end date at the same or a lower price. After you have raised the price, that higher offer cannot extend the old contracts.",
        "- To check money already reported: return to [the four lines](/learn/" +
          slugs.monitor +
          "). For how GPUs are sliced, read [occupancy and offers](/learn/" +
          slugs.offers +
          ").",
        "## Illustrative case",
        "The shape comes from the hosting overview, and it is not a measured payout: on one machine, an earlier contract stays at the GPU hourly price locked when it started, and a later higher offer applies only to a new contract. The two end dates differ. You keep the machine available through the later day. If the monitor shows a day total, that figure is the four lines for the whole machine, not the invoice for one contract.",
        "## Limits",
        "The monitor does not read each contract’s locked price, and it does not write income as zero because you unlisted the machine. Whether an extension worked is the updated end date on the Host machines page. Per-second billing on the public site describes the client side. It does not compute one host contract’s settlement.",
      ],
      [
        "가격을 바꿔도 이미 성립한 임대는 다시 쓰이지 않습니다. 고객이 오퍼를 수락하는 순간 가격, 종료일, 하드웨어가 그 계약에 잠깁니다. 이후의 수정과 내리기는 아직 수락되지 않은 계약에만 적용됩니다. 한 머신이 가격과 종료일이 다른 계약을 동시에 가질 수 있습니다.",
        "## 두 대상이 각각 무엇인지",
        "오퍼는 Host 기기 페이지나 `list machine`에 걸어 둔 조건입니다. GPU, 네트워크, 스토리지 가격, 중단 가능 최저 입찰, 최소 GPU 묶음, 오퍼 종료일입니다. 종료일을 비우면 호스팅 개요는 오퍼가 계속 열려 있다고 적습니다.",
        "임대 계약은 고객이 인스턴스를 빌리는 순간 그때의 오퍼에서 만들어집니다. 화면의 client end date가 그 계약의 종료일입니다. 머신에서 가장 늦은 종료일까지 서비스를 유지해야 합니다.",
        "## 숫자가 다를 때 볼 것",
        "- 고객이 가격 변경 전후에 빌렸는지 봅니다. 이전 계약은 옛 가격을 유지합니다.",
        "- 그 계약 자신의 종료일을 읽습니다. 나중에 고친 오퍼 종료일로 바꾸지 않습니다.",
        "- 그 다음에 " +
          tool.ko +
          "의 당일 합계를 봅니다. Machine ID로 합쳐지며 계약 목록은 나오지 않습니다.",
        "## 다음에 할 일",
        "- 새 고객만 막으려면 내립니다. 기존 계약은 계속되고, 머신은 가장 늦은 종료일까지 켜 둡니다.",
        "- 진행 중 계약을 늘리려면 Vast 문서의 방법은 가격을 올리지 않은 채 오퍼 종료일을 늦추는 것입니다. 이미 가격을 올렸다면 그 높은 오퍼로 옛 계약을 연장할 수 없습니다.",
        "- 이미 보고된 금액은 [네 항목](/learn/" +
          slugs.monitor +
          ")으로 돌아갑니다. GPU가 어떻게 나뉘는지는 [점유와 오퍼](/learn/" +
          slugs.offers +
          ")를 봅니다.",
        "## 예시",
        "호스팅 개요의 구조로 든 예시이며 측정된 지급이 아닙니다. 같은 머신에서 먼저 성립한 계약은 시작 시점의 GPU 시간당 가격에 남고, 나중에 올린 오퍼는 새 계약에만 적용됩니다. 종료일이 다릅니다. 더 늦은 날까지 머신을 유지합니다. 모니터에 당일 합계가 있으면 그것은 머신 전체의 네 항목이지, 계약 하나의 청구서가 아닙니다.",
        "## 한계",
        "모니터는 계약마다 잠긴 가격을 읽지 않으며, 내렸다고 수입을 0으로 쓰지도 않습니다. 연장이 됐는지는 Host 기기 페이지에 갱신된 종료일로 확인합니다. 공개 사이트의 초당 과금은 고객 측 설명이며, Host 계약 하나의 정산을 계산하지 않습니다.",
      ],
      [
        "価格を変えても、すでに成立したレンタルは書き換わりません。顧客がオファーを受けた瞬間に、価格、終了日、ハードウェアがその契約へ固定されます。その後の変更や非掲載は、まだ受けられていない契約にだけ効きます。1台のマシンが、価格も終了日も異なる契約を同時に持てます。",
        "## 二つの対象",
        "オファーは Host マシンページか `list machine` で出している条件です。GPU、ネットワーク、ストレージの価格、中断可能の最低入札、最小 GPU のまとまり、オファー終了日です。終了日を空にすると、ホスティング概要はオファーが開き続けると書いています。",
        "レンタル契約は、顧客がインスタンスを借りた瞬間のオファーから作られます。画面の client end date がその契約の終了日です。マシン上で最も遅い終了日までサービスを維持します。",
        "## 数字が食い違うとき",
        "- 顧客が値上げの前に借りたか、後に借りたかを見ます。前の契約は旧価格のままです。",
        "- その契約自身の終了日を読みます。あとから直したオファー終了日で置き換えません。",
        "- そのあとで " +
          tool.ja +
          " の当日合計を見ます。Machine ID で合計され、契約の一覧は出ません。",
        "## 次にすること",
        "- 新しい顧客だけ止めるなら非掲載にします。既存契約は続き、マシンは最も遅い終了日まで稼働させます。",
        "- 進行中の契約を延ばす公式の方法は、価格を上げずにオファー終了日を遅くすることです。すでに値上げしたオファーでは、古い契約を延長できません。",
        "- すでに報告された金額は [4行](/learn/" +
          slugs.monitor +
          ") に戻ります。GPUの分割は [占有とオファー](/learn/" +
          slugs.offers +
          ") を見ます。",
        "## 例示",
        "ホスティング概要の形に沿った例示であり、測定した入金ではありません。同じマシンで、先に成立した契約は開始時のGPU時間単価のまま、あとから上げたオファーは新しい契約にだけ適用されます。終了日は異なります。遅い方の日までマシンを維持します。モニターに当日合計が出ても、それはマシン全体の4行であり、一つの契約の請求ではありません。",
        "## 限界",
        "モニターは契約ごとの固定価格を読まず、非掲載を理由に収入を0にもしません。延長できたかは、Hostマシンページで更新された終了日で確認します。公開サイトの秒課金は顧客側の説明であり、Hostの一つの契約の精算を計算しません。",
      ],
    ),
  },
  {
    slug: slugs.offers,
    published: "2026-10-24",
    modified: "2026-10-24",
    project: "vast",
    sources: offerSources,
    related: [slugs.contract, slugs.monitor, slugs.key],
    topic: text(
      "占用与报价",
      "占用與報價",
      "Occupancy and offers",
      "점유와 오퍼",
      "占有とオファー",
    ),
    title: text(
      "Vast.ai 机器上的 GPU 数量，等于已经租出的卡数吗？",
      "Vast.ai 機器上的 GPU 數量，等於已經租出的卡數嗎？",
      "Does a Vast.ai machine’s GPU count equal the number of cards already rented?",
      "Vast.ai 머신의 GPU 수는 이미 빌려 간 카드 수와 같나요?",
      "Vast.aiマシンのGPU数は、すでに貸している枚数と同じですか？",
    ),
    description: text(
      "监控里的 GPU 数量是这台机器登记的卡数，不是当前租出的张数。最小 GPU 分组决定客户能一次租 1、2、4 或整机。公开搜索也只显示部分报价。",
      "監控裡的 GPU 數量是這台機器登記的卡數，不是當前租出的張數。最小 GPU 分組決定客戶能一次租 1、2、4 或整機。公開搜尋也只顯示部分報價。",
      "The GPU count on the monitor is how many cards the machine registered, not how many are rented now. Minimum GPU grouping decides whether a client can take 1, 2, 4, or the whole box. Public search shows only part of the catalog.",
      "모니터의 GPU 수는 머신에 등록된 카드 수이며 지금 빌려 간 수가 아닙니다. 최소 GPU 묶음이 1, 2, 4장 또는 전체를 빌릴 수 있는지를 정합니다. 공개 검색은 목록의 일부만 보여 줍니다.",
      "モニターのGPU数はマシンに登録された枚数であり、今貸している枚数ではありません。最小GPUのまとまりが、1枚、2枚、4枚、または全部を借りられるかを決めます。公開検索はカタログの一部だけを出します。",
    ),
    summary: text(
      "登记卡数、当前可租的报价、已经租出的卡，是三件不同的事。当日收入有数字，也不能反推每一张卡都在租用。",
      "登記卡數、當前可租的報價、已經租出的卡，是三件不同的事。當日收入有數字，也不能反推每一張卡都在租用。",
      "Registered cards, offers that can still be rented, and cards already rented are three different facts. A day-income figure does not prove every card is rented.",
      "등록 카드 수, 아직 빌릴 수 있는 오퍼, 이미 빌려 간 카드는 서로 다릅니다. 당일 수입이 있어도 모든 카드가 임대 중이라고 거꾸로 말할 수 없습니다.",
      "登録枚数、まだ借りられるオファー、すでに貸したカードは別の事実です。当日収入があっても、すべてのカードが貸出中とは限りません。",
    ),
    comparisonTitle: text(
      "三种容易混在一起的数量",
      "三種容易混在一起的數量",
      "Three counts that get mixed together",
      "섞이기 쉬운 세 가지 수량",
      "混ざりやすい三つの数",
    ),
    comparison: table(
      text(
        "你看到的|它实际数的是|监控会不会给出",
        "你看到的|它實際數的是|監控會不會給出",
        "What you see|What it actually counts|Shown on the monitor",
        "보이는 것|실제로 세는 것|모니터에 나오나",
        "見ているもの|実際に数えているもの|モニターに出るか",
      ),
      [
        text(
          "GPU 数量|机器登记了几张卡|会，来自这台机器的登记资料",
          "GPU 數量|機器登記了幾張卡|會，來自這台機器的登記資料",
          "GPU count|Cards registered on the machine|Yes, from that machine record",
          "GPU 수|머신에 등록된 카드 수|나옴. 그 머신 기록",
          "GPU数|マシンに登録された枚数|出る。そのマシン記録から",
        ),
        text(
          "最小 GPU|客户一次最少要租的分组，1 或 2 的幂|不会",
          "最小 GPU|客戶一次最少要租的分組，1 或 2 的冪|不會",
          "Min GPU|Smallest group a client may rent, 1 or a power of 2|No",
          "최소 GPU|고객이 한 번에 빌리는 최소 묶음, 1 또는 2의 거듭제곱|나오지 않음",
          "最小GPU|顧客が一度に借りる最小のまとまり。1または2の累乗|出ない",
        ),
        text(
          "已租出的卡|正在履约的租约各占了几张|不会",
          "已租出的卡|正在履約的租約各佔了幾張|不會",
          "Cards already rented|GPUs held by open contracts|No",
          "이미 빌려 간 카드|진행 중 계약이 잡고 있는 GPU|나오지 않음",
          "貸出中のカード|進行中の契約が押さえているGPU|出ない",
        ),
        text(
          "公开搜索里的一条报价|目录里被抽到展示的一条，不一定是你的机器|不会用公开搜索代替机器页",
          "公開搜尋裡的一條報價|目錄裡被抽到展示的一條，不一定是你的機器|不會用公開搜尋代替機器頁",
          "One row in public search|One listing the catalog chose to show, not necessarily yours|Public search is not a substitute for the machines page",
          "공개 검색의 한 줄|목록이 골라 보여 준 한 오퍼. 내 머신이 아닐 수 있음|공개 검색으로 기기 페이지를 대신하지 않음",
          "公開検索の1行|カタログが選んで出した1件。自分のマシンとは限らない|公開検索をマシンページの代わりにしない",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "8 张卡、最小 GPU 设为 2，客户能租 1 张吗？",
          "8 張卡、最小 GPU 設為 2，客戶能租 1 張嗎？",
          "With 8 cards and min GPU set to 2, can a client rent a single card?",
          "카드 8장에 최소 GPU를 2로 두면 고객이 1장만 빌릴 수 있나요?",
          "8枚で最小GPUを2にしたとき、顧客は1枚だけ借りられますか？",
        ),
        text(
          "按托管概览的说明，不能。最小 GPU 为 2 时，客户只能按 2、4 或 8 张来租。设为 1 时，才可以 1、2、4 或 8。监控里的 GPU 数量仍然是 8，不会改成当前允许的分组。",
          "按託管概覽的說明，不能。最小 GPU 為 2 時，客戶只能按 2、4 或 8 張來租。設為 1 時，才可以 1、2、4 或 8。監控裡的 GPU 數量仍然是 8，不會改成當前允許的分組。",
          "Not according to the hosting overview. With min GPU at 2, clients rent 2, 4, or 8. Set it to 1 if 1, 2, 4, or 8 should all be allowed. The monitor still shows 8 registered cards. It does not rewrite that count into the allowed group sizes.",
          "호스팅 개요대로라면 안 됩니다. 최소 GPU가 2이면 고객은 2, 4, 8장만 빌립니다. 1, 2, 4, 8을 모두 허용하려면 1로 둡니다. 모니터의 GPU 수는 여전히 등록된 8이며, 허용 묶음으로 바뀌지 않습니다.",
          "ホスティング概要のとおり、できません。最小GPUが2なら、顧客は2、4、8枚です。1、2、4、8を許すなら1にします。モニターのGPU数は登録された8のままで、許されるまとまりには書き換わりません。",
        ),
      ],
      [
        text(
          "在网站搜索里找不到自己的机器，就是没挂出吗？",
          "在網站搜尋裡找不到自己的機器，就是沒掛出嗎？",
          "If my machine is missing from website search, is it unlisted?",
          "웹사이트 검색에 내 머신이 없으면 내려진 것인가요?",
          "サイト検索に自分のマシンが無いと、非掲載ですか？",
        ),
        text(
          "不一定。官方说明站内搜索只展示目录中的一小部分，一万条以上的报价里通常找不到指定的一台。要用 CLI：`vastai search offers 'machine_id=你的编号 verified=any'`。有结果才表示这条报价能被搜到。",
          "不一定。官方說明站內搜尋只展示目錄中的一小部分，一萬條以上的報價裡通常找不到指定的一台。要用 CLI：`vastai search offers 'machine_id=你的編號 verified=any'`。有結果才表示這條報價能被搜到。",
          "Not necessarily. Vast says console search shows only a small subset of a catalog of more than 10,000 listings, so a specific machine usually will not appear. Use the CLI: `vastai search offers 'machine_id=YOUR_ID verified=any'`. A result means that listing is searchable.",
          "꼭 그렇지는 않습니다. Vast는 콘솔 검색이 1만 개가 넘는 목록 중 일부만 보여 주므로, 특정 머신은 보통 나오지 않는다고 적습니다. CLI를 씁니다. `vastai search offers 'machine_id=번호 verified=any'`. 결과가 있으면 그 오퍼를 검색할 수 있다는 뜻입니다.",
          "必ずしもそうではありません。Vastは、コンソール検索が1万件超の一覧の一部しか出さないので、特定のマシンは通常見つからないと書いています。CLIを使います。`vastai search offers 'machine_id=番号 verified=any'`。結果があれば、そのオファーは検索できます。",
        ),
      ],
      [
        text(
          "当日收入大于零，能不能说明卡都租满了？",
          "當日收入大於零，能不能說明卡都租滿了？",
          "If today’s income is above zero, are all cards rented?",
          "당일 수입이 0보다 크면 카드가 모두 임대 중인가요?",
          "当日収入が0より大きいと、カードは全部貸出中ですか？",
        ),
        text(
          "不能。收入是四项合计，可能只来自一部分 GPU、存储或带宽。收入未知也不等于空闲。租出了几张，要看机器页上的租约，而不是看合计金额。",
          "不能。收入是四項合計，可能只來自一部分 GPU、儲存或頻寬。收入未知也不等於空閒。租出了幾張，要看機器頁上的租約，而不是看合計金額。",
          "No. Income is the four-line total. It can come from only some GPUs, from storage, or from bandwidth. Unknown income is not the same as idle. How many cards are rented is on the machine’s contracts, not in the total.",
          "아닙니다. 수입은 네 항목의 합이며, 일부 GPU나 스토리지, 대역폭에서만 올 수 있습니다. 수입을 알 수 없음은 유휴와 같지 않습니다. 몇 장이 나갔는지는 합계가 아니라 머신의 계약에서 봅니다.",
          "いいえ。収入は4行の合計で、一部のGPU、ストレージ、帯域だけから来ることもあります。収入が不明なことも空きではありません。何枚貸しているかは合計ではなく、マシン上の契約で見ます。",
        ),
      ],
    ]),
    decision: {
      title: text(
        "用租约看占用，用登记资料看卡数",
        "用租約看占用，用登記資料看卡數",
        "Read occupancy from contracts, card count from the machine record",
        "점유는 계약에서, 카드 수는 등록 기록에서",
        "占有は契約、枚数は登録記録",
      ),
      action: text(
        "GPU 数量只说明登记了几张卡。要看租出几张，打开机器上的租约；要确认报价还在，用带 machine_id 的 CLI 搜索。",
        "GPU 數量只說明登記了幾張卡。要看租出幾張，打開機器上的租約；要確認報價還在，用帶 machine_id 的 CLI 搜尋。",
        "GPU count is only how many cards are registered. Open the machine’s contracts for how many are rented, and use a machine_id CLI search to see if the offer is still listed.",
        "GPU 수는 등록된 카드 수입니다. 몇 장이 나갔는지는 머신의 계약에서 보고, 오퍼가 아직 있는지 CLI의 machine_id 검색으로 확인합니다.",
        "GPU数は登録枚数だけです。何枚貸しているかはマシンの契約を開き、オファーが残っているかは machine_id のCLI検索で確認します。",
      ),
    },
    body: paras(
      [
        "监控上的 GPU 数量是这台机器登记了几张卡，不是此刻租出去几张。客户能一次拿走多少，由报价上的最小 GPU 决定；已经拿走多少，写在各份租约里。这三件事对不上时，不要用当日收入去倒推占用。",
        "## 报价还决定什么",
        "托管概览说明，一台多卡机器在允许切片时，多个客户可以各自形成独立租约。按需价格优先，满足按需会停掉可中断实例。可中断价是最低出价，客户用竞价，当前最高出价的实例在跑，其余暂停。",
        "预留折扣由 Host 自己设定，可以设为 0 退出。存储卷报价和 GPU 报价共用磁盘池，只有真正租出的空间才从 GPU 报价的可用磁盘里扣掉。这些都不会出现在监控的 GPU 数量里。",
        "## 先核对哪一个数",
        "- 认机器：看 " + tool.zh + " 里的 GPU 型号和登记数量，对照 Host 机器页。",
        "- 认还能怎么租：看最小 GPU。8 卡且最小为 2 时，分组是 2、4、8，不是任意张数。",
        "- 认有没有挂出：不要依赖网站搜索。用 `vastai search offers 'machine_id=编号 verified=any'`。",
        "## 接下来怎么处理",
        "- 想知道租出几张：打开这台机器的租约列表，逐份看占用的 GPU，再对照 [租约与报价](/learn/" +
          slugs.contract +
          ")。",
        "- 想知道今天入账：看 [四项合计](/learn/" + slugs.monitor + ")。有收入只说明报告里有金额。",
        "- 网站搜索空白：先跑上面的 CLI。没有结果，再检查是否下架、报价结束日，或机器报错导致未验证。",
        "## 举例",
        "举例，不是某台机器的实测占用：登记 4 张卡，最小 GPU 为 1。一份租约拿走 2 张，另一份还没人租。监控仍显示 4。若当天四项合计是 1.65 美元，也不能写成 4 张全在出租。",
        "## 界限",
        "监控不读取公开搜索，也不显示已租 GPU、最小 GPU、预留折扣或磁盘剩余。Vast 首页上的 GPU 总量和机房数量是市场宣传，不是你这台机器的占用。验证是否通过，以机器页上的错误和官方验证说明为准，不能从 GPU 数量推断。",
      ],
      [
        "監控上的 GPU 數量是這台機器登記了幾張卡，不是此刻租出去幾張。客戶能一次拿走多少，由報價上的最小 GPU 決定；已經拿走多少，寫在各份租約裡。這三件事對不上時，不要用當日收入去倒推占用。",
        "## 報價還決定什麼",
        "託管概覽說明，一台多卡機器在允許切片時，多個客戶可以各自形成獨立租約。按需價格優先，滿足按需會停掉可中斷實例。可中斷價是最低出價，客戶用競價，當前最高出價的實例在跑，其餘暫停。",
        "預留折扣由 Host 自己設定，可以設為 0 退出。儲存卷報價和 GPU 報價共用磁碟池，只有真正租出的空間才從 GPU 報價的可用磁碟裡扣掉。這些都不會出現在監控的 GPU 數量裡。",
        "## 先核對哪一個數",
        "- 認機器：看 " + tool["zh-TW"] + " 裡的 GPU 型號和登記數量，對照 Host 機器頁。",
        "- 認還能怎麼租：看最小 GPU。8 卡且最小為 2 時，分組是 2、4、8，不是任意張數。",
        "- 認有沒有掛出：不要依賴網站搜尋。用 `vastai search offers 'machine_id=編號 verified=any'`。",
        "## 接下來怎麼處理",
        "- 想知道租出幾張：打開這台機器的租約列表，逐份看占用的 GPU，再對照 [租約與報價](/learn/" +
          slugs.contract +
          ")。",
        "- 想知道今天入帳：看 [四項合計](/learn/" + slugs.monitor + ")。有收入只說明報告裡有金額。",
        "- 網站搜尋空白：先跑上面的 CLI。沒有結果，再檢查是否下架、報價結束日，或機器報錯導致未驗證。",
        "## 舉例",
        "舉例，不是某台機器的實測占用：登記 4 張卡，最小 GPU 為 1。一份租約拿走 2 張，另一份還沒人租。監控仍顯示 4。若當天四項合計是 1.65 美元，也不能寫成 4 張全在出租。",
        "## 界限",
        "監控不讀取公開搜尋，也不顯示已租 GPU、最小 GPU、預留折扣或磁碟剩餘。Vast 首頁上的 GPU 總量和機房數量是市場宣傳，不是你這台機器的占用。驗證是否通過，以機器頁上的錯誤和官方驗證說明為準，不能從 GPU 數量推斷。",
      ],
      [
        "The GPU count on the monitor is how many cards this machine registered, not how many are rented right now. How many a client may take at once is the offer’s min GPU. How many are already taken is written on each contract. When those three disagree, do not reverse the day’s income into an occupancy rate.",
        "## What else the offer decides",
        "The hosting overview says a multi-GPU machine that allows slicing can have several clients, each with an independent contract. On-demand price has priority and, when filled, stops interruptible instances. The interruptible price is a minimum bid: the highest bid runs and the others pause.",
        "The reserved discount is set by the host and can be 0 to opt out. Volume offers share the disk pool with GPU offers. Only space that is actually rented is removed from disk still offered with GPUs. None of that is the GPU count on the monitor.",
        "## Which number to check",
        "- Identify the machine: match GPU name and registered count on the " +
          tool.en +
          " with the Host machines page.",
        "- See the allowed slice: min GPU. Eight cards with a minimum of 2 means groups of 2, 4, or 8, not any count.",
        "- See whether it is listed: do not rely on website search. Run `vastai search offers 'machine_id=YOUR_ID verified=any'`.",
        "## What to do next",
        "- To learn how many cards are rented: open that machine’s contracts and count GPUs on each one, then read [contracts and offers](/learn/" +
          slugs.contract +
          ").",
        "- To learn today’s money: read [the four-line total](/learn/" +
          slugs.monitor +
          "). Income only means the report has amounts.",
        "- If website search is empty: run the CLI above. If that is also empty, then check unlist, the offer end date, or an error that leaves the machine unverified.",
        "## Illustrative case",
        "Illustrative, not a measured occupancy: 4 cards registered, min GPU 1. One contract holds 2 cards and the rest of the offer is unrented. The monitor still shows 4. A four-line total of 1.65 USD that day still does not mean all 4 cards are rented.",
        "## Limits",
        "The monitor does not call public search, and it does not show rented GPUs, min GPU, reserved discount, or free disk. GPU totals and data-center counts on the Vast homepage are marketplace copy, not this machine’s occupancy. Verification is the error state on the machines page and Vast’s verification notes, not something you infer from the GPU count.",
      ],
      [
        "모니터의 GPU 수는 이 머신에 등록된 카드 수이며, 지금 빌려 간 수가 아닙니다. 고객이 한 번에 가져갈 수 있는 양은 오퍼의 최소 GPU입니다. 이미 가져간 양은 각 계약에 적혀 있습니다. 이 셋이 다르면 당일 수입으로 점유율을 거꾸로 계산하지 않습니다.",
        "## 오퍼가 또 정하는 것",
        "호스팅 개요는 분할을 허용한 다중 GPU 머신에서 여러 고객이 각자 독립 계약을 가질 수 있다고 적습니다. 온디맨드 가격이 우선이며, 채워지면 중단 가능 인스턴스를 멈춥니다. 중단 가능 가격은 최저 입찰입니다. 가장 높은 입찰이 실행되고 나머지는 일시정지됩니다.",
        "예약 할인은 Host가 정하며 0으로 두어 끌 수 있습니다. 볼륨 오퍼는 GPU 오퍼와 디스크 풀을 같이 씁니다. 실제로 빌린 공간만 GPU 오퍼의 남은 디스크에서 빠집니다. 이것은 모니터의 GPU 수가 아닙니다.",
        "## 어떤 숫자를 볼지",
        "- 머신을 확인: " + tool.ko + "의 GPU 이름과 등록 수를 Host 기기 페이지와 맞춥니다.",
        "- 허용 분할: 최소 GPU. 8장에 최소 2이면 묶음은 2, 4, 8이며 임의 수가 아닙니다.",
        "- 오퍼가 올라가 있는지: 웹 검색에 의존하지 않습니다. `vastai search offers 'machine_id=번호 verified=any'` 를 실행합니다.",
        "## 다음에 할 일",
        "- 몇 장이 나갔는지: 그 머신의 계약을 열고 GPU를 계약마다 센 뒤 [계약과 오퍼](/learn/" +
          slugs.contract +
          ")를 봅니다.",
        "- 오늘 금액: [네 항목 합계](/learn/" +
          slugs.monitor +
          ")를 봅니다. 수입은 보고에 금액이 있다는 뜻입니다.",
        "- 웹 검색이 비어 있으면: 위 CLI를 먼저 실행합니다. 그것도 비면 내리기, 오퍼 종료일, 또는 미검증으로 남기는 오류를 확인합니다.",
        "## 예시",
        "예시이며 측정된 점유가 아닙니다. 등록 4장, 최소 GPU 1. 계약 하나가 2장을 잡고 나머지 오퍼는 비어 있습니다. 모니터는 여전히 4를 보여 줍니다. 그날 네 항목 합계가 1.65 USD여도 4장이 모두 임대 중이라는 뜻은 아닙니다.",
        "## 한계",
        "모니터는 공개 검색을 부르지 않으며, 빌려 간 GPU, 최소 GPU, 예약 할인, 남은 디스크를 보여 주지 않습니다. Vast 첫 화면의 GPU 총량과 데이터센터 수는 시장 문구이며 이 머신의 점유가 아닙니다. 검증은 기기 페이지의 오류와 Vast의 검증 설명으로 판단하며, GPU 수로 추론하지 않습니다.",
      ],
      [
        "モニターのGPU数は、このマシンに登録された枚数であり、今貸している枚数ではありません。顧客が一度に取れる数はオファーの最小GPUです。すでに取られている数は各契約に書かれています。この三つが食い違うとき、当日収入から占有率を逆算しません。",
        "## オファーがほかに決めること",
        "ホスティング概要は、分割を許した複数GPUマシンでは、複数の顧客がそれぞれ独立した契約を持てると書いています。オンデマンド価格が優先で、埋まると中断可能インスタンスを止めます。中断可能価格は最低入札です。最高入札が動き、ほかは一時停止します。",
        "予約割引はHostが決め、0にして外せます。ボリュームオファーはGPUオファーとディスクを共有します。実際に借りられた容量だけが、GPUオファー側の残りディスクから引かれます。これらはモニターのGPU数ではありません。",
        "## どの数を見るか",
        "- マシンの確認: " + tool.ja + " のGPU名と登録枚数をHostマシンページと合わせます。",
        "- 許される分割: 最小GPU。8枚で最小2なら、まとまりは2、4、8であり、任意の枚数ではありません。",
        "- 掲載されているか: サイト検索に頼りません。`vastai search offers 'machine_id=番号 verified=any'` を実行します。",
        "## 次にすること",
        "- 何枚貸しているか: そのマシンの契約を開き、契約ごとにGPUを数えてから [契約とオファー](/learn/" +
          slugs.contract +
          ") を見ます。",
        "- 今日の金額: [4行の合計](/learn/" +
          slugs.monitor +
          ") を見ます。収入は報告に金額があるという意味です。",
        "- サイト検索が空: 上のCLIを先に実行します。それも空なら、非掲載、オファー終了日、または未検証のままにするエラーを確認します。",
        "## 例示",
        "例示であり、測定した占有ではありません。登録4枚、最小GPUは1。一つの契約が2枚を押さえ、残りのオファーは空いています。モニターは依然として4を出します。その日の4行合計が1.65 USDでも、4枚すべてが貸出中とは書けません。",
        "## 限界",
        "モニターは公開検索を呼ばず、貸出中GPU、最小GPU、予約割引、残りディスクも出しません。VastのトップページにあるGPU総数やデータセンター数は市場向けの文言であり、このマシンの占有ではありません。検証はマシンページのエラーとVastの検証説明で判断し、GPU数からは推論しません。",
      ],
    ),
  },
  {
    slug: slugs.balance,
    published: "2026-10-24",
    modified: "2026-10-24",
    project: "vast",
    sources: balanceSources,
    related: [slugs.monitor, slugs.contract, slugs.key],
    topic: text("收入与余额", "收入與餘額", "Revenue and balance", "수입과 잔액", "収入と残高"),
    title: text(
      "Vast.ai 账户余额能当成这台机器的当日收入吗？",
      "Vast.ai 帳戶餘額能當成這台機器的當日收入嗎？",
      "Can a Vast.ai account balance stand in for this machine’s income today?",
      "Vast.ai 계정 잔액을 이 머신의 오늘 수입으로 볼 수 있나요?",
      "Vast.aiの口座残高を、このマシンの今日の収入としてよいですか？",
    ),
    description: text(
      "不能。监控里的当日金额只加这台 Machine ID 的四项收入。账户信用余额、别的机器的收入、账单页上的充值都不会填进这个合计。缺一项就保持未知。",
      "不能。監控裡的當日金額只加這台 Machine ID 的四項收入。帳戶信用餘額、別的機器的收入、帳單頁上的充值都不會填進這個合計。缺一項就保持未知。",
      "No. The day’s amount on the monitor adds only the four earnings lines for that Machine ID. Account credit, another machine’s earnings, and billing top-ups are not filled into the total. A missing line stays unknown.",
      "안 됩니다. 모니터의 당일 금액은 그 Machine ID의 수입 네 줄만 더합니다. 계정 크레딧, 다른 머신의 수입, 청구 페이지의 충전은 합계에 넣지 않습니다. 한 줄이 없으면 알 수 없음입니다.",
      "できません。モニターの当日額は、そのMachine IDの収入4行だけを足します。口座クレジット、別マシンの収入、請求ページのチャージは合計に入れません。1行が欠ければ不明のままです。",
    ),
    summary: text(
      "余额是账户里还剩多少信用，当日收入是这一台机器在香港时间当天的四项报告。两边都可以是美元，回答的却不是同一个问题。把余额再加进当日收入，会把账户里还留着的信用再算成今天这台机器的进账。",
      "餘額是帳戶裡還剩多少信用，當日收入是這一台機器在香港時間當天的四項報告。兩邊都可以是美元，回答的卻不是同一個問題。把餘額再加進當日收入，會把帳戶裡還留著的信用再算成今天這台機器的進帳。",
      "Balance is credit left on the account. Day income is the four-line report for one machine on the Hong Kong day. Both can be USD and still answer different questions. Adding the balance onto the day total counts credit still sitting on the account as this machine’s income today.",
      "잔액은 계정에 남은 크레딧입니다. 당일 수입은 홍콩 시간 하루 동안 한 머신의 네 항목 보고입니다. 둘 다 USD일 수 있지만 답하는 질문이 다릅니다. 잔액을 당일 수입에 다시 더하면, 계정에 남아 있는 크레딧을 오늘 이 머신의 입금으로 또 세게 됩니다.",
      "残高は口座に残るクレジットです。当日収入は香港時間のその日、1台の4行報告です。両方USDでも答える問いは違います。残高を当日収入に足すと、口座に残っているクレジットを今日このマシンの入金としても数え直します。",
    ),
    comparisonTitle: text(
      "余额、账单和机器当日收入",
      "餘額、帳單和機器當日收入",
      "Balance, invoices, and machine-day income",
      "잔액, 청구서, 머신 당일 수입",
      "残高、請求、マシンの当日収入",
    ),
    comparison: table(
      text(
        "名称|回答的问题|会不会进入监控合计",
        "名稱|回答的問題|會不會進入監控合計",
        "Name|Question it answers|Added into the monitor total",
        "이름|답하는 질문|모니터 합계에 들어가는가",
        "名前|答える問い|モニター合計に入るか",
      ),
      [
        text(
          "四项当日收入|这台机器在香港时间当天报告了多少美元|这就是合计本身",
          "四項當日收入|這台機器在香港時間當天報告了多少美元|這就是合計本身",
          "Four day-income lines|USD reported for this machine on the Hong Kong day|This is the total",
          "당일 수입 네 줄|홍콩 시간 당일 이 머신이 보고한 USD|이것이 합계",
          "当日収入の4行|香港時間の当日、このマシンが報告したUSD|これが合計",
        ),
        text(
          "账户信用余额|账户里还剩多少可使用的信用|不会",
          "帳戶信用餘額|帳戶裡還剩多少可使用的信用|不會",
          "Account credit balance|Credit still available on the account|No",
          "계정 크레딧 잔액|계정에 아직 쓸 수 있는 크레딧|들어가지 않음",
          "口座クレジット残高|口座に残る利用可能なクレジット|入らない",
        ),
        text(
          "另一台机器的收入|那个 Machine ID 自己的四项|不会并进这一台",
          "另一台機器的收入|那個 Machine ID 自己的四項|不會併進這一台",
          "Another machine’s earnings|The four lines for that other Machine ID|Not merged into this one",
          "다른 머신의 수입|그 Machine ID 자신의 네 줄|이 머신에 합치지 않음",
          "別マシンの収入|そのMachine ID自身の4行|この1台には混ぜない",
        ),
        text(
          "账单与发票|Billing 页生成的收费记录|不会。发票在官方账单页查看",
          "帳單與發票|Billing 頁生成的收費紀錄|不會。發票在官方帳單頁查看",
          "Billing and invoices|Charges generated on the Billing page|No. Invoices stay on Vast’s Billing page",
          "청구와 인보이스|Billing 페이지에서 만든 요금 기록|들어가지 않음. 인보이스는 Vast 청구 페이지",
          "請求とインボイス|Billingページで作る料金記録|入らない。インボイスはVastの請求ページ",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "余额是 40 美元、机器当日合计是 1.65 美元，该信哪个？",
          "餘額是 40 美元、機器當日合計是 1.65 美元，該信哪個？",
          "If the balance is 40 USD and the machine day total is 1.65 USD, which one do I use?",
          "잔액이 40 USD이고 머신 당일 합계가 1.65 USD이면 어느 쪽을 쓰나요?",
          "残高が40 USDで、マシンの当日合計が1.65 USDのとき、どちらを使いますか？",
        ),
        text(
          "看你要回答的问题。问这台机器今天报告了多少，用四项合计。问账户里还剩多少信用，用余额。两个数都可能是美元，相加会把存量再算进当日收入。",
          "看你要回答的問題。問這台機器今天報告了多少，用四項合計。問帳戶裡還剩多少信用，用餘額。兩個數都可能是美元，相加會把存量再算進當日收入。",
          "Use the question you need answered. For what this machine reported today, use the four-line total. For credit still on the account, use the balance. Both can be USD. Adding them counts the stock of credit again as today’s income.",
          "답하려는 질문에 맞춥니다. 이 머신이 오늘 보고한 금액은 네 항목 합계입니다. 계정에 남은 크레딧은 잔액입니다. 둘 다 USD일 수 있습니다. 더하면 남아 있는 크레딧을 오늘 수입에 다시 넣게 됩니다.",
          "答えたい問いに合わせます。このマシンが今日報告した額は4行の合計です。口座に残るクレジットは残高です。両方USDでも、足すと残っているクレジットを今日の収入にもう一度数えます。",
        ),
      ],
      [
        text(
          "收入报告打不开时，可以用余额先填上吗？",
          "收入報告打不開時，可以用餘額先填上嗎？",
          "If the earnings report will not open, can I fill the gap with the balance?",
          "수입 보고가 열리지 않을 때 잔액으로 채울 수 있나요?",
          "収入報告が開かないとき、残高で埋めてよいですか？",
        ),
        text(
          "不要。报告缺失或四项不齐时，当日合计保持未知，不是余额，也不是 0。先按只读权限把报告读出来，再谈这台机器的金额。",
          "不要。報告缺失或四項不齊時，當日合計保持未知，不是餘額，也不是 0。先按只讀權限把報告讀出來，再談這台機器的金額。",
          "No. If the report is missing or the four lines are incomplete, the day total stays unknown. It is not the balance, and it is not zero. Get the report with a read key before you talk about this machine’s amount.",
          "안 됩니다. 보고가 없거나 네 줄이 갖춰지지 않으면 당일 합계는 알 수 없음입니다. 잔액도 0도 아닙니다. 읽기 키로 보고를 읽은 다음에 이 머신의 금액을 말합니다.",
          "しないでください。報告が無い、または4行が揃わないとき、当日合計は不明です。残高でも0でもありません。読取キーで報告を読んでから、このマシンの金額を見ます。",
        ),
      ],
      [
        text(
          "香港时间当日和我所在时区的“今天”不一致怎么办？",
          "香港時間當日和我所在時區的「今天」不一致怎麼辦？",
          "What if the Hong Kong day is not “today” in my time zone?",
          "홍콩 시간 당일이 내 시간대의 오늘과 다르면 어떻게 하나요?",
          "香港時間の当日が、自分のタイムゾーンの今日と違うときは？",
        ),
        text(
          "以监控上的香港日为准去对官方报告，不要把另一个时区的自然日直接当成同一窗口。账单页上的发票周期也不是这个当日合计。",
          "以監控上的香港日為準去對官方報告，不要把另一個時區的自然日直接當成同一窗口。帳單頁上的發票週期也不是這個當日合計。",
          "Match the official report to the Hong Kong day shown on the monitor. Do not treat another time zone’s calendar day as the same window. An invoice period on the Billing page is not this day total either.",
          "모니터에 나온 홍콩일에 맞춰 공식 보고와 대조합니다. 다른 시간대의 달력 일을 같은 구간으로 보지 않습니다. 청구 페이지의 인보이스 기간도 이 당일 합계가 아닙니다.",
          "モニターに出ている香港日で公式報告と照合します。別のタイムゾーンの暦日を同じ区間だと思わないでください。請求ページのインボイス期間も、この当日合計ではありません。",
        ),
      ],
    ]),
    decision: {
      title: text(
        "机器当日收入和账户余额分开看",
        "機器當日收入和帳戶餘額分開看",
        "Keep machine-day income apart from the account balance",
        "머신 당일 수입과 계정 잔액을 나눠 본다",
        "マシンの当日収入と口座残高は分けて見る",
      ),
      action: text(
        "问这台机器今天报告多少，只看四项合计。余额留在账户页。报告缺失时不要用余额或 0 填空。",
        "問這台機器今天報告多少，只看四項合計。餘額留在帳戶頁。報告缺失時不要用餘額或 0 填空。",
        "For what this machine reported today, read only the four-line total. Leave the balance on the account page. If the report is missing, do not fill the blank with the balance or with zero.",
        "이 머신이 오늘 보고한 금액은 네 항목 합계만 봅니다. 잔액은 계정 페이지에 둡니다. 보고가 없으면 잔액이나 0으로 빈칸을 채우지 않습니다.",
        "このマシンが今日報告した額は4行の合計だけを見ます。残高は口座ページに残します。報告が無ければ、残高や0で空欄を埋めません。",
      ),
    },
    body: paras(
      [
        "不能。在 " +
          tool.zh +
          " 里，这台机器的当日收入是它自己的四项美元：GPU、存储、上传带宽、下载带宽。账户余额是账户里还剩的信用，监控不会把它加进任何一台机器的合计，也不会在报告缺失时用它顶上。",
        "## 为什么两个美元数会差很多",
        "余额可以来自充值、未花掉的信用，或账户层面的其他变动。当日合计只覆盖一个 Machine ID、一个香港日、而且四项必须齐全。另一台机器哪怕收入更高，也不会并进你正在看的这一台。",
        "发票在 Vast 的 Billing 页生成。官方说明是打开 Billing，在 Generate Billing History 下勾选 Include Charges。那是收费记录，不是监控上的当日四项。",
        "## 对账时看什么",
        "- 先确认 Machine ID 是你要的那一台，而不是账户里的另一台。",
        "- 再确认四项都有数字，时间窗口是香港时间当日。",
        "- 余额只在你要回答“账户还剩多少信用”时才打开，不要和合计相加。",
        "## 接下来怎么处理",
        "- 合计和官方报告的四项一致：用这个数描述这一台、这一日。",
        "- 合计未知：保持未知。检查 [读取密钥](/learn/" +
          slugs.key +
          ") 是否能看到收入，而不是把余额抄过来。",
        "- 你其实想看某一份租约的锁定价格：那不是余额，也不是当日合计，回到 [租约](/learn/" +
          slugs.contract +
          ")。",
        "## 举例",
        "举例，不是真实账户：这台机器四项为 1.20、0.30、0.10、0.05，当日合计 1.65 美元。同一账户余额显示 40 美元，另一台机器当天另有收入。监控对这台机器仍只给出 1.65。若下载一项缺失，这里显示未知，不会改成 40，也不会改成 0。",
        "## 界限",
        "监控不显示可提现金额，也不预测到账日。托管概览让 Host 到登录后的 Market Stats 了解价格水平，并且至少要有一台已登记机器；那个页面不是这里的当日合计。能赚多少没有保证。",
      ],
      [
        "不能。在 " +
          tool["zh-TW"] +
          " 裡，這台機器的當日收入是它自己的四項美元：GPU、儲存、上傳頻寬、下載頻寬。帳戶餘額是帳戶裡還剩的信用，監控不會把它加進任何一台機器的合計，也不會在報告缺失時用它頂上。",
        "## 為什麼兩個美元數會差很多",
        "餘額可以來自充值、未花掉的信用，或帳戶層面的其他變動。當日合計只覆蓋一個 Machine ID、一個香港日、而且四項必須齊全。另一台機器哪怕收入更高，也不會併進你正在看的這一台。",
        "發票在 Vast 的 Billing 頁生成。官方說明是打開 Billing，在 Generate Billing History 下勾選 Include Charges。那是收費紀錄，不是監控上的當日四項。",
        "## 對帳時看什麼",
        "- 先確認 Machine ID 是你要的那一台，而不是帳戶裡的另一台。",
        "- 再確認四項都有數字，時間窗口是香港時間當日。",
        "- 餘額只在你要回答「帳戶還剩多少信用」時才打開，不要和合計相加。",
        "## 接下來怎麼處理",
        "- 合計和官方報告的四項一致：用這個數描述這一台、這一日。",
        "- 合計未知：保持未知。檢查 [讀取密鑰](/learn/" +
          slugs.key +
          ") 是否能看到收入，而不是把餘額抄過來。",
        "- 你其實想看某一份租約的鎖定價格：那不是餘額，也不是當日合計，回到 [租約](/learn/" +
          slugs.contract +
          ")。",
        "## 舉例",
        "舉例，不是真實帳戶：這台機器四項為 1.20、0.30、0.10、0.05，當日合計 1.65 美元。同一帳戶餘額顯示 40 美元，另一台機器當天另有收入。監控對這台機器仍只給出 1.65。若下載一項缺失，這裡顯示未知，不會改成 40，也不會改成 0。",
        "## 界限",
        "監控不顯示可提現金額，也不預測到帳日。託管概覽讓 Host 到登入後的 Market Stats 了解價格水準，並且至少要有一台已登記機器；那個頁面不是這裡的當日合計。能賺多少沒有保證。",
      ],
      [
        "No. On the " +
          tool.en +
          ", this machine’s income for the day is its own four USD lines: GPU, storage, upload bandwidth, and download bandwidth. The account balance is credit still left on the account. The monitor does not add that balance into any machine’s total, and it does not substitute the balance when the report is missing.",
        "## Why two USD figures can be far apart",
        "Balance can include top-ups, unused credit, or other account-level changes. The day total covers one Machine ID, one Hong Kong day, and only when all four lines are present. A higher figure on another machine is not merged into the machine you are viewing.",
        "Invoices are created on Vast’s Billing page. The hosting overview says to open Billing and check Include Charges under Generate Billing History. That is a charge record, not the four lines on the monitor.",
        "## What to compare",
        "- Confirm the Machine ID is the machine you mean, not another machine on the same account.",
        "- Confirm all four lines are numbers and the window is the Hong Kong day.",
        "- Open the balance only when the question is how much credit remains. Do not add it to the total.",
        "## What to do next",
        "- If the total matches the four lines in the official report, use that number for this machine and this day.",
        "- If the total is unknown, leave it unknown. Check whether the [read key](/learn/" +
          slugs.key +
          ") can see earnings. Do not copy the balance across.",
        "- If you actually wanted one contract’s locked price, that is neither the balance nor the day total. Return to [contracts](/learn/" +
          slugs.contract +
          ").",
        "## Illustrative case",
        "Illustrative, not a real account: the four lines are 1.20, 0.30, 0.10, and 0.05, so the day total is 1.65 USD. The same account shows a 40 USD balance, and another machine has its own earnings that day. The monitor still shows 1.65 for this machine. If the download line is missing, the figure stays unknown. It does not become 40, and it does not become 0.",
        "## Limits",
        "The monitor does not show a withdrawable amount or predict a payout date. The hosting overview points signed-in hosts with at least one registered machine to Market Stats for price levels. That page is not this day total. Nothing here promises what hosting will earn.",
      ],
      [
        "안 됩니다. " +
          tool.ko +
          "에서 이 머신의 당일 수입은 자신의 네 USD 항목입니다. GPU, 스토리지, 업로드 대역폭, 다운로드 대역폭입니다. 계정 잔액은 계정에 남은 크레딧입니다. 모니터는 그 잔액을 어떤 머신 합계에도 더하지 않으며, 보고가 없을 때 잔액으로 대신하지도 않습니다.",
        "## 두 USD 숫자가 크게 다를 수 있는 이유",
        "잔액에는 충전, 쓰지 않은 크레딧, 계정 단위의 다른 변동이 섞일 수 있습니다. 당일 합계는 Machine ID 하나, 홍콩일 하나, 그리고 네 줄이 모두 있을 때만입니다. 다른 머신의 더 큰 금액은 지금 보는 머신에 합쳐지지 않습니다.",
        "인보이스는 Vast의 Billing 페이지에서 만듭니다. 호스팅 개요는 Billing을 열고 Generate Billing History 아래에서 Include Charges를 선택하라고 합니다. 그것은 요금 기록이며 모니터의 네 항목이 아닙니다.",
        "## 대조할 때",
        "- Machine ID가 보려는 그 머신인지, 같은 계정의 다른 머신이 아닌지 확인합니다.",
        "- 네 줄이 모두 숫자이고 구간이 홍콩 시간 당일인지 확인합니다.",
        "- 잔액은 남은 크레딧을 물을 때만 엽니다. 합계에 더하지 않습니다.",
        "## 다음에 할 일",
        "- 합계가 공식 보고의 네 줄과 같으면, 그 수를 이 머신과 이 날에 사용합니다.",
        "- 합계를 알 수 없으면 알 수 없음으로 둡니다. [읽기 키](/learn/" +
          slugs.key +
          ")가 수입을 볼 수 있는지 확인하고, 잔액을 옮겨 적지 않습니다.",
        "- 실제로 원한 것이 한 계약의 잠긴 가격이면, 그것은 잔액도 당일 합계도 아닙니다. [계약](/learn/" +
          slugs.contract +
          ")으로 돌아갑니다.",
        "## 예시",
        "예시이며 실제 계정이 아닙니다. 네 항목이 1.20, 0.30, 0.10, 0.05이면 당일 합계는 1.65 USD입니다. 같은 계정 잔액이 40 USD이고 다른 머신에 그날 따로 수입이 있어도, 모니터는 이 머신에 1.65만 보여 줍니다. 다운로드가 없으면 알 수 없음이며 40도 0도 되지 않습니다.",
        "## 한계",
        "모니터는 출금 가능 금액을 보여 주지 않고 지급일을 예측하지도 않습니다. 호스팅 개요는 등록된 머신이 하나 이상인 로그인한 Host에게 가격 수준을 Market Stats에서 보라고 합니다. 그 페이지는 이 당일 합계가 아닙니다. 호스팅으로 얼마를 버는지는 약속하지 않습니다.",
      ],
      [
        "できません。" +
          tool.ja +
          "では、このマシンの当日収入は自分の4つのUSDです。GPU、ストレージ、上り帯域、下り帯域です。口座残高は口座に残っているクレジットです。モニターはその残高をどのマシンの合計にも足さず、報告が欠けたときに残高で埋め合わせることもありません。",
        "## 二つのUSDが大きく違いうる理由",
        "残高にはチャージ、未使用のクレジット、口座単位のほかの変動が入り得ます。当日合計はMachine ID一つ、香港日一つ、そして4行が揃ったときだけです。別マシンのより大きい額は、今見ている1台には混ざりません。",
        "インボイスはVastのBillingページで作ります。ホスティング概要は、Billingを開き、Generate Billing Historyの下でInclude Chargesを選ぶと書いています。それは料金記録であり、モニターの4行ではありません。",
        "## 照合するとき",
        "- Machine IDが見たいそのマシンか、同じ口座の別マシンでないかを確認します。",
        "- 4行がすべて数で、区間が香港時間の当日かを確認します。",
        "- 残高は、残っているクレジットを聞くときだけ開きます。合計には足しません。",
        "## 次にすること",
        "- 合計が公式報告の4行と一致するなら、その数をこのマシンとこの日に使います。",
        "- 合計が不明なら不明のままにします。[読取キー](/learn/" +
          slugs.key +
          ")で収入を見られるか確認し、残高を書き写しません。",
        "- 本当に欲しいのが一つの契約の固定価格なら、それは残高でも当日合計でもありません。[契約](/learn/" +
          slugs.contract +
          ")に戻ります。",
        "## 例示",
        "例示であり、実在の口座ではありません。4行が1.20、0.30、0.10、0.05なら当日合計は1.65 USDです。同じ口座の残高が40 USDで、別マシンにその日の収入が別にっても、モニターはこのマシンに1.65だけを出します。下りが欠ければ不明のままで、40にも0にもなりません。",
        "## 限界",
        "モニターは出金できる額を出さず、着金日も予測しません。ホスティング概要は、登録済みマシンが1台以上あるログイン中のHostに、価格水準はMarket Statsで見るよう案内しています。そのページはこの当日合計ではありません。ホスティングでいくら得られるかは約束しません。",
      ],
    ),
  },
  {
    slug: slugs.key,
    published: "2026-10-24",
    modified: "2026-10-24",
    project: "vast",
    sources: keySources,
    related: [slugs.monitor, slugs.balance, slugs.offers],
    topic: text("只读密钥", "唯讀密鑰", "Read-only key", "읽기 전용 키", "読取専用キー"),
    title: text(
      "Vast.ai 监控该用哪种 API 密钥，密钥填在哪里？",
      "Vast.ai 監控該用哪種 API 密鑰，密鑰填在哪裡？",
      "Which Vast.ai API key should the monitor use, and where does it go?",
      "Vast.ai 모니터에는 어떤 API 키를 쓰고, 어디에 넣나요?",
      "Vast.aiモニターにはどのAPIキーを使い、どこに入れますか？",
    ),
    description: text(
      "密钥放在账户连接里，不要填进 Machine ID。只读监控需要能查看机器和收入的权限。转账和上下架属于写入权限，不应配给这把钥匙。报告被拒绝时合计保持未知。",
      "密鑰放在帳戶連接裡，不要填進 Machine ID。唯讀監控需要能查看機器和收入的權限。轉帳和上下架屬於寫入權限，不應配給這把鑰匙。報告被拒絕時合計保持未知。",
      "Put the key in the account connection, not in the Machine ID field. A read-only monitor needs permission to view machines and earnings. Transfers and listing changes are write permissions and should stay off that key. A refused report leaves the total unknown.",
      "키는 계정 연결에 넣고 Machine ID 칸에는 넣지 않습니다. 읽기 전용 모니터는 머신과 수입을 보는 권한이 필요합니다. 이체와 오퍼 변경은 쓰기 권한이라 이 키에 주지 않습니다. 보고가 거부되면 합계는 알 수 없음입니다.",
      "キーはアカウント接続に入れ、Machine ID欄には入れません。読取専用モニターにはマシンと収入を見る権限が要ります。送金や掲載の変更は書き込み権限なので、このキーには付けません。報告が拒否されると合計は不明のままです。",
    ),
    summary: text(
      "用一把只读密钥连接 Host 账户，再用 Machine ID 指定机器。客户实例密钥、转账权限或上下架权限都不是这把钥匙该有的范围。连上密钥也不等于机器已通过 Vast 验证。",
      "用一把唯讀密鑰連接 Host 帳戶，再用 Machine ID 指定機器。客戶實例密鑰、轉帳權限或上下架權限都不是這把鑰匙該有的範圍。連上密鑰也不等於機器已通過 Vast 驗證。",
      "Connect the hosting account with a read-only key, then name the machine with its Machine ID. A client-instance key, a transfer permission, or a list/unlist permission is outside what this key needs. Connecting the key does not mean Vast has verified the machine.",
      "읽기 전용 키로 Host 계정을 연결한 뒤 Machine ID로 머신을 지정합니다. 고객 인스턴스 키, 이체 권한, 올리기/내리기 권한은 이 키의 범위가 아닙니다. 키를 연결해도 Vast가 머신을 검증했다는 뜻은 아닙니다.",
      "読取専用キーでHostアカウントを接続し、Machine IDでマシンを指定します。顧客インスタンス用のキー、送金権限、掲載や非掲載の権限は、このキーに要りません。キーを接続しても、Vastがマシンを検証したことにはなりません。",
    ),
    comparisonTitle: text(
      "密钥权限和监控要不要它",
      "密鑰權限和監控要不要它",
      "Key permissions and whether the monitor needs them",
      "키 권한과 모니터에 필요한지",
      "キー権限とモニターに要るか",
    ),
    comparison: table(
      text(
        "权限类别|官方说明它能做的事|给监控这把钥匙吗",
        "權限類別|官方說明它能做的事|給監控這把鑰匙嗎",
        "Permission category|What Vast says it can do|Give it to this monitor key?",
        "권한 범주|Vast가 말하는 할 수 있는 일|이 모니터 키에 줄까",
        "権限カテゴリ|Vastが書いているできること|このモニターのキーに付けるか",
      ),
      [
        text(
          "machine_read|查看机器和报告|要。没有它就看不到你的机器列表",
          "machine_read|查看機器和報告|要。沒有它就看不到你的機器列表",
          "machine_read|View machines and reports|Yes. Without it the machine list is not visible",
          "machine_read|머신과 보고 보기|필요. 없으면 머신 목록을 보지 못함",
          "machine_read|マシンと報告の閲覧|要る。無いとマシン一覧が見えない",
        ),
        text(
          "billing_read|查看发票和收入。Show Earnings 在这一类|要。不要改去勾选转账",
          "billing_read|查看發票和收入|要。收入屬於這一類裡的 Show Earnings",
          "billing_read|View invoices and earnings|Yes. Earnings are Show Earnings in this category",
          "billing_read|인보이스와 수입 보기|필요. 수입은 이 범주의 Show Earnings",
          "billing_read|インボイスと収入の閲覧|要る。収入はこのカテゴリのShow Earnings",
        ),
        text(
          "billing_write|转移信用|不要。这不是读取",
          "billing_write|轉移信用|不要。這不是讀取",
          "billing_write|Transfer credit|No. That is not a read",
          "billing_write|크레딧 이전|주지 않음. 읽기가 아님",
          "billing_write|クレジットの移動|付けない。読取ではない",
        ),
        text(
          "machine_write|上下架、维护、清理机器|不要。监控不代替你操作机器",
          "machine_write|上下架、維護、清理機器|不要。監控不代替你操作機器",
          "machine_write|List, unlist, maintenance, cleanup|No. The monitor does not operate the machine for you",
          "machine_write|올리기, 내리기, 유지보수, 정리|주지 않음. 모니터가 머신을 대신 조작하지 않음",
          "machine_write|掲載、非掲載、保守、クリーンアップ|付けない。モニターはマシンを代わりに操作しない",
        ),
        text(
          "instance_read / instance_write|查看或创建客户实例|不要拿客户钥匙代替 Host 钥匙",
          "instance_read / instance_write|查看或建立客戶實例|不要拿客戶鑰匙代替 Host 鑰匙",
          "instance_read / instance_write|View or create client instances|Do not substitute a client key for a host key",
          "instance_read / instance_write|고객 인스턴스 보기 또는 만들기|고객 키로 Host 키를 대신하지 않음",
          "instance_read / instance_write|顧客インスタンスの閲覧や作成|顧客用キーをHost用キーの代わりにしない",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "API 密钥可以粘贴在 Machine ID 那一栏吗？",
          "API 密鑰可以貼在 Machine ID 那一欄嗎？",
          "Can I paste the API key into the Machine ID field?",
          "API 키를 Machine ID 칸에 붙여 넣을 수 있나요?",
          "APIキーをMachine ID欄に貼れますか？",
        ),
        text(
          "不能。Machine ID 是机器编号。密钥只放在 Vast 项目的账户连接里，由服务端用来读取你的机器和收入。不要把密钥写进公开备注、机器名称或这篇指南的评论里。",
          "不能。Machine ID 是機器編號。密鑰只放在 Vast 專案的帳戶連接裡，由服務端用來讀取你的機器和收入。不要把密鑰寫進公開備註、機器名稱或這篇指南的評論裡。",
          "No. The Machine ID is the machine number. The key belongs only in the Vast account connection, where the server uses it to read your machines and earnings. Do not put the key in a public note, a machine name, or a comment on this guide.",
          "안 됩니다. Machine ID는 머신 번호입니다. 키는 Vast 프로젝트의 계정 연결에만 두며, 서버가 그 키로 머신과 수입을 읽습니다. 공개 메모, 머신 이름, 이 가이드의 댓글에 키를 적지 않습니다.",
          "できません。Machine IDはマシン番号です。キーはVastプロジェクトのアカウント接続にだけ置き、サーバーがそのキーでマシンと収入を読みます。公開メモ、マシン名、このガイドのコメントにキーを書かないでください。",
        ),
      ],
      [
        text(
          "权限页没有写出 machine-earnings 这个路径，我该勾哪几项？",
          "權限頁沒有寫出 machine-earnings 這個路徑，我該勾哪幾項？",
          "The permissions page does not name the machine-earnings path. Which boxes do I enable?",
          "권한 페이지에 machine-earnings 경로가 없습니다. 어떤 항목을 켜나요?",
          "権限ページに machine-earnings のパスがありません。どれを有効にしますか？",
        ),
        text(
          "按权限页的动作名称来勾：查看机器用 machine_read，查看收入用 billing_read 里的 Show Earnings。页面没有把每个 URL 逐条写死。若连上后仍看不到机器或收入，只补充这两类读取，不要顺手打开 billing_write 或 machine_write。",
          "按權限頁的動作名稱來勾：查看機器用 machine_read，查看收入用 billing_read 裡的 Show Earnings。頁面沒有把每個 URL 逐條寫死。若連上後仍看不到機器或收入，只補充這兩類讀取，不要順手打開 billing_write 或 machine_write。",
          "Follow the action names on the permissions page: machine_read for viewing machines, and Show Earnings inside billing_read for earnings. The page does not pin every URL. If machines or earnings are still missing after you connect, add only those read categories. Do not also turn on billing_write or machine_write.",
          "권한 페이지의 동작 이름을 따릅니다. 머신 보기는 machine_read, 수입은 billing_read 안의 Show Earnings입니다. 페이지가 모든 URL을 적지는 않습니다. 연결 후에도 머신이나 수입이 없으면 그 읽기 범주만 추가합니다. billing_write나 machine_write는 켜지 않습니다.",
          "権限ページの動作名に従います。マシンの閲覧は machine_read、収入は billing_read の Show Earnings です。ページはすべてのURLを一行ずつは書いていません。接続後もマシンや収入が見えなければ、その読取カテゴリだけを足します。billing_write や machine_write はオンにしません。",
        ),
      ],
      [
        text(
          "密钥可用，但当日合计是未知，机器是不是坏了？",
          "密鑰可用，但當日合計是未知，機器是不是壞了？",
          "The key works, but the day total is unknown. Is the machine broken?",
          "키는 되는데 당일 합계가 알 수 없음입니다. 머신이 고장인가요?",
          "キーは使えるのに当日合計が不明です。マシンの故障ですか？",
        ),
        text(
          "不一定。未知只表示这台机器的四项没有齐，或收入报告这次没有返回。机器离线、未验证、没有租约，是机器页上另一组事实。不要把未知改成 0，也不要用余额代替。",
          "不一定。未知只表示這台機器的四項沒有齊，或收入報告這次沒有返回。機器離線、未驗證、沒有租約，是機器頁上另一組事實。不要把未知改成 0，也不要用餘額代替。",
          "Not necessarily. Unknown means the four lines for this machine are incomplete, or the earnings report did not come back this time. Offline, unverified, or no current rental are separate facts on the machines page. Do not rewrite unknown as 0, and do not replace it with the balance.",
          "꼭 고장은 아닙니다. 알 수 없음은 이 머신의 네 줄이 갖춰지지 않았거나, 이번에 수입 보고가 오지 않았다는 뜻입니다. 오프라인, 미검증, 임대 없음은 기기 페이지의 다른 사실입니다. 알 수 없음을 0으로 바꾸거나 잔액으로 대신하지 않습니다.",
          "必ずしも故障ではありません。不明は、このマシンの4行が揃っていないか、今回の収入報告が戻ってこなかったことを意味します。オフライン、未検証、契約なしはマシンページ上の別の事実です。不明を0に書き換えたり、残高で置き換えたりしないでください。",
        ),
      ],
    ]),
    decision: {
      title: text(
        "密钥放进连接，编号放进 Machine ID",
        "密鑰放進連接，編號放進 Machine ID",
        "Key in the connection, number in Machine ID",
        "키는 연결에, 번호는 Machine ID에",
        "キーは接続へ、番号はMachine IDへ",
      ),
      action: text(
        "创建只含 machine_read 和 billing_read 的密钥，填进账户连接。Machine ID 仍从 Host 机器页复制。写入权限留空。",
        "建立只含 machine_read 和 billing_read 的密鑰，填進帳戶連接。Machine ID 仍從 Host 機器頁複製。寫入權限留空。",
        "Create a key with machine_read and billing_read only, and put it in the account connection. Copy the Machine ID from the Host machines page. Leave write permissions off.",
        "machine_read와 billing_read만 있는 키를 만들어 계정 연결에 넣습니다. Machine ID는 Host 기기 페이지에서 복사합니다. 쓰기 권한은 비워 둡니다.",
        "machine_read と billing_read だけのキーを作り、アカウント接続に入れます。Machine IDはHostマシンページからコピーします。書き込み権限は空のままにします。",
      ),
    },
    body: paras(
      [
        "监控要的是一把 Host 侧的只读密钥，放在 " +
          tool.zh +
          " 的账户连接里。Machine ID 那一栏只接受机器编号。客户用来开实例的密钥，和能转移信用、能上下架的密钥，都不适合拿来做这个只读查看。",
        "## 权限页怎么读",
        "Vast 的权限按类别授予。machine_read 对应查看机器和报告。billing_read 对应查看发票和收入，其中包含 Show Earnings。billing_write 是转移信用。machine_write 包含上架、下架、维护和清理。instance_read 与 instance_write 是客户实例，不是 Host 机器列表。",
        "权限页列出的是动作名称，没有把每一条 URL 都写出来。因此不要因为页面上没有出现某个路径，就改去勾选转账或上下架。",
        "## 连接之后检查什么",
        "- 机器列表里能看见你的 Machine ID，GPU 型号与机器页一致。",
        "- 四项齐全时才出现当日合计。少一项或报告没有返回，合计保持未知。",
        "- 账户余额没有被抄进这台机器。见 [收入与余额](/learn/" + slugs.balance + ")。",
        "## 接下来怎么处理",
        "- 看不到机器：补 machine_read，确认这把钥匙属于 Host 账户，而不是客户账户。",
        "- 看得到机器、看不到收入：补 billing_read，不要打开 billing_write。",
        "- 想改价或下架：那是 Host 机器页或带 machine_write 的另一把钥匙的事，不是这把只读钥匙。占用仍看 [报价与租约](/learn/" +
          slugs.offers +
          ")。",
        "## 举例",
        "举例，不是一次真实的权限实验：只打开 machine_read 和 billing_read。机器列表返回编号 12001，四项为 1.20、0.30、0.10、0.05，当日合计 1.65 美元。若收入这一次被拒绝，合计变为未知，机器登记信息仍可保留；不要改记成 0，也不要改用余额 40 美元。",
        "## 界限",
        "连上密钥只说明这次读取被接受，不说明机器已通过 Vast 的自动验证，也不说明租金一定会到账。密钥不要发到公开场合。Agent 不能用这把钥匙开关 Vast 租约；它只操作 Mac 上的 Train at Home。崩溃分析不另收费。",
      ],
      [
        "監控要的是一把 Host 側的唯讀密鑰，放在 " +
          tool["zh-TW"] +
          " 的帳戶連接裡。Machine ID 那一欄只接受機器編號。客戶用來開實例的密鑰，和能轉移信用、能上下架的密鑰，都不適合拿來做這個唯讀查看。",
        "## 權限頁怎麼讀",
        "Vast 的權限按類別授予。machine_read 對應查看機器和報告。billing_read 對應查看發票和收入，其中包含 Show Earnings。billing_write 是轉移信用。machine_write 包含上架、下架、維護和清理。instance_read 與 instance_write 是客戶實例，不是 Host 機器列表。",
        "權限頁列出的是動作名稱，沒有把每一條 URL 都寫出來。因此不要因為頁面上沒有出現某個路徑，就改去勾選轉帳或上下架。",
        "## 連接之後檢查什麼",
        "- 機器列表裡能看見你的 Machine ID，GPU 型號與機器頁一致。",
        "- 四項齊全時才出現當日合計。少一項或報告沒有返回，合計保持未知。",
        "- 帳戶餘額沒有被抄進這台機器。見 [收入與餘額](/learn/" + slugs.balance + ")。",
        "## 接下來怎麼處理",
        "- 看不到機器：補 machine_read，確認這把鑰匙屬於 Host 帳戶，而不是客戶帳戶。",
        "- 看得到機器、看不到收入：補 billing_read，不要打開 billing_write。",
        "- 想改價或下架：那是 Host 機器頁或帶 machine_write 的另一把鑰匙的事，不是這把唯讀鑰匙。占用仍看 [報價與租約](/learn/" +
          slugs.offers +
          ")。",
        "## 舉例",
        "舉例，不是一次真實的權限實驗：只打開 machine_read 和 billing_read。機器列表返回編號 12001，四項為 1.20、0.30、0.10、0.05，當日合計 1.65 美元。若收入這一次被拒絕，合計變為未知，機器登記資訊仍可保留；不要改記成 0，也不要改用餘額 40 美元。",
        "## 界限",
        "連上密鑰只說明這次讀取被接受，不說明機器已通過 Vast 的自動驗證，也不說明租金一定會到帳。密鑰不要發到公開場合。Agent 不能用這把鑰匙開關 Vast 租約；它只操作 Mac 上的 Train at Home。當機分析不另收費。",
      ],
      [
        "The monitor needs a read-only key on the hosting side, stored in the account connection on the " +
          tool.en +
          ". The Machine ID field accepts only the machine number. A key made to launch client instances, or a key that can transfer credit or list and unlist machines, is the wrong key for this read.",
        "## How to read the permissions page",
        "Vast grants permissions by category. machine_read covers viewing machines and reports. billing_read covers invoices and earnings, including Show Earnings. billing_write is Transfer Credit. machine_write includes listing, unlisting, maintenance, and cleanup. instance_read and instance_write are client instances, not the host machine list.",
        "The permissions page names actions. It does not pin every URL. If a path you expected is absent, that is not a reason to enable transfers or listing changes.",
        "## What to check after connecting",
        "- The machine list shows your Machine ID, and the GPU name matches the machines page.",
        "- A day total appears only when all four lines are present. One gap, or a report that does not come back, leaves the total unknown.",
        "- The account balance is not copied onto this machine. See [revenue and balance](/learn/" +
          slugs.balance +
          ").",
        "## What to do next",
        "- No machines visible: add machine_read, and confirm the key belongs to the hosting account rather than a client account.",
        "- Machines visible, earnings missing: add billing_read. Do not enable billing_write.",
        "- To change price or unlist: use the Host machines page, or a different key that has machine_write. This read-only key does not do that. Occupancy stays in [offers and contracts](/learn/" +
          slugs.offers +
          ").",
        "## Illustrative case",
        "Illustrative, not a live permission trial: enable only machine_read and billing_read. The machine list returns id 12001, and the four lines 1.20, 0.30, 0.10, and 0.05 sum to 1.65 USD. If earnings are refused this time, the total becomes unknown while the machine record can remain. Do not rewrite it as 0, and do not substitute a 40 USD balance.",
        "## Limits",
        "A connected key means this read was accepted. It does not mean Vast has verified the machine, and it does not mean rent will be paid out. Do not publish the key. The agent cannot start or stop Vast rentals with it; the agent controls Train at Home on a Mac only. Crash analysis is free.",
      ],
      [
        "모니터에 필요한 것은 Host 쪽의 읽기 전용 키이며, " +
          tool.ko +
          "의 계정 연결에 둡니다. Machine ID 칸은 머신 번호만 받습니다. 고객 인스턴스를 여는 키, 크레딧을 옮기거나 오퍼를 올리고 내리는 키는 이 읽기에 맞지 않습니다.",
        "## 권한 페이지를 읽는 법",
        "Vast는 범주별로 권한을 줍니다. machine_read는 머신과 보고 보기입니다. billing_read는 인보이스와 수입이며 Show Earnings를 포함합니다. billing_write는 크레딧 이전입니다. machine_write는 올리기, 내리기, 유지보수, 정리입니다. instance_read와 instance_write는 고객 인스턴스이며 Host 머신 목록이 아닙니다.",
        "권한 페이지는 동작 이름을 적습니다. 모든 URL을 적지는 않습니다. 기대한 경로가 없다고 이체나 오퍼 변경을 켜지 않습니다.",
        "## 연결한 뒤 확인할 것",
        "- 머신 목록에 Machine ID가 보이고, GPU 이름이 기기 페이지와 같습니다.",
        "- 당일 합계는 네 줄이 모두 있을 때만 나옵니다. 한 줄이 없거나 보고가 돌아오지 않으면 합계는 알 수 없음입니다.",
        "- 계정 잔액은 이 머신에 복사되지 않습니다. [수입과 잔액](/learn/" +
          slugs.balance +
          ")을 봅니다.",
        "## 다음에 할 일",
        "- 머신이 안 보이면 machine_read를 더하고, 키가 고객 계정이 아닌 Host 계정인지 확인합니다.",
        "- 머신은 보이고 수입이 없으면 billing_read를 더합니다. billing_write는 켜지 않습니다.",
        "- 가격 변경이나 내리기는 Host 기기 페이지, 또는 machine_write가 있는 다른 키의 일입니다. 이 읽기 전용 키는 하지 않습니다. 점유는 [오퍼와 계약](/learn/" +
          slugs.offers +
          ")에 있습니다.",
        "## 예시",
        "예시이며 실제 권한 실험이 아닙니다. machine_read와 billing_read만 켭니다. 머신 목록이 번호 12001을 돌려주고, 1.20, 0.30, 0.10, 0.05의 합은 1.65 USD입니다. 이번에 수입이 거부되면 합계는 알 수 없음이 되고 머신 기록은 남을 수 있습니다. 0으로 바꾸거나 40 USD 잔액으로 대신하지 않습니다.",
        "## 한계",
        "키를 연결했다는 것은 이번 읽기가 받아들여졌다는 뜻입니다. Vast가 머신을 검증했거나 임대료가 지급된다는 뜻은 아닙니다. 키를 공개하지 않습니다. Agent는 이 키로 Vast 임대를 켜거나 끄지 못하며, Mac의 Train at Home만 다룹니다. 장애 분석은 무료입니다.",
      ],
      [
        "モニターに要るのはHost側の読取専用キーで、" +
          tool.ja +
          " のアカウント接続に置きます。Machine ID欄が受け取るのはマシン番号だけです。顧客インスタンスを起動するキーや、クレジットを移し、掲載や非掲載ができるキーは、この読取には向きません。",
        "## 権限ページの読み方",
        "Vastはカテゴリで権限を渡します。machine_readはマシンと報告の閲覧です。billing_readはインボイスと収入で、Show Earningsを含みます。billing_writeはクレジットの移動です。machine_writeは掲載、非掲載、保守、クリーンアップです。instance_readとinstance_writeは顧客インスタンスであり、Hostのマシン一覧ではありません。",
        "権限ページが書いているのは動作名です。すべてのURLを一行ずつは書いていません。期待したパスが無いからといって、送金や掲載変更を有効にしません。",
        "## 接続したあと確認すること",
        "- マシン一覧にMachine IDが見え、GPU名がマシンページと一致します。",
        "- 当日合計は4行が揃ったときだけ出ます。1行が無い、または報告が戻らないときは合計は不明です。",
        "- 口座残高はこのマシンへコピーされません。[収入と残高](/learn/" +
          slugs.balance +
          ")を見ます。",
        "## 次にすること",
        "- マシンが見えない: machine_readを足し、キーが顧客アカウントではなくHostアカウントのものか確認します。",
        "- マシンは見えて収入が無い: billing_readを足します。billing_writeはオンにしません。",
        "- 価格変更や非掲載は、Hostマシンページか、machine_writeを持つ別のキーの仕事です。この読取専用キーでは行いません。占有は [オファーと契約](/learn/" +
          slugs.offers +
          ") にあります。",
        "## 例示",
        "例示であり、実際の権限試験ではありません。machine_readとbilling_readだけを有効にします。マシン一覧が番号12001を返し、1.20、0.30、0.10、0.05の合計は1.65 USDです。今回収入が拒否されると合計は不明になり、マシン記録は残り得ます。0に書き換えたり、40 USDの残高で置き換えたりしません。",
        "## 限界",
        "キーを接続できたことは、今回の読取が受け付けられたという意味です。Vastがマシンを検証したことや、賃料が支払われることは意味しません。キーを公開しないでください。AgentはこのキーでVastのレンタルを開始も停止もできず、操作できるのはMac上のTrain at Homeだけです。障害分析は無料です。",
      ],
    ),
  },
];
