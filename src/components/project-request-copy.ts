import type { SiteLocale } from "@/lib/site";
const labels = {
  privacy: [
    "项目接入申请会保存账号标识、项目名称、官网链接和需求说明，用于评估接入；每个账号每天限一次。",
    "Project requests store your account ID, project name, official URL and description for integration review. Each account may submit once a day.",
    "專案接入申請會儲存帳號識別碼、專案名稱、官網連結和需求說明，用於評估接入；每個帳號每天限一次。",
    "프로젝트 요청에는 계정 ID, 프로젝트 이름, 공식 URL과 설명이 저장되며 연동 검토에 사용됩니다. 계정당 하루 한 번 제출할 수 있습니다.",
    "プロジェクト申請では、連携の検討のためにアカウントID、プロジェクト名、公式URL、説明を保存します。送信は1アカウントにつき1日1回です。",
  ],
  open: [
    "申请接入项目",
    "Request a project",
    "申請接入專案",
    "프로젝트 추가 요청",
    "プロジェクト追加を申請",
  ],
  title: [
    "申请接入挖矿项目",
    "Request project monitoring",
    "申請接入挖礦專案",
    "프로젝트 모니터링 요청",
    "プロジェクトの監視を申請",
  ],
  name: ["项目名称", "Project name", "專案名稱", "프로젝트 이름", "プロジェクト名"],
  url: [
    "官网或 GitHub 链接",
    "Official website or GitHub URL",
    "官網或 GitHub 連結",
    "공식 웹사이트 또는 GitHub URL",
    "公式サイトまたは GitHub のURL",
  ],
  description: [
    "希望查看哪些数据（选填）",
    "What would you like to monitor? (optional)",
    "希望查看哪些資料（選填）",
    "확인하고 싶은 데이터 (선택)",
    "確認したいデータ（任意）",
  ],
  placeholder: [
    "设备状态、任务记录、收益等",
    "Device status, jobs, rewards…",
    "設備狀態、任務紀錄、收益等",
    "기기 상태, 작업 기록, 수익 등",
    "デバイスの状態、ジョブ、収益など",
  ],
  limit: [
    "每个账号每天一次，按香港时间计算。",
    "One request per account per day, using Hong Kong time.",
    "每個帳號每天一次，以香港時間計算。",
    "계정당 하루 한 번, 홍콩 시간 기준입니다.",
    "1アカウントにつき1日1回、香港時間を基準にします。",
  ],
  signin: ["登录后提交", "Sign in to submit", "登入後提交", "로그인 후 제출", "ログインして申請"],
  checking: [
    "读取提交状态…",
    "Checking submission status…",
    "讀取提交狀態…",
    "제출 상태 확인 중…",
    "申請状況を確認中…",
  ],
  submit: ["提交申请", "Submit request", "提交申請", "요청 제출", "申請を送信"],
  busy: ["提交中…", "Submitting…", "提交中…", "제출 중…", "送信中…"],
  success: ["已提交", "Request submitted", "已提交", "제출 완료", "送信しました"],
  used: [
    "今天已提交，可在香港时间明日 00:00 后再次提交。",
    "You have submitted today. You can submit again after midnight Hong Kong time.",
    "今天已提交，可於香港時間明日 00:00 後再次提交。",
    "오늘 이미 제출했습니다. 홍콩 시간 자정 이후 다시 제출할 수 있습니다.",
    "本日は申請済みです。香港時間の翌日0時以降に再度申請できます。",
  ],
  failed: [
    "暂时无法提交，请稍后重试。",
    "Unable to submit. Please try again shortly.",
    "暫時無法提交，請稍後重試。",
    "제출할 수 없습니다. 잠시 후 다시 시도하세요.",
    "送信できませんでした。しばらくしてから再試行してください。",
  ],
  invalidName: [
    "请输入 1–80 字的纯文本项目名称。",
    "Enter a plain-text project name, 1–80 characters.",
    "請輸入 1–80 字的純文字專案名稱。",
    "프로젝트 이름을 일반 텍스트 1–80자로 입력하세요.",
    "プロジェクト名を1～80文字のプレーンテキストで入力してください。",
  ],
  invalidUrl: [
    "请输入公开的 HTTPS 官网或 GitHub 链接，不含登录信息、查询参数或片段。",
    "Enter a public HTTPS website or GitHub URL without credentials, query parameters or fragments.",
    "請輸入公開的 HTTPS 官網或 GitHub 連結，不含登入資訊、查詢參數或片段。",
    "인증 정보, 쿼리 매개변수, 프래그먼트가 없는 공개 HTTPS URL을 입력하세요.",
    "認証情報、クエリ、フラグメントを含まない公開HTTPS URLを入力してください。",
  ],
  invalidDescription: [
    "需求限 1000 字纯文本，请勿填写 HTML 或控制字符。",
    "Use plain text, up to 1,000 characters, without HTML or control characters.",
    "需求限 1000 字純文字，請勿填寫 HTML 或控制字元。",
    "HTML이나 제어 문자 없이 일반 텍스트를 1,000자 이내로 입력하세요.",
    "HTMLや制御文字を含まない1,000文字以内のプレーンテキストで入力してください。",
  ],
  preview: [
    "设计预览，不会提交真实申请。",
    "Preview only. No request will be sent.",
    "設計預覽，不會提交真實申請。",
    "미리보기입니다. 실제 요청은 제출되지 않습니다.",
    "プレビューです。実際の申請は送信されません。",
  ],
  close: ["关闭", "Close", "關閉", "닫기", "閉じる"],
} as const;
export function projectRequestCopy(locale: SiteLocale) {
  const i = { zh: 0, en: 1, "zh-TW": 2, ko: 3, ja: 4 }[locale];
  return Object.fromEntries(Object.entries(labels).map(([k, v]) => [k, v[i]])) as {
    [K in keyof typeof labels]: string;
  };
}
