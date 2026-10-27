import type { Article } from "../articles";

// Updated to the manager, chain heartbeat and paid-reward implementation on 2026-10-26.
export const acurastDepthGuides: Article[] = [
  {
    slug: "acurast-monitor-guide",
    project: "acurast",
    published: "2026-10-12",
    modified: "2026-10-26",
    topic: {
      zh: "该填哪个地址",
      "zh-TW": "該填哪個地址",
      en: "Which address to enter",
      ko: "어떤 주소를 넣을지",
      ja: "どのアドレスを入れるか",
    },
    title: {
      zh: "Acurast 监控：管理者、处理器、奖励与余额",
      "zh-TW": "Acurast 監控：管理者、處理器、獎勵與餘額",
      en: "Acurast monitoring: managers, processors, rewards and balances",
      ko: "Acurast 모니터: 관리자·프로세서·보상·잔액",
      ja: "Acurast監視：管理者・プロセッサ・報酬・残高",
    },
    description: {
      zh: "输入主网管理者或处理器公开地址，按范围查看处理器心跳、管理者已支付奖励和钱包余额。",
      "zh-TW": "輸入主網管理者或處理器公開地址，依範圍查看心跳、管理者已支付獎勵及餘額。",
      en: "Enter a mainnet manager or processor public address to inspect processor heartbeats, manager-level paid rewards and wallet balances.",
      ko: "메인넷 관리자 또는 프로세서 공개 주소로 하트비트·관리자 지급 보상·지갑 잔액을 확인합니다.",
      ja: "メインネットの管理者またはProcessor公開アドレスで、ハートビート・管理者支払済み報酬・残高を確認します。",
    },
    summary: {
      zh: "输入主网管理者或处理器公开地址，按范围查看处理器心跳、管理者已支付奖励和钱包余额。",
      "zh-TW": "輸入主網管理者或處理器公開地址，依範圍查看心跳、管理者已支付獎勵及餘額。",
      en: "Enter a mainnet manager or processor public address to inspect processor heartbeats, manager-level paid rewards and wallet balances.",
      ko: "메인넷 관리자 또는 프로세서 공개 주소로 하트비트·관리자 지급 보상·지갑 잔액을 확인합니다.",
      ja: "メインネットの管理者またはProcessor公開アドレスで、ハートビート・管理者支払済み報酬・残高を確認します。",
    },
    sources: [
      {
        name: "Acurast processor rewards",
        url: "https://docs.acurast.com/processors/rewards/",
      },
      {
        name: "IOTA Watch reward accounting implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-rewards.server.ts",
      },
      {
        name: "IOTA Watch processor and balance implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-chain.server.ts",
      },
      {
        name: "Acurast compute providers",
        url: "https://docs.acurast.com/processors/",
      },
    ],
    related: [
      "acurast-processor-owner-identity",
      "acurast-phone-job-status",
      "acurast-rewards-settlement",
      "acurast-processor-offline",
    ],
    body: {
      zh: [
        "## 先确认查询范围",
        "在 Hub 确认 Mainnet，再复制管理者或具体 Processor 的公开地址。两种入口都可查询，但范围不同：处理器入口识别该处理器，管理者入口可展开其关联处理器。SS58 与 0x 公钥可能表示同一个账户。",
        "管理者范围的奖励与手机范围的心跳分开看；钱包 free、reserved 和 frozen 是不同余额字段，frozen 不与 total 再次相加。美元值只在有效报价可用时估算。",
        "打开 [Acurast 项目页](/projects/acurast)，贴上从 Mainnet 设备详情复制的地址。本站接受带校验的 SS58，或 0x 后接 64 位十六进制的公钥。二维码里的秘密、私钥和助记词都不要贴。",
        "## 先核对再保存",
        "- 在 Hub 切到 Mainnet。Canary 使用 cACU，和主网 ACU 不是同一套余额。",
        "- 免费档每个项目保存 3 台设备，Pro 为 100 台。在 Hub 里看到同一钱包下有多台手机，不会自动占用这些名额；你为每台手机单独保存一条设备记录时，才会各占一台。同一条已保存设备上的多种绑定不额外占名额。",
        "## 接下来与界限",
        "登记成功后，若要看这台手机是否在做部署、心跳是否连续、ACU 如何按周期发放，分别看 [任务状态](/learn/acurast-phone-job-status)、[离线判断](/learn/acurast-processor-offline) 和 [奖励范围](/learn/acurast-rewards-settlement)。本站不启动 Processor 应用，不签名，也不把账户余额当成收益。",
        "## Acurast 管理者地址与处理器地址有什么区别？",
        "要找一台手机，复制该手机的 Processor 地址；要核对管理者范围，使用管理者公开地址。页面展开名单存在读取上限，若提示不完整，就只按已读取范围理解，不推断未读取设备离线。",
        "## 继续核对",
        "[Acurast 管理者地址与处理器地址有什么区别？](/learn/acurast-processor-owner-identity) · [Acurast 心跳、在线与任务执行怎么区分？](/learn/acurast-phone-job-status) · [Acurast 今日 ACU 奖励、累计奖励和钱包余额](/learn/acurast-rewards-settlement) · [Acurast 离线、心跳过期与数据未获取怎么排查？](/learn/acurast-processor-offline)",
      ],
      "zh-TW": [
        "## 先確認查詢範圍",
        "在 Hub 確認 Mainnet，再複製管理者或 Processor 公開地址。處理器入口識別該處理器，管理者入口可展開關聯處理器。SS58 與 0x 可能為同一帳戶。",
        "管理者獎勵與手機心跳分開；free、reserved、frozen 為不同餘額欄位，frozen 不再加到 total。美元值僅在有效報價時估算。",
        "打開 [Acurast 專案頁](/projects/acurast)，貼上從 Mainnet 裝置詳情複製的地址。本站接受有校驗的 SS58，或 0x 後接 64 位十六進位的公鑰。二維碼裡的秘密、私鑰和助記詞都不要貼。",
        "## 先核對再儲存",
        "- 在 Hub 切到 Mainnet。Canary 使用 cACU，和主網 ACU 不是同一套餘額。",
        "- 免費方案每個專案儲存 3 台裝置，Pro 為 100 台。在 Hub 裡看到同一錢包下有多支手機，不會自動占用這些名額；你為每支手機單獨儲存一筆裝置紀錄時，才會各占一台。同一筆已儲存裝置上的多種綁定不額外占名額。",
        "## 接下來與界限",
        "登記成功後，若要看這支手機是否在做部署、心跳是否連續、ACU 如何按週期發放，分別看 [任務狀態](/learn/acurast-phone-job-status)、[離線判斷](/learn/acurast-processor-offline) 和 [獎勵範圍](/learn/acurast-rewards-settlement)。本站不啟動 Processor 應用，不簽名，也不把帳戶餘額當成收益。",
        "## Acurast 管理者地址與處理器地址有何不同？",
        "查單支手機使用 Processor 地址；核對管理者範圍使用管理者公開地址。名單有讀取上限，若提示不完整，只按已讀範圍解讀，勿推斷其餘設備離線。",
        "## 繼續核對",
        "[Acurast 管理者地址與處理器地址有何不同？](/learn/acurast-processor-owner-identity) · [Acurast 心跳、在線與任務執行如何區分？](/learn/acurast-phone-job-status) · [Acurast 今日 ACU 獎勵、累計獎勵與餘額](/learn/acurast-rewards-settlement) · [Acurast 離線、心跳過期與未取得資料如何排查？](/learn/acurast-processor-offline)",
      ],
      en: [
        "## Check the query scope",
        "Select Mainnet in Hub and copy the public manager or Processor address. Both are accepted, with different scopes: a processor identifies that processor, while a manager can expand associated processors. SS58 and 0x can represent the same account.",
        "Keep manager rewards separate from processor heartbeats. Wallet free, reserved and frozen are distinct fields; do not add frozen to total again. USD values require an available valid quote.",
        "Open the [Acurast project page](/projects/acurast) and paste the address copied while Hub is on Mainnet. The page accepts a checksummed SS58 address or a 0x prefix plus 64 hexadecimal characters. Do not paste QR secrets, private keys, or seed phrases.",
        "## Check, then save",
        "- Switch Hub to Mainnet. Canary uses cACU. That balance is not mainnet ACU.",
        "- Free stores three saved devices per project; Pro stores 100. Phones listed under one Hub wallet do not automatically use those slots. Saving a separate device record for each phone does. Extra bindings on the same saved device do not add a slot.",
        "## Next step and limit",
        "After registration matches, use [job status](/learn/acurast-phone-job-status), [offline checks](/learn/acurast-processor-offline), and [reward scope](/learn/acurast-rewards-settlement) for deployments, heartbeats, and how ACU is assigned each epoch. This site does not start the Processor app, sign transactions, or treat a token balance as earnings.",
        "## Acurast manager vs processor address: which one should I enter?",
        "Use the phone’s Processor address to identify one device, or the public manager address for manager scope. Expansion has read limits. If the result is incomplete, interpret only the returned subset rather than treating omitted processors as offline.",
        "## Continue checking",
        "[Acurast manager vs processor address: which one should I enter?](/learn/acurast-processor-owner-identity) · [Acurast heartbeat vs online state and running jobs](/learn/acurast-phone-job-status) · [Acurast daily paid ACU rewards vs cumulative rewards and balance](/learn/acurast-rewards-settlement) · [Troubleshoot Acurast offline processors, stale heartbeats and missing data](/learn/acurast-processor-offline)",
      ],
      ko: [
        "## 조회 범위 확인",
        "Hub에서 Mainnet을 확인하고 관리자 또는 Processor 공개 주소를 복사하세요. 프로세서 주소는 해당 기기를 식별하고 관리자 주소는 연결된 프로세서를 펼칩니다. SS58과 0x가 같은 계정일 수 있습니다.",
        "관리자 보상과 기기 하트비트를 분리하세요. free·reserved·frozen은 별도 잔액 필드이며 frozen을 total에 다시 더하지 않습니다. 달러 환산에는 유효한 시세가 필요합니다.",
        "[Acurast 프로젝트 페이지](/projects/acurast)를 열고 Hub가 Mainnet일 때 복사한 주소를 붙이세요. 체크섬 SS58 또는 0x 뒤 64자리 16진수 공개키를 받습니다. QR 비밀, 비밀키, 시드 문구는 붙이지 마세요.",
        "## 확인 후 저장",
        "- Hub를 Mainnet으로 전환하세요. Canary는 cACU를 쓰며 메인넷 ACU와 다른 잔액입니다.",
        "- 무료는 프로젝트마다 저장 장치 3대, Pro는 100대입니다. Hub 지갑 아래에 휴대폰이 여러 대 보여도 그 자리수를 자동으로 쓰지 않습니다. 휴대폰마다 장치 기록을 따로 저장하면 각 1대를 씁니다. 같은 저장 장치의 추가 바인딩은 자리를 더하지 않습니다.",
        "## 다음 단계와 한계",
        "등록이 맞으면 배포, 심박, 에폭별 ACU 배분은 [작업 상태](/learn/acurast-phone-job-status), [오프라인 판단](/learn/acurast-processor-offline), [보상 범위](/learn/acurast-rewards-settlement)에서 이어서 보세요. 이 사이트는 Processor 앱을 시작하거나 서명하지 않으며, 토큰 잔액을 수익으로 보지 않습니다.",
        "## Acurast 관리자 주소와 프로세서 주소의 차이",
        "한 휴대폰은 Processor 주소, 관리자 범위는 관리자 공개 주소를 사용하세요. 목록 확장에는 조회 한도가 있습니다. 불완전 표시가 있으면 조회된 범위만 해석하고 빠진 기기를 오프라인으로 간주하지 마세요.",
        "## 추가 확인",
        "[Acurast 관리자 주소와 프로세서 주소의 차이](/learn/acurast-processor-owner-identity) · [Acurast 하트비트·온라인·작업 실행 구분](/learn/acurast-phone-job-status) · [Acurast 일일 ACU 지급 보상·누적 보상·잔액](/learn/acurast-rewards-settlement) · [Acurast 오프라인·오래된 하트비트·조회 실패 해결](/learn/acurast-processor-offline)",
      ],
      ja: [
        "## 照会範囲を確認",
        "HubでMainnetを確認し、管理者またはProcessorの公開アドレスをコピーします。Processorはその機器を識別し、管理者は関連Processorを展開できます。SS58と0xは同じアカウントを表す場合があります。",
        "管理者報酬とProcessor報告を分けます。free・reserved・frozenは別の残高項目で、frozenをtotalに再加算しません。ドル換算には有効な価格が必要です。",
        "[Acurastプロジェクトページ](/projects/acurast)を開き、HubがMainnetのときにコピーしたアドレスを貼ります。チェックサム付きSS58、または0xに64桁の16進公開鍵を受け付けます。QRの秘密、秘密鍵、シードフレーズは貼らないでください。",
        "## 確認してから保存",
        "- HubをMainnetにします。CanaryはcACUで、メインネットACUとは別の残高です。",
        "- 無料はプロジェクトごとに保存デバイス3台、Proは100台です。一つのHubウォレットの下に電話が並んで見えても、その枠は自動では使いません。電話ごとにデバイス記録を別に保存すると、それぞれ1台を使います。同じ保存デバイスへの追加バインドは枠を増やしません。",
        "## 次と限界",
        "登録が一致したら、デプロイ、ハートビート、エポックごとのACU配分は [ジョブ状態](/learn/acurast-phone-job-status)、[オフラインの見分け](/learn/acurast-processor-offline)、[報酬の範囲](/learn/acurast-rewards-settlement) を見てください。当サイトはProcessorアプリを起動せず、署名せず、トークン残高を収益とは扱いません。",
        "## Acurast管理者アドレスとProcessorアドレスの違い",
        "一台を探すにはProcessorアドレス、管理者範囲には管理者公開アドレスを使います。展開件数には上限があります。不完全と表示されたら返された範囲だけを読み、未取得の機器をオフラインと判断しません。",
        "## 続けて確認",
        "[Acurast管理者アドレスとProcessorアドレスの違い](/learn/acurast-processor-owner-identity) · [Acurastのハートビート・オンライン・ジョブ実行の違い](/learn/acurast-phone-job-status) · [Acurastの日次ACU支払報酬・累計報酬・残高](/learn/acurast-rewards-settlement) · [Acurastのオフライン・古いハートビート・取得失敗を確認](/learn/acurast-processor-offline)",
      ],
    },
    questions: {
      zh: [
        {
          question: "Acurast 监控：管理者、处理器、奖励与余额",
          answer:
            "在 Hub 确认 Mainnet，再复制管理者或具体 Processor 的公开地址。两种入口都可查询，但范围不同：处理器入口识别该处理器，管理者入口可展开其关联处理器。SS58 与 0x 公钥可能表示同一个账户。",
        },
        {
          question: "Acurast 管理者地址与处理器地址有什么区别？",
          answer:
            "要找一台手机，复制该手机的 Processor 地址；要核对管理者范围，使用管理者公开地址。页面展开名单存在读取上限，若提示不完整，就只按已读取范围理解，不推断未读取设备离线。",
        },
        {
          question: "Acurast 心跳、在线与任务执行怎么区分？",
          answer:
            "当前监控按最近 31 分钟内的有效链上心跳判断活跃窗口。没有心跳时间时保留未知。链上登记可以长期保留；历史奖励也可能来自之前的运行，二者均不能证明手机此刻正在计算。",
        },
      ],
      "zh-TW": [
        {
          question: "Acurast 監控：管理者、處理器、獎勵與餘額",
          answer:
            "在 Hub 確認 Mainnet，再複製管理者或 Processor 公開地址。處理器入口識別該處理器，管理者入口可展開關聯處理器。SS58 與 0x 可能為同一帳戶。",
        },
        {
          question: "Acurast 管理者地址與處理器地址有何不同？",
          answer:
            "查單支手機使用 Processor 地址；核對管理者範圍使用管理者公開地址。名單有讀取上限，若提示不完整，只按已讀範圍解讀，勿推斷其餘設備離線。",
        },
        {
          question: "Acurast 心跳、在線與任務執行如何區分？",
          answer:
            "目前依最近 31 分鐘有效鏈上心跳判斷活躍窗口，缺少時間保留未知。登記及歷史獎勵可長期存在，皆不證明手機正在計算。",
        },
      ],
      en: [
        {
          question: "Acurast monitoring: managers, processors, rewards and balances",
          answer:
            "Select Mainnet in Hub and copy the public manager or Processor address. Both are accepted, with different scopes: a processor identifies that processor, while a manager can expand associated processors. SS58 and 0x can represent the same account.",
        },
        {
          question: "Acurast manager vs processor address: which one should I enter?",
          answer:
            "Use the phone’s Processor address to identify one device, or the public manager address for manager scope. Expansion has read limits. If the result is incomplete, interpret only the returned subset rather than treating omitted processors as offline.",
        },
        {
          question: "Acurast heartbeat vs online state and running jobs",
          answer:
            "The monitor uses a 31-minute window for a valid recent chain heartbeat. A missing timestamp stays unknown. Registration can persist and historical rewards can predate current activity; neither establishes that a phone is computing now.",
        },
      ],
      ko: [
        {
          question: "Acurast 모니터: 관리자·프로세서·보상·잔액",
          answer:
            "Hub에서 Mainnet을 확인하고 관리자 또는 Processor 공개 주소를 복사하세요. 프로세서 주소는 해당 기기를 식별하고 관리자 주소는 연결된 프로세서를 펼칩니다. SS58과 0x가 같은 계정일 수 있습니다.",
        },
        {
          question: "Acurast 관리자 주소와 프로세서 주소의 차이",
          answer:
            "한 휴대폰은 Processor 주소, 관리자 범위는 관리자 공개 주소를 사용하세요. 목록 확장에는 조회 한도가 있습니다. 불완전 표시가 있으면 조회된 범위만 해석하고 빠진 기기를 오프라인으로 간주하지 마세요.",
        },
        {
          question: "Acurast 하트비트·온라인·작업 실행 구분",
          answer:
            "모니터는 유효한 체인 하트비트에 31분 활성 구간을 적용합니다. 시각이 없으면 알 수 없음입니다. 등록과 과거 보상은 남아 있을 수 있어 현재 계산 중이라는 증거가 아닙니다.",
        },
      ],
      ja: [
        {
          question: "Acurast監視：管理者・プロセッサ・報酬・残高",
          answer:
            "HubでMainnetを確認し、管理者またはProcessorの公開アドレスをコピーします。Processorはその機器を識別し、管理者は関連Processorを展開できます。SS58と0xは同じアカウントを表す場合があります。",
        },
        {
          question: "Acurast管理者アドレスとProcessorアドレスの違い",
          answer:
            "一台を探すにはProcessorアドレス、管理者範囲には管理者公開アドレスを使います。展開件数には上限があります。不完全と表示されたら返された範囲だけを読み、未取得の機器をオフラインと判断しません。",
        },
        {
          question: "Acurastのハートビート・オンライン・ジョブ実行の違い",
          answer:
            "監視は有効なチェーンハートビートに31分の活動窓を適用します。時刻がなければ不明です。登録や過去報酬は残るため、現在計算中である証拠にはなりません。",
        },
      ],
    },
  },
  {
    slug: "acurast-processor-owner-identity",
    project: "acurast",
    published: "2026-10-24",
    modified: "2026-10-26",
    topic: {
      zh: "处理器与管理者",
      "zh-TW": "處理器與管理者",
      en: "Processor and manager",
      ko: "프로세서와 관리자",
      ja: "プロセッサと管理者",
    },
    title: {
      zh: "Acurast 管理者地址与处理器地址有什么区别？",
      "zh-TW": "Acurast 管理者地址與處理器地址有何不同？",
      en: "Acurast manager vs processor address: which one should I enter?",
      ko: "Acurast 관리자 주소와 프로세서 주소의 차이",
      ja: "Acurast管理者アドレスとProcessorアドレスの違い",
    },
    description: {
      zh: "管理者可关联多个处理器；处理器标识不能把管理者汇总奖励变成单台设备收益。",
      "zh-TW": "管理者可關聯多個處理器；處理器標識不會將管理者獎勵變成單機收益。",
      en: "A manager may own multiple processors. A processor lookup does not turn manager aggregate rewards into per-device income.",
      ko: "관리자에 여러 프로세서가 연결될 수 있으며 프로세서 조회도 관리자 보상을 기기별 수익으로 바꾸지는 않습니다.",
      ja: "管理者には複数Processorが属します。Processor照会でも管理者合計報酬が機器別収入になるわけではありません。",
    },
    summary: {
      zh: "管理者可关联多个处理器；处理器标识不能把管理者汇总奖励变成单台设备收益。",
      "zh-TW": "管理者可關聯多個處理器；處理器標識不會將管理者獎勵變成單機收益。",
      en: "A manager may own multiple processors. A processor lookup does not turn manager aggregate rewards into per-device income.",
      ko: "관리자에 여러 프로세서가 연결될 수 있으며 프로세서 조회도 관리자 보상을 기기별 수익으로 바꾸지는 않습니다.",
      ja: "管理者には複数Processorが属します。Processor照会でも管理者合計報酬が機器別収入になるわけではありません。",
    },
    sources: [
      {
        name: "Acurast processor rewards",
        url: "https://docs.acurast.com/processors/rewards/",
      },
      {
        name: "IOTA Watch reward accounting implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-rewards.server.ts",
      },
      {
        name: "IOTA Watch processor and balance implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-chain.server.ts",
      },
      {
        name: "Acurast compute providers",
        url: "https://docs.acurast.com/processors/",
      },
    ],
    related: [
      "acurast-monitor-guide",
      "acurast-phone-job-status",
      "acurast-rewards-settlement",
      "acurast-processor-offline",
    ],
    body: {
      zh: [
        "## 先确认查询范围",
        "要找一台手机，复制该手机的 Processor 地址；要核对管理者范围，使用管理者公开地址。页面展开名单存在读取上限，若提示不完整，就只按已读取范围理解，不推断未读取设备离线。",
        "管理者范围的奖励与手机范围的心跳分开看；钱包 free、reserved 和 frozen 是不同余额字段，frozen 不与 total 再次相加。美元值只在有效报价可用时估算。",
        "Hub 里连接的钱包是管理者。官方处理器说明允许用这个账户添加新设备：在 Hub 生成二维码，在手机上的 Processor Lite 选择连接 Hub 并扫码。扫码完成后，手机进入这个管理者能看到的设备列表，但列表里的每一台仍用自己的 Processor 地址标识。",
        "官方索引的账户查询可以按处理器、管理者或提交者筛选。这是三种身份，不是三个别名。Acurast 官网也把「自己跑手机」和「没有硬件、把质押委托给计算提供者」分开：委托者可以参与质押奖励，但委托地址不是那台手机的处理器登记。",
        "## 保存设备时怎么数",
        "- 想看哪一台手机，就保存哪一台的 Processor。免费每个项目 3 台已保存设备，Pro 100 台。",
        "- 只在 Hub 打开管理者钱包、看到下面有三台手机，不会因此在本站占用三台名额。",
        "- 你若把三台处理器分别存成三台设备，就占用三台。",
        "- 同一台已保存设备即使再次绑定同一项目，也不再增加名额。钱包余额若出现在多条记录里，仍是同一笔余额，不会把一台手机的金额乘以设备数。",
        "## Acurast 今日 ACU 奖励、累计奖励和钱包余额",
        "本站读取主网 ManagerMetricRewards 的 paid 累计计数，以香港时间零点对应的历史状态求今日增量。缺少历史边界时，今日保持未知，不用当前余额倒推。它不涵盖所有质押、迁移或委托提取；一个管理者关联多台手机时，也不按台数平均分摊。",
        "## 继续核对",
        "[Acurast 监控：管理者、处理器、奖励与余额](/learn/acurast-monitor-guide) · [Acurast 心跳、在线与任务执行怎么区分？](/learn/acurast-phone-job-status) · [Acurast 今日 ACU 奖励、累计奖励和钱包余额](/learn/acurast-rewards-settlement) · [Acurast 离线、心跳过期与数据未获取怎么排查？](/learn/acurast-processor-offline)",
      ],
      "zh-TW": [
        "## 先確認查詢範圍",
        "查單支手機使用 Processor 地址；核對管理者範圍使用管理者公開地址。名單有讀取上限，若提示不完整，只按已讀範圍解讀，勿推斷其餘設備離線。",
        "管理者獎勵與手機心跳分開；free、reserved、frozen 為不同餘額欄位，frozen 不再加到 total。美元值僅在有效報價時估算。",
        "Hub 裡連接的錢包是管理者。官方處理器說明允許用這個帳戶新增裝置：在 Hub 產生二維碼，在手機上的 Processor Lite 選擇連接 Hub 並掃碼。掃碼完成後，手機進入這個管理者能看到的裝置列表，但列表裡的每一支仍用自己的 Processor 地址標識。",
        "官方索引的帳戶查詢可以按處理器、管理者或提交者篩選。這是三種身分，不是三個別名。Acurast 官網也把「自己跑手機」和「沒有硬體、把質押委託給計算提供者」分開：委託者可以參與質押獎勵，但委託地址不是那支手機的處理器登記。",
        "## 儲存裝置時怎麼數",
        "- 想看哪一支手機，就儲存哪一支的 Processor。免費每個專案 3 台已儲存裝置，Pro 100 台。",
        "- 只在 Hub 打開管理者錢包、看到下面有三支手機，不會因此在本站占用三台名額。",
        "- 你若把三台處理器分別存成三台裝置，就占用三台。",
        "- 同一台已儲存裝置即使再次綁定同一專案，也不再增加名額。錢包餘額若出現在多筆紀錄裡，仍是同一筆餘額，不會把一支手機的金額乘以裝置數。",
        "## Acurast 今日 ACU 獎勵、累計獎勵與餘額",
        "本站讀取主網 ManagerMetricRewards paid 累計值，以香港零點歷史狀態求今日增量。歷史邊界缺失則今日未知，不用餘額倒推。此項不含所有質押、遷移或委託提取，多台手機亦不平均分攤。",
        "## 繼續核對",
        "[Acurast 監控：管理者、處理器、獎勵與餘額](/learn/acurast-monitor-guide) · [Acurast 心跳、在線與任務執行如何區分？](/learn/acurast-phone-job-status) · [Acurast 今日 ACU 獎勵、累計獎勵與餘額](/learn/acurast-rewards-settlement) · [Acurast 離線、心跳過期與未取得資料如何排查？](/learn/acurast-processor-offline)",
      ],
      en: [
        "## Check the query scope",
        "Use the phone’s Processor address to identify one device, or the public manager address for manager scope. Expansion has read limits. If the result is incomplete, interpret only the returned subset rather than treating omitted processors as offline.",
        "Keep manager rewards separate from processor heartbeats. Wallet free, reserved and frozen are distinct fields; do not add frozen to total again. USD values require an available valid quote.",
        "The wallet connected in Hub is the manager. Official processor docs let that account add a device: Hub creates a QR code, and Processor Lite on the phone uses Connect to Hub to scan it. After setup, the phone appears in the manager’s device list, and each row still has its own Processor address.",
        "The official index can filter accounts as processor, manager, or committer. Those are three roles, not three names for one account. Acurast’s site also separates running a phone from delegating stake when you have no hardware. A delegator can take part in staking rewards. The delegator address is not that phone’s processor registration.",
        "## How saved devices are counted",
        "- Save the Processor of the phone you want to watch. Free is three saved devices per project. Pro is 100.",
        "- Opening the manager wallet in Hub and seeing three phones does not use three slots here.",
        "- Saving three processor records as three devices uses three slots.",
        "- Binding the same project again on one saved device does not add a slot. If a wallet balance shows on more than one row, it is still one balance, not a phone’s amount multiplied by the device count.",
        "## Acurast daily paid ACU rewards vs cumulative rewards and balance",
        "The monitor reads the mainnet ManagerMetricRewards paid counter and compares it with historical state at Hong Kong midnight. If that boundary is unavailable, today stays unknown rather than being inferred from balance. This counter excludes other staking, migration or delegation withdrawals, and is not divided equally among a manager’s phones.",
        "## Continue checking",
        "[Acurast monitoring: managers, processors, rewards and balances](/learn/acurast-monitor-guide) · [Acurast heartbeat vs online state and running jobs](/learn/acurast-phone-job-status) · [Acurast daily paid ACU rewards vs cumulative rewards and balance](/learn/acurast-rewards-settlement) · [Troubleshoot Acurast offline processors, stale heartbeats and missing data](/learn/acurast-processor-offline)",
      ],
      ko: [
        "## 조회 범위 확인",
        "한 휴대폰은 Processor 주소, 관리자 범위는 관리자 공개 주소를 사용하세요. 목록 확장에는 조회 한도가 있습니다. 불완전 표시가 있으면 조회된 범위만 해석하고 빠진 기기를 오프라인으로 간주하지 마세요.",
        "관리자 보상과 기기 하트비트를 분리하세요. free·reserved·frozen은 별도 잔액 필드이며 frozen을 total에 다시 더하지 않습니다. 달러 환산에는 유효한 시세가 필요합니다.",
        "Hub에 연결한 지갑이 관리자입니다. 공식 프로세서 문서는 그 계정으로 기기를 추가합니다. Hub가 QR을 만들고, 휴대폰의 Processor Lite에서 Connect to Hub로 스캔합니다. 설정이 끝나면 휴대폰은 관리자의 기기 목록에 들어가며, 각 행은 여전히 자신의 Processor 주소를 갖습니다.",
        "공식 색인은 계정을 프로세서, 관리자, 커미터로 걸러 낼 수 있습니다. 세 역할이지, 한 계정의 세 이름이 아닙니다. Acurast 사이트도 휴대폰을 직접 돌리는 일과, 하드웨어 없이 스테이킹을 위임하는 일을 나눕니다. 위임자는 스테이킹 보상에 참여할 수 있습니다. 위임 주소는 그 휴대폰의 프로세서 등록이 아닙니다.",
        "## 저장 장치를 세는 법",
        "- 보려는 휴대폰의 Processor를 저장하세요. 무료는 프로젝트마다 저장 장치 3대, Pro는 100대입니다.",
        "- Hub에서 관리 지갑을 열고 휴대폰 세 대가 보여도 여기서 세 자리를 쓰지 않습니다.",
        "- 프로세서 세 개를 장치 세 대로 저장하면 세 자리를 씁니다.",
        "- 이미 저장한 장치에 같은 프로젝트를 다시 묶어도 자리는 늘지 않습니다. 지갑 잔액이 여러 행에 보여도 한 잔액이며, 휴대폰 금액을 장치 수로 곱하지 않습니다.",
        "## Acurast 일일 ACU 지급 보상·누적 보상·잔액",
        "메인넷 ManagerMetricRewards의 paid 누적값을 홍콩 자정의 과거 상태와 비교합니다. 경계를 읽지 못하면 잔액으로 추정하지 않고 오늘을 알 수 없음으로 둡니다. 다른 스테이킹·이전·위임 인출을 모두 포함하지 않으며 휴대폰 수로 균등 배분하지 않습니다.",
        "## 추가 확인",
        "[Acurast 모니터: 관리자·프로세서·보상·잔액](/learn/acurast-monitor-guide) · [Acurast 하트비트·온라인·작업 실행 구분](/learn/acurast-phone-job-status) · [Acurast 일일 ACU 지급 보상·누적 보상·잔액](/learn/acurast-rewards-settlement) · [Acurast 오프라인·오래된 하트비트·조회 실패 해결](/learn/acurast-processor-offline)",
      ],
      ja: [
        "## 照会範囲を確認",
        "一台を探すにはProcessorアドレス、管理者範囲には管理者公開アドレスを使います。展開件数には上限があります。不完全と表示されたら返された範囲だけを読み、未取得の機器をオフラインと判断しません。",
        "管理者報酬とProcessor報告を分けます。free・reserved・frozenは別の残高項目で、frozenをtotalに再加算しません。ドル換算には有効な価格が必要です。",
        "Hubで接続したウォレットが管理者です。公式のプロセッサ説明では、その口座でデバイスを追加します。HubがQRを作り、電話の Processor Lite で Connect to Hub を選んで読み取ります。設定後、電話は管理者のデバイス一覧に入りますが、各行は自分の Processor アドレスを持ちます。",
        "公式索引は口座をプロセッサ、管理者、コミッターで絞れます。三つの役割であり、一つの口座の別名ではありません。Acurastのサイトも、自分で電話を動かすことと、ハードウェアがなくステークを委任することを分けています。委任者はステーキング報酬に参加できます。委任アドレスは、その電話のプロセッサ登録ではありません。",
        "## 保存デバイスの数え方",
        "- 見たい電話の Processor を保存します。無料はプロジェクトごとに保存デバイス3台、Proは100台です。",
        "- Hubで管理者ウォレットを開き、電話が三台見えても、ここでは三枠を使いません。",
        "- 三つのプロセッサを三デバイスとして保存すると三枠を使います。",
        "- 保存済みデバイスに同じプロジェクトを再度バインドしても枠は増えません。ウォレット残高が複数行に出ても一つの残高であり、一台の金額を台数倍にはしません。",
        "## Acurastの日次ACU支払報酬・累計報酬・残高",
        "メインネットのManagerMetricRewards paid累計を香港午前0時の過去状態と比較します。境界が取得できない日は残高で推定せず不明にします。他のステーキング・移行・委任引出しは含まず、電話台数で均等配分もしません。",
        "## 続けて確認",
        "[Acurast監視：管理者・プロセッサ・報酬・残高](/learn/acurast-monitor-guide) · [Acurastのハートビート・オンライン・ジョブ実行の違い](/learn/acurast-phone-job-status) · [Acurastの日次ACU支払報酬・累計報酬・残高](/learn/acurast-rewards-settlement) · [Acurastのオフライン・古いハートビート・取得失敗を確認](/learn/acurast-processor-offline)",
      ],
    },
    questions: {
      zh: [
        {
          question: "Acurast 管理者地址与处理器地址有什么区别？",
          answer:
            "要找一台手机，复制该手机的 Processor 地址；要核对管理者范围，使用管理者公开地址。页面展开名单存在读取上限，若提示不完整，就只按已读取范围理解，不推断未读取设备离线。",
        },
        {
          question: "Acurast 今日 ACU 奖励、累计奖励和钱包余额",
          answer:
            "本站读取主网 ManagerMetricRewards 的 paid 累计计数，以香港时间零点对应的历史状态求今日增量。缺少历史边界时，今日保持未知，不用当前余额倒推。它不涵盖所有质押、迁移或委托提取；一个管理者关联多台手机时，也不按台数平均分摊。",
        },
        {
          question: "Acurast 今日 ACU 奖励、累计奖励和钱包余额",
          answer:
            "本站读取主网 ManagerMetricRewards 的 paid 累计计数，以香港时间零点对应的历史状态求今日增量。缺少历史边界时，今日保持未知，不用当前余额倒推。它不涵盖所有质押、迁移或委托提取；一个管理者关联多台手机时，也不按台数平均分摊。",
        },
      ],
      "zh-TW": [
        {
          question: "Acurast 管理者地址與處理器地址有何不同？",
          answer:
            "查單支手機使用 Processor 地址；核對管理者範圍使用管理者公開地址。名單有讀取上限，若提示不完整，只按已讀範圍解讀，勿推斷其餘設備離線。",
        },
        {
          question: "Acurast 今日 ACU 獎勵、累計獎勵與餘額",
          answer:
            "本站讀取主網 ManagerMetricRewards paid 累計值，以香港零點歷史狀態求今日增量。歷史邊界缺失則今日未知，不用餘額倒推。此項不含所有質押、遷移或委託提取，多台手機亦不平均分攤。",
        },
        {
          question: "Acurast 今日 ACU 獎勵、累計獎勵與餘額",
          answer:
            "本站讀取主網 ManagerMetricRewards paid 累計值，以香港零點歷史狀態求今日增量。歷史邊界缺失則今日未知，不用餘額倒推。此項不含所有質押、遷移或委託提取，多台手機亦不平均分攤。",
        },
      ],
      en: [
        {
          question: "Acurast manager vs processor address: which one should I enter?",
          answer:
            "Use the phone’s Processor address to identify one device, or the public manager address for manager scope. Expansion has read limits. If the result is incomplete, interpret only the returned subset rather than treating omitted processors as offline.",
        },
        {
          question: "Acurast daily paid ACU rewards vs cumulative rewards and balance",
          answer:
            "The monitor reads the mainnet ManagerMetricRewards paid counter and compares it with historical state at Hong Kong midnight. If that boundary is unavailable, today stays unknown rather than being inferred from balance. This counter excludes other staking, migration or delegation withdrawals, and is not divided equally among a manager’s phones.",
        },
        {
          question: "Acurast daily paid ACU rewards vs cumulative rewards and balance",
          answer:
            "The monitor reads the mainnet ManagerMetricRewards paid counter and compares it with historical state at Hong Kong midnight. If that boundary is unavailable, today stays unknown rather than being inferred from balance. This counter excludes other staking, migration or delegation withdrawals, and is not divided equally among a manager’s phones.",
        },
      ],
      ko: [
        {
          question: "Acurast 관리자 주소와 프로세서 주소의 차이",
          answer:
            "한 휴대폰은 Processor 주소, 관리자 범위는 관리자 공개 주소를 사용하세요. 목록 확장에는 조회 한도가 있습니다. 불완전 표시가 있으면 조회된 범위만 해석하고 빠진 기기를 오프라인으로 간주하지 마세요.",
        },
        {
          question: "Acurast 일일 ACU 지급 보상·누적 보상·잔액",
          answer:
            "메인넷 ManagerMetricRewards의 paid 누적값을 홍콩 자정의 과거 상태와 비교합니다. 경계를 읽지 못하면 잔액으로 추정하지 않고 오늘을 알 수 없음으로 둡니다. 다른 스테이킹·이전·위임 인출을 모두 포함하지 않으며 휴대폰 수로 균등 배분하지 않습니다.",
        },
        {
          question: "Acurast 일일 ACU 지급 보상·누적 보상·잔액",
          answer:
            "메인넷 ManagerMetricRewards의 paid 누적값을 홍콩 자정의 과거 상태와 비교합니다. 경계를 읽지 못하면 잔액으로 추정하지 않고 오늘을 알 수 없음으로 둡니다. 다른 스테이킹·이전·위임 인출을 모두 포함하지 않으며 휴대폰 수로 균등 배분하지 않습니다.",
        },
      ],
      ja: [
        {
          question: "Acurast管理者アドレスとProcessorアドレスの違い",
          answer:
            "一台を探すにはProcessorアドレス、管理者範囲には管理者公開アドレスを使います。展開件数には上限があります。不完全と表示されたら返された範囲だけを読み、未取得の機器をオフラインと判断しません。",
        },
        {
          question: "Acurastの日次ACU支払報酬・累計報酬・残高",
          answer:
            "メインネットのManagerMetricRewards paid累計を香港午前0時の過去状態と比較します。境界が取得できない日は残高で推定せず不明にします。他のステーキング・移行・委任引出しは含まず、電話台数で均等配分もしません。",
        },
        {
          question: "Acurastの日次ACU支払報酬・累計報酬・残高",
          answer:
            "メインネットのManagerMetricRewards paid累計を香港午前0時の過去状態と比較します。境界が取得できない日は残高で推定せず不明にします。他のステーキング・移行・委任引出しは含まず、電話台数で均等配分もしません。",
        },
      ],
    },
  },
  {
    slug: "acurast-phone-job-status",
    project: "acurast",
    published: "2026-10-24",
    modified: "2026-10-26",
    topic: {
      zh: "手机在跑什么",
      "zh-TW": "手機在跑什麼",
      en: "What the phone is doing",
      ko: "휴대폰이 무엇을 하나",
      ja: "電話が何をしているか",
    },
    title: {
      zh: "Acurast 心跳、在线与任务执行怎么区分？",
      "zh-TW": "Acurast 心跳、在線與任務執行如何區分？",
      en: "Acurast heartbeat vs online state and running jobs",
      ko: "Acurast 하트비트·온라인·작업 실행 구분",
      ja: "Acurastのハートビート・オンライン・ジョブ実行の違い",
    },
    description: {
      zh: "链上心跳表示最近上报，不等于正在执行客户任务；任务、奖励和本机状态分开核对。",
      "zh-TW": "鏈上心跳表示最近回報，不等於執行客戶任務；任務、獎勵與本機狀態分開確認。",
      en: "An on-chain heartbeat records recent reporting, not a running customer job. Check task state, rewards and local device state separately.",
      ko: "온체인 하트비트는 최근 보고이며 고객 작업 실행을 뜻하지 않습니다. 작업·보상·로컬 상태는 별도로 확인합니다.",
      ja: "チェーンのハートビートは最近の報告であり、顧客ジョブの実行ではありません。ジョブ・報酬・ローカル状態は別に確認します。",
    },
    summary: {
      zh: "链上心跳表示最近上报，不等于正在执行客户任务；任务、奖励和本机状态分开核对。",
      "zh-TW": "鏈上心跳表示最近回報，不等於執行客戶任務；任務、獎勵與本機狀態分開確認。",
      en: "An on-chain heartbeat records recent reporting, not a running customer job. Check task state, rewards and local device state separately.",
      ko: "온체인 하트비트는 최근 보고이며 고객 작업 실행을 뜻하지 않습니다. 작업·보상·로컬 상태는 별도로 확인합니다.",
      ja: "チェーンのハートビートは最近の報告であり、顧客ジョブの実行ではありません。ジョブ・報酬・ローカル状態は別に確認します。",
    },
    sources: [
      {
        name: "Acurast processor rewards",
        url: "https://docs.acurast.com/processors/rewards/",
      },
      {
        name: "IOTA Watch reward accounting implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-rewards.server.ts",
      },
      {
        name: "IOTA Watch processor and balance implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-chain.server.ts",
      },
      {
        name: "Acurast compute providers",
        url: "https://docs.acurast.com/processors/",
      },
    ],
    related: [
      "acurast-monitor-guide",
      "acurast-processor-owner-identity",
      "acurast-rewards-settlement",
      "acurast-processor-offline",
    ],
    body: {
      zh: [
        "## 先确认查询范围",
        "当前监控按最近 31 分钟内的有效链上心跳判断活跃窗口。没有心跳时间时保留未知。链上登记可以长期保留；历史奖励也可能来自之前的运行，二者均不能证明手机此刻正在计算。",
        "管理者范围的奖励与手机范围的心跳分开看；钱包 free、reserved 和 frozen 是不同余额字段，frozen 不与 total 再次相加。美元值只在有效报价可用时估算。",
        "手机上的 Acurast Processor 是在提供可验证的计算，不是传统工作量证明矿机。官方把 Lite 定义为日常手机、有空时打开；Core 定义为只做 Acurast 的专用锁定手机。应用在运行并且手机连着网时才按官方规则计奖励。本站的「已登记」没有这层含义。",
        "## 要看任务时去哪里",
        "- 打开 Hub 的这台设备，确认 Processor 应用处于运行，而不是只曾经安装过。",
        "- 官方说明设备大约每 30 分钟心跳一次。要看最近表现，文档指向 Acurast Monitoring Bot（Telegram）。链上可以逐笔扫心跳，但文档写明那样很慢。",
        "- 奖励页规定：某个周期里，若第一次成功心跳时检测到正在执行部署，基准指标获得 10% 的额外权重，称为 Busy Bonus。它提高该周期在计算池和质押计算池中的计分，不是单独一张“任务工资单”。",
        "- 开发者支付的部署费用在成功执行后销毁。那是网络供给机制，不是你这台手机的入账金额。",
        "## Acurast 离线、心跳过期与数据未获取怎么排查？",
        "先看主网、公开地址、最近链上心跳和本站获取时间。再在官方 Hub 与手机应用对照网络、电池限制和运行情况。心跳过期表示超出本站活跃窗口，接口失败则只是这次没有拿到状态。若连接了本机 Agent，单独核对 Agent 最近上报时间，不把它当作链上已支付奖励。",
        "## 继续核对",
        "[Acurast 监控：管理者、处理器、奖励与余额](/learn/acurast-monitor-guide) · [Acurast 管理者地址与处理器地址有什么区别？](/learn/acurast-processor-owner-identity) · [Acurast 今日 ACU 奖励、累计奖励和钱包余额](/learn/acurast-rewards-settlement) · [Acurast 离线、心跳过期与数据未获取怎么排查？](/learn/acurast-processor-offline)",
      ],
      "zh-TW": [
        "## 先確認查詢範圍",
        "目前依最近 31 分鐘有效鏈上心跳判斷活躍窗口，缺少時間保留未知。登記及歷史獎勵可長期存在，皆不證明手機正在計算。",
        "管理者獎勵與手機心跳分開；free、reserved、frozen 為不同餘額欄位，frozen 不再加到 total。美元值僅在有效報價時估算。",
        "手機上的 Acurast Processor 是在提供可驗證的計算，不是傳統工作量證明礦機。官方把 Lite 定義為日常手機、有空時打開；Core 定義為只做 Acurast 的專用鎖定手機。應用在執行並且手機連著網時才按官方規則計獎勵。本站的「已登記」沒有這層含義。",
        "## 要看任務時去哪裡",
        "- 打開 Hub 的這台裝置，確認 Processor 應用處於執行，而不是只曾經安裝過。",
        "- 官方說明裝置大約每 30 分鐘心跳一次。要看最近表現，文件指向 Acurast Monitoring Bot（Telegram）。鏈上可以逐筆掃心跳，但文件寫明那樣很慢。",
        "- 獎勵頁規定：某個週期裡，若第一次成功心跳時檢測到正在執行部署，基準指標獲得 10% 的額外權重，稱為 Busy Bonus。它提高該週期在計算池和質押計算池中的計分，不是單獨一張任務工資單。",
        "- 開發者支付的部署費用在成功執行後銷毀。那是網路供給機制，不是你這支手機的入帳金額。",
        "## Acurast 離線、心跳過期與未取得資料如何排查？",
        "先看主網、地址、心跳及取得時間，再對照 Hub 和手機網路、電池限制與執行情況。心跳過期是超出活躍窗口，介面失敗僅表示未取得狀態。若連接 Agent，另看其回報時間，不視為鏈上獎勵。",
        "## 繼續核對",
        "[Acurast 監控：管理者、處理器、獎勵與餘額](/learn/acurast-monitor-guide) · [Acurast 管理者地址與處理器地址有何不同？](/learn/acurast-processor-owner-identity) · [Acurast 今日 ACU 獎勵、累計獎勵與餘額](/learn/acurast-rewards-settlement) · [Acurast 離線、心跳過期與未取得資料如何排查？](/learn/acurast-processor-offline)",
      ],
      en: [
        "## Check the query scope",
        "The monitor uses a 31-minute window for a valid recent chain heartbeat. A missing timestamp stays unknown. Registration can persist and historical rewards can predate current activity; neither establishes that a phone is computing now.",
        "Keep manager rewards separate from processor heartbeats. Wallet free, reserved and frozen are distinct fields; do not add frozen to total again. USD values require an available valid quote.",
        "The Acurast Processor on a phone provides verifiable compute. It is not a conventional proof-of-work miner. Official docs define Lite as an everyday phone you activate when you can, and Core as a locked-down phone used only for Acurast. Rewards under those rules require the app to be running and the phone to be online. Registered on this site does not carry that meaning.",
        "## Where to look for the job",
        "- Open this device in Hub and confirm the Processor app is running, not merely installed once.",
        "- Official docs say the device heartbeats about every 30 minutes. For recent performance they point to the Acurast Monitoring Bot on Telegram. Scanning every heartbeat on chain is possible and, as the docs say, slow.",
        "- The rewards page states a Busy Bonus: if a deployment is detected executing on the first successful heartbeat of an epoch, benchmark metrics get 10% extra weight. That raises scoring for that epoch in both the compute pool and the staked compute pool. It is not a separate payslip.",
        "- Deployment fees paid by developers are burned after successful execution. That is a supply rule, not the amount credited to your phone.",
        "## Troubleshoot Acurast offline processors, stale heartbeats and missing data",
        "Check mainnet, the public address, last chain heartbeat and fetch time. Compare Hub with the phone app’s network, battery restrictions and process state. An old heartbeat is outside the monitor’s activity window; a failed API read only means status was not fetched. For a connected local agent, check its own report time separately from chain-paid rewards.",
        "## Continue checking",
        "[Acurast monitoring: managers, processors, rewards and balances](/learn/acurast-monitor-guide) · [Acurast manager vs processor address: which one should I enter?](/learn/acurast-processor-owner-identity) · [Acurast daily paid ACU rewards vs cumulative rewards and balance](/learn/acurast-rewards-settlement) · [Troubleshoot Acurast offline processors, stale heartbeats and missing data](/learn/acurast-processor-offline)",
      ],
      ko: [
        "## 조회 범위 확인",
        "모니터는 유효한 체인 하트비트에 31분 활성 구간을 적용합니다. 시각이 없으면 알 수 없음입니다. 등록과 과거 보상은 남아 있을 수 있어 현재 계산 중이라는 증거가 아닙니다.",
        "관리자 보상과 기기 하트비트를 분리하세요. free·reserved·frozen은 별도 잔액 필드이며 frozen을 total에 다시 더하지 않습니다. 달러 환산에는 유효한 시세가 필요합니다.",
        "휴대폰의 Acurast Processor는 검증 가능한 컴퓨트를 제공합니다. 일반적인 작업 증명 채굴기가 아닙니다. 공식 문서는 Lite를 여유가 될 때 켜는 일상 휴대폰으로, Core를 Acurast만 하는 잠긴 전용 휴대폰으로 정의합니다. 그 규칙의 보상은 앱이 실행 중이고 휴대폰이 온라인일 때 적용됩니다. 이 사이트의 등록됨은 그 의미가 아닙니다.",
        "## 작업을 어디서 보나",
        "- Hub에서 이 기기를 열고 Processor 앱이 실행 중인지 확인하세요. 한 번 설치했던 것과는 다릅니다.",
        "- 공식 문서는 기기가 약 30분마다 심박한다고 합니다. 최근 실적은 Telegram의 Acurast Monitoring Bot을 가리킵니다. 체인에서 심박을 모두 훑는 것은 가능하지만, 문서가 말하듯 느립니다.",
        "- 보상 페이지의 Busy Bonus: 어떤 에폭의 첫 성공 심박 때 배포 실행이 감지되면 벤치마크 지표에 10% 추가 가중치가 붙습니다. 그 에폭의 컴퓨트 풀과 스테이킹 컴퓨트 풀 점수를 올립니다. 별도의 급여 명세가 아닙니다.",
        "- 개발자가 낸 배포 비용은 실행 성공 후 소각됩니다. 공급 규칙이지, 내 휴대폰에 입금된 금액이 아닙니다.",
        "## Acurast 오프라인·오래된 하트비트·조회 실패 해결",
        "메인넷·공개 주소·체인 하트비트·조회 시각부터 확인하고 Hub와 휴대폰 앱의 네트워크·배터리 제한·프로세스를 비교하세요. 오래된 하트비트는 활성 구간 밖이며 API 실패는 상태 미조회입니다. 로컬 에이전트가 연결돼 있다면 보고 시각을 체인 지급 보상과 별도로 보세요.",
        "## 추가 확인",
        "[Acurast 모니터: 관리자·프로세서·보상·잔액](/learn/acurast-monitor-guide) · [Acurast 관리자 주소와 프로세서 주소의 차이](/learn/acurast-processor-owner-identity) · [Acurast 일일 ACU 지급 보상·누적 보상·잔액](/learn/acurast-rewards-settlement) · [Acurast 오프라인·오래된 하트비트·조회 실패 해결](/learn/acurast-processor-offline)",
      ],
      ja: [
        "## 照会範囲を確認",
        "監視は有効なチェーンハートビートに31分の活動窓を適用します。時刻がなければ不明です。登録や過去報酬は残るため、現在計算中である証拠にはなりません。",
        "管理者報酬とProcessor報告を分けます。free・reserved・frozenは別の残高項目で、frozenをtotalに再加算しません。ドル換算には有効な価格が必要です。",
        "電話の Acurast Processor は検証できるコンピュートを提供します。一般的なプルーフ・オブ・ワークのマイナーではありません。公式ドキュメントは Lite を、都合のよいときに起動する日常の電話、Core を Acurast 専用にロックした電話と定義します。その規則の報酬は、アプリが動いていて電話がオンラインのときに適用されます。当サイトの登録済みにその意味はありません。",
        "## ジョブをどこで見るか",
        "- Hubでこのデバイスを開き、Processorアプリが実行中かを確認します。一度インストールしたこととは違います。",
        "- 公式ドキュメントは、デバイスが約30分ごとにハートビートすると述べています。直近の様子は Telegram の Acurast Monitoring Bot を示しています。チェーン上のハートビートをすべて辿ることは可能で、ドキュメントが言うとおり時間がかかります。",
        "- 報酬ページの Busy Bonus: あるエポックの最初の成功ハートビートでデプロイ実行が検出されると、ベンチマーク指標に10%の追加ウェイトが付きます。そのエポックのコンピュートプールとステークド・コンピュートプールのスコアを上げます。別の給与明細ではありません。",
        "- 開発者が支払ったデプロイ費用は、実行成功後にバーンされます。供給の規則であり、自分の電話への入金額ではありません。",
        "## Acurastのオフライン・古いハートビート・取得失敗を確認",
        "メインネット・公開アドレス・チェーン報告・取得時刻を確認し、Hubと電話アプリのネットワーク・電池制限・動作を照合します。古い報告は活動窓外、API失敗は状態未取得です。Agent接続時はその報告時刻をチェーン支払報酬と分けて確認します。",
        "## 続けて確認",
        "[Acurast監視：管理者・プロセッサ・報酬・残高](/learn/acurast-monitor-guide) · [Acurast管理者アドレスとProcessorアドレスの違い](/learn/acurast-processor-owner-identity) · [Acurastの日次ACU支払報酬・累計報酬・残高](/learn/acurast-rewards-settlement) · [Acurastのオフライン・古いハートビート・取得失敗を確認](/learn/acurast-processor-offline)",
      ],
    },
    questions: {
      zh: [
        {
          question: "Acurast 心跳、在线与任务执行怎么区分？",
          answer:
            "当前监控按最近 31 分钟内的有效链上心跳判断活跃窗口。没有心跳时间时保留未知。链上登记可以长期保留；历史奖励也可能来自之前的运行，二者均不能证明手机此刻正在计算。",
        },
        {
          question: "Acurast 离线、心跳过期与数据未获取怎么排查？",
          answer:
            "先看主网、公开地址、最近链上心跳和本站获取时间。再在官方 Hub 与手机应用对照网络、电池限制和运行情况。心跳过期表示超出本站活跃窗口，接口失败则只是这次没有拿到状态。若连接了本机 Agent，单独核对 Agent 最近上报时间，不把它当作链上已支付奖励。",
        },
        {
          question: "Acurast 离线、心跳过期与数据未获取怎么排查？",
          answer:
            "先看主网、公开地址、最近链上心跳和本站获取时间。再在官方 Hub 与手机应用对照网络、电池限制和运行情况。心跳过期表示超出本站活跃窗口，接口失败则只是这次没有拿到状态。若连接了本机 Agent，单独核对 Agent 最近上报时间，不把它当作链上已支付奖励。",
        },
      ],
      "zh-TW": [
        {
          question: "Acurast 心跳、在線與任務執行如何區分？",
          answer:
            "目前依最近 31 分鐘有效鏈上心跳判斷活躍窗口，缺少時間保留未知。登記及歷史獎勵可長期存在，皆不證明手機正在計算。",
        },
        {
          question: "Acurast 離線、心跳過期與未取得資料如何排查？",
          answer:
            "先看主網、地址、心跳及取得時間，再對照 Hub 和手機網路、電池限制與執行情況。心跳過期是超出活躍窗口，介面失敗僅表示未取得狀態。若連接 Agent，另看其回報時間，不視為鏈上獎勵。",
        },
        {
          question: "Acurast 離線、心跳過期與未取得資料如何排查？",
          answer:
            "先看主網、地址、心跳及取得時間，再對照 Hub 和手機網路、電池限制與執行情況。心跳過期是超出活躍窗口，介面失敗僅表示未取得狀態。若連接 Agent，另看其回報時間，不視為鏈上獎勵。",
        },
      ],
      en: [
        {
          question: "Acurast heartbeat vs online state and running jobs",
          answer:
            "The monitor uses a 31-minute window for a valid recent chain heartbeat. A missing timestamp stays unknown. Registration can persist and historical rewards can predate current activity; neither establishes that a phone is computing now.",
        },
        {
          question: "Troubleshoot Acurast offline processors, stale heartbeats and missing data",
          answer:
            "Check mainnet, the public address, last chain heartbeat and fetch time. Compare Hub with the phone app’s network, battery restrictions and process state. An old heartbeat is outside the monitor’s activity window; a failed API read only means status was not fetched. For a connected local agent, check its own report time separately from chain-paid rewards.",
        },
        {
          question: "Troubleshoot Acurast offline processors, stale heartbeats and missing data",
          answer:
            "Check mainnet, the public address, last chain heartbeat and fetch time. Compare Hub with the phone app’s network, battery restrictions and process state. An old heartbeat is outside the monitor’s activity window; a failed API read only means status was not fetched. For a connected local agent, check its own report time separately from chain-paid rewards.",
        },
      ],
      ko: [
        {
          question: "Acurast 하트비트·온라인·작업 실행 구분",
          answer:
            "모니터는 유효한 체인 하트비트에 31분 활성 구간을 적용합니다. 시각이 없으면 알 수 없음입니다. 등록과 과거 보상은 남아 있을 수 있어 현재 계산 중이라는 증거가 아닙니다.",
        },
        {
          question: "Acurast 오프라인·오래된 하트비트·조회 실패 해결",
          answer:
            "메인넷·공개 주소·체인 하트비트·조회 시각부터 확인하고 Hub와 휴대폰 앱의 네트워크·배터리 제한·프로세스를 비교하세요. 오래된 하트비트는 활성 구간 밖이며 API 실패는 상태 미조회입니다. 로컬 에이전트가 연결돼 있다면 보고 시각을 체인 지급 보상과 별도로 보세요.",
        },
        {
          question: "Acurast 오프라인·오래된 하트비트·조회 실패 해결",
          answer:
            "메인넷·공개 주소·체인 하트비트·조회 시각부터 확인하고 Hub와 휴대폰 앱의 네트워크·배터리 제한·프로세스를 비교하세요. 오래된 하트비트는 활성 구간 밖이며 API 실패는 상태 미조회입니다. 로컬 에이전트가 연결돼 있다면 보고 시각을 체인 지급 보상과 별도로 보세요.",
        },
      ],
      ja: [
        {
          question: "Acurastのハートビート・オンライン・ジョブ実行の違い",
          answer:
            "監視は有効なチェーンハートビートに31分の活動窓を適用します。時刻がなければ不明です。登録や過去報酬は残るため、現在計算中である証拠にはなりません。",
        },
        {
          question: "Acurastのオフライン・古いハートビート・取得失敗を確認",
          answer:
            "メインネット・公開アドレス・チェーン報告・取得時刻を確認し、Hubと電話アプリのネットワーク・電池制限・動作を照合します。古い報告は活動窓外、API失敗は状態未取得です。Agent接続時はその報告時刻をチェーン支払報酬と分けて確認します。",
        },
        {
          question: "Acurastのオフライン・古いハートビート・取得失敗を確認",
          answer:
            "メインネット・公開アドレス・チェーン報告・取得時刻を確認し、Hubと電話アプリのネットワーク・電池制限・動作を照合します。古い報告は活動窓外、API失敗は状態未取得です。Agent接続時はその報告時刻をチェーン支払報酬と分けて確認します。",
        },
      ],
    },
  },
  {
    slug: "acurast-rewards-settlement",
    project: "acurast",
    published: "2026-10-24",
    modified: "2026-10-26",
    topic: {
      zh: "奖励记在哪",
      "zh-TW": "獎勵記在哪",
      en: "Where rewards are assigned",
      ko: "보상이 어디에 잡히나",
      ja: "報酬はどこに付くか",
    },
    title: {
      zh: "Acurast 今日 ACU 奖励、累计奖励和钱包余额",
      "zh-TW": "Acurast 今日 ACU 獎勵、累計獎勵與餘額",
      en: "Acurast daily paid ACU rewards vs cumulative rewards and balance",
      ko: "Acurast 일일 ACU 지급 보상·누적 보상·잔액",
      ja: "Acurastの日次ACU支払報酬・累計報酬・残高",
    },
    description: {
      zh: "已支付计算奖励按管理者统计；香港时间今日增量、累计值与钱包余额分别展示。",
      "zh-TW": "已支付計算獎勵依管理者統計；香港今日增量、累計及餘額分開顯示。",
      en: "Paid compute rewards are manager aggregates. Hong Kong-day increases, cumulative values and wallet balances are separate measures.",
      ko: "지급된 컴퓨트 보상은 관리자 합계입니다. 홍콩 날짜의 증가량·누적값·지갑 잔액은 별개입니다.",
      ja: "支払済み計算報酬は管理者合計です。香港日付の増分・累計・ウォレット残高は別の指標です。",
    },
    summary: {
      zh: "已支付计算奖励按管理者统计；香港时间今日增量、累计值与钱包余额分别展示。",
      "zh-TW": "已支付計算獎勵依管理者統計；香港今日增量、累計及餘額分開顯示。",
      en: "Paid compute rewards are manager aggregates. Hong Kong-day increases, cumulative values and wallet balances are separate measures.",
      ko: "지급된 컴퓨트 보상은 관리자 합계입니다. 홍콩 날짜의 증가량·누적값·지갑 잔액은 별개입니다.",
      ja: "支払済み計算報酬は管理者合計です。香港日付の増分・累計・ウォレット残高は別の指標です。",
    },
    sources: [
      {
        name: "Acurast processor rewards",
        url: "https://docs.acurast.com/processors/rewards/",
      },
      {
        name: "IOTA Watch reward accounting implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-rewards.server.ts",
      },
      {
        name: "IOTA Watch processor and balance implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-chain.server.ts",
      },
      {
        name: "Acurast compute providers",
        url: "https://docs.acurast.com/processors/",
      },
    ],
    related: [
      "acurast-monitor-guide",
      "acurast-processor-owner-identity",
      "acurast-phone-job-status",
      "acurast-processor-offline",
    ],
    body: {
      zh: [
        "## 先确认查询范围",
        "本站读取主网 ManagerMetricRewards 的 paid 累计计数，以香港时间零点对应的历史状态求今日增量。缺少历史边界时，今日保持未知，不用当前余额倒推。它不涵盖所有质押、迁移或委托提取；一个管理者关联多台手机时，也不按台数平均分摊。",
        "管理者范围的奖励与手机范围的心跳分开看；钱包 free、reserved 和 frozen 是不同余额字段，frozen 不与 total 再次相加。美元值只在有效报价可用时估算。",
        "官方奖励页把发放周期写成 900 个区块，大约 1.5 小时，和处理器说明里“大约 90 分钟”是同一档周期。基础基准奖励占通胀的 10%，参加或不参加质押计算都会进入这一池。页面给出的主网数字是每周期 856.164 ACU，即所写 8,561.64 ACU 的 10%。Canary 对应写成每周期 85.62 cACU。ACU 与 cACU 不能相加。",
        "质押奖励是另外 70%。同一页写每周期 5,993.15 枚，并说明按硬件表现、质押规模和承诺时长分配。这个总数是全网该池的周期额度，不是某一台手机的应得。官网还说明没有手机的人可以把质押委托给计算提供者。委托收益和处理器自己的基础奖励是两条线。",
        "## Acurast 管理者地址与处理器地址有什么区别？",
        "要找一台手机，复制该手机的 Processor 地址；要核对管理者范围，使用管理者公开地址。页面展开名单存在读取上限，若提示不完整，就只按已读取范围理解，不推断未读取设备离线。",
        "## 继续核对",
        "[Acurast 监控：管理者、处理器、奖励与余额](/learn/acurast-monitor-guide) · [Acurast 管理者地址与处理器地址有什么区别？](/learn/acurast-processor-owner-identity) · [Acurast 心跳、在线与任务执行怎么区分？](/learn/acurast-phone-job-status) · [Acurast 离线、心跳过期与数据未获取怎么排查？](/learn/acurast-processor-offline)",
      ],
      "zh-TW": [
        "## 先確認查詢範圍",
        "本站讀取主網 ManagerMetricRewards paid 累計值，以香港零點歷史狀態求今日增量。歷史邊界缺失則今日未知，不用餘額倒推。此項不含所有質押、遷移或委託提取，多台手機亦不平均分攤。",
        "管理者獎勵與手機心跳分開；free、reserved、frozen 為不同餘額欄位，frozen 不再加到 total。美元值僅在有效報價時估算。",
        "官方獎勵頁把發放週期寫成 900 個區塊，大約 1.5 小時，和處理器說明裡「大約 90 分鐘」是同一檔週期。基礎基準獎勵占通膨的 10%，參加或不參加質押計算都會進入這一池。頁面給出的主網數字是每週期 856.164 ACU，即所寫 8,561.64 ACU 的 10%。Canary 對應寫成每週期 85.62 cACU。ACU 與 cACU 不能相加。",
        "質押獎勵是另外 70%。同一頁寫每週期 5,993.15 枚，並說明按硬體表現、質押規模和承諾時長分配。這個總數是全網該池的週期額度，不是某一支手機的應得。官網還說明沒有手機的人可以把質押委託給計算提供者。委託收益和處理器自己的基礎獎勵是兩條線。",
        "## Acurast 管理者地址與處理器地址有何不同？",
        "查單支手機使用 Processor 地址；核對管理者範圍使用管理者公開地址。名單有讀取上限，若提示不完整，只按已讀範圍解讀，勿推斷其餘設備離線。",
        "## 繼續核對",
        "[Acurast 監控：管理者、處理器、獎勵與餘額](/learn/acurast-monitor-guide) · [Acurast 管理者地址與處理器地址有何不同？](/learn/acurast-processor-owner-identity) · [Acurast 心跳、在線與任務執行如何區分？](/learn/acurast-phone-job-status) · [Acurast 離線、心跳過期與未取得資料如何排查？](/learn/acurast-processor-offline)",
      ],
      en: [
        "## Check the query scope",
        "The monitor reads the mainnet ManagerMetricRewards paid counter and compares it with historical state at Hong Kong midnight. If that boundary is unavailable, today stays unknown rather than being inferred from balance. This counter excludes other staking, migration or delegation withdrawals, and is not divided equally among a manager’s phones.",
        "Keep manager rewards separate from processor heartbeats. Wallet free, reserved and frozen are distinct fields; do not add frozen to total again. USD values require an available valid quote.",
        "The official rewards page sets the assignment cycle at 900 blocks, about 1.5 hours. That matches the processor docs’ “about 90 minutes.” Base benchmark rewards are 10% of inflation and are paid whether or not the provider joins staked compute. The page states 856.164 ACU per epoch on mainnet, 10% of the stated 8,561.64 ACU, and 85.62 cACU per epoch on Canary. Do not add ACU and cACU.",
        "Staking rewards are a separate 70%. The same page states 5,993.15 tokens per epoch, assigned by hardware performance, stake size, and commitment length. That figure is the pool’s epoch amount for the network, not one phone’s entitlement. The public site also says people without hardware can delegate stake to compute providers. Delegated rewards and a processor’s base rewards are separate lines.",
        "## Acurast manager vs processor address: which one should I enter?",
        "Use the phone’s Processor address to identify one device, or the public manager address for manager scope. Expansion has read limits. If the result is incomplete, interpret only the returned subset rather than treating omitted processors as offline.",
        "## Continue checking",
        "[Acurast monitoring: managers, processors, rewards and balances](/learn/acurast-monitor-guide) · [Acurast manager vs processor address: which one should I enter?](/learn/acurast-processor-owner-identity) · [Acurast heartbeat vs online state and running jobs](/learn/acurast-phone-job-status) · [Troubleshoot Acurast offline processors, stale heartbeats and missing data](/learn/acurast-processor-offline)",
      ],
      ko: [
        "## 조회 범위 확인",
        "메인넷 ManagerMetricRewards의 paid 누적값을 홍콩 자정의 과거 상태와 비교합니다. 경계를 읽지 못하면 잔액으로 추정하지 않고 오늘을 알 수 없음으로 둡니다. 다른 스테이킹·이전·위임 인출을 모두 포함하지 않으며 휴대폰 수로 균등 배분하지 않습니다.",
        "관리자 보상과 기기 하트비트를 분리하세요. free·reserved·frozen은 별도 잔액 필드이며 frozen을 total에 다시 더하지 않습니다. 달러 환산에는 유효한 시세가 필요합니다.",
        "공식 보상 페이지는 배분 주기를 900블록, 약 1.5시간으로 적습니다. 프로세서 문서의 「약 90분」과 같은 주기입니다. 기본 벤치마크 보상은 인플레이션의 10%이며, 스테이킹 컴퓨트에 참여하든 하지 않든 이 풀로 들어갑니다. 페이지는 메인넷 에폭당 856.164 ACU, 즉 적힌 8,561.64 ACU의 10%와, Canary 에폭당 85.62 cACU를 적습니다. ACU와 cACU는 더하지 않습니다.",
        "스테이킹 보상은 별도의 70%입니다. 같은 페이지는 에폭당 5,993.15개이며, 하드웨어 성능, 스테이크 규모, 약속 기간으로 나눈다고 합니다. 이 합계는 그 풀의 네트워크 에폭 한도이지 휴대폰 하나의 몫이 아닙니다. 공개 사이트는 하드웨어가 없는 사람도 컴퓨트 제공자에게 스테이킹을 위임할 수 있다고 합니다. 위임 수익과 프로세서의 기본 보상은 별도 줄입니다.",
        "## Acurast 관리자 주소와 프로세서 주소의 차이",
        "한 휴대폰은 Processor 주소, 관리자 범위는 관리자 공개 주소를 사용하세요. 목록 확장에는 조회 한도가 있습니다. 불완전 표시가 있으면 조회된 범위만 해석하고 빠진 기기를 오프라인으로 간주하지 마세요.",
        "## 추가 확인",
        "[Acurast 모니터: 관리자·프로세서·보상·잔액](/learn/acurast-monitor-guide) · [Acurast 관리자 주소와 프로세서 주소의 차이](/learn/acurast-processor-owner-identity) · [Acurast 하트비트·온라인·작업 실행 구분](/learn/acurast-phone-job-status) · [Acurast 오프라인·오래된 하트비트·조회 실패 해결](/learn/acurast-processor-offline)",
      ],
      ja: [
        "## 照会範囲を確認",
        "メインネットのManagerMetricRewards paid累計を香港午前0時の過去状態と比較します。境界が取得できない日は残高で推定せず不明にします。他のステーキング・移行・委任引出しは含まず、電話台数で均等配分もしません。",
        "管理者報酬とProcessor報告を分けます。free・reserved・frozenは別の残高項目で、frozenをtotalに再加算しません。ドル換算には有効な価格が必要です。",
        "公式の報酬ページは、配分周期を900ブロック、約1.5時間としています。プロセッサ説明の「約90分」と同じ周期です。基本ベンチマーク報酬はインフレの10%で、ステークド・コンピュートに参加してもしなくてもこのプールに入ります。ページはメインネットでエポックあたり856.164 ACU、すなわち記載の8,561.64 ACUの10%、Canaryではエポックあたり85.62 cACUとしています。ACUとcACUは足しません。",
        "ステーキング報酬は別の70%です。同じページはエポックあたり5,993.15枚とし、ハードウェア性能、ステーク規模、コミット期間で配分すると述べています。この合計はそのプールのネットワーク全体のエポック枠であり、一台の電話の受取額ではありません。公開サイトは、ハードウェアがない人もコンピュート提供者へステークを委任できるとしています。委任の報酬とプロセッサ自身の基本報酬は別の行です。",
        "## Acurast管理者アドレスとProcessorアドレスの違い",
        "一台を探すにはProcessorアドレス、管理者範囲には管理者公開アドレスを使います。展開件数には上限があります。不完全と表示されたら返された範囲だけを読み、未取得の機器をオフラインと判断しません。",
        "## 続けて確認",
        "[Acurast監視：管理者・プロセッサ・報酬・残高](/learn/acurast-monitor-guide) · [Acurast管理者アドレスとProcessorアドレスの違い](/learn/acurast-processor-owner-identity) · [Acurastのハートビート・オンライン・ジョブ実行の違い](/learn/acurast-phone-job-status) · [Acurastのオフライン・古いハートビート・取得失敗を確認](/learn/acurast-processor-offline)",
      ],
    },
    questions: {
      zh: [
        {
          question: "Acurast 今日 ACU 奖励、累计奖励和钱包余额",
          answer:
            "本站读取主网 ManagerMetricRewards 的 paid 累计计数，以香港时间零点对应的历史状态求今日增量。缺少历史边界时，今日保持未知，不用当前余额倒推。它不涵盖所有质押、迁移或委托提取；一个管理者关联多台手机时，也不按台数平均分摊。",
        },
        {
          question: "Acurast 管理者地址与处理器地址有什么区别？",
          answer:
            "要找一台手机，复制该手机的 Processor 地址；要核对管理者范围，使用管理者公开地址。页面展开名单存在读取上限，若提示不完整，就只按已读取范围理解，不推断未读取设备离线。",
        },
        {
          question: "Acurast 监控：管理者、处理器、奖励与余额",
          answer:
            "在 Hub 确认 Mainnet，再复制管理者或具体 Processor 的公开地址。两种入口都可查询，但范围不同：处理器入口识别该处理器，管理者入口可展开其关联处理器。SS58 与 0x 公钥可能表示同一个账户。",
        },
      ],
      "zh-TW": [
        {
          question: "Acurast 今日 ACU 獎勵、累計獎勵與餘額",
          answer:
            "本站讀取主網 ManagerMetricRewards paid 累計值，以香港零點歷史狀態求今日增量。歷史邊界缺失則今日未知，不用餘額倒推。此項不含所有質押、遷移或委託提取，多台手機亦不平均分攤。",
        },
        {
          question: "Acurast 管理者地址與處理器地址有何不同？",
          answer:
            "查單支手機使用 Processor 地址；核對管理者範圍使用管理者公開地址。名單有讀取上限，若提示不完整，只按已讀範圍解讀，勿推斷其餘設備離線。",
        },
        {
          question: "Acurast 監控：管理者、處理器、獎勵與餘額",
          answer:
            "在 Hub 確認 Mainnet，再複製管理者或 Processor 公開地址。處理器入口識別該處理器，管理者入口可展開關聯處理器。SS58 與 0x 可能為同一帳戶。",
        },
      ],
      en: [
        {
          question: "Acurast daily paid ACU rewards vs cumulative rewards and balance",
          answer:
            "The monitor reads the mainnet ManagerMetricRewards paid counter and compares it with historical state at Hong Kong midnight. If that boundary is unavailable, today stays unknown rather than being inferred from balance. This counter excludes other staking, migration or delegation withdrawals, and is not divided equally among a manager’s phones.",
        },
        {
          question: "Acurast manager vs processor address: which one should I enter?",
          answer:
            "Use the phone’s Processor address to identify one device, or the public manager address for manager scope. Expansion has read limits. If the result is incomplete, interpret only the returned subset rather than treating omitted processors as offline.",
        },
        {
          question: "Acurast monitoring: managers, processors, rewards and balances",
          answer:
            "Select Mainnet in Hub and copy the public manager or Processor address. Both are accepted, with different scopes: a processor identifies that processor, while a manager can expand associated processors. SS58 and 0x can represent the same account.",
        },
      ],
      ko: [
        {
          question: "Acurast 일일 ACU 지급 보상·누적 보상·잔액",
          answer:
            "메인넷 ManagerMetricRewards의 paid 누적값을 홍콩 자정의 과거 상태와 비교합니다. 경계를 읽지 못하면 잔액으로 추정하지 않고 오늘을 알 수 없음으로 둡니다. 다른 스테이킹·이전·위임 인출을 모두 포함하지 않으며 휴대폰 수로 균등 배분하지 않습니다.",
        },
        {
          question: "Acurast 관리자 주소와 프로세서 주소의 차이",
          answer:
            "한 휴대폰은 Processor 주소, 관리자 범위는 관리자 공개 주소를 사용하세요. 목록 확장에는 조회 한도가 있습니다. 불완전 표시가 있으면 조회된 범위만 해석하고 빠진 기기를 오프라인으로 간주하지 마세요.",
        },
        {
          question: "Acurast 모니터: 관리자·프로세서·보상·잔액",
          answer:
            "Hub에서 Mainnet을 확인하고 관리자 또는 Processor 공개 주소를 복사하세요. 프로세서 주소는 해당 기기를 식별하고 관리자 주소는 연결된 프로세서를 펼칩니다. SS58과 0x가 같은 계정일 수 있습니다.",
        },
      ],
      ja: [
        {
          question: "Acurastの日次ACU支払報酬・累計報酬・残高",
          answer:
            "メインネットのManagerMetricRewards paid累計を香港午前0時の過去状態と比較します。境界が取得できない日は残高で推定せず不明にします。他のステーキング・移行・委任引出しは含まず、電話台数で均等配分もしません。",
        },
        {
          question: "Acurast管理者アドレスとProcessorアドレスの違い",
          answer:
            "一台を探すにはProcessorアドレス、管理者範囲には管理者公開アドレスを使います。展開件数には上限があります。不完全と表示されたら返された範囲だけを読み、未取得の機器をオフラインと判断しません。",
        },
        {
          question: "Acurast監視：管理者・プロセッサ・報酬・残高",
          answer:
            "HubでMainnetを確認し、管理者またはProcessorの公開アドレスをコピーします。Processorはその機器を識別し、管理者は関連Processorを展開できます。SS58と0xは同じアカウントを表す場合があります。",
        },
      ],
    },
  },
  {
    slug: "acurast-processor-offline",
    project: "acurast",
    published: "2026-10-24",
    modified: "2026-10-26",
    topic: {
      zh: "手机像是停了",
      "zh-TW": "手機像是停了",
      en: "The phone looks stopped",
      ko: "휴대폰이 멈춘 것처럼 보일 때",
      ja: "電話が止まって見えるとき",
    },
    title: {
      zh: "Acurast 离线、心跳过期与数据未获取怎么排查？",
      "zh-TW": "Acurast 離線、心跳過期與未取得資料如何排查？",
      en: "Troubleshoot Acurast offline processors, stale heartbeats and missing data",
      ko: "Acurast 오프라인·오래된 하트비트·조회 실패 해결",
      ja: "Acurastのオフライン・古いハートビート・取得失敗を確認",
    },
    description: {
      zh: "先分清链上心跳过期、来源读取失败和本机应用停止，再核对相同处理器。",
      "zh-TW": "先區分心跳過期、來源讀取失敗及本機應用停止，再核對處理器。",
      en: "Distinguish an old chain heartbeat, a failed source read and a stopped local app before checking the same processor.",
      ko: "체인 하트비트 만료·출처 조회 실패·로컬 앱 중단을 구분하고 같은 프로세서를 확인하세요.",
      ja: "チェーンハートビートの経過・取得失敗・ローカルアプリ停止を分けて、同じProcessorを確認します。",
    },
    summary: {
      zh: "先分清链上心跳过期、来源读取失败和本机应用停止，再核对相同处理器。",
      "zh-TW": "先區分心跳過期、來源讀取失敗及本機應用停止，再核對處理器。",
      en: "Distinguish an old chain heartbeat, a failed source read and a stopped local app before checking the same processor.",
      ko: "체인 하트비트 만료·출처 조회 실패·로컬 앱 중단을 구분하고 같은 프로세서를 확인하세요.",
      ja: "チェーンハートビートの経過・取得失敗・ローカルアプリ停止を分けて、同じProcessorを確認します。",
    },
    sources: [
      {
        name: "Acurast processor rewards",
        url: "https://docs.acurast.com/processors/rewards/",
      },
      {
        name: "IOTA Watch reward accounting implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-rewards.server.ts",
      },
      {
        name: "IOTA Watch processor and balance implementation",
        url: "https://github.com/molimao/iota/blob/main/src/lib/acurast-chain.server.ts",
      },
      {
        name: "Acurast compute providers",
        url: "https://docs.acurast.com/processors/",
      },
    ],
    related: [
      "acurast-monitor-guide",
      "acurast-processor-owner-identity",
      "acurast-phone-job-status",
      "acurast-rewards-settlement",
    ],
    body: {
      zh: [
        "## 先确认查询范围",
        "先看主网、公开地址、最近链上心跳和本站获取时间。再在官方 Hub 与手机应用对照网络、电池限制和运行情况。心跳过期表示超出本站活跃窗口，接口失败则只是这次没有拿到状态。若连接了本机 Agent，单独核对 Agent 最近上报时间，不把它当作链上已支付奖励。",
        "管理者范围的奖励与手机范围的心跳分开看；钱包 free、reserved 和 frozen 是不同余额字段，frozen 不与 total 再次相加。美元值只在有效报价可用时估算。",
        "官方处理器说明：心跳大约每 30 分钟一次；一个周期大约 90 分钟，里面有三次心跳机会。基准奖励的条件是这三次里至少有一次成功写到链上。因此漏掉一部分心跳，不一定失去该周期的基准奖励。三次都没有，则不满足这一条。文档建议用 Telegram 上的 Acurast Monitoring Bot 看近期表现，而不是手工把历史心跳全部扫完。",
        "## 建议的检查顺序",
        "- 在手机上看 Processor 应用是否仍在运行。Lite 可以被你暂停；Core 虽是专用机，物理断电或断网一样会停心跳。",
        "- 对照最近三个约 30 分钟的间隔里有没有至少一次成功心跳。有一次，按官方规则该周期基准奖励仍可发放；一次都没有，再查电量、网络和应用是否被系统冻结。",
        "- 余额若只减少大约 0.0013 ACU 这一量级，先按官方所说的上报手续费理解，不要单独当成掉线。",
        "- 若你为离线排查另存了一台设备，那会占用该项目的一台名额（免费 3 台，Pro 100 台）。同一台手机不要用 SS58 和 0x 各存一条。",
        "## 接下来与界限",
        "部署是否让该周期获得 Busy Bonus，看 [任务状态](/learn/acurast-phone-job-status)。全池金额不要当成个人入账，看 [奖励范围](/learn/acurast-rewards-settlement)。本站不接收手机通知，也不能替你重启应用。",
        "## Acurast 心跳、在线与任务执行怎么区分？",
        "当前监控按最近 31 分钟内的有效链上心跳判断活跃窗口。没有心跳时间时保留未知。链上登记可以长期保留；历史奖励也可能来自之前的运行，二者均不能证明手机此刻正在计算。",
        "## 继续核对",
        "[Acurast 监控：管理者、处理器、奖励与余额](/learn/acurast-monitor-guide) · [Acurast 管理者地址与处理器地址有什么区别？](/learn/acurast-processor-owner-identity) · [Acurast 心跳、在线与任务执行怎么区分？](/learn/acurast-phone-job-status) · [Acurast 今日 ACU 奖励、累计奖励和钱包余额](/learn/acurast-rewards-settlement)",
      ],
      "zh-TW": [
        "## 先確認查詢範圍",
        "先看主網、地址、心跳及取得時間，再對照 Hub 和手機網路、電池限制與執行情況。心跳過期是超出活躍窗口，介面失敗僅表示未取得狀態。若連接 Agent，另看其回報時間，不視為鏈上獎勵。",
        "管理者獎勵與手機心跳分開；free、reserved、frozen 為不同餘額欄位，frozen 不再加到 total。美元值僅在有效報價時估算。",
        "官方處理器說明：心跳大約每 30 分鐘一次；一個週期大約 90 分鐘，裡面有三次心跳機會。基準獎勵的條件是這三次裡至少有一次成功寫到鏈上。因此漏掉一部分心跳，不一定失去該週期的基準獎勵。三次都沒有，則不滿足這一條。文件建議用 Telegram 上的 Acurast Monitoring Bot 看近期表現，而不是手工把歷史心跳全部掃完。",
        "## 建議的檢查順序",
        "- 在手機上看 Processor 應用是否仍在執行。Lite 可以被你暫停；Core 雖是專用機，實體斷電或斷網一樣會停心跳。",
        "- 對照最近三個約 30 分鐘的間隔裡有沒有至少一次成功心跳。有一次，按官方規則該週期基準獎勵仍可發放；一次都沒有，再查電量、網路和應用是否被系統凍結。",
        "- 餘額若只減少大約 0.0013 ACU 這一量級，先按官方所說的上報手續費理解，不要單獨當成掉線。",
        "- 若你為離線排查另存了一台裝置，那會占用該專案的一台名額（免費 3 台，Pro 100 台）。同一支手機不要用 SS58 和 0x 各存一筆。",
        "## 接下來與界限",
        "部署是否讓該週期獲得 Busy Bonus，看 [任務狀態](/learn/acurast-phone-job-status)。全池金額不要當成個人入帳，看 [獎勵範圍](/learn/acurast-rewards-settlement)。本站不接收手機通知，也不能替你重啟應用。",
        "## Acurast 心跳、在線與任務執行如何區分？",
        "目前依最近 31 分鐘有效鏈上心跳判斷活躍窗口，缺少時間保留未知。登記及歷史獎勵可長期存在，皆不證明手機正在計算。",
        "## 繼續核對",
        "[Acurast 監控：管理者、處理器、獎勵與餘額](/learn/acurast-monitor-guide) · [Acurast 管理者地址與處理器地址有何不同？](/learn/acurast-processor-owner-identity) · [Acurast 心跳、在線與任務執行如何區分？](/learn/acurast-phone-job-status) · [Acurast 今日 ACU 獎勵、累計獎勵與餘額](/learn/acurast-rewards-settlement)",
      ],
      en: [
        "## Check the query scope",
        "Check mainnet, the public address, last chain heartbeat and fetch time. Compare Hub with the phone app’s network, battery restrictions and process state. An old heartbeat is outside the monitor’s activity window; a failed API read only means status was not fetched. For a connected local agent, check its own report time separately from chain-paid rewards.",
        "Keep manager rewards separate from processor heartbeats. Wallet free, reserved and frozen are distinct fields; do not add frozen to total again. USD values require an available valid quote.",
        "Official processor docs: heartbeats are about every 30 minutes, and an epoch is about 90 minutes, so there are three heartbeat chances. Benchmark rewards are assigned when at least one of those three is received on chain. Missing some heartbeats does not by itself remove that epoch’s benchmark rewards. If none of the three arrives, that condition is not met. The docs point to the Acurast Monitoring Bot on Telegram for recent performance, rather than scanning the full heartbeat history by hand.",
        "## Checks, in order",
        "- On the phone, see whether the Processor app is still running. You can pause Lite. Core is a dedicated phone, but power loss or a dead network still stops heartbeats.",
        "- Compare the last three intervals of about 30 minutes. One success meets the official benchmark-reward condition for that epoch. If none succeeded, check battery, network, and whether the system froze the app.",
        "- A balance change on the order of about 0.0013 ACU fits the report fee described officially. Do not treat that dip alone as proof of downtime.",
        "- Saving an extra device while you debug uses one slot on this project (three on Free, 100 on Pro). Do not save both the SS58 form and the 0x form of the same phone.",
        "## Next step and limit",
        "Whether a deployment adds Busy Bonus for that epoch is covered in [job status](/learn/acurast-phone-job-status). Do not treat a pool total as a personal credit; see [reward scope](/learn/acurast-rewards-settlement). This site does not receive phone notifications and cannot restart the app.",
        "## Acurast heartbeat vs online state and running jobs",
        "The monitor uses a 31-minute window for a valid recent chain heartbeat. A missing timestamp stays unknown. Registration can persist and historical rewards can predate current activity; neither establishes that a phone is computing now.",
        "## Continue checking",
        "[Acurast monitoring: managers, processors, rewards and balances](/learn/acurast-monitor-guide) · [Acurast manager vs processor address: which one should I enter?](/learn/acurast-processor-owner-identity) · [Acurast heartbeat vs online state and running jobs](/learn/acurast-phone-job-status) · [Acurast daily paid ACU rewards vs cumulative rewards and balance](/learn/acurast-rewards-settlement)",
      ],
      ko: [
        "## 조회 범위 확인",
        "메인넷·공개 주소·체인 하트비트·조회 시각부터 확인하고 Hub와 휴대폰 앱의 네트워크·배터리 제한·프로세스를 비교하세요. 오래된 하트비트는 활성 구간 밖이며 API 실패는 상태 미조회입니다. 로컬 에이전트가 연결돼 있다면 보고 시각을 체인 지급 보상과 별도로 보세요.",
        "관리자 보상과 기기 하트비트를 분리하세요. free·reserved·frozen은 별도 잔액 필드이며 frozen을 total에 다시 더하지 않습니다. 달러 환산에는 유효한 시세가 필요합니다.",
        "공식 프로세서 문서: 심박은 약 30분마다이고, 에폭은 약 90분이므로 심박 기회는 세 번입니다. 벤치마크 보상은 세 번 중 적어도 한 번이 체인에 기록되면 배분됩니다. 심박을 일부 놓쳐도 그 사실만으로 해당 에폭의 벤치마크 보상이 사라지지는 않습니다. 세 번 모두 없으면 그 조건은 충족되지 않습니다. 문서는 최근 실적을 Telegram의 Acurast Monitoring Bot으로 보라고 하며, 과거 심박을 손으로 전부 훑으라고 하지 않습니다.",
        "## 확인 순서",
        "- 휴대폰에서 Processor 앱이 아직 실행 중인지 보세요. Lite는 멈출 수 있습니다. Core는 전용 휴대폰이지만 전원이나 네트워크가 끊기면 심박도 멈춥니다.",
        "- 최근 약 30분 간격 세 번을 비교하세요. 한 번 성공하면 그 에폭의 공식 벤치마크 보상 조건을 충족합니다. 한 번도 없으면 배터리, 네트워크, 시스템이 앱을 얼렸는지를 보세요.",
        "- 약 0.0013 ACU 규모의 잔액 변화는 공식 문서의 보고 수수료와 맞습니다. 그 감소만으로 다운타임의 증거로 삼지 마세요.",
        "- 디버그하려고 장치를 하나 더 저장하면 이 프로젝트의 자리 하나를 씁니다(무료 3대, Pro 100대). 같은 휴대폰의 SS58과 0x를 둘 다 저장하지 마세요.",
        "## 다음 단계와 한계",
        "배포가 그 에폭에 Busy Bonus를 더하는지는 [작업 상태](/learn/acurast-phone-job-status)에 있습니다. 풀 합계를 개인 입금으로 보지 말고 [보상 범위](/learn/acurast-rewards-settlement)를 보세요. 이 사이트는 휴대폰 알림을 받지 않으며 앱을 다시 시작하지도 않습니다.",
        "## Acurast 하트비트·온라인·작업 실행 구분",
        "모니터는 유효한 체인 하트비트에 31분 활성 구간을 적용합니다. 시각이 없으면 알 수 없음입니다. 등록과 과거 보상은 남아 있을 수 있어 현재 계산 중이라는 증거가 아닙니다.",
        "## 추가 확인",
        "[Acurast 모니터: 관리자·프로세서·보상·잔액](/learn/acurast-monitor-guide) · [Acurast 관리자 주소와 프로세서 주소의 차이](/learn/acurast-processor-owner-identity) · [Acurast 하트비트·온라인·작업 실행 구분](/learn/acurast-phone-job-status) · [Acurast 일일 ACU 지급 보상·누적 보상·잔액](/learn/acurast-rewards-settlement)",
      ],
      ja: [
        "## 照会範囲を確認",
        "メインネット・公開アドレス・チェーン報告・取得時刻を確認し、Hubと電話アプリのネットワーク・電池制限・動作を照合します。古い報告は活動窓外、API失敗は状態未取得です。Agent接続時はその報告時刻をチェーン支払報酬と分けて確認します。",
        "管理者報酬とProcessor報告を分けます。free・reserved・frozenは別の残高項目で、frozenをtotalに再加算しません。ドル換算には有効な価格が必要です。",
        "公式のプロセッサ説明: ハートビートは約30分ごと、エポックは約90分なので、機会は三回です。ベンチマーク報酬は、その三回のうち少なくとも一回がチェーンに記録されれば割り当てられます。一部のハートビートを欠いただけでは、そのエポックのベンチマーク報酬が消えるとは限りません。三回とも無ければ、その条件は満たされません。ドキュメントは直近の様子を Telegram の Acurast Monitoring Bot で見るよう示しており、過去のハートビートを手ですべて辿ることは勧めていません。",
        "## 確認の順",
        "- 電話で Processor アプリがまだ実行中かを見ます。Liteは止められます。Coreは専用の電話でも、電源断やネットワーク断でハートビートは止まります。",
        "- 直近の約30分間隔を三回比べます。一度成功すれば、そのエポックの公式ベンチマーク報酬条件を満たします。一度も無ければ、電池、ネットワーク、システムがアプリを止めていないかを見ます。",
        "- 約0.0013 ACU規模の残高変化は、公式が述べる報告手数料と合います。その減少だけを停止の証拠にしないでください。",
        "- 調査のためにデバイスをもう一台保存すると、このプロジェクトの枠を一つ使います（無料3台、Pro 100台）。同じ電話のSS58と0xを両方保存しないでください。",
        "## 次と限界",
        "デプロイがそのエポックに Busy Bonus を足すかは [ジョブ状態](/learn/acurast-phone-job-status) です。プール合計を個人の入金と見ないでください。[報酬の範囲](/learn/acurast-rewards-settlement) を見てください。当サイトは電話の通知を受け取らず、アプリの再起動もできません。",
        "## Acurastのハートビート・オンライン・ジョブ実行の違い",
        "監視は有効なチェーンハートビートに31分の活動窓を適用します。時刻がなければ不明です。登録や過去報酬は残るため、現在計算中である証拠にはなりません。",
        "## 続けて確認",
        "[Acurast監視：管理者・プロセッサ・報酬・残高](/learn/acurast-monitor-guide) · [Acurast管理者アドレスとProcessorアドレスの違い](/learn/acurast-processor-owner-identity) · [Acurastのハートビート・オンライン・ジョブ実行の違い](/learn/acurast-phone-job-status) · [Acurastの日次ACU支払報酬・累計報酬・残高](/learn/acurast-rewards-settlement)",
      ],
    },
    questions: {
      zh: [
        {
          question: "Acurast 离线、心跳过期与数据未获取怎么排查？",
          answer:
            "先看主网、公开地址、最近链上心跳和本站获取时间。再在官方 Hub 与手机应用对照网络、电池限制和运行情况。心跳过期表示超出本站活跃窗口，接口失败则只是这次没有拿到状态。若连接了本机 Agent，单独核对 Agent 最近上报时间，不把它当作链上已支付奖励。",
        },
        {
          question: "Acurast 心跳、在线与任务执行怎么区分？",
          answer:
            "当前监控按最近 31 分钟内的有效链上心跳判断活跃窗口。没有心跳时间时保留未知。链上登记可以长期保留；历史奖励也可能来自之前的运行，二者均不能证明手机此刻正在计算。",
        },
        {
          question: "Acurast 管理者地址与处理器地址有什么区别？",
          answer:
            "要找一台手机，复制该手机的 Processor 地址；要核对管理者范围，使用管理者公开地址。页面展开名单存在读取上限，若提示不完整，就只按已读取范围理解，不推断未读取设备离线。",
        },
      ],
      "zh-TW": [
        {
          question: "Acurast 離線、心跳過期與未取得資料如何排查？",
          answer:
            "先看主網、地址、心跳及取得時間，再對照 Hub 和手機網路、電池限制與執行情況。心跳過期是超出活躍窗口，介面失敗僅表示未取得狀態。若連接 Agent，另看其回報時間，不視為鏈上獎勵。",
        },
        {
          question: "Acurast 心跳、在線與任務執行如何區分？",
          answer:
            "目前依最近 31 分鐘有效鏈上心跳判斷活躍窗口，缺少時間保留未知。登記及歷史獎勵可長期存在，皆不證明手機正在計算。",
        },
        {
          question: "Acurast 管理者地址與處理器地址有何不同？",
          answer:
            "查單支手機使用 Processor 地址；核對管理者範圍使用管理者公開地址。名單有讀取上限，若提示不完整，只按已讀範圍解讀，勿推斷其餘設備離線。",
        },
      ],
      en: [
        {
          question: "Troubleshoot Acurast offline processors, stale heartbeats and missing data",
          answer:
            "Check mainnet, the public address, last chain heartbeat and fetch time. Compare Hub with the phone app’s network, battery restrictions and process state. An old heartbeat is outside the monitor’s activity window; a failed API read only means status was not fetched. For a connected local agent, check its own report time separately from chain-paid rewards.",
        },
        {
          question: "Acurast heartbeat vs online state and running jobs",
          answer:
            "The monitor uses a 31-minute window for a valid recent chain heartbeat. A missing timestamp stays unknown. Registration can persist and historical rewards can predate current activity; neither establishes that a phone is computing now.",
        },
        {
          question: "Acurast manager vs processor address: which one should I enter?",
          answer:
            "Use the phone’s Processor address to identify one device, or the public manager address for manager scope. Expansion has read limits. If the result is incomplete, interpret only the returned subset rather than treating omitted processors as offline.",
        },
      ],
      ko: [
        {
          question: "Acurast 오프라인·오래된 하트비트·조회 실패 해결",
          answer:
            "메인넷·공개 주소·체인 하트비트·조회 시각부터 확인하고 Hub와 휴대폰 앱의 네트워크·배터리 제한·프로세스를 비교하세요. 오래된 하트비트는 활성 구간 밖이며 API 실패는 상태 미조회입니다. 로컬 에이전트가 연결돼 있다면 보고 시각을 체인 지급 보상과 별도로 보세요.",
        },
        {
          question: "Acurast 하트비트·온라인·작업 실행 구분",
          answer:
            "모니터는 유효한 체인 하트비트에 31분 활성 구간을 적용합니다. 시각이 없으면 알 수 없음입니다. 등록과 과거 보상은 남아 있을 수 있어 현재 계산 중이라는 증거가 아닙니다.",
        },
        {
          question: "Acurast 관리자 주소와 프로세서 주소의 차이",
          answer:
            "한 휴대폰은 Processor 주소, 관리자 범위는 관리자 공개 주소를 사용하세요. 목록 확장에는 조회 한도가 있습니다. 불완전 표시가 있으면 조회된 범위만 해석하고 빠진 기기를 오프라인으로 간주하지 마세요.",
        },
      ],
      ja: [
        {
          question: "Acurastのオフライン・古いハートビート・取得失敗を確認",
          answer:
            "メインネット・公開アドレス・チェーン報告・取得時刻を確認し、Hubと電話アプリのネットワーク・電池制限・動作を照合します。古い報告は活動窓外、API失敗は状態未取得です。Agent接続時はその報告時刻をチェーン支払報酬と分けて確認します。",
        },
        {
          question: "Acurastのハートビート・オンライン・ジョブ実行の違い",
          answer:
            "監視は有効なチェーンハートビートに31分の活動窓を適用します。時刻がなければ不明です。登録や過去報酬は残るため、現在計算中である証拠にはなりません。",
        },
        {
          question: "Acurast管理者アドレスとProcessorアドレスの違い",
          answer:
            "一台を探すにはProcessorアドレス、管理者範囲には管理者公開アドレスを使います。展開件数には上限があります。不完全と表示されたら返された範囲だけを読み、未取得の機器をオフラインと判断しません。",
        },
      ],
    },
  },
];
