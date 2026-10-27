import type { Article } from "../articles";

type L = Record<"zh" | "zh-TW" | "en" | "ko" | "ja", string>;
const t = (zh: string, zhTW: string, en: string, ko: string, ja: string): L => ({
  zh,
  "zh-TW": zhTW,
  en,
  ko,
  ja,
});

const cash = {
  name: "Midstate · protocol, MSS and binary denominations",
  url: "https://midstate.cash/",
};
const pools = {
  name: "Midstate · Stratum pool guide",
  url: "https://github.com/ciphernom/midstate/blob/main/pools.md",
};
const lucky = { name: "LuckyPool · Midstate", url: "https://midstate.luckypool.io/" };
const reader = {
  name: "IOTA Watch · Midstate account reader",
  url: "https://github.com/molimao/iota/blob/main/src/lib/pool-monitor.ts",
};

const monitor = "/projects/mds";
const slugWallet = "mds-wallet-luckypool-setup";
const slugUnits = "mds-nonces-hashrate-units";
const slugBalances = "mds-locked-unlocked-paid";
const slugWorkers = "mds-worker-share-troubleshooting";
const slugPrimary = "midstate-mds-monitor-guide";

export const mdsDepthGuides: Article[] = [
  {
    slug: slugPrimary,
    project: "mds",
    published: "2026-10-17",
    modified: "2026-10-24",
    comparisonTitle: t(
      "先看哪一行",
      "先看哪一列",
      "Which line answers which question",
      "어느 줄을 먼저 볼까",
      "どの行を先に見るか",
    ),
    comparison: {
      zh: {
        headers: ["页面上的数", "它代表什么", "不要把它当成"],
        rows: [
          ["未支付 · 含锁定", "可用与锁定相加，单位是 1 MDS", "已经进钱包的转账，或美元"],
          ["累计已支付", "矿池累计转出", "近 24 小时的新分配"],
          ["近 24 小时", "刚好 24 小时窗口里的区块分配", "已经能花的余额"],
          ["算力", "账户速率，十进制前缀后标 nonces/s", "币的 mMDS 或 gMDS"],
          ["Worker", "名称、速率、最后份额；15 分钟内有份额为在线", "设备心跳，或余额分成"],
        ],
      },
      "zh-TW": {
        headers: ["頁面上的數", "它代表什麼", "不要把它當成"],
        rows: [
          ["未支付 · 含鎖定", "可用與鎖定相加，單位是 1 MDS", "已經進錢包的轉帳，或美元"],
          ["累計已支付", "礦池累計轉出", "近 24 小時的新分配"],
          ["近 24 小時", "剛好 24 小時窗口裡的區塊分配", "已經能花的餘額"],
          ["算力", "帳戶速率，十進位前綴後標 nonces/s", "幣的 mMDS 或 gMDS"],
          ["Worker", "名稱、速率、最後份額；15 分鐘內有份額為在線", "裝置心跳，或餘額分成"],
        ],
      },
      en: {
        headers: ["Line", "What it is", "What it is not"],
        rows: [
          [
            "Unpaid · including locked",
            "Unlocked plus locked, in units of 1 MDS",
            "A transfer already in the wallet, or dollars",
          ],
          ["Cumulative paid", "Transfers the pool has sent", "The new 24-hour allocation"],
          [
            "Last 24 hours",
            "Block allocation inside a window of exactly 24 hours",
            "Spendable balance",
          ],
          ["Hashrate", "Account rate, decimal prefix, then nonces/s", "The coin’s mMDS or gMDS"],
          [
            "Worker",
            "Name, rate, last share; online means a share within 15 minutes",
            "A machine heartbeat, or a slice of the balance",
          ],
        ],
      },
      ko: {
        headers: ["화면의 수", "의미", "이것이 아닌 것"],
        rows: [
          [
            "미지급 · 잠금 포함",
            "사용 가능과 잠금의 합, 단위 1 MDS",
            "이미 지갑에 들어온 송금, 또는 달러",
          ],
          ["누적 지급", "풀이 보낸 누적 송금", "최근 24시간의 새 배분"],
          ["최근 24시간", "정확히 24시간 창의 블록 배분", "쓸 수 있는 잔액"],
          ["해시레이트", "계정 속도, 십진 접두 뒤 nonces/s", "코인의 mMDS 또는 gMDS"],
          ["워커", "이름, 속도, 마지막 지분. 15분 안이면 온라인", "기기 하트비트, 또는 잔액 분할"],
        ],
      },
      ja: {
        headers: ["画面の数", "意味", "これではないもの"],
        rows: [
          [
            "未払い・ロック含む",
            "使用可能とロックの和。単位は 1 MDS",
            "すでにウォレットへ着いた送金、またはドル",
          ],
          ["累計支払", "プールが送った累計", "直近24時間の新しい配分"],
          ["直近24時間", "ちょうど24時間の窓のブロック配分", "使える残高"],
          ["処理速度", "口座の速度。十進の接頭辞のあと nonces/s", "コインの mMDS または gMDS"],
          [
            "ワーカー",
            "名前、速度、最終シェア。15分以内ならオンライン",
            "機器の心拍、または残高の分割",
          ],
        ],
      },
    },
    sources: [cash, pools, lucky, reader],
    related: [slugWallet, slugBalances],
    topic: t("查账顺序", "查帳順序", "What to check", "조회 순서", "確認の順番"),
    title: t(
      "Midstate MDS 怎么查矿池收益？地址、Worker 与单位说明",
      "Midstate MDS 如何查礦池收益？地址、Worker 與單位",
      "How to check Midstate MDS pool rewards, addresses and units",
      "Midstate MDS 풀 보상·주소·단위를 확인하는 방법",
      "Midstate MDSのプール報酬・アドレス・単位を確認する",
    ),
    description: t(
      "在 MDS 监控粘贴矿工正在使用的 64 位小写 MSS 地址，只读 LuckyPool 这一本账：未支付（锁定加可用）、累计已支付、滚动 24 小时区块分配、nonces/s 和 Worker。其他矿池不会被加进来。",
      "在 MDS 監控貼上礦工正在使用的 64 位小寫 MSS 地址，只讀 LuckyPool 這一本帳：未支付（鎖定加可用）、累計已支付、滾動 24 小時區塊分配、nonces/s 與 Worker。其他礦池不會被加進來。",
      "Paste the 64-character lowercase MSS address the miner is using. MDS monitoring reads one LuckyPool ledger: unpaid (locked plus unlocked), cumulative paid, a rolling 24-hour block allocation, nonces/s, and workers. Other pools are not added in.",
      "채굴기가 쓰는 64자리 소문자 MSS 주소를 MDS 모니터에 붙입니다. LuckyPool 장부 하나만 읽습니다. 미지급(잠금+사용 가능), 누적 지급, 롤링 24시간 블록 배분, nonces/s, 워커입니다. 다른 풀은 더하지 않습니다.",
      "マイナーが使っている64桁小文字のMSSをMDS監視に貼ります。読むのはLuckyPoolの台帳一つです。未払い（ロック＋使用可能）、累計支払、ローリング24時間のブロック配分、nonces/s、ワーカーです。他プールは足しません。",
    ),
    summary: t(
      "先对上矿池和 MSS 收款地址，再读未支付、已支付和 24 小时分配。算力是 nonces/s。钱包总额不拆到 Worker，也不换算美元。",
      "先對上礦池和 MSS 收款地址，再讀未支付、已支付和 24 小時分配。算力是 nonces/s。錢包總額不拆到 Worker，也不換算美元。",
      "Match the pool and the MSS payout address before reading unpaid, paid, and the 24-hour allocation. The rate is nonces/s. The wallet total is not split onto workers and is not converted to dollars.",
      "풀과 MSS 지급 주소를 맞춘 다음 미지급·지급·24시간 배분을 읽습니다. 속도는 nonces/s입니다. 지갑 합계는 워커로 나누지 않고 달러로 바꾸지 않습니다.",
      "プールとMSS受取アドレスを合わせてから、未払い・支払・24時間配分を読みます。速度はnonces/sです。ウォレット合計はワーカーに分けず、ドルにも換えません。",
    ),
    body: {
      zh: [
        "能在 [MDS 监控](/projects/mds) 对上的，只有矿工实际把份额交给 LuckyPool、且收款地址是 64 位小写十六进制 MSS 的那一本账。官方矿工命令是 `midstate miner --pool-url stratum+tcp://矿池:3333 --payout-address <PAYOUT_ADDRESS>`。反复收款必须来自 `wallet generate-mss`，不要用一次性的 `wallet receive`。本页不安装矿工，也不查询你自己架的 Stratum。",
        "## 先分清没有记录和机器停了",
        "按这个顺序看，避免把“没有记录”读成“机器停了”。",
        "- 在矿工配置里确认接入点就是 LuckyPool，并抄下 `--payout-address`。自建池的审核接口不是本站的数据源。",
        "- 打开监控，粘贴 64 位小写十六进制。页面只检查形状。私钥、助记词、钱包文件和 `mw1` 地址都不能保存。",
        "- 地址对上之后再读金额。未支付一行是锁定加可用，标签为「未支付 · 含锁定」。累计已支付是另一列。近 24 小时是矿池给出的区块分配，窗口必须刚好 24 小时才显示；它不是这段时间的转账。",
        "- 算力读 nonces/s。Worker 行有名称、该 Worker 的速率和最后份额时间；最近 15 分钟内有份额算在线。钱包金额不抄到某一个 Worker 名下。",
        "## 五行分别回答什么",
        "对照表把未支付、已支付、24 小时分配、算力和 Worker 分开。金额用基础 MDS 整数，不换成美元。",
        "## 一组只用来看加法的数",
        "下面是一组示意数字，用来看未支付怎么由可用和锁定相加。假设 LuckyPool 返回可用 1024、锁定 1048576。未支付显示 1049600 MDS，也就是协议里的 1 mMDS 再加 1024 MDS。已支付若为 1073741824，那是另一列，等于协议里的 1 gMDS，不会并进未支付。官方矿工状态屏的示例打印是 301.20 nonces/s；若账户速率是 301，本页显示 `301 nonces/s`。不要把 301 去除 1,048,576。",
        "## 金额、缺数和已保存设备",
        "本页不报 LuckyPool 手续费，也不承诺何时打款。协议页的币单位是二进制：1 kMDS = 1,024 MDS，1 mMDS = 1,048,576 MDS，1 gMDS = 1,073,741,824 MDS。监控按基础 MDS 整数显示，不另写 mMDS 标签。合并挖矿的 Midwimble（`mw1`）不在这本账里。查无此地址只说明 LuckyPool 没有这串 MSS，solo 或其他池仍可能在挖。接口缺数保持未知，不改写成 0。未登录时地址列表留在当前浏览器；登录后，每个项目免费可保存 3 台设备，Pro 为 100 台。同一地址下自动出现的 Worker 不另占一台；只有另外把 Worker 保存成独立设备时，那条记录才计数。同一台已保存设备上的多个来源不重复计数。崩溃日志解读不占用这个名额，也不会写成 MDS 收益。本站 Agent 只控制 Train at Home 的 Mac，不能开关 Midstate 矿工。",
        "接着看 [MSS 地址和 LuckyPool 怎么对上](/learn/mds-wallet-luckypool-setup)，以及 [锁定、可用和已支付](/learn/mds-locked-unlocked-paid)。",
      ],
      "zh-TW": [
        "能在 [MDS 監控](/projects/mds) 對上的，只有礦工實際把份額交給 LuckyPool、且收款地址是 64 位小寫十六進位 MSS 的那一本帳。官方礦工命令是 `midstate miner --pool-url stratum+tcp://礦池:3333 --payout-address <PAYOUT_ADDRESS>`。反覆收款必須來自 `wallet generate-mss`，不要用一次性的 `wallet receive`。本頁不安裝礦工，也不查詢你自己架的 Stratum。",
        "## 先分清沒有紀錄和機器停了",
        "按這個順序看，避免把「沒有紀錄」讀成「機器停了」。",
        "- 在礦工設定確認接入點就是 LuckyPool，並抄下 `--payout-address`。自建池的審核介面不是本站的資料來源。",
        "- 打開監控，貼上 64 位小寫十六進位。頁面只檢查形狀。私鑰、助記詞、錢包檔和 `mw1` 地址都不能保存。",
        "- 地址對上之後再讀金額。未支付一行是鎖定加可用，標籤為「未支付 · 含鎖定」。累計已支付是另一欄。近 24 小時是礦池給出的區塊分配，窗口必須剛好 24 小時才顯示；它不是這段時間的轉帳。",
        "- 算力讀 nonces/s。Worker 列有名稱、該 Worker 的速率和最後份額時間；最近 15 分鐘內有份額算在線。錢包金額不抄到某一個 Worker 名下。",
        "## 五列分別回答什麼",
        "對照表把未支付、已支付、24 小時分配、算力和 Worker 分開。金額用基礎 MDS 整數，不換成美元。",
        "## 一組只用來看加法的數",
        "下面是一組示意數字，用來看未支付怎麼由可用和鎖定相加。假設 LuckyPool 返回可用 1024、鎖定 1048576。未支付顯示 1049600 MDS，也就是協議裡的 1 mMDS 再加 1024 MDS。已支付若為 1073741824，那是另一欄，等於協議裡的 1 gMDS，不會併進未支付。官方礦工狀態畫面的示例是 301.20 nonces/s；若帳戶速率是 301，本頁顯示 `301 nonces/s`。不要把 301 去除 1,048,576。",
        "## 金額、缺數和已保存裝置",
        "本頁不報 LuckyPool 手續費，也不承諾何時打款。協議頁的幣單位是二進位：1 kMDS = 1,024 MDS，1 mMDS = 1,048,576 MDS，1 gMDS = 1,073,741,824 MDS。監控按基礎 MDS 整數顯示，不另寫 mMDS 標籤。合併挖礦的 Midwimble（`mw1`）不在這本帳裡。查無此地址只說明 LuckyPool 沒有這串 MSS，solo 或其他池仍可能在挖。介面缺數保持未知，不改寫成 0。未登入時地址清單留在目前瀏覽器；登入後，每個專案免費可保存 3 台裝置，Pro 為 100 台。同一地址下自動出現的 Worker 不另占一台；只有另外把 Worker 保存成獨立裝置時，那條紀錄才計數。同一台已保存裝置上的多個來源不重複計數。當機日誌解讀不占用這個名額，也不會寫成 MDS 收益。本站 Agent 只控制 Train at Home 的 Mac，不能開關 Midstate 礦工。",
        "接著看 [MSS 地址和 LuckyPool 怎麼對上](/learn/mds-wallet-luckypool-setup)，以及 [鎖定、可用和已支付](/learn/mds-locked-unlocked-paid)。",
      ],
      en: [
        "The row that [MDS monitoring](/projects/mds) can open is the LuckyPool ledger for the 64-character lowercase hex MSS address the miner is actually submitting. The official client is `midstate miner --pool-url stratum+tcp://pool:3333 --payout-address <PAYOUT_ADDRESS>`. Repeated payouts have to come from `wallet generate-mss`, not one-time `wallet receive`. This page does not install a miner and does not query a Stratum host you run yourself.",
        "## A missing row is not a stopped machine",
        "Read in this order so a missing row is not mistaken for a stopped machine.",
        "- In the miner config, confirm the endpoint is LuckyPool and copy `--payout-address`. A self-hosted pool’s audit API is not this site’s source.",
        "- Open monitoring and paste 64 lowercase hex characters. The page checks the shape only. A private key, seed, wallet file, or `mw1` address cannot be saved.",
        "- Read amounts only after the address matches. The unpaid line adds locked and unlocked and is labeled “Unpaid · including locked”. Cumulative paid is a separate figure. The last-24-hour line is the pool’s block allocation, and it appears only when that window is exactly 24 hours. It is not the transfers sent during that window.",
        "- Read hashrate as nonces/s. Each worker row has a name, that worker’s rate, and the last share time. A share inside 15 minutes counts as online. Do not copy the wallet amounts onto one worker name.",
        "## Five lines, five questions",
        "The comparison keeps unpaid, paid, the 24-hour allocation, hashrate, and workers apart. Amounts stay in base MDS integers and are not converted to dollars.",
        "## Integers that only show the addition",
        "The next integers are an illustration of how unpaid adds unlocked and locked. If LuckyPool returned unlocked 1024 and locked 1048576, unpaid shows 1049600 MDS: 1 mMDS in the protocol plus 1024 MDS. If paid is 1073741824, that stays on its own line. In protocol units it is 1 gMDS, and it is not folded into unpaid. The official miner status sample prints 301.20 nonces/s. An account rate of 301 is shown here as `301 nonces/s`. Do not divide 301 by 1,048,576.",
        "## Amounts, gaps, and saved devices",
        "This page does not quote a LuckyPool fee or promise a payout time. On the protocol site the coin steps are binary: 1 kMDS = 1,024 MDS, 1 mMDS = 1,048,576 MDS, 1 gMDS = 1,073,741,824 MDS. Monitoring prints the base MDS integer and does not add an mMDS label. Merge-mined Midwimble (`mw1`) is not on this ledger. Not-found means LuckyPool has no such MSS. Solo or another pool can still be mining. A missing figure stays unknown and is not rewritten as 0. Signed-out address lists stay in the current browser. After sign-in, Free keeps three saved devices per project and Pro keeps 100. Worker rows that appear under one address do not add a device. A worker counts only when you save it as its own device. Several sources on the same saved device do not add slots. Crash-log interpretation does not use that quota and does not become an MDS earnings report. The Agent on this site controls a Train at Home Mac only. It cannot start or stop a Midstate miner.",
        "Continue with [matching the MSS address to LuckyPool](/learn/mds-wallet-luckypool-setup) and [locked, unlocked, and paid](/learn/mds-locked-unlocked-paid).",
      ],
      ko: [
        "[MDS 모니터](/projects/mds)가 열 수 있는 행은, 채굴기가 실제로 지분을 보낸 LuckyPool 장부이고 주소는 64자리 소문자 16진수 MSS입니다. 공식 클라이언트는 `midstate miner --pool-url stratum+tcp://풀:3333 --payout-address <PAYOUT_ADDRESS>`입니다. 반복 지급은 `wallet generate-mss`에서 와야 하며 일회용 `wallet receive`가 아닙니다. 이 페이지는 채굴기를 설치하지 않고, 직접 띄운 Stratum도 조회하지 않습니다.",
        "## 없는 행은 기계 정지가 아닙니다",
        "없는 행을 기계 정지로 읽지 않도록 이 순서로 봅니다.",
        "- 채굴기 설정에서 접속점이 LuckyPool인지 확인하고 `--payout-address`를 복사합니다. 자체 풀의 감사 API는 이 사이트의 출처가 아닙니다.",
        "- 모니터를 열고 64자리 소문자 16진수를 붙입니다. 모양만 검사합니다. 비밀키, 시드, 지갑 파일, `mw1` 주소는 저장되지 않습니다.",
        "- 주소가 맞은 뒤에 금액을 읽습니다. 미지급 줄은 잠금과 사용 가능을 더하며 표기는 「미지급 · 잠금 포함」입니다. 누적 지급은 별도입니다. 최근 24시간은 풀이 준 블록 배분이고, 창이 정확히 24시간일 때만 나옵니다. 그 사이 보낸 송금이 아닙니다.",
        "- 해시레이트는 nonces/s입니다. 워커 행에는 이름, 그 워커의 속도, 마지막 지분 시각이 있습니다. 15분 안의 지분이 온라인입니다. 지갑 금액을 워커 이름 하나에 옮기지 마세요.",
        "## 다섯 줄은 다섯 질문입니다",
        "대조표는 미지급, 지급, 24시간 배분, 해시레이트, 워커를 나눕니다. 금액은 기본 MDS 정수이고 달러로 바꾸지 않습니다.",
        "## 덧셈만 보여주는 정수",
        "다음 정수는 미지급이 사용 가능과 잠금을 어떻게 더하는지 보여주는 예시입니다. LuckyPool이 사용 가능 1024, 잠금 1048576을 돌려주면 미지급은 1049600 MDS입니다. 프로토콜의 1 mMDS에 1024 MDS를 더한 값입니다. 지급이 1073741824이면 그 줄에만 남습니다. 프로토콜로는 1 gMDS이고 미지급에 넣지 않습니다. 공식 채굴기 상태 예시 출력은 301.20 nonces/s입니다. 계정 속도가 301이면 여기에는 `301 nonces/s`로 나옵니다. 301을 1,048,576으로 나누지 마세요.",
        "## 금액, 빈칸, 저장 기기",
        "이 페이지는 LuckyPool 수수료를 적지 않고 지급 시각을 약속하지 않습니다. 프로토콜 사이트의 코인 단계는 이진입니다. 1 kMDS = 1,024 MDS, 1 mMDS = 1,048,576 MDS, 1 gMDS = 1,073,741,824 MDS. 모니터는 기본 MDS 정수를 찍고 mMDS 라벨을 붙이지 않습니다. 병합 채굴 Midwimble(`mw1`)은 이 장부에 없습니다. 주소 없음은 LuckyPool에 그 MSS가 없다는 뜻입니다. 솔로나 다른 풀은 계속 캘 수 있습니다. 빠진 수는 알 수 없음으로 두고 0으로 바꾸지 않습니다. 로그아웃 목록은 현재 브라우저에 남습니다. 로그인 후 프로젝트당 무료 저장 기기는 3대, Pro는 100대입니다. 한 주소 아래 자동으로 보이는 워커 행은 기기를 더하지 않습니다. 워커를 따로 기기로 저장할 때만 그 기록이 셉니다. 같은 저장 기기의 여러 출처는 자리를 더하지 않습니다. 충돌 로그 해석은 이 한도를 쓰지 않고 MDS 수익 보고가 되지 않습니다. 이 사이트의 Agent는 Train at Home Mac만 제어하며 Midstate 채굴기를 켜거나 끄지 않습니다.",
        "이어서 [MSS 주소와 LuckyPool을 맞추기](/learn/mds-wallet-luckypool-setup)와 [잠금·사용 가능·지급](/learn/mds-locked-unlocked-paid)을 보세요.",
      ],
      ja: [
        "[MDS監視](/projects/mds)が開ける行は、マイナーが実際にシェアを渡しているLuckyPoolの台帳で、アドレスは64桁の小文字16進MSSです。公式クライアントは `midstate miner --pool-url stratum+tcp://プール:3333 --payout-address <PAYOUT_ADDRESS>` です。繰り返しの受取は `wallet generate-mss` から来ます。使い捨てる `wallet receive` ではありません。このページはマイナーを導入せず、自分で立てたStratumも問い合わせません。",
        "## 記録がないことはマシン停止ではない",
        "記録がないことをマシン停止と読まないよう、この順で見ます。",
        "- マイナー設定で接続先がLuckyPoolであることを確認し、`--payout-address` を写します。自前プールの監査APIはこのサイトの取得元ではありません。",
        "- 監視を開き、64桁の小文字16進を貼ります。形だけを調べます。秘密鍵、シード、ウォレットファイル、`mw1` アドレスは保存できません。",
        "- アドレスが一致してから金額を読みます。未払いの行はロックと使用可能の和で、表示は「未払い・ロック含む」です。累計支払は別の数です。直近24時間はプールが渡したブロック配分で、窓がちょうど24時間のときだけ出ます。その間の送金ではありません。",
        "- 処理速度はnonces/sです。ワーカー行には名前、そのワーカーの速度、最終シェア時刻があります。15分以内のシェアがオンラインです。ウォレット金額を一つのワーカー名へ写しません。",
        "## 五行は五つの問い",
        "対照表は未払い、支払、24時間配分、処理速度、ワーカーを分けます。金額は基礎MDSの整数で、ドルには換えません。",
        "## 足し算だけを示す整数",
        "次の整数は、未払いが使用可能とロックをどう足すかを示す例です。LuckyPoolが使用可能 1024、ロック 1048576 を返したなら、未払いは 1049600 MDS です。プロトコルの 1 mMDS に 1024 MDS を足した値です。支払が 1073741824 ならその行のままです。プロトコルでは 1 gMDS で、未払いには入れません。公式マイナー状態画面の例は 301.20 nonces/s です。口座速度が 301 なら、ここは `301 nonces/s` と出します。301 を 1,048,576 で割らないでください。",
        "## 金額、欠け、保存した装置",
        "このページはLuckyPoolの手数料を書かず、支払時刻も約束しません。プロトコルサイトのコイン段階は二進です。1 kMDS = 1,024 MDS、1 mMDS = 1,048,576 MDS、1 gMDS = 1,073,741,824 MDS。監視は基礎MDSの整数を出し、mMDSのラベルは付けません。マージ採掘のMidwimble（`mw1`）はこの台帳にありません。アドレスなしはLuckyPoolにそのMSSがないという意味です。ソロや別プールは掘り続けられます。欠けた数は不明のままで、0にはしません。未ログインの一覧は今のブラウザに残ります。ログイン後、プロジェクトごとに無料で保存できる装置は3台、Proは100台です。一つのアドレスの下に自動で出るワーカー行は装置を増やしません。ワーカーを別の装置として保存したときだけ、その記録が数に入ります。同じ保存装置の複数の取得元は枠を増やしません。クラッシュログの解釈はこの枠を使わず、MDSの収益報告にもなりません。このサイトのAgentが制御するのはTrain at HomeのMacだけで、Midstateのマイナーは起動も停止もしません。",
        "続けて [MSSアドレスとLuckyPoolを合わせる](/learn/mds-wallet-luckypool-setup) と [ロック・使用可能・支払済](/learn/mds-locked-unlocked-paid) を見てください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "监控里该贴哪一串字符？",
          answer:
            "贴矿工 `--payout-address` 里的 64 位小写十六进制 MSS，并且这台矿工要把份额交给 LuckyPool。`wallet generate-mss` 才是重复收款地址。`wallet receive`、私钥和 `mw1` 都不是这一栏。",
        },
        {
          question: "近 24 小时和未支付是同一个数吗？",
          answer:
            "不是。近 24 小时是刚好 24 小时窗口里的区块分配。未支付是锁定加可用，标签为「未支付 · 含锁定」。累计已支付单独一列。页面不把这三列收成一笔总数。把近 24 小时再叠到未支付和已支付上，会把已经落在其中一列里的窗口再算一遍。",
        },
        {
          question: "查无此地址是不是已经停挖？",
          answer:
            "只说明 LuckyPool 没有这串 MSS。接入点如果是自建池或 solo，本站本来就查不到。先核对矿池，再核对地址是否 64 位小写十六进制。",
        },
        {
          question: "算力为什么写成 nonces/s？",
          answer:
            "官方矿工状态屏的示例单位就是 nonces/s，例如 301.20 nonces/s。协议里的 kMDS、mMDS、gMDS 是币的二进制面额，不是算力。本页在速率后面写 nonces/s，不用 H/s。",
        },
        {
          question: "301 nonces/s 是不是 301 枚 MDS？",
          answer:
            "不是。301 是账户速率的例子。币的数量在未支付和已支付两列，单位是 1 MDS。不要把速率去除 1,048,576，也不要把它加成余额。",
        },
        {
          question: "崩溃解读或 Agent 会改这笔矿池账吗？",
          answer:
            "不会。崩溃日志解读免费，也不占用每个项目免费 3 台、Pro 100 台的保存额度。Agent 只控制 Train at Home 的 Mac，不能开关 Midstate 矿工，也不能代替 LuckyPool 打款。",
        },
      ],
      "zh-TW": [
        {
          question: "監控裡該貼哪一串字元？",
          answer:
            "貼礦工 `--payout-address` 裡的 64 位小寫十六進位 MSS，而且這台礦工要把份額交給 LuckyPool。`wallet generate-mss` 才是重複收款地址。`wallet receive`、私鑰和 `mw1` 都不是這一欄。",
        },
        {
          question: "近 24 小時和未支付是同一個數嗎？",
          answer:
            "不是。近 24 小時是剛好 24 小時窗口裡的區塊分配。未支付是鎖定加可用，標籤為「未支付 · 含鎖定」。累計已支付單獨一欄。頁面不把這三欄收成一筆總數。把近 24 小時再疊到未支付和已支付上，會把已經落在其中一欄裡的窗口再算一遍。",
        },
        {
          question: "查無此地址是不是已經停挖？",
          answer:
            "只說明 LuckyPool 沒有這串 MSS。接入點如果是自建池或 solo，本站本來就查不到。先核對礦池，再核對地址是否 64 位小寫十六進位。",
        },
        {
          question: "算力為什麼寫成 nonces/s？",
          answer:
            "官方礦工狀態畫面的示例單位就是 nonces/s，例如 301.20 nonces/s。協議裡的 kMDS、mMDS、gMDS 是幣的二進位面額，不是算力。本頁在速率後面寫 nonces/s，不用 H/s。",
        },
        {
          question: "301 nonces/s 是不是 301 枚 MDS？",
          answer:
            "不是。301 是帳戶速率的例子。幣的數量在未支付和已支付兩欄，單位是 1 MDS。不要把速率去除 1,048,576，也不要把它加成餘額。",
        },
        {
          question: "當機解讀或 Agent 會改這筆礦池帳嗎？",
          answer:
            "不會。當機日誌解讀免費，也不佔用每個專案免費 3 台、Pro 100 台的保存額度。Agent 只控制 Train at Home 的 Mac，不能開關 Midstate 礦工，也不能代替 LuckyPool 打款。",
        },
      ],
      en: [
        {
          question: "Which string do I paste?",
          answer:
            "Paste the 64-character lowercase hex MSS from the miner’s `--payout-address`, and only if that miner submits to LuckyPool. `wallet generate-mss` is the reusable payout address. `wallet receive`, a private key, and `mw1` do not belong in this field.",
        },
        {
          question: "Is the last-24-hour figure the same as unpaid?",
          answer:
            "No. Last 24 hours is the block allocation inside a window of exactly 24 hours. Unpaid is locked plus unlocked, labeled “Unpaid · including locked”. Cumulative paid is its own figure. The page does not print a total of the three. Adding the last 24 hours on top of unpaid and paid counts that window again when it already sits in one of those lines.",
        },
        {
          question: "Does not-found mean mining stopped?",
          answer:
            "It means LuckyPool has no such MSS. A self-hosted pool or solo is outside this page by design. Check the pool first, then check that the address is 64 lowercase hex characters.",
        },
        {
          question: "Why is the rate written as nonces/s?",
          answer:
            "The official miner status sample uses nonces/s, for example 301.20 nonces/s. On the protocol site, kMDS, mMDS, and gMDS are binary coin steps, not a hashrate. This page prints nonces/s after the rate and does not print H/s.",
        },
        {
          question: "Does 301 nonces/s mean 301 MDS?",
          answer:
            "No. 301 is an account-rate example. Coin amounts sit on the unpaid and paid lines, in units of 1 MDS. Do not divide the rate by 1,048,576, and do not add it to the balance.",
        },
        {
          question: "Can crash interpretation or the Agent change this pool ledger?",
          answer:
            "No. Crash-log interpretation is free and does not use the free quota of three saved devices per project, or the Pro quota of 100. The Agent controls a Train at Home Mac only. It cannot start or stop a Midstate miner, and it cannot pay out on LuckyPool’s behalf.",
        },
      ],
      ko: [
        {
          question: "어떤 문자열을 붙이나요?",
          answer:
            "채굴기 `--payout-address`의 64자리 소문자 16진수 MSS를 붙입니다. 그 채굴기가 LuckyPool에 지분을 보낼 때만 해당합니다. 반복 지급 주소는 `wallet generate-mss`입니다. `wallet receive`, 비밀키, `mw1`은 이 칸이 아닙니다.",
        },
        {
          question: "최근 24시간과 미지급은 같은 수인가요?",
          answer:
            "아닙니다. 최근 24시간은 정확히 24시간 창의 블록 배분입니다. 미지급은 잠금과 사용 가능의 합이고 표기는 「미지급 · 잠금 포함」입니다. 누적 지급은 별도입니다. 페이지는 세 줄을 하나의 합계로 내지 않습니다. 최근 24시간을 미지급과 지급 위에 다시 올리면, 이미 그중 한 줄에 들어 있는 창을 한 번 더 세게 됩니다.",
        },
        {
          question: "주소 없음은 채굴이 멈췄다는 뜻인가요?",
          answer:
            "LuckyPool에 그 MSS가 없다는 뜻입니다. 자체 풀이나 솔로는 이 페이지 범위 밖입니다. 먼저 풀을 확인하고, 그다음 주소가 64자리 소문자 16진수인지 확인하세요.",
        },
        {
          question: "속도는 왜 nonces/s인가요?",
          answer:
            "공식 채굴기 상태 예시의 단위가 nonces/s입니다. 예를 들어 301.20 nonces/s입니다. 프로토콜의 kMDS, mMDS, gMDS는 코인의 이진 단위이지 해시레이트가 아닙니다. 이 페이지는 속도 뒤에 nonces/s를 쓰고 H/s는 쓰지 않습니다.",
        },
        {
          question: "301 nonces/s는 MDS 301개인가요?",
          answer:
            "아닙니다. 301은 계정 속도의 예입니다. 코인 수량은 미지급과 지급 줄에 있고 단위는 1 MDS입니다. 속도를 1,048,576으로 나누거나 잔액에 더하지 마세요.",
        },
        {
          question: "충돌 해석이나 Agent가 이 풀 장부를 바꾸나요?",
          answer:
            "아닙니다. 충돌 로그 해석은 무료이고 프로젝트당 무료 3대, Pro 100대 저장 한도를 쓰지 않습니다. Agent는 Train at Home Mac만 제어합니다. Midstate 채굴기를 켜거나 끄지 못하고, LuckyPool을 대신해 지급하지도 않습니다.",
        },
      ],
      ja: [
        {
          question: "どの文字列を貼りますか？",
          answer:
            "マイナーの `--payout-address` にある64桁小文字16進のMSSを貼ります。そのマイナーがLuckyPoolへシェアを送っている場合だけです。繰り返し受け取るアドレスは `wallet generate-mss` です。`wallet receive`、秘密鍵、`mw1` はこの欄ではありません。",
        },
        {
          question: "直近24時間と未払いは同じ数ですか？",
          answer:
            "違います。直近24時間はちょうど24時間の窓のブロック配分です。未払いはロックと使用可能の和で、表示は「未払い・ロック含む」です。累計支払は別の数です。ページはこの三行を一つの合計にしません。直近24時間を未払いと支払の上に重ねると、すでにどちらかの行にある窓をもう一度数えます。",
        },
        {
          question: "アドレスなしは採掘停止ですか？",
          answer:
            "LuckyPoolにそのMSSがないという意味です。自前プールやソロはこのページの対象外です。先にプールを確認し、次にアドレスが64桁の小文字16進か確認します。",
        },
        {
          question: "速度はなぜ nonces/s ですか？",
          answer:
            "公式マイナーの状態画面の例は nonces/s です。たとえば 301.20 nonces/s です。プロトコルの kMDS、mMDS、gMDS はコインの二進単位で、処理速度ではありません。このページは速度のあとに nonces/s と書き、H/s は書きません。",
        },
        {
          question: "301 nonces/s は MDS が 301 枚ですか？",
          answer:
            "違います。301 は口座速度の例です。コインの数量は未払いと支払の行にあり、単位は 1 MDS です。速度を 1,048,576 で割らず、残高にも足しません。",
        },
        {
          question: "クラッシュ解釈や Agent はこのプール台帳を変えますか？",
          answer:
            "変えません。クラッシュログの解釈は無料で、プロジェクトごとの無料3台・Pro 100台の保存枠を使いません。Agent が制御するのは Train at Home の Mac だけです。Midstate のマイナーは起動も停止もせず、LuckyPool の代わりに支払うこともありません。",
        },
      ],
    },
  },
  {
    slug: slugWallet,
    project: "mds",
    published: "2026-10-24",
    modified: "2026-10-24",
    sources: [pools, cash, lucky],
    related: [slugPrimary, slugWorkers],
    topic: t("地址对不上", "地址對不上", "Address mismatch", "주소가 안 맞음", "アドレス不一致"),
    title: t(
      "MDS 监控提示地址不存在：MSS、一次性地址和 LuckyPool",
      "MDS 監控提示地址不存在：MSS、一次性地址與 LuckyPool",
      "MDS monitoring says the address is missing: MSS, one-time keys, and LuckyPool",
      "MDS 모니터가 주소 없음을 낼 때: MSS, 일회용 키, LuckyPool",
      "MDS監視がアドレスなしと言うとき: MSS、ワンタイム鍵、LuckyPool",
    ),
    description: t(
      "矿工在跑但 MDS 监控查无此地址时，先核对 LuckyPool 和 wallet generate-mss 的 64 位小写 MSS。一次性 wallet receive 与 mw1 都不进这一栏。",
      "礦工在跑但 MDS 監控查無此地址時，先核對 LuckyPool 和 wallet generate-mss 的 64 位小寫 MSS。一次性 wallet receive 與 mw1 都不進這一欄。",
      "If the miner is running and MDS monitoring reports no such address, check LuckyPool and the 64-character lowercase MSS from wallet generate-mss. A one-time wallet receive and mw1 do not belong in the field.",
      "채굴기가 도는데 MDS 모니터가 주소 없음을 내면 LuckyPool과 wallet generate-mss의 64자리 소문자 MSS를 먼저 맞춥니다. 일회용 wallet receive와 mw1은 이 칸이 아닙니다.",
      "マイナーは動いているのにMDS監視がアドレスなしなら、LuckyPoolと wallet generate-mss の64桁小文字MSSを先に合わせます。使い捨ての wallet receive と mw1 はこの欄ではありません。",
    ),
    summary: t(
      "查无此地址只说明 LuckyPool 没有这串 MSS。先看矿工连的是哪一个池，再看贴进去的是不是可重复收款的小写 MSS。",
      "查無此地址只說明 LuckyPool 沒有這串 MSS。先看礦工連的是哪一個池，再看貼進去的是不是可重複收款的小寫 MSS。",
      "Not-found means LuckyPool has no such MSS. Check which pool the miner uses, then check that the paste is a reusable lowercase MSS.",
      "주소 없음은 LuckyPool에 그 MSS가 없다는 뜻입니다. 채굴기가 어느 풀에 붙는지 본 다음, 붙인 값이 반복 수취용 소문자 MSS인지 봅니다.",
      "アドレスなしはLuckyPoolにそのMSSがないという意味です。マイナーがどのプールか見てから、貼った値が繰り返し受取用の小文字MSSか見ます。",
    ),
    comparisonTitle: t("该贴什么", "該貼什麼", "What to paste", "무엇을 붙일까", "何を貼るか"),
    comparison: {
      zh: {
        headers: ["手头的字符串", "能否贴进 MDS 监控", "下一步"],
        rows: [
          [
            "wallet generate-mss 的 64 位小写十六进制，且矿工把它交给 LuckyPool",
            "可以",
            "打开监控读未支付和 Worker",
          ],
          ["同一串但含大写", "不行", "只在钱包确为这些字符时改成小写，不要另造一串"],
          [
            "wallet receive 的一次性 WOTS",
            "不要",
            "官方说明重复打款可能无法花费；改用 generate-mss",
          ],
          ["mw1 开头的 Midwimble", "不要", "那是可选的合并挖矿地址，不在这本 MDS 账上"],
          ["自建池或 solo 的 MSS", "本页打不开", "审核接口在矿池自己的机器上，不是本站数据源"],
        ],
      },
      "zh-TW": {
        headers: ["手上的字串", "能否貼進 MDS 監控", "下一步"],
        rows: [
          [
            "wallet generate-mss 的 64 位小寫十六進位，且礦工把它交給 LuckyPool",
            "可以",
            "打開監控讀未支付和 Worker",
          ],
          ["同一串但含大寫", "不行", "只在錢包確為這些字元時改成小寫，不要另造一串"],
          [
            "wallet receive 的一次性 WOTS",
            "不要",
            "官方說明重複打款可能無法花費；改用 generate-mss",
          ],
          ["mw1 開頭的 Midwimble", "不要", "那是可選的合併挖礦地址，不在這本 MDS 帳上"],
          ["自建池或 solo 的 MSS", "本頁打不開", "審核介面在礦池自己的機器上，不是本站資料來源"],
        ],
      },
      en: {
        headers: ["String in hand", "Paste into MDS monitoring?", "Next step"],
        rows: [
          [
            "64 lowercase hex from wallet generate-mss, and the miner sends it to LuckyPool",
            "Yes",
            "Open monitoring and read unpaid and workers",
          ],
          [
            "The same hex with uppercase letters",
            "No",
            "Lowercase only if the wallet really printed those characters",
          ],
          [
            "One-time WOTS from wallet receive",
            "Do not",
            "The guide says repeated payouts can become unspendable; use generate-mss",
          ],
          [
            "Midwimble starting with mw1",
            "Do not",
            "Optional merge-mine address, not this MDS ledger",
          ],
          [
            "MSS used only on a pool you run, or solo",
            "This page cannot open it",
            "The audit API stays on that pool’s host",
          ],
        ],
      },
      ko: {
        headers: ["가진 문자열", "MDS 모니터에 붙일까", "다음"],
        rows: [
          [
            "wallet generate-mss의 64자리 소문자 16진수이고 채굴기가 LuckyPool에 보냄",
            "예",
            "모니터에서 미지급과 워커를 읽기",
          ],
          ["같은 16진수에 대문자가 있음", "아니오", "지갑이 그 문자를 찍었을 때만 소문자로"],
          [
            "wallet receive의 일회용 WOTS",
            "붙이지 않음",
            "안내는 반복 지급이 쓸 수 없게 될 수 있다고 함",
          ],
          [
            "mw1로 시작하는 Midwimble",
            "붙이지 않음",
            "선택적 병합 채굴 주소이며 이 MDS 장부가 아님",
          ],
          [
            "직접 띄운 풀 또는 솔로 전용 MSS",
            "이 페이지에서 열리지 않음",
            "감사 API는 그 풀의 호스트에 있음",
          ],
        ],
      },
      ja: {
        headers: ["手元の文字列", "MDS監視に貼るか", "次"],
        rows: [
          [
            "wallet generate-mss の64桁小文字16進で、マイナーがLuckyPoolへ送っている",
            "貼る",
            "監視で未払いとワーカーを読む",
          ],
          [
            "同じ16進に大文字が混ざる",
            "貼らない",
            "ウォレットが本当にその文字を出したときだけ小文字にする",
          ],
          [
            "wallet receive のワンタイムWOTS",
            "貼らない",
            "ガイドは繰り返し支払が使えなくなることがあると書く",
          ],
          ["mw1 で始まる Midwimble", "貼らない", "任意のマージ採掘アドレスで、このMDS台帳ではない"],
          [
            "自前プールまたはソロ専用のMSS",
            "このページでは開かない",
            "監査APIはそのプールのホストにある",
          ],
        ],
      },
    },
    body: {
      zh: [
        "矿工进程还在，[MDS 监控](/projects/mds) 却说查无此地址，先分两件事：份额交到了哪个池，以及 `--payout-address` 是不是可重复使用的 MSS。本页只打开 LuckyPool 上那一串 64 位小写十六进制。查无此地址不等于 CPU 停了。",
        "## 这一栏接受什么",
        "监控接受 64 位小写十六进制。它只核对形状，不能证明这串字符来自 MSS 树，也不保存私钥或助记词。官方矿池指南写明：不要使用 `wallet receive`，矿池配置一律用 `wallet generate-mss`。默认的一次性签名是 WOTS；矿池会多次分开打款，若把一次性地址交给矿池，官方说明资金可能变得无法花费。给矿工准备收款地址时，指南里的例子是 `wallet generate-mss --height 10`，高度 10 对应 1,024 次签名。高度 14、16,384 次，是池运营者给手续费钱包的例子，不是你的收款地址必须达到的高度。",
        "## 从矿工命令里抄哪一段",
        "矿工命令的形状是 `midstate miner --pool-url stratum+tcp://池地址:3333 --payout-address <PAYOUT_ADDRESS>`。命令里的 3333 是指南里的例子，不是 LuckyPool 公布的主机或端口。本页读的是 LuckyPool 里这个 MSS 的账户，不查询自建池的审核接口。自建池软件的默认 1% 和指南里的 `--fee 2.5` 都不是 LuckyPool 的费率。本页不报 LuckyPool 手续费，也不承诺何时打款。",
        "## 对不上时走哪一支",
        "本页查无此地址：LuckyPool 没有这串 MSS。先看矿工里的池地址，再决定要不要换字符串。含大写：只有钱包确实打印了这些字符，才改成小写，不要另编一串。`mw1` 开头：那是 Midwimble。池若做合并挖矿，它放在 `--midwimble-address`，是另一种币。没有这枚地址时，官方写明池会留下你的 Midwimble 份额；这句话说的是池软件，不是本页上的一笔 MDS。solo 或你自己架的池不在本页范围内。本站为这个地址打开的公开页是 `midstate.luckypool.io` 上的 miner stats。",
        "## 一个标明是演示的例子",
        "下面是示意。矿工配置里收款地址是 64 位小写十六进制，旁边还有 `--midwimble-address mw1…`。监控里贴了 `mw1` 那一串，页面打不开。改贴那 64 位 MSS。若 LuckyPool 有这串 MSS，未支付和 Worker 只属于 MDS。Midwimble 的份额仍不出现在这本账上。",
        "## 做不到的事",
        "本页不证明地址里已经有币，不报 LuckyPool 何时打款，也不把缺着的数写成 0。查账顺序见 [怎么查 MDS](/learn/midstate-mds-monitor-guide)。接着看 [nonces/s 和币的面额](/learn/mds-nonces-hashrate-units)，以及 [Worker 在线但余额不动](/learn/mds-worker-share-troubleshooting)。",
      ],
      "zh-TW": [
        "礦工行程還在，[MDS 監控](/projects/mds) 卻說查無此地址，先分兩件事：份額交到了哪個池，以及 `--payout-address` 是不是可重複使用的 MSS。本頁只打開 LuckyPool 上那一串 64 位小寫十六進位。查無此地址不等於 CPU 停了。",
        "## 這一欄接受什麼",
        "監控接受 64 位小寫十六進位。它只核對形狀，不能證明這串字元來自 MSS 樹，也不保存私鑰或助記詞。官方礦池指南寫明：不要使用 `wallet receive`，礦池設定一律用 `wallet generate-mss`。預設的一次性簽名是 WOTS；礦池會多次分開打款，若把一次性地址交給礦池，官方說明資金可能變得無法花費。給礦工準備收款地址時，指南裡的例子是 `wallet generate-mss --height 10`，高度 10 對應 1,024 次簽名。高度 14、16,384 次，是池營運者給手續費錢包的例子，不是你的收款地址必須達到的高度。",
        "## 從礦工命令裡抄哪一段",
        "礦工命令的形狀是 `midstate miner --pool-url stratum+tcp://池位址:3333 --payout-address <PAYOUT_ADDRESS>`。命令裡的 3333 是指南裡的例子，不是 LuckyPool 公布的主機或埠。本頁讀的是 LuckyPool 裡這個 MSS 的帳戶，不查詢自建池的審核介面。自建池軟體的預設 1% 和指南裡的 `--fee 2.5` 都不是 LuckyPool 的費率。本頁不報 LuckyPool 手續費，也不承諾何時打款。",
        "## 對不上時走哪一支",
        "本頁查無此地址：LuckyPool 沒有這串 MSS。先看礦工裡的池位址，再決定要不要換字串。含大寫：只有錢包確實印出了這些字元，才改成小寫，不要另編一串。`mw1` 開頭：那是 Midwimble。池若做合併挖礦，它放在 `--midwimble-address`，是另一種幣。沒有這枚地址時，官方寫明池會留下你的 Midwimble 份額；這句話說的是池軟體，不是本頁上的一筆 MDS。solo 或你自己架的池不在本頁範圍內。本站為這個地址打開的公開頁是 `midstate.luckypool.io` 上的 miner stats。",
        "## 一個標明是演示的例子",
        "下面是示意。礦工設定裡收款地址是 64 位小寫十六進位，旁邊還有 `--midwimble-address mw1…`。監控裡貼了 `mw1` 那一串，頁面打不開。改貼那 64 位 MSS。若 LuckyPool 有這串 MSS，未支付和 Worker 只屬於 MDS。Midwimble 的份額仍不出現在這本帳上。",
        "## 做不到的事",
        "本頁不證明地址裡已經有幣，不報 LuckyPool 何時打款，也不把缺著的數寫成 0。查帳順序見 [怎麼查 MDS](/learn/midstate-mds-monitor-guide)。接著看 [nonces/s 和幣的面額](/learn/mds-nonces-hashrate-units)，以及 [Worker 在線但餘額不動](/learn/mds-worker-share-troubleshooting)。",
      ],
      en: [
        "The miner process is still up, and [MDS monitoring](/projects/mds) says the address was not found. Split that into two checks: which pool received the shares, and whether `--payout-address` is a reusable MSS. This page opens only a 64-character lowercase hex string on LuckyPool. Not-found does not mean the CPU stopped.",
        "## What this field accepts",
        "Monitoring accepts 64 lowercase hex characters. It checks the shape only. It does not prove the string came from an MSS tree, and it does not store a private key or a seed. The official pool guide says not to use `wallet receive`. Pool configuration uses `wallet generate-mss`. The default one-time signature is WOTS. A pool sends many separate payouts. If a one-time address is given to the pool, the guide says the funds can become unspendable. The miner example is `wallet generate-mss --height 10`. Height 10 allows 1,024 signatures. Height 14, 16,384 payouts, is the example for the operator’s fee wallet. It is not a minimum your payout address must meet.",
        "## Which part of the miner command to copy",
        "The miner command has the shape `midstate miner --pool-url stratum+tcp://pool:3333 --payout-address <PAYOUT_ADDRESS>`. The 3333 in that command is the guide’s example, not a host or port LuckyPool has published. This page reads the LuckyPool account for this MSS and does not query a self-hosted audit API. The self-hosted software’s default 1% and the guide’s `--fee 2.5` are not LuckyPool’s fee. This page does not quote a LuckyPool fee or promise a payout time.",
        "## Which branch to take",
        "Not-found on this page means LuckyPool has no such MSS. Read the pool host in the miner before you change the string. Uppercase hex: lowercase it only when the wallet actually printed those characters. Do not invent another string. A value starting with `mw1` is Midwimble. If the pool merge-mines, it belongs on `--midwimble-address`. It is a different coin. The guide says that without that address the pool keeps your Midwimble share. That sentence is about the pool software, not an MDS amount on this page. Solo, or a pool you host, is outside this page. The public page this site opens is miner stats on `midstate.luckypool.io`.",
        "## An example marked as an illustration",
        "The case below is an illustration. The miner config has a 64-character lowercase hex payout address and also `--midwimble-address mw1…`. Monitoring was given the `mw1` string, so the page does not open. Paste the 64-character MSS instead. If LuckyPool has that MSS, unpaid and workers belong to MDS only. The Midwimble share still does not appear on this ledger.",
        "## What this page cannot do",
        "It does not prove the address already holds coins, it does not state when LuckyPool pays, and it does not rewrite a missing figure as 0. The reading order is in [how to check MDS](/learn/midstate-mds-monitor-guide). Continue with [nonces/s and coin steps](/learn/mds-nonces-hashrate-units) and [a worker online while the balance does not move](/learn/mds-worker-share-troubleshooting).",
      ],
      ko: [
        "채굴기 프로세스는 살아 있는데 [MDS 모니터](/projects/mds)가 주소 없음을 냅니다. 둘로 나누십시오. 지분이 어느 풀로 갔는지, 그리고 `--payout-address`가 반복해서 쓸 MSS인지입니다. 이 페이지는 LuckyPool의 64자리 소문자 16진수만 엽니다. 주소 없음은 CPU가 멈췄다는 뜻이 아닙니다.",
        "## 이 칸이 받는 것",
        "모니터는 64자리 소문자 16진수를 받습니다. 모양만 확인합니다. MSS 나무에서 나왔는지는 증명하지 않고, 비밀키나 시드도 저장하지 않습니다. 공식 풀 안내는 `wallet receive`를 쓰지 말라고 합니다. 풀 설정은 `wallet generate-mss`입니다. 기본 일회용 서명은 WOTS입니다. 풀은 지급을 여러 번 나눕니다. 일회용 주소를 풀에 주면, 안내는 자금을 쓸 수 없게 될 수 있다고 합니다. 채굴기용 예는 `wallet generate-mss --height 10`입니다. 높이 10은 서명 1,024회입니다. 높이 14, 16,384회는 운영자 수수료 지갑의 예이며, 지급 주소가 반드시 맞춰야 하는 높이가 아닙니다.",
        "## 채굴기 명령에서 어디를 복사하나",
        "명령 형태는 `midstate miner --pool-url stratum+tcp://풀:3333 --payout-address <PAYOUT_ADDRESS>`입니다. 명령의 3333은 안내의 예이며 LuckyPool이 공개한 호스트나 포트가 아닙니다. 이 페이지는 이 MSS의 LuckyPool 계정을 읽고, 자체 풀의 감사 API는 조회하지 않습니다. 자체 풀 소프트웨어의 기본 1%와 안내의 `--fee 2.5`는 LuckyPool 수수료가 아닙니다. 이 페이지는 LuckyPool 수수료를 적지 않고 지급 시각을 약속하지 않습니다.",
        "## 어느 갈래로 가나",
        "이 페이지의 주소 없음은 LuckyPool에 그 MSS가 없다는 뜻입니다. 문자열을 바꾸기 전에 채굴기의 풀 주소를 보십시오. 대문자 16진수는 지갑이 그 문자를 실제로 찍었을 때만 소문자로 바꿉니다. 다른 문자열을 만들지 마십시오. `mw1`로 시작하면 Midwimble입니다. 풀이 병합 채굴을 하면 `--midwimble-address`에 둡니다. 다른 코인입니다. 안내은 그 주소가 없으면 풀이 Midwimble 지분을 남긴다고 합니다. 그 문장은 풀 소프트웨어에 대한 것이고, 이 페이지의 MDS 금액이 아닙니다. 솔로나 직접 띄운 풀은 이 페이지 밖입니다. 이 사이트가 여는 공개 페이지는 `midstate.luckypool.io`의 miner stats입니다.",
        "## 설명용이라고 표시한 예",
        "아래는 예시입니다. 채굴기 설정의 지급 주소는 64자리 소문자 16진수이고, 옆에 `--midwimble-address mw1…`이 있습니다. 모니터에 `mw1` 문자열을 넣으면 페이지가 열리지 않습니다. 64자리 MSS를 붙이십시오. LuckyPool에 그 MSS가 있으면 미지급과 워커는 MDS만의 것입니다. Midwimble 지분은 여전히 이 장부에 없습니다.",
        "## 이 페이지가 하지 않는 일",
        "주소에 이미 코인이 있다고 증명하지 않고, LuckyPool의 지급 시각을 적지 않으며, 빈 수를 0으로 바꾸지 않습니다. 읽는 순서는 [MDS를 확인하는 방법](/learn/midstate-mds-monitor-guide)에 있습니다. 이어서 [nonces/s와 코인 단위](/learn/mds-nonces-hashrate-units)와 [워커는 온라인인데 잔액이 안 움직이는 경우](/learn/mds-worker-share-troubleshooting)를 보십시오.",
      ],
      ja: [
        "マイナーのプロセスは動いているのに、[MDS監視](/projects/mds) がアドレスなしと言います。二つに分けます。シェアがどのプールへ渡ったか、そして `--payout-address` が繰り返し使える MSS かです。このページが開くのは LuckyPool 上の64桁小文字16進だけです。アドレスなしは CPU が止まったという意味ではありません。",
        "## この欄が受け付けるもの",
        "監視は64桁の小文字16進を受け付けます。形だけを見ます。MSS木から出たことは証明せず、秘密鍵やシードも保存しません。公式プール案内は `wallet receive` を使わないと書きます。プール設定は `wallet generate-mss` です。既定のワンタイム署名は WOTS です。プールは支払いを何度も分けます。ワンタイムアドレスをプールに渡すと、案内は資金が使えなくなることがあると書きます。マイナー用の例は `wallet generate-mss --height 10` です。高さ10は署名1,024回です。高さ14、16,384回は、運営者の手数料ウォレットの例であり、受取アドレスが必ず満たす高さではありません。",
        "## マイナーコマンドのどこを写すか",
        "コマンドの形は `midstate miner --pool-url stratum+tcp://プール:3333 --payout-address <PAYOUT_ADDRESS>` です。コマンドの 3333 は案内の例であり、LuckyPool が公表したホストやポートではありません。このページはこの MSS の LuckyPool 口座を読み、自前プールの監査APIは問い合わせません。自前プールソフトの既定 1% と案内の `--fee 2.5` は LuckyPool の手数料ではありません。このページは LuckyPool の手数料を書かず、支払時刻も約束しません。",
        "## どの枝へ進むか",
        "このページのアドレスなしは、LuckyPool にその MSS がないという意味です。文字列を変える前に、マイナーのプール先を見ます。大文字の16進は、ウォレットが本当にその文字を出したときだけ小文字にします。別の文字列は作りません。`mw1` で始まれば Midwimble です。プールがマージ採掘するなら `--midwimble-address` に置きます。別のコインです。案内は、そのアドレスがなければプールが Midwimble の取り分を残すと書きます。その文はプールソフトの話で、このページの MDS 金額ではありません。ソロや自前プールはこのページの外です。このサイトが開く公開ページは `midstate.luckypool.io` の miner stats です。",
        "## 説明用と書いた例",
        "下は例です。マイナー設定の受取アドレスは64桁の小文字16進で、横に `--midwimble-address mw1…` があります。監視に `mw1` の文字列を入れるとページは開きません。64桁の MSS を貼ります。LuckyPool にその MSS があれば、未払いとワーカーは MDS だけのものになります。Midwimble の取り分は、なおこの台帳には出ません。",
        "## このページができないこと",
        "アドレスにすでにコインがあるとは証明せず、LuckyPool の支払時刻も書かず、欠けた数を 0 にしません。読む順は [MDSの確認方法](/learn/midstate-mds-monitor-guide) にあります。続けて [nonces/s とコインの単位](/learn/mds-nonces-hashrate-units) と [ワーカーはオンラインなのに残高が動かない](/learn/mds-worker-share-troubleshooting) を見てください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "wallet receive 生成的地址能用来收矿池款吗？",
          answer:
            "官方矿池指南要求不要把 wallet receive 交给矿池。重复打款需要 wallet generate-mss。一次性 WOTS 被多次使用时，指南写明资金可能无法花费。",
        },
        {
          question: "高度必须是 14 吗？",
          answer:
            "不必。高度 14 是池运营者手续费钱包的例子，允许 16,384 次支付。矿工收款地址的例子是高度 10，允许 1,024 次签名。本页不检查高度，只检查 64 位小写十六进制。",
        },
        {
          question: "LuckyPool 的费率是 1% 吗？",
          answer:
            "不能这样说。1% 是自建池软件的默认值，2.5% 是指南里你自己运行池时的例子。本页不报 LuckyPool 费率。",
        },
      ],
      "zh-TW": [
        {
          question: "wallet receive 產生的地址能用來收礦池款嗎？",
          answer:
            "官方礦池指南要求不要把 wallet receive 交給礦池。重複打款需要 wallet generate-mss。一次性 WOTS 被多次使用時，指南寫明資金可能無法花費。",
        },
        {
          question: "高度必須是 14 嗎？",
          answer:
            "不必。高度 14 是池營運者手續費錢包的例子，允許 16,384 次支付。礦工收款地址的例子是高度 10，允許 1,024 次簽名。本頁不檢查高度，只檢查 64 位小寫十六進位。",
        },
        {
          question: "LuckyPool 的費率是 1% 嗎？",
          answer:
            "不能這樣說。1% 是自建池軟體的預設值，2.5% 是指南裡你自己運行池時的例子。本頁不報 LuckyPool 費率。",
        },
      ],
      en: [
        {
          question: "Can a wallet receive address take pool payouts?",
          answer:
            "The official pool guide says not to give wallet receive to a pool. Repeated payouts need wallet generate-mss. The guide says a one-time WOTS address used more than once can make the funds unspendable.",
        },
        {
          question: "Does the height have to be 14?",
          answer:
            "No. Height 14 is the example for the operator’s fee wallet and allows 16,384 payouts. The miner payout example is height 10, which allows 1,024 signatures. This page does not check height. It checks 64 lowercase hex characters.",
        },
        {
          question: "Is LuckyPool’s fee 1%?",
          answer:
            "That is not established. One percent is the default in the self-hosted pool software, and 2.5% is a custom example in the guide. This page does not quote a LuckyPool fee.",
        },
      ],
      ko: [
        {
          question: "wallet receive 주소를 풀 지급에 써도 되나요?",
          answer:
            "공식 풀 안내는 wallet receive를 풀에 주지 말라고 합니다. 반복 지급은 wallet generate-mss가 필요합니다. 일회용 WOTS를 여러 번 쓰면 자금을 쓸 수 없게 될 수 있다고 안내가 적습니다.",
        },
        {
          question: "높이는 반드시 14인가요?",
          answer:
            "아닙니다. 높이 14는 운영자 수수료 지갑의 예이고 지급 16,384회를 허용합니다. 채굴기 지급 주소의 예는 높이 10, 서명 1,024회입니다. 이 페이지는 높이를 보지 않고 64자리 소문자 16진수만 봅니다.",
        },
        {
          question: "LuckyPool 수수료는 1%인가요?",
          answer:
            "그렇게 정해지지 않았습니다. 1%는 자체 풀 소프트웨어의 기본값이고 2.5%는 안내의 사용자 지정 예입니다. 이 페이지는 LuckyPool 수수료를 적지 않습니다.",
        },
      ],
      ja: [
        {
          question: "wallet receive のアドレスでプール報酬を受け取れますか？",
          answer:
            "公式プール案内は wallet receive をプールに渡さないと書きます。繰り返しの支払には wallet generate-mss が必要です。ワンタイムの WOTS を繰り返すと資金が使えなくなることがある、と案内にあります。",
        },
        {
          question: "高さは 14 でなければなりませんか？",
          answer:
            "いいえ。高さ14は運営者の手数料ウォレットの例で、支払 16,384 回です。マイナーの受取例は高さ10で、署名 1,024 回です。このページは高さを見ません。64桁の小文字16進だけを見ます。",
        },
        {
          question: "LuckyPool の手数料は 1% ですか？",
          answer:
            "そのようには確定していません。1% は自前プールソフトの既定値で、2.5% は案内のカスタム例です。このページは LuckyPool の手数料を書きません。",
        },
      ],
    },
  },

  {
    slug: slugUnits,
    project: "mds",
    published: "2026-10-24",
    modified: "2026-10-24",
    sources: [cash, pools, lucky],
    related: [slugBalances, slugPrimary],
    topic: t("速率和面额", "速率和面額", "Rate and denomination", "속도와 단위", "速度と単位"),
    title: t(
      "MDS 的 nonces/s 不是 H/s，也不要除成 mMDS",
      "MDS 的 nonces/s 不是 H/s，也不要除成 mMDS",
      "MDS nonces/s are not H/s, and they are not divided into mMDS",
      "MDS의 nonces/s는 H/s가 아니고 mMDS로 나누지 않습니다",
      "MDSの nonces/s は H/s ではなく、mMDS で割らない",
    ),
    description: t(
      "MDS 监控把账户速率显示为十进制前缀加 nonces/s。kMDS、mMDS、gMDS 是协议里的币面额。余额按基础 MDS 整数显示，不把算力换算成币。",
      "MDS 監控把帳戶速率顯示為十進位前綴加 nonces/s。kMDS、mMDS、gMDS 是協議裡的幣面額。餘額按基礎 MDS 整數顯示，不把算力換算成幣。",
      "MDS monitoring shows the account rate with a decimal prefix and nonces/s. kMDS, mMDS, and gMDS are protocol coin steps. Balances stay base MDS integers. Hashrate is not converted into coins.",
      "MDS 모니터는 계정 속도를 십진 접두와 nonces/s로 보여 줍니다. kMDS, mMDS, gMDS는 프로토콜의 코인 단위입니다. 잔액은 기본 MDS 정수입니다. 해시레이트를 코인으로 바꾸지 않습니다.",
      "MDS監視は口座の速度を十進の接頭辞と nonces/s で示します。kMDS、mMDS、gMDS はプロトコルのコイン単位です。残高は基礎MDSの整数のままです。処理速度をコインには換えません。",
    ),
    summary: t(
      "看到 nonces/s 就把它当速率。看到未支付里的大整数，用协议的二进制面额理解，不要再除一次。",
      "看到 nonces/s 就把它當速率。看到未支付裡的大整數，用協議的二進位面額理解，不要再除一次。",
      "Read nonces/s as a rate. Read a large unpaid integer with the protocol’s binary steps, and do not divide it again.",
      "nonces/s는 속도입니다. 미지급의 큰 정수는 프로토콜의 이진 단위로 읽고, 다시 나누지 않습니다.",
      "nonces/s は速度です。未払いの大きな整数はプロトコルの二進単位で読み、もう一度割りません。",
    ),
    comparisonTitle: t("两套单位", "兩套單位", "Two unit systems", "두 단위 체계", "二種類の単位"),
    comparison: {
      zh: {
        headers: ["你看到的", "属于", "不要做"],
        rows: [
          [
            "301 nonces/s 或 1.5 Knonces/s",
            "账户或 Worker 的速率",
            "不要写成 H/s，也不要除以 1,048,576",
          ],
          ["1,024 MDS = 1 kMDS", "协议面额", "不要当成 1.024 千哈希"],
          ["1,048,576 MDS = 1 mMDS", "协议面额", "不要当成每秒百万哈希"],
          ["1,073,741,824 MDS = 1 gMDS", "协议面额，也是文档中的初始区块奖励", "不要把它加进算力"],
          ["页面上的未支付整数", "基础 MDS，可用加锁定", "不要再贴上 mMDS 标签，也不要换成美元"],
        ],
      },
      "zh-TW": {
        headers: ["你看到的", "屬於", "不要做"],
        rows: [
          [
            "301 nonces/s 或 1.5 Knonces/s",
            "帳戶或 Worker 的速率",
            "不要寫成 H/s，也不要除以 1,048,576",
          ],
          ["1,024 MDS = 1 kMDS", "協議面額", "不要當成 1.024 千哈希"],
          ["1,048,576 MDS = 1 mMDS", "協議面額", "不要當成每秒百萬哈希"],
          ["1,073,741,824 MDS = 1 gMDS", "協議面額，也是文件中的初始區塊獎勵", "不要把它加進算力"],
          ["頁面上的未支付整數", "基礎 MDS，可用加鎖定", "不要再貼上 mMDS 標籤，也不要換成美元"],
        ],
      },
      en: {
        headers: ["What you see", "Belongs to", "Do not"],
        rows: [
          [
            "301 nonces/s or 1.5 Knonces/s",
            "Account or worker rate",
            "Do not write H/s or divide by 1,048,576",
          ],
          ["1,024 MDS = 1 kMDS", "Protocol denomination", "Do not read it as 1.024 kilohash"],
          [
            "1,048,576 MDS = 1 mMDS",
            "Protocol denomination",
            "Do not read it as a million hashes per second",
          ],
          [
            "1,073,741,824 MDS = 1 gMDS",
            "Protocol denomination, and the documented initial block reward",
            "Do not add it to hashrate",
          ],
          [
            "Unpaid integer on the page",
            "Base MDS, unlocked plus locked",
            "Do not add an mMDS label or convert to dollars",
          ],
        ],
      },
      ko: {
        headers: ["보이는 것", "소속", "하지 말 것"],
        rows: [
          [
            "301 nonces/s 또는 1.5 Knonces/s",
            "계정 또는 워커 속도",
            "H/s로 쓰거나 1,048,576으로 나누지 않음",
          ],
          ["1,024 MDS = 1 kMDS", "프로토콜 단위", "1.024 킬로해시로 읽지 않음"],
          ["1,048,576 MDS = 1 mMDS", "프로토콜 단위", "초당 백만 해시로 읽지 않음"],
          [
            "1,073,741,824 MDS = 1 gMDS",
            "프로토콜 단위이자 문서의 초기 블록 보상",
            "해시레이트에 더하지 않음",
          ],
          [
            "화면의 미지급 정수",
            "기본 MDS, 사용 가능과 잠금의 합",
            "mMDS 라벨을 붙이거나 달러로 바꾸지 않음",
          ],
        ],
      },
      ja: {
        headers: ["見えているもの", "属する先", "しないこと"],
        rows: [
          [
            "301 nonces/s または 1.5 Knonces/s",
            "口座またはワーカーの速度",
            "H/s と書かず、1,048,576 で割らない",
          ],
          ["1,024 MDS = 1 kMDS", "プロトコルの単位", "1.024 キロハッシュと読まない"],
          ["1,048,576 MDS = 1 mMDS", "プロトコルの単位", "毎秒百万ハッシュと読まない"],
          [
            "1,073,741,824 MDS = 1 gMDS",
            "プロトコルの単位であり、文書の初期ブロック報酬",
            "処理速度に足さない",
          ],
          [
            "画面の未払い整数",
            "基礎 MDS。使用可能とロックの和",
            "mMDS のラベルを足さず、ドルにも換えない",
          ],
        ],
      },
    },
    body: {
      zh: [
        "在 [MDS 监控](/projects/mds) 上，速率后面的单位是 nonces/s，不是 H/s。币的数量是另一套：协议用二进制面额，监控把金额留在基础 MDS 整数上。把算力去除 1,048,576，不会得到你的余额。",
        "## 速率这一列怎么读",
        "官方矿工状态屏的示例打印是 `Hashrate: 301.20 nonces/s`，旁边还有一条网络速率，示例是 `2854.10 nonces/s`。那是矿工程序自己的屏幕，不是 LuckyPool 账户页。本站显示的是账户速率，以及每个 Worker 自己的速率，单位同样写成 nonces/s。前缀按十进制：1,000 为 K，1,000,000 为 M。因此账户速率 301 显示为 `301 nonces/s`；1,500 显示为 `1.5 Knonces/s`。这和币的 1,024 进位不是同一套。",
        "## 金额那一列用哪套面额",
        "协议页写明，因为金额被限制为 2 的幂，所以不用十进制小数，而用存储式二进制前缀：1 MDS 是基本单位，1 kMDS = 1,024 MDS，1 mMDS = 1,048,576 MDS，1 gMDS = 1,073,741,824 MDS。同一页写初始区块奖励为 1 gMDS。监控不把未支付改写成 “1 mMDS”。它显示基础整数。金额按基础 MDS 整数显示，不另写 mMDS 标签。",
        "## 先看哪一个数",
        "要回答“机器有多快”，看 nonces/s。要回答“池上还有多少币”，看未支付和已支付。两列不要相加，也不要互除。Worker 的速率只描述那一行，不换算成 MDS。",
        "## 标明是演示的一组数",
        "下面是示意。假设账户速率为 301，页面是 `301 nonces/s`。假设另一账户为 1,500，页面是 `1.5 Knonces/s`。假设可用 1,024、锁定 1,048,576，未支付显示 1,049,600 MDS，也就是协议里的 1 kMDS 再加 1 mMDS。已支付若为 1,073,741,824，单独成列，协议里等于 1 gMDS。不要把 1.5 Knonces/s 除以 1,024，也不要把 301 加进 1,049,600。",
        "## 限度",
        "协议页上的硬件比较不是你这台机器在 LuckyPool 的读数。缺速率就保持未知，不写成 0 H/s。面额的下一步见 [锁定、可用和已支付](/learn/mds-locked-unlocked-paid)。查账顺序见 [怎么查 MDS](/learn/midstate-mds-monitor-guide)。",
      ],
      "zh-TW": [
        "在 [MDS 監控](/projects/mds) 上，速率後面的單位是 nonces/s，不是 H/s。幣的數量是另一套：協議用二進位面額，監控把金額留在基礎 MDS 整數上。把算力去除 1,048,576，不會得到你的餘額。",
        "## 速率這一列怎麼讀",
        "官方礦工狀態畫面的示例是 `Hashrate: 301.20 nonces/s`，旁邊還有一條網路速率，示例是 `2854.10 nonces/s`。那是礦工程式自己的畫面，不是 LuckyPool 帳戶頁。本站顯示的是帳戶速率，以及每個 Worker 自己的速率，單位同樣寫成 nonces/s。前綴按十進位：1,000 為 K，1,000,000 為 M。因此帳戶速率 301 顯示為 `301 nonces/s`；1,500 顯示為 `1.5 Knonces/s`。這和幣的 1,024 進位不是同一套。",
        "## 金額那一列用哪套面額",
        "協議頁寫明，因為金額被限制為 2 的冪，所以不用十進位小數，而用儲存式二進位前綴：1 MDS 是基本單位，1 kMDS = 1,024 MDS，1 mMDS = 1,048,576 MDS，1 gMDS = 1,073,741,824 MDS。同一頁寫初始區塊獎勵為 1 gMDS。監控不把未支付改寫成「1 mMDS」。它顯示基礎整數。金額按基礎 MDS 整數顯示，不另寫 mMDS 標籤。",
        "## 先看哪一個數",
        "要回答「機器有多快」，看 nonces/s。要回答「池上還有多少幣」，看未支付和已支付。兩欄不要相加，也不要互除。Worker 的速率只描述那一列，不換算成 MDS。",
        "## 標明是演示的一組數",
        "下面是示意。假設帳戶速率為 301，頁面是 `301 nonces/s`。假設另一帳戶為 1,500，頁面是 `1.5 Knonces/s`。假設可用 1,024、鎖定 1,048,576，未支付顯示 1,049,600 MDS，也就是協議裡的 1 kMDS 再加 1 mMDS。已支付若為 1,073,741,824，單獨成欄，協議裡等於 1 gMDS。不要把 1.5 Knonces/s 除以 1,024，也不要把 301 加進 1,049,600。",
        "## 限度",
        "協議頁上的硬體比較不是你這台機器在 LuckyPool 的讀數。缺速率就保持未知，不寫成 0 H/s。面額的下一步見 [鎖定、可用和已支付](/learn/mds-locked-unlocked-paid)。查帳順序見 [怎麼查 MDS](/learn/midstate-mds-monitor-guide)。",
      ],
      en: [
        "On [MDS monitoring](/projects/mds) the unit after the rate is nonces/s, not H/s. Coin amounts are a different system. The protocol uses binary steps, and monitoring leaves amounts as base MDS integers. Dividing hashrate by 1,048,576 does not produce your balance.",
        "## How to read the rate",
        "The official miner status sample prints `Hashrate: 301.20 nonces/s`, and a network rate, in the sample `2854.10 nonces/s`. That screen belongs to the miner program. It is not the LuckyPool account page. This site shows the account rate and each worker’s own rate, both labeled nonces/s. The prefix is decimal: 1,000 is K and 1,000,000 is M. An account rate of 301 is shown as `301 nonces/s`. A rate of 1,500 is shown as `1.5 Knonces/s`. That is not the coin’s step of 1,024.",
        "## Which steps the amounts use",
        "The protocol page says amounts are forced to powers of two, so it does not use base-10 decimals. It uses storage-style binary prefixes: 1 MDS is the base unit, 1 kMDS = 1,024 MDS, 1 mMDS = 1,048,576 MDS, and 1 gMDS = 1,073,741,824 MDS. The same page says the initial block reward is 1 gMDS. Monitoring does not relabel unpaid as “1 mMDS”. It shows the base integer. Amounts stay base MDS integers, without an mMDS label.",
        "## Which number answers which question",
        "For “how fast is the machine”, read nonces/s. For “how many coins remain at the pool”, read unpaid and paid. Do not add the columns, and do not divide one by the other. A worker’s rate describes that row only. It is not converted into MDS.",
        "## A set of figures marked as an illustration",
        "The figures below are an illustration. If the account rate is 301, the page shows `301 nonces/s`. If another account rate is 1,500, the page shows `1.5 Knonces/s`. If unlocked is 1,024 and locked is 1,048,576, unpaid shows 1,049,600 MDS: 1 kMDS plus 1 mMDS in protocol steps. If paid is 1,073,741,824, it stays on its own line and equals 1 gMDS in the protocol. Do not divide `1.5 Knonces/s` by 1,024, and do not add 301 to 1,049,600.",
        "## Limits",
        "A hardware comparison on the protocol site is not this machine’s LuckyPool reading. A missing rate stays unknown. It is not written as 0 H/s. Coin steps continue in [locked, unlocked, and paid](/learn/mds-locked-unlocked-paid). The reading order is in [how to check MDS](/learn/midstate-mds-monitor-guide).",
      ],
      ko: [
        "[MDS 모니터](/projects/mds)에서 속도 뒤의 단위는 nonces/s이고 H/s가 아닙니다. 코인 수량은 다른 체계입니다. 프로토콜은 이진 단위를 쓰고, 모니터는 금액을 기본 MDS 정수로 둡니다. 해시레이트를 1,048,576으로 나누어도 잔액이 되지 않습니다.",
        "## 속도 줄을 읽는 법",
        "공식 채굴기 상태 예시는 `Hashrate: 301.20 nonces/s`이고, 네트워크 속도 예시는 `2854.10 nonces/s`입니다. 그 화면은 채굴기 프로그램의 것입니다. LuckyPool 계정 페이지가 아닙니다. 이 사이트는 계정 속도와 워커마다의 속도를 보여 주며 둘 다 nonces/s입니다. 접두는 십진입니다. 1,000이 K, 1,000,000이 M입니다. 계정 속도 301은 `301 nonces/s`, 1,500은 `1.5 Knonces/s`입니다. 코인의 1,024 단계와 다릅니다.",
        "## 금액이 쓰는 단위",
        "프로토콜 페이지는 금액이 2의 거듭제곱으로 제한되므로 십진 소수를 쓰지 않고, 저장 장치형 이진 접두를 쓴다고 합니다. 1 MDS가 기본 단위, 1 kMDS = 1,024 MDS, 1 mMDS = 1,048,576 MDS, 1 gMDS = 1,073,741,824 MDS입니다. 같은 페이지는 초기 블록 보상이 1 gMDS라고 합니다. 모니터는 미지급을 “1 mMDS”로 다시 붙이지 않습니다. 기본 정수를 보여 줍니다. 금액은 기본 MDS 정수로 보여 주며 mMDS 라벨은 붙이지 않습니다.",
        "## 어느 수가 어느 질문인가",
        "“기계가 얼마나 빠른가”는 nonces/s입니다. “풀에 코인이 얼마나 남았나”는 미지급과 지급입니다. 열을 더하거나 서로 나누지 마십시오. 워커 속도는 그 행만 설명하며 MDS로 바꾸지 않습니다.",
        "## 설명용이라고 표시한 수",
        "아래는 예시입니다. 계정 속도가 301이면 `301 nonces/s`입니다. 다른 계정이 1,500이면 `1.5 Knonces/s`입니다. 사용 가능 1,024, 잠금 1,048,576이면 미지급은 1,049,600 MDS, 곧 프로토콜의 1 kMDS에 1 mMDS를 더한 값입니다. 지급이 1,073,741,824이면 그 줄에 남고 프로토콜의 1 gMDS입니다. `1.5 Knonces/s`를 1,024로 나누거나 301을 1,049,600에 더하지 마십시오.",
        "## 한계",
        "프로토콜 사이트의 하드웨어 비교는 이 기계의 LuckyPool 수치가 아닙니다. 빠진 속도는 알 수 없음이며 0 H/s로 쓰지 않습니다. 단위는 [잠금·사용 가능·지급](/learn/mds-locked-unlocked-paid)에서 이어집니다. 읽는 순서는 [MDS를 확인하는 방법](/learn/midstate-mds-monitor-guide)에 있습니다.",
      ],
      ja: [
        "[MDS監視](/projects/mds) で速度のあとの単位は nonces/s であり、H/s ではありません。コインの数量は別の体系です。プロトコルは二進の段階を使い、監視は金額を基礎 MDS の整数のままにします。処理速度を 1,048,576 で割っても残高にはなりません。",
        "## 速度の行の読み方",
        "公式マイナーの状態画面の例は `Hashrate: 301.20 nonces/s` で、ネットワーク速度の例は `2854.10 nonces/s` です。その画面はマイナープログラムのもので、LuckyPool の口座ページではありません。このサイトは口座の速度と、ワーカーそれぞれの速度を示し、どちらも nonces/s です。接頭辞は十進です。1,000 が K、1,000,000 が M です。口座速度 301 は `301 nonces/s`、1,500 は `1.5 Knonces/s` です。コインの 1,024 段階とは別です。",
        "## 金額が使う単位",
        "プロトコルのページは、金額が2の冪に制限されるため十進の小数を使わず、記憶装置型の二進接頭辞を使うと書きます。1 MDS が基本単位、1 kMDS = 1,024 MDS、1 mMDS = 1,048,576 MDS、1 gMDS = 1,073,741,824 MDS です。同じページは初期ブロック報酬が 1 gMDS だと書きます。監視は未払いを「1 mMDS」と言い換えません。基礎の整数を出します。金額は基礎 MDS の整数で示し、mMDS のラベルは付けません。",
        "## どの数がどの問いか",
        "「機械がどれだけ速いか」は nonces/s です。「プールにコインがいくら残るか」は未払いと支払です。列を足さず、互いに割りません。ワーカーの速度はその行だけを説明し、MDS には換えません。",
        "## 説明用と書いた数",
        "下は例です。口座速度が 301 なら `301 nonces/s` です。別の口座が 1,500 なら `1.5 Knonces/s` です。使用可能 1,024、ロック 1,048,576 なら未払いは 1,049,600 MDS、つまりプロトコルの 1 kMDS に 1 mMDS を足した値です。支払が 1,073,741,824 ならその行のままで、プロトコルの 1 gMDS です。`1.5 Knonces/s` を 1,024 で割らず、301 を 1,049,600 に足しません。",
        "## 限界",
        "プロトコルサイト上のハードウェア比較は、この機械の LuckyPool の数値ではありません。欠けた速度は不明のままで、0 H/s とは書きません。単位の続きは [ロック・使用可能・支払済](/learn/mds-locked-unlocked-paid) です。読む順は [MDSの確認方法](/learn/midstate-mds-monitor-guide) にあります。",
      ],
    },
    questions: {
      zh: [
        {
          question: "Knonces/s 里的 K 是 1,024 吗？",
          answer:
            "不是。速率前缀按 1,000。1,500 nonces/s 显示为 1.5 Knonces/s。币的 1 kMDS 才是 1,024 MDS。两套不要混用。",
        },
        {
          question: "官方屏幕上的 301.20 会原样出现在监控里吗？",
          answer:
            "不一定。301.20 nonces/s 是矿工状态屏的示例。监控显示的是 LuckyPool 账户返回的速率，再用十进制前缀和 nonces/s 标出。两边不是同一次读数。",
        },
        {
          question: "初始奖励 1 gMDS 是我的未支付吗？",
          answer:
            "不是。那是协议页写的初始区块奖励。你的未支付只来自 LuckyPool 这一地址上的可用加锁定。没有返回时保持未知，不写成 1 gMDS。",
        },
      ],
      "zh-TW": [
        {
          question: "Knonces/s 裡的 K 是 1,024 嗎？",
          answer:
            "不是。速率前綴按 1,000。1,500 nonces/s 顯示為 1.5 Knonces/s。幣的 1 kMDS 才是 1,024 MDS。兩套不要混用。",
        },
        {
          question: "官方畫面上的 301.20 會原樣出現在監控裡嗎？",
          answer:
            "不一定。301.20 nonces/s 是礦工狀態畫面的示例。監控顯示的是 LuckyPool 帳戶返回的速率，再用十進位前綴和 nonces/s 標出。兩邊不是同一次讀數。",
        },
        {
          question: "初始獎勵 1 gMDS 是我的未支付嗎？",
          answer:
            "不是。那是協議頁寫的初始區塊獎勵。你的未支付只來自 LuckyPool 這一地址上的可用加鎖定。沒有返回時保持未知，不寫成 1 gMDS。",
        },
      ],
      en: [
        {
          question: "Is the K in Knonces/s equal to 1,024?",
          answer:
            "No. Rate prefixes step by 1,000. 1,500 nonces/s is shown as 1.5 Knonces/s. For the coin, 1 kMDS is 1,024 MDS. Do not mix the two.",
        },
        {
          question: "Will the official 301.20 appear unchanged on the monitor?",
          answer:
            "Not necessarily. 301.20 nonces/s is a sample on the miner status screen. Monitoring shows the rate LuckyPool returns for the account, then labels it with a decimal prefix and nonces/s. The two are not one reading.",
        },
        {
          question: "Is the initial reward of 1 gMDS my unpaid balance?",
          answer:
            "No. That is the initial block reward on the protocol page. Your unpaid figure is unlocked plus locked for this address on LuckyPool. If it is absent, it stays unknown and is not filled in as 1 gMDS.",
        },
      ],
      ko: [
        {
          question: "Knonces/s의 K는 1,024인가요?",
          answer:
            "아닙니다. 속도 접두는 1,000 단위입니다. 1,500 nonces/s는 1.5 Knonces/s로 나옵니다. 코인의 1 kMDS가 1,024 MDS입니다. 둘을 섞지 마세요.",
        },
        {
          question: "공식 화면의 301.20이 모니터에 그대로 나오나요?",
          answer:
            "꼭 그렇지는 않습니다. 301.20 nonces/s는 채굴기 상태 화면의 예시입니다. 모니터는 LuckyPool 계정이 돌려준 속도에 십진 접두와 nonces/s를 붙입니다. 둘은 같은 한 번의 수치가 아닙니다.",
        },
        {
          question: "초기 보상 1 gMDS가 내 미지급인가요?",
          answer:
            "아닙니다. 그것은 프로토콜 페이지의 초기 블록 보상입니다. 미지급은 LuckyPool에서 이 주소의 사용 가능과 잠금의 합입니다. 없으면 알 수 없음이며 1 gMDS로 채우지 않습니다.",
        },
      ],
      ja: [
        {
          question: "Knonces/s の K は 1,024 ですか？",
          answer:
            "違います。速度の接頭辞は 1,000 刻みです。1,500 nonces/s は 1.5 Knonces/s と出ます。コインの 1 kMDS が 1,024 MDS です。二つを混ぜません。",
        },
        {
          question: "公式画面の 301.20 はそのまま監視に出ますか？",
          answer:
            "必ずしも出ません。301.20 nonces/s はマイナー状態画面の例です。監視は LuckyPool の口座が返した速度に、十進の接頭辞と nonces/s を付けます。二つは同じ一回の数値ではありません。",
        },
        {
          question: "初期報酬の 1 gMDS は自分の未払いですか？",
          answer:
            "違います。それはプロトコルページの初期ブロック報酬です。未払いは LuckyPool 上のこのアドレスの使用可能とロックの和です。無ければ不明のままで、1 gMDS とは埋めません。",
        },
      ],
    },
  },
  {
    slug: slugBalances,
    project: "mds",
    published: "2026-10-24",
    modified: "2026-10-24",
    sources: [pools, cash, lucky],
    related: [slugUnits, slugWorkers],
    topic: t("三笔金额", "三筆金額", "Three amounts", "세 금액", "三つの金額"),
    title: t(
      "MDS 的锁定、可用和已支付为什么对不上",
      "MDS 的鎖定、可用和已支付為什麼對不上",
      "Why MDS locked, unlocked, and paid do not match",
      "MDS의 잠금·사용 가능·지급이 서로 다른 이유",
      "MDSのロック・使用可能・支払が一致しない理由",
    ),
    description: t(
      "MDS 监控的未支付是可用加锁定。累计已支付是另一笔转出。近 24 小时是刚好一天窗口的区块分配。接受份额不是打款。",
      "MDS 監控的未支付是可用加鎖定。累計已支付是另一筆轉出。近 24 小時是剛好一天窗口的區塊分配。接受份額不是打款。",
      "Unpaid on MDS monitoring is unlocked plus locked. Cumulative paid is a separate transfer total. The last 24 hours are a block allocation for a window of exactly one day. Accepted shares are not a payout.",
      "MDS 모니터의 미지급은 사용 가능과 잠금의 합입니다. 누적 지급은 별도의 송금 합계입니다. 최근 24시간은 정확히 하루 창의 블록 배분입니다. 수락 지분은 지급이 아닙니다.",
      "MDS監視の未払いは使用可能とロックの和です。累計支払は別の送金合計です。直近24時間はちょうど一日の窓のブロック配分です。受理シェアは支払ではありません。",
    ),
    summary: t(
      "三列回答三个问题。窗口不是刚好 24 小时时，近 24 小时保持未知，不写成 0。本页不解释余额为何锁定，也不承诺何时解锁。",
      "三欄回答三個問題。窗口不是剛好 24 小時時，近 24 小時保持未知，不寫成 0。本頁不解釋餘額為何鎖定，也不承諾何時解鎖。",
      "Three lines answer three questions. If the window is not exactly 24 hours, the 24-hour line stays unknown and is not written as 0. This page does not explain why part of the balance is locked, and it does not promise an unlock time.",
      "세 줄은 세 질문입니다. 창이 정확히 24시간이 아니면 최근 24시간은 알 수 없음이며 0이 아닙니다. 이 페이지는 잔액이 잠긴 이유를 설명하지 않고, 해제 시각도 약속하지 않습니다.",
      "三行は三つの問いです。窓がちょうど24時間でなければ直近24時間は不明のままで、0ではありません。このページは残高がロックされる理由を説明せず、解除時刻も約束しません。",
    ),
    comparisonTitle: t(
      "三列各答一事",
      "三欄各答一事",
      "Three lines, three questions",
      "세 줄은 세 질문",
      "三行は三つの問い",
    ),
    comparison: {
      zh: {
        headers: ["列", "问题", "不是"],
        rows: [
          ["未支付 · 含锁定", "可用与锁定现在一共多少基础 MDS", "已支付，或近 24 小时"],
          ["累计已支付", "矿池已经转出多少", "钱包里的链上余额"],
          ["近 24 小时", "刚好 24 小时的区块分配", "这段时间的打款，或接受份额的次数"],
        ],
      },
      "zh-TW": {
        headers: ["欄", "問題", "不是"],
        rows: [
          ["未支付 · 含鎖定", "可用與鎖定現在一共多少基礎 MDS", "已支付，或近 24 小時"],
          ["累計已支付", "礦池已經轉出多少", "錢包裡的鏈上餘額"],
          ["近 24 小時", "剛好 24 小時的區塊分配", "這段時間的打款，或接受份額的次數"],
        ],
      },
      en: {
        headers: ["Line", "Question", "Not"],
        rows: [
          [
            "Unpaid · including locked",
            "How many base MDS are unlocked plus locked now",
            "Paid, or the last 24 hours",
          ],
          [
            "Cumulative paid",
            "How much the pool has already transferred",
            "The on-chain wallet balance",
          ],
          [
            "Last 24 hours",
            "Block allocation for a window of exactly 24 hours",
            "Payouts in that window, or a count of accepted shares",
          ],
        ],
      },
      ko: {
        headers: ["줄", "질문", "아닌 것"],
        rows: [
          [
            "미지급 · 잠금 포함",
            "사용 가능과 잠금을 합하면 지금 기본 MDS가 얼마인가",
            "지급, 또는 최근 24시간",
          ],
          ["누적 지급", "풀이 이미 얼마나 보냈는가", "지갑의 체인 잔액"],
          ["최근 24시간", "정확히 24시간 창의 블록 배분", "그 사이의 송금, 또는 수락 지분 횟수"],
        ],
      },
      ja: {
        headers: ["行", "問い", "ではないもの"],
        rows: [
          [
            "未払い・ロック含む",
            "使用可能とロックを足すといま基礎MDSがいくらか",
            "支払、または直近24時間",
          ],
          ["累計支払", "プールがすでにいくら送ったか", "ウォレットのチェーン上残高"],
          [
            "直近24時間",
            "ちょうど24時間の窓のブロック配分",
            "その間の送金、または受理シェアの回数",
          ],
        ],
      },
    },
    body: {
      zh: [
        "未支付、已支付和近 24 小时在 [MDS 监控](/projects/mds) 上是三笔不同的数。未支付一行把可用和锁定加在一起，标签是「未支付 · 含锁定」。已支付是矿池已经转出的累计。近 24 小时是区块分配，而且窗口要刚好 24 小时才显示。矿工屏幕上的接受份额不是这三笔里的任何一笔。",
        "## 每一列在回答什么",
        "可用是账户上标成可以动用的那一部分，锁定是同一账户上分开列出的那一部分。本页把两者相加，因为它们都还没有记入累计已支付。官方矿池指南说明池从矿工找到的区块里收取比例，并用 MSS 多次支付；它没有定义 LuckyPool 为何把余额分成锁定和可用。本页不解释锁定原因，也不承诺何时解锁，也不报最低付款。",
        "## 24 小时这一列何时出现",
        "近 24 小时来自账户上的区块分配。只有起止时间相减正好是 24 小时，这一列才有数。窗口不对、字段缺失，都保持未知，不写成 0，也不用未支付去填。它不是这 24 小时内的转账次数。",
        "## 和份额、钱包分开",
        "官方矿工状态屏的示例有 `142 acc / 0 rej`，以及 `Expecting: 1 block per 4096 shares`。那是矿工自己的份额计数和期望，不是 LuckyPool 已经支付的 MDS。接受 142 份不会在本页变成 142 MDS。钱包或区块浏览器里的余额是另一本账；本页不读取它。",
        "## 标明是演示的一笔记账",
        "下面是示意。可用 1,024，锁定 1,048,576，未支付显示 1,049,600 MDS。已支付 2,048 留在自己的列。页面不把两列收成一笔累计。若 24 小时窗口的分配是 512，那一列显示 512 MDS；再把它叠到未支付和已支付上，会把已经落在其中一列里的窗口再算一遍。若窗口不是刚好 24 小时，那一列是未知，即使未支付仍是 1,049,600。矿工若显示接受 142 份，这 142 不进入任何金额列。",
        "## 下一步",
        "面额换算见 [nonces/s 与 mMDS](/learn/mds-nonces-hashrate-units)。某一台 Worker 离线不会把这三列改成 0，见 [份额和 Worker](/learn/mds-worker-share-troubleshooting)。",
      ],
      "zh-TW": [
        "未支付、已支付和近 24 小時在 [MDS 監控](/projects/mds) 上是三筆不同的數。未支付一列把可用和鎖定加在一起，標籤是「未支付 · 含鎖定」。已支付是礦池已經轉出的累計。近 24 小時是區塊分配，而且窗口要剛好 24 小時才顯示。礦工畫面上的接受份額不是這三筆裡的任何一筆。",
        "## 每一欄在回答什麼",
        "可用是帳戶上標成可以動用的那一部分，鎖定是同一帳戶上分開列出的那一部分。本頁把兩者相加，因為它們都還沒有記入累計已支付。官方礦池指南說明池從礦工找到的區塊裡收取比例，並用 MSS 多次支付；它沒有定義 LuckyPool 為何把餘額分成鎖定和可用。本頁不解釋鎖定原因，也不承諾何時解鎖，也不報最低付款。",
        "## 24 小時這一欄何時出現",
        "近 24 小時來自帳戶上的區塊分配。只有起止時間相減正好是 24 小時，這一欄才有數。窗口不對、欄位缺失，都保持未知，不寫成 0，也不用未支付去填。它不是這 24 小時內的轉帳次數。",
        "## 和份額、錢包分開",
        "官方礦工狀態畫面的示例有 `142 acc / 0 rej`，以及 `Expecting: 1 block per 4096 shares`。那是礦工自己的份額計數和期望，不是 LuckyPool 已經支付的 MDS。接受 142 份不會在本頁變成 142 MDS。錢包或區塊瀏覽器裡的餘額是另一本帳；本頁不讀取它。",
        "## 標明是演示的一筆記帳",
        "下面是示意。可用 1,024，鎖定 1,048,576，未支付顯示 1,049,600 MDS。已支付 2,048 留在自己的欄。頁面不把兩欄收成一筆累計。若 24 小時窗口的分配是 512，那一欄顯示 512 MDS；再把它疊到未支付和已支付上，會把已經落在其中一欄裡的窗口再算一遍。若窗口不是剛好 24 小時，那一欄是未知，即使未支付仍是 1,049,600。礦工若顯示接受 142 份，這 142 不進入任何金額欄。",
        "## 下一步",
        "面額換算見 [nonces/s 與 mMDS](/learn/mds-nonces-hashrate-units)。某一台 Worker 離線不會把這三欄改成 0，見 [份額和 Worker](/learn/mds-worker-share-troubleshooting)。",
      ],
      en: [
        "Unpaid, paid, and the last 24 hours are three different figures on [MDS monitoring](/projects/mds). The unpaid line adds unlocked and locked and is labeled “Unpaid · including locked”. Paid is the cumulative amount the pool has already transferred. The last 24 hours are a block allocation, and the line appears only when the window is exactly 24 hours. Accepted shares on the miner screen are none of these three.",
        "## What each line answers",
        "Unlocked is the part of the account marked available. Locked is the part listed separately on the same account. This page adds them because neither has been counted in cumulative paid. The official pool guide says the pool takes a percentage from blocks its miners find and pays an MSS many times. It does not define why LuckyPool splits a balance into locked and unlocked. This page does not explain the lock, does not promise an unlock time, and does not state a minimum payout.",
        "## When the 24-hour line appears",
        "The last-24-hour figure comes from the block allocation on the account. It has a number only when the end minus the start is exactly 24 hours. A wrong window or a missing field stays unknown. It is not written as 0, and unpaid is not copied into the gap. It is not a count of transfers during those 24 hours.",
        "## Keep shares and the wallet apart",
        "The official miner status sample includes `142 acc / 0 rej` and `Expecting: 1 block per 4096 shares`. That is the miner’s own share count and expectation. It is not MDS that LuckyPool has paid. Accepting 142 shares does not become 142 MDS on this page. A balance in a wallet or a block explorer is another ledger. This page does not read it.",
        "## A ledger marked as an illustration",
        "The figures below are an illustration. Unlocked 1,024 and locked 1,048,576 show unpaid 1,049,600 MDS. Paid 2,048 stays on its own line. The page does not print its own total of unpaid plus paid. If the 24-hour allocation is 512, that line shows 512 MDS. Adding 512 on top of unpaid and paid counts that window again when it already sits in one of those lines. If the window is not exactly 24 hours, that line is unknown even while unpaid remains 1,049,600. If the miner shows 142 accepted shares, 142 enters no amount line.",
        "## Next",
        "Denomination is in [nonces/s and mMDS](/learn/mds-nonces-hashrate-units). One worker going offline does not set these three lines to 0. See [shares and workers](/learn/mds-worker-share-troubleshooting).",
      ],
      ko: [
        "미지급, 지급, 최근 24시간은 [MDS 모니터](/projects/mds)에서 서로 다른 세 수입니다. 미지급 줄은 사용 가능과 잠금을 더하며 표기는 「미지급 · 잠금 포함」입니다. 지급은 풀이 이미 보낸 누적입니다. 최근 24시간은 블록 배분이고, 창이 정확히 24시간일 때만 나옵니다. 채굴기 화면의 수락 지분은 이 셋이 아닙니다.",
        "## 각 줄이 답하는 것",
        "사용 가능은 계정에서 쓸 수 있다고 표시된 부분입니다. 잠금은 같은 계정에서 따로 적힌 부분입니다. 둘 다 아직 누적 지급에 들어가지 않았으므로 이 페이지는 더합니다. 공식 풀 안내는 풀이 채굴기가 찾은 블록에서 비율을 가져가고 MSS로 여러 번 지급한다고 합니다. LuckyPool이 왜 잔액을 잠금과 사용 가능으로 나누는지는 정의하지 않습니다. 이 페이지는 잠금 이유를 설명하지 않고, 해제 시각을 약속하지 않으며, 최소 지급도 적지 않습니다.",
        "## 24시간 줄이 나올 때",
        "최근 24시간은 계정의 블록 배분에서 옵니다. 끝에서 시작을 뺀 값이 정확히 24시간일 때만 수가 있습니다. 창이 다르거나 필드가 없으면 알 수 없음입니다. 0으로 쓰지 않고, 미지급으로 빈칸을 채우지도 않습니다. 그 24시간 동안의 송금 횟수가 아닙니다.",
        "## 지분과 지갑은 따로",
        "공식 채굴기 상태 예시에는 `142 acc / 0 rej`와 `Expecting: 1 block per 4096 shares`가 있습니다. 채굴기 자신의 지분 횟수와 기대이며, LuckyPool이 지급한 MDS가 아닙니다. 142개를 수락해도 이 페이지에서 142 MDS가 되지 않습니다. 지갑이나 탐색기의 잔액은 다른 장부입니다. 이 페이지는 읽지 않습니다.",
        "## 설명용 장부",
        "아래는 예시입니다. 사용 가능 1,024, 잠금 1,048,576이면 미지급은 1,049,600 MDS입니다. 지급 2,048은 자기 줄에 남습니다. 페이지는 미지급과 지급의 합계를 따로 내지 않습니다. 24시간 창의 배분이 512이면 그 줄은 512 MDS입니다. 512를 미지급과 지급 위에 다시 올리면, 이미 그중 한 줄에 있는 창을 한 번 더 세게 됩니다. 창이 정확히 24시간이 아니면, 미지급이 1,049,600이어도 그 줄은 알 수 없음입니다. 채굴기가 수락 142를 보여도 142는 어떤 금액 줄에도 들어가지 않습니다.",
        "## 다음",
        "단위는 [nonces/s와 mMDS](/learn/mds-nonces-hashrate-units)에 있습니다. 워커 하나가 오프라인이어도 이 세 줄은 0이 되지 않습니다. [지분과 워커](/learn/mds-worker-share-troubleshooting)를 보십시오.",
      ],
      ja: [
        "未払い、支払、直近24時間は [MDS監視](/projects/mds) 上では別々の三つの数です。未払いの行は使用可能とロックを足し、表示は「未払い・ロック含む」です。支払はプールがすでに送った累計です。直近24時間はブロック配分で、窓がちょうど24時間のときだけ出ます。マイナー画面の受理シェアは、この三つのいずれでもありません。",
        "## 各行が答えること",
        "使用可能は、口座で使えると示された部分です。ロックは同じ口座で別に記された部分です。どちらもまだ累計支払に入っていないので、このページは足します。公式プール案内は、プールがマイナーの見つけたブロックから割合を取り、MSS へ何度も支払うと書きます。LuckyPool がなぜ残高をロックと使用可能に分けるかは定義していません。このページはロックの理由を説明せず、解除時刻も約束せず、最低支払も書きません。",
        "## 24時間の行が出るとき",
        "直近24時間は口座のブロック配分から来ます。終わりから始まりを引いた値がちょうど24時間のときだけ数があります。窓が違う、または項目が無いときは不明です。0 とは書かず、未払いで空きを埋めません。その24時間の送金回数ではありません。",
        "## シェアとウォレットは分ける",
        "公式マイナーの状態例には `142 acc / 0 rej` と `Expecting: 1 block per 4096 shares` があります。マイナー自身のシェア回数と期待であり、LuckyPool が支払った MDS ではありません。142 を受理しても、このページでは 142 MDS になりません。ウォレットやエクスプローラの残高は別の台帳です。このページは読みません。",
        "## 説明用の台帳",
        "下は例です。使用可能 1,024、ロック 1,048,576 なら未払いは 1,049,600 MDS です。支払 2,048 は自分の行に残ります。ページは未払いと支払の合計を自分では出しません。24時間の窓の配分が 512 ならその行は 512 MDS です。512 を未払いと支払の上に重ねると、すでにどちらかの行にある窓をもう一度数えます。窓がちょうど24時間でなければ、未払いが 1,049,600 のままでもその行は不明です。マイナーが受理 142 を示しても、142 はどの金額の行にも入りません。",
        "## 次",
        "単位は [nonces/s と mMDS](/learn/mds-nonces-hashrate-units) にあります。ワーカーが一台オフラインでも、この三行は 0 になりません。[シェアとワーカー](/learn/mds-worker-share-troubleshooting) を見てください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "未支付是不是已经能转走的钱？",
          answer:
            "不能这样理解。这一行是可用加锁定，标签写明含锁定。本页不解释锁定为何还不能转走，也不承诺何时解锁。已支付才是矿池已经转出的累计，而且也不是钱包里的链上余额。",
        },
        {
          question: "近 24 小时是 0，是不是今天没有收益？",
          answer:
            "页面不会把缺失写成 0。窗口不是刚好 24 小时，或分配字段缺失时，这一列是未知。未知不等于今天收入为零。",
        },
        {
          question: "接受份额越多，已支付是不是越大？",
          answer:
            "本页不建立这个换算。矿工屏幕的接受次数是份额计数。已支付是矿池转出的累计。指南里的“每 4096 份期望一个区块”是矿工屏幕上的期望，不是付款承诺。",
        },
      ],
      "zh-TW": [
        {
          question: "未支付是不是已經能轉走的錢？",
          answer:
            "不能這樣理解。這一列是可用加鎖定，標籤寫明含鎖定。本頁不解釋鎖定為何還不能轉走，也不承諾何時解鎖。已支付才是礦池已經轉出的累計，而且也不是錢包裡的鏈上餘額。",
        },
        {
          question: "近 24 小時是 0，是不是今天沒有收益？",
          answer:
            "頁面不會把缺失寫成 0。窗口不是剛好 24 小時，或分配欄位缺失時，這一欄是未知。未知不等於今天收入為零。",
        },
        {
          question: "接受份額越多，已支付是不是越大？",
          answer:
            "本頁不建立這個換算。礦工畫面的接受次數是份額計數。已支付是礦池轉出的累計。指南裡的「每 4096 份期望一個區塊」是礦工畫面上的期望，不是付款承諾。",
        },
      ],
      en: [
        {
          question: "Is unpaid money I can already send?",
          answer:
            "Do not read it that way. The line is unlocked plus locked, and the label says locked is included. This page does not explain why the locked part cannot be sent, and it does not promise an unlock time. Paid is the cumulative amount the pool has transferred, and it is still not the on-chain wallet balance.",
        },
        {
          question: "If the last 24 hours show 0, did I earn nothing today?",
          answer:
            "The page does not write a gap as 0. When the window is not exactly 24 hours, or the allocation is missing, the line is unknown. Unknown is not a statement that today’s income is zero.",
        },
        {
          question: "Does a higher accepted-share count mean paid is larger?",
          answer:
            "This page does not make that conversion. The accepted count on the miner screen is a share count. Paid is the pool’s cumulative transfers. “One block expected per 4096 shares” is an expectation on the miner screen, not a promise of payment.",
        },
      ],
      ko: [
        {
          question: "미지급은 이미 보낼 수 있는 돈인가요?",
          answer:
            "그렇게 읽지 마십시오. 그 줄은 사용 가능과 잠금의 합이고, 라벨은 잠금이 포함된다고 합니다. 이 페이지는 잠금이 왜 보낼 수 없는지를 설명하지 않고, 해제 시각도 약속하지 않습니다. 지급은 풀이 보낸 누적이며, 그래도 지갑의 체인 잔액은 아닙니다.",
        },
        {
          question: "최근 24시간이 0이면 오늘 수익이 없나요?",
          answer:
            "페이지는 빈칸을 0으로 쓰지 않습니다. 창이 정확히 24시간이 아니거나 배분이 없으면 그 줄은 알 수 없음입니다. 알 수 없음은 오늘 수입이 0이라는 말이 아닙니다.",
        },
        {
          question: "수락 지분이 많으면 지급도 커지나요?",
          answer:
            "이 페이지는 그 환산을 만들지 않습니다. 채굴기 화면의 수락 횟수는 지분 횟수입니다. 지급은 풀의 누적 송금입니다. “4096지분당 블록 1개 기대”는 채굴기 화면의 기대이지 지급 약속이 아닙니다.",
        },
      ],
      ja: [
        {
          question: "未払いはすでに送れるお金ですか？",
          answer:
            "そのようには読まないでください。その行は使用可能とロックの和で、ラベルはロックを含むと示します。このページは、ロックがなぜ送れないかを説明せず、解除時刻も約束しません。支払はプールが送った累計であり、それでもウォレットのチェーン上残高ではありません。",
        },
        {
          question: "直近24時間が 0 なら、今日の収益はゼロですか？",
          answer:
            "ページは空きを 0 とは書きません。窓がちょうど24時間でない、または配分が無いとき、その行は不明です。不明は、今日の収入がゼロだという文ではありません。",
        },
        {
          question: "受理シェアが多いほど支払は大きいですか？",
          answer:
            "このページはその換算をしません。マイナー画面の受理回数はシェアの回数です。支払はプールの累計送金です。「4096シェアにつきブロック1つの期待」はマイナー画面の期待であり、支払の約束ではありません。",
        },
      ],
    },
  },
  {
    slug: slugWorkers,
    project: "mds",
    published: "2026-10-24",
    modified: "2026-10-24",
    sources: [pools, lucky, cash],
    related: [slugBalances, slugWallet],
    topic: t(
      "Worker 和份额",
      "Worker 和份額",
      "Workers and shares",
      "워커와 지분",
      "ワーカーとシェア",
    ),
    title: t(
      "MDS Worker 显示离线时，接受份额并不是已支付",
      "MDS Worker 顯示離線時，接受份額並不是已支付",
      "When an MDS worker looks offline, accepted shares are not paid MDS",
      "MDS 워커가 오프라인으로 보일 때, 수락 지분은 지급된 MDS가 아닙니다",
      "MDSワーカーがオフラインに見えても、受理シェアは支払済みMDSではない",
    ),
    description: t(
      "MDS 监控里 Worker 在线指最后份额落在 15 分钟内。账户金额不按 Worker 拆开。矿工屏幕上的接受与拒绝次数不是打款。",
      "MDS 監控裡 Worker 在線指最後份額落在 15 分鐘內。帳戶金額不按 Worker 拆開。礦工畫面上的接受與拒絕次數不是打款。",
      "On MDS monitoring a worker is online when its last share is inside 15 minutes. Account amounts are not split per worker. Accepted and rejected counts on the miner screen are not a payout.",
      "MDS 모니터에서 워커 온라인은 마지막 지분이 15분 안에 있다는 뜻입니다. 계정 금액은 워커별로 나누지 않습니다. 채굴기 화면의 수락·거절 횟수는 지급이 아닙니다.",
      "MDS監視でワーカーのオンラインは、最終シェアが15分以内にあるという意味です。口座の金額はワーカーごとに分けません。マイナー画面の受理と拒否の回数は支払ではありません。",
    ),
    summary: t(
      "先看最后份额时间，再看这一行的 nonces/s。余额仍属于整个 MSS。没有最后份额时，在线状态是未知，不是离线，余额也不改成 0。",
      "先看最後份額時間，再看這一列的 nonces/s。餘額仍屬於整個 MSS。沒有最後份額時，在線狀態是未知，不是離線，餘額也不改成 0。",
      "Read the last share time, then that row’s nonces/s. The balance still belongs to the whole MSS. With no last share, online is unknown, not offline, and the balance is not set to 0.",
      "마지막 지분 시각을 본 다음 그 행의 nonces/s를 봅니다. 잔액은 여전히 MSS 전체의 것입니다. 마지막 지분이 없으면 온라인은 알 수 없음이지 오프라인이 아니고, 잔액도 0이 되지 않습니다.",
      "最終シェア時刻を見てから、その行の nonces/s を見ます。残高はなお MSS 全体のものです。最終シェアが無ければオンラインは不明であり、オフラインではなく、残高も 0 になりません。",
    ),
    comparisonTitle: t(
      "份额和余额",
      "份額和餘額",
      "Shares versus balances",
      "지분과 잔액",
      "シェアと残高",
    ),
    comparison: {
      zh: {
        headers: ["现象", "在本页的意思", "不要当成"],
        rows: [
          ["Worker 在线", "该名称的最后份额在 15 分钟内", "机器心跳，或余额的一部分"],
          ["Worker 离线", "最后份额早于 15 分钟", "未支付变成 0"],
          ["没有最后份额时间", "在线状态未知", "离线"],
          ["矿工屏幕 142 acc / 0 rej", "那台程序自己的计数示例", "本页上的已支付 MDS"],
          ["账户 nonces/s 和各行相加不一致", "两处都照池返回的数显示", "必须改写成同一个数"],
        ],
      },
      "zh-TW": {
        headers: ["現象", "在本頁的意思", "不要當成"],
        rows: [
          ["Worker 在線", "該名稱的最後份額在 15 分鐘內", "機器心跳，或餘額的一部分"],
          ["Worker 離線", "最後份額早於 15 分鐘", "未支付變成 0"],
          ["沒有最後份額時間", "在線狀態未知", "離線"],
          ["礦工畫面 142 acc / 0 rej", "那支程式自己的計數示例", "本頁上的已支付 MDS"],
          ["帳戶 nonces/s 和各列相加不一致", "兩處都照池返回的數顯示", "必須改寫成同一個數"],
        ],
      },
      en: {
        headers: ["What you see", "On this page", "Do not treat it as"],
        rows: [
          [
            "Worker online",
            "That name’s last share is within 15 minutes",
            "A machine heartbeat, or a slice of the balance",
          ],
          ["Worker offline", "The last share is older than 15 minutes", "Unpaid becoming 0"],
          ["No last-share time", "Online is unknown", "Offline"],
          [
            "Miner screen 142 acc / 0 rej",
            "A sample count from that program",
            "Paid MDS on this page",
          ],
          [
            "Account nonces/s disagrees with the sum of rows",
            "Both are shown as the pool returned them",
            "A requirement to force one number",
          ],
        ],
      },
      ko: {
        headers: ["보이는 것", "이 페이지에서", "이렇게 보지 않음"],
        rows: [
          ["워커 온라인", "그 이름의 마지막 지분이 15분 안", "기기 하트비트, 또는 잔액의 일부"],
          ["워커 오프라인", "마지막 지분이 15분보다 이전", "미지급이 0이 됨"],
          ["마지막 지분 시각 없음", "온라인을 알 수 없음", "오프라인"],
          ["채굴기 화면 142 acc / 0 rej", "그 프로그램의 횟수 예시", "이 페이지의 지급 MDS"],
          ["계정 nonces/s와 행의 합이 다름", "둘 다 풀이 돌려준 그대로", "하나의 수로 고쳐야 함"],
        ],
      },
      ja: {
        headers: ["見えているもの", "このページでは", "こうは扱わない"],
        rows: [
          [
            "ワーカーがオンライン",
            "その名前の最終シェアが15分以内",
            "機器の心拍、または残高の一部",
          ],
          ["ワーカーがオフライン", "最終シェアが15分より前", "未払いが 0 になる"],
          ["最終シェア時刻がない", "オンラインは不明", "オフライン"],
          ["マイナー画面 142 acc / 0 rej", "そのプログラムの回数の例", "このページの支払済み MDS"],
          [
            "口座の nonces/s と行の合計が違う",
            "どちらもプールが返したとおり",
            "一つの数に直す必要がある",
          ],
        ],
      },
    },
    body: {
      zh: [
        "一台机器好像停了，先看 [MDS 监控](/projects/mds) 里该 Worker 的最后份额，而不是把未支付改成 0。本页的“在线”指这个名称在 15 分钟内有过份额。它不是设备心跳。矿工屏幕上的接受次数也不是已支付的 MDS。",
        "## 一行 Worker 上有什么",
        "每一行有名称、这一行的 nonces/s，以及最后份额时间。15 分钟内有份额，标为在线；早于 15 分钟，标为离线。没有最后份额时间，或时间落在未来，在线状态保持未知，不标成离线。账户上的未支付、已支付和 24 小时分配属于整枚 MSS，不按 Worker 名称拆开，也不按速率比例分币。",
        "## 矿工屏幕上的份额计数",
        "官方状态屏的示例是 `Your Shares: 142 acc / 0 rej`，期望是 `1 block per 4096 shares`。这些是矿工程序在本机终端里的计数和期望。本页不显示接受次数、拒绝次数或运气。指南对“share rejected: Duplicate share or Low difficulty”的说明是：网络刚解出区块造成的过期份额，或延迟造成的重复提交，矿工会自己取新作业。那是矿工与池之间的提交结果，不是本页把余额清零的条件。",
        "## 该走哪一步",
        "- 最后份额在 15 分钟内、速率仍是 nonces/s：这一行在提交。",
        "- 最后份额更早：这一行按本页规则为离线。先看矿工是否还指向 LuckyPool，地址是否仍是那枚 MSS。",
        "- 整页查无此地址：不是 Worker 离线。回到地址和矿池是否匹配。",
        "- 账户速率与各行相加不一致时，两处都保留池返回的数。本页不把它们收成一个数，也不改写未支付。",
        "## 标明是演示的诊断",
        "下面是示意。地址未支付仍是 1,049,600 MDS。名为 cpu 的 Worker 最后份额在 20 分钟前，本页标离线，未支付不变。名为 gpu 的最后份额在 2 分钟前，标在线。账户速率若是 1,500，显示 `1.5 Knonces/s`；若两行速率加起来不是 1,500，不把未支付按比例拆开，也不把离线的那一行写成余额 0。矿工终端若仍打印 `142 acc / 0 rej`，这 142 不进入已支付。",
        "## 限度",
        "15 分钟是本页对“还在提交”的读法：最后份额落在这段时间里，这一行标为在线。接着核对 [地址是不是这枚 MSS](/learn/mds-wallet-luckypool-setup)，以及 [三笔金额为什么分开](/learn/mds-locked-unlocked-paid)。",
      ],
      "zh-TW": [
        "一台機器好像停了，先看 [MDS 監控](/projects/mds) 裡該 Worker 的最後份額，而不是把未支付改成 0。本頁的「在線」指這個名稱在 15 分鐘內有過份額。它不是裝置心跳。礦工畫面上的接受次數也不是已支付的 MDS。",
        "## 一列 Worker 上有什麼",
        "每一列有名稱、這一列的 nonces/s，以及最後份額時間。15 分鐘內有份額，標為在線；早於 15 分鐘，標為離線。沒有最後份額時間，或時間落在未來，在線狀態保持未知，不標成離線。帳戶上的未支付、已支付和 24 小時分配屬於整枚 MSS，不按 Worker 名稱拆開，也不按速率比例分幣。",
        "## 礦工畫面上的份額計數",
        "官方狀態畫面的示例是 `Your Shares: 142 acc / 0 rej`，期望是 `1 block per 4096 shares`。這些是礦工程式在本機終端裡的計數和期望。本頁不顯示接受次數、拒絕次數或運氣。指南對「share rejected: Duplicate share or Low difficulty」的說明是：網路剛解出區塊造成的過期份額，或延遲造成的重複提交，礦工會自己取新作業。那是礦工與池之間的提交結果，不是本頁把餘額清零的條件。",
        "## 該走哪一步",
        "- 最後份額在 15 分鐘內、速率仍是 nonces/s：這一列在提交。",
        "- 最後份額更早：這一列按本頁規則為離線。先看礦工是否還指向 LuckyPool，地址是否仍是那枚 MSS。",
        "- 整頁查無此地址：不是 Worker 離線。回到地址和礦池是否匹配。",
        "- 帳戶速率與各列相加不一致時，兩處都保留池返回的數。本頁不把它們收成一個數，也不改寫未支付。",
        "## 標明是演示的診斷",
        "下面是示意。地址未支付仍是 1,049,600 MDS。名為 cpu 的 Worker 最後份額在 20 分鐘前，本頁標離線，未支付不變。名為 gpu 的最後份額在 2 分鐘前，標在線。帳戶速率若是 1,500，顯示 `1.5 Knonces/s`；若兩列速率加起來不是 1,500，不把未支付按比例拆開，也不把離線的那一列寫成餘額 0。礦工終端若仍印出 `142 acc / 0 rej`，這 142 不進入已支付。",
        "## 限度",
        "15 分鐘是本頁對「還在提交」的讀法：最後份額落在這段時間裡，這一列標為在線。接著核對 [地址是不是這枚 MSS](/learn/mds-wallet-luckypool-setup)，以及 [三筆金額為什麼分開](/learn/mds-locked-unlocked-paid)。",
      ],
      en: [
        "When one machine seems to have stopped, read that worker’s last share on [MDS monitoring](/projects/mds) before you change unpaid to 0. “Online” on this page means the name had a share within 15 minutes. It is not a machine heartbeat. The accepted count on the miner screen is not paid MDS.",
        "## What one worker row holds",
        "Each row has a name, that row’s nonces/s, and the last share time. A share inside 15 minutes is online. Older than 15 minutes is offline. If the last share time is missing, or it sits in the future, online stays unknown and is not labeled offline. Unpaid, paid, and the 24-hour allocation belong to the whole MSS. They are not split by worker name and not divided in proportion to rate.",
        "## Share counts on the miner screen",
        "The official status sample shows `Your Shares: 142 acc / 0 rej`, an expectation of `1 block per 4096 shares`. Those are counts and an expectation in that program’s terminal. This page does not show accepted, rejected, or luck. The guide’s note for `share rejected: Duplicate share or Low difficulty` says a block just solved by the network makes a stale share, or latency makes a duplicate, and the miner fetches a new job. That is a submit result between miner and pool. It is not a condition that clears the balance here.",
        "## Which step to take",
        "- Last share inside 15 minutes and the rate still in nonces/s: that row is submitting.",
        "- An older last share: that row is offline by this page’s rule. Check that the miner still points at LuckyPool and still uses this MSS.",
        "- Not-found for the whole page is not an offline worker. Go back to whether the address and the pool match.",
        "- If the account rate and the sum of the rows disagree, both stay as the pool returned them. This page does not collapse them into one number, and it does not rewrite unpaid.",
        "## A diagnosis marked as an illustration",
        "The case below is an illustration. Unpaid on the address is still 1,049,600 MDS. The worker named cpu has a last share 20 minutes ago, so this page marks it offline and leaves unpaid unchanged. The worker named gpu has a last share 2 minutes ago and is online. If the account rate is 1,500, it shows `1.5 Knonces/s`. If the two row rates do not add to 1,500, unpaid is not split in proportion, and the offline row is not given a balance of 0. If the miner terminal still prints `142 acc / 0 rej`, 142 does not enter paid.",
        "## Limits",
        "Fifteen minutes is how this page reads “still submitting”: a last share inside that span marks the row online. Next, check [whether the address is this MSS](/learn/mds-wallet-luckypool-setup) and [why the three amounts stay apart](/learn/mds-locked-unlocked-paid).",
      ],
      ko: [
        "기계 한 대가 멈춘 듯하면 미지급을 0으로 바꾸기 전에 [MDS 모니터](/projects/mds)에서 그 워커의 마지막 지분을 보십시오. 이 페이지의 온라인은 그 이름이 15분 안에 지분을 냈다는 뜻입니다. 기기 하트비트가 아닙니다. 채굴기 화면의 수락 횟수도 지급된 MDS가 아닙니다.",
        "## 워커 한 행에 있는 것",
        "각 행에는 이름, 그 행의 nonces/s, 마지막 지분 시각이 있습니다. 15분 안의 지분은 온라인, 15분보다 이르면 오프라인입니다. 마지막 지분 시각이 없거나 미래이면 온라인은 알 수 없음이며 오프라인으로 쓰지 않습니다. 미지급, 지급, 24시간 배분은 MSS 전체의 것입니다. 워커 이름으로 나누지 않고 속도 비율로 코인을 나누지도 않습니다.",
        "## 채굴기 화면의 지분 횟수",
        "공식 상태 예시는 `Your Shares: 142 acc / 0 rej`, 기대는 `1 block per 4096 shares`입니다. 그 프로그램 터미널의 횟수와 기대입니다. 이 페이지는 수락, 거절, 운을 보여 주지 않습니다. 안내의 `share rejected: Duplicate share or Low difficulty`는, 네트워크가 방금 블록을 풀어 오래된 지분이 되거나 지연으로 중복 제출이 되고, 채굴기가 새 작업을 가져온다고 합니다. 채굴기와 풀 사이의 제출 결과이며, 이 페이지가 잔액을 지우는 조건이 아닙니다.",
        "## 어느 단계로 가나",
        "- 마지막 지분이 15분 안이고 속도가 아직 nonces/s이면 그 행은 제출 중입니다.",
        "- 더 이르면 이 페이지 규칙으로 오프라인입니다. 채굴기가 아직 LuckyPool을 가리키는지, 아직 이 MSS인지 보십시오.",
        "- 페이지 전체가 주소 없음이면 워커 오프라인이 아닙니다. 주소와 풀이 맞는지로 돌아갑니다.",
        "- 계정 속도와 행의 합이 다르면 둘 다 풀이 돌려준 대로 둡니다. 하나의 수로 합치지 않고, 미지급도 고치지 않습니다.",
        "## 설명용 진단",
        "아래는 예시입니다. 주소의 미지급은 여전히 1,049,600 MDS입니다. 이름이 cpu인 워커의 마지막 지분이 20분 전이면 이 페이지는 오프라인으로 표시하고 미지급은 그대로 둡니다. gpu의 마지막 지분이 2분 전이면 온라인입니다. 계정 속도가 1,500이면 `1.5 Knonces/s`입니다. 두 행의 속도를 더해 1,500이 아니면 미지급을 비율로 나누지 않고, 오프라인 행에 잔액 0을 주지도 않습니다. 채굴기 터미널이 `142 acc / 0 rej`를 찍어도 142는 지급에 들어가지 않습니다.",
        "## 한계",
        "15분은 이 페이지가 “아직 제출 중”을 읽는 방식입니다. 마지막 지분이 그 안에 있으면 그 행은 온라인입니다. 이어서 [주소가 이 MSS인지](/learn/mds-wallet-luckypool-setup)와 [세 금액이 왜 나뉘는지](/learn/mds-locked-unlocked-paid)를 확인하십시오.",
      ],
      ja: [
        "一台が止まったように見えたら、未払いを 0 にする前に [MDS監視](/projects/mds) でそのワーカーの最終シェアを見ます。このページの「オンライン」は、その名前が15分以内にシェアを出したという意味です。機器の心拍ではありません。マイナー画面の受理回数も、支払済みの MDS ではありません。",
        "## ワーカー一行にあるもの",
        "各行には名前、その行の nonces/s、最終シェア時刻があります。15分以内のシェアはオンライン、15分より前はオフラインです。最終シェア時刻が無い、または未来なら、オンラインは不明のままで、オフラインとは書きません。未払い、支払、24時間配分は MSS 全体のものです。ワーカー名では分けず、速度の割合でもコインを分けません。",
        "## マイナー画面のシェア回数",
        "公式の状態例は `Your Shares: 142 acc / 0 rej`、期待は `1 block per 4096 shares`です。そのプログラムの端末にある回数と期待です。このページは受理、拒否、運を出しません。案内の `share rejected: Duplicate share or Low difficulty` は、ネットワークがちょうどブロックを解いて古いシェアになるか、遅延で重複送信になり、マイナーが新しいジョブを取ると書きます。マイナーとプールの間の提出結果であり、このページが残高を消す条件ではありません。",
        "## どの段に進むか",
        "- 最終シェアが15分以内で、速度がまだ nonces/s なら、その行は提出中です。",
        "- それより前なら、このページの規則ではオフラインです。マイナーがまだ LuckyPool を向き、まだこの MSS かを見ます。",
        "- ページ全体がアドレスなしなら、ワーカーのオフラインではありません。アドレスとプールが合うかへ戻ります。",
        "- 口座の速度と行の合計が違えば、どちらもプールが返したままにします。一つの数にまとめず、未払いも書き換えません。",
        "## 説明用の切り分け",
        "下は例です。アドレスの未払いはなお 1,049,600 MDS です。名前が cpu のワーカーの最終シェアが20分前なら、このページはオフラインと示し、未払いは変えません。gpu の最終シェアが2分前ならオンラインです。口座速度が 1,500 なら `1.5 Knonces/s` です。二行の速度を足して 1,500 にならなければ、未払いを割合で分けず、オフラインの行に残高 0 も与えません。マイナーの端末が `142 acc / 0 rej` を出しても、142 は支払に入りません。",
        "## 限界",
        "15分は、このページが「まだ提出している」を読む方法です。最終シェアがその中にあれば、その行はオンラインです。続けて [アドレスがこの MSS か](/learn/mds-wallet-luckypool-setup) と [三つの金額がなぜ分かれるか](/learn/mds-locked-unlocked-paid) を確認してください。",
      ],
    },
    questions: {
      zh: [
        {
          question: "离线的 Worker 会不会把未支付清掉？",
          answer:
            "不会。离线只说明该名称的最后份额早于 15 分钟。未支付、已支付和 24 小时分配仍属于整枚 MSS。没有最后份额时间时，状态是未知，不是离线。",
        },
        {
          question: "142 acc / 0 rej 要在监控的哪一列看？",
          answer:
            "本页没有这一列。那是官方矿工状态屏示例里的接受与拒绝次数。已支付是矿池转出的 MDS，不是份额次数。",
        },
        {
          question: "各 Worker 的速率加起来应该等于账户速率吗？",
          answer:
            "本页不要求相等，也不帮你加总。账户速率和每一行都按池返回的数显示，单位是 nonces/s。对不上时保留两边，不要用其中一边改写未支付。",
        },
      ],
      "zh-TW": [
        {
          question: "離線的 Worker 會不會把未支付清掉？",
          answer:
            "不會。離線只說明該名稱的最後份額早於 15 分鐘。未支付、已支付和 24 小時分配仍屬於整枚 MSS。沒有最後份額時間時，狀態是未知，不是離線。",
        },
        {
          question: "142 acc / 0 rej 要在監控的哪一欄看？",
          answer:
            "本頁沒有這一欄。那是官方礦工狀態畫面示例裡的接受與拒絕次數。已支付是礦池轉出的 MDS，不是份額次數。",
        },
        {
          question: "各 Worker 的速率加起來應該等於帳戶速率嗎？",
          answer:
            "本頁不要求相等，也不幫你加總。帳戶速率和每一列都按池返回的數顯示，單位是 nonces/s。對不上時保留兩邊，不要用其中一邊改寫未支付。",
        },
      ],
      en: [
        {
          question: "Does an offline worker clear unpaid?",
          answer:
            "No. Offline only means that name’s last share is older than 15 minutes. Unpaid, paid, and the 24-hour allocation still belong to the whole MSS. With no last-share time, the state is unknown, not offline.",
        },
        {
          question: "Where do I read 142 acc / 0 rej on the monitor?",
          answer:
            "This page has no such line. That pair is the accepted and rejected count in the official miner status sample. Paid is MDS the pool has transferred, not a share count.",
        },
        {
          question: "Should worker rates add up to the account rate?",
          answer:
            "This page does not require that and does not add them for you. The account rate and each row are shown as the pool returned them, in nonces/s. When they disagree, keep both. Do not rewrite unpaid from either side.",
        },
      ],
      ko: [
        {
          question: "오프라인 워커가 미지급을 지우나요?",
          answer:
            "아닙니다. 오프라인은 그 이름의 마지막 지분이 15분보다 이르다는 뜻뿐입니다. 미지급, 지급, 24시간 배분은 여전히 MSS 전체의 것입니다. 마지막 지분 시각이 없으면 상태는 알 수 없음이지 오프라인이 아닙니다.",
        },
        {
          question: "142 acc / 0 rej는 모니터 어디를 보나요?",
          answer:
            "이 페이지에는 그 줄이 없습니다. 공식 채굴기 상태 예시의 수락·거절 횟수입니다. 지급은 풀이 보낸 MDS이지 지분 횟수가 아닙니다.",
        },
        {
          question: "워커 속도를 더하면 계정 속도와 같아야 하나요?",
          answer:
            "이 페이지는 같기를 요구하지 않고 대신 더해 주지도 않습니다. 계정 속도와 각 행은 풀이 돌려준 대로, 단위는 nonces/s입니다. 다르면 둘 다 두고, 어느 한쪽으로 미지급을 고치지 마십시오.",
        },
      ],
      ja: [
        {
          question: "オフラインのワーカーは未払いを消しますか？",
          answer:
            "消しません。オフラインは、その名前の最終シェアが15分より前だという意味だけです。未払い、支払、24時間配分はなお MSS 全体のものです。最終シェア時刻が無ければ、状態は不明であり、オフラインではありません。",
        },
        {
          question: "142 acc / 0 rej は監視のどこで見ますか？",
          answer:
            "このページにその行はありません。公式マイナー状態例の受理と拒否の回数です。支払はプールが送った MDS であり、シェアの回数ではありません。",
        },
        {
          question: "ワーカーの速度を足すと口座の速度になるべきですか？",
          answer:
            "このページは一致を求めず、代わりに足しもしません。口座の速度と各行はプールが返したとおりで、単位は nonces/s です。違えば両方を残し、どちらかで未払いを書き換えないでください。",
        },
      ],
    },
  },
];
