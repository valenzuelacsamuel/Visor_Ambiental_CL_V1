# Contrato de Desarrollo y Bitácora del Proyecto

## 1. Visión General del Proyecto
Este documento actúa como contrato técnico, guía de arquitectura y bitácora de desarrollo para todos los agentes de Inteligencia Artificial y desarrolladores que colaboren en esta base de código.

---

## 2. Stack Tecnológico Estándar
- **Estructura:** HTML5 Semántico en documento único (SPA / Monolítico simple).
- **Estilos:** [Tailwind CSS CDN](https://cdn.tailwindcss.com) (`bg-slate-950`, tema oscuro por defecto).
- **Mapas Visores:** [MapLibre GL JS CDN](https://unpkg.com/maplibre-gl@^4.0.0/dist/maplibre-gl.js) (v4.x).
- **Lógica:** JavaScript Vanilla (KISS - Keep It Simple, Stupid).

---

## 3. Directrices y Reglas para los Agentes

> [!IMPORTANT]
> **REGLA MANDATORIA DE REGISTRO:** Cualquier agente de IA o desarrollador que realice **cualquier modificación** (creación, edición, refactorización o eliminación de archivos/código) en este proyecto **DEBE registrar obligatoriamente** la actividad en la sección **4. Bitácora de Cambios** antes de finalizar su turno.

1. **Simplicidad (KISS):** Evitar sobreingeniería, bibliotecas innecesarias o abstracciones complejas.
2. **Fondo y Estilo Base:** Mantener `bg-slate-950` y texto claro (`text-slate-100`) en el `body`.
3. **Contenedor Principal:** Mantener la estructura responsiva ocupando la pantalla completa (`h-screen w-full`).
4. **Registro Obligatorio Incondicional:** CUALQUIER cambio en el proyecto, por mínimo que sea, exige crear una entrada en la bitácora indicando fecha, agente, acciones realizadas y estado final.

---

## 4. Bitácora de Cambios (Change Log)

### [2026-09-14] - Dashboard responsivo con Bottom Sheets
- **Agente:** OpenCode (Desarrollador WebGIS Senior)
- **Acción:** Refactorización responsiva del panel de control y dashboard SINADER sin duplicar el DOM.
- **Detalles:**
  - Bajo `768px`, los paneles existentes se reutilizan como Bottom Sheets colapsables mediante `transform` y `opacity`; en escritorio conservan su disposición flotante. El panel abierto cierra el otro en móvil para liberar el mapa.
  - Se añadió un único sincronizador con `requestAnimationFrame` que ejecuta `map.resize()` y redimensiona ECharts en cambios de viewport, `visualViewport`, contenido del dashboard, toggles y fin de transición.
  - La implementación usa CSS Grid/Flexbox y media queries nativas, respeta movimiento reducido y mantiene el filtrado cruzado, los controles y la accesibilidad mediante `aria-expanded` en el mismo HTML.
- **Estado Actual:** Interfaz responsive validada mediante revisión del diff y despliegue de GitHub Pages. El visor público sirve los Bottom Sheets y el sincronizador de MapLibre/ECharts; no se duplicó el DOM.

### [2026-09-13] - Conexión de GitHub para publicación
- **Agente:** OpenCode
- **Acción:** Autenticación de GitHub CLI mediante el flujo web de código de dispositivo.
- **Detalles:** Se verificó la sesión HTTPS de la cuenta `valenzuelacsamuel`; el token autorizado cuenta con acceso para crear y publicar repositorios. Se configuró la identidad de Git solo para este repositorio con el nombre `Samuel Valenzuela` y el correo privado de GitHub. Se agregó `.gitignore` para excluir el Excel fuente `gi-sinader-2024-ckan (1).xlsx` (41,48 MB), ya que el visor funciona con los datos procesados incluidos.
- **Estado Actual:** Conexión confirmada. Git quedó instalado correctamente para el usuario en `C:\Users\samuelvalenzuela\AppData\Local\Programs\Git\cmd\git.exe`; la instalación por usuario explica que no exista en `C:\Program Files`. El repositorio local se inicializó en la rama `main` y la primera versión local fue creada. El repositorio público se creó en `https://github.com/valenzuelacsamuel/Visor_Ambiental_CL_V1`, fue vinculado como `origin` y recibió la rama `main`. GitHub Pages quedó habilitado desde `main` en la carpeta principal y publica el visor en `https://valenzuelacsamuel.github.io/Visor_Ambiental_CL_V1/`; la bitácora de publicación fue enviada al repositorio.

### [2026-08-29] - Contraste de opciones en selectores
- **Agente:** OpenCode (Arquitecto Frontend y Experto en Visualización de Datos)
- **Acción:** Corrección visual de los menús desplegables nativos.
- **Detalles:** Los `.glass-select` ahora fuerzan esquema de color oscuro y sus opciones usan fondo `#0f172a`, texto claro y selección verde coherente con el acento del visor.
- **Estado Actual:** Las opciones de filtros, exportación, geoprocesos, simbología y dashboard son legibles al desplegarse.

### [2026-08-29] - Dashboard SINADER con cross-filtering
- **Agente:** OpenCode (Arquitecto Frontend y Experto en Visualización de Datos)
- **Acción:** Implementación del dashboard interactivo client-side centrado en el mapa.
- **Detalles:**
  - Se incorporó Apache ECharts 5.5.1 por CDN, con ranking horizontal de los 19 rubros y distribución logarítmica de toneladas por establecimiento; se omitió serie temporal porque la capa agregada solo contiene 2024.
  - Un estado central compuesto por región, rubros seleccionados y métrica sincroniza MapLibre, KPIs, gráficos, exportación y geoprocesos. El filtro regional actualiza los gráficos; hacer clic en una barra alterna el rubro y filtra los puntos SINADER del mapa.
  - El panel flotante hereda variables CSS Liquid Glass, usa Canvas, tooltips mínimos y no agrega leyendas redundantes. En móvil inicia plegado para no superponerse al panel de control.
  - Se validaron filtro regional, clic de barra, cambio de métrica, carga sin errores y diseño responsive.
- **Estado Actual:** Dashboard SINADER operativo sin backend; Humedales conserva su visualización actual.

### [2026-08-29] - Propuesta analítica para dashboard SINADER
- **Agente:** OpenCode (Arquitecto Frontend y Experto en Visualización de Datos)
- **Acción:** Análisis de atributos SINADER y propuesta de visualización, sin cambios de implementación pendientes de validación.
- **Detalles:**
  - La capa contiene 9.105 establecimientos, 19 rubros y 11,54 millones de toneladas; los cinco rubros principales concentran 74,4% del volumen.
  - Se propone ranking horizontal por toneladas, composición por rubro, distribución logarítmica de toneladas por establecimiento y métricas resumidas; no se recomienda serie temporal porque la capa agregada actual solo conserva el año 2024.
  - Para la etapa aprobada se propone Apache ECharts y un estado central client-side que sincronice MapLibre y gráficos desde la misma colección filtrada.
- **Estado Actual:** Propuesta pendiente de validación del usuario; no se modificó el visor.

### [2026-08-29] - Corrección de intersección con último buffer
- **Agente:** OpenCode (Desarrollador WebGIS Senior)
- **Acción:** Corrección del filtro aplicado al buffer temporal en la intersección espacial.
- **Detalles:** El último buffer persiste en IndexedDB; el fallo ocurría porque la intersección aplicaba un segundo filtro regional a geometrías disueltas que ya no conservan el atributo `region`. El buffer ahora se consume completo, respetando el contexto con que fue generado.
- **Estado Actual:** SINADER y el último buffer pueden intersectarse con el filtro regional activo, incluso si el buffer fue generado con `dissolve`. Se validaron 74 resultados puntuales en Arica y Parinacota.

### [2026-08-29] - Simbología temática dinámica y leyenda generada
- **Agente:** OpenCode (Desarrollador WebGIS Senior)
- **Acción:** Implementación de color dinámico client-side para Humedales y SINADER mediante expresiones MapLibre.
- **Detalles:**
  - `applyDynamicColor(capa, campo, { colors })` detecta atributos numéricos y genera escalas `interpolate`; para texto genera reglas `match` por categoría. La API permite inyectar colores hexadecimales opcionales.
  - Sin colores suministrados se aplica una paleta neón de alto contraste, adecuada para el mapa oscuro: cian, lima, amarillo, coral y violeta mantienen separación perceptual sobre la base Carto Dark.
  - La leyenda desplegable se genera desde las reglas recién aplicadas al mapa; no contiene categorías ni rangos estáticos. Para proteger la UI y las expresiones del navegador, los campos textuales se limitan a 64 categorías.
  - La interfaz de selección y leyenda está separada de la lógica de MapLibre, opera sobre GeoJSON ya cargado y no requiere servidor.
  - Se validaron categorías, escalas numéricas, paletas inyectadas mediante API y la generación dinámica de la leyenda.
- **Estado Actual:** El usuario puede elegir capa y campo, aplicar colores temáticos, aportar su propia paleta y restablecer el estilo original.

### [2026-08-29] - Comando Ponytail de proyecto
- **Agente:** OpenCode (Arquitecto de Software y Desarrollador GIS Senior)
- **Acción:** Registro del comando personalizado `/pony` para controlar el nivel de optimización Ponytail.
- **Detalles:** Se creó `.opencode/commands/pony.md`, disponible como `/pony lite`, `/pony full` o `/pony ultra`.
- **Estado Actual:** El comando queda definido a nivel de proyecto y se carga al reiniciar OpenCode.

### [2026-08-29] - Intersección espacial client-side
- **Agente:** OpenCode (Arquitecto de Software y Desarrollador GIS Senior)
- **Acción:** Incorporación de un módulo asíncrono de intersección entre múltiples capas del visor.
- **Detalles:**
  - `intersection-core.js` centraliza la lógica reutilizable y `intersection-worker.js` la ejecuta fuera de la UI en GitHub Pages; `file://` usará el mismo núcleo cargado en la ventana por la restricción de Workers locales.
  - Cada entrada se valida como WGS84/EPSG:4326 antes del análisis. Se limpian vértices, se reparan auto-intersecciones simples con `unkinkPolygon` y los errores topológicos aislados se cuentan como advertencias sin abortar el resultado global.
  - La intersección Polígono-Polígono genera áreas comunes y Punto-Polígono genera puntos contenidos. Los resultados conservan la referencia `crs: EPSG:4326` para su exportación.
  - La interfaz permite marcar Humedales, SINADER y el último buffer, además de optar entre el filtro MapLibre activo y los datasets completos. El resultado se visualiza como capa azul temporal y se exporta a GeoJSON o Shapefile ZIP con `.shp`, `.shx`, `.dbf` y `.prj`.
  - Se validaron intersecciones puntuales y poligonales, sus exportaciones, y la ejecución del Worker bajo HTTP local, equivalente a GitHub Pages.
- **Estado Actual:** Módulo operativo con UI, Worker, manejo de errores topológicos, visualización temporal y exportación client-side.

### [2026-08-29] - Compatibilidad local del módulo buffer
- **Agente:** OpenCode (Desarrollador WebGIS Senior)
- **Acción:** Corrección del error de creación de `Worker` al abrir el visor mediante `file://`.
- **Detalles:**
  - En GitHub Pages (HTTPS) el buffer se mantiene en `buffer-worker.js`; al abrir el HTML localmente, Turf.js se ejecuta como fallback en el hilo principal porque los navegadores bloquean Workers con origen `null`.
  - El selector se identifica explícitamente como **Capa para procesar** y permite elegir SINADER, Humedales o Ambas capas antes de generar el área de influencia.
  - Se validó el fallback local con 74 entidades SINADER filtradas en Arica y Parinacota.
- **Estado Actual:** El geoproceso funciona tanto al abrir el archivo local como en GitHub Pages, con la capa de entrada claramente definida.

### [2026-08-29] - Geoprocesamiento client-side de áreas de influencia
- **Agente:** OpenCode (Desarrollador WebGIS Senior)
- **Acción:** Implementación de buffers paramétricos en metros con Turf.js y MapLibre GL JS, sin backend.
- **Detalles:**
  - Se añadió `buffer-worker.js`, que carga `@turf/turf@7.2.0` mediante `importScripts()` y ejecuta `buffer`, `flatten` y `dissolve` fuera del hilo principal.
  - El usuario puede elegir Humedales, SINADER o ambas capas; procesar el dataset completo o respetar el filtro MapLibre activo; y mantener polígonos individuales o disolverlos.
  - Los `MultiPolygon` se aplanan antes de `dissolve` porque Turf no admite ese tipo directamente en dicha operación.
  - El último resultado se almacena como una única entrada reemplazable en IndexedDB para evitar recálculos y crecimiento ilimitado de almacenamiento.
  - El resultado temporal se visualiza en MapLibre y puede exportarse como GeoJSON o Shapefile ZIP mediante `@mapbox/shp-write@0.4.3`.
  - Se validaron buffers individuales, restauración de IndexedDB tras recargar, ejecución con `dissolve` y ZIP con `.shp`, `.shx`, `.dbf` y `.prj`.
- **Estado Actual:** Módulo serverless preparado para GitHub Pages, con Worker asíncrono, caché local, estados de carga y exportación geoespacial.

### [2026-08-29] - Exportación conjunta de ambas capas
- **Agente:** OpenCode (Desarrollador WebGIS Senior)
- **Acción:** Adición de la opción `Ambas capas` al selector de exportación.
- **Detalles:** La descarga conjunta conserva el filtro regional, identifica cada entidad mediante la propiedad `capa` y utiliza `ambas` en el nombre del archivo.
- **Estado Actual:** Es posible exportar Humedales, SINADER o ambas capas en GeoJSON y Shapefile ZIP.

### [2026-08-29] - Selector de capa para exportación
- **Agente:** OpenCode (Desarrollador WebGIS Senior)
- **Acción:** Incorporación de selección explícita entre Humedales y SINADER antes de descargar.
- **Detalles:**
  - Los botones permanecen deshabilitados hasta escoger una capa y vuelven a calcular su disponibilidad según el filtro regional activo.
  - La exportación contiene únicamente la capa elegida y el nombre del archivo identifica capa y región, por ejemplo `visor-ambiental-humedales-chile.geojson`.
- **Estado Actual:** Las descargas GeoJSON y Shapefile son inequívocas y mantienen el filtro regional existente.

### [2026-08-29] - Exportación client-side GeoJSON y Shapefile
- **Agente:** OpenCode (Desarrollador WebGIS Senior)
- **Acción:** Incorporación de un módulo KISS de exportación para GitHub Pages, sin backend.
- **Detalles:**
  - La selección exacta se reconstruye desde los GeoJSON fuente según el filtro activo obtenido con la API nativa `map.getFilter()`, evitando la pérdida de entidades fuera del viewport que produciría `queryRenderedFeatures()`.
  - Se añadieron descargas GeoJSON nativas mediante `Blob`/`URL.createObjectURL()` y Shapefile ZIP mediante `@mapbox/shp-write@0.4.3` (`shpwrite.js`), cuyo bundle incluye JSZip.
  - El ZIP separa puntos SINADER y multipolígonos de humedales e incluye los archivos `.shp`, `.shx`, `.dbf` y `.prj` en WGS84.
  - Los controles se deshabilitan sin resultados o durante la exportación; la compresión muestra estado asíncrono, spinner accesible, confirmación y manejo de errores. Se validó el ZIP resultante con ambas capas y sus cuatro componentes Shapefile.
- **Estado Actual:** La selección nacional o regional activa puede descargarse íntegramente como `.geojson` o Shapefile `.zip` desde el navegador.

### [2026-08-29] - Visualización simultánea y filtro regional conjunto
- **Agente:** OpenCode (Desarrollador SIG)
- **Acción:** Simplificación del visor para mostrar humedales y establecimientos SINADER al mismo tiempo.
- **Detalles:**
  - Se eliminó el estado alternable entre datasets: ambas capas permanecen visibles y comparten un único filtro regional.
  - El filtro se aplica a polígonos y puntos; el zoom automático usa el bounding box combinado de ambas fuentes.
  - El panel informa humedales, establecimientos, superficie y toneladas visibles. El popup SINADER muestra las toneladas acumuladas, declaraciones y registros agregados por establecimiento.
  - La conversión normaliza las abreviaturas regionales de Aysén y O'Higgins para mantener filtros coincidentes entre fuentes.
- **Estado Actual:** Visor KISS con dos capas simultáneas, un filtro y un encuadre regional común.

### [2026-08-28] - Integración de establecimientos SINADER 2024
- **Agente:** OpenCode (Desarrollador SIG)
- **Acción:** Conversión del Excel `gi-sinader-2024-ckan (1).xlsx` a GeoJSON e integración de una capa de puntos SINADER en el visor MapLibre.
- **Detalles:**
  - Se creó `convertir-sinader.py`, que utiliza `latitud` y `longitud`, valida rangos WGS84 y genera `sinader-2024.geojson` junto con `sinader-data.js` para compatibilidad con `file://`.
  - Las 241.651 filas georreferenciadas se agregan por establecimiento y ubicación para evitar puntos coincidentes y mantener el visor liviano; se suman toneladas y se contabilizan registros y declaraciones. Se omiten 36 filas con coordenadas fuera de rango.
  - Se incorporó la pestaña SINADER, simbología de puntos, popup con atributos escapados, filtro regional, estadísticas de establecimientos y toneladas, y fuente dinámica en la barra de estado.
  - La inicialización de datos utiliza `style.load` para no depender de la descarga completa de los mosaicos del mapa base.
- **Estado Actual:** Visor ambiental preparado para alternar entre humedales y establecimientos SINADER 2024.

### [2026-08-09] - Instalación Global y Local de Ponytail (Skills & AGENTS.md)
- **Agente:** Antigravity (Lazy Senior Dev Specialist)
- **Acción:** Instalación del plugin/skill [ponytail](https://github.com/DietrichGebert/ponytail) tanto a nivel local del workspace (`.agents/`) como de forma transversal a nivel global del computador (`C:\Users\samuelvalenzuela\.gemini\config\`).
- **Detalles:**
  - Descarga e instalación de la suite completa de habilidades: `ponytail`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`, `ponytail-review`.
  - Configuración de las reglas de optimización de código (*Decision Ladder*: YAGNI, stdlib, plataforma nativa, una sola línea, código mínimo sin abstracciones innecesarias) en `AGENTS.md`.
- **Estado Actual:** Ponytail activo tanto en este proyecto como de forma transversal global para el agente.

### [2026-08-08] - Rediseño Completo UI "Liquid Glass" (Arquitectura)
- **Agente:** Antigravity (UI Architect)
- **Acción:** Rediseño integral de `index.html` bajo el sistema de diseño Apple "Liquid Glass", aplicado exclusivamente a la capa de control flotante sobre contenido opaco.
- **Detalles:**
  - **Arquitectura en dos capas:** el mapa a pantalla completa queda como contenido opaco y sin restricciones (`h-screen w-full`); todo el vidrio se reserva a los controles flotantes: toolbar superior, panel lateral, barra de estado inferior y popups.
  - **Toolbar (cápsula):** marca de la app (tile de vidrio con dot esmeralda), títulos e identificación institucional, más un control segmentado estilo tab bar (`glassEffect(.regular, in: .capsule)`) con las vistas Humedales (restaura capas) y Regiones (foco al filtro).
  - **Panel lateral:** filtro por región como `<select>` cápsula de vidrio con chevron SVG, y grilla de estadísticas (humedales visibles, superficie visible, total del país, región activa) con radios concéntricos (filas 14px dentro de panel 26px).
  - **Barra de estado inferior (cápsula):** zoom en vivo (`map.on('zoom')`), región activa y fuente (SIMBIO · MMA).
  - **Controles MapLibre restilizados como vidrio oscuro:** grupo de navegación (radius 14px, brillos internos `inset`, iconos SVG oscuros invertidos a tinte claro vía `filter: invert(1)`), atribución y escala como cápsulas translúcidas con `backdrop-filter`.
  - **Material base `.glass`:** `backdrop-filter: blur(28px) saturate(1.8)` + hairline + brillos de refracción superior/inferior (`inset` box-shadows), no frost plano. El material "lentea" el contenido inferior y su tinte se auto-ajusta para legibilidad sobre el mapa oscuro.
  - **Accesibilidad:** estados `:focus-visible` con anillo esmeralda en tabs, select, popup y controles; `prefers-reduced-transparency` (fondos sólidos, sin blur); `prefers-reduced-motion` (sin animaciones/transiciones y `flyTo`/`fitBounds` con duración 0); fallback `@supports not (backdrop-filter)` con fondo opaco para navegadores sin soporte.
  - **Nuevas capacidades:** estadísticas dinámicas de superficie (suma de `ha`) y contadores visibles/total; actualización del zoom en la barra de estado; `::selection` acorde al acento esmeralda; responsive (oculta segmentado y reduce sidebar en pantallas pequeñas).
- **Estado Actual:** Visor cartográfico completamente rediseñado con arquitectura Liquid Glass coherente y accesible; toda la funcionalidad previa preservada (filtro por región, fitBounds, popups, cursor pointer, carga híbrida sin CORS).

### [2026-08-08] - Popup de Humedales con Material "Liquid Glass" (Apple)
- **Agente:** Antigravity (Spatial Web Developer)
- **Acción:** Anulación del diseño por defecto de los Popups MapLibre e inyección de un sistema de diseño "Liquid Glass" (Apple) sobre la capa de control flotante.
- **Detalles:**
  - **Popup al clic en `humedales-fill`:** rediseño del contenido con nombre, comuna, región, superficie (ha) y enlace SIMBIO, con texto claro legible sobre vidrio oscuro (antes usaba fondo blanco/tinta oscura por defecto).
  - **Material de vidrio líquido en web:** `backdrop-filter: blur(24px) saturate(1.8)` + brillos internos por capas (`inset` box-shadows) que simulan refracción de bordes (no frost plano). El vidrio se reserva únicamente a la capa de control flotante (popup, panel lateral, controles); el contenido interno permanece opaco.
  - **Formas cápsula con radios concéntricos:** punta de popup sólida (aproximación del vidrio sobre mapa oscuro), botón de cierre circular de vidrio, badge de estado y enlace SIMBIO en píldora; borde del contenido con radio 18px.
  - **Panel lateral armonizado** al mismo material (`.glass-panel`), select como cápsula de vidrio (`.glass-control`) y chip de conteo (`.glass-chip`); `hr` atenuado.
  - **Accesibilidad:** estados `:focus-visible` con anillo esmeralda en popup, botón de cierre, select y enlaces; soporte a `prefers-reduced-transparency` (fondo sólido sin blur) y `prefers-reduced-motion` (sin animaciones/transiciones y `flyTo`/`fitBounds` con duración 0 vía JS).
- **Estado Actual:** Popup interactivo con material Liquid Glass operativo; diseño coherente, legible y accesible en toda la capa de control flotante.

### [2026-08-08] - Solución a Restricción CORS en Protocolo Local (file://)
- **Agente:** Antigravity (Spatial Web Developer)
- **Acción:** Creación de un empaquetado JavaScript (`humedales-data.js`) e implementación de estrategia de carga híbrida.
- **Detalles:**
  - **Diagnóstico:** Los navegadores web modernos bloquean peticiones `fetch()` a archivos locales cuando se abre el documento mediante doble clic directo en el explorador de archivos (`file://`).
  - **Solución:** Se empaquetó el dataset `Humedales Urbanos.geojson` en el script `humedales-data.js` que expone `window.HUMEDALES_GEOJSON`.
  - Se configuró una estrategia de carga híbrida en `index.html`: consume directamente `window.HUMEDALES_GEOJSON` si está cargado (sin peticiones AJAX/fetch que sean bloqueadas por seguridad) y mantiene `fetch()` como fallback para entornos con servidor HTTP.
- **Estado Actual:** Capa de humedales visualizable al 100% tanto abriendo el archivo HTML directamente como sirviéndolo por HTTP.

### [2026-08-08] - Panel Lateral de Filtro por Región y Zoom Automático
- **Agente:** Antigravity (Spatial Web Developer)
- **Acción:** Implementación del panel lateral de control con menú desplegable (select) para filtrado espacial por región y ajuste automático de encuadre (fitBounds).
- **Detalles:**
  - Se agregó un panel lateral flotante (`aside` con estética oscura Tailwind CSS `bg-slate-900/90 backdrop-blur-md`).
  - Se cargó dinámicamente la capa GeoJSON `Humedales Urbanos.geojson` con estilos temáticos de relleno y borde verde esmeralda (`#10b981`, `#34d399`).
  - Se poblaron dinámicamente las opciones del menú `<select id="region-select">` a partir de los atributos únicos del GeoJSON.
  - Se implementó la lógica de filtrado espacial (`map.setFilter`) y el cálculo automático del cuadro delimitador (`getFeaturesBbox`) para ejecutar un zoom suave (`map.fitBounds`) a la región seleccionada.
  - Se agregaron Popups interactivos al hacer clic sobre cualquier humedal con detalles del nombre, comuna, superficie (ha) y enlace SIMBIO.
- **Estado Actual:** Visor cartográfico interactivo con filtro por región y zoom dinámico completamente operativo.

### [2026-08-08] - Análisis Exploratorio de Datos Espaciales (Humedales Urbanos.geojson)
- **Agente:** Antigravity (Spatial Data Analyst)
- **Acción:** Inspección y extracción del esquema de atributos y metadata del dataset espacial mediante Python.
- **Detalles:**
  - Archivo analizado: `Humedales Urbanos.geojson` (107 entidades tipo `MultiPolygon`, CRS `EPSG:4326`).
  - Esquema de atributos catalogado con tipos de datos y valores de ejemplo: 11 campos (`objectid`, `region`, `comuna`, `cod_humedal`, `nombre_humedal`, `ha`, `proceso_humedal_urbano`, `resolucion`, `url_res_bcn`, `url_simbio`, `srid`).
- **Estado Actual:** Esquema de datos espacial documentado y validado para su posterior integración cartográfica.

### [2026-08-08] - Inicialización del Visor de Mapa MapLibre GL JS (CartoDB Dark + Chile)
- **Agente:** Antigravity (Spatial Web Developer)
- **Acción:** Integración de la instancia del mapa espacial en Vanilla JS.
- **Detalles:**
  - Se asignó el id `map` al contenedor a pantalla completa (`h-screen w-full`).
  - Se agregó el bloque `<script>` al final del `<body>` utilizando Vanilla JS puro.
  - Se instanció `maplibregl.Map` usando el estilo oscuro de CartoDB (`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`).
  - Se configuró el centro geográfico en Chile (`[-71.5430, -35.6751]`) con zoom inicial nivel `4`.
  - Se añadieron controles de navegación de MapLibre en la esquina superior derecha.
- **Estado Actual:** Mapa espacial completamente instanciado y desplegado a pantalla completa.

### [2026-08-07] - Establecimiento de Regla Mandatoria de Bitácora
- **Agente:** Antigravity (Frontend Expert)
- **Acción:** Incorporación explícita de la instrucción de registro obligatorio para todos los agentes.
- **Detalles:**
  - Se añadió un bloque destacado `> [!IMPORTANT]` y se reforzó la Directriz N° 4 para exigir el registro incondicional de cualquier modificación realizada por un agente en `contrato.md`.
- **Estado Actual:** Reglas del contrato fortalecidas y vigentes.

### [2026-08-07] - Inicialización del Proyecto
- **Agente:** Antigravity (Frontend Expert)
- **Acción:** Creación de la estructura base HTML5 (`index.html`) e inicialización del contrato de desarrollo (`contrato.md`).
- **Detalles:**
  - Configurados CDNs oficiales de Tailwind CSS y MapLibre GL JS en el `<head>`.
  - Estructurado el `<body>` con fondo oscuro (`bg-slate-950`), texto claro y contenedor central a pantalla completa (`h-screen w-full`).
- **Estado Actual:** Listo para integrar inicialización del mapa o UI interactiva.
