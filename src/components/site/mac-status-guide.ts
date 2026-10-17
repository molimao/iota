import type { Article } from './articles';
import { localized as l } from '@/lib/product-discovery';
import { LOCALES } from '@/lib/site';
import { insightCopy as c } from '../agent-insight-copy';
const title=l(['Mac 在线却没有收益，要不要重启？','Mac 在線卻沒有收益，要不要重啟？','Mac online but no rewards: should I restart?','Mac은 온라인인데 수익이 없나요? 재시작해야 하나요?','Macはオンラインなのに報酬がない：再起動すべき？']);
const intro=l(['先区分设备心跳、应用进程和官方训练贡献，再决定下一步。','先區分設備心跳、應用程序與官方訓練貢獻，再決定下一步。','Separate device heartbeat, app processes and official training contribution before taking action.','기기 상태 보고, 앱 프로세스, 공식 학습 기여를 구분한 후 조치하세요.','端末の応答、アプリのプロセス、公式の学習貢献を区別して判断します。']);
const cautions=l([
'“在线”只表示最近 90 秒收到代理心跳。“进程运行中”不能证明正在产生贡献。排队名次来自本机日志，超过 5 分钟不再作为当前名次显示；没有名次也不能证明已经开始训练。',
'「在線」只表示最近 90 秒收到代理心跳。「程序執行中」不能證明正在產生貢獻。排隊名次來自本機日誌，超過 5 分鐘不再顯示為目前名次；沒有名次也不能證明已開始訓練。',
'Online means an agent heartbeat arrived within 90 seconds. A running process does not prove contribution. Queue positions come from local logs and expire after five minutes; a missing position does not prove training has started.',
'온라인은 90초 이내에 에이전트 상태 보고를 받았다는 뜻입니다. 프로세스 실행은 기여를 증명하지 않습니다. 로컬 로그의 대기 순번은 5분 후 만료되며, 순번이 없다고 학습 중인 것은 아닙니다.',
'オンラインは90秒以内にエージェントの応答を受信した意味です。プロセスの存在は貢献を証明しません。ローカルログの待機順位は5分で失効し、順位がないことは学習開始の証拠ではありません。']);
const restart=l(['何时重启？','何時重啟？','When should I restart?','언제 재시작하나요?','いつ再起動する？']);
const restartBody=l([
'先检查最近状态与本机应用。应用已停止时可启动；应用仍运行但训练进程停止时，先看训练按钮和日志。仅凭收益为零、排队或旧数据，不足以判断需要重启。手动重启会中断当前进程。',
'先檢查最近狀態與本機應用。應用已停止時可啟動；應用仍執行但訓練程序停止時，先看訓練按鈕與日誌。僅憑收益為零、排隊或舊資料，不足以判斷需要重啟。手動重啟會中斷目前程序。',
'Check the latest status and the app on your Mac. Start it if stopped. If the app is open but its training process stopped, inspect the training button and logs first. Zero rewards, a queue or stale data alone do not justify restarting. Restart interrupts the current process.',
'최근 상태와 Mac 앱을 먼저 확인하세요. 앱이 중지되었다면 시작하세요. 앱은 실행 중이지만 학습 프로세스가 멈췄다면 학습 버튼과 로그를 확인하세요. 수익 0, 대기 또는 오래된 데이터만으로 재시작을 판단하지 마세요. 재시작은 현재 프로세스를 중단합니다.',
'最新の状態とMacのアプリを先に確認します。アプリが停止していれば起動します。アプリが開いていて学習プロセスだけ停止している場合、学習ボタンとログを確認します。報酬ゼロ、待機、古いデータだけで再起動を判断しないでください。再起動は現在のプロセスを中断します。']);
const resultTitle=l(['点击重启后怎么看结果？','點擊重啟後怎麼看結果？','How do I confirm a restart?','재시작 결과는 어떻게 확인하나요?','再起動結果を確認するには？']);
const resultBody=l([
'等待设备接收 → 已下发，等待执行结果 → 设备已确认完成。已下发表示服务端已发出命令，不能证明设备已执行。若未收到完成确认，先核对设备状态，不要连续点击。完成也不等于已经开始产生收益。',
'等待設備接收 → 已下發，等待執行結果 → 設備已確認完成。已下發表示伺服器已發出命令，不能證明設備已執行。若未收到完成確認，先核對設備狀態，不要連續點擊。完成也不等於已開始產生收益。',
'Waiting for device → Dispatched, awaiting result → Device confirmed completion. Dispatch does not prove execution. If confirmation is missing, check device status before retrying. Completion does not mean rewards have started.',
'기기 수신 대기 → 전송됨·결과 대기 → 기기가 완료 확인. 전송은 실행을 증명하지 않습니다. 완료 확인이 없다면 재시도 전 상태를 확인하세요. 완료가 수익 발생을 의미하지는 않습니다.',
'端末の受信待ち → 送信済み・結果待ち → 端末が完了を確認。送信だけでは実行を証明できません。完了確認がなければ再試行前に状態を確認します。完了は報酬発生を意味しません。']);
export const macStatusGuide:Article={slug:'mac-status-and-restart',project:'iota',published:'2026-10-15',modified:'2026-10-17',title,description:intro,summary:intro,topic:l(['设备排障','設備排障','Troubleshooting','문제 해결','トラブル対処']),related:['data-sources-and-freshness','find-miner-id'],sources:[{name:'IOTA Watch agent implementation',url:'https://github.com/molimao/iota/tree/main/scripts/device-agent'}],body:Object.fromEntries(LOCALES.map(locale=>[locale,[intro[locale],cautions[locale],...(['queued','preparing','waiting','working','uploading','merging','blocked','running','workerStopped','stopped','offline'] as const).flatMap(phase=>[`## ${c[phase][locale]}`,c[`${phase}Help`][locale]]),`## ${restart[locale]}`,restartBody[locale],`## ${resultTitle[locale]}`,resultBody[locale],`[${c.help[locale]}](/machines)`]])) as Article['body']};
