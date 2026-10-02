import { projects, caseWorkIds, workById } from './site-data.ts';
import type { SelectionWork } from './site-data.ts';
export const sections = ['inicio','proyectos','servicios','experiencia','sobre-mi','contacto'];
export const caseTabs = ['Proyecto','Proceso','Resultado'];
export const projectFilters = [{id:'todos',title:'Todos'},{id:'buena-edicion',title:'Buena edición'},{id:'unad',title:'UNAD'},{id:'amared',title:'AMARED'},{id:'caso-tiktok',title:'Caso TikTok'}];
const galleryOrder = ['buena-edicion','talento-tech','amared-inaugural','tiktok','avanzatec','top3','dia-del-agronomo','actualizacion-datos','amared-identidad'];
export function normalizeView(path: string) {
  let clean: string;
  try { clean = decodeURIComponent(path.replace(/^#\/?/, '').replace(/^\//, '').replace(/\/$/, '')); } catch { return 'inicio'; }
  if (!clean) return 'inicio';
  if (clean === 'trabajos') return 'proyectos';
  if (sections.includes(clean)) return clean;
  const slug = clean.replace(/^(proyectos|caso)\//, '');
  return projects.some(p => p.slug === slug) ? `caso/${slug}` : 'inicio';
}
export function filteredWorks(filter: string) { return galleryOrder.filter(id => filter === 'todos' || caseWorkIds[filter]?.includes(id)).map(workById); }
export function projectForWork(id: string) { return projects.find(p => caseWorkIds[p.slug].includes(id) || id === 'unad' && p.slug === 'unad'); }
const summaries: Record<string,string> = {
  'talento-tech':'Edición y adaptación audiovisual de contenido institucional para redes sociales.',
  avanzatec:'Contenido de la Red de Egresados UNAD: información sobre formación adaptada al ritmo y la lectura de redes sociales.',
  'buena-edicion':'Una pieza que demuestra cómo el ritmo, el sonido y los recursos gráficos transforman una edición.',
  'amared-inaugural':'Contenido audiovisual desarrollado como parte de la identidad y comunicación digital de AMARED.',
  'amared-identidad':'Identidad, contenido y experiencia digital: una mirada al proyecto multidisciplinario de AMARED.',
  tiktok:'Selección del momento, ritmo y adaptación vertical para un contenido que alcanzó 1,3 millones de reproducciones.',
  top3:'Contenido educativo veterinario: una explicación organizada con imagen, voz y apoyos gráficos.',
  'dia-del-agronomo':'Carrusel conmemorativo para la Red de Egresados UNAD, con una composición visual que conecta sus piezas.',
  'actualizacion-datos':'Información institucional organizada en un carrusel para orientar la actualización de datos de egresados.',
  unad:'Resumen de mi participación y del contenido audiovisual y gráfico realizado para la Red de Egresados UNAD.'
};
export function summaryForWork(work: SelectionWork) { return summaries[work.id] ?? work.note; }
export function captionForWork(work: SelectionWork) {
  if (work.id === 'tiktok') return 'Edición · 1,3 M de reproducciones';
  if (['dia-del-agronomo','actualizacion-datos'].includes(work.id)) return 'Diseño gráfico · UNAD';
  const project = projectForWork(work.id);
  return project ? `${work.category.split(" · ")[0]} · ${project.shortTitle}` : work.category;
}
export function shouldLoop(work: SelectionWork, mode: string) { return mode === 'video' && work.loop === true; }
