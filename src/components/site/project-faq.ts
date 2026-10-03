import type { SiteLocale } from "@/lib/site";

type ProjectFaqCopy = { intro: string; questions: Array<[string, string]> };

/** Native project boundaries shared by visible FAQ and structured answers. */
export const projectFaq: Record<SiteLocale, ProjectFaqCopy> = {
  zh: {
    intro:
      "先确认项目、公开地址和数据范围。带 IOTA 标记的问题适用于 Train at Home，XID 和 Quantus 的记录分别查看。",
    questions: [
      [
        "这是 IOTA 公链或官方钱包吗？",
        "不是。IOTA Watch 是独立的只读监控工具，主要监控 Macrocosmos IOTA Train at Home（Bittensor SN9），另有 XID / MMM 和 Quantus 入口。它不是 IOTA Foundation 公链、Firefly 或任何项目的官方钱包。",
      ],
      [
        "IOTA Watch 支持哪些项目？",
        "IOTA 页面查看 Train at Home 的设备状态和记账收益；XID 页面查看 xCoin / MMM 的矿池 Worker、算力和浏览器余额；Quantus 页面查看主网区块与公开地址的出块奖励。三种项目、币种与统计口径分别展示。",
      ],
      [
        "三个项目要填同一种地址吗？",
        "不用。IOTA 使用设备的公开 Miner ID / SS58 hotkey；XID 使用通过校验的 xpa1r 主网收益地址；Quantus 使用实际挖矿的 Wormhole 公开 Address。私钥、助记词和 inner hash 都不用于网页查询。",
      ],
      [
        "XID 和 Quantus 清单能用 Google 同步吗？",
        "目前不能。Google 同步用于 IOTA 设备清单，每个账号最多 10 台；未登录 IOTA 最多 3 台。XID 和 Quantus 各最多保存 10 个公开地址，独立存于当前浏览器。",
      ],
      [
        "Quantus 出块奖励能代表所有矿池付款吗？",
        "不能。本站读取主网矿工出块奖励索引，不是矿池向参与者转账的完整账本。使用矿池时，还要在官方浏览器核对个人地址的转账记录；没有近期出块奖励不能证明设备离线。",
      ],
    ],
  },
  "zh-TW": {
    intro:
      "先確認專案、公開地址與資料範圍。標示 IOTA 的問題適用於 Train at Home，XID 與 Quantus 的紀錄分別查看。",
    questions: [
      [
        "這是 IOTA 公鏈或官方錢包嗎？",
        "不是。IOTA Watch 是獨立的唯讀監控工具，主要監控 Macrocosmos IOTA Train at Home（Bittensor SN9），另有 XID / MMM 與 Quantus 入口。它不是 IOTA Foundation 公鏈、Firefly 或任何專案的官方錢包。",
      ],
      [
        "IOTA Watch 支援哪些專案？",
        "IOTA 頁面查看 Train at Home 的設備狀態與記帳收益；XID 頁面查看 xCoin / MMM 的礦池 Worker、算力與瀏覽器餘額；Quantus 頁面查看主網區塊與公開地址的出塊獎勵。三個專案、幣種與統計方式分別呈現。",
      ],
      [
        "三個專案要填同一種地址嗎？",
        "不用。IOTA 使用設備的公開 Miner ID / SS58 hotkey；XID 使用通過校驗的 xpa1r 主網收益地址；Quantus 使用實際挖礦的 Wormhole 公開 Address。私鑰、助記詞與 inner hash 都不需要提供給網頁。",
      ],
      [
        "XID 與 Quantus 清單能透過 Google 同步嗎？",
        "目前不能。Google 同步用於 IOTA 設備清單，每個帳號最多 10 台；未登入 IOTA 最多 3 台。XID 與 Quantus 各最多儲存 10 個公開地址，獨立保存在目前瀏覽器。",
      ],
      [
        "Quantus 出塊獎勵能代表所有礦池付款嗎？",
        "不能。本站讀取主網礦工出塊獎勵索引，不是礦池向參與者轉帳的完整帳本。使用礦池時，仍須在官方瀏覽器核對個人地址的轉帳紀錄；沒有近期出塊獎勵不能證明設備離線。",
      ],
    ],
  },
  en: {
    intro:
      "Check the project, public identifier and data coverage first. Questions labeled IOTA apply to Train at Home; XID and Quantus records stay separate.",
    questions: [
      [
        "Is this IOTA Layer 1 or an official wallet?",
        "No. IOTA Watch is an independent, read-only monitor, primarily for Macrocosmos IOTA Train at Home (Bittensor SN9), with separate XID / MMM and Quantus pages. It is not IOTA Foundation Layer 1, Firefly or an official wallet for any of these projects.",
      ],
      [
        "Which projects does IOTA Watch support?",
        "IOTA pages show Train at Home device activity and accounted rewards. XID pages show xCoin / MMM pool workers, hashrate and explorer balance. Quantus pages show mainnet blocks and indexed block rewards for public addresses. Projects, currencies and accounting measures remain separate.",
      ],
      [
        "Do all three projects use the same address?",
        "No. IOTA uses the device’s public Miner ID / SS58 hotkey; XID uses a checksum-valid xpa1r mainnet payout address; Quantus uses the public Wormhole Address actually used for mining. Private keys, seed phrases and inner hashes are not needed by this website.",
      ],
      [
        "Do XID and Quantus lists sync through Google?",
        "Not currently. Google synchronization applies to IOTA lists, with up to 10 devices per account or 3 without signing in. XID and Quantus each keep up to 10 public addresses separately in the current browser.",
      ],
      [
        "Do Quantus block rewards cover all pool payments?",
        "No. This monitor reads the mainnet miner block-reward index, not the pool’s complete participant payment ledger. Pool users should also check transfers to their personal address in the official explorer. No recent block rewards does not establish that a device is offline.",
      ],
    ],
  },
  ko: {
    intro:
      "프로젝트, 공개 식별자와 데이터 범위를 먼저 확인하세요. IOTA로 표시된 질문은 Train at Home에 해당하며 XID와 Quantus 기록은 별도로 조회합니다.",
    questions: [
      [
        "IOTA 레이어 1이나 공식 지갑인가요?",
        "아니요. IOTA Watch는 Macrocosmos IOTA Train at Home(Bittensor SN9)을 주로 조회하는 독립적인 읽기 전용 모니터이며 XID / MMM 및 Quantus 페이지도 제공합니다. IOTA Foundation 레이어 1, Firefly 또는 각 프로젝트의 공식 지갑이 아닙니다.",
      ],
      [
        "어떤 프로젝트를 지원하나요?",
        "IOTA 페이지는 Train at Home 기기 상태와 기록 보상을, XID 페이지는 xCoin / MMM 풀 워커·해시레이트·탐색기 잔액을 표시합니다. Quantus 페이지는 메인넷 블록과 공개 주소의 색인된 블록 보상을 조회합니다. 프로젝트, 통화와 집계 방식은 각각 구분합니다.",
      ],
      [
        "세 프로젝트에 같은 주소를 입력하나요?",
        "아니요. IOTA는 기기의 공개 Miner ID / SS58 hotkey, XID는 체크섬이 유효한 xpa1r 메인넷 보상 주소, Quantus는 실제 채굴에 사용하는 Wormhole 공개 Address를 사용합니다. 개인 키, 시드 문구와 inner hash는 웹 조회에 필요하지 않습니다.",
      ],
      [
        "XID와 Quantus 목록도 Google로 동기화되나요?",
        "현재는 아닙니다. Google 동기화는 계정당 최대 10대의 IOTA 기기 목록에 적용되며 비로그인 목록은 최대 3대입니다. XID와 Quantus는 각각 최대 10개의 공개 주소를 현재 브라우저에 별도로 저장합니다.",
      ],
      [
        "Quantus 블록 보상이 모든 풀 지급을 포함하나요?",
        "아니요. 이 모니터는 메인넷 채굴자의 블록 보상 색인을 읽으며 풀의 전체 참여자 지급 장부는 아닙니다. 풀 사용자는 공식 탐색기에서 개인 주소로 들어온 이체도 확인해야 합니다. 최근 블록 보상이 없다고 기기가 오프라인인 것은 아닙니다.",
      ],
    ],
  },
  ja: {
    intro:
      "まずプロジェクト、公開ID、データ範囲を確認してください。IOTAと表示した質問はTrain at Home向けで、XIDとQuantusの記録は別々に確認します。",
    questions: [
      [
        "IOTAレイヤー1や公式ウォレットですか？",
        "いいえ。IOTA Watchは主にMacrocosmos IOTA Train at Home（Bittensor SN9）を確認する独立した読み取り専用モニターで、XID / MMMとQuantusの専用ページもあります。IOTA Foundationレイヤー1、Firefly、各プロジェクトの公式ウォレットではありません。",
      ],
      [
        "どのプロジェクトに対応していますか？",
        "IOTAページではTrain at Homeのデバイス状態と記帳報酬、XIDページではxCoin / MMMのプールワーカー、ハッシュレート、エクスプローラー残高を表示します。Quantusページではメインネットのブロックと公開アドレスの索引済みブロック報酬を確認します。通貨と集計方法は個別です。",
      ],
      [
        "3つとも同じアドレスを使いますか？",
        "いいえ。IOTAはデバイスの公開Miner ID / SS58 hotkey、XIDはチェックサムが有効なxpa1rメインネット報酬アドレス、Quantusは実際の採掘で使うWormhole公開Addressです。秘密鍵、シードフレーズ、inner hashはサイトの照会に不要です。",
      ],
      [
        "XIDやQuantusの一覧もGoogleで同期できますか？",
        "現在はできません。Google同期はIOTAのデバイス一覧に対応し、アカウントごとに最大10台、未ログインでは最大3台です。XIDとQuantusはそれぞれ最大10個の公開アドレスを現在のブラウザーに別々に保存します。",
      ],
      [
        "Quantusのブロック報酬には全プール支払いが含まれますか？",
        "いいえ。このモニターはメインネットのマイナーブロック報酬索引を読み、プールの参加者向け支払い台帳全体ではありません。プール利用時は公式エクスプローラーで個人アドレスへの送金も確認してください。最近のブロック報酬がないことはオフラインの証明にはなりません。",
      ],
    ],
  },
};
