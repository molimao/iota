import { guidesForProject } from "./site/project-guides";
import { QuietDetails } from "./simple-ui";
import { useLocale } from "./site/locale";
import { editorialCopy, projectQuestions } from "./project-editorial";
import { PROJECTS, type ProjectId } from "@/lib/projects";
import { PROJECT_CONTENT_DATES } from "@/lib/content-dates";
import { evidenceLabels } from "./site/core-evidence";
export function ProjectAbout({ project }: { project: ProjectId }) {
  const { locale } = useLocale(),
    c = editorialCopy(locale);
  const sourceLabels = {
    zh: ["项目或来源网站", "来源面板", "官方或来源说明"],
    "zh-TW": ["專案或來源網站", "來源面板", "官方或來源說明"],
    en: ["Project or source website", "Source dashboard", "Official or source guide"],
    ko: ["프로젝트 또는 출처 웹사이트", "출처 대시보드", "공식 또는 출처 안내"],
    ja: ["プロジェクト・出典サイト", "出典ダッシュボード", "公式・出典ガイド"],
  };
  const sourceLinks = [
    PROJECTS[project].website,
    PROJECTS[project].explorer,
    PROJECTS[project].guide,
  ];
  return (
    <QuietDetails title={c.about}>
      <div className="project-editorial">
        {projectQuestions(project, locale).map((q) => (
          <section key={q.question}>
            <h3>{q.question}</h3>
            <p>{q.answer}</p>
          </section>
        ))}
        {guidesForProject(project).map((a) => (
          <p key={a.slug}>
            <a href={`/${locale}/learn/${a.slug}`}>{a.title[locale]} →</a>
          </p>
        ))}
        <p>
          {sourceLinks.map(
            (url, i) =>
              sourceLinks.indexOf(url) === i && (
                <a key={url} href={url} target="_blank" rel="noreferrer">
                  {i > 0 ? " · " : ""}
                  {sourceLabels[locale][i]} ↗
                </a>
              ),
          )}
        </p>
        <p className="article-scope">
          {evidenceLabels.updated[locale]} ·{" "}
          <time dateTime={PROJECT_CONTENT_DATES[project]}>{PROJECT_CONTENT_DATES[project]}</time>
        </p>
      </div>
    </QuietDetails>
  );
}
