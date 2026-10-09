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
        <a href={PROJECTS[project].guide} target="_blank" rel="noreferrer">
          {c.guide} ↗
        </a>
        <p className="article-scope">
          {evidenceLabels.updated[locale]} ·{" "}
          <time dateTime={PROJECT_CONTENT_DATES[project]}>{PROJECT_CONTENT_DATES[project]}</time>
        </p>
      </div>
    </QuietDetails>
  );
}
