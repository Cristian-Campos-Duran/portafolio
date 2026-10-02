import { publicAsset } from "./asset-path.mjs";

export const CV_PATH = publicAsset("/assets/documents/Cristian_David_Campos_CV.pdf");

export const contactConfig = {
  email: null as string | null,
  linkedin: null as string | null,
  behance: null as string | null,
  location: "Ibagué, Colombia",
  availability: "Disponible para oportunidades remotas y colaboraciones audiovisuales",
};

export const navigation = [
  { number: "00", label: "Inicio", href: "/" },
  { number: "01", label: "Proyectos", href: "/proyectos" },
  { number: "02", label: "Servicios", href: "/servicios" },
  { number: "03", label: "Experiencia", href: "/experiencia" },
  { number: "04", label: "Sobre mí", href: "/sobre-mi" },
  { number: "05", label: "Contacto", href: "/contacto" },
];

export type ProcessItem = {
  title: string;
  text: string;
};

export type Metric = {
  value: string;
  label: string;
  target: number;
  decimals: number;
  suffix: string;
};

export type ShowcaseVisual = {
  src: string;
  alt: string;
};

export type ProjectCase = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  summary: string;
  heroLead: string;
  image: string;
  imageAlt: string;
  imageWide?: string;
  showcaseVisuals: ShowcaseVisual[];
  period?: string;
  context: string;
  objective: string;
  participation: string[];
  process: ProcessItem[];
  tools: string[];
  metrics?: Metric[];
  result?: string;
  learning?: string;
  previousSlug: string;
  nextSlug: string;
};

export const projects: ProjectCase[] = [
  {
    slug: "buena-edicion",
    number: "01",
    title: "El impacto de una buena edición",
    shortTitle: "Buena edición",
    category: "Edición de video · Motion graphics",
    summary:
      "Una lectura audiovisual del antes y el después: montaje, color, gráficos y sonido trabajando como un solo sistema.",
    heroLead:
      "Este caso hace visible cómo las decisiones de edición transforman la claridad, el ritmo y la intención de una pieza.",
    image: publicAsset("/work/miniaturas/Miniatura-Vertical-Servicio_Editor.png"),
    imageWide: publicAsset("/work/miniaturas/Miniatura-Horizontal-Servicio_Editor.webp"),
    imageAlt: "El impacto de una buena edición: comparación antes y después",
    showcaseVisuals: [
      {
        src: publicAsset("/projects/buena-edicion.jpg"),
        alt: "Fotograma del contenido antes y después de la edición",
      },
      {
        src: publicAsset("/portfolio/project-1/editor.webp"),
        alt: "Línea de tiempo, curvas de color y controles utilizados en el proceso de edición",
      },
    ],
    context:
      "Una pieza audiovisual no cambia únicamente al cortar silencios. La edición organiza la atención, construye continuidad y conecta imagen, tipografía, movimiento y sonido.",
    objective:
      "Mostrar de forma directa qué aporta una edición intencional y cómo cada capa contribuye a una experiencia final más clara y dinámica.",
    participation: [
      "Selección y ajuste de cortes",
      "Cambios de plano y construcción de ritmo",
      "Corrección de color",
      "Subtítulos y recursos gráficos",
      "Motion graphics",
      "Diseño y ajuste sonoro",
    ],
    process: [
      {
        title: "Lectura del material",
        text: "Identificación de momentos útiles, pausas, énfasis y oportunidades para ordenar la narración.",
      },
      {
        title: "Montaje",
        text: "Construcción del ritmo mediante cortes, cambios de plano y jerarquía entre la información principal y los apoyos visuales.",
      },
      {
        title: "Acabado",
        text: "Unificación de color, subtítulos, recursos gráficos, movimiento y sonido para sostener una misma intención visual.",
      },
    ],
    tools: ["Premiere Pro", "After Effects", "Photoshop"],
    result:
      "El resultado funciona como una demostración compacta del valor editorial de la postproducción, sin atribuir el cambio a un único recurso aislado.",
    learning:
      "La mejora más perceptible aparece cuando ritmo, legibilidad y sonido se deciden en conjunto desde el montaje.",
    previousSlug: "caso-tiktok",
    nextSlug: "unad",
  },
  {
    slug: "unad",
    number: "02",
    title: "Red de Egresados UNAD",
    shortTitle: "UNAD",
    category: "Contenido audiovisual · Diseño multimedia",
    summary:
      "Producción de contenidos institucionales para informar, conectar y adaptar mensajes a distintos formatos.",
    heroLead:
      "Una experiencia de trabajo continuo en la que ideación, producción audiovisual y diseño se integraron al ritmo de una red institucional.",
    image: publicAsset("/work/miniaturas/unad-cuadrada.webp"),
    imageWide: publicAsset("/work/miniaturas/unad-horizontal.webp"),
    imageAlt: "Resumen visual de contenidos desarrollados para la Red de Egresados UNAD",
    showcaseVisuals: [
      {
        src: publicAsset("/work/carruseles/unad/02_carrusel.png"),
        alt: "Pieza real del carrusel de la Red de Egresados UNAD",
      },
      {
        src: publicAsset("/work/carruseles/unad/03_carrusel.png"),
        alt: "Contenido institucional real de la Red de Egresados UNAD",
      },
    ],
    period: "Marzo–diciembre de 2024 · Marzo–diciembre de 2025",
    context:
      "La Red de Egresados UNAD requiere contenidos claros y consistentes para comunicar iniciativas, procesos y oportunidades a una comunidad diversa.",
    objective:
      "Convertir información institucional en piezas audiovisuales y gráficas comprensibles, adaptables y coherentes con cada canal.",
    participation: [
      "Ideación",
      "Guion",
      "Grabación",
      "Edición",
      "Diseño gráfico",
      "Adaptación de formatos",
      "Contenidos institucionales",
    ],
    process: [
      {
        title: "Definición del mensaje",
        text: "Síntesis de la información y organización de una estructura adecuada para cada pieza.",
      },
      {
        title: "Producción",
        text: "Grabación y construcción de recursos visuales según las necesidades del contenido.",
      },
      {
        title: "Adaptación",
        text: "Edición, diseño y ajuste de formatos para conservar claridad y consistencia entre canales.",
      },
    ],
    tools: ["Premiere Pro", "After Effects", "Photoshop", "Illustrator"],
    result:
      "El trabajo reúne piezas audiovisuales, gráficas e institucionales desarrolladas durante dos periodos de colaboración.",
    learning:
      "La comunicación institucional gana fuerza cuando la información se jerarquiza antes de diseñar o editar.",
    previousSlug: "buena-edicion",
    nextSlug: "amared",
  },
  {
    slug: "amared",
    number: "03",
    title: "AMARED",
    shortTitle: "AMARED",
    category: "Identidad · Contenido · UX/UI · Desarrollo web",
    summary:
      "Un proyecto integral que conecta marca, experiencia de pedido y operación interna en un mismo ecosistema digital.",
    heroLead:
      "AMARED comenzó como una necesidad de comunicación y operación, y evolucionó hacia una identidad y un sistema digital articulados.",
    image: publicAsset("/work/miniaturas/amared-vertical.webp"),
    imageWide: publicAsset("/work/miniaturas/amared-inaugural-horizontal.webp"),
    imageAlt: "Presentación del caso de estudio AMARED con su identidad visual",
    showcaseVisuals: [
      {
        src: publicAsset("/work/carruseles/amared/01_portada.png"),
        alt: "Portada real del carrusel AMARED",
      },
      {
        src: publicAsset("/work/carruseles/amared/02_carrusel.png"),
        alt: "Pieza real del sistema visual AMARED",
      },
    ],
    context:
      "El proyecto necesitaba presentar su propuesta con claridad y, al mismo tiempo, organizar procesos cotidianos relacionados con pedidos y producción.",
    objective:
      "Diseñar una experiencia coherente desde la identidad y el contenido hasta la interfaz de pedidos y las herramientas de operación.",
    participation: [
      "Identidad visual",
      "Contenido y dirección gráfica",
      "Arquitectura de información",
      "UX/UI",
      "Prototipado",
      "Desarrollo web",
      "Diseño del sistema interno",
    ],
    process: [
      {
        title: "Contexto y necesidad",
        text: "Lectura de los puntos de contacto y de las tareas que debían resolverse tanto para clientes como para la operación.",
      },
      {
        title: "Identidad y contenido",
        text: "Definición de un lenguaje visual amable y consistente para presentar productos, mensajes y acciones.",
      },
      {
        title: "Experiencia de pedido",
        text: "Organización del recorrido, jerarquía de información y diseño de una web orientada a realizar pedidos con claridad.",
      },
      {
        title: "Sistema interno",
        text: "Articulación de pagos, inventario, recetas, cocina, compras, perfiles y entregas en una capa operativa relacionada.",
      },
    ],
    tools: [
      "Figma",
      "Illustrator",
      "Photoshop",
      "HTML",
      "CSS",
      "JavaScript",
      "Cloudflare Worker",
      "Apps Script",
      "Google Sheets",
    ],
    result:
      "La solución se plantea como un sistema conectado: la expresión visual del proyecto y su operación digital responden a una misma lógica.",
    learning:
      "Presentar primero el problema y la experiencia permite comprender el valor del sistema antes de entrar en su implementación técnica.",
    previousSlug: "unad",
    nextSlug: "caso-tiktok",
  },
  {
    slug: "caso-tiktok",
    number: "04",
    title: "Caso TikTok",
    shortTitle: "Caso TikTok",
    category: "Contenido vertical · Estrategia creativa",
    summary:
      "Selección del momento, adaptación vertical y ritmo de edición aplicados a una pieza con alcance orgánico verificable.",
    heroLead:
      "Un caso donde reconocer el momento correcto y adaptarlo al lenguaje de la plataforma fue más importante que añadir complejidad técnica.",
    image: publicAsset("/work/miniaturas/tiktok-vertical.webp"),
    imageWide: publicAsset("/work/miniaturas/tiktok-horizontal.webp"),
    imageAlt: "Resumen visual del caso TikTok con resultados de alcance orgánico",
    showcaseVisuals: [
      {
        src: publicAsset("/work/carruseles/tiktok/01_carrusel.png"),
        alt: "Captura real de analíticas del caso TikTok",
      },
      {
        src: publicAsset("/work/carruseles/tiktok/02_carrusel.png"),
        alt: "Evidencia real del contenido vertical y sus resultados",
      },
    ],
    context:
      "El contenido vertical compite por atención desde el primer segundo. La pieza debía entenderse con rapidez y conservar el impulso del momento original.",
    objective:
      "Convertir un momento con potencial en una pieza vertical clara, rítmica y alineada con la forma en que la audiencia consume contenido en TikTok.",
    participation: [
      "Selección del momento",
      "Criterio creativo",
      "Adaptación vertical",
      "Construcción de ritmo",
      "Lectura de audiencia",
      "Edición y publicación",
    ],
    process: [
      {
        title: "Momento",
        text: "Elección de una situación con lectura inmediata y potencial para sostener la atención.",
      },
      {
        title: "Adaptación",
        text: "Reencuadre, ritmo y organización visual pensados para consumo vertical.",
      },
      {
        title: "Audiencia",
        text: "Decisiones editoriales conectadas con los códigos de la plataforma y con la respuesta del público.",
      },
    ],
    tools: ["Premiere Pro", "After Effects", "CapCut"],
    metrics: [
      { value: "1,3 M", label: "reproducciones", target: 1.3, decimals: 1, suffix: " M" },
      { value: "128,4 K", label: "likes", target: 128.4, decimals: 1, suffix: " K" },
      { value: "11,4 K", label: "guardados", target: 11.4, decimals: 1, suffix: " K" },
      { value: "3,7 K", label: "nuevos seguidores", target: 3.7, decimals: 1, suffix: " K" },
      { value: "94,7 %", label: "desde Para ti", target: 94.7, decimals: 1, suffix: " %" },
    ],
    result:
      "Los resultados evidencian una buena conexión entre selección, formato, ritmo y comprensión de audiencia.",
    learning:
      "Una idea bien leída y editada para su contexto puede ser más efectiva que una producción innecesariamente compleja.",
    previousSlug: "amared",
    nextSlug: "buena-edicion",
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);

export const unadCarouselSlides: ShowcaseVisual[] = [
  { src: publicAsset("/work/carruseles/unad/01_portada.png"), alt: "Portada del carrusel de la Red de Egresados UNAD" },
  ...Array.from({ length: 11 }, (_, index) => ({
    src: publicAsset(`/work/carruseles/unad/${String(index + 2).padStart(2, "0")}_carrusel.png`),
    alt: `Pieza ${index + 2} del carrusel de la Red de Egresados UNAD`,
  })),
];

export const amaredCarouselSlides: ShowcaseVisual[] = [
  { src: publicAsset("/work/carruseles/amared/01_portada.png"), alt: "Portada del carrusel AMARED" },
  ...Array.from({ length: 7 }, (_, index) => ({
    src: publicAsset(`/work/carruseles/amared/${String(index + 2).padStart(2, "0")}_carrusel.png`),
    alt: `Pieza ${index + 2} del carrusel AMARED`,
  })),
];

export type SelectionWork = {
  id: string;
  number: string;
  title: string;
  category: string;
  note: string;
  image: string;
  imageAlt: string;
  video?: string;
  loop?: boolean;
  poster?: string;
  imageWide?: string;
  imageTall?: string;
  imageSquare?: string;
  details?: ProcessItem[];
  format?: string;
  duration?: string;
  slides?: ShowcaseVisual[];
  timeline?: {
    video: string;
    duration: string;
    note: string;
    details: ProcessItem[];
  };
};

export const selectionWorks: SelectionWork[] = [
  {
    "number": "01",
    "details": [
      {
        "title": "Mensaje informativo",
        "text": "Presentación de formación y oportunidades en tecnología."
      },
      {
        "title": "Ritmo y jerarquía",
        "text": "Montaje y apoyos visuales que acompañan la explicación."
      },
      {
        "title": "Comunicación digital",
        "text": "Una pieza concebida para verse en pantalla móvil."
      }
    ],
    "format": "Video vertical · 9:16",
    "duration": "1:16",
    "title": "TalentoTech",
    "category": "Edición de video",
    "note": "Contenido audiovisual desarrollado durante mi experiencia en la Red de Egresados UNAD: montaje, ritmo y apoyos visuales para comunicar oportunidades de formación tecnológica.",
    "image": publicAsset("/work/miniaturas/talento-tech-cuadrada.webp"),
    "imageAlt": "Miniatura real del video TalentoTech",
    "video": publicAsset("/work/talento-tech/video-talento-tech-22d78ab4.mp4"),
    "id": "talento-tech",
    "timeline": {
      video: publicAsset("/work/proceso/talento-tech-6313a4a0.mp4"),
      duration: "1:16",
      note: "La edición de TalentoTech en Premiere Pro: línea de tiempo y monitor de programa en una misma grabación.",
      details: [{"title": "Montaje de la explicación", "text": "Los cortes organizan la intervención y sus apoyos visuales."}, {"title": "Capas gráficas", "text": "Títulos, subtítulos y elementos institucionales se distribuyen sobre la imagen."}, {"title": "Trabajo de sonido", "text": "Las pistas de voz y música acompañan el ritmo de la pieza."}]
    },
    "imageSquare": publicAsset("/work/miniaturas/talento-tech-cuadrada.webp"),
    "imageWide": publicAsset("/work/miniaturas/talento-tech-horizontal.webp"),
    "imageTall": publicAsset("/work/miniaturas/talento-tech-vertical.webp"),
    "poster": publicAsset("/work/miniaturas/talento-tech-vertical.webp")
  },
  {
    "number": "02",
    "details": [
      {
        "title": "Contenido para redes",
        "text": "Información sobre formación presentada en un formato social."
      },
      {
        "title": "Lectura del mensaje",
        "text": "Una secuencia que organiza los puntos de la explicación."
      },
      {
        "title": "Adaptación vertical",
        "text": "Encuadre y recursos de edición para el consumo desde el teléfono."
      }
    ],
    "format": "Video vertical · 9:16",
    "duration": "1:37",
    "title": "AvanzaTec",
    "category": "Contenido para redes",
    "note": "Pieza de la Red de Egresados UNAD sobre oportunidades de formación. Edición y adaptación vertical para organizar la información con claridad en redes sociales.",
    "image": publicAsset("/work/miniaturas/avanzatec-cuadrada.webp"),
    "imageAlt": "Miniatura real del video AvanzaTec",
    "video": publicAsset("/work/avanzatec/video-avanzatec-6dce154c.mp4"),
    "id": "avanzatec",
    "timeline": {
      video: publicAsset("/work/proceso/avanzatec-85a32918.mp4"),
      duration: "1:37",
      note: "El proyecto de AvanzaTec abierto en Premiere Pro permite seguir la relación entre el montaje y la pieza vertical.",
      details: [{"title": "Selección de planos", "text": "La secuencia reúne los cortes de la intervención y los cambios de encuadre."}, {"title": "Títulos y recursos", "text": "Las capas gráficas acompañan el mensaje y conservan la identidad de la pieza."}, {"title": "Voz y música", "text": "Las pistas de audio muestran la continuidad sonora del montaje."}]
    },
    "imageSquare": publicAsset("/work/miniaturas/avanzatec-cuadrada.webp"),
    "imageWide": publicAsset("/work/miniaturas/avanzatec-horizontal.webp"),
    "imageTall": publicAsset("/work/miniaturas/avanzatec-vertical.webp"),
    "poster": publicAsset("/work/miniaturas/avanzatec-vertical.webp")
  },
  {
    "number": "03",
    "details": [
      {
        "title": "Divulgación audiovisual",
        "text": "Presentación de tres temas de salud canina en una sola pieza."
      },
      {
        "title": "Estructura por temas",
        "text": "Organización del contenido para seguir cada parte de la explicación."
      },
      {
        "title": "Imagen y narración",
        "text": "Montaje de recursos visuales que acompañan el mensaje educativo."
      }
    ],
    "format": "Video vertical · 9:16",
    "duration": "0:58",
    "title": "Top 3 enfermedades comunes para perros",
    "category": "Creación audiovisual",
    "note": "Contenido educativo que combina claridad, edición dinámica y formato pensado para redes.",
    "image": publicAsset("/work/miniaturas/top3-cuadrada.webp"),
    "imageAlt": "Miniatura real del video sobre enfermedades comunes en perros",
    "video": publicAsset("/work/veterinaria/video-top3-bb359b99.mp4"),
    "id": "top3",
    "loop": true,
    "timeline": {
      video: publicAsset("/work/proceso/veterinaria-4f0d8dcd.mp4"),
      duration: "0:58",
      note: "La línea de tiempo del contenido veterinario muestra cómo se construye la explicación por temas, con imagen, texto y sonido.",
      details: [{"title": "Estructura por temas", "text": "Los cortes y apoyos visuales ordenan las tres partes de la explicación."}, {"title": "Identificación y textos", "text": "Rótulos y títulos refuerzan la información de la narradora."}, {"title": "Capas de audio", "text": "Voz y música se organizan en pistas independientes."}]
    },
    "imageSquare": publicAsset("/work/miniaturas/top3-cuadrada.webp"),
    "imageWide": publicAsset("/work/miniaturas/top3-horizontal.webp"),
    "imageTall": publicAsset("/work/miniaturas/top3-vertical.webp"),
    "poster": publicAsset("/work/miniaturas/top3-vertical.webp")
  },
  {
    "number": "04",
    "details": [
      {
        "title": "Montaje y ritmo",
        "text": "Selección de cortes y cambios de plano que construyen la secuencia."
      },
      {
        "title": "Texto y movimiento",
        "text": "Subtítulos y recursos gráficos integrados con la imagen."
      },
      {
        "title": "Acabado audiovisual",
        "text": "Color y diseño sonoro como parte de la misma propuesta."
      }
    ],
    "format": "Video vertical · 9:16",
    "duration": "0:40",
    "title": "El impacto de una buena edición",
    "category": "Motion graphics · Postproducción",
    "note": "Una demostración directa de cómo montaje, color, gráficos y sonido transforman una pieza.",
    "image": publicAsset("/work/miniaturas/buena-edicion-cuadrada.webp"),
    "imageAlt": "Miniatura real del showreel sobre buena edición",
    "video": publicAsset("/work/buena-edicion/02_video_showreel_web.mp4"),
    "id": "buena-edicion",
    "loop": true,
    "imageWide": publicAsset("/work/miniaturas/Miniatura-Horizontal-Servicio_Editor.webp"),
    "imageTall": publicAsset("/work/miniaturas/Miniatura-Vertical-Servicio_Editor.png"),
    "poster": publicAsset("/work/miniaturas/Miniatura-Vertical-Servicio_Editor.png")
  },
  {
    "id": "amared-inaugural",
    "timeline": {
      video: publicAsset("/work/proceso/amared-c475debf.mp4"),
      duration: "1:34",
      note: "La edición del video inaugural de AMARED en Premiere Pro: montaje, títulos y sonido junto al resultado en el monitor de programa.",
      details: [{"title": "Montaje narrativo", "text": "Distintos planos y recursos se encadenan para presentar la propuesta de la marca."}, {"title": "Textos en movimiento", "text": "Los títulos se integran en la secuencia y acompañan los énfasis de la narración."}, {"title": "Diseño sonoro", "text": "Las capas de voz, música y efectos se organizan a lo largo del montaje."}]
    },
    "title": "AMARED · Video inaugural",
    "category": "Diseño multimedia · Creación audiovisual",
    "note": "Una pieza de bienvenida que presenta AMARED y conecta su identidad con el contenido audiovisual de la marca.",
    "image": publicAsset("/work/miniaturas/amared-inaugural-cuadrada.webp"),
    "imageWide": publicAsset("/work/miniaturas/amared-inaugural-horizontal.webp"),
    "poster": publicAsset("/work/miniaturas/amared-inaugural-vertical.webp"),
    "imageAlt": "Miniatura del video de bienvenida de AMARED",
    "video": publicAsset("/work/amared-inaugural/video-bienvenida-amared-c611d3c8.mp4"),
    "format": "Video vertical · 9:16",
    "duration": "1:33",
    "details": [
      {
        "title": "Presentación de marca",
        "text": "Una introducción audiovisual a AMARED y su propuesta."
      },
      {
        "title": "Identidad y contenido",
        "text": "El lenguaje visual de la marca aplicado a una pieza de bienvenida."
      },
      {
        "title": "Narrativa audiovisual",
        "text": "Relación entre presentación, imagen y montaje dentro del mismo proyecto."
      }
    ],
    "number": "05",
    "imageTall": publicAsset("/work/miniaturas/amared-inaugural-vertical.webp")
  },
  {
    "id": "dia-del-agronomo",
    "title": "Día del Agrónomo",
    "category": "UNAD · Carrusel conmemorativo",
    "note": "Cuatro láminas para reconocer la labor de los profesionales de la agronomía: del homenaje inicial a su aporte al futuro, la innovación y la sostenibilidad.",
    "image": publicAsset("/work/carruseles/dia-del-agronomo/01.webp"),
    "imageAlt": "Portada Día del Agrónomo de la Red de Egresados UNAD",
    "format": "Carrusel cuadrado · 1:1",
    "slides": [
      {
        "src": publicAsset("/work/carruseles/dia-del-agronomo/01.webp"),
        "alt": "Día del Agrónomo: homenaje a quienes cuidan los recursos naturales"
      },
      {
        "src": publicAsset("/work/carruseles/dia-del-agronomo/02.webp"),
        "alt": "Sembrando el futuro: el aporte de los agrónomos a la calidad de los alimentos"
      },
      {
        "src": publicAsset("/work/carruseles/dia-del-agronomo/03.webp"),
        "alt": "Innovación y sostenibilidad en el desarrollo rural"
      },
      {
        "src": publicAsset("/work/carruseles/dia-del-agronomo/04.webp"),
        "alt": "Reconocimiento a los expertos en la ciencia de la tierra"
      }
    ],
    "details": [
      {
        "title": "Secuencia de cuatro láminas",
        "text": "Portada, aporte profesional, innovación y cierre de reconocimiento."
      },
      {
        "title": "Jerarquía gráfica",
        "text": "Titulares, fotografías y bloques breves organizan la lectura de cada mensaje."
      },
      {
        "title": "Continuidad visual",
        "text": "Paleta verde y recursos geométricos que mantienen la unidad de la publicación."
      }
    ],
    "number": "06",
    "imageTall": publicAsset("/work/miniaturas/dia-del-agronomo-vertical.webp")
  },
  {
    "id": "actualizacion-datos",
    "title": "Actualización de datos",
    "category": "UNAD · Carrusel informativo",
    "note": "Una guía gráfica de cinco láminas que explica a los egresados cómo actualizar sus datos. La pieza conserva las fechas y condiciones de la campaña original de 2024.",
    "image": publicAsset("/work/carruseles/actualizacion-datos/01.webp"),
    "imageAlt": "Portada Tres pasos para actualizar datos de egresados UNAD",
    "format": "Carrusel cuadrado · 1:1",
    "slides": [
      {
        "src": publicAsset("/work/carruseles/actualizacion-datos/01.webp"),
        "alt": "Campaña de egresados: tres pasos para actualizar datos"
      },
      {
        "src": publicAsset("/work/carruseles/actualizacion-datos/02.webp"),
        "alt": "Paso 1: ingresar a la página de la UNAD y seleccionar Egresados"
      },
      {
        "src": publicAsset("/work/carruseles/actualizacion-datos/03.webp"),
        "alt": "Paso 2: acceder con los datos de usuario y aceptar términos"
      },
      {
        "src": publicAsset("/work/carruseles/actualizacion-datos/04.webp"),
        "alt": "Paso 3: completar el formulario de actualización"
      },
      {
        "src": publicAsset("/work/carruseles/actualizacion-datos/05.webp"),
        "alt": "Cierre de la campaña original: fecha límite 31 de octubre de 2024"
      }
    ],
    "details": [
      {
        "title": "Información por pasos",
        "text": "Una acción principal por lámina permite seguir el recorrido con claridad."
      },
      {
        "title": "Apoyos visuales",
        "text": "Capturas, números e indicadores acompañan las instrucciones."
      },
      {
        "title": "Comunicación institucional",
        "text": "Identidad de la Red de Egresados y cierre con las condiciones de la campaña."
      }
    ],
    "number": "07",
    "imageTall": publicAsset("/work/miniaturas/actualizacion-datos-vertical.webp")
  },
  {
    "number": "08",
    "details": [
      {
        "title": "Comunicación institucional",
        "text": "Contenidos dirigidos a la comunidad de egresados."
      },
      {
        "title": "Jerarquía de información",
        "text": "Organización del mensaje a lo largo de la serie."
      },
      {
        "title": "Continuidad visual",
        "text": "Diseño de piezas relacionadas para una lectura en secuencia."
      }
    ],
    "format": "Serie gráfica",
    "title": "Red de Egresados UNAD",
    "category": "Carrusel institucional",
    "note": "Diseño y jerarquización de información para una comunicación institucional clara.",
    "image": publicAsset("/work/miniaturas/unad-cuadrada.webp"),
    "imageAlt": "Portada de carrusel de la Red de Egresados UNAD",
    "slides": [
      {
        "src": publicAsset("/work/carruseles/unad/01_portada.png"),
        "alt": "Portada del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/02_carrusel.png"),
        "alt": "Pieza 2 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/03_carrusel.png"),
        "alt": "Pieza 3 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/04_carrusel.png"),
        "alt": "Pieza 4 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/05_carrusel.png"),
        "alt": "Pieza 5 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/06_carrusel.png"),
        "alt": "Pieza 6 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/07_carrusel.png"),
        "alt": "Pieza 7 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/08_carrusel.png"),
        "alt": "Pieza 8 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/09_carrusel.png"),
        "alt": "Pieza 9 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/10_carrusel.png"),
        "alt": "Pieza 10 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/11_carrusel.png"),
        "alt": "Pieza 11 del carrusel de la Red de Egresados UNAD"
      },
      {
        "src": publicAsset("/work/carruseles/unad/12_carrusel.png"),
        "alt": "Pieza 12 del carrusel de la Red de Egresados UNAD"
      }
    ],
    "id": "unad",
    "imageTall": publicAsset("/work/miniaturas/unad-vertical.webp"),
    "imageWide": publicAsset("/work/miniaturas/unad-horizontal.webp")
  },
  {
    "number": "09",
    "details": [
      {
        "title": "Lenguaje de marca",
        "text": "Aplicación de la identidad visual a contenidos del proyecto."
      },
      {
        "title": "Presentación del producto",
        "text": "Relación entre imagen, mensaje y propuesta de la marca."
      },
      {
        "title": "Sistema visual",
        "text": "Piezas conectadas por una dirección gráfica común."
      }
    ],
    "format": "Serie gráfica",
    "title": "AMARED",
    "category": "Carrusel · Identidad",
    "note": "Sistema visual aplicado a contenido de marca, producto y comunicación digital.",
    "image": publicAsset("/work/carruseles/amared/01_portada.png"),
    "imageAlt": "Portada del carrusel AMARED",
    "slides": [
      {
        "src": publicAsset("/work/carruseles/amared/01_portada.png"),
        "alt": "Portada del carrusel AMARED"
      },
      {
        "src": publicAsset("/work/carruseles/amared/02_carrusel.png"),
        "alt": "Pieza 2 del carrusel AMARED"
      },
      {
        "src": publicAsset("/work/carruseles/amared/03_carrusel.png"),
        "alt": "Pieza 3 del carrusel AMARED"
      },
      {
        "src": publicAsset("/work/carruseles/amared/04_carrusel.png"),
        "alt": "Pieza 4 del carrusel AMARED"
      },
      {
        "src": publicAsset("/work/carruseles/amared/05_carrusel.png"),
        "alt": "Pieza 5 del carrusel AMARED"
      },
      {
        "src": publicAsset("/work/carruseles/amared/06_carrusel.png"),
        "alt": "Pieza 6 del carrusel AMARED"
      },
      {
        "src": publicAsset("/work/carruseles/amared/07_carrusel.png"),
        "alt": "Pieza 7 del carrusel AMARED"
      },
      {
        "src": publicAsset("/work/carruseles/amared/08_carrusel.png"),
        "alt": "Pieza 8 del carrusel AMARED"
      }
    ],
    "id": "amared-identidad",
    "imageSquare": publicAsset("/work/miniaturas/Miniatura-Cuadrada-AMARED.webp"),
    "imageTall": publicAsset("/work/miniaturas/amared-vertical.webp")
  },
  {
    "number": "10",
    "title": "Caso TikTok",
    "category": "Contenido social · Ritmo",
    "note": "Un momento de Only Up adaptado a TikTok. La pieza reúne 1,3 millones de reproducciones y permite observar el ritmo y la selección del momento que dieron forma al contenido.",
    "image": publicAsset("/projects/tiktok.png"),
    "imageAlt": "Presentación del caso TikTok y sus resultados",
    "video": publicAsset("/work/tiktok/video-viral.mp4"),
    "format": "Video vertical · 9:16",
    "duration": "1:22",
    "details": [
      {
        "title": "Selección del momento",
        "text": "Un fragmento de juego como punto de partida del contenido."
      },
      {
        "title": "Adaptación al formato",
        "text": "Encuadre vertical y ritmo para una lectura inmediata en TikTok."
      },
      {
        "title": "Resultados documentados",
        "text": "128.400 likes, 11.400 guardados, 3.700 nuevos seguidores y 94,7 % de tráfico desde Para ti."
      }
    ],
    "slides": [
      {
        "src": publicAsset("/work/carruseles/tiktok/01_carrusel.png"),
        "alt": "Evidencia 1 del caso TikTok"
      },
      {
        "src": publicAsset("/work/carruseles/tiktok/02_carrusel.png"),
        "alt": "Evidencia 2 del caso TikTok"
      },
      {
        "src": publicAsset("/work/carruseles/tiktok/03_carrusel.png"),
        "alt": "Evidencia 3 del caso TikTok"
      },
      {
        "src": publicAsset("/work/carruseles/tiktok/04_carrusel.png"),
        "alt": "Evidencia 4 del caso TikTok"
      },
      {
        "src": publicAsset("/work/carruseles/tiktok/05_carrusel.png"),
        "alt": "Evidencia 5 del caso TikTok"
      },
      {
        "src": publicAsset("/work/carruseles/tiktok/06_carrusel.png"),
        "alt": "Evidencia 6 del caso TikTok"
      },
      {
        "src": publicAsset("/work/carruseles/tiktok/07_carrusel.png"),
        "alt": "Evidencia 7 del caso TikTok"
      },
      {
        "src": publicAsset("/work/carruseles/tiktok/08_carrusel.png"),
        "alt": "Evidencia 8 del caso TikTok"
      }
    ],
    "id": "tiktok",
    "imageSquare": publicAsset("/work/miniaturas/Miniatura-Cuadrada-TikTok.webp"),
    "imageTall": publicAsset("/work/miniaturas/tiktok-vertical.webp"),
    "imageWide": publicAsset("/work/miniaturas/tiktok-horizontal.webp"),
    "poster": publicAsset("/work/miniaturas/tiktok-vertical.webp")
  }
];

export const workById = (id: string) => selectionWorks.find(work => work.id === id)!;

export const caseWorkIds: Record<string, string[]> = {
  "buena-edicion": ["buena-edicion"],
  unad: ["talento-tech", "avanzatec", "dia-del-agronomo", "actualizacion-datos"],
  amared: ["amared-inaugural", "amared-identidad"],
  "caso-tiktok": ["tiktok"],
};

export const experienceWorkIds = ["talento-tech", "dia-del-agronomo", "avanzatec"];

export type ServiceItem = {
  workId: string;
  number: string;
  title: string;
  text: string;
  example: string;
  image: string | null;
  imageAlt: string;
  video: string | null;
  slides?: ShowcaseVisual[];
};

export const primaryServices: ServiceItem[] = [
  {
    "number": "01",
    "title": "Edición de video",
    "text": "Montaje, ritmo, corrección de color, subtítulos, recursos gráficos y diseño sonoro.",
    "example": "TalentoTech",
    "image": publicAsset("/work/miniaturas/talento-tech-cuadrada.webp"),
    "imageAlt": "Miniatura real del video TalentoTech",
    "video": publicAsset("/work/talento-tech/video-talento-tech-22d78ab4.mp4"),
    "workId": "talento-tech"
  },
  {
    "number": "02",
    "title": "Contenido para redes sociales",
    "text": "Piezas verticales y horizontales adaptadas al lenguaje, duración y audiencia de cada canal.",
    "example": "AvanzaTec",
    "image": publicAsset("/work/miniaturas/avanzatec-cuadrada.webp"),
    "imageAlt": "Miniatura real del video AvanzaTec",
    "video": publicAsset("/work/avanzatec/video-avanzatec-6dce154c.mp4"),
    "workId": "avanzatec"
  },
  {
    "number": "03",
    "title": "Motion graphics",
    "text": "Movimiento tipográfico, sistemas gráficos y animación al servicio de la información.",
    "example": "El impacto de una buena edición",
    "image": publicAsset("/work/miniaturas/buena-edicion-cuadrada.webp"),
    "imageAlt": "Miniatura real del showreel sobre buena edición",
    "video": publicAsset("/work/buena-edicion/02_video_showreel_web.mp4"),
    "workId": "buena-edicion"
  },
  {
    "number": "04",
    "title": "Creación audiovisual",
    "text": "Ideación, guion, grabación y postproducción con una dirección narrativa coherente.",
    "example": "Top 3 enfermedades comunes para perros",
    "image": publicAsset("/work/miniaturas/top3-cuadrada.webp"),
    "imageAlt": "Miniatura real del video sobre enfermedades comunes en perros",
    "video": publicAsset("/work/veterinaria/video-top3-bb359b99.mp4"),
    "workId": "top3"
  },
  {
    "number": "05",
    "title": "Diseño multimedia",
    "text": "Soluciones visuales que conectan contenido, interacción y tecnología.",
    "example": "AMARED · Video inaugural",
    "image": publicAsset("/work/miniaturas/amared-inaugural-cuadrada.webp"),
    "imageAlt": "Miniatura del video de bienvenida de AMARED",
    "video": publicAsset("/work/amared-inaugural/video-bienvenida-amared-c611d3c8.mp4"),
    "workId": "amared-inaugural"
  }
];

export const secondaryCapabilities = [
  "Diseño gráfico",
  "UX/UI",
  "Figma",
  "Desarrollo web",
  "IA aplicada a procesos creativos",
];

export const toolGroups = [
  {
    label: "Edición y movimiento",
    items: ["Premiere Pro", "After Effects", "CapCut", "DaVinci Resolve"],
  },
  {
    label: "Diseño y experiencia",
    items: ["Photoshop", "Illustrator", "Figma", "WordPress"],
  },
  {
    label: "Web y 3D",
    items: ["HTML", "CSS", "JavaScript", "Blender"],
  },
];

export const tools = toolGroups.flatMap((group) => group.items);

export const education = [
  "Maestría en Diseño de Experiencia de Usuario · UNAD · En curso",
  "Ingeniería Multimedia · UNAD · Grado de Honor",
  "Formación técnica · SENA",
];
