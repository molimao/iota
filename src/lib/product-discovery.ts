import { type SiteLocale, LOCALES } from "./site";
import { planAmount } from "./billing-display";
export const DISCOVERY_UPDATED = "2026-10-09";
export const localized = <T>(items: readonly [T, T, T, T, T]) =>
  Object.fromEntries(LOCALES.map((l, i) => [l, items[i]])) as Record<SiteLocale, T>;
// Order follows LOCALES: zh, zh-TW, en, ko, ja. Shared by HTML, schema and readable exports.
export const discoveryCopy = {
  steps: localized(["查看步骤", "查看步驟", "Read the steps", "단계 보기", "手順を見る"]),
  title: localized([
    "IOTA 与更多项目，\n状态和收益一起看。",
    "IOTA 與更多專案，\n狀態與收益一起看。",
    "IOTA and more projects,\nstatus and rewards together.",
    "IOTA와 다양한 프로젝트의\n상태와 수익을 한곳에서.",
    "IOTAと他のプロジェクト\n状態と収益をまとめて。",
  ]),
  intro: localized([
    "以 IOTA Train at Home 为核心的多项目监控工具。查训练状态和记账收益，也可为同一台设备关联其他挖矿或算力项目。",
    "以 IOTA Train at Home 為核心的多專案監控工具。查看訓練狀態與記帳收益，也可為同一台設備關聯其他挖礦或算力專案。",
    "Multi-project monitoring built around IOTA Train at Home. Check reported training and recorded rewards, and link other mining or compute projects to the same device.",
    "IOTA Train at Home을 중심으로 여러 프로젝트를 모니터링하세요. 학습 상태와 기록된 보상을 확인하고 같은 기기에 다른 채굴·컴퓨팅 프로젝트도 연결할 수 있습니다.",
    "IOTA Train at Homeを中心とした複数プロジェクトの監視ツール。学習状態と記帳報酬を確認し、同じデバイスに他の採掘・計算プロジェクトも関連付けられます。",
  ]),
  metaDescription: localized([
    "用公开 Miner ID 集中查看多台 IOTA Train at Home Mac 的训练状态和记账收益，按设备整理多个挖矿项目；每个项目免费 5 台。",
    "用公開 Miner ID 集中查看多台 IOTA Train at Home Mac 的訓練狀態與記帳收益，按設備整理多個挖礦專案；每個專案免費 5 台。",
    "Monitor multiple IOTA Train at Home Macs with public Miner IDs. Check reported activity and accounted rewards, and organize mining projects by device.",
    "공개 Miner ID로 여러 IOTA Train at Home Mac의 학습 상태와 기록된 보상을 확인하고 기기별로 여러 채굴 프로젝트를 정리하세요.",
    "公開Miner IDで複数のIOTA Train at Home Macの学習状態と記帳報酬を確認し、デバイスごとに採掘プロジェクトを整理できます。",
  ]),
  metaTitle: localized([
    "多台 IOTA Train at Home 设备怎样看状态和收益？｜IOTA Watch",
    "多台 IOTA Train at Home 設備如何查看狀態與收益？｜IOTA Watch",
    "How to monitor multiple IOTA Train at Home devices | IOTA Watch",
    "여러 IOTA Train at Home 기기의 상태와 수익 확인 | IOTA Watch",
    "複数のIOTA Train at Homeデバイスの状態と収益を確認 | IOTA Watch",
  ]),
  questions: localized([
    "你想解决什么问题？",
    "你想解決什麼問題？",
    "What are you trying to check?",
    "어떤 정보를 확인하고 싶나요?",
    "何を確認したいですか？",
  ]),
  faq: localized([
    "开始前的几个问题",
    "開始前的幾個問題",
    "Before you start",
    "시작 전 확인 사항",
    "始める前の確認事項",
  ]),
  guidesTitle: localized([
    "挖矿和算力监控：设备、收益与问题排查",
    "挖礦與算力監控：設備、收益與問題排查",
    "Mining and compute monitoring: devices, rewards and troubleshooting",
    "채굴·컴퓨팅 모니터링: 기기, 수익과 문제 해결",
    "採掘・計算の監視：デバイス、収益、トラブル対処",
  ]),
  blogTitle: localized([
    "多设备挖矿监控与收益排查文章",
    "多設備挖礦監控與收益排查文章",
    "Multi-device mining monitoring and reward troubleshooting",
    "여러 채굴 기기 모니터링과 수익 문제 해결",
    "複数の採掘デバイスの監視と収益の確認",
  ]),
  guideIntro: localized([
    "按你遇到的问题选择教程：添加公开标识、整理多项目设备、核对收益周期，或排查刷新失败。",
    "依照你遇到的問題選擇教學：新增公開識別碼、整理多專案設備、核對收益週期，或排查更新失敗。",
    "Choose a guide for your question: adding public identifiers, organizing devices across projects, checking reward periods or investigating failed refreshes.",
    "공개 식별자 추가, 여러 프로젝트의 기기 정리, 보상 기간 확인, 새로고침 실패 등 필요한 안내를 선택하세요.",
    "公開IDの追加、複数プロジェクトの整理、報酬期間の確認、更新失敗の対処など、必要な案内を選べます。",
  ]),
};
const questions = [
  {
    id: "multiple",
    q: localized([
      "多台 Mac 跑 IOTA，在哪里一起看状态和收益？",
      "多台 Mac 執行 IOTA，在哪裡一起查看狀態與收益？",
      "Where can I check multiple Macs running IOTA together?",
      "IOTA를 실행하는 여러 Mac의 상태와 수익을 어디서 함께 확인하나요?",
      "IOTAを動かす複数のMacの状態と収益をまとめて確認できますか？",
    ]),
    a: localized([
      "在 IOTA Watch 添加每台 Mac 的公开 Miner ID，并填写设备名称，就能在同一页面查看官方上报状态、香港时间今日已记账收益和累计收益。适用于已有 IOTA Train at Home 设备、希望减少逐台查看的人。",
      "在 IOTA Watch 新增每台 Mac 的公開 Miner ID 與設備名稱，就能在同一頁查看官方回報狀態、香港時間今日已記帳收益及累計收益，適合已執行 IOTA Train at Home、希望集中查看多台機器的人。",
      "Add each Mac's public Miner ID and a device name in IOTA Watch to see reported activity, today's accounted rewards in Hong Kong time and lifetime rewards on one page. This suits people already running IOTA Train at Home who want to check several machines together.",
      "IOTA Watch에 각 Mac의 공개 Miner ID와 기기 이름을 추가하면 보고된 상태, 홍콩 시간 기준 오늘 기록된 보상과 누적 보상을 한 화면에서 볼 수 있습니다. 이미 IOTA Train at Home을 실행하며 여러 기기를 함께 확인하려는 사용자에게 적합합니다.",
      "各Macの公開Miner IDとデバイス名をIOTA Watchに追加すると、報告された状態、香港時間で本日記帳された報酬、累計報酬を同じ画面で確認できます。すでにIOTA Train at Homeを実行し、複数機器をまとめて確認したい方に適しています。",
    ]),
    path: "learn/mining-monitor-for-multiple-devices",
  },
  {
    id: "projects",
    q: localized([
      "同一台机器运行多个项目，怎样集中查看？",
      "同一台機器執行多個專案，如何集中查看？",
      "How can I track several projects on one machine?",
      "한 기기에서 여러 프로젝트를 실행하면 어떻게 모아 보나요?",
      "1台で複数のプロジェクトを動かす場合はどう確認しますか？",
    ]),
    a: localized([
      "先建立一张设备卡片，再手动关联这台机器的 IOTA、XID / MMM、fly.ai 或其他支持的项目标识。卡片保留各项目的状态和数据周期。XID 钱包余额和 fly.ai 月度积分属于钱包汇总，不计入设备今日收益；同名 Worker 不会自动合并。",
      "先建立一張設備卡片，再手動關聯這台機器的 IOTA、XID / MMM、fly.ai 或其他支援專案的識別碼。各專案保留自己的狀態與資料週期。XID 錢包餘額及 fly.ai 月度積分不計入設備今日收益，同名 Worker 也不會自動合併。",
      "Create one device card, then manually link its IOTA, XID / MMM, fly.ai or other supported identifiers. Each project keeps its own status and reporting period. XID wallet balance and fly.ai monthly points are wallet totals, excluded from device daily earnings. Matching Worker names are not merged automatically.",
      "기기 카드 하나를 만들고 IOTA, XID / MMM, fly.ai 등 지원 프로젝트의 식별자를 직접 연결하세요. 프로젝트마다 상태와 집계 기간을 유지합니다. XID 지갑 잔액과 fly.ai 월간 포인트는 기기 일일 수익에 합산하지 않으며 같은 Worker 이름도 자동 병합하지 않습니다.",
      "デバイスカードを作成し、IOTA、XID / MMM、fly.aiなど対応プロジェクトのIDを手動で紐付けます。各プロジェクトの状態と集計期間は別々に表示します。XIDのウォレット残高とfly.aiの月間ポイントは日次収益に合算せず、同名Workerも自動統合しません。",
    ]),
    path: "learn/monitor-one-device-across-projects",
  },
  {
    id: "choose",
    q: localized([
      "IOTA Watch 和官方面板，应该用哪个？",
      "IOTA Watch 與官方面板，應該使用哪個？",
      "When should I use IOTA Watch or an official dashboard?",
      "IOTA Watch와 공식 대시보드는 언제 사용하나요?",
      "IOTA Watchと公式ダッシュボードはどう使い分けますか？",
    ]),
    a: localized([
      "集中检查保存的设备标识、跨项目整理卡片和核对收益记录时，可用 IOTA Watch。安装矿工、启动或停止任务、检查本机日志、领取收益和修改官方账号设置，应使用对应项目的官方应用或面板。本站提供监控，不替代官方操作工具。",
      "集中檢查已儲存的設備識別碼、整理跨專案卡片及核對收益紀錄時，可使用 IOTA Watch。安裝礦工、啟停任務、檢查本機日誌、領取收益與修改官方帳戶設定，應使用對應專案的官方應用或面板。",
      "Use IOTA Watch to check saved identifiers together, organize cross-project device cards and inspect reward records. Use the relevant official app or dashboard to install miners, start or stop jobs, inspect local logs, claim rewards or change platform account settings.",
      "저장한 식별자를 함께 확인하고 여러 프로젝트의 기기를 정리하거나 보상 기록을 비교할 때 IOTA Watch를 사용할 수 있습니다. 채굴 프로그램 설치, 작업 시작·중지, 로컬 로그 확인, 보상 수령과 공식 계정 설정은 해당 프로젝트의 공식 앱이나 대시보드를 사용하세요.",
      "保存したIDの一括確認、複数プロジェクトのカード整理、報酬記録の確認にはIOTA Watchを使えます。マイナーの導入、ジョブの開始・停止、ローカルログの確認、報酬の受領、公式アカウントの設定には各プロジェクトの公式ツールを使用します。",
    ]),
    path: "learn/mining-dashboard-vs-official-dashboards",
  },
  {
    id: "rewards",
    q: localized([
      "不同项目的收益可以直接加在一起吗？",
      "不同專案的收益可以直接相加嗎？",
      "Can rewards from different projects be added together?",
      "서로 다른 프로젝트의 수익을 합산할 수 있나요?",
      "異なるプロジェクトの収益は合算できますか？",
    ]),
    a: localized([
      "需要先核对币种、统计周期和设备归属。IOTA 今日收益按香港时间记账；io.net 区块奖励按 UTC 日；Golem 为近 24 小时；fly.ai 为月度积分。不同代币、钱包余额和积分不直接相加。只有可归属设备且周期匹配的已知美元金额，才参与设备今日合计。",
      "需先核對幣種、統計週期與設備歸屬。IOTA 今日收益使用香港時間，io.net 區塊獎勵使用 UTC 日，Golem 為近 24 小時，fly.ai 為月度積分。不同代幣、錢包餘額和積分不直接相加；只有歸屬設備且週期相符的已知美元金額才計入今日合計。",
      "Check the currency, reporting period and device attribution first. IOTA uses the Hong Kong accounting day; io.net block rewards use a UTC day; Golem uses a rolling 24 hours; fly.ai reports monthly points. Different tokens, wallet balances and points are not added directly. Only known, device-level USD amounts with a matching daily period enter a device's daily total.",
      "먼저 통화, 집계 기간과 기기 귀속을 확인하세요. IOTA는 홍콩 기준 일일 정산, io.net 블록 보상은 UTC 날짜, Golem은 최근 24시간, fly.ai는 월간 포인트입니다. 다른 토큰·지갑 잔액·포인트는 직접 합산하지 않습니다. 같은 일일 기간에 해당하는 기기별 USD 금액만 오늘 합계에 포함합니다.",
      "通貨、集計期間、デバイスへの帰属を先に確認します。IOTAは香港時間の日次記帳、io.netのブロック報酬はUTC日、Golemは直近24時間、fly.aiは月間ポイントです。異なるトークン、残高、ポイントを直接合算せず、日次期間が一致する既知のデバイス単位のUSD額のみ本日の合計に含めます。",
    ]),
    path: "learn/compare-mining-rewards-across-projects",
  },
];
export const problemLinks = questions;
export function productQuestions(locale: SiteLocale) {
  return [
    ...questions.map((p) => ({ question: p.q[locale], answer: p.a[locale] })),
    {
      question: localized([
        "需要登录、连接钱包或付费吗？",
        "需要登入、連接錢包或付費嗎？",
        "Do I need an account, a wallet connection or a subscription?",
        "계정, 지갑 연결 또는 구독이 필요한가요?",
        "アカウント、ウォレット接続、購読は必要ですか？",
      ])[locale],
      answer: localized([
        `公开标识查询和本地设备清单可直接使用，无需私钥或助记词。Google 登录用于同步清单；每个项目免费 5 台，Pro 50 台，新订阅 US$${planAmount("month")}/月或 US$${planAmount("year")}/年。io.net 和 Vast.ai 的私有数据需要登录并连接相应的查询凭据，真实账户接入仍待进一步验证。`,
        `公開識別碼查詢與本地設備清單可直接使用，不需要私鑰或助記詞。Google 登入可同步清單；每個專案免費 5 台、Pro 50 台，新訂閱 US$${planAmount("month")}/月或 US$${planAmount("year")}/年。io.net 與 Vast.ai 私有資料需要登入及連接查詢憑證，真實帳戶接入仍待進一步驗證。`,
        `Public lookups and a local device list can be used without private keys or seed phrases. Google sign-in syncs your list. Free supports 5 devices per project; Pro supports 50, with new subscriptions at US$${planAmount("month")}/month or US$${planAmount("year")}/year. Private io.net and Vast.ai data requires sign-in and platform read credentials; real-account integration still needs further verification.`,
        `공개 조회와 로컬 기기 목록은 개인 키나 시드 문구 없이 사용할 수 있습니다. Google 로그인으로 목록을 동기화합니다. 프로젝트당 무료 5대, Pro 50대이며 새 구독은 월 US$${planAmount("month")} 또는 연 US$${planAmount("year")}입니다. io.net·Vast.ai 비공개 데이터는 로그인과 플랫폼 조회 인증 정보가 필요하며 실제 계정 연동은 추가 검증이 필요합니다.`,
        `公開IDの照会とローカルのデバイス一覧は秘密鍵やシードフレーズなしで使えます。Googleログインで一覧を同期できます。無料は各プロジェクト5台、Proは50台で、新規購読は月US$${planAmount("month")}または年US$${planAmount("year")}です。io.net・Vast.aiの非公開データにはログインと照会用認証情報が必要で、実アカウントでの検証は今後追加する必要があります。`,
      ])[locale],
    },
    {
      question: localized([
        "支持哪些项目？没找到我的项目怎么办？",
        "支援哪些專案？找不到我的專案怎麼辦？",
        "Which projects are supported, and can I request another?",
        "지원하는 프로젝트와 추가 요청 방법은 무엇인가요?",
        "対応プロジェクトと追加申請の方法は？",
      ])[locale],
      answer: localized([
        "项目入口包括 IOTA Train at Home、XID / MMM、Quantus、fly.ai、Nosana、Gonka、Akash、io.net、Vast.ai 和 Golem，各自只展示接口实际提供的指标。io.net 与 Vast.ai 需要账户授权，真实账户接入仍待验证。未列出的项目可以登录后通过页面底部的「申请接入项目」提交，每个账号每天一次。",
        "專案入口包括 IOTA Train at Home、XID / MMM、Quantus、fly.ai、Nosana、Gonka、Akash、io.net、Vast.ai 與 Golem，各自僅展示介面實際提供的指標。io.net 與 Vast.ai 需要帳戶授權，真實帳戶接入仍待驗證。未列出的專案可登入後透過頁面底部申請，每個帳號每天一次。",
        "Project pages cover IOTA Train at Home, XID / MMM, Quantus, fly.ai, Nosana, Gonka, Akash, io.net, Vast.ai and Golem, with only the metrics provided by each source. io.net and Vast.ai require account authorization and real-account integration remains under verification. Sign in to request an unlisted project using the page footer, once per account per day.",
        "IOTA Train at Home, XID / MMM, Quantus, fly.ai, Nosana, Gonka, Akash, io.net, Vast.ai와 Golem 화면에서 출처가 제공하는 지표를 조회할 수 있습니다. io.net·Vast.ai는 계정 인증이 필요하고 실제 계정 연동은 추가 검증 중입니다. 목록에 없는 프로젝트는 로그인 후 하단에서 계정당 하루 한 번 요청할 수 있습니다.",
        "IOTA Train at Home、XID / MMM、Quantus、fly.ai、Nosana、Gonka、Akash、io.net、Vast.ai、Golemの各画面で、出典が提供する指標を表示します。io.net・Vast.aiは認証が必要で実アカウントの検証は継続中です。一覧にないプロジェクトはログイン後、ページ下部から1日1回申請できます。",
      ])[locale],
    },
    {
      question: localized([
        "显示旧数据或零收益，设备一定有问题吗？",
        "顯示舊資料或零收益，設備一定有問題嗎？",
        "Does old data or zero rewards mean my device has failed?",
        "이전 데이터나 수익 0이면 기기에 문제가 있나요?",
        "古いデータや報酬ゼロは故障を意味しますか？",
      ])[locale],
      answer: localized([
        "先看最近成功读取时间和来源。刷新失败会保留上次结果，缺失字段不会填成零。IOTA 有效的今日记账为零可能代表尚无符合统计口径的记录；旧采样和零吞吐量不能单独证明设备离线。需要检查运行日志时，应回到本机的官方应用。",
        "先查看最近成功讀取時間和來源。更新失敗會保留上次結果，缺失欄位不會填成零。有效的今日記帳為零可能代表尚無符合口徑的紀錄；舊採樣與零吞吐量不能單獨證明設備離線。檢查日誌時應回到本機的官方應用。",
        "Check the last successful fetch time and source first. Failed refreshes preserve previous results; missing fields are not filled with zero. A valid IOTA daily total of zero may mean no matching accounted records yet. Old samples and zero throughput alone do not prove that a device is offline. Inspect runtime logs in the official app on that machine.",
        "최근 성공한 조회 시각과 출처를 먼저 확인하세요. 갱신 실패 시 이전 결과를 보존하고 누락된 값을 0으로 채우지 않습니다. 유효한 IOTA 일일 합계 0은 해당 기록이 아직 없다는 뜻일 수 있습니다. 오래된 표본이나 처리량 0만으로 오프라인을 판단할 수 없으며 실행 로그는 해당 기기의 공식 앱에서 확인해야 합니다.",
        "まず最終取得時刻と出典を確認します。更新失敗時は前回の結果を保持し、欠損をゼロで埋めません。有効なIOTAの日次合計ゼロは対象の記帳記録がまだない場合もあります。古いサンプルや処理量ゼロだけでオフラインとは判断できず、動作ログは実機の公式アプリで確認します。",
      ])[locale],
    },
  ];
}
export function projectDiscoveryQuestions(
  name: string,
  locale: SiteLocale,
  identity: string,
  coverage: string,
) {
  return [
    {
      question: localized([
        `怎样用 IOTA Watch 查看 ${name} 数据？`,
        `如何使用 IOTA Watch 查看 ${name} 資料？`,
        `How do I check ${name} data in IOTA Watch?`,
        `IOTA Watch에서 ${name} 데이터를 어떻게 확인하나요?`,
        `IOTA Watchで${name}のデータを確認するには？`,
      ])[locale],
      answer: identity,
    },
    {
      question: localized([
        `${name} 的哪些状态和收益能查到？`,
        `${name} 的哪些狀態與收益可以查詢？`,
        `Which ${name} activity and reward records are available?`,
        `${name}의 어떤 상태와 보상을 조회할 수 있나요?`,
        `${name}のどの状態・報酬を確認できますか？`,
      ])[locale],
      answer: coverage,
    },
    {
      question: localized([
        `怎样保存多个 ${name} 标识，方便以后查看？`,
        `如何儲存多個 ${name} 識別碼，方便日後查看？`,
        `How can I save several ${name} identifiers for later?`,
        `${name} 식별자 여러 개를 저장하려면 어떻게 하나요?`,
        `${name}の複数のIDを保存するには？`,
      ])[locale],
      answer: localized([
        "在设备总览添加设备并关联项目标识；名称用于整理清单，标识对应的数据范围仍按原项目保留。未登录时保存于当前浏览器，Google 登录后可同步清单。免费版每个项目 5 台，Pro 每个项目 50 台。",
        "在設備總覽新增設備並關聯專案識別碼；名稱只用於整理清單，資料範圍仍依原專案保留。未登入時儲存在目前瀏覽器，Google 登入後可同步清單。免費版每個專案 5 台，Pro 每個專案 50 台。",
        "Add a device and link the project identifier in Devices. Names organize the list; each identifier keeps its original project-level or device-level scope. Lists stay in the current browser without sign-in and can sync with Google sign-in. Free supports 5 devices per project and Pro supports 50.",
        "기기 목록에 기기를 추가하고 프로젝트 식별자를 연결하세요. 이름은 정리용이며 각 식별자의 프로젝트·기기 단위 범위를 유지합니다. 비로그인 목록은 현재 브라우저에 저장되고 Google 로그인 후 동기화할 수 있습니다. 프로젝트당 무료 5대, Pro 50대입니다.",
        "デバイスを追加してプロジェクトのIDを紐付けます。名前は整理用で、各IDのプロジェクト・デバイス単位の範囲は維持します。未ログイン時は現在のブラウザに保存し、Googleログインで同期できます。無料は各プロジェクト5台、Proは50台です。",
      ])[locale],
    },
  ];
}
