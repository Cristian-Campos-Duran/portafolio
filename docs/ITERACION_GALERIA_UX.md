# Galería unificada y navegación progresiva · 1 octubre 2026

Se conserva la interfaz de una sola pantalla y la identidad visual aprobada. La portada mantiene su controlador audiovisual y sus MP4; únicamente cambian la frase y los CTA solicitados.

## Cambios

- Menú: Inicio, Proyectos, Servicios, Experiencia, Sobre mí y Contacto. La ruta antigua `trabajos` continúa funcionando y abre Proyectos.
- Proyectos reutiliza la galería, con nueve piezas y filtros Todos, Buena edición, UNAD, AMARED y Caso TikTok. Toda la tarjeta es interactiva. Mantiene el filtro y desplazamiento al abrir/cerrar una pieza y al regresar de un caso.
- El visor abre el resultado final. Ofrece proceso cuando existe y acceso opcional al caso. Las explicaciones extensas se conservan en una ampliación y no compiten con el visual inicial.
- Casos: Proyecto / Proceso / Resultado. Se mantienen contexto, objetivo, rol, herramientas, proceso, resultados y aprendizajes; cada dato tiene un lugar sin multiplicar pantallas.
- UNAD muestra TalentoTech, AvanzaTec, Día del Agrónomo y Actualización de datos como piezas realizadas. El carrusel general de doce imágenes se muestra en Resultado.
- Carruseles con tira continua, desplazamiento nativo y ajuste a cada imagen completa. Flechas superpuestas al visual, puntos y contador inmediatamente debajo; teclado y gesto horizontal disponibles.
- Bucle exclusivamente en los resultados finales de Buena edición y Top 3 enfermedades comunes para perros. Las grabaciones del proceso y las animaciones de portada no usan este bucle.
- Previews breves, sin sonido, solo con mouse, hover real y puntero fino. Se detienen al salir, abrir contenido o perder visibilidad. Se evita reproducir más de un preview a la vez.
- Galería móvil con miniaturas cuadradas suministradas; sin barra ni flechas de desplazamiento de la galería. Los carruseles internos sí conservan sus controles junto a la imagen.
- Textos y numeración actualizados en Servicios, Experiencia, Sobre mí y Contacto. Se mantienen los cinco ejemplos reales de Servicios.

## Recursos

`Imagenes-faltantes-formato-cuadrado.zip` aporta `Miniatura-Cuadrada-AMARED.webp` y `Miniatura-Cuadrada-TikTok.webp`. Se usan sin modificar sus bytes ni sus dimensiones (1254×1254). Inventario y SHA-256 en `recursos-octubre-01.json`. No se generaron imágenes ni se recomprimieron videos.

El MP4 corregido de TalentoTech no llegó adjunto. No se ha sustituido. La pista del archivo conservado es silenciosa; el problema no se corrige activando el volumen del reproductor.

## Revisión

Se revisaron en navegador la galería, filtros, carruseles, controles de imagen, acceso a UNAD, Resultado, Volver, historial del navegador, cierre y retorno de foco. Se comprobaron composiciones de 390×844, 768×844 y escritorio; estas revisiones no simulan Safari ni un dispositivo táctil físico.

Las pruebas de modelo comprueban filtros, conservación del resumen UNAD, enlaces anteriores, seis secciones, tres estados, bucles selectivos e integridad de las nuevas imágenes. La suite existente mantiene la validación de rutas, CV, MP4 y rangos de reproducción. Se ejecutan compilación y comprobación de tipos antes de la entrega.

## Archivos principales

`app/portfolio-app.tsx`, `app/portfolio-model.ts`, `app/gallery.css`, `app/site-data.ts`, `app/components/project-gallery.tsx`, `app/components/image-carousel.tsx`, `app/components/media-viewer.tsx` y textos de `app/home-stage.tsx`. También importaciones de CSS, pruebas, exportación y documentación.

Fuente local: `Portafolio-Cristian-Campos`. El ZIP de detalles incluye estos mismos cambios. El ZIP de videos finales de la entrega anterior sigue siendo compatible y no necesita descargarse otra vez. El CV mantiene su ruta estable.
