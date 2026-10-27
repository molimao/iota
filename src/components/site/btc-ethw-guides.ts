import type { Article } from "./articles";
import { localized as l } from "@/lib/product-discovery";
import { LOCALES } from "@/lib/site";

type Five = [string, string, string, string, string];

function plain(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function poolGuide(input: {
  slug: string;
  project: NonNullable<Article["project"]>;
  published?: string;
  title: Five;
  summary: Five;
  decision: Five;
  action: Five;
  comparisonTitle: Five;
  rows: [Five, Five][];
  sections: [Five, Five][];
  related: string[];
  sources: { name: string; url: string }[];
  keywords: Five[];
}): Article {
  return {
    slug: input.slug,
    project: input.project,
    published: input.published ?? "2026-10-23",
    modified: input.published ?? "2026-10-23",
    title: l(input.title),
    description: l(input.summary),
    summary: l(input.summary),
    topic: l(["操作与判断", "操作與判斷", "Checks and decisions", "확인과 판단", "確認と判断"]),
    decision: { title: l(input.decision), action: l(input.action) },
    comparisonTitle: l(input.comparisonTitle),
    comparison: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        {
          headers: l([
            ["观察", "下一步"],
            ["觀察", "下一步"],
            ["Observation", "Next step"],
            ["관찰", "다음 단계"],
            ["状態", "次の行動"],
          ])[locale],
          rows: input.rows.map(([left, right]) => [l(left)[locale], l(right)[locale]]),
        },
      ]),
    ) as NonNullable<Article["comparison"]>,
    body: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        input.sections.flatMap(([heading, body]) => [`## ${l(heading)[locale]}`, l(body)[locale]]),
      ]),
    ) as Article["body"],
    questions: Object.fromEntries(
      LOCALES.map((locale) => [
        locale,
        input.sections.map(([heading, body]) => ({
          question: l(heading)[locale],
          answer: plain(l(body)[locale]),
        })),
      ]),
    ) as NonNullable<Article["questions"]>,
    related: input.related,
    sources: input.sources,
    keywords: Object.fromEntries(
      LOCALES.map((locale, index) => [locale, input.keywords.map((row) => row[index])]),
    ) as NonNullable<Article["keywords"]>,
  };
}

export const btcEthwGuides = [
  poolGuide({
    slug: "btc-mining-monitor-guide",
    project: "btc",
    published: "2026-10-23",
    title: [
      "CKPool 的比特币地址怎么查算力和 Worker？",
      "CKPool 的比特幣地址怎麼查算力和 Worker？",
      "How do I check Bitcoin hashrate and Workers on CKPool?",
      "CKPool에서 비트코인 해시레이트와 Worker를 어떻게 보나요?",
      "CKPoolでビットコインの算力とWorkerを調べるには？",
    ],
    summary: [
      "在 Bitcoin 监控粘贴 solo.ckpool.org 的主网地址。只看该地址的 1 小时算力和 Worker，不把矿池总 Users 当成你的结果，也不编造 BTC 日收益。",
      "在 Bitcoin 監控貼上 solo.ckpool.org 的主網地址。只看該地址的 1 小時算力和 Worker，不把礦池總 Users 當成你的結果，也不編造 BTC 日收益。",
      "Paste the solo.ckpool.org mainnet address on the Bitcoin monitor. You see that address's one-hour hashrate and Workers, not the pool-wide Users total, and no invented daily BTC reward.",
      "Bitcoin 모니터에 solo.ckpool.org 메인넷 주소를 넣습니다. 그 주소의 1시간 해시레이트와 Worker만 보이며, 풀 전체 Users를 결과로 쓰지 않고 BTC 일일 보상을 만들지 않습니다.",
      "Bitcoin監視に solo.ckpool.org のメインネットアドレスを貼ります。そのアドレスの1時間算力とWorkerだけを見ます。プール全体のUsersは結果にせず、BTCの日次報酬も作りません。",
    ],
    decision: [
      "先确认地址属于主网 CKPool",
      "先確認地址屬於主網 CKPool",
      "Confirm the address is mainnet CKPool",
      "먼저 메인넷 CKPool 주소인지 확인",
      "まずメインネットのCKPoolアドレスか確認",
    ],
    action: [
      "[打开 Bitcoin 监控](/projects/btc)，粘贴 1、3、bc1q 或 bc1p，不要粘贴私钥或链接。",
      "[開啟 Bitcoin 監控](/projects/btc)，貼上 1、3、bc1q 或 bc1p，不要貼私鑰或連結。",
      "[Open the Bitcoin monitor](/projects/btc) and paste a 1, 3, bc1q, or bc1p address, not a private key or a link.",
      "[Bitcoin 모니터](/projects/btc)에 1, 3, bc1q, bc1p 주소를 넣고 비밀키나 링크는 넣지 마세요.",
      "[Bitcoin監視](/projects/btc)に1、3、bc1q、bc1pを入れ、秘密鍵やリンクは入れません。",
    ],
    comparisonTitle: [
      "看到什么，下一步做什么",
      "看到什麼，下一步做什麼",
      "What you see, and what to do",
      "무엇이 보이면 다음에 할 일",
      "見えているものと次の行動",
    ],
    rows: [
      [
        [
          "横线，没有 BTC 数字",
          "橫線，沒有 BTC 數字",
          "A dash and no BTC figure",
          "가로줄, BTC 숫자 없음",
          "横線でBTCの数字がない",
        ],
        [
          "来源没有日收益。不要当成 0 或已支付。",
          "來源沒有日收益。不要當成 0 或已支付。",
          "The source has no daily reward. Do not read that as zero or as paid.",
          "출처에 일일 보상이 없습니다. 0이나 지급완료로 읽지 마세요.",
          "出典に日次報酬がありません。0や支払済みと読まないでください。",
        ],
      ],
      [
        [
          "Worker 比地址少",
          "Worker 比地址少",
          "Fewer Workers than the count",
          "Worker가 주소 수보다 적음",
          "Workerが件数より少ない",
        ],
        [
          "列表不完整时会标明。这不是实物矿机台数。",
          "清單不完整時會標明。這不是實物礦機台數。",
          "An incomplete list is marked. It is not a count of physical machines.",
          "목록이 불완전하면 표시됩니다. 실제 기기 수가 아닙니다.",
          "一覧が不完全なら示します。実機数ではありません。",
        ],
      ],
    ],
    sections: [
      [
        [
          "该填哪种比特币地址？",
          "該填哪種比特幣地址？",
          "Which Bitcoin address?",
          "어떤 비트코인 주소인가요?",
          "どのビットコインアドレスですか？",
        ],
        [
          "只接受 CKPool 上校验和正确的主网 P2PKH、P2SH、bc1q SegWit 和 bc1p Taproot。测试网、大小写混用的 bech32、坏校验和、网址和问号参数都会拒绝。查询不会启动 SHA-256 挖矿。",
          "只接受 CKPool 上校驗和正確的主網 P2PKH、P2SH、bc1q SegWit 和 bc1p Taproot。測試網、大小寫混用的 bech32、壞校驗和、網址和問號參數都會拒絕。查詢不會啟動 SHA-256 挖礦。",
          "Only a checksummed mainnet P2PKH, P2SH, bc1q SegWit, or bc1p Taproot address used at CKPool is accepted. Testnet, mixed-case bech32, a bad checksum, a URL, and a query string are rejected. Lookup does not start SHA-256 mining.",
          "CKPool에서 쓰는, 체크섬이 맞는 메인넷 P2PKH, P2SH, bc1q SegWit, bc1p Taproot만 받습니다. 테스트넷, 대소문자 혼합 bech32, 잘못된 체크섬, URL, 쿼리는 거부합니다. 조회는 SHA-256 채굴을 시작하지 않습니다.",
          "CKPoolで使う、チェックサムが正しいメインネットのP2PKH、P2SH、bc1q SegWit、bc1p Taprootだけを受けます。テストネット、大文字小文字混在のbech32、誤ったチェックサム、URL、クエリは拒否します。照会はSHA-256の採掘を始めません。",
        ],
      ],
      [
        [
          "算力和在线怎么判断？",
          "算力和在線怎麼判斷？",
          "How are hashrate and status decided?",
          "해시레이트와 상태는 어떻게 정하나요?",
          "算力と状態はどう決めますか？",
        ],
        [
          "地址和每个 Worker 都用 hashrate1hr，窗口都是 1 小时。矿池没有在线字段。最后份额在 10 分钟内视为在线，更早视为离线，时间缺失或超前则是未知。全网 pool.status 的 Users 和 Workers 含空闲和断开，不能当成这个地址的结果。",
          "地址和每個 Worker 都用 hashrate1hr，視窗都是 1 小時。礦池沒有在線欄位。最後份額在 10 分鐘內視為在線，更早視為離線，時間缺失或超前則是未知。全網 pool.status 的 Users 和 Workers 含閒置和斷開，不能當成這個地址的結果。",
          "The address and every Worker use hashrate1hr, the same one-hour window. The pool has no online field. A last share within 10 minutes is online, older is offline, and a missing or future time is unknown. Users and Workers in the network pool.status include idle and disconnected records and are not this address's result.",
          "주소와 각 Worker는 같은 1시간 창인 hashrate1hr를 씁니다. 풀에 온라인 필드는 없습니다. 마지막 셰어가 10분 안이면 온라인, 그보다 오래되면 오프라인, 시각이 없거나 미래면 알 수 없음입니다. 네트워크 pool.status의 Users와 Workers는 유휴와 끊김을 포함하며 이 주소의 결과가 아닙니다.",
          "アドレスと各Workerは同じ1時間窓のhashrate1hrを使います。プールにオンライン項目はありません。最終シェアが10分以内ならオンライン、それより前ならオフライン、時刻が無いまたは未来なら不明です。ネットワーク pool.status のUsersとWorkersはアイドルと切断を含み、このアドレスの結果ではありません。",
        ],
      ],
      [
        [
          "多个地址怎么保存？",
          "多個地址怎麼儲存？",
          "How do I save more than one address?",
          "주소는 어떻게 여러 개 저장하나요?",
          "複数アドレスはどう保存しますか？",
        ],
        [
          "登录后 [Bitcoin 监控](/projects/btc) 每行一个地址，是一个账户。免费每个项目 3 个，Pro 100 个。同一地址下的多个 Worker 不另占名额。移除只取消保存，不停止矿机。获取时间是香港时间的响应时刻，说明见 [数据来源与新鲜度](/learn/data-sources-and-freshness)。",
          "登入後 [Bitcoin 監控](/projects/btc) 每行一個地址，是一個帳戶。免費每個專案 3 個，Pro 100 個。同一地址下的多個 Worker 不另占名額。移除只取消儲存，不停止礦機。取得時間是香港時間的回應時刻，說明見 [資料來源與新鮮度](/learn/data-sources-and-freshness)。",
          "After sign-in, each line on the [Bitcoin monitor](/projects/btc) is one address and one account. Free is 3 per project and Pro is 100. Workers under one address do not take extra slots. Remove only drops the saved address and does not stop the miner. Fetch time is the Hong Kong response clock. See [sources and freshness](/learn/data-sources-and-freshness).",
          "로그인 후 [Bitcoin 모니터](/projects/btc)의 한 줄이 주소 하나, 계정 하나입니다. 프로젝트당 무료 3개, Pro 100개입니다. 한 주소의 Worker는 추가 한도를 쓰지 않습니다. 제거는 저장된 주소만 빼며 채굴기를 멈추지 않습니다. 조회 시각은 홍콩 시간의 응답 시각입니다. [데이터 출처와 신선도](/learn/data-sources-and-freshness)를 참고하세요.",
          "ログイン後の[Bitcoin監視](/projects/btc)は1行が1アドレス、1口座です。各プロジェクト無料3件、Proは100件です。一つのアドレスのWorkerは追加枠を使いません。削除は保存アドレスを外すだけで、採掘は止めません。取得時刻は香港時間の応答時刻です。[データ源と鮮度](/learn/data-sources-and-freshness)を参照します。",
        ],
      ],
      [
        [
          "日收益为什么是横线？",
          "日收益為什麼是橫線？",
          "Why is daily reward a dash?",
          "일일 보상은 왜 가로줄인가요?",
          "日次報酬はなぜ横線ですか？",
        ],
        [
          "CKPool 用户接口没有日收益、余额或已支付。这三项保持未知，显示横线，不用算力或运气换算法币，也不把空值写成 0。",
          "CKPool 使用者介面沒有日收益、餘額或已支付。這三項保持未知，顯示橫線，不用算力或運氣換算法幣，也不把空值寫成 0。",
          "The CKPool user endpoint has no daily reward, balance, or paid total. Those stay unknown and show a dash. Hashrate and luck are not converted to fiat, and an empty value is not written as zero.",
          "CKPool 사용자 응답에는 일일 보상, 잔액, 지급 합계가 없습니다. 세 값은 알 수 없음으로 가로줄입니다. 해시레이트나 운으로 법정화폐를 만들지 않고, 빈 값을 0으로 쓰지 않습니다.",
          "CKPoolのユーザー応答に日次報酬、残高、支払合計はありません。三つとも不明で横線です。算力や運を法定通貨にせず、空の値を0にしません。",
        ],
      ],
      [
        [
          "Worker 名字从哪来？",
          "Worker 名字從哪來？",
          "Where does the Worker name come from?",
          "Worker 이름은 어디서 오나요?",
          "Worker名はどこから来ますか？",
        ],
        [
          "名字是 workername 去掉「地址加一个点」之后的部分，再截到 80 个字符。没有点、名字就是地址本身时保留地址，不会变成空白。",
          "名字是 workername 去掉「地址加一個點」之後的部分，再截到 80 個字元。沒有點、名字就是地址本身時保留地址，不會變成空白。",
          "The name is workername after the address and one dot are removed, then cut at 80 characters. A bare address with no dot stays the address and does not become blank.",
          "이름은 workername에서 주소와 점 하나를 뺀 뒤 80자로 자릅니다. 점이 없고 이름이 주소 자체이면 주소를 유지하며 빈칸이 되지 않습니다.",
          "名前は workername からアドレスと点一つを除いたあと80文字で切ります。点が無く名前がアドレスそのものならアドレスを残し、空にはしません。",
        ],
      ],
      [
        [
          "列表少了 Worker 怎么办？",
          "清單少了 Worker 怎麼辦？",
          "What if the list has fewer Workers?",
          "목록의 Worker가 적으면요?",
          "一覧のWorkerが少ないときは？",
        ],
        [
          "响应里的 workers 计数可以大于实际返回的 worker 数组。页面保留较大的计数并标明不完整。地址算力用地址自己的 hashrate1hr，不把已返回的 Worker 相加。",
          "回應裡的 workers 計數可以大於實際返回的 worker 陣列。頁面保留較大的計數並標明不完整。地址算力用地址自己的 hashrate1hr，不把已返回的 Worker 相加。",
          "The workers count can be larger than the worker array actually returned. The page keeps the larger count and marks the list incomplete. Address hashrate is the address hashrate1hr, not a sum of the returned Workers.",
          "응답의 workers 수는 실제로 돌아온 worker 배열보다 클 수 있습니다. 페이지는 더 큰 수를 유지하고 목록이 불완전하다고 표시합니다. 주소 해시레이트는 주소의 hashrate1hr이며, 돌아온 Worker를 더하지 않습니다.",
          "応答のworkers件数は、実際に返ったworker配列より大きくなり得ます。ページは大きい件数を残し、一覧が不完全だと示します。アドレス算力はアドレス自身のhashrate1hrで、返ったWorkerの合計ではありません。",
        ],
      ],
    ],
    related: ["etc-mining-monitor-guide", "data-sources-and-freshness"],
    sources: [
      { name: "CKPool solo", url: "https://solo.ckpool.org/" },
      { name: "CKPool pool.status", url: "https://raw.stats.ckpool.org/pool/pool.status" },
      { name: "BIP 173", url: "https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki" },
    ],
    keywords: [
      ["CKPool", "CKPool", "CKPool", "CKPool", "CKPool"],
      ["bc1", "bc1", "bc1", "bc1", "bc1"],
      ["SHA-256", "SHA-256", "SHA-256", "SHA-256", "SHA-256"],
    ],
  }),
  poolGuide({
    slug: "ethw-mining-monitor-guide",
    project: "ethw",
    published: "2026-10-23",
    title: [
      "ETHW 监控该填哪个 0x 地址？",
      "ETHW 監控該填哪個 0x 地址？",
      "Which 0x address belongs on the ETHW monitor?",
      "ETHW 모니터에는 어떤 0x 주소를 넣나요?",
      "ETHW監視にはどの0xアドレスを入れますか？",
    ],
    summary: [
      "EthereumPoW 监控只读 ethw.2miners.com 普通矿池的 0x 地址。SOLO 服务器、以太坊 ETH 余额和空的支付列表都不会被当成累计已支付。",
      "EthereumPoW 監控只讀 ethw.2miners.com 一般礦池的 0x 地址。SOLO 伺服器、以太坊 ETH 餘額和空的支付列表都不會被當成累計已支付。",
      "The EthereumPoW monitor reads only a 0x address on the regular ethw.2miners.com pool. The SOLO server, an Ethereum ETH balance, and an empty payment list are not total paid.",
      "EthereumPoW 모니터는 ethw.2miners.com 일반 풀의 0x 주소만 읽습니다. SOLO 서버, 이더리움 ETH 잔액, 빈 지급 목록은 누적 지급이 아닙니다.",
      "EthereumPoW監視は ethw.2miners.com 通常プールの0xアドレスだけを読みます。SOLOサーバー、イーサリアムのETH残高、空の支払一覧は累計支払ではありません。",
    ],
    decision: [
      "使用普通矿池的 ETHW 地址",
      "使用一般礦池的 ETHW 地址",
      "Use the regular-pool ETHW address",
      "일반 풀의 ETHW 주소를 사용",
      "通常プールのETHWアドレスを使う",
    ],
    action: [
      "[打开 EthereumPoW 监控](/projects/ethw)，粘贴 0x 地址，不要打开 solo-ethw.2miners.com。",
      "[開啟 EthereumPoW 監控](/projects/ethw)，貼上 0x 地址，不要打開 solo-ethw.2miners.com。",
      "[Open the EthereumPoW monitor](/projects/ethw) and paste the 0x address. Do not open solo-ethw.2miners.com.",
      "[EthereumPoW 모니터](/projects/ethw)에 0x 주소를 넣고 solo-ethw.2miners.com은 열지 마세요.",
      "[EthereumPoW監視](/projects/ethw)に0xアドレスを入れ、solo-ethw.2miners.comは開きません。",
    ],
    comparisonTitle: [
      "账户数字分别是什么",
      "帳戶數字分別是什麼",
      "What each account figure is",
      "계정 숫자가 각각 무엇인지",
      "口座の数字がそれぞれ何か",
    ],
    rows: [
      [
        ["没有 paid 字段", "沒有 paid 欄位", "No paid field", "paid 필드 없음", "paid項目がない"],
        [
          "显示横线。不要把空 payments 或 sumrewards 加成已支付。",
          "顯示橫線。不要把空 payments 或 sumrewards 加成已支付。",
          "A dash is shown. Do not add empty payments or sumrewards into paid.",
          "가로줄입니다. 빈 payments나 sumrewards를 지급액에 더하지 마세요.",
          "横線です。空のpaymentsやsumrewardsを支払額に足さないでください。",
        ],
      ],
      [
        [
          "想看 24 小时 Worker 曲线",
          "想看 24 小時 Worker 曲線",
          "A 24-hour Worker chart",
          "24시간 Worker 곡선",
          "24時間のWorker曲線",
        ],
        [
          "公开范围只有 5 分钟、30 分钟和 6 小时。",
          "公開範圍只有 5 分鐘、30 分鐘和 6 小時。",
          "The public ranges are only 5 minutes, 30 minutes, and 6 hours.",
          "공개 범위는 5분, 30분, 6시간뿐입니다.",
          "公開範囲は5分、30分、6時間だけです。",
        ],
      ],
    ],
    sections: [
      [
        [
          "这是 ETHW 还是 ETH？",
          "這是 ETHW 還是 ETH？",
          "Is this ETHW or ETH?",
          "ETHW인가요, ETH인가요?",
          "ETHWですか、ETHですか？",
        ],
        [
          "这是 EthereumPoW，算法是 ETHash。相似的 0x 文本可以出现在以太坊上，交易所里的 ETH 不是这口矿池的未支付 ETHW。本页只读 ethw.2miners.com。官方 API 把 solo-ethw.2miners.com 列为另一台服务器。",
          "這是 EthereumPoW，演算法是 ETHash。相似的 0x 文字可以出現在以太坊上，交易所裡的 ETH 不是這口礦池的未支付 ETHW。本頁只讀 ethw.2miners.com。官方 API 把 solo-ethw.2miners.com 列為另一台伺服器。",
          "This is EthereumPoW and the algorithm is ETHash. Similar 0x text can exist on Ethereum. An ETH exchange balance is not this pool's unpaid ETHW. This page reads only ethw.2miners.com. The API lists solo-ethw.2miners.com as another server.",
          "이것은 EthereumPoW이고 알고리즘은 ETHash입니다. 비슷한 0x 문자가 이더리움에 있을 수 있습니다. 거래소 ETH 잔액은 이 풀의 미지급 ETHW가 아닙니다. 이 페이지는 ethw.2miners.com만 읽습니다. API는 solo-ethw.2miners.com을 다른 서버로 적습니다.",
          "これはEthereumPoWで、アルゴリズムはETHashです。似た0x表記がイーサリアムにあり得ます。取引所のETH残高は、このプールの未払いETHWではありません。このページは ethw.2miners.com だけを読みます。APIは solo-ethw.2miners.com を別サーバーとして載せます。",
        ],
      ],
      [
        [
          "余额和近 24 小时怎么读？",
          "餘額和近 24 小時怎麼讀？",
          "How do I read balance and the last 24 hours?",
          "잔액과 최근 24시간은 어떻게 읽나요?",
          "残高と直近24時間はどう読みますか？",
        ],
        [
          "未支付余额、累计已支付和近 24 小时是账户支付单位，和 2Miners 账户页对 DH 类型的支付倍率一致。区块奖励展示用的另一套倍率不用于这三项。没有 paid 就保持未知。近 24 小时不是 IOTA 的昨日记账。",
          "未支付餘額、累計已支付和近 24 小時是帳戶支付單位，和 2Miners 帳戶頁對 DH 類型的支付倍率一致。區塊獎勵展示用的另一套倍率不用於這三項。沒有 paid 就保持未知。近 24 小時不是 IOTA 的昨日記帳。",
          "Unpaid balance, total paid, and the last 24 hours use the account payment unit, the same DH payment multiplier as the 2Miners account page. The separate block-reward multiplier is not used for those three. A missing paid field stays unknown. The last 24 hours are not IOTA's previous-day ledger.",
          "미지급 잔액, 누적 지급, 최근 24시간은 계정 지급 단위이며 2Miners 계정 페이지의 DH 지급 배율과 같습니다. 블록 보상 표시용 다른 배율은 이 세 값에 쓰지 않습니다. paid가 없으면 알 수 없음입니다. 최근 24시간은 IOTA의 어제 장부가 아닙니다.",
          "未払い残高、累計支払、直近24時間は口座の支払い単位で、2Miners口座ページのDH支払い倍率と同じです。ブロック報酬表示用の別倍率はこの三つに使いません。paidが無ければ不明のままです。直近24時間はIOTAの前日台帳ではありません。",
        ],
      ],
      [
        [
          "多个地址和 Worker 怎么计名额？",
          "多個地址和 Worker 怎麼計名額？",
          "How are addresses and Workers counted?",
          "주소와 Worker는 한도를 어떻게 쓰나요?",
          "アドレスとWorkerの枠は？",
        ],
        [
          "登录后 [EthereumPoW 监控](/projects/ethw) 每行一个 0x 地址，是一个账户。免费每个项目 3 个，Pro 100 个。Worker 不另占名额，也不等于一台实物机器。移除只取消保存。获取时间见 [数据来源与新鲜度](/learn/data-sources-and-freshness)。",
          "登入後 [EthereumPoW 監控](/projects/ethw) 每行一個 0x 地址，是一個帳戶。免費每個專案 3 個，Pro 100 個。Worker 不另占名額，也不等於一台實物機器。移除只取消儲存。取得時間見 [資料來源與新鮮度](/learn/data-sources-and-freshness)。",
          "After sign-in, each line on the [EthereumPoW monitor](/projects/ethw) is one 0x address and one account. Free is 3 per project and Pro is 100. Workers do not take extra slots and are not one physical machine each. Remove only drops the save. See [sources and freshness](/learn/data-sources-and-freshness) for fetch time.",
          "로그인 후 [EthereumPoW 모니터](/projects/ethw)의 한 줄이 0x 주소 하나, 계정 하나입니다. 프로젝트당 무료 3개, Pro 100개입니다. Worker는 추가 한도를 쓰지 않고 실제 기기 한 대도 아닙니다. 제거는 저장만 뺍니다. 조회 시각은 [데이터 출처와 신선도](/learn/data-sources-and-freshness)를 보세요.",
          "ログイン後の[EthereumPoW監視](/projects/ethw)は1行が0xアドレス1件、1口座です。各プロジェクト無料3件、Proは100件です。Workerは追加枠を使わず、実機1台でもありません。削除は保存を外すだけです。取得時刻は[データ源と鮮度](/learn/data-sources-and-freshness)を見てください。",
        ],
      ],
      [
        [
          "已支付为什么不是 0？",
          "已支付為什麼不是 0？",
          "Why is paid not zero?",
          "지급액은 왜 0이 아닌가요?",
          "支払額はなぜ0ではないのですか？",
        ],
        [
          "官方账户可以只有 stats.balance，没有 paid。payments 为空或 paymentsTotal 为 0 时，不把它们写成累计已支付，也不把 sumrewards 相加后填进已支付。",
          "官方帳戶可以只有 stats.balance，沒有 paid。payments 為空或 paymentsTotal 為 0 時，不把它們寫成累計已支付，也不把 sumrewards 相加後填進已支付。",
          "An official account can have stats.balance and no paid field. Empty payments or paymentsTotal 0 are not written as lifetime paid, and sumrewards is not added into paid.",
          "공식 계정은 stats.balance만 있고 paid가 없을 수 있습니다. payments가 비었거나 paymentsTotal이 0이어도 누적 지급으로 쓰지 않고, sumrewards를 더해 지급액에 넣지 않습니다.",
          "公式口座は stats.balance だけで paid が無いことがあります。payments が空、または paymentsTotal が 0 でも累計支払にはせず、sumrewards を足して支払額にしません。",
        ],
      ],
      [
        [
          "Worker 曲线有 24 小时吗？",
          "Worker 曲線有 24 小時嗎？",
          "Is there a 24-hour Worker chart?",
          "Worker 곡선에 24시간이 있나요?",
          "Worker曲線に24時間はありますか？",
        ],
        [
          "公开的 Worker 历史范围是 5 分钟、30 分钟和 6 小时。页面不编造 24 小时曲线。账户上的 24 小时奖励是单独字段，和曲线范围不是同一件事。",
          "公開的 Worker 歷史範圍是 5 分鐘、30 分鐘和 6 小時。頁面不編造 24 小時曲線。帳戶上的 24 小時獎勵是單獨欄位，和曲線範圍不是同一件事。",
          "Public Worker history ranges are 5 minutes, 30 minutes, and 6 hours. The page does not invent a 24-hour chart. The account 24-hour reward is a separate field and is not that chart.",
          "공개 Worker 기록 범위는 5분, 30분, 6시간입니다. 페이지는 24시간 곡선을 만들지 않습니다. 계정의 24시간 보상은 별도 필드이며 그 곡선이 아닙니다.",
          "公開のWorker履歴は5分、30分、6時間です。ページは24時間の曲線を作りません。口座の24時間報酬は別項目で、その曲線ではありません。",
        ],
      ],
      [
        [
          "会查 SOLO 矿池吗？",
          "會查 SOLO 礦池嗎？",
          "Does this query the SOLO pool?",
          "SOLO 풀도 조회하나요?",
          "SOLOプールも照会しますか？",
        ],
        [
          "不会。监控只请求普通矿池 ethw.2miners.com。不要把 solo-ethw.2miners.com 的地址或结果混进这一页。",
          "不會。監控只請求一般礦池 ethw.2miners.com。不要把 solo-ethw.2miners.com 的地址或結果混進這一頁。",
          "No. The monitor requests only the regular pool ethw.2miners.com. Do not mix an address or result from solo-ethw.2miners.com into this page.",
          "하지 않습니다. 모니터는 일반 풀 ethw.2miners.com만 요청합니다. solo-ethw.2miners.com의 주소나 결과를 이 페이지에 섞지 마세요.",
          "しません。監視は通常プール ethw.2miners.com だけを要求します。solo-ethw.2miners.com のアドレスや結果をこのページに混ぜないでください。",
        ],
      ],
    ],
    related: ["etc-mining-monitor-guide", "data-sources-and-freshness"],
    sources: [
      { name: "2Miners · ETHW help", url: "https://ethw.2miners.com/help" },
      { name: "2Miners · ETHW", url: "https://ethw.2miners.com/" },
      { name: "2Miners · API documentation", url: "https://github.com/2miners/apidoc" },
    ],
    keywords: [
      ["ETHash", "ETHash", "ETHash", "ETHash", "ETHash"],
      ["ETHW", "ETHW", "ETHW", "ETHW", "ETHW"],
      ["0x", "0x", "0x", "0x", "0x"],
    ],
  }),
];
