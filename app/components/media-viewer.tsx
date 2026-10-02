"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { projectForWork, summaryForWork, shouldLoop } from "../portfolio-model";
import { ImageCarousel } from "./image-carousel";
import type { SelectionWork } from "../site-data";
import { Icon } from "./icon";

export function MediaPreview({ work, onOpen, className = "", label, variant = "gallery", children, active = true }: { work: SelectionWork; onOpen: (work: SelectionWork) => void; className?: string; label?: string; variant?: "gallery" | "case" | "service" | "process"; children?: ReactNode; active?: boolean }) {
  const [preview, setPreview] = useState(false);
  const [frame, setFrame] = useState(0);
  const [failedWork, setFailedWork] = useState<string | null>(null);
  const imageFailed = failedWork === work.id;
  const host = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; setPreview(false); setFrame(0); };
  useEffect(() => { if (!active) stop(); }, [active]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.intersectionRatio < .45) stop(); }, { threshold: .45 });
    if (host.current) observer.observe(host.current);
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("portfolio:media-open", stop);
    const otherPreview = (event: Event) => { if ((event as CustomEvent<string>).detail !== work.id) stop(); };
    document.addEventListener("portfolio:preview-start", otherPreview);
    return () => { document.removeEventListener("portfolio:preview-start", otherPreview); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); document.removeEventListener("portfolio:media-open", stop); if (timer.current) clearTimeout(timer.current); };
  }, [work.id]);
  useEffect(() => {
    if (!preview) return;
    const end = setTimeout(() => setPreview(false), 6500);
    const slide = work.slides && !work.video ? setInterval(() => setFrame(i => (i + 1) % work.slides!.length), 1300) : null;
    return () => { clearTimeout(end); if (slide) clearInterval(slide); };
  }, [preview, work]);
  const current = !work.video ? work.slides?.[frame] : undefined;
  const poster = work.imageTall ?? work.imageSquare ?? work.image;
  return <button ref={host} type="button" className={`p-media ${variant === "service" ? "p-media-service" : ""} ${work.imageWide ? "p-media-has-wide" : ""} ${className}`} aria-label={label ?? `Abrir ${work.title}`} onClick={() => { stop(); onOpen(work); }} onPointerEnter={e => {
    if (!active || variant === "process" || e.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches || (!work.video && !work.slides)) return;
    document.dispatchEvent(new CustomEvent("portfolio:preview-start", { detail: work.id }));
    timer.current = setTimeout(() => setPreview(true), 180);
  }} onPointerLeave={stop} onBlur={stop}>
    <span className="p-media-frame"><picture>{!imageFailed && variant === "process" && work.imageWide && <source srcSet={work.imageWide} />}{!imageFailed && !(preview && current) && (variant === "service" || variant === "case") && work.imageWide && <source media="(max-width: 700px)" srcSet={work.imageWide} />}{!imageFailed && !(preview && current) && variant === "gallery" && <source media="(max-width: 700px)" srcSet={work.imageSquare ?? work.image} />}<img key={work.id} src={imageFailed ? work.image : preview && current ? current.src : poster} alt={preview && current ? current.alt : work.imageAlt} loading={variant === "gallery" ? "lazy" : "eager"} onError={() => { if (!imageFailed) setFailedWork(work.id); }} /></picture>
    {preview && work.video && <video src={work.video} muted playsInline autoPlay preload="none" poster={work.poster ?? work.image} aria-hidden="true" onError={() => setPreview(false)} onEnded={() => setPreview(false)} />}
    {variant === "service" && !work.imageWide && <span className="p-service-preview-caption" aria-hidden="true"><small>Trabajo seleccionado</small><strong>{work.title}</strong><span>{work.duration ?? "Diseño e identidad"}</span><Icon name={work.video ? "play" : "open"} /></span>}
    <span className="p-media-action" aria-hidden="true">{variant === "process" ? "Ver proceso de edición" : children ? "Ver trabajo" : work.video ? "Reproducir video" : "Ver imágenes"}<Icon name={work.video ? "play" : "open"} /></span>
    </span>{children}
  </button>;
}

export type MediaMode = "video" | "images" | "process";

export function MediaViewer({ work, onClose, initialMode = "video", onProject }: { work: SelectionWork; onClose: () => void; initialMode?: MediaMode; onProject?: (slug: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<MediaMode>(initialMode === "images" && work.slides ? "images" : initialMode === "process" && work.timeline ? "process" : work.video ? "video" : "images");
  const [error, setError] = useState(false);
  const process = mode === "process" ? work.timeline : undefined;
  const source = process?.video ?? work.video;
  const hasModes = !!work.video && (!!work.timeline || !!work.slides);
  const changeMode = (next: MediaMode) => { video.current?.pause(); setError(false); setMode(next); };
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    document.dispatchEvent(new Event("portfolio:media-open"));
    node?.showModal();
    const hidden = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener("visibilitychange", hidden);
    return () => { node?.close(); document.removeEventListener("visibilitychange", hidden); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => {
    const player = video.current;
    return () => { if (player) { player.pause(); player.removeAttribute("src"); player.load(); } };
  }, [mode]);
  const project = projectForWork(work.id);
  const details = process?.details ?? work.details;
  return <dialog ref={dialog} className={`p-viewer p-viewer-compact ${hasModes ? "p-viewer-has-modes" : ""} ${process ? "p-viewer-process" : ""}`} aria-labelledby="media-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}> 
    <div className="p-viewer-inner">
      <div className="p-viewer-bar"><span>{process ? "Proceso de edición" : work.video ? "Pieza audiovisual" : work.slides ? "Serie gráfica" : "Diseño y comunicación"}</span><button className="p-close" type="button" onClick={onClose} aria-label="Cerrar contenido">Cerrar <Icon name="close" /></button></div>
      {hasModes && <div className="p-viewer-modes p-viewer-switcher" role="group" aria-label="Ver resultado o proceso">
        <button type="button" aria-pressed={mode === "video"} onClick={() => changeMode("video")}>Resultado final</button>
        {work.timeline && <button type="button" aria-pressed={mode === "process"} onClick={() => changeMode("process")}>Proceso de edición</button>}
        {work.slides && <button type="button" aria-pressed={mode === "images"} onClick={() => changeMode("images")}>Analíticas</button>}
      </div>}
      <div className="p-viewer-media">
        {mode !== "images" && source ? <video key={source} ref={video} src={source} poster={process ? work.imageWide ?? work.poster ?? work.image : work.poster ?? work.image} controls playsInline loop={shouldLoop(work, mode)} preload="none" aria-label={`${work.title}${process ? ": línea de tiempo en Premiere Pro" : ": resultado final"}`} onError={() => setError(true)} /> : work.slides ? <ImageCarousel slides={work.slides} title={work.title} /> : <img src={work.image} alt={work.imageAlt} />}
        {error && mode !== "images" && <p role="alert">No se pudo cargar el video. <a href={source}>Abrir archivo</a></p>}
      </div>
      <div className="p-viewer-copy" tabIndex={0} aria-label={`Información de ${work.title}`}>
        <div><p className="p-eyebrow">{process ? "Proceso de edición · Premiere Pro" : work.category}</p><h2 id="media-title">{work.title}</h2></div>
        <p className="p-viewer-intro">{process?.note ?? summaryForWork(work)}</p>
        {project && onProject && <div className="p-viewer-project"><span>Parte de {project.title}</span><button type="button" className="p-link" onClick={() => onProject(project.slug)}>Conocer el proyecto <Icon name="open" /></button></div>}
        {details && <details className="p-viewer-focus"><summary>{process ? "Dentro de la edición" : "Más sobre esta pieza"}</summary>{!process && summaryForWork(work) !== work.note && <p>{work.note}</p>}<ol>{details.map((detail, index) => <li key={detail.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{detail.title}</strong>{detail.text}</div></li>)}</ol></details>}
        {process && <p className="p-process-hint">Amplía el video a pantalla completa para observar las pistas y el monitor de programa.</p>}
        <dl className="p-viewer-specs"><div><dt>Formato</dt><dd>{process ? "Grabación de pantalla · 16:9" : work.format ?? (work.video ? "Video vertical" : "Diseño gráfico")}</dd></div><div><dt>{process || work.duration ? "Duración" : "Contenido"}</dt><dd>{process?.duration ?? work.duration ?? (work.slides ? `${work.slides.length} imágenes` : "1 pieza gráfica")}</dd></div></dl>

      </div>
    </div>
  </dialog>;
}
