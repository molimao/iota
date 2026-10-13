import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";
import type { Article } from "./articles";

const fieldHeaders = l([
  ["页面字段", "表示什么", "不能据此判断"],
  ["頁面欄位", "代表什麼", "不能據此判斷"],
  ["Field", "What it means", "What it does not prove"],
  ["필드", "의미", "판단할 수 없는 것"],
  ["項目", "意味", "判断できないこと"],
]);
const noidRows = l([
  [
    ["Measured hashrate", "矿池估算的地址算力", "单台设备的实时性能"],
    ["Unpaid", "矿池记账的待付款", "今日新增收益"],
    ["24h payouts", "滚动 24 小时付款", "北京时间自然日收益"],
  ],
  [
    ["Measured hashrate", "礦池估算的地址算力", "單台設備即時效能"],
    ["Unpaid", "礦池記帳的待付款", "今日新增收益"],
    ["24h payouts", "滾動24小時付款", "北京時間當日收益"],
  ],
  [
    ["Measured hashrate", "Pool-estimated address hashrate", "One device’s live performance"],
    ["Unpaid", "Pool-accounted unpaid amount", "New earnings today"],
    ["24h payouts", "Payments in a rolling 24-hour window", "Beijing-calendar-day earnings"],
  ],
  [
    ["Measured hashrate", "풀의 주소 해시레이트 추정치", "단일 기기의 실시간 성능"],
    ["Unpaid", "풀에 기록된 미지급액", "오늘 새로 발생한 수익"],
    ["24h payouts", "최근 24시간 지급액", "베이징 기준 당일 수익"],
  ],
  [
    ["Measured hashrate", "プールが推定するアドレスの採掘速度", "単一機器の実時間性能"],
    ["Unpaid", "プール記帳の未払額", "今日の新規収益"],
    ["24h payouts", "直近24時間の支払", "北京時間の暦日収益"],
  ],
]);
const acurastRows = l([
  [
    ["Processor 地址", "单个处理器的公开标识", "管理者钱包地址"],
    ["已登记", "主网索引存在记录", "手机当前在线或有收益"],
    ["Core / Lite", "处理器模式", "实时吞吐量或报酬"],
  ],
  [
    ["Processor 地址", "單個處理器的公開識別碼", "管理者錢包地址"],
    ["已登記", "主網索引存在紀錄", "手機現在在線或有收益"],
    ["Core / Lite", "處理器模式", "即時吞吐量或報酬"],
  ],
  [
    ["Processor address", "A processor’s public identifier", "Its manager wallet address"],
    ["Registered", "A record in the mainnet index", "Current uptime or earnings"],
    ["Core / Lite", "Processor mode", "Live throughput or rewards"],
  ],
  [
    ["Processor 주소", "개별 프로세서의 공개 식별자", "관리 지갑 주소"],
    ["등록됨", "메인넷 인덱스의 기록", "현재 연결 상태나 수익"],
    ["Core / Lite", "프로세서 모드", "실시간 처리량 또는 보상"],
  ],
  [
    ["Processorアドレス", "個別プロセッサの公開ID", "管理者のウォレットアドレス"],
    ["登録済み", "メインネット索引の記録", "現在の接続や収益"],
    ["Core / Lite", "プロセッサのモード", "実時間の処理量や報酬"],
  ],
]);
const details = {
  noid: {
    summary: l([
      "NOID 监控查询 Parano1d Pool 的地址数据。待付款、累计付款和滚动 24 小时付款都不等于今日收益；使用其他矿池或 solo 时，先到原来源核对。",
      "NOID 監控查詢 Parano1d Pool 的地址資料。待付款、累計與滾動24小時付款皆不等於今日收益；其他礦池或solo請先到原來源核對。",
      "This NOID monitor reads Parano1d Pool address data. Unpaid, lifetime and rolling 24-hour payments are not today’s earnings. Check your own source if you use another pool or mine solo.",
      "NOID 모니터는 Parano1d Pool 주소 데이터를 조회합니다. 미지급·누적·최근 24시간 지급액은 오늘 수익과 다릅니다. 다른 풀이나 단독 채굴은 해당 소스를 확인하세요.",
      "NOID監視はParano1d Poolのアドレス情報を照会します。未払・累計・直近24時間の支払は今日の収益とは別です。他のプールや単独採掘は利用元で確認してください。",
    ]),
    rows: noidRows,
    questions: l([
      [
        {
          question: "矿工在运行，为什么这里没有记录？",
          answer:
            "先确认矿工使用 Parano1d Pool，且查询地址与 payout 地址完全一致。其他矿池或 solo 不在此工具的查询范围内。",
        },
        {
          question: "多台机器用同一个地址，算力能分开吗？",
          answer:
            "当前来源按地址汇总，无法据此拆成各台机器。设备名称只是你自己的标签，不会改变原始数据范围。",
        },
      ],
      [
        {
          question: "礦工正在執行，為什麼沒有紀錄？",
          answer: "確認使用Parano1d Pool且查詢地址與payout完全一致；其他礦池或solo不在此工具範圍。",
        },
        {
          question: "多台機器共用地址，算力能分開嗎？",
          answer: "來源按地址彙總，無法拆成各台機器。設備名稱只是標籤，不改變資料範圍。",
        },
      ],
      [
        {
          question: "Why is my running miner missing here?",
          answer:
            "Check that it uses Parano1d Pool and that the query matches its full payout address. Other pools and solo mining are outside this tool’s coverage.",
        },
        {
          question: "Can I split several machines sharing one address?",
          answer:
            "This source aggregates by address. Device labels do not separate that aggregate into individual machine readings.",
        },
      ],
      [
        {
          question: "채굴기가 작동하는데 기록이 없는 이유는?",
          answer:
            "Parano1d Pool을 사용하고 조회 주소가 전체 payout 주소와 같은지 확인하세요. 다른 풀과 단독 채굴은 조회 범위 밖입니다.",
        },
        {
          question: "한 주소를 쓰는 여러 기기의 해시레이트를 나눌 수 있나요?",
          answer:
            "원본이 주소별로 합산하므로 단일 기기로 나눌 수 없습니다. 기기 이름은 라벨일 뿐 데이터 범위를 바꾸지 않습니다.",
        },
      ],
      [
        {
          question: "動作中の採掘機に記録がないのはなぜ？",
          answer:
            "Parano1d Poolを利用し、照会する完全なアドレスがpayoutと一致するか確認してください。他のプールや単独採掘は対象外です。",
        },
        {
          question: "同じアドレスの複数機器を分けられますか？",
          answer:
            "取得元はアドレス単位で合算します。機器名を付けても個別の数値には分割されません。",
        },
      ],
    ]),
  },
  acurast: {
    summary: l([
      "填写单台手机的 Processor 地址，而不是管理者钱包。当前查询显示主网登记和处理器类型，不提供实时在线状态或收益；登记存在也不代表设备此刻运行。",
      "填寫單台手機的Processor地址，而非管理者錢包。目前顯示主網登記與類型，不提供即時在線狀態或收益；有登記不代表此刻執行。",
      "Use the phone’s Processor address, not its manager wallet. This lookup shows mainnet registration and processor type, not live uptime or earnings. Registration alone does not mean the device is running now.",
      "관리 지갑이 아닌 휴대폰의 Processor 주소를 입력하세요. 현재 메인넷 등록과 유형만 조회하며 실시간 연결이나 수익은 제공하지 않습니다. 등록만으로 현재 작동을 확인할 수 없습니다.",
      "管理者ウォレットではなく電話のProcessorアドレスを入力します。現在はメインネット登録と種類を表示し、実時間の接続や収益は取得しません。登録だけでは現在の動作を証明できません。",
    ]),
    rows: acurastRows,
    questions: l([
      [
        {
          question: "为什么已经登记却没有收益数字？",
          answer:
            "当前接入只读取处理器登记，不读取奖励。横线表示未提供该数据，不表示收益为零；请到 Acurast Hub 核对奖励。",
        },
        {
          question: "Canary 地址能用于主网查询吗？",
          answer: "先在 Hub 核对网络。本站使用主网索引，不将 Canary 的 cACU 和主网 ACU 混合显示。",
        },
      ],
      [
        {
          question: "已登記為何沒有收益數字？",
          answer:
            "目前只讀處理器登記，不讀獎勵。橫線代表未提供資料，不是收益為零；請在Acurast Hub核對獎勵。",
        },
        {
          question: "Canary地址能查主網嗎？",
          answer: "先在Hub核對網路。本站使用主網索引，不混合Canary cACU與主網ACU。",
        },
      ],
      [
        {
          question: "Why does a registered processor have no earnings figure?",
          answer:
            "This integration reads registration, not rewards. A dash means the data is unavailable here, not zero earnings. Check rewards in Acurast Hub.",
        },
        {
          question: "Can a Canary address be used for mainnet lookup?",
          answer:
            "Verify the network in Hub first. This tool uses the mainnet index and does not combine Canary cACU with mainnet ACU.",
        },
      ],
      [
        {
          question: "등록됐는데 수익 숫자가 없는 이유는?",
          answer:
            "현재 등록만 조회하며 보상은 조회하지 않습니다. 대시는 수익 0이 아닌 데이터 미제공을 뜻합니다. Acurast Hub에서 보상을 확인하세요.",
        },
        {
          question: "Canary 주소로 메인넷을 조회할 수 있나요?",
          answer:
            "Hub에서 네트워크를 먼저 확인하세요. 이 도구는 메인넷 인덱스를 쓰며 Canary cACU와 메인넷 ACU를 합산하지 않습니다.",
        },
      ],
      [
        {
          question: "登録済みでも収益が表示されないのはなぜ？",
          answer:
            "現在の接続は登録のみを取得し、報酬は取得しません。横線はゼロ収益ではなくデータ未提供です。報酬はAcurast Hubで確認してください。",
        },
        {
          question: "Canaryのアドレスでメインネットを照会できますか？",
          answer:
            "まずHubでネットワークを確認します。このツールはメインネット索引を使い、CanaryのcACUとメインネットACUを合算しません。",
        },
      ],
    ]),
  },
};
export function monitorGuideDetails(
  project: "noid" | "acurast",
): Pick<Article, "summary" | "questions" | "comparison" | "comparisonTitle"> {
  const d = details[project];
  return {
    summary: d.summary,
    comparisonTitle: l(["字段对照", "欄位對照", "Field reference", "필드 설명", "項目の対照"]),
    questions: d.questions,
    comparison: Object.fromEntries(
      LOCALES.map((locale) => [locale, { headers: fieldHeaders[locale], rows: d.rows[locale] }]),
    ) as NonNullable<Article["comparison"]>,
  };
}
