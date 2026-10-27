import type { Article } from "../articles";

const metal = {
  name: "Pearl Metal miner",
  url: "https://github.com/Breakwater-ecosystem/pearl-metal-miner",
};
const kryptex = { name: "Kryptex · PRL pool", url: "https://pool.kryptex.com/en/prl" };
const luckyHome = { name: "LuckyPool · Pearl", url: "https://pearl.luckypool.io/" };
const minerstat = { name: "Minerstat · PRL calculator", url: "https://minerstat.com/coin/prl" };

const reviewed = "2026-10-23";

export const prlDepthGuides: Article[] = [
  {
    slug: "pearl-prl-mac-monitoring",
    project: "prl",
    published: "2026-10-17",
    modified: "2026-10-24",
    sources: [metal, kryptex],
    related: ["prl-luckypool-vs-kryptex", "prl-mac-gpu-miner-compatibility"],
    topic: {
      zh: "Mac 监控",
      "zh-TW": "Mac 監控",
      en: "Mac monitoring",
      ko: "Mac 모니터링",
      ja: "Macでの監視",
    },
    title: {
      zh: "Mac 挖 Pearl / PRL 后，怎样查算力、Worker 和收益？",
      "zh-TW": "Mac 挖 Pearl / PRL 後如何查算力、Worker 與收益？",
      en: "Pearl PRL on Mac: check pool hashrate, workers and rewards",
      ko: "Mac에서 Pearl PRL을 캔 뒤 해시레이트·워커·보상을 확인하는 방법",
      ja: "MacでPearl PRLを掘ったあと、ハッシュレート・ワーカー・報酬を確認する",
    },
    description: {
      zh: "先看矿工连的是 Kryptex 还是 LuckyPool，再在 PRL 监控里选同一个来源。两套账本互不代替；Kryptex 用户名不能当成 prl1 地址。",
      "zh-TW":
        "先看礦工連的是 Kryptex 還是 LuckyPool，再在 PRL 監控選同一個來源。兩套帳本互不代替；Kryptex 用戶名不能當成 prl1 地址。",
      en: "See whether the Mac miner points at Kryptex or LuckyPool, then select that same source in PRL monitoring. The ledgers do not stand in for each other, and a Kryptex username is not a prl1 address.",
      ko: "Mac 채굴기가 Kryptex인지 LuckyPool인지 본 뒤 PRL 모니터에서 같은 출처를 고르세요. 두 장부는 서로를 대신하지 않으며 Kryptex 사용자명은 prl1 주소가 아닙니다.",
      ja: "MacのマイナーがKryptexかLuckyPoolかを見てから、PRL監視で同じ取得元を選びます。二つの台帳は互いの代わりにならず、Kryptexのユーザー名はprl1アドレスではありません。",
    },
    summary: {
      zh: "Apple Silicon 上的 Pearl Metal 可以连 Kryptex 或 LuckyPool。监控必须打开实际接收份额的那一个矿池。本站读取公开地址统计，不安装矿工。两池是各自的账户行，不要把未付和已付盲加成一笔收入。",
      "zh-TW":
        "Apple Silicon 上的 Pearl Metal 可以連 Kryptex 或 LuckyPool。監控必須開啟實際接收份額的那一個礦池。本站讀取公開地址統計，不安裝礦工。兩池是各自的帳戶列，不要把未付和已付盲加成一筆收入。",
      en: "Pearl Metal on Apple Silicon can connect to Kryptex or LuckyPool. Monitoring has to open the pool that actually received the shares. IOTA Watch reads public address stats and does not install a miner. The pools are separate account rows. Do not fold unpaid and paid into one income figure.",
      ko: "Apple Silicon의 Pearl Metal은 Kryptex 또는 LuckyPool에 연결할 수 있습니다. 모니터는 실제로 지분을 받은 풀을 열어야 합니다. IOTA Watch는 공개 주소 통계를 읽고 채굴기를 설치하지 않습니다. 두 풀은 각자의 계정 행입니다. 미지급과 지급을 한 수입으로 뭉개지 마세요.",
      ja: "Apple SiliconのPearl MetalはKryptexまたはLuckyPoolに接続できます。監視は実際にシェアを受け取ったプールを開きます。IOTA Watchは公開アドレスの統計を読み、マイナーは導入しません。二つのプールは別の口座行です。未払いと支払済みを一つの収入にまとめないでください。",
    },
    comparisonTitle: {
      zh: "同一台 Mac，两套来源各看什么",
      "zh-TW": "同一台 Mac，兩套來源各看什麼",
      en: "What each source shows for the same Mac",
      ko: "같은 Mac에서 출처별로 보이는 것",
      ja: "同じMacで取得元ごとに見えるもの",
    },
    comparison: {
      zh: {
        headers: ["你要核对的事", "选 Kryptex", "选 LuckyPool"],
        rows: [
          ["未付余额", "该地址在 Kryptex 的未付合计", "已解锁金额；缺字段则显示未知"],
          ["还没到可付", "这个来源没有单独的锁定余额", "锁定金额，标成待入账；缺字段则未知"],
          ["已付出", "Kryptex 累计已付", "LuckyPool 返回的已付；没有就是未知"],
          ["近期收益", "曲线上有当天 UTC 日切点才显示", "滚动 24 小时；没有 24h 行就是未知"],
          [
            "算力",
            "用矿池报出的平均或当前速率；缺报则地址总算力未知",
            "地址统计里的算力，单位 H/s",
          ],
          ["Worker", "名称、在线或离线、最后份额时间", "名称、算力、最后份额；过久未见标为离线"],
        ],
      },
      "zh-TW": {
        headers: ["你要核對的事", "選 Kryptex", "選 LuckyPool"],
        rows: [
          ["未付餘額", "該地址在 Kryptex 的未付合計", "已解鎖金額；缺欄位則顯示未知"],
          ["還沒到可付", "這個來源沒有單獨的鎖定餘額", "鎖定金額，標成待入帳；缺欄位則未知"],
          ["已付出", "Kryptex 累計已付", "LuckyPool 回傳的已付；沒有就是未知"],
          ["近期收益", "曲線上有當天 UTC 日切點才顯示", "滾動 24 小時；沒有 24h 列就是未知"],
          [
            "算力",
            "用礦池報出的平均或目前速率；缺報則地址總算力未知",
            "地址統計裡的算力，單位 H/s",
          ],
          ["Worker", "名稱、在線或離線、最後份額時間", "名稱、算力、最後份額；過久未見標為離線"],
        ],
      },
      en: {
        headers: ["What you are checking", "Kryptex selected", "LuckyPool selected"],
        rows: [
          [
            "Unpaid balance",
            "That address’s unpaid total on Kryptex",
            "Unlocked amount; missing field stays unknown",
          ],
          [
            "Not payable yet",
            "No separate locked balance on this source",
            "Locked amount, shown as pending; missing stays unknown",
          ],
          [
            "Already paid",
            "Kryptex cumulative paid",
            "Paid amount LuckyPool returned; absent means unknown",
          ],
          [
            "Recent reward",
            "Shown only when today’s UTC day point exists",
            "Rolling 24 hours; no 24h row means unknown",
          ],
          [
            "Hashrate",
            "Pool-reported average or current rate; a missing reported rate leaves the address total unknown",
            "Address hashrate in H/s",
          ],
          [
            "Workers",
            "Name, online or offline, last share time",
            "Name, hashrate, last share; long silence shows offline",
          ],
        ],
      },
      ko: {
        headers: ["확인할 일", "Kryptex 선택", "LuckyPool 선택"],
        rows: [
          [
            "미지급 잔액",
            "그 주소의 Kryptex 미지급 합계",
            "잠금 해제 금액. 필드가 없으면 알 수 없음",
          ],
          [
            "아직 지급 전",
            "이 출처에는 별도 잠금 잔액이 없음",
            "잠금 금액은 대기. 없으면 알 수 없음",
          ],
          ["이미 지급", "Kryptex 누적 지급", "LuckyPool이 돌려준 지급액. 없으면 알 수 없음"],
          ["최근 보상", "오늘 UTC 날짜 점이 있을 때만", "롤링 24시간. 24h 행이 없으면 알 수 없음"],
          [
            "해시레이트",
            "풀이 보고한 평균 또는 현재 속도. 보고가 없으면 주소 합계는 알 수 없음",
            "주소 통계의 해시레이트, H/s",
          ],
          [
            "워커",
            "이름, 온라인 또는 오프라인, 마지막 지분 시각",
            "이름, 해시레이트, 마지막 지분. 오래 없으면 오프라인",
          ],
        ],
      },
      ja: {
        headers: ["確認したいこと", "Kryptexを選択", "LuckyPoolを選択"],
        rows: [
          ["未払い残高", "そのアドレスのKryptex未払い合計", "解除済み金額。項目がなければ不明"],
          [
            "まだ支払えない分",
            "この取得元に別のロック残高はない",
            "ロック金額は保留。なければ不明",
          ],
          ["支払済み", "Kryptexの累計支払", "LuckyPoolが返した支払額。なければ不明"],
          ["直近の報酬", "当日のUTC日次点があるときだけ", "ローリング24時間。24h行がなければ不明"],
          [
            "ハッシュレート",
            "プールが報告した平均または現在速度。報告が無ければアドレス合計は不明",
            "アドレス統計のハッシュレート、H/s",
          ],
          [
            "ワーカー",
            "名前、オンラインまたはオフライン、最終シェア時刻",
            "名前、ハッシュレート、最終シェア。長く見えなければオフライン",
          ],
        ],
      },
    },
    body: {
      zh: [
        "Mac 交出 Pearl（PRL）份额之后，先打开实际接住份额的矿池，再读算力和收益。打开 [PRL 监控](/projects/prl)，来源默认是 Kryptex，LuckyPool 要另外选择。Pearl Metal 作者说明 Apple Silicon（M1 到 M5）用 `--pool kryptex` 或 `--pool luckypool` 连接不同矿池。这是两套账本。同一枚有效地址可以在两边各有记录。一边没有记录，不能说明另一边停机。未付、待入账和已付是不同的行，不要盲加成一笔收入。",
        "先看矿工配置，不看电脑名称。Metal 的 `init` 会记下矿池、`prl1` 收款地址和 Worker 标签。钱包文件留在你自己的 Mac 上。本站只保存公开地址：以 `prl1` 开头，后面是一段 bech32 字符。Kryptex 连接页写明可以用钱包或用户名，再加 `/worker`；开通自动兑换时用 Kryptex 用户名登录，提取物可以是 BTC、USDT 等，而不是 PRL。用户名、`0x` 字符串和私钥都加不进这条 PRL 记录。自动兑换后的法币或比特币余额也不在这本 PRL 账上。",
        "地址能打开之后，按你选中的来源读数。缺某一项就保持未知，不会被写成 0。筛选一台 Worker 只改变算力和在线状态的查看范围；未付、已付和近期收益仍属于整个地址。未登录时，这份清单只留在当前浏览器。每个项目免费可保存 3 台设备，登录后的 Pro 为每个项目 100 台。页面上自动出现的 Worker 不会因此新增一台已保存设备；若你另外把 Worker 存成设备，才会占用名额。同一台已保存设备上，这个项目的多条绑定只算一台。余额按地址共用，不会按 Worker 再记一笔收入。崩溃分析不另收费。本站的 Agent 只操作 IOTA Train at Home 的 Mac，不能替你启动或停止 Pearl 矿工。",
        "## 一份对照，避免把两池读成一笔账",
        "下表是本站对两个来源分别展示的含义。数字以矿池当时返回的为准。缺字段就保持未知。合并挖矿的 NOCK 不计入这条 PRL 记录。各池当前的付款规则只约束那一家；本站查询公开统计，不代替矿池提现。",
        "## 例子：选错来源",
        "下面是说明用的例子，不是某一枚真实钱包。配置写着 `--pool luckypool`，Worker 叫 `m1`，地址是一枚 `prl1`。你在监控里仍停在默认的 Kryptex，页面表示这个地址在 Kryptex 没有记录。这只说明 Kryptex 这本账上没有它，不表示地址本身对不上。把来源改成 LuckyPool，地址不要改。若该池返回已解锁 0.02 PRL，这一行属于整个地址，不要抄到 `m1` 名下，也不要把它和 Kryptex 的未付、已付揉成一笔收入。",
        "## 接下来做什么，以及做不到什么",
        "对照 Metal 配置里的矿池和收款地址，在 [PRL 监控](/projects/prl) 选择同一来源，再看 Worker 最后份额时间是否还在更新。各池当前的付款规则只适用于那一家。本站查询，不发起提现，也不从显示金额里代扣费用。矿池主机名和端口以你矿工里正在使用的配置以及矿池当前页面为准。",
        "若另一边仍然对不上，继续看 [Kryptex 与 LuckyPool 为什么各记各的](/learn/prl-luckypool-vs-kryptex)。Mac 和独立显卡矿工的差别见 [哪些程序能挖 PRL](/learn/prl-mac-gpu-miner-compatibility)。",
      ],
      "zh-TW": [
        "Mac 送出 Pearl（PRL）份額之後，先打開實際收下份額的礦池，再讀算力與收益。打開 [PRL 監控](/projects/prl)，來源預設是 Kryptex，LuckyPool 要另外選擇。Pearl Metal 作者說明 Apple Silicon（M1 到 M5）用 `--pool kryptex` 或 `--pool luckypool` 連接不同礦池。這是兩套帳本。同一枚有效地址可以在兩邊各有紀錄。一邊沒有紀錄，不能說明另一邊停機。未付、待入帳和已付是不同的列，不要盲加成一筆收入。",
        "先看礦工設定，不看電腦名稱。Metal 的 `init` 會記下礦池、`prl1` 收款地址與 Worker 標籤。錢包檔留在你自己的 Mac。本站只保存公開地址：以 `prl1` 開頭，後面是一段 bech32 字元。Kryptex 連線頁寫明可以用錢包或用戶名，再加 `/worker`；開通自動兌換時用 Kryptex 用戶名登入，提取物可以是 BTC、USDT 等，而不是 PRL。用戶名、`0x` 字串與私鑰都加不進這條 PRL 紀錄。自動兌換後的法幣或比特幣餘額也不在這本 PRL 帳上。",
        "地址能打開之後，按你選中的來源讀數。缺某一項就保持未知，不會被寫成 0。篩選一台 Worker 只改變算力與在線狀態的檢視範圍；未付、已付與近期收益仍屬於整個地址。未登入時，這份清單只留在目前瀏覽器。每個專案免費可保存 3 台裝置，登入後的 Pro 為每個專案 100 台。頁面上自動出現的 Worker 不會因此新增一台已保存裝置；若你另外把 Worker 存成裝置，才會占用名額。同一台已保存裝置上，這個專案的多條綁定只算一台。餘額按地址共用，不會按 Worker 再記一筆收入。當機分析不另收費。本站的 Agent 只操作 IOTA Train at Home 的 Mac，不能替你啟動或停止 Pearl 礦工。",
        "## 一份對照，避免把兩池讀成一筆帳",
        "下表是本站對兩個來源分別展示的含義。數字以礦池當時回傳的為準。缺欄位就保持未知。合併挖礦的 NOCK 不計入這條 PRL 紀錄。各池目前的付款規則只約束那一家；本站查詢公開統計，不代替礦池提現。",
        "## 例子：選錯來源",
        "下面是說明用的例子，不是某一枚真實錢包。設定寫著 `--pool luckypool`，Worker 叫 `m1`，地址是一枚 `prl1`。你在監控裡仍停在預設的 Kryptex，頁面表示這個地址在 Kryptex 沒有紀錄。這只說明 Kryptex 這本帳上沒有它，不表示地址本身對不上。把來源改成 LuckyPool，地址不要改。若該池回傳已解鎖 0.02 PRL，這一列屬於整個地址，不要抄到 `m1` 名下，也不要把它和 Kryptex 的未付、已付揉成一筆收入。",
        "## 接下來做什麼，以及做不到什麼",
        "對照 Metal 設定裡的礦池與收款地址，在 [PRL 監控](/projects/prl) 選擇同一來源，再看 Worker 最後份額時間是否還在更新。各池目前的付款規則只適用於那一家。本站查詢，不發起提現，也不從顯示金額裡代扣費用。礦池主機名與連接埠以你礦工裡正在使用的設定以及礦池目前頁面為準。",
        "若另一邊仍然對不上，繼續看 [Kryptex 與 LuckyPool 為什麼各記各的](/learn/prl-luckypool-vs-kryptex)。Mac 與獨立顯卡礦工的差別見 [哪些程式能挖 PRL](/learn/prl-mac-gpu-miner-compatibility)。",
      ],
      en: [
        "After a Mac submits Pearl (PRL) shares, open the pool that actually took them before you read hashrate or rewards. On [PRL monitoring](/projects/prl) the default source is Kryptex. LuckyPool is a separate choice. The Pearl Metal author documents Apple Silicon, M1 through M5, connecting with `--pool kryptex` or `--pool luckypool`. Those are two ledgers. The same valid address can have a record at each pool. A missing record on one side does not show that the other side stopped. Unpaid, pending, and paid are separate rows. Do not fold them into one income figure.",
        "Read the miner config, not the computer name. Metal `init` stores the pool, a `prl1` payout address, and a worker label. Leave the wallet file on your own Mac. This site stores a public address that starts with `prl1` and continues with bech32 characters. Kryptex’s connection page says the login can be a wallet or a username, plus `/worker`. With auto-convert, the login is a Kryptex username and withdrawals can be BTC, USDT, and other listed assets rather than PRL. A username, an `0x` string, or a private key cannot be saved as this PRL row. Converted bitcoin or cash balances are not on this PRL ledger.",
        "Once the address opens, read only the source you selected. A missing figure stays unknown. It is not rewritten as zero. Filtering one worker changes which hashrate and online state you see. Unpaid, paid, and recent reward still belong to the whole address. Signed-out lists stay in the current browser. Free saves three devices per project. Signed-in Pro saves 100. Workers that appear automatically do not create a saved device. Saving a worker as its own device can use a slot. Several bindings for this project on the same saved device still count as one. The balance stays on the address and is not copied onto each worker as extra income. Crash analysis is included. The Agent on this site controls IOTA Train at Home on a Mac. It does not start or stop a Pearl miner.",
        "## One comparison, so the pools stay separate",
        "The table is what this monitor shows for each source. Figures are whatever the pool returned. A missing field stays unknown. Merged NOCK is not part of this PRL record. Each pool’s current payout policy applies only to that pool. This site queries public stats and does not withdraw for you.",
        "## Example: the wrong source",
        "This is an illustration, not a real wallet. The config says `--pool luckypool`, the worker label is `m1`, and the address is a `prl1` string. Monitoring is still on the default Kryptex source and reports no Kryptex record. That says only that Kryptex’s ledger has no row. It does not mean the address itself fails to match. Switch the source to LuckyPool and keep the address. If that pool returns an unlocked 0.02 PRL, the line belongs to the whole address. Do not copy it onto `m1`, and do not fold it together with Kryptex unpaid or paid as one income figure.",
        "## What to do next, and what this cannot do",
        "Match the pool and payout address in the Metal config, select that source on [PRL monitoring](/projects/prl), and see whether the worker’s last share time is still moving. Each pool’s current payout policy applies only there. This site queries and does not send a withdrawal or deduct a fee from the amount on screen. Use the host and port already in your miner, and the pool’s current page.",
        "If the other pool still disagrees, read [why Kryptex and LuckyPool keep separate books](/learn/prl-luckypool-vs-kryptex). For Mac software versus discrete-GPU miners, see [which programs can mine PRL](/learn/prl-mac-gpu-miner-compatibility).",
      ],
      ko: [
        "Mac이 Pearl(PRL) 지분을 보낸 뒤에는 그 지분을 받은 풀을 연 다음 해시레이트와 보상을 읽습니다. [PRL 모니터](/projects/prl)의 기본 출처는 Kryptex이고 LuckyPool은 따로 고릅니다. Pearl Metal 저자는 Apple Silicon(M1부터 M5)이 `--pool kryptex` 또는 `--pool luckypool`로 서로 다른 풀에 연결한다고 적습니다. 장부가 둘입니다. 같은 유효 주소가 양쪽 풀에 각각 기록을 가질 수 있습니다. 한쪽에 기록이 없어도 다른 쪽이 멈춘 것은 아닙니다. 미지급, 대기, 지급은 별도 행이므로 한 수입으로 뭉개지 마세요.",
        "컴퓨터 이름이 아니라 채굴기 설정을 봅니다. Metal `init`은 풀, `prl1` 지급 주소, 워커 이름을 저장합니다. 지갑 파일은 자신의 Mac에 둡니다. 이 사이트는 `prl1`로 시작하고 bech32 문자가 이어지는 공개 주소만 저장합니다. Kryptex 연결 페이지는 지갑 또는 사용자명 뒤에 `/worker`를 붙인다고 합니다. 자동 환산을 켜면 Kryptex 사용자명으로 로그인하고, 인출은 PRL이 아니라 BTC, USDT 등일 수 있습니다. 사용자명, `0x` 문자열, 비밀키는 이 PRL 행으로 저장되지 않습니다. 환산된 비트코인이나 현금 잔액도 이 PRL 장부에 없습니다.",
        "주소가 열리면 선택한 출처만 읽습니다. 빠진 숫자는 알 수 없음으로 남고 0이 되지 않습니다. 워커 하나를 거르면 해시레이트와 온라인 상태의 범위만 바뀝니다. 미지급, 지급, 최근 보상은 주소 전체의 값입니다. 로그아웃 목록은 현재 브라우저에만 있습니다. 무료는 프로젝트마다 저장된 기기 3대, 로그인한 Pro는 100대입니다. 화면에 자동으로 나온 워커는 저장된 기기를 만들지 않습니다. 워커를 따로 기기로 저장하면 자리가 줄어들 수 있습니다. 같은 저장된 기기에 이 프로젝트를 여러 번 묶어도 한 대입니다. 잔액은 주소에서 공유되며 워커마다 수입으로 복사되지 않습니다. 충돌 분석은 별도 요금이 없습니다. 이 사이트의 Agent는 IOTA Train at Home용 Mac만 다루며 Pearl 채굴기를 켜거나 끄지 않습니다.",
        "## 두 풀을 한 장부로 읽지 않는 대조",
        "표는 이 모니터가 출처마다 보여주는 뜻입니다. 숫자는 풀이 그때 돌려준 값입니다. 필드가 없으면 알 수 없음입니다. 병합된 NOCK은 이 PRL 기록에 넣지 않습니다. 각 풀의 현재 지급 규칙은 그 풀에만 적용됩니다. 이 사이트는 공개 통계를 조회할 뿐 인출하지 않습니다.",
        "## 예: 출처를 잘못 고른 경우",
        "이것은 설명용 예이며 실제 지갑이 아닙니다. 설정은 `--pool luckypool`, 워커는 `m1`, 주소는 `prl1`입니다. 모니터가 기본 Kryptex에 있으면 그 주소의 Kryptex 기록이 없다고 나옵니다. Kryptex 장부에 없다는 뜻일 뿐, 주소 자체가 맞지 않는다는 뜻은 아닙니다. 출처를 LuckyPool로 바꾸고 주소는 유지합니다. 그 풀이 잠금 해제 0.02 PRL을 돌려주면 그 줄은 주소 전체의 값입니다. `m1`에 옮기거나 Kryptex 미지급·지급과 한 수입으로 뭉개지 마세요.",
        "## 다음에 할 일과 하지 못하는 일",
        "Metal 설정의 풀과 지급 주소를 [PRL 모니터](/projects/prl)의 같은 출처와 맞춘 뒤, 워커의 마지막 지분 시각이 움직이는지 봅니다. 각 풀의 현재 지급 규칙은 그 풀에만 적용됩니다. 이 사이트는 조회만 하며 인출을 보내거나 화면 금액에서 수수료를 빼지 않습니다. 호스트와 포트는 채굴기에 있는 설정과 풀의 현재 페이지를 따릅니다.",
        "다른 풀이 계속 어긋나면 [Kryptex와 LuckyPool이 장부를 나누는 이유](/learn/prl-luckypool-vs-kryptex)를 보세요. Mac 프로그램과 독립 GPU 채굴기의 차이는 [어떤 프로그램이 PRL을 캐는가](/learn/prl-mac-gpu-miner-compatibility)에 있습니다.",
      ],
      ja: [
        "MacがPearl（PRL）のシェアを送ったあとは、そのシェアを受け取ったプールを開いてからハッシュレートと報酬を読みます。[PRL監視](/projects/prl)の既定の取得元はKryptexで、LuckyPoolは別に選びます。Pearl Metalの作者は、Apple Silicon（M1からM5）が `--pool kryptex` または `--pool luckypool` で別々のプールへ接続すると書いています。台帳は二つです。同じ有効アドレスが両方のプールに別々の記録を持てます。片方に記録がなくても、もう片方が止まったことにはなりません。未払い、保留、支払済みは別の行です。一つの収入にまとめないでください。",
        "コンピュータ名ではなくマイナー設定を見ます。Metalの `init` はプール、`prl1` の受取アドレス、ワーカー名を保存します。ウォレットファイルは自分のMacに残します。このサイトが保存するのは `prl1` で始まりbech32文字が続く公開アドレスです。Kryptexの接続ページは、ウォレットまたはユーザー名に `/worker` を足すと書いています。自動換金ではKryptexのユーザー名でログインし、引出はPRLではなくBTCやUSDTなどになり得ます。ユーザー名、`0x` 文字列、秘密鍵はこのPRLの行として保存できません。換金後のビットコインや現金の残高も、このPRL台帳にはありません。",
        "アドレスが開いたら、選んだ取得元だけを読みます。欠けた数字は不明のままで、0にはなりません。ワーカーを一つに絞ると、見えるハッシュレートとオンライン状態の範囲だけが変わります。未払い、支払済み、直近の報酬はアドレス全体の値です。未ログインの一覧は今のブラウザにだけ残ります。無料はプロジェクトごとに保存した機器3台、ログインしたProは100台です。自動で並ぶワーカーは、保存した機器を増やしません。ワーカーを別に機器として保存すると枠を使います。同じ保存済み機器にこのプロジェクトを複数結んでも1台です。残高はアドレスで共有され、ワーカーごとの収入には複製されません。クラッシュ分析に別料金はありません。このサイトのAgentが操作するのはIOTA Train at HomeのMacだけで、Pearlのマイナーは起動も停止もしません。",
        "## 二つのプールを一つの帳簿にしない対照",
        "表は、この監視が取得元ごとに示す意味です。数字はそのときプールが返した値です。項目が無ければ不明です。マージされたNOCKはこのPRLの記録に入れません。各プールの現在の支払規則はそのプールだけに適用されます。このサイトは公開統計を照会するだけで、引き出しはしません。",
        "## 例: 取得元を取り違えたとき",
        "これは説明用の例で、実在のウォレットではありません。設定は `--pool luckypool`、ワーカーは `m1`、アドレスは `prl1` です。監視が既定のKryptexのままだと、そのアドレスのKryptex記録はないと出ます。Kryptexの台帳にない、という意味だけです。アドレス自体が一致しないという意味ではありません。取得元をLuckyPoolに切り替え、アドレスはそのままにします。そのプールが解除済み 0.02 PRL を返せば、その行はアドレス全体の値です。`m1` に写さず、Kryptexの未払いや支払済みと一つの収入にまとめないでください。",
        "## 次にすることと、できないこと",
        "Metal設定のプールと受取アドレスを [PRL監視](/projects/prl) の同じ取得元に合わせ、ワーカーの最終シェア時刻がまだ動いているか見ます。各プールの現在の支払規則はそのプールだけに適用されます。このサイトは照会するだけで、引き出しを送らず、表示額から手数料も引きません。ホストとポートは、マイナーに入っている設定とプールの現在のページに従います。",
        "もう一方のプールがまだ食い違うときは [KryptexとLuckyPoolが台帳を分ける理由](/learn/prl-luckypool-vs-kryptex) を読んでください。Mac用ソフトと独立GPUマイナーの違いは [どのプログラムがPRLを掘れるか](/learn/prl-mac-gpu-miner-compatibility) にあります。",
      ],
    },
    questions: {
      zh: [
        {
          question: "PRL 监控默认查哪个矿池？",
          answer:
            "默认是 Kryptex。LuckyPool 要在项目页另外选择。矿工配置里的矿池必须和页面选择一致，两边余额不会合并。",
        },
        {
          question: "Kryptex 用户名为什么加不进去？",
          answer:
            "自动兑换用 Kryptex 用户名登录，提取物可以不是 PRL。本站这条记录只接受 prl1 公开地址。用户名、0x 字符串和私钥都不能保存。",
        },
        {
          question: "只看一台 Worker 时，收益会变成单机的吗？",
          answer:
            "筛选只改变算力和在线状态的查看范围。未付、已付和近期收益仍属于整个已保存地址，不要按 Worker 再记一笔。",
        },
      ],
      "zh-TW": [
        {
          question: "PRL 監控預設查哪個礦池？",
          answer:
            "預設是 Kryptex。LuckyPool 要在專案頁另外選擇。礦工設定裡的礦池必須和頁面選擇一致，兩邊餘額不會合併。",
        },
        {
          question: "為什麼 Kryptex 用戶名加不進去？",
          answer:
            "自動兌換用 Kryptex 用戶名登入，提取物可以不是 PRL。本站這條紀錄只接受 prl1 公開地址。用戶名、0x 字串與私鑰都不能保存。",
        },
        {
          question: "只看一台 Worker 時，收益會變成單機的嗎？",
          answer:
            "篩選只改變算力與在線狀態的檢視範圍。未付、已付與近期收益仍屬於整個已儲存地址，不要按 Worker 再記一筆。",
        },
      ],
      en: [
        {
          question: "Which pool does PRL monitoring query by default?",
          answer:
            "Kryptex is the default. LuckyPool is a separate choice on the project page. The pool in the miner config has to match that choice. The two balances are not merged.",
        },
        {
          question: "Why can I not add a Kryptex username?",
          answer:
            "Auto-convert logs in with a Kryptex username, and the withdrawal may not be PRL. This PRL row accepts only a public prl1 address. A username, an 0x string, or a private key cannot be saved.",
        },
        {
          question: "Does filtering one worker turn rewards into a per-machine figure?",
          answer:
            "The filter changes which hashrate and online state you see. Unpaid, paid, and recent reward still belong to the saved address. Do not record that wallet balance again under the worker.",
        },
      ],
      ko: [
        {
          question: "PRL 모니터는 기본적으로 어느 풀을 조회하나요?",
          answer:
            "기본값은 Kryptex입니다. LuckyPool은 프로젝트 페이지에서 따로 고릅니다. 채굴기 설정의 풀과 페이지 선택이 같아야 하며 두 잔액은 합쳐지지 않습니다.",
        },
        {
          question: "Kryptex 사용자명은 왜 추가할 수 없나요?",
          answer:
            "자동 환산은 Kryptex 사용자명으로 로그인하고 인출이 PRL이 아닐 수 있습니다. 이 PRL 행은 공개 prl1 주소만 받습니다. 사용자명, 0x 문자열, 비밀키는 저장할 수 없습니다.",
        },
        {
          question: "워커 하나만 보면 보상이 그 기기의 값이 되나요?",
          answer:
            "필터는 해시레이트와 온라인 상태의 범위만 바꿉니다. 미지급, 지급, 최근 보상은 저장된 주소 전체의 값입니다. 그 지갑 잔액을 워커 아래에 다시 적지 마세요.",
        },
      ],
      ja: [
        {
          question: "PRL監視は既定でどのプールを見ますか？",
          answer:
            "既定はKryptexです。LuckyPoolはプロジェクトページで別に選びます。マイナー設定のプールとページの選択を一致させます。二つの残高は合算しません。",
        },
        {
          question: "Kryptexのユーザー名を追加できないのはなぜですか？",
          answer:
            "自動換金はKryptexのユーザー名でログインし、引出がPRLでないことがあります。このPRLの行は公開のprl1アドレスだけを受けます。ユーザー名、0x文字列、秘密鍵は保存できません。",
        },
        {
          question: "ワーカーを一台に絞ると、報酬はそのマシンの値になりますか？",
          answer:
            "絞り込みはハッシュレートとオンライン状態の範囲だけを変えます。未払い、支払済み、直近の報酬は保存したアドレス全体の値です。そのウォレット残高をワーカーの下に重ねて記さないでください。",
        },
      ],
    },
  },
  {
    slug: "prl-luckypool-vs-kryptex",
    project: "prl",
    published: "2026-10-23",
    modified: "2026-10-24",
    sources: [kryptex, luckyHome, metal],
    related: ["pearl-prl-mac-monitoring", "prl-locked-balance-payouts"],
    topic: {
      zh: "两个矿池",
      "zh-TW": "兩個礦池",
      en: "Two pools",
      ko: "두 풀",
      ja: "二つのプール",
    },
    title: {
      zh: "同一个有效 prl1，为什么 Kryptex 和 LuckyPool 各有一本账？",
      "zh-TW": "同一個有效 prl1，為什麼 Kryptex 與 LuckyPool 各有一本帳？",
      en: "Same valid prl1: why Kryptex and LuckyPool keep different records",
      ko: "같은 유효 prl1인데 Kryptex와 LuckyPool 기록이 왜 따로인가",
      ja: "同じ有効prl1なのにKryptexとLuckyPoolの記録が別な理由",
    },
    description: {
      zh: "Kryptex 与 LuckyPool 各记各的份额和余额。一边查无此地址，不能推断另一边也没有。两池未付是各自的账户行，不要盲加成一笔收入。",
      "zh-TW":
        "Kryptex 與 LuckyPool 各記各的份額和餘額。一邊查無此地址，不能推斷另一邊也沒有。兩池未付是各自的帳戶列，不要盲加成一筆收入。",
      en: "Kryptex and LuckyPool each keep their own shares and balances. No record on one side does not imply none on the other. Unpaid amounts are separate account rows. Do not fold them into one income figure.",
      ko: "Kryptex와 LuckyPool은 지분과 잔액을 따로 기록합니다. 한쪽이 없다고 해서 다른 쪽도 없는 것은 아닙니다. 두 풀의 미지급은 각자 계정 행이므로 한 수입으로 뭉개지 마세요.",
      ja: "KryptexとLuckyPoolはシェアと残高を別々に記録します。片方に記録がないからもう片方も無い、とは言えません。二つの未払いは別の口座行です。一つの収入にまとめないでください。",
    },
    summary: {
      zh: "矿工一次只把份额交给一个矿池。本站把同一 prl1 地址在 Kryptex 和 LuckyPool 分成两条记录。页面上的对不上，通常是来源不同，而不是余额被清零。",
      "zh-TW":
        "礦工一次只把份額交給一個礦池。本站把同一 prl1 地址在 Kryptex 與 LuckyPool 分成兩條紀錄。頁面上的對不上，通常是來源不同，而不是餘額被清零。",
      en: "A miner hands shares to one pool at a time. IOTA Watch keeps the same prl1 address as two rows, one for Kryptex and one for LuckyPool. A mismatch on screen is usually a different source, not a balance that was cleared.",
      ko: "채굴기는 한 번에 한 풀로 지분을 보냅니다. IOTA Watch는 같은 prl1 주소를 Kryptex용과 LuckyPool용 두 행으로 둡니다. 화면이 어긋나는 것은 보통 출처가 달라서이며, 잔액이 지워진 것이 아닙니다.",
      ja: "マイナーは一度に一つのプールへシェアを渡します。IOTA Watchは同じprl1アドレスをKryptex用とLuckyPool用の二行にします。画面が食い違うのは、通常は取得元が違うためで、残高が消されたためではありません。",
    },
    comparisonTitle: {
      zh: "两边各算各的",
      "zh-TW": "兩邊各算各的",
      en: "Each side keeps its own book",
      ko: "양쪽이 각자 기록",
      ja: "それぞれ別の帳簿",
    },
    comparison: {
      zh: {
        headers: ["问题", "Kryptex", "LuckyPool"],
        rows: [
          ["谁在记账", "Kryptex 的 PRL 矿池", "LuckyPool 的 Pearl 矿池"],
          ["同一枚有效地址", "可以另有 Kryptex 账户行", "可以另有 LuckyPool 账户行"],
          [
            "本站一条记录代表什么",
            "只代表这个地址在 Kryptex 的统计",
            "只代表这个地址在 LuckyPool 的统计",
          ],
          ["一边没有记录", "不推断 LuckyPool 也没有", "不推断 Kryptex 也没有"],
          ["NOCK", "这条 PRL 记录不包含 NOCK", "另一池的合并挖矿也不把 NOCK 写进 PRL"],
        ],
      },
      "zh-TW": {
        headers: ["問題", "Kryptex", "LuckyPool"],
        rows: [
          ["誰在記帳", "Kryptex 的 PRL 礦池", "LuckyPool 的 Pearl 礦池"],
          ["同一枚有效地址", "可以另有 Kryptex 帳戶列", "可以另有 LuckyPool 帳戶列"],
          [
            "本站一條紀錄代表什麼",
            "只代表這個地址在 Kryptex 的統計",
            "只代表這個地址在 LuckyPool 的統計",
          ],
          ["一邊沒有紀錄", "不推斷 LuckyPool 也沒有", "不推斷 Kryptex 也沒有"],
          ["NOCK", "這條 PRL 紀錄不包含 NOCK", "另一池的合併挖礦也不把 NOCK 寫進 PRL"],
        ],
      },
      en: {
        headers: ["Question", "Kryptex", "LuckyPool"],
        rows: [
          ["Who keeps the book", "Kryptex’s PRL pool", "LuckyPool’s Pearl pool"],
          [
            "The same valid address",
            "Can also have a Kryptex account row",
            "Can also have a LuckyPool account row",
          ],
          [
            "What one row here means",
            "Only this address on Kryptex",
            "Only this address on LuckyPool",
          ],
          [
            "No record on one side",
            "Does not imply LuckyPool has none",
            "Does not imply Kryptex has none",
          ],
          [
            "NOCK",
            "This PRL row does not include NOCK",
            "Merge mining on the other pool does not put NOCK into PRL",
          ],
        ],
      },
      ko: {
        headers: ["질문", "Kryptex", "LuckyPool"],
        rows: [
          ["누가 기록하나", "Kryptex의 PRL 풀", "LuckyPool의 Pearl 풀"],
          [
            "같은 유효 주소",
            "Kryptex 계정 행을 따로 가질 수 있음",
            "LuckyPool 계정 행을 따로 가질 수 있음",
          ],
          ["여기의 한 행", "이 주소의 Kryptex 통계만", "이 주소의 LuckyPool 통계만"],
          [
            "한쪽에 기록 없음",
            "LuckyPool도 없다고 추론하지 않음",
            "Kryptex도 없다고 추론하지 않음",
          ],
          [
            "NOCK",
            "이 PRL 행은 NOCK을 포함하지 않음",
            "다른 풀의 병합 채굴도 NOCK을 PRL에 넣지 않음",
          ],
        ],
      },
      ja: {
        headers: ["質問", "Kryptex", "LuckyPool"],
        rows: [
          ["誰が記帳するか", "KryptexのPRLプール", "LuckyPoolのPearlプール"],
          ["同じ有効アドレス", "Kryptexの口座行を別に持てる", "LuckyPoolの口座行を別に持てる"],
          ["ここでの一行", "このアドレスのKryptex統計だけ", "このアドレスのLuckyPool統計だけ"],
          ["片方に記録がない", "LuckyPoolにも無いとは推論しない", "Kryptexにも無いとは推論しない"],
          ["NOCK", "このPRLの行はNOCKを含まない", "もう一方のマージ採掘もNOCKをPRLに入れない"],
        ],
      },
    },
    body: {
      zh: [
        "同一个 `prl1` 地址在 Kryptex 和 LuckyPool 对不上，是因为两家矿池各自接收份额、各自记未付和已付。打开 [PRL 监控](/projects/prl) 时，默认行是 Kryptex；要看 LuckyPool，需要把同一地址再存成另一条，并选 LuckyPool。两条记录不会合成一个总数。",
        "矿工的 `--pool` 决定份额送去哪一家。以你机器上的配置为准。同一枚有效 prl1 可以在两家各有一条账户记录，记录不同不表示地址写错。",
        "各池当前的付款规则只约束那一家。本站查询公开统计，不代替矿池提现。合并挖矿的 NOCK 不计入这条 PRL 记录。",
        "## 查无此地址只属于你正在看的那一边",
        "你选中的来源没有这个地址的记录时，页面告诉你的是这一边没有。它不会把另一边改成 0，也不会替你判断另一边是否在线。查询失败同样不是 0：失败时余额保持未知。只有矿池明确表示没有该地址，才是“没有记录”。",
        "## 例子：两笔记在一起看",
        "说明用数字，不是真实钱包。同一枚地址在 Kryptex 有未付 1.2 PRL，在 LuckyPool 有已解锁 0.04 PRL、锁定 0.01 PRL。这是两行账户。不要把未付、锁定和已解锁盲加成一笔收入，也不要把缺失的锁定当成 0 去减。Worker 两边都叫 `mac-1` 时，仍是两个矿池里的两台登记，余额挂在地址上。",
        "## 接下来怎么核对",
        "看矿工日志或配置里的矿池名字，在 [PRL 监控](/projects/prl) 只打开那一家，读未付、已付和最后份额时间。要比较另一家，单独加一条并切换来源。付款是否达到门槛，打开你正在使用的矿池当前页面。各池规则只适用于那一家。本站只查询，不提现。",
        "字段分别表示什么，见 [未解锁、已解锁和已付](/learn/prl-locked-balance-payouts)。Mac 上先选对来源，见 [怎样查算力和收益](/learn/pearl-prl-mac-monitoring)。",
      ],
      "zh-TW": [
        "同一個 `prl1` 地址在 Kryptex 與 LuckyPool 對不上，是因為兩家礦池各自接收份額、各自記未付與已付。打開 [PRL 監控](/projects/prl) 時，預設列是 Kryptex；要看 LuckyPool，需要把同一地址再存成另一條，並選 LuckyPool。兩條紀錄不會合成一個總數。",
        "礦工的 `--pool` 決定份額送去哪一家。以你機器上的設定為準。同一枚有效 prl1 可以在兩家各有一條帳戶紀錄，紀錄不同不表示地址寫錯。",
        "各池目前的付款規則只約束那一家。本站查詢公開統計，不代替礦池提現。合併挖礦的 NOCK 不計入這條 PRL 紀錄。",
        "## 查無此地址只屬於你正在看的那一邊",
        "你選中的來源沒有這個地址的紀錄時，頁面告訴你的是這一邊沒有。它不會把另一邊改成 0，也不會替你判斷另一邊是否在線。查詢失敗同樣不是 0：失敗時餘額保持未知。只有礦池明確表示沒有該地址，才是「沒有紀錄」。",
        "## 例子：兩筆記在一起看",
        "說明用數字，不是真實錢包。同一枚地址在 Kryptex 有未付 1.2 PRL，在 LuckyPool 有已解鎖 0.04 PRL、鎖定 0.01 PRL。這是兩列帳戶。不要把未付、鎖定和已解鎖盲加成一筆收入，也不要把缺失的鎖定當成 0 去減。Worker 兩邊都叫 `mac-1` 時，仍是兩個礦池裡的兩筆登記，餘額掛在地址上。",
        "## 接下來怎麼核對",
        "看礦工日誌或設定裡的礦池名字，在 [PRL 監控](/projects/prl) 只打開那一家，讀未付、已付與最後份額時間。要比較另一家，單獨加一條並切換來源。付款是否達到門檻，打開你正在使用的礦池目前頁面。各池規則只適用於那一家。本站只查詢，不提現。",
        "欄位分別表示什麼，見 [未解鎖、已解鎖和已付](/learn/prl-locked-balance-payouts)。Mac 上先選對來源，見 [怎樣查算力與收益](/learn/pearl-prl-mac-monitoring)。",
      ],
      en: [
        "The same `prl1` address does not match across Kryptex and LuckyPool because each pool accepts shares and records unpaid and paid amounts on its own. On [PRL monitoring](/projects/prl) the default row is Kryptex. To see LuckyPool, save the same address again and choose LuckyPool. The two rows are not combined into one total.",
        "Pearl Metal’s `--pool` chooses which pool receives the shares. Use the config on your machine. The same valid prl1 can have an account row at each pool. Different records do not mean the address text is wrong.",
        "Each pool’s current payout policy applies only to that pool. This site queries public stats and does not withdraw for you. Merged NOCK is not included in this PRL record.",
        "## “No record” belongs only to the side you are viewing",
        "When the selected source has no record for the address, the page is talking about that side. It does not set the other side to zero, and it does not decide whether the other side is online. A failed lookup is also not zero: the balance stays unknown. “No record” applies when the pool says the address is absent.",
        "## Example: reading both notes together",
        "These figures illustrate two account rows. They are not a real wallet. The same address shows 1.2 PRL unpaid on Kryptex, and 0.04 PRL unlocked plus 0.01 PRL locked on LuckyPool. Keep the rows separate. Do not fold unpaid, locked, and unlocked into one income figure. If locked is missing, it is unknown. Do not treat it as zero and subtract. A worker named `mac-1` on both sides is still two registrations. The balances stay on the address.",
        "## What to check next",
        "Read the pool name in the miner log or config, open only that pool on [PRL monitoring](/projects/prl), and read unpaid, paid, and last share time. To compare the other pool, add a separate row and switch the source. Whether a payout threshold is met is on the current page of the pool you use. Each pool’s rule applies only there. This site only queries. It does not withdraw.",
        "For what each amount means, see [unlocked, locked, and paid](/learn/prl-locked-balance-payouts). To pick the source on a Mac first, see [hashrate and rewards](/learn/pearl-prl-mac-monitoring).",
      ],
      ko: [
        "같은 `prl1` 주소가 Kryptex와 LuckyPool에서 일치하지 않는 이유는 각 풀이 지분을 받고 미지급과 지급을 따로 적기 때문입니다. [PRL 모니터](/projects/prl)의 기본 행은 Kryptex입니다. LuckyPool을 보려면 같은 주소를 다시 저장하고 LuckyPool을 고릅니다. 두 행은 하나의 합계로 합쳐지지 않습니다.",
        "Pearl Metal의 `--pool`이 지분을 받을 풀을 정합니다. 자기 기기의 설정을 보세요. 같은 유효 prl1이 두 풀에 각각 계정 행을 가질 수 있습니다. 기록이 다르다고 주소가 틀린 것은 아닙니다.",
        "각 풀의 현재 지급 규칙은 그 풀에만 적용됩니다. 이 사이트는 공개 통계를 조회할 뿐 인출하지 않습니다. 병합된 NOCK은 이 PRL 기록에 포함되지 않습니다.",
        "## 「기록 없음」은 지금 보는 쪽에만 해당합니다",
        "선택한 출처에 주소 기록이 없으면, 페이지는 그 쪽을 말하는 것입니다. 다른 쪽을 0으로 바꾸지 않고, 다른 쪽이 온라인인지도 판단하지 않습니다. 조회 실패도 0이 아닙니다. 잔액은 알 수 없음으로 남습니다. 「기록 없음」은 풀이 그 주소가 없다고 말할 때 적용됩니다.",
        "## 예: 두 줄을 같이 읽기",
        "이 숫자는 두 계정 행을 보여 줄 뿐 실제 지갑이 아닙니다. 같은 주소가 Kryptex에서 미지급 1.2 PRL, LuckyPool에서 잠금 해제 0.04 PRL과 잠금 0.01 PRL입니다. 행은 따로 둡니다. 미지급, 잠금, 잠금 해제를 한 수입으로 뭉개지 마세요. 잠금 필드가 없으면 알 수 없음이며 0으로 빼지 마세요. 워커 이름이 양쪽 다 `mac-1`이어도 두 풀의 두 등록입니다. 잔액은 주소에 있습니다.",
        "## 다음에 확인할 것",
        "채굴기 로그나 설정의 풀 이름을 읽고 [PRL 모니터](/projects/prl)에서 그 풀만 연 뒤 미지급, 지급, 마지막 지분 시각을 봅니다. 다른 풀을 비교하려면 행을 따로 추가하고 출처를 바꿉니다. 지급 기준에 닿았는지는 사용 중인 풀의 현재 페이지에서 확인합니다. 각 풀의 규칙은 그 풀에만 적용됩니다. 이 사이트는 조회만 하며 인출하지 않습니다.",
        "각 금액의 뜻은 [잠금 해제, 잠금, 지급](/learn/prl-locked-balance-payouts)을 보세요. Mac에서 출처를 먼저 고르려면 [해시레이트와 보상](/learn/pearl-prl-mac-monitoring)을 보세요.",
      ],
      ja: [
        "同じ `prl1` アドレスがKryptexとLuckyPoolで一致しないのは、各プールがシェアを受け取り、未払いと支払済みを別々に記録するからです。[PRL監視](/projects/prl)の既定の行はKryptexです。LuckyPoolを見るには同じアドレスをもう一度保存し、LuckyPoolを選びます。二つの行は一つの合計にはなりません。",
        "Pearl Metalの `--pool` が、シェアを渡すプールを決めます。自分のマシンの設定を見てください。同じ有効prl1が二つのプールに別々の口座行を持てます。記録が違うことは、アドレスの表記が間違っているという意味ではありません。",
        "各プールの現在の支払規則はそのプールだけに適用されます。このサイトは公開統計を照会するだけで、引き出しはしません。マージされたNOCKはこのPRLの記録に含まれません。",
        "## 「記録なし」は今見ている側だけに属します",
        "選んだ取得元にそのアドレスの記録がないとき、ページが言っているのはその側です。もう一方を0にはせず、もう一方がオンラインかも決めません。照会の失敗も0ではありません。残高は不明のままです。「記録なし」は、プールがそのアドレスは無いと言うときに使います。",
        "## 例: 二つの行を並べて読む",
        "この数字は二つの口座行を示すもので、実在のウォレットではありません。同じアドレスがKryptexで未払い1.2 PRL、LuckyPoolで解除済み0.04 PRLとロック0.01 PRLです。行は分けたままにします。未払い、ロック、解除済みを一つの収入にまとめないでください。ロックの項目が無ければ不明です。0とみなして引かないでください。両側のワーカー名が `mac-1` でも二つの登録です。残高はアドレスに付きます。",
        "## 次に照合すること",
        "マイナーのログか設定にあるプール名を読み、[PRL監視](/projects/prl)ではそのプールだけを開いて、未払い、支払済み、最終シェア時刻を見ます。もう一方を比べるなら行を別に追加して取得元を切り替えます。支払基準に達したかは、使っているプールの現在のページで確認します。各プールの規則はそのプールだけに適用されます。このサイトは照会するだけで、引き出しはしません。",
        "各金額の意味は [解除済み、ロック、支払済み](/learn/prl-locked-balance-payouts) を見てください。Macで先に取得元を選ぶ手順は [ハッシュレートと報酬](/learn/pearl-prl-mac-monitoring) にあります。",
      ],
    },
    questions: {
      zh: [
        {
          question: "LuckyPool 查无此地址，能否说明 Kryptex 也没有？",
          answer:
            "不能。两边账本独立。一边没有记录，只说明这一边没有。另一边要单独选择来源再查，不能据此写成 0。",
        },
        {
          question: "首页写着 Pearl + Nock，未付里是否包含 NOCK？",
          answer: "不包含。这条 PRL 记录只显示 PRL，不把合并挖矿的 NOCK 并进未付。",
        },
        {
          question: "可以把两池未付加起来当成总收益吗？",
          answer:
            "两行要分开看。它们是两家矿池各自的账户。不要把未付、已付和待入账盲加成一笔收入，也不要因为地址相同就当成同一笔重复计算。",
        },
      ],
      "zh-TW": [
        {
          question: "LuckyPool 查無此地址，能否說明 Kryptex 也沒有？",
          answer:
            "不能。兩邊帳本獨立。一邊沒有紀錄，只說明這一邊沒有。另一邊要另外選擇來源再查，不能據此寫成 0。",
        },
        {
          question: "首頁寫著 Pearl + Nock，未付裡是否包含 NOCK？",
          answer: "不包含。這條 PRL 紀錄只顯示 PRL，不把合併挖礦的 NOCK 併進未付。",
        },
        {
          question: "可以把兩池未付加起來當成總收益嗎？",
          answer:
            "兩列要分開看。它們是兩家礦池各自的帳戶。不要把未付、已付和待入帳盲加成一筆收入，也不要因為地址相同就當成同一筆重複計算。",
        },
      ],
      en: [
        {
          question: "If LuckyPool has no record, does that mean Kryptex has none?",
          answer:
            "No. The ledgers are separate. No record means that side has none. Check the other side by selecting it. Do not write it as zero from this result.",
        },
        {
          question: "The homepage says Pearl + Nock. Is NOCK inside the unpaid PRL?",
          answer: "No. This PRL record shows PRL only. Merged NOCK is not included in unpaid.",
        },
        {
          question: "Can I add both pools’ unpaid amounts into one total reward?",
          answer:
            "Keep the rows separate. Each figure belongs to that pool’s account. Do not fold unpaid, paid, and pending into one income figure, and do not count the same address twice as if the pools were one ledger.",
        },
      ],
      ko: [
        {
          question: "LuckyPool에 기록이 없으면 Kryptex에도 없나요?",
          answer:
            "아닙니다. 장부는 분리되어 있습니다. 기록 없음은 그 쪽만의 뜻입니다. 다른 쪽은 출처를 골라 따로 확인하세요. 이 결과로 0이라고 쓰지 않습니다.",
        },
        {
          question: "홈페이지에 Pearl + Nock이 있으면 미지급 PRL에 NOCK이 포함되나요?",
          answer:
            "포함되지 않습니다. 이 PRL 기록은 PRL만 보여 주며, 병합된 NOCK은 미지급에 넣지 않습니다.",
        },
        {
          question: "두 풀의 미지급을 더해 총수익으로 볼 수 있나요?",
          answer:
            "행은 따로 둡니다. 각 숫자는 그 풀의 계정입니다. 미지급, 지급, 대기를 한 수입으로 뭉개지 말고, 주소가 같다고 같은 장부를 두 번 세지 마세요.",
        },
      ],
      ja: [
        {
          question: "LuckyPoolに記録がなければ、Kryptexにも無いのですか？",
          answer:
            "いいえ。台帳は別です。記録なしはその側だけを指します。もう一方は取得元を選んで別に確認します。この結果から0とは書きません。",
        },
        {
          question: "ホームページがPearl + Nockなら、未払いPRLにNOCKは含まれますか？",
          answer:
            "含まれません。このPRLの記録はPRLだけを示し、マージされたNOCKは未払いに入れません。",
        },
        {
          question: "二つのプールの未払いを足して総報酬にしてよいですか？",
          answer:
            "行は分けたままにします。各数字はそのプールの口座です。未払い、支払済み、保留を一つの収入にまとめず、アドレスが同じだからといって同じ台帳を二度数えないでください。",
        },
      ],
    },
  },
  {
    slug: "prl-worker-accepted-shares",
    project: "prl",
    published: "2026-10-23",
    modified: "2026-10-24",
    sources: [kryptex, metal],
    related: ["pearl-prl-mac-monitoring", "prl-locked-balance-payouts"],
    topic: {
      zh: "Worker 与份额",
      "zh-TW": "Worker 與份額",
      en: "Workers and shares",
      ko: "워커와 지분",
      ja: "ワーカーとシェア",
    },
    title: {
      zh: "PRL 的 Worker 不是另一个钱包：接受份额要看哪一行？",
      "zh-TW": "PRL 的 Worker 不是另一個錢包：接受份額要看哪一列？",
      en: "A PRL worker is not another wallet: where accepted shares show up",
      ko: "PRL 워커는 다른 지갑이 아니다: 수락된 지분은 어디에 보이나",
      ja: "PRLのワーカーは別ウォレットではない: 受理シェアはどこに出るか",
    },
    description: {
      zh: "Worker 是地址下面的机器标签。余额仍属于 prl1 地址。Kryptex 这本监控不提供接受份额计数；LuckyPool 只有返回该计数时才显示。",
      "zh-TW":
        "Worker 是地址下面的機器標籤。餘額仍屬於 prl1 地址。Kryptex 這本監控不提供接受份額計數；LuckyPool 只有回傳該計數時才顯示。",
      en: "A worker is a machine label under an address. The balance still belongs to the prl1 address. Kryptex monitoring here has no accepted-share count. LuckyPool shows one only when that pool returns it.",
      ko: "워커는 주소 아래의 기기 이름입니다. 잔액은 여전히 prl1 주소의 것입니다. 여기의 Kryptex 모니터에는 수락 지분 수가 없습니다. LuckyPool은 풀이 그 수를 돌려줄 때만 보여 줍니다.",
      ja: "ワーカーはアドレスの下のマシン名です。残高は引き続きprl1アドレスのものです。ここのKryptex監視には受理シェア数はありません。LuckyPoolはプールがその数を返したときだけ表示します。",
    },
    summary: {
      zh: "Kryptex 要求钱包或用户名后面加 Worker。Pearl Metal 也把 Worker 当成标签，统计挂在地址下。把 Worker 名字再存成一条地址，不会得到第二本账。",
      "zh-TW":
        "Kryptex 要求錢包或用戶名後面加 Worker。Pearl Metal 也把 Worker 當成標籤，統計掛在地址下。把 Worker 名字再存成一條地址，不會得到第二本帳。",
      en: "Kryptex asks for a worker after the wallet or username. Pearl Metal also treats the worker as a label, with stats under the address. Saving the worker name as another address does not create a second ledger.",
      ko: "Kryptex는 지갑이나 사용자명 뒤에 워커를 요구합니다. Pearl Metal도 워커를 이름표로 보고 통계는 주소 아래에 둡니다. 워커 이름을 다른 주소로 저장해도 두 번째 장부는 생기지 않습니다.",
      ja: "Kryptexはウォレットまたはユーザー名のあとにワーカーを求めます。Pearl Metalもワーカーをラベルとし、統計はアドレスの下です。ワーカー名を別アドレスとして保存しても、二つ目の台帳にはなりません。",
    },
    comparisonTitle: {
      zh: "地址、Worker、接受份额",
      "zh-TW": "地址、Worker、接受份額",
      en: "Address, worker, accepted shares",
      ko: "주소, 워커, 수락 지분",
      ja: "アドレス、ワーカー、受理シェア",
    },
    comparison: {
      zh: {
        headers: ["你看到的", "它是什么", "它不是什么"],
        rows: [
          ["prl1 地址", "矿池按它记余额和已付", "Worker 的名字"],
          ["Worker", "这台机器在该地址下的标签", "另一枚钱包，或另一笔未付"],
          ["在线 / 离线", "最近有没有份额或矿池给出的状态", "收益已经到账"],
          ["接受份额", "LuckyPool 返回计数时才有", "Kryptex 监控里的余额，或收益保证"],
          ["最后份额时间", "这个标签最近一次被看见", "付款时间"],
        ],
      },
      "zh-TW": {
        headers: ["你看到的", "它是什麼", "它不是什麼"],
        rows: [
          ["prl1 地址", "礦池按它記餘額和已付", "Worker 的名字"],
          ["Worker", "這台機器在該地址下的標籤", "另一枚錢包，或另一筆未付"],
          ["在線 / 離線", "最近有沒有份額或礦池給出的狀態", "收益已經到帳"],
          ["接受份額", "LuckyPool 回傳計數時才有", "Kryptex 監控裡的餘額，或收益保證"],
          ["最後份額時間", "這個標籤最近一次被看見", "付款時間"],
        ],
      },
      en: {
        headers: ["What you see", "What it is", "What it is not"],
        rows: [
          ["prl1 address", "The pool’s key for balance and paid", "A worker name"],
          [
            "Worker",
            "This machine’s label under that address",
            "Another wallet, or a second unpaid balance",
          ],
          [
            "Online / offline",
            "Recent shares, or the status the pool sent",
            "Proof that a reward was paid",
          ],
          [
            "Accepted shares",
            "Shown when LuckyPool returns a count",
            "The Kryptex balance, or a promise of earnings",
          ],
          ["Last share time", "When this label was last seen", "A payout time"],
        ],
      },
      ko: {
        headers: ["보이는 것", "의미", "아닌 것"],
        rows: [
          ["prl1 주소", "풀이 잔액과 지급을 매기는 키", "워커 이름"],
          ["워커", "그 주소 아래 이 기기의 이름", "다른 지갑, 또는 두 번째 미지급"],
          ["온라인 / 오프라인", "최근 지분 또는 풀이 준 상태", "보상이 지급되었다는 증거"],
          ["수락 지분", "LuckyPool이 횟수를 돌려줄 때만", "Kryptex 잔액, 또는 수익 약속"],
          ["마지막 지분 시각", "이 이름이 마지막으로 보인 때", "지급 시각"],
        ],
      },
      ja: {
        headers: ["見ているもの", "意味", "意味しないもの"],
        rows: [
          ["prl1アドレス", "プールが残高と支払を付ける鍵", "ワーカー名"],
          [
            "ワーカー",
            "そのアドレスの下にあるこのマシンのラベル",
            "別のウォレット、または二つ目の未払い",
          ],
          [
            "オンライン / オフライン",
            "直近のシェア、またはプールが返した状態",
            "報酬が支払われた証拠",
          ],
          ["受理シェア", "LuckyPoolが回数を返したときだけ", "Kryptexの残高、または収益の約束"],
          ["最終シェア時刻", "このラベルが最後に見えたとき", "支払時刻"],
        ],
      },
    },
    body: {
      zh: [
        "PRL 监控里的 Worker 是收款地址下面的机器标签，不是第二枚钱包。要看接受了多少份额，先确认你打开的是 [PRL 监控](/projects/prl) 里实际接份额的那一家，再在该地址的 Worker 列表里看名称和最后份额时间。列表上的一行不单独拥有未付余额。",
        "Kryptex 的 PRL 连接页写明格式是钱包或用户名，加上 `/worker`。SOLO 则使用页面给出的 solo 钱包写法。Pearl Metal 的作者把 `--worker` 说明成任意标签，并写明矿池面板按 `地址.worker` 显示。因此 `m1` 和 `desk` 可以同时挂在同一个 `prl1` 下面，分别表示两台 Mac 或两个进程。把 `m1` 粘贴进地址栏不会打开新账本：地址校验要的是 `prl1` 开头的公开地址。",
        "在线或离线回答的是“最近有没有见到这个标签”，不是“这笔 PRL 已经付出”。Kryptex 来源使用矿池给的在线或离线状态，并带最后份额时间。地址算力使用矿池为每台 Worker 报出的平均或当前速率。只要有一台没有报出速率，地址总算力就是未知，而不是 0。LuckyPool 来源用最后出现时间判断新旧：大约 20 分钟内视为在线，超过大约 30 分钟视为离线，中间或时间异常则是未知。这是本站对“还在不在”的显示，不是矿池承诺的计费窗口。",
        "## 接受份额计数只有一边有",
        "LuckyPool 的地址统计若带有接受份额计数，监控会显示这个整数。没有该字段、或数字不能当作完整次数时，显示未知，不显示 0。Kryptex 这条监控不读取接受份额计数。你在 Kryptex 页面上如果看到份额，那是矿池自己的页面；不要把本站 Kryptex 行的未付余额当成份额次数。Kryptex 页面还写明该池有固定份额难度，并说明难度不影响收益。那是矿池对难度的陈述。难度数字会随页面更新，本站不用旧清单代替你矿工里的当前设置。",
        "## 例子：两台机器、一笔余额",
        "说明用例子。地址是一枚 `prl1`，LuckyPool 上有 Worker `m1` 与 `desk`。`m1` 的最后份额是 5 分钟前，显示在线；`desk` 是 2 小时前，显示离线。已解锁余额 0.02 PRL 写在地址上。你不能写成 `m1` 有 0.02、`desk` 有 0。若接受份额计数没有返回，次数是未知。若你改查 Kryptex，这一侧本来就没有接受份额计数，即使 Worker 名字相同，也不能把 LuckyPool 的次数抄过来。",
        "## 接下来看什么",
        "在矿工参数里确认 Worker 字符串，到 [PRL 监控](/projects/prl) 对一下同名标签的最后份额时间。要核对钱，回到地址上的未付、待入账和已付，见 [锁定余额与付款](/learn/prl-locked-balance-payouts)。Mac 应先选对矿池，见 [算力、Worker 和收益](/learn/pearl-prl-mac-monitoring)。本站不启动矿工，也不能把离线 Worker 远程叫醒。",
      ],
      "zh-TW": [
        "PRL 監控裡的 Worker 是收款地址下面的機器標籤，不是第二枚錢包。要看接受了多少份額，先確認你打開的是 [PRL 監控](/projects/prl) 裡實際接份額的那一家，再在該地址的 Worker 列表裡看名稱與最後份額時間。列表上的一列不單獨擁有未付餘額。",
        "Kryptex 的 PRL 連線頁寫明格式是錢包或用戶名，加上 `/worker`。SOLO 則使用頁面給出的 solo 錢包寫法。Pearl Metal 的作者把 `--worker` 說明成任意標籤，並寫明礦池面板按 `地址.worker` 顯示。因此 `m1` 與 `desk` 可以同時掛在同一個 `prl1` 下面，分別表示兩台 Mac 或兩個行程。把 `m1` 貼進地址欄不會打開新帳本：地址檢查要的是 `prl1` 開頭的公開地址。",
        "在線或離線回答的是「最近有沒有見到這個標籤」，不是「這筆 PRL 已經付出」。Kryptex 來源使用礦池給的在線或離線狀態，並帶最後份額時間。地址算力使用礦池為每台 Worker 報出的平均或目前速率。只要有一台沒有報出速率，地址總算力就是未知，而不是 0。LuckyPool 來源用最後出現時間判斷新舊：大約 20 分鐘內視為在線，超過大約 30 分鐘視為離線，中間或時間異常則是未知。這是本站對「還在不在」的顯示，不是礦池承諾的計費窗口。",
        "## 接受份額計數只有一邊有",
        "LuckyPool 的地址統計若帶有接受份額計數，監控會顯示這個整數。沒有該欄位、或數字不能當作完整次數時，顯示未知，不顯示 0。Kryptex 這條監控不讀取接受份額計數。你在 Kryptex 頁面上如果看到份額，那是礦池自己的頁面；不要把本站 Kryptex 列的未付餘額當成份額次數。Kryptex 頁面還寫明該池有固定份額難度，並說明難度不影響收益。那是礦池對難度的陳述。難度數字會隨頁面更新，本站不用舊清單代替你礦工裡的目前設定。",
        "## 例子：兩台機器、一筆餘額",
        "說明用例子。地址是一枚 `prl1`，LuckyPool 上有 Worker `m1` 與 `desk`。`m1` 的最後份額是 5 分鐘前，顯示在線；`desk` 是 2 小時前，顯示離線。已解鎖餘額 0.02 PRL 寫在地址上。你不能寫成 `m1` 有 0.02、`desk` 有 0。若接受份額計數沒有回傳，次數是未知。若你改查 Kryptex，這一側本來就沒有接受份額計數，即使 Worker 名字相同，也不能把 LuckyPool 的次數抄過來。",
        "## 接下來看什麼",
        "在礦工參數裡確認 Worker 字串，到 [PRL 監控](/projects/prl) 對一下同名標籤的最後份額時間。要核對錢，回到地址上的未付、待入帳與已付，見 [鎖定餘額與付款](/learn/prl-locked-balance-payouts)。Mac 應先選對礦池，見 [算力、Worker 與收益](/learn/pearl-prl-mac-monitoring)。本站不啟動礦工，也不能把離線 Worker 遠端叫醒。",
      ],
      en: [
        "A worker in PRL monitoring is a machine label under the payout address, not a second wallet. To see whether shares were accepted, open the pool that actually took them on [PRL monitoring](/projects/prl), then read the name and last share time in that address’s worker list. A row in the list does not own the unpaid balance by itself.",
        "Kryptex’s PRL connection page states the form as a wallet or username plus `/worker`. SOLO uses the solo wallet form that page gives. The Pearl Metal author describes `--worker` as any label you like, and says the pool dashboard shows stats under `address.worker`. So `m1` and `desk` can both sit under one `prl1`, for two Macs or two processes. Pasting `m1` into the address field does not open a new ledger. The address check wants a public address that starts with `prl1`.",
        "Online or offline answers “has this label been seen lately”, not “has this PRL been paid”. The Kryptex source uses the online or offline status the pool sent, with a last share time. The address hashrate uses the average or current rate the pool reported for each worker. If any listed worker has no reported rate, the address hashrate is unknown, not zero. The LuckyPool source judges freshness from the last time seen: about 20 minutes counts as online, past about 30 minutes counts as offline, and the gap or a bad time stays unknown. That is this site’s “still here” display, not a billing window the pool promised.",
        "## An accepted-share count exists on one side",
        "When LuckyPool’s address stats include an accepted-share count, monitoring shows that whole number. If the field is missing, or the value cannot be used as a complete count, the display is unknown, not zero. The Kryptex row in this monitor does not read an accepted-share count. Shares you see on Kryptex’s own website belong to that website. Do not treat the unpaid balance on the Kryptex row here as a share count. Kryptex’s page also states a fixed share difficulty and says difficulty does not change earnings. That is the pool’s statement about difficulty. The number can change with the page. This site does not replace the setting in your miner with an old list.",
        "## Example: two machines, one balance",
        "This is an illustration. The address is a `prl1`. On LuckyPool the workers are `m1` and `desk`. `m1` last shared 5 minutes ago and shows online. `desk` last shared 2 hours ago and shows offline. The unlocked balance of 0.02 PRL is on the address. You cannot write 0.02 for `m1` and 0 for `desk`. If no accepted-share count came back, the count is unknown. If you switch the lookup to Kryptex, that side has no accepted-share count here. Matching worker names do not let you copy LuckyPool’s count across.",
        "## What to inspect next",
        "Confirm the worker string in the miner arguments, then match that label’s last share time on [PRL monitoring](/projects/prl). For the money, go back to the address’s unpaid, pending, and paid amounts in [locked balance and payouts](/learn/prl-locked-balance-payouts). On a Mac, pick the pool first: [hashrate, workers, and rewards](/learn/pearl-prl-mac-monitoring). This site does not start the miner and cannot wake an offline worker remotely.",
      ],
      ko: [
        "PRL 모니터의 워커는 지급 주소 아래의 기기 이름이지 두 번째 지갑이 아닙니다. 지분이 수락됐는지 보려면 [PRL 모니터](/projects/prl)에서 실제로 지분을 받은 풀을 연 다음, 그 주소의 워커 목록에서 이름과 마지막 지분 시각을 읽습니다. 목록의 한 행이 미지급 잔액을 따로 갖지 않습니다.",
        "Kryptex PRL 연결 페이지는 형식을 지갑 또는 사용자명에 `/worker`를 붙인 것으로 적습니다. SOLO는 그 페이지의 solo 지갑 형식을 씁니다. Pearl Metal 저자는 `--worker`를 원하는 이름표라고 하고, 풀 화면은 `주소.worker` 아래에 통계를 보여 준다고 합니다. 그래서 `m1`과 `desk`가 하나의 `prl1` 아래에 두 Mac 또는 두 프로세스로 있을 수 있습니다. `m1`을 주소 칸에 붙여도 새 장부는 열리지 않습니다. 주소 확인은 `prl1`로 시작하는 공개 주소를 요구합니다.",
        "온라인 또는 오프라인은 “이 이름이 최근에 보였는가”에 답할 뿐 “이 PRL이 지급됐는가”에는 답하지 않습니다. Kryptex 출처는 풀이 보낸 온라인 또는 오프라인 상태와 마지막 지분 시각을 씁니다. 주소 해시레이트는 풀이 각 워커에 대해 보고한 평균 또는 현재 속도를 씁니다. 한 대라도 보고된 속도가 없으면 주소 해시레이트는 0이 아니라 알 수 없음입니다. LuckyPool 출처는 마지막으로 보인 시각으로 신선도를 봅니다. 약 20분 이내면 온라인, 약 30분을 넘으면 오프라인, 그 사이나 시각이 이상하면 알 수 없음입니다. 이것은 이 사이트의 “아직 있는가” 표시이며 풀이 약속한 정산 창이 아닙니다.",
        "## 수락 지분 횟수는 한쪽에만 있습니다",
        "LuckyPool 주소 통계에 수락 지분 횟수가 있으면 모니터는 그 정수를 보여 줍니다. 필드가 없거나 완전한 횟수로 쓸 수 없으면 0이 아니라 알 수 없음입니다. 이 모니터의 Kryptex 행은 수락 지분 횟수를 읽지 않습니다. Kryptex 웹사이트에서 보는 지분은 그 웹사이트의 것입니다. 여기 Kryptex 행의 미지급 잔액을 지분 횟수로 보지 마세요. Kryptex 페이지는 고정 지분 난이도도 적고, 난이도는 수익을 바꾸지 않는다고 합니다. 풀이 난이도에 대해 한 말입니다. 숫자는 페이지와 함께 바뀔 수 있습니다. 이 사이트는 채굴기 안의 현재 설정을 오래된 목록으로 바꾸지 않습니다.",
        "## 예: 기기 두 대, 잔액 하나",
        "설명용 예입니다. 주소는 `prl1`이고 LuckyPool 워커는 `m1`과 `desk`입니다. `m1`의 마지막 지분은 5분 전이라 온라인이고, `desk`는 2시간 전이라 오프라인입니다. 잠금 해제 잔액 0.02 PRL은 주소에 있습니다. `m1`이 0.02, `desk`가 0이라고 쓸 수 없습니다. 수락 지분 횟수가 오지 않았다면 횟수는 알 수 없음입니다. 조회를 Kryptex로 바꾸면 그 쪽에는 여기의 수락 지분 횟수가 없습니다. 워커 이름이 같아도 LuckyPool의 횟수를 가져올 수 없습니다.",
        "## 다음에 볼 것",
        "채굴기 인자에서 워커 문자열을 확인하고 [PRL 모니터](/projects/prl)에서 같은 이름의 마지막 지분 시각을 맞춥니다. 돈은 주소의 미지급, 대기, 지급으로 돌아가 [잠긴 잔액과 지급](/learn/prl-locked-balance-payouts)을 보세요. Mac에서는 풀을 먼저 고릅니다. [해시레이트, 워커, 보상](/learn/pearl-prl-mac-monitoring). 이 사이트는 채굴기를 시작하지 않으며 오프라인 워커를 원격으로 깨우지도 않습니다.",
      ],
      ja: [
        "PRL監視のワーカーは、受取アドレスの下にあるマシンのラベルであり、二つ目のウォレットではありません。シェアが受理されたかを見るには、[PRL監視](/projects/prl)で実際にシェアを受け取ったプールを開き、そのアドレスのワーカー一覧で名前と最終シェア時刻を読みます。一覧の一行が未払い残高を単独で持つことはありません。",
        "KryptexのPRL接続ページは、形式をウォレットまたはユーザー名に `/worker` を足したものと書いています。SOLOはそのページのsoloウォレット形式を使います。Pearl Metalの作者は `--worker` を好きなラベルとし、プールの画面は `アドレス.worker` の下に統計を出すと書いています。だから `m1` と `desk` は一つの `prl1` の下に、二台のMacまたは二つのプロセスとして置けます。`m1` をアドレス欄に貼っても新しい台帳は開きません。アドレスの確認が求めるのは `prl1` で始まる公開アドレスです。",
        "オンラインまたはオフラインが答えるのは「このラベルが最近見えたか」であり、「このPRLが支払われたか」ではありません。Kryptexの取得元は、プールが送ったオンラインまたはオフラインと最終シェア時刻を使います。アドレスのハッシュレートは、プールが各ワーカーについて報告した平均または現在速度を使います。一台でも報告された速度が無ければ、アドレスのハッシュレートは0ではなく不明です。LuckyPoolの取得元は、最後に見えた時刻で新しさを見ます。およそ20分以内はオンライン、およそ30分を超えるとオフライン、その間や時刻の異常は不明です。これはこのサイトの「まだいるか」の表示であり、プールが約束した課金窓ではありません。",
        "## 受理シェアの回数は片方にしかない",
        "LuckyPoolのアドレス統計に受理シェアの回数が含まれていれば、監視はその整数を出します。項目がない、または完全な回数として使えないときは、0ではなく不明です。この監視のKryptexの行は受理シェアの回数を読みません。Kryptex自身のサイトで見るシェアは、そのサイトのものです。ここでのKryptex行の未払い残高をシェア回数とみなさないでください。Kryptexのページは固定のシェア難易度も述べ、難易度は収益を変えないとしています。それは難易度についてのプールの記述です。数字はページとともに変わり得ます。このサイトは、マイナーの中の現在の設定を古い一覧で置き換えません。",
        "## 例: マシン二台、残高一つ",
        "説明用の例です。アドレスは `prl1` で、LuckyPoolのワーカーは `m1` と `desk` です。`m1` の最終シェアは5分前でオンライン、`desk` は2時間前でオフラインです。解除済み残高 0.02 PRL はアドレスにあります。`m1` が0.02、`desk` が0とは書けません。受理シェアの回数が返っていなければ、回数は不明です。照会をKryptexに切り替えると、その側にはここでの受理シェア回数はありません。ワーカー名が同じでも、LuckyPoolの回数は写せません。",
        "## 次に見ること",
        "マイナーの引数でワーカー文字列を確認し、[PRL監視](/projects/prl)で同じラベルの最終シェア時刻を照合します。お金はアドレスの未払い、保留、支払済みに戻り、[ロック残高と支払](/learn/prl-locked-balance-payouts) を見てください。Macでは先にプールを選びます。[ハッシュレート、ワーカー、報酬](/learn/pearl-prl-mac-monitoring)。このサイトはマイナーを起動せず、オフラインのワーカーを遠隔で起こすこともできません。",
      ],
    },
    questions: {
      zh: [
        {
          question: "Worker 名字能否单独查询余额？",
          answer:
            "不能。余额、已付和近期收益属于 prl1 地址。Worker 只提供名称、算力、在线状态和最后份额时间。",
        },
        {
          question: "Kryptex 监控为什么没有接受份额次数？",
          answer:
            "这条 Kryptex 记录不读取份额计数。次数只在 LuckyPool 返回该数字时出现。Kryptex 网站上的份额页是矿池自己的页面。",
        },
        {
          question: "离线是否等于没有收益？",
          answer:
            "不等于。离线表示这个标签最近没有新份额。地址上已有的未付和已付不会因为一台 Worker 离线而变成 0。",
        },
      ],
      "zh-TW": [
        {
          question: "Worker 名字能否單獨查詢餘額？",
          answer:
            "不能。餘額、已付與近期收益屬於 prl1 地址。Worker 只提供名稱、算力、在線狀態與最後份額時間。",
        },
        {
          question: "Kryptex 監控為什麼沒有接受份額次數？",
          answer:
            "這條 Kryptex 紀錄不讀取份額計數。次數只在 LuckyPool 回傳該數字時出現。Kryptex 網站上的份額頁是礦池自己的頁面。",
        },
        {
          question: "離線是否等於沒有收益？",
          answer:
            "不等於。離線表示這個標籤最近沒有新份額。地址上已有的未付與已付不會因為一台 Worker 離線而變成 0。",
        },
      ],
      en: [
        {
          question: "Can I look up a balance with only the worker name?",
          answer:
            "No. Balance, paid, and recent reward belong to the prl1 address. A worker shows a name, hashrate, online state, and last share time.",
        },
        {
          question: "Why does Kryptex monitoring show no accepted-share count?",
          answer:
            "This Kryptex row does not read a share count. A count appears only when LuckyPool returns that number. A share view on Kryptex’s website is the pool’s own page.",
        },
        {
          question: "Does offline mean there is no reward?",
          answer:
            "No. Offline means this label has no recent share. Unpaid and paid already on the address do not become zero because one worker is offline.",
        },
      ],
      ko: [
        {
          question: "워커 이름만으로 잔액을 조회할 수 있나요?",
          answer:
            "없습니다. 잔액, 지급, 최근 보상은 prl1 주소의 것입니다. 워커는 이름, 해시레이트, 온라인 상태, 마지막 지분 시각을 보여 줍니다.",
        },
        {
          question: "Kryptex 모니터에 수락 지분 횟수가 없는 이유는요?",
          answer:
            "이 Kryptex 행은 지분 횟수를 읽지 않습니다. 횟수는 LuckyPool이 그 숫자를 돌려줄 때만 나타납니다. Kryptex 웹사이트의 지분 화면은 풀 자신의 페이지입니다.",
        },
        {
          question: "오프라인이면 보상이 없나요?",
          answer:
            "아닙니다. 오프라인은 이 이름에 최근 지분이 없다는 뜻입니다. 주소에 이미 있는 미지급과 지급은 워커 하나가 오프라인이라고 0이 되지 않습니다.",
        },
      ],
      ja: [
        {
          question: "ワーカー名だけで残高を照会できますか？",
          answer:
            "できません。残高、支払済み、直近の報酬はprl1アドレスのものです。ワーカーが見せるのは名前、ハッシュレート、オンライン状態、最終シェア時刻です。",
        },
        {
          question: "Kryptex監視に受理シェア回数がないのはなぜですか？",
          answer:
            "このKryptexの行はシェア回数を読みません。回数はLuckyPoolがその数字を返したときだけ出ます。Kryptexのサイト上のシェア画面は、プール自身のページです。",
        },
        {
          question: "オフラインは報酬がないという意味ですか？",
          answer:
            "違います。オフラインは、このラベルに直近のシェアがないという意味です。アドレスに既にある未払いと支払済みは、ワーカー一台がオフラインだからといって0にはなりません。",
        },
      ],
    },
  },
  {
    slug: "prl-locked-balance-payouts",
    project: "prl",
    published: "2026-10-23",
    modified: "2026-10-24",
    sources: [kryptex, luckyHome, metal],
    related: ["prl-luckypool-vs-kryptex", "prl-worker-accepted-shares"],
    topic: {
      zh: "余额与付款",
      "zh-TW": "餘額與付款",
      en: "Balances and payouts",
      ko: "잔액과 지급",
      ja: "残高と支払",
    },
    title: {
      zh: "PRL 的锁定、已解锁、已付和滚动 24 小时分别是什么？",
      "zh-TW": "PRL 的鎖定、已解鎖、已付與滾動 24 小時分別是什麼？",
      en: "PRL locked, unlocked, paid, and rolling 24 hours",
      ko: "PRL의 잠금, 잠금 해제, 지급, 롤링 24시간은 무엇인가",
      ja: "PRLのロック、解除済み、支払済み、ローリング24時間とは何か",
    },
    description: {
      zh: "LuckyPool 上锁定是尚未可付、已解锁是未付可计余额、已付是累计付出。近期一栏在 LuckyPool 是滚动 24 小时，在 Kryptex 是当天 UTC 日切点，两者不能横比。",
      "zh-TW":
        "LuckyPool 上鎖定是尚未可付、已解鎖是未付可計餘額、已付是累計付出。近期一欄在 LuckyPool 是滾動 24 小時，在 Kryptex 是當天 UTC 日切點，兩者不能橫比。",
      en: "On LuckyPool, locked is not payable yet, unlocked is the unpaid balance, and paid is the cumulative payout. The recent column is a rolling 24 hours on LuckyPool and today’s UTC day point on Kryptex. Those two are not comparable across pools.",
      ko: "LuckyPool에서 잠금은 아직 지급 전이고, 잠금 해제는 미지급 잔액이며, 지급은 누적 지급입니다. 최근 칸은 LuckyPool에서 롤링 24시간, Kryptex에서 오늘 UTC 일 단위 점입니다. 둘은 풀을 가로질러 비교하지 않습니다.",
      ja: "LuckyPoolではロックはまだ支払えず、解除済みは未払い残高、支払済みは累計の支払です。直近の欄はLuckyPoolではローリング24時間、Kryptexでは当日のUTC日次点です。二つをプールをまたいで比べません。",
    },
    summary: {
      zh: "四个数回答不同的问题：还不能付、现在未付、已经付过、最近一段。缺任何一项保持未知。Kryptex 没有单独的锁定余额。监控不替矿池付款。",
      "zh-TW":
        "四個數回答不同的問題：還不能付、現在未付、已經付過、最近一段。缺任何一項保持未知。Kryptex 沒有單獨的鎖定餘額。監控不替礦池付款。",
      en: "The four figures answer different questions: not payable yet, unpaid now, already paid, and the recent window. A missing figure stays unknown. Kryptex has no separate locked balance. Monitoring does not pay on the pool’s behalf.",
      ko: "네 숫자는 서로 다른 질문에 답합니다. 아직 지급 불가, 현재 미지급, 이미 지급, 최근 구간입니다. 빠진 항목은 알 수 없음으로 남습니다. Kryptex에는 별도의 잠금 잔액이 없습니다. 모니터는 풀을 대신해 지급하지 않습니다.",
      ja: "四つの数字は別々の問いに答えます。まだ支払えない、今の未払い、既に支払った、直近の区間です。欠けた項目は不明のままです。Kryptexに別のロック残高はありません。監視はプールの代わりに支払いません。",
    },
    comparisonTitle: {
      zh: "四个数不要加在一起",
      "zh-TW": "四個數不要加在一起",
      en: "Do not add the four figures",
      ko: "네 숫자를 더하지 않기",
      ja: "四つの数字を足さない",
    },
    comparison: {
      zh: {
        headers: ["页面上的数", "LuckyPool 上的含义", "Kryptex 上的含义"],
        rows: [
          ["未付余额", "已解锁金额", "未付合计；没有单独的锁定拆分"],
          ["待入账", "锁定金额，还不能当成已可付", "没有这一栏，保持空白而不是 0"],
          ["已付", "该池累计已付", "该池累计已付"],
          ["近期", "滚动 24 小时", "当天 UTC 日切点；没有这个点就是未知"],
          [
            "最低付款",
            "以 LuckyPool 当前页面为准；本站不代付",
            "以 Kryptex 当前页面为准；本站不代付",
          ],
        ],
      },
      "zh-TW": {
        headers: ["頁面上的數", "LuckyPool 上的含義", "Kryptex 上的含義"],
        rows: [
          ["未付餘額", "已解鎖金額", "未付合計；沒有單獨的鎖定拆分"],
          ["待入帳", "鎖定金額，還不能當成已可付", "沒有這一欄，保持空白而不是 0"],
          ["已付", "該池累計已付", "該池累計已付"],
          ["近期", "滾動 24 小時", "當天 UTC 日切點；沒有這個點就是未知"],
          [
            "最低付款",
            "以 LuckyPool 目前頁面為準；本站不代付",
            "以 Kryptex 目前頁面為準；本站不代付",
          ],
        ],
      },
      en: {
        headers: ["Figure on the page", "Meaning on LuckyPool", "Meaning on Kryptex"],
        rows: [
          ["Unpaid balance", "Unlocked amount", "Unpaid total; no separate locked split"],
          ["Pending", "Locked amount, not payable yet", "No column; blank, not zero"],
          ["Paid", "Cumulative paid by that pool", "Cumulative paid by that pool"],
          ["Recent", "Rolling 24 hours", "Today’s UTC day point; missing point means unknown"],
          [
            "Minimum payout",
            "Use LuckyPool’s current page; this site does not pay",
            "Use Kryptex’s current page; this site does not pay",
          ],
        ],
      },
      ko: {
        headers: ["화면의 숫자", "LuckyPool에서의 뜻", "Kryptex에서의 뜻"],
        rows: [
          ["미지급 잔액", "잠금 해제 금액", "미지급 합계. 별도 잠금 분할 없음"],
          ["대기", "잠금 금액. 아직 지급 가능이 아님", "칸이 없음. 0이 아니라 비어 있음"],
          ["지급", "그 풀의 누적 지급", "그 풀의 누적 지급"],
          ["최근", "롤링 24시간", "오늘 UTC 일 단위 점. 점이 없으면 알 수 없음"],
          [
            "최소 지급",
            "LuckyPool 현재 페이지를 본다. 이 사이트는 지급하지 않음",
            "Kryptex 현재 페이지를 본다. 이 사이트는 지급하지 않음",
          ],
        ],
      },
      ja: {
        headers: ["画面の数字", "LuckyPoolでの意味", "Kryptexでの意味"],
        rows: [
          ["未払い残高", "解除済み金額", "未払い合計。別のロック分割はない"],
          ["保留", "ロック金額。まだ支払えない", "欄はない。0ではなく空欄"],
          ["支払済み", "そのプールの累計支払", "そのプールの累計支払"],
          ["直近", "ローリング24時間", "当日のUTC日次点。点がなければ不明"],
          [
            "最低支払",
            "LuckyPoolの現在のページを見る。このサイトは支払わない",
            "Kryptexの現在のページを見る。このサイトは支払わない",
          ],
        ],
      },
    },
    body: {
      zh: [
        "PRL 页面上的锁定、已解锁、已付和近期收益是四件不同的事，不能加成“今天能提出多少”。在 [PRL 监控](/projects/prl) 先选对矿池。LuckyPool 会同时给出已解锁和锁定；Kryptex 只给出未付合计，没有单独的锁定栏。已付是该矿池累计已经付出的数，不是未付的一部分。",
        "已解锁回答“这个地址在该池还有多少未付、且池子把它和锁定分开了”。锁定回答“还有一笔记在地址上，但还不能把它当成已可付的余额”。两者都缺时保持未知，不会用 0 填充。Kryptex 没有锁定栏，所以不要为了和 LuckyPool 对齐而写上锁定 0。这里的含义是本站对地址统计里这两项的展示。矿池若改字段名或不再返回，对应的数就是未知。",
        "近期一栏的时间窗口也不同。LuckyPool 用滚动 24 小时：从你查看时刻往前约一天，且只有统计里存在 24 小时这一行才显示。Kryptex 用当天的 UTC 日切点：曲线上有该点才显示当天收益，没有该点就是未知，不是 0。因此 LuckyPool 的 24 小时和 Kryptex 的“今天”不能横比，不要把两种窗口盲加成同一笔近期收入。",
        "## 付款门槛不是监控里的按钮",
        "是否达到付款门槛，打开你正在使用的矿池当前页面。各池规则只适用于那一家。本站查询，不发起提现，也不从显示金额里扣费。自动兑换之后的余额不在这条 PRL 记录里。缺字段保持未知。",
        "## 例子：四行不要相加",
        "说明用数字。某地址在 LuckyPool：锁定 0.40 PRL，已解锁 0.70 PRL，已付 3.00 PRL，滚动 24 小时 0.05 PRL。现在未付、且与锁定分开的是 0.70。0.40 还不能并进“可付”。3.00 已经付过，不能再加进未付。0.05 只描述最近约一天，不是余额。若 24 小时那一行缺失，近期是未知。同一地址若在 Kryptex 还有未付 1.00，那是另一行账户。不要把它和 LuckyPool 的 0.70、锁定或已付盲加成一笔收入。",
        "## 接下来做什么",
        "在 [PRL 监控](/projects/prl) 记下来源，分别阅读未付、待入账、已付和近期，缺项留白。是否达到最低付款，打开你正在使用的矿池当前页面核对，不要用另一家矿池的 1 PRL 填空。Worker 离线不改这些金额，见 [Worker 与接受份额](/learn/prl-worker-accepted-shares)。两池为什么不能合成一笔，见 [Kryptex 与 LuckyPool](/learn/prl-luckypool-vs-kryptex)。",
      ],
      "zh-TW": [
        "PRL 頁面上的鎖定、已解鎖、已付與近期收益是四件不同的事，不能加成「今天能提出多少」。在 [PRL 監控](/projects/prl) 先選對礦池。LuckyPool 會同時給出已解鎖與鎖定；Kryptex 只給出未付合計，沒有單獨的鎖定欄。已付是該礦池累計已經付出的數，不是未付的一部分。",
        "已解鎖回答「這個地址在該池還有多少未付、且池子把它和鎖定分開了」。鎖定回答「還有一筆記在地址上，但還不能把它當成已可付的餘額」。兩者都缺時保持未知，不會用 0 填充。Kryptex 沒有鎖定欄，所以不要為了和 LuckyPool 對齊而寫上鎖定 0。這裡的含義是本站對地址統計裡這兩項的展示。礦池若改欄位名或不再回傳，對應的數就是未知。",
        "近期一欄的時間窗口也不同。LuckyPool 用滾動 24 小時：從你查看時刻往前約一天，且只有統計裡存在 24 小時這一列才顯示。Kryptex 用當天的 UTC 日切點：曲線上有該點才顯示當天收益，沒有該點就是未知，不是 0。因此 LuckyPool 的 24 小時和 Kryptex 的「今天」不能橫比，不要把兩種窗口盲加成同一筆近期收入。",
        "## 付款門檻不是監控裡的按鈕",
        "是否達到付款門檻，打開你正在使用的礦池目前頁面。各池規則只適用於那一家。本站查詢，不發起提現，也不從顯示金額裡扣費。自動兌換之後的餘額不在這條 PRL 紀錄裡。缺欄位保持未知。",
        "## 例子：四列不要相加",
        "說明用數字。某地址在 LuckyPool：鎖定 0.40 PRL，已解鎖 0.70 PRL，已付 3.00 PRL，滾動 24 小時 0.05 PRL。現在未付、且與鎖定分開的是 0.70。0.40 還不能併進「可付」。3.00 已經付過，不能再加進未付。0.05 只描述最近約一天，不是餘額。若 24 小時那一列缺失，近期是未知。同一地址若在 Kryptex 還有未付 1.00，那是另一列帳戶。不要把它和 LuckyPool 的 0.70、鎖定或已付盲加成一筆收入。",
        "## 接下來做什麼",
        "在 [PRL 監控](/projects/prl) 記下來源，分別閱讀未付、待入帳、已付與近期，缺項留白。是否達到最低付款，打開你正在使用的礦池目前頁面核對，不要用另一家礦池的 1 PRL 填空。Worker 離線不改這些金額，見 [Worker 與接受份額](/learn/prl-worker-accepted-shares)。兩池為什麼不能合成一筆，見 [Kryptex 與 LuckyPool](/learn/prl-luckypool-vs-kryptex)。",
      ],
      en: [
        "Locked, unlocked, paid, and the recent reward on a PRL page are four different facts. They do not add up to “what you can withdraw today”. On [PRL monitoring](/projects/prl), select the pool first. LuckyPool can show unlocked and locked together. Kryptex shows an unpaid total and has no separate locked column. Paid is what that pool has already sent. It is not a part of unpaid.",
        "Unlocked answers how much unpaid this address still has at that pool, with locked split out. Locked answers that another amount is recorded on the address but cannot yet be treated as payable. If either value is missing, it stays unknown. It is not filled with zero. Kryptex has no locked column, so do not write locked 0 just to line up with LuckyPool. The meanings here are how this site shows those two items from address stats. If the pool renames them or stops returning them, the figure is unknown.",
        "The recent column also uses different windows. LuckyPool uses a rolling 24 hours: about one day back from the moment you look, and only when the stats include a 24-hour row. Kryptex uses today’s UTC day point: the day’s reward appears when that point is on the chart, and a missing point is unknown, not zero. LuckyPool’s 24 hours and Kryptex’s “today” are not comparable, Do not fold the two different windows into one recent-income figure.",
        "## A payout threshold is not a button in the monitor",
        "Whether you reached a payout threshold is on the current page of the pool you use. Each pool’s rule applies only there. This site queries. It does not send a withdrawal or deduct a fee from the amount on screen. A balance after auto-convert is not on this PRL row. A missing field stays unknown.",
        "## Example: do not add the four lines",
        "Illustrative figures. On LuckyPool an address shows locked 0.40 PRL, unlocked 0.70 PRL, paid 3.00 PRL, and rolling 24 hours 0.05 PRL. The unpaid amount split from locked is 0.70. The 0.40 is not yet payable. The 3.00 has already been paid and is not added back into unpaid. The 0.05 describes about the last day, not the balance. If the 24-hour row is missing, recent is unknown. If the same address also shows 1.00 unpaid on Kryptex, that is another account row. Do not fold it together with LuckyPool’s 0.70, locked, or paid as one income figure.",
        "## What to do next",
        "Note the source on [PRL monitoring](/projects/prl) and read unpaid, pending, paid, and recent separately. Leave gaps blank. Check a minimum payout on the current page of the pool you use. Do not fill a blank with the other pool’s 1 PRL. An offline worker does not change these amounts; see [workers and accepted shares](/learn/prl-worker-accepted-shares). Why the pools cannot become one total is in [Kryptex and LuckyPool](/learn/prl-luckypool-vs-kryptex).",
      ],
      ko: [
        "PRL 화면의 잠금, 잠금 해제, 지급, 최근 보상은 서로 다른 네 가지입니다. 더해서 “오늘 인출할 수 있는 금액”이 되지 않습니다. [PRL 모니터](/projects/prl)에서 풀을 먼저 고릅니다. LuckyPool은 잠금 해제와 잠금을 함께 보여줄 수 있습니다. Kryptex는 미지급 합계만 있고 별도 잠금 칸은 없습니다. 지급은 그 풀이 이미 보낸 금액이며 미지급의 일부가 아닙니다.",
        "잠금 해제는 그 풀에서 이 주소에 남은 미지급 중 잠금과 나뉜 금액입니다. 잠금은 주소에 또 적혀 있지만 아직 지급 가능한 잔액으로 볼 수 없는 금액입니다. 둘 중 하나라도 없으면 알 수 없음이며 0으로 채우지 않습니다. Kryptex에는 잠금 칸이 없으니 LuckyPool에 맞추려고 잠금 0을 적지 마세요. 여기의 뜻은 이 사이트가 주소 통계의 두 항목을 보여주는 방식입니다. 풀이 이름을 바꾸거나 더 이상 주지 않으면 그 숫자는 알 수 없음입니다.",
        "최근 칸의 시간 창도 다릅니다. LuckyPool은 롤링 24시간입니다. 보는 시점부터 약 하루 전이며, 통계에 24시간 행이 있을 때만 나옵니다. Kryptex는 오늘 UTC 일 단위 점입니다. 차트에 그 점이 있을 때만 오늘 보상이 나오고, 점이 없으면 0이 아니라 알 수 없음입니다. LuckyPool의 24시간과 Kryptex의 “오늘”은 비교할 수 없고, 두 창을 같은 최근 수입으로 뭉개지 마세요.",
        "## 지급 기준은 모니터의 버튼이 아닙니다",
        "지급 기준에 닿았는지는 사용 중인 풀의 현재 페이지에서 확인합니다. 각 풀의 규칙은 그 풀에만 적용됩니다. 이 사이트는 조회만 하며 인출을 보내거나 화면 금액에서 수수료를 빼지 않습니다. 자동 환산 뒤의 잔액은 이 PRL 행에 없습니다. 빠진 필드는 알 수 없음입니다.",
        "## 예: 네 줄을 더하지 않기",
        "설명용 숫자입니다. LuckyPool의 한 주소는 잠금 0.40 PRL, 잠금 해제 0.70 PRL, 지급 3.00 PRL, 롤링 24시간 0.05 PRL입니다. 잠금과 나뉜 현재 미지급은 0.70입니다. 0.40은 아직 지급 가능이 아닙니다. 3.00은 이미 지급되어 미지급에 다시 더하지 않습니다. 0.05는 최근 약 하루를 말할 뿐 잔액이 아닙니다. 24시간 행이 없으면 최근은 알 수 없음입니다. 같은 주소가 Kryptex에서 미지급 1.00을 보여도 다른 계정 행입니다. LuckyPool의 0.70, 잠금, 지급과 한 수입으로 뭉개지 마세요.",
        "## 다음에 할 일",
        "[PRL 모니터](/projects/prl)에서 출처를 적고 미지급, 대기, 지급, 최근을 따로 읽습니다. 빈칸은 비워 둡니다. 최소 지급은 사용 중인 풀의 현재 페이지에서 확인합니다. 다른 풀의 1 PRL로 빈칸을 채우지 마세요. 워커 오프라인은 이 금액을 바꾸지 않습니다. [워커와 수락 지분](/learn/prl-worker-accepted-shares). 두 풀이 하나의 합계가 되지 않는 이유는 [Kryptex와 LuckyPool](/learn/prl-luckypool-vs-kryptex)에 있습니다.",
      ],
      ja: [
        "PRL画面のロック、解除済み、支払済み、直近の報酬は四つの別の事実です。足して「今日引き出せる額」にはなりません。[PRL監視](/projects/prl)では先にプールを選びます。LuckyPoolは解除済みとロックを同時に出せます。Kryptexは未払い合計だけで、別のロック欄はありません。支払済みは、そのプールが既に送った額であり、未払いの一部ではありません。",
        "解除済みが答えるのは、そのプールでこのアドレスに残る未払いのうち、ロックと分けられた額です。ロックが答えるのは、アドレスにさらに記録されているが、まだ支払える残高としては扱えない額です。どちらかが欠ければ不明のままで、0では埋めません。Kryptexにロック欄はないので、LuckyPoolに揃えるためにロック0とは書きません。ここでの意味は、このサイトがアドレス統計の二つの項目をどう示すかです。プールが名前を変えるか、返さなくなれば、その数字は不明です。",
        "直近の欄の時間窓も違います。LuckyPoolはローリング24時間です。見た時点から約一日さかのぼり、統計に24時間の行があるときだけ出ます。Kryptexは当日のUTC日次点です。チャートにその点があるときだけ当日の報酬が出て、点がなければ0ではなく不明です。LuckyPoolの24時間とKryptexの「今日」は比べられず、二つの窓を一つの直近収入にまとめないでください。",
        "## 支払基準は監視の中のボタンではない",
        "支払基準に達したかは、使っているプールの現在のページで確認します。各プールの規則はそのプールだけに適用されます。このサイトは照会するだけで、引き出しを送らず、表示額から手数料も引きません。自動換金のあとの残高は、このPRLの行にはありません。欠けた項目は不明です。",
        "## 例: 四つの行を足さない",
        "説明用の数字です。LuckyPoolのあるアドレスは、ロック 0.40 PRL、解除済み 0.70 PRL、支払済み 3.00 PRL、ローリング24時間 0.05 PRL です。ロックと分けられた今の未払いは 0.70 です。0.40 はまだ支払えません。3.00 は既に支払済みで、未払いへ戻して足しません。0.05 はおおよそ直近一日の説明であり、残高ではありません。24時間の行がなければ直近は不明です。同じアドレスがKryptexで未払い 1.00 を示しても別の口座行です。LuckyPoolの 0.70、ロック、支払済みと一つの収入にまとめないでください。",
        "## 次にすること",
        "[PRL監視](/projects/prl)で取得元を控え、未払い、保留、支払済み、直近を別に読みます。空きは空欄のままにします。最低支払は、使っているプールの現在のページで確認します。もう一方のプールの1 PRLで空欄を埋めないでください。ワーカーがオフラインでもこれらの金額は変わりません。[ワーカーと受理シェア](/learn/prl-worker-accepted-shares) を見てください。二つのプールが一つの合計にならない理由は [KryptexとLuckyPool](/learn/prl-luckypool-vs-kryptex) にあります。",
      ],
    },
    questions: {
      zh: [
        {
          question: "锁定余额能不能和已解锁加在一起提现？",
          answer:
            "不能按本站页面直接相加后去提。锁定表示还不能当成已可付。是否达到矿池门槛，要看该矿池当前的付款页。本站不发起付款。",
        },
        {
          question: "滚动 24 小时为什么和 Kryptex 的今天不一样？",
          answer:
            "LuckyPool 的近期是滚动 24 小时。Kryptex 的近期是当天 UTC 日切点，而且要曲线上有这个点。窗口不同，不能横比，缺了就是未知。",
        },
        {
          question: "已付为什么比未付大很多？",
          answer:
            "已付是该矿池累计已经付出的数，未付是还留在账上的数。累计付出本来就可以大于当前未付，两者不是同一笔的两半。",
        },
      ],
      "zh-TW": [
        {
          question: "鎖定餘額能不能和已解鎖加在一起提現？",
          answer:
            "不能按本站頁面直接相加後去提。鎖定表示還不能當成已可付。是否達到礦池門檻，要看該礦池目前的付款頁。本站不發起付款。",
        },
        {
          question: "滾動 24 小時為什麼和 Kryptex 的今天不一樣？",
          answer:
            "LuckyPool 的近期是滾動 24 小時。Kryptex 的近期是當天 UTC 日切點，而且要曲線上有這個點。窗口不同，不能橫比，缺了就是未知。",
        },
        {
          question: "已付為什麼比未付大很多？",
          answer:
            "已付是該礦池累計已經付出的數，未付是還留在帳上的數。累計付出本來就可以大於目前未付，兩者不是同一筆的兩半。",
        },
      ],
      en: [
        {
          question: "Can I withdraw locked plus unlocked?",
          answer:
            "Do not add them on this page and treat the sum as withdrawable. Locked is not payable yet. Whether you reached the pool’s threshold is on that pool’s current payout page. This site does not send the payout.",
        },
        {
          question: "Why does rolling 24 hours differ from Kryptex’s today?",
          answer:
            "LuckyPool’s recent figure is a rolling 24 hours. Kryptex’s is today’s UTC day point, and only when that point is on the chart. The windows differ, so they are not compared. A missing window is unknown.",
        },
        {
          question: "Why is paid much larger than unpaid?",
          answer:
            "Paid is the cumulative amount that pool has already sent. Unpaid is what remains on the account. Cumulative paid can be larger than the current unpaid. They are not two halves of one sum.",
        },
      ],
      ko: [
        {
          question: "잠금과 잠금 해제를 더해 인출할 수 있나요?",
          answer:
            "이 페이지에서 더해 인출 가능액으로 보지 마세요. 잠금은 아직 지급할 수 없습니다. 풀 기준에 도달했는지는 그 풀의 현재 지급 페이지에 있습니다. 이 사이트는 지급을 보내지 않습니다.",
        },
        {
          question: "롤링 24시간이 Kryptex의 오늘과 다른 이유는요?",
          answer:
            "LuckyPool의 최근 값은 롤링 24시간입니다. Kryptex는 오늘 UTC 일 단위 점이며 차트에 그 점이 있을 때만입니다. 창이 다르므로 비교하지 않습니다. 창이 없으면 알 수 없음입니다.",
        },
        {
          question: "지급이 미지급보다 훨씬 큰 이유는요?",
          answer:
            "지급은 그 풀이 이미 보낸 누적액이고, 미지급은 계정에 남은 액입니다. 누적 지급은 현재 미지급보다 클 수 있습니다. 둘은 한 합계의 반쪽이 아닙니다.",
        },
      ],
      ja: [
        {
          question: "ロックと解除済みを足して引き出せますか？",
          answer:
            "このページで足して引出可能額にしないでください。ロックはまだ支払えません。プールの基準に達したかは、そのプールの現在の支払ページで確認します。このサイトは支払を送りません。",
        },
        {
          question: "ローリング24時間がKryptexの今日と違うのはなぜですか？",
          answer:
            "LuckyPoolの直近はローリング24時間です。Kryptexは当日のUTC日次点で、チャートにその点があるときだけです。窓が違うので比べません。窓がなければ不明です。",
        },
        {
          question: "支払済みが未払いよりずっと大きいのはなぜですか？",
          answer:
            "支払済みは、そのプールが既に送った累計です。未払いは口座に残っている額です。累計の支払は現在の未払いより大きくなり得ます。二つは一つの合計の半分ずつではありません。",
        },
      ],
    },
  },
  {
    slug: "prl-mac-gpu-miner-compatibility",
    project: "prl",
    published: "2026-10-23",
    modified: "2026-10-24",
    sources: [metal, kryptex, minerstat],
    related: ["pearl-prl-mac-monitoring", "prl-worker-accepted-shares"],
    topic: {
      zh: "矿工程序",
      "zh-TW": "礦工程式",
      en: "Miner programs",
      ko: "채굴 프로그램",
      ja: "マイナープログラム",
    },
    title: {
      zh: "Mac 和独立显卡挖 PRL，各自该用哪类矿工？",
      "zh-TW": "Mac 與獨立顯卡挖 PRL，各自該用哪類礦工？",
      en: "Which miner fits PRL on a Mac versus a discrete GPU",
      ko: "Mac과 독립 GPU에서 PRL을 캘 때 어떤 채굴기를 쓰나",
      ja: "Macと独立GPUでPRLを掘るとき、どのマイナーを使うか",
    },
    description: {
      zh: "Apple Silicon 用 Pearl Metal 作者列出的范围：M1 到 M5，不含 Intel Mac。独立显卡看 Kryptex 页面点名的程序和 GPU 系列。算力例子不是收益承诺，计算器要分开毛收益和电费。",
      "zh-TW":
        "Apple Silicon 用 Pearl Metal 作者列出的範圍：M1 到 M5，不含 Intel Mac。獨立顯卡看 Kryptex 頁面點名的程式和 GPU 系列。算力例子不是收益承諾，計算器要分開毛收益和電費。",
      en: "On Apple Silicon, use the range the Pearl Metal author lists: M1 through M5, not Intel Macs. For a discrete GPU, use the programs and GPU families named on Kryptex’s page. Sample hashrates are not an earnings promise. A calculator separates gross reward from electricity.",
      ko: "Apple Silicon은 Pearl Metal 저자가 적은 범위인 M1부터 M5이며 Intel Mac은 포함되지 않습니다. 독립 GPU는 Kryptex 페이지가 이름을 적은 프로그램과 GPU 계열을 봅니다. 해시레이트 예는 수익 약속이 아닙니다. 계산기는 총보상과 전기요금을 나눕니다.",
      ja: "Apple SiliconはPearl Metalの作者が挙げるM1からM5で、Intel Macは含みません。独立GPUはKryptexのページが名を挙げたプログラムとGPU系列を見ます。ハッシュレートの例は収益の約束ではありません。計算機は総報酬と電気代を分けます。",
    },
    summary: {
      zh: "Pearl Metal 是 Apple Silicon 上的 Metal 矿工，作者声明无开发者费用，且不支持没有 Metal GPU 的机器。Kryptex 页面另行列出 Windows、Linux 等环境的显卡矿工。两边都要自己配置 prl1 或该池要求的登录名。IOTA Watch 不代装这些程序。",
      "zh-TW":
        "Pearl Metal 是 Apple Silicon 上的 Metal 礦工，作者聲明無開發者費用，且不支援沒有 Metal GPU 的機器。Kryptex 頁面另外列出 Windows、Linux 等環境的顯卡礦工。兩邊都要自己設定 prl1 或該池要求的登入名。IOTA Watch 不代裝這些程式。",
      en: "Pearl Metal is a Metal miner for Apple Silicon. The author states no developer fee and does not support machines without a Metal GPU. Kryptex’s page separately lists GPU miners for Windows, Linux, and other environments. Both still need a prl1 address or the login that pool requires. IOTA Watch does not install either program.",
      ko: "Pearl Metal은 Apple Silicon용 Metal 채굴기입니다. 저자는 개발자 수수료가 없고 Metal GPU가 없는 기기는 지원하지 않는다고 합니다. Kryptex 페이지는 Windows, Linux 등에서의 GPU 채굴기를 따로 나열합니다. 어느 쪽이든 prl1 또는 그 풀이 요구하는 로그인 이름이 필요합니다. IOTA Watch는 어느 프로그램도 설치하지 않습니다.",
      ja: "Pearl MetalはApple Silicon向けのMetalマイナーです。作者は開発者手数料がなく、Metal GPUのないマシンは対象外だとしています。KryptexのページはWindowsやLinuxなどのGPUマイナーを別に列挙します。どちらもprl1、またはそのプールが求めるログイン名が必要です。IOTA Watchはどちらのプログラムも導入しません。",
    },
    comparisonTitle: {
      zh: "按机器选程序，而不是按币名",
      "zh-TW": "按機器選程式，而不是按幣名",
      en: "Pick the program for the machine",
      ko: "코인 이름이 아니라 기기에 맞춰 고르기",
      ja: "コイン名ではなくマシンに合わせて選ぶ",
    },
    comparison: {
      zh: {
        headers: ["机器", "作者或矿池页面点名的程序", "页面明确排除或不在本次依据内"],
        rows: [
          [
            "Apple Silicon Mac",
            "Pearl Metal，M1 到 M5，Metal 后端",
            "Intel Mac、虚拟机、没有 Metal GPU 的机器",
          ],
          [
            "独立显卡主机",
            "Kryptex PRL 页列出的 KRig、SRBMiner-MULTI、BzMiner 等",
            "该页没有把 Pearl Metal 写成 NVIDIA/AMD 矿工",
          ],
          [
            "登录名",
            "Metal 使用 prl1 收款地址；Kryptex 也允许用户名自动兑换",
            "Worker 标签不能代替地址",
          ],
          [
            "收益估算",
            "Minerstat 一类计算器把奖励、电费和利润分开",
            "矿池页面上的显卡算力例子不是你的 Mac 的承诺产值",
          ],
        ],
      },
      "zh-TW": {
        headers: ["機器", "作者或礦池頁面點名的程式", "頁面明確排除或不在本次依據內"],
        rows: [
          [
            "Apple Silicon Mac",
            "Pearl Metal，M1 到 M5，Metal 後端",
            "Intel Mac、虛擬機、沒有 Metal GPU 的機器",
          ],
          [
            "獨立顯卡主機",
            "Kryptex PRL 頁列出的 KRig、SRBMiner-MULTI、BzMiner 等",
            "該頁沒有把 Pearl Metal 寫成 NVIDIA/AMD 礦工",
          ],
          [
            "登入名",
            "Metal 使用 prl1 收款地址；Kryptex 也允許用戶名自動兌換",
            "Worker 標籤不能代替地址",
          ],
          [
            "收益估算",
            "Minerstat 一類計算器把獎勵、電費和利潤分開",
            "礦池頁面上的顯卡算力例子不是你的 Mac 的承諾產值",
          ],
        ],
      },
      en: {
        headers: [
          "Machine",
          "Program the author or pool page names",
          "Excluded, or outside this evidence",
        ],
        rows: [
          [
            "Apple Silicon Mac",
            "Pearl Metal, M1 through M5, Metal backend",
            "Intel Macs, virtual machines, machines without a Metal GPU",
          ],
          [
            "Discrete-GPU rig",
            "KRig, SRBMiner-MULTI, BzMiner, and others listed on Kryptex’s PRL page",
            "That page does not present Pearl Metal as the NVIDIA or AMD miner",
          ],
          [
            "Login",
            "Metal uses a prl1 payout address; Kryptex also allows a username for auto-convert",
            "A worker label does not replace the address",
          ],
          [
            "Earnings estimate",
            "A Minerstat-style calculator separates reward, electricity, and profit",
            "GPU hashrate examples on the pool page are not a promised rate for your Mac",
          ],
        ],
      },
      ko: {
        headers: ["기기", "저자 또는 풀 페이지가 적은 프로그램", "제외되었거나 이번 근거 밖"],
        rows: [
          [
            "Apple Silicon Mac",
            "Pearl Metal, M1부터 M5, Metal 백엔드",
            "Intel Mac, 가상 머신, Metal GPU가 없는 기기",
          ],
          [
            "독립 GPU 장비",
            "Kryptex PRL 페이지의 KRig, SRBMiner-MULTI, BzMiner 등",
            "그 페이지는 Pearl Metal을 NVIDIA/AMD 채굴기로 쓰지 않음",
          ],
          [
            "로그인",
            "Metal은 prl1 지급 주소. Kryptex는 자동 환산용 사용자명도 허용",
            "워커 이름은 주소를 대신하지 않음",
          ],
          [
            "수익 추정",
            "Minerstat식 계산기는 보상, 전기요금, 이익을 나눔",
            "풀 페이지의 GPU 해시레이트 예는 Mac의 약속 수익이 아님",
          ],
        ],
      },
      ja: {
        headers: [
          "マシン",
          "作者またはプールページが挙げるプログラム",
          "対象外、または今回の根拠の外",
        ],
        rows: [
          [
            "Apple SiliconのMac",
            "Pearl Metal、M1からM5、Metalバックエンド",
            "Intel Mac、仮想マシン、Metal GPUのないマシン",
          ],
          [
            "独立GPUの機材",
            "KryptexのPRLページにあるKRig、SRBMiner-MULTI、BzMinerなど",
            "そのページはPearl MetalをNVIDIA/AMDのマイナーとしては書いていない",
          ],
          [
            "ログイン",
            "Metalはprl1の受取アドレス。Kryptexは自動換金のユーザー名も可",
            "ワーカー名はアドレスの代わりにならない",
          ],
          [
            "収益の見積もり",
            "Minerstat型の計算機は報酬、電気代、利益を分ける",
            "プールページのGPUハッシュレート例は、自分のMacへの約束値ではない",
          ],
        ],
      },
    },
    body: {
      zh: [
        "挖 PRL 之前先看机器，再选矿工。Apple Silicon 的依据是 Pearl Metal 仓库：作者写明任意 M 系列、M1 到 M5，手写 Metal 后端，Apache-2.0，无开发者费用，并且不隶属于 Pearl Research Labs。同一页写明 Intel Mac、虚拟机，以及没有 Metal GPU 的机器都不支持，自检会直接告诉你。这不是“所有 Mac 都能挖”。",
        "独立显卡不要把 Pearl Metal 装到 NVIDIA 或 AMD 主机上碰运气。Kryptex 的 PRL 页面列出 KRig、SRBMiner-MULTI、PeakMiner、ForgeMiner、RGMiner、Blockz-miner、Fl4shMiner、BzMiner、OneZeroMiner，并给出 Windows、Linux、Docker、HiveOS、MMPOS 等起点。KRig 一段旁写着 AMD RDNA 2、RDNA 3、RDNA 4、CDNA 4，以及带参数的集成 RDNA 3.5，还有 NVIDIA RTX 2000 到 5000。这些是矿池页面点名的程序和显卡系列。页面上的算力例子不是你的 Mac 的预期算力，也不是收益承诺。",
        "登录名跟着矿池走。Metal 的 `init` 要矿池、`prl1` 收款地址和 Worker 标签。Kryptex 页面允许钱包或用户名加 Worker；自动兑换用用户名，提取物可以不是 PRL。无论哪一个程序，Worker 都不是另一枚钱包。装好之后到 [PRL 监控](/projects/prl) 用公开地址查看，而不是把矿工文件上传到本站。本站不安装、不启动这些矿工。Agent 只操作 IOTA Train at Home 的 Mac。",
        "## 算力例子和计算器不是同一句话",
        "Kryptex 页面把份额难度和收益分开：它写明难度不影响收益。Minerstat 一类 PRL 计算器把算力、功耗、矿池费率和电价分列，再给出估计奖励、电费成本和利润。读计算器时保留毛奖励和扣除电费之后的利润这两列，不要只抄利润。作者支持的是 Apple Silicon 上的 Pearl Metal，并提醒电费可能高于币值。这里不把 Mac 挖矿说成收入，也不承诺算力。",
        "## 例子：选错程序",
        "一台 2020 年的 Intel Mac 打开 Pearl Metal，作者的支持范围不包含它，自检失败是符合该页说明的，不是矿池把地址封了。一台 M 系列 Mac 若去套用 Kryptex 页面上的 RTX 算力例子，那些 TH/s 描述的是页面点名的显卡，不是这台 Mac。正确的下一步是：M 系列用 Metal 配好 `prl1` 和矿池，显卡主机用该页仍在列出的程序；然后在 [PRL 监控](/projects/prl) 看最后份额时间，而不是看一个年收益数字。",
        "## 边界",
        "程序能否在你的驱动上运行，以作者仓库和矿池当前页面为准。没有被这两页点名的矿工，兼容性保持未知。收益随难度、价格、费率和电价变化，这里不给日收入承诺。",
        "连上之后如何读数，见 [Mac 上的算力和收益](/learn/pearl-prl-mac-monitoring)。Worker 标签见 [接受份额](/learn/prl-worker-accepted-shares)。",
      ],
      "zh-TW": [
        "挖 PRL 之前先看機器，再選礦工。Apple Silicon 的依據是 Pearl Metal 倉庫：作者寫明任意 M 系列、M1 到 M5，手寫 Metal 後端，Apache-2.0，無開發者費用，並且不隸屬於 Pearl Research Labs。同一頁寫明 Intel Mac、虛擬機，以及沒有 Metal GPU 的機器都不支援，自檢會直接告訴你。這不是「所有 Mac 都能挖」。",
        "獨立顯卡不要把 Pearl Metal 裝到 NVIDIA 或 AMD 主機上碰運氣。Kryptex 的 PRL 頁面列出 KRig、SRBMiner-MULTI、PeakMiner、ForgeMiner、RGMiner、Blockz-miner、Fl4shMiner、BzMiner、OneZeroMiner，並給出 Windows、Linux、Docker、HiveOS、MMPOS 等起點。KRig 一段旁寫著 AMD RDNA 2、RDNA 3、RDNA 4、CDNA 4，以及帶參數的整合 RDNA 3.5，還有 NVIDIA RTX 2000 到 5000。這些是礦池頁面點名的程式和顯卡系列。頁面上的算力例子不是你的 Mac 的預期算力，也不是收益承諾。",
        "登入名跟著礦池走。Metal 的 `init` 要礦池、`prl1` 收款地址與 Worker 標籤。Kryptex 頁面允許錢包或用戶名加 Worker；自動兌換用用戶名，提取物可以不是 PRL。無論哪一個程式，Worker 都不是另一枚錢包。裝好之後到 [PRL 監控](/projects/prl) 用公開地址查看，而不是把礦工檔案上傳到本站。本站不安裝、不啟動這些礦工。Agent 只操作 IOTA Train at Home 的 Mac。",
        "## 算力例子和計算器不是同一句話",
        "Kryptex 頁面把份額難度與收益分開：它寫明難度不影響收益。Minerstat 一類 PRL 計算器把算力、功耗、礦池費率與電價分列，再給出估計獎勵、電費成本與利潤。讀計算器時保留毛獎勵和扣除電費之後的利潤這兩欄，不要只抄利潤。作者支援的是 Apple Silicon 上的 Pearl Metal，並提醒電費可能高於幣值。這裡不把 Mac 挖礦說成收入，也不承諾算力。",
        "## 例子：選錯程式",
        "一台 2020 年的 Intel Mac 打開 Pearl Metal，作者的支援範圍不包含它，自檢失敗是符合該頁說明的，不是礦池把地址封了。一台 M 系列 Mac 若去套用 Kryptex 頁面上的 RTX 算力例子，那些 TH/s 描述的是頁面點名的顯卡，不是這台 Mac。正確的下一步是：M 系列用 Metal 配好 `prl1` 和礦池，顯卡主機用該頁仍在列出的程式；然後在 [PRL 監控](/projects/prl) 看最後份額時間，而不是看一個年收益數字。",
        "## 邊界",
        "程式能否在你的驅動上運行，以作者倉庫與礦池目前頁面為準。沒有被這兩頁點名的礦工，相容性保持未知。收益隨難度、價格、費率與電價變化，這裡不給日收入承諾。",
        "連上之後如何讀數，見 [Mac 上的算力與收益](/learn/pearl-prl-mac-monitoring)。Worker 標籤見 [接受份額](/learn/prl-worker-accepted-shares)。",
      ],
      en: [
        "Choose the miner for the machine before you mine PRL. For Apple Silicon the source is the Pearl Metal repository. The author states any M-series Mac, M1 through M5, a hand-written Metal backend, Apache-2.0, no developer fee, and no affiliation with Pearl Research Labs. The same page says Intel Macs, virtual machines, and anything without a Metal GPU are not supported, and that the self-test tells you immediately. That is not “every Mac can mine”.",
        "Do not install Pearl Metal on an NVIDIA or AMD rig and hope. Kryptex’s PRL page lists KRig, SRBMiner-MULTI, PeakMiner, ForgeMiner, RGMiner, Blockz-miner, Fl4shMiner, BzMiner, and OneZeroMiner, with starting points for Windows, Linux, Docker, HiveOS, and MMPOS. Beside the KRig section the page names AMD RDNA 2, RDNA 3, RDNA 4, CDNA 4, integrated RDNA 3.5 with a flag, and NVIDIA RTX 2000 through 5000. Those are the programs and GPU families the pool page names. Hashrate examples on that page are not an expected rate for your Mac and not an earnings promise.",
        "The login follows the pool. Metal `init` asks for the pool, a `prl1` payout address, and a worker label. Kryptex’s page allows a wallet or a username plus a worker. Auto-convert uses the username, and the withdrawal may not be PRL. In every program the worker is not another wallet. After setup, look the public address up on [PRL monitoring](/projects/prl). Do not upload the miner to this site. This site does not install or start these programs. The Agent controls only IOTA Train at Home on a Mac.",
        "## A hashrate example and a calculator are different sentences",
        "Kryptex’s page separates share difficulty from earnings: it says difficulty does not change earnings. A Minerstat-style PRL calculator takes hashrate, power, pool fee, and electricity price as separate inputs, then shows estimated reward, electricity cost, and profit. When you read a calculator, keep the gross reward and the profit after electricity. Do not copy only the profit. The author supports Pearl Metal on Apple Silicon and warns that electricity can exceed the coin value. This page does not describe Mac mining as income and does not promise a hashrate.",
        "## Example: the wrong program",
        "An Intel Mac from 2020 opens Pearl Metal. The author’s support list does not include it, so a failed self-test matches that page. It does not mean the pool banned the address. An M-series Mac that borrows the RTX hashrate examples on Kryptex’s page is reading rates for the GPUs named there, not for that Mac. The next step is: on M-series, configure Metal with a `prl1` and a pool; on a GPU rig, use a program that page still lists; then watch last share time on [PRL monitoring](/projects/prl) instead of a yearly income figure.",
        "## Limits",
        "Whether a program runs on your driver is a question for the author’s repository and the pool’s current page. A miner named on neither page has unknown compatibility here. Reward moves with difficulty, price, fees, and electricity. There is no daily-income promise.",
        "After it connects, read the figures in [hashrate and rewards on a Mac](/learn/pearl-prl-mac-monitoring). Worker labels are in [accepted shares](/learn/prl-worker-accepted-shares).",
      ],
      ko: [
        "PRL을 캐기 전에 기기를 보고 채굴기를 고릅니다. Apple Silicon의 근거는 Pearl Metal 저장소입니다. 저자는 M 시리즈 Mac, M1부터 M5, 손으로 쓴 Metal 백엔드, Apache-2.0, 개발자 수수료 없음, Pearl Research Labs와 무관함을 적습니다. 같은 페이지는 Intel Mac, 가상 머신, Metal GPU가 없는 기기는 지원하지 않으며 자체 검사가 바로 알려 준다고 합니다. 모든 Mac이 캘 수 있다는 뜻이 아닙니다.",
        "NVIDIA나 AMD 장비에 Pearl Metal을 설치하고 운에 맡기지 마세요. Kryptex PRL 페이지는 KRig, SRBMiner-MULTI, PeakMiner, ForgeMiner, RGMiner, Blockz-miner, Fl4shMiner, BzMiner, OneZeroMiner를 나열하고 Windows, Linux, Docker, HiveOS, MMPOS 같은 시작점을 줍니다. KRig 옆에는 AMD RDNA 2, RDNA 3, RDNA 4, CDNA 4, 플래그가 있는 통합 RDNA 3.5, NVIDIA RTX 2000부터 5000이 적혀 있습니다. 풀 페이지가 이름을 적은 프로그램과 GPU 계열입니다. 그 해시레이트 예는 Mac의 기대 속도도, 수익 약속도 아닙니다.",
        "로그인은 풀을 따릅니다. Metal `init`은 풀, `prl1` 지급 주소, 워커 이름을 묻습니다. Kryptex 페이지는 지갑 또는 사용자명에 워커를 붙입니다. 자동 환산은 사용자명을 쓰고 인출이 PRL이 아닐 수 있습니다. 어느 프로그램에서나 워커는 다른 지갑이 아닙니다. 설정 뒤에는 [PRL 모니터](/projects/prl)에서 공개 주소를 봅니다. 채굴기 파일을 이 사이트에 올리지 마세요. 이 사이트는 프로그램을 설치하거나 시작하지 않습니다. Agent는 IOTA Train at Home용 Mac만 다룹니다.",
        "## 해시레이트 예와 계산기는 다른 문장입니다",
        "Kryptex 페이지는 지분 난이도와 수익을 나눕니다. 난이도는 수익을 바꾸지 않는다고 합니다. Minerstat식 PRL 계산기는 해시레이트, 전력, 풀 수수료, 전기 가격을 따로 받고 추정 보상, 전기 비용, 이익을 보여 줍니다. 계산기를 읽을 때는 총보상과 전기요금 뒤의 이익을 둘 다 두세요. 이익만 베끼지 마세요. 저자가 지원하는 것은 Apple Silicon의 Pearl Metal이며, 전기요금이 코인 가치를 넘을 수 있다고 알립니다. 여기서 Mac 채굴을 수입으로 말하지 않고 해시레이트도 약속하지 않습니다.",
        "## 예: 프로그램을 잘못 고른 경우",
        "2020년 Intel Mac에서 Pearl Metal을 열면, 저자의 지원 범위에 없으므로 자체 검사 실패는 그 페이지와 맞습니다. 풀이 주소를 막았다는 뜻이 아닙니다. M 시리즈 Mac이 Kryptex 페이지의 RTX 해시레이트 예를 가져오면, 그 TH/s는 페이지가 적은 GPU의 값이지 그 Mac의 값이 아닙니다. 다음 단계는 M 시리즈는 Metal에 `prl1`과 풀을 넣고, GPU 장비는 그 페이지가 아직 적는 프로그램을 쓰는 것입니다. 그다음 연간 수익 숫자 대신 [PRL 모니터](/projects/prl)의 마지막 지분 시각을 봅니다.",
        "## 한계",
        "드라이버에서 실행되는지는 저자 저장소와 풀의 현재 페이지가 답합니다. 두 페이지 어디에도 없는 채굴기의 호환성은 여기서 알 수 없음입니다. 보상은 난이도, 가격, 수수료, 전기요금에 따라 움직입니다. 일일 수입 약속은 없습니다.",
        "연결된 뒤의 숫자는 [Mac의 해시레이트와 보상](/learn/pearl-prl-mac-monitoring)에서 읽습니다. 워커 이름은 [수락 지분](/learn/prl-worker-accepted-shares)에 있습니다.",
      ],
      ja: [
        "PRLを掘る前に、マシンを見てからマイナーを選びます。Apple Siliconの根拠はPearl Metalのリポジトリです。作者は、任意のMシリーズ、M1からM5、手書きのMetalバックエンド、Apache-2.0、開発者手数料なし、Pearl Research Labsとは無関係、と書いています。同じページは、Intel Mac、仮想マシン、Metal GPUのないマシンは対象外で、自己テストがすぐ知らせるとしています。すべてのMacが掘れる、という意味ではありません。",
        "NVIDIAやAMDの機材にPearl Metalを入れて運任せにしないでください。KryptexのPRLページは、KRig、SRBMiner-MULTI、PeakMiner、ForgeMiner、RGMiner、Blockz-miner、Fl4shMiner、BzMiner、OneZeroMinerを挙げ、Windows、Linux、Docker、HiveOS、MMPOSなどの起点を示しています。KRigのそばには、AMD RDNA 2、RDNA 3、RDNA 4、CDNA 4、フラグ付きの統合RDNA 3.5、NVIDIA RTX 2000から5000とあります。プールページが名を挙げたプログラムとGPU系列です。そのハッシュレート例は、自分のMacの期待値でも収益の約束でもありません。",
        "ログインはプールに従います。Metalの `init` はプール、`prl1` の受取アドレス、ワーカー名を尋ねます。Kryptexのページはウォレットまたはユーザー名にワーカーを足します。自動換金はユーザー名を使い、引出はPRLでないことがあります。どのプログラムでもワーカーは別のウォレットではありません。設定のあと、[PRL監視](/projects/prl)で公開アドレスを見ます。マイナーのファイルをこのサイトへアップロードしないでください。このサイトはこれらのプログラムを導入も起動もしません。Agentが操作するのはIOTA Train at HomeのMacだけです。",
        "## ハッシュレートの例と計算機は別の文です",
        "Kryptexのページはシェア難易度と収益を分け、難易度は収益を変えないと書いています。Minerstat型のPRL計算機は、ハッシュレート、電力、プール手数料、電気料金を別々の入力にし、推定報酬、電気代、利益を出します。計算機を読むときは、総報酬と電気代を引いたあとの利益の両方を残します。利益だけを写さないでください。作者が対象とするのはApple SiliconのPearl Metalで、電気代がコイン価値を上回り得ると知らせています。ここではMacの採掘を収入とは書かず、ハッシュレートも約束しません。",
        "## 例: プログラムを取り違えたとき",
        "2020年のIntel MacでPearl Metalを開くと、作者の対象に含まれないので、自己テストの失敗はそのページと一致します。プールがアドレスを禁止したという意味ではありません。MシリーズのMacがKryptexページのRTXハッシュレート例を借りると、そのTH/sはページが名を挙げたGPUのものであり、そのMacのものではありません。次の手順は、MシリーズではMetalに `prl1` とプールを入れ、GPU機材ではそのページが今も挙げるプログラムを使うことです。そのあと年収の数字ではなく、[PRL監視](/projects/prl)の最終シェア時刻を見ます。",
        "## 限界",
        "ドライバで動くかは、作者のリポジトリとプールの現在のページが答えます。二つのページのどちらにもないマイナーの互換性は、ここでは不明です。報酬は難易度、価格、手数料、電気代とともに動きます。日次収入の約束はありません。",
        "接続したあとの数字は [Macのハッシュレートと報酬](/learn/pearl-prl-mac-monitoring) で読みます。ワーカー名は [受理シェア](/learn/prl-worker-accepted-shares) にあります。",
      ],
    },
    questions: {
      zh: [
        {
          question: "Intel Mac 可以用 Pearl Metal 吗？",
          answer:
            "作者页面写明不支持 Intel Mac、虚拟机和没有 Metal GPU 的机器。自检失败符合该说明，并不表示矿池封了你的 prl1 地址。",
        },
        {
          question: "Kryptex 页面上的 RTX 算力能否当作 Mac 的预期？",
          answer:
            "不能。那是矿池页面给点名显卡的例子。M 系列 Mac 用 Pearl Metal 自己的运行结果，不用那些算力例子代替，这里也不承诺收益。",
        },
        {
          question: "计算器里的利润是否保证到账？",
          answer:
            "不保证。计算器把估计奖励、电费和利润分开。矿池是否付款取决于该池当前规则和你的未付余额。本站不提现。",
        },
      ],
      "zh-TW": [
        {
          question: "Intel Mac 可以用 Pearl Metal 嗎？",
          answer:
            "作者頁面寫明不支援 Intel Mac、虛擬機和沒有 Metal GPU 的機器。自檢失敗符合該說明，並不表示礦池封了你的 prl1 地址。",
        },
        {
          question: "Kryptex 頁面上的 RTX 算力能否當作 Mac 的預期？",
          answer:
            "不能。那是礦池頁面給點名顯卡的例子。M 系列 Mac 用 Pearl Metal 自己的運行結果，不用那些算力例子代替，這裡也不承諾收益。",
        },
        {
          question: "計算器裡的利潤是否保證到帳？",
          answer:
            "不保證。計算器把估計獎勵、電費和利潤分開。礦池是否付款取決於該池目前規則和你的未付餘額。本站不提現。",
        },
      ],
      en: [
        {
          question: "Can an Intel Mac run Pearl Metal?",
          answer:
            "The author’s page says Intel Macs, virtual machines, and machines without a Metal GPU are not supported. A failed self-test matches that page. It does not mean the pool banned your prl1 address.",
        },
        {
          question: "Can the RTX hashrates on Kryptex’s page stand in for a Mac?",
          answer:
            "No. They are the pool page’s examples for the GPUs it names. An M-series Mac uses Pearl Metal’s own run, not those figures. This page does not promise earnings.",
        },
        {
          question: "Does the calculator profit guarantee a payout?",
          answer:
            "No. A calculator separates estimated reward, electricity, and profit. Whether the pool pays depends on that pool’s current rule and your unpaid balance. This site does not withdraw.",
        },
      ],
      ko: [
        {
          question: "Intel Mac에서 Pearl Metal을 쓸 수 있나요?",
          answer:
            "저자 페이지는 Intel Mac, 가상 머신, Metal GPU가 없는 기기를 지원하지 않는다고 합니다. 자체 검사 실패는 그 설명과 맞습니다. 풀이 prl1 주소를 막았다는 뜻은 아닙니다.",
        },
        {
          question: "Kryptex 페이지의 RTX 해시레이트를 Mac 예상값으로 쓸 수 있나요?",
          answer:
            "없습니다. 풀 페이지가 이름을 적은 GPU의 예입니다. M 시리즈 Mac은 Pearl Metal 자신의 실행 결과를 봅니다. 여기서 수익을 약속하지 않습니다.",
        },
        {
          question: "계산기의 이익은 지급을 보장하나요?",
          answer:
            "보장하지 않습니다. 계산기는 추정 보상, 전기요금, 이익을 나눕니다. 풀의 지급은 그 풀의 현재 규칙과 미지급 잔액에 달렸습니다. 이 사이트는 인출하지 않습니다.",
        },
      ],
      ja: [
        {
          question: "Intel MacでPearl Metalは使えますか？",
          answer:
            "作者のページは、Intel Mac、仮想マシン、Metal GPUのないマシンは対象外だとしています。自己テストの失敗はその説明と一致します。プールがprl1アドレスを禁止したという意味ではありません。",
        },
        {
          question: "KryptexページのRTXハッシュレートをMacの予想値にできますか？",
          answer:
            "できません。プールページが名を挙げたGPUの例です。MシリーズのMacはPearl Metal自身の実行結果を見ます。ここでは収益を約束しません。",
        },
        {
          question: "計算機の利益は支払を保証しますか？",
          answer:
            "保証しません。計算機は推定報酬、電気代、利益を分けます。プールが払うかは、そのプールの現在の規則と未払い残高によります。このサイトは引き出しをしません。",
        },
      ],
    },
  },
];
