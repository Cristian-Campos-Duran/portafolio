import Link from "next/link";
import type { ProjectCase } from "../site-data";
import { projectBySlug } from "../site-data";
import { AnimatedCounter } from "./animated-counter";
import { BackButton } from "./back-button";
import { CaseEvidence } from "./case-evidence";
import { CaseSectionNav, type CaseNavItem } from "./case-section-nav";
import { InternalShell } from "./internal-shell";

const caseNavigation: CaseNavItem[] = [
  { id: "contexto", number: "01", label: "Contexto" },
  { id: "participacion", number: "02", label: "Participación" },
  { id: "proceso", number: "03", label: "Proceso" },
  { id: "evidencia", number: "04", label: "Evidencia" },
  { id: "resultado", number: "05", label: "Resultado" },
];

export function CaseStudy({ project }: { project: ProjectCase }) {
  const previousProject = projectBySlug(project.previousSlug);
  const nextProject = projectBySlug(project.nextSlug);

  return (
    <InternalShell>
      <article className="case-study">
        <div className="case-utility section-frame">
          <BackButton />
          <span>{project.number} / 04</span>
        </div>

        <header className="case-hero section-frame">
          <div className="case-heading">
            <p className="section-kicker">
              <span>{project.number}</span> Caso de estudio
            </p>
            <h1>{project.title}</h1>
            <p className="case-lead">{project.heroLead}</p>
            <div className="case-facts">
              <span>{project.category}</span>
              {project.period && <span>{project.period}</span>}
            </div>
          </div>
          <div className="case-hero-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.imageAlt}
              width="1122"
              height="1402"
              loading="eager"
            />
            <span aria-hidden="true">Abrir visual / {project.number}</span>
          </div>
        </header>

        <CaseSectionNav items={caseNavigation} />

        <section
          id="contexto"
          className="case-overview section-frame case-anchor-section"
          aria-labelledby="case-context-title"
        >
          <p className="section-index">01 / Contexto</p>
          <div>
            <h2 id="case-context-title">El punto de partida</h2>
            <p>{project.context}</p>
          </div>
          <div>
            <h3>Objetivo</h3>
            <p>{project.objective}</p>
          </div>
        </section>

        <section
          id="participacion"
          className="case-role section-frame case-anchor-section"
          aria-labelledby="case-role-title"
        >
          <p className="section-index">02 / Mi participación</p>
          <div>
            <h2 id="case-role-title">Responsabilidades</h2>
            <ul className="editorial-list">
              {project.participation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="proceso"
          className="case-process section-frame case-anchor-section"
          aria-labelledby="case-process-title"
        >
          <div className="section-title-row">
            <p className="section-index">03 / Decisiones y proceso</p>
            <h2 id="case-process-title">Una secuencia clara</h2>
          </div>
          <div className={`process-grid ${project.process.length === 4 ? "is-four" : ""}`}>
            {project.process.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          {project.slug === "amared" && (
            <div className="amared-system" aria-labelledby="amared-system-title">
              <div>
                <p className="section-index">Profundizar</p>
                <h3 id="amared-system-title">Sistema interno</h3>
                <p>
                  La capa técnica aparece después de comprender el contexto, la
                  identidad y la experiencia principal.
                </p>
              </div>
              <div className="deep-dive-list">
                <details>
                  <summary>
                    Operación <span>Pagos · inventario · producción</span>
                  </summary>
                  <p>
                    Organización de pagos, inventario, recetas, cocina, compras,
                    perfiles y entregas como partes relacionadas de la operación.
                  </p>
                </details>
                <details>
                  <summary>
                    Implementación <span>Web · automatización · datos</span>
                  </summary>
                  <p>
                    Interfaz construida con HTML, CSS y JavaScript, apoyada por
                    Cloudflare Worker, Apps Script y Google Sheets.
                  </p>
                </details>
              </div>
            </div>
          )}
        </section>

        <CaseEvidence project={project} />

        <section
          id="resultado"
          className="case-result-section section-frame case-anchor-section"
          aria-labelledby="case-result-title"
        >
          {project.metrics && (
            <div className="case-metrics">
              <div className="section-title-row">
                <p className="section-index">05 / Resultados</p>
                <div>
                  <h2 id="case-result-title">Respuesta orgánica</h2>
                  <p>
                    Las cifras se animan una sola vez cuando entran en pantalla y
                    respetan la preferencia de movimiento reducido.
                  </p>
                </div>
              </div>
              <div className="metrics-grid">
                {project.metrics.map((metric) => (
                  <AnimatedCounter
                    key={metric.label}
                    target={metric.target}
                    decimals={metric.decimals}
                    suffix={metric.suffix}
                    finalValue={metric.value}
                    label={metric.label}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="case-conclusion">
            <div>
              <p className="section-index">Resultado</p>
              <h2 id={project.metrics ? undefined : "case-result-title"}>
                Una solución coherente
              </h2>
              <p>{project.result}</p>
            </div>
            <div>
              <p className="section-index">Herramientas</p>
              <ul className="tool-list">
                {project.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
            {project.learning && (
              <blockquote>
                <span>Aprendizaje</span>
                {project.learning}
              </blockquote>
            )}
          </div>
        </section>

        <nav className="case-project-navigation section-frame" aria-label="Otros proyectos">
          {previousProject && (
            <Link href={`/proyectos/${previousProject.slug}`} rel="prev">
              <span>← Proyecto anterior</span>
              <strong>{previousProject.title}</strong>
            </Link>
          )}
          {nextProject && (
            <Link href={`/proyectos/${nextProject.slug}`} rel="next">
              <span>Proyecto siguiente →</span>
              <strong>{nextProject.title}</strong>
            </Link>
          )}
        </nav>

        <section className="case-contact section-frame">
          <p>¿Quieres conversar sobre una pieza o un proyecto?</p>
          <Link href="/contacto">Contactar <span aria-hidden="true">→</span></Link>
        </section>
      </article>
    </InternalShell>
  );
}
