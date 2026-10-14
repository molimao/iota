import { problemGuides } from "./problem-guides";
import { computeGuides } from "./compute-guides";
import type { Article } from "./articles";

/** Native editorial copy; never pass through the legacy two-language expander. */
export const projectGuides: Article[] = [
  {
    slug: "xid-mmm-mainnet-setup",
    project: "xid",
    published: "2026-10-03",
    modified: "2026-10-03",
    title: {
      zh: "XID / MMM 主网挖矿：Mac 设置与地址监控",
      "zh-TW": "XID / MMM 主網挖礦：Mac 設定與地址監控",
      en: "XID mining with MMM: Mac mainnet setup and monitoring",
      ko: "XID / MMM 채굴: Mac 메인넷 설정과 주소 모니터링",
      ja: "XID / MMMのマイニング：Macのメインネット設定と監視",
    },
    description: {
      zh: "核对 xCoin 主网、MMM 来源、xpa1r 地址和矿池设置，再查看 Worker、算力与活动记录。",
      "zh-TW": "核對 xCoin 主網、MMM 來源、xpa1r 地址和礦池設定，再查看 Worker、算力與活動紀錄。",
      en: "Verify xCoin mainnet, the MMM source, xpa1r payout address and pool configuration before checking workers and hashrate.",
      ko: "xCoin 메인넷, MMM 출처, xpa1r 보상 주소와 풀 설정을 확인하고 워커와 해시레이트를 조회하세요.",
      ja: "xCoinメインネット、MMMの配布元、xpa1r報酬アドレス、プール設定を確認し、ワーカーとハッシュレートを調べます。",
    },
    summary: {
      zh: "XID 是 xCoin 的代币；MMM 是 Mac Metal Miner，不是另一种币。在 MMM 配置主网和公开收益地址，再到本站 XID 页面保存地址。网页查询已有记录，不会在 Mac 上启动挖矿。",
      "zh-TW":
        "XID 是 xCoin 的代幣；MMM 是 Mac Metal Miner，不是另一種幣。在 MMM 設定主網和公開收益地址，再到本站 XID 頁面儲存地址。網頁查詢既有紀錄，不會在 Mac 上啟動挖礦。",
      en: "XID is xCoin’s token; MMM is the Mac Metal Miner application. Configure mainnet and a public payout address in MMM, then save that address on the XID monitor. The website reads existing records; it does not start mining on your Mac.",
      ko: "XID는 xCoin의 토큰이고 MMM은 Mac Metal Miner 앱입니다. MMM에서 메인넷과 공개 보상 주소를 설정한 뒤 XID 모니터에 주소를 저장하세요. 웹사이트는 기존 기록을 조회하며 Mac에서 채굴을 시작하지 않습니다.",
      ja: "XIDはxCoinのトークン、MMMはMac Metal Minerアプリです。MMMでメインネットと公開報酬アドレスを設定し、XIDモニターに保存します。サイトは既存の記録を読み取り、Macでマイニングを起動しません。",
    },
    topic: {
      zh: "安装与监控",
      "zh-TW": "安裝與監控",
      en: "Setup and monitoring",
      ko: "설정 및 모니터링",
      ja: "設定とモニタリング",
    },
    body: {
      zh: [
        "## 先确认你使用的是哪个 MMM",
        "搜索 MMM 会出现其他币种和同名矿工。这里指 xCoin 官网链接的 [SystemThreat/MMM](https://github.com/SystemThreat/MMM)，目标网络是 XID 主网。下载或升级前，核对当前仓库说明与发布版本。",
        "## 主网地址和矿池要对应",
        "XID 主网收益地址以 xpa1r 开头；退役测试网的 txa1r 地址不能混用。前缀只是第一步，还要复制完整地址并通过校验。以 [MMM 官网主网说明](https://macmetalminer.com/) 核对网络、矿池主机、端口和浏览器，不沿用旧教程里的测试网参数。",
        "## 启动后，先看本机再看远端",
        "在 MMM 确认挖矿引擎、当前 Worker 名称和份额活动，再用浏览器查地址。给不同机器不同的 Worker 名称有助于辨认，但一个 Worker 名称不等于一台确定的物理设备。矿池记录出现时间也可能晚于本机变化。",
        "## 添加到网页监控",
        "打开 [XID / MMM 监控](/projects/xid)，保存公开地址和名称。每个项目免费 5 台、Pro 50 台，在设备总览登录 Google 后可同步设备及关联项目；未登录时仅保存在当前浏览器，可导出备份。",
        "网页缺少 Worker 时，先核对所选矿池是否在来源名单的覆盖范围，再看最近获取时间。继续阅读 [算力与份额](/learn/xid-worker-hashrate-shares) 或 [余额与奖励成熟](/learn/xid-rewards-balance-maturity)。",
      ],
      "zh-TW": [
        "## 先確認你使用的是哪個 MMM",
        "搜尋 MMM 會出現其他幣種和同名礦工。這裡指 xCoin 官網連結的 [SystemThreat/MMM](https://github.com/SystemThreat/MMM)，目標網路是 XID 主網。下載或升級前，核對目前倉庫說明與發布版本。",
        "## 主網地址和礦池要對應",
        "XID 主網收益地址以 xpa1r 開頭；退役測試網的 txa1r 地址不能混用。前綴只是第一步，還要複製完整地址並通過校驗。以 [MMM 官網主網說明](https://macmetalminer.com/) 核對網路、礦池主機、連接埠和瀏覽器，不沿用舊教學的測試網參數。",
        "## 啟動後，先看本機再看遠端",
        "在 MMM 確認挖礦引擎、目前 Worker 名稱和份額活動，再用瀏覽器查地址。為不同機器設定不同 Worker 名稱有助於辨認，但名稱不等於一台確定的實體設備。礦池紀錄可能晚於本機變化。",
        "## 新增至網頁監控",
        "開啟 [XID / MMM 監控](/projects/xid)，儲存公開地址與名稱。每個專案免費 5 台、Pro 50 台。在設備總覽登入 Google 後可同步設備與關聯專案；未登入時只儲存在目前瀏覽器，可匯出備份。",
        "網頁缺少 Worker 時，先核對所選礦池是否在來源名單涵蓋範圍，再看最近取得時間。繼續閱讀 [算力與份額](/learn/xid-worker-hashrate-shares) 或 [餘額與獎勵成熟](/learn/xid-rewards-balance-maturity)。",
      ],
      en: [
        "## Confirm which MMM you are using",
        "MMM searches can return miners for other coins. This guide concerns [SystemThreat/MMM](https://github.com/SystemThreat/MMM), linked by xCoin, and the XID mainnet. Check the current repository documentation and release before downloading or upgrading.",
        "## Match the address and pool to mainnet",
        "XID mainnet payout addresses start with xpa1r; txa1r belongs to the retired testnet. A prefix alone is insufficient: copy the complete address and validate it. Use the [MMM mainnet instructions](https://macmetalminer.com/) to verify network, pool host, port and explorer rather than reusing old testnet settings.",
        "## Check local activity before remote records",
        "Check MMM’s engine, current worker name and share activity before looking up the address remotely. Distinct names make machines easier to recognize, but a worker name does not establish a physical device count. Pool records can lag behind local changes.",
        "## Add the address to the web monitor",
        "Free supports 5 devices per project; Pro supports 50 per project. Project quotas are independent, and the device overview has no additional total limit. Google sign-in syncs the list across devices; without signing in it stays in this browser.",
        "If workers are missing, check whether the chosen pool is covered by the source list, then inspect the fetch time. Continue with [hashrate and shares](/learn/xid-worker-hashrate-shares) or [balance and reward maturity](/learn/xid-rewards-balance-maturity).",
      ],
      ko: [
        "## 어떤 MMM인지 먼저 확인하기",
        "MMM 검색에는 다른 코인의 동명 채굴기도 나옵니다. 여기서는 xCoin이 연결하는 [SystemThreat/MMM](https://github.com/SystemThreat/MMM)과 XID 메인넷을 다룹니다. 다운로드나 업데이트 전에 최신 저장소 문서와 릴리스를 확인하세요.",
        "## 메인넷 주소와 풀 일치시키기",
        "XID 메인넷 보상 주소는 xpa1r로 시작하고 txa1r는 종료된 테스트넷 주소입니다. 접두사만 보지 말고 전체 주소와 체크섬을 확인하세요. [MMM 메인넷 안내](https://macmetalminer.com/)에서 네트워크, 풀 호스트, 포트, 탐색기를 대조하고 예전 테스트넷 설정을 재사용하지 마세요.",
        "## 로컬 상태를 먼저 확인하기",
        "주소를 원격으로 조회하기 전에 MMM의 엔진, 워커 이름과 셰어 활동을 확인하세요. 기기마다 이름을 다르게 정하면 구별하기 쉽지만 워커 이름만으로 실제 기기 수를 확정할 수는 없습니다. 풀 기록은 로컬 변화보다 늦을 수 있습니다.",
        "## 웹 모니터에 주소 추가하기",
        "무료는 프로젝트별 기기 5대, Pro는 프로젝트별 50대를 지원합니다. 프로젝트 한도는 독립적이며 기기 개요에 별도의 총수 제한은 없습니다. Google 로그인으로 기기 간 목록을 동기화할 수 있습니다. 로그인하지 않으면 목록은 이 브라우저에 저장됩니다.",
        "워커가 보이지 않으면 선택한 풀이 원본 목록에 포함되는지와 조회 시각을 확인하세요. [해시레이트와 셰어](/learn/xid-worker-hashrate-shares), [잔액과 보상 성숙](/learn/xid-rewards-balance-maturity)도 참고하세요.",
      ],
      ja: [
        "## 利用するMMMを確認する",
        "MMMの検索結果には別のコイン向けのマイナーも含まれます。ここではxCoinが案内する[SystemThreat/MMM](https://github.com/SystemThreat/MMM)とXIDメインネットを扱います。入手や更新前に最新のリポジトリー説明とリリースを確認してください。",
        "## アドレスとプールをメインネットに合わせる",
        "XIDメインネットの報酬アドレスはxpa1r、終了したテストネットはtxa1rで始まります。接頭辞だけで判断せず、完全なアドレスとチェックサムを確認します。[MMMのメインネット案内](https://macmetalminer.com/)でネットワーク、プール、ポート、エクスプローラーを照合してください。",
        "## ローカルの状態から確認する",
        "遠隔のアドレス照会より先に、MMMのエンジン、ワーカー名、シェア活動を確認します。機器ごとに名前を分けると識別しやすくなりますが、名前だけでは実機台数を確定できません。プールの記録はローカルの変化より遅れる場合があります。",
        "## Webモニターに追加する",
        "無料版は各プロジェクト5台、Proは各50台に対応します。各プロジェクトの枠は独立し、デバイス一覧に別途の総数制限はありません。Googleログインでデバイス間の一覧を同期でき、ログインしない場合はこのブラウザーに保存されます。",
        "ワーカーが見つからない場合は対象プールが元データに含まれるかと取得時刻を確認します。[ハッシュレートとシェア](/learn/xid-worker-hashrate-shares)、[残高と報酬の成熟](/learn/xid-rewards-balance-maturity)も参照してください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "在网站添加地址会开始挖矿吗？",
          answer: "不会。挖矿在本机 MMM 运行，网站只读取公开记录。",
        },
        {
          question: "MMM 和 XID 是两个项目吗？",
          answer: "不是。此处 MMM 是 xCoin 的矿工应用，XID 是所挖代币。",
        },
      ],
      "zh-TW": [
        {
          question: "在網站新增地址會開始挖礦嗎？",
          answer: "不會。挖礦在本機 MMM 執行，網站只讀取公開紀錄。",
        },
        {
          question: "MMM 和 XID 是兩個專案嗎？",
          answer: "不是。此處 MMM 是 xCoin 的礦工應用，XID 是所挖代幣。",
        },
      ],
      en: [
        {
          question: "Does saving an address start mining?",
          answer: "No. MMM mines locally; the website only reads public records.",
        },
        {
          question: "Are MMM and XID separate currencies?",
          answer: "No. Here MMM is the xCoin miner application and XID is the token being mined.",
        },
      ],
      ko: [
        {
          question: "주소를 저장하면 채굴이 시작되나요?",
          answer: "아니요. 채굴은 로컬 MMM에서 실행되고 웹사이트는 공개 기록만 조회합니다.",
        },
        {
          question: "MMM과 XID는 서로 다른 코인인가요?",
          answer: "아니요. 여기서 MMM은 xCoin 채굴 앱이고 XID는 채굴되는 토큰입니다.",
        },
      ],
      ja: [
        {
          question: "アドレスを保存するとマイニングが始まりますか？",
          answer: "いいえ。マイニングはローカルのMMMで動作し、サイトは公開記録を読むだけです。",
        },
        {
          question: "MMMとXIDは別の通貨ですか？",
          answer: "いいえ。ここでのMMMはxCoinのマイナーアプリ、XIDはマイニングするトークンです。",
        },
      ],
    },
    sources: [
      {
        name: "xCoin · mainnet and mining",
        url: "https://xcoinproject.com/",
      },
      {
        name: "MMM · current application documentation",
        url: "https://github.com/SystemThreat/MMM",
      },
      {
        name: "Mac Metal Miner · mainnet setup",
        url: "https://macmetalminer.com/",
      },
      {
        name: "IOTA Watch · source and data rules",
        url: "https://github.com/molimao/iota",
      },
    ],
    related: [
      "xid-worker-hashrate-shares",
      "xid-rewards-balance-maturity",
      "iota-xid-quantus-compared",
    ],
    keywords: {
      zh: ["XID 挖矿", "MMM 主网设置", "Mac Metal Miner", "xpa1r 地址"],
      "zh-TW": ["XID 挖礦", "MMM 主網設定", "Mac Metal Miner", "xpa1r 地址"],
      en: ["XID mining", "MMM mainnet setup", "Mac Metal Miner", "xpa1r address"],
      ko: ["XID 채굴", "MMM 메인넷 설정", "Mac Metal Miner", "xpa1r 주소"],
      ja: ["XID マイニング", "MMM メインネット設定", "Mac Metal Miner", "xpa1r アドレス"],
    },
  },
  {
    slug: "xid-worker-hashrate-shares",
    project: "xid",
    published: "2026-10-03",
    modified: "2026-10-03",
    title: {
      zh: "XID / MMM 算力怎么看：Worker、份额与最近活动",
      "zh-TW": "XID / MMM 算力怎麼看：Worker、份額與最近活動",
      en: "XID / MMM hashrate: workers, shares and last activity",
      ko: "XID / MMM 해시레이트: 워커, 셰어, 최근 활동 읽기",
      ja: "XID / MMMのハッシュレート：ワーカー、シェア、最終活動",
    },
    description: {
      zh: "区分矿工上报算力、矿池估算算力与链上估算，避免用 Worker 名称推算设备台数。",
      "zh-TW": "區分礦工回報算力、礦池估算算力與鏈上估算，避免用 Worker 名稱推算設備台數。",
      en: "Separate miner-reported, pool-estimated and chain-estimated hashrate; interpret workers without assuming device counts.",
      ko: "채굴기 보고값, 풀 추정값, 체인 추정값을 구분하고 워커 이름으로 기기 수를 단정하지 마세요.",
      ja: "マイナー報告値、プール推定値、チェーン推定値を区別し、ワーカー名から機器台数を断定しないための説明です。",
    },
    summary: {
      zh: "同一时刻的几种算力可以不同：本机或矿工上报是一个口径，矿池根据份额估算是另一个口径。本站分别展示这两项；全网概览的链上估算也不等于已读取矿池的算力合计。",
      "zh-TW":
        "同一時間的幾種算力可以不同：本機或礦工回報是一種口徑，礦池根據份額估算是另一種。本站分別顯示；全網概覽的鏈上估算也不等於已讀取礦池的算力合計。",
      en: "Different hashrate readings can legitimately differ: a miner’s report and a pool’s share-based estimate measure different things. The monitor separates them, and the chain estimate is not the same as the observed pool total.",
      ko: "같은 시각에도 해시레이트 수치는 다를 수 있습니다. 채굴기 보고값과 셰어 기반 풀 추정값은 측정 방식이 다릅니다. 모니터는 둘을 분리하며 체인 추정값도 관측된 풀 합계와 다릅니다.",
      ja: "同じ時刻でもハッシュレートは異なり得ます。マイナーの報告とシェアに基づくプール推定は測定方法が違います。当サイトは両者を分け、チェーン推定も観測プールの合計と区別します。",
    },
    topic: {
      zh: "数据与收益",
      "zh-TW": "資料與收益",
      en: "Data and rewards",
      ko: "데이터 및 보상",
      ja: "データと報酬",
    },
    body: {
      zh: [
        "## 比较相同口径和时间窗口",
        "先记下来源时间、单位和字段，再比较数值。MH/s 与 GH/s 相差 1,000 倍。不要把网页的矿池估算与 MMM 瞬时本机值当成同一个测试；短窗口的份额活动会影响估算。",
        "## Worker 与有效份额代表什么",
        "Worker 是来源中地址下的工作名称；份额是矿池接受的工作记录，不是已确认出块或已到账收益。给机器不同名称有助于检查，但名称可以变化、复用，多个机器也可能共用收益地址。",
        "## 0、未知和缺失记录分别检查",
        "字段返回有效 0 时才显示 0，缺失或不可用显示横线。没有 Worker 记录可能是地址不匹配或来源覆盖有限，不能单独判为离线。把最近活动时间与 MMM 本机状态一起核对。",
        "在 [XID 监控](/projects/xid) 按地址查看字段。连接设置见 [MMM 主网步骤](/learn/xid-mmm-mainnet-setup)，收益口径见 [余额与成熟](/learn/xid-rewards-balance-maturity)。",
      ],
      "zh-TW": [
        "## 比較相同口徑與時間範圍",
        "先記下來源時間、單位和欄位，再比較數值。MH/s 與 GH/s 相差 1,000 倍。不要把網頁礦池估算與 MMM 瞬時本機值當成同一個測試；短時間的份額活動會影響估算。",
        "## Worker 與有效份額代表什麼",
        "Worker 是來源中地址下的工作名稱；份額是礦池接受的工作紀錄，不是已確認出塊或已到帳收益。不同名稱有助於檢查，但名稱可變更、重複使用，多台機器也可能共用收益地址。",
        "## 0、未知和缺少紀錄分別檢查",
        "欄位回傳有效 0 才顯示 0，缺少或不可用顯示橫線。沒有 Worker 紀錄可能是地址不符或來源涵蓋有限，不能單獨判為離線。請對照最近活動時間與 MMM 本機狀態。",
        "在 [XID 監控](/projects/xid) 按地址查看欄位。連線設定見 [MMM 主網步驟](/learn/xid-mmm-mainnet-setup)，收益口徑見 [餘額與成熟](/learn/xid-rewards-balance-maturity)。",
      ],
      en: [
        "## Compare matching measurements and windows",
        "Record the source time, unit and field before comparing numbers. GH/s is 1,000 times MH/s. A web pool estimate and an instantaneous MMM local reading are not the same benchmark; short-window share activity affects estimates.",
        "## What workers and accepted shares establish",
        "A worker is a work label under an address in the source. Accepted shares are pool work records, not confirmed blocks or paid income. Distinct labels help inspection, but names can change or be reused, and several machines can share an address.",
        "## Distinguish zero, unknown and absent records",
        "A usable zero is displayed as zero; missing or unavailable fields remain a dash. An absent worker can mean an address mismatch or limited coverage, not necessarily an offline miner. Compare last activity with the local MMM state.",
        "Inspect address fields in the [XID monitor](/projects/xid). See [MMM mainnet setup](/learn/xid-mmm-mainnet-setup) for connections and [balance and maturity](/learn/xid-rewards-balance-maturity) for reward meanings.",
      ],
      ko: [
        "## 같은 측정 방식과 시간 범위 비교하기",
        "비교 전에 원본 시각, 단위, 필드 이름을 기록하세요. GH/s는 MH/s의 1,000배입니다. 웹 풀 추정값과 MMM의 순간 로컬 수치를 같은 벤치마크로 취급하지 마세요. 짧은 구간의 셰어 활동은 추정치에 영향을 줍니다.",
        "## 워커와 유효 셰어가 보여주는 것",
        "워커는 원본에서 주소 아래에 표시되는 작업 이름입니다. 유효 셰어는 풀이 수락한 작업 기록이며 확정 블록이나 지급 보상은 아닙니다. 이름은 바뀌거나 재사용될 수 있고 여러 기기가 하나의 주소를 공유할 수 있습니다.",
        "## 0, 알 수 없음, 누락 기록 구분하기",
        "유효한 0 응답은 0으로 표시하고 누락되거나 조회할 수 없는 값은 대시로 남깁니다. 워커가 없는 것은 주소 불일치나 제한된 수집 범위 때문일 수 있습니다. 최근 활동과 로컬 MMM 상태를 함께 확인하세요.",
        "[XID 모니터](/projects/xid)에서 주소별 값을 확인하세요. 연결은 [MMM 메인넷 설정](/learn/xid-mmm-mainnet-setup), 보상은 [잔액과 성숙](/learn/xid-rewards-balance-maturity)을 참고하세요.",
      ],
      ja: [
        "## 同じ測定方法と時間範囲で比較する",
        "比較前に元データの時刻、単位、項目を記録します。GH/sはMH/sの1,000倍です。Webのプール推定とMMMの瞬間的なローカル値は同じベンチマークではありません。短時間のシェア活動も推定値に影響します。",
        "## ワーカーと有効シェアが示すこと",
        "ワーカーは元データでアドレスに紐づく作業名です。有効シェアはプールが受理した作業記録で、確定ブロックや支払済み報酬ではありません。名前は変更や再利用ができ、複数の機器が同じアドレスを使う場合もあります。",
        "## ゼロ、不明、記録なしを区別する",
        "有効なゼロはゼロとして表示し、欠落や取得不能はダッシュのままにします。ワーカーがない理由はアドレス違いや収集範囲の制限かもしれません。最終活動とローカルMMMの状態を合わせて確認してください。",
        "[XIDモニター](/projects/xid)でアドレス別の値を確認します。接続は[MMMメインネット設定](/learn/xid-mmm-mainnet-setup)、報酬は[残高と成熟](/learn/xid-rewards-balance-maturity)を参照してください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "矿池算力低于本机值就是故障吗？",
          answer: "不一定。先核对单位、来源时间、估算窗口和份额活动。",
        },
        {
          question: "一个地址下六个 Worker 就是六台 Mac 吗？",
          answer: "不能确定。Worker 是工作名称，不是硬件资产标识。",
        },
      ],
      "zh-TW": [
        {
          question: "礦池算力低於本機值就是故障嗎？",
          answer: "不一定。先核對單位、來源時間、估算範圍和份額活動。",
        },
        {
          question: "一個地址下六個 Worker 就是六台 Mac 嗎？",
          answer: "不能確定。Worker 是工作名稱，不是硬體資產識別碼。",
        },
      ],
      en: [
        {
          question: "Does a lower pool hashrate prove a fault?",
          answer:
            "Not necessarily. Check units, source time, estimation window and share activity.",
        },
        {
          question: "Do six workers prove there are six Macs?",
          answer: "No. Workers are work labels, not hardware inventory identifiers.",
        },
      ],
      ko: [
        {
          question: "풀 해시레이트가 낮으면 고장인가요?",
          answer: "꼭 그렇지는 않습니다. 단위, 원본 시각, 추정 구간과 셰어 활동을 확인하세요.",
        },
        {
          question: "워커 여섯 개면 Mac 여섯 대인가요?",
          answer: "확정할 수 없습니다. 워커는 작업 이름이지 하드웨어 식별자가 아닙니다.",
        },
      ],
      ja: [
        {
          question: "プールの値が低いと故障ですか？",
          answer: "必ずしもそうではありません。単位、時刻、推定範囲、シェア活動を確認します。",
        },
        {
          question: "6ワーカーならMacは6台ですか？",
          answer: "確定できません。ワーカーは作業名で、機器の管理IDではありません。",
        },
      ],
    },
    sources: [
      {
        name: "MMM · current application documentation",
        url: "https://github.com/SystemThreat/MMM",
      },
      {
        name: "Mac Metal Miner · mainnet setup",
        url: "https://macmetalminer.com/",
      },
      {
        name: "IOTA Watch · source and data rules",
        url: "https://github.com/molimao/iota",
      },
    ],
    related: ["xid-mmm-mainnet-setup", "xid-rewards-balance-maturity"],
    keywords: {
      zh: ["XID 算力", "MMM Worker", "矿池算力", "有效份额"],
      "zh-TW": ["XID 算力", "MMM Worker", "礦池算力", "有效份額"],
      en: ["XID hashrate", "MMM workers", "pool hashrate", "accepted shares"],
      ko: ["XID 해시레이트", "MMM 워커", "풀 해시레이트", "유효 셰어"],
      ja: ["XID ハッシュレート", "MMM ワーカー", "プール算力", "有効シェア"],
    },
  },
  {
    slug: "xid-rewards-balance-maturity",
    project: "xid",
    published: "2026-10-03",
    modified: "2026-10-03",
    title: {
      zh: "XID 挖矿收益与余额：奖励成熟和出块如何区分",
      "zh-TW": "XID 挖礦收益與餘額：獎勵成熟和出塊如何區分",
      en: "XID mining rewards vs balance: blocks and maturity",
      ko: "XID 채굴 보상과 잔액: 블록과 보상 성숙 구분",
      ja: "XIDのマイニング報酬と残高：ブロックと成熟の違い",
    },
    description: {
      zh: "解释 XID 浏览器余额、链上归属区块与矿池份额，核对成熟规则，不把余额当累计收益。",
      "zh-TW": "解釋 XID 瀏覽器餘額、鏈上歸屬區塊與礦池份額，核對成熟規則，不把餘額當累計收益。",
      en: "Understand XID explorer balance, chain-attributed blocks and pool shares without treating balance as lifetime income.",
      ko: "XID 탐색기 잔액, 주소에 귀속된 블록, 풀 셰어를 구분하고 잔액을 누적 수입으로 해석하지 마세요.",
      ja: "XIDのエクスプローラー残高、アドレスに帰属するブロック、プールのシェアを区別します。",
    },
    summary: {
      zh: "浏览器余额不是累计挖矿收益，链上归属区块数也不是已到账金额。XID 官方说明 coinbase 奖励成熟门槛为 1,000 个区块；可花费金额仍应以当前钱包和链上记录核对。",
      "zh-TW":
        "瀏覽器餘額不是累計挖礦收益，鏈上歸屬區塊數也不是已到帳金額。XID 官方說明 coinbase 獎勵成熟門檻為 1,000 個區塊；可花費金額仍應以目前錢包與鏈上紀錄核對。",
      en: "Explorer balance is not lifetime mining income, and attributed block count is not paid income. xCoin documents a 1,000-block threshold for coinbase maturity. Verify spendable funds against the current wallet and chain records.",
      ko: "탐색기 잔액은 누적 채굴 수입이 아니고 귀속 블록 수도 지급 금액이 아닙니다. xCoin은 coinbase 보상 성숙에 1,000블록 기준이 적용된다고 설명합니다. 사용 가능한 금액은 현재 지갑과 체인 기록으로 확인하세요.",
      ja: "エクスプローラー残高は累計収入ではなく、帰属ブロック数も支払額ではありません。xCoinはcoinbase報酬の成熟に1,000ブロックの基準を適用すると説明しています。使用可能額は現在のウォレットとチェーン記録で確認します。",
    },
    topic: {
      zh: "数据与收益",
      "zh-TW": "資料與收益",
      en: "Data and rewards",
      ko: "데이터 및 보상",
      ja: "データと報酬",
    },
    body: {
      zh: [
        "## 先确认看的是什么字段",
        "本站 XID 地址卡片显示来源返回的浏览器余额和链上归属区块，不提供完整收支账本。收到、转出、未成熟奖励与来源覆盖都会影响理解；不要把余额变化直接当成今日收益。",
        "## 确认数比固定等待天数更准确",
        "成熟条件按区块确认计算，不是网页上的倒计时。出块速度变化会改变实际等待时间。阅读 [xCoin 主网说明](https://xcoinproject.com/) 的当前规则，核对奖励所在区块和当前高度，不承诺某个时间到账。",
        "## 份额与确认奖励分开",
        "有效份额说明矿池接受了工作，不等于该地址找到了链上区块。矿池工作统计、出块归属和钱包金额是不同记录。本站不把份额乘以固定币数生成收益，也不为 XID 编造美元估价。",
        "## 官网列出的矿池是 Solo 模式",
        "[xCoin 白皮书](https://xcoinproject.com/whitepaper) 说明，官网列出的矿池采用 Solo、coinbase 直接归属模式，找到区块才有对应奖励；不是按已接受份额持续分红。因此本机算力正常、份额增加，也可能暂时没有奖励。若使用其他矿池，单独核对它自己的规则。",
        "查看 [XID 监控](/projects/xid) 和官方浏览器；算力排查见 [Worker 与份额](/learn/xid-worker-hashrate-shares)。",
      ],
      "zh-TW": [
        "## 先確認查看的是哪個欄位",
        "本站 XID 地址卡片顯示來源回傳的瀏覽器餘額與鏈上歸屬區塊，不提供完整收支帳本。收款、轉出、未成熟獎勵與來源涵蓋都會影響判讀；不要把餘額變化當成今日收益。",
        "## 確認數比固定等待天數更準確",
        "成熟條件依區塊確認計算，不是網頁倒數。出塊速度變化會改變實際等待時間。閱讀 [xCoin 主網說明](https://xcoinproject.com/) 的目前規則，核對獎勵區塊與目前高度，不承諾固定到帳時間。",
        "## 份額與確認獎勵分開",
        "有效份額表示礦池接受了工作，不等於地址找到了鏈上區塊。礦池工作統計、出塊歸屬與錢包金額是不同紀錄。本站不把份額乘上固定幣數生成收益，也不為 XID 編造美元估價。",
        "## 官網列出的礦池是 Solo 模式",
        "[xCoin 白皮書](https://xcoinproject.com/whitepaper) 說明，官網列出的礦池採用 Solo、coinbase 直接歸屬模式，找到區塊才有對應獎勵；不是依已接受份額持續分紅。因此本機算力正常、份額增加，也可能暫時沒有獎勵。若使用其他礦池，另行核對其規則。",
        "查看 [XID 監控](/projects/xid) 與官方瀏覽器；算力排查見 [Worker 與份額](/learn/xid-worker-hashrate-shares)。",
      ],
      en: [
        "## Identify the field first",
        "The XID address card shows source-reported explorer balance and attributed blocks, not a complete income ledger. Receipts, outgoing transfers, immature rewards and source coverage affect interpretation. A balance change is not automatically today’s mining income.",
        "## Use confirmations rather than a fixed waiting time",
        "Maturity is counted in block confirmations, not a website countdown. Changes in block timing affect the elapsed wait. Check the current rule in the [xCoin mainnet information](https://xcoinproject.com/), the reward’s block and current height; do not assume a guaranteed payout time.",
        "## Separate shares from confirmed rewards",
        "Accepted shares establish pool work, not that the address found a chain block. Pool statistics, block attribution and wallet amounts are separate records. The monitor does not multiply shares by a fixed token amount or invent an XID dollar valuation.",
        "## The listed official pool is solo",
        "The [xCoin whitepaper](https://xcoinproject.com/whitepaper) describes the listed official pool as solo and coinbase-only: a found block assigns its reward directly, rather than distributing continuing income by accepted shares. Working hashrate and growing shares can therefore coexist with no rewards yet. Check separate terms if you use another pool.",
        "Use the [XID monitor](/projects/xid) alongside the official explorer; see [workers and shares](/learn/xid-worker-hashrate-shares) for hashrate checks.",
      ],
      ko: [
        "## 어떤 필드인지 확인하기",
        "XID 주소 카드는 원본이 제공하는 탐색기 잔액과 귀속 블록을 표시하며 전체 입출금 장부가 아닙니다. 입금, 출금, 미성숙 보상, 수집 범위가 해석에 영향을 줍니다. 잔액 변화가 곧 오늘의 채굴 보상은 아닙니다.",
        "## 정해진 일수보다 확인 수 보기",
        "성숙은 웹사이트의 카운트다운이 아니라 블록 확인 수로 계산합니다. 블록 생성 속도에 따라 실제 대기 시간은 달라집니다. [xCoin 메인넷 안내](https://xcoinproject.com/)의 최신 규칙, 보상 블록과 현재 높이를 확인하세요.",
        "## 셰어와 확정 보상 분리하기",
        "유효 셰어는 풀이 작업을 수락했다는 뜻이지 해당 주소가 체인 블록을 찾았다는 뜻은 아닙니다. 풀 통계, 블록 귀속, 지갑 금액은 별도 기록입니다. 모니터는 셰어에 고정 보상값을 곱하거나 XID 달러 가격을 만들지 않습니다.",
        "## 공식 사이트의 풀은 솔로 방식",
        "[xCoin 백서](https://xcoinproject.com/whitepaper)는 공식 사이트에 안내된 풀이 솔로·coinbase 직접 귀속 방식이라고 설명합니다. 블록을 찾았을 때 보상이 배정되며 수락된 셰어에 따라 계속 수입을 나누는 구조가 아닙니다. 해시레이트와 셰어가 증가해도 아직 보상이 없을 수 있습니다. 다른 풀을 사용한다면 해당 규칙을 따로 확인하세요.",
        "[XID 모니터](/projects/xid)와 공식 탐색기를 함께 보고 해시레이트는 [워커와 셰어](/learn/xid-worker-hashrate-shares)를 참고하세요.",
      ],
      ja: [
        "## まず項目を確認する",
        "XIDアドレスカードは元データの残高と帰属ブロックを表示し、完全な収支台帳ではありません。入金、送金、未成熟報酬、収集範囲が解釈に影響します。残高の変化を今日のマイニング収入とは扱えません。",
        "## 固定の日数より確認数を見る",
        "成熟はサイトのカウントダウンではなくブロック確認で数えます。ブロック生成間隔によって待ち時間は変わります。[xCoinのメインネット案内](https://xcoinproject.com/)の現行ルール、報酬ブロック、現在の高さを照合します。",
        "## シェアと確定報酬を分ける",
        "有効シェアはプールでの作業を示し、そのアドレスがチェーンのブロックを見つけた証明ではありません。プール統計、ブロック帰属、ウォレット額は別記録です。シェアから固定額の報酬やXIDのドル評価を作りません。",
        "## 公式サイトで案内するプールはソロ方式",
        "[xCoinホワイトペーパー](https://xcoinproject.com/whitepaper)では、案内されているプールはソロ・coinbase直接帰属方式です。発見したブロックの報酬が直接割り当てられ、受理シェアに応じて継続的に分配する方式ではありません。ハッシュレートやシェアが増えても報酬がまだない場合があります。別のプールはその規則を個別に確認してください。",
        "[XIDモニター](/projects/xid)と公式エクスプローラーを併用し、算力は[ワーカーとシェア](/learn/xid-worker-hashrate-shares)で確認します。",
      ],
    },
    questions: {
      zh: [
        {
          question: "余额能直接当累计挖矿收益吗？",
          answer: "不能。余额与历史收入是不同指标，本站没有把它们等同。",
        },
        {
          question: "奖励成熟一定等于 3.5 天吗？",
          answer: "不是。条件是确认数；时间取决于实际出块速度。",
        },
      ],
      "zh-TW": [
        {
          question: "餘額能直接當累計挖礦收益嗎？",
          answer: "不能。餘額與歷史收入是不同指標，本站沒有把兩者視為相同。",
        },
        {
          question: "獎勵成熟一定等於 3.5 天嗎？",
          answer: "不是。條件是確認數；時間取決於實際出塊速度。",
        },
      ],
      en: [
        {
          question: "Is balance the same as lifetime rewards?",
          answer: "No. Current balance and historical income are different measures.",
        },
        {
          question: "Does maturity always take 3.5 days?",
          answer:
            "No. The condition is confirmations; elapsed time depends on actual block production.",
        },
      ],
      ko: [
        {
          question: "잔액이 누적 보상과 같나요?",
          answer: "아니요. 현재 잔액과 과거 누적 수입은 다른 지표입니다.",
        },
        {
          question: "보상 성숙은 항상 3.5일 걸리나요?",
          answer: "아니요. 조건은 확인 수이고 시간은 실제 블록 생성 속도에 달려 있습니다.",
        },
      ],
      ja: [
        {
          question: "残高は累計報酬と同じですか？",
          answer: "いいえ。現在の残高と過去の累計収入は別の指標です。",
        },
        {
          question: "成熟まで必ず3.5日ですか？",
          answer: "いいえ。条件は確認数で、時間は実際のブロック生成速度によります。",
        },
      ],
    },
    sources: [
      {
        name: "xCoin · mainnet and mining",
        url: "https://xcoinproject.com/",
      },
      {
        name: "xCoin · whitepaper: solo pool and coinbase maturity",
        url: "https://xcoinproject.com/whitepaper",
      },
      {
        name: "Mac Metal Miner · mainnet setup",
        url: "https://macmetalminer.com/",
      },
      {
        name: "IOTA Watch · source and data rules",
        url: "https://github.com/molimao/iota",
      },
    ],
    related: ["xid-worker-hashrate-shares", "xid-mmm-mainnet-setup"],
    keywords: {
      zh: ["XID 挖矿收益", "XID 奖励成熟", "XID 余额", "coinbase 1000 确认"],
      "zh-TW": ["XID 挖礦收益", "XID 獎勵成熟", "XID 餘額", "coinbase 1000 確認"],
      en: ["XID mining rewards", "XID coinbase maturity", "XID balance", "1000 confirmations"],
      ko: ["XID 채굴 보상", "XID 보상 성숙", "XID 잔액", "1000 확인"],
      ja: ["XID マイニング報酬", "XID 報酬成熟", "XID 残高", "1000 確認"],
    },
  },
  {
    slug: "quantus-mainnet-mining-mac",
    project: "quantus",
    published: "2026-10-03",
    modified: "2026-10-03",
    title: {
      zh: "Quantus QTC 主网挖矿：Mac 节点同步与监控",
      "zh-TW": "Quantus QTC 主網挖礦：Mac 節點同步與監控",
      en: "Quantus QTC mining on Mac: mainnet sync and monitoring",
      ko: "Mac에서 Quantus QTC 채굴: 메인넷 동기화와 모니터링",
      ja: "MacでQuantus QTCをマイニング：メインネット同期と監視",
    },
    description: {
      zh: "了解 Quantus 节点与矿工的区别，核对主网、Apple Silicon 版本、同步状态和公开收益地址。",
      "zh-TW":
        "了解 Quantus 節點與礦工的差異，核對主網、Apple Silicon 版本、同步狀態和公開收益地址。",
      en: "Understand the Quantus node and miner, mainnet selection, Apple Silicon builds, sync state and public reward addresses.",
      ko: "Quantus 노드와 채굴기를 구분하고 메인넷, Apple Silicon 빌드, 동기화 상태와 공개 보상 주소를 확인하세요.",
      ja: "Quantusのノードとマイナーを区別し、メインネット、Apple Siliconビルド、同期状態、公開報酬アドレスを確認します。",
    },
    summary: {
      zh: "Quantus QTC 是工作量证明挖矿，不是 AI 训练。自建挖矿需要同步主网的节点与连接它的矿工；节点进程运行不代表已同步或获得奖励。本站只读主网记录，不安装或运行本地节点。",
      "zh-TW":
        "Quantus QTC 是工作量證明挖礦，不是 AI 訓練。自建挖礦需要同步主網的節點與連接它的礦工；節點程式執行不代表已同步或獲得獎勵。本站只讀主網紀錄，不安裝或執行本地節點。",
      en: "Quantus QTC uses proof-of-work mining, not AI training. Self-hosted mining needs a mainnet-synced node and a miner connected to it. A running process does not establish synchronization or rewards. This site only reads mainnet records.",
      ko: "Quantus QTC는 AI 학습이 아닌 작업증명 채굴입니다. 직접 운영하려면 메인넷에 동기화된 노드와 연결된 채굴기가 필요합니다. 프로세스 실행만으로 동기화나 보상을 확인할 수는 없습니다. 이 사이트는 메인넷 기록만 조회합니다.",
      ja: "Quantus QTCはAI学習ではなくPoWマイニングです。自己運用にはメインネットに同期したノードと接続されたマイナーが必要です。プロセスの稼働だけでは同期や報酬を確認できません。当サイトはメインネット記録の読み取りのみを行います。",
    },
    topic: {
      zh: "安装与监控",
      "zh-TW": "安裝與監控",
      en: "Setup and monitoring",
      ko: "설정 및 모니터링",
      ja: "設定とモニタリング",
    },
    body: {
      zh: [
        "## 从当前主网指南开始",
        "按 [Quantus 官方挖矿指南](https://docs.quantus.com/guides/mining/) 选择平台版本，并核对节点与矿工的协议兼容性。Apple Silicon 应选对应原生版本；不能把网页上的算力当作这台 Mac 的性能承诺。",
        "## 同步完成后再判断挖矿",
        "核对节点所在链与当前高度；官方指南要求先同步至链尖。尚未同步时找到的孤块不能提供有效奖励。用节点日志与官方浏览器对照，不以进程存活、风扇转动或网页有区块作为本机正在有效挖矿的证明。",
        "## 主网 QTC 与 Planck 分开",
        "旧教程可能使用 Planck 测试网。本站 Quantus 页面只查询官方主网索引，不合并测试网区块或余额。即使地址相似，也要检查钱包、节点和浏览器选择的是同一个网络。",
        "## 用公开地址查看奖励",
        "按官方指南找到实际挖矿使用的 Wormhole 公开 Address，再保存到 [Quantus 监控](/projects/quantus)。助记词、inner hash 和矿工认证文件留在本机；网页不需要它们。进一步看 [地址与收益](/learn/quantus-wormhole-rewards) 或 [无奖励排查](/learn/quantus-mining-no-rewards)。",
      ],
      "zh-TW": [
        "## 從目前主網指南開始",
        "依 [Quantus 官方挖礦指南](https://docs.quantus.com/guides/mining/) 選擇平台版本，並核對節點與礦工的協定相容性。Apple Silicon 應選對應原生版本；網頁算力不是這台 Mac 的效能承諾。",
        "## 同步完成後再判斷挖礦",
        "核對節點所在鏈與目前高度；官方指南要求先同步至鏈尖。尚未同步時找到的孤塊無法提供有效獎勵。對照節點日誌與官方瀏覽器，不以程式存活、風扇轉動或網頁有區塊當成本機有效挖礦的證明。",
        "## 主網 QTC 與 Planck 分開",
        "舊教學可能使用 Planck 測試網。本站 Quantus 頁面只查詢官方主網索引，不合併測試網區塊或餘額。即使地址相似，也要檢查錢包、節點和瀏覽器選擇同一個網路。",
        "## 用公開地址查看獎勵",
        "依官方指南找到實際挖礦使用的 Wormhole 公開 Address，再儲存至 [Quantus 監控](/projects/quantus)。助記詞、inner hash 與礦工認證檔案留在本機；網頁不需要它們。繼續看 [地址與收益](/learn/quantus-wormhole-rewards) 或 [無獎勵排查](/learn/quantus-mining-no-rewards)。",
      ],
      en: [
        "## Start with current mainnet instructions",
        "Use the [official Quantus mining guide](https://docs.quantus.com/guides/mining/) to select your platform build and verify node/miner protocol compatibility. Choose the native Apple Silicon build where applicable. Website hashrate is not a benchmark guarantee for your Mac.",
        "## Verify synchronization before mining activity",
        "Check the node’s chain and height against the tip; the official guide requires synchronization first. Orphan blocks found before sync do not earn valid rewards. Compare local logs with the explorer rather than treating a live process, spinning fan or network block as proof of your own mining.",
        "## Keep mainnet QTC separate from Planck",
        "Older tutorials may use the Planck testnet. This monitor queries only the official mainnet index and does not merge testnet blocks or balances. Even if addresses look similar, confirm that wallet, node and explorer refer to the same network.",
        "## Monitor rewards using the public address",
        "Find the actual mining wormhole public Address using the official guide, then save it in the [Quantus monitor](/projects/quantus). Keep recovery words, inner hash and miner authentication files local. See [addresses and rewards](/learn/quantus-wormhole-rewards) or [missing reward checks](/learn/quantus-mining-no-rewards).",
      ],
      ko: [
        "## 최신 메인넷 안내부터 확인하기",
        "[Quantus 공식 채굴 안내](https://docs.quantus.com/guides/mining/)에서 플랫폼 빌드와 노드·채굴기 프로토콜 호환성을 확인하세요. Apple Silicon은 해당 네이티브 빌드를 사용하세요. 웹사이트 수치를 자신의 Mac 성능 보장으로 해석하지 마세요.",
        "## 동기화 완료 후 채굴 상태 판단하기",
        "노드의 체인과 높이가 최신 체인 끝과 일치하는지 확인하세요. 공식 안내는 동기화 완료를 먼저 요구합니다. 동기화 전 고아 블록은 유효 보상을 받지 못합니다. 프로세스나 팬 동작 대신 로컬 로그와 탐색기를 대조하세요.",
        "## 메인넷 QTC와 Planck 분리하기",
        "예전 튜토리얼은 Planck 테스트넷을 사용할 수 있습니다. 모니터는 공식 메인넷 인덱스만 조회하며 테스트넷 블록이나 잔액을 합치지 않습니다. 주소가 비슷해도 지갑, 노드, 탐색기의 네트워크가 같은지 확인하세요.",
        "## 공개 주소로 보상 조회하기",
        "공식 안내에서 실제 채굴에 쓰는 웜홀 공개 Address를 찾아 [Quantus 모니터](/projects/quantus)에 저장하세요. 복구 구문, inner hash, 채굴 인증 파일은 로컬에 보관하세요. [주소와 보상](/learn/quantus-wormhole-rewards), [보상 누락 점검](/learn/quantus-mining-no-rewards)을 참고하세요.",
      ],
      ja: [
        "## 現行のメインネット案内から始める",
        "[Quantus公式マイニングガイド](https://docs.quantus.com/guides/mining/)でプラットフォームとノード・マイナーのプロトコル互換性を確認します。Apple Siliconには対応するネイティブ版を選び、サイトの算力を自分のMacの性能保証とは扱いません。",
        "## 同期を確認してからマイニングを判断する",
        "ノードのチェーンと高さを最新の先端と照合します。公式ガイドは同期完了を先に求めています。同期前の孤立ブロックには有効な報酬がありません。プロセスやファンの稼働ではなくローカルログとエクスプローラーを比較してください。",
        "## メインネットQTCとPlanckを分ける",
        "古い手順にはPlanckテストネットのものがあります。モニターは公式メインネット索引だけを照会し、テストネットのブロックや残高を合算しません。アドレスが似ていてもウォレット、ノード、エクスプローラーのネットワークを確認します。",
        "## 公開アドレスで報酬を調べる",
        "公式ガイドで実際のマイニング用Wormhole公開Addressを確認し、[Quantusモニター](/projects/quantus)に保存します。復元フレーズ、inner hash、認証ファイルはローカルに保管します。[アドレスと報酬](/learn/quantus-wormhole-rewards)、[報酬なしの確認](/learn/quantus-mining-no-rewards)も参照してください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "Mac 上进程运行就代表有 QTC 收益吗？",
          answer: "不是。还需确认主网同步、矿工连接和被主鏈接受的奖励记录。",
        },
        {
          question: "Planck 余额会并入本站 QTC 数字吗？",
          answer: "不会，本站只读取 Quantus 主网。",
        },
      ],
      "zh-TW": [
        {
          question: "Mac 上程式執行就代表有 QTC 收益嗎？",
          answer: "不是。還需確認主網同步、礦工連線與主鏈接受的獎勵紀錄。",
        },
        {
          question: "Planck 餘額會併入本站 QTC 數字嗎？",
          answer: "不會，本站只讀取 Quantus 主網。",
        },
      ],
      en: [
        {
          question: "Does a running Mac process prove QTC rewards?",
          answer: "No. Confirm mainnet sync, miner connectivity and accepted chain reward records.",
        },
        {
          question: "Does this monitor include Planck balances?",
          answer: "No. This monitor reads Quantus mainnet only.",
        },
      ],
      ko: [
        {
          question: "Mac 프로세스가 실행 중이면 QTC 보상이 있나요?",
          answer: "아니요. 메인넷 동기화, 채굴기 연결, 체인이 수락한 보상 기록을 확인해야 합니다.",
        },
        {
          question: "모니터에 Planck 잔액도 포함되나요?",
          answer: "아니요. Quantus 메인넷만 조회합니다.",
        },
      ],
      ja: [
        {
          question: "Macのプロセス稼働はQTC報酬の証明ですか？",
          answer: "いいえ。主網同期、マイナー接続、チェーンに受理された報酬記録を確認します。",
        },
        {
          question: "Planck残高も合算されますか？",
          answer: "いいえ。Quantusメインネットのみを読み取ります。",
        },
      ],
    },
    sources: [
      {
        name: "Quantus · official mainnet mining guide",
        url: "https://docs.quantus.com/guides/mining/",
      },
      {
        name: "Quantus · miner repository",
        url: "https://github.com/Quantus-Network/quantus-miner",
      },
      {
        name: "Quantus · official mainnet explorer",
        url: "https://explorer.quantus.com/",
      },
      {
        name: "IOTA Watch · source and data rules",
        url: "https://github.com/molimao/iota",
      },
    ],
    related: ["quantus-wormhole-rewards", "quantus-mining-no-rewards", "iota-xid-quantus-compared"],
    keywords: {
      zh: ["Quantus 挖矿", "QTC 主网", "Mac Apple Silicon 挖矿", "Quantus 节点同步"],
      "zh-TW": ["Quantus 挖礦", "QTC 主網", "Mac Apple Silicon 挖礦", "Quantus 節點同步"],
      en: ["Quantus mining Mac", "QTC mainnet", "Apple Silicon miner", "Quantus node sync"],
      ko: ["Quantus 채굴 Mac", "QTC 메인넷", "Apple Silicon 채굴", "Quantus 노드 동기화"],
      ja: [
        "Quantus マイニング Mac",
        "QTC メインネット",
        "Apple Silicon マイナー",
        "Quantus ノード同期",
      ],
    },
  },
  {
    slug: "quantus-wormhole-rewards",
    project: "quantus",
    published: "2026-10-03",
    modified: "2026-10-03",
    title: {
      zh: "Quantus Wormhole 地址：今日与累计 QTC 收益怎么查",
      "zh-TW": "Quantus Wormhole 地址：今日與累計 QTC 收益怎麼查",
      en: "Quantus wormhole address: check daily and lifetime QTC rewards",
      ko: "Quantus 웜홀 주소: 오늘과 누적 QTC 보상 조회",
      ja: "Quantus Wormholeアドレス：今日と累計QTC報酬の確認",
    },
    description: {
      zh: "用公开 qz 地址查询 Quantus 主网奖励，区分挖矿收益、钱包余额、inner hash 与索引时间。",
      "zh-TW":
        "用公開 qz 地址查詢 Quantus 主網獎勵，區分挖礦收益、錢包餘額、inner hash 與索引時間。",
      en: "Look up mainnet rewards by public qz address and separate mining income, wallet balance, inner hash and index freshness.",
      ko: "공개 qz 주소로 메인넷 보상을 조회하고 채굴 수입, 지갑 잔액, inner hash, 인덱스 시각을 구분하세요.",
      ja: "公開qzアドレスで主網報酬を照会し、採掘収入、ウォレット残高、inner hash、索引時刻を区別します。",
    },
    summary: {
      zh: "本站需要实际用于挖矿的公开 Wormhole 地址，不需要 inner hash。今日 QTC 是香港时间 00:00 起已索引的挖矿奖励，累计是索引中的历史奖励总额；它们不是当前钱包余额。",
      "zh-TW":
        "本站需要實際用於挖礦的公開 Wormhole 地址，不需要 inner hash。今日 QTC 是香港時間 00:00 起已索引的挖礦獎勵，累計是索引中的歷史獎勵總額；兩者不是目前錢包餘額。",
      en: "Use the actual public wormhole mining address, not the inner hash. Today’s QTC is indexed mining rewards since 00:00 Hong Kong time; lifetime is the index’s historical mining reward total. Neither is the current wallet balance.",
      ko: "실제 채굴용 공개 웜홀 주소를 사용하고 inner hash는 입력하지 마세요. 오늘의 QTC는 홍콩 시간 00:00 이후 인덱싱된 채굴 보상이고 누적은 과거 채굴 보상의 합계입니다. 둘 다 현재 지갑 잔액은 아닙니다.",
      ja: "実際の公開Wormhole採掘アドレスを使い、inner hashは入力しません。今日のQTCは香港時間00:00以降の索引済み採掘報酬、累計は索引内の過去の採掘報酬合計です。現在のウォレット残高とは別です。",
    },
    topic: {
      zh: "数据与收益",
      "zh-TW": "資料與收益",
      en: "Data and rewards",
      ko: "데이터 및 보상",
      ja: "データと報酬",
    },
    body: {
      zh: [
        "## 找到实际收益地址",
        "官方指南的密钥生成输出有公开 Address，节点启动日志也可显示收益地址。qz 前缀不能证明它就是本机正在使用的地址；请核对完整字符串与主网选择。不要把恢复词或 inner hash 复制到网页。",
        "## 今日收益的时间和精度",
        "本站按 UTC+8 的日界线统计，不跟随浏览器所在地。QTC 链上整数按 12 位小数精确转换。午夜后今日数值可归零而累计仍为正；先查奖励记录时间，再判断是否异常。",
        "## 索引奖励不是钱包余额",
        "奖励记录回答地址获得了哪些挖矿奖励，不计算所有转入转出。一个地址可以接收多台设备的奖励，也可能没有近期奖励；不能据此推算设备数量、型号或在线状态。",
        "## 保存与交叉核对",
        "在 [Quantus 监控](/projects/quantus) 保存地址与名称，可展开最近奖励并跳转官方浏览器。每个项目免费 5 台、Pro 50 台；登录可跨设备同步，未登录时保存在当前浏览器，可导出。无记录时按 [无奖励排查](/learn/quantus-mining-no-rewards) 核对地址、同步和索引时间。",
      ],
      "zh-TW": [
        "## 找到實際收益地址",
        "官方指南的金鑰產生輸出有公開 Address，節點啟動日誌也可顯示收益地址。qz 前綴不能證明就是本機使用的地址；請核對完整字串與主網選擇。不要把復原詞或 inner hash 複製到網頁。",
        "## 今日收益的時間與精度",
        "本站依 UTC+8 日界線統計，不跟隨瀏覽器所在地。QTC 鏈上整數依 12 位小數精確轉換。午夜後今日數值可歸零而累計仍為正；先查獎勵紀錄時間，再判斷是否異常。",
        "## 索引獎勵不是錢包餘額",
        "獎勵紀錄回答地址獲得哪些挖礦獎勵，不計算所有轉入轉出。一個地址可接收多台設備的獎勵，也可能沒有近期獎勵；不能據此推算設備數量、型號或上線狀態。",
        "## 儲存與交叉核對",
        "在 [Quantus 監控](/projects/quantus) 儲存地址與名稱，可展開最近獎勵並前往官方瀏覽器。每個項目免費 5 台、Pro 50 台；登入可跨設備同步，未登入時儲存在目前瀏覽器，可匯出。無紀錄時依 [無獎勵排查](/learn/quantus-mining-no-rewards) 核對地址、同步與索引時間。",
      ],
      en: [
        "## Find the address actually used for rewards",
        "The official key-generation output includes a public Address; startup logs can also identify the reward address. A qz prefix does not prove it is the one your miner uses. Match the complete string and mainnet selection. Never paste recovery words or the inner hash into the website.",
        "## Daily rewards: time window and precision",
        "The monitor uses a UTC+8 calendar day, not the browser’s location. It converts chain integers with exact 12-decimal QTC precision. Today can reset to zero after midnight while lifetime stays positive; inspect reward timestamps before treating that as a fault.",
        "## Indexed rewards are not wallet balance",
        "Reward records describe mining rewards attributed to the address, not all incoming and outgoing transfers. An address can receive several devices’ rewards or have no recent reward. Do not infer device count, model or online status from it.",
        "## Save and cross-check",
        "Save an address and name in the [Quantus monitor](/projects/quantus), expand recent rewards and follow the explorer link. Free supports 5 devices per project and Pro supports 50. Sign in to sync across devices; unsigned lists stay in this browser and can be exported. For absent records, use [missing reward checks](/learn/quantus-mining-no-rewards) to inspect address, sync and index time.",
      ],
      ko: [
        "## 실제 보상 주소 찾기",
        "공식 키 생성 출력의 공개 Address나 노드 시작 로그에서 보상 주소를 확인할 수 있습니다. qz 접두사만으로 현재 채굴 주소라고 확정할 수 없습니다. 전체 문자열과 메인넷 선택을 대조하고 복구 구문이나 inner hash는 웹사이트에 입력하지 마세요.",
        "## 오늘 보상의 시간 범위와 정밀도",
        "모니터는 브라우저 위치가 아닌 UTC+8 날짜 경계를 사용하고 온체인 정수를 QTC 소수점 12자리로 정확히 변환합니다. 자정 이후 오늘 값은 0으로 초기화되어도 누적은 양수일 수 있습니다. 먼저 보상 시각을 확인하세요.",
        "## 인덱싱된 보상과 지갑 잔액은 다름",
        "보상 기록은 주소에 귀속된 채굴 보상을 보여주며 모든 입출금을 계산하지 않습니다. 하나의 주소가 여러 기기의 보상을 받을 수 있고 최근 보상이 없을 수도 있습니다. 이 기록으로 기기 수, 모델, 온라인 상태를 추정하지 마세요.",
        "## 저장하고 교차 확인하기",
        "[Quantus 모니터](/projects/quantus)에 주소와 이름을 저장하고 최근 보상 및 공식 탐색기를 확인하세요. 무료는 프로젝트별 5대, Pro는 50대입니다. 로그인하면 목록을 동기화하며, 로그인하지 않으면 브라우저에 저장합니다. 기록이 없으면 [보상 누락 점검](/learn/quantus-mining-no-rewards)에서 주소, 동기화와 인덱싱 시각을 확인하세요.",
      ],
      ja: [
        "## 実際の報酬アドレスを確認する",
        "公式の鍵生成出力には公開Addressがあり、起動ログでも報酬アドレスを確認できます。qzという接頭辞だけでは使用中の採掘アドレスと断定できません。完全な文字列とメインネット選択を照合し、復元フレーズやinner hashはサイトに貼り付けません。",
        "## 今日の報酬の時間範囲と精度",
        "モニターはブラウザーの所在地ではなくUTC+8の日付境界を使い、チェーン整数をQTCの小数12桁で正確に換算します。深夜に今日がゼロになっても累計は正のままの場合があります。まず報酬の時刻を確認します。",
        "## 索引報酬とウォレット残高は別",
        "報酬記録はアドレスに帰属する採掘報酬を示し、全入出金を計算しません。1つのアドレスが複数機器の報酬を受け取る場合も、最近の報酬がない場合もあります。台数、機種、オンライン状態は推測できません。",
        "## 保存して照合する",
        "[Quantusモニター](/projects/quantus)にアドレスと名前を保存し、最近の報酬と公式エクスプローラーを確認します。無料版は各プロジェクト5台、Proは50台です。ログインで一覧を同期し、未ログインではブラウザーに保存します。記録がない場合は[報酬なしの確認](/learn/quantus-mining-no-rewards)でアドレス、同期とインデックス時刻を確認してください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "网页需要 Quantus inner hash 吗？",
          answer: "不需要。只用公开收益地址查询；inner hash 保留在本机。",
        },
        {
          question: "累计 QTC 为什么与钱包余额不同？",
          answer: "累计统计已索引挖矿奖励，钱包余额还受到转入转出等影响。",
        },
      ],
      "zh-TW": [
        {
          question: "網頁需要 Quantus inner hash 嗎？",
          answer: "不需要。只用公開收益地址查詢；inner hash 留在本機。",
        },
        {
          question: "累計 QTC 為什麼與錢包餘額不同？",
          answer: "累計統計已索引挖礦獎勵，錢包餘額還受轉入轉出等影響。",
        },
      ],
      en: [
        {
          question: "Does the website need my Quantus inner hash?",
          answer:
            "No. Only the public reward address is used for lookup; keep the inner hash local.",
        },
        {
          question: "Why does lifetime QTC differ from wallet balance?",
          answer:
            "Lifetime counts indexed mining rewards; wallet balance also reflects transfers and other state.",
        },
      ],
      ko: [
        {
          question: "웹사이트에 Quantus inner hash가 필요한가요?",
          answer: "아니요. 공개 보상 주소만 조회에 사용하고 inner hash는 로컬에 보관하세요.",
        },
        {
          question: "누적 QTC가 지갑 잔액과 다른 이유는 무엇인가요?",
          answer: "누적은 인덱싱된 채굴 보상이고 지갑 잔액은 입출금 등에도 영향을 받습니다.",
        },
      ],
      ja: [
        {
          question: "サイトにQuantus inner hashは必要ですか？",
          answer:
            "不要です。照会には公開報酬アドレスだけを使い、inner hashはローカルに保管します。",
        },
        {
          question: "累計QTCとウォレット残高が違う理由は？",
          answer: "累計は索引済み採掘報酬を数え、ウォレット残高には送金なども影響します。",
        },
      ],
    },
    sources: [
      {
        name: "Quantus · official mainnet mining guide",
        url: "https://docs.quantus.com/guides/mining/",
      },
      {
        name: "Quantus · official mainnet explorer",
        url: "https://explorer.quantus.com/",
      },
      {
        name: "IOTA Watch · source and data rules",
        url: "https://github.com/molimao/iota",
      },
    ],
    related: ["quantus-mining-no-rewards", "quantus-mainnet-mining-mac"],
    keywords: {
      zh: ["Quantus 收益查询", "QTC 今日收益", "Quantus Wormhole 地址", "qz 地址"],
      "zh-TW": ["Quantus 收益查詢", "QTC 今日收益", "Quantus Wormhole 地址", "qz 地址"],
      en: ["Quantus reward lookup", "QTC daily rewards", "Quantus wormhole address", "qz address"],
      ko: ["Quantus 보상 조회", "QTC 오늘 보상", "Quantus 웜홀 주소", "qz 주소"],
      ja: ["Quantus 報酬確認", "QTC 今日の報酬", "Quantus Wormhole アドレス", "qz アドレス"],
    },
  },
  {
    slug: "quantus-mining-no-rewards",
    project: "quantus",
    published: "2026-10-03",
    modified: "2026-10-03",
    title: {
      zh: "Quantus 挖矿没有收益？先查地址、同步和奖励记录",
      "zh-TW": "Quantus 挖礦沒有收益？先查地址、同步和獎勵紀錄",
      en: "Quantus mining with no rewards: address, sync and index checks",
      ko: "Quantus 채굴 보상이 없나요? 주소·동기화·기록 점검",
      ja: "Quantusのマイニング報酬がない：アドレス・同期・記録の確認",
    },
    description: {
      zh: "区分真实零值、没有索引记录和刷新失败，检查主网地址、节点同步、矿工版本及矿池结算。",
      "zh-TW": "區分真實零值、沒有索引紀錄與更新失敗，檢查主網地址、節點同步、礦工版本及礦池結算。",
      en: "Distinguish a valid zero, absent indexed rewards and refresh failure; check mainnet addresses, sync, miner compatibility and pool payouts.",
      ko: "유효한 0, 인덱스 기록 없음, 새로고침 실패를 구분하고 주소, 노드 동기화, 채굴기 호환성, 풀 정산을 확인하세요.",
      ja: "有効なゼロ、索引記録なし、更新失敗を区別し、主網アドレス、同期、バージョン互換性、プール精算を確認します。",
    },
    summary: {
      zh: "先分清“今日为 0”“没有索引记录”“来源不可用”是哪一种，再核对实际收益地址、主网和节点同步。没有近期奖励不能单独证明设备离线；矿池给个人地址的转账也不等于本站查询的出块奖励。",
      "zh-TW":
        "先分清「今日為 0」「沒有索引紀錄」「來源不可用」是哪一種，再核對實際收益地址、主網與節點同步。沒有近期獎勵不能單獨證明設備離線；礦池給個人地址的轉帳也不等於本站查詢的出塊獎勵。",
      en: "First identify whether the result is today’s valid zero, no indexed record or an unavailable source. Then verify the actual reward address, mainnet and node sync. No recent reward does not prove an offline device; pool transfers to participants are separate from indexed block rewards.",
      ko: "먼저 오늘의 유효한 0인지, 인덱스 기록이 없는지, 원본을 조회할 수 없는지 구분하세요. 실제 보상 주소, 메인넷, 노드 동기화를 확인하세요. 최근 보상 없음은 오프라인의 증거가 아니며 풀의 개인 지급도 블록 보상과 별도입니다.",
      ja: "まず今日の有効なゼロ、索引記録なし、取得不能のどれかを確認し、実際の報酬アドレス、メインネット、同期を照合します。最近の報酬なしはオフラインの証明ではなく、プールの個人向け送金も索引されたブロック報酬とは別です。",
    },
    topic: {
      zh: "数据与收益",
      "zh-TW": "資料與收益",
      en: "Data and rewards",
      ko: "데이터 및 보상",
      ja: "データと報酬",
    },
    body: {
      zh: [
        "## 从页面的数据状态开始",
        "刷新失败时，旧数字保留原来的获取时间，不会变成最新数据。来源记录太旧也会提示。有效查询没有当天奖励可为 0；格式异常或缺失字段显示未知。先解决取数问题，再判断挖矿情况。",
        "## 核对本机与网络",
        "按 [官方挖矿指南](https://docs.quantus.com/guides/mining/) 核对主网、链尖、节点与矿工版本、连接状态。同步未完成、孤块、协议不匹配或断连都需要在本机确认；网页不能读取日志或替你修复进程。",
        "## 矿池结算另查",
        "如果通过矿池挖矿，区块奖励可能先记到矿池的出块地址，再按矿池规则转给参与者。本站索引的 miner_reward 不是矿池的全部转账账本。个人地址没有出块奖励，不代表没有矿池收入；请核对矿池结算页面与钱包交易。",
        "## 留下可对照的检查记录",
        "记录公开地址、所在网络、奖励区块、来源时间和本机状态。检查 [Quantus 监控](/projects/quantus) 的最近奖励并打开官方浏览器。地址口径见 [Wormhole 与 QTC 收益](/learn/quantus-wormhole-rewards)，主网步骤见 [Mac 节点同步](/learn/quantus-mainnet-mining-mac)。",
      ],
      "zh-TW": [
        "## 從頁面的資料狀態開始",
        "更新失敗時，舊數字保留原取得時間，不會變成最新資料。來源紀錄太舊也會提示。有效查詢沒有當天獎勵可為 0；格式異常或缺少欄位顯示未知。先處理取數問題，再判斷挖礦情況。",
        "## 核對本機與網路",
        "依 [官方挖礦指南](https://docs.quantus.com/guides/mining/) 核對主網、鏈尖、節點與礦工版本、連線狀態。未完成同步、孤塊、協定不符或斷線都須在本機確認；網頁不能讀取日誌或修復程式。",
        "## 礦池結算另外查詢",
        "若透過礦池挖礦，區塊獎勵可能先記到礦池的出塊地址，再依規則轉給參與者。本站索引的 miner_reward 不是礦池完整轉帳帳本。個人地址沒有出塊獎勵，不代表沒有礦池收入；請核對礦池結算與錢包交易。",
        "## 留下可對照的檢查紀錄",
        "記錄公開地址、網路、獎勵區塊、來源時間與本機狀態。檢查 [Quantus 監控](/projects/quantus) 的最近獎勵並開啟官方瀏覽器。地址說明見 [Wormhole 與 QTC 收益](/learn/quantus-wormhole-rewards)，主網步驟見 [Mac 節點同步](/learn/quantus-mainnet-mining-mac)。",
      ],
      en: [
        "## Start with the data state",
        "A failed refresh retains previous numbers with their original fetch time. Old source records are flagged separately. A successful query with no reward today can be zero; malformed or absent data stays unknown. Resolve retrieval failures before assessing mining.",
        "## Check the local node and network",
        "Use the [official mining guide](https://docs.quantus.com/guides/mining/) to check mainnet, chain tip, node/miner versions and connectivity. Incomplete sync, orphan blocks, protocol mismatch or disconnection require local inspection. The website cannot read your logs or repair a process.",
        "## Check pool settlement separately",
        "When mining through a pool, block rewards may first go to its block-producing address and later be transferred to participants. The queried miner_reward index is not the pool’s full transfer ledger. No block reward on your personal address does not establish no pool income; check pool settlement and wallet transactions.",
        "## Keep a comparable check record",
        "Record the public address, network, reward block, source time and local state. Inspect recent rewards in the [Quantus monitor](/projects/quantus) and the explorer. See [wormhole and QTC rewards](/learn/quantus-wormhole-rewards) and [Mac mainnet sync](/learn/quantus-mainnet-mining-mac).",
      ],
      ko: [
        "## 데이터 상태부터 확인하기",
        "새로고침 실패 시 이전 숫자와 원래 조회 시각을 유지합니다. 오래된 원본 기록도 별도로 표시합니다. 정상 조회에서 오늘 보상이 없으면 0일 수 있지만 잘못된 형식이나 누락된 값은 알 수 없음으로 남깁니다.",
        "## 로컬 노드와 네트워크 확인하기",
        "[공식 채굴 안내](https://docs.quantus.com/guides/mining/)로 메인넷, 최신 체인 높이, 노드·채굴기 버전과 연결을 확인하세요. 동기화 미완료, 고아 블록, 프로토콜 불일치, 연결 끊김은 로컬에서 점검해야 합니다. 사이트는 로그를 읽거나 프로세스를 복구하지 않습니다.",
        "## 풀 정산은 별도로 확인하기",
        "풀 채굴에서는 블록 보상이 먼저 풀의 블록 생성 주소에 기록되고 참여자에게 나중에 전송될 수 있습니다. 조회하는 miner_reward 인덱스는 풀의 전체 송금 장부가 아닙니다. 개인 주소의 블록 보상이 없더라도 풀 정산과 지갑 거래를 따로 확인하세요.",
        "## 비교 가능한 점검 기록 남기기",
        "공개 주소, 네트워크, 보상 블록, 원본 시각과 로컬 상태를 기록하세요. [Quantus 모니터](/projects/quantus)와 탐색기의 최근 보상을 확인하고 [웜홀·QTC 보상](/learn/quantus-wormhole-rewards), [Mac 메인넷 동기화](/learn/quantus-mainnet-mining-mac)를 참고하세요.",
      ],
      ja: [
        "## データ状態から確認する",
        "更新失敗では以前の数値と元の取得時刻を保持し、古い元データも別に表示します。正常な照会で今日の報酬がなければゼロですが、異常や欠落は不明です。取得の問題を先に解決します。",
        "## ローカルノードとネットワークを確認する",
        "[公式マイニングガイド](https://docs.quantus.com/guides/mining/)でメインネット、チェーン先端、ノード・マイナーのバージョン、接続を確認します。未同期、孤立ブロック、プロトコル不一致、切断はローカルで確認し、サイトからログ読取やプロセス修復はできません。",
        "## プール精算は別に確認する",
        "プール採掘ではまずブロック生成アドレスに報酬が記録され、後から参加者へ送金される場合があります。照会するminer_reward索引はプールの全送金台帳ではありません。個人アドレスにブロック報酬がなくても、精算とウォレット取引を別に確認します。",
        "## 比較できる確認記録を残す",
        "公開アドレス、ネットワーク、報酬ブロック、元データ時刻、ローカル状態を記録します。[Quantusモニター](/projects/quantus)と公式の最近の報酬を確認し、[WormholeとQTC報酬](/learn/quantus-wormhole-rewards)、[Macメインネット同期](/learn/quantus-mainnet-mining-mac)も参照します。",
      ],
    },
    questions: {
      zh: [
        {
          question: "今日为 0 能判断 Mac 离线吗？",
          answer: "不能。零奖励、索引延迟、矿池结算和设备在线是不同问题。",
        },
        {
          question: "矿池付款会全部出现在最近挖矿奖励里吗？",
          answer: "不会。本站查询出块奖励索引，矿池转账需要另查。",
        },
      ],
      "zh-TW": [
        {
          question: "今日為 0 能判斷 Mac 離線嗎？",
          answer: "不能。零獎勵、索引延遲、礦池結算與設備上線是不同問題。",
        },
        {
          question: "礦池付款會全部出現在最近挖礦獎勵裡嗎？",
          answer: "不會。本站查詢出塊獎勵索引，礦池轉帳需另外查詢。",
        },
      ],
      en: [
        {
          question: "Does zero today prove my Mac is offline?",
          answer:
            "No. Zero rewards, index delay, pool settlement and device connectivity are different questions.",
        },
        {
          question: "Are all pool payments listed as mining rewards here?",
          answer:
            "No. This queries the block-reward index; pool transfers require a separate check.",
        },
      ],
      ko: [
        {
          question: "오늘 값이 0이면 Mac이 오프라인인가요?",
          answer: "아니요. 보상 0, 인덱스 지연, 풀 정산, 기기 연결은 서로 다른 문제입니다.",
        },
        {
          question: "풀 지급이 모두 채굴 보상 목록에 나오나요?",
          answer: "아니요. 블록 보상 인덱스를 조회하므로 풀 송금은 별도로 확인해야 합니다.",
        },
      ],
      ja: [
        {
          question: "今日がゼロならMacはオフラインですか？",
          answer: "いいえ。報酬ゼロ、索引遅延、プール精算、機器接続は別の問題です。",
        },
        {
          question: "すべてのプール支払が採掘報酬一覧に出ますか？",
          answer: "いいえ。ブロック報酬索引の照会で、プール送金は別に確認します。",
        },
      ],
    },
    sources: [
      {
        name: "Quantus · official mainnet mining guide",
        url: "https://docs.quantus.com/guides/mining/",
      },
      {
        name: "Quantus · official mainnet explorer",
        url: "https://explorer.quantus.com/",
      },
      {
        name: "Quantus · miner repository",
        url: "https://github.com/Quantus-Network/quantus-miner",
      },
      {
        name: "IOTA Watch · source and data rules",
        url: "https://github.com/molimao/iota",
      },
    ],
    related: ["quantus-wormhole-rewards", "quantus-mainnet-mining-mac"],
    keywords: {
      zh: ["Quantus 挖矿没收益", "QTC 收益为零", "Quantus 节点同步", "Quantus 矿池付款"],
      "zh-TW": ["Quantus 挖礦沒收益", "QTC 收益為零", "Quantus 節點同步", "Quantus 礦池付款"],
      en: [
        "Quantus mining no rewards",
        "QTC zero rewards",
        "Quantus node sync",
        "Quantus pool payout",
      ],
      ko: ["Quantus 보상 없음", "QTC 보상 0", "Quantus 노드 동기화", "Quantus 풀 지급"],
      ja: ["Quantus 報酬なし", "QTC 報酬ゼロ", "Quantus ノード同期", "Quantus プール支払"],
    },
  },
  {
    slug: "iota-miner-id-vs-payout-address",
    project: "iota",
    published: "2026-10-03",
    modified: "2026-10-03",
    title: {
      zh: "IOTA Train at Home：Miner ID 与收款 coldkey 的区别",
      "zh-TW": "IOTA Train at Home：Miner ID 與收款 coldkey 的差異",
      en: "IOTA Train at Home: Miner ID vs payout coldkey",
      ko: "IOTA Train at Home: Miner ID와 지급 coldkey 차이",
      ja: "IOTA Train at Home：Miner IDと受取coldkeyの違い",
    },
    description: {
      zh: "监控设备用公开 hotkey，官方应用收款用 coldkey。多台 Mac 同收款地址时如何正确建立设备清单。",
      "zh-TW":
        "監控設備用公開 hotkey，官方應用收款用 coldkey。多台 Mac 共用收款地址時如何正確建立設備清單。",
      en: "Use a public hotkey to monitor a device and a coldkey for official payouts; organize Macs that share a payout address.",
      ko: "기기 모니터에는 공개 hotkey를, 공식 보상 지급에는 coldkey를 사용합니다. 지급 주소를 공유하는 Mac 목록을 올바르게 만드세요.",
      ja: "機器監視は公開hotkey、公式の受取はcoldkeyを使います。受取先を共有するMacの一覧を正しく作るための説明です。",
    },
    summary: {
      zh: "IOTA Watch 监控的是每台 Train at Home 设备的公开 Miner ID（hotkey），不是收款 coldkey。官方 FAQ 允许多台设备共用收款地址，但每台设备的 hotkey 应不同；同一个 ID 不能当作多台设备重复统计。",
      "zh-TW":
        "IOTA Watch 監控每台 Train at Home 設備的公開 Miner ID（hotkey），不是收款 coldkey。官方 FAQ 允許多台設備共用收款地址，但各台 hotkey 應不同；同一 ID 不能當成多台設備重複統計。",
      en: "IOTA Watch monitors each Train at Home device’s public Miner ID (hotkey), not the payout coldkey. The official FAQ allows a shared payout address while requiring distinct device hotkeys. Repeating one ID does not monitor several machines.",
      ko: "IOTA Watch는 지급 coldkey가 아니라 각 Train at Home 기기의 공개 Miner ID(hotkey)를 모니터합니다. 공식 FAQ에 따르면 지급 주소는 공유할 수 있지만 기기 hotkey는 서로 달라야 합니다. 같은 ID를 반복해도 여러 기기가 되지 않습니다.",
      ja: "IOTA Watchは受取coldkeyではなく、各Train at Home機器の公開Miner ID（hotkey）を監視します。公式FAQでは受取先は共有できても機器のhotkeyは別にする必要があります。同じIDを繰り返しても複数台の監視にはなりません。",
    },
    topic: {
      zh: "数据与收益",
      "zh-TW": "資料與收益",
      en: "Data and rewards",
      ko: "데이터 및 보상",
      ja: "データと報酬",
    },
    body: {
      zh: [
        "## 从每台 Mac 复制设备 ID",
        "在官方应用 Miner 页面复制完整公开 Miner ID，按机器分别命名。不要拿收款地址替代设备标识，也不要靠名称猜测地址是否对应本机。步骤见 [找到 Miner ID](/learn/find-miner-id)。",
        "## 共用收款地址不等于共用设备 ID",
        "按 [官方 FAQ](https://docs.macrocosmos.ai/product-and-services/tah/faqs) 在官方应用管理收款。本站 Google 账号只同步 IOTA 设备清单，不设置奖励收款地址，也不能合并不同 hotkey 的钱包或代替官方支付记录。",
        "## 合计前先看设备覆盖",
        "保存多个正确 ID 后，确认每台的收益来源都成功。缺失设备的收益不是 0；合计为部分覆盖时，只代表已读到的设备。登录与本地清单的额度见 [账号同步](/learn/google-account-device-list)。",
        "到 [我的设备](/app) 查看 IOTA 清单。XID 与 Quantus 使用收益地址监控，不能把它们的地址当成 IOTA Miner ID；区别见 [三个项目对比](/learn/iota-xid-quantus-compared)。",
      ],
      "zh-TW": [
        "## 從每台 Mac 複製設備 ID",
        "在官方應用 Miner 頁面複製完整公開 Miner ID，依機器分別命名。不要以收款地址取代設備識別，也不要靠名稱猜測地址是否對應本機。步驟見 [找到 Miner ID](/learn/find-miner-id)。",
        "## 共用收款地址不等於共用設備 ID",
        "依 [官方 FAQ](https://docs.macrocosmos.ai/product-and-services/tah/faqs) 在官方應用管理收款。本站 Google 帳號只同步 IOTA 設備清單，不設定獎勵收款地址，也不能合併不同 hotkey 的錢包或取代官方支付紀錄。",
        "## 合計前先看設備涵蓋",
        "儲存多個正確 ID 後，確認各台收益來源成功。缺少設備的收益不是 0；合計為部分涵蓋時，只代表已讀到的設備。登入與本地清單額度見 [帳號同步](/learn/google-account-device-list)。",
        "至 [我的設備](/app) 查看 IOTA 清單。XID 與 Quantus 使用收益地址監控，不能把這些地址當成 IOTA Miner ID；差異見 [三個專案比較](/learn/iota-xid-quantus-compared)。",
      ],
      en: [
        "## Copy the device ID from each Mac",
        "Copy the complete public Miner ID from each official app’s Miner screen and name it for that machine. Do not replace it with a payout address or use a label to guess ownership. See [finding a Miner ID](/learn/find-miner-id).",
        "## A shared payout address is not a shared device ID",
        "Manage payouts in the official app using the [official FAQ](https://docs.macrocosmos.ai/product-and-services/tah/faqs). Google accounts here synchronize IOTA device lists, not payout settings. They cannot merge wallets or replace official payment records.",
        "## Check device coverage before totaling",
        "After saving distinct correct IDs, confirm reward-source success for each. Missing rewards are not zero; a partial total covers readable devices only. See [account synchronization](/learn/google-account-device-list) for local and signed-in list limits.",
        "Open [My devices](/app) for the IOTA list. XID and Quantus use reward-address monitoring; their addresses are not IOTA Miner IDs. See the [three-project comparison](/learn/iota-xid-quantus-compared).",
      ],
      ko: [
        "## 각 Mac에서 기기 ID 복사하기",
        "공식 앱의 Miner 화면에서 전체 공개 ID를 복사하고 각 기기 이름을 지정하세요. 지급 주소로 기기 ID를 대체하거나 이름만으로 연결 관계를 판단하지 마세요. [Miner ID 찾기](/learn/find-miner-id)를 참고하세요.",
        "## 지급 주소 공유와 기기 ID 공유는 다름",
        "[공식 FAQ](https://docs.macrocosmos.ai/product-and-services/tah/faqs)에 따라 지급 설정은 공식 앱에서 관리하세요. 이 사이트의 Google 계정은 IOTA 기기 목록만 동기화하며 지급 설정, 지갑 병합, 공식 지급 기록을 대체하지 않습니다.",
        "## 합산 전에 기기 수집 범위 확인하기",
        "서로 다른 올바른 ID를 저장한 뒤 기기별 보상 원본 조회 성공 여부를 확인하세요. 누락된 보상은 0이 아니고 부분 합계는 조회된 기기만 포함합니다. 목록 제한은 [계정 동기화](/learn/google-account-device-list)를 참고하세요.",
        "IOTA 목록은 [내 기기](/app)에서 확인하세요. XID와 Quantus는 보상 주소로 모니터하며 IOTA Miner ID와 혼용하지 않습니다. [세 프로젝트 비교](/learn/iota-xid-quantus-compared)를 참고하세요.",
      ],
      ja: [
        "## 各Macから機器IDをコピーする",
        "公式アプリのMiner画面から完全な公開IDをコピーし、機器ごとに命名します。受取アドレスを機器IDの代わりにせず、名前だけで対応を判断しません。[Miner IDの確認](/learn/find-miner-id)を参照してください。",
        "## 共通の受取先と共通機器IDは別",
        "受取設定は[公式FAQ](https://docs.macrocosmos.ai/product-and-services/tah/faqs)に従って公式アプリで管理します。当サイトのGoogleアカウントはIOTA機器一覧を同期するだけで、受取設定、ウォレット統合、公式支払記録の代替は行いません。",
        "## 合計前に機器の取得範囲を確認する",
        "別々の正しいIDを保存後、各機器の報酬取得が成功したか確認します。欠落はゼロではなく、部分合計は読み取れた機器のみを含みます。一覧の上限は[アカウント同期](/learn/google-account-device-list)を参照してください。",
        "IOTA一覧は[自分の機器](/app)で確認します。XIDとQuantusは報酬アドレス監視で、IOTA Miner IDとは混用できません。[3プロジェクトの比較](/learn/iota-xid-quantus-compared)を参照してください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "两台 Mac 可以使用同一个收款 coldkey 吗？",
          answer: "官方 FAQ 允许相同收款地址，但设备 hotkey 必须各自不同。",
        },
        {
          question: "登录网站会更改官方收款地址吗？",
          answer: "不会。登录用于设备清单同步，收款在官方应用设置。",
        },
      ],
      "zh-TW": [
        {
          question: "兩台 Mac 可以使用同一個收款 coldkey 嗎？",
          answer: "官方 FAQ 允許相同收款地址，但設備 hotkey 必須各自不同。",
        },
        {
          question: "登入網站會更改官方收款地址嗎？",
          answer: "不會。登入用於設備清單同步，收款在官方應用設定。",
        },
      ],
      en: [
        {
          question: "Can two Macs use the same payout coldkey?",
          answer:
            "The official FAQ permits the same payout address but requires distinct device hotkeys.",
        },
        {
          question: "Does website sign-in change official payout settings?",
          answer: "No. Sign-in synchronizes the list; payouts are configured in the official app.",
        },
      ],
      ko: [
        {
          question: "Mac 두 대가 같은 지급 coldkey를 쓸 수 있나요?",
          answer: "공식 FAQ는 지급 주소 공유를 허용하지만 기기 hotkey는 달라야 합니다.",
        },
        {
          question: "사이트 로그인으로 공식 지급 주소가 바뀌나요?",
          answer: "아니요. 로그인은 목록 동기화에 사용하고 지급은 공식 앱에서 설정합니다.",
        },
      ],
      ja: [
        {
          question: "2台のMacで同じ受取coldkeyを使えますか？",
          answer: "公式FAQでは受取先は共通でも、機器のhotkeyは別にする必要があります。",
        },
        {
          question: "サイトへのログインで公式受取先は変わりますか？",
          answer: "いいえ。ログインは一覧同期に使い、受取は公式アプリで設定します。",
        },
      ],
    },
    sources: [
      {
        name: "Macrocosmos · Train at Home FAQ",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/faqs",
      },
      {
        name: "Macrocosmos · Train at Home user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
      {
        name: "IOTA Watch · source and data rules",
        url: "https://github.com/molimao/iota",
      },
    ],
    related: ["find-miner-id", "google-account-device-list", "how-rewards-work"],
    keywords: {
      zh: ["IOTA Miner ID", "IOTA hotkey coldkey", "多台 Mac 同收款地址", "Train at Home 设备 ID"],
      "zh-TW": [
        "IOTA Miner ID",
        "IOTA hotkey coldkey",
        "多台 Mac 同收款地址",
        "Train at Home 設備 ID",
      ],
      en: [
        "IOTA Miner ID vs coldkey",
        "Train at Home hotkey",
        "multiple Macs payout address",
        "IOTA device ID",
      ],
      ko: ["IOTA Miner ID coldkey", "Train at Home hotkey", "여러 Mac 지급 주소", "IOTA 기기 ID"],
      ja: ["IOTA Miner ID coldkey", "Train at Home hotkey", "複数Mac 受取アドレス", "IOTA 機器ID"],
    },
  },
  {
    slug: "iota-xid-quantus-compared",
    project: "all",
    subjects: ["iota", "xid", "quantus"],
    published: "2026-10-03",
    modified: "2026-10-03",
    title: {
      zh: "Mac 上的 IOTA、XID / MMM、Quantus：训练与挖矿有什么区别",
      "zh-TW": "Mac 上的 IOTA、XID / MMM、Quantus：訓練與挖礦有何差異",
      en: "IOTA vs XID / MMM vs Quantus on Mac: training and mining",
      ko: "Mac의 IOTA·XID / MMM·Quantus 비교: 학습과 채굴 차이",
      ja: "MacのIOTA・XID / MMM・Quantus比較：学習とマイニングの違い",
    },
    description: {
      zh: "对比三个项目的任务、公开标识、收益单位和监控范围，选择正确入口，不合并不同代币或设备统计。",
      "zh-TW":
        "比較三個專案的任務、公開識別、收益單位與監控範圍，選擇正確入口，不合併不同代幣或設備統計。",
      en: "Compare tasks, public identifiers, reward units and monitoring scope to choose the right entry point without combining currencies or device counts.",
      ko: "세 프로젝트의 작업, 공개 식별자, 보상 단위, 모니터 범위를 비교하고 통화나 기기 수를 합산하지 마세요.",
      ja: "作業、公開ID、報酬単位、監視範囲を比べ、通貨や機器数を合算せず正しい入口を選びます。",
    },
    summary: {
      zh: "IOTA Train at Home 是 Macrocosmos 的 AI 训练；XID 是用 MMM 等矿工参与的 xCoin 挖矿；Quantus 是 QTC 工作量证明挖矿。三个项目的公开标识、收益与数据覆盖不同，在同一网站也要分别查看。",
      "zh-TW":
        "IOTA Train at Home 是 Macrocosmos 的 AI 訓練；XID 是透過 MMM 等礦工參與的 xCoin 挖礦；Quantus 是 QTC 工作量證明挖礦。三個專案的公開識別、收益與資料涵蓋不同，同站也須分別查看。",
      en: "IOTA Train at Home is Macrocosmos AI training; XID is xCoin mining with applications such as MMM; Quantus is QTC proof-of-work mining. Their public identifiers, rewards and data coverage differ and remain separate within this website.",
      ko: "IOTA Train at Home은 Macrocosmos AI 학습, XID는 MMM 등의 앱을 통한 xCoin 채굴, Quantus는 QTC 작업증명 채굴입니다. 공개 식별자, 보상과 데이터 수집 범위가 다르므로 이 사이트에서도 각각 확인해야 합니다.",
      ja: "IOTA Train at HomeはMacrocosmosのAI学習、XIDはMMMなどによるxCoin採掘、QuantusはQTCのPoW採掘です。公開ID、報酬、取得範囲が異なるため、同じサイトでも別々に確認します。",
    },
    topic: {
      zh: "数据与收益",
      "zh-TW": "資料與收益",
      en: "Data and rewards",
      ko: "데이터 및 보상",
      ja: "データと報酬",
    },
    body: {
      zh: [
        "## 先按实际运行程序选择项目",
        "运行 Train at Home 时进入 IOTA 设备页；运行 xCoin MMM 时进入 XID；运行 Quantus 节点与矿工时进入 Quantus。MMM 在这里是应用名称，不是第四种币。不要把同一地址格式或同名搜索结果当作项目一致的证据。",
        "## 收益与设备数不能直接相加",
        "IOTA 的子网 alpha、XID 和 QTC 是不同单位。XID 浏览器余额、Quantus 出块奖励与 IOTA 记账收益也不是同一种统计。一个收益地址可能对应多个 Worker 或设备；只有 IOTA 的设备 Miner ID 清单是按已添加设备标识组织。",
        "## 监控与实际运行分开",
        "本站不会安装矿工、分配机器资源或远程开始训练。是否在一台 Mac 上同时运行多个项目，应通过本机资源与程序文档评估；网页记录不能提供稳定性或收益承诺。IOTA 清单支持账号同步，新项目清单目前仅本地保存。",
        "打开 [项目中心](/projects)，或继续读 [IOTA 地址区分](/learn/iota-miner-id-vs-payout-address)、[MMM 主网设置](/learn/xid-mmm-mainnet-setup) 和 [Quantus 主网同步](/learn/quantus-mainnet-mining-mac)。",
      ],
      "zh-TW": [
        "## 先依實際執行程式選擇專案",
        "執行 Train at Home 進入 IOTA 設備頁；執行 xCoin MMM 進入 XID；執行 Quantus 節點與礦工進入 Quantus。MMM 在這裡是應用名稱，不是第四種幣。相似地址或同名搜尋結果不能證明專案相同。",
        "## 收益與設備數不能直接相加",
        "IOTA 子網 alpha、XID 與 QTC 是不同單位。XID 瀏覽器餘額、Quantus 出塊獎勵與 IOTA 記帳收益不是同一種統計。一個收益地址可能對應多個 Worker 或設備；IOTA 設備 Miner ID 清單才是依新增設備識別組織。",
        "## 監控與實際執行分開",
        "本站不會安裝礦工、分配機器資源或遠端開始訓練。同一台 Mac 是否同時執行多個專案，須依本機資源與程式文件評估；網頁紀錄不能承諾穩定性或收益。IOTA 清單支援帳號同步，新專案清單目前只在本機儲存。",
        "開啟 [專案中心](/projects)，或繼續讀 [IOTA 地址區分](/learn/iota-miner-id-vs-payout-address)、[MMM 主網設定](/learn/xid-mmm-mainnet-setup) 和 [Quantus 主網同步](/learn/quantus-mainnet-mining-mac)。",
      ],
      en: [
        "## Choose by the software you actually run",
        "Use IOTA for Train at Home, XID for xCoin MMM, and Quantus for its node and miner. MMM is an application here, not a fourth currency. Similar-looking addresses and same-name search results do not establish the same project.",
        "## Do not add currencies or device counts",
        "Subnet IOTA alpha, XID and QTC are different units. XID balance, Quantus block rewards and IOTA accounted earnings are different measures too. A reward address may cover several workers or devices; the IOTA list is organized by added device Miner IDs.",
        "## Separate monitoring from operation",
        "The website does not install miners, allocate machine resources or remotely start training. Assess concurrent projects using local resource measurements and current software documentation; web records cannot promise stability or returns. IOTA lists support account sync; new-project lists currently stay local.",
        "Open the [project hub](/projects), or read [IOTA address roles](/learn/iota-miner-id-vs-payout-address), [MMM mainnet setup](/learn/xid-mmm-mainnet-setup) and [Quantus mainnet sync](/learn/quantus-mainnet-mining-mac).",
      ],
      ko: [
        "## 실제 실행하는 소프트웨어로 선택하기",
        "Train at Home은 IOTA, xCoin MMM은 XID, Quantus 노드와 채굴기는 Quantus 페이지를 선택하세요. MMM은 앱 이름이며 네 번째 통화가 아닙니다. 비슷한 주소나 동명 검색 결과만으로 같은 프로젝트라 판단하지 마세요.",
        "## 통화와 기기 수를 직접 합산하지 않기",
        "서브넷 IOTA alpha, XID, QTC는 서로 다른 단위입니다. XID 잔액, Quantus 블록 보상, IOTA 기록 수입도 다른 지표입니다. 보상 주소 하나에 여러 워커나 기기가 연결될 수 있으며 IOTA 목록은 등록한 기기 Miner ID로 구성됩니다.",
        "## 모니터링과 실제 실행 구분하기",
        "이 사이트는 채굴기 설치, 기기 자원 할당, 원격 학습 시작을 하지 않습니다. 동시 실행은 로컬 자원과 최신 소프트웨어 문서로 판단하세요. 웹 기록은 안정성이나 수익을 보장하지 않습니다. IOTA는 계정 동기화를 지원하고 새 프로젝트 목록은 로컬에 저장됩니다.",
        "[프로젝트 허브](/projects)에서 선택하거나 [IOTA 주소 역할](/learn/iota-miner-id-vs-payout-address), [MMM 메인넷 설정](/learn/xid-mmm-mainnet-setup), [Quantus 메인넷 동기화](/learn/quantus-mainnet-mining-mac)를 읽어보세요.",
      ],
      ja: [
        "## 実際に動かすソフトから選ぶ",
        "Train at HomeはIOTA、xCoin MMMはXID、QuantusのノードとマイナーはQuantusページを選びます。MMMはアプリ名で4番目の通貨ではありません。似たアドレスや同名の検索結果は同一プロジェクトの証明になりません。",
        "## 通貨と機器数を合算しない",
        "サブネットIOTA alpha、XID、QTCは異なる単位です。XID残高、Quantusブロック報酬、IOTA記帳収入も別の指標です。報酬アドレスには複数のワーカーや機器が紐づく場合があり、IOTA一覧は追加した機器Miner IDで構成します。",
        "## 監視と実行を区別する",
        "サイトはマイナーのインストール、資源割当、遠隔学習起動を行いません。同時実行はローカル資源の計測と最新文書で判断し、Web記録から安定性や収益は保証できません。IOTAはアカウント同期に対応し、新プロジェクト一覧はローカル保存です。",
        "[プロジェクト一覧](/projects)から選ぶか、[IOTAアドレスの役割](/learn/iota-miner-id-vs-payout-address)、[MMMメインネット設定](/learn/xid-mmm-mainnet-setup)、[Quantusメインネット同期](/learn/quantus-mainnet-mining-mac)を参照してください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "这三个项目都是 AI 训练吗？",
          answer: "不是。这里 IOTA 是 AI 训练，XID 与 Quantus 是工作量证明挖矿。",
        },
        {
          question: "我能直接比较三个项目的币数吗？",
          answer: "不能作为同一收益单位比较。币种与统计口径不同，需要分别核对。",
        },
      ],
      "zh-TW": [
        {
          question: "這三個專案都是 AI 訓練嗎？",
          answer: "不是。這裡 IOTA 是 AI 訓練，XID 與 Quantus 是工作量證明挖礦。",
        },
        {
          question: "我能直接比較三個專案的幣數嗎？",
          answer: "不能當同一收益單位比較。幣種與統計口徑不同，須分別核對。",
        },
      ],
      en: [
        {
          question: "Are all three projects AI training?",
          answer: "No. Here IOTA is AI training; XID and Quantus are proof-of-work mining.",
        },
        {
          question: "Can I directly compare their token amounts?",
          answer: "Not as the same income unit. Currencies and accounting measures differ.",
        },
      ],
      ko: [
        {
          question: "세 프로젝트 모두 AI 학습인가요?",
          answer: "아니요. 여기서 IOTA는 AI 학습이고 XID와 Quantus는 작업증명 채굴입니다.",
        },
        {
          question: "세 프로젝트의 토큰 수량을 직접 비교할 수 있나요?",
          answer: "같은 수입 단위로 비교할 수 없습니다. 통화와 집계 방식이 다릅니다.",
        },
      ],
      ja: [
        {
          question: "3つともAI学習ですか？",
          answer: "いいえ。ここではIOTAがAI学習で、XIDとQuantusはPoW採掘です。",
        },
        {
          question: "3つのトークン数量を直接比較できますか？",
          answer: "同じ収入単位としては比較できません。通貨と集計方法が異なります。",
        },
      ],
    },
    sources: [
      {
        name: "Macrocosmos · Train at Home user guide",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/tah-user-guide",
      },
      {
        name: "Macrocosmos · Train at Home FAQ",
        url: "https://docs.macrocosmos.ai/product-and-services/tah/faqs",
      },
      {
        name: "xCoin · mainnet and mining",
        url: "https://xcoinproject.com/",
      },
      {
        name: "MMM · current application documentation",
        url: "https://github.com/SystemThreat/MMM",
      },
      {
        name: "Quantus · official mainnet mining guide",
        url: "https://docs.quantus.com/guides/mining/",
      },
      {
        name: "Quantus · official mainnet explorer",
        url: "https://explorer.quantus.com/",
      },
      {
        name: "IOTA Watch · source and data rules",
        url: "https://github.com/molimao/iota",
      },
    ],
    related: [
      "iota-miner-id-vs-payout-address",
      "xid-mmm-mainnet-setup",
      "quantus-mainnet-mining-mac",
    ],
    keywords: {
      zh: ["IOTA XID Quantus 对比", "Mac AI 训练与挖矿", "MMM 是什么", "Quantus QTC"],
      "zh-TW": ["IOTA XID Quantus 比較", "Mac AI 訓練與挖礦", "MMM 是什麼", "Quantus QTC"],
      en: ["IOTA vs XID vs Quantus", "Mac AI training vs mining", "what is MMM", "Quantus QTC"],
      ko: ["IOTA XID Quantus 비교", "Mac AI 학습 채굴", "MMM 무엇", "Quantus QTC"],
      ja: ["IOTA XID Quantus 比較", "Mac AI 学習 マイニング", "MMMとは", "Quantus QTC"],
    },
    comparison: {
      zh: {
        headers: ["项目", "任务", "公开标识", "本站数据"],
        rows: [
          [
            "IOTA Train at Home",
            "AI 训练",
            "设备 Miner ID / hotkey",
            "上报状态、训练历史、记账收益",
          ],
          ["XID / MMM", "xCoin 挖矿", "xpa1r 公开收益地址", "可见矿池 Worker、算力、浏览器余额"],
          ["Quantus / QTC", "QPoW 挖矿", "挖矿用 Wormhole 公开地址", "主网区块与索引出块奖励"],
        ],
      },
      "zh-TW": {
        headers: ["專案", "任務", "公開識別", "本站資料"],
        rows: [
          [
            "IOTA Train at Home",
            "AI 訓練",
            "設備 Miner ID / hotkey",
            "回報狀態、訓練歷史、記帳收益",
          ],
          ["XID / MMM", "xCoin 挖礦", "xpa1r 公開收益地址", "可見礦池 Worker、算力、瀏覽器餘額"],
          ["Quantus / QTC", "QPoW 挖礦", "挖礦用 Wormhole 公開地址", "主網區塊與索引出塊獎勵"],
        ],
      },
      en: {
        headers: ["Project", "Task", "Public identifier", "Data in this monitor"],
        rows: [
          [
            "IOTA Train at Home",
            "AI training",
            "Device Miner ID / hotkey",
            "Reported activity, training history, accounted rewards",
          ],
          [
            "XID / MMM",
            "xCoin mining",
            "Public xpa1r payout address",
            "Observed pool workers, hashrate, explorer balance",
          ],
          [
            "Quantus / QTC",
            "QPoW mining",
            "Public mining wormhole address",
            "Mainnet blocks and indexed block rewards",
          ],
        ],
      },
      ko: {
        headers: ["프로젝트", "작업", "공개 식별자", "모니터 데이터"],
        rows: [
          [
            "IOTA Train at Home",
            "AI 학습",
            "기기 Miner ID / hotkey",
            "보고 상태, 학습 이력, 기록 보상",
          ],
          [
            "XID / MMM",
            "xCoin 채굴",
            "공개 xpa1r 보상 주소",
            "관측 풀 워커, 해시레이트, 탐색기 잔액",
          ],
          ["Quantus / QTC", "QPoW 채굴", "공개 채굴 웜홀 주소", "메인넷 블록과 인덱싱된 블록 보상"],
        ],
      },
      ja: {
        headers: ["プロジェクト", "作業", "公開ID", "当サイトのデータ"],
        rows: [
          ["IOTA Train at Home", "AI学習", "機器Miner ID / hotkey", "報告状態、学習履歴、記帳報酬"],
          ["XID / MMM", "xCoin採掘", "公開xpa1r報酬アドレス", "観測プールのワーカー、算力、残高"],
          [
            "Quantus / QTC",
            "QPoW採掘",
            "公開採掘Wormholeアドレス",
            "主網ブロックと索引ブロック報酬",
          ],
        ],
      },
    },
  },
];

export function guidesForProject(project?: import("@/lib/projects").ProjectId) {
  return project
    ? [...projectGuides, ...computeGuides, ...problemGuides].filter(
        (a) => a.project === project || a.project === "all",
      )
    : projectGuides.filter(
        (a) =>
          a.project === "all" ||
          a.slug === "xid-mmm-mainnet-setup" ||
          a.slug === "quantus-mainnet-mining-mac",
      );
}
