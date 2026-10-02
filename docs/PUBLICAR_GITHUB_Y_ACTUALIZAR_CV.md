# Publicar el portafolio desde el navegador

Actualizado: 1 de octubre de 2026, galería unificada, carruseles y casos simplificados.

Esta entrega unifica Proyectos y Trabajos, incorpora las miniaturas cuadradas de AMARED y TikTok y mejora los carruseles. TalentoTech conserva temporalmente su archivo anterior: el MP4 corregido con sonido no llegó adjunto. Si descargaste el paquete de detalles y recursos antes de esta revisión, sustitúyelo por la versión nueva. El ZIP de videos finales es compatible y no cambió.

Puedes realizar toda la publicación en github.com. No necesitas GitHub Desktop, instalar Node.js ni utilizar una terminal en tu computador. GitHub Actions construirá el sitio automáticamente.

## 1. Preparar los archivos

Descarga y descomprime **los dos ZIP** de esta entrega en la misma ubicación:

- `Portafolio-Cristian-Campos_Detalles-y-Recursos.zip`: código, imágenes, videos pequeños y grabaciones de proceso.
- `Portafolio-Cristian-Campos_Videos-para-GitHub.zip`: videos finales de mayor tamaño.

Ambos completan la carpeta `GitHub-Navegador`. Dentro encontrarás lotes numerados. Son carpetas para organizar la carga, no carpetas que deban aparecer dentro del repositorio.

No subas los ZIP directamente: GitHub no los descomprime para publicar el portafolio.

Los videos grandes están divididos en archivos `.bin` de hasta 8 MiB. Son fragmentos exactos de los originales, sin recomprimir ni cambiar resolución o formato. Durante la publicación, GitHub los reúne, comprueba su integridad y publica los MP4 completos. No tienes que unirlos manualmente.

GitHub permite hasta 25 MiB por archivo y 100 archivos por carga desde el navegador. Los lotes incluidos respetan ambos límites. La duración de cada carga depende de tu conexión.

## 2. Crear el repositorio

1. Inicia sesión en [github.com](https://github.com).
2. Pulsa **+ → New repository**.
3. Escribe un nombre, por ejemplo `portafolio-cristian-campos`.
4. Selecciona **Public** si utilizas GitHub Free. Tanto el código como los recursos que subas quedarán públicos al hacerlo.
5. Activa **Add a README file** y pulsa **Create repository**. Conserva `main` como rama principal.

El nombre del repositorio puede ser diferente: el flujo adapta automáticamente las rutas. Aún no se ha creado ningún repositorio en tu cuenta desde esta conversación.

## 3. Cargar los lotes

Utiliza un navegador de escritorio. Realiza una carga por lote, en orden; deja `07_publicar` para el final.

| Lote | Contenido |
| --- | --- |
| `01_codigo` | Aplicación, configuración, scripts y documentación |
| `02_visuales` | Primera parte de imágenes y videos pequeños |
| `03_visuales` | Resto de imágenes y recursos |
| `04_videos_finales_a` | Primera parte de los videos finales |
| `05_videos_finales_b` | Segunda parte de los videos finales |
| `06_procesos` | Grabaciones reales de las líneas de tiempo |
| `07_publicar` | Flujo automático de publicación |

Para cada lote:

1. Vuelve a la raíz del repositorio, en la pestaña **Code**.
2. Pulsa **Add file → Upload files**.
3. Abre el lote en el explorador de archivos de tu computador, selecciona **su contenido** y arrástralo a GitHub. Arrastra también las carpetas: así se conservan sus rutas internas.
4. Comprueba que los nombres comiencen por `app/`, `public/`, `media-source/`, etc. **No** deben comenzar por `01_codigo/`, `GitHub-Navegador/` ni `Portafolio-Cristian-Campos/`.
5. Espera a que termine la carga. Escribe un mensaje como `Agregar lote 02 del portafolio` y confirma con **Commit changes** en `main`.
6. Si GitHub ofrece únicamente una rama nueva, confirma allí, abre la solicitud de cambios y pulsa **Merge pull request** para incorporarla a `main`.
7. Repite con el siguiente lote.

Antes del último lote, entra en **Settings → Pages → Build and deployment → Source** y selecciona **GitHub Actions**. No necesitas seleccionar ninguna plantilla.

Ahora carga `07_publicar`. Contiene `.github/workflows/pages.yml`; esa ruta exacta es imprescindible. Si tu sistema oculta `.github`, activa “Mostrar archivos ocultos”. Como alternativa, usa **Add file → Create new file**, escribe `.github/workflows/pages.yml` como nombre y pega el contenido del archivo suministrado, sin cambiar su indentación.

No subas `node_modules`, respaldos, los ZIP, la copia interna de Sites ni la carpeta local completa. Utiliza exclusivamente el contenido de los siete lotes preparados.

## 4. Obtener el enlace

1. Entra en **Actions** y abre **Publicar portafolio**.
2. Espera a que `build` y `deploy` terminen en verde. GitHub descargará las dependencias, reunirá los videos originales y construirá la web.
3. Abre **Settings → Pages**. Allí aparecerá el enlace publicado; también aparece en el entorno `github-pages` de la ejecución.
4. Su estructura habitual será `https://TU_USUARIO.github.io/NOMBRE_DEL_REPOSITORIO/`. Es un ejemplo: copia el enlace real que GitHub te muestre.
5. Comprueba menú, Trabajos, videos, líneas de tiempo y **Descargar CV** desde ese enlace antes de incorporarlo al CV.

Si el flujo no se inicia, entra en **Actions → Publicar portafolio → Run workflow**, elige `main` y ejecútalo. Si una ejecución falla mientras faltaba un lote, termina las cargas y usa **Re-run all jobs** en la ejecución más reciente.

El proyecto conserva una única interfaz con navegación por `#proyectos`, `#trabajos`, `#caso/unad`, etc. GitHub Pages no necesita un servidor de aplicación ni redirecciones para esos enlaces.

## 5. Reemplazar el CV desde github.com

1. Guarda tu PDF definitivo como **`Cristian_David_Campos_CV.pdf`**.
2. En el repositorio, abre **`public/assets/documents`**.
3. Pulsa **Add file → Upload files** y arrastra el nuevo PDF con exactamente ese nombre.
4. Confirma el reemplazo en la misma ruta y publica el cambio en `main`.
5. Espera a que la nueva ejecución de **Publicar portafolio** termine en verde.
6. Recarga el portafolio y prueba **Descargar CV**. Si ves el documento anterior, realiza una recarga completa del navegador.

No debes modificar HTML, enlaces ni botones. El PDF se publica bajo `assets/documents/Cristian_David_Campos_CV.pdf`, dentro de la dirección del repositorio. Actualiza también ese mismo archivo en tu copia local. El botón de portada, el menú y Contacto comparten esta ruta.

## Alcance y mantenimiento

El sitio publicado incluye los MP4 originales, no depende de la vista privada de Sites. La versión de publicación tiene menos de 1 GB, que es el límite de tamaño de un sitio GitHub Pages. Pages también tiene un límite flexible de transferencia de 100 GB al mes; si el portafolio adquiere mucho tráfico audiovisual convendrá revisar el alojamiento de video.

El correo, LinkedIn y Behance siguen centralizados en `app/site-data.ts`, en `contactConfig`. Solo incorpora tus valores reales.

Las cargas posteriores de código, miniaturas o CV a `main` actualizan la web automáticamente. Los archivos `.bin` forman parte del proyecto: no los borres ni sustituyas por MP4 grandes directamente en el navegador. Para futuros cambios de video se debe preparar una nueva entrega de fragmentos verificados.

## Fuentes oficiales consultadas

- [Agregar archivos desde el navegador y límites de carga](https://docs.github.com/es/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).
- [Configurar GitHub Actions como origen de Pages](https://docs.github.com/es/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
- [Flujos personalizados de publicación](https://docs.github.com/es/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [Límites de GitHub Pages](https://docs.github.com/es/pages/getting-started-with-github-pages/github-pages-limits).
