import { csdEditorial } from "./csd-copy";
import { bntEditorial } from "./bnt-copy";
import { mdsEditorial } from "./mds-copy";
import { localized } from "@/lib/product-discovery";
import {
  POOL_PROJECT_IDS,
  POOL_PROJECTS,
  poolName,
  poolProvider,
  type PoolProject,
} from "@/lib/pool-projects";
export const poolCopy = {
  unknown: localized([
    "收益周期未提供",
    "收益週期未提供",
    "Reward period unavailable",
    "보상 기간 미제공",
    "報酬期間未提供",
  ]),
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
const ergEditorial = {
  title: localized([
    "Ergo 矿机监控：2Miners 算力、Worker 与收益",
    "Ergo 礦機監控：2Miners 算力、Worker 與收益",
    "Ergo mining monitor: 2Miners hashrate, Workers and rewards",
    "Ergo 채굴 모니터: 2Miners 해시레이트, Worker와 보상",
    "Ergo採掘監視：2Minersのハッシュレート・Worker・報酬",
  ]),
  summary: localized([
    "用 erg.2miners.com 的主网 P2PK 地址查看 Ergo 矿池算力、Worker 和钱包收益。不是全网余额，也不覆盖其他矿池。",
    "用 erg.2miners.com 的主網 P2PK 地址查看 Ergo 礦池算力、Worker 與錢包收益。不是全網餘額，也不涵蓋其他礦池。",
    "Check Ergo pool hashrate, Workers and wallet rewards on erg.2miners.com with a mainnet P2PK address. This is not a network-wide balance and does not cover other pools.",
    "erg.2miners.com의 메인넷 P2PK 주소로 Ergo 풀 해시레이트, Worker와 지갑 보상을 확인합니다. 네트워크 전체 잔액이 아니며 다른 풀은 포함하지 않습니다.",
    "erg.2miners.comのメインネットP2PKアドレスでErgoプールのハッシュレート・Worker・報酬を確認します。ネットワーク全体の残高ではなく、他プールは対象外です。",
  ]),
  identity: localized([
    "填写 erg.2miners.com 使用的 Ergo 主网收款地址（以 9 开头的 P2PK 地址）。暂不支持测试网、其他地址类型及 SOLO 矿池。",
    "填寫 erg.2miners.com 使用的 Ergo 主網收款地址（以 9 開頭的 P2PK 地址）。暫不支援測試網、其他地址類型與 SOLO 礦池。",
    "Enter the Ergo mainnet P2PK payout address you use on erg.2miners.com, beginning with 9. Testnet, other address types and SOLO pools are not supported.",
    "erg.2miners.com에서 사용하는 9로 시작하는 Ergo 메인넷 P2PK 보상 주소를 입력하세요. 테스트넷, 다른 주소 유형과 SOLO 풀은 아직 지원하지 않습니다.",
    "erg.2miners.comで使う、9から始まるErgoメインネットのP2PK報酬アドレスを入力してください。テストネット、その他のアドレス形式、SOLOプールは未対応です。",
  ]),
  coverage: localized([
    "展示 erg.2miners.com 普通矿池的算力、Worker 状态、未支付余额、累计已支付及滚动近 24 小时收益，不是全网余额，不含 SOLO 或其他矿池，也不是 IOTA 昨日记账。1 ERG = 1e9 支付单位。收益属于整个地址，多个 Worker 不会各算一台设备；没有数据时保持未知，不显示为 0，也不提供美元报价或保本收益。",
    "顯示 erg.2miners.com 一般礦池的算力、Worker 狀態、未支付餘額、累計已支付與滾動近 24 小時收益，不是全網餘額，不含 SOLO 或其他礦池，也不是 IOTA 昨日記帳。1 ERG = 1e9 支付單位。收益屬於整個地址，多個 Worker 不會各算一台設備；沒有資料時保持未知，不顯示為 0，也不提供美元報價或保本收益。",
    "View hashrate, Worker status, unpaid balance, total paid and rolling 24-hour rewards from the regular erg.2miners.com pool. This is not the network balance, not SOLO, not other pools and not IOTA's previous-day ledger. 1 ERG uses 1e9 payment units. Rewards belong to the address; Workers are not extra devices. Missing data stays unknown, is not shown as zero, and no USD quote or guaranteed return is provided.",
    "erg.2miners.com 일반 풀의 해시레이트, Worker 상태, 미지급 잔액, 누적 지급액과 최근 24시간 보상을 표시합니다. 네트워크 전체 잔액도, SOLO나 다른 풀도, IOTA의 어제 장부도 아닙니다. 1 ERG = 1e9 지급 단위입니다. 보상은 주소 전체이며 Worker를 추가 기기로 세지 않습니다. 빠진 값은 알 수 없음으로 두고 0으로 표시하지 않으며 USD 시세나 원금 보장 수익을 만들지 않습니다.",
    "erg.2miners.com通常プールのハッシュレート、Worker状態、未払い残高、累計支払額、直近24時間の報酬を表示します。ネットワーク全体の残高でも、SOLOや他プールでも、IOTAの前日台帳でもありません。1 ERG = 1e9 支払い単位です。報酬はアドレス全体で、Workerを追加デバイスとして数えません。欠損値は不明のままにし、0やUSD換算、元本保証の収益にはしません。",
  ]),
};
const zephEditorial = {
  title: localized([
    "Zephyr 矿机监控：2Miners 算力、Worker 与收益",
    "Zephyr 礦機監控：2Miners 算力、Worker 與收益",
    "Zephyr mining monitor: 2Miners hashrate, Workers and rewards",
    "Zephyr 채굴 모니터: 2Miners 해시레이트, Worker와 보상",
    "Zephyr採掘監視：2Minersのハッシュレート・Worker・報酬",
  ]),
  summary: localized([
    "用 zeph.2miners.com 的 Zephyr 主网标准地址查看矿池算力、Worker 和钱包收益。不是全网余额，也不覆盖其他矿池。",
    "用 zeph.2miners.com 的 Zephyr 主網標準地址查看礦池算力、Worker 與錢包收益。不是全網餘額，也不涵蓋其他礦池。",
    "Check Zephyr pool hashrate, Workers and wallet rewards on zeph.2miners.com with a mainnet standard address. This is not a network-wide balance and does not cover other pools.",
    "zeph.2miners.com의 Zephyr 메인넷 표준 주소로 풀 해시레이트, Worker와 지갑 보상을 확인합니다. 네트워크 전체 잔액이 아니며 다른 풀은 포함하지 않습니다.",
    "zeph.2miners.comのZephyrメインネット標準アドレスでプールのハッシュレート・Worker・報酬を確認します。ネットワーク全体の残高ではなく、他プールは対象外です。",
  ]),
  identity: localized([
    "填写 zeph.2miners.com 使用的主网标准收款地址，以 ZEPHYR 开头。暂不支持集成地址、子地址、测试网或 SOLO 矿池。",
    "填寫 zeph.2miners.com 使用的主網標準收款地址，以 ZEPHYR 開頭。暫不支援整合地址、子地址、測試網與 SOLO 礦池。",
    "Enter the mainnet standard payout address you use on zeph.2miners.com, beginning with ZEPHYR. Integrated addresses, subaddresses, testnet and SOLO pools are not supported yet.",
    "zeph.2miners.com에서 사용하는 ZEPHYR로 시작하는 메인넷 표준 보상 주소를 입력하세요. 통합 주소, 서브주소, 테스트넷과 SOLO 풀은 아직 지원하지 않습니다.",
    "zeph.2miners.comで使う、ZEPHYRから始まるメインネット標準報酬アドレスを入力してください。統合アドレス、サブアドレス、テストネット、SOLOプールは未対応です。",
  ]),
  coverage: localized([
    "展示 zeph.2miners.com 普通矿池的算力、Worker 状态、未支付余额、累计已支付及滚动近 24 小时收益，不是全网余额，不含 SOLO 或其他矿池，也不是 IOTA 昨日记账。RandomX 按 1 ZEPH = 1e12 支付单位换算。收益属于整个地址，多个 Worker 不会各算一台设备；没有数据时保持未知，不显示为 0，也不提供美元报价或保本收益。",
    "顯示 zeph.2miners.com 一般礦池的算力、Worker 狀態、未支付餘額、累計已支付與滾動近 24 小時收益，不是全網餘額，不含 SOLO 或其他礦池，也不是 IOTA 昨日記帳。RandomX 按 1 ZEPH = 1e12 支付單位換算。收益屬於整個地址，多個 Worker 不會各算一台設備；沒有資料時保持未知，不顯示為 0，也不提供美元報價或保本收益。",
    "View hashrate, Worker status, unpaid balance, total paid and rolling 24-hour rewards from the regular zeph.2miners.com pool. This is not the network balance, not SOLO, not other pools and not IOTA's previous-day ledger. RandomX amounts use 1e12 payment units per ZEPH. Rewards belong to the address; Workers are not extra devices. Missing data stays unknown, is not shown as zero, and no USD quote or guaranteed return is provided.",
    "zeph.2miners.com 일반 풀의 해시레이트, Worker 상태, 미지급 잔액, 누적 지급액과 최근 24시간 보상을 표시합니다. 네트워크 전체 잔액도, SOLO나 다른 풀도, IOTA의 어제 장부도 아닙니다. RandomX는 1 ZEPH = 1e12 지급 단위입니다. 보상은 주소 전체이며 Worker를 추가 기기로 세지 않습니다. 빠진 값은 알 수 없음으로 두고 0으로 표시하지 않으며 USD 시세나 원금 보장 수익을 만들지 않습니다.",
    "zeph.2miners.com通常プールのハッシュレート、Worker状態、未払い残高、累計支払額、直近24時間の報酬を表示します。ネットワーク全体の残高でも、SOLOや他プールでも、IOTAの前日台帳でもありません。RandomXは1 ZEPH = 1e12 支払い単位です。報酬はアドレス全体で、Workerを追加デバイスとして数えません。欠損値は不明のままにし、0やUSD換算、元本保証の収益にはしません。",
  ]),
};
function editorial(p: PoolProject) {
  if (p === "csd") return csdEditorial;
  if (p === "bnt") return bntEditorial;
  if (p === "mds") return mdsEditorial;
  if (p === "erg") return ergEditorial;
  if (p === "zeph") return zephEditorial;
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
