import type { Article } from "../articles";
type Locale = keyof Article["title"];

function L(zh: string, zhTW: string, en: string, ko: string, ja: string): Record<Locale, string> {
  return { zh, "zh-TW": zhTW, en, ko, ja };
}
function qa(
  zh: [string, string],
  zhTW: [string, string],
  en: [string, string],
  ko: [string, string],
  ja: [string, string],
): Record<Locale, Array<{ question: string; answer: string }>> {
  return {
    zh: [{ question: zh[0], answer: zh[1] }],
    "zh-TW": [{ question: zhTW[0], answer: zhTW[1] }],
    en: [{ question: en[0], answer: en[1] }],
    ko: [{ question: ko[0], answer: ko[1] }],
    ja: [{ question: ja[0], answer: ja[1] }],
  };
}
function mergeQa(
  parts: Array<Record<Locale, Array<{ question: string; answer: string }>>>,
): Record<Locale, Array<{ question: string; answer: string }>> {
  const locales: Locale[] = ["zh", "zh-TW", "en", "ko", "ja"];
  return Object.fromEntries(
    locales.map((locale) => [locale, parts.flatMap((part) => part[locale])]),
  ) as Record<Locale, Array<{ question: string; answer: string }>>;
}

const monitor: Article = {
  slug: "erg-mining-monitor-guide",
  modified: "2026-10-24",
  project: "erg",
  sources: [
    { name: "2Miners · ERG help", url: "https://erg.2miners.com/help" },
    { name: "Ergo Platform", url: "https://ergoplatform.org/" },
    { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    {
      name: "Ergo Docs · Address types",
      url: "https://docs.ergoplatform.com/dev/wallet/address/address_types/",
    },
  ],
  related: ["erg-p2pk-address-monitoring", "erg-rewards-balances-payments", "erg-miner-no-shares"],
  topic: L(
    "该填哪种地址",
    "該填哪種地址",
    "Which address to paste",
    "어떤 주소를 넣을지",
    "どのアドレスを入れるか",
  ),
  title: L(
    "ERG 监控该填哪种以 9 开头的 Autolykos 地址？",
    "ERG 監控該填哪種以 9 開頭的 Autolykos 地址？",
    "Which 9-address belongs on the ERG Autolykos monitor?",
    "ERG Autolykos 모니터에는 9로 시작하는 어떤 주소를 넣나요?",
    "ERG Autolykos モニターには 9 で始まるどのアドレスを入れますか？",
  ),
  description: L(
    "把矿机里 2Miners 用来收 ERG 的主网地址贴到监控。以 9 开头、检查通过才查 erg.2miners.com 的公开账户。若付款本来是 BTC 或 TON，本页读不了，不要为此改矿机。单独 SOLO 类别不并进这一行。",
    "把礦機裡 2Miners 用來收 ERG 的主網地址貼到監控。以 9 開頭且檢查通過，才查 erg.2miners.com 的公開帳戶。若付款本來是 BTC 或 TON，本頁讀不了，不要為此改礦機。單獨的 SOLO 類別不併進這一列。",
    "Paste the mainnet address your miner uses as the ERG payout on 2Miners. Only a 9-address that checks out opens the public account on erg.2miners.com. If the payout is already BTC or TON, this page cannot read it, and you should not change the miner for that. The separate SOLO category is not merged into this row.",
    "채굴기가 2Miners에서 ERG를 받도록 넣은 메인넷 주소를 모니터에 붙이세요. 9로 시작하고 검사가 통과한 주소만 erg.2miners.com 공개 계정을 엽니다. 지급이 이미 BTC나 TON이면 이 페이지는 읽지 못하며, 그 때문에 채굴기를 바꾸지 마세요. 별도 SOLO 구분은 이 행에 합치지 않습니다.",
    "マイナーが 2Miners で ERG を受け取るメインネットアドレスをモニターへ貼ります。9 で始まり検査を通ったアドレスだけが erg.2miners.com の公開口座を開きます。支払いがすでに BTC または TON ならこのページは読めず、そのためにマイナーを変えないでください。別枠の SOLO はこの行に混ぜません。",
  ),
  summary: L(
    "监控读的是矿池上的公开付款地址。打开 [ERG 监控](/projects/erg)，贴上你在矿池实际用来收 ERG 的、以 9 开头的地址。若矿机本来付给 BTC 或 TON，本页读不了那些收款地址，不要为了能查询而改掉正在使用的付款。",
    "監控讀的是礦池上的公開付款地址。打開 [ERG 監控](/projects/erg)，貼上你在礦池實際用來收 ERG 的、以 9 開頭的地址。若礦機本來付給 BTC 或 TON，本頁讀不了那些收款地址，不要為了能查詢而改掉正在使用的付款。",
    "The monitor reads the public pool payout address. Open the [ERG monitor](/projects/erg) and paste the 9-address the pool actually uses to pay you ERG. If the miner is intentionally paid in BTC or TON, this page cannot read those destinations. Do not change a working payout just so this page can open.",
    "모니터는 풀의 공개 지급 주소를 읽습니다. [ERG 모니터](/projects/erg)를 열고, 풀이 실제로 ERG를 보내는 9 주소를 붙이세요. 채굴기가 일부러 BTC나 TON으로 지급된다면 이 페이지는 그 주소를 읽지 못합니다. 이 페이지를 열려고 쓰던 지급을 바꾸지 마세요.",
    "モニターが読むのはプールの公開支払先です。[ERG モニター](/projects/erg)を開き、プールが実際に ERG を支払う 9 アドレスを貼ってください。マイナーが意図して BTC または TON で支払うなら、このページはその宛先を読めません。このページを開くために、動いている支払いを変えないでください。",
  ),
  comparisonTitle: L(
    "这一行接受什么",
    "這一列接受什麼",
    "What this row accepts",
    "이 행이 받는 것",
    "この行が受け付けるもの",
  ),
  comparison: {
    zh: {
      headers: ["你手里的字符串", "能否打开本页", "下一步"],
      rows: [
        [
          "矿机 --user 里、点号前的 ERG 地址，以 9 开头",
          "可以，校验通过后查询公开账户",
          "贴到 ERG 监控",
        ],
        [
          "同一帮助页给出的 BTC 或 TON 收款地址",
          "不可以",
          "本监控读不了。核对矿池里的实际付款币，不要为了输入方便改掉正在使用的付款",
        ],
        [
          "不是以 9 开头、或检查通不过的字符串",
          "不可以",
          "回到钱包复制完整的 ERG 收款地址。类型差别见地址指南",
        ],
        ["API 索引里另列的 ERG SOLO 类别", "不合并进这一行", "只读 erg.2miners.com 的普通账户"],
      ],
    },
    "zh-TW": {
      headers: ["你手上的字串", "能否打開本頁", "下一步"],
      rows: [
        [
          "礦機 --user 裡、點號前的 ERG 地址，以 9 開頭",
          "可以，校驗通過後查詢公開帳戶",
          "貼到 ERG 監控",
        ],
        [
          "同一說明頁給出的 BTC 或 TON 收款地址",
          "不可以",
          "本監控讀不了。核對礦池裡的實際付款幣，不要為了輸入方便改掉正在使用的付款",
        ],
        [
          "不是以 9 開頭、或檢查通不過的字串",
          "不可以",
          "回到錢包複製完整的 ERG 收款地址。類型差別見地址指南",
        ],
        ["API 索引另列的 ERG SOLO 類別", "不合併進這一列", "只讀 erg.2miners.com 的一般帳戶"],
      ],
    },
    en: {
      headers: ["String you have", "Opens this page", "Next step"],
      rows: [
        [
          "ERG address before the dot in --user, starting with 9",
          "Yes, after it checks out",
          "Paste it on the ERG monitor",
        ],
        [
          "BTC or TON payout from the same help page",
          "No",
          "This monitor cannot read it. Check the payout coin on the pool. Do not change a working payout for easier input",
        ],
        [
          "A string that does not start with 9, or that fails the check",
          "No",
          "Copy the full ERG receive address from the wallet. Address classes are in the address guide",
        ],
        [
          "ERG SOLO category listed separately in the API index",
          "Not merged into this row",
          "This page reads the regular erg.2miners.com account",
        ],
      ],
    },
    ko: {
      headers: ["가진 문자열", "이 페이지를 여나", "다음"],
      rows: [
        ["--user 에서 점 앞의 ERG 주소, 9로 시작", "예, 검사 후", "ERG 모니터에 붙이기"],
        [
          "같은 도움말의 BTC 또는 TON 지급 주소",
          "아니오",
          "이 모니터는 읽지 못합니다. 풀의 실제 지급 코인을 확인하고, 입력을 위해 쓰던 지급을 바꾸지 마세요",
        ],
        [
          "9로 시작하지 않거나 검사에 떨어지는 문자열",
          "아니오",
          "지갑에서 완전한 ERG 수신 주소를 복사하세요. 종류 차이는 주소 가이드에 있습니다",
        ],
        ["API 색인의 별도 ERG SOLO 구분", "이 행에 합치지 않음", "erg.2miners.com 일반 계정만"],
      ],
    },
    ja: {
      headers: ["手元の文字列", "このページを開くか", "次"],
      rows: [
        ["--user のドット前にある ERG、9 で始まる", "はい、検査のあと", "ERG モニターに貼る"],
        [
          "同じヘルプの BTC または TON 受取",
          "いいえ",
          "このモニターは読めません。プールの実際の支払コインを確認し、入力のために動いている支払いを変えないでください",
        ],
        [
          "9 で始まらない、または検査に落ちる文字列",
          "いいえ",
          "ウォレットから完全な ERG 受取アドレスをコピーしてください。種別の違いはアドレスガイドにあります",
        ],
        ["API 索引に別記された ERG SOLO", "この行には混ぜない", "erg.2miners.com の通常口座だけ"],
      ],
    },
  },
  body: {
    zh: [
      "贴矿机正在用来收 ERG 的那串地址：2Miners 帮助页要求算法选 Autolykos，钱包地址放在矿工程序的用户字段里，矿机名可以接在点号后面。本页只认主网、以 9 开头且检查通过的付款地址，并向 erg.2miners.com 的公开账户要余额、已付、滚动 24 小时收益和矿工列表。地址类型见专门的地址指南。若矿机的付款本来是 BTC 或 TON，本页读不了那些地址，也不要为此改配置。",
      "## 这一行上的数字指什么",
      "地址是账户钥匙。它下面可以挂多台矿机，矿机名来自配置里的 RIG_ID，帮助页写明最长 32 个字符，可用英文字母、数字、减号和下划线。未支付余额、累计已付和 24 小时收益都属于这一个付款地址，不会按矿工拆成几份收入。算力是矿池返回的当前账户算力和各矿工算力，本页不把它换算成 ERG。",
      "## 贴上去之前先看三处",
      "- 打开矿机配置，看 `--user`、`-u` 或 `--wallet` 点号前面的字符串。若你本来就把付款设成 BTC 或 TON，本监控读不了那些收款地址。到矿池账户页核对实际付款币，不要为了让本页能打开而改掉正在使用的付款。只有付款地址本来就是 ERG 时，才把那串贴进来。",
      "- 要贴进本页的地址以 9 开头，并且检查通过。不要把别的字符串改写成 9 来通过输入框。",
      "- 确认矿机连的是普通矿池主机，而不是你另外开的 SOLO。API 索引写明 ERG 同时有 PPLNS 和 SOLO 两类矿池；本页只查 erg.2miners.com 的普通账户，不把另一台服务器并进同一行。",
      "## 对不上时怎么分支",
      "- 字符串被拒绝：它不是合格的 9 开头地址。回到钱包重新复制 ERG 收款地址。不要把 BTC 充值串贴进本页，也不要为此改掉矿机里正在使用的付款。",
      "- 账户能打开但没有你起的矿机名：帮助页允许 RIG_ID 留空。空名字和你期望的 rig-1 不是同一条矿工记录。到矿池自己的账户页核对实际显示的名字。",
      "- 名字在，但你在另一区域或 SSL 端口挖：帮助页按区域列出主机，快速开始示例是 erg.2miners.com 端口 8888，SSL 用 18888。以你配置文件里的主机为准，本页仍用同一个付款地址查公开账户。",
      "## 示意，不是你的到账",
      "形状像「9」再接一长串字符、但检查对不上的字符串，不会被送去矿池。合格的 9 开头地址才会打开一行账户。这一行只说明什么会被拒绝，不是测量到的收益，也不保证下次付款。",
      "## 限额和做不到的事",
      "免费档每个项目 3 台已保存设备，Pro 100 台。名额按本项目的已保存设备计，不是按地址个数计。一个地址下展开矿工，不会自动占用名额；你若为每台矿工单独新建已保存设备，那些设备会计入名额。同一台已保存设备上的多条绑定不重复计。钱包余额只显示一份，不会复制成矿工收入。崩溃日志解读不占这个名额。本站 Agent 只控制 Train at Home 的 Mac，不能开关 Ergo 矿机。打开 [ERG 监控](/projects/erg)。地址分类见[哪种 9 地址才是 P2PK](/learn/erg-p2pk-address-monitoring)，没有份额时看[矿工离线](/learn/erg-miner-no-shares)。",
    ],
    "zh-TW": [
      "貼礦機正在用來收 ERG 的那串地址：2Miners 說明頁要求演算法選 Autolykos，錢包地址放在礦工程式的使用者欄位，礦機名稱可以接在點號後面。本頁只認主網、以 9 開頭且檢查通過的付款地址，並向 erg.2miners.com 的公開帳戶要餘額、已付、滾動 24 小時收益和礦工清單。地址類型見專門的地址指南。若礦機的付款本來是 BTC 或 TON，本頁讀不了那些地址，也不要為此改設定。",
      "## 這一列上的數字指什麼",
      "地址是帳戶鑰匙。它下面可以掛多台礦機，礦機名稱來自設定裡的 RIG_ID，說明頁寫明最長 32 個字元，可用英文字母、數字、減號和底線。未支付餘額、累計已付和 24 小時收益都屬於這一個付款地址，不會按礦工拆成幾份收入。算力是礦池回傳的目前帳戶算力和各礦工算力，本頁不把它換算成 ERG。",
      "## 貼上去之前先看三處",
      "- 打開礦機設定，看 `--user`、`-u` 或 `--wallet` 點號前面的字串。若你本來就把付款設成 BTC 或 TON，本監控讀不了那些收款地址。到礦池帳戶頁核對實際付款幣，不要為了讓本頁能打開而改掉正在使用的付款。只有付款地址本來就是 ERG 時，才把那串貼進來。",
      "- 要貼進本頁的地址以 9 開頭，並且檢查通過。不要把別的字串改寫成 9 來通過輸入框。",
      "- 確認礦機連的是一般礦池主機，而不是你另外開的 SOLO。API 索引寫明 ERG 同時有 PPLNS 和 SOLO 兩類礦池；本頁只查 erg.2miners.com 的一般帳戶，不把另一台伺服器併進同一列。",
      "## 對不上時怎麼分支",
      "- 字串被拒絕：它不是合格的 9 開頭地址。回到錢包重新複製 ERG 收款地址。不要把 BTC 充值串貼進本頁，也不要為此改掉礦機裡正在使用的付款。",
      "- 帳戶能打開但沒有你起的礦機名稱：說明頁允許 RIG_ID 留空。空名稱和你期望的 rig-1 不是同一條礦工紀錄。到礦池自己的帳戶頁核對實際顯示的名稱。",
      "- 名稱在，但你在另一區域或 SSL 埠挖掘：說明頁依區域列出主機，快速開始範例是 erg.2miners.com 埠 8888，SSL 用 18888。以你設定檔裡的主機為準，本頁仍用同一個付款地址查公開帳戶。",
      "## 示意，不是你的入帳",
      "形狀像「9」再接一長串字元、但檢查對不上的字串，不會被送去礦池。合格的 9 開頭地址才會打開一列帳戶。這一列只說明什麼會被拒絕，不是測量到的收益，也不保證下次付款。",
      "## 限額和做不到的事",
      "免費方案每個項目 3 台已儲存裝置，Pro 100 台。名額按本項目的已儲存裝置計，不是按地址個數計。一個地址下展開礦工，不會自動占用名額；你若為每台礦工單獨新建已儲存裝置，那些裝置會計入名額。同一台已儲存裝置上的多筆綁定不重複計。錢包餘額只顯示一份，不會複製成礦工收入。當機日誌解讀不占這個名額。本站 Agent 只控制 Train at Home 的 Mac，不能開關 Ergo 礦機。打開 [ERG 監控](/projects/erg)。地址分類見[哪種 9 地址才是 P2PK](/learn/erg-p2pk-address-monitoring)，沒有份額時看[礦工離線](/learn/erg-miner-no-shares)。",
    ],
    en: [
      "Paste the address your miner is using to receive ERG. The 2Miners help page tells you to select Autolykos and to put the wallet in the miner’s user field, with an optional rig name after a dot. This page accepts only a mainnet payout address that starts with 9 and checks out, then reads the public account on erg.2miners.com for balance, paid, rolling 24-hour reward, and the worker list. Address classes are in the dedicated address guide. If the miner’s payout is already BTC or TON, this page cannot read those addresses, and you should not change the config for that.",
      "## What the numbers on this row mean",
      "The address is the account key. Several rigs can sit under it. The rig name is the RIG_ID from the miner config. The help page caps that name at 32 characters and allows English letters, digits, hyphen, and underscore. Unpaid balance, total paid, and the 24-hour reward all belong to that one payout address. They are not split into income per worker. Hashrate is the pool’s current account figure and each worker’s own figure. This page does not convert hashrate into ERG.",
      "## Three checks before you paste",
      "- Open the miner config and read the text before the dot in `--user`, `-u`, or `--wallet`. If you intentionally set the payout to BTC or TON, this monitor cannot read those destinations. Check the payout coin on the pool account page. Do not change a working payout so this page can open. Paste the string here only when the payout address is already ERG.",
      "- The address you paste here starts with 9 and checks out. Do not rewrite some other string so that it starts with 9 just to pass the box.",
      "- Confirm the miner points at the regular pool host, not a SOLO host you configured separately. The API index lists both PPLNS and SOLO pools for ERG. This page reads only the regular account on erg.2miners.com and does not merge another server into the same row.",
      "## What to do when it does not match",
      "- The string is refused. It is not a valid 9-prefix address. Copy the ERG receive address from the wallet again. Do not paste a BTC deposit string here, and do not change a working miner payout for that.",
      "- The account opens but your rig name is missing. The help page allows an empty RIG_ID. An empty name and the rig-1 you expected are different worker rows. Read the name on the pool’s own account page.",
      "- The name is present and you mine in another region or on SSL. The help page lists hosts by region. Its quick start uses erg.2miners.com port 8888, and SSL uses 18888. Trust the host in your config. This page still looks up the same payout address.",
      "## Illustrative, not your payout",
      "A string shaped like 9 plus a long tail that fails the check is not sent to the pool. A valid 9-address opens one account row. The sketch only shows what is refused. It is not measured income and it does not promise the next payout.",
      "## Limits",
      "Free keeps three saved devices per project, and Pro keeps 100. The quota counts saved device records for this project, not the number of addresses. Showing the workers under one address does not consume a slot. If you explicitly save a separate device record for each worker, those records count. Several bindings on the same saved device do not add slots. The wallet balance is shown once and is not copied into worker income. Crash-log interpretation does not use this quota. The Agent on this site controls a Train at Home Mac only. It cannot start or stop an Ergo miner. Open the [ERG monitor](/projects/erg). Address classes are in [which 9-address is P2PK](/learn/erg-p2pk-address-monitoring). Missing shares are in [worker offline](/learn/erg-miner-no-shares).",
    ],
    ko: [
      "채굴기가 ERG를 받도록 넣어 둔 주소를 붙이세요. 2Miners 도움말은 알고리즘을 Autolykos로 고르고, 지갑 주소를 채굴기 사용자 칸에 넣으며, 리그 이름은 점 뒤에 둘 수 있다고 적습니다. 이 페이지는 9로 시작하고 검사를 통과한 메인넷 지급 주소만 받고, erg.2miners.com 공개 계정에서 잔액, 지급 완료, 롤링 24시간 보상, 워커 목록을 읽습니다. 주소 종류는 주소 가이드에 있습니다. 채굴기 지급이 이미 BTC나 TON이면 이 페이지는 그 주소를 읽지 못하며, 그 때문에 설정을 바꾸지 마세요.",
      "## 이 행의 숫자가 뜻하는 것",
      "주소가 계정 열쇠입니다. 그 아래에 여러 리그가 있을 수 있습니다. 리그 이름은 설정의 RIG_ID입니다. 도움말은 이름을 32자까지로 하고, 영문, 숫자, 하이픈, 밑줄을 허용합니다. 미지급 잔액, 누적 지급, 24시간 보상은 모두 그 지급 주소의 것입니다. 워커별 수입으로 나누지 않습니다. 해시레이트는 풀이 준 현재 계정 값과 각 워커 값입니다. 이 페이지는 해시레이트를 ERG로 바꾸지 않습니다.",
      "## 붙이기 전에 세 곳",
      "- 채굴기 설정에서 `--user`, `-u`, `--wallet`의 점 앞 문자열을 봅니다. 지급을 일부러 BTC나 TON으로 두었다면 이 모니터는 그 주소를 읽지 못합니다. 풀 계정 페이지에서 실제 지급 코인을 확인하세요. 이 페이지를 열려고 쓰던 지급을 바꾸지 마세요. 지급 주소가 원래 ERG일 때만 그 문자열을 붙입니다.",
      "- 이 페이지에 붙이는 주소는 9로 시작하고 검사를 통과해야 합니다. 입력칸을 통과하려고 다른 문자열을 9로 고쳐 쓰지 마세요.",
      "- 채굴기가 일반 풀 호스트를 보는지 확인하세요. 따로 연 SOLO가 아니어야 합니다. API 색인은 ERG에 PPLNS와 SOLO를 모두 적습니다. 이 페이지는 erg.2miners.com 일반 계정만 읽고 다른 서버를 같은 행에 합치지 않습니다.",
      "## 맞지 않을 때의 갈림",
      "- 문자열이 거부되면 올바른 9 주소가 아닙니다. 지갑에서 ERG 수신 주소를 다시 복사하세요. BTC 입금 문자열을 이 페이지에 붙이지 말고, 그 때문에 채굴기의 지급을 바꾸지 마세요.",
      "- 계정은 열리는데 리그 이름이 없으면, 도움말은 RIG_ID를 비워 둘 수 있습니다. 빈 이름과 기대한 rig-1은 다른 워커 행입니다. 풀 계정 페이지의 실제 이름을 보세요.",
      "- 이름은 있는데 다른 지역이나 SSL로 캔다면, 도움말은 지역별 호스트를 나열합니다. 빠른 시작은 erg.2miners.com 포트 8888, SSL은 18888입니다. 설정 파일의 호스트를 기준으로 하세요. 이 페이지는 같은 지급 주소를 조회합니다.",
      "## 예시일 뿐, 입금이 아님",
      "9 뒤에 긴 문자열이 붙었지만 검사가 실패하면 풀로 보내지 않습니다. 올바른 9 주소만 계정 한 행을 엽니다. 이 줄은 무엇이 거부되는지만 보여 줍니다. 측정된 수익이 아니고 다음 지급을 약속하지 않습니다.",
      "## 한도와 하지 않는 일",
      "무료는 프로젝트당 저장된 기기 3대, Pro는 100대입니다. 한도는 이 프로젝트의 저장 기기 수이지 주소 개수가 아닙니다. 한 주소 아래 워커를 펼쳐 보는 것은 슬롯을 쓰지 않습니다. 워커마다 저장 기기를 따로 만들면 그 기록이 한도에 포함됩니다. 같은 저장 기기의 여러 바인딩은 슬롯을 더하지 않습니다. 지갑 잔액은 한 번만 보이며 워커 수입으로 복사되지 않습니다. 크래시 로그 해석은 이 한도를 쓰지 않습니다. 이 사이트의 Agent는 Train at Home Mac만 제어하며 Ergo 채굴기를 켜거나 끄지 않습니다. [ERG 모니터](/projects/erg)를 여세요. 주소 종류는 [어떤 9 주소가 P2PK인가](/learn/erg-p2pk-address-monitoring), 점유가 없으면 [워커 오프라인](/learn/erg-miner-no-shares)을 보세요.",
    ],
    ja: [
      "マイナーが ERG の受取に使っているアドレスを貼ってください。2Miners のヘルプはアルゴリズムを Autolykos にし、ウォレットをユーザー欄へ入れ、リグ名はドットの後ろに付けられると書いています。このページが受けるのは 9 で始まり検査を通ったメインネットの支払先だけで、erg.2miners.com の公開口座から残高、支払済み、直近 24 時間の報酬、ワーカー一覧を読みます。アドレスの種類は専用のアドレスガイドにあります。マイナーの支払いがすでに BTC または TON なら、このページはそのアドレスを読めず、そのために設定を変えないでください。",
      "## この行の数字が意味するもの",
      "アドレスが口座の鍵です。その下に複数リグをぶら下げられます。リグ名は設定の RIG_ID です。ヘルプは名前を 32 文字までとし、英字、数字、ハイフン、アンダースコアを許します。未払い残高、累計支払、24 時間報酬はすべてその一つの支払先のものです。ワーカーごとの収入には分けません。ハッシュレートはプールが返した現在の口座値と各ワーカーの値です。このページはハッシュレートを ERG に換えません。",
      "## 貼る前に見る三か所",
      "- マイナー設定で `--user`、`-u`、`--wallet` のドット前を読みます。支払いを意図して BTC または TON にしているなら、このモニターはその宛先を読めません。プールの口座ページで実際の支払コインを確認してください。このページを開くために、動いている支払いを変えないでください。支払先がもともと ERG のときだけ、その文字列を貼ります。",
      "- このページに貼るアドレスは 9 で始まり、検査を通る必要があります。入力欄を通すために別の文字列を 9 に書き換えてはいけません。",
      "- マイナーが通常のプールホストを向いているか確認します。別に立てた SOLO ではありません。API 索引は ERG に PPLNS と SOLO の両方を載せています。このページは erg.2miners.com の通常口座だけを読み、別サーバーを同じ行へ混ぜません。",
      "## 合わないときの分岐",
      "- 文字列が拒否されたら、正しい 9 始まりのアドレスではありません。ウォレットから ERG の受取アドレスをコピーし直してください。BTC の入金文字列をこのページに貼らず、そのためにマイナーの支払いを変えないでください。",
      "- 口座は開くのにリグ名が無い場合、ヘルプは RIG_ID を空にできます。空の名前と期待した rig-1 は別のワーカー行です。プール自身の口座ページに出ている名前を読んでください。",
      "- 名前はあるが別リージョンや SSL で掘っている場合、ヘルプはリージョン別にホストを並べます。クイックスタートは erg.2miners.com のポート 8888、SSL は 18888 です。設定ファイルのホストを基準にしてください。このページは同じ支払先を引いたままです。",
      "## 例示であり、入金ではない",
      "9 のあとに長い文字列が続いても検査に落ちれば、プールへ送りません。正しい 9 アドレスだけが口座を一行開きます。この行は何が拒否されるかだけを示します。測定した収入ではなく、次の支払いを約束しません。",
      "## 上限とできないこと",
      "無料はプロジェクトあたり保存済みデバイス 3 台、Pro は 100 台です。枠はアドレスの個数ではなく、このプロジェクトの保存済みデバイス数です。一つのアドレスの下にワーカーを表示しても枠は減りません。ワーカーごとに保存デバイスを明示して作ると、その記録は枠に入ります。同じ保存デバイス上の複数バインドは枠を増やしません。ウォレット残高は一度だけ表示し、ワーカー収入へ複製しません。クラッシュログの読解はこの枠を使いません。このサイトの Agent が操作するのは Train at Home の Mac だけで、Ergo マイナーの起動や停止はしません。[ERG モニター](/projects/erg)を開いてください。アドレスの種類は[どの 9 アドレスが P2PK か](/learn/erg-p2pk-address-monitoring)、シェアが無いときは[ワーカーがオフライン](/learn/erg-miner-no-shares)を見てください。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "不是以 9 开头的字符串能贴进 ERG 监控吗？",
        "不能。请从钱包复制完整的 ERG 收款地址。协议脚本和付款地址的差别见[P2PK 监控](/learn/erg-p2pk-address-monitoring)。",
      ],
      [
        "不是以 9 開頭的字串能貼進 ERG 監控嗎？",
        "不能。請從錢包複製完整的 ERG 收款地址。協定腳本和付款地址的差別見[P2PK 監控](/learn/erg-p2pk-address-monitoring)。",
      ],
      [
        "Can I paste a string that does not start with 9?",
        "No. Copy the full ERG receive address from the wallet. The difference between a protocol script and the payout address is in [P2PK monitoring](/learn/erg-p2pk-address-monitoring).",
      ],
      [
        "9로 시작하지 않는 문자열을 넣을 수 있나요?",
        "아니요. 지갑에서 완전한 ERG 수신 주소를 복사하세요. 프로토콜 스크립트와 지급 주소의 차이는 [P2PK 모니터링](/learn/erg-p2pk-address-monitoring)에 있습니다.",
      ],
      [
        "9 で始まらない文字列を貼れますか？",
        "いいえ。ウォレットから完全な ERG の受取アドレスをコピーしてください。プロトコルのスクリプトと支払先の違いは[P2PK の監視](/learn/erg-p2pk-address-monitoring)にあります。",
      ],
    ),
    qa(
      [
        "帮助页允许 BTC 或 TON 付款，这里能填吗？",
        "不能。本页读不了 BTC 或 TON 收款地址。到矿池账户页核对你实际选择的付款币。若挖矿本来就付给 BTC 或 TON，不要为了让本页能打开而改矿机用户字段。",
      ],
      [
        "說明頁允許 BTC 或 TON 付款，這裡能填嗎？",
        "不能。本頁讀不了 BTC 或 TON 收款地址。到礦池帳戶頁核對你實際選擇的付款幣。若挖礦本來就付給 BTC 或 TON，不要為了讓本頁能打開而改礦機使用者欄位。",
      ],
      [
        "The help page allows BTC or TON payouts. Can I paste those here?",
        "No. This page cannot read a BTC or TON destination. Check the payout coin you actually chose on the pool account page. If mining already pays BTC or TON, do not change the miner user field so this page can open.",
      ],
      [
        "도움말은 BTC나 TON 지급을 허용합니다. 여기 넣을 수 있나요?",
        "아니요. 이 페이지는 BTC나 TON 수신 주소를 읽지 못합니다. 풀 계정 페이지에서 실제로 고른 지급 코인을 확인하세요. 채굴이 이미 BTC나 TON으로 지급된다면, 이 페이지를 열려고 채굴기 사용자 칸을 바꾸지 마세요.",
      ],
      [
        "ヘルプは BTC や TON 払いを許しています。ここへ入れられますか？",
        "いいえ。このページは BTC や TON の宛先を読めません。プールの口座ページで、実際に選んだ支払コインを確認してください。採掘がすでに BTC または TON で支払うなら、このページを開くためにマイナーのユーザー欄を変えないでください。",
      ],
    ),
    qa(
      [
        "SOLO 算力会并进这一行吗？",
        "不会。API 索引把 ERG 的 SOLO 单独列出。本页账户地址是 erg.2miners.com 的普通账户，不合并另一台服务器。",
      ],
      [
        "SOLO 算力會併進這一列嗎？",
        "不會。API 索引把 ERG 的 SOLO 單獨列出。本頁帳戶網址是 erg.2miners.com 的一般帳戶，不合併另一台伺服器。",
      ],
      [
        "Does SOLO hashrate merge into this row?",
        "No. The API index lists an ERG SOLO category separately. This page’s account is the regular erg.2miners.com account and does not merge another server.",
      ],
      [
        "SOLO 해시레이트가 이 행에 합쳐지나요?",
        "아니요. API 색인은 ERG SOLO를 따로 적습니다. 이 페이지의 계정은 erg.2miners.com 일반 계정이며 다른 서버를 합치지 않습니다.",
      ],
      [
        "SOLO のハッシュレートはこの行に混ざりますか？",
        "いいえ。API 索引は ERG の SOLO を別に載せています。このページの口座は erg.2miners.com の通常口座で、別サーバーは混ぜません。",
      ],
    ),
    qa(
      [
        "一个地址下有五台矿工，会占满免费 3 台吗？",
        "不会自动占满。免费 3 台、Pro 100 台指的是本项目已保存设备。只是查看同一地址下的矿工不占名额。你为每台矿工单独保存设备时，那些设备才计入名额。",
      ],
      [
        "一個地址下有五台礦工，會占滿免費 3 台嗎？",
        "不會自動占滿。免費 3 台、Pro 100 台指的是本項目已儲存裝置。只是查看同一地址下的礦工不占名額。你為每台礦工單獨儲存裝置時，那些裝置才計入名額。",
      ],
      [
        "Five workers under one address fill the free three devices?",
        "Not by themselves. Free three and Pro 100 count saved devices for this project. Viewing workers under one address does not take a slot. Saving a separate device for each worker does.",
      ],
      [
        "주소 하나 아래 워커 다섯이 무료 3대를 채우나요?",
        "자동으로는 아닙니다. 무료 3대와 Pro 100대는 이 프로젝트의 저장 기기입니다. 한 주소의 워커를 보기만 하면 슬롯을 쓰지 않습니다. 워커마다 기기를 저장하면 그 기록이 셉니다.",
      ],
      [
        "一つのアドレスの下にワーカーが五台あると無料 3 台を埋めますか？",
        "自動では埋めません。無料 3 台と Pro 100 台は、このプロジェクトの保存済みデバイスです。一つのアドレスのワーカーを見るだけでは枠を使いません。ワーカーごとにデバイスを保存したとき、その記録が数に入ります。",
      ],
    ),
    qa(
      [
        "只要以 9 开头就一定能查吗？",
        "不够。还要是主网 P2PK 的长度和校验。形状像但校验失败的字符串不会送去矿池。文档也说 9 在主网上始终是 P2PK，别的前缀是别的类型。",
      ],
      [
        "只要以 9 開頭就一定能查嗎？",
        "不夠。還要是主網 P2PK 的長度和校驗。形狀像但校驗失敗的字串不會送去礦池。文件也說 9 在主網上始終是 P2PK，別的前綴是別的類型。",
      ],
      [
        "Is any string starting with 9 enough?",
        "No. It also needs the mainnet P2PK length and checksum. A lookalike that fails the check is not sent to the pool. The docs also say 9 on mainnet is always P2PK, and other prefixes are other types.",
      ],
      [
        "9로 시작하기만 하면 조회되나요?",
        "충분하지 않습니다. 메인넷 P2PK의 길이와 검사도 필요합니다. 모양만 같고 검사가 실패하면 풀로 보내지 않습니다. 문서도 메인넷의 9는 항상 P2PK이고 다른 접두는 다른 종류라고 합니다.",
      ],
      [
        "9 で始まりさえすれば照会できますか？",
        "足りません。メインネット P2PK の長さと検査も要ります。形だけ似て検査に落ちる文字列はプールへ送りません。文書も、メインネットの 9 は常に P2PK で、他の接頭は別の種類だと述べています。",
      ],
    ),
    qa(
      [
        "下一步打开哪里？",
        "打开 [ERG 监控](/projects/erg)。付款地址和铸币脚本的差别见[P2PK 监控](/learn/erg-p2pk-address-monitoring)。余额三个数见[收益与付款](/learn/erg-rewards-balances-payments)。",
      ],
      [
        "下一步打開哪裡？",
        "打開 [ERG 監控](/projects/erg)。付款地址和鑄幣腳本的差別見[P2PK 監控](/learn/erg-p2pk-address-monitoring)。餘額三個數見[收益與付款](/learn/erg-rewards-balances-payments)。",
      ],
      [
        "Where do I go next?",
        "Open the [ERG monitor](/projects/erg). The payout address versus the coinbase script is in [P2PK monitoring](/learn/erg-p2pk-address-monitoring). The three balance figures are in [rewards and payouts](/learn/erg-rewards-balances-payments).",
      ],
      [
        "다음은 어디를 여나요?",
        "[ERG 모니터](/projects/erg)를 여세요. 지급 주소와 코인베이스 스크립트의 차이는 [P2PK 모니터링](/learn/erg-p2pk-address-monitoring), 잔액 세 숫자는 [보상과 지급](/learn/erg-rewards-balances-payments)에 있습니다.",
      ],
      [
        "次はどこを開きますか？",
        "[ERG モニター](/projects/erg)を開いてください。支払先とコインベーススクリプトの違いは[P2PK の監視](/learn/erg-p2pk-address-monitoring)、残高の三つの数は[報酬と支払い](/learn/erg-rewards-balances-payments)にあります。",
      ],
    ),
  ]),
};

const address: Article = {
  slug: "erg-p2pk-address-monitoring",
  published: "2026-10-24",
  modified: "2026-10-24",
  project: "erg",
  sources: [
    {
      name: "Ergo Docs · Address types",
      url: "https://docs.ergoplatform.com/dev/wallet/address/address_types/",
    },
    { name: "2Miners · ERG help", url: "https://erg.2miners.com/help" },
    { name: "Ergo Platform", url: "https://ergoplatform.org/" },
  ],
  related: ["erg-mining-monitor-guide", "erg-rewards-balances-payments"],
  topic: L(
    "P2PK 和铸币脚本",
    "P2PK 和鑄幣腳本",
    "P2PK versus coinbase script",
    "P2PK와 코인베이스 스크립트",
    "P2PK とコインベーススクリプト",
  ),
  title: L(
    "ERG 监控为什么只认以 9 开头的 P2PK，而不是铸币用的 P2S？",
    "ERG 監控為什麼只認以 9 開頭的 P2PK，而不是鑄幣用的 P2S？",
    "Why the ERG monitor accepts a 9-prefix P2PK and not the P2S coinbase script",
    "ERG 모니터는 왜 9로 시작하는 P2PK만 받고 코인베이스 P2S는 받지 않나요?",
    "ERG モニターはなぜ 9 始まりの P2PK だけを受け、コインベースの P2S は受けないのか",
  ),
  description: L(
    "Ergo 主网上以 9 开头的地址是 P2PK。协议挖矿奖励锁在 P2S。2Miners 的 ERG 收款示例是 9 开头地址。监控只查这种矿池付款地址。",
    "Ergo 主網上以 9 開頭的地址是 P2PK。協定挖礦獎勵鎖在 P2S。2Miners 的 ERG 收款範例是 9 開頭地址。監控只查這種礦池付款地址。",
    "On Ergo mainnet a 9-address is P2PK. Protocol mining rewards lock in P2S. 2Miners’ ERG payout example starts with 9. The monitor looks up that pool payout address only.",
    "Ergo 메인넷에서 9 주소는 P2PK입니다. 프로토콜 채굴 보상은 P2S에 잠깁니다. 2Miners ERG 지급 예시는 9로 시작합니다. 모니터는 그 풀 지급 주소만 조회합니다.",
    "Ergo メインネットで 9 アドレスは P2PK です。プロトコルの採掘報酬は P2S にロックされます。2Miners の ERG 支払例は 9 で始まります。モニターはそのプール支払先だけを引きます。",
  ),
  summary: L(
    "把钱包里以 9 开头的 ERG 收款地址贴到 [ERG 监控](/projects/erg)。P2S 是协议锁奖励的脚本，不是这页要的矿池付款地址。",
    "把錢包裡以 9 開頭的 ERG 收款地址貼到 [ERG 監控](/projects/erg)。P2S 是協定鎖獎勵的腳本，不是這頁要的礦池付款地址。",
    "Paste the 9-prefix ERG receive address from your wallet into the [ERG monitor](/projects/erg). P2S is the script that locks protocol rewards, not the pool payout this page wants.",
    "지갑의 9로 시작하는 ERG 수신 주소를 [ERG 모니터](/projects/erg)에 붙이세요. P2S는 프로토콜 보상을 잠그는 스크립트이며, 이 페이지가 원하는 풀 지급 주소가 아닙니다.",
    "ウォレットの 9 で始まる ERG 受取アドレスを [ERG モニター](/projects/erg) に貼ってください。P2S はプロトコル報酬をロックするスクリプトで、このページが求めるプール支払先ではありません。",
  ),
  comparisonTitle: L(
    "地址类型对照",
    "地址類型對照",
    "Address classes",
    "주소 종류 대조",
    "アドレス種別の対照",
  ),
  comparison: {
    zh: {
      headers: ["类型", "文档怎么说", "本监控"],
      rows: [
        ["主网 P2PK（以 9 开头）", "以 9 开头一定是主网 P2PK", "接受，校验通过后查询矿池付款账户"],
        ["P2SH", "主网示例以 8 开头", "不接受"],
        ["P2S", "协议挖矿奖励锁在这里；前缀不固定", "不接受。这不是矿池付款地址"],
        ["测试网", "文档示例以 3 开头。本页不查", "不接受"],
      ],
    },
    "zh-TW": {
      headers: ["類型", "文件怎麼說", "本監控"],
      rows: [
        ["主網 P2PK（以 9 開頭）", "以 9 開頭一定是主網 P2PK", "接受，校驗通過後查詢礦池付款帳戶"],
        ["P2SH", "主網範例以 8 開頭", "不接受"],
        ["P2S", "協定挖礦獎勵鎖在這裡；前綴不固定", "不接受。這不是礦池付款地址"],
        ["測試網", "文件範例以 3 開頭。本頁不查", "不接受"],
      ],
    },
    en: {
      headers: ["Class", "What the docs say", "This monitor"],
      rows: [
        [
          "Mainnet P2PK (starts with 9)",
          "A 9-prefix is always mainnet P2PK",
          "Accepted, then the pool payout account is queried",
        ],
        ["P2SH", "Mainnet example starts with 8", "Not accepted"],
        [
          "P2S",
          "Protocol mining rewards lock here; prefix is not fixed",
          "Not accepted. This is not the pool payout address",
        ],
        [
          "Testnet",
          "The docs’ example starts with 3. This page does not look it up",
          "Not accepted",
        ],
      ],
    },
    ko: {
      headers: ["종류", "문서", "이 모니터"],
      rows: [
        ["메인넷 P2PK (9로 시작)", "9 접두는 항상 메인넷 P2PK", "받음. 검사 후 풀 지급 계정 조회"],
        ["P2SH", "메인넷 예시는 8로 시작", "받지 않음"],
        ["P2S", "프로토콜 채굴 보상이 여기 잠김. 접두 고정 아님", "받지 않음. 풀 지급 주소가 아님"],
        ["테스트넷", "문서 예시는 3으로 시작. 이 페이지는 조회하지 않음", "받지 않음"],
      ],
    },
    ja: {
      headers: ["種別", "文書", "このモニター"],
      rows: [
        [
          "メインネット P2PK（9 で始まる）",
          "9 で始まるものは必ずメインネット P2PK",
          "受ける。検査のあとプール支払口座を照会",
        ],
        ["P2SH", "メインネット例は 8 で始まる", "受けない"],
        [
          "P2S",
          "プロトコル採掘報酬はここへロック。接頭は固定ではない",
          "受けない。プール支払先ではない",
        ],
        ["テストネット", "文書の例は 3 で始まる。このページは照会しない", "受けない"],
      ],
    },
  },
  body: {
    zh: [
      "监控要的是矿池把 ERG 付给你的那个地址，不是区块里锁协议奖励的脚本。Ergo 地址文档写明：主网上以 9 开头的地址是 P2PK，挖矿奖励进入另一类地址 P2S。同一页写明，主网上以 9 开头的地址一定是 P2PK。2Miners 的 ERG 帮助页让你创建 ERG 钱包来收付款，给出的 ERG 示例以 9 开头，同时允许改收 BTC 或 TON。所以 P2PK 可以当矿池收款地址；不能从“铸币脚本是 P2S”推出“P2PK 收不到矿池付款”。",
      "## 前缀怎么认",
      "认地址看前缀，不必拆开内部字节。主网 P2PK 以 9 开头。文档里的 P2SH 示例以 8 开头，测试网 P2PK 示例以 3 开头。P2S 是协议挖矿奖励锁进去的那一类，前缀不固定。检查通不过的字符串不会被送去矿池。",
      "## 贴地址前核对什么",
      "- 在 Ergo 官方桌面钱包、Ergo Mobile Wallet，或帮助页点名的交易所里复制 ERG 收款地址。帮助页对 ERG 的建议是这些渠道，而不是 BTC 充值串。",
      "- 只保留以 9 开头的主网收款地址。以 8 开头的是文档里的 P2SH 形状，以 3 开头的测试网 P2PK 示例也不是本页。",
      "- 不要为了通过输入框，把别的地址改成 9 开头。改出来的字符串对不上。",
      "## 被拒绝或开错账户时",
      "- 输入框拒绝：回到钱包重新复制。形状像「9」加一半长度，或含有 0、O、I、l 这类 Base58 以外的字符，都不是这条 P2PK。",
      "- 你在矿机里填的是 BTC 或 TON：那是另一种付款币。本监控读不了这些收款地址。到矿池账户页核对你实际选择的付款币。若挖矿本来就付给 BTC 或 TON，不要为了让本页能打开而改矿机用户字段。只有付款地址本来就是 ERG 的 9 开头地址时，才把那串贴进监控。",
      "- 账户打开了，但余额是矿池账而不是链上每一张盒子：本页读的是 erg.2miners.com 上这个付款地址的公开账户，不列出 P2S 铸币盒子。",
      "## 示意，不是一笔真实转账",
      "文档自己的主网形状可以这样记：P2PK 像 9fRA…，P2SH 像 8UAp…，P2S 像 4MQy… 或 BxKB…。只把 9fRA 那一类、并且校验通过的地址贴进监控。这些是类型示意，不是你的余额。",
      "下一步打开 [ERG 监控](/projects/erg)。怎么把这串地址放进矿机用户字段，见[监控该填哪种地址](/learn/erg-mining-monitor-guide)。付款到账后余额怎么分开读，见[收益与付款](/learn/erg-rewards-balances-payments)。",
    ],
    "zh-TW": [
      "監控要的是礦池把 ERG 付給你的那個地址，不是區塊裡鎖協定獎勵的腳本。Ergo 地址文件寫明：主網上以 9 開頭的地址是 P2PK，挖礦獎勵進入另一類地址 P2S。同一頁寫明，主網上以 9 開頭的地址一定是 P2PK。2Miners 的 ERG 說明頁讓你建立 ERG 錢包來收付款，給出的 ERG 範例以 9 開頭，同時允許改收 BTC 或 TON。所以 P2PK 可以當礦池收款地址；不能從「鑄幣腳本是 P2S」推出「P2PK 收不到礦池付款」。",
      "## 前綴怎麼認",
      "認地址看前綴，不必拆開內部位元組。主網 P2PK 以 9 開頭。文件裡的 P2SH 範例以 8 開頭，測試網 P2PK 範例以 3 開頭。P2S 是協定挖礦獎勵鎖進去的那一類，前綴不固定。檢查通不過的字串不會被送去礦池。",
      "## 貼地址前核對什麼",
      "- 在 Ergo 官方桌面錢包、Ergo Mobile Wallet，或說明頁點名的交易所裡複製 ERG 收款地址。說明頁對 ERG 的建議是這些管道，而不是 BTC 充值串。",
      "- 只保留以 9 開頭的主網收款地址。以 8 開頭的是文件裡的 P2SH 形狀，以 3 開頭的測試網 P2PK 範例也不是本頁。",
      "- 不要為了通過輸入框，把別的地址改成 9 開頭。改出來的字串對不上。",
      "## 被拒絕或開錯帳戶時",
      "- 輸入框拒絕：回到錢包重新複製。形狀像「9」加一半長度，或含有 0、O、I、l 這類 Base58 以外的字元，都不是這條 P2PK。",
      "- 你在礦機裡填的是 BTC 或 TON：那是另一種付款幣。本監控讀不了這些收款地址。到礦池帳戶頁核對你實際選擇的付款幣。若挖礦本來就付給 BTC 或 TON，不要為了讓本頁能打開而改礦機使用者欄位。只有付款地址本來就是 ERG 的 9 開頭地址時，才把那串貼進監控。",
      "- 帳戶打開了，但餘額是礦池帳而不是鏈上每一張盒子：本頁讀的是 erg.2miners.com 上這個付款地址的公開帳戶，不列出 P2S 鑄幣盒子。",
      "## 示意，不是一筆真實轉帳",
      "文件自己的主網形狀可以這樣記：P2PK 像 9fRA…，P2SH 像 8UAp…，P2S 像 4MQy… 或 BxKB…。只把 9fRA 那一類、並且校驗通過的地址貼進監控。這些是類型示意，不是你的餘額。",
      "下一步打開 [ERG 監控](/projects/erg)。怎麼把這串地址放進礦機使用者欄位，見[監控該填哪種地址](/learn/erg-mining-monitor-guide)。付款入帳後餘額怎麼分開讀，見[收益與付款](/learn/erg-rewards-balances-payments)。",
    ],
    en: [
      "The monitor wants the address the pool pays ERG to, not the script that locks protocol rewards inside a block. Ergo’s address docs state that a mainnet address starting with 9 is P2PK, and that mining rewards go to a different class, P2S. The same page states that an address starting with 9 is always a P2PK address on mainnet. The 2Miners ERG help page tells you to create an ERG wallet for payouts, shows an ERG example that starts with 9, and also allows BTC or TON. A P2PK address can be the pool payout recipient. A P2S coinbase script does not imply that P2PK cannot receive those payouts.",
      "## How to read the prefix",
      "Read the prefix. You do not need to unpack the bytes inside. Mainnet P2PK starts with 9. The docs’ P2SH example starts with 8, and the testnet P2PK example starts with 3. P2S is the class that locks protocol mining rewards, and its prefix is not fixed. A string that fails the check is not sent to the pool.",
      "## What to check before you paste",
      "- Copy the ERG receive address from the official Ergo desktop wallet, Ergo Mobile Wallet, or an exchange the help page names for ERG. Those are the channels that page recommends for ERG, rather than a BTC deposit string.",
      "- Keep only a mainnet receive address that starts with 9. A string starting with 8 matches the docs’ P2SH example. A testnet P2PK example starting with 3 is not this page.",
      "- Do not rewrite another address so it starts with 9 just to pass the box. The rewritten string will not match.",
      "## If it is refused or the wrong account opens",
      "- The box refuses the string. Copy it from the wallet again. A 9 plus a short tail, or a character outside Base58 such as 0, O, I, or l, is not this P2PK.",
      "- The miner is paying BTC or TON. That is another payout coin. This monitor cannot read those destinations. Check the payout coin you actually chose on the pool account page. If mining already pays BTC or TON, do not change the miner user field so this page can open. Paste a string here only when the payout address is already an ERG address that starts with 9.",
      "- The account opens and the balance is the pool ledger, not every on-chain box. This page reads the public account for this payout address on erg.2miners.com. It does not list P2S coinbase boxes.",
      "## Illustrative shapes, not a real transfer",
      "The docs’ own mainnet shapes are enough to remember: P2PK like 9fRA…, P2SH like 8UAp…, P2S like 4MQy… or BxKB…. Paste only the 9fRA class after it checks out. Those fragments show the class. They are not your balance.",
      "Next, open the [ERG monitor](/projects/erg). How that string sits in the miner user field is in [which address to paste](/learn/erg-mining-monitor-guide). How to read the balance after a payout is in [rewards and payouts](/learn/erg-rewards-balances-payments).",
    ],
    ko: [
      "모니터가 원하는 것은 풀이 ERG를 보내는 주소입니다. 블록 안에서 프로토콜 보상을 잠그는 스크립트가 아닙니다. Ergo 주소 문서는 메인넷에서 9로 시작하는 주소가 P2PK이고, 채굴 보상은 다른 종류인 P2S로 간다고 적습니다. 같은 페이지는 9로 시작하는 주소가 메인넷에서 항상 P2PK라고 합니다. 2Miners ERG 도움말은 ERG 지갑을 만들어 지급을 받으라고 하고, 9로 시작하는 ERG 예시를 보여 주며, BTC나 TON도 허용합니다. 따라서 P2PK는 풀 지급 주소가 될 수 있습니다. 코인베이스가 P2S라고 해서 P2PK가 그 지급을 못 받는 것은 아닙니다.",
      "## 접두를 읽는 법",
      "접두로 주소를 구분하면 됩니다. 안의 바이트를 풀 필요는 없습니다. 메인넷 P2PK는 9로 시작합니다. 문서의 P2SH 예시는 8, 테스트넷 P2PK 예시는 3으로 시작합니다. P2S는 프로토콜 채굴 보상이 잠기는 종류이고 접두가 고정되지 않습니다. 검사에 떨어지는 문자열은 풀로 보내지 않습니다.",
      "## 붙이기 전에 확인할 것",
      "- Ergo 공식 데스크톱 지갑, Ergo Mobile Wallet, 또는 도움말이 ERG에 대해 적은 거래소에서 ERG 수신 주소를 복사하세요. 그 페이지가 ERG에 권하는 경로이며 BTC 입금 문자열이 아닙니다.",
      "- 9로 시작하는 메인넷 수신 주소만 남기세요. 8로 시작하면 문서의 P2SH 예시와 같고, 3으로 시작하는 테스트넷 P2PK 예시는 이 페이지가 아닙니다.",
      "- 입력칸을 통과하려고 다른 주소를 9로 고쳐 쓰지 마세요. 고친 문자열은 맞지 않습니다.",
      "## 거부되거나 다른 계정이 열릴 때",
      "- 칸이 거부하면 지갑에서 다시 복사하세요. 9 뒤에 길이가 절반이거나 0, O, I, l처럼 Base58 밖 문자가 있으면 이 P2PK가 아닙니다.",
      "- 채굴기가 BTC나 TON으로 지급한다면 다른 지급 코인입니다. 이 모니터는 그 수신 주소를 읽지 못합니다. 풀 계정 페이지에서 실제로 고른 지급 코인을 확인하세요. 채굴이 이미 BTC나 TON으로 지급된다면, 이 페이지를 열려고 사용자 칸을 바꾸지 마세요. 지급 주소가 원래 9로 시작하는 ERG일 때만 그 문자열을 붙입니다.",
      "- 계정은 열리지만 잔액은 풀 장부이며 체인의 모든 박스가 아닙니다. 이 페이지는 erg.2miners.com에서 이 지급 주소의 공개 계정을 읽습니다. P2S 코인베이스 박스는 나열하지 않습니다.",
      "## 종류를 보여주는 예시이며, 실제 송금이 아님",
      "문서의 메인넷 모양만 기억하면 됩니다. P2PK는 9fRA…, P2SH는 8UAp…, P2S는 4MQy… 또는 BxKB… 입니다. 검사가 통과한 9fRA 종류만 모니터에 붙이세요. 이 조각은 종류를 보여줄 뿐 잔액이 아닙니다.",
      "다음은 [ERG 모니터](/projects/erg)입니다. 그 문자열을 채굴기 사용자 칸에 넣는 방법은 [어떤 주소를 붙일지](/learn/erg-mining-monitor-guide), 지급 뒤 잔액을 나누어 읽는 방법은 [보상과 지급](/learn/erg-rewards-balances-payments)에 있습니다.",
    ],
    ja: [
      "モニターが求めるのは、プールが ERG を支払うアドレスです。ブロックの中でプロトコル報酬をロックするスクリプトではありません。Ergo のアドレス文書は、メインネットで 9 で始まるアドレスは P2PK であり、採掘報酬は別の種類である P2S へ入ると書いています。同じページは、9 で始まるアドレスはメインネットでは必ず P2PK だと述べます。2Miners の ERG ヘルプは ERG ウォレットを作って支払いを受け取るよう求め、9 で始まる ERG の例を示し、BTC や TON も許しています。だから P2PK はプールの支払先になれます。コインベースが P2S だからといって、P2PK がその支払いを受け取れないわけではありません。",
      "## 接頭の読み方",
      "接頭でアドレスを見分けます。中のバイトを分解する必要はありません。メインネットの P2PK は 9 で始まります。文書の P2SH 例は 8、テストネット P2PK の例は 3 で始まります。P2S はプロトコルの採掘報酬がロックされる種類で、接頭は固定ではありません。検査に落ちる文字列はプールへ送りません。",
      "## 貼る前に確かめること",
      "- Ergo 公式デスクトップウォレット、Ergo Mobile Wallet、またはヘルプが ERG について名を挙げた取引所から、ERG の受取アドレスをコピーしてください。そのページが ERG に勧めている経路であり、BTC の入金文字列ではありません。",
      "- 9 で始まるメインネットの受取アドレスだけを残してください。8 で始まるものは文書の P2SH の形に近く、3 で始まるテストネット P2PK の例はこのページではありません。",
      "- 入力欄を通すために別のアドレスを 9 始まりへ書き換えてはいけません。書き換えた文字列は合いません。",
      "## 拒否される、または別の口座が開くとき",
      "- 欄が拒否したらウォレットからコピーし直してください。9 のうしろが半分の長さだったり、0、O、I、l のように Base58 の外の文字が入っていたりすれば、この P2PK ではありません。",
      "- マイナーが BTC または TON で支払うなら、それは別の支払コインです。このモニターはその宛先を読めません。プールの口座ページで、実際に選んだ支払コインを確認してください。採掘がすでに BTC または TON で支払うなら、このページを開くためにユーザー欄を変えないでください。支払先がもともと 9 で始まる ERG のときだけ、その文字列を貼ります。",
      "- 口座は開いても残高はプール台帳であり、チェーン上のすべてのボックスではありません。このページは erg.2miners.com でこの支払先の公開口座を読みます。P2S のコインベースボックスは並べません。",
      "## 種別の例示であり、実際の送金ではない",
      "文書自身のメインネットの形だけ覚えれば足ります。P2PK は 9fRA…、P2SH は 8UAp…、P2S は 4MQy… または BxKB… です。検査を通った 9fRA の種類だけをモニターに貼ってください。これらの断片は種類を示すもので、残高ではありません。",
      "次は [ERG モニター](/projects/erg) です。その文字列をマイナーのユーザー欄に置く手順は[どのアドレスを貼るか](/learn/erg-mining-monitor-guide)、支払いのあと残高を分けて読む手順は[報酬と支払い](/learn/erg-rewards-balances-payments)にあります。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "协议挖矿奖励进 P2S，P2PK 还能收矿池的 ERG 吗？",
        "能。文档说的是协议把挖矿奖励锁进 P2S 脚本。2Miners 帮助页把 ERG 收款示例写成以 9 开头的地址，而文档说主网上的 9 一定是 P2PK。矿池付款地址和铸币脚本不是同一个东西。",
      ],
      [
        "協定挖礦獎勵進 P2S，P2PK 還能收礦池的 ERG 嗎？",
        "能。文件說的是協定把挖礦獎勵鎖進 P2S 腳本。2Miners 說明頁把 ERG 收款範例寫成以 9 開頭的地址，而文件說主網上的 9 一定是 P2PK。礦池付款地址和鑄幣腳本不是同一個東西。",
      ],
      [
        "If protocol rewards use P2S, can a P2PK still receive pool ERG?",
        "Yes. The docs say the protocol locks mining rewards in a P2S script. The 2Miners help page’s ERG payout example starts with 9, and the docs say a mainnet 9-address is always P2PK. The pool payout address and the coinbase script are not the same object.",
      ],
      [
        "프로토콜 보상이 P2S라면 P2PK도 풀 ERG를 받을 수 있나요?",
        "받을 수 있습니다. 문서는 프로토콜이 채굴 보상을 P2S 스크립트에 잠근다고 합니다. 2Miners 도움말의 ERG 지급 예시는 9로 시작하고, 문서는 메인넷의 9가 항상 P2PK라고 합니다. 풀 지급 주소와 코인베이스 스크립트는 같은 대상이 아닙니다.",
      ],
      [
        "プロトコル報酬が P2S なら、P2PK はプールの ERG を受け取れますか？",
        "受け取れます。文書が言うのは、プロトコルが採掘報酬を P2S スクリプトにロックすることです。2Miners ヘルプの ERG 支払例は 9 で始まり、文書はメインネットの 9 は必ず P2PK だと述べます。プール支払先とコインベーススクリプトは同じものではありません。",
      ],
    ),
    qa(
      [
        "测试网以 3 开头的 P2PK 能查主网矿池吗？",
        "不能。文档给了以 3 开头的测试网 P2PK 示例。本页只查主网、以 9 开头且检查通过的付款地址。",
      ],
      [
        "測試網以 3 開頭的 P2PK 能查主網礦池嗎？",
        "不能。文件給了以 3 開頭的測試網 P2PK 範例。本頁只查主網、以 9 開頭且檢查通過的付款地址。",
      ],
      [
        "Can a testnet P2PK starting with 3 open the mainnet pool?",
        "No. The docs show a testnet P2PK example starting with 3. This page looks up only a mainnet payout address that starts with 9 and checks out.",
      ],
      [
        "3으로 시작하는 테스트넷 P2PK로 메인넷 풀을 조회할 수 있나요?",
        "아니요. 문서는 3으로 시작하는 테스트넷 P2PK 예시를 보여 줍니다. 이 페이지는 9로 시작하고 검사를 통과한 메인넷 지급 주소만 조회합니다.",
      ],
      [
        "3 で始まるテストネット P2PK でメインネットのプールを引けますか？",
        "いいえ。文書は 3 で始まるテストネット P2PK の例を示しています。このページが引くのは、9 で始まり検査を通ったメインネットの支払先だけです。",
      ],
    ),
    qa(
      [
        "P2SH 比 P2S 更常见，监控会支持以 8 开头的地址吗？",
        "不会。文档讨论了 P2SH 与 P2S 的用法差别，并给了以 8 开头的主网 P2SH 示例。本页的矿池收款范围停在主网 P2PK。打开 [ERG 监控](/projects/erg) 时请贴 9 地址。",
      ],
      [
        "P2SH 比 P2S 更常見，監控會支援以 8 開頭的地址嗎？",
        "不會。文件討論了 P2SH 與 P2S 的用法差別，並給了以 8 開頭的主網 P2SH 範例。本頁的礦池收款範圍停在主網 P2PK。打開 [ERG 監控](/projects/erg) 時請貼 9 地址。",
      ],
      [
        "P2SH is discussed as easier or cheaper in the docs. Will an 8-address work?",
        "No. The docs discuss how P2SH differs from P2S and show a mainnet P2SH example starting with 8. This page’s pool-payout scope stops at mainnet P2PK. Paste a 9-address on the [ERG monitor](/projects/erg).",
      ],
      [
        "문서가 P2SH를 다루는데 8 주소도 되나요?",
        "되지 않습니다. 문서는 P2SH와 P2S의 차이를 다루고 8로 시작하는 메인넷 P2SH 예시를 보여 줍니다. 이 페이지의 풀 지급 범위는 메인넷 P2PK에서 멈춥니다. [ERG 모니터](/projects/erg)에는 9 주소를 붙이세요.",
      ],
      [
        "文書は P2SH も扱っています。8 のアドレスは使えますか？",
        "使えません。文書は P2SH と P2S の違いを扱い、8 で始まるメインネット P2SH の例を示しています。このページのプール支払の範囲はメインネット P2PK までです。[ERG モニター](/projects/erg) には 9 アドレスを貼ってください。",
      ],
    ),
  ]),
};

const hashrate: Article = {
  slug: "erg-autolykos-worker-hashrate",
  published: "2026-10-24",
  modified: "2026-10-24",
  project: "erg",
  sources: [
    { name: "2Miners · ERG help", url: "https://erg.2miners.com/help" },
    { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
  ],
  related: ["erg-mining-monitor-guide", "erg-miner-no-shares", "erg-rewards-balances-payments"],
  topic: L(
    "Autolykos 与矿工算力",
    "Autolykos 與礦工算力",
    "Autolykos and worker hashrate",
    "Autolykos와 워커 해시레이트",
    "Autolykos とワーカーのハッシュレート",
  ),
  title: L(
    "ERG 矿工的 Autolykos 算力在监控里怎么读，为什么不能分成收入？",
    "ERG 礦工的 Autolykos 算力在監控裡怎麼讀，為什麼不能分成收入？",
    "How to read Autolykos worker hashrate on the ERG monitor, without splitting it into income",
    "ERG 모니터에서 Autolykos 워커 해시레이트를 어떻게 읽고, 왜 수입으로 나누면 안 되나요?",
    "ERG モニターで Autolykos のワーカーハッシュレートをどう読み、なぜ収入に分けないのか",
  ),
  description: L(
    "矿机算法用 Autolykos。监控显示矿池返回的账户当前算力和每名矿工的算力。这些数不是按矿工拆开的 ERG 收入。短窗口曲线不在本页。",
    "礦機演算法用 Autolykos。監控顯示礦池回傳的帳戶目前算力和每名礦工的算力。這些數不是按礦工拆開的 ERG 收入。短窗口曲線不在本頁。",
    "The miner algorithm is Autolykos. The monitor shows the pool’s current account hashrate and each worker’s hashrate. Those figures are not ERG income split per worker. Short-window charts are not on this page.",
    "채굴기 알고리즘은 Autolykos입니다. 모니터는 풀이 준 계정의 현재 해시레이트와 워커별 해시레이트를 보여 줍니다. 그 숫자는 워커별로 나눈 ERG 수입이 아닙니다. 짧은 구간 차트는 이 페이지에 없습니다.",
    "マイナーのアルゴリズムは Autolykos です。モニターはプールが返した口座の現在ハッシュレートと、各ワーカーのハッシュレートを出します。その数はワーカーごとに分けた ERG 収入ではありません。短い窓の曲線はこのページにありません。",
  ),
  summary: L(
    "在矿机里把算法设成 Autolykos，用同一个 9 地址到 [ERG 监控](/projects/erg) 看账户算力和矿工算力。不要把算力行加成每台机器的 ERG。",
    "在礦機裡把演算法設成 Autolykos，用同一個 9 地址到 [ERG 監控](/projects/erg) 看帳戶算力和礦工算力。不要把算力列加成每台機器的 ERG。",
    "Set the miner to Autolykos, then open the same 9-address on the [ERG monitor](/projects/erg) for account and worker hashrate. Do not add those rows up into ERG per machine.",
    "채굴기 알고리즘을 Autolykos로 두고, 같은 9 주소를 [ERG 모니터](/projects/erg)에서 열어 계정과 워커 해시레이트를 보세요. 그 행을 기기별 ERG로 더하지 마세요.",
    "マイナーのアルゴリズムを Autolykos にし、同じ 9 アドレスを [ERG モニター](/projects/erg) で開いて口座とワーカーのハッシュレートを見てください。その行を機械ごとの ERG に足し上げないでください。",
  ),
  comparisonTitle: L(
    "算力该看哪一列",
    "算力該看哪一欄",
    "Which hashrate column to read",
    "어떤 해시레이트 칸을 보나",
    "どのハッシュレート欄を読むか",
  ),
  comparison: {
    zh: {
      headers: ["你想知道的", "本页显示", "不在本页"],
      rows: [
        ["这串付款地址此刻的算力", "矿池给出的账户当前算力", "不把各矿工算力加总后替换这个数"],
        ["某一台矿机", "该矿工自己的算力、在线与否、最后出现时间", "不给这台矿机单独的 ERG 收入"],
        [
          "最近 5 分钟、30 分钟或 6 小时份额",
          "不画这些曲线",
          "API 另有份额与矿工区间接口，请看矿池账户页",
        ],
        ["份额难度", "不改写帮助页上的难度档", "帮助页写明份额难度不影响矿工收益"],
      ],
    },
    "zh-TW": {
      headers: ["你想知道的", "本頁顯示", "不在本頁"],
      rows: [
        ["這串付款地址此刻的算力", "礦池給出的帳戶目前算力", "不把各礦工算力加總後替換這個數"],
        ["某一台礦機", "該礦工自己的算力、在線與否、最後出現時間", "不給這台礦機單獨的 ERG 收入"],
        [
          "最近 5 分鐘、30 分鐘或 6 小時份額",
          "不畫這些曲線",
          "API 另有份額與礦工區間介面，請看礦池帳戶頁",
        ],
        ["份額難度", "不改寫說明頁上的難度檔", "說明頁寫明份額難度不影響礦工收益"],
      ],
    },
    en: {
      headers: ["What you want", "Shown here", "Not on this page"],
      rows: [
        [
          "Hashrate of this payout address right now",
          "The pool’s current account hashrate",
          "Worker rates are not summed and substituted for that figure",
        ],
        [
          "One rig",
          "That worker’s hashrate, online or offline, and last seen",
          "No separate ERG income for that rig",
        ],
        [
          "Shares over 5 minutes, 30 minutes, or 6 hours",
          "Those charts are not drawn",
          "The API lists separate share and worker-range calls; use the pool account page",
        ],
        [
          "Share difficulty",
          "This page does not rewrite the help page’s difficulty tier",
          "The help page says share difficulty does not change miner rewards",
        ],
      ],
    },
    ko: {
      headers: ["알고 싶은 것", "이 페이지", "이 페이지에 없음"],
      rows: [
        [
          "이 지급 주소의 지금 해시레이트",
          "풀이 준 계정의 현재 해시레이트",
          "워커 값을 더해 그 숫자를 바꾸지 않음",
        ],
        [
          "리그 한 대",
          "그 워커의 해시레이트, 온라인 여부, 마지막 시각",
          "그 리그만의 ERG 수입은 없음",
        ],
        [
          "최근 5분, 30분, 6시간 점유",
          "그 곡선을 그리지 않음",
          "API에 별도 점유·워커 구간이 있음. 풀 계정 페이지를 보세요",
        ],
        [
          "점유 난이도",
          "도움말의 난이도 단계를 다시 쓰지 않음",
          "도움말은 점유 난이도가 보상에 영향을 주지 않는다고 함",
        ],
      ],
    },
    ja: {
      headers: ["知りたいこと", "このページ", "このページにないもの"],
      rows: [
        [
          "この支払先の今のハッシュレート",
          "プールが渡した口座の現在値",
          "ワーカー値を合計してその数字を置き換えない",
        ],
        [
          "リグ一台",
          "そのワーカーのハッシュレート、オンラインか、最終出現",
          "そのリグだけの ERG 収入はない",
        ],
        [
          "直近 5 分、30 分、6 時間のシェア",
          "その曲線は描かない",
          "API に別のシェアとワーカー区間がある。プールの口座ページを見る",
        ],
        [
          "シェア難度",
          "ヘルプの難度段を書き替えない",
          "ヘルプはシェア難度が報酬を変えないと書いている",
        ],
      ],
    },
  },
  body: {
    zh: [
      "挖 ERG 时，2Miners 帮助页要求算法选择 Autolykos。各矿工程序的参数名不一样：lolMiner 写成 AUTOLYKOS2，Rigel、Gminer、T-Rex、TeamRedMiner 和 SRBMiner 写成 autolykos2，NBminer 写成 ergo。名字不同，指的是同一套算法。监控不根据这些参数名估算算力，只显示矿池账户接口返回的当前账户算力，以及每个矿工自己的算力。",
      "## 两列算力分别是什么",
      "账户上的数是这一个付款地址的当前算力。矿工行上的数只属于那个 RIG_ID。本页不会把矿工算力相加，再假装那就是账户算力，也不会按算力比例把 ERG 分给每台机器。收入仍是地址级的未支付、已付和滚动 24 小时收益。API 索引还列出 5 分钟、30 分钟、6 小时的账户份额，以及按同样区间取某一矿工算力的接口。那些曲线不画在本页。",
      "## 对矿机时看什么",
      "- 算法行必须是上面的 Autolykos 写法之一。把别的币的算法留在配置里，矿池不会按 ERG 账户给这台机器记账。",
      "- 若这笔挖矿的付款地址就是 ERG，用户字段是以 9 开头的地址，矿机名在点号后，或按该软件的 worker 参数填写。若你故意付给 BTC 或 TON，不要为了让本页有算力而改掉那笔付款；本监控读不了那些收款地址。帮助页规定 RIG_ID 最长 32 个字符，字符集是英文字母、数字、减号和下划线。",
      "- 主机以你的配置为准。帮助页的快速开始示例是 erg.2miners.com 端口 8888，SSL 示例端口是 18888，并按区域另有主机。份额难度在帮助页上单列，并写明不影响矿工收益；显卡很多或走 NiceHash 时，帮助页建议用更高难度档。",
      "## 数字对不上时的分支",
      "- 账户算力有数，某台矿工没有：到矿池账户页核对名字是否就是 RIG_ID。名字不对就改配置，不要在监控里另造一条收入。",
      "- 矿工算力有数，你想看 5 分钟份额是否在涨：打开矿池自己的账户页。本页没有那条短窗口。",
      "- 两台矿工算力看起来一高一低：那只说明矿池给它们报了不同的算力。低的那台不会因此分到 0 ERG，高的那台也不会独占地址余额。",
      "## 示意，不是实测矿场",
      "假设账户当前算力显示为 100 MH/s，矿工 rig-a 为 60 MH/s，rig-b 为 40 MH/s。这只是示意：三行可以同时出现，而且 60 MH/s 加 40 MH/s 不必被本页拿去覆盖账户上的 100 MH/s。不要把 60 MH/s 当成 0.6 ERG。矿池和本页都会把 H/s 标成 MH/s 这类前缀，示例里的数字不是你的矿场。",
      "查看矿工不会自动占用设备名额。免费档每项目 3 台已保存设备，Pro 100 台；只有你把矿工存成单独的设备记录时才计入。打开 [ERG 监控](/projects/erg)。地址形态见[监控该填哪种地址](/learn/erg-mining-monitor-guide)。矿工整行消失见[没有份额](/learn/erg-miner-no-shares)。",
    ],
    "zh-TW": [
      "挖 ERG 時，2Miners 說明頁要求演算法選擇 Autolykos。各礦工程式的參數名不一樣：lolMiner 寫成 AUTOLYKOS2，Rigel、Gminer、T-Rex、TeamRedMiner 和 SRBMiner 寫成 autolykos2，NBminer 寫成 ergo。名稱不同，指的是同一套演算法。監控不根據這些參數名估算算力，只顯示礦池帳戶介面回傳的目前帳戶算力，以及每個礦工自己的算力。",
      "## 兩欄算力分別是什麼",
      "帳戶上的數是這一個付款地址的目前算力。礦工列上的數只屬於那個 RIG_ID。本頁不會把礦工算力相加，再假裝那就是帳戶算力，也不會按算力比例把 ERG 分給每台機器。收入仍是地址級的未支付、已付和滾動 24 小時收益。API 索引還列出 5 分鐘、30 分鐘、6 小時的帳戶份額，以及按同樣區間取某一礦工算力的介面。那些曲線不畫在本頁。",
      "## 對礦機時看什麼",
      "- 演算法行必須是上面的 Autolykos 寫法之一。把別的幣的演算法留在設定裡，礦池不會按 ERG 帳戶給這台機器記帳。",
      "- 若這筆挖礦的付款地址就是 ERG，使用者欄位是以 9 開頭的地址，礦機名稱在點號後，或按該軟體的 worker 參數填寫。若你故意付給 BTC 或 TON，不要為了讓本頁有算力而改掉那筆付款；本監控讀不了那些收款地址。說明頁規定 RIG_ID 最長 32 個字元，字元集是英文字母、數字、減號和底線。",
      "- 主機以你的設定為準。說明頁的快速開始範例是 erg.2miners.com 埠 8888，SSL 範例埠是 18888，並依區域另有主機。份額難度在說明頁上單列，並寫明不影響礦工收益；顯卡很多或走 NiceHash 時，說明頁建議用更高難度檔。",
      "## 數字對不上時的分支",
      "- 帳戶算力有數，某台礦工沒有：到礦池帳戶頁核對名稱是否就是 RIG_ID。名稱不對就改設定，不要在監控裡另造一條收入。",
      "- 礦工算力有數，你想看 5 分鐘份額是否在漲：打開礦池自己的帳戶頁。本頁沒有那條短窗口。",
      "- 兩台礦工算力看起來一高一低：那只說明礦池給它們報了不同的算力。低的那台不會因此分到 0 ERG，高的那台也不會獨占地址餘額。",
      "## 示意，不是實測礦場",
      "假設帳戶目前算力顯示為 100 MH/s，礦工 rig-a 為 60 MH/s，rig-b 為 40 MH/s。這只是示意：三列可以同時出現，而且 60 MH/s 加 40 MH/s 不必被本頁拿去覆蓋帳戶上的 100 MH/s。不要把 60 MH/s 當成 0.6 ERG。礦池和本頁都會把 H/s 標成 MH/s 這類前綴，示例裡的數字不是你的礦場。",
      "查看礦工不會自動占用裝置名額。免費方案每項目 3 台已儲存裝置，Pro 100 台；只有你把礦工存成單獨的裝置紀錄時才計入。打開 [ERG 監控](/projects/erg)。地址形態見[監控該填哪種地址](/learn/erg-mining-monitor-guide)。礦工整列消失見[沒有份額](/learn/erg-miner-no-shares)。",
    ],
    en: [
      "When you mine ERG, the 2Miners help page tells you to select Autolykos. Miner flags use different spellings for that same algorithm: lolMiner uses AUTOLYKOS2, Rigel, Gminer, T-Rex, TeamRedMiner, and SRBMiner use autolykos2, and NBminer uses ergo. The monitor does not estimate hashrate from those flag names. It shows the current account hashrate returned for the pool account, and each worker’s own hashrate.",
      "## What the two figures are",
      "The account number is the current hashrate of this one payout address. A worker row belongs only to that RIG_ID. This page does not add worker rates and present the sum as the account hashrate, and it does not split ERG across machines in proportion to hashrate. Income stays at address level: unpaid, paid, and the rolling 24-hour reward. The API index also lists account shares for 5 minutes, 30 minutes, and 6 hours, plus a worker-hashrate call for the same ranges. Those charts are not drawn here.",
      "## What to inspect on the miner",
      "- The algorithm line has to be one of the Autolykos spellings above. Leaving another coin’s algorithm in the config means the pool will not account that rig on the ERG address.",
      "- When this rig’s payout address is already ERG, the user field is the 9-address. The rig name follows the dot, or the worker flag that software uses. If you intentionally pay BTC or TON, do not change that payout so this page can show a rate. This monitor cannot read those destinations. The help page limits RIG_ID to 32 characters: English letters, digits, hyphen, and underscore.",
      "- Trust the host in your config. The help page’s quick start uses erg.2miners.com port 8888, its SSL example uses 18888, and it lists other regional hosts. Share difficulty is a separate line on that page, and the page says it does not change miner rewards. It recommends the higher tier for a very large GPU count or for NiceHash.",
      "## When the numbers disagree",
      "- The account has a rate and one worker does not. Check the pool account page for the name that matches RIG_ID. Fix the config if the name is wrong. Do not invent an income row in the monitor.",
      "- A worker has a rate and you want to see whether 5-minute shares are rising. Open the pool’s own account page. This monitor has no short window.",
      "- Two workers show a high rate and a low rate. That only means the pool reported different rates. The lower rig is not assigned 0 ERG, and the higher rig does not take the address balance for itself.",
      "## Illustrative, not a measured farm",
      "Suppose the account current hashrate reads 100 MH/s, rig-a reads 60 MH/s, and rig-b reads 40 MH/s. The sketch only shows that three rows can appear together, and that 60 MH/s plus 40 MH/s is not used here to overwrite the account’s 100 MH/s. Do not treat 60 MH/s as 0.6 ERG. The pool and this page format H/s with prefixes such as MH/s. The numbers are illustrative, not your farm.",
      "Viewing workers does not by itself use a device slot. Free is three saved devices per project and Pro is 100. A slot is used when you save a separate device record for a worker. Open the [ERG monitor](/projects/erg). The address shape is in [which address to paste](/learn/erg-mining-monitor-guide). A missing worker row is in [no shares](/learn/erg-miner-no-shares).",
    ],
    ko: [
      "ERG를 캘 때 2Miners 도움말은 알고리즘을 Autolykos로 고르라고 합니다. 채굴기 플래그 표기는 달라도 같은 알고리즘입니다. lolMiner는 AUTOLYKOS2, Rigel, Gminer, T-Rex, TeamRedMiner, SRBMiner는 autolykos2, NBminer는 ergo입니다. 모니터는 그 플래그 이름으로 해시레이트를 추정하지 않습니다. 풀 계정이 돌려준 현재 계정 해시레이트와 각 워커의 해시레이트만 보여 줍니다.",
      "## 두 숫자가 각각 무엇인가",
      "계정 숫자는 이 지급 주소 하나의 현재 해시레이트입니다. 워커 행은 그 RIG_ID만의 것입니다. 이 페이지는 워커 값을 더해 계정 해시레이트인 것처럼 보이지 않고, 해시레이트 비율로 ERG를 기계마다 나누지도 않습니다. 수입은 주소 단위의 미지급, 지급 완료, 롤링 24시간 보상으로 남습니다. API 색인에는 5분, 30분, 6시간 계정 점유와, 같은 구간의 워커 해시레이트 호출도 있습니다. 그 차트는 여기서 그리지 않습니다.",
      "## 채굴기에서 볼 것",
      "- 알고리즘 줄은 위의 Autolykos 표기 중 하나여야 합니다. 다른 코인 알고리즘이 남아 있으면 풀은 그 리그를 이 ERG 주소에 기장하지 않습니다.",
      "- 이 채굴의 지급 주소가 이미 ERG이면 사용자 칸은 9 주소입니다. 리그 이름은 점 뒤이거나 그 소프트웨어의 워커 플래그입니다. BTC나 TON으로 일부러 지급한다면, 이 페이지에 해시레이트를 보이게 하려고 그 지급을 바꾸지 마세요. 이 모니터는 그 주소를 읽지 못합니다. 도움말은 RIG_ID를 32자, 영문·숫자·하이픈·밑줄로 제한합니다.",
      "- 호스트는 설정을 기준으로 하세요. 도움말의 빠른 시작은 erg.2miners.com 포트 8888, SSL 예시는 18888이며 지역별 호스트도 있습니다. 점유 난이도는 그 페이지의 별도 줄이고, 페이지는 난이도가 보상을 바꾸지 않는다고 합니다. GPU가 아주 많거나 NiceHash이면 더 높은 단계를 권합니다.",
      "## 숫자가 어긋날 때",
      "- 계정에는 값이 있고 워커 하나에는 없습니다. 풀 계정 페이지에서 RIG_ID와 같은 이름을 확인하세요. 이름이 다르면 설정을 고치고, 모니터에 수입 행을 만들지 마세요.",
      "- 워커 값은 있는데 5분 점유가 오르는지 보고 싶다면 풀 자신의 계정 페이지를 여세요. 이 모니터에는 짧은 창이 없습니다.",
      "- 워커 둘의 값이 높고 낮다면, 풀이 서로 다른 값을 보고했다는 뜻입니다. 낮은 리그에 0 ERG가 배정되거나 높은 리그가 주소 잔액을 가져가는 것이 아닙니다.",
      "## 예시이며, 측정한 농장이 아님",
      "계정 현재 해시레이트가 100 MH/s, rig-a가 60 MH/s, rig-b가 40 MH/s라고 해 보세요. 이 스케치는 세 행이 함께 나올 수 있고, 60 MH/s 더하기 40 MH/s로 계정의 100 MH/s를 덮어쓰지 않는다는 뜻입니다. 60 MH/s를 0.6 ERG로 보지 마세요. 풀과 이 페이지는 H/s를 MH/s 같은 접두로 적습니다. 숫자는 예시이며 당신의 농장이 아닙니다.",
      "워커를 보기만 해서 기기 슬롯이 쓰이지는 않습니다. 무료는 프로젝트당 저장 기기 3대, Pro는 100대입니다. 워커를 별도 저장 기기로 만들 때 슬롯이 쓰입니다. [ERG 모니터](/projects/erg)를 여세요. 주소 형태는 [어떤 주소를 붙일지](/learn/erg-mining-monitor-guide), 워커 행이 사라지면 [점유 없음](/learn/erg-miner-no-shares)을 보세요.",
    ],
    ja: [
      "ERG を掘るとき、2Miners のヘルプはアルゴリズムを Autolykos にするよう求めています。マイナーのフラグ表記は違っても同じアルゴリズムです。lolMiner は AUTOLYKOS2、Rigel、Gminer、T-Rex、TeamRedMiner、SRBMiner は autolykos2、NBminer は ergo です。モニターはそのフラグ名からハッシュレートを推定しません。プール口座が返した現在の口座ハッシュレートと、各ワーカー自身のハッシュレートを出します。",
      "## 二つの数がそれぞれ何か",
      "口座の数は、この一つの支払先の現在ハッシュレートです。ワーカー行はその RIG_ID だけのものです。このページはワーカー値を足して口座ハッシュレートのふりをせず、ハッシュレートの比で ERG を機械ごとに分けもしません。収入はアドレス単位の未払い、支払済み、直近 24 時間の報酬のままです。API 索引には 5 分、30 分、6 時間の口座シェアと、同じ区間のワーカーハッシュレート呼び出しもあります。その曲線はここでは描きません。",
      "## マイナーで見るところ",
      "- アルゴリズム行は上の Autolykos 表記のいずれかです。別コインのアルゴリズムが残っていると、プールはそのリグをこの ERG アドレスに記帳しません。",
      "- この採掘の支払先がすでに ERG なら、ユーザー欄は 9 アドレスです。リグ名はドットのあと、またはそのソフトのワーカーフラグです。意図して BTC または TON で支払うなら、このページに算力を出すためにその支払いを変えないでください。このモニターはその宛先を読めません。ヘルプは RIG_ID を 32 文字、英字・数字・ハイフン・アンダースコアに限っています。",
      "- ホストは設定ファイルを基準にしてください。ヘルプのクイックスタートは erg.2miners.com のポート 8888、SSL の例は 18888 で、リージョン別のホストもあります。シェア難度はそのページの別行で、ページは難度が報酬を変えないと書いています。GPU が非常に多いときや NiceHash では、より高い段を勧めています。",
      "## 数が食い違うとき",
      "- 口座には値があり、あるワーカーには無い。プールの口座ページで RIG_ID と同じ名前かを確認してください。名前が違うなら設定を直し、モニターに収入の行を作らないでください。",
      "- ワーカーに値があり、5 分シェアが伸びているか見たい。プール自身の口座ページを開いてください。このモニターに短い窓はありません。",
      "- 二台のワーカーが高く低く出る。それはプールが別々の値を報告したというだけです。低いリグに 0 ERG が割り当てられたり、高いリグがアドレス残高を独占したりはしません。",
      "## 例示であり、測定したファームではない",
      "口座の現在ハッシュレートが 100 MH/s、rig-a が 60 MH/s、rig-b が 40 MH/s だとします。この図は三行が同時に出ることと、60 MH/s 足す 40 MH/s で口座の 100 MH/s を上書きしないことだけを示します。60 MH/s を 0.6 ERG にしないでください。プールもこのページも H/s を MH/s のような接頭で表します。数字は例示であり、あなたのファームではありません。",
      "ワーカーを表示するだけではデバイス枠を使いません。無料はプロジェクトあたり保存済みデバイス 3 台、Pro は 100 台です。ワーカーを別の保存デバイスとして作ったときに枠を使います。[ERG モニター](/projects/erg)を開いてください。アドレスの形は[どのアドレスを貼るか](/learn/erg-mining-monitor-guide)、ワーカー行が消えたときは[シェアが無い](/learn/erg-miner-no-shares)を見てください。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "矿工程序写成 AUTOLYKOS2、autolykos2 或 ergo，算不算 Autolykos？",
        "算。2Miners 帮助页要求算法为 Autolykos，并按软件给出这几种写法。监控不靠参数名猜测算力，只显示矿池返回的当前账户算力和矿工算力。",
      ],
      [
        "礦工程式寫成 AUTOLYKOS2、autolykos2 或 ergo，算不算 Autolykos？",
        "算。2Miners 說明頁要求演算法為 Autolykos，並按軟體給出這幾種寫法。監控不靠參數名猜測算力，只顯示礦池回傳的目前帳戶算力和礦工算力。",
      ],
      [
        "Do AUTOLYKOS2, autolykos2, and ergo all mean Autolykos?",
        "Yes. The 2Miners help page asks for Autolykos and shows those spellings per miner. The monitor does not guess hashrate from the flag. It shows the pool’s current account hashrate and each worker hashrate.",
      ],
      [
        "AUTOLYKOS2, autolykos2, ergo는 모두 Autolykos인가요?",
        "그렇습니다. 2Miners 도움말은 Autolykos를 요구하고 소프트웨어별 표기를 보여 줍니다. 모니터는 플래그로 해시레이트를 추정하지 않고, 풀의 현재 계정 해시레이트와 워커 해시레이트를 보여 줍니다.",
      ],
      [
        "AUTOLYKOS2、autolykos2、ergo はどれも Autolykos ですか？",
        "はい。2Miners のヘルプは Autolykos を求め、ソフトごとの表記を示しています。モニターはフラグからハッシュレートを推測せず、プールの現在の口座値と各ワーカー値を出します。",
      ],
    ),
    qa(
      [
        "算力高的矿工是不是分到更多 ERG？",
        "本页不会这样分。算力行只报告矿池给的算力。未支付余额、已付和 24 小时收益都属于付款地址，不按矿工复制。",
      ],
      [
        "算力高的礦工是不是分到更多 ERG？",
        "本頁不會這樣分。算力列只報告礦池給的算力。未支付餘額、已付和 24 小時收益都屬於付款地址，不按礦工複製。",
      ],
      [
        "Does the faster worker receive more ERG on this page?",
        "This page does not split it that way. A hashrate row only reports the pool’s rate. Unpaid balance, paid, and the 24-hour reward belong to the payout address and are not copied per worker.",
      ],
      [
        "해시레이트가 높은 워커가 ERG를 더 받나요?",
        "이 페이지는 그렇게 나누지 않습니다. 해시레이트 행은 풀이 준 값만 보고합니다. 미지급, 지급 완료, 24시간 보상은 지급 주소의 것이며 워커마다 복사되지 않습니다.",
      ],
      [
        "ハッシュレートが高いワーカーは ERG をより多く受け取りますか？",
        "このページはそのように分けません。ハッシュレート行はプールの値を報告するだけです。未払い、支払済み、24 時間報酬は支払先のもので、ワーカーごとに複製しません。",
      ],
    ),
    qa(
      [
        "5 分钟份额曲线在哪里？",
        "不在本页。API 索引把 5 分钟、30 分钟、6 小时列成单独接口。短窗口请看矿池账户页，再回到 [ERG 监控](/projects/erg) 看当前算力和地址级收益。",
      ],
      [
        "5 分鐘份額曲線在哪裡？",
        "不在本頁。API 索引把 5 分鐘、30 分鐘、6 小時列成單獨介面。短窗口請看礦池帳戶頁，再回到 [ERG 監控](/projects/erg) 看目前算力和地址級收益。",
      ],
      [
        "Where is the 5-minute share chart?",
        "Not on this page. The API index lists 5-minute, 30-minute, and 6-hour ranges as separate calls. Use the pool account page for the short window, then return to the [ERG monitor](/projects/erg) for current hashrate and address-level rewards.",
      ],
      [
        "5분 점유 곡선은 어디에 있나요?",
        "이 페이지에는 없습니다. API 색인은 5분, 30분, 6시간을 별도 호출로 둡니다. 짧은 창은 풀 계정 페이지에서 보고, 현재 해시레이트와 주소 단위 보상은 [ERG 모니터](/projects/erg)로 돌아오세요.",
      ],
      [
        "5 分のシェア曲線はどこですか？",
        "このページにはありません。API 索引は 5 分、30 分、6 時間を別呼び出しにしています。短い窓はプールの口座ページで見て、現在のハッシュレートとアドレス単位の報酬は [ERG モニター](/projects/erg) に戻ってください。",
      ],
    ),
  ]),
};

const rewards: Article = {
  slug: "erg-rewards-balances-payments",
  published: "2026-10-24",
  modified: "2026-10-24",
  project: "erg",
  sources: [
    { name: "2Miners · ERG help", url: "https://erg.2miners.com/help" },
    { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    {
      name: "Ergo Docs · Address types",
      url: "https://docs.ergoplatform.com/dev/wallet/address/address_types/",
    },
  ],
  related: [
    "erg-mining-monitor-guide",
    "erg-autolykos-worker-hashrate",
    "erg-p2pk-address-monitoring",
  ],
  topic: L(
    "余额、已付与 24 小时收益",
    "餘額、已付與 24 小時收益",
    "Balance, paid, and 24-hour reward",
    "잔액, 지급 완료, 24시간 보상",
    "残高、支払済み、24 時間報酬",
  ),
  title: L(
    "ERG 监控上的余额、已付和 24 小时收益分别是什么？",
    "ERG 監控上的餘額、已付和 24 小時收益分別是什麼？",
    "What do balance, paid, and the 24-hour reward mean on the ERG monitor?",
    "ERG 모니터의 잔액, 지급 완료, 24시간 보상은 각각 무엇인가요?",
    "ERG モニターの残高、支払済み、24 時間報酬はそれぞれ何ですか？",
  ),
  description: L(
    "三个数都属于同一个 9 开头的付款地址。矿池以 10 亿为 1 ERG 记账。缺了的数保持未知，不会写成 0，也不会按矿工复制。",
    "三個數都屬於同一個 9 開頭的付款地址。礦池以 10 億為 1 ERG 記帳。缺了的數保持未知，不會寫成 0，也不會按礦工複製。",
    "All three figures belong to the same 9-prefix payout address. The pool accounts 1 ERG as one billion base units. A missing figure stays unknown, is not shown as 0, and is not copied per worker.",
    "세 숫자는 모두 같은 9 지급 주소의 것입니다. 풀은 1 ERG를 10억 기본 단위로 적습니다. 빠진 값은 알 수 없음으로 두고 0으로 쓰지 않으며 워커마다 복사하지 않습니다.",
    "三つの数はどれも同じ 9 始まりの支払先のものです。プールは 1 ERG を 10 億基本単位で記帳します。欠けた数は不明のままで、0 とは書かず、ワーカーごとに複製しません。",
  ),
  summary: L(
    "在 [ERG 监控](/projects/erg) 上分开读未支付余额、累计已付和滚动 24 小时收益。未支付是还挂在矿池账上的，累计已付是已经付出的。不要再把滚动 24 小时叠到这两列上。它们也不是每台矿工的工资。",
    "在 [ERG 監控](/projects/erg) 上分開讀未支付餘額、累計已付和滾動 24 小時收益。未支付是還掛在礦池帳上的，累計已付是已經付出的。不要再把滾動 24 小時疊到這兩欄上。它們也不是每台礦工的工資。",
    "On the [ERG monitor](/projects/erg), read unpaid balance, total paid, and the rolling 24-hour reward separately. Unpaid is still on the pool ledger. Total paid has already been sent. Do not stack the rolling 24 hours on top of both. They are not wages per worker.",
    "[ERG 모니터](/projects/erg)에서 미지급 잔액, 누적 지급, 롤링 24시간 보상을 나누어 읽으세요. 미지급은 아직 풀 장부에 있는 액이고, 누적 지급은 이미 보낸 액입니다. 롤링 24시간을 두 열 위에 겹치지 마세요. 워커별 임금도 아닙니다.",
    "[ERG モニター](/projects/erg) で未払い残高、累計支払、直近 24 時間の報酬を分けて読んでください。未払いはまだプール台帳にある額、累計支払はすでに送った額です。直近 24 時間をその二列の上に重ねないでください。ワーカーごとの賃金でもありません。",
  ),
  comparisonTitle: L(
    "三列分开读",
    "三欄分開讀",
    "Read the three columns separately",
    "세 열을 따로 읽기",
    "三つの列を分けて読む",
  ),
  comparison: {
    zh: {
      headers: ["字段", "含义", "不要把它当成"],
      rows: [
        ["未支付余额", "矿池还记在这个付款地址上的 ERG", "每台矿工各一份，或链上全部盒子"],
        ["累计已付", "矿池已经付出的累计", "下一次付款的时间表"],
        ["24 小时收益", "滚动 24 小时，不是日历日的 0 点到 24 点", "用算力比例拆给矿工的收入"],
        ["缺失", "保持未知", "0 ERG"],
      ],
    },
    "zh-TW": {
      headers: ["欄位", "含義", "不要把它當成"],
      rows: [
        ["未支付餘額", "礦池還記在這個付款地址上的 ERG", "每台礦工各一份，或鏈上全部盒子"],
        ["累計已付", "礦池已經付出的累計", "下一次付款的時間表"],
        ["24 小時收益", "滾動 24 小時，不是日曆日的 0 點到 24 點", "用算力比例拆給礦工的收入"],
        ["缺失", "保持未知", "0 ERG"],
      ],
    },
    en: {
      headers: ["Field", "Meaning", "Do not treat it as"],
      rows: [
        [
          "Unpaid balance",
          "ERG the pool still records on this payout address",
          "One copy per worker, or every on-chain box",
        ],
        ["Total paid", "What the pool has already paid out", "A schedule for the next payout"],
        [
          "24-hour reward",
          "A rolling 24 hours, not midnight to midnight",
          "Income split by hashrate share",
        ],
        ["Missing", "Stays unknown", "0 ERG"],
      ],
    },
    ko: {
      headers: ["항목", "의미", "이렇게 보지 말 것"],
      rows: [
        [
          "미지급 잔액",
          "풀이 이 지급 주소에 아직 적어 둔 ERG",
          "워커마다 한 부, 또는 체인의 모든 박스",
        ],
        ["누적 지급", "풀이 이미 보낸 누적", "다음 지급 시각표"],
        ["24시간 보상", "롤링 24시간. 달력상 0시부터 24시가 아님", "해시레이트 비율로 나눈 수입"],
        ["없음", "알 수 없음으로 유지", "0 ERG"],
      ],
    },
    ja: {
      headers: ["項目", "意味", "そう扱わない"],
      rows: [
        [
          "未払い残高",
          "プールがこの支払先にまだ記録している ERG",
          "ワーカーごとの複製、またはチェーン上の全ボックス",
        ],
        ["累計支払", "プールがすでに支払った累計", "次の支払いの時刻表"],
        [
          "24 時間報酬",
          "直近 24 時間。暦日の 0 時から 24 時ではない",
          "ハッシュレート比で分けた収入",
        ],
        ["欠ける", "不明のまま", "0 ERG"],
      ],
    },
  },
  body: {
    zh: [
      "这一行有三个独立金额，都记在同一个以 9 开头的 P2PK 付款地址上：还没付出的余额、已经付出的累计，以及滚动 24 小时收益。矿池账户接口用整数记账，1 ERG 等于 10 亿个最小单位，本页把能完整表示的整数换成 ERG。换不成或字段空着时，显示为未知，而不是 0。",
      "## 每个数在回答什么问题",
      "余额回答“矿池账上还挂着多少”。已付回答“至今已经划出多少”。24 小时收益回答“向前滚动的 24 小时里记了多少”，不是某个 UTC 日历日。API 索引把账户信息、付款和收益放在同一个账户接口里说明。未支付和累计已付可以分别理解成还在矿池账上的和已经付出的。容易误导的是把滚动 24 小时再叠到这两列上：这段窗口里的收益，往往已经落在未支付或已付里。本页把三列分开显示，不另报一笔自己的累计总额，也不按矿工人数或算力复制。",
      "## 付款前后看哪里",
      "- 矿池打出一笔 ERG 后，已付增加，未支付余额减少相应金额。两台矿工仍共用这一份余额，不会各看到一份全额。",
      "- 2Miners 的 ERG 帮助页写明，收到 ERG 本身不另收付款费（页面上的说法是 0 美元），改收 BTC 或 TON 则另有该页写出的小额费用。本页只能打开 ERG 的 9 地址，因此 BTC 和 TON 那两行费用不作用在这里的账户上。",
      "- 帮助页没有把下一次付款的钟点写进快速开始。本页也不预报付款时间。要看付款记录，打开矿池自己的账户页。",
      "## 读数异常时",
      "- 余额是未知而不是 0：不要当成已经结清。先在矿池账户页看同一地址是否给出了余额整数。",
      "- 24 小时收益很低，但矿工算力还在：收益和算力是两列。算力不能在本页换成 ERG。短窗口份额也不在本页。",
      "- 你以为每台机器应有自己的已付：那是另一套账。这里的已付只跟付款地址走。",
      "## 示意换算，不是实际收入",
      "若未支付整数是 2,500,000,000，页面显示 2.5 ERG。若 24 小时收益整数是 500,000,000，页面显示 0.5 ERG。已付字段空着则是未知，不能写成 0 再去减。未支付 2.5 和累计已付是两列不重叠的账。0.5 是滚动 24 小时，往往已经落在未支付或已付里，再叠上去会把同一段时间算两次。本页分开显示，不另报一笔累计总额。这组数字只说明单位换算，不是你的矿场。",
      "打开 [ERG 监控](/projects/erg)。地址为什么必须是 P2PK，见[P2PK 与铸币脚本](/learn/erg-p2pk-address-monitoring)。算力为什么不能拆成这些金额，见[Autolykos 矿工算力](/learn/erg-autolykos-worker-hashrate)。",
    ],
    "zh-TW": [
      "這一列有三個獨立金額，都記在同一個以 9 開頭的 P2PK 付款地址上：還沒付出的餘額、已經付出的累計，以及滾動 24 小時收益。礦池帳戶介面用整數記帳，1 ERG 等於 10 億個最小單位，本頁把能完整表示的整數換成 ERG。換不成或欄位空著時，顯示為未知，而不是 0。",
      "## 每個數在回答什麼問題",
      "餘額回答「礦池帳上還掛著多少」。已付回答「至今已經劃出多少」。24 小時收益回答「向前滾動的 24 小時裡記了多少」，不是某個 UTC 日曆日。API 索引把帳戶資訊、付款和收益放在同一個帳戶介面裡說明。未支付和累計已付可以分別理解成還在礦池帳上的和已經付出的。容易誤導的是把滾動 24 小時再疊到這兩欄上：這段窗口裡的收益，往往已經落在未支付或已付裡。本頁把三欄分開顯示，不另報一筆自己的累計總額，也不按礦工人數或算力複製。",
      "## 付款前後看哪裡",
      "- 礦池打出一筆 ERG 後，已付增加，未支付餘額減少相應金額。兩台礦工仍共用這一份餘額，不會各看到一份全額。",
      "- 2Miners 的 ERG 說明頁寫明，收到 ERG 本身不另收付款費（頁面上的說法是 0 美元），改收 BTC 或 TON 則另有該頁寫出的小額費用。本頁只能打開 ERG 的 9 地址，因此 BTC 和 TON 那兩行費用不作用在這裡的帳戶上。",
      "- 說明頁沒有把下一次付款的鐘點寫進快速開始。本頁也不預報付款時間。要看付款紀錄，打開礦池自己的帳戶頁。",
      "## 讀數異常時",
      "- 餘額是未知而不是 0：不要當成已經結清。先在礦池帳戶頁看同一地址是否給出了餘額整數。",
      "- 24 小時收益很低，但礦工算力還在：收益和算力是兩欄。算力不能在本頁換成 ERG。短窗口份額也不在本頁。",
      "- 你以為每台機器應有自己的已付：那是另一套帳。這裡的已付只跟付款地址走。",
      "## 示意換算，不是實際收入",
      "若未支付整數是 2,500,000,000，頁面顯示 2.5 ERG。若 24 小時收益整數是 500,000,000，頁面顯示 0.5 ERG。已付欄位空著則是未知，不能寫成 0 再去減。未支付 2.5 和累計已付是兩欄不重疊的帳。0.5 是滾動 24 小時，往往已經落在未支付或已付裡，再疊上去會把同一段時間算兩次。本頁分開顯示，不另報一筆累計總額。這組數字只說明單位換算，不是你的礦場。",
      "打開 [ERG 監控](/projects/erg)。地址為什麼必須是 P2PK，見[P2PK 與鑄幣腳本](/learn/erg-p2pk-address-monitoring)。算力為什麼不能拆成這些金額，見[Autolykos 礦工算力](/learn/erg-autolykos-worker-hashrate)。",
    ],
    en: [
      "This row has three separate amounts, all recorded on the same 9-prefix P2PK payout address: balance not yet paid, the total already paid, and a rolling 24-hour reward. The pool account uses integers, with 1 ERG equal to 1,000,000,000 base units. This page converts an integer it can represent into ERG. If the value cannot be converted or the field is empty, the figure stays unknown rather than 0.",
      "## Which question each number answers",
      "Balance answers how much the pool ledger still holds for this address. Paid answers how much has been sent so far. The 24-hour reward answers what was recorded over a rolling 24 hours, not a UTC calendar day. The API index describes account info, payments, and rewards on the account call. Unpaid and total paid can be read as what is still on the pool ledger and what has already been sent. The misleading sum stacks the rolling 24 hours on top of both, because rewards inside that window are often already inside unpaid or paid. This page shows the three columns separately, does not declare its own cumulative total, and does not copy the figures by worker count or hashrate.",
      "## What to look at around a payout",
      "- After the pool sends ERG, paid rises and unpaid balance falls by that transfer. Two workers still share the one balance. Each worker does not see a full copy.",
      "- The 2Miners ERG help page says a payout in ERG itself has no extra payout fee (it states 0 dollars) and quotes small fees if you instead take BTC or TON. This page can open only an ERG 9-address, so those BTC and TON fee lines do not apply to an account here.",
      "- The quick start does not name a clock time for the next payout. This page does not forecast one either. For the payment list, open the pool’s own account page.",
      "## When a reading looks wrong",
      "- Balance is unknown rather than 0. Do not treat the address as settled. Check whether the pool account page shows a balance integer for the same address.",
      "- The 24-hour reward looks low while worker hashrate is still present. Reward and hashrate are different columns. Hashrate is not converted into ERG here. The short share window is not on this page either.",
      "- You expected each rig to have its own paid total. That would be a different ledger. Paid here follows the payout address only.",
      "## Illustrative conversion, not actual income",
      "If the unpaid integer is 2,500,000,000, the page shows 2.5 ERG. If the 24-hour integer is 500,000,000, the page shows 0.5 ERG. An empty paid field is unknown. It is not written as 0 and then subtracted. Unpaid 2.5 and total paid are two columns that do not overlap. The 0.5 is a rolling 24 hours and is often already inside unpaid or paid, so stacking it counts the same stretch twice. This page shows the columns separately and does not declare its own cumulative total. The set only shows the unit conversion. It is not your farm.",
      "Open the [ERG monitor](/projects/erg). Why the address has to be P2PK is in [P2PK and the coinbase script](/learn/erg-p2pk-address-monitoring). Why hashrate is not split into these amounts is in [Autolykos worker hashrate](/learn/erg-autolykos-worker-hashrate).",
    ],
    ko: [
      "이 행에는 세 개의 독립된 금액이 있고, 모두 같은 9 P2PK 지급 주소에 적힙니다. 아직 지급하지 않은 잔액, 이미 지급한 누적, 롤링 24시간 보상입니다. 풀 계정은 정수로 적고 1 ERG는 10억 기본 단위입니다. 이 페이지는 표현할 수 있는 정수를 ERG로 바꿉니다. 바꿀 수 없거나 칸이 비면 0이 아니라 알 수 없음으로 둡니다.",
      "## 각 숫자가 답하는 질문",
      "잔액은 풀 장부가 이 주소에 아직 얼마를 들고 있는지입니다. 지급 완료는 지금까지 얼마나 보냈는지입니다. 24시간 보상은 앞으로 굴러간 24시간에 기록된 양이며 UTC 달력의 하루가 아닙니다. API 색인은 계정 정보, 지급, 보상을 계정 호출에 적습니다. 미지급과 누적 지급은 아직 풀 장부에 있는 액과 이미 보낸 액으로 읽을 수 있습니다. 헷갈리는 합은 롤링 24시간을 그 두 열 위에 겹치는 것입니다. 그 창의 보상은 대개 이미 미지급이나 지급 완료 안에 있습니다. 이 페이지는 세 열을 따로 보여 주고, 자체 누적 총액을 선언하지 않으며, 워커 수나 해시레이트로 복사하지도 않습니다.",
      "## 지급 전후에 볼 곳",
      "- 풀이 ERG를 보내면 지급 완료는 늘고 미지급 잔액은 그 금액만큼 줄어듭니다. 워커 둘은 여전히 잔액 하나를 나눕니다. 각 워커가 전액을 따로 보지 않습니다.",
      "- 2Miners ERG 도움말은 ERG로 받을 때 추가 지급 수수료가 없다고 하고(0달러라고 적음), BTC나 TON으로 바꾸면 그 페이지에 적은 작은 수수료가 있다고 합니다. 이 페이지는 ERG 9 주소만 열 수 있으므로 BTC와 TON 수수료 줄은 여기 계정에 적용되지 않습니다.",
      "- 빠른 시작은 다음 지급의 시각을 적지 않습니다. 이 페이지도 시각을 예보하지 않습니다. 지급 목록은 풀 자신의 계정 페이지에서 보세요.",
      "## 값이 이상할 때",
      "- 잔액이 0이 아니라 알 수 없음이면 정산이 끝났다고 보지 마세요. 풀 계정 페이지에 같은 주소의 잔액 정수가 있는지 먼저 보세요.",
      "- 24시간 보상이 낮아 보이는데 워커 해시레이트는 있습니다. 보상과 해시레이트는 다른 칸입니다. 해시레이트는 여기서 ERG로 바뀌지 않습니다. 짧은 점유 창도 이 페이지에 없습니다.",
      "- 리그마다 지급 완료가 있어야 한다고 생각했다면 그것은 다른 장부입니다. 여기의 지급 완료는 지급 주소만 따라갑니다.",
      "## 예시 환산이며, 실제 수입이 아님",
      "미지급 정수가 2,500,000,000이면 페이지는 2.5 ERG를 보여 줍니다. 24시간 정수가 500,000,000이면 0.5 ERG입니다. 지급 완료가 비어 있으면 알 수 없음이며, 0으로 적어 빼면 안 됩니다. 미지급 2.5와 누적 지급은 겹치지 않는 두 열입니다. 0.5는 롤링 24시간이라 대개 이미 미지급이나 지급 완료 안에 있고, 위에 겹치면 같은 구간을 두 번 셉니다. 이 페이지는 열을 따로 보여 주고 자체 누적 총액은 내지 않습니다. 이 묶음은 단위 환산만 보여 주며 당신의 농장이 아닙니다.",
      "[ERG 모니터](/projects/erg)를 여세요. 주소가 P2PK여야 하는 이유는 [P2PK와 코인베이스 스크립트](/learn/erg-p2pk-address-monitoring), 해시레이트를 이 금액으로 나누면 안 되는 이유는 [Autolykos 워커 해시레이트](/learn/erg-autolykos-worker-hashrate)에 있습니다.",
    ],
    ja: [
      "この行には三つの独立した金額があり、どれも同じ 9 始まりの P2PK 支払先に記録されます。まだ支払っていない残高、すでに支払った累計、直近 24 時間の報酬です。プール口座は整数で記帳し、1 ERG は 10 億基本単位です。このページは表現できる整数を ERG に換算します。換算できない、または欄が空なら、0 ではなく不明のままにします。",
      "## それぞれの数が答える問い",
      "残高は、プール台帳がこのアドレスにまだいくら持っているかです。支払済みは、これまでにいくら送ったかです。24 時間報酬は、転がる 24 時間に記録された量であり、UTC の暦日ではありません。API 索引は口座情報、支払い、報酬を口座呼び出しにまとめています。未払いと累計支払は、まだプール台帳にある額と、すでに送った額として読めます。誤解を招くのは、直近 24 時間をその二列の上に重ねることです。その窓の報酬は、たいていまだ未払いか支払済みの中にあります。このページは三列を分けて出し、独自の累計総額は出さず、ワーカー数やハッシュレートでも複製しません。",
      "## 支払いの前後で見るところ",
      "- プールが ERG を送ると、支払済みは増え、未払い残高はその金額だけ減ります。ワーカーが二台でも残高は一つを共有します。各ワーカーが全額の複製を見るわけではありません。",
      "- 2Miners の ERG ヘルプは、ERG で受け取る支払い自体に追加手数料は無いと書き（0 ドルと述べ）、BTC や TON に変える場合はそのページに小さい手数料を記しています。このページが開けるのは ERG の 9 アドレスだけなので、BTC と TON の手数料行はここの口座には適用されません。",
      "- クイックスタートは次の支払いの時刻を書いていません。このページも時刻を予報しません。支払い一覧はプール自身の口座ページで見てください。",
      "## 読みがおかしいとき",
      "- 残高が 0 ではなく不明なら、精算済みとみなさないでください。同じアドレスの残高整数がプールの口座ページにあるか先に見てください。",
      "- 24 時間報酬が低く見え、ワーカーのハッシュレートはある。報酬とハッシュレートは別の欄です。ハッシュレートはここでは ERG に換算されません。短いシェア窓もこのページにはありません。",
      "- リグごとに支払済みがあると思ったなら、それは別の台帳です。ここの支払済みは支払先だけに従います。",
      "## 例示の換算であり、実際の収入ではない",
      "未払いの整数が 2,500,000,000 なら、ページは 2.5 ERG を出します。24 時間の整数が 500,000,000 なら 0.5 ERG です。支払済みが空なら不明であり、0 と書いて引いてはいけません。未払い 2.5 と累計支払は重ならない二列です。0.5 は直近 24 時間で、たいていまだ未払いか支払済みの中にあり、上に重ねると同じ区間を二回数えます。このページは列を分けて出し、独自の累計総額は出しません。この組は単位換算を示すだけで、あなたのファームではありません。",
      "[ERG モニター](/projects/erg) を開いてください。アドレスが P2PK でなければならない理由は [P2PK とコインベーススクリプト](/learn/erg-p2pk-address-monitoring)、ハッシュレートをこれらの金額に分けない理由は [Autolykos のワーカーハッシュレート](/learn/erg-autolykos-worker-hashrate) にあります。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "1 ERG 在这页等于多少最小单位？",
        "10 亿。矿池账户用这个比例把整数换成 ERG。整数缺失或无法表示时，金额保持未知，不显示成 0。",
      ],
      [
        "1 ERG 在這頁等於多少最小單位？",
        "10 億。礦池帳戶用這個比例把整數換成 ERG。整數缺失或無法表示時，金額保持未知，不顯示成 0。",
      ],
      [
        "How many base units are 1 ERG on this page?",
        "One billion. The pool account converts integers at that ratio. If the integer is missing or cannot be represented, the amount stays unknown and is not shown as 0.",
      ],
      [
        "이 페이지에서 1 ERG는 기본 단위 몇 개인가요?",
        "10억입니다. 풀 계정은 그 비율로 정수를 ERG로 바꿉니다. 정수가 없거나 표현할 수 없으면 금액은 알 수 없음으로 두고 0으로 보이지 않습니다.",
      ],
      [
        "このページで 1 ERG は基本単位いくつですか？",
        "10 億です。プール口座はその比率で整数を ERG にします。整数が欠けるか表現できないときは、金額は不明のままで、0 とは表示しません。",
      ],
    ),
    qa(
      [
        "24 小时收益是 UTC 当天吗？",
        "不是。它是滚动的 24 小时。把它和日历日的账单或矿工算力加在一起，得不出下一笔付款。",
      ],
      [
        "24 小時收益是 UTC 當天嗎？",
        "不是。它是滾動的 24 小時。把它和日曆日的帳單或礦工算力加在一起，得不出下一筆付款。",
      ],
      [
        "Is the 24-hour reward the UTC calendar day?",
        "No. It is a rolling 24 hours. Adding it to a calendar-day bill or to worker hashrate does not produce the next payout.",
      ],
      [
        "24시간 보상은 UTC 당일인가요?",
        "아닙니다. 롤링 24시간입니다. 달력상 청구서나 워커 해시레이트와 더해도 다음 지급이 되지 않습니다.",
      ],
      [
        "24 時間報酬は UTC の当日ですか？",
        "いいえ。転がる 24 時間です。暦日の請求やワーカーのハッシュレートと足しても、次の支払いにはなりません。",
      ],
    ),
    qa(
      [
        "两台矿工会各显示一份余额吗？",
        "不会。余额、已付和 24 小时收益只挂在付款地址上，并去重成一份。打开 [ERG 监控](/projects/erg) 看这一份，不要按矿工复制。",
      ],
      [
        "兩台礦工會各顯示一份餘額嗎？",
        "不會。餘額、已付和 24 小時收益只掛在付款地址上，並去重成一份。打開 [ERG 監控](/projects/erg) 看這一份，不要按礦工複製。",
      ],
      [
        "Will two workers each show a copy of the balance?",
        "No. Balance, paid, and the 24-hour reward stay on the payout address and are deduped to one copy. Open the [ERG monitor](/projects/erg) for that one copy. Do not duplicate it per worker.",
      ],
      [
        "워커 둘이 잔액을 각각 보여 주나요?",
        "아니요. 잔액, 지급 완료, 24시간 보상은 지급 주소에만 있고 한 부로 중복 제거됩니다. [ERG 모니터](/projects/erg)에서 그 한 부를 보고 워커마다 복사하지 마세요.",
      ],
      [
        "ワーカー二台が残高をそれぞれ表示しますか？",
        "しません。残高、支払済み、24 時間報酬は支払先にだけ付き、一つにまとめられます。[ERG モニター](/projects/erg) でその一つを見て、ワーカーごとに複製しないでください。",
      ],
    ),
  ]),
};

const offline: Article = {
  slug: "erg-miner-no-shares",
  published: "2026-10-24",
  modified: "2026-10-24",
  project: "erg",
  sources: [
    { name: "2Miners · ERG help", url: "https://erg.2miners.com/help" },
    { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
  ],
  related: [
    "erg-autolykos-worker-hashrate",
    "erg-mining-monitor-guide",
    "erg-rewards-balances-payments",
  ],
  topic: L(
    "矿工离线或没有份额",
    "礦工離線或沒有份額",
    "Worker offline or no shares",
    "워커 오프라인 또는 점유 없음",
    "ワーカーがオフライン、またはシェアが無い",
  ),
  title: L(
    "ERG 矿工显示离线或列表里没有份额时，先查哪里？",
    "ERG 礦工顯示離線或清單裡沒有份額時，先查哪裡？",
    "Where to look when an ERG worker is offline or no shares show up",
    "ERG 워커가 오프라인이거나 점유가 안 보일 때 어디를 먼저 보나요?",
    "ERG ワーカーがオフライン、またはシェアが見えないとき、最初にどこを見るか",
  ),
  description: L(
    "本页只显示矿工是否在线、算力和最后出现时间。5 分钟到 6 小时的份额曲线在矿池账户页。份额难度不影响帮助页所说的收益。",
    "本頁只顯示礦工是否在線、算力和最後出現時間。5 分鐘到 6 小時的份額曲線在礦池帳戶頁。份額難度不影響說明頁所說的收益。",
    "This page shows whether the worker is online, its hashrate, and when it was last seen. Share charts from 5 minutes to 6 hours stay on the pool account page. Share difficulty does not change rewards, as the help page states.",
    "이 페이지는 워커의 온라인 여부, 해시레이트, 마지막 시각만 보여 줍니다. 5분에서 6시간 점유 곡선은 풀 계정 페이지에 있습니다. 도움말이 말하듯 점유 난이도는 보상을 바꾸지 않습니다.",
    "このページが見せるのは、ワーカーがオンラインか、ハッシュレート、最後に見えた時刻です。5 分から 6 時間のシェア曲線はプールの口座ページにあります。ヘルプが述べるとおり、シェア難度は報酬を変えません。",
  ),
  summary: L(
    "矿工名字消失或标成离线时，先对 RIG_ID、Autolykos 和矿池主机，再去矿池账户页看短窗口份额。难度档不会把缺失的 ERG 补出来。用 [ERG 监控](/projects/erg) 看当前这一行。",
    "礦工名稱消失或標成離線時，先對 RIG_ID、Autolykos 和礦池主機，再去礦池帳戶頁看短窗口份額。難度檔不會把缺失的 ERG 補出來。用 [ERG 監控](/projects/erg) 看目前這一列。",
    "If the worker name is missing or marked offline, match RIG_ID, Autolykos, and the pool host, then read the short share window on the pool account page. A difficulty tier does not fill in missing ERG. Use the [ERG monitor](/projects/erg) for the current row.",
    "워커 이름이 없거나 오프라인이면 RIG_ID, Autolykos, 풀 호스트를 맞춘 뒤 풀 계정 페이지에서 짧은 점유 창을 보세요. 난이도 단계가 빠진 ERG를 채워 주지는 않습니다. 현재 행은 [ERG 모니터](/projects/erg)에서 보세요.",
    "ワーカー名が無い、またはオフラインなら、RIG_ID と Autolykos とプールホストを合わせ、短いシェア窓はプールの口座ページで読んでください。難度の段が欠けた ERG を埋めることはありません。現在の行は [ERG モニター](/projects/erg) で見てください。",
  ),
  comparisonTitle: L(
    "离线、没名字、没有短窗口",
    "離線、沒名字、沒有短窗口",
    "Offline, missing name, no short window",
    "오프라인, 이름 없음, 짧은 창 없음",
    "オフライン、名前が無い、短い窓が無い",
  ),
  comparison: {
    zh: {
      headers: ["你看到的", "本页能确定的", "接着做"],
      rows: [
        ["矿工标为离线，最后出现时间较早", "矿池把这名矿工标成离线", "查矿机是否还在向该主机提交"],
        [
          "账户能开，矿工名字不在列表",
          "公开账户里没有这个 RIG_ID",
          "核对点号后的名字，或是否连到别的主机 / SOLO",
        ],
        [
          "矿工在线，但你要 5 分钟份额",
          "本页没有 5 分钟、30 分钟、6 小时曲线",
          "打开矿池账户页看那段窗口",
        ],
        ["想靠提高份额难度补收益", "帮助页写明难度不影响收益", "难度只影响提交粒度，不创造 ERG"],
      ],
    },
    "zh-TW": {
      headers: ["你看到的", "本頁能確定的", "接著做"],
      rows: [
        ["礦工標為離線，最後出現時間較早", "礦池把這名礦工標成離線", "查礦機是否還在向該主機提交"],
        [
          "帳戶能開，礦工名稱不在清單",
          "公開帳戶裡沒有這個 RIG_ID",
          "核對點號後的名稱，或是否連到別的主機 / SOLO",
        ],
        [
          "礦工在線，但你要 5 分鐘份額",
          "本頁沒有 5 分鐘、30 分鐘、6 小時曲線",
          "打開礦池帳戶頁看那段窗口",
        ],
        ["想靠提高份額難度補收益", "說明頁寫明難度不影響收益", "難度只影響提交粒度，不創造 ERG"],
      ],
    },
    en: {
      headers: ["What you see", "What this page can say", "Do next"],
      rows: [
        [
          "Worker marked offline, last seen is old",
          "The pool marked that worker offline",
          "See if the miner is still submitting to that host",
        ],
        [
          "Account opens, worker name is absent",
          "The public account has no such RIG_ID",
          "Check the name after the dot, or another host / SOLO",
        ],
        [
          "Worker online, you want 5-minute shares",
          "No 5-minute, 30-minute, or 6-hour chart here",
          "Open the pool account page for that window",
        ],
        [
          "Raising share difficulty to recover ERG",
          "The help page says difficulty does not change rewards",
          "Difficulty changes submit size, it does not create ERG",
        ],
      ],
    },
    ko: {
      headers: ["보이는 것", "이 페이지가 말할 수 있는 것", "다음"],
      rows: [
        [
          "워커가 오프라인, 마지막 시각이 오래됨",
          "풀이 그 워커를 오프라인으로 표시",
          "채굴기가 그 호스트로 아직 제출하는지 확인",
        ],
        [
          "계정은 열리고 워커 이름이 없음",
          "공개 계정에 그 RIG_ID가 없음",
          "점 뒤 이름, 또는 다른 호스트 / SOLO 확인",
        ],
        [
          "워커는 온라인, 5분 점유가 필요",
          "5분, 30분, 6시간 곡선은 여기 없음",
          "풀 계정 페이지에서 그 창을 보기",
        ],
        [
          "점유 난이도를 올려 ERG를 메우려 함",
          "도움말은 난이도가 보상을 바꾸지 않는다고 함",
          "난이도는 제출 크기만 바꾸고 ERG를 만들지 않음",
        ],
      ],
    },
    ja: {
      headers: ["見えているもの", "このページが言えること", "次にすること"],
      rows: [
        [
          "ワーカーがオフライン、最終時刻が古い",
          "プールがそのワーカーをオフラインにした",
          "マイナーがそのホストへまだ送っているか見る",
        ],
        [
          "口座は開くがワーカー名が無い",
          "公開口座にその RIG_ID が無い",
          "ドット後の名前、または別ホスト / SOLO を確認",
        ],
        [
          "ワーカーはオンライン、5 分シェアが欲しい",
          "5 分、30 分、6 時間の曲線はここには無い",
          "プールの口座ページでその窓を見る",
        ],
        [
          "シェア難度を上げて ERG を埋めたい",
          "ヘルプは難度が報酬を変えないと書く",
          "難度は送信の粒度を変えるだけで ERG は作らない",
        ],
      ],
    },
  },
  body: {
    zh: [
      "监控上的矿工行只有四件事：名字、算力、矿池是否把它标成在线，以及最后出现时间。它不画份额曲线。2Miners 的 API 索引把账户份额和单矿工算力按 5 分钟、30 分钟、6 小时分开列出。那些窗口在矿池自己的账户页，不在这一行。",
      "## 在线、算力、最后出现分别说明什么",
      "在线或离线是矿池对这名矿工的当前标记。算力是它报给这个 RIG_ID 的数，不是这台机器应得的 ERG。最后出现时间来自矿池给出的最近一次记录；没有这个时间时保持未知，不要写成从未挖过。账户级余额仍然只有一份，离线矿工不会把余额清零。",
      "## 按现象分支",
      "- 名字在，状态离线，最后出现是更早的时间：看矿机进程是否还在跑，主机是不是帮助页快速开始里的那类地址（示例 erg.2miners.com 端口 8888，SSL 为 18888），算法是不是 Autolykos。区域主机以你的配置文件为准。",
      "- 付款地址能打开，列表里没有你起的名字：RIG_ID 为空、超过 32 个字符，或用了减号和下划线以外的符号时，矿池上的名字会和你本子里的 rig-1 不同。也可能矿机指到了另一台服务器。API 索引把 ERG 的 SOLO 单独列出，本页不合并 SOLO。",
      "- 矿工在线且算力有数，你仍想确认份额是否被接受：看矿机日志里的接受计数，以及矿池账户页上的短窗口。本页补不出那条曲线。",
      "- 收益没变，于是想调高份额难度：帮助页写明份额难度不影响矿工收益，并建议显卡很多或使用 NiceHash 时才用高难度。调难度不能把未知的余额变成 ERG。",
      "## 一组示意诊断，不是事故报告",
      "示意：rig-1 标成离线，最后出现停在昨天，算力空着。这表示按矿池标记，这台名字昨天之后没有继续出现。它不是“收入为 0”的结算。同一地址若未支付仍显示 1.2 ERG，那 1.2 仍属于地址，不因 rig-1 离线而被抹掉，也不分给还在线的另一台。",
      "只查看矿工不占用设备名额。你若把每台矿工存成单独设备，免费档每项目 3 台、Pro 100 台会把那些已保存设备算进去。打开 [ERG 监控](/projects/erg)。算力列的读法见[Autolykos 矿工算力](/learn/erg-autolykos-worker-hashrate)。地址打不开见[该填哪种地址](/learn/erg-mining-monitor-guide)。",
    ],
    "zh-TW": [
      "監控上的礦工列只有四件事：名稱、算力、礦池是否把它標成在線，以及最後出現時間。它不畫份額曲線。2Miners 的 API 索引把帳戶份額和單礦工算力按 5 分鐘、30 分鐘、6 小時分開列出。那些窗口在礦池自己的帳戶頁，不在這一列。",
      "## 在線、算力、最後出現分別說明什麼",
      "在線或離線是礦池對這名礦工的目前標記。算力是它報給這個 RIG_ID 的數，不是這台機器應得的 ERG。最後出現時間來自礦池給出的最近一次紀錄；沒有這個時間時保持未知，不要寫成從未挖過。帳戶級餘額仍然只有一份，離線礦工不會把餘額清零。",
      "## 按現象分支",
      "- 名稱在，狀態離線，最後出現是更早的時間：看礦機行程是否還在跑，主機是不是說明頁快速開始裡的那類位址（範例 erg.2miners.com 埠 8888，SSL 為 18888），演算法是不是 Autolykos。區域主機以你的設定檔為準。",
      "- 付款地址能打開，清單裡沒有你起的名稱：RIG_ID 為空、超過 32 個字元，或用了減號和底線以外的符號時，礦池上的名稱會和你本子裡的 rig-1 不同。也可能礦機指到了另一台伺服器。API 索引把 ERG 的 SOLO 單獨列出，本頁不合併 SOLO。",
      "- 礦工在線且算力有數，你仍想確認份額是否被接受：看礦機日誌裡的接受計數，以及礦池帳戶頁上的短窗口。本頁補不出那條曲線。",
      "- 收益沒變，於是想調高份額難度：說明頁寫明份額難度不影響礦工收益，並建議顯卡很多或使用 NiceHash 時才用高難度。調難度不能把未知的餘額變成 ERG。",
      "## 一組示意診斷，不是事故報告",
      "示意：rig-1 標成離線，最後出現停在昨天，算力空著。這表示按礦池標記，這台名稱昨天之後沒有繼續出現。它不是「收入為 0」的結算。同一地址若未支付仍顯示 1.2 ERG，那 1.2 仍屬於地址，不因 rig-1 離線而被抹掉，也不分給還在線的另一台。",
      "只查看礦工不占用裝置名額。你若把每台礦工存成單獨裝置，免費方案每項目 3 台、Pro 100 台會把那些已儲存裝置算進去。打開 [ERG 監控](/projects/erg)。算力欄的讀法見[Autolykos 礦工算力](/learn/erg-autolykos-worker-hashrate)。地址打不開見[該填哪種地址](/learn/erg-mining-monitor-guide)。",
    ],
    en: [
      "A worker row on the monitor has four facts: the name, the hashrate, whether the pool marks it online, and when it was last seen. It does not draw a share chart. The 2Miners API index lists account shares and per-worker hashrate for 5 minutes, 30 minutes, and 6 hours as separate calls. Those windows live on the pool’s own account page, not on this row.",
      "## What online, hashrate, and last seen each say",
      "Online or offline is the pool’s current mark for that worker. Hashrate is the number it reported for that RIG_ID, not the ERG that rig is owed. Last seen comes from the pool’s latest record. When that time is absent it stays unknown. Do not rewrite it as “never mined.” The address balance is still one figure. An offline worker does not zero it.",
      "## Branch on what you see",
      "- The name is present, the status is offline, and last seen is earlier. Check that the miner process is still running, that the host matches the kind of address in the help page quick start (the example is erg.2miners.com port 8888, SSL 18888), and that the algorithm is Autolykos. Regional hosts follow your config file.",
      "- The payout address opens and your name is not in the list. An empty RIG_ID, a name longer than 32 characters, or a symbol other than hyphen and underscore will not match the rig-1 in your notes. The miner may also point at another server. The API index lists ERG SOLO separately. This page does not merge SOLO.",
      "- The worker is online and has a hashrate, and you still want proof that shares are accepted. Read the accepted count in the miner log and the short window on the pool account page. This page cannot fill in that chart.",
      "- Rewards did not move, so you want a higher share difficulty. The help page says share difficulty does not change miner rewards, and it reserves the higher tier for a very large GPU count or NiceHash. Changing difficulty does not turn an unknown balance into ERG.",
      "## An illustrative diagnosis, not an incident report",
      "Sketch: rig-1 is marked offline, last seen stopped yesterday, and hashrate is empty. By the pool’s mark, that name has not continued since yesterday. It is not a settlement that income is 0. If the same address still shows 1.2 ERG unpaid, that 1.2 still belongs to the address. It is not erased because rig-1 is offline, and it is not given to another rig that stays online.",
      "Viewing workers does not use a device slot. If you save each worker as its own device, Free’s three saved devices per project and Pro’s 100 count those records. Open the [ERG monitor](/projects/erg). How to read the hashrate column is in [Autolykos worker hashrate](/learn/erg-autolykos-worker-hashrate). An address that will not open is in [which address to paste](/learn/erg-mining-monitor-guide).",
    ],
    ko: [
      "모니터의 워커 행에는 네 가지만 있습니다. 이름, 해시레이트, 풀이 온라인으로 표시했는지, 마지막으로 보인 시각입니다. 점유 곡선은 그리지 않습니다. 2Miners API 색인은 계정 점유와 워커별 해시레이트를 5분, 30분, 6시간으로 나누어 별도 호출에 적습니다. 그 창은 풀 자신의 계정 페이지에 있고 이 행에는 없습니다.",
      "## 온라인, 해시레이트, 마지막 시각이 각각 말하는 것",
      "온라인 또는 오프라인은 풀이 그 워커에 붙인 현재 표시입니다. 해시레이트는 그 RIG_ID에 보고된 숫자이며 그 리그가 받을 ERG가 아닙니다. 마지막 시각은 풀의 최근 기록입니다. 시각이 없으면 알 수 없음으로 두고, 한 번도 캐지 않았다고 다시 쓰지 마세요. 주소 잔액은 여전히 하나입니다. 오프라인 워커가 잔액을 0으로 만들지 않습니다.",
      "## 보이는 대로 갈라지기",
      "- 이름은 있고 상태가 오프라인이며 마지막 시각이 더 이릅니다. 채굴기 프로세스가 아직 도는지, 호스트가 도움말 빠른 시작의 종류인지(예시는 erg.2miners.com 포트 8888, SSL 18888), 알고리즘이 Autolykos인지 보세요. 지역 호스트는 설정 파일을 따릅니다.",
      "- 지급 주소는 열리는데 목록에 이름이 없습니다. RIG_ID가 비었거나 32자를 넘거나 하이픈·밑줄 이외의 기호이면, 풀의 이름은 메모의 rig-1과 다릅니다. 채굴기가 다른 서버를 볼 수도 있습니다. API 색인은 ERG SOLO를 따로 둡니다. 이 페이지는 SOLO를 합치지 않습니다.",
      "- 워커는 온라인이고 해시레이트가 있는데 점유가 받아들여졌는지 확인하고 싶습니다. 채굴기 로그의 수락 횟수와 풀 계정 페이지의 짧은 창을 보세요. 이 페이지가 그 곡선을 채우지는 못합니다.",
      "- 보상이 움직이지 않아 점유 난이도를 올리고 싶습니다. 도움말은 점유 난이도가 보상을 바꾸지 않는다고 하고, 높은 단계는 GPU가 아주 많거나 NiceHash일 때로 둡니다. 난이도를 바꿔도 알 수 없는 잔액이 ERG가 되지는 않습니다.",
      "## 예시 진단이며, 사고 보고서가 아님",
      "스케치: rig-1이 오프라인이고 마지막 시각이 어제에 멈췄으며 해시레이트가 비어 있습니다. 풀 표시상 그 이름은 어제 이후 이어지지 않았다는 뜻입니다. 수입이 0이라는 정산이 아닙니다. 같은 주소의 미지급이 여전히 1.2 ERG라면 그 1.2는 주소의 것입니다. rig-1이 오프라인이라고 지워지지 않고, 온라인인 다른 리그에게 주어지지도 않습니다.",
      "워커를 보기만 해서 기기 슬롯이 쓰이지 않습니다. 워커마다 기기를 저장하면 무료의 프로젝트당 3대, Pro 100대가 그 기록을 셉니다. [ERG 모니터](/projects/erg)를 여세요. 해시레이트 칸은 [Autolykos 워커 해시레이트](/learn/erg-autolykos-worker-hashrate), 주소가 안 열리면 [어떤 주소를 붙일지](/learn/erg-mining-monitor-guide)를 보세요.",
    ],
    ja: [
      "モニターのワーカー行にあるのは四つだけです。名前、ハッシュレート、プールがオンラインと印しているか、最後に見えた時刻です。シェア曲線は描きません。2Miners の API 索引は、口座シェアとワーカーごとのハッシュレートを 5 分、30 分、6 時間に分けた別呼び出しとして載せています。その窓はプール自身の口座ページにあり、この行にはありません。",
      "## オンライン、ハッシュレート、最終出現がそれぞれ言うこと",
      "オンラインかオフラインかは、プールがそのワーカーに付けた現在の印です。ハッシュレートはその RIG_ID に報告された数であり、そのリグが受け取る ERG ではありません。最終出現はプールの直近の記録です。時刻が無ければ不明のままにし、一度も掘っていないと書き替えないでください。アドレス残高は依然として一つです。オフラインのワーカーが残高を 0 にはしません。",
      "## 見え方で分岐する",
      "- 名前はあり、状態はオフラインで、最終出現がより前です。マイナーのプロセスがまだ動いているか、ホストがヘルプのクイックスタートの種類か（例は erg.2miners.com のポート 8888、SSL は 18888）、アルゴリズムが Autolykos かを見てください。リージョンのホストは設定ファイルに従います。",
      "- 支払先は開くのに、一覧に名前がありません。RIG_ID が空、32 文字を超える、ハイフンとアンダースコア以外の記号だと、プール上の名前はメモの rig-1 と違います。マイナーが別のサーバーを向いていることもあります。API 索引は ERG の SOLO を別にしています。このページは SOLO を混ぜません。",
      "- ワーカーはオンラインでハッシュレートがあり、シェアが受理されたかまだ確認したい。マイナーログの受理回数と、プール口座ページの短い窓を見てください。このページがその曲線を埋めることはできません。",
      "- 報酬が動かないのでシェア難度を上げたい。ヘルプはシェア難度が報酬を変えないと書き、高い段は GPU が非常に多いときか NiceHash のときとしています。難度を変えても、不明な残高は ERG になりません。",
      "## 例示の切り分けであり、事故報告ではない",
      "図：rig-1 がオフライン、最終出現が昨日で止まり、ハッシュレートが空。プールの印では、その名前は昨日以降続いていない、ということです。収入が 0 という精算ではありません。同じアドレスの未払いがまだ 1.2 ERG なら、その 1.2 はアドレスのものです。rig-1 がオフラインだから消えるわけでも、オンラインの別リグへ渡るわけでもありません。",
      "ワーカーを見るだけではデバイス枠を使いません。ワーカーごとにデバイスを保存すると、無料のプロジェクトあたり 3 台、Pro の 100 台がそれらの記録を数えます。[ERG モニター](/projects/erg) を開いてください。ハッシュレート欄の読み方は [Autolykos のワーカーハッシュレート](/learn/erg-autolykos-worker-hashrate)、アドレスが開かないときは [どのアドレスを貼るか](/learn/erg-mining-monitor-guide) を見てください。",
    ],
  },
  questions: mergeQa([
    qa(
      [
        "离线是不是余额变成 0？",
        "不是。离线只说明矿池把这名矿工标成离线。未支付余额仍属于付款地址。缺数保持未知，不会因为离线被写成 0。",
      ],
      [
        "離線是不是餘額變成 0？",
        "不是。離線只說明礦池把這名礦工標成離線。未支付餘額仍屬於付款地址。缺數保持未知，不會因為離線被寫成 0。",
      ],
      [
        "Does offline mean the balance became 0?",
        "No. Offline means the pool marked that worker offline. Unpaid balance still belongs to the payout address. A missing figure stays unknown and is not written as 0 because the worker is offline.",
      ],
      [
        "오프라인이면 잔액이 0이 되나요?",
        "아닙니다. 오프라인은 풀이 그 워커를 오프라인으로 표시했다는 뜻입니다. 미지급 잔액은 여전히 지급 주소의 것입니다. 빠진 값은 알 수 없음으로 두고, 오프라인이라고 0으로 쓰지 않습니다.",
      ],
      [
        "オフラインは残高が 0 になったという意味ですか？",
        "いいえ。オフラインは、プールがそのワーカーをオフラインと印したという意味です。未払い残高は支払先のままです。欠けた数は不明のままで、オフラインだから 0 とは書きません。",
      ],
    ),
    qa(
      [
        "提高份额难度会让 ERG 增加吗？",
        "按帮助页的说法，不会。份额难度不影响矿工收益。它改变的是提交的粒度。收益仍看地址上的余额、已付和滚动 24 小时收益。",
      ],
      [
        "提高份額難度會讓 ERG 增加嗎？",
        "按說明頁的說法，不會。份額難度不影響礦工收益。它改變的是提交的粒度。收益仍看地址上的餘額、已付和滾動 24 小時收益。",
      ],
      [
        "Will a higher share difficulty increase ERG?",
        "Not according to the help page. Share difficulty does not change miner rewards. It changes how large each submit is. Rewards still sit on the address as balance, paid, and the rolling 24-hour reward.",
      ],
      [
        "점유 난이도를 올리면 ERG가 늘나요?",
        "도움말대로라면 늘지 않습니다. 점유 난이도는 보상을 바꾸지 않습니다. 바뀌는 것은 제출 크기입니다. 보상은 주소의 잔액, 지급 완료, 롤링 24시간 보상으로 남습니다.",
      ],
      [
        "シェア難度を上げると ERG は増えますか？",
        "ヘルプの記述では増えません。シェア難度は報酬を変えません。変わるのは送信の粒度です。報酬はアドレス上の残高、支払済み、直近 24 時間の報酬のままです。",
      ],
    ),
    qa(
      [
        "短窗口份额该去哪看？",
        "去矿池账户页。本页不提供 5 分钟、30 分钟、6 小时曲线。当前矿工行回到 [ERG 监控](/projects/erg)，算力含义见[Autolykos 矿工算力](/learn/erg-autolykos-worker-hashrate)。",
      ],
      [
        "短窗口份額該去哪看？",
        "去礦池帳戶頁。本頁不提供 5 分鐘、30 分鐘、6 小時曲線。目前礦工列回到 [ERG 監控](/projects/erg)，算力含義見[Autolykos 礦工算力](/learn/erg-autolykos-worker-hashrate)。",
      ],
      [
        "Where do I read the short share window?",
        "On the pool account page. This page does not provide the 5-minute, 30-minute, or 6-hour chart. The current worker row is on the [ERG monitor](/projects/erg). What hashrate means is in [Autolykos worker hashrate](/learn/erg-autolykos-worker-hashrate).",
      ],
      [
        "짧은 점유 창은 어디서 보나요?",
        "풀 계정 페이지입니다. 이 페이지는 5분, 30분, 6시간 곡선을 주지 않습니다. 현재 워커 행은 [ERG 모니터](/projects/erg), 해시레이트의 의미는 [Autolykos 워커 해시레이트](/learn/erg-autolykos-worker-hashrate)에 있습니다.",
      ],
      [
        "短いシェア窓はどこで読みますか？",
        "プールの口座ページです。このページは 5 分、30 分、6 時間の曲線を出しません。現在のワーカー行は [ERG モニター](/projects/erg)、ハッシュレートの意味は [Autolykos のワーカーハッシュレート](/learn/erg-autolykos-worker-hashrate) にあります。",
      ],
    ),
  ]),
};

export const ergDepthGuides: Article[] = [monitor, address, hashrate, rewards, offline];
