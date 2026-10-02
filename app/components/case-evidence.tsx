import type { ProjectCase } from "../site-data";

const evidenceTitles: Record<string, { title: string; text: string }> = {
  "buena-edicion": {
    title: "Antes, montaje y acabado",
    text: "Los recursos disponibles muestran el material vertical y parte de la lectura técnica utilizada para explicar el cambio.",
  },
  unad: {
    title: "Piezas, dispositivos y formatos",
    text: "Una selección real de contenidos permite observar cómo el mensaje institucional se adaptó a diferentes superficies.",
  },
  amared: {
    title: "Identidad, pedido y sistema",
    text: "La evidencia conecta la expresión visual de AMARED con su interfaz de pedidos y la capa operativa.",
  },
  "caso-tiktok": {
    title: "Formato vertical y evidencia visual",
    text: "El contenido, su adaptación a teléfono y la identidad del caso se presentan junto a resultados verificables.",
  },
};

export function CaseEvidence({ project }: { project: ProjectCase }) {
  const copy = evidenceTitles[project.slug];

  return (
    <section
      id="evidencia"
      className="case-evidence section-frame case-anchor-section"
      aria-labelledby="case-evidence-title"
    >
      <div className="section-title-row">
        <p className="section-index">04 / Evidencia</p>
        <div>
          <h2 id="case-evidence-title">{copy.title}</h2>
          <p>{copy.text}</p>
        </div>
      </div>
      <div className={`case-evidence-grid evidence-${project.slug}`}>
        <figure className="evidence-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.imageAlt} loading="lazy" />
          <figcaption>Vista principal del proyecto</figcaption>
        </figure>
        {project.showcaseVisuals.map((visual, index) => (
          <figure key={visual.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={visual.src} alt={visual.alt} loading="lazy" />
            <figcaption>
              {index === 0 ? "Material aplicado" : "Detalle del proceso"}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
