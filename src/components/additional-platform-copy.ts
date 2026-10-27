import { localized as l } from "@/lib/product-discovery";
export const additionalPlatformEditorial = {
  noid: {
    title: l([
      "NOID 矿池监控：算力与结算记录",
      "NOID 礦池監控：算力與結算紀錄",
      "NOID pool monitor: hashrate and payouts",
      "NOID 풀 모니터: 해시레이트와 지급 기록",
      "NOIDプール監視：ハッシュレートと支払記録",
    ]),
    summary: l([
      "Parano1d Pool / InnovLab 的地址算力、付款记录及待付余额。",
      "Parano1d Pool / InnovLab 的地址算力、付款紀錄與待付餘額。",
      "Address hashrate, payouts and unpaid balance from Parano1d Pool / InnovLab.",
      "Parano1d Pool / InnovLab의 주소별 해시레이트, 지급 기록 및 미지급 잔액.",
      "Parano1d Pool / InnovLabのアドレス別ハッシュレート、支払記録と未払残高。",
    ]),
    identity: l([
      "填写 Parano1d 钱包的 o1… 公开收款地址。目前查询 Parano1d Pool / InnovLab；其他矿池或独立挖矿请查看原来源。",
      "填寫 Parano1d 錢包的 o1… 公開收款地址。目前查詢 Parano1d Pool / InnovLab；其他礦池或獨立挖礦請查看原來源。",
      "Enter the public o1… payout address from the Parano1d wallet. This integration covers Parano1d Pool / InnovLab; other pools and solo mining require their own source.",
      "Parano1d 지갑의 공개 o1… 지급 주소를 입력하세요. 현재 Parano1d Pool / InnovLab을 조회하며 다른 풀과 단독 채굴은 원래 소스에서 확인해야 합니다.",
      "Parano1dウォレットの公開o1…受取アドレスを入力します。対象はParano1d Pool / InnovLabで、別プールやソロ採掘は各取得元で確認してください。",
    ]),
    coverage: l([
    "数据每 5 分钟更新，按显示的矿池统计。在线状态属于地址；余额和付款不计入今日收益。",
    "資料每 5 分鐘更新，依顯示的礦池統計。在線狀態屬於地址；餘額與付款不計入今日收益。",
    "Updated every 5 minutes for the pool shown. Online status applies to the address; balances and payouts are not daily earnings.",
    "표시된 풀의 데이터를 5분마다 갱신합니다. 온라인 상태는 주소 기준이며 잔액과 지급액은 일일 수익이 아닙니다.",
    "表示されたプールのデータを5分ごとに更新します。オンライン状態はアドレス単位で、残高と支払は日次収益ではありません。",
  ]),
  },
  acurast: {
    title: l([
      "Acurast 查询：ACU 收益与设备心跳",
      "Acurast 查詢：ACU 收益與裝置心跳",
      "Acurast lookup: ACU rewards and processor heartbeats",
      "Acurast 조회: ACU 보상과 기기 하트비트",
      "Acurast照会：ACU報酬と機器ハートビート",
    ]),
    summary: l([
      "输入处理器或管理地址，查看 ACU 今日、昨日及累计到账奖励，以及关联设备和链上心跳。",
      "輸入處理器或管理地址，查看 ACU 今日、昨日及累計到帳獎勵、關聯裝置與鏈上心跳。",
      "Look up a processor or manager address for today’s, yesterday’s and cumulative ACU payouts, linked processors and on-chain heartbeats.",
      "프로세서 또는 관리 주소로 오늘·어제·누적 ACU 지급 보상과 연결된 기기 및 하트비트를 확인합니다.",
      "プロセッサまたは管理アドレスで本日・昨日・累計のACU受取報酬と関連機器・ハートビートを確認します。",
    ]),
    identity: l([
      "支持处理器地址和管理地址（SS58 或 0x 公钥）。自动识别地址类型，管理地址会列出名下设备。",
      "支援處理器與管理地址（SS58 或 0x 公鑰），自動識別並列出關聯裝置。",
      "Supports processor and manager addresses (SS58 or 0x public keys). Address roles are detected automatically; managers show their linked processors.",
      "프로세서와 관리 주소(SS58 또는 0x 공개키)를 모두 지원하며 연결된 기기를 자동으로 조회합니다.",
      "プロセッサと管理アドレス（SS58または0x公開鍵）を自動識別し、関連機器を表示します。",
    ]),
    coverage: l([
    "奖励按北京时间到账日期统计，同一管理身份只汇总一次；不含单独领取的质押、委托奖励和迁移代币。",
    "獎勵依北京時間到帳日期統計，同一管理身分只彙總一次；不含單獨領取的質押、委託獎勵及遷移代幣。",
    "Rewards are grouped by payout date (UTC+8) and counted once per manager. Separate staking, delegation and migration payouts are excluded.",
    "보상은 UTC+8 지급일 기준으로 관리 ID당 한 번 집계합니다. 별도 스테이킹·위임·마이그레이션 지급은 제외됩니다.",
    "報酬はUTC+8の受取日で集計し、管理IDごとに一度だけ計上します。別途受け取るステーキング・委任報酬と移行トークンは除外します。",
  ]),
  },
} as const;
export const additionalMetricCopy = {
  processors: l(["台处理器", "台處理器", "processors", "프로세서", "プロセッサ"]),
  managerIdentity: l(["主网管理身份", "主網管理身分", "Mainnet manager identity", "메인넷 관리 ID", "メインネット管理ID"]),
  payouts24: l([
    "近 24 小时付款",
    "近24小時付款",
    "Last-24-hour payouts",
    "최근 24시간 지급액",
    "直近24時間の支払",
  ]),
  balance: l(["待付余额", "待付餘額", "Unpaid balance", "미지급 잔액", "未払残高"]),
  hashrate: l([
    "矿池测得算力",
    "礦池測得算力",
    "Pool-measured hashrate",
    "풀 측정 해시레이트",
    "プール測定ハッシュレート",
  ]),
  paid: l(["累计付款", "累計付款", "Total payouts", "누적 지급액", "累計支払"]),
  registration: l([
    "主网处理器登记",
    "主網處理器登記",
    "Mainnet processor registration",
    "메인넷 프로세서 등록",
    "メインネットプロセッサ登録",
  ]),
  registered: l(["已登记", "已登記", "Registered", "등록됨", "登録済み"]),
  classification: l(["设备类型", "設備類型", "Device classification", "기기 분류", "機器分類"]),
};
