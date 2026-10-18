import { localized as l } from "@/lib/product-discovery";
export const bntLabels = {
  confirmed: l([
    "已确认待支付",
    "已確認待支付",
    "Confirmed, awaiting payment",
    "확정된 미지급 보상",
    "確定済み・支払待ち",
  ]),
  estimated: l([
    "待成熟预估",
    "待成熟預估",
    "Estimated, not matured",
    "미성숙 예상 보상",
    "未成熟の推定報酬",
  ]),
  queued: l(["排队支付", "排隊支付", "Queued for payment", "지급 대기열", "支払キュー"]),
  address: l([
    "Blocknet 主网公开收益地址",
    "Blocknet 主網公開收益地址",
    "Blocknet mainnet public payout address",
    "Blocknet 메인넷 공개 보상 주소",
    "Blocknetメインネット公開報酬アドレス",
  ]),
};
export const bntEditorial = {
  title: l([
    "Blocknet BNT 监控：算力、Worker 与矿池支付",
    "Blocknet BNT 監控：算力、Worker 與礦池支付",
    "Blocknet BNT monitor: hashrate, Workers and pool payments",
    "Blocknet BNT 모니터: 해시레이트·Worker·풀 지급",
    "Blocknet BNT監視：ハッシュレート・Worker・プール支払",
  ]),
  summary: l([
    "查询 bntpool.com 的 BNT 算力、Worker、待成熟预估与累计支付。登录后保存多个地址。",
    "查詢 bntpool.com 的 BNT 算力、Worker、待成熟預估與累計支付。登入後儲存多個地址。",
    "Check BNT hashrate, Workers, immature estimates and paid totals on bntpool.com. Sign in to save multiple addresses.",
    "bntpool.com의 BNT 해시레이트·Worker·미성숙 예상 보상·누적 지급을 조회하고 여러 주소를 저장하세요.",
    "bntpool.comのBNTハッシュレート・Worker・未成熟推定額・累計支払を確認。ログインして複数アドレスを保存できます。",
  ]),
  identity: l([
    "这是采用 Argon2id 的 Blocknet BNT，不是 Bancor BNT 或 BLOCK。填写 Seine 配置中的完整主网公开收益地址；不支持短名称、私钥或助记词。只查询 bntpool.com，其他矿池和 solo 记录不在覆盖范围内。",
    "這是採用 Argon2id 的 Blocknet BNT，不是 Bancor BNT 或 BLOCK。填寫 Seine 設定中的完整主網公開收益地址；不支援短名稱、私鑰或助記詞。僅查詢 bntpool.com，不含其他池與 solo。",
    "This is Argon2id-based Blocknet BNT, not Bancor BNT or BLOCK. Enter the complete mainnet public payout address from Seine, not a shortname, private key or seed phrase. Coverage is bntpool.com only, excluding other pools and solo mining.",
    "Argon2id 기반 Blocknet BNT이며 Bancor BNT나 BLOCK이 아닙니다. Seine의 전체 메인넷 공개 보상 주소를 입력하세요. 짧은 이름·비밀키·복구 문구는 받지 않습니다. bntpool.com만 지원합니다.",
    "Argon2id方式のBlocknet BNTです。Bancor BNTやBLOCKとは異なります。Seineの完全なメインネット公開報酬アドレスを入力。短縮名・秘密鍵・復元フレーズは対象外で、bntpool.comのみ対応。",
  ]),
  coverage: l([
    "算力以 H/s 显示，Worker 活跃状态根据最近份额判断，不是设备心跳。待成熟预估、已确认待支付、排队支付与累计支付分别展示，不相加冒充日收益。上游金额按 1 BNT = 100,000,000 原子单位换算；当前没有可验证的日收益或美元报价，均保留未知。钱包金额不能分摊到单个 Worker。",
    "算力以 H/s 顯示，Worker 活躍以最近份額判斷，非設備心跳。待成熟預估、已確認待支付、排隊支付與累計支付分開，不冒充日收益。1 BNT = 100,000,000 原子單位；日收益與美元報價未取得時保留未知，錢包金額不分攤給 Worker。",
    "Hashrate is H/s; Worker activity comes from recent shares, not machine heartbeats. Immature estimates, confirmed unpaid, queued and paid balances stay separate and are never presented as daily income. Amounts use 100,000,000 atomic units per BNT. Unverified daily rewards and USD quotes remain unknown. Wallet amounts are not allocated to Workers.",
    "해시레이트는 H/s이며 Worker 활동은 최근 지분 기준으로 기기 하트비트가 아닙니다. 미성숙 예상·확정 미지급·지급 대기·지급 완료를 분리하고 일일 수익으로 합산하지 않습니다. 1 BNT는 100,000,000 원자 단위입니다. 미확인 일일 수익·USD 시세는 알 수 없는 값이며 Worker별 분배를 추정하지 않습니다.",
    "H/sで表示し、Worker活動は直近シェアから判断します。端末のハートビートではありません。未成熟推定・確定未払い・支払キュー・支払済みは分離し、日次収益に合算しません。1 BNTは100,000,000原子単位。日次報酬・USD価格の未確認値は不明のまま、Workerに配分しません。",
  ]),
};
