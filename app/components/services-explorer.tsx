"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { ServiceItem } from "../site-data";

export function ServicesExplorer({ services }: { services: ServiceItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = services[activeIndex];

  useEffect(() => {
    if (!active.slides?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setSlideIndex((value) => (value + 1) % active.slides!.length), 2600);
    return () => window.clearInterval(timer);
  }, [active]);

  const selectService = (index: number) => { setActiveIndex(index); setSlideIndex(0); };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % services.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + services.length) % services.length;
    else return;
    event.preventDefault(); selectService(next); refs.current[next]?.focus();
  };

  return (
    <div className="services-explorer">
      <div className="services-tabs" role="tablist" aria-label="Servicios principales">
        {services.map((service, index) => <button key={service.number} ref={(node) => { refs.current[index] = node; }} id={`service-tab-${service.number}`} type="button" role="tab" aria-selected={activeIndex === index} aria-controls="service-panel" tabIndex={activeIndex === index ? 0 : -1} onClick={() => selectService(index)} onKeyDown={(event) => onKeyDown(event, index)}><span>{service.number}</span><b>{service.title}</b><i aria-hidden="true">→</i></button>)}
      </div>
      <div className="service-panel" id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${active.number}`}>
        <div className="service-panel-media">
          {active.video ? <video key={active.video} src={active.video} poster={active.image ?? undefined} controls playsInline preload="none" aria-label={`Ejemplo de ${active.title}: ${active.example}`} /> : active.slides?.length ? <>{/* eslint-disable-next-line @next/next/no-img-element */}<img key={active.slides[slideIndex].src} src={active.slides[slideIndex].src} alt={active.slides[slideIndex].alt} /><span className="service-slide-count">{slideIndex + 1} / {active.slides.length}</span></> : active.image ? <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={active.image} alt={active.imageAlt} /></> : null}
        </div>
        <div className="service-panel-copy"><span>Ejemplo real</span><h3>{active.example}</h3><p>{active.text}</p></div>
      </div>
    </div>
  );
}
