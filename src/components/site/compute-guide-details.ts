import type { SiteLocale } from "@/lib/site";

export const remediatedGuideProjects = ["flyai", "nosana", "akash", "vast", "golem"] as const;
export type RemediatedGuide = (typeof remediatedGuideProjects)[number];

export function isRemediatedGuide(project: string): project is RemediatedGuide {
  return (remediatedGuideProjects as readonly string[]).includes(project);
}

type Copy = Record<SiteLocale, string>;
type Row = [string, string, string];
type Headers = [string, string, string];

const copy = (zh: string, tw: string, en: string, ko: string, ja: string): Copy => ({
  zh,
  "zh-TW": tw,
  en,
  ko,
  ja,
});

const headers: Record<SiteLocale, Headers> = {
  zh: ["字段", "含义", "怎么核对"],
  "zh-TW": ["欄位", "含義", "怎麼核對"],
  en: ["Field", "Meaning", "What to check"],
  ko: ["필드", "의미", "확인"],
  ja: ["項目", "意味", "確認"],
};

export type GuideDetail = {
  headings: Record<SiteLocale, { query: string; fields: string; scenario: string; check: string }>;
  steps: Copy;
  fieldsLead: Copy;
  scenario: Copy;
  check: Copy;
  tableTitle: Copy;
  tableHeaders: Record<SiteLocale, Headers>;
  rows: Record<SiteLocale, Row[]>;
};

const heading = (
  zh: [string, string, string, string],
  tw: [string, string, string, string],
  en: [string, string, string, string],
  ko: [string, string, string, string],
  ja: [string, string, string, string],
) =>
  ({
    zh: { query: zh[0], fields: zh[1], scenario: zh[2], check: zh[3] },
    "zh-TW": { query: tw[0], fields: tw[1], scenario: tw[2], check: tw[3] },
    en: { query: en[0], fields: en[1], scenario: en[2], check: en[3] },
    ko: { query: ko[0], fields: ko[1], scenario: ko[2], check: ko[3] },
    ja: { query: ja[0], fields: ja[1], scenario: ja[2], check: ja[3] },
  }) as GuideDetail["headings"];

const rows = (zh: Row[], tw: Row[], en: Row[], ko: Row[], ja: Row[]) =>
  ({ zh, "zh-TW": tw, en, ko, ja }) as Record<SiteLocale, Row[]>;

export const guideDetails: Record<RemediatedGuide, GuideDetail> = {
  flyai: {
    headings: heading(
      [
        "怎样用一个公开收益地址查当前月份？",
        "月份、结束时间、总积分和钱包行分别是什么？",
        "积分和份额怎样区分？",
        "地址不在当前月份里，先查什么？",
      ],
      [
        "怎樣用一個公開收益地址查目前月份？",
        "月份、結束時間、總積分和錢包列分別是什麼？",
        "積分和份額怎樣區分？",
        "地址不在目前月份裡，先查什麼？",
      ],
      [
        "How do I look up one public payout address in the current month?",
        "What do month, ends_at, total points, and a wallet row mean?",
        "How do points differ from share?",
        "What should I check first when the address is missing?",
      ],
      [
        "공개 수령 주소 하나로 현재 월을 어떻게 조회하나요?",
        "month, ends_at, 총 포인트, 지갑 행은 각각 무엇인가요?",
        "예시로 든 지갑 행은 어떻게 읽나요?",
        "주소가 현재 월에 없으면 무엇을 먼저 확인하나요?",
      ],
      [
        "公開受取アドレス1件で現在の月を照会するには？",
        "month、ends_at、総ポイント、ウォレット行は何を表しますか？",
        "例示したウォレット行はどう読みますか？",
        "アドレスが現在の月に無いとき、何を先に確認しますか？",
      ],
    ),
    steps: copy(
      "在 fly.ai 官方 Compute 页面复制公开 ETH 收益地址，形式是 0x 加 40 位十六进制字符。到 fly.ai 监控页查询这个地址。页面只读取当前这一份月份响应，并找出同一地址的钱包行。使用该收益地址的每台机器共用这一行，不能把这一行复制成每台机器的今日收益。",
      "在 fly.ai 官方 Compute 頁面複製公開 ETH 收益地址，形式是 0x 加 40 位十六進位字元。到 fly.ai 監控頁查詢這個地址。頁面只讀取目前這一份月份回應，並找出同一地址的錢包列。使用該收益地址的每台機器共用這一列，不能把這一列複製成每台機器的今日收益。",
      "On the official fly.ai Compute page, copy the public ETH payout address: 0x followed by 40 hexadecimal characters. Look it up on the fly.ai monitor. The page reads one current month response and finds the wallet row with that same address. Every machine using this payout address shares that one row. Do not copy the row onto each machine as today’s income.",
      "공식 fly.ai Compute 페이지에서 공개 ETH 수령 주소를 복사합니다. 형식은 0x 뒤에 16진수 40자입니다. fly.ai 모니터에서 그 주소를 조회합니다. 페이지는 현재 월 응답 하나만 읽고, 같은 주소의 지갑 행을 찾습니다. 이 수령 주소를 쓰는 모든 기기가 그 행을 공유하므로, 각 기기의 오늘 수익으로 복사하지 마세요.",
      "公式 fly.ai Compute ページで公開 ETH 受取アドレスをコピーします。形式は 0x と 16 進 40 文字です。fly.ai モニターでそのアドレスを照会します。ページは現在の月次応答を 1 件だけ読み、同じアドレスのウォレット行を探します。この受取アドレスを使う機器はすべてその 1 行を共有します。各機器の本日の収益として複製しないでください。",
    ),
    fieldsLead: copy(
      "表里只列当前 /api/month 响应里的 month、ends_at、total_points，以及匹配钱包的 points 和 share。2026-10-23 核对过这份公开响应：month 为 2026-10，ends_at 为 2026-11-01T00:00:00.000Z，total_points 为 3349300318.6855006。month 和 ends_at 描述统计期间，total_points 是该期间全部地址的积分合计。它们不代表单个钱包的打款。本页没有切换到更早月份的控件。",
      "表裡只列目前 /api/month 回應中的 month、ends_at、total_points，以及相符錢包的 points 和 share。2026-10-23 核對過這份公開回應：month 為 2026-10，ends_at 為 2026-11-01T00:00:00.000Z，total_points 為 3349300318.6855006。month 和 ends_at 描述統計期間，total_points 是該期間全部地址的積分合計。它們不代表單個錢包的打款。本頁沒有切換到更早月份的控制項。",
      "The table lists only the current /api/month response: month, ends_at, total_points, and the matching wallet’s points and share. Checked on 2026-10-23, that public response reported month 2026-10, ends_at 2026-11-01T00:00:00.000Z, and total_points 3349300318.6855006. month and ends_at identify the reporting period; total_points is the point total across all addresses in that period. These are not a wallet payout. There is no control on this page to select an earlier month.",
      "표에는 현재 /api/month 응답의 month, ends_at, total_points와 일치하는 지갑의 points, share만 있습니다. 2026-10-23에 그 공개 응답을 확인했습니다. month는 2026-10, ends_at는 2026-11-01T00:00:00.000Z, total_points는 3349300318.6855006이었습니다. month와 ends_at는 통계 기간을 나타내고 total_points는 그 기간 전체 주소의 포인트 합계입니다. 지갑 지급액이 아닙니다. 이 페이지에는 이전 월을 고르는 컨트롤이 없습니다.",
      "表にあるのは現在の /api/month 応答の month、ends_at、total_points と、一致したウォレットの points、share だけです。2026-10-23 にその公開応答を確認しました。month は 2026-10、ends_at は 2026-11-01T00:00:00.000Z、total_points は 3349300318.6855006 でした。month と ends_at は集計期間を示し、total_points はその期間の全アドレスのポイント合計です。ウォレットへの送金額ではありません。このページに過去の月を選ぶ操作はありません。",
    ),
    scenario: copy(
      "举例，不是实测：假设 points 是 100、share 是 0.02，100 是该地址的积分，0.02 是其份额（2%），不是可提现金额，也不是每台机器的今日合计。这里不能改选另一个月份。",
      "舉例，不是實測：假設 points 是 100、share 是 0.02，100 是該地址的積分，0.02 是其份額（2%），不是可提領金額，也不是每台機器的今日合計。這裡不能改選另一個月份。",
      "Illustrative, not a measured wallet: if points were 100 and share were 0.02, 100 would be the address’s points and 0.02 its share (2%), not withdrawable cash and not a per-machine daily total. A different month cannot be selected here.",
      "예시이며 측정값이 아닙니다. points가 100이고 share가 0.02라면, 100은 해당 주소의 포인트이고 0.02는 비율(2%)이며 출금 가능한 현금이 아니고 기기별 오늘 합계도 아닙니다. 여기서 다른 월을 선택할 수 없습니다.",
      "例示であり、測定値ではありません。points が 100、share が 0.02 なら、100 はそのアドレスのポイント、0.02 は割合（2%）を表し、出金可能な現金ではなく、機器ごとの本日合計でもありません。ここでは別の月を選べません。",
    ),
    check: copy(
      "先把地址和官方 Compute 页面上的收益地址逐字对比，包括 0x 和全部 40 位十六进制字符。再核对当前响应里的 month 和 ends_at；本页不能改到过去的月份。若地址不在其中，只说明它不在当前月份的钱包列表里，不能据此判断机器离线。单台机器请回官方应用查看。points 和 share 不是可提现金额。",
      "先把地址和官方 Compute 頁面上的收益地址逐字對比，包括 0x 和全部 40 位十六進位字元。再核對目前回應裡的 month 和 ends_at；本頁不能改到過去的月份。若地址不在其中，只說明它不在目前月份的錢包清單裡，不能據此判斷機器離線。單台機器請回官方應用查看。points 和 share 不是可提領金額。",
      "First, compare the address with the payout address on the official Compute page, including the 0x prefix and all 40 hex characters. Second, confirm the month and ends_at in the current response; this page cannot switch to a past month. Third, if that address is absent, it is absent from the current month payload, which does not mean the machine is offline. Fourth, use the official app for one machine. Points and share are not withdrawable cash.",
      "먼저 공식 Compute 페이지의 수령 주소와 0x 및 16진수 40자까지 글자 단위로 비교합니다. 그다음 현재 응답의 month와 ends_at를 확인합니다. 이 페이지는 과거 월로 바꿀 수 없습니다. 주소가 없으면 현재 월 지갑 목록에 없다는 뜻이며 기기가 오프라인이라는 뜻은 아닙니다. 기기 한 대는 공식 앱에서 봅니다. points와 share는 출금 가능한 현금이 아닙니다.",
      "まず公式 Compute ページの受取アドレスと、0x および 16 進 40 文字まで一字ずつ比べます。次に現在の応答の month と ends_at を確認します。このページは過去の月へ切り替えられません。アドレスが無ければ、現在の月のウォレット一覧に無いという意味であり、機器のオフラインではありません。1 台の機器は公式アプリで見ます。points と share は出金可能な現金ではありません。",
    ),
    tableTitle: copy(
      "当前月份响应里的字段",
      "目前月份回應裡的欄位",
      "Fields in the current month response",
      "현재 월 응답의 필드",
      "現在の月次応答の項目",
    ),
    tableHeaders: headers,
    rows: rows(
      [
        [
          "month",
          "当前响应给出的积分月份，格式为 YYYY-MM。",
          "没有历史月份可选；看到的就是这一份响应里的月份。",
        ],
        ["ends_at", "同一份响应给出的结束时间。", "不是某台机器的心跳，也不能改选别的月份。"],
        ["total_points", "这一份响应里的积分合计。", "不是单个钱包，也不是可提现金额。"],
        ["points", "该收益地址在钱包列表中的积分。", "属于这个地址，不属于每一台机器。"],
        ["share", "该地址在这一份统计中的占比。", "不是每台机器的今日收益。"],
      ],
      [
        [
          "month",
          "目前回應給出的積分月份，格式為 YYYY-MM。",
          "沒有歷史月份可選；看到的就是這一份回應裡的月份。",
        ],
        ["ends_at", "同一份回應給出的結束時間。", "不是某台機器的心跳，也不能改選別的月份。"],
        ["total_points", "這一份回應裡的積分合計。", "不是單個錢包，也不是可提領金額。"],
        ["points", "該收益地址在錢包清單中的積分。", "屬於這個地址，不屬於每一台機器。"],
        ["share", "該地址在這一份統計中的占比。", "不是每台機器的今日收益。"],
      ],
      [
        [
          "month",
          "Points month in the current response, as YYYY-MM.",
          "There is no history-month selector. This is the only month in that response.",
        ],
        [
          "ends_at",
          "End time carried in the same response.",
          "Not a machine heartbeat, and not a month you can switch.",
        ],
        [
          "total_points",
          "Point total inside this one response.",
          "Not one wallet and not withdrawable cash.",
        ],
        [
          "points",
          "Points for this payout address in the wallet list.",
          "Wallet-level. Not a copy for every machine.",
        ],
        ["share", "This address’s fraction in that response.", "Not each machine’s income today."],
      ],
      [
        [
          "month",
          "현재 응답의 포인트 월이며 형식은 YYYY-MM입니다.",
          "과거 월 선택은 없습니다. 이 응답의 월만 있습니다.",
        ],
        [
          "ends_at",
          "같은 응답에 들어 있는 종료 시각입니다.",
          "기기 심박이 아니고, 다른 월로 바꿀 수도 없습니다.",
        ],
        [
          "total_points",
          "이 응답 안의 포인트 합계입니다.",
          "지갑 하나가 아니고 출금 가능한 현금도 아닙니다.",
        ],
        [
          "points",
          "지갑 목록에서 이 수령 주소의 포인트입니다.",
          "주소 단위이며 각 기기에 복사된 값이 아닙니다.",
        ],
        ["share", "이 응답에서 해당 주소의 비율입니다.", "각 기기의 오늘 수익이 아닙니다."],
      ],
      [
        [
          "month",
          "現在の応答が示すポイントの月で、形式は YYYY-MM です。",
          "過去の月を選ぶ機能はありません。この応答の月だけです。",
        ],
        [
          "ends_at",
          "同じ応答に含まれる終了時刻です。",
          "機器の心拍ではなく、別の月へ切り替える値でもありません。",
        ],
        [
          "total_points",
          "この応答の中のポイント合計です。",
          "一つのウォレットでも、出金可能な現金でもありません。",
        ],
        [
          "points",
          "ウォレット一覧にある、この受取アドレスのポイントです。",
          "アドレス単位であり、各機器へ複製した値ではありません。",
        ],
        ["share", "この応答における当該アドレスの割合です。", "各機器の本日の収益ではありません。"],
      ],
    ),
  },
  nosana: {
    headings: heading(
      [
        "怎样用节点地址读出这两项计数？",
        "页面上的 running 和 completed 各来自哪里？",
        "任务数为 0，就说明节点闲置吗？",
        "对不上时按什么顺序检查？",
      ],
      [
        "怎樣用節點地址讀出這兩項計數？",
        "頁面上的 running 和 completed 各來自哪裡？",
        "任務數為 0，就說明節點閒置嗎？",
        "對不上時按什麼順序檢查？",
      ],
      [
        "How do I read the two counts for one node address?",
        "Where do the running and completed labels come from?",
        "Does a count of 0 mean the node is idle?",
        "What should I check, and in what order, when the figures disagree?",
      ],
      [
        "노드 주소로 두 개 수를 어떻게 읽나요?",
        "화면의 running과 completed는 어디에서 오나요?",
        "예시로 든 0은 노드가 쉬고 있다는 뜻인가요?",
        "숫자가 다를 때 어떤 순서로 확인하나요?",
      ],
      [
        "ノードアドレスで2つの件数を読むには？",
        "画面の running と completed はどこから来ますか？",
        "例示した 0 はノードが待機中だと言えますか？",
        "数が合わないとき、何をどの順で確認しますか？",
      ],
    ),
    steps: copy(
      "在 Nosana 官方节点页面复制节点的 Solana 公开地址，不要复制任务地址。到 Nosana 监控页查询这个节点。页面保存该节点公开响应里的两项计数：任务列表总数，以及 completed 计数。全网合计不能代替这个节点。",
      "在 Nosana 官方節點頁面複製節點的 Solana 公開地址，不要複製任務地址。到 Nosana 監控頁查詢這個節點。頁面保存該節點公開回應裡的兩項計數：任務清單總數，以及 completed 計數。全網合計不能代替這個節點。",
      "On the official Nosana node page, copy the node’s public Solana address. Do not copy a job address. Look that node up on the Nosana monitor. The page stores two counts from that node’s public responses: the task-list total and the completed count. A network-wide total is not this node.",
      "Nosana 공식 노드 페이지에서 노드의 공개 Solana 주소를 복사합니다. 작업 주소는 복사하지 마세요. Nosana 모니터에서 그 노드를 조회합니다. 페이지는 그 노드의 공개 응답에서 두 수를 저장합니다. 작업 목록 총수와 completed 수입니다. 전체 네트워크 합계는 이 노드가 아닙니다.",
      "Nosana 公式ノードページで、ノードの公開 Solana アドレスをコピーします。ジョブのアドレスはコピーしません。Nosana モニターでそのノードを照会します。ページはそのノードの公開応答から 2 つの件数を保存します。タスク一覧の合計と completed の件数です。全網の合計はそのノードの結果ではありません。",
    ),
    fieldsLead: copy(
      "本站用节点地址和 state=RUNNING 筛选任务列表，再把响应中的 jobs.totalJobs 显示为 running。标成 completed 的数字是 stats.completed。官方 API 说明把 jobs 列表描述成可筛选的任务列表，并没有把 totalJobs 定义成实时活动。这两项计数不能证明实时活动，也不是 NOS 收益，更不是 GPU 台数或在线时长。",
      "本站以節點地址和 state=RUNNING 篩選任務清單，再將回應中的 jobs.totalJobs 顯示為 running。標成 completed 的數字是 stats.completed。官方 API 說明把 jobs 清單描述成可篩選的任務清單，並沒有把 totalJobs 定義成即時活動。這兩項計數不能證明即時活動，也不是 NOS 收益，更不是 GPU 台數或在線時長。",
      "The monitor requests the job list filtered by node and state=RUNNING, then displays the response’s jobs.totalJobs as running. The number labeled completed is stats.completed. The official API reference describes the jobs list as a filterable task list and does not define totalJobs as live activity. These counts cannot establish live activity or NOS earnings, and they are not a GPU count or uptime.",
      "노드와 state=RUNNING으로 작업 목록을 필터하고 응답의 jobs.totalJobs를 running으로 표시합니다. completed로 표시된 수는 stats.completed입니다. 공식 API 설명은 jobs 목록을 필터할 수 있는 작업 목록으로 설명하며, totalJobs를 실시간 활동으로 정의하지 않습니다. 이 두 수는 실시간 활동이나 NOS 수익을 확정하지 못하며 GPU 수나 가동 시간도 아닙니다.",
      "ノードと state=RUNNING でタスク一覧を絞り込み、応答の jobs.totalJobs を running として表示します。completed と表示される数は stats.completed です。公式 API の説明は jobs 一覧を絞り込みできるタスク一覧として述べ、totalJobs をライブの稼働とは定義していません。この 2 つの件数はライブの稼働も NOS 収益も確定できず、GPU 台数や稼働時間でもありません。",
    ),
    scenario: copy(
      "举例，不是实测：某次成功读取把 running 存成 0、把 completed 存成 4，只说明任务列表总数是 0、stats.completed 是 4。这不能说明节点闲置、在线或已经收到 NOS。请求失败时两项都保持未知，不能写成 0。",
      "舉例，不是實測：某次成功讀取把 running 存成 0、把 completed 存成 4，只說明任務清單總數是 0、stats.completed 是 4。這不能說明節點閒置、在線或已經收到 NOS。請求失敗時兩項都保持未知，不能寫成 0。",
      "Illustrative, not a measured node: a successful read that stores running 0 and completed 4 only means the task-list total was 0 and stats.completed was 4. It does not show that the node was idle, online, or paid in NOS. If the request fails, both stay unknown rather than 0.",
      "예시이며 측정값이 아닙니다. 성공한 읽기가 running을 0, completed를 4로 저장했다면 작업 목록 총수가 0이고 stats.completed가 4라는 뜻만 있습니다. 노드가 쉬고 있거나, 온라인이거나, NOS를 받았다는 뜻이 아닙니다. 요청이 실패하면 둘 다 알 수 없음이며 0으로 쓰지 않습니다.",
      "例示であり、測定値ではありません。成功した読取が running を 0、completed を 4 として保存したなら、タスク一覧の合計が 0 で stats.completed が 4 だったという意味だけです。ノードが待機中、オンライン、または NOS を受け取ったことにはなりません。取得に失敗したときは両方とも不明のままで、0 とは書きません。",
    ),
    check: copy(
      "先确认粘贴的是官方节点页面上的节点 Solana 地址，不是任务地址。请求失败就保持未知，不要记成 0。存下来的 0 只是任务列表总数为 0，资格、连接和任务分配要到官方节点页面看。不要把这两项计数换成 NOS、GPU 台数或在线时长。",
      "先確認貼上的是官方節點頁面上的節點 Solana 地址，不是任務地址。請求失敗就保持未知，不要記成 0。存下來的 0 只是任務清單總數為 0，資格、連線和任務分配要到官方節點頁面看。不要把這兩項計數換成 NOS、GPU 台數或在線時長。",
      "First, confirm the Solana address is the node address from the official node page, not a job address. Second, if the request fails, keep the result unknown; do not write 0. Third, a stored 0 is only a task-list total of 0, so check eligibility, connection, and assignment on the official node page. Fourth, do not turn either count into NOS, GPUs, or uptime.",
      "먼저 붙인 주소가 공식 노드 페이지의 노드 Solana 주소인지, 작업 주소가 아닌지 확인합니다. 요청이 실패하면 알 수 없음으로 두고 0으로 적지 않습니다. 저장된 0은 작업 목록 총수가 0이라는 뜻뿐이므로 자격, 연결, 배정은 공식 노드 페이지에서 봅니다. 두 수를 NOS, GPU 수, 가동 시간으로 바꾸지 마세요.",
      "まず貼ったアドレスが公式ノードページのノード Solana アドレスであり、ジョブのアドレスではないことを確認します。取得に失敗したら不明のままにし、0 と記録しません。保存された 0 はタスク一覧の合計が 0 という意味だけなので、資格、接続、割り当ては公式ノードページで確認します。この 2 つの件数を NOS、GPU 台数、稼働時間に置き換えないでください。",
    ),
    tableTitle: copy(
      "节点地址上的两项计数",
      "節點地址上的兩項計數",
      "The two counts for a node address",
      "노드 주소의 두 가지 수",
      "ノードアドレスの2つの件数",
    ),
    tableHeaders: headers,
    rows: rows(
      [
        ["节点地址", "官方节点页面上的 Solana 公开地址。", "不要用任务地址或全网合计代替。"],
        [
          "running",
          "来源任务列表上的 jobs.totalJobs。页面用 running 这个标签保存它。",
          "这个字段名不能证明节点正在实时工作，也不是 NOS 收益。",
        ],
        [
          "completed",
          "同一节点 stats 响应里的 stats.completed。",
          "是完成计数，不是打款，也不是 GPU 台数。",
        ],
        ["读取失败", "两项都保持未知。", "不能把失败写成 0。"],
      ],
      [
        ["節點地址", "官方節點頁面上的 Solana 公開地址。", "不要用任務地址或全網合計代替。"],
        [
          "running",
          "來源任務清單上的 jobs.totalJobs。頁面用 running 這個標籤保存它。",
          "這個欄位名稱不能證明節點正在即時工作，也不是 NOS 收益。",
        ],
        [
          "completed",
          "同一節點 stats 回應裡的 stats.completed。",
          "是完成計數，不是打款，也不是 GPU 台數。",
        ],
        ["讀取失敗", "兩項都保持未知。", "不能把失敗寫成 0。"],
      ],
      [
        [
          "Node address",
          "The node’s public Solana address on the official node page.",
          "Do not substitute a job address or a network-wide total.",
        ],
        [
          "running",
          "jobs.totalJobs from the source task list. This page stores it under the running label.",
          "The field name cannot establish live work, and it is not NOS earnings.",
        ],
        [
          "completed",
          "stats.completed from that node’s stats response.",
          "A completed count, not a payout and not a GPU count.",
        ],
        ["Failed read", "Both counts stay unknown.", "Do not record a failure as 0."],
      ],
      [
        [
          "노드 주소",
          "공식 노드 페이지의 공개 Solana 주소입니다.",
          "작업 주소나 전체 네트워크 합계로 바꾸지 마세요.",
        ],
        [
          "running",
          "출처 작업 목록의 jobs.totalJobs입니다. 이 페이지는 running이라는 라벨로 저장합니다.",
          "필드 이름이 실시간 작업을 확정하지 않으며 NOS 수익도 아닙니다.",
        ],
        [
          "completed",
          "그 노드 stats 응답의 stats.completed입니다.",
          "완료 수이며 지급액이나 GPU 수가 아닙니다.",
        ],
        ["읽기 실패", "두 수 모두 알 수 없음으로 남습니다.", "실패를 0으로 기록하지 마세요."],
      ],
      [
        [
          "ノードアドレス",
          "公式ノードページにある公開 Solana アドレスです。",
          "ジョブのアドレスや全網合計で代用しません。",
        ],
        [
          "running",
          "取得元タスク一覧の jobs.totalJobs です。このページは running というラベルで保存します。",
          "項目名からライブの作業は確定できず、NOS 収益でもありません。",
        ],
        [
          "completed",
          "そのノードの stats 応答にある stats.completed です。",
          "完了件数であり、送金でも GPU 台数でもありません。",
        ],
        ["取得失敗", "2 つの件数とも不明のままです。", "失敗を 0 として記録しません。"],
      ],
    ),
  },
  akash: {
    headings: heading(
      [
        "怎样查到这个提供商的目录记录？",
        "这次读取实际有哪些字段？",
        "GPU 数量能算出收入吗？",
        "目录里没有这个地址时先核对什么？",
      ],
      [
        "怎樣查到這個提供商的目錄紀錄？",
        "這次讀取實際有哪些欄位？",
        "GPU 數量能算出收入嗎？",
        "目錄裡沒有這個地址時先核對什麼？",
      ],
      [
        "How do I open this provider’s directory record?",
        "Which fields does this read actually include?",
        "Can GPU counts tell me the provider’s income?",
        "What should I check first when the directory has no such address?",
      ],
      [
        "이 공급자의 디렉터리 기록을 어떻게 여나요?",
        "이번 읽기에는 어떤 필드가 실제로 있나요?",
        "예시 기록에는 어떤 수입이 없나요?",
        "디렉터리에 이 주소가 없으면 무엇을 먼저 확인하나요?",
      ],
      [
        "このプロバイダーのディレクトリ記録を開くには？",
        "この読取に実際に含まれる項目はどれですか？",
        "例示した記録に無い収入は何ですか？",
        "ディレクトリにそのアドレスが無いとき、何を先に確認しますか？",
      ],
    ),
    steps: copy(
      "在 Akash 提供商目录复制提供商自己的公开地址。它是小写，并且以 akash1 开头。把同一个地址贴到 Akash 监控页。只有记录里的 owner 等于你查询的地址时，这次读取才保留。租用者钱包和部署编号是另一种标识，不会被当成这个提供商来查。",
      "在 Akash 提供商目錄複製提供商自己的公開地址。它是小寫，並且以 akash1 開頭。把同一個地址貼到 Akash 監控頁。只有紀錄裡的 owner 等於你查詢的地址時，這次讀取才保留。租用者錢包和部署編號是另一種標識，不會被當成這個提供商來查。",
      "In the Akash provider directory, copy the provider’s own public address. It is lowercase and starts with akash1. Paste that same address into the Akash monitor. The read is kept only when the record’s owner is the address you asked for. A tenant wallet or a deployment id is a different identifier and is not looked up as this provider.",
      "Akash 공급자 디렉터리에서 공급자 자신의 공개 주소를 복사합니다. 소문자이고 akash1로 시작합니다. 같은 주소를 Akash 모니터에 붙여 넣습니다. 기록의 owner가 조회한 주소와 같을 때만 이 읽기를 유지합니다. 임차인 지갑과 배포 ID는 다른 식별자이며 이 공급자로 조회되지 않습니다.",
      "Akash のプロバイダーディレクトリで、プロバイダー自身の公開アドレスをコピーします。小文字で、akash1 で始まります。同じアドレスを Akash モニターに貼り付けます。記録の owner が照会したアドレスと一致するときだけ、この読取を残します。借り手のウォレットとデプロイ ID は別の識別子であり、このプロバイダーとしては照会しません。",
    ),
    fieldsLead: copy(
      "本页读取提供商目录记录里的 name、isOnline、lastCheckDate、GPU 总数、已分配 GPU 数和 GPU 型号。它不读取租约数量，也不读取 AKT 付款。容量和来源报告的在线标记不是利用率，也不是收入。",
      "本頁讀取提供商目錄紀錄裡的 name、isOnline、lastCheckDate、GPU 總數、已分配 GPU 數和 GPU 型號。它不讀取租約數量，也不讀取 AKT 付款。容量和來源回報的在線標記不是利用率，也不是收入。",
      "This page reads the provider directory record: name, isOnline, lastCheckDate, GPU total, allocated GPU count, and GPU model. It does not load lease counts or AKT payments. Capacity and the reported online flag are not utilization and not income.",
      "이 페이지는 공급자 디렉터리 기록의 name, isOnline, lastCheckDate, GPU 총수, 할당된 GPU 수, GPU 모델을 읽습니다. 리스 수와 AKT 지급은 읽지 않습니다. 용량과 출처가 보고한 온라인 표시는 이용률도 수입도 아닙니다.",
      "このページが読むのはプロバイダーディレクトリ記録の name、isOnline、lastCheckDate、GPU 総数、割り当て済み GPU 数、GPU モデルです。リース件数と AKT の支払は読みません。容量と、取得元が報告したオンライン表示は、利用率でも収入でもありません。",
    ),
    scenario: copy(
      "举例，不是实测：name 为 Example，isOnline 为 true，lastCheckDate 有值，GPU 总数 8，已分配 GPU 数 2，型号为 Example GPU。这表示目录记录了 8 张 GPU，其中 2 张已分配；不能据此断定 2 张正在计算，或机器利用率是 25%。收入还要核对租约时长、价格和结算记录。若 isOnline 缺失，状态保持未知，而不是离线。",
      "舉例，不是實測：name 為 Example，isOnline 為 true，lastCheckDate 有值，GPU 總數 8，已分配 GPU 數 2，型號為 Example GPU。這表示目錄記錄了 8 張 GPU，其中 2 張已分配；不能據此斷定 2 張正在計算，或機器利用率是 25%。收入還要核對租約時長、價格和結算紀錄。若 isOnline 缺失，狀態保持未知，而不是離線。",
      "Illustrative, not a measured provider: name Example, isOnline true, a lastCheckDate present, GPU total 8, allocated GPU count 2, and model Example GPU means the directory reports 8 GPUs, with 2 allocated. It does not establish that 2 are computing or that utilization is 25%. To check income, compare lease duration, price, and settlement records. If isOnline is missing, status stays unknown rather than offline.",
      "예시이며 측정값이 아닙니다. name이 Example, isOnline이 true, lastCheckDate가 있고, GPU 총수 8, 할당된 GPU 수 2, 모델이 Example GPU라면 디렉터리에 GPU 8개 중 2개가 할당되어 있다는 뜻입니다. 2개가 계산 중이거나 이용률이 25%라는 뜻은 아닙니다. 수입은 리스 기간, 가격, 정산 기록으로 확인합니다. isOnline이 없으면 상태는 알 수 없음이며 오프라인이 아닙니다.",
      "例示であり、測定値ではありません。name が Example、isOnline が true、lastCheckDate があり、GPU 総数 8、割り当て済み GPU 数 2、モデルが Example GPU なら、ディレクトリに GPU 8 台、うち割り当て済み 2 台と記録されているという意味です。2 台が計算中、または利用率 25% とは判断できません。収入はリース期間、価格、精算記録で確認します。isOnline が欠ければ状態は不明のままで、オフラインではありません。",
    ),
    check: copy(
      "先确认地址是目录里的提供商地址，不是租用者钱包或部署编号，并且 owner 与它一致。目录没有记录时，先到官方目录确认提供商是否已被收录，再检查数据的更新时间。表里只读 name、isOnline、lastCheckDate 和 GPU 字段。已结算的 AKT 或租约付款要查官方租约和付款记录，那些金额不在这次读取里。租约数量和 GPU 容量不是 AKT 或美元收入。",
      "先確認地址是目錄裡的提供商地址，不是租用者錢包或部署編號，並且 owner 與它一致。目錄沒有紀錄時，先到官方目錄確認提供商是否已被收錄，再檢查資料的更新時間。表裡只讀 name、isOnline、lastCheckDate 和 GPU 欄位。已結算的 AKT 或租約付款要查官方租約和付款紀錄，那些金額不在這次讀取裡。租約數量和 GPU 容量不是 AKT 或美元收入。",
      "First, confirm the address is the provider address from the directory, not a tenant wallet or deployment id, and that owner matches it. Second, if the directory has no record, check whether the official directory lists that provider and when its data was updated. Third, read name, isOnline, lastCheckDate, and the GPU fields only. Fourth, for settled AKT or lease payments, use the official lease and payment records. Those amounts are outside this read. Lease counts and GPU capacity are not AKT or USD income.",
      "먼저 주소가 디렉터리의 공급자 주소인지, 임차인 지갑이나 배포 ID가 아닌지, owner가 그 주소와 같은지 확인합니다. 기록이 없으면 공식 디렉터리에 공급자가 등록되어 있는지와 데이터 갱신 시각을 확인합니다. 표에서는 name, isOnline, lastCheckDate와 GPU 필드만 읽습니다. 정산된 AKT나 리스 지급은 공식 리스·결제 기록에서 확인하며, 그 금액은 이번 읽기에 없습니다. 리스 수와 GPU 용량은 AKT나 USD 수익이 아닙니다.",
      "まずアドレスがディレクトリのプロバイダーアドレスであり、借り手のウォレットやデプロイ ID ではなく、owner が一致することを確認します。記録が無ければ、公式ディレクトリへの掲載とデータの更新時刻を確認します。表では name、isOnline、lastCheckDate と GPU の項目だけを読みます。確定した AKT やリースの支払は公式のリースと支払の記録で確認します。その金額はこの読取の外です。リース件数と GPU 容量は AKT や USD の収入ではありません。",
    ),
    tableTitle: copy(
      "提供商目录记录里的字段",
      "提供商目錄紀錄裡的欄位",
      "Fields in the provider directory record",
      "공급자 디렉터리 기록의 필드",
      "プロバイダーディレクトリ記録の項目",
    ),
    tableHeaders: headers,
    rows: rows(
      [
        ["name", "目录里的提供商名称。", "只是名称，不是租约。"],
        ["isOnline", "目录报告的在线标记。", "缺失时是未知，不要当成离线。"],
        ["lastCheckDate", "目录记录自己的检查时间。", "不是本站抓取时间，也不是付款时间。"],
        ["GPU 总数", "stats.gpu.total，目录里的 GPU 总数。", "不是利用率，也不是 AKT。"],
        [
          "已分配 GPU 数",
          "stats.gpu.active，目录里的已分配 GPU 数。",
          "不是租约列表，也不是付款。",
        ],
        ["GPU 型号", "gpuModels 里的 model。", "是上报的型号文字，不是收入。"],
        ["租约与 AKT", "这次读取不包含租约数量和 AKT 付款。", "结算金额去官方租约和付款记录看。"],
      ],
      [
        ["name", "目錄裡的提供商名稱。", "只是名稱，不是租約。"],
        ["isOnline", "目錄回報的在線標記。", "缺失時是未知，不要當成離線。"],
        ["lastCheckDate", "目錄紀錄自己的檢查時間。", "不是本站抓取時間，也不是付款時間。"],
        ["GPU 總數", "stats.gpu.total，目錄裡的 GPU 總數。", "不是利用率，也不是 AKT。"],
        [
          "已分配 GPU 數",
          "stats.gpu.active，目錄裡的已分配 GPU 數。",
          "不是租約清單，也不是付款。",
        ],
        ["GPU 型號", "gpuModels 裡的 model。", "是上報的型號文字，不是收入。"],
        ["租約與 AKT", "這次讀取不包含租約數量和 AKT 付款。", "結算金額去官方租約和付款紀錄看。"],
      ],
      [
        ["name", "Provider name in the directory.", "A label, not a lease."],
        [
          "isOnline",
          "Online flag reported by the directory.",
          "If it is missing, status is unknown, not offline.",
        ],
        [
          "lastCheckDate",
          "Check time stored on the directory record.",
          "Not this site’s fetch time and not a payment time.",
        ],
        [
          "GPU total",
          "stats.gpu.total, the directory’s GPU total.",
          "Not utilization and not AKT.",
        ],
        [
          "allocated GPU count",
          "stats.gpu.active, the directory’s allocated GPU count.",
          "Not a lease list and not a payment.",
        ],
        ["GPU model", "model inside gpuModels.", "Reported model text, not income."],
        [
          "Leases and AKT",
          "This read does not include lease counts or AKT payments.",
          "Use official lease and payment records for settled amounts.",
        ],
      ],
      [
        ["name", "디렉터리의 공급자 이름입니다.", "이름일 뿐 리스가 아닙니다."],
        [
          "isOnline",
          "디렉터리가 보고한 온라인 표시입니다.",
          "없으면 알 수 없음이며 오프라인이 아닙니다.",
        ],
        [
          "lastCheckDate",
          "디렉터리 기록에 있는 점검 시각입니다.",
          "이 사이트의 조회 시각도, 지급 시각도 아닙니다.",
        ],
        ["GPU 총수", "stats.gpu.total, 디렉터리의 GPU 총수입니다.", "이용률도 AKT도 아닙니다."],
        [
          "할당된 GPU 수",
          "stats.gpu.active, 디렉터리의 활성 GPU 수입니다.",
          "리스 목록도 지급도 아닙니다.",
        ],
        ["GPU 모델", "gpuModels 안의 model입니다.", "보고된 모델 이름이며 수입이 아닙니다."],
        [
          "리스와 AKT",
          "이번 읽기에는 리스 수와 AKT 지급이 없습니다.",
          "정산 금액은 공식 리스·결제 기록에서 확인합니다.",
        ],
      ],
      [
        ["name", "ディレクトリ上のプロバイダー名です。", "名前であり、リースではありません。"],
        [
          "isOnline",
          "ディレクトリが報告したオンライン表示です。",
          "欠ければ不明であり、オフラインではありません。",
        ],
        [
          "lastCheckDate",
          "ディレクトリ記録にある確認時刻です。",
          "このサイトの取得時刻でも、支払時刻でもありません。",
        ],
        [
          "GPU 総数",
          "stats.gpu.total。ディレクトリの GPU 総数です。",
          "利用率でも AKT でもありません。",
        ],
        [
          "割り当て済み GPU 数",
          "stats.gpu.active。ディレクトリのアクティブ GPU 数です。",
          "リース一覧でも支払でもありません。",
        ],
        [
          "GPU モデル",
          "gpuModels の中の model です。",
          "報告されたモデル名であり、収入ではありません。",
        ],
        [
          "リースと AKT",
          "この読取にリース件数と AKT の支払は含まれません。",
          "確定金額は公式のリースと支払の記録で確認します。",
        ],
      ],
    ),
  },
  vast: {
    headings: heading(
      [
        "怎样填写 Host 的 Machine ID？",
        "四项收入怎样才相加？",
        "举例里的四项齐全和缺一项有什么差别？",
        "金额对不上时先比较什么？",
      ],
      [
        "怎樣填寫 Host 的 Machine ID？",
        "四項收入怎樣才相加？",
        "舉例裡的四項齊全和缺一項有什麼差別？",
        "金額對不上時先比較什麼？",
      ],
      [
        "How do I enter the Host Machine ID?",
        "When are the four earnings components added?",
        "What is the difference between four known values and one missing value in an example?",
        "What should I compare first when the amount disagrees?",
      ],
      [
        "Host Machine ID는 어떻게 입력하나요?",
        "수입 네 항목은 언제 더하나요?",
        "예시에서 네 값이 모두 있는 경우와 하나가 빠진 경우는 무엇이 다른가요?",
        "금액이 다를 때 무엇을 먼저 비교하나요?",
      ],
      [
        "Host の Machine ID はどう入力しますか？",
        "4 つの収入項目はいつ合計しますか？",
        "例示で 4 つ揃った場合と 1 つ欠けた場合の違いは？",
        "金額が合わないとき、何を先に比べますか？",
      ],
    ),
    steps: copy(
      "登录后，从 Host 机器页面复制 Machine ID。它是正整数，只含数字，而且不以 0 开头。填到 Vast 项目页，并在下方连接表单里验证读取凭据。不要用租客的 Instance ID 代替。本指南不声称已经验证过真实 Host 账户；目前覆盖的是模拟响应和失败处理。真实 Host 账户联调尚未完成。",
      "登入後，從 Host 機器頁面複製 Machine ID。它是正整數，只含數字，而且不以 0 開頭。填到 Vast 專案頁，並在下方連接表單裡驗證讀取憑證。不要用租客的 Instance ID 代替。本指南不聲稱已經驗證過真實 Host 帳戶；目前覆蓋的是模擬回應和失敗處理。真實 Host 帳戶聯調尚未完成。",
      "After you sign in, copy the Machine ID from the Host machines page. It is a positive integer, digits only, with no leading zero. Enter it on the Vast project page and validate the read credentials in the connection form. Do not substitute a tenant Instance ID. The checks so far cover mocked responses and failure handling. Real Host account validation is pending.",
      "로그인한 뒤 Host 기기 페이지에서 Machine ID를 복사합니다. 양의 정수이고 숫자만 있으며 0으로 시작하지 않습니다. Vast 프로젝트 페이지에 입력하고, 아래 연결 양식에서 읽기 자격 증명을 확인합니다. 임차인 Instance ID로 바꾸지 마세요. 이 가이드는 실제 Host 계정을 검증했다고 말하지 않습니다. 지금까지의 확인은 모의 응답과 실패 처리입니다. 실제 Host 계정 검증은 아직입니다.",
      "ログインしてから Host の機器ページで Machine ID をコピーします。正の整数で、数字だけで、0 から始まりません。Vast のプロジェクトページに入力し、下の接続フォームで読取認証を確認します。借り手の Instance ID で代用しないでください。このガイドは実 Host アカウントを検証済みとは言いません。これまでの確認は模擬応答と失敗時の処理です。実 Host アカウントの検証はこれからです。",
    ),
    fieldsLead: copy(
      "收入单位是美元，期间是香港时间当日。只有 gpu_earn、sto_earn、bwu_earn、bwd_earn 四项都是已知数字时才相加。任何一项缺失，金额就保持未知。不会把已知的几项相加，也不会记成 0。",
      "收入單位是美元，期間是香港時間當日。只有 gpu_earn、sto_earn、bwu_earn、bwd_earn 四項都是已知數字時才相加。任何一項缺失，金額就保持未知。不會把已知的幾項相加，也不會記成 0。",
      "Income is USD for the Hong Kong day. It is the sum of gpu_earn, sto_earn, bwu_earn, and bwd_earn only when every one of those four values is present. If any one is missing, the amount stays unknown. It is not the sum of the known parts, and it is not zero.",
      "수입 단위는 USD이고 기간은 홍콩 시간 당일입니다. gpu_earn, sto_earn, bwu_earn, bwd_earn 네 값이 모두 알려진 숫자일 때만 더합니다. 하나라도 없으면 금액은 알 수 없음으로 남습니다. 알려진 항목만 더하지 않고, 0으로 적지도 않습니다.",
      "収入の単位は USD で、期間は香港時間の当日です。gpu_earn、sto_earn、bwu_earn、bwd_earn の 4 つがすべて既知の数であるときだけ合計します。一つでも欠ければ金額は不明のままです。分かっている分だけを足すことも、0 と記録することもありません。",
    ),
    scenario: copy(
      "举例，不是实测，也不是已验证的 Host 账户：若 gpu_earn 为 1、sto_earn 为 2、bwu_earn 为 0.5、bwd_earn 为 0.5，香港时间当日会显示 4 美元。若 bwd_earn 缺失，收入保持未知，不是 3.5，也不是 0。",
      "舉例，不是實測，也不是已驗證的 Host 帳戶：若 gpu_earn 為 1、sto_earn 為 2、bwu_earn 為 0.5、bwd_earn 為 0.5，香港時間當日會顯示 4 美元。若 bwd_earn 缺失，收入保持未知，不是 3.5，也不是 0。",
      "Illustrative, not a measured host and not a validated Host account: gpu_earn 1, sto_earn 2, bwu_earn 0.5, and bwd_earn 0.5 would sum to 4 USD for that Hong Kong day. If bwd_earn were missing, the income would stay unknown, not 3.5 and not 0.",
      "예시이며 측정값이 아닙니다. 검증된 Host 계정도 아닙니다. gpu_earn 1, sto_earn 2, bwu_earn 0.5, bwd_earn 0.5이면 홍콩 시간 당일 4 USD로 합산됩니다. bwd_earn이 없으면 수입은 알 수 없음이며 3.5도 0도 아닙니다.",
      "例示であり、測定値ではありません。検証済みの Host アカウントでもありません。gpu_earn が 1、sto_earn が 2、bwu_earn が 0.5、bwd_earn が 0.5 なら、香港時間の当日は 4 USD になります。bwd_earn が欠ければ収入は不明のままで、3.5 でも 0 でもありません。",
    ),
    check: copy(
      "先确认填写的是 Host 的 Machine ID，不是租客 Instance ID。再确认 gpu_earn、sto_earn、bwu_earn、bwd_earn 四项都在，然后才读合计。用同一台机器和香港时间当日去对官方出租记录。权限失败保持未知，不要用账户余额填上。真实 Host 账户联调尚未完成。",
      "先確認填寫的是 Host 的 Machine ID，不是租客 Instance ID。再確認 gpu_earn、sto_earn、bwu_earn、bwd_earn 四項都在，然後才讀合計。用同一台機器和香港時間當日去對官方出租紀錄。權限失敗保持未知，不要用帳戶餘額填上。真實 Host 帳戶聯調尚未完成。",
      "First, confirm the id is the Host Machine ID, not a tenant Instance ID. Second, check that gpu_earn, sto_earn, bwu_earn, and bwd_earn are all present before reading a total. Third, compare the same machine and the Hong Kong day with the official rental record. Fourth, a permission failure stays unknown; do not fill it from the account balance. Real Host account validation is pending.",
      "먼저 입력한 ID가 Host Machine ID인지, 임차인 Instance ID가 아닌지 확인합니다. 그다음 gpu_earn, sto_earn, bwu_earn, bwd_earn이 모두 있는지 확인한 뒤에 합계를 읽습니다. 같은 기기와 홍콩 시간 당일을 공식 대여 기록과 비교합니다. 권한 실패는 알 수 없음으로 두고 계정 잔액으로 채우지 마세요. 실제 Host 계정 검증은 아직입니다.",
      "まず入力した ID が Host の Machine ID であり、借り手の Instance ID ではないことを確認します。次に gpu_earn、sto_earn、bwu_earn、bwd_earn がすべて揃ってから合計を読みます。同じ機器と香港時間の当日を公式の貸出記録と比べます。権限の失敗は不明のままにし、口座残高で埋めないでください。実 Host アカウントの検証はこれからです。",
    ),
    tableTitle: copy(
      "Host 机器与四项收入",
      "Host 機器與四項收入",
      "Host machine and the four earnings components",
      "Host 기기와 수입 네 항목",
      "Host 機器と 4 つの収入項目",
    ),
    tableHeaders: headers,
    rows: rows(
      [
        [
          "Machine ID",
          "Host 机器列表里的整数机器编号。",
          "只含数字、不以 0 开头。不要填租客 Instance ID。",
        ],
        ["gpu_earn", "香港时间当日记录里的 GPU 收入分量。", "四项都必须已知，才会进入合计。"],
        ["sto_earn", "同一记录里的存储收入分量。", "缺失则整笔收入未知，不是 0。"],
        ["bwu_earn", "同一记录里的上行带宽收入分量。", "不能只用其余三项相加。"],
        ["bwd_earn", "同一记录里的下行带宽收入分量。", "缺这一项时，合计保持未知。"],
        [
          "当日美元",
          "四项都已知时的美元合计，期间为香港时间当日。",
          "账户余额和小时报价不是这一合计。真实 Host 账户尚未验证。",
        ],
      ],
      [
        [
          "Machine ID",
          "Host 機器清單裡的整數機器編號。",
          "只含數字、不以 0 開頭。不要填租客 Instance ID。",
        ],
        ["gpu_earn", "香港時間當日記錄裡的 GPU 收入分量。", "四項都必須已知，才會進入合計。"],
        ["sto_earn", "同一記錄裡的儲存收入分量。", "缺失則整筆收入未知，不是 0。"],
        ["bwu_earn", "同一記錄裡的上行頻寬收入分量。", "不能只用其餘三項相加。"],
        ["bwd_earn", "同一記錄裡的下行頻寬收入分量。", "缺這一項時，合計保持未知。"],
        [
          "當日美元",
          "四項都已知時的美元合計，期間為香港時間當日。",
          "帳戶餘額和小時報價不是這一合計。真實 Host 帳戶尚未驗證。",
        ],
      ],
      [
        [
          "Machine ID",
          "Integer machine id from the Host machine list.",
          "Digits only, no leading zero. Not a tenant Instance ID.",
        ],
        [
          "gpu_earn",
          "GPU component on the Hong Kong-day record.",
          "All four components must be known before they are summed.",
        ],
        [
          "sto_earn",
          "Storage component on the same record.",
          "If it is missing, the whole amount stays unknown, not 0.",
        ],
        [
          "bwu_earn",
          "Bandwidth-up component on the same record.",
          "Do not add only the other three.",
        ],
        [
          "bwd_earn",
          "Bandwidth-down component on the same record.",
          "If this one is missing, the total stays unknown.",
        ],
        [
          "USD for the day",
          "Sum of the four when all are known, for the Hong Kong day.",
          "Account balance and the hourly price are not this sum. A real Host account is not validated.",
        ],
      ],
      [
        [
          "Machine ID",
          "Host 기기 목록의 정수 기기 번호입니다.",
          "숫자만 있고 0으로 시작하지 않습니다. 임차인 Instance ID가 아닙니다.",
        ],
        [
          "gpu_earn",
          "홍콩 시간 당일 기록의 GPU 수입 항목입니다.",
          "네 항목이 모두 알려져야 합계에 넣습니다.",
        ],
        [
          "sto_earn",
          "같은 기록의 스토리지 수입 항목입니다.",
          "없으면 전체 금액은 알 수 없음이며 0이 아닙니다.",
        ],
        [
          "bwu_earn",
          "같은 기록의 업링크 대역폭 수입 항목입니다.",
          "나머지 세 항목만 더하지 않습니다.",
        ],
        [
          "bwd_earn",
          "같은 기록의 다운링크 대역폭 수입 항목입니다.",
          "이 항목이 없으면 합계는 알 수 없음입니다.",
        ],
        [
          "당일 USD",
          "네 항목이 모두 알려진 때의 USD 합계이며 기간은 홍콩 시간 당일입니다.",
          "계정 잔액과 시간당 가격은 이 합계가 아닙니다. 실제 Host 계정은 검증되지 않았습니다.",
        ],
      ],
      [
        [
          "Machine ID",
          "Host の機器一覧にある整数の機器番号です。",
          "数字だけで、0 から始まりません。借り手の Instance ID ではありません。",
        ],
        [
          "gpu_earn",
          "香港時間の当日記録にある GPU 収入の項目です。",
          "4 つすべてが既知のときだけ合計します。",
        ],
        [
          "sto_earn",
          "同じ記録のストレージ収入の項目です。",
          "欠ければ金額全体は不明であり、0 ではありません。",
        ],
        ["bwu_earn", "同じ記録の上り帯域収入の項目です。", "残りの 3 つだけは合計しません。"],
        ["bwd_earn", "同じ記録の下り帯域収入の項目です。", "これが欠ければ合計は不明のままです。"],
        [
          "当日の USD",
          "4 つがすべて既知のときの USD 合計で、期間は香港時間の当日です。",
          "口座残高と時間単価はこの合計ではありません。実 Host アカウントは未検証です。",
        ],
      ],
    ),
  },
  golem: {
    headings: heading(
      [
        "怎样确认可以查询的节点 ID？",
        "earnings 和 earnings_total 有什么差别？",
        "举例里的两笔 GLM 各属于哪一段？",
        "和钱包到账不一致时先看什么？",
      ],
      [
        "怎樣確認可以查詢的節點 ID？",
        "earnings 和 earnings_total 有什麼差別？",
        "舉例裡的兩筆 GLM 各屬於哪一段？",
        "和錢包入帳不一致時先看什麼？",
      ],
      [
        "How do I confirm the node id this page accepts?",
        "How do earnings and earnings_total differ?",
        "Which window does each illustrative GLM amount belong to?",
        "What should I look at first when the wallet payout disagrees?",
      ],
      [
        "이 페이지가 받는 노드 ID는 어떻게 확인하나요?",
        "earnings와 earnings_total은 어떻게 다른가요?",
        "예시로 든 두 GLM 금액은 각각 어느 구간에 속하나요?",
        "지갑 지급액과 다를 때 무엇을 먼저 보나요?",
      ],
      [
        "このページが受け付けるノード ID はどう確認しますか？",
        "earnings と earnings_total はどう違いますか？",
        "例示した 2 つの GLM はそれぞれどの期間ですか？",
        "ウォレットの入金と違うとき、何を先に見ますか？",
      ],
    ),
    steps: copy(
      "在 Golem Stats 复制节点 ID。本监控接受的形式是 0x 加 40 位十六进制字符。用同一个 ID 查询。只是看起来像钱包的地址，并不能当成节点，除非它就是这个 ID。对比时使用相近的读取时间。",
      "在 Golem Stats 複製節點 ID。本監控接受的形式是 0x 加 40 位十六進位字元。用同一個 ID 查詢。只是看起來像錢包的地址，並不能當成節點，除非它就是這個 ID。對比時使用相近的讀取時間。",
      "On Golem Stats, copy the node id. This monitor accepts 0x followed by 40 hexadecimal characters. Look up that same id. An address that only looks like a wallet is not the node unless it is that id. Compare records fetched around the same time.",
      "Golem Stats에서 노드 ID를 복사합니다. 이 모니터가 받는 형식은 0x 뒤에 16진수 40자입니다. 같은 ID로 조회합니다. 지갑처럼 보이기만 하는 주소는 그 ID가 아니면 노드가 아닙니다. 비교할 때는 가까운 조회 시각의 기록을 사용합니다.",
      "Golem Stats でノード ID をコピーします。このモニターが受け付ける形式は 0x と 16 進 40 文字です。同じ ID で照会します。ウォレットのように見えるだけのアドレスは、その ID そのものでなければノードではありません。比べるときは近い取得時刻の記録を使います。",
    ),
    fieldsLead: copy(
      "earnings 是滚动 24 小时的 GLM 金额。earnings_total 是另行保存的累计 GLM 金额。滚动窗口不是香港自然日，也不是钱包打款或钱包余额。",
      "earnings 是滾動 24 小時的 GLM 金額。earnings_total 是另行保存的累計 GLM 金額。滾動窗口不是香港自然日，也不是錢包打款或錢包餘額。",
      "earnings is the rolling 24-hour GLM amount. earnings_total is the lifetime GLM amount stored separately. The rolling window is not the Hong Kong calendar day and is not a wallet payout or a wallet balance.",
      "earnings는 최근 24시간의 GLM 금액입니다. earnings_total은 따로 저장한 누적 GLM 금액입니다. 그 구간은 홍콩 달력의 하루가 아니고, 지갑 지급이나 지갑 잔액도 아닙니다.",
      "earnings は直近 24 時間の GLM 金額です。earnings_total は別に保存した累計 GLM 金額です。その区間は香港の暦日ではなく、ウォレットへの送金でもウォレット残高でもありません。",
    ),
    scenario: copy(
      "举例，不是实测：earnings 为 1.25 GLM，earnings_total 为 40 GLM。1.25 属于滚动 24 小时，不属于香港时间零点起的那一天，也不是一笔钱包打款。40 是累计字段，不是本页可以转出的余额。",
      "舉例，不是實測：earnings 為 1.25 GLM，earnings_total 為 40 GLM。1.25 屬於滾動 24 小時，不屬於香港時間零點起的那一天，也不是一筆錢包打款。40 是累計欄位，不是本頁可以轉出的餘額。",
      "Illustrative, not a measured node: earnings 1.25 GLM and earnings_total 40 GLM are two fields. 1.25 belongs to the rolling 24-hour window, not to Hong Kong midnight and not to a wallet payout. 40 is the lifetime field, not a balance this page can send.",
      "예시이며 측정값이 아닙니다. earnings가 1.25 GLM이고 earnings_total이 40 GLM이라면 두 필드입니다. 1.25는 최근 24시간 구간에 속하며 홍콩 자정부터의 하루도, 지갑 지급도 아닙니다. 40은 누적 필드이며 이 페이지에서 보낼 수 있는 잔액이 아닙니다.",
      "例示であり、測定値ではありません。earnings が 1.25 GLM、earnings_total が 40 GLM なら、これは 2 つの項目です。1.25 は直近 24 時間の区間であり、香港の午前 0 時からの 1 日でも、ウォレットへの送金でもありません。40 は累計の項目であり、このページから送れる残高ではありません。",
    ),
    check: copy(
      "先核对节点 ID，包括 0x 和 40 位十六进制字符。再分清看的是 earnings 还是 earnings_total。然后比较读取时间，滚动窗口会移动。缺少记录时保持未知。不要把 GLM 数量直接加到 IOTA 数量上，也不要把任一字段当成钱包打款。",
      "先核對節點 ID，包括 0x 和 40 位十六進位字元。再分清看的是 earnings 還是 earnings_total。然後比較讀取時間，滾動窗口會移動。缺少紀錄時保持未知。不要把 GLM 數量直接加到 IOTA 數量上，也不要把任一欄位當成錢包打款。",
      "First, compare the node id, including the 0x prefix and 40 hex characters. Second, see whether you are looking at earnings or at earnings_total. Third, compare the fetch time; the rolling window moves. Fourth, a missing record stays unknown. Do not add GLM amounts to IOTA amounts, and do not treat either field as a wallet payout.",
      "먼저 노드 ID를 0x와 16진수 40자까지 비교합니다. 그다음 earnings인지 earnings_total인지 구분합니다. 이어서 조회 시각을 비교합니다. 최근 24시간 구간은 움직입니다. 기록이 없으면 알 수 없음으로 둡니다. GLM 수량을 IOTA 수량에 직접 더하지 말고, 어느 필드도 지갑 지급으로 보지 마세요.",
      "まずノード ID を、0x と 16 進 40 文字まで比べます。次に見ているのが earnings か earnings_total かを分けます。そのあと取得時刻を比べます。直近 24 時間の区間は動きます。記録が無ければ不明のままにします。GLM の数量を IOTA の数量へ直接足さず、どちらの項目もウォレットへの送金として扱わないでください。",
    ),
    tableTitle: copy(
      "节点 ID 上的两段 GLM",
      "節點 ID 上的兩段 GLM",
      "Two GLM figures for one node id",
      "노드 ID의 GLM 두 구간",
      "ノード ID の 2 つの GLM",
    ),
    tableHeaders: headers,
    rows: rows(
      [
        [
          "节点 ID",
          "Golem Stats 上的节点标识，形式为 0x 加 40 位十六进制字符。",
          "看起来像钱包并不够，必须是这个节点 ID。",
        ],
        ["earnings", "滚动 24 小时的 GLM。", "不是香港自然日，也不是钱包打款。"],
        [
          "earnings_total",
          "另行保存的累计 GLM。",
          "不是钱包余额，也不能和 earnings 当成同一时段。",
        ],
        ["online", "来源报告的在线标记。", "缺失时是未知，不是收益为 0。"],
        ["钱包打款", "本页不读取钱包打款。", "到账差异不能靠把这两项 GLM 相加来解释。"],
      ],
      [
        [
          "節點 ID",
          "Golem Stats 上的節點標識，形式為 0x 加 40 位十六進位字元。",
          "看起來像錢包並不夠，必須是這個節點 ID。",
        ],
        ["earnings", "滾動 24 小時的 GLM。", "不是香港自然日，也不是錢包打款。"],
        [
          "earnings_total",
          "另行保存的累計 GLM。",
          "不是錢包餘額，也不能和 earnings 當成同一時段。",
        ],
        ["online", "來源回報的在線標記。", "缺失時是未知，不是收益為 0。"],
        ["錢包打款", "本頁不讀取錢包打款。", "入帳差異不能靠把這兩項 GLM 相加來解釋。"],
      ],
      [
        [
          "Node id",
          "Node id on Golem Stats: 0x followed by 40 hexadecimal characters.",
          "Looking like a wallet is not enough. It must be this node id.",
        ],
        [
          "earnings",
          "Rolling 24-hour GLM.",
          "Not the Hong Kong calendar day and not a wallet payout.",
        ],
        [
          "earnings_total",
          "Lifetime GLM stored separately.",
          "Not a wallet balance, and not the same window as earnings.",
        ],
        [
          "online",
          "Online flag reported by the source.",
          "If it is missing, status is unknown, not earnings of 0.",
        ],
        [
          "Wallet payout",
          "This page does not read a wallet payout.",
          "A payout difference is not explained by adding the two GLM fields.",
        ],
      ],
      [
        [
          "노드 ID",
          "Golem Stats의 노드 식별자이며 형식은 0x와 16진수 40자입니다.",
          "지갑처럼 보이는 것만으로는 부족하고, 이 노드 ID여야 합니다.",
        ],
        ["earnings", "최근 24시간의 GLM입니다.", "홍콩 달력의 하루가 아니고 지갑 지급도 아닙니다."],
        [
          "earnings_total",
          "따로 저장한 누적 GLM입니다.",
          "지갑 잔액이 아니고 earnings와 같은 구간도 아닙니다.",
        ],
        ["online", "출처가 보고한 온라인 표시입니다.", "없으면 알 수 없음이며 수익 0이 아닙니다."],
        [
          "지갑 지급",
          "이 페이지는 지갑 지급을 읽지 않습니다.",
          "지급 차이는 두 GLM 필드를 더해서 설명하지 않습니다.",
        ],
      ],
      [
        [
          "ノード ID",
          "Golem Stats 上のノード識別子で、形式は 0x と 16 進 40 文字です。",
          "ウォレットのように見えるだけでは足りず、このノード ID そのものが必要です。",
        ],
        [
          "earnings",
          "直近 24 時間の GLM です。",
          "香港の暦日ではなく、ウォレットへの送金でもありません。",
        ],
        [
          "earnings_total",
          "別に保存した累計 GLM です。",
          "ウォレット残高ではなく、earnings と同じ区間でもありません。",
        ],
        [
          "online",
          "取得元が報告したオンライン表示です。",
          "欠ければ不明であり、収益 0 ではありません。",
        ],
        [
          "ウォレット送金",
          "このページはウォレットへの送金を読みません。",
          "入金の差は、2 つの GLM 項目を足しても説明できません。",
        ],
      ],
    ),
  },
};
