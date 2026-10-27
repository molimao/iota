import type { Article } from "../articles";

type Text = Article["title"];
type Questions = NonNullable<Article["questions"]>;

function text(zh: string, tw: string, en: string, ko: string, ja: string): Text {
  return { zh, "zh-TW": tw, en, ko, ja };
}

function questions(rows: Array<[Text, Text]>): Questions {
  return {
    zh: rows.map(([q, a]) => ({ question: q.zh, answer: a.zh })),
    "zh-TW": rows.map(([q, a]) => ({ question: q["zh-TW"], answer: a["zh-TW"] })),
    en: rows.map(([q, a]) => ({ question: q.en, answer: a.en })),
    ko: rows.map(([q, a]) => ({ question: q.ko, answer: a.ko })),
    ja: rows.map(([q, a]) => ({ question: q.ja, answer: a.ja })),
  };
}

function paras(
  zh: string[],
  tw: string[],
  en: string[],
  ko: string[],
  ja: string[],
): Article["body"] {
  return { zh, "zh-TW": tw, en, ko, ja };
}

function table(
  zh: { headers: string[]; rows: string[][] },
  tw: { headers: string[]; rows: string[][] },
  en: { headers: string[]; rows: string[][] },
  ko: { headers: string[]; rows: string[][] },
  ja: { headers: string[]; rows: string[][] },
): NonNullable<Article["comparison"]> {
  return { zh, "zh-TW": tw, en, ko, ja };
}

const setup = "xid-mmm-mainnet-setup";
const hashrate = "xid-worker-hashrate-shares";
const rewards = "xid-rewards-balance-maturity";
const nets = "xid-mainnet-vs-testnet";
const offline = "xid-worker-offline-checklist";

const site = { name: "xCoin · mainnet and mining", url: "https://xcoinproject.com/" };
const mmm = { name: "Mac Metal Miner · mainnet setup", url: "https://macmetalminer.com/" };
const repo = {
  name: "MMM · current application documentation",
  url: "https://github.com/SystemThreat/MMM",
};
const paper = {
  name: "xCoin · whitepaper: solo pool and coinbase maturity",
  url: "https://xcoinproject.com/whitepaper",
};
const watch = {
  name: "IOTA Watch · source and data rules",
  url: "https://github.com/molimao/iota",
};

export const xidDepthGuides: Article[] = [
  {
    slug: setup,
    project: "xid",
    published: "2026-10-03",
    modified: "2026-10-24",
    topic: text(
      "先对上主网",
      "先對上主網",
      "Match mainnet first",
      "메인넷부터 맞추기",
      "まずメインネットを合わせる",
    ),
    title: text(
      "XID / MMM 主网挖矿：Mac 设置与地址监控",
      "XID / MMM 主網挖礦：Mac 設定與地址監控",
      "XID mining with MMM: Mac mainnet setup and monitoring",
      "XID / MMM 채굴: Mac 메인넷 설정과 주소 모니터링",
      "XID / MMMのマイニング：Macのメインネット設定と監視",
    ),
    description: text(
      "XID 是 xCoin 的币，MMM 是 Mac 上的矿工程序。先在 MMM 里选主网、xpa1r 地址和当前矿池，再把同一公开地址放到 XID 监控。网页不在 Mac 上开矿。",
      "XID 是 xCoin 的幣，MMM 是 Mac 上的礦工程式。先在 MMM 裡選主網、xpa1r 地址和目前礦池，再把同一公開地址放到 XID 監控。網頁不在 Mac 上開礦。",
      "XID is the xCoin token and MMM is the Mac miner. Set mainnet, an xpa1r address and the current pool in MMM, then save that same public address on the XID monitor. The page does not start mining.",
      "XID는 xCoin 토큰이고 MMM은 Mac 채굴 앱입니다. MMM에서 메인넷, xpa1r 주소, 현재 풀을 맞춘 뒤 같은 공개 주소를 XID 모니터에 저장하세요. 페이지는 채굴을 시작하지 않습니다.",
      "XIDはxCoinのトークン、MMMはMacのマイナーです。MMMでメインネット、xpa1rアドレス、現行プールを合わせてから、同じ公開アドレスをXID監視に保存します。ページは採掘を開始しません。",
    ),
    summary: text(
      "先确认你跑的是 xCoin 官方指向的 MMM、网络是主网、收益地址以 xpa1r 开头。监控只读取浏览器上已有的公开记录。",
      "先確認你跑的是 xCoin 官方指向的 MMM、網路是主網、收益地址以 xpa1r 開頭。監控只讀取瀏覽器上已有的公開紀錄。",
      "Confirm the MMM build xCoin points to, mainnet, and an xpa1r payout address. The monitor only reads public records the explorer already has.",
      "xCoin이 안내하는 MMM, 메인넷, xpa1r 보상 주소인지 먼저 확인합니다. 모니터는 탐색기가 이미 가진 공개 기록만 읽습니다.",
      "xCoinが案内するMMM、メインネット、xpa1rの報酬アドレスかを先に確認します。監視はエクスプローラーが既に持つ公開記録だけを読みます。",
    ),
    sources: [site, mmm, repo, watch],
    related: [nets, hashrate],
    comparisonTitle: text(
      "设置项各自回答什么",
      "設定項各自回答什麼",
      "What each setup value answers",
      "설정 항목이 각각 답하는 것",
      "各設定が答えること",
    ),
    comparison: table(
      {
        headers: ["你填写的", "它确认什么", "它不确认什么"],
        rows: [
          [
            "网络 = Mainnet",
            "MMM 指向主网，而不是已退役的测试网 A",
            "不能证明已经出块或已经可花费",
          ],
          ["地址 xpa1r…", "主网公开收益地址", "不是私钥，也不是测试网 txa1r"],
          ["矿池主机与端口", "按当前主网说明连接公开矿池", "不是本站测得的延迟或在线率"],
          ["Worker 名称", "这台会话在矿池名单里的名字", "不是机型，也不是所有人身份"],
        ],
      },
      {
        headers: ["你填寫的", "它確認什麼", "它不確認什麼"],
        rows: [
          [
            "網路 = Mainnet",
            "MMM 指向主網，而不是已退役的測試網 A",
            "不能證明已經出塊或已經可花費",
          ],
          ["地址 xpa1r…", "主網公開收益地址", "不是私鑰，也不是測試網 txa1r"],
          ["礦池主機與連接埠", "按目前主網說明連接公開礦池", "不是本站測得的延遲或在線率"],
          ["Worker 名稱", "這次工作階段在礦池名單裡的名字", "不是機型，也不是所有人身份"],
        ],
      },
      {
        headers: ["What you enter", "What it confirms", "What it does not confirm"],
        rows: [
          [
            "Network = Mainnet",
            "MMM is aimed at mainnet, not retired testnet A",
            "Not that a block was found or is spendable",
          ],
          [
            "Address xpa1r…",
            "A mainnet public payout address",
            "Not a private key, and not testnet txa1r",
          ],
          [
            "Pool host and port",
            "The public pool named in the current mainnet instructions",
            "Not a latency or uptime we measured",
          ],
          [
            "Worker name",
            "The label for this session on the pool list",
            "Not the chip model or the owner's identity",
          ],
        ],
      },
      {
        headers: ["입력", "확인하는 것", "확인하지 않는 것"],
        rows: [
          [
            "네트워크 = Mainnet",
            "MMM이 종료된 테스트넷 A가 아닌 메인넷을 향함",
            "블록을 찾았거나 사용 가능하다는 뜻은 아님",
          ],
          ["주소 xpa1r…", "메인넷 공개 보상 주소", "비밀키도, 테스트넷 txa1r도 아님"],
          [
            "풀 호스트와 포트",
            "현재 메인넷 안내의 공개 풀",
            "우리가 측정한 지연이나 가동률이 아님",
          ],
          ["Worker 이름", "풀 목록에서 이 세션의 이름", "칩 모델이나 소유자 신원이 아님"],
        ],
      },
      {
        headers: ["入力", "確認すること", "確認しないこと"],
        rows: [
          [
            "ネットワーク = Mainnet",
            "終了したテストネットAではなくメインネット",
            "ブロック発見や使用可能の証明ではない",
          ],
          [
            "アドレス xpa1r…",
            "メインネットの公開報酬アドレス",
            "秘密鍵でもテストネット txa1r でもない",
          ],
          [
            "プールのホストとポート",
            "現行メインネット案内の公開プール",
            "当サイトが測った遅延や稼働率ではない",
          ],
          ["Worker名", "プール一覧でのこのセッションの名前", "チップ型番や所有者の身元ではない"],
        ],
      },
    ),
    body: paras(
      [
        "要看的是 xCoin 主网上、用 Mac Metal Miner（MMM）挖到的公开记录。XID 是代币名称，MMM 是矿工程序，不是第二种币。打开 [XID / MMM 监控](/projects/xid) 之前，先在 Mac 上把 MMM 配到主网。网页只保存公开收益地址并读取浏览器已有记录，不会在这台 Mac 上开始或停止挖矿，也不读取菜单栏里的温度、功耗或本机瞬时算力。",
        "下载前核对来源。xCoin 项目站和 MMM 主网页都指向 [SystemThreat/MMM](https://github.com/SystemThreat/MMM)。搜索 “MMM” 会出现别的币的同名程序。以仓库当前说明和发布为准，不要沿用旧教程里的测试网主机、端口或地址。项目站写明主网自 2026-09-26 00:00 UTC 创世起运行，浏览器为 https://superknet.com 。地址前缀是主网 `xpa1r`，退役测试网 A 是 `txa1r`。仓库说明里的 macOS 14 及以上是编译这套程序的要求，不是对每一台 Mac 的兼容测试。",
        "## 主网要填的几项",
        "MMM 主网页的设置是：网络选 Mainnet；浏览器 `https://superknet.com`；矿池 `pool.xcoinminer.com`（页上同时写了 `172.96.186.49`），端口 `3335`；Worker 自定，例如 `mbp-m3`；密码留空；收益地址是你的 `xpa1r…`。项目站的挖矿三步与此相同，并写明地址前缀表示后量子主网地址，没有另一种主网地址。MMM 页写明开始挖矿前会校验地址，且不会静默把测试网设置换成主网：必须在 Setup 里自己改成 Mainnet。私钥和助记词两边都说不要提供；本页也不接受。",
        "地址要整串复制。前缀 `xpa1r` 只说明它看起来像主网；还要通过 MMM 和本站的地址校验。退役测试网 A 的 `txa1r` 不能贴到主网监控。测试网账本如何作废，见 [主网和退役测试网](/learn/xid-mainnet-vs-testnet)。",
        "## 保存地址之后页面给你什么",
        "名额按每个项目已保存的设备记录计算，不是按钱包地址计算。每个项目免费 3 台已保存设备，Pro 为 100 台。自动出现在名单上的 Worker 不新增记录；另外把 Worker 设备存进监控，才会占用名额。同一台设备上对同一项目的多次绑定不额外占用。登录 Google 后，这份名单可以在设备之间同步；未登录时只留在当前浏览器。查询本身不会自动变成已保存。配对代理只控制 Train at Home 那台 Mac，不能开关 MMM。免费的 AI 崩溃分析也不是 XID 收益报告。",
        "地址卡片上有浏览器余额和链上归因出块数，下面是该地址在已读取名单里的 Worker：矿池估算算力、矿工上报算力、接受份额、最近活动（UTC+8）。全网卡片另有链上估算算力和已观测矿池算力。可见 Worker 不是全网机器台数。缺的格子保持空白，空白不是 0。",
        "举例（虚构，用来看顺序，不是某次实测）：你在 MMM 填了 Mainnet、`pool.xcoinminer.com:3335`、Worker `studio`、完整 `xpa1r…` 地址。监控里出现同名 Worker，矿池估算 6.2 MH/s。这只说明名单里有这一行。它不证明菜单栏里的数字相同，也不证明币已经成熟可花。项目站把一台 Apple M3 Pro 的 8.61 MH/s 写成主网会话示例；MMM 页把 42.8 MH/s 标成视觉样例。两者都是官网自己标出的样例，不是你这台机器的读数。",
        "## 下一步和做不到的事",
        "若保存后没有 Worker，先核对矿池是否就是当前主网说明里的那一个，再看最近获取时间。来源把矿池标成旧数据时，刷新成功也不等于记录已更新。继续看 [算力、份额和最近活动](/learn/xid-worker-hashrate-shares)。本页不承诺日收益、不把算力换成 XID 或美元，也不代替官方钱包检查 1,000 个区块的 coinbase 成熟。",
      ],
      [
        "要看的是 xCoin 主網上、用 Mac Metal Miner（MMM）挖到的公開紀錄。XID 是代幣，MMM 是礦工程式，不是第二種幣。開啟 [XID / MMM 監控](/projects/xid) 之前，先在 Mac 上把 MMM 配到主網。網頁只儲存公開收益地址並讀取瀏覽器已有紀錄，不會在這台 Mac 上開始或停止挖礦，也不讀取選單列的溫度、功耗或本機瞬時算力。",
        "下載前核對來源。xCoin 專案站和 MMM 主網頁都指向 [SystemThreat/MMM](https://github.com/SystemThreat/MMM)。搜尋 MMM 會出現其他幣的同名程式。以倉庫目前說明和發布為準。專案站寫明主網自 2026-09-26 00:00 UTC 創世起運行，瀏覽器為 https://superknet.com 。地址前綴是主網 `xpa1r`，退役測試網 A 是 `txa1r`。倉庫說明裡的 macOS 14 及以上是編譯這套程式的要求，不是對每一台 Mac 的相容測試。以倉庫目前說明和發布為準，不要沿用舊教程裡的測試網主機、連接埠或地址。",
        "## 主網要填的幾項",
        "MMM 主網頁的設定是：網路選 Mainnet；瀏覽器 `https://superknet.com`；礦池 `pool.xcoinminer.com`（頁上同時寫了 `172.96.186.49`），連接埠 `3335`；Worker 自訂，例如 `mbp-m3`；密碼留空；收益地址是你的 `xpa1r…`。專案站的挖礦三步與此相同，並寫明地址前綴表示後量子主網地址，沒有另一種主網地址。MMM 頁寫明開始挖礦前會校驗地址，且不會靜默把測試網設定換成主網：必須在 Setup 裡自己改成 Mainnet。私鑰和助記詞兩邊都說不要提供；本頁也不接受。",
        "地址要整串複製。前綴 `xpa1r` 只說明它看起來像主網；還要通過 MMM 和本站的地址校驗。退役測試網 A 的 `txa1r` 不能貼到主網監控。測試網帳本如何作廢，見 [主網和退役測試網](/learn/xid-mainnet-vs-testnet)。",
        "## 儲存地址之後頁面給你什麼",
        "名額按每個專案已儲存的裝置紀錄計算，不是按錢包地址計算。每個專案免費 3 台已儲存裝置，Pro 為 100 台。自動出現在名單上的 Worker 不新增紀錄；另外把 Worker 裝置存進監控，才會占用名額。同一台裝置上對同一專案的多次綁定不額外占用。登入 Google 後，這份名單可以在裝置之間同步；未登入時只留在目前瀏覽器。查詢本身不會自動變成已儲存。配對代理只控制 Train at Home 那台 Mac，不能開關 MMM。免費的 AI 當機分析也不是 XID 收益報告。",
        "地址卡片上有瀏覽器餘額和鏈上歸因出塊數，下面是該地址在已讀取名單裡的 Worker：礦池估算算力、礦工回報算力、接受份額、最近活動（UTC+8）。全網卡片另有鏈上估算算力和已觀測礦池算力。可見 Worker 不是全網機器台數。缺的格子保持空白，空白不是 0。",
        "舉例（虛構，用來看順序，不是某次實測）：你在 MMM 填了 Mainnet、`pool.xcoinminer.com:3335`、Worker `studio`、完整 `xpa1r…` 地址。監控裡出現同名 Worker，礦池估算 6.2 MH/s。這只說明名單裡有這一行。它不證明選單列裡的數字相同，也不證明幣已經成熟可花。專案站把一台 Apple M3 Pro 的 8.61 MH/s 寫成主網工作階段示例；MMM 頁把 42.8 MH/s 標成視覺樣例。兩者都是官網自己標出的樣例，不是你這台機器的讀數。",
        "## 下一步和做不到的事",
        "若儲存後沒有 Worker，先核對礦池是否就是目前主網說明裡的那一個，再看最近取得時間。來源把礦池標成舊資料時，重新整理成功也不等於紀錄已更新。繼續看 [算力、份額和最近活動](/learn/xid-worker-hashrate-shares)。本頁不承諾日收益、不把算力換成 XID 或美元，也不代替官方錢包檢查 1,000 個區塊的 coinbase 成熟。",
      ],
      [
        "The record you want is public xCoin mainnet work from Mac Metal Miner (MMM). XID is the token name. MMM is the miner application, not a second coin. Before you open [XID / MMM monitoring](/projects/xid), point MMM at mainnet on the Mac. The page stores a public payout address and reads records the explorer already publishes. It does not start or stop mining, and it does not read menu-bar temperature, power, or the live hashrate on that Mac.",
        "Check the download before you install. Both the xCoin project site and the MMM mainnet page point at [SystemThreat/MMM](https://github.com/SystemThreat/MMM). A search for MMM also returns miners for other coins. Use the current repository notes and release, not an old tutorial’s testnet host, port, or address. The project site says mainnet has been live since genesis on 2026-09-26 at 00:00 UTC, with the explorer at https://superknet.com . Mainnet addresses use the prefix `xpa1r`. Retired testnet A uses `txa1r`. The repository note that macOS 14 or later is required is a build requirement, not a test that every Mac can run the miner.",
        "## Values the mainnet setup asks for",
        "The MMM mainnet page lists: Network Mainnet; explorer `https://superknet.com`; pool `pool.xcoinminer.com` (the page also prints `172.96.186.49`), port `3335`; a Worker name you choose, for example `mbp-m3`; password left blank; payout your `xpa1r…` address. The project site’s three mining steps match that list and say the prefix is the post-quantum mainnet address, with no other mainnet kind. The MMM page says the app validates the address before start, and that it will not silently replace testnet settings: you switch Network to Mainnet yourself. Neither page asks for a seed phrase or a private key. This monitor does not accept them either.",
        "Copy the whole address. The prefix `xpa1r` only means it looks like mainnet; MMM and this site still have to accept the full string. A retired testnet A address starting with `txa1r` does not belong on the mainnet monitor. How that ledger was retired is in [mainnet and the retired testnet](/learn/xid-mainnet-vs-testnet).",
        "## What the page shows after you save the address",
        "The quota counts distinct saved device records for each project, not wallet addresses. Free allows three saved devices per project; Pro allows 100. Workers that appear automatically do not add a record. Saving a Worker device yourself can use a slot. Several bindings of the same project on the same device do not use extra quota. Google sign-in can sync that list across devices. Without sign-in it stays in this browser. A lookup does not save by itself. The paired agent controls a Train at Home Mac only. It cannot start or stop MMM. Free AI crash analysis is not an XID earnings report.",
        "An address card shows the explorer balance and chain-attributed blocks, then Workers from the fetched list: pool-estimated hashrate, miner-reported hashrate, accepted shares, and last activity in UTC+8. The network card separately shows estimated chain hashrate and observed pool hashrate. Visible workers are not a count of every machine on the network. A blank cell stays blank. Blank is not zero.",
        "Illustrative case, not a measurement: MMM is set to Mainnet, `pool.xcoinminer.com:3335`, Worker `studio`, and a full `xpa1r…` address. The monitor then lists that Worker at a pool estimate of 6.2 MH/s. That only means the fetched list has this row. It does not mean the menu bar shows the same number, and it does not mean coins are mature enough to spend. The project site’s 8.61 MH/s Apple M3 Pro session and the MMM page’s 42.8 MH/s figure are their own labelled samples. Neither is a reading from your Mac.",
        "## Next step and limits",
        "If no Worker appears after you save the address, confirm the pool is the one in the current mainnet instructions, then read the last fetch time. When the source marks pool data stale, a successful refresh does not make the record current. Continue with [hashrate, shares, and last activity](/learn/xid-worker-hashrate-shares). This page does not promise a daily income, does not convert hashrate into XID or dollars, and does not replace the official wallet’s check that a coinbase waits 1,000 blocks before it can be spent.",
      ],
      [
        "보려는 기록은 Mac Metal Miner(MMM)로 캔 xCoin 메인넷 공개 기록입니다. XID는 토큰 이름이고 MMM은 채굴 앱이며 두 번째 코인이 아닙니다. [XID / MMM 모니터](/projects/xid)를 열기 전에 Mac의 MMM을 메인넷으로 맞추세요. 페이지는 공개 보상 주소를 저장하고 탐색기가 이미 공개한 기록을 읽습니다. Mac에서 채굴을 켜거나 끄지 않으며, 메뉴 막대의 온도·전력·순간 해시레이트도 읽지 않습니다.",
        "설치 전에 출처를 확인합니다. xCoin 프로젝트 사이트와 MMM 메인넷 페이지는 [SystemThreat/MMM](https://github.com/SystemThreat/MMM)을 가리킵니다. MMM 검색에는 다른 코인 채굴기도 나옵니다. 프로젝트 사이트는 메인넷이 2026-09-26 00:00 UTC 제네시스부터 동작하고 탐색기는 https://superknet.com 이라고 적습니다. 메인넷 접두사는 `xpa1r`, 종료된 테스트넷 A는 `txa1r`입니다. 저장소 설명의 macOS 14 이상은 이 프로그램을 빌드하는 요건이며, 모든 Mac에서 동작한다는 시험이 아닙니다. 저장소의 현재 설명과 릴리스를 따르고, 옛 튜토리얼의 테스트넷 호스트·포트·주소는 쓰지 마세요.",
        "## 메인넷에 넣을 값",
        "MMM 메인넷 페이지의 값은 다음과 같습니다. 네트워크는 Mainnet, 탐색기는 `https://superknet.com`, 풀은 `pool.xcoinminer.com`(`172.96.186.49`도 적혀 있음), 포트는 `3335`, Worker 이름은 예 `mbp-m3`, 비밀번호는 비움, 보상 주소는 `xpa1r…`입니다. 프로젝트 사이트의 채굴 세 단계도 같고, 접두사가 후양자 메인넷 주소이며 다른 메인넷 주소는 없다고 합니다. 시작 전에 주소를 검사하고, 테스트넷 설정을 조용히 메인넷으로 바꾸지 않습니다. Setup에서 직접 Mainnet으로 바꿔야 합니다. 시드와 비밀키는 어느 쪽도 요구하지 않으며 이 페이지도 받지 않습니다.",
        "주소는 전체를 복사합니다. 접두사 `xpa1r`는 메인넷처럼 보인다는 뜻일 뿐이며, MMM과 이 사이트의 주소 검사를 통과해야 합니다. 종료된 테스트넷 A의 `txa1r`는 메인넷 모니터에 넣지 않습니다. 그 원장이 어떻게 끝났는지는 [메인넷과 종료된 테스트넷](/learn/xid-mainnet-vs-testnet)에 있습니다.",
        "## 주소를 저장한 뒤 보이는 것",
        "한도는 지갑 주소가 아니라, 프로젝트별로 저장한 서로 다른 기기 기록으로 셉니다. 프로젝트마다 무료 3대, Pro는 100대입니다. 자동으로 보이는 Worker는 기록을 추가하지 않습니다. Worker 기기를 따로 저장하면 칸을 쓸 수 있습니다. 같은 기기에서 같은 프로젝트를 여러 번 묶어도 추가 한도를 쓰지 않습니다. Google 로그인 후 목록이 동기화되고, 로그인하지 않으면 이 브라우저에만 남습니다. 조회만으로는 저장되지 않습니다. 페어링된 에이전트는 Train at Home Mac만 제어하며 MMM을 켜거나 끄지 않습니다. 무료 AI 크래시 분석은 XID 수익 보고서가 아닙니다.",
        "주소 카드에는 탐색기 잔액과 체인에 귀속된 블록 수가 있고, 그 아래 가져온 명단의 Worker가 있습니다. 풀 추정 해시레이트, 채굴기 보고 해시레이트, 수락 셰어, 최근 활동(UTC+8)입니다. 네트워크 카드에는 체인 추정 해시레이트와 관측된 풀 해시레이트가 따로 있습니다. 보이는 Worker는 네트워크 전체 기기 수가 아닙니다. 빈칸은 빈칸으로 남고 0이 아닙니다.",
        "예시(순서를 보기 위한 것이며 측정이 아님): MMM에 Mainnet, `pool.xcoinminer.com:3335`, Worker `studio`, 전체 `xpa1r…`를 넣었습니다. 모니터에 같은 이름의 Worker가 풀 추정 6.2 MH/s로 보입니다. 가져온 명단에 그 행이 있다는 뜻입니다. 메뉴 막대 숫자가 같다는 뜻도, 코인이 이미 성숙해 쓸 수 있다는 뜻도 아닙니다. 프로젝트 사이트의 Apple M3 Pro 8.61 MH/s와 MMM 페이지의 42.8 MH/s는 각 사이트가 붙인 샘플입니다. 이 기기의 읽기가 아닙니다.",
        "## 다음 단계와 한계",
        "저장 후 Worker가 없으면 풀이 현재 메인넷 안내의 그 풀인지 확인하고, 최근 조회 시각을 봅니다. 출처가 풀 데이터를 오래됐다고 표시하면, 새로고침이 성공해도 기록이 새로워진 것은 아닙니다. [해시레이트, 셰어, 최근 활동](/learn/xid-worker-hashrate-shares)으로 이어갑니다. 이 페이지는 일일 수익을 약속하지 않고, 해시레이트를 XID나 달러로 바꾸지 않으며, 코인베이스가 1,000블록 뒤에야 쓸 수 있다는 공식 지갑 확인을 대신하지 않습니다.",
      ],
      [
        "見たい記録は Mac Metal Miner（MMM）で掘る xCoin メインネットの公開記録です。XIDはトークン名、MMMはマイナーアプリで、別の通貨ではありません。[XID / MMM監視](/projects/xid)を開く前に、Mac上のMMMをメインネットへ向けます。ページは公開報酬アドレスを保存し、エクスプローラーが既に公開している記録を読みます。Macで採掘を開始・停止せず、メニューバーの温度・電力・瞬間ハッシュレートも読みません。",
        "入手前に配布元を確認します。xCoinのプロジェクトサイトとMMMのメインネットページは [SystemThreat/MMM](https://github.com/SystemThreat/MMM) を示します。MMMの検索には別コインのマイナーも出ます。プロジェクトサイトはメインネットが 2026-09-26 00:00 UTC のジェネシスから稼働し、エクスプローラーは https://superknet.com と書きます。メインネットの接頭辞は `xpa1r`、終了したテストネットAは `txa1r` です。リポジトリが書く macOS 14 以降は、このプログラムをビルドするための要件であり、すべての Mac で動くという試験ではありません。リポジトリの現行の説明とリリースに従い、古い手順のテストネット用ホスト、ポート、アドレスは使わないでください。",
        "## メインネットで入れる値",
        "MMMのメインネットページが求める値は次のとおりです。ネットワークは Mainnet、エクスプローラーは `https://superknet.com`、プールは `pool.xcoinminer.com`（`172.96.186.49` も記載）、ポートは `3335`、Worker名は例 `mbp-m3`、パスワードは空、報酬アドレスは `xpa1r…` です。プロジェクトサイトの採掘三手順も同じで、接頭辞はポスト量子のメインネットアドレスであり、別種のメインネットアドレスはないと書きます。開始前にアドレスを検証し、テストネット設定を黙って置き換えません。Setupで自分で Mainnet に切り替えます。シードや秘密鍵はどちらも求めず、このページも受け取りません。",
        "アドレスは全文をコピーします。接頭辞 `xpa1r` はメインネットに見えるという意味だけで、MMMとこのサイトのアドレス検査を通る必要があります。終了したテストネットAの `txa1r` はメインネット監視に置きません。その台帳がどう終わったかは [メインネットと終了したテストネット](/learn/xid-mainnet-vs-testnet) にあります。",
        "## アドレス保存後に見えるもの",
        "枠はウォレットアドレスではなく、プロジェクトごとに保存した別々の端末記録で数えます。プロジェクトごとに無料3台、Proは100台です。自動で表示されるWorkerは記録を増やしません。Worker端末を別に保存すると枠を使います。同じ端末で同じプロジェクトを何度バインドしても追加の枠は使いません。Googleログイン後は一覧を同期でき、未ログインではこのブラウザに残ります。照会だけでは保存されません。ペアのエージェントが制御するのは Train at Home の Mac だけで、MMMの開始・停止はできません。無料のAIクラッシュ分析はXIDの収益報告ではありません。",
        "アドレスカードにはエクスプローラー残高とチェーン帰属ブロック数があり、その下に取得済み名簿のWorkerがあります。プール推定算力、マイナー報告算力、受理シェア、最終活動（UTC+8）です。ネットワークカードにはチェーン推定算力と観測済みプール算力が別です。見えるWorkerはネットワーク全体の台数ではありません。空欄は空欄のままで、0ではありません。",
        "例（順序を見るためのもので、実測ではない）: MMMに Mainnet、`pool.xcoinminer.com:3335`、Worker `studio`、完全な `xpa1r…` を入れます。監視に同名のWorkerがプール推定 6.2 MH/s で出ます。取得した名簿にその行があるという意味です。メニューバーの数字が同じことでも、コインが成熟して使えることでもありません。プロジェクトサイトの Apple M3 Pro 8.61 MH/s と MMMページの 42.8 MH/s は、各サイトが付けた見本です。この機械の読み取りではありません。",
        "## 次の手順と限界",
        "保存後にWorkerが無いときは、プールが現行メインネット案内のものかを確認し、最終取得時刻を見ます。ソースがプールを古いと印しているとき、更新が成功しても記録が新しくなったことにはなりません。[ハッシュレート、シェア、最終活動](/learn/xid-worker-hashrate-shares)へ進んでください。このページは日次収入を約束せず、算力をXIDやドルに換えず、コインベースが1,000ブロック後に使えるという公式ウォレットの確認も代行しません。",
      ],
    ),
    questions: questions([
      [
        text(
          "MMM 和 XID 是两种币吗？",
          "MMM 和 XID 是兩種幣嗎？",
          "Are MMM and XID two currencies?",
          "MMM과 XID는 두 개의 코인가요?",
          "MMMとXIDは二つの通貨ですか？",
        ),
        text(
          "不是。这里 MMM 是挖 XID 的 Mac 程序，XID 是 xCoin 主网代币。",
          "不是。這裡 MMM 是挖 XID 的 Mac 程式，XID 是 xCoin 主網代幣。",
          "No. Here MMM is the Mac application that mines XID, and XID is the xCoin mainnet token.",
          "아니요. 여기서 MMM은 XID를 캐는 Mac 앱이고 XID는 xCoin 메인넷 토큰입니다.",
          "いいえ。ここでのMMMはXIDを掘るMacアプリで、XIDはxCoinメインネットのトークンです。",
        ),
      ],
      [
        text(
          "监控能替我打开 MMM 吗？",
          "監控能替我打開 MMM 嗎？",
          "Can the monitor start MMM for me?",
          "모니터가 MMM을 대신 켜 주나요?",
          "監視はMMMを代わりに起動しますか？",
        ),
        text(
          "不能。挖矿只在你自己的 MMM 里开始。本页只读公开地址的已有记录。",
          "不能。挖礦只在你自己的 MMM 裡開始。本頁只讀公開地址的已有紀錄。",
          "No. Mining starts only in your own MMM. This page reads existing public records for an address.",
          "아니요. 채굴은 본인 MMM에서만 시작합니다. 이 페이지는 주소의 기존 공개 기록만 읽습니다.",
          "いいえ。採掘は自分のMMMでのみ開始します。このページはアドレスの既存の公開記録を読むだけです。",
        ),
      ],
      [
        text(
          "旧教程里的测试网端口还能用吗？",
          "舊教學裡的測試網連接埠還能用嗎？",
          "Can I reuse a testnet port from an old tutorial?",
          "예전 튜토리얼의 테스트넷 포트를 써도 되나요?",
          "古い手順のテストネットポートを使えますか？",
        ),
        text(
          "不要沿用。当前 MMM 主网页写的是 pool.xcoinminer.com，端口 3335。之后若官网改了，以你打开的当前页为准。",
          "不要沿用。目前 MMM 主網頁寫的是 pool.xcoinminer.com，連接埠 3335。之後若官網改了，以你打開的當前頁為準。",
          "No. The current MMM mainnet page says pool.xcoinminer.com port 3335. If that page changes later, follow the page you open then.",
          "아니요. 현재 MMM 메인넷 페이지는 pool.xcoinminer.com 포트 3335입니다. 이후 페이지가 바뀌면 그때 연 페이지를 따르세요.",
          "いいえ。現行のMMMメインネットページは pool.xcoinminer.com のポート 3335 です。その後ページが変わったら、そのとき開いたページに従ってください。",
        ),
      ],
    ]),
  },
  {
    slug: hashrate,
    project: "xid",
    published: "2026-10-03",
    modified: "2026-10-24",
    topic: text(
      "读三种算力",
      "讀三種算力",
      "Read three hashrates",
      "세 가지 해시레이트",
      "三つの算力を読む",
    ),
    title: text(
      "XID / MMM 算力怎么看：Worker、份额与最近活动",
      "XID / MMM 算力怎麼看：Worker、份額與最近活動",
      "XID / MMM hashrate: workers, shares and last activity",
      "XID / MMM 해시레이트: 워커, 셰어, 최근 활동",
      "XID / MMMのハッシュレート：ワーカー、シェア、最終活動",
    ),
    description: text(
      "同一地址上，矿池估算、矿工上报和链上估算可以同时不同。份额是矿池接受的工作，不是已到账的 XID。Worker 名称不能当成机器台数。",
      "同一地址上，礦池估算、礦工回報和鏈上估算可以同時不同。份額是礦池接受的工作，不是已到帳的 XID。Worker 名稱不能當成機器台數。",
      "On one address, the pool estimate, the miner report and the chain estimate can differ at the same time. Shares are accepted work, not XID received. A Worker name is not a machine count.",
      "한 주소에서 풀 추정, 채굴기 보고, 체인 추정은 동시에 다를 수 있습니다. 셰어는 수락된 작업이지 받은 XID가 아닙니다. Worker 이름은 기기 수가 아닙니다.",
      "一つのアドレスで、プール推定、マイナー報告、チェーン推定は同時に異なり得ます。シェアは受理された仕事であり、受け取ったXIDではありません。Worker名は台数ではありません。",
    ),
    summary: text(
      "先看单位和时间，再看是哪一种算力。矿池估算来自已读取名单，矿工上报是另一列，链上估算在全网卡片上，三者不要相加。",
      "先看單位和時間，再看是哪一種算力。礦池估算來自已讀取名單，礦工回報是另一欄，鏈上估算在全網卡片上，三者不要相加。",
      "Read the unit and the time, then which hashrate it is. The pool estimate is a column on the fetched list, the miner report is another column, and the chain estimate is on the network card. Do not add them.",
      "단위와 시각을 본 다음 어떤 해시레이트인지 봅니다. 풀 추정과 채굴기 보고는 다른 열이고 체인 추정은 네트워크 카드에 있습니다. 더하지 마세요.",
      "単位と時刻を見てから、どの算力かを見ます。プール推定とマイナー報告は別の列、チェーン推定はネットワークカードです。足さないでください。",
    ),
    sources: [mmm, repo, watch],
    related: [setup, offline],
    comparisonTitle: text(
      "三种算力各回答什么",
      "三種算力各回答什麼",
      "What each hashrate answers",
      "세 해시레이트가 답하는 것",
      "三つの算力が答えること",
    ),
    comparison: table(
      {
        headers: ["页面上的数", "它回答什么", "它不回答什么"],
        rows: [
          ["矿池估算算力", "已读取名单里，矿池对这个 Worker 的估算", "不是菜单栏里的本机瞬时值"],
          ["矿工上报算力", "来源里该 Worker 自己报的算力", "不是链上全网算力"],
          ["链上估算算力", "浏览器给出的全网估算", "不是你这台 Mac 的速度"],
          ["已观测矿池算力", "来源观测到的矿池合计", "不是可见 Worker 相加后的证明"],
          ["接受份额", "矿池记下的已接受工作", "不是成熟可花的 XID"],
        ],
      },
      {
        headers: ["頁面上的數", "它回答什麼", "它不回答什麼"],
        rows: [
          ["礦池估算算力", "已讀取名單裡，礦池對這個 Worker 的估算", "不是選單列裡的本機瞬時值"],
          ["礦工回報算力", "來源裡該 Worker 自己報的算力", "不是鏈上全網算力"],
          ["鏈上估算算力", "瀏覽器給出的全網估算", "不是你這台 Mac 的速度"],
          ["已觀測礦池算力", "來源觀測到的礦池合計", "不是可見 Worker 相加後的證明"],
          ["接受份額", "礦池記下的已接受工作", "不是成熟可花的 XID"],
        ],
      },
      {
        headers: ["Figure", "What it answers", "What it does not answer"],
        rows: [
          [
            "Pool-estimated hashrate",
            "The pool’s estimate for this Worker on the fetched list",
            "Not the live menu-bar number on the Mac",
          ],
          [
            "Miner-reported hashrate",
            "The hashrate that Worker reported in the source",
            "Not the chain-wide estimate",
          ],
          ["Estimated chain hashrate", "The explorer’s network estimate", "Not this Mac’s speed"],
          [
            "Observed pool hashrate",
            "The pool total the source observed",
            "Not a proof that visible Workers add up to it",
          ],
          ["Accepted shares", "Work the pool recorded as accepted", "Not mature, spendable XID"],
        ],
      },
      {
        headers: ["화면의 수", "답하는 것", "답하지 않는 것"],
        rows: [
          [
            "풀 추정 해시레이트",
            "가져온 목록에서 이 Worker에 대한 풀 추정",
            "Mac 메뉴 막대의 순간값이 아님",
          ],
          ["채굴기 보고 해시레이트", "출처에서 그 Worker가 보고한 값", "체인 전체 추정이 아님"],
          ["온체인 추정 해시레이트", "탐색기가 준 네트워크 추정", "이 Mac의 속도가 아님"],
          [
            "관측된 풀 해시레이트",
            "출처가 관측한 풀 합계",
            "보이는 Worker를 더하면 그 값이라는 증거가 아님",
          ],
          ["수락 셰어", "풀이 수락으로 기록한 작업", "성숙해 쓸 수 있는 XID가 아님"],
        ],
      },
      {
        headers: ["画面の数", "答えること", "答えないこと"],
        rows: [
          [
            "プール推定算力",
            "取得した一覧での、このWorkerへのプール推定",
            "Macのメニューバーの瞬間値ではない",
          ],
          ["マイナー報告算力", "ソースでそのWorkerが報告した値", "チェーン全体の推定ではない"],
          ["オンチェーン推定算力", "エクスプローラーのネットワーク推定", "このMacの速度ではない"],
          [
            "観測プール算力",
            "ソースが観測したプール合計",
            "見えるWorkerを足すとその値、という証明ではない",
          ],
          ["受理シェア", "プールが受理として記録した仕事", "成熟して使えるXIDではない"],
        ],
      },
    ),
    body: paras(
      [
        "打开 [XID / MMM 监控](/projects/xid)，用已经在 MMM 里挖主网的那串 `xpa1r` 地址。这一页要回答的是：名单上的算力、份额和最近活动各是什么，而不是今天能拿到多少币。本机菜单栏的数字留在 MMM 里；网站不采集它。",
        "## 先对齐单位和时间",
        "Worker 表用 MH/s。数值达到 1,000 MH/s 时，同一格改标成 GH/s，因为 1 GH/s 等于 1,000 MH/s。比较之前先看单位，再看最近获取时间。来源把矿池标成旧数据时，页面会注明；这时数字仍是上一次来源记录，不是刚刚从 Mac 读出来的。MMM 主网页写，开始挖矿后 Worker 会在大约一分钟内出现在 superknet.com 的矿工名单，菜单栏镐形图标显示本机算力和份额。那是他们对本机界面和浏览器名单的说明。本站只显示已读到的公开名单。",
        "## 每一列怎么用",
        "矿池估算算力是名单上矿池给这个 Worker 的估算。矿工上报算力是同一行里矿工自己报的数。两列可以一个有数、一个空白。空白不是 0，也不表示另一列错了。接受份额是矿池接受的工作计数，不是出块，也不是余额。最近活动按 UTC+8 显示。Worker 名字是你在 MMM 里填的标签，可以改、可以复用；两台 Mac 也可以共用一个收益地址。名字不能证明芯片型号或机主。",
        "全网卡片上的链上估算算力，和已观测矿池算力，是另外两个口径。可见活跃 Worker 的人数不是全网设备数。页面说明写明：Worker 数据覆盖浏览器观测到的矿池，不是每一个矿工。不要把某个 Worker 的 MH/s 和链上估算相加。",
        "举例（虚构）：地址下 Worker `mbp-m3` 的矿池估算是 8.6 MH/s，矿工上报为空白，接受份额 120，最近活动是 4 分钟前。同一屏链上估算是 900 MH/s，已观测矿池是 40 MH/s。正确读法是三件事分开：这名 Worker 的矿池估算是 8.6 MH/s；它没有上报数；全网估算是另一套数字。把 8.6 和 900 加成 908.6，或把空白上报当成 0 再相减，都读错了。项目站上的 8.61 MH/s 是他们标注的 M3 Pro 会话示例，不是这个虚构例子，也不是你这台机器的读数。",
        "## 分支",
        "只有上报、没有矿池估算：来源这次没有给出矿池估算，不能单独当成机器已停。只有份额、算力空白：有接受记录，但这一时刻没有估算值。两列都空白且没有这一行：见 [Worker 不在名单时的检查](/learn/xid-worker-offline-checklist)。份额增加而余额不动：份额还不是可花费的币，余额的含义见 [收益和余额](/learn/xid-rewards-balance-maturity)。",
        "本页不能把算力换成每天的 XID，不能使用项目站计算器里的“一台 Mac 9 MH/s、一台 GPU 机 145 MH/s”当作你的机器，那些是他们计算器的示例输入。也不保证份额窗口之后一定出块。",
      ],
      [
        "開啟 [XID / MMM 監控](/projects/xid)，用已經在 MMM 裡挖主網的那串 `xpa1r` 地址。這一頁要回答的是：名單上的算力、份額和最近活動各是什麼，而不是今天能拿到多少幣。本機選單列的數字留在 MMM 裡；網站不採集它。",
        "## 先對齊單位和時間",
        "Worker 表用 MH/s。數值達到 1,000 MH/s 時，同一格改標成 GH/s，因為 1 GH/s 等於 1,000 MH/s。比較之前先看單位，再看最近取得時間。來源把礦池標成舊資料時，頁面會註明；這時數字仍是上一次來源紀錄，不是剛剛從 Mac 讀出來的。MMM 主網頁寫，開始挖礦後 Worker 會在大約一分鐘內出現在 superknet.com 的礦工名單，選單列鎬形圖示顯示本機算力和份額。那是他們對本機介面和瀏覽器名單的說明。本站只顯示已讀到的公開名單。",
        "## 每一欄怎麼用",
        "礦池估算算力是名單上礦池給這個 Worker 的估算。礦工回報算力是同一列裡礦工自己報的數。兩欄可以一個有數、一個空白。空白不是 0，也不表示另一欄錯了。接受份額是礦池接受的工作計數，不是出塊，也不是餘額。最近活動按 UTC+8 顯示。Worker 名字是你在 MMM 裡填的標籤，可以改、可以複用；兩台 Mac 也可以共用一個收益地址。名字不能證明晶片型號或機主。",
        "全網卡片上的鏈上估算算力，和已觀測礦池算力，是另外兩個口徑。可見活躍 Worker 的人數不是全網設備數。頁面說明寫明：Worker 資料覆蓋瀏覽器觀測到的礦池，不是每一個礦工。不要把某個 Worker 的 MH/s 和鏈上估算相加。",
        "舉例（虛構）：地址下 Worker `mbp-m3` 的礦池估算是 8.6 MH/s，礦工回報為空白，接受份額 120，最近活動是 4 分鐘前。同一屏鏈上估算是 900 MH/s，已觀測礦池是 40 MH/s。正確讀法是三件事分開：這名 Worker 的礦池估算是 8.6 MH/s；它沒有回報數；全網估算是另一套數字。把 8.6 和 900 加成 908.6，或把空白回報當成 0 再相減，都讀錯了。專案站上的 8.61 MH/s 是他們標註的 M3 Pro 工作階段示例，不是這個虛構例子，也不是你這台機器的讀數。",
        "## 分支",
        "只有回報、沒有礦池估算：來源這次沒有給出礦池估算，不能單獨當成機器已停。只有份額、算力空白：有接受紀錄，但這一時刻沒有估算值。兩欄都空白且沒有這一列：見 [Worker 不在名單時的檢查](/learn/xid-worker-offline-checklist)。份額增加而餘額不動：份額還不是可花費的幣，餘額的含義見 [收益和餘額](/learn/xid-rewards-balance-maturity)。",
        "本頁不能把算力換成每天的 XID，不能使用專案站計算器裡的「一台 Mac 9 MH/s、一台 GPU 機 145 MH/s」當作你的機器，那些是他們計算器的示例輸入。也不保證份額視窗之後一定出塊。",
      ],
      [
        "Open [XID / MMM monitoring](/projects/xid) with the `xpa1r` address already mining mainnet in MMM. This page answers what the listed hashrate, the shares and the last activity each mean. It does not answer how much coin you will receive today. The menu-bar number stays in MMM. This website does not collect it.",
        "## Match the unit and the time first",
        "The Worker table prints MH/s. When the figure reaches 1,000 MH/s, that same cell is labelled GH/s, because 1 GH/s is 1,000 MH/s. Read the unit, then the last fetch time, before you compare. If the source marks pool data stale, the page says so. Those numbers remain the previous source record. They were not just read from the Mac. The MMM mainnet page says that after you start, the Worker shows on the superknet.com miner list within about a minute, and the menu-bar pickaxe shows local hashrate and shares. That is their statement about the Mac UI and their explorer list. This site shows only the public list it fetched.",
        "## How to use each column",
        "Pool-estimated hashrate is the pool’s estimate for that Worker on the list. Miner-reported hashrate is the number the Worker reported on the same row. One column can have a figure while the other is blank. Blank is not zero, and it does not mean the other column is wrong. Accepted shares are work the pool recorded as accepted. They are not a found block and not a balance. Last activity is shown in UTC+8. The Worker name is the label you typed in MMM. It can change or be reused, and two Macs can share one payout address. The name does not prove a chip model or an owner.",
        "Estimated chain hashrate and observed pool hashrate sit on the network card. They are two further readings. The count of visible active workers is not the number of machines on the network. The page states that Worker data covers pools the explorer observed, not every miner. Do not add one Worker’s MH/s to the chain estimate.",
        "Illustrative case, not a measurement: Worker `mbp-m3` shows a pool estimate of 8.6 MH/s, a blank miner report, 120 accepted shares, and last activity 4 minutes ago. On the same screen the chain estimate is 900 MH/s and the observed pool is 40 MH/s. Read them as three facts: this Worker’s pool estimate is 8.6 MH/s, it has no reported figure, and the network estimate is a different number. Adding 8.6 to 900, or treating the blank report as zero and subtracting, misreads the row. The project site’s 8.61 MH/s is their labelled M3 Pro session, not this example and not a new measurement by this site.",
        "## Branches",
        "A report with no pool estimate means the source did not give a pool estimate this time. That alone does not show the machine stopped. Shares with a blank hashrate mean accepted work exists and this moment has no estimate. If the row is missing entirely, use [the checklist when a Worker is absent](/learn/xid-worker-offline-checklist). If shares rise while the balance does not, shares are not spendable coins yet. The balance is explained in [rewards and balance](/learn/xid-rewards-balance-maturity).",
        "This page cannot turn hashrate into XID per day. The project site’s calculator examples, a Mac at 9 MH/s and a GPU rig at 145 MH/s, are their sample inputs, not your machine. A share window does not guarantee a later block.",
      ],
      [
        "[XID / MMM 모니터](/projects/xid)를 MMM에서 이미 메인넷을 캐는 `xpa1r` 주소로 엽니다. 이 페이지는 목록의 해시레이트, 셰어, 최근 활동이 각각 무엇인지 답합니다. 오늘 받을 코인을 답하지 않습니다. 메뉴 막대 숫자는 MMM에 남고, 이 사이트는 수집하지 않습니다.",
        "## 단위와 시각을 먼저 맞춥니다",
        "Worker 표는 MH/s입니다. 1,000 MH/s에 닿으면 같은 칸이 GH/s로 바뀝니다. 1 GH/s는 1,000 MH/s이기 때문입니다. 비교 전에 단위를 보고, 그다음 최근 조회 시각을 봅니다. 출처가 풀 데이터를 오래됐다고 표시하면 페이지가 그렇게 적고, 그 숫자는 이전 출처 기록이며 방금 Mac에서 읽은 값이 아닙니다. MMM 메인넷 페이지는 시작 후 약 1분 안에 superknet.com 채굴자 목록에 Worker가 나오고, 메뉴 막대 곡괭이가 로컬 해시레이트와 셰어를 보여 준다고 합니다. 그것은 그들 UI와 탐색기 목록에 대한 말입니다. 이 사이트는 가져온 공개 목록만 보여 줍니다.",
        "## 각 열",
        "풀 추정 해시레이트는 명단에서 풀이 그 Worker에 준 추정입니다. 채굴기 보고 해시레이트는 같은 행에서 채굴기가 보고한 수입니다. 한쪽만 있고 다른 쪽이 비어 있을 수 있습니다. 빈칸은 0이 아니고, 다른 열이 틀렸다는 뜻도 아닙니다. 수락 셰어는 풀이 수락으로 기록한 작업 수이며 블록도 잔액도 아닙니다. 최근 활동은 UTC+8입니다. Worker 이름은 MMM에 넣은 라벨입니다. 바꿀 수 있고 다시 쓸 수 있으며, Mac 두 대가 보상 주소 하나를 공유할 수 있습니다. 이름은 칩 모델이나 소유자를 증명하지 않습니다.",
        "네트워크 카드의 체인 추정 해시레이트와 관측된 풀 해시레이트는 또 다른 두 가지 수치입니다. 보이는 활성 Worker 수는 네트워크 전체 기기 수가 아닙니다. 페이지는 Worker 데이터가 탐색기가 관측한 풀을 덮을 뿐 모든 채굴기를 덮지 않는다고 합니다. 어떤 Worker의 MH/s를 체인 추정에 더하지 마세요.",
        "예시(측정 아님): 주소 아래 Worker `mbp-m3`의 풀 추정은 8.6 MH/s, 채굴기 보고는 빈칸, 수락 셰어 120, 최근 활동은 4분 전입니다. 같은 화면의 체인 추정은 900 MH/s, 관측 풀은 40 MH/s입니다. 세 가지로 읽습니다. 이 Worker의 풀 추정은 8.6 MH/s이고, 보고값은 없으며, 네트워크 추정은 다른 숫자입니다. 8.6과 900을 908.6으로 더하거나, 빈 보고를 0으로 보고 빼면 잘못 읽은 것입니다. 프로젝트 사이트의 8.61 MH/s는 그들이 붙인 M3 Pro 세션 예시이며, 이 예시와도 이 기기의 읽기와도 다릅니다.",
        "## 분기",
        "보고만 있고 풀 추정이 없으면, 이번 출처가 풀 추정을 주지 않은 것입니다. 그것만으로 기기가 멈춘 것이 아닙니다. 셰어만 있고 해시레이트가 빈칸이면 수락 기록은 있고 이 순간의 추정은 없습니다. 두 열이 빈칸이고 행 자체가 없으면 [Worker가 없을 때의 점검](/learn/xid-worker-offline-checklist)을 보세요. 셰어는 늘고 잔액이 그대로면 셰어는 아직 쓸 수 있는 코인이 아닙니다. 잔액은 [보상과 잔액](/learn/xid-rewards-balance-maturity)에 있습니다.",
        "이 페이지는 해시레이트를 하루의 XID로 바꾸지 않습니다. 프로젝트 사이트 계산기의 “Mac 한 대 9 MH/s, GPU 한 대 145 MH/s”는 그들의 예시 입력이며 당신 기기가 아닙니다. 셰어 구간 뒤에 블록이 나온다고 보장하지도 않습니다.",
      ],
      [
        "[XID / MMM監視](/projects/xid)を、MMMで既にメインネットを掘っている `xpa1r` アドレスで開きます。このページは、一覧の算力・シェア・最終活動がそれぞれ何かを答えます。今日受け取るコインは答えません。メニューバーの数字はMMMに残り、このサイトは収集しません。",
        "## 単位と時刻を先に合わせる",
        "Worker表はMH/sです。1,000 MH/sに達すると同じマスはGH/sと表示されます。1 GH/sは1,000 MH/sだからです。比べる前に単位を見て、次に最終取得時刻を見ます。ソースがプールデータを古いと印したら、ページはその旨を示し、数字は前回のソース記録のままで、たった今Macから読んだ値ではありません。MMMのメインネットページは、開始後およそ1分でsuperknet.comのマイナー一覧にWorkerが出て、メニューバーのつるはしがローカルの算力とシェアを示すと書きます。それは彼らのUIとエクスプローラー一覧についての説明です。このサイトは取得した公開一覧だけを表示します。",
        "## 各列の使い方",
        "プール推定算力は、名簿上でプールがそのWorkerに付けた推定です。マイナー報告算力は同じ行でマイナー自身が報告した数です。一方だけ数値で他方が空欄でも成り立ちます。空欄は0ではなく、もう一方の列が誤りだという意味でもありません。受理シェアはプールが受理として記録した仕事の数で、ブロックでも残高でもありません。最終活動はUTC+8です。Worker名はMMMに入れたラベルです。変更も再利用もでき、Mac二台が一つの報酬アドレスを共有できます。名前はチップ型番や所有者を証明しません。",
        "ネットワークカードのチェーン推定算力と観測済みプール算力は、さらに別の二つの値です。見える稼働中Workerの数はネットワーク全体の台数ではありません。ページは、Workerデータがエクスプローラーの観測したプールを覆い、すべてのマイナーを覆うわけではないと書きます。あるWorkerのMH/sをチェーン推定に足さないでください。",
        "例（実測ではない）: アドレス下のWorker `mbp-m3` はプール推定 8.6 MH/s、マイナー報告は空欄、受理シェア 120、最終活動は4分前です。同じ画面のチェーン推定は 900 MH/s、観測プールは 40 MH/s です。三つに分けて読みます。このWorkerのプール推定は 8.6 MH/s、報告値は無く、ネットワーク推定は別の数字です。8.6と900を908.6に足すこと、空欄の報告を0として引くことは読み違いです。プロジェクトサイトの 8.61 MH/s は彼らが付けた M3 Pro のセッション例であり、この例でもこの機械の読み取りでもありません。",
        "## 分岐",
        "報告だけでプール推定が無いときは、今回ソースがプール推定を出していないという意味です。それだけでは機械が止まったことになりません。シェアだけで算力が空欄なら、受理記録はあり、この瞬間の推定は無いということです。両列が空欄で行自体が無いときは [Workerが無いときの確認](/learn/xid-worker-offline-checklist) を見てください。シェアが増えて残高が動かないとき、シェアはまだ使えるコインではありません。残高の意味は [報酬と残高](/learn/xid-rewards-balance-maturity) にあります。",
        "このページは算力を1日のXIDに換えません。プロジェクトサイトの計算機にある「Mac一台 9 MH/s、GPU機一台 145 MH/s」は彼らの入力例であり、あなたの機械ではありません。シェアの区間のあと必ずブロックが出る保証もしません。",
      ],
    ),
    questions: questions([
      [
        text(
          "矿池估算和菜单栏不一致，算错了吗？",
          "礦池估算和選單列不一致，算錯了嗎？",
          "The pool estimate disagrees with the menu bar. Is that an error?",
          "풀 추정과 메뉴 막대가 다릅니다. 오류인가요?",
          "プール推定とメニューバーが違います。誤りですか？",
        ),
        text(
          "不一定。两边不是同一次读数。菜单栏是 MMM 本机显示；这一列是已读取名单里的矿池估算。",
          "不一定。兩邊不是同一次讀數。選單列是 MMM 本機顯示；這一欄是已讀取名單裡的礦池估算。",
          "Not necessarily. They are not the same reading. The menu bar is MMM on the Mac. This column is the pool estimate on the fetched list.",
          "꼭 그렇지는 않습니다. 같은 측정이 아닙니다. 메뉴 막대는 Mac의 MMM이고, 이 열은 가져온 목록의 풀 추정입니다.",
          "必ずしも誤りではありません。同じ読み取りではありません。メニューバーはMac上のMMM、この列は取得した一覧のプール推定です。",
        ),
      ],
      [
        text(
          "份额变多，是不是已经赚到这么多 XID？",
          "份額變多，是不是已經賺到這麼多 XID？",
          "Do more shares mean that much XID is already earned?",
          "셰어가 늘면 그만큼 XID를 번 것인가요?",
          "シェアが増えると、その分のXIDを得たことになりますか？",
        ),
        text(
          "不是。份额是矿池接受的工作计数。可花的币还要看出块和 1,000 个区块的成熟。",
          "不是。份額是礦池接受的工作計數。可花的幣還要看出塊和 1,000 個區塊的成熟。",
          "No. Shares count accepted work. Spendable coins still depend on a block and on 1,000 blocks of maturity.",
          "아니요. 셰어는 수락된 작업의 수입니다. 쓸 수 있는 코인은 블록과 1,000블록 성숙이 필요합니다.",
          "いいえ。シェアは受理された仕事の数です。使えるコインにはブロックと1,000ブロックの成熟が必要です。",
        ),
      ],
      [
        text(
          "两个 Worker 是不是两台 Mac？",
          "兩個 Worker 是不是兩台 Mac？",
          "Do two Workers mean two Macs?",
          "Worker가 둘이면 Mac이 두 대인가요?",
          "Workerが二つならMacが二台ですか？",
        ),
        text(
          "不能这样数。名称是标签，可以改、复用，或由多台机器共用一个地址。",
          "不能這樣數。名稱是標籤，可以改、複用，或多台機器共用一個地址。",
          "You cannot count them that way. A name is a label. It can change, be reused, or be shared by more than one machine on one address.",
          "그렇게 세지 못합니다. 이름은 라벨이며 바뀌거나 재사용되거나, 한 주소를 여러 기기가 공유할 수 있습니다.",
          "その数え方はできません。名前はラベルで、変わり、再利用され、一つのアドレスを複数台が共有できます。",
        ),
      ],
    ]),
  },
  {
    slug: rewards,
    project: "xid",
    published: "2026-10-03",
    modified: "2026-10-24",
    topic: text(
      "余额还不能花",
      "餘額還不能花",
      "Balance is not yet spendable",
      "잔액이 곧 사용 가능은 아님",
      "残高はまだ使えないことがある",
    ),
    title: text(
      "XID 挖矿收益与余额：奖励成熟和出块如何区分",
      "XID 挖礦收益與餘額：獎勵成熟和出塊如何區分",
      "XID mining rewards vs balance: blocks and maturity",
      "XID 채굴 보상과 잔액: 블록과 성숙을 나누어 읽기",
      "XIDの採掘報酬と残高：ブロックと成熟の見分け",
    ),
    description: text(
      "浏览器余额不是累计挖矿收入。链上归因出块数是另一格。Coinbase 要等 1,000 个区块、大约 3.5 天才能花。两份官方文本对矿池是否分成的说法并不相同。",
      "瀏覽器餘額不是累計挖礦收入。鏈上歸因出塊數是另一格。Coinbase 要等 1,000 個區塊、大約 3.5 天才能花。兩份官方文本對礦池是否分成的說法並不相同。",
      "Explorer balance is not lifetime mining income. Chain-attributed blocks are a separate cell. A coinbase waits 1,000 blocks, about 3.5 days, before it can be spent. Two official texts disagree on whether the pool splits rewards.",
      "탐색기 잔액은 누적 채굴 수입이 아닙니다. 체인 귀속 블록 수는 다른 칸입니다. 코인베이스는 1,000블록, 약 3.5일 뒤에야 쓸 수 있습니다. 풀이 보상을 나누는지에 대해 공식 문서 두 곳이 다릅니다.",
      "エクスプローラー残高は累計採掘収入ではありません。チェーン帰属ブロック数は別のマスです。コインベースは1,000ブロック、約3.5日後に使えます。プールが報酬を分けるかについて、公式文書が二つ一致しません。",
    ),
    summary: text(
      "地址卡片上的余额来自浏览器，脚注写明它不是累计挖矿收益。出块数是链上归因的块数。能不能花，要到官方浏览器或钱包看 1,000 区块成熟。",
      "地址卡片上的餘額來自瀏覽器，註腳寫明它不是累計挖礦收益。出塊數是鏈上歸因的塊數。能不能花，要到官方瀏覽器或錢包看 1,000 區塊成熟。",
      "The balance on the address card comes from the explorer. The footnote says it is not lifetime mining income. The block count is chain-attributed. Spendability is the 1,000-block maturity check in the official explorer or wallet.",
      "주소 카드의 잔액은 탐색기에서 옵니다. 각주는 누적 채굴 수입이 아니라고 합니다. 블록 수는 체인 귀속입니다. 사용 가능 여부는 공식 탐색기나 지갑의 1,000블록 성숙으로 확인합니다.",
      "アドレスカードの残高はエクスプローラー由来です。注記は累計採掘収入ではないと書きます。ブロック数はチェーン帰属です。使えるかは公式エクスプローラーかウォレットの1,000ブロック成熟で確認します。",
    ),
    sources: [site, paper, mmm],
    related: [setup, nets],
    comparisonTitle: text(
      "余额、出块和成熟",
      "餘額、出塊和成熟",
      "Balance, blocks and maturity",
      "잔액, 블록, 성숙",
      "残高、ブロック、成熟",
    ),
    comparison: table(
      {
        headers: ["你看到的", "来源怎么说", "不能当成什么"],
        rows: [
          ["浏览器余额", "本站脚注：不是累计挖矿收益", "不是今天的收入，也不是已成熟可花"],
          ["链上归因出块", "该地址被归因的块数", "不是份额，也不是余额的组成"],
          [
            "1,000 区块成熟",
            "白皮书与项目站：约 3.5 天后才能花 coinbase",
            "本页不替你完成这笔检查",
          ],
          [
            "矿池分成",
            "白皮书写 solo、不分成；项目站计算器写 PPLNS 0.99%",
            "两份文本冲突时，不要选一个当成已核实费率",
          ],
        ],
      },
      {
        headers: ["你看到的", "來源怎麼說", "不能當成什麼"],
        rows: [
          ["瀏覽器餘額", "本站註腳：不是累計挖礦收益", "不是今天的收入，也不是已成熟可花"],
          ["鏈上歸因出塊", "該地址被歸因的塊數", "不是份額，也不是餘額的組成"],
          [
            "1,000 區塊成熟",
            "白皮書與專案站：約 3.5 天後才能花 coinbase",
            "本頁不替你完成這筆檢查",
          ],
          [
            "礦池分成",
            "白皮書寫 solo、不分成；專案站計算器寫 PPLNS 0.99%",
            "兩份文本衝突時，不要選一個當成已核實費率",
          ],
        ],
      },
      {
        headers: ["What you see", "What the source says", "What it is not"],
        rows: [
          [
            "Explorer balance",
            "Our footnote: not lifetime mining income",
            "Not today’s income, and not proven spendable",
          ],
          [
            "Chain-attributed blocks",
            "Blocks attributed to this address",
            "Not shares, and not a breakdown of the balance",
          ],
          [
            "1,000-block maturity",
            "Whitepaper and project site: coinbase spendable after about 3.5 days",
            "This page does not perform that check",
          ],
          [
            "Pool split",
            "Whitepaper says solo, nothing split; the project calculator says PPLNS 0.99%",
            "Do not pick one text and call it a verified fee",
          ],
        ],
      },
      {
        headers: ["보이는 것", "출처의 말", "아닌 것"],
        rows: [
          [
            "탐색기 잔액",
            "우리 각주: 누적 채굴 수입이 아님",
            "오늘 수입도, 사용 가능의 증명도 아님",
          ],
          ["체인 귀속 블록", "이 주소에 귀속된 블록 수", "셰어도, 잔액의 내역도 아님"],
          [
            "1,000블록 성숙",
            "백서와 프로젝트 사이트: 코인베이스는 약 3.5일 후 사용",
            "이 페이지가 그 확인을 대신하지 않음",
          ],
          [
            "풀 분배",
            "백서는 솔로·미분할; 계산기는 PPLNS 0.99%",
            "한쪽을 골라 확인된 수수료로 부르지 않음",
          ],
        ],
      },
      {
        headers: ["見えるもの", "ソースの説明", "そうではないもの"],
        rows: [
          [
            "エクスプローラー残高",
            "当サイトの注記: 累計採掘収入ではない",
            "今日の収入でも、使用可能の証明でもない",
          ],
          [
            "チェーン帰属ブロック",
            "このアドレスに帰属するブロック数",
            "シェアでも、残高の内訳でもない",
          ],
          [
            "1,000ブロックの成熟",
            "白書とプロジェクトサイト: コインベースは約3.5日後に使用可",
            "このページはその確認を代行しない",
          ],
          [
            "プールの分配",
            "白書はソロで分配なし; 計算機はPPLNS 0.99%",
            "一方を選んで確認済み手数料と呼ばない",
          ],
        ],
      },
    ),
    body: paras(
      [
        "在 [XID / MMM 监控](/projects/xid) 上，一个地址有两格钱和块：浏览器余额，以及链上归因出块数。卡片下面写着：余额不是累计挖矿收益；奖励是否成熟、能不能花，请到官方浏览器或钱包看。这一页不把两格相加，也不把它们换成美元。",
        "## 成熟规则以哪份文本为准",
        "这一点三份公开文本一致。项目站写：coinbase 奖励在 1,000 个区块、大约 3.5 天之后成熟，浏览器是 superknet.com。MMM 主网页写：挖到的块在 1,000 次确认后把奖励付给你的地址。白皮书（修订日期标为 2026-09-25）把主网 `COINBASE_MATURITY_MAINNET` 写成 1,000 个区块（约 3.5 天），并写退役测试网 A 同样是 1,000。白皮书还写 8 位小数，最小普通输出 10,000 sat（0.0001 XID）。项目站写硬顶 100,000,000 XID、8 位小数，以及预热：每段 20,000 块依次为 6.25、12.5、25 XID，然后从第 60,001 块到第 220,000 块为每块 50 XID。这些是发行规则的公开叙述，不是你的地址已经领到的金额。",
        "## 矿池是否分成：两份文本不一样",
        "白皮书写：`pool.xcoinminer.com:3335` 也是 solo、只付 coinbase；你挖到的块把 coinbase 直接付给你的地址；没有代持、没有分成、没有支付方案。项目站的计算器则把挖矿方式分成「Solo · 自有节点 · 0%」和「Pool · PPLNS · 0.99%」，并声明是按当日网络的期望值、不是承诺，且因为还没有市场所以不给美元。计算器文字与白皮书不是同一种矿池描述。本站不计算手续费，也不选其中一份当成已经核实的当前费率。白皮书修订日标在创世前一天，项目站计算器在主网上线之后的页面上。两份对矿池费率的说法不同，打开这两页对照即可。",
        "举例（虚构）：浏览器余额显示 12.50000000 XID，链上归因出块为空白。不能把空白读成 0 块，也不能把 12.5 说成今天挖到的、已经能转出的币。余额里有没有尚未成熟的 coinbase，这一格不拆开。另一情形：出块数是 1，余额仍空白。那表示来源给了归因块数、没有给余额，余额未知，不是 0。真正能否花费，仍是钱包里那笔输出是否已经过了 1,000 个区块。",
        "## 下一步",
        "地址对不上时，先确认是主网 `xpa1r` 而不是退役测试网 `txa1r`，见 [主网和测试网](/learn/xid-mainnet-vs-testnet)。份额在涨、余额不动，是因为份额不是余额，见 [算力与份额](/learn/xid-worker-hashrate-shares)。本页不承诺出块，不把项目站计算器的日收益当成你的收入，也不读取钱包里未成熟输出的列表。",
      ],
      [
        "在 [XID / MMM 監控](/projects/xid) 上，一個地址有瀏覽器餘額和鏈上歸因出塊數。註腳寫明餘額不是累計挖礦收益。兩格不相加，也不換成美元。",
        "## 成熟規則",
        "三份公開文本一致：coinbase 在 1,000 個區塊、約 3.5 天後才能花。白皮書（修訂日 2026-09-25）把主網成熟寫成 1,000，並寫退役測試網 A 同樣如此；8 位小數；普通輸出最小 10,000 sat（0.0001 XID）。專案站寫硬頂 100,000,000 XID，以及預熱 6.25、12.5、25，然後到第 220,000 塊為每塊 50。這是發行敘述，不是你的地址已領金額。",
        "## 礦池是否分成",
        "白皮書寫 `pool.xcoinminer.com:3335` 為 solo、只付 coinbase、不分成。專案站計算器寫 Solo 0% 與 Pool PPLNS 0.99%，並聲明是期望值不是承諾。專案站計算器寫「Solo · 自有節點 · 0%」和「Pool · PPLNS · 0.99%」，並聲明是按當日網路的期望值、不是承諾，且因為還沒有市場所以不給美元。兩份文本不是同一種礦池描述。本站不計算手續費，也不選其中一份當成已經核實的當前費率。白皮書修訂日標在創世前一天，計算器在主網上線之後的頁面上。",
        "舉例（虛構）：瀏覽器餘額顯示 12.50000000 XID，鏈上歸因出塊為空白。不能把空白讀成 0 塊，也不能把 12.5 說成今天挖到的、已經能轉出的幣。餘額裡有沒有尚未成熟的 coinbase，這一格不拆開。另一情形：出塊數是 1，餘額仍空白。那表示來源給了歸因塊數、沒有給餘額，餘額未知，不是 0。真正能否花費，仍是錢包裡那筆輸出是否已經過了 1,000 個區塊。",
        "## 下一步",
        "地址對不上時，先確認是主網 `xpa1r` 而不是退役測試網 `txa1r`，見 [主網和測試網](/learn/xid-mainnet-vs-testnet)。份額在漲、餘額不動，是因為份額不是餘額，見 [算力與份額](/learn/xid-worker-hashrate-shares)。本頁不承諾出塊，不把專案站計算器的日收益當成你的收入，也不讀取錢包裡未成熟輸出的列表。",
      ],
      [
        "On [XID / MMM monitoring](/projects/xid) an address has two separate cells: explorer balance, and chain-attributed blocks. The footnote says the balance is not lifetime mining income, and that maturity and spendable funds belong in the official explorer or wallet. This page does not add the two cells, and it does not price them in dollars.",
        "## Where the maturity rule is stated",
        "Three public texts agree on this point. The project site says a coinbase reward matures after 1,000 blocks, about 3.5 days, and points at the explorer superknet.com. The MMM mainnet page says a found block pays its reward to your address after 1,000 confirmations. The whitepaper, marked revised 2026-09-25, sets mainnet `COINBASE_MATURITY_MAINNET` to 1,000 blocks (about 3.5 days) and says retired testnet A used the same 1,000. It also states 8 decimal places and a minimum ordinary output of 10,000 sat (0.0001 XID). The project site states a hard cap of 100,000,000 XID, 8 decimals, and a warm-up of 6.25, then 12.5, then 25 XID per block for 20,000 blocks each, then 100 XID from block 60,001 through block 220,000. That is a public description of issuance. It is not the amount your address has already received.",
        "## Whether the pool splits rewards: the texts differ",
        "The whitepaper says the pool at `pool.xcoinminer.com:3335` is solo and coinbase-only: a block you find pays its coinbase straight to your address, with nothing held for you, nothing split, and no payout scheme. The project site’s calculator instead offers “Solo · own node · 0%” and “Pool · PPLNS · 0.99%”, and it calls the results expected values at that day’s network, not a promise, with no dollar figure because it says no market exists yet. Those are not the same description of the pool. This site does not compute a fee, and it does not choose one sentence and treat it as a verified current rate. If you need the rate, open both pages. The whitepaper revision is dated the day before genesis, and the calculator sits on the post-launch project site. The two descriptions of the pool fee are not the same.",
        "Illustrative case, not a measurement: the explorer balance reads 12.50000000 XID and chain-attributed blocks are blank. Do not read the blank as zero blocks, and do not call 12.5 today’s mined coins that are already sendable. The balance cell does not split out an immature coinbase. In the other direction, a block count of 1 with a blank balance means the source returned a block count and no balance. The balance is unknown, not zero. Whether a specific output can be spent is still the wallet’s check that 1,000 blocks have passed.",
        "## Next step",
        "If the address does not match, confirm it is mainnet `xpa1r` rather than retired-testnet `txa1r`. See [mainnet and testnet](/learn/xid-mainnet-vs-testnet). If shares rise while the balance stays put, shares are not the balance. See [hashrate and shares](/learn/xid-worker-hashrate-shares). This page does not promise a block, does not treat the project calculator’s daily figure as your income, and does not list immature outputs inside a wallet.",
      ],
      [
        "[XID / MMM 모니터](/projects/xid)에서 주소에는 탐색기 잔액과 체인 귀속 블록 수가 따로 있습니다. 각주는 잔액이 누적 채굴 수입이 아니라고 합니다. 두 칸을 더하거나 달러로 바꾸지 않습니다.",
        "## 성숙 규칙",
        "공개 텍스트 세 곳이 같습니다. 코인베이스는 1,000블록, 약 3.5일 뒤에 쓸 수 있습니다. 백서(개정 2026-09-25)는 메인넷 성숙을 1,000으로 적고, 종료된 테스트넷 A도 같다고 합니다. 소수점 8자리, 일반 출력 최소 10,000 sat(0.0001 XID)입니다. 프로젝트 사이트는 하드캡 100,000,000 XID와 워밍업 6.25, 12.5, 25, 그다음 220,000블록까지 블록당 50을 적습니다. 이것은 발행 설명이지 내 주소가 받은 금액이 아닙니다.",
        "## 풀이 나누는지",
        "백서는 `pool.xcoinminer.com:3335`가 솔로이고 코인베이스만 지급하며 나누지 않는다고 합니다. 프로젝트 계산기는 Solo 0%와 Pool PPLNS 0.99%를 제시하고, 기대값이며 약속이 아니라고 합니다. 프로젝트 계산기는 “Solo · 자체 노드 · 0%”와 “Pool · PPLNS · 0.99%”를 제시하고, 그날 네트워크의 기대값이며 약속이 아니라고 하고, 시장이 없어 달러는 주지 않는다고 합니다. 두 문서는 같은 풀 설명이 아닙니다. 이 사이트는 수수료를 계산하지 않고, 한쪽을 확인된 현재 요율로 고르지 않습니다. 백서 개정일은 제네시스 전날이고, 계산기는 메인넷 이후 페이지에 있습니다.",
        "예시(측정 아님): 잔액 12.50000000 XID, 블록 수는 빈칸. 빈칸은 0이 아니고 12.5는 오늘 이미 보낼 수 있는 코인이 아닙니다. 블록 수가 1이고 잔액이 빈칸이면 잔액은 알 수 없음이지 0이 아닙니다.",
        "## 다음",
        "주소가 맞지 않으면 [메인넷과 테스트넷](/learn/xid-mainnet-vs-testnet)을 보세요. 셰어만 늘면 [해시레이트와 셰어](/learn/xid-worker-hashrate-shares)를 보세요. 이 페이지는 블록을 약속하지 않고, 지갑의 미성숙 출력을 나열하지 않습니다.",
      ],
      [
        "[XID / MMM監視](/projects/xid)では、アドレスにエクスプローラー残高とチェーン帰属ブロック数が別々にあります。注記は、残高が累計採掘収入ではないと書きます。二つのマスは足さず、ドルにも換えません。",
        "## 成熟の規則",
        "三つの公開文が一致します。コインベースは1,000ブロック、約3.5日後に使えます。白書（改訂 2026-09-25）はメインネットの成熟を1,000とし、終了したテストネットAも同じと書きます。小数8桁、通常出力の最小は10,000 sat（0.0001 XID）です。プロジェクトサイトは上限100,000,000 XID、ウォームアップ6.25、12.5、25、その後ブロック220,000まで1ブロック50と書きます。これは発行の説明であり、自分のアドレスが受け取った額ではありません。",
        "## プールが分けるか",
        "白書は `pool.xcoinminer.com:3335` をソロ、コインベースのみ、分配なしと書きます。プロジェクトの計算機は Solo 0% と Pool PPLNS 0.99% を示し、期待値であって約束ではないと書きます。プロジェクトの計算機は「Solo · 自ノード · 0%」と「Pool · PPLNS · 0.99%」を示し、その日のネットワークの期待値であって約束ではなく、市場が無いのでドルは出さないと書きます。二つの文は同じプール説明ではありません。このサイトは手数料を計算せず、一方を確認済みの現在レートとして選びません。白書の改訂日はジェネシス前日、計算機はメインネット後のページにあります。",
        "例（実測ではない）: 残高 12.50000000 XID、ブロック数は空欄。空欄は0ではなく、12.5は今日すでに送れるコインではありません。ブロック数が1で残高が空欄なら、残高は不明であり0ではありません。",
        "## 次",
        "アドレスが合わないときは [メインネットとテストネット](/learn/xid-mainnet-vs-testnet) を見てください。シェアだけ増えるときは [ハッシュレートとシェア](/learn/xid-worker-hashrate-shares) を見てください。このページはブロックを約束せず、ウォレット内の未成熟出力も一覧しません。",
      ],
    ),
    questions: questions([
      [
        text(
          "余额增加是不是已经可以转出？",
          "餘額增加是不是已經可以轉出？",
          "If the balance rose, can I send it?",
          "잔액이 늘면 바로 보낼 수 있나요?",
          "残高が増えたらすぐ送れますか？",
        ),
        text(
          "这一格不回答。Coinbase 要等 1,000 个区块。请在官方钱包或浏览器里看那笔输出是否已成熟。",
          "這一格不回答。Coinbase 要等 1,000 個區塊。請在官方錢包或瀏覽器裡看那筆輸出是否已成熟。",
          "This cell does not answer that. A coinbase waits 1,000 blocks. Check that output in the official wallet or explorer.",
          "이 칸은 그걸 답하지 않습니다. 코인베이스는 1,000블록을 기다립니다. 공식 지갑이나 탐색기에서 그 출력을 확인하세요.",
          "このマスはそれに答えません。コインベースは1,000ブロック待ちます。公式ウォレットかエクスプローラーでその出力を確認してください。",
        ),
      ],
      [
        text(
          "矿池手续费到底是 0 还是 0.99%？",
          "礦池手續費到底是 0 還是 0.99%？",
          "Is the pool fee 0 or 0.99%?",
          "풀 수수료는 0인가요, 0.99%인가요?",
          "プール手数料は0ですか、0.99%ですか？",
        ),
        text(
          "不能从这两份文本里选定。白皮书写不分成；项目站计算器写 PPLNS 0.99%。本站不把其中一份当成已核实费率。",
          "不能從這兩份文本裡選定。白皮書寫不分成；專案站計算器寫 PPLNS 0.99%。本站不把其中一份當成已核實費率。",
          "Those two texts do not settle it. The whitepaper says nothing is split. The project calculator says PPLNS 0.99%. This site does not treat either line as a verified fee.",
          "두 문서만으로 정할 수 없습니다. 백서는 나누지 않는다고 하고, 계산기는 PPLNS 0.99%라고 합니다. 이 사이트는 어느 쪽도 확인된 수수료로 보지 않습니다.",
          "二つの文だけでは決まりません。白書は分配なし、計算機はPPLNS 0.99%です。このサイトはどちらも確認済み手数料とは扱いません。",
        ),
      ],
      [
        text(
          "出块数为空白，是不是还没挖到块？",
          "出塊數為空白，是不是還沒挖到塊？",
          "If the block count is blank, have I found no blocks?",
          "블록 수가 비어 있으면 블록을 못 찾은 것인가요?",
          "ブロック数が空欄なら、まだ見つけていないのですか？",
        ),
        text(
          "空白是来源没有给出这个数，不是 0。0 只有在页面真的显示 0 时才是 0。",
          "空白是來源沒有給出這個數，不是 0。0 只有在頁面真的顯示 0 時才是 0。",
          "Blank means the source did not return the figure. It is not zero. Zero is zero only when the page shows 0.",
          "빈칸은 출처가 그 수를 주지 않은 것이며 0이 아닙니다. 0은 페이지에 0이 보일 때만 0입니다.",
          "空欄はソースがその数を返していないという意味で、0ではありません。0はページに0と出たときだけ0です。",
        ),
      ],
    ]),
  },
  {
    slug: nets,
    project: "xid",
    published: "2026-10-24",
    modified: "2026-10-24",
    topic: text(
      "别把测试网当余额",
      "別把測試網當餘額",
      "Do not treat testnet as a balance",
      "테스트넷을 잔액으로 보지 않기",
      "テストネットを残高と見ない",
    ),
    title: text(
      "XID 主网和退役测试网：xpa1r 与 txa1r 不能混用",
      "XID 主網和退役測試網：xpa1r 與 txa1r 不能混用",
      "XID mainnet vs retired testnet: xpa1r and txa1r",
      "XID 메인넷과 종료된 테스트넷: xpa1r와 txa1r",
      "XIDメインネットと終了したテストネット：xpa1rとtxa1r",
    ),
    description: text(
      "主网地址以 xpa1r 开头，退役测试网 A 以 txa1r 开头。测试网余额不会带进主网。监控只接受通过校验的主网地址。创世是 2026-09-26 00:00 UTC。",
      "主網地址以 xpa1r 開頭，退役測試網 A 以 txa1r 開頭。測試網餘額不會帶進主網。監控只接受通過校驗的主網地址。創世是 2026-09-26 00:00 UTC。",
      "Mainnet addresses start with xpa1r. Retired testnet A starts with txa1r. Testnet balances did not carry onto mainnet. The monitor accepts only a mainnet address that passes validation. Genesis was 2026-09-26 at 00:00 UTC.",
      "메인넷 주소는 xpa1r, 종료된 테스트넷 A는 txa1r로 시작합니다. 테스트넷 잔액은 메인넷으로 넘어오지 않습니다. 모니터는 검증을 통과한 메인넷 주소만 받습니다. 제네시스는 2026-09-26 00:00 UTC입니다.",
      "メインネットはxpa1r、終了したテストネットAはtxa1rで始まります。テストネット残高はメインネットへ引き継がれません。監視が受けるのは検証を通ったメインネットアドレスだけです。ジェネシスは2026-09-26 00:00 UTCです。",
    ),
    summary: text(
      "测试网 A 已退役，账本归档在高度 3,555，那些币没有价值，余额也不迁入主网。把 txa1r 贴进主网监控不会显示主网余额。",
      "測試網 A 已退役，帳本歸檔在高度 3,555，那些幣沒有價值，餘額也不遷入主網。把 txa1r 貼進主網監控不會顯示主網餘額。",
      "Testnet A is retired. Its ledger is archived at height 3,555, those coins have no value, and the balances did not move to mainnet. Pasting txa1r into the mainnet monitor does not show a mainnet balance.",
      "테스트넷 A는 종료되었습니다. 원장은 높이 3,555에 보관되고, 그 코인은 가치가 없으며 잔액은 메인넷으로 옮겨지지 않았습니다. txa1r를 메인넷 모니터에 붙여도 메인넷 잔액이 나오지 않습니다.",
      "テストネットAは終了しています。台帳は高さ3,555で保管され、そのコインに価値はなく、残高はメインネットへ移りません。txa1rをメインネット監視に貼ってもメインネット残高は出ません。",
    ),
    sources: [mmm, paper, site],
    related: [setup, rewards],
    comparisonTitle: text(
      "主网和退役测试网 A",
      "主網和退役測試網 A",
      "Mainnet and retired testnet A",
      "메인넷과 종료된 테스트넷 A",
      "メインネットと終了したテストネットA",
    ),
    comparison: table(
      {
        headers: ["项目", "主网", "退役测试网 A"],
        rows: [
          ["地址开头", "xpa1r（Bech32m，见证版本 3）", "txa1r"],
          ["状态", "2026-09-26 00:00 UTC 创世后运行", "已退役；MMM 页写账本归档于高度 3,555"],
          ["余额", "浏览器上的主网余额，仍要单独看成熟", "官方写明不会结转，且测试网币没有价值"],
          ["本站监控", "只保存通过校验的主网地址", "不把 txa1r 当成主网地址"],
        ],
      },
      {
        headers: ["項目", "主網", "退役測試網 A"],
        rows: [
          ["地址開頭", "xpa1r（Bech32m，見證版本 3）", "txa1r"],
          ["狀態", "2026-09-26 00:00 UTC 創世後運行", "已退役；MMM 頁寫帳本歸檔於高度 3,555"],
          ["餘額", "瀏覽器上的主網餘額，仍要單獨看成熟", "官方寫明不會結轉，且測試網幣沒有價值"],
          ["本站監控", "只儲存通過校驗的主網地址", "不把 txa1r 當成主網地址"],
        ],
      },
      {
        headers: ["Item", "Mainnet", "Retired testnet A"],
        rows: [
          ["Address prefix", "xpa1r (Bech32m, witness version 3)", "txa1r"],
          [
            "Status",
            "Live since genesis 2026-09-26 00:00 UTC",
            "Retired; the MMM page says the ledger is archived at height 3,555",
          ],
          [
            "Balance",
            "Mainnet explorer balance; maturity is still separate",
            "Official text: balances did not carry over, and testnet coins have no value",
          ],
          [
            "This monitor",
            "Saves a mainnet address that passes validation",
            "Does not treat txa1r as a mainnet address",
          ],
        ],
      },
      {
        headers: ["항목", "메인넷", "종료된 테스트넷 A"],
        rows: [
          ["주소 접두사", "xpa1r (Bech32m, 위트니스 버전 3)", "txa1r"],
          [
            "상태",
            "2026-09-26 00:00 UTC 제네시스 이후 가동",
            "종료. MMM 페이지는 원장 보관 높이 3,555",
          ],
          [
            "잔액",
            "메인넷 탐색기 잔액. 성숙은 따로 확인",
            "공식 문구: 잔액은 넘어오지 않으며 테스트넷 코인은 가치 없음",
          ],
          ["이 모니터", "검증을 통과한 메인넷 주소만 저장", "txa1r를 메인넷 주소로 받지 않음"],
        ],
      },
      {
        headers: ["項目", "メインネット", "終了したテストネットA"],
        rows: [
          ["アドレスの接頭辞", "xpa1r（Bech32m、witness version 3）", "txa1r"],
          [
            "状態",
            "2026-09-26 00:00 UTC のジェネシス以降",
            "終了。MMMページは台帳を高さ3,555で保管と記載",
          ],
          [
            "残高",
            "メインネットのエクスプローラー残高。成熟は別",
            "公式: 残高は引き継がれず、テストネットのコインに価値はない",
          ],
          [
            "この監視",
            "検証を通ったメインネットアドレスだけ保存",
            "txa1rをメインネットアドレスとして扱わない",
          ],
        ],
      },
    ),
    body: paras(
      [
        "主网监控里查不到余额，先分清地址属于哪一条链。xCoin 主网公开收益地址以 `xpa1r` 开头。白皮书写明这是 Bech32m，人类可读前缀 `xpa`，见证版本 3，所以地址读作 `xpa1r…`；主网没有另一种地址。退役测试网 A 用 `txa1r…`。把测试网地址贴进 [XID / MMM 监控](/projects/xid)，不会查出主网余额。",
        "## 官方对退役的说法",
        "MMM 主网页写：主网自 2026-09-26 00:00 UTC 创世起运行；测试网 A 已退役，账本归档在高度 3,555，测试网币没有价值；余额不会结转；挖主网前要更新 MMM。同一页写 MMM 不会静默替换测试网设置，必须在 Setup 里把网络改成 Mainnet，并填写当前主网矿池、端口 3335 和 `xpa1r` 地址。项目站同样把主网开始时间写成 2026-09-26 00:00 UTC，并写地址以 `xpa1r` 开头。发行曲线和成熟天数留在收益页，这一页不重复。",
        "高度 3,555 是 MMM 页写出的归档高度。主网地址和退役测试网余额不结转，是这两页都写明的事实。",
        "## 地址被拒绝时怎么分支",
        "只复制了前缀 `xpa1r`、后面不完整：补全整串再试。整串以 `txa1r` 开头：这是退役测试网，停止把它当成主网余额；使用你已经持有的主网地址，在 MMM 里改成 Mainnet。本页不生成钱包，也不把测试网地址改写成主网地址。大小写或中间有空格：按钱包给出的原样整串粘贴。主网地址能保存，但余额是测试网时期记得的数字：那笔记在另一本账上，主网卡片不会把它加进来。",
        "举例（虚构）：你还留着测试网地址 `txa1r1…` 和一张旧截图，上面写着 40 XID。主网监控拒绝这串地址。正确的下一步不是把 40 填成主网余额，而是在 MMM 里改成 Mainnet，使用新的 `xpa1r…`，再保存到监控。按 MMM 页的说法，旧的 40 没有结转，也不具有他们所说的价值。",
        "## 保存进监控之后",
        "监控只保存通过校验的整串主网地址，不迁移余额，不保管种子。名额按每个项目已保存的设备记录计算，不是按钱包地址计算：每个项目免费 3 台已保存设备，Pro 为 100 台。自动出现的 Worker 不新增记录；另外保存 Worker 设备才会占用；同一台设备上对同一项目的多次绑定不额外占用。主网余额怎么和出块、成熟分开，见 [收益和余额](/learn/xid-rewards-balance-maturity)。设置步骤见 [主网设置](/learn/xid-mmm-mainnet-setup)。",
      ],
      [
        "主網監控查不到餘額時，先分清地址屬於哪一條鏈。主網是 `xpa1r`。白皮書寫 Bech32m、前綴 `xpa`、見證版本 3。退役測試網 A 是 `txa1r`。把測試網地址貼進 [XID / MMM 監控](/projects/xid) 不會查出主網餘額。",
        "## 官方對退役的說法",
        "MMM 主網頁：主網自 2026-09-26 00:00 UTC 運行；測試網 A 已退役，帳本歸檔於高度 3,555，測試網幣沒有價值，餘額不結轉。必須在 Setup 把網路改成 Mainnet。專案站同樣把主網開始時間寫成 2026-09-26 00:00 UTC，並寫地址以 `xpa1r` 開頭。必須在 Setup 裡自己把網路改成 Mainnet，並填目前主網礦池、連接埠 3335 和 `xpa1r` 地址。MMM 不會靜默替換測試網設定。發行曲線和成熟天數留在收益頁，這一頁不重複。高度 3,555 是 MMM 頁寫出的歸檔高度。",
        "## 地址被拒絕時",
        "只複製了前綴 `xpa1r`、後面不完整：補全整串再試。整串以 `txa1r` 開頭：這是退役測試網，停止把它當成主網餘額；使用你已經持有的主網地址，在 MMM 裡改成 Mainnet。本頁不生成錢包，也不把測試網地址改寫成主網地址。大小寫或中間有空格：按錢包給出的原樣整串貼上。主網地址能儲存，但餘額是測試網時期記得的數字：那筆記在另一本帳上，主網卡片不會把它加進來。",
        "舉例（虛構）：你還留著測試網地址 `txa1r1…` 和一張舊截圖，上面寫著 40 XID。主網監控拒絕這串地址。正確的下一步不是把 40 填成主網餘額，而是在 MMM 裡改成 Mainnet，使用新的 `xpa1r…`，再儲存到監控。按 MMM 頁的說法，舊的 40 沒有結轉，也不具有他們所說的價值。",
        "## 儲存進監控之後",
        "監控只儲存通過校驗的整串主網地址，不遷移餘額，不保管種子。名額按每個專案已儲存的裝置紀錄計算，不是按錢包地址計算：每個專案免費 3 台已儲存裝置，Pro 為 100 台。自動出現的 Worker 不新增紀錄；另外儲存 Worker 裝置才會占用；同一台裝置上對同一專案的多次綁定不額外占用。主網餘額怎麼和出塊、成熟分開，見 [收益和餘額](/learn/xid-rewards-balance-maturity)。設定步驟見 [主網設定](/learn/xid-mmm-mainnet-setup)。",
      ],
      [
        "When the mainnet monitor shows no balance, first decide which chain the address belongs to. A public xCoin mainnet payout address starts with `xpa1r`. The whitepaper says the encoding is Bech32m, the human-readable prefix is `xpa`, and the witness version is 3, so the address reads `xpa1r…`. There is no other mainnet address. Retired testnet A uses `txa1r…`. Pasting a testnet address into [XID / MMM monitoring](/projects/xid) does not look up a mainnet balance.",
        "## What the official pages say about retirement",
        "The MMM mainnet page says mainnet has been live since genesis on 2026-09-26 at 00:00 UTC; testnet A is retired, its ledger is archived at height 3,555, and testnet coins have no value. Balances did not carry over. Update MMM before you mine mainnet. The same page says MMM will not silently replace testnet settings: in Setup you set Network to Mainnet, then the current mainnet pool, port 3335, and an `xpa1r` address. The project site gives the same genesis time and says an address starts with `xpa1r`. Emission and maturity stay on the rewards page. This page does not repeat them.",
        "Height 3,555 is the archived height written on the MMM page. Mainnet `xpa1r` versus retired `txa1r`, and the statement that testnet balances did not carry over, are on those pages.",
        "## Branches when an address is rejected",
        "Only the prefix `xpa1r` was copied and the rest is missing: paste the whole string. The string starts with `txa1r`: that is retired testnet. Stop treating it as a mainnet balance. Use the mainnet address you already hold, and switch MMM to Mainnet. This page does not create a wallet and does not rewrite a testnet address into a mainnet one. Spaces or changed case: paste the string exactly as the wallet shows it. A mainnet address saves, but the number you remember is from a testnet screenshot: that figure lived on the other ledger. The mainnet card does not add it.",
        "Illustrative case, not a measurement: you still have a testnet address `txa1r1…` and an old screenshot that says 40 XID. The mainnet monitor rejects the string. The next step is not to type 40 in as a mainnet balance. Switch MMM to Mainnet, use a new `xpa1r…` address, and save that. Under the MMM page’s statement the old 40 did not carry over and has no value they recognize.",
        "## After you save it on the monitor",
        "The monitor stores only a full mainnet address that passes validation. It does not migrate a balance or hold a seed. The quota counts distinct saved device records per project, not wallet addresses: three saved devices per project on Free, 100 on Pro. Workers shown automatically do not add a record. Saving a Worker device yourself can use a slot. Several bindings of the same project on the same device do not use extra quota. How a mainnet balance differs from blocks and maturity is in [rewards and balance](/learn/xid-rewards-balance-maturity). Setup steps are in [mainnet setup](/learn/xid-mmm-mainnet-setup).",
      ],
      [
        "메인넷 모니터에 잔액이 없으면 주소가 어느 체인인지부터 나눕니다. 메인넷은 `xpa1r`입니다. 백서는 Bech32m, 접두사 `xpa`, 위트니스 버전 3이라고 합니다. 종료된 테스트넷 A는 `txa1r`입니다. 테스트넷 주소를 [XID / MMM 모니터](/projects/xid)에 붙여도 메인넷 잔액이 나오지 않습니다.",
        "## 종료에 대한 공식 설명",
        "MMM 메인넷 페이지: 메인넷은 2026-09-26 00:00 UTC부터 가동, 테스트넷 A는 종료, 원장은 높이 3,555에 보관, 테스트넷 코인은 가치가 없고 잔액은 넘어오지 않습니다. Setup에서 Mainnet으로 바꿔야 합니다. 프로젝트 사이트도 메인넷 시작을 2026-09-26 00:00 UTC로 적고, 주소가 `xpa1r`로 시작한다고 합니다. Setup에서 직접 Mainnet으로 바꾸고, 현재 메인넷 풀, 포트 3335, `xpa1r` 주소를 넣습니다. MMM은 테스트넷 설정을 조용히 바꾸지 않습니다. 발행 곡선과 성숙 일수는 보상 페이지에 두고 여기서 반복하지 않습니다. 3,555는 MMM 페이지에 적힌 보관 높이입니다.",
        "## 주소가 거절될 때",
        "접두사 `xpa1r`만 복사하고 뒤가 없으면 전체를 붙입니다. 문자열이 `txa1r`로 시작하면 종료된 테스트넷입니다. 메인넷 잔액으로 보지 마세요. 이미 가진 메인넷 주소를 쓰고 MMM을 Mainnet으로 바꿉니다. 이 페이지는 지갑을 만들지 않고, 테스트넷 주소를 메인넷 주소로 다시 쓰지도 않습니다. 공백이나 바뀐 대소문자는 지갑에 나온 그대로 붙입니다. 메인넷 주소는 저장되지만, 테스트넷 때 기억한 숫자는 다른 원장에 있습니다. 메인넷 카드는 그 숫자를 더하지 않습니다.",
        "예시(측정 아님): 테스트넷 주소 `txa1r1…`와 40 XID라고 적힌 옛 화면이 남아 있습니다. 메인넷 모니터는 그 문자열을 거절합니다. 40을 메인넷 잔액으로 적지 않습니다. MMM을 Mainnet으로 바꾸고 새 `xpa1r…`를 저장합니다. MMM 페이지의 말에 따르면 옛 40은 넘어오지 않았고, 그들이 말하는 가치도 없습니다.",
        "## 모니터에 저장한 뒤",
        "모니터는 검증을 통과한 메인넷 주소 전체만 저장합니다. 잔액을 옮기거나 시드를 보관하지 않습니다. 한도는 지갑 주소가 아니라 프로젝트별 저장된 기기 기록입니다. 프로젝트마다 무료 3대, Pro 100대입니다. 자동으로 보이는 Worker는 기록을 추가하지 않습니다. Worker 기기를 따로 저장하면 칸을 쓸 수 있습니다. 같은 기기에서 같은 프로젝트를 여러 번 묶어도 추가 한도는 없습니다. 잔액과 블록·성숙의 차이는 [보상과 잔액](/learn/xid-rewards-balance-maturity)에, 설정은 [메인넷 설정](/learn/xid-mmm-mainnet-setup)에 있습니다.",
      ],
      [
        "メインネット監視に残高が無いときは、アドレスがどのチェーンかを先に分けます。メインネットは `xpa1r` です。白書は Bech32m、接頭辞 `xpa`、witness version 3 と書きます。終了したテストネットAは `txa1r` です。テストネットのアドレスを [XID / MMM監視](/projects/xid) に貼ってもメインネット残高は出ません。",
        "## 終了についての公式の説明",
        "MMMのメインネットページ: メインネットは 2026-09-26 00:00 UTC から稼働。テストネットAは終了、台帳は高さ 3,555 で保管、テストネットのコインに価値はなく残高は引き継がれません。Setupで Mainnet に切り替えます。プロジェクトサイトもメインネット開始を 2026-09-26 00:00 UTC と書き、アドレスは `xpa1r` で始まると書きます。Setupで自分で Mainnet に切り替え、現行のメインネットプール、ポート 3335、`xpa1r` アドレスを入れます。MMMはテストネット設定を黙って置き換えません。発行曲線と成熟日数は報酬のページに残し、ここでは繰り返しません。3,555 は MMM ページに書かれた保管時の高さです。",
        "## アドレスが拒否されたとき",
        "接頭辞 `xpa1r` だけで続きが無いときは全文を貼ります。文字列が `txa1r` で始まるなら終了したテストネットです。メインネット残高として扱いません。すでに持っているメインネットアドレスを使い、MMMを Mainnet にします。このページはウォレットを作らず、テストネットアドレスをメインネットアドレスへ書き換えません。空白や変えられた大文字小文字は、ウォレットの表示のまま貼ります。メインネットアドレスは保存できますが、テストネットのときに覚えた数字は別の台帳です。メインネットのカードはその数字を足しません。",
        "例（実測ではない）: テストネットアドレス `txa1r1…` と、40 XID と書かれた古い画面が残っています。メインネット監視はその文字列を拒否します。40をメインネット残高として書きません。MMMを Mainnet にし、新しい `xpa1r…` を保存します。MMMページの記述では、古い40は引き継がれず、彼らが言う価値もありません。",
        "## 監視に保存したあと",
        "監視が保存するのは、検証を通ったメインネットアドレスの全文だけです。残高は移さず、シードも預かりません。枠はウォレットアドレスではなく、プロジェクトごとに保存した端末記録です。プロジェクトごとに無料3台、Proは100台です。自動で表示されるWorkerは記録を増やしません。Worker端末を別に保存すると枠を使います。同じ端末で同じプロジェクトを何度バインドしても追加の枠は使いません。残高とブロック・成熟の違いは [報酬と残高](/learn/xid-rewards-balance-maturity)、設定は [メインネット設定](/learn/xid-mmm-mainnet-setup) にあります。",
      ],
    ),
    questions: questions([
      [
        text(
          "测试网上的币会在主网出现吗？",
          "測試網上的幣會在主網出現嗎？",
          "Will testnet coins show up on mainnet?",
          "테스트넷 코인이 메인넷에 나타나나요?",
          "テストネットのコインはメインネットに出ますか？",
        ),
        text(
          "按 MMM 主网页的说法，不会结转，而且那些币没有价值。",
          "按 MMM 主網頁的說法，不會結轉，而且那些幣沒有價值。",
          "The MMM mainnet page says they did not carry over and have no value.",
          "MMM 메인넷 페이지는 넘어오지 않으며 가치가 없다고 합니다.",
          "MMMのメインネットページは、引き継がれず価値もないと書きます。",
        ),
      ],
      [
        text(
          "xpa1r 和 txa1r 只差一个字母吗？",
          "xpa1r 和 txa1r 只差一個字母嗎？",
          "Do xpa1r and txa1r differ by one letter?",
          "xpa1r와 txa1r는 글자 하나만 다른가요?",
          "xpa1rとtxa1rは一字違いですか？",
        ),
        text(
          "开头就不同：主网是 xpa，退役测试网 A 是 txa。后面整串也不能混贴。",
          "開頭就不同：主網是 xpa，退役測試網 A 是 txa。後面整串也不能混貼。",
          "The prefixes already differ: mainnet is xpa, retired testnet A is txa. The rest of the string must not be mixed in either.",
          "접두사부터 다릅니다. 메인넷은 xpa, 종료된 테스트넷 A는 txa입니다. 나머지 문자열도 섞지 마세요.",
          "接頭辞から違います。メインネットはxpa、終了したテストネットAはtxaです。残りの文字列も混ぜないでください。",
        ),
      ],
      [
        text(
          "监控会生成主网地址吗？",
          "監控會生成主網地址嗎？",
          "Does the monitor create a mainnet address?",
          "모니터가 메인넷 주소를 만드나요?",
          "監視はメインネットアドレスを作りますか？",
        ),
        text(
          "不会。它只保存你已经有的、通过校验的主网地址。它不生成钱包，也不把测试网地址改成主网地址。",
          "不會。它只儲存你已經有的、通過校驗的主網地址。它不生成錢包，也不把測試網地址改成主網地址。",
          "No. It only stores a mainnet address you already have, after validation. It does not create a wallet, and it does not turn a testnet address into a mainnet address.",
          "아니요. 이미 가진, 검증을 통과한 메인넷 주소만 저장합니다. 지갑을 만들지 않고, 테스트넷 주소를 메인넷 주소로 바꾸지도 않습니다.",
          "いいえ。すでに持っている、検証を通ったメインネットアドレスだけを保存します。ウォレットは作らず、テストネットアドレスをメインネットアドレスにも変えません。",
        ),
      ],
    ]),
  },
  {
    slug: offline,
    project: "xid",
    published: "2026-10-24",
    modified: "2026-10-24",
    topic: text(
      "名单上没有并不等于关机",
      "名單上沒有並不等於關機",
      "Missing from the list is not powered off",
      "목록에 없음이 곧 꺼짐은 아님",
      "一覧に無いことは電源オフではない",
    ),
    title: text(
      "XID Worker 不在名单：离线前要核对的几项",
      "XID Worker 不在名單：離線前要核對的幾項",
      "XID Worker missing: what to check before calling it offline",
      "XID Worker가 목록에 없을 때: 오프라인이라 하기 전에",
      "XIDのWorkerが一覧に無いとき：オフラインと判断する前に",
    ),
    description: text(
      "某个地址下面没有 Worker，不能证明 Mac 已经停止挖矿。先看获取时间、矿池是否被标成旧数据、地址是不是主网，再看本机 MMM 是否仍在挖。网站看不到菜单栏。",
      "某個地址下面沒有 Worker，不能證明 Mac 已經停止挖礦。先看取得時間、礦池是否被標成舊資料、地址是不是主網，再看本機 MMM 是否仍在挖。網站看不到選單列。",
      "No Worker under an address does not prove the Mac stopped mining. Check the fetch time, whether the source marks the pool stale, and whether the address is mainnet, then look at MMM on the machine. This website cannot see the menu bar.",
      "주소 아래 Worker가 없어도 Mac이 채굴을 멈췄다는 증거는 아닙니다. 조회 시각, 풀이 오래됐다고 표시됐는지, 주소가 메인넷인지를 보고, 그다음 기기의 MMM을 봅니다. 이 웹사이트는 메뉴 막대를 보지 못합니다.",
      "アドレスの下にWorkerが無くても、Macが採掘を止めた証明にはなりません。取得時刻、プールが古いと印されているか、アドレスがメインネットかを見てから、機械のMMMを見ます。このサイトはメニューバーを見られません。",
    ),
    summary: text(
      "空名单的意思是：这次读到的公开名单里没有该地址的 Worker。它不包含本机进程、温度或菜单栏份额。那些只在你的 Mac 上。",
      "空名單的意思是：這次讀到的公開名單裡沒有該地址的 Worker。它不包含本機行程、溫度或選單列份額。那些只在你的 Mac 上。",
      "An empty list means this fetch of the public roster has no Worker for that address. It does not include the local process, temperature, or menu-bar shares. Those exist only on your Mac.",
      "빈 목록은 이번 공개 명단에 그 주소의 Worker가 없다는 뜻입니다. 로컬 프로세스, 온도, 메뉴 막대 셰어는 포함하지 않습니다. 그것들은 Mac에만 있습니다.",
      "空の一覧は、今回の公開名簿にそのアドレスのWorkerが無いという意味です。ローカルのプロセス、温度、メニューバーのシェアは含みません。それらはMacにだけあります。",
    ),
    sources: [mmm, site, watch],
    related: [hashrate, nets],
    comparisonTitle: text(
      "看到的现象和下一步",
      "看到的現象和下一步",
      "What you see and the next check",
      "보이는 현상과 다음 확인",
      "見える現象と次の確認",
    ),
    comparison: table(
      {
        headers: ["页面现象", "它能说明什么", "下一步"],
        rows: [
          [
            "该地址没有任何 Worker 行",
            "这次名单没有这一地址",
            "核对主网地址和当前矿池，再看 Mac 上的 MMM",
          ],
          ["来源注明矿池数据是旧的", "记录停在上一次来源时间", "不要把旧名单当成刚刚的离线证明"],
          [
            "有份额，算力空白",
            "有接受记录，这一刻没有估算",
            "先看最近活动，不要只凭空白算力判断关机",
          ],
          ["最近活动是几分钟前", "名单上这一行当时还有活动", "与菜单栏对照；网站看不到菜单栏"],
        ],
      },
      {
        headers: ["頁面現象", "它能說明什麼", "下一步"],
        rows: [
          [
            "該地址沒有任何 Worker 列",
            "這次名單沒有這一地址",
            "核對主網地址和目前礦池，再看 Mac 上的 MMM",
          ],
          ["來源註明礦池資料是舊的", "紀錄停在上一次來源時間", "不要把舊名單當成剛剛的離線證明"],
          [
            "有份額，算力空白",
            "有接受紀錄，這一刻沒有估算",
            "先看最近活動，不要只憑空白算力判斷關機",
          ],
          ["最近活動是幾分鐘前", "名單上這一列當時還有活動", "與選單列對照；網站看不到選單列"],
        ],
      },
      {
        headers: ["What the page shows", "What that can mean", "Next check"],
        rows: [
          [
            "No Worker row for this address",
            "This fetch has no row for the address",
            "Check the mainnet address and the current pool, then MMM on the Mac",
          ],
          [
            "Source marks pool data stale",
            "The record stopped at the previous source time",
            "Do not treat the old roster as a fresh offline proof",
          ],
          [
            "Shares present, hashrate blank",
            "Accepted work exists; this moment has no estimate",
            "Read last activity before calling the Mac off",
          ],
          [
            "Last activity a few minutes ago",
            "That row still had activity then",
            "Compare with the menu bar; this site cannot see it",
          ],
        ],
      },
      {
        headers: ["화면", "의미할 수 있는 것", "다음 확인"],
        rows: [
          [
            "이 주소의 Worker 행이 없음",
            "이번 명단에 그 주소가 없음",
            "메인넷 주소와 현재 풀을 보고, Mac의 MMM을 봅니다",
          ],
          [
            "출처가 풀 데이터가 오래됐다고 표시",
            "기록이 이전 출처 시각에 멈춤",
            "옛 명단을 방금의 오프라인 증거로 보지 않습니다",
          ],
          [
            "셰어는 있고 해시레이트는 빈칸",
            "수락 기록은 있고 이 순간 추정은 없음",
            "빈 해시레이트만으로 꺼졌다고 하지 않습니다",
          ],
          [
            "최근 활동이 몇 분 전",
            "그때 그 행에 활동이 있었음",
            "메뉴 막대와 비교합니다. 사이트는 메뉴 막대를 보지 못합니다",
          ],
        ],
      },
      {
        headers: ["画面", "意味し得ること", "次の確認"],
        rows: [
          [
            "このアドレスのWorker行が無い",
            "今回の名簿にそのアドレスが無い",
            "メインネットアドレスと現行プールを見てからMacのMMMを見る",
          ],
          [
            "ソースがプールデータを古いと表示",
            "記録は前回のソース時刻で止まっている",
            "古い名簿を今のオフライン証明にしない",
          ],
          [
            "シェアはあり算力は空欄",
            "受理記録はあるが、この瞬間の推定は無い",
            "空欄の算力だけで電源オフと判断しない",
          ],
          [
            "最終活動が数分前",
            "その時点でその行に活動があった",
            "メニューバーと照合する。サイトはメニューバーを見られない",
          ],
        ],
      },
    ),
    body: paras(
      [
        "在 [XID / MMM 监控](/projects/xid) 上，地址下面写着「已读取的名单里没有这个地址的 Worker。这不能证明矿工已离线。」这句话是判断的起点。网站没有你的 Mac 进程、温度、功耗或菜单栏镐形图标。那些只在 MMM 本机。配对代理也不能远程开关 MMM；它只控制 Train at Home 的 Mac。",
        "## 按这个顺序看",
        "第一，最近获取时间。获取失败时，上一份数据保持原来的时间。成功刷新如果来源本身是旧的，页面会说明来源记录已经超过 10 分钟，刷新成功也不等于它变新。来源把矿池标成旧数据时，同样不要把这份名单当成此刻的开关状态。",
        "第二，地址和矿池。收益地址必须是主网 `xpa1r` 整串。`txa1r` 属于退役测试网，见 [主网和测试网](/learn/xid-mainnet-vs-testnet)。MMM 主网页写的当前矿池是 `pool.xcoinminer.com`（或页上的 `172.96.186.49`），端口 `3335`，网络 Mainnet，浏览器 `https://superknet.com`。挖的是别的矿池或仍停在测试网设置时，这份公开名单可以没有你的 Worker。页面也写明：选中的矿池决定哪些 Worker 记录可见，名单不覆盖每一个矿工。",
        "第三，回到 Mac。MMM 页说开始挖矿后，Worker 大约一分钟内出现在 superknet.com 的矿工名单，菜单栏显示本机算力和份额。若菜单栏仍在跳而网页没有行，两边不是同一份读数：一边是本机，一边是这次抓到的公开名单。若菜单栏也停了，那是 MMM 自己的状态，需要你在 Mac 上开始或停止，网页做不到。",
        "## 两种名单读法",
        "举例（虚构）：最近获取是 12 分钟前，来源注明矿池数据是旧的。地址正确，Worker 行不存在，你记得份额曾经是 14。不能把「没有行」加上「12 分钟」说成机器已关机。旧标记说明名单停在更早的来源时间；没有行只说明这一份名单没有该地址。下一步是看 MMM 是否仍选着 Mainnet 和上述矿池，以及菜单栏是否还在计数。下一步仍是对照 Mac 上的 MMM，而不是把网页空白写成关机。",
        "另一支：行还在，接受份额 14，两种算力都空白，最近活动 3 分钟前。这是有活动记录但没有估算，读法见 [算力与份额](/learn/xid-worker-hashrate-shares)，仍然不是关机证明。",
        "## 这一页做不到的事",
        "做不到的事：不能远程重启 MMM，不能把空白算力写成 0 MH/s，不能用可见 Worker 人数估计全网还有多少台 Mac，也不能保证一分钟内名单一定更新。那一分钟是 MMM 页对他们浏览器名单的说法。",
      ],
      [
        "在 [XID / MMM 監控](/projects/xid) 上，地址下面寫著「已讀取的名單裡沒有這個地址的 Worker。這不能證明礦工已離線。」這句話是判斷的起點。網站沒有你的 Mac 行程、溫度、功耗或選單列鎬形圖示。那些只在 MMM 本機。配對代理也不能遠端開關 MMM；它只控制 Train at Home 的 Mac。",
        "## 按這個順序看",
        "第一，最近取得時間。取得失敗時，上一份資料保持原來的時間。成功重新整理如果來源本身是舊的，頁面會說明來源紀錄已經超過 10 分鐘，重新整理成功也不等於它變新。來源把礦池標成舊資料時，同樣不要把這份名單當成此刻的開關狀態。",
        "第二，地址和礦池。收益地址必須是主網 `xpa1r` 整串。`txa1r` 屬於退役測試網，見 [主網和測試網](/learn/xid-mainnet-vs-testnet)。MMM 主網頁寫的目前礦池是 `pool.xcoinminer.com`（或頁上的 `172.96.186.49`），連接埠 `3335`，網路 Mainnet，瀏覽器 `https://superknet.com`。挖的是別的礦池或仍停在測試網設定時，這份公開名單可以沒有你的 Worker。頁面也寫明：選中的礦池決定哪些 Worker 紀錄可見，名單不覆蓋每一個礦工。",
        "第三，回到 Mac。MMM 頁說開始挖礦後，Worker 大約一分鐘內出現在 superknet.com 的礦工名單，選單列顯示本機算力和份額。若選單列仍在跳而網頁沒有列，兩邊不是同一份讀數：一邊是本機，一邊是這次抓到的公開名單。若選單列也停了，那是 MMM 自己的狀態，需要你在 Mac 上開始或停止，網頁做不到。",
        "## 兩種名單讀法",
        "舉例（虛構）：最近取得是 12 分鐘前，來源註明礦池資料是舊的。地址正確，Worker 列不存在，你記得份額曾經是 14。不能把「沒有列」加上「12 分鐘」說成機器已關機。舊標記說明名單停在更早的來源時間；沒有列只說明這一份名單沒有該地址。下一步是看 MMM 是否仍選著 Mainnet 和上述礦池，以及選單列是否還在計數。",
        "另一支：列還在，接受份額 14，兩種算力都空白，最近活動 3 分鐘前。這是有活動紀錄但沒有估算，讀法見 [算力與份額](/learn/xid-worker-hashrate-shares)，仍然不是關機證明。",
        "## 這一頁做不到的事",
        "做不到的事：不能遠端重啟 MMM，不能把空白算力寫成 0 MH/s，不能用可見 Worker 人數估計全網還有多少台 Mac，也不能保證一分鐘內名單一定更新。那一分鐘是 MMM 頁對他們瀏覽器名單的說法。",
      ],
      [
        "On [XID / MMM monitoring](/projects/xid), the empty state says there is no Worker for this address in the fetched list, and that this does not prove the miner is offline. Start there. The website does not have your Mac’s process, temperature, power, or menu-bar pickaxe. Those stay in MMM on the machine. The paired agent cannot start or stop MMM either. It controls a Train at Home Mac only.",
        "## Read in this order",
        "First, the last fetch time. When a refresh fails, the previous data keeps its original time. If the latest source record is older than 10 minutes, the page says a successful refresh does not make it current. When the source marks pool data stale, do not treat that roster as the machine’s on/off state at this moment.",
        "Second, the address and the pool. The payout address has to be the full mainnet `xpa1r` string. `txa1r` is retired testnet. See [mainnet and testnet](/learn/xid-mainnet-vs-testnet). The current pool on the MMM mainnet page is `pool.xcoinminer.com` (or the `172.96.186.49` printed there), port `3335`, Network Mainnet, explorer `https://superknet.com`. If you mine somewhere else, or Setup is still on testnet, this public list can omit your Worker. The page also says the selected pool decides which Worker records are visible, and the list does not cover every miner.",
        "Third, go back to the Mac. The MMM page says that after you start, the Worker appears on the superknet.com miner list within about a minute, and the menu bar shows local hashrate and shares. If the menu bar is still moving and the website has no row, those are two readings: one on the Mac, one from this fetch of the public list. If the menu bar has stopped too, that is MMM’s own state. You start or stop it on the Mac. The website cannot.",
        "## Two ways to read the list",
        "Illustrative case, not a measurement: the last fetch was 12 minutes ago, the source marks pool data stale, the address is valid, and there is no Worker row. You remember that shares were once 14. “No row” plus “12 minutes” is not a powered-off Mac. The stale mark means the roster stopped at an earlier source time, and the missing row means this roster has no such address. Next, see whether MMM is still on Mainnet and that pool, and whether the menu bar is still counting. The next check is still MMM on the Mac, not treating a blank web row as powered off.",
        "The other branch: the row is still there, accepted shares are 14, both hashrates are blank, and last activity was 3 minutes ago. That is activity without an estimate. Read it in [hashrate and shares](/learn/xid-worker-hashrate-shares). It is still not proof the Mac is off.",
        "## What this page cannot do",
        "What this page cannot do: restart MMM remotely, write a blank hashrate as 0 MH/s, estimate how many Macs are on the network from the visible Worker count, or guarantee the list updates within a minute. That minute is the MMM page’s statement about their explorer list.",
      ],
      [
        "[XID / MMM 모니터](/projects/xid)에서 주소 아래에는 「가져온 명단에 이 주소의 Worker가 없습니다. 이것은 채굴기가 오프라인이라는 증거가 아닙니다.」라고 있습니다. 여기서 시작합니다. 웹사이트는 Mac의 프로세스, 온도, 전력, 메뉴 막대 곡괭이를 갖지 않습니다. 그것들은 기기의 MMM에만 있습니다. 페어링된 에이전트도 MMM을 켜거나 끄지 못하며, Train at Home Mac만 제어합니다.",
        "## 이 순서로 봅니다",
        "첫째, 최근 조회 시각입니다. 새로고침이 실패하면 이전 데이터의 시각이 남습니다. 출처 기록 자체가 오래됐는데 새로고침이 성공하면, 페이지는 출처 기록이 10분을 넘었다고 말하고, 성공이 기록을 새롭게 만든 것은 아닙니다. 출처가 풀을 오래됐다고 표시하면, 그 명단을 지금의 켜짐/꺼짐으로 보지 않습니다.",
        "둘째, 주소와 풀입니다. 보상 주소는 메인넷 `xpa1r` 전체여야 합니다. `txa1r`는 종료된 테스트넷입니다. [메인넷과 테스트넷](/learn/xid-mainnet-vs-testnet)을 보세요. MMM 메인넷 페이지의 현재 풀은 `pool.xcoinminer.com`(또는 그 페이지의 `172.96.186.49`), 포트 `3335`, 네트워크 Mainnet, 탐색기 `https://superknet.com`입니다. 다른 풀을 캐거나 Setup이 테스트넷이면 이 공개 명단에 Worker가 없을 수 있습니다. 페이지는 선택한 풀이 어떤 Worker 기록이 보이는지를 정하고, 명단이 모든 채굴기를 덮지 않는다고 합니다.",
        "셋째, Mac으로 돌아갑니다. MMM 페이지는 시작 후 약 1분 안에 superknet.com 채굴기 명단에 Worker가 나오고, 메뉴 막대에 로컬 해시레이트와 셰어가 보인다고 합니다. 메뉴 막대는 움직이는데 웹에 행이 없으면 두 읽기입니다. 한쪽은 Mac, 한쪽은 이번 공개 명단입니다. 메뉴 막대도 멈췄다면 그것은 MMM 자신의 상태입니다. Mac에서 켜고 끕니다. 웹사이트는 하지 못합니다.",
        "## 명단을 읽는 두 가지",
        "예시(측정 아님): 최근 조회는 12분 전이고, 출처는 풀 데이터가 오래됐다고 표시합니다. 주소는 맞고 Worker 행은 없으며, 셰어가 한때 14였다고 기억합니다. 「행 없음」과 「12분」을 합쳐 기기가 꺼졌다고 할 수 없습니다. 오래된 표시는 명단이 더 이른 출처 시각에 멈췄다는 뜻이고, 행이 없음은 이 명단에 그 주소가 없다는 뜻입니다. 다음은 MMM이 아직 Mainnet과 그 풀인지, 메뉴 막대가 아직 세고 있는지입니다.",
        "다른 갈래: 행은 있고 수락 셰어는 14, 두 해시레이트는 빈칸, 최근 활동은 3분 전입니다. 추정 없는 활동입니다. [해시레이트와 셰어](/learn/xid-worker-hashrate-shares)에서 읽습니다. 여전히 꺼짐의 증거는 아닙니다.",
        "## 이 페이지가 하지 못하는 일",
        "하지 못하는 일: MMM을 원격으로 재시작하기, 빈 해시레이트를 0 MH/s로 쓰기, 보이는 Worker 수로 네트워크의 Mac 대수를 추정하기, 1분 안에 명단이 갱신된다고 보장하기. 그 1분은 MMM 페이지가 자기 탐색기 명단에 대해 한 말입니다.",
      ],
      [
        "[XID / MMM監視](/projects/xid)では、アドレスの下に「取得した名簿にこのアドレスのWorkerはありません。これはマイナーがオフラインだという証明ではありません。」とあります。ここから判断します。サイトはMacのプロセス、温度、電力、メニューバーのつるはしを持ちません。それらは機械のMMMにだけあります。ペアのエージェントもMMMを遠隔で開始・停止できず、制御するのは Train at Home の Mac だけです。",
        "## この順で見る",
        "第一に最終取得時刻です。取得が失敗すると、前のデータの時刻が残ります。ソース自体が古いまま更新が成功すると、ページはソース記録が10分を超えていると示し、成功が記録を新しくしたことにはなりません。ソースがプールを古いと印したときも、その名簿を今のオン/オフにしません。",
        "第二にアドレスとプールです。報酬アドレスはメインネット `xpa1r` の全文です。`txa1r` は終了したテストネットです。[メインネットとテストネット](/learn/xid-mainnet-vs-testnet)を見てください。MMMメインネットページの現行プールは `pool.xcoinminer.com`（またはそのページの `172.96.186.49`）、ポート `3335`、ネットワークは Mainnet、エクスプローラーは `https://superknet.com` です。別のプールを掘る、またはSetupがテストネットのままだと、この公開名簿にWorkerが無いことがあります。ページは、選んだプールがどのWorker記録が見えるかを決め、名簿はすべてのマイナーを覆わないと書きます。",
        "第三にMacへ戻ります。MMMページは、開始後およそ1分で superknet.com のマイナー名簿にWorkerが出て、メニューバーにローカルの算力とシェアが出ると書きます。メニューバーが動いていてウェブに行が無いなら、二つの読み取りです。一方はMac、一方は今回の公開名簿です。メニューバーも止まっていれば、それはMMM自身の状態です。開始と停止はMacで行います。ウェブはできません。",
        "## 名簿の二つの読み方",
        "例（実測ではない）: 最終取得は12分前、ソースはプールデータが古いと記しています。アドレスは正しく、Worker行は無く、シェアはかつて14だったと覚えています。「行が無い」と「12分」を足して電源オフとは言えません。古い印は名簿がより早いソース時刻で止まったという意味で、行が無いのはこの名簿にそのアドレスが無いという意味です。次はMMMがまだ Mainnet とそのプールか、メニューバーがまだ数えているかです。",
        "もう一方: 行は残り、受理シェアは14、二種類の算力は空欄、最終活動は3分前です。推定の無い活動です。読み方は [ハッシュレートとシェア](/learn/xid-worker-hashrate-shares) にあります。それでも電源オフの証明にはなりません。",
        "## このページにできないこと",
        "できないこと: MMMを遠隔で再起動すること、空欄の算力を 0 MH/s と書くこと、見えるWorker数からネットワーク上のMac台数を見積もること、1分以内に名簿が更新されると保証すること。その1分は、MMMページが自分たちのエクスプローラー名簿について述べた言葉です。",
      ],
    ),
    questions: questions([
      [
        text(
          "没有 Worker 是不是 Mac 睡了？",
          "沒有 Worker 是不是 Mac 睡了？",
          "Does a missing Worker mean the Mac is asleep?",
          "Worker가 없으면 Mac이 잠든 것인가요?",
          "Workerが無いとMacはスリープですか？",
        ),
        text(
          "不能由此证明。它只说明这次公开名单没有这一行。请看 Mac 上的 MMM 是否仍在运行。",
          "不能由此證明。它只說明這次公開名單沒有這一列。請看 Mac 上的 MMM 是否仍在運行。",
          "That does not prove it. It only means this public list has no such row. Look at whether MMM is still running on the Mac.",
          "그것으로 증명되지 않습니다. 이번 공개 명단에 그 행이 없다는 뜻입니다. Mac에서 MMM이 아직 도는지 보세요.",
          "それでは証明できません。今回の公開名簿にその行が無いという意味です。MacでMMMがまだ動いているかを見てください。",
        ),
      ],
      [
        text(
          "网页能看到菜单栏的份额吗？",
          "網頁能看到選單列的份額嗎？",
          "Can the website see menu-bar shares?",
          "웹사이트가 메뉴 막대의 셰어를 보나요?",
          "サイトはメニューバーのシェアを見られますか？",
        ),
        text(
          "不能。菜单栏留在本机。网页只有已读取的公开名单。",
          "不能。選單列留在本機。網頁只有已讀取的公開名單。",
          "No. The menu bar stays on the machine. The website has only the public list it fetched.",
          "아니요. 메뉴 막대는 기기에 남습니다. 웹사이트는 가져온 공개 목록만 있습니다.",
          "いいえ。メニューバーは機械に残ります。サイトにあるのは取得した公開名簿だけです。",
        ),
      ],
      [
        text(
          "一分钟后名单还没有我，正常吗？",
          "一分鐘後名單還沒有我，正常嗎？",
          "I am still missing after a minute. Is that expected?",
          "1분이 지나도 목록에 없습니다. 예상된 일인가요?",
          "1分経っても一覧にありません。想定内ですか？",
        ),
        text(
          "MMM 页说大约一分钟内会出现在他们的浏览器名单。若你的矿池、网络或地址不同，这份名单可以仍然没有你。本站没有测量过那一分钟。",
          "MMM 頁說大約一分鐘內會出現在他們的瀏覽器名單。若你的礦池、網路或地址不同，這份名單可以仍然沒有你。本站沒有測量過那一分鐘。",
          "The MMM page says about a minute on their explorer list. If your pool, network, or address differs, this list can still omit you. This site did not measure that minute.",
          "MMM 페이지는 그들 탐색기 목록에서 약 1분이라고 합니다. 풀, 네트워크, 주소가 다르면 이 목록에 계속 없을 수 있습니다. 이 사이트는 그 1분을 측정하지 않았습니다.",
          "MMMのページは、そこのエクスプローラー一覧ではおよそ1分と書きます。プール、ネットワーク、アドレスが違うと、この名簿にはまだ無いことがあります。このサイトはその1分を測定していません。",
        ),
      ],
    ]),
  },
];
