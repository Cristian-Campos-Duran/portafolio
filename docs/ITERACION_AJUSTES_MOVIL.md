# Ajustes de miniaturas, Servicios y Sobre mí

30 de septiembre de 2026.

## Referencias revisadas

- `Archivos(1).zip`: `Miniatura-Horizontal-Servicio_Editor.webp` y `Pagina-Celular.mp4`.
- Capturas `image(2).png` y `image(3).png`: encuadres móvil y escritorio de Sobre mí.
- Código recuperado de la versión privada 22, commit `b2fba1a362d4ee18ccd424c164184f29e0d6a195`.

## Cambios

- Buena edición utiliza la miniatura horizontal suministrada en Proyectos y Servicios para pantallas de hasta 700 px. Se conserva completa con `object-fit: contain`. La imagen es WebP de 1392 × 810; no se convirtió ni recomprimió. Las variantes anteriores se conservan.
- Servicios tiene un marco de proporción 16:9 en móvil. El botón visual se coloca dentro de ese marco con dimensiones explícitas, separando su tamaño del cálculo del texto. La información conserva scroll local cuando la altura disponible no basta.
- La miniatura del servicio seleccionado se carga inmediatamente. Las miniaturas de la galería siguen usando carga diferida y los videos permanecen bajo demanda.
- Si falla una miniatura responsive, se utiliza otra portada real de la misma pieza. El selector mantiene el control nativo accesible del teléfono y usa texto de 16 px. Su menú emergente puede verse distinto al de un navegador de escritorio.
- Sobre mí conserva la fotografía original. En escritorio el marco es menos estrecho, centrado y limitado en altura; en móvil mantiene la proporción original 2048:1365 para evitar cortar la parte superior de la cabeza. Los cambios se realizan con CSS.
- La portada audiovisual, sus videos, la navegación por escenas y la ruta del CV permanecen intactos.

## Diagnóstico y límites

La grabación muestra la composición vertical anterior de Buena edición y una miniatura vacía al seleccionar Diseño multimedia. El archivo horizontal de AMARED existe en el proyecto y respondió correctamente en la vista privada. Por tanto, no faltaba el recurso. La corrección aborda la carga diferida del visual activo y las alturas porcentuales dentro del contenedor animado, sin atribuir una causa definitiva al iPhone sin instrumentarlo.

Compilación de Sites, salida estática de GitHub Pages, comprobación de TypeScript de la aplicación activa y 33 pruebas automatizadas. Comprobación de integridad del nuevo WebP y de los recursos anteriores. La ejecución de navegadores locales estuvo limitada por dependencias y gráficos del entorno; no se presenta como una prueba de Safari ni de un iPhone físico. La revisión visual final debe realizarse en la vista privada desde el teléfono del autor.

## Archivos principales

- `app/site-data.ts`
- `app/portfolio-app.tsx`
- `app/components/media-viewer.tsx`
- `app/interface.css`
- `public/work/miniaturas/Miniatura-Horizontal-Servicio_Editor.webp`
- `docs/recursos-septiembre-30-ajustes.json`
- `scripts/export-github-browser.py`

La carpeta local principal es `Portafolio-Cristian-Campos`. La entrega para navegador conserva los siete lotes documentados en `PUBLICAR_GITHUB_Y_ACTUALIZAR_CV.md`. El paquete de videos finales no cambia; el paquete de detalles y recursos incluye esta actualización.

No se creó ni publicó un repositorio de GitHub. La vista de Sites sigue siendo privada. No hace falta otra variante de la miniatura para esta corrección.
