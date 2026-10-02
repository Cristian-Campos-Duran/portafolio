"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SelectionWork } from '../site-data';
import { captionForWork, filteredWorks, projectFilters } from '../portfolio-model';
import { MediaPreview } from './media-viewer';
import { Icon } from './icon';
export function ProjectGallery({open,active}: {open:(work:SelectionWork)=>void;active:boolean}) {
  const track = useRef<HTMLDivElement>(null);
  const filterButtons = useRef<(HTMLButtonElement|null)[]>([]);
  const offsets = useRef<Record<string,number>>({});
  const [filter,setFilter] = useState('todos');
  const [position,setPosition] = useState(0);
  const [overflow,setOverflow] = useState(false);
  const [scrubbing,setScrubbing] = useState(false);
  const works = filteredWorks(filter);
  const syncPosition = useCallback(() => {
    const node = track.current; if (!node?.clientWidth || !active) return;
    const distance = node.scrollWidth - node.clientWidth;
    setOverflow(distance > 1); setPosition(distance > 1 ? Math.max(0,Math.min(1,node.scrollLeft/distance)) : 0);
    offsets.current[filter] = node.scrollLeft;
  }, [filter,active]);
  useLayoutEffect(() => { const node = track.current; if (!node || !active) return; node.scrollLeft = offsets.current[filter] ?? 0; syncPosition(); }, [filter,active,syncPosition]);
  useEffect(() => { const node = track.current; if (!node) return; const observer = new ResizeObserver(syncPosition); observer.observe(node); return () => observer.disconnect(); }, [syncPosition]);
  const move = (direction:number) => { const node = track.current; if (!node) return; const width = node.children[0]?.getBoundingClientRect().width ?? node.clientWidth; node.scrollBy({left:direction*(width+parseFloat(getComputedStyle(node).columnGap || '0')),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); };
  return <section className="p-scene p-works p-project-gallery">
    <div className="p-scene-heading"><div><p className="p-eyebrow"><span>01</span> Proyectos</p><h1 tabIndex={-1}>Trabajo seleccionado</h1></div><p>Proyectos de edición, contenido audiovisual y diseño. Selecciona una pieza para conocer más.</p></div>
    <div className="p-gallery-filterbar"><div className="p-gallery-filters" role="group" aria-label="Filtrar proyectos">{projectFilters.map((item,i) => <button ref={node => {filterButtons.current[i] = node;}} key={item.id} type="button" aria-pressed={filter === item.id} aria-controls="work-track" onClick={() => setFilter(item.id)} onKeyDown={e => {
      let next:number; if (e.key === 'ArrowRight') next=(i+1)%projectFilters.length; else if (e.key === 'ArrowLeft') next=(i+projectFilters.length-1)%projectFilters.length; else if (e.key === 'Home') next=0; else if (e.key === 'End') next=projectFilters.length-1; else return;
      e.preventDefault();setFilter(projectFilters[next].id);filterButtons.current[next]?.focus();
    }}>{item.title}</button>)}</div><span className="p-gallery-count" role="status">{works.length} {works.length === 1 ? 'pieza' : 'piezas'}</span></div>
    <div className="p-work-track p-gallery-track" id="work-track" data-scrubbing={scrubbing} ref={track} key={filter} tabIndex={0} aria-label={`Proyectos: ${projectFilters.find(item=>item.id===filter)?.title}`} onScroll={syncPosition} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}}>
      {works.map(work=><article className="p-work" key={work.id}><MediaPreview work={work} onOpen={open} active={active} className="p-work-card" label={`Ver trabajo: ${work.title}`}><span className="p-work-copy"><span className="p-work-title">{work.title}</span><span className="p-work-subtitle">{captionForWork(work)}</span></span></MediaPreview></article>)}
    </div>
    <div className="p-work-footer"><span>Edición · Contenido · Diseño</span><input className="p-work-slider" type="range" min="0" max="1000" step="1" value={Math.round(position*1000)} disabled={!overflow} aria-label="Desplazar proyectos" aria-controls="work-track" aria-valuetext={`${Math.round(position*100)} % del recorrido`} onPointerDown={()=>setScrubbing(true)} onPointerUp={()=>setScrubbing(false)} onPointerCancel={()=>setScrubbing(false)} onBlur={()=>setScrubbing(false)} onKeyDown={()=>setScrubbing(true)} onKeyUp={()=>setScrubbing(false)} onChange={e=>{const node=track.current;if(!node)return;node.scrollTo({left:Number(e.target.value)/1000*Math.max(0,node.scrollWidth-node.clientWidth),behavior:'instant'});syncPosition();}}/><div className="p-controls"><button type="button" onClick={()=>move(-1)} disabled={!overflow||position<.001} aria-label="Proyectos anteriores"><Icon name="back"/></button><button type="button" onClick={()=>move(1)} disabled={!overflow||position>.999} aria-label="Proyectos siguientes"><Icon name="next"/></button></div></div>
  </section>;
}
