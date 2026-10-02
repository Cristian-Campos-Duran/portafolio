"use client";

import { publicAsset } from "./asset-path.mjs";


import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import HomeStage from "./home-stage";
import { Icon } from "./components/icon";
import { AnimatedCounter } from "./components/animated-counter";
import { MediaPreview, MediaViewer, type MediaMode } from "./components/media-viewer";
import { CV_PATH, contactConfig, education, navigation, primaryServices, projects, selectionWorks, toolGroups, caseWorkIds, experienceWorkIds, workById } from "./site-data";
import type { ProjectCase, SelectionWork } from "./site-data";

import { sections, caseTabs, normalizeView as normalize } from "./portfolio-model";
import { ProjectGallery } from "./components/project-gallery";
import { ImageCarousel } from "./components/image-carousel";

const labelFor = (view: string) => view.startsWith("caso/") ? projects.find(p => view.endsWith(p.slug))?.title ?? "Proyecto" : navigation[sections.indexOf(view)]?.label ?? "Inicio";

function LinkTo({ to, go, children, className = "" }: { to: string; go: (view: string) => void; children: ReactNode; className?: string }) {
  return <a className={className} href={`#${normalize(to)}`} onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); go(to); }}>{children}</a>;
}

function Tabs({ items, selected, onChange, name, id }: { items: { title: string; number?: string }[]; selected: number; onChange: (index: number) => void; name: string; id: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => { refs.current[selected]?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [selected]);
  return <div className="p-tabs" role="tablist" aria-label={name}>
    {items.map((item, index) => <button key={item.title} ref={node => { refs.current[index] = node; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={index === selected} aria-controls={`${id}-panel`} tabIndex={index === selected ? 0 : -1} onClick={() => onChange(index)} onKeyDown={e => {
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % items.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = items.length - 1;
      else return;
      e.preventDefault(); onChange(next); refs.current[next]?.focus();
    }}><span>{item.number ?? String(index + 1).padStart(2, "0")}</span><b>{item.title}</b><i className="p-current-mark" aria-hidden="true" /></button>)}
  </div>;
}

function Heading({ number, title, note }: { number: string; title: string; note?: string }) {
  return <div className="p-scene-heading"><div><p className="p-eyebrow"><span>{number}</span> Portafolio seleccionado</p><h1 tabIndex={-1}>{title}</h1></div>{note && <p>{note}</p>}</div>;
}

const serviceWorks = primaryServices.map(service => workById(service.workId));
const serviceDescriptions = [
  "Transformo el material grabado en una pieza con intención: selecciono los momentos, construyo el ritmo y unifico color, subtítulos y sonido para que el mensaje llegue con claridad.",
  "Adapto cada idea al canal y a su audiencia. Trabajo el inicio, la duración, los encuadres y la lectura del mensaje para crear contenido que se entienda desde el primer momento.",
  "Doy movimiento a textos y recursos gráficos para explicar, enfatizar y conectar las ideas con la imagen. La animación acompaña la narración y mantiene una identidad consistente.",
  "Acompaño la pieza desde la idea y el guion hasta la grabación y el montaje. Organizo imagen, voz y apoyos visuales en una historia que pueda comprenderse con facilidad.",
  "Conecto identidad, contenido e interacción. Diseño piezas e interfaces que mantienen un lenguaje visual coherente y ayudan a las personas a entender y utilizar cada experiencia.",
];

function Services({ index, setIndex, open }: { index: number; setIndex: (index: number) => void; open: (work: SelectionWork) => void }) {
  const service = primaryServices[index];
  return <section className="p-scene p-services"><Heading number="02" title="Servicios aplicados a trabajos reales." note="Selecciona un servicio para conocer mi enfoque y verlo aplicado en una pieza." />
    <div className="p-services-body"><div className="p-service-selection">
      <label className="p-service-select"><span>Servicio {service.number} / 05</span><select aria-label="Seleccionar servicio" aria-controls="services-panel" value={index} onChange={e => setIndex(Number(e.target.value))}>{primaryServices.map((item, i) => <option key={item.number} value={i}>{item.title}</option>)}</select><Icon name="down" /></label>
      <Tabs id="services" items={primaryServices.map(p => ({ title: p.title, number: p.number }))} selected={index} onChange={setIndex} name="Seleccionar servicio" />
      <p className="p-service-aside">Un enfoque audiovisual.<br />Múltiples formas de comunicar.</p>
    </div>
    <div className="p-service-detail p-enter" key={index} role="tabpanel" id="services-panel" aria-labelledby={`service-title-${index}`}>
      <div className="p-service-visual"><MediaPreview work={serviceWorks[index]} onOpen={open} variant="service" /></div>
      <div className="p-service-copy p-local-scroll" tabIndex={0} aria-label={`Descripción de ${service.title}`}><p className="p-eyebrow">{service.number} / {serviceWorks[index].video ? "Ejemplo audiovisual" : "Diseño aplicado"}</p><h2 id={`service-title-${index}`}>{service.title}</h2><p>{serviceDescriptions[index]}</p><div className="p-example"><span>En este trabajo</span><strong>{service.example}</strong><button className="p-link" type="button" onClick={() => open(serviceWorks[index])}>Ver ejemplo <Icon name="open" /></button></div></div>
    </div></div>
    <div className="p-section-line p-bottom-line"><span>También conecto</span><span>Diseño gráfico · UX/UI · Desarrollo web</span></div>
  </section>;
}

function Experience({ go, open, obscured }: { go: (view: string) => void; open: (work: SelectionWork) => void; obscured: boolean }) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const currentWork = workById(experienceWorkIds[slide]);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches); const visibility = () => setVisible(!document.hidden);
    update(); visibility(); query.addEventListener("change", update); document.addEventListener("visibilitychange", visibility);
    return () => { query.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (paused || hover || !visible || reduced || obscured) return;
    const timer = setInterval(() => setSlide(i => (i + 1) % experienceWorkIds.length), 4800);
    return () => clearInterval(timer);
  }, [paused, hover, visible, reduced, obscured]);
  const move = (delta: number) => { setPaused(true); setSlide(i => (i + delta + experienceWorkIds.length) % experienceWorkIds.length); };
  return <section className="p-scene p-experience"><Heading number="03" title="Del mensaje a la pieza." note="Experiencia aplicada a comunicación, contenido digital y producción audiovisual." />
    <div className="p-experience-body"><div className="p-experience-copy p-local-scroll" tabIndex={0} aria-label="Experiencia profesional"><p className="p-eyebrow">Red de Egresados UNAD</p><h2>Contenido para una comunidad.</h2><p className="p-period">Marzo — diciembre 2024<br />Marzo — diciembre 2025</p><p>Participé en la creación de contenidos institucionales, conectando la información de la red con piezas audiovisuales y gráficas para sus distintos canales.</p><ul className="p-responsibilities">{projects[1].participation.map(item => <li key={item}>{item}</li>)}</ul><LinkTo go={go} to="caso/unad" className="p-link">Ver proyecto UNAD <Icon name="open" /></LinkTo></div>
      <div className="p-experience-visual" onPointerEnter={e => { if (e.pointerType === "mouse") setHover(true); }} onPointerLeave={() => setHover(false)} onFocusCapture={() => setHover(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHover(false); }}>
        <button className="p-experience-image" type="button" onClick={() => open(currentWork)} aria-label={`Abrir ${currentWork.title}`}><img key={slide} src={currentWork.image} alt={currentWork.imageAlt} /><span className="p-media-action">Ver trabajo <Icon name="open" /></span></button>
        <div className="p-experience-controls"><span>{String(slide + 1).padStart(2,"0")} / {experienceWorkIds.length}<small>{currentWork.title}</small></span><div className="p-controls"><button onClick={() => move(-1)} type="button" aria-label="Trabajo anterior"><Icon name="back" /></button><button type="button" className="p-pause" onClick={() => setPaused(p => !p)} disabled={reduced} aria-label={paused || reduced ? "Reanudar carrusel" : "Pausar carrusel"}>{paused || reduced ? "Reanudar" : "Pausar"}</button><button onClick={() => move(1)} type="button" aria-label="Trabajo siguiente"><Icon name="next" /></button></div></div>
      </div>
    </div></section>;
}

function About({ go }: { go: (view: string) => void }) {
  return <section className="p-scene p-about"><div className="p-section-line"><span><b>04</b> Sobre mí</span><span>Cristian David Campos</span></div><div className="p-about-body"><div className="p-about-copy p-local-scroll" tabIndex={0} aria-label="Perfil, herramientas y formación"><p className="p-eyebrow">Ingeniero Multimedia</p><h1 tabIndex={-1}>Una mirada creativa.<br /><em>Una base técnica.</em></h1><p className="p-lead">Soy Editor de Video y Creador de Contenido Audiovisual. Integro narrativa, edición, motion graphics, diseño y tecnología para dar forma a ideas claras y visualmente coherentes.</p><div className="p-tool-groups">{toolGroups.map(group => <div key={group.label}><h2>{group.label}</h2><p>{group.items.join(" · ")}</p></div>)}</div><div className="p-education"><h2>Formación</h2>{education.map(item => <p key={item}>{item}</p>)}</div><LinkTo to="proyectos" go={go} className="p-link">Ver mis proyectos <Icon name="open" /></LinkTo></div><figure className="p-portrait"><div className="p-portrait-frame"><img src={publicAsset("/portraits/cristian-standing.jpg")} width={2048} height={1365} alt="Cristian David Campos, Ingeniero Multimedia y editor de video" /></div><figcaption><span>Ibagué, Colombia</span><span>Edición · Diseño · Movimiento</span></figcaption></figure></div></section>;
}

function Contact() {
  return <section className="p-scene p-contact"><div className="p-section-line"><span><b>05</b> Contacto</span><span>Conectemos</span></div><div className="p-contact-body p-local-scroll" tabIndex={0} aria-label="Información de contacto"><p className="p-eyebrow"><i className="p-status-dot" /> {contactConfig.availability}</p><h1 tabIndex={-1}>El próximo proyecto<br />empieza con una<br /><em>buena conversación.</em></h1><p className="p-lead">Cuéntame qué necesitas y conversemos sobre el objetivo, formato y alcance de tu proyecto.</p><div className="p-contact-links">{contactConfig.email && <a href={`mailto:${contactConfig.email}`} className="p-link">Escribirme<Icon name="open" /></a>}<a href={CV_PATH} download="Cristian_David_Campos_CV.pdf" className="p-link" aria-label="Descargar CV de Cristian David Campos en PDF">Descargar CV <Icon name="download" /></a>{contactConfig.linkedin && <a href={contactConfig.linkedin} className="p-link">LinkedIn <Icon name="open" /></a>}{contactConfig.behance && <a href={contactConfig.behance} className="p-link">Behance <Icon name="open" /></a>}</div></div><div className="p-section-line p-bottom-line"><span>{contactConfig.location}</span><span>Cristian David Campos <b>CDC.</b></span></div></section>;
}

function Case({ project, back, go, open }: { project: ProjectCase; back: () => void; go: (view: string) => void; open: (work: SelectionWork, mode?: MediaMode) => void }) {
  const [tab,setTab] = useState(0);
  const [piece,setPiece] = useState(0);
  const [processPiece,setProcessPiece] = useState(0);
  const collection = caseWorkIds[project.slug].map(workById);
  const work = collection[piece] ?? collection[0];
  const processWorks = collection.filter(item => item.timeline);
  const processWork = processWorks[processPiece] ?? processWorks[0];
  const showProcess = tab === 1 && !!processWork;
  const resultWork = project.slug === 'unad' ? workById('unad') : project.slug === 'amared' ? workById('amared-identidad') : work;
  const visual = tab === 2 ? resultWork : showProcess ? processWork : work;
  const showImages = tab === 2 && !!visual.slides;
  return <section className="p-scene p-case p-case-compact"><div className="p-case-top"><button className="p-back" type="button" onClick={back}><Icon name="back" /><span>Volver</span></button><span>{project.number} / {project.shortTitle}</span><LinkTo to={`caso/${project.nextSlug}`} go={go}>Proyecto siguiente <Icon name="next" /></LinkTo></div>
    <div className={`p-case-body p-case-tab-${tab} ${showProcess ? 'p-case-has-process' : ''} p-enter`} key={tab} role="tabpanel" id="case-panel" aria-labelledby={`case-tab-${tab}`}>
      <div className="p-case-copy p-local-scroll" tabIndex={0} aria-label={`${project.title}: ${caseTabs[tab]}`}>
        <p className="p-eyebrow">{project.category}</p><h1 tabIndex={-1}>{tab === 0 ? project.title : caseTabs[tab]}</h1>
        {tab === 0 && <><p className="p-lead">{project.summary}</p><div className="p-case-note"><h2>Objetivo</h2><p>{project.objective}</p><h2>Mi rol</h2><p>{project.participation.join(' · ')}</p></div>{project.period && <p className="p-period">{project.period}</p>}<button className="p-link" type="button" onClick={()=>setTab(1)}>Ver proceso <Icon name="next" /></button></>}
        {tab === 1 && <>{showProcess && <p className="p-lead">El montaje y el resultado en una misma grabación de Premiere Pro.</p>}<div className="p-process">{project.process.map((item,i)=><div key={item.title}><span>{String(i+1).padStart(2,'0')}</span><div><h2>{item.title}</h2><p>{item.text}</p></div></div>)}</div><details className="p-case-more"><summary>Contexto y herramientas</summary><p>{project.context}</p><p>{project.heroLead}</p><p>{project.tools.join(' · ')}</p></details><button className="p-link" type="button" onClick={()=>setTab(2)}>Ver resultado <Icon name="next" /></button></>}
        {tab === 2 && <><p className="p-lead">{project.result}</p>{project.metrics && <div className="p-metrics">{project.metrics.map(m=><AnimatedCounter key={m.label} {...m} finalValue={m.value} />)}</div>}<div className="p-case-note"><h2>Aprendizaje</h2><p>{project.learning}</p></div><div className="p-case-result-actions"><LinkTo to="proyectos" go={go} className="p-link">Volver a proyectos <Icon name="back" /></LinkTo></div></>}
      </div>
      <div className="p-case-visual">
        {showImages ? <ImageCarousel slides={visual.slides!} title={visual.title} onExpand={()=>open(visual,'images')} /> : <div className="p-case-media-frame"><MediaPreview key={`${showProcess?'process':'work'}-${visual.id}`} work={visual} variant={showProcess?'process':'case'} onOpen={item=>open(item,showProcess?'process':'video')} /></div>}
        <span className="p-case-caption">{visual.title} · {showProcess ? 'Proceso de edición' : showImages ? 'Presentación del proyecto' : visual.video ? 'Resultado final' : 'Serie gráfica'}</span>
        {tab === 0 && collection.length > 1 && <div className="p-case-piece-nav"><span>Piezas realizadas</span><div role="group" aria-label="Piezas realizadas">{collection.map((item,i)=><button key={item.id} type="button" aria-pressed={piece===i} onClick={()=>setPiece(i)}>{item.title}</button>)}</div></div>}
        {showProcess && processWorks.length > 1 && <div className="p-case-piece-nav"><span>Proceso de edición</span><div role="group" aria-label="Elegir proceso de edición">{processWorks.map((item,i)=><button key={item.id} type="button" aria-pressed={processPiece===i} onClick={()=>setProcessPiece(i)}>{item.title}</button>)}</div></div>}
      </div>
    </div>
    <Tabs items={caseTabs.map(title=>({title}))} selected={tab} onChange={setTab} name="Apartados del caso" id="case" />
  </section>;
}

export default function PortfolioApp({ initialView = "inicio" }: { initialView?: string }) {
  const [view, setView] = useState(normalize(initialView));
  // Resolve the initial hash before loading any of the home animation assets.
  const [homeVisited, setHomeVisited] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [work, setWork] = useState<SelectionWork | null>(null);
  const [mediaMode, setMediaMode] = useState<MediaMode>("video");
  const [galleryVisited, setGalleryVisited] = useState(() => normalize(initialView) === "proyectos");
  const [serviceIndex, setServiceIndex] = useState(0);
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLElement>(null);
  const interacted = useRef(false);

  useEffect(() => {
    const read = () => {
      const next = normalize(location.hash || initialView);
      setView(next); if (next === "inicio") setHomeVisited(true); if (next === "proyectos") setGalleryVisited(true); setMenuOpen(false);
      setWork(selectionWorks.find(item => item.id === history.state?.mediaWork) ?? null); setMediaMode(history.state?.mediaMode ?? "video");
    };
    read();
    if (!history.state?.portfolio) history.replaceState({ ...history.state, portfolio: true, view: normalize(location.hash || initialView), caseReturn: false }, "");
    window.addEventListener("popstate", read); window.addEventListener("hashchange", read);
    return () => { window.removeEventListener("popstate", read); window.removeEventListener("hashchange", read); };
  }, [initialView]);

  const go = useCallback((path: string) => {
    const next = normalize(path);
    setMenuOpen(false);
    if (next === view) { if (history.state?.mediaWork) history.back(); else setWork(null); return; }
    setWork(null);
    interacted.current = true;
    const caseReturn = next.startsWith("caso/") && (view.startsWith("caso/") ? !!history.state?.caseReturn : true);
    const state = { ...history.state, portfolio: true, view: next, caseReturn, mediaWork: undefined, mediaMode: undefined };
    // Adjacent cases share a history entry: Volver retains the originating section.
    if (history.state?.mediaWork || view.startsWith("caso/") && next.startsWith("caso/")) history.replaceState(state, "", `#${next}`);
    else history.pushState(state, "", `#${next}`);
    if (next === "inicio") setHomeVisited(true);
    if (next === "proyectos") setGalleryVisited(true);
    setView(next);
  }, [view]);

  const back = () => { if (history.state?.caseReturn) { interacted.current = true; history.back(); } else go("proyectos"); };
  useEffect(() => {
    document.title = `${labelFor(view)} — Cristian Campos`;
    if (!interacted.current) return;
    const frame = requestAnimationFrame(() => { const heading = stage.current?.querySelector<HTMLElement>("[data-active-scene] h1"); heading?.setAttribute("tabindex", "-1"); heading?.focus({ preventScroll: true }); });
    return () => cancelAnimationFrame(frame);
  }, [view]);
  useEffect(() => {
    if (menuOpen) { document.dispatchEvent(new Event("portfolio:media-open")); menu.current?.showModal(); }
    else if (menu.current?.open) menu.current.close();
  }, [menuOpen]);
  const open = (selected: SelectionWork, mode: MediaMode = "video") => { history.pushState({ ...history.state, mediaWork: selected.id, mediaMode: mode }, ""); setMediaMode(mode); setWork(selected); };
  const closeWork = () => { if (history.state?.mediaWork) history.back(); else setWork(null); };
  const activeProject = view.startsWith("caso/") ? projects.find(p => p.slug === view.slice(5)) : null;

  return <div className="p-app" data-view={view}>
    <a className="p-skip" href="#portfolio-content" onClick={e => { e.preventDefault(); stage.current?.focus(); }}>Saltar al contenido</a>
    <header className="p-header"><LinkTo to="inicio" go={go} className="wordmark">CDC<span>.</span><span className="sr-only"> Inicio</span></LinkTo><span className="p-header-location" aria-hidden="true">{view === "inicio" ? "" : labelFor(view)}</span><div className="header-actions"><a className="cv-state" href={CV_PATH} download="Cristian_David_Campos_CV.pdf" aria-label="Descargar CV de Cristian David Campos en PDF"><i aria-hidden="true" /><span>Descargar CV</span></a><button ref={menuButton} className="menu-button" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="portfolio-menu" type="button" onClick={() => setMenuOpen(true)}><span /><span /></button></div></header>
    <main ref={stage} id="portfolio-content" tabIndex={-1} className="p-stage">
      {homeVisited && <div className={`p-home ${view === "inicio" ? "p-enter" : ""}`} hidden={view !== "inicio"} inert={view !== "inicio"} data-active-scene={view === "inicio" ? "" : undefined}><HomeStage active={view === "inicio"} menuOpen={menuOpen} onNavigate={go} /></div>}
      {galleryVisited && <div className="p-scene-host p-enter" hidden={view !== "proyectos"} inert={view !== "proyectos"} data-active-scene={view === "proyectos" ? "" : undefined}><ProjectGallery open={open} active={view === "proyectos" && !menuOpen && !work} /></div>}
      {view !== "inicio" && view !== "proyectos" && <div className="p-scene-host p-enter" key={view} data-active-scene="">
        {view === "servicios" && <Services index={serviceIndex} setIndex={setServiceIndex} open={open} />}
        {view === "experiencia" && <Experience go={go} open={open} obscured={menuOpen || !!work} />}
        {view === "sobre-mi" && <About go={go} />}
        {view === "contacto" && <Contact />}
        {activeProject && <Case project={activeProject} go={go} back={back} open={open} />}
      </div>}
    </main>
    <dialog ref={menu} id="portfolio-menu" className="p-menu" aria-label="Navegación principal" onClose={() => { setMenuOpen(false); }} onClick={e => { if (e.target === e.currentTarget) setMenuOpen(false); }}>
      <div className="p-menu-panel"><div className="p-menu-top"><span>Explorar el portafolio</span><button className="p-close" type="button" onClick={() => { setMenuOpen(false); menuButton.current?.focus(); }} aria-label="Cerrar menú">Cerrar <Icon name="close" /></button></div><nav aria-label="Secciones del portafolio">{navigation.map((item,i) => <a key={item.number} href={`#${sections[i]}`} aria-current={view === sections[i] ? "page" : undefined} onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); go(sections[i]); }}><span>{item.number}</span>{item.label}<i className="p-current-mark" aria-hidden="true" /></a>)}</nav><div className="p-menu-bottom"><span>Ingeniería Multimedia<br />Edición · Diseño · Movimiento</span><a href={CV_PATH} download="Cristian_David_Campos_CV.pdf">Descargar CV <Icon name="download" /></a></div></div>
    </dialog>
    {work && <MediaViewer key={work.id} work={work} initialMode={mediaMode} onClose={closeWork} onProject={slug => go(`caso/${slug}`)} />}
  </div>;
}
