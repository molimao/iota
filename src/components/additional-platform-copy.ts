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
      "Acurast 处理器查询：主网登记与设备类型",
      "Acurast 處理器查詢：主網登記與設備類型",
      "Acurast processor lookup: mainnet registration and device type",
      "Acurast 프로세서 조회: 메인넷 등록과 기기 유형",
      "Acurastプロセッサ照会：メインネット登録と機器種別",
    ]),
    summary: l([
      "查询 Acurast 主网处理器登记、Core / Lite 与 Android / iOS 类型。",
      "查詢 Acurast 主網處理器登記、Core / Lite 與 Android / iOS 類型。",
      "Look up Acurast mainnet processor registration, Core/Lite and Android/iOS classification.",
      "Acurast 메인넷 프로세서 등록 및 Core/Lite, Android/iOS 분류를 조회합니다.",
      "Acurastメインネットのプロセッサ登録とCore/Lite、Android/iOS分類を照会します。",
    ]),
    identity: l([
      "从 Acurast Hub 的设备详情复制 Processor 地址（SS58 或 0x 开头的32字节公钥）。不要用管理者钱包代替处理器地址。",
      "從 Acurast Hub 設備詳情複製 Processor 地址（SS58 或0x開頭的32位元組公鑰）。不要用管理者錢包代替處理器地址。",
      "Copy the Processor address from device details in Acurast Hub: SS58 or a 0x-prefixed 32-byte public key. Do not substitute the manager wallet.",
      "Acurast Hub 기기 상세에서 Processor 주소를 복사하세요. SS58 또는 0x로 시작하는 32바이트 공개키를 지원합니다. 관리 지갑 주소로 대체하지 마세요.",
      "Acurast Hubの機器詳細からProcessorアドレスをコピーします。SS58または0xで始まる32バイト公開鍵に対応し、管理者ウォレットで代用しません。",
    ]),
    coverage: l([
      "只查询官方主网索引器的登记与类型；登记不证明实时在线。本次尚不提供心跳、今日奖励、质押奖励或余额估值。ACU 主网与 cACU Canary 分开，无法读取时显示不可用，不显示零收益。",
      "僅查詢官方主網索引器登記與類型；登記不證明即時在線。目前不提供心跳、今日獎勵、質押獎勵或餘額估值。ACU主網與cACU Canary分開，讀取失敗顯示無法取得，不顯示零收益。",
      "Uses the official mainnet indexer for registration and classification only. Registration does not prove live connectivity. Heartbeats, daily or staking rewards and balance valuation are not yet covered. Mainnet ACU is separate from Canary cACU. Failed reads stay unavailable, never zero earnings.",
      "공식 메인넷 인덱서에서 등록과 분류만 조회합니다. 등록은 실시간 연결의 증거가 아닙니다. 심박, 일일·스테이킹 보상과 잔액 평가는 아직 지원하지 않습니다. 메인넷 ACU와 Canary cACU는 분리하며 실패 시 0 수익이 아닌 사용 불가로 표시합니다.",
      "公式メインネット索引から登録と分類のみ取得します。登録は現在の接続を証明しません。ハートビート、日次・ステーキング報酬、残高評価には未対応です。メインネットACUとCanary cACUを分け、失敗時はゼロ収益ではなく取得不可と表示します。",
    ]),
  },
} as const;
export const additionalMetricCopy = {
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
