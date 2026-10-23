import type { SiteLocale } from "@/lib/site";
const line = (
  zh: string,
  tw: string,
  en: string,
  ko: string,
  ja: string,
): Record<SiteLocale, string> => ({ zh, "zh-TW": tw, en, ko, ja });
export const prlPoolCopy = {
  notFound: line(
    "所选矿池暂无这个地址的挖矿记录。请核对矿池和收益地址；这不代表钱包地址无效。",
    "所選礦池暫無這個地址的挖礦記錄。請核對礦池和收益地址；這不代表錢包地址無效。",
    "The selected pool has no mining record for this address. Check your pool and payout address; this does not mean the wallet is invalid.",
    "선택한 풀에 이 주소의 채굴 기록이 없습니다. 풀과 지급 주소를 확인하세요. 지갑이 잘못되었다는 뜻은 아닙니다.",
    "選択したプールにこのアドレスの採掘記録がありません。接続先プールと受取アドレスを確認してください。無効なウォレットという意味ではありません。",
  ),
  summary: line(
    "选择矿机实际连接的矿池，查看钱包收益和旗下 Worker；登录后可保存多个地址。",
    "選擇礦機實際連接的礦池，查看錢包收益和旗下 Worker；登入後可儲存多個地址。",
    "Select the pool your miner connects to, then view wallet rewards and its Workers. Sign in to save multiple addresses.",
    "채굴기가 연결된 풀을 선택해 지갑 보상과 Worker를 확인하세요. 로그인하면 여러 주소를 저장할 수 있습니다.",
    "マイナーの接続先プールを選択し、ウォレット報酬とWorkerを確認できます。ログインすると複数のアドレスを保存できます。",
  ),
  selected: line(
    "保存到所选矿池",
    "儲存至所選礦池",
    "Save to selected pool",
    "선택한 풀에 저장",
    "選択したプールに保存",
  ),
  accepted: line(
    "累计有效份额",
    "累計有效份額",
    "Accepted shares",
    "누적 유효 지분",
    "累計有効シェア",
  ),
  unlocked: line(
    "已解锁余额",
    "已解鎖餘額",
    "Unlocked balance",
    "잠금 해제 잔액",
    "ロック解除済み残高",
  ),
  locked: line(
    "待确认奖励",
    "待確認獎勵",
    "Pending block rewards",
    "확인 대기 보상",
    "確定待ち報酬",
  ),
  reward: line(
    "近 24 小时矿池奖励",
    "近 24 小時礦池獎勵",
    "Pool rewards · last 24 hours",
    "최근 24시간 풀 보상",
    "直近24時間のプール報酬",
  ),
  note: line(
    "算力为矿池近 15 分钟平均值。奖励包含待确认部分，不等于已到账；累计支付才是矿池已转出的金额。",
    "算力為礦池近 15 分鐘平均值。獎勵包含待確認部分，不等於已到帳；累計支付才是礦池已轉出的金額。",
    "Hashrate is the pool’s 15-minute average. Rewards may include pending blocks and are not payments. Total paid is the amount already sent by the pool.",
    "해시레이트는 풀의 15분 평균입니다. 보상에는 확인 대기 블록이 포함될 수 있으며 지급액과 다릅니다. 누적 지급액은 풀이 이미 전송한 금액입니다.",
    "ハッシュレートはプールの15分平均です。報酬には確定待ちのブロックが含まれ、支払い済み額とは異なります。累計支払額はプールが送金済みの金額です。",
  ),
  scope: line(
    "每个矿池单独记账，请选择挖矿软件中的连接矿池。这里只统计 PRL，不包含合并挖矿的 NOCK。",
    "每個礦池單獨記帳，請選擇挖礦軟體中的連接礦池。此處只統計 PRL，不包含合併挖礦的 NOCK。",
    "Each pool keeps separate records. Select the pool configured in your miner. This page covers PRL only, not merge-mined NOCK.",
    "풀마다 기록이 별도입니다. 채굴기에 설정된 풀을 선택하세요. PRL만 표시하며 병합 채굴 NOCK은 포함하지 않습니다.",
    "記録はプールごとに独立しています。採掘ソフトの接続先を選択してください。PRLのみ表示し、マージマイニングのNOCKは含みません。",
  ),
};
