import type { SiteLocale } from "@/lib/site";

type ProjectFaqCopy = { intro: string; questions: Array<[string, string]> };

/** Native project boundaries shared by visible FAQ and structured answers. */
export const projectFaq: Record<SiteLocale, ProjectFaqCopy> = {
  zh: {
    intro:
      "先确认项目、公开地址和数据范围。IOTA、XID、Quantus 与 fly.ai 的数据来源和收益口径分别展示。",
    questions: [
      [
        "这是 IOTA 公链或官方钱包吗？",
        "不是。IOTA Watch 是独立的只读监控工具，主要监控 Macrocosmos IOTA Train at Home（Bittensor SN9），另有 XID / MMM、Quantus 和 fly.ai 入口。它不是 IOTA Foundation 公链、Firefly 或任何项目的官方钱包。",
      ],
      [
        "IOTA Watch 支持哪些项目？",
        "IOTA 页面查看 Train at Home 的设备状态和记账收益；XID 页面查看 xCoin / MMM 的矿池 Worker、算力和浏览器余额；Quantus 页面查看主网区块与公开地址的出块奖励；fly.ai 页面查看月度公开钱包积分。fly.ai 积分不代表设备今日现金收益。",
      ],
      [
        "各项目要填同一种地址吗？",
        "不用。IOTA 使用公开 Miner ID / SS58 hotkey；XID 使用通过校验的 xpa1r 主网收益地址；Quantus 使用挖矿的 Wormhole 公开地址；fly.ai 使用 0x 开头的公开收益钱包地址。无需提供私钥、助记词或 inner hash。",
      ],
      [
        "各项目清单能用 Google 同步吗？",
        "可以。在设备总览登录 Google 后，可以同步 IOTA、XID、Quantus 和 fly.ai 的设备及关联项目。免费版每个项目 5 台，Pro 每个项目 50 台，设备总览没有额外总数限制。未登录时清单只保存在当前浏览器。",
      ],
      [
        "Quantus 出块奖励能代表所有矿池付款吗？",
        "不能。本站读取主网矿工出块奖励索引，不是矿池向参与者转账的完整账本。使用矿池时，还要在官方浏览器核对个人地址的转账记录；没有近期出块奖励不能证明设备离线。",
      ],
    ],
  },
  "zh-TW": {
    intro:
      "先確認專案、公開地址與資料範圍。IOTA、XID、Quantus 與 fly.ai 的資料來源和收益方式分別呈現。",
    questions: [
      [
        "這是 IOTA 公鏈或官方錢包嗎？",
        "不是。IOTA Watch 是獨立的唯讀監控工具，主要監控 Macrocosmos IOTA Train at Home（Bittensor SN9），另有 XID / MMM、Quantus 與 fly.ai 入口。它不是 IOTA Foundation 公鏈、Firefly 或任何專案的官方錢包。",
      ],
      [
        "IOTA Watch 支援哪些專案？",
        "IOTA 頁面查看 Train at Home 的設備狀態與記帳收益；XID 頁面查看 xCoin / MMM 的礦池 Worker、算力與瀏覽器餘額；Quantus 頁面查看主網區塊與公開地址的出塊獎勵；fly.ai 頁面查看月度公開錢包積分。fly.ai 積分不代表設備今日現金收益。",
      ],
      [
        "各專案要填同一種地址嗎？",
        "不用。IOTA 使用公開 Miner ID / SS58 hotkey；XID 使用通過校驗的 xpa1r 主網收益地址；Quantus 使用挖礦的 Wormhole 公開地址；fly.ai 使用 0x 開頭的公開收益錢包地址。無需提供私鑰、助記詞或 inner hash。",
      ],
      [
        "各專案清單能透過 Google 同步嗎？",
        "可以。在設備總覽登入 Google 後，可同步 IOTA、XID、Quantus 和 fly.ai 的設備及關聯專案。免費版每個專案 5 台，Pro 每個專案 50 台，設備總覽沒有額外總數限制。未登入時清單只儲存在目前瀏覽器。",
      ],
      [
        "Quantus 出塊獎勵能代表所有礦池付款嗎？",
        "不能。本站讀取主網礦工出塊獎勵索引，不是礦池向參與者轉帳的完整帳本。使用礦池時，仍須在官方瀏覽器核對個人地址的轉帳紀錄；沒有近期出塊獎勵不能證明設備離線。",
      ],
    ],
  },
  en: {
    intro:
      "Check each project’s public identifier and data coverage. IOTA, XID, Quantus and fly.ai use separate sources and reward measures.",
    questions: [
      [
        "Is this IOTA Layer 1 or an official wallet?",
        "No. IOTA Watch is an independent, read-only monitor, primarily for Macrocosmos IOTA Train at Home (Bittensor SN9), with separate XID / MMM, Quantus and fly.ai pages. It is not IOTA Foundation Layer 1, Firefly or an official wallet for any of these projects.",
      ],
      [
        "Which projects does IOTA Watch support?",
        "IOTA shows Train at Home device activity and accounted rewards. XID shows xCoin / MMM pool workers, hashrate and explorer balance. Quantus shows mainnet blocks and indexed block rewards. fly.ai shows monthly public wallet points, which are not device-level daily cash earnings.",
      ],
      [
        "Do all projects use the same address?",
        "No. IOTA uses a public Miner ID / SS58 hotkey; XID uses a checksum-valid xpa1r mainnet payout address; Quantus uses the public Wormhole mining address; fly.ai uses a public payout wallet address beginning with 0x. Private keys, seed phrases and inner hashes are not required.",
      ],
      [
        "Do project lists sync through Google?",
        "Yes. Sign in with Google in the device overview to sync devices and linked IOTA, XID, Quantus and fly.ai projects. Free supports 5 devices per project; Pro supports 50 per project. The overview has no additional total device limit. Signed-out lists remain in the current browser only.",
      ],
      [
        "Do Quantus block rewards cover all pool payments?",
        "No. This monitor reads the mainnet miner block-reward index, not the pool’s complete participant payment ledger. Pool users should also check transfers to their personal address in the official explorer. No recent block rewards does not establish that a device is offline.",
      ],
    ],
  },
  ko: {
    intro:
      "프로젝트별 공개 식별자와 데이터 범위를 확인하세요. IOTA, XID, Quantus, fly.ai는 출처와 보상 집계 방식이 다릅니다.",
    questions: [
      [
        "IOTA 레이어 1이나 공식 지갑인가요?",
        "아니요. IOTA Watch는 Macrocosmos IOTA Train at Home(Bittensor SN9)을 주로 조회하는 독립적인 읽기 전용 모니터이며 XID / MMM, Quantus 및 fly.ai 페이지도 제공합니다. IOTA Foundation 레이어 1, Firefly 또는 각 프로젝트의 공식 지갑이 아닙니다.",
      ],
      [
        "어떤 프로젝트를 지원하나요?",
        "IOTA는 Train at Home 기기 상태와 기록 보상을, XID는 xCoin / MMM 풀 워커·해시레이트·탐색기 잔액을 표시합니다. Quantus는 메인넷 블록과 색인된 블록 보상을 조회합니다. fly.ai는 공개 지갑의 월별 포인트를 표시하며, 이 포인트는 기기의 오늘 현금 수익을 의미하지 않습니다.",
      ],
      [
        "모든 프로젝트에 같은 주소를 입력하나요?",
        "아니요. IOTA는 공개 Miner ID / SS58 hotkey, XID는 체크섬이 유효한 xpa1r 메인넷 보상 주소, Quantus는 채굴용 Wormhole 공개 주소, fly.ai는 0x로 시작하는 공개 보상 지갑 주소를 사용합니다. 개인 키, 시드 문구, inner hash는 필요하지 않습니다.",
      ],
      [
        "프로젝트 목록을 Google로 동기화할 수 있나요?",
        "네. 기기 개요에서 Google로 로그인하면 기기와 연결된 IOTA, XID, Quantus, fly.ai 프로젝트를 동기화할 수 있습니다. 무료는 프로젝트당 5대, Pro는 프로젝트당 50대이며 개요에 별도의 전체 기기 수 제한은 없습니다. 로그인하지 않은 목록은 현재 브라우저에만 저장됩니다.",
      ],
      [
        "Quantus 블록 보상이 모든 풀 지급을 포함하나요?",
        "아니요. 이 모니터는 메인넷 채굴자의 블록 보상 색인을 읽으며 풀의 전체 참여자 지급 장부는 아닙니다. 풀 사용자는 공식 탐색기에서 개인 주소로 들어온 이체도 확인해야 합니다. 최근 블록 보상이 없다고 기기가 오프라인인 것은 아닙니다.",
      ],
    ],
  },
  ja: {
    intro:
      "各プロジェクトの公開IDとデータ範囲を確認してください。IOTA、XID、Quantus、fly.aiは出典と報酬の集計方法が異なります。",
    questions: [
      [
        "IOTAレイヤー1や公式ウォレットですか？",
        "いいえ。IOTA Watchは主にMacrocosmos IOTA Train at Home（Bittensor SN9）を確認する独立した読み取り専用モニターで、XID / MMM、Quantus、fly.aiの専用ページもあります。IOTA Foundationレイヤー1、Firefly、各プロジェクトの公式ウォレットではありません。",
      ],
      [
        "どのプロジェクトに対応していますか？",
        "IOTAはTrain at Homeのデバイス状態と記帳報酬、XIDはxCoin / MMMのプールワーカー、ハッシュレート、エクスプローラー残高を表示します。Quantusはメインネットのブロックと索引済みブロック報酬、fly.aiは公開ウォレットの月次ポイントを表示します。fly.aiのポイントはデバイスの今日の現金収益ではありません。",
      ],
      [
        "各プロジェクトで同じアドレスを使いますか？",
        "いいえ。IOTAは公開Miner ID / SS58 hotkey、XIDはチェックサムが有効なxpa1rメインネット報酬アドレス、Quantusは採掘用のWormhole公開アドレス、fly.aiは0xで始まる公開報酬ウォレットアドレスを使います。秘密鍵、シードフレーズ、inner hashは不要です。",
      ],
      [
        "各プロジェクトの一覧をGoogleで同期できますか？",
        "はい。デバイス一覧でGoogleにログインすると、デバイスと関連付けたIOTA、XID、Quantus、fly.aiを同期できます。無料は各プロジェクト5台、Proは各50台で、一覧に別途の合計台数制限はありません。未ログインの一覧は現在のブラウザーにのみ保存されます。",
      ],
      [
        "Quantusのブロック報酬には全プール支払いが含まれますか？",
        "いいえ。このモニターはメインネットのマイナーブロック報酬索引を読み、プールの参加者向け支払い台帳全体ではありません。プール利用時は公式エクスプローラーで個人アドレスへの送金も確認してください。最近のブロック報酬がないことはオフラインの証明にはなりません。",
      ],
    ],
  },
};
