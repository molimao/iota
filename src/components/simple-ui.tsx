import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { SiteLocale } from "@/lib/site";

const copy = {
  zh: {
    help: "使用帮助",
    definitions: "数据说明",
    chooseProject: "选择项目，查看状态与收益。",
    independent: "独立监控工具 · 非项目官方服务",
    projectSummary: {
      iota: "训练状态与 IOTA 收益",
      xid: "Worker 算力与 XID 记录",
      quantus: "主网区块与 QTC 收益",
      flyai: "钱包月度算力积分",
      nosana: "节点任务与完成记录",
      gonka: "轮次参与、模型与权重",
    },
    pricing: "美元估值与来源",
    today: "今日 · 香港时间",
    total: "累计已记账",
  },
  "zh-TW": {
    help: "使用說明",
    definitions: "資料說明",
    chooseProject: "選擇專案，查看狀態與收益。",
    independent: "獨立監控工具 · 非專案官方服務",
    projectSummary: {
      iota: "訓練狀態與 IOTA 收益",
      xid: "Worker 算力與 XID 紀錄",
      quantus: "主網區塊與 QTC 收益",
      flyai: "錢包月度算力積分",
      nosana: "節點任務與完成紀錄",
      gonka: "輪次參與、模型與權重",
    },
    pricing: "美元估值與來源",
    today: "今日 · 香港時間",
    total: "累計已記帳",
  },
  en: {
    help: "Help",
    definitions: "About the data",
    chooseProject: "Choose a project to view status and earnings.",
    independent: "Independent monitor · Not an official project service",
    projectSummary: {
      iota: "Training status and IOTA rewards",
      xid: "Worker hashrate and XID records",
      quantus: "Mainnet blocks and QTC rewards",
      flyai: "Monthly compute points by wallet",
      nosana: "Node jobs and completed tasks",
      gonka: "Epoch participation, models and weight",
    },
    pricing: "USD estimate and source",
    today: "Today · Hong Kong time",
    total: "Lifetime recorded rewards",
  },
  ko: {
    help: "도움말",
    definitions: "데이터 안내",
    chooseProject: "프로젝트를 선택해 상태와 수익을 확인하세요.",
    independent: "독립 모니터링 도구 · 프로젝트 공식 서비스 아님",
    projectSummary: {
      iota: "학습 상태 및 IOTA 보상",
      xid: "워커 해시레이트 및 XID 기록",
      quantus: "메인넷 블록 및 QTC 보상",
      flyai: "지갑별 월간 컴퓨팅 포인트",
      nosana: "노드 작업과 완료 기록",
      gonka: "에포크 참여·모델·가중치",
    },
    pricing: "USD 환산 및 출처",
    today: "오늘 · 홍콩 시간",
    total: "누적 기록 보상",
  },
  ja: {
    help: "ヘルプ",
    definitions: "データについて",
    chooseProject: "プロジェクトを選んで状態と収益を確認。",
    independent: "独立したモニター · 各プロジェクトの公式サービスではありません",
    projectSummary: {
      iota: "学習状態と IOTA 報酬",
      xid: "ワーカーのハッシュレートと XID 記録",
      quantus: "メインネットのブロックと QTC 報酬",
      flyai: "ウォレット別の月間計算ポイント",
      nosana: "ノードのジョブと完了記録",
      gonka: "エポック参加・モデル・重み",
    },
    pricing: "USD 換算とデータソース",
    today: "本日 · 香港時間",
    total: "累計記帳済み報酬",
  },
};
export const simpleCopy = (locale: SiteLocale) => copy[locale];

export function QuietDetails({
  title,
  children,
  open,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="quiet-details" open={open}>
      <summary>
        {title}
        <ChevronDown size={15} aria-hidden="true" />
      </summary>
      <div className="quiet-details-content">{children}</div>
    </details>
  );
}
