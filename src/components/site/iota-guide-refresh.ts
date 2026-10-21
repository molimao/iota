import type { Article } from "./articles";
import { LOCALES } from "@/lib/site";
import { localized as l } from "@/lib/product-discovery";
import { iotaPublicFacts } from "@/lib/iota-public-facts";
type Five = [string, string, string, string, string];
type Editorial = {
  slug: string;
  title: Five;
  summary: Five | null;
  decision: Five;
  action: Five;
  headers: Five;
  rows: [Five, Five][];
  sections: [Five, Five][];
  related: string[];
  sources: { name: string; url: string }[];
  existing: boolean;
};
const editions: Editorial[] = [
  {
    slug: "iota-queue-and-zero-throughput",
    title: [
      "IOTA 一直排队、0 tokens/s：该等还是该重启？",
      "IOTA 一直排隊、0 tokens/s：該等還是重啟？",
      "IOTA queued or 0 tokens/s: wait or restart?",
      "IOTA 대기·0 tokens/s: 기다릴까요, 재시작할까요?",
      "IOTA待機中・0 tokens/s：待つ？再起動する？",
    ],
    summary: [
      "有近期排队响应、没有停止或崩溃证据时，先保持训练开启。0 tokens/s 本身不足以判断故障；先核对采样时间，再决定是否重启。",
      "有近期排隊回應且無停止、崩潰證據時，先保持訓練。0 tokens/s 本身不足以判斷故障，先核對取樣時間。",
      "Keep training enabled when a recent response says queued and there is no stop or crash evidence. Zero throughput alone is not a failure diagnosis; check timestamps before restarting.",
      "최근 응답이 대기이고 중지·충돌 증거가 없다면 훈련을 켜 두세요. 처리량 0만으로 장애를 판단하지 말고 시각부터 확인하세요.",
      "新しい応答が待機を示し、停止・クラッシュの証拠がなければ学習を有効に保ちます。処理量ゼロだけで故障と判断せず、取得時刻を確認します。",
    ],
    decision: [
      "先核对，再重启",
      "先核對，再重啟",
      "Check before restarting",
      "재시작 전에 확인",
      "再起動の前に確認",
    ],
    action: [
      "[查看设备状态](/app) · [管理已配对的 Mac](/machines)",
      "[查看設備狀態](/app) · [管理已配對 Mac](/machines)",
      "[Check device status](/app) · [Manage paired Macs](/machines)",
      "[기기 상태](/app) · [연결한 Mac 관리](/machines)",
      "[機器の状態](/app) · [ペアリング済みMac](/machines)",
    ],
    headers: [
      "看到什么／怎么处理",
      "看到什麼／如何處理",
      "What you see / what to do",
      "관찰 / 조치",
      "状態／対処",
    ],
    rows: [
      [
        [
          "近期 queued／有排队名次",
          "近期 queued／有排隊名次",
          "Recent queued response / rank",
          "최근 queued 응답·순번",
          "新しいqueued応答・順位",
        ],
        [
          "保持开启，观察下一次有效更新；名次不能换算等待时长。",
          "保持開啟，觀察下次更新，勿將名次換算等待時間。",
          "Keep enabled and watch the next fresh update; rank is not an ETA.",
          "켜 둔 채 다음 갱신을 확인하세요. 순번은 대기 시간 예측이 아닙니다.",
          "有効のまま次の更新を確認。順位から待ち時間は算出できません。",
        ],
      ],
      [
        [
          "吞吐量大于零且采样较新",
          "吞吐量大於零且取樣較新",
          "Fresh positive throughput",
          "최근의 양수 처리량",
          "新しい正の処理量",
        ],
        [
          "官方样本报告有训练贡献，仍须结合本机日志判断当前状态。",
          "官方樣本有貢獻，當前狀態仍需結合本機日誌。",
          "The official sample reports contribution; local logs establish current activity.",
          "공식 표본에 기여가 있습니다. 현재 상태는 로컬 로그도 확인하세요.",
          "公式サンプルは貢献を報告しています。現在の状態はローカルログも確認。",
        ],
      ],
      [
        [
          "心跳过期／读取失败",
          "心跳過期／讀取失敗",
          "Stale heartbeat / failed fetch",
          "오래된 하트비트·조회 실패",
          "応答が古い・取得失敗",
        ],
        [
          "先检查 Agent 和网络，不能把未知当成离线或零贡献。",
          "先檢查 Agent 與網路，未知不等於離線或零貢獻。",
          "Check agent and connectivity; unknown is not offline or zero contribution.",
          "에이전트·연결부터 확인하세요. 미상은 오프라인이나 0 기여가 아닙니다.",
          "Agentと接続を確認。不明はオフラインや貢献ゼロとは異なります。",
        ],
      ],
      [
        [
          "训练停止／出现退出记录",
          "訓練停止／退出記錄",
          "Stopped training / exit record",
          "훈련 중지·종료 기록",
          "学習停止・終了記録",
        ],
        [
          "转到停止训练指南，核对日志后恢复。",
          "依停止訓練指南核對日誌後恢復。",
          "Use the stopped-training guide and inspect logs before recovery.",
          "훈련 중지 안내에서 로그 확인 후 복구하세요.",
          "学習停止ガイドでログを確認して復旧します。",
        ],
      ],
    ],
    sections: [
      [
        [
          "排队名次和卡片状态为什么不一致？",
          "排隊名次與卡片狀態為何不同？",
          "Why do queue rank and the project badge disagree?",
          "대기 순번과 프로젝트 상태가 왜 다른가요?",
          "待機順位とプロジェクト表示が違う理由は？",
        ],
        [
          "排队名次来自已配对 Agent 读取的本机注册日志；项目卡片来自官方矿工名单，两者时钟不同。本站仅采纳当前训练进程启动后、五分钟内的排队记录；设备在线还要求心跳在 90 秒内。出现“#235＋名单未找到”时，应分别检查来源和时间，而不是直接判定电脑离线。",
          "排隊名次來自 Agent 的本機註冊日誌，卡片來自官方名單，兩者時鐘不同。只採納當前程序啟動後五分鐘內的排隊記錄；在線另需 90 秒內心跳。「#235＋名單未找到」應分別核對來源。",
          "Queue rank comes from local registration logs through the paired agent; the project badge comes from official rosters. The agent accepts queue records after the current worker launch and within five minutes; online also requires a heartbeat within 90 seconds. A rank beside Not in roster calls for comparing sources, not declaring the Mac offline.",
          "순번은 연결한 에이전트의 로컬 등록 로그, 프로젝트 상태는 공식 명단에서 옵니다. 현재 워커 시작 후 5분 이내 순번을 사용하고 온라인은 90초 이내 하트비트가 필요합니다. 명단 누락과 순번이 함께 보이면 출처와 시각을 비교하세요.",
          "順位はペアリング済みAgentの登録ログ、カードは公式名簿が出典です。現在のワーカー起動後5分以内の順位を使い、オンラインには90秒以内の応答が必要です。順位と名簿未検出が併存する場合、出典と時刻を確認します。",
        ],
      ],
      [
        [
          "全网有空位，为什么我还在排队？",
          "全網有空位，為何仍排隊？",
          "Why am I queued when the network has spare seats?",
          "빈자리가 있는데 왜 대기하나요?",
          "全体に空席があっても待機するのは？",
        ],
        [
          "全网容量是各任务合计，不是你的可加入名额。运行条件、资格及数据更新时间都可能不同，不能承诺下一个空位属于你。查看本页带时间的容量，再到 [分层与资格说明](/learn/iota-run-tiers) 核对这些字段的区别。",
          "全網容量不等於個人可加入名額；條件、資格、更新時刻可能不同，不保證下個空位。參考本頁容量與 [分層資格](/learn/iota-run-tiers)。",
          "Network-wide free seats are not seats your miner is eligible for. Run conditions, eligibility and refresh times differ. The next free seat is not promised to you. Compare the timestamped capacity on this page with [tiers and eligibility](/learn/iota-run-tiers).",
          "네트워크 빈자리 합계는 내게 허용된 자리 수가 아닙니다. 실행 조건·자격·갱신 시각이 다릅니다. 이 페이지의 용량과 [등급·자격](/learn/iota-run-tiers)을 함께 확인하세요.",
          "全体の空席は自分が参加できる席ではありません。実行条件・資格・更新時刻は異なります。このページの容量と[階層・資格](/learn/iota-run-tiers)を確認してください。",
        ],
      ],
      [
        [
          "什么时候才应该处理？",
          "何時才需要處理？",
          "When should I intervene?",
          "언제 조치해야 하나요?",
          "対処が必要なのは？",
        ],
        [
          "先记录应用版本、run ID、队列时间和最近日志。仅因名次倒退、CPU 低或零吞吐，不要反复重启、重装或换 ID。确认训练按钮恢复为 Start training、出现新退出日志，或 Agent 报告训练进程停止后，按 [停止训练与自动恢复](/learn/iota-training-stopped-auto-recovery) 处理。",
          "先記錄版本、run ID、時間及日誌。勿因名次退後、低 CPU 或零吞吐反覆重啟、重裝、換 ID。按鈕恢復 Start training、新退出日誌或程序停止，依 [自動恢復指南](/learn/iota-training-stopped-auto-recovery) 處理。",
          "Record app version, run ID, queue timestamp and recent logs. Do not repeatedly restart, reinstall or change ID for a rank jump, low CPU or zero throughput alone. A returned Start training button, a fresh exit log or a stopped worker needs the [recovery checklist](/learn/iota-training-stopped-auto-recovery).",
          "앱 버전·run ID·순번 시각·최근 로그를 기록하세요. 순번 하락·낮은 CPU·처리량 0만으로 재시작·재설치·ID 변경을 반복하지 마세요. Start training 버튼 복귀·새 종료 로그·워커 중지 시 [복구 안내](/learn/iota-training-stopped-auto-recovery)를 보세요.",
          "バージョン・run ID・順位の時刻・ログを記録します。順位後退・低CPU・ゼロ処理量だけで再起動・再インストール・ID変更を繰り返さず、Start trainingの再表示・新しい終了ログ・ワーカー停止なら[復旧手順](/learn/iota-training-stopped-auto-recovery)を確認します。",
        ],
      ],
    ],
    related: ["iota-training-stopped-auto-recovery", "iota-run-tiers", "iota-tier-promotion"],
    sources: [
      {
        name: "Macrocosmos · TAH user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
      {
        name: "Macrocosmos · Scoring, Rewards & Kicking",
        url: "https://docs.macrocosmos.ai/subnets/subnet-9-iota/scoring-rewards-and-kicking",
      },
      {
        name: "IOTA Watch · Agent 1.0.8 recovery implementation",
        url: "https://github.com/molimao/iota/blob/main/scripts/device-agent/iota_watch_agent.py",
      },
    ],
    existing: true,
  },
  {
    slug: "iota-training-stopped-auto-recovery",
    title: [
      "IOTA 训练停止但窗口还在：检查与自动恢复",
      "IOTA 訓練停止但視窗仍在：檢查與自動恢復",
      "IOTA training stopped but the app is open: check and recover",
      "IOTA 창은 열려 있는데 훈련이 중지됨: 확인과 복구",
      "IOTAの画面は開いたまま学習停止：確認と自動復旧",
    ],
    summary: [
      "先确认训练是否真的停止，再恢复。窗口还在、TRAINING 字样或残留子进程，都不能单独证明正在训练；查看新日志、训练按钮与吞吐量时间。",
      "先確認訓練是否停止再恢復。視窗、TRAINING 標籤或殘留子程序不證明訓練，應核對新日誌、按鈕及吞吐時間。",
      "Confirm training has stopped before recovering it. An open window, TRAINING label or leftover subprocess does not establish active work; compare fresh logs, the training button and throughput timestamps.",
      "복구 전에 실제 중지 여부부터 확인하세요. 열린 창·TRAINING 표시·남은 자식 프로세스만으로 훈련 중임을 알 수 없습니다. 최근 로그·버튼·처리량 시각을 비교하세요.",
      "復旧前に本当の停止を確認します。開いた画面・TRAINING表示・残留プロセスだけでは学習中と判定できません。新しいログ・ボタン・処理量の時刻を照合します。",
    ],
    decision: [
      "确认停止后，再恢复",
      "確認停止後再恢復",
      "Recover confirmed stops",
      "중지 확인 후 복구",
      "停止を確認して復旧",
    ],
    action: [
      "[打开 Mac 设置与日志](/machines) · [下载 Agent](/downloads)",
      "[Mac 設定與日誌](/machines) · [下載 Agent](/downloads)",
      "[Mac settings and logs](/machines) · [Download the agent](/downloads)",
      "[Mac 설정·로그](/machines) · [에이전트 다운로드](/downloads)",
      "[Mac設定・ログ](/machines) · [Agentダウンロード](/downloads)",
    ],
    headers: [
      "看到什么／怎么处理",
      "看到什麼／如何處理",
      "What you see / what to do",
      "관찰 / 조치",
      "状態／対処",
    ],
    rows: [
      [
        [
          "Start training 按钮重新出现",
          "Start training 按鈕重現",
          "Start training is available again",
          "Start training 버튼이 다시 표시됨",
          "Start trainingが再表示",
        ],
        [
          "核对是否手动停止；需要继续训练时再启动。",
          "確認是否手動停止，需要繼續時再啟動。",
          "Check for an intentional stop; resume if training is desired.",
          "의도적으로 중지했는지 확인한 뒤 필요하면 시작하세요.",
          "意図的な停止か確認し、続ける場合に開始。",
        ],
      ],
      [
        [
          "新崩溃记录、没有后续进度",
          "新崩潰記錄、無後續進度",
          "Fresh crash with no later progress",
          "새 충돌 후 진행 기록 없음",
          "新しいクラッシュ後に進捗なし",
        ],
        [
          "保存日志，检查 Agent 恢复设置及冷却状态。",
          "保存日誌，檢查恢復開關與冷卻狀態。",
          "Preserve logs; check recovery and its cooldown state.",
          "로그를 보존하고 복구 설정·대기 상태를 확인하세요.",
          "ログを保存し、復旧設定と待機状態を確認。",
        ],
      ],
      [
        [
          "仍在排队／日志继续更新",
          "仍排隊／日誌更新",
          "Still queued / logs progressing",
          "대기 중·로그 진행 중",
          "待機中・ログ更新あり",
        ],
        [
          "不要把等待当成崩溃反复重启。",
          "勿將等待當崩潰反覆重啟。",
          "Do not restart a normal wait as if it were a crash.",
          "정상 대기를 충돌로 판단해 재시작하지 마세요.",
          "正常な待機をクラッシュ扱いして再起動しない。",
        ],
      ],
    ],
    sections: [
      [
        [
          "先做这三步",
          "先做這三步",
          "Start with three checks",
          "먼저 세 가지 확인",
          "最初の3つの確認",
        ],
        [
          "1）在对应 Mac 核对 Start training 按钮。2）记录退出时间与前后日志，区分 SIGABRT、网络错误和内存不足。3）对照该时间之后是否还有真实训练进度。SIGABRT 本身不等于内存不足；不要只看系统中是否还留着 main_pool。",
          "1）核對 Start training。2）記錄退出時間及日誌，區分 SIGABRT、網路與記憶體問題。3）看退出後有無新進度。SIGABRT 不等於記憶體不足，殘留 main_pool 也非證明。",
          "1) Inspect Start training on the affected Mac. 2) Keep the exit time and surrounding logs to distinguish SIGABRT, network errors and memory exhaustion. 3) Check whether real progress follows that event. SIGABRT alone does not prove out-of-memory; a leftover main_pool is not sufficient evidence of work.",
          "1) 해당 Mac의 Start training을 확인합니다. 2) 종료 시각·주변 로그로 SIGABRT·네트워크 오류·메모리 부족을 구분합니다. 3) 그 후 실제 진행이 있는지 봅니다. SIGABRT만으로 메모리 부족이라 단정하거나 main_pool 잔존만으로 정상이라 판단하지 마세요.",
          "1）対象MacのStart trainingを確認。2）終了時刻と前後のログでSIGABRT・ネットワーク・メモリ不足を区別。3）終了後の実際の進捗を確認。SIGABRTだけでメモリ不足と決めず、残存main_poolだけを動作の証拠にしません。",
        ],
      ],
      [
        [
          "自动恢复怎么打开？",
          "如何開啟自動恢復？",
          "How do I enable recovery?",
          "자동 복구는 어떻게 켜나요?",
          "自動復旧の有効化方法は？",
        ],
        [
          "在 [Mac 设备管理](/machines) 下载并配对最新版 Agent，打开对应设备的设置，开启停止训练后自动恢复。它默认关闭、无需 Pro；日志上传是另一个开关。远程停止会关闭自动恢复，避免你主动停机后又被拉起。操作前确认名称与 Miner ID 属于同一台 Mac。",
          "在 [Mac 管理](/machines) 安裝配對最新版 Agent，於設備設定開啟停止訓練後恢復。預設關閉且不需 Pro；日誌上傳另設。遠端停止會關閉恢復，避免主動停機後再拉起，先核對名稱及 Miner ID。",
          "Install and pair the latest agent from [Mac management](/machines), then enable stopped-training recovery for that device. It is off by default and does not require Pro. Log upload is separate. A remote Stop disables recovery so an intentional stop is respected. Match the name and Miner ID before controlling a Mac.",
          "[Mac 관리](/machines)에서 최신 에이전트를 설치·연결하고 해당 기기의 훈련 중지 자동 복구를 켜세요. 기본 꺼짐·Pro 불필요이며 로그 업로드는 별도입니다. 원격 중지는 복구도 끄므로 의도적 중지를 존중합니다. 이름·Miner ID를 먼저 대조하세요.",
          "[Mac管理](/machines)で最新版を設置・ペアリングし、対象機器の学習停止後の自動復旧を有効化します。初期無効・Pro不要で、ログ送信は別設定。遠隔停止は復旧も無効化します。制御前に名前とMiner IDを照合してください。",
        ],
      ],
      [
        [
          "为什么没有立刻拉起？",
          "為何沒有立即恢復？",
          "Why is recovery not immediate?",
          "왜 즉시 복구되지 않나요?",
          "すぐ復旧しないのは？",
        ],
        [
          "当前实现持续观察缺失训练约 120 秒后才尝试恢复；两次恢复尝试之间至少间隔 15 分钟。若处于冷却、Agent 无心跳、权限或启动失败，应查看设置与日志，而不是反复发重启命令。排队不会触发恢复；恢复成功也不保证立即获得任务。以上为本站 Agent 实现，不是官方队列承诺。",
          "目前持續缺失約 120 秒才嘗試，兩次恢復至少隔 15 分鐘。冷卻、無心跳、權限或啟動失敗要查日誌，不要連續重啟。排隊不觸發，成功也不保證任務。這是本站實作。",
          "The current implementation waits about 120 seconds of missing training before attempting recovery, with at least 15 minutes between recovery attempts. Check cooldown, heartbeat, permissions and launch errors instead of repeatedly issuing Restart. Queuing does not trigger recovery, and a successful relaunch does not promise a task. These are agent implementation rules, not official queue guarantees.",
          "현재 구현은 훈련 부재 약 120초 후 복구를 시도하고 시도 간 최소 15분을 둡니다. 반복 재시작 대신 대기·하트비트·권한·실행 오류를 확인하세요. 대기는 복구를 유발하지 않으며 재실행도 작업 배정을 보장하지 않습니다. 이는 당사 구현입니다.",
          "現在の実装は学習の欠如を約120秒観察し、復旧試行の間隔を最低15分空けます。連続再起動ではなく待機・応答・権限・起動エラーを確認します。待機は復旧対象外で、復旧後のタスクも保証しません。当サイトAgentの実装です。",
        ],
      ],
    ],
    related: ["iota-queue-and-zero-throughput", "mac-status-and-restart", "how-rewards-work"],
    sources: [
      {
        name: "Macrocosmos · TAH user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
      {
        name: "Macrocosmos · Scoring, Rewards & Kicking",
        url: "https://docs.macrocosmos.ai/subnets/subnet-9-iota/scoring-rewards-and-kicking",
      },
      {
        name: "IOTA Watch · Agent 1.0.8 recovery implementation",
        url: "https://github.com/molimao/iota/blob/main/scripts/device-agent/iota_watch_agent.py",
      },
    ],
    existing: true,
  },
  {
    slug: "how-rewards-work",
    title: [
      "IOTA 昨日收益、累计与到账：邮件和网页怎么对账？",
      "IOTA 昨日收益、累計與入帳：郵件及網頁對帳",
      "IOTA rewards explained: reconcile yesterday, lifetime and payouts",
      "IOTA 보상 설명: 어제·누적·지급과 메일 대조",
      "IOTA報酬の確認：昨日・累計・着金とメール",
    ],
    summary: null,
    decision: [
      "先对齐日期与 IOTA 数量，再比较美元",
      "先對齊日期及 IOTA 數量，再比美元",
      "Match dates and token amounts before USD",
      "날짜·IOTA 수량부터 맞추세요",
      "日付とIOTA数量を先に照合",
    ],
    action: [
      "[查看昨日与累计收益](/app) · [查看历史趋势](/overview)",
      "[昨日與累計收益](/app) · [歷史趨勢](/overview)",
      "[Yesterday and lifetime](/app) · [Historical trends](/overview)",
      "[어제·누적 보상](/app) · [과거 추이](/overview)",
      "[昨日・累計報酬](/app) · [履歴の推移](/overview)",
    ],
    headers: [
      "字段／如何理解",
      "欄位／如何理解",
      "Field / interpretation",
      "항목 / 해석",
      "項目／読み方",
    ],
    rows: [
      [
        ["昨日收益", "昨日收益", "Yesterday's rewards", "어제 보상", "昨日の報酬"],
        [
          "本站将次日记账记录归属到前一天；不是实时收入。",
          "次日記帳歸前一天，非即時收入。",
          "Next-day accounting records attributed to the preceding date; not live income.",
          "다음 날 정산 기록을 전날로 표시하며 실시간 수입이 아닙니다.",
          "翌記帳日の記録を前日に表示。リアルタイム収入ではありません。",
        ],
      ],
      [
        [
          "累计 Total Earned",
          "累計 Total Earned",
          "Lifetime Total Earned",
          "누적 Total Earned",
          "累計Total Earned",
        ],
        [
          "含已付及待付，不要再次加 Total Paid。",
          "含已付、待付，勿再加 Total Paid。",
          "Includes paid and pending; do not add Total Paid again.",
          "지급·대기 금액을 포함하므로 Total Paid를 다시 더하지 마세요.",
          "支払済み・保留を含むためTotal Paidを再加算しません。",
        ],
      ],
      [
        ["美元估值", "美元估值", "USD estimate", "USD 추정값", "USD概算"],
        [
          "数量乘以估值时报价，不是钱包到账美元。",
          "數量乘估值時報價，非入帳美元。",
          "Token amount times the quote at valuation, not dollars received.",
          "환산 시 가격을 곱한 값이며 달러 수령액이 아닙니다.",
          "数量×換算時価格で、受領ドル額ではありません。",
        ],
      ],
    ],
    sections: [
      [
        [
          "一个日期对账例子",
          "日期對帳示例",
          "A dated reconciliation example",
          "날짜 대조 예시",
          "日付の照合例",
        ],
        [
          "演示，不是用户收益：北京时间 10 月 22 日的官方记账记录合计 1 IOTA，本站归入 10 月 21 日“昨日收益”。若 22 日 09:30 日报采集到这些记录，邮件也显示 21 日。以演示报价 $6/IOTA 计算为 $6；网页稍后若报价变成 $6.20，仍是 1 IOTA，但估值为 $6.20。先比相同日期的数量；数量不同时，再核对采集时间、记录状态及官方修订。",
          "演示非用戶收益：北京時間 10 月 22 日記帳合計 1 IOTA，本站列為 21 日昨日收益。若 22 日 09:30 日報已取到該記錄，也列 21 日。演示價 $6 時估 $6，稍後 $6.20 時估 $6.20，數量仍是 1。數量不同再查採集時間、狀態及官方修訂。",
          "Illustration, not user earnings: 1 IOTA in October 22 accounting records is displayed under October 21 in UTC+8. If captured by the October 22 09:30 daily email, it carries the same October 21 label. A hypothetical $6 quote gives $6; a later $6.20 quote gives $6.20 for the same 1 IOTA. Compare token amounts for the same date first. If those differ, inspect capture time, record statuses and upstream revisions.",
          "사용자 수익이 아닌 예시: UTC+8 10월 22일 정산 기록 1 IOTA는 21일 어제 보상으로 표시합니다. 22일 09:30 메일이 수집한 경우 같은 21일입니다. 가정 가격 $6이면 $6, 나중에 $6.20이면 같은 1 IOTA가 $6.20입니다. 먼저 같은 날짜의 수량을 비교하고 다르면 수집 시각·상태·공식 수정 내역을 확인하세요.",
          "ユーザー収益ではない例：UTC+8の10月22日の記帳1 IOTAは21日の昨日報酬に表示。22日09:30のメールで取得できていれば同じ21日です。仮の価格$6なら$6、後で$6.20なら同じ1 IOTAが$6.20です。同日数量を先に比較し、異なる場合は取得時刻・状態・公式修正を確認します。",
        ],
      ],
      [
        [
          "有吞吐量，为什么收益仍会变化？",
          "有吞吐量，收益為何變動？",
          "Why can rewards change with similar throughput?",
          "처리량이 비슷한데 보상이 왜 달라지나요?",
          "処理量が同じでも報酬が変わる理由は？",
        ],
        [
          "官方评分说明按矿工在任务中的有效评分占比分配，再受任务分配、burn 与活跃周期等因素影响；吞吐量不是固定单价。即使自己做的工作相近，其他参与者及任务参数变化也可能改变收益。不同 run、layer 的机器不能只凭型号直接比较日收益。",
          "官方依有效評分占比，再按任務分配、burn、活躍周期調整，非固定吞吐單價。其他參與者及參數變動可影響收益；不同 run、layer 不宜只比型號。",
          "The official scoring guide distributes rewards by verified score share, scaled by run allocation, burning and active duration. Throughput has no fixed unit price. Changes in peers or run parameters can change earnings despite similar work. Hardware alone is not a fair comparison across runs and layers.",
          "공식 안내는 검증 점수 비중에 실행 배분·소각·활성 기간을 반영합니다. 처리량에 고정 단가가 있는 것이 아닙니다. 동료나 실행 매개변수가 변하면 비슷한 작업에도 보상이 달라지므로 run·layer가 다른 기기를 모델명만으로 비교하지 마세요.",
          "公式説明では検証済みスコアの比率に実行配分・burn・稼働期間を反映します。処理量の固定単価ではありません。同等の作業でも他参加者や設定の変化で報酬が変わり、run・layerが違う機器を型番だけで比較できません。",
        ],
      ],
      [
        [
          "累计已赚不等于钱包已到账",
          "累計已賺不等於入帳",
          "Earned is different from received",
          "발생 보상과 수령은 다릅니다",
          "獲得額と着金は別",
        ],
        [
          "先核对官方 Total Earned、Total Paid 与 Total Pending。付款门槛、冻结条件和支付周期以官方当前规则为准，不能用网页估值推断已到账。没有报价应显示未知，不应补成零；[分层说明](/learn/iota-run-tiers) 也不是固定收益承诺。",
          "核對 Total Earned、Total Paid、Total Pending。門檻、凍結及周期依官方現行規則，估值不證明入帳。缺報價為未知，非零；[分層](/learn/iota-run-tiers) 亦非收益承諾。",
          "Compare official Total Earned, Total Paid and Total Pending. Current official thresholds, freezes and payment cadence apply; a website valuation does not prove receipt. Missing quotes remain unknown, not zero. [Run tiers](/learn/iota-run-tiers) are not fixed-return promises.",
          "공식 Total Earned·Paid·Pending을 비교하세요. 지급 기준·동결·주기는 현재 공식 규칙을 따르며 웹 환산액은 수령 증거가 아닙니다. 가격이 없으면 미상이지 0이 아닙니다. [등급](/learn/iota-run-tiers)도 고정 수익 보장이 아닙니다.",
          "Total Earned・Paid・Pendingを確認。支払閾値・凍結・周期は現行公式ルールに従い、Webの概算は着金の証拠ではありません。価格欠損は不明でゼロではなく、[実行階層](/learn/iota-run-tiers)も固定収益を約束しません。",
        ],
      ],
    ],
    related: ["iota-queue-and-zero-throughput", "iota-run-tiers", "iota-rewards-in-usd"],
    sources: [
      {
        name: "Macrocosmos · TAH user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
      {
        name: "Macrocosmos · Scoring, Rewards & Kicking",
        url: "https://docs.macrocosmos.ai/subnets/subnet-9-iota/scoring-rewards-and-kicking",
      },
      {
        name: "IOTA Watch · reward date and report implementation",
        url: "https://github.com/molimao/iota",
      },
    ],
    existing: true,
  },
  {
    slug: "iota-tier-promotion",
    title: [
      "IOTA 怎么从 Iron 升到 Bronze、Silver？申请与核对清单",
      "IOTA 如何從 Iron 升至 Bronze、Silver？申請核對",
      "IOTA Iron to Bronze or Silver: application and eligibility checks",
      "IOTA Iron에서 Bronze·Silver로: 신청과 자격 확인",
      "IOTA IronからBronze・Silverへ：申請と資格の確認",
    ],
    summary: [
      "先通过官方计算资源申请入口提交真实设备信息，再以官方通知和实际运行资格为准。购买 IOTA Watch Pro、换 Miner ID 或反复重启，都不能替你获得官方晋级。",
      "先經官方計算資源入口提交真實設備資料，依通知及實際資格為準。購買本站 Pro、換 ID 或反覆重啟不能取得官方晉級。",
      "Use the official compute application and provide accurate hardware details; rely on official notifications and actual run eligibility. IOTA Watch Pro, a new Miner ID or repeated restarts cannot grant an official promotion.",
      "공식 컴퓨트 신청서에 실제 기기 정보를 제출하고 공식 통지와 실행 자격을 확인하세요. Pro 구매·ID 변경·반복 재시작은 공식 승급을 부여하지 않습니다.",
      "公式コンピュート申請に正確な機器情報を提出し、公式通知と実際の参加資格を確認します。当サイトProの購入・ID変更・連続再起動で公式昇格は得られません。",
    ],
    decision: [
      "申请走官方，监控看本站",
      "申請走官方，監控看本站",
      "Apply officially; monitor independently",
      "공식 신청과 독립 모니터링",
      "申請は公式・監視は独立",
    ],
    action: [
      "[打开官方申请表](https://iota.macrocosmos.ai/train-at-home/apply) · [查看分层区别](/learn/iota-run-tiers)",
      "[官方申請表](https://iota.macrocosmos.ai/train-at-home/apply) · [分層區別](/learn/iota-run-tiers)",
      "[Official application](https://iota.macrocosmos.ai/train-at-home/apply) · [Understand tiers](/learn/iota-run-tiers)",
      "[공식 신청](https://iota.macrocosmos.ai/train-at-home/apply) · [등급 구분](/learn/iota-run-tiers)",
      "[公式申請](https://iota.macrocosmos.ai/train-at-home/apply) · [階層の違い](/learn/iota-run-tiers)",
    ],
    headers: [
      "看到什么／怎么处理",
      "看到什麼／如何處理",
      "What you see / what to do",
      "관찰 / 조치",
      "状態／対処",
    ],
    rows: [
      [
        ["可以核实", "可核實", "Verified", "확인됨", "確認できたこと"],
        [
          "官方申请表用于审核计算资源和分层任务访问。",
          "官方申請用於審核資源及分層任務存取。",
          "The official form reviews compute for tiered-run access.",
          "공식 양식은 등급별 실행 접근을 위한 자원 검토용입니다.",
          "公式申請は階層別実行へのアクセス用の資源審査です。",
        ],
      ],
      [
        ["尚不能承诺", "尚不能承諾", "Not promised", "보장되지 않음", "約束できないこと"],
        [
          "固定晋级分数、审批天数、一定获批或收益倍数。",
          "固定分數、審批天數、必過或收益倍數。",
          "A fixed score, approval deadline, acceptance or reward multiplier.",
          "고정 점수·심사 기한·승인·수익 배수.",
          "固定スコア・審査日数・承認・収益倍率。",
        ],
      ],
    ],
    sections: [
      [
        [
          "申请前准备什么？",
          "申請前準備什麼？",
          "What should I prepare?",
          "무엇을 준비하나요?",
          "申請前に用意するものは？",
        ],
        [
          "核查于 2026-10-22：官方 Provider Compute Application 要求公开 coldkey、矿工类型、至少一种联系方式，以及设备类型、型号和数量；内存及网络速度等字段可补充。coldkey 是公开收款地址，不是设备 hotkey；不要提交私钥、助记词或钱包文件。请直接在官方表单填写，本站不代收申请。",
          "2026-10-22 核查：官方表單收公開 coldkey、礦工類型、至少一種聯絡方式、設備型號與數量，記憶體及網速可補充。coldkey 非 hotkey，勿交私鑰、助記詞、錢包檔，直接在官方填寫。",
          "Checked October 22, 2026: the official form requests a public coldkey, miner type, at least one contact method, and compute categories, models and unit counts. Memory and network details can be added. A coldkey is not a device hotkey. Never submit private keys, seeds or wallet files. Submit directly to the official site; we do not collect applications.",
          "2026-10-22 확인: 공식 양식은 공개 coldkey·채굴기 유형·연락처 최소 하나·자원 유형·모델·대수를 요청합니다. 메모리·네트워크 정보도 추가할 수 있습니다. coldkey와 기기 hotkey는 다르며 비밀키·시드·지갑 파일은 보내지 마세요. 공식 사이트에 직접 제출하세요.",
          "2026-10-22確認：公式フォームは公開coldkey・マイナー種別・連絡先1つ以上・機器種別・型番・台数を求め、メモリと回線情報も追加できます。coldkeyは機器hotkeyとは別です。秘密鍵・シード・ウォレットファイルは送らず、公式に直接提出します。",
        ],
      ],
      [
        [
          "还在找 Iron→Bronze 的教程？先看当前标签",
          "在找 Iron→Bronze 教程？先核對當前標籤",
          "Looking for Iron-to-Bronze advice? Check current labels first",
          "Iron→Bronze 안내를 찾나요? 현재 표기부터 확인하세요",
          "Iron→Bronzeの情報を探す前に現在のラベルを確認",
        ],
        [
          "不要把历史标签当成固定晋级路线。2026-10-22 的官方运行描述中，Bronze 已标为 Tier 0，并有 Silver 与 Gold 的 active 任务。先到 [分层说明](/learn/iota-run-tiers) 看核查记录，再对照自己的 run 和官方申请结果；本站不能据一个数字判断你的申请获批。",
          "歷史標籤並非固定晉級路線。2026-10-22 官方描述已有 Tier 0 (Bronze) 及 active Silver、Gold。先看 [分層核查](/learn/iota-run-tiers)，再比個人 run 與官方通知；一個數字不能證明獲批。",
          "Historical labels are not a fixed promotion ladder. On October 22, 2026, official run descriptions included Tier 0 (Bronze) and active Silver and Gold runs. Read the [dated tier check](/learn/iota-run-tiers), then compare your own run and official application outcome. A number alone does not prove approval.",
          "과거 표기를 고정 승급 경로로 보지 마세요. 2026-10-22 공식 설명에는 Tier 0 (Bronze)와 활성 Silver·Gold가 있었습니다. [등급 확인 기록](/learn/iota-run-tiers)과 내 run·공식 통지를 대조하세요. 숫자 하나로 승인을 판단할 수 없습니다.",
          "過去のラベルは固定昇格経路ではありません。2026-10-22の公式説明にはTier 0 (Bronze)とactiveのSilver・Goldがありました。[階層の確認記録](/learn/iota-run-tiers)と自分のrun・公式通知を照合し、数字だけで承認と判断しません。",
        ],
      ],
      [
        [
          "多久能升级？",
          "多久能升級？",
          "How long does promotion take?",
          "승급에 얼마나 걸리나요?",
          "昇格まで何日かかる？",
        ],
        [
          "此次核查的官方申请页只说明审核接受后通过邮件通知，没有承诺审批天数、Iron→Bronze→Silver 的固定评分门槛或收益倍数。因此不能据硬件型号、排队名次或提交时间倒推晋级日。保持联系方式可用，提交内容准确；后续资格问题通过官方渠道确认。",
          "官方只說接受後以郵件通知，未承諾天數、逐級固定分數或收益倍數。勿用型號、名次、提交時間推算升級日；保持聯絡有效，資格向官方確認。",
          "The reviewed official form says accepted applications are notified by email; it does not promise review days, a fixed Iron-to-Bronze-to-Silver score or a reward multiplier. Do not infer a promotion date from hardware, queue rank or submission time. Keep contacts reachable and ask official support about eligibility.",
          "확인한 공식 양식은 승인 시 이메일 통지만 설명하며 심사 일수·고정 승급 점수·수익 배수를 약속하지 않습니다. 모델·순번·신청 시각으로 승급일을 추정하지 말고 연락처를 유지하며 공식 지원에 자격을 확인하세요.",
          "確認した公式フォームは承認時のメール通知を示しますが、審査日数・固定昇格スコア・収益倍率は約束しません。型番・順位・申請時刻から昇格日を推測せず、連絡先を維持して資格は公式に確認してください。",
        ],
      ],
      [
        [
          "申请后看哪些数据？",
          "申請後看哪些資料？",
          "What should I monitor after applying?",
          "신청 후 무엇을 보나요?",
          "申請後に見る情報は？",
        ],
        [
          "保留当前 run ID、官方运行描述、近期吞吐量及错误时间线。先把断电、睡眠和重复崩溃处理好，但不要把本站的在线状态或“有训练贡献”当成官方已批准晋级。持续排队见 [排队指南](/learn/iota-queue-and-zero-throughput)，反复退出见 [恢复指南](/learn/iota-training-stopped-auto-recovery)。",
          "保留 run ID、官方描述、吞吐及錯誤時間線，處理斷電、睡眠、崩潰。本站在線或有貢獻不等於官方晉級。參閱 [排隊](/learn/iota-queue-and-zero-throughput) 與 [恢復](/learn/iota-training-stopped-auto-recovery)。",
          "Keep the run ID, official run description, recent throughput and error timeline. Address sleep, power loss and repeated crashes, but do not read our online or contributing badge as promotion approval. See [queue checks](/learn/iota-queue-and-zero-throughput) and [recovery](/learn/iota-training-stopped-auto-recovery).",
          "run ID·공식 설명·최근 처리량·오류 시간선을 보관하고 절전·전원·반복 충돌을 해결하세요. 온라인·기여 상태는 승급 승인이 아닙니다. [대기 안내](/learn/iota-queue-and-zero-throughput)와 [복구](/learn/iota-training-stopped-auto-recovery)를 보세요.",
          "run ID・公式説明・処理量・エラー時系列を保存し、スリープ・電源断・反復クラッシュを解消します。当サイトのオンライン・貢献表示は昇格承認ではありません。[待機確認](/learn/iota-queue-and-zero-throughput)・[復旧](/learn/iota-training-stopped-auto-recovery)を参照。",
        ],
      ],
    ],
    related: ["iota-run-tiers", "iota-queue-and-zero-throughput", "how-rewards-work"],
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
        name: "Macrocosmos · TAH user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
    ],
    existing: false,
  },
  {
    slug: "iota-run-tiers",
    title: [
      "IOTA Iron、Bronze、Silver、Gold：档位、资格和 layer 有什么区别？",
      "IOTA Iron、Bronze、Silver、Gold：檔位、資格與 layer",
      "IOTA Iron, Bronze, Silver and Gold: tiers, eligibility and layers",
      "IOTA Iron·Bronze·Silver·Gold: 등급·자격·레이어",
      "IOTA Iron・Bronze・Silver・Gold：階層・資格・レイヤー",
    ],
    summary: [
      "先区分任务档位、矿工资格和模型 layer。它们不等于电脑型号或在线状态；同样硬件也不能据此推导相同收益。当前任务标签以官方运行描述为准，缺失时保持未知。",
      "區分任務檔位、礦工資格與模型 layer，勿等同型號或在線狀態。相同硬體不保證同收益；任務標籤依官方描述，缺失為未知。",
      "Separate a run tier, a miner’s eligibility and a model layer. None is a hardware model or online status, and identical hardware does not imply equal rewards. Use official run descriptions for current labels; missing labels stay unknown.",
      "실행 등급·참여 자격·모델 레이어를 구분하세요. 기기 모델이나 온라인 상태가 아니며 동일 하드웨어도 같은 보상을 뜻하지 않습니다. 현재 표기는 공식 설명을 따르고 없으면 미상입니다.",
      "実行階層・マイナーの参加資格・モデルのレイヤーを区別します。型番やオンライン状態ではなく、同一機器でも同報酬とは限りません。現在のラベルは公式説明に従い、欠損は不明です。",
    ],
    decision: [
      "别把三个字段混在一起",
      "不要混淆三個欄位",
      "Three fields, three different meanings",
      "세 항목을 구분하세요",
      "3つの項目を区別",
    ],
    action: [
      "[查看官方运行与容量](/network) · [晋级申请清单](/learn/iota-tier-promotion)",
      "[運行與容量](/network) · [晉級申請](/learn/iota-tier-promotion)",
      "[Runs and capacity](/network) · [Application checklist](/learn/iota-tier-promotion)",
      "[실행·용량](/network) · [신청 확인](/learn/iota-tier-promotion)",
      "[実行と容量](/network) · [申請チェック](/learn/iota-tier-promotion)",
    ],
    headers: [
      "字段／它能说明什么",
      "欄位／能說明什麼",
      "Field / what it establishes",
      "항목 / 의미",
      "項目／分かること",
    ],
    rows: [
      [
        ["Tier／档位标签", "Tier／檔位標籤", "Tier label", "Tier 표시", "Tierラベル"],
        [
          "描述运行分组，不是芯片跑分或固定收益等级。",
          "描述運行分組，非晶片跑分或固定收益。",
          "A run grouping, not a chip benchmark or fixed return.",
          "실행 구분이며 칩 성능 점수나 고정 수익이 아닙니다.",
          "実行の区分で、チップ性能や固定収益ではありません。",
        ],
      ],
      [
        ["Eligibility／可加入资格", "Eligibility／資格", "Eligibility", "참여 자격", "参加資格"],
        [
          "由官方审核与运行条件决定，本站不能授予。",
          "由官方審核及條件決定，本站不能授予。",
          "Controlled by official review and run conditions; we cannot grant it.",
          "공식 심사·조건에 따르며 당사가 부여할 수 없습니다.",
          "公式審査・条件によるもので当サイトは付与できません。",
        ],
      ],
      [
        ["Layer／模型分层", "Layer／模型分層", "Model layer", "모델 레이어", "モデルのレイヤー"],
        [
          "模型管线的工作段，不是 Bronze、Silver 等档位。",
          "模型管線工作段，非 Bronze、Silver 檔位。",
          "A segment of the model pipeline, not a Bronze or Silver tier.",
          "모델 파이프라인의 구간이며 Bronze·Silver 등급과 다릅니다.",
          "モデル処理の区間でBronze・Silver階層とは別です。",
        ],
      ],
    ],
    sections: [
      [
        [
          "2026-10-22 核查：当前官方标签和旧教程不同",
          "2026-10-22 核查：官方標籤與舊教程不同",
          "October 22 check: current labels differ from older guides",
          "10월 22일 확인: 현재 표기는 과거 안내와 다릅니다",
          "10月22日確認：現在のラベルは旧ガイドと異なります",
        ],
        [
          "本次官方 /mainnet/runs 响应有 8 个 active 任务：4.13.7.6–9-tah 描述为 Tier 0 (Bronze)，4.13.7.10–11-tah 为 Tier 1 (Silver)，4.13.7.12–13-tah 为 Tier 2 (Gold)。这是核查时的运行描述快照，不是永久编号定义；不能继续套用“Iron=0、Gold 无活跃任务”的旧说法，也不能用 run ID 尾号推导未来任务档位。",
          "本次官方回應有 8 個 active：4.13.7.6–9-tah 為 Tier 0 (Bronze)，10–11 為 Tier 1 (Silver)，12–13 為 Tier 2 (Gold)。這是當時描述快照，非永久編號，勿沿用 Iron=0、Gold 無任務或以尾號推算未來檔位。",
          "The official /mainnet/runs response contained eight active runs: 4.13.7.6–9-tah were described as Tier 0 (Bronze), 4.13.7.10–11-tah as Tier 1 (Silver), and 4.13.7.12–13-tah as Tier 2 (Gold). This is a dated metadata snapshot, not a permanent numbering rule. Older claims that Iron is always 0 or Gold has no active runs do not match this response. Do not infer future tiers from a run ID suffix.",
          "공식 /mainnet/runs 응답의 활성 8개 중 4.13.7.6–9-tah는 Tier 0 (Bronze), 10–11은 Tier 1 (Silver), 12–13은 Tier 2 (Gold)였습니다. 이는 확인 당시 설명이며 영구 번호 규칙이 아닙니다. Iron=0·Gold 활성 없음이라는 과거 설명과 다르며 ID 끝자리로 미래 등급을 추정하지 마세요.",
          "公式/mainnet/runsの応答ではactiveが8件あり、4.13.7.6–9-tahはTier 0 (Bronze)、10–11はTier 1 (Silver)、12–13はTier 2 (Gold)でした。確認時のmetadataで永久的な番号規則ではありません。Ironは常に0・Gold稼働なしという旧説明と一致せず、ID末尾で将来の階層を推測しません。",
        ],
      ],
      [
        [
          "这些名称怎么用？",
          "這些名稱如何使用？",
          "How should I read the names?",
          "이름을 어떻게 읽나요?",
          "ラベルの読み方は？",
        ],
        [
          "Iron、Bronze、Silver、Gold 是你可能在运行分层讨论中看到的标签。本页不按 Mac 型号自动分级，也不承诺四档当前都有任务。核对具体 run ID 及官方 metadata 描述；本站全网页只展示读取到的运行标签，未知不会猜成某一档。缺失标签也不代表被封禁。",
          "這些是分層討論中的標籤，不按 Mac 型號自動分級，也不承諾四檔皆有任務。核對 run ID 與官方 metadata；未知不猜檔位，缺標籤不等於封禁。",
          "Iron, Bronze, Silver and Gold are labels encountered in tier discussions. This page does not grade Macs by model or assert that every named tier currently has a run. Match the specific run ID to its official metadata description. Our network view displays reported labels without guessing missing values. A missing label is not evidence of a ban.",
          "이 이름은 등급 설명에서 쓰이는 표기입니다. Mac 모델로 자동 등급을 매기거나 현재 모든 등급에 실행이 있다고 주장하지 않습니다. run ID와 공식 metadata를 대조하세요. 미상은 추측하지 않으며 표시 누락은 차단 증거가 아닙니다.",
          "これらは階層の説明に使われる名称です。Mac型番で自動格付けせず、全階層で現在実行があるとも断定しません。run IDと公式metadataを照合し、欠損ラベルを推測せず、未表示を禁止の証拠にしません。",
        ],
      ],
      [
        [
          "为什么同型号收入不同？",
          "為何同型號收入不同？",
          "Why do identical Macs earn different amounts?",
          "같은 모델의 보상이 왜 다른가요?",
          "同型番でも報酬が違うのは？",
        ],
        [
          "官方评分文档说明：模型分层的工作量及矿工数量不同；有效评分占比、运行分配和 burn 等共同影响奖励。比较时至少对齐 run、layer、时间段与记录状态，不能用一个档位名称代替收益计算。见 [收益对账](/learn/how-rewards-work)。",
          "官方說明模型 layer 的工作量、礦工數不同，評分占比、分配及 burn 影響獎勵。比對 run、layer、期間及狀態，檔位名不能代替計算。見 [收益對帳](/learn/how-rewards-work)。",
          "Official scoring documentation explains that layers differ in work and miner counts; verified score share, run allocation and burning affect rewards. Match run, layer, period and record status before comparing. A tier name is not a reward formula. See [rewards explained](/learn/how-rewards-work).",
          "공식 문서는 레이어별 작업·참여자 수 차이와 점수 비중·배분·소각의 영향을 설명합니다. run·layer·기간·상태를 맞춰 비교하세요. 등급 이름이 보상 공식은 아닙니다. [보상 설명](/learn/how-rewards-work)을 참고하세요.",
          "公式文書ではレイヤーごとの作業量・参加者数、検証スコア比率・配分・burnが報酬に影響すると説明します。run・layer・期間・状態を揃えて比較し、階層名を報酬計算の代用にしません。[報酬説明](/learn/how-rewards-work)も参照。",
        ],
      ],
      [
        [
          "想加入其他档位，下一步是什么？",
          "想加入其他檔位，下一步？",
          "How do I seek access to another tier?",
          "다른 등급 참여를 원하면?",
          "別の階層への参加を希望する場合は？",
        ],
        [
          "使用官方资源申请表，并按 [晋级核对清单](/learn/iota-tier-promotion) 准备公开 coldkey 和真实硬件资料。审批条件、开放任务及未来规则由官方决定。没有公开证据时，我们不会展示“再训练几小时即可升级”或“买 Pro 能升档”。",
          "經官方申請，依 [晉級清單](/learn/iota-tier-promotion) 準備公開 coldkey 及硬體資料。審批、開放任務由官方決定，不提供無證據倒數或買 Pro 升檔。",
          "Use the official application and the [promotion checklist](/learn/iota-tier-promotion) to prepare your public coldkey and actual hardware details. Approval, available runs and future rules belong to the project. Without published evidence, we do not show a promotion countdown or suggest Pro purchases upgrade official tiers.",
          "공식 양식과 [승급 확인 목록](/learn/iota-tier-promotion)에 따라 공개 coldkey·실제 하드웨어 정보를 준비하세요. 승인·실행 공개·규칙은 공식 측이 결정합니다. 근거 없는 승급 카운트다운이나 Pro 승급 주장은 하지 않습니다.",
          "公式申請と[昇格チェックリスト](/learn/iota-tier-promotion)に従い、公開coldkeyと実際の機器情報を準備します。審査・利用可能な実行・ルールは公式が決定し、根拠のない昇格カウントダウンやProによる公式昇格は表示しません。",
        ],
      ],
    ],
    related: ["iota-tier-promotion", "iota-queue-and-zero-throughput", "how-rewards-work"],
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
        name: "Macrocosmos · official run metadata",
        url: "https://iota-web.api.macrocosmos.ai/mainnet/runs",
      },
    ],
    existing: false,
  },
];
/** FAQ is rendered as a plain string in HTML, schema and text. Keep the same words, without Markdown. */
function plainFaq(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
function edition(e: Editorial, original?: Article): Article {
  const summary = e.summary ? l(e.summary) : iotaPublicFacts.day;
  return {
    ...original,
    slug: e.slug,
    project: "iota",
    ...(e.existing ? {} : { published: "2026-10-22" }),
    modified: "2026-10-22",
    title: l(e.title),
    description: summary,
    summary,
    topic: l(["操作与判断", "操作與判斷", "Checks and decisions", "확인과 판단", "確認と判断"]),
    decision: { title: l(e.decision), action: l(e.action) },
    comparisonTitle: l(e.headers),
    comparison: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        {
          headers: l(
            e.slug === "how-rewards-work" || e.slug === "iota-run-tiers"
              ? [
                  ["字段", "含义"],
                  ["欄位", "含義"],
                  ["Field", "Meaning"],
                  ["항목", "의미"],
                  ["項目", "意味"],
                ]
              : [
                  ["观察", "下一步"],
                  ["觀察", "下一步"],
                  ["Observation", "Next step"],
                  ["관찰", "다음 단계"],
                  ["状態", "次の行動"],
                ],
          )[locale],
          rows: e.rows.map(([a, b]) => [l(a)[locale], l(b)[locale]]),
        },
      ]),
    ) as NonNullable<Article["comparison"]>,
    body: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        [
          ...e.sections.flatMap(([h, b]) => ["## " + l(h)[locale], l(b)[locale]]),
          ...(e.slug === "how-rewards-work" && original?.evidence
            ? [original.body[locale].at(-1)!]
            : []),
        ],
      ]),
    ) as Article["body"],
    questions: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        e.sections
          .slice(0, 2)
          .map(([h, b]) => ({ question: l(h)[locale], answer: plainFaq(l(b)[locale]) })),
      ]),
    ) as NonNullable<Article["questions"]>,
    related: e.related,
    sources: e.sources,
  };
}
export const iotaTierGuides = editions.filter((e) => !e.existing).map((e) => edition(e));
export function refreshIotaGuide(article: Article): Article {
  const e = editions.find((e) => e.existing && e.slug === article.slug);
  return e ? edition(e, article) : article;
}
