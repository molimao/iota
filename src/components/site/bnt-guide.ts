import type { Article } from "./articles";
import { bntEditorial as c } from "../bnt-copy";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";
const title = l([
  "BNT 挖矿怎么查收益？Blocknet 地址、确认与支付",
  "BNT 挖礦如何查收益？Blocknet 地址、確認與支付",
  "How to check BNT mining rewards: Blocknet addresses and payments",
  "BNT 채굴 보상 확인: Blocknet 주소·확정·지급",
  "BNT採掘報酬の確認：Blocknetアドレス・確定・支払",
]);
const save = l([
  "打开 [BNT 监控](/projects/bnt)，复制 Seine 的完整主网收益地址查询。登录后点击添加地址，可一次输入多行，给每个地址命名并选择 Worker。每项目免费 3 台、Pro 100 台；同一钱包的 Worker 共用钱包余额。查询不会自动保存，保存后可同步、移除及关联已有设备。",
  "開啟 [BNT 監控](/projects/bnt)，複製 Seine 完整主網收益地址查詢。登入後新增地址，可多行輸入、命名及選擇 Worker。每專案免費 3 台、Pro 100 台。同錢包 Worker 共用餘額；查詢不會自動儲存，儲存後可同步、移除及關聯設備。",
  "Open [BNT monitoring](/projects/bnt) and copy the complete mainnet payout address from Seine. Sign in and add addresses using multiline input, names and optional Workers. Free allows three devices per project; Pro allows 100. Workers share the wallet balance. A lookup does not save automatically; saved entries sync and can be removed or linked to an existing device.",
  "[BNT 모니터](/projects/bnt)에 Seine의 전체 메인넷 보상 주소를 입력하세요. 로그인 후 여러 줄 주소·이름·Worker를 저장할 수 있습니다. 프로젝트당 무료 3대·Pro 100대입니다. Worker는 지갑 잔액을 공유합니다. 조회만으로 저장되지 않으며 저장 후 동기화·삭제·기기 연결이 가능합니다.",
  "[BNT監視](/projects/bnt)にSeineの完全なメインネット報酬アドレスを入力します。ログイン後は複数行・名称・任意Workerで保存できます。各プロジェクト無料3台、Pro100台。Workerは同じウォレット残高を共有します。照会だけでは保存されず、保存後は同期・削除・既存デバイスへの関連付けが可能です。",
]);
const troubleshooting = l([
  "查不到时，先确认使用的是 bntpool.com，再检查主网完整地址和受理份额。短名称需在 Seine 解析成完整地址，不能直接填进本监控。算力是矿池估算；低频提交份额时，短期零算力不证明进程停止。待成熟预估会随确认或区块作废变化，并非已到账或一天内赚到的钱。本页于 2026-10-18 使用 Seine 公开开发者收益地址核对矿池字段与 1e8 单位换算，没有用该账户收益估算个人回报。",
  "查不到時先核對 bntpool.com、完整主網地址與受理份額。短名稱須在 Seine 解析成完整地址。礦池估算算力在低頻份額時可能暫為零，不代表程序停止。待成熟預估會隨確認或區塊作廢改變，非已到帳或日收益。2026-10-18 使用 Seine 公開開發者收益地址核對欄位與 1e8 換算，未據此預測個人回報。",
  "If lookup fails, check bntpool.com, the full mainnet address and accepted shares. Resolve shortnames in Seine before using the full address here. Pool-estimated hashrate may temporarily be zero with infrequent shares and does not prove process failure. Immature estimates can change with confirmations or orphaned blocks; they are neither paid nor daily income. On 2026-10-18 we checked fields and the 1e8 conversion using Seine's published developer payout address, without extrapolating personal returns.",
  "조회 실패 시 bntpool.com·전체 메인넷 주소·수락된 지분을 확인하세요. 짧은 이름은 Seine에서 전체 주소로 해석한 후 사용합니다. 지분 제출이 드물면 추정 해시레이트가 일시적으로 0이 될 수 있으며 프로세스 중단의 증거가 아닙니다. 미성숙 예상 보상은 확정·고아 블록에 따라 달라져 지급액이나 일일 수익이 아닙니다. 2026-10-18 Seine의 공개 개발자 주소로 필드와 1e8 환산을 검증했으며 개인 수익을 추정하지 않았습니다.",
  "照会に失敗したらbntpool.com・完全なメインネットアドレス・受理シェアを確認。短縮名はSeineで完全アドレスに解決してください。シェアが少ないと一時的に算力ゼロでも停止の証明にはなりません。未成熟推定額は確定や孤立ブロックで変化し、支払済み・日次収益ではありません。2026-10-18にSeineの公開開発者アドレスで項目と1e8換算を確認しましたが、個人利益の予測には使っていません。",
]);
const qs = [
  {
    q: l([
      "这是哪个 BNT？",
      "這是哪個 BNT？",
      "Which BNT is this?",
      "어떤 BNT인가요?",
      "どのBNTですか？",
    ]),
    a: c.identity,
  },
  {
    q: l([
      "预估、确认和支付有什么区别？",
      "預估、確認與支付有何區別？",
      "How do estimates, confirmed rewards and payments differ?",
      "예상·확정·지급의 차이는?",
      "推定・確定・支払の違いは？",
    ]),
    a: c.coverage,
  },
  {
    q: l([
      "如何保存多个 BNT 地址？",
      "如何儲存多個 BNT 地址？",
      "How can I save multiple BNT addresses?",
      "BNT 주소 여러 개를 저장하려면?",
      "BNTアドレスを複数保存するには？",
    ]),
    a: save,
  },
  {
    q: l([
      "查不到地址或算力为零怎么办？",
      "查不到地址或算力為零怎麼辦？",
      "What if the address is missing or hashrate is zero?",
      "주소 미조회·해시레이트 0일 때는?",
      "照会不可・算力ゼロのときは？",
    ]),
    a: troubleshooting,
  },
];
export const bntGuide: Article = {
  slug: "blocknet-bnt-monitor-guide",
  project: "bnt",
  published: "2026-10-18",
  modified: "2026-10-18",
  title,
  description: c.summary,
  summary: c.summary,
  topic: l(["BNT 使用说明", "BNT 使用說明", "BNT guide", "BNT 안내", "BNTガイド"]),
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
    { name: "Blocknet protocol", url: "https://blocknetcrypto.com/" },
    { name: "Seine mining and platform support", url: "https://github.com/zpalmtree/seine" },
    {
      name: "Seine address checksum implementation",
      url: "https://github.com/zpalmtree/seine/blob/master/src/address.rs",
    },
    { name: "bntpool.com", url: "https://bntpool.com/start" },
  ],
};
