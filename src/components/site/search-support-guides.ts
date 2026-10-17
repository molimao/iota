import type { Article } from "./articles";
import type { ProjectId } from "@/lib/projects";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";

type Five = [string, string, string, string, string];
const official = {
  name: "Macrocosmos · TAH user guide",
  url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
};
const agent = {
  name: "IOTA Watch · agent source and installation",
  url: "https://github.com/molimao/iota/tree/main/scripts/device-agent",
};
function guide(
  slug: string,
  project: ProjectId,
  title: Five,
  intro: Five,
  sections: { q: Five; a: Five }[],
  related: string[],
  sources: NonNullable<Article["sources"]>,
): Article {
  const localizedTitle = l(title),
    summary = l(intro);
  return {
    slug,
    project,
    published: "2026-10-17",
    modified: "2026-10-17",
    title: localizedTitle,
    description: summary,
    summary,
    topic: l([
      "操作与排障",
      "操作與排障",
      "Setup and troubleshooting",
      "설정과 문제 해결",
      "設定とトラブル対処",
    ]),
    related,
    sources,
    body: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        sections.flatMap((s) => [`## ${l(s.q)[locale]}`, l(s.a)[locale]]),
      ]),
    ) as Article["body"],
  };
}

export const searchSupportGuides: Article[] = [
  guide(
    "start-iota-train-at-home",
    "iota",
    [
      "IOTA Train at Home 怎么开始？从安装到查看收益",
      "IOTA Train at Home 如何開始？從安裝到查看收益",
      "How to start IOTA Train at Home and monitor rewards",
      "IOTA Train at Home 시작부터 보상 확인까지",
      "IOTA Train at Homeの始め方と報酬の確認",
    ],
    [
      "先在官方应用中开始训练，再用公开 Miner ID 查询。IOTA Watch 提供独立监控，不代替训练客户端，也不是 IOTA 公链钱包。",
      "先在官方應用開始訓練，再用公開 Miner ID 查詢。IOTA Watch 提供獨立監控，不代替訓練客戶端，也不是 IOTA 公鏈錢包。",
      "Start training in the official app, then monitor its public Miner ID. IOTA Watch is an independent monitor, not the training client or an IOTA Layer 1 wallet.",
      "공식 앱에서 훈련을 시작한 뒤 공개 Miner ID를 조회하세요. IOTA Watch는 독립 모니터이며 훈련 클라이언트나 IOTA L1 지갑이 아닙니다.",
      "公式アプリで学習を開始し、公開Miner IDを照会します。IOTA Watchは独立した監視ツールで、学習クライアントやIOTA L1のウォレットではありません。",
    ],
    [
      {
        q: [
          "应该下载哪个应用？",
          "應下載哪個應用？",
          "Which application should I install?",
          "어떤 앱을 설치하나요?",
          "どのアプリを入れる？",
        ],
        a: [
          "从 [Macrocosmos 官方入口](https://iota.macrocosmos.ai/) 下载 Train at Home，安装前核对官方硬件与系统要求。不要把本站的 Mac Agent 当作训练客户端；Agent 只管理已经安装的官方应用。",
          "從 [Macrocosmos 官方入口](https://iota.macrocosmos.ai/) 下載 Train at Home，先核對硬體及系統要求。本站 Mac Agent 只管理已安裝的官方應用，不能取代訓練客戶端。",
          "Download Train at Home from [Macrocosmos](https://iota.macrocosmos.ai/) and check its current hardware and OS requirements. The IOTA Watch Mac agent manages an existing official installation; downloading the agent alone does not install the training client.",
          "[Macrocosmos](https://iota.macrocosmos.ai/)에서 Train at Home을 받고 최신 하드웨어·OS 요구 사항을 확인하세요. IOTA Watch 에이전트는 설치된 공식 앱을 관리하며 훈련 클라이언트를 대신 설치하지 않습니다.",
          "[Macrocosmos](https://iota.macrocosmos.ai/)からTrain at Homeを入手し、最新のハードウェア・OS要件を確認します。IOTA Watchのエージェントは既存の公式アプリを管理するもので、学習クライアントの代わりにはなりません。",
        ],
      },
      {
        q: [
          "打开应用后要做什么？",
          "開啟應用後要做什麼？",
          "What comes after installation?",
          "설치 후 무엇을 하나요?",
          "インストール後は？",
        ],
        a: [
          "官方指南的顺序是：等待 Connected，按指南配置公开收款 coldkey，再点击 Start training。打开窗口不等于训练已经启动。排队、启动中和实际贡献是不同阶段；本站不能保证何时获得任务或收益。",
          "依官方指南等待 Connected、設定公開收款 coldkey，再點 Start training。視窗開啟不代表訓練已啟動；排隊、啟動中與實際貢獻是不同階段，本站不保證任務或收益時間。",
          "Follow the official guide: wait for Connected, configure your public payout coldkey as instructed, then choose Start training. An open window is not an active session. Queuing, starting and contributing are different states; no task allocation or earnings time is guaranteed.",
          "공식 안내에 따라 Connected를 기다리고 공개 지급 coldkey를 설정한 뒤 Start training을 누르세요. 창이 열렸다고 훈련 중인 것은 아닙니다. 대기·시작·기여는 다르며 작업 배정이나 수익 시점은 보장되지 않습니다.",
          "公式手順に従い、Connectedを待ち、公開受取coldkeyを設定してStart trainingを押します。ウィンドウの表示だけでは学習中とは限りません。待機・起動・貢献は別の段階で、タスクや報酬の時期は保証されません。",
        ],
      },
      {
        q: [
          "查询时填 Miner ID 还是收款地址？",
          "查詢要填 Miner ID 還是收款地址？",
          "Which identifier belongs in the monitor?",
          "조회에는 어떤 ID를 쓰나요?",
          "照会にはどのIDを使う？",
        ],
        a: [
          "在官方应用的 Miner 页面复制设备 Miner ID / hotkey，按 [ID 获取教程](/learn/find-miner-id) 添加到 [IOTA 监控](/app)。coldkey 用于收款，不要用私钥或助记词查询。多台 Mac 分别添加各自 hotkey；登录后同步清单。",
          "從官方 Miner 頁複製設備 Miner ID / hotkey，依 [ID 教程](/learn/find-miner-id) 加入 [IOTA 監控](/app)。coldkey 用於收款，不要輸入私鑰或助記詞。每台 Mac 使用自己的 hotkey，登入後同步清單。",
          "Copy the device Miner ID / hotkey from the official Miner view and follow [Find your Miner ID](/learn/find-miner-id) to add it to [IOTA monitoring](/app). A coldkey identifies the payout wallet. Never enter a private key or seed. Add each Mac's own hotkey and sign in to sync the list.",
          "공식 Miner 화면에서 기기 Miner ID / hotkey를 복사해 [ID 안내](/learn/find-miner-id)에 따라 [모니터](/app)에 추가하세요. coldkey는 지급 지갑입니다. 비밀키·시드는 입력하지 마세요. Mac마다 각 hotkey를 추가하고 로그인해 목록을 동기화하세요.",
          "公式Miner画面の機器Miner ID / hotkeyをコピーし、[IDの探し方](/learn/find-miner-id)から[監視画面](/app)に追加します。coldkeyは受取用です。秘密鍵やシードは入力しません。Macごとのhotkeyを追加し、ログインで一覧を同期します。",
        ],
      },
      {
        q: [
          "为什么开始了却没收益？",
          "為什麼開始後沒有收益？",
          "Why are rewards still zero?",
          "시작했는데 보상이 없는 이유는?",
          "開始したのに報酬がない理由は？",
        ],
        a: [
          "先看是否仍在 [排队或零吞吐](/learn/iota-queue-and-zero-throughput)，再核对数据读取时间。本站 IOTA 的「昨日收益」按次日记账记录归属到前一天，不是即时每秒收入；累计收益与钱包到账也不同。详见 [收益计算](/learn/how-rewards-work)。",
          "先看是否仍在 [排隊或零吞吐](/learn/iota-queue-and-zero-throughput)，再核對取得時間。「昨日收益」依次日記帳紀錄歸屬到前一天，不是即時收入；累計與錢包入帳也不同。見 [收益計算](/learn/how-rewards-work)。",
          "Check [queuing and zero throughput](/learn/iota-queue-and-zero-throughput), then the last successful fetch. IOTA Watch attributes the next day's accounting records to the preceding date under Yesterday's rewards; it is not income per second. Lifetime rewards also differ from wallet receipts. See [reward calculation](/learn/how-rewards-work).",
          "[대기·처리량 0](/learn/iota-queue-and-zero-throughput)과 마지막 조회 시간을 확인하세요. 어제 보상은 다음 날 정산 기록을 전날로 표시한 값이며 초당 실시간 수입이 아닙니다. 누적과 지갑 수령도 다릅니다. [계산 기준](/learn/how-rewards-work)을 확인하세요.",
          "[待機と処理量ゼロ](/learn/iota-queue-and-zero-throughput)、最終取得時刻を確認します。昨日の報酬は翌日の記帳記録を前日に表示する当サイトの基準で、秒当たり収入ではありません。累計と着金も別です。[計算方法](/learn/how-rewards-work)を参照してください。",
        ],
      },
    ],
    ["find-miner-id", "iota-queue-and-zero-throughput", "how-rewards-work"],
    [official, agent],
  ),
  guide(
    "iota-queue-and-zero-throughput",
    "iota",
    [
      "IOTA 一直排队、0 tokens/s，怎么判断有没有在训练？",
      "IOTA 一直排隊、0 tokens/s，如何判斷是否在訓練？",
      "IOTA Train at Home queued or 0 tokens/s: what to check",
      "IOTA 대기열·0 tokens/s: 훈련 상태 확인하기",
      "IOTAが待機中・0 tokens/sのときの確認方法",
    ],
    [
      "排队、训练进程运行和实际贡献不是一回事。先核对数据源及时间，再查看官方训练状态；没有排队名次不能证明已经开始训练。",
      "排隊、訓練程序執行與實際貢獻並不同。先核對來源及時間，再檢查官方訓練狀態；沒有排隊名次不能證明已開始訓練。",
      "A queue, a running training process and actual contribution are different signals. Check each source and timestamp; no queue position does not prove training has begun.",
      "대기열·훈련 프로세스 실행·실제 기여는 다른 신호입니다. 출처와 시각을 확인하세요. 순번이 없다고 훈련 시작이 증명되지는 않습니다.",
      "待機順位・学習プロセス・実際の貢献は異なる情報です。取得元と時刻を確認し、順位がないことを学習開始の証拠にしないでください。",
    ],
    [
      {
        q: [
          "排队名次从哪里来？",
          "排隊名次從哪裡來？",
          "Where does the queue position come from?",
          "대기 순번의 출처는?",
          "待機順位の取得元は？",
        ],
        a: [
          "配对 Mac Agent 后，名次来自本机官方日志的 register/status 排队响应。Agent 只接受当前进程启动后的记录，且记录需在最近 5 分钟内。设备在线则要求 90 秒内有心跳；这是两个不同的时效条件。没安装 Agent 时，公开矿工名单不等于本机排队状态。",
          "配對 Mac Agent 後，名次來自本機官方日誌的 register/status 排隊回應，只接受本次程序啟動後、最近 5 分鐘內的紀錄。設備在線要求 90 秒內有心跳，兩者時效不同。未裝 Agent 時，公開名單不等於本機排隊狀態。",
          "With a paired Mac agent, positions come from local official register/status log responses. The agent accepts only records after the current worker started and within five minutes. Online requires a heartbeat within 90 seconds: a separate clock. Without an agent, the public miner roster does not reveal the Mac's local queue.",
          "Mac 에이전트 순번은 공식 로컬 register/status 로그 응답에서 읽습니다. 현재 워커 시작 이후이며 최근 5분 이내 기록만 사용합니다. 온라인은 90초 이내 하트비트 기준으로 별도입니다. 에이전트 없이 공개 목록만으로 로컬 대기를 알 수 없습니다.",
          "Macエージェントの順位は公式ローカルログのregister/status応答から取得します。現在のワーカー起動後かつ5分以内の記録だけを採用します。オンライン判定は90秒以内のハートビートで別の時計です。公開名簿だけではMacの待機状態は分かりません。",
        ],
      },
      {
        q: [
          "为什么有名次却显示名单中未找到？",
          "為何有名次卻顯示名單中未找到？",
          "Why can a queued device be missing from the roster?",
          "대기 중인데 목록에 없는 이유는?",
          "待機中なのに名簿にない理由は？",
        ],
        a: [
          "两处读取的不是同一类数据：排队反映本机注册响应，项目标签反映已读取的官方任务矿工名单。示例：Agent 显示 #235、项目标签显示「名单中未找到」，应分别检查名次时间和名单覆盖，不能把它们合成「设备离线」。这是字段解释示例，不是等待时间预测。",
          "排隊來自本機註冊回應，專案標籤來自已讀取的官方任務名單。例如 Agent 顯示 #235、專案顯示「名單中未找到」，應分別檢查名次時間與名單覆蓋，不能合併判作離線。此為欄位示例，不是等待預測。",
          "The queue describes a local registration response; the project badge describes the official run rosters successfully read. For example, #235 beside Not in roster calls for checking queue age and roster coverage separately, not declaring the Mac offline. This is a field-reading example, not a waiting-time forecast.",
          "대기열은 로컬 등록 응답이고 프로젝트 태그는 조회된 공식 실행 목록입니다. 예를 들어 #235와 목록 없음이 함께 보이면 순번 시각과 목록 조회 범위를 각각 확인하세요. 오프라인으로 합쳐 판단하지 마세요. 이 예시는 대기 시간 예측이 아닙니다.",
          "順位はローカル登録応答、プロジェクトの表示は取得済み公式実行名簿です。例えば#235と名簿なしが同時に見える場合、順位の時刻と名簿の取得範囲を別々に確認します。オフラインと断定しません。これは読み方の例で待ち時間の予測ではありません。",
        ],
      },
      {
        q: [
          "0 tokens/s、低 CPU 是不是故障？",
          "0 tokens/s、低 CPU 是否故障？",
          "Does zero throughput or low CPU mean failure?",
          "처리량 0·낮은 CPU는 고장인가요?",
          "処理量ゼロ・低CPUは故障？",
        ],
        a: [
          "不一定。排队和等待任务时可能没有贡献吞吐；应用进程存在也不能证明模型正在计算。结合官方应用训练按钮、近期日志、吞吐采样时间和错误信息判断。Agent 的进程资源不是矿池收益，也不是整个系统的 CPU 百分比。不要把低 CPU 或当天零收入作为自动重启依据。",
          "不一定。排隊或等待任務時可能沒有吞吐，程序存在也不代表模型在計算。合併訓練按鈕、近期日誌、吞吐採樣時間與錯誤判斷。進程資源不是礦池收益，也不是全系統 CPU 百分比；不要只因低 CPU 或零收入重啟。",
          "Not necessarily. A queued or waiting participant may have no reported contribution. A process alone does not prove model computation. Check the official training button, recent logs, throughput sample time and errors together. Agent process resources are not pool income or whole-system CPU usage. Low CPU or zero daily rewards alone are not restart criteria.",
          "반드시 그렇지는 않습니다. 대기 중이면 기여 처리량이 없을 수 있고 프로세스 존재가 모델 계산을 증명하지 않습니다. 공식 훈련 버튼·최근 로그·처리량 샘플 시각·오류를 함께 확인하세요. 에이전트 자원 값은 수익이나 전체 시스템 CPU 사용률이 아닙니다. 낮은 CPU나 일일 보상 0만으로 재시작하지 마세요.",
          "必ずしも故障ではありません。待機中には貢献処理量がなく、プロセスの存在だけではモデル計算を証明しません。公式学習ボタン・最近のログ・サンプル時刻・エラーを確認します。プロセス資源は収益やシステム全体CPUではありません。低CPUや報酬ゼロだけで再起動しません。",
        ],
      },
      {
        q: [
          "重启能插队吗？自动恢复会干预排队吗？",
          "重啟可以插隊嗎？自動恢復會影響排隊嗎？",
          "Will restarting skip the queue?",
          "재시작하면 대기열을 건너뛰나요?",
          "再起動で順番を飛ばせる？",
        ],
        a: [
          "本站没有插队功能，也不提供根据名次估算的等待时长。Agent 1.0.5 的自动恢复针对训练进程停止，正常存在的排队进程不会触发恢复。需要排障时见 [停止训练后自动恢复](/learn/iota-training-stopped-auto-recovery)，集中查看见 [Mac 设备管理](/machines)。",
          "本站沒有插隊功能，也不依名次預測等待時長。Agent 1.0.5 只針對停止的訓練程序恢復，正常排隊不觸發。見 [停止後自動恢復](/learn/iota-training-stopped-auto-recovery) 或 [Mac 管理](/machines)。",
          "IOTA Watch cannot skip queues and does not predict a wait from the rank. Agent 1.0.5 recovery targets stopped training processes; an existing queued worker does not trigger recovery. Use [stopped-training recovery](/learn/iota-training-stopped-auto-recovery) for failures or [Mac management](/machines) to compare devices.",
          "IOTA Watch에는 대기열 우회나 순번 기반 대기 시간 예측이 없습니다. 1.0.5 복구는 중지된 훈련 프로세스를 대상으로 하며 정상 대기 워커는 제외합니다. 오류는 [자동 복구 안내](/learn/iota-training-stopped-auto-recovery), 기기 비교는 [Mac 관리](/machines)를 확인하세요.",
          "IOTA Watchは順番を飛ばせず、順位から待ち時間も予測しません。1.0.5の復旧は停止した学習プロセスが対象で、正常な待機ワーカーは対象外です。[自動復旧](/learn/iota-training-stopped-auto-recovery)と[Mac管理](/machines)を参照してください。",
        ],
      },
      {
        q: [
          "一直 initializing、出现 weights 404，要不要换 run？",
          "一直 initializing、出現 weights 404，要換 run 嗎？",
          "Stuck initializing or seeing weights 404: should I change runs?",
          "initializing 또는 weights 404가 계속되면 run을 바꾸나요?",
          "initializingやweights 404が続く場合、runを変える？",
        ],
        a: [
          "先记录官方应用版本、run、报错时间及前后日志，再按官方指南检查连接与训练状态。404 本身不能证明矿工被封禁，也不能证明本机需要重装。IOTA Watch 不提供强制分配、切换官方 run 或修复模型文件的功能；不要反复重启碰运气。若同一错误持续出现，带着上述信息向官方支持核对，分享日志前去掉密码、令牌和私钥。",
          "先記錄官方應用版本、run、錯誤時間及前後日誌，依官方指南核對連線與訓練狀態。404 本身不能證明被封鎖或需要重裝。本站無法強制分配、切換官方 run 或修復模型檔案；不要反覆重啟。持續發生時，帶上述資訊向官方支援核對，分享日誌前移除密碼、權杖與私鑰。",
          "Record the official app version, run, error time and surrounding log lines, then check connection and training state against the official guide. A 404 alone does not establish a ban or a need to reinstall. IOTA Watch cannot force assignment, change official runs or repair model files. Avoid repeated restarts as a guess. If the error persists, give official support those details after removing passwords, tokens and private keys from shared logs.",
          "공식 앱 버전·run·오류 시각·전후 로그를 기록하고 공식 안내로 연결과 훈련 상태를 확인하세요. 404만으로 차단이나 재설치 필요를 판단할 수 없습니다. IOTA Watch는 강제 배정·공식 run 변경·모델 파일 복구를 제공하지 않습니다. 추측으로 반복 재시작하지 마세요. 지속되면 비밀번호·토큰·비밀키를 제거한 정보를 공식 지원에 전달하세요.",
          "公式アプリのバージョン・run・発生時刻・前後のログを記録し、公式手順で接続と学習状態を確認します。404だけでは利用停止や再インストールの必要性は判断できません。当サイトは強制割当・公式run変更・モデルファイル修復を行えません。推測で再起動を繰り返さず、続く場合はパスワード・トークン・秘密鍵を除いた情報を公式サポートへ伝えてください。",
        ],
      },
    ],
    ["mac-status-and-restart", "iota-training-stopped-auto-recovery", "device-status"],
    [official, agent],
  ),
  guide(
    "iota-training-stopped-auto-recovery",
    "iota",
    [
      "IOTA 窗口还在，训练却停止了：Mac 自动恢复怎么设置？",
      "IOTA 視窗還在但訓練停止：Mac 自動恢復設定",
      "IOTA training stopped with the app open: Mac auto-recovery",
      "IOTA 앱은 열렸는데 훈련이 중단됐을 때 자동 복구",
      "IOTAアプリが開いているのに学習停止：Mac自動復旧",
    ],
    [
      "Mac Agent 1.0.5 可在训练进程停止 2 分钟后尝试恢复。应用打开不等于训练已启动；内存不足仍需处理，自动恢复不能保证持续贡献。",
      "Mac Agent 1.0.5 可在訓練程序停止 2 分鐘後嘗試恢復。視窗開啟不代表已訓練；記憶體不足仍須處理，不能保證持續貢獻。",
      "Mac agent 1.0.5 can attempt recovery after the training process has stopped for two minutes. An open app is not proof of training; recovery cannot fix insufficient memory or guarantee contribution.",
      "Mac 에이전트 1.0.5는 훈련 프로세스가 2분간 멈추면 복구를 시도합니다. 열린 앱은 훈련의 증거가 아니며 복구가 메모리 부족을 해결하거나 기여를 보장하지는 않습니다.",
      "Macエージェント1.0.5は学習プロセスの停止2分後に復旧を試みます。アプリの表示だけでは学習中ではなく、メモリ不足の解消や貢献の保証もできません。",
    ],
    [
      {
        q: [
          "在哪里开启？",
          "在哪裡啟用？",
          "Where do I enable it?",
          "어디에서 켜나요?",
          "どこで有効にする？",
        ],
        a: [
          "在 [Mac 设备管理](/machines) 为对应 Miner ID 配对 Agent，确认设备心跳及版本至少 1.0.5，再在「设置与日志」开启「训练停止后自动恢复」。默认关闭，不要求 Pro。只下载脚本但未安装配对时，网页无法控制那台 Mac。",
          "在 [Mac 管理](/machines) 對應 Miner ID 配對 Agent，確認心跳及版本至少 1.0.5，再於「設定與日誌」開啟「訓練停止後自動恢復」。預設關閉，不需 Pro；只下載而未安裝配對時不能控制 Mac。",
          "Pair the agent to the correct Miner ID in [Mac management](/machines). Confirm a recent heartbeat and version 1.0.5 or newer, then enable Recover stopped training under Settings and logs. It is off by default and does not require Pro. Downloading without installation and pairing does not grant control of a Mac.",
          "[Mac 관리](/machines)에서 올바른 Miner ID에 에이전트를 연결하세요. 최신 하트비트와 1.0.5 이상 버전을 확인한 뒤 설정·로그에서 자동 복구를 켭니다. 기본은 꺼짐이며 Pro가 필요하지 않습니다. 다운로드만 하고 설치·페어링하지 않으면 제어할 수 없습니다.",
          "[Mac管理](/machines)で正しいMiner IDへペアリングします。最近の応答と1.0.5以降を確認し、設定とログで自動復旧を有効にします。初期設定は無効、Pro不要です。ダウンロードだけで未設置・未ペアリングなら制御できません。",
        ],
      },
      {
        q: [
          "按停止按钮后会怎样？",
          "按停止按鈕後會怎樣？",
          "What happens when I press Stop?",
          "중지를 누르면 어떻게 되나요?",
          "停止ボタンを押すと？",
        ],
        a: [
          "官方应用内的 Stop Training 会停止训练进程，恢复开关开启时也属于恢复对象。正常排队进程仍存在，不触发恢复。网页上的「停止」会同时关闭自动恢复，让设备保持停止。主动休息、维护或释放内存前，先在网页停止或关闭开关。",
          "官方應用內 Stop Training 停止訓練程序，開啟恢復時也會被恢復；正常排隊不觸發。網頁「停止」會關閉自動恢復。休息、維護或釋放記憶體前，先在網頁停止或關閉開關。",
          "Stop Training inside the official app stops the worker and is also covered when recovery is enabled. A queued worker remains present and is excluded. Stop on the IOTA Watch website disables recovery so it stays stopped. Before maintenance or freeing memory, stop through the website or turn the recovery option off.",
          "공식 앱의 Stop Training도 훈련 프로세스를 중지하므로 복구 대상입니다. 정상 대기 워커는 제외됩니다. IOTA Watch 웹의 중지는 자동 복구를 꺼서 중단 상태를 유지합니다. 점검이나 메모리 확보 전에는 웹에서 중지하거나 복구를 끄세요.",
          "公式アプリ内のStop Trainingもワーカーを停止するため、有効時は復旧対象です。待機中ワーカーは除外されます。IOTA WatchのWeb停止は自動復旧も無効にして停止を維持します。保守やメモリ解放前にはWebで停止するか復旧を無効にしてください。",
        ],
      },
      {
        q: [
          "会修改什么？怎样判断成功？",
          "會修改什麼？如何確認成功？",
          "What changes, and what counts as success?",
          "무엇이 변경되고 성공 기준은 무엇인가요?",
          "何を変更し、何を成功とする？",
        ],
        a: [
          "恢复通过优化启动器重启官方应用，并启用官方 autoStartTrainingOnStartup（启动时自动训练），该设置会保留；不修改钱包、线程或开机登录设置。只有训练进程在 60 秒内出现才确认恢复成功，排队也算进程已启动，不表示已经产生收益。失败后仍遵守 15 分钟尝试间隔；网络中断时不执行恢复。规则来自公开源码与自动化测试，尚不能代替你设备上的按钮实测。",
          "恢復會經優化啟動器重啟官方應用，啟用並保留 autoStartTrainingOnStartup；不改錢包、執行緒或登入啟動設定。60 秒內出現訓練程序才確認成功，排隊不代表產生收益。失敗仍受 15 分鐘間隔限制，斷線不執行。依據公開源碼及自動化測試，不代替實機按鈕測試。",
          "Recovery restarts the official app through the optimized launcher and enables its persistent autoStartTrainingOnStartup preference. Wallet, thread and launch-at-login settings are not changed. The worker must appear within 60 seconds; a queued worker counts as started, not as earning. Failed attempts still have a 15-minute cooldown; network failure prevents recovery. These rules are supported by public code and automated tests, not a claim of a successful button test on every Mac.",
          "최적화 실행기로 앱을 재시작하고 autoStartTrainingOnStartup 설정을 켜서 유지합니다. 지갑·스레드·로그인 실행 설정은 바꾸지 않습니다. 60초 이내 워커가 나타나야 성공이며 대기 워커가 수익을 뜻하지는 않습니다. 실패해도 15분 간격을 적용하고 네트워크 오류 시 복구하지 않습니다. 공개 코드와 자동화 테스트 기준이며 모든 Mac의 버튼 실측을 뜻하지 않습니다.",
          "最適化ランチャーで公式アプリを再起動し、autoStartTrainingOnStartupを有効にして保持します。ウォレット・スレッド・ログイン起動は変更しません。60秒以内にワーカーが現れた場合のみ成功で、待機中は収益発生を意味しません。失敗時も15分間隔、通信断では復旧しません。公開コードと自動テストの仕様であり、全Macのボタン実測を示すものではありません。",
        ],
      },
    ],
    ["iota-queue-and-zero-throughput", "mac-status-and-restart", "data-sources-and-freshness"],
    [official, agent],
  ),
  guide(
    "pearl-prl-mac-monitoring",
    "prl",
    [
      "Mac 挖 Pearl / PRL 后，怎样查算力、Worker 和收益？",
      "Mac 挖 Pearl / PRL 後如何查算力、Worker 與收益？",
      "Pearl PRL on Mac: check pool hashrate, workers and rewards",
      "Mac Pearl PRL 채굴: 해시레이트·워커·보상 확인",
      "MacでPearl PRL：ハッシュレート・ワーカー・報酬を確認",
    ],
    [
      "Apple Silicon 有 Pearl Metal 矿工，但监控必须匹配你实际使用的矿池。本站 PRL 查询读取 Kryptex 钱包统计，不提供安装挖矿程序或保证收益。",
      "Apple Silicon 有 Pearl Metal 礦工，監控必須對應實際礦池。本站 PRL 查詢讀取 Kryptex 錢包統計，不安裝挖礦程式或保證收益。",
      "Pearl Metal supports Apple Silicon pool mining, but monitoring must match your actual pool. IOTA Watch's PRL tool reads Kryptex wallet statistics; it does not install a miner or guarantee returns.",
      "Pearl Metal은 Apple Silicon 풀 채굴을 지원하지만 실제 이용 풀에 맞춰 조회해야 합니다. PRL 도구는 Kryptex 지갑 통계를 읽으며 채굴기 설치나 수익 보장을 제공하지 않습니다.",
      "Pearl MetalはApple Siliconのプール採掘に対応しますが、監視先は実際のプールと一致させます。当サイトのPRLはKryptexのウォレット統計を読み、マイナー設置や収益保証はしません。",
    ],
    [
      {
        q: [
          "Mac 可以挖 PRL 吗？",
          "Mac 可以挖 PRL 嗎？",
          "Can a Mac mine PRL?",
          "Mac에서 PRL을 채굴할 수 있나요?",
          "MacでPRLを採掘できる？",
        ],
        a: [
          "[Pearl Metal 仓库](https://github.com/Breakwater-ecosystem/pearl-metal-miner) 提供 Apple Silicon Metal 后端。安装、支持的系统、连接参数及更新以仓库说明为准。不能把 RTX 5090 的收益、算力或功耗套用到 Mac；本站没有足以给出各款 Mac 净收益的统一实测。",
          "[Pearl Metal 倉庫](https://github.com/Breakwater-ecosystem/pearl-metal-miner) 提供 Apple Silicon Metal 後端，安裝、系統及參數以倉庫為準。RTX 5090 的收益、算力或耗電不能套用 Mac，本站沒有各型 Mac 淨收益的統一實測。",
          "The [Pearl Metal repository](https://github.com/Breakwater-ecosystem/pearl-metal-miner) provides an Apple Silicon Metal backend. Follow its current installation, OS and connection instructions. RTX 5090 earnings, hashrate and power figures cannot be transferred to a Mac. This site has no standardized net-profit measurements for every Mac model.",
          "[Pearl Metal 저장소](https://github.com/Breakwater-ecosystem/pearl-metal-miner)는 Apple Silicon Metal 백엔드를 제공합니다. 최신 설치·OS·연결 안내를 따르세요. RTX 5090의 수익·성능·전력을 Mac에 적용할 수 없습니다. 모든 Mac의 표준화된 순수익 실측은 없습니다.",
          "[Pearl Metal](https://github.com/Breakwater-ecosystem/pearl-metal-miner)はApple Silicon Metalバックエンドを提供します。最新の導入・OS・接続手順に従ってください。RTX 5090の収益・性能・消費電力はMacに適用できません。全Macの標準化した純利益実測はありません。",
        ],
      },
      {
        q: [
          "查询时应该填什么？",
          "查詢要填什麼？",
          "Which inputs should I use?",
          "무엇을 입력하나요?",
          "何を入力する？",
        ],
        a: [
          "先到 [Kryptex PRL](https://pool.kryptex.com/en/prl) 核对挖矿连接使用的公开 PRL 收款地址，再在 [PRL 监控](/projects/prl) 添加同一地址。Worker 名需与矿工配置一致。若接入别的矿池，本站的 Kryptex 查询无法代表该池数据；同一个钱包也不会自动汇总跨矿池收入。",
          "先在 [Kryptex PRL](https://pool.kryptex.com/en/prl) 核對公開 PRL 收款地址，再於 [PRL 監控](/projects/prl) 加入相同地址，Worker 名須符合礦工設定。其他礦池資料不會由 Kryptex 查詢代表，同一錢包也不自動跨池合計。",
          "Check the public PRL payout address used by your miner at [Kryptex PRL](https://pool.kryptex.com/en/prl), then add that address in [PRL monitoring](/projects/prl). Match the configured worker name. A Kryptex lookup cannot represent another pool, and the same wallet does not automatically combine income across pools.",
          "[Kryptex PRL](https://pool.kryptex.com/en/prl)에서 채굴기에 설정한 공개 지급 주소를 확인하고 [PRL 모니터](/projects/prl)에 같은 주소를 추가하세요. 워커 이름도 설정과 일치해야 합니다. Kryptex 조회는 다른 풀을 대표하지 않으며 같은 지갑도 풀 간 수익을 자동 합산하지 않습니다.",
          "[Kryptex PRL](https://pool.kryptex.com/en/prl)でマイナー設定の公開受取アドレスを確認し、[PRL監視](/projects/prl)に追加します。ワーカー名も設定と一致させます。Kryptex照会で他プールを代表したり、同じウォレットの収益を跨いで自動合算したりはできません。",
        ],
      },
      {
        q: [
          "Worker 收益能单独算吗？为什么和矿工算力不同？",
          "能單算 Worker 收益嗎？為何算力不同？",
          "Can I isolate worker rewards or compare instantaneous hashrate?",
          "워커별 수익과 순간 해시레이트를 비교할 수 있나요?",
          "ワーカー別報酬・瞬間速度を比較できる？",
        ],
        a: [
          "本站 Worker 筛选针对算力与状态，钱包收益仍属于整个地址，不能重复记到每台机器上。矿工本地瞬时算力与矿池按份额计算的平均算力窗口不同；先核对份额、样本时间及矿池周期。钱包今日收益按来源的 UTC 日统计，余额和累计付款分开显示，不等于已提现净利润。",
          "Worker 篩選針對算力及狀態，收益屬於整個地址，不能重複記到各台。礦工瞬時算力與礦池份額平均窗口不同，先查份額、時間及周期。今日收益依來源 UTC 日，餘額與累計付款分開，並非提領後淨利。",
          "Worker filtering applies to hashrate and activity; reward totals remain wallet-wide and must not be copied to each machine. Local instantaneous hashrate and pool share-based averages use different windows. Check accepted shares, sample times and pool periods. Today's pool earnings use the source's UTC day; unpaid balance and cumulative payments are separate, not withdrawn net profit.",
          "워커 필터는 성능·상태에 적용되고 수익은 지갑 전체 기준이므로 기기마다 복사하지 마세요. 로컬 순간 속도와 풀의 제출 지분 평균은 기간이 다릅니다. 유효 지분·샘플 시각·풀 기간을 확인하세요. 오늘 수익은 출처의 UTC 일자이며 미지급 잔액·누적 지급·순이익은 다릅니다.",
          "ワーカーフィルターは速度と状態用で、報酬はウォレット全体です。各機器へ重複計上しません。ローカル瞬間速度とプールのシェア平均は期間が異なり、受理シェア・時刻・集計期間を確認します。当日収益は取得元UTC日で、未払残高・累計支払・純利益は別です。",
        ],
      },
      {
        q: [
          "地址为什么下次还要输入？",
          "為何下次仍要輸入地址？",
          "How do I keep multiple addresses?",
          "여러 주소를 저장하려면?",
          "複数アドレスを保存するには？",
        ],
        a: [
          "使用项目页的添加/保存入口把地址加入清单，不只做一次临时查询。多个地址分别命名；登录后保存到账号，换设备使用同一账号。未登录清单只保留在当前浏览器。打开 [PRL 监控](/projects/prl) 核对来源与字段。",
          "用專案頁新增/儲存入口加入清單，不只臨時查詢。多個地址分別命名，登入後同步到帳號，未登入則只留在目前瀏覽器。開啟 [PRL 監控](/projects/prl) 核對來源與欄位。",
          "Use Add/Save on the project page to place addresses in the saved list, rather than only running a one-off query. Name multiple entries separately and sign in to sync them to your account. Signed-out entries remain in the current browser. Open [PRL monitoring](/projects/prl) to check source fields.",
          "일회 조회만 하지 말고 프로젝트 페이지의 추가·저장으로 목록에 넣으세요. 여러 주소에 이름을 붙이고 로그인해 계정에 동기화하세요. 비로그인 목록은 현재 브라우저에만 저장됩니다. [PRL 모니터](/projects/prl)에서 출처 필드를 확인하세요.",
          "一時照会だけでなくプロジェクトの追加・保存で一覧に登録します。複数アドレスに名前を付け、ログインでアカウント同期します。未ログインなら現ブラウザ内だけです。[PRL監視](/projects/prl)で取得元と項目を確認してください。",
        ],
      },
    ],
    ["mining-dashboard-vs-official-dashboards", "monitor-one-device-across-projects"],
    [
      {
        name: "Pearl Metal miner",
        url: "https://github.com/Breakwater-ecosystem/pearl-metal-miner",
      },
      { name: "Kryptex · PRL pool", url: "https://pool.kryptex.com/en/prl" },
    ],
  ),
  guide(
    "noid-address-not-found",
    "noid",
    [
      "NOID 地址查不到？先核对 InnovLab 与 Parano1d 矿池",
      "NOID 地址查不到？先核對 InnovLab 與 Parano1d 礦池",
      "NOID address not found: InnovLab and Parano1d pool checks",
      "NOID 주소가 조회되지 않을 때: InnovLab·Parano1d 확인",
      "NOIDアドレスが見つからない：InnovLabとParano1dの確認",
    ],
    [
      "同一个 NOID 地址在不同矿池可能有不同结果。地址查不到不等于设备停止；核对矿池、地址及有效份额后再判断。",
      "同一 NOID 地址在不同礦池可能有不同結果。查不到不代表設備停止，應先核對礦池、地址與有效份額。",
      "The same NOID address can have different results at different pools. Not found does not establish a stopped miner: check the pool, exact address and accepted shares first.",
      "같은 NOID 주소라도 풀마다 조회 결과가 다릅니다. 조회 없음이 채굴기 중지를 뜻하지 않습니다. 풀·주소·유효 지분부터 확인하세요.",
      "同じNOIDアドレスでもプールごとに結果は異なります。見つからないだけで停止とは判断せず、プール・正確なアドレス・受理シェアを確認します。",
    ],
    [
      {
        q: [
          "为什么 InnovLab 能查到，另一处没有？",
          "為何 InnovLab 查得到而另一處沒有？",
          "Why does InnovLab find the address but another pool does not?",
          "InnovLab에서만 조회되는 이유는?",
          "InnovLabだけで見つかる理由は？",
        ],
        a: [
          "矿池独立记录该地址提交的份额和付款，不共享完整账本。本站先查 Parano1d Pool，无记录或失败时再查 InnovLab，并标注实际来源，不跨池合计。在 [NOID 监控](/projects/noid) 核对显示的来源，再与 [InnovLab](https://noid.innovlab.cc/) 的相同地址比较。",
          "礦池各自記錄份額及付款，不共享完整帳本。本站先查 Parano1d Pool，無紀錄或失敗再查 InnovLab，標示實際來源、不跨池合計。在 [NOID 監控](/projects/noid) 核對來源，再與 [InnovLab](https://noid.innovlab.cc/) 同地址比較。",
          "Pools maintain their own shares and payments, not a shared complete ledger. IOTA Watch tries Parano1d Pool first and falls back to InnovLab when absent or unavailable, labels the source, and does not sum pools. Compare the source in [NOID monitoring](/projects/noid) with the same address on [InnovLab](https://noid.innovlab.cc/).",
          "풀은 자체 지분·지급 기록을 관리하며 전체 장부를 공유하지 않습니다. 도구는 Parano1d Pool부터 조회하고 없거나 실패하면 InnovLab으로 전환하며 출처를 표시하고 합산하지 않습니다. [NOID 모니터](/projects/noid)의 출처와 [InnovLab](https://noid.innovlab.cc/)의 같은 주소를 비교하세요.",
          "プールは各自のシェア・支払を管理し、完全な共通台帳ではありません。当サイトはParano1d Poolを先に照会し、不在・失敗時にInnovLabを照会、取得元を表示して合算しません。[NOID監視](/projects/noid)と[InnovLab](https://noid.innovlab.cc/)の同じアドレスを比較します。",
        ],
      },
      {
        q: [
          "复制的是完整链接怎么办？",
          "複製完整連結時怎麼辦？",
          "What if I copied a full explorer link?",
          "전체 링크를 복사했다면?",
          "ページのURLをコピーした場合は？",
        ],
        a: [
          "例如 https://noid.innovlab.cc/#miner=地址 中，查询标识是 #miner= 后面的公开地址。优先只复制该地址，检查首尾空格和截断，不填私钥。先在原矿池确认存在有效份额；首次提交后数据需要按矿池自身节奏出现，本站不能保证固定等待时间。",
          "例如 https://noid.innovlab.cc/#miner=地址，識別碼是 #miner= 後的公開地址。只複製地址並檢查空白與截斷，不填私鑰。先到原池確認有效份額，首次提交後資料依礦池節奏出現，不保證固定等待時間。",
          "In https://noid.innovlab.cc/#miner=ADDRESS, the public identifier is the value after #miner=. Prefer pasting that address alone; check whitespace and truncation, never a private key. Confirm accepted shares at the original pool. First-share visibility follows the pool's own update cycle; no fixed appearance time is guaranteed.",
          "https://noid.innovlab.cc/#miner=ADDRESS 에서 공개 ID는 #miner= 뒤 주소입니다. 주소만 복사하고 공백·잘림을 확인하며 비밀키는 입력하지 마세요. 원래 풀의 유효 지분을 먼저 확인하세요. 첫 제출 표시 시점은 풀 갱신 주기에 따라 달라 보장되지 않습니다.",
          "https://noid.innovlab.cc/#miner=ADDRESS の公開IDは#miner=以降です。アドレスだけをコピーし、空白・欠落を確認、秘密鍵は入力しません。元プールで受理シェアを確認してください。最初の反映はプールの更新周期によるため固定時間は保証しません。",
        ],
      },
      {
        q: [
          "余额、累计付款、在线分别是什么意思？",
          "餘額、累計付款與在線有何不同？",
          "What do balance, paid and online actually mean?",
          "잔액·누적 지급·온라인은 무엇인가요?",
          "残高・累計支払・オンラインの違いは？",
        ],
        a: [
          "InnovLab 提供已确认待付余额和累计付款，本站没有该来源的完整设备级今日收益。地址级在线不能代表同一钱包下每台机器都在线。不要把余额、累计付款或滚动 24 小时付款当作单机当日收入。为多个地址保存独立条目并登录同步；见 [NOID 指南](/learn/noid-monitor-guide)。",
          "InnovLab 提供已確認待付餘額及累計付款，本站沒有此來源完整單機今日收益。地址在線不代表錢包下每台都在線，餘額、累計及滾動 24 小時付款不能當作單機當日收入。多地址分開儲存並登入同步，見 [NOID 指南](/learn/noid-monitor-guide)。",
          "InnovLab supplies confirmed unpaid balance and cumulative payments, not complete per-device daily earnings in this tool. Address-level online does not establish that every machine sharing a wallet is online. Balance, total paid and rolling 24-hour payments are not individual-machine daily income. Save addresses separately and sign in to sync; see [NOID guide](/learn/noid-monitor-guide).",
          "InnovLab은 확정 미지급 잔액·누적 지급을 제공하며 이 도구의 완전한 기기별 일일 수입은 아닙니다. 주소 온라인이 지갑 아래 모든 기기의 온라인을 뜻하지 않습니다. 잔액·누적 지급·최근 24시간 지급을 단일 기기의 일일 수입으로 보지 마세요. 주소별 저장·로그인 동기화는 [NOID 안내](/learn/noid-monitor-guide)를 참조하세요.",
          "InnovLabは確定未払残高と累計支払を提供しますが、当ツールで完全な機器別日次収入は取得できません。アドレスのオンラインは共有ウォレット配下の全機器の稼働を証明しません。残高・累計・直近24時間支払を1台の日次収入にしないでください。個別保存・同期は[NOIDガイド](/learn/noid-monitor-guide)へ。",
        ],
      },
    ],
    ["noid-monitor-guide", "monitor-one-device-across-projects"],
    [
      { name: "InnovLab · NOID pool", url: "https://noid.innovlab.cc/" },
      {
        name: "IOTA Watch · NOID adapter",
        url: "https://github.com/molimao/iota/blob/main/src/lib/platforms.server.ts",
      },
    ],
  ),
];
