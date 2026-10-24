import type { Article } from "../articles";

type Text = Article["title"];
type Questions = NonNullable<Article["questions"]>;

function text(zh: string, tw: string, en: string, ko: string, ja: string): Text {
  return { zh, "zh-TW": tw, en, ko, ja };
}

function questions(rows: Array<[Text, Text]>): Questions {
  return {
    zh: rows.map(([q, a]) => ({ question: q.zh, answer: a.zh })),
    "zh-TW": rows.map(([q, a]) => ({ question: q["zh-TW"], answer: a["zh-TW"] })),
    en: rows.map(([q, a]) => ({ question: q.en, answer: a.en })),
    ko: rows.map(([q, a]) => ({ question: q.ko, answer: a.ko })),
    ja: rows.map(([q, a]) => ({ question: q.ja, answer: a.ja })),
  };
}

function paras(
  zh: string[],
  tw: string[],
  en: string[],
  ko: string[],
  ja: string[],
): Article["body"] {
  return { zh, "zh-TW": tw, en, ko, ja };
}

function table(headers: Text, rows: Text[]): NonNullable<Article["comparison"]> {
  const locales = ["zh", "zh-TW", "en", "ko", "ja"] as const;
  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      { headers: headers[locale].split("|"), rows: rows.map((row) => row[locale].split("|")) },
    ]),
  ) as NonNullable<Article["comparison"]>;
}

const monitor = "gonka-monitor-guide";
const hostId = "gonka-host-id-api";
const poc = "gonka-poc-inference-status";
const rewards = "gonka-epoch-rewards-accounting";
const missing = "gonka-host-not-found";

const sources = [
  { name: "Gonka", url: "https://gonka.ai/" },
  { name: "Gonka Host quickstart", url: "https://gonka.ai/docs/host/quickstart/" },
  { name: "Gonka Network Node API", url: "https://gonka.ai/docs/host/network-node-api/" },
];

const tool = "[Gonka 监控](/projects/gonka)";
const toolTw = "[Gonka 監控](/projects/gonka)";
const toolEn = "[Gonka monitor](/projects/gonka)";
const toolKo = "[Gonka 모니터](/projects/gonka)";
const toolJa = "[Gonkaモニター](/projects/gonka)";

const api = "https://gonka.ai/docs/host/network-node-api/";
const quick = "https://gonka.ai/docs/host/quickstart/";
const home = "https://gonka.ai/";

export const gonkaDepthGuides: Article[] = [
  {
    slug: monitor,
    project: "gonka",
    published: "2026-10-09",
    modified: "2026-10-24",
    sources,
    related: [hostId, rewards, missing],
    topic: text(
      "本轮有没有这台 Host",
      "本輪有沒有這台 Host",
      "Is this Host in the epoch",
      "이번 에포크에 Host가 있는지",
      "今期にこのHostがあるか",
    ),
    title: text(
      "Gonka Host 是否本轮参与：地址、模型和权重怎么核对",
      "Gonka Host 是否本輪參與：地址、模型和權重怎麼核對",
      "Is my Gonka Host in this epoch? Check address, models and weight",
      "Gonka Host가 이번 에포크에 있나요? 주소, 모델, 가중치 확인",
      "Gonka Hostは今期に参加しているか：アドレス、モデル、重みの確認",
    ),
    description: text(
      "在 Gonka 监控贴上 Host 的 gonka 地址。页面显示本轮 epoch、该地址的权重和模型列表。权重不是已入账的 GNK。",
      "在 Gonka 監控貼上 Host 的 gonka 地址。頁面顯示本輪 epoch、該地址的權重和模型清單。權重不是已入帳的 GNK。",
      "Paste the Host’s gonka address in the Gonka monitor. The page shows this epoch, that address’s weight, and its model list. Weight is not GNK already credited.",
      "Gonka 모니터에 Host의 gonka 주소를 붙입니다. 페이지는 이번 epoch, 그 주소의 가중치, 모델 목록을 보여 줍니다. 가중치는 이미 입금된 GNK가 아닙니다.",
      "GonkaモニターにHostのgonkaアドレスを貼ります。ページは今期のepoch、そのアドレスの重み、モデル一覧です。重みは入金済みのGNKではありません。",
    ),
    summary: text(
      "能对上当前参与者名单时，状态是本轮参与，并给出权重和模型。名单已读到但没有这台地址时是当前轮次未列出此地址。整页读失败是未获取或旧数据，权重保持未知，不是 0。",
      "能對上目前參與者名單時，狀態是本輪參與，並給出權重和模型。名單已讀到但沒有這台地址時是目前輪次未列出此地址。整頁讀取失敗是未取得或舊資料，權重保持未知，不是 0。",
      "A match on the current participant list means this Host is in the epoch, with weight and models. A loaded list without that address means not listed. A failed page read is Unavailable or Cached data, and weight stays unknown rather than zero.",
      "현재 참여자 명단과 맞으면 이번 에포크 참여이며 가중치와 모델이 나옵니다. 명단은 읽혔는데 주소가 없으면 미등재입니다. 페이지 읽기 실패는 사용 불가 또는 오래된 데이터이고, 가중치는 0이 아니라 알 수 없음입니다.",
      "現在の参加者名簿と一致すれば今期参加で、重みとモデルが出ます。名簿は読めたのにアドレスがなければ未掲載です。ページ取得の失敗は利用不可か古いデータで、重みは0ではなく不明のままです。",
    ),
    comparisonTitle: text(
      "这一屏分别在说什么",
      "這一屏分別在說什麼",
      "What this screen is saying",
      "이 화면이 말하는 것",
      "この画面が示していること",
    ),
    comparison: table(
      text(
        "你看到的|含义|不要把它当成",
        "你看到的|含義|不要把它當成",
        "What you see|Meaning|Do not treat it as",
        "보이는 것|의미|이렇게 보지 않음",
        "表示|意味|こうは扱わない",
      ),
      [
        text(
          "上方参与者人数和 epoch|当前轮次名单的规模和轮次编号|你这台 Host 的权重",
          "上方參與者人數和 epoch|目前輪次名單的規模和輪次編號|你這台 Host 的權重",
          "Participant count and epoch above|Size and id of the current-epoch list|This Host’s weight",
          "위쪽 참여자 수와 epoch|현재 에포크 명단의 규모와 번호|이 Host의 가중치",
          "上部の参加者数とepoch|今期名簿の規模と番号|このHostの重み",
        ),
        text(
          "本轮参与|完整地址出现在当前名单|机器此刻一定在线，或推理请求一定成功",
          "本輪參與|完整地址出現在目前名單|機器此刻一定在線，或推理請求一定成功",
          "In this epoch|The full address is on the current list|The machine is certainly online now, or inference certainly succeeded",
          "이번 에포크 참여|전체 주소가 현재 명단에 있음|지금 반드시 온라인이거나 추론이 반드시 성공함",
          "今期参加|完全なアドレスが現在の名簿にある|今確実にオンライン、または推論が必ず成功",
        ),
        text(
          "权重|官方接口所称的本轮奖励权重|已入账 GNK、美元或单价",
          "權重|官方介面所稱的本輪獎勵權重|已入帳 GNK、美元或單價",
          "Weight|The epoch reward weight named by the public API|Credited GNK, dollars, or a token price",
          "가중치|공개 API가 말하는 이번 에포크 보상 가중치|입금된 GNK, 달러, 토큰 가격",
          "重み|公開APIが言う今期の報酬の重み|入金済みGNK、ドル、トークン価格",
        ),
        text(
          "模型一行|该 Host 记录里列出的模型名|正在服务的请求数",
          "模型一行|該 Host 紀錄裡列出的模型名|正在服務的請求數",
          "The models line|Model names on that Host record|A count of requests being served",
          "모델 한 줄|그 Host 기록에 적힌 모델 이름|처리 중인 요청 수",
          "モデルの一行|そのHost記録にあるモデル名|処理中のリクエスト数",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "贴上地址后，怎样算这台 Host 在本轮？",
          "貼上地址後，怎樣算這台 Host 在本輪？",
          "After I paste the address, when is the Host in this epoch?",
          "주소를 붙인 뒤, 언제 이 Host가 이번 에포크에 있나요?",
          "アドレスを貼ったあと、いつこのHostは今期にいますか？",
        ),
        text(
          "当前参与者名单读成功，并且完整地址能对上一条记录，状态就是本轮参与。同时会显示该记录的权重和模型。对不上就是当前轮次未列出此地址，不是权重 0。",
          "目前參與者名單讀取成功，並且完整地址能對上一條紀錄，狀態就是本輪參與。同時會顯示該紀錄的權重和模型。對不上就是目前輪次未列出此地址，不是權重 0。",
          "When the current participant list loads and the full address matches one record, the status reads In this epoch. That record’s weight and models are shown with it. No match means not listed, not weight zero.",
          "현재 참여자 명단이 읽히고 전체 주소가 한 기록과 맞으면 상태는 이번 에포크 참여입니다. 그 기록의 가중치와 모델이 함께 나옵니다. 맞지 않으면 미등재이며 가중치 0이 아닙니다.",
          "現在の参加者名簿が読め、完全なアドレスが1件と一致すれば状態は今期参加です。その記録の重みとモデルが一緒に出ます。一致しなければ未掲載で、重み0ではありません。",
        ),
      ],
      [
        text(
          "上方的参与者人数能不能代替我这台？",
          "上方的參與者人數能不能代替我這台？",
          "Can the participant count above stand in for my Host?",
          "위쪽 참여자 수로 내 Host를 대신할 수 있나요?",
          "上の参加者数で自分のHostの代わりになりますか？",
        ),
        text(
          "不能。那是当前名单里有多少条 Host 记录，以及这一轮的 epoch 编号。你的权重和模型只在地址对上之后出现。",
          "不能。那是目前名單裡有多少條 Host 紀錄，以及這一輪的 epoch 編號。你的權重和模型只在地址對上之後出現。",
          "No. That figure is how many Host records are on the current list, plus the epoch id. Your weight and models appear only after the address matches.",
          "아닙니다. 그 숫자는 현재 명단의 Host 기록 수와 epoch 번호입니다. 가중치와 모델은 주소가 맞은 뒤에만 나옵니다.",
          "なりません。それは現在の名簿にあるHost記録の件数とepoch番号です。重みとモデルはアドレスが一致したあとだけ出ます。",
        ),
      ],
      [
        text(
          "权重旁边没有 GNK，是不是漏读了？",
          "權重旁邊沒有 GNK，是不是漏讀了？",
          "There is no GNK next to weight. Was something missed?",
          "가중치 옆에 GNK가 없는데, 빠뜨린 것인가요?",
          "重みの横にGNKがありません。読み落としですか？",
        ),
        text(
          "不是。官方接口把 weight 说明为本轮奖励权重。监控只显示这个数。入账多少 GNK 要到官方账本或奖励说明里查，页面下方也标明没有日收益。",
          "不是。官方介面把 weight 說明為本輪獎勵權重。監控只顯示這個數。入帳多少 GNK 要到官方帳本或獎勵說明裡查，頁面下方也標明沒有日收益。",
          "No. The public API describes weight as the reward weight for this epoch. The monitor shows that number. How much GNK was credited belongs on the official ledger or rewards notes. The page also says there is no daily earnings figure.",
          "아닙니다. 공개 API는 weight를 이번 에포크의 보상 가중치로 설명합니다. 모니터는 그 숫자만 보여 줍니다. GNK가 얼마나 입금됐는지는 공식 원장이나 보상 설명을 봐야 합니다. 페이지도 일일 수익 숫자는 없다고 표시합니다.",
          "違います。公開APIはweightを今期の報酬の重みと説明しています。モニターはその数だけを出します。いくらGNKが入金されたかは公式台帳か報酬の説明で確認します。ページも日次収益の数字はないと示します。",
        ),
      ],
    ]),
    body: paras(
      [
        "把 Host 的完整 gonka 地址贴进 " +
          tool +
          "。当前参与者名单读成功且地址对上时，状态是本轮参与，并给出这一轮的 epoch、该记录的权重和模型名。名单里没有这台地址是当前轮次未列出此地址。整页读失败时不要把空权重读成 0。",
        "## 这些字段在说什么",
        "- 上方两格是当前名单的参与者人数，以及本轮 epoch 编号。它们描述这一轮的名单，不是你这台机器的收益。",
        "- 本轮参与表示你贴上的完整地址出现在这份当前名单里。它不表示此刻推理请求一定成功，也不表示机器实时心跳。",
        "- 权重是 [Network Node API](" +
          api +
          ") 对该记录所称的本轮奖励权重。模型一行是同一条记录里的模型名；没有名字时显示横线。",
        "- 保存到设备列表后，这台设备的活动行同样是 epoch 编号，累计位置显示的是权重，单位不是 GNK 入账。",
        "## 先核对什么",
        "- 地址必须是 Host 账户那串 gonka 开头的完整地址，和名单里的 index 一致。服务网址、校验者公钥、大写十六进制都对不上。怎么区分见 [该贴哪一种标识](/learn/" +
          hostId +
          ")。",
        "- 看页面时间。标注为旧数据时，参与状态沿用上一份成功结果，不能当成刚刚又确认过。",
        "- 模型名只说明记录里登记了哪些模型。请求是否正在被这台 Host 处理，这页不显示。",
        "## 接下来怎么做",
        "- 对上了：记下 epoch、权重和模型，再去官方奖励说明核对入账。不要把权重乘币价。见 [权重和 GNK 入账](/learn/" +
          rewards +
          ")。",
        "- 当前轮次未列出此地址：先核对是不是贴错了标识，再看是不是还停在上一轮。见 [未找到 Host](/learn/" +
          missing +
          ")。",
        "- 整页未获取：先刷新。仍失败就到 [Host quickstart](" +
          quick +
          ") 和 API 文档核对节点是否已作为 Host 加入，而不是在这里把权重填成 0。",
        "- 免费每个项目可保存 5 台设备，Pro 为 50 台。同一台已保存设备上重复绑定 Gonka 不另占名额。",
        "## 文档里的示意记录",
        "说明性例子，不是你的收益：API 文档的样例记录把 weight 写成 10，并列出一个模型名。若监控对上你的地址，就按页面上的 epoch、权重和模型阅读；样例里的 10 不能套到你的 Host，也不能换成 GNK。",
        "## 这页做不到的事",
        "- 不启动或停止 ML 节点，也不读取你机器上的容器日志。",
        "- 不把权重换成 GNK，不承诺发放时间。[官网](" +
          home +
          ") 写明 GPU 提供方托管模型、提供推理并赚取 GNK，但没有在这页给出你的入账金额。",
        "- 读失败时权重保持未知。AI 崩溃分析不占用上述设备名额；本页也不能代你操作 Gonka 主机。",
      ],
      [
        "把 Host 的完整 gonka 地址貼進 " +
          toolTw +
          "。目前參與者名單讀取成功且地址對上時，狀態是本輪參與，並給出這一輪的 epoch、該紀錄的權重和模型名。名單裡沒有這台地址是目前輪次未列出此地址。整頁讀取失敗時不要把空權重讀成 0。",
        "## 這些欄位在說什麼",
        "- 上方兩格是目前名單的參與者人數，以及本輪 epoch 編號。它們描述這一輪的名單，不是你這台機器的收益。",
        "- 本輪參與表示你貼上的完整地址出現在這份目前名單裡。它不表示此刻推理請求一定成功，也不表示機器即時心跳。",
        "- 權重是 [Network Node API](" +
          api +
          ") 對該紀錄所稱的本輪獎勵權重。模型一行是同一條紀錄裡的模型名；沒有名字時顯示橫線。",
        "- 儲存到裝置清單後，這台裝置的活動列同樣是 epoch 編號，累計位置顯示的是權重，單位不是 GNK 入帳。",
        "## 先核對什麼",
        "- 地址必須是 Host 帳戶那串 gonka 開頭的完整地址，和名單裡的 index 一致。服務網址、驗證者公鑰、大寫十六進位都對不上。怎麼區分見 [該貼哪一種標識](/learn/" +
          hostId +
          ")。",
        "- 看頁面時間。標註為舊資料時，參與狀態沿用上一份成功結果，不能當成剛剛又確認過。",
        "- 模型名只說明紀錄裡登記了哪些模型。請求是否正在被這台 Host 處理，這頁不顯示。",
        "## 接下來怎麼做",
        "- 對上了：記下 epoch、權重和模型，再去官方獎勵說明核對入帳。不要把權重乘幣價。見 [權重和 GNK 入帳](/learn/" +
          rewards +
          ")。",
        "- 目前輪次未列出此地址：先核對是不是貼錯了標識，再看是不是還停在上一輪。見 [未找到 Host](/learn/" +
          missing +
          ")。",
        "- 整頁未取得：先重新整理。仍失敗就到 [Host quickstart](" +
          quick +
          ") 和 API 文件核對節點是否已作為 Host 加入，而不是在這裡把權重填成 0。",
        "- 免費每個專案可儲存 5 台裝置，Pro 為 50 台。同一台已儲存裝置上重複綁定 Gonka 不另佔名額。",
        "## 文件裡的示意紀錄",
        "說明性例子，不是你的收益：API 文件的樣例紀錄把 weight 寫成 10，並列出一個模型名。若監控對上你的地址，就按頁面上的 epoch、權重和模型閱讀；樣例裡的 10 不能套到你的 Host，也不能換成 GNK。",
        "## 這頁做不到的事",
        "- 不啟動或停止 ML 節點，也不讀取你機器上的容器日誌。",
        "- 不把權重換成 GNK，不承諾發放時間。[官網](" +
          home +
          ") 寫明 GPU 提供方託管模型、提供推理並賺取 GNK，但沒有在這頁給出你的入帳金額。",
        "- 讀取失敗時權重保持未知。AI 崩潰分析不佔用上述裝置名額；本頁也不能代你操作 Gonka 主機。",
      ],
      [
        "Paste the Host’s full gonka address into the " +
          toolEn +
          ". When the current participant list loads and the address matches, the status reads In this epoch, with this epoch, that record’s weight, and its model names. An address missing from a loaded list is not listed. When the whole page fails to load, do not read a blank weight as zero.",
        "## What these fields mean",
        "- The two figures at the top are how many participants are on the current list, and the epoch id. They describe the list, not this machine’s earnings.",
        "- In this epoch means the full address you pasted is on that current list. It does not mean an inference request is succeeding right now, and it is not a live heartbeat.",
        "- Weight is what the [Network Node API](" +
          api +
          ") calls the reward weight for this epoch. The models line is the model names on the same record. If none are listed, you see a dash.",
        "- After you save the Host on a device, that device’s activity line is also the epoch id, and the total position shows weight. The unit is not credited GNK.",
        "## What to inspect first",
        "- The address has to be the Host account’s full gonka-prefixed address, the same value as index on the list. A service URL, a validator public key, or uppercase hex will not match. See [which identifier to paste](/learn/" +
          hostId +
          ").",
        "- Read the page time. If it is marked Cached data, that status is the last successful list, not a fresh confirmation.",
        "- Model names only say which models are on the record. This page does not show whether requests are being served by this Host.",
        "## What to do next",
        "- If it matches: note the epoch, weight, and models, then check the official rewards notes for what was credited. Do not multiply weight by a token price. See [weight and credited GNK](/learn/" +
          rewards +
          ").",
        "- If it is not listed: confirm you pasted the right identifier, then check whether you are still looking at the previous epoch. See [Host not found](/learn/" +
          missing +
          ").",
        "- If the page is unavailable: refresh once. If it still fails, use the [Host quickstart](" +
          quick +
          ") and the API docs to see whether the node joined as a Host. Do not type 0 into the weight.",
        "- Free keeps five saved devices per project, and Pro keeps 50. Binding Gonka again on the same saved device does not take another slot.",
        "## The sample in the docs",
        "Illustration, not your income: the API document’s sample record sets weight to 10 and lists one model name. If the monitor matches your address, read the epoch, weight, and models on the page. The sample 10 does not transfer to your Host and does not convert into GNK.",
        "## What this page cannot do",
        "- It does not start or stop an ML node, and it does not read container logs on your machine.",
        "- It does not turn weight into GNK and it does not promise a payout time. The [site](" +
          home +
          ") says GPU providers host models, serve inference, and earn GNK, but this page does not show your credited amount.",
        "- A failed read leaves weight unknown. AI crash analysis does not use those device slots. This page also cannot operate the Gonka host for you.",
      ],
      [
        "Host의 전체 gonka 주소를 " +
          toolKo +
          "에 붙이세요. 현재 참여자 명단이 읽히고 주소가 맞으면 상태는 이번 에포크 참여이고, 이번 epoch, 그 기록의 가중치, 모델 이름이 나옵니다. 명단은 읽혔는데 주소가 없으면 미등재입니다. 페이지 전체가 실패하면 빈 가중치를 0으로 읽지 마세요.",
        "## 이 항목이 의미하는 것",
        "- 위쪽 두 칸은 현재 명단의 참여자 수와 이번 epoch 번호입니다. 명단을 설명할 뿐, 이 기계의 수익이 아닙니다.",
        "- 이번 에포크 참여는 붙인 전체 주소가 현재 명단에 있다는 뜻입니다. 지금 추론 요청이 성공한다는 뜻도, 실시간 심박도 아닙니다.",
        "- 가중치는 [Network Node API](" +
          api +
          ")가 그 기록에 대해 말하는 이번 에포크 보상 가중치입니다. 모델 줄은 같은 기록의 모델 이름입니다. 이름이 없으면 줄표입니다.",
        "- 기기에 저장한 뒤에도 활동 줄은 epoch 번호이고, 누적 자리는 가중치입니다. 단위는 입금된 GNK가 아닙니다.",
        "## 먼저 확인할 것",
        "- 주소는 Host 계정의 gonka로 시작하는 전체 주소여야 하며 명단의 index와 같아야 합니다. 서비스 URL, 검증자 공개 키, 대문자 16진수는 맞지 않습니다. 구분은 [어떤 식별자를 붙일까](/learn/" +
          hostId +
          ")를 보세요.",
        "- 페이지 시각을 보세요. 오래된 데이터로 표시되면 참여 상태는 마지막 성공 명단이며, 방금 다시 확인된 것이 아닙니다.",
        "- 모델 이름은 기록에 어떤 모델이 적혀 있는지만 말합니다. 이 페이지는 요청을 이 Host가 처리 중인지는 보여 주지 않습니다.",
        "## 다음에 할 일",
        "- 맞으면 epoch, 가중치, 모델을 적고 공식 보상 설명에서 입금을 확인하세요. 가중치에 토큰 가격을 곱하지 마세요. [가중치와 GNK 입금](/learn/" +
          rewards +
          ")을 보세요.",
        "- 미등재이면 식별자를 잘못 붙였는지 먼저 보고, 이전 에포크를 보고 있는지도 확인하세요. [Host를 찾지 못함](/learn/" +
          missing +
          ")을 보세요.",
        "- 페이지를 사용할 수 없으면 한 번 새로 고치세요. 그래도 실패하면 [Host quickstart](" +
          quick +
          ")와 API 문서에서 노드가 Host로 참여했는지 확인하세요. 가중치에 0을 적지 마세요.",
        "- 무료는 프로젝트마다 저장된 기기 5대, Pro는 50대입니다. 같은 저장 기기에 Gonka를 다시 묶어도 자리를 더 쓰지 않습니다.",
        "## 문서의 예시 기록",
        "설명용 예이며 당신의 수익이 아닙니다. API 문서의 예시 기록은 weight를 10으로 두고 모델 이름 하나를 적습니다. 모니터가 당신 주소와 맞으면 페이지의 epoch, 가중치, 모델을 읽으세요. 예시의 10은 당신 Host에 옮길 수 없고 GNK로 바꾸지도 않습니다.",
        "## 이 페이지가 하지 않는 일",
        "- ML 노드를 시작하거나 멈추지 않고, 당신 기계의 컨테이너 로그도 읽지 않습니다.",
        "- 가중치를 GNK로 바꾸지 않고 지급 시각을 약속하지 않습니다. [사이트](" +
          home +
          ")는 GPU 제공자가 모델을 호스트하고 추론을 제공하며 GNK를 번다고 쓰지만, 이 페이지는 당신의 입금액을 보여 주지 않습니다.",
        "- 읽기 실패 시 가중치는 알 수 없음으로 남습니다. AI 장애 분석은 위 기기 자리를 쓰지 않습니다. 이 페이지가 Gonka 호스트를 대신 조작하지도 않습니다.",
      ],
      [
        "Hostの完全なgonkaアドレスを" +
          toolJa +
          "に貼ります。現在の参加者名簿が読め、アドレスが一致すれば状態は今期参加で、今期のepoch、その記録の重み、モデル名が出ます。名簿は読めたのにアドレスがなければ未掲載です。ページ全体が失敗したとき、空の重みを0と読まないでください。",
        "## これらの項目の意味",
        "- 上の二つは、現在の名簿の参加者数と今期のepoch番号です。名簿の説明であり、この機械の収益ではありません。",
        "- 今期参加は、貼った完全なアドレスが現在の名簿にあるという意味です。今推論リクエストが成功していることでも、ライブの心拍でもありません。",
        "- 重みは [Network Node API](" +
          api +
          ") がその記録について言う今期の報酬の重みです。モデルの行は同じ記録のモデル名です。名前がなければダッシュです。",
        "- デバイスに保存したあと、活動行もepoch番号で、累計の位置に出るのは重みです。単位は入金済みのGNKではありません。",
        "## 先に確認すること",
        "- アドレスはHostアカウントの、gonkaで始まる完全なアドレスで、名簿のindexと同じである必要があります。サービスURL、バリデータ公開鍵、大文字の十六進は一致しません。区別は [どの識別子を貼るか](/learn/" +
          hostId +
          ") を見てください。",
        "- ページの時刻を見ます。古いデータと表示されていれば、参加状態は直前に成功した名簿であり、今再確認されたものではありません。",
        "- モデル名は、記録にどのモデルが載っているかだけを示します。このページは、リクエストをこのHostが処理中かどうかは出しません。",
        "## 次にすること",
        "- 一致したらepoch、重み、モデルを控え、公式の報酬説明で入金を確認します。重みにトークン価格を掛けないでください。[重みと入金GNK](/learn/" +
          rewards +
          ") を見てください。",
        "- 未掲載なら、識別子を貼り間違えていないかを先に確認し、前の期を見ていないかも見ます。[Hostが見つからない](/learn/" +
          missing +
          ") を見てください。",
        "- ページが使えないときは一度更新します。それでも失敗するなら [Host quickstart](" +
          quick +
          ") とAPI文書で、ノードがHostとして参加しているかを確認します。重みに0を書かないでください。",
        "- 無料はプロジェクトごとに保存デバイス5台、Proは50台です。同じ保存デバイスにGonkaを重ねて結んでも枠は増えません。",
        "## 文書の例示記録",
        "説明用の例であり、あなたの収益ではありません。API文書の例ではweightが10で、モデル名が一つ載っています。モニターがあなたのアドレスと一致したら、ページ上のepoch、重み、モデルを読んでください。例の10は自分のHostに移せず、GNKにも換わりません。",
        "## このページがしないこと",
        "- MLノードの開始や停止はせず、自分の機械のコンテナログも読みません。",
        "- 重みをGNKに換えず、支払い時刻も約束しません。[サイト](" +
          home +
          ")はGPU提供者がモデルをホストし、推論を提供し、GNKを得ると書いていますが、このページはあなたの入金額を出しません。",
        "- 取得に失敗すると重みは不明のままです。AIクラッシュ分析は上のデバイス枠を使いません。このページがGonkaホストを代わりに操作することもありません。",
      ],
    ),
  },
  {
    slug: hostId,
    project: "gonka",
    published: "2026-10-24",
    modified: "2026-10-24",
    sources,
    related: [monitor, missing, poc],
    topic: text(
      "该贴哪一种标识",
      "該貼哪一種標識",
      "Which identifier to paste",
      "어떤 식별자를 붙일까",
      "どの識別子を貼るか",
    ),
    title: text(
      "Gonka 监控该贴 Host 地址：不要用推理网址或十六进制",
      "Gonka 監控該貼 Host 地址：不要用推理網址或十六進位",
      "Paste the Gonka Host address, not the inference URL or the hex",
      "Gonka 모니터에는 Host 주소를: 추론 URL이나 16진수는 안 됩니다",
      "GonkaモニターにはHostアドレスを：推論URLや十六進は不可",
    ),
    description: text(
      "Gonka 监控只接受 Host 的 gonka 账户地址，并与当前名单里的 index 整段比对。推理网址、校验者公钥和名单外的大写十六进制对不上。",
      "Gonka 監控只接受 Host 的 gonka 帳戶地址，並與目前名單裡的 index 整段比對。推理網址、驗證者公鑰和名單外的大寫十六進位對不上。",
      "The Gonka monitor accepts only the Host’s gonka account address and matches the whole index on the current list. An inference URL, a validator key, and the uppercase hex will not match.",
      "Gonka 모니터는 Host의 gonka 계정 주소만 받고, 현재 명단의 index 전체와 비교합니다. 추론 URL, 검증자 키, 대문자 16진수는 맞지 않습니다.",
      "GonkaモニターはHostのgonkaアカウントアドレスだけを受け、現在の名簿のindex全体と照合します。推論URL、バリデータ鍵、大文字の十六進は一致しません。",
    ),
    summary: text(
      "要贴的是 bech32、前缀为 gonka 的 Host 账户地址，与接口字段 index 相同。inference_url 是服务端点，addresses 里的大写十六进制是另一份地址列表。ML 节点名称也不是这台 Host 的标识。",
      "要貼的是 bech32、前綴為 gonka 的 Host 帳戶地址，與介面欄位 index 相同。inference_url 是服務端點，addresses 裡的大寫十六進位是另一份地址清單。ML 節點名稱也不是這台 Host 的標識。",
      "Paste the bech32 Host account address whose prefix is gonka. It is the same value as index. inference_url is the service endpoint. The uppercase hex in addresses is a different list. An ML node name is not this Host’s identifier.",
      "붙일 값은 접두사가 gonka인 bech32 Host 계정 주소이며 index와 같습니다. inference_url은 서비스 끝점입니다. addresses의 대문자 16진수는 다른 목록입니다. ML 노드 이름도 이 Host의 식별자가 아닙니다.",
      "貼るのは接頭辞がgonkaのbech32 Hostアカウントアドレスで、indexと同じ値です。inference_urlはサービス端点です。addressesの大文字十六進は別の一覧です。MLノード名もこのHostの識別子ではありません。",
    ),
    comparisonTitle: text(
      "接口里几种标识",
      "介面裡幾種標識",
      "Identifiers in the API",
      "API 안의 식별자",
      "APIの中の識別子",
    ),
    comparison: table(
      text(
        "官方字段|它是什么|监控能不能用它查找",
        "官方欄位|它是什麼|監控能不能用它查找",
        "Official field|What it is|Can the monitor look you up with it",
        "공식 필드|무엇인가|모니터가 이것으로 찾을 수 있나",
        "公式フィールド|何か|モニターはこれで探せるか",
      ),
      [
        text(
          "index|Host 的 gonka 账户地址|能，必须整段一致",
          "index|Host 的 gonka 帳戶地址|能，必須整段一致",
          "index|The Host’s gonka account address|Yes, the whole value must match",
          "index|Host의 gonka 계정 주소|예, 전체가 같아야 함",
          "index|Hostのgonkaアカウントアドレス|できる。全体が一致する必要あり",
        ),
        text(
          "inference_url|该记录上的推理服务端点|不能",
          "inference_url|該紀錄上的推理服務端點|不能",
          "inference_url|The inference service endpoint on that record|No",
          "inference_url|그 기록의 추론 서비스 끝점|아니오",
          "inference_url|その記録の推論サービス端点|できない",
        ),
        text(
          "validator_key|Base64 公钥|不能",
          "validator_key|Base64 公鑰|不能",
          "validator_key|A Base64 public key|No",
          "validator_key|Base64 공개 키|아니오",
          "validator_key|Base64の公開鍵|できない",
        ),
        text(
          "addresses 中的大写十六进制|参与者地址的另一种列出方式|不能代替 index",
          "addresses 中的大寫十六進位|參與者地址的另一種列出方式|不能代替 index",
          "Uppercase hex in addresses|Another listing of participant addresses|Not a substitute for index",
          "addresses의 대문자 16진수|참여자 주소를 적는 다른 방식|index를 대신하지 못함",
          "addressesの大文字十六進|参加者アドレスの別の並び|indexの代わりにならない",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "Host 地址长什么样？",
          "Host 地址長什麼樣？",
          "What does the Host address look like?",
          "Host 주소는 어떻게 생겼나요?",
          "Hostアドレスはどのような形ですか？",
        ),
        text(
          "它是小写的 bech32 账户地址，人类可读前缀是 gonka，对应 20 字节账户数据。官方样例和本站接受的都是这种整段地址。不要自行截断、改大小写或改成别的链的前缀。",
          "它是小寫的 bech32 帳戶地址，人類可讀前綴是 gonka，對應 20 位元組帳戶資料。官方樣例和本站接受的都是這種整段地址。不要自行截斷、改大小寫或改成別的鏈的前綴。",
          "It is a lowercase bech32 account address. The human-readable prefix is gonka, and the account data is 20 bytes. The official sample and this site both use that full address. Do not shorten it, change the case, or swap in another chain’s prefix.",
          "소문자 bech32 계정 주소입니다. 사람이 읽는 접두사는 gonka이고, 계정 데이터는 20바이트입니다. 공식 예시와 이 사이트가 받는 것도 그 전체 주소입니다. 자르거나 대소문자를 바꾸거나 다른 체인의 접두사로 바꾸지 마세요.",
          "小文字のbech32アカウントアドレスです。人が読む接頭辞はgonkaで、アカウントデータは20バイトです。公式の例もこのサイトが受けるのも、その完全なアドレスです。短くしたり、大文字小文字を変えたり、他チェーンの接頭辞にしたりしないでください。",
        ),
      ],
      [
        text(
          "quickstart 里的推理服务地址能贴吗？",
          "quickstart 裡的推理服務地址能貼嗎？",
          "Can I paste the inference service address from the quickstart?",
          "quickstart의 추론 서비스 주소를 붙여도 되나요?",
          "quickstartの推論サービスアドレスは貼れますか？",
        ),
        text(
          "不能。推理网址是服务端点。名单用 index 标识 Host。把网址、端口或模型名贴进来，不会出现本轮参与。",
          "不能。推理網址是服務端點。名單用 index 標識 Host。把網址、連接埠或模型名貼進來，不會出現本輪參與。",
          "No. The inference URL is the service endpoint. The list identifies the Host by index. Pasting a URL, a port, or a model name will not show In this epoch.",
          "안 됩니다. 추론 URL은 서비스 끝점입니다. 명단은 index로 Host를 식별합니다. URL, 포트, 모델 이름을 붙이면 이번 에포크 참여로 나오지 않습니다.",
          "できません。推論URLはサービス端点です。名簿はindexでHostを識別します。URL、ポート、モデル名を貼っても今期参加にはなりません。",
        ),
      ],
      [
        text(
          "同一台电脑上的 ML 节点名字算不算另一台设备？",
          "同一台電腦上的 ML 節點名字算不算另一台裝置？",
          "Does the ML node name on the same machine count as another device?",
          "같은 컴퓨터의 ML 노드 이름은 다른 기기로 세나요?",
          "同じコンピュータのMLノード名は別デバイスになりますか？",
        ),
        text(
          "查找只用 Host 地址。quickstart 描述的是同一台机器上的网络节点和至少一个 ML 节点，ML 节点名不能代替 Host 地址。只有你另外保存成另一台设备记录时，才会占用该项目的设备名额。",
          "查找只用 Host 地址。quickstart 描述的是同一台機器上的網路節點和至少一個 ML 節點，ML 節點名不能代替 Host 地址。只有你另外儲存成另一台裝置紀錄時，才會佔用該專案的裝置名額。",
          "Lookup uses the Host address only. The quickstart describes a network node and at least one ML node, including the case of one machine. An ML node name cannot replace the Host address. A project device slot is used only when you save a separate device record.",
          "조회는 Host 주소만 사용합니다. quickstart는 네트워크 노드와 ML 노드가 적어도 하나 있는 구성을 설명하며, 한 대에 두는 경우도 포함합니다. ML 노드 이름은 Host 주소를 대신하지 않습니다. 프로젝트 기기 자리는 별도의 기기 기록으로 저장할 때만 씁니다.",
          "検索はHostアドレスだけを使います。quickstartはネットワークノードと、少なくとも一つのMLノードを説明し、一台に載せる場合も含みます。MLノード名はHostアドレスの代わりになりません。プロジェクトのデバイス枠は、別のデバイス記録として保存したときだけ使います。",
        ),
      ],
    ]),
    body: paras(
      [
        "监控要的是 Host 账户地址，不是推理服务的网址。当前名单里每一条的 index 就是这个地址。整段一致才算本轮参与。",
        "## 各字段分别是什么",
        "- index：gonka 前缀的账户地址。[Network Node API](" +
          api +
          ") 的样例就是这种地址。监控用它做查找。",
        "- inference_url：这条记录上的推理服务端点。它说明服务挂在哪里，不能当作要保存的设备标识。",
        "- validator_key：Base64 公钥。它不是账户地址。",
        "- 响应里的 addresses：大写十六进制的另一份参与者地址列表。文档把它和 index 分开写。把十六进制贴进监控对不上 index。",
        "## 在自己的配置里找哪一项",
        "- 打开 Host 的链上账户配置，复制完整的 gonka 地址。保持小写，不要只复制后几位。",
        "- 若手里只有推理端口或模型名，先回到 [quickstart](" +
          quick +
          ") 区分网络节点和 ML 节点，再找出 Host 账户地址。",
        "- 地址能被本站接受，仍要等当前名单读成功才知道是否在本轮。格式正确和“已列入”是两件事。见 [本轮怎么核对](/learn/" +
          monitor +
          ")。",
        "## 接下来怎么做",
        "- 贴对 index 之后，到 " + tool + " 看权重和模型。",
        "- 若状态是当前轮次未列出此地址，换标识之前先确认没有把十六进制或网址当成地址。见 [未找到 Host](/learn/" +
          missing +
          ")。",
        "- 想看推理端点或 PoC 相关字段在页面上出不出现，读 [PoC 与推理状态](/learn/" + poc + ")。",
        "- 免费每项目 5 台已保存设备，Pro 50 台。在同一台设备上再次绑定同一个 Gonka 地址不增加名额。",
        "## 示意对照",
        "说明性对照，不是某台在线机器：文档样例的 index 以 gonka1 开头；同一条样例的 inference_url 是一个 http 服务地址；addresses 里则是大写十六进制。只有第一种能在监控里对上 Host。不要把样例地址当成自己的 Host。",
        "## 界限",
        "- 本页不猜测未在官方文档中出现的地址格式，也不把别的项目的钱包地址改写成 gonka。",
        "- 不从推理网址反推账户地址。找不到 index 时，查找结果保持未知或当前轮次未列出此地址，而不是填一个空地址。",
        "- 这里不能登录你的节点，也不能替你创建 Host 账户。",
      ],
      [
        "監控要的是 Host 帳戶地址，不是推理服務的網址。目前名單裡每一條的 index 就是這個地址。整段一致才算本輪參與。",
        "## 各欄位分別是什麼",
        "- index：gonka 前綴的帳戶地址。[Network Node API](" +
          api +
          ") 的樣例就是這種地址。監控用它做查找。",
        "- inference_url：這條紀錄上的推理服務端點。它說明服務掛在哪裡，不能當作要儲存的裝置標識。",
        "- validator_key：Base64 公鑰。它不是帳戶地址。",
        "- 回應裡的 addresses：大寫十六進位的另一份參與者地址清單。文件把它和 index 分開寫。把十六進位貼進監控對不上 index。",
        "## 在自己的設定裡找哪一項",
        "- 打開 Host 的鏈上帳戶設定，複製完整的 gonka 地址。保持小寫，不要只複製後幾位。",
        "- 若手裡只有推理連接埠或模型名，先回到 [quickstart](" +
          quick +
          ") 區分網路節點和 ML 節點，再找出 Host 帳戶地址。",
        "- 地址能被本站接受，仍要等目前名單讀取成功才知道是否在本輪。格式正確和「已列入」是兩件事。見 [本輪怎麼核對](/learn/" +
          monitor +
          ")。",
        "## 接下來怎麼做",
        "- 貼對 index 之後，到 " + toolTw + " 看權重和模型。",
        "- 若狀態是目前輪次未列出此地址，換標識之前先確認沒有把十六進位或網址當成地址。見 [未找到 Host](/learn/" +
          missing +
          ")。",
        "- 想看推理端點或 PoC 相關欄位在頁面上出不出現，讀 [PoC 與推理狀態](/learn/" + poc + ")。",
        "- 免費每專案 5 台已儲存裝置，Pro 50 台。在同一台裝置上再次綁定同一個 Gonka 地址不增加名額。",
        "## 示意對照",
        "說明性對照，不是某台在線機器：文件樣例的 index 以 gonka1 開頭；同一條樣例的 inference_url 是一個 http 服務地址；addresses 裡則是大寫十六進位。只有第一種能在監控裡對上 Host。不要把樣例地址當成自己的 Host。",
        "## 界限",
        "- 本頁不猜測未在官方文件中出現的地址格式，也不把別的專案的錢包地址改寫成 gonka。",
        "- 不從推理網址反推帳戶地址。找不到 index 時，查找結果保持未知或目前輪次未列出此地址，而不是填一個空地址。",
        "- 這裡不能登入你的節點，也不能替你建立 Host 帳戶。",
      ],
      [
        "The monitor wants the Host account address, not the inference service URL. On the current list, index on each record is that address. The whole value has to match before the status reads In this epoch.",
        "## What each field is",
        "- index: the account address with the gonka prefix. The sample in the [Network Node API](" +
          api +
          ") is this kind of address. The monitor looks you up with it.",
        "- inference_url: the inference service endpoint on that record. It says where the service is attached. It is not the device identifier to save.",
        "- validator_key: a Base64 public key. It is not the account address.",
        "- addresses in the response: a separate list of participant addresses in uppercase hex. The docs list it apart from index. Pasting the hex into the monitor does not match index.",
        "## What to copy from your setup",
        "- Open the Host’s chain account configuration and copy the full gonka address. Keep it lowercase. Do not copy only the last characters.",
        "- If you only have an inference port or a model name, go back to the [quickstart](" +
          quick +
          "), separate the network node from the ML node, and find the Host account address.",
        "- An address this site accepts still needs a successful read of the current list before you know it is in the epoch. A valid form and “listed” are different. See [how to check this epoch](/learn/" +
          monitor +
          ").",
        "## What to do next",
        "- After index matches, open the " + toolEn + " for weight and models.",
        "- If the status is not listed, confirm you did not paste hex or a URL before you change identifiers. See [Host not found](/learn/" +
          missing +
          ").",
        "- To see whether the inference endpoint or PoC-related fields appear on the page, read [PoC and inference status](/learn/" +
          poc +
          ").",
        "- Free is five saved devices per project. Pro is 50. Binding the same Gonka address again on the same device does not add a slot.",
        "## A side-by-side sketch",
        "Illustration, not a live machine: the document sample’s index starts with gonka1. The same sample’s inference_url is an http service address. addresses holds uppercase hex. Only the first can match a Host in the monitor. Do not use the sample address as your Host.",
        "## Limits",
        "- This page does not invent address forms that are absent from the official docs, and it does not rewrite another project’s wallet into a gonka address.",
        "- It does not derive an account address from an inference URL. If index is missing, the lookup stays unknown or not listed. It does not fill in an empty address.",
        "- This site cannot log in to your node or create a Host account for you.",
      ],
      [
        "모니터가 원하는 것은 Host 계정 주소이지 추론 서비스 URL이 아닙니다. 현재 명단의 각 기록에서 index가 그 주소입니다. 전체가 같아야 이번 에포크 참여입니다.",
        "## 필드가 각각 무엇인지",
        "- index: gonka 접두사의 계정 주소입니다. [Network Node API](" +
          api +
          ") 예시가 이런 주소입니다. 모니터는 이것으로 찾습니다.",
        "- inference_url: 그 기록의 추론 서비스 끝점입니다. 서비스가 어디에 붙었는지를 말할 뿐, 저장할 기기 식별자가 아닙니다.",
        "- validator_key: Base64 공개 키입니다. 계정 주소가 아닙니다.",
        "- 응답의 addresses: 대문자 16진수로 된 또 다른 참여자 주소 목록입니다. 문서는 이것을 index와 따로 적습니다. 16진수를 모니터에 붙이면 index와 맞지 않습니다.",
        "## 설정에서 무엇을 복사하나",
        "- Host의 체인 계정 설정을 열고 전체 gonka 주소를 복사하세요. 소문자를 유지하고 끝의 몇 글자만 복사하지 마세요.",
        "- 추론 포트나 모델 이름만 있다면 [quickstart](" +
          quick +
          ")로 돌아가 네트워크 노드와 ML 노드를 구분한 뒤 Host 계정 주소를 찾으세요.",
        "- 이 사이트가 주소를 받아도, 현재 명단이 읽혀야 이번 에포크에 있는지 알 수 있습니다. 형식이 맞는 것과 등재는 다릅니다. [이번 에포크 확인](/learn/" +
          monitor +
          ")을 보세요.",
        "## 다음에 할 일",
        "- index가 맞으면 " + toolKo + "에서 가중치와 모델을 봅니다.",
        "- 상태가 미등재이면 식별자를 바꾸기 전에 16진수나 URL을 붙이지 않았는지 확인하세요. [Host를 찾지 못함](/learn/" +
          missing +
          ")을 보세요.",
        "- 추론 끝점이나 PoC 관련 항목이 페이지에 나오는지는 [PoC와 추론 상태](/learn/" +
          poc +
          ")를 읽으세요.",
        "- 무료는 프로젝트마다 저장된 기기 5대, Pro는 50대입니다. 같은 기기에 같은 Gonka 주소를 다시 묶어도 자리는 늘지 않습니다.",
        "## 나란히 보는 스케치",
        "설명용이며 실제 가동 중인 기계가 아닙니다. 문서 예시의 index는 gonka1로 시작합니다. 같은 예시의 inference_url은 http 서비스 주소입니다. addresses에는 대문자 16진수가 있습니다. 모니터에서 Host와 맞는 것은 첫 번째뿐입니다. 예시 주소를 자신의 Host로 쓰지 마세요.",
        "## 한계",
        "- 이 페이지는 공식 문서에 없는 주소 형식을 만들지 않고, 다른 프로젝트 지갑을 gonka 주소로 고쳐 쓰지도 않습니다.",
        "- 추론 URL에서 계정 주소를 끌어내지 않습니다. index가 없으면 조회는 알 수 없음 또는 미등재로 남으며, 빈 주소를 채우지 않습니다.",
        "- 이 사이트는 노드에 로그인하거나 Host 계정을 만들어 주지 않습니다.",
      ],
      [
        "モニターが要るのはHostアカウントアドレスであり、推論サービスのURLではありません。現在の名簿では、各記録のindexがそのアドレスです。全体が一致して初めて今期参加です。",
        "## 各フィールドは何か",
        "- index：gonka接頭辞のアカウントアドレスです。[Network Node API](" +
          api +
          ") の例がこの形です。モニターはこれで検索します。",
        "- inference_url：その記録の推論サービス端点です。サービスがどこに付いているかを示すだけで、保存するデバイス識別子ではありません。",
        "- validator_key：Base64の公開鍵です。アカウントアドレスではありません。",
        "- 応答のaddresses：大文字十六進の、別の参加者アドレス一覧です。文書はこれをindexと分けて書いています。十六進をモニターに貼ってもindexとは一致しません。",
        "## 設定のどこをコピーするか",
        "- Hostのチェーンアカウント設定を開き、完全なgonkaアドレスをコピーします。小文字のままにし、末尾数文字だけにしないでください。",
        "- 推論ポートやモデル名しかない場合は [quickstart](" +
          quick +
          ") に戻り、ネットワークノードとMLノードを分けてからHostアカウントアドレスを探します。",
        "- このサイトがアドレスを受けても、現在の名簿が読めて初めて今期にいるかが分かります。形式が正しいことと掲載は別です。[今期の確認](/learn/" +
          monitor +
          ") を見てください。",
        "## 次にすること",
        "- indexが一致したら " + toolJa + " で重みとモデルを見ます。",
        "- 未掲載なら、識別子を変える前に十六進やURLを貼っていないか確認します。[Hostが見つからない](/learn/" +
          missing +
          ") を見てください。",
        "- 推論端点やPoC関連の項目がページに出るかは [PoCと推論の状態](/learn/" +
          poc +
          ") を読んでください。",
        "- 無料はプロジェクトごとに保存デバイス5台、Proは50台です。同じデバイスに同じGonkaアドレスを重ねても枠は増えません。",
        "## 並べたスケッチ",
        "説明用であり、稼働中の機械ではありません。文書例のindexはgonka1で始まります。同じ例のinference_urlはhttpのサービスアドレスです。addressesには大文字十六進があります。モニターでHostと一致するのは最初のものだけです。例のアドレスを自分のHostにしないでください。",
        "## 限界",
        "- このページは公式文書にないアドレス形式を作らず、他プロジェクトのウォレットをgonkaアドレスに書き換えません。",
        "- 推論URLからアカウントアドレスを導きません。indexがなければ検索は不明か未掲載のままで、空のアドレスは埋めません。",
        "- このサイトはノードへログインせず、Hostアカウントも作りません。",
      ],
    ),
  },
  {
    slug: poc,
    project: "gonka",
    published: "2026-10-24",
    modified: "2026-10-24",
    sources,
    related: [monitor, hostId, rewards],
    topic: text(
      "PoC 和推理状态",
      "PoC 和推理狀態",
      "PoC and inference status",
      "PoC와 추론 상태",
      "PoCと推論の状態",
    ),
    title: text(
      "Gonka 的 PoC 和推理：监控能显示什么、不能显示什么",
      "Gonka 的 PoC 和推理：監控能顯示什麼、不能顯示什麼",
      "Gonka PoC and inference: what the monitor shows and what it does not",
      "Gonka PoC와 추론: 모니터가 보여주는 것과 보여주지 않는 것",
      "GonkaのPoCと推論：モニターが表示することとしないこと",
    ),
    description: text(
      "Gonka 监控在对上 Host 后显示本轮权重和模型名。它不显示 PoC 是否通过，也不显示推理请求是否正在成功。",
      "Gonka 監控在對上 Host 後顯示本輪權重和模型名。它不顯示 PoC 是否通過，也不顯示推理請求是否正在成功。",
      "After a Host matches, the Gonka monitor shows this epoch’s weight and the model names. It does not show whether PoC passed, or whether inference requests are succeeding.",
      "Host가 맞으면 Gonka 모니터는 이번 에포크 가중치와 모델 이름을 보여 줍니다. PoC 통과 여부나 추론 요청의 성공 여부는 보여 주지 않습니다.",
      "Hostが一致したあと、Gonkaモニターは今期の重みとモデル名を出します。PoCの合否や、推論リクエストが成功しているかは出しません。",
    ),
    summary: text(
      "官方接口把 weight 称为本轮奖励权重，把 cap_weight 称为治理、BLS 和 PoC 校验用的信任权重，且只在 v0.2.16 及之后形成的轮次、cap_weight_applied 为真时出现。监控不展示 cap_weight、poc_start_block_height 或 inference_url。模型名不是正在服务的证明。",
      "官方介面把 weight 稱為本輪獎勵權重，把 cap_weight 稱為治理、BLS 和 PoC 校驗用的信任權重，且只在 v0.2.16 及之後形成的輪次、cap_weight_applied 為真時出現。監控不展示 cap_weight、poc_start_block_height 或 inference_url。模型名不是正在服務的證明。",
      "The public API calls weight the epoch reward weight, and cap_weight the trust weight for governance, BLS, and PoC validation. cap_weight is present when cap_weight_applied is true on epochs formed by v0.2.16 or later. The monitor does not show cap_weight, poc_start_block_height, or inference_url. A model name is not proof that service is up.",
      "공개 API는 weight를 이번 에포크 보상 가중치로, cap_weight를 거버넌스·BLS·PoC 검증용 신뢰 가중치로 부릅니다. cap_weight는 v0.2.16 이후에 만들어진 에포크에서 cap_weight_applied가 참일 때 있습니다. 모니터는 cap_weight, poc_start_block_height, inference_url을 보여 주지 않습니다. 모델 이름은 서비스가 살아 있다는 증거가 아닙니다.",
      "公開APIはweightを今期の報酬の重み、cap_weightをガバナンス、BLS、PoC検証の信頼の重みと呼びます。cap_weightはv0.2.16以降に形成された期でcap_weight_appliedが真のときにあります。モニターはcap_weight、poc_start_block_height、inference_urlを出しません。モデル名はサービスが動いている証拠ではありません。",
    ),
    comparisonTitle: text(
      "和推理、PoC 有关的项",
      "和推理、PoC 有關的項",
      "Items tied to inference and PoC",
      "추론과 PoC에 연결된 항목",
      "推論とPoCに結び付く項目",
    ),
    comparison: table(
      text(
        "项目|官方文档怎么说|监控页面",
        "項目|官方文件怎麼說|監控頁面",
        "Item|What the official docs say|On the monitor",
        "항목|공식 문서|모니터",
        "項目|公式文書|モニター",
      ),
      [
        text(
          "models|该 Host 支持的模型列表|对上后用逗号列出；没有则是横线",
          "models|該 Host 支援的模型清單|對上後用逗號列出；沒有則是橫線",
          "models|Models that Host supports|Listed after a match; a dash if none",
          "models|그 Host가 지원하는 모델 목록|일치 후 쉼표로 나열, 없으면 줄표",
          "models|そのHostが対応するモデル一覧|一致後にカンマ区切り。なければダッシュ",
        ),
        text(
          "inference_url|推理服务端点|不显示",
          "inference_url|推理服務端點|不顯示",
          "inference_url|Inference service endpoint|Not shown",
          "inference_url|추론 서비스 끝점|표시하지 않음",
          "inference_url|推論サービス端点|表示しない",
        ),
        text(
          "weight|本轮奖励权重|对上后显示这个数",
          "weight|本輪獎勵權重|對上後顯示這個數",
          "weight|Reward weight for this epoch|Shown after a match",
          "weight|이번 에포크 보상 가중치|일치 후 이 숫자를 표시",
          "weight|今期の報酬の重み|一致後にこの数を表示",
        ),
        text(
          "cap_weight|治理、BLS、PoC 校验的信任权重；有条件才出现|不显示",
          "cap_weight|治理、BLS、PoC 校驗的信任權重；有條件才出現|不顯示",
          "cap_weight|Trust weight for governance, BLS, and PoC validation; only sometimes present|Not shown",
          "cap_weight|거버넌스·BLS·PoC 검증용 신뢰 가중치. 조건이 있을 때만|표시하지 않음",
          "cap_weight|ガバナンス、BLS、PoC検証の信頼の重み。条件付きで存在|表示しない",
        ),
        text(
          "poc_start_block_height|当前参与者组上的 PoC 起始区块高度|不显示",
          "poc_start_block_height|目前參與者組上的 PoC 起始區塊高度|不顯示",
          "poc_start_block_height|PoC start height on the participant group|Not shown",
          "poc_start_block_height|참여자 그룹의 PoC 시작 블록 높이|표시하지 않음",
          "poc_start_block_height|参加者グループのPoC開始ブロック高|表示しない",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "模型名已经出现，能不能说推理服务是通的？",
          "模型名已經出現，能不能說推理服務是通的？",
          "If the model names appear, is the inference service up?",
          "모델 이름이 나오면 추론 서비스가 살아 있나요?",
          "モデル名が出ていれば推論サービスは生きていますか？",
        ),
        text(
          "不能。模型名来自当前名单里的 models。它表示记录中列出了这些模型。请求有没有被成功处理，要看你自己的 ML 节点和官方服务状态，不在这页。",
          "不能。模型名來自目前名單裡的 models。它表示紀錄中列出了這些模型。請求有沒有被成功處理，要看你自己的 ML 節點和官方服務狀態，不在這頁。",
          "No. The names come from models on the current list. They mean those models are listed on the record. Whether a request was served successfully depends on your ML node and the official service, and it is not on this page.",
          "아닙니다. 이름은 현재 명단의 models에서 옵니다. 기록에 그 모델이 적혀 있다는 뜻입니다. 요청이 성공적으로 처리됐는지는 자신의 ML 노드와 공식 서비스에서 봐야 하며 이 페이지에 없습니다.",
          "いえ。名前は現在の名簿のmodelsからです。記録にそのモデルが載っているという意味です。リクエストが処理されたかは自分のMLノードと公式サービスで確認し、このページにはありません。",
        ),
      ],
      [
        text(
          "页面上的权重是不是 PoC 通过？",
          "頁面上的權重是不是 PoC 通過？",
          "Is the weight on the page a PoC pass?",
          "페이지의 가중치는 PoC 통과인가요?",
          "ページの重みはPoC合格ですか？",
        ),
        text(
          "不是。文档把 weight 说成奖励权重，把 cap_weight 说成 PoC 校验等用途的信任权重。监控只显示前者。看不到 cap_weight，就不能用这个页面判断 PoC 校验权重。",
          "不是。文件把 weight 說成獎勵權重，把 cap_weight 說成 PoC 校驗等用途的信任權重。監控只顯示前者。看不到 cap_weight，就不能用這個頁面判斷 PoC 校驗權重。",
          "No. The docs call weight the reward weight and cap_weight the trust weight used for PoC validation and related roles. The monitor shows only the first. Without cap_weight on the page, you cannot judge PoC trust weight here.",
          "아닙니다. 문서는 weight를 보상 가중치로, cap_weight를 PoC 검증 등에 쓰는 신뢰 가중치로 부릅니다. 모니터는 앞의 것만 보여 줍니다. 페이지에 cap_weight가 없으므로 여기서 PoC 신뢰 가중치를 판단할 수 없습니다.",
          "違います。文書はweightを報酬の重み、cap_weightをPoC検証などに使う信頼の重みと呼んでいます。モニターは前者だけを出します。ページにcap_weightがないので、ここでPoCの信頼の重みは判断できません。",
        ),
      ],
      [
        text(
          "quickstart 要求至少一个 ML 节点，监控会显示节点个数吗？",
          "quickstart 要求至少一個 ML 節點，監控會顯示節點個數嗎？",
          "The quickstart requires at least one ML node. Does the monitor show that count?",
          "quickstart는 ML 노드가 적어도 하나 필요하다고 합니다. 모니터가 그 수를 보여 주나요?",
          "quickstartはMLノードが少なくとも一つ必要です。モニターはその数を出しますか？",
        ),
        text(
          "不会。quickstart 说明加入网络至少要有一个 ML 节点，并描述网络节点与 ML 节点可以在同一台机器上。监控对上 Host 后只给出 epoch、权重和模型名，不给出 ML 节点个数，也不代替你检查容器是否在跑。",
          "不會。quickstart 說明加入網路至少要有一個 ML 節點，並描述網路節點與 ML 節點可以在同一台機器上。監控對上 Host 後只給出 epoch、權重和模型名，不給出 ML 節點個數，也不代替你檢查容器是否在跑。",
          "No. The quickstart says you need at least one ML node to join, and it describes the network node and the ML node on one machine. After a match, the monitor shows the epoch, weight, and model names. It does not show an ML node count, and it does not check whether your containers are running.",
          "보여 주지 않습니다. quickstart는 참여에 ML 노드가 적어도 하나 필요하다고 하고, 네트워크 노드와 ML 노드를 한 대에 두는 경우를 설명합니다. 일치 후 모니터는 epoch, 가중치, 모델 이름만 줍니다. ML 노드 수는 주지 않고, 컨테이너가 실행 중인지도 대신 확인하지 않습니다.",
          "出しません。quickstartは参加にMLノードが少なくとも一つ必要だと書き、ネットワークノードとMLノードを一台に載せる場合を説明します。一致後、モニターはepoch、重み、モデル名だけを出します。MLノード数は出さず、コンテナが動いているかも代わりに確認しません。",
        ),
      ],
    ]),
    body: paras(
      [
        "对上 Host 之后，" +
          tool +
          " 能告诉你的是：这台地址在当前名单里，本轮奖励权重是多少，记录里有哪些模型。它不能告诉你 PoC 是否通过，也不能告诉你推理请求此刻是否成功。",
        "## 文档里和这两件事有关的字段",
        "- models 是支持的模型列表。页面在对上后把这些名字列出来。",
        "- inference_url 是推理服务端点。页面不显示它，所以这里不能用来打开或探测你的推理端口。",
        "- weight 是本轮奖励权重。它和入账金额不是同一个数，见 [权重和 GNK](/learn/" +
          rewards +
          ")。",
        "- [API 文档](" +
          api +
          ") 写明：cap_weight 是治理、BLS 和 PoC 校验的信任权重；当轮次由 v0.2.16 或更新版本形成且 cap_weight_applied 为真时才出现。更早的轮次里，投票权跟随 weight。监控不显示 cap_weight，因此不能在这里比较这两种权重。",
        "- poc_start_block_height 在当前参与者组上，是 PoC 起始区块高度。页面不显示这个高度，也不能把它读成“PoC 已通过”。",
        "## 你要自己看的状态",
        "- 模型名有了，只说明名单里写了这些模型。到 ML 节点和官方服务确认请求是否被处理。",
        "- 想确认加入条件，阅读 [quickstart](" +
          quick +
          ")：Host 要部署网络节点（链节点和 API 节点）以及至少一个 ML 节点。那是部署说明，不是这页上的开关。",
        "- 地址本身是否贴对，见 [该贴哪一种标识](/learn/" +
          hostId +
          ")。贴成推理网址时，不会出现模型行。",
        "## 接下来怎么做",
        "- 若只想确认是否在本轮：以本轮参与、epoch 和权重为准。见 [本轮核对](/learn/" +
          monitor +
          ")。",
        "- 若 PoC 信任权重或推理端口才是问题：打开 API 文档中的当前轮次响应，查看 cap_weight 是否存在，并在你自己的节点上检查推理服务。不要把页面权重当成 PoC 结果。",
        "- 名单读失败时，PoC 和推理都保持未知，不要记成失败或 0。",
        "## 示意",
        "说明性例子，不是实测：文档样例有一个模型名，也有一个 inference_url，weight 为 10，样例片段没有把 cap_weight 写成已通过的 PoC。若你的页面只出现权重和模型名，那就只阅读这两项。",
        "## 界限",
        "- 不根据权重推测 PoC 分数，不根据模型个数推测正在处理的请求数。",
        "- 不承诺推理延迟、成功率或 GNK。[官网](" +
          home +
          ") 说开发者用兼容 OpenAI 的接口付 GNK 做推理，提供方托管模型并赚取 GNK；具体请求结果不在监控里。",
        "- 本页不操作容器，也不做崩溃分析以外的主机控制。AI 崩溃分析免费，且只针对 IOTA Train at Home 的 Mac，不能用来开关 Gonka 节点。",
      ],
      [
        "對上 Host 之後，" +
          toolTw +
          " 能告訴你的是：這台地址在目前名單裡，本輪獎勵權重是多少，紀錄裡有哪些模型。它不能告訴你 PoC 是否通過，也不能告訴你推理請求此刻是否成功。",
        "## 文件裡和這兩件事有關的欄位",
        "- models 是支援的模型清單。頁面在對上後把這些名字列出來。",
        "- inference_url 是推理服務端點。頁面不顯示它，所以這裡不能用來打開或探測你的推理連接埠。",
        "- weight 是本輪獎勵權重。它和入帳金額不是同一個數，見 [權重和 GNK](/learn/" +
          rewards +
          ")。",
        "- [API 文件](" +
          api +
          ") 寫明：cap_weight 是治理、BLS 和 PoC 校驗的信任權重；當輪次由 v0.2.16 或更新版本形成且 cap_weight_applied 為真時才出現。更早的輪次裡，投票權跟隨 weight。監控不顯示 cap_weight，因此不能在這裡比較這兩種權重。",
        "- poc_start_block_height 在目前參與者組上，是 PoC 起始區塊高度。頁面不顯示這個高度，也不能把它讀成「PoC 已通過」。",
        "## 你要自己看的狀態",
        "- 模型名有了，只說明名單裡寫了這些模型。到 ML 節點和官方服務確認請求是否被處理。",
        "- 想確認加入條件，閱讀 [quickstart](" +
          quick +
          ")：Host 要部署網路節點（鏈節點和 API 節點）以及至少一個 ML 節點。那是部署說明，不是這頁上的開關。",
        "- 地址本身是否貼對，見 [該貼哪一種標識](/learn/" +
          hostId +
          ")。貼成推理網址時，不會出現模型行。",
        "## 接下來怎麼做",
        "- 若只想確認是否在本輪：以本輪參與、epoch 和權重為準。見 [本輪核對](/learn/" +
          monitor +
          ")。",
        "- 若 PoC 信任權重或推理連接埠才是問題：打開 API 文件中的目前輪次回應，查看 cap_weight 是否存在，並在你自己的節點上檢查推理服務。不要把頁面權重當成 PoC 結果。",
        "- 名單讀取失敗時，PoC 和推理都保持未知，不要記成失敗或 0。",
        "## 示意",
        "說明性例子，不是實測：文件樣例有一個模型名，也有一個 inference_url，weight 為 10，樣例片段沒有把 cap_weight 寫成已通過的 PoC。若你的頁面只出現權重和模型名，那就只閱讀這兩項。",
        "## 界限",
        "- 不根據權重推測 PoC 分數，不根據模型個數推測正在處理的請求數。",
        "- 不承諾推理延遲、成功率或 GNK。[官網](" +
          home +
          ") 說開發者用相容 OpenAI 的介面付 GNK 做推理，提供方託管模型並賺取 GNK；具體請求結果不在監控裡。",
        "- 本頁不操作容器，也不做崩潰分析以外的主機控制。AI 崩潰分析免費，且只針對 IOTA Train at Home 的 Mac，不能用來開關 Gonka 節點。",
      ],
      [
        "After the Host matches, the " +
          toolEn +
          " can tell you that the address is on the current list, what the epoch reward weight is, and which models are on the record. It cannot tell you whether PoC passed, or whether an inference request is succeeding now.",
        "## Fields the docs tie to these two questions",
        "- models is the list of supported models. After a match, the page prints those names.",
        "- inference_url is the inference service endpoint. The page does not show it, so you cannot open or probe your inference port from here.",
        "- weight is the reward weight for this epoch. It is not the credited amount. See [weight and GNK](/learn/" +
          rewards +
          ").",
        "- The [API docs](" +
          api +
          ") say cap_weight is the trust weight for governance, BLS, and PoC validation. It is present when the epoch was formed by v0.2.16 or later and cap_weight_applied is true. On earlier epochs, voting power follows weight. The monitor does not show cap_weight, so you cannot compare the two weights here.",
        "- poc_start_block_height sits on the current participant group. It is the PoC start block height. The page does not show that height, and it is not a “PoC passed” flag.",
        "## What you check yourself",
        "- Model names only mean the list records those models. Confirm whether requests are served on the ML node and the official service.",
        "- For join requirements, read the [quickstart](" +
          quick +
          "): a Host deploys a network node (chain node and API node) and at least one ML node. That is setup guidance, not a switch on this page.",
        "- Whether the address itself is the right one is in [which identifier to paste](/learn/" +
          hostId +
          "). An inference URL does not produce a models line.",
        "## What to do next",
        "- If you only need to know whether it is in the epoch: use In this epoch, the epoch, and weight. See [this epoch](/learn/" +
          monitor +
          ").",
        "- If the question is PoC trust weight or the inference port: open the current-epoch response in the API docs, see whether cap_weight is present, and check the inference service on your own node. Do not treat the page weight as a PoC result.",
        "- If the list fails to load, both PoC and inference stay unknown. Do not record them as failed or as zero.",
        "## Illustration",
        "Illustration, not a live test: the document sample has one model name, an inference_url, and weight 10. That sample does not present cap_weight as a passed PoC. If your page shows only weight and model names, read only those two.",
        "## Limits",
        "- Do not infer a PoC score from weight, or a live request count from how many model names appear.",
        "- There is no promise of latency, success rate, or GNK. The [site](" +
          home +
          ") says developers pay GNK for inference through an OpenAI-compatible API, and providers host models and earn GNK. The request result is not in the monitor.",
        "- This page does not operate containers. AI crash analysis is free and applies to IOTA Train at Home on a Mac. It cannot start or stop a Gonka node.",
      ],
      [
        "Host가 맞은 뒤 " +
          toolKo +
          "가 말해 주는 것은, 이 주소가 현재 명단에 있는지, 이번 에포크 보상 가중치가 얼마인지, 기록에 어떤 모델이 있는지입니다. PoC 통과 여부나 지금 추론 요청이 성공하는지는 말하지 않습니다.",
        "## 문서에서 이 두 질문과 연결된 필드",
        "- models는 지원 모델 목록입니다. 일치하면 페이지가 그 이름을 적습니다.",
        "- inference_url은 추론 서비스 끝점입니다. 페이지는 보여 주지 않으므로 여기서 추론 포트를 열거나 탐색할 수 없습니다.",
        "- weight는 이번 에포크 보상 가중치입니다. 입금액이 아닙니다. [가중치와 GNK](/learn/" +
          rewards +
          ")를 보세요.",
        "- [API 문서](" +
          api +
          ")는 cap_weight를 거버넌스, BLS, PoC 검증의 신뢰 가중치라고 합니다. v0.2.16 이후에 만들어진 에포크에서 cap_weight_applied가 참일 때 있습니다. 더 이전 에포크에서는 투표권이 weight를 따릅니다. 모니터는 cap_weight를 보여 주지 않으므로 여기서 두 가중치를 비교할 수 없습니다.",
        "- poc_start_block_height는 현재 참여자 그룹에 있으며 PoC 시작 블록 높이입니다. 페이지는 이 높이를 보여 주지 않고, “PoC 통과”도 아닙니다.",
        "## 직접 볼 상태",
        "- 모델 이름은 명단에 그 모델이 적혀 있다는 뜻입니다. 요청이 처리되는지는 ML 노드와 공식 서비스에서 확인하세요.",
        "- 참여 조건은 [quickstart](" +
          quick +
          ")를 읽으세요. Host는 네트워크 노드(체인 노드와 API 노드)와 ML 노드를 적어도 하나 배포합니다. 그것은 설치 설명이지 이 페이지의 스위치가 아닙니다.",
        "- 주소 자체가 맞는지는 [어떤 식별자를 붙일까](/learn/" +
          hostId +
          ")에 있습니다. 추론 URL을 붙이면 모델 줄이 나오지 않습니다.",
        "## 다음에 할 일",
        "- 이번 에포크에 있는지만 필요하면 참여, epoch, 가중치를 보세요. [이번 에포크](/learn/" +
          monitor +
          ")를 보세요.",
        "- 질문이 PoC 신뢰 가중치나 추론 포트라면 API 문서의 현재 에포크 응답에서 cap_weight가 있는지 보고, 자신의 노드에서 추론 서비스를 확인하세요. 페이지 가중치를 PoC 결과로 보지 마세요.",
        "- 명단을 읽지 못하면 PoC와 추론은 모두 알 수 없음입니다. 실패나 0으로 적지 마세요.",
        "## 예시",
        "설명용이며 실측이 아닙니다. 문서 예시에는 모델 이름 하나, inference_url, weight 10이 있습니다. 그 예시는 cap_weight를 통과한 PoC로 적지 않습니다. 페이지에 가중치와 모델 이름만 있으면 그 두 가지만 읽으세요.",
        "## 한계",
        "- 가중치로 PoC 점수를 추정하지 말고, 모델 이름 개수로 처리 중인 요청 수를 추정하지 마세요.",
        "- 지연, 성공률, GNK를 약속하지 않습니다. [사이트](" +
          home +
          ")는 개발자가 OpenAI 호환 인터페이스로 GNK를 내고 추론하며, 제공자는 모델을 호스트하고 GNK를 번다고 합니다. 요청 결과는 모니터에 없습니다.",
        "- 이 페이지는 컨테이너를 조작하지 않습니다. AI 장애 분석은 무료이며 IOTA Train at Home의 Mac에만 해당합니다. Gonka 노드를 켜거나 끄지 못합니다.",
      ],
      [
        "Hostが一致したあと、" +
          toolJa +
          "が伝えられるのは、そのアドレスが現在の名簿にあること、今期の報酬の重み、記録にあるモデルです。PoCに合格したか、今推論リクエストが成功しているかは伝えられません。",
        "## 文書がこの二つの問いに結び付ける項目",
        "- modelsは対応モデルの一覧です。一致するとページがその名前を出します。",
        "- inference_urlは推論サービス端点です。ページは出さないので、ここから推論ポートを開いたり探ったりはできません。",
        "- weightは今期の報酬の重みです。入金額ではありません。[重みとGNK](/learn/" +
          rewards +
          ") を見てください。",
        "- [API文書](" +
          api +
          ")は、cap_weightをガバナンス、BLS、PoC検証の信頼の重みとしています。v0.2.16以降に形成された期でcap_weight_appliedが真のときにあります。それより前の期では投票権はweightに従います。モニターはcap_weightを出さないので、ここで二つの重みは比べられません。",
        "- poc_start_block_heightは現在の参加者グループにあり、PoC開始ブロック高です。ページはこの高さを出さず、「PoC合格」でもありません。",
        "## 自分で見る状態",
        "- モデル名は、名簿にそのモデルが書いてあるという意味です。リクエストが処理されているかはMLノードと公式サービスで確認します。",
        "- 参加条件は [quickstart](" +
          quick +
          ") を読みます。Hostはネットワークノード（チェーンノードとAPIノード）と、少なくとも一つのMLノードを配置します。それは手順であり、このページのスイッチではありません。",
        "- アドレス自体が正しいかは [どの識別子を貼るか](/learn/" +
          hostId +
          ") にあります。推論URLを貼ってもモデル行は出ません。",
        "## 次にすること",
        "- 今期にいるかだけなら、参加、epoch、重みを見ます。[今期の確認](/learn/" +
          monitor +
          ") を見てください。",
        "- 問いがPoCの信頼の重みや推論ポートなら、API文書の現在期の応答でcap_weightがあるかを見て、自分のノードで推論サービスを確認します。ページの重みをPoCの結果にしないでください。",
        "- 名簿が読めなければPoCも推論も不明のままです。失敗や0と記録しないでください。",
        "## 例示",
        "説明用であり実測ではありません。文書の例にはモデル名が一つ、inference_url、weight 10があります。その例はcap_weightを合格したPoCとしては書いていません。ページに重みとモデル名しかなければ、その二つだけを読んでください。",
        "## 限界",
        "- 重みからPoCの点数を推定せず、モデル名の個数から処理中のリクエスト数も推定しないでください。",
        "- 遅延、成功率、GNKは約束しません。[サイト](" +
          home +
          ")は、開発者がOpenAI互換のAPIでGNKを払い推論し、提供者がモデルをホストしてGNKを得ると書いています。リクエスト結果はモニターにありません。",
        "- このページはコンテナを操作しません。AIクラッシュ分析は無料で、IOTA Train at HomeのMacに限ります。Gonkaノードの開始や停止はできません。",
      ],
    ),
  },
  {
    slug: rewards,
    project: "gonka",
    published: "2026-10-24",
    modified: "2026-10-24",
    sources,
    related: [monitor, poc, missing],
    topic: text(
      "权重不是入账",
      "權重不是入帳",
      "Weight is not a credit",
      "가중치는 입금이 아님",
      "重みは入金ではない",
    ),
    title: text(
      "Gonka 本轮权重和 GNK：监控里的数不是已入账金额",
      "Gonka 本輪權重和 GNK：監控裡的數不是已入帳金額",
      "Gonka epoch weight and GNK: the monitor’s number is not credited income",
      "Gonka 에포크 가중치와 GNK: 모니터의 숫자는 입금된 수익이 아닙니다",
      "Gonkaの期の重みとGNK：モニターの数は入金済みの収益ではない",
    ),
    description: text(
      "Gonka 监控在 Host 对上后显示本轮奖励权重。官网说提供方赚取 GNK，但这一页没有入账金额、币价或发放时间。",
      "Gonka 監控在 Host 對上後顯示本輪獎勵權重。官網說提供方賺取 GNK，但這一頁沒有入帳金額、幣價或發放時間。",
      "When a Host matches, the Gonka monitor shows this epoch’s reward weight. The official site says providers earn GNK, but this page has no credited amount, token price, or payout time.",
      "Host가 맞으면 Gonka 모니터는 이번 에포크 보상 가중치를 보여 줍니다. 공식 사이트는 제공자가 GNK를 번다고 하지만, 이 페이지에는 입금액, 토큰 가격, 지급 시각이 없습니다.",
      "Hostが一致するとGonkaモニターは今期の報酬の重みを出します。公式サイトは提供者がGNKを得ると書きますが、このページに入金額、トークン価格、支払時刻はありません。",
    ),
    summary: text(
      "weight 是本轮奖励权重。quickstart 说 Host 按所提供资源的数量和质量获得奖励。页面不把权重分成 GNK，也没有日收益。同一地址保存在多台设备上时，也不会把同一份权重加总成多份收入。",
      "weight 是本輪獎勵權重。quickstart 說 Host 按所提供資源的數量和質量獲得獎勵。頁面不把權重分成 GNK，也沒有日收益。同一地址儲存在多台裝置上時，也不會把同一份權重加總成多份收入。",
      "weight is the reward weight for this epoch. The quickstart says a Host is rewarded from the amount and quality of resources they provide. The page does not split weight into GNK and has no daily earnings. Saving the same address on several devices does not add that weight up as extra income.",
      "weight는 이번 에포크 보상 가중치입니다. quickstart는 Host가 제공한 자원의 양과 질에 따라 보상받는다고 합니다. 페이지는 가중치를 GNK로 나누지 않고 일일 수익도 없습니다. 같은 주소를 여러 기기에 저장해도 그 가중치를 수입으로 합산하지 않습니다.",
      "weightは今期の報酬の重みです。quickstartは、Hostが提供した資源の量と質に応じて報酬を受けると書きます。ページは重みをGNKに分けず、日次収益もありません。同じアドレスを複数デバイスに保存しても、その重みを収入として足し上げません。",
    ),
    comparisonTitle: text(
      "权重和入账不要混读",
      "權重和入帳不要混讀",
      "Do not mix weight with a credit",
      "가중치와 입금을 섞어 읽지 않기",
      "重みと入金を混ぜて読まない",
    ),
    comparison: table(
      text(
        "读到的内容|来源|你能下的结论",
        "讀到的內容|來源|你能下的結論",
        "What you read|Where it comes from|What you can conclude",
        "읽은 내용|출처|내릴 수 있는 결론",
        "読んだ内容|出所|言えること",
      ),
      [
        text(
          "页面上的权重|当前名单里该 Host 的 weight|这是本轮奖励权重；没有 GNK 金额",
          "頁面上的權重|目前名單裡該 Host 的 weight|這是本輪獎勵權重；沒有 GNK 金額",
          "Weight on the page|That Host’s weight on the current list|This is epoch reward weight; there is no GNK amount",
          "페이지의 가중치|현재 명단의 그 Host weight|이번 에포크 보상 가중치이며 GNK 금액은 없음",
          "ページの重み|現在の名簿のそのHostのweight|今期の報酬の重みであり、GNKの額はない",
        ),
        text(
          "赚取 GNK|Gonka 官网对 GPU 提供方的说明|提供方路径以 GNK 为奖励单位；不是你的余额",
          "賺取 GNK|Gonka 官網對 GPU 提供方的說明|提供方路徑以 GNK 為獎勵單位；不是你的餘額",
          "Earn GNK|Gonka’s note for GPU providers|The provider path uses GNK as the reward unit; it is not your balance",
          "GNK를 번다|GPU 제공자에 대한 Gonka 사이트 설명|제공자 경로의 보상 단위가 GNK임. 내 잔액은 아님",
          "GNKを得る|GPU提供者へのGonkaサイトの説明|提供者の報酬単位がGNKであること。自分の残高ではない",
        ),
        text(
          "按资源数量和质量奖励|Host quickstart|奖励依据的方向；没有换算表",
          "按資源數量和質量獎勵|Host quickstart|獎勵依據的方向；沒有換算表",
          "Rewarded by amount and quality of resources|Host quickstart|The direction of the reward; no conversion table",
          "자원의 양과 질에 따른 보상|Host quickstart|보상의 방향이며 환산표는 없음",
          "資源の量と質による報酬|Host quickstart|報酬の方向であり、換算表はない",
        ),
        text(
          "没有日收益的提示|监控页面|不要把权重当成今日已入账",
          "沒有日收益的提示|監控頁面|不要把權重當成今日已入帳",
          "The note that there is no daily earnings figure|The monitor|Do not treat weight as today’s credit",
          "일일 수익 숫자가 없다는 안내|모니터|가중치를 오늘의 입금으로 보지 않음",
          "日次収益の数字はないという表示|モニター|重みを今日の入金と見ない",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "权重 10 是不是 10 GNK？",
          "權重 10 是不是 10 GNK？",
          "Does a weight of 10 mean 10 GNK?",
          "가중치 10은 10 GNK인가요?",
          "重み10は10 GNKですか？",
        ),
        text(
          "不是。文档样例里的 10 是奖励权重。官网和 quickstart 都没有给出“权重等于多少 GNK”的换算。监控也不做这步乘法。",
          "不是。文件樣例裡的 10 是獎勵權重。官網和 quickstart 都沒有給出「權重等於多少 GNK」的換算。監控也不做這步乘法。",
          "No. The 10 in the document sample is reward weight. The site and the quickstart do not publish a conversion from weight into GNK. The monitor does not multiply them either.",
          "아닙니다. 문서 예시의 10은 보상 가중치입니다. 사이트와 quickstart는 가중치가 몇 GNK인지 환산을 공개하지 않습니다. 모니터도 그 곱셈을 하지 않습니다.",
          "違います。文書例の10は報酬の重みです。サイトもquickstartも、重みが何GNKに相当するかの換算は出していません。モニターもその掛け算はしません。",
        ),
      ],
      [
        text(
          "设备卡片上的权重会不会被加进钱包总额？",
          "裝置卡片上的權重會不會被加進錢包總額？",
          "Is the weight on the device card added into a wallet total?",
          "기기 카드의 가중치가 지갑 합계에 더해지나요?",
          "デバイスカードの重みはウォレット合計に足されますか？",
        ),
        text(
          "不会把它当成 GNK 余额相加。Gonka 这里显示的是该地址的本轮权重。同一个地址若出现在多台已保存设备上，余额类数字仍按同一份处理，不会复制成多份收入。权重缺失时保持未知。",
          "不會把它當成 GNK 餘額相加。Gonka 這裡顯示的是該地址的本輪權重。同一個地址若出現在多台已儲存裝置上，餘額類數字仍按同一份處理，不會複製成多份收入。權重缺失時保持未知。",
          "It is not added as a GNK balance. For Gonka, the card shows that address’s epoch weight. If the same address is on several saved devices, balance-style figures stay one shared figure and are not copied into extra income. A missing weight stays unknown.",
          "GNK 잔액으로 더하지 않습니다. Gonka에서는 그 주소의 이번 에포크 가중치를 보여 줍니다. 같은 주소가 여러 저장 기기에 있어도 잔액형 숫자는 한 덩어리로 두고 수입으로 복제하지 않습니다. 가중치가 없으면 알 수 없음입니다.",
          "GNK残高としては足しません。Gonkaではそのアドレスの今期の重みを出します。同じアドレスが複数の保存デバイスにあっても、残高型の数字は一つとして扱い、収入として複製しません。重みがなければ不明のままです。",
        ),
      ],
      [
        text(
          "这一轮权重会自动变成下一轮的入账吗？",
          "這一輪權重會自動變成下一輪的入帳嗎？",
          "Does this epoch’s weight automatically become next epoch’s credit?",
          "이번 에포크 가중치가 다음 에포크 입금으로 자동으로 바뀌나요?",
          "今期の重みは次の期の入金に自動で変わりますか？",
        ),
        text(
          "监控没有这笔换算，也没有发放时间。下一轮要重新看当前名单里的权重。入账以官方奖励说明和账本为准。",
          "監控沒有這筆換算，也沒有發放時間。下一輪要重新看目前名單裡的權重。入帳以官方獎勵說明和帳本為準。",
          "The monitor has no such conversion and no payout time. Next epoch, read the weight on the current list again. Credits follow the official rewards notes and ledger.",
          "모니터에는 그 환산도 지급 시각도 없습니다. 다음 에포크에는 현재 명단의 가중치를 다시 보세요. 입금은 공식 보상 설명과 원장을 기준으로 합니다.",
          "モニターにその換算も支払時刻もありません。次の期は現在の名簿の重みを読み直します。入金は公式の報酬説明と台帳に従います。",
        ),
      ],
    ]),
    body: paras(
      [
        "对上 Host 时，" +
          tool +
          " 给出的是本轮奖励权重，不是已经打进账户的 GNK。官网写 GPU 提供方可以赚取 GNK；quickstart 写奖励取决于所提供资源的数量和质量。两句话都没有把你的权重换成一笔金额。",
        "## 三个数不要叠在一起",
        "- 权重：当前参与者记录上的 weight。API 文档称它为本轮奖励权重。",
        "- GNK：官网和 quickstart 使用的奖励单位。监控没有余额、单价或今日入账。",
        "- 参与者人数：这一轮名单有多少条记录。它不是你的权重，也不能除出来得到单台收入。",
        "- 页面在查找结果下写明没有日收益。设备卡片上的同一格也是权重，标签不是 GNK。",
        "## 核对入账时看哪里",
        "- 先确认地址在本轮名单里，并记下 epoch 和权重。步骤见 [本轮核对](/learn/" +
          monitor +
          ")。",
        "- 再打开官网给出的 Rewards & tokenomics，以及你自己的官方账本。监控不代替那一页。",
        "- cap_weight 是另一项信任权重，页面不显示。不要用它或 weight 去估 PoC 奖金。见 [PoC 与推理](/learn/" +
          poc +
          ")。",
        "## 接下来怎么做",
        "- 权重有数字：把它当作本轮权重留档，不要乘以交易所价格。",
        "- 权重是横线或整页未获取：记为未知。当前轮次未列出此地址也不是收入 0。见 [未找到 Host](/learn/" +
          missing +
          ")。",
        "- 同一 gonka 地址放在多台已保存设备上时，不要把权重加总。那是同一份记录。只有另存设备才会占用每项目 5 台（Pro 50 台）的名额。",
        "## 示意",
        "说明性例子，不是实际收入：文档样例的 weight 是 10。即便你的页面也显示 10，这里仍然只是奖励权重。没有官方换算时，10 旁边不能写上 GNK 或美元。",
        "## 界限",
        "- 不预测下一轮权重，不保证发放，不把 Uniswap 上的 GNK 买卖入口当成你的结算价。",
        "- 资源“数量和质量”如何折成权重，quickstart 没有给出公式。缺公式时就停在权重本身。",
        "- 本页不发起转账。AI 崩溃分析不改变这笔权重。",
      ],
      [
        "對上 Host 時，" +
          toolTw +
          " 給出的是本輪獎勵權重，不是已經打進帳戶的 GNK。官網寫 GPU 提供方可以賺取 GNK；quickstart 寫獎勵取決於所提供資源的數量和質量。兩句話都沒有把你的權重換成一筆金額。",
        "## 三個數不要疊在一起",
        "- 權重：目前參與者紀錄上的 weight。API 文件稱它為本輪獎勵權重。",
        "- GNK：官網和 quickstart 使用的獎勵單位。監控沒有餘額、單價或今日入帳。",
        "- 參與者人數：這一輪名單有多少條紀錄。它不是你的權重，也不能除出來得到單台收入。",
        "- 頁面在查找結果下寫明沒有日收益。裝置卡片上的同一格也是權重，標籤不是 GNK。",
        "## 核對入帳時看哪裡",
        "- 先確認地址在本輪名單裡，並記下 epoch 和權重。步驟見 [本輪核對](/learn/" +
          monitor +
          ")。",
        "- 再打開官網給出的 Rewards & tokenomics，以及你自己的官方帳本。監控不代替那一頁。",
        "- cap_weight 是另一項信任權重，頁面不顯示。不要用它或 weight 去估 PoC 獎金。見 [PoC 與推理](/learn/" +
          poc +
          ")。",
        "## 接下來怎麼做",
        "- 權重有數字：把它當作本輪權重留檔，不要乘以交易所價格。",
        "- 權重是橫線或整頁未取得：記為未知。目前輪次未列出此地址也不是收入 0。見 [未找到 Host](/learn/" +
          missing +
          ")。",
        "- 同一 gonka 地址放在多台已儲存裝置上時，不要把權重加總。那是同一份紀錄。只有另存裝置才會佔用每專案 5 台（Pro 50 台）的名額。",
        "## 示意",
        "說明性例子，不是實際收入：文件樣例的 weight 是 10。即便你的頁面也顯示 10，這裡仍然只是獎勵權重。沒有官方換算時，10 旁邊不能寫上 GNK 或美元。",
        "## 界限",
        "- 不預測下一輪權重，不保證發放，不把 Uniswap 上的 GNK 買賣入口當成你的結算價。",
        "- 資源「數量和質量」如何折成權重，quickstart 沒有給出公式。缺公式時就停在權重本身。",
        "- 本頁不發起轉帳。AI 崩潰分析不改變這筆權重。",
      ],
      [
        "When the Host matches, the " +
          toolEn +
          " shows this epoch’s reward weight, not GNK already posted to an account. The site says GPU providers can earn GNK. The quickstart says the reward depends on the amount and quality of resources provided. Neither sentence converts your weight into an amount.",
        "## Three figures that do not stack",
        "- Weight: weight on the current participant record. The API docs call it the reward weight for this epoch.",
        "- GNK: the reward unit used on the site and in the quickstart. The monitor has no balance, unit price, or today’s credit.",
        "- Participant count: how many records are on this epoch’s list. It is not your weight, and dividing the list by that count does not produce one Host’s income.",
        "- Under the lookup, the page says there is no daily earnings figure. The same cell on a device card is weight. Its label is not GNK.",
        "## Where to check a credit",
        "- First confirm the address is on this epoch’s list and note the epoch and weight. See [this epoch](/learn/" +
          monitor +
          ").",
        "- Then open Rewards & tokenomics from the official site, and your own official ledger. The monitor does not replace that page.",
        "- cap_weight is a separate trust weight. The page does not show it. Do not use it or weight to estimate a PoC bonus. See [PoC and inference](/learn/" +
          poc +
          ").",
        "## What to do next",
        "- If weight is a number: keep it as this epoch’s weight. Do not multiply it by an exchange price.",
        "- If weight is a dash, or the page is unavailable: record unknown. Not listed is not income of zero. See [Host not found](/learn/" +
          missing +
          ").",
        "- If the same gonka address sits on several saved devices, do not add the weights. It is one record. Only a separately saved device uses a slot, five per project on Free and 50 on Pro.",
        "## Illustration",
        "Illustration, not actual income: the document sample’s weight is 10. Even if your page also shows 10, that is still reward weight. Without an official conversion, do not write GNK or dollars beside 10.",
        "## Limits",
        "- This page does not forecast next epoch’s weight, does not guarantee a payout, and does not treat the Uniswap buy-or-sell entry as your settlement price.",
        "- The quickstart does not give a formula from “amount and quality” of resources to weight. When that formula is absent, stop at the weight itself.",
        "- This page does not send a transfer. AI crash analysis does not change this weight.",
      ],
      [
        "Host가 맞으면 " +
          toolKo +
          "는 이번 에포크 보상 가중치를 보여 줄 뿐, 계정에 이미 들어온 GNK는 아닙니다. 사이트는 GPU 제공자가 GNK를 벌 수 있다고 쓰고, quickstart는 보상이 제공한 자원의 양과 질에 달린다고 씁니다. 두 문장 모두 당신 가중치를 금액으로 바꾸지 않습니다.",
        "## 겹쳐 읽으면 안 되는 세 숫자",
        "- 가중치: 현재 참여자 기록의 weight입니다. API 문서는 이것을 이번 에포크 보상 가중치라고 합니다.",
        "- GNK: 사이트와 quickstart가 쓰는 보상 단위입니다. 모니터에는 잔액, 단가, 오늘 입금이 없습니다.",
        "- 참여자 수: 이번 에포크 명단의 기록 수입니다. 당신 가중치가 아니며, 그 수로 나눠도 한 대의 수입이 되지 않습니다.",
        "- 조회 결과 아래에 일일 수익 숫자는 없다고 적혀 있습니다. 기기 카드의 같은 칸도 가중치이며 라벨은 GNK가 아닙니다.",
        "## 입금을 어디서 보나",
        "- 먼저 주소가 이번 에포크 명단에 있는지 확인하고 epoch와 가중치를 적으세요. [이번 에포크](/learn/" +
          monitor +
          ")를 보세요.",
        "- 그다음 공식 사이트의 Rewards & tokenomics와 자신의 공식 원장을 여세요. 모니터가 그 페이지를 대신하지 않습니다.",
        "- cap_weight는 별도의 신뢰 가중치이며 페이지에 없습니다. 그것이나 weight로 PoC 보너스를 추정하지 마세요. [PoC와 추론](/learn/" +
          poc +
          ")을 보세요.",
        "## 다음에 할 일",
        "- 가중치가 숫자이면 이번 에포크 가중치로만 보관하세요. 거래소 가격을 곱하지 마세요.",
        "- 가중치가 줄표이거나 페이지를 쓸 수 없으면 알 수 없음으로 적으세요. 미등재는 수입 0이 아닙니다. [Host를 찾지 못함](/learn/" +
          missing +
          ")을 보세요.",
        "- 같은 gonka 주소가 여러 저장 기기에 있으면 가중치를 합산하지 마세요. 같은 기록입니다. 따로 저장한 기기만 프로젝트당 5대(Pro 50대) 자리를 씁니다.",
        "## 예시",
        "설명용이며 실제 수입이 아닙니다. 문서 예시의 weight는 10입니다. 당신 페이지도 10이라도 그것은 여전히 보상 가중치입니다. 공식 환산이 없으면 10 옆에 GNK나 달러를 쓰지 마세요.",
        "## 한계",
        "- 다음 에포크 가중치를 예측하지 않고, 지급을 보장하지 않으며, Uniswap의 GNK 매수·매도 입구를 당신의 정산가로 보지 않습니다.",
        "- quickstart는 자원의 양과 질이 가중치로 어떻게 바뀌는지 공식을 주지 않습니다. 공식이 없으면 가중치에서 멈추세요.",
        "- 이 페이지는 송금하지 않습니다. AI 장애 분석이 이 가중치를 바꾸지 않습니다.",
      ],
      [
        "Hostが一致したとき、" +
          toolJa +
          "が出すのは今期の報酬の重みであり、口座に既に入ったGNKではありません。サイトはGPU提供者がGNKを得られると書き、quickstartは報酬が提供した資源の量と質によると書きます。どちらも、あなたの重みを金額には換えていません。",
        "## 重ねて読まない三つの数",
        "- 重み：現在の参加者記録のweightです。API文書はこれを今期の報酬の重みと呼びます。",
        "- GNK：サイトとquickstartが使う報酬の単位です。モニターに残高、単価、今日の入金はありません。",
        "- 参加者数：今期の名簿にある記録の件数です。あなたの重みではなく、その件数で割っても一台の収入にはなりません。",
        "- 検索結果の下に、日次収益の数字はないと書いてあります。デバイスカードの同じマスも重みで、ラベルはGNKではありません。",
        "## 入金をどこで見るか",
        "- まずアドレスが今期の名簿にあることを確認し、epochと重みを控えます。[今期の確認](/learn/" +
          monitor +
          ") を見てください。",
        "- そのあと公式サイトのRewards & tokenomicsと、自分の公式台帳を開きます。モニターはそのページの代わりになりません。",
        "- cap_weightは別の信頼の重みで、ページには出ません。それやweightでPoCのボーナスを見積もらないでください。[PoCと推論](/learn/" +
          poc +
          ") を見てください。",
        "## 次にすること",
        "- 重みが数字なら、今期の重みとして保管します。取引所の価格を掛けないでください。",
        "- 重みがダッシュ、またはページが使えないなら不明と記録します。未掲載は収入0ではありません。[Hostが見つからない](/learn/" +
          missing +
          ") を見てください。",
        "- 同じgonkaアドレスが複数の保存デバイスにあっても、重みを足さないでください。同じ記録です。別に保存したデバイスだけが、プロジェクトあたり5台（Proは50台）の枠を使います。",
        "## 例示",
        "説明用であり、実際の収入ではありません。文書例のweightは10です。自分のページも10でも、それはやはり報酬の重みです。公式の換算がなければ、10の横にGNKやドルを書かないでください。",
        "## 限界",
        "- 次の期の重みは予測せず、支払いも保証せず、UniswapのGNK売買の入口を自分の決済価格にしません。",
        "- quickstartは、資源の量と質がどのように重みになるかの式を出していません。式がなければ重みで止めてください。",
        "- このページは送金しません。AIクラッシュ分析がこの重みを変えることもありません。",
      ],
    ),
  },
  {
    slug: missing,
    project: "gonka",
    published: "2026-10-24",
    modified: "2026-10-24",
    sources,
    related: [monitor, hostId, rewards],
    topic: text(
      "未找到时怎么分支",
      "未找到時怎麼分支",
      "Which branch when it is missing",
      "없을 때의 갈림",
      "見つからないときの分岐",
    ),
    title: text(
      "Gonka Host 未找到：名单里没有，还是这一页没读到",
      "Gonka Host 未找到：名單裡沒有，還是這一頁沒讀到",
      "Gonka Host not found: missing from the list, or the page did not load",
      "Gonka Host를 찾지 못함: 명단에 없는지, 페이지가 안 읽혔는지",
      "Gonka Hostが見つからない：名簿にないのか、ページが読めていないのか",
    ),
    description: text(
      "Gonka 当前名单已经读到、但没有你的完整地址时，状态是当前轮次未列出此地址。整页读失败是未获取或旧数据。两种情况都不要记成权重 0。",
      "Gonka 目前名單已經讀到、但沒有你的完整地址時，狀態是目前輪次未列出此地址。整頁讀取失敗是未取得或舊資料。兩種情況都不要記成權重 0。",
      "When Gonka’s current list has loaded and your full address is absent, the status is not listed. A failed page read is Unavailable or Cached data. In both cases, do not record weight as zero.",
      "Gonka의 현재 명단은 읽혔는데 전체 주소가 없으면 상태는 미등재입니다. 페이지 읽기 실패는 사용 불가 또는 오래된 데이터입니다. 둘 다 가중치를 0으로 적지 마세요.",
      "Gonkaの現在の名簿は読めたのに完全なアドレスがなければ、状態は未掲載です。ページの取得失敗は利用不可か古いデータです。どちらも重みを0と記録しないでください。",
    ),
    summary: text(
      "当前轮次未列出此地址表示这份当前 epoch 的参与者名单里没有该 index。未获取表示名单没有读到；若还留着上一份结果，页面会标成旧数据。当前轮次未列出此地址不证明机器已经关机。地址贴错会和真的不在本轮看起来一样，要先分开。",
      "目前輪次未列出此地址表示這份目前 epoch 的參與者名單裡沒有該 index。未取得表示名單沒有讀到；若還留著上一份結果，頁面會標成舊資料。目前輪次未列出此地址不證明機器已經關機。地址貼錯會和真的不在本輪看起來一樣，要先分開。",
      "Not listed means this epoch’s participant list has no such index. Unavailable means the list did not load. If a previous result is still on screen, the page marks it Cached data. Not listed does not prove the machine is off. A mistyped address looks the same as a Host that is truly absent, so separate those first.",
      "미등재는 이번 epoch 참여자 명단에 그 index가 없다는 뜻입니다. 사용 불가는 명단을 읽지 못했다는 뜻입니다. 이전 결과가 남아 있으면 페이지는 오래된 데이터로 표시합니다. 미등재는 기계가 꺼졌다는 증거가 아닙니다. 주소를 잘못 붙이면 정말 이번 에포크에 없는 것과 같아 보이므로 먼저 나누세요.",
      "未掲載は、今期の参加者名簿にそのindexがないという意味です。利用不可は名簿が読めていないという意味です。前の結果が残っていれば、ページは古いデータと示します。未掲載は機械が止まっている証拠ではありません。アドレスの貼り間違いは、本当に今期にいない場合と同じに見えるので、先に分けてください。",
    ),
    comparisonTitle: text(
      "三种结果怎么分支",
      "三種結果怎麼分支",
      "Three results, three branches",
      "세 가지 결과의 갈림",
      "三つの結果と分岐",
    ),
    comparison: table(
      text(
        "页面状态|名单|下一步",
        "頁面狀態|名單|下一步",
        "Page status|The list|Next step",
        "페이지 상태|명단|다음",
        "ページの状態|名簿|次",
      ),
      [
        text(
          "本轮参与|已读到，且 index 整段一致|记录 epoch、权重、模型",
          "本輪參與|已讀到，且 index 整段一致|記錄 epoch、權重、模型",
          "In this epoch|Loaded, and the whole index matches|Record epoch, weight, and models",
          "이번 에포크 참여|읽혔고 index 전체가 같음|epoch, 가중치, 모델을 기록",
          "今期参加|読めておりindex全体が一致|epoch、重み、モデルを記録",
        ),
        text(
          "当前轮次未列出此地址|已读到，但没有这个地址|核对标识和轮次，不要写权重 0",
          "目前輪次未列出此地址|已讀到，但沒有這個地址|核對標識和輪次，不要寫權重 0",
          "Not listed in the current epoch|Loaded, but this address is absent|Check the identifier and the epoch; do not write weight 0",
          "미등재|읽혔지만 이 주소가 없음|식별자와 에포크를 확인하고 가중치 0은 쓰지 않음",
          "未掲載|読めたがこのアドレスがない|識別子と期を確認し、重み0は書かない",
        ),
        text(
          "未获取|这一次没有名单|先刷新；没有上一份成功结果时权重未知",
          "未取得|這一次沒有名單|先重新整理；沒有上一份成功結果時權重未知",
          "Unavailable|No list on this attempt|Refresh; weight stays unknown if there was no earlier success",
          "확인 불가|이번엔 명단이 없음|새로 고침. 이전 성공이 없으면 가중치는 알 수 없음",
          "取得できません|今回は名簿がない|更新する。前の成功がなければ重みは不明",
        ),
        text(
          "旧数据|屏幕上仍是上一份名单|不要把它当成刚刚确认的缺席",
          "舊資料|螢幕上仍是上一份名單|不要把它當成剛剛確認的缺席",
          "Cached data|The screen still shows the previous list|Do not treat it as an absence just confirmed",
          "이전 데이터|화면에 이전 명단이 남아 있음|방금 확인된 불참으로 보지 않음",
          "過去のデータ|画面には前の名簿が残っている|たった今確認した不在とは見ない",
        ),
      ],
    ),
    questions: questions([
      [
        text(
          "当前轮次未列出此地址是不是机器离线？",
          "当前轮次未列出此地址是不是機器離線？",
          "Does not listed mean the machine is offline?",
          "미등재는 기계가 오프라인이라는 뜻인가요?",
          "未掲載は機械がオフラインという意味ですか？",
        ),
        text(
          "不是。当前轮次未列出此地址只说明当前这份参与者名单里没有这个 index。机器可能还在上一轮、地址贴错，或尚未作为 Host 进入这一轮。实时开关机要看你自己的节点，不看这行字。",
          "不是。目前輪次未列出此地址只說明目前這份參與者名單裡沒有這個 index。機器可能還在上一輪、地址貼錯，或尚未作為 Host 進入這一輪。即時開關機要看你自己的節點，不看這行字。",
          "No. Not listed only means this index is absent from the current participant list. The machine may still belong to the previous epoch, the address may be wrong, or it may not have joined this epoch as a Host. Power state belongs on your own node, not in this line.",
          "아닙니다. 미등재는 현재 참여자 명단에 이 index가 없다는 뜻뿐입니다. 기계가 이전 에포크에 있거나, 주소가 잘못되었거나, 아직 이번 에포크의 Host로 들어오지 않았을 수 있습니다. 전원이 켜져 있는지는 자신의 노드에서 봐야 하며 이 문구가 아닙니다.",
          "違います。未掲載は、現在の参加者名簿にこのindexがないという意味だけです。機械が前の期のまま、アドレスが違う、またはまだ今期のHostとして入っていないことがあります。電源の状態は自分のノードで見て、この一行では見ません。",
        ),
      ],
      [
        text(
          "刷新之后仍是当前轮次未列出此地址，权重该填多少？",
          "重新整理之後仍是目前輪次未列出此地址，權重該填多少？",
          "It stays not listed after a refresh. What weight do I write?",
          "새로 고쳐도 미등재입니다. 가중치는 얼마로 적나요?",
          "更新しても未掲載のままです。重みはいくつと書きますか？",
        ),
        text(
          "不填 0。当前轮次未列出此地址时没有这条 Host 的权重。只有对上之后，页面才会给出权重数字。空着就保持未知。",
          "不填 0。目前輪次未列出此地址時沒有這條 Host 的權重。只有對上之後，頁面才會給出權重數字。空著就保持未知。",
          "Do not write 0. Not listed means there is no weight for this Host. The page shows a weight number only after a match. A blank stays unknown.",
          "0으로 적지 마세요. 미등재는 이 Host의 가중치가 없다는 뜻입니다. 페이지는 일치한 뒤에만 가중치 숫자를 줍니다. 비어 있으면 알 수 없음입니다.",
          "0とは書きません。未掲載は、このHostの重みがないという意味です。ページは一致したあとだけ重みの数字を出します。空なら不明のままです。",
        ),
      ],
      [
        text(
          "免费名额会因为未找到而增加吗？",
          "免費名額會因為未找到而增加嗎？",
          "Does a not-found lookup use an extra free slot?",
          "찾지 못한 조회가 무료 자리를 더 쓰나요?",
          "見つからない検索は無料枠を追加で使いますか？",
        ),
        text(
          "不会。在项目页查找不占用名额。只有把 Gonka 存成一台设备记录时才计入该项目的 5 台（Pro 为 50 台）。同一台设备上再绑一次不增加名额。",
          "不會。在專案頁查找不佔用名額。只有把 Gonka 存成一台裝置紀錄時才計入該專案的 5 台（Pro 為 50 台）。同一台裝置上再綁一次不增加名額。",
          "No. A lookup on the project page does not use a slot. A slot is used when you save Gonka as a device record: five per project on Free, 50 on Pro. Binding it again on the same device does not add a slot.",
          "쓰지 않습니다. 프로젝트 페이지에서 찾는 것은 자리를 쓰지 않습니다. Gonka를 기기 기록으로 저장할 때만 프로젝트당 5대(Pro 50대)에 포함됩니다. 같은 기기에 다시 묶어도 자리는 늘지 않습니다.",
          "使いません。プロジェクトページでの検索は枠を使いません。Gonkaをデバイス記録として保存したときだけ、プロジェクトあたり5台（Proは50台）に数えます。同じデバイスに重ねても枠は増えません。",
        ),
      ],
    ]),
    body: paras(
      [
        "在 " +
          tool +
          " 上，“当前轮次未列出此地址”和“没读到”不是同一件事。名单已经显示、你的完整地址不在其中，才是当前轮次未列出此地址。名单这次没有读到，是未获取；若屏幕上还留着上一份，则标为旧数据。两种都不要写成权重 0 或收入 0。",
        "## 先看页面落在哪一支",
        "- 上方能看到参与者人数和 epoch，查找结果写当前轮次未列出此地址：这份当前名单里没有该 index。",
        "- 上方没有人数，或明确未获取：这次没有可用名单。先刷新一次。",
        "- 标着旧数据：缺席或参与都还是上一份结果，不能当成刚刚的确认。",
        "- 对上了却以为没找到：再看是不是只抄了地址末尾。必须整段一致。见 [该贴哪一种标识](/learn/" +
          hostId +
          ")。",
        "## 当前轮次未列出此地址之后检查什么",
        "- 核对贴入的是 gonka 账户地址，而不是推理网址、公钥或大写十六进制。",
        "- 核对你看的 epoch 是不是要查的那一轮。当前名单只代表当前轮次。",
        "- 到 [quickstart](" +
          quick +
          ") 确认网络节点和至少一个 ML 节点是否已经按 Host 加入。监控不能替你看容器是否在跑。",
        "## 接下来怎么做",
        "- 标识错了：改正后再查。改正前的当前轮次未列出此地址不能留成权重 0。",
        "- 标识对、名单是新的、仍然当前轮次未列出此地址：记为“不在这一轮的名单”。权重量保持未知。入账问题另看 [权重和 GNK](/learn/" +
          rewards +
          ")，不要用缺席去推算扣款。",
        "- 反复未获取：保留未知，改到 [API 文档](" +
          api +
          ") 查看当前轮次参与者，而不是在监控里补 0。",
        "- 查找本身不占设备名额。保存成设备后，免费每项目 5 台，Pro 50 台。",
        "## 示意",
        "说明性分支，不是某台机器的故障记录：地址写成 gonka1… 且名单已加载但没有这条，走当前轮次未列出此地址。把 http 服务地址贴进去，同样对不上，也走当前轮次未列出此地址，但原因是标识不对。页面完全没有 epoch 时走未获取，权重保持未知。",
        "## 界限",
        "- 当前轮次未列出此地址不证明离线、封禁或下轮一定缺席。",
        "- 不把文档样例里的权重 10 填进一台未找到的 Host。",
        "- 本页不重启节点。AI 崩溃分析免费，且不能控制 Gonka 主机。",
      ],
      [
        "在 " +
          toolTw +
          " 上，「目前輪次未列出此地址」和「沒讀到」不是同一件事。名單已經顯示、你的完整地址不在其中，才是目前輪次未列出此地址。名單這次沒有讀到，是未取得；若螢幕上還留著上一份，則標為舊資料。兩種都不要寫成權重 0 或收入 0。",
        "## 先看頁面落在哪一支",
        "- 上方能看到參與者人數和 epoch，查找結果寫目前輪次未列出此地址：這份目前名單裡沒有該 index。",
        "- 上方沒有人數，或明確未取得：這次沒有可用名單。先重新整理一次。",
        "- 標著舊資料：缺席或參與都還是上一份結果，不能當成剛剛的確認。",
        "- 對上了卻以為沒找到：再看是不是只抄了地址末尾。必須整段一致。見 [該貼哪一種標識](/learn/" +
          hostId +
          ")。",
        "## 目前輪次未列出此地址之後檢查什麼",
        "- 核對貼入的是 gonka 帳戶地址，而不是推理網址、公鑰或大寫十六進位。",
        "- 核對你看的 epoch 是不是要查的那一輪。目前名單只代表目前輪次。",
        "- 到 [quickstart](" +
          quick +
          ") 確認網路節點和至少一個 ML 節點是否已經按 Host 加入。監控不能替你看容器是否在跑。",
        "## 接下來怎麼做",
        "- 標識錯了：改正後再查。改正前的目前輪次未列出此地址不能留成權重 0。",
        "- 標識對、名單是新的、仍然目前輪次未列出此地址：記為「不在這一輪的名單」。權重量保持未知。入帳問題另看 [權重和 GNK](/learn/" +
          rewards +
          ")，不要用缺席去推算扣款。",
        "- 反覆未取得：保留未知，改到 [API 文件](" +
          api +
          ") 查看目前輪次參與者，而不是在監控裡補 0。",
        "- 查找本身不佔裝置名額。儲存成裝置後，免費每專案 5 台，Pro 50 台。",
        "## 示意",
        "說明性分支，不是某台機器的故障紀錄：地址寫成 gonka1… 且名單已載入但沒有這條，走目前輪次未列出此地址。把 http 服務地址貼進去，同樣對不上，也走目前輪次未列出此地址，但原因是標識不對。頁面完全沒有 epoch 時走未取得，權重保持未知。",
        "## 界限",
        "- 当前轮次未列出此地址不證明離線、封鎖或下輪一定缺席。",
        "- 不把文件樣例裡的權重 10 填進一台未找到的 Host。",
        "- 本頁不重啟節點。AI 崩潰分析免費，且不能控制 Gonka 主機。",
      ],
      [
        "On the " +
          toolEn +
          ", “not listed” and “did not load” are different. Not listed means the list is on screen and your full address is not in it. Unavailable means this attempt produced no list. If a previous result is still showing, the page marks it Cached data. Do not write either case as weight 0 or income 0.",
        "## Which branch the page is on",
        "- If the participant count and epoch are visible and the lookup says not listed: this current list has no such index.",
        "- If the count is missing, or the page says unavailable: there is no usable list this time. Refresh once.",
        "- If it is marked Cached data: both absence and participation are still the previous result. That is not a confirmation just made.",
        "- If you expected a miss but it matched: check that you did not copy only the end of the address. The whole value must match. See [which identifier to paste](/learn/" +
          hostId +
          ").",
        "## What to inspect after not listed",
        "- Confirm you pasted the gonka account address, not an inference URL, a public key, or uppercase hex.",
        "- Confirm the epoch on screen is the epoch you meant. The current list is only the current epoch.",
        "- Use the [quickstart](" +
          quick +
          ") to see whether the network node and at least one ML node have joined as a Host. The monitor cannot see whether your containers are running.",
        "## What to do next",
        "- If the identifier was wrong: correct it and look again. Do not keep the earlier miss as weight 0.",
        "- If the identifier is right, the list is fresh, and it is still not listed: record “not on this epoch’s list.” Weight stays unknown. For credits, see [weight and GNK](/learn/" +
          rewards +
          "). Do not turn absence into a deduction.",
        "- If it stays unavailable: keep unknown and use the [API docs](" +
          api +
          ") for the current-epoch participants. Do not fill 0 in the monitor.",
        "- The lookup itself does not use a device slot. After you save a device, Free is five per project and Pro is 50.",
        "## Illustration",
        "An illustrative branch, not a fault record for a real machine: a gonka1… address with a loaded list that lacks that row is not listed. Pasting an http service address also fails to match and is not listed, but the cause is the wrong identifier. When the page has no epoch at all, the branch is unavailable and weight stays unknown.",
        "## Limits",
        "- Not listed does not prove the machine is offline, banned, or absent next epoch.",
        "- Do not copy the document sample’s weight of 10 onto a Host that was not found.",
        "- This page does not restart a node. AI crash analysis is free and cannot control a Gonka host.",
      ],
      [
        toolKo +
          "에서 “미등재”와 “읽지 못함”은 다릅니다. 명단이 화면에 있고 전체 주소가 그 안에 없을 때가 미등재입니다. 사용 불가는 이번 시도에서 명단이 없다는 뜻입니다. 이전 결과가 남아 있으면 페이지는 오래된 데이터로 표시합니다. 둘 다 가중치 0이나 수입 0으로 적지 마세요.",
        "## 페이지가 어느 갈림인지",
        "- 참여자 수와 epoch가 보이고 조회가 미등재이면, 이 현재 명단에 그 index가 없습니다.",
        "- 수가 없거나 사용 불가라고 하면, 이번에 쓸 수 있는 명단이 없습니다. 한 번 새로 고치세요.",
        "- 오래된 데이터로 표시되면, 불참도 참여도 이전 결과입니다. 방금 확인된 것이 아닙니다.",
        "- 없을 줄 알았는데 맞았다면, 주소 끝만 복사하지 않았는지 보세요. 전체가 같아야 합니다. [어떤 식별자를 붙일까](/learn/" +
          hostId +
          ")를 보세요.",
        "## 미등재 다음에 볼 것",
        "- 붙인 것이 gonka 계정 주소인지, 추론 URL·공개 키·대문자 16진수는 아닌지 확인하세요.",
        "- 화면의 epoch가 보려던 에포크인지 확인하세요. 현재 명단은 현재 에포크만 나타냅니다.",
        "- [quickstart](" +
          quick +
          ")에서 네트워크 노드와 ML 노드가 적어도 하나 Host로 참여했는지 보세요. 모니터는 컨테이너가 실행 중인지를 대신 보지 않습니다.",
        "## 다음에 할 일",
        "- 식별자가 잘못되었으면 고친 뒤 다시 찾으세요. 고치기 전의 미등재를 가중치 0으로 남기지 마세요.",
        "- 식별자가 맞고 명단이 새것이며 여전히 미등재이면 “이번 에포크 명단에 없음”으로 적으세요. 가중치는 알 수 없음입니다. 입금은 [가중치와 GNK](/learn/" +
          rewards +
          ")를 보세요. 불참으로 차감을 계산하지 마세요.",
        "- 계속 사용할 수 없으면 알 수 없음을 유지하고 [API 문서](" +
          api +
          ")에서 현재 에포크 참여자를 보세요. 모니터에 0을 채우지 마세요.",
        "- 조회 자체는 기기 자리를 쓰지 않습니다. 기기로 저장한 뒤 무료는 프로젝트당 5대, Pro는 50대입니다.",
        "## 예시",
        "설명용 갈림이며 실제 기계의 고장 기록이 아닙니다. gonka1… 주소인데 명단은 읽혔고 그 행이 없으면 미등재입니다. http 서비스 주소를 붙여도 맞지 않아 미등재이지만, 원인은 식별자가 틀린 것입니다. 페이지에 epoch가 전혀 없으면 사용 불가이고 가중치는 알 수 없음입니다.",
        "## 한계",
        "- 미등재는 오프라인, 차단, 다음 에포크의 불참을 증명하지 않습니다.",
        "- 문서 예시의 가중치 10을 찾지 못한 Host에 옮기지 마세요.",
        "- 이 페이지는 노드를 다시 시작하지 않습니다. AI 장애 분석은 무료이며 Gonka 호스트를 제어하지 않습니다.",
      ],
      [
        toolJa +
          "では、「未掲載」と「読めていない」は別です。名簿が画面にあり、完全なアドレスがその中にないときが未掲載です。利用不可は、今回の試行で名簿がないという意味です。前の結果が残っていれば、ページは古いデータと示します。どちらも重み0や収入0とは書きません。",
        "## ページがどの分岐か",
        "- 参加者数とepochが見え、検索が未掲載なら、この現在の名簿にそのindexはありません。",
        "- 件数が無い、または利用不可なら、今回使える名簿がありません。一度更新します。",
        "- 古いデータと出ていれば、不在も参加も前の結果のままです。たった今の確認ではありません。",
        "- 無いと思ったのに一致したなら、アドレスの末尾だけを写していないか見ます。全体が一致する必要があります。[どの識別子を貼るか](/learn/" +
          hostId +
          ") を見てください。",
        "## 未掲載のあとに確認すること",
        "- 貼ったのがgonkaアカウントアドレスか、推論URL・公開鍵・大文字十六進ではないかを確認します。",
        "- 画面のepochが調べたい期かを確認します。現在の名簿は現在の期だけを表します。",
        "- [quickstart](" +
          quick +
          ")で、ネットワークノードと少なくとも一つのMLノードがHostとして参加しているかを見ます。モニターはコンテナが動いているかを代わりに見られません。",
        "## 次にすること",
        "- 識別子が違うなら直してから再検索します。直す前の未掲載を重み0のまま残さないでください。",
        "- 識別子が正しく、名簿が新しく、それでも未掲載なら「今期の名簿にない」と記録します。重みは不明のままです。入金は [重みとGNK](/learn/" +
          rewards +
          ") を見てください。不在から差し引きを計算しないでください。",
        "- 何度も利用不可なら不明のままにし、[API文書](" +
          api +
          ")で現在期の参加者を見ます。モニターに0を埋めないでください。",
        "- 検索自体はデバイス枠を使いません。デバイスとして保存したあと、無料はプロジェクトあたり5台、Proは50台です。",
        "## 例示",
        "説明用の分岐であり、実機の故障記録ではありません。gonka1…のアドレスで名簿は読めたがその行がなければ未掲載です。httpのサービスアドレスを貼っても一致せず未掲載ですが、原因は識別子の違いです。ページにepochが全くなければ利用不可で、重みは不明のままです。",
        "## 限界",
        "- 未掲載は、オフライン、遮断、次の期の不在を証明しません。",
        "- 文書例の重み10を、見つからなかったHostに写さないでください。",
        "- このページはノードを再起動しません。AIクラッシュ分析は無料で、Gonkaホストは制御できません。",
      ],
    ),
  },
];
