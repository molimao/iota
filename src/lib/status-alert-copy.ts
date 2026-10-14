import { localized } from "./product-discovery";

export const statusAlertCopy = {
  iota_not_found: localized([
    "当前训练名单中未找到此 Miner ID",
    "目前訓練名單中未找到此 Miner ID",
    "Miner ID missing from current training lists",
    "현재 학습 목록에서 Miner ID를 찾을 수 없습니다",
    "現在のトレーニング一覧に Miner ID がありません",
  ]),
  iota_idle: localized([
    "官方记录显示暂未参与训练",
    "官方記錄顯示暫未參與訓練",
    "Official data shows no training participation",
    "공식 데이터에 학습 참여가 표시되지 않습니다",
    "公式データでトレーニングへの参加が確認できません",
  ]),
  provider_offline: localized([
    "项目接口报告设备离线",
    "專案介面回報設備離線",
    "Project API reports this provider offline",
    "프로젝트 API에서 기기가 오프라인으로 보고되었습니다",
    "プロジェクト API がオフラインと報告しています",
  ]),
  unknown: localized([
    "训练状态需要核对（旧记录未保存具体原因）",
    "訓練狀態需要核對（舊記錄未儲存具體原因）",
    "Check training status (this older record has no specific reason)",
    "학습 상태 확인 필요 (이전 기록에 구체적인 사유가 없습니다)",
    "トレーニング状態の確認が必要です（旧記録に詳細な理由はありません）",
  ]),
  context: localized([
    "连续至少 20 分钟的检查未确认正常参与状态。最近一次检查结果如下。这不能证明电脑关机，也不代表收益已经停止。",
    "連續至少 20 分鐘的檢查未確認正常參與狀態。最近一次檢查結果如下。這不能證明電腦關機，也不代表收益已經停止。",
    "Checks over at least 20 minutes have not confirmed normal participation. The latest result is below. This does not establish that your computer is off or that earnings have stopped.",
    "최소 20분간의 확인에서 정상 참여 상태를 확인하지 못했습니다. 최근 결과는 아래와 같습니다. 컴퓨터 종료나 수익 중단을 의미하지는 않습니다.",
    "20分以上にわたる確認で通常の参加状態を確認できませんでした。直近の結果は以下のとおりです。パソコンの電源オフや収益の停止を断定するものではありません。",
  ]),
  since: localized(["开始观察", "開始觀察", "First observed", "최초 확인", "最初の検出"]),
  next: localized(["现在可以做什么", "現在可以做什麼", "What to check", "확인할 사항", "確認すること"]),
  iotaSteps: localized([
    "打开这台 Mac 的 IOTA 应用，确认 Miner ID 与监控记录一致，再查看是否正在排队或显示错误。若正在正常排队，可继续等待；不要仅凭本邮件反复重启。已配对的 Mac 可在设备卡片查看心跳、排队和进程状态。",
    "開啟這台 Mac 的 IOTA 應用，確認 Miner ID 與監控記錄一致，再查看是否正在排隊或顯示錯誤。若正在正常排隊，可繼續等待；不要僅憑本郵件反覆重新啟動。已配對的 Mac 可在設備卡片查看心跳、排隊和程序狀態。",
    "Open IOTA on this Mac. Check that its Miner ID matches your saved ID, then look for a queue position or an error. If it is queued normally, let it wait; do not repeatedly restart based only on this email. Paired Macs also show heartbeat, queue and process status on their device cards.",
    "Mac에서 IOTA를 열어 Miner ID가 저장된 ID와 일치하는지 확인하고 대기열 또는 오류를 확인하세요. 정상 대기 중이면 기다리세요. 이 메일만 보고 반복 재시작하지 마세요. 페어링된 Mac의 카드에서 연결, 대기열, 프로세스 상태도 확인할 수 있습니다.",
    "この Mac で IOTA を開き、Miner ID が保存した ID と一致するか、待機列やエラーが表示されているか確認してください。正常に待機中なら、そのまま待ってください。このメールだけを理由に再起動を繰り返さないでください。ペアリング済みの Mac はカードで接続・待機列・プロセスの状態も確認できます。",
  ]),
  platformSteps: localized([
    "打开项目官方控制台，核对该设备的连接状态和错误信息，并检查设备网络与项目服务是否运行。",
    "開啟專案官方控制台，核對該設備的連線狀態和錯誤訊息，並檢查設備網路與專案服務是否執行。",
    "Open the project's official dashboard to check this provider's connection and errors. Check the machine's network and whether its project service is running.",
    "프로젝트 공식 대시보드에서 연결 상태와 오류를 확인하세요. 기기 네트워크와 프로젝트 서비스 실행 여부도 확인하세요.",
    "プロジェクトの公式ダッシュボードで接続状態とエラーを確認し、機器のネットワークとプロジェクトのサービスが動作しているか確認してください。",
  ]),
};
