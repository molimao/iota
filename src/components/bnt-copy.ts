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
    "Worker 状态按最近份额判断。待成熟、待支付和已支付分别列出；日收益与美元报价暂不可用。",
    "Worker 狀態依最近份額判斷。待成熟、待支付及已支付分開列出；日收益與美元報價暫不可用。",
    "Worker status is based on recent shares. Immature, unpaid and paid amounts are shown separately; daily rewards and USD quotes are unavailable.",
    "Worker 상태는 최근 셰어 기준입니다. 미성숙·미지급·지급액을 따로 표시하며 일일 수익과 USD 시세는 제공되지 않습니다.",
    "Worker状態は直近シェアに基づきます。未成熟・未払い・支払済みは別に表示し、日次収益とUSD価格は未提供です。",
  ]),
};
