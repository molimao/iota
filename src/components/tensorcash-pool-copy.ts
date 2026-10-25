import { localized as l } from "@/lib/product-discovery";
export const tscPoolCopy = {
  source: l(["数据来源", "資料來源", "Data source", "데이터 출처", "データソース"]),
  title: l([
    "TensorCash 监控：五大矿池、Worker 与 TSC 余额",
    "TensorCash 監控：五大礦池、Worker 與 TSC 餘額",
    "TensorCash monitoring: five pools, workers and TSC balances",
    "TensorCash 모니터: 5개 풀·워커·TSC 잔액",
    "TensorCash監視：5つのプール・ワーカー・TSC残高",
  ]),
  summary: l([
    "选择实际挖矿的矿池，查看同一收益地址下的算力、Worker 与待支付余额。登录后按矿池保存地址。",
    "選擇實際挖礦的礦池，查看收益地址下的算力、Worker 與待支付餘額。登入後依礦池儲存地址。",
    "Choose your mining pool to see address-level throughput, workers and unpaid balance. Sign in to save addresses with their pool.",
    "사용 중인 풀을 선택해 주소별 처리량·워커·미지급 잔액을 확인하세요. 로그인하면 풀과 주소를 저장합니다.",
    "利用中のプールを選び、アドレスの処理量・ワーカー・未払い残高を確認。ログインでプールとアドレスを保存します。",
  ]),
  scope: l([
    "矿池数据彼此独立；链上钱包余额包含转账，与矿池待支付余额分开查看。N/s 与 PoI/s 保留来源单位，不混加。",
    "各礦池資料獨立；鏈上餘額包含轉帳，與礦池待支付餘額分開。N/s 與 PoI/s 保留來源單位，不混加。",
    "Pools are separate sources. Chain balances include transfers and stay separate from pool unpaid balances. N/s and PoI/s keep their source units.",
    "풀별 데이터와 송금이 포함된 체인 잔액은 별도입니다. N/s와 PoI/s는 합산하지 않습니다.",
    "プールごとのデータと送金を含むチェーン残高は別です。N/sとPoI/sは元の単位を保ち、合算しません。",
  ]),
  paused: l([
    "AriaPool 已暂停 TSC 挖矿和付款，暂不能查询矿工数据。",
    "AriaPool 已暫停 TSC 挖礦及付款，暫無礦工資料。",
    "AriaPool has paused TSC mining and payouts; miner data is currently unavailable.",
    "AriaPool은 TSC 채굴과 지급을 중단하여 현재 워커 데이터를 제공하지 않습니다.",
    "AriaPoolはTSC採掘と支払いを停止中で、マイナーデータを取得できません。",
  ]),
  chain: l([
    "链上钱包余额",
    "鏈上錢包餘額",
    "On-chain wallet balance",
    "온체인 지갑 잔액",
    "オンチェーン残高",
  ]),
  rate: l([
    "矿池上报算力",
    "礦池回報算力",
    "Pool-reported throughput",
    "풀 보고 처리량",
    "プール報告処理量",
  ]),
  period: l([
    "算力采用矿池统计窗口，未必是本机实时速度。缺失收益显示 —，不把付款记录当作当日挖矿收益。",
    "算力採用礦池統計窗口，未必為本機即時速度。缺少收益顯示 —，不以付款當作當日挖礦收益。",
    "Throughput uses each pool’s reporting window, which may differ from live device speed. Missing income stays unknown; payouts are not daily mining earnings.",
    "처리량은 풀의 통계 구간 기준입니다. 누락 수익은 알 수 없음이며 지급액을 당일 채굴 수익으로 바꾸지 않습니다.",
    "処理量は各プールの集計期間に基づきます。不明な収益は不明のまま表示し、支払いを当日採掘収益と扱いません。",
  ]),
};
export const TSC_POOLS = [
  "chain",
  "tigerpool",
  "boblabs",
  "ariapool",
  "luckypool",
  "suprnova",
] as const;
