"use client";

import { useEffect, useRef, useState } from "react";
import type { SelectionWork } from "../site-data";

export function WorkGallery({ works }: { works: SelectionWork[] }) {
  const [active, setActive] = useState<SelectionWork | null>(null);
  const [previewNumber, setPreviewNumber] = useState<string | null>(null);
  const [previewFrame, setPreviewFrame] = useState(0);
  const [modalFrame, setModalFrame] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active]);

  useEffect(() => {
    const work = works.find((item) => item.number === previewNumber);
    if (!work?.slides?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setPreviewFrame((value) => (value + 1) % work.slides!.length), 900);
    return () => window.clearInterval(timer);
  }, [previewNumber, works]);

  const canPreview = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const moveTrack = (direction: number) => trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth * 0.72, behavior: "smooth" });
  const openWork = (work: SelectionWork) => { setModalFrame(0); setActive(work); };
  const startPreview = (work: SelectionWork, pointerType: string) => {
    if (pointerType !== "mouse" || !canPreview() || (!work.video && !work.slides?.length)) return;
    setPreviewFrame(0); setPreviewNumber(work.number);
  };

  return (
    <>
      <div className="work-browser">
        <div className="work-browser-topline"><span>Desliza para explorar</span><div className="work-browser-arrows"><button type="button" onClick={() => moveTrack(-1)} aria-label="Trabajos anteriores">←</button><button type="button" onClick={() => moveTrack(1)} aria-label="Trabajos siguientes">→</button></div></div>
        <div ref={trackRef} className="work-gallery-track">
          {works.map((work) => {
            const previewing = previewNumber === work.number;
            const slide = work.slides?.[previewFrame % (work.slides?.length || 1)];
            return (
              <article key={work.number} className="work-card">
                <button type="button" className="work-card-visual" aria-label={`Abrir ${work.title}`} onClick={() => openWork(work)} onPointerEnter={(event) => startPreview(work, event.pointerType)} onPointerLeave={() => setPreviewNumber(null)}>
                  {previewing && work.video ? <video src={work.video} poster={work.poster ?? work.image} muted playsInline autoPlay loop preload="metadata" aria-hidden="true" /> : <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={previewing && slide ? slide.src : work.image} alt={previewing && slide ? slide.alt : work.imageAlt} loading="lazy" /></>}
                  <span className="work-card-index">{work.number}</span><span className="work-card-kind">{work.video ? "Video" : work.slides ? "Carrusel" : "Pieza"}</span><span className="work-card-open">Abrir ↗</span>
                </button>
                <div className="work-card-copy"><p>{work.category}</p><h2>{work.title}</h2><span>{work.note}</span></div>
              </article>
            );
          })}
        </div>
      </div>
      <dialog ref={dialogRef} className="work-dialog work-dialog-v2" aria-label={active?.title ?? "Vista de trabajo"} onClose={() => setActive(null)} onCancel={(event) => { event.preventDefault(); setActive(null); }}>
        {active && <div className="work-dialog-content"><button type="button" className="work-dialog-close" onClick={() => setActive(null)} aria-label="Cerrar vista">Cerrar ×</button><div className="work-dialog-media">{active.video ? <video src={active.video} poster={active.poster ?? active.image} controls playsInline preload="metadata" aria-label={active.title} /> : <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={active.slides?.[modalFrame]?.src ?? active.image} alt={active.slides?.[modalFrame]?.alt ?? active.imageAlt} />{active.slides && <div className="work-dialog-carousel"><button type="button" onClick={() => setModalFrame((value) => (value - 1 + active.slides!.length) % active.slides!.length)} aria-label="Imagen anterior">←</button><span>{modalFrame + 1} / {active.slides.length}</span><button type="button" onClick={() => setModalFrame((value) => (value + 1) % active.slides!.length)} aria-label="Imagen siguiente">→</button></div>}</>}</div><div><p>{active.category}</p><h2>{active.title}</h2><span>{active.note}</span></div></div>}
      </dialog>
    </>
  );
}
