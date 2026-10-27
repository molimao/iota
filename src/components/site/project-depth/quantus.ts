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
  heads: { zh: string[]; tw: string[]; en: string[]; ko: string[]; ja: string[] },
): Article["body"] {
  const expand = (block: string) => {
    if (!block.includes("\n") || block.trimStart().startsWith("|")) return [block];
    return block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  };
  const inject = (blocks: string[], h: string[]) => {
    const out: string[] = [];
    blocks.forEach((block, index) => {
      if (index === 0 || index === 2 || index === 4)
        out.push(`## ${h[index === 0 ? 0 : index === 2 ? 1 : 2]}`);
      out.push(...expand(block));
    });
    return out;
  };
  return {
    zh: inject(zh, heads.zh),
    "zh-TW": inject(tw, heads.tw),
    en: inject(en, heads.en),
    ko: inject(ko, heads.ko),
    ja: inject(ja, heads.ja),
  };
}

const mac = "quantus-mainnet-mining-mac";
const rewards = "quantus-wormhole-rewards";
const none = "quantus-mining-no-rewards";
const hashrate = "quantus-qpow-hashrate-vs-blocks";
const safety = "quantus-wallet-mining-address-safety";

const miningGuide = {
  name: "Quantus · official mainnet mining guide",
  url: "https://docs.quantus.com/guides/mining/",
};
const minerRepo = {
  name: "Quantus · miner repository",
  url: "https://github.com/Quantus-Network/quantus-miner",
};
const explorer = {
  name: "Quantus · official mainnet explorer",
  url: "https://explorer.quantus.com/",
};
const site = { name: "Quantus · official website", url: "https://www.quantus.com/" };
const rules = {
  name: "IOTA Watch · source and data rules",
  url: "https://github.com/molimao/iota",
};

const sharedSources = [miningGuide, minerRepo, explorer, rules];

export const quantusDepthGuides: Article[] = [
  {
    slug: mac,
    project: "quantus",
    published: "2026-10-03",
    modified: "2026-10-24",
    topic: text(
      "安装与监控",
      "安裝與監控",
      "Setup and monitoring",
      "설정 및 모니터링",
      "設定とモニタリング",
    ),
    title: text(
      "Quantus QTC 主网挖矿：Mac 节点同步与监控",
      "Quantus QTC 主網挖礦：Mac 節點同步與監控",
      "Quantus QTC mining on Mac: mainnet sync and monitoring",
      "Mac에서 Quantus QTC 채굴: 메인넷 동기화와 모니터링",
      "MacでQuantus QTCをマイニング：メインネット同期と監視",
    ),
    description: text(
      "Mac 上先确认 --chain mainnet、节点已到链尖，再把 Wormhole 公开地址放进监控。Planck 已退役，进程在跑不等于有 QTC。",
      "Mac 上先確認 --chain mainnet、節點已到鏈尖，再把 Wormhole 公開地址放進監控。Planck 已退役，程式在跑不等於有 QTC。",
      "On a Mac, confirm --chain mainnet and a node at the chain tip, then save the public wormhole address. Planck is retired. A running process is not QTC.",
      "Mac에서 --chain mainnet과 체인 끝 동기화를 확인한 뒤 웜홀 공개 주소를 저장하세요. Planck는 종료됐고, 프로세스 실행은 QTC가 아닙니다.",
      "Macでは --chain mainnet とチェーン先端への同期を確認してから、Wormhole公開アドレスを保存します。Planckは退役済みです。プロセス稼働はQTCではありません。",
    ),
    summary: text(
      "Quantus 主网与已退役的 Planck 测试网不是同一条链。Mac 自建挖矿要等节点日志从 Syncing 变为当前链尖的 Idle，再让矿工连接。本站只读主网索引里的出块奖励，不安装节点，也不读取本机算力。",
      "Quantus 主網與已退役的 Planck 測試網不是同一條鏈。Mac 自建挖礦要等節點日誌從 Syncing 變為目前鏈尖的 Idle，再讓礦工連接。本站只讀主網索引裡的出塊獎勵，不安裝節點，也不讀取本機算力。",
      "Quantus mainnet is not the retired Planck testnet. On a Mac, wait until the node log moves from Syncing to Idle at the current tip before the miner should be producing. This site reads indexed mainnet block rewards only. It does not install a node or read local hashrate.",
      "Quantus 메인넷은 종료된 Planck 테스트넷이 아닙니다. Mac에서는 노드 로그가 Syncing에서 현재 체인 끝의 Idle로 바뀐 뒤에 채굴기가 의미 있습니다. 이 사이트는 인덱싱된 메인넷 블록 보상만 읽고, 노드를 설치하거나 로컬 해시레이트를 읽지 않습니다.",
      "Quantusメインネットは退役したPlanckテストネットではありません。MacではノードログがSyncingから現在の先端のIdleに変わるまで待ちます。当サイトは索引されたメインネットのブロック報酬だけを読み、ノードの導入やローカル算力の読み取りはしません。",
    ),
    body: paras(
      [
        "Mac 上的 Quantus 挖矿，先看节点有没有同步到**当前主网链尖**，再看矿工有没有连上这台已同步的节点。官方挖矿指南写明使用 `--chain mainnet`，不要使用 `--chain planck`：Planck 是已退役的公共测试网，主网不共享它的历史、数据库或奖励。节点需要 v1.0.1 或更新，更旧的二进制没有主网链规格。Apple Silicon 用 aarch64-apple 原生构建，Intel Mac 用 x86-apple。Linux ARM64 没有官方原生 quantus-miner 发布包，那条路径不适用于这台 Mac。",
        "打开 [Quantus 监控](/projects/quantus) 时，页面上的网络高度、历史上获得过奖励的地址数、账户数，以及最近索引区块的高度、时间和奖励，都来自主网索引，不是这台 Mac 的任务管理器。索引不提供全网算力。相邻高度才能算出一个样本间隔，那个间隔不是协议规定的出块目标，也不是你的份额。官网首页把 QTC 描述为通过工作量证明进入流通，并给出供应上限和活跃矿工展示。那些是官网自己的说法，不是监控里的在线设备数，也不能换成你的日收入。",
        "在本机对照这几项，网页替不了日志。\n- 链必须是 mainnet，数据目录是 `chains/mainnet/`，不要沿用 `chains/planck/`。\n- 从 Planck 迁过来时可以保留原来的 wormhole inner hash，从而继续用同一奖励地址。官方安装脚本的 `--force` 只更新二进制并保留该 inner hash，不会把 Planck 链数据拷进主网。\n- 节点日志从 Syncing 变成当前链尖的 Idle 才算同步完成。同步完成前挖出的块是孤块，没有有效奖励。\n- 节点没有 peer 时矿工会自动暂停。官方指南把同步耗时写成大约 15 分钟到数小时，视硬件和网络而定。\n- 若出现 Verification failed 并掉到 0 个 peer，按官方指南核对节点版本是否与当前网络一致。",
        "节点和矿工必须是同一套矿工协议。当前带认证的配对使用 ALPN `quantus-miner/2`。官方脚本会检查两边的帮助输出，只有双方都支持矿工 QUIC 认证才传递认证参数；混用会在握手阶段失败。更旧的无认证版本则不要强行加上认证参数。GPU 为官方推荐路径，矿工在宿主机上跑以便使用 Metal。这是配置建议，不是收益承诺。`--force-authoring` 只用于引导一条全新网络，加入主网时不要加。",
        "| 你看到的现象 | 它说明什么 | 下一步 |\n| --- | --- | --- |\n| 进程在、日志仍是 Syncing | 还没到链尖 | 等 Idle，先不要用孤块判断收益 |\n| 链是 planck 或数据在 planck 目录 | 不是本站查询的主网 | 改 mainnet，勿复制旧链库 |\n| 矿工立刻退出 | 常见为认证或版本不配对 | 核对发布标签与认证文件，见安全篇 |\n| 监控有高度、本机无奖励 | 网络在出块，不等于这台机器出块 | 改查公开 Wormhole 地址 |",
        "说明性例子：Mac 上节点进程存活，日志仍写 Syncing，高度停在远低于监控页索引高度的位置。按官方指南，此时本地找到的块是孤块，不构成 QTC 奖励。监控页继续显示索引里别人的区块是正常的。等日志变为该链尖的 Idle，并且启动日志里的 Wormhole 公开地址与你保存的地址一致后，再看奖励记录。",
        "行动分支：还在同步，就继续等链尖，不要把风扇或 GPU 占用当成出块。版本握手失败，先把节点与矿工钉到同一套发布，而不是反复重启。地址准备好之后，到 [Wormhole 地址与今日、累计](/learn/quantus-wormhole-rewards) 读数字含义；记录为空再到 [没有收益](/learn/quantus-mining-no-rewards)。本站不能安装或停止节点，不能读取 `~/Library/Application Support/quantus-node/` 里的日志，页面上的 Agent 也不操作 Quantus。每个项目免费 3 台已保存设备，Pro 100 台。列表里的地址不会自动多占一台；另行保存的设备记录才计入，同一台设备上的多条来源不重复占名额。崩溃分析若单独提供，不改变上述挖矿结论。",
      ],
      [
        "Mac 上的 Quantus 挖礦，先看節點有沒有同步到**目前主網鏈尖**，再看礦工有沒有連上這台已同步的節點。官方挖礦指南寫明使用 `--chain mainnet`，不要使用 `--chain planck`：Planck 是已退役的公共測試網，主網不共享它的歷史、資料庫或獎勵。節點需要 v1.0.1 或更新。Apple Silicon 用 aarch64-apple，Intel Mac 用 x86-apple。Linux ARM64 沒有官方原生 miner 發布包，與這台 Mac 無關。",
        "打開 [Quantus 監控](/projects/quantus) 時，網路高度、歷史上獲得過獎勵的地址數、帳戶數，以及最近索引區塊的高度、時間和獎勵，都來自主網索引，不是這台 Mac 的活動監視器。索引不提供全網算力。只有相鄰高度才能算出樣本間隔，那個間隔不是協定出塊目標，也不是你的份額。官網對 QTC 的工作量證明、供應上限，以及頁面上的活躍礦工展示，是官網自己的說法，不是監控裡的線上設備數，也不能換成你的日收入。",
        "在本機對照日誌，網頁替不了日誌。\n- 鏈必須是 mainnet，資料目錄是 `chains/mainnet/`，不要沿用 `chains/planck/`。\n- 從 Planck 遷移時可保留原 wormhole inner hash，從而沿用同一獎勵地址。官方 `--force` 只更新二進位並保留該 inner hash，不會把 Planck 鏈資料拷進主網。\n- 日誌從 Syncing 變成目前鏈尖的 Idle 才算同步完成。同步前挖出的塊是孤塊，沒有有效獎勵。\n- 沒有 peer 時礦工會自動暫停。官方指南把同步耗時寫成大約 15 分鐘到數小時，視硬體和網路而定。\n- 若出現 Verification failed 並掉到 0 個 peer，按官方指南核對節點版本是否與目前網路一致。",
        "節點與礦工必須是同一套礦工協定。目前帶認證的配對使用 ALPN `quantus-miner/2`。混用會在握手失敗。更舊的無認證版本不要強行加上認證參數。GPU 是官方建議路徑，方便使用 Metal，這不是收益承諾。加入主網時不要加 `--force-authoring`。",
        "| 你看到的現象 | 它說明什麼 | 下一步 |\n| --- | --- | --- |\n| 程式在、日誌仍是 Syncing | 還沒到鏈尖 | 等 Idle，先不要用孤塊判斷收益 |\n| 鏈是 planck 或資料在 planck 目錄 | 不是本站查詢的主網 | 改 mainnet，勿複製舊鏈庫 |\n| 礦工立刻退出 | 常見為認證或版本不配對 | 核對發布標籤與認證檔案 |\n| 監控有高度、本機無獎勵 | 網路在出塊，不等於這台機器出塊 | 改查公開 Wormhole 地址 |",
        "說明性例子：節點程式存活，日誌仍是 Syncing，高度遠低於監控頁索引高度。按官方指南，此時本機找到的塊是孤塊，不構成 QTC。監控頁仍顯示索引中其他人的區塊是正常的。等日誌變為該鏈尖的 Idle，且啟動日誌中的 Wormhole 公開地址與你保存的一致後，再看獎勵。",
        "還在同步就繼續等鏈尖。版本握手失敗時，把節點與礦工釘到同一套發布。地址就緒後讀 [Wormhole 地址與今日、累計](/learn/quantus-wormhole-rewards)；紀錄為空再看 [沒有收益](/learn/quantus-mining-no-rewards)。本站不能安裝或停止節點，不能讀取本機日誌，頁面上的 Agent 也不操作 Quantus。每個專案免費 3 台已儲存設備，Pro 100 台。列表裡的地址不會自動多占一台；另行儲存的設備紀錄才計入，同一台設備上的多條來源不重複占名額。",
      ],
      [
        "On a Mac, Quantus mining starts with a node that has reached the **current mainnet tip**, then a miner attached to that synced node. The official mining guide says to use `--chain mainnet`, not `--chain planck`. Planck is the retired public testnet. Mainnet does not share its history, database, or rewards. The node must be v1.0.1 or newer; older binaries do not include the mainnet chain spec. Apple Silicon uses the aarch64-apple build; Intel Macs use x86-apple. Linux ARM64 has no official native quantus-miner release; that path does not apply to this Mac.",
        "The [Quantus monitor](/projects/quantus) shows index fields: chain height, the count of addresses historically recorded with mining rewards, account count, and recent indexed blocks with height, time, and reward. Those numbers are not Activity Monitor. The index does not supply a network hashrate. A gap appears only between consecutive heights in the fetched window. That gap is a sample, not a protocol block target and not your share. The public website’s proof-of-work wording, supply-cap narrative, and active-miner figure are that site’s own statements. They are not the monitor’s count of online machines, and they do not convert into your daily income.",
        "Check the Mac locally. This website cannot read the log.\n- The chain must be mainnet, with data under `chains/mainnet/`, not a reused `chains/planck/` database.\n- When migrating, the official guide says you may keep the same wormhole inner hash so rewards stay on the same address. The installer `--force` path refreshes binaries and keeps that inner hash. It does not copy Planck chain data.\n- Sync is complete when the log switches from Syncing to Idle at the current tip. Blocks found before that are orphans and earn nothing.\n- The miner pauses automatically if the node has no peers. The guide expects roughly 15 minutes to a couple of hours, depending on hardware and connection.\n- If sync stalls with Verification failed and the peer count drops to zero, the guide attributes that to a node version out of step with the network. Check the release the network is using.",
        "Node and miner must be a matching pair. Authenticated builds use the ALPN `quantus-miner/2`. The setup script passes auth flags only when both sides support miner QUIC auth. A mixed pair fails the handshake. Older pre-auth releases omit those flags. GPU mining is the recommended host path so the miner can use Metal. That is a setup preference, not a payout promise. Do not pass `--force-authoring` to join mainnet; the guide limits that flag to bootstrapping a new network. The comparison below is the branch to follow.",
        "Illustrative example: the Mac process is alive, the log still says Syncing, and the local height sits far below the height on the monitor. Under the official guide those local finds are orphans and are not QTC rewards. The monitor continuing to list other indexed blocks is expected. Wait until Idle at that tip, then confirm the wormhole public address printed at node start is the one you saved.",
        "If the node is still syncing, wait for the tip instead of reading fan or GPU load as blocks. If the handshake fails, pin node and miner to one release pair. When the public address is ready, read what today and lifetime mean in [wormhole rewards](/learn/quantus-wormhole-rewards). If the row stays empty, use [no rewards](/learn/quantus-mining-no-rewards). This site does not install or stop the node, does not read logs under the macOS application-support chain directory, and the on-page agent does not operate Quantus. Free keeps three saved devices per project, and Pro keeps 100. An address that only appears in a list does not add a device. A separately saved device record does, and extra sources on the same saved device do not add another slot. A separate crash analysis does not change the sync conclusion.",
      ],
      [
        "Mac에서 Quantus 채굴은 **현재 메인넷 체인 끝**에 동기화된 노드가 먼저이고, 그다음이 그 노드에 붙은 채굴기입니다. 공식 채굴 안내는 `--chain mainnet`을 쓰고 `--chain planck`는 쓰지 말라고 합니다. Planck는 종료된 공용 테스트넷이며 메인넷과 역사·데이터베이스·보상을 공유하지 않습니다. 노드는 v1.0.1 이상이어야 합니다. Apple Silicon은 aarch64-apple, Intel Mac은 x86-apple입니다. Linux ARM64용 네이티브 miner 릴리스가 없다는 설명은 이 Mac과 다른 환경입니다.",
        "[Quantus 모니터](/projects/quantus)의 체인 높이, 과거에 보상을 받은 주소 수, 계정 수, 최근 인덱싱 블록의 높이·시각·보상은 메인넷 인덱스입니다. 활동 모니터가 아닙니다. 인덱스에는 네트워크 해시레이트가 없습니다. 연속된 높이 사이에서만 표본 간격이 나오며, 그 간격은 프로토콜 목표도 본인 지분도 아닙니다. 공식 사이트의 작업증명·공급 상한 서술과 활성 채굴기 표시는 그 사이트의 문장입니다. 모니터의 온라인 기기 수가 아니고, 하루 수입으로도 바뀌지 않습니다.",
        "로그는 Mac에서 확인합니다. 웹사이트가 로그를 대신 읽지는 않습니다.\n- 체인은 mainnet, 데이터는 `chains/mainnet/`이며 `chains/planck/`를 재사용하지 않습니다.\n- Planck에서 옮길 때 같은 wormhole inner hash를 유지하면 보상 주소가 유지됩니다. 공식 `--force`는 바이너리만 갱신하고 그 해시를 남기며 Planck 체인 데이터를 복사하지 않습니다.\n- 로그가 Syncing에서 현재 끝의 Idle로 바뀌어야 동기화입니다. 그 전 블록은 고아이고 보상이 없습니다.\n- peer가 없으면 채굴기는 자동으로 멈춥니다. 안내의 동기화 시간은 하드웨어와 연결에 따라 약 15분에서 수 시간입니다.\n- Verification failed와 peer 0은 안내상 노드 버전이 네트워크와 어긋난 경우입니다. 네트워크가 쓰는 릴리스를 확인하세요.",
        "노드와 채굴기는 같은 채굴 프로토콜이어야 합니다. 인증 빌드의 ALPN은 `quantus-miner/2`입니다. 한쪽만 인증을 지원하면 핸드셰이크가 실패합니다. GPU는 Metal을 쓰기 위한 공식 권장 경로이며 수익 약속이 아닙니다. 메인넷 참가에 `--force-authoring`을 붙이지 마세요.",
        "프로세스는 있는데 로그가 Syncing이면 아직 체인 끝이 아닙니다. planck 사슬이나 디렉터리는 이 모니터의 인덱스가 아닙니다. 채굴기가 바로 종료되면 인증 또는 버전 불일치가 흔합니다. 모니터에 높이가 있어도 내 주소 보상이 없으면, 네트워크가 블록을 만들고 있을 뿐 이 Mac이 찾았다는 뜻은 아닙니다.",
        "설명용 예: 프로세스는 살아 있고 로그는 Syncing이며 로컬 높이가 모니터 인덱스보다 한참 낮습니다. 공식 안내대로 그때의 로컬 블록은 고아입니다. 모니터가 다른 주소의 블록을 보여주는 것은 정상입니다. 해당 끝에서 Idle이 되고, 시작 로그의 Wormhole 공개 주소가 저장한 주소와 같으면 그때 보상을 봅니다.",
        "동기화 중이면 체인 끝을 기다립니다. 핸드셰이크가 실패하면 노드와 채굴기를 한 릴리스 쌍으로 고정합니다. 주소가 준비되면 [웜홀 주소와 오늘·누적](/learn/quantus-wormhole-rewards)을 읽고, 기록이 없으면 [보상 없음](/learn/quantus-mining-no-rewards)으로 갑니다. 이 사이트는 노드를 설치하거나 멈추지 않고, Mac 로그를 읽지 않으며, 페이지의 Agent는 Quantus를 조작하지 않습니다. 프로젝트당 무료는 저장된 기기 3대, Pro는 100대입니다. 목록에 보이는 주소가 자동으로 기기를 늘리지는 않습니다. 따로 저장한 기기 기록만 세고, 같은 기기의 출처를 더해도 자리는 늘지 않습니다.",
      ],
      [
        "MacのQuantus採掘は、**現在のメインネット先端**まで同期したノードが先で、そのノードに付いたマイナーが後です。公式マイニングガイドは `--chain mainnet` を使い、`--chain planck` は使わないと書きます。Planckは退役した公開テストネットで、履歴・データベース・報酬をメインネットと共有しません。ノードは v1.0.1 以降です。Apple Siliconは aarch64-apple、Intel Macは x86-apple です。Linux ARM64にネイティブminerのリリースがない、という説明はこのMacとは別です。",
        "[Quantusモニター](/projects/quantus)のチェーン高、過去に報酬が記録されたアドレス数、アカウント数、直近の索引ブロックの高さ・時刻・報酬はメインネット索引です。アクティビティモニタではありません。索引にネットワーク算力はありません。連続した高さのあいだだけ標本間隔が出ます。その間隔はプロトコルの目標でも、自分のシェアでもありません。公式サイトのPoW・供給上限の記述やアクティブマイナー表示は、そのサイト自身の文面です。モニターのオンライン台数ではなく、一日の収入にも換わりません。",
        "ログはMac側で見ます。このウェブサイトはログを代わりに読みません。\n- チェーンは mainnet、データは `chains/mainnet/` で、`chains/planck/` は再利用しません。\n- Planckから移るとき、同じ wormhole inner hash を保てば報酬アドレスは同じままです。公式の `--force` はバイナリを更新してそのハッシュを残し、Planckのチェーンデータはコピーしません。\n- ログが Syncing から現在の先端の Idle に変わって同期完了です。それ以前のブロックは孤立で報酬がありません。\n- peerが無いとマイナーは自動で止まります。ガイドが書く同期待ちはハードウェアと回線によりおおよそ15分から数時間です。\n- Verification failed で peer が 0 になるのは、ガイド上はノード版がネットワークとずれている状態です。ネットワークが使っているリリースを確認します。",
        "ノードとマイナーは同じマイナープロトコルです。認証付きの組は ALPN `quantus-miner/2` です。片方だけ認証に対応しているとハンドシェイクで失敗します。GPUはMetalを使うための公式の推奨で、支払の約束ではありません。メインネット参加に `--force-authoring` は付けません。",
        "プロセスが動いていてもログが Syncing なら、まだ先端ではありません。planck のチェーンやディレクトリは、このモニターが読む索引ではありません。マイナーがすぐ終了する場合は認証か版の不一致が多いです。モニターに高さがあっても自分のアドレスに報酬が無いのは、ネットワークがブロックを作っているだけで、このMacが見つけた証明ではありません。",
        "説明用の例: プロセスは生きていてログは Syncing、ローカル高はモニターの索引よりずっと低い。公式ガイドではその時点のローカルブロックは孤立です。モニターが他のアドレスのブロックを出し続けるのは想定内です。その先端で Idle になり、起動ログのWormhole公開アドレスが保存したものと一致してから報酬を見ます。",
        "同期中は先端を待ちます。ハンドシェイクが失敗したらノードとマイナーを一つのリリース組に固定します。公開アドレスが用意できたら [Wormholeアドレスと今日・累計](/learn/quantus-wormhole-rewards) を読み、記録が空なら [報酬がない](/learn/quantus-mining-no-rewards) へ進みます。当サイトはノードを導入も停止もせず、Macのログを読まず、ページ上のAgentはQuantusを操作しません。各プロジェクト無料は保存したデバイス3台、Proは100台です。一覧に出るアドレスが自動で台数を増やすことはありません。別に保存したデバイス記録だけを数え、同じデバイスの出典を足しても枠は増えません。",
      ],
      {
        zh: ["先确认主网链尖", "监控上的数字", "同步没有完成时"],
        tw: ["先確認主網鏈尖", "監控上的數字", "同步沒有完成時"],
        en: ["Confirm the mainnet tip", "Figures on the monitor", "When sync is not finished"],
        ko: ["메인넷 끝을 먼저 확인", "모니터의 숫자", "동기화가 끝나지 않았을 때"],
        ja: ["メインネット先端を先に確認", "モニターの数字", "同期が終わっていないとき"],
      },
    ),
    comparisonTitle: text(
      "同步现象对照",
      "同步現象對照",
      "What the sync symptom means",
      "동기화 증상의 의미",
      "同期の見え方",
    ),
    comparison: {
      zh: {
        headers: ["现象", "含义", "下一步"],
        rows: [
          ["日志仍是 Syncing", "未到主网链尖", "等 Idle，孤块没有有效奖励"],
          ["数据在 planck 目录", "退役测试网，不是本站主网索引", "改 mainnet，不复制旧链库"],
          ["矿工立即退出", "常见为版本或认证不配对", "核对 quantus-miner/2 与认证文件"],
          ["监控有高度但地址无奖励", "网络在出块，不是这台 Mac 的证明", "改查 Wormhole 公开地址"],
        ],
      },
      "zh-TW": {
        headers: ["現象", "含義", "下一步"],
        rows: [
          ["日誌仍是 Syncing", "未到主網鏈尖", "等 Idle，孤塊沒有有效獎勵"],
          ["資料在 planck 目錄", "退役測試網，不是本站主網索引", "改 mainnet，不複製舊鏈庫"],
          ["礦工立即退出", "常見為版本或認證不配對", "核對 quantus-miner/2 與認證檔案"],
          ["監控有高度但地址無獎勵", "網路在出塊，不是這台 Mac 的證明", "改查 Wormhole 公開地址"],
        ],
      },
      en: {
        headers: ["What you see", "What it means", "Next step"],
        rows: [
          [
            "Log still says Syncing",
            "Not at the mainnet tip",
            "Wait for Idle; orphans earn nothing",
          ],
          [
            "Data under planck",
            "Retired testnet, not this index",
            "Switch to mainnet; do not copy the old database",
          ],
          [
            "Miner exits immediately",
            "Usually a version or auth mismatch",
            "Match quantus-miner/2 and the auth files",
          ],
          [
            "Monitor has height, address has no reward",
            "The network is producing blocks",
            "Check the public wormhole address",
          ],
        ],
      },
      ko: {
        headers: ["보이는 것", "의미", "다음"],
        rows: [
          ["로그가 Syncing", "메인넷 끝이 아님", "Idle까지 대기, 고아는 보상 없음"],
          ["데이터가 planck", "종료된 테스트넷", "mainnet으로 전환, 옛 DB를 복사하지 않음"],
          ["채굴기가 즉시 종료", "보통 버전 또는 인증 불일치", "quantus-miner/2와 인증 파일 확인"],
          ["높이만 있고 주소 보상 없음", "네트워크가 블록을 생성 중", "웜홀 공개 주소 확인"],
        ],
      },
      ja: {
        headers: ["見えること", "意味", "次"],
        rows: [
          ["ログが Syncing", "メインネット先端ではない", "Idleまで待つ。孤立は報酬なし"],
          ["データが planck", "退役テストネット", "mainnetへ。旧DBはコピーしない"],
          ["マイナーが即終了", "多くは版か認証の不一致", "quantus-miner/2 と認証ファイル"],
          ["高さだけあり報酬なし", "ネットワークはブロックを生成中", "Wormhole公開アドレスを確認"],
        ],
      },
    },
    questions: questions([
      [
        text(
          "Mac 上进程在跑，就能算已经在挖 QTC 吗？",
          "Mac 上程式在跑，就能算已經在挖 QTC 嗎？",
          "Does a running Mac process mean QTC mining has started?",
          "Mac 프로세스가 실행 중이면 QTC 채굴이 시작된 것인가요?",
          "Macのプロセスが動いていればQTC採掘は始まっていますか？",
        ),
        text(
          "不能。官方指南要求节点先到主网链尖（日志为 Idle）。同步前的块是孤块，没有有效奖励。",
          "不能。官方指南要求節點先到主網鏈尖（日誌為 Idle）。同步前的塊是孤塊，沒有有效獎勵。",
          "No. The official guide requires the node to reach the mainnet tip (Idle in the log). Blocks before that are orphans and earn nothing.",
          "아니요. 공식 안내는 노드가 메인넷 끝(로그 Idle)에 닿아야 한다고 합니다. 그 전 블록은 고아이고 보상이 없습니다.",
          "いいえ。公式ガイドはノードがメインネット先端（ログがIdle）に達することを求めています。それ以前は孤立で報酬がありません。",
        ),
      ],
      [
        text(
          "Planck 上的余额会进到这个主网页面吗？",
          "Planck 上的餘額會進到這個主網頁面嗎？",
          "Do Planck balances appear on this mainnet page?",
          "Planck 잔액이 이 메인넷 페이지에 나오나요?",
          "Planckの残高はこのメインネットのページに出ますか？",
        ),
        text(
          "不会。官方说明主网不继承 Planck 的历史和奖励。本站只读主网索引。",
          "不會。官方說明主網不繼承 Planck 的歷史和獎勵。本站只讀主網索引。",
          "No. The project states that mainnet does not carry Planck history or rewards. This page reads the mainnet index only.",
          "아니요. 공식 설명상 메인넷은 Planck의 역사와 보상을 이어받지 않습니다. 이 페이지는 메인넷 인덱스만 읽습니다.",
          "いいえ。公式説明ではメインネットはPlanckの履歴と報酬を引き継ぎません。このページはメインネット索引だけです。",
        ),
      ],
      [
        text(
          "监控页的高度是我这台 Mac 的挖矿进度吗？",
          "監控頁的高度是我這台 Mac 的挖礦進度嗎？",
          "Is the height on the monitor my Mac’s mining progress?",
          "모니터의 높이는 내 Mac의 채굴 진행인가요?",
          "モニターの高さは自分のMacの採掘進捗ですか？",
        ),
        text(
          "不是。那是主网索引里的链高度。你的机器是否同步，要看本机日志是否已在该链尖 Idle。",
          "不是。那是主網索引裡的鏈高度。你的機器是否同步，要看本機日誌是否已在該鏈尖 Idle。",
          "No. It is the chain height in the mainnet index. Whether your machine is synced is the local log showing Idle at that tip.",
          "아니요. 메인넷 인덱스의 체인 높이입니다. 내 기기의 동기화는 로컬 로그가 그 끝에서 Idle인지로 봅니다.",
          "いいえ。メインネット索引のチェーン高です。自分のマシンの同期は、ローカルログがその先端でIdleかどうかです。",
        ),
      ],
    ]),
    sources: sharedSources,
    related: [rewards, none, hashrate],
  },
  {
    slug: rewards,
    project: "quantus",
    published: "2026-10-03",
    modified: "2026-10-24",
    topic: text("数据与收益", "資料與收益", "Data and rewards", "데이터 및 보상", "データと報酬"),
    title: text(
      "Quantus Wormhole 地址：今日与累计 QTC 收益怎么查",
      "Quantus Wormhole 地址：今日與累計 QTC 收益怎麼查",
      "Quantus wormhole address: check daily and lifetime QTC rewards",
      "Quantus 웜홀 주소: 오늘과 누적 QTC 보상 조회",
      "Quantus Wormholeアドレス：今日と累計QTC報酬の確認",
    ),
    description: text(
      "用挖矿实际使用的 Wormhole 公开地址查看今日与累计已索引的 QTC 出块奖励。两者都不是钱包余额，也不是交易所余额。",
      "用挖礦實際使用的 Wormhole 公開地址查看今日與累計已索引的 QTC 出塊獎勵。兩者都不是錢包餘額，也不是交易所餘額。",
      "Use the wormhole public address your miner actually pays. Today and lifetime are indexed QTC block rewards, not a wallet balance and not an exchange balance.",
      "실제로 보상이 들어가는 웜홀 공개 주소로 오늘과 누적의 인덱싱된 QTC 블록 보상을 봅니다. 둘 다 지갑 잔액도 거래소 잔액도 아닙니다.",
      "実際に報酬が入るWormhole公開アドレスで、今日と累計の索引済みQTCブロック報酬を見ます。どちらもウォレット残高でも取引所残高でもありません。",
    ),
    summary: text(
      "监控要的是公开 Address，不是 inner hash，也不是 24 个单词。今日是香港时间 0 点到本次查询之间已索引的挖矿奖励合计；累计是该地址在索引账户统计里的历史挖矿奖励。链上整数按 12 位小数换算。没有账户记录时不显示 0。",
      "監控要的是公開 Address，不是 inner hash，也不是 24 個單詞。今日是香港時間 0 點到本次查詢之間已索引的挖礦獎勵合計；累計是該地址在索引帳戶統計裡的歷史挖礦獎勵。鏈上整數按 12 位小數換算。沒有帳戶紀錄時不顯示 0。",
      "The monitor wants the public Address, not the inner hash and not the 24 words. Today sums indexed mining rewards from Hong Kong midnight to this query. Lifetime is that address’s historical mining rewards in the index account stats. Chain integers use 12 decimal places. A missing account is not shown as zero.",
      "모니터는 공개 Address만 받습니다. inner hash와 24단어는 받지 않습니다. 오늘은 홍콩 시간 0시부터 이번 조회까지 인덱싱된 채굴 보상의 합이고, 누적은 인덱스 계정 통계의 과거 채굴 보상입니다. 온체인 정수는 소수 12자리입니다. 계정 기록이 없으면 0으로 보여 주지 않습니다.",
      "モニターが要るのは公開Addressです。inner hashでも24語でもありません。今日は香港時間0時から今回の照会までに索引された採掘報酬の合計、累計はそのアドレスの索引アカウント統計にある過去の採掘報酬です。チェーン整数は小数12桁です。アカウント記録が無いとき0にはしません。",
    ),
    body: paras(
      [
        "查 Quantus 收益时，粘贴的必须是**挖矿奖励实际进入的 Wormhole 公开地址**。官方指南写明：链只把挖矿奖励累计到 wormhole 地址，而不是普通钱包地址。密钥生成输出里的 Address 就是要记下的监控地址；节点启动日志也会打印由 inner hash 推导出的该地址。inner hash 和 24 个单词用来证明所有权，只留在本机。网页、聊天和截图都不需要它们。",
        "在 [Quantus 监控](/projects/quantus) 里，今日与累计回答的是不同的问题。今日是香港时间当日 0 点（UTC+8，不跟浏览器时区走）到这次查询时刻之间，索引里该地址的挖矿奖励合计。过了香港时间午夜，今日可以回到 0，累计不必跟着变。累计来自该地址的账户统计总奖励，是索引中的历史挖矿奖励，不是钱包里此刻能花的余额，也不是交易所或 NEAR 上的兑换余额。官网写：若用与钱包 App 相同的种子派生 wormhole，奖励会出现在 App 里，可直接从 wormhole 余额花费，没有单独的领取步骤。那是钱包里的花费能力，本页不读取钱包余额。",
        "金额按 12 位小数从链上整数换算，缺记录或格式对不上时保持未知，不用 0 填充。今日只有在该时段索引笔数为 0 时显示 0。账户统计不存在时，页面不应把累计显示成 0。已挖块数是索引里的总出块计数。最近奖励最多列出 12 笔，每笔有区块高度、时间和该笔奖励。一个地址可以接收多台机器的奖励，列表不能反推机器数量、型号或是否在线。历史“获得过奖励的地址数”也不是当前在线矿工数。",
        "官方还说明：wormhole 地址和普通透明地址看起来一样，但派生路径不同。因此只凭“看起来像地址”不能判断它就是正在出块的那个 wormhole。请用密钥输出或启动日志里的完整 Address 对照，并确认节点是 mainnet。本站接受 Quantus 主网 SS58（网络前缀 189）的公开地址；前缀不对的字符串不会当作 Quantus 地址查询。本站不能从公开地址区分“长得一样的普通地址”和 wormhole，查不到奖励时不要先怪页面。",
        "举例（虚构）：香港时间 00:10 查询，今日显示 0，累计显示 1.25，最近一笔奖励的时间落在前一天。这符合日界线，不表示节点崩溃，也不表示钱包被清空。若累计位置是未知而不是 0，先看这次查询是否失败或该地址在索引中没有账户统计，再决定要不要去钱包里对余额。",
        "地址来自启动日志且网络是 mainnet 时，按这些情况看。\n- 用最近 12 笔和官方浏览器交叉查看。\n- 今日为 0 但累计仍在：先看最近一笔的时间是否早于香港时间今天 0 点。\n- 累计与钱包 App 不一致：本页只加总已索引挖矿奖励，不计算转入、转出和未进索引的状态。\n- 记录为空：打开 [没有收益](/learn/quantus-mining-no-rewards)。本机还在同步则回到 [Mac 主网同步](/learn/quantus-mainnet-mining-mac)。\n每个项目免费 3 台已保存设备，Pro 100 台。列表里的地址不会自动多占一台；另行保存的设备记录才计入，同一台设备上的多条来源不重复占名额。登录后列表可跨设备同步；未登录保存在当前浏览器。本页不能转账，也不能把累计换成法币。",
      ],
      [
        "查 Quantus 收益時，貼上的必須是**挖礦獎勵實際進入的 Wormhole 公開地址**。官方指南寫明：鏈只把挖礦獎勵累計到 wormhole 地址，而不是普通錢包地址。金鑰輸出的 Address 就是監控地址；節點啟動日誌也會印出由 inner hash 推出的地址。inner hash 與 24 個單詞留在本機。",
        "在 [Quantus 監控](/projects/quantus)，今日與累計是不同問題。今日是香港時間當日 0 點（UTC+8，不跟瀏覽器時區）到本次查詢之間，索引中該地址的挖礦獎勵合計。過了香港午夜，今日可以回到 0。累計是帳戶統計裡的歷史挖礦獎勵，不是錢包餘額，也不是交易所餘額。官網寫：若與錢包 App 使用同一種子派生 wormhole，獎勵會出現在 App，可直接從 wormhole 餘額花費，沒有單獨領取。那是錢包能力，本頁不讀錢包餘額。",
        "金額按 12 位小數換算。缺紀錄或格式不符時保持未知，不用 0 填充。今日只在該時段筆數為 0 時顯示 0。沒有帳戶統計時，不把累計顯示成 0。已挖塊數是索引中的總出塊計數。最近獎勵最多 12 筆。一個地址可以收多台機器的獎勵，不能反推台數或是否在線。",
        "官方說明 wormhole 與普通透明地址看起來一樣，但派生路徑不同。不能只憑外觀斷定它就是正在出塊的 wormhole。請用完整 Address 對照，並確認 mainnet。本站接受 Quantus 主網 SS58（網路前綴 189）。前綴不對不會當成 Quantus 地址。本站不能從公開地址區分外觀相同的普通地址與 wormhole。",
        "舉例（虛構）：香港時間 00:10，今日為 0，累計為 1.25，最近一筆在前一天。這符合日界線，不表示當機，也不表示錢包被清空。若累計是未知而不是 0，先看查詢是否失敗或索引沒有該帳戶統計。",
        "地址來自啟動日誌且為 mainnet 時，按這些情況看。\n- 用最近 12 筆與官方瀏覽器對照。\n- 今日為 0 而累計仍在：先看最近一筆是否早於香港時間今天 0 點。\n- 與錢包不一致：本頁只合計已索引挖礦獎勵，不計算轉入、轉出和未進索引的狀態。\n- 紀錄為空：看 [沒有收益](/learn/quantus-mining-no-rewards)。仍在同步則回到 [Mac 主網同步](/learn/quantus-mainnet-mining-mac)。\n每個專案免費 3 台已儲存設備，Pro 100 台。列表裡的地址不會自動多占一台；另行儲存的設備紀錄才計入，同一台設備上的多條來源不重複占名額。登入後列表可跨裝置同步；未登入保存在目前瀏覽器。本頁不能轉帳，也不能把累計換成法幣。",
      ],
      [
        "To read Quantus rewards, paste the **public wormhole address that actually receives mining rewards**. The official guide states that the chain accumulates mining rewards only to wormhole addresses, not to regular wallet addresses. The Address in the key-generation output is the value to monitor. Node startup logs also print the address derived from the inner hash. The inner hash and the 24 words prove ownership and stay on the machine. The website does not need them.",
        "On the [Quantus monitor](/projects/quantus), today and lifetime answer different questions. Today is the sum of indexed mining rewards for that address from midnight in Hong Kong (UTC+8, not the browser time zone) until this query. After Hong Kong midnight, today can return to zero while lifetime does not. Lifetime is the historical mining-reward total in the index account stats. It is not the spendable wallet balance and not an exchange balance, including any swap balance. The project site says a wormhole derived from the same seed as the wallet app shows rewards in the app, spendable from the wormhole balance with no separate claim. This page does not read that wallet balance.",
        "Amounts convert chain integers with 12 decimal places. Missing or unreadable figures stay unknown rather than becoming zero. Today is the digit 0 only when the indexed count in that window is zero. If the account stats row is absent, lifetime is not presented as zero. Mined-block count is the index total. Recent rewards list at most 12 rows, each with height, time, and that reward. One address can collect rewards from several machines. The list does not reveal machine count, model, or whether a process is online. The historical count of addresses that have ever been rewarded is not a live miner census.",
        "The guide also says wormhole addresses look identical to regular transparent addresses but use a separate derivation path. A string that merely looks like an address is not proof it is the wormhole currently being paid. Match the full Address from key output or the startup log, and confirm the node is on mainnet. This monitor accepts a Quantus mainnet SS58 public address (network prefix 189). A different prefix is not queried as Quantus. The monitor cannot tell a same-looking regular address from a wormhole by the public string alone, so an empty reward list is not first a display fault.",
        "Illustrative example: at 00:10 Hong Kong time, today shows 0, lifetime shows 1.25, and the newest reward timestamp falls on the previous Hong Kong day. That matches the day boundary. It does not mean the node crashed or the wallet was emptied. If lifetime is unknown rather than 0, check whether the query failed or the index has no account stats for that address before comparing a wallet balance.",
        "When the address comes from the startup log and the chain is mainnet, cross-check the latest rows with the official explorer. If today is 0 and lifetime remains, look at whether the latest reward is before today’s Hong Kong midnight. A difference from the wallet app is expected when the wallet includes transfers or state this index does not sum. If the record is missing, open [no rewards](/learn/quantus-mining-no-rewards). If the node is still syncing, return to [Mac mainnet sync](/learn/quantus-mainnet-mining-mac). Free keeps three saved devices per project, and Pro keeps 100. An address that only appears in a list does not add a device. A separately saved device record does, and extra sources on the same saved device do not add another slot. Signed-in lists can sync across devices; a signed-out list stays in this browser. This page cannot send a transfer or convert lifetime into fiat.",
      ],
      [
        "Quantus 보상을 보려면 **채굴 보상이 실제로 들어가는 웜홀 공개 주소**를 붙입니다. 공식 안내는 체인이 채굴 보상을 웜홀 주소에만 누적하고 일반 지갑 주소에는 누적하지 않는다고 합니다. 키 생성 출력의 Address가 모니터용입니다. 노드 시작 로그도 inner hash에서 유도한 주소를 출력합니다. inner hash와 24단어는 소유 증명이므로 기기에만 둡니다.",
        "[Quantus 모니터](/projects/quantus)에서 오늘과 누적은 다른 질문입니다. 오늘은 홍콩 시간 0시(UTC+8, 브라우저 시간대 아님)부터 이번 조회까지 그 주소의 인덱싱된 채굴 보상 합입니다. 홍콩 자정 이후 오늘은 0으로 돌아갈 수 있습니다. 누적은 계정 통계의 과거 채굴 보상이며 지갑 잔액도 거래소 잔액도 아닙니다. 공식 사이트는 지갑 앱과 같은 시드로 웜홀을 만들면 앱에 보상이 보이고, 별도 청구 없이 웜홀 잔액에서 쓸 수 있다고 합니다. 그것은 지갑의 보기이고 이 페이지는 지갑 잔액을 읽지 않습니다.",
        "금액은 온체인 정수를 소수 12자리로 바꿉니다. 없거나 읽을 수 없으면 0이 아니라 알 수 없음입니다. 오늘은 그 구간의 인덱싱 건수가 0일 때만 0입니다. 계정 통계가 없으면 누적을 0으로 보여 주지 않습니다. 최근 보상은 최대 12건입니다. 한 주소가 여러 기기의 보상을 받을 수 있으며, 목록으로 대수나 온라인을 알 수 없습니다.",
        "공식 안내는 웜홀 주소와 일반 투명 주소가 같아 보이지만 유도 경로가 다르다고 합니다. 주소처럼 보인다고 현재 보상을 받는 웜홀은 아닙니다. 키 출력이나 시작 로그의 전체 Address와 mainnet을 확인하세요. 이 모니터는 Quantus 메인넷 SS58(네트워크 접두 189)만 받습니다. 공개 문자열만으로 일반 주소와 웜홀을 가리지 못합니다.",
        "예시(실측 아님): 홍콩 시간 00:10에 오늘은 0, 누적은 1.25, 최근 보상 시각은 전날입니다. 날짜 경계와 맞으며 노드 충돌이나 지갑이 비었다는 뜻이 아닙니다. 누적이 0이 아니라 알 수 없음이면 조회 실패인지, 인덱스에 계정 통계가 없는지 먼저 봅니다.",
        "주소가 시작 로그에서 왔고 체인이 mainnet이면 최근 12건과 공식 탐색기를 대조합니다. 오늘은 0인데 누적이 있으면 최근 시각이 홍콩 시간 오늘 0시 이전인지 봅니다. 기록이 없으면 [보상 없음](/learn/quantus-mining-no-rewards), 동기화 중이면 [Mac 메인넷 동기화](/learn/quantus-mainnet-mining-mac)로 돌아갑니다. 프로젝트당 무료는 저장된 기기 3대, Pro는 100대입니다. 목록의 주소가 자동으로 기기를 늘리지는 않습니다. 따로 저장한 기록만 세고, 같은 기기의 출처를 더해도 자리는 늘지 않습니다. 이 페이지는 송금하지 않습니다.",
      ],
      [
        "Quantusの報酬を見るには、**採掘報酬が実際に入るWormhole公開アドレス**を貼ります。公式ガイドは、チェーンが採掘報酬をwormholeアドレスにだけ積み、通常のウォレットアドレスには積まないと書きます。鍵生成出力のAddressが監視対象です。ノード起動ログも inner hash から導いたアドレスを出します。inner hash と24語は所有の証明なのでマシンに残します。",
        "[Quantusモニター](/projects/quantus)の今日と累計は別の問いです。今日は香港時間0時（UTC+8。ブラウザーのタイムゾーンではない）から今回の照会までの、そのアドレスの索引済み採掘報酬の合計です。香港の深夜を越えると今日は0に戻り得ます。累計はアカウント統計の過去の採掘報酬であり、ウォレット残高でも取引所残高でもありません。公式サイトは、ウォレットアプリと同じシードからwormholeを導けばアプリに報酬が見え、別の請求なしにwormhole残高から使えると書きます。それはウォレット側の表示で、このページはウォレット残高を読みません。",
        "金額はチェーン整数を小数12桁で換算します。欠けるか読めなければ0ではなく不明です。今日が数字の0になるのは、その区間の索引件数が0のときだけです。アカウント統計が無いとき累計を0にはしません。最近の報酬は最大12件です。1アドレスが複数マシンの報酬を受け取ることもあり、台数や稼働は分かりません。",
        "公式ガイドは、wormholeアドレスと通常の透明アドレスは見た目が同じで派生経路が違うと書きます。アドレスに見えるだけでは、今報酬を受けているwormholeとは限りません。鍵出力か起動ログの完全なAddressと mainnet を照合します。このモニターが受けるのはQuantusメインネットのSS58（ネットワーク接頭辞189）です。公開文字列だけでは通常アドレスとwormholeを区別できません。",
        "例（実測ではない）: 香港時間00:10に今日が0、累計が1.25、直近の報酬時刻が前日。日付の境界と一致し、ノードの停止やウォレットが空になったことにはなりません。累計が0ではなく不明なら、照会失敗か、索引にアカウント統計が無いかを先に見ます。",
        "アドレスが起動ログから得られチェーンが mainnet なら、直近12件と公式エクスプローラーを照合します。今日が0で累計が残るなら、直近が香港時間の今日0時より前かを見ます。記録が無いときは [報酬がない](/learn/quantus-mining-no-rewards)、同期中なら [Macメインネット同期](/learn/quantus-mainnet-mining-mac) に戻ります。各プロジェクト無料は保存したデバイス3台、Proは100台です。一覧のアドレスが自動で台数を増やすことはありません。別に保存した記録だけを数え、同じデバイスの出典を足しても枠は増えません。このページは送金できません。",
      ],
      {
        zh: ["贴哪一个地址", "今日和累计分别是什么", "外观相同的地址"],
        tw: ["貼哪一個地址", "今日和累計分別是什麼", "外觀相同的地址"],
        en: [
          "Which address to paste",
          "What today and lifetime are",
          "Addresses that look the same",
        ],
        ko: ["어떤 주소를 붙이나", "오늘과 누적은 무엇인가", "같아 보이는 주소"],
        ja: ["どのアドレスを貼るか", "今日と累計は何か", "同じに見えるアドレス"],
      },
    ),
    comparisonTitle: text(
      "今日、累计和余额",
      "今日、累計和餘額",
      "Today, lifetime, and balances",
      "오늘, 누적, 잔액",
      "今日、累計、残高",
    ),
    comparison: {
      zh: {
        headers: ["数字", "它是什么", "它不是什么"],
        rows: [
          ["今日", "香港时间 0 点至本次查询的已索引挖矿奖励", "不是钱包余额，午夜后可为 0"],
          ["累计", "索引账户统计中的历史挖矿奖励", "不是交易所余额，不含普通转账"],
          ["已挖块数", "索引中的出块次数", "不是在线机器台数"],
          ["最近最多 12 笔", "每笔高度、时间、该笔奖励", "不是全部历史，也不是矿池流水"],
        ],
      },
      "zh-TW": {
        headers: ["數字", "它是什麼", "它不是什麼"],
        rows: [
          ["今日", "香港時間 0 點至本次查詢的已索引挖礦獎勵", "不是錢包餘額，午夜後可為 0"],
          ["累計", "索引帳戶統計中的歷史挖礦獎勵", "不是交易所餘額，不含普通轉帳"],
          ["已挖塊數", "索引中的出塊次數", "不是線上機器台數"],
          ["最近最多 12 筆", "每筆高度、時間、該筆獎勵", "不是全部歷史，也不是礦池流水"],
        ],
      },
      en: {
        headers: ["Figure", "What it is", "What it is not"],
        rows: [
          [
            "Today",
            "Indexed mining rewards since Hong Kong midnight",
            "Not wallet balance; can be 0 after midnight",
          ],
          [
            "Lifetime",
            "Historical mining rewards in account stats",
            "Not an exchange balance or ordinary transfers",
          ],
          ["Blocks mined", "Indexed block count for the address", "Not a count of online machines"],
          [
            "Up to 12 recent rows",
            "Height, time, and that reward",
            "Not full history and not a pool ledger",
          ],
        ],
      },
      ko: {
        headers: ["숫자", "의미", "아닌 것"],
        rows: [
          ["오늘", "홍콩 자정 이후 인덱싱된 채굴 보상", "지갑 잔액이 아님. 자정 후 0 가능"],
          ["누적", "계정 통계의 과거 채굴 보상", "거래소 잔액이나 일반 송금이 아님"],
          ["채굴 블록 수", "인덱스의 블록 수", "온라인 기기 수가 아님"],
          ["최근 최대 12건", "높이, 시각, 그 보상", "전체 이력도 풀 장부도 아님"],
        ],
      },
      ja: {
        headers: ["数字", "意味", "意味しないもの"],
        rows: [
          [
            "今日",
            "香港時間0時以降の索引済み採掘報酬",
            "ウォレット残高ではない。深夜以降0になり得る",
          ],
          ["累計", "アカウント統計の過去の採掘報酬", "取引所残高や通常送金ではない"],
          ["採掘ブロック数", "索引上のブロック数", "稼働台数ではない"],
          ["直近最大12件", "高さ、時刻、その報酬", "全履歴でもプール台帳でもない"],
        ],
      },
    },
    questions: questions([
      [
        text(
          "网页要 inner hash 吗？",
          "網頁要 inner hash 嗎？",
          "Does the website need the inner hash?",
          "웹사이트에 inner hash가 필요한가요?",
          "サイトに inner hash は必要ですか？",
        ),
        text(
          "不要。只保存公开 Address。inner hash 和 24 个单词留在本机。",
          "不要。只保存公開 Address。inner hash 和 24 個單詞留在本機。",
          "No. Save only the public Address. Keep the inner hash and the 24 words on the machine.",
          "아니요. 공개 Address만 저장합니다. inner hash와 24단어는 기기에 둡니다.",
          "不要です。公開Addressだけを保存します。inner hash と24語はマシンに残します。",
        ),
      ],
      [
        text(
          "累计为什么和钱包余额不一样？",
          "累計為什麼和錢包餘額不一樣？",
          "Why does lifetime differ from the wallet balance?",
          "누적이 지갑 잔액과 다른 이유는 무엇인가요?",
          "累計がウォレット残高と違うのはなぜですか？",
        ),
        text(
          "累计只加总索引里的挖矿奖励。钱包余额还包含转入转出，以及未进入这条索引的状态。",
          "累計只加總索引裡的挖礦獎勵。錢包餘額還包含轉入轉出，以及未進入這條索引的狀態。",
          "Lifetime sums indexed mining rewards only. A wallet balance also includes transfers and any state this index does not store.",
          "누적은 인덱싱된 채굴 보상만 더합니다. 지갑 잔액에는 송금과 이 인덱스에 없는 상태가 포함됩니다.",
          "累計は索引された採掘報酬だけを合計します。ウォレット残高には送金と、この索引に無い状態も含まれます。",
        ),
      ],
      [
        text(
          "香港时间午夜后今日变成 0，是故障吗？",
          "香港時間午夜後今日變成 0，是故障嗎？",
          "Is today becoming 0 after Hong Kong midnight a fault?",
          "홍콩 시간 자정 이후 오늘이 0이 되면 고장인가요?",
          "香港時間の深夜に今日が0になるのは故障ですか？",
        ),
        text(
          "不一定。日界线重置今日，累计可以保持原值。先看最近一笔奖励的时间。",
          "不一定。日界線重置今日，累計可以保持原值。先看最近一筆獎勵的時間。",
          "Not by itself. The day boundary resets today. Lifetime can stay as it was. Check the time of the latest reward first.",
          "그것만으로는 아닙니다. 날짜 경계가 오늘을 되돌립니다. 누적은 그대로일 수 있습니다. 최근 보상 시각을 먼저 봅니다.",
          "それだけでは故障ではありません。日付の境界が今日を戻します。累計はそのままのことがあります。まず直近の報酬時刻を見ます。",
        ),
      ],
    ]),
    sources: [miningGuide, explorer, site, rules],
    related: [none, mac, safety],
  },
  {
    slug: none,
    project: "quantus",
    published: "2026-10-03",
    modified: "2026-10-24",
    topic: text(
      "没有记录时",
      "沒有紀錄時",
      "When rewards are missing",
      "기록이 없을 때",
      "記録が無いとき",
    ),
    title: text(
      "Quantus 挖矿没有收益？先查地址、同步和奖励记录",
      "Quantus 挖礦沒有收益？先查地址、同步和獎勵紀錄",
      "Quantus mining with no rewards: address, sync and index checks",
      "Quantus 채굴 보상이 없나요? 주소·동기화·기록 점검",
      "Quantusのマイニング報酬がない：アドレス・同期・記録の確認",
    ),
    description: text(
      "先分清今日为 0、索引里没有这个地址、查询失败，还是矿池另有结算。缺记录保持未知，不用 0 代替。",
      "先分清今日為 0、索引裡沒有這個地址、查詢失敗，還是礦池另有結算。缺紀錄保持未知，不用 0 代替。",
      "Separate a real zero for today, an address absent from the index, a failed query, and a pool that pays elsewhere. Missing data stays unknown.",
      "오늘의 실제 0, 인덱스에 주소가 없음, 조회 실패, 풀이 다른 곳으로 지급하는 경우를 나눕니다. 빠진 값은 알 수 없음으로 둡니다.",
      "今日の実際の0、索引にアドレスが無い、照会失敗、プールが別宛に払う場合を分けます。欠けた値は不明のままにします。",
    ),
    summary: text(
      "没有收益时，先看页面是“今日 0”“找不到账户”还是“这次没取到”。再核对 Wormhole 公开地址、mainnet 和节点是否已到链尖。个人地址没有出块记录，不能证明矿池没有另外付款，也不能证明机器离线。",
      "沒有收益時，先看頁面是「今日 0」「找不到帳戶」還是「這次沒取到」。再核對 Wormhole 公開地址、mainnet 和節點是否已到鏈尖。個人地址沒有出塊紀錄，不能證明礦池沒有另外付款，也不能證明機器離線。",
      "When rewards look absent, first see whether the page shows today’s zero, no account, or a failed read. Then check the wormhole public address, mainnet, and whether the node is at the tip. No block row on a personal address does not prove a pool paid nothing, and it does not prove the machine is offline.",
      "보상이 없어 보이면 오늘 0인지, 계정이 없는지, 조회가 실패했는지부터 봅니다. 그다음 웜홀 공개 주소, mainnet, 노드가 체인 끝에 있는지를 확인합니다. 개인 주소에 블록 기록이 없어도 풀이 따로 지급하지 않았다는 뜻도, 기기가 꺼졌다는 뜻도 아닙니다.",
      "報酬が無いように見えたら、今日の0か、アカウント無し、読み取り失敗かを先に見ます。次にWormhole公開アドレス、mainnet、ノードが先端にいるかを確認します。個人アドレスにブロック行が無くても、プールが別に払っていない証明でも、マシンがオフラインという証明でもありません。",
    ),
    body: paras(
      [
        "在 [Quantus 监控](/projects/quantus) 上看不到收益时，先读**这一次查询的结果属于哪一种**，再改本机。三种不能混用：今日为 0，表示该香港时间窗口里索引到的挖矿奖励笔数是 0，地址的账户统计可以仍然存在，累计可以大于 0。找不到账户，表示主网索引里没有这个地址的账户统计，这时累计不是 0，而是没有这条记录。查询失败或来源过旧时，不要把上次留下的数字当成刚刚又确认过的结果；失败也不应把缺字段改写成 0。",
        "本机按官方挖矿指南核对三件事。\n- 奖励地址是密钥输出或启动日志里的 Wormhole 公开 Address，节点参数是 mainnet，不是已退役的 Planck。Wormhole 与普通透明地址外观可能相同，贴错派生路径时，索引里可以没有挖矿奖励。\n- 日志已在当前链尖 Idle。同步前的孤块没有有效奖励。节点没有 peer 时矿工会暂停。\n- 矿工仍连在本机矿工端口上。立刻退出时，常见原因是认证或节点与矿工版本不配对，不是今天运气不好。",
        "若你走的是矿池而不是把奖励直接记在自己的 Wormhole 上，区块奖励可能先记在矿池的出块地址，再按矿池自己的规则结算。本站读的是主网索引中的挖矿奖励记录，不是矿池的完整转账账本，也不是交易所余额。个人地址没有出块行，不能推出矿池余额为 0。官网另有用 USDC 换 QTC 的入口，那是交易路径，不会出现在挖矿奖励合计里。",
        "举例（虚构）：地址通过主网格式检查，页面显示已找到账户，今日 0，累计 0.5，最近一笔在两天前，本机日志已是 Idle。这更像是这两天没有新的已索引出块奖励，而不是取数失败。另一分支：同一字符串查询失败，累计位置没有数字。这时不要把空白当成 0，先重试查询，并对照官方浏览器里该地址是否存在。第三分支：日志仍是 Syncing。按官方说明，此时即使本机在算哈希，链尖之前的块也不是有效奖励。",
        "按页面上的结果走，先核对再改配置。\n- 空白或失败：先重试，确认地址是完整的主网公开串，而不是 inner hash。\n- 今日 0 且机器仍在同步：回到 [Mac 主网同步](/learn/quantus-mainnet-mining-mac)，等 Idle。监控是空的，不是先改矿工参数的理由。\n- 今日 0、已经 Idle、地址与启动日志一致：到 [今日与累计](/learn/quantus-wormhole-rewards) 看日界线和 12 位小数，并打开官方浏览器核对最近区块。\n- 你在看本机 benchmark 数字：那不是奖励，见 [算力与出块](/learn/quantus-qpow-hashrate-vs-blocks)。\n本站不能读 Mac 日志，不能重启矿工，也不能保证下一次出块时间。每个项目免费 3 台已保存设备，Pro 100 台。列表里的地址不会自动多占一台；另行保存的设备记录才计入，同一台设备上的多条来源不重复占名额。",
      ],
      [
        "在 [Quantus 監控](/projects/quantus) 上看不到收益時，先讀**這一次查詢屬於哪一種**。今日為 0，表示該香港時間窗口的已索引挖礦獎勵筆數是 0，累計仍可以大於 0。找不到帳戶，表示主網索引沒有這個地址的帳戶統計，累計不是 0。查詢失敗或來源過舊時，不要把上次的數字當成剛剛又確認過；缺欄位也不改寫成 0。",
        "本機按官方挖礦指南核對三條行動分支。\n- 獎勵地址是金鑰輸出或啟動日誌裡的 Wormhole 公開 Address，節點參數是 mainnet，不是已退役的 Planck。Wormhole 與普通透明地址外觀可能相同，貼錯派生路徑時，索引裡可以沒有挖礦獎勵。\n- 日誌已在目前鏈尖 Idle。同步前的孤塊沒有有效獎勵。節點沒有 peer 時礦工會暫停。\n- 礦工仍連在本機礦工端口上。立刻退出時，常見原因是認證或節點與礦工版本不配對，不是今天運氣不好。",
        "若走礦池，區塊獎勵可能先記在礦池出塊地址，再按礦池規則結算。本站讀的是主網索引中的挖礦獎勵，不是礦池完整帳本，也不是交易所餘額。官網另有 USDC 換 QTC 的入口，那是交易路徑。",
        "舉例（虛構）：地址格式通過，已找到帳戶，今日 0，累計 0.5，最近一筆在兩天前，日誌已 Idle。這更像這兩天沒有新的已索引出塊獎勵。若同一次查詢失敗、累計沒有數字，不要把空白當 0。若日誌仍是 Syncing，即使本機在算雜湊，鏈尖之前的塊也不是有效獎勵。",
        "按頁面上的結果走，先核對再改設定。\n- 空白或失敗：先重試，確認貼的是完整公開地址而不是 inner hash。\n- 今日 0 且仍在同步：回到 [Mac 主網同步](/learn/quantus-mainnet-mining-mac)，等 Idle。監控是空的，不是先改礦工參數的理由。\n- 已經 Idle 且地址與日誌一致：看 [今日與累計](/learn/quantus-wormhole-rewards) 的日界線和 12 位小數，並打開官方瀏覽器。\n- 本機 benchmark 不是獎勵，見 [算力與出塊](/learn/quantus-qpow-hashrate-vs-blocks)。\n本站不能讀 Mac 日誌或重啟礦工，也不能保證下一次出塊時間。每個專案免費 3 台已儲存設備，Pro 100 台。列表裡的地址不會自動多占一台；另行儲存的設備紀錄才計入，同一台設備上的多條來源不重複占名額。",
      ],
      [
        "When the [Quantus monitor](/projects/quantus) shows no rewards, read **which result this query actually is** before changing the Mac. Three outcomes are different. Today as 0 means the indexed mining-reward count in the current Hong Kong window is zero. Account stats can still exist, and lifetime can stay above zero. No account means the mainnet index has no account stats for that address, so lifetime is not a zero, it is an absent row. A failed or stale read is not a fresh confirmation of the previous numbers, and a missing field is not rewritten as 0.",
        "On the machine, the official mining guide narrows the check to three facts. The reward address is the wormhole public Address from key generation or the startup log, and the node is on mainnet rather than retired Planck. Wormhole and regular transparent addresses can look the same, so the wrong derivation can have no mining rewards in the index. The log is Idle at the current tip. Orphans before the tip earn nothing, and the miner pauses when the node has no peers. If the miner exits immediately, the guide points to auth or a node/miner version mismatch, not to a bad run of luck.",
        "If you mine through a pool, block rewards may be recorded on the pool’s block address and settled later under the pool’s own rules. This site reads mining-reward rows in the mainnet index. It is not the pool’s transfer ledger and not an exchange balance. No block row on a personal address does not mean the pool balance is zero. The public site also links a path to swap USDC for QTC. That is trading, and it does not appear in the mining-reward sum.",
        "Illustrative example: the address passes the mainnet format check, the page found an account, today is 0, lifetime is 0.5, the latest row is two days old, and the local log is Idle. That pattern fits two days without a new indexed block reward, not a failed fetch. A second branch: the same lookup fails and lifetime has no digit. Do not treat the blank as 0. Retry, and compare the address in the official explorer. A third branch: the log still says Syncing. Under the official guide, local hashing before the tip is not a valid reward.",
        "Follow the result on the page. Check the mismatch before you change the miner.\n- On a blank or a failed read, retry and confirm you pasted the full public address, not the inner hash.\n- If today is 0 while the node is still syncing, return to [Mac mainnet sync](/learn/quantus-mainnet-mining-mac) and wait for Idle. An empty monitor is not a reason to change miner settings first.\n- If the node is Idle and the address matches the startup log, use [today and lifetime](/learn/quantus-wormhole-rewards) for the day boundary and the 12-decimal amounts, then open the official explorer.\n- A local benchmark figure is not a reward. See [hashrate and blocks](/learn/quantus-qpow-hashrate-vs-blocks).\nThis site cannot read Mac logs, restart the miner, or promise the next block time. Free keeps three saved devices per project, and Pro keeps 100. An address that only appears in a list does not add a device. A separately saved device record does, and extra sources on the same saved device do not add another slot.",
      ],
      [
        "[Quantus 모니터](/projects/quantus)에 보상이 없으면, Mac을 고치기 전에 **이번 조회가 어떤 결과인지**를 읽습니다. 오늘이 0이면 이번 홍콩 시간 구간의 인덱싱된 채굴 보상 건수가 0입니다. 계정은 남아 있고 누적은 0보다 클 수 있습니다. 계정이 없으면 메인넷 인덱스에 그 주소의 계정 통계가 없는 것이며 누적은 0이 아닙니다. 조회 실패나 오래된 원본은 이전 숫자를 방금 다시 확인한 것이 아니고, 빈 칸을 0으로 바꾸지 않습니다.",
        "기기에서는 공식 안내의 세 가지를 봅니다. 보상 주소는 키 출력이나 시작 로그의 웜홀 공개 Address이고 체인은 mainnet이며 종료된 Planck가 아닙니다. 웜홀과 일반 투명 주소는 같아 보일 수 있어 잘못된 유도에는 채굴 보상이 없을 수 있습니다. 로그는 현재 끝에서 Idle입니다. 끝 이전의 고아는 보상이 없고 peer가 없으면 채굴기는 멈춥니다. 채굴기가 바로 종료되면 안내는 인증 또는 노드·채굴기 버전 불일치를 가리킵니다.",
        "풀로 채굴하면 블록 보상이 먼저 풀의 블록 주소에 기록되고 풀 규칙으로 정산될 수 있습니다. 이 사이트는 메인넷 인덱스의 채굴 보상 행을 읽습니다. 풀의 송금 장부도 거래소 잔액도 아닙니다. 공식 사이트의 USDC로 QTC를 바꾸는 경로는 거래이며 채굴 보상 합에 들어가지 않습니다.",
        "예시(실측 아님): 주소 형식이 통과하고 계정이 있으며 오늘은 0, 누적은 0.5, 최근 행은 이틀 전, 로그는 Idle입니다. 이는 이틀간 새 인덱싱 블록 보상이 없는 쪽에 가깝습니다. 조회가 실패하고 누적에 숫자가 없으면 빈칸을 0으로 보지 않습니다. 로그가 아직 Syncing이면, 공식 안내상 체인 끝 이전의 로컬 해시는 유효 보상이 아닙니다.",
        "페이지의 결과에 따라 보고, 불일치를 확인한 뒤에 설정을 바꿉니다.\n- 빈칸이나 실패면 다시 조회하고, inner hash가 아닌 전체 공개 주소인지 확인합니다.\n- 오늘이 0이고 아직 동기화 중이면 [Mac 메인넷 동기화](/learn/quantus-mainnet-mining-mac)로 돌아가 Idle을 기다립니다. 모니터가 비었다고 채굴기 설정부터 바꾸지 마세요.\n- Idle이고 주소가 시작 로그와 같으면 [오늘과 누적](/learn/quantus-wormhole-rewards)의 날짜 경계와 소수 12자리를 보고 공식 탐색기를 엽니다.\n- 로컬 벤치마크는 보상이 아닙니다. [해시레이트와 블록](/learn/quantus-qpow-hashrate-vs-blocks)을 보세요.\n이 사이트는 Mac 로그를 읽거나 채굴기를 다시 시작하지 않으며 다음 블록 시각을 보장하지 않습니다. 프로젝트당 무료는 저장된 기기 3대, Pro는 100대입니다. 목록의 주소가 자동으로 기기를 늘리지는 않습니다. 따로 저장한 기록만 세고, 같은 기기의 출처를 더해도 자리는 늘지 않습니다.",
      ],
      [
        "[Quantusモニター](/projects/quantus)に報酬が無いときは、Macを直す前に**今回の照会がどの結果か**を読みます。今日が0なら、今の香港時間の区間で索引された採掘報酬の件数が0です。アカウントは残り、累計は0より大きいことがあります。アカウントが無いのは、メインネット索引にそのアドレスのアカウント統計が無いことで、累計は0ではありません。照会の失敗や古い元データは、前回の数字を今確認し直したことにはならず、欠けた欄を0にはしません。",
        "マシンでは公式ガイドの三点を見ます。報酬アドレスは鍵出力か起動ログのWormhole公開Addressで、チェーンは mainnet であり退役したPlanckではありません。Wormholeと通常の透明アドレスは同じに見えることがあり、別の派生には採掘報酬が無いことがあります。ログは現在の先端でIdleです。先端より前の孤立に有効な報酬は無く、peerが無いとマイナーは止まります。マイナーがすぐ終了するとき、ガイドがよく挙げるのは認証かノードとマイナーの版の不一致です。",
        "プール経由なら、ブロック報酬がまずプールのブロックアドレスに記録され、プール自身の規則で精算されることがあります。当サイトが読むのはメインネット索引の採掘報酬であり、プールの送金台帳でも取引所残高でもありません。公式サイトのUSDCからQTCへの交換は取引経路で、採掘報酬の合計には入りません。",
        "例（実測ではない）: アドレス形式は通り、アカウントがあり、今日は0、累計は0.5、直近は二日前、ログはIdle。これは二日間、新しい索引済みブロック報酬が無いパターンに近いです。照会が失敗して累計に数字が無いときは空白を0にしません。ログがまだSyncingなら、公式ガイド上、先端より前のローカルハッシュは有効な報酬ではありません。",
        "ページの結果に従い、不一致を確認してから設定を変えます。\n- 空白や失敗なら再試行し、inner hash ではなく完全な公開アドレスかを確認します。\n- 今日が0でまだ同期中なら [Macメインネット同期](/learn/quantus-mainnet-mining-mac) に戻ってIdleを待ちます。モニターが空でも、先にマイナー設定は変えないでください。\n- Idleでアドレスが起動ログと一致するなら [今日と累計](/learn/quantus-wormhole-rewards) の日付境界と小数12桁を見て、公式エクスプローラーを開きます。\n- ローカルのベンチマークは報酬ではありません。[算力とブロック](/learn/quantus-qpow-hashrate-vs-blocks) を見てください。\n当サイトはMacのログを読めず、マイナーを再起動できず、次のブロック時刻も保証しません。各プロジェクト無料は保存したデバイス3台、Proは100台です。一覧のアドレスが自動で台数を増やすことはありません。別に保存した記録だけを数え、同じデバイスの出典を足しても枠は増えません。",
      ],
      {
        zh: ["先分辨这一种结果", "本机三件事", "一种虚构对照"],
        tw: ["先分辨這一種結果", "本機三件事", "一種虛構對照"],
        en: ["Name this result first", "Three checks on the machine", "An illustrative split"],
        ko: ["이번 결과부터 구분", "기기에서 볼 세 가지", "가상의 갈림"],
        ja: ["今回の結果を先に分ける", "マシンで見る三点", "仮想の分岐"],
      },
    ),
    comparisonTitle: text(
      "空结果的三种读法",
      "空結果的三種讀法",
      "Three readings of an empty result",
      "빈 결과의 세 가지 읽기",
      "空の結果の三つの読み方",
    ),
    comparison: {
      zh: {
        headers: ["页面状态", "可以下的结论", "先做的事"],
        rows: [
          [
            "今日为 0，累计仍在",
            "这个香港日窗口没有新的已索引奖励",
            "看最近一笔时间和本机是否 Idle",
          ],
          ["没有账户统计", "索引里没有该地址的累计", "不要写成 0；核对完整 Wormhole 地址"],
          ["查询失败或数字过旧", "这次不能刷新结论", "重试；不要把旧数字当新确认"],
          ["只有矿池或交易所余额", "那不是这条出块奖励索引", "回矿池或钱包单独核对"],
        ],
      },
      "zh-TW": {
        headers: ["頁面狀態", "可以下的結論", "先做的事"],
        rows: [
          [
            "今日為 0，累計仍在",
            "這個香港日窗口沒有新的已索引獎勵",
            "看最近一筆時間和本機是否 Idle",
          ],
          ["沒有帳戶統計", "索引裡沒有該地址的累計", "不要寫成 0；核對完整 Wormhole 地址"],
          ["查詢失敗或數字過舊", "這次不能刷新結論", "重試；不要把舊數字當新確認"],
          ["只有礦池或交易所餘額", "那不是這條出塊獎勵索引", "回礦池或錢包單獨核對"],
        ],
      },
      en: {
        headers: ["Page state", "What you can conclude", "Do this first"],
        rows: [
          [
            "Today is 0, lifetime remains",
            "No new indexed reward in this Hong Kong window",
            "Check the latest time and whether the log is Idle",
          ],
          [
            "No account stats",
            "The index has no lifetime for this address",
            "Do not write 0; match the full wormhole address",
          ],
          [
            "Query failed or figures are old",
            "This attempt does not refresh the conclusion",
            "Retry; do not treat the old figure as a new confirmation",
          ],
          [
            "Only a pool or exchange balance",
            "That is not this block-reward index",
            "Check the pool or wallet on its own",
          ],
        ],
      },
      ko: {
        headers: ["페이지 상태", "말할 수 있는 것", "먼저 할 일"],
        rows: [
          [
            "오늘 0, 누적 유지",
            "이 홍콩 날짜 구간에 새 인덱싱 보상 없음",
            "최근 시각과 로그 Idle 여부",
          ],
          [
            "계정 통계 없음",
            "인덱스에 이 주소의 누적이 없음",
            "0으로 쓰지 말고 전체 웜홀 주소 대조",
          ],
          [
            "조회 실패 또는 오래된 숫자",
            "이번엔 결론을 갱신할 수 없음",
            "다시 조회. 옛 숫자를 새 확인으로 보지 않음",
          ],
          ["풀 또는 거래소 잔액만 있음", "이 블록 보상 인덱스가 아님", "풀이나 지갑에서 따로 확인"],
        ],
      },
      ja: {
        headers: ["ページの状態", "言えること", "先にすること"],
        rows: [
          [
            "今日は0、累計は残る",
            "この香港日の区間に新しい索引報酬がない",
            "直近の時刻とログがIdleかを見る",
          ],
          [
            "アカウント統計がない",
            "索引にこのアドレスの累計がない",
            "0と書かず、完全なWormholeアドレスを照合",
          ],
          [
            "照会失敗、または数字が古い",
            "今回は結論を更新できない",
            "再試行。古い数字を新しい確認にしない",
          ],
          [
            "プールか取引所の残高だけ",
            "このブロック報酬索引ではない",
            "プールかウォレットで別に確認",
          ],
        ],
      },
    },
    questions: questions([
      [
        text(
          "今日是 0，就能说 Mac 离线了吗？",
          "今日是 0，就能說 Mac 離線了嗎？",
          "Does today at 0 mean the Mac is offline?",
          "오늘이 0이면 Mac이 오프라인인가요?",
          "今日が0ならMacはオフラインですか？",
        ),
        text(
          "不能。0 只表示这个香港时间窗口没有已索引的挖矿奖励。机器是否在跑要看本机日志和矿工，不看这个 0。",
          "不能。0 只表示這個香港時間窗口沒有已索引的挖礦獎勵。機器是否在跑要看本機日誌和礦工，不看這個 0。",
          "No. Zero only means this Hong Kong window has no indexed mining reward. Whether the machine is running is in the local log and miner, not in that zero.",
          "아니요. 0은 이 홍콩 시간 구간에 인덱싱된 채굴 보상이 없다는 뜻입니다. 기기 가동은 로컬 로그와 채굴기에서 봅니다.",
          "いいえ。0はこの香港時間の区間に索引された採掘報酬が無いという意味だけです。稼働はローカルログとマイナーで見ます。",
        ),
      ],
      [
        text(
          "矿池打到个人地址的款，会出现在今日里吗？",
          "礦池打到個人地址的款，會出現在今日裡嗎？",
          "Do pool payouts to a personal address show up in today?",
          "풀이 개인 주소로 보낸 지급이 오늘에 나오나요?",
          "プールが個人アドレスへ払った分は今日に出ますか？",
        ),
        text(
          "不一定。今日合计的是索引中的挖矿奖励。矿池自己的转账账本要在矿池页面另查。",
          "不一定。今日合計的是索引中的挖礦獎勵。礦池自己的轉帳帳本要在礦池頁面另查。",
          "Not necessarily. Today sums indexed mining rewards. The pool’s own transfer ledger is checked on the pool’s pages.",
          "꼭 그렇지는 않습니다. 오늘은 인덱싱된 채굴 보상을 합합니다. 풀 자신의 송금 장부는 풀 페이지에서 봅니다.",
          "必ずしも出ません。今日は索引された採掘報酬の合計です。プール自身の送金台帳はプールのページで確認します。",
        ),
      ],
      [
        text(
          "空白应该看成 0 吗？",
          "空白應該看成 0 嗎？",
          "Should a blank be read as zero?",
          "빈칸을 0으로 읽어야 하나요?",
          "空白は0として読むべきですか？",
        ),
        text(
          "不要。只有该时段奖励笔数为 0 时，今日才是 0。缺账户、缺字段或查询失败保持未知。",
          "不要。只有該時段獎勵筆數為 0 時，今日才是 0。缺帳戶、缺欄位或查詢失敗保持未知。",
          "No. Today is the digit 0 only when the reward count in that window is zero. A missing account, a missing field, or a failed query stays unknown.",
          "아니요. 오늘은 그 구간 보상 건수가 0일 때만 숫자 0입니다. 계정 없음, 필드 없음, 조회 실패는 알 수 없음입니다.",
          "いいえ。今日が数字の0になるのは、その区間の報酬件数が0のときだけです。アカウント無し、欄の欠落、照会失敗は不明のままです。",
        ),
      ],
    ]),
    sources: [miningGuide, minerRepo, explorer, rules],
    related: [rewards, mac, hashrate],
  },
  {
    slug: hashrate,
    project: "quantus",
    published: "2026-10-24",
    modified: "2026-10-24",
    topic: text(
      "算力与出块",
      "算力與出塊",
      "Hashrate and blocks",
      "해시레이트와 블록",
      "算力とブロック",
    ),
    title: text(
      "Quantus 算力和出块奖励不是同一个数",
      "Quantus 算力和出塊獎勵不是同一個數",
      "Quantus hashrate is not the same figure as a block reward",
      "Quantus 해시레이트와 블록 보상은 다른 숫자입니다",
      "Quantusの算力とブロック報酬は別の数字です",
    ),
    description: text(
      "本机 benchmark 是这台机器在一段时间内的哈希尝试。监控上的 QTC 是已索引的出块奖励。两者不能互算，本站也不显示全网算力。",
      "本機 benchmark 是這台機器在一段時間內的雜湊嘗試。監控上的 QTC 是已索引的出塊獎勵。兩者不能互算，本站也不顯示全網算力。",
      "A local benchmark is hash attempts on that machine for a duration you choose. QTC on the monitor is an indexed block reward. One does not convert into the other, and this site does not show network hashrate.",
      "로컬 벤치마크는 선택한 시간 동안 그 기기의 해시 시도입니다. 모니터의 QTC는 인덱싱된 블록 보상입니다. 둘은 서로 환산되지 않으며, 이 사이트는 네트워크 해시레이트를 보여 주지 않습니다.",
      "ローカルのベンチマークは、選んだ時間のそのマシンのハッシュ試行です。モニターのQTCは索引されたブロック報酬です。互いに換算できず、当サイトはネットワーク算力を出しません。",
    ),
    summary: text(
      "矿工仓库里的 benchmark 只测量你指定时长内的本机 CPU 或 GPU 工作。它不是找到的区块，也不是 QTC。监控读到的是主网索引里记在 Wormhole 地址上的出块奖励。索引没有全网算力字段。官网的工作量证明和供应上限叙述不能换成你的日收入。",
      "礦工倉庫裡的 benchmark 只測量你指定時長內的本機 CPU 或 GPU 工作。它不是找到的區塊，也不是 QTC。監控讀到的是主網索引裡記在 Wormhole 地址上的出塊獎勵。索引沒有全網算力欄位。官網的工作量證明和供應上限敘述不能換成你的日收入。",
      "The miner repository’s benchmark measures local CPU or GPU work for a duration you set. It is not a block found and not QTC. The monitor reads block rewards the mainnet index attributes to a wormhole address. That index has no network-hashrate field. The website’s proof-of-work and supply-cap statements do not convert into a daily income.",
      "채굴기 저장소의 벤치마크는 지정한 시간 동안의 로컬 CPU 또는 GPU 작업만 잽니다. 찾은 블록도 QTC도 아닙니다. 모니터는 메인넷 인덱스가 웜홀 주소에 돌린 블록 보상을 읽습니다. 그 인덱스에는 네트워크 해시레이트 필드가 없습니다. 공식 사이트의 작업증명·공급 상한 서술을 하루 수입으로 바꿀 수 없습니다.",
      "マイナーリポジトリのベンチマークは、指定した時間のローカルCPUまたはGPUの仕事を測るだけです。見つけたブロックでもQTCでもありません。モニターが読むのは、メインネット索引がWormholeアドレスに付けたブロック報酬です。その索引にネットワーク算力の欄はありません。公式サイトのPoWと供給上限の記述は、一日の収入には換算できません。",
    ),
    body: paras(
      [
        "本机算力高，不等于地址上已经有 QTC。Quantus 矿工仓库把 `quantus-miner benchmark` 定义为在你设定的时长里测量 CPU、GPU 或混合工作。默认 GPU 路径在 macOS 上走 Metal。仓库同时写明：公开的 CUDA 与 Vulkan 对照是在文档里的 Linux 主机上测的，不能当成 Windows 的预期算力，也不能当成你这台 Mac 的成绩。监控页不显示这些 Linux 对照数字。",
        "打开 [Quantus 监控](/projects/quantus)，你看不到本机 H/s，也看不到全网算力。索引提供的是链高度、历史上获得过奖励的地址数、账户数，以及最近区块的高度、时间、奖励和出块地址。只有连续高度才能得到一个样本间隔，它描述这段已取回区块的时间差，不是协议承诺的出块秒数，更不是你的算力占比。官网把 QTC 写成以工作量证明进入流通，并给出供应上限叙述；页面上的活跃矿工展示是官网文案。本站的“历史上获得过奖励的地址数”来自索引统计，两者不是同一次清点，都不能换成你的日收益。",
        "奖励行回答的是：这笔已索引的挖矿奖励记在哪个公开地址、哪一个高度、什么时间、金额是多少。金额仍是 12 位小数的链上整数换算。它不回答这段时间你的 GPU 做了多少哈希。节点未到链尖时，官方指南认为本地找到的块是孤块且没有有效奖励，即便 benchmark 看起来很快。矿工在节点没有 peer 时会暂停，这时算力命令的输出和奖励记录会同时缺失，原因在节点没有连上，不是算力不够。",
        "举例（虚构，不是某张显卡的成绩）：你按仓库示例把 benchmark 跑了 30 秒，终端出现一串本地速率；同一 Wormhole 地址在监控里没有挖矿奖励行，今日为 0，累计未知或仍是昨天的数。这个组合可以同时成立。30 秒的本地测量没有承诺一个区块。不要把速率乘以秒数再除以某个难度得到 QTC，本页不提供这种换算，索引里也没有难度字段。",
        "下一步：要判断机器是否在工作，看矿工日志和你自己运行的 benchmark，并记下时长、CPU/GPU 参数和系统。要判断有没有 QTC，看 [今日与累计](/learn/quantus-wormhole-rewards) 里的奖励行和官方浏览器。速率很高但奖励为空，先确认节点已 Idle、地址是启动日志中的 Wormhole，而不是把速率当成收入，详见 [没有收益](/learn/quantus-mining-no-rewards)。本站不能读取矿工本机指标，也不能把算力换成 QTC 或法币。",
      ],
      [
        "本機算力高，不等於地址上已經有 QTC。Quantus 礦工倉庫把 benchmark 定義為在你設定的時長裡測量 CPU、GPU 或混合工作。macOS 上預設 GPU 路徑使用 Metal。倉庫寫明公開的 CUDA 與 Vulkan 對照是文件中的 Linux 主機結果，不能當成你這台 Mac 的成績。監控頁不顯示這些 Linux 對照數字。",
        "[Quantus 監控](/projects/quantus) 不顯示本機 H/s，也不顯示全網算力。索引提供鏈高度、歷史上獲得過獎勵的地址數、帳戶數，以及最近區塊的高度、時間、獎勵和出塊地址。只有連續高度才有樣本間隔，它不是協定承諾的出塊秒數，也不是你的算力占比。官網的工作量證明、供應上限與活躍礦工展示是官網文案。本站的歷史獲獎地址數來自索引統計，兩者不是同一次清點。",
        "獎勵行回答的是這筆已索引挖礦獎勵記在哪個公開地址、哪一高度、什麼時間、金額多少。它不回答這段時間 GPU 做了多少雜湊。節點未到鏈尖時，官方指南把本地找到的塊視為孤塊。節點沒有 peer 時礦工會暫停。",
        "舉例（虛構）：benchmark 跑了 30 秒，終端有一串本地速率；同一地址在監控沒有挖礦獎勵行。兩者可以同時成立。不要把速率換算成 QTC。索引沒有難度欄位。",
        "機器是否在工作，看礦工日誌和你自己的 benchmark。有沒有 QTC，看 [今日與累計](/learn/quantus-wormhole-rewards) 和官方瀏覽器。速率高但獎勵為空時，先確認 Idle 與啟動日誌中的 Wormhole 地址，見 [沒有收益](/learn/quantus-mining-no-rewards)。本站不能把算力換成 QTC 或法幣。",
      ],
      [
        "A high local hashrate does not mean the address already has QTC. The Quantus miner repository defines `quantus-miner benchmark` as a measurement of CPU, GPU, or hybrid work for a duration you set. The default GPU path uses Metal on macOS. The repository states that the published CUDA and Vulkan comparisons were measured on the Linux hosts in that write-up. They are not an expected rate for Windows and not a score for your Mac. The monitor does not display those Linux figures.",
        "The [Quantus monitor](/projects/quantus) does not show your machine’s H/s and does not show a network hashrate. The index supplies chain height, the count of addresses historically recorded with mining rewards, account count, and recent blocks with height, time, reward, and the block address. A sample interval exists only for consecutive heights. It describes the time gap in the blocks just fetched. It is not a protocol promise of block seconds and not your share of work. The public website describes QTC as entering circulation through proof of work and states a supply-cap narrative, plus a displayed active-miner figure. Those are statements on that site. The historical rewarded-address count here comes from the index. The two counts are not one census, and neither becomes a daily income.",
        "A reward row answers which public address the indexed mining reward was attributed to, at which height, at what time, and for what amount. The amount is still the 12-decimal conversion of the chain integer. The row does not answer how many hashes the GPU tried in that interval. If the node is not at the tip, the official guide treats locally found blocks as orphans with no valid reward, even when a benchmark looks fast. The miner pauses when the node has no peers. In that case both the live work and the reward row can be missing because the connection is down, not because the machine is too slow.",
        "Illustrative example: you run the repository’s style of benchmark for 30 seconds and the terminal prints a local rate, while the same wormhole address has no mining-reward row on the monitor, today is 0, and lifetime is unknown or still yesterday’s figure. Both can be true together. Thirty seconds of local work does not promise a block. Do not multiply a rate by seconds and divide by a difficulty to invent QTC. This page has no such conversion, and the index used here has no difficulty field.",
        "To see whether the machine is working, read the miner log and the benchmark you ran, including duration and CPU or GPU settings. To see whether there is QTC, read the reward rows in [today and lifetime](/learn/quantus-wormhole-rewards) and the official explorer. If the rate is high and the reward list is empty, confirm the node is Idle and the address is the wormhole from the startup log before treating the rate as income. That check is [no rewards](/learn/quantus-mining-no-rewards). This site does not read miner metrics and does not convert hashrate into QTC or fiat.",
      ],
      [
        "로컬 해시레이트가 높아도 주소에 이미 QTC가 있는 것은 아닙니다. Quantus 채굴기 저장소는 benchmark를 지정한 시간 동안의 CPU, GPU 또는 혼합 작업 측정으로 정의합니다. macOS의 기본 GPU 경로는 Metal입니다. 저장소는 공개된 CUDA와 Vulkan 비교가 그 문서의 Linux 호스트에서 측정된 것이라고 하며, 그 수치를 이 Mac의 성적으로 쓰지 말라고 합니다. 모니터는 그 Linux 대조 숫자를 보여 주지 않습니다.",
        "[Quantus 모니터](/projects/quantus)에는 내 기기의 H/s도 네트워크 해시레이트도 없습니다. 인덱스는 체인 높이, 과거에 보상을 받은 주소 수, 계정 수, 최근 블록의 높이·시각·보상·블록 주소를 줍니다. 연속 높이에서만 표본 간격이 나오며, 그것은 방금 가져온 블록의 시간 차이지 프로토콜이 약속한 블록 초도, 내 작업 비율도 아닙니다. 공식 사이트의 작업증명, 공급 상한, 활성 채굴기 표시는 그 사이트의 문장입니다. 여기서의 과거 보상 주소 수는 인덱스 통계입니다. 둘은 같은 집계가 아니고 하루 수입이 되지 않습니다.",
        "보상 행은 인덱싱된 채굴 보상이 어느 공개 주소, 어느 높이, 어느 시각, 얼마인지를 답합니다. 금액은 소수 12자리 환산입니다. 그 구간에 GPU가 몇 번 해시했는지는 답하지 않습니다. 노드가 체인 끝이 아니면 공식 안내는 로컬 블록을 보상 없는 고아로 봅니다. peer가 없으면 채굴기는 멈춥니다.",
        "예시(특정 카드의 성적 아님): 저장소 예시처럼 30초 벤치마크를 돌리고 터미널에 로컬 속도가 나와도, 같은 주소에 채굴 보상 행이 없고 오늘은 0일 수 있습니다. 둘은 동시에 성립합니다. 속도를 초로 곱해 QTC로 바꾸지 마세요. 이 인덱스에는 난이도 필드가 없습니다.",
        "기기가 일하는지는 채굴기 로그와 직접 실행한 벤치마크로 봅니다. QTC가 있는지는 [오늘과 누적](/learn/quantus-wormhole-rewards)의 보상 행과 공식 탐색기로 봅니다. 속도는 높은데 보상이 비어 있으면, 속도를 수입으로 보기 전에 Idle과 시작 로그의 웜홀 주소를 확인합니다. [보상 없음](/learn/quantus-mining-no-rewards)을 보세요. 이 사이트는 해시레이트를 QTC나 법정화폐로 바꾸지 않습니다.",
      ],
      [
        "ローカル算力が高くても、アドレスにすでにQTCがあることにはなりません。Quantusマイナーのリポジトリは benchmark を、指定した時間のCPU、GPU、または混合の仕事の測定と定義します。macOSの既定GPU経路はMetalです。リポジトリは、公開されているCUDAとVulkanの比較がその文書のLinuxホストでの測定であり、その数字をこのMacの成績にしないと書きます。モニターはそれらの Linux 対照を出しません。",
        "[Quantusモニター](/projects/quantus)には自分のマシンのH/sも、ネットワーク算力もありません。索引が渡すのはチェーン高、過去に報酬が記録されたアドレス数、アカウント数、直近ブロックの高さ・時刻・報酬・ブロックアドレスです。連続した高さにだけ標本間隔が出ます。それは今取得したブロックの時間差であり、プロトコルが約束したブロック秒でも、自分の仕事の割合でもありません。公式サイトのPoW、供給上限、アクティブマイナー表示はそのサイトの文面です。ここでの過去の報酬アドレス数は索引の統計です。二つは同じ集計ではなく、一日の収入にもなりません。",
        "報酬の行が答えるのは、索引された採掘報酬がどの公開アドレスの、どの高さの、いつ、いくらなのかです。金額は小数12桁の換算です。その間にGPUが何回ハッシュしたかは答えません。ノードが先端に無いとき、公式ガイドはローカルで見つけたブロックを報酬の無い孤立と扱います。peerが無いとマイナーは止まります。",
        "例（特定のカードの成績ではない）: リポジトリの例のように30秒のベンチマークを実行し、端末にローカル速度が出ても、同じアドレスに採掘報酬の行が無く、今日が0、という状態は同時にあり得ます。速度に秒を掛けてQTCにしないでください。この索引に難度の欄はありません。",
        "マシンが働いているかはマイナーログと、自分で実行したベンチマークで見ます。QTCがあるかは [今日と累計](/learn/quantus-wormhole-rewards) の報酬行と公式エクスプローラーで見ます。速度は高いのに報酬が空なら、速度を収入にする前にIdleと起動ログのWormholeアドレスを確認します。[報酬がない](/learn/quantus-mining-no-rewards) を見てください。当サイトは算力をQTCや法定通貨に換えません。",
      ],
      {
        zh: ["本机速率不是 QTC", "监控不显示算力", "速率和空奖励可以同时成立"],
        tw: ["本機速率不是 QTC", "監控不顯示算力", "速率和空獎勵可以同時成立"],
        en: [
          "A local rate is not QTC",
          "The monitor has no hashrate",
          "A fast benchmark and an empty reward list",
        ],
        ko: ["로컬 속도는 QTC가 아님", "모니터에는 해시레이트가 없음", "빠른 벤치마크와 빈 보상"],
        ja: ["ローカル速度はQTCではない", "モニターに算力は無い", "速いベンチマークと空の報酬"],
      },
    ),
    comparisonTitle: text(
      "算力、间隔和奖励",
      "算力、間隔和獎勵",
      "Hashrate, interval, and reward",
      "해시레이트, 간격, 보상",
      "算力、間隔、報酬",
    ),
    comparison: {
      zh: {
        headers: ["数字从哪来", "回答什么", "不能当成"],
        rows: [
          ["本机 benchmark", "你设定时长内的 CPU/GPU 工作", "区块或 QTC"],
          ["监控上的奖励金额", "索引记在该地址上的出块奖励", "算力或钱包余额"],
          ["连续高度的样本间隔", "刚取回的相邻区块时间差", "协议出块目标或你的份额"],
          ["官网活跃矿工展示", "官网页面上的叙述", "本站统计的在线设备"],
        ],
      },
      "zh-TW": {
        headers: ["數字從哪來", "回答什麼", "不能當成"],
        rows: [
          ["本機 benchmark", "你設定時長內的 CPU/GPU 工作", "區塊或 QTC"],
          ["監控上的獎勵金額", "索引記在該地址上的出塊獎勵", "算力或錢包餘額"],
          ["連續高度的樣本間隔", "剛取回的相鄰區塊時間差", "協定出塊目標或你的份額"],
          ["官網活躍礦工展示", "官網頁面上的敘述", "本站統計的線上設備"],
        ],
      },
      en: {
        headers: ["Where the figure comes from", "What it answers", "Do not treat it as"],
        rows: [
          ["Local benchmark", "CPU or GPU work for the duration you set", "A block or QTC"],
          [
            "Reward amount on the monitor",
            "Indexed block reward on that address",
            "Hashrate or wallet balance",
          ],
          [
            "Sample gap between consecutive heights",
            "Time between adjacent fetched blocks",
            "A protocol target or your share",
          ],
          [
            "Active-miner figure on the website",
            "A statement on that page",
            "This site’s count of online devices",
          ],
        ],
      },
      ko: {
        headers: ["숫자의 출처", "답하는 것", "이것으로 보면 안 되는 것"],
        rows: [
          ["로컬 벤치마크", "지정한 시간의 CPU/GPU 작업", "블록 또는 QTC"],
          ["모니터의 보상 금액", "그 주소에 인덱싱된 블록 보상", "해시레이트나 지갑 잔액"],
          ["연속 높이의 표본 간격", "방금 가져온 인접 블록의 시간 차", "프로토콜 목표나 내 지분"],
          ["공식 사이트의 활성 채굴기", "그 페이지의 문장", "이 사이트의 온라인 기기 수"],
        ],
      },
      ja: {
        headers: ["数字の出所", "答えること", "これとして扱わない"],
        rows: [
          ["ローカルのベンチマーク", "指定時間のCPU/GPUの仕事", "ブロックやQTC"],
          ["モニターの報酬額", "そのアドレスに索引されたブロック報酬", "算力やウォレット残高"],
          ["連続高さの標本間隔", "取得した隣接ブロックの時間差", "プロトコル目標や自分のシェア"],
          ["公式サイトのアクティブマイナー", "そのページの文面", "当サイトの稼働台数"],
        ],
      },
    },
    questions: questions([
      [
        text(
          "监控为什么没有我的 H/s？",
          "監控為什麼沒有我的 H/s？",
          "Why does the monitor not show my H/s?",
          "모니터에 내 H/s가 없는 이유는 무엇인가요?",
          "モニターに自分のH/sが無いのはなぜですか？",
        ),
        text(
          "这条主网索引不提供本机或全网算力。H/s 在你自己运行的矿工或 benchmark 里。",
          "這條主網索引不提供本機或全網算力。H/s 在你自己執行的礦工或 benchmark 裡。",
          "This mainnet index does not provide local or network hashrate. H/s is on the miner or benchmark you run yourself.",
          "이 메인넷 인덱스는 로컬이나 네트워크 해시레이트를 주지 않습니다. H/s는 직접 실행한 채굴기나 벤치마크에 있습니다.",
          "このメインネット索引はローカル算力もネットワーク算力も渡しません。H/sは自分で実行したマイナーかベンチマークにあります。",
        ),
      ],
      [
        text(
          "可以把 benchmark 速率换成每天的 QTC 吗？",
          "可以把 benchmark 速率換成每天的 QTC 嗎？",
          "Can a benchmark rate be converted into QTC per day?",
          "벤치마크 속도를 하루 QTC로 바꿀 수 있나요?",
          "ベンチマークの速度を1日のQTCに換えられますか？",
        ),
        text(
          "不能。速率是本机一段时间内的工作。QTC 奖励要等索引里出现记在你地址上的出块记录。本站不做这种换算。",
          "不能。速率是本機一段時間內的工作。QTC 獎勵要等索引裡出現記在你地址上的出塊紀錄。本站不做這種換算。",
          "No. The rate is local work over a short run. QTC requires an indexed block reward on your address. This site does not convert one into the other.",
          "아니요. 속도는 짧은 실행의 로컬 작업입니다. QTC는 내 주소에 인덱싱된 블록 보상이 있어야 합니다. 이 사이트는 둘을 환산하지 않습니다.",
          "いいえ。速度は短い実行のローカルの仕事です。QTCには自分のアドレスに索引されたブロック報酬が必要です。当サイトはその換算をしません。",
        ),
      ],
      [
        text(
          "官网的活跃矿工数就是监控里的历史地址数吗？",
          "官網的活躍礦工數就是監控裡的歷史地址數嗎？",
          "Is the website’s active-miner figure the historical address count on the monitor?",
          "공식 사이트의 활성 채굴기 수가 모니터의 과거 주소 수인가요?",
          "公式サイトのアクティブマイナー数は、モニターの過去のアドレス数ですか？",
        ),
        text(
          "不是。前者是官网页面上的展示，后者是索引里历史上获得过奖励的地址统计。都不是你的在线证明。",
          "不是。前者是官網頁面上的展示，後者是索引裡歷史上獲得過獎勵的地址統計。都不是你的在線證明。",
          "No. One is a figure displayed on the public website. The other is the index count of addresses historically recorded with rewards. Neither proves that your machine is online.",
          "아니요. 하나는 공식 사이트에 표시된 숫자이고, 다른 하나는 과거에 보상이 기록된 주소의 인덱스 통계입니다. 둘 다 내 기기가 온라인이라는 증거가 아닙니다.",
          "いいえ。一つは公式サイトに出ている数字、もう一つは過去に報酬が記録されたアドレスの索引統計です。どちらも自分のマシンが稼働中という証明ではありません。",
        ),
      ],
    ]),
    sources: [minerRepo, miningGuide, site, rules],
    related: [rewards, none, mac],
  },
  {
    slug: safety,
    project: "quantus",
    published: "2026-10-24",
    modified: "2026-10-24",
    topic: text("地址与密钥", "地址與金鑰", "Address and keys", "주소와 키", "アドレスと鍵"),
    title: text(
      "Quantus 挖矿地址怎么填才安全：只交公开 Wormhole",
      "Quantus 挖礦地址怎麼填才安全：只交公開 Wormhole",
      "What to paste for Quantus mining: the public wormhole address only",
      "Quantus 채굴 주소는 공개 웜홀만 붙여 넣으세요",
      "Quantusの採掘アドレスは公開Wormholeだけを貼る",
    ),
    description: text(
      "监控只保存公开 Address。24 个单词、inner hash、矿工认证令牌和节点私钥留在本机。本页不能花费 wormhole 余额。",
      "監控只保存公開 Address。24 個單詞、inner hash、礦工認證權杖和節點私鑰留在本機。本頁不能花費 wormhole 餘額。",
      "The monitor stores the public Address only. Keep the 24 words, inner hash, miner auth token, and node private key on the machine. This page cannot spend a wormhole balance.",
      "모니터는 공개 Address만 저장합니다. 24단어, inner hash, 채굴기 인증 토큰, 노드 개인 키는 기기에 둡니다. 이 페이지는 웜홀 잔액을 쓸 수 없습니다.",
      "モニターが保存するのは公開Addressだけです。24語、inner hash、マイナー認証トークン、ノード秘密鍵はマシンに残します。このページはwormhole残高を使えません。",
    ),
    summary: text(
      "官方密钥输出有三项：公开 Address、inner hash、24 个单词。监控只用第一项，而且必须是主网 Wormhole 那个公开串。矿工认证令牌被官方视为口令。钱包 App 可以花费同一种子的 wormhole 余额；这个网页不能签名，也不能把奖励转到交易所。",
      "官方金鑰輸出有三項：公開 Address、inner hash、24 個單詞。監控只用第一項，而且必須是主網 Wormhole 那個公開串。礦工認證權杖被官方視為口令。錢包 App 可以花費同一種子的 wormhole 餘額；這個網頁不能簽名，也不能把獎勵轉到交易所。",
      "Official key output has three values: the public Address, the inner hash, and the 24 words. The monitor uses only the first, and it must be the mainnet wormhole public string. The project treats the miner auth token as a password. The wallet app can spend a wormhole balance from the same seed. This website cannot sign or move rewards to an exchange.",
      "공식 키 출력은 공개 Address, inner hash, 24단어 세 가지입니다. 모니터는 첫 번째만 쓰며, 그것은 메인넷 웜홀 공개 문자열이어야 합니다. 프로젝트는 채굴기 인증 토큰을 비밀번호처럼 다룹니다. 지갑 앱은 같은 시드의 웜홀 잔액을 쓸 수 있습니다. 이 웹사이트는 서명하거나 보상을 거래소로 옮기지 않습니다.",
      "公式の鍵出力は公開Address、inner hash、24語の三つです。モニターが使うのは最初の一つだけで、それはメインネットWormholeの公開文字列です。プロジェクトはマイナー認証トークンをパスワードとして扱います。ウォレットアプリは同じシードのwormhole残高を使えます。このウェブサイトは署名も、報酬を取引所へ移すこともできません。",
    ),
    body: paras(
      [
        "往 [Quantus 监控](/projects/quantus) 里粘贴时，只放**公开的 Wormhole Address**。官方密钥生成会同时给出三项：Address（奖励进入的公开地址，供监控记录）、Inner Hash（32 字节原像，交给本机节点）、Secret phrase（24 个单词，证明所有权，丢失就无法恢复花费能力）。后两项不进入网页、工单或截图。节点启动日志里的地址可以用来核对你抄对了 Address，日志里若出现别的密钥材料，不要把那一行一并复制。",
        "官方安全说明把 miner-auth-token 当成口令：持有令牌并且能访问矿工端口的人可以提交工作结果并看到挖矿任务。令牌不要写进命令行历史，也不要贴到本站。TLS 私钥文件留在节点目录。节点密钥文件同样只留在本机。这些材料不能代替公开地址，贴进来也不会让监控“更能算出收益”。监控只查询主网索引里该公开地址的挖矿奖励。",
        "矿工端口默认在本机 9833。官方指南写明该端口会绑定所有接口，因此是否暴露取决于你的防火墙；认证和证书固定并不能让它对公网开放变得安全。指南要求只对公网开放 P2P 端口 30333，把矿工端口、本机 RPC 和本机指标留在 localhost。远程矿工应放在私有网络。监控页面不会替你开放这些端口。",
        "花费和查询是两条路。官网与挖矿指南写：钱包支持 wormhole，若挖矿使用与钱包 App 相同的种子，奖励出现在 App 中，可直接从 wormhole 余额花费，没有单独领取。那一步发生在官方钱包。本页没有私钥，不能签名，不能把累计 QTC 转到交易所，也不能完成官网上的 USDC 兑换。外观相同的普通透明地址即使被误存，也只是一条查询，不会变成花费授权。",
        "举例（虚构）：有人把 24 个单词和 inner hash 跟 Address 一起贴进地址栏，希望累计变大。正确的操作是立刻在钱包侧按官方备份习惯处理已暴露的单词（本页不提供重置步骤），然后只保留公开 Address 再查询。多贴的秘密不会改变索引结果。另一个人只保存了 Address，今日和累计仍按 [收益说明](/learn/quantus-wormhole-rewards) 显示，这是预期行为。",
        "下一步：地址栏里如果有空格、单词或一长串十六进制 inner hash，删掉，改贴启动日志中的 Address。不确定是不是主网 Wormhole 时，回到 [Mac 同步](/learn/quantus-mainnet-mining-mac) 看 `--chain mainnet` 和日志里的地址。查不到奖励时用 [没有收益](/learn/quantus-mining-no-rewards)，不要改用私钥重试。每个项目免费 3 台已保存设备，Pro 100 台。列表里的地址不会自动多占一台；另行保存的设备记录才计入，同一台设备上的多条来源不重复占名额。列表名称只是你的备注。页面上的 Agent 不管理 Quantus 密钥，也不启动节点。",
      ],
      [
        "往 [Quantus 監控](/projects/quantus) 貼上時，只放**公開的 Wormhole Address**。官方金鑰生成同時給出三項：Address、Inner Hash、24 個單詞。後兩項不進網頁、工單或截圖。啟動日誌裡的地址只用來核對 Address，不要把其他密鑰材料一起複製。",
        "官方把 miner-auth-token 當成口令。持有權杖且能連上礦工端口的人可以提交工作結果。權杖不要寫進命令列歷史，也不要貼到本站。TLS 私鑰和節點金鑰留在本機。這些材料不能代替公開地址。",
        "礦工端口預設在本機 9833。官方指南寫明它會綁定所有介面，能否從外網到達取決於防火牆；認證不能讓對公網開放變安全。指南要求公網只開放 P2P 端口 30333，把礦工端口、本機 RPC 和本機指標留在 localhost。遠端礦工應在私有網路。監控頁面不會替你開放這些端口。",
        "花費在官方錢包。指南寫：同一種子的 wormhole 餘額可在 App 中直接花費，沒有單獨領取。本頁不能簽名，不能把 QTC 轉到交易所，也不能完成官網的 USDC 兌換。",
        "舉例（虛構）：把 24 個單詞和 inner hash 跟 Address 一起貼上，不會讓累計變大。應只保留公開 Address。已暴露的單詞按你自己的備份習慣處理，本頁不提供重置步驟。另一個人只保存了 Address，今日和累計仍按 [收益說明](/learn/quantus-wormhole-rewards) 顯示，這是預期行為。",
        "地址欄若有單詞或 inner hash，刪掉，改貼啟動日誌中的 Address。不確定網路時回到 [Mac 同步](/learn/quantus-mainnet-mining-mac)。查不到時看 [沒有收益](/learn/quantus-mining-no-rewards)，不要改貼私鑰。每個專案免費 3 台已儲存設備，Pro 100 台。列表裡的地址不會自動多占一台；另行儲存的設備紀錄才計入，同一台設備上的多條來源不重複占名額。Agent 不管理 Quantus 金鑰。",
      ],
      [
        "When you add a row on the [Quantus monitor](/projects/quantus), paste only the **public wormhole Address**. Official key generation prints three values together: Address (the public destination of mining rewards, the one to record), Inner Hash (the 32-byte preimage for the node on this machine), and the secret phrase (24 words that prove ownership). The last two do not belong in the website, a ticket, or a screenshot. The address line in the node startup log is the right cross-check. If that log also contains other key material, do not copy the whole line.",
        "The official security notes treat miner-auth-token as a password. Anyone with the token and network access to the miner port can submit job results and observe mining jobs. Do not put the token in shell history, and do not paste it here. The TLS private key stays in the node directory. The node key file stays on the machine. None of those secrets can stand in for the public address, and pasting them does not make the reward lookup more accurate. The monitor only reads indexed mining rewards for the public address.",
        "The miner port in the guide defaults to 9833 on the local machine. The guide states that the port binds all interfaces, so reachability is your firewall, and that auth plus certificate pinning does not make it safe to publish on the internet. The guide tells you to expose only the P2P port 30333, and to keep the miner port, local RPC, and local metrics on localhost. Remote miners belong on a private network. That is a boundary for the node you run. This website does not open those ports.",
        "Spending and lookup are separate. The site and the mining guide say the wallet supports wormhole addresses: if mining uses the same seed as the wallet app, rewards appear in the app and can be spent from the wormhole balance with no separate claim. That step happens in the official wallet. This page has no private key. It cannot sign, cannot send lifetime QTC to an exchange, and cannot perform the USDC swap linked from the public site. A regular transparent address that looks the same, if saved by mistake, is still only a lookup. It does not become permission to spend.",
        "Illustrative case: someone pastes the 24 words and the inner hash into the address field together with the Address, hoping lifetime will rise. The extra secrets do not change the index. Remove them and query with the public Address only. If the words were exposed, handle that backup with your own wallet procedure. This page does not provide a reset. Another person who saved only the Address still sees today and lifetime as described in [rewards](/learn/quantus-wormhole-rewards). That is the expected page.",
        "If the field contains spaces, words, or a long hex inner hash, delete it and paste the Address from the startup log. If you are unsure the node is on mainnet, return to [Mac sync](/learn/quantus-mainnet-mining-mac) and check `--chain mainnet` plus the logged address. If rewards are missing, use [no rewards](/learn/quantus-mining-no-rewards) rather than retrying with a private key. Free keeps three saved devices per project, and Pro keeps 100. An address that only appears in a list does not add a device. A separately saved device record does, and extra sources on the same saved device do not add another slot. The name on a row is only your label. The on-page agent does not hold Quantus keys and does not start the node.",
      ],
      [
        "[Quantus 모니터](/projects/quantus)에는 **공개 웜홀 Address**만 붙입니다. 공식 키 생성은 세 값을 함께 냅니다. Address는 채굴 보상이 들어가는 공개 주소이고, Inner Hash는 이 기기의 노드에 넘기는 32바이트 원상, 24단어는 소유를 증명합니다. 뒤의 둘은 웹사이트, 문의, 스크린샷에 넣지 않습니다. 노드 시작 로그의 주소 줄로 Address를 대조하되, 다른 키 재료가 있으면 줄 전체를 복사하지 않습니다.",
        "공식 보안 설명은 miner-auth-token을 비밀번호로 다룹니다. 토큰과 채굴기 포트 접근이 있으면 작업 결과를 내고 채굴 작업을 볼 수 있습니다. 토큰을 셸 기록이나 이 사이트에 넣지 마세요. TLS 개인 키와 노드 키는 기기에 둡니다. 비밀을 붙여도 보상 조회가 더 정확해지지 않습니다. 모니터는 공개 주소의 인덱싱된 채굴 보상만 읽습니다.",
        "안내의 채굴기 포트 기본값은 로컬 9833입니다. 가이드는 이 포트가 모든 인터페이스에 묶이며, 도달 가능 여부는 방화벽이고, 인증과 인증서 고정만으로 인터넷에 공개해도 안전해지지 않는다고 합니다. 공개는 P2P 포트 30333만, 채굴기 포트와 로컬 RPC·지표는 localhost에 두라고 합니다. 원격 채굴기는 사설망에 둡니다. 이 웹사이트가 그 포트를 열지는 않습니다.",
        "쓰기는 공식 지갑에서 합니다. 같은 시드의 wormhole 잔액은 앱에서 바로 쓸 수 있고 별도 청구가 없다고 안내합니다. 이 페이지에는 개인 키가 없어 서명할 수 없고, 누적 QTC를 거래소로 보낼 수 없으며, 공식 사이트의 USDC 교환도 하지 않습니다.",
        "예시: 24단어와 inner hash를 Address와 함께 붙여 누적이 커지기를 바라는 경우, 비밀을 더해도 인덱스는 바뀌지 않습니다. 공개 Address만 남깁니다. 단어가 노출되었다면 지갑 쪽 백업 절차로 처리하세요. 이 페이지는 재설정 절차를 주지 않습니다. Address만 저장한 사람은 오늘과 누적이 [보상 설명](/learn/quantus-wormhole-rewards)대로 보이며, 이것이 이 페이지의 정상입니다.",
        "칸에 단어나 inner hash가 있으면 지우고 시작 로그의 Address를 붙입니다. 메인넷인지 모르면 [Mac 동기화](/learn/quantus-mainnet-mining-mac)에서 `--chain mainnet`과 로그의 주소를 봅니다. 보상이 없으면 개인 키로 다시 시도하지 말고 [보상 없음](/learn/quantus-mining-no-rewards)을 봅니다. 프로젝트당 무료는 저장된 기기 3대, Pro는 100대입니다. 목록의 주소가 자동으로 기기를 늘리지는 않습니다. 따로 저장한 기록만 세고, 같은 기기의 출처를 더해도 자리는 늘지 않습니다. Agent는 Quantus 키를 다루지 않습니다.",
      ],
      [
        "[Quantusモニター](/projects/quantus)に貼るのは**公開のWormhole Address**だけです。公式の鍵生成は三つの値を同時に出します。Addressは採掘報酬が入る公開アドレス、Inner Hashはこのマシンのノードへ渡す32バイトの原像、24語は所有を証明します。後の二つはウェブサイト、問い合わせ、スクリーンショットに置きません。ノード起動ログのアドレス行でAddressを照合し、他の鍵材料がある行は丸ごとコピーしません。",
        "公式のセキュリティ説明は miner-auth-token をパスワードとして扱います。トークンとマイナーポートへの到達があれば、ジョブ結果を送り採掘ジョブを見られます。トークンをシェル履歴や当サイトに置かないでください。TLS秘密鍵とノード鍵はマシンに残します。秘密を貼っても報酬照会は正確になりません。モニターは公開アドレスの索引済み採掘報酬だけを読みます。",
        "ガイドのマイナーポートの既定はローカルの9833です。ガイドはそのポートが全インタフェースに結び、到達できるかはファイアウォール次第であり、認証と証明書のピン留めだけではインターネット公開が安全にならないと書きます。公開するのはP2Pの30333だけで、マイナーポートとローカルRPC・指標はlocalhostに置きます。遠隔マイナーは私設網に置きます。このウェブサイトはそのポートを開きません。",
        "支払いは公式ウォレットで行います。同じシードのwormhole残高はアプリから直接使え、別の請求は無いとガイドは書きます。このページに秘密鍵は無く、署名できず、累計QTCを取引所へ送れず、公式サイトのUSDC交換もできません。",
        "例: 24語と inner hash をAddressと一緒に貼って累計が増えることを期待しても、秘密を足しても索引は変わりません。公開Addressだけを残します。語が露出したときはウォレット側のバックアップ手順で扱ってください。このページはリセット手順を出しません。Addressだけを保存した人は、今日と累計が [報酬の説明](/learn/quantus-wormhole-rewards) のとおり表示されます。それが想定どおりのページです。",
        "欄に語や inner hash があるときは消し、起動ログのAddressを貼ります。メインネットか不明なら [Mac同期](/learn/quantus-mainnet-mining-mac) で `--chain mainnet` とログのアドレスを見ます。報酬が無いとき秘密鍵で再試行せず、[報酬がない](/learn/quantus-mining-no-rewards) を見ます。各プロジェクト無料は保存したデバイス3台、Proは100台です。一覧のアドレスが自動で台数を増やすことはありません。別に保存した記録だけを数え、同じデバイスの出典を足しても枠は増えません。AgentはQuantusの鍵を扱いません。",
      ],
      {
        zh: ["只保存公开地址", "令牌不是查询材料", "花费不在这个网页"],
        tw: ["只保存公開地址", "權杖不是查詢材料", "花費不在這個網頁"],
        en: [
          "Save only the public address",
          "The token is not lookup data",
          "Spending is not this page",
        ],
        ko: ["공개 주소만 저장", "토큰은 조회 자료가 아님", "지출은 이 페이지가 아님"],
        ja: [
          "公開アドレスだけを保存",
          "トークンは照会データではない",
          "支払いはこのページではない",
        ],
      },
    ),
    comparisonTitle: text(
      "什么可以交给监控",
      "什麼可以交給監控",
      "What the monitor may store",
      "모니터에 맡겨도 되는 것",
      "モニターに渡してよいもの",
    ),
    comparison: {
      zh: {
        headers: ["材料", "放在哪里", "监控是否使用"],
        rows: [
          ["公开 Address", "可保存到监控", "用它查询已索引挖矿奖励"],
          ["24 个单词", "只留在你的备份", "不使用，不能花费"],
          ["inner hash", "只交给本机节点", "不使用"],
          ["miner-auth-token 与节点私钥", "只留在节点目录", "不使用；官方将其视为口令"],
        ],
      },
      "zh-TW": {
        headers: ["材料", "放在哪裡", "監控是否使用"],
        rows: [
          ["公開 Address", "可保存到監控", "用它查詢已索引挖礦獎勵"],
          ["24 個單詞", "只留在你的備份", "不使用，不能花費"],
          ["inner hash", "只交給本機節點", "不使用"],
          ["miner-auth-token 與節點私鑰", "只留在節點目錄", "不使用；官方將其視為口令"],
        ],
      },
      en: {
        headers: ["Material", "Where it stays", "Used by the monitor"],
        rows: [
          ["Public Address", "May be saved on the monitor", "Looks up indexed mining rewards"],
          ["24 words", "Only in your own backup", "Not used, and this page cannot spend"],
          ["Inner hash", "Only on the local node", "Not used"],
          [
            "miner-auth-token and node private key",
            "Only in the node directory",
            "Not used; the project treats the token as a password",
          ],
        ],
      },
      ko: {
        headers: ["자료", "두는 곳", "모니터가 쓰는지"],
        rows: [
          ["공개 Address", "모니터에 저장 가능", "인덱싱된 채굴 보상 조회"],
          ["24단어", "본인 백업에만", "쓰지 않으며 이 페이지는 지출 불가"],
          ["inner hash", "로컬 노드에만", "쓰지 않음"],
          [
            "miner-auth-token과 노드 개인 키",
            "노드 디렉터리에만",
            "쓰지 않음. 프로젝트는 토큰을 비밀번호로 봄",
          ],
        ],
      },
      ja: {
        headers: ["材料", "置く場所", "モニターが使うか"],
        rows: [
          ["公開Address", "モニターに保存できる", "索引済み採掘報酬の照会"],
          ["24語", "自分のバックアップだけ", "使わない。このページは支払えない"],
          ["inner hash", "ローカルノードだけ", "使わない"],
          [
            "miner-auth-token とノード秘密鍵",
            "ノードのディレクトリだけ",
            "使わない。プロジェクトはトークンをパスワードと扱う",
          ],
        ],
      },
    },
    questions: questions([
      [
        text(
          "把 inner hash 交给网页，收益会更准确吗？",
          "把 inner hash 交給網頁，收益會更準確嗎？",
          "Will pasting the inner hash make rewards more accurate?",
          "inner hash를 웹에 넣으면 보상이 더 정확해지나요?",
          "inner hash をページに渡すと報酬はより正確になりますか？",
        ),
        text(
          "不会。查询只使用公开地址。inner hash 留在本机节点。",
          "不會。查詢只使用公開地址。inner hash 留在本機節點。",
          "No. The lookup uses the public address only. Leave the inner hash on the local node.",
          "아니요. 조회는 공개 주소만 사용합니다. inner hash는 로컬 노드에 둡니다.",
          "いいえ。照会は公開アドレスだけを使います。inner hash はローカルノードに残します。",
        ),
      ],
      [
        text(
          "这个页面能把 wormhole 余额转到交易所吗？",
          "這個頁面能把 wormhole 餘額轉到交易所嗎？",
          "Can this page send a wormhole balance to an exchange?",
          "이 페이지가 웜홀 잔액을 거래소로 보낼 수 있나요?",
          "このページはwormhole残高を取引所へ送れますか？",
        ),
        text(
          "不能。花费在官方钱包里完成。本页没有私钥，也不能发起官网上的兑换。",
          "不能。花費在官方錢包裡完成。本頁沒有私鑰，也不能發起官網上的兌換。",
          "No. Spending happens in the official wallet. This page has no private key and cannot start the swap on the public site.",
          "아니요. 지출은 공식 지갑에서 합니다. 이 페이지에는 개인 키가 없고 공식 사이트의 교환을 시작하지 않습니다.",
          "いいえ。支払いは公式ウォレットで行います。このページに秘密鍵は無く、公式サイトの交換も始められません。",
        ),
      ],
      [
        text(
          "矿工认证令牌应该和地址一起保存吗？",
          "礦工認證權杖應該和地址一起保存嗎？",
          "Should the miner auth token be saved next to the address?",
          "채굴기 인증 토큰을 주소와 함께 저장해야 하나요?",
          "マイナー認証トークンはアドレスと一緒に保存すべきですか？",
        ),
        text(
          "不要。官方把它视为口令。监控不读取它。令牌留在节点目录。",
          "不要。官方把它視為口令。監控不讀取它。權杖留在節點目錄。",
          "No. The project treats it as a password. The monitor does not read it. Keep the token in the node directory.",
          "아니요. 프로젝트는 그것을 비밀번호로 봅니다. 모니터는 읽지 않습니다. 토큰은 노드 디렉터리에 둡니다.",
          "いいえ。プロジェクトはそれをパスワードと扱います。モニターは読みません。トークンはノードのディレクトリに残します。",
        ),
      ],
    ]),
    sources: [miningGuide, minerRepo, site, rules],
    related: [rewards, mac, none],
  },
];
