import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";
import type { Article } from "./articles";
const texts = {
  noid: {
    title: l([
      "NOID 付款为什么不等于今日收益？",
      "NOID 付款為什麼不等於今日收益？",
      "Why NOID payouts differ from daily earnings",
      "NOID 지급액과 오늘 수익이 다른 이유",
      "NOIDの支払と当日収益が異なる理由",
    ]),
    description: l([
      "找到公开地址，分清测得算力、待付款和滚动付款，排查没有记录的原因。",
      "找到公開地址，分清測得算力、待付款與滾動付款，排查沒有紀錄的原因。",
      "Find your public address, interpret measured hashrate and unpaid funds, and troubleshoot missing pool records.",
      "공개 주소를 찾고 측정 해시레이트·미지급액을 구분하며 풀 기록 누락을 확인합니다.",
      "公開アドレスを確認し、測定ハッシュレート・未払額を区別してプール記録の欠落を確認します。",
    ]),
    steps: l([
      "打开 Parano1d 钱包，复制收款地址（o1 开头），并确认矿工的 payout 地址一致。在 NOID 查询页粘贴完整地址。当前来源为 Parano1d Pool；若你使用其他矿池或 solo，这里没有记录是正常的，先回到该来源核对。",
      "開啟 Parano1d 錢包並複製 o1 收款地址，確認與礦工 payout 地址一致，再貼到 NOID 查詢頁。目前來源是 Parano1d Pool；其他礦池或 solo 沒有紀錄時，先回原來源核對。",
      "Copy the o1 payout address from your Parano1d wallet and match it against the miner configuration. Paste the full address into the NOID tool. It queries Parano1d Pool. If you mine elsewhere or solo, a missing record here does not diagnose your miner; check that source first.",
      "Parano1d 지갑의 o1 지급 주소를 복사해 채굴기 설정과 일치하는지 확인하고 NOID 도구에 붙여넣으세요. Parano1d Pool을 조회합니다. 다른 풀·단독 채굴 기록이 여기 없다고 기기 오류는 아니므로 원래 소스를 먼저 확인하세요.",
      "Parano1dウォレットのo1受取アドレスと採掘設定を照合し、NOIDツールに完全なアドレスを入力します。対象はParano1d Poolです。別プールやソロの記録がない場合、ここで機器故障と判断せず各取得元を確認してください。",
    ]),
    fields: l([
      "例如待付款为 0.287310 NOID、近 24 小时付款为 0：表示池内还有未付款，最近窗口没有付款，不表示你今天没挖。累计付款也不是钱包余额。测得算力按矿池收到的份额估算，会与矿工本地显示不同；同一地址的机器共享地址统计。",
      "例如待付款0.287310 NOID、近24小時付款0，表示池內仍有待付款且近期未付款，不表示今天沒有挖。累計付款不是錢包餘額。測得算力按礦池份額估算，會與本機不同；同地址機器共用地址統計。",
      "For example, 0.287310 NOID unpaid and zero paid over 24 hours means funds remain in the pool without a recent payout, not that you earned nothing today. Total payouts are not wallet balance. Pool hashrate is estimated from submitted shares and can differ from local miner reports. Machines sharing an address share these totals.",
      "미지급 0.287310 NOID, 24시간 지급 0은 풀에 미지급액이 남고 최근 지급이 없다는 뜻이지 오늘 채굴하지 않았다는 뜻이 아닙니다. 누적 지급은 지갑 잔액이 아닙니다. 풀 해시레이트는 제출된 share 기준 추정치이며 같은 주소 기기는 집계를 공유합니다.",
      "未払0.287310 NOID、24時間支払ゼロなら、プール内に未払額があり最近の支払がないという意味で、当日採掘ゼロではありません。累計支払はウォレット残高ではありません。プール算力はshareから推定され、同じアドレスの機器で集計を共有します。",
    ]),
    check: l([
      "先确认地址和矿池，再检查矿工是否提交有效份额。页面每 5 分钟读取；最近提交超过 20 分钟才显示地址离线。不要用“累计付款”推断某台机器在线，也不要把滚动 24 小时付款加入北京时间今日收益。",
      "先核對地址與礦池，再查看有效份額。页面每5分鐘讀取，最後提交超過20分鐘顯示地址離線。不要用累計付款判斷單機在線，或將滾動24小時付款計入北京時間今日收益。",
      "Check the address and pool, then look for valid share submissions. The page reads every 5 minutes and treats activity older than 20 minutes as address offline. Neither lifetime payouts nor a successful website fetch prove a specific machine is online. Rolling 24-hour payouts are excluded from Beijing-day earnings.",
      "주소와 풀을 확인한 뒤 유효 share 제출을 확인하세요. 5분마다 조회하며 마지막 제출 후 20분이 지나면 주소 오프라인으로 표시합니다. 누적 지급·조회 성공은 단일 기기 연결 증거가 아닙니다. 24시간 지급은 베이징 기준 일일 수익에서 제외합니다.",
      "住所とプールを確認し、有効shareの提出を確認します。取得は5分ごとで、提出が20分以上前ならアドレスをオフラインと表示します。累計支払や取得成功は単一機器の接続を証明しません。24時間支払は北京時間の日次収益から除外します。",
    ]),
  },
  acurast: {
    title: l([
      "Acurast 应该填管理者钱包还是处理器地址？",
      "Acurast 應填管理者錢包還是處理器地址？",
      "Which Acurast address belongs to your processor?",
      "Acurast에서 관리자와 프로세서 주소 구분하기",
      "Acurastの管理者とプロセッサのアドレスを区別する",
    ]),
    description: l([
      "从 Hub 找到 Processor 地址，区分主网、Canary 和设备登记，理解当前查询范围。",
      "從 Hub 找到 Processor 地址，區分主網、Canary 與設備登記，理解目前查詢範圍。",
      "Find the Processor address in Hub, distinguish mainnet from Canary and understand registration lookup limits.",
      "Hub에서 Processor 주소를 찾고 메인넷·Canary와 등록 조회 범위를 구분합니다.",
      "HubでProcessorアドレスを確認し、メインネットとCanary、登録照会の範囲を区別します。",
    ]),
    steps: l([
      "进入 Acurast Hub，先确认选中 Mainnet，再打开具体设备的详情，复制 Processor 地址。管理者钱包可能管理多台手机，不能替代单个 Processor。本站接收带校验的 SS58 地址或 0x 加 64 个十六进制字符的公钥，不接收二维码中的秘密、私钥或助记词。",
      "進入 Acurast Hub 並選擇Mainnet，在具體設備詳情複製Processor地址。管理者錢包可管理多台手機，不能代替單個Processor。本站接受有校驗的SS58或0x加64個十六進位字元的公鑰，不接受秘密、私鑰或助記詞。",
      "Select Mainnet in Acurast Hub, open a specific device and copy its Processor address. A manager wallet can control multiple phones and is not that processor. The tool accepts checksummed SS58 or a 0x-prefixed 64-hex-character public key. Never paste QR secrets, private keys or seed words.",
      "Acurast Hub에서 Mainnet을 선택하고 특정 기기 상세의 Processor 주소를 복사하세요. 관리 지갑은 여러 휴대폰을 관리할 수 있어 해당 프로세서 주소가 아닙니다. 체크섬 SS58 또는 0x 뒤 64자리 공개키를 사용하고 QR 비밀값·비밀키·시드 문구를 입력하지 마세요.",
      "HubでMainnetを選び、個別機器の詳細からProcessorアドレスをコピーします。管理者ウォレットは複数の電話を管理でき、個別プロセッサのアドレスではありません。チェックサム付きSS58か0xと64桁の公開鍵を使い、QRの秘密・秘密鍵・シードを入力しないでください。",
    ]),
    fields: l([
      "查询成功表示主网索引中有该处理器登记。Core / Lite 是处理器模式，Android / iOS 是来源的设备分类；未知类型保持空缺。登记可能长期存在，不能证明这台手机此刻运行。当前工具不读取心跳、奖励或质押记录，也不把账户余额当收益。",
      "成功查詢表示主網索引有處理器登記。Core/Lite是模式，Android/iOS是來源分類，未知保持空缺。登記可長期存在，不證明手機此刻執行。工具目前不讀心跳、獎勵或質押，餘額不視為收益。",
      "A successful lookup proves processor registration in the mainnet index. Core/Lite describes its mode; Android/iOS is the source classification. Unknown classifications stay blank. Registration can persist after a phone stops. This tool does not yet read heartbeats, rewards or staking and never treats account balance as earnings.",
      "조회 성공은 메인넷 등록을 뜻합니다. Core/Lite는 모드, Android/iOS는 소스 분류이며 미확인 값은 비워둡니다. 휴대폰이 중지돼도 등록은 남을 수 있습니다. 현재 심박·보상·스테이킹은 조회하지 않으며 잔액을 수익으로 취급하지 않습니다.",
      "照会成功はメインネット索引での登録を示します。Core/Liteはモード、Android/iOSは取得元の分類で、未知の値は空欄です。機器停止後も登録は残りえます。現時点で心拍・報酬・ステーキングは取得せず、残高を収益と見なしません。",
    ]),
    check: l([
      "找不到记录时，先检查是否误用了管理者地址、Canary 或 Devnet。官方主网币为 ACU，Canary 为 cACU，两者不可混加。官方索引器不可用时保留未知状态；若要核对奖励，回到 Hub 和官方奖励说明，单独查看基础奖励与质押奖励。",
      "沒有紀錄先檢查管理者地址、Canary或Devnet。主網ACU和Canary cACU不可混加。官方索引器不可用時保持未知；核對獎勵請回Hub和官方獎勵說明，分開查看基礎與質押獎勵。",
      "For missing records, check for a manager address, Canary or Devnet selection. Mainnet ACU and Canary cACU must not be combined. Indexer outages remain unknown. To verify rewards, return to Hub and the official rewards guide, distinguishing base benchmark rewards from staking rewards.",
      "기록이 없으면 관리 주소, Canary, Devnet 여부를 확인하세요. 메인넷 ACU와 Canary cACU는 합산하지 않습니다. 인덱서 장애는 미확인 상태로 유지합니다. 보상은 Hub와 공식 문서에서 기본 벤치마크 보상과 스테이킹 보상을 구분해 확인하세요.",
      "記録がなければ管理者アドレスやCanary・Devnet選択を確認します。ACUとcACUを合算しません。索引の障害は未知の状態を保持します。報酬はHubと公式ガイドに戻り、基本ベンチマーク報酬とステーキング報酬を分けて確認します。",
    ]),
  },
};
export const additionalGuides: Article[] = (["noid", "acurast"] as const).map((project) => {
  const c = texts[project];
  const body = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      [
        `## ${l(["地址与网络", "地址與網路", "Address and network", "주소와 네트워크", "アドレスとネットワーク"])[locale]}`,
        c.steps[locale],
        `## ${l(["字段怎么读", "欄位怎麼讀", "Reading the fields", "필드 읽기", "項目の読み方"])[locale]}`,
        c.fields[locale],
        `## ${l(["没有记录时", "沒有紀錄時", "Missing records", "기록이 없을 때", "記録がない場合"])[locale]}`,
        c.check[locale],
        `[${project === "noid" ? "NOID" : "Acurast"}](/projects/${project})`,
      ],
    ]),
  ) as Article["body"];
  return {
    slug: `${project}-monitor-guide`,
    project,
    published: "2026-10-12",
    modified: "2026-10-12",
    title: c.title,
    description: c.description,
    topic: l(["监控指南", "監控指南", "Monitoring guide", "모니터링 가이드", "監視ガイド"]),
    body,
    sources:
      project === "noid"
        ? [
            {
              name: "Parano1d address / RPC conventions",
              url: "https://docs.parano1d.org/reference/rpc",
            },
            { name: "Parano1d Pool", url: "https://www.parano1d-pool.fun/" },
          ]
        : [
            { name: "Acurast Compute Providers", url: "https://docs.acurast.com/processors/" },
            { name: "Acurast Rewards", url: "https://docs.acurast.com/processors/rewards/" },
            { name: "Official mainnet indexer", url: "https://github.com/Acurast/acurast-indexer" },
          ],
    related: ["data-sources-and-freshness"],
  };
});
