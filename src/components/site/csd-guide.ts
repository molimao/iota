import type { Article } from "./articles";
import { csdEditorial as c } from "../csd-copy";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";
const title = l([
  "CSD 挖矿如何查算力和收益？G-pools 地址与结算说明",
  "CSD 挖礦如何查算力與收益？G-pools 地址與結算",
  "How to check CSD mining hashrate and G-pools payments",
  "CSD 채굴 해시레이트·G-pools 지급 확인 방법",
  "CSD採掘のハッシュレート・G-pools支払の確認方法",
]);
const save = l([
  "在 [CSD 监控](/projects/csd) 输入矿工配置中的 addr20。登录后可一次输入多个地址，分别命名和选择 Worker；每项目免费 5 台、Pro 50 台，已保存地址入库同步。40 位地址与加 0x 的同一地址会视为一个，避免重复添加。Worker 是矿池标签，不一定对应一台物理机器。",
  "在 [CSD 監控](/projects/csd) 輸入 addr20。登入後可多行新增地址、命名與選擇 Worker，每專案免費 5 台、Pro 50 台，儲存後入庫同步。40 位地址及相同 0x 地址視為一個，Worker 不一定對應一台機器。",
  "Enter your miner's addr20 in [CSD monitoring](/projects/csd). Sign in to save multiline addresses, names and Workers to your account database. Free allows five devices per project; Pro 50. An address with and without 0x is the same saved identity. Worker labels do not establish physical machine counts.",
  "[CSD 모니터](/projects/csd)에 addr20을 입력하세요. 로그인 후 여러 줄 주소·이름·Worker를 계정 데이터베이스에 저장합니다. 프로젝트당 무료 5대·Pro 50대입니다. 0x 유무는 같은 주소로 처리하며 Worker 이름이 물리 기기 수를 보장하지 않습니다.",
  "[CSD監視](/projects/csd)にaddr20を入力。ログイン後は複数行のアドレス・名称・Workerをデータベースに保存・同期します。各プロジェクト無料5台、Pro50台。0xの有無は同一アドレスとして扱い、Worker名を物理台数とみなしません。",
]);
const evidence = l([
  "2026-10-18 使用 G-pools 公开贡献榜地址核对 /api/miner/{addr20} 与 /miners.json。矿池账户的 owed_sat、pending_sat、lifetime_paid_sat 与 CSD 展示字段按 1e8 对应；账户及 Worker 算力均采用 hr1h。统计快照超过 5 分钟时不纳入当前算力汇总。矿池网页按支付窗口与余额分摊得到的时段收入含估算，因此这里不把它当作昨日收益。查不到时先核对矿池、地址和受理份额，不要因短时零算力直接重启。",
  "2026-10-18 以 G-pools 公開榜地址核對 /api/miner/{addr20} 及 /miners.json。owed_sat、pending_sat、lifetime_paid_sat 按 1e8 換算，算力採用 hr1h；超過 5 分鐘快照不納入當前算力。礦池時段收入包含支付窗口與餘額分攤估算，不作昨日收益。查不到先核對池、地址與份額，勿因短期零算力直接重啟。",
  "On 2026-10-18 we checked /api/miner/{addr20} and /miners.json using a public G-pools leaderboard address. owed_sat, pending_sat and lifetime_paid_sat match displayed CSD after dividing by 1e8. Both account and Worker rates use hr1h; snapshots older than five minutes are excluded from current compute totals. The pool's windowed income includes payment-window and balance-apportionment estimates, so we do not label it yesterday's earnings. Check pool, address and accepted shares before reacting to a brief zero rate.",
  "2026-10-18 공개 G-pools 순위 주소로 /api/miner/{addr20}와 /miners.json을 확인했습니다. owed_sat·pending_sat·lifetime_paid_sat는 1e8로 환산하고 계정·Worker는 hr1h를 사용합니다. 5분 넘은 스냅샷은 현재 연산 합계에서 제외합니다. 기간 수익에는 지급 구간·잔액 배분 추정이 포함되어 어제 수익으로 표시하지 않습니다. 일시적 0 해시레이트만으로 재시작하지 말고 풀·주소·유효 지분을 확인하세요.",
  "2026-10-18に公開G-poolsランキングのアドレスで/api/miner/{addr20}と/miners.jsonを確認。owed_sat・pending_sat・lifetime_paid_satは1e8で換算し、アカウントとWorkerはhr1hを使用。5分超のスナップショットは現在の合計から除外します。期間収益は支払期間・残高按分の推定を含むため昨日の収益とは表示しません。一時的なゼロで再起動せず、プール・アドレス・受理シェアを確認してください。",
]);
const qs = [
  {
    q: l([
      "CSD 是哪个项目？地址怎么填？",
      "CSD 是哪個專案？地址怎麼填？",
      "Which CSD is this and which address should I use?",
      "CSD 프로젝트와 주소는?",
      "CSDのプロジェクトと入力アドレスは？",
    ]),
    a: c.identity,
  },
  {
    q: l([
      "为什么未支付、确认中和支付金额不同？",
      "為何未支付、確認中與已支付不同？",
      "Why do unpaid, confirming and paid amounts differ?",
      "미지급·확인 중·지급 금액이 다른 이유는?",
      "未払い・承認待ち・支払済みの違いは？",
    ]),
    a: c.coverage,
  },
  {
    q: l([
      "能保存多个地址吗？",
      "能儲存多個地址嗎？",
      "Can I save multiple addresses?",
      "여러 주소를 저장할 수 있나요?",
      "複数アドレスを保存できる？",
    ]),
    a: save,
  },
  {
    q: l([
      "数据验证了什么？算力为零怎么办？",
      "資料驗證了什麼？算力為零怎麼辦？",
      "What was verified, and what if hashrate is zero?",
      "검증 범위와 해시레이트 0일 때는?",
      "検証範囲と算力ゼロのときは？",
    ]),
    a: evidence,
  },
];
export const csdGuide: Article = {
  slug: "csd-gpools-monitor-guide",
  project: "csd",
  published: "2026-10-18",
  modified: "2026-10-18",
  title,
  description: c.summary,
  summary: c.summary,
  topic: l(["CSD 使用说明", "CSD 使用說明", "CSD guide", "CSD 안내", "CSDガイド"]),
  body: Object.fromEntries(
    LOCALES.map((locale) => [locale, qs.flatMap((q) => [`## ${q.q[locale]}`, q.a[locale]])]),
  ) as Article["body"],
  questions: Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      qs.map((q) => ({
        question: q.q[locale],
        answer: q.a[locale].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
      })),
    ]),
  ) as NonNullable<Article["questions"]>,
  sources: [
    { name: "Compute Substrate", url: "https://computesubstrate.org/" },
    { name: "CSD mining client", url: "https://github.com/dangraagu/CSD-Mining-pool-public" },
    { name: "G-pools public dashboard and field definitions", url: "https://csd.yamaduo.no/" },
  ],
};
