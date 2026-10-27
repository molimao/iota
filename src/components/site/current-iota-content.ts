import type { Article } from "./articles";
import { iotaPublicFacts as facts } from "@/lib/iota-public-facts";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";

const overview = l([
  "IOTA Watch 是独立的多项目监控工具，以 Macrocosmos IOTA Train at Home 为核心。用公开 Miner ID 查看状态、昨日收益和累计收益；需要本机信息及控制时，可自行安装并配对 Mac Agent。它不是 IOTA Foundation 公链钱包。",
  "IOTA Watch 是以 Macrocosmos IOTA Train at Home 為核心的獨立多專案監控工具。公開 Miner ID 可查狀態、昨日及累計收益；本機資訊與控制需另裝並配對 Mac Agent。不是 IOTA Foundation 公鏈錢包。",
  "IOTA Watch is an independent multi-project monitor built around Macrocosmos IOTA Train at Home. Public Miner IDs show reported activity, yesterday's rewards and lifetime rewards. Local telemetry and controls require the optional paired Mac agent. It is not an IOTA Foundation wallet.",
  "IOTA Watch는 Macrocosmos IOTA Train at Home 중심의 독립 멀티 프로젝트 모니터입니다. 공개 Miner ID로 상태·어제 보상·누적 보상을 조회하며 로컬 정보·제어는 선택 Mac 에이전트 설치와 연결이 필요합니다. IOTA Foundation 지갑이 아닙니다.",
  "IOTA WatchはMacrocosmos IOTA Train at Homeを中心とした独立マルチプロジェクト監視ツールです。公開Miner IDで状態・昨日と累計の報酬を確認でき、ローカル情報と制御には任意のMacエージェント設置・ペアリングが必要です。IOTA Foundationのウォレットではありません。",
]);
const setup = l([
  "[打开监控](/app)，添加每台设备的公开 Miner ID / hotkey。收款 coldkey 与设备标识不同，不能填私钥或助记词。每项目免费保存 3 台，Pro 100 台；登录同步清单，设备总览不额外设总数限制。不同项目的钱包余额、积分及设备收益保留各自周期。",
  "[開啟監控](/app) 新增各設備公開 Miner ID / hotkey，與收款 coldkey 不同，勿填私鑰或助記詞。每專案免費 3 台、Pro 100 台；登入同步清單，設備總覽無額外總數限制。各專案餘額、積分及收益保留原周期。",
  "[Open the monitor](/app) and add each device's public Miner ID / hotkey, not its payout coldkey, private key or seed. Free saves three devices per project and Pro 100; sign in to sync the list. The cross-project overview adds no overall limit. Balances, points and earnings keep their source periods.",
  "[모니터](/app)에 각 기기의 공개 Miner ID / hotkey를 추가하세요. 지급 coldkey와 다르며 비밀키·시드는 입력하지 마세요. 프로젝트당 무료 3대·Pro 100대로 로그인 시 목록을 동기화하며 통합 화면의 추가 총수 제한은 없습니다. 잔액·포인트·수익은 각 출처 기간을 유지합니다.",
  "[監視画面](/app)に各機器の公開Miner ID / hotkeyを追加します。受取coldkey・秘密鍵・シードとは異なります。無料は各プロジェクト3台、Proは100台、ログインで同期し、統合画面の追加総数上限はありません。残高・ポイント・収益は取得元の期間を保ちます。",
]);
const limits = l([
  "本站不是项目官方服务，不托管资金、不签名交易，不保证任务分配、等待时长或收益。未配对 Agent 时不能控制本机；其他项目的账户指标和钱包统计不等于单机实际收益。",
  "本站並非官方服務，不託管資金、不簽名交易、不保證任務、等待時長或收益。未配對 Agent 不能控制本機；其他專案帳戶或錢包指標不等於單機收益。",
  "This is not an official project service. It does not custody funds, sign transactions or guarantee task allocation, wait times or returns. Unpaired Macs cannot be controlled. Account and wallet statistics from other projects do not establish individual-machine earnings.",
  "공식 프로젝트 서비스가 아니며 자금 보관·거래 서명·작업 배정·대기 시간·수익 보장을 하지 않습니다. 연결되지 않은 Mac을 제어하지 못하며 다른 프로젝트의 계정·지갑 통계가 개별 기기 수입을 증명하지 않습니다.",
  "公式サービスではなく、資金保管・取引署名・タスク配分・待ち時間・収益の保証はしません。未ペアリングのMacは制御できず、他プロジェクトのアカウントやウォレット統計は1台の収益を証明しません。",
]);
const historyNote = l([
  "下方历史证据截图保留拍摄时的旧「今日」标签，只用于核对原始账本字段。当前页面及日报已改为上述昨日归属，历史截图不代表当前界面。",
  "下方歷史截圖保留拍攝時舊「今日」標籤，只用於核對原始帳本欄位。現行頁面與日報使用上述昨日歸屬，歷史截圖非目前介面。",
  "The dated evidence screenshot below retains its original Today label to document raw ledger fields. Current cards and daily emails use the preceding-day attribution above; the historical screenshot is not the current interface.",
  "아래 과거 증거 스크린샷의 오늘 표시는 당시 장부 필드 확인용으로 보존됩니다. 현재 카드·메일은 위 전날 기준이며 과거 화면은 현재 UI가 아닙니다.",
  "下の日時付き証拠画像には当時の今日表示を保存しています。原台帳項目の確認用であり、現行カードとメールは上の前日基準です。過去画像は現在のUIではありません。",
]);

// Keep published answers aligned with product changes, including all five editions.
export function currentIotaContent(article: Article): Article {
  if (article.slug === "what-is-iota-watch")
    return {
      ...article,
      modified: "2026-10-17",
      description: overview,
      summary: overview,
      body: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          [
            overview[locale],
            setup[locale],
            `## ${facts.agentTitle[locale]}`,
            facts.agent[locale],
            `## ${facts.dayTitle[locale]}`,
            facts.day[locale],
            facts.totals[locale],
            limits[locale],
            "[IOTA Train at Home](/learn/start-iota-train-at-home) · [Mac Agent](/learn/iota-training-stopped-auto-recovery)",
          ],
        ]),
      ) as Article["body"],
      questions: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          [
            { question: facts.agentTitle[locale], answer: facts.agent[locale] },
            { question: facts.dayTitle[locale], answer: facts.day[locale] },
          ],
        ]),
      ) as NonNullable<Article["questions"]>,
      related: ["start-iota-train-at-home", "find-miner-id", "iota-queue-and-zero-throughput"],
    };
  if (article.slug === "how-rewards-work")
    return {
      ...article,
      modified: "2026-10-17",
      title: l([
        "IOTA 昨日收益、累计收益和日报日期怎么算？",
        "IOTA 昨日收益、累計收益與日報日期怎麼算？",
        "IOTA yesterday's rewards, lifetime totals and daily email dates",
        "IOTA 어제·누적 보상과 일일 메일 날짜 계산",
        "IOTAの昨日・累計報酬と日次メールの集計日",
      ]),
      description: l([
        "核对 IOTA 昨日收益、累计 Total Earned、邮件日期与美元估值；区分展示归属日、官方记账日和钱包到账。",
        "核對 IOTA 昨日收益、累計、郵件日期及美元估值，區分展示日、記帳日與入帳。",
        "Check IOTA yesterday and lifetime rewards, daily email dates and USD estimates. Separate display dates, accounting records and wallet receipts.",
        "IOTA 어제·누적 보상, 메일 날짜와 USD를 확인하고 표시일·정산일·수령일을 구분합니다.",
        "IOTAの昨日・累計報酬、メール日付、USD換算を確認し、表示日・記帳日・着金日を区別します。",
      ]),
      summary: facts.day,
      body: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          [
            facts.day[locale],
            `## ${facts.dayTitle[locale]}`,
            facts.totals[locale],
            setup[locale],
            "[IOTA](/app) · [USD](/learn/iota-rewards-in-usd)",
            historyNote[locale],
          ],
        ]),
      ) as Article["body"],
      questions: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          [{ question: facts.dayTitle[locale], answer: facts.day[locale] }],
        ]),
      ) as NonNullable<Article["questions"]>,
    };
  let legacyChanged = false;
  let alignmentChanged = false;
  const localeFix = (text: string, locale: (typeof LOCALES)[number]) => {
    if (
      /(?:cannot (?:read|access|restart|start)|can.t (?:read|access|restart)|not a remote control|cannot.*logs|cannot register a miner or start|不能(?:直接)?(?:读取|讀取|启动|啟動|重启|重啟)|无法(?:读取|控制)|無法(?:讀取|控制)|網頁不能|网页监控不直接|읽을 수 없|재시작할 수 없|ログ.{0,8}(?:読|取得).{0,10}できません)/i.test(
        text,
      )
    )
      return facts.agent[locale];
    if (
      /(?:pending|settled)/.test(text) &&
      /(?:今日|today|오늘|本日)/i.test(text) &&
      /(?:00:00|midnight|자정|深夜)/i.test(text)
    )
      return facts.day[locale];
    if (
      /(?:IOTA 今日收益|IOTA 今日收益使用|IOTA 有效的今日|IOTA uses the Hong Kong accounting day)/.test(
        text,
      )
    )
      return facts.day[locale];
    return text;
  };
  const englishKind = (text: string | undefined) => {
    if (text == null) return null;
    const normalized = localeFix(text, "en");
    if (normalized === facts.agent.en) return "agent" as const;
    if (normalized === facts.day.en) return "day" as const;
    return null;
  };
  const align = (text: string, locale: (typeof LOCALES)[number], english: string | undefined) => {
    const legacy = localeFix(text, locale);
    const kind = englishKind(english);
    const value = kind ? facts[kind][locale] : legacy;
    if (legacy !== text) legacyChanged = true;
    if (value !== legacy) alignmentChanged = true;
    return value;
  };
  const body = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      article.body[locale].map((text, index) => align(text, locale, article.body.en[index])),
    ]),
  ) as Article["body"];
  const summary =
    article.summary &&
    (Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        align(article.summary![locale], locale, article.summary!.en),
      ]),
    ) as Article["summary"]);
  const description = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      align(article.description[locale], locale, article.description.en),
    ]),
  ) as Article["description"];
  const questions =
    article.questions &&
    (Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        article.questions![locale].map((q, index) => ({
          ...q,
          answer: align(q.answer, locale, article.questions!.en?.[index]?.answer),
        })),
      ]),
    ) as Article["questions"]);
  return legacyChanged || alignmentChanged
    ? {
        ...article,
        body,
        description,
        ...(summary ? { summary } : {}),
        ...(questions ? { questions } : {}),
        modified: alignmentChanged ? "2026-10-24" : "2026-10-17",
      }
    : article;
}
