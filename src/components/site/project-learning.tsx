import { ArrowUpRight } from "lucide-react";
import type { ProjectId } from "@/lib/projects";
import { useLocale } from "./locale";
import { guidesForProject } from "./project-guides";
import { projectDepthGuides } from "./project-depth";
import { learningCopy } from "./guide-copy";

export function ProjectLearning({ project }: { project?: ProjectId }) {
  const { locale } = useLocale(),
    c = learningCopy[locale];
  const guides = guidesForProject(project);
  const anchor =
    project && (project !== "iota" || projectDepthGuides.some((guide) => guide.project === project))
      ? `#${project}`
      : "";
  return (
    <section className="project-learning" aria-labelledby="project-guides-title">
      <div className="project-section-head">
        <h2 id="project-guides-title">{c.guides}</h2>
        <a className="text-link" href={`/${locale}/learn${anchor}`}>
          {c.all} <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="learn-grid">
        {guides.map((a) => (
          <a key={a.slug} href={`/${locale}/learn/${a.slug}`}>
            <span>{a.topic[locale]}</span>
            <h3>
              {a.title[locale]} <ArrowUpRight size={17} />
            </h3>
            <p>{a.description[locale]}</p>
          </a>
        ))}
      </div>
      {project && ["iota", "xid", "quantus"].includes(project) && (
        <a className="project-compare-link" href={`/${locale}/learn/iota-xid-quantus-compared`}>
          {c.compare}: IOTA / XID / Quantus →
        </a>
      )}
    </section>
  );
}
