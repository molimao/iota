import type { SiteLocale } from "./site";
const locales = ["zh", "zh-TW", "en", "ko", "ja"] as const;
function five(values: [string, string, string, string, string]) {
  return Object.fromEntries(locales.map((locale, i) => [locale, values[i]])) as Record<
    SiteLocale,
    string
  >;
}
export const iotaPublicFacts = {
  privacyLimits: five([
    "本站不转移代币或签名交易。公开地址可能关联设备活动与收益，分享时请注意可见范围。",
    "本站不轉移代幣或簽名交易。公開地址可能關聯設備活動與收益，分享時請注意可見範圍。",
    "The site does not move tokens or sign transactions. Public addresses can be linked to device activity and rewards; consider that visibility when sharing them.",
    "사이트는 토큰 이동이나 거래 서명을 하지 않습니다. 공개 주소는 기기 활동·보상과 연결될 수 있으므로 공유 시 공개 범위를 고려하세요.",
    "当サイトはトークン移動や取引署名を行いません。公開アドレスは機器の活動や報酬と結び付くため、共有時には公開範囲をご確認ください。",
  ]),
  agent: five([
    "公开 Miner ID 查询只读取官方上报数据。安装并配对可选 Mac Agent 后，账号可查看设备心跳、排队及训练进程，远程启停、重启和更新代理；日志需单独开启。Agent 1.0.5 支持停止训练后自动恢复，默认关闭，不要求 Pro。",
    "公開 Miner ID 查詢只讀取官方回報。安裝並配對可選 Mac Agent 後，可查看心跳、排隊及訓練程序，遠端啟停、重啟及更新代理；日誌須另行啟用。1.0.5 支援停止訓練後自動恢復，預設關閉，不需 Pro。",
    "Public Miner ID lookup reads official reports only. An optional installed and paired Mac agent adds heartbeats, queue and worker state, remote start/stop/restart and agent updates. Logs require a separate opt-in. Agent 1.0.5 supports stopped-training recovery, off by default and available without Pro.",
    "공개 Miner ID 조회는 공식 보고만 읽습니다. 선택 Mac 에이전트를 설치·연결하면 하트비트·대기열·훈련 프로세스와 원격 시작·중지·재시작·에이전트 업데이트를 사용할 수 있습니다. 로그는 별도로 켭니다. 1.0.5 훈련 자동 복구는 기본 꺼짐이며 Pro가 필요하지 않습니다.",
    "公開Miner ID照会は公式報告のみです。任意のMacエージェントを設置・ペアリングすると、応答・待機順位・学習プロセスと遠隔起動・停止・再起動・代理更新を利用できます。ログは別途有効化します。1.0.5の学習自動復旧は初期無効、Pro不要です。",
  ]),
  day: five([
    "本站 IOTA 的「昨日收益」使用次日记账记录，按北京时间归属到前一天。例如 10 月 17 日读取的当天记录显示为 10 月 16 日收益；只合计 pending、settled，排除 frozen 及未来时间戳。这是本站展示口径，不证明每笔记录对应的实际训练发生日，也不代表钱包当天到账。",
    "本站 IOTA「昨日收益」依次日記帳紀錄，以北京時間歸屬到前一天。例如 10 月 17 日讀取當天紀錄顯示為 10 月 16 日收益；只計 pending、settled，排除 frozen 及未來時間。這是展示口徑，不證明實際訓練日，也不代表當日入帳。",
    "IOTA Watch labels IOTA as Yesterday's rewards by attributing the next accounting day's records to the preceding date in UTC+8. For example, records dated October 17 appear under October 16. Only pending and settled count; frozen and future timestamps are excluded. This display convention does not prove the actual training date or the date funds reached a wallet.",
    "IOTA Watch의 어제 보상은 다음 날 정산 기록을 UTC+8 기준 전날로 표시합니다. 예를 들어 10월 17일 기록은 10월 16일 보상으로 표시합니다. pending·settled만 합산하고 frozen·미래 기록은 제외합니다. 이는 표시 기준이며 실제 훈련일이나 지갑 수령일을 증명하지 않습니다.",
    "当サイトのIOTA「昨日の報酬」は、翌記帳日の記録をUTC+8で前日に帰属表示します。例えば10月17日の記録は10月16日の報酬です。pending・settledのみ合算し、frozen・未来時刻は除外します。これは表示基準で、実際の学習日や着金日を証明しません。",
  ]),
  totals: five([
    "累计收益取官方 Total Earned，不再次加上 Total Paid。美元为查询时市场估值，不是官方支付价格；无报价显示未知，不伪造为零。邮件与网页的昨日 IOTA 采用相同日期归属，但采集时刻、官方修订与估值时刻可能不同。",
    "累計收益使用官方 Total Earned，不再加 Total Paid。美元是查詢時市場估值，非官方支付價；無報價顯示未知。郵件與網頁昨日 IOTA 日期口徑一致，但採集、官方修訂與估值時刻可能不同。",
    "Lifetime uses official Total Earned without adding Total Paid again. USD is a market estimate at lookup, not an official payout price; a missing quote stays unknown. Daily email and website IOTA use the same preceding-day attribution, but capture time, upstream revisions and valuation time can differ.",
    "누적은 공식 Total Earned이며 Total Paid를 다시 더하지 않습니다. USD는 조회 시 시장 추정값으로 공식 지급 가격이 아니며 가격이 없으면 미상입니다. 메일·웹의 어제 IOTA는 같은 일자 기준이지만 수집·공식 수정·환산 시각은 다를 수 있습니다.",
    "累計は公式Total Earnedで、Total Paidを再加算しません。USDは取得時の市場概算で公式支払価格ではなく、価格なしは不明です。メールとWebは同じ前日帰属ですが、取得時刻・公式修正・換算時刻は異なる場合があります。",
  ]),
  dayTitle: five([
    "昨日收益怎么算？",
    "昨日收益怎麼計算？",
    "How are yesterday's rewards counted?",
    "어제 보상은 어떻게 계산하나요?",
    "昨日の報酬の計算方法は？",
  ]),
  agentTitle: five([
    "能远程管理 Mac 和恢复训练吗？",
    "能遠端管理 Mac 與恢復訓練嗎？",
    "Can I manage a Mac and recover stopped training?",
    "Mac 원격 관리와 훈련 복구가 가능한가요?",
    "Macの遠隔管理・学習復旧は可能？",
  ]),
};
