import { projectDiscoveryQuestions } from "@/lib/product-discovery";
import { PROJECTS } from "@/lib/projects";
import { platformEditorial } from "./platform-copy";
import type { SiteLocale } from "@/lib/site";
import type { ProjectId } from "@/lib/projects";
const labels = {
  gpu: { zh: "GPU 算力", en: "GPU compute", "zh-TW": "GPU 算力", ko: "GPU 컴퓨팅", ja: "GPU計算" },
  inference: { zh: "AI 推理", en: "AI inference", "zh-TW": "AI 推理", ko: "AI 추론", ja: "AI推論" },
  about: {
    zh: "项目与数据说明",
    en: "About this project",
    "zh-TW": "專案與資料說明",
    ko: "프로젝트 및 데이터 안내",
    ja: "プロジェクトとデータ",
  },
  identityQ: {
    zh: "应该填写哪个公开标识？",
    en: "Which public identifier should I use?",
    "zh-TW": "應填寫哪個公開識別碼？",
    ko: "어떤 공개 식별자를 입력하나요?",
    ja: "どの公開IDを入力しますか？",
  },
  coverageQ: {
    zh: "这些数据能说明什么？",
    en: "What do these figures measure?",
    "zh-TW": "這些資料能說明什麼？",
    ko: "이 데이터는 무엇을 의미하나요?",
    ja: "このデータは何を表しますか？",
  },
  guide: {
    zh: "监控指南",
    en: "Monitoring guide",
    "zh-TW": "監控指南",
    ko: "모니터링 가이드",
    ja: "監視ガイド",
  },
  running: {
    zh: "运行中任务",
    en: "Running jobs",
    "zh-TW": "執行中任務",
    ko: "실행 중 작업",
    ja: "実行中のジョブ",
  },
  completed: {
    zh: "已完成任务",
    en: "Completed jobs",
    "zh-TW": "已完成任務",
    ko: "완료된 작업",
    ja: "完了したジョブ",
  },
  participants: {
    zh: "轮次参与者",
    en: "Epoch participants",
    "zh-TW": "輪次參與者",
    ko: "에포크 참여자",
    ja: "エポック参加者",
  },
  epoch: {
    zh: "当前轮次",
    en: "Current epoch",
    "zh-TW": "目前輪次",
    ko: "현재 에포크",
    ja: "現在のエポック",
  },
  weight: {
    zh: "轮次权重",
    en: "Epoch weight",
    "zh-TW": "輪次權重",
    ko: "에포크 가중치",
    ja: "エポックの重み",
  },
  models: {
    zh: "模型",
    en: "Models",
    "zh-TW": "模型",
    ko: "모델",
    ja: "モデル",
  },
  lookup: {
    zh: "查询",
    en: "Look up",
    "zh-TW": "查詢",
    ko: "조회",
    ja: "照会",
  },
  notListed: {
    zh: "当前轮次未列出此地址",
    en: "Not listed in the current epoch",
    "zh-TW": "目前輪次未列出此地址",
    ko: "현재 에포크에 없는 주소",
    ja: "現在のエポックに記載なし",
  },
  participating: {
    zh: "本轮参与",
    en: "In this epoch",
    "zh-TW": "本輪參與",
    ko: "이번 에포크 참여",
    ja: "今期参加",
  },
  computing: {
    zh: "任务运行中",
    en: "Running jobs",
    "zh-TW": "任務執行中",
    ko: "작업 실행 중",
    ja: "ジョブ実行中",
  },
  noJobs: {
    zh: "无运行中任务",
    en: "No running jobs",
    "zh-TW": "無執行中任務",
    ko: "실행 중 작업 없음",
    ja: "実行中ジョブなし",
  },
  nodeId: {
    zh: "节点公开地址",
    en: "Public node address",
    "zh-TW": "節點公開地址",
    ko: "공개 노드 주소",
    ja: "公開ノードアドレス",
  },
  hostId: {
    zh: "Host 公开地址",
    en: "Public Host address",
    "zh-TW": "Host 公開地址",
    ko: "공개 Host 주소",
    ja: "公開Hostアドレス",
  },
  noDaily: {
    zh: "该接口不提供设备今日收益",
    en: "This source does not provide device daily earnings",
    "zh-TW": "此介面不提供設備今日收益",
    ko: "이 API는 기기 일일 수익을 제공하지 않습니다",
    ja: "このAPIはデバイスの日次収益を提供しません",
  },
  lookupHint: {
    zh: "仅查询公开数据，不会启动任务。",
    en: "Reads public data; does not start jobs.",
    "zh-TW": "僅查詢公開資料，不會啟動任務。",
    ko: "공개 데이터 조회이며 작업을 시작하지 않습니다.",
    ja: "公開データの照会です。ジョブは起動しません。",
  },
  networkScope: {
    zh: "任务记录不等于物理设备数量。",
    en: "Job records are not a physical device count.",
    "zh-TW": "任務紀錄不等於實體設備數量。",
    ko: "작업 기록은 물리적 기기 수가 아닙니다.",
    ja: "ジョブ記録は物理デバイス数ではありません。",
  },
} as const;
export const projectEditorial = {
  ...platformEditorial,
  iota: {
    title: {
      zh: "IOTA Train at Home 监控：Miner ID、训练状态与收益",
      en: "IOTA Train at Home monitor: Miner ID, training and rewards",
      "zh-TW": "IOTA Train at Home 監控：Miner ID、訓練狀態與收益",
      ko: "IOTA Train at Home 모니터: Miner ID, 학습과 보상",
      ja: "IOTA Train at Home監視：Miner ID・学習状態・報酬",
    },
    summary: {
      zh: "监控 Macrocosmos IOTA Train at Home 的训练贡献、今日记账收益和累计收益。",
      en: "Monitor Macrocosmos IOTA Train at Home training contribution, daily recorded rewards and lifetime rewards.",
      "zh-TW": "監控 Macrocosmos IOTA Train at Home 的訓練貢獻、今日記帳收益與累計收益。",
      ko: "Macrocosmos IOTA Train at Home의 학습 기여, 오늘 기록 보상과 누적 보상을 확인합니다.",
      ja: "Macrocosmos IOTA Train at Homeの学習貢献、当日の記帳報酬、累計報酬を確認します。",
    },
    identity: {
      zh: "填写官方 Miner 页的完整 Miner ID（SS58 hotkey），不是钱包助记词或收益地址。",
      en: "Use the full Miner ID (SS58 hotkey) from the official Miner screen, not a seed phrase or payout address.",
      "zh-TW": "填寫官方 Miner 頁面的完整 Miner ID（SS58 hotkey），不是錢包助記詞或收益地址。",
      ko: "공식 Miner 화면의 전체 Miner ID(SS58 hotkey)를 입력합니다. 시드 문구나 보상 주소가 아닙니다.",
      ja: "公式Miner画面の完全なMiner ID（SS58 hotkey）を使います。シードフレーズや報酬アドレスではありません。",
    },
    coverage: {
      zh: "这里的 IOTA 是 Bittensor SN9 子网代币，不是 IOTA Layer 1。今日从香港时间零点计；美元为市场估值；官方采样不等于设备实时心跳。",
      en: "IOTA here is Bittensor SN9 alpha, not IOTA Layer 1. Daily rewards use Hong Kong midnight; USD is a market estimate and reported samples are not live device heartbeats.",
      "zh-TW":
        "此處 IOTA 是 Bittensor SN9 子網代幣，不是 IOTA Layer 1。今日從香港時間零時計；美元為市場估值，官方採樣不等於設備即時心跳。",
      ko: "여기서 IOTA는 IOTA Layer 1이 아닌 Bittensor SN9 알파입니다. 일일 보상은 홍콩 자정 기준이고 USD는 시장 추정치이며 공식 표본은 기기 실시간 연결 확인이 아닙니다.",
      ja: "ここでのIOTAはBittensor SN9アルファで、IOTA Layer 1ではありません。日次は香港時間の午前0時基準、USDは市場換算で、公式標本はリアルタイムの接続確認ではありません。",
    },
  },
  xid: {
    title: {
      zh: "XID / MMM 挖矿监控：Worker 算力、份额与余额",
      en: "XID / MMM mining monitor: worker hashrate, shares and balance",
      "zh-TW": "XID / MMM 挖礦監控：Worker 算力、份額與餘額",
      ko: "XID / MMM 채굴 모니터: 워커 해시레이트·셰어·잔액",
      ja: "XID / MMM採掘監視：ワーカーの算力・シェア・残高",
    },
    summary: {
      zh: "用 xCoin 主网地址查看 MMM 矿池 Worker、上报算力和链上记录。",
      en: "Look up MMM pool workers, reported hashrate and chain records with an xCoin mainnet address.",
      "zh-TW": "以 xCoin 主網地址查看 MMM 礦池 Worker、上報算力與鏈上紀錄。",
      ko: "xCoin 메인넷 주소로 MMM 풀 워커, 보고 해시레이트와 체인 기록을 조회합니다.",
      ja: "xCoinメインネットのアドレスでMMMプールのワーカー、報告算力、チェーン記録を照会します。",
    },
    identity: {
      zh: "填写 xpa1r 开头的完整 xCoin 主网公开收益地址。Worker 名称可用于区分同一地址下的矿工。",
      en: "Use the complete xCoin mainnet public payout address beginning xpa1r. A worker name can distinguish miners sharing an address.",
      "zh-TW": "填寫 xpa1r 開頭的完整 xCoin 主網公開收益地址。Worker 名稱可區分同地址下的礦工。",
      ko: "xpa1r로 시작하는 전체 xCoin 메인넷 공개 보상 주소를 사용합니다. 워커 이름으로 동일 주소의 채굴자를 구분할 수 있습니다.",
      ja: "xpa1rから始まる完全なxCoinメインネット公開報酬アドレスを使います。同じアドレス内のマイナーはワーカー名で区別できます。",
    },
    coverage: {
      zh: "MMM 是 Mac Metal Miner 应用，XID 是代币。可见 Worker 仅覆盖数据源矿池；余额不是累计收益，Worker 名称也不证明设备型号。",
      en: "MMM is the Mac Metal Miner app; XID is the token. Visible workers cover the source pool only. Balance is not lifetime earnings, and a worker name does not prove hardware identity.",
      "zh-TW":
        "MMM 是 Mac Metal Miner 應用，XID 是代幣。可見 Worker 只涵蓋來源礦池；餘額不是累計收益，名稱不代表設備型號。",
      ko: "MMM은 Mac Metal Miner 앱이고 XID는 토큰입니다. 표시 워커는 해당 소스 풀 범위이며 잔액은 누적 수익이 아닙니다. 워커 이름으로 하드웨어를 확정할 수 없습니다.",
      ja: "MMMはMac Metal Minerアプリ、XIDはトークンです。ワーカーは参照プールの範囲のみで、残高は累計収益ではなく、名前から機種は判断できません。",
    },
  },
  quantus: {
    title: {
      zh: "Quantus QTC 挖矿监控：主网区块、Wormhole 地址与奖励",
      en: "Quantus QTC mining monitor: mainnet blocks, Wormhole addresses and rewards",
      "zh-TW": "Quantus QTC 挖礦監控：主網區塊、Wormhole 地址與獎勵",
      ko: "Quantus QTC 채굴 모니터: 메인넷 블록·Wormhole 주소·보상",
      ja: "Quantus QTC採掘監視：メインネット・Wormholeアドレス・報酬",
    },
    summary: {
      zh: "通过 Quantus 官方主网索引查看区块和公开地址的 QTC 区块奖励。",
      en: "View blocks and public-address QTC block rewards from the official Quantus mainnet index.",
      "zh-TW": "透過 Quantus 官方主網索引查看區塊與公開地址的 QTC 區塊獎勵。",
      ko: "공식 Quantus 메인넷 인덱스에서 블록과 공개 주소의 QTC 블록 보상을 확인합니다.",
      ja: "Quantus公式メインネットのインデックスからブロックと公開アドレスのQTCブロック報酬を確認します。",
    },
    identity: {
      zh: "填写 Quantus 主网公开挖矿 Wormhole 地址（SS58 前缀 189），不要填写 inner hash。",
      en: "Use the public Quantus mainnet mining Wormhole address (SS58 prefix 189), never the inner hash.",
      "zh-TW": "填寫 Quantus 主網公開挖礦 Wormhole 地址（SS58 前綴 189），不要填寫 inner hash。",
      ko: "Quantus 메인넷 공개 채굴 Wormhole 주소(SS58 접두어 189)를 사용하며 inner hash는 입력하지 않습니다.",
      ja: "Quantusメインネットの公開採掘Wormholeアドレス（SS58接頭辞189）を使い、inner hashは入力しません。",
    },
    coverage: {
      zh: "今日按香港时间统计已索引区块奖励，不包含所有矿池转账。历史获奖地址数不是当前在线设备数；缺失数据不按零收益处理。",
      en: "Daily totals use Hong Kong time and indexed block rewards, not all pool transfers. Historically rewarded addresses are not online devices; missing data is not zero income.",
      "zh-TW":
        "今日按香港時間統計已索引區塊獎勵，不涵蓋所有礦池轉帳。歷史獲獎地址不是目前在線設備；缺失資料不當作零收益。",
      ko: "오늘 합계는 홍콩 시간의 인덱싱된 블록 보상이며 모든 풀 이체를 포함하지 않습니다. 과거 보상 주소 수는 현재 온라인 기기 수가 아니고 미확인 데이터는 수익 0이 아닙니다.",
      ja: "日次は香港時間の索引済みブロック報酬で、すべてのプール送金を含みません。過去の報酬アドレス数はオンライン台数ではなく、欠測を収益ゼロとは扱いません。",
    },
  },
  flyai: {
    title: {
      zh: "fly.ai Compute 积分查询：ETH 收益地址与月度积分",
      en: "fly.ai Compute points: ETH reward address and monthly totals",
      "zh-TW": "fly.ai Compute 積分查詢：ETH 收益地址與月度積分",
      ko: "fly.ai Compute 포인트 조회: ETH 보상 주소와 월간 합계",
      ja: "fly.ai Computeポイント照会：ETH報酬アドレスと月間合計",
    },
    summary: {
      zh: "按公开 ETH 收益地址查看 fly.ai 月度算力积分及占比。",
      en: "Look up fly.ai monthly compute points and share using a public ETH reward address.",
      "zh-TW": "依公開 ETH 收益地址查看 fly.ai 月度算力積分與佔比。",
      ko: "공개 ETH 보상 주소로 fly.ai 월간 컴퓨팅 포인트와 비중을 확인합니다.",
      ja: "公開ETH報酬アドレスでfly.aiの月間計算ポイントと割合を確認します。",
    },
    identity: {
      zh: "填写 0x 开头的公开 ETH 收益地址。登录令牌、API 密钥和钱包私钥都不是查询标识。",
      en: "Use your public 0x ETH reward address. Login tokens, API keys and wallet private keys are not lookup identifiers.",
      "zh-TW": "填寫 0x 開頭的公開 ETH 收益地址。登入權杖、API 金鑰與錢包私鑰都不是查詢識別碼。",
      ko: "0x로 시작하는 공개 ETH 보상 주소를 입력합니다. 로그인 토큰, API 키나 지갑 비밀키는 조회 식별자가 아닙니다.",
      ja: "0xから始まる公開ETH報酬アドレスを使います。ログイントークン、APIキー、秘密鍵は照会IDではありません。",
    },
    coverage: {
      zh: "积分按钱包和月份汇总，不等于单台设备今日收益或可提现金额。同地址的多台设备不能重复计算这些积分。",
      en: "Points are wallet-level monthly totals, not device daily earnings or a withdrawable balance. Do not count them again for each device sharing the wallet.",
      "zh-TW":
        "積分按錢包與月份彙總，不等於單台设备今日收益或可提領金額。同地址多台設備不能重複計算積分。",
      ko: "포인트는 지갑별 월간 합계로 기기 일일 수익이나 출금 가능 잔액이 아닙니다. 동일 지갑을 사용하는 기기마다 중복 집계하면 안 됩니다.",
      ja: "ポイントはウォレット単位の月間合計で、機器の日次収益や出金可能残高ではありません。同一ウォレットの機器ごとに重複集計できません。",
    },
  },
  nosana: {
    title: {
      zh: "Nosana GPU 节点监控：任务状态与完成记录",
      en: "Nosana GPU node monitor: running jobs and completed tasks",
      "zh-TW": "Nosana GPU 節點監控：任務狀態與完成紀錄",
      ko: "Nosana GPU 노드 모니터: 실행 작업과 완료 기록",
      ja: "Nosana GPUノード監視：実行中ジョブと完了記録",
    },
    summary: {
      zh: "用 Nosana 节点公开地址查询运行中任务与已完成任务，查看 GPU 网络任务统计。",
      en: "Query running and completed jobs by public Nosana node address and view GPU network job statistics.",
      "zh-TW": "以 Nosana 節點公開地址查詢執行中與已完成任務，查看 GPU 網路任務統計。",
      ko: "Nosana 공개 노드 주소로 실행 중 및 완료 작업과 GPU 네트워크 작업 통계를 확인합니다.",
      ja: "Nosanaの公開ノードアドレスで実行中・完了ジョブとGPUネットワークの統計を確認します。",
    },
    identity: {
      zh: "填写 Nosana 节点的公开 Solana 地址，而不是任务地址或钱包私钥。一个钱包可能对应不同节点，请以官方节点信息核对。",
      en: "Use the public Solana address of the Nosana node, not a job address or private key. Check the node identity in the official dashboard instead of assuming a wallet represents one node.",
      "zh-TW":
        "填寫 Nosana 節點的公開 Solana 地址，而非任務地址或錢包私鑰。請在官方頁核對節點身分，不假設一個錢包等於一個節點。",
      ko: "작업 주소나 비밀키가 아닌 Nosana 노드의 공개 Solana 주소를 사용합니다. 지갑 하나가 노드 하나라고 가정하지 말고 공식 대시보드에서 노드 정보를 확인하세요.",
      ja: "ジョブのアドレスや秘密鍵ではなく、Nosanaノードの公開Solanaアドレスを使います。ウォレットとノードを同一視せず公式画面で確認してください。",
    },
    coverage: {
      zh: "任务统计来自 Nosana 官方公开索引。运行中任务数不是 GPU 台数，没有任务也不等于离线。本次不将任务数量换算成 NOS 收益。",
      en: "Job statistics come from the official Nosana public index. Running jobs are not a GPU count; no jobs does not mean offline. This monitor does not convert job counts into NOS earnings.",
      "zh-TW":
        "任務統計來自 Nosana 官方公開索引。執行中任務數不是 GPU 台數，沒有任務不等於離線。本監控不將任務數量換算成 NOS 收益。",
      ko: "작업 통계는 Nosana 공식 공개 인덱스에서 가져옵니다. 실행 작업 수는 GPU 수가 아니며 작업 없음은 오프라인을 뜻하지 않습니다. 작업 수를 NOS 수익으로 환산하지 않습니다.",
      ja: "ジョブ統計はNosana公式公開インデックスが出典です。実行ジョブ数はGPU台数ではなく、ジョブなしはオフラインを意味しません。ジョブ数をNOS収益に換算しません。",
    },
  },
  gonka: {
    title: {
      zh: "Gonka 节点监控：轮次参与者、模型与权重",
      en: "Gonka host monitor: epoch participation, models and weight",
      "zh-TW": "Gonka 節點監控：輪次參與者、模型與權重",
      ko: "Gonka 호스트 모니터: 에포크 참여·모델·가중치",
      ja: "Gonkaホスト監視：エポック参加・モデル・重み",
    },
    summary: {
      zh: "查询 Gonka 当前轮次参与者、公开 Host 地址、模型与轮次权重。",
      en: "Look up current Gonka epoch participants, public Host addresses, models and epoch weight.",
      "zh-TW": "查詢 Gonka 目前輪次參與者、公開 Host 地址、模型與輪次權重。",
      ko: "현재 Gonka 에포크 참여자, 공개 Host 주소, 모델과 에포크 가중치를 조회합니다.",
      ja: "Gonkaの現在のエポック参加者、公開Hostアドレス、モデルと重みを照会します。",
    },
    identity: {
      zh: "填写 gonka1 开头的 Host 公开账户地址，不要填写操作密钥或私钥。一个 Host 可管理多个 ML 节点。",
      en: "Use the public Host account address beginning gonka1, never an operational or private key. One Host may manage several ML nodes.",
      "zh-TW":
        "填寫 gonka1 開頭的 Host 公開帳戶地址，不要填寫操作金鑰或私鑰。一個 Host 可管理多個 ML 節點。",
      ko: "gonka1로 시작하는 Host 공개 계정 주소를 사용합니다. 운영 키나 비밀키를 입력하지 마세요. Host 하나가 여러 ML 노드를 관리할 수 있습니다.",
      ja: "gonka1から始まるHost公開アカウントアドレスを使い、運用キーや秘密鍵は入力しません。1つのHostが複数のMLノードを管理できます。",
    },
    coverage: {
      zh: "来源为官方文档列出的公开轮次接口。列入轮次不证明实时在线，权重不是 GNK 奖励；节点数也不是物理 GPU 台数。本页面不展示推测的日收益。",
      en: "The source is the public epoch API listed in official documentation. Epoch membership is not live uptime; weight is not a GNK reward and ML nodes are not physical GPUs. No daily earnings are inferred.",
      "zh-TW":
        "來源是官方文件列出的公開輪次介面。列入輪次不代表即時在線，權重不是 GNK 獎勵，ML 節點也不是實體 GPU。本頁不推算日收益。",
      ko: "공식 문서의 공개 에포크 API를 사용합니다. 에포크 포함은 실시간 가동 확인이 아니고 가중치는 GNK 보상이 아니며 ML 노드는 물리 GPU 수가 아닙니다. 일일 수익을 추정하지 않습니다.",
      ja: "公式文書掲載の公開エポックAPIを使います。参加はリアルタイム稼働の証明ではなく、重みはGNK報酬ではなく、MLノード数はGPU台数ではありません。日次収益は推測しません。",
    },
  },
} as const;
export const editorialCopy = (locale: SiteLocale) =>
  Object.fromEntries(Object.entries(labels).map(([key, values]) => [key, values[locale]])) as {
    [K in keyof typeof labels]: string;
  };
export function projectQuestions(project: ProjectId, locale: SiteLocale) {
  const p = projectEditorial[project];
  return projectDiscoveryQuestions(
    PROJECTS[project].name,
    locale,
    p.identity[locale],
    p.coverage[locale],
  );
}
