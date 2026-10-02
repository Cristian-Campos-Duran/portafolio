"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { projects } from "../site-data";

function rememberReturn(path: string) {
  try { sessionStorage.setItem("portfolio:returnTo", JSON.stringify({ path, timestamp: Date.now() })); } catch {}
}

export function ProjectExplorer({ returnTo = "/proyectos" }: { returnTo?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const active = projects[activeIndex];

  const selectProject = (index: number) => {
    setActiveIndex(index);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % projects.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + projects.length) % projects.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = projects.length - 1;
    else return;
    event.preventDefault();
    selectProject(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="project-screen-explorer">
      <div className="project-screen-content" role="tabpanel" id="project-screen-panel" aria-labelledby={`project-tab-${active.number}`}>
        <div ref={contentRef} className="project-screen-copy">
          <p className="section-kicker"><span>{active.number}</span> {active.category}</p>
          <h1>{active.title}</h1>
          <p className="project-screen-summary">{active.heroLead}</p>
          <div className="project-screen-details">
            <div><span>Contexto</span><p>{active.context}</p></div>
            <div><span>Participación</span><p>{active.participation.slice(0, 4).join(" · ")}</p></div>
          </div>
          <Link className="screen-primary-link" href={`/proyectos/${active.slug}`} onClick={() => rememberReturn(returnTo)}>Ver caso completo <span aria-hidden="true">→</span></Link>
        </div>
        <Link className="project-screen-visual" href={`/proyectos/${active.slug}`} onClick={() => rememberReturn(returnTo)} aria-label={`Abrir caso ${active.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}<img key={`primary-${active.image}`} className="project-screen-primary" src={active.image} alt={active.imageAlt} />
          {/* eslint-disable-next-line @next/next/no-img-element */}<img key={`support-${active.showcaseVisuals[0].src}`} className="project-screen-support" src={active.showcaseVisuals[0].src} alt={active.showcaseVisuals[0].alt} />
          <span className="project-screen-open">Abrir caso ↗</span>
        </Link>
      </div>
      <div className="project-screen-tabs" role="tablist" aria-label="Seleccionar proyecto">
        {projects.map((project, index) => (
          <button key={project.number} ref={(node) => { tabRefs.current[index] = node; }} id={`project-tab-${project.number}`} type="button" role="tab" aria-selected={activeIndex === index} aria-controls="project-screen-panel" tabIndex={activeIndex === index ? 0 : -1} onClick={() => selectProject(index)} onKeyDown={(event) => onKeyDown(event, index)}><span>{project.number}</span><b>{project.shortTitle}</b></button>
        ))}
      </div>
    </div>
  );
}
