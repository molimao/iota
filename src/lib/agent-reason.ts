import { z } from "zod";
import { localized as l } from "./product-discovery";
export const agentReasonSchema=z.object({
 code:z.enum(["registration_pending","registration_failed","registration_expired","kicked","resetting","reset_loop","api_dns","api_unreachable","worker_crashed"]),
 observedAt:z.string().datetime({offset:true}),
}).strict();
export const agentReasonCopy={
 registration_pending:l(["等待层分配","等待層分配","Waiting for a layer","레이어 배정 대기","レイヤー割り当て待ち"]),
 registration_failed:l(["注册失败","註冊失敗","Registration failed","등록 실패","登録失敗"]),
 registration_expired:l(["注册已失效","註冊已失效","Registration expired","등록 만료","登録失効"]),
 kicked:l(["被项目移出","被專案移出","Removed by the project","프로젝트에서 제외됨","プロジェクトから除外"]),
 resetting:l(["重新注册中","重新註冊中","Re-registering","재등록 중","再登録中"]),
 reset_loop:l(["反复重置","反覆重設","Repeated resets","반복 초기화","リセットを反復"]),
 api_dns:l(["项目域名解析失败","專案網域解析失敗","Project DNS lookup failed","프로젝트 DNS 조회 실패","プロジェクトのDNS解決に失敗"]),
 api_unreachable:l(["项目接口连接失败","專案介面連線失敗","Project API unreachable","프로젝트 API 연결 실패","プロジェクトAPIに接続不可"]),
 worker_crashed:l(["训练进程崩溃","訓練程序崩潰","Training process crashed","학습 프로세스 충돌","学習プロセスがクラッシュ"]),
};
