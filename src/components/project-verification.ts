import type { ProjectId } from "@/lib/projects";
import type { SiteLocale } from "@/lib/site";

// Source and scope review: docs/seo-geo-all-projects-2026-10-26.json.
export const projectVerification: Record<ProjectId, Record<SiteLocale, string>> = {
  iota: {
    zh: "核对同一 Miner ID 和训练轮次，再比较贡献、已记账收益与付款。收款 coldkey 不是 Miner ID。",
    "zh-TW":
      "核對相同 Miner ID 及訓練輪次，再比較貢獻、已記帳收益與付款。收款 coldkey 並非 Miner ID。",
    en: "Match the Miner ID and training run before comparing contributions, accounted rewards and payouts. A payout coldkey is not a Miner ID.",
    ko: "Miner ID와 훈련 실행을 맞춘 뒤 기여·집계 보상·지급을 비교하세요. 지급 coldkey는 Miner ID가 아닙니다.",
    ja: "Miner IDと訓練runを合わせて貢献・計上報酬・支払いを比較します。受取coldkeyはMiner IDとは別です。",
  },
  xid: {
    zh: "MMM 查看本机速度和状态，矿池查看该地址的 Worker 与份额，浏览器核对链上记录。三者时间窗口不同。",
    "zh-TW":
      "MMM 查看本機速度，礦池查看地址的 Worker 與份額，瀏覽器核對鏈上紀錄。三者時間窗口不同。",
    en: "Use MMM for local speed, the pool for address workers and shares, and the explorer for chain records. Their reporting windows can differ.",
    ko: "MMM은 로컬 속도, 풀은 주소별 워커와 셰어, 탐색기는 체인 기록을 확인합니다. 집계 기간은 다를 수 있습니다.",
    ja: "MMMでローカル速度、プールでアドレスのワーカーとシェア、エクスプローラーでチェーン記録を確認します。集計期間は異なります。",
  },
  quantus: {
    zh: "先区分主网与退役 Planck，再核对矿池收款标识和 wormhole 奖励地址。链上全网出块统计不能代替你的矿池账本。",
    "zh-TW":
      "先區分主網與退役 Planck，再核對礦池收款標識及 wormhole 獎勵地址。全網出塊不等於個人礦池帳本。",
    en: "Separate mainnet from retired Planck, then verify the pool payout identifier and wormhole reward address. Network block totals are not your pool ledger.",
    ko: "메인넷과 종료된 Planck를 구분하고 풀 지급 ID와 wormhole 보상 주소를 확인하세요. 네트워크 블록 합계는 개인 풀 장부가 아닙니다.",
    ja: "メインネットと終了済みPlanckを分け、プール受取IDとwormhole報酬アドレスを確認します。全網のブロック合計は個人のプール台帳とは別です。",
  },
  flyai: {
    zh: "fly.ai 指 flyaiworld.com 的脑模拟计算项目。核对同一 Miner 和月份。已检查任务、积分、月度分配与领取各有含义；月榜积分不能证明设备此刻在线。",
    "zh-TW":
      "fly.ai 指 flyaiworld.com 的腦模擬計算項目。核對相同 Miner 及月份。已檢查任務、積分、每月分配與領取各不相同；月榜積分不證明即時在線。",
    en: "fly.ai here is the brain-simulation compute project at flyaiworld.com. Match the miner and month. Checked jobs, points, monthly allocation and claims are separate records; monthly points do not prove current device activity.",
    ko: "여기서 fly.ai는 flyaiworld.com의 뇌 시뮬레이션 컴퓨팅 프로젝트입니다. 같은 Miner와 월을 대조하세요. 검증 작업·포인트·월별 배분·청구는 별도이며 월간 포인트는 현재 기기 활동을 보장하지 않습니다.",
    ja: "ここでのfly.aiはflyaiworld.comの脳シミュレーション計算プロジェクトです。同じMinerと月を照合します。検証済みジョブ・ポイント・月次配分・請求は別の記録で、月間ポイントは現在の稼働を示しません。",
  },
  nosana: {
    zh: "按节点 Solana 地址对照 Job 状态与完成记录。任务数量不等于 GPU 数量，完成任务也不能直接换算为已结算 NOS。",
    "zh-TW":
      "依節點 Solana 地址核對 Job 狀態及完成紀錄。任務數不等於 GPU 數，完成任務亦不等於已結算 NOS。",
    en: "Compare job state and completions by the node’s Solana address. Job count is not GPU count, and completion alone is not a settled NOS payment.",
    ko: "노드 Solana 주소로 작업 상태와 완료 기록을 대조하세요. 작업 수는 GPU 수가 아니며 완료만으로 NOS 정산이 확인되지는 않습니다.",
    ja: "ノードのSolanaアドレスでジョブ状態と完了記録を照合します。ジョブ数はGPU数ではなく、完了だけでNOS決済額は分かりません。",
  },
  gonka: {
    zh: "用相同 Host 地址与 epoch 核对参与名单、模型和权重。已登记不等于本轮参与，权重不是 GNK 金额。",
    "zh-TW":
      "以相同 Host 地址及 epoch 核對名單、模型與權重。登記不等於本輪參與，權重並非 GNK 金額。",
    en: "Match the host address and epoch before comparing participants, models and weight. Registration is not current-epoch participation; weight is not GNK.",
    ko: "호스트 주소와 epoch를 맞춰 참여자·모델·가중치를 비교하세요. 등록은 현재 epoch 참여와 다르며 가중치는 GNK 금액이 아닙니다.",
    ja: "Hostアドレスとepochを合わせて参加者・モデル・重みを比較します。登録と当期参加は別で、重みはGNK金額ではありません。",
  },
  akash: {
    zh: "按 akash1 提供商地址核对容量与分配。提供商可管理多台服务器；容量、报价与活跃租约均不能直接当作单机已结算收入。",
    "zh-TW":
      "依 akash1 供應商地址核對容量及分配。供應商可管理多台伺服器，容量、報價及租約均非單機已結算收入。",
    en: "Check capacity and allocation by akash1 provider address. A provider can cover multiple servers; capacity, asking prices and leases are not settled per-device income.",
    ko: "akash1 공급자 주소로 용량과 할당을 확인하세요. 공급자 하나가 여러 서버를 관리하며 용량·호가·임대는 기기별 정산 수입과 다릅니다.",
    ja: "akash1プロバイダーアドレスで容量と割り当てを確認します。複数サーバーを含む場合があり、容量・価格・リースは機器別決済収入ではありません。",
  },
  ionet: {
    zh: "用 Device ID 对照 IO Explorer。本站今日区块奖励按 UTC 日统计；历史在线率、租用价和任务收入不与它混算。",
    "zh-TW":
      "以 Device ID 對照 IO Explorer。本站今日區塊獎勵按 UTC 日統計；歷史在線率、租用價及任務收入分開。",
    en: "Compare the Device ID in IO Explorer. This monitor’s daily block rewards use UTC; historical uptime, hire rate and job income remain separate.",
    ko: "IO Explorer의 Device ID를 대조하세요. 일일 블록 보상은 UTC 기준이며 과거 가동률·임대료·작업 수입과 분리합니다.",
    ja: "IO ExplorerでDevice IDを照合します。日次ブロック報酬はUTC基準で、過去の稼働率・レンタル単価・ジョブ収入とは分けます。",
  },
  vast: {
    zh: "用 Host 的 Machine ID 核对香港时间今日收入报告。GPU、存储和带宽收入与市场报价、账户余额及扣成本后的利润分开。",
    "zh-TW":
      "以 Host Machine ID 核對香港時間今日收入報告。GPU、儲存、頻寬收入與報價、帳戶餘額及淨利分開。",
    en: "Match the Host Machine ID and Hong Kong-day earnings report. GPU, storage and bandwidth revenue differs from market quotes, account balance and profit after costs.",
    ko: "Host Machine ID와 홍콩 날짜의 수입 보고서를 맞추세요. GPU·스토리지·대역폭 수입은 시장 호가·잔액·비용 차감 후 이익과 다릅니다.",
    ja: "HostのMachine IDと香港日付の収入報告を照合します。GPU・ストレージ・帯域の収入は市場価格・残高・費用控除後利益とは別です。",
  },
  golem: {
    zh: "按 Golem Node ID 核对 Stats 的节点状态和 GLM 记录。滚动最近 24 小时不是香港日界线的今日收益；报价也不是到账金额。",
    "zh-TW":
      "依 Golem Node ID 核對 Stats 的狀態與 GLM 紀錄。滾動 24 小時不等於香港今日收益，報價亦非到帳金額。",
    en: "Check node state and GLM records in Stats by Golem Node ID. Rolling last-24-hour values differ from a Hong Kong calendar day; asking prices are not received payments.",
    ko: "Golem Node ID로 Stats의 상태와 GLM 기록을 대조하세요. 최근 24시간은 홍콩 달력 날짜와 다르며 호가는 입금액이 아닙니다.",
    ja: "Golem Node IDでStatsの状態とGLM記録を照合します。直近24時間は香港の暦日と異なり、提示価格は入金額ではありません。",
  },
  noid: {
    zh: "核对 o1 地址、所选矿池与来源时间。矿池份额和待支付余额在矿池账本，链上付款需要对照交易确认。",
    "zh-TW": "核對 o1 地址、礦池及來源時間。礦池份額及待支付在礦池帳本，鏈上付款需對照交易確認。",
    en: "Match the o1 address, pool and source time. Shares and unpaid balances belong to the pool ledger; on-chain payouts require transaction confirmation checks.",
    ko: "o1 주소·풀·출처 시각을 맞추세요. 셰어와 미지급액은 풀 장부이며 온체인 지급은 거래 확인과 대조합니다.",
    ja: "o1アドレス・プール・出典時刻を合わせます。シェアと未払い額はプール台帳で、チェーン支払いは取引の承認と照合します。",
  },
  acurast: {
    zh: "处理器地址识别设备；管理者范围的已支付奖励按香港日界线比较。管理者可能关联多台处理器，余额和冻结金额也不是单台手机收益。",
    "zh-TW":
      "處理器地址識別設備；管理者已支付獎勵依香港日界線比較。管理者可關聯多台處理器，餘額及凍結額並非單支手機收益。",
    en: "Processor addresses identify devices; manager-level paid rewards use Hong Kong day boundaries. A manager may cover multiple processors; wallet and frozen balances are not one phone’s income.",
    ko: "프로세서 주소는 기기를 식별하고 관리자 단위 지급 보상은 홍콩 날짜 기준입니다. 관리자에 여러 프로세서가 연결될 수 있으며 잔액·동결액은 한 기기의 수익이 아닙니다.",
    ja: "Processorアドレスは機器を識別し、管理者単位の支払済み報酬は香港日付で比較します。管理者には複数機器が属し、残高・凍結額は一台の収益ではありません。",
  },
  prl: {
    zh: "先确认 LuckyPool 或 Kryptex 及共享/SOLO 模式，再核对相同 PRL 地址。算力与份额反映工作，余额、付款和预测收益分别查看。",
    "zh-TW":
      "先確認 LuckyPool 或 Kryptex 及共享/SOLO 模式，再核對 PRL 地址。算力、份額、餘額、付款及預測收益分開查看。",
    en: "Match LuckyPool or Kryptex, shared/SOLO mode and the PRL address. Read work, unpaid balance, payouts and calculator estimates as separate measures.",
    ko: "LuckyPool/Kryptex, 공동/SOLO 모드와 PRL 주소를 맞추세요. 작업·미지급액·지급·계산기 추정은 구분합니다.",
    ja: "LuckyPoolかKryptex、共有/SOLOモードとPRLアドレスを合わせます。作業量・未払い・支払い・計算上の予測は分けて読みます。",
  },
  xmr: {
    zh: "核对 RandomX 矿池和完整 XMR 地址。计算器会假设速度、电价和费用；矿池已记账金额与钱包余额需要另行对照。",
    "zh-TW":
      "核對 RandomX 礦池及完整 XMR 地址。計算器假設速度、電價與費用；礦池記帳及錢包餘額另行核對。",
    en: "Match the RandomX pool and full XMR address. Calculators assume hashrate, electricity and fees; pool accounting and wallet balance require separate checks.",
    ko: "RandomX 풀과 전체 XMR 주소를 확인하세요. 계산기는 속도·전기료·수수료를 가정하며 풀 집계와 지갑 잔액은 별도 확인이 필요합니다.",
    ja: "RandomXのプールと完全なXMRアドレスを確認します。計算機には速度・電力・手数料の前提があり、プール計上額と残高は別に照合します。",
  },
  etc: {
    zh: "选择 2Miners ETC 的共享矿池与原生 ETC 收款地址。ETH、ETHW 与 ETC 即使地址外形相同，也属于不同网络。",
    "zh-TW":
      "選擇 2Miners ETC 共享礦池及原生 ETC 地址。ETH、ETHW 與 ETC 即使地址外形相同，仍為不同網路。",
    en: "Use the shared 2Miners ETC pool and a native ETC payout address. ETH, ETHW and ETC can share an address shape while belonging to different networks.",
    ko: "2Miners ETC 공동 풀과 ETC 지급 주소를 사용하세요. ETH·ETHW·ETC는 주소 형태가 같아도 다른 네트워크입니다.",
    ja: "2Miners ETC共有プールとETC受取アドレスを使います。ETH・ETHW・ETCはアドレス形式が同じでも異なるネットワークです。",
  },
  rvn: {
    zh: "按 2Miners RVN 的地址核对 KawPoW 统计。矿池可提供不同结算币种，本站原生 RVN 地址查询不等于支持全部换币付款入口。",
    "zh-TW": "依 2Miners RVN 地址核對 KawPoW 統計。本站原生 RVN 查詢不代表支援所有換幣付款入口。",
    en: "Check KawPoW records on 2Miners RVN with the matching address. Native RVN lookup here does not imply support for every alternative payout currency offered by the pool.",
    ko: "같은 주소로 2Miners RVN의 KawPoW 기록을 확인하세요. 여기의 RVN 조회가 풀이 제공하는 모든 환전 지급을 지원하는 것은 아닙니다.",
    ja: "同じアドレスで2Miners RVNのKawPoW記録を確認します。当サイトのRVN照会は、プールの全換算支払通貨への対応を意味しません。",
  },
  zec: {
    zh: "先核对本站支持的透明 ZEC 收款地址。隐私地址、交易所内部标识和矿池公开账号不是同一种查询标识。",
    "zh-TW": "先核對本站支援的透明 ZEC 地址。隱私地址、交易所內部標識與礦池公開帳號並非相同標識。",
    en: "Check that you are using a supported transparent ZEC payout address. Shielded addresses, exchange internal identifiers and public pool accounts are distinct identifiers.",
    ko: "지원되는 투명 ZEC 지급 주소인지 확인하세요. 실드 주소·거래소 내부 ID·공개 풀 계정은 서로 다른 식별자입니다.",
    ja: "対応する透明ZEC受取アドレスか確認します。シールドアドレス・取引所内部ID・公開プールアカウントは別の識別子です。",
  },
  kas: {
    zh: "核对 kaspa: 地址、矿池与统计窗口。kHeavyHash 速度只在相同单位和窗口下比较，硬件型号或网络总算力不能代替设备收益。",
    "zh-TW":
      "核對 kaspa: 地址、礦池及窗口。kHeavyHash 速度需在相同單位及窗口比較，硬體或全網算力非設備收益。",
    en: "Match the kaspa: address, pool and time window. Compare kHeavyHash only in matching units and windows; hardware type and network hashrate are not device income.",
    ko: "kaspa: 주소·풀·집계 기간을 맞추세요. kHeavyHash는 같은 단위와 기간으로 비교하며 장비 종류나 전체 해시레이트를 기기 수익으로 보지 않습니다.",
    ja: "kaspa:アドレス・プール・期間を合わせます。kHeavyHashは同じ単位と期間で比較し、機種や全網算力を機器収入とは扱いません。",
  },
  mds: {
    zh: "用支持多次收款的 MDS 标识核对 LuckyPool。24 小时分配、未成熟、已确认未支付和付款分别查看，不按份额数判断实时在线。",
    "zh-TW":
      "以支援多次收款的 MDS 標識核對 LuckyPool。24 小時分配、未成熟、已確認未付及付款分開，份額數不等於即時在線。",
    en: "Check LuckyPool using an MDS payout identity suitable for repeated receipts. Keep 24-hour allocations, immature, confirmed unpaid and payouts separate; shares do not establish live connectivity.",
    ko: "반복 수령에 맞는 MDS 지급 ID로 LuckyPool을 확인하세요. 24시간 배분·미성숙·확정 미지급·지급을 구분하며 셰어만으로 현재 연결을 판단하지 않습니다.",
    ja: "繰返し受取に適したMDS識別子でLuckyPoolを確認します。24時間配分・未成熟・承認済み未払い・支払いを分け、シェアだけで現在の接続を判断しません。",
  },
  bnt: {
    zh: "这里是 blocknetcrypto.com 的 Blocknet BNT。按 bntpool 地址对照份额、待成熟、已确认与付款，不与 Bancor BNT 或 BLOCK 混用。",
    "zh-TW":
      "此處為 blocknetcrypto.com 的 Blocknet BNT。核對 bntpool 地址與各付款階段，不與 Bancor BNT 或 BLOCK 混用。",
    en: "This is Blocknet BNT at blocknetcrypto.com. Match the bntpool address and payout stages; do not mix it with Bancor BNT or BLOCK.",
    ko: "여기는 blocknetcrypto.com의 Blocknet BNT입니다. bntpool 주소와 지급 단계를 확인하고 Bancor BNT나 BLOCK과 혼동하지 마세요.",
    ja: "ここではblocknetcrypto.comのBlocknet BNTを扱います。bntpoolのアドレスと支払段階を確認し、Bancor BNTやBLOCKと混同しないでください。",
  },
  csd: {
    zh: "用 G-pools 的 40 位十六进制 CSD 地址核对 1 小时算力、待确认、可支付和累计付款。项目提案排序不是矿池收益记录。",
    "zh-TW":
      "以 G-pools 的 40 位十六進位 CSD 地址核對 1 小時算力及付款狀態。專案提案排序並非礦池收益。",
    en: "Use the G-pools 40-hex-character CSD address to check one-hour hashrate, pending, payable and lifetime paid. Proposal rankings are not mining income records.",
    ko: "G-pools의 40자리 16진 CSD 주소로 1시간 해시레이트·대기·지급 가능·누적 지급을 확인하세요. 제안 순위는 채굴 수입이 아닙니다.",
    ja: "G-poolsの40桁16進CSDアドレスで1時間算力・未承認・支払可能・累積支払いを確認します。提案順位は採掘収入ではありません。",
  },
  erg: {
    zh: "核对 2Miners ERG 与本站支持的原生地址。Ergo 挖矿奖励脚本类型、矿池收款地址及可选换币付款是不同层面的信息。",
    "zh-TW": "核對 2Miners ERG 及本站原生地址。Ergo 獎勵腳本、礦池收款地址及換幣付款屬不同層面。",
    en: "Match 2Miners ERG and a supported native payout address. Ergo reward script types, pool payout addresses and optional payout conversions describe different layers.",
    ko: "2Miners ERG와 지원되는 지급 주소를 확인하세요. Ergo 보상 스크립트·풀 수령 주소·환전 지급은 서로 다른 계층입니다.",
    ja: "2Miners ERGと対応する受取アドレスを確認します。Ergo報酬スクリプト・プール受取アドレス・換算支払いは別の層の情報です。",
  },
  zeph: {
    zh: "按 ZEPH 地址核对 2Miners。Zephyr 与 Monero 虽都采用 RandomX，地址、矿池账本和付款规则仍各自独立。",
    "zh-TW":
      "依 ZEPH 地址核對 2Miners。Zephyr 與 Monero 雖同為 RandomX，地址、帳本及付款規則仍獨立。",
    en: "Check 2Miners with the ZEPH address. Zephyr and Monero both use RandomX, but their addresses, pool ledgers and payout rules remain separate.",
    ko: "ZEPH 주소로 2Miners를 확인하세요. Zephyr와 Monero는 RandomX를 사용해도 주소·풀 장부·지급 규칙이 별도입니다.",
    ja: "ZEPHアドレスで2Minersを確認します。ZephyrとMoneroはRandomXを使っていても、アドレス・台帳・支払ルールは別です。",
  },
  btc: {
    zh: "在 CKPool/CKstats 核对相同 BTC 地址和 1 小时算力。Solo 份额和最佳难度不是按份额每日付款的余额。",
    "zh-TW":
      "於 CKPool/CKstats 核對 BTC 地址與 1 小時算力。Solo 份額及最佳難度不是每日按份額付款餘額。",
    en: "Match the BTC address and one-hour hashrate on CKPool/CKstats. Solo shares and best difficulty are not a balance paid daily by share count.",
    ko: "CKPool/CKstats에서 BTC 주소와 1시간 해시레이트를 맞추세요. 솔로 셰어와 최고 난이도는 매일 셰어별 지급되는 잔액이 아닙니다.",
    ja: "CKPool/CKstatsでBTCアドレスと1時間算力を合わせます。Soloシェアや最高難度は、毎日シェア数に応じて支払う残高ではありません。",
  },
  ethw: {
    zh: "使用 ETHW 网络的 2Miners 地址查询。Ethash、ETC 的 ETCHash 及 ETH 质押不是同一项目，计算器预测也不是已记账收益。",
    "zh-TW":
      "以 ETHW 網路的 2Miners 地址查詢。Ethash、ETC ETCHash 及 ETH 質押各不相同，計算器預測亦非記帳收益。",
    en: "Use the ETHW network’s 2Miners address. Ethash, ETC’s ETCHash and ETH staking are different; calculator forecasts are not accounted earnings.",
    ko: "ETHW 네트워크의 2Miners 주소를 사용하세요. Ethash·ETC의 ETCHash·ETH 스테이킹은 다르며 계산기 예측은 집계 수익이 아닙니다.",
    ja: "ETHWネットワークの2Minersアドレスを使います。Ethash・ETCのETCHash・ETHステーキングは別で、計算機予測は計上収益ではありません。",
  },
  tsc: {
    zh: "先选实际矿池，再核对 tc1 地址、Worker 和来源时间。N/s 与 PoI/s 不直接混加，链上余额、矿池待支付和今日收益分开。",
    "zh-TW":
      "先選實際礦池，再核對 tc1 地址、Worker 及來源時間。N/s 與 PoI/s 不混加，鏈上餘額、待付及今日收益分開。",
    en: "Choose the actual pool, then match the tc1 address, workers and source time. Keep N/s and PoI/s separate, as well as chain balance, pool unpaid and daily income.",
    ko: "실제 풀을 선택하고 tc1 주소·워커·출처 시각을 맞추세요. N/s와 PoI/s, 체인 잔액·풀 미지급·일일 수익을 각각 구분합니다.",
    ja: "利用プールを選び、tc1アドレス・ワーカー・出典時刻を合わせます。N/sとPoI/s、チェーン残高・未払い・日次収益は分けます。",
  },
};

export const verificationQuestion = {
  zh: "如何对照原始数据？",
  "zh-TW": "如何核對原始資料？",
  en: "How should I verify the original data?",
  ko: "원본 데이터는 어떻게 대조하나요?",
  ja: "元のデータとの照合方法は？",
};

// These short UI summaries are intentionally different from search snippets.
export const projectSearchDescriptions: Partial<Record<ProjectId, Record<SiteLocale, string>>> = {
  flyai: {
    zh: "查询 flyaiworld.com 脑模拟计算的月度积分与占比，使用公开 0x 收益地址，区分积分、月度分配和可领取代币。",
    "zh-TW":
      "查詢 flyaiworld.com 腦模擬計算的每月積分及佔比，以公開 0x 地址區分積分、每月分配及可領取代幣。",
    en: "Look up monthly points and share for flyaiworld.com brain simulation compute using a public 0x reward address. Points, allocation and claims are separate.",
    ko: "공개 0x 보상 주소로 flyaiworld.com 뇌 시뮬레이션의 월간 포인트와 비중을 확인하고 포인트·배분·청구를 구분하세요.",
    ja: "公開0x受取アドレスでflyaiworld.comの脳シミュレーション計算の月間ポイントと割合を照会。ポイント・配分・請求を区別します。",
  },
  quantus: {
    zh: "查询 Quantus 主网 QPoW 出块与公开地址 QTC 奖励，核对 wormhole 收益标识。这里不是 Qubitcoin，也不统计退役 Planck 测试网。",
    "zh-TW":
      "查詢 Quantus 主網 QPoW 出塊及 QTC 獎勵，核對 wormhole 標識；並非 Qubitcoin，亦不統計退役 Planck。",
    en: "Check Quantus mainnet QPoW blocks and public-address QTC rewards, matching the wormhole identifier. This is not Qubitcoin or retired Planck testnet.",
    ko: "Quantus 메인넷 QPoW 블록과 QTC 보상을 wormhole ID로 확인합니다. Qubitcoin이나 종료된 Planck 테스트넷이 아닙니다.",
    ja: "QuantusメインネットQPoWブロックとQTC報酬をwormhole識別子で確認。Qubitcoinや終了済みPlanckテストネットとは別です。",
  },
  bnt: {
    zh: "监控 blocknetcrypto.com 的 Blocknet BNT：bntpool 算力、Worker 与付款阶段。这是 Argon2id 链，不是 Bancor BNT 或 BLOCK。",
    "zh-TW":
      "監控 blocknetcrypto.com 的 Blocknet BNT、bntpool 算力、Worker 及付款狀態；此 Argon2id 鏈並非 Bancor BNT 或 BLOCK。",
    en: "Monitor Blocknet BNT at blocknetcrypto.com: bntpool hashrate, workers and payout stages. This Argon2id chain is not Bancor BNT or BLOCK.",
    ko: "blocknetcrypto.com의 Blocknet BNT 해시레이트·워커·지급 단계를 확인합니다. Argon2id 체인이며 Bancor BNT나 BLOCK과 다릅니다.",
    ja: "blocknetcrypto.comのBlocknet BNTを監視し、bntpoolの算力・ワーカー・支払段階を確認。Bancor BNTやBLOCKとは別のArgon2idチェーンです。",
  },
  akash: {
    zh: "用 akash1 提供商地址查询 Akash 状态、GPU 容量与分配量。区分提供商和单台服务器，核对官方来源及获取时间。",
    "zh-TW":
      "用 akash1 供應商地址查詢 Akash 狀態、GPU 容量與分配量，區分供應商與單台伺服器並核對來源時間。",
    en: "Look up Akash provider status, GPU capacity and allocation with an akash1 address. Compare provider scope, source timestamps and official records.",
    ko: "akash1 주소로 Akash 공급자 상태·GPU 용량·할당을 조회하고 공급자 범위와 출처 시각을 공식 기록과 대조하세요.",
    ja: "akash1アドレスでAkashの状態・GPU容量・割り当てを照会し、プロバイダー範囲と出典時刻を公式記録で確認します。",
  },
  ionet: {
    zh: "通过 Device ID 与 IO Explorer 令牌查看 io.net GPU 信息和 UTC 今日区块奖励，区分历史在线率、租用收入与区块奖励。",
    "zh-TW":
      "以 Device ID 及 IO Explorer 權杖查看 io.net GPU 資訊與 UTC 今日區塊獎勵，區分在線率及租用收入。",
    en: "Monitor io.net GPU details and UTC-day block rewards using a Device ID and IO Explorer token. Keep uptime, rental income and rewards separate.",
    ko: "Device ID와 IO Explorer 토큰으로 io.net GPU 정보와 UTC 일일 블록 보상을 확인하고 가동률·임대 수입과 구분하세요.",
    ja: "Device IDとIO Explorerトークンでio.netのGPU情報とUTC日次ブロック報酬を確認。稼働率・レンタル収入と区別します。",
  },
  vast: {
    zh: "用 Machine ID 和只读 API Key 监控 Vast.ai 主机，查看香港时间今日 GPU、存储与带宽收入，区分收入、余额和利润。",
    "zh-TW":
      "以 Machine ID 及唯讀 API Key 監控 Vast.ai 主機與香港今日 GPU、儲存、頻寬收入，區分餘額及淨利。",
    en: "Monitor Vast.ai hosts with a Machine ID and read-only API key. Check Hong Kong-day GPU, storage and bandwidth revenue separately from balance and profit.",
    ko: "Machine ID와 읽기 전용 API 키로 Vast.ai 호스트의 홍콩 날짜 GPU·스토리지·대역폭 수입을 잔액 및 이익과 구분해 확인하세요.",
    ja: "Machine IDと読み取り専用APIキーでVast.aiを監視。香港日付のGPU・ストレージ・帯域収入を残高や利益と分けて確認します。",
  },
  golem: {
    zh: "按 Golem Node ID 查看节点状态、硬件和 GLM 最近 24 小时记录，核对 Golem Stats 来源与时间窗口，区分报价和收益。",
    "zh-TW":
      "依 Golem Node ID 查看節點狀態、硬體及 GLM 最近 24 小時紀錄，核對 Stats 來源窗口，區分報價與收益。",
    en: "Check Golem node status, hardware and rolling last-24-hour GLM records by Node ID. Compare Golem Stats windows, provider prices and reported earnings.",
    ko: "Golem Node ID로 노드 상태·하드웨어·최근 24시간 GLM 기록을 확인하고 Stats 집계 기간과 공급자 가격·수익을 구분하세요.",
    ja: "Golem Node IDで状態・ハードウェア・直近24時間GLM記録を確認。Statsの集計期間と提示価格・報告収益を区別します。",
  },
  prl: {
    zh: "查询 Pearl PRL 在 LuckyPool 或 Kryptex 的算力、Worker、余额与付款。先选实际矿池和模式，再保存公开收款地址。",
    "zh-TW":
      "查詢 Pearl PRL 在 LuckyPool 或 Kryptex 的算力、Worker、餘額及付款。選擇實際礦池與模式後儲存公開地址。",
    en: "Monitor Pearl PRL hashrate, workers, balances and payouts on LuckyPool or Kryptex. Match the pool and mode before saving your public payout address.",
    ko: "LuckyPool 또는 Kryptex의 Pearl PRL 해시레이트·워커·잔액·지급을 조회하세요. 실제 풀과 모드를 맞춰 공개 지급 주소를 저장합니다.",
    ja: "LuckyPoolまたはKryptexのPearl PRL算力・ワーカー・残高・支払いを確認。利用プールとモードを合わせて公開受取アドレスを保存します。",
  },
};

export const projectSearchTitles: Partial<Record<ProjectId, Record<SiteLocale, string>>> = {
  iota: {
    zh: "Macrocosmos IOTA SN9：Train at Home 监控",
    "zh-TW": "Macrocosmos IOTA SN9：Train at Home 監控",
    en: "Macrocosmos IOTA SN9: Train at Home monitor",
    ko: "Macrocosmos IOTA SN9: Train at Home 모니터",
    ja: "Macrocosmos IOTA SN9：Train at Home監視",
  },
  flyai: {
    zh: "fly.ai 脑模拟算力监控：月度积分查询",
    "zh-TW": "fly.ai 腦模擬算力監控：每月積分查詢",
    en: "fly.ai compute monitor: brain simulation points",
    ko: "fly.ai 뇌 시뮬레이션 컴퓨팅: 월간 포인트 조회",
    ja: "fly.ai脳シミュレーション監視：月間ポイント",
  },
  quantus: {
    zh: "Quantus QTC 主网挖矿监控：出块与奖励",
    "zh-TW": "Quantus QTC 主網挖礦監控：出塊與獎勵",
    en: "Quantus QTC mainnet mining monitor: blocks and rewards",
    ko: "Quantus QTC 메인넷 채굴 모니터: 블록과 보상",
    ja: "Quantus QTCメインネット採掘監視：ブロック・報酬",
  },
  bnt: {
    zh: "Blocknet BNT 挖矿监控：Argon2id 与矿池记录",
    "zh-TW": "Blocknet BNT 挖礦監控：Argon2id 與礦池紀錄",
    en: "Blocknet BNT mining monitor: Argon2id pool records",
    ko: "Blocknet BNT 채굴 모니터: Argon2id 풀 기록",
    ja: "Blocknet BNT採掘監視：Argon2idプール記録",
  },
};
