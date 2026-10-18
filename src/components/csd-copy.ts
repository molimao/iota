import { localized as l } from "@/lib/product-discovery";
export const csdLabels = {
  address: l([
    "CSD 公开收益地址（addr20）",
    "CSD 公開收益地址（addr20）",
    "CSD public payout address (addr20)",
    "CSD 공개 보상 주소 (addr20)",
    "CSD公開報酬アドレス（addr20）",
  ]),
  pending: l([
    "确认中金额",
    "確認中金額",
    "Awaiting confirmations",
    "확인 중인 금액",
    "承認待ち金額",
  ]),
  rate: l([
    "近 1 小时平均算力",
    "近 1 小時平均算力",
    "1-hour average hashrate",
    "최근 1시간 평균 해시레이트",
    "直近1時間の平均ハッシュレート",
  ]),
};
export const csdEditorial = {
  title: l([
    "CSD 监控：G-pools 算力、Worker 与支付",
    "CSD 監控：G-pools 算力、Worker 與支付",
    "CSD monitor: G-pools hashrate, Workers and payments",
    "CSD 모니터: G-pools 해시레이트·Worker·지급",
    "CSD監視：G-poolsハッシュレート・Worker・支払",
  ]),
  summary: l([
    "使用 Compute Substrate 公开收益地址查看 G-pools 算力、Worker、未支付余额和累计支付。登录后可保存多个地址。",
    "用 Compute Substrate 公開收益地址查看 G-pools 算力、Worker、未支付餘額與累計支付，登入後儲存多個地址。",
    "Check Compute Substrate hashrate, Workers, unpaid balance and total paid on G-pools. Sign in to save multiple payout addresses.",
    "Compute Substrate 공개 주소로 G-pools 해시레이트·Worker·미지급 잔액·누적 지급을 조회하고 여러 주소를 저장하세요.",
    "Compute Substrateの公開アドレスでG-poolsのハッシュレート・Worker・未払い残高・累計支払を確認。複数アドレスを保存できます。",
  ]),
  identity: l([
    "填写挖矿配置中的 40 位十六进制 addr20，允许 0x 前缀，保存时统一为小写且去掉前缀。不接受助记词、私钥或 RPC 地址。当前只接入 G-pools（csd.yamaduo.no），其他矿池和 solo 地址不在覆盖范围内。",
    "填寫 40 位十六進位 addr20，允許 0x 前綴，儲存時統一小寫且去掉前綴。不收助記詞、私鑰或 RPC 地址。目前僅 G-pools（csd.yamaduo.no），不含其他池或 solo。",
    "Use the 40-hex addr20 from your miner. An optional 0x prefix is accepted; saved addresses are lowercase without the prefix. Never enter a seed, private key or RPC URL. Coverage is G-pools (csd.yamaduo.no) only, not other pools or solo mining.",
    "채굴기의 40자리 16진수 addr20을 입력하세요. 0x는 선택이며 저장 시 접두사 없는 소문자로 통일합니다. 복구 문구·비밀키·RPC URL은 받지 않습니다. G-pools(csd.yamaduo.no)만 지원합니다.",
    "採掘設定の40桁16進addr20を入力。任意の0xは保存時に除去し、小文字に統一します。復元フレーズ・秘密鍵・RPC URLは不要。G-pools(csd.yamaduo.no)のみ対応します。",
  ]),
  coverage: l([
    "算力采用矿池近 1 小时平均值，单位 H/s。Worker 活跃根据最近份额判断，不是本机心跳。未支付余额、确认中金额和累计支付分别显示；上游 *_sat 字段按 1 CSD = 100,000,000 单位换算。矿池网页的时段收益包含未支付余额分摊估算，不能当成准确日收益，本监控不据此填写每日收益或美元估值。钱包金额也不分摊到 Worker。",
    "算力為近 1 小時平均 H/s，Worker 活躍依最近份額，非本機心跳。未支付、確認中與累計支付分開；1 CSD = 100,000,000 個上游 *_sat 單位。礦池時段收益含餘額分攤估算，不能視為準確日收益，故不填入每日收益或美元估值，也不將錢包金額分給 Worker。",
    "Hashrate is the pool's 1-hour average in H/s. Worker activity uses recent shares, not host heartbeats. Unpaid, confirming and lifetime-paid amounts stay separate; 100,000,000 upstream *_sat units equal 1 CSD. The pool's windowed income apportions unpaid balances and is an estimate, not an exact daily ledger. We do not turn it into daily earnings, invent USD prices, or allocate wallet balances to Workers.",
    "해시레이트는 H/s 단위 1시간 평균이며 Worker 상태는 최근 지분 기준입니다. 미지급·확인 중·누적 지급을 분리하고 *_sat 100,000,000 단위를 1 CSD로 환산합니다. 풀의 기간 수익에는 잔액 배분 추정치가 포함되어 정확한 일일 장부가 아닙니다. 일일 수익·USD 가격·Worker별 지갑 분배를 추정하지 않습니다.",
    "H/s単位の1時間平均で、Worker活動は直近シェア基準です。未払い・承認待ち・累計支払を分離し、*_satの100,000,000単位を1 CSDに換算します。プールの期間収益は未払い残高の按分推定を含み、正確な日次台帳ではありません。日次収益・USD価格・Worker別配分は推定しません。",
  ]),
};
