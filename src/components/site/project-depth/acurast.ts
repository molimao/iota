import type { Article } from "../articles";

const sources = {
  processors: { name: "Acurast Compute Providers", url: "https://docs.acurast.com/processors/" },
  rewards: { name: "Acurast Rewards", url: "https://docs.acurast.com/processors/rewards/" },
  indexer: { name: "Acurast Indexer", url: "https://github.com/Acurast/acurast-indexer" },
  home: { name: "Acurast", url: "https://acurast.com/" },
} as const;

export const acurastDepthGuides: Article[] = [
  {
    slug: "acurast-monitor-guide",
    project: "acurast",
    published: "2026-10-12",
    modified: "2026-10-24",
    topic: {
      zh: "该填哪个地址",
      "zh-TW": "該填哪個地址",
      en: "Which address to enter",
      ko: "어떤 주소를 넣을지",
      ja: "どのアドレスを入れるか",
    },
    title: {
      zh: "Acurast 应该填管理者钱包还是处理器地址？",
      "zh-TW": "Acurast 應填管理者錢包還是處理器地址？",
      en: "Which Acurast address belongs to your processor?",
      ko: "Acurast에서 관리자 지갑과 프로세서 주소 중 무엇을 넣나요?",
      ja: "Acurastでは管理者ウォレットとプロセッサのどちらを入れますか？",
    },
    description: {
      zh: "在 Hub 的设备详情复制 Processor 地址。管理者钱包可以管多台手机，不能代替单台处理器。本站只确认主网登记和类型。",
      "zh-TW":
        "在 Hub 的裝置詳情複製 Processor 地址。管理者錢包可以管多支手機，不能代替單台處理器。本站只確認主網登記和類型。",
      en: "Copy the Processor address from the device in Acurast Hub. A manager wallet can cover many phones and is not that processor. This site only confirms mainnet registration and type.",
      ko: "Hub 기기 상세에서 Processor 주소를 복사하세요. 관리 지갑은 여러 휴대폰을 다룰 수 있어 그 프로세서가 아닙니다. 이 사이트는 메인넷 등록과 유형만 확인합니다.",
      ja: "Hubの機器詳細からProcessorアドレスをコピーします。管理者ウォレットは複数の電話を扱え、そのプロセッサではありません。当サイトはメインネット登録と種別だけを確認します。",
    },
    summary: {
      zh: "打开 Hub 并确认是 Mainnet，在具体手机的详情里复制 Processor 地址，再贴到 Acurast 项目页。查到“已登记”只说明主网索引里有这台处理器，不说明它此刻在跑任务，也不显示 ACU 奖励。",
      "zh-TW":
        "打開 Hub 並確認是 Mainnet，在具體手機的詳情裡複製 Processor 地址，再貼到 Acurast 專案頁。看到「已登記」只表示主網索引裡有這台處理器，不表示它此刻在跑任務，也不顯示 ACU 獎勵。",
      en: "Open Hub on Mainnet, copy the Processor address from that phone’s details, and paste it on the Acurast project page. Registered means the mainnet index lists that processor. It does not mean the phone is running a job, and it does not show ACU rewards.",
      ko: "Hub에서 Mainnet을 확인하고 해당 휴대폰 상세의 Processor 주소를 Acurast 프로젝트 페이지에 붙이세요. 등록됨은 메인넷 색인에 그 프로세서가 있다는 뜻입니다. 지금 작업을 실행 중이라는 뜻도, ACU 보상을 보여 준다는 뜻도 아닙니다.",
      ja: "HubでMainnetを確認し、その電話の詳細からProcessorアドレスをAcurastプロジェクトページへ貼ります。登録済みはメインネット索引にそのプロセッサがあるという意味です。いまジョブを実行していることや、ACU報酬の表示ではありません。",
    },
    sources: [sources.processors, sources.indexer, sources.home],
    related: [
      "acurast-processor-owner-identity",
      "acurast-phone-job-status",
      "acurast-processor-offline",
    ],
    comparisonTitle: {
      zh: "地址从哪来",
      "zh-TW": "地址從哪來",
      en: "Where the address comes from",
      ko: "주소가 어디서 나오나",
      ja: "アドレスの出どころ",
    },
    comparison: {
      zh: {
        headers: ["你看到的", "能不能贴进本站", "贴错时常见结果"],
        rows: [
          ["设备详情里的 Processor 地址", "可以，SS58 或 0x 公钥", "主网有登记则显示已登记和类型"],
          ["连接 Hub 的管理者钱包", "不能代替处理器", "若它本身不是处理器，查询不可用"],
          ["Canary 上的 cACU 账户", "不能当主网处理器", "主网索引没有这条登记"],
          ["安装二维码里的秘密", "不要粘贴", "本站不接收私钥或助记词"],
        ],
      },
      "zh-TW": {
        headers: ["你看到的", "能不能貼進本站", "貼錯時常見結果"],
        rows: [
          ["裝置詳情裡的 Processor 地址", "可以，SS58 或 0x 公鑰", "主網有登記則顯示已登記和類型"],
          ["連接 Hub 的管理者錢包", "不能代替處理器", "若它本身不是處理器，查詢不可用"],
          ["Canary 上的 cACU 帳戶", "不能當主網處理器", "主網索引沒有這筆登記"],
          ["安裝二維碼裡的秘密", "不要貼上", "本站不接收私鑰或助記詞"],
        ],
      },
      en: {
        headers: ["What you see", "Paste it here?", "If it is the wrong account"],
        rows: [
          [
            "Processor address on the device",
            "Yes: SS58 or 0x public key",
            "Mainnet hit shows Registered and type",
          ],
          [
            "Wallet connected to Hub",
            "Not a substitute",
            "Unavailable when that wallet is not itself a processor",
          ],
          ["Canary account holding cACU", "Not a mainnet processor", "No mainnet registration row"],
          [
            "Secret inside a setup QR",
            "Never paste it",
            "Private keys and seed phrases are not accepted",
          ],
        ],
      },
      ko: {
        headers: ["보이는 것", "여기에 넣나", "계정을 잘못 고르면"],
        rows: [
          [
            "기기 상세의 Processor 주소",
            "가능: SS58 또는 0x 공개키",
            "메인넷에 있으면 등록됨과 유형",
          ],
          [
            "Hub에 연결한 관리 지갑",
            "프로세서를 대신하지 않음",
            "그 지갑 자체가 프로세서가 아니면 조회 불가",
          ],
          ["Canary의 cACU 계정", "메인넷 프로세서가 아님", "메인넷 등록 행이 없음"],
          ["설정 QR 안의 비밀", "절대 붙이지 않음", "비밀키와 시드 문구는 받지 않음"],
        ],
      },
      ja: {
        headers: ["見ているもの", "ここに貼るか", "アカウントを間違えると"],
        rows: [
          [
            "機器詳細のProcessorアドレス",
            "可: SS58または0x公開鍵",
            "メインネットにあれば登録済みと種別",
          ],
          [
            "Hubに接続した管理者ウォレット",
            "プロセッサの代わりにならない",
            "その財布自体がプロセッサでなければ取得不可",
          ],
          ["CanaryのcACU口座", "メインネットのプロセッサではない", "メインネット登録行がない"],
          ["設定QR内の秘密", "貼らない", "秘密鍵とシードは受け取らない"],
        ],
      },
    },
    body: {
      zh: [
        "要监控某一台手机，填那台手机在 Acurast Hub 设备详情里的 Processor 地址，不要填你用来登录 Hub 的管理者钱包。官方说明一台账户可以通过「Add New Device」再连更多手机；那个钱包是管理入口，每台手机仍有自己的处理器地址。",
        "打开 [Acurast 项目页](/projects/acurast)，贴上从 Mainnet 设备详情复制的地址。本站接受带校验的 SS58，或 0x 后接 64 位十六进制的公钥。二维码里的秘密、私钥和助记词都不要贴。",
        "## 页面上两个字段",
        "- **主网处理器登记**：显示「已登记」表示官方主网索引把这个账户标成处理器。没有记录或索引暂时读不到时显示不可用，不会写成 0 收益。",
        "- **设备类型**：只在索引给出的分类属于 Android、iOS、Core、Lite 时显示，例如 Android · Lite。对不上的分类留空，不猜机型。",
        "## 先核对再保存",
        "- 在 Hub 切到 Mainnet。Canary 使用 cACU，和主网 ACU 不是同一套余额。",
        "- 点进这一台手机，复制 Processor，而不是页面顶部的连接钱包。",
        "- 回到 [Acurast 项目页](/projects/acurast) 查询。类型和你在 Hub 看到的 Core 或 Lite 一致，再考虑保存。",
        "- 免费档每个项目保存 5 台设备，Pro 为 50 台。在 Hub 里看到同一钱包下有多台手机，不会自动占用这些名额；你为每台手机单独保存一条设备记录时，才会各占一台。同一条已保存设备上的多种绑定不额外占名额。",
        "## 举例",
        "示意：Hub 登录钱包是账户 M，手机甲的 Processor 是账户 P。把 M 贴进来，若 M 自己不是处理器，结果是不可用。把 P 贴进来，主网索引有这条处理器时显示已登记。这组字母只用来区分角色，不是真实地址，也不是收益。",
        "## 接下来与界限",
        "登记成功后，若要看这台手机是否在做部署、心跳是否连续、ACU 如何按周期发放，分别看 [任务状态](/learn/acurast-phone-job-status)、[离线判断](/learn/acurast-processor-offline) 和 [奖励范围](/learn/acurast-rewards-settlement)。本站不启动 Processor 应用，不签名，也不把账户余额当成收益。",
      ],
      "zh-TW": [
        "要監控某一支手機，填那支手機在 Acurast Hub 裝置詳情裡的 Processor 地址，不要填你用來登入 Hub 的管理者錢包。官方說明一個帳戶可以用「Add New Device」再連更多手機；那個錢包是管理入口，每支手機仍有自己的處理器地址。",
        "打開 [Acurast 專案頁](/projects/acurast)，貼上從 Mainnet 裝置詳情複製的地址。本站接受有校驗的 SS58，或 0x 後接 64 位十六進位的公鑰。二維碼裡的秘密、私鑰和助記詞都不要貼。",
        "## 頁面上兩個欄位",
        "- **主網處理器登記**：顯示「已登記」表示官方主網索引把這個帳戶標成處理器。沒有紀錄或索引暫時讀不到時顯示無法取得，不會寫成 0 收益。",
        "- **設備類型**：只在索引給出的分類屬於 Android、iOS、Core、Lite 時顯示，例如 Android · Lite。對不上的分類留空，不猜機型。",
        "## 先核對再儲存",
        "- 在 Hub 切到 Mainnet。Canary 使用 cACU，和主網 ACU 不是同一套餘額。",
        "- 點進這一支手機，複製 Processor，而不是頁面頂端的連接錢包。",
        "- 回到 [Acurast 專案頁](/projects/acurast) 查詢。類型和你在 Hub 看到的 Core 或 Lite 一致，再考慮儲存。",
        "- 免費方案每個專案儲存 5 台裝置，Pro 為 50 台。在 Hub 裡看到同一錢包下有多支手機，不會自動占用這些名額；你為每支手機單獨儲存一筆裝置紀錄時，才會各占一台。同一筆已儲存裝置上的多種綁定不額外占名額。",
        "## 舉例",
        "示意：Hub 登入錢包是帳戶 M，手機甲的 Processor 是帳戶 P。把 M 貼進來，若 M 自己不是處理器，結果是無法取得。把 P 貼進來，主網索引有這筆處理器時顯示已登記。這組字母只用來區分角色，不是真實地址，也不是收益。",
        "## 接下來與界限",
        "登記成功後，若要看這支手機是否在做部署、心跳是否連續、ACU 如何按週期發放，分別看 [任務狀態](/learn/acurast-phone-job-status)、[離線判斷](/learn/acurast-processor-offline) 和 [獎勵範圍](/learn/acurast-rewards-settlement)。本站不啟動 Processor 應用，不簽名，也不把帳戶餘額當成收益。",
      ],
      en: [
        "To monitor one phone, paste that phone’s Processor address from its device details in Acurast Hub. Do not paste the manager wallet you used to sign in. Official docs say one account can add more phones with Add New Device. That wallet is the management entry; each phone still has its own processor address.",
        "Open the [Acurast project page](/projects/acurast) and paste the address copied while Hub is on Mainnet. The page accepts a checksummed SS58 address or a 0x prefix plus 64 hexadecimal characters. Do not paste QR secrets, private keys, or seed phrases.",
        "## The two fields",
        "- **Mainnet processor registration:** Registered means the official mainnet index marks this account as a processor. A missing row or a failed read stays unavailable. It is not written as zero earnings.",
        "- **Device classification:** Shown only when the index classification is Android, iOS, Core, or Lite, for example Android · Lite. Anything else stays blank. The page does not guess the handset.",
        "## Check, then save",
        "- Switch Hub to Mainnet. Canary uses cACU. That balance is not mainnet ACU.",
        "- Open this phone and copy Processor, not the connected wallet at the top.",
        "- Look it up on the [Acurast project page](/projects/acurast). Save after the type matches the Core or Lite label you see in Hub.",
        "- Free stores five saved devices per project; Pro stores 50. Phones listed under one Hub wallet do not automatically use those slots. Saving a separate device record for each phone does. Extra bindings on the same saved device do not add a slot.",
        "## Example",
        "Illustration only: Hub wallet M manages the account, and phone A’s processor is account P. Pasting M stays unavailable when M is not itself a processor. Pasting P shows Registered when the mainnet index lists that processor. These letters are roles, not a real address and not income.",
        "## Next step and limit",
        "After registration matches, use [job status](/learn/acurast-phone-job-status), [offline checks](/learn/acurast-processor-offline), and [reward scope](/learn/acurast-rewards-settlement) for deployments, heartbeats, and how ACU is assigned each epoch. This site does not start the Processor app, sign transactions, or treat a token balance as earnings.",
      ],
      ko: [
        "휴대폰 한 대를 보려면 Acurast Hub 기기 상세의 Processor 주소를 넣으세요. 로그인에 쓴 관리 지갑은 넣지 마세요. 공식 문서는 한 계정이 Add New Device로 휴대폰을 더 연결할 수 있다고 합니다. 그 지갑은 관리 입구이고, 휴대폰마다 프로세서 주소가 따로 있습니다.",
        "[Acurast 프로젝트 페이지](/projects/acurast)를 열고 Hub가 Mainnet일 때 복사한 주소를 붙이세요. 체크섬 SS58 또는 0x 뒤 64자리 16진수 공개키를 받습니다. QR 비밀, 비밀키, 시드 문구는 붙이지 마세요.",
        "## 두 필드",
        "- **메인넷 프로세서 등록:** 등록됨은 공식 메인넷 색인이 이 계정을 프로세서로 표시했다는 뜻입니다. 행이 없거나 읽기에 실패하면 사용 불가입니다. 수익 0으로 적지 않습니다.",
        "- **기기 분류:** 색인 분류가 Android, iOS, Core, Lite일 때만 표시합니다. 예: Android · Lite. 그 밖은 비워 두고 기종을 추측하지 않습니다.",
        "## 확인 후 저장",
        "- Hub를 Mainnet으로 전환하세요. Canary는 cACU를 쓰며 메인넷 ACU와 다른 잔액입니다.",
        "- 이 휴대폰을 열고 상단 연결 지갑이 아니라 Processor를 복사하세요.",
        "- [Acurast 프로젝트 페이지](/projects/acurast)에서 조회하세요. Hub의 Core 또는 Lite와 유형이 맞은 뒤 저장을 고려하세요.",
        "- 무료는 프로젝트마다 저장 장치 5대, Pro는 50대입니다. Hub 지갑 아래에 휴대폰이 여러 대 보여도 그 자리수를 자동으로 쓰지 않습니다. 휴대폰마다 장치 기록을 따로 저장하면 각 1대를 씁니다. 같은 저장 장치의 추가 바인딩은 자리를 더하지 않습니다.",
        "## 예시",
        "설명용입니다. Hub 지갑 M이 관리 계정이면, 휴대폰 A의 프로세서는 계정 P입니다. M이 프로세서가 아니면 M을 붙여도 사용 불가입니다. P를 붙이고 메인넷 색인에 그 프로세서가 있으면 등록됨입니다. 이 글자는 역할이며 실제 주소도 수익도 아닙니다.",
        "## 다음 단계와 한계",
        "등록이 맞으면 배포, 심박, 에폭별 ACU 배분은 [작업 상태](/learn/acurast-phone-job-status), [오프라인 판단](/learn/acurast-processor-offline), [보상 범위](/learn/acurast-rewards-settlement)에서 이어서 보세요. 이 사이트는 Processor 앱을 시작하거나 서명하지 않으며, 토큰 잔액을 수익으로 보지 않습니다.",
      ],
      ja: [
        "一台の電話を見るなら、Acurast Hubの機器詳細にあるProcessorアドレスを貼ります。ログインに使った管理者ウォレットは貼りません。公式ドキュメントでは、一つの口座が Add New Device で電話を追加できます。そのウォレットは管理の入口で、電話ごとにプロセッサアドレスは別です。",
        "[Acurastプロジェクトページ](/projects/acurast)を開き、HubがMainnetのときにコピーしたアドレスを貼ります。チェックサム付きSS58、または0xに64桁の16進公開鍵を受け付けます。QRの秘密、秘密鍵、シードフレーズは貼らないでください。",
        "## 二つの項目",
        "- **メインネットプロセッサ登録:** 登録済みは、公式メインネット索引がこの口座をプロセッサと印しているという意味です。行がない、または読み取りに失敗した場合は取得不可です。収益0とは書きません。",
        "- **機器分類:** 索引の分類が Android、iOS、Core、Lite のときだけ表示します。例: Android · Lite。それ以外は空欄で、機種は推測しません。",
        "## 確認してから保存",
        "- HubをMainnetにします。CanaryはcACUで、メインネットACUとは別の残高です。",
        "- その電話を開き、上部の接続ウォレットではなく Processor をコピーします。",
        "- [Acurastプロジェクトページ](/projects/acurast)で照会します。Hubの Core または Lite と種別が一致してから保存を検討します。",
        "- 無料はプロジェクトごとに保存デバイス5台、Proは50台です。一つのHubウォレットの下に電話が並んで見えても、その枠は自動では使いません。電話ごとにデバイス記録を別に保存すると、それぞれ1台を使います。同じ保存デバイスへの追加バインドは枠を増やしません。",
        "## 例",
        "説明用です。HubウォレットMが管理口座なら、電話Aのプロセッサは口座Pです。M自身がプロセッサでなければ、Mを貼っても取得不可です。Pを貼り、メインネット索引にそのプロセッサがあれば登録済みです。この文字は役割であり、実在のアドレスでも収益でもありません。",
        "## 次と限界",
        "登録が一致したら、デプロイ、ハートビート、エポックごとのACU配分は [ジョブ状態](/learn/acurast-phone-job-status)、[オフラインの見分け](/learn/acurast-processor-offline)、[報酬の範囲](/learn/acurast-rewards-settlement) を見てください。当サイトはProcessorアプリを起動せず、署名せず、トークン残高を収益とは扱いません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "管理者钱包里能看到很多手机，为什么不能用它查询？",
          answer:
            "那个钱包是 Hub 的管理账户。官方索引把处理器和管理账户分开。本站按你粘贴的地址查找处理器登记，不会自动展开这个钱包名下的全部手机。",
        },
        {
          question: "SS58 和 0x 公钥是两个处理器吗？",
          answer:
            "同一个处理器可以用这两种形式表示同一把公钥。保存时按这一台设备记一条。请不要为了两种写法各存一台。",
        },
        {
          question: "已登记是否等于今天有 ACU 入账？",
          answer:
            "不是。已登记只说明主网索引里有这台处理器及其可识别的类型。奖励、心跳和余额不在这个查询里。",
        },
      ],
      "zh-TW": [
        {
          question: "管理者錢包裡看得到很多手機，為什麼不能用它查詢？",
          answer:
            "那個錢包是 Hub 的管理帳戶。官方索引把處理器和管理帳戶分開。本站按你貼上的地址查找處理器登記，不會自動展開這個錢包名下的全部手機。",
        },
        {
          question: "SS58 和 0x 公鑰是兩個處理器嗎？",
          answer:
            "同一個處理器可以用這兩種形式表示同一把公鑰。儲存時按這一台裝置記一筆。請不要為了兩種寫法各存一台。",
        },
        {
          question: "已登記是否等於今天有 ACU 入帳？",
          answer:
            "不是。已登記只說明主網索引裡有這台處理器及其可辨識的類型。獎勵、心跳和餘額不在這個查詢裡。",
        },
      ],
      en: [
        {
          question: "Hub shows many phones under my wallet. Why can’t I paste that wallet?",
          answer:
            "That wallet is the Hub management account. The official index separates processors from manager accounts. This site looks up the address you paste and does not expand every phone under the wallet.",
        },
        {
          question: "Are SS58 and the 0x public key two processors?",
          answer:
            "They can be two writings of the same public key. Save one device record for that phone. Do not save a second device just because the spelling changed.",
        },
        {
          question: "Does Registered mean ACU arrived today?",
          answer:
            "No. Registered means the mainnet index lists that processor and any recognized type. Rewards, heartbeats, and balances are outside this lookup.",
        },
      ],
      ko: [
        {
          question: "지갑 아래 휴대폰이 여러 대인데 왜 그 지갑을 넣을 수 없나요?",
          answer:
            "그 지갑은 Hub 관리 계정입니다. 공식 색인은 프로세서와 관리 계정을 나눕니다. 이 사이트는 붙인 주소의 프로세서 등록만 찾으며, 지갑 아래 휴대폰을 자동으로 펼치지 않습니다.",
        },
        {
          question: "SS58과 0x 공개키는 프로세서 두 대인가요?",
          answer:
            "같은 공개키의 두 표기일 수 있습니다. 그 휴대폰은 장치 기록 하나로 저장하세요. 표기가 다르다고 장치를 또 저장하지 마세요.",
        },
        {
          question: "등록됨은 오늘 ACU가 들어왔다는 뜻인가요?",
          answer:
            "아닙니다. 등록됨은 메인넷 색인에 그 프로세서와 알아볼 수 있는 유형이 있다는 뜻입니다. 보상, 심박, 잔액은 이 조회 밖입니다.",
        },
      ],
      ja: [
        {
          question: "ウォレットの下に電話が並んでいるのに、なぜそのウォレットを貼れないのですか？",
          answer:
            "そのウォレットはHubの管理口座です。公式索引はプロセッサと管理口座を分けています。当サイトは貼ったアドレスのプロセッサ登録を引き、ウォレット配下の電話を自動では展開しません。",
        },
        {
          question: "SS58と0x公開鍵はプロセッサ二台ですか？",
          answer:
            "同じ公開鍵の二つの書き方であることがあります。その電話はデバイス記録一つとして保存します。表記が違うだけで二台目を保存しないでください。",
        },
        {
          question: "登録済みは今日ACUが入った意味ですか？",
          answer:
            "違います。登録済みは、メインネット索引にそのプロセッサと判別できる種別があるという意味です。報酬、ハートビート、残高はこの照会の外です。",
        },
      ],
    },
  },
  {
    slug: "acurast-processor-owner-identity",
    project: "acurast",
    published: "2026-10-24",
    modified: "2026-10-24",
    topic: {
      zh: "处理器与管理者",
      "zh-TW": "處理器與管理者",
      en: "Processor and manager",
      ko: "프로세서와 관리자",
      ja: "プロセッサと管理者",
    },
    title: {
      zh: "Acurast 处理器账户和管理者钱包是不是同一个人？",
      "zh-TW": "Acurast 處理器帳戶和管理者錢包是不是同一人？",
      en: "Is the Acurast processor the same account as the Hub manager?",
      ko: "Acurast 프로세서 계정과 Hub 관리 지갑은 같은 계정인가요?",
      ja: "Acurastのプロセッサ口座とHub管理者は同じですか？",
    },
    description: {
      zh: "Hub 管理者可以添加多台手机，每台手机的处理器是独立账户。本站只认你填入的那个处理器，不把管理钱包下的手机合成一台。",
      "zh-TW":
        "Hub 管理者可以新增多支手機，每支手機的處理器是獨立帳戶。本站只認你填入的那個處理器，不把管理錢包下的手機合成一台。",
      en: "A Hub manager can add many phones. Each phone’s processor is its own account. This site recognizes only the processor you enter and does not merge phones under the manager wallet.",
      ko: "Hub 관리자는 휴대폰을 여러 대 추가할 수 있습니다. 휴대폰마다 프로세서 계정이 따로 있습니다. 이 사이트는 입력한 프로세서만 인정하며 관리 지갑 아래 휴대폰을 한 대로 합치지 않습니다.",
      ja: "Hub管理者は複数の電話を追加できます。電話ごとのプロセッサは別口座です。当サイトは入力したプロセッサだけを認め、管理者ウォレット配下を一台にはまとめません。",
    },
    summary: {
      zh: "一个人可以同时是 Hub 的管理者和某台手机的处理器，但这两个角色在索引里是不同筛选条件。查手机时用处理器账户。管理钱包上的 ACU 余额不是各台手机收益的加总。",
      "zh-TW":
        "同一人可以同時是 Hub 的管理者和某支手機的處理器，但這兩個角色在索引裡是不同篩選條件。查手機時用處理器帳戶。管理錢包上的 ACU 餘額不是各支手機收益的加總。",
      en: "One person can be both the Hub manager and a phone’s processor, but the index treats those roles as different filters. Look up the phone with the processor account. ACU on the manager wallet is not the sum of each phone’s earnings.",
      ko: "한 사람이 Hub 관리자이면서 어떤 휴대폰의 프로세서일 수 있지만, 색인은 두 역할을 다른 필터로 다룹니다. 휴대폰은 프로세서 계정으로 조회하세요. 관리 지갑의 ACU 잔액은 휴대폰별 수익의 합이 아닙니다.",
      ja: "同一人物がHub管理者であり、ある電話のプロセッサでもあり得ます。索引では二つの役割は別の絞り込みです。電話はプロセッサ口座で照会します。管理者ウォレットのACU残高は各電話の収益の合計ではありません。",
    },
    sources: [sources.processors, sources.indexer, sources.home],
    related: ["acurast-monitor-guide", "acurast-rewards-settlement", "acurast-phone-job-status"],
    comparisonTitle: {
      zh: "两个角色各看什么",
      "zh-TW": "兩個角色各看什麼",
      en: "What each role is for",
      ko: "역할마다 무엇을 보나",
      ja: "役割ごとに見ること",
    },
    comparison: {
      zh: {
        headers: ["角色", "你用它做什么", "本站怎么对待"],
        rows: [
          ["Hub 管理者钱包", "添加设备、连接多台手机、在 Hub 查看", "不能自动列出其下全部处理器"],
          ["单台 Processor", "标识这一台手机的计算账户", "按这个地址查主网是否登记为处理器"],
          ["委托质押的人", "自己不一定跑手机，把质押委托给提供者", "不是这台手机的登记查询"],
          ["Cloud Rebellion 参与者", "做任务积累 MIST 点数", "MIST 不是本站的 ACU 登记字段"],
        ],
      },
      "zh-TW": {
        headers: ["角色", "你用它做什麼", "本站怎麼對待"],
        rows: [
          ["Hub 管理者錢包", "新增裝置、連接多支手機、在 Hub 查看", "不能自動列出其下全部處理器"],
          ["單台 Processor", "標識這一支手機的計算帳戶", "按這個地址查主網是否登記為處理器"],
          ["委託質押的人", "自己不一定跑手機，把質押委託給提供者", "不是這支手機的登記查詢"],
          ["Cloud Rebellion 參與者", "做任務累積 MIST 點數", "MIST 不是本站的 ACU 登記欄位"],
        ],
      },
      en: {
        headers: ["Role", "What you use it for", "How this site treats it"],
        rows: [
          [
            "Hub manager wallet",
            "Add devices and view phones in Hub",
            "Does not auto-list every processor under it",
          ],
          [
            "One Processor",
            "Identifies that phone’s compute account",
            "Checks whether this address is a mainnet processor",
          ],
          [
            "Delegator",
            "Stake delegated to a provider, possibly with no phone",
            "Not this phone’s registration lookup",
          ],
          [
            "Cloud Rebellion participant",
            "Quests that accumulate MIST points",
            "MIST is not the ACU registration field",
          ],
        ],
      },
      ko: {
        headers: ["역할", "어디에 쓰나", "이 사이트의 취급"],
        rows: [
          [
            "Hub 관리 지갑",
            "기기 추가와 Hub에서 휴대폰 보기",
            "아래 프로세서를 자동 나열하지 않음",
          ],
          ["프로세서 하나", "그 휴대폰의 컴퓨트 계정", "이 주소가 메인넷 프로세서인지 확인"],
          [
            "위임자",
            "휴대폰 없이 제공자에게 스테이킹을 맡길 수 있음",
            "이 휴대폰의 등록 조회가 아님",
          ],
          ["Cloud Rebellion 참여자", "퀘스트로 MIST 점수 축적", "MIST는 ACU 등록 필드가 아님"],
        ],
      },
      ja: {
        headers: ["役割", "何に使うか", "当サイトの扱い"],
        rows: [
          [
            "Hub管理者ウォレット",
            "デバイス追加とHubでの確認",
            "配下のプロセッサを自動では列挙しない",
          ],
          [
            "一つのProcessor",
            "その電話のコンピュート口座",
            "このアドレスがメインネットのプロセッサか確認",
          ],
          ["委任者", "電話がなくても提供者へステークを委任できる", "この電話の登録照会ではない"],
          ["Cloud Rebellion参加者", "クエストでMISTポイントを積む", "MISTはACU登録項目ではない"],
        ],
      },
    },
    body: {
      zh: [
        "Hub 里连接的钱包是管理者。官方处理器说明允许用这个账户添加新设备：在 Hub 生成二维码，在手机上的 Processor Lite 选择连接 Hub 并扫码。扫码完成后，手机进入这个管理者能看到的设备列表，但列表里的每一台仍用自己的 Processor 地址标识。",
        "官方索引的账户查询可以按处理器、管理者或提交者筛选。这是三种身份，不是三个别名。Acurast 官网也把「自己跑手机」和「没有硬件、把质押委托给计算提供者」分开：委托者可以参与质押奖励，但委托地址不是那台手机的处理器登记。",
        "## 保存设备时怎么数",
        "- 想看哪一台手机，就保存哪一台的 Processor。免费每个项目 5 台已保存设备，Pro 50 台。",
        "- 只在 Hub 打开管理者钱包、看到下面有三台手机，不会因此在本站占用三台名额。",
        "- 你若把三台处理器分别存成三台设备，就占用三台。",
        "- 同一台已保存设备即使再次绑定同一项目，也不再增加名额。钱包余额若出现在多条记录里，仍是同一笔余额，不会把一台手机的金额乘以设备数。",
        "## 和类型的关系",
        "Core 是专用、锁定的手机，上线 Core 才需要恢复出厂。Lite 装在日常手机上，Android 需要工作资料夹，iOS 也可以安装 Lite。官方写明 Android 12 或更高，iPhone 为 6s 或更新机型。这些是安装条件。本站类型栏只复述索引里的 Android / iOS 与 Core / Lite，不判断系统版本是否达标。",
        "## 举例",
        "示意：管理者 M 添加了手机甲（处理器 P1，Lite）和手机乙（处理器 P2，Core）。在 [Acurast 项目页](/projects/acurast) 查询 P1，只返回 P1 的登记和类型。M 的余额、P2 是否在线、委托者 D 的质押，都不会写进 P1 这一条。字母仅作示意，不是链上地址。",
        "## 接下来与界限",
        "地址仍不确定时回到 [该填哪个地址](/learn/acurast-monitor-guide)。要区分基础奖励和质押奖励，打开 [奖励范围](/learn/acurast-rewards-settlement)。本站不读取管理者名下的设备清单，也不代替 Hub 完成添加设备。",
      ],
      "zh-TW": [
        "Hub 裡連接的錢包是管理者。官方處理器說明允許用這個帳戶新增裝置：在 Hub 產生二維碼，在手機上的 Processor Lite 選擇連接 Hub 並掃碼。掃碼完成後，手機進入這個管理者能看到的裝置列表，但列表裡的每一支仍用自己的 Processor 地址標識。",
        "官方索引的帳戶查詢可以按處理器、管理者或提交者篩選。這是三種身分，不是三個別名。Acurast 官網也把「自己跑手機」和「沒有硬體、把質押委託給計算提供者」分開：委託者可以參與質押獎勵，但委託地址不是那支手機的處理器登記。",
        "## 儲存裝置時怎麼數",
        "- 想看哪一支手機，就儲存哪一支的 Processor。免費每個專案 5 台已儲存裝置，Pro 50 台。",
        "- 只在 Hub 打開管理者錢包、看到下面有三支手機，不會因此在本站占用三台名額。",
        "- 你若把三台處理器分別存成三台裝置，就占用三台。",
        "- 同一台已儲存裝置即使再次綁定同一專案，也不再增加名額。錢包餘額若出現在多筆紀錄裡，仍是同一筆餘額，不會把一支手機的金額乘以裝置數。",
        "## 和類型的關係",
        "Core 是專用、鎖定的手機，上線 Core 才需要恢復出廠。Lite 裝在日常手機上，Android 需要工作資料夾，iOS 也可以安裝 Lite。官方寫明 Android 12 或更高，iPhone 為 6s 或更新機型。這些是安裝條件。本站類型欄只複述索引裡的 Android / iOS 與 Core / Lite，不判斷系統版本是否達標。",
        "## 舉例",
        "示意：管理者 M 新增了手機甲（處理器 P1，Lite）和手機乙（處理器 P2，Core）。在 [Acurast 專案頁](/projects/acurast) 查詢 P1，只返回 P1 的登記和類型。M 的餘額、P2 是否在線、委託者 D 的質押，都不會寫進 P1 這一筆。字母僅作示意，不是鏈上地址。",
        "## 接下來與界限",
        "地址仍不確定時回到 [該填哪個地址](/learn/acurast-monitor-guide)。要區分基礎獎勵和質押獎勵，打開 [獎勵範圍](/learn/acurast-rewards-settlement)。本站不讀取管理者名下的裝置清單，也不代替 Hub 完成新增裝置。",
      ],
      en: [
        "The wallet connected in Hub is the manager. Official processor docs let that account add a device: Hub creates a QR code, and Processor Lite on the phone uses Connect to Hub to scan it. After setup, the phone appears in the manager’s device list, and each row still has its own Processor address.",
        "The official index can filter accounts as processor, manager, or committer. Those are three roles, not three names for one account. Acurast’s site also separates running a phone from delegating stake when you have no hardware. A delegator can take part in staking rewards. The delegator address is not that phone’s processor registration.",
        "## How saved devices are counted",
        "- Save the Processor of the phone you want to watch. Free is five saved devices per project. Pro is 50.",
        "- Opening the manager wallet in Hub and seeing three phones does not use three slots here.",
        "- Saving three processor records as three devices uses three slots.",
        "- Binding the same project again on one saved device does not add a slot. If a wallet balance shows on more than one row, it is still one balance, not a phone’s amount multiplied by the device count.",
        "## What type means",
        "Core is a dedicated, locked-down phone, and Core onboarding is when a factory reset is required. Lite runs on an everyday phone. Android Lite uses a work profile, and Lite can be installed on iOS. Official requirements are Android 12 or higher and iPhone 6s or later. Those are install conditions. The type line here only repeats Android / iOS and Core / Lite from the index. It does not check the OS version.",
        "## Example",
        "Illustration only: manager M added phone A (processor P1, Lite) and phone B (processor P2, Core). A lookup of P1 on the [Acurast project page](/projects/acurast) returns P1’s registration and type. M’s balance, whether P2 is online, and delegator D’s stake are not written into P1’s row. The letters are labels, not on-chain addresses.",
        "## Next step and limit",
        "If the address is still unclear, return to [which address to enter](/learn/acurast-monitor-guide). To separate base rewards from staking rewards, open [reward scope](/learn/acurast-rewards-settlement). This site does not load the manager’s device list and does not add a device in Hub for you.",
      ],
      ko: [
        "Hub에 연결한 지갑이 관리자입니다. 공식 프로세서 문서는 그 계정으로 기기를 추가합니다. Hub가 QR을 만들고, 휴대폰의 Processor Lite에서 Connect to Hub로 스캔합니다. 설정이 끝나면 휴대폰은 관리자의 기기 목록에 들어가며, 각 행은 여전히 자신의 Processor 주소를 갖습니다.",
        "공식 색인은 계정을 프로세서, 관리자, 커미터로 걸러 낼 수 있습니다. 세 역할이지, 한 계정의 세 이름이 아닙니다. Acurast 사이트도 휴대폰을 직접 돌리는 일과, 하드웨어 없이 스테이킹을 위임하는 일을 나눕니다. 위임자는 스테이킹 보상에 참여할 수 있습니다. 위임 주소는 그 휴대폰의 프로세서 등록이 아닙니다.",
        "## 저장 장치를 세는 법",
        "- 보려는 휴대폰의 Processor를 저장하세요. 무료는 프로젝트마다 저장 장치 5대, Pro는 50대입니다.",
        "- Hub에서 관리 지갑을 열고 휴대폰 세 대가 보여도 여기서 세 자리를 쓰지 않습니다.",
        "- 프로세서 세 개를 장치 세 대로 저장하면 세 자리를 씁니다.",
        "- 이미 저장한 장치에 같은 프로젝트를 다시 묶어도 자리는 늘지 않습니다. 지갑 잔액이 여러 행에 보여도 한 잔액이며, 휴대폰 금액을 장치 수로 곱하지 않습니다.",
        "## 유형이 의미하는 것",
        "Core는 전용으로 잠긴 휴대폰이며, Core 온보딩 때 공장 초기화가 필요합니다. Lite는 일상 휴대폰에서 돕니다. Android Lite는 업무 프로필을 쓰고, iOS에도 Lite를 설치할 수 있습니다. 공식 요건은 Android 12 이상, iPhone 6s 이상입니다. 이것은 설치 조건입니다. 여기 유형 줄은 색인의 Android / iOS와 Core / Lite만 반복하며 OS 버전은 검사하지 않습니다.",
        "## 예시",
        "설명용입니다. 관리자 M이 휴대폰 A(프로세서 P1, Lite)와 휴대폰 B(프로세서 P2, Core)를 추가했습니다. [Acurast 프로젝트 페이지](/projects/acurast)에서 P1을 조회하면 P1의 등록과 유형만 돌아옵니다. M의 잔액, P2의 온라인 여부, 위임자 D의 스테이킹은 P1 행에 적히지 않습니다. 글자는 라벨이며 온체인 주소가 아닙니다.",
        "## 다음 단계와 한계",
        "주소가 아직 불명확하면 [어떤 주소를 넣을지](/learn/acurast-monitor-guide)로 돌아가세요. 기본 보상과 스테이킹 보상을 나누려면 [보상 범위](/learn/acurast-rewards-settlement)를 여세요. 이 사이트는 관리자의 기기 목록을 읽지 않으며 Hub에서 기기를 대신 추가하지 않습니다.",
      ],
      ja: [
        "Hubで接続したウォレットが管理者です。公式のプロセッサ説明では、その口座でデバイスを追加します。HubがQRを作り、電話の Processor Lite で Connect to Hub を選んで読み取ります。設定後、電話は管理者のデバイス一覧に入りますが、各行は自分の Processor アドレスを持ちます。",
        "公式索引は口座をプロセッサ、管理者、コミッターで絞れます。三つの役割であり、一つの口座の別名ではありません。Acurastのサイトも、自分で電話を動かすことと、ハードウェアがなくステークを委任することを分けています。委任者はステーキング報酬に参加できます。委任アドレスは、その電話のプロセッサ登録ではありません。",
        "## 保存デバイスの数え方",
        "- 見たい電話の Processor を保存します。無料はプロジェクトごとに保存デバイス5台、Proは50台です。",
        "- Hubで管理者ウォレットを開き、電話が三台見えても、ここでは三枠を使いません。",
        "- 三つのプロセッサを三デバイスとして保存すると三枠を使います。",
        "- 保存済みデバイスに同じプロジェクトを再度バインドしても枠は増えません。ウォレット残高が複数行に出ても一つの残高であり、一台の金額を台数倍にはしません。",
        "## 種別の意味",
        "Coreは専用でロックされた電話で、Coreの導入時に工場出荷状態へのリセットが必要です。Liteは日常の電話で動きます。AndroidのLiteは仕事用プロファイルを使い、iOSにもLiteを入れられます。公式の要件は Android 12 以上、iPhone 6s 以降です。これらは導入条件です。ここの種別行は索引の Android / iOS と Core / Lite を繰り返すだけで、OSの版は確認しません。",
        "## 例",
        "説明用です。管理者Mが電話A（プロセッサP1、Lite）と電話B（プロセッサP2、Core）を追加したとします。[Acurastプロジェクトページ](/projects/acurast)でP1を照会すると、P1の登録と種別だけが返ります。Mの残高、P2がオンラインか、委任者DのステークはP1の行には入りません。文字はラベルであり、オンチェーンのアドレスではありません。",
        "## 次と限界",
        "アドレスがまだ不明なら [どのアドレスを入れるか](/learn/acurast-monitor-guide) に戻ってください。基本報酬とステーキング報酬を分けるには [報酬の範囲](/learn/acurast-rewards-settlement) を開きます。当サイトは管理者のデバイス一覧を読まず、Hubでのデバイス追加も代行しません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "我既是管理者，又在自己手机上装了 Lite，要填哪一个？",
          answer:
            "填这台手机设备详情里的 Processor。只有当这个处理器地址和管理钱包是同一把公钥时，两个框里的字符串才会指向同一账户。不要靠钱包名称猜测。",
        },
        {
          question: "委托质押的地址能查出手机吗？",
          answer: "不能。委托是把质押交给计算提供者。手机是否登记，仍要查那台处理器自己的地址。",
        },
        {
          question: "MIST 点数算在管理者还是处理器上？",
          answer:
            "Cloud Rebellion 的 MIST 是任务点数，不是本站显示的主网处理器登记，也不是 ACU 奖励金额。点数记在 Rebellion 活动里，不要和处理器类型栏相加。",
        },
      ],
      "zh-TW": [
        {
          question: "我既是管理者，又在自己手機上裝了 Lite，要填哪一個？",
          answer:
            "填這支手機裝置詳情裡的 Processor。只有當這個處理器地址和管理錢包是同一把公鑰時，兩個框裡的字串才會指向同一帳戶。不要靠錢包名稱猜測。",
        },
        {
          question: "委託質押的地址能查出手機嗎？",
          answer: "不能。委託是把質押交給計算提供者。手機是否登記，仍要查那台處理器自己的地址。",
        },
        {
          question: "MIST 點數算在管理者還是處理器上？",
          answer:
            "Cloud Rebellion 的 MIST 是任務點數，不是本站顯示的主網處理器登記，也不是 ACU 獎勵金額。點數記在 Rebellion 活動裡，不要和處理器類型欄相加。",
        },
      ],
      en: [
        {
          question:
            "I am the manager and I also installed Lite on my phone. Which address do I paste?",
          answer:
            "Paste the Processor from that phone’s device details. The two strings refer to the same account only when they are the same public key. Do not infer that from the wallet name.",
        },
        {
          question: "Can a delegated-stake address look up the phone?",
          answer:
            "No. Delegation assigns stake to a compute provider. Whether the phone is registered is a lookup of that processor’s own address.",
        },
        {
          question: "Do MIST points sit on the manager or the processor?",
          answer:
            "Cloud Rebellion MIST is quest points. It is not the mainnet processor registration shown here and not an ACU reward amount. Keep those points in the Rebellion activity. Do not add them to the processor type line.",
        },
      ],
      ko: [
        {
          question: "관리자이면서 내 휴대폰에 Lite를 설치했습니다. 어느 주소를 넣나요?",
          answer:
            "그 휴대폰 기기 상세의 Processor를 넣으세요. 두 문자열이 같은 공개키일 때만 같은 계정입니다. 지갑 이름으로 추정하지 마세요.",
        },
        {
          question: "위임 스테이킹 주소로 휴대폰을 찾을 수 있나요?",
          answer:
            "없습니다. 위임은 스테이킹을 컴퓨트 제공자에게 맡기는 일입니다. 휴대폰 등록은 그 프로세서 자신의 주소로 조회합니다.",
        },
        {
          question: "MIST 점수는 관리자 것인가요, 프로세서 것인가요?",
          answer:
            "Cloud Rebellion의 MIST는 퀘스트 점수입니다. 여기에 보이는 메인넷 프로세서 등록도, ACU 보상 금액도 아닙니다. 점수는 Rebellion 활동에 두고 프로세서 유형 줄에 더하지 마세요.",
        },
      ],
      ja: [
        {
          question: "管理者でもあり、自分の電話に Lite も入れています。どちらを貼りますか？",
          answer:
            "その電話の機器詳細にある Processor を貼ります。二つの文字列が同じ公開鍵のときだけ同一口座です。ウォレット名から推測しないでください。",
        },
        {
          question: "委任ステークのアドレスで電話を照会できますか？",
          answer:
            "できません。委任はステークをコンピュート提供者に預けることです。電話が登録されているかは、そのプロセッサ自身のアドレスで照会します。",
        },
        {
          question: "MISTポイントは管理者とプロセッサのどちらですか？",
          answer:
            "Cloud RebellionのMISTはクエストのポイントです。ここに出るメインネットのプロセッサ登録でも、ACUの報酬額でもありません。ポイントはRebellionの活動に置き、プロセッサの種別行へ足さないでください。",
        },
      ],
    },
  },
  {
    slug: "acurast-phone-job-status",
    project: "acurast",
    published: "2026-10-24",
    modified: "2026-10-24",
    topic: {
      zh: "手机在跑什么",
      "zh-TW": "手機在跑什麼",
      en: "What the phone is doing",
      ko: "휴대폰이 무엇을 하나",
      ja: "電話が何をしているか",
    },
    title: {
      zh: "Acurast 手机显示已登记，是否代表正在执行部署？",
      "zh-TW": "Acurast 手機顯示已登記，是否代表正在執行部署？",
      en: "Does an Acurast registration mean the phone is running a deployment?",
      ko: "Acurast 등록됨은 휴대폰이 배포를 실행 중이라는 뜻인가요?",
      ja: "Acurastの登録済みは、電話がデプロイを実行中という意味ですか？",
    },
    description: {
      zh: "已登记只说明主网索引里有这台处理器。部署、心跳和基准分要到 Hub 或官方监控里看。本站不把登记写成正在干活。",
      "zh-TW":
        "已登記只說明主網索引裡有這台處理器。部署、心跳和基準分要到 Hub 或官方監控裡看。本站不把登記寫成正在幹活。",
      en: "Registered only means the mainnet index lists that processor. Deployments, heartbeats, and benchmark scores belong in Hub or official monitoring. This site does not rewrite registration as active work.",
      ko: "등록됨은 메인넷 색인에 그 프로세서가 있다는 뜻만 있습니다. 배포, 심박, 벤치마크 점수는 Hub나 공식 모니터링에서 보세요. 이 사이트는 등록을 작업 중으로 바꾸어 쓰지 않습니다.",
      ja: "登録済みはメインネット索引にそのプロセッサがあることだけを示します。デプロイ、ハートビート、ベンチマークはHubまたは公式の監視で確認します。当サイトは登録を稼働中とは書きません。",
    },
    summary: {
      zh: "Acurast 是手机提供计算，不是算力矿机。官方心跳大约每 30 分钟一次。本站查询成功只给出登记和 Core/Lite、Android/iOS 分类，看不到当前部署。",
      "zh-TW":
        "Acurast 是手機提供計算，不是算力礦機。官方心跳大約每 30 分鐘一次。本站查詢成功只給出登記和 Core/Lite、Android/iOS 分類，看不到目前部署。",
      en: "Acurast phones provide compute. They are not hashrate miners. Official heartbeats are about every 30 minutes. A successful lookup here returns registration plus Core/Lite and Android/iOS classification, not the current deployment.",
      ko: "Acurast 휴대폰은 컴퓨트를 제공합니다. 해시레이트 채굴기가 아닙니다. 공식 심박은 약 30분마다입니다. 여기서 조회가 성공하면 등록과 Core/Lite, Android/iOS 분류만 돌아오며 현재 배포는 없습니다.",
      ja: "Acurastの電話はコンピュートを提供します。ハッシュレートのマイナーではありません。公式のハートビートは約30分ごとです。ここの照会成功は登録と Core/Lite、Android/iOS の分類だけで、現在のデプロイは返りません。",
    },
    sources: [sources.processors, sources.rewards, sources.indexer],
    related: ["acurast-monitor-guide", "acurast-processor-offline", "acurast-rewards-settlement"],
    comparisonTitle: {
      zh: "状态各自证明什么",
      "zh-TW": "狀態各自證明什麼",
      en: "What each status proves",
      ko: "상태가 각각 증명하는 것",
      ja: "状態がそれぞれ示すこと",
    },
    comparison: {
      zh: {
        headers: ["信号", "来源", "能说明", "不能说明"],
        rows: [
          [
            "已登记 + 类型",
            "本站主网索引查询",
            "这个地址是处理器，以及可识别的模式",
            "此刻有部署或心跳",
          ],
          [
            "心跳",
            "官方：约每 30 分钟；近期可用 Telegram 监控机器人",
            "链上收到过上报",
            "本站没有这个数字",
          ],
          [
            "本周期有部署执行",
            "官方奖励说明里的 Busy Bonus 条件",
            "该周期第一次成功心跳时检测在执行部署",
            "整段周期的收入金额",
          ],
          [
            "基准分更高",
            "官方：Core 通常比 Lite 高约 15–20%",
            "可能提高基础基准奖励和可承诺的计算",
            "你这台手机的具体分数",
          ],
        ],
      },
      "zh-TW": {
        headers: ["訊號", "來源", "能說明", "不能說明"],
        rows: [
          [
            "已登記 + 類型",
            "本站主網索引查詢",
            "這個地址是處理器，以及可辨識的模式",
            "此刻有部署或心跳",
          ],
          [
            "心跳",
            "官方：約每 30 分鐘；近期可用 Telegram 監控機器人",
            "鏈上收到過上報",
            "本站沒有這個數字",
          ],
          [
            "本週期有部署執行",
            "官方獎勵說明裡的 Busy Bonus 條件",
            "該週期第一次成功心跳時檢測在執行部署",
            "整段週期的收入金額",
          ],
          [
            "基準分更高",
            "官方：Core 通常比 Lite 高約 15–20%",
            "可能提高基礎基準獎勵和可承諾的計算",
            "你這支手機的具體分數",
          ],
        ],
      },
      en: {
        headers: ["Signal", "Source", "It can show", "It cannot show"],
        rows: [
          [
            "Registered + type",
            "This site’s mainnet index lookup",
            "The address is a processor and a recognized mode",
            "A deployment or heartbeat right now",
          ],
          [
            "Heartbeat",
            "Official: about every 30 minutes; recent tracking via the Telegram monitoring bot",
            "A report reached the chain",
            "That count on this site",
          ],
          [
            "Deployment in this epoch",
            "Busy Bonus condition in the official rewards page",
            "A deployment was detected on the epoch’s first successful heartbeat",
            "The epoch’s payout amount",
          ],
          [
            "Higher benchmark",
            "Official: Core often scores about 15–20% above Lite",
            "May raise base benchmark rewards and committable compute",
            "This handset’s actual score",
          ],
        ],
      },
      ko: {
        headers: ["신호", "출처", "보여주는 것", "보여주지 않는 것"],
        rows: [
          [
            "등록됨 + 유형",
            "이 사이트의 메인넷 색인 조회",
            "주소가 프로세서이고 알아볼 수 있는 모드",
            "지금 배포나 심박",
          ],
          [
            "심박",
            "공식: 약 30분마다. 최근 실적은 Telegram 모니터링 봇",
            "체인에 보고가 도착함",
            "이 사이트의 그 횟수",
          ],
          [
            "이번 에폭의 배포 실행",
            "공식 보상 문서의 Busy Bonus 조건",
            "그 에폭의 첫 성공 심박 때 배포 실행이 감지됨",
            "에폭 지급액",
          ],
          [
            "더 높은 벤치마크",
            "공식: Core가 Lite보다 보통 약 15–20% 높음",
            "기본 벤치마크 보상과 약속 가능한 컴퓨트를 올릴 수 있음",
            "이 휴대폰의 실제 점수",
          ],
        ],
      },
      ja: {
        headers: ["信号", "出典", "示せること", "示せないこと"],
        rows: [
          [
            "登録済み + 種別",
            "当サイトのメインネット索引照会",
            "アドレスがプロセッサで、判別できるモード",
            "今のデプロイやハートビート",
          ],
          [
            "ハートビート",
            "公式: 約30分ごと。直近は Telegram の監視ボット",
            "報告がチェーンに届いた",
            "当サイト上のその回数",
          ],
          [
            "このエポックのデプロイ実行",
            "公式報酬説明の Busy Bonus 条件",
            "そのエポックの最初の成功ハートビートで実行が検出された",
            "エポックの支払額",
          ],
          [
            "より高いベンチマーク",
            "公式: CoreはLiteより通常約15–20%高い",
            "基本ベンチマーク報酬とコミットできる計算を上げ得る",
            "この端末の実際の点数",
          ],
        ],
      },
    },
    body: {
      zh: [
        "手机上的 Acurast Processor 是在提供可验证的计算，不是传统工作量证明矿机。官方把 Lite 定义为日常手机、有空时打开；Core 定义为只做 Acurast 的专用锁定手机。应用在运行并且手机连着网时才按官方规则计奖励。本站的「已登记」没有这层含义。",
        "在 [Acurast 项目页](/projects/acurast) 上，成功结果只有两行：主网处理器登记，以及设备类型。类型来自索引里能识别的 Android、iOS、Core、Lite。没有当前部署名称，没有心跳次数，没有基准分数。",
        "## 要看任务时去哪里",
        "- 打开 Hub 的这台设备，确认 Processor 应用处于运行，而不是只曾经安装过。",
        "- 官方说明设备大约每 30 分钟心跳一次。要看最近表现，文档指向 Acurast Monitoring Bot（Telegram）。链上可以逐笔扫心跳，但文档写明那样很慢。",
        "- 奖励页规定：某个周期里，若第一次成功心跳时检测到正在执行部署，基准指标获得 10% 的额外权重，称为 Busy Bonus。它提高该周期在计算池和质押计算池中的计分，不是单独一张“任务工资单”。",
        "- 开发者支付的部署费用在成功执行后销毁。那是网络供给机制，不是你这台手机的入账金额。",
        "## 举例",
        "示意：处理器 P 在本站显示 Android · Lite、已登记。Hub 里这台手机当前没有部署，最近一次心跳停在两小时前。两条可以同时为真：索引仍保留登记，而这一周期可能不满足“正在执行部署”。不要把已登记读成 Busy Bonus 已经加上。此例不是实测记录。",
        "## 接下来与界限",
        "心跳断了是否还可能拿到基准奖励，看 [离线与缺心跳](/learn/acurast-processor-offline)。池子怎么分，看 [奖励范围](/learn/acurast-rewards-settlement)。本站不控制手机上的应用，也不能从登记行推断基准分或部署名称。",
      ],
      "zh-TW": [
        "手機上的 Acurast Processor 是在提供可驗證的計算，不是傳統工作量證明礦機。官方把 Lite 定義為日常手機、有空時打開；Core 定義為只做 Acurast 的專用鎖定手機。應用在執行並且手機連著網時才按官方規則計獎勵。本站的「已登記」沒有這層含義。",
        "在 [Acurast 專案頁](/projects/acurast) 上，成功結果只有兩行：主網處理器登記，以及設備類型。類型來自索引裡能辨識的 Android、iOS、Core、Lite。沒有目前部署名稱，沒有心跳次數，沒有基準分數。",
        "## 要看任務時去哪裡",
        "- 打開 Hub 的這台裝置，確認 Processor 應用處於執行，而不是只曾經安裝過。",
        "- 官方說明裝置大約每 30 分鐘心跳一次。要看最近表現，文件指向 Acurast Monitoring Bot（Telegram）。鏈上可以逐筆掃心跳，但文件寫明那樣很慢。",
        "- 獎勵頁規定：某個週期裡，若第一次成功心跳時檢測到正在執行部署，基準指標獲得 10% 的額外權重，稱為 Busy Bonus。它提高該週期在計算池和質押計算池中的計分，不是單獨一張任務工資單。",
        "- 開發者支付的部署費用在成功執行後銷毀。那是網路供給機制，不是你這支手機的入帳金額。",
        "## 舉例",
        "示意：處理器 P 在本站顯示 Android · Lite、已登記。Hub 裡這支手機目前沒有部署，最近一次心跳停在兩小時前。兩條可以同時為真：索引仍保留登記，而這一週期可能不滿足「正在執行部署」。不要把已登記讀成 Busy Bonus 已經加上。此例不是實測紀錄。",
        "## 接下來與界限",
        "心跳斷了是否還可能拿到基準獎勵，看 [離線與缺心跳](/learn/acurast-processor-offline)。池子怎麼分，看 [獎勵範圍](/learn/acurast-rewards-settlement)。本站不控制手機上的應用，也不能從登記行推斷基準分或部署名稱。",
      ],
      en: [
        "The Acurast Processor on a phone provides verifiable compute. It is not a conventional proof-of-work miner. Official docs define Lite as an everyday phone you activate when you can, and Core as a locked-down phone used only for Acurast. Rewards under those rules require the app to be running and the phone to be online. Registered on this site does not carry that meaning.",
        "On the [Acurast project page](/projects/acurast) a successful result has two lines: mainnet processor registration, and device classification. The type repeats Android, iOS, Core, or Lite when the index recognizes them. There is no deployment name, heartbeat count, or benchmark score.",
        "## Where to look for the job",
        "- Open this device in Hub and confirm the Processor app is running, not merely installed once.",
        "- Official docs say the device heartbeats about every 30 minutes. For recent performance they point to the Acurast Monitoring Bot on Telegram. Scanning every heartbeat on chain is possible and, as the docs say, slow.",
        "- The rewards page states a Busy Bonus: if a deployment is detected executing on the first successful heartbeat of an epoch, benchmark metrics get 10% extra weight. That raises scoring for that epoch in both the compute pool and the staked compute pool. It is not a separate payslip.",
        "- Deployment fees paid by developers are burned after successful execution. That is a supply rule, not the amount credited to your phone.",
        "## Example",
        "Illustration, not a measured case: processor P shows Android · Lite and Registered here. In Hub the phone has no deployment, and the last heartbeat was two hours ago. Both can be true. The index can still list the processor while this epoch may not meet “executing a deployment.” Do not read Registered as Busy Bonus already applied.",
        "## Next step and limit",
        "Whether a missed heartbeat can still leave benchmark rewards, see [offline and missed heartbeats](/learn/acurast-processor-offline). How the pools are split, see [reward scope](/learn/acurast-rewards-settlement). This site does not control the phone app and cannot infer a benchmark score or deployment name from the registration line.",
      ],
      ko: [
        "휴대폰의 Acurast Processor는 검증 가능한 컴퓨트를 제공합니다. 일반적인 작업 증명 채굴기가 아닙니다. 공식 문서는 Lite를 여유가 될 때 켜는 일상 휴대폰으로, Core를 Acurast만 하는 잠긴 전용 휴대폰으로 정의합니다. 그 규칙의 보상은 앱이 실행 중이고 휴대폰이 온라인일 때 적용됩니다. 이 사이트의 등록됨은 그 의미가 아닙니다.",
        "[Acurast 프로젝트 페이지](/projects/acurast)에서 성공 결과는 두 줄입니다. 메인넷 프로세서 등록과 기기 분류입니다. 유형은 색인이 알아볼 때 Android, iOS, Core, Lite를 반복합니다. 배포 이름, 심박 횟수, 벤치마크 점수는 없습니다.",
        "## 작업을 어디서 보나",
        "- Hub에서 이 기기를 열고 Processor 앱이 실행 중인지 확인하세요. 한 번 설치했던 것과는 다릅니다.",
        "- 공식 문서는 기기가 약 30분마다 심박한다고 합니다. 최근 실적은 Telegram의 Acurast Monitoring Bot을 가리킵니다. 체인에서 심박을 모두 훑는 것은 가능하지만, 문서가 말하듯 느립니다.",
        "- 보상 페이지의 Busy Bonus: 어떤 에폭의 첫 성공 심박 때 배포 실행이 감지되면 벤치마크 지표에 10% 추가 가중치가 붙습니다. 그 에폭의 컴퓨트 풀과 스테이킹 컴퓨트 풀 점수를 올립니다. 별도의 급여 명세가 아닙니다.",
        "- 개발자가 낸 배포 비용은 실행 성공 후 소각됩니다. 공급 규칙이지, 내 휴대폰에 입금된 금액이 아닙니다.",
        "## 예시",
        "설명용이며 측정 기록이 아닙니다. 프로세서 P가 여기서 Android · Lite와 등록됨으로 보입니다. Hub에는 배포가 없고 마지막 심박이 두 시간 전입니다. 둘 다 참일 수 있습니다. 색인은 프로세서를 유지하고, 이번 에폭은 「배포 실행 중」을 충족하지 않을 수 있습니다. 등록됨을 Busy Bonus가 이미 적용된 것으로 읽지 마세요.",
        "## 다음 단계와 한계",
        "심박을 놓쳐도 벤치마크 보상이 남을 수 있는지는 [오프라인과 놓친 심박](/learn/acurast-processor-offline)을 보세요. 풀이 어떻게 나뉘는지는 [보상 범위](/learn/acurast-rewards-settlement)를 보세요. 이 사이트는 휴대폰 앱을 제어하지 않으며, 등록 줄에서 벤치마크 점수나 배포 이름을 추론하지 않습니다.",
      ],
      ja: [
        "電話の Acurast Processor は検証できるコンピュートを提供します。一般的なプルーフ・オブ・ワークのマイナーではありません。公式ドキュメントは Lite を、都合のよいときに起動する日常の電話、Core を Acurast 専用にロックした電話と定義します。その規則の報酬は、アプリが動いていて電話がオンラインのときに適用されます。当サイトの登録済みにその意味はありません。",
        "[Acurastプロジェクトページ](/projects/acurast)の成功結果は二行です。メインネットのプロセッサ登録と、機器分類です。種別は索引が判別できるとき Android、iOS、Core、Lite を繰り返します。デプロイ名、ハートビート回数、ベンチマーク点数はありません。",
        "## ジョブをどこで見るか",
        "- Hubでこのデバイスを開き、Processorアプリが実行中かを確認します。一度インストールしたこととは違います。",
        "- 公式ドキュメントは、デバイスが約30分ごとにハートビートすると述べています。直近の様子は Telegram の Acurast Monitoring Bot を示しています。チェーン上のハートビートをすべて辿ることは可能で、ドキュメントが言うとおり時間がかかります。",
        "- 報酬ページの Busy Bonus: あるエポックの最初の成功ハートビートでデプロイ実行が検出されると、ベンチマーク指標に10%の追加ウェイトが付きます。そのエポックのコンピュートプールとステークド・コンピュートプールのスコアを上げます。別の給与明細ではありません。",
        "- 開発者が支払ったデプロイ費用は、実行成功後にバーンされます。供給の規則であり、自分の電話への入金額ではありません。",
        "## 例",
        "説明用であり、測定記録ではありません。プロセッサPがここで Android · Lite と登録済みと出ます。Hubではデプロイがなく、最後のハートビートが二時間前です。両方とも成り立ちます。索引はプロセッサを残し、このエポックは「デプロイ実行中」を満たさないことがあります。登録済みを、Busy Bonus が既に付いたとは読まないでください。",
        "## 次と限界",
        "ハートビートを欠いてもベンチマーク報酬が残るかは [オフラインと欠測](/learn/acurast-processor-offline) を見てください。プールの分け方は [報酬の範囲](/learn/acurast-rewards-settlement) です。当サイトは電話アプリを制御せず、登録行からベンチマーク点数やデプロイ名は推測しません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "为什么类型是 Lite，Hub 里却看不到正在跑的部署？",
          answer:
            "Lite 表示安装模式，不是任务开关。官方允许在日常手机上有空时才提供计算。没有部署时，登记仍然可以留在主网索引里。",
        },
        {
          question: "Busy Bonus 的 10% 是不是多发 10% 的 ACU？",
          answer:
            "官方写的是基准指标额外 10% 权重，用来提高该周期两个池子里的计分。不是在你的余额上固定加一成，本站也不计算这笔金额。",
        },
        {
          question: "四类基准池的名字在本站能看到吗？",
          answer:
            "不能。奖励页说明基准奖励会分到四个基准池，手机在各池中相互竞争。具体池名称和你的分数要以 Hub 与官方基准说明为准，不要用类型栏代替。",
        },
      ],
      "zh-TW": [
        {
          question: "為什麼類型是 Lite，Hub 裡卻看不到正在跑的部署？",
          answer:
            "Lite 表示安裝模式，不是任務開關。官方允許在日常手機上有空時才提供計算。沒有部署時，登記仍然可以留在主網索引裡。",
        },
        {
          question: "Busy Bonus 的 10% 是不是多發 10% 的 ACU？",
          answer:
            "官方寫的是基準指標額外 10% 權重，用來提高該週期兩個池子裡的計分。不是在你的餘額上固定加一成，本站也不計算這筆金額。",
        },
        {
          question: "四類基準池的名字在本站能看到嗎？",
          answer:
            "不能。獎勵頁說明基準獎勵會分到四個基準池，手機在各池中相互競爭。具體池名稱和你的分數要以 Hub 與官方基準說明為準，不要用類型欄代替。",
        },
      ],
      en: [
        {
          question: "The type says Lite, but Hub shows no running deployment. Why?",
          answer:
            "Lite is the install mode, not a job switch. Official docs allow an everyday phone to provide compute only when it is convenient. The mainnet index can still list the processor when no deployment is running.",
        },
        {
          question: "Does the Busy Bonus 10% mean 10% more ACU?",
          answer:
            "The rewards page describes 10% extra weight on benchmark metrics, which raises scoring in both pools for that epoch. It is not a flat 10% added to your balance. This site does not compute that amount.",
        },
        {
          question: "Can I see the four benchmark pool names here?",
          answer:
            "No. The rewards page says base rewards are split across four benchmark pools and phones compete inside them. Pool names and your scores stay in Hub and the official benchmark material. Do not substitute the type line.",
        },
      ],
      ko: [
        {
          question: "유형이 Lite인데 Hub에 실행 중인 배포가 없습니다. 왜죠?",
          answer:
            "Lite는 설치 모드이지 작업 스위치가 아닙니다. 공식 문서는 일상 휴대폰이 가능할 때만 컴퓨트를 제공해도 된다고 합니다. 배포가 없어도 메인넷 색인에 프로세서가 남을 수 있습니다.",
        },
        {
          question: "Busy Bonus 10%는 ACU가 10% 더 온다는 뜻인가요?",
          answer:
            "보상 페이지는 벤치마크 지표에 10% 추가 가중치를 붙여 그 에폭의 두 풀 점수를 올린다고 합니다. 잔액에 고정 10%를 더하는 것이 아닙니다. 이 사이트는 그 금액을 계산하지 않습니다.",
        },
        {
          question: "네 개 벤치마크 풀 이름을 여기서 볼 수 있나요?",
          answer:
            "없습니다. 보상 페이지는 기본 보상이 네 벤치마크 풀로 나뉘고 휴대폰이 풀 안에서 경쟁한다고 합니다. 풀 이름과 점수는 Hub와 공식 벤치마크 자료를 보세요. 유형 줄로 대체하지 마세요.",
        },
      ],
      ja: [
        {
          question: "種別が Lite なのに、Hubに実行中のデプロイがありません。なぜですか？",
          answer:
            "Liteは導入モードであり、ジョブのスイッチではありません。公式ドキュメントは、日常の電話では都合のよいときにコンピュートを提供できるとしています。デプロイがなくてもメインネット索引にプロセッサは残り得ます。",
        },
        {
          question: "Busy Bonusの10%はACUが10%増える意味ですか？",
          answer:
            "報酬ページは、ベンチマーク指標へ10%の追加ウェイトを付け、そのエポックの二つのプールのスコアを上げると書いています。残高へ一律10%を足すものではありません。当サイトはその金額を計算しません。",
        },
        {
          question: "四つのベンチマークプール名はここで見られますか？",
          answer:
            "見られません。報酬ページは、基本報酬が四つのベンチマークプールに分かれ、電話がその中で競うと述べています。プール名と点数はHubと公式のベンチマーク資料を見てください。種別行で代用しないでください。",
        },
      ],
    },
  },
  {
    slug: "acurast-rewards-settlement",
    project: "acurast",
    published: "2026-10-24",
    modified: "2026-10-24",
    topic: {
      zh: "奖励记在哪",
      "zh-TW": "獎勵記在哪",
      en: "Where rewards are assigned",
      ko: "보상이 어디에 잡히나",
      ja: "報酬はどこに付くか",
    },
    title: {
      zh: "Acurast 的 ACU 奖励按什么周期结算，本站为什么不显示金额？",
      "zh-TW": "Acurast 的 ACU 獎勵按什麼週期結算，本站為什麼不顯示金額？",
      en: "On what cycle are Acurast ACU rewards assigned, and why is there no amount here?",
      ko: "Acurast ACU 보상은 어떤 주기로 배분되며, 여기에는 왜 금액이 없나요?",
      ja: "AcurastのACU報酬はどの周期で割り当てられ、ここではなぜ金額が出ませんか？",
    },
    description: {
      zh: "官方按约 90 分钟的周期发放基础基准奖励和质押奖励。主网与 Canary 代币不同。本站不读取这些金额，查不到时也不会显示 0。",
      "zh-TW":
        "官方按約 90 分鐘的週期發放基礎基準獎勵和質押獎勵。主網與 Canary 代幣不同。本站不讀取這些金額，查不到時也不會顯示 0。",
      en: "Official base benchmark rewards and staking rewards are assigned about every 90 minutes. Mainnet and Canary tokens differ. This site does not read those amounts, and a missing figure is not shown as zero.",
      ko: "공식 기본 벤치마크 보상과 스테이킹 보상은 약 90분마다 배분됩니다. 메인넷과 Canary 토큰은 다릅니다. 이 사이트는 그 금액을 읽지 않으며, 없는 숫자를 0으로 보이지 않습니다.",
      ja: "公式の基本ベンチマーク報酬とステーキング報酬は約90分ごとに割り当てられます。メインネットとCanaryのトークンは別です。当サイトはその金額を読まず、無い数字を0とは表示しません。",
    },
    summary: {
      zh: "基础奖励来自通胀的 10%，与是否参加质押计算无关；质押奖励来自另外 70%。两者都按周期、按基准池和质押条件分配。本站的 Acurast 页只有登记和类型，没有今日或累计 ACU。",
      "zh-TW":
        "基礎獎勵來自通膨的 10%，與是否參加質押計算無關；質押獎勵來自另外 70%。兩者都按週期、按基準池和質押條件分配。本站的 Acurast 頁只有登記和類型，沒有今日或累計 ACU。",
      en: "Base rewards are 10% of inflation and do not depend on joining staked compute. Staking rewards are a separate 70%. Both are assigned per epoch, by benchmark pools and staking terms. The Acurast page here shows registration and type only, not today’s or lifetime ACU.",
      ko: "기본 보상은 인플레이션의 10%이며 스테이킹 컴퓨트 참여와 무관합니다. 스테이킹 보상은 별도의 70%입니다. 둘 다 에폭마다, 벤치마크 풀과 스테이킹 조건으로 배분됩니다. 여기 Acurast 페이지는 등록과 유형만 있으며 오늘 또는 누적 ACU는 없습니다.",
      ja: "基本報酬はインフレの10%で、ステークド・コンピュートへの参加とは無関係です。ステーキング報酬は別の70%です。どちらもエポックごと、ベンチマークプールとステーク条件で割り当てられます。ここのAcurastページは登録と種別だけで、当日や累計のACUはありません。",
    },
    sources: [sources.rewards, sources.processors, sources.home],
    related: [
      "acurast-phone-job-status",
      "acurast-processor-owner-identity",
      "acurast-processor-offline",
    ],
    comparisonTitle: {
      zh: "几种“奖励”不要加在一起",
      "zh-TW": "幾種「獎勵」不要加在一起",
      en: "Do not add these “rewards” together",
      ko: "이 ‘보상’들을 더하지 마세요",
      ja: "これらの「報酬」を足さない",
    },
    comparison: {
      zh: {
        headers: ["名称", "官方怎么描述", "能否在本站当成一笔收益"],
        rows: [
          [
            "基础基准奖励",
            "每周期通胀的 10%，主网写明每周期 856.164 ACU，再分进四个基准池",
            "不能。本站不显示份额",
          ],
          [
            "质押奖励",
            "每周期通胀的 70%；页面写每周期 5993.15 枚，并按性能、质押规模和承诺时长分配",
            "不能。委托和自营也不在此相加",
          ],
          ["Busy Bonus", "该周期在执行部署则基准权重 +10%", "不能。它改变计分权重"],
          ["MIST", "Cloud Rebellion 的任务点数", "不能。点数不是 ACU"],
          ["余额变少", "上报交易费，文档称通常约每笔 0.0013 ACU", "不是负收益字段；本站不显示余额"],
        ],
      },
      "zh-TW": {
        headers: ["名稱", "官方怎麼描述", "能否在本站當成一筆收益"],
        rows: [
          [
            "基礎基準獎勵",
            "每週期通膨的 10%，主網寫明每週期 856.164 ACU，再分進四個基準池",
            "不能。本站不顯示份額",
          ],
          [
            "質押獎勵",
            "每週期通膨的 70%；頁面寫每週期 5993.15 枚，並按性能、質押規模和承諾時長分配",
            "不能。委託和自營也不在此相加",
          ],
          ["Busy Bonus", "該週期在執行部署則基準權重 +10%", "不能。它改變計分權重"],
          ["MIST", "Cloud Rebellion 的任務點數", "不能。點數不是 ACU"],
          ["餘額變少", "上報交易費，文件稱通常約每筆 0.0013 ACU", "不是負收益欄位；本站不顯示餘額"],
        ],
      },
      en: {
        headers: ["Name", "Official description", "Shown here as earnings?"],
        rows: [
          [
            "Base benchmark rewards",
            "10% of inflation each epoch; mainnet figure stated as 856.164 ACU, then split across four benchmark pools",
            "No share is shown",
          ],
          [
            "Staking rewards",
            "70% of inflation each epoch; the page states 5993.15 tokens, split by performance, stake size, and commitment length",
            "No. Self-run and delegated stake are not summed here",
          ],
          [
            "Busy Bonus",
            "Benchmark weight +10% when a deployment is executing that epoch",
            "No. It changes score weight",
          ],
          ["MIST", "Cloud Rebellion quest points", "No. Points are not ACU"],
          [
            "A smaller balance",
            "Report fees, described as usually about 0.0013 ACU per transaction",
            "Not a negative-earnings field; balance is not shown",
          ],
        ],
      },
      ko: {
        headers: ["이름", "공식 설명", "여기서 수익으로 보나"],
        rows: [
          [
            "기본 벤치마크 보상",
            "에폭마다 인플레이션의 10%. 메인넷은 에폭당 856.164 ACU로 적은 뒤 네 벤치마크 풀로 나눔",
            "지분은 표시하지 않음",
          ],
          [
            "스테이킹 보상",
            "에폭마다 인플레이션의 70%. 페이지는 에폭당 5993.15개이며 성능, 스테이크 규모, 약속 기간으로 나눔",
            "아님. 직접 운영과 위임을 여기서 합산하지 않음",
          ],
          [
            "Busy Bonus",
            "그 에폭에 배포를 실행하면 벤치마크 가중치 +10%",
            "아님. 점수 가중치를 바꿈",
          ],
          ["MIST", "Cloud Rebellion 퀘스트 점수", "아님. 점수는 ACU가 아님"],
          [
            "잔액 감소",
            "보고 수수료. 문서는 보통 거래당 약 0.0013 ACU",
            "마이너스 수익 필드가 아님. 잔액은 표시하지 않음",
          ],
        ],
      },
      ja: {
        headers: ["名前", "公式の説明", "ここで収益として出すか"],
        rows: [
          [
            "基本ベンチマーク報酬",
            "エポックごとのインフレの10%。メインネットはエポックあたり856.164 ACUと書かれ、四つのベンチマークプールへ分かれる",
            "シェアは出さない",
          ],
          [
            "ステーキング報酬",
            "エポックごとのインフレの70%。ページはエポックあたり5993.15枚とし、性能、ステーク規模、コミット期間で配分",
            "出さない。自己運用と委任はここでは合算しない",
          ],
          [
            "Busy Bonus",
            "そのエポックでデプロイ実行中ならベンチマークウェイト +10%",
            "出さない。スコアのウェイトを変える",
          ],
          ["MIST", "Cloud Rebellionのクエストポイント", "出さない。ポイントはACUではない"],
          [
            "残高の減少",
            "報告の手数料。ドキュメントは通常1件あたり約0.0013 ACU",
            "マイナス収益の項目ではない。残高は出さない",
          ],
        ],
      },
    },
    body: {
      zh: [
        "官方奖励页把发放周期写成 900 个区块，大约 1.5 小时，和处理器说明里“大约 90 分钟”是同一档周期。基础基准奖励占通胀的 10%，参加或不参加质押计算都会进入这一池。页面给出的主网数字是每周期 856.164 ACU，即所写 8,561.64 ACU 的 10%。Canary 对应写成每周期 85.62 cACU。ACU 与 cACU 不能相加。",
        "质押奖励是另外 70%。同一页写每周期 5,993.15 枚，并说明按硬件表现、质押规模和承诺时长分配。这个总数是全网该池的周期额度，不是某一台手机的应得。官网还说明没有手机的人可以把质押委托给计算提供者。委托收益和处理器自己的基础奖励是两条线。",
        "## 本站现在显示什么",
        "- [Acurast 项目页](/projects/acurast) 只确认主网处理器登记和类型。",
        "- 没有“今日 ACU”、没有周期份额、没有质押奖励、没有余额。读不到这些数时保持空缺或不可用，不会用 0 填充。",
        "- 免费每个项目 5 台已保存设备、Pro 50 台，限制的是你保存的设备条数。把同一处理器地址再查一次，不会把奖励复制一份，因为这里根本不展示奖励金额。",
        "## 举例",
        "示意，不是收入预测：主网一个周期的基础池总额按官方页面为 856.164 ACU，由全部参与手机在四个基准池里分配。处理器 P 即使已登记，本站也不会显示 P 分到其中多少。若 P 同时做了质押，质押池的 5,993.15 这一全网周期数字也不能直接写成 P 的入账。MIST 点数另计，不换算成 ACU。",
        "## 接下来与界限",
        "先用 [地址说明](/learn/acurast-monitor-guide) 确认查的是处理器而不是管理者钱包，再用 [任务状态](/learn/acurast-phone-job-status) 理解 Busy Bonus 只改权重。个人份额、到账时间和手续费明细以 Hub 与官方奖励页为准。本站不承诺收益，也不把全网周期总额除以某个手机数量。",
      ],
      "zh-TW": [
        "官方獎勵頁把發放週期寫成 900 個區塊，大約 1.5 小時，和處理器說明裡「大約 90 分鐘」是同一檔週期。基礎基準獎勵占通膨的 10%，參加或不參加質押計算都會進入這一池。頁面給出的主網數字是每週期 856.164 ACU，即所寫 8,561.64 ACU 的 10%。Canary 對應寫成每週期 85.62 cACU。ACU 與 cACU 不能相加。",
        "質押獎勵是另外 70%。同一頁寫每週期 5,993.15 枚，並說明按硬體表現、質押規模和承諾時長分配。這個總數是全網該池的週期額度，不是某一支手機的應得。官網還說明沒有手機的人可以把質押委託給計算提供者。委託收益和處理器自己的基礎獎勵是兩條線。",
        "## 本站現在顯示什麼",
        "- [Acurast 專案頁](/projects/acurast) 只確認主網處理器登記和類型。",
        "- 沒有「今日 ACU」、沒有週期份額、沒有質押獎勵、沒有餘額。讀不到這些數時保持空缺或無法取得，不會用 0 填充。",
        "- 免費每個專案 5 台已儲存裝置、Pro 50 台，限制的是你儲存的裝置筆數。把同一個處理器地址再查一次，不會把獎勵複製一份，因為這裡根本不展示獎勵金額。",
        "## 舉例",
        "示意，不是收入預測：主網一個週期的基礎池總額按官方頁面為 856.164 ACU，由全部參與手機在四個基準池裡分配。處理器 P 即使已登記，本站也不會顯示 P 分到其中多少。若 P 同時做了質押，質押池的 5,993.15 這一全網週期數字也不能直接寫成 P 的入帳。MIST 點數另計，不換算成 ACU。",
        "## 接下來與界限",
        "先用 [地址說明](/learn/acurast-monitor-guide) 確認查的是處理器而不是管理者錢包，再用 [任務狀態](/learn/acurast-phone-job-status) 理解 Busy Bonus 只改權重。個人份額、到帳時間和手續費明細以 Hub 與官方獎勵頁為準。本站不承諾收益，也不把全網週期總額除以某個手機數量。",
      ],
      en: [
        "The official rewards page sets the assignment cycle at 900 blocks, about 1.5 hours. That matches the processor docs’ “about 90 minutes.” Base benchmark rewards are 10% of inflation and are paid whether or not the provider joins staked compute. The page states 856.164 ACU per epoch on mainnet, 10% of the stated 8,561.64 ACU, and 85.62 cACU per epoch on Canary. Do not add ACU and cACU.",
        "Staking rewards are a separate 70%. The same page states 5,993.15 tokens per epoch, assigned by hardware performance, stake size, and commitment length. That figure is the pool’s epoch amount for the network, not one phone’s entitlement. The public site also says people without hardware can delegate stake to compute providers. Delegated rewards and a processor’s base rewards are separate lines.",
        "## What this site shows",
        "- The [Acurast project page](/projects/acurast) confirms mainnet processor registration and type only.",
        "- There is no “ACU today,” no epoch share, no staking reward, and no balance. Missing figures stay blank or unavailable. They are not filled with zero.",
        "- Free allows five saved devices per project and Pro allows 50. The limit counts saved device records. Looking up the same processor again does not duplicate a reward, because no reward amount is displayed.",
        "## Example",
        "Illustration, not an income forecast: the official page states a mainnet base-pool total of 856.164 ACU for one epoch, shared by participating phones across four benchmark pools. If processor P is Registered, this site still does not show P’s slice. If P also stakes, the network figure 5,993.15 is still not P’s credit. MIST points stay in their own count and are not converted to ACU.",
        "## Next step and limit",
        "Use [which address to enter](/learn/acurast-monitor-guide) so the lookup is the processor, not the manager wallet. Use [job status](/learn/acurast-phone-job-status) for why Busy Bonus only changes weight. Personal share, credit time, and fee lines stay in Hub and the official rewards page. This site does not promise earnings and does not divide a network epoch total by a phone count.",
      ],
      ko: [
        "공식 보상 페이지는 배분 주기를 900블록, 약 1.5시간으로 적습니다. 프로세서 문서의 「약 90분」과 같은 주기입니다. 기본 벤치마크 보상은 인플레이션의 10%이며, 스테이킹 컴퓨트에 참여하든 하지 않든 이 풀로 들어갑니다. 페이지는 메인넷 에폭당 856.164 ACU, 즉 적힌 8,561.64 ACU의 10%와, Canary 에폭당 85.62 cACU를 적습니다. ACU와 cACU는 더하지 않습니다.",
        "스테이킹 보상은 별도의 70%입니다. 같은 페이지는 에폭당 5,993.15개이며, 하드웨어 성능, 스테이크 규모, 약속 기간으로 나눈다고 합니다. 이 합계는 그 풀의 네트워크 에폭 한도이지 휴대폰 하나의 몫이 아닙니다. 공개 사이트는 하드웨어가 없는 사람도 컴퓨트 제공자에게 스테이킹을 위임할 수 있다고 합니다. 위임 수익과 프로세서의 기본 보상은 별도 줄입니다.",
        "## 이 사이트가 보여주는 것",
        "- [Acurast 프로젝트 페이지](/projects/acurast)는 메인넷 프로세서 등록과 유형만 확인합니다.",
        "- 「오늘 ACU」, 에폭 지분, 스테이킹 보상, 잔액은 없습니다. 없는 숫자는 빈칸이거나 사용 불가입니다. 0으로 채우지 않습니다.",
        "- 무료는 프로젝트마다 저장 장치 5대, Pro는 50대입니다. 한도는 저장한 장치 기록 수입니다. 같은 프로세서를 다시 조회해도 보상이 복제되지 않습니다. 보상 금액을 표시하지 않기 때문입니다.",
        "## 예시",
        "설명용이며 수입 예측이 아닙니다. 공식 페이지의 메인넷 기본 풀 합계는 한 에폭 856.164 ACU이고, 참여 휴대폰이 네 벤치마크 풀에서 나눕니다. 프로세서 P가 등록됨이어도 여기서 P의 몫은 나오지 않습니다. P가 스테이킹을 해도 네트워크 숫자 5,993.15는 P의 입금이 아닙니다. MIST 점수는 따로 두며 ACU로 환산하지 않습니다.",
        "## 다음 단계와 한계",
        "[어떤 주소를 넣을지](/learn/acurast-monitor-guide)로 조회가 관리 지갑이 아니라 프로세서인지 확인하세요. Busy Bonus가 가중치만 바꾸는 이유는 [작업 상태](/learn/acurast-phone-job-status)를 보세요. 개인 몫, 입금 시각, 수수료 내역은 Hub와 공식 보상 페이지를 기준으로 합니다. 이 사이트는 수익을 약속하지 않으며, 네트워크 에폭 합계를 휴대폰 수로 나누지 않습니다.",
      ],
      ja: [
        "公式の報酬ページは、配分周期を900ブロック、約1.5時間としています。プロセッサ説明の「約90分」と同じ周期です。基本ベンチマーク報酬はインフレの10%で、ステークド・コンピュートに参加してもしなくてもこのプールに入ります。ページはメインネットでエポックあたり856.164 ACU、すなわち記載の8,561.64 ACUの10%、Canaryではエポックあたり85.62 cACUとしています。ACUとcACUは足しません。",
        "ステーキング報酬は別の70%です。同じページはエポックあたり5,993.15枚とし、ハードウェア性能、ステーク規模、コミット期間で配分すると述べています。この合計はそのプールのネットワーク全体のエポック枠であり、一台の電話の受取額ではありません。公開サイトは、ハードウェアがない人もコンピュート提供者へステークを委任できるとしています。委任の報酬とプロセッサ自身の基本報酬は別の行です。",
        "## 当サイトが表示するもの",
        "- [Acurastプロジェクトページ](/projects/acurast)はメインネットのプロセッサ登録と種別だけを確認します。",
        "- 「今日のACU」、エポックのシェア、ステーキング報酬、残高はありません。無い数字は空欄または取得不可のままです。0では埋めません。",
        "- 無料はプロジェクトごとに保存デバイス5台、Proは50台です。上限は保存したデバイス記録の数です。同じプロセッサを再照会しても報酬は複製されません。報酬額を出していないためです。",
        "## 例",
        "説明用であり、収入の予測ではありません。公式ページのメインネット基本プール合計は1エポック856.164 ACUで、参加する電話が四つのベンチマークプールで分けます。プロセッサPが登録済みでも、ここではPの取り分は出ません。Pがステークしていても、ネットワークの数字5,993.15はPの入金ではありません。MISTポイントは別に置き、ACUへ換算しません。",
        "## 次と限界",
        "[どのアドレスを入れるか](/learn/acurast-monitor-guide)で、照会先が管理者ウォレットではなくプロセッサであることを確認します。Busy Bonusがウェイトだけを変える理由は [ジョブ状態](/learn/acurast-phone-job-status) です。個人のシェア、入金時刻、手数料の明細はHubと公式報酬ページを基準にしてください。当サイトは収益を約束せず、ネットワークのエポック合計を電話の台数で割りません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "856.164 ACU 是我每 90 分钟能拿到的吗？",
          answer:
            "不是。那是官方奖励页写的主网基础基准奖励全池每周期总额，还要分进四个基准池，由参与的手机竞争。本站不计算你的份额。",
        },
        {
          question: "Canary 上的 cACU 会出现在主网查询里吗？",
          answer:
            "不会。本站查询的是主网处理器登记。Canary 余额使用 cACU，不能和主网 ACU 记成同一笔。",
        },
        {
          question: "余额偶尔下降是被扣了奖励吗？",
          answer:
            "官方说明处理器上报心跳、确认部署或提交执行报告时会付很少的交易费，通常大约每笔 0.0013 ACU，所以余额可能略降。那不是本站上的一条负收益，这里也不显示余额。",
        },
      ],
      "zh-TW": [
        {
          question: "856.164 ACU 是我每 90 分鐘能拿到的嗎？",
          answer:
            "不是。那是官方獎勵頁寫的主網基礎基準獎勵全池每週期總額，還要分進四個基準池，由參與的手機競爭。本站不計算你的份額。",
        },
        {
          question: "Canary 上的 cACU 會出現在主網查詢裡嗎？",
          answer:
            "不會。本站查詢的是主網處理器登記。Canary 餘額使用 cACU，不能和主網 ACU 記成同一筆。",
        },
        {
          question: "餘額偶爾下降是被扣了獎勵嗎？",
          answer:
            "官方說明處理器上報心跳、確認部署或提交執行報告時會付很少的交易費，通常大約每筆 0.0013 ACU，所以餘額可能略降。那不是本站上的一條負收益，這裡也不顯示餘額。",
        },
      ],
      en: [
        {
          question: "Is 856.164 ACU what I receive every 90 minutes?",
          answer:
            "No. That is the mainnet base-benchmark pool total per epoch on the official rewards page. It is then split across four benchmark pools and contested by participating phones. This site does not compute your share.",
        },
        {
          question: "Will Canary cACU appear on a mainnet lookup?",
          answer:
            "No. This lookup is mainnet processor registration. Canary balances are cACU and are not the same line as mainnet ACU.",
        },
        {
          question: "If the balance dips, were rewards clawed back?",
          answer:
            "Official docs say heartbeats, deployment acknowledgements, and execution reports pay a small transaction fee, usually about 0.0013 ACU, so the balance can fall slightly. That is not a negative-earnings row here, and balance is not shown.",
        },
      ],
      ko: [
        {
          question: "856.164 ACU는 제가 90분마다 받는 금액인가요?",
          answer:
            "아닙니다. 공식 보상 페이지에 적힌 메인넷 기본 벤치마크 풀의 에폭 합계입니다. 이후 네 벤치마크 풀로 나뉘고 참여 휴대폰이 경쟁합니다. 이 사이트는 내 몫을 계산하지 않습니다.",
        },
        {
          question: "Canary의 cACU가 메인넷 조회에 나오나요?",
          answer:
            "나오지 않습니다. 이 조회는 메인넷 프로세서 등록입니다. Canary 잔액은 cACU이며 메인넷 ACU와 같은 줄이 아닙니다.",
        },
        {
          question: "잔액이 조금 줄면 보상을 환수당한 건가요?",
          answer:
            "공식 문서는 심박, 배포 확인, 실행 보고에 적은 거래 수수료가 들고 보통 약 0.0013 ACU라고 합니다. 그래서 잔액이 약간 줄 수 있습니다. 여기서의 마이너스 수익 행이 아니며, 잔액도 표시하지 않습니다.",
        },
      ],
      ja: [
        {
          question: "856.164 ACUは、90分ごとに自分が受け取る額ですか？",
          answer:
            "違います。公式報酬ページに書かれた、メインネット基本ベンチマークプールのエポック合計です。その後四つのベンチマークプールに分かれ、参加する電話が競います。当サイトは自分のシェアを計算しません。",
        },
        {
          question: "CanaryのcACUはメインネット照会に出ますか？",
          answer:
            "出ません。この照会はメインネットのプロセッサ登録です。Canaryの残高はcACUで、メインネットACUと同じ行ではありません。",
        },
        {
          question: "残高が少し減ったら、報酬を取り戻されたのですか？",
          answer:
            "公式ドキュメントは、ハートビート、デプロイ確認、実行報告で少ない取引手数料がかかり、通常約0.0013 ACUだとしています。そのため残高はわずかに減り得ます。ここでのマイナス収益の行ではなく、残高も表示しません。",
        },
      ],
    },
  },
  {
    slug: "acurast-processor-offline",
    project: "acurast",
    published: "2026-10-24",
    modified: "2026-10-24",
    topic: {
      zh: "手机像是停了",
      "zh-TW": "手機像是停了",
      en: "The phone looks stopped",
      ko: "휴대폰이 멈춘 것처럼 보일 때",
      ja: "電話が止まって見えるとき",
    },
    title: {
      zh: "Acurast 手机离线或漏了心跳，登记为什么还在？",
      "zh-TW": "Acurast 手機離線或漏了心跳，登記為什麼還在？",
      en: "Why does Acurast registration remain when the phone is offline or missed heartbeats?",
      ko: "Acurast 휴대폰이 오프라인이거나 심박을 놓쳐도 등록은 왜 남나요?",
      ja: "Acurastの電話がオフライン、またはハートビートを欠いても登録はなぜ残りますか？",
    },
    description: {
      zh: "主网登记可以在手机关机后仍然存在。官方允许一个周期三次心跳里成功一次仍发放基准奖励。本站没有在线或离线状态。",
      "zh-TW":
        "主網登記可以在手機關機後仍然存在。官方允許一個週期三次心跳裡成功一次仍發放基準獎勵。本站沒有在線或離線狀態。",
      en: "Mainnet registration can remain after the phone is off. Official rules can still assign benchmark rewards if one of three heartbeats in an epoch succeeds. This site has no online or offline state.",
      ko: "메인넷 등록은 휴대폰이 꺼진 뒤에도 남을 수 있습니다. 공식 규칙은 한 에폭의 심박 세 번 중 한 번만 성공해도 벤치마크 보상을 배분할 수 있습니다. 이 사이트에는 온라인·오프라인 상태가 없습니다.",
      ja: "メインネット登録は電話の電源を切った後も残り得ます。公式の規則では、一つのエポックで三回のハートビートのうち一回成功すればベンチマーク報酬を割り当て得ます。当サイトにオンライン／オフライン状態はありません。",
    },
    summary: {
      zh: "本站结果一直写「已登记」，不会因为心跳变老而改成离线。判断手机是否还在上报，要看 Hub、应用是否在跑，以及官方所说的 30 分钟心跳和每周期三次机会。",
      "zh-TW":
        "本站結果一直寫「已登記」，不會因為心跳變舊而改成離線。判斷手機是否還在上報，要看 Hub、應用是否在跑，以及官方所說的 30 分鐘心跳和每週期三次機會。",
      en: "The result here stays Registered. It does not flip to offline because a heartbeat aged. To see whether the phone is still reporting, use Hub, whether the app is running, and the official 30-minute heartbeat with three chances per epoch.",
      ko: "여기 결과는 계속 등록됨입니다. 심박이 오래되었다고 오프라인으로 바뀌지 않습니다. 휴대폰이 아직 보고하는지는 Hub, 앱 실행 여부, 공식의 30분 심박과 에폭당 세 번의 기회로 보세요.",
      ja: "ここの結果は登録済みのままです。ハートビートが古くなったからオフラインには変わりません。電話がまだ報告しているかは、Hub、アプリが動いているか、公式の30分ハートビートとエポックあたり三回の機会で判断します。",
    },
    sources: [sources.processors, sources.rewards, sources.indexer],
    related: ["acurast-phone-job-status", "acurast-monitor-guide", "acurast-rewards-settlement"],
    comparisonTitle: {
      zh: "离线时先分清三件事",
      "zh-TW": "離線時先分清三件事",
      en: "Separate three facts when the phone seems down",
      ko: "멈춘 것처럼 보일 때 세 가지를 나누세요",
      ja: "止まって見えるとき三つの事実を分ける",
    },
    comparison: {
      zh: {
        headers: ["现象", "更可能说明", "下一步"],
        rows: [
          ["本站仍是已登记", "主网索引里还有这条处理器", "不要把它当成在线指示灯"],
          [
            "本站变为不可用",
            "地址不是主网处理器，或索引这次没有返回",
            "核对是不是管理者、Canary，或稍后再查",
          ],
          [
            "一个周期只成功一次心跳",
            "官方：三次中有一次上链即可发基准奖励",
            "缺一两次不等于该周期基准奖励一定没有",
          ],
          [
            "三次都没有",
            "该周期基准奖励条件未满足",
            "到 Hub 或 Telegram 监控机器人看最近心跳，而不是把登记清零",
          ],
          ["余额略降", "上报手续费，通常约 0.0013 ACU", "不是离线证明"],
        ],
      },
      "zh-TW": {
        headers: ["現象", "更可能說明", "下一步"],
        rows: [
          ["本站仍是已登記", "主網索引裡還有這筆處理器", "不要把它當成在線指示燈"],
          [
            "本站變為無法取得",
            "地址不是主網處理器，或索引這次沒有返回",
            "核對是不是管理者、Canary，或稍後再查",
          ],
          [
            "一個週期只成功一次心跳",
            "官方：三次中有一次上鏈即可發基準獎勵",
            "缺一兩次不等於該週期基準獎勵一定沒有",
          ],
          [
            "三次都沒有",
            "該週期基準獎勵條件未滿足",
            "到 Hub 或 Telegram 監控機器人看最近心跳，而不是把登記清零",
          ],
          ["餘額略降", "上報手續費，通常約 0.0013 ACU", "不是離線證明"],
        ],
      },
      en: {
        headers: ["What you see", "What it more likely means", "Next check"],
        rows: [
          [
            "Still Registered here",
            "The mainnet index still lists this processor",
            "Do not treat it as an online lamp",
          ],
          [
            "Unavailable here",
            "The address is not a mainnet processor, or the index returned nothing this time",
            "Check manager vs Canary, or look again later",
          ],
          [
            "One heartbeat succeeded in the epoch",
            "Official rule: one of three on chain still assigns benchmark rewards",
            "Missing one or two does not by itself cancel that epoch’s benchmark rewards",
          ],
          [
            "None of the three arrived",
            "That epoch’s benchmark-reward condition was not met",
            "Check recent heartbeats in Hub or the Telegram monitoring bot; do not clear registration",
          ],
          [
            "Balance dipped slightly",
            "Report fees, usually about 0.0013 ACU",
            "Not proof the phone is offline",
          ],
        ],
      },
      ko: {
        headers: ["보이는 것", "더 그럴듯한 의미", "다음 확인"],
        rows: [
          [
            "여기 그대로 등록됨",
            "메인넷 색인에 이 프로세서가 아직 있음",
            "온라인 표시등으로 보지 않음",
          ],
          [
            "여기서 사용 불가",
            "주소가 메인넷 프로세서가 아니거나, 이번에 색인이 아무것도 안 줌",
            "관리자·Canary를 확인하거나 나중에 다시 조회",
          ],
          [
            "에폭에 심박이 한 번 성공",
            "공식: 세 번 중 한 번만 체인에 있어도 벤치마크 보상 배분",
            "한두 번 빠진 것만으로 그 에폭 벤치마크 보상이 사라진 것은 아님",
          ],
          [
            "세 번 모두 없음",
            "그 에폭의 벤치마크 보상 조건을 못 채움",
            "Hub나 Telegram 모니터링 봇에서 최근 심박을 보고, 등록을 지우지 않음",
          ],
          ["잔액이 약간 감소", "보고 수수료, 보통 약 0.0013 ACU", "오프라인의 증거가 아님"],
        ],
      },
      ja: {
        headers: ["見えていること", "よりありそうな意味", "次の確認"],
        rows: [
          [
            "ここでは登録済みのまま",
            "メインネット索引にこのプロセッサがまだある",
            "オンラインランプとは扱わない",
          ],
          [
            "ここで取得不可",
            "アドレスがメインネットのプロセッサではない、または今回索引が何も返さない",
            "管理者かCanaryかを確認するか、後で再照会",
          ],
          [
            "エポックでハートビートが一度成功",
            "公式: 三回のうち一度チェーンに届けばベンチマーク報酬を割り当て",
            "一、二回欠けただけではそのエポックのベンチマーク報酬が消えたことにはならない",
          ],
          [
            "三回とも無い",
            "そのエポックのベンチマーク報酬条件を満たしていない",
            "HubかTelegramの監視ボットで直近を見る。登録は消さない",
          ],
          ["残高がわずかに減った", "報告手数料、通常約0.0013 ACU", "オフラインの証拠ではない"],
        ],
      },
    },
    body: {
      zh: [
        "手机关机、应用被系统停掉，或网络中断之后，主网索引里的处理器登记仍可以留着。所以 [Acurast 项目页](/projects/acurast) 继续显示「已登记」和原来的 Core/Lite、Android/iOS 类型，并不等于手机正在上报。这个页面没有单独的在线或离线灯。",
        "官方处理器说明：心跳大约每 30 分钟一次；一个周期大约 90 分钟，里面有三次心跳机会。基准奖励的条件是这三次里至少有一次成功写到链上。因此漏掉一部分心跳，不一定失去该周期的基准奖励。三次都没有，则不满足这一条。文档建议用 Telegram 上的 Acurast Monitoring Bot 看近期表现，而不是手工把历史心跳全部扫完。",
        "## 建议的检查顺序",
        "- 确认 Hub 选的是 Mainnet，打开的是这台手机的 Processor，而不是管理者钱包。管理者地址查不到处理器时，本站会不可用，那和手机离线不是同一件事。",
        "- 在手机上看 Processor 应用是否仍在运行。Lite 可以被你暂停；Core 虽是专用机，物理断电或断网一样会停心跳。",
        "- 对照最近三个约 30 分钟的间隔里有没有至少一次成功心跳。有一次，按官方规则该周期基准奖励仍可发放；一次都没有，再查电量、网络和应用是否被系统冻结。",
        "- 余额若只减少大约 0.0013 ACU 这一量级，先按官方所说的上报手续费理解，不要单独当成掉线。",
        "- 若你为离线排查另存了一台设备，那会占用该项目的一台名额（免费 5 台，Pro 50 台）。同一台手机不要用 SS58 和 0x 各存一条。",
        "## 举例",
        "示意，不是某台真实手机的日志：周期从 12:00 到约 13:30，计划心跳在 12:00、12:30、13:00。只有 12:30 成功。按官方规则，这一周期的基准奖励条件已经满足。本站在 13:20 仍只显示已登记，不会写出“1/3”或离线。若三次都失败，登记行依然可能还在，奖励条件则未满足。",
        "## 接下来与界限",
        "部署是否让该周期获得 Busy Bonus，看 [任务状态](/learn/acurast-phone-job-status)。全池金额不要当成个人入账，看 [奖励范围](/learn/acurast-rewards-settlement)。本站不接收手机通知，也不能替你重启应用。",
      ],
      "zh-TW": [
        "手機關機、應用被系統停掉，或網路中斷之後，主網索引裡的處理器登記仍可以留著。所以 [Acurast 專案頁](/projects/acurast) 繼續顯示「已登記」和原來的 Core/Lite、Android/iOS 類型，並不等於手機正在上報。這個頁面沒有單獨的在線或離線燈。",
        "官方處理器說明：心跳大約每 30 分鐘一次；一個週期大約 90 分鐘，裡面有三次心跳機會。基準獎勵的條件是這三次裡至少有一次成功寫到鏈上。因此漏掉一部分心跳，不一定失去該週期的基準獎勵。三次都沒有，則不滿足這一條。文件建議用 Telegram 上的 Acurast Monitoring Bot 看近期表現，而不是手工把歷史心跳全部掃完。",
        "## 建議的檢查順序",
        "- 確認 Hub 選的是 Mainnet，打開的是這支手機的 Processor，而不是管理者錢包。管理者地址查不到處理器時，本站會無法取得，那和手機離線不是同一件事。",
        "- 在手機上看 Processor 應用是否仍在執行。Lite 可以被你暫停；Core 雖是專用機，實體斷電或斷網一樣會停心跳。",
        "- 對照最近三個約 30 分鐘的間隔裡有沒有至少一次成功心跳。有一次，按官方規則該週期基準獎勵仍可發放；一次都沒有，再查電量、網路和應用是否被系統凍結。",
        "- 餘額若只減少大約 0.0013 ACU 這一量級，先按官方所說的上報手續費理解，不要單獨當成掉線。",
        "- 若你為離線排查另存了一台裝置，那會占用該專案的一台名額（免費 5 台，Pro 50 台）。同一支手機不要用 SS58 和 0x 各存一筆。",
        "## 舉例",
        "示意，不是某支真實手機的日誌：週期從 12:00 到約 13:30，計畫心跳在 12:00、12:30、13:00。只有 12:30 成功。按官方規則，這一週期的基準獎勵條件已經滿足。本站在 13:20 仍只顯示已登記，不會寫出「1/3」或離線。若三次都失敗，登記行依然可能還在，獎勵條件則未滿足。",
        "## 接下來與界限",
        "部署是否讓該週期獲得 Busy Bonus，看 [任務狀態](/learn/acurast-phone-job-status)。全池金額不要當成個人入帳，看 [獎勵範圍](/learn/acurast-rewards-settlement)。本站不接收手機通知，也不能替你重啟應用。",
      ],
      en: [
        "After the phone is powered off, the system stops the app, or the network drops, the processor row in the mainnet index can remain. The [Acurast project page](/projects/acurast) can still show Registered and the same Core/Lite and Android/iOS type. That does not mean the phone is reporting. This page has no separate online or offline lamp.",
        "Official processor docs: heartbeats are about every 30 minutes, and an epoch is about 90 minutes, so there are three heartbeat chances. Benchmark rewards are assigned when at least one of those three is received on chain. Missing some heartbeats does not by itself remove that epoch’s benchmark rewards. If none of the three arrives, that condition is not met. The docs point to the Acurast Monitoring Bot on Telegram for recent performance, rather than scanning the full heartbeat history by hand.",
        "## Checks, in order",
        "- Confirm Hub is on Mainnet and you opened this phone’s Processor, not the manager wallet. A manager address that is not a processor shows unavailable here. That is a different problem from the phone being offline.",
        "- On the phone, see whether the Processor app is still running. You can pause Lite. Core is a dedicated phone, but power loss or a dead network still stops heartbeats.",
        "- Compare the last three intervals of about 30 minutes. One success meets the official benchmark-reward condition for that epoch. If none succeeded, check battery, network, and whether the system froze the app.",
        "- A balance change on the order of about 0.0013 ACU fits the report fee described officially. Do not treat that dip alone as proof of downtime.",
        "- Saving an extra device while you debug uses one slot on this project (five on Free, 50 on Pro). Do not save both the SS58 form and the 0x form of the same phone.",
        "## Example",
        "Illustration, not a log from a real phone: an epoch runs from 12:00 to about 13:30, with planned heartbeats at 12:00, 12:30, and 13:00. Only 12:30 succeeds. Under the official rule, that epoch’s benchmark-reward condition is met. At 13:20 this site still shows only Registered. It does not print “1/3” or Offline. If all three fail, the registration row can still be there while the reward condition is not met.",
        "## Next step and limit",
        "Whether a deployment adds Busy Bonus for that epoch is covered in [job status](/learn/acurast-phone-job-status). Do not treat a pool total as a personal credit; see [reward scope](/learn/acurast-rewards-settlement). This site does not receive phone notifications and cannot restart the app.",
      ],
      ko: [
        "휴대폰 전원이 꺼지거나, 시스템이 앱을 멈추거나, 네트워크가 끊긴 뒤에도 메인넷 색인의 프로세서 행은 남을 수 있습니다. [Acurast 프로젝트 페이지](/projects/acurast)는 계속 등록됨과 같은 Core/Lite, Android/iOS 유형을 보일 수 있습니다. 그것은 휴대폰이 보고 중이라는 뜻이 아닙니다. 이 페이지에는 별도의 온라인·오프라인 등이 없습니다.",
        "공식 프로세서 문서: 심박은 약 30분마다이고, 에폭은 약 90분이므로 심박 기회는 세 번입니다. 벤치마크 보상은 세 번 중 적어도 한 번이 체인에 기록되면 배분됩니다. 심박을 일부 놓쳐도 그 사실만으로 해당 에폭의 벤치마크 보상이 사라지지는 않습니다. 세 번 모두 없으면 그 조건은 충족되지 않습니다. 문서는 최근 실적을 Telegram의 Acurast Monitoring Bot으로 보라고 하며, 과거 심박을 손으로 전부 훑으라고 하지 않습니다.",
        "## 확인 순서",
        "- Hub가 Mainnet인지, 연 것이 이 휴대폰의 Processor인지 관리 지갑이 아닌지 확인하세요. 프로세서가 아닌 관리자 주소는 여기서 사용 불가입니다. 그것은 휴대폰 오프라인과는 다른 문제입니다.",
        "- 휴대폰에서 Processor 앱이 아직 실행 중인지 보세요. Lite는 멈출 수 있습니다. Core는 전용 휴대폰이지만 전원이나 네트워크가 끊기면 심박도 멈춥니다.",
        "- 최근 약 30분 간격 세 번을 비교하세요. 한 번 성공하면 그 에폭의 공식 벤치마크 보상 조건을 충족합니다. 한 번도 없으면 배터리, 네트워크, 시스템이 앱을 얼렸는지를 보세요.",
        "- 약 0.0013 ACU 규모의 잔액 변화는 공식 문서의 보고 수수료와 맞습니다. 그 감소만으로 다운타임의 증거로 삼지 마세요.",
        "- 디버그하려고 장치를 하나 더 저장하면 이 프로젝트의 자리 하나를 씁니다(무료 5대, Pro 50대). 같은 휴대폰의 SS58과 0x를 둘 다 저장하지 마세요.",
        "## 예시",
        "설명용이며 실제 휴대폰 로그가 아닙니다. 에폭이 12:00부터 약 13:30까지이고, 예정 심박이 12:00, 12:30, 13:00입니다. 12:30만 성공합니다. 공식 규칙으로는 그 에폭의 벤치마크 보상 조건이 충족됩니다. 13:20에 이 사이트는 여전히 등록됨만 보입니다. “1/3”이나 오프라인을 찍지 않습니다. 세 번 모두 실패해도 등록 행은 남을 수 있고, 보상 조건은 충족되지 않습니다.",
        "## 다음 단계와 한계",
        "배포가 그 에폭에 Busy Bonus를 더하는지는 [작업 상태](/learn/acurast-phone-job-status)에 있습니다. 풀 합계를 개인 입금으로 보지 말고 [보상 범위](/learn/acurast-rewards-settlement)를 보세요. 이 사이트는 휴대폰 알림을 받지 않으며 앱을 다시 시작하지도 않습니다.",
      ],
      ja: [
        "電話の電源が切れる、システムがアプリを止める、またはネットワークが切れても、メインネット索引のプロセッサ行は残り得ます。[Acurastプロジェクトページ](/projects/acurast)は登録済みと、同じ Core/Lite、Android/iOS の種別を出し続け得ます。それは電話が報告中という意味ではありません。このページに独立したオンライン／オフラインのランプはありません。",
        "公式のプロセッサ説明: ハートビートは約30分ごと、エポックは約90分なので、機会は三回です。ベンチマーク報酬は、その三回のうち少なくとも一回がチェーンに記録されれば割り当てられます。一部のハートビートを欠いただけでは、そのエポックのベンチマーク報酬が消えるとは限りません。三回とも無ければ、その条件は満たされません。ドキュメントは直近の様子を Telegram の Acurast Monitoring Bot で見るよう示しており、過去のハートビートを手ですべて辿ることは勧めていません。",
        "## 確認の順",
        "- HubがMainnetか、開いたのがこの電話の Processor であり管理者ウォレットではないかを確認します。プロセッサではない管理者アドレスはここでは取得不可です。それは電話のオフラインとは別の問題です。",
        "- 電話で Processor アプリがまだ実行中かを見ます。Liteは止められます。Coreは専用の電話でも、電源断やネットワーク断でハートビートは止まります。",
        "- 直近の約30分間隔を三回比べます。一度成功すれば、そのエポックの公式ベンチマーク報酬条件を満たします。一度も無ければ、電池、ネットワーク、システムがアプリを止めていないかを見ます。",
        "- 約0.0013 ACU規模の残高変化は、公式が述べる報告手数料と合います。その減少だけを停止の証拠にしないでください。",
        "- 調査のためにデバイスをもう一台保存すると、このプロジェクトの枠を一つ使います（無料5台、Pro 50台）。同じ電話のSS58と0xを両方保存しないでください。",
        "## 例",
        "説明用であり、実在の電話のログではありません。エポックが12:00から約13:30までで、予定ハートビートが12:00、12:30、13:00です。成功したのは12:30だけです。公式の規則では、そのエポックのベンチマーク報酬条件は満たされています。13:20の時点で当サイトは登録済みだけを出します。「1/3」やオフラインとは書きません。三回とも失敗しても登録行は残り得て、報酬条件は満たされません。",
        "## 次と限界",
        "デプロイがそのエポックに Busy Bonus を足すかは [ジョブ状態](/learn/acurast-phone-job-status) です。プール合計を個人の入金と見ないでください。[報酬の範囲](/learn/acurast-rewards-settlement) を見てください。当サイトは電話の通知を受け取らず、アプリの再起動もできません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "已登记超过一天，手机会不会被当成还在线？",
          answer:
            "不会。本站没有用登记时间换算在线。登记可以长期留下。是否仍在心跳，要看 Hub 或官方监控机器人里的最近上报。",
        },
        {
          question: "漏了两次心跳，这个周期的基准奖励还有吗？",
          answer:
            "官方规则是一个周期三次机会里成功一次即可发放基准奖励。只漏两次、仍有一次上链时，条件仍然满足。三次都没有则不满足。质押奖励和 Busy Bonus 另看该周期是否在执行部署以及质押条件。",
        },
        {
          question: "查询突然不可用，是手机离线了吗？",
          answer:
            "不一定。不可用表示这次没有拿到“该地址是主网处理器”的结果，例如填了管理者钱包、Canary 账户，或索引没有返回。离线的手机仍可能保持已登记。",
        },
      ],
      "zh-TW": [
        {
          question: "已登記超過一天，手機會不會被當成還在線？",
          answer:
            "不會。本站沒有用登記時間換算在線。登記可以長期留下。是否仍在心跳，要看 Hub 或官方監控機器人裡的最近上報。",
        },
        {
          question: "漏了兩次心跳，這個週期的基準獎勵還有嗎？",
          answer:
            "官方規則是一個週期三次機會裡成功一次即可發放基準獎勵。只漏兩次、仍有一次上鏈時，條件仍然滿足。三次都沒有則不滿足。質押獎勵和 Busy Bonus 另看該週期是否在執行部署以及質押條件。",
        },
        {
          question: "查詢突然無法取得，是手機離線了嗎？",
          answer:
            "不一定。無法取得表示這次沒有拿到「該地址是主網處理器」的結果，例如填了管理者錢包、Canary 帳戶，或索引沒有返回。離線的手機仍可能保持已登記。",
        },
      ],
      en: [
        {
          question: "If Registered is more than a day old, is the phone treated as online?",
          answer:
            "No. This site does not convert registration age into online status. Registration can remain. Whether heartbeats are still arriving is a recent-report question for Hub or the official monitoring bot.",
        },
        {
          question: "If two heartbeats were missed, do benchmark rewards for that epoch remain?",
          answer:
            "The official rule assigns benchmark rewards when one of the three chances in an epoch reaches the chain. Two misses with one success still meet that condition. Three misses do not. Staking rewards and the Busy Bonus still depend on staking terms and whether a deployment was executing that epoch.",
        },
        {
          question: "The lookup just became unavailable. Is the phone offline?",
          answer:
            "Not necessarily. Unavailable means this attempt did not get “this address is a mainnet processor,” for example a manager wallet, a Canary account, or no index result. An offline phone can still stay Registered.",
        },
      ],
      ko: [
        {
          question: "등록됨이 하루를 넘으면 휴대폰을 온라인으로 보나요?",
          answer:
            "아닙니다. 이 사이트는 등록 시각으로 온라인을 계산하지 않습니다. 등록은 오래 남을 수 있습니다. 심박이 아직 들어오는지는 Hub나 공식 모니터링 봇의 최근 보고를 보세요.",
        },
        {
          question: "심박을 두 번 놓치면 그 에폭의 벤치마크 보상은 남나요?",
          answer:
            "공식 규칙은 한 에폭의 세 번 중 한 번이 체인에 닿으면 벤치마크 보상을 배분합니다. 두 번을 놓치고 한 번 성공하면 그 조건은 충족됩니다. 세 번 모두 없으면 충족되지 않습니다. 스테이킹 보상과 Busy Bonus는 스테이킹 조건과 그 에폭의 배포 실행 여부를 따로 봅니다.",
        },
        {
          question: "조회가 갑자기 사용 불가가 되었습니다. 휴대폰이 오프라인인가요?",
          answer:
            "꼭 그렇지는 않습니다. 사용 불가는 이번에 「이 주소가 메인넷 프로세서」라는 결과를 받지 못했다는 뜻입니다. 관리 지갑, Canary 계정, 또는 색인 결과가 없는 경우가 있습니다. 오프라인 휴대폰도 등록됨으로 남을 수 있습니다.",
        },
      ],
      ja: [
        {
          question: "登録済みが一日を超えると、電話はオンライン扱いになりますか？",
          answer:
            "なりません。当サイトは登録の経過時間をオンラインには換算しません。登録は長く残り得ます。ハートビートがまだ届いているかは、Hubまたは公式の監視ボットの直近の報告で見てください。",
        },
        {
          question: "ハートビートを二回欠くと、そのエポックのベンチマーク報酬は残りますか？",
          answer:
            "公式の規則は、一つのエポックで三回のうち一回がチェーンに届けばベンチマーク報酬を割り当てます。二回欠けて一回成功なら、その条件は満たされます。三回とも無ければ満たされません。ステーキング報酬と Busy Bonus は、ステーク条件とそのエポックでデプロイを実行していたかで別です。",
        },
        {
          question: "照会が急に取得不可になりました。電話がオフラインですか？",
          answer:
            "必ずしもそうではありません。取得不可は、今回「このアドレスはメインネットのプロセッサ」という結果を得られなかったという意味です。管理者ウォレット、Canaryの口座、または索引結果がない場合です。オフラインの電話でも登録済みのまま残り得ます。",
        },
      ],
    },
  },
];
