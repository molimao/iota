import { tscPoolCopy } from "../tensorcash-pool-copy";
import type { Article } from "./articles";
import { tscCopy as c } from "../tensorcash-copy";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";
const save = l([
  "在 [TensorCash 监控](/projects/tsc) 输入完整 tc1 地址查询。登录后可每行添加一个地址并命名，保存到账号数据库；在“我的设备”关联其他项目后，也能从总览查看。只用公开地址，不需要矿池 Token、私钥或助记词。",
  "在 [TensorCash 監控](/projects/tsc) 輸入完整 tc1 地址查詢。登入後可每行新增一個地址並命名，保存至帳號資料庫；亦可在「我的設備」關聯其他專案並從總覽查看。只需公開地址，不需礦池 Token、私鑰或助記詞。",
  "Enter your full tc1 address in [TensorCash monitoring](/projects/tsc). Sign in to save one address per line with a name to your account database. Link projects in My devices and view them in Overview. Only a public address is needed, never a pool token, private key or recovery phrase.",
  "[TensorCash 모니터](/projects/tsc)에 전체 tc1 주소를 입력하세요. 로그인하면 한 줄에 하나씩 이름과 함께 계정 데이터베이스에 저장합니다. 내 기기에서 다른 프로젝트를 연결하고 개요에서 확인할 수 있습니다. 공개 주소만 필요하며 풀 토큰, 비밀키, 복구 문구는 필요하지 않습니다.",
  "[TensorCash監視](/projects/tsc)に完全なtc1アドレスを入力。ログイン後は1行1アドレスを名前付きでアカウントDBに保存します。マイデバイスで他プロジェクトを関連付け、概要で確認できます。プールToken・秘密鍵・復元フレーズは不要です。",
]);
const missing = l([
  "先核对地址所属网络和完整校验码。新地址可能没有已确认交易；接口同步、限流或中断时，本站显示暂不可用，不把失败当作零余额。官方主 API 不可用时会尝试官方备用 API。需要核对时，把同一地址放到 [官方浏览器](https://scan.tensorcash.org/) 搜索。",
  "先核對地址網路及完整校驗碼。新地址可能沒有已確認交易；同步、限流或中斷時顯示暫不可用，不把失敗當作零餘額。主 API 不可用時嘗試官方備用 API，可在[官方瀏覽器](https://scan.tensorcash.org/)搜尋相同地址核對。",
  "Check the network and complete checksum first. A new address may have no confirmed activity. During index sync, rate limits or outages, the monitor shows unavailable rather than inventing a zero. It tries the official fallback API when the primary fails. Search the same address in the [official explorer](https://scan.tensorcash.org/) to compare.",
  "네트워크와 전체 체크섬을 확인하세요. 새 주소에는 확정 거래가 없을 수 있습니다. 인덱스 동기화, 요청 제한, 장애 시 0으로 바꾸지 않고 사용 불가로 표시합니다. 주 API 실패 시 공식 대체 API를 시도합니다. [공식 탐색기](https://scan.tensorcash.org/)에서 같은 주소로 비교하세요.",
  "ネットワークと完全なチェックサムを確認。新規アドレスに確定取引がない場合もあります。同期・制限・障害時はゼロとせず利用不可を表示し、公式の代替APIを試します。[公式エクスプローラー](https://scan.tensorcash.org/)で同じアドレスを検索して比較します。",
]);
const questions = [
  {
    q: l([
      "应该选择哪个矿池？",
      "應選哪個礦池？",
      "Which pool should I choose?",
      "어떤 풀을 선택하나요?",
      "どのプールを選びますか？",
    ]),
    a: tscPoolCopy.summary,
  },
  {
    q: l([
      "为什么有的矿池暂不可用？",
      "為什麼部分礦池暫不可用？",
      "Why is a pool unavailable?",
      "일부 풀이 사용 불가인 이유는?",
      "利用できないプールがあるのはなぜ？",
    ]),
    a: tscPoolCopy.paused,
  },
  {
    q: l([
      "如何保存多个地址？",
      "如何保存多個地址？",
      "How do I save multiple addresses?",
      "여러 주소는 어떻게 저장하나요?",
      "複数アドレスの保存方法は？",
    ]),
    a: save,
  },
  {
    q: l([
      "余额就是挖矿收益吗？",
      "餘額就是挖礦收益嗎？",
      "Is wallet balance mining income?",
      "잔액이 채굴 수익인가요?",
      "残高は採掘収益ですか？",
    ]),
    a: tscPoolCopy.scope,
  },
  {
    q: l([
      "查不到或数字未更新怎么办？",
      "查不到或數字未更新怎麼辦？",
      "What if data is missing or stale?",
      "조회되지 않거나 오래된 값이면?",
      "取得できない・古い値の場合は？",
    ]),
    a: missing,
  },
  {
    q: l([
      "Mac 能直接接入所有矿池吗？",
      "Mac 能直接接入所有礦池嗎？",
      "Does Mac support mean every pool accepts it?",
      "Mac 지원이면 모든 풀에서 가능한가요?",
      "Mac対応なら全プールに接続できますか？",
    ]),
    a: c.mac,
  },
];
export const tscGuide: Article = {
  slug: "tsc-monitor-guide",
  project: "tsc",
  published: "2026-10-25",
  modified: "2026-10-25",
  title: tscPoolCopy.title,
  description: tscPoolCopy.summary,
  summary: tscPoolCopy.scope,
  topic: l([
    "TensorCash 使用说明",
    "TensorCash 使用說明",
    "TensorCash guide",
    "TensorCash 안내",
    "TensorCashガイド",
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
    { name: "TensorCash Chain API", url: "https://tensorcash.org/docs/api" },
    {
      name: "Address balance API",
      url: "https://tensorcash.org/docs/api/tscscan/addresses-address-balance",
    },
    { name: "Official mining guide", url: "https://tensorcash.org/blog/how-to-mine" },
    { name: "Official mining pools", url: "https://tensorcash.org/pools" },
  ],
};
