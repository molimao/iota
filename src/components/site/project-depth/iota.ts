import type { Article } from "../articles";

const queueSources = [
  {
    name: "Macrocosmos · Train at Home user guide",
    url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
  },
  {
    name: "Macrocosmos · Scoring, Rewards & Kicking",
    url: "https://docs.macrocosmos.ai/subnets/subnet-9-iota/scoring-rewards-and-kicking",
  },
  {
    name: "IOTA Watch · Mac agent",
    url: "https://github.com/molimao/iota/blob/main/scripts/device-agent/iota_watch_agent.py",
  },
];

const queue: Article = {
  slug: "iota-queue-and-zero-throughput",
  project: "iota",
  modified: "2026-10-24",
  topic: {
    zh: "排队和零吞吐",
    "zh-TW": "排隊和零吞吐",
    en: "Queue and zero throughput",
    ko: "대기와 처리량 0",
    ja: "待機と処理量ゼロ",
  },
  title: {
    zh: "IOTA 一直排队、0 tokens/s：该等还是该重启？",
    "zh-TW": "IOTA 一直排隊、0 tokens/s：該等還是該重啟？",
    en: "IOTA queued or 0 tokens/s: wait or restart?",
    ko: "IOTA가 대기이거나 0 tokens/s일 때 기다릴까요, 재시작할까요?",
    ja: "IOTAが待機中、または 0 tokens/s のとき待つ？再起動する？",
  },
  description: {
    zh: "近期日志仍显示排队时，先保持训练开启。0 tokens/s 要先看采样时间。吞吐卡片和 Agent 任务状态可以不一致，排队中不要重启。",
    "zh-TW":
      "近期日誌仍顯示排隊時，先保持訓練開啟。0 tokens/s 要先看取樣時間。吞吐卡片和 Agent 任務狀態可以不一致，排隊中不要重啟。",
    en: "Keep training on when a recent log still says queued. Read the sample time before treating 0 tokens/s as a failure. Throughput freshness and the agent task status can disagree.",
    ko: "최근 로그가 아직 대기이면 훈련을 켜 둡니다. 0 tokens/s는 표본 시각부터 봅니다. 처리량 갱신과 에이전트 작업 상태는 다를 수 있습니다.",
    ja: "新しいログがまだ待機なら学習はオンのままにします。0 tokens/s は取得時刻を先に見ます。処理量の新しさと Agent の作業状態は食い違うことがあります。",
  },
  summary: {
    zh: "先分清：仍在排队、吞吐采样已旧，还是训练已经停止。名次不代表等待时长，0 tokens/s 也不足以判断故障；有新的退出记录或确认训练停止后，再检查恢复设置。",
    "zh-TW":
      "先分清：仍在排隊、吞吐取樣已舊，還是訓練已經停止。名次不代表等待時長，0 tokens/s 也不足以判斷故障；有新的退出紀錄或確認訓練停止後，再檢查恢復設定。",
    en: "Separate a live queue, a stale throughput sample, and training that has stopped. Rank is not a wait-time estimate, and 0 tokens/s alone does not establish a fault. Check recovery after a new exit record or confirmed stopped training.",
    ko: "대기가 계속되는지, 처리량 표본이 오래됐는지, 훈련이 멈췄는지 구분하세요. 순번은 예상 대기 시간이 아니며 0 tokens/s만으로 장애를 판단할 수 없습니다. 새 종료 기록이나 훈련 중단을 확인한 뒤 복구 설정을 확인하세요.",
    ja: "待機が続いているのか、処理量のサンプルが古いのか、学習が停止したのかを分けて確認します。順位は待ち時間の予測ではなく、0 tokens/sだけでは障害と判断できません。新しい終了記録や学習停止を確認してから復旧設定を調べます。",
  },
  sources: queueSources,
  related: ["iota-training-stopped-auto-recovery", "iota-run-tiers", "how-rewards-work"],
  decision: {
    title: {
      zh: "排队中先等，停止后再恢复",
      "zh-TW": "排隊中先等，停止後再恢復",
      en: "Wait while queued; recover after a stop",
      ko: "대기 중에는 기다리고, 중지 후에 복구",
      ja: "待機中は待ち、停止後に復旧",
    },
    action: {
      zh: "[打开 IOTA 监控](/projects/iota) · [训练停止后怎么恢复](/learn/iota-training-stopped-auto-recovery)",
      "zh-TW":
        "[開啟 IOTA 監控](/projects/iota) · [訓練停止後怎麼恢復](/learn/iota-training-stopped-auto-recovery)",
      en: "[Open IOTA monitoring](/projects/iota) · [Recover a stopped session](/learn/iota-training-stopped-auto-recovery)",
      ko: "[IOTA 모니터 열기](/projects/iota) · [중지된 훈련 복구](/learn/iota-training-stopped-auto-recovery)",
      ja: "[IOTAモニターを開く](/projects/iota) · [停止した学習の復旧](/learn/iota-training-stopped-auto-recovery)",
    },
  },
  comparisonTitle: {
    zh: "你看到的现象和下一步",
    "zh-TW": "你看到的現象和下一步",
    en: "What you see and the next step",
    ko: "보이는 것과 다음 단계",
    ja: "見える状態と次の一手",
  },
  comparison: {
    zh: {
      headers: ["现象", "下一步"],
      rows: [
        [
          "几分钟内的日志仍是 queued，并带有名次",
          "保持 Start training 已开启。名次不能换算成还要等多久。",
        ],
        [
          "tokens/s 为 0，但采样时间明显早于现在",
          "先看这条吞吐是不是旧样本。旧的 0 不能单独证明当前没在排队或没在训练。",
        ],
        [
          "按钮回到 Start training，或日志出现新的退出",
          "转到停止与恢复。不要在仍排队时反复点重启。",
        ],
        ["全网显示有空位，你仍在排队", "空位是各任务合计，不是你这台机器一定能加入的名额。"],
      ],
    },
    "zh-TW": {
      headers: ["現象", "下一步"],
      rows: [
        [
          "幾分鐘內的日誌仍是 queued，並帶有名次",
          "保持 Start training 已開啟。名次不能換算成還要等多久。",
        ],
        [
          "tokens/s 為 0，但取樣時間明顯早於現在",
          "先看這條吞吐是不是舊樣本。舊的 0 不能單獨證明目前沒在排隊或沒在訓練。",
        ],
        [
          "按鈕回到 Start training，或日誌出現新的退出",
          "轉到停止與恢復。不要在仍排隊時反覆點重啟。",
        ],
        ["全網顯示有空位，你仍在排隊", "空位是各任務合計，不是你這台機器一定能加入的名額。"],
      ],
    },
    en: {
      headers: ["What you see", "Next step"],
      rows: [
        [
          "A log from the last few minutes still says queued and shows a rank",
          "Leave Start training on. The rank is not a remaining wait time.",
        ],
        [
          "tokens/s reads 0, but the sample time is clearly earlier than now",
          "Treat that 0 as a stale sample until a fresher reading arrives. It does not by itself prove you are idle.",
        ],
        [
          "The button is Start training again, or a new exit appears in the log",
          "Use the stopped-training steps. Do not restart in a loop while the machine is still queued.",
        ],
        [
          "The network shows spare seats and you are still queued",
          "Spare seats are a total across runs. They are not a seat this Mac is guaranteed to enter.",
        ],
      ],
    },
    ko: {
      headers: ["보이는 것", "다음 단계"],
      rows: [
        [
          "몇 분 안의 로그가 아직 queued이고 순번이 있음",
          "Start training을 켜 둡니다. 순번은 남은 대기 시간이 아닙니다.",
        ],
        [
          "tokens/s가 0인데 표본 시각이 지금보다 훨씬 이름",
          "더 새로운 값이 나오기 전에는 그 0을 오래된 표본으로 봅니다. 그것만으로 유휴라고 단정하지 않습니다.",
        ],
        [
          "버튼이 다시 Start training이거나 로그에 새 종료가 있음",
          "중지·복구 절차로 갑니다. 아직 대기인데 재시작을 반복하지 않습니다.",
        ],
        [
          "네트워크에 빈자리가 있는데 나는 대기",
          "빈자리는 여러 실행의 합계입니다. 이 Mac이 반드시 들어가는 자리는 아닙니다.",
        ],
      ],
    },
    ja: {
      headers: ["見えていること", "次の一手"],
      rows: [
        [
          "数分以内のログがまだ queued で順位がある",
          "Start training はオンのまま。順位は残りの待ち時間ではありません。",
        ],
        [
          "tokens/s が 0 だが取得時刻が今より明らかに古い",
          "新しい値が出るまでは、その 0 を古いサンプルとして扱います。それだけでは停止の証明になりません。",
        ],
        [
          "ボタンが Start training に戻った、またはログに新しい終了がある",
          "停止と復旧の手順へ。待機中に再起動を繰り返さない。",
        ],
        [
          "全体に空きがあるのに自分は待機",
          "空きは各実行の合計です。この Mac が必ず入れる席ではありません。",
        ],
      ],
    },
  },
  body: {
    zh: [
      "近期日志仍写着 queued 时，先不要重启。0 tokens/s 要和这条数字的采样时间一起看：吞吐卡片可以比 Agent 看到的任务状态更旧。排队本身不是崩溃。",
      "## 各字段在说什么",
      "- 排队名次来自本机 Train at Home 日志里最近一次仍有效的 queued 响应。它只说明当时排在第几位，不说明还要几分钟。",
      "- tokens/s 或 tokens/hour 是官方应用运行面板上的吞吐。样本变旧之后，0 只代表那一次读数，不代表现在的进程已经退出。",
      "- 项目卡片上的在线或贡献，来自另一路上报，时钟可以和本机日志不同。两处不一致时，分别看时间，不要把“名单上暂时看不到”当成电脑已经关机。",
      "## 先看这三处",
      "- 在那台 Mac 上确认训练仍是开启，而不是按钮已经回到 Start training。官方说明里，再点一次 Start training 会退出当前 run。",
      "- 记下 run ID、应用版本，以及排队那一行的时间。大约五分钟以前的排队行不再当作当前名次。",
      "- 打开 [IOTA 监控](/projects/iota)，对照同一台已保存设备上的吞吐时间和 Agent 任务状态。只装了公开 Miner ID、没有配对 Mac Agent 时，这里看不到本机队列。",
      "## 该等还是该动",
      "- 名次还在、日志还在更新、没有新的退出：保持开启，等下一次新的排队或进入训练的记录。不要因为名次变差、CPU 不高或吞吐为 0 就重装、换 Miner ID。",
      "- 全网空位变多，仍不能推断下一个空位属于你。能否加入还取决于这次 run 的条件和你的资格。档位和 layer 的区别见 [分层说明](/learn/iota-run-tiers)。",
      "- 按钮回到 Start training、出现新的退出，或 Agent 显示训练进程已停：改走 [停止与自动恢复](/learn/iota-training-stopped-auto-recovery)。官方编排器对崩溃节点的重置，和本站在 Mac 上重新打开应用，是两件不同的事。",
      "## 一个对照例子",
      "下面是说明读法的例子，不是某台机器的实测。下午 2:10 的日志写 queued、名次 40；下午 2:14 监控里的 tokens/s 仍是 0，采样时间停在 1:40。这时应继续等，而不是重启。若 2:20 按钮变回 Start training，并且 2:18 的日志有退出、之后没有新的排队行，才按停止处理。",
      "## 做不到的事",
      "- 本页不能缩短官方队列，也不能把空位预留给某一台 Mac。排队中的训练进程算正在运行。Agent 只根据进程不在来判断停止，不能发现进程还在但已经卡住，也不在这里说明致命错误或残留进程已被修好。",
      "- 免费每个项目 5 台已保存设备，Pro 每个项目 50 台。在一个钱包下看到多名矿工，不会自动占掉这些名额；你为工人另行保存设备记录时，才会各占一台。同一台已保存设备上的多个来源不重复占名额。",
      "- 排队期间的收益仍按官方评分在任务内分配，不是按 tokens/s 的固定单价。对账见 [昨日、累计和到账](/learn/how-rewards-work)。",
    ],
    "zh-TW": [
      "近期日誌仍寫著 queued 時，先不要重啟。0 tokens/s 要和這條數字的取樣時間一起看：吞吐卡片可以比 Agent 看到的任務狀態更舊。排隊本身不是崩潰。",
      "## 各欄位在說什麼",
      "- 排隊名次來自本機 Train at Home 日誌裡最近一次仍有效的 queued 回應。它只說明當時排在第幾位，不說明還要幾分鐘。",
      "- tokens/s 或 tokens/hour 是官方應用程式運行面板上的吞吐。樣本變舊之後，0 只代表那一次讀數，不代表現在的程序已經退出。",
      "- 專案卡片上的在線或貢獻，來自另一路上報，時鐘可以和本機日誌不同。兩處不一致時，分別看時間，不要把「名單上暫時看不到」當成電腦已經關機。",
      "## 先看這三處",
      "- 在那台 Mac 上確認訓練仍是開啟，而不是按鈕已經回到 Start training。官方說明裡，再點一次 Start training 會退出目前的 run。",
      "- 記下 run ID、應用程式版本，以及排隊那一行的時間。大約五分鐘以前的排隊行不再當作目前名次。",
      "- 打開 [IOTA 監控](/projects/iota)，對照同一台已儲存裝置上的吞吐時間和 Agent 任務狀態。只填了公開 Miner ID、沒有配對 Mac Agent 時，這裡看不到本機佇列。",
      "## 該等還是該動",
      "- 名次還在、日誌還在更新、沒有新的退出：保持開啟，等下一次新的排隊或進入訓練的紀錄。不要因為名次變差、CPU 不高或吞吐為 0 就重裝、換 Miner ID。",
      "- 全網空位變多，仍不能推論下一個空位屬於你。能否加入還取決於這次 run 的條件和你的資格。檔位和 layer 的區別見 [分層說明](/learn/iota-run-tiers)。",
      "- 按鈕回到 Start training、出現新的退出，或 Agent 顯示訓練程序已停：改走 [停止與自動恢復](/learn/iota-training-stopped-auto-recovery)。官方編排器對崩潰節點的重置，和本站在 Mac 上重新打開應用程式，是兩件不同的事。",
      "## 一個對照例子",
      "下面是說明讀法的例子，不是某台機器的實測。下午 2:10 的日誌寫 queued、名次 40；下午 2:14 監控裡的 tokens/s 仍是 0，取樣時間停在 1:40。這時應繼續等，而不是重啟。若 2:20 按鈕變回 Start training，並且 2:18 的日誌有退出、之後沒有新的排隊行，才按停止處理。",
      "## 做不到的事",
      "- 本頁不能縮短官方佇列，也不能把空位預留給某一台 Mac。排隊中的訓練程序算正在運行。Agent 只根據程序不在來判斷停止，不能發現程序還在但已經卡住，也不在這裡說明致命錯誤或殘留程序已被修好。",
      "- 免費每個專案 5 台已儲存裝置，Pro 每個專案 50 台。在一個錢包下看到多名礦工，不會自動佔掉這些名額；你為工人另行儲存裝置紀錄時，才會各佔一台。同一台已儲存裝置上的多個來源不重複佔名額。",
      "- 排隊期間的收益仍按官方評分在任務內分配，不是按 tokens/s 的固定單價。對帳見 [昨日、累計和到帳](/learn/how-rewards-work)。",
    ],
    en: [
      "If a recent log still says queued, leave the session running. Read 0 tokens/s together with the time on that sample. The throughput card can be older than the task status the Mac agent reports. A queue is not a crash.",
      "## What the fields mean",
      "- Queue rank comes from the latest still-fresh queued line in the Train at Home log on that Mac. It says where you stood at that moment. It does not say how many minutes remain.",
      "- tokens/s or tokens/hour is the throughput on the official run panel. After the sample goes stale, a 0 is that old reading. It does not prove the process has exited.",
      "- Online or contributing on the project card comes from a separate report and can use a different clock. When the two disagree, compare times. “Not on the roster yet” is not the same as the Mac being off.",
      "## What to inspect",
      "- On that Mac, confirm training is still on. In the official app, clicking Start training again leaves the current run.",
      "- Write down the run ID, the app version, and the time on the queued line. A queue line from more than about five minutes ago is not the current rank.",
      "- Open [IOTA monitoring](/projects/iota) and compare throughput time with the agent task status on the same saved device. A public Miner ID alone does not show the local queue. That needs a paired Mac agent.",
      "## Which branch to take",
      "- Rank still present, logs still moving, no new exit: keep it on and wait for the next queue or training line. Do not reinstall or change the Miner ID because the rank moved back, CPU looks low, or throughput is 0.",
      "- More free seats on the network still do not mean the next seat is yours. Entry depends on that run’s conditions and your eligibility. Tiers and layers are separated in [tiers and layers](/learn/iota-run-tiers).",
      "- The button is Start training again, a new exit is in the log, or the agent says the worker stopped: use [stop and auto-recovery](/learn/iota-training-stopped-auto-recovery). An official orchestrator reset of a crashed miner is a different action from this site restarting the Mac app.",
      "## Illustrative case",
      "This is a reading example, not a measurement from a machine. At 2:10 p.m. the log says queued at rank 40. At 2:14 p.m. monitoring still shows 0 tokens/s with a sample time of 1:40 p.m. Keep waiting. If at 2:20 p.m. the button is Start training, the 2:18 p.m. log has an exit, and no newer queue line follows, treat it as a stop.",
      "## Limits",
      "- This page cannot shorten the official queue or reserve a seat for one Mac. A queued worker counts as running. The agent treats a stop as process absence and cannot see a stalled worker that is still present. It does not claim fatal errors or leftover workers are fixed here.",
      "- Free includes five saved devices per project. Pro includes 50 saved devices per project. Seeing several miners under one wallet does not use those slots by itself. Saving a separate device record for a worker does. Several sources on the same saved device count once.",
      "- Rewards while queued still follow official scoring inside a run. tokens/s is not a fixed price. Reconcile amounts in [yesterday, lifetime, and payouts](/learn/how-rewards-work).",
    ],
    ko: [
      "최근 로그가 아직 queued이면 세션을 켜 둡니다. 0 tokens/s는 그 표본의 시각과 함께 읽습니다. 처리량 카드는 Mac 에이전트가 보는 작업 상태보다 오래될 수 있습니다. 대기는 충돌이 아닙니다.",
      "## 칸이 의미하는 것",
      "- 대기 순번은 그 Mac의 Train at Home 로그에서 아직 유효한 최근 queued 줄입니다. 그 시각의 위치일 뿐, 남은 분은 아닙니다.",
      "- tokens/s 또는 tokens/hour는 공식 실행 패널의 처리량입니다. 표본이 오래되면 0은 그 옛 값입니다. 프로세스가 끝났다는 뜻이 아닙니다.",
      "- 프로젝트 카드의 온라인·기여는 다른 보고이며 시계가 다를 수 있습니다. 둘이 다르면 시각을 각각 봅니다. 명단에 잠시 없는 것은 Mac이 꺼진 것과 다릅니다.",
      "## 무엇을 볼지",
      "- 그 Mac에서 훈련이 아직 켜져 있는지 확인합니다. 공식 앱에서 Start training을 다시 누르면 현재 run에서 나갑니다.",
      "- run ID, 앱 버전, queued 줄의 시각을 적습니다. 약 5분이 지난 대기 줄은 현재 순번이 아닙니다.",
      "- [IOTA 모니터](/projects/iota)에서 같은 저장 기기의 처리량 시각과 에이전트 작업 상태를 비교합니다. 공개 Miner ID만으로는 로컬 대기열이 보이지 않습니다. 페어링한 Mac 에이전트가 필요합니다.",
      "## 어느 쪽으로 갈지",
      "- 순번이 있고 로그가 움직이며 새 종료가 없으면 켜 두고 다음 대기·훈련 줄을 기다립니다. 순번이 밀리거나 CPU가 낮거나 처리량이 0이라고 재설치하거나 Miner ID를 바꾸지 않습니다.",
      "- 네트워크 빈자리가 늘어도 다음 자리가 내 것은 아닙니다. 참여는 그 run의 조건과 자격에 따릅니다. 등급과 layer는 [등급과 레이어](/learn/iota-run-tiers)에서 구분합니다.",
      "- 버튼이 Start training으로 돌아오거나, 로그에 새 종료가 있거나, 에이전트가 워커 중지를 보고하면 [중지와 자동 복구](/learn/iota-training-stopped-auto-recovery)로 갑니다. 공식 오케스트레이터의 충돌 노드 재설정과, 이 사이트가 Mac 앱을 다시 여는 일은 다릅니다.",
      "## 읽는 예시",
      "측정이 아닌 읽기 예시입니다. 오후 2:10 로그는 queued, 순번 40입니다. 오후 2:14 모니터의 tokens/s는 여전히 0이고 표본 시각은 1:40입니다. 기다립니다. 오후 2:20에 버튼이 Start training이고, 2:18 로그에 종료가 있으며 그 뒤 새 대기 줄이 없으면 중지로 봅니다.",
      "## 한계",
      "- 이 페이지는 공식 대기열을 줄이거나 한 Mac의 자리를 예약하지 않습니다. 대기 중인 워커는 실행 중입니다. 에이전트는 프로세스가 없을 때만 중지로 보며, 프로세스가 남은 채 멈춘 상태는 보지 못합니다. 치명 오류나 남은 프로세스가 여기서 고쳐졌다고 하지 않습니다.",
      "- 무료는 프로젝트마다 저장 기기 5대, Pro는 50대입니다. 지갑 아래에서 여러 채굴자가 보여도 그 자체로 자리를 쓰지 않습니다. 워커를 별도의 저장 기기 기록으로 만들면 각 1대입니다. 같은 저장 기기의 여러 출처는 한 번만 셉니다.",
      "- 대기 중 보상도 실행 안의 공식 점수를 따릅니다. tokens/s는 고정 단가가 아닙니다. 금액은 [어제·누적·지급](/learn/how-rewards-work)에서 맞춥니다.",
    ],
    ja: [
      "新しいログがまだ queued なら、セッションは動かしたままにします。0 tokens/s はそのサンプルの時刻と一緒に読みます。処理量カードは、Mac の Agent が見ている作業状態より古いことがあります。待機はクラッシュではありません。",
      "## 項目の意味",
      "- 待機順位は、その Mac の Train at Home ログでまだ有効な最新の queued 行です。その時点の位置であり、残り何分かは分かりません。",
      "- tokens/s または tokens/hour は公式の実行パネルの処理量です。サンプルが古くなると、0 はその古い値です。プロセスが終了した証明にはなりません。",
      "- プロジェクトカードのオンラインや貢献は別の報告で、時計が違うことがあります。食い違うときは時刻を別々に見ます。名簿にまだ無いことは、Mac の電源が切れていることと同じではありません。",
      "## 確認すること",
      "- その Mac で学習がまだオンか確認します。公式アプリでは Start training をもう一度押すと、今の run から外れます。",
      "- run ID、アプリの版、queued 行の時刻を控えます。約5分より前の待機行は、今の順位ではありません。",
      "- [IOTAモニター](/projects/iota)で、同じ保存済み機器の処理量の時刻と Agent の作業状態を比べます。公開 Miner ID だけではローカルの待ち行列は出ません。ペアリングした Mac Agent が必要です。",
      "## どの分岐か",
      "- 順位があり、ログが動き、新しい終了がなければオンのまま次の待機または学習の行を待ちます。順位が下がった、CPU が低い、処理量が 0、という理由で再インストールしたり Miner ID を替えたりしません。",
      "- 全体の空きが増えても、次の席が自分のものとは限りません。参加はその run の条件と資格によります。階層と layer は [階層とレイヤー](/learn/iota-run-tiers) で分けて読みます。",
      "- ボタンが Start training に戻る、ログに新しい終了が出る、Agent がワーカー停止を示す、のいずれなら [停止と自動復旧](/learn/iota-training-stopped-auto-recovery) に進みます。公式オーケストレータがクラッシュしたノードをリセットすることと、当サイトが Mac のアプリを開き直すことは別です。",
      "## 読み方の例",
      "実測ではなく読み方の例です。午後2:10のログは queued、順位40。午後2:14のモニターは tokens/s が 0 のまま、取得時刻は1:40。待ちます。午後2:20にボタンが Start training で、2:18のログに終了があり、その後に新しい待機行がなければ停止として扱います。",
      "## できないこと",
      "- このページは公式の待ち行列を短くせず、一台の Mac の席も確保しません。待機中のワーカーは稼働中です。Agent はプロセスが無いことだけを停止とみなし、プロセスが残ったまま止まった状態は分かりません。致命的なエラーや残ったプロセスがここで直ったとは言いません。",
      "- 無料はプロジェクトごとに保存済み機器5台、Pro は50台です。一つのウォレットの下に複数のマイナーが見えても、それだけでは枠を使いません。ワーカーを別の保存済み機器として残すと、それぞれ1台です。同じ保存済み機器の複数の出所は1回だけ数えます。",
      "- 待機中の報酬も実行内の公式スコアに従います。tokens/s は固定単価ではありません。数量は [昨日・累計・着金](/learn/how-rewards-work) で照合します。",
    ],
  },
  questions: {
    zh: [
      {
        question: "0 tokens/s 是不是已经坏了？",
        answer:
          "先看采样时间。样本已经旧时，0 只是上一次读数。近期日志仍是排队时，保持训练开启，不要把旧的 0 当成重启理由。",
      },
      {
        question: "全网有空位，为什么我还在排队？",
        answer:
          "空位是各任务加在一起的数量，不是你这台机器一定能进入的名额。能否加入取决于这次运行的条件和资格，名次也不能换成等待分钟。",
      },
      {
        question: "什么时候才该重启？",
        answer:
          "训练按钮回到 Start training、日志出现新的退出，或 Agent 显示训练进程已停时，再按停止与恢复处理。仍在排队时不要反复重启。",
      },
    ],
    "zh-TW": [
      {
        question: "0 tokens/s 是不是已經壞了？",
        answer:
          "先看取樣時間。樣本已經舊時，0 只是上一次讀數。近期日誌仍是排隊時，保持訓練開啟，不要把舊的 0 當成重啟理由。",
      },
      {
        question: "全網有空位，為什麼我還在排隊？",
        answer:
          "空位是各任務加在一起的數量，不是你這台機器一定能進入的名額。能否加入取決於這次運行的條件和資格，名次也不能換成等待分鐘。",
      },
      {
        question: "什麼時候才該重啟？",
        answer:
          "訓練按鈕回到 Start training、日誌出現新的退出，或 Agent 顯示訓練程序已停時，再按停止與恢復處理。仍在排隊時不要反覆重啟。",
      },
    ],
    en: [
      {
        question: "Does 0 tokens/s mean it is broken?",
        answer:
          "Read the sample time first. When the sample is old, 0 is the previous reading. If a recent log still says queued, keep training on. An old zero is not a reason to restart.",
      },
      {
        question: "Why am I queued when the network has free seats?",
        answer:
          "Free seats are a total across runs, not a seat this Mac is guaranteed to enter. Entry depends on that run’s conditions and your eligibility. Rank is not a number of minutes.",
      },
      {
        question: "When should I restart?",
        answer:
          "Restart only after the button is Start training again, a new exit is in the log, or the agent says the worker stopped. Do not restart in a loop while the machine is still queued.",
      },
    ],
    ko: [
      {
        question: "0 tokens/s는 고장을 뜻하나요?",
        answer:
          "표본 시각을 먼저 봅니다. 표본이 오래되면 0은 이전 값입니다. 최근 로그가 아직 대기이면 훈련을 켜 둡니다. 오래된 0은 재시작 이유가 아닙니다.",
      },
      {
        question: "빈자리가 있는데 왜 대기인가요?",
        answer:
          "빈자리는 여러 실행의 합계이며, 이 Mac이 반드시 들어가는 자리가 아닙니다. 참여는 그 실행의 조건과 자격에 따릅니다. 순번은 남은 분이 아닙니다.",
      },
      {
        question: "언제 재시작하나요?",
        answer:
          "버튼이 다시 Start training이거나, 로그에 새 종료가 있거나, 에이전트가 워커 중지를 알릴 때 중지·복구로 갑니다. 대기 중에는 재시작을 반복하지 않습니다.",
      },
    ],
    ja: [
      {
        question: "0 tokens/s は故障ですか？",
        answer:
          "取得時刻を先に見ます。サンプルが古ければ 0 は前回の値です。新しいログがまだ待機なら学習はオンのままです。古い 0 は再起動の理由になりません。",
      },
      {
        question: "全体に空きがあるのに待つのはなぜですか？",
        answer:
          "空きは各実行の合計で、この Mac が必ず入れる席ではありません。参加はその実行の条件と資格によります。順位は待ち分数ではありません。",
      },
      {
        question: "いつ再起動しますか？",
        answer:
          "ボタンが Start training に戻る、ログに新しい終了が出る、Agent がワーカー停止を示す、のいずれかのあとで停止と復旧に進みます。待機中に再起動を繰り返しません。",
      },
    ],
  },
};

const recovery: Article = {
  slug: "iota-training-stopped-auto-recovery",
  project: "iota",
  modified: "2026-10-24",
  topic: {
    zh: "停止与自动恢复",
    "zh-TW": "停止與自動恢復",
    en: "Stop and auto-recovery",
    ko: "중지와 자동 복구",
    ja: "停止と自動復旧",
  },
  title: {
    zh: "IOTA 训练停止但窗口还在：检查与自动恢复",
    "zh-TW": "IOTA 訓練停止但視窗還在：檢查與自動恢復",
    en: "IOTA training stopped but the app is open: check and recover",
    ko: "IOTA 창은 열려 있는데 훈련이 멈춤: 확인과 자동 복구",
    ja: "IOTAの画面は開いたまま学習が止まった：確認と自動復旧",
  },
  description: {
    zh: "窗口还在不等于正在训练。先看训练按钮、新日志和吞吐时间。自动恢复默认关闭，不需要 Pro；你在网站上点停止后，它不会再把训练拉起来。",
    "zh-TW":
      "視窗還在不等於正在訓練。先看訓練按鈕、新日誌和吞吐時間。自動恢復預設關閉，不需要 Pro；你在網站上點停止後，它不會再把訓練拉起來。",
    en: "An open window is not proof of training. Check the button, fresh logs, and throughput time. Auto-recovery is off by default and does not need Pro. A Stop from the site will not start training again.",
    ko: "창이 열려 있다고 훈련 중이 아닙니다. 버튼, 최근 로그, 처리량 시각을 봅니다. 자동 복구는 기본 꺼짐이며 Pro가 필요 없습니다. 사이트에서 중지를 누르면 다시 켜지 않습니다.",
    ja: "画面が開いていることは学習中の証明ではありません。ボタン、新しいログ、処理量の時刻を見ます。自動復旧は初期オフで Pro は不要です。サイトで停止すると、訓練を再び起動しません。",
  },
  summary: {
    zh: "确认训练进程停了再恢复。排队、日志还在走、或只是窗口留着，都不要当成崩溃去反复重启。两次自动尝试至少隔 15 分钟。",
    "zh-TW":
      "確認訓練程序停了再恢復。排隊、日誌還在走、或只是視窗留著，都不要當成崩潰去反覆重啟。兩次自動嘗試至少隔 15 分鐘。",
    en: "Recover only after the worker has stopped. A queue, moving logs, or a leftover window is not a crash to restart in a loop. Automatic attempts are at least 15 minutes apart.",
    ko: "워커가 멈춘 뒤에만 복구합니다. 대기, 움직이는 로그, 남은 창은 반복 재시작의 이유가 아닙니다. 자동 시도 간격은 최소 15분입니다.",
    ja: "ワーカーが止まってから復旧します。待機、動いているログ、残った画面は、繰り返す再起動の理由になりません。自動の試行は最低15分空けます。",
  },
  sources: [
    {
      name: "Macrocosmos · Train at Home user guide",
      url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
    },
    {
      name: "Macrocosmos · Scoring, Rewards & Kicking",
      url: "https://docs.macrocosmos.ai/subnets/subnet-9-iota/scoring-rewards-and-kicking",
    },
    {
      name: "IOTA Watch · Mac agent",
      url: "https://github.com/molimao/iota/blob/main/scripts/device-agent/iota_watch_agent.py",
    },
  ],
  related: ["iota-queue-and-zero-throughput", "how-rewards-work", "iota-run-tiers"],
  decision: {
    title: {
      zh: "先确认停了，再决定谁来启动",
      "zh-TW": "先確認停了，再決定誰來啟動",
      en: "Confirm the stop, then choose who starts it",
      ko: "중지를 확인한 뒤 누가 시작할지 정함",
      ja: "停止を確認してから、誰が起動するかを決める",
    },
    action: {
      zh: "[打开 IOTA 监控](/projects/iota) · [排队时不要重启](/learn/iota-queue-and-zero-throughput)",
      "zh-TW":
        "[開啟 IOTA 監控](/projects/iota) · [排隊時不要重啟](/learn/iota-queue-and-zero-throughput)",
      en: "[Open IOTA monitoring](/projects/iota) · [Do not restart a queue](/learn/iota-queue-and-zero-throughput)",
      ko: "[IOTA 모니터](/projects/iota) · [대기 중에는 재시작하지 않기](/learn/iota-queue-and-zero-throughput)",
      ja: "[IOTAモニター](/projects/iota) · [待機中は再起動しない](/learn/iota-queue-and-zero-throughput)",
    },
  },
  comparisonTitle: {
    zh: "现象和下一步",
    "zh-TW": "現象和下一步",
    en: "What you see and the next step",
    ko: "보이는 것과 다음 단계",
    ja: "見える状態と次の一手",
  },
  comparison: {
    zh: {
      headers: ["现象", "下一步"],
      rows: [
        [
          "按钮回到 Start training",
          "应用里点停止不会被单独识别。自动恢复开着时，进程缺大约两分钟后仍可能拉起。想保持停止，先关掉自动恢复，或用网站停止（会关掉自动恢复）。",
        ],
        [
          "窗口还在，约两分钟没有训练进程，恢复已打开",
          "Agent 可以尝试拉起。两次尝试至少隔 15 分钟。",
        ],
        ["仍在排队或日志继续出现新的进度", "不要恢复。排队算正在运行。"],
        ["启动失败或处于冷却", "看这台 Mac 的设置和本机日志，不要连续发送重启。"],
      ],
    },
    "zh-TW": {
      headers: ["現象", "下一步"],
      rows: [
        [
          "按鈕回到 Start training",
          "應用程式裡點停止不會被單獨辨識。自動恢復開著時，程序缺大約兩分鐘後仍可能拉起。想保持停止，先關掉自動恢復，或用網站停止（會關掉自動恢復）。",
        ],
        [
          "視窗還在，約兩分鐘沒有訓練程序，恢復已打開",
          "Agent 可以嘗試拉起。兩次嘗試至少隔 15 分鐘。",
        ],
        ["仍在排隊或日誌繼續出現新的進度", "不要恢復。排隊算正在運行。"],
        ["啟動失敗或處於冷卻", "看這台 Mac 的設定和本機日誌，不要連續傳送重啟。"],
      ],
    },
    en: {
      headers: ["What you see", "Next step"],
      rows: [
        [
          "The button is Start training again",
          "A stop inside the app is not detected as intentional. With auto-recovery on, a missing worker for about two minutes can still relaunch. To stay stopped, turn auto-recovery off first, or use Stop on the site, which turns it off.",
        ],
        [
          "The window is open, the worker has been missing for about two minutes, and recovery is on",
          "The agent may relaunch it. Attempts are at least 15 minutes apart.",
        ],
        [
          "Still queued, or the log keeps adding progress",
          "Do not recover. A queued worker counts as running.",
        ],
        [
          "Launch failed or a cooldown is active",
          "Read that Mac’s settings and local log. Do not send Restart again and again.",
        ],
      ],
    },
    ko: {
      headers: ["보이는 것", "다음 단계"],
      rows: [
        [
          "버튼이 다시 Start training",
          "앱 안의 중지는 의도한 정지로 구분되지 않습니다. 자동 복구가 켜져 있으면 워커가 약 2분 없을 때 다시 뜰 수 있습니다. 멈춘 채로 두려면 먼저 자동 복구를 끄거나, 자동 복구를 끄는 사이트의 중지를 씁니다.",
        ],
        [
          "창은 있고, 약 2분 동안 훈련 프로세스가 없으며, 복구가 켜짐",
          "에이전트가 다시 띄울 수 있습니다. 시도 간격은 최소 15분입니다.",
        ],
        ["아직 대기이거나 로그에 진행이 계속 쌓임", "복구하지 않습니다. 대기는 실행 중입니다."],
        [
          "시작 실패 또는 대기 시간",
          "그 Mac의 설정과 로컬 로그를 봅니다. 재시작을 연속으로 보내지 않습니다.",
        ],
      ],
    },
    ja: {
      headers: ["見えていること", "次の一手"],
      rows: [
        [
          "ボタンが Start training に戻った",
          "アプリ内の停止は意図した停止としては区別されません。自動復旧がオンなら、ワーカーが約2分無いと再び起動することがあります。止めたままにするには、先に自動復旧を切るか、自動復旧を切るサイトの停止を使います。",
        ],
        [
          "画面は開いたまま、約2分ワーカーがなく、復旧がオン",
          "Agent が起動を試みることがあります。試行は最低15分空けます。",
        ],
        ["まだ待機、またはログに進捗が増えている", "復旧しません。待機は稼働中です。"],
        [
          "起動失敗、またはクールダウン中",
          "その Mac の設定とローカルログを見ます。再起動を連続で送らない。",
        ],
      ],
    },
  },
  body: {
    zh: [
      "窗口还开着，不代表训练还在进行。先确认进程是不是停了。确认之后，才决定手动点 Start training，还是让已配对的 Mac Agent 自动拉起。",
      "## 各信号在说什么",
      "- Start training 再次出现，表示官方应用里这次训练没有处在进行中。再点一次才会重新加入。",
      "- 菜单栏图标或窗口留着，只能说明应用还开着。官方日志在 ~/Library/Logs/IOTA Train at Home，当天文件名类似日期加 -cli.log。",
      "- 自动恢复是 IOTA Watch 在这台 Mac 上的开关，默认关闭，不需要 Pro。它和官方编排器把崩溃节点重置回同一 run、同一 layer 不是同一个动作。官方重置带有退避，而且只有被踢出才真正离开 swarm。",
      "## 先核对这三项",
      "- 看训练按钮，并记下退出前后的日志。把崩溃、断网、内存不足分开，不要只凭窗口还在就判断正常。",
      "- 看退出之后还有没有新的排队或训练进度。仍在排队时不要启动恢复。吞吐时间很旧，也不能单独代替进程是否还在。",
      "- 在 [IOTA 监控](/projects/iota) 打开这台已配对 Mac 的设置，确认自动恢复是开还是关，以及上一次尝试是否还在 15 分钟冷却里。日志上传是另一个开关。",
      "## 谁来启动",
      "- 你在官方应用里点停止：当前检查只看应用和训练进程是否都在，看不出这次是本机按钮主动停的。自动恢复开着时，训练进程缺大约两分钟后仍可能拉起。想一直停着，先关掉自动恢复，或在网站上点停止；网站上的停止会关掉自动恢复。不要把应用里的手动停止当成会被自动放过。",
      "- 你在网站上对这台 Mac 点了停止：这条命令会关掉自动恢复，机器保持停止。以后还要自动拉起，再打开该开关。操作前核对设备名称和 Miner ID 是同一台。",
      "- 恢复已打开，应用或训练进程缺失大约两分钟，且距离上次拉起至少 15 分钟：Agent 会尝试启动。窗口还在、进程不在时走重启训练；应用本身不在时走启动。这一轮失败会记成暂停。之后只要自动恢复仍开着并且心跳成功，冷却结束后还可能再试，没有有限次数上限。这不是连续不停地重试。你可以关掉自动恢复。心跳失败会跳过这一轮。",
      "- 崩溃分析不另收费。Agent 只能控制已配对的 Train at Home Mac，不能控制其他项目或其他系统。",
      "## 一个对照例子",
      "这是读法示例，不是某台机器的实测。2:00 日志出现退出，2:02 窗口仍在，但没有新的训练或排队行，自动恢复为开，上次拉起在 1:40。大约到 2:02 可以尝试一次。若 2:03 显示冷却，要等到距 2:02 至少 15 分钟，而不是马上再发一次重启。若 2:01 仍有新的 queued 行，则整段都不应拉起。",
      "## 做不到的事",
      "- 拉起成功只表示本机应用又开始请求加入，不表示立刻分到任务，也不表示收益不变。收益对账见 [昨日、累计和到账](/learn/how-rewards-work)。",
      "- 本站不能替官方决定是否把你从 layer 移除。低分不会自动踢出；踢出由该 run 的策略决定，初始化阶段不会因表现被踢。",
      "- 仍在排队时的处理见 [排队和 0 tokens/s](/learn/iota-queue-and-zero-throughput)。",
    ],
    "zh-TW": [
      "視窗還開著，不代表訓練還在進行。先確認程序是不是停了。確認之後，才決定手動點 Start training，還是讓已配對的 Mac Agent 自動拉起。",
      "## 各訊號在說什麼",
      "- Start training 再次出現，表示官方應用程式裡這次訓練沒有處在進行中。再點一次才會重新加入。",
      "- 選單列圖示或視窗留著，只能說明應用程式還開著。官方日誌在 ~/Library/Logs/IOTA Train at Home，當天檔名類似日期加 -cli.log。",
      "- 自動恢復是 IOTA Watch 在這台 Mac 上的開關，預設關閉，不需要 Pro。它和官方編排器把崩潰節點重置回同一 run、同一 layer 不是同一個動作。官方重置帶有退避，而且只有被踢出才真正離開 swarm。",
      "## 先核對這三項",
      "- 看訓練按鈕，並記下退出前後的日誌。把崩潰、斷網、記憶體不足分開，不要只憑視窗還在就判斷正常。",
      "- 看退出之後還有沒有新的排隊或訓練進度。仍在排隊時不要啟動恢復。吞吐時間很舊，也不能單獨代替程序是否還在。",
      "- 在 [IOTA 監控](/projects/iota) 打開這台已配對 Mac 的設定，確認自動恢復是開還是關，以及上一次嘗試是否還在 15 分鐘冷卻裡。日誌上傳是另一個開關。",
      "## 誰來啟動",
      "- 你在官方應用程式裡點停止：目前檢查只看應用程式和訓練程序是否都在，看不出這次是本機按鈕主動停的。自動恢復開著時，訓練程序缺大約兩分鐘後仍可能拉起。想一直停著，先關掉自動恢復，或在網站上點停止；網站上的停止會關掉自動恢復。不要把應用程式裡的手動停止當成會被自動放過。",
      "- 你在網站上對這台 Mac 點了停止：這條命令會關掉自動恢復，機器保持停止。以後還要自動拉起，再打開該開關。操作前核對裝置名稱和 Miner ID 是同一台。",
      "- 恢復已打開，應用程式或訓練程序缺失大約兩分鐘，且距離上次拉起至少 15 分鐘：Agent 會嘗試啟動。視窗還在、程序不在時走重啟訓練；應用程式本身不在時走啟動。這一輪失敗會記成暫停。之後只要自動恢復仍開著並且心跳成功，冷卻結束後還可能再試，沒有有限次數上限。這不是連續不停地重試。你可以關掉自動恢復。心跳失敗會跳過這一輪。",
      "- 崩潰分析不另收費。Agent 只能控制已配對的 Train at Home Mac，不能控制其他專案或其他系統。",
      "## 一個對照例子",
      "這是讀法示例，不是某台機器的實測。2:00 日誌出現退出，2:02 視窗仍在，但沒有新的訓練或排隊行，自動恢復為開，上次拉起在 1:40。大約到 2:02 可以嘗試一次。若 2:03 顯示冷卻，要等到距 2:02 至少 15 分鐘，而不是馬上再發一次重啟。若 2:01 仍有新的 queued 行，則整段都不應拉起。",
      "## 做不到的事",
      "- 拉起成功只表示本機應用程式又開始請求加入，不表示立刻分到任務，也不表示收益不變。收益對帳見 [昨日、累計和到帳](/learn/how-rewards-work)。",
      "- 本站不能替官方決定是否把你從 layer 移除。低分不會自動踢出；踢出由該 run 的策略決定，初始化階段不會因表現被踢。",
      "- 仍在排隊時的處理見 [排隊和 0 tokens/s](/learn/iota-queue-and-zero-throughput)。",
    ],
    en: [
      "An open window does not mean training is still running. Confirm the worker has stopped. Then choose a manual Start training or a relaunch from the paired Mac agent.",
      "## What the signals mean",
      "- Start training showing again means this session is not in progress in the official app. Click it when you want to join again.",
      "- A tray icon or a window only means the app is open. Official logs are in ~/Library/Logs/IOTA Train at Home. The day’s file looks like the date plus -cli.log.",
      "- Auto-recovery is an IOTA Watch switch on that Mac. It is off by default and does not need Pro. It is not the official orchestrator reset that sends a crashed miner back to the same run and layer. Official resets use back-off. Only a kick removes the miner from the swarm.",
      "## What to inspect",
      "- Read the training button and the log around the exit. Separate a crash, a network error, and running out of memory. An open window is not “still fine.”",
      "- See whether a new queue or training line follows the exit. Do not recover while queued. An old throughput time does not replace the question of whether the worker is still there.",
      "- In [IOTA monitoring](/projects/iota), open settings for the paired Mac. See whether auto-recovery is on, and whether the last attempt is still inside the 15-minute gap. Log upload is a separate switch.",
      "## Who starts it",
      "- You stopped training inside the official app: the check only looks at whether the app and the worker are both present. It does not see that the local button was intentional. With auto-recovery on, a missing worker for about two minutes can still relaunch. To keep it stopped, turn auto-recovery off first, or use Stop on the site. Site Stop turns auto-recovery off. Do not expect a manual stop in the app to be left alone.",
      "- You pressed Stop for this Mac on the site: that command turns auto-recovery off, so the machine stays stopped. Turn the switch on again if you want automatic relaunch later. Match the device name and Miner ID first.",
      "- Recovery is on, the app or worker has been missing for about two minutes, and at least 15 minutes have passed since the last relaunch: the agent may start it. If the window is still open and the worker is gone, it restarts training. If the app itself is gone, it starts the app. A failed attempt is reported as paused for that cycle. Later successful heartbeats, while recovery stays on, may try again after the cooldown. There is no finite attempt cap. This is not a rapid retry with no gap. You can turn recovery off. A failed heartbeat skips that cycle.",
      "- Crash analysis is free. The agent controls a paired Train at Home Mac only. It does not control other projects or other operating systems.",
      "## Illustrative case",
      "This shows how to read the timeline. It is not a measurement from a machine. The log exits at 2:00. At 2:02 the window is still open, with no new training or queue line. Recovery is on, and the previous relaunch was 1:40. One attempt can happen around 2:02. If 2:03 shows a cooldown, wait at least 15 minutes from 2:02. Do not send Restart immediately. If a new queued line exists at 2:01, do not relaunch at all.",
      "## Limits",
      "- A successful relaunch means the Mac app is asking to join again. It does not assign a task immediately, and it does not keep rewards the same. Reconcile amounts in [yesterday, lifetime, and payouts](/learn/how-rewards-work).",
      "- This site does not decide whether you are removed from a layer. A low score does not kick by itself. Kicking follows that run’s policy. A miner still initializing is not performance-kicked.",
      "- If you are still queued, use [queue and 0 tokens/s](/learn/iota-queue-and-zero-throughput).",
    ],
    ko: [
      "창이 열려 있어도 훈련이 이어진다는 뜻은 아닙니다. 워커가 멈췄는지 먼저 확인합니다. 그다음 수동 Start training과 페어링된 Mac 에이전트의 재실행 중 고릅니다.",
      "## 신호가 의미하는 것",
      "- Start training이 다시 보이면 공식 앱에서 이번 세션이 진행 중이 아닙니다. 다시 참여할 때 누릅니다.",
      "- 메뉴 막대 아이콘이나 창은 앱이 열려 있다는 뜻입니다. 공식 로그는 ~/Library/Logs/IOTA Train at Home 에 있고, 그날 파일은 날짜에 -cli.log가 붙습니다.",
      "- 자동 복구는 그 Mac의 IOTA Watch 스위치입니다. 기본 꺼짐이며 Pro가 필요 없습니다. 공식 오케스트레이터가 충돌한 노드를 같은 run·같은 layer로 되돌리는 재설정과는 다릅니다. 공식 재설정에는 백오프가 있고, swarm에서 빠지는 것은 킥뿐입니다.",
      "## 무엇을 볼지",
      "- 훈련 버튼과 종료 전후 로그를 봅니다. 충돌, 네트워크 오류, 메모리 부족을 구분합니다. 창이 열려 있다고 정상은 아닙니다.",
      "- 종료 뒤에 새 대기나 훈련 줄이 있는지 봅니다. 대기 중에는 복구하지 않습니다. 오래된 처리량 시각이 프로세스 생존을 대신하지 않습니다.",
      "- [IOTA 모니터](/projects/iota)에서 페어링된 Mac 설정을 엽니다. 자동 복구가 켜져 있는지, 마지막 시도가 15분 간격 안인지 봅니다. 로그 업로드는 별도 스위치입니다.",
      "## 누가 시작하나",
      "- 공식 앱 안에서 훈련을 멈춘 경우: 검사는 앱과 워커가 모두 있는지만 봅니다. 로컬 버튼이 의도한 중지인지는 구분하지 않습니다. 자동 복구가 켜져 있으면 워커가 약 2분 없을 때 다시 뜰 수 있습니다. 멈춘 채로 두려면 먼저 자동 복구를 끄거나, 사이트의 중지를 씁니다. 사이트의 중지는 자동 복구를 끕니다. 앱 안의 수동 중지가 그대로 존중된다고 보지 않습니다.",
      "- 사이트에서 이 Mac의 중지를 누른 경우: 그 명령이 자동 복구를 끄므로 기기는 멈춘 채로 있습니다. 나중에 자동 재실행을 원하면 스위치를 다시 켭니다. 전에 이름과 Miner ID가 같은 기기인지 확인합니다.",
      "- 복구가 켜져 있고, 앱이나 워커가 약 2분 없으며, 마지막 재실행 후 15분이 지났으면 에이전트가 시작할 수 있습니다. 창은 있고 워커가 없으면 훈련을 다시 시작하고, 앱 자체가 없으면 앱을 켭니다. 실패한 시도는 그 주기에 일시 중지로 보고됩니다. 이후 자동 복구가 켜진 채 하트비트가 성공하면 대기 시간 뒤에 다시 시도할 수 있으며, 유한한 횟수 상한은 없습니다. 간격 없이 빠르게 반복하는 것은 아닙니다. 자동 복구는 끌 수 있습니다. 하트비트 실패는 그 주기를 건너뜁니다.",
      "- 충돌 분석은 무료입니다. 에이전트는 페어링된 Train at Home Mac만 제어합니다. 다른 프로젝트나 다른 운영체제는 제어하지 않습니다.",
      "## 읽는 예시",
      "실측이 아니라 시간선을 읽는 예입니다. 2:00에 로그가 종료됩니다. 2:02에 창은 열려 있고 새 훈련·대기 줄은 없습니다. 복구는 켜져 있고 이전 재실행은 1:40입니다. 2:02 무렵 한 번 시도할 수 있습니다. 2:03에 대기가 보이면 2:02부터 최소 15분을 기다립니다. 바로 재시작을 보내지 않습니다. 2:01에 새 queued 줄이 있으면 아예 다시 띄우지 않습니다.",
      "## 한계",
      "- 재실행이 성공해도 이 Mac 앱이 다시 참여를 요청한다는 뜻입니다. 작업이 바로 배정되거나 보상이 같게 유지되지는 않습니다. 금액은 [어제·누적·지급](/learn/how-rewards-work)에서 맞춥니다.",
      "- 이 사이트가 layer에서 제거할지 정하지 않습니다. 낮은 점수만으로 킥되지 않습니다. 킥은 그 run의 정책을 따릅니다. 초기화 중인 마이너는 성능 킥 대상이 아닙니다.",
      "- 아직 대기이면 [대기와 0 tokens/s](/learn/iota-queue-and-zero-throughput)를 봅니다.",
    ],
    ja: [
      "画面が開いていても、学習が続いていることにはなりません。ワーカーが止まったかを先に確認します。そのあと、手動の Start training か、ペアリング済み Mac Agent の再起動かを選びます。",
      "## 合図の意味",
      "- Start training が再び出ているのは、公式アプリで今回のセッションが進行中ではないということです。参加し直すときに押します。",
      "- メニューバーのアイコンや画面は、アプリが開いていることだけを示します。公式ログは ~/Library/Logs/IOTA Train at Home にあり、当日のファイルは日付に -cli.log が付きます。",
      "- 自動復旧は、その Mac 上の IOTA Watch のスイッチです。初期はオフで、Pro は不要です。公式オーケストレータがクラッシュしたノードを同じ run・同じ layer に戻すリセットとは別です。公式のリセットにはバックオフがあり、swarm から外れるのはキックだけです。",
      "## 確認すること",
      "- 学習ボタンと、終了の前後のログを見ます。クラッシュ、通信エラー、メモリ不足を分けます。画面が開いているだけでは正常ではありません。",
      "- 終了のあとに新しい待機や学習の行があるかを見ます。待機中は復旧しません。古い処理量の時刻は、ワーカーがまだいるかどうかの代わりになりません。",
      "- [IOTAモニター](/projects/iota)でペアリング済み Mac の設定を開きます。自動復旧がオンか、直前の試行が15分の間隔の中かを見ます。ログ送信は別のスイッチです。",
      "## 誰が起動するか",
      "- 公式アプリの中で学習を止めた場合: 確認するのはアプリとワーカーが両方いるかどうかだけで、ローカルのボタンが意図した停止かは分かりません。自動復旧がオンなら、ワーカーが約2分無いと再び起動することがあります。止めたままにするには、先に自動復旧を切るか、サイトの停止を使います。サイトの停止は自動復旧を切ります。アプリ内の手動停止が自動的に尊重されるとは考えないでください。",
      "- サイトでこの Mac の停止を押した場合: そのコマンドが自動復旧を切るので、機器は止まったままです。あとで自動の再起動が必要ならスイッチを入れ直します。操作前に名前と Miner ID が同じ機器か確認します。",
      "- 復旧がオンで、アプリまたはワーカーが約2分なく、前回の起動から15分以上たっているとき、Agent は起動を試みます。画面が残りワーカーが無ければ学習を再起動し、アプリ自体がなければアプリを起動します。失敗した試行はその回を一時停止として報告します。その後も自動復旧がオンで応答が成功すれば、待ち時間のあと再び試すことがあり、有限の回数上限はありません。間隔なしの連続再試行ではありません。自動復旧は切れます。応答の失敗はその回を飛ばします。",
      "- クラッシュ分析は無料です。Agent が制御するのはペアリング済みの Train at Home の Mac だけです。他のプロジェクトや他の OS は制御しません。",
      "## 読み方の例",
      "実測ではなく、時刻の読み方です。2:00にログが終了します。2:02に画面は開いたままで、新しい学習や待機の行はありません。復旧はオン、前回の起動は1:40です。2:02ごろに1回試みられます。2:03にクールダウンが出たら、2:02から最低15分待ちます。すぐ再起動を送りません。2:01に新しい queued 行があれば、起動しません。",
      "## できないこと",
      "- 起動に成功しても、この Mac のアプリが参加を再び頼んだという意味です。タスクがすぐ割り当てられることや、報酬が同じままであることにはなりません。数量は [昨日・累計・着金](/learn/how-rewards-work) で照合します。",
      "- 当サイトは layer から外すかどうかを決めません。低いスコアだけではキックされません。キックはその run の方針に従います。初期化中のマイナーは性能キックの対象になりません。",
      "- まだ待機なら [待機と 0 tokens/s](/learn/iota-queue-and-zero-throughput) を見てください。",
    ],
  },
  questions: {
    zh: [
      {
        question: "窗口还在，是不是就不用管？",
        answer:
          "不用。窗口只说明应用开着。要看训练按钮是否回到 Start training，以及退出之后还有没有新的排队或训练记录。",
      },
      {
        question: "自动恢复为什么没有马上拉起？",
        answer:
          "它默认关闭。打开后，也要训练进程大约缺失两分钟，并且距离上次尝试至少 15 分钟。排队中的进程算正在运行，不会触发。网站上的停止会关掉开关。应用里的停止不会被单独跳过：开关仍开着时，进程缺失后仍可能拉起。失败的一轮记成暂停；之后心跳成功且开关仍开，冷却后还可能再试，没有次数上限，也不是连续不停地重试。",
      },
      {
        question: "这和官方把节点重置回去一样吗？",
        answer:
          "不一样。本站是在已配对的 Mac 上重新打开 Train at Home。官方编排器可以把崩溃或失联的矿工重置回同一 run 和 layer，并使用退避。只有踢出才会离开 swarm。",
      },
    ],
    "zh-TW": [
      {
        question: "視窗還在，是不是就不用管？",
        answer:
          "不用。視窗只說明應用程式開著。要看訓練按鈕是否回到 Start training，以及退出之後還有沒有新的排隊或訓練紀錄。",
      },
      {
        question: "自動恢復為什麼沒有馬上拉起？",
        answer:
          "它預設關閉。打開後，也要訓練程序大約缺失兩分鐘，並且距離上次嘗試至少 15 分鐘。排隊中的程序算正在運行，不會觸發。網站上的停止會關掉開關。應用程式裡的停止不會被單獨跳過：開關仍開著時，程序缺失後仍可能拉起。失敗的一輪記成暫停；之後心跳成功且開關仍開，冷卻後還可能再試，沒有次數上限，也不是連續不停地重試。",
      },
      {
        question: "這和官方把節點重置回去一樣嗎？",
        answer:
          "不一樣。本站是在已配對的 Mac 上重新打開 Train at Home。官方編排器可以把崩潰或失聯的礦工重置回同一 run 和 layer，並使用退避。只有踢出才會離開 swarm。",
      },
    ],
    en: [
      {
        question: "If the window is open, can I ignore it?",
        answer:
          "No. The window only means the app is open. Check whether the button is Start training again, and whether any new queue or training line follows the exit.",
      },
      {
        question: "Why did auto-recovery not relaunch immediately?",
        answer:
          "It is off by default. When it is on, the worker must be missing for about two minutes, and at least 15 minutes must have passed since the last attempt. A queued worker counts as running and does not trigger it. Stop on the site turns the switch off. A stop inside the app is not skipped on its own: if the switch stays on, a missing worker can still relaunch. A failed cycle is reported as paused. Later successful heartbeats, with the switch still on, may try again after the cooldown. There is no attempt cap, and it is not a rapid retry with no gap.",
      },
      {
        question: "Is this the same as the official reset?",
        answer:
          "No. This site relaunches Train at Home on a paired Mac. The official orchestrator can reset a crashed or disconnected miner onto the same run and layer, with back-off. Only a kick removes the miner from the swarm.",
      },
    ],
    ko: [
      {
        question: "창이 열려 있으면 그대로 두나요?",
        answer:
          "아닙니다. 창은 앱이 열려 있다는 뜻입니다. 버튼이 다시 Start training인지, 종료 뒤에 새 대기나 훈련 줄이 있는지를 봅니다.",
      },
      {
        question: "자동 복구가 바로 실행되지 않는 이유는?",
        answer:
          "기본 꺼짐입니다. 켜도 워커가 약 2분 없고, 마지막 시도 후 15분이 지나야 합니다. 대기 중인 워커는 실행 중이라 실행하지 않습니다. 사이트의 중지는 스위치를 끕니다. 앱 안의 중지는 따로 건너뛰지 않습니다. 스위치가 켜져 있으면 워커가 없을 때 다시 뜰 수 있습니다. 실패한 주기는 일시 중지로 보고됩니다. 이후 하트비트가 성공하고 스위치가 켜져 있으면 대기 뒤에 다시 시도할 수 있습니다. 횟수 상한은 없고, 간격 없는 빠른 재시도도 아닙니다.",
      },
      {
        question: "공식 리셋과 같은가요?",
        answer:
          "다릅니다. 이 사이트는 페어링된 Mac에서 Train at Home을 다시 엽니다. 공식 오케스트레이터는 충돌·단절된 마이너를 같은 run과 layer로 되돌리며 백오프를 씁니다. swarm에서 빠지는 것은 킥뿐입니다.",
      },
    ],
    ja: [
      {
        question: "画面が開いていれば放ってよいですか？",
        answer:
          "いいえ。画面はアプリが開いていることだけです。ボタンが Start training に戻ったか、終了のあとに新しい待機や学習の行があるかを見ます。",
      },
      {
        question: "自動復旧がすぐ動かないのはなぜですか？",
        answer:
          "初期はオフです。オンでも、ワーカーが約2分なく、前回の試行から15分以上たっている必要があります。待機中のワーカーは稼働中なので動きません。サイトの停止はスイッチを切ります。アプリ内の停止は単独では飛ばされません。スイッチがオンのままなら、ワーカーが無いと再び起動することがあります。失敗した回は一時停止と報告されます。その後、応答が成功しスイッチがオンなら、待ち時間のあと再び試すことがあります。回数の上限はなく、間隔なしの連続再試行でもありません。",
      },
      {
        question: "公式のリセットと同じですか？",
        answer:
          "違います。当サイトはペアリング済み Mac で Train at Home を開き直します。公式オーケストレータはクラッシュや切断したマイナーを同じ run と layer に戻し、バックオフを使います。swarm から外れるのはキックだけです。",
      },
    ],
  },
};

const rewards: Article = {
  slug: "how-rewards-work",
  project: "iota",
  modified: "2026-10-24",
  topic: {
    zh: "昨日、累计和到账",
    "zh-TW": "昨日、累計和到帳",
    en: "Yesterday, lifetime, and payouts",
    ko: "어제, 누적, 지급",
    ja: "昨日、累計、着金",
  },
  title: {
    zh: "IOTA 昨日收益、累计与到账：邮件和网页怎么对账？",
    "zh-TW": "IOTA 昨日收益、累計與到帳：郵件和網頁怎麼對帳？",
    en: "IOTA rewards explained: reconcile yesterday, lifetime and payouts",
    ko: "IOTA 보상: 어제·누적·지급을 메일과 웹에서 맞추기",
    ja: "IOTA報酬: 昨日・累計・着金をメールと画面で合わせる",
  },
  description: {
    zh: "先对同一天的 IOTA 数量，再看美元。本站把次日记账归到北京时间的前一天，邮件和网页用同一口径。累计用 Total Earned，不要再加 Total Paid。",
    "zh-TW":
      "先對同一天的 IOTA 數量，再看美元。本站把次日記帳歸到前一天（UTC+8），郵件和網頁用同一口徑。累計用 Total Earned，不要再加 Total Paid。",
    en: "Match the IOTA amount for the same date before comparing dollars. The site attributes the next accounting day to the previous date in UTC+8. Email and the site use that same date. Lifetime is Total Earned.",
    ko: "같은 날짜의 IOTA 수량을 먼저 맞추고 달러를 봅니다. 사이트는 다음 날 정산 기록을 UTC+8의 전날로 둡니다. 메일과 웹은 같은 날짜입니다. 누적은 Total Earned입니다.",
    ja: "同じ日の IOTA 数量を先に合わせ、そのあとドルを見ます。サイトは翌記帳日を UTC+8 の前日に置きます。メールと画面は同じ日付です。累計は Total Earned です。",
  },
  summary: {
    zh: "本站 IOTA 的「昨日收益」使用次日记账记录，按北京时间归属到前一天。例如 10 月 17 日读取的当天记录显示为 10 月 16 日收益；只合计 pending、settled，排除 frozen 及未来时间戳。这是本站展示口径，不证明每笔记录对应的实际训练发生日，也不代表钱包当天到账。",
    "zh-TW":
      "本站 IOTA「昨日收益」依次日記帳紀錄，以北京時間歸屬到前一天。例如 10 月 17 日讀取當天紀錄顯示為 10 月 16 日收益；只計 pending、settled，排除 frozen 及未來時間。這是展示口徑，不證明實際訓練日，也不代表當日入帳。",
    en: "IOTA Watch labels IOTA as Yesterday's rewards by attributing the next accounting day's records to the preceding date in UTC+8. For example, records dated October 17 appear under October 16. Only pending and settled count; frozen and future timestamps are excluded. This display convention does not prove the actual training date or the date funds reached a wallet.",
    ko: "IOTA Watch의 어제 보상은 다음 날 정산 기록을 UTC+8 기준 전날로 표시합니다. 예를 들어 10월 17일 기록은 10월 16일 보상으로 표시합니다. pending·settled만 합산하고 frozen·미래 기록은 제외합니다. 이는 표시 기준이며 실제 훈련일이나 지갑 수령일을 증명하지 않습니다.",
    ja: "当サイトのIOTA「昨日の報酬」は、翌記帳日の記録をUTC+8で前日に帰属表示します。例えば10月17日の記録は10月16日の報酬です。pending・settledのみ合算し、frozen・未来時刻は除外します。これは表示基準で、実際の学習日や着金日を証明しません。",
  },
  sources: [
    {
      name: "Macrocosmos · Train at Home user guide",
      url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
    },
    {
      name: "Macrocosmos · Scoring, Rewards & Kicking",
      url: "https://docs.macrocosmos.ai/subnets/subnet-9-iota/scoring-rewards-and-kicking",
    },
    { name: "IOTA Watch", url: "https://github.com/molimao/iota" },
  ],
  related: ["iota-queue-and-zero-throughput", "iota-run-tiers", "iota-tier-promotion"],
  decision: {
    title: {
      zh: "先对齐日期和 IOTA 数量",
      "zh-TW": "先對齊日期和 IOTA 數量",
      en: "Match the date and the IOTA amount first",
      ko: "날짜와 IOTA 수량을 먼저 맞추기",
      ja: "日付と IOTA 数量を先に合わせる",
    },
    action: {
      zh: "[打开 IOTA 监控](/projects/iota) · [排队时吞吐为什么是 0](/learn/iota-queue-and-zero-throughput)",
      "zh-TW":
        "[開啟 IOTA 監控](/projects/iota) · [排隊時吞吐為什麼是 0](/learn/iota-queue-and-zero-throughput)",
      en: "[Open IOTA monitoring](/projects/iota) · [Why throughput is 0 while queued](/learn/iota-queue-and-zero-throughput)",
      ko: "[IOTA 모니터](/projects/iota) · [대기 중 처리량이 0인 이유](/learn/iota-queue-and-zero-throughput)",
      ja: "[IOTAモニター](/projects/iota) · [待機中に処理量が 0 の理由](/learn/iota-queue-and-zero-throughput)",
    },
  },
  comparisonTitle: {
    zh: "字段怎么读",
    "zh-TW": "欄位怎麼讀",
    en: "How to read each field",
    ko: "칸을 읽는 법",
    ja: "項目の読み方",
  },
  comparison: {
    zh: {
      headers: ["字段", "含义"],
      rows: [
        [
          "昨日收益",
          "次日的记账记录，按北京时间归到前一天。只加 pending 和 settled，不含 frozen，也不含未来时间。",
        ],
        ["Total Earned", "官方累计已记给这台矿工的数量，含已付和待付。不要再加 Total Paid。"],
        [
          "Total Paid / Total Pending",
          "已付到钱包的数量，以及已记上但还没付的数量。网页上的美元不是这两笔的到账美元。",
        ],
        ["美元", "查看时的市场估值。没有报价就是未知，不会写成 0。"],
      ],
    },
    "zh-TW": {
      headers: ["欄位", "含義"],
      rows: [
        [
          "昨日收益",
          "次日的記帳紀錄，按 UTC+8 歸到前一天。只加 pending 和 settled，不含 frozen，也不含未來時間。",
        ],
        ["Total Earned", "官方累計已記給這台礦工的數量，含已付和待付。不要再加 Total Paid。"],
        [
          "Total Paid / Total Pending",
          "已付到錢包的數量，以及已記上但還沒付的數量。網頁上的美元不是這兩筆的到帳美元。",
        ],
        ["美元", "查看時的市場估值。沒有報價就是未知，不會寫成 0。"],
      ],
    },
    en: {
      headers: ["Field", "Meaning"],
      rows: [
        [
          "Yesterday's rewards",
          "The next accounting day's records, shown on the previous date in UTC+8. Only pending and settled. Frozen and future timestamps are left out.",
        ],
        [
          "Total Earned",
          "The official lifetime credited to this miner, including paid and still pending. Do not add Total Paid again.",
        ],
        [
          "Total Paid / Total Pending",
          "What has been paid to the wallet, and what is credited but not paid yet. Dollars on the site are not those wallet dollars.",
        ],
        [
          "USD",
          "A market estimate at the time you look. No quote stays unknown. It is not written as 0.",
        ],
      ],
    },
    ko: {
      headers: ["항목", "의미"],
      rows: [
        [
          "어제 보상",
          "다음 날 정산 기록을 UTC+8 전날로 표시합니다. pending과 settled만 더하고, frozen과 미래 시각은 빼니다.",
        ],
        [
          "Total Earned",
          "이 채굴자에게 공식으로 기입된 누적입니다. 지급분과 미지급을 포함합니다. Total Paid를 다시 더하지 않습니다.",
        ],
        [
          "Total Paid / Total Pending",
          "지갑으로 지급된 수량과, 기입됐지만 아직 지급되지 않은 수량입니다. 사이트의 달러는 그 입금액이 아닙니다.",
        ],
        ["USD", "볼 때의 시장 추정값입니다. 시세가 없으면 미상이며 0으로 쓰지 않습니다."],
      ],
    },
    ja: {
      headers: ["項目", "意味"],
      rows: [
        [
          "昨日の報酬",
          "翌記帳日の記録を UTC+8 の前日に表示します。pending と settled だけを足し、frozen と未来の時刻は入れません。",
        ],
        [
          "Total Earned",
          "このマイナーに公式に記帳された累計です。支払済みと未払いを含みます。Total Paid を足し直しません。",
        ],
        [
          "Total Paid / Total Pending",
          "ウォレットへ支払済みの数量と、記帳済みで未払いの数量です。画面のドルは着金ドルではありません。",
        ],
        ["USD", "見た時点の市場概算です。価格が無ければ不明で、0 とは書きません。"],
      ],
    },
  },
  body: {
    zh: [
      "邮件和网页对不上时，先比同一天的 IOTA 数量。数量一致之后，美元不同通常只是估价时间不同。数量不一致，再查采集时间和记录状态。",
      "## 日期怎么归",
      "- 本站的「昨日」把次日的记账记录归到前一个北京时间日期。例如记账日是 10 月 22 日的记录，显示在 10 月 21 日。这不是证明训练发生在 21 日，也不是 21 日钱包到账。",
      "- 日报邮件和网页用这个同一归属。两边仍可能因为采集时刻、官方后来修订、或美元估价时刻而看起来不同。",
      "- 应用里的 Total Earned、Total Paid、Total Pending 是另一组官方数字。Total Earned 含已付和待付，所以不要把 Total Paid 再加一次。",
      "## 对账时看什么",
      "- 在 [IOTA 监控](/projects/iota) 记下昨日那一天的 IOTA 数量、采集时间，以及美元是有报价还是未知。",
      "- 打开官方应用左上角 Miner，对照 Total Earned、Total Paid、Total Pending。未连接 coldkey 时训练仍可进行，但奖励不会发给你，之后补连也不会补发连接前的部分。",
      "- 收益按 Miner ID（hotkey）的官方记录相加，同一 Miner ID 不重复计入。这不是矿池那种按钱包地址合并余额。本站「昨日」只加 pending 和 settled，不含 frozen，也不含未来时间。设备名额按已保存设备分别计算：免费每个项目 5 台，Pro 50 台。真实 hotkey 的收益记录会去重；只是在同一钱包下看到多名矿工，本身不占名额。",
      "## 数量不同时怎么分支",
      "- 日期错了一天：先按「记账日的前一天」重对，不要把 22 日的记账和 22 日的「昨日」直接比。",
      "- IOTA 数量仍不同：看是不是一边还没采到、一边含了 frozen，或官方修订了记录。未知不要当成 0。",
      "- 只有美元不同：用当时的估价解释。估价不是官方支付价格，也不是钱包里的美元。",
      "## 一个对照例子",
      "这是说明口径的例子，不是实际收入。记账日 10 月 22 日有 1 IOTA，且状态可计入。本站和当天已发出的日报都把它放在 10 月 21 日。若当时估价是每枚 6 美元，显示 6 美元；稍后估价变成 6.20 美元，数量仍是 1 IOTA，美元变成 6.20。若邮件在记录出现之前就发出，邮件可以少这一笔，网页稍后补上，日期标签仍是 21 日。",
      "## 官方支付和评分边界",
      "- 用户指南写明：支付大约每 24 小时一次，这个窗口以后可能拉长；最低支付大约 0.4 alpha，低于门槛滚到下一次；网络转账费用从你收到的数量里扣；若当前 run 没有改进，支付可能冻结。这些是官方当时的大约值，不是本站承诺的到账日或保底。",
      "- 评分说明：同一 run 里按验证过的分数占比分配，再乘该 run 的 burn 和有效分配。layer 的工作量和矿工数量不同，所以同样努力可以对应不同份额。吞吐不是单价。档位名称也不能代替这个计算，见 [分层](/learn/iota-run-tiers)。",
      "- 仍在排队或 0 tokens/s 时，先分清样本是不是旧的，见 [排队](/learn/iota-queue-and-zero-throughput)。那一页不负责把吞吐换算成昨日收益。",
      "下面的截图摄于 2026-10-09。画面上仍保留当时的「今日」字样，用来显示账本原字段。按本站现在的前一天展示，这条 10 月 9 日的记账记录归在 10 月 8 日。它不是当前界面，不是实时报价，也不是站长本人的收入。",
    ],
    "zh-TW": [
      "郵件和網頁對不上時，先比同一天的 IOTA 數量。數量一致之後，美元不同通常只是估價時間不同。數量不一致，再查採集時間和紀錄狀態。",
      "## 日期怎麼歸",
      "- 本站的「昨日」把次日的記帳紀錄歸到前一個 UTC+8 日期。例如記帳日是 10 月 22 日的紀錄，顯示在 10 月 21 日。這不是證明訓練發生在 21 日，也不是 21 日錢包到帳。",
      "- 日報郵件和網頁用這個同一歸屬。兩邊仍可能因為採集時刻、官方後來修訂、或美元估價時刻而看起來不同。",
      "- 應用程式裡的 Total Earned、Total Paid、Total Pending 是另一組官方數字。Total Earned 含已付和待付，所以不要把 Total Paid 再加一次。",
      "## 對帳時看什麼",
      "- 在 [IOTA 監控](/projects/iota) 記下昨日那一天的 IOTA 數量、採集時間，以及美元是有報價還是未知。",
      "- 打開官方應用程式左上角 Miner，對照 Total Earned、Total Paid、Total Pending。未連接 coldkey 時訓練仍可進行，但獎勵不會發給你，之後補連也不會補發連接前的部分。",
      "- 收益按 Miner ID（hotkey）的官方紀錄相加，同一 Miner ID 不重複計入。這不是礦池那種按錢包地址合併餘額。本站「昨日」只加 pending 和 settled，不含 frozen，也不含未來時間。裝置名額按已儲存裝置分別計算：免費每個專案 5 台，Pro 50 台。真實 hotkey 的收益紀錄會去重；只是在同一錢包下看到多名礦工，本身不佔名額。",
      "## 數量不同時怎麼分支",
      "- 日期錯了一天：先按「記帳日的前一天」重對，不要把 22 日的記帳和 22 日的「昨日」直接比。",
      "- IOTA 數量仍不同：看是不是一邊還沒採到、一邊含了 frozen，或官方修訂了紀錄。未知不要當成 0。",
      "- 只有美元不同：用當時的估價解釋。估價不是官方支付價格，也不是錢包裡的美元。",
      "## 一個對照例子",
      "這是說明口徑的例子，不是實際收入。記帳日 10 月 22 日有 1 IOTA，且狀態可計入。本站和當天已發出的日報都把它放在 10 月 21 日。若當時估價是每枚 6 美元，顯示 6 美元；稍後估價變成 6.20 美元，數量仍是 1 IOTA，美元變成 6.20。若郵件在紀錄出現之前就發出，郵件可以少這一筆，網頁稍後補上，日期標籤仍是 21 日。",
      "## 官方支付和評分邊界",
      "- 使用者指南寫明：支付大約每 24 小時一次，這個窗口以後可能拉長；最低支付大約 0.4 alpha，低於門檻滾到下一次；網路轉帳費用從你收到的數量裡扣；若目前 run 沒有改進，支付可能凍結。這些是官方當時的大約值，不是本站承諾的到帳日或保底。",
      "- 評分說明：同一 run 裡按驗證過的分數占比分配，再乘該 run 的 burn 和有效分配。layer 的工作量和礦工數量不同，所以同樣努力可以對應不同份額。吞吐不是單價。檔位名稱也不能代替這個計算，見 [分層](/learn/iota-run-tiers)。",
      "- 仍在排隊或 0 tokens/s 時，先分清樣本是不是舊的，見 [排隊](/learn/iota-queue-and-zero-throughput)。那一頁不負責把吞吐換算成昨日收益。",
      "下面的截圖攝於 2026-10-09。畫面上仍保留當時的「今日」字樣，用來顯示帳本原欄位。按本站現在的前一天展示，這筆 10 月 9 日的記帳紀錄歸在 10 月 8 日。它不是目前介面，不是即時報價，也不是站長本人的收入。",
    ],
    en: [
      "When email and the site disagree, compare the IOTA amount on the same date. If the amount matches, a different dollar figure is usually a different quote time. If the amount does not match, check capture time and record status.",
      "## How the date is assigned",
      "- Yesterday on this site places the next accounting day’s records on the previous date in UTC+8. Records dated October 22 appear under October 21. That does not prove training happened on the 21st, and it does not mean the wallet was paid on the 21st.",
      "- The daily email and the site use that same assignment. They can still differ because of capture time, a later official revision, or the moment the dollar estimate was taken.",
      "- Total Earned, Total Paid, and Total Pending in the app are a separate official set. Total Earned already includes paid and pending, so do not add Total Paid on top.",
      "## What to inspect",
      "- In [IOTA monitoring](/projects/iota), note the IOTA amount for that yesterday, the capture time, and whether USD is a quote or unknown.",
      "- Open Miner at the top left of the official app and compare Total Earned, Total Paid, and Total Pending. Training can run without a coldkey. Rewards are not delivered until you connect one, and connecting later does not pay the earlier unconnected portion.",
      "- Rewards are summed per Miner ID from the official records. The same Miner ID is not included twice. This is not a pool-style balance merged by wallet address. Yesterday on this site adds pending and settled only, and leaves out frozen and future timestamps. The device quota counts distinct saved devices: five per project on Free, 50 on Pro. Real hotkey reward records are deduplicated. Seeing several miners under one wallet does not use a slot unless you save a separate device record.",
      "## Which branch to take",
      "- The dates are one day apart: line up “the day before the accounting date.” Do not compare an October 22 accounting record with October 22’s Yesterday.",
      "- The IOTA amount still differs: one side may not have captured the record yet, one side may include frozen, or the official record was revised. Unknown is not 0.",
      "- Only the dollars differ: explain it with the quote at that time. The quote is not an official payout price and not dollars sitting in the wallet.",
      "## Illustrative case",
      "This shows the date rule. It is not actual income. One IOTA is in an October 22 accounting record and the status counts. The site and a daily email that already includes it both label October 21. A quote of $6 shows $6. A later quote of $6.20 still has 1 IOTA and shows $6.20. If the email went out before the record existed, the email can omit it and the site can add it later. The date label is still the 21st.",
      "## Official payout and scoring limits",
      "- The user guide says payouts are about every 24 hours and that window may be lengthened; the minimum is about 0.4 alpha and amounts below it roll forward; network transfer costs are deducted from what you receive; payouts may be frozen if the active run is not improving. Those are the guide’s approximate figures, not a payout date or a floor from this site.",
      "- Scoring shares verified score inside a run, then scales by that run’s burn and effective allocation. Layers differ in work and in how many miners they have, so the same effort can be a different share. Throughput is not a unit price. A tier name is not this formula. See [tiers and layers](/learn/iota-run-tiers).",
      "- If you are queued or seeing 0 tokens/s, separate a stale sample first in [queue and zero throughput](/learn/iota-queue-and-zero-throughput). That page does not convert throughput into yesterday’s rewards.",
      "The screenshot below was captured on 2026-10-09. It still says Today so the raw ledger fields stay visible. Under this site’s current preceding-day display, that October 9 accounting record belongs to October 8. It is not the current interface, a live quote, or the site owner’s income.",
    ],
    ko: [
      "메일과 웹이 다르면 같은 날짜의 IOTA 수량을 먼저 비교합니다. 수량이 같으면 달러 차이는 대개 환산 시각 차이입니다. 수량이 다르면 수집 시각과 기록 상태를 봅니다.",
      "## 날짜를 붙이는 방법",
      "- 이 사이트의 어제는 다음 날 정산 기록을 UTC+8 전날에 둡니다. 10월 22일 기록은 10월 21일에 표시됩니다. 훈련이 21일에 있었다는 증거나, 21일에 지갑으로 입금됐다는 뜻이 아닙니다.",
      "- 일일 메일과 웹은 같은 귀속을 씁니다. 수집 시각, 이후 공식 수정, 달러 환산 시각 때문에 여전히 달라 보일 수 있습니다.",
      "- 앱의 Total Earned, Total Paid, Total Pending은 별도의 공식 숫자입니다. Total Earned는 지급과 미지급을 이미 포함하므로 Total Paid를 다시 더하지 않습니다.",
      "## 무엇을 볼지",
      "- [IOTA 모니터](/projects/iota)에서 그 어제의 IOTA 수량, 수집 시각, USD가 시세인지 미상인지를 적습니다.",
      "- 공식 앱 왼쪽 위의 Miner에서 Total Earned, Total Paid, Total Pending을 비교합니다. coldkey 없이도 훈련은 됩니다. 보상은 연결 전까지 지급되지 않고, 나중에 연결해도 그 전 구간은 소급되지 않습니다.",
      "- 보상은 Miner ID(hotkey)의 공식 기록을 더합니다. 같은 Miner ID는 두 번 넣지 않습니다. 풀처럼 지갑 주소로 잔액을 합치는 것이 아닙니다. 이 사이트의 어제는 pending과 settled만 더하고 frozen과 미래 시각은 빼니다. 기기 수는 서로 다른 저장 기기를 셉니다. 무료는 프로젝트마다 5대, Pro는 50대입니다. 실제 hotkey 보상 기록은 중복을 뺍니다. 한 지갑 아래 여러 채굴자가 보이는 것만으로는 자리를 쓰지 않고, 별도의 저장 기기 기록을 만들 때 자리를 씁니다.",
      "## 어느 쪽으로 갈지",
      "- 날짜가 하루 어긋나면 「정산일의 전날」로 다시 맞춥니다. 22일 정산 기록과 22일 어제를 바로 비교하지 않습니다.",
      "- IOTA 수량이 여전히 다르면, 한쪽이 아직 수집하지 않았는지, frozen이 들어갔는지, 공식 수정이 있었는지 봅니다. 미상은 0이 아닙니다.",
      "- 달러만 다르면 그 시각의 시세로 설명합니다. 시세는 공식 지급 가격도, 지갑 속 달러도 아닙니다.",
      "## 읽는 예시",
      "실제 수입이 아니라 날짜 규칙의 예입니다. 10월 22일 정산에 1 IOTA가 있고 상태에 포함됩니다. 사이트와 그 기록을 담은 일일 메일은 모두 10월 21일로 표시합니다. 당시 가격이 1개당 6달러면 6달러, 나중에 6.20달러면 수량은 1 IOTA이고 달러만 6.20입니다. 기록이 생기기 전에 메일이 나갔으면 메일에는 없고 웹에 나중에 붙을 수 있습니다. 날짜 표기는 여전히 21일입니다.",
      "## 공식 지급과 점수의 경계",
      "- 사용자 안내는 지급이 약 24시간마다이며 이 창이 길어질 수 있다고 합니다. 최소는 약 0.4 alpha이고 미달이면 다음으로 넘어갑니다. 네트워크 전송 비용은 받는 수량에서 빠집니다. 현재 run이 개선되지 않으면 지급이 동결될 수 있습니다. 이는 안내의 대략값이며 이 사이트의 입금일이나 최저 보장이 아닙니다.",
      "- 점수는 같은 run 안에서 검증된 점수 비중으로 나누고, 그 run의 burn과 유효 배분으로 조정합니다. layer마다 작업량과 채굴자 수가 달라 같은 노력도 비중이 다를 수 있습니다. 처리량은 단가가 아닙니다. 등급 이름도 이 계산을 대신하지 않습니다. [등급과 레이어](/learn/iota-run-tiers)를 보세요.",
      "- 대기이거나 0 tokens/s이면 [대기와 처리량 0](/learn/iota-queue-and-zero-throughput)에서 오래된 표본부터 구분합니다. 그 페이지는 처리량을 어제 보상으로 바꾸지 않습니다.",
      "아래 스크린샷은 2026-10-09에 찍혔습니다. 원장 필드를 그대로 보이려고 당시의 Today 글자를 남겨 두었습니다. 지금 사이트의 전날 표시로는 그 10월 9일 정산 기록이 10월 8일에 속합니다. 현재 화면, 실시간 시세, 또는 사이트 운영자의 수입이 아닙니다.",
    ],
    ja: [
      "メールと画面が違うときは、同じ日の IOTA 数量を先に比べます。数量が同じなら、ドルの差はたいてい換算時刻の差です。数量が違うなら、取得時刻と記録の状態を見ます。",
      "## 日付の付け方",
      "- 当サイトの「昨日」は、翌記帳日の記録を UTC+8 の前日に置きます。10月22日の記録は10月21日に出ます。21日に学習した証明でも、21日にウォレットへ着金した意味でもありません。",
      "- 日次メールと画面はこの同じ付け方です。取得時刻、その後の公式修正、ドル換算の時刻で、まだ違って見えることがあります。",
      "- アプリの Total Earned、Total Paid、Total Pending は別の公式の数字です。Total Earned は支払済みと未払いを含むので、Total Paid を足し直しません。",
      "## 確認すること",
      "- [IOTAモニター](/projects/iota)で、その昨日の IOTA 数量、取得時刻、USD が価格か不明かを控えます。",
      "- 公式アプリ左上の Miner で Total Earned、Total Paid、Total Pending を比べます。coldkey がなくても学習はできます。報酬は接続するまで届かず、後から接続しても接続前の分は遡りません。",
      "- 報酬は Miner ID（hotkey）の公式記録を足します。同じ Miner ID は二度入れません。プールのようにウォレットアドレスで残高をまとめるものではありません。当サイトの「昨日」は pending と settled だけを足し、frozen と未来の時刻は入れません。台数は保存済み機器を別々に数えます。無料はプロジェクトごとに5台、Pro は50台です。実在の hotkey の報酬記録は重複を除きます。一つのウォレットの下に複数のマイナーが見えるだけでは枠を使わず、別の保存済み機器として残すと枠を使います。",
      "## どの分岐か",
      "- 日付が一日ずれている: 「記帳日の前日」で合わせ直します。22日の記帳と22日の「昨日」を直接比べません。",
      "- IOTA 数量がまだ違う: 片方だけ未取得か、frozen が入っているか、公式が記録を直したかを見ます。不明は 0 ではありません。",
      "- ドルだけ違う: その時刻の価格で説明します。価格は公式の支払価格でも、ウォレット内のドルでもありません。",
      "## 読み方の例",
      "実際の収入ではなく、日付の規則の例です。10月22日の記帳に 1 IOTA があり、状態は加算対象です。サイトと、その記録を含む日次メールはどちらも10月21日と表示します。その時の価格が1枚6ドルなら6ドル、後で6.20ドルなら数量は 1 IOTA のままドルだけ 6.20 です。記録ができる前にメールが出ていれば、メールには無く、画面には後から付くことがあります。日付のラベルは21日のままです。",
      "## 公式の支払とスコアの境界",
      "- ユーザーガイドは、支払がおよそ24時間ごとで、この窓は延び得る、最低はおよそ 0.4 alpha で未満は次回へ繰り越す、ネットワーク転送費用は受け取る数量から引く、現在の run が改善していなければ支払が凍結され得ると書いています。これはガイドの概数であり、当サイトの着金日や最低保証ではありません。",
      "- スコアは同じ run の中で検証済みスコアの割合になり、その run の burn と有効配分で調整されます。layer ごとに作業量とマイナー数が違うので、同じ努力でも割合は変わり得ます。処理量は単価ではありません。階層の名前もこの計算の代わりになりません。[階層とレイヤー](/learn/iota-run-tiers)を見てください。",
      "- 待機中や 0 tokens/s のときは、[待機と処理量ゼロ](/learn/iota-queue-and-zero-throughput)で古いサンプルを先に分けます。そのページは処理量を昨日の報酬に換えません。",
      "下のスクリーンショットは 2026-10-09 に撮ったものです。元帳の項目をそのまま見せるため、当時の「今日」という表示を残しています。今のサイトの前日表示では、その10月9日の記帳記録は10月8日に属します。現在の画面でも、ライブ価格でも、サイト運営者の収入でもありません。",
    ],
  },
  questions: {
    zh: [
      {
        question: "邮件写 21 日，网页也写 21 日，但我想对 22 日的记账，对得上吗？",
        answer:
          "对得上的是记账日的前一天。10 月 22 日的记账记录显示为 10 月 21 日的昨日。不要把 22 日记账和 22 日的昨日直接比较。",
      },
      {
        question: "Total Earned 和钱包里的币是一回事吗？",
        answer:
          "不是。Total Earned 含已付和待付。已付看 Total Paid，还没付看 Total Pending。本站按每个 Miner ID 的官方记录相加，同一 Miner ID 不计入两次，也不按钱包地址把余额并成一笔。昨日只加 pending 和 settled，不含 frozen 和未来时间。美元是查看时的估价，没有报价就是未知。",
      },
      {
        question: "低于大约 0.4 alpha 是不是丢了？",
        answer:
          "用户指南写的是低于当时门槛会滚到下一次支付，不是清零。门槛和大约 24 小时的周期都可能变化。运行没有改进时，支付还可能被冻结。",
      },
    ],
    "zh-TW": [
      {
        question: "郵件寫 21 日，網頁也寫 21 日，但我想對 22 日的記帳，對得上嗎？",
        answer:
          "對得上的是記帳日的前一天。10 月 22 日的記帳紀錄顯示為 10 月 21 日的昨日。不要把 22 日記帳和 22 日的昨日直接比較。",
      },
      {
        question: "Total Earned 和錢包裡的幣是一回事嗎？",
        answer:
          "不是。Total Earned 含已付和待付。已付看 Total Paid，還沒付看 Total Pending。本站按每個 Miner ID 的官方紀錄相加，同一 Miner ID 不計入兩次，也不按錢包地址把餘額併成一筆。昨日只加 pending 和 settled，不含 frozen 和未來時間。美元是查看時的估價，沒有報價就是未知。",
      },
      {
        question: "低於大約 0.4 alpha 是不是丟了？",
        answer:
          "使用者指南寫的是低於當時門檻會滾到下一次支付，不是清零。門檻和大約 24 小時的周期都可能變化。運行沒有改進時，支付還可能被凍結。",
      },
    ],
    en: [
      {
        question:
          "Email and the site both say the 21st. How does that relate to an October 22 accounting record?",
        answer:
          "The label is the day before the accounting date. An October 22 accounting record is shown as October 21 Yesterday. Do not compare the 22nd’s accounting line with the 22nd’s Yesterday.",
      },
      {
        question: "Is Total Earned the same as coins in the wallet?",
        answer:
          "No. Total Earned includes paid and pending. Paid is Total Paid. Not yet paid is Total Pending. This site sums official records per Miner ID and does not include the same Miner ID twice. It does not merge balances by wallet address. Yesterday adds pending and settled only, and leaves out frozen and future timestamps. Dollars are a quote at lookup. No quote stays unknown.",
      },
      {
        question: "Is an amount under about 0.4 alpha lost?",
        answer:
          "The user guide says an amount under the current threshold rolls to the next payout. It is not wiped. The threshold and the roughly 24-hour window can change. Payouts may also be frozen if the run is not improving.",
      },
    ],
    ko: [
      {
        question: "메일과 웹이 모두 21일인데, 22일 정산과 맞나요?",
        answer:
          "맞는 표기는 정산일의 전날입니다. 10월 22일 정산 기록은 10월 21일 어제로 나옵니다. 22일 정산과 22일 어제를 바로 비교하지 않습니다.",
      },
      {
        question: "Total Earned는 지갑 속 코인인가요?",
        answer:
          "아닙니다. Total Earned는 지급과 미지급을 포함합니다. 지급은 Total Paid, 아직 지급되지 않은 것은 Total Pending입니다. 이 사이트는 Miner ID별 공식 기록을 더하고 같은 Miner ID를 두 번 넣지 않습니다. 지갑 주소로 잔액을 합치지 않습니다. 어제는 pending과 settled만 더하고 frozen과 미래 시각은 빼니다. 달러는 조회 시 시세이며 없으면 미상입니다.",
      },
      {
        question: "약 0.4 alpha 미만은 사라지나요?",
        answer:
          "사용자 안내는 당시 기준 미만이 다음 지급으로 넘어간다고 합니다. 지워지지 않습니다. 기준과 약 24시간 주기는 바뀔 수 있습니다. run이 개선되지 않으면 지급이 동결될 수도 있습니다.",
      },
    ],
    ja: [
      {
        question: "メールも画面も21日です。22日の記帳と合いますか？",
        answer:
          "ラベルは記帳日の前日です。10月22日の記帳は10月21日の昨日として出ます。22日の記帳と22日の昨日を直接比べません。",
      },
      {
        question: "Total Earned はウォレットのコインですか？",
        answer:
          "違います。Total Earned は支払済みと未払いを含みます。支払済みは Total Paid、未払いは Total Pending です。当サイトは Miner ID ごとの公式記録を足し、同じ Miner ID を二度入れません。ウォレットアドレスで残高をまとめません。「昨日」は pending と settled だけを足し、frozen と未来の時刻は入れません。ドルは見た時の価格で、無ければ不明です。",
      },
      {
        question: "およそ 0.4 alpha 未満は失われますか？",
        answer:
          "ユーザーガイドは、当時の基準未満は次の支払へ繰り越すと書いています。消えません。基準とおよそ24時間の周期は変わり得ます。run が改善していなければ支払が凍結されることもあります。",
      },
    ],
  },
};

const promotion: Article = {
  slug: "iota-tier-promotion",
  project: "iota",
  modified: "2026-10-24",
  topic: {
    zh: "申请更高档位",
    "zh-TW": "申請更高檔位",
    en: "Applying for another tier",
    ko: "다른 등급 신청",
    ja: "別の階層への申請",
  },
  title: {
    zh: "IOTA 怎么从 Iron 升到 Bronze、Silver？申请与核对清单",
    "zh-TW": "IOTA 怎麼從 Iron 升到 Bronze、Silver？申請與核對清單",
    en: "IOTA Iron to Bronze or Silver: application and eligibility checks",
    ko: "IOTA Iron에서 Bronze·Silver로: 신청과 자격 확인",
    ja: "IOTAを Iron から Bronze・Silver へ：申請と確認リスト",
  },
  description: {
    zh: "更高档位走官方计算资源申请，用公开 coldkey 和真实硬件。获批后邮件通知。IOTA Watch Pro、换 Miner ID 或反复重启不能代替官方审批。没有公开的固定天数或分数门槛。",
    "zh-TW":
      "更高檔位走官方計算資源申請，用公開 coldkey 和真實硬體。獲批後郵件通知。IOTA Watch Pro、換 Miner ID 或反覆重啟不能代替官方審批。沒有公開的固定天數或分數門檻。",
    en: "Another tier goes through the official compute application, with a public coldkey and real hardware. Acceptance is emailed. IOTA Watch Pro, a new Miner ID, or repeated restarts do not replace that review. No published fixed wait or score bar is stated.",
    ko: "다른 등급은 공식 컴퓨트 신청입니다. 공개 coldkey와 실제 하드웨어를 냅니다. 승인되면 이메일로 알립니다. Pro, Miner ID 변경, 반복 재시작은 공식 심사를 대신하지 않습니다. 공개된 고정 일수나 점수 기준은 없습니다.",
    ja: "別の階層は公式のコンピュート申請です。公開 coldkey と実際のハードウェアを出します。承認はメールです。Pro、Miner ID の変更、再起動の繰り返しは公式審査の代わりになりません。公開された固定日数やスコアの基準はありません。",
  },
  summary: {
    zh: "申请表要求公开 coldkey、矿工类型、至少一种联系方式和机器清单。不要交私钥。本站只帮你看运行和恢复，不能批准档位。",
    "zh-TW":
      "申請表要求公開 coldkey、礦工類型、至少一種聯絡方式和機器清單。不要交私鑰。本站只幫你看運行和恢復，不能批准檔位。",
    en: "The form asks for a public coldkey, a miner type, at least one contact, and the machines. Do not send a private key. This site can show runs and recovery. It cannot approve a tier.",
    ko: "양식은 공개 coldkey, 채굴기 유형, 연락처 하나 이상, 기기 목록을 받습니다. 비밀키는 보내지 않습니다. 이 사이트는 실행과 복구를 보여줄 뿐 등급을 승인하지 않습니다.",
    ja: "フォームは公開 coldkey、マイナー種別、連絡先を一つ以上、機器一覧を求めます。秘密鍵は送りません。当サイトは実行と復旧を見せるだけで、階層は承認しません。",
  },
  sources: [
    {
      name: "Macrocosmos · Provider Compute Application",
      url: "https://iota.macrocosmos.ai/train-at-home/apply",
    },
    {
      name: "Macrocosmos · Train at Home user guide",
      url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
    },
    {
      name: "Macrocosmos · Scoring, Rewards & Kicking",
      url: "https://docs.macrocosmos.ai/subnets/subnet-9-iota/scoring-rewards-and-kicking",
    },
  ],
  related: ["iota-run-tiers", "iota-queue-and-zero-throughput", "how-rewards-work"],
  decision: {
    title: {
      zh: "申请交给官方，状态留在本站看",
      "zh-TW": "申請交給官方，狀態留在本站看",
      en: "Apply on the official form; watch status here",
      ko: "신청은 공식 양식, 상태는 여기서 확인",
      ja: "申請は公式、状態はここで見る",
    },
    action: {
      zh: "[打开官方申请](https://iota.macrocosmos.ai/train-at-home/apply) · [打开 IOTA 监控](/projects/iota)",
      "zh-TW":
        "[開啟官方申請](https://iota.macrocosmos.ai/train-at-home/apply) · [開啟 IOTA 監控](/projects/iota)",
      en: "[Open the official application](https://iota.macrocosmos.ai/train-at-home/apply) · [Open IOTA monitoring](/projects/iota)",
      ko: "[공식 신청 열기](https://iota.macrocosmos.ai/train-at-home/apply) · [IOTA 모니터](/projects/iota)",
      ja: "[公式申請を開く](https://iota.macrocosmos.ai/train-at-home/apply) · [IOTAモニター](/projects/iota)",
    },
  },
  comparisonTitle: {
    zh: "能核对的和不能承诺的",
    "zh-TW": "能核對的和不能承諾的",
    en: "What you can check, and what is not promised",
    ko: "확인할 수 있는 것과 약속되지 않은 것",
    ja: "確認できることと、約束されないこと",
  },
  comparison: {
    zh: {
      headers: ["项目", "怎么对待"],
      rows: [
        ["官方申请表", "提交公开 coldkey、类型、联系方式和机器。获批后邮件通知。"],
        [
          "固定晋级分数、审批天数、收益倍数",
          "申请页和评分说明都没有给出。不要用型号或排队名次倒推。",
        ],
        [
          "IOTA Watch Pro 或新的 Miner ID",
          "不能授予官方档位。Pro 只提高本站每个项目可保存的设备数。",
        ],
        ["在线、有吞吐、自动恢复成功", "说明这台 Mac 的运行情况，不是申请已通过。"],
      ],
    },
    "zh-TW": {
      headers: ["項目", "怎麼對待"],
      rows: [
        ["官方申請表", "提交公開 coldkey、類型、聯絡方式和機器。獲批後郵件通知。"],
        [
          "固定晉級分數、審批天數、收益倍數",
          "申請頁和評分說明都沒有給出。不要用型號或排隊名次倒推。",
        ],
        [
          "IOTA Watch Pro 或新的 Miner ID",
          "不能授予官方檔位。Pro 只提高本站每個專案可儲存的裝置數。",
        ],
        ["在線、有吞吐、自動恢復成功", "說明這台 Mac 的運行情況，不是申請已通過。"],
      ],
    },
    en: {
      headers: ["Item", "How to treat it"],
      rows: [
        [
          "Official application",
          "Send a public coldkey, type, contact, and machines. Acceptance is emailed.",
        ],
        [
          "A fixed promotion score, review time, or reward multiple",
          "Neither the form nor the scoring guide states one. Do not infer it from a model name or queue rank.",
        ],
        [
          "IOTA Watch Pro or a new Miner ID",
          "Does not grant an official tier. Pro only raises how many devices this site can save per project.",
        ],
        [
          "Online, throughput, or a successful relaunch",
          "Describes this Mac’s session. It is not an accepted application.",
        ],
      ],
    },
    ko: {
      headers: ["항목", "다루는 법"],
      rows: [
        ["공식 신청", "공개 coldkey, 유형, 연락처, 기기를 냅니다. 승인되면 이메일로 알립니다."],
        [
          "고정 승급 점수, 심사 일수, 보상 배수",
          "신청 페이지와 점수 안내 모두 적지 않습니다. 모델명이나 대기 순번으로 추정하지 않습니다.",
        ],
        [
          "IOTA Watch Pro 또는 새 Miner ID",
          "공식 등급을 주지 않습니다. Pro는 이 사이트가 프로젝트마다 저장하는 기기 수만 올립니다.",
        ],
        ["온라인, 처리량, 복구 성공", "이 Mac의 세션을 설명할 뿐입니다. 신청 승인이 아닙니다."],
      ],
    },
    ja: {
      headers: ["項目", "扱い"],
      rows: [
        ["公式申請", "公開 coldkey、種別、連絡先、機器を出します。承認はメールです。"],
        [
          "固定の昇格スコア、審査日数、報酬倍率",
          "申請ページにもスコアの説明にもありません。型番や待機順位から推しません。",
        ],
        [
          "IOTA Watch Pro または新しい Miner ID",
          "公式の階層は与えません。Pro は当サイトがプロジェクトごとに保存できる台数を増やすだけです。",
        ],
        [
          "オンライン、処理量、復旧成功",
          "この Mac のセッションの説明です。申請の承認ではありません。",
        ],
      ],
    },
  },
  body: {
    zh: [
      "想参加官方所称的分层任务，用 Macrocosmos 的计算资源申请，不要在本站找一个“升级”按钮。Iron、Bronze、Silver、Gold 是讨论档位时的名称。申请页本身没有写出从哪一档到哪一档的分数或天数。",
      "## 申请页上有什么",
      "- 页面说明：验证 Train at Home 算力，以便访问分层运行。身份栏要公开的 Bittensor coldkey，也就是收款地址。不要提交助记词、私钥或钱包文件。coldkey 不是这台机器的 Miner ID（hotkey）。",
      "- 选择矿工类型，并至少留一种联系方式。机器清单包括类别、型号和数量；内存、地点和上下行可以选填。提交即表示这些资料可被用来审核。获批后通过邮件通知。",
      "- 表单在官方站点填写。IOTA Watch 不接收、不转发这份申请。",
      "## 提交前核对",
      "- 型号和数量按实际机器写。评分文档说确切门槛在代码里，并且可以按 run 改变，所以不要把某一台 Mac 的型号写成“已经达到 Bronze”。",
      "- 联系邮箱要能收信。页面只承诺接受后发邮件，没有写审核要几天。",
      "- 在 [IOTA 监控](/projects/iota) 记下当前 run ID 和最近是否还在排队或反复退出。这些是运行记录，不是申请附件，也不能代替官方通知。",
      "## 申请之后怎么分支",
      "- 收到接受邮件：以邮件和你随后实际加入的 run 描述为准。名称和 layer 的差别见 [分层](/learn/iota-run-tiers)。",
      "- 没有邮件：不要用排队名次、在线天数或重启次数估算获批日。购买 Pro 只把本站限额从每个项目 5 台已保存设备提高到 50 台。",
      "- 机器睡死、断电或训练进程停了：先按 [停止与恢复](/learn/iota-training-stopped-auto-recovery) 处理。恢复成功仍然不是晋级。仍在排队则看 [排队](/learn/iota-queue-and-zero-throughput)，不要为了“刷资格”反复重启。",
      "## 一个对照例子",
      "这是清单示例，不是审批结果。申请里写 1 台 Apple Silicon、公开 coldkey，并留了邮箱。三天后监控仍显示这台机器在排队，邮件未到。正确的下一步是继续等邮件，并保持训练按排队指南运行。错误的下一步是换一个 Miner ID，或把 Pro 订阅当成已经升到 Silver。",
      "## 做不到的事",
      "- 没有公开材料写出 Iron 到 Bronze、再到 Silver 的固定分数、名额或收益倍数。缺这些数字时保持未知，不会补成 0 或补成“一定通过”。",
      "- 评分里的“层级封禁”是运营方对某一运营层级的处理，会移除该运营方名下矿工并挡住待注册。它不是你在申请表里勾选就能得到的 Bronze 或 Silver。",
      "- 收益仍按 run 内分数占比、burn 和分配计算，见 [昨日与到账](/learn/how-rewards-work)。档位申请不保证日收入。",
    ],
    "zh-TW": [
      "想參加官方所稱的分層任務，用 Macrocosmos 的計算資源申請，不要在本站找一個「升級」按鈕。Iron、Bronze、Silver、Gold 是討論檔位時的名稱。申請頁本身沒有寫出從哪一檔到哪一檔的分數或天數。",
      "## 申請頁上有什麼",
      "- 頁面說明：驗證 Train at Home 算力，以便存取分層運行。身份欄要公開的 Bittensor coldkey，也就是收款地址。不要提交助記詞、私鑰或錢包檔。coldkey 不是這台機器的 Miner ID（hotkey）。",
      "- 選擇礦工類型，並至少留一種聯絡方式。機器清單包括類別、型號和數量；記憶體、地點和上下行可以選填。提交即表示這些資料可被用來審核。獲批後透過郵件通知。",
      "- 表單在官方站點填寫。IOTA Watch 不接收、不轉發這份申請。",
      "## 提交前核對",
      "- 型號和數量按實際機器寫。評分文件說確切門檻在程式裡，並且可以按 run 改變，所以不要把某一台 Mac 的型號寫成「已經達到 Bronze」。",
      "- 聯絡郵箱要能收信。頁面只承諾接受後發郵件，沒有寫審核要幾天。",
      "- 在 [IOTA 監控](/projects/iota) 記下目前 run ID 和最近是否還在排隊或反覆退出。這些是運行紀錄，不是申請附件，也不能代替官方通知。",
      "## 申請之後怎麼分支",
      "- 收到接受郵件：以郵件和你隨後實際加入的 run 描述為準。名稱和 layer 的差別見 [分層](/learn/iota-run-tiers)。",
      "- 沒有郵件：不要用排隊名次、在線天數或重啟次數估算獲批日。購買 Pro 只把本站限額從每個專案 5 台已儲存裝置提高到 50 台。",
      "- 機器睡死、斷電或訓練程序停了：先按 [停止與恢復](/learn/iota-training-stopped-auto-recovery) 處理。恢復成功仍然不是晉級。仍在排隊則看 [排隊](/learn/iota-queue-and-zero-throughput)，不要為了「刷資格」反覆重啟。",
      "## 一個對照例子",
      "這是清單示例，不是審批結果。申請裡寫 1 台 Apple Silicon、公開 coldkey，並留了郵箱。三天後監控仍顯示這台機器在排隊，郵件未到。正確的下一步是繼續等郵件，並保持訓練按排隊指南運行。錯誤的下一步是換一個 Miner ID，或把 Pro 訂閱當成已經升到 Silver。",
      "## 做不到的事",
      "- 沒有公開材料寫出 Iron 到 Bronze、再到 Silver 的固定分數、名額或收益倍數。缺這些數字時保持未知，不會補成 0 或補成「一定通過」。",
      "- 評分裡的「層級封禁」是營運方對某一營運層級的處理，會移除該營運方名下礦工並擋住待註冊。它不是你在申請表裡勾選就能得到的 Bronze 或 Silver。",
      "- 收益仍按 run 內分數占比、burn 和分配計算，見 [昨日與到帳](/learn/how-rewards-work)。檔位申請不保證日收入。",
    ],
    en: [
      "To seek what the project calls tiered runs, use the Macrocosmos compute application. There is no upgrade button on this site. Iron, Bronze, Silver, and Gold are names used when people discuss tiers. The form does not state a score or a number of days from one name to the next.",
      "## What the form asks",
      "- The page says it validates Train at Home compute for access to tiered runs. The identity field wants your public Bittensor coldkey, the payout address. Do not send a mnemonic, a private key, or a wallet file. A coldkey is not this machine’s Miner ID (hotkey).",
      "- Choose a miner type and leave at least one contact. The machine list needs a category, a model, and a count. Memory, location, and speeds are optional. Submitting says Macrocosmos may use the details for review. Acceptance is emailed.",
      "- Fill the form on the official site. IOTA Watch does not receive or forward it.",
      "## What to check before you send it",
      "- Write the models and counts you actually have. The scoring guide says exact thresholds live in code and can change per run, so a Mac model is not “already Bronze.”",
      "- Use an inbox you can read. The page promises an email when the application is accepted. It does not say how many days review takes.",
      "- In [IOTA monitoring](/projects/iota), note the current run ID and whether the Mac is still queued or exiting. That is a session record. It is not an attachment, and it does not replace the official email.",
      "## Which branch after you apply",
      "- You receive the acceptance email: trust that email and the description of the run you then join. Names versus layers are in [tiers and layers](/learn/iota-run-tiers).",
      "- No email yet: do not estimate an approval date from queue rank, days online, or restart count. Pro only raises this site’s limit from five saved devices per project to 50.",
      "- The Mac sleeps, loses power, or the worker stops: use [stop and recovery](/learn/iota-training-stopped-auto-recovery) first. A successful relaunch is still not a promotion. If you are queued, use [queue and zero throughput](/learn/iota-queue-and-zero-throughput). Do not restart in a loop to “earn” eligibility.",
      "## Illustrative case",
      "This is a checklist example, not a review outcome. The form says one Apple Silicon machine, a public coldkey, and an email. Three days later monitoring still shows that machine queued, and no email has arrived. The next step is to keep waiting for the email and to leave training running as the queue guide says. Changing the Miner ID, or treating a Pro subscription as Silver, is the wrong step.",
      "## Limits",
      "- No published page states a fixed score, a seat count, or a reward multiple from Iron to Bronze to Silver. Those figures stay unknown. They are not filled in as 0 or as “accepted.”",
      "- A tier ban in the scoring guide is an operator action on an operator tier. It removes that operator’s miners and blocks pending registrations. It is not Bronze or Silver granted by a checkbox on the form.",
      "- Rewards still follow score share, burn, and allocation inside a run. See [yesterday and payouts](/learn/how-rewards-work). An application does not guarantee a daily amount.",
    ],
    ko: [
      "공식에서 말하는 등급별 실행에 참여하려면 Macrocosmos 컴퓨트 신청을 씁니다. 이 사이트에는 업그레이드 버튼이 없습니다. Iron, Bronze, Silver, Gold는 등급을 이야기할 때 쓰는 이름입니다. 신청 페이지는 한 이름에서 다음 이름까지의 점수나 일수를 적지 않습니다.",
      "## 양식이 묻는 것",
      "- 페이지는 등급별 실행에 접근하도록 Train at Home 컴퓨트를 검증한다고 합니다. 신원란은 공개 Bittensor coldkey, 즉 지급 주소입니다. 니모닉, 비밀키, 지갑 파일은 보내지 않습니다. coldkey는 이 기기의 Miner ID(hotkey)가 아닙니다.",
      "- 채굴기 유형을 고르고 연락처를 하나 이상 남깁니다. 기기 목록에는 범주, 모델, 대수가 필요합니다. 메모리, 위치, 속도는 선택입니다. 제출은 Macrocosmos가 심사에 그 내용을 쓸 수 있다는 뜻입니다. 승인되면 이메일로 알립니다.",
      "- 양식은 공식 사이트에 작성합니다. IOTA Watch는 신청을 받거나 전달하지 않습니다.",
      "## 보내기 전에 볼 것",
      "- 실제로 있는 모델과 대수를 씁니다. 점수 안내는 정확한 기준이 코드에 있고 run마다 바뀔 수 있다고 하므로, Mac 모델이 “이미 Bronze”는 아닙니다.",
      "- 읽을 수 있는 받은편지함을 씁니다. 페이지는 승인 시 이메일을 약속합니다. 심사가 며칠인지는 쓰지 않습니다.",
      "- [IOTA 모니터](/projects/iota)에 현재 run ID와, 아직 대기인지 반복 종료인지를 적습니다. 세션 기록일 뿐 첨부도 아니고 공식 메일을 대신하지 않습니다.",
      "## 신청 후 분기",
      "- 승인 메일이 오면 그 메일과, 그 다음 참여한 run의 설명을 따릅니다. 이름과 layer의 차이는 [등급과 레이어](/learn/iota-run-tiers)에 있습니다.",
      "- 메일이 없으면 대기 순번, 온라인 일수, 재시작 횟수로 승인일을 추정하지 않습니다. Pro는 이 사이트의 한도를 프로젝트마다 저장 기기 5대에서 50대로 올릴 뿐입니다.",
      "- Mac이 잠들거나 전원이 끊기거나 워커가 멈추면 먼저 [중지와 복구](/learn/iota-training-stopped-auto-recovery)를 봅니다. 복구 성공도 승급이 아닙니다. 대기이면 [대기와 처리량 0](/learn/iota-queue-and-zero-throughput)을 보고, 자격을 “쌓으려고” 재시작을 반복하지 않습니다.",
      "## 읽는 예시",
      "심사 결과가 아니라 목록 예시입니다. 신청에는 Apple Silicon 1대, 공개 coldkey, 이메일이 있습니다. 사흘 뒤 모니터는 그 기기가 아직 대기이고 메일은 없습니다. 다음은 메일을 기다리고, 대기 안내대로 훈련을 켜 두는 것입니다. Miner ID를 바꾸거나 Pro 구독을 Silver로 여기는 것은 잘못된 다음 단계입니다.",
      "## 한계",
      "- 공개 자료에 Iron에서 Bronze, 다시 Silver로의 고정 점수, 자리 수, 보상 배수는 없습니다. 그 숫자는 미상입니다. 0이나 “승인”으로 채우지 않습니다.",
      "- 점수 안내의 티어 차단은 운영 계층에 대한 운영자 조치입니다. 그 운영자의 채굴자를 제거하고 대기 등록을 막습니다. 신청서 체크만으로 받는 Bronze나 Silver가 아닙니다.",
      "- 보상은 여전히 run 안의 점수 비중, burn, 배분을 따릅니다. [어제와 지급](/learn/how-rewards-work)을 보세요. 신청이 하루 수입을 보장하지 않습니다.",
    ],
    ja: [
      "公式がいう階層付きの実行に参加するには、Macrocosmos のコンピュート申請を使います。当サイトにアップグレードボタンはありません。Iron、Bronze、Silver、Gold は階層の話で使う名前です。申請ページは、ある名前から次の名前までのスコアや日数を書いていません。",
      "## フォームが求めるもの",
      "- ページは、階層付き実行へアクセスできるよう Train at Home のコンピュートを検証する、とあります。身元欄は公開の Bittensor coldkey、つまり受取アドレスです。ニーモニック、秘密鍵、ウォレットファイルは送りません。coldkey はこの機器の Miner ID（hotkey）ではありません。",
      "- マイナー種別を選び、連絡先を一つ以上残します。機器一覧には種別、型番、台数が必要です。メモリ、場所、速度は任意です。送信は、Macrocosmos が審査にその内容を使ってよいという意味です。承認はメールで知らせます。",
      "- フォームは公式サイトで書きます。IOTA Watch は申請を受け取らず、転送もしません。",
      "## 送る前に確認すること",
      "- 実際にある型番と台数を書きます。スコアの説明は、正確な閾値がコードにあり run ごとに変わり得ると書いているので、Mac の型番は「すでに Bronze」ではありません。",
      "- 読める受信箱を使います。ページは承認時のメールを約束します。審査が何日かは書いていません。",
      "- [IOTAモニター](/projects/iota)に、今の run ID と、まだ待っているか繰り返し終了しているかを控えます。セッションの記録であり、添付でも公式メールの代わりでもありません。",
      "## 申請後の分岐",
      "- 承認メールが来たら、そのメールと、その後入った run の説明に従います。名前と layer の違いは [階層とレイヤー](/learn/iota-run-tiers) にあります。",
      "- メールが無い: 待機順位、オンライン日数、再起動回数から承認日を推定しません。Pro は当サイトの上限を、プロジェクトごとの保存済み機器5台から50台に上げるだけです。",
      "- Mac がスリープする、電源が落ちる、ワーカーが止まる: 先に [停止と復旧](/learn/iota-training-stopped-auto-recovery) を見ます。復旧できても昇格ではありません。待機なら [待機と処理量ゼロ](/learn/iota-queue-and-zero-throughput) を見て、資格を「稼ぐ」ために再起動を繰り返しません。",
      "## 読み方の例",
      "審査結果ではなく、リストの例です。申請には Apple Silicon 1台、公開 coldkey、メールがあります。三日後、モニターはその機器がまだ待機で、メールはありません。次はメールを待ち、待機の案内どおり学習を動かしたままにすることです。Miner ID を替えることや、Pro の購読を Silver とみなすことは、誤った次の一手です。",
      "## できないこと",
      "- 公開資料に、Iron から Bronze、さらに Silver への固定スコア、席数、報酬倍率はありません。その数字は不明のままです。0 や「承認」で埋めません。",
      "- スコア説明にある階層の禁止は、運営階層に対する運営者の措置です。その運営者のマイナーを外し、保留中の登録を止めます。申請のチェックだけで得る Bronze や Silver ではありません。",
      "- 報酬は今も run 内のスコア割合、burn、配分に従います。[昨日と着金](/learn/how-rewards-work)を見てください。申請は一日の金額を保証しません。",
    ],
  },
  questions: {
    zh: [
      {
        question: "申请要填 Miner ID 还是 coldkey？",
        answer:
          "官方申请要公开的 Bittensor coldkey，也就是收款地址。不要填私钥或助记词。Miner ID 是这台机器的 hotkey，不是申请表里的收款地址。",
      },
      {
        question: "几天能从 Iron 到 Bronze？",
        answer:
          "申请页只说接受后发邮件，没有写审核天数，也没有写固定分数。没有邮件时，不能用排队名次或在线天数推算获批日。",
      },
      {
        question: "买 Pro 或换一个 Miner ID 能升档吗？",
        answer:
          "不能。Pro 只把本站每个项目的已保存设备从 5 台提高到 50 台。换 Miner ID 和反复重启也不会代替官方审批。",
      },
    ],
    "zh-TW": [
      {
        question: "申請要填 Miner ID 還是 coldkey？",
        answer:
          "官方申請要公開的 Bittensor coldkey，也就是收款地址。不要填私鑰或助記詞。Miner ID 是這台機器的 hotkey，不是申請表裡的收款地址。",
      },
      {
        question: "幾天能從 Iron 到 Bronze？",
        answer:
          "申請頁只說接受後發郵件，沒有寫審核天數，也沒有寫固定分數。沒有郵件時，不能用排隊名次或在線天數推算獲批日。",
      },
      {
        question: "買 Pro 或換一個 Miner ID 能升檔嗎？",
        answer:
          "不能。Pro 只把本站每個專案的已儲存裝置從 5 台提高到 50 台。換 Miner ID 和反覆重啟也不會代替官方審批。",
      },
    ],
    en: [
      {
        question: "Does the form want a Miner ID or a coldkey?",
        answer:
          "The official form wants your public Bittensor coldkey, the payout address. Do not send a private key or a seed phrase. The Miner ID is this machine’s hotkey, not the payout address on the form.",
      },
      {
        question: "How many days from Iron to Bronze?",
        answer:
          "The form says you are emailed when the application is accepted. It states no review time and no fixed score. Without that email, queue rank and days online do not produce an approval date.",
      },
      {
        question: "Does Pro or a new Miner ID raise the tier?",
        answer:
          "No. Pro raises this site’s saved devices from five per project to 50. A new Miner ID and repeated restarts do not replace the official review.",
      },
    ],
    ko: [
      {
        question: "신청에는 Miner ID와 coldkey 중 무엇을 쓰나요?",
        answer:
          "공식 신청은 공개 Bittensor coldkey, 즉 지급 주소입니다. 비밀키나 시드 구문은 보내지 않습니다. Miner ID는 이 기기의 hotkey이며 양식의 지급 주소가 아닙니다.",
      },
      {
        question: "Iron에서 Bronze까지 며칠인가요?",
        answer:
          "양식은 승인 시 이메일을 보낸다고만 합니다. 심사 일수와 고정 점수는 없습니다. 메일이 없으면 대기 순번이나 온라인 일수로 승인일을 만들지 않습니다.",
      },
      {
        question: "Pro나 새 Miner ID가 등급을 올리나요?",
        answer:
          "아닙니다. Pro는 이 사이트의 저장 기기를 프로젝트마다 5대에서 50대로 올립니다. Miner ID 변경과 반복 재시작은 공식 심사를 대신하지 않습니다.",
      },
    ],
    ja: [
      {
        question: "申請は Miner ID ですか、coldkey ですか？",
        answer:
          "公式申請は公開の Bittensor coldkey、受取アドレスです。秘密鍵やシードフレーズは送りません。Miner ID はこの機器の hotkey で、フォームの受取アドレスではありません。",
      },
      {
        question: "Iron から Bronze まで何日ですか？",
        answer:
          "フォームは承認時にメールするとだけ書いています。審査日数も固定スコアもありません。メールが無いとき、待機順位やオンライン日数から承認日は出せません。",
      },
      {
        question: "Pro や新しい Miner ID で階層は上がりますか？",
        answer:
          "上がりません。Pro は当サイトの保存済み機器を、プロジェクトごとに5台から50台にします。Miner ID の変更と再起動の繰り返しは公式審査の代わりになりません。",
      },
    ],
  },
};

const tiers: Article = {
  slug: "iota-run-tiers",
  project: "iota",
  modified: "2026-10-24",
  topic: {
    zh: "档位、资格和 layer",
    "zh-TW": "檔位、資格和 layer",
    en: "Tiers, eligibility, and layers",
    ko: "등급, 자격, 레이어",
    ja: "階層、資格、レイヤー",
  },
  title: {
    zh: "IOTA Iron、Bronze、Silver、Gold：档位、资格和 layer 有什么区别？",
    "zh-TW": "IOTA Iron、Bronze、Silver、Gold：檔位、資格和 layer 有什麼區別？",
    en: "IOTA Iron, Bronze, Silver and Gold: tiers, eligibility and layers",
    ko: "IOTA Iron·Bronze·Silver·Gold: 등급, 자격, 레이어의 차이",
    ja: "IOTAの Iron・Bronze・Silver・Gold：階層、資格、レイヤーの違い",
  },
  description: {
    zh: "档位是运行的分组名称，资格由官方审核和当次 run 决定，layer 是模型流水线的一段。三者都不是 Mac 型号，也不能换成一份固定日收入。看不到标签时保持未知。",
    "zh-TW":
      "檔位是運行的分組名稱，資格由官方審核和當次 run 決定，layer 是模型流水線的一段。三者都不是 Mac 型號，也不能換成一份固定日收入。看不到標籤時保持未知。",
    en: "A tier is a name for a run group. Eligibility comes from official review and that run. A layer is one slice of the model pipeline. None of the three is a Mac model, and none is a fixed daily amount. A missing label stays unknown.",
    ko: "등급은 실행 묶음의 이름입니다. 자격은 공식 심사와 그 run이 정합니다. layer는 모델 파이프라인의 한 구간입니다. 셋 다 Mac 모델이 아니고 고정 일수입도 아닙니다. 라벨이 없으면 미상입니다.",
    ja: "階層は実行グループの名前です。資格は公式審査とその run が決めます。layer はモデルのパイプラインの一区間です。三つとも Mac の型番ではなく、固定の一日の金額でもありません。ラベルが無ければ不明のままです。",
  },
  summary: {
    zh: "先看你加入的那次 run 自己的描述，不要用旧教程里的编号表套所有任务。同型号收入不同，是因为 layer 的工作量和 run 的分配不同。",
    "zh-TW":
      "先看你加入的那次 run 自己的描述，不要用舊教程裡的編號表套所有任務。同型號收入不同，是因為 layer 的工作量和 run 的分配不同。",
    en: "Read the description of the run you joined. Do not paste an old numbering chart onto every run. Identical Macs can earn different amounts because layers and run allocations differ.",
    ko: "내가 들어간 run의 설명을 먼저 읽습니다. 옛 번호표를 모든 실행에 씌우지 않습니다. 같은 모델도 layer와 run 배분이 다르면 보상이 다를 수 있습니다.",
    ja: "入った run 自身の説明を先に読みます。古い番号表をすべての実行に当てはめません。同じ型番でも、layer と run の配分が違えば報酬は変わり得ます。",
  },
  sources: [
    {
      name: "Macrocosmos · Provider Compute Application",
      url: "https://iota.macrocosmos.ai/train-at-home/apply",
    },
    {
      name: "Macrocosmos · Scoring, Rewards & Kicking",
      url: "https://docs.macrocosmos.ai/subnets/subnet-9-iota/scoring-rewards-and-kicking",
    },
    {
      name: "Macrocosmos · Train at Home user guide",
      url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
    },
  ],
  related: ["iota-tier-promotion", "how-rewards-work", "iota-queue-and-zero-throughput"],
  decision: {
    title: {
      zh: "三个名字，三件不同的事",
      "zh-TW": "三個名字，三件不同的事",
      en: "Three names, three different facts",
      ko: "이름 세 개, 사실 세 가지",
      ja: "三つの名前、三つの別の事実",
    },
    action: {
      zh: "[打开 IOTA 监控](/projects/iota) · [怎么申请其他档位](/learn/iota-tier-promotion)",
      "zh-TW": "[開啟 IOTA 監控](/projects/iota) · [怎麼申請其他檔位](/learn/iota-tier-promotion)",
      en: "[Open IOTA monitoring](/projects/iota) · [How to apply for another tier](/learn/iota-tier-promotion)",
      ko: "[IOTA 모니터](/projects/iota) · [다른 등급 신청](/learn/iota-tier-promotion)",
      ja: "[IOTAモニター](/projects/iota) · [別の階層への申請](/learn/iota-tier-promotion)",
    },
  },
  comparisonTitle: {
    zh: "三个字段",
    "zh-TW": "三個欄位",
    en: "Three fields",
    ko: "세 항목",
    ja: "三つの項目",
  },
  comparison: {
    zh: {
      headers: ["字段", "它说明什么"],
      rows: [
        [
          "档位名称（Iron、Bronze、Silver、Gold 等）",
          "某次运行的分组叫法。不是芯片跑分，也不是日收入等级。当前有哪些运行，以你加入的那次描述为准。",
        ],
        ["资格", "官方审核加上这次 run 的条件。本站不能授予。申请步骤见晋级清单。"],
        [
          "Layer",
          "模型被拆开后的一段。每一段的前向工作量和矿工数量可以不同。它不是 Bronze 或 Silver。",
        ],
        ["看不到标签", "保持未知。未知不是 0 档，也不是被封禁。"],
      ],
    },
    "zh-TW": {
      headers: ["欄位", "它說明什麼"],
      rows: [
        [
          "檔位名稱（Iron、Bronze、Silver、Gold 等）",
          "某次運行的分組叫法。不是晶片跑分，也不是日收入等級。目前有哪些運行，以你加入的那次描述為準。",
        ],
        ["資格", "官方審核加上這次 run 的條件。本站不能授予。申請步驟見晉級清單。"],
        [
          "Layer",
          "模型被拆開後的一段。每一段的前向工作量和礦工數量可以不同。它不是 Bronze 或 Silver。",
        ],
        ["看不到標籤", "保持未知。未知不是 0 檔，也不是被封禁。"],
      ],
    },
    en: {
      headers: ["Field", "What it establishes"],
      rows: [
        [
          "Tier name (Iron, Bronze, Silver, Gold, and similar)",
          "A label for a run group. Not a chip score and not a daily-income grade. Which runs exist is whatever the run you joined describes.",
        ],
        [
          "Eligibility",
          "Official review plus that run’s conditions. This site cannot grant it. The application steps are on the promotion checklist.",
        ],
        [
          "Layer",
          "One slice after the model is split. Forward-pass work and miner count can differ by slice. It is not Bronze or Silver.",
        ],
        ["No label", "Leave it unknown. Unknown is not tier 0 and not a ban."],
      ],
    },
    ko: {
      headers: ["항목", "의미"],
      rows: [
        [
          "등급 이름(Iron, Bronze, Silver, Gold 등)",
          "한 실행 묶음의 이름입니다. 칩 점수나 하루 수입 등급이 아닙니다. 어떤 실행이 있는지는 내가 들어간 run의 설명을 따릅니다.",
        ],
        [
          "자격",
          "공식 심사와 그 run의 조건입니다. 이 사이트는 부여하지 않습니다. 신청 단계는 승급 목록에 있습니다.",
        ],
        [
          "Layer",
          "모델을 나눈 한 구간입니다. 순전파 작업량과 채굴자 수는 구간마다 다를 수 있습니다. Bronze나 Silver가 아닙니다.",
        ],
        ["라벨 없음", "미상으로 둡니다. 미상은 0등급도 차단도 아닙니다."],
      ],
    },
    ja: {
      headers: ["項目", "分かること"],
      rows: [
        [
          "階層の名前（Iron、Bronze、Silver、Gold など）",
          "ある実行グループの呼び方です。チップの点数でも、一日の収入の等級でもありません。どの実行があるかは、入った run の説明に従います。",
        ],
        [
          "資格",
          "公式審査とその run の条件です。当サイトは付与できません。申請の手順は昇格リストにあります。",
        ],
        [
          "Layer",
          "モデルを分割した一区間です。順方向の作業量とマイナー数は区間ごとに違い得ます。Bronze や Silver ではありません。",
        ],
        ["ラベルが無い", "不明のままにします。不明は階層 0 でも禁止でもありません。"],
      ],
    },
  },
  body: {
    zh: [
      "把档位、资格和 layer 分开读。混在一起时，人们会把 Mac 型号当成收入等级，或把模型的一段当成 Bronze。",
      "## 各自指什么",
      "- 开始训练后，官方应用的运行面板会写出 run ID、模型大小和 layer 数量。这些是这次任务的事实。Iron、Bronze、Silver、Gold 只在运行描述或讨论里作为分组名称出现。没有描述时，不要用旧表把编号猜成某一档。",
      "- 资格来自官方对算力申请的审核，以及这次 run 是否接受你。申请表的用途是访问分层运行，步骤在 [申请清单](/learn/iota-tier-promotion)。",
      "- Layer 是流水线并行里的一段。评分说明写明：每一层的前向次数和矿工数量可以不同，所以可计分的工作量不同。矿工的份额要对照他所在那一层实际产生的分数来看，不能假设每一层一样多。",
      "## 在监控里看哪里",
      "- 打开 [IOTA 监控](/projects/iota)，只采用这次读取里已经给出的运行标签。空着就是未知。",
      "- 同时记下 run ID 和 layer，再和官方应用右侧面板对照。对不上时以你机器上这次会话的面板为准，不要用别人的截图补标签。",
      "- 全网空位是各任务合计。它不证明你有资格进入某一个名称的档位。仍在排队时按 [排队](/learn/iota-queue-and-zero-throughput) 处理。",
      "## 收入为什么不能按档位名称比较",
      "- 同一 run 内，权重是你的验证分数占该 run 全体分数的比例，再乘这次 run 的 burn 和有效分配。只跑了奖励窗口的一部分，贡献也按比例减少。",
      "- 因此两台相同型号、分属不同 run 或不同 layer 的 Mac，日收益可以不同。先对齐 run、layer、时间段和记录状态，再看数量。算法见 [昨日与到账](/learn/how-rewards-work)。",
      "- 低分本身不会把你踢出。是否移除由该 run 的策略决定，可以是不踢、按层去掉最低的若干人，或低于某条分数线。初始化期间不会因表现被踢。这些策略的具体数字按 run 变化，页面上没有的数字保持未知。",
      "## 一个对照例子",
      "这是说明字段的例子，不是两台机器的实测收入。机器 A 和机器 B 都是同一型号。A 的面板是 run R1、layer 3；B 是 run R2、layer 1。监控没有给 R2 写 Bronze 或 Silver，就保持未知，不要把 R2 猜成 Gold。即使两台昨天都显示 1 IOTA，也不能说“同一档位所以应该一样”，因为 run 和 layer 已经不同，而且 1 IOTA 还要按记账日的前一天来读。",
      "## 做不到的事",
      "- 本站不按 Mac 型号自动分成四档，也不承诺四个名称目前都有任务。",
      "- 想加入别的分组，走官方申请。没有公开证据时，不会显示“再训几小时就升级”或“Pro 可以升档”。",
      "- Train at Home 不是 IOTA 公链。这里的 IOTA 是该子网的奖励单位。",
    ],
    "zh-TW": [
      "把檔位、資格和 layer 分開讀。混在一起時，人們會把 Mac 型號當成收入等級，或把模型的一段當成 Bronze。",
      "## 各自指什麼",
      "- 開始訓練後，官方應用程式的運行面板會寫出 run ID、模型大小和 layer 數量。這些是這次任務的事實。Iron、Bronze、Silver、Gold 只在運行描述或討論裡作為分組名稱出現。沒有描述時，不要用舊表把編號猜成某一檔。",
      "- 資格來自官方對算力申請的審核，以及這次 run 是否接受你。申請表的用途是存取分層運行，步驟在 [申請清單](/learn/iota-tier-promotion)。",
      "- Layer 是流水線並行裡的一段。評分說明寫明：每一層的前向次數和礦工數量可以不同，所以可計分的工作量不同。礦工的份額要對照他所在那一層實際產生的分數來看，不能假設每一層一樣多。",
      "## 在監控裡看哪裡",
      "- 打開 [IOTA 監控](/projects/iota)，只採用這次讀取裡已經給出的運行標籤。空著就是未知。",
      "- 同時記下 run ID 和 layer，再和官方應用程式右側面板對照。對不上時以你機器上這次會話的面板為準，不要用別人的截圖補標籤。",
      "- 全網空位是各任務合計。它不證明你有資格進入某一個名稱的檔位。仍在排隊時按 [排隊](/learn/iota-queue-and-zero-throughput) 處理。",
      "## 收入為什麼不能按檔位名稱比較",
      "- 同一 run 內，權重是你的驗證分數占該 run 全體分數的比例，再乘這次 run 的 burn 和有效分配。只跑了獎勵窗口的一部分，貢獻也按比例減少。",
      "- 因此兩台相同型號、分屬不同 run 或不同 layer 的 Mac，日收益可以不同。先對齊 run、layer、時間段和紀錄狀態，再看數量。算法見 [昨日與到帳](/learn/how-rewards-work)。",
      "- 低分本身不會把你踢出。是否移除由該 run 的策略決定，可以是不踢、按層去掉最低的若干人，或低於某條分數線。初始化期間不會因表現被踢。這些策略的具體數字按 run 變化，頁面上沒有的數字保持未知。",
      "## 一個對照例子",
      "這是說明欄位的例子，不是兩台機器的實測收入。機器 A 和機器 B 都是同一型號。A 的面板是 run R1、layer 3；B 是 run R2、layer 1。監控沒有給 R2 寫 Bronze 或 Silver，就保持未知，不要把 R2 猜成 Gold。即使兩台昨天都顯示 1 IOTA，也不能說「同一檔位所以應該一樣」，因為 run 和 layer 已經不同，而且 1 IOTA 還要按記帳日的前一天來讀。",
      "## 做不到的事",
      "- 本站不按 Mac 型號自動分成四檔，也不承諾四個名稱目前都有任務。",
      "- 想加入別的分組，走官方申請。沒有公開證據時，不會顯示「再訓幾小時就升級」或「Pro 可以升檔」。",
      "- Train at Home 不是 IOTA 公鏈。這裡的 IOTA 是該子網的獎勵單位。",
    ],
    en: [
      "Read tier, eligibility, and layer as three separate facts. Mixing them turns a Mac model into an income grade, or a slice of the model into Bronze.",
      "## What each one is",
      "- After you start training, the official run panel shows the run ID, model size, and layer count. Those are facts about this task. Iron, Bronze, Silver, and Gold appear as group names in a run description or in discussion. If the description is missing, do not use an old chart to guess a tier from a number.",
      "- Eligibility is the official review of the compute application plus whether this run accepts you. The form is for access to tiered runs. The steps are on the [application checklist](/learn/iota-tier-promotion).",
      "- A layer is one stage of pipeline parallelism. The scoring guide says each layer can have a different volume of forward passes and a different miner count, so the scorable work differs. A miner’s share is read against the score that layer actually produced. Do not assume every layer produced the same amount.",
      "## Where to look",
      "- Open [IOTA monitoring](/projects/iota) and use only the run label this reading already contains. A blank stays unknown.",
      "- Write down the run ID and the layer, then compare them with the panel on the right of the official app. If they disagree, trust the panel on this session. Do not fill a label from someone else’s screenshot.",
      "- Free seats across the network are a sum of runs. They do not prove you may enter a named tier. If you are still queued, follow [queue and zero throughput](/learn/iota-queue-and-zero-throughput).",
      "## Why a tier name is not a payout comparison",
      "- Inside one run, weight is your verified score divided by the run’s total score, then scaled by that run’s burn and effective allocation. A run that was active for only part of the reward window contributes proportionally less.",
      "- Two Macs of the same model on different runs or layers can therefore show different daily amounts. Match run, layer, period, and record status before comparing quantities. The date rule is in [yesterday and payouts](/learn/how-rewards-work).",
      "- A low score does not remove you by itself. Removal follows that run’s policy: no kick, drop the lowest few on the layer, or drop anyone at or below a bar. A miner still initializing is not performance-kicked. The exact numbers change per run. A number the page does not show stays unknown.",
      "## Illustrative case",
      "This separates the fields. It is not measured income from two machines. Machine A and machine B are the same model. A’s panel says run R1, layer 3. B’s says run R2, layer 1. If monitoring has no Bronze or Silver label on R2, leave it unknown. Do not guess that R2 is Gold. Even if both show 1 IOTA under yesterday, that does not mean “same tier, so the same pay,” because the run and the layer already differ, and that 1 IOTA is still read as the day before the accounting date.",
      "## Limits",
      "- This site does not grade Macs into four tiers by model, and it does not claim every name has a run right now.",
      "- Another group is requested through the official application. Without a published rule, the site does not show “a few more hours and you are promoted” or “Pro raises the official tier.”",
      "- Train at Home is not the IOTA public chain. IOTA here is the subnet reward unit.",
    ],
    ko: [
      "등급, 자격, layer를 세 가지로 나눠 읽습니다. 섞으면 Mac 모델이 수입 등급이 되거나, 모델의 한 구간이 Bronze가 됩니다.",
      "## 각각이 가리키는 것",
      "- 훈련을 시작하면 공식 실행 패널에 run ID, 모델 크기, layer 수가 나옵니다. 이것이 이번 작업의 사실입니다. Iron, Bronze, Silver, Gold는 실행 설명이나 논의의 묶음 이름입니다. 설명이 없으면 옛 표로 번호를 어느 등급이라고 추측하지 않습니다.",
      "- 자격은 컴퓨트 신청의 공식 심사와, 이 run이 받아들이는지입니다. 양식은 등급별 실행 접근용입니다. 단계는 [신청 목록](/learn/iota-tier-promotion)에 있습니다.",
      "- Layer는 파이프라인 병렬의 한 단계입니다. 점수 안내는 각 층의 순전파 양과 채굴자 수가 다를 수 있어 점수화되는 작업량도 다르다고 합니다. 비중은 그 층이 실제로 만든 점수에 비춰 읽습니다. 모든 층이 같다고 가정하지 않습니다.",
      "## 어디서 보나",
      "- [IOTA 모니터](/projects/iota)에서는 이번 조회에 이미 있는 실행 라벨만 씁니다. 비어 있으면 미상입니다.",
      "- run ID와 layer를 적고 공식 앱 오른쪽 패널과 비교합니다. 다르면 이번 세션의 패널을 따릅니다. 다른 사람의 화면으로 라벨을 채우지 않습니다.",
      "- 네트워크 빈자리는 실행들의 합입니다. 이름 있는 등급에 들어갈 자격의 증거가 아닙니다. 아직 대기이면 [대기와 처리량 0](/learn/iota-queue-and-zero-throughput)을 따릅니다.",
      "## 등급 이름으로 지급을 비교하지 않는 이유",
      "- 한 run 안에서 가중치는 검증 점수를 그 run 전체 점수로 나눈 뒤, 그 run의 burn과 유효 배분으로 조정합니다. 보상 창의 일부만 돌았으면 기여도 비례해 줄어듭니다.",
      "- 그래서 같은 모델이라도 run이나 layer가 다르면 하루 수량이 다를 수 있습니다. 수량을 보기 전에 run, layer, 기간, 기록 상태를 맞춥니다. 날짜 규칙은 [어제와 지급](/learn/how-rewards-work)에 있습니다.",
      "- 낮은 점수만으로 제거되지 않습니다. 제거는 그 run의 정책을 따릅니다. 킥 없음, 그 층에서 가장 낮은 몇 명 제거, 또는 기준 이하 제거입니다. 초기화 중에는 성능 킥이 없습니다. 정확한 숫자는 run마다 바뀝니다. 페이지에 없는 숫자는 미상입니다.",
      "## 읽는 예시",
      "필드를 나누는 예이며 두 기기의 실측 수입이 아닙니다. A와 B는 같은 모델입니다. A 패널은 run R1, layer 3. B는 run R2, layer 1. 모니터가 R2에 Bronze나 Silver를 쓰지 않았으면 미상으로 두고 Gold로 추측하지 않습니다. 둘 다 어제 1 IOTA여도 “같은 등급이니 같아야 한다”가 아닙니다. run과 layer가 이미 다르고, 그 1 IOTA는 정산일의 전날로 읽습니다.",
      "## 한계",
      "- 이 사이트는 Mac 모델로 네 등급을 나누지 않으며, 지금 네 이름 모두에 실행이 있다고 하지 않습니다.",
      "- 다른 묶음은 공식 신청으로 요청합니다. 공개된 규칙이 없으면 “몇 시간 더 하면 승급”이나 “Pro가 공식 등급을 올린다”를 보여 주지 않습니다.",
      "- Train at Home은 IOTA 퍼블릭 체인이 아닙니다. 여기의 IOTA는 그 서브넷의 보상 단위입니다.",
    ],
    ja: [
      "階層、資格、layer は三つの別の事実として読みます。混ぜると、Mac の型番が収入の等級になったり、モデルの一区間が Bronze になったりします。",
      "## それぞれが指すもの",
      "- 学習を始めると、公式の実行パネルに run ID、モデルの大きさ、layer 数が出ます。これが今回のタスクの事実です。Iron、Bronze、Silver、Gold は、実行の説明や議論のグループ名です。説明が無ければ、古い表で番号をどれかの階層だと推測しません。",
      "- 資格はコンピュート申請の公式審査と、この run が受け入れるかどうかです。フォームは階層付き実行へのアクセス用です。手順は [申請リスト](/learn/iota-tier-promotion) にあります。",
      "- Layer はパイプライン並列の一段です。スコアの説明は、各層で順方向の量とマイナー数が違い得るので、点数化される作業量も違うと書いています。割合は、その層が実際に出したスコアに照らして読みます。すべての層が同じとは仮定しません。",
      "## どこを見るか",
      "- [IOTAモニター](/projects/iota)では、今回の取得にすでに含まれる実行ラベルだけを使います。空欄は不明です。",
      "- run ID と layer を控え、公式アプリ右側のパネルと比べます。食い違うときは、このセッションのパネルに従います。他人の画面でラベルを埋めません。",
      "- ネットワーク全体の空きは各実行の合計です。名前のある階層に入れる資格の証明にはなりません。まだ待機なら [待機と処理量ゼロ](/learn/iota-queue-and-zero-throughput) に従います。",
      "## 階層の名前で支払を比べない理由",
      "- 一つの run の中で、重みは検証スコアをその run の合計スコアで割ったあと、その run の burn と有効配分で調整されます。報酬の窓の一部しか動いていなければ、貢献も比例して減ります。",
      "- そのため同じ型番でも、run や layer が違えば一日の数量は違い得ます。数量を見る前に run、layer、期間、記録の状態を揃えます。日付の規則は [昨日と着金](/learn/how-rewards-work) にあります。",
      "- 低いスコアだけでは外れません。外れ方はその run の方針です。キックしない、その層で最も低い数人を外す、または基準以下を外す、です。初期化中は性能キックされません。正確な数字は run ごとに変わります。ページに無い数字は不明のままです。",
      "## 読み方の例",
      "項目を分ける例であり、二台の実測収入ではありません。A と B は同じ型番です。A のパネルは run R1、layer 3。B は run R2、layer 1。モニターが R2 に Bronze も Silver も書いていなければ不明のままにし、Gold とは推測しません。両方が昨日 1 IOTA でも「同じ階層だから同じ」にはなりません。run と layer がすでに違い、その 1 IOTA は記帳日の前日として読みます。",
      "## できないこと",
      "- 当サイトは Mac の型番で四階層に分けず、今四つの名前すべてに実行があるとも言いません。",
      "- 別のグループは公式申請で求めます。公開された規則が無ければ、「あと数時間で昇格」や「Pro が公式の階層を上げる」は出しません。",
      "- Train at Home は IOTA の公開チェーンではありません。ここでの IOTA はそのサブネットの報酬単位です。",
    ],
  },
  questions: {
    zh: [
      {
        question: "Layer 3 是不是 Bronze？",
        answer: "不是。Layer 是模型流水线的一段，Bronze 是运行分组的名称。两者不是同一列数字。",
      },
      {
        question: "监控里没有档位名称，是不是 0 档或被封了？",
        answer:
          "都不是。没有读到标签就保持未知。未知不是某一档，也不是封禁。以你这次会话面板上的 run ID 为准。",
      },
      {
        question: "两台一样的 Mac，为什么昨日 IOTA 不同？",
        answer:
          "先对齐是不是同一个 run、同一个 layer、同一段记账日期。份额还要乘这次 run 的 burn 和有效分配。型号相同不会推出相同数量。",
      },
    ],
    "zh-TW": [
      {
        question: "Layer 3 是不是 Bronze？",
        answer: "不是。Layer 是模型流水線的一段，Bronze 是運行分組的名稱。兩者不是同一列數字。",
      },
      {
        question: "監控裡沒有檔位名稱，是不是 0 檔或被封了？",
        answer:
          "都不是。沒有讀到標籤就保持未知。未知不是某一檔，也不是封禁。以你這次會話面板上的 run ID 為準。",
      },
      {
        question: "兩台一樣的 Mac，為什麼昨日 IOTA 不同？",
        answer:
          "先對齊是不是同一個 run、同一個 layer、同一段記帳日期。份額還要乘這次 run 的 burn 和有效分配。型號相同不會推出相同數量。",
      },
    ],
    en: [
      {
        question: "Is layer 3 the same as Bronze?",
        answer:
          "No. A layer is one stage of the model pipeline. Bronze is a name for a run group. They are not the same column.",
      },
      {
        question: "If monitoring has no tier name, is that tier 0 or a ban?",
        answer:
          "Neither. A missing label stays unknown. Unknown is not a tier and not a ban. Use the run ID on this session’s panel.",
      },
      {
        question: "Why do two identical Macs show different yesterday IOTA?",
        answer:
          "Match the run, the layer, and the accounting date first. The share is also scaled by that run’s burn and effective allocation. The same model does not imply the same amount.",
      },
    ],
    ko: [
      {
        question: "Layer 3은 Bronze인가요?",
        answer:
          "아닙니다. Layer는 모델 파이프라인의 한 단계이고, Bronze는 실행 묶음의 이름입니다. 같은 열이 아닙니다.",
      },
      {
        question: "모니터에 등급 이름이 없으면 0등급이거나 차단인가요?",
        answer:
          "둘 다 아닙니다. 라벨이 없으면 미상입니다. 미상은 어느 등급도 차단도 아닙니다. 이번 세션 패널의 run ID를 따릅니다.",
      },
      {
        question: "같은 Mac인데 어제 IOTA가 다른 이유는?",
        answer:
          "같은 run, 같은 layer, 같은 정산 날짜인지 먼저 맞춥니다. 비중은 그 run의 burn과 유효 배분으로도 조정됩니다. 모델이 같다고 수량이 같지는 않습니다.",
      },
    ],
    ja: [
      {
        question: "Layer 3 は Bronze ですか？",
        answer:
          "違います。Layer はモデルのパイプラインの一段で、Bronze は実行グループの名前です。同じ列ではありません。",
      },
      {
        question: "モニターに階層名が無いのは、階層 0 か禁止ですか？",
        answer:
          "どちらでもありません。ラベルが無ければ不明です。不明は階層でも禁止でもありません。このセッションのパネルの run ID に従います。",
      },
      {
        question: "同じ Mac なのに昨日の IOTA が違うのはなぜですか？",
        answer:
          "同じ run、同じ layer、同じ記帳日かを先に揃えます。割合はその run の burn と有効配分でも調整されます。型番が同じでも数量は同じになりません。",
      },
    ],
  },
};

export const iotaDepthGuides: Article[] = [queue, recovery, rewards, promotion, tiers];
