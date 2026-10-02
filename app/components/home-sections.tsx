"use client";

import Link from "next/link";
import {
  CV_PATH,
  contactConfig,
  education,
  pendingSelectionMedia,
  primaryServices,
  secondaryCapabilities,
  selectionWorks,
  toolGroups,
} from "../site-data";
import { ProjectExplorer } from "./project-explorer";
import { SceneObserver } from "./scene-observer";
import { ServicesExplorer } from "./services-explorer";
import { WorkGallery } from "./work-gallery";

const experienceResponsibilities = [
  "Ideación y estructura del mensaje",
  "Guion y grabación",
  "Edición audiovisual",
  "Diseño gráfico",
  "Adaptación de formatos",
  "Contenidos institucionales",
];

export function HomeSections() {
  return (
    <div className="portfolio-continuation">
      <SceneObserver />

      <section
        id="proyectos"
        className="portfolio-scene projects-scene"
        aria-labelledby="home-projects-title"
      >
        <div className="scene-frame">
          <div className="scene-heading">
            <p className="scene-kicker"><span>01</span> Proyectos</p>
            <h2 id="home-projects-title">Cuatro casos. Cuatro formas de resolver.</h2>
            <p>
              Cada selección cambia la composición central y permite entrar desde
              cualquier punto del visual, no solamente desde un botón.
            </p>
          </div>
          <ProjectExplorer />
        </div>
      </section>

      <section
        id="seleccion"
        className="portfolio-scene selection-scene"
        aria-labelledby="home-selection-title"
      >
        <div className="scene-frame">
          <div className="scene-heading is-horizontal">
            <div>
              <p className="scene-kicker"><span>02</span> Selección de trabajos</p>
              <h2 id="home-selection-title">Más rango. Más formatos. La misma intención.</h2>
            </div>
            <p>
              Un archivo interactivo para observar piezas y acercarse a cada
              trabajo sin descargar todos los videos de forma automática.
            </p>
          </div>

          <WorkGallery works={selectionWorks} />

          <aside className="pending-media-note" aria-label="Recursos pendientes">
            <span>Integración pendiente por archivo no disponible</span>
            <p>{pendingSelectionMedia.join(" · ")}</p>
          </aside>
        </div>
      </section>

      <section
        id="servicios"
        className="portfolio-scene services-scene"
        aria-labelledby="home-services-title"
      >
        <div className="scene-frame">
          <div className="scene-heading">
            <p className="scene-kicker"><span>03</span> Servicios</p>
            <h2 id="home-services-title">El servicio se entiende viendo el trabajo.</h2>
            <p>
              La navegación conecta cada capacidad principal con una pieza real
              definida para demostrarla.
            </p>
          </div>

          <ServicesExplorer services={primaryServices} />

          <div className="secondary-capability-line">
            <span>Capacidades complementarias</span>
            <p>{secondaryCapabilities.join(" · ")}</p>
          </div>
        </div>
      </section>

      <section
        id="experiencia"
        className="portfolio-scene experience-scene"
        aria-labelledby="home-experience-title"
      >
        <div className="scene-frame experience-layout">
          <div className="experience-scene-copy">
            <p className="scene-kicker"><span>04</span> Experiencia</p>
            <h2 id="home-experience-title">Crear contenido dentro de un sistema real.</h2>
            <p className="experience-period">
              Red de Egresados UNAD<br />
              Marzo–diciembre de 2024 · Marzo–diciembre de 2025
            </p>
            <p>
              Participación en el ciclo completo de contenidos, desde la idea y el
              guion hasta la grabación, edición, diseño y adaptación final.
            </p>
            <ul>
              {experienceResponsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href="/proyectos/unad">
              Ver experiencia aplicada <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Link
            className="experience-scene-visual"
            href="/proyectos/unad"
            aria-label="Abrir el caso Red de Egresados UNAD"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/unad.png"
              alt="Selección de contenidos desarrollados para la Red de Egresados UNAD"
              loading="lazy"
            />
            <span aria-hidden="true">02 / Abrir caso ↗</span>
          </Link>
        </div>
      </section>

      <section
        id="sobre-mi"
        className="portfolio-scene about-scene"
        aria-labelledby="home-about-title"
      >
        <div className="scene-frame about-scene-grid">
          <div className="about-scene-copy">
            <p className="scene-kicker"><span>05</span> Sobre mí</p>
            <h2 id="home-about-title">Narrativa, edición, diseño y tecnología.</h2>
            <p className="about-scene-lead">
              Soy Ingeniero Multimedia, Editor de Video y Creador de Contenido
              Audiovisual. Integro motion graphics y diseño multimedia para
              convertir ideas en piezas claras, rítmicas y coherentes.
            </p>
            <p>
              Mi enfoque combina criterio creativo con una mirada técnica que me
              permite comprender el proyecto completo sin perder el foco audiovisual.
            </p>
          </div>

          <div className="about-photo-composition">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portraits/cristian-standing.jpg"
                alt="Cristian David Campos de pie mirando a cámara"
                loading="lazy"
              />
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portraits/cristian-seated.jpg"
                alt="Cristian David Campos sentado"
                loading="lazy"
              />
            </figure>
          </div>

          <div className="about-tools" aria-label="Herramientas">
            {toolGroups.map((group) => (
              <div key={group.label}>
                <span>{group.label}</span>
                <p>{group.items.join(" · ")}</p>
              </div>
            ))}
          </div>

          <div className="about-education">
            <span>Formación</span>
            <ul>
              {education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="contacto"
        className="portfolio-scene contact-scene"
        aria-labelledby="home-contact-title"
      >
        <div className="scene-frame contact-scene-grid">
          <div>
            <p className="scene-kicker"><span>06</span> Contacto</p>
            <h2 id="home-contact-title">Conversemos sobre el próximo proyecto.</h2>
            <p>
              Edición de video, contenido audiovisual, motion graphics y
              colaboraciones de diseño multimedia.
            </p>
          </div>

          <div className="contact-details">
            <div>
              <span>Ubicación</span>
              <strong>{contactConfig.location}</strong>
            </div>
            <div>
              <span>Disponibilidad</span>
              <strong>{contactConfig.availability}</strong>
            </div>
            <div>
              <span>Correo</span>
              {contactConfig.email ? (
                <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
              ) : (
                <strong className="is-pending">Pendiente de confirmar</strong>
              )}
            </div>
            <div>
              <span>Perfiles</span>
              <p>
                {contactConfig.linkedin ? (
                  <a href={contactConfig.linkedin}>LinkedIn</a>
                ) : (
                  "LinkedIn pendiente"
                )}
                <br />
                {contactConfig.behance ? (
                  <a href={contactConfig.behance}>Behance</a>
                ) : (
                  "Behance pendiente"
                )}
              </p>
            </div>
          </div>

          <a
            className="contact-cv-link"
            href={CV_PATH}
            download="Cristian_David_Campos_CV.pdf"
            aria-label="Descargar CV de Cristian David Campos en PDF"
          >
            <span>CV · PDF</span>
            Descargar currículum
            <b aria-hidden="true">↓</b>
          </a>
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <span className="footer-mark">CDC<span>.</span></span>
          <p>Edición de video · Motion graphics · Diseño multimedia</p>
        </div>
        <nav aria-label="Enlaces finales">
          <Link href="/#inicio">Inicio</Link>
          <Link href="/#proyectos">Proyectos</Link>
          <Link href="/#contacto">Contacto</Link>
          <a href={CV_PATH} download="Cristian_David_Campos_CV.pdf">CV</a>
        </nav>
      </footer>
    </div>
  );
}
