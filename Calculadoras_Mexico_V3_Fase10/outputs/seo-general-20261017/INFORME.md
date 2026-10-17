# Mejora SEO priorizada — 17 de octubre de 2026

## Qué se aplicó

Cambios en la carpeta principal del proyecto. No se ha publicado ni enviado nada a GitHub o Vercel. Es una intervención priorizada con los exports disponibles, no una auditoría técnica completa de todas las URLs.

| URL | Mejora |
| --- | --- |
| /calculadoras/pago-quincenal.html | La respuesta sobre cuánto equivale una quincena y el ejercicio de $275 pasan de estar al final a continuación de la calculadora. Nuevos accesos directos, instrucciones específicas y enlace a la tarifa quincenal. Se elimina un bloque redundante. Se conservan título, H1, URL y motor de cálculo. |
| /articulos/isr-semanal-quincenal-mensual.html | Tres tablas completas de 2026: semanal (7 días), quincenal (15 días) y mensual; 33 renglones del Anexo 8 del SAT. Navegación directa, título y descripción acordes con el contenido, fuente oficial, alcance y fecha de revisión. Tablas desplazables con teclado y en móvil. |
| /articulos/que-es-propina.html | Título y descripción orientados a definición y ejemplos; aclaración entre importe de propina y total de la cuenta. Sincronización con el archivo alternativo que sirve Vercel. |
| /articulos/propina-obligatoria-mexico.html | Título y descripción que responden a la duda y explican la utilidad de la guía. Sincronización del archivo alternativo con el artículo, incluyendo instrucciones para cargos no autorizados. |
| /temas/nomina.html | Accesos desde la ruta de conversión a sueldo quincenal, diario y por hora, diferenciados por necesidad. |
| /temas/impuestos.html | Acceso explícito a las tablas ISR 2026 por periodo. |
| / | Ruta de sueldo con enlaces directos a neto, quincena, día y hora. |

También: `assets/css/isr-tarifas.css`, fechas de las URLs modificadas en `sitemap.xml`, dos archivos `fallback-*.html` y una prueba de navegador reproducible. No se han modificado las calculadoras de aguinaldo, salario neto, salario diario ni salario por hora. Sus mejoras anteriores se conservan.

## Datos utilizados, sin duplicarlos

Los cinco Excel tienen exactamente el mismo contenido de hojas, comprobado mediante huella SHA-256. Se usa una sola copia. Periodo: 28 de julio–16 de octubre de 2026; búsqueda Web; sin filtro de página. El ZIP de Semrush contiene 728 filas, no 728 keywords nuevas ni posiciones ganadas.

| Página | Clics | Impresiones | CTR del export | Posición media |
| --- | ---: | ---: | ---: | ---: |
| Pago quincenal | 64 | 7.493 | 0,85% | 4,78 |
| Salario diario | 30 | 4.290 | 0,70% | 5,32 |
| Salario neto | 4 | 1.429 | 0,28% | 26,55 |
| Aguinaldo | 2 | 799 | 0,25% | 55,46 |
| Qué es propina | 0 | 407 | 0% | 10,74 |
| ISR semanal/quincenal/mensual | 8 | 337 | 2,37% | 16,32 |

Se priorizó la accesibilidad del contenido existente en pago quincenal y la cobertura real de tablas en ISR. Semrush relaciona `tabla isr 2026` (volumen estimado 9,9K; posición reportada 23), `tabla isr semanal` y `calculo isr semanal` con esa guía. Las consultas GSC incluyen varias formulaciones del ejercicio de $275; ya estaba resuelto, por lo que se reordenó en vez de duplicarlo.

El export GSC no aporta una relación consulta–página para cada fila: las coincidencias temáticas no se presentan como atribución demostrada. Las posiciones de Semrush son estimaciones con fechas distintas, no sustituyen GSC ni se suman a sus métricas.

## Fuentes de verificación

- SAT: https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf — apartado B, fracciones II, IV y V. Las tablas no son un cálculo neto ni descuentan subsidio o IMSS.
- Profeco: https://www.gob.mx/profeco/prensa/la-profeco-recuerda-a-las-y-los-consumidores-que-la-propina-es-voluntaria?idiom=es
- Google Search Central: https://developers.google.com/search/docs/appearance/snippet — Google puede elegir contenido de la página para el snippet; la descripción no garantiza que se muestre literalmente.

## Comprobaciones

- 14 vistas verificadas: 7 URLs a 390 y 1440 píxeles, simulando las reescrituras de Vercel.
- Un H1 por página, canonical presente, sin IDs duplicados, sin anclas internas rotas y sin desbordamiento horizontal del documento.
- Datos estructurados de las páginas parseados correctamente y sin errores JavaScript en estas vistas.
- Cálculo quincenal probado: $8.250 mensuales → $4.125 quincenales y $275 diarios.
- 33 filas de tarifas y capturas móvil/escritorio. El desplazamiento horizontal queda contenido en cada tabla.
- Recursos locales enlazados comprobados. `/_vercel/insights/script.js` no existe localmente porque lo aporta Vercel.
- Copias alternativas de las dos guías idénticas a sus artículos principales.

Evidencia: `evidencia.json`. Pruebas: `pruebas.json`. Copias previas: `antes/`. Prueba ejecutable: `scripts/test-seo-general-20261017.cjs`.

## Publicación y medición

Los cambios están en la raíz habitual del proyecto, no únicamente en outputs. Copiar los archivos del sitio conservando las rutas, incluida la nueva hoja CSS y las dos copias alternativas; no borrar la carpeta `.git` del repositorio de destino. No publicar `outputs/`, pues contiene exports y respaldos internos. Después, revisar cambios en GitHub Desktop, hacer commit/push y comprobar el despliegue.

Registrar la fecha de publicación y comparar ventanas equivalentes de 28 días, separando página, consulta, país y dispositivo. En aguinaldo, considerar también la estacionalidad. Revisar CTR junto con posición e impresiones: un cambio en la mezcla de consultas puede bajar el CTR agregado aunque crezca el tráfico. No hay garantía de primer lugar ni de mantener todas las posiciones. Evitar cambiar repetidamente los títulos antes de poder medir.

Pendiente: auditoría técnica del sitio solicitada para después y export consulta–página para afinar la atribución. No se crearon páginas duplicadas para cada variante de keyword.
