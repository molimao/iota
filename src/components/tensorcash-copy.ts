import { localized as l } from "@/lib/product-discovery";
export const tscCopy = {
  title: l([
    "TensorCash 钱包监控：TSC 链上余额",
    "TensorCash 錢包監控：TSC 鏈上餘額",
    "TensorCash wallet monitor: on-chain TSC balance",
    "TensorCash 지갑 모니터: 온체인 TSC 잔액",
    "TensorCashウォレット監視：TSCオンチェーン残高",
  ]),
  summary: l([
    "保存多个 tc1 地址，查看已确认的 TSC 余额。",
    "保存多個 tc1 地址，查看已確認的 TSC 餘額。",
    "Save multiple tc1 addresses and check confirmed TSC balances.",
    "여러 tc1 주소를 저장하고 확정된 TSC 잔액을 확인하세요.",
    "複数のtc1アドレスを保存し、確定済みTSC残高を確認します。",
  ]),
  identity: l([
    "填写 tc1 开头的主网公开收款地址。",
    "填寫 tc1 開頭的主網公開收款地址。",
    "Use a mainnet public payout address beginning tc1.",
    "tc1로 시작하는 메인넷 공개 수령 주소를 입력하세요.",
    "tc1で始まるメインネットの公開受取アドレスを入力します。",
  ]),
  coverage: l([
    "读取官方 Chain API 的已确认余额。余额包含转入和转出，不等于挖矿收益；矿池未支付余额、Worker 和本机在线状态不在链上接口中。",
    "讀取官方 Chain API 的已確認餘額。餘額包含轉入及轉出，不等於挖礦收益；礦池未支付餘額、Worker 與本機在線狀態不在鏈上介面中。",
    "Confirmed balances come from the official Chain API. Transfers and spending affect balances, so they are not mining earnings. This API does not report unpaid pool balances, Workers or device uptime.",
    "공식 Chain API의 확정 잔액입니다. 입출금이 반영되므로 채굴 수익과 다릅니다. 미지급 풀 잔액, Worker 및 기기 가동 상태는 제공되지 않습니다.",
    "公式Chain APIの確定残高です。送受金を含むため採掘収益とは異なります。未払い報酬、Worker、端末稼働状態は提供されません。",
  ]),
  confirmed: l([
    "链上已确认余额",
    "鏈上已確認餘額",
    "Confirmed on-chain balance",
    "온체인 확정 잔액",
    "確定済みオンチェーン残高",
  ]),
  pending: l([
    "待确认净变化",
    "待確認淨變化",
    "Pending net change",
    "미확정 순변동",
    "未確定の純増減",
  ]),
  explorer: l([
    "区块浏览器核对",
    "區塊瀏覽器核對",
    "Verify in explorer",
    "탐색기에서 확인",
    "エクスプローラーで確認",
  ]),
  mac: l([
    "Mac 参与说明：官方提供 Metal 路线；不同矿池对客户端、模型和凭证有各自要求，源码可运行不代表矿池已接受任务。",
    "Mac 參與說明：官方提供 Metal 路線；不同礦池對客戶端、模型及憑證有各自要求，源碼可執行不代表礦池已接受任務。",
    "Mac: the official guide includes Metal. Each pool has its own client, model and credential requirements; running the code does not confirm pool acceptance.",
    "Mac: 공식 문서는 Metal을 안내합니다. 풀별 클라이언트, 모델, 인증 조건이 달라 코드 실행만으로 풀 승인이 확인되지는 않습니다.",
    "Mac：公式ガイドにMetal経路があります。プールごとにクライアント・モデル・認証条件が異なり、実行だけでは受付を確認できません。",
  ]),
};
export const tscEditorial = {
  title: tscCopy.title,
  summary: tscCopy.summary,
  identity: tscCopy.identity,
  coverage: tscCopy.coverage,
};
