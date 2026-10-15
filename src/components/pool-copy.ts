import { localized } from "@/lib/product-discovery";
import {
  POOL_PROJECT_IDS,
  POOL_PROJECTS,
  poolName,
  poolProvider,
  type PoolProject,
} from "@/lib/pool-projects";
export const poolCopy = {
  search: localized([
    "搜索 Worker",
    "搜尋 Worker",
    "Search Workers",
    "Worker 검색",
    "Workerを検索",
  ]),
  workerLimit: localized([
    "每次展示前 100 个结果，可搜索具体 Worker。",
    "每次顯示前 100 個結果，可搜尋指定 Worker。",
    "Showing up to 100 matches. Search for a specific Worker.",
    "최대 100개 결과를 표시합니다. Worker 이름으로 검색하세요.",
    "最大100件を表示します。Worker名で検索できます。",
  ]),
  pool: localized(["矿池", "礦池", "Pool", "채굴 풀", "マイニングプール"]),
  wallet: localized([
    "收益钱包地址",
    "收益錢包地址",
    "Payout wallet address",
    "보상 지갑 주소",
    "報酬ウォレットアドレス",
  ]),
  query: localized(["查询", "查詢", "Look up", "조회", "照会"]),
  balance: localized(["未支付余额", "未支付餘額", "Unpaid balance", "미지급 잔액", "未払い残高"]),
  paid: localized(["累计已支付", "累計已支付", "Total paid", "누적 지급액", "累計支払額"]),
  utcDay: localized([
    "今日收益 · UTC",
    "今日收益 · UTC",
    "Today's rewards · UTC",
    "오늘 보상 · UTC",
    "本日の報酬 · UTC",
  ]),
  rolling24h: localized([
    "近 24 小时收益",
    "近 24 小時收益",
    "Last 24h rewards",
    "최근 24시간 보상",
    "直近24時間の報酬",
  ]),
  rate: localized([
    "矿池算力",
    "礦池算力",
    "Pool-reported hashrate",
    "풀 보고 해시레이트",
    "プール報告ハッシュレート",
  ]),
  partial: localized([
    "部分数据未获取，请在矿池核对。",
    "部分資料未取得，請至礦池核對。",
    "Some data is unavailable. Check the pool.",
    "일부 데이터가 없습니다. 풀에서 확인하세요.",
    "一部データは未取得です。プールで確認してください。",
  ]),
  scope: localized([
    "收益属于整个钱包；选择 Worker 只筛选算力和状态。",
    "收益屬於整個錢包；選擇 Worker 僅篩選算力和狀態。",
    "Rewards belong to the wallet. A Worker selection filters only hashrate and status.",
    "보상은 지갑 전체 기준입니다. Worker 선택은 해시레이트와 상태만 필터링합니다.",
    "報酬はウォレット全体の値です。Worker選択はハッシュレートと状態のみ絞り込みます。",
  ]),
  source: localized(["在矿池核对", "至礦池核對", "Check on pool", "풀에서 확인", "プールで確認"]),
  notFound: localized([
    "当前矿池未找到此地址或 Worker，请检查矿池和挖矿配置。",
    "目前礦池未找到此地址或 Worker，請檢查礦池與挖礦設定。",
    "Address or Worker not found in this pool. Check your mining configuration.",
    "이 풀에서 주소 또는 Worker를 찾을 수 없습니다. 채굴 설정을 확인하세요.",
    "このプールにアドレスまたはWorkerがありません。採掘設定を確認してください。",
  ]),
  remove: localized(["移除", "移除", "Remove", "제거", "削除"]),
  worker: localized([
    "Worker（可选，留空查看整个钱包）",
    "Worker（選填，留空查看整個錢包）",
    "Worker (optional; blank for whole wallet)",
    "Worker (선택, 비우면 전체 지갑)",
    "Worker（任意、空欄でウォレット全体）",
  ]),
};
function editorial(p: PoolProject) {
  const name = POOL_PROJECTS[p].name,
    pool = poolName(p);
  return {
    title: localized([
      `${name} 矿机监控：算力、Worker 与收益`,
      `${name} 礦機監控：算力、Worker 與收益`,
      `${name} mining monitor: hashrate, Workers and rewards`,
      `${name} 채굴 모니터: 해시레이트, Worker와 보상`,
      `${name}採掘監視：ハッシュレート・Worker・報酬`,
    ]),
    summary: localized([
      `用 ${pool} 收益地址查看 ${name} 算力、Worker 状态和钱包收益，登录后保存多个地址。`,
      `用 ${pool} 收益地址查看 ${name} 算力、Worker 狀態與錢包收益，登入後儲存多個地址。`,
      `Check ${name} hashrate, Workers and wallet rewards on ${pool}. Sign in to save multiple addresses.`,
      `${pool} 주소로 ${name} 해시레이트, Worker 상태와 지갑 보상을 조회하고 로그인 후 여러 주소를 저장하세요.`,
      `${pool}のアドレスで${name}のハッシュレート・Worker・報酬を確認。ログインして複数アドレスを保存できます。`,
    ]),
    identity: localized([
      `填写 ${pool} 挖矿配置中的公开收益地址。只查询当前矿池，不代表全网钱包余额。`,
      `填寫 ${pool} 採礦設定中的公開收益地址。僅查詢目前礦池，不代表全網錢包餘額。`,
      `Use the public payout address configured in ${pool}. Results cover this pool, not the wallet balance across the network.`,
      `${pool} 채굴 설정의 공개 보상 주소를 입력하세요. 결과는 해당 풀 기준이며 네트워크 전체 지갑 잔액이 아닙니다.`,
      `${pool}の採掘設定にある公開報酬アドレスを入力。このプールの記録であり、ネットワーク全体のウォレット残高ではありません。`,
    ]),
    coverage: localized([
      `查看算力、Worker 状态、未支付余额和累计已支付。${poolProvider(p) === "kryptex" ? "今日收益按 UTC 自然日统计。" : "收益为滚动近 24 小时；仅支持 2Miners 普通矿池，不含 SOLO。"}收益属于整个钱包，Worker 只筛选算力与状态；缺失数据不会当作零收益。`,
      `查看算力、Worker 狀態、未支付餘額與累計已支付。${poolProvider(p) === "kryptex" ? "今日收益按 UTC 自然日統計。" : "收益為滾動近 24 小時；僅支援 2Miners 一般礦池，不含 SOLO。"}收益屬於整個錢包，Worker 僅篩選算力與狀態；缺失資料不視為零收益。`,
      `View hashrate, Worker status, unpaid balance and total paid. ${poolProvider(p) === "kryptex" ? "Today's rewards use the UTC calendar day." : "Rewards cover the rolling last 24 hours. Only regular 2Miners pools are supported, not SOLO."} Rewards are wallet-wide; Workers filter hashrate and status only. Missing data is not zero earnings.`,
      `해시레이트, Worker 상태, 미지급 잔액과 누적 지급액을 확인합니다. ${poolProvider(p) === "kryptex" ? "오늘 보상은 UTC 날짜 기준입니다." : "보상은 최근 24시간 기준입니다. 2Miners 일반 풀만 지원하며 SOLO는 제외됩니다."} 보상은 지갑 전체 기준이며 Worker는 해시레이트와 상태만 필터링합니다. 누락된 데이터는 0으로 처리하지 않습니다.`,
      `ハッシュレート、Worker状態、未払い残高、累計支払額を確認できます。${poolProvider(p) === "kryptex" ? "本日の報酬はUTCの暦日で集計します。" : "報酬は直近24時間の値です。2Minersの通常プールのみ対応し、SOLOは対象外です。"}報酬はウォレット全体の値です。Workerはハッシュレートと状態のみ絞り込み、欠損値はゼロにしません。`,
    ]),
  };
}
export const poolEditorial = Object.fromEntries(
  POOL_PROJECT_IDS.map((p) => [p, editorial(p)]),
) as Record<PoolProject, ReturnType<typeof editorial>>;
