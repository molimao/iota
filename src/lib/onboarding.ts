import { localized } from "./product-discovery";
import { isPrivatePlatform } from "./platforms";
import type { ProjectId } from "./projects";
export const onboardingCopy = {
  lookup: localized([
    "查看 IOTA 状态",
    "查看 IOTA 狀態",
    "Check IOTA status",
    "IOTA 상태 확인",
    "IOTAの状態を確認",
  ]),
  devices: localized(["我的设备", "我的設備", "My devices", "내 기기", "マイデバイス"]),
  sample: localized([
    "监控示例",
    "監控範例",
    "Monitoring example",
    "모니터링 예시",
    "監視のサンプル",
  ]),
  sampleNote: localized([
    "演示数据 · 非实时",
    "示範資料 · 非即時",
    "Sample data · Not live",
    "예시 데이터 · 실시간 아님",
    "サンプルデータ・リアルタイムではありません",
  ]),
  daily: localized([
    "今日记账收益",
    "今日記帳收益",
    "Today's recorded rewards",
    "오늘 기록된 보상",
    "本日の記帳報酬",
  ]),
  training: localized(["训练中", "訓練中", "Training", "학습 중", "学習中"]),
  mining: localized(["挖矿中", "挖礦中", "Mining", "채굴 중", "採掘中"]),
  public: localized([
    "公开 ID 查询",
    "公開 ID 查詢",
    "Public ID lookup",
    "공개 ID 조회",
    "公開IDで照会",
  ]),
  private: localized([
    "需登录并连接账户",
    "需登入並連接帳戶",
    "Sign in and connect an account",
    "로그인 및 계정 연결 필요",
    "ログインとアカウント接続が必要",
  ]),
  quota: localized([
    "每项目免费 5 台",
    "每專案免費 5 台",
    "5 free devices per project",
    "프로젝트당 무료 5대",
    "各プロジェクト5台まで無料",
  ]),
  proQuota: localized([
    "Pro · 每项目 50 台",
    "Pro · 每專案 50 台",
    "Pro · 50 devices per project",
    "Pro · 프로젝트당 50대",
    "Pro・各プロジェクト50台",
  ]),
  plans: localized(["查看套餐", "查看方案", "View plans", "요금제 보기", "プランを見る"]),
  idHelp: localized([
    "如何获取 ID？",
    "如何取得 ID？",
    "Where to find the ID",
    "ID 확인 방법",
    "IDの確認方法",
  ]),
  privateNote: localized([
    "填写平台设备 ID，查询数据前需连接对应账户。",
    "填寫平台設備 ID，查詢資料前需連接對應帳戶。",
    "Enter the platform's device ID and connect its account to query data.",
    "플랫폼 기기 ID를 입력하고 데이터를 조회하려면 계정을 연결하세요.",
    "プラットフォームのデバイスIDを入力し、照会するには対応アカウントを接続します。",
  ]),
  save: localized([
    "保存到我的设备",
    "儲存至我的設備",
    "Save to my devices",
    "내 기기에 저장",
    "マイデバイスに保存",
  ]),
  lookupNote: localized([
    "本次查询不会添加设备。",
    "此次查詢不會新增設備。",
    "This lookup does not add a device.",
    "조회만으로 기기를 추가하지 않습니다.",
    "この照会ではデバイスは追加されません。",
  ]),
  invalid: localized([
    "请输入有效的公开 Miner ID。",
    "請輸入有效的公開 Miner ID。",
    "Enter a valid public Miner ID.",
    "유효한 공개 Miner ID를 입력하세요.",
    "有効な公開Miner IDを入力してください。",
  ]),
};
export function projectAccess(project: ProjectId) {
  return isPrivatePlatform(project) ? "private" : "public";
}
export function projectHelpPath(locale: string, project: ProjectId) {
  const slug =
    project === "iota"
      ? "find-miner-id"
      : project === "xid"
        ? "xid-worker-hashrate-shares"
        : project === "quantus"
          ? "quantus-wormhole-rewards"
          : `${project}-monitor-guide`;
  return `/${locale}/learn/${slug}`;
}
