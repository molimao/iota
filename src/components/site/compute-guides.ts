import { additionalGuides } from "./additional-guides";
import type { Article } from "./articles";
import { editorialCopy } from "../project-editorial";
import { LOCALES, type SiteLocale } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { computeGuideCopy, guideSections } from "./compute-guide-copy";
import { guideDetails, isRemediatedGuide } from "./compute-guide-details";
import { gonkaEvidence } from "./core-evidence";

const localized = <T>(f: (locale: SiteLocale) => T) =>
  Object.fromEntries(LOCALES.map((l) => [l, f(l)])) as Record<SiteLocale, T>;

const computeProjects = ["flyai", "nosana", "gonka", "akash", "ionet", "vast", "golem"] as const;
type ComputeProject = (typeof computeProjects)[number];

const monitorLabel: Record<SiteLocale, string> = {
  zh: "监控",
  "zh-TW": "監控",
  en: "monitor",
  ko: "모니터",
  ja: "モニター",
};

const comparisonHeaders: Record<SiteLocale, [string, string, string]> = {
  zh: ["标识", "字段解释", "异常处理"],
  "zh-TW": ["標識", "欄位解釋", "異常處理"],
  en: ["Identifier", "Field meaning", "When it does not match"],
  ko: ["식별자", "필드 설명", "이상 처리"],
  ja: ["識別子", "項目の意味", "異常時の扱い"],
};

const comparisonTitle: Record<SiteLocale, string> = {
  zh: "字段解释和异常处理",
  "zh-TW": "欄位解釋和異常處理",
  en: "Field meanings and mismatches",
  ko: "필드 설명과 이상 처리",
  ja: "項目の意味と異常時の扱い",
};

const identifierLabel: Record<ComputeProject, Record<SiteLocale, string>> = {
  flyai: {
    zh: "ETH 公开收益地址",
    "zh-TW": "ETH 公開收益地址",
    en: "public ETH payout address",
    ko: "공개 ETH 수령 주소",
    ja: "公開ETH受取アドレス",
  },
  nosana: {
    zh: "Solana 公开地址",
    "zh-TW": "Solana 公開地址",
    en: "public Solana address",
    ko: "공개 Solana 주소",
    ja: "公開Solanaアドレス",
  },
  gonka: {
    zh: "gonka1 开头的账户地址",
    "zh-TW": "gonka1 帳戶地址",
    en: "gonka1 Host account address",
    ko: "gonka1 Host 계정 주소",
    ja: "gonka1 Hostアドレス",
  },
  akash: {
    zh: "完整公开地址",
    "zh-TW": "完整公開地址",
    en: "provider public address",
    ko: "공급자 공개 주소",
    ja: "プロバイダー公開アドレス",
  },
  ionet: {
    zh: "设备 ID",
    "zh-TW": "設備 ID",
    en: "device ID",
    ko: "기기 ID",
    ja: "デバイスID",
  },
  vast: {
    zh: "Machine ID",
    "zh-TW": "Machine ID",
    en: "Machine ID",
    ko: "Machine ID",
    ja: "Machine ID",
  },
  golem: {
    zh: "Node ID",
    "zh-TW": "Node ID",
    en: "Node ID",
    ko: "Node ID",
    ja: "Node ID",
  },
};

const decisionTitle: Record<ComputeProject, Record<SiteLocale, string>> = {
  flyai: {
    zh: "先核对 ETH 公开收益地址",
    "zh-TW": "先核對 ETH 公開收益地址",
    en: "Check the public ETH payout address first",
    ko: "공개 ETH 수령 주소부터 확인",
    ja: "公開ETH受取アドレスを先に確認",
  },
  nosana: {
    zh: "先核对节点的 Solana 公开地址",
    "zh-TW": "先核對節點的 Solana 公開地址",
    en: "Check the node’s public Solana address first",
    ko: "노드의 공개 Solana 주소부터 확인",
    ja: "ノードの公開Solanaアドレスを先に確認",
  },
  gonka: {
    zh: "先核对 gonka1 Host 地址",
    "zh-TW": "先核對 gonka1 Host 地址",
    en: "Check the gonka1 Host address first",
    ko: "gonka1 Host 주소부터 확인",
    ja: "gonka1 Hostアドレスを先に確認",
  },
  akash: {
    zh: "先核对提供商公开地址",
    "zh-TW": "先核對提供商公開地址",
    en: "Check the provider public address first",
    ko: "공급자 공개 주소부터 확인",
    ja: "プロバイダー公開アドレスを先に確認",
  },
  ionet: {
    zh: "先核对设备 ID",
    "zh-TW": "先核對設備 ID",
    en: "Check the device ID first",
    ko: "기기 ID부터 확인",
    ja: "デバイスIDを先に確認",
  },
  vast: {
    zh: "先核对 Machine ID",
    "zh-TW": "先核對 Machine ID",
    en: "Check the Machine ID first",
    ko: "Machine ID부터 확인",
    ja: "Machine IDを先に確認",
  },
  golem: {
    zh: "先核对 Node ID",
    "zh-TW": "先核對 Node ID",
    en: "Check the Node ID first",
    ko: "Node ID부터 확인",
    ja: "Node IDを先に確認",
  },
};

const decisionAction: Record<ComputeProject, Record<SiteLocale, string>> = {
  flyai: {
    zh: "先检查 ETH 公开收益地址和来源返回的积分月份，再打开{monitor}对照同一地址，并阅读{guide}。积分是该月记账量，不是可提现金额。",
    "zh-TW":
      "先檢查 ETH 公開收益地址和來源返回的積分月份，再開啟{monitor}對照同一地址，並閱讀{guide}。積分是該月記帳量，不是可提領金額。",
    en: "Check the public ETH payout address in the current month response, then open the {monitor} for that address and read the {guide}. The wallet row is not each machine, and points are not withdrawable cash.",
    ko: "공개 ETH 수령 주소와 소스가 반환한 월을 먼저 확인한 뒤 {monitor}에서 같은 주소를 대조하고 {guide}를 읽으세요. 포인트는 해당 월의 기록이며 출금 가능한 현금이 아닙니다.",
    ja: "公開ETH受取アドレスと取得元が返した月を先に確認し、{monitor}で同じアドレスを照合して{guide}を読んでください。ポイントはその月の記帳であり、出金できる現金ではありません。",
  },
  nosana: {
    zh: "先检查节点的 Solana 公开地址，不要改用任务地址。打开{monitor}对照同一节点的任务记录，并阅读{guide}。running 和 completed 是任务计数，不是 NOS 收益。",
    "zh-TW":
      "先檢查節點的 Solana 公開地址，不要改用任務地址。開啟{monitor}對照同一節點的任務紀錄，並閱讀{guide}。running 與 completed 是任務計數，不是 NOS 收益。",
    en: "Check the node’s public Solana address, not a job address. Open the {monitor} and read the {guide}. The running label stores jobs.totalJobs, and completed stores stats.completed. They are not NOS earnings.",
    ko: "작업 주소가 아닌 노드의 공개 Solana 주소를 먼저 확인하세요. {monitor}에서 같은 노드를 대조하고 {guide}를 읽으세요. running과 completed는 작업 수이며 NOS 수익이 아닙니다.",
    ja: "ジョブではなくノードの公開Solanaアドレスを先に確認します。{monitor}で同じノードを照合し、{guide}を読んでください。runningとcompletedはジョブ数であり、NOS収益ではありません。",
  },
  gonka: {
    zh: "先检查 gonka1 开头的 Host 地址。打开{monitor}对照本轮参与记录，并阅读{guide}。weight 是本轮权重，不是 GNK，也不是美元入账。",
    "zh-TW":
      "先檢查 gonka1 開頭的 Host 地址。開啟{monitor}對照本輪參與紀錄，並閱讀{guide}。weight 是本輪權重，不是 GNK，也不是美元入帳。",
    en: "Check the gonka1 Host address first. Open the {monitor} for this epoch’s participant record and read the {guide}. weight is epoch weight, not GNK and not a USD credit.",
    ko: "gonka1 Host 주소를 먼저 확인하세요. {monitor}에서 이번 에포크 참여 기록을 대조하고 {guide}를 읽으세요. weight는 에포크 가중치이며 GNK나 달러 입금이 아닙니다.",
    ja: "gonka1のHostアドレスを先に確認します。{monitor}で今期の参加記録を照合し、{guide}を読んでください。weightは期の重みであり、GNKでもドル入金でもありません。",
  },
  akash: {
    zh: "先检查小写且以 akash1 开头的提供商地址，不要改用租用者钱包或部署编号。打开{monitor}对照目录记录，并阅读{guide}。这次读取不含租约数量和 AKT 付款。",
    "zh-TW":
      "先檢查完整的提供商公開地址，不要改用租用者錢包或部署編號。開啟{monitor}對照目錄紀錄，並閱讀{guide}。租約活動和 GPU 容量不是 AKT 或美元收入。",
    en: "Check the lowercase akash1 provider address, not a tenant wallet or deployment ID. Open the {monitor} for the directory record and read the {guide}. This read shows provider status and GPU capacity; use official lease and payment records for AKT income.",
    ko: "임차인 지갑이나 배포 ID가 아닌 공급자 공개 주소 전체를 먼저 확인하세요. {monitor}에서 디렉터리 기록을 대조하고 {guide}를 읽으세요. 리스 활동과 GPU 용량은 AKT나 USD 수익이 아닙니다.",
    ja: "借り手のウォレットやデプロイIDではなく、プロバイダーの公開アドレス全体を先に確認します。{monitor}でディレクトリ記録を照合し、{guide}を読んでください。リース活動とGPU容量はAKTやUSDの収入ではありません。",
  },
  ionet: {
    zh: "先检查官方控制台中的设备 ID。打开{monitor}对照这台设备的读取结果，并阅读{guide}。接入读取凭据不等于真实账户已经验证。",
    "zh-TW":
      "先檢查官方主控台中的設備 ID。開啟{monitor}對照這台設備的讀取結果，並閱讀{guide}。接入讀取憑證不等於真實帳戶已經驗證。",
    en: "Check the device ID from the official console. Open the {monitor} for that device’s read result and read the {guide}. Connecting read credentials does not mean the real account is verified.",
    ko: "공식 콘솔의 기기 ID를 먼저 확인하세요. {monitor}에서 해당 기기의 읽기 결과를 대조하고 {guide}를 읽으세요. 읽기 자격 증명을 연결해도 실제 계정이 검증된 것은 아닙니다.",
    ja: "公式コンソールのデバイスIDを先に確認します。{monitor}でそのデバイスの読取結果を照合し、{guide}を読んでください。読取認証を接続しても、実アカウントが検証済みであることにはなりません。",
  },
  vast: {
    zh: "先检查 Host 的 Machine ID，不要改用租客 Instance ID。打开{monitor}对照同一机器和期间，并阅读{guide}。接入读取凭据不等于真实 Host 账户已经验证。",
    "zh-TW":
      "先檢查 Host 的 Machine ID，不要改用租客 Instance ID。開啟{monitor}對照同一機器和期間，並閱讀{guide}。接入讀取憑證不等於真實 Host 帳戶已經驗證。",
    en: "Check the Host integer Machine ID, not a tenant Instance ID. Open the {monitor} for the same machine and the Hong Kong day, and read the {guide}. Sum the four components only when all are known. Connecting read credentials does not mean the real Host account is verified.",
    ko: "임차인 Instance ID가 아닌 Host Machine ID를 먼저 확인하세요. {monitor}에서 같은 기기와 기간을 대조하고 {guide}를 읽으세요. 읽기 자격 증명을 연결해도 실제 Host 계정이 검증된 것은 아닙니다.",
    ja: "借り手のInstance IDではなくHostのMachine IDを先に確認します。{monitor}で同じ機器と期間を照合し、{guide}を読んでください。読取認証を接続しても、実Hostアカウントが検証済みであることにはなりません。",
  },
  golem: {
    zh: "先检查官方节点统计中的 Node ID。打开{monitor}对照同一节点、相近读取时刻的记录，并阅读{guide}。近 24 小时 GLM 不是香港自然日收益，也不是钱包余额。",
    "zh-TW":
      "先檢查官方節點統計中的 Node ID。開啟{monitor}對照同一節點、相近讀取時刻的紀錄，並閱讀{guide}。近 24 小時 GLM 不是香港自然日收益，也不是錢包餘額。",
    en: "Check the node id, 0x plus 40 hex characters, in Golem Stats. Open the {monitor} for that id and read the {guide}. earnings is rolling 24-hour GLM and earnings_total is lifetime GLM. Neither is a wallet payout.",
    ko: "공식 노드 통계의 Node ID를 먼저 확인하세요. {monitor}에서 같은 노드와 가까운 조회 시각을 대조하고 {guide}를 읽으세요. 최근 24시간 GLM은 홍콩 달력 일자 수익도 지갑 잔액도 아닙니다.",
    ja: "公式ノード統計のNode IDを先に確認します。{monitor}で同じノードと近い取得時刻を照合し、{guide}を読んでください。直近24時間のGLMは香港の暦日収益でもウォレット残高でもありません。",
  },
};

const questionText: Record<ComputeProject, Record<SiteLocale, [string, string]>> = {
  flyai: {
    zh: [
      "同一 ETH 地址下的月度积分，能当成每台机器的今日收益吗？",
      "查不到积分记录时，能判断设备离线吗？",
    ],
    "zh-TW": [
      "同一 ETH 地址下的月度積分，能當成每台機器的今日收益嗎？",
      "查不到積分紀錄時，能判斷設備離線嗎？",
    ],
    en: [
      "Can the monthly points for one ETH address be treated as each machine’s daily income?",
      "If no points record appears, does that mean the machine is offline?",
    ],
    ko: [
      "같은 ETH 주소의 월별 포인트를 각 기기의 오늘 수익으로 볼 수 있나요?",
      "포인트 기록이 없으면 기기가 오프라인인가요?",
    ],
    ja: [
      "同じETHアドレスの月次ポイントを、各機器の日次収益として扱えますか？",
      "ポイント記録がなければ、機器はオフラインですか？",
    ],
  },
  nosana: {
    zh: [
      "为什么要用节点地址，而不是任务地址或全网统计？",
      "running 为 0，或请求失败，分别说明什么？",
    ],
    "zh-TW": [
      "為什麼要用節點地址，而不是任務地址或全網統計？",
      "running 為 0，或請求失敗，分別說明什麼？",
    ],
    en: [
      "Why query the node address instead of a job address or network-wide totals?",
      "What does running at 0 mean, and what does a failed request mean?",
    ],
    ko: [
      "작업 주소나 전체 네트워크 집계 대신 노드 주소를 조회해야 하는 이유는 무엇인가요?",
      "running이 0인 경우와 요청이 실패한 경우는 각각 무엇을 뜻하나요?",
    ],
    ja: [
      "ジョブアドレスや全網合計ではなく、ノードアドレスで照会するのはなぜですか？",
      "runningが0の場合と、取得失敗はそれぞれ何を意味しますか？",
    ],
  },
  gonka: {
    zh: [
      "可以用 inference_url、validator_key 或 ML node 名称代替 Host 地址吗？",
      "本轮没有列出 Host 时，weight 可以乘币价当成收益吗？",
    ],
    "zh-TW": [
      "可以用 inference_url、validator_key 或 ML node 名稱代替 Host 地址嗎？",
      "本輪沒有列出 Host 時，weight 可以乘幣價當成收益嗎？",
    ],
    en: [
      "Can an inference_url, validator_key, or ML node name replace the Host address?",
      "If the Host is absent this epoch, can weight times a token price be treated as income?",
    ],
    ko: [
      "inference_url, validator_key, ML node 이름으로 Host 주소를 대신할 수 있나요?",
      "이번 에포크에 Host가 없으면 weight에 토큰 가격을 곱해 수익으로 볼 수 있나요?",
    ],
    ja: [
      "inference_url、validator_key、ML node名でHostアドレスを代用できますか？",
      "今期にHostが載っていなければ、weightにトークン価格を掛けて収益にしてよいですか？",
    ],
  },
  akash: {
    zh: ["租用者钱包或部署编号能用来查提供商吗？", "目录里查不到这个地址时，先核对什么？"],
    "zh-TW": ["租用者錢包或部署編號能用來查提供商嗎？", "目錄裡查不到這個地址時，先核對什麼？"],
    en: [
      "Can a tenant wallet or deployment ID be used to look up the provider?",
      "If this address is missing from the directory, what should be checked first?",
    ],
    ko: [
      "임차인 지갑이나 배포 ID로 공급자를 조회할 수 있나요?",
      "디렉터리에서 이 주소가 없으면 무엇을 먼저 확인해야 하나요?",
    ],
    ja: [
      "借り手のウォレットやデプロイIDでプロバイダーを照会できますか？",
      "ディレクトリにこのアドレスがなければ、何を先に確認しますか？",
    ],
  },
  ionet: {
    zh: ["只有设备 ID，还是必须再保存读取凭据？", "设备连接失败时，应该先到官方账户核对什么？"],
    "zh-TW": [
      "只有設備 ID，還是必須再儲存讀取憑證？",
      "設備連接失敗時，應該先到官方帳戶核對什麼？",
    ],
    en: [
      "Is the device ID enough, or do read credentials also have to be saved?",
      "What should I check in the official account when the device connection fails?",
    ],
    ko: [
      "기기 ID만 있으면 되나요, 아니면 읽기 자격 증명도 저장해야 하나요?",
      "기기 연결에 실패하면 공식 계정에서 무엇을 먼저 확인해야 하나요?",
    ],
    ja: [
      "デバイスIDだけで足りますか。それとも読取認証も保存が必要ですか？",
      "デバイスの接続に失敗したら、公式アカウントで何を先に確認すればよいですか？",
    ],
  },
  vast: {
    zh: [
      "Machine ID 和租客 Instance ID 可以互换吗？",
      "金额和官方出租记录不一致时，要先比较什么？",
    ],
    "zh-TW": [
      "Machine ID 和租客 Instance ID 可以互換嗎？",
      "金額和官方出租紀錄不一致時，要先比較什麼？",
    ],
    en: [
      "Can a tenant Instance ID be used in place of the Machine ID?",
      "When the amount does not match the official rental record, what should I compare first?",
    ],
    ko: [
      "임차인 Instance ID를 Machine ID 대신 쓸 수 있나요?",
      "금액이 공식 대여 기록과 다르면 무엇을 먼저 비교해야 하나요?",
    ],
    ja: [
      "借り手のInstance IDをMachine IDの代わりに使えますか？",
      "金額が公式の貸出記録と違うとき、何を先に比較すればよいですか？",
    ],
  },
  golem: {
    zh: [
      "看起来像钱包的地址，就能当作 Golem Node ID 吗？",
      "节点统计里的 GLM 为什么和钱包到账对不上？",
    ],
    "zh-TW": [
      "看起來像錢包的地址，就能當作 Golem Node ID 嗎？",
      "節點統計裡的 GLM 為什麼和錢包入帳對不上？",
    ],
    en: [
      "Does an address that looks like a wallet count as the Golem Node ID?",
      "Why does the node GLM figure differ from the wallet payout?",
    ],
    ko: [
      "지갑처럼 보이는 주소를 Golem Node ID로 봐도 되나요?",
      "노드 통계의 GLM이 지갑 지급액과 다른 이유는 무엇인가요?",
    ],
    ja: [
      "ウォレットのように見えるアドレスをGolemのNode IDとして扱えますか？",
      "ノード統計のGLMがウォレット入金と違うのはなぜですか？",
    ],
  },
};

const monitorPath = (project: ComputeProject) => `/projects/${project}`;

const linkPlaceholders = (project: ComputeProject, locale: SiteLocale, template: string) =>
  template
    .replaceAll("{monitor}", `[${monitorLabel[locale]}](${monitorPath(project)})`)
    .replaceAll("{guide}", `[${editorialCopy(locale).guide}](${PROJECTS[project].guide})`);

export const computeGuides: Article[] = [
  ...additionalGuides,
  ...computeProjects.map((project) => {
    const c = computeGuideCopy[project];
    return {
      slug: `${project}-monitor-guide`,
      project,
      published: "2026-10-06",
      modified: isRemediatedGuide(project) ? "2026-10-23" : "2026-10-22",
      title: c.title,
      description: c.description,
      summary: c.description,
      topic: localized((l) => editorialCopy(l).guide),
      decision: {
        title: decisionTitle[project],
        action: localized((l) => linkPlaceholders(project, l, decisionAction[project][l])),
      },
      comparisonTitle: isRemediatedGuide(project)
        ? guideDetails[project].tableTitle
        : comparisonTitle,
      comparison: localized((l) =>
        isRemediatedGuide(project)
          ? {
              headers: [...guideDetails[project].tableHeaders[l]],
              rows: guideDetails[project].rows[l].map((row) => [...row]),
            }
          : {
              headers: [...comparisonHeaders[l]],
              rows: [[identifierLabel[project][l], c.fields[l], c.check[l]]],
            },
      ),
      questions: localized((l) =>
        isRemediatedGuide(project)
          ? (["query", "fields", "scenario", "check"] as const).map((key) => ({
              question: guideDetails[project].headings[l][key],
              answer:
                key === "query"
                  ? guideDetails[project].steps[l]
                  : key === "fields"
                    ? guideDetails[project].fieldsLead[l]
                    : key === "scenario"
                      ? guideDetails[project].scenario[l]
                      : guideDetails[project].check[l],
            }))
          : [
              { question: questionText[project][l][0], answer: c.steps[l] },
              { question: questionText[project][l][1], answer: c.check[l] },
            ],
      ),
      body: localized((l) =>
        isRemediatedGuide(project)
          ? [
              `## ${guideDetails[project].headings[l].query}`,
              guideDetails[project].steps[l],
              `## ${guideDetails[project].headings[l].fields}`,
              guideDetails[project].fieldsLead[l],
              `## ${guideDetails[project].headings[l].scenario}`,
              guideDetails[project].scenario[l],
              `## ${guideDetails[project].headings[l].check}`,
              guideDetails[project].check[l],
              `[${monitorLabel[l]}](${monitorPath(project)}) · [${editorialCopy(l).guide}](${PROJECTS[project].guide})`,
            ]
          : [
              `## ${guideSections.input[l]}`,
              c.steps[l],
              `## ${guideSections.fields[l]}`,
              c.fields[l],
              `## ${guideSections.check[l]}`,
              c.check[l],
              `[${monitorLabel[l]}](${monitorPath(project)}) · [${editorialCopy(l).guide}](${PROJECTS[project].guide})`,
            ],
      ),
      sources: [
        { name: PROJECTS[project].name, url: PROJECTS[project].guide },
        {
          name: "IOTA Watch · read adapters",
          url: "https://github.com/molimao/iota/tree/main/src/lib",
        },
        ...(project === "nosana"
          ? [
              { name: "Nosana API", url: "https://api.nosana.com/api/docs" },
              { name: "Nosana dashboard", url: PROJECTS.nosana.explorer },
            ]
          : project === "gonka"
            ? [{ name: "Gonka Network Node API", url: PROJECTS.gonka.explorer }]
            : project === "flyai"
              ? [{ name: "fly.ai month response", url: PROJECTS.flyai.explorer }]
              : project === "akash"
                ? [{ name: "Akash provider directory", url: PROJECTS.akash.explorer }]
                : project === "golem"
                  ? [{ name: "Golem Stats", url: PROJECTS.golem.explorer }]
                  : project === "vast"
                    ? [
                        { name: "Vast Host machines", url: PROJECTS.vast.explorer },
                        {
                          name: "Vast API permissions",
                          url: "https://docs.vast.ai/api-reference/permissions",
                        },
                      ]
                    : []),
      ],
      related: ["data-sources-and-freshness"],
      ...(project === "gonka" ? { evidence: gonkaEvidence } : {}),
    };
  }),
];
