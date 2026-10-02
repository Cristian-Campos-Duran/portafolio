import Link from "next/link";
import type { ProjectCase } from "../site-data";

export function ProjectCard({ project }: { project: ProjectCase }) {
  return (
    <article className="project-card">
      <Link href={`/proyectos/${project.slug}`} aria-label={`Ver ${project.title}`}>
        <div className="project-card-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.imageAlt}
            width="1122"
            height="1402"
            loading={project.number === "01" ? "eager" : "lazy"}
          />
        </div>
        <div className="project-card-copy">
          <span>{project.number}</span>
          <div>
            <p>{project.category}</p>
            <h2>{project.title}</h2>
            <small>{project.summary}</small>
          </div>
          <b aria-hidden="true">↗</b>
        </div>
      </Link>
    </article>
  );
}

