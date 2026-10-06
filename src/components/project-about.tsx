import { guidesForProject } from "./site/project-guides";
import { QuietDetails } from "./simple-ui";
import { useLocale } from "./site/locale";
import { editorialCopy, projectQuestions, projectEditorial } from "./project-editorial";
import { PROJECTS, type ProjectId } from "@/lib/projects";
import { projectsCopy } from "./projects-copy";
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
      </div>
    </QuietDetails>
  );
}
export function IotaProjectPage() {
  const { locale } = useLocale(),
    p = projectEditorial.iota,
    c = projectsCopy[locale];
  return (
    <main id="main" className="projects-page">
      <header className="project-heading">
        <div>
          <h1>IOTA · Train at Home</h1>
          <p>{p.summary[locale]}</p>
        </div>
      </header>
      <a className="button primary" href={`/${locale}/app`}>
        {c.open} →
      </a>
      <ProjectAbout project="iota" />
    </main>
  );
}
