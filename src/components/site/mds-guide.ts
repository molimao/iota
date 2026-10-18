import type { Article } from "./articles";
import { mdsEditorial as c } from "../mds-copy";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";
const title = l([
  "Midstate MDS 怎么查矿池收益？地址、Worker 与单位说明",
  "Midstate MDS 如何查礦池收益？地址、Worker 與單位",
  "How to check Midstate MDS pool rewards, addresses and units",
  "Midstate MDS 풀 보상·주소·단위 확인 방법",
  "Midstate MDSのプール報酬・アドレス・単位の確認方法",
]);
const questions = [
  {
    q: l([
      "查询填哪个地址？",
      "查詢填哪個地址？",
      "Which address should I enter?",
      "어떤 주소를 입력하나요?",
      "どのアドレスを入力する？",
    ]),
    a: c.identity,
  },
  {
    q: l([
      "收益、支付与单位有什么区别？",
      "收益、支付與單位有何區別？",
      "How do rewards, payments and units differ?",
      "보상·지급·단위는 어떻게 다른가요?",
      "報酬・支払・単位の違いは？",
    ]),
    a: c.coverage,
  },
  {
    q: l([
      "能保存多个地址吗？查不到怎么办？",
      "能儲存多個地址嗎？查不到怎麼辦？",
      "Can I save multiple addresses, and what if lookup fails?",
      "여러 주소를 저장하거나 조회 실패 시 어떻게 하나요?",
      "複数アドレスの保存と照会失敗時の確認は？",
    ]),
    a: l([
      "在 [Midstate 监控](/projects/mds) 登录后保存地址，可一次输入多行，分别命名并选择 Worker。每项目免费 5 台、Pro 50 台，支持移除与同步。查询本身不等于已保存。当前只接入 LuckyPool；其他矿池或 solo 地址查不到，不表示没在挖。先核对矿池、64 位 MSS 地址及有效份额，再看抓取时间；接口失败保留原数据并标注，缺失收益不当作零。",
      "在 [Midstate 監控](/projects/mds) 登入後可多行新增地址、分別命名及選擇 Worker，每專案免費 5 台、Pro 50 台，可移除及同步。查詢不等於儲存。目前僅 LuckyPool，其他池或 solo 查不到不代表沒採礦。核對礦池、64 位 MSS 地址、有效份額及取得時間；失敗標示原資料，缺失不視為零。",
      "Sign in to [Midstate monitoring](/projects/mds) to save multiple addresses, including multiline entry, names and optional Worker selection. Free allows five devices per project, Pro 50; entries can be removed and synced. A lookup alone is not a save. Only LuckyPool is covered. An absent solo or other-pool address does not prove stopped mining. Check pool, exact 64-character MSS address, accepted shares and fetch time. Failed reads retain labeled previous data; missing rewards stay unknown.",
      "[Midstate 모니터](/projects/mds)에 로그인해 여러 줄 주소·이름·Worker를 저장하고 동기화·삭제할 수 있습니다. 프로젝트당 무료 5대·Pro 50대이며 조회만으로 저장되지는 않습니다. LuckyPool만 지원하므로 다른 풀이나 solo 주소 미조회는 채굴 중단을 뜻하지 않습니다. 풀·64자리 MSS 주소·유효 지분·조회 시각을 확인하세요. 실패 시 이전 데이터와 표시를 유지하며 누락을 0으로 만들지 않습니다.",
      "[Midstate監視](/projects/mds)にログインすると複数行のアドレス・名称・任意Workerを保存し、同期・削除できます。各プロジェクト無料5台、Pro50台で、照会だけでは保存されません。LuckyPoolのみのため他プールやsoloの不在は停止の証明ではありません。プール・64桁MSS・受理シェア・取得時刻を確認します。失敗時は以前の情報と表示を保ち、欠損はゼロにしません。",
    ]),
  },
];
export const mdsGuide: Article = {
  slug: "midstate-mds-monitor-guide",
  project: "mds",
  published: "2026-10-17",
  modified: "2026-10-17",
  title,
  description: c.summary,
  summary: c.summary,
  topic: l([
    "Midstate 使用说明",
    "Midstate 使用說明",
    "Midstate guide",
    "Midstate 안내",
    "Midstateガイド",
  ]),
  body: Object.fromEntries(
    LOCALES.map((locale) => [locale, questions.flatMap((q) => [`## ${q.q[locale]}`, q.a[locale]])]),
  ) as Article["body"],
  questions: Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      questions.map((q) => ({
        question: q.q[locale],
        answer: q.a[locale].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
      })),
    ]),
  ) as NonNullable<Article["questions"]>,
  sources: [
    { name: "Midstate · protocol and binary units", url: "https://midstate.cash/" },
    {
      name: "Midstate · official MSS pool guide",
      url: "https://github.com/ciphernom/midstate/blob/main/pools.md",
    },
    { name: "LuckyPool · Midstate", url: "https://midstate.luckypool.io/" },
  ],
};
