import { tscPoolCopy } from "./tensorcash-pool-copy";
import { tscCopy } from "./tensorcash-copy";
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
  ckpoolEarnings: localized([
    "CKPool 为 Solo 挖矿。当前接口提供算力和份额记录，暂不提供余额及收益。出块与到账请到矿池或链上核对。",
    "CKPool 為 Solo 挖礦。目前介面提供算力與份額紀錄，暫不提供餘額及收益。出塊與到帳請至礦池或鏈上核對。",
    "CKPool is a solo pool. Its current API provides hashrate and shares, but not balances or earnings. Check the pool or blockchain for blocks found and payments.",
    "CKPool은 솔로 풀입니다. 현재 API는 해시레이트와 셰어를 제공하지만 잔액과 수익은 제공하지 않습니다. 블록 발견과 지급은 풀이나 블록체인에서 확인하세요.",
    "CKPoolはソロプールです。現在のAPIで確認できるのはハッシュレートとシェアで、残高や収益は含まれません。発見ブロックと支払はプールやブロックチェーンで確認してください。",
  ]),
  ckpoolWindow: localized([
    "算力窗口：1 小时。地址和 Worker 使用同一窗口。",
    "算力視窗：1 小時。地址和 Worker 使用同一視窗。",
    "Hashrate window: 1 hour, for both the address and each Worker.",
    "해시레이트 창: 1시간. 주소와 Worker가 같은 창입니다.",
    "算力の窓: 1時間。アドレスと各Workerは同じ窓です。",
  ]),
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
    "仅统计 2Miners 普通矿池。收益按地址汇总，近 24 小时为滚动周期。",
    "僅統計 2Miners 一般礦池。收益依地址彙總，近 24 小時為滾動週期。",
    "Regular 2Miners pool only. Rewards are wallet-wide; the last 24 hours are a rolling window.",
    "2Miners 일반 풀 기준입니다. 보상은 주소별로 합산하며 최근 24시간은 이동 기간입니다.",
    "2Miners通常プールのみ。報酬はアドレス単位で、直近24時間は移動期間です。",
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
    "仅统计 2Miners 普通矿池。收益按地址汇总，近 24 小时为滚动周期。",
    "僅統計 2Miners 一般礦池。收益依地址彙總，近 24 小時為滾動週期。",
    "Regular 2Miners pool only. Rewards are wallet-wide; the last 24 hours are a rolling window.",
    "2Miners 일반 풀 기준입니다. 보상은 주소별로 합산하며 최근 24시간은 이동 기간입니다.",
    "2Miners通常プールのみ。報酬はアドレス単位で、直近24時間は移動期間です。",
  ]),
};
function editorial(p: PoolProject) {
  if (p === "tsc")
    return {
      title: tscPoolCopy.title,
      summary: tscPoolCopy.summary,
      identity: tscCopy.identity,
      coverage: tscPoolCopy.scope,
    };
  if (p === "csd") return csdEditorial;
  if (p === "bnt") return bntEditorial;
  if (p === "mds") return mdsEditorial;
  if (p === "erg") return ergEditorial;
  if (p === "zeph") return zephEditorial;
  if (p === "btc")
    return {
      title: localized([
        "Bitcoin 矿机监控：CKPool 算力与 Worker",
        "Bitcoin 礦機監控：CKPool 算力與 Worker",
        "Bitcoin mining monitor: CKPool hashrate and Workers",
        "Bitcoin 채굴 모니터: CKPool 해시레이트와 Worker",
        "Bitcoin採掘監視：CKPoolのハッシュレートとWorker",
      ]),
      summary: localized([
        "添加 CKPool 的比特币主网地址，查看 1 小时平均算力和地址下的 Worker。",
        "新增 CKPool 的比特幣主網地址，查看 1 小時平均算力與地址下的 Worker。",
        "Add a Bitcoin mainnet address from CKPool to see its one-hour average hashrate and Workers.",
        "CKPool의 비트코인 메인넷 주소를 추가해 1시간 평균 해시레이트와 주소에 속한 Worker를 확인하세요.",
        "CKPoolのビットコインメインネットアドレスを追加して、1時間平均ハッシュレートとそのアドレスのWorkerを確認できます。",
      ]),
      identity: localized([
        "填写 CKPool 使用的比特币主网地址：1、3、bc1q 或 bc1p。不接受测试网、大小写混用的 bech32、错误校验和或链接。",
        "填寫 CKPool 使用的比特幣主網地址：1、3、bc1q 或 bc1p。不接受測試網、大小寫混用的 bech32、錯誤校驗和或連結。",
        "Enter the Bitcoin mainnet address used at CKPool: 1, 3, bc1q, or bc1p. Testnet, mixed-case bech32, a bad checksum, and links are rejected.",
        "CKPool에 쓰는 비트코인 메인넷 주소를 입력하세요. 1, 3, bc1q, bc1p입니다. 테스트넷, 대소문자 혼합 bech32, 잘못된 체크섬, 링크는 거부합니다.",
        "CKPoolで使うビットコインのメインネットアドレスを入力します。1、3、bc1q、bc1pです。テストネット、大文字小文字混在のbech32、誤ったチェックサム、リンクは拒否します。",
      ]),
      coverage: localized([
    "CKPool 算力为 1 小时平均值，Worker 状态按最近份额判断。矿池暂不提供余额和收益。",
    "CKPool 算力為 1 小時平均值，Worker 狀態依最近份額判斷。礦池暫不提供餘額與收益。",
    "CKPool hashrate is a one-hour average; Worker status uses recent shares. Balance and earnings are unavailable.",
    "CKPool 해시레이트는 1시간 평균이며 Worker 상태는 최근 셰어 기준입니다. 잔액과 수익은 제공되지 않습니다.",
    "CKPoolの算力は1時間平均、Worker状態は直近シェアに基づきます。残高と収益は提供されていません。",
  ]),
    };
  if (p === "ethw")
    return {
      title: localized([
        "EthereumPoW 矿机监控：2Miners 算力、Worker 与收益",
        "EthereumPoW 礦機監控：2Miners 算力、Worker 與收益",
        "EthereumPoW mining monitor: 2Miners hashrate, Workers and rewards",
        "EthereumPoW 채굴 모니터: 2Miners 해시레이트, Worker와 보상",
        "EthereumPoW採掘監視：2Minersのハッシュレート・Worker・報酬",
      ]),
      summary: localized([
        "用 ethw.2miners.com 的 0x 地址查看 ETHash 算力、Worker 和钱包收益。不是 SOLO，也不是以太坊 ETH 余额。",
        "用 ethw.2miners.com 的 0x 地址查看 ETHash 算力、Worker 與錢包收益。不是 SOLO，也不是以太坊 ETH 餘額。",
        "Check ETHash hashrate, Workers and wallet rewards on ethw.2miners.com with a 0x address. This is not SOLO and not an Ethereum ETH balance.",
        "ethw.2miners.com의 0x 주소로 ETHash 해시레이트, Worker와 지갑 보상을 확인합니다. SOLO도 아니고 이더리움 ETH 잔액도 아닙니다.",
        "ethw.2miners.comの0xアドレスでETHashのハッシュレート・Worker・報酬を確認します。SOLOでもイーサリアムのETH残高でもありません。",
      ]),
      identity: localized([
        "填写普通矿池 ethw.2miners.com 的 0x 后 40 位十六进制地址。不查询 solo-ethw.2miners.com。",
        "填寫一般礦池 ethw.2miners.com 的 0x 後 40 位十六進位地址。不查詢 solo-ethw.2miners.com。",
        "Enter the 0x address with 40 hexadecimal characters from the regular ethw.2miners.com pool. solo-ethw.2miners.com is not queried.",
        "일반 풀 ethw.2miners.com의 0x와 16진수 40자리를 입력하세요. solo-ethw.2miners.com은 조회하지 않습니다.",
        "通常プール ethw.2miners.com の0xに続く16進40文字を入力します。solo-ethw.2miners.comは照会しません。",
      ]),
      coverage: localized([
        "余额、已支付和近 24 小时按账户支付单位换算，与 2Miners 账户页的 DH 支付倍率一致。缺少 paid 时不把空的 payments 或 sumrewards 加成累计已支付。收益属于整个地址。Worker 历史只有 5 分钟、30 分钟和 6 小时，不编造 24 小时曲线。",
        "餘額、已支付和近 24 小時按帳戶支付單位換算，與 2Miners 帳戶頁的 DH 支付倍率一致。缺少 paid 時不把空的 payments 或 sumrewards 加成累計已支付。收益屬於整個地址。Worker 歷史只有 5 分鐘、30 分鐘和 6 小時，不編造 24 小時曲線。",
        "Balance, paid, and the last 24 hours use the account payment unit, the same DH payment multiplier as the 2Miners account page. A missing paid field is not filled from empty payments or by summing sumrewards. Rewards belong to the address. Worker history is only 5 minutes, 30 minutes, and 6 hours; there is no invented 24-hour chart.",
        "잔액, 지급, 최근 24시간은 계정 지급 단위이며 2Miners 계정 페이지의 DH 지급 배율과 같습니다. paid가 없으면 빈 payments나 sumrewards 합으로 누적 지급을 만들지 않습니다. 보상은 주소 전체입니다. Worker 이력은 5분, 30분, 6시간뿐이며 24시간 곡선은 만들지 않습니다.",
        "残高、支払、直近24時間は口座の支払い単位で、2Miners口座ページのDH支払い倍率と同じです。paidが無ければ空のpaymentsやsumrewardsの合計を累計支払にしません。報酬はアドレス全体です。Worker履歴は5分、30分、6時間だけで、24時間の曲線は作りません。",
      ]),
    };
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
      `${poolProvider(p) === "kryptex" ? "今日收益按 UTC 统计。" : "收益为近 24 小时，仅支持 2Miners 普通矿池。"}收益属于整个钱包。`,
      `${poolProvider(p) === "kryptex" ? "今日收益按 UTC 統計。" : "收益為近 24 小時，僅支援 2Miners 一般礦池。"}收益屬於整個錢包。`,
      `${poolProvider(p) === "kryptex" ? "Today’s rewards use UTC." : "Rewards cover the last 24 hours; regular 2Miners pools only."} Rewards are wallet-wide.`,
      `${poolProvider(p) === "kryptex" ? "오늘 보상은 UTC 기준입니다." : "보상은 최근 24시간 기준이며 2Miners 일반 풀만 지원합니다."} 보상은 지갑 전체 기준입니다.`,
      `${poolProvider(p) === "kryptex" ? "本日の報酬はUTCで集計します。" : "報酬は直近24時間で、2Minersの通常プールのみ対応します。"}報酬はウォレット全体の値です。`,
    ]),
  };
}
export const poolEditorial = Object.fromEntries(
  POOL_PROJECT_IDS.map((p) => [p, editorial(p)]),
) as Record<PoolProject, ReturnType<typeof editorial>>;
