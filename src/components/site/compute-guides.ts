import type { Article } from "./articles";
import { projectEditorial, editorialCopy, projectQuestions } from "../project-editorial";
import { LOCALES, type SiteLocale } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
const localized = <T>(f: (locale: SiteLocale) => T) =>
  Object.fromEntries(LOCALES.map((l) => [l, f(l)])) as Record<SiteLocale, T>;
const workflow = {
  zh: "先在官方页面核对公开标识，再到项目页查询。需要持续查看时，在设备总览中添加设备并关联该项目。设备名称只用于整理列表，不会证明不同项目中的标识属于同一台物理设备。",
  en: "Verify the public identifier in the official dashboard, then look it up on the project page. To follow it regularly, add a device in Devices and link the project. A device name organizes your list; it does not prove that identifiers from different projects belong to one physical machine.",
  "zh-TW":
    "先在官方頁面核對公開標識，再到專案頁查詢。需要持續查看時，在設備總覽新增設備並關聯專案。設備名稱只用來整理清單，不代表不同專案的標識屬於同一台實體設備。",
  ko: "공식 화면에서 공개 식별자를 확인한 후 프로젝트 페이지에서 조회하세요. 계속 확인하려면 기기 목록에 기기를 추가하고 프로젝트를 연결하세요. 기기 이름은 목록 정리용이며 서로 다른 프로젝트의 식별자가 같은 물리 기기에 속한다는 증거가 아닙니다.",
  ja: "公式画面で公開IDを確認し、プロジェクトページで照会します。継続して確認する場合はデバイス一覧に追加し、プロジェクトを紐付けます。デバイス名は整理用であり、複数プロジェクトのIDが同じ実機に属する証明にはなりません。",
};
const troubleshooting = {
  zh: "查不到数据时，先检查标识类型和拼写，再比较官方页面的数据覆盖范围。查询失败或旧数据不等于零收益，也不等于设备离线。这里不能启动任务、修改官方账户或保证接到工作。",
  en: "If a lookup has no data, check the identifier type and spelling, then compare coverage with the official dashboard. A failed request or stale data means neither zero earnings nor an offline device. This monitor cannot start jobs, change your official account, or guarantee work.",
  "zh-TW":
    "查不到資料時，先檢查標識類型和拼寫，再比較官方頁面的資料範圍。查詢失敗或舊資料不等於零收益，也不等於設備離線。本站無法啟動任務、修改官方帳戶或保證工作分配。",
  ko: "데이터가 없으면 식별자 종류와 철자를 확인하고 공식 화면의 조회 범위와 비교하세요. 요청 실패나 오래된 데이터가 수익 0 또는 기기 오프라인을 뜻하지는 않습니다. 이 서비스는 작업 시작, 공식 계정 변경, 작업 배정을 보장하지 않습니다.",
  ja: "データがない場合はIDの種類と綴りを確認し、公式画面の対象範囲と比べます。取得失敗や古いデータは収益ゼロやオフラインを意味しません。このサービスからジョブを開始したり、公式アカウントを変更したり、仕事の割り当てを保証することはできません。",
};
export const computeGuides: Article[] = (
  ["flyai", "nosana", "gonka", "akash", "ionet", "vast", "golem"] as const
).map((project) => {
  const p = projectEditorial[project];
  return {
    slug: `${project}-monitor-guide`,
    project,
    published: "2026-10-06",
    modified: "2026-10-06",
    title: p.title,
    description: p.summary,
    summary: p.summary,
    topic: localized((l) => editorialCopy(l).guide),
    body: localized((l) => [
      p.identity[l],
      workflow[l],
      p.coverage[l],
      troubleshooting[l],
      `[${PROJECTS[project].name}](/projects/${project}) · [${editorialCopy(l).guide}](${PROJECTS[project].guide})`,
    ]),
    questions: localized((l) => projectQuestions(project, l)),
    sources: [
      { name: PROJECTS[project].name, url: PROJECTS[project].guide },
      ...(project === "nosana"
        ? [{ name: "Nosana API", url: "https://api.nosana.com/api/docs" }]
        : project === "gonka"
          ? [{ name: "Gonka Network Node API", url: PROJECTS.gonka.explorer }]
          : []),
    ],
    related: ["data-sources-and-freshness"],
  };
});
