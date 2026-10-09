import type { Article } from "./articles";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";
type Evidence = NonNullable<Article["evidence"]>;
export const evidenceLabels = {
  updated: l(["说明更新", "說明更新", "Content updated", "설명 업데이트", "説明の更新"]),
  scope: l(["项目范围", "專案範圍", "Projects", "프로젝트 범위", "対象プロジェクト"]),
  heading: l(["实测案例", "實測案例", "Observed example", "실측 사례", "実測例"]),
  excerpt: l([
    "查看响应摘录",
    "查看回應摘錄",
    "Captured source excerpt",
    "응답 발췌 보기",
    "取得応答の抜粋",
  ]),
};
const rows = (values: string[][], meanings: Record<(typeof LOCALES)[number], string[]>) =>
  Object.fromEntries(
    LOCALES.map((locale) => [locale, values.map((row, i) => [...row, meanings[locale][i]!])]),
  ) as Evidence["rows"];
const headers = l([
  ["字段", "实测值", "怎样解释"],
  ["欄位", "實測值", "如何解讀"],
  ["Field", "Observed value", "Interpretation"],
  ["필드", "관측 값", "해석"],
  ["項目", "観測値", "読み方"],
]);
export const iotaEvidence: Evidence = {
  capturedAt: "2026-10-09T19:55:04+08:00",
  image: "/images/tutorials/iota-rewards-2026-10-09.png",
  source: "/evidence/iota-2026-10-09.json",
  headers,
  caption: l([
    "IOTA 官方公开名单样本的查询结果；截图为简体中文，历史快照而非实时行情。",
    "IOTA 官方公開名單樣本查詢結果；截圖為簡體中文，是歷史快照而非即時行情。",
    "Public IOTA roster sample queried in the monitor. Screenshot in Simplified Chinese; historical snapshot, not a live quote.",
    "공식 IOTA 공개 명단 샘플의 조회 결과입니다. 화면은 간체 중국어이며 실시간 가격이 아닌 과거 스냅샷입니다.",
    "公式IOTA公開リストのサンプル照会。画面は簡体字中国語で、ライブ価格ではなく履歴の記録です。",
  ]),
  method: l([
    "2026-10-09 从官方 /miners 的公开名单选择一个 Miner ID，分别读取 history 与 totals，再与本站公开查询页对照。只使用公开网络记录，没有使用本站账号或客户设备资料。响应读取时间与截图时间分别保存在摘录中。",
    "2026-10-09 從官方 /miners 公開名單選一個 Miner ID，讀取 history、totals 並與公開查詢頁對照。未使用本站帳戶或客戶設備資料。摘錄分別保留回應讀取及截圖時間。",
    "On 2026-10-09, we selected a Miner ID from the official public /miners roster, read history and totals, and compared the public lookup screen. No website customer records were used. API and screenshot timestamps are stored separately in the excerpt.",
    "2026-10-09 공식 공개 /miners 목록의 Miner ID를 선택해 history·totals와 공개 조회 화면을 비교했습니다. 사이트 고객 기록은 사용하지 않았고 API 조회와 캡처 시각은 별도로 보관했습니다.",
    "2026-10-09に公式公開/minersリストからMiner IDを選び、history・totalsと公開照会画面を比較しました。サイトの顧客データは使っていません。応答取得と撮影の時刻は別に記録しています。",
  ]),
  rows: rows(
    [
      ["history.alpha_amounts", "6.64217856 IOTA"],
      ["history.timestamps", "1791504325"],
      ["history.statuses", "settled"],
      ["totals.total_amount_earned", "111.16934253 IOTA"],
      ["totals.total_amount_paid", "111.16934253 IOTA"],
    ],
    l([
      [
        "今日窗口内的一条记录，不是每秒收益。",
        "Unix 秒；在香港时间 2026-10-09 当天窗口内。",
        "计入今日；pending 也计入，frozen 不计。",
        "累计记账总额。",
        "已支付部分，不再叠加到累计。",
      ],
      [
        "今日期間的一筆紀錄，不是每秒收益。",
        "Unix 秒，位於香港時間 2026-10-09 期間。",
        "計入今日；pending 也計入，frozen 不計。",
        "累計記帳總額。",
        "已支付部分，不再加至累計。",
      ],
      [
        "One record within today’s window, not earnings per second.",
        "Unix seconds, inside the 2026-10-09 Hong Kong day.",
        "Counted today; pending also counts, frozen does not.",
        "Lifetime accounted total.",
        "Paid portion; do not add it to earned again.",
      ],
      [
        "오늘 기간의 기록 하나이며 초당 수익이 아닙니다.",
        "Unix 초이며 홍콩 2026-10-09 일자에 속합니다.",
        "오늘 합산. pending도 포함, frozen은 제외합니다.",
        "누적 기록 총액.",
        "지급 부분이며 누적에 다시 더하지 않습니다.",
      ],
      [
        "今日の期間内の1件で、秒当たり収益ではありません。",
        "Unix秒で、香港の2026-10-09の期間内です。",
        "今日に算入。pendingも算入、frozenは除外します。",
        "累計の記帳総額。",
        "支払済み部分で、累計へ再加算しません。",
      ],
    ]),
  ),
  result: l([
    "该次读取的今日合计是 6.64217856 IOTA，累计仍是 111.16934253 IOTA。把 Total Paid 再加一次会重复计数。截图的“报价较早”只针对美元报价，不会把已读取的 IOTA 原币记录变成零；这里只核对账本，不推断设备硬件或后续收益。",
    "此次今日合計 6.64217856 IOTA，累計仍是 111.16934253 IOTA。再加 Total Paid 會重複計數。「報價較早」只描述美元報價，不會把 IOTA 紀錄變成零；不推斷硬體或後續收益。",
    "This read produced 6.64217856 IOTA for today and 111.16934253 IOTA lifetime. Adding Total Paid again would double count. The screenshot’s older-quote label concerns USD, not the recorded token amount. This ledger comparison does not establish hardware or future earnings.",
    "조회 결과 오늘은 6.64217856 IOTA, 누적은 111.16934253 IOTA입니다. Total Paid를 다시 더하면 중복됩니다. 오래된 가격 표시는 USD에 해당하며 기록된 토큰을 0으로 바꾸지 않습니다. 하드웨어나 미래 수익을 추론하지 않습니다.",
    "この取得では今日6.64217856 IOTA、累計111.16934253 IOTAです。Total Paidを再加算すると重複します。古い価格の表示はUSDについてで、記帳数量をゼロにするものではありません。機器仕様や将来の収益は推測しません。",
  ]),
};
export const gonkaEvidence: Evidence = {
  capturedAt: "2026-10-09T19:49:13+08:00",
  image: "/images/tutorials/gonka-epoch-2026-10-09.png",
  source: "/evidence/gonka-2026-10-09.json",
  headers,
  caption: l([
    "Gonka 第 419 轮公开 Host 查询；简体中文截图，历史快照。",
    "Gonka 第 419 輪公開 Host 查詢；簡體中文截圖，歷史快照。",
    "Public Gonka Host lookup in epoch 419. Simplified Chinese screenshot; historical snapshot.",
    "Gonka 에포크 419의 공개 Host 조회. 간체 중국어 화면의 과거 스냅샷입니다.",
    "Gonka第419期の公開Host照会。簡体字中国語の履歴スクリーンショットです。",
  ]),
  method: l([
    "2026-10-09 读取官方公共节点 current/participants，从名单选取 gonka1346p…nd55fh，并在本站粘贴完整公开地址查询。截图中的轮次、权重和模型与响应一致。这是公开 Host 样本，不是本站用户的设备测试，也未测量本地 GPU。",
    "2026-10-09 讀取官方公共節點 current/participants，選取 gonka1346p…nd55fh 並在本站查完整地址。輪次、權重與模型一致。這是公開 Host 樣本，不是客戶設備測試，沒有測量本機 GPU。",
    "On 2026-10-09 we read the official public node’s current/participants, selected gonka1346p…nd55fh, and queried its full address in the monitor. Epoch, weight and models matched. This is a public Host record, not a customer device or a local GPU benchmark.",
    "2026-10-09 공식 공개 노드의 current/participants에서 gonka1346p…nd55fh를 선택해 전체 주소로 조회했습니다. 에포크·가중치·모델이 일치했습니다. 고객 기기나 로컬 GPU 벤치마크가 아닌 공개 Host 기록입니다.",
    "2026-10-09に公式公開ノードのcurrent/participantsからgonka1346p…nd55fhを選び、完全なアドレスで照会しました。期・重み・モデルが一致しました。顧客機器や実機GPUの測定ではなく、公開Host記録です。",
  ]),
  rows: rows(
    [
      ["active_participants.epoch_id", "419"],
      ["participants", "22"],
      ["weight", "1633"],
      ["models", "MiniMaxAI/MiniMax-M2.7"],
      ["ml_nodes → unique node_id", "2"],
    ],
    l([
      [
        "读取时的轮次，不是固定当前值。",
        "该轮名单中的 Host 数，不是 GPU 台数。",
        "该 Host 的轮次权重，不是 1633 GNK。",
        "该记录公布的模型名。",
        "两条不同逻辑节点记录，不证明两台物理设备。",
      ],
      [
        "讀取時輪次，不是固定當前值。",
        "本輪名單 Host 數，不是 GPU 台數。",
        "Host 輪次權重，不是 1633 GNK。",
        "該紀錄公布的模型名。",
        "兩個不同邏輯節點，不證明兩台實體設備。",
      ],
      [
        "Epoch at capture, not a permanently current value.",
        "Hosts in that epoch’s roster, not GPU count.",
        "This Host’s epoch weight, not 1633 GNK.",
        "Model name published in the record.",
        "Two distinct logical nodes, not proof of two physical devices.",
      ],
      [
        "캡처 당시 에포크이며 영구적인 현재 값이 아닙니다.",
        "에포크 Host 명단 수이며 GPU 수가 아닙니다.",
        "Host 에포크 가중치이며 1633 GNK가 아닙니다.",
        "기록에 공개된 모델 이름.",
        "서로 다른 논리 노드 2개이며 물리 기기 2대의 증거가 아닙니다.",
      ],
      [
        "取得時の期で、現在値として固定しません。",
        "その期のHost数で、GPU台数ではありません。",
        "Hostの期の重みで、1633 GNKではありません。",
        "記録で公開されたモデル名。",
        "論理ノード2つで、実機2台の証明ではありません。",
      ],
    ]),
  ),
  result: l([
    "该地址当时列入本轮，页面显示“本轮参与”。接口没有提供设备今日收益，所以工具保持该项不可用，没有把 1633 当作 GNK 奖励。未列入另一轮时应先核对同一轮和同一地址，再回官方节点检查。",
    "該地址當時列入本輪，頁面顯示「本輪參與」。介面不提供設備今日收益，因此沒有將 1633 當作 GNK 獎勵。不同輪次請先對照同輪同地址。",
    "The address was listed, so the monitor showed participation. This endpoint has no device daily-earnings field; the tool did not treat 1633 as GNK rewards. For a missing result, compare the same address and epoch before checking the official node.",
    "주소가 명단에 있어 참여로 표시됐습니다. 이 API에는 기기 일일 수익이 없어 1633을 GNK 보상으로 사용하지 않았습니다. 누락 시 같은 주소와 에포크를 먼저 비교하세요.",
    "アドレスが名簿にあり参加と表示されました。APIに機器の日次収益はなく、1633をGNK報酬には使いません。記載がなければ同じアドレス・期を先に比較します。",
  ]),
};
export const rewardChecks = l([
  [
    "## 怎样复核同一笔收益？",
    "先从官方应用获取公开 Miner ID，在首页直接查询。读取 /v1/entitlements/history/hotkey/公开ID 的 alpha_amounts、timestamps、statuses，按同一位置组成一条记录；与当前香港自然日比较后求和。再用 totals 接口的 total_amount_earned 核对累计。",
    "## 今日为零时怎么排查？",
    "成功读到空数组或窗口内没有 pending、settled 记录，可以是零；超时、缺字段或数组长度不一致是未知。冻结记录、前一天记录和未来时间不能计入今日。状态采样、收益记账和美元报价有不同时间，先比较各自时效，再决定是否回本机检查。",
  ],
  [
    "## 如何複核同一筆收益？",
    "先從官方應用取得公開 Miner ID，在首頁直接查詢。讀取 history 的 alpha_amounts、timestamps、statuses，同位置組成一筆紀錄；按香港自然日求和，再用 totals 的 total_amount_earned 核對累計。",
    "## 今日為零如何排查？",
    "成功讀到空陣列或期間沒有 pending、settled 紀錄，可以為零；逾時、缺欄位或陣列長度不同是未知。凍結、前一天和未來紀錄不計入今日。先核對狀態、記帳和美元報價各自時間，再回本機檢查。",
  ],
  [
    "## Reproduce the accounting check",
    "Copy the public Miner ID from the official app and query it on the home page. Read alpha_amounts, timestamps and statuses from /v1/entitlements/history/hotkey/public-ID; positions identify each record. Sum eligible entries in the same Hong Kong day, then compare total_amount_earned from totals for lifetime.",
    "## Diagnose zero or missing daily rewards",
    "A successfully read empty array or a day with no pending/settled entries can legitimately be zero. Timeouts, missing fields or unequal array lengths are unknown. Frozen, previous-day and future records do not count today. Check the independent activity, accounting and quote clocks before inspecting the machine.",
  ],
  [
    "## 같은 보상을 재확인하기",
    "공식 앱에서 공개 Miner ID를 복사해 홈페이지에서 조회합니다. history의 alpha_amounts·timestamps·statuses에서 같은 위치를 하나의 기록으로 읽고 홍콩 일자에 맞는 항목을 합산합니다. 누적은 totals의 total_amount_earned와 비교합니다.",
    "## 오늘 0 또는 누락 확인하기",
    "성공한 빈 배열이나 오늘 pending·settled 기록 없음은 0일 수 있습니다. 시간 초과·필드 누락·배열 길이 불일치는 알 수 없음입니다. frozen·전일·미래 기록은 제외합니다. 상태·기록·가격의 개별 시각을 확인한 뒤 실기기를 점검하세요.",
  ],
  [
    "## 同じ報酬を再確認する",
    "公式アプリの公開Miner IDをホームで照会します。historyのalpha_amounts・timestamps・statusesの同じ位置を1件として読み、香港の同日内の対象記録を合算します。累計はtotalsのtotal_amount_earnedと比較します。",
    "## 今日がゼロ・未取得の場合",
    "取得成功の空配列や当日にpending・settledがない場合はゼロになり得ます。タイムアウト・項目不足・配列長の不一致は不明です。frozen・前日・未来の記録は除外します。状態・記帳・価格の別々の時刻を確認してから実機を調べます。",
  ],
]);
