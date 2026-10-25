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
      "每 5 分钟查询。先查 Parano1d Pool，无记录或失败时再查 InnovLab；结果仅属于标注矿池，不跨池合计。InnovLab 显示已确认待付余额与累计付款，暂不提供近24小时付款。在线是地址级状态，不代表每台机器在线；余额和付款不计入今日收益。",
      "每5分鐘查詢。先查Parano1d Pool，無紀錄或失敗時再查InnovLab；僅顯示標示礦池，不跨池合計。InnovLab顯示已確認待付餘額及累計付款，暫無近24小時付款。在線為地址狀態；餘額和付款不計入今日收益。",
      "Refreshes every 5 minutes. Checks Parano1d Pool first, then InnovLab on a miss or failure. Results belong to the named pool, not a cross-pool total. InnovLab provides confirmed unpaid balance and lifetime payouts, but no rolling-24h payouts here. Online is address-level; balances and payouts are not daily earnings.",
      "5분마다 Parano1d Pool을 먼저 조회하고 기록이 없거나 실패하면 InnovLab을 조회합니다. 표시된 풀의 결과만 보여주며 풀 간 합산하지 않습니다. InnovLab은 확정 미지급 잔액과 누적 지급액을 제공하며 24시간 지급액은 아직 미지원입니다. 온라인은 주소 기준이며 잔액·지급액은 오늘 수익이 아닙니다.",
      "5分ごとにParano1d Poolを確認し、記録なし・失敗時はInnovLabを照会します。表示元のプールのみで、複数プールの合計ではありません。InnovLabは確定未払残高と累計支払を表示し、24時間支払は未対応です。オンラインはアドレス単位で、残高や支払は当日収益に含みません。",
    ]),
  },
  acurast: {
    title: l([
      "Acurast 查询：设备心跳与管理地址",
      "Acurast 查詢：裝置心跳與管理地址",
      "Acurast lookup: processors, managers and heartbeats",
      "Acurast 조회: 프로세서, 관리자 및 하트비트",
      "Acurast照会：プロセッサ・管理者・ハートビート",
    ]),
    summary: l([
      "输入处理器或管理地址，查看 Acurast 主网设备及链上心跳。",
      "輸入處理器或管理地址，查看 Acurast 主網裝置及鏈上心跳。",
      "Enter a processor or manager address to view Acurast mainnet processors and on-chain heartbeats.",
      "프로세서 또는 관리 주소로 Acurast 메인넷 기기와 온체인 하트비트를 조회합니다.",
      "プロセッサまたは管理アドレスでメインネット機器とオンチェーンハートビートを確認します。",
    ]),
    identity: l([
      "支持处理器地址和管理地址（SS58 或 0x 公钥）。自动识别地址类型，管理地址会列出名下设备。",
      "支援處理器與管理地址（SS58 或 0x 公鑰），自動識別並列出關聯裝置。",
      "Supports processor and manager addresses (SS58 or 0x public keys). Address roles are detected automatically; managers show their linked processors.",
      "프로세서와 관리 주소(SS58 또는 0x 공개키)를 모두 지원하며 연결된 기기를 자동으로 조회합니다.",
      "プロセッサと管理アドレス（SS58または0x公開鍵）を自動識別し、関連機器を表示します。",
    ]),
    coverage: l([
      "读取官方主网已确认的设备归属与心跳。收益、质押奖励和余额估值暂未提供；ACU 主网与 cACU Canary 分开，读取失败不显示为零收益。",
      "讀取官方主網已確認的裝置歸屬與心跳。暫不提供收益、質押獎勵和餘額估值；主網與 Canary 分開。",
      "Reads finalized mainnet processor ownership and heartbeats. Earnings, staking rewards and balance valuation remain unavailable. Mainnet ACU and Canary cACU stay separate; failed reads are never zero earnings.",
      "메인넷의 확정된 기기 소유와 하트비트를 조회합니다. 수익과 잔액 평가는 미지원이며 Canary는 별도입니다.",
      "メインネットの確定した機器の所有関係とハートビートを読み取ります。収益と残高評価は未対応です。Canaryとは別です。",
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
