import { localized as l } from "@/lib/product-discovery";
export const mdsEditorial = {
  title: l([
    "Midstate MDS 矿池监控：算力、Worker 和收益",
    "Midstate MDS 礦池監控：算力、Worker 與收益",
    "Midstate MDS mining monitor: hashrate, Workers and rewards",
    "Midstate MDS 채굴 모니터: 해시레이트·Worker·보상",
    "Midstate MDS採掘監視：ハッシュレート・Worker・報酬",
  ]),
  summary: l([
    "用 LuckyPool 的公开 MSS 收款地址查看算力、Worker 和近 24 小时收益，登录后保存多个地址。",
    "用 LuckyPool 公開 MSS 收款地址查看算力、Worker 與近 24 小時收益，登入後儲存多個地址。",
    "Monitor LuckyPool hashrate, Workers and last-24h rewards with a public MSS payout address. Sign in to save multiple addresses.",
    "LuckyPool의 공개 MSS 지급 주소로 해시레이트·Worker·최근 24시간 보상을 조회하고 로그인 후 여러 주소를 저장하세요.",
    "LuckyPoolの公開MSS受取アドレスで処理速度・Worker・直近24時間報酬を照会し、ログインで複数アドレスを保存できます。",
  ]),
  identity: l([
    "填写挖矿配置里的 64 位小写十六进制 MSS 公开地址。官方矿池指南要求使用可重复收款的 MSS 地址；本站只能检查格式，不能验证它是否由 MSS 钱包生成。不要输入私钥、助记词或钱包文件。",
    "填寫採礦設定中的 64 位小寫十六進位 MSS 公開地址。官方要求礦池使用可重複收款的 MSS 地址；本站只檢查格式，無法證明其由 MSS 錢包產生。勿輸入私鑰、助記詞或錢包檔。",
    "Enter the 64-character lowercase hex MSS public address from your mining configuration. The official pool guide requires reusable MSS addresses. Format validation cannot prove an address was generated as MSS. Never enter a private key, seed or wallet file.",
    "채굴 설정의 소문자 16진수 64자리 MSS 공개 주소를 입력하세요. 공식 풀 안내는 재사용 가능한 MSS 주소를 요구합니다. 형식 검사는 MSS 생성 여부를 증명하지 못합니다. 비밀키·시드·지갑 파일은 입력하지 마세요.",
    "採掘設定の小文字16進数64桁のMSS公開アドレスを入力します。公式ガイドは再利用可能なMSSを要求します。形式検証ではMSS生成を証明できません。秘密鍵・シード・ウォレットファイルは入力しないでください。",
  ]),
  coverage: l([
    "仅覆盖 LuckyPool。近 24 小时收益取矿池 rewardStats 的 24h 区块分配，不是近 24 小时转账；未支付余额包含锁定与已解锁金额，累计已支付单独展示。金额使用基础单位 MDS：1 mMDS = 1,048,576 MDS，1 gMDS = 1,073,741,824 MDS。Worker 活跃按最近 15 分钟收到份额判断，不是设备心跳；算力单位为 nonces/s。钱包收益不分摊给单个 Worker，不估算美元。",
    "僅覆蓋 LuckyPool。24h 收益來自 rewardStats 區塊分配，不是轉帳；未支付包含鎖定與已解鎖金額，已支付另列。採基礎 MDS：1 mMDS = 1,048,576 MDS，1 gMDS = 1,073,741,824 MDS。Worker 活躍依最近 15 分鐘份額，非設備心跳；速度為 nonces/s。不分攤錢包收益至 Worker，不估美元。",
    "LuckyPool only. Last-24h rewards use rewardStats block allocations, not payment transfers. Unpaid balance includes locked and unlocked amounts; total paid is separate. Amounts use base MDS: 1 mMDS = 1,048,576 MDS; 1 gMDS = 1,073,741,824 MDS. Worker activity means a share in the last 15 minutes, not a machine heartbeat. Rates are nonces/s. Wallet rewards are not allocated to individual Workers and no USD estimate is supplied.",
    "LuckyPool만 조회합니다. 24h 보상은 rewardStats 블록 배분이며 송금액이 아닙니다. 미지급은 잠금·해제 금액을 포함하고 누적 지급은 별도입니다. 기본 MDS 단위이며 1 mMDS = 1,048,576 MDS, 1 gMDS = 1,073,741,824 MDS입니다. Worker 활성은 15분 내 지분 제출 기준이며 하트비트가 아닙니다. 속도는 nonces/s이며 지갑 보상을 Worker별로 나누거나 USD로 추정하지 않습니다.",
    "LuckyPoolのみです。24h報酬はrewardStatsのブロック配分で送金額ではありません。未払いはロック・解除済み金額を含み、累計支払は別表示です。基礎MDS単位で1 mMDS = 1,048,576 MDS、1 gMDS = 1,073,741,824 MDSです。Worker稼働は15分以内のシェア提出で、機器の応答ではありません。速度はnonces/s、報酬はWorkerへ按分せずUSD概算もありません。",
  ]),
};
export const mdsLabels = {
  balance: l([
    "未支付 · 含锁定",
    "未支付 · 含鎖定",
    "Unpaid · including locked",
    "미지급 · 잠금 포함",
    "未払い・ロック含む",
  ]),
  address: l([
    "64 位 MSS 公开地址",
    "64 位 MSS 公開地址",
    "64-character MSS public address",
    "64자리 MSS 공개 주소",
    "64桁のMSS公開アドレス",
  ]),
};
