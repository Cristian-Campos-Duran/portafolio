"use client";
import { useEffect, useRef, useState } from 'react';
import type { ShowcaseVisual } from '../site-data';
import { Icon } from './icon';

export function ImageCarousel({slides, title, onExpand}: {slides: ShowcaseVisual[]; title: string; onExpand?: () => void}) {
  const rail = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const [index, setIndex] = useState(0);
  const [ratio, setRatio] = useState(1);
  const [size, setSize] = useState<{width:number;height:number}>();
  useEffect(() => {
    const node = viewport.current; if (!node) return;
    const resize = () => { const width = Math.min(node.clientWidth, node.clientHeight * ratio); setSize({width, height: width / ratio}); };
    const observer = new ResizeObserver(resize); observer.observe(node); resize();
    return () => observer.disconnect();
  }, [ratio]);
  useEffect(() => { if (rail.current) rail.current.scrollLeft = current.current * rail.current.clientWidth; }, [size]);
  const go = (next: number) => {
    const node = rail.current; if (!node) return;
    const target = Math.max(0,Math.min(slides.length - 1,next));
    current.current = target;
    node.scrollTo({left:target * node.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  return <div className="p-image-carousel" role="region" aria-roledescription="carrusel" aria-label={title}>
    <div className="p-carousel-window" ref={viewport}>
      <div className="p-carousel-rail" ref={rail} style={size} tabIndex={0} aria-label={`Imágenes de ${title}`} onScroll={() => {
        const node = rail.current; if (!node?.clientWidth) return;
        const next = Math.round(node.scrollLeft / node.clientWidth); setIndex(next);
      }} onScrollEnd={() => { current.current = index; }} onKeyDown={e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
        else if (e.key === 'Home') { e.preventDefault(); go(0); }
        else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
      }}>
        {slides.map((slide,i) => <div className="p-carousel-slide" key={slide.src} role="group" aria-roledescription="imagen" aria-label={`${i + 1} de ${slides.length}`}><img src={slide.src} alt={slide.alt} loading={i < 2 || Math.abs(i-index) < 2 ? 'eager' : 'lazy'} draggable={false} onLoad={e => { if (i === 0) setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight); }} /></div>)}
      </div>
      {slides.length > 1 && <div className="p-carousel-arrows" style={{width:size?.width}}><button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Imagen anterior"><Icon name="back" /></button><button type="button" onClick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="Imagen siguiente"><Icon name="next" /></button></div>}
    </div>
    <div className="p-carousel-footer"><div className="p-carousel-dots" role="group" aria-label="Elegir imagen">{slides.map((slide,i) => <button key={slide.src} type="button" aria-label={`Imagen ${i + 1}`} aria-current={index === i ? 'true' : undefined} onClick={() => go(i)} />)}</div><span aria-live="polite">{index + 1} / {slides.length}</span>{onExpand && <button type="button" className="p-carousel-expand" onClick={onExpand} aria-label={`Ampliar ${title}`}><Icon name="open" /></button>}</div>
  </div>;
}
